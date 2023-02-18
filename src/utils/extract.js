async function getBody(req) {
  const buffers = [];
  for await (const chunk of req) buffers.push(chunk);
  const data = Buffer.concat(buffers).toString();
  return JSON.parse(data);
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

module.exports = { getBody, getId, getQuery, getPagination };
