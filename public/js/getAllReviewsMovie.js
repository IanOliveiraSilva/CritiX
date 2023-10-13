const token = localStorage.getItem('token');
let movieTitle;
let movieimdbId;

document.addEventListener('DOMContentLoaded', async () => {
  try {
    movieTitle = localStorage.getItem('movieTitle');
    movieimdbId = localStorage.getItem('movieimbdId');
    const titleInput = document.getElementById('movieTitle');

    if (movieTitle && titleInput) {
      titleInput.value = movieTitle;
    }

    if (movieTitle) {
      const response = await fetch(`/api/allReviews/movies/?title=${encodeURIComponent(movieTitle)}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Erro ao obter revisões');
      }

      const reviewsData = await response.json();

      const reviewsContainer = document.getElementById('reviews');

      const titleHeader = document.createElement('h1');
      titleHeader.textContent = `Avaliações para o Filme: ${movieTitle}`;
      reviewsContainer.appendChild(titleHeader);

      reviewsData.forEach((review) => {
        const movieGenre = `${review.genre}`;

        const specialRatingMap = new Map([
          ['Horror', 'Nivel de Medo'],
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

        const movieGenreMapped = getSpecialRating(movieGenre);

        const table = document.createElement('table');
        table.classList.add('table');

        const tbody = document.createElement('tbody');

        const userRow = document.createElement('tr');
        const userCell = document.createElement('td');
        userCell.textContent = `Usuario: ${review.username}`;
        userRow.appendChild(userCell);
        tbody.appendChild(userRow);


        const ratingRow = document.createElement('tr');
        const ratingCell = document.createElement('td');
        ratingCell.textContent = `Nota: ${review.rating}`;
        ratingRow.appendChild(ratingCell);
        tbody.appendChild(ratingRow);

        const commentRow = document.createElement('tr');
        const commentCell = document.createElement('td');
        commentCell.textContent = `Comentário: ${review.review}`;
        commentRow.appendChild(commentCell);
        tbody.appendChild(commentRow);

        if (review.specialrating !== null) {
          const specialRatingRow = document.createElement('tr');
          const specialRatingCell = document.createElement('td');
          specialRatingCell.textContent = `${movieGenreMapped}: ${review.specialrating}`;
          specialRatingRow.appendChild(specialRatingCell);
          tbody.appendChild(specialRatingRow);
        }

        table.appendChild(tbody);
        reviewsContainer.appendChild(table);
      });
    }
  } catch (error) {
    console.error('Erro ao buscar revisões:', error);
  }
});
