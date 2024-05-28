import mongoose, { Schema } from 'mongoose'

const wardSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  name_en: { type: String },
  full_name: { type: String },
  full_name_en: { type: String },
  code_name: { type: String },
  district_code: { type: Schema.Types.ObjectId, ref: 'District' },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
})

export const Ward = mongoose.model('Ward', wardSchema)
