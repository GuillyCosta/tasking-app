'use client';

import React, { useState } from 'react';
import { useGameContext } from '@/context/GameContext';
import { Button } from '@/components/ui/button';
import { PlayerRole } from '@/components/GameComponents';
import { PlayerSelector } from '@/components/GameComponents';

export function RevelacaoPapelScreen() {
  const { 
    players, 
    currentChief, 
    selectedPlayer, 
    setSelectedPlayer, 
    goToStep,
    currentRound,
    crownCardChanged
  } = useGameContext();
  
  const [showRole, setShowRole] = useState(false);
  const [roleViewed, setRoleViewed] = useState(false);
  
  // Selecionar jogador
  const handleSelectPlayer = (playerName) => {
    setSelectedPlayer(playerName);
    setShowRole(true);
    setRoleViewed(false);
  };
  
  // Marcar papel como visto
  const handleRoleViewed = () => {
    setRoleViewed(true);
    setShowRole(false);
  };
  
  // Verificar se o jogador selecionado é o Chefe
  const isChief = selectedPlayer === currentChief;
  
  // Encontrar o jogador selecionado
  const player = players.find(p => p.name === selectedPlayer);
  
  // Verificar se o jogador é um impostor
  const isImpostor = player?.isImpostor || false;
  
  return (
    <div className="max-w-3xl w-full bg-black/30 backdrop-blur-sm shadow-2xl border-yellow-500/30 rounded-lg p-6">
      {!selectedPlayer ? (
        <>
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-center text-yellow-400 mb-2">
              {currentRound === 1 ? 'Revelação de Papéis' : `Rodada ${currentRound}`}
            </h2>
            <p className="text-center text-gray-300">
              Cada jogador deve selecionar seu nome para ver seu papel
            </p>
            
            {currentRound > 1 && (
              <div className="mt-4 p-3 bg-yellow-900/30 rounded-lg text-center">
                <p className="text-yellow-300 font-bold">
                  O Chefe desta rodada é: <span className="text-white">{currentChief}</span>
                </p>
                
                {crownCardChanged && (
                  <p className="mt-2 text-red-300">
                    Atenção: A carta que esconde a Coroa foi alterada!
                  </p>
                )}
              </div>
            )}
          </div>
          
          <PlayerSelector 
            players={players.filter(p => !p.votedOut)} 
            onSelectPlayer={handleSelectPlayer} 
          />
        </>
      ) : showRole ? (
        <PlayerRole 
          playerName={selectedPlayer} 
          isImpostor={isImpostor} 
          isChief={isChief} 
          onRoleViewed={handleRoleViewed}
        />
      ) : (
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-6">Papel Visualizado</h3>
          
          {roleViewed && (
            <div className="mb-6 p-4 bg-green-900/30 rounded-lg">
              <p className="text-green-300">
                Você visualizou seu papel. Não compartilhe esta informação com outros jogadores!
              </p>
            </div>
          )}
          
          <div className="flex justify-center">
            <Button 
              onClick={() => {
                setSelectedPlayer('');
                // Se todos os jogadores já viram seus papéis, ir para a tela de rodada
                if (players.every(p => p.roleViewed)) {
                  goToStep('rodada');
                }
              }} 
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-lg"
            >
              Continuar
            </Button>
          </div>
        </div>
      )}
      
      {selectedPlayer && roleViewed && (
        <div className="mt-8 text-center">
          <Button 
            onClick={() => goToStep('rodada')} 
            className="bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-3 rounded-lg"
          >
            Iniciar Rodada
          </Button>
        </div>
      )}
    </div>
  );
}


