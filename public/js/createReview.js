document.addEventListener('DOMContentLoaded', () => {
  const titleInput = document.getElementById('movieTitle');
  const movieTitle = localStorage.getItem('movieTitle');
  const titleElement = document.getElementById('movieTitle');
  const specialRatingInputTitle = document.getElementById('specialRatingTitle');
  const movieGenre = localStorage.getItem('movieGenre');

  const specialRatingMap = new Map([
    ['Horror', 'Nivel de Medo'],
    ['Comedy', 'Nivel de Diversão'],
    ['Action', 'Nivel de Adrenalina'],
    ['Romance', 'Nivel de Amor'],
    ['Drama', 'Nivel de Choro'],
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
});

const reviewForm = document.getElementById('review-form');
reviewForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const rating = document.getElementById('rating').value;
  const comment = document.getElementById('comment').value;
  const isPublic = document.getElementById('isPublic').checked;
  const specialRating = document.getElementById('specialRating').value;

  const token = localStorage.getItem('token');

  const movieTitle = localStorage.getItem('movieTitle');

  console.log(movieTitle);

  const response = await fetch('/api/review', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      title: movieTitle,
      rating,
      comment,
      isPublic,
      specialRating
    })
  });
  const data = await response.json();
  if (response.ok) {
    alert(`Review criada com sucesso!`);
  } else {
    alert(data.message);
  }
});
