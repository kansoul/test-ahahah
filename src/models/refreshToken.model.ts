import mongoose from 'mongoose'

const refreshTokenSchema = new mongoose.Schema(
  {
    token: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { collection: 'refresh_tokens' }
)

export const RefreshToken = mongoose.model('RefreshToken', refreshTokenSchema)
