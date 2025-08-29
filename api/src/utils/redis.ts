import { createClient } from 'redis';
import { config } from '../config';
import { logger } from './logger';

export const redis = createClient({
  url: config.REDIS_URL,
});

redis.on('error', (err) => {
  logger.error('Redis Client Error:', err);
});

redis.on('connect', () => {
  logger.info('Redis Client Connected');
});

redis.on('ready', () => {
  logger.info('Redis Client Ready');
});

redis.on('end', () => {
  logger.info('Redis Client Disconnected');
});

export const connectRedis = async () => {
  try {
    await redis.connect();
  } catch (error) {
    logger.error('Failed to connect to Redis:', error);
    process.exit(1);
  }
};

export default redis;
