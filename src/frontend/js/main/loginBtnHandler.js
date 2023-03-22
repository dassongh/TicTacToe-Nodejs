import { BASE_URL } from '../constants';

document.getElementById('loginBtn').addEventListener('click', () => {
  location.assign(`${BASE_URL}/login`);
});
