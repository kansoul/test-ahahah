import { Request, Response } from 'express'
import { ObjectId } from 'mongodb'
import { pagination } from '~/bases/pagination'
import HTTP_STATUS from '~/constants/httpStatus'
import { FAVORITE_MESSAGE } from '~/constants/messages'
import { Favorite } from '~/models/favourite.model'
import favoriteService from '~/services/favorites.services'
import { internalServerErrorHandler, notFoundHandler, okHandler, okHandlerPagination } from '~/utils/handlers'

export const getListFavoriteController = async (req: Request, res: Response) => {
  try {
    const populateOptions = [
      { path: 'user', select: '_id name' },
      {
        path: 'article',
        populate: [
          { path: 'author', select: '_id name' },
          { path: 'categories', select: '_id name' },
          { path: 'province', select: '_id name code' },
          { path: 'district', select: '_id name code' },
          { path: 'ward', select: '_id name code' }
        ]
      }
    ]
    const queryFilter = { user: req.decoded_authorization.user_id }

    const results = await pagination(req, Favorite, '', queryFilter, populateOptions)

    return okHandlerPagination(req, res, results)
  } catch (error) {
    return internalServerErrorHandler(req, res)
  }
}

export const createFavoriteController = async (req: Request, res: Response) => {
  try {
    const { article_id } = req.body

    const existFavorite = await Favorite.findOne({
      user: new ObjectId(req.decoded_authorization.user_id),
      article: new ObjectId(article_id)
    })

    if (existFavorite)
      return res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).json({
        error: 'Error',
        message: FAVORITE_MESSAGE.EXIST
      })

    const body = {
      user: req.decoded_authorization.user_id,
      article: article_id
    }

    const favorite = await favoriteService.create(body)

    return okHandler(req, res, favorite)
  } catch (error) {
    return internalServerErrorHandler(req, res)
  }
}

export const deleteFavouriteController = async (req: Request, res: Response) => {
  try {
    const favoriteId = req.params

    const favorite = await Favorite.findOne({ _id: new ObjectId(favoriteId as any) })

    if (!favoriteId) return notFoundHandler(req, res, FAVORITE_MESSAGE.NOT_FOUND)

    await Favorite.findOneAndDelete({ _id: new ObjectId(favorite?._id) })

    return okHandler(req, res, {})
  } catch (error) {
    return internalServerErrorHandler(req, res)
  }
}
