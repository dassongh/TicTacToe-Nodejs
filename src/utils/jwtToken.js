const jwt = require('jsonwebtoken');

const { Token_Types } = require('../modules/auth/auth.constants');
const {
  ACCESS_TOKEN_EXPIRE,
  ACCESS_TOKEN_SALT,
  REFRESH_TOKEN_EXPIRE,
  REFRESH_TOKEN_SALT,
} = require('../config');

function createToken(userData, tokenType) {
  const salt = tokenType === Token_Types.ACCESS ? ACCESS_TOKEN_SALT : REFRESH_TOKEN_SALT;
  const expiresIn = tokenType === Token_Types.ACCESS ? ACCESS_TOKEN_EXPIRE : REFRESH_TOKEN_EXPIRE;
  return jwt.sign(userData, salt, { expiresIn });
}

function verifyToken(token, tokenType) {
  const salt = tokenType === Token_Types.ACCESS ? ACCESS_TOKEN_SALT : REFRESH_TOKEN_SALT;
  return jwt.verify(token, salt);
}

module.exports = { createToken, verifyToken };
