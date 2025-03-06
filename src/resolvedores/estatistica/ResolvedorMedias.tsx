import React, { useState } from 'react';

const ResolvedorMedias: React.FC = () => {
  const [valores, setValores] = useState<string>('');
  const [pesos, setPesos] = useState<string>('');
  const [tipoMedia, setTipoMedia] = useState<'aritmetica' | 'ponderada' | 'geometrica'>('aritmetica');
  const [resultado, setResultado] = useState<string | null>(null);
  const [passo, setPasso] = useState<string[]>([]);
  const [erro, setErro] = useState<string | null>(null);

  const calcularMedia = () => {
    // Limpar resultados anteriores
    setErro(null);
    setPasso([]);
    
    // Validar entrada
    if (!valores.trim()) {
      setErro('Por favor, insira os valores para calcular a média.');
      return;
    }
    
    // Extrair valores numéricos
    const numeros = valores.split(',').map(v => parseFloat(v.trim()));
    
    if (numeros.some(isNaN)) {
      setErro('Todos os valores devem ser números válidos separados por vírgula.');
      return;
    }
    
    // Para média ponderada, validar pesos
    if (tipoMedia === 'ponderada') {
      if (!pesos.trim()) {
        setErro('Para média ponderada, insira os pesos correspondentes.');
        return;
      }
      
      const pesosList = pesos.split(',').map(p => parseFloat(p.trim()));
      
      if (pesosList.some(isNaN)) {
        setErro('Todos os pesos devem ser números válidos separados por vírgula.');
        return;
      }
      
      if (pesosList.length !== numeros.length) {
        setErro('O número de pesos deve ser igual ao número de valores.');
        return;
      }
    }
    
    // Lógica para calcular as diferentes médias
    let result = 0;
    
    switch (tipoMedia) {
      case 'aritmetica':
        // Algoritmo para média aritmética
        // Implementação futura
        break;
      case 'ponderada':
        // Algoritmo para média ponderada
        // Implementação futura
        break;
      case 'geometrica':
        // Algoritmo para média geométrica
        // Implementação futura
        break;
    }
    
    setResultado('Funcionalidade em desenvolvimento');
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Cálculo de Médias</h2>
      
      <div className="mb-4">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Média</label>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio"
                checked={tipoMedia === 'aritmetica'}
                onChange={() => setTipoMedia('aritmetica')}
              />
              <span className="ml-2">Média Aritmética</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio"
                checked={tipoMedia === 'ponderada'}
                onChange={() => setTipoMedia('ponderada')}
              />
              <span className="ml-2">Média Ponderada</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio"
                checked={tipoMedia === 'geometrica'}
                onChange={() => setTipoMedia('geometrica')}
              />
              <span className="ml-2">Média Geométrica</span>
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
            placeholder="Ex: 10, 20, 30, 40, 50"
          />
          <p className="text-sm text-gray-500 mt-1">
            Insira os valores separados por vírgula.
          </p>
        </div>
        
        {tipoMedia === 'ponderada' && (
          <div className="mb-4">
            <label htmlFor="pesos" className="block text-sm font-medium text-gray-700 mb-1">
              Pesos
            </label>
            <input
              type="text"
              id="pesos"
              value={pesos}
              onChange={(e) => setPesos(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Ex: 1, 2, 1, 3, 2"
            />
            <p className="text-sm text-gray-500 mt-1">
              Insira os pesos correspondentes a cada valor, separados por vírgula.
            </p>
          </div>
        )}
        
        <button
          onClick={calcularMedia}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Calcular Média
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

export default ResolvedorMedias; 