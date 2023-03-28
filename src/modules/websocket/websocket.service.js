const { randomUUID } = require('crypto');
const { WebSocketServer } = require('ws');

const userService = require('../user/user.service');
const redis = require('../../db/redis');
const authenticate = require('../../utils/authenticate');
const { handleResultValidation, GAME_STATUS } = require('../../utils/game');
const { webSocketError, customError } = require('../../utils/webSocketError');
const { ACTION_TYPES } = require('./websocket.constants');

function WebSocket(options) {
  this.wss = new WebSocketServer(options);

  this.wss.on('connection', async (socket, request) => {
    try {
      await authenticate(request, true);
    } catch (err) {
      console.error(err);
    }

    if (!request.user) {
      return customError(socket, 'Unauthorized');
    }

    socket.id = randomUUID();
    socket.userId = request.user.userId;

    console.log('connected');

    socket.on('message', async data => {
      let parsedData;
      try {
        parsedData = JSON.parse(data);
      } catch (err) {
        return webSocketError(socket, err);
      }

      if (!actionHandler[parsedData.action]) {
        console.log(parsedData);
        return;
      }

      actionHandler[parsedData.action].call(this, socket, parsedData);
    });
  });

  this.wss.on('error', err => {
    console.error(err);
  });

  const actionHandler = {
    [ACTION_TYPES.CREATE]: createRoom,
    [ACTION_TYPES.JOIN]: joinRoom,
    [ACTION_TYPES.PLAYER_TURN]: handlePlayerTurn,
  };

  async function createRoom(socket) {
    const roomId = randomUUID();
    const playerTurn = Math.round(Math.random());
    const roomData = {
      playersNicknames: JSON.stringify([]),
      players: JSON.stringify([]),
      playerTurn,
      gameState: JSON.stringify([-1, -1, -1, -1, -1, -1, -1, -1, -1]),
    };

    try {
      await redis.hSet(roomId, roomData);
    } catch (err) {
      return webSocketError(socket, err);
    }
    const response = JSON.stringify({ action: ACTION_TYPES.CREATED, roomId });
    return socket.send(response);
  }

  async function joinRoom(socket, { roomId }) {
    let room;
    try {
      room = await redis.hGetAll(roomId);
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

    let dbResult;
    try {
      dbResult = await userService.getById(socket.userId, 'id, nickname');
    } catch (err) {
      return webSocketError(socket, err);
    }
    const user = dbResult.rows[0];

    const playersNicknames = JSON.parse(room.playersNicknames);
    playersNicknames.push(user.nickname);

    const updatePayload = {
      players: JSON.stringify(players),
      playersNicknames: JSON.stringify(playersNicknames),
    };
    try {
      await redis.hSet(roomId, updatePayload);
    } catch (err) {
      return webSocketError(socket, err);
    }

    let response;
    response = JSON.stringify({ action: ACTION_TYPES.JOINED });
    socket.send(response);

    if (players.length === 2) {
      response = JSON.stringify({
        action: ACTION_TYPES.GAME_START,
        playersNicknames,
        playerTurn: Number(room.playerTurn),
      });
      players.forEach(player => {
        this.wss.clients.forEach(client => {
          if (client.id !== player) return;
          client.send(response);
        });
      });
    }
  }

  async function handlePlayerTurn(socket, { roomId, playedCell }) {
    let room;
    try {
      room = await redis.hGetAll(roomId);
    } catch (err) {
      return webSocketError(socket, err);
    }

    const newState = Array.from(JSON.parse(room.gameState));
    newState[playedCell] = Number(room.playerTurn);

    const updatePayload = {
      gameState: JSON.stringify(newState),
      playerTurn: Number(room.playerTurn) === 0 ? 1 : 0,
    };
    try {
      await redis.hSet(roomId, updatePayload);
    } catch (err) {
      return webSocketError(socket, err);
    }

    const gameStatus = handleResultValidation(newState);

    const response = JSON.stringify({
      action: ACTION_TYPES.STATE_UPDATED,
      gameState: newState,
      gameStatus,
      playerTurn: updatePayload.playerTurn,
      playersNicknames: JSON.parse(room.playersNicknames),
    });
    const players = JSON.parse(room.players);
    players.forEach(player => {
      this.wss.clients.forEach(client => {
        if (client.id !== player) return;
        client.send(response);
      });
    });
  }
}

WebSocket.init = options => new WebSocket(options);

module.exports = WebSocket;
