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
                <p class="profile-bio">${profileData.body.profile.bio}</p>
                
                <div class="profile-info">
                <br>
                    <ul class="list-group">
                    <li class="list-group-item"><p><strong>Email:</strong> srvesper@gmail.com</p></li>
                    <li class="list-group-item"><p><strong>Cidade:</strong> João Pessoa</p></li>
                    <li class="list-group-item"><p><strong>País:</strong> Brasil</p></li>
                    <li class="list-group-item"><p><strong>Data de Nascimento:</strong> 31/12/2003</p></li><br>
                    <p><strong>Filmes Favoritos:</strong></p>
                    <li class="list-group-item">Interstellar</li>
                    <li class="list-group-item">Elite Squad</li>
                    <li class="list-group-item">Halloween</li><br>

                    <p><strong>Watchlist:</strong></p>
                    <li class="list-group-item">The Nun II</li>
                    <li class="list-group-item">Five Night At Freddys</li>
                    <li class="list-group-item">Saw X</li>
                    <li class="list-group-item">Elemental</li>
                    <li class="list-group-item">Titanic</li>
                    <li class="list-group-item">Insidious</li><br>
            </ul>
                    <a href="/getAllLists" class="btn btn-dark text-warning btn-link profile-stat">Listas: <span class="stat-count">${profileData.body.profile.contadorlists !== null ? profileData.body.profile.contadorlists : 0}</span></a><br>
                    <a href="/getAllReviews" class="btn btn-dark text-warning btn-link mt-3 profile-stat">Avaliações: <span class="stat-count">${profileData.body.profile.contadorreviews !== null ? profileData.body.profile.contadorreviews : 0}</span></a>
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
