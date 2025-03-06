import React, { useState } from 'react';

type FiguraPlana = 'quadrado' | 'retangulo' | 'triangulo' | 'circulo' | 'trapezio' | 'losango' | 'hexagono';

const ResolvedorAreaFigurasPlanas: React.FC = () => {
  const [figura, setFigura] = useState<FiguraPlana>('quadrado');
  const [lado, setLado] = useState<string>('');
  const [comprimento, setComprimento] = useState<string>('');
  const [largura, setLargura] = useState<string>('');
  const [base, setBase] = useState<string>('');
  const [baseMaior, setBaseMaior] = useState<string>('');
  const [baseMenor, setBaseMenor] = useState<string>('');
  const [altura, setAltura] = useState<string>('');
  const [raio, setRaio] = useState<string>('');
  const [diagonalMaior, setDiagonalMaior] = useState<string>('');
  const [diagonalMenor, setDiagonalMenor] = useState<string>('');
  const [resultado, setResultado] = useState<string | null>(null);
  const [passo, setPasso] = useState<string[]>([]);
  const [erro, setErro] = useState<string | null>(null);

  const calcularArea = () => {
    // Limpar resultados anteriores
    setErro(null);
    setPasso([]);
    
    // Validar entrada de acordo com a figura selecionada
    switch (figura) {
      case 'quadrado':
        if (!lado.trim()) {
          setErro('Por favor, insira o valor do lado do quadrado.');
          return;
        }
        break;
      case 'retangulo':
        if (!comprimento.trim() || !largura.trim()) {
          setErro('Por favor, insira o comprimento e a largura do retângulo.');
          return;
        }
        break;
      case 'triangulo':
        if (!base.trim() || !altura.trim()) {
          setErro('Por favor, insira a base e a altura do triângulo.');
          return;
        }
        break;
      case 'circulo':
        if (!raio.trim()) {
          setErro('Por favor, insira o raio do círculo.');
          return;
        }
        break;
      case 'trapezio':
        if (!baseMaior.trim() || !baseMenor.trim() || !altura.trim()) {
          setErro('Por favor, insira as bases (maior e menor) e a altura do trapézio.');
          return;
        }
        break;
      case 'losango':
        if (!diagonalMaior.trim() || !diagonalMenor.trim()) {
          setErro('Por favor, insira as diagonais do losango.');
          return;
        }
        break;
      case 'hexagono':
        if (!lado.trim()) {
          setErro('Por favor, insira o lado do hexágono regular.');
          return;
        }
        break;
    }
    
    // Algoritmo para calcular a área da figura selecionada
    // Implementação futura
    
    setResultado('Funcionalidade em desenvolvimento');
  };

  const renderCampos = () => {
    switch (figura) {
      case 'quadrado':
        return (
          <div className="mb-4">
            <label htmlFor="lado" className="block text-sm font-medium text-gray-700 mb-1">
              Lado
            </label>
            <input
              type="text"
              id="lado"
              value={lado}
              onChange={(e) => setLado(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        );
      case 'retangulo':
        return (
          <>
            <div className="mb-4">
              <label htmlFor="comprimento" className="block text-sm font-medium text-gray-700 mb-1">
                Comprimento
              </label>
              <input
                type="text"
                id="comprimento"
                value={comprimento}
                onChange={(e) => setComprimento(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="largura" className="block text-sm font-medium text-gray-700 mb-1">
                Largura
              </label>
              <input
                type="text"
                id="largura"
                value={largura}
                onChange={(e) => setLargura(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </>
        );
      case 'triangulo':
        return (
          <>
            <div className="mb-4">
              <label htmlFor="base" className="block text-sm font-medium text-gray-700 mb-1">
                Base
              </label>
              <input
                type="text"
                id="base"
                value={base}
                onChange={(e) => setBase(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="altura" className="block text-sm font-medium text-gray-700 mb-1">
                Altura
              </label>
              <input
                type="text"
                id="altura"
                value={altura}
                onChange={(e) => setAltura(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </>
        );
      case 'circulo':
        return (
          <div className="mb-4">
            <label htmlFor="raio" className="block text-sm font-medium text-gray-700 mb-1">
              Raio
            </label>
            <input
              type="text"
              id="raio"
              value={raio}
              onChange={(e) => setRaio(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        );
      case 'trapezio':
        return (
          <>
            <div className="mb-4">
              <label htmlFor="baseMaior" className="block text-sm font-medium text-gray-700 mb-1">
                Base Maior
              </label>
              <input
                type="text"
                id="baseMaior"
                value={baseMaior}
                onChange={(e) => setBaseMaior(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="baseMenor" className="block text-sm font-medium text-gray-700 mb-1">
                Base Menor
              </label>
              <input
                type="text"
                id="baseMenor"
                value={baseMenor}
                onChange={(e) => setBaseMenor(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="altura" className="block text-sm font-medium text-gray-700 mb-1">
                Altura
              </label>
              <input
                type="text"
                id="altura"
                value={altura}
                onChange={(e) => setAltura(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </>
        );
      case 'losango':
        return (
          <>
            <div className="mb-4">
              <label htmlFor="diagonalMaior" className="block text-sm font-medium text-gray-700 mb-1">
                Diagonal Maior
              </label>
              <input
                type="text"
                id="diagonalMaior"
                value={diagonalMaior}
                onChange={(e) => setDiagonalMaior(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="diagonalMenor" className="block text-sm font-medium text-gray-700 mb-1">
                Diagonal Menor
              </label>
              <input
                type="text"
                id="diagonalMenor"
                value={diagonalMenor}
                onChange={(e) => setDiagonalMenor(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </>
        );
      case 'hexagono':
        return (
          <div className="mb-4">
            <label htmlFor="lado" className="block text-sm font-medium text-gray-700 mb-1">
              Lado
            </label>
            <input
              type="text"
              id="lado"
              value={lado}
              onChange={(e) => setLado(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Cálculo de Área de Figuras Planas</h2>
      
      <div className="mb-4">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Figura</label>
          <select
            value={figura}
            onChange={(e) => setFigura(e.target.value as FiguraPlana)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="quadrado">Quadrado</option>
            <option value="retangulo">Retângulo</option>
            <option value="triangulo">Triângulo</option>
            <option value="circulo">Círculo</option>
            <option value="trapezio">Trapézio</option>
            <option value="losango">Losango</option>
            <option value="hexagono">Hexágono Regular</option>
          </select>
        </div>
        
        {renderCampos()}
        
        <button
          onClick={calcularArea}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Calcular Área
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

export default ResolvedorAreaFigurasPlanas; 