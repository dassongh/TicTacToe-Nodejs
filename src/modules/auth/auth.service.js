const db = require('../../db');

function create(payload) {
  const sql = `
    INSERT INTO sessions("userId", "deviceId", "refreshToken")
    VALUES($1, $2, $3)
  `;
  const params = Object.values(payload);

  return db.query(sql, params);
}

module.exports = { create };
