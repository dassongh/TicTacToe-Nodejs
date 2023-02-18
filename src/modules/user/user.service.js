const db = require('../../db');

function get(projection) {
  const select = projection || '*';
  const sql = `SELECT ${select} FROM users`;

  return db.query(sql);
}

function create(payload) {
  const sql = `
    INSERT INTO users(fullname, nickname, email, password)
    VALUES($1, $2, $3, $4)
  `;
  const params = Object.values(payload);

  return db.query(sql, params);
}

function getById(id, projection) {
  const select = projection || '*';
  const sql = `
    SELECT ${select} FROM users
    WHERE id = ${id};
  `;

  return db.query(sql);
}

module.exports = { get, create, getById };
