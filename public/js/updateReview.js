document.addEventListener('DOMContentLoaded', async () => {
  const idInput = document.getElementById('reviewId');
  const reviewId = localStorage.getItem('reviewId');
  const idElement = document.getElementById('reviewId');

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
      window.location.href = '/';
    } else {
      alert(data.message);
    }
  });
  

