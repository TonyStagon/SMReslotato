import mongoose, { Schema, Document } from 'mongoose';
import { Post as IPost } from '../types';

const analyticsSchema = new Schema({
  reach: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  comments: { type: Number, default: 0 },
  impressions: { type: Number, default: 0 },
});

const postSchema = new Schema<IPost & Document>({
  id: { type: String, required: true, unique: true },
  caption: { type: String, required: true },
  media: String,
  platforms: [{ type: String, required: true }],
  scheduledDate: Date,
  status: {
    type: String,
    enum: ['draft', 'scheduled', 'published', 'failed'],
    default: 'draft',
  },
  userId: { type: String, required: true },
  analytics: analyticsSchema,
  errorMessage: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

postSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

postSchema.index({ userId: 1, createdAt: -1 });
postSchema.index({ status: 1, scheduledDate: 1 });

export const Post = mongoose.model<IPost & Document>('Post', postSchema);