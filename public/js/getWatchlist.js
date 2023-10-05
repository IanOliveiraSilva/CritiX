const token = localStorage.getItem('token');

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch(`/api/watchlist/`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Erro ao obter lista');
    }

    const listData = await response.json();

    const listContainer = document.getElementById('lists');

      const table = document.createElement('table');
      table.classList.add('table');

      const tbody = document.createElement('tbody');

      const moviesRow = document.createElement('tr');
      const moviesCell = document.createElement('td');
      moviesCell.textContent = `Filmes: ${listData.body.Lista.movie_titles}`;
      moviesRow.appendChild(moviesCell);
      tbody.appendChild(moviesRow);

      table.appendChild(tbody);
      listContainer.appendChild(table);

  } catch (error) {
    console.error('Erro ao buscar listas:', error);
  }
});