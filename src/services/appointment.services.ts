import { ObjectId } from 'mongodb'
import { ParticipantInvitationStatus } from '~/constants/enums'
import { Appointment } from '~/models/appointment.model'
import { Participant } from '~/models/participant.model'
import { User } from '~/models/user.model'
import { CreateAppointmentReqBody } from '~/types/requests/articles'
import { sendParticipantEmail } from '~/utils/email'
import addressService from './address.services'

class AppointmentService {
  async updateAppointment(appointmentId: ObjectId, body: Partial<CreateAppointmentReqBody>) {
    let sendMailParticipants: any[] = []
    const currentAppointment = await Appointment.findOne({ _id: appointmentId }).populate({
      path: 'participants',
      populate: {
        path: 'user'
      }
    })

    const currentParticipantIds = currentAppointment?.participants.map((item) => item._id)

    const formattedBody: any = { ...body }

    if (formattedBody.location?.province) {
      const province = await addressService.getProvinceByProvinceByCode(formattedBody.location.province)
      formattedBody.location.province = province?._id as any
    }

    if (formattedBody.location?.district) {
      const district = await addressService.getDistrictByDistrictCode(formattedBody.location.district)
      formattedBody.location.district = district?._id
    }

    if (formattedBody.location?.ward) {
      const ward = await addressService.getWardByWardCode(formattedBody.location.ward)
      formattedBody.location.ward = ward?._id
    }

    if (formattedBody?.participants?.length > 0) {
      await Participant.deleteMany({ _id: { $in: currentParticipantIds } })

      const participantEmails = formattedBody.participants.map((item: any) => item.email)
      const participantUsers = await User.find({ email: { $in: participantEmails } }, '-password')

      const participantsData = participantUsers.map((user) => {
        const participantStatus = formattedBody.participants.find((item: any) => item.email === user.email)?.status
        return {
          user: user._id,
          status: participantStatus || ParticipantInvitationStatus.Waiting
        }
      })

      const participants = await Participant.insertMany(participantsData)
      const participantIds = participants.map((item: any) => item._id)
      formattedBody.participants = participantIds

      sendMailParticipants = await Participant.find({
        _id: { $in: participantIds },
        status: ParticipantInvitationStatus.Waiting
      }).populate({ path: 'user' })
    }

    const appointment = await Appointment.findByIdAndUpdate(appointmentId, formattedBody, { new: true }).populate([
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
      { path: 'location.province', select: 'name' },
      { path: 'location.district', select: 'name' },
      { path: 'location.ward', select: 'name' },
      { path: 'organizer', select: 'name' }
    ])

    if (sendMailParticipants.length > 0) {
      sendMailParticipants.forEach((item: any) => {
        sendParticipantEmail(item.user.email, item.user, appointment)
      })
    }

    return appointment
  }

  async updateFeedbackAppointment(appointmentId: ObjectId, body: Partial<CreateAppointmentReqBody>) {
    const feedbacks = body.feedback

    const appointment = await Appointment.findByIdAndUpdate(appointmentId, feedbacks, { new: true })

    return appointment
  }
}

const appointmentService = new AppointmentService()
export default appointmentService
