const token = localStorage.getItem('token');

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
        <strong>Nome:</strong> ${profileData.body.profile.name}<br>
        <strong>Sobrenome:</strong> ${profileData.body.profile.familyname}<br>
        <strong>Bio:</strong> ${profileData.body.profile.bio}<br>
        <a class="nav-link text-dark" href="/getAllLists">Lists: ${profileData.body.profile.contadorlists !== null ? profileData.body.profile.contadorlists : 0}</a>
        <a class="nav-link text-dark" href="/getAllReviews">Reviews: 
        ${profileData.body.profile.contadorreviews !== null ? profileData.body.profile.contadorreviews : 0}</a>
        `
        resultProfile.innerHTML = '';
        resultProfile.appendChild(details);


    } catch (error) {
        console.error('Erro:', error);
    }
});
