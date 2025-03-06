import React, { useState } from 'react';

const ResolvedorInequacoes: React.FC = () => {
  const [inequacao, setInequacao] = useState<string>('');
  const [resultado, setResultado] = useState<string | null>(null);
  const [passo, setPasso] = useState<string[]>([]);
  const [erro, setErro] = useState<string | null>(null);

  const resolverInequacao = () => {
    // Limpar resultados anteriores
    setErro(null);
    setPasso([]);
    
    // Validar entrada
    if (!inequacao.trim()) {
      setErro('Por favor, insira uma inequação.');
      return;
    }
    
    // Verificar se a entrada contém algum símbolo de inequação
    const temSimbolo = /[<>≤≥]/.test(inequacao);
    if (!temSimbolo) {
      setErro('Sua entrada deve conter um símbolo de inequação (<, >, ≤, ≥).');
      return;
    }
    
    // Algoritmo para resolver inequações
    // Implementação futura
    
    setResultado('Funcionalidade em desenvolvimento');
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Resolver Inequações</h2>
      
      <div className="mb-4">
        <div className="mb-4">
          <label htmlFor="inequacao" className="block text-sm font-medium text-gray-700 mb-1">
            Inequação
          </label>
          <input
            type="text"
            id="inequacao"
            value={inequacao}
            onChange={(e) => setInequacao(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Ex: 2x + 3 > 7 ou 5x - 2 ≤ 3x + 4"
          />
          <p className="text-sm text-gray-500 mt-1">
            Use os símbolos &lt;, &gt;, ≤, ≥ para representar inequações.
          </p>
        </div>
        
        <button
          onClick={resolverInequacao}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Resolver
        </button>
      </div>
      
      {erro && (
        <div className="p-3 bg-red-100 text-red-700 rounded-md mb-4">
          {erro}
        </div>
      )}
      
      {resultado && (
        <div className="mt-4">
          <h3 className="text-lg font-medium mb-2">Resultado:</h3>
          <div className="p-3 bg-green-100 text-green-800 rounded-md">
            {resultado}
          </div>
        </div>
      )}
      
      {passo.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-medium mb-2">Passo a passo:</h3>
          <ol className="list-decimal pl-5 space-y-1">
            {passo.map((p, index) => (
              <li key={index}>{p}</li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
};

export default ResolvedorInequacoes; 