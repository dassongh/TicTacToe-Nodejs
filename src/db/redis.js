const { REDIS_HASH_TIME_TO_LIVE } = require('../config');
const redisClient = require('./redisClient');

function set(key, value) {
  return redisClient.set(key, value);
}

function get(key) {
  return redisClient.get(key);
}

function hSet(key, values) {
  return redisClient.hSet(key, values).then(() => redisClient.expire(key, REDIS_HASH_TIME_TO_LIVE));
}

function hGetAll(key) {
  return redisClient.hGetAll(key);
}

module.exports = { set, get, hSet, hGetAll };
