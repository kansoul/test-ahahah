import { checkSchema } from 'express-validator'
import { CATEGORIES_MESSAGES } from '~/constants/messages'
import { validate } from '~/utils/validation'

export const createCategoryValidator = validate(
  checkSchema(
    {
      name: {
        notEmpty: {
          errorMessage: CATEGORIES_MESSAGES.NAME_IS_REQUIRED
        },
        isString: {
          errorMessage: CATEGORIES_MESSAGES.INVALID_NAME
        }
      },

      description: {
        isString: {
          errorMessage: CATEGORIES_MESSAGES.INVALID_DESCRIPTION
        }
      }
    },
    ['body']
  )
)
