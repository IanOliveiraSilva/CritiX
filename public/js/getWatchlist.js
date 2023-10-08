const token = localStorage.getItem('token');
const listContainer = document.getElementById('lists');
const titleContainer = document.getElementById('pageTitle');

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch(`/api/watchlist/`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Erro ao obter lista');
    }

    const listData = await response.json();

    const movieCount = document.createElement('p');
    movieCount.textContent = listData.body.Lista.name + ' POSSUI '+ listData.body.Lista.movies_count + ' FILMES NA WATCHLIST ';
    const hr = document.createElement('hr');
    movieCount.classList.add('title', 'uppercase-text');

    titleContainer.appendChild(movieCount);
    titleContainer.appendChild(hr);

    for (const movieTitle of listData.body.Lista.movie_titles) {
      try {
        const movieResponse = await fetch(`/api/movie/title?title=${encodeURIComponent(movieTitle)}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (movieResponse.ok) {
          const movieData = await movieResponse.json();
        
          const movieContainer = document.createElement('div');

          const movieLink = document.createElement('a');
          movieLink.href = '/getMovieByTitle';
        
          const posterImage = document.createElement('img');
          posterImage.src = movieData.body.movieData.Poster;
          posterImage.alt = 'Poster do Filme';
          posterImage.classList.add('movie-poster');

          movieLink.addEventListener('click', function() {
            localStorage.setItem('movieTitle', movieTitle);
          });
        
          movieLink.appendChild(posterImage);
          movieContainer.appendChild(movieLink);
          listContainer.appendChild(movieContainer);
        } else {
          console.error('Erro ao obter detalhes do filme:', movieResponse.statusText);
        }
      } catch (error) {
        console.error('Erro ao buscar detalhes do filme:', error);
      }
    }
  } catch (error) {
    console.error('Erro ao buscar listas:', error);
  }
});
