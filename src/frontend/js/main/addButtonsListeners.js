import { logoutUser } from '../auth/logoutUser';
import { BASE_URL } from '../constants';
import { WebSocketService } from '../webSocketService';

export function addAuthButtonsListeners() {
  document.getElementById('loginBtn').addEventListener('click', () => {
    location.assign(`${BASE_URL}/login`);
  });
  document.getElementById('registerBtn').addEventListener('click', () => {
    location.assign(`${BASE_URL}/register`);
  });
}

export function addGameButtonsListeners(token) {
  document.getElementById('logoutBtn').addEventListener('click', logoutUser(token));
  document.getElementById('createBtn').addEventListener('click', () => {
    const ws = WebSocketService.getInstance();
    ws.createGame();
  });
}
