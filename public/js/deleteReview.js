document.getElementById('delete-review-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const reviewId = document.getElementById('reviewId').value;
    const token = localStorage.getItem('token');

    try {
        const response = await fetch(`/api/review/?id=${reviewId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
              }
        });

        const data = await response.json();

        if (response.status === 200) {
            document.getElementById('message').innerHTML = `<p>${data.message}</p>`;
        } else {
            document.getElementById('message').innerHTML = `<p>${data.message}</p>`;
        }
    } catch (error) {
        console.error(error);
        document.getElementById('message').innerHTML = `<p>Ocorreu um erro ao excluir a revisão.</p>`;
    }
});