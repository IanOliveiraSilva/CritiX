document.addEventListener('DOMContentLoaded', () => {
    const createListForm = document.getElementById('create-list-form');
    const input = document.querySelector('#search-input');
    const resultsList = document.querySelector('#results');
    const apiKey = '41459cb7';

    const selectedMovies = [];
    const selectedMoviesHtml = document.getElementById('selected-movies');

    const imdbIdMovies = [];
  
    createListForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const name = document.getElementById('name').value;
      const description = document.getElementById('description').value;
      const isPublic = document.getElementById('isPublic').checked;
      const token = localStorage.getItem('token');
  
      try {
        const response = await fetch('/api/list', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            name,
            description,
            movieTitles: selectedMovies,
            moviesId: imdbIdMovies,
            isPublic,
          }),
        });
  
        if (response.ok) {
          const data = await response.json();
          alert('Lista criada com sucesso!');
          window.location.href = '/getAllLists';
        } else {
          const data = await response.json();
          alert(`Erro: ${data.message}`);
        }
      } catch (error) {
        console.error(error);
        alert('Um erro aconteceu ao criar a lista');
      }
    });
  
    input.addEventListener('input', async () => {
        const query = input.value.trim();
        const url = `https://www.omdbapi.com/?s=${query}&apikey=${apiKey}`;

        try {
            const response = await fetch(url);
            const data = await response.json();

            if (data.Search && data.Search.length > 0) {
                resultsList.innerHTML = '';
                
                data.Search.forEach(movie => {
                    const li = document.createElement('li');
                    li.innerHTML = `
                        ${movie.Title} (${movie.Year})
                    `;
                    li.addEventListener('click', async () => {
                        resultsList.innerHTML = '';
                        selectedMovies.push(movie.Title);
                        imdbIdMovies.push(movie.imdbID);
                        updateSelectedMovies();
                        input.value = '';
                        alert(`Filme "${movie.Title}" adicionado à lista!`);
                    });
                    resultsList.appendChild(li);
                });
            } else {
                resultsList.innerHTML = 'Nenhum resultado encontrado.';
            }
        } catch (error) {
            console.log(error);
        }
    });

    function updateSelectedMovies() {
      selectedMoviesHtml.textContent = selectedMovies.join(' ,');
    }
  });
  