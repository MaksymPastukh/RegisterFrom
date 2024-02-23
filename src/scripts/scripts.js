document.addEventListener('DOMContentLoaded', function (e) {
  e.preventDefault();

  const form = document.getElementById('form'),
    fullName = document.getElementById('name'),
    userName = document.getElementById('username'),
    email = document.getElementById('email'),
    password = document.getElementById('password'),
    confirmPassword = document.getElementById('password2'),
    checkbox = document.getElementById('checkbox'),
    btn = document.querySelectorAll('.btn-ok'),
    popup = document.querySelector('.popup'),
    closeOk = document.querySelector('.popup-btn'),
    formControl = document.querySelectorAll('.user-login'),
    mainTitle = document.querySelector('.main-title'),
    link = document.querySelector('#link'),
    btnSing = document.querySelector('.btnSing');

  function checkFullName(name) {
    name.addEventListener('input', e => {
      name.value = fullName.value.replaceAll(/\d/g, '');
      if (fullName.value) {
        console.log('Отлично');
      }
      e.preventDefault();
    });
  }

  checkFullName(fullName);

  function checkUserName(login) {
    login.addEventListener('keydown', e => {
      if (e.key === '.' || e.key === ',') {
        e.preventDefault();
        console.log('Запрещено использовать символы ". ,"');
        alert('Запрещено использовать символы ". ,"');
      }
      console.log('Отлично');
    });
  }

  checkUserName(userName);

  function checkEmail(mail) {
    const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
    if (!mail.value.match(emailPattern)) {
      alert('Введен не коректный Email');
      return false;
    }
    return true;
  }

  function createPass(pass) {
    const passPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!pass.value.match(passPattern)) {
      alert('Введен не коректный пароль');
      return false;
    }
    return true;
  }

  function checkPassword(pass1, pass2) {
    if (pass1.value !== pass2.value || pass2.value === '') {
      alert('Пароли не совпадают');
      return false;
    } else {
      return true;
    }
  }

  link.addEventListener('click', e => {
    e.preventDefault();
    formControl.forEach(item => {
      item.remove();
    });
    link.remove();
    mainTitle.textContent = 'Log in to the system';
    btnSing.textContent = 'Sign In';

    btnSing.addEventListener('click', e => {
      e.preventDefault();

      if (!userName.value) {
        return alert('Введите логин');
      }

      const checkLogPass = createPass(password);
      if (!checkLogPass) return;

      if (!userName.value && !password.value) {
        return alert('Введите данные');
      } else {
        alert(`Добро пожаловать ${userName.value}!`);
        form.reset();
      }
    });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    if (!fullName.value) {
      console.log('Введите имя');
      alert('Введите имя');
      return false;
    }
    if (!userName.value) {
      console.log('Введите логин');
      alert('Введите логин');
      return false;
    }

    if (!email.value) {
      console.log('Введите email');
      alert('Введите email');
      return false;
    }

    const isCheckEmail = checkEmail(email);
    if (!isCheckEmail) return;

    const isCheckPass = createPass(password);
    if (!isCheckPass) return;

    const isCheckPass2 = checkPassword(password, confirmPassword);
    if (!isCheckPass2) return;

    if (checkbox.checked) {
      popup.style.display = 'block';
      document.body.style.overflow = 'hidden';
    } else {
      return alert(
        'Согласитесь с нашими Условиями предоставления услуг и Положением о конфиденциальности'
      );
    }

    closeOk.addEventListener('click', () => {
      popup.style.display = 'none';
      document.body.style.overflow = '';
    });

    popup.addEventListener('click', e => {
      if (e.target === popup) {
        popup.style.display = 'none';
        document.body.style.overflow = '';
      }
    });

    form.reset();

    btn.forEach(item => {
      item.addEventListener('click', e => {
        e.preventDefault();

        formControl.forEach(item => {
          item.remove();
        });
        link.remove();
        mainTitle.textContent = 'Log in to the system';
        btnSing.textContent = 'Sign In';

        btnSing.addEventListener('click', e => {
          e.preventDefault();

          const isCheckPass = createPass(password);

          if (!isCheckPass) return;

          if (!userName.value && !password.value) {
            console.log('Error');
          } else {
            alert(`Добро пожаловать ${userName.value}!`);
            form.reset();
          }
        });
      });
    });
  });
});
