import React, { useState, ReactNode } from 'react';
import { HiCalculator } from 'react-icons/hi';
import { gcd } from '../../utils/mathUtils';
import { simplifyFraction, FractionDisplay, getFractionMultDivExamples } from '../../utils/mathUtilsFracoes';

type Operation = 'multiply' | 'divide';

const ResolvedorMultDivFracao: React.FC = () => {
  const [numerator1, setNumerator1] = useState<string>('');
  const [denominator1, setDenominator1] = useState<string>('');
  const [numerator2, setNumerator2] = useState<string>('');
  const [denominator2, setDenominator2] = useState<string>('');
  const [operation, setOperation] = useState<Operation>('multiply');
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
    
    const num1 = parseInt(numerator1);
    const den1 = parseInt(denominator1);
    const num2 = parseInt(numerator2);
    const den2 = parseInt(denominator2);
    
    // Validação de inputs
    if (isNaN(num1) || isNaN(den1) || isNaN(num2) || isNaN(den2)) {
      setErrorMessage('Por favor, preencha todos os campos com valores numéricos.');
      return;
    }
    
    if (den1 === 0 || den2 === 0) {
      setErrorMessage('O denominador não pode ser zero.');
      return;
    }
    
    if (operation === 'divide' && num2 === 0) {
      setErrorMessage('Não é possível dividir por zero.');
      return;
    }
    
    // Cálculos com base na operação selecionada
    let resultNumerator: number;
    let resultDenominator: number;
    
    if (operation === 'multiply') {
      resultNumerator = num1 * num2;
      resultDenominator = den1 * den2;
    } else { // divide
      resultNumerator = num1 * den2;
      resultDenominator = den1 * num2;
    }
    
    // Simplificar a fração resultante
    const simplified = simplifyFraction(resultNumerator, resultDenominator);
    const simplifiedNum = simplified.numerador;
    const simplifiedDen = simplified.denominador;
    
    setResultadoNum(simplifiedNum);
    setResultadoDen(simplifiedDen);
    setResultado(true);
    setShowExplanation(true);
    
    // Gerar os passos da explicação
    const calculationSteps = [];
    let stepCount = 1;
    
    calculationSteps.push(`Passo ${stepCount}: Identificar as frações e a operação`);
    calculationSteps.push(<>
        {operation === 'multiply' ? (
            <>Multiplicação: <FractionDisplay numerator={num1} denominator={den1} /> × <FractionDisplay numerator={num2} denominator={den2} /></>
        ) : (
            <>Divisão: <FractionDisplay numerator={num1} denominator={den1} /> ÷ <FractionDisplay numerator={num2} denominator={den2} /></>
        )}
    </>);
    stepCount++;
    
    if (operation === 'multiply') {
        calculationSteps.push(`Passo ${stepCount}: Multiplicar os numeradores`);
        calculationSteps.push(`${num1} × ${num2} = ${resultNumerator}`);
        stepCount++;
        
        calculationSteps.push(`Passo ${stepCount}: Multiplicar os denominadores`);
        calculationSteps.push(`${den1} × ${den2} = ${resultDenominator}`);
        stepCount++;
    } else {
        calculationSteps.push(`Passo ${stepCount}: Inverter a segunda fração`);
        calculationSteps.push(<>
            <FractionDisplay numerator={num1} denominator={den1} /> ÷ <FractionDisplay numerator={num2} denominator={den2} /> = 
            <FractionDisplay numerator={num1} denominator={den1} /> × <FractionDisplay numerator={den2} denominator={num2} />
        </>);
        stepCount++;
        
        calculationSteps.push(`Passo ${stepCount}: Multiplicar os numeradores`);
        calculationSteps.push(`${num1} × ${den2} = ${resultNumerator}`);
        stepCount++;
        
        calculationSteps.push(`Passo ${stepCount}: Multiplicar os denominadores`);
        calculationSteps.push(`${den1} × ${num2} = ${resultDenominator}`);
        stepCount++;
    }
    
    if (resultNumerator !== simplifiedNum || resultDenominator !== simplifiedDen) {
        const mdcValue = gcd(Math.abs(resultNumerator), Math.abs(resultDenominator));
        calculationSteps.push(`Passo ${stepCount}: Simplificar a fração resultante`);
        calculationSteps.push(`MDC(${Math.abs(resultNumerator)}, ${Math.abs(resultDenominator)}) = ${mdcValue}`);
        calculationSteps.push(<>
            <FractionDisplay numerator={resultNumerator} denominator={resultDenominator} /> ÷ 
            <FractionDisplay numerator={mdcValue} denominator={mdcValue} /> = 
            <FractionDisplay numerator={simplifiedNum} denominator={simplifiedDen} />
        </>);
    }
    
    setSteps(calculationSteps);
  };

  // Função para aplicar um exemplo
  const applyExample = (example: { 
    num1: number, 
    den1: number, 
    num2: number, 
    den2: number, 
    operation: 'multiply' | 'divide' 
  }) => {
    setNumerator1(example.num1.toString());
    setDenominator1(example.den1.toString());
    setNumerator2(example.num2.toString());
    setDenominator2(example.den2.toString());
    setOperation(example.operation);
  };

  // Função para filtrar exemplos com base na operação selecionada
  const getFilteredExamples = () => {
    return getFractionMultDivExamples().filter(example => example.operation === operation);
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
          
          // Verifica se é uma multiplicação de numeradores ou denominadores
          const multiplicationMatch = stepStr.includes('×') && stepStr.includes('=');
          
          // Verifica se é MDC para simplificação
          const mdcMatch = stepStr.startsWith('MDC(');
          
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
            // Se for uma multiplicação de numeradores ou denominadores
            return (
              <div key={index} className="p-3 bg-purple-50 rounded-md ml-4 border-l-2 border-purple-300">
                <p className="text-purple-700 font-medium">{step}</p>
              </div>
            );
          } else if (mdcMatch) {
            // Se for MDC para simplificação
            return (
              <div key={index} className="p-3 bg-green-50 rounded-md ml-4 border-l-2 border-green-300">
                <p className="text-green-700 font-medium">{step}</p>
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
            <h2 className="text-2xl font-bold">Multiplicação e Divisão de Frações </h2>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-8">
            <p className="text-gray-700 mb-6">
                Essa calculadora ajuda a resolver multiplicações e divisões de frações.
                Insira o numerador e o denominador de cada fração abaixo e escolha a operação desejada.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Fração 1
                    </label>
                    <div className="flex items-center">
                        <input
                            type="number"
                            value={numerator1}
                            onChange={(e) => setNumerator1(e.target.value)}
                            className="w-20 p-2 border border-gray-300 rounded-l-md focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Num"
                        />
                        <div className="px-2 py-2 bg-gray-100 border-t border-b border-gray-300">
                            /
                        </div>
                        <input
                            type="number"
                            value={denominator1}
                            onChange={(e) => setDenominator1(e.target.value)}
                            className="w-20 p-2 border border-gray-300 rounded-r-md focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Den"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Fração 2
                    </label>
                    <div className="flex items-center">
                        <input
                            type="number"
                            value={numerator2}
                            onChange={(e) => setNumerator2(e.target.value)}
                            className="w-20 p-2 border border-gray-300 rounded-l-md focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Num"
                        />
                        <div className="px-2 py-2 bg-gray-100 border-t border-b border-gray-300">
                            /
                        </div>
                        <input
                            type="number"
                            value={denominator2}
                            onChange={(e) => setDenominator2(e.target.value)}
                            className="w-20 p-2 border border-gray-300 rounded-r-md focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Den"
                        />
                    </div>
                </div>
            </div>

            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Operação
                </label>
                <div className="flex space-x-4">
                    <label className="inline-flex items-center">
                        <input
                            type="radio"
                            value="multiply"
                            checked={operation === 'multiply'}
                            onChange={() => setOperation('multiply')}
                            className="form-radio h-4 w-4 text-indigo-600"
                        />
                        <span className="ml-2">Multiplicação (*)</span>
                    </label>
                    <label className="inline-flex items-center">
                        <input
                            type="radio"
                            checked={operation === 'divide'}
                            onChange={() => setOperation('divide')}
                            className="form-radio h-4 w-4 text-indigo-600"
                        />
                        <span className="ml-2">Divisão (/)</span>
                    </label>
                </div>
            </div>

            {/* Exemplos de frações */}
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
              <p className="text-xl mr-2">
                {operation === 'multiply' ? 'O resultado da multiplicação é: ' : 'O resultado da divisão é: '}
              </p>
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
                      <h5 className="font-medium text-gray-800 mb-2 border-b border-gray-200 pb-1">Multiplicação e Divisão de Frações</h5>
                      <div className="space-y-3">
                        <p className="text-gray-700">
                          A multiplicação e divisão de frações são operações fundamentais que seguem regras diferentes 
                          da adição e subtração, pois não exigem um denominador comum para serem realizadas.
                        </p>
                        <div className="bg-white p-3 rounded-md border border-gray-100 shadow-sm">
                          <h6 className="text-indigo-700 font-medium mb-2">Fórmulas</h6>
                          <div className="space-y-2 text-center font-medium text-indigo-700">
                            <p>
                              <span className="font-semibold">Multiplicação:</span><br />
                              a/b × c/d = (a×c)/(b×d)
                            </p>
                            <p className="text-sm pt-2 border-t border-gray-100">
                              <span className="font-semibold">Divisão:</span><br />
                              a/b ÷ c/d = a/b × d/c = (a×d)/(b×c)
                            </p>
                          </div>
                        </div>
                        <div className="p-3 bg-indigo-50 rounded-md">
                          <p className="text-sm text-indigo-700">
                            <span className="font-medium">Propriedade fundamental:</span> Para dividir por uma fração, 
                            multiplicamos pela sua fração invertida (recíproco). Isso transforma a divisão em multiplicação, 
                            que é uma operação mais simples de realizar.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <h5 className="font-medium text-gray-800 mb-2 border-b border-gray-200 pb-1">Passos para a Resolução</h5>
                      <div className="bg-white p-3 rounded-md border border-gray-100 shadow-sm space-y-4">
                        <div>
                          <h6 className="text-indigo-700 font-medium mb-2">Para Multiplicação</h6>
                          <ol className="text-sm space-y-2 list-decimal pl-5 text-gray-700">
                            <li>
                              <span className="font-medium">Multiplique os numeradores</span>
                              <p className="text-xs mt-1">
                                O numerador do resultado é o produto dos numeradores das frações originais.
                              </p>
                            </li>
                            <li>
                              <span className="font-medium">Multiplique os denominadores</span>
                              <p className="text-xs mt-1">
                                O denominador do resultado é o produto dos denominadores das frações originais.
                              </p>
                            </li>
                            <li>
                              <span className="font-medium">Simplifique a fração resultante</span>
                              <p className="text-xs mt-1">
                                Encontre o MDC (Máximo Divisor Comum) entre o numerador e o denominador do resultado,
                                e divida ambos por ele para obter a fração na forma mais simples.
                              </p>
                            </li>
                          </ol>
                        </div>
                        
                        <div className="pt-3 border-t border-gray-100">
                          <h6 className="text-indigo-700 font-medium mb-2">Para Divisão</h6>
                          <ol className="text-sm space-y-2 list-decimal pl-5 text-gray-700">
                            <li>
                              <span className="font-medium">Inverta a segunda fração (o divisor)</span>
                              <p className="text-xs mt-1">
                                Troque o numerador e o denominador da segunda fração.
                              </p>
                            </li>
                            <li>
                              <span className="font-medium">Transforme a divisão em multiplicação</span>
                              <p className="text-xs mt-1">
                                Multiplique a primeira fração pela segunda fração invertida.
                              </p>
                            </li>
                            <li>
                              <span className="font-medium">Siga os passos da multiplicação</span>
                              <p className="text-xs mt-1">
                                Multiplique os numeradores e os denominadores, e então simplifique.
                              </p>
                            </li>
                          </ol>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white p-3 rounded-md border border-gray-100 shadow-sm">
                      <h5 className="font-medium text-gray-800 mb-2">Exemplos Práticos</h5>
                      <div className="space-y-3">
                        <div className="p-2 bg-indigo-50 rounded-md">
                          <p className="text-sm text-indigo-700 font-medium mb-1">
                            Exemplo de Multiplicação: 2/3 × 3/4
                          </p>
                          <div className="text-xs text-gray-700">
                            <p>1. Multiplique os numeradores: 2 × 3 = 6</p>
                            <p>2. Multiplique os denominadores: 3 × 4 = 12</p>
                            <p>3. Resultado: 6/12</p>
                            <p>4. Simplifique dividindo por MDC = 6: 6/12 = 1/2</p>
                          </div>
                        </div>
                        
                        <div className="p-2 bg-purple-50 rounded-md">
                          <p className="text-sm text-purple-700 font-medium mb-1">
                            Exemplo de Divisão: 2/3 ÷ 1/2
                          </p>
                          <div className="text-xs text-gray-700">
                            <p>1. Inverta a segunda fração: 1/2 → 2/1</p>
                            <p>2. Multiplique: 2/3 × 2/1</p>
                            <p>3. Multiplique os numeradores: 2 × 2 = 4</p>
                            <p>4. Multiplique os denominadores: 3 × 1 = 3</p>
                            <p>5. Resultado: 4/3</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-yellow-50 p-3 rounded-md border-l-4 border-yellow-400">
                        <h5 className="font-medium text-yellow-800 mb-2">Dicas e Truques</h5>
                        <ul className="text-sm space-y-1 list-disc pl-4 text-gray-700">
                          <li>Antes de multiplicar, verifique se é possível simplificar elementos cruzados (fatores comuns entre numerador de uma fração e denominador de outra)</li>
                          <li>Lembre-se que qualquer número dividido por 1 permanece inalterado</li>
                          <li>Divisão por uma fração é o mesmo que multiplicação pelo seu recíproco</li>
                          <li>Ao multiplicar frações, o resultado será sempre menor que as frações originais (exceto com frações impróprias)</li>
                          <li>Ao dividir por uma fração menor que 1, o resultado será maior que a fração original</li>
                        </ul>
                      </div>
                      
                      <div className="bg-green-50 p-3 rounded-md border border-green-100">
                        <h5 className="font-medium text-green-800 mb-2">Aplicações no Mundo Real</h5>
                        <ul className="text-sm space-y-1 list-disc pl-4 text-gray-700">
                          <li>Ajuste de receitas (metade de 2/3 de xícara)</li>
                          <li>Cálculos de escala em mapas e projetos</li>
                          <li>Divisão proporcional em finanças</li>
                          <li>Cálculos de taxas e juros</li>
                          <li>Problemas de razão e proporção</li>
                          <li>Análises de probabilidades compostas</li>
                        </ul>
                      </div>
                    </div>
              </div>
              
                  <div className="mt-4 p-3 bg-indigo-50 rounded-md border border-indigo-100">
                    <h5 className="font-medium text-indigo-800 mb-1 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      Conceitos Avançados
                    </h5>
                    <p className="text-sm text-indigo-700">
                      A multiplicação e divisão de frações são a base para o trabalho com expressões algébricas fracionárias, 
                      equações racionais e funções racionais. Essas operações também são essenciais para entender conceitos 
                      como proporção direta e inversa, taxas de variação e integração por substituição no cálculo avançado.
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

export default ResolvedorMultDivFracao;