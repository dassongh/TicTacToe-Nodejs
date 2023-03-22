import { getCurrentUser } from '../service';

(async () => {
  const userDiv = document.getElementById('user-data');
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
    const html = '<p>Login or register to enjoy the game</p>';

    userDiv.insertAdjacentHTML('afterbegin', html);
  }
})();
