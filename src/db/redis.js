const redisClient = require('./redisClient');

function set(key, value) {
  return redisClient.set(key, value);
}

function get(key) {
  return redisClient.get(key);
}

function hSet(...args) {
  return redisClient.hSet(...args);
}

function hGetAll(key) {
  return redisClient.hGetAll(key);
}

module.exports = { set, get, hSet, hGetAll };
