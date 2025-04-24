'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

// Componente para exibir uma carta
export function Card({ card, onClick, isSelectable = false }) {
  // Definir cores de fundo com base na cor da carta
  const getBgColor = () => {
    switch (card.color) {
      case 'vermelho': return 'bg-red-600';
      case 'azul': return 'bg-blue-600';
      case 'verde': return 'bg-green-600';
      case 'amarelo': return 'bg-yellow-500';
      case 'preto': return 'bg-gray-800';
      default: return 'bg-gray-600';
    }
  };
  
  return (
    <div 
      className={`${getBgColor()} ${isSelectable ? 'cursor-pointer hover:ring-2 hover:ring-white' : ''} 
        w-16 h-24 rounded-lg flex flex-col items-center justify-center shadow-md`}
      onClick={isSelectable ? onClick : undefined}
    >
      {card.symbol === 'número' ? (
        <span className="text-3xl font-bold text-white">{card.number}</span>
      ) : (
        <div className="text-center">
          <span className="text-sm font-bold text-white uppercase">{card.symbol}</span>
        </div>
      )}
      <div className="mt-2 text-xs text-white text-center px-1">
        {card.description}
      </div>
    </div>
  );
}

// Componente para exibir um monte de cartas
export function CardDeck({ cards, onSelectCard }) {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {cards.map(card => (
        <Card 
          key={card.id} 
          card={card} 
          onClick={() => onSelectCard(card.id)}
          isSelectable={!!onSelectCard}
        />
      ))}
      
      {cards.length === 0 && (
        <div className="text-center p-4 bg-gray-800/50 rounded-lg w-full">
          <p className="text-gray-400">Nenhuma carta disponível</p>
        </div>
      )}
    </div>
  );
}

// Componente para o sistema de tarefas baseado em cartas
export function CardTaskSystem({ tasks, rooms, currentPlayer, onCompleteTask }) {
  // Encontrar o cômodo do jogador atual
  const playerRoom = rooms?.find(room => room.responsible === currentPlayer);
  
  // Encontrar a tarefa do jogador atual
  const playerTask = tasks?.find(task => task.responsible === currentPlayer && !task.isCommon);
  
  // Estado para controlar a visualização de detalhes da tarefa
  const [showTaskDetails, setShowTaskDetails] = useState(false);
  
  if (!playerRoom || !playerTask) {
    return (
      <div className="text-center p-4 bg-gray-800/50 rounded-lg">
        <p className="text-gray-400">Informações do jogador não disponíveis</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="p-4 bg-gray-800/50 rounded-lg">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg">{playerRoom.name}</h3>
            <p className="text-sm text-gray-300">Seu cômodo</p>
          </div>
          
          <Button
            onClick={() => setShowTaskDetails(!showTaskDetails)}
            className="text-sm bg-yellow-600 hover:bg-yellow-700"
          >
            {showTaskDetails ? 'Ocultar Detalhes' : 'Ver Detalhes da Tarefa'}
          </Button>
        </div>
        
        {showTaskDetails && (
          <div className="mt-4 p-3 bg-yellow-900/30 rounded-lg">
            <h4 className="font-medium mb-2">Sua Tarefa:</h4>
            <p>{playerTask.task?.description}</p>
            
            <div className="mt-4">
              <h4 className="font-medium mb-2">Cartas Disponíveis:</h4>
              <CardDeck cards={playerRoom.cards} />
            </div>
            
            <div className="mt-4 flex justify-end">
              <Button
                onClick={() => onCompleteTask(playerTask.id, !playerTask.completed)}
                className={`${playerTask.completed ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
              >
                {playerTask.completed ? 'Marcar como Incompleta' : 'Marcar como Concluída'}
              </Button>
            </div>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rooms
          .filter(room => room.id !== playerRoom.id && !room.isCommon)
          .map(room => (
            <div key={room.id} className="p-4 bg-gray-800/50 rounded-lg">
              <h3 className="font-semibold text-lg">{room.name}</h3>
              <p className="text-sm text-gray-300">Responsável: {room.responsible}</p>
              
              <div className="mt-3">
                <h4 className="text-sm font-medium mb-2">Cartas ({room.cards.length}):</h4>
                {room.cards.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {room.cards.slice(0, 3).map(card => (
                      <Card key={card.id} card={card} />
                    ))}
                    {room.cards.length > 3 && (
                      <div className="w-16 h-24 bg-gray-700 rounded-lg flex items-center justify-center">
                        <span className="text-sm text-gray-300">+{room.cards.length - 3}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400">Nenhuma carta disponível</p>
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

// Componente para exibir a carta que um jogador está carregando
export function PlayerCard({ player }) {
  if (!player || !player.card) {
    return (
      <div className="text-center p-3 bg-gray-800/50 rounded-lg">
        <p className="text-sm text-gray-400">Nenhuma carta</p>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col items-center">
      <Card card={player.card} />
      <p className="mt-2 text-sm text-gray-300">Carta atual</p>
    </div>
  );
}


