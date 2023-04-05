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
    [ACTION_TYPES.LEAVE_GAME]: leaveGame,
    [ACTION_TYPES.PLAY_AGAIN]: playAgain,
    [ACTION_TYPES.RESET_GAME]: resetGame,
  };

  async function createRoom(socket) {
    const roomId = randomUUID();
    const roomData = {
      playersNicknames: [],
      players: [],
      playerTurn: Math.round(Math.random()),
      gameState: [-1, -1, -1, -1, -1, -1, -1, -1, -1],
    };

    try {
      await redis.set(roomId, JSON.stringify(roomData));
    } catch (err) {
      return webSocketError(socket, err);
    }
    const response = JSON.stringify({ action: ACTION_TYPES.CREATED, roomId });
    return socket.send(response);
  }

  async function joinRoom(socket, { roomId }) {
    let redisResponse;
    try {
      redisResponse = await redis.get(roomId);
    } catch (err) {
      return webSocketError(socket, err);
    }

    if (!redisResponse) {
      return customError(socket, 'Room not found');
    }

    const room = JSON.parse(redisResponse);

    if (room.length === 2) {
      return customError(socket, 'Room is full');
    }
    room.players.push(socket.id);

    let dbResponse;
    try {
      dbResponse = await userService.getById(socket.userId, 'id, nickname');
    } catch (err) {
      return webSocketError(socket, err);
    }
    const user = dbResponse.rows[0];

    room.playersNicknames.push(user.nickname);

    try {
      await redis.set(roomId, JSON.stringify(room));
    } catch (err) {
      return webSocketError(socket, err);
    }

    let response;
    response = JSON.stringify({ action: ACTION_TYPES.JOINED });
    socket.send(response);

    if (room.players.length === 2) {
      response = JSON.stringify({
        action: ACTION_TYPES.GAME_START,
        playersNicknames: room.playersNicknames,
        playerTurn: Number(room.playerTurn),
      });
      room.players.forEach(player => {
        this.wss.clients.forEach(client => {
          if (client.id !== player) return;
          client.send(response);
        });
      });
    }
  }

  async function handlePlayerTurn(socket, { roomId, playedCell }) {
    let redisResponse;
    try {
      redisResponse = await redis.get(roomId);
    } catch (err) {
      return webSocketError(socket, err);
    }

    const room = JSON.parse(redisResponse);

    room.gameState[playedCell] = Number(room.playerTurn);
    room.playerTurn = Number(room.playerTurn) === 0 ? 1 : 0;

    try {
      await redis.set(roomId, JSON.stringify(room));
    } catch (err) {
      return webSocketError(socket, err);
    }

    const gameStatus = handleResultValidation(room.gameState);

    const playersSockets = [];
    room.players.forEach(player => {
      this.wss.clients.forEach(client => {
        if (client.id !== player) return;
        playersSockets.push(client);
      });
    });

    if (gameStatus === GAME_STATUS.DRAW) {
      const userIds = playersSockets.map(socket => socket.userId);
      const filter = `id IN (${userIds.join(',')})`;
      const setStatement = `draws = draws + 1`;
      try {
        await userService.update(filter, setStatement);
      } catch (err) {
        return webSocketError(socket, err);
      }
    }

    if (gameStatus === GAME_STATUS.WIN) {
      const gameResult = playersSockets.reduce((result, socket) => {
        if (socket.id !== room.players[room.playerTurn]) {
          result.winnerId = socket.userId;
        } else {
          result.looserId = socket.userId;
        }
        return result;
      }, {});

      try {
        await Promise.all([
          userService.update(`id = ${gameResult.winnerId}`, `wins = wins + 1`),
          userService.update(`id = ${gameResult.looserId}`, `losses = losses + 1`),
        ]);
      } catch (err) {
        return webSocketError(socket, err);
      }
    }

    const response = JSON.stringify({
      action: ACTION_TYPES.STATE_UPDATED,
      gameState: room.gameState,
      gameStatus,
      playerTurn: room.playerTurn,
      playersNicknames: room.playersNicknames,
    });
    playersSockets.forEach(socket => socket.send(response));
  }

  async function leaveGame(socket, { roomId }) {
    let redisResponse;
    try {
      redisResponse = await redis.get(roomId);
    } catch (err) {
      return webSocketError(socket, err);
    }
    const room = JSON.parse(redisResponse);

    let dbResponse;
    try {
      dbResponse = await userService.getById(socket.userId, 'id, nickname');
    } catch (err) {
      return webSocketError(socket, err);
    }
    const user = dbResponse.rows[0];
    // todo: check again

    room.players = room.players.filter(player => player !== socket.id);
    room.playersNicknames = room.playersNicknames.filter(nickname => nickname !== user.nickname);

    try {
      await redis.set(roomId, JSON.stringify(room));
    } catch (err) {
      return webSocketError(socket, err);
    }

    const message = JSON.stringify({ action: ACTION_TYPES.GAME_LEFT });
    this.wss.clients.forEach(client => {
      if (client.id !== room.players[0]) return;
      client.send(message);
    });
  }

  async function playAgain(socket, { roomId }) {
    let redisResponse;
    try {
      redisResponse = await redis.get(roomId);
    } catch (err) {
      return webSocketError(socket, err);
    }
    const room = JSON.parse(redisResponse);

    const oppositePlayer = room.players.filter(player => player !== socket.id);
    this.wss.clients.forEach(client => {
      if (client.id !== oppositePlayer[0]) return;
      client.send(JSON.stringify({ action: ACTION_TYPES.PLAY_AGAIN }));
    });
  }

  async function resetGame(socket, { roomId }) {
    let redisResponse;
    try {
      redisResponse = await redis.get(roomId);
    } catch (err) {
      return webSocketError(socket, err);
    }
    const room = JSON.parse(redisResponse);

    room.playerTurn = Math.round(Math.random());
    room.gameState = [-1, -1, -1, -1, -1, -1, -1, -1, -1];

    try {
      await redis.set(roomId, JSON.stringify(room));
    } catch (err) {
      return webSocketError(socket, err);
    }

    const response = JSON.stringify({
      action: ACTION_TYPES.STATE_UPDATED,
      gameState: room.gameState,
      gameStatus: GAME_STATUS.PLAYING,
      playerTurn: room.playerTurn,
      playersNicknames: room.playersNicknames,
    });

    room.players.forEach(player => {
      this.wss.clients.forEach(client => {
        if (client.id !== player) return;
        client.send(response);
      });
    });
  }
}

WebSocket.init = options => new WebSocket(options);

module.exports = WebSocket;
