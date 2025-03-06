import React, { useState } from 'react';

const ResolvedorExpressoesAlgebricas: React.FC = () => {
  const [expressao, setExpressao] = useState<string>('');
  const [operacao, setOperacao] = useState<'simplificar' | 'expandir' | 'termos'>('simplificar');
  const [resultado, setResultado] = useState<string | null>(null);
  const [passo, setPasso] = useState<string[]>([]);
  const [erro, setErro] = useState<string | null>(null);

  const calcular = () => {
    // Limpar resultados anteriores
    setErro(null);
    setPasso([]);
    
    // Validar entrada
    if (!expressao.trim()) {
      setErro('Por favor, insira uma expressão algébrica.');
      return;
    }
    
    // Lógica de acordo com a operação selecionada
    switch (operacao) {
      case 'simplificar':
        // Algoritmo para simplificar expressões algébricas
        // Implementação futura
        break;
      case 'expandir':
        // Algoritmo para expandir expressões algébricas
        // Implementação futura
        break;
      case 'termos':
        // Algoritmo para somar termos semelhantes
        // Implementação futura
        break;
    }
    
    setResultado('Funcionalidade em desenvolvimento');
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Operações com Expressões Algébricas</h2>
      
      <div className="mb-4">
        <div className="flex items-center mb-4">
          <label className="inline-flex items-center mr-4">
            <input
              type="radio"
              className="form-radio"
              checked={operacao === 'simplificar'}
              onChange={() => setOperacao('simplificar')}
            />
            <span className="ml-2">Simplificar</span>
          </label>
          <label className="inline-flex items-center mr-4">
            <input
              type="radio"
              className="form-radio"
              checked={operacao === 'expandir'}
              onChange={() => setOperacao('expandir')}
            />
            <span className="ml-2">Expandir</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              className="form-radio"
              checked={operacao === 'termos'}
              onChange={() => setOperacao('termos')}
            />
            <span className="ml-2">Somar termos semelhantes</span>
          </label>
        </div>
        
        <div className="mb-4">
          <label htmlFor="expressao" className="block text-sm font-medium text-gray-700 mb-1">
            Expressão Algébrica
          </label>
          <textarea
            id="expressao"
            rows={3}
            value={expressao}
            onChange={(e) => setExpressao(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder={operacao === 'simplificar' ? 'Ex: 2x + 3x' : operacao === 'expandir' ? 'Ex: (x+2)(x+3)' : 'Ex: 2x^2 + 3x + 5x^2 - 2x'}
          />
        </div>
        
        <button
          onClick={calcular}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Calcular
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

export default ResolvedorExpressoesAlgebricas; 