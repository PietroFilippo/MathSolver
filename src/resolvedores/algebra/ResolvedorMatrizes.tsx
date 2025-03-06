import React, { useState } from 'react';

const ResolvedorMatrizes: React.FC = () => {
  const [matrizA, setMatrizA] = useState<string>('');
  const [matrizB, setMatrizB] = useState<string>('');
  const [operacao, setOperacao] = useState<'soma' | 'subtracao' | 'multiplicacao' | 'determinante' | 'inversa' | 'transposta'>('soma');
  const [resultado, setResultado] = useState<string | null>(null);
  const [passo, setPasso] = useState<string[]>([]);
  const [erro, setErro] = useState<string | null>(null);

  const calcular = () => {
    // Limpar resultados anteriores
    setErro(null);
    setPasso([]);
    
    // Validar entrada de acordo com a operação selecionada
    if (!matrizA.trim()) {
      setErro('Por favor, insira a matriz A.');
      return;
    }
    
    if (['soma', 'subtracao', 'multiplicacao'].includes(operacao) && !matrizB.trim()) {
      setErro('Para operações com duas matrizes, insira também a matriz B.');
      return;
    }
    
    // Lógica de acordo com a operação selecionada
    switch (operacao) {
      case 'soma':
        // Algoritmo para soma de matrizes
        // Implementação futura
        break;
      case 'subtracao':
        // Algoritmo para subtração de matrizes
        // Implementação futura
        break;
      case 'multiplicacao':
        // Algoritmo para multiplicação de matrizes
        // Implementação futura
        break;
      case 'determinante':
        // Algoritmo para cálculo de determinante
        // Implementação futura
        break;
      case 'inversa':
        // Algoritmo para cálculo da matriz inversa
        // Implementação futura
        break;
      case 'transposta':
        // Algoritmo para cálculo da matriz transposta
        // Implementação futura
        break;
    }
    
    setResultado('Funcionalidade em desenvolvimento');
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Operações com Matrizes</h2>
      
      <div className="mb-4">
        <div className="grid grid-cols-3 gap-4 mb-4">
          <label className="inline-flex items-center">
            <input
              type="radio"
              className="form-radio"
              checked={operacao === 'soma'}
              onChange={() => setOperacao('soma')}
            />
            <span className="ml-2">Soma</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              className="form-radio"
              checked={operacao === 'subtracao'}
              onChange={() => setOperacao('subtracao')}
            />
            <span className="ml-2">Subtração</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              className="form-radio"
              checked={operacao === 'multiplicacao'}
              onChange={() => setOperacao('multiplicacao')}
            />
            <span className="ml-2">Multiplicação</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              className="form-radio"
              checked={operacao === 'determinante'}
              onChange={() => setOperacao('determinante')}
            />
            <span className="ml-2">Determinante</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              className="form-radio"
              checked={operacao === 'inversa'}
              onChange={() => setOperacao('inversa')}
            />
            <span className="ml-2">Inversa</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              className="form-radio"
              checked={operacao === 'transposta'}
              onChange={() => setOperacao('transposta')}
            />
            <span className="ml-2">Transposta</span>
          </label>
        </div>
        
        <div className="mb-4">
          <label htmlFor="matrizA" className="block text-sm font-medium text-gray-700 mb-1">
            Matriz A
          </label>
          <textarea
            id="matrizA"
            rows={4}
            value={matrizA}
            onChange={(e) => setMatrizA(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Ex: 1 2 3; 4 5 6; 7 8 9"
          />
          <p className="text-sm text-gray-500 mt-1">
            Insira os elementos separados por espaço e as linhas separadas por ponto e vírgula. 
            Exemplo: 1 2 3; 4 5 6; 7 8 9 para uma matriz 3x3.
          </p>
        </div>
        
        {['soma', 'subtracao', 'multiplicacao'].includes(operacao) && (
          <div className="mb-4">
            <label htmlFor="matrizB" className="block text-sm font-medium text-gray-700 mb-1">
              Matriz B
            </label>
            <textarea
              id="matrizB"
              rows={4}
              value={matrizB}
              onChange={(e) => setMatrizB(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Ex: 9 8 7; 6 5 4; 3 2 1"
            />
          </div>
        )}
        
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

export default ResolvedorMatrizes; 