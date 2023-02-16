const { DBError } = require('../../utils/customErrors');
const userService = require('./user.service');

async function get() {
  let users;
  try {
    users = await userService.get();
  } catch (err) {
    throw new DBError(err);
  }

  return {
    payload: {
      data: users,
    },
  };
}

async function create(body) {
  console.log(body);
  return {
    payload: body,
  };
}

module.exports = { get, create };
