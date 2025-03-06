import React, { useState } from 'react';

const ResolvedorEquacoesTrigonometricas: React.FC = () => {
  const [equacao, setEquacao] = useState<string>('');
  const [intervalo, setIntervalo] = useState<string>('0,2π');
  const [resultado, setResultado] = useState<string | null>(null);
  const [passo, setPasso] = useState<string[]>([]);
  const [erro, setErro] = useState<string | null>(null);

  const resolverEquacao = () => {
    // Limpar resultados anteriores
    setErro(null);
    setPasso([]);
    
    // Validar entrada
    if (!equacao.trim()) {
      setErro('Por favor, insira uma equação trigonométrica.');
      return;
    }
    
    // Verificar se a equação contém funções trigonométricas
    const temFuncaoTrig = /\b(sen|cos|tan|cot|sec|csc|sin|tg|cotg)\b/i.test(equacao);
    if (!temFuncaoTrig) {
      setErro('Sua entrada deve conter pelo menos uma função trigonométrica (sen, cos, tan, etc.).');
      return;
    }
    
    // Algoritmo para resolver equações trigonométricas
    // Implementação futura
    
    setResultado('Funcionalidade em desenvolvimento');
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Resolver Equações Trigonométricas</h2>
      
      <div className="mb-4">
        <div className="mb-4">
          <label htmlFor="equacao" className="block text-sm font-medium text-gray-700 mb-1">
            Equação Trigonométrica
          </label>
          <input
            type="text"
            id="equacao"
            value={equacao}
            onChange={(e) => setEquacao(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Ex: sen(x) = 1/2 ou cos(2x) + 1 = 0"
          />
          <p className="text-sm text-gray-500 mt-1">
            Use funções trigonométricas como sen, cos, tan, etc. e = para representar a igualdade.
          </p>
        </div>
        
        <div className="mb-4">
          <label htmlFor="intervalo" className="block text-sm font-medium text-gray-700 mb-1">
            Intervalo para Soluções
          </label>
          <input
            type="text"
            id="intervalo"
            value={intervalo}
            onChange={(e) => setIntervalo(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Ex: 0,2π ou -π,π"
          />
          <p className="text-sm text-gray-500 mt-1">
            Especifique o intervalo no formato: início,fim (use π para representar pi)
          </p>
        </div>
        
        <button
          onClick={resolverEquacao}
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

export default ResolvedorEquacoesTrigonometricas; 