const http = require('http');
const { PORT } = require('./config');
const rootRouter = require('./rootRouter');
const initDb = require('./db/dbInit');

const APPID = process.env.APPID;
const server = http.createServer(rootRouter);

server.listen(PORT, () => {
  console.log('Server is running on port ' + PORT);
  initDb()
    .then(() => console.log('Database created successfully'))
    .catch(err => console.error('DB init error: ', err));
});

server.on('error', err => {
  console.error(err);
});
