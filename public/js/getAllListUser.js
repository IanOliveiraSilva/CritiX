document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    const listContainer = document.getElementById('lists');
    const username = localStorage.getItem('userprofile');
    const titleContainer = document.getElementById('pageTitle');

    try {
        const listResponse = await fetch(`/api/list/user?userProfile=${encodeURIComponent(username)}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (listResponse.ok) {
            const listsData = await listResponse.json();

            const movieCount = document.createElement('p');
            movieCount.textContent = 'LISTAS DE ' + listsData[0].user;
            movieCount.classList.add('title', 'uppercase-text');

            const hr = document.createElement('hr');

            titleContainer.appendChild(movieCount);
            titleContainer.appendChild(hr);

            for (const list of listsData) {
                const table = document.createElement('table');
                table.classList.add('table');

                const tbody = document.createElement('tbody');

                const nameRow = document.createElement('tr');
                nameRow.addEventListener('click', function(){
                    localStorage.setItem('listId', list.id);
                    window.location.href = '/getListById';
                })

                const nameCell = document.createElement('td');

                const nameText = document.createElement('p');
                nameText.textContent = list.list_name;

                const descriptionText = document.createElement('span');
                descriptionText.textContent = list.list_description;

                const userText = document.createElement('span');
                userText.textContent = list.user

                nameCell.appendChild(userText);
                nameCell.appendChild(document.createElement('br'))
                nameCell.appendChild(nameText);
                nameCell.appendChild(document.createElement('br'));
                nameCell.appendChild(descriptionText);
                
                
                nameRow.appendChild(nameCell);
                tbody.appendChild(nameRow);

                table.appendChild(tbody);
                listContainer.appendChild(table);
            };
        }
    } catch (error) {
        console.error('Erro ao buscar revisões do usuário:', error);
    }
});
