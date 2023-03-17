const url = require('url');

const authController = require('./auth.controller');

const actionHandler = require('../../utils/actionHandler');
const { getBody, getDeviceId } = require('../../utils/extract');
const matchRoute = require('../../utils/matchRoute');
const httpError = require('../../utils/httpError');

const routes = {
  '/register': {
    POST: actionHandler(authController.register, [getBody, getDeviceId]),
  },
  '/login': {
    POST: actionHandler(authController.login, [getBody, getDeviceId]),
  },
};

async function authRouter(req, res) {
  let userUrl = req.url.replace('/api/auth', '');
  if (!userUrl) {
    userUrl = '/';
  }

  const parsedUrl = url.parse(userUrl, true);
  const pathName = parsedUrl.pathname;

  const match = matchRoute(pathName, Object.keys(routes));
  if (!match) {
    return httpError(res, 404, 'Not found');
  }

  req.params = match.params;
  req.query = parsedUrl.query;

  if (!routes[match.route][req.method]) {
    return httpError(res, 404, 'Not found');
  }
  routes[match.route][req.method](req, res);
}

module.exports = authRouter;
