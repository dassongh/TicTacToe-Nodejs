const crypto = require('crypto');

const userService = require('../user/user.service');
const sessionService = require('./auth.service');
const { TOKEN_TYPES } = require('./auth.constants');

const { DBError, CustomError } = require('../../utils/customErrors');
const { createToken } = require('../../utils/jwtToken');
const { PASSWORD_SALT } = require('../../config');

async function register(userData, deviceId) {
  let existedUser;
  try {
    existedUser = await userService.findByFilter(`email = '${userData.email}'`);
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
    access: createToken({ userId }, TOKEN_TYPES.ACCESS),
    refresh: createToken({ userId }, TOKEN_TYPES.REFRESH),
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

async function login({ email, password }, deviceId) {
  let dbResult;
  try {
    dbResult = await userService.findByFilter(
      `email = '${email}'`,
      `id, fullname, nickname, email, "isOnline", password`
    );
  } catch (err) {
    throw new DBError(err);
  }

  if (!dbResult.rowCount) {
    throw new CustomError(400, 'Password or email incorrect');
  }

  const user = dbResult.rows[0];
  const passwordHash = _passwordCrypt(password);
  if (passwordHash !== user.password) {
    throw new CustomError(400, 'Password or email incorrect');
  }
  delete user.password;

  let sessionDbResult;
  try {
    sessionDbResult = await sessionService.findByFilter(
      `"userId" = '${user.id}' AND "deviceId" = '${deviceId}'`
    );
  } catch (err) {
    throw new DBError(err);
  }

  const tokens = {
    access: createToken({ userId: user.id }, TOKEN_TYPES.ACCESS),
    refresh: createToken({ userId: user.id }, TOKEN_TYPES.REFRESH),
  };
  const session = sessionDbResult.rows[0];

  if (session) {
    try {
      await sessionService.update(`id = '${session.id}'`, `"refreshToken" = '${tokens.refresh}'`);
    } catch (err) {
      throw new DBError(err);
    }
  } else {
    const sessionPayload = { userId: user.id, deviceId, refreshToken: tokens.refresh };
    try {
      await sessionService.create(sessionPayload);
    } catch (err) {
      throw new DBError(err);
    }
  }

  return { payload: { data: { user, tokens } } };
}

async function current(userId) {
  let dbResult;
  try {
    dbResult = await userService.getById(userId, 'id, nickname');
  } catch (err) {
    throw new DBError(err);
  }

  if (!dbResult.rowCount) {
    throw new CustomError(404, 'Not found');
  }

  const user = dbResult.rows[0];

  return { payload: { data: user } };
}

async function logout(userId) {
  try {
    await sessionService.deleteSession(`"userId"=${userId}`);
  } catch (err) {
    throw new DBError(err);
  }

  return { status: 200 };
}

function _passwordCrypt(password) {
  return crypto.pbkdf2Sync(password, PASSWORD_SALT, 1000, 64, 'sha512').toString('hex');
}

module.exports = { register, login, current, logout };
