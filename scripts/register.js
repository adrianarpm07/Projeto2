document.getElementById('register-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username')?.value.trim();
    const email = document.getElementById('email')?.value.trim();
    const password = document.getElementById('password')?.value;
    const confirmPassword = document.getElementById('confirm-password')?.value;

    if (password !== confirmPassword) {
        alert('As palavras-passe não coincidem!');
        return;
    }

    console.log('Registering user:', { username, email });

    try {
        // Load existing users
        const response = await fetch('files/users.txt', { cache: 'no-cache' });
        const txtText = await response.text();
        const lines = txtText.trim().split(/\r?\n/);
        
        let maxId = 0;
        const existingUsers = [];
        
        for (let i = 0; i < lines.length; i++) {
            if (!lines[i].trim()) continue;
            
            const values = lines[i].split('|').map(v => v.trim());
            const userId = parseInt(values[0]);
            const userName = values[1];
            const userEmail = values[2];
            
            if (userId > maxId) maxId = userId;
            
            // Check if username or email already exists
            if (userName === username) {
                alert('Nome de utilizador já existe!');
                return;
            }
            if (userEmail === email) {
                alert('Email já registado!');
                return;
            }
            
            existingUsers.push(lines[i]);
        }
        
        // Create new user
        const newId = maxId + 1;
        const newLine = `${newId}|${username}|${email}|${password}|user`;
        existingUsers.push(newLine);
        
        // Save back to file (Note: This won't work in browser without server-side)
        // Since we're removing PHP, we'll use localStorage as an alternative
        localStorage.setItem('pendingUsers', JSON.stringify(existingUsers));
        
        alert('Registo efetuado com sucesso! Faz login.\n\nNota: Para persistir dados, é necessário um servidor. Os dados estão em localStorage.');
        window.location.href = 'login.html';
        
    } catch (error) {
        console.error('Registration error:', error);
        alert('Erro no registo: ' + error.message);
    }
});