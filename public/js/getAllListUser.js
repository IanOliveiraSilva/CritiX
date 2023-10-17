document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    const listContainer = document.getElementById('lists');
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

            const titleHeader = document.createElement('h1');
            titleHeader.textContent = `Listas para o Usuário: ${username}`;
            listContainer.appendChild(titleHeader);

            for(const list of listsData) {
                const table = document.createElement('table');
                table.classList.add('table');
          
                const tbody = document.createElement('tbody');
          
                const nameRow = document.createElement('tr');
                const nameCell = document.createElement('td');
                nameCell.textContent = `Nome da lista: ${list.list_name}`;
                nameRow.appendChild(nameCell);
                tbody.appendChild(nameRow);
          
                const descriptionRow = document.createElement('tr');
                const descriptionCell = document.createElement('td');
                descriptionCell.textContent = `Descrição: ${list.list_description}`;
                descriptionRow.appendChild(descriptionCell);
                tbody.appendChild(descriptionRow);

                const getListButtonRow = document.createElement('tr');
                const getListButtonCell = document.createElement('td');
                const getListButton = document.createElement('button');
                getListButton.id = 'get-button-id';
                getListButton.textContent = 'Ver Lista';
                getListButton.addEventListener('click', () => {
                  localStorage.setItem('listId', list.id);
                  window.location.href = '/getListById';
                });
                getListButtonCell.appendChild(getListButton);
                getListButtonRow.appendChild(getListButtonCell);
                tbody.appendChild(getListButtonRow);
                getListButton.classList.add('btn', 'btn-warning', 'text-dark', 'btn-link', 'mt-3');
          
                table.appendChild(tbody);
                listContainer.appendChild(table);
            };
        }
    } catch (error) {
        console.error('Erro ao buscar revisões do usuário:', error);
    }
});
