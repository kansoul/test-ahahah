import { Router } from 'express'
import {
  acceptInvitationController,
  changePasswordController,
  forgotPasswordController,
  getAllEmailController,
  getListInvitationController,
  getMeController,
  getMyAppointmentListController,
  loginController,
  registerController,
  resendVerifyEmailController,
  resetPasswordController,
  updateUserController,
  verifyEmailController,
  verifyForgotPasswordController
} from '~/controllers/users.controllers'
import {
  accessTokensValidator,
  changePasswordValidator,
  emailVerifyTokenValidator,
  forgotPasswordValidator,
  loginValidator,
  registerValidator,
  resetPasswordValidator,
  updateProfileValidator,
  verifyForgotPasswordTokenValidator
} from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'
const usersRouter = Router()

usersRouter.post('/login', loginValidator, wrapRequestHandler(loginController))

/**
 * Description: Register new user
 * Path: /register
 * Method: POST
 * Body: { email: string, password: string, confirm_password: string, date_of_birth: ISO8601}
 *
 */
usersRouter.post('/register', registerValidator, wrapRequestHandler(registerController))

/**
 * Description: Logout user
 * Path: /logout
 * Method: POST
 * Headers: { Authorization: Bearer <access token>}
 * Body: {refresh_token: string}
 */
usersRouter.post(
  '/logout',
  accessTokensValidator,
  wrapRequestHandler((req, res) => {
    res.status(200).json({ message: 'Logout success' })
  })
)

/**
 * Description: Get my profile
 * Path: /me
 * Method: GET
 * Header: { Authorization: Bearer <access_token> }
 */
usersRouter.get('/me', accessTokensValidator, wrapRequestHandler(getMeController))

/**
 * Description. Verify email when user client click on the link in email
 * Path: /verify-email
 * Method: POST
 * Body: { email_verify_token: string }
 */
usersRouter.post('/verify-email', emailVerifyTokenValidator, wrapRequestHandler(verifyEmailController))

/**
 * Description: Change Password
 * Path: /change-password
 * Method: Post
 * Header: { Authorization: Bearer <access_token> }
 */
usersRouter.post(
  '/change-password',
  accessTokensValidator,
  changePasswordValidator,
  wrapRequestHandler(changePasswordController)
)

/**
 * Description. Verify email when user client click on the link in email
 * Path: /resend-verify-email
 * Method: POST
 * Header: { Authorization: Bearer <access_token> }
 * Body: {}
 */
usersRouter.post('/resend-verify-email', accessTokensValidator, wrapRequestHandler(resendVerifyEmailController))

/**
 * Description. Submit email to reset password, send email to user
 * Path: /forgot-password
 * Method: POST
 * Body: {email: string}
 */
usersRouter.post('/forgot-password', forgotPasswordValidator, wrapRequestHandler(forgotPasswordController))

/**
 * Description. Verify link in email to reset password
 * Path: /verify-forgot-password
 * Method: POST
 * Body: {forgot_password_token: string}
 */
usersRouter.post(
  '/verify-forgot-password',
  verifyForgotPasswordTokenValidator,
  wrapRequestHandler(verifyForgotPasswordController)
)

/**
 * Description: Reset password
 * Path: /reset-password
 * Method: POST
 * Body: {forgot_password_token: string, password: string, confirm_password: string}
 */
usersRouter.post('/reset-password', resetPasswordValidator, wrapRequestHandler(resetPasswordController))

usersRouter.put('/me', accessTokensValidator, updateProfileValidator, wrapRequestHandler(updateUserController))

usersRouter.get('/email', accessTokensValidator, wrapRequestHandler(getAllEmailController))

usersRouter.get('/invitations', accessTokensValidator, wrapRequestHandler(getListInvitationController))

usersRouter.post('/accept-invite', accessTokensValidator, wrapRequestHandler(acceptInvitationController))

usersRouter.get('/my-appointments', accessTokensValidator, wrapRequestHandler(getMyAppointmentListController))

export default usersRouter
