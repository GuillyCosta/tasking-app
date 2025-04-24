'use client';

import React, { useState, useEffect } from 'react';
import { useGameContext } from '@/context/GameContext';
import { Button } from '@/components/ui/button';
import { 
  Timer, 
  CrownHint, 
  GameProgress, 
  TaskList,
  HackButton,
  DeclareFoundCrown
} from '@/components/GameComponents';
import { CardTaskSystem } from '@/components/CardComponents';
import { CardTradeSystem } from '@/components/CardTradeComponents';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function RodadaScreen() {
  const { 
    players, 
    tasks, 
    rooms,
    timerSeconds, 
    timerRunning, 
    startTimer, 
    pauseTimer, 
    formatTime, 
    markTaskCompleted, 
    currentChief, 
    selectedPlayer,
    crownHint,
    goToStep,
    hackApp,
    declareFoundCrown,
    chooseCrownAction,
    crownFound,
    crownFoundResult,
    crownCardChanged,
    currentRound
  } = useGameContext();
  
  const [activeTab, setActiveTab] = useState('tarefas');
  const [hackResult, setHackResult] = useState(null);
  const [crownResult, setCrownResult] = useState(null);
  const [showCrownOptions, setShowCrownOptions] = useState(false);
  const [crownActionResult, setCrownActionResult] = useState(null);
  
  // Verificar se o jogador atual é o Chefe
  const isChief = selectedPlayer === currentChief;
  
  // Verificar se o jogador atual é um Impostor
  const isImpostor = players.find(p => p.name === selectedPlayer)?.isImpostor || false;
  
  // Verificar se o Chefe é um Impostor
  const isChiefImpostor = isChief && isImpostor;
  
  // Calcular progresso das tarefas
  const completedTasks = tasks.filter(task => task.completed && !task.isCommon).length;
  const totalTasks = tasks.filter(task => !task.isCommon).length;
  
  // Efeito para verificar se o timer acabou
  useEffect(() => {
    if (timerSeconds === 0 && !timerRunning) {
      // Timer acabou, ir para a tela de votação
      goToStep('votacao');
    }
  }, [timerSeconds, timerRunning, goToStep]);
  
  // Hackear o app (função para o impostor)
  const handleHackApp = () => {
    const result = hackApp();
    if (result.success) {
      setHackResult(result);
      setTimeout(() => {
        setHackResult(null);
      }, 3000);
    }
  };
  
  // Declarar que encontrou a coroa
  const handleDeclareFoundCrown = (cardDescription) => {
    const result = declareFoundCrown(cardDescription);
    setCrownResult(result);
    
    if (result.correct) {
      setShowCrownOptions(true);
    } else {
      setTimeout(() => {
        setCrownResult(null);
      }, 3000);
    }
  };
  
  // Escolher ação após encontrar a coroa
  const handleCrownAction = (action) => {
    const result = chooseCrownAction(action);
    if (result.success) {
      setCrownActionResult(result);
      setShowCrownOptions(false);
      
      // Após alguns segundos, voltar para a tela inicial
      setTimeout(() => {
        goToStep('inicio');
      }, 5000);
    }
  };
  
  return (
    <div className="max-w-4xl w-full bg-black/30 backdrop-blur-sm shadow-2xl border-yellow-500/30 rounded-lg p-6">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-center text-yellow-400 mb-4">Rodada em Andamento</h2>
        
        {/* Timer no topo da tela */}
        <div className="mb-6">
          <Timer 
            seconds={timerSeconds} 
            isRunning={timerRunning} 
            onStart={startTimer} 
            onPause={pauseTimer} 
            formatTime={formatTime} 
          />
        </div>
        
        {crownCardChanged && (
          <div className="mb-4 p-3 bg-red-900/30 rounded-lg text-center">
            <p className="text-red-300 font-bold">
              Atenção: A carta que esconde a Coroa foi alterada!
            </p>
          </div>
        )}
        
        {isChief && (
          <div className="mb-4 p-3 bg-yellow-900/30 rounded-lg text-center">
            <p className="text-yellow-300 font-bold">
              Você é o Chefe desta rodada!
            </p>
          </div>
        )}
      </div>
      
      {/* Mensagens de resultado */}
      {hackResult && (
        <div className="mb-4 p-3 bg-red-900/30 rounded-lg text-center">
          <p className="text-red-300 font-bold">
            Hack ativado: {hackResult.type === 'timer' ? 'Timer' : hackResult.type === 'tasks' ? 'Tarefas' : 'Votos'}
          </p>
        </div>
      )}
      
      {crownResult && (
        <div className={`mb-4 p-3 ${crownResult.correct ? 'bg-green-900/30' : 'bg-red-900/30'} rounded-lg text-center`}>
          <p className={`${crownResult.correct ? 'text-green-300' : 'text-red-300'} font-bold`}>
            {crownResult.message}
          </p>
        </div>
      )}
      
      {showCrownOptions && (
        <div className="mb-6 p-4 bg-purple-900/30 rounded-lg">
          <h3 className="text-xl font-bold text-purple-300 mb-3 text-center">Contar para Equipe ou se coroar Rei?</h3>
          <div className="flex justify-center space-x-4">
            <Button 
              onClick={() => handleCrownAction('share')} 
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-lg"
            >
              Contar para a Equipe
            </Button>
            <Button 
              onClick={() => handleCrownAction('crown')} 
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-4 py-2 rounded-lg"
            >
              Coroar-se Rei
            </Button>
          </div>
        </div>
      )}
      
      {crownActionResult && (
        <div className="mb-6 p-4 bg-green-900/30 rounded-lg text-center">
          <p className="text-green-300 font-bold mb-2">Decisão tomada!</p>
          <p className="text-white">{crownActionResult.message}</p>
          <p className="mt-2 text-gray-400 text-sm">Voltando para a tela inicial em alguns segundos...</p>
        </div>
      )}
      
      {/* Abas para diferentes funcionalidades */}
      <Tabs defaultValue="tarefas" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="tarefas">Tarefas</TabsTrigger>
          <TabsTrigger value="cartas">Cartas</TabsTrigger>
          <TabsTrigger value="troca">Troca de Cartas</TabsTrigger>
        </TabsList>
        
        <TabsContent value="tarefas" className="space-y-6">
          {/* Dica sobre a Coroa (apenas para o Chefe) */}
          <CrownHint hint={crownHint} isChief={isChief} />
          
          {/* Progresso das tarefas */}
          <GameProgress completedTasks={completedTasks} totalTasks={totalTasks} />
          
          {/* Lista de tarefas */}
          <TaskList 
            tasks={tasks} 
            onMarkCompleted={markTaskCompleted} 
            isChief={isChief}
            timerStarted={timerRunning}
          />
          
          {/* Botão de Hack (apenas para o Chefe Impostor) */}
          {isChiefImpostor && (
            <HackButton isImpostor={isChiefImpostor} onHack={handleHackApp} />
          )}
          
          {/* Botão para Declarar que Encontrou a Coroa */}
          <DeclareFoundCrown onDeclare={handleDeclareFoundCrown} />
        </TabsContent>
        
        <TabsContent value="cartas" className="space-y-6">
          {/* Sistema de tarefas baseado em cartas */}
          <CardTaskSystem 
            tasks={tasks} 
            rooms={rooms} 
            currentPlayer={selectedPlayer} 
            onCompleteTask={markTaskCompleted}
          />
        </TabsContent>
        
        <TabsContent value="troca" className="space-y-6">
          {/* Sistema de troca de cartas */}
          <CardTradeSystem 
            players={players} 
            rooms={rooms} 
            currentPlayer={selectedPlayer}
          />
        </TabsContent>
      </Tabs>
      
      {timerSeconds === 0 && (
        <div className="mt-6 text-center">
          <Button 
            onClick={() => goToStep('votacao')} 
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-lg"
          >
            Ir para Votação
          </Button>
        </div>
      )}
    </div>
  );
}

// No componente RodadaScreen.jsx

// Adicione este trecho para exibir as opções após encontrar a coroa
{crownFound && !crownActionResult && (
  <div className="mt-6 p-4 bg-yellow-900/30 rounded-lg">
    <h3 className="text-xl font-bold text-yellow-300 mb-3">Você encontrou a Coroa!</h3>
    <p className="mb-4">O que deseja fazer com ela?</p>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <button
        onClick={() => {
          const result = chooseCrownAction("team");
          if (result.success) {
            // Feedback visual de sucesso
          }
        }}
        className="p-4 bg-green-700/50 hover:bg-green-700/70 rounded-lg text-center"
      >
        <span className="text-lg font-medium">Entregar para minha Equipe</span>
        <p className="text-sm text-gray-300 mt-1">
          Compartilhe a vitória com sua equipe
        </p>
      </button>
      
      <button
        onClick={() => {
          const result = chooseCrownAction("king");
          if (result.success) {
            // Feedback visual de sucesso
          }
        }}
        className="p-4 bg-purple-700/50 hover:bg-purple-700/70 rounded-lg text-center"
      >
        <span className="text-lg font-medium">Coroar-me Rei</span>
        <p className="text-sm text-gray-300 mt-1">
          Reclame o trono para si mesmo
        </p>
      </button>
    </div>
  </div>
)}

// Adicione este trecho para exibir o resultado da escolha
{crownActionResult && (
  <div className="mt-6 p-6 bg-yellow-900/30 rounded-lg text-center">
    <h3 className="text-xl font-bold text-yellow-300 mb-4">{crownActionResult.title}</h3>
    <p className="text-lg mb-6">{crownActionResult.message}</p>
    <p className="text-sm text-gray-400">Retornando à tela inicial em alguns segundos...</p>
  </div>
)}


