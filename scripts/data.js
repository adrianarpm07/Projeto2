// data.js

async function loadUsersFromCSV() {
  try {
    const response = await fetch('files/users.csv');
    const csvText = await response.text();
    const lines = csvText.trim().split('\n');
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
    console.error('Error loading users from CSV:', error);
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