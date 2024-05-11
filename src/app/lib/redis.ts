// import { Prisma } from "@prisma/client";
import Redis from "ioredis";
import prismaCache from '@yxx4c/prisma-redis-cache';
import { createCache } from 'async-cache-dedupe';

// Create a Redis client
const redis = new Redis();
redis.setex;

// Craete a pino logger instance for logging
const logger = console;

// Create an async-cache-dedupe instance for caching
const cache = createCache({
  ttl: 5, // Use your custom values
  stale: 5, // Use your custom values
  storage: {
    type: 'redis',
    options: {
      client: redis,
      invalidation: { referencesTTL: 60 }, // Invalidation settings
      log: logger, // Logger for cache events
    },
  },
});

export default prismaCache({ redis, cache });
