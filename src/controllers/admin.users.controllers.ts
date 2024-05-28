import { Request, Response } from 'express'
import { ObjectId } from 'mongodb'
import { pagination } from '~/bases/pagination'
import { Role } from '~/constants/enums'
import HTTP_STATUS from '~/constants/httpStatus'
import { USERS_MESSAGES } from '~/constants/messages'
import { RefreshToken } from '~/models/refreshToken.model'
import { User } from '~/models/user.model'
import usersService from '~/services/users.services'
import { verifyPassword } from '~/utils/crypto'
import { internalServerErrorHandler, notFoundHandler, okHandler, okHandlerPagination } from '~/utils/handlers'

export const getListUsers = async (req: Request, res: Response) => {
  try {
    const { email = '', verify } = req.query

    const results = await pagination(req, User, '-password -email_verify_token', {
      $text: { $search: email }
    })

    okHandlerPagination(req, res, results)
  } catch (error) {
    internalServerErrorHandler(req, res)
  }
}

export const adminLoginController = async (req: Request, res: Response) => {
  const { email, password } = req.body
  try {
    const user = await User.findOne({ email })

    if (user === null || user.role !== Role.Admin) return notFoundHandler(req, res, USERS_MESSAGES.USER_NOT_FOUND)

    const isMatchedPassword = verifyPassword(password, user.password as string)

    if (!isMatchedPassword)
      return res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).json({
        message: USERS_MESSAGES.INCORRECT_PASSWORD
      })

    const user_id = user._id as ObjectId

    const result = await usersService.login(user_id.toString())

    await RefreshToken.create({ user_id: new ObjectId(user_id), token: result.refresh_token })

    return okHandler(req, res, { ...result, user })
  } catch (error) {
    return internalServerErrorHandler(req, res)
  }
}
