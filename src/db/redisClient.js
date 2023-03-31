const { createClient } = require('redis');
const { REDIS_HOST, REDIS_PORT } = require('../config');
const redisClient = createClient({
  socket: {
    host: REDIS_HOST,
    port: REDIS_PORT,
  },
});

module.exports = redisClient;
