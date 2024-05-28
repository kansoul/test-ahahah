import { Router } from 'express'
import { Role } from '~/constants/enums'
import {
  createArticleController,
  getDetailArticleController,
  getListArticleController,
  updateArticleController
} from '~/controllers/articles.controllers'
import { createAdminArticleValidator } from '~/middlewares/articles.middlewares'
import { permissionsMiddleware } from '~/middlewares/permissions.middlewares'
import { accessTokensValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'
const adminsArticlesRouter = Router()

/**
 * Description: Create category
 * Path: /api/v1/admin/categories
 * Method: POST
 * Body:
 */
adminsArticlesRouter.post(
  '/',
  accessTokensValidator,
  permissionsMiddleware(Role.Admin),
  createAdminArticleValidator,
  wrapRequestHandler(createArticleController)
)

adminsArticlesRouter.put(
  '/:id',
  accessTokensValidator,
  permissionsMiddleware(Role.Admin),
  createAdminArticleValidator,
  wrapRequestHandler(updateArticleController)
)

/**
 * Description: Get list of categories
 * Path: /
 * Method: Get
 * Params: { limit: number, page: number}
 * Body: {}
 * Response: { next: { limit: number, page: number}, previous: { limit: number, page: number}, data: UserData }
 */
adminsArticlesRouter.get(
  '/',
  accessTokensValidator,
  permissionsMiddleware(Role.Admin),
  wrapRequestHandler(getListArticleController)
)

adminsArticlesRouter.get(
  '/:id',
  accessTokensValidator,
  permissionsMiddleware(Role.Admin),
  wrapRequestHandler(getDetailArticleController)
)

export default adminsArticlesRouter
