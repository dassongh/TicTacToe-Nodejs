const { DBError } = require('../../utils/customErrors');
const userService = require('./user.service');

async function get() {
  let users;
  try {
    users = await userService.get('fullname, nickname');
  } catch (err) {
    throw new DBError(err);
  }

  return { payload: { data: users.rows } };
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
    user = await userService.getById(id, 'fullname, nickname, email');
  } catch (err) {
    throw new DBError(err);
  }

  return { payload: { data: user.rows } };
}

module.exports = { get, create, getById };
