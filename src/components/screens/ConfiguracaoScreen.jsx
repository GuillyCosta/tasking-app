'use client';

import React, { useState } from 'react';
import { useGameContext } from '@/context/GameContext';
import { Button } from '@/components/ui/button'; // Assumindo que você tem um componente Button estilizado

export function ConfiguracaoScreen() {
  const { 
    gameConfig, 
    setGameConfig, 
    goToStep 
  } = useGameContext();
  
  // Estados locais para os campos do formulário, inicializados com os valores do contexto (se existirem)
  const [numJogadores, setNumJogadores] = useState(gameConfig.numJogadores);
  const [timerMinutes, setTimerMinutes] = useState(Math.floor(gameConfig.timerDuration / 60));
  const [numImpostores, setNumImpostores] = useState(gameConfig.numImpostores); // Será validado/ajustado
  const [numComodos, setNumComodos] = useState(gameConfig.numComodos);
  const [tipoBaralho, setTipoBaralho] = useState(gameConfig.tipoBaralho || 'uno');
  const [showImpostorReveal, setShowImpostorReveal] = useState(gameConfig.showImpostorReveal);
  const [cartaCoroaNivel, setCartaCoroaNivel] = useState(gameConfig.cartaCoroaNivel || 'padrao');
  const [votacaoNivel, setVotacaoNivel] = useState(gameConfig.votacaoNivel || 'visiveis');
  
  // Estado para feedback de carregamento/erro
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Validar e salvar configurações
  const handleSaveConfig = async () => { // Tornamos a função assíncrona
    setIsLoading(true);
    setError(null);

    // Calcular duração total do timer em segundos
    const timerDuration = timerMinutes * 60;
    
    // Os dados que serão enviados para o backend
    const configDataToSend = {
      numJogadores,
      timerDuration,
      // O número de impostores será definido pelo backend com base nas regras.
      // O frontend pode enviar a sugestão do usuário, mas o backend decide.
      // Por ora, vamos enviar o valor selecionado, mas o backend deve ser a autoridade final
      // conforme as regras: "1 a 7 Jogadores: 1 Impostor", etc.
      // No momento, o backend não usa este valor diretamente para definir, mas pode ser útil para o log.
      numImpostoresSelecionadoPeloUsuario: numImpostores, 
      numComodos,
      tipoBaralho,
      showImpostorReveal,
      cartaCoroaNivel,
      votacaoNivel
    };

    try {
      const response = await fetch('http://localhost:3001/api/game/setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(configDataToSend),
      });

      if (!response.ok) {
        // Se o backend retornar um erro (status 4xx ou 5xx)
        const errorData = await response.json();
        throw new Error(errorData.message || `Erro do servidor: ${response.status}`);
      }

      const result = await response.json();
      console.log('Resposta do backend (setup):', result);

      // Atualizar configuração no contexto com os dados enviados (ou retornados pelo backend, se for o caso)
      // Se o backend retornar o estado do jogo inicializado, poderíamos usar 'result.gameData' por exemplo.
      // Por enquanto, vamos usar os dados que o frontend já tem, pois o backend ainda não retorna um estado completo.
      setGameConfig({
        ...gameConfig, // Mantém outras configurações que não foram enviadas
        numJogadores,
        timerDuration,
        numImpostores: result.data?.numImpostoresDefinidoPeloBackend || numImpostores, // Idealmente, o backend retorna o número real de impostores
        numComodos,
        tipoBaralho,
        showImpostorReveal,
        cartaCoroaNivel,
        votacaoNivel,
        // Poderíamos adicionar aqui o ID do jogo retornado pelo backend, se aplicável
        // gameId: result.gameId 
      });
      
      // Avançar para a tela de jogadores
      goToStep('jogadores');

    } catch (err: any) {
      console.error('Falha ao salvar configuração:', err);
      setError(err.message || 'Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="max-w-3xl w-full bg-black/30 backdrop-blur-sm shadow-2xl border-yellow-500/30 rounded-lg p-6">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-center text-yellow-400 mb-2">Configuração do Jogo</h2>
        <p className="text-center text-gray-300">
          Defina os parâmetros para esta partida
        </p>
      </div>
      
      {error && (
        <div className="mb-4 p-3 bg-red-500/30 border border-red-700 text-red-200 rounded-md">
          <p><strong>Erro:</strong> {error}</p>
        </div>
      )}

      <div className="space-y-6">
        {/* Número de Jogadores */}
        <div>
          <label htmlFor="numJogadores" className="block text-lg font-medium mb-2">Número de Jogadores:</label>
          <div className="flex items-center">
            <input
              id="numJogadores"
              type="range"
              min="4" // Ajuste conforme suas regras (ex: mínimo para ter impostor)
              max="21" // Ajuste conforme suas regras (ex: máximo para 3 impostores)
              value={numJogadores}
              onChange={(e) => setNumJogadores(parseInt(e.target.value))}
              disabled={isLoading}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer disabled:opacity-50"
            />
            <span className="ml-4 text-xl font-bold min-w-[2rem] text-center">{numJogadores}</span>
          </div>
        </div>
        
        {/* Timer (apenas minutos) */}
        <div>
          <label htmlFor="timerMinutes" className="block text-lg font-medium mb-2">Duração do Timer:</label>
          <div className="flex items-center space-x-2">
            <input
              id="timerMinutes"
              type="number"
              min="1"
              max="10" // Pode ajustar
              value={timerMinutes}
              onChange={(e) => setTimerMinutes(parseInt(e.target.value))}
              disabled={isLoading}
              className="w-20 p-2 bg-gray-800 border border-gray-700 rounded-lg text-center disabled:opacity-50"
            />
            <span>minutos</span>
          </div>
        </div>
        
        {/* Tipo de Baralho */}
        <div>
          <label className="block text-lg font-medium mb-2">Tipo de Baralho:</label>
          <div className="flex flex-col space-y-2">
            {/* ... (opções de radio para tipoBaralho, adicione disabled={isLoading}) ... */}
            <label className="flex items-center space-x-2 cursor-pointer">
              <input type="radio" name="tipoBaralho" value="uno" checked={tipoBaralho === 'uno'} onChange={() => setTipoBaralho('uno')} className="h-5 w-5 rounded border-gray-300" disabled={isLoading} />
              <span className="text-lg">Uno (padrão)</span>
            </label>
            {/* Outros radios */}
          </div>
        </div>
        
        {/* Carta Coroa: Nível */}
        <div>
          <label className="block text-lg font-medium mb-2">Carta Coroa: Nível</label>
          <div className="flex flex-col space-y-2">
            {/* ... (opções de radio para cartaCoroaNivel, adicione disabled={isLoading}) ... */}
            <label className="flex items-center space-x-2 cursor-pointer">
              <input type="radio" name="cartaCoroaNivel" value="padrao" checked={cartaCoroaNivel === 'padrao'} onChange={() => setCartaCoroaNivel('padrao')} className="h-5 w-5 rounded border-gray-300" disabled={isLoading}/>
              <span className="text-lg">Padrão: 1 Carta Coroa por jogo</span>
            </label>
             {/* Outros radios */}
          </div>
        </div>
        
        {/* Votação: Nível */}
        <div>
          <label className="block text-lg font-medium mb-2">Votação: Nível</label>
          <div className="flex flex-col space-y-2">
            {/* ... (opções de radio para votacaoNivel, adicione disabled={isLoading}) ... */}
            <label className="flex items-center space-x-2 cursor-pointer">
                <input type="radio" name="votacaoNivel" value="visiveis" checked={votacaoNivel === 'visiveis'} onChange={() => setVotacaoNivel('visiveis')} className="h-5 w-5 rounded border-gray-300" disabled={isLoading}/>
                <span className="text-lg">Padrão: tarefas visíveis</span>
            </label>
            {/* Outros radios */}
          </div>
        </div>
        
        {/* Número de Impostores (SUGESTÃO DO USUÁRIO) */}
        {/* A lógica final de quantos impostores existirão deve ser do backend, baseada nas regras.
            O frontend pode ter um slider, mas o backend tem a palavra final.
            Vamos manter o slider por enquanto, mas o backend precisa calcular o número correto de impostores
            com base no `numJogadores` e nas regras que você definiu.
        */}
        <div>
          <label htmlFor="numImpostores" className="block text-lg font-medium mb-2">Número de Impostores (Sugestão):</label>
          <div className="flex items-center">
            <input
              id="numImpostores"
              type="range"
              min="1"
              // O max aqui pode ser uma sugestão, mas o backend vai impor o limite real
              max={Math.max(1, Math.floor(numJogadores / 2))} // Garante que max seja pelo menos 1
              value={numImpostores}
              onChange={(e) => setNumImpostores(parseInt(e.target.value))}
              disabled={isLoading}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer disabled:opacity-50"
            />
            <span className="ml-4 text-xl font-bold min-w-[2rem] text-center">{numImpostores}</span>
          </div>
        </div>
        
        {/* Número de Cômodos */}
        <div>
          <label htmlFor="numComodos" className="block text-lg font-medium mb-2">Número de Cômodos:</label>
          <div className="flex items-center">
            <input
              id="numComodos"
              type="range"
              min="2" // Pelo menos 1 cômodo + 1 Área Comum? Ou o total de locais?
              max="10" // Ajuste conforme necessário
              value={numComodos}
              onChange={(e) => setNumComodos(parseInt(e.target.value))}
              disabled={isLoading}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer disabled:opacity-50"
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
              disabled={isLoading}
              className="h-5 w-5 rounded border-gray-300 disabled:opacity-50"
            />
            <span className="text-lg">Mostrar se o jogador eliminado era um Impostor</span>
          </label>
        </div>
      </div>
      
      <div className="mt-8 text-center">
        <Button 
          onClick={handleSaveConfig} 
          disabled={isLoading} // Desabilita o botão durante o carregamento
          className="bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-3 rounded-lg text-lg disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Configurando...' : 'Iniciar o Jogo'}
        </Button>
      </div>
    </div>
  );
}
