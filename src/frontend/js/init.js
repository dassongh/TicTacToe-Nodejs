import { WEB_SOCKET_URL } from './constants';
import { addAuthButtonsListeners, addGameButtonsListeners } from './main/addButtonsListeners';
import { renderWithoutToken, renderWithToken } from './main/render';
import { getCurrentUser } from './service';
import { WebSocketService } from './webSocketService';

(async () => {
  const accessToken = localStorage.getItem('accessToken');

  let response, user;
  try {
    response = await getCurrentUser(accessToken);
    user = await response.json();
  } catch (err) {
    console.error(err);
    return;
  }

  if (user.error) {
    renderWithoutToken();
    return addAuthButtonsListeners();
  }

  sessionStorage.setItem('nickname', user.data.nickname);
  renderWithToken(user.data.nickname);
  addGameButtonsListeners(accessToken);

  const connectionUrl = `${WEB_SOCKET_URL}?token=${accessToken}`;
  WebSocketService.init(connectionUrl);
})();
