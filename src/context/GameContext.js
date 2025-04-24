'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

// Contexto do jogo
const GameContext = createContext();

// Provedor do contexto
export function GameProvider({ children }) {
  // Estado do jogo
  const [gameStep, setGameStep] = useState('inicio');
  const [gameConfig, setGameConfig] = useState({
    numJogadores: 5,
    timerDuration: 300, // 5 minutos em segundos
    numImpostores: 1,
    numComodos: 5,
    tipoBaralho: 'uno',
    showImpostorReveal: true,
    cartaCoroaNivel: 'padrao', // 'padrao', 'medio', 'dificil', 'cataclisma'
    votacaoNivel: 'visiveis' // 'visiveis', 'ocultas'
  });
  
  const [players, setPlayers] = useState([]);
  const [impostors, setImpostors] = useState([]);
  const [currentChief, setCurrentChief] = useState('');
  const [selectedPlayer, setSelectedPlayer] = useState('');
  const [rooms, setRooms] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [timerSeconds, setTimerSeconds] = useState(gameConfig.timerDuration);
  const [timerRunning, setTimerRunning] = useState(false);
  const [currentRound, setCurrentRound] = useState(1);
  const [votes, setVotes] = useState({});
  const [crownCard, setCrownCard] = useState(null);
  const [crownHint, setCrownHint] = useState('');
  const [crownFound, setCrownFound] = useState(false);
  const [crownFoundResult, setCrownFoundResult] = useState(null);
  const [hackActive, setHackActive] = useState(false);
  const [hackType, setHackType] = useState(null);
  const [crownCardChanged, setCrownCardChanged] = useState(false);
  const [lastCrownChangeRound, setLastCrownChangeRound] = useState(0);
  
  // Timer
  useEffect(() => {
    let interval;
    
    if (timerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        // Se o hack estiver ativo e for do tipo 'timer', o tempo passa mais rápido
        if (hackActive && hackType === 'timer') {
          setTimerSeconds(prev => Math.max(0, prev - 2));
        } else {
          setTimerSeconds(prev => Math.max(0, prev - 1));
        }
      }, 1000);
    } else if (timerSeconds === 0) {
      setTimerRunning(false);
    }
    
    return () => clearInterval(interval);
  }, [timerRunning, timerSeconds, hackActive, hackType]);
  
  // Formatar tempo
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Iniciar timer
  const startTimer = () => {
    setTimerRunning(true);
  };
  
  // Pausar timer
  const pauseTimer = () => {
    setTimerRunning(false);
  };
  
  // Resetar timer
  const resetTimer = () => {
    setTimerSeconds(gameConfig.timerDuration);
    setTimerRunning(false);
  };
  
  // Navegar para um passo específico
  const goToStep = (step) => {
    setGameStep(step);
  };
  
  // Configurar o jogo
  const configureGame = (config) => {
    setGameConfig(config);
    setTimerSeconds(config.timerDuration);
  };
  
  // Adicionar jogador
  const addPlayer = (name) => {
    if (players.length < gameConfig.numJogadores && !players.some(p => p.name === name)) {
      setPlayers(prev => [...prev, { 
        id: Date.now().toString(), 
        name, 
        isImpostor: false,
        votedOut: false,
        completedTask: false,
        card: null
      }]);
      return true;
    }
    return false;
  };
  
  // Remover jogador
  const removePlayer = (id) => {
    setPlayers(prev => prev.filter(player => player.id !== id));
  };
  
  // Selecionar impostores aleatoriamente
  const selectImpostors = () => {
    const shuffledPlayers = [...players].sort(() => 0.5 - Math.random());
    const selectedImpostors = shuffledPlayers.slice(0, gameConfig.numImpostores);
    
    // Marcar jogadores como impostores
    const updatedPlayers = players.map(player => ({
      ...player,
      isImpostor: selectedImpostors.some(imp => imp.id === player.id)
    }));
    
    setPlayers(updatedPlayers);
    setImpostors(selectedImpostors.map(imp => imp.name));
  };
  
  // Selecionar chefe aleatoriamente
  const selectChief = () => {
    const availablePlayers = players.filter(player => !player.votedOut);
    if (availablePlayers.length > 0) {
      const randomIndex = Math.floor(Math.random() * availablePlayers.length);
      const newChief = availablePlayers[randomIndex].name;
      setCurrentChief(newChief);
      return newChief;
    }
    return null;
  };
  
  // Verificar se o jogador atual é o Chefe e um Impostor
  const isChiefAndImpostor = () => {
    const player = players.find(p => p.name === selectedPlayer);
    return player && player.name === currentChief && player.isImpostor;
  };
  
  // Gerar tarefas para os jogadores
  const generateTasks = () => {
    const taskDescriptions = [
      { description: "Encontre três cartas da mesma cor" },
      { description: "Colete uma sequência de três números consecutivos" },
      { description: "Reúna duas cartas com o mesmo símbolo" },
      { description: "Encontre uma carta de cada cor básica" },
      { description: "Colete cartas que somem exatamente 15 pontos" },
      { description: "Encontre duas cartas de ação (Pular, Inverter, +2)" },
      { description: "Reúna uma carta de cada tipo (número, ação, coringa)" },
      { description: "Colete três cartas com números pares" },
      { description: "Encontre três cartas com números ímpares" },
      { description: "Reúna cartas que formem uma escada (ex: 3, 4, 5)" }
    ];
    
    // Criar tarefas para cada jogador
    const newTasks = [];
    const availablePlayers = players.filter(player => !player.votedOut);
    
    // Atribuir tarefas aos jogadores
    availablePlayers.forEach((player, index) => {
      const taskIndex = index % taskDescriptions.length;
      newTasks.push({
        id: `task-${player.id}`,
        name: `Cômodo ${index + 1}`,
        responsible: player.name,
        task: taskDescriptions[taskIndex],
        completed: false,
        isCommon: false
      });
    });
    
    // Adicionar tarefa da área comum
    newTasks.push({
      id: 'task-common',
      name: 'Área Comum',
      responsible: 'Todos',
      task: null,
      completed: false,
      isCommon: true
    });
    
    setTasks(newTasks);
    return newTasks;
  };
  
  // Gerar cômodos para o jogo
  const generateRooms = () => {
    const newRooms = [];
    const availablePlayers = players.filter(player => !player.votedOut);
    
    // Criar cômodos para cada jogador
    availablePlayers.forEach((player, index) => {
      newRooms.push({
        id: `room-${index + 1}`,
        name: `Cômodo ${index + 1}`,
        responsible: player.name,
        cards: generateCards(5), // 5 cartas por cômodo
        isCommon: false
      });
    });
    
    // Adicionar área comum
    newRooms.push({
      id: 'room-common',
      name: 'Área Comum',
      responsible: 'Todos',
      cards: [],
      isCommon: true
    });
    
    setRooms(newRooms);
    return newRooms;
  };
  
  // Gerar cartas para um cômodo
  const generateCards = (count) => {
    const colors = ['vermelho', 'azul', 'verde', 'amarelo'];
    const symbols = ['número', '+2', 'inverter', 'pular', 'coringa'];
    const cards = [];
    
    for (let i = 0; i < count; i++) {
      const color = colors[Math.floor(Math.random() * colors.length)];
      const symbol = symbols[Math.floor(Math.random() * symbols.length)];
      const number = symbol === 'número' ? Math.floor(Math.random() * 10) : null;
      
      cards.push({
        id: `card-${Date.now()}-${i}`,
        color: symbol === 'coringa' ? 'preto' : color,
        symbol,
        number,
        description: symbol === 'número' 
          ? `${color} ${number}` 
          : `${color} ${symbol}`
      });
    }
    
    return cards;
  };
  
  // Escolher uma carta para esconder a coroa
  const selectCrownCard = () => {
    // Escolher um cômodo aleatório
    const playerRooms = rooms.filter(room => !room.isCommon);
    if (playerRooms.length === 0) return null;
    
    const randomRoomIndex = Math.floor(Math.random() * playerRooms.length);
    const selectedRoom = playerRooms[randomRoomIndex];
    
    // Escolher uma carta aleatória do cômodo
    if (selectedRoom.cards.length === 0) return null;
    
    const randomCardIndex = Math.floor(Math.random() * selectedRoom.cards.length);
    const selectedCard = selectedRoom.cards[randomCardIndex];
    
    setCrownCard({
      ...selectedCard,
      roomId: selectedRoom.id
    });
    
    return {
      card: selectedCard,
      roomId: selectedRoom.id
    };
  };
  
  // Verificar se a carta coroa deve ser alterada com base no nível escolhido
  const shouldChangeCrownCard = () => {
    switch (gameConfig.cartaCoroaNivel) {
      case 'padrao':
        return false; // Nunca muda
      case 'medio':
        return currentRound > 0 && currentRound % 10 === 0 && currentRound !== lastCrownChangeRound;
      case 'dificil':
        return currentRound > 0 && currentRound % 5 === 0 && currentRound !== lastCrownChangeRound;
      case 'cataclisma':
        // 20% de chance de mudar a cada rodada
        return Math.random() < 0.2 && currentRound !== lastCrownChangeRound;
      default:
        return false;
    }
  };
  
  // Alterar a carta coroa
  const changeCrownCard = () => {
    const result = selectCrownCard();
    if (result) {
      setCrownCardChanged(true);
      setLastCrownChangeRound(currentRound);
      return true;
    }
    return false;
  };
  
  // Gerar dica sobre a coroa
  const generateCrownHint = () => {
    if (!crownCard) return '';
    
    const hintTypes = [
      'cor',
      'símbolo',
      'número',
      'comparação'
    ];
    
    const hintType = hintTypes[Math.floor(Math.random() * hintTypes.length)];
    let hint = '';
    
    switch (hintType) {
      case 'cor':
        hint = `A Inteligência informa que a carta de cor ${crownCard.color} esconde a Coroa.`;
        break;
      case 'símbolo':
        hint = `A Inteligência recebeu um reporte de que a Coroa foi vista em uma carta de símbolo ${crownCard.symbol}.`;
        break;
      case 'número':
        if (crownCard.number !== null) {
          hint = `A Inteligência aponta que a Coroa está em uma carta com o número ${crownCard.number}.`;
        } else {
          hint = `A Inteligência aponta que a Coroa está em uma carta especial sem número.`;
        }
        break;
      case 'comparação':
        if (crownCard.number !== null) {
          const comparison = Math.random() > 0.5 ? 'maior' : 'menor';
          const compareNumber = comparison === 'maior' 
            ? Math.max(0, crownCard.number - Math.floor(Math.random() * 3) - 1)
            : Math.min(9, crownCard.number + Math.floor(Math.random() * 3) + 1);
          
          hint = `A Inteligência aponta que a Coroa está em uma carta com número ${comparison} que ${compareNumber}.`;
        } else {
          hint = `A Inteligência aponta que a Coroa está em uma carta especial.`;
        }
        break;
    }
    
    setCrownHint(hint);
    return hint;
  };
  
  // Marcar tarefa como concluída
  const markTaskCompleted = (taskId, completed) => {
    // Se o hack estiver ativo e for do tipo 'tasks', inverte o status
    if (hackActive && hackType === 'tasks') {
      completed = !completed;
    }
    
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, completed } : task
    ));
    
    // Atualizar o status de conclusão da tarefa do jogador
    const task = tasks.find(t => t.id === taskId);
    if (task && !task.isCommon) {
      setPlayers(prev => prev.map(player => 
        player.name === task.responsible ? { ...player, completedTask: completed } : player
      ));
    }
  };
  
  // Pegar uma carta de um cômodo
  const takeCardFromRoom = (roomId, cardId, playerName) => {
    // Verificar se o jogador já tem uma carta
    const player = players.find(p => p.name === playerName);
    if (player && player.card) {
      return { success: false, error: 'Você já está carregando uma carta' };
    }
    
    // Encontrar o cômodo e a carta
    const room = rooms.find(r => r.id === roomId);
    if (!room) return { success: false, error: 'Cômodo não encontrado' };
    
    const cardIndex = room.cards.findIndex(c => c.id === cardId);
    if (cardIndex === -1) return { success: false, error: 'Carta não encontrada' };
    
    // Remover a carta do cômodo
    const card = room.cards[cardIndex];
    const updatedRooms = rooms.map(r => {
      if (r.id === roomId) {
        return {
          ...r,
          cards: r.cards.filter(c => c.id !== cardId)
        };
      }
      return r;
    });
    
    // Dar a carta ao jogador
    const updatedPlayers = players.map(p => {
      if (p.name === playerName) {
        return {
          ...p,
          card
        };
      }
      return p;
    });
    
    setRooms(updatedRooms);
    setPlayers(updatedPlayers);
    
    return { success: true, card };
  };
  
  // Deixar uma carta em um cômodo
  const leaveCardInRoom = (roomId, playerName) => {
    // Verificar se o jogador tem uma carta
    const player = players.find(p => p.name === playerName);
    if (!player || !player.card) {
      return { success: false, error: 'Você não está carregando nenhuma carta' };
    }
    
    // Encontrar o cômodo
    const room = rooms.find(r => r.id === roomId);
    if (!room) return { success: false, error: 'Cômodo não encontrado' };
    
    // Adicionar a carta ao cômodo
    const card = player.card;
    const updatedRooms = rooms.map(r => {
      if (r.id === roomId) {
        return {
          ...r,
          cards: [...r.cards, card]
        };
      }
      return r;
    });
    
    // Remover a carta do jogador
    const updatedPlayers = players.map(p => {
      if (p.name === playerName) {
        return {
          ...p,
          card: null
        };
      }
      return p;
    });
    
    setRooms(updatedRooms);
    setPlayers(updatedPlayers);
    
    return { success: true };
  };
  
  // Trocar cartas entre jogadores
  const tradeCardsBetweenPlayers = (player1Name, player2Name) => {
    const player1 = players.find(p => p.name === player1Name);
    const player2 = players.find(p => p.name === player2Name);
    
    if (!player1 || !player2) {
      return { success: false, error: 'Jogador não encontrado' };
    }
    
    if (!player1.card && !player2.card) {
      return { success: false, error: 'Nenhum dos jogadores tem carta para trocar' };
    }
    
    // Trocar as cartas
    const updatedPlayers = players.map(p => {
      if (p.name === player1Name) {
        return { ...p, card: player2.card };
      }
      if (p.name === player2Name) {
        return { ...p, card: player1.card };
      }
      return p;
    });
    
    setPlayers(updatedPlayers);
    
    return { success: true };
  };
  
  // Registrar voto
  const registerVote = (voterName, votedName) => {
    // Verificar se o jogador completou sua tarefa
    const voter = players.find(p => p.name === voterName);
    
    // Registrar o voto independentemente de ter completado a tarefa ou não
    setVotes(prev => ({
      ...prev,
      [voterName]: votedName
    }));
    
    return { success: true };
  };
  
  // Finalizar votação e determinar resultado
  const finalizeVoting = () => {
    // Contar votos apenas de jogadores que completaram suas tarefas
    const validVoters = players.filter(p => p.completedTask && !p.votedOut);
    
    // Se o hack estiver ativo e for do tipo 'votes', altera alguns votos aleatoriamente
    let finalVotes = { ...votes };
    if (hackActive && hackType === 'votes') {
      const hackableVoters = Object.keys(votes).filter(voter => {
        const player = players.find(p => p.name === voter);
        return player && player.completedTask;
      });
      
      if (hackableVoters.length > 0) {
        // Alterar 1-3 votos aleatoriamente
        const numVotesToHack = Math.min(hackableVoters.length, Math.floor(Math.random() * 3) + 1);
        const votersToHack = hackableVoters.sort(() => 0.5 - Math.random()).slice(0, numVotesToHack);
        
        const availablePlayers = players.filter(p => !p.votedOut).map(p => p.name);
        
        votersToHack.forEach(voter => {
          const randomPlayer = availablePlayers[Math.floor(Math.random() * availablePlayers.length)];
          finalVotes[voter] = randomPlayer;
        });
      }
    }
    
    // Contar votos válidos
    const voteCounts = {};
    validVoters.forEach(voter => {
      const vote = finalVotes[voter.name];
      if (vote) {
        voteCounts[vote] = (voteCounts[vote] || 0) + 1;
      }
    });
    
    // Determinar jogador mais votado
    let mostVotedPlayer = null;
    let maxVotes = 0;
    let isTie = false;
    
    Object.entries(voteCounts).forEach(([playerName, count]) => {
      if (count > maxVotes) {
        mostVotedPlayer = playerName;
        maxVotes = count;
        isTie = false;
      } else if (count === maxVotes) {
        isTie = true;
      }
    });
    
    // Se houver empate, ninguém é eliminado
    if (isTie) {
      mostVotedPlayer = null;
    }
    
    // Eliminar jogador mais votado
    if (mostVotedPlayer) {
      setPlayers(prev => prev.map(player => 
        player.name === mostVotedPlayer ? { ...player, votedOut: true } : player
      ));
      
      // Desativar hack após eliminação
      setHackActive(false);
      setHackType(null);
    }
    
    // Limpar votos
    setVotes({});
    
    return {
      mostVotedPlayer,
      isTie,
      voteCounts
    };
  };
  
  // Iniciar nova rodada
  const startNewRound = () => {
    // Incrementar contador de rodadas
    setCurrentRound(prev => prev + 1);
    
    // Resetar timer
    resetTimer();
    
    // Resetar status de conclusão de tarefas
    setPlayers(prev => prev.map(player => ({
      ...player,
      completedTask: false
    })));
    
    // Gerar novas tarefas
    generateTasks();
    
    // Verificar se a carta coroa deve ser alterada
    if (shouldChangeCrownCard()) {
      changeCrownCard();
    } else {
      setCrownCardChanged(false);
    }
    
    // Gerar nova dica sobre a coroa
    generateCrownHint();
    
    // Selecionar novo chefe
    selectChief();
    
    // Ir para a tela de revelação de papel
    goToStep('revelacao-papel');
  };
  
  // Hackear o app (função para o impostor)
  const hackApp = () => {
    if (!isChiefAndImpostor()) {
      return { success: false, error: 'Apenas o Chefe Impostor pode hackear o app' };
    }
    
    // Escolher um tipo de hack aleatório
    const hackTypes = ['timer', 'tasks', 'votes'];
    const selectedHackType = hackTypes[Math.floor(Math.random() * hackTypes.length)];
    
    setHackActive(true);
    setHackType(selectedHackType);
    
    return { 
      success: true, 
      type: selectedHackType 
    };
  };
  
  // Declarar que encontrou a coroa
  const declareFoundCrown = (cardDescription) => {
    // Verificar se a descrição da carta corresponde à carta coroa
    const isCorrect = crownCard && cardDescription.toLowerCase() === crownCard.description.toLowerCase();
    
    if (isCorrect) {
      setCrownFound(true);
      setCrownFoundResult({
        playerName: selectedPlayer,
        isImpostor: players.find(p => p.name === selectedPlayer)?.isImpostor || false
      });
      
      return {
        success: true,
        correct: true,
        message: "Parabéns! Você encontrou a Coroa!"
      };
    } else {
      return {
        success: true,
        correct: false,
        message: "Esta não é a carta que esconde a Coroa. Continue procurando!"
      };
    }
  };
  /*
  // Escolher ação após encontrar a coroa
  const chooseCrownAction = (action) => {
    if (!crownFound) {
      return { success: false, error: 'A Coroa ainda não foi encontrada' };
    }
    
    const player = players.find(p => p.name === selectedPlayer);
    const isImpostor = player?.isImpostor 
