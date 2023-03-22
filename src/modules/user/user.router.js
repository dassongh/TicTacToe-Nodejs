const url = require('url');

const userController = require('./user.controller');

const actionHandler = require('../../utils/actionHandler');
const { getBody, getId, getPagination } = require('../../utils/extract');
const matchRoute = require('../../utils/matchRoute');
const httpError = require('../../utils/httpError');

const routes = {
  '/': {
    GET: actionHandler(userController.get, getPagination),
    POST: actionHandler(userController.create, getBody),
  },
  '/:id': {
    GET: actionHandler(userController.getById, getId),
    DELETE: actionHandler(userController.deleteById, getId),
  },
};

module.exports = async function userRouter(req, res) {
  let userUrl = req.url.replace('/api/user', '');
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
};
