document.addEventListener('DOMContentLoaded', () => {
    const createListForm = document.getElementById('create-list-form');
    createListForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        var movieTitlesInput = document.getElementById("movieTitles");
        var movieTitles = movieTitlesInput.value.split(",").map(function (title) {
            return title.trim();
        });

        if (movieTitles.length > 3) {
            alert("Você só pode adicionar até 3 filmes à lista.");
        } else {
            this.submit();
        }

        const name = 'Meus filmes favoritos';
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
                    name,
                    description,
                    movieTitles: movieTitles.split(','),
                    isPublic,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                alert('Lista criada com sucesso!');
                window.location.href = '/getAllLists';
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
