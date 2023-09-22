

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

        commentsContainer.innerHTML = '';

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
