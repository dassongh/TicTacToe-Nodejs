const { randomUUID } = require('crypto');
const { WebSocketServer } = require('ws');

// const userService = require('../user/user.service');
const redis = require('../../db/redis');
const authenticate = require('../../utils/authenticate');
const { webSocketError, customError } = require('../../utils/webSocketError');
const { Action_Types } = require('./websocket.constants');

function WebSocket(options) {
  this.wss = new WebSocketServer(options);
  this.wss.on('connection', async (socket, request) => {
    try {
      await authenticate(request);
    } catch (err) {
      console.error(err);
    }

    if (!request.user) {
      return webSocketError(socket, 'Unauthorized');
    }
    const userId = request.user.userId;
    socket.id = randomUUID();
    console.log('connected');

    socket.on('message', async data => {
      let parsedData;
      try {
        parsedData = JSON.parse(data);
      } catch (err) {
        return webSocketError(socket, err);
      }

      actionHandler[parsedData.action].call(this, socket, parsedData);
    });
  });
  this.wss.on('error', err => {
    console.error(err);
  });

  const actionHandler = {
    [Action_Types.CREATE]: createRoom,
    [Action_Types.JOIN]: joinRoom,
  };

  async function createRoom(socket) {
    const roomId = randomUUID();
    const roomData = {
      players: JSON.stringify([]),
      gameState: JSON.stringify([0, 0, 0, 0, 0, 0, 0, 0, 0]),
    };

    try {
      await redis.hSet(roomId, roomData);
    } catch (err) {
      return webSocketError(socket, err);
    }
    const response = JSON.stringify({ action: Action_Types.CREATED, roomId });
    return socket.send(response);
  }

  async function joinRoom(socket, data) {
    let room;
    try {
      room = await redis.hGetAll(data.roomId);
    } catch (err) {
      return webSocketError(socket, err);
    }

    if (!Object.keys(room).length) {
      return customError(socket, 'Room not found');
    }

    const players = JSON.parse(room.players);
    if (players.length === 2) {
      return customError(socket, 'Room is full');
    }

    players.push(socket.id);
    const updatePayload = { players: JSON.stringify(players) };
    try {
      await redis.hSet(data.roomId, updatePayload);
    } catch (err) {
      return webSocketError(socket, err);
    }

    let response;
    response = JSON.stringify({ action: Action_Types.JOINED });
    socket.send(response);
    if (players.length === 2) {
      response = JSON.stringify({ action: Action_Types.GAME_START });
      players.forEach(player => {
        this.wss.clients.forEach(client => {
          if (client.id !== player) return;
          client.send(response);
        });
      });
    }
  }
}

WebSocket.init = function (options) {
  return new WebSocket(options);
};

module.exports = WebSocket;
