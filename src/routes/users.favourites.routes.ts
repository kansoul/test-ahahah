import { Router } from 'express'
import {
  createFavoriteController,
  deleteFavouriteController,
  getListFavoriteController
} from '~/controllers/favorites.controllers'
import { accessTokensValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

const usersFavoritesRouter = Router()

usersFavoritesRouter.get('/', accessTokensValidator, wrapRequestHandler(getListFavoriteController))
usersFavoritesRouter.post('/', accessTokensValidator, wrapRequestHandler(createFavoriteController))
usersFavoritesRouter.delete('/:id', accessTokensValidator, wrapRequestHandler(deleteFavouriteController))

export default usersFavoritesRouter
