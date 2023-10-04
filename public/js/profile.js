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
                    <p><strong><i class="fas fa-pencil-alt"></i> </strong>${profileData.body.profile.bio}
                    </p>
                    </li>

                    <li class="list-group-item li-profile">
                    <p><strong><i class="fas fa-map-marker-alt"></i> </strong>${profileData.body.profile.country}, ${profileData.body.profile.city}
                    </p>
                    </li>
                    
                    <li class="list-group-item li-profile">
                    <p><strong><i class="fas fa-calendar-alt"></i></strong> ${profileData.body.profile.birthday}
                    </p>
                    </li><br>
                    </ul>

                    <p><strong>Redes Sociais:</strong></p><br>
                    <ul>
                    <li class="list-group-item li-profile">
                        <i class="fab fa-twitter"></i> <a href="https://www.twitter.com/${profileData.body.profile.socialmediax}">${profileData.body.profile.socialmediax}</a>
                    </li>

                    <li class="list-group-item li-profile">
                        <i class="fab fa-instagram"></i> <a href="https://www.instagram.com/${profileData.body.profile.socialmediainstagram}">${profileData.body.profile.socialmediainstagram}</a>
                    </li>

                    <li class="list-group-item li-profile">
                        <i class="fab fa-tiktok"></i> <a href="https://www.tiktok.com/${profileData.body.profile.socialmediatiktok}">${profileData.body.profile.socialmediatiktok}</a>
                    </li><br>
                    </ul>

                    <p><strong>Filmes Favoritos:</strong></p><br>
                    <ul id="list-group"><li class="list-group-item li-profile">
                        ${profileData.body.profile.movies}
                    </li><br></ul>
            </ul>
            
                    <a href="/createList" class="btn btn-primary text-warning btn-link profile-stat"><span class="stat-count">Criar Lista</span></a>
                
                    <a href="/getAllLists" class="btn btn-primary text-warning btn-link profile-stat">Minhas listas: <span class="stat-count">${profileData.body.profile.contadorlists !== null ? profileData.body.profile.contadorlists : 0}</span></a><br><br>
                    <a href="/getAllReviews" class="btn btn-primary text-warning btn-link profile-stat">Minhas avaliações: <span class="stat-count">${profileData.body.profile.contadorreviews !== null ? profileData.body.profile.contadorreviews : 0}</span></a>
            </div>
                </div>
                
            </div>
            <br>
            <a href="/" class="btn btn-primary text-warning btn-link profile-stat">Página Inicial</a>
        `

        resultProfile.addEventListener('click', (event) => {
            if (event.target.id === 'list-group') {
                if (detailsData.body.profile.movies) {
                    profileData.body.profile.movies.forEach(movie => {
                        const liElement = document.createElement('li');
                        liElement.className = 'list-group-item li-profile';
                        liElement.textContent = movie;
                        ulElement.appendChild(liElement);
                    });

                }
            }
        });

        const editProfileLink = document.querySelector('#edit-profile-link');

        console.log(editProfileLink);

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

        resultProfile.innerHTML = '';
        resultProfile.appendChild(details);


    } catch (error) {
        console.error('Erro:', error);
    }
});
