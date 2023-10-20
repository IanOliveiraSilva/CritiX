const token = localStorage.getItem('token');
let movieTitle;

document.addEventListener('DOMContentLoaded', async () => {
  try {
    movieTitle = localStorage.getItem('movieTitle');
    const titleInput = document.getElementById('movieTitle');
    const listContainer = document.getElementById('lists');
    const titleContainer = document.getElementById('pageTitle');

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

      const movieCount = document.createElement('p');
      movieCount.textContent = 'LISTAS DE ' + movieTitle;
      movieCount.classList.add('title', 'uppercase-text');

      const hr = document.createElement('hr');

      titleContainer.appendChild(movieCount);
      titleContainer.appendChild(hr);

      listData.body.Lista.forEach((list) => {
        const table = document.createElement('table');
        table.classList.add('table');

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
      });
    }
  } catch (error) {
    console.error('Erro ao buscar listas:', error);
  }
});
