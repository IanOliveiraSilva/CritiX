document.addEventListener('DOMContentLoaded', async () => {
    try {
        const token = localStorage.getItem('token');
        const idInput = document.getElementById('reviewId');
        const reviewId = localStorage.getItem('reviewId');
        const idElement = document.getElementById('reviewId');

        if (reviewId) {
            idInput.value = reviewId;
            idElement.textContent = reviewId;
        }

        const response = await fetch(`/api/comment/review/?id=${encodeURIComponent(reviewId)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Erro ao obter comentários');
        }

        const commentsData = await response.json();

        const commentsContainer = document.getElementById('comments-container');

        commentsData.forEach((comment) => {
            const commentElement = document.createElement('div');
            commentElement.classList.add('comment');

            const usernameElement = document.createElement('p');
            usernameElement.textContent = `Usuário: ${comment.username}`;

            const commentTextElement = document.createElement('p');
            commentTextElement.textContent = `Comentário: ${comment.comment}`;
            commentElement.appendChild(usernameElement);
            commentElement.appendChild(commentTextElement);
            commentsContainer.appendChild(commentElement);
        });
    } catch (error) {
        console.error('Erro ao buscar comentários:', error);
    }
});
