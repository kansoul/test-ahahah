import { Request, Response } from 'express'
import { ObjectId } from 'mongodb'
import HTTP_STATUS from '~/constants/httpStatus'
import { CATEGORIES_MESSAGES } from '~/constants/messages'
import { Category } from '~/models/category.model'
import categoryService from '~/services/categories.services'
import { internalServerErrorHandler, notFoundHandler, okHandler, okHandlerPagination } from '~/utils/handlers'

export const getListCategoryController = async (req: Request, res: Response) => {
  try {
    const results = await Category.find({})
    okHandlerPagination(req, res, results)
  } catch (error) {
    internalServerErrorHandler(req, res)
  }
}

export const getCategoryDetailController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const category = await Category.findOne({ _id: new ObjectId(id) })

    if (category === null) return notFoundHandler(req, res, CATEGORIES_MESSAGES.NOT_FOUND)

    okHandlerPagination(req, res, category)
  } catch (error) {
    internalServerErrorHandler(req, res)
  }
}

export const createCategoryController = async (req: Request, res: Response) => {
  const { name, description } = req.body
  try {
    const category = await Category.findOne({ name })

    if (category !== null)
      return res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).json({
        error: 'Already exist!',
        message: CATEGORIES_MESSAGES.EXIST
      })

    const newCategory = await categoryService.create({ name, description })

    return okHandler(req, res, newCategory)
  } catch (error) {
    return internalServerErrorHandler(req, res)
  }
}

export const editCategoryController = async (req: Request, res: Response) => {
  const { name, description } = req.body
  const { id } = req.params

  try {
    const category = await Category.findOne({ _id: new ObjectId(id) })

    if (category === null) return notFoundHandler(req, res, CATEGORIES_MESSAGES.NOT_FOUND)

    const newCategory = await categoryService.update(req.params.id, { name, description })

    return okHandler(req, res, newCategory)
  } catch (error) {
    return internalServerErrorHandler(req, res)
  }
}
