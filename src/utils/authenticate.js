const { verifyToken } = require('./jwtToken');
const { TOKEN_TYPE } = require('../modules/auth/auth.constants');
const sessionService = require('../modules/auth/auth.service');

function getTokenFromHeader(headers) {
  const [type, token] = headers.authorization ? headers.authorization.split(' ') : [];
  if (type === 'Bearer') return token;
  return null;
}

async function authenticate(req, res) {
  const token = getTokenFromHeader(req.headers);
  const deviceId = req.socket.localAddress || req.socket.remoteAddress;

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
    sessionDbResult = await sessionService.findByFilter(
      `"userId" = '${tokenInfo.userId}' AND "deviceId" = '${deviceId}'`
    );
  } catch (err) {
    throw new DBError(err);
  }
  if (!sessionDbResult.rowCount) return;

  req.user = { userId: tokenInfo.userId, deviceId };
  return;
}

module.exports = authenticate;
