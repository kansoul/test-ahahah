import { Request, Response } from 'express'
import { ObjectId } from 'mongodb'
import { APPOINTMENT_MESSAGES } from '~/constants/messages'
import { Appointment } from '~/models/appointment.model'
import appointmentService from '~/services/appointment.services'
import { internalServerErrorHandler, notFoundHandler, okHandler } from '~/utils/handlers'

export const getDetailAppointmentController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const populate = [
      {
        path: 'inspired_by_article',
        select: 'title anticipated_price banners'
      },
      {
        path: 'participants',
        populate: {
          path: 'user'
        }
      },
      { path: 'location.province', select: 'name code' },
      { path: 'location.district', select: 'name code' },
      { path: 'location.ward', select: 'name code' },
      { path: 'organizer', select: 'name _id' }
    ]

    const appointment = await Appointment.findOne({ _id: new ObjectId(id) }).populate(populate)

    if (!appointment) return notFoundHandler(req, res, APPOINTMENT_MESSAGES.NOT_FOUND)

    return okHandler(req, res, appointment)
  } catch (error) {
    return internalServerErrorHandler(req, res)
  }
}

export const updateAppointmentController = async (req: Request, res: Response) => {
  try {
    const { id: appointmentId } = req.params
    const userId = req.decoded_authorization.user_id

    const appointment = await Appointment.findOne({ _id: new ObjectId(appointmentId) })

    if (!appointment) return notFoundHandler(req, res, APPOINTMENT_MESSAGES.NOT_FOUND)
    if (appointment.organizer._id.toString() !== userId)
      return notFoundHandler(req, res, APPOINTMENT_MESSAGES.INVALID_ORGANIZER)

    const result = await appointmentService.updateAppointment(new ObjectId(appointment._id), {
      ...req.body,
      inspired_by_article: new ObjectId(appointment.inspired_by_article._id),
      organizer: new ObjectId(userId)
    })

    return okHandler(req, res, result)
  } catch (error) {
    return internalServerErrorHandler(req, res)
  }
}

export const updateFeedbackAppointmentController = async (req: Request, res: Response) => {
  try {
    const { id: appointmentId } = req.params
    const userId = req.decoded_authorization.user_id

    const appointment = await Appointment.findOne({ _id: new ObjectId(appointmentId) })

    if (!appointment) return notFoundHandler(req, res, APPOINTMENT_MESSAGES.NOT_FOUND)
    if (appointment.organizer._id.toString() !== userId)
      return notFoundHandler(req, res, APPOINTMENT_MESSAGES.INVALID_ORGANIZER)

    const result = await appointmentService.updateFeedbackAppointment(new ObjectId(appointment._id), {
      ...req.body
    })

    return okHandler(req, res, result)
  } catch (error) {
    return internalServerErrorHandler(req, res)
  }
}
