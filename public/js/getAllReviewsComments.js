

document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    const reviewId = localStorage.getItem('reviewId');
    const username = localStorage.getItem('username');
    try {
        const commentsContainer = document.getElementById('comments');

        const response = await fetch(`/api/comment/review/?id=${encodeURIComponent(reviewId)}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Erro ao obter comentários');
        }

        const commentsData = await response.json();



        commentsData.forEach((comment) => {
            const table = document.createElement('table');
            table.classList.add('table');

            const tbody = document.createElement('tbody');

            const userRow = document.createElement('tr');
            const userCell = document.createElement('td');

            const userText = document.createElement('p');
            userText.textContent = `${comment.username}`;

            const commentTextCell = document.createElement('span');
            commentTextCell.textContent = `${comment.comment}`;


            const buttonsContainer = document.createElement('div');
            buttonsContainer.classList.add('text-center');

            if (comment.username == username) {
                const editButton = document.createElement('a');
                editButton.innerHTML = `<i class="fas fa-pencil-alt" style="color: #000000; font-size: 30px;"></i>`;
                editButton.classList.add('edit-button');
                editButton.href = '/updateComment';
                editButton.addEventListener('click', () => {
                    localStorage.setItem('reviewId', comment.reviewid);
                    localStorage.setItem('comment', comment.comment);
                    localStorage.setItem('commentId', comment.id);
                });

                const deleteButton = document.createElement('a');
                deleteButton.innerHTML = '<i class="fas fa-trash" style="color: #000000; font-size: 30px;"></i> ';
                deleteButton.classList.add('delete-button');
                deleteButton.href = '/getAllReviewsComments'
                deleteButton.addEventListener('click', () => {
                    const confirmDelete = confirm('Tem certeza que deseja excluir o comentario?');
                    if (confirmDelete) {
                        const response = fetch(`/api/comment/?id=${encodeURIComponent(comment.id)}`, {
                            method: 'DELETE',
                            headers: {
                                'Authorization': `Bearer ${token}`
                            }
                        });
                    }
                    if(response.ok){
                        window.location.href = '/getAllUserReviews';
                        alert('Comentario excluido com sucesso!.');
                    }
                });

                buttonsContainer.appendChild(editButton);
                buttonsContainer.insertAdjacentHTML('beforeend', '&emsp;');
                buttonsContainer.appendChild(deleteButton);
                
            }

            userCell.appendChild(userText);
            userCell.appendChild(commentTextCell);
            userRow.appendChild(userCell);
            userRow.appendChild(buttonsContainer);
            tbody.appendChild(userRow);

            table.appendChild(tbody);
            commentsContainer.appendChild(table);


        });
    } catch (error) {
        console.error('Erro ao buscar comentários:', error);
    }
});
