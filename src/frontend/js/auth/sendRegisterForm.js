import { register } from '../service';

document.getElementById('form').addEventListener('submit', async e => {
  e.preventDefault();
  const data = new FormData(form);
  const registerPayload = {
    nickname: data.get('nickname'),
    fullname: data.get('fullname'),
    email: data.get('email'),
    password: data.get('password'),
  };

  let response, parsedResponse;
  try {
    response = await register(registerPayload);
    parsedResponse = await response.json();
  } catch (err) {
    console.error(err);
  }

  if (parsedResponse.error) {
    form.childNodes.forEach(node => (node.value = ''));
    alert(parsedResponse.error);
    return;
  }

  localStorage.setItem('accessToken', parsedResponse.data.tokens.access);
  localStorage.setItem('refreshToken', parsedResponse.data.tokens.refresh);
  location.assign('http://localhost:1111');
});
