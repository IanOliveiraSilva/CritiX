const token = localStorage.getItem('token');

document.addEventListener('DOMContentLoaded', async () => {
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

      const listContainer = document.getElementById('lists');

      listData.forEach((list) => {
        const table = document.createElement('table');
        table.classList.add('table');

        const tbody = document.createElement('tbody');

        const nameRow = document.createElement('tr');
        const nameCell = document.createElement('td');
        nameCell.textContent = `Nome da lista: ${list.list_name}`;
        nameRow.appendChild(nameCell);
        tbody.appendChild(nameRow);

        const moviesRow = document.createElement('tr');
        const moviesCell = document.createElement('td');
        moviesCell.textContent = `Filmes: ${list.movie_titles}`;
        moviesRow.appendChild(moviesCell);
        tbody.appendChild(moviesRow);

        const descriptionRow = document.createElement('tr');
        const descriptionCell = document.createElement('td');
        descriptionCell.textContent = `Descrição: ${list.list_description}`;
        descriptionRow.appendChild(descriptionCell);
        tbody.appendChild(descriptionRow);

        table.appendChild(tbody);
        listContainer.appendChild(table);
      });

  } catch (error) {
    console.error('Erro ao buscar listas:', error);
  }
});