function generateStarRating(rating) {
  const maxRating = 5;
  const roundedRating = Math.round(rating * 2) / 2;
  const fullStars = Math.floor(roundedRating);
  const halfStar = roundedRating % 1 !== 0;
  const emptyStars = maxRating - fullStars - (halfStar ? 1 : 0);

  const ratingContainer = document.createElement('div');
  ratingContainer.classList.add('star-rating');

  for (let i = 0; i < fullStars; i++) {
    const star = document.createElement('i');
    star.classList.add('fas', 'fa-star');
    ratingContainer.appendChild(star);
  }

  if (halfStar) {
    const halfStar = document.createElement('i');
    halfStar.classList.add('fas', 'fa-star-half-alt');
    ratingContainer.appendChild(halfStar);
  }

  for (let i = 0; i < emptyStars; i++) {
    const star = document.createElement('i');
    star.classList.add('far', 'fa-star');
    ratingContainer.appendChild(star);
  }

  return ratingContainer;
}

document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');

  const reviewsContainer = document.getElementById('reviews');
  const titleContainer = document.getElementById('pageTitle');
  const genreSelect = document.getElementById('genreFilter');
  const orderBySelect = document.getElementById('sortOptions')

  const movieCount = document.createElement('p');
  movieCount.textContent = 'MINHAS REVIEWS';
  movieCount.classList.add('title', 'uppercase-text');

  const orderBy = document.createElement('p');
  orderBy.textContent = 'Ordenar por ';
  orderBy.classList.add('title', 'uppercase-text');

  const SelectGenre = document.createElement('p');
  SelectGenre.textContent = 'Escolha o genero que deseja ver ';
  SelectGenre.classList.add('title', 'uppercase-text');

  const hr = document.createElement('hr');

  titleContainer.appendChild(movieCount);
  titleContainer.appendChild(document.createElement('br'));
  titleContainer.appendChild(hr);
  titleContainer.appendChild(SelectGenre);
  titleContainer.appendChild(genreSelect);
  titleContainer.appendChild(hr);
  titleContainer.appendChild(orderBy);
  titleContainer.appendChild(orderBySelect);


  let selectedGenre = '';
  let selectedOrderBy = '';

  const loadReviews = async () => {
    try {
      let endpoint = '/api/allReviews';

      endpoint += selectedGenre ? `?genre=${selectedGenre}` : '';
      endpoint += selectedOrderBy ? (selectedGenre ? `&sort=${selectedOrderBy}` : `?sort=${selectedOrderBy}`) : '';

      const response = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const reviewsData = await response.json();

      const existingTable = reviewsContainer.querySelector('table');
      if (existingTable) {
        reviewsContainer.removeChild(existingTable);
      }

      let noReviewsMessage = document.querySelector('.no-reviews-message');

      if (reviewsData.message == "O usuário não possui reviews com os critérios de busca fornecidos.") {
        if (!noReviewsMessage) {
          noReviewsMessage = document.createElement('p');
          noReviewsMessage.textContent = 'Você não possui reviews com o gênero selecionado.';
          noReviewsMessage.classList.add('no-reviews-message');
          reviewsContainer.appendChild(noReviewsMessage);
        }
      }

      if (noReviewsMessage && reviewsData.message !== "O usuário não possui reviews com os critérios de busca fornecidos.") {
        reviewsContainer.removeChild(noReviewsMessage);
      }

      const table = document.createElement('table');
      table.classList.add('table');

      const thead = document.createElement('thead');
      const headerRow = document.createElement('tr');

      const titleLabel = document.createElement('th');
      titleLabel.textContent = 'Filme';
      headerRow.appendChild(titleLabel);

      const dateLabel = document.createElement('th');
      dateLabel.textContent = 'Data';
      headerRow.appendChild(dateLabel);


      const ratingLabel = document.createElement('th');
      ratingLabel.textContent = 'Nota';
      headerRow.appendChild(ratingLabel);

      const actionsLabel = document.createElement('th');
      actionsLabel.textContent = 'Ações';
      headerRow.appendChild(actionsLabel);

      thead.appendChild(headerRow);
      table.appendChild(thead);

      reviewsData.forEach((review) => {
        const tbody = document.createElement('tbody');

        const ratingRow = document.createElement('tr');
        ratingRow.addEventListener('click', function () {
          localStorage.setItem('reviewId', review.id);
          window.location.href = `/getReviewById`;
        });

        const ratingCell = document.createElement('td');
        ratingCell.appendChild(generateStarRating(review.rating));

        const userCell = document.createElement('td');
        userCell.textContent = `${review.title}`;

        const createdDate = new Date(review.created_at);
        const day = createdDate.getDate();
        const month = createdDate.getMonth() + 1;
        const formattedDay = day < 10 ? `0${day}` : day;
        const formattedMonth = month < 10 ? `0${month}` : month;
        const dateCell = document.createElement('td');
        dateCell.textContent = `${formattedDay}/${formattedMonth}`;

        const editButton = document.createElement('a');
        editButton.innerHTML = '<i class="fas fa-pencil-alt"></i>';
        editButton.classList.add('edit-button');
        editButton.href = '/updateReview';
        editButton.addEventListener('click', () => {
          localStorage.setItem('reviewId', review.id);
          localStorage.setItem('rating', review.rating);
          localStorage.setItem('review', review.review);
          localStorage.setItem('specialRating', review.specialrating);
          localStorage.setItem('genre', review.genre);
          localStorage.setItem('movieTitle', review.title);
        });

        const deleteButton = document.createElement('a');
        deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
        deleteButton.classList.add('delete-button');
        deleteButton.href = '/getAllReviews'
        deleteButton.addEventListener('click', () => {
          const confirmDelete = confirm('Tem certeza que deseja excluir a review?');
          if (confirmDelete) {
            const response = fetch(`/api/review/?id=${encodeURIComponent(review.id)}`, {
              method: 'DELETE',
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            alert('Review excluida com sucesso!.');
          }
        });

        const commentButton = document.createElement('a');
        if (review.comment_count > 0) {
          commentButton.innerHTML = `<i class="fas fa-comment"></i> ${review.comment_count}`;
        } else {
          commentButton.innerHTML = `<i class="fas fa-comment"></i>`;
        }
        commentButton.classList.add('delete-button');
        commentButton.href = '/getAllReviewsComments'
        commentButton.addEventListener('click', () => {
          localStorage.setItem('reviewId', review.id);
        });

        const actionsCell = document.createElement('td');
        actionsCell.appendChild(editButton);
        actionsCell.insertAdjacentHTML('beforeend', '&emsp;');
        actionsCell.appendChild(deleteButton);
        actionsCell.insertAdjacentHTML('beforeend', '&emsp;');
        actionsCell.appendChild(commentButton);

        ratingRow.appendChild(userCell);
        ratingRow.appendChild(dateCell);
        ratingRow.appendChild(ratingCell);
        ratingRow.appendChild(actionsCell);

        tbody.appendChild(ratingRow);

        table.appendChild(tbody);
        reviewsContainer.appendChild(table);
      });
      
      reviewsContainer.appendChild(table);
    } catch (error) {
      console.error('Erro ao buscar revisões:', error);
    }
  }
    await loadReviews();

    genreSelect.addEventListener('change', () => {
      selectedGenre = genreSelect.value;
      loadReviews();
    });

    orderBySelect.addEventListener('change', () => {
      selectedOrderBy = orderBySelect.value;
      loadReviews();
    });
  });

