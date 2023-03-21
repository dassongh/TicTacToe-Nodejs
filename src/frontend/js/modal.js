import { login } from './service';

const refs = {
  registerBtn: document.getElementById('registerBtn'),
  loginBtn: document.getElementById('loginBtn'),
  loginModal: document.getElementById('loginModal'),
  registerModal: document.getElementById('registerModal'),
};

refs.loginBtn.addEventListener('click', () => {
  refs.loginModal.style.display = 'block';
  const closeBtn = document.getElementById('loginClose');
  closeBtn.addEventListener('click', closeModal(refs.loginModal));

  const form = document.getElementById('modalForm');
  form.addEventListener('submit', async e => {
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
      form.childNodes.forEach(node => {
        node.value = '';
      });
      alert('Email or login incorrect');
      return;
    }

    const tokens = {
      access: parsedResponse.data.tokens.access,
      refresh: parsedResponse.data.tokens.refresh,
    };
    localStorage.setItem('accessToken', tokens.access);
    localStorage.setItem('refreshToken', tokens.refresh);
    location.assign('http://localhost:1111/game');
  });
});

refs.registerBtn.addEventListener('click', () => {
  refs.registerModal.style.display = 'block';
  const closeBtn = document.getElementById('registerClose');
  closeBtn.addEventListener('click', closeModal(refs.registerModal));
});

function closeModal(modal) {
  return () => {
    modal.style.display = 'none';
    removeEventListener(closeModal());
  };
}
