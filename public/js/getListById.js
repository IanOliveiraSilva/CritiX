document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    const listContainer = document.getElementById('lists');
    const username = localStorage.getItem('username');
    const id = localStorage.getItem('listId');

    try {
        const listResponse = await fetch(`/api/listById/?id=${encodeURIComponent(id)}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    
            const listsData = await listResponse.json();

            const titleHeader = document.createElement('h1');
            titleHeader.textContent = `Listas para o Usuário: ${username}`;
            listContainer.appendChild(titleHeader);

            for(const list of listsData) {
                const table = document.createElement('table');
                table.classList.add('table');
          
                const tbody = document.createElement('tbody');
          
                const nameRow = document.createElement('tr');
                const nameCell = document.createElement('td');
                nameCell.textContent = `Nome da lista: ${list.list_name}`;
                nameRow.appendChild(nameCell);
                tbody.appendChild(nameRow);
          
                const descriptionRow = document.createElement('tr');
                const descriptionCell = document.createElement('td');
                descriptionCell.textContent = `Descrição: ${list.list_description}`;
                descriptionRow.appendChild(descriptionCell);
                tbody.appendChild(descriptionRow);
          
                if (list.moviesid && list.moviesid.length > 0) {
                  for (let i = 0; i < list.moviesid.length; i++) {
                    const movieResponse = await fetch(`/api/movie/id?imdbID=${encodeURIComponent(list.moviesid[i])}`, {
                      method: 'GET',
                      headers: {
                        'Authorization': `Bearer ${token}`
                      }
                    });
          
                    const movieData = await movieResponse.json();
          
                    const moviesRow = document.createElement('tr');
                    const moviesCell = document.createElement('td');
                    
                    const movieLink = document.createElement('a');
                    movieLink.href = '/getMovieByTitle';
                    
                    const posterImg = document.createElement('img');
                    posterImg.src = movieData.body.movieData.Poster;
                    posterImg.alt = movieData.body.movieData.Title;
                    posterImg.classList.add('movie-poster');
                    
                    movieLink.addEventListener('click', function () {
                      localStorage.setItem('movieTitle', movieData.body.movieData.Title);
                      localStorage.setItem('movieimbdId', movieData.body.movieData.imdbID);
                    });
                    
                    
                    movieLink.appendChild(posterImg);
                    moviesCell.appendChild(movieLink);
                    moviesRow.appendChild(moviesCell);
                    tbody.appendChild(moviesRow);
                    
                  }
                } else if (list.movie_titles) {
                  const moviesRow = document.createElement('tr');
                  const moviesCell = document.createElement('td');
                  moviesCell.textContent = `Filmes: ${list.movie_titles}`;
                  moviesRow.appendChild(moviesCell);
                  tbody.appendChild(moviesRow);
                } else {
                  const noMoviesRow = document.createElement('tr');
                  const noMoviesCell = document.createElement('td');
                  noMoviesCell.textContent = 'Esta lista não possui filmes.';
                  noMoviesRow.appendChild(noMoviesCell);
                  tbody.appendChild(noMoviesRow);
                }
          
                const editListButtonRow = document.createElement('tr');
                const editListButtonCell = document.createElement('td');
                const editButton = document.createElement('button');
                editButton.textContent = 'Editar';
                editButton.addEventListener('click', () => {
                  localStorage.setItem('listId', list.id);
                  localStorage.setItem('name', list.list_name);
                  localStorage.setItem('description', list.list_description);
                  window.location.href = '/updateList';
                });
                editListButtonCell.appendChild(editButton);
                editListButtonRow.appendChild(editListButtonCell);
                tbody.appendChild(editListButtonRow);
                editButton.classList.add('btn', 'btn-warning', 'text-dark', 'btn-link', 'mt-3');
          
                const deleteButtonRow = document.createElement('tr');
                const deleteButtonCell = document.createElement('td');
                const deleteButton = document.createElement('button');
                deleteButton.id = 'get-button-id';
                deleteButton.textContent = 'Excluir';
                deleteButton.addEventListener('click', () => {
                  localStorage.setItem('listId', list.id);
                  window.location.href = '/deleteList';
                });
                deleteButtonCell.appendChild(deleteButton);
                deleteButtonRow.appendChild(deleteButtonCell);
                tbody.appendChild(deleteButtonRow);
                deleteButton.classList.add('btn', 'btn-warning', 'text-dark', 'btn-link', 'mt-3');
          
                table.appendChild(tbody);
                listContainer.appendChild(table);
            };
    } catch (error) {
        console.error('Erro ao buscar revisões do usuário:', error);
    }
});
