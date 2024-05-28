import { Router } from 'express'
import { Role } from '~/constants/enums'
import {
  createCategoryController,
  editCategoryController,
  getCategoryDetailController,
  getListCategoryController
} from '~/controllers/admin.categories.controllers'
import { createCategoryValidator } from '~/middlewares/categories.middlewares'
import { permissionsMiddleware } from '~/middlewares/permissions.middlewares'
import { accessTokensValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'
const adminsCategoriesRouter = Router()

/**
 * Description: Create category
 * Path: /api/v1/admin/categories
 * Method: POST
 * Body:
 */
adminsCategoriesRouter.post(
  '/',
  accessTokensValidator,
  permissionsMiddleware(Role.Admin),
  createCategoryValidator,
  wrapRequestHandler(createCategoryController)
)

adminsCategoriesRouter.put(
  '/:id',
  accessTokensValidator,
  permissionsMiddleware(Role.Admin),
  createCategoryValidator,
  wrapRequestHandler(editCategoryController)
)

/**
 * Description: Get list of categories
 * Path: /
 * Method: Get
 * Params: { limit: number, page: number}
 * Body: {}
 * Response: { next: { limit: number, page: number}, previous: { limit: number, page: number}, data: UserData }
 */
adminsCategoriesRouter.get(
  '/',
  accessTokensValidator,
  permissionsMiddleware(Role.Admin),
  wrapRequestHandler(getListCategoryController)
)

adminsCategoriesRouter.get(
  '/:id',
  accessTokensValidator,
  permissionsMiddleware(Role.Admin),
  wrapRequestHandler(getCategoryDetailController)
)

export default adminsCategoriesRouter
