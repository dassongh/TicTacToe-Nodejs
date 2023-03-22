const { ACTION_TYPES } = require('../modules/websocket/websocket.constants');

function webSocketError(socket, error) {
  console.error(error);
  socket.send(JSON.stringify({ action: ACTION_TYPES.ERROR, message: error.message }));
  socket.close();
}

function customError(socket, message) {
  const errMessage = JSON.stringify({
    action: ACTION_TYPES.ERROR,
    message,
  });
  socket.send(errMessage);
}

module.exports = { webSocketError, customError };
