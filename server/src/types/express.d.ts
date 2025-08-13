import { ObjectId } from 'mongoose';

declare module 'express-serve-static-core' {
  interface Response {
    deliver<T = unknown>(body?: T): this;
  }

  interface Request {
    auth?: {
      userId: ObjectId;
      email: string;
    }
  }
}

export type ApiError = {
  code: number;
  message: string;
};

export type PostStatus = 
  | 'draft' 
  | 'published'
  | 'archived'
  | 'failed'
  | 'scheduled';