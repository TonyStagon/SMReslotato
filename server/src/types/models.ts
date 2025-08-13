import { Document, Types } from 'mongoose';

export interface IPost extends Document {
  title: string;
  content: string;
  caption?: string;
  media?: string[];
  status: 'draft' | 'published' | 'archived' | 'failed';
  userId: Types.ObjectId;
  platforms: string[];
  errorMessage?: string;
  analytics?: {
    views: number;
    likes: number;
  };
  createdAt: Date;
  updatedAt: Date;
}