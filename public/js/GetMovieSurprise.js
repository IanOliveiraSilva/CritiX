document.addEventListener('DOMContentLoaded', () => {
  const resultsList = document.querySelector('#results');

  surpriseButton.addEventListener('click', async () => {
    try {
      const response = await fetch(`/api/movie/surpriseMe/`, {
        method: 'GET',
      });
      const data = await response.json();

      if (response.ok) {
        const omdbMovie  = data.body.omdbMovie;
        const movieDetails = document.createElement('div');
        movieDetails.innerHTML = `
        <div class="d-flex flex-column align-items-center text-justify">
        <h2>${omdbMovie.Title} (${omdbMovie.Year})</h2>
        <img class="img-poster img-poster-hover" src="${omdbMovie.Poster}" alt="${omdbMovie.Title} poster" class="mt-3">
        <p>${omdbMovie.Plot}</p>
        </div>

        <ul>
          <li><strong>Released:</strong> ${omdbMovie.Released}</li>
          <li><strong>Writer:</strong> ${omdbMovie.Writer}</li>
          <li><strong>Country:</strong> ${omdbMovie.Country}</li>
          <li><strong>Box Office:</strong> ${omdbMovie.BoxOffice}</li>
          <li><strong>Awards:</strong> ${omdbMovie.Awards}</li>
          <li><strong>Actors:</strong> ${omdbMovie.Actors}</li>
          <li><strong>Genre:</strong> ${omdbMovie.Genre}</li>
          <li><strong>Runtime:</strong> ${omdbMovie.Runtime}</li>
          <li><strong>Rated:</strong> ${omdbMovie.Rated}</li>
          <li><strong>IMDb Rating:</strong> ${omdbMovie.imdbRating}</li>
          <li><strong>Metascore Rating:</strong> ${omdbMovie.Metascore}</li>
          <li><strong><button id="create-review-button" class="btn btn-warning text-dark btn-link mt-3">Criar Review</button></strong></li>
          <li><strong><button id="get-review-button" class="btn btn-warning text-dark btn-link mt-3">Ver Review</button></strong></li>
          <li><strong><button id="get-list-button" class="btn btn-warning text-dark btn-link mt-3">Ver Listas</button></strong></li>
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
