import React, { useState } from 'react';
import { HiCalculator } from 'react-icons/hi';
import {
    areaQuadrado,
    areaRetangulo,
    areaTriangulo,
    areaCirculo,
    areaTrapezio,
    areaLosango,
    areaHexagono,
} from '../../utils/mathUtils';

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
  const [result, setResult] = useState<number | null>(null);
  const [steps, setSteps] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [showExplanation, setShowExplanation] = useState<boolean>(true);

  const handleNumberInput = (value: string, setter: React.Dispatch<React.SetStateAction<string>>) => {
    const numberPattern = /^-?\d*\.?\d*$/;
    if (value === '' || numberPattern.test(value)) {
      setter(value);
    }
  };

  const handleSolve = () => {
    setErrorMessage('');
    setResult(null);
    setSteps([]);

    try {
      let area: number;
      const calculationSteps: string[] = [];
      let stepCount = 1;

      switch (figura) {
        case 'quadrado': {
          if (!lado.trim()) {
            setErrorMessage('Por favor, insira o valor do lado do quadrado.');
            return;
          }
          const l = parseFloat(lado);
          if (isNaN(l) || l <= 0) {
            setErrorMessage('O lado deve ser um número positivo.');
            return;
          }
          
          area = areaQuadrado(l);
          calculationSteps.push(`Passo ${stepCount++}: A área do quadrado é calculada pela fórmula: A = l²`);
          calculationSteps.push(`Passo ${stepCount++}: Substituindo o lado ${l} na fórmula:`);
          calculationSteps.push(`A = ${l} × ${l}`);
          calculationSteps.push(`A = ${area} unidades quadradas`);
          break;
        }

        case 'retangulo': {
          if (!comprimento.trim() || !largura.trim()) {
            setErrorMessage('Por favor, insira o comprimento e a largura do retângulo.');
            return;
          }
          const c = parseFloat(comprimento);
          const l = parseFloat(largura);
          if (isNaN(c) || isNaN(l) || c <= 0 || l <= 0) {
            setErrorMessage('O comprimento e a largura devem ser números positivos.');
            return;
          }

          area = areaRetangulo(c, l);
          calculationSteps.push(`Passo ${stepCount++}: A área do retângulo é calculada pela fórmula: A = c × l`);
          calculationSteps.push(`Passo ${stepCount++}: Substituindo o comprimento ${c} e a largura ${l} na fórmula:`);
          calculationSteps.push(`A = ${c} × ${l}`);
          calculationSteps.push(`A = ${area} unidades quadradas`);
          break;
        }

        case 'triangulo': {
          if (!base.trim() || !altura.trim()) {
            setErrorMessage('Por favor, insira a base e a altura do triângulo.');
            return;
          }
          const b = parseFloat(base);
          const h = parseFloat(altura);
          if (isNaN(b) || isNaN(h) || b <= 0 || h <= 0) {
            setErrorMessage('A base e a altura devem ser números positivos.');
            return;
          }

          area = areaTriangulo(b, h);
          calculationSteps.push(`Passo ${stepCount++}: A área do triângulo é calculada pela fórmula: A = (b × h) ÷ 2`);
          calculationSteps.push(`Passo ${stepCount++}: Substituindo a base ${b} e a altura ${h} na fórmula:`);
          calculationSteps.push(`A = (${b} × ${h}) ÷ 2`);
          calculationSteps.push(`A = ${area} unidades quadradas`);
          break;
        }

        case 'circulo': {
          if (!raio.trim()) {
            setErrorMessage('Por favor, insira o raio do círculo.');
            return;
          }
          const r = parseFloat(raio);
          if (isNaN(r) || r <= 0) {
            setErrorMessage('O raio deve ser um número positivo.');
            return;
          }

          area = areaCirculo(r);
          calculationSteps.push(`Passo ${stepCount++}: A área do círculo é calculada pela fórmula: A = πr²`);
          calculationSteps.push(`Passo ${stepCount++}: Substituindo o raio ${r} na fórmula:`);
          calculationSteps.push(`A = π × ${r}²`);
          calculationSteps.push(`A = ${area} unidades quadradas`);
          break;
        }

        case 'trapezio': {
          if (!baseMaior.trim() || !baseMenor.trim() || !altura.trim()) {
            setErrorMessage('Por favor, insira as bases (maior e menor) e a altura do trapézio.');
            return;
          }
          const B = parseFloat(baseMaior);
          const b = parseFloat(baseMenor);
          const h = parseFloat(altura);
          if (isNaN(B) || isNaN(b) || isNaN(h) || B <= 0 || b <= 0 || h <= 0) {
            setErrorMessage('As bases e a altura devem ser números positivos.');
            return;
          }
          if (B <= b) {
            setErrorMessage('A base maior deve ser maior que a base menor.');
            return;
          }

          area = areaTrapezio(B, b, h);
          calculationSteps.push(`Passo ${stepCount++}: A área do trapézio é calculada pela fórmula: A = [(B + b) × h] ÷ 2`);
          calculationSteps.push(`Passo ${stepCount++}: Substituindo a base maior ${B}, base menor ${b} e altura ${h} na fórmula:`);
          calculationSteps.push(`A = [(${B} + ${b}) × ${h}] ÷ 2`);
          calculationSteps.push(`A = ${area} unidades quadradas`);
          break;
        }

        case 'losango': {
          if (!diagonalMaior.trim() || !diagonalMenor.trim()) {
            setErrorMessage('Por favor, insira as diagonais do losango.');
            return;
          }
          const D = parseFloat(diagonalMaior);
          const d = parseFloat(diagonalMenor);
          if (isNaN(D) || isNaN(d) || D <= 0 || d <= 0) {
            setErrorMessage('As diagonais devem ser números positivos.');
            return;
          }
          if (D <= d) {
            setErrorMessage('A diagonal maior deve ser maior que a diagonal menor.');
            return;
          }

          area = areaLosango(D, d);
          calculationSteps.push(`Passo ${stepCount++}: A área do losango é calculada pela fórmula: A = (D × d) ÷ 2`);
          calculationSteps.push(`Passo ${stepCount++}: Substituindo a diagonal maior ${D} e diagonal menor ${d} na fórmula:`);
          calculationSteps.push(`A = (${D} × ${d}) ÷ 2`);
          calculationSteps.push(`A = ${area} unidades quadradas`);
          break;
        }

        case 'hexagono': {
          if (!lado.trim()) {
            setErrorMessage('Por favor, insira o lado do hexágono regular.');
            return;
          }
          const l = parseFloat(lado);
          if (isNaN(l) || l <= 0) {
            setErrorMessage('O lado deve ser um número positivo.');
            return;
          }

          area = areaHexagono(l);
          calculationSteps.push(`Passo ${stepCount++}: A área do hexágono regular é calculada pela fórmula: A = (3 × √3 × l²) ÷ 2`);
          calculationSteps.push(`Passo ${stepCount++}: Substituindo o lado ${l} na fórmula:`);
          calculationSteps.push(`A = (3 × √3 × ${l}²) ÷ 2`);
          calculationSteps.push(`A = ${area} unidades quadradas`);
          break;
        }
      }

      setResult(area!);
      setSteps(calculationSteps);
      setShowExplanation(true);

    } catch (error) {
      setErrorMessage('Ocorreu um erro ao calcular a área.');
    }
  };

  const renderFields = () => {
    const inputClassName = "w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500";
    
    switch (figura) {
      case 'quadrado':
        return (
          <div className="mb-4">
            <label htmlFor="lado" className="block text-sm font-medium text-gray-700 mb-2">
              Lado
            </label>
            <input
              type="number"
              id="lado"
              value={lado}
              onChange={(e) => handleNumberInput(e.target.value, setLado)}
              className={inputClassName}
              placeholder="Digite o valor do lado"
              step="any"
            />
          </div>
        );
      case 'retangulo':
        return (
          <>
            <div className="mb-4">
              <label htmlFor="comprimento" className="block text-sm font-medium text-gray-700 mb-2">
                Comprimento
              </label>
              <input
                type="number"
                id="comprimento"
                value={comprimento}
                onChange={(e) => handleNumberInput(e.target.value, setComprimento)}
                className={inputClassName}
                placeholder="Digite o comprimento"
                step="any"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="largura" className="block text-sm font-medium text-gray-700 mb-2">
                Largura
              </label>
              <input
                type="number"
                id="largura"
                value={largura}
                onChange={(e) => handleNumberInput(e.target.value, setLargura)}
                className={inputClassName}
                placeholder="Digite a largura"
                step="any"
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
                onChange={(e) => handleNumberInput(e.target.value, setBase)}
                className={inputClassName}
                placeholder="Digite a base"
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
                onChange={(e) => handleNumberInput(e.target.value, setAltura)}
                className={inputClassName}
                placeholder="Digite a altura"
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
              onChange={(e) => handleNumberInput(e.target.value, setRaio)}
              className={inputClassName}
              placeholder="Digite o raio"
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
                onChange={(e) => handleNumberInput(e.target.value, setBaseMaior)}
                className={inputClassName}
                placeholder="Digite a base maior"
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
                onChange={(e) => handleNumberInput(e.target.value, setBaseMenor)}
                className={inputClassName}
                placeholder="Digite a base menor"
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
                onChange={(e) => handleNumberInput(e.target.value, setAltura)}
                className={inputClassName}
                placeholder="Digite a altura"
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
                onChange={(e) => handleNumberInput(e.target.value, setDiagonalMaior)}
                className={inputClassName}
                placeholder="Digite a diagonal maior"
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
                onChange={(e) => handleNumberInput(e.target.value, setDiagonalMenor)}
                className={inputClassName}
                placeholder="Digite a diagonal menor"
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
              onChange={(e) => handleNumberInput(e.target.value, setLado)}
              className={inputClassName}
              placeholder="Digite o lado"
            />
          </div>
        );
      default:
        return null;
    }
  };

  const getConceitoMatematico = () => {
    switch (figura) {
      case 'quadrado':
        return "Um quadrado é um polígono regular com quatro lados iguais e quatro ângulos retos (90°). " +
               "Sua área é calculada multiplicando o lado por ele mesmo (l²).";
      case 'retangulo':
        return "Um retângulo é um quadrilátero com quatro ângulos retos. " +
               "Sua área é calculada multiplicando o comprimento pela largura.";
      case 'triangulo':
        return "Um triângulo é um polígono com três lados. " +
               "Sua área é calculada multiplicando a base pela altura e dividindo por 2.";
      case 'circulo':
        return "Um círculo é uma figura plana onde todos os pontos estão a uma mesma distância do centro. " +
               "Sua área é calculada multiplicando π pelo quadrado do raio (πr²).";
      case 'trapezio':
        return "Um trapézio é um quadrilátero com dois lados paralelos (bases). " +
               "Sua área é calculada multiplicando a soma das bases pela altura e dividindo por 2.";
      case 'losango':
        return "Um losango é um quadrilátero com quatro lados iguais. " +
               "Sua área é calculada multiplicando suas diagonais e dividindo por 2.";
      case 'hexagono':
        return "Um hexágono regular é um polígono de seis lados iguais e seis ângulos iguais. " +
               "Sua área pode ser calculada usando a fórmula: (3 × √3 × l²) ÷ 2, onde l é o lado.";
      default:
        return "";
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <HiCalculator className="h-6 w-6 text-indigo-600 mr-2" />
        <h2 className="text-2xl font-bold">Calculadora de Áreas de Figuras Planas</h2>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-8">
        <p className="text-gray-700 mb-6">
          Essa calculadora permite calcular a área de diferentes figuras planas geométricas.
          Selecione a figura desejada e insira os dados necessários. A calculadora calculará a área da figura.
        </p>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Selecione a figura
          </label>
          <select
            value={figura}
            onChange={(e) => setFigura(e.target.value as FiguraPlana)}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
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

        {/* Input fields below the selection */}
        <div className="mb-6">
          {renderFields()}
        </div>

        <button
          onClick={handleSolve}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-md transition-colors duration-300"
        >
          Calcular Área
        </button>

        {errorMessage && (
          <div className="mt-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-md">
            {errorMessage}
          </div>
        )}
      </div>

      {result !== null && (
        <div className="space-y-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-5">
            <h3 className="text-lg font-medium text-green-800 mb-2">Resultado</h3>
            <p className="text-xl">
              A área da figura é: <span className="font-bold">{result}</span> unidades quadradas
            </p>
            
            <button 
              onClick={() => setShowExplanation(!showExplanation)}
              className="mt-4 text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center"
            >
              {showExplanation ? "Ocultar explicação detalhada" : "Mostrar explicação detalhada"}
            </button>
          </div>

          {showExplanation && (
            <div className="bg-white shadow-md rounded-lg p-5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800 flex items-center">
                  <HiCalculator className="h-6 w-6 mr-2 text-indigo-600" />
                  Solução passo a passo
                </h3>
              </div>
              
              <div className="space-y-4">
                {steps.map((step, index) => {
                  const stepMatch = step.match(/^(Passo \d+:)(.*)$/);
                  
                  if (stepMatch) {
                    const [_, stepNumber, stepContent] = stepMatch;
                    return (
                      <div key={index} className="p-4 bg-gray-50 rounded-md border-l-4 border-indigo-500">
                        <div className="flex flex-col sm:flex-row">
                          <span className="font-bold text-indigo-700 mr-2 mb-1 sm:mb-0">
                            {stepNumber}
                          </span>
                          <p className="text-gray-800">{stepContent}</p>
                        </div>
                      </div>
                    );
                  } else {
                    return (
                      <div key={index} className="p-3 bg-gray-50 rounded-md ml-4">
                        <p className="text-gray-800">{step}</p>
                      </div>
                    );
                  }
                })}
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-md">
                <h4 className="font-medium text-blue-800 mb-2">Conceito Matemático</h4>
                <div className="space-y-2 text-gray-700">
                  {getConceitoMatematico()}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ResolvedorAreaFigurasPlanas; 
