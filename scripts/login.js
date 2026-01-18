document.getElementById('login-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('files/users.txt', { cache: 'no-cache' });
        const lines = (await response.text()).trim().split(/\r?\n/);
        
        let foundUser = lines.filter(l => l.trim()).map(line => {
            const [id, user, email, pass, role] = line.split('|').map(v => v.trim());
            return { id: parseInt(id), username: user, email, password: pass, isAdmin: role === 'admin', favorites: [] };
        }).find(u => u.username === username && u.password === password);
        
        if (!foundUser) {
            const localUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
            foundUser = localUsers.find(u => u.username === username && u.password === password);
            if (foundUser) foundUser = { ...foundUser, isAdmin: foundUser.role === 'admin', favorites: [] };
        }
        
        if (foundUser) {
            sessionStorage.setItem('currentUser', JSON.stringify(foundUser));
            window.location.href = 'index.html';
        } else {
            alert('Credenciais inválidas!');
        }
    } catch (error) {
        alert('Erro ao fazer login: ' + error.message);
    }
});