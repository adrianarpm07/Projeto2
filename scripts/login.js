document.getElementById('login-form')?.addEventListener('submit', e => {
    e.preventDefault();
    const username = document.getElementById('username')?.value.trim();
    const password = document.getElementById('password')?.value;

    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        currentUser = user;
        sessionStorage.setItem('currentUser', JSON.stringify(user));
        updateUserUI();
        closeLoginModal();
        renderGames();
        renderFavorites();
        // If on login page, redirect to index
        if (window.location.pathname.includes('login.html')) {
            window.location.href = 'index.html';
        }
    } else {
        alert('Credenciais inválidas!');
    }
});