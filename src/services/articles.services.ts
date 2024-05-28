import { ObjectId } from 'mongodb'
import { DEFAULT_LIMIT } from '~/constants'
import { ParticipantInvitationStatus } from '~/constants/enums'
import { Appointment } from '~/models/appointment.model'
import { Article } from '~/models/article.model'
import { Participant } from '~/models/participant.model'
import { User } from '~/models/user.model'
import { CreateAppointmentReqBody, CreateArticleReqBody } from '~/types/requests/articles'
import { sendParticipantEmail } from '~/utils/email'
import addressService from './address.services'

class ArticleService {
  async createArticle(body: CreateArticleReqBody) {
    const formattedBody: any = { ...body }

    if (formattedBody.province) {
      const province = await addressService.getProvinceByProvinceByCode(formattedBody.province)
      formattedBody.province = province?._id
    }

    if (formattedBody.district) {
      const district = await addressService.getDistrictByDistrictCode(formattedBody.district)
      formattedBody.district = district?._id
    }

    if (formattedBody.ward) {
      const ward = await addressService.getWardByWardCode(formattedBody.ward)
      formattedBody.ward = ward?._id
    }

    const article = await Article.create({ ...formattedBody, author: new ObjectId(body.author) })
    return article
  }

  async updateArticle(articleId: string, body: CreateArticleReqBody) {
    const formattedBody: any = { ...body }

    if (formattedBody.province) {
      const province = await addressService.getProvinceByProvinceByCode(formattedBody.province)
      formattedBody.province = province?._id
    }

    if (formattedBody.district) {
      const district = await addressService.getDistrictByDistrictCode(formattedBody.district)
      formattedBody.district = district?._id
    }

    if (formattedBody.ward) {
      const ward = await addressService.getWardByWardCode(formattedBody.ward)
      formattedBody.ward = ward?._id
    }

    const article = await Article.updateOne({ _id: new ObjectId(articleId) }, [
      { $set: { ...formattedBody, author: new ObjectId(body.author) } }
    ])

    return article
  }

  async getArticleById(id: string) {
    const article = await Article.findOne({ _id: new ObjectId(id) })
      .populate({ path: 'author', select: '_id name' })
      .populate({ path: 'categories', select: '_id name' })
      .populate({ path: 'province', select: '_id name code' })
      .populate({ path: 'district', select: '_id name code' })
      .populate({ path: 'ward', select: '_id name code' })
      .exec()

    return article
  }

  async createAppointment(body: Partial<CreateAppointmentReqBody>) {
    let participantUserIds = []
    const formattedBody: any = { ...body, is_public: body.is_public === '1' }

    if (formattedBody.location?.province) {
      const province = await addressService.getProvinceByProvinceByCode(formattedBody.location.province)
      formattedBody.location.province = province?._id as any
    }

    if (formattedBody.location.district) {
      const district = await addressService.getDistrictByDistrictCode(formattedBody.location.district)
      formattedBody.location.district = district?._id
    }

    if (formattedBody.location.ward) {
      const ward = await addressService.getWardByWardCode(formattedBody.location.ward)
      formattedBody.location.ward = ward?._id
    }

    if (formattedBody?.participants?.length > 0) {
      const participants = formattedBody.participants.map((item: any) => item.email)
      const participantUsers = await User.find({ email: { $in: participants } })
      participantUserIds = participantUsers.map((user: any) => user._id)
    }

    if (participantUserIds.length > 0) {
      const participantsData = participantUserIds.map((userId) => ({
        user: userId,
        status: ParticipantInvitationStatus.Waiting
      }))

      // Send mail tới user
      const participants = await Participant.insertMany(participantsData)
      const participantIds = participants.map((item: any) => item._id)

      formattedBody.participants = participantIds
    }

    const appointment = await (
      await Appointment.create(formattedBody)
    ).populate([
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

    if (participantUserIds.length > 0) {
      const participantUsers = await User.find({ _id: { $in: participantUserIds } })
      participantUsers.forEach((user: any) => {
        sendParticipantEmail(user.email, user, appointment)
      })
    }

    return appointment
  }

  async getListArticleHome(selectQuery: any, select = '') {
    let query = {}
    let categoryIds = []
    const { categoryId, limit = DEFAULT_LIMIT } = selectQuery

    if (categoryId) {
      categoryIds = categoryId.split(',')
    }

    if (categoryIds.length) {
      query = {
        categories: { $in: categoryIds }
      }
    }

    const results = await Article.find(query)
      .select(select)
      .populate({ path: 'author', select: 'name' })
      .populate({ path: 'province', select: 'name' })
      .populate({ path: 'district', select: 'name' })
      .populate({ path: 'ward', select: 'name' })
      .sort({ _id: -1 })
      .limit(limit)
      .exec()

    return results
  }
}

const articleService = new ArticleService()
export default articleService
