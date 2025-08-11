import Redis from 'ioredis';
import { logger } from '../utils/logger';

// Parse Redis URL or use default localhost
const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
let redisConfig: any;

if (redisUrl.startsWith('redis://')) {
  redisConfig = redisUrl;
} else {
  // Handle other Redis configurations if needed
  redisConfig = {
    host: 'localhost',
    port: 6379,
  };
}

export const redis = new Redis(redisConfig, {
  retryDelayOnFailover: 100,
  enableReadyCheck: false,
  maxRetriesPerRequest: null,
  lazyConnect: true,
});

redis.on('connect', () => {
  logger.info('Redis connected successfully');
});

redis.on('error', (error) => {
  logger.error('Redis connection error:', error);
});

redis.on('close', () => {
  logger.warn('Redis connection closed');
});

export default redis;