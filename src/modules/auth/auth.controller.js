const crypto = require('crypto');

const userService = require('../user/user.service');
const sessionService = require('./auth.service');
const { TOKEN_TYPE } = require('./auth.constants');

const { DBError, CustomError } = require('../../utils/customErrors');
const { createToken } = require('../../utils/jwtToken');
const { PASSWORD_SALT } = require('../../config');

async function register(userData, deviceId) {
  let existedUser;
  try {
    existedUser = await userService.find(`email = '${userData.email}'`);
  } catch (err) {
    throw new DBError(err);
  }

  if (existedUser.rowCount) {
    throw new CustomError(400, 'User with such email already exist');
  }

  const passwordHash = _passwordCrypt(userData.password);
  const userPayload = Object.assign({}, userData, { password: passwordHash });

  let newUser;
  try {
    newUser = await userService.create(userPayload);
  } catch (err) {
    throw new DBError(err);
  }

  const userId = newUser.rows[0].id;
  const tokens = {
    access: createToken({ userId }, TOKEN_TYPE.ACCESS),
    refresh: createToken({ userId }, TOKEN_TYPE.REFRESH),
  };

  const sessionPayload = { userId, deviceId, refreshToken: tokens.refresh };
  try {
    await sessionService.create(sessionPayload);
  } catch (err) {
    throw new DBError(err);
  }

  return {
    status: 201,
    payload: {
      data: {
        user: newUser.rows[0],
        tokens,
      },
    },
  };
}

function _passwordCrypt(password) {
  return crypto.pbkdf2Sync(password, PASSWORD_SALT, 1000, 64, 'sha512').toString('hex');
}

module.exports = { register };
