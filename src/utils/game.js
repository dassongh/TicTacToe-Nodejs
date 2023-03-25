const winningConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const GAME_STATUS = {
  WIN: 'WIN',
  DRAW: 'DRAW',
  PLAYING: 'PLAYING',
};

function handleResultValidation(gameState) {
  let status = GAME_STATUS.PLAYING;

  for (const winCondition of winningConditions) {
    const a = gameState[winCondition[0]];
    const b = gameState[winCondition[1]];
    const c = gameState[winCondition[2]];
    if (a === -1 || b === -1 || c === -1) continue;
    if (a === b && b === c) {
      status = GAME_STATUS.WIN;
      break;
    }
  }

  return status;
}

module.exports = { handleResultValidation, GAME_STATUS };
