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
                <p class="profile-bio">${profileData.body.profile.bio}</p>
                
                <div class="profile-info">
                <br>
                    
                    <ul class="list-group ">
                    <ul>

                    <li class="list-group-item li-profile">
                    <strong><i class="fas fa-map-marker-alt"></i> </strong> ${profileData.body.profile.country}, ${profileData.body.profile.city}
                    </li>
                    
                    <li class="list-group-item li-profile">
                    <strong><i class="fas fa-calendar-alt"></i></strong>  ${profileData.body.profile.birthday}
                    </li>

                    <li class="list-group-item li-profile">
                   <i class="fab fa-twitter"></i> <strong><a href="https://www.twitter.com/${profileData.body.profile.socialmediax}" target="_blank">${profileData.body.profile.socialmediax}</a></strong>
                    </li>

                    <li class="list-group-item li-profile">
                    <i class="fab fa-instagram"></i> <strong><a href="https://www.instagram.com/${profileData.body.profile.socialmediainstagram}" target="_blank">${profileData.body.profile.socialmediainstagram}</a></strong>
                    </li>

                    <li class="list-group-item li-profile">
                    <i class="fab fa-tiktok"></i> <strong><a href="https://www.tiktok.com/@${profileData.body.profile.socialmediatiktok}" target="_blank">${profileData.body.profile.socialmediatiktok}</a></strong>
                    </li><br>
                    </ul><hr>
                    
                    <ul id="filmes-favoritos"></ul><hr><br>

                    <a href="/getAllReviews" class="btn btn-primary text-warning btn-link profile-stat">
                    Reviews: 
                    <span class="stat-count">${profileData.body.profile.contadorreviews !== null ? profileData.body.profile.contadorreviews : 0}
                    </span>
                    </a>

                    <canvas id="myChart"></canvas><br>
                    

            </ul>
            <hr>
                    <div class="text-center">
                    <a href="/getAllLists" class="btn btn-primary text-warning btn-link profile-stat">Minhas listas: <span class="stat-count">${profileData.body.profile.contadorlists !== null ? profileData.body.profile.contadorlists : 0}</span></a><br><br>
                    <a href="/createList" class="btn btn-primary text-warning btn-link profile-stat"><span class="stat-count">Criar Lista</span></a>
                    <a href="/getWatchlist" class="btn btn-primary text-warning btn-link profile-stat">Watchlist<span class="stat-count"></span></a>
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
            localStorage.setItem('movieimbdId', movieData.body.movieData.imdbID);
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

    let ratings = {
      '5': 0,
      '4': 0,
      '3': 0,
      '2': 0,
      '1': 0
    };

    for (const rating of ratingData.rating) {
      ratings[rating.rating.toString()] = rating.count;
    }

    const starLabels = {
      '5': '★★★★★',
      '4': '★★★★☆',
      '3': '★★★☆☆',
      '2': '★★☆☆☆',
      '1': '★☆☆☆☆'
    };

    let chartData = {
      type: 'bar',
      data: {
        labels: Object.keys(ratings).map(rating => starLabels[rating]),
        datasets: [{
          label: 'REVIEWS',
          data: Object.values(ratings),
          backgroundColor: 'rgb(10, 25, 49)',
          borderColor: 'rgba(0, 0, 0, 0.8)',
          borderWidth: 1,
          hoverBackgroundColor: 'rgba(0, 0, 0, 0.9)',
          hoverBorderColor: 'rgb(0,0,0)'
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            display: false,
            grid: {
              display: false,
            },
            ticks: {
              callback: function (value, index, values) {
                return '';
              }
            }
          },
          x: {
            display: false,
            grid: {
              display: false,
            },
            barPercentage: .1,
            categoryPercentage: .1,
          },
          x2: {
            display: true,
            position: 'bottom',
            labels: Object.keys(ratings).map(rating => starLabels[rating]),
            grid: {
              display: false,
            },
            ticks: {
              autoSkip: false
            }
          }
        },
        plugins: {
          datalabels: {
            color: '#fff',
            align: 'end',
            formatter: function (value, context) {
              const index = context.dataIndex;
              const starCount = Object.keys(starLabels)[index];
              return starCount + ' (' + value + ')';
            }
          }
        },
        legend: {
          display: true,
        },
        animation: {
          duration: 1000,
          easing: 'easeOutBounce'
        },
        layout: {
          padding: {
            left: 10,
            right: 10,
            top: 10,
            bottom: 10
          }
        },
        tooltips: {
          enabled: false,
        },
        shadow: {
          enabled: true,
          color: 'rgba(0, 0, 0, 0.2)',
          blur: 10,
          offsetY: 5,
          offsetX: 5,
        }
      }
    };

    var ctx = document.getElementById('myChart');
    new Chart(ctx, chartData);

  } catch (error) {
    console.error('Erro:', error);
  }
});
