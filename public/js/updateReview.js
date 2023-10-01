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
  const specialRatingElement = document.getElementById('specialrating');
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
    const specialrating = document.getElementById('specialrating').value;
    
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
  

