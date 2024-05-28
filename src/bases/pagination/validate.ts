import { checkSchema } from 'express-validator'
import { validate } from '~/utils/validation'

export const paginationValidator = validate(
  checkSchema(
    {
      limit: {
        isNumeric: true,
        optional: true
      },
      page: {
        isNumeric: true,
        optional: true
      },
      email: {
        isString: true,
        optional: true
      },
      verify: {
        isNumeric: true,
        optional: true
      }
    },
    ['query']
  )
)
