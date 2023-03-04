const crypto = require('crypto');

async function register(userData) {
  return { status: 201, payload: { message: 'ok' } };
}

module.exports = { register };
