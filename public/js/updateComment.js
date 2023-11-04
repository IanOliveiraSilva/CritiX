document.addEventListener('DOMContentLoaded', async () => {
  const actualComment= localStorage.getItem('comment');
  const commentElement = document.getElementById('comment');
  commentElement.value = actualComment;
});

const updateReviewForm = document.getElementById('update-review-form');
updateReviewForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const token = localStorage.getItem('token');
  const commentId = localStorage.getItem('commentId');
  const comment = document.getElementById('comment').value;

  const response = await fetch(`/api/comment/?id=${encodeURIComponent(commentId)}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      comment,
    })
  });
  const data = await response.json();
  if (response.ok) {
    window.location.href = '/getAllReviewsComments';
  } else {
    alert(data.message);
  }
});
