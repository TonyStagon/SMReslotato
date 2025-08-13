import { Document, Types } from 'mongoose';

export interface IPost extends Document {
  title: string;
  content: string;
  caption?: string;
  media?: string[];
  scheduledDate?: Date;
  status: 'draft' | 'published' | 'archived' | 'failed';
  userId: Types.ObjectId;
  platforms: string[];
  errorMessage?: string;
  analytics?: {
    views: number;
    likes: number;
    reach: number;
    comments: number;
    impressions: number;
  };
  createdAt: Date;
  updatedAt: Date;
}