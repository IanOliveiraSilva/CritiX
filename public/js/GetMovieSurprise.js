document.addEventListener('DOMContentLoaded', () => {
  const resultsList = document.querySelector('#results');

  surpriseButton.addEventListener('click', async () => {
    try {
      const response = await fetch(`/api/movie/surpriseMe/`, {
        method: 'GET',
      });
      const data = await response.json();

      if (response.ok) {
        const movie = data.body.movie;
        const movieDetails = document.createElement('div');
        movieDetails.innerHTML = `
      <h2>${movie.title} (${movie.release_date.split('-')[0]})</h2>
      <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title} poster width="250" height="250">
      <p>${movie.overview}</p>
      <ul>
        <li><strong>Idioma original:</strong> ${movie.original_language}</li>
        <li><strong>Data de lançamento:</strong> ${movie.release_date}</li>
        <li><strong>Popularidade:</strong> ${movie.popularity}</li>
        <li><strong>Média de votos:</strong> ${movie.vote_average}</li>
        <li><strong>Total de votos:</strong> ${movie.vote_count}</li>
        <li><strong><button id="create-review-button">Criar Review</button></strong></li>
        <li><strong><button id="get-review-button">Ver Review</button></strong></li>
      </ul>
        <a href="" class="btn-back">Voltar</a>
      `;
        resultsList.innerHTML = '';
        resultsList.appendChild(movieDetails);

        const createReviewButton = document.getElementById('create-review-button');
        createReviewButton.addEventListener('click', () => {
          localStorage.setItem('movieTitle', movie.title);
          localStorage.setItem('movieGenre', movie.genre_ids);
          window.location.href = '/createReview';
        });

        const getReviewButton = document.getElementById('get-review-button');
        getReviewButton.addEventListener('click', () => {
          localStorage.setItem('movieTitle', movie.title);
          window.location.href = '/getAllMovieReviews';
        });

        resultsList.appendChild(li);
      } else {
        console.error('Erro ao obter filme surpresa');
      }
    } catch (error) {
      console.error('Erro ao fazer a solicitação HTTP:', error);
    }
  });
});
