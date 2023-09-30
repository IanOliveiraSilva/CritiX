const token = localStorage.getItem('token');

document.addEventListener('DOMContentLoaded', async () => {

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

      const titleRow = document.createElement('tr');
      const titleCell = document.createElement('td');
      titleCell.textContent = `Título: ${review.title}`;
      titleRow.appendChild(titleCell);
      tbody.appendChild(titleRow);


      const genreRow = document.createElement('tr');
      const genreCell = document.createElement('td');
      genreCell.textContent = `Genero: ${review.genre}`;
      genreRow.appendChild(genreCell);
      tbody.appendChild(genreRow);

      const ratingRow = document.createElement('tr');
      const ratingCell = document.createElement('td');
      ratingCell.textContent = `Avaliação: ${review.rating}`;
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

      const editReviewButtonRow = document.createElement('tr');
      const editReviewButtonCell = document.createElement('td');
      const editButton = document.createElement('button');
      editButton.id = 'get-review-id'
      editButton.textContent = 'Editar';
      editButton.addEventListener('click', () => {
        localStorage.setItem('reviewId', review.id);
        localStorage.setItem('genre', review.genre);
        window.location.href = '/updateReview';
      });
      editReviewButtonCell.appendChild(editButton);
      editReviewButtonRow.appendChild(editReviewButtonCell);
      tbody.appendChild(editReviewButtonRow);
      editButton.classList.add('btn', 'btn-warning', 'text-dark', 'btn-link', 'mt-3');

      const deleteButtonRow = document.createElement('tr');
      const deleteButtonCell = document.createElement('td');
      const deleteButton = document.createElement('button');
      deleteButton.id = 'get-review-id'
      deleteButton.textContent = 'Excluir';
      deleteButton.addEventListener('click', () => {
        localStorage.setItem('reviewId', review.id);
        window.location.href = '/deleteReview';
      });
      deleteButtonCell.appendChild(deleteButton);
      deleteButtonRow.appendChild(deleteButtonCell);
      tbody.appendChild(deleteButtonRow);
      deleteButton.classList.add('btn', 'btn-warning', 'text-dark', 'btn-link', 'mt-3');
    });
  } catch (error) {
    console.error('Erro ao buscar revisões:', error);
  }
});
