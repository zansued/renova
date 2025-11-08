import Redis from 'ioredis';
import { env } from './env.js';

let redisClient;

export function getRedisClient() {
  if (!redisClient) {
    if (!env.redisUrl) {
      throw new Error('Redis URL não configurada. Defina a variável de ambiente REDIS_URL.');
    }

    redisClient = new Redis(env.redisUrl);
  }

  return redisClient;
}
