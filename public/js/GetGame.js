document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('#search-form');
    const input = document.querySelector('#search-input');
    const resultsList = document.querySelector('#results');
    const token = localStorage.getItem('token');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const query = input.value.trim();
        const rawgApiKey = 'f6b6af75757e4d299ec24dd49163f5af';
        const url = `https://api.rawg.io/api/games?key=${rawgApiKey}&search=${query}`;

        try {
            const response = await fetch(url);
            const data = await response.json();

            if (data.results && data.results.length > 0) {
                resultsList.innerHTML = '';
                data.results.forEach(game => {
                    const li = document.createElement('li');
                    li.classList.add('movie-li')
                    li.innerHTML = `${game.name}(${game.released})`;
                    li.addEventListener('click', async () => {
                        const detailsResponse = await fetch(`/api/game/id?id=${encodeURIComponent(game.id)}`, {
                            method: 'GET',
                            headers: {
                                'Authorization': `Bearer ${token}`
                            }
                        });
                        const detailsData = await detailsResponse.json();
                        const details = document.createElement('div');
                        details.innerHTML =
                            `
                        <ul class="list-unstyled">
                        
                            
                        </ul>

                        <div class="profile-container">
            <div class="row">
              <div class="col-md-4 text-center">
              <img class="img-poster img-fluid img-poster-hover" src="${detailsData.body.gameData.image}" alt="${detailsData.body.gameData.name} poster">


                <strong><button id="add-favorite-button" draggable="true" class="btn-unstyled"><i id="favorite-icon" class="far fa-heart"></i></button></strong>&emsp;
                <strong><button id="add-watchlist-button" draggable="true" class="btn-unstyled-clock"><i id="watchlist-icon" class="far fa-clock"></i></button></strong>
              </div>
             <div class="col-md-8">
             <div class="plot-container">
             <h3 class="movie-title">${detailsData.body.gameData.name}</h3>
         </div><br>
                <ul class="list-unstyled">
                <li><strong>Lançamento:</strong> ${detailsData.body.gameData.released}</li>
                <li><strong>Generos:</strong> ${detailsData.body.gameData.genres}</li>
                <li><strong>Nota:</strong> ${detailsData.body.gameData.rating}/5</li>
                <li><strong>Duração:</strong> ${detailsData.body.gameData.playtime} Horas</li>
                <li><strong>Plataformas:</strong> ${detailsData.body.gameData.platforms}</li>
                <li><strong>Site:</strong> ${detailsData.body.gameData.website}</li>  
                <li id="create-review-button" class="create-review-button">
                  <i class="fas fa-pencil-alt"></i> <strong>Criar uma review</strong>
                  </li>
                  </ul>
                <button id="get-review-button" class="btn btn-primary mt-3">Ver Reviews</button>
                <button id="get-list-button" class="btn btn-secondary mt-3">Ver Listas</button><br>
                <a class="text-dark" href="/">Voltar para a página inicial</a>
              </div>
            </div>
          </div>
                        `;
                        resultsList.innerHTML = '';
                        resultsList.appendChild(details);
                    });
                    resultsList.appendChild(li);
                });
            } else {
                resultsList.innerHTML = 'No results found.';
            }
        } catch (error) {
            console.log(error);
        }
    });
});