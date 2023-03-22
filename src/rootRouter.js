const renderStartPage = require('./modules/page/startPage');
const renderLoginPage = require('./modules/page/loginPage');
const renderRegisterPage = require('./modules/page/registerPage');
const userRouter = require('./modules/user/user.router');
const authRouter = require('./modules/auth/auth.router');

const findRoute = require('./utils/findRoute');
const httpError = require('./utils/httpError');
const serveStatic = require('./modules/page/serveStatic');
const authenticate = require('./utils/authenticate');

const routes = {
  '/': renderStartPage,
  '/login': renderLoginPage,
  '/register': renderRegisterPage,
  '/app.js': serveStatic,
  '/login.js': serveStatic,
  '/register.js': serveStatic,
  '/app.css': serveStatic,
  '/api/user': userRouter,
  '/api/auth': authRouter,
};

module.exports = async function rootRouter(req, res) {
  const route = findRoute(req.url, routes);
  if (req.method === 'OPTIONS') {
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Max-Age': 2592000,
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    res.writeHead(204, headers);
    return res.end();
  }

  try {
    await authenticate(req);
    route(req, res);
  } catch (err) {
    console.error(err);
    httpError(res, 404, 'Not found');
  }
};
