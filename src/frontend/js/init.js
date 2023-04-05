import { WEB_SOCKET_URL } from './constants';
import { addAuthButtonsListeners, addGameButtonsListeners } from './main/addButtonsListeners';
import { renderLeaderboard, renderWithoutToken, renderWithToken } from './main/render';
import { getCurrentUser, getLeaderboard } from './service';
import { WebSocketService } from './webSocketService';

(async () => {
  const accessToken = localStorage.getItem('accessToken');

  let user;
  try {
    user = await getCurrentUser(accessToken).then(res => res.json());
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

  let leaderboard;
  try {
    leaderboard = await getLeaderboard(accessToken).then(res => res.json());
  } catch (err) {
    console.error(err);
    return;
  }

  renderLeaderboard(leaderboard.data);

  const connectionUrl = `${WEB_SOCKET_URL}?token=${accessToken}`;
  WebSocketService.init(connectionUrl);
})();
