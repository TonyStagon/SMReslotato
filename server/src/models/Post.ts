import { Schema, model, Model } from 'mongoose';
import type { IPost } from '../types';

const PostSchema = new Schema<IPost>(
  {
    title: { 
      type: String,
      required: true,
      trim: true,
      maxlength: 120 
    },
    content: { 
      type: String,
      required: true 
    },
    caption: {
      type: String,
      required: false
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived', 'failed', 'scheduled'],
      default: 'draft'
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    platforms: {
      type: [String],
      default: []
    },
    errorMessage: {
      type: String,
      required: false
    },
    analytics: {
      views: { type: Number, default: 0 },
      likes: { type: Number, default: 0 }
    }
  },
  { timestamps: true }
);

interface PostModel extends Model<IPost> {
  markAsFailed(postId: string, errorMessage: string): Promise<IPost>;
  validateStatusTransition(prevStatus: string, newStatus: string): boolean;
}

PostSchema.statics.markAsFailed = async function(postId: string, errorMessage: string) {
  const post = await this.findById(postId);
  if (!post) throw new Error('Post not found');
  
  if (!Post.validateStatusTransition(post.status, 'failed')) {
    throw new Error(`Cannot transition from ${post.status} to failed`);
  }

  post.status = 'failed';
  post.errorMessage = errorMessage;
  return await post.save();
};

PostSchema.statics.validateStatusTransition = (prevStatus: string, newStatus: string) => {
  const validTransitions: Record<string, string[]> = {
    draft: ['published', 'failed', 'scheduled'],
    published: ['archived'],
    archived: [],
    failed: ['draft', 'archived'],
    scheduled: ['published', 'failed']
  };
  return validTransitions[prevStatus]?.includes(newStatus) ?? false;
};

export const Post = model<IPost, PostModel>('Post', PostSchema);