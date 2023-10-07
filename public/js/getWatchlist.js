const token = localStorage.getItem('token');
const listContainer = document.getElementById('lists');

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
          
          const posterImage = document.createElement('img');
          posterImage.src = movieData.body.movieData.Poster;
          posterImage.alt = 'Poster do Filme';
          posterImage.classList.add('movie-poster');
          
          const titleElement = document.createElement('a');
          titleElement.href = '/getMovieByTitle';
          titleElement.textContent = movieTitle;
          titleElement.classList.add('movie-title');

          titleElement.addEventListener('click', function() {
            localStorage.setItem('movieTitle', movieTitle);
          });

          movieContainer.appendChild(posterImage);
          movieContainer.appendChild(titleElement);

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
