import { BASE_URL } from '../constants';

document.getElementById('registerBtn').addEventListener('click', () => {
  location.assign(`${BASE_URL}/register`);
});
