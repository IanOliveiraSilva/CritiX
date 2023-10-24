let selectedCatInput;

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

    let categoryImages = {
        terror: [
            { id: "house-shape", url: "https://media.tenor.com/EiUrRlSeNbMAAAAC/i-burned-the-house-the-shape.gif" },
            { id: "jason-voorhees", url: "https://media.tenor.com/fPveH1pma68AAAAC/mask-jason-voorhees.gif" }
        ],
        animals: [
            { id: "animal-1", url: "https://i.pinimg.com/originals/16/24/b0/1624b0ab3834896b524eb732eeb19526.gif" },
            { id: "animal-2", url: "https://usagif.com/wp-content/uploads/gifs/monkey-55.gif" },
            { id: "animal-3", url: "https://media.tenor.com/u7n-mlPhhFAAAAAd/monkey-apple.gif" },
            { id: "animal-4", url: "https://media.tenor.com/XkhNfJx3jfsAAAAC/gato_maluco-gato_insano.gif" },
            { id: "animal-5", url: "https://media.tenor.com/mjCtsRA_AMgAAAAC/angry-cat-meme-cat.gif" },
            { id: "animal-6", url: "https://media.tenor.com/U282vYfv7xAAAAAd/gato-barril.gif" }
        ]
    };

    optionsDiv = document.getElementById("photo-options");
    selectedCatInput = document.getElementById("selectedCat");


    optionsDiv.addEventListener("click", function (event) {
        if (event.target.classList.contains('cat-image')) {
            let selectedImageId = event.target.id;
            selectedCatInput.value = selectedImageId;

            document.querySelectorAll('.cat-image').forEach(image => {
                image.style.border = 'none';
            });
            event.target.style.border = '3px solid red';
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
    const socialMediaX = document.getElementById('socialmediax').value;
    const socialmediaInstagram = document.getElementById('socialmediaInstagram').value;
    const socialMediaTikTok = document.getElementById('socialmediaTikTok').value;
    const userProfileTag = document.getElementById('user').value;

    const selectedImageSrc = document.getElementById(selectedCatInput.value).src;

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
            birthday,
            socialMediaX,
            socialmediaInstagram,
            socialMediaTikTok,
            userProfileTag,
            icon: selectedImageSrc
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