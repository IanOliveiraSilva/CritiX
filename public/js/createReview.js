document.addEventListener('DOMContentLoaded', () => {
  const titleInput = document.getElementById('movieTitle');
  const movieTitle = localStorage.getItem('movieTitle');
  const titleElement = document.getElementById('movieTitle');

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

  const movieTitle = localStorage.getItem('movieTitle'); // Mova esta linha aqui

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
