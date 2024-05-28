import mongoose from 'mongoose'

const provinceSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  name_en: { type: String },
  full_name: { type: String },
  full_name_en: { type: String },
  code_name: { type: String },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
})

export const Province = mongoose.model('Province', provinceSchema)
