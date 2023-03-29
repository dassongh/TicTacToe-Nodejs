export const BASE_URL = 'http://localhost:1111';
export const WEB_SOCKET_URL = 'ws://localhost:1111';
export const ACTION_TYPES = {
  ERROR: 'ERROR',
  FIND: 'FIND',
  CREATE: 'CREATE',
  CREATED: 'CREATED',
  JOIN: 'JOIN',
  GAME_START: 'GAME_START',
  JOINED: 'JOINED',
  PLAYER_TURN: 'PLAYER_TURN',
  STATE_UPDATED: 'STATE_UPDATED',
  LEAVE_GAME: 'LEAVE_GAME',
  GAME_LEFT: 'GAME_LEFT',
};

export const GAME_STATUS = {
  WIN: 'WIN',
  DRAW: 'DRAW',
  PLAYING: 'PLAYING',
};
