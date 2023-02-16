require('dotenv').config();

const POSTGRES_HOST = process.env.POSTGRES_HOST;
const POSTGRES_PORT = Number(process.env.POSTGRES_PORT);
const POSTGRES_USER = process.env.POSTGRES_USER;
const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD;
const POSTGRES_DB = process.env.POSTGRES_DB;

const PORT = process.env.SERVER_PORT;

module.exports = { POSTGRES_DB, POSTGRES_HOST, POSTGRES_PASSWORD, POSTGRES_PORT, POSTGRES_USER, PORT };
