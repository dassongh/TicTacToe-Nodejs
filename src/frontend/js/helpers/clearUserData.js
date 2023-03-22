export function clearUserData() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  document.getElementById('user-data').innerHTML = '';
  document.getElementById('game-buttons').remove();
}
