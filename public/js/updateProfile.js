
let selectedCatInput;
let selectedImageSrc;

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

    const actualLocation = localStorage.getItem('location');
    const locationElement = document.getElementById('location');
    locationElement.value = actualLocation;

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



    let categoryImages = {
        horror: [
            { id: "house-shape", url: "https://media.tenor.com/EiUrRlSeNbMAAAAC/i-burned-the-house-the-shape.gif" },
            { id: "jason-voorhees", url: "https://media.tenor.com/fPveH1pma68AAAAC/mask-jason-voorhees.gif" },
            { id: "freedy-krueger", url: "https://media.tenor.com/OhUAe3M2dDkAAAAC/a-nightmare-on-elm-street-freddy-krueger.gif" },
            { id: "leatherface", url: "https://media4.giphy.com/media/3o7aTuy3b4TwuUSUzm/giphy.gif" },
            { id: "ghostface", url: "https://media.tenor.com/hUZWT9W6VScAAAAC/ghostface-scream-mask.gif" },
            { id: "pinhead", url: "https://64.media.tumblr.com/d69664c7f87d6e3fcaff9edcf9729d5e/794467b0f1c74cb0-72/s540x810/1a3b5b27f9e831226834d40f8b4d5e3d2cabbad1.gif" }

        ],
        animals: [
            { id: "animal-1", url: "https://i.pinimg.com/originals/16/24/b0/1624b0ab3834896b524eb732eeb19526.gif" },
            { id: "animal-2", url: "https://usagif.com/wp-content/uploads/gifs/monkey-55.gif" },
            { id: "animal-3", url: "https://media.tenor.com/u7n-mlPhhFAAAAAd/monkey-apple.gif" },
            { id: "animal-4", url: "https://media.tenor.com/XkhNfJx3jfsAAAAC/gato_maluco-gato_insano.gif" },
            { id: "animal-5", url: "https://media.tenor.com/mjCtsRA_AMgAAAAC/angry-cat-meme-cat.gif" },
            { id: "animal-6", url: "https://media.tenor.com/U282vYfv7xAAAAAd/gato-barril.gif" }
        ],
        action: [
            { id: "john-mcclane", url: "https://64.media.tumblr.com/3f6f046a387d0c3e9f1cfde8b0b8b1c5/2c4bdc0d5222d559-35/s540x810/2cd3244d77297565e9df778c39af9b0456f2e057.gif" },
            { id: "john-wick", url: "https://media.tenor.com/BJlqapqu8vQAAAAC/head-nod-john-wick.gif" },
            { id: "james-bond", url: "https://i.gifer.com/Nssn.gif" },
            { id: "Beatrix-Kiddo", url: "https://filmtheoryfilmtheory.files.wordpress.com/2018/07/kill-bill.gif" },
            { id: "rambo", url: "https://i.pinimg.com/originals/1d/5b/9a/1d5b9a6490a6057ea7fa8c5b3674ecab.gif" },
            { id: "Bryan-Mills ", url: "https://i.pinimg.com/originals/b2/c4/2a/b2c42ae93afd163dfe7acf89b2b7ca92.gif" }
        ],
        animation: [
            { id: "minino", url: "https://66.media.tumblr.com/3e335b79d4b093816c9d06d15b814ec4/eff627a093b61045-84/s500x750/26dea3e9fd698738a5ed8d8dbc44c53a0e7010d6.gif" },
            { id: "miguel", url: "https://stories.recreio.com.br/curiosidades-sobre-viva-a-vida-e-uma-festa/assets/8.gif" },
            { id: "chihiro", url: "https://i.pinimg.com/originals/66/9a/03/669a032ddac1220a579f60399b716918.gif" },
            { id: "timao-pumba", url: "https://media.tenor.com/wTexepHXUmQAAAAC/timon-pumba.gif" },
            { id: "shrek", url: "https://media.tenor.com/k7QJGt6WChYAAAAd/emmanuel-jdz.gif" },
            { id: "raiva ", url: "https://i.pinimg.com/originals/6f/b1/de/6fb1de1c21c26b087fa255a5ad125e13.gif" }
        ]
    };

    optionsDiv = document.getElementById("photo-options");
    selectedCatInput = document.getElementById("selectedCat");

    const actualIcon = localStorage.getItem('icon');
    selectedCatInput.src = actualIcon;
    selectedCatInput.value = actualIcon;
    selectedImageSrc = actualIcon;


    optionsDiv.addEventListener("click", function (event) {
        if (event.target.classList.contains('cat-image')) {
            let selectedImageId = event.target.id;
            selectedCatInput.value = selectedImageId;

            document.querySelectorAll('.cat-image').forEach(image => {
                image.style.border = 'none';
            });
            event.target.style.border = '3px solid red';

            selectedImageSrc = event.target.src;
        }
    });

    let categorySelect = document.getElementById("category");

    categorySelect.addEventListener("change", function () {
        let selectedCategory = categorySelect.value;
        let categoryImagesData = categoryImages[selectedCategory];

        optionsDiv.innerHTML = "";

        categoryImagesData.forEach(function (imageData) {
            let imgElement = document.createElement("img");
            imgElement.setAttribute("src", imageData.url);
            imgElement.setAttribute("alt", "Imagem da categoria " + selectedCategory);
            imgElement.classList.add('cat-image', 'cat-option');
            imgElement.id = imageData.id;
            optionsDiv.appendChild(imgElement);
        });
    })
});



const updateProfileForm = document.getElementById('update-profile-form');
updateProfileForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const token = localStorage.getItem('token');

    const givenName = document.getElementById('name').value;
    const familyName = document.getElementById('familyName').value;
    const bio = document.getElementById('bio').value;
    const birthday = document.getElementById('birthday').value;
    const location = document.getElementById('location').value;
    const socialMediaX = document.getElementById('socialmediax').value;
    const socialmediaInstagram = document.getElementById('socialmediaInstagram').value;
    const socialMediaTikTok = document.getElementById('socialmediaTikTok').value;



    const isValidDate = isValidDateOfBirth(birthday);

    if (!isValidDate) {
        alert('Por favor, insira uma data de nascimento válida.');
        return;
    }

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
            location,
            birthday,
            socialMediaX,
            socialmediaInstagram,
            socialMediaTikTok,
            icon: selectedImageSrc
        })
    });
    const data = await response.json();
    if (response.ok) {
        localStorage.setItem('icon', selectedImageSrc);
        window.location.href = '/profile';
    } else {
        alert(data.message);
    }
});

function isValidDateOfBirth(dateString) {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateString)) return false;

    const parts = dateString.split("-");
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    const currentDate = new Date();
    const inputDate = new Date(year, month, day);

    return inputDate.getFullYear() === year && inputDate.getMonth() === month && inputDate.getDate() === day && inputDate < currentDate;
}