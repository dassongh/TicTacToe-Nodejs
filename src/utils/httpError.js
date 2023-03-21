module.exports = function httpError(res, status, message) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };
  res.writeHead(status, headers);
  res.end(JSON.stringify({ error: message }));
};
