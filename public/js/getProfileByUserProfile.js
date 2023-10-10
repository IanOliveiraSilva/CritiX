const token = localStorage.getItem('token')

document.addEventListener('DOMContentLoaded', async () => {
    const resultContainer = document.querySelector('#results');
    const form = document.querySelector('#search-form');
    const input = document.querySelector('#search-input');

    form.addEventListener('submit', async (event) => {
        const query = input.value.trim();
        event.preventDefault();
        try {
            const detailsResponse = await fetch(`/api/profile/userProfile?userProfile=${encodeURIComponent(query)}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const detailsData = await detailsResponse.json();
            const resultProfile = document.createElement('div');
            resultProfile.innerHTML = `
            <div class="profile-container">
            <div class="profile-details">
            <br>
            <img class="profile-image" src="../uploads/icon-1696055357956.jpeg" alt="Ícone do perfil do usuário"/>
                <h1 class="profile-name">${detailsData.body.profile.givenname} ${detailsData.body.profile.familyname}</h1> 
                <p class="profile-bio">@${detailsData.body.profile.userprofile}</p>
                
                <div class="profile-info">
                <br>
                <p><strong>Informações gerais:</strong></p><br>
                    
                <ul class="list-group">
                <ul>
                <li class="list-group-item li-profile">
                <strong><i class="fas fa-pencil-alt"></i> </strong>${detailsData.body.profile.bio}
                </li>

                <li class="list-group-item li-profile">
                <strong><i class="fas fa-map-marker-alt"></i> </strong>${detailsData.body.profile.country}, ${detailsData.body.profile.city}
                </li>
                
                <li class="list-group-item li-profile">
                <strong><i class="fas fa-calendar-alt"></i></strong> ${detailsData.body.profile.birthday}
                </li><br>
                </ul>

                <p><strong>Redes Sociais:</strong></p><br>
                <ul>
                <li class="list-group-item li-profile">
               <i class="fab fa-twitter"></i> <strong><a href="https://www.twitter.com/${detailsData.body.profile.socialmediax}">${detailsData.body.profile.socialmediax}</a></strong>
                </li>

                <li class="list-group-item li-profile">
                <i class="fab fa-instagram"></i> <strong><a href="https://www.instagram.com/${detailsData.body.profile.socialmediainstagram}">${detailsData.body.profile.socialmediainstagram}</a></strong>
                </li>

                <li class="list-group-item li-profile">
                <i class="fab fa-tiktok"></i> <strong><a href="https://www.tiktok.com/@${detailsData.body.profile.socialmediatiktok}">${detailsData.body.profile.socialmediatiktok}</a></strong>
                </li><br>
                </ul>

                    <p><strong>Filmes Favoritos:</strong></p><br>
                    <ul id="filmes-favoritos"></ul><br>
            </ul>
            <div class="text-center">
                    <a href="/getAllUserLists" id="list-link" class="btn btn-primary text-warning btn-link profile-stat">Listas: <span class="stat-count">
                    ${detailsData.body.profile.contadorlists !== null ? detailsData.body.profile.contadorlists : 0}
                    </span>
                    </a>

                    <a href="/getAllUserReviews" id="review-link" class="btn btn-primary text-warning btn-link profile-stat">Avaliações: <span class="stat-count">
                    ${detailsData.body.profile.contadorreviews !== null ? detailsData.body.profile.contadorreviews : 0}
                    </span>

                    </a><br><br>
                    <a id="get-user-watchlist" href="/getUserWatchlist" class="btn btn-primary text-warning btn-link profile-stat">Watchlist<span class="stat-count"></span></a>
                    </div>
            </div>
                </div>
            </div>
            `;

            resultContainer.addEventListener('click', (event) => {
                if (event.target.id === 'list-link') {
                    if (detailsData.body.profile.userprofile) {
                        localStorage.setItem('userprofile', detailsData.body.profile.userprofile);
                    }
                }
                else if (event.target.id === 'review-link') {
                    if (detailsData.body.profile.userprofile) {
                        localStorage.setItem('userprofile', detailsData.body.profile.userprofile);
                    }
                }
            });
            resultContainer.innerHTML = '';
            resultContainer.appendChild(resultProfile);

            // mostrar filmes favoritos
            const filmsContainer = document.createElement('div');
            filmsContainer.classList.add('films-container');
            for (const movieTitle of detailsData.body.profile.movies) {
                try {
                    const movieResponse = await fetch(`/api/movie/title?title=${encodeURIComponent(movieTitle)}`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (movieResponse.ok) {
                        const movieData = await movieResponse.json();

                        const movieContainer = document.createElement('div');
                        movieContainer.classList.add('movie-container');

                        const movieLink = document.createElement('a');
                        movieLink.href = '/getMovieByTitle';

                        const posterImage = document.createElement('img');
                        posterImage.src = movieData.body.movieData.Poster;
                        posterImage.alt = 'Poster do Filme';
                        posterImage.classList.add('movie-poster');

                        movieLink.addEventListener('click', function () {
                            localStorage.setItem('movieTitle', movieTitle);
                        });

                        movieLink.appendChild(posterImage);
                        movieContainer.appendChild(movieLink);
                        filmsContainer.appendChild(movieContainer);
                    } else {
                        console.error('Erro ao obter detalhes do filme:', movieResponse.statusText);
                    }
                } catch (error) {
                    console.error('Erro ao buscar detalhes do filme:', error);
                }
            }
            const favoritesSection = document.querySelector('#filmes-favoritos');
            favoritesSection.appendChild(filmsContainer);

            // mostrar watchlist
            const watchlistSection = document.querySelector('#get-user-watchlist');
            watchlistSection.addEventListener('click', (event) => {
                localStorage.setItem('userprofile', detailsData.body.profile.userprofile);
            });





        } catch (error) {
            console.log(error);
        }
    });
});
