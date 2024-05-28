import { NextFunction, Request, Response } from 'express'
import { Role } from '~/constants/enums'
import { USERS_MESSAGES } from '~/constants/messages'
import { User } from '~/models/user.model'
import { internalServerErrorHandler, notFoundHandler, unauthorizedHandler } from '~/utils/handlers'

export const permissionsMiddleware = function (role: Role) {
  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      const decodedAuthorization = req.decoded_authorization

      if (!decodedAuthorization) return unauthorizedHandler(req, res)

      const user = await User.findById(decodedAuthorization.user_id)
      if (!user) return notFoundHandler(req, res, USERS_MESSAGES.USER_NOT_FOUND)

      return user.role === role ? next() : unauthorizedHandler(req, res)
    } catch (error: any) {
      internalServerErrorHandler(req, res)
    }
  }
}
