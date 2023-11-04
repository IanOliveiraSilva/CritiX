const loginForm = document.getElementById('login-form');
loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const token = localStorage.getItem('token');
    const password = document.getElementById('password').value;
    const password1 = document.getElementById('password1').value;

    if (password != password1) {
        alert('As senhas devem coincidir!');
        return;
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{7,})/;

    if (!passwordRegex.test(password)) {
        alert('A senha deve ter pelo menos 7 caracteres, incluindo pelo menos uma letra maiúscula e um símbolo.');
        return;
    }

    const response = await fetch('/api/user/changePassword', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            newPassword: password
        })
    });
    const data = await response.json();
    if (response.ok) {
        window.location.href = '/profile';
    } else {
        alert(data.message);
    }
});
