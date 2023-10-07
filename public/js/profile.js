const token = localStorage.getItem('token')

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
                    
                    <ul class="list-group">
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
                   <i class="fab fa-twitter"></i> <strong><a href="https://www.twitter.com/${profileData.body.profile.socialmediax}">${profileData.body.profile.socialmediax}</a></strong>
                    </li>

                    <li class="list-group-item li-profile">
                    <i class="fab fa-instagram"></i> <strong><a href="https://www.instagram.com/${profileData.body.profile.socialmediainstagram}">${profileData.body.profile.socialmediainstagram}</a></strong>
                    </li>

                    <li class="list-group-item li-profile">
                    <i class="fab fa-tiktok"></i> <strong><a href="https://www.tiktok.com/${profileData.body.profile.socialmediatiktok}">${profileData.body.profile.socialmediatiktok}</a></strong>
                    </li><br>
                    </ul>
                    
                    <p><strong>Filmes Favoritos:</strong></p><br>
                    <ul id="list-group"></ul><br>
            </ul>
    
                    <a href="/createList" class="btn btn-primary text-warning btn-link profile-stat"><span class="stat-count">Criar Lista</span></a>
                    <a href="/getAllLists" class="btn btn-primary text-warning btn-link profile-stat">Minhas listas: <span class="stat-count">${profileData.body.profile.contadorlists !== null ? profileData.body.profile.contadorlists : 0}</span></a><br><br>
                    <a href="/getAllReviews" class="btn btn-primary text-warning btn-link profile-stat">Minhas avaliações: <span class="stat-count">${profileData.body.profile.contadorreviews !== null ? profileData.body.profile.contadorreviews : 0}</span></a><br><br>
                    <a href="/getWatchlist" class="btn btn-primary text-warning btn-link profile-stat">Watchlist<span class="stat-count"></span></a>
            </div>
                </div>
                
            </div>
            <br>
            <a href="/" class="btn btn-primary text-warning btn-link profile-stat">Página Inicial</a>
        `

        resultProfile.innerHTML = '';
        resultProfile.appendChild(details);

        const listGroup = document.getElementById('list-group');
        if (profileData.body.profile.movies && profileData.body.profile.movies.length > 0) {
            const moviesList = profileData.body.profile.movies;
            const ulElement = document.createElement('ul');
            ulElement.className = 'list-group';
            moviesList.forEach(movie => {
                const liElement = document.createElement('li');
                liElement.className = 'list-group-item li-profile';
        
                const iconElement = document.createElement('i');
                iconElement.className = 'fas fa-video'; 
                liElement.appendChild(iconElement);
        
                const movieTitleElement = document.createElement('span');
                movieTitleElement.textContent = ' ' + movie;
                liElement.appendChild(movieTitleElement);
        
                ulElement.appendChild(liElement);
            });
            listGroup.appendChild(ulElement);
        } else {
            const noMoviesItem = document.createElement('li');
            noMoviesItem.className = 'list-group-item li-profile';
            noMoviesItem.textContent = 'Nenhum filme favorito encontrado.';
            listGroup.appendChild(noMoviesItem);
        }
        
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
    } catch (error) {
        console.error('Erro:', error);
    }
});
