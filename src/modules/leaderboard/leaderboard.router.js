const url = require('url');

const leaderboardController = require('./leaderboard.controller');

const actionHandler = require('../../utils/actionHandler');
const matchRoute = require('../../utils/matchRoute');
const httpError = require('../../utils/httpError');

const routes = {
  '/': {
    GET: actionHandler(leaderboardController.get),
  },
};

module.exports = async function leaderboardRouter(req, res) {
  let leaderboardUrl = req.url.replace('/api/leaderboard', '');
  if (!leaderboardUrl) {
    leaderboardUrl = '/';
  }
  const parsedUrl = url.parse(leaderboardUrl, true);
  const pathName = parsedUrl.pathname;

  const match = matchRoute(pathName, Object.keys(routes));
  if (!match || !routes[match.route][req.method]) {
    return httpError(res, 404, 'Not found');
  }

  req.params = match.params;
  req.query = parsedUrl.query;

  routes[match.route][req.method](req, res);
};
