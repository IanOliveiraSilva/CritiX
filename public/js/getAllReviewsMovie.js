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
  try {
    const token = localStorage.getItem('token');
    let movieTitle;
    let movieimdbId;
    movieTitle = localStorage.getItem('movieTitle');
    movieimdbId = localStorage.getItem('movieimbdId');
    const titleContainer = document.getElementById('pageTitle')
    const titleInput = document.getElementById('movieTitle');

    if (movieTitle && titleInput) {
      titleInput.value = movieTitle;
    }

    if (movieTitle) {
      const response = await fetch(`/api/allReviews/movies/?title=${encodeURIComponent(movieimdbId)}`, {
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

      // Title
      const movieCount = document.createElement('p');
      movieCount.textContent = reviewsData[0].title;
      movieCount.classList.add('title', 'uppercase-text');

      const hr = document.createElement('hr');

      titleContainer.appendChild(movieCount);
      titleContainer.appendChild(hr);

      reviewsData.forEach((review) => {
        const movieGenre = `${review.genre}`;

        const specialRatingMap = new Map([
          ['Horror', 'Nivel de Medo'],
          ['Comedy', 'Nivel de Diversão'],
          ['Action', 'Nivel de Adrenalina'],
          ['Romance', 'Nivel de Amor'],
          ['Drama', 'Nivel de Drama'],
          ['Animation', 'Nivel de Criatividade'],
          ['Sci-fi', 'Nivel de Inovação'],
          ['Crime', 'Nivel de Apreensão'],
          ['Thriller', 'Nivel de Apreensão']
        ]);

        const getSpecialRating = (genre) => {
          const genreArray = genre.split(',');
          const firstGenre = genreArray[0];
          return specialRatingMap.get(firstGenre.trim());
        }

        const movieGenreMapped = getSpecialRating(movieGenre);

        const table = document.createElement('table');
        table.classList.add('table');

        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
  
        const titleLabel = document.createElement('th');
        titleLabel.textContent = 'Usuario';
        headerRow.appendChild(titleLabel);
  
        const dateLabel = document.createElement('th');
        dateLabel.textContent = 'Data';
        headerRow.appendChild(dateLabel);
  
        const specialRatingLabel = document.createElement('th');
        specialRatingLabel.textContent = `${movieGenreMapped}`;
        headerRow.appendChild(specialRatingLabel);
  
        const ratingLabel = document.createElement('th');
        ratingLabel.textContent = 'Nota';
        headerRow.appendChild(ratingLabel);
  
        const actionsLabel = document.createElement('th');
        actionsLabel.textContent = 'Ações';
        headerRow.appendChild(actionsLabel);
  
        thead.appendChild(headerRow);
        table.appendChild(thead);

        const tbody = document.createElement('tbody');

        const userCell = document.createElement('td');
        userCell.textContent = `${review.username}`;

        const ratingRow = document.createElement('tr');
        ratingRow.addEventListener('click', function () {
          localStorage.setItem('reviewId', review.id);
          window.location.href = `/getReviewById`;
        });

        const ratingCell = document.createElement('td');
        ratingCell.appendChild(generateStarRating(review.rating));

        const specialRatingCell = document.createElement('td');
        specialRatingCell.appendChild(generateStarRating(reviewsData[0].specialrating, 'movie-title'));

        const createdDate = new Date(review.created_at);
        const day = createdDate.getDate();
        const month = createdDate.getMonth() + 1;
        const formattedDay = day < 10 ? `0${day}` : day;
        const formattedMonth = month < 10 ? `0${month}` : month;
        const dateCell = document.createElement('td');
        dateCell.textContent = `${formattedDay}/${formattedMonth}`;

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
        actionsCell.appendChild(commentButton);

        ratingRow.appendChild(userCell);
        ratingRow.appendChild(dateCell);
        ratingRow.appendChild(specialRatingCell);
        ratingRow.appendChild(ratingCell);
        ratingRow.appendChild(actionsCell);


        tbody.appendChild(ratingRow);

        table.appendChild(tbody);
        reviewsContainer.appendChild(table);
      });
    }
  } catch (error) {
    console.error('Erro ao buscar revisões:', error);
  }
});
