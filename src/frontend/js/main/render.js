export function renderWithoutToken() {
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

export function renderWithToken(nickname) {
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

export function renderBoard() {
  const container = document.querySelector('.game-container');
  const boardHtml = `
    <div class="board" id="board">
      <div data-cell-index="0" class="cell">X</div>
      <div data-cell-index="1" class="cell"></div>
      <div data-cell-index="2" class="cell">O</div>
      <div data-cell-index="3" class="cell"></div>
      <div data-cell-index="4" class="cell">X</div>
      <div data-cell-index="5" class="cell">O</div>
      <div data-cell-index="6" class="cell"></div>
      <div data-cell-index="7" class="cell"></div>
      <div data-cell-index="8" class="cell">X</div>
    </div>
  `;
  container.insertAdjacentHTML('beforeend', boardHtml);
}

export function renderLeaderboard(leaderboard) {
  const sidebar = document.getElementById('sidebar');
  const html = `
    <div class="leaderboard" id="leaderboard">
      <h2>Leaderboard</h2>
      <table>
        <thead>
          <tr>
            <th>Position</th>
            <th>Nickname</th>
            <th>Wins</th>
            <th>Losses</th>
            <th>Draws</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          ${leaderboard
            .map(
              (user, index) => `
                <tr>
                  <td>${index + 1}</td>
                  <td>${user.nickname}</td>
                  <td>${user.wins}</td>
                  <td>${user.losses}</td>
                  <td>${user.draws}</td>
                  <td>${user.score}</td>
                </tr>
              `
            )
            .join('')}
        </tbody>
      </table>
    </div>
  `;
  sidebar.insertAdjacentHTML('beforeend', html);
}
