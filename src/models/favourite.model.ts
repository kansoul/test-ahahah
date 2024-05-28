import mongoose, { Schema } from 'mongoose'

const favoriteSchema = new mongoose.Schema({
  article: {
    type: Schema.Types.ObjectId,
    ref: 'Article',
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
})

export const Favorite = mongoose.model('Favorite', favoriteSchema)
