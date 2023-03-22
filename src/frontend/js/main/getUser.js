import { getCurrentUser } from '../service';

export async function getUser() {
  const userDiv = document.getElementById('user-data');
  const authButtons = document.getElementById('auth-buttons');
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
    return;
  }

  authButtons.remove();
  const html = `<p>Welcome back, ${user.data.nickname}!</p>`;
  const playButtonsHtml = `
    <div class="buttons">
      <button id="loginBtn" class="button">Create game</button>
      <button id="registerBtn" class="button">Join game</button>
    </div>
  `;
  userDiv.insertAdjacentHTML('afterbegin', html);
  userDiv.insertAdjacentHTML('afterend', playButtonsHtml);
}
