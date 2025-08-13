import { Request, Response } from 'express';
import { Document, ObjectId } from 'mongoose';

interface BaseReqParams {
  id?: string;
  [key: string]: string | undefined;
}

interface BaseReqQueries {
  [key: string]: string | string[] | undefined;
}

export interface JwtPayload {
  userId: ObjectId;
  email: string;
}

export interface AppResponse<T = unknown> extends Response {
  deliver(data?: T): Promise<this>;
}

export interface AuthRequest<
  P extends object = object, 
  Q extends object = object, 
  B extends object = object
> extends Request {
  auth: JwtPayload;
  params: P & BaseReqParams;
  query: Q & BaseReqQueries;
  body: B;
}

// Post Model Interface
export interface IPost {
  _id: ObjectId;
  title: string;
  content: string;
  caption?: string;
  status: 'draft' | 'published' | 'scheduled' | 'failed';
  analytics?: {
    reach: number;
    likes: number;
    comments: number;
    impressions: number;
  };
  platforms: string[];
  createdAt: Date;
  updatedAt: Date;
  errorMessage?: string;
}

export type PostDocument = IPost & Document;

// Route-specific interfaces
export interface PostParams {
  id: string;
}

export interface PostListQuery {
  status?: 'draft' | 'published';
  limit?: string;
  offset?: string;
}

// Automation Settings
export interface IAutomationSettings {
  enabled: boolean;
  startTime: Date;
}
