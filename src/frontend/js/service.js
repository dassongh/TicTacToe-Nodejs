import { Base_Url } from './constants';

export function login(data) {
  return fetch(`${Base_Url}auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
}
