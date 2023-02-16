const http = require('http');
const { PORT } = require('./config');
const rootRouter = require('./rootRouter');

const APPID = process.env.APPID;
const server = http.createServer(rootRouter);

server.listen(PORT, () => console.log('Server is listening on port ' + PORT));
