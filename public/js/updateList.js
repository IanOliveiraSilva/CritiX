document.addEventListener('DOMContentLoaded', async () => {
  const idInput = document.getElementById('listId');
  const listId = localStorage.getItem('listId');
  const idElement = document.getElementById('listId');

  const actualName = localStorage.getItem('name');
  const nameElement = document.getElementById('name');
  nameElement.value = actualName;

  const actualDescription = localStorage.getItem('description');
  const descriptionElement = document.getElementById('description');
  descriptionElement.value = actualDescription;

  const actualMovieTitles = localStorage.getItem('movie_titles');
  const movieTitlesElement = document.getElementById('movieTitles');
  movieTitlesElement.value = actualMovieTitles;

  if (listId) {
    idInput.value = listId;
    idElement.textContent = listId;
  }
});

const updateListForm = document.getElementById('update-list-form');
updateListForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const token = localStorage.getItem('token');
  const listId = localStorage.getItem('listId');

  const name = document.getElementById('name').value;
  const description = document.getElementById('description').value;
  const movieTitlesInput = document.getElementById('movieTitles');
  const isPublic = document.getElementById('isPublic').checked;

  const movieTitles = movieTitlesInput.dataset.modified === 'true' ? movieTitlesInput.value.split(',') : undefined;

  const requestBody = {
    name,
    description,
    isPublic,
  };

  if (movieTitles !== undefined) {
    requestBody.movieTitles = movieTitles;
  }

  const response = await fetch(`/api/list/?id=${encodeURIComponent(listId)}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(requestBody)
  });

  const data = await response.json();
  if (response.ok) {
    alert(`Lista Atualizada com sucesso!`);
    window.location.href = '/getAllLists';
  } else {
    alert(data.message);
  }
});

const movieTitlesInput = document.getElementById('movieTitles');
movieTitlesInput.addEventListener('change', () => {
  movieTitlesInput.dataset.modified = 'true';
});
