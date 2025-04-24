'use client';

// Funções para gerenciar a lógica do jogo

// Verificar se o jogador completou sua tarefa
export function checkTaskCompletion(player, tasks, rooms) {
  if (!player || !tasks || !rooms) return false;
  
  // Encontrar a tarefa do jogador
  const playerTask = tasks.find(task => task.assignedTo === player.name);
  if (!playerTask) return false;
  
  // Verificar se a tarefa está marcada como concluída
  return playerTask.completed;
}

// Verificar se todas as tarefas foram concluídas
export function checkAllTasksCompleted(tasks) {
  if (!tasks || tasks.length === 0) return false;
  
  return tasks.every(task => task.completed);
}

// Calcular o resultado da votação
export function calculateVotingResult(votes, players, tasks) {
  if (!votes || !players || !tasks) return null;
  
  // Contar os votos para cada jogador
  const voteCounts = {};
  let totalValidVotes = 0;
  
  // Inicializar contagem de votos
  players.forEach(player => {
    voteCounts[player.name] = 0;
  });
  
  // Contar apenas os votos de jogadores que completaram suas tarefas
  Object.entries(votes).forEach(([voter, votedFor]) => {
    const voterPlayer = players.find(p => p.name === voter);
    if (voterPlayer) {
      const voterTask = tasks.find(t => t.assignedTo === voter);
      if (voterTask && voterTask.completed) {
        voteCounts[votedFor] = (voteCounts[votedFor] || 0) + 1;
        totalValidVotes++;
      }
    }
  });
  
  // Encontrar o jogador mais votado
  let mostVotedPlayer = null;
  let maxVotes = 0;
  let isTie = false;
  
  Object.entries(voteCounts).forEach(([player, count]) => {
    if (count > maxVotes) {
      mostVotedPlayer = player;
      maxVotes = count;
      isTie = false;
    } else if (count === maxVotes && count > 0) {
      isTie = true;
    }
  });
  
  // Se houver empate, ninguém é eliminado
  if (isTie) {
    mostVotedPlayer = null;
  }
  
  return {
    mostVotedPlayer,
    isTie,
    voteCounts,
    totalValidVotes
  };
}

// Verificar se o jogo terminou
export function checkGameEnd(players, impostors) {
  if (!players || !impostors) return null;
  
  const activePlayers = players.filter(p => !p.votedOut);
  const activeImpostors = activePlayers.filter(p => impostors.includes(p.name));
  const activeLoyal = activePlayers.filter(p => !impostors.includes(p.name));
  
  // Impostores vencem se forem maioria ou igual
  if (activeImpostors.length >= activeLoyal.length) {
    return {
      gameOver: true,
      winners: 'impostors'
    };
  }
  
  // Leais vencem se todos os impostores forem eliminados
  if (activeImpostors.length === 0) {
    return {
      gameOver: true,
      winners: 'loyal'
    };
  }
  
  // Jogo continua
  return {
    gameOver: false,
    winners: null
  };
}

// Gerar dica sobre a carta da coroa
export function generateCrownHint(crownCard, round) {
  if (!crownCard) return '';
  
  const hints = [
    // Dicas sobre a cor
    `A Inteligência aponta que a Coroa está em uma carta de cor ${crownCard.color}.`,
    `A Inteligência informa que a carta da Coroa não é de cor ${getRandomColorExcept(crownCard.color)}.`,
    
    // Dicas sobre o número
    `A Inteligência recebeu um reporte de que a Coroa está em uma carta ${crownCard.number > 5 ? 'maior' : 'menor'} que 5.`,
    `A Inteligência suspeita que a Coroa está em uma carta com número ${crownCard.number % 2 === 0 ? 'par' : 'ímpar'}.`,
    
    // Dicas sobre o símbolo
    `A Inteligência confirma que a Coroa está em uma carta de símbolo ${crownCard.symbol}.`,
    `A Inteligência descarta a possibilidade da Coroa estar em uma carta de símbolo ${getRandomSymbolExcept(crownCard.symbol)}.`
  ];
  
  // Quanto mais avançado o jogo, mais específicas as dicas
  if (round > 3) {
    hints.push(`A Inteligência está certa de que a Coroa está em uma carta ${crownCard.color} ${crownCard.symbol === 'número' ? `número ${crownCard.number}` : `com símbolo ${crownCard.symbol}`}.`);
  }
  
  // Escolher uma dica aleatória
  const randomIndex = Math.floor(Math.random() * hints.length);
  return hints[randomIndex];
}

// Funções auxiliares
function getRandomColorExcept(exceptColor) {
  const colors = ['vermelho', 'azul', 'verde', 'amarelo', 'preto'].filter(c => c !== exceptColor);
  return colors[Math.floor(Math.random() * colors.length)];
}

function getRandomSymbolExcept(exceptSymbol) {
  const symbols = ['número', '+2', '+4', 'inverter', 'pular'].filter(s => s !== exceptSymbol);
  return symbols[Math.floor(Math.random() * symbols.length)];
}


