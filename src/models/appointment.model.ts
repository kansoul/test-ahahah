import mongoose, { Schema } from 'mongoose'
import { AppointmentStatus, AppointmentType } from '~/constants/enums'

const appointmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  inspired_by_article: { type: Schema.Types.ObjectId, ref: 'Article', required: true },
  planned_date: { type: Date, required: true },
  anticipated_price: { type: Number, default: null },
  participants: [{ type: Schema.Types.ObjectId, ref: 'Participant' }],
  location: {
    province: { type: Schema.Types.ObjectId, ref: 'Province' },
    district: { type: Schema.Types.ObjectId, ref: 'District' },
    ward: { type: Schema.Types.ObjectId, ref: 'Ward' },
    address: { type: String }
  },
  organizer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  is_public: { type: Boolean, default: false },
  notes: { type: String },
  feedbacks: [{ type: String }],
  // status: { type: Number, enum: AppointmentStatus },
  // type: { type: Number, enum: AppointmentType },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
})

export const Appointment = mongoose.model('Appointment', appointmentSchema)
