// data.js

const initialUsers = [
  { id: 1, username: "admin", password: "admin123", isAdmin: true, favorites: [] },
  { id: 2, username: "jogador", password: "jogador123", isAdmin: false, favorites: [] }
];

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