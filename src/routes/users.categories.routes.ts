import { Router } from 'express'
import { getListCategoryController } from '~/controllers/admin.categories.controllers'
import { wrapRequestHandler } from '~/utils/handlers'

const usersCategoriesRouter = Router()

usersCategoriesRouter.get('/', wrapRequestHandler(getListCategoryController))

export default usersCategoriesRouter
