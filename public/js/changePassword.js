const loginForm = document.getElementById('login-form');
loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const token = localStorage.getItem('token');
    const password = document.getElementById('password').value;

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
