import React, { useState, ReactNode } from 'react';
import { FractionDisplay, getMixedFractionExamples } from '../../utils/mathUtilsFracoes';
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

  // Função para aplicar um exemplo
  const applyExample = (example: {
    part?: number,
    num: number,
    den: number,
    operation: 'toFraction' | 'toMixed'
  }) => {
    setOperation(example.operation);
    
    if (example.operation === 'toFraction') {
      setPart(example.part?.toString() || '');
      setNumerator(example.num.toString());
      setDenominator(example.den.toString());
    } else {
      setPart('');
      setNumerator(example.num.toString());
      setDenominator(example.den.toString());
    }
  };

  // Função para filtrar exemplos com base na operação selecionada
  const getFilteredExamples = () => {
    return getMixedFractionExamples().filter(example => example.operation === operation);
  };

  // Função para renderizar os passos de explicação com estilização aprimorada
  const renderExplanationSteps = () => {
    return (
      <div className="space-y-4">
        {steps.map((step, index) => {
          // Verifica se é uma string ou um ReactNode
          const isString = typeof step === 'string';
          if (!isString) {
            // Se for um ReactNode (por exemplo, um elemento de fração), renderiza diretamente
            return (
              <div key={index} className="p-3 bg-indigo-50 rounded-md ml-4 border-l-2 border-indigo-300">
                <div className="text-indigo-700 font-medium">{step}</div>
              </div>
            );
          }

          // Para strings, verifica diferentes padrões
          const stepStr = String(step);
          const stepMatch = stepStr.match(/^(Passo \d+:)(.*)$/);
          
          // Verifica se é uma multiplicação
          const multiplicationMatch = stepStr.includes('×') && stepStr.includes('=');
          
          // Verifica se é uma adição
          const additionMatch = stepStr.includes('+') && stepStr.includes('=');
          
          // Verifica se é uma divisão
          const divisionMatch = stepStr.includes('÷') && stepStr.includes('=');
          
          // Verifica se é aplicação de sinal negativo
          const negativeMatch = stepStr.startsWith('-') || stepStr.includes('sinal negativo');
          
          if (stepMatch) {
            // Se for um passo com número, extrai e destaca o número
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
          } else if (multiplicationMatch) {
            // Se for uma multiplicação
            return (
              <div key={index} className="p-3 bg-purple-50 rounded-md ml-4 border-l-2 border-purple-300">
                <p className="text-purple-700 font-medium">{step}</p>
              </div>
            );
          } else if (additionMatch) {
            // Se for uma adição
            return (
              <div key={index} className="p-3 bg-blue-50 rounded-md ml-4 border-l-2 border-blue-300">
                <p className="text-blue-700 font-medium">{step}</p>
              </div>
            );
          } else if (divisionMatch) {
            // Se for uma divisão
            return (
              <div key={index} className="p-3 bg-amber-50 rounded-md ml-4 border-l-2 border-amber-300">
                <p className="text-amber-700 font-medium">{step}</p>
              </div>
            );
          } else if (negativeMatch) {
            // Se for aplicação de sinal negativo
            return (
              <div key={index} className="p-3 bg-red-50 rounded-md ml-4 border-l-2 border-red-300">
                <p className="text-red-700 font-medium">{step}</p>
              </div>
            );
          } else {
            // Conteúdo regular sem classificação específica
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

        {/* Exemplos de frações mistas */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Exemplos
          </label>
          <div className="flex flex-wrap gap-2 mb-4">
            {getFilteredExamples().map((example, index) => (
              <button
                key={index}
                onClick={() => applyExample(example)}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-full transition-colors"
              >
                {example.description}
              </button>
            ))}
          </div>
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
                      <h5 className="font-medium text-gray-800 mb-2 border-b border-gray-200 pb-1">Frações Mistas e Impróprias</h5>
                      <div className="space-y-3">
                        <p className="text-gray-700">
                          As frações mistas e impróprias são duas formas diferentes de representar quantidades fracionárias:
                        </p>
                        <div className="bg-white p-3 rounded-md border border-gray-100 shadow-sm">
                          <h6 className="text-indigo-700 font-medium mb-2">Definições</h6>
                          <div className="space-y-2">
                            <p className="text-sm">
                              <span className="font-medium">Fração Mista:</span> Consiste em uma parte inteira seguida de uma fração própria.
                              Exemplo: 2³/₄ (dois e três quartos)
                            </p>
                            <p className="text-sm">
                              <span className="font-medium">Fração Imprópria:</span> Tem o numerador maior ou igual ao denominador.
                              Exemplo: ¹¹/₄ (onze quartos)
                            </p>
                          </div>
                        </div>
                        <div className="p-3 bg-indigo-50 rounded-md">
                          <h6 className="text-indigo-700 font-medium mb-2">Conversão entre Frações</h6>
                          <div className="space-y-2 text-sm text-gray-700">
                            <p className="font-medium text-indigo-800">Mista para Imprópria:</p>
                            <div className="bg-white p-2 rounded-md text-center">
                              a + b/c = (a×c + b)/c
                            </div>
                            <p className="font-medium text-indigo-800 mt-3">Imprópria para Mista:</p>
                            <div className="bg-white p-2 rounded-md text-center">
                              n/d = q + r/d<br />
                              <span className="text-xs">onde q = ⌊n/d⌋ (parte inteira) e r = n mod d (resto)</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <h5 className="font-medium text-gray-800 mb-2 border-b border-gray-200 pb-1">Processo de Conversão</h5>
                      <div className="bg-white p-3 rounded-md border border-gray-100 shadow-sm space-y-4">
                        <div>
                          <h6 className="text-indigo-700 font-medium mb-2">Fração Mista para Imprópria</h6>
                          <ol className="text-sm space-y-2 list-decimal pl-5 text-gray-700">
                            <li>
                              Multiplique a parte inteira pelo denominador da fração
                              <p className="text-xs mt-1 text-indigo-600">
                                Para 2³/₄: 2 × 4 = 8
                              </p>
                            </li>
                            <li>
                              Adicione o numerador ao resultado
                              <p className="text-xs mt-1 text-indigo-600">
                                8 + 3 = 11
                              </p>
                            </li>
                            <li>
                              Use o resultado como novo numerador, mantendo o mesmo denominador
                              <p className="text-xs mt-1 text-indigo-600">
                                Resultado: ¹¹/₄
                              </p>
                            </li>
                          </ol>
                        </div>
                        
                        <div className="pt-2 border-t border-gray-100">
                          <h6 className="text-indigo-700 font-medium mb-2">Fração Imprópria para Mista</h6>
                          <ol className="text-sm space-y-2 list-decimal pl-5 text-gray-700">
                            <li>
                              Divida o numerador pelo denominador para obter o quociente e o resto
                              <p className="text-xs mt-1 text-indigo-600">
                                Para ¹¹/₄: 11 ÷ 4 = 2 (quociente) com resto 3
                              </p>
                            </li>
                            <li>
                              O quociente será a parte inteira
                              <p className="text-xs mt-1 text-indigo-600">
                                Parte inteira: 2
                              </p>
                            </li>
                            <li>
                              O resto será o novo numerador, com o mesmo denominador
                              <p className="text-xs mt-1 text-indigo-600">
                                Resultado: 2³/₄
                              </p>
                            </li>
                          </ol>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white p-3 rounded-md border border-gray-100 shadow-sm">
                      <h5 className="font-medium text-gray-800 mb-2">Casos Especiais</h5>
                      <div className="space-y-3">
                        <div className="p-2 bg-indigo-50 rounded-md">
                          <p className="text-sm text-indigo-700 font-medium mb-1">
                            Frações com Numerador Zero
                          </p>
                          <p className="text-xs text-gray-700">
                            Se o numerador for zero, a fração mista será apenas a parte inteira.
                            Exemplo: 5⁰/₄ = 5
                          </p>
                        </div>
                        
                        <div className="p-2 bg-purple-50 rounded-md">
                          <p className="text-sm text-purple-700 font-medium mb-1">
                            Frações Negativas
                          </p>
                          <p className="text-xs text-gray-700">
                            Com frações negativas, o sinal negativo aplica-se à fração inteira.
                            Exemplo: -7³/₄ é convertido para -³¹/₄ (e não -²⁸/₄)
                          </p>
                        </div>
                        
                        <div className="p-2 bg-amber-50 rounded-md">
                          <p className="text-sm text-amber-700 font-medium mb-1">
                            Resto Zero
                          </p>
                          <p className="text-xs text-gray-700">
                            Se o resto for zero ao converter para fração mista, temos apenas a parte inteira.
                            Exemplo: ¹²/₄ = 3⁰/₄ = 3
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-yellow-50 p-3 rounded-md border-l-4 border-yellow-400">
                        <h5 className="font-medium text-yellow-800 mb-2">Dicas Práticas</h5>
                        <ul className="text-sm space-y-1 list-disc pl-4 text-gray-700">
                          <li>Frações mistas são comumente usadas para medidas no cotidiano (2½ xícaras)</li>
                          <li>Frações impróprias são mais úteis em cálculos matemáticos intermediários</li>
                          <li>Ao converter para fração imprópria, certifique-se de multiplicar o inteiro pelo denominador (não pelo numerador)</li>
                          <li>Lembre-se que a divisão para encontrar a parte inteira é uma divisão inteira (ignora-se a parte decimal)</li>
                          <li>Realize a verificação: a fração imprópria, quando avaliada, deve ter o mesmo valor da fração mista</li>
                        </ul>
                      </div>
                      
                      <div className="bg-green-50 p-3 rounded-md border border-green-100">
                        <h5 className="font-medium text-green-800 mb-2">Aplicações Práticas</h5>
                        <ul className="text-sm space-y-1 list-disc pl-4 text-gray-700">
                          <li>Medidas em receitas culinárias (2½ colheres)</li>
                          <li>Medições em construção (3¾ metros)</li>
                          <li>Representação de tempo (2¼ horas)</li>
                          <li>Representação de pesos e volumes</li>
                          <li>Em música, para representação de compassos</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-3 bg-indigo-50 rounded-md border border-indigo-100">
                    <h5 className="font-medium text-indigo-800 mb-1 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      Importância nas Operações Matemáticas
                    </h5>
                    <p className="text-sm text-indigo-700">
                      A capacidade de converter entre frações mistas e impróprias é fundamental em álgebra e cálculo. 
                      Em operações como adição, subtração, multiplicação e divisão de frações, muitas vezes é mais 
                      conveniente trabalhar com frações impróprias para realizar os cálculos, e depois converter o resultado 
                      para uma fração mista para facilitar a interpretação.
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

export default ResolvedorFracoesMistas; 
