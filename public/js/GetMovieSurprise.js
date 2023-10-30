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
        <div class="button-container">
            <strong><button id="add-favorite-button" class="btn-unstyled"><i id="favorite-icon" class="far fa-heart"></i></button></strong><p>&emsp;</p>
            <strong><button id="add-watchlist-button" class="btn-unstyled-clock"><i id="watchlist-icon" class="far fa-clock"></i></button></strong>
            </div>
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
          <li><strong>Review Count:</strong> ${data.body.reviewCount !== '0' ? data.body.reviewCount : 'Esse filme ainda não possui review'}</li>
          <li><strong>Media de Notas:</strong> ${data.body.movie.medianotas !== null ? generateStarRating(data.body.movie.medianotas) : 'Esse filme ainda não possui nota'}</li>
          <li><strong>${movieGenreMapped}:</strong> ${data.body.movie.mediaspecialrating !== null ? generateStarRating(data.body.movie.mediaspecialrating) : 'Esse filme ainda não possui nota'}</li>
          <strong><button id="create-review-button" class="btn-back">Criar Review</button></strong>
          <strong><button id="get-review-button" class="btn-back">Ver Review</button></strong>
          <strong><button id="get-list-button" class="btn-back">Ver Listas</button></strong>
        </ul>
      `;
        resultsList.innerHTML = '';
        resultsList.appendChild(movieDetails);

        const movieid = omdbMovie.imdbID;
           
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

        const addWatchlistButton = document.getElementById('add-watchlist-button');
            addWatchlistButton.addEventListener('click', async () => {
              try {
                const watchlistIcon = document.getElementById('watchlist-icon')
                const watchlistData = await getWatchlist(token);
                const moviesid = omdbMovie.imdbID;

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
                const moviesid = omdbMovie.imdbID;

                if (favoriteData.body &&
                  favoriteData.body.Lista &&
                  favoriteData.body.Lista.moviesid !== undefined &&
                  favoriteData.body.Lista.moviesid.includes(moviesid)) {
                  await removeFromFavoriteList(token, moviesid);
                  favoriteIcon.classList.remove('fas', 'fa-heart');
                  favoriteIcon.classList.add('far', 'fa-heart');

                } else {
                  if(favoriteData.body &&
                    favoriteData.body.Lista &&
                    favoriteData.body.Lista.moviesid !== undefined &&
                    favoriteData.body.Lista.moviesid.length >= 4){
                      alert('Você só pode ter 4 filmes na lista de favoritos');
                    }
                  await addToFavoriteList(token, moviesid);
                  favoriteIcon.classList.add('fas', 'fa-heart');
                }
              } catch (error) {
                console.error('Erro ao fazer a solicitação:', error);
              }
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
