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
      });
  } catch (error) {
      console.error('Erro ao buscar revisões:', error);
  }
});
