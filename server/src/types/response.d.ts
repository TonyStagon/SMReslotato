declare module 'express-serve-static-core' {
  interface Response {
    deliver<T = unknown>(body?: T): this;
  }
}