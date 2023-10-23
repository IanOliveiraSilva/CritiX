document.getElementById('logout').addEventListener('click', function () {
  const confirmLogout = confirm('Tem certeza que deseja sair da conta?');
  if (confirmLogout) {
    localStorage.clear();
    alert('Logout bem-sucedido.');
  }
});

window.onload = function () {
  const sectionTitles = document.querySelectorAll('.section-title');
  const sectionTexts = document.querySelectorAll('.section-text');

  sectionTitles.forEach((title, index) => {
    setTimeout(() => {
      title.classList.add('animate__animated', 'animate__fadeInUp');
    }, index * 200);
  });

  sectionTexts.forEach((text, index) => {
    setTimeout(() => {
      text.classList.add('animate__animated', 'animate__fadeIn');
    }, index * 200);
  });

  const menuItems = document.querySelectorAll('.nav-link');

  menuItems.forEach(item => {
    item.addEventListener('mouseover', () => {
      item.classList.add('animate__animated', 'animate__pulse');
    });

    item.addEventListener('mouseout', () => {
      item.classList.remove('animate__animated', 'animate__pulse');
    });
  });

  const requireLoginLinks = document.querySelectorAll('.require-login');
  const username = localStorage.getItem('username');

  requireLoginLinks.forEach(function (link) {
    link.addEventListener('click', function (event) {
      if (!username) {
        event.preventDefault();
        alert('Você precisa estar logado para acessar esta página.');
        window.location.href = '/login';
      }
    });
  });

  if (username) {
    document.getElementById('username-display').textContent = `Olá, ${username}!`;
    document.getElementById('logout').textContent = `Sair da conta`;
    document.getElementById('profile').textContent = `Meu Perfil`;


    document.getElementById('login-display').style.display = 'none';
    document.getElementById('signup-display').style.display = 'none';
  } else {
    document.getElementById('login-display').textContent = `Entre em sua conta`;
    document.getElementById('signup-display').textContent = `Crie uma conta`;

    document.getElementById('profile').style.display = 'none';
    document.getElementById('create-list-display').style.display = 'none';
  }

  const navbar = document.querySelector('.navbar');
  navbar.style.backgroundColor = 'black';
  navbar.style.color = 'yellow';

  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    item.style.transition = '0.3s';
    item.addEventListener('mouseenter', () => {
      item.style.transform = 'scale(1.1)';
    });
    item.addEventListener('mous eleave', () => {
      item.style.transform = 'scale(1)';
    });
  });

  const usernameDisplay = document.getElementById('username-display');
  usernameDisplay.innerHTML = `<i class="fas fa-user"></i> Olá, ${username}!`;
};