document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('#search-form');
  const input = document.querySelector('#search-input');
  const resultsList = document.querySelector('#results');
  const token = localStorage.getItem('token');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const query = input.value.trim();
    const omdbApiKey = 'da10da96';
    const url = `https://www.omdbapi.com/?s=${query}&page=1&apikey=${omdbApiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.Search && data.Search.length > 0) {
        resultsList.innerHTML = '';
        data.Search.forEach(movie => {
          const li = document.createElement('li');
          li.textContent = `${movie.Title} (${movie.Year})`;
          li.addEventListener('click', async () => {
            const detailsResponse = await fetch(`/api/movie/title?title=${encodeURIComponent(movie.Title)}`, {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            const detailsData = await detailsResponse.json();

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
          
            const movieGenreMapped = getSpecialRating(detailsData.body.movieData.Genre);

            const details = document.createElement('div');
            details.innerHTML = `
                <h2>${detailsData.body.movieData.Title} (${detailsData.body.movieData.Year})</h2>
                <img src="${detailsData.body.movieData.Poster}" alt="${detailsData.body.movieData.Title} poster">
                <p>Plot: ${detailsData.body.movieData.Plot}</p>
                <ul>
                  <li><strong>Director:</strong> ${detailsData.body.movieData.Director}</li>
                  <li><strong>Released:</strong> ${detailsData.body.movieData.Released}</li>
                  <li><strong>Writer:</strong> ${detailsData.body.movieData.Writer}</li>
                  <li><strong>Country:</strong> ${detailsData.body.movieData.Country}</li>
                  <li><strong>Box Office:</strong> ${detailsData.body.movieData.BoxOffice}</li>
                  <li><strong>Awards:</strong> ${detailsData.body.movieData.Awards}</li>
                  <li><strong>Actors:</strong> ${detailsData.body.movieData.Actors}</li>
                  <li><strong>Genre:</strong> ${detailsData.body.movieData.Genre}</li>
                  <li><strong>Runtime:</strong> ${detailsData.body.movieData.Runtime}</li>
                  <li><strong>Rated:</strong> ${detailsData.body.movieData.Rated}</li>
                  <li><strong>IMDb Rating:</strong> ${detailsData.body.movieData.imdbRating}</li>
                  <li><strong>Metascore Rating:</strong> ${detailsData.body.movieData.Metascore}</li>
                  <li><strong>Review Count:</strong> ${detailsData.body.reviewCount}</li>
                  <li><strong>Media de Notas:</strong> ${detailsData.body.movie.medianotas}</li>
                  <li><strong>${movieGenreMapped}:</strong> ${detailsData.body.movie.mediaspecialrating}</li>
                  <li><strong><button id="create-review-button">Criar Review</button></strong></li>
                  <li><strong><button id="get-review-button">Ver Review</button></strong></li>
                  <li><strong><button id="get-list-button">Ver Listas</button></strong></li>
                </ul>
                <a href="" class="btn-back">Voltar</a>
              `;
            resultsList.innerHTML = '';
            resultsList.appendChild(details);

            const reviewButton = document.getElementById('create-review-button');
            reviewButton.addEventListener('click', () => {
              localStorage.setItem('movieTitle', movie.Title);
              localStorage.setItem('movieGenre', detailsData.body.movieData.Genre);
              window.location.href = '/createReview';
            });

            const getReviewButton = document.getElementById('get-review-button');
            getReviewButton.addEventListener('click', () => {
              localStorage.setItem('movieTitle', movie.Title);
              window.location.href = '/getAllMovieReviews';
            });

            const getListButton = document.getElementById('get-list-button');
            getListButton.addEventListener('click', () => {
              localStorage.setItem('movieTitle', movie.Title);
              window.location.href = '/getAllMovieLists';
            });
          });
          resultsList.appendChild(li);
        });
      } else {
        resultsList.innerHTML = 'No results found.';
      }

    } catch (error) {
      console.log(error);
    }
  });
});