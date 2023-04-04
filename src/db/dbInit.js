const db = require('./index');

const sql = `
CREATE TABLE IF NOT EXISTS users
(
    id SERIAL PRIMARY KEY,
    fullname character varying(40) NOT NULL,
    nickname character varying(40) NOT NULL,
    email character varying(40) NOT NULL,
    password character varying(200) NOT NULL,
    "socketId" character varying(40),
    "isOnline" boolean NOT NULL DEFAULT false,
    "totalGames" integer NOT NULL DEFAULT 0,
    wins integer NOT NULL DEFAULT 0,
    losses integer NOT NULL DEFAULT 0,
    draws integer NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS friends
(
    "userId" integer NOT NULL,
    "friendId" integer NOT NULL,
    FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("friendId") REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY ("userId", "friendId")
);

CREATE TABLE IF NOT EXISTS sessions
(
    id SERIAL PRIMARY KEY,
    "userId" integer NOT NULL,
    "deviceId" character varying(100) NOT NULL,
    "refreshToken" character varying(200) NOT NULL
);
`;

module.exports = function initDb() {
  return db.query(sql);
};
