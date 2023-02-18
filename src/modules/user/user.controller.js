const { DBError, CustomError } = require('../../utils/customErrors');
const userService = require('./user.service');

async function get({ page, limit }) {
  const offset = (page - 1) * limit;

  let users, count;
  try {
    [users, count] = await Promise.all([
      userService.get('id, fullname, nickname', limit, offset),
      userService.count(),
    ]);
  } catch (err) {
    throw new DBError(err);
  }

  return {
    payload: {
      pagination: { page, limit, count: Number(count.rows[0].count) },
      data: users.rows,
    },
  };
}

async function create(body) {
  try {
    await userService.create(body);
  } catch (err) {
    throw new DBError(err);
  }

  return { payload: { message: 'Created' } };
}

async function getById(id) {
  let user;
  try {
    user = await userService.getById(id, 'id, fullname, nickname, email, "socketId"');
  } catch (err) {
    throw new DBError(err);
  }

  if (!user.rowCount) {
    throw new CustomError(404, 'User not found');
  }

  return { payload: { data: user.rows } };
}

async function deleteById(id) {
  let result;
  try {
    result = await userService.deleteById(id);
  } catch (err) {
    throw new DBError(err);
  }

  if (!result.rowCount) {
    throw new CustomError(404, 'User not found');
  }

  return { payload: result };
}

module.exports = { get, create, getById, deleteById };
