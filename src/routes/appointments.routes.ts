import { Router } from 'express'
import {
  getDetailAppointmentController,
  updateAppointmentController,
  updateFeedbackAppointmentController
} from '~/controllers/appointments.controllers'

import { updateAppointmentValidator, updateFeedbackAppointmentValidator } from '~/middlewares/appointment.middlewares'
import { accessTokensValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'
const appointmentsRouter = Router()

appointmentsRouter.get('/:id', accessTokensValidator, wrapRequestHandler(getDetailAppointmentController))
appointmentsRouter.put(
  '/:id/update',
  accessTokensValidator,
  updateAppointmentValidator,
  wrapRequestHandler(updateAppointmentController)
)
appointmentsRouter.put(
  '/:id/update-feedbacks',
  accessTokensValidator,
  updateFeedbackAppointmentValidator,
  wrapRequestHandler(updateFeedbackAppointmentController)
)

export default appointmentsRouter
