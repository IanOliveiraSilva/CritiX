document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    const listsContainer = document.getElementById('lists');
    const username = localStorage.getItem('userprofile');

    try {
        const listResponse = await fetch(`/api/list/user?userProfile=${encodeURIComponent(username)}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (listResponse.ok) {
            const listsData = await listResponse.json();

            listsContainer.innerHTML = '';

            const titleHeader = document.createElement('h1');
            titleHeader.textContent = `Listas para o Usuário: ${username}`;
            listsContainer.appendChild(titleHeader);

            listsData.body.Lista.forEach((list) => {
                const table = document.createElement('table');
                table.classList.add('table');

                const tbody = document.createElement('tbody');

                const userRow = document.createElement('tr');
                const userCell = document.createElement('td');
                userCell.textContent = `Usuario: ${list.user}`;
                userRow.appendChild(userCell);
                tbody.appendChild(userRow);


                const listNameRow = document.createElement('tr');
                const listNameCell = document.createElement('td');
                listNameCell.textContent = `Nome da Lista: ${list.list_name}`;
                listNameRow.appendChild(listNameCell);
                tbody.appendChild(listNameRow);

                const listDescriptionRow = document.createElement('tr');
                const listDescriptionCell = document.createElement('td');
                listDescriptionCell.textContent = `Descrição da lista: ${list.list_description}`;
                listDescriptionRow.appendChild(listDescriptionCell);
                tbody.appendChild(listDescriptionRow);

                const movieTitlesRow = document.createElement('tr');
                const movieTitlesCell = document.createElement('td');
                movieTitlesCell.textContent = `Filmes: ${list.movie_titles}`;
                movieTitlesRow.appendChild(movieTitlesCell);
                tbody.appendChild(movieTitlesRow);

                table.appendChild(tbody);
                listsContainer.appendChild(table);
            });
        }
    } catch (error) {
        console.error('Erro ao buscar revisões do usuário:', error);
    }
});
