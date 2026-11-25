import { Redis } from "ioredis";
import { env } from "./env.js";

export const redis = new Redis(env.REDIS_URL, {
  maxRetriesPerRequest: null,
  enableReadyCheck: true,
});

export const checkRedisConnection = async (): Promise<void> => {
  await redis.ping();
};

export const closeRedisConnection = async (): Promise<void> => {
  await redis.quit();
};
