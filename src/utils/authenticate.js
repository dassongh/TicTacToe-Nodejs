const { verifyToken } = require('./jwtToken');
const { TOKEN_TYPES } = require('../modules/auth/auth.constants');
const sessionService = require('../modules/auth/auth.service');

module.exports = async function authenticate(req, isTokenFromQuery) {
  const token = isTokenFromQuery ? getTokenFromQuery(req.url) : getTokenFromHeader(req.headers);
  req.user = null;
  if (!token) return;

  let tokenInfo;
  try {
    tokenInfo = verifyToken(token, TOKEN_TYPES.ACCESS);
  } catch (err) {
    return;
  }

  let sessionDbResult;
  try {
    sessionDbResult = await sessionService.findByFilter(`"userId" = '${tokenInfo.userId}'`);
  } catch (err) {
    throw new DBError(err);
  }
  if (!sessionDbResult.rowCount) return;

  req.user = { userId: tokenInfo.userId };
  return;
};

function getTokenFromHeader(headers) {
  const [type, token] = headers.authorization ? headers.authorization.split(' ') : [];
  if (type === 'Bearer') return token;
  return null;
}

function getTokenFromQuery(url) {
  return url.split('=')[1];
}
