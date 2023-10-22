document.getElementById('logout').addEventListener('click', function () {
  const confirmLogout = confirm('Tem certeza que deseja sair da conta?');
  if (confirmLogout) {
    localStorage.clear();
    alert('Logout bem-sucedido.');
  }
});

window.onload = function () {
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
};