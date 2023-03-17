const httpError = require('./httpError');

module.exports = function actionHandler(action, mapProperty) {
  return async (req, res) => {
    let property = [];

    if (mapProperty) {
      if (Array.isArray(mapProperty)) {
        for (const prop of mapProperty) {
          if (prop.constructor.name === 'AsyncFunction') {
            property.push(await prop(req));
          } else {
            property.push(prop(req));
          }
        }
      } else {
        if (mapProperty.constructor.name === 'AsyncFunction') {
          property = [await mapProperty(req)];
        } else {
          property = [mapProperty(req)];
        }
      }
    }

    return action(...property)
      .then(result => sendResponseSuccess(res, result))
      .catch(err => sendResponseFail(res, err));
  };
};

function sendResponseSuccess(res, result) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  if (!result) {
    res.statusCode = 200;
    return res.end();
  }

  const { status = false, payload = false } = result;

  if (status && typeof status === 'number' && payload) {
    res.writeHead(status, headers);
    res.end(JSON.stringify(payload));
  } else if (status && typeof status === 'number' && !payload) {
    res.statusCode = status;
    res.end();
  } else if (!status && payload) {
    res.writeHead(200, headers);
    res.end(JSON.stringify(payload));
  } else {
    res.writeHead(200, headers);
    res.end(JSON.stringify(result));
  }
}

function sendResponseFail(res, error) {
  httpError(res, error.status || 500, error.message);
}
