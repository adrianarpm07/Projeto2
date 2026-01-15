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

    if (users.find(u => u.username === username)) {
        alert('Nome de utilizador já existe!');
        return;
    }

    if (users.find(u => u.email === email)) {
        alert('Email já registado!');
        return;
    }

    const maxId = users.length > 0 ? Math.max(...users.map(u => u.id)) : 0;
    const newUser = { id: maxId + 1, username, email, password, isAdmin: false, favorites: [] };
    users.push(newUser);
    saveData('users', users);
    alert('Registo efetuado com sucesso! Faz login.');
    window.location.href = 'login.html';
});