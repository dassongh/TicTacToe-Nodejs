const db = require('../../db');

function get(select = '*', limit, offset) {
  const sql = `
  SELECT ${select} FROM users
  LIMIT ${limit}
  OFFSET ${offset}
  `;

  return db.query(sql);
}

function count() {
  const sql = `
    SELECT COUNT(*) FROM users
  `;

  return db.query(sql);
}

function create(payload) {
  const sql = `
    INSERT INTO users(fullname, nickname, email, password)
    VALUES($1, $2, $3, $4)
    RETURNING id, fullname, nickname, email
  `;
  const params = Object.values(payload);

  return db.query(sql, params);
}

function getById(id, select = '*') {
  const sql = `
    SELECT ${select} FROM users
    WHERE id = ${id};
  `;

  return db.query(sql);
}

function deleteById(id) {
  const sql = `
    DELETE from users
    WHERE id = ${id}
  `;
  return db.query(sql);
}

/**
 * Finds users from the database based on a given filter and projection.
 * @param {string} filter - The condition for selecting data from the 'users' table.
 * @param {string} [select='*'] - The list of columns to select from the 'users' table. Default is all columns.
 * @returns {Promise} A Promise that resolves to an object of db query that matches the given filter and projection.
 */
function findByFilter(filter, select = '*') {
  const sql = `
    SELECT ${select} FROM users
    WHERE ${filter};
  `;

  return db.query(sql);
}

function update(filter, setStatement) {
  const sql = `
    UPDATE users
    SET ${setStatement}
    WHERE ${filter}
  `;
  return db.query(sql);
}

module.exports = { get, create, getById, count, deleteById, findByFilter, update };
