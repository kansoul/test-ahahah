import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { ObjectId } from 'mongodb'
import { pagination } from '~/bases/pagination'
import { ParticipantInvitationStatus, UserVerifyStatus } from '~/constants/enums'
import HTTP_STATUS from '~/constants/httpStatus'
import { APPOINTMENT_MESSAGES, USERS_MESSAGES } from '~/constants/messages'
import { Appointment } from '~/models/appointment.model'
import { Participant } from '~/models/participant.model'
import { RefreshToken } from '~/models/refreshToken.model'
import {
  ForgotPasswordReqBody,
  ResetPasswordReqBody,
  TokenPayload,
  VerifyForgotPasswordReqBody
} from '~/models/requests/User.requests'
import { User } from '~/models/user.model'
import usersService from '~/services/users.services'
import { RegisterReqBody } from '~/types/requests/users'
import { verifyPassword } from '~/utils/crypto'
import {
  badRequestHandler,
  internalServerErrorHandler,
  notFoundHandler,
  okHandler,
  okHandlerPagination
} from '~/utils/handlers'

export const loginController = async (req: Request, res: Response) => {
  const { email, password } = req.body
  try {
    const user = await User.findOne({ email })

    if (user === null) return notFoundHandler(req, res, USERS_MESSAGES.USER_NOT_FOUND)

    const isMatchedPassword = verifyPassword(password, user.password as string)

    if (!isMatchedPassword)
      return res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).json({
        message: USERS_MESSAGES.INCORRECT_PASSWORD
      })

    const user_id = user._id as ObjectId

    const result = await usersService.login(user_id.toString())

    await RefreshToken.create({ user_id: new ObjectId(user_id), token: result.refresh_token })

    return okHandler(req, res, result)
  } catch (error) {
    return internalServerErrorHandler(req, res)
  }
}

export const registerController = async (req: Request<ParamsDictionary, any, RegisterReqBody>, res: Response) => {
  try {
    const result = await usersService.register(req.body)
    return okHandler(req, res, result)
  } catch (error: any) {
    if (error?.name === 'ValidationError') {
      const errors: any = {}
      Object.keys(error?.errors).forEach((key) => {
        errors[key] = error.errors[key].message
      })
      return badRequestHandler(req, res, errors)
    }
    return internalServerErrorHandler(req, res)
  }
}

export const getMeController = async (req: Request, res: Response, next: NextFunction) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const result = await usersService.getMe(user_id)
  return okHandler(req, res, result)
}

export const getAllEmailController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const keyword = req.query?.email || ''

    const result = await usersService.getAllEmail(keyword as string)
    return okHandler(req, res, result)
  } catch (error: any) {
    return internalServerErrorHandler(req, res)
  }
}

export const verifyEmailController = async (req: Request, res: Response, next: NextFunction) => {
  const { user_id } = req.decoded_email_verify_token as TokenPayload

  const user = await User.findOne({
    _id: new ObjectId(user_id)
  })

  if (!user) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      message: USERS_MESSAGES.USER_NOT_FOUND
    })
  }
  // Đã verify rồi thì mình sẽ không báo lỗi
  // Mà mình sẽ trả về status OK với message là đã verify trước đó rồi
  if (user.email_verify_token === '') {
    return res.json({
      message: USERS_MESSAGES.EMAIL_ALREADY_VERIFIED_BEFORE
    })
  }
  const result = await usersService.verifyEmail(user_id)
  return res.json({
    message: USERS_MESSAGES.EMAIL_VERIFY_SUCCESS,
    result
  })
}

export const updateUserController = async (req: Request, res: Response, next: NextFunction) => {
  const { user_id } = req.decoded_authorization as TokenPayload

  const result = await usersService.updateUser(user_id, req.body)
  return okHandler(req, res, result)
}

export const changePasswordController = async (req: Request, res: Response, next: NextFunction) => {
  const { new_password } = req.body
  const { user_id } = req.decoded_authorization as TokenPayload

  await usersService.updateUser(user_id, { password: new_password })

  return okHandler(req, res, {})
}

export const resendVerifyEmailController = async (req: Request, res: Response, next: NextFunction) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const user = await User.findOne({ _id: new ObjectId(user_id) })
  if (!user) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      message: USERS_MESSAGES.USER_NOT_FOUND
    })
  }
  if (user.verify === UserVerifyStatus.Verified) {
    return res.json({
      message: USERS_MESSAGES.EMAIL_ALREADY_VERIFIED_BEFORE
    })
  }
  const result = await usersService.resendVerifyEmail(user_id, user.email)
  return res.json(result)
}

export const forgotPasswordController = async (
  req: Request<ParamsDictionary, any, ForgotPasswordReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { _id, email } = req.user

  const result = await usersService.forgotPassword((_id as ObjectId).toString(), email)
  return res.json(result)
}

export const verifyForgotPasswordController = async (
  req: Request<ParamsDictionary, any, VerifyForgotPasswordReqBody>,
  res: Response,
  next: NextFunction
) => {
  return res.json({
    message: USERS_MESSAGES.VERIFY_FORGOT_PASSWORD_SUCCESS
  })
}

export const resetPasswordController = async (
  req: Request<ParamsDictionary, any, ResetPasswordReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { user_id } = req.decoded_forgot_password_token as TokenPayload
  const { password } = req.body
  const result = await usersService.resetPassword(user_id, password)
  return res.json(result)
}

export const acceptInvitationController = async (req: Request<ParamsDictionary, any, any>, res: Response) => {
  try {
    const userId = req.decoded_authorization.user_id

    const { appointment_id } = req.body

    const appointment = await Appointment.findById(new ObjectId(appointment_id)).populate({
      path: 'participants',
      populate: {
        path: 'user'
      }
    })

    if (!appointment) return notFoundHandler(req, res, APPOINTMENT_MESSAGES.NOT_FOUND)

    const participantIds = appointment.participants.map((item) => item._id)

    const participant = await Participant.findOne({
      user: new ObjectId(userId),
      _id: { $in: participantIds }
    })

    if (!participant) {
      return notFoundHandler(req, res, 'Invitation not found')
    }

    if (participant.status === ParticipantInvitationStatus.Accepted) {
      return badRequestHandler(req, res, 'Invitation already accepted')
    }

    participant.status = ParticipantInvitationStatus.Accepted

    participant.save()

    return okHandler(req, res, {})
  } catch (error: any) {
    return internalServerErrorHandler(req, res)
  }
}

export const getMyAppointmentListController = async (
  req: Request<ParamsDictionary, any, ResetPasswordReqBody>,
  res: Response
) => {
  try {
    const userId = req.decoded_authorization.user_id

    const query = { organizer: { $in: userId } }

    const populateFields = [
      {
        path: 'inspired_by_article',
        select: 'title anticipated_price banners'
      },
      {
        path: 'participants',
        populate: {
          path: 'user'
        }
      },
      { path: 'location.province', select: 'name' },
      { path: 'location.district', select: 'name' },
      { path: 'location.ward', select: 'name' },
      { path: 'organizer', select: 'name' }
    ]

    const appointments = await pagination(req, Appointment, '', query, populateFields)

    return okHandlerPagination(req, res, appointments)
  } catch (error) {
    internalServerErrorHandler(req, res)
  }
}

export const getListInvitationController = async (
  req: Request<ParamsDictionary, any, ResetPasswordReqBody>,
  res: Response
) => {
  try {
    const userId = req.decoded_authorization.user_id

    const participants = await Participant.find({
      user: new ObjectId(userId)
    })

    if (!participants.length) return okHandlerPagination(req, res, { data: [], pagination: {} })

    const participantIds = participants.map((participant) => participant._id)

    const query = {
      is_public: true,
      organizer: { $ne: userId },
      participants: { $in: participantIds }
    }

    const populateFields = [
      {
        path: 'inspired_by_article',
        select: 'title anticipated_price banners'
      },
      {
        path: 'participants',
        populate: {
          path: 'user'
        }
      },
      { path: 'location.province', select: 'name' },
      { path: 'location.district', select: 'name' },
      { path: 'location.ward', select: 'name' },
      { path: 'organizer', select: 'name' }
    ]

    const appointments = await pagination(req, Appointment, '', query, populateFields)

    return okHandlerPagination(req, res, appointments)
  } catch (error) {
    internalServerErrorHandler(req, res)
  }
}
