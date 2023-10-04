document.addEventListener('DOMContentLoaded', () => {
    const createListForm = document.getElementById('create-list-form');
    createListForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const listName = 'Meus filmes favoritos';
        const description = 'Uma lista com os melhores filmes';
        const movieTitles = document.getElementById('movieTitles').value;
        const isPublic = true;
        const token = localStorage.getItem('token');

        try {
            const response = await fetch('/api/list', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: listName,
                    description,
                    movieTitles: movieTitles.split(','),
                    isPublic,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                alert('Lista criada com sucesso!');
                window.location.href = '/profile';
            } else {
                const data = await response.json();
                alert(`Erro: ${data.message}`);
            }
        } catch (error) {
            console.error(error);
            alert('Um erro aconteceu ao criar a lista');
        }
    });
});
