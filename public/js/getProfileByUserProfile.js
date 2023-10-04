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
                <p><strong><i class="fas fa-pencil-alt"></i> </strong>${detailsData.body.profile.bio}
                </p>
                </li>

                <li class="list-group-item li-profile">
                <p><strong><i class="fas fa-map-marker-alt"></i> </strong>${detailsData.body.profile.country}, ${detailsData.body.profile.city}
                </p>
                </li>
                
                <li class="list-group-item li-profile">
                <p><strong><i class="fas fa-calendar-alt"></i></strong> ${detailsData.body.profile.birthday}
                </p>
                </li><br>
                </ul>

                    <p><strong>Redes Sociais:</strong></p><br>
                    <ul>
                    <li class="list-group-item li-profile">
                        <i class="fab fa-twitter"></i> <a href="https://www.twitter.com/${detailsData.body.profile.socialmediax}">${detailsData.body.profile.socialmediax}</a>
                    </li>

                    <li class="list-group-item li-profile">
                        <i class="fab fa-instagram"></i> <a href="https://www.instagram.com/${detailsData.body.profile.socialmediainstagram}">${detailsData.body.profile.socialmediainstagram}</a>
                    </li>

                    <li class="list-group-item li-profile">
                        <i class="fab fa-tiktok"></i> <a href="https://www.tiktok.com/${detailsData.body.profile.socialmediatiktok}">${detailsData.body.profile.socialmediatiktok}</a>
                    </li><br>
                    </ul>

                    <p><strong>Filmes Favoritos:</strong></p><br>
                    <ul id="list-group"><li class="list-group-item li-profile">
                        ${detailsData.body.profile.movies}
                    </li><br></ul>
            </ul>
                    <a href="/getAllUserLists" id="list-link" class="btn btn-primary text-warning btn-link profile-stat">Listas: <span class="stat-count">
                    ${detailsData.body.profile.contadorlists !== null ? detailsData.body.profile.contadorlists : 0}
                    </span>
                    </a><br><br>

                    <a href="/getAllUserReviews" id="review-link" class="btn btn-primary text-warning btn-link profile-stat">Avaliações: <span class="stat-count">
                    ${detailsData.body.profile.contadorreviews !== null ? detailsData.body.profile.contadorreviews : 0}
                    </span>
                    </a>
            </div>
                </div>
            </div>
            <a href="/" class="btn btn-warning text-dark btn-link mt-3">Página Inicial</a>
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
            console.log(detailsData.body.profile.name);
        } catch (error) {
            console.log(error);
        }
    });
});
