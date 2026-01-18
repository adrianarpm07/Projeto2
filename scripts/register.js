document.getElementById('register-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (password !== confirmPassword) return alert('As palavras-passe não coincidem!');

    try {
        const response = await fetch('files/users.txt', { cache: 'no-cache' });
        const lines = (await response.text()).trim().split(/\r?\n/);
        
        const fileUsers = lines.filter(l => l.trim()).map(line => {
            const [id, user, mail, pass, role] = line.split('|').map(v => v.trim());
            return { id: parseInt(id), username: user, email: mail, password: pass, role };
        });
        
        const localUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        const allUsers = [...fileUsers, ...localUsers];
        
        if (allUsers.some(u => u.username === username)) return alert('Nome de utilizador já existe!');
        if (allUsers.some(u => u.email === email)) return alert('Email já registado!');
        
        const maxId = Math.max(...allUsers.map(u => u.id), 0);
        localUsers.push({ id: maxId + 1, username, email, password, role: 'user' });
        
        localStorage.setItem('registeredUsers', JSON.stringify(localUsers));
        alert('Registo efetuado com sucesso! Faz login.');
        window.location.href = 'login.html';
        
    } catch (error) {
        alert('Erro no registo: ' + error.message);
    }
});