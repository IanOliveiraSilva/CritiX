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

    const ulElement = document.createElement('ul');
    ulElement.classList.add('list-group');

    listData.body.Lista.movie_titles.forEach(movieTitle => {
      const liElement = document.createElement('li');
      liElement.classList.add('list-group-item');
      liElement.textContent = movieTitle;
      ulElement.appendChild(liElement);
    });

    listContainer.appendChild(ulElement);

  } catch (error) {
    console.error('Erro ao buscar listas:', error);
  }
});
