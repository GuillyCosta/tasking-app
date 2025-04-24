'use client';

import React, { useState } from 'react';
import { useGameContext } from '@/context/GameContext';
import { Button } from '@/components/ui/button';

export function ConfiguracaoScreen() {
  const { 
    gameConfig, 
    setGameConfig, 
    goToStep 
  } = useGameContext();
  
  const [numJogadores, setNumJogadores] = useState(gameConfig.numJogadores);
  const [timerMinutes, setTimerMinutes] = useState(Math.floor(gameConfig.timerDuration / 60));
  const [numImpostores, setNumImpostores] = useState(gameConfig.numImpostores);
  const [numComodos, setNumComodos] = useState(gameConfig.numComodos);
  const [tipoBaralho, setTipoBaralho] = useState(gameConfig.tipoBaralho || 'uno');
  const [showImpostorReveal, setShowImpostorReveal] = useState(gameConfig.showImpostorReveal);
  const [cartaCoroaNivel, setCartaCoroaNivel] = useState(gameConfig.cartaCoroaNivel || 'padrao');
  const [votacaoNivel, setVotacaoNivel] = useState(gameConfig.votacaoNivel || 'visiveis');
  
  // Validar e salvar configurações
  const handleSaveConfig = () => {
    // Calcular duração total do timer em segundos
    const timerDuration = timerMinutes * 60;
    
    // Validar número de impostores (não pode ser maior que metade dos jogadores)
    const validNumImpostores = Math.min(numImpostores, Math.floor(numJogadores / 2));
    
    // Atualizar configuração no contexto
    setGameConfig({
      numJogadores,
      timerDuration,
      numImpostores: validNumImpostores,
      numComodos,
      tipoBaralho,
      showImpostorReveal,
      cartaCoroaNivel,
      votacaoNivel
    });
    
    // Avançar para a tela de jogadores
    goToStep('jogadores');
  };
  
  return (
    <div className="max-w-3xl w-full bg-black/30 backdrop-blur-sm shadow-2xl border-yellow-500/30 rounded-lg p-6">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-center text-yellow-400 mb-2">Configuração do Jogo</h2>
        <p className="text-center text-gray-300">
          Defina os parâmetros para esta partida
        </p>
      </div>
      
      <div className="space-y-6">
        {/* Número de Jogadores */}
        <div>
          <label className="block text-lg font-medium mb-2">Número de Jogadores:</label>
          <div className="flex items-center">
            <input
              type="range"
              min="4"
              max="10"
              value={numJogadores}
              onChange={(e) => setNumJogadores(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
            <span className="ml-4 text-xl font-bold min-w-[2rem] text-center">{numJogadores}</span>
          </div>
        </div>
        
        {/* Timer (apenas minutos) */}
        <div>
          <label className="block text-lg font-medium mb-2">Duração do Timer:</label>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              min="1"
              max="10"
              value={timerMinutes}
              onChange={(e) => setTimerMinutes(parseInt(e.target.value))}
              className="w-20 p-2 bg-gray-800 border border-gray-700 rounded-lg text-center"
            />
            <span>minutos</span>
          </div>
        </div>
        
        {/* Tipo de Baralho */}
        <div>
          <label className="block text-lg font-medium mb-2">Tipo de Baralho:</label>
          <div className="flex flex-col space-y-2">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="tipoBaralho"
                value="uno"
                checked={tipoBaralho === 'uno'}
                onChange={() => setTipoBaralho('uno')}
                className="h-5 w-5 rounded border-gray-300"
              />
              <span className="text-lg">Uno (padrão)</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="tipoBaralho"
                value="baralho_comum"
                checked={tipoBaralho === 'baralho_comum'}
                onChange={() => setTipoBaralho('baralho_comum')}
                className="h-5 w-5 rounded border-gray-300"
              />
              <span className="text-lg">Baralho Comum</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="tipoBaralho"
                value="outro"
                checked={tipoBaralho === 'outro'}
                onChange={() => setTipoBaralho('outro')}
                className="h-5 w-5 rounded border-gray-300"
              />
              <span className="text-lg">Outro</span>
            </label>
          </div>
        </div>
        
        {/* Carta Coroa: Nível */}
        <div>
          <label className="block text-lg font-medium mb-2">Carta Coroa: Nível</label>
          <div className="flex flex-col space-y-2">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="cartaCoroaNivel"
                value="padrao"
                checked={cartaCoroaNivel === 'padrao'}
                onChange={() => setCartaCoroaNivel('padrao')}
                className="h-5 w-5 rounded border-gray-300"
              />
              <span className="text-lg">Padrão: 1 Carta Coroa por jogo</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="cartaCoroaNivel"
                value="medio"
                checked={cartaCoroaNivel === 'medio'}
                onChange={() => setCartaCoroaNivel('medio')}
                className="h-5 w-5 rounded border-gray-300"
              />
              <span className="text-lg">Médio: 1 Carta Coroa a cada 10 rodadas</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="cartaCoroaNivel"
                value="dificil"
                checked={cartaCoroaNivel === 'dificil'}
                onChange={() => setCartaCoroaNivel('dificil')}
                className="h-5 w-5 rounded border-gray-300"
              />
              <span className="text-lg">Difícil: 1 Carta Coroa a cada 5 rodadas</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="cartaCoroaNivel"
                value="cataclisma"
                checked={cartaCoroaNivel === 'cataclisma'}
                onChange={() => setCartaCoroaNivel('cataclisma')}
                className="h-5 w-5 rounded border-gray-300"
              />
              <span className="text-lg">Cataclisma: Carta Coroa é alterada aleatoriamente pelo App</span>
            </label>
          </div>
        </div>
        
        {/* Votação: Nível */}
        <div>
          <label className="block text-lg font-medium mb-2">Votação: Nível</label>
          <div className="flex flex-col space-y-2">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="votacaoNivel"
                value="visiveis"
                checked={votacaoNivel === 'visiveis'}
                onChange={() => setVotacaoNivel('visiveis')}
                className="h-5 w-5 rounded border-gray-300"
              />
              <span className="text-lg">Padrão: tarefas visíveis</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="votacaoNivel"
                value="ocultas"
                checked={votacaoNivel === 'ocultas'}
                onChange={() => setVotacaoNivel('ocultas')}
                className="h-5 w-5 rounded border-gray-300"
              />
              <span className="text-lg">Padrão: tarefas ocultas</span>
            </label>
          </div>
        </div>
        
        {/* Número de Impostores */}
        <div>
          <label className="block text-lg font-medium mb-2">Número de Impostores:</label>
          <div className="flex items-center">
            <input
              type="range"
              min="1"
              max={Math.floor(numJogadores / 2)}
              value={numImpostores}
              onChange={(e) => setNumImpostores(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
            <span className="ml-4 text-xl font-bold min-w-[2rem] text-center">{numImpostores}</span>
          </div>
        </div>
        
        {/* Número de Cômodos */}
        <div>
          <label className="block text-lg font-medium mb-2">Número de Cômodos:</label>
          <div className="flex items-center">
            <input
              type="range"
              min="3"
              max="10"
              value={numComodos}
              onChange={(e) => setNumComodos(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
            <span className="ml-4 text-xl font-bold min-w-[2rem] text-center">{numComodos}</span>
          </div>
        </div>
        
        {/* Mostrar Revelação de Impostor */}
        <div>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showImpostorReveal}
              onChange={(e) => setShowImpostorReveal(e.target.checked)}
              className="h-5 w-5 rounded border-gray-300"
            />
            <span className="text-lg">Mostrar se o jogador eliminado era um Impostor</span>
          </label>
        </div>
      </div>
      
      <div className="mt-8 text-center">
        <Button 
          onClick={handleSaveConfig} 
          className="bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-3 rounded-lg text-lg"
        >
          Iniciar o Jogo
        </Button>
      </div>
    </div>
  );
}


