const token = localStorage.getItem('token');
let movieTitle;

document.addEventListener('DOMContentLoaded', async () => {
  try {
    movieTitle = localStorage.getItem('movieTitle');
    const titleInput = document.getElementById('movieTitle'); // Adicione esta linha
  
    if (movieTitle && titleInput) { // Certifique-se de verificar se titleInput existe
      titleInput.value = movieTitle;
    }

    if (movieTitle) { // Só faça a solicitação se movieTitle existir
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
        const table = document.createElement('table');
        table.classList.add('table');

        const tbody = document.createElement('tbody');

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
    }
  } catch (error) {
    console.error('Erro ao buscar revisões:', error);
  }
});
