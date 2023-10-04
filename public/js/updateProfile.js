document.addEventListener('DOMContentLoaded', async () => {
    const actualName = localStorage.getItem('ProfileName');
    const NameElement = document.getElementById('name');
    NameElement.value = actualName;

    const actualfamilyname = localStorage.getItem('familyname');
    const familynameElement = document.getElementById('familyName');
    familynameElement.value = actualfamilyname;

    const actualBio = localStorage.getItem('bio');
    const bioElement = document.getElementById('bio');
    bioElement.value = actualBio;

    const actualCity = localStorage.getItem('city');
    const cityElement = document.getElementById('city');
    cityElement.value = actualCity;

    const actualCountry = localStorage.getItem('country');
    const countryElement = document.getElementById('country');
    countryElement.value = actualCountry;

    const actualbirthday = localStorage.getItem('birthday');
    const birthdayElement = document.getElementById('birthday');
    
    const parts = actualbirthday.split('/');
    const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;

    birthdayElement.value = formattedDate;


    const actualsocialmediainstagram = localStorage.getItem('socialmediainstagram');
    const socialmediainstagramElement = document.getElementById('socialmediaInstagram');
    socialmediainstagramElement.value = actualsocialmediainstagram;

    const actualsocialmediatiktok = localStorage.getItem('socialmediatiktok');
    const socialmediatiktokElement = document.getElementById('socialmediaTikTok');
    socialmediatiktokElement.value = actualsocialmediatiktok;

    const actualsocialmediax = localStorage.getItem('socialmediax');
    const actualsocialmediaxElement = document.getElementById('socialmediax');
    actualsocialmediaxElement.value = actualsocialmediax;

    const actualuserprofile = localStorage.getItem('userprofile');
    const userprofileElement = document.getElementById('user');
    userprofileElement.value = actualuserprofile;
});

const updateProfileForm = document.getElementById('update-profile-form');
updateProfileForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const token = localStorage.getItem('token');

    const givenName = document.getElementById('name').value;
    const familyName = document.getElementById('familyName').value;
    const bio = document.getElementById('bio').value;
    const city = document.getElementById('city').value;
    const country = document.getElementById('country').value;
    const birthday = document.getElementById('birthday').value;
    const socialMediaX = document.getElementById('socialmediax').value;
    const socialmediaInstagram = document.getElementById('socialmediaInstagram').value;
    const socialMediaTikTok = document.getElementById('socialmediaTikTok').value;
    const userProfileTag = document.getElementById('user').value;

    const response = await fetch(`/api/user/profile`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            name: givenName,
            familyName,
            bio,
            city,
            country,
            birthday,
            socialMediaX,
            socialmediaInstagram,
            socialMediaTikTok,
            userProfileTag
        })
    });
    const data = await response.json();
    if (response.ok) {
        alert(`Perfil Atualizado com sucesso!`);
        window.location.href = '/profile';
    } else {
        alert(data.message);
    }
});
