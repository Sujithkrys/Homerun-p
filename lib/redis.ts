import Redis from 'ioredis';

// Always use real ioredis client for production
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

redis.on('error', (err) => {
  // Catch but do not log every single connection error to avoid spamming the console
  // in environments where Redis might be temporarily unavailable.
});

export default redis;
