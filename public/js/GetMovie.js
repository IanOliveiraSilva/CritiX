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
  const form = document.querySelector('#search-form');
  const input = document.querySelector('#search-input');
  const resultsList = document.querySelector('#results');
  const token = localStorage.getItem('token');

  // WATCHLIST
  const getWatchlist = async (token) => {
    try {
      const response = await fetch(`/api/watchlist/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        return await response.json();
      } else {
        throw new Error('Erro ao obter a watchlist.');
      }
    } catch (error) {
      console.error('Erro ao obter a watchlist:', error);
      throw error;
    }
  };

  const addToWatchlist = async (token, moviesid) => {
    try {
      const response = await fetch(`/api/watchlist/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          moviesid: moviesid
        })
      });

      if (response.ok) {
        return true;
      } else {
        throw new Error('Erro ao adicionar filme à watchlist.');
      }
    } catch (error) {
      console.error('Erro ao adicionar filme à watchlist:', error);
      throw error;
    }
  };

  const removeFromWatchlist = async (token, movieTitle) => {
    try {
      const response = await fetch(`/api/watchlist/remove`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          movieTitle: movieTitle
        })
      });

      if (response.ok) {
        return true;
      } else {
        throw new Error('Erro ao remover filme da watchlist.');
      }
    } catch (error) {
      console.error('Erro ao remover filme da watchlist:', error);
      throw error;
    }
  };

  // FAVORITES
  const getFavoriteList = async (token) => {
    try {
      const response = await fetch(`/api/list/favoriteMovies`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        return await response.json();
      } else {
        throw new Error('Erro ao obter a watchlist.');
      }
    } catch (error) {
      console.error('Erro ao obter a watchlist:', error);
      throw error;
    }
  };

  const addToFavoriteList = async (token, movieTitle) => {
    try {
      const response = await fetch(`/api/list/favoriteMovies`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          movieTitle: movieTitle
        })
      });

      if (response.ok) {
        return true;
      } else {
        throw new Error('Erro ao adicionar filme à watchlist.');
      }
    } catch (error) {
      console.error('Erro ao adicionar filme à watchlist:', error);
      throw error;
    }
  };

  const removeFromFavoriteList = async (token, movieTitle) => {
    try {
      const response = await fetch(`/api/favoriteMovies/remove`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          movieTitle: movieTitle
        })
      });

      if (response.ok) {
        return true;
      } else {
        throw new Error('Erro ao remover filme da watchlist.');
      }
    } catch (error) {
      console.error('Erro ao remover filme da watchlist:', error);
      throw error;
    }
  };
  

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
            const detailsResponse = await fetch(`/api/movie/id?title=${encodeURIComponent(movie.Title)}&imdbID=${encodeURIComponent(movie.imdbID)}`, {
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
            <div class="d-flex flex-column align-items-center text-justify">
            <h2>${detailsData.body.movieData.Title}</h2><br>
            
            <img class="img-poster img-poster-hover" src="${detailsData.body.movieData.Poster}" alt="${detailsData.body.movieData.Title} poster" class="mt-3">
            <div class="button-container">
            <strong><button id="add-favorite-button" class="btn-unstyled"><i id="favorite-icon" class="far fa-heart"></i></button></strong><p>&emsp;</p>
            <strong><button id="add-watchlist-button" class="btn-unstyled-clock"><i id="watchlist-icon" class="far fa-clock"></i></button></strong>
            </div>

            <p>${detailsData.body.movieData.Plot}</p><br>
            </div>
  
            <ul>
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
              <li><strong>Quantidade de reviews:</strong> ${detailsData.body.reviewCount !== '0' ? detailsData.body.reviewCount : 'Esse filme ainda não possui review'}</li>
              <li><strong>Media de Notas:</strong> ${detailsData.body.movie.medianotas !== 0 ? generateStarRating(detailsData.body.movie.medianotas) : 'Esse filme ainda não possui nota'}</li>
              <li><strong>${movieGenreMapped}:</strong> ${detailsData.body.movie.mediaspecialrating !== 0 ? generateStarRating(detailsData.body.movie.mediaspecialrating) : 'Esse filme ainda não possui nota'}</li>
              <strong><button id="create-review-button" class="btn-back">Criar Review</button></strong>
              <strong><button id="get-review-button" class="btn-back">Ver Review</button></strong>
              <strong><button id="get-list-button" class="btn-back">Ver Listas</button></strong><br>
              </ul>
              `;
            resultsList.innerHTML = '';
            resultsList.appendChild(details);


            // Botões
            const reviewButton = document.getElementById('create-review-button');
            reviewButton.addEventListener('click', () => {
              localStorage.setItem('movieTitle', movie.Title);
              localStorage.setItem('movieimbdId', movie.imdbID);
              localStorage.setItem('movieGenre', detailsData.body.movieData.Genre);
              window.location.href = '/createReview';
            });

            const getReviewButton = document.getElementById('get-review-button');
            getReviewButton.addEventListener('click', () => {
              localStorage.setItem('movieTitle', movie.Title);
              localStorage.setItem('movieimbdId', movie.imdbID);
              window.location.href = '/getAllMovieReviews';
            });

            const getListButton = document.getElementById('get-list-button');
            getListButton.addEventListener('click', () => {
              localStorage.setItem('movieTitle', movie.Title);
              window.location.href = '/getAllMovieLists';
            });

            const addWatchlistButton = document.getElementById('add-watchlist-button');
            addWatchlistButton.addEventListener('click', async () => {
              try {
                const watchlistIcon = document.getElementById('watchlist-icon')
                const watchlistData = await getWatchlist(token);
                const moviesid = movie.imdbID;

                if (watchlistData.body &&
                  watchlistData.body.Lista &&
                  watchlistData.body.Lista.movie_titles !== undefined &&
                  watchlistData.body.Lista.movie_titles.includes(moviesid)) {
                  await removeFromWatchlist(token, moviesid);
                  alert('Filme removido da watchlist.');
                  watchlistIcon.classList.remove('fas', 'fa-clock');
                  watchlistIcon.classList.add('far', 'fa-clock');
                } else {
                  await addToWatchlist(token, moviesid);
                  alert('Filme adicionado à watchlist com sucesso.');
                  watchlistIcon.classList.add('fas', 'fa-clock');
                }
              } catch (error) {
                console.error('Erro ao fazer a solicitação:', error);
              }
            });

            const addFavoriteButton = document.getElementById('add-favorite-button');
            addFavoriteButton.addEventListener('click', async () => {
              try {
                const favoriteIcon = document.getElementById('favorite-icon')
                const favoriteData = await getFavoriteList(token);
                const movieTitle = movie.Title;

                if (favoriteData.body &&
                  favoriteData.body.Lista &&
                  favoriteData.body.Lista.movie_titles !== undefined &&
                  favoriteData.body.Lista.movie_titles.includes(movieTitle)) {
                  await removeFromFavoriteList(token, movieTitle);
                  alert('Filme removido da lista de favoritos.');
                  favoriteIcon.classList.remove('fas', 'fa-heart');
                  favoriteIcon.classList.add('far', 'fa-heart');

                } else {
                  await addToFavoriteList(token, movieTitle);
                  alert('Filme adicionado à lista de favoritos.');
                  favoriteIcon.classList.add('fas', 'fa-heart');
                }
              } catch (error) {
                console.error('Erro ao fazer a solicitação:', error);
              }
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