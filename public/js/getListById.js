document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');

  const listContainer = document.getElementById('lists');
  const titleContainer = document.getElementById('pageTitle')
  const movieContainer = document.createElement('div');

  const username = localStorage.getItem('username');

  const id = localStorage.getItem('listId');

  try {
    // Requests
    const listResponse = await fetch(`/api/listById/?id=${encodeURIComponent(id)}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const listsData = await listResponse.json();

    // Title
    const listName = document.createElement('p');
    listName.textContent = listsData[0].list_name;
    listName.classList.add('title', 'uppercase-text');

    const hr = document.createElement('hr');

    // Body
    const movieCount = document.createElement('p');
    movieCount.textContent = 'Filmes: ' + listsData[0].movies_count;
    movieCount.classList.add('title', 'uppercase-text');

    const randomMovieButton = document.createElement('a');

    titleContainer.appendChild(listName);
    titleContainer.appendChild(hr);
    titleContainer.appendChild(movieCount);

    if (listsData && listsData[0] && listsData[0].moviesid && listsData[0].moviesid.length > 0) {
      const movieIndex = listsData[0].moviesid;
      const randomIndex = Math.floor(Math.random() * movieIndex.length);
      const randomMovie = movieIndex[randomIndex];
    }

    for (const list of listsData) {
      if (list.moviesid && list.moviesid.length > 0) {
        for (let i = 0; i < list.moviesid.length; i++) {
          const movieResponse = await fetch(`/api/movie/id?imdbID=${encodeURIComponent(list.moviesid[i])}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          const movieData = await movieResponse.json();

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
          movieContainer.appendChild(movieLink);
          listContainer.appendChild(movieContainer);

          randomMovieButton.innerHTML = '<i class="fa-solid fa-dice" style="color: #000000; font-size:30px"></i>';
          randomMovieButton.href = '/getMovieByTitle'
          randomMovieButton.addEventListener('click', function (event) {
            event.preventDefault();
            localStorage.setItem('movieimbdId', randomMovie);
            window.location.href = randomMovieButton.href;
          });
        }
      } else if (list.movie_titles) {
        const moviesCell = document.createElement('p');
        moviesCell.textContent = `${list.movie_titles}`;
        listContainer.appendChild(moviesCell);

      } else {
        const noMoviesCell = document.createElement('p');
        noMoviesCell.textContent = 'Esta lista não possui filmes.';
        listContainer.appendChild(noMoviesCell);
      }

      titleContainer.appendChild(randomMovieButton);

      const listName = list.list_name;
      const buttonContainer = document.getElementById('button');
      
      if(username == listsData[0].user){
        if (listName !== 'Watchlist' && listName !== 'Meus filmes favoritos') {
          const editButton = document.createElement('a');
          editButton.textContent = 'Editar';
          editButton.href = '/updateList';
          editButton.addEventListener('click', () => {
            localStorage.setItem('listId', list.id);
            localStorage.setItem('name', list.list_name);
            localStorage.setItem('description', list.list_description);
          });
          editButton.classList.add('btn', 'btn-primary', 'text-warning', 'btn-link', 'profile-stat');
  
          const deleteButton = document.createElement('a');
          deleteButton.textContent = 'Apagar';
          deleteButton.href = '/deleteList';
          deleteButton.addEventListener('click', () => {
            localStorage.setItem('listId', list.id);
          });
          deleteButton.classList.add('btn', 'btn-primary', 'text-warning', 'btn-link', 'profile-stat');
  
          buttonContainer.appendChild(editButton);
          buttonContainer.insertAdjacentHTML('beforeend', '&emsp;');
          buttonContainer.appendChild(deleteButton);
        }
      }
    };
  } catch (error) {
    console.error('Erro ao buscar revisões do usuário:', error);
  }
});
