import { checkSchema } from 'express-validator'
import { ARTICLE_MESSAGES } from '~/constants/messages'
import { REGEX } from '~/constants/regex'
import { validate } from '~/utils/validation'

export const updateAppointmentValidator = validate(
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
      'feedbacks.*': {
        isString: {
          errorMessage: ARTICLE_MESSAGES.APPOINTMENT.INVALID_FEEDBACK
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

export const updateFeedbackAppointmentValidator = validate(
  checkSchema(
    {
      'feedbacks.*': {
        isString: {
          errorMessage: ARTICLE_MESSAGES.APPOINTMENT.INVALID_FEEDBACK
        }
      }
    },
    ['body']
  )
)
