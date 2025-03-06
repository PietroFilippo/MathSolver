import React, { useState } from 'react';

const ResolvedorIntegrais: React.FC = () => {
  const [funcao, setFuncao] = useState<string>('');
  const [variavel, setVariavel] = useState<string>('x');
  const [tipoIntegral, setTipoIntegral] = useState<'indefinida' | 'definida'>('indefinida');
  const [limiteInferior, setLimiteInferior] = useState<string>('');
  const [limiteSuperior, setLimiteSuperior] = useState<string>('');
  const [resultado, setResultado] = useState<string | null>(null);
  const [passo, setPasso] = useState<string[]>([]);
  const [erro, setErro] = useState<string | null>(null);

  const calcularIntegral = () => {
    // Limpar resultados anteriores
    setErro(null);
    setPasso([]);
    
    // Validar entrada
    if (!funcao.trim()) {
      setErro('Por favor, insira uma função para integrar.');
      return;
    }
    
    if (!variavel.trim()) {
      setErro('Por favor, especifique a variável de integração.');
      return;
    }
    
    // Validar limites para integral definida
    if (tipoIntegral === 'definida') {
      if (!limiteInferior.trim() || !limiteSuperior.trim()) {
        setErro('Para integral definida, especifique os limites inferior e superior.');
        return;
      }
      
      const a = parseFloat(limiteInferior);
      const b = parseFloat(limiteSuperior);
      
      if (isNaN(a) || isNaN(b)) {
        setErro('Os limites devem ser valores numéricos válidos.');
        return;
      }
    }
    
    // Algoritmo para calcular integrais
    // Implementação futura
    
    setResultado('Funcionalidade em desenvolvimento');
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Cálculo de Integrais</h2>
      
      <div className="mb-4">
        <div className="mb-4">
          <label htmlFor="funcao" className="block text-sm font-medium text-gray-700 mb-1">
            Função
          </label>
          <input
            type="text"
            id="funcao"
            value={funcao}
            onChange={(e) => setFuncao(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Ex: x^2 + 3*x - 5 ou sin(x)"
          />
          <p className="text-sm text-gray-500 mt-1">
            Use operadores como +, -, *, /, ^. Funções disponíveis: sin, cos, tan, log, ln, e^x, etc.
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-4">
          <div>
            <label htmlFor="variavel" className="block text-sm font-medium text-gray-700 mb-1">
              Variável
            </label>
            <input
              type="text"
              id="variavel"
              value={variavel}
              onChange={(e) => setVariavel(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Integral
            </label>
            <div className="flex items-center space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio"
                  checked={tipoIntegral === 'indefinida'}
                  onChange={() => setTipoIntegral('indefinida')}
                />
                <span className="ml-2">Indefinida</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio"
                  checked={tipoIntegral === 'definida'}
                  onChange={() => setTipoIntegral('definida')}
                />
                <span className="ml-2">Definida</span>
              </label>
            </div>
          </div>
        </div>
        
        {tipoIntegral === 'definida' && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-4">
            <div>
              <label htmlFor="limiteInferior" className="block text-sm font-medium text-gray-700 mb-1">
                Limite Inferior
              </label>
              <input
                type="text"
                id="limiteInferior"
                value={limiteInferior}
                onChange={(e) => setLimiteInferior(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            
            <div>
              <label htmlFor="limiteSuperior" className="block text-sm font-medium text-gray-700 mb-1">
                Limite Superior
              </label>
              <input
                type="text"
                id="limiteSuperior"
                value={limiteSuperior}
                onChange={(e) => setLimiteSuperior(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>
        )}
        
        <button
          onClick={calcularIntegral}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Calcular Integral
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

export default ResolvedorIntegrais; 