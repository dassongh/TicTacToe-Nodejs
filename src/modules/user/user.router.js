const userController = require('./user.controller');
const actionHandler = require('../../utils/actionHandler');
const { getBody } = require('../../utils/extract');

const routes = {
  get: {
    '/': actionHandler(userController.get),
  },
  post: {
    '/': actionHandler(userController.create, getBody),
  },
};

async function userRouter(req, res) {
  const method = req.method;
  const url = req.url.replace('/api/user', '/');
  let response;

  if (method === 'GET') response = routes.get[url];
  if (method === 'POST') response = routes.post[url];

  response(req, res);
}

module.exports = userRouter;
