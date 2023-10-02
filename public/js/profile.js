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
                <h1 class="profile-name">${profileData.body.profile.name} ${profileData.body.profile.familyname}</h1> 
                <p class="profile-bio">@${profileData.body.profile.userprofile}</p>
                
                <div class="profile-info">
                <br>
                    <ul class="list-group">
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

                    <p><strong>Redes Sociais:</strong></p><br>

                    <li class="list-group-item li-profile">
                        <i class="fab fa-twitter"></i> <a href="https://www.twitter.com/${profileData.body.profile.socialmediax}">${profileData.body.profile.socialmediax}</a>
                    </li>

                    <li class="list-group-item li-profile">
                        <i class="fab fa-instagram"></i> <a href="https://www.instagram.com/${profileData.body.profile.socialmediainstagram}">${profileData.body.profile.socialmediainstagram}</a>
                    </li>

                    <li class="list-group-item li-profile">
                        <i class="fab fa-tiktok"></i> <a href="https://www.tiktok.com/${profileData.body.profile.socialmediatiktok}">${profileData.body.profile.socialmediatiktok}</a>
                    </li><br>

                    <p><strong>Filmes Favoritos:</strong></p>
                    <li class="list-group-item li-profile">Interstellar</li>
                    <li class="list-group-item li-profile">Elite Squad</li>
                    <li class="list-group-item li-profile">Halloween</li><br>

                    <p><strong>Watchlist:</strong></p>
                    <li class="list-group-item li-profile">The Nun II</li>
                    <li class="list-group-item li-profile">Five Night At Freddys</li>
                    <li class="list-group-item li-profile">Saw X</li>
                    <li class="list-group-item li-profile">Elemental</li>
                    <li class="list-group-item li-profile">Titanic</li>
                    <li class="list-group-item li-profile">Insidious</li><br>
            </ul>
                    <a href="/createList" class="btn btn-primary text-warning btn-link profile-stat"><span class="stat-count">Criar Lista</span></a>
                    <a href="/getAllLists" class="btn btn-primary text-warning btn-link profile-stat">Minhas listas: <span class="stat-count">${profileData.body.profile.contadorlists !== null ? profileData.body.profile.contadorlists : 0}</span></a><br><br>
                    <a href="/getAllReviews" class="btn btn-primary text-warning btn-link profile-stat">Minhas avaliações: <span class="stat-count">${profileData.body.profile.contadorreviews !== null ? profileData.body.profile.contadorreviews : 0}</span></a>
            </div>
                </div>
            </div>
            <a href="/" class="btn btn-warning text-dark btn-link mt-3">Página Inicial</a>
        `

        resultProfile.innerHTML = '';
        resultProfile.appendChild(details);


    } catch (error) {
        console.error('Erro:', error);
    }
});
