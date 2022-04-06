import validator from 'validator';
export default class Login {
  constructor (formClass) {
    this.form = document.querySelector(formClass);
  }
  init() {
    this.events();
  }
  events() {
    if (!this.form) return;
    this.form.addEventListener('submit', e => {
      e.preventDefault();
      // alert('form');
      this.validate(e);
    });
  }
  validate(e) {
    const el = e.target;
    const emailInput = el.querySelector('input[name="email"]');
    const passwordInput = el.querySelector('input[name="password"]');
    const email = emailInput.value;
    const password = passwordInput.value;
    console.log('frontend: '+email);
    console.log('frontend: '+password);
    let error = false;
    if (!validator.isEmail(email)) {
      alert('Email inválido.');
      error = true;
    }
    if (password < 3) {
      alert('Senha maior que 3 caracteres');
      error = true;
    }
    console.log('error = ',error);
    if (!error) el.submit();
  }
}