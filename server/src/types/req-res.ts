import { Response } from 'express';
import { ObjectId } from 'mongoose';

declare module 'express-serve-static-core' {
  interface Response {
    deliver<T>(data?: T): this;
  }
}

export type AppResponse<T = any> = Response<T>;

export interface JwtPayload {
  userId: ObjectId;
  email: string;
}

export interface AuthContext {
  auth?: JwtPayload;
}

export interface ErrorResponse {
  code: number;
  message: string;
  details?: unknown;
}

export type PostStatus = 'draft' | 'published' | 'archived' | 'failed' | 'scheduled';