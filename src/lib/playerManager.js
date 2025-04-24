'use client';

// Funções para gerenciar os jogadores

// Adicionar um novo jogador
export function addPlayer(players, playerName, gameConfig) {
  if (!playerName || !players || !gameConfig) return { success: false, error: 'Dados inválidos' };
  
  // Verificar se o nome já existe
  if (players.some(p => p.name === playerName)) {
    return { success: false, error: 'Este nome já está em uso' };
  }
  
  // Verificar se atingiu o limite de jogadores
  if (players.length >= gameConfig.numJogadores) {
    return { success: false, error: `Limite de ${gameConfig.numJogadores} jogadores atingido` };
  }
  
  // Criar novo jogador
  const newPlayer = {
    id: `player_${Date.now()}`,
    name: playerName,
    isImpostor: false, // Será definido depois
    votedOut: false,
    votedOutRound: null,
    card: null // Carta que o jogador está carregando
  };
  
  // Adicionar à lista
  const updatedPlayers = [...players, newPlayer];
  
  return { success: true, players: updatedPlayers };
}

// Remover um jogador
export function removePlayer(players, playerId) {
  if (!playerId || !players) return { success: false, error: 'Dados inválidos' };
  
  const updatedPlayers = players.filter(p => p.id !== playerId);
  
  return { success: true, players: updatedPlayers };
}

// Selecionar impostores aleatoriamente
export function selectImpostors(players, numImpostors) {
  if (!players || !numImpostors) return { success: false, error: 'Dados inválidos' };
  
  // Limitar o número de impostores
  const maxImpostors = Math.min(numImpostors, Math.floor(players.length / 2));
  
  // Embaralhar jogadores
  const shuffledPlayers = [...players].sort(() => Math.random() - 0.5);
  
  // Selecionar os primeiros como impostores
  const impostors = shuffledPlayers.slice(0, maxImpostors).map(p => p.name);
  
  // Atualizar o status de impostor dos jogadores
  const updatedPlayers = players.map(player => ({
    ...player,
    isImpostor: impostors.includes(player.name)
  }));
  
  return { success: true, players: updatedPlayers, impostors };
}

// Selecionar um chefe aleatoriamente
export function selectChief(players, previousChief = null) {
  if (!players || players.length === 0) return { success: false, error: 'Sem jogadores disponíveis' };
  
  // Filtrar jogadores ativos (não eliminados)
  const activePlayers = players.filter(p => !p.votedOut);
  
  if (activePlayers.length === 0) return { success: false, error: 'Sem jogadores ativos' };
  
  // Filtrar jogadores que ainda não foram chefe, se possível
  const eligiblePlayers = previousChief 
    ? activePlayers.filter(p => p.name !== previousChief)
    : activePlayers;
  
  // Se todos já foram chefe, usar todos os jogadores ativos
  const candidatePlayers = eligiblePlayers.length > 0 ? eligiblePlayers : activePlayers;
  
  // Selecionar aleatoriamente
  const randomIndex = Math.floor(Math.random() * candidatePlayers.length);
  const newChief = candidatePlayers[randomIndex].name;
  
  return { success: true, chief: newChief };
}

// Marcar um jogador como eliminado
export function eliminatePlayer(players, playerName, round) {
  if (!playerName || !players || !round) return { success: false, error: 'Dados inválidos' };
  
  // Verificar se o jogador existe
  const playerIndex = players.findIndex(p => p.name === playerName);
  if (playerIndex === -1) return { success: false, error: 'Jogador não encontrado' };
  
  // Atualizar o status do jogador
  const updatedPlayers = [...players];
  updatedPlayers[playerIndex] = {
    ...updatedPlayers[playerIndex],
    votedOut: true,
    votedOutRound: round
  };
  
  return { success: true, players: updatedPlayers };
}

// Verificar se um jogador pode pegar uma carta
export function canTakeCard(player) {
  if (!player) return false;
  
  // Jogador só pode carregar uma carta por vez
  return player.card === null;
}

// Verificar se um jogador pode deixar uma carta
export function canLeaveCard(player) {
  if (!player) return false;
  
  // Jogador precisa ter uma carta para deixá-la
  return player.card !== null;
}


