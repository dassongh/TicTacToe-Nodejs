const redisClient = require('./redisClient');

function set(key, value) {
  return redisClient.set(key, value);
}

function get(key) {
  return redisClient.get(key);
}

module.exports = { set, get };
