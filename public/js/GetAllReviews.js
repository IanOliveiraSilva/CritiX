 window.onload = async () => {
        const token = localStorage.getItem('token');

        const response = await fetch('/api/allReviews', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const reviews = await response.json();

        const reviewsContainer = document.getElementById('reviews');

        reviews.forEach((review) => {
          const reviewElement = document.createElement('div');
          reviewElement.innerHTML = `
            <h2>${review.title}</h2>
            <p>Avaliação: ${review.rating}</p>
            <p>Comentarios: ${review.review}</p>
            <p>Special Rating: ${review.specialRating}</p>
          `;
          reviewsContainer.appendChild(reviewElement);
        });
      };