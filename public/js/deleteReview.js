document.addEventListener('DOMContentLoaded', () => {

    const idInput = document.getElementById('reviewId');
    const reviewId = localStorage.getItem('reviewId');
    const idElement = document.getElementById('reviewId');

    if (reviewId) {
        idInput.value = reviewId;
        idElement.textContent = reviewId;
    }
})


const deleteReviewForm = document.getElementById('delete-review-form');
deleteReviewForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const token = localStorage.getItem('token');
    const reviewId = localStorage.getItem('reviewId');
    
    const response = await fetch(`/api/review/?id=${encodeURIComponent(reviewId)}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
      
    });
    const data = await response.json();
    if (response.ok) {
      alert(`Review Apagada com sucesso!`);
      window.location.href = '/profile';
    } else {
      alert(data.message);
    }
  });
  

