const { verifyToken } = require('./jwtToken');
const { TOKEN_TYPE } = require('../modules/auth/auth.constants');
const sessionService = require('../modules/auth/auth.service');

function getTokenFromHeader(headers) {
  const [type, token] = headers.authorization ? headers.authorization.split(' ') : [];
  if (type === 'Bearer') return token;
  return null;
}

module.exports = async function authenticate(req) {
  const token = getTokenFromHeader(req.headers);
  req.user = null;

  if (!token) return;

  let tokenInfo;
  try {
    tokenInfo = verifyToken(token, TOKEN_TYPE.ACCESS);
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
