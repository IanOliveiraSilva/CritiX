document.addEventListener('DOMContentLoaded', () => {
  const titleInput = document.getElementById('movieTitle');
  const movieTitle = localStorage.getItem('movieTitle');
  const titleElement = document.getElementById('movieTitle');
  const specialRatingInputTitle = document.getElementById('specialRatingTitle');
  const movieGenre = localStorage.getItem('movieGenre');
  const createReviewButton = document.getElementById('create-review-button');

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

  if (movieGenre) {
    specialRatingInputTitle.textContent = `${movieGenreMapped}: `;
  }

  if (movieTitle) {
    titleInput.value = movieTitle;
    titleElement.textContent = movieTitle;
  }

  const reviewForm = document.getElementById('review-form');
  reviewForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const rating = document.getElementById('rating').value;
    const comment = document.getElementById('comment').value;
    const isPublic = document.getElementById('isPublic').checked;
    const specialRating = document.getElementById('specialRating').value;

    const token = localStorage.getItem('token');

    const movieTitle = localStorage.getItem('movieTitle');
    const movieimdbId = localStorage.getItem('movieimbdId');

    createReviewButton.disabled = true;

    const response = await fetch('/api/review', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        title: movieTitle,
        imdbID: movieimdbId,
        rating,
        comment,
        isPublic,
        specialRating
      })
    });

    const data = await response.json();

    if (response.ok) {
      window.location.href = '/getAllReviews';
    } else {
      alert(data.message);
    }
  });
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

