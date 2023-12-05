import { login } from '../service';

document.getElementById('form').addEventListener('submit', async e => {
  e.preventDefault();
  const data = new FormData(form);
  const loginPayload = {
    email: data.get('email'),
    password: data.get('password'),
  };

  let response, parsedResponse;
  try {
    response = await login(loginPayload);
    parsedResponse = await response.json();
  } catch (err) {
    console.error(err);
  }

  if (parsedResponse.error) {
    form.childNodes.forEach(node => (node.value = ''));
    alert('Email or login incorrect');
    return;
  }

  localStorage.setItem('accessToken', parsedResponse.data.tokens.access);
  localStorage.setItem('refreshToken', parsedResponse.data.tokens.refresh);
  location.assign('http://localhost:8080');
});
