const { REDIS_STRING_TIME_TO_LIVE } = require('../config');
const redisClient = require('./redisClient');

function set(key, value) {
  return redisClient.set(key, value).then(() => redisClient.expire(key, REDIS_STRING_TIME_TO_LIVE));
}

function get(key) {
  return redisClient.get(key);
}

module.exports = { set, get };
