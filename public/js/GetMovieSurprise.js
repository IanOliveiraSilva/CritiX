
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
      <h2>${movie.Title} (${movie.Year})</h2>
      <img src="${movie.Poster}" alt="${movie.Title} poster">
      <p>${movie.Plot}</p>
      <ul>
        <li><strong>Director:</strong> ${movie.Director}</li>
        <li><strong>Released:</strong> ${movie.Released}</li>
        <li><strong>Writer:</strong> ${movie.Writer}</li>
        <li><strong>Country:</strong> ${movie.Country}</li>
        <li><strong>Box Office:</strong> ${movie.BoxOffice}</li>
        <li><strong>Awards:</strong> ${movie.Awards}</li>
        <li><strong>Actors:</strong> ${movie.Actors}</li>
        <li><strong>Genre:</strong> ${movie.Genre}</li>
        <li><strong>Runtime:</strong> ${movie.Runtime}</li>
        <li><strong>Rated:</strong> ${movie.Rated}</li>
        <li><strong>IMDb Rating:</strong> ${movie.imdbRating}</li>
        <li><strong>Metascore Rating:</strong> ${movie.Metascore}</li>
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