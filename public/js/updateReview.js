document.addEventListener('DOMContentLoaded', async () => {
  const idInput = document.getElementById('reviewId');
  const reviewId = localStorage.getItem('reviewId');
  const idElement = document.getElementById('reviewId');
  const specialRatingInputTitle = document.getElementById('specialRatingTitle');
  const movieGenre = localStorage.getItem('genre');

  const actualRating = localStorage.getItem('rating');
  const ratingElement = document.getElementById('rating');
  ratingElement.value = actualRating;

  const actualReview = localStorage.getItem('review');
  const reviewElement = document.getElementById('review');
  reviewElement.value = actualReview;

  const actualSpecialRating = localStorage.getItem('specialRating');
  const specialRatingElement = document.getElementById('specialRating');
  specialRatingElement.value = actualSpecialRating;

  const specialRatingMap = new Map([
    ['Horror', 'Nivel de Horror'],
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

  if (movieGenre) {
    specialRatingInputTitle.textContent = `${movieGenreMapped}: `;
  }

  // Preenche as estrelas de rating com base no valor armazenado no localStorage
  if (actualRating) {
    const ratingStars = document.querySelectorAll('#stars1 .star');
    ratingStars.forEach(star => {
      if (star.dataset.value <= actualRating) {
        star.textContent = '★';
        star.classList.add('selected');
      } else {
        star.textContent = '☆';
        star.classList.remove('selected');
      }
    });
  }

  // Preenche as estrelas de specialRating com base no valor armazenado no localStorage
  if (actualSpecialRating) {
    const specialRatingStars = document.querySelectorAll('#stars2 .star');
    specialRatingStars.forEach(star => {
      if (star.dataset.value <= actualSpecialRating) {
        star.textContent = '★';
        star.classList.add('selected');
      } else {
        star.textContent = '☆';
        star.classList.remove('selected');
      }
    });
  }

  if (reviewId) {
    idInput.value = reviewId;
    idElement.textContent = reviewId;
  }
});

const updateReviewForm = document.getElementById('update-review-form');
updateReviewForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const token = localStorage.getItem('token');
  const reviewId = localStorage.getItem('reviewId');

  const rating = document.getElementById('rating').value;
  const review = document.getElementById('review').value;
  const ispublic = document.getElementById('ispublic').checked;
  const specialrating = document.getElementById('specialRating').value;

  const response = await fetch(`/api/review/?id=${encodeURIComponent(reviewId)}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      rating,
      review,
      ispublic,
      specialrating
    })
  });
  const data = await response.json();
  if (response.ok) {
    alert(`Review Atualizada com sucesso!`);
    window.location.href = '/getAllReviews';
  } else {
    alert(data.message);
  }
});

document.querySelectorAll('#stars1 .star').forEach(star => {
  star.addEventListener('click', function () {
    var value = this.dataset.value;

    document.getElementById('rating').value = value;

    let currentStar = this;

    while (currentStar) {
      currentStar.textContent = '★';
      currentStar.classList.add('selected');
      currentStar = currentStar.previousElementSibling;
    }

    currentStar = this.nextElementSibling;

    while (currentStar) {
      currentStar.textContent = '☆';
      currentStar.classList.remove('selected');
      currentStar = currentStar.nextElementSibling;
    }
  });
});

document.querySelectorAll('#stars2 .star').forEach(star => {
  star.addEventListener('click', function () {
    var value = this.dataset.value;

    document.getElementById('specialRating').value = value;

    let currentStar = this;

    while (currentStar) {
      currentStar.textContent = '★';
      currentStar.classList.add('selected');
      currentStar = currentStar.previousElementSibling;
    }

    currentStar = this.nextElementSibling;

    while (currentStar) {
      currentStar.textContent = '☆';
      currentStar.classList.remove('selected');
      currentStar = currentStar.nextElementSibling;
    }
  });
});
