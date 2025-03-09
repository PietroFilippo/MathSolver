import React, { useState, ReactNode } from 'react';
import { simplificarFracao, FractionDisplay, mdc } from '../../utils/mathUtils';
import { HiCalculator } from 'react-icons/hi';

const ResolvedorSimplificacaoFracoes: React.FC = () => {
  const [numerator, setNumerator] = useState<string>('');
  const [denominator, setDenominator] = useState<string>('');
  const [resultadoNum, setResultadoNum] = useState<number | null>(null);
  const [resultadoDen, setResultadoDen] = useState<number | null>(null);
  const [resultado, setResultado] = useState(false);
  const [steps, setSteps] = useState<(string | ReactNode)[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [showExplanation, setShowExplanation] = useState<boolean>(false);

  const handleSolve = () => {
    // Resetar os valores anteriores e erros
    setResultado(false);
    setSteps([]);
    setErrorMessage('');
    setShowExplanation(false);
    
    // Validar entrada
    const num = parseInt(numerator);
    const den = parseInt(denominator);
    
    if (isNaN(num) || isNaN(den)) {
      setErrorMessage('Por favor, insira números válidos.');
      return;
    }
    
    if (den === 0) {
      setErrorMessage('O denominador não pode ser zero.');
      return;
    }

    // Calcular o MDC e simplificar a fração
    const mdcValue = mdc(Math.abs(num), Math.abs(den));
    const simplified = simplificarFracao(num, den);
    
    setResultadoNum(simplified.numerador);
    setResultadoDen(simplified.denominador);
    setResultado(true);
    setShowExplanation(true);

    // Gerar os passos da explicação
    const calculationSteps: (string | ReactNode)[] = [];
    let stepCount = 1;

    calculationSteps.push(`Passo ${stepCount}: Identificar a fração inicial`);
    calculationSteps.push(<FractionDisplay numerator={num} denominator={den} />);
    stepCount++;

    calculationSteps.push(`Passo ${stepCount}: Calcular o MDC (Máximo Divisor Comum) entre |${num}| e |${den}|`);
    calculationSteps.push(`MDC(${Math.abs(num)}, ${Math.abs(den)}) = ${mdcValue}`);
    stepCount++;

    calculationSteps.push(`Passo ${stepCount}: Dividir o numerador e denominador pelo MDC`);
    calculationSteps.push(`Numerador: ${num} ÷ ${mdcValue} = ${simplified.numerador}`);
    calculationSteps.push(`Denominador: ${den} ÷ ${mdcValue} = ${simplified.denominador}`);
    stepCount++;

    calculationSteps.push(`Passo ${stepCount}: Fração simplificada`);
    calculationSteps.push(<>
      <FractionDisplay numerator={num} denominator={den} /> = 
      <FractionDisplay numerator={simplified.numerador} denominator={simplified.denominador} />
    </>);

    setSteps(calculationSteps);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <HiCalculator className="h-6 w-6 text-indigo-600 mr-2" />
        <h2 className="text-2xl font-bold">Simplificação de Frações</h2>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-8">
        <p className="text-gray-700 mb-6">
          Essa calculadora ajuda a simplificar frações, encontrando a forma mais simples possível.
          Insira o numerador e o denominador da fração abaixo.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fração
            </label>
            <div className="flex items-center">
              <input
                type="number"
                value={numerator}
                onChange={(e) => setNumerator(e.target.value)}
                className="w-20 p-2 border border-gray-300 rounded-l-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Num"
              />
              <div className="px-2 py-2 bg-gray-100 border-t border-b border-gray-300">
                /
              </div>
              <input
                type="number"
                value={denominator}
                onChange={(e) => setDenominator(e.target.value)}
                className="w-20 p-2 border border-gray-300 rounded-r-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Den"
              />
            </div>
          </div>
        </div>

        <button
          onClick={handleSolve}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-md transition-colors duration-300 mt-4"
        >
          Calcular
        </button>

        {errorMessage && (
          <div className="mt-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-md">
            {errorMessage}
          </div>
        )}
      </div>

      {resultado && (
        <div className="space-y-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-5">
            <h3 className="text-lg font-medium text-green-800 mb-2">Resultado</h3>
            <div className="flex items-center">
              <p className="text-xl mr-2">A fração simplificada é: </p>
              {resultadoNum !== null && resultadoDen !== null && (
                <FractionDisplay 
                  numerator={resultadoNum} 
                  denominator={resultadoDen} 
                  className="text-xl"
                />
              )}
              {resultadoNum !== null && resultadoDen !== null && resultadoNum % resultadoDen === 0 && (
                <span className="ml-3">= {resultadoNum / resultadoDen}</span>
              )}
            </div>

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
                  const stepStr = String(step);
                  const stepMatch = stepStr.match(/^(Passo \d+:)(.*)$/);

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
                        {step}
                      </div>
                    );
                  }
                })}
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-md">
                <h4 className="font-medium text-blue-800 mb-2">Conceito Matemático</h4>
                <div className="space-y-2 text-gray-700">
                  <p>
                    <span className="font-semibold">Simplificação de Frações:</span> É o processo de reduzir uma fração à sua forma mais simples, mantendo o mesmo valor.
                  </p>
                  <ol className="list-decimal pl-5 mt-2 space-y-1">
                    <li>Encontrar o MDC (Máximo Divisor Comum):
                      <ul className="list-disc pl-5 mt-1">
                        <li>Usando o algoritmo de Euclides</li>
                        <li>Por decomposição em fatores primos</li>
                        <li>Por divisões sucessivas</li>
                      </ul>
                    </li>
                    <li>Dividir tanto o numerador quanto o denominador pelo MDC</li>
                    <li>Manter os sinais apropriados</li>
                  </ol>
                  
                  <p className="mt-2">
                    <span className="font-semibold">Propriedades:</span>
                  </p>
                  <ul className="list-disc pl-5 mt-1">
                    <li>Uma fração está na forma irredutível quando o MDC entre numerador e denominador é 1</li>
                    <li>Frações equivalentes representam a mesma quantidade</li>           
                    <li>A simplificação não altera o valor da fração</li>           
                  </ul>
                  
                  <p className="mt-2">
                    <span className="font-semibold">Aplicações:</span>
                  </p>
                  <ul className="list-disc pl-5 mt-1">
                    <li>Simplificação de expressões algébricas</li>
                    <li>Redução de razões e proporções</li>           
                    <li>Cálculos em probabilidade</li>           
                    <li>Simplificação de medidas e escalas</li>           
                  </ul>
                  
                  <div className="bg-white p-2 rounded border border-gray-200 mt-2">
                    <p className="text-center">
                      Para simplificar a/b, dividimos ambos por MDC(a,b):<br/>
                      a/b = (a ÷ MDC(a,b))/(b ÷ MDC(a,b))
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

export default ResolvedorSimplificacaoFracoes;
