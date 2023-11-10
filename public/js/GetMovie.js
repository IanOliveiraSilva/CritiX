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

  const removeFromWatchlist = async (token, moviesid) => {
    try {
      const response = await fetch(`/api/watchlist/remove`, {
        method: 'DELETE',
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

  const addToFavoriteList = async (token, moviesid) => {
    try {
      const response = await fetch(`/api/list/favoriteMovies`, {
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

  const removeFromFavoriteList = async (token, moviesid) => {
    try {
      const response = await fetch(`/api/favoriteMovies/remove`, {
        method: 'DELETE',
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
          li.classList.add('movie-li')
          li.innerHTML = `${movie.Title}(${movie.Year}) `;
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
            <div class="profile-container">
            <div class="row">
              <div class="col-md-4 text-center">
                <img class="img-poster img-fluid img-poster-hover" src="${detailsData.body.movieData.Poster}" alt="${detailsData.body.movieData.Title} poster">
                <strong><button id="add-favorite-button" draggable="true" class="btn-unstyled"><i id="favorite-icon" class="far fa-heart"></i></button></strong>&emsp;
                <strong><button id="add-watchlist-button" draggable="true" class="btn-unstyled-clock"><i id="watchlist-icon" class="far fa-clock"></i></button></strong>
              </div>
             <div class="col-md-8">
             <div class="plot-container">
             <h3 class="movie-title">${detailsData.body.movieData.Title}</h3>
             <p class="plot-text">${detailsData.body.movieData.Plot}</p>
         </div><br>
                <ul class="list-unstyled">
                  <li><strong>Gênero:</strong> ${detailsData.body.movieData.Genre}</li>
                  <li><strong>Duração:</strong> ${detailsData.body.movieData.Runtime}</li>
                  <li><strong>Média de Notas:</strong> ${detailsData.body.movie.medianotas !== 0 ? generateStarRating(detailsData.body.movie.medianotas) : 'Esse filme ainda não possui nota'}</li>
                  <li><strong>${movieGenreMapped}:</strong> ${detailsData.body.movie.mediaspecialrating !== 0 ? generateStarRating(detailsData.body.movie.mediaspecialrating) : 'Esse filme ainda não possui nota'}</li>
                  <li id="create-review-button" class="create-review-button">
                  <i class="fas fa-pencil-alt"></i> <strong>Criar uma review</strong>
                  </li>
                  </ul>
                <button id="get-review-button" class="btn btn-primary mt-3">Ver Reviews</button>
                <button id="get-list-button" class="btn btn-secondary mt-3">Ver Listas</button><br>
                <a class="text-dark" href="/">Voltar para a página inicial</a>
              </div>
            </div>
          </div>
              `;
            resultsList.innerHTML = '';
            resultsList.appendChild(details);

            const movieid = movie.imdbID;

            const favoriteData = await getFavoriteList(token);
            const watchlistData = await getWatchlist(token);

            if (
              favoriteData.body &&
              favoriteData.body.Lista &&
              favoriteData.body.Lista.moviesid !== undefined &&
              favoriteData.body.Lista.moviesid.includes(movieid)
            ) {
              const favoriteIcon = document.getElementById('favorite-icon')
              favoriteIcon.classList.add('fas', 'fa-heart');
            }

            if (
              watchlistData.body &&
              watchlistData.body.Lista &&
              watchlistData.body.Lista.moviesid !== undefined &&
              watchlistData.body.Lista.moviesid.includes(movieid)
            ) {
              const watchlistIcon = document.getElementById('watchlist-icon')
              watchlistIcon.classList.add('fas', 'fa-clock');
            }

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
                  watchlistData.body.Lista.moviesid !== undefined &&
                  watchlistData.body.Lista.moviesid.includes(moviesid)) {
                  await removeFromWatchlist(token, moviesid);
                  watchlistIcon.classList.remove('fas', 'fa-clock');
                  watchlistIcon.classList.add('far', 'fa-clock');
                } else {
                  await addToWatchlist(token, moviesid);
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
                const moviesid = movie.imdbID;


                if (favoriteData.body &&
                  favoriteData.body.Lista &&
                  favoriteData.body.Lista.moviesid !== undefined &&
                  favoriteData.body.Lista.moviesid.includes(moviesid)) {
                  await removeFromFavoriteList(token, moviesid);
                  favoriteIcon.classList.remove('fas', 'fa-heart');
                  favoriteIcon.classList.add('far', 'fa-heart');

                } else {
                  if (favoriteData.body &&
                    favoriteData.body.Lista &&
                    favoriteData.body.Lista.moviesid !== undefined &&
                    favoriteData.body.Lista.moviesid.length >= 4) {
                    alert('Você só pode ter 4 filmes na lista de favoritos');
                  }
                  await addToFavoriteList(token, moviesid);
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