const token = localStorage.getItem('token');

document.addEventListener('DOMContentLoaded', async () => {
    const usernameForm = document.getElementById('usernameForm');
    const reviewsContainer = document.getElementById('reviews');

    usernameForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const usernameInput = document.getElementById('usernameInput');
        const username = usernameInput.value.trim();

        if (!username) {
            alert('Please enter a valid username.');
            return;
        }

        try {
            const response = await fetch(`/api/allReviews/user/?user=${encodeURIComponent(username)}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Erro ao obter revisões do usuário');
            }
            
            const reviewsData = await response.json();

            reviewsContainer.innerHTML = '';

            const titleHeader = document.createElement('h1');
            titleHeader.textContent = `Avaliações para o Usuário: ${username}`;
            reviewsContainer.appendChild(titleHeader);

            reviewsData.forEach((review) => {

                const table = document.createElement('table');
                table.classList.add('table');

                const tbody = document.createElement('tbody');

                const titleRow = document.createElement('tr');
                const titleCell = document.createElement('td');
                titleCell.textContent = `Título: ${review.title}`;
                titleRow.appendChild(titleCell);
                tbody.appendChild(titleRow);

                const ratingRow = document.createElement('tr');
                const ratingCell = document.createElement('td');
                ratingCell.textContent = `Nota: ${review.rating}`;
                ratingRow.appendChild(ratingCell);
                tbody.appendChild(ratingRow);

                const commentRow = document.createElement('tr');
                const commentCell = document.createElement('td');
                commentCell.textContent = `Comentário: ${review.review}`;
                commentRow.appendChild(commentCell);
                tbody.appendChild(commentRow);

                const specialRatingRow = document.createElement('tr');
                const specialRatingCell = document.createElement('td');
                specialRatingCell.textContent = `Special Rating: ${review.specialrating}`;
                specialRatingRow.appendChild(specialRatingCell);
                tbody.appendChild(specialRatingRow);

                const deleteButtonRow = document.createElement('tr');
                const deleteButtonCell = document.createElement('td');
                const deleteButton = document.createElement('button');
                deleteButton.id = 'get-review-id'
                deleteButton.textContent = 'Excluir';
                deleteButton.addEventListener('click', () => {
                    localStorage.setItem('reviewId', review.id);
                    window.location.href = '/deleteReview';
                });
                deleteButtonCell.appendChild(deleteButton);
                deleteButtonRow.appendChild(deleteButtonCell);
                tbody.appendChild(deleteButtonRow);

                
                const editReviewButtonRow = document.createElement('tr');
                const editReviewButtonCell = document.createElement('td');
                const editButton = document.createElement('button');
                editButton.id = 'get-review-id'
                editButton.textContent = 'Editar';
                editButton.addEventListener('click', () => {
                    localStorage.setItem('reviewId', review.id);
                    window.location.href = '/updateReview';
                });
                editReviewButtonCell.appendChild(editButton);
                editReviewButtonRow.appendChild(editReviewButtonCell);
                tbody.appendChild(editReviewButtonRow);

                table.appendChild(tbody);
                reviewsContainer.appendChild(table);
            });



        } catch (error) {
            console.error('Erro ao buscar revisões do usuário:', error);
        }
    });
});
