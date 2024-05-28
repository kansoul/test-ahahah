import { Router } from 'express'
import { getCommentListController } from '~/controllers/comments.controllers'
import { accessTokensValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'
const commentsRouter = Router()

commentsRouter.get('/', accessTokensValidator, wrapRequestHandler(getCommentListController))

export default commentsRouter
