const renderStartPage = require('./modules/page/startPage');
const userRouter = require('./modules/user/user.router');

const httpError = require('./utils/httpError');

const routes = {
  '/': renderStartPage,
  '/api/user': userRouter,
};

async function rootRouter(req, res) {
  try {
    routes[req.url](req, res);
  } catch (err) {
    console.error(err);
    httpError(res, 404, 'Not found');
  }
}

module.exports = rootRouter;
