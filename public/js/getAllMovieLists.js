const token = localStorage.getItem('token');
let movieTitle;

document.addEventListener('DOMContentLoaded', async () => {
  try {
    movieTitle = localStorage.getItem('movieTitle');
    const titleInput = document.getElementById('movieTitle');

    if (movieTitle && titleInput) {
      titleInput.value = movieTitle;
    }

    if (movieTitle) {
      const response = await fetch(`/api/list/movie?movie_titles=${encodeURIComponent(movieTitle)}`, {
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

      const titleHeader = document.createElement('h1');
      titleHeader.textContent = `Listas para o Filme: ${movieTitle}`;
      listContainer.appendChild(titleHeader);

      listData.body.Lista.forEach((list) => {
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
        listContainer.appendChild(table);
      });
    }
  } catch (error) {
    console.error('Erro ao buscar listas:', error);
  }
});
