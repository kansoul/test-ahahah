import { checkSchema } from 'express-validator'
import { ADDRESS_MESSAGES } from '~/constants/messages'
import { validate } from '~/utils/validation'

export const getDistrictsByProvinceCodeValidator = validate(
  checkSchema(
    {
      province_code: {
        notEmpty: {
          errorMessage: ADDRESS_MESSAGES.PROVINCE_CODE_IS_REQUIRED
        }
      }
    },
    ['query']
  )
)

export const getWardsByDistrictCodeValidator = validate(
  checkSchema(
    {
      district_code: {
        notEmpty: {
          errorMessage: ADDRESS_MESSAGES.DISTRICT_CODE_IS_REQUIRED
        }
      }
    },
    ['query']
  )
)
