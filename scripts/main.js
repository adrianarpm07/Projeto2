let games = [];
let users = [];
let currentUser = null;

function updateUserUI() {
    const greeting = document.getElementById('user-greeting');
    const loginBtn = document.getElementById('login-btn');
    const usernameDisplay = document.getElementById('username-display');
    const adminLinks = document.querySelectorAll('#admin-link');

    if (currentUser) {
        greeting?.classList.remove('d-none');
        loginBtn?.classList.add('d-none');
        if (usernameDisplay) usernameDisplay.textContent = currentUser.username;
        if (currentUser.isAdmin) adminLinks.forEach(link => link.classList.remove('d-none'));
    } else {
        greeting?.classList.add('d-none');
        loginBtn?.classList.remove('d-none');
        adminLinks.forEach(link => link.classList.add('d-none'));
    }
}

function updateStarDisplay(gameId) {
    const rating = currentUser?.ratings?.[gameId] || 0;
    const container = document.querySelector(`.rating-container[data-game-id="${gameId}"]`);
    const textEl = document.querySelector(`.rating-text[data-game-id="${gameId}"]`);
    
    if (container) {
        const stars = container.querySelectorAll('.star');
        stars.forEach((star, index) => {
            if (index < rating) {
                star.classList.remove('empty');
                star.classList.add('full');
            } else {
                star.classList.add('empty');
                star.classList.remove('full');
            }
        });
    }
    
    if (textEl) {
        if (rating > 0) {
            textEl.textContent = `Sua avaliação: ${rating}⭐`;
        } else {
            textEl.textContent = 'Clique para avaliar';
        }
    }
}

function renderGames(filteredGames = games) {
    const grid = document.getElementById('games-grid');
    if (!grid) return;

    console.log('Rendering games, count:', filteredGames.length);

    if (filteredGames.length === 0) {
        grid.innerHTML = '<div class="col-12 text-center py-5"><p class="fs-4 text-white opacity-75">Nenhum jogo encontrado...</p></div>';
        return;
    }

    grid.innerHTML = filteredGames.map(game => {
        const isFavorite = currentUser?.favorites?.includes(game.id);
        return `
            <div class="col-md-6 col-lg-4">
                <div class="flip-card glass-card h-100" data-game-id="${game.id}">
                    <div class="flip-card-inner">
                        <div class="flip-card-front position-relative overflow-hidden">
                            <img src="${game.image}" class="w-100 h-100" alt="${game.title}" style="object-fit: cover;">
                            <div class="position-absolute bottom-0 start-0 end-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                                <h5 class="fw-bold mb-2" style="display: inline-block; background: rgba(0,0,0,0.8); padding: 0.5rem 1rem; border-radius: 0.5rem;">${game.title}</h5>
                                <div class="d-flex gap-2 flex-wrap">
                                    <span class="badge bg-dark text-primary">${game.genre}</span>
                                    <span class="badge bg-dark text-secondary">${game.year}</span>
                                </div>
                            </div>
                            ${currentUser ? `<button class="favorite-btn position-absolute top-0 end-0 m-3" data-game-id="${game.id}" style="background: transparent; border: none; padding: 0; cursor: pointer; font-size: 1.8rem; transition: all 0.3s ease; display: flex; align-items: center; justify-content: center; color: #ff4757; line-height: 1; outline: none;" title="Adicionar aos favoritos">${isFavorite ? '❤︎⁠' : '♡'}</button>` : ''}
                        </div>
                        <div class="flip-card-back d-flex flex-column p-4 text-center" style="overflow-y: auto; padding-top: 3rem !important; padding-bottom: 2rem !important;">
                            <h5 class="fw-bold mb-3 text-gradient">${game.title}</h5>
                            <p class="text-white opacity-85 mb-3" style="font-size: 0.9rem; line-height: 1.4;">${game.description}</p>
                            ${currentUser ? `
                            <div class="rating-container" data-game-id="${game.id}">
                                ${[1, 2, 3, 4, 5].map(i => `<span class="star empty" data-rating="${i}" style="user-select: none;">★</span>`).join('')}
                            </div>
                            <div class="rating-text" data-game-id="${game.id}">Clique para avaliar</div>
                            ` : '<p class="text-white-50" style="font-size: 0.9rem;">Faça login para avaliar</p>'}
                            <small class="opacity-60 mt-auto">Género: ${game.genre}<br>Ano: ${game.year}</small>
                        </div>
                    </div>
                </div>
            </div>`;
    }).join('');

    const countEl = document.getElementById('results-count');
    if (countEl) countEl.textContent = `${filteredGames.length} jogo${filteredGames.length !== 1 ? 's' : ''} encontrado${filteredGames.length !== 1 ? 's' : ''}`;
    
    // Update star displays for all games
    if (currentUser) {
        filteredGames.forEach(game => updateStarDisplay(game.id));
    }
}

function renderFavorites() {
    const grid = document.getElementById('favorites-grid');
    const empty = document.getElementById('empty-favorites');
    
    if (!grid) return;
    
    if (!currentUser || !currentUser.favorites || currentUser.favorites.length === 0) {
        if (empty) empty.classList.remove('d-none');
        grid.innerHTML = '';
        return;
    }

    if (empty) empty.classList.add('d-none');
    const favGames = games.filter(g => currentUser.favorites.includes(g.id));
    
    grid.innerHTML = favGames.map(game => `
        <div class="col-md-6 col-lg-4">
            <div class="glass-card h-100 position-relative">
                <img src="${game.image}" class="card-img-top" alt="${game.title}" style="height:200px; object-fit:cover;">
                <div class="p-3">
                    <h5 class="fw-bold">${game.title}</h5>
                    <p class="small opacity-75">${game.genre} • ${game.year}</p>
                    <button class="btn btn-sm btn-outline-danger w-100 mt-2 remove-fav-btn" data-game-id="${game.id}">
                        <i class="bi bi-heart-fill me-1"></i> Remover
                    </button>
                </div>
            </div>
        </div>`).join('');
}

document.addEventListener('DOMContentLoaded', async () => {
    games = await loadGamesFromTXT();
    users = await loadUsersFromTXT();
    
    const saved = sessionStorage.getItem('currentUser');
    if (saved) {
        currentUser = JSON.parse(saved);
        updateUserUI();
    }
    
    document.getElementById('logout-btn')?.addEventListener('click', () => {
        currentUser = null;
        sessionStorage.removeItem('currentUser');
        updateUserUI();
        renderGames();
        renderFavorites();
    });
    
    document.addEventListener('click', e => {
        const card = e.target.closest('.flip-card');
        if (card && !e.target.closest('.favorite-btn') && !e.target.closest('.star')) card.classList.toggle('flipped');
        
        // Handle star rating clicks
        if (e.target.closest('.star')) {
            const star = e.target.closest('.star');
            const container = star.closest('.rating-container');
            const gameId = parseInt(container.dataset.gameId);
            const rating = parseInt(star.dataset.rating);
            
            if (!currentUser.ratings) currentUser.ratings = {};
            currentUser.ratings[gameId] = rating;
            
            sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
            updateStarDisplay(gameId);
        }
        
        if (e.target.closest('.favorite-btn')) {
            if (!currentUser) return alert('Por favor, faça login para adicionar favoritos');
            
            const gameId = parseInt(e.target.closest('.favorite-btn').dataset.gameId);
            if (!currentUser.favorites) currentUser.favorites = [];
            
            const index = currentUser.favorites.indexOf(gameId);
            index > -1 ? currentUser.favorites.splice(index, 1) : currentUser.favorites.push(gameId);
            
            sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
            renderGames();
            renderFavorites();
        }
        
        if (e.target.closest('.remove-fav-btn')) {
            const gameId = parseInt(e.target.closest('.remove-fav-btn').dataset.gameId);
            const index = currentUser.favorites.indexOf(gameId);
            if (index > -1) {
                currentUser.favorites.splice(index, 1);
                sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
                renderFavorites();
                renderGames();
            }
        }
    });
    
    document.getElementById('search-input')?.addEventListener('input', e => {
        const term = e.target.value.toLowerCase();
        renderGames(games.filter(g => 
            g.title.toLowerCase().includes(term) || 
            g.genre.toLowerCase().includes(term) || 
            g.year.toLowerCase().includes(term) || 
            g.description.toLowerCase().includes(term)
        ));
    });

    renderGames();
    renderFavorites();
});