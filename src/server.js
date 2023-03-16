const http = require('http');
const { WebSocketServer } = require('ws');

const { PORT } = require('./config');
const rootRouter = require('./rootRouter');
const initDb = require('./db/dbInit');
const redisClient = require('./db/redisClient');

const APPID = process.env.APPID;
const server = http.createServer(rootRouter);

server.listen(PORT, () => {
  console.log('Server is running on port ' + PORT);
  redisClient
    .connect()
    .then(() => console.log('Redis client connected'))
    .catch(err => console.error('Redis connection error', err));
  initDb()
    .then(() => console.log('Database created successfully'))
    .catch(err => console.error('DB init error: ', err));
});

const wss = new WebSocketServer({ server });

wss.on('connection', () => {
  console.log(APPID, 'connected');
});

server.on('error', err => {
  console.error(err);
});
