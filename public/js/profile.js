const token = localStorage.getItem('token')

function generateStarRating(rating) {
  const maxRating = 5;
  const roundedRating = Math.round(rating * 2) / 2;
  const fullStars = Math.floor(roundedRating);
  const halfStar = roundedRating % 1 !== 0;
  const emptyStars = maxRating - fullStars - (halfStar ? 1 : 0);

  let stars = '';
  for (let i = 0; i < fullStars; i++) {
    stars += '<i class="fas fa-star star-rating"></i>';
  }
  if (halfStar) {
    stars += '<i class="fas fa-star-half-alt star-rating"></i>';
  }
  for (let i = 0; i < emptyStars; i++) {
    stars += '<i class="far fa-star star-rating"></i>';
  }

  return stars;
}

document.addEventListener('DOMContentLoaded', async () => {
  const resultProfile = document.querySelector('#results');

  try {
    const response = await fetch('api/user/profile', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Erro ao obter perfil');
    }

    const profileData = await response.json();

    const details = document.createElement('div');
    details.innerHTML =
      `
            <div class="profile-container">
            <div class="profile-details">
            <img class="profile-image" src="../uploads/icon-1696055357956.jpeg" alt="Ícone do perfil do usuário"/>
                <h1 class="profile-name">${profileData.body.profile.givenname} ${profileData.body.profile.familyname}</h1> 
                <p class="profile-bio">@${profileData.body.profile.userprofile}</p>
                
                <div class="profile-info">
                <br>
                    <p><strong>Informações gerais:</strong></p><br>
                    
                    <ul class="list-group ">
                    <ul>
                    <li class="list-group-item li-profile">
                    <strong><i class="fas fa-pencil-alt"></i> </strong>${profileData.body.profile.bio}
                    
                    </li>

                    <li class="list-group-item li-profile">
                    <strong><i class="fas fa-map-marker-alt"></i> </strong>${profileData.body.profile.country}, ${profileData.body.profile.city}
                    </li>
                    
                    <li class="list-group-item li-profile">
                    <strong><i class="fas fa-calendar-alt"></i></strong> ${profileData.body.profile.birthday}
                    </li><br>
                    </ul>

                    <p><strong>Redes Sociais:</strong></p><br>
                    <ul>
                    <li class="list-group-item li-profile">
                   <i class="fab fa-twitter"></i> <strong><a href="https://www.twitter.com/${profileData.body.profile.socialmediax}" target="_blank">${profileData.body.profile.socialmediax}</a></strong>
                    </li>

                    <li class="list-group-item li-profile">
                    <i class="fab fa-instagram"></i> <strong><a href="https://www.instagram.com/${profileData.body.profile.socialmediainstagram}" target="_blank">${profileData.body.profile.socialmediainstagram}</a></strong>
                    </li>

                    <li class="list-group-item li-profile">
                    <i class="fab fa-tiktok"></i> <strong><a href="https://www.tiktok.com/@${profileData.body.profile.socialmediatiktok}" target="_blank">${profileData.body.profile.socialmediatiktok}</a></strong>
                    </li><br>
                    </ul>
                    
                    <p><strong>Filmes Favoritos:</strong></p><br>
                    <ul id="filmes-favoritos"></ul><br>
            </ul>
                    <div class="text-center">
                    <a href="/getAllReviews" class="btn btn-primary text-warning btn-link profile-stat">Minhas avaliações: <span class="stat-count">${profileData.body.profile.contadorreviews !== null ? profileData.body.profile.contadorreviews : 0}</span></a>
                    <a href="/getAllLists" class="btn btn-primary text-warning btn-link profile-stat">Minhas listas: <span class="stat-count">${profileData.body.profile.contadorlists !== null ? profileData.body.profile.contadorlists : 0}</span></a><br><br>
                    <a href="/createList" class="btn btn-primary text-warning btn-link profile-stat"><span class="stat-count">Criar Lista</span></a>
                    <a href="/getWatchlist" class="btn btn-primary text-warning btn-link profile-stat">Watchlist<span class="stat-count"></span></a>
                    <p id="rating-count"> Rating </p>
                    </div>
   
            </div>
                </div>
                
            </div>
        `
    resultProfile.innerHTML = '';
    resultProfile.appendChild(details);

    // mostrar filmes favoritos
    const filmsContainer = document.createElement('div');
    filmsContainer.classList.add('films-container');
    for (const movieTitle of profileData.body.profile.movies) {
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

    // editar perfil
    const editProfileLink = document.querySelector('#edit-profile-link');
    editProfileLink.addEventListener('click', () => {
      localStorage.setItem('ProfileName', profileData.body.profile.givenname);
      localStorage.setItem('familyname', profileData.body.profile.familyname);
      localStorage.setItem('bio', profileData.body.profile.bio);
      localStorage.setItem('city', profileData.body.profile.city);
      localStorage.setItem('country', profileData.body.profile.country);
      localStorage.setItem('socialmediainstagram', profileData.body.profile.socialmediainstagram);
      localStorage.setItem('socialmediatiktok', profileData.body.profile.socialmediatiktok);
      localStorage.setItem('socialmediax', profileData.body.profile.socialmediax);
      localStorage.setItem('birthday', profileData.body.profile.birthday);
      localStorage.setItem('userprofile', profileData.body.profile.userprofile);
    });

    // Rating count
    const ratingCountResponse = await fetch('api/user/rating', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const ratingData = await ratingCountResponse.json();
    const ratingCount = document.querySelector('#rating-count');

    for (const rating of ratingData.rating) {
      const ratingTeste = document.createElement('p');
      ratingTeste.classList.add('profile-stat');

      const starRating = generateStarRating(rating.rating);
      ratingTeste.innerHTML = 
      `
      ${rating.count} ${starRating}  
      `;

      ratingCount.appendChild(ratingTeste);
    }



  } catch (error) {
    console.error('Erro:', error);
  }
});
