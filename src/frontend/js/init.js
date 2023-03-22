import { addAuthButtonsListeners, addGameButtonsListeners } from './main/addButtonsListeners';
import { renderWithoutToken, renderWithToken } from './main/render';
import { getCurrentUser } from './service';

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

  renderWithToken(user.data.nickname);
  addGameButtonsListeners(accessToken);
})();
