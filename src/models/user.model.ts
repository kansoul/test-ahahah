import mongoose, { Schema } from 'mongoose'
import { Role, UserVerifyStatus } from '~/constants/enums'
import { USERS_MESSAGES } from '~/constants/messages'
import { validateEmail } from '~/utils/helper'

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    required: true,
    unique: true,
    validate: [validateEmail, USERS_MESSAGES.EMAIL_IS_INVALID]
  },
  date_of_birth: { type: Date, required: false },
  password: {
    type: String,
    min: [6, USERS_MESSAGES.PASSWORD_LENGTH_MUST_BE_FROM_6_TO_50],
    max: [50, USERS_MESSAGES.PASSWORD_LENGTH_MUST_BE_FROM_6_TO_50],
    required: [true, USERS_MESSAGES.PASSWORD_IS_REQUIRED]
  },
  email_verify_token: { type: String },
  forgot_password_token: { type: String },
  verify: { type: Number, enum: UserVerifyStatus },

  role: { type: Number, enum: Role, default: Role.User },

  bio: { type: String },
  location: { type: String },
  website: { type: String },
  username: { type: String },
  avatar: { type: String },
  cover_photo: { type: String },

  province: { type: Schema.Types.ObjectId, ref: 'Province' },
  district: { type: Schema.Types.ObjectId, ref: 'District' },
  ward: { type: Schema.Types.ObjectId, ref: 'Ward' },

  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
})

userSchema.index({ name: 'text', email: 'text' })

export const User = mongoose.model('User', userSchema)
