async function getBody(req) {
  const buffers = [];
  for await (const chunk of req) buffers.push(chunk);
  const data = Buffer.concat(buffers).toString();

  let parsedData;
  try {
    parsedData = JSON.parse(data);
  } catch (err) {
    console.error(err);
  }

  return parsedData;
}

function getId(req) {
  return req.params.id;
}

function getQuery(req) {
  return req.query;
}

function getPagination(req) {
  return {
    page: Number(req.query.page) || 1,
    limit: Number(req.query.limit) || 10,
  };
}

function getDeviceId(req) {
  return req.socket.localAddress || req.socket.remoteAddress;
}

function getCurrentUserId(req) {
  if (!req.user) return null;
  return Number(req.user.userId);
}

module.exports = { getBody, getId, getQuery, getPagination, getDeviceId, getCurrentUserId };
