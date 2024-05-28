import { ObjectId } from 'mongodb'
import { Role, TokenType, UserVerifyStatus } from '~/constants/enums'
import { USERS_MESSAGES } from '~/constants/messages'
import { RefreshToken } from '~/models/refreshToken.model'
import { User } from '~/models/user.model'
import { RegisterReqBody } from '~/types/requests/users'
import { hashPassword } from '~/utils/crypto'
import { sendForgotPasswordEmail, sendVerifyRegisterEmail } from '~/utils/email'
import { signToken } from '~/utils/jwt'
import addressService from './address.services'

class UsersService {
  private signAccessAndRefreshToken(user_id: string) {
    return Promise.all([this.signAccessToken(user_id), this.signRefreshToken(user_id)])
  }

  private signAccessToken(user_id: string) {
    return signToken({
      payload: {
        user_id,
        token_type: TokenType.AccessToken
      },
      options: {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN
      },
      privateKey: process.env.JWT_SECRET_ACCESS_TOKEN as string
    })
  }

  private signRefreshToken(user_id: string) {
    return signToken({
      payload: {
        user_id,
        token_type: TokenType.RefreshToken
      },
      options: {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN
      },
      privateKey: process.env.JWT_SECRET_REFRESH_TOKEN as string
    })
  }

  private signEmailVerifyToken(user_id: string) {
    return signToken({
      payload: {
        user_id,
        token_type: TokenType.EmailVerifyToken
      },
      privateKey: process.env.JWT_SECRET_EMAIL_VERIFY_TOKEN as string,
      options: {
        expiresIn: process.env.EMAIL_VERIFY_TOKEN_EXPIRES_IN
      }
    })
  }

  private signForgotPasswordToken(user_id: string) {
    return signToken({
      payload: {
        user_id,
        token_type: TokenType.ForgotPasswordToken
      },
      privateKey: process.env.JWT_SECRET_FORGOT_PASSWORD_TOKEN as string,
      options: {
        expiresIn: process.env.FORGOT_PASSWORD_TOKEN_EXPIRES_IN
      }
    })
  }

  async register(payload: RegisterReqBody) {
    const user_id = new ObjectId()
    const email_verify_token = await this.signEmailVerifyToken(user_id.toString())

    await User.create({
      ...payload,
      _id: user_id,
      email_verify_token,
      verify: UserVerifyStatus.Unverified,
      password: hashPassword(payload.password),
      role: Role.User
    })

    const [access_token, refresh_token] = await this.signAccessAndRefreshToken(user_id.toString())

    // token
    await RefreshToken.create({ user_id, token: refresh_token })

    await sendVerifyRegisterEmail(payload.email, email_verify_token)

    return {
      access_token,
      refresh_token
    }
  }

  async checkEmailExist(email: string) {
    const user = await User.findOne({ email })
    return Boolean(user)
  }

  async login(user_id: string) {
    const [access_token, refresh_token] = await this.signAccessAndRefreshToken(user_id)
    return {
      access_token,
      refresh_token
    }
  }

  async getMe(user_id: string) {
    const user = await User.findOne(
      { _id: new ObjectId(user_id) },
      {
        projection: {
          password: 0,
          email_verify_token: 0,
          forgot_password_token: 0
        }
      }
    )
      .populate('province', 'name code')
      .populate('district', 'name code province_code')
      .populate('ward', 'name code district_code')
      .exec()
    return user
  }

  async verifyEmail(user_id: string) {
    const [token] = await Promise.all([
      this.signAccessAndRefreshToken(user_id),
      User.updateOne(
        { _id: new ObjectId(user_id) },
        {
          $set: {
            email_verify_token: '',
            verify: UserVerifyStatus.Verified,
            updated_at: new Date()
          }
        }
      )
    ])
    const [access_token, refresh_token] = token
    return {
      access_token,
      refresh_token
    }
  }

  async updateUser(userId: string, body: any) {
    const user = await User.findOne({ _id: new ObjectId(userId) })

    if (!user) throw Error(USERS_MESSAGES.USER_NOT_FOUND)

    const formattedBody = { ...body }

    if (formattedBody.password) formattedBody.password = hashPassword(formattedBody.password)
    if (formattedBody.gender) formattedBody.gender = Number(formattedBody.gender)
    if (formattedBody.province) {
      const province = await addressService.getProvinceByProvinceByCode(formattedBody.province)
      formattedBody.province = province?._id
    }

    if (formattedBody.district) {
      const district = await addressService.getDistrictByDistrictCode(formattedBody.district)
      formattedBody.district = district?._id
    }

    if (formattedBody.ward) {
      const ward = await addressService.getWardByWardCode(formattedBody.ward)
      formattedBody.ward = ward?._id
    }

    await User.updateOne({ _id: new ObjectId(userId) }, [{ $set: { ...formattedBody } }])

    const updatedUser = await this.getMe(userId)

    return updatedUser
  }

  async resendVerifyEmail(user_id: string, email?: string) {
    const email_verify_token = await this.signEmailVerifyToken(user_id)

    await User.updateOne(
      { _id: new ObjectId(user_id) },
      {
        $set: {
          email_verify_token
        },
        $currentDate: {
          updated_at: true
        }
      }
    )

    if (email) {
      await sendVerifyRegisterEmail(email, email_verify_token)
    }

    return {
      message: USERS_MESSAGES.RESEND_VERIFY_EMAIL_SUCCESS
    }
  }

  async forgotPassword(user_id: string, email?: string) {
    const forgot_password_token = await this.signForgotPasswordToken(user_id)

    await User.updateOne({ _id: new ObjectId(user_id) }, [
      {
        $set: {
          forgot_password_token,
          updated_at: '$$NOW'
        }
      }
    ])

    if (email) {
      await sendForgotPasswordEmail(email, forgot_password_token)
    }

    return {
      message: USERS_MESSAGES.CHECK_EMAIL_TO_RESET_PASSWORD
    }
  }

  async resetPassword(user_id: string, password: string) {
    await User.updateOne(
      { _id: new ObjectId(user_id) },
      {
        $set: {
          forgot_password_token: '',
          password: hashPassword(password)
        },
        $currentDate: {
          updated_at: true
        }
      }
    )
    return {
      message: USERS_MESSAGES.RESET_PASSWORD_SUCCESS
    }
  }

  async getAllEmail(keyword?: string) {
    const query: any = {}

    if (keyword) {
      query.email = { $regex: keyword, $options: 'i' }
    }

    const users = await User.find(query, 'email _id').exec()

    return users
  }
}

const usersService = new UsersService()
export default usersService
