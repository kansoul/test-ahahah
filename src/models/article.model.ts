import mongoose, { Schema } from 'mongoose'

const articleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  anticipated_price: { type: Number, default: null },
  banners: [{ type: String }],
  categories: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true
    }
  ],
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  province: { type: Schema.Types.ObjectId, ref: 'Province' },
  district: { type: Schema.Types.ObjectId, ref: 'District' },
  ward: { type: Schema.Types.ObjectId, ref: 'Ward' },
  address: { type: String },

  is_public_flag: { type: Boolean, default: false },
  delete_at: { type: Date, default: null },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }]
})

export const Article = mongoose.model('Article', articleSchema)
