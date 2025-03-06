import React, { useState } from 'react';

const ResolvedorSimplificacaoFracoes: React.FC = () => {
  const [numerador, setNumerador] = useState<string>('');
  const [denominador, setDenominador] = useState<string>('');
  const [resultado, setResultado] = useState<string | null>(null);
  const [passo, setPasso] = useState<string[]>([]);
  const [erro, setErro] = useState<string | null>(null);

  const simplificarFracao = () => {
    // Limpar resultados anteriores
    setErro(null);
    setPasso([]);
    
    // Validar entrada
    const num = parseInt(numerador);
    const den = parseInt(denominador);
    
    if (isNaN(num) || isNaN(den)) {
      setErro('Por favor, insira números válidos.');
      return;
    }
    
    if (den === 0) {
      setErro('O denominador não pode ser zero.');
      return;
    }

    // Algoritmo para simplificar frações
    // Implementação futura
    
    setResultado('Funcionalidade em desenvolvimento');
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Simplificação de Frações</h2>
      
      <div className="mb-4">
        <div className="flex items-center space-x-2 mb-2">
          <div>
            <label htmlFor="numerador" className="block text-sm font-medium text-gray-700">Numerador</label>
            <input
              type="text"
              id="numerador"
              value={numerador}
              onChange={(e) => setNumerador(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          
          <div className="text-2xl">/</div>
          
          <div>
            <label htmlFor="denominador" className="block text-sm font-medium text-gray-700">Denominador</label>
            <input
              type="text"
              id="denominador"
              value={denominador}
              onChange={(e) => setDenominador(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </div>
        
        <button
          onClick={simplificarFracao}
          className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Simplificar
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

export default ResolvedorSimplificacaoFracoes; 