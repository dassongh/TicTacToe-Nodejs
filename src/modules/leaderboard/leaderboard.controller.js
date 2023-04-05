const userService = require('../user/user.service');
const { DBError } = require('../../utils/customErrors');

async function get() {
  let dbResult;
  try {
    dbResult = await userService.getUsersScore();
  } catch (err) {
    throw new DBError(err);
  }
  const leaderboard = dbResult.rows;

  return { payload: { data: leaderboard } };
}

module.exports = { get };
