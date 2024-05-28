import { checkSchema } from 'express-validator'
import { ARTICLE_MESSAGES } from '~/constants/messages'
import { REGEX } from '~/constants/regex'
import { Category } from '~/models/category.model'
import { validate } from '~/utils/validation'

export const createAdminArticleValidator = validate(
  checkSchema(
    {
      title: {
        notEmpty: {
          errorMessage: ARTICLE_MESSAGES.TITLE_IS_REQUIRED
        },
        isString: {
          errorMessage: ARTICLE_MESSAGES.INVALID_TITLE
        }
      },
      content: {
        notEmpty: {
          errorMessage: ARTICLE_MESSAGES.CONTENT_IS_REQUIRED
        },
        isString: {
          errorMessage: ARTICLE_MESSAGES.INVALID_CONTENT
        }
      },
      address: {
        isString: {
          errorMessage: ARTICLE_MESSAGES.INVALID_ADDRESS
        }
      },
      anticipated_price: {
        custom: {
          options: (value) => REGEX.ONLY_NUMBER.test(value) || value === null,
          errorMessage: ARTICLE_MESSAGES.INVALID_ANTICIPATED_PRICE
        }
      },
      banners: {
        isArray: {
          errorMessage: ARTICLE_MESSAGES.INVALID_BANNERS
        }
      },
      categories: {
        isArray: {
          errorMessage: ARTICLE_MESSAGES.INVALID_CATEGORIES
        },
        custom: {
          options: async (value: string[]) => {
            if (!value?.length) throw new Error(ARTICLE_MESSAGES.CATEGORIES_IS_REQUIRED)
            const categories = await Category.find({ _id: { $in: value } })

            if (categories.length !== value.length) throw new Error(ARTICLE_MESSAGES.INVALID_CATEGORIES)
            return true
          }
        }
      }
    },
    ['body']
  )
)

export const createUserAppointmentValidator = validate(
  checkSchema(
    {
      title: {
        notEmpty: {
          errorMessage: ARTICLE_MESSAGES.APPOINTMENT.TITLE_REQUIRED
        },
        isString: true
      },
      planned_date: {
        notEmpty: {
          errorMessage: ARTICLE_MESSAGES.APPOINTMENT.DATE_REQUIRED
        }
      },
      anticipated_price: {
        optional: true,
        matches: {
          options: [REGEX.ONLY_NUMBER],
          errorMessage: ARTICLE_MESSAGES.APPOINTMENT.INVALID_ANTICIPATED_PRICE_REQUIRED
        }
      },
      'participants.*.email': {
        isString: {
          errorMessage: ARTICLE_MESSAGES.APPOINTMENT.EMAIL_PARTICIPANT_REQUIRED
        }
      },
      'location.province': {
        notEmpty: {
          errorMessage: ARTICLE_MESSAGES.APPOINTMENT.PROVINCE_REQUIRED
        },
        isString: true
      },
      'location.district': {
        notEmpty: {
          errorMessage: ARTICLE_MESSAGES.APPOINTMENT.DISTRICT_REQUIRED
        },
        isString: true
      },
      'location.ward': {
        notEmpty: {
          errorMessage: ARTICLE_MESSAGES.APPOINTMENT.WARD_REQUIRED
        },
        isString: true
      },
      'location.address': {
        isString: true,
        optional: true
      },
      is_public: {
        isString: true,
        optional: true
      },
      status: {
        isString: true,
        optional: true
      },
      notes: {
        isString: true,
        optional: true
      }
    },
    ['body']
  )
)
