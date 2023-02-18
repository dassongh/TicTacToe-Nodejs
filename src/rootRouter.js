const renderStartPage = require('./modules/page/startPage');
const userRouter = require('./modules/user/user.router');

const findRoute = require('./utils/findRoute');
const httpError = require('./utils/httpError');

const routes = {
  '/': renderStartPage,
  '/api/user': userRouter,
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
