

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
            userCell.textContent = `Usuario: ${comment.username}`;
            userRow.appendChild(userCell);
            tbody.appendChild(userRow);

            const commentTextRow = document.createElement('tr');
            const commentTextCell = document.createElement('td');
            commentTextCell.textContent = `Comentário: ${comment.comment}`;
            commentTextRow.appendChild(commentTextCell);
            tbody.appendChild(commentTextRow);
            table.appendChild(tbody);
            commentsContainer.appendChild(table);


        });
    } catch (error) {
        console.error('Erro ao buscar comentários:', error);
    }
});
