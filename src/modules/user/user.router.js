const url = require('url');

const userController = require('./user.controller');

const actionHandler = require('../../utils/actionHandler');
const { getBody } = require('../../utils/extract');
const matchRoute = require('../../utils/matchRoute');
const httpError = require('../../utils/httpError');

const routes = {
  '/': {
    GET: actionHandler(userController.get),
    POST: actionHandler(userController.create, getBody),
  },
  '/:id': {
    GET: (req, res) => res.end(),
  },
};

async function userRouter(req, res) {
  let userUrl = req.url.replace('/api/user', '');
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

module.exports = userRouter;
