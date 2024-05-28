import { NextFunction, Request, RequestHandler, Response } from 'express'
import { omit } from 'lodash'
import HTTP_STATUS from '~/constants/httpStatus'
import { ErrorWithStatus } from '~/exceptions/Error'

export const wrapRequestHandler = (func: RequestHandler) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await func(req, res, next)
    } catch (error) {
      next(error)
    }
  }
}

export const defaultErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ErrorWithStatus) {
    return res.status(err.status).json(omit(err, ['status']))
  }
  Object.getOwnPropertyNames(err).forEach((key) => {
    Object.defineProperty(err, key, { enumerable: true })
  })
  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    message: err.message,
    errorInfo: omit(err, ['stack'])
  })
}

export const okHandler = (req: Request, res: Response, data: any) => {
  return res.status(HTTP_STATUS.OK).json({
    success: true,
    data: data
  })
}

export const okHandlerPagination = (req: Request, res: Response, data: any) => {
  return res.status(HTTP_STATUS.OK).json(data)
}

export const createdHandler = (req: Request, res: Response, data: any) => {
  return res.status(HTTP_STATUS.CREATED).json({
    success: true,
    message: 'Resource created successfully.',
    data: data
  })
}

export const noContentHandler = (req: Request, res: Response) => {
  return res.status(HTTP_STATUS.NO_CONTENT).send()
}

export const notModifiedHandler = (req: Request, res: Response) => {
  return res.status(HTTP_STATUS.NOT_MODIFIED).send()
}

export const badRequestHandler = (req: Request, res: Response, data?: any) => {
  return res.status(HTTP_STATUS.BAD_REQUEST).json({
    error: 'Bad Request',
    message: 'Your request is invalid.',
    errors: data
  })
}

export const unauthorizedHandler = (req: Request, res: Response) => {
  return res.status(HTTP_STATUS.UNAUTHORIZED).json({
    error: 'Unauthorized',
    message: 'You are not authorized to access this resource.'
  })
}

export const notFoundHandler = (req: Request, res: Response, message?: string) => {
  return res.status(HTTP_STATUS.NOT_FOUND).json({
    error: 'Not Found',
    message: message || 'The requested resource could not be found.'
  })
}

export const internalServerErrorHandler = (req: Request, res: Response) => {
  return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    error: 'Internal Server Error',
    message: 'Something went wrong on the server.'
  })
}
