const db = require('../../db');

function create(payload) {
  const sql = `
    INSERT INTO sessions("userId", "deviceId", "refreshToken")
    VALUES($1, $2, $3)
  `;
  const params = Object.values(payload);

  return db.query(sql, params);
}

function findByFilter(filter, select = '*') {
  const sql = `
    SELECT ${select} FROM sessions
    WHERE ${filter};
  `;

  return db.query(sql);
}

function update(filter, setStatement) {
  const sql = `
    UPDATE sessions
    SET ${setStatement}
    WHERE ${filter}
  `;
  return db.query(sql);
}

module.exports = { create, findByFilter, update };
