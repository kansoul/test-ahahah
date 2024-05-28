import { Router } from 'express'
import {
  createUserAppointmentController,
  getDetailArticleController,
  getListArticleController,
  getListArticleHomeController
} from '~/controllers/articles.controllers'
import { createUserAppointmentValidator } from '~/middlewares/articles.middlewares'
import { accessTokensValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'
const usersArticlesRouter = Router()

usersArticlesRouter.get('/', accessTokensValidator, wrapRequestHandler(getListArticleController))

usersArticlesRouter.get('/home', accessTokensValidator, wrapRequestHandler(getListArticleHomeController))

usersArticlesRouter.get('/:id', accessTokensValidator, wrapRequestHandler(getDetailArticleController))

usersArticlesRouter.post(
  '/:id/create-appointment',
  accessTokensValidator,
  createUserAppointmentValidator,
  wrapRequestHandler(createUserAppointmentController)
)

export default usersArticlesRouter
