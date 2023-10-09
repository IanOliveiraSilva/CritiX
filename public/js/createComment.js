document.addEventListener('DOMContentLoaded', () => {
    const idInput = document.getElementById('reviewId');
    const reviewId = localStorage.getItem('reviewId');
    const idElement = document.getElementById('reviewId');

    if (reviewId) {
        idInput.value = reviewId;
        idElement.textContent = reviewId;
    }

});

    const createCommentForm = document.getElementById('create-comment-form');
    createCommentForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const reviewId = localStorage.getItem('reviewId');
        const comment = document.getElementById('comment').value;
        const token = localStorage.getItem('token');

        console.log(reviewId);
        console.log("reviewId");

        try {
            const response = await fetch('/api/comment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    reviewId: reviewId,
                    comment
                })
            });

            if (response.ok) {
                const data = await response.json();
                alert('Comentario criado com sucesso!');
                window.location.href = '/';
            } else {
                const data = await response.json();
                alert(`Erro: ${data.message}`);
            }
        } catch (error) {
            console.error(error);
            alert('Um erro aconteceu ao criar a lista');
        }
    });
