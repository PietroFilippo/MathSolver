import React, { useState } from 'react';

type FiguraPlana = 'quadrado' | 'retangulo' | 'triangulo' | 'circulo' | 'trapezio' | 'losango' | 'hexagono';

const ResolvedorPerimetros: React.FC = () => {
  const [figura, setFigura] = useState<FiguraPlana>('quadrado');
  const [lado, setLado] = useState<string>('');
  const [comprimento, setComprimento] = useState<string>('');
  const [largura, setLargura] = useState<string>('');
  const [ladoA, setLadoA] = useState<string>('');
  const [ladoB, setLadoB] = useState<string>('');
  const [ladoC, setLadoC] = useState<string>('');
  const [raio, setRaio] = useState<string>('');
  const [ladoParalelo1, setLadoParalelo1] = useState<string>('');
  const [ladoParalelo2, setLadoParalelo2] = useState<string>('');
  const [ladoObliquo1, setLadoObliquo1] = useState<string>('');
  const [ladoObliquo2, setLadoObliquo2] = useState<string>('');
  const [resultado, setResultado] = useState<string | null>(null);
  const [passo, setPasso] = useState<string[]>([]);
  const [erro, setErro] = useState<string | null>(null);

  const calcularPerimetro = () => {
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
        if (!ladoA.trim() || !ladoB.trim() || !ladoC.trim()) {
          setErro('Por favor, insira os três lados do triângulo.');
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
        if (!ladoParalelo1.trim() || !ladoParalelo2.trim() || !ladoObliquo1.trim() || !ladoObliquo2.trim()) {
          setErro('Por favor, insira todos os lados do trapézio.');
          return;
        }
        break;
      case 'losango':
        if (!lado.trim()) {
          setErro('Por favor, insira o lado do losango.');
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
    
    // Algoritmo para calcular o perímetro da figura selecionada
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
              <label htmlFor="ladoA" className="block text-sm font-medium text-gray-700 mb-1">
                Lado A
              </label>
              <input
                type="text"
                id="ladoA"
                value={ladoA}
                onChange={(e) => setLadoA(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="ladoB" className="block text-sm font-medium text-gray-700 mb-1">
                Lado B
              </label>
              <input
                type="text"
                id="ladoB"
                value={ladoB}
                onChange={(e) => setLadoB(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="ladoC" className="block text-sm font-medium text-gray-700 mb-1">
                Lado C
              </label>
              <input
                type="text"
                id="ladoC"
                value={ladoC}
                onChange={(e) => setLadoC(e.target.value)}
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
              <label htmlFor="ladoParalelo1" className="block text-sm font-medium text-gray-700 mb-1">
                Base Maior
              </label>
              <input
                type="text"
                id="ladoParalelo1"
                value={ladoParalelo1}
                onChange={(e) => setLadoParalelo1(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="ladoParalelo2" className="block text-sm font-medium text-gray-700 mb-1">
                Base Menor
              </label>
              <input
                type="text"
                id="ladoParalelo2"
                value={ladoParalelo2}
                onChange={(e) => setLadoParalelo2(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="ladoObliquo1" className="block text-sm font-medium text-gray-700 mb-1">
                Lado Oblíquo 1
              </label>
              <input
                type="text"
                id="ladoObliquo1"
                value={ladoObliquo1}
                onChange={(e) => setLadoObliquo1(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="ladoObliquo2" className="block text-sm font-medium text-gray-700 mb-1">
                Lado Oblíquo 2
              </label>
              <input
                type="text"
                id="ladoObliquo2"
                value={ladoObliquo2}
                onChange={(e) => setLadoObliquo2(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </>
        );
      case 'losango':
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
      <h2 className="text-xl font-bold mb-4">Cálculo de Perímetros</h2>
      
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
          onClick={calcularPerimetro}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Calcular Perímetro
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

export default ResolvedorPerimetros; 