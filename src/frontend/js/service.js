import { BASE_URL } from './constants';

export function login(data) {
  return fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
}

export function getCurrentUser() {
  return fetch(`${BASE_URL}/api/user`);
}
