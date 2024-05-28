import { checkSchema } from 'express-validator'
import { validate } from '~/utils/validation'

export const adminUsersPaginationValidator = validate(
  checkSchema(
    {
      limit: {
        isNumeric: true,
        optional: true
      },
      page: {
        isNumeric: true,
        optional: true
      }
    },
    ['query']
  )
)
