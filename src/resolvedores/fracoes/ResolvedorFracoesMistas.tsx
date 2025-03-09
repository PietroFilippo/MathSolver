import React, { useState, ReactNode } from 'react';
import { FractionDisplay } from '../../utils/mathUtils';
import { HiCalculator } from 'react-icons/hi';

type Operation = 'toFraction' | 'toMixed';

const ResolvedorFracoesMistas: React.FC = () => {
  const [part, setPart] = useState<string>('');
  const [numerator, setNumerator] = useState<string>('');
  const [denominator, setDenominator] = useState<string>('');
  const [operation, setOperation] = useState<Operation>('toFraction');
  const [resultadoNum, setResultadoNum] = useState<number | null>(null);
  const [resultadoDen, setResultadoDen] = useState<number | null>(null);
  const [resultadoParte, setResultadoParte] = useState<number | null>(null);
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
    setResultadoNum(null);
    setResultadoDen(null);
    setResultadoParte(null);

    if (operation === 'toFraction') {
      const integer = parseInt(part);
      const num = parseInt(numerator);
      const den = parseInt(denominator);

      if (isNaN(integer) || isNaN(num) || isNaN(den)) {
        setErrorMessage('Por favor, insira números válidos.');
        return;
      }

      if (den === 0) {
        setErrorMessage('O denominador não pode ser zero.');
        return;
      }

      // Converter fração mista para fração imprópria
      const novoNumerador = Math.abs(integer) * den + num;
      const novoNumeradorFinal = integer < 0 ? -novoNumerador : novoNumerador;

      setResultadoNum(novoNumeradorFinal);
      setResultadoDen(den);
      setResultado(true);
      setShowExplanation(true);

      // Gerar passos da explicação
      const calculationSteps: (string | ReactNode)[] = [];
      let stepCount = 1;

      calculationSteps.push(`Passo ${stepCount}: Identificar a fração mista`);
      calculationSteps.push(<>
        {integer} + <FractionDisplay numerator={num} denominator={den} />
      </>);
      stepCount++;

      calculationSteps.push(`Passo ${stepCount}: Multiplicar a parte inteira pelo denominador`);
      calculationSteps.push(`${integer} × ${den} = ${Math.abs(integer) * den}`);
      stepCount++;

      calculationSteps.push(`Passo ${stepCount}: Adicionar o numerador`);
      calculationSteps.push(`${Math.abs(integer) * den} + ${num} = ${novoNumerador}`);
      stepCount++;

      if (integer < 0) {
        calculationSteps.push(`Passo ${stepCount}: Aplicar o sinal negativo ao resultado`);
        calculationSteps.push(`-${novoNumerador} = ${novoNumeradorFinal}`);
        stepCount++;
      }

      calculationSteps.push(`Passo ${stepCount}: Fração imprópria resultante`);
      calculationSteps.push(<FractionDisplay numerator={novoNumeradorFinal} denominator={den} />);

      setSteps(calculationSteps);

    } else {
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

      // Converter fração imprópria para fração mista
      const parteInteira = Math.floor(Math.abs(num) / den);
      const novoNumerador = Math.abs(num) % den;
      const sinal = num < 0 ? -1 : 1;

      setResultadoParte(sinal * parteInteira);
      setResultadoNum(novoNumerador);
      setResultadoDen(den);
      setResultado(true);
      setShowExplanation(true);

      // Gerar passos da explicação
      const calculationSteps: (string | ReactNode)[] = [];
      let stepCount = 1;

      calculationSteps.push(`Passo ${stepCount}: Identificar a fração imprópria`);
      calculationSteps.push(<FractionDisplay numerator={num} denominator={den} />);
      stepCount++;

      calculationSteps.push(`Passo ${stepCount}: Dividir o numerador pelo denominador`);
      calculationSteps.push(`${Math.abs(num)} ÷ ${den} = ${parteInteira} com resto ${novoNumerador}`);
      stepCount++;

      if (num < 0) {
        calculationSteps.push(`Passo ${stepCount}: Aplicar o sinal negativo à parte inteira`);
        calculationSteps.push(`-${parteInteira}`);
        stepCount++;
      }

      calculationSteps.push(`Passo ${stepCount}: Fração mista resultante`);
      calculationSteps.push(<>
        {sinal * parteInteira} + <FractionDisplay numerator={novoNumerador} denominator={den} />
      </>);

      setSteps(calculationSteps);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <HiCalculator className="h-6 w-6 text-indigo-600 mr-2" />
        <h2 className="text-2xl font-bold">Conversão de Frações Mistas</h2>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-8">
        <p className="text-gray-700 mb-6">
          Essa calculadora permite converter entre frações mistas e frações impróprias.
          Selecione a operação desejada e insira os valores abaixo.
        </p>

        <div className="mb-6">
          <div className="flex items-center space-x-6 mb-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                checked={operation === 'toFraction'}
                onChange={() => setOperation('toFraction')}
                className="form-radio h-4 w-4 text-indigo-600"
              />
              <span className="ml-2">Fração mista para fração imprópria</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                checked={operation === 'toMixed'}
                onChange={() => setOperation('toMixed')}
                className="form-radio h-4 w-4 text-indigo-600"
              />
              <span className="ml-2">Fração imprópria para fração mista</span>
            </label>
          </div>

          {operation === 'toFraction' ? (
            <div className="flex items-center space-x-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Parte Inteira
                </label>
                <input
                  type="number"
                  value={part}
                  onChange={(e) => setPart(e.target.value)}
                  className="w-20 p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Inteiro"
                />
              </div>
              <div className="pt-8">+</div>
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
          ) : (
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
          )}
        </div>

        <button
          onClick={handleSolve}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-md transition-colors duration-300"
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
              <p className="text-xl mr-2">
                {operation === 'toFraction' ? 'A fração imprópria é: ' : 'A fração mista é: '}
              </p>
              {operation === 'toFraction' ? (
                resultadoNum !== null && resultadoDen !== null && (
                  <FractionDisplay 
                    numerator={resultadoNum} 
                    denominator={resultadoDen} 
                    className="text-xl"
                  />
                )
              ) : (
                <span className="text-xl">
                  {resultadoParte} + {' '}
                  {resultadoNum !== null && resultadoDen !== null && (
                    <FractionDisplay 
                      numerator={resultadoNum} 
                      denominator={resultadoDen} 
                      className="text-xl"
                    />
                  )}
                </span>
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
                    <span className="font-semibold">Frações Mistas e Impróprias:</span> Uma fração mista é composta por uma parte inteira e uma fração própria, enquanto uma fração imprópria tem o numerador maior que o denominador.
                  </p>
                  <ol className="list-decimal pl-5 mt-2 space-y-1">
                    <li>Para converter fração mista para imprópria:
                      <ul className="list-disc pl-5 mt-1">
                        <li>Multiplique a parte inteira pelo denominador</li>
                        <li>Adicione o numerador ao resultado</li>
                        <li>Mantenha o mesmo denominador</li>
                        <li>Aplique o sinal negativo se necessário</li>
                      </ul>
                    </li>
                    <li>Para converter fração imprópria para mista:
                      <ul className="list-disc pl-5 mt-1">
                        <li>Divida o numerador pelo denominador</li>
                        <li>O quociente será a parte inteira</li>
                        <li>O resto será o novo numerador</li>
                        <li>Mantenha o mesmo denominador</li>
                      </ul>
                    </li>
                  </ol>
        
                  <p className="mt-2">
                    <span className="font-semibold">Fórmulas:</span>
                  </p>
                  <div className="bg-white p-2 rounded border border-gray-200 my-2">
                    <p>Mista para Imprópria: a + b/c = (a×c + b)/c</p>
                    <p>Imprópria para Mista: n/d = q + r/d, onde q = ⌊n/d⌋ e r = n mod d</p>
                  </div>
        
                  <p className="mt-2">
                    <span className="font-semibold">Aplicações:</span>
                  </p>
                  <ul className="list-disc pl-5 mt-1">
                    <li>Medidas e quantidades em receitas</li>
                    <li>Cálculos em construção civil</li>
                    <li>Medições em carpintaria</li>
                    <li>Resolução de problemas algébricos</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ResolvedorFracoesMistas; 
