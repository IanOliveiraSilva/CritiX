const registerForm = document.getElementById('register-form');
registerForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const familyName = document.getElementById('familyName').value;
    const bio = document.getElementById('bio').value;
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    const response = await fetch('api/user/profile', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name, familyName, bio })
    });
    const data = await response.json();
    console.log(response);
    if (response.ok) {
        alert(`Usuário ${username} criado com sucesso!`);
        window.location.href = '/';
    } else {
        alert(data.message);
    }
});