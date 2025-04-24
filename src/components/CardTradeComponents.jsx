'use client';

import React, { useState } from 'react';
import { useGameContext } from '@/context/GameContext';
import { Button } from '@/components/ui/button';
import { Card, PlayerCard } from '@/components/CardComponents';

// Componente para o sistema de troca de cartas
export function CardTradeSystem({ players, rooms, currentPlayer }) {
  const { 
    takeCardFromRoom, 
    leaveCardInRoom, 
    tradeCardsBetweenPlayers 
  } = useGameContext();
  
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [actionResult, setActionResult] = useState(null);
  
  // Encontrar o jogador atual
  const player = players.find(p => p.name === currentPlayer);
  
  // Pegar uma carta de um cômodo
  const handleTakeCard = (roomId, cardId) => {
    const result = takeCardFromRoom(roomId, cardId, currentPlayer);
    setActionResult(result);
    
    if (result.success) {
      setTimeout(() => {
        setActionResult(null);
      }, 3000);
    }
  };
  
  // Deixar uma carta em um cômodo
  const handleLeaveCard = (roomId) => {
    const result = leaveCardInRoom(roomId, currentPlayer);
    setActionResult(result);
    
    if (result.success) {
      setTimeout(() => {
        setActionResult(null);
      }, 3000);
    }
  };
  
  // Trocar cartas com outro jogador
  const handleTradeCards = (otherPlayerName) => {
    const result = tradeCardsBetweenPlayers(currentPlayer, otherPlayerName);
    setActionResult(result);
    
    if (result.success) {
      setTimeout(() => {
        setActionResult(null);
      }, 3000);
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Carta atual do jogador */}
      <div className="p-4 bg-gray-800/50 rounded-lg">
        <h3 className="font-semibold text-lg mb-3">Sua Carta Atual:</h3>
        <div className="flex justify-center">
          <PlayerCard player={player} />
        </div>
      </div>
      
      {/* Resultado da ação */}
      {actionResult && (
        <div className={`p-4 ${actionResult.success ? 'bg-green-900/30' : 'bg-red-900/30'} rounded-lg text-center`}>
          <p className={`font-bold ${actionResult.success ? 'text-green-300' : 'text-red-300'}`}>
            {actionResult.success 
              ? 'Ação realizada com sucesso!' 
              : `Erro: ${actionResult.error}`}
          </p>
        </div>
      )}
      
      {/* Seleção de cômodo */}
      {!selectedRoom && !selectedPlayer && (
        <div>
          <h3 className="font-semibold text-lg mb-3">Escolha uma ação:</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => setSelectedRoom('rooms')}
              className="p-4 bg-blue-900/30 hover:bg-blue-800/40 rounded-lg text-center transition-colors"
            >
              <span className="text-lg font-medium">Interagir com Cômodos</span>
              <p className="text-sm text-gray-400 mt-1">
                Pegar ou deixar cartas em cômodos
              </p>
            </button>
            
            <button
              onClick={() => setSelectedPlayer('players')}
              className="p-4 bg-purple-900/30 hover:bg-purple-800/40 rounded-lg text-center transition-colors"
            >
              <span className="text-lg font-medium">Trocar com Jogadores</span>
              <p className="text-sm text-gray-400 mt-1">
                Trocar cartas com outros jogadores
              </p>
            </button>
          </div>
        </div>
      )}
      
      {/* Lista de cômodos */}
      {selectedRoom === 'rooms' && (
        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-lg">Cômodos:</h3>
            <Button 
              onClick={() => setSelectedRoom(null)} 
              className="text-sm bg-gray-600 hover:bg-gray-700"
            >
              Voltar
            </Button>
          </div>
          
          <div className="space-y-4">
            {rooms.map(room => (
              <div key={room.id} className="p-4 bg-gray-800/50 rounded-lg">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-medium">{room.name}</h4>
                    <p className="text-sm text-gray-300">Responsável: {room.responsible}</p>
                  </div>
                  
                  {player.card && (
                    <Button 
                      onClick={() => handleLeaveCard(room.id)} 
                      className="text-sm bg-yellow-600 hover:bg-yellow-700"
                      disabled={!player.card}
                    >
                      Deixar Carta
                    </Button>
                  )}
                </div>
                
                {room.cards.length > 0 ? (
                  <div>
                    <h5 className="text-sm font-medium mb-2">Cartas disponíveis:</h5>
                    <div className="flex flex-wrap gap-2">
                      {room.cards.map(card => (
                        <Card 
                          key={card.id} 
                          card={card} 
                          isSelectable={!player.card}
                          onClick={() => !player.card && handleTakeCard(room.id, card.id)} 
                        />
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-400">Nenhuma carta disponível</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Lista de jogadores */}
      {selectedPlayer === 'players' && (
        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-lg">Jogadores:</h3>
            <Button 
              onClick={() => setSelectedPlayer(null)} 
              className="text-sm bg-gray-600 hover:bg-gray-700"
            >
              Voltar
            </Button>
          </div>
          
          <div className="space-y-4">
            {players
              .filter(p => p.name !== currentPlayer && !p.votedOut)
              .map(p => (
                <div key={p.id} className="p-4 bg-gray-800/50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">{p.name}</h4>
                      <p className="text-sm text-gray-300">
                        {p.card ? 'Tem uma carta' : 'Não tem carta'}
                      </p>
                    </div>
                    
                    <Button 
                      onClick={() => handleTradeCards(p.name)} 
                      className="text-sm bg-purple-600 hover:bg-purple-700"
                      disabled={!player.card && !p.card}
                    >
                      Trocar Cartas
                    </Button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}


