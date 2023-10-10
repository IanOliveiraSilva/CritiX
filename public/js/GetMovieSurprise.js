function generateStarRating(rating) {
  const maxRating = 5;
  const roundedRating = Math.round(rating * 2) / 2;
  const fullStars = Math.floor(roundedRating);
  const halfStar = roundedRating % 1 !== 0;
  const emptyStars = maxRating - fullStars - (halfStar ? 1 : 0);

  let stars = '';
  for (let i = 0; i < fullStars; i++) {
    stars += '<i class="fas fa-star star-rating"></i>';
  }
  if (halfStar) {
    stars += '<i class="fas fa-star-half-alt star-rating"></i>';
  }
  for (let i = 0; i < emptyStars; i++) {
    stars += '<i class="far fa-star star-rating"></i>';
  }

  return stars;
}


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

        const specialRatingMap = new Map([
          ['Horror', 'Nivel de Horror'],
          ['Comedy', 'Nivel de Diversão'],
          ['Action', 'Nivel de Adrenalina'],
          ['Romance', 'Nivel de Amor'],
          ['Drama', 'Nivel de Drama'],
        ]);
    
        const getSpecialRating = (genre) => {
          const genreArray = genre.split(',');
          const firstGenre = genreArray[0];
          return specialRatingMap.get(firstGenre.trim());
        }
    
        const movieGenreMapped = getSpecialRating(omdbMovie.Genre);

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
          <li><strong>Review Count:</strong> ${data.body.reviewCount !== '0' ? omdbMovie.reviewCount : 'Esse filme ainda não possui review'}</li>
          <li><strong>Media de Notas:</strong> ${data.body.movie.medianotas !== 0 ? generateStarRating(data.body.movie.medianotas) : 'Esse filme ainda não possui nota'}</li>
          <li><strong>${movieGenreMapped}</strong> ${data.body.movie.mediaspecialrating !== 0 ? generateStarRating(data.body.movie.mediaspecialrating) : 'Esse filme ainda não possui nota'}</li>
          <strong><button id="create-review-button" class="btn-back">Criar Review</button></strong>
          <strong><button id="get-review-button" class="btn-back">Ver Review</button></strong>
          <strong><button id="get-list-button" class="btn-back">Ver Listas</button></strong>
        </ul>
      `;
        resultsList.innerHTML = '';
        resultsList.appendChild(movieDetails);

        const createReviewButton = document.getElementById('create-review-button');
        createReviewButton.addEventListener('click', () => {
          localStorage.setItem('movieTitle', omdbMovie.Title);
          localStorage.setItem('movieGenre', omdbMovie.Genre);
          window.location.href = '/createReview';
        });

        const getReviewButton = document.getElementById('get-review-button');
        getReviewButton.addEventListener('click', () => {
          localStorage.setItem('movieTitle', omdbMovie.Title);
          window.location.href = '/getAllMovieReviews';
        });

        const getListButton = document.getElementById('get-list-button');
        getListButton.addEventListener('click', () => {
          localStorage.setItem('movieTitle', omdbMovie.Title);
          window.location.href = '/getAllMovieLists';
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
