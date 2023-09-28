const token = localStorage.getItem('token');

document.addEventListener('DOMContentLoaded', async () => {
    const usernameForm = document.getElementById('usernameForm');
    const listsContainer = document.getElementById('lists');

    usernameForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const usernameInput = document.getElementById('usernameInput');
        const username = usernameInput.value.trim();

        if (!username) {
            alert('Please enter a valid username.');
            return;
        }

        try {
            const response = await fetch(`/api/list/user?user=${encodeURIComponent(username)}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Erro ao obter listas do usuário');
            }

            const listsData = await response.json();

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
        } catch (error) {
            console.error('Erro ao buscar listas do usuário:', error);
        }
    });
});
