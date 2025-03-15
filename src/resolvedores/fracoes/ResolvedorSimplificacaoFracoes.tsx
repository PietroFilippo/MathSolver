import React, { useState, ReactNode } from 'react';
import { HiCalculator } from 'react-icons/hi';
import { gcd } from '../../utils/mathUtils';
import { simplifyFraction, FractionDisplay, getFractionSimplificationExamples } from '../../utils/mathUtilsFracoes';

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
    
    const num = parseInt(numerator);
    const den = parseInt(denominator);
    
    // Validação de inputs
    if (isNaN(num) || isNaN(den)) {
      setErrorMessage('Por favor, preencha todos os campos com valores numéricos.');
      return;
    }
    
    if (den === 0) {
      setErrorMessage('O denominador não pode ser zero.');
      return;
    }
    
    // Simplificar a fração
    const simplified = simplifyFraction(num, den);
    const simplifiedNum = simplified.numerador;
    const simplifiedDen = simplified.denominador;
    
    setResultadoNum(simplifiedNum);
    setResultadoDen(simplifiedDen);
    setResultado(true);
    setShowExplanation(true);
    
    // Gerar os passos da explicação
    const calculationSteps = [];
    
    calculationSteps.push(`Passo 1: Identificar a fração`);
    calculationSteps.push(<FractionDisplay numerator={num} denominator={den} />);
    
    if (num === 0) {
      calculationSteps.push(`Passo 2: Como o numerador é zero, a fração simplificada é 0`);
      calculationSteps.push(`0/${den} = 0/1 = 0`);
    } else if (num === simplifiedNum && den === simplifiedDen) {
      calculationSteps.push(`Passo 2: A fração já está simplificada`);
      calculationSteps.push(`${num}/${den} já está na sua forma irredutível.`);
    } else {
      calculationSteps.push(`Passo 2: Encontrar o MDC (Máximo Divisor Comum) de ${Math.abs(num)} e ${Math.abs(den)}`);
      
      const mdcValue = gcd(Math.abs(num), Math.abs(den));
      calculationSteps.push(`MDC(${Math.abs(num)}, ${Math.abs(den)}) = ${mdcValue}`);
      
      calculationSteps.push(`Passo 3: Dividir o numerador e o denominador pelo MDC ${mdcValue}`);
      calculationSteps.push(`Numerador: ${num} ÷ ${mdcValue} = ${simplifiedNum}`);
      calculationSteps.push(`Denominador: ${den} ÷ ${mdcValue} = ${simplifiedDen}`);
      
      if (simplifiedDen < 0) {
        // Se o denominador é negativo, multiplicamos tanto o numerador quanto o denominador por -1
        const adjustedNum = -simplifiedNum;
        const adjustedDen = -simplifiedDen;
        
        calculationSteps.push(`Passo 4: Como o denominador é negativo, multiplicamos numerador e denominador por -1`);
        calculationSteps.push(`${simplifiedNum}/${simplifiedDen} = ${adjustedNum}/${adjustedDen}`);
        
        // Atualizamos os valores de resultado
        setResultadoNum(adjustedNum);
        setResultadoDen(adjustedDen);
      }
      
      if (resultadoNum === 0) {
        calculationSteps.push(`Resultado final: A fração simplificada é 0`);
      } else {
        calculationSteps.push(`Resultado final: A fração simplificada é `);
        calculationSteps.push(<FractionDisplay 
          numerator={simplifiedDen < 0 ? -simplifiedNum : simplifiedNum} 
          denominator={simplifiedDen < 0 ? -simplifiedDen : simplifiedDen} 
        />);
      }
    }
    
    setSteps(calculationSteps);
  };

  // Função para aplicar um exemplo
  const applyExample = (example: { num: number, den: number }) => {
    setNumerator(example.num.toString());
    setDenominator(example.den.toString());
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
          
          // Verifica se é um cálculo de MDC
          const mdcMatch = stepStr.startsWith('MDC(');
          
          // Verifica se é uma divisão para simplificação
          const divisionMatch = stepStr.includes('÷') && (stepStr.startsWith('Numerador:') || stepStr.startsWith('Denominador:'));
          
          // Verifica se é manipulação de sinais 
          const signAdjustmentMatch = stepStr.includes('multiplicamos numerador e denominador por -1');

          // Verifica se é um resultado final
          const finalResultMatch = stepStr.startsWith('Resultado final:');

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
          } else if (mdcMatch) {
            // Se for MDC, usa um estilo diferente
            return (
              <div key={index} className="p-3 bg-blue-50 rounded-md ml-4 border-l-2 border-blue-300">
                <p className="text-blue-700 font-medium">{step}</p>
              </div>
            );
          } else if (divisionMatch) {
            // Se for divisão para simplificação, usa um estilo diferente
            return (
              <div key={index} className="p-3 bg-purple-50 rounded-md ml-4 border-l-2 border-purple-300">
                <p className="text-purple-700 font-medium">{step}</p>
              </div>
            );
          } else if (signAdjustmentMatch) {
            // Se for ajuste de sinal, usa um estilo diferente
            return (
              <div key={index} className="p-3 bg-amber-50 rounded-md ml-4 border-l-2 border-amber-300">
                <p className="text-amber-700 font-medium">{step}</p>
              </div>
            );
          } else if (finalResultMatch) {
            // Se for o resultado final, usa um estilo diferente
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
            <h2 className="text-2xl font-bold">Simplificação de Frações</h2>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-8">
            <p className="text-gray-700 mb-6">
                Essa calculadora ajuda a simplificar frações para sua forma irredutível.
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
                            className="w-24 p-2 border border-gray-300 rounded-l-md focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Num"
                        />
                        <div className="px-2 py-2 bg-gray-100 border-t border-b border-gray-300">
                            /
                        </div>
                        <input
                            type="number"
                            value={denominator}
                            onChange={(e) => setDenominator(e.target.value)}
                            className="w-24 p-2 border border-gray-300 rounded-r-md focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Den"
                        />
                    </div>
                </div>
            </div>

            {/* Exemplos de frações */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Exemplos
              </label>
              <div className="flex flex-wrap gap-2 mb-4">
                {getFractionSimplificationExamples().map((example, index) => (
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
                Simplificar
            </button>

            {errorMessage && (
                <div className="mt-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-md">
                    {errorMessage}
                </div>
            )}
        </div>
      
      {resultado && resultadoNum !== null && resultadoDen !== null && (
        <div className="space-y-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-5">
            <h3 className="text-lg font-medium text-green-800 mb-2">Resultado</h3>
            <div className="flex flex-wrap items-center">
              <p className="text-xl mr-2">A fração na forma irredutível é: </p>
              <div className="mt-1 sm:mt-0">
                <FractionDisplay
                  numerator={resultadoNum} 
                  denominator={resultadoDen} 
                  className="text-xl"
                />
                {resultadoNum % resultadoDen === 0 && (
                  <span className="ml-3">= {resultadoNum / resultadoDen}</span>
                )}
              </div>
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
                      <h5 className="font-medium text-gray-800 mb-2 border-b border-gray-200 pb-1">Simplificação de Frações</h5>
                      <div className="space-y-3">
                        <p className="text-gray-700">
                          Simplificar uma fração significa reduzi-la à sua forma mais simples (irredutível), 
                          onde o numerador e o denominador não possuem fatores comuns além do número 1.
                        </p>
                        <div className="bg-white p-3 rounded-md border border-gray-100 shadow-sm">
                          <h6 className="text-indigo-700 font-medium mb-2">Princípio Fundamental</h6>
                          <div className="space-y-2 text-sm text-gray-700">
                            <p>
                              Uma fração está na sua forma irredutível quando o numerador e o denominador são primos entre si 
                              (não têm divisores comuns além do 1).
                            </p>
                            <div className="text-center font-medium text-indigo-700 mt-2 p-2 bg-indigo-50 rounded-md">
                              <p className="mb-1">Se MDC(a, b) = 1, então a fração a/b está simplificada</p>
                              <p className="text-xs">Onde MDC = Máximo Divisor Comum</p>
                            </div>
                          </div>
                        </div>
                        <div className="p-3 bg-indigo-50 rounded-md">
                          <h6 className="text-indigo-700 font-medium mb-2">Propriedades Importantes</h6>
                          <ul className="text-sm space-y-1 list-disc pl-4 text-gray-700">
                            <li>Uma fração simplificada não pode ser reduzida ainda mais</li>
                            <li>Frações equivalentes representam o mesmo valor, mesmo com números diferentes</li>
                            <li>Multiplicar ou dividir o numerador e o denominador pelo mesmo número (≠ 0) produz uma fração equivalente</li>
                            <li>Uma fração com numerador 0 é sempre igual a 0, independentemente do denominador</li>
                            <li>Uma fração com denominador 1 é igual ao seu numerador (número inteiro)</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <h5 className="font-medium text-gray-800 mb-2 border-b border-gray-200 pb-1">Métodos de Simplificação</h5>
                      <div className="space-y-3">
                        <div className="bg-white p-3 rounded-md border border-gray-100 shadow-sm">
                          <h6 className="text-indigo-700 font-medium mb-2">Método do MDC</h6>
                          <ol className="text-sm space-y-2 list-decimal pl-5 text-gray-700">
                            <li>
                              Calcule o MDC (Máximo Divisor Comum) entre o numerador e o denominador
                              <p className="text-xs mt-1 text-indigo-600">
                                Pode ser calculado usando o algoritmo de Euclides ou fatoração em primos
                              </p>
                            </li>
                            <li>
                              Divida tanto o numerador quanto o denominador pelo MDC
                              <p className="text-xs mt-1 text-indigo-600">
                                a/b = (a ÷ MDC)/(b ÷ MDC)
                              </p>
                            </li>
                          </ol>
                        </div>
                        
                        <div className="bg-white p-3 rounded-md border border-gray-100 shadow-sm mt-4">
                          <h6 className="text-indigo-700 font-medium mb-2">Método da Fatoração</h6>
                          <ol className="text-sm space-y-2 list-decimal pl-5 text-gray-700">
                            <li>
                              Decomponha o numerador e o denominador em seus fatores primos
                            </li>
                            <li>
                              Cancele os fatores comuns ao numerador e denominador
                            </li>
                            <li>
                              Multiplique os fatores restantes para obter a fração simplificada
                            </li>
                          </ol>
                          <p className="text-xs mt-2 text-indigo-600 italic">
                            Exemplo: 
                            <span className="inline-block mt-1">
                              24/36 = (2³×3)/(2²×3²) = 2×3/3² = 2/3
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white p-3 rounded-md border border-gray-100 shadow-sm">
                      <h5 className="font-medium text-gray-800 mb-2">Exemplos Detalhados</h5>
                      <div className="space-y-3">
                        <div className="p-2 bg-indigo-50 rounded-md">
                          <p className="text-sm text-indigo-700 font-medium mb-1">
                            Simplificação de 18/24
                          </p>
                          <ol className="text-xs list-decimal pl-4 mt-1 text-gray-700">
                            <li>Calcule o MDC(18, 24) = 6</li>
                            <li>Divida ambos por 6: 18 ÷ 6 = 3 e 24 ÷ 6 = 4</li>
                            <li>Resultado simplificado: 3/4</li>
                          </ol>
                          <p className="text-xs mt-2 text-indigo-700">
                            <span className="font-medium">Verificação:</span> Se multiplicarmos 3/4 por 6/6 obtemos 18/24
                          </p>
                        </div>
                        
                        <div className="p-2 bg-purple-50 rounded-md">
                          <p className="text-sm text-purple-700 font-medium mb-1">
                            Simplificação de 75/100
                          </p>
                          <ol className="text-xs list-decimal pl-4 mt-1 text-gray-700">
                            <li>Fatoração: 75 = 3 × 5² e 100 = 2² × 5²</li>
                            <li>Cancelando os fatores comuns (5²): 3/2²</li>
                            <li>Resultado simplificado: 3/4</li>
                          </ol>
                          <p className="text-xs mt-2 text-purple-700">
                            <span className="font-medium">Ou pelo MDC:</span> MDC(75, 100) = 25, logo 75/100 = 3/4
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-yellow-50 p-3 rounded-md border-l-4 border-yellow-400">
                        <h5 className="font-medium text-yellow-800 mb-2">Casos Especiais</h5>
                        <ul className="text-sm space-y-1 list-disc pl-4 text-gray-700">
                          <li>
                            <span className="font-medium">Frações negativas:</span> Se o denominador for negativo, multiplique tanto o numerador quanto o denominador por -1 para manter o denominador positivo
                          </li>
                          <li>
                            <span className="font-medium">Frações com numerador zero:</span> Qualquer fração com numerador 0 se simplifica para 0
                          </li>
                          <li>
                            <span className="font-medium">Número racional em forma decimal:</span> Frações também podem representar números decimais, como 0.75 = 3/4
                          </li>
                          <li>
                            <span className="font-medium">Dízimas periódicas:</span> Qualquer dízima periódica pode ser convertida em fração
                          </li>
                        </ul>
                      </div>
                      
                      <div className="bg-green-50 p-3 rounded-md border border-green-100">
                        <h5 className="font-medium text-green-800 mb-2">Aplicações Práticas</h5>
                        <ul className="text-sm space-y-1 list-disc pl-4 text-gray-700">
                          <li>Simplificação de expressões algébricas</li>
                          <li>Cálculo de probabilidades</li>
                          <li>Representação de proporções e razões</li>
                          <li>Resolução de equações fracionárias</li>
                          <li>Representação de porcentagens (75% = 3/4)</li>
                          <li>Operações com números racionais</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-3 bg-indigo-50 rounded-md border border-indigo-100">
                    <h5 className="font-medium text-indigo-800 mb-1 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      Importância na Matemática
                    </h5>
                    <p className="text-sm text-indigo-700">
                      A simplificação de frações é uma habilidade fundamental que permite expressar quantidades na forma mais 
                      clara e concisa possível. Além de facilitar cálculos e comparações, trabalhar com frações simplificadas 
                      reduz a probabilidade de erros em operações matemáticas mais complexas, como adição, subtração, 
                      multiplicação e divisão de frações, bem como na resolução de equações.
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
