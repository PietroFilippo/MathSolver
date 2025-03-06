import React, { useState } from 'react';

type Solido = 'cubo' | 'paralelepipedo' | 'esfera' | 'cilindro' | 'cone' | 'piramide' | 'prisma';

const ResolvedorVolumeSolidos: React.FC = () => {
  const [solido, setSolido] = useState<Solido>('cubo');
  const [aresta, setAresta] = useState<string>('');
  const [comprimento, setComprimento] = useState<string>('');
  const [largura, setLargura] = useState<string>('');
  const [altura, setAltura] = useState<string>('');
  const [raio, setRaio] = useState<string>('');
  const [raioBase, setRaioBase] = useState<string>('');
  const [areaBase, setAreaBase] = useState<string>('');
  const [resultado, setResultado] = useState<string | null>(null);
  const [passo, setPasso] = useState<string[]>([]);
  const [erro, setErro] = useState<string | null>(null);

  const calcularVolume = () => {
    // Limpar resultados anteriores
    setErro(null);
    setPasso([]);
    
    // Validar entrada de acordo com o sólido selecionado
    switch (solido) {
      case 'cubo':
        if (!aresta.trim()) {
          setErro('Por favor, insira o valor da aresta do cubo.');
          return;
        }
        break;
      case 'paralelepipedo':
        if (!comprimento.trim() || !largura.trim() || !altura.trim()) {
          setErro('Por favor, insira o comprimento, largura e altura do paralelepípedo.');
          return;
        }
        break;
      case 'esfera':
        if (!raio.trim()) {
          setErro('Por favor, insira o raio da esfera.');
          return;
        }
        break;
      case 'cilindro':
        if (!raioBase.trim() || !altura.trim()) {
          setErro('Por favor, insira o raio da base e a altura do cilindro.');
          return;
        }
        break;
      case 'cone':
        if (!raioBase.trim() || !altura.trim()) {
          setErro('Por favor, insira o raio da base e a altura do cone.');
          return;
        }
        break;
      case 'piramide':
        if (!areaBase.trim() || !altura.trim()) {
          setErro('Por favor, insira a área da base e a altura da pirâmide.');
          return;
        }
        break;
      case 'prisma':
        if (!areaBase.trim() || !altura.trim()) {
          setErro('Por favor, insira a área da base e a altura do prisma.');
          return;
        }
        break;
    }
    
    // Algoritmo para calcular o volume do sólido selecionado
    // Implementação futura
    
    setResultado('Funcionalidade em desenvolvimento');
  };

  const renderCampos = () => {
    switch (solido) {
      case 'cubo':
        return (
          <div className="mb-4">
            <label htmlFor="aresta" className="block text-sm font-medium text-gray-700 mb-1">
              Aresta
            </label>
            <input
              type="text"
              id="aresta"
              value={aresta}
              onChange={(e) => setAresta(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        );
      case 'paralelepipedo':
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
      case 'esfera':
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
      case 'cilindro':
      case 'cone':
        return (
          <>
            <div className="mb-4">
              <label htmlFor="raioBase" className="block text-sm font-medium text-gray-700 mb-1">
                Raio da Base
              </label>
              <input
                type="text"
                id="raioBase"
                value={raioBase}
                onChange={(e) => setRaioBase(e.target.value)}
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
      case 'piramide':
      case 'prisma':
        return (
          <>
            <div className="mb-4">
              <label htmlFor="areaBase" className="block text-sm font-medium text-gray-700 mb-1">
                Área da Base
              </label>
              <input
                type="text"
                id="areaBase"
                value={areaBase}
                onChange={(e) => setAreaBase(e.target.value)}
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
      default:
        return null;
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Cálculo de Volume de Sólidos</h2>
      
      <div className="mb-4">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Sólido</label>
          <select
            value={solido}
            onChange={(e) => setSolido(e.target.value as Solido)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="cubo">Cubo</option>
            <option value="paralelepipedo">Paralelepípedo</option>
            <option value="esfera">Esfera</option>
            <option value="cilindro">Cilindro</option>
            <option value="cone">Cone</option>
            <option value="piramide">Pirâmide</option>
            <option value="prisma">Prisma</option>
          </select>
        </div>
        
        {renderCampos()}
        
        <button
          onClick={calcularVolume}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Calcular Volume
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

export default ResolvedorVolumeSolidos; 