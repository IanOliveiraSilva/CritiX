const loginForm = document.getElementById('login-form');
loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const email_or_username = document.getElementById('email_or_username').value;
    const password = document.getElementById('password').value;
    const response = await fetch('/api/user/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email_or_username, password })
    });
    const data = await response.json();
    if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('icon', data.user.icon)
        localStorage.setItem('username', data.user.username);
        window.location.href = '/';
    } else {
        alert(data.message);
    }
});
