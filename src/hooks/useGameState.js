'use client';

import { useState, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';

export function useGameState() {
  // Estado do jogo armazenado no localStorage
  const [gameStep, setGameStep] = useLocalStorage('tasking_gameStep', 'inicio');
  const [gameConfig, setGameConfig] = useLocalStorage('tasking_gameConfig', {
    numJogadores: 5,
    timerDuration: 300, // 5 minutos em segundos
    numImpostores: 1,
    numComodos: 5,
    tipoBaralho: 'uno',
    showImpostorReveal: true,
    cartaCoroaNivel: 'padrao', // 'padrao', 'medio', 'dificil', 'cataclisma'
    votacaoNivel: 'visiveis' // 'visiveis', 'ocultas'
  });
  
  const [players, setPlayers] = useLocalStorage('tasking_players', []);
  const [impostors, setImpostors] = useLocalStorage('tasking_impostors', []);
  const [currentChief, setCurrentChief] = useLocalStorage('tasking_currentChief', '');
  const [selectedPlayer, setSelectedPlayer] = useLocalStorage('tasking_selectedPlayer', '');
  const [rooms, setRooms] = useLocalStorage('tasking_rooms', []);
  const [tasks, setTasks] = useLocalStorage('tasking_tasks', []);
  const [currentRound, setCurrentRound] = useLocalStorage('tasking_currentRound', 1);
  const [votes, setVotes] = useLocalStorage('tasking_votes', {});
  const [crownCard, setCrownCard] = useLocalStorage('tasking_crownCard', null);
  const [crownHint, setCrownHint] = useLocalStorage('tasking_crownHint', '');
  const [crownCardChanged, setCrownCardChanged] = useLocalStorage('tasking_crownCardChanged', false);
  
  // Navegação entre telas
  const goToStep = (step) => {
    setGameStep(step);
  };
  
  return {
    gameStep, setGameStep,
    gameConfig, setGameConfig,
    players, setPlayers,
    impostors, setImpostors,
    currentChief, setCurrentChief,
    selectedPlayer, setSelectedPlayer,
    rooms, setRooms,
    tasks, setTasks,
    currentRound, setCurrentRound,
    votes, setVotes,
    crownCard, setCrownCard,
    crownHint, setCrownHint,
    crownCardChanged, setCrownCardChanged,
    goToStep
  };
}


