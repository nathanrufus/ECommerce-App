const Redis = require('ioredis');

const redis = new Redis(process.env.REDIS_URL); // Use full Upstash URL

module.exports = redis;
