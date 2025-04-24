'use client';

// Funções para gerar tarefas para os jogadores

// Gerar tarefas para todos os jogadores
export function generateTasks(players, rooms, gameConfig) {
  if (!players || !rooms || !gameConfig) return [];
  
  const tasks = [];
  const availablePlayers = [...players].filter(p => !p.votedOut);
  
  // Atribuir um cômodo para cada jogador
  rooms.forEach((room, index) => {
    if (index < availablePlayers.length) {
      const player = availablePlayers[index];
      
      // Criar tarefa para o jogador
      const task = generateTaskForPlayer(player, room, gameConfig);
      tasks.push(task);
      
      // Atualizar o responsável pelo cômodo
      room.responsible = player.name;
    }
  });
  
  // Gerar tarefa para a área comum
  const commonAreaTask = generateCommonAreaTask(gameConfig);
  tasks.push(commonAreaTask);
  
  return tasks;
}

// Gerar tarefa para um jogador específico
function generateTaskForPlayer(player, room, gameConfig) {
  const taskTypes = [
    'Organizar as cartas por cor',
    'Encontrar uma sequência numérica',
    'Reunir cartas do mesmo símbolo',
    'Separar cartas por tipo',
    'Encontrar combinações específicas'
  ];
  
  const randomTaskType = taskTypes[Math.floor(Math.random() * taskTypes.length)];
  
  return {
    id: `task_${player.name}_${room.id}`,
    type: randomTaskType,
    description: `${randomTaskType} no ${room.name}`,
    assignedTo: player.name,
    roomId: room.id,
    completed: false,
    difficulty: Math.floor(Math.random() * 3) + 1 // 1-3
  };
}

// Gerar tarefa para a área comum
function generateCommonAreaTask(gameConfig) {
  const commonTaskTypes = [
    'Organizar o monte principal',
    'Verificar as regras do jogo',
    'Preparar o próximo turno',
    'Contar as cartas restantes',
    'Verificar o estado do jogo'
  ];
  
  const randomTaskType = commonTaskTypes[Math.floor(Math.random() * commonTaskTypes.length)];
  
  return {
    id: 'task_common_area',
    type: randomTaskType,
    description: `${randomTaskType} na Área Comum`,
    assignedTo: 'todos',
    roomId: 'common_area',
    completed: false,
    difficulty: 2
  };
}

// Gerar cartas para os cômodos
export function generateCardsForRooms(rooms, gameConfig) {
  if (!rooms || !gameConfig) return [];
  
  const cardColors = ['vermelho', 'azul', 'verde', 'amarelo'];
  const cardSymbols = ['número', '+2', '+4', 'inverter', 'pular'];
  
  // Distribuir cartas para cada cômodo
  rooms.forEach(room => {
    const numCards = Math.floor(Math.random() * 5) + 5; // 5-10 cartas por cômodo
    const roomCards = [];
    
    for (let i = 0; i < numCards; i++) {
      const color = cardColors[Math.floor(Math.random() * cardColors.length)];
      const isNumberCard = Math.random() > 0.3; // 70% de chance de ser uma carta numérica
      
      let card;
      if (isNumberCard) {
        card = {
          id: `card_${room.id}_${i}`,
          color,
          symbol: 'número',
          number: Math.floor(Math.random() * 10),
          description: `${color} ${Math.floor(Math.random() * 10)}`
        };
      } else {
        const symbol = cardSymbols.filter(s => s !== 'número')[Math.floor(Math.random() * (cardSymbols.length - 1))];
        card = {
          id: `card_${room.id}_${i}`,
          color,
          symbol,
          number: null,
          description: `${color} ${symbol}`
        };
      }
      
      roomCards.push(card);
    }
    
    room.cards = roomCards;
  });
  
  return rooms;
}

// Gerar a carta que esconde a Coroa
export function generateCrownCard(gameConfig) {
  const cardColors = ['vermelho', 'azul', 'verde', 'amarelo'];
  const cardSymbols = ['número', '+2', '+4', 'inverter', 'pular'];
  
  const color = cardColors[Math.floor(Math.random() * cardColors.length)];
  const isNumberCard = Math.random() > 0.3; // 70% de chance de ser uma carta numérica
  
  let crownCard;
  if (isNumberCard) {
    crownCard = {
      id: 'crown_card',
      color,
      symbol: 'número',
      number: Math.floor(Math.random() * 10),
      description: `${color} ${Math.floor(Math.random() * 10)}`
    };
  } else {
    const symbol = cardSymbols.filter(s => s !== 'número')[Math.floor(Math.random() * (cardSymbols.length - 1))];
    crownCard = {
      id: 'crown_card',
      color,
      symbol,
      number: null,
      description: `${color} ${symbol}`
    };
  }
  
  return crownCard;
}


