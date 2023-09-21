document.addEventListener('DOMContentLoaded', async () => {
  const idInput = document.getElementById('listId');
  const listId = localStorage.getItem('listId');
  const idElement = document.getElementById('listId');

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

  // Verifique se o campo movieTitles foi alterado pelo usuário
  const movieTitles = movieTitlesInput.dataset.modified === 'true' ? movieTitlesInput.value.split(',') : undefined;

  const requestBody = {
    name,
    description,
    isPublic,
  };

  // Adicione movieTitles ao requestBody apenas se ele foi modificado
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
