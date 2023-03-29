export async function renderWithoutToken() {
  const userDiv = document.getElementById('user-data');
  const html = '<p>Login or register to enjoy the game</p>';
  const authButtonsHtml = `
    <div id="auth-buttons" class="buttons">
        <button id="loginBtn" class="button">Login</button>
        <button id="registerBtn" class="button">Register</button>
    </div>
  `;
  userDiv.insertAdjacentHTML('beforebegin', authButtonsHtml);
  userDiv.innerHTML = html;
}

export async function renderWithToken(nickname) {
  const userDiv = document.getElementById('user-data');
  const html = `<p>Welcome back, ${nickname}!</p>`;
  const playButtonsHtml = `
    <div id="game-buttons" class="buttons">
      <button id="createBtn" class="button">Create game</button>
      <button id="joinBtn" class="button">Join game</button>
      <button id="logoutBtn" class="button">Logout</button>
    </div>
  `;
  userDiv.innerHTML = html;
  userDiv.insertAdjacentHTML('afterend', playButtonsHtml);
}
