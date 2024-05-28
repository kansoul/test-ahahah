import { Router } from 'express'
import { Role } from '~/constants/enums'
import { adminLoginController, getListUsers } from '~/controllers/admin.users.controllers'
import { adminUsersPaginationValidator } from '~/middlewares/admin.users.middlewares'
import { permissionsMiddleware } from '~/middlewares/permissions.middlewares'
import { accessTokensValidator, adminLoginValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'
const adminsUsersRouter = Router()

/**
 * Description: Login
 * Path: /login
 * Method: POST
 * Body: {email: '', password: ''}
 */
adminsUsersRouter.post('/login', adminLoginValidator, wrapRequestHandler(adminLoginController))

/**
 * Description: Get list of users
 * Path: /admins/users
 * Method: Get
 * Params: { limit: number, page: number}
 * Body: {}
 * Response: { next: { limit: number, page: number}, previous: { limit: number, page: number}, data: UserData }
 */
adminsUsersRouter.get(
  '/',
  accessTokensValidator,
  permissionsMiddleware(Role.Admin),
  adminUsersPaginationValidator,
  wrapRequestHandler(getListUsers)
)

export default adminsUsersRouter
