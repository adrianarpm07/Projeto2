// main.js

let games = loadData('games', initialGames);
let users = [];
let currentUser = null;

  // Atualiza interface do utilizador (login/logout/admin)
  function updateUserUI() {
    const greeting = document.getElementById('user-greeting');
    const loginBtn = document.getElementById('login-btn');
    const usernameDisplay = document.getElementById('username-display');
    const adminLinks = document.querySelectorAll('#admin-link');

    if (currentUser) {
        greeting?.classList.remove('d-none');
        loginBtn?.classList.add('d-none');
        if (usernameDisplay) usernameDisplay.textContent = currentUser.username;
        
        if (currentUser.isAdmin) {
            adminLinks.forEach(link => link.classList.remove('d-none'));
        }
    } else {
        greeting?.classList.add('d-none');
        loginBtn?.classList.remove('d-none');
        adminLinks.forEach(link => link.classList.add('d-none'));
    }
}

function closeLoginModal() {
    const modalEl = document.getElementById('loginModal');
    if (!modalEl) return;
    const modal = bootstrap.Modal.getInstance(modalEl);
    if (modal) modal.hide();
}

function renderGames(filteredGames = games) {
    const grid = document.getElementById('games-grid');
    if (!grid) return;

    grid.innerHTML = '';

    if (filteredGames.length === 0) {
        grid.innerHTML = `
            <div class="col-12 text-center py-5">
                <p class="fs-4 text-white opacity-75">Nenhum jogo encontrado...</p>
            </div>`;
        return;
    }

    filteredGames.forEach(game => {
        const isFavorite = currentUser?.favorites?.includes(game.id) || false;

        const cardHTML = `
            <div class="col-md-6 col-lg-4">
                <div class="flip-card glass-card h-100" data-game-id="${game.id}">
                    <div class="flip-card-inner">
                        <!-- Frente -->
                        <div class="flip-card-front position-relative overflow-hidden">
                            <img src="${game.image}" 
                                 class="w-100 h-100" 
                                 alt="${game.title}"
                                 style="object-fit: cover;">
                            <div class="position-absolute bottom-0 start-0 end-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                                <h5 class="fw-bold mb-1">${game.title}</h5>
                                <div class="d-flex gap-2 flex-wrap">
                                    <span class="badge bg-dark text-primary">${game.genre}</span>
                                    <span class="badge bg-dark text-secondary">${game.platform}</span>
                                </div>
                            </div>
                            
                            ${currentUser ? `
                                <button class="btn btn-sm ${isFavorite ? 'btn-danger' : 'btn-outline-danger'} favorite-btn position-absolute top-0 end-0 m-3"
                                        data-game-id="${game.id}">
                                    <i class="bi ${isFavorite ? 'bi-heart-fill' : 'bi-heart'}"></i>
                                </button>
                            ` : ''}
                        </div>
                        
                        <!-- Verso -->
                        <div class="flip-card-back d-flex flex-column justify-content-center p-4 text-center">
                            <h5 class="fw-bold mb-3 text-gradient">${game.title}</h5>
                            <p class="text-white opacity-85 mb-4">
                                ${game.description || 'Descrição em breve...'}
                            </p>
                            <small class="opacity-60">
                                Género: ${game.genre}<br>
                                Plataforma: ${game.platform}
                            </small>
                        </div>
                    </div>
                </div>
            </div>
        `;
        grid.innerHTML += cardHTML;
    });

    const countEl = document.getElementById('results-count');
    if (countEl) {
        countEl.textContent = `${filteredGames.length} jogo${filteredGames.length !== 1 ? 's' : ''} encontrado${filteredGames.length !== 1 ? 's' : ''}`;
    }
}

function renderFavorites() {
    const grid = document.getElementById('favorites-grid');
    const empty = document.getElementById('empty-favorites');
    
    if (!grid) return;
    if (!currentUser) {
        if (empty) empty.classList.remove('d-none');
        return;
    }

    const favGames = games.filter(g => currentUser.favorites.includes(g.id));
    
    grid.innerHTML = '';
    
    if (favGames.length === 0) {
        if (empty) empty.classList.remove('d-none');
        return;
    }

    if (empty) empty.classList.add('d-none');

    favGames.forEach(game => {
        grid.innerHTML += `
            <div class="col-md-6 col-lg-4">
                <div class="glass-card h-100 position-relative">
                    <img src="${game.image}" class="card-img-top" alt="${game.title}" style="height:200px; object-fit:cover;">
                    <div class="p-3">
                        <h5 class="fw-bold">${game.title}</h5>
                        <p class="small opacity-75">${game.genre} • ${game.platform}</p>
                        <button class="btn btn-sm btn-outline-danger w-100 mt-2 remove-fav-btn" 
                                data-game-id="${game.id}">
                            <i class="bi bi-heart-fill me-1"></i> Remover
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    users = loadData('users', await loadUsersFromCSV());
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
        if (card && !e.target.closest('.favorite-btn')) {
            card.classList.toggle('flipped');
        }
    });

    renderGames();
    renderFavorites();
});