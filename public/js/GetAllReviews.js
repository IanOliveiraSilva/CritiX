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
      const table = document.createElement('table');
      table.classList.add('table');

      const tbody = document.createElement('tbody');

      const titleRow = document.createElement('tr');
      const titleCell = document.createElement('td');
      titleCell.textContent = `Título: ${review.title}`;
      titleRow.appendChild(titleCell);
      tbody.appendChild(titleRow);

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

      table.appendChild(tbody);
      reviewsContainer.appendChild(table);

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


      const editReviewButtonRow = document.createElement('tr');
      const editReviewButtonCell = document.createElement('td');
      const editButton = document.createElement('button');
      editButton.id = 'get-review-id'
      editButton.textContent = 'Editar';
      editButton.addEventListener('click', () => {
        localStorage.setItem('reviewId', review.id);
        window.location.href = '/updateReview';
      });
      editReviewButtonCell.appendChild(editButton);
      editReviewButtonRow.appendChild(editReviewButtonCell);
      tbody.appendChild(editReviewButtonRow);
    });
  } catch (error) {
    console.error('Erro ao buscar revisões:', error);
  }
});
