import { Request, Response, NextFunction } from 'express';

// Extend Express Response interface
declare global {
  namespace Express {
  interface Response {
  deliver<T = unknown>(data?: T): this;
    }
  }
}

export const responseHelpers = (req: Request, res: Response, next: NextFunction) => {
  res.deliver = function<T = unknown>(data?: T): Response {
    return this.json(data);
  };
  
  next();
};