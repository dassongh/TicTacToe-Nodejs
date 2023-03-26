import { ACTION_TYPES } from './constants';

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

  function gameStart({ playerTurn }) {
    const refs = {
      board: document.getElementById('board'),
      userDiv: document.getElementById('user-data'),
    };
    const buttonHTML = `
      <div id="game-buttons" class="buttons">
        <button id="leaveGame" class="button">Leave game</button>
      </div>
    `;
    refs.userDiv.innerHTML = '<p>Turn</p>';
    refs.userDiv.insertAdjacentHTML('afterend', buttonHTML);
    refs.board.classList.remove('board-animated');
    refs.board.childNodes.forEach(node => (node.innerHTML = ''));
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
  const message = { action: ACTION_TYPES.JOIN, roomId };
  this.socket.send(JSON.stringify(message));
};
