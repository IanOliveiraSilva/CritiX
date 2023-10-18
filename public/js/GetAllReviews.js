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

    const movieCount = document.createElement('p');
    movieCount.textContent = 'MINHAS REVIEWS';
    movieCount.classList.add('title', 'uppercase-text');

    const hr = document.createElement('hr');

    titleContainer.appendChild(movieCount);
    titleContainer.appendChild(hr);


    reviewsData.forEach((review) => {
      const table = document.createElement('table');
      table.classList.add('table');

      const tbody = document.createElement('tbody');

      const titleRow = document.createElement('tr');

      const titleCell = document.createElement('td');

      const titleLink = document.createElement('a');
      titleLink.textContent = `${review.title}`;
      titleLink.href = '/getMovieByTitle'
      titleLink.addEventListener('click', function (event) {
        event.preventDefault();
        const movieTitle = review.title;
        const movieimdbId = review.imdbid;
        localStorage.setItem('movieimbdId', movieimdbId);
        localStorage.setItem('movieTitle', movieTitle);
        window.location.href = titleLink.href;
      });
      titleCell.appendChild(titleLink);
      titleCell.appendChild(generateStarRating(review.rating));
      titleRow.appendChild(titleCell);
      tbody.appendChild(titleRow);



      table.appendChild(tbody);
      reviewsContainer.appendChild(table);

      const getReviewButtonRow = document.createElement('tr');
      const getReviewButtonCell = document.createElement('td');
      const getReviewButton = document.createElement('a');
      getReviewButton.href = '/getReviewById'
      getReviewButton.textContent = 'Ver Review';
      getReviewButton.addEventListener('click', () => {
        localStorage.setItem('reviewId', review.id);
      });
      getReviewButtonCell.appendChild(getReviewButton);
      getReviewButtonRow.appendChild(getReviewButtonCell);
      tbody.appendChild(getReviewButtonRow);
      getReviewButton.classList.add('btn', 'btn-warning', 'text-dark', 'btn-link', 'mt-3');

      // VER COMENTARIOS
      const getcommentReviewButtonRow = document.createElement('tr');
      const getcommentReviewButtonCell = document.createElement('td');
      const getcommentButton = document.createElement('button');
      getcommentButton.id = 'get-review-id'
      getcommentButton.textContent = 'Comentarios';
      getcommentButton.addEventListener('click', () => {
        localStorage.setItem('reviewId', review.id);
        window.location.href = '/getAllReviewsComments';
      });
      getcommentReviewButtonCell.appendChild(getcommentButton);
      getcommentReviewButtonRow.appendChild(getcommentReviewButtonCell);
      tbody.appendChild(getcommentReviewButtonRow);
      getcommentButton.classList.add('btn', 'btn-warning', 'text-dark', 'btn-link', 'mt-3');

    });
  } catch (error) {
    console.error('Erro ao buscar revisões:', error);
  }
});
