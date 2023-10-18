

document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    const reviewId = localStorage.getItem('reviewId');
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

            userCell.appendChild(userText);
            userCell.appendChild(commentTextCell);
            userRow.appendChild(userCell);
            tbody.appendChild(userRow);

            table.appendChild(tbody);
            commentsContainer.appendChild(table);


        });
    } catch (error) {
        console.error('Erro ao buscar comentários:', error);
    }
});
