document.getElementById('login-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('files/users.txt', { cache: 'no-cache' });
        const lines = (await response.text()).trim().split(/\r?\n/);
        
        let foundUser = lines.filter(l => l.trim()).map(line => {
            const parts = line.split('|').map(v => v.trim());
            const [id, user, email, pass, role, ratingsStr] = parts;
            const ratings = {};
            
            // Parse ratings
            if (ratingsStr) {
                try {
                    ratingsStr.split(',').forEach(pair => {
                        const [gameId, score] = pair.split(':');
                        if (gameId && score) {
                            ratings[parseInt(gameId)] = parseInt(score);
                        }
                    });
                } catch (e) {
                    console.log('Error parsing ratings:', e);
                }
            }
            
            return { 
                id: parseInt(id), 
                username: user, 
                email, 
                password: pass, 
                isAdmin: role === 'admin', 
                favorites: [],
                ratings: ratings
            };
        }).find(u => u.username === username && u.password === password);
        
        if (!foundUser) {
            const localUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
            foundUser = localUsers.find(u => u.username === username && u.password === password);
            if (foundUser) {
                foundUser = { 
                    ...foundUser, 
                    isAdmin: foundUser.role === 'admin', 
                    favorites: [],
                    ratings: foundUser.ratings || {}
                };
            }
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