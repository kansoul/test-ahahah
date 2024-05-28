import mongoose from 'mongoose'
import { MediaType } from '~/constants/enums'

const mediaSchema = new mongoose.Schema({
  url: { type: String, required: true },
  type: { type: MediaType }
})

export const Media = mongoose.model('Media', mediaSchema)
