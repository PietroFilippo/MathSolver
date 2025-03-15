import React, { useState } from 'react';
import { HiCalculator } from 'react-icons/hi';
import {
    squareArea,
    rectangleArea,
    triangleArea,
    circleArea,
    trapezoidArea,
    rhombusArea,
    hexagonArea,
    getAreaExamples
} from '../../utils/mathUtilsGeometria';

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

  // Função para aplicar um exemplo
  const applyExample = (exemplo: { valores: Record<string, number> }) => {
    // Resetar todos os valores primeiro
    setLado('');
    setComprimento('');
    setLargura('');
    setBase('');
    setBaseMaior('');
    setBaseMenor('');
    setAltura('');
    setRaio('');
    setDiagonalMaior('');
    setDiagonalMenor('');
    
    // Aplicar os valores do exemplo
    for (const [key, value] of Object.entries(exemplo.valores)) {
      switch (key) {
        case 'lado':
          setLado(value.toString());
          break;
        case 'comprimento':
          setComprimento(value.toString());
          break;
        case 'largura':
          setLargura(value.toString());
          break;
        case 'base':
          setBase(value.toString());
          break;
        case 'baseMaior':
          setBaseMaior(value.toString());
          break;
        case 'baseMenor':
          setBaseMenor(value.toString());
          break;
        case 'altura':
          setAltura(value.toString());
          break;
        case 'raio':
          setRaio(value.toString());
          break;
        case 'diagonalMaior':
          setDiagonalMaior(value.toString());
          break;
        case 'diagonalMenor':
          setDiagonalMenor(value.toString());
          break;
      }
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
          
          area = squareArea(l);
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

          area = rectangleArea(c, l);
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

          area = triangleArea(b, h);
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

          area = circleArea(r);
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

          area = trapezoidArea(B, b, h);
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

          area = rhombusArea(D, d);
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

          area = hexagonArea(l);
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
              placeholder="Digite o valor do lado"
            />
          </div>
        );
      default:
        return null;
    }
  };

  // Função para renderizar os passos de explicação com estilização aprimorada
  const renderExplanationSteps = () => {
    return (
      <div className="space-y-4">
        {steps.map((step, index) => {
          const stepMatch = step.match(/^(Passo \d+:)(.*)$/);
          
          // Verifica se é um passo de aplicação de fórmula
          const formulaMatch = step.includes('calculada pela fórmula');
          
          // Verifica se é um passo de substituição de valores
          const substitutionMatch = step.includes('Substituindo');
          
          // Verifica se é um cálculo direto
          const calculationMatch = step.startsWith('A =') && !step.includes('unidades quadradas');
          
          // Verifica se é o resultado final
          const resultMatch = step.includes('unidades quadradas');
          
          if (stepMatch) {
            // Se for um passo numerado, extrai e destaca o número
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
          } else if (formulaMatch) {
            // Se for uma explicação de fórmula
            return (
              <div key={index} className="p-3 bg-blue-50 rounded-md ml-4 border-l-2 border-blue-300">
                <p className="text-blue-700 font-medium">{step}</p>
              </div>
            );
          } else if (substitutionMatch) {
            // Se for um passo de substituição
            return (
              <div key={index} className="p-3 bg-purple-50 rounded-md ml-4 border-l-2 border-purple-300">
                <p className="text-purple-700 font-medium">{step}</p>
              </div>
            );
          } else if (calculationMatch) {
            // Se for um cálculo direto
            return (
              <div key={index} className="p-3 bg-amber-50 rounded-md ml-4 border-l-2 border-amber-300">
                <p className="text-amber-700 font-medium">{step}</p>
              </div>
            );
          } else if (resultMatch) {
            // Se for o resultado final
            return (
              <div key={index} className="p-3 bg-green-50 rounded-md ml-4 border-l-2 border-green-300">
                <p className="text-green-700 font-medium">{step}</p>
              </div>
            );
          } else {
            // Outro tipo de passo
            return (
              <div key={index} className="p-3 bg-gray-50 rounded-md ml-4">
                <p className="text-gray-800">{step}</p>
              </div>
            );
          }
        })}
      </div>
    );
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

        {/* Exemplos */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Exemplos
          </label>
          <div className="flex flex-wrap gap-2 mb-4">
            {getAreaExamples(figura).map((exemplo, index) => (
              <button
                key={index}
                onClick={() => applyExample(exemplo)}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-full transition-colors"
              >
                {exemplo.description}
              </button>
            ))}
          </div>
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
                  Explicação Detalhada
                </h3>
              </div>

              {renderExplanationSteps()}
              
              <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100 overflow-hidden">
                <div className="px-4 py-3 bg-blue-100 border-b border-blue-200">
                  <h4 className="font-semibold text-blue-800 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Conceito Matemático
                  </h4>
                </div>
                <div className="p-4">
                  <div className="flex flex-col md:flex-row gap-4 mb-4">
                    <div className="flex-1">
                      <h5 className="font-medium text-gray-800 mb-2 border-b border-gray-200 pb-1">Área de Figuras Planas</h5>
                      <div className="space-y-3">
                        <p className="text-gray-700">
                          A área de uma figura plana é a medida da região do plano ocupada pela figura, 
                          expressa em unidades quadradas, como centímetros quadrados (cm²) ou metros quadrados (m²).
                        </p>
                        <div className="bg-white p-3 rounded-md border border-gray-100 shadow-sm">
                          <h6 className="text-indigo-700 font-medium mb-2">Fórmulas de Área</h6>
                          <div className="space-y-2 text-sm text-gray-700">
                            {figura === 'quadrado' && (
                              <div className="p-2 border-b border-gray-50">
                                <span className="font-medium">Quadrado:</span> A = l², onde l é o comprimento do lado
                              </div>
                            )}
                            {figura === 'retangulo' && (
                              <div className="p-2 border-b border-gray-50">
                                <span className="font-medium">Retângulo:</span> A = c × l, onde c é o comprimento e l é a largura
                              </div>
                            )}
                            {figura === 'triangulo' && (
                              <div className="p-2 border-b border-gray-50">
                                <span className="font-medium">Triângulo:</span> A = (b × h) ÷ 2, onde b é a base e h é a altura
                              </div>
                            )}
                            {figura === 'circulo' && (
                              <div className="p-2 border-b border-gray-50">
                                <span className="font-medium">Círculo:</span> A = πr², onde r é o raio e π ≈ 3,14159...
                              </div>
                            )}
                            {figura === 'trapezio' && (
                              <div className="p-2 border-b border-gray-50">
                                <span className="font-medium">Trapézio:</span> A = [(B + b) × h] ÷ 2, onde B é a base maior, b é a base menor e h é a altura
                              </div>
                            )}
                            {figura === 'losango' && (
                              <div className="p-2 border-b border-gray-50">
                                <span className="font-medium">Losango:</span> A = (D × d) ÷ 2, onde D é a diagonal maior e d é a diagonal menor
                              </div>
                            )}
                            {figura === 'hexagono' && (
                              <div className="p-2 border-b border-gray-50">
                                <span className="font-medium">Hexágono Regular:</span> A = (3 × √3 × l²) ÷ 2, onde l é o lado
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="p-3 bg-indigo-50 rounded-md">
                          <h6 className="text-indigo-700 font-medium mb-2">Princípios Fundamentais</h6>
                          <ul className="text-sm space-y-1 list-disc pl-4 text-gray-700">
                            <li>A área é uma grandeza bidimensional e deve ser expressa em unidades quadradas</li>
                            <li>Figuras com o mesmo perímetro podem ter áreas diferentes</li>
                            <li>Figuras semelhantes têm suas áreas proporcionais ao quadrado da razão de semelhança</li>
                            <li>A área de um polígono regular pode ser calculada conhecendo-se o número de lados, o comprimento do lado ou o raio da circunferência circunscrita</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <h5 className="font-medium text-gray-800 mb-2 border-b border-gray-200 pb-1">Características da Figura</h5>
                      <div className="bg-white p-3 rounded-md border border-gray-100 shadow-sm space-y-4">
                        <div className="space-y-2">
                          {figura === 'quadrado' && (
                            <>
                              <h6 className="text-indigo-700 font-medium">Quadrado</h6>
                              <p className="text-sm text-gray-700">Um quadrado é um polígono regular com quatro lados iguais e quatro ângulos retos (90°).</p>
                              <ul className="text-xs space-y-1 list-disc pl-4 text-gray-600">
                                <li>Todos os lados têm o mesmo comprimento</li>
                                <li>Todos os ângulos internos medem 90°</li>
                                <li>As diagonais são iguais, perpendiculares entre si e bissetoras uma da outra</li>
                                <li>Perímetro = 4 × lado</li>
                                <li>Diagonal = lado × √2</li>
                              </ul>
                            </>
                          )}
                          {figura === 'retangulo' && (
                            <>
                              <h6 className="text-indigo-700 font-medium">Retângulo</h6>
                              <p className="text-sm text-gray-700">Um retângulo é um quadrilátero com quatro ângulos retos.</p>
                              <ul className="text-xs space-y-1 list-disc pl-4 text-gray-600">
                                <li>Lados opostos são paralelos e iguais</li>
                                <li>Todos os ângulos internos medem 90°</li>
                                <li>As diagonais são iguais e bissetoras uma da outra</li>
                                <li>Perímetro = 2 × (comprimento + largura)</li>
                                <li>Diagonal = √(comprimento² + largura²)</li>
                              </ul>
                            </>
                          )}
                          {figura === 'triangulo' && (
                            <>
                              <h6 className="text-indigo-700 font-medium">Triângulo</h6>
                              <p className="text-sm text-gray-700">Um triângulo é um polígono com três lados e três ângulos.</p>
                              <ul className="text-xs space-y-1 list-disc pl-4 text-gray-600">
                                <li>A soma dos ângulos internos é sempre 180°</li>
                                <li>A altura é a distância perpendicular de um vértice ao lado oposto</li>
                                <li>Pode ser classificado quanto aos lados (equilátero, isósceles, escaleno) ou ângulos (acutângulo, retângulo, obtusângulo)</li>
                                <li>Perímetro = soma dos três lados</li>
                                <li>Existem outras fórmulas para calcular a área, como a Fórmula de Heron</li>
                              </ul>
                            </>
                          )}
                          {figura === 'circulo' && (
                            <>
                              <h6 className="text-indigo-700 font-medium">Círculo</h6>
                              <p className="text-sm text-gray-700">Um círculo é uma figura plana onde todos os pontos estão a uma mesma distância do centro.</p>
                              <ul className="text-xs space-y-1 list-disc pl-4 text-gray-600">
                                <li>O raio é a distância do centro a qualquer ponto da circunferência</li>
                                <li>O diâmetro é o dobro do raio e passa pelo centro do círculo</li>
                                <li>A circunferência é o contorno do círculo</li>
                                <li>Perímetro (circunferência) = 2πr</li>
                                <li>O número π (pi) é uma constante aproximadamente igual a 3,14159...</li>
                              </ul>
                            </>
                          )}
                          {figura === 'trapezio' && (
                            <>
                              <h6 className="text-indigo-700 font-medium">Trapézio</h6>
                              <p className="text-sm text-gray-700">Um trapézio é um quadrilátero com dois lados paralelos (bases).</p>
                              <ul className="text-xs space-y-1 list-disc pl-4 text-gray-600">
                                <li>As bases são os lados paralelos (uma base maior e uma base menor)</li>
                                <li>A altura é a distância perpendicular entre as bases</li>
                                <li>Um trapézio isósceles tem os lados não-paralelos iguais</li>
                                <li>Um trapézio retângulo tem dois ângulos retos</li>
                                <li>Perímetro = soma dos quatro lados</li>
                              </ul>
                            </>
                          )}
                          {figura === 'losango' && (
                            <>
                              <h6 className="text-indigo-700 font-medium">Losango</h6>
                              <p className="text-sm text-gray-700">Um losango é um quadrilátero com quatro lados iguais.</p>
                              <ul className="text-xs space-y-1 list-disc pl-4 text-gray-600">
                                <li>Todos os lados têm o mesmo comprimento</li>
                                <li>Lados opostos são paralelos</li>
                                <li>As diagonais são perpendiculares entre si e bissetoras uma da outra</li>
                                <li>Perímetro = 4 × lado</li>
                                <li>Também é possível calcular a área usando o lado e o ângulo: A = lado² × sen(ângulo)</li>
                              </ul>
                            </>
                          )}
                          {figura === 'hexagono' && (
                            <>
                              <h6 className="text-indigo-700 font-medium">Hexágono Regular</h6>
                              <p className="text-sm text-gray-700">Um hexágono regular é um polígono de seis lados iguais e seis ângulos iguais.</p>
                              <ul className="text-xs space-y-1 list-disc pl-4 text-gray-600">
                                <li>Todos os lados têm o mesmo comprimento</li>
                                <li>Todos os ângulos internos medem 120°</li>
                                <li>A soma dos ângulos internos é 720° (6 × 120°)</li>
                                <li>Perímetro = 6 × lado</li>
                                <li>Pode ser dividido em 6 triângulos equiláteros iguais</li>
                                <li>Apótema (distância do centro ao meio de cada lado) = (√3 × lado) ÷ 2</li>
                              </ul>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white p-3 rounded-md border border-gray-100 shadow-sm">
                      <h5 className="font-medium text-gray-800 mb-2">Aplicações Práticas</h5>
                      <div className="space-y-2">
                        <p className="text-sm text-gray-700">O cálculo de áreas é essencial em diversos contextos:</p>
                        <ul className="text-sm space-y-1 list-disc pl-4 text-gray-700">
                          <li><span className="font-medium">Arquitetura e Construção:</span> Cálculo de materiais como pisos, pinturas, etc.</li>
                          <li><span className="font-medium">Agrimensura:</span> Medição de terrenos e propriedades</li>
                          <li><span className="font-medium">Design:</span> Desenvolvimento de layouts e estimativas de materiais</li>
                          <li><span className="font-medium">Geografia:</span> Cálculo de áreas de regiões, países, lagos</li>
                          <li><span className="font-medium">Biologia:</span> Estimativa de superfícies de folhas, órgãos, etc.</li>
                          <li><span className="font-medium">Economia:</span> Cálculo de custos baseados em área</li>
                        </ul>
                      </div>
                    </div>

                    <div className="bg-yellow-50 p-3 rounded-md border-l-4 border-yellow-400">
                      <h5 className="font-medium text-yellow-800 mb-2">Dicas de Resolução</h5>
                      <ul className="text-sm space-y-1 list-disc pl-4 text-gray-700">
                        <li>Sempre verifique se todas as medidas estão na mesma unidade</li>
                        <li>Desenhe a figura e identifique todas as medidas conhecidas</li>
                        <li>Para figuras complexas, divida-as em figuras mais simples e some as áreas</li>
                        <li>Em fórmulas com radicais, mantenha o valor exato quando possível</li>
                        <li>Lembre-se que a área é sempre expressa em unidades quadradas</li>
                        <li>Para converter entre unidades de área, lembre-se que 1 m² = 10.000 cm²</li>
                      </ul>
                    </div>
              </div>
              
                  <div className="mt-4 p-3 bg-indigo-50 rounded-md border border-indigo-100">
                    <h5 className="font-medium text-indigo-800 mb-1 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      Relação com Outros Conceitos
                    </h5>
                    <p className="text-sm text-indigo-700">
                      O cálculo de áreas está relacionado com diversos conceitos matemáticos, incluindo geometria 
                      analítica, trigonometria, cálculo integral e álgebra. No cálculo avançado, a integração pode 
                      ser usada para determinar áreas de regiões delimitadas por curvas. Além disso, o conceito de 
                      área é fundamental para entender outros conceitos como densidade superficial, fluxo de campos 
                      vetoriais e o Teorema de Green na análise matemática.
                    </p>
                  </div>
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
