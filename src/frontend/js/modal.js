import { login } from './service';
import { Base_Url } from './constants';

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

    // let response;
    // try {
    //   response = await login(loginPayload);
    // } catch (err) {
    //   console.error(err);
    // }
    login(loginPayload)
      .then(console.log)
      .catch(err => console.error(err));
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
    removeEventListener(closeModal);
  };
}
