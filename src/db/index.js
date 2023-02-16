const { Pool } = require('pg');
const config = require('../config');

const pool = new Pool({
  user: config.POSTGRES_USER,
  host: config.POSTGRES_HOST,
  database: config.POSTGRES_DB,
  password: config.POSTGRES_PASSWORD,
  port: config.POSTGRES_PORT,
});

const query = (text, params) => {
  return pool.query(text, params);
};

module.exports = { query };
