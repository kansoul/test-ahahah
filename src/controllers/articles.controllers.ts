import { Request, Response } from 'express'
import { ObjectId } from 'mongodb'
import { pagination } from '~/bases/pagination'
import { ARTICLE_MESSAGES } from '~/constants/messages'
import { Article } from '~/models/article.model'
import articleService from '~/services/articles.services'
import favoriteService from '~/services/favorites.services'
import { internalServerErrorHandler, notFoundHandler, okHandler, okHandlerPagination } from '~/utils/handlers'

export const createArticleController = async (req: Request, res: Response) => {
  try {
    const body = { ...req.body, author: req.decoded_authorization.user_id }
    const article = await articleService.createArticle(body)

    return okHandler(req, res, article)
  } catch (error) {
    return internalServerErrorHandler(req, res)
  }
}

export const updateArticleController = async (req: Request, res: Response) => {
  try {
    const articleId = req.params.id

    const existArticle = await Article.findById(articleId)

    if (!existArticle) return notFoundHandler(req, res, ARTICLE_MESSAGES.NOT_FOUND)

    const body = { ...req.body, author: req.decoded_authorization.user_id }

    const article = await articleService.updateArticle(req.params.id, body)

    return okHandler(req, res, article)
  } catch (error) {
    return internalServerErrorHandler(req, res)
  }
}

export const getListArticleController = async (req: Request, res: Response) => {
  try {
    let query = {}
    const categoryId = req.query.categoryId

    if (categoryId) {
      query = {
        categories: { $eq: categoryId }
      }
    }

    const populateOptions = [
      { path: 'author', select: '_id name' },
      { path: 'categories', select: '_id name' },
      { path: 'province', select: '_id name code' },
      { path: 'district', select: '_id name code' },
      { path: 'ward', select: '_id name code' }
    ]

    const results = await pagination(req, Article, '', query, populateOptions)

    okHandlerPagination(req, res, results)
  } catch (error) {
    return internalServerErrorHandler(req, res)
  }
}

export const getDetailArticleController = async (req: Request, res: Response) => {
  try {
    const articleId = req.params.id

    const existArticle = await Article.findById(articleId)

    if (!existArticle) return notFoundHandler(req, res, ARTICLE_MESSAGES.NOT_FOUND)

    const result = await articleService.getArticleById(articleId)
    const favorite = await favoriteService.getByArticleIdAndUserId(req.decoded_authorization.user_id, articleId)

    return okHandler(req, res, { ...result?.toObject(), favorite })
  } catch (error) {
    return internalServerErrorHandler(req, res)
  }
}

export const createUserAppointmentController = async (req: Request, res: Response) => {
  try {
    const { id: articleId } = req.params

    const existArticle = await Article.findById(articleId)

    if (!existArticle) return notFoundHandler(req, res, ARTICLE_MESSAGES.NOT_FOUND)

    const result = await articleService.createAppointment({
      ...req.body,
      inspired_by_article: existArticle._id,
      organizer: new ObjectId(req.decoded_authorization.user_id)
    })

    return okHandler(req, res, result)
  } catch (error) {
    return internalServerErrorHandler(req, res)
  }
}

export const getListArticleHomeController = async (req: Request, res: Response) => {
  try {
    const select = '-categories'
    const results = await articleService.getListArticleHome(req.query, select)

    return okHandler(req, res, results)
  } catch (error) {
    return internalServerErrorHandler(req, res)
  }
}
