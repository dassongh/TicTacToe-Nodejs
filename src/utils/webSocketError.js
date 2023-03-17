const { Action_Types } = require('../modules/websocket/websocket.constants');

function webSocketError(socket, error) {
  console.error(error);
  socket.send(JSON.stringify({ action: Action_Types.ERROR, message: error.message }));
  socket.close();
}

function customError(socket, message) {
  const errMessage = JSON.stringify({
    action: Action_Types.ERROR,
    message,
  });
  socket.send(errMessage);
}

module.exports = { webSocketError, customError };
