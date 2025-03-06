import React, { useState } from 'react';

const ResolvedorModaMediana: React.FC = () => {
  const [valores, setValores] = useState<string>('');
  const [calcularModa, setCalcularModa] = useState<boolean>(true);
  const [calcularMediana, setCalcularMediana] = useState<boolean>(true);
  const [resultado, setResultado] = useState<{moda?: string; mediana?: string} | null>(null);
  const [passo, setPasso] = useState<string[]>([]);
  const [erro, setErro] = useState<string | null>(null);

  const calcular = () => {
    // Limpar resultados anteriores
    setErro(null);
    setPasso([]);
    setResultado(null);
    
    // Validar entrada
    if (!valores.trim()) {
      setErro('Por favor, insira os valores para calcular.');
      return;
    }
    
    // Verificar se pelo menos uma estatística foi selecionada
    if (!calcularModa && !calcularMediana) {
      setErro('Selecione pelo menos uma estatística para calcular (Moda ou Mediana).');
      return;
    }
    
    // Extrair valores numéricos
    const numeros = valores.split(',').map(v => parseFloat(v.trim()));
    
    if (numeros.some(isNaN)) {
      setErro('Todos os valores devem ser números válidos separados por vírgula.');
      return;
    }
    
    // Criar objeto para armazenar os resultados
    const resultados: {moda?: string; mediana?: string} = {};
    
    // Calcular a moda, se selecionado
    if (calcularModa) {
      // Algoritmo para calcular a moda
      // Implementação futura
      resultados.moda = 'Funcionalidade em desenvolvimento';
    }
    
    // Calcular a mediana, se selecionado
    if (calcularMediana) {
      // Algoritmo para calcular a mediana
      // Implementação futura
      resultados.mediana = 'Funcionalidade em desenvolvimento';
    }
    
    setResultado(resultados);
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Cálculo de Moda e Mediana</h2>
      
      <div className="mb-4">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Estatísticas a Calcular</label>
          <div className="flex items-center space-x-4">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="form-checkbox"
                checked={calcularModa}
                onChange={(e) => setCalcularModa(e.target.checked)}
              />
              <span className="ml-2">Moda</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="form-checkbox"
                checked={calcularMediana}
                onChange={(e) => setCalcularMediana(e.target.checked)}
              />
              <span className="ml-2">Mediana</span>
            </label>
          </div>
        </div>
        
        <div className="mb-4">
          <label htmlFor="valores" className="block text-sm font-medium text-gray-700 mb-1">
            Valores
          </label>
          <input
            type="text"
            id="valores"
            value={valores}
            onChange={(e) => setValores(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Ex: 10, 20, 30, 40, 50, 20, 30"
          />
          <p className="text-sm text-gray-500 mt-1">
            Insira os valores separados por vírgula.
          </p>
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
          <div className="space-y-2">
            {resultado.moda && (
              <div className="p-3 bg-green-100 text-green-800 rounded-md">
                <strong>Moda:</strong> {resultado.moda}
              </div>
            )}
            {resultado.mediana && (
              <div className="p-3 bg-green-100 text-green-800 rounded-md">
                <strong>Mediana:</strong> {resultado.mediana}
              </div>
            )}
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

export default ResolvedorModaMediana; 