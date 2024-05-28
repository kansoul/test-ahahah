import mongoose, { Schema } from 'mongoose'

const commentSchema = new mongoose.Schema({
  content: { type: String, required: true },
  article: {
    type: Schema.Types.ObjectId,
    ref: 'Article',
    required: true
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  images: [{ type: String }],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  delete_at: { type: Date, default: null }
})

export const Comment = mongoose.model('Comment', commentSchema)
