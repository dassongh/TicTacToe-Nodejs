import { clearUserData } from '../helpers/clearUserData';
import { addAuthButtonsListeners } from '../main/addButtonsListeners';
import { renderWithoutToken } from '../main/render';
import { logout } from '../service';

export function logoutUser(token) {
  return async () => {
    try {
      await logout(token);
    } catch (err) {
      console.error(err);
      return;
    }

    clearUserData();
    renderWithoutToken();
    addAuthButtonsListeners();
  };
}
