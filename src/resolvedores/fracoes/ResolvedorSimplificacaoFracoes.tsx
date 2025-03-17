import React from 'react';
import { HiCalculator, HiInformationCircle } from 'react-icons/hi';
import { FractionDisplay, getFractionSimplificationExamples } from '../../utils/mathUtilsFracoes';
import { useFractionSimplificationSolver } from '../../hooks/fracoes/useFractionSimplificacaoSolver';
import StepByStepExplanation from '../../components/StepByStepExplanation';
import ConceitoMatematico from '../../components/ConceitoMatematico';

const ResolvedorSimplificacaoFracoes: React.FC = () => {
  const {
    state,
    dispatch,
    handleSolve,
    applyExample
  } = useFractionSimplificationSolver();

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
                            value={state.numerator}
                            onChange={(e) => dispatch({ type: 'SET_NUMERATOR', value: e.target.value })}
                            className="w-24 p-2 border border-gray-300 rounded-l-md focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Num"
                        />
                        <div className="px-2 py-2 bg-gray-100 border-t border-b border-gray-300">
                            /
                        </div>
                        <input
                            type="number"
                            value={state.denominator}
                            onChange={(e) => dispatch({ type: 'SET_DENOMINATOR', value: e.target.value })}
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

            {state.errorMessage && (
                <div className="mt-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-md">
                    {state.errorMessage}
                </div>
            )}
        </div>
      
      {state.resultado && state.resultadoNum !== null && state.resultadoDen !== null && (
        <div className="space-y-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-5">
            <h3 className="text-lg font-medium text-green-800 mb-2">Resultado</h3>
            <div className="flex flex-wrap items-center">
              <p className="text-xl mr-2">A fração na forma irredutível é: </p>
              <div className="mt-1 sm:mt-0">
                <FractionDisplay
                  numerator={state.resultadoNum} 
                  denominator={state.resultadoDen} 
                  className="text-xl"
                />
                {state.resultadoNum % state.resultadoDen === 0 && (
                  <span className="ml-3">= {state.resultadoNum / state.resultadoDen}</span>
                )}
              </div>
            </div>
            
            <button 
                onClick={() => dispatch({ type: 'TOGGLE_EXPLANATION' })}
                className="mt-4 text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center"
            >
                <HiInformationCircle className="h-5 w-5 mr-1" />
                {state.showExplanation ? "Ocultar explicação detalhada" : "Mostrar explicação detalhada"}
            </button>
          </div>
          
          {state.showExplanation && (
            <div className="bg-white shadow-md rounded-lg p-5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800 flex items-center">
                  <HiCalculator className="h-6 w-6 mr-2 text-indigo-600" />
                  Solução passo a passo
                </h3>
              </div>
              
              <StepByStepExplanation steps={state.steps} stepType="linear" />
              
              <ConceitoMatematico
                title="Conceito Matemático"
                isOpen={state.showConceitoMatematico}
                onToggle={() => dispatch({ type: 'TOGGLE_CONCEITO_MATEMATICO' })}
              >
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
                        
                        <div className="p-2 bg-amber-50 rounded-md">
                          <p className="text-sm text-amber-700 font-medium mb-1">
                            Simplificação de -24/36
                          </p>
                          <ol className="text-xs list-decimal pl-4 mt-1 text-gray-700">
                            <li>Primeiro, ignoramos o sinal e calculamos MDC(24, 36) = 12</li>
                            <li>Dividimos ambos por 12: -24 ÷ 12 = -2 e 36 ÷ 12 = 3</li>
                            <li>Mantemos o sinal no numerador: -2/3</li>
                            <li>Verificamos: o sinal de uma fração deve ficar no numerador ou como prefixo da fração</li>
                          </ol>
                          <p className="text-xs mt-2 text-amber-700">
                            <span className="font-medium">Observação:</span> Também poderíamos escrever como -2/3 = (-2)/3 = 2/(-3)
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
              </ConceitoMatematico>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ResolvedorSimplificacaoFracoes;
