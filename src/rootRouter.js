const renderStartPage = require('./modules/page/startPage');
const userRouter = require('./modules/user/user.router');
const authRouter = require('./modules/auth/auth.router');

const findRoute = require('./utils/findRoute');
const httpError = require('./utils/httpError');
const serveStatic = require('./modules/page/serveStatic');

const routes = {
  '/': renderStartPage,
  '/app.js': serveStatic,
  '/app.css': serveStatic,
  '/api/user': userRouter,
  '/api/auth': authRouter,
};

module.exports = async function rootRouter(req, res) {
  const route = findRoute(req.url, routes);

  try {
    route(req, res);
  } catch (err) {
    console.error(err);
    httpError(res, 404, 'Not found');
  }
};
