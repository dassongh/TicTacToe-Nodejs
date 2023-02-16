const httpError = require('./httpError');

function actionHandler(action, mapProperty) {
  return async (req, res) => {
    let property = [];

    if (mapProperty) {
      if (mapProperty.constructor.name === 'AsyncFunction') {
        property = [await mapProperty(req)];
      }

      // if (Array.isArray(mapProperty)) {
      //   property = mapProperty.map(property => property(req));
      // } else {
      //   property = [mapProperty(req)];
      // }
    }

    return action(...property)
      .then(result => sendResponseSuccess(res, result))
      .catch(err => sendResponseFail(res, err));
  };
}

function sendResponseSuccess(res, result) {
  if (!result) {
    res.statusCode = 200;
    return res.end();
  }

  const { status = false, payload = false } = result;

  if (status && typeof status === 'number' && payload) {
    res.writeHead(status, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(payload));
  } else if (status && typeof status === 'number' && !payload) {
    res.statusCode = status;
    res.end();
  } else if (!status && payload) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(payload));
  } else {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(result));
  }
}

function sendResponseFail(res, error) {
  httpError(res, error.status || 500, error.message);
}

module.exports = actionHandler;
