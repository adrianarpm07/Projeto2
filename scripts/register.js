document.getElementById('register-form')?.addEventListener('submit', e => {
    e.preventDefault();
    const username = document.getElementById('username')?.value.trim();
    const email = document.getElementById('email')?.value.trim();
    const password = document.getElementById('password')?.value;
    const confirmPassword = document.getElementById('confirm-password')?.value;

    if (password !== confirmPassword) {
        alert('As palavras-passe não coincidem!');
        return;
    }

    console.log('Sending registration data:', { username, email, password });

    // Send to PHP to append to TXT
    fetch('scripts/register.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            username: username,
            email: email,
            password: password
        })
    })
    .then(response => {
        console.log('Response status:', response.status);
        return response.text();
    })
    .then(result => {
        console.log('PHP response:', result);
        if (result === 'success') {
            alert('Registo efetuado com sucesso! Faz login.');
            window.location.href = 'login.html';
        } else if (result === 'error: username exists') {
            alert('Nome de utilizador já existe!');
        } else if (result === 'error: email exists') {
            alert('Email já registado!');
        } else {
            alert('Erro no registo: ' + result);
        }
    })
    .catch(error => {
        console.error('Fetch error:', error);
        alert('Erro na ligação: ' + error.message);
    });
});