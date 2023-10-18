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

    for (const list of listData) {
      const table = document.createElement('table');
      table.classList.add('table');

      const tbody = document.createElement('tbody');

      const nameRow = document.createElement('tr');
      const nameCell = document.createElement('td');
      
      const nameText = document.createElement('span');
      nameText.textContent = list.list_name;
      
      const descriptionText = document.createElement('span');
      descriptionText.textContent = list.list_description;
      
      nameCell.appendChild(nameText);
      nameCell.appendChild(document.createElement('br'));
      nameCell.appendChild(descriptionText);
      
      nameRow.appendChild(nameCell);
      tbody.appendChild(nameRow);
      

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
    }
  } catch (error) {
    console.error('Erro ao buscar listas:', error);
  }
});
