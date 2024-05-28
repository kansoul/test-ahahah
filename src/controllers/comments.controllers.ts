import { NextFunction, Request, Response } from 'express'
import { ObjectId } from 'mongodb'
import { pagination } from '~/bases/pagination'
import { COMMENT_MESSAGE } from '~/constants/messages'
import { Article } from '~/models/article.model'
import { Comment } from '~/models/comment.model'
import { internalServerErrorHandler, notFoundHandler, okHandler } from '~/utils/handlers'

export const getCommentListController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { articleId } = req.query

    if (!articleId) return notFoundHandler(req, res, COMMENT_MESSAGE.NOT_FOUND_ARTICLE)

    const article = await Article.findOne({ _id: new ObjectId(articleId as string) })

    if (!article) return notFoundHandler(req, res, COMMENT_MESSAGE.NOT_FOUND_ARTICLE)

    const populateOptions = [
      { path: 'article', select: '_id title' },
      { path: 'author', select: '_id name avatar username' }
    ]

    const results = await pagination(req, Comment, '', {}, populateOptions)

    return okHandler(req, res, results)
  } catch (error) {
    return internalServerErrorHandler(req, res)
  }
}
