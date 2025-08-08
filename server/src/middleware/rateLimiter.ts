import rateLimit from 'express-rate-limit';

export const createRateLimiter = (windowMs: number, max: number, message?: string) => {
  return rateLimit({
    windowMs,
    max,
    message: message || 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
  });
};

// General API rate limiter
export const apiLimiter = createRateLimiter(
  parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100')
);

// Stricter rate limiter for auth endpoints
export const authLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  5, // 5 attempts
  'Too many authentication attempts, please try again later.'
);

// Post creation rate limiter
export const postLimiter = createRateLimiter(
  60 * 1000, // 1 minute
  10, // 10 posts per minute
  'Too many posts created, please slow down.'
);