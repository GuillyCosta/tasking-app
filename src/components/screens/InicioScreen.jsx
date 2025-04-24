'use client';

import React from 'react';
import { useGameContext } from '@/context/GameContext';
import { Button } from '@/components/ui/button';

export function InicioScreen() {
  const { goToStep } = useGameContext();
  
  return (
    <div className="max-w-3xl w-full bg-black/30 backdrop-blur-sm shadow-2xl border-yellow-500/30 rounded-lg p-6">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-yellow-400 mb-4">Bem-vindo ao TasKing!</h2>
        <p className="text-lg text-gray-300">
          Um jogo de estratégia, dedução e trabalho em equipe.
        </p>
      </div>
      
      <div className="mb-8 space-y-4">
        <p>
          Em TasKing, os jogadores trabalham juntos para encontrar a Coroa perdida enquanto tentam 
          identificar os Impostores entre eles. Complete tarefas, troque informações e vote para 
          expulsar os suspeitos!
        </p>
        
        <p>
          Cada rodada, um jogador diferente será escolhido como Chefe, responsável por coordenar 
          as atividades e verificar as tarefas concluídas. Mas cuidado: o Chefe pode ser um Impostor!
        </p>
        
        <p>
          Encontre a Coroa antes que os Impostores sabotem o jogo e levem a Coroa para si.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-gray-800/50 p-4 rounded-lg">
          <h3 className="text-xl font-semibold text-yellow-300 mb-2">Leais</h3>
          <p className="text-sm">
            Trabalhem juntos para encontrar a Coroa e identificar os Impostores. 
            Completem suas tarefas e compartilhem informações para vencer.
          </p>
        </div>
        
        <div className="bg-gray-800/50 p-4 rounded-lg">
          <h3 className="text-xl font-semibold text-yellow-300 mb-2">Impostores</h3>
          <p className="text-sm">
            Finjam ser leais enquanto sabotam secretamente o jogo. 
            Usem suas habilidades especiais quando forem o Chefe para confundir os outros jogadores.
          </p>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
        <Button 
          onClick={() => goToStep('configuracao')} 
          className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg text-lg"
        >
          Iniciar Novo Jogo
        </Button>
        
        <Button 
          onClick={() => goToStep('regras')} 
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg text-lg"
        >
          Ver Regras
        </Button>
      </div>
    </div>
  );
}


