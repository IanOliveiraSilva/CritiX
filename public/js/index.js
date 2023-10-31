document.getElementById('logout').addEventListener('click', function () {
  const confirmLogout = confirm('Tem certeza que deseja sair da conta?');
  if (confirmLogout) {
    localStorage.clear();
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
  const icon = localStorage.getItem('icon');

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
    document.getElementById('logout').textContent = `Sair da conta`;
    document.getElementById('get-started').href = `/getMovie`;
    document.getElementById('navbarDropdownMenuLink').innerHTML = `<img class="profile-image" src="${icon}"> ${username}`;

    document.getElementById('login-display').style.display = 'none';
    document.getElementById('signup-display').style.display = 'none';
  } else {
    document.getElementById('navbarDropdownMenuLink').textContent = `Conta`;
    document.getElementById('login-display').textContent = `Entre em sua conta`;
    document.getElementById('signup-display').textContent = `Crie uma conta`;
    document.getElementById('get-started').href = `/register`;

    document.getElementById('reviews-display').style.display = 'none';
    document.getElementById('lists-display').style.display = 'none';
    document.getElementById('watchlist-display').style.display = 'none';
    document.getElementById('profile-display').style.display = 'none';
    document.getElementById('username-display').style.display = 'none';
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

  var pumpkinImg = document.getElementById("pumpkin-img");

  pumpkinImg.addEventListener("mouseover", function () {
    pumpkinImg.src = "../images/aboboraAcessa.png";
  });

  pumpkinImg.addEventListener("mouseout", function () {
    pumpkinImg.src = "../images/39fa0ee71c5f3e20078dee1784f7e0c7.png";
  });

};

const token = localStorage.getItem('token')

document.addEventListener('DOMContentLoaded', async () => {

  const response = await fetch(`/api/movie/tendency`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  const movieData = await response.json();

  const filmsContainer = document.createElement('div');
  filmsContainer.classList.add('films-container');
  for (const movie of movieData.movies) {
    const movieId = movie.imdbid;

    const movieResponse = await fetch(`/api/movie/id?imdbID=${encodeURIComponent(movieId)}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const moviePoster = await movieResponse.json();

    const movieContainer = document.createElement('div');
    movieContainer.classList.add('movie-container');

    const movieLink = document.createElement('a');
    movieLink.href = '/getMovieByTitle';

    const posterImage = document.createElement('img');
    posterImage.src = moviePoster.body.movieData.Poster;
    posterImage.alt = 'Poster do Filme';
    posterImage.classList.add('movie-poster');

    movieLink.addEventListener('click', function () {
      localStorage.setItem('movieimbdId', moviePoster.body.movieData.imdbID);
    });

    movieLink.appendChild(posterImage);
    movieContainer.appendChild(movieLink);
    filmsContainer.appendChild(movieContainer);
  }
  const tendencySection = document.querySelector('#filmes-tendencia');
  tendencySection.appendChild(filmsContainer);
})