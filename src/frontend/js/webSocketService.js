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
    else alert('Missed connection');
  };

  const actionHandler = {
    [ACTION_TYPES.CREATED]: logCreatedRoom,
  };

  function logCreatedRoom(data) {
    const refs = {
      closeModalBtn: document.getElementById('modalBtn'),
      modalOverlay: document.getElementById('modalOverlay'),
      modal: document.getElementById('modal'),
    };
    const html = `
      <p class="modal-text">Your room id is "<span>${data.roomId}</span>"</p>
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
