document.addEventListener("DOMContentLoaded", function () {
  fetch("http://api.geonames.org/countryInfoJSON?formatted=true&username=testandoparacritix")
    .then(response => response.json())
    .then(data => {
      const countrySelect = document.getElementById("country");
      data.geonames.forEach(country => {
        const option = document.createElement("option");
        option.value = country.countryCode;
        option.textContent = country.countryName;
        countrySelect.appendChild(option);
      });
    });

  document.getElementById("country").addEventListener("change", function () {
    const selectedCountry = this.value;
    const citySelect = document.getElementById("city");
    citySelect.innerHTML = "<option value='' disabled selected>Selecione uma cidade</option>";

    fetch(`http://api.geonames.org/searchJSON?formatted=true&country=${selectedCountry}&username=testandoparacritix`)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        data.geonames.forEach(city => {
          const option = document.createElement("option");
          option.value = city.name;
          option.textContent = city.name;
          citySelect.appendChild(option);
        });
      });
  });
});

const catImages = document.querySelectorAll('.cat-image');
const selectedCatInput = document.getElementById('selectedCat');

catImages.forEach(catImage => {
  catImage.addEventListener('click', function () {
    selectedCatInput.value = this.id;
    catImages.forEach(image => {
      image.style.border = 'none';
    });
    this.style.border = '3px solid black';
  });
});


const registerForm = document.getElementById('register-form');
registerForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const name = document.getElementById('name').value;
  const familyName = document.getElementById('familyName').value;
  const bio = document.getElementById('bio').value;
  const city = document.getElementById('city').value;
  const country = document.getElementById('country').value;
  const birthday = document.getElementById('birthday').value;
  const socialMediaX = document.getElementById('socialmediax').value;
  const socialmediaInstagram = document.getElementById('socialmediaInstagram').value;
  const socialMediaTikTok = document.getElementById('socialmediaTikTok').value;
  const userProfileTag = document.getElementById('user').value;
  const selectedCatUrl = document.getElementById(selectedCatInput.value).src;

  const isValidDate = isValidDateOfBirth(birthday);

  if (!isValidDate) {
    alert('Por favor, insira uma data de nascimento válida.');
    return;
  }

  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username');
  const response = await fetch('api/user/profile', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ name, familyName, bio, city, country, birthday, socialMediaX, socialmediaInstagram, socialMediaTikTok, userProfileTag, icon: selectedCatUrl })
  });
  const data = await response.json();
  console.log(response);
  if (response.ok) {
    alert(`Usuário ${username} criado com sucesso!`);

    const watchlistResponse = await fetch('api/list', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        name: 'Watchlist',
        description: 'Lista de filmes para assistir',
        movieTitles: [],
        isPublic: true,
      })
    });

    const favoriteMovieResponse = await fetch('/api/list', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        name: 'Meus filmes favoritos',
        description: 'Os melhores!',
        movieTitles: [],
        isPublic: true,
      }),
    });

    if (watchlistResponse.ok && favoriteMovieResponse.ok) {
      window.location.href = '/profile';
    }
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
