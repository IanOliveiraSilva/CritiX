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

document.addEventListener('DOMContentLoaded', async () => {
    const title = localStorage.getItem('movieTitle');
    const resultsList = document.querySelector('#results');
    const token = localStorage.getItem('token')

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
    
    const addToWatchlist = async (token, movieTitle) => {
        try {
          const response = await fetch(`/api/watchlist/`, {
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

    try {
        const movieResponse = await fetch(`/api/movie/title?title=${encodeURIComponent(title)}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const movieData = await movieResponse.json();

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

        const movieGenreMapped = getSpecialRating(movieData.body.movieData.Genre);

        const details = document.createElement('div');
        details.innerHTML = `
        <div class="d-flex flex-column align-items-center text-justify">
                <h2>${movieData.body.movieData.Title} (${movieData.body.movieData.Year})</h2>
                <img class="img-poster img-poster-hover" src="${movieData.body.movieData.Poster}" alt="${movieData.body.movieData.Title} poster" class="mt-3">
                <p>${movieData.body.movieData.Plot}</p>
                </div>
                <ul>
                  <li><strong>Released:</strong> ${movieData.body.movieData.Released}</li>
                  <li><strong>Writer:</strong> ${movieData.body.movieData.Writer}</li>
                  <li><strong>Country:</strong> ${movieData.body.movieData.Country}</li>
                  <li><strong>Box Office:</strong> ${movieData.body.movieData.BoxOffice}</li>
                  <li><strong>Awards:</strong> ${movieData.body.movieData.Awards}</li>
                  <li><strong>Actors:</strong> ${movieData.body.movieData.Actors}</li>
                  <li><strong>Genre:</strong> ${movieData.body.movieData.Genre}</li>
                  <li><strong>Runtime:</strong> ${movieData.body.movieData.Runtime}</li>
                  <li><strong>Rated:</strong> ${movieData.body.movieData.Rated}</li>
                  <li><strong>IMDb Rating:</strong> ${movieData.body.movieData.imdbRating}</li>
                  <li><strong>Metascore Rating:</strong> ${movieData.body.movieData.Metascore}</li>
                  <li><strong>Review Count:</strong> ${movieData.body.reviewCount !== '0' ? movieData.body.reviewCount : 'Esse filme ainda não possui review'}</li>
                  <li><strong>Media de Notas:</strong> ${movieData.body.movie.medianotas !== 0 ? generateStarRating(movieData.body.movie.medianotas) : 'Esse filme ainda não possui nota'}</li>
                  <li><strong>${movieGenreMapped}</strong> ${movieData.body.movie.mediaspecialrating !== 0 ? generateStarRating(movieData.body.movie.mediaspecialrating) : 'Esse filme ainda não possui nota'}</li>
                  <strong><button id="create-review-button" class="btn-back">Criar Review</button></strong>
                  <strong><button id="get-review-button" class="btn-back">Ver Review</button></strong><br>
                  <strong><button id="add-watchlist-button" class="btn-back">Adicionar à Watchlist</button></strong><br>
                  <strong><button id="get-list-button" class="btn-back">Ver Listas</button></strong>
                  </ul>
                  <a href="/" class="btn-back">Voltar</a>
        `
        resultsList.innerHTML = '';
        resultsList.appendChild(details);

        // Botões
        const reviewButton = document.getElementById('create-review-button');
        reviewButton.addEventListener('click', () => {
            localStorage.setItem('movieTitle', movieData.body.movieData.Title);
            localStorage.setItem('movieGenre', movieData.body.movieData.Genre);
            window.location.href = '/createReview';
        });

        const getReviewButton = document.getElementById('get-review-button');
        getReviewButton.addEventListener('click', () => {
            localStorage.setItem('movieTitle', movieData.body.movieData.Title);
            window.location.href = '/getAllMovieReviews';
        });

        const getListButton = document.getElementById('get-list-button');
        getListButton.addEventListener('click', () => {
            localStorage.setItem('movieTitle', movieData.body.movieData.Title);
            window.location.href = '/getAllMovieLists';
        });

        const addWatchlistButton = document.getElementById('add-watchlist-button');
        addWatchlistButton.addEventListener('click', async () => {
            try {
                const watchlistData = await getWatchlist(token);
                const movieTitle = movieData.body.movieData.Title;

                if (watchlistData.body.Lista.movie_titles.includes(movieTitle)) {
                    await removeFromWatchlist(token, movieTitle);
                    alert('Filme removido da watchlist.');
                    addWatchlistButton.textContent = 'Adicionar à Watchlist';
                } else {
                    await addToWatchlist(token, movieTitle);
                    alert('Filme adicionado à watchlist com sucesso.');
                    addWatchlistButton.textContent = 'Remover da Watchlist';
                }
            } catch (error) {
                console.error('Erro ao fazer a solicitação:', error);
            }
        });

        resultsList.appendChild(li);
    } catch {
        console.error('Erro ao obter dados do filme');
    }
});