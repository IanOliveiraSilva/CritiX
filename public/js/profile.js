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
            <div class="ul-profile">
            <div class="dropdown">
            <i class="fas fa-gear" id="gear-icon"></i>
            <div class="dropdown-content" id="dropdown-options">
            <a href="/changePassword">Trocar senha</a>
            </div>
            </div>
           
            <a href="/updateProfile" id="edit-profile-link"><br><br>
            <i class="fas fa-pencil-alt" style="font-size: 30px;"></i>
            </a>
                <h1 class="profile-name">${profileData.body.profile.givenname} ${profileData.body.profile.familyname}</h1> 
                <p class="profile-user">@${profileData.body.profile.userprofile}</p>
                <p class="profile-bio">${profileData.body.profile.bio}</p>
                
                </div>
                <div class="profile-info">
                <br>
                       
                <li id="showMoreBtn" class="list-group-item li-profile uppercase-text">
                <i class="fas fa-eye"></i> <span>Ver Mais</span>
            </li>
                <ul class="list-group ul-profile">

              <div id="additionalInfo" style="display: none;">

                    <li class="list-group-item li-profile">
                    <strong><i class="fas fa-calendar-alt"></i></strong>  ${profileData.body.profile.birthday}
                    </li>

                    <li class="list-group-item li-profile uppercase-text">
                    <strong><i class="fas fa-map-marker-alt"></i> </strong> ${profileData.body.profile.location}
                    </li>

                    <li class="list-group-item li-profile ">
                    <i class="fab fa-twitter"></i> <strong>
                    <a href="https://www.twitter.com/${profileData.body.profile.socialmediax}" target="_blank">
                    ${profileData.body.profile.socialmediax !== null && profileData.body.profile.socialmediax !== "null" && profileData.body.profile.socialmediax !== "" ? profileData.body.profile.socialmediax : '___'} 
                    </a>
                    </strong>
                     </li>
     
                    <li class="list-group-item li-profile">
                    <i class="fab fa-instagram"></i> <strong>
                    <a href="https://www.instagram.com/${profileData.body.profile.socialmediainstagram}" target="_blank">
                    ${profileData.body.profile.socialmediainstagram !== null && profileData.body.profile.socialmediax !== "null" && profileData.body.profile.socialmediax !== "" ? profileData.body.profile.socialmediainstagram : '___'}
                    </a>
                    </strong>
                    </li>
    
                    <li class="list-group-item li-profile">
                    <i class="fab fa-tiktok"></i> <strong>
                    <a href="https://www.tiktok.com/@${profileData.body.profile.socialmediatiktok}" target="_blank">
                    ${profileData.body.profile.socialmediatiktok !== null && profileData.body.profile.socialmediax !== "null" && profileData.body.profile.socialmediax !== "" ? profileData.body.profile.socialmediatiktok : '___'}
                    </a>
                    </strong>
                    </li><br>
              </div>
              
              </ul> <hr>
                    <ul id="filmes-favoritos">
                    </ul><hr><br>

                    <a href="/getAllReviews" class="btn btn-primary text-warning btn-link profile-stat">
                    Reviews:
                    <span class="stat-count">${profileData.body.profile.contadorreviews !== null ? profileData.body.profile.contadorreviews : 0}
                    </span>
                    </a>
                    <canvas id="myChart"></canvas><br>
                    </ul>
            <hr class="hr-bottom">
                    <div class="text-center">
                    
                    <a href="/getAllLists" class="btn btn-primary text-warning btn-link profile-stat"><i class="fas fa-list-ul"></i> <span class="stat-count">${profileData.body.profile.contadorlists !== null ? profileData.body.profile.contadorlists : 0}</span></a>
                    <a href="/getWatchlist" class="btn btn-primary text-warning btn-link profile-stat"><i class="fa-solid fa-clock"></i> <span class="stat-count">${profileData.body.watchlistCount.movies_count !== null ? profileData.body.watchlistCount.movies_count : 0}</span></a><br><br>
                    <a href="/createList" class="btn btn-primary text-warning btn-link profile-stat"><span class="stat-count">Criar Lista</span></a>
                    <a href="/" class="back-link d-block mt-4 text-center">
                    <i class="fa-solid fa-house" style="color: #000000; font-size: 30px;"></i> 
                    
                    </div>
            </div>
                </div>
            </div>
        `
    resultProfile.innerHTML = '';
    resultProfile.appendChild(details);

      let isHidden = true;

      const showMoreBtn = document.getElementById("showMoreBtn");
      const additionalInfo = document.getElementById("additionalInfo");

      showMoreBtn.addEventListener("click", () => {
        isHidden = !isHidden;
        additionalInfo.style.display = isHidden ? "none" : "block";

        additionalInfo.classList.toggle("show");
        showMoreBtn.innerHTML = `${isHidden ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>'} <span>${isHidden ? 'Ver Mais' : 'Ver Menos'}</span>`;

      });

    // mostrar filmes favoritos
    const filmsContainer = document.createElement('div');
    filmsContainer.classList.add('films-container');

    for (const movieTitle of profileData.body.profile.moviesid) {
      try {
        const movieResponse = await fetch(`/api/movie/id?imdbID=${encodeURIComponent(movieTitle)}`, {
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
      localStorage.setItem('location', profileData.body.profile.location);
      localStorage.setItem('socialmediainstagram', profileData.body.profile.socialmediainstagram);
      localStorage.setItem('socialmediatiktok', profileData.body.profile.socialmediatiktok);
      localStorage.setItem('socialmediax', profileData.body.profile.socialmediax);
      localStorage.setItem('birthday', profileData.body.profile.birthday);
      localStorage.setItem('userprofile', profileData.body.profile.userprofile);
      localStorage.setItem('icon', profileData.body.profile.icon);
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

    var gearIcon = document.getElementById("gear-icon");
    var dropdownOptions = document.getElementById("dropdown-options");

    gearIcon.addEventListener("click", function () {
      if (dropdownOptions.style.display === "none" || dropdownOptions.style.display === "") {
        dropdownOptions.style.display = "block";
      } else {
        dropdownOptions.style.display = "none";
      }
    });

    window.addEventListener("click", function (event) {
      if (!event.target.matches("#gear-icon")) {
        dropdownOptions.style.display = "none";
      }
    });


  } catch (error) {
    console.error('Erro:', error);
  }
});
