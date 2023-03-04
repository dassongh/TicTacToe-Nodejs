const url = require('url');

const authController = require('./auth.controller');

const actionHandler = require('../../utils/actionHandler');
const { getBody } = require('../../utils/extract');
const matchRoute = require('../../utils/matchRoute');
const httpError = require('../../utils/httpError');

const routes = {
  '/': {
    POST: actionHandler(authController.register, getBody),
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
    httpError(res, 404, 'Not found');
  }

  req.params = match.params;
  req.query = parsedUrl.query;

  routes[match.route][req.method](req, res);
}

module.exports = authRouter;
