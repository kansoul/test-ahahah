import { Router } from 'express'
import { uploadImageController } from '~/controllers/medias.controllers'
import { accessTokensValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'
const mediasRouter = Router()

mediasRouter.post(
  '/upload-image',
  accessTokensValidator,
  // verifiedUserValidator,
  wrapRequestHandler(uploadImageController)
)

export default mediasRouter
