'use client';

import React from 'react';
import { useGameContext } from '@/context/GameContext';
import { Button } from '@/components/ui/button';

export function RegrasScreen() {
  const { goToStep } = useGameContext();
  
  return (
    <div className="max-w-4xl w-full bg-black/30 backdrop-blur-sm shadow-2xl border-yellow-500/30 rounded-lg p-6">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-center text-yellow-400 mb-2">Regras do Jogo</h2>
        <p className="text-center text-gray-300">
          Aprenda como jogar TasKing
        </p>
      </div>
      
      <div className="space-y-6 mb-8">
        <section>
          <h3 className="text-2xl font-semibold text-yellow-300 mb-3">Objetivo do Jogo</h3>
          <p>
            Em TasKing, os jogadores trabalham juntos para encontrar a Coroa perdida enquanto tentam 
            identificar os Impostores entre eles. Complete tarefas, troque informações e vote para 
            expulsar os suspeitos!
          </p>
        </section>
        
        <section>
          <h3 className="text-2xl font-semibold text-yellow-300 mb-3">Papéis</h3>
          <div className="space-y-3">
            <div>
              <h4 className="text-xl font-medium text-green-400">Leais</h4>
              <p>
                A maioria dos jogadores são Leais. Seu objetivo é encontrar a Coroa e identificar os Impostores.
                Completem suas tarefas e compartilhem informações para vencer.
              </p>
            </div>
            
            <div>
              <h4 className="text-xl font-medium text-red-400">Impostores</h4>
              <p>
                1-3 jogadores são Impostores (dependendo do número total de jogadores). Seu objetivo é
                sabotar o jogo e evitar que os Leais encontrem a Coroa. Finjam ser leais enquanto
                atrapalham secretamente o progresso do grupo.
              </p>
            </div>
          </div>
        </section>
        
        <section>
          <h3 className="text-2xl font-semibold text-yellow-300 mb-3">Rodadas</h3>
          <p>
            O jogo é dividido em rodadas. Em cada rodada:
          </p>
          <ol className="list-decimal pl-6 space-y-2 mt-2">
            <li>Um jogador é escolhido como Chefe da rodada.</li>
            <li>Cada jogador é responsável por um cômodo e recebe uma tarefa.</li>
            <li>O Chefe recebe uma dica sobre a localização da Coroa.</li>
            <li>Os jogadores têm um tempo limitado para completar suas tarefas.</li>
            <li>Após o tempo acabar, todos votam para eliminar um jogador suspeito.</li>
            <li>O jogador mais votado é eliminado (em caso de empate, ninguém é eliminado).</li>
            <li>Uma nova rodada começa com um novo Chefe.</li>
          </ol>
        </section>
        
        <section>
          <h3 className="text-2xl font-semibold text-yellow-300 mb-3">Tarefas e Cartas</h3>
          <p>
            As tarefas são baseadas em cartas do jogo Uno ou similares:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>Cada cômodo possui um monte de cartas.</li>
            <li>As tarefas envolvem combinações específicas de cartas (sequências numéricas, cores, símbolos).</li>
            <li>A Coroa está escondida em uma das cartas.</li>
            <li>Os jogadores podem trocar cartas entre si quando estiverem nos cômodos.</li>
            <li>Apenas dois jogadores podem estar em um cômodo ao mesmo tempo.</li>
          </ul>
        </section>
        
        <section>
          <h3 className="text-2xl font-semibold text-yellow-300 mb-3">O Chefe</h3>
          <p>
            O Chefe tem responsabilidades e poderes especiais:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>Recebe uma dica sobre a localização da Coroa.</li>
            <li>Verifica e marca as tarefas concluídas pelos jogadores.</li>
            <li>Finaliza a votação ao final da rodada.</li>
            <li>Se for um Impostor, pode usar a habilidade "Hackear App" para sabotar o jogo.</li>
          </ul>
        </section>
        
        <section>
          <h3 className="text-2xl font-semibold text-yellow-300 mb-3">Encontrando a Coroa</h3>
          <p>
            Quando um jogador acredita ter encontrado a carta que esconde a Coroa:
          </p>
          <ol className="list-decimal pl-6 space-y-2 mt-2">
            <li>Deve declarar que encontrou a Coroa e descrever a carta.</li>
            <li>Se estiver correto, pode escolher entre:</li>
            <ul className="list-disc pl-6 mt-1">
              <li>Contar para a Equipe (vitória coletiva)</li>
              <li>Coroar-se Rei (vitória individual)</li>
            </ul>
          </ol>
        </section>
        
        <section>
          <h3 className="text-2xl font-semibold text-yellow-300 mb-3">Fim do Jogo</h3>
          <p>
            O jogo termina quando:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>A Coroa é encontrada e o jogador escolhe compartilhar com sua equipe ou coroar-se Rei.</li>
            <li>Todos os Impostores são eliminados (vitória dos Leais).</li>
            <li>Restam apenas Impostores (vitória dos Impostores).</li>
          </ul>
        </section>
      </div>
      
      <div className="text-center">
        <Button 
          onClick={() => goToStep('inicio')} 
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-lg"
        >
          Voltar ao Início
        </Button>
      </div>
    </div>
  );
}


