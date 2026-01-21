// Carregar jogos do ficheiro de texto com mapa de imagens
async function loadGamesFromTXT() {
  const imageMap = {
    'Minecraft': 'images/Minecraft.jpg',
    'Higurashi When They Cry': 'images/Higurashi.jpg',
    'The Witcher 3: Wild Hunt': 'images/TheWitcher.jpg',
    'Stardew Valley': 'images/Stardew.jpg',
    'Steins;Gate': 'images/SteinsGate.jpg',
    'Grand Theft Auto V': 'images/GTA.jpg',
    'Celeste': 'images/Celeste.png',
    'VA-11 Hall-A': 'images/VA11HallA.jpg',
    'Dark Souls': 'images/DarkSouls.jpg',
    'Clannad': 'images/Clannad.jpg',
    'Terraria': 'images/Terraria.jpg',
    'The House in Fata Morgana': 'images/TheHouseinFataMorgana.jpg',
    'Red Dead Redemption 2': 'images/RedDeadRedemption 2.jpg',
    'Undertale': 'images/Undertale.jpg',
    'Ace Attorney: Phoenix Wright': 'images/AceAttorney.jpg',
    'Hollow Knight': 'images/HollowKnight.jpg',
    'Doki Doki Literature Club': 'images/DokiDoki.jpg',
    'Portal 2': 'images/Portal2.jpg',
    'Saya no Uta': 'images/SayaNoUta.jpg',
    'Super Mario Odyssey': 'images/SuperMarioOdyssey.jpg',
    'Tsukihime': 'images/Tsukihime.jpg',
    'God of War': 'images/GodOFWar.jpg',
    'Hookah Haze': 'images/HookahHaze.jpg',
    'FIFA 23': 'images/Fifa23.jpg',
    'Chaos;Head': 'images/ChaosHead.jpg',
    'The Legend of Zelda: Breath of the Wild': 'images/ZELDA.jpg',
    'Umineko When They Cry': 'images/Unimeko.jpg',
    'Umamusume: Pretty Derby': 'images/Umamusume.jpg'
  };
  
  
  try {
    // Buscar e processar ficheiro de jogos
    const response = await fetch('files/jogos.txt', { cache: 'no-cache' });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    const lines = (await response.text()).trim().split(/\r?\n/);
    const games = lines.filter(l => l.trim()).map((line, i) => {
      const [title = 'Sem título', genre = 'Desconhecido', year = 'N/A', description = 'Descrição em breve...'] = line.split('|').map(v => v.trim());
      return {
        id: i + 1,
        title,
        genre,
        year,
        description,
        image: imageMap[title] || 'images/rocket.jpg'
      };
    });
    console.log(`${games.length} jogos carregados`);
    return games;
  } catch (error) {
    console.error('Erro ao carregar jogos:', error);
    return [];
  }
}

// Carregar utilizadores do ficheiro de texto
async function loadUsersFromTXT() {
  try {
    // Buscar ficheiro de utilizadores
    const response = await fetch('files/users.txt', { cache: 'no-cache' });
    const lines = (await response.text()).trim().split(/\r?\n/);
    const users = lines.filter(l => l.trim()).map(line => {
      const parts = line.split('|').map(v => v.trim());
      const [id, username, email, password, role, ratingsStr] = parts;
      const ratings = {};

      if (ratingsStr) {
        try {
          ratingsStr.split(',').forEach(pair => {
            const [gameId, score] = pair.split(':');
            if (gameId && score) {
              ratings[parseInt(gameId)] = parseInt(score);
            }
          });
        } catch (e) {
          console.log('Erro ao processar avaliações:', e);
        }
      }
      
      return { 
        id: parseInt(id), 
        username, 
        email, 
        password, 
        isAdmin: role === 'admin', 
        favorites: [],
        ratings: ratings
      };
    });
    console.log(`${users.length} utilizadores carregados`);
    return users;
  } catch (error) {
    console.error('Erro ao carregar utilizadores:', error);
    return [];
  }
}
