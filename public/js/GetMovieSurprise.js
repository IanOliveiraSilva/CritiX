
document.addEventListener('DOMContentLoaded', () => {
const resultsList = document.querySelector('#results');

surpriseButton.addEventListener('click', async () => {
  const token = localStorage.getItem('token');
  try {
    const response = await fetch(`/api/movie/surpriseMe/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await response.json();

    if (response.ok) {
      const movie = data.body.movie;
      const movieDetails = document.createElement('div');
      resultsList.innerHTML = `
        <h2>${movie.title} (${movie.year})</h2>
        <img src="${movie.poster}" alt="${movie.title} poster">
        <p>${movie.plot}</p>
        <ul>
          <li><strong>Director:</strong> ${movie.director}</li>
          <li><strong>Released:</strong> ${movie.released}</li>
          <li><strong>Writer:</strong> ${movie.writer}</li>
          <li><strong>Country:</strong> ${movie.country}</li>
          <li><strong>Awards:</strong> ${movie.awards}</li>
          <li><strong>Actors:</strong> ${movie.actors}</li>
          <li><strong>Genre:</strong> ${movie.genre}</li>
          <li><strong>Runtime:</strong> ${movie.runtime}</li>
          <li><strong>IMDb Rating:</strong> ${movie.imdbrating}</li>
          <li><strong>Metascore Rating:</strong> ${movie.metascore}</li>
          <li><strong><button id="create-review-button">Criar Review</button></strong></li>
          <li><strong><button id="get-review-button">Ver Review</button></strong></li>
        </ul>
        <a href="" class="btn-back">Voltar</a>
      `;
      movieContainer.innerHTML = '';
      movieContainer.appendChild(movieDetails);

      const createReviewButton = document.getElementById('create-review-button');
      createReviewButton.addEventListener('click', () => {
        localStorage.setItem('movieTitle', movie.title);
        localStorage.setItem('movieGenre', movie.genre);
        window.location.href = '/createReview';
      });

      const getReviewButton = document.getElementById('get-review-button');
      getReviewButton.addEventListener('click', () => {
        localStorage.setItem('movieTitle', movie.title);
        window.location.href = '/getAllMovieReviews';
      });
    } else {
      console.error('Erro ao obter filme surpresa');
    }
  } catch (error) {
    console.error('Erro ao fazer a solicitação HTTP:', error);
  }
});
});