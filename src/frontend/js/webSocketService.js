import { ACTION_TYPES, GAME_STATUS } from './constants';
import { addGameButtonsListeners } from './main/addButtonsListeners';
import { renderWithToken } from './main/render';

export function WebSocketService(url) {
  this.instance;
  this.socket = new WebSocket(url);
  this.socket.onopen = () => console.log('connected');

  this.socket.onmessage = ({ data }) => {
    let parsedData;
    try {
      parsedData = JSON.parse(data);
    } catch (err) {
      console.error(err);
      return;
    }
    console.log(parsedData);
    actionHandler[parsedData.action].call(this, parsedData);
  };

  this.socket.onclose = event => {
    if (event.wasClean) alert('Clean disconnect');
    // else alert('Missed connection');
  };

  const actionHandler = {
    [ACTION_TYPES.CREATED]: logCreatedRoom,
    [ACTION_TYPES.JOINED]: waitForGameToStart,
    [ACTION_TYPES.GAME_START]: gameStart,
    [ACTION_TYPES.STATE_UPDATED]: stateUpdated,
    [ACTION_TYPES.GAME_LEFT]: gameLeft,
    [ACTION_TYPES.PLAY_AGAIN]: playAgain,
  };

  function logCreatedRoom({ roomId }) {
    const refs = {
      closeModalBtn: document.getElementById('modalBtn'),
      modalOverlay: document.getElementById('modalOverlay'),
      modal: document.getElementById('modal'),
    };
    const html = `
      <p class="modal-text">Your room id is "<span>${roomId}</span>"</p>
      <p>Use it to join a game and send it to your friend</p>
    `;
    refs.modal.insertAdjacentHTML('beforeend', html);
    refs.modalOverlay.classList.remove('modal-overlay-is-hidden');
    refs.closeModalBtn.addEventListener('click', () => {
      refs.modalOverlay.classList.add('modal-overlay-is-hidden');
      const nodesToRemove = [...refs.modal.childNodes].slice(2);
      nodesToRemove.forEach(node => node.remove());
    });
  }

  function waitForGameToStart() {
    const refs = {
      board: document.getElementById('board'),
      userDiv: document.getElementById('user-data'),
      buttons: document.getElementById('game-buttons'),
    };
    refs.board.classList.add('board-animated');
    refs.buttons.remove();
    refs.userDiv.innerHTML = '<p>Waiting for another user to connect</p>';
  }

  function gameStart({ playersNicknames, playerTurn }) {
    const refs = {
      board: document.getElementById('board'),
      userDiv: document.getElementById('user-data'),
    };

    const buttonHTML = `
      <div id="game-buttons" class="buttons">
        <button id="leaveGame" class="button">Leave game</button>
      </div>
    `;
    refs.userDiv.insertAdjacentHTML('afterend', buttonHTML);

    const leaveGameBtn = document.getElementById('leaveGame');
    leaveGameBtn.addEventListener('click', handleLeaveGameBtnClick.bind(this));

    const nickname = sessionStorage.getItem('nickname');
    const isYourTurn = playersNicknames[playerTurn] === nickname ? 1 : 0;
    sessionStorage.setItem('isYourTurn', isYourTurn);
    const turnMessage = isYourTurn
      ? '<p>It is your turn</p>'
      : `<p>It is ${playersNicknames[playerTurn]} turn</p>`;
    refs.userDiv.innerHTML = turnMessage;

    refs.board.classList.remove('board-animated');
    refs.board.childNodes.forEach(node => {
      node.innerHTML = '';
      node.addEventListener('click', handleCellClick.bind(this));
    });
  }

  function stateUpdated({ gameState, gameStatus, playerTurn, playersNicknames }) {
    const refs = {
      cells: document.querySelectorAll('.cell'),
      userDiv: document.getElementById('user-data'),
    };

    let message;
    if (gameStatus === GAME_STATUS.WIN) {
      const winner = playersNicknames[playerTurn === 1 ? 0 : 1];
      message = `<p>Player ${winner} wins!</p>`;

      const buttonContainer = document.getElementById('game-buttons');
      const buttonHTML = '<button id="playAgainBtn" class="button">Play again</button>';
      buttonContainer.insertAdjacentHTML('afterbegin', buttonHTML);
      document.getElementById('playAgainBtn').addEventListener('click', handlePlayAgainBtnClick.bind(this));
    }

    if (gameStatus === GAME_STATUS.DRAW) {
      message = `<p>It is a draw</p>`;

      const buttonContainer = document.getElementById('game-buttons');
      const buttonHTML = '<button id="playAgainBtn" class="button">Play again</button>';
      buttonContainer.insertAdjacentHTML('afterbegin', buttonHTML);
      document.getElementById('playAgainBtn').addEventListener('click', handlePlayAgainBtnClick.bind(this));
    }

    if (gameStatus === GAME_STATUS.PLAYING) {
      const nickname = sessionStorage.getItem('nickname');
      const isYourTurn = playersNicknames[playerTurn] === nickname ? 1 : 0;
      sessionStorage.setItem('isYourTurn', isYourTurn);
      message = isYourTurn ? '<p>It is your turn</p>' : `<p>It is ${playersNicknames[playerTurn]} turn</p>`;
    }

    refs.userDiv.innerHTML = message;

    refs.cells.forEach(cell => {
      const cellIndex = Number(cell.getAttribute('data-cell-index'));
      gameState.forEach((el, index) => {
        if (cellIndex !== index) return;
        if (el === -1) cell.innerText = '';
        if (el === 0) cell.innerText = 'O';
        if (el === 1) cell.innerText = 'X';
      });
    });
  }

  function gameLeft() {
    alert('Your opponent left the game!');

    document.getElementById('game-buttons').remove();
    renderWithToken(sessionStorage.getItem('nickname'));
    addGameButtonsListeners(localStorage.getItem('accessToken'));
  }

  function playAgain() {
    const refs = {
      closeModalBtn: document.getElementById('modalBtn'),
      modalOverlay: document.getElementById('modalOverlay'),
      modal: document.getElementById('modal'),
    };

    const html = `
      <p class="modal-text">Your opponents wants to play again</p>
      <button id="denyBtn" class="button">Deny</button>
      <button id="acceptBtn" class="button">Accept</button>
    `;
    refs.modal.insertAdjacentHTML('beforeend', html);
    refs.modalOverlay.classList.remove('modal-overlay-is-hidden');

    const denyBtn = document.getElementById('denyBtn');
    denyBtn.addEventListener('click', handleDenyGameBtnClick.bind(this));

    const acceptBtn = document.getElementById('acceptBtn');
    acceptBtn.addEventListener('click', handleAcceptGameBtnClick.bind(this));

    refs.closeModalBtn.addEventListener('click', handleDenyGameBtnClick.bind(this));
  }

  function handleCellClick(event) {
    const isYourTurn = Number(sessionStorage.getItem('isYourTurn'));
    if (!isYourTurn) return;

    const clickedCell = event.target;
    const clickedCellIndex = Number(clickedCell.getAttribute('data-cell-index'));
    const params = new URLSearchParams(window.location.search);
    const roomId = params.get('roomId');

    const message = JSON.stringify({
      action: ACTION_TYPES.PLAYER_TURN,
      roomId,
      playedCell: clickedCellIndex,
    });
    this.socket.send(message);
  }

  function handleLeaveGameBtnClick() {
    document.getElementById('game-buttons').remove();

    renderWithToken(sessionStorage.getItem('nickname'));
    addGameButtonsListeners(localStorage.getItem('accessToken'));

    const params = new URLSearchParams(window.location.search);
    const roomId = params.get('roomId');
    const message = JSON.stringify({ action: ACTION_TYPES.LEAVE_GAME, roomId });
    this.socket.send(message);
  }

  function handleDenyGameBtnClick() {
    const modalOverlay = document.getElementById('modalOverlay');
    modalOverlay.classList.add('modal-overlay-is-hidden');

    const modal = document.getElementById('modal');
    const nodesToRemove = [...modal.childNodes].slice(2);
    nodesToRemove.forEach(node => node.remove());

    const params = new URLSearchParams(window.location.search);
    const roomId = params.get('roomId');
    const message = JSON.stringify({ action: ACTION_TYPES.LEAVE_GAME, roomId });
    this.socket.send(message);
  }

  function handleAcceptGameBtnClick() {
    const modalOverlay = document.getElementById('modalOverlay');
    modalOverlay.classList.add('modal-overlay-is-hidden');

    const modal = document.getElementById('modal');
    const nodesToRemove = [...modal.childNodes].slice(2);
    nodesToRemove.forEach(node => node.remove());

    const params = new URLSearchParams(window.location.search);
    const roomId = params.get('roomId');
    const message = JSON.stringify({ action: ACTION_TYPES.RESET_GAME, roomId });
    this.socket.send(message);
  }

  function handlePlayAgainBtnClick() {
    const params = new URLSearchParams(window.location.search);
    const roomId = params.get('roomId');
    const message = JSON.stringify({ action: ACTION_TYPES.PLAY_AGAIN, roomId });
    this.socket.send(message);
  }
}

WebSocketService.init = function (url) {
  this.instance = new WebSocketService(url);
};

WebSocketService.getInstance = function () {
  return this.instance;
};

WebSocketService.prototype.createGame = function () {
  const message = { action: ACTION_TYPES.CREATE };
  this.socket.send(JSON.stringify(message));
};

WebSocketService.prototype.joinGame = function (roomId) {
  const params = new URLSearchParams(window.location.search);
  params.set('roomId', roomId);
  window.history.replaceState({}, '', `${window.location.pathname}?${params}`);

  const message = { action: ACTION_TYPES.JOIN, roomId };
  this.socket.send(JSON.stringify(message));
};
