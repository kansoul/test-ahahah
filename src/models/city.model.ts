import mongoose, { Schema } from 'mongoose'

const citySchema = new mongoose.Schema({
  name: { type: String, required: true },
  districts: [{ type: Schema.Types.ObjectId, ref: 'District' }],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
})

export const City = mongoose.model('City', citySchema)
