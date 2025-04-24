'use client';

import React, { useState } from 'react';
import { useGameContext } from '@/context/GameContext';
import { Button } from '@/components/ui/button';

export function JogadoresScreen() {
  const { 
    players, 
    gameConfig, 
    addPlayer, 
    removePlayer, 
    initializeGame, 
    goToStep 
  } = useGameContext();
  
  const [newPlayerName, setNewPlayerName] = useState('');
  const [error, setError] = useState('');
  
  // Adicionar novo jogador
  const handleAddPlayer = (e) => {
    e.preventDefault();
    
    if (!newPlayerName.trim()) {
      setError('Digite um nome para o jogador');
      return;
    }
    
    const success = addPlayer(newPlayerName.trim());
    
    if (success) {
      setNewPlayerName('');
      setError('');
    } else {
      setError('Não foi possível adicionar o jogador. Verifique se o nome já existe ou se o limite foi atingido.');
    }
  };
  
  // Remover jogador
  const handleRemovePlayer = (id) => {
    removePlayer(id);
  };
  
  // Iniciar o jogo
  const handleStartGame = () => {
    if (players.length < 4) {
      setError('É necessário pelo menos 4 jogadores para iniciar o jogo');
      return;
    }
    
    if (players.length < gameConfig.numJogadores) {
      setError(`Você configurou o jogo para ${gameConfig.numJogadores} jogadores. Adicione mais jogadores ou volte para a configuração.`);
      return;
    }
    
    // Inicializar o jogo
    initializeGame();
  };
  
  return (
    <div className="max-w-3xl w-full bg-black/30 backdrop-blur-sm shadow-2xl border-yellow-500/30 rounded-lg p-6">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-center text-yellow-400 mb-2">Adicionar Jogadores</h2>
        <p className="text-center text-gray-300">
          Adicione os nomes de todos os jogadores participantes
        </p>
      </div>
      
      {/* Formulário para adicionar jogador */}
      <form onSubmit={handleAddPlayer} className="mb-6">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newPlayerName}
            onChange={(e) => setNewPlayerName(e.target.value)}
            placeholder="Nome do jogador"
            className="flex-1 p-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
          />
          <Button 
            type="submit" 
            className="bg-green-600 hover:bg-green-700 text-white font-bold px-4 py-2 rounded-lg"
            disabled={players.length >= gameConfig.numJogadores}
          >
            Adicionar
          </Button>
        </div>
        
        {error && (
          <p className="mt-2 text-red-400">{error}</p>
        )}
        
        <p className="mt-2 text-gray-400">
          {players.length}/{gameConfig.numJogadores} jogadores adicionados
        </p>
      </form>
      
      {/* Lista de jogadores */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-3">Jogadores:</h3>
        
        {players.length > 0 ? (
          <div className="space-y-2">
            {players.map(player => (
              <div 
                key={player.id} 
                className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg"
              >
                <span className="text-lg">{player.name}</span>
                <Button 
                  onClick={() => handleRemovePlayer(player.id)} 
                  className="bg-red-600 hover:bg-red-700 text-white font-bold px-3 py-1 rounded-lg text-sm"
                >
                  Remover
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400">Nenhum jogador adicionado</p>
        )}
      </div>
      
      <div className="flex justify-between">
        <Button 
          onClick={() => goToStep('configuracao')} 
          className="bg-gray-600 hover:bg-gray-700 text-white font-bold px-4 py-2 rounded-lg"
        >
          Voltar
        </Button>
        
        <Button 
          onClick={handleStartGame} 
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2 rounded-lg"
          disabled={players.length < 4 || players.length < gameConfig.numJogadores}
        >
          Iniciar o Jogo
        </Button>
      </div>
    </div>
  );
}


