import mongoose, { Schema } from 'mongoose'

const districtSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  name_en: { type: String },
  full_name: { type: String },
  full_name_en: { type: String },
  code_name: { type: String },
  province_code: { type: Schema.Types.ObjectId, ref: 'Province' },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
})

export const District = mongoose.model('District', districtSchema)
