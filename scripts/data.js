// data.js

function parseCSVLine(line) {
  // Split only on the first 3 commas (4 fields total)
  const parts = [];
  let remaining = line;
  
  // Get first 3 fields
  for (let i = 0; i < 3; i++) {
    const commaIndex = remaining.indexOf(',');
    if (commaIndex === -1) break;
    parts.push(remaining.substring(0, commaIndex).trim());
    remaining = remaining.substring(commaIndex + 1);
  }
  
  // Everything remaining is the description (4th field)
  if (remaining) {
    parts.push(remaining.trim());
  }
  
  return parts;
}

async function loadGamesFromCSV() {
  console.log('Starting to load games from CSV...');
  
  // Image mapping for each game
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
    const response = await fetch('files/jogos.csv', { cache: 'no-cache' });
    console.log('Fetch response status:', response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const csvText = await response.text();
    console.log('CSV text loaded, length:', csvText.length);
    console.log('First 200 chars:', csvText.substring(0, 200));
    
    // Handle different line endings
    const lines = csvText.trim().split(/\r?\n/);
    console.log('Number of lines:', lines.length);
    
    const games = [];
    
    // Skip header row (index 0)
    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue; // Skip empty lines
      
      const values = parseCSVLine(lines[i]);
      console.log(`Line ${i}:`, values);
      
      const gameName = values[0] || 'Sem título';
      const game = {
        id: i,
        title: gameName,
        genre: values[1] || 'Desconhecido',
        year: values[2] || 'N/A',
        description: values[3] || 'Descrição em breve...',
        image: imageMap[gameName] || 'images/rocket.jpg'
      };
      games.push(game);
    }
    
    console.log('Successfully loaded games:', games.length);
    if (games.length > 0) {
      console.log('First game:', games[0]);
      console.log('Last game:', games[games.length - 1]);
    }
    return games;
  } catch (error) {
    console.error('Error loading games from CSV:', error);
    console.log('Using fallback games');
    // Fallback to default games
    return [
      {
        id: 1,
        title: "Counter-Strike",
        genre: "FPS, Competitivo",
        year: "1999",
        image: "images/rocket.jpg",
        description: "Clássico shooter tático online."
      },
      {
        id: 2,
        title: "Rocket League",
        genre: "Desportivo, Carros",
        year: "2015",
        image: "images/rocket.jpg",
        description: "Futebol futurista com carros!"
      }
    ];
  }
}

async function loadUsersFromTXT() {
  try {
    const response = await fetch('files/users.txt', { cache: 'no-cache' });
    const txtText = await response.text();
    const lines = txtText.trim().split('\n');
    const headers = lines[0].split(',');
    const users = [];
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',');
      const user = {};
      headers.forEach((header, index) => {
        user[header.trim()] = values[index].trim();
      });
      // Adapt to our format
      users.push({
        id: parseInt(user.id),
        username: user.nome,
        email: user.email,
        password: user.password,
        isAdmin: user.role === 'admin',
        favorites: []
      });
    }
    return users;
  } catch (error) {
    console.error('Error loading users from TXT:', error);
    // Fallback to default
    return [
      { id: 1, username: "admin", password: "admin123", isAdmin: true, favorites: [] },
      { id: 2, username: "jogador", password: "jogador123", isAdmin: false, favorites: [] }
    ];
  }
}

const initialGames = [
  {
    id: 1,
    title: "Counter-Strike",
    genre: "FPS, Competitivo",
    platform: "PC",
    image: "images/cs.jpg",
    description: "Clássico shooter tático online onde equipas de Terroristas e Contra-Terroristas competem em objetivos como plantar/desarmar bombas. Foco em estratégia, precisão e trabalho de equipa."
  },
  {
    id: 2,
    title: "Rocket League",
    genre: "Desportivo, Carros",
    platform: "PC, Consolas",
    image: "images/rocket.jpg",
    description: "Futebol futurista e caótico com carros movidos a foguete! Usa o teu carro para marcar golos, fazer manobras aéreas e criar jogadas épicas em partidas rápidas e viciantes."
  },
  // adicionar mais jogos aqui
];

function loadData(key, defaultValue) {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : defaultValue;
}

function saveData(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}