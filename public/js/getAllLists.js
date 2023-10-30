const token = localStorage.getItem('token');
const listContainer = document.getElementById('lists');

document.addEventListener('DOMContentLoaded', async () => {
  const titleContainer = document.getElementById('pageTitle');

  try {
    const response = await fetch(`/api/allLists/`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Erro ao obter listas');
    }

    const listData = await response.json();

    const movieCount = document.createElement('p');
    movieCount.textContent = 'MINHAS LISTAS';
    movieCount.classList.add('title', 'uppercase-text');

    const hr = document.createElement('hr');

    titleContainer.appendChild(movieCount);
    titleContainer.appendChild(hr);

    const table = document.createElement('table');
    table.classList.add('table');

    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');

    const titleLabel = document.createElement('th');
    titleLabel.textContent = 'Lista';
    headerRow.appendChild(titleLabel);


    const actionsLabel = document.createElement('th');
    actionsLabel.textContent = 'Ações';
    headerRow.appendChild(actionsLabel);

    thead.appendChild(headerRow);
    table.appendChild(thead);

    for (const list of listData) {


      const tbody = document.createElement('tbody');

      const nameRow = document.createElement('tr');
      nameRow.addEventListener('click', function () {
        localStorage.setItem('listId', list.id);
        window.location.href = '/getListById';
      })
      const nameCell = document.createElement('td');

      const nameText = document.createElement('p');
      nameText.textContent = list.list_name;

      const descriptionText = document.createElement('span');
      descriptionText.textContent = list.list_description;

      nameCell.appendChild(nameText);
      nameCell.appendChild(document.createElement('br'));
      nameCell.appendChild(descriptionText);

      const listName = list.list_name;
      const actionsCell = document.createElement('td');

      if (listName !== 'Watchlist' && listName !== 'Meus filmes favoritos') {
        const editButton = document.createElement('a');
        editButton.innerHTML = '<i class="fas fa-pencil-alt"></i>';
        editButton.classList.add('edit-button');
        editButton.href = '/updateList';
        editButton.addEventListener('click', () => {
          localStorage.setItem('listId', list.id);
          localStorage.setItem('name', list.list_name);
          localStorage.setItem('description', list.list_description);
        });
  
        const deleteButton = document.createElement('a');
        deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
        deleteButton.classList.add('delete-button');
        deleteButton.href = '/getAllLists'
        deleteButton.addEventListener('click', () => {
          const confirmDelete = confirm('Tem certeza que deseja excluir a lista?');
            if (confirmDelete) {
              const response = fetch(`/api/list/?id=${encodeURIComponent(list.id)}`, {
                method: 'DELETE',
                headers: {
                  'Authorization': `Bearer ${token}`
                }
              });
            }
        });


        actionsCell.appendChild(editButton);
        actionsCell.insertAdjacentHTML('beforeend', '&emsp;');
        actionsCell.appendChild(deleteButton);
  
      }

    
      nameRow.appendChild(nameCell);
      nameRow.appendChild(actionsCell);
      tbody.appendChild(nameRow);

      table.appendChild(tbody);
      listContainer.appendChild(table);
    }
  } catch (error) {
    console.error('Erro ao buscar listas:', error);
  }
});
