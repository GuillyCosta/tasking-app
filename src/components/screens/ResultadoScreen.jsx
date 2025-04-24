'use client';

import React from 'react';
import { useGameContext } from '@/context/GameContext';
import { Button } from '@/components/ui/button';
import { VotingResult } from '@/components/GameComponents';

export function ResultadoScreen() {
  const { 
    players, 
    gameConfig, 
    startNewRound, 
    goToStep,
    currentRound
  } = useGameContext();
  
  // Obter o resultado da votação do contexto
  const votingResult = {
    mostVotedPlayer: players.find(p => p.votedOut && p.votedOutRound === currentRound)?.name || null,
    isTie: false, // Determinado durante a finalização da votação
    voteCounts: {} // Preenchido durante a finalização da votação
  };
  
  // Iniciar nova rodada
  const handleStartNewRound = () => {
    startNewRound();
  };
  
  return (
    <div className="max-w-3xl w-full bg-black/30 backdrop-blur-sm shadow-2xl border-yellow-500/30 rounded-lg p-6">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-center text-yellow-400 mb-2">Resultado da Votação</h2>
        <p className="text-center text-gray-300">
          Veja quem foi eliminado nesta rodada
        </p>
      </div>
      
      <VotingResult 
        result={votingResult} 
        players={players} 
        showImpostorReveal={gameConfig.showImpostorReveal} 
      />
      
      <div className="mt-8 text-center">
        <Button 
          onClick={handleStartNewRound} 
          className="bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-3 rounded-lg"
        >
          Iniciar Nova Rodada
        </Button>
      </div>
    </div>
  );
}


