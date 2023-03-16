const { createClient } = require('redis');
const redisClient = createClient();

module.exports = redisClient;
