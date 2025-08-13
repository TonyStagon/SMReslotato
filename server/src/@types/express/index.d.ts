import { ObjectId } from 'mongoose';

declare global {
  namespace Express {
    interface Response {
      deliver<T = unknown>(data?: T): this;
    }
    
    interface Request {
      auth?: { 
        userId: ObjectId;
        email: string;
      }
    }
  }
}

export interface PostStatusResponse {
  id: string;
  title: string;
  status: 'draft' | 'published' | 'archived' | 'failed' | 'scheduled'; 
  content: string;
}