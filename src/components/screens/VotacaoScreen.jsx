'use client';

import React, { useState, useEffect } from 'react';
import { useGameContext } from '@/context/GameContext';
import { Button } from '@/components/ui/button';

export function VotacaoScreen() {
  const { 
    players, 
    currentChief, 
    selectedPlayer, 
    registerVote, 
    finalizeVoting, 
    goToStep,
    gameConfig,
    votes
  } = useGameContext();
  
  const [votedPlayer, setVotedPlayer] = useState('');
  const [voteRegistered, setVoteRegistered] = useState(false);
  const [votingFinalized, setVotingFinalized] = useState(false);
  const [votingResult, setVotingResult] = useState(null);
  
  // Verificar se o jogador atual é o Chefe
  const isChief = selectedPlayer === currentChief;
  
  // Filtrar jogadores disponíveis para votação (excluindo o jogador atual e jogadores já eliminados)
  const availablePlayers = players.filter(player => 
    player.name !== selectedPlayer && !player.votedOut
  );
  
  // Verificar se o jogador já votou
  const hasVoted = !!votes[selectedPlayer];
  
  // Registrar voto
  const handleVote = (playerName) => {
    if (!voteRegistered) {
      const result = registerVote(selectedPlayer, playerName);
      if (result.success) {
        setVotedPlayer(playerName);
        setVoteRegistered(true);
      }
    }
  };
  
  // Finalizar votação (apenas para o Chefe)
  const handleFinalizeVoting = () => {
    if (isChief && !votingFinalized) {
      const result = finalizeVoting();
      setVotingResult(result);
      setVotingFinalized(true);
    }
  };
  
  // Ir para a tela de resultado
  const handleGoToResult = () => {
    goToStep('resultado');
  };
  
  // Verificar se todos os jogadores votaram
  const allPlayersVoted = players
    .filter(player => !player.votedOut)
    .every(player => !!votes[player.name]);
  
  return (
    <div className="max-w-3xl w-full bg-black/30 backdrop-blur-sm shadow-2xl border-yellow-500/30 rounded-lg p-6">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-center text-yellow-400 mb-2">Votação</h2>
        <p className="text-center text-gray-300">
          Vote em quem você acha que é o Impostor
        </p>
      </div>
      
      {!voteRegistered ? (
        <>
          <div className="mb-4">
            <p className="text-lg mb-2">Escolha um jogador para eliminar:</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {availablePlayers.map(player => {
              // Determinar se devemos mostrar o status da tarefa
              const showTaskStatus = isChief || gameConfig.votacaoNivel === 'visiveis';
              
              return (
                <button
                  key={player.id}
                  onClick={() => handleVote(player.name)}
                  className="p-4 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg text-left transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-medium">{player.name}</span>
                    
                    {showTaskStatus && (
                      <span className={`text-sm ${player.completedTask ? 'text-green-400' : 'text-red-400'}`}>
                        {player.completedTask ? 'Tarefa Concluída' : 'Tarefa Pendente'}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </>
      ) : (
        <div className="mb-6 p-4 bg-green-900/30 rounded-lg text-center">
          <p className="text-green-300 font-bold mb-2">Voto registrado!</p>
          <p className="text-white">Você votou em: <span className="font-bold">{votedPlayer}</span></p>
          
          {!isChief && (
            <p className="mt-2 text-gray-400 text-sm">
              Aguarde o Chefe finalizar a votação.
            </p>
          )}
        </div>
      )}
      
      {isChief && voteRegistered && !votingFinalized && (
        <div className="mb-6">
          <div className="p-4 bg-yellow-900/30 rounded-lg mb-4">
            <p className="text-yellow-300 font-bold">Como Chefe, você pode finalizar a votação.</p>
            <p className="mt-1 text-sm text-gray-300">
              {allPlayersVoted 
                ? 'Todos os jogadores já votaram.' 
                : 'Nem todos os jogadores votaram ainda.'}
            </p>
          </div>
          
          <Button 
            onClick={handleFinalizeVoting} 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg"
          >
            Finalizar Votação
          </Button>
        </div>
      )}
      
      {votingFinalized && (
        <div className="text-center">
          <Button 
            onClick={handleGoToResult} 
            className="bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-3 rounded-lg"
          >
            Ver Resultado
          </Button>
        </div>
      )}
    </div>
  );
}


