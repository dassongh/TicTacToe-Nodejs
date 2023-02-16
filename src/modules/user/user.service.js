const db = require('../../db');

function get() {
  const sql = 'SELECT * FROM users';
  return db.query(sql);
}

module.exports = { get };
