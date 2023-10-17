const token = localStorage.getItem('token');

document.addEventListener('DOMContentLoaded', async () => {
  const genreFilter = document.getElementById('genre-filter');
  
  try {
    const response = await fetch('/api/allReviews', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Erro ao obter revisões');
    }
    const reviewsData = await response.json();


    const reviewsContainer = document.getElementById('reviews');

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

      const titleLink = document.createElement('a');
      titleLink.textContent = `${review.title}`;
      titleLink.href = '/getMovieByTitle'
      titleLink.addEventListener('click', function(event) {
        event.preventDefault();
        const movieTitle = review.title;
        const movieimdbId = review.imdbid;
        localStorage.setItem('movieimbdId', movieimdbId);
        localStorage.setItem('movieTitle', movieTitle);
        window.location.href = titleLink.href;
      });
      const titleRow = document.createElement('tr');
      const titleCell = document.createElement('td');
      titleCell.appendChild(titleLink);
      titleRow.appendChild(titleCell);
      tbody.appendChild(titleRow);


      const ratingRow = document.createElement('tr');
      const ratingCell = document.createElement('td');
      ratingCell.textContent = `Nota: ${review.rating}`;
      ratingRow.appendChild(ratingCell);
      tbody.appendChild(ratingRow);


      table.appendChild(tbody);
      reviewsContainer.appendChild(table);

      const editReviewButtonRow = document.createElement('tr');
      const editReviewButtonCell = document.createElement('td');
      const editButton = document.createElement('a');
      editButton.href = '/getReviewById'
      editButton.textContent = 'Ver Review';
      editButton.addEventListener('click', () => {
        localStorage.setItem('reviewId', review.id);
      });
      editReviewButtonCell.appendChild(editButton);
      editReviewButtonRow.appendChild(editReviewButtonCell);
      tbody.appendChild(editReviewButtonRow);
      editButton.classList.add('btn', 'btn-warning', 'text-dark', 'btn-link', 'mt-3');
    });
  } catch (error) {
    console.error('Erro ao buscar revisões:', error);
  }
});
