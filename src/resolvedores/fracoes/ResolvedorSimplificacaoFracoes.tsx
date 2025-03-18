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
            <HiCalculator className="h-6 w-6 text-indigo-600 dark:text-indigo-400 mr-2" />
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Simplificação de Frações</h2>
        </div>
        
        <div className="resolver-container p-6 mb-8">
            <p className="text-gray-700 dark:text-gray-300 mb-6">
                Essa calculadora ajuda a simplificar frações para sua forma irredutível.
                Insira o numerador e o denominador da fração abaixo.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Fração
                    </label>
                    <div className="flex items-center">
                        <input
                            type="number"
                            value={state.numerator}
                            onChange={(e) => dispatch({ type: 'SET_NUMERATOR', value: e.target.value })}
                            className="w-24 p-2 border border-gray-300 dark:border-gray-600 rounded-l-md focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                            placeholder="Num"
                        />
                        <div className="px-2 py-2 bg-gray-100 dark:bg-gray-600 border-t border-b border-gray-300 dark:border-gray-600">
                            /
                        </div>
                        <input
                            type="number"
                            value={state.denominator}
                            onChange={(e) => dispatch({ type: 'SET_DENOMINATOR', value: e.target.value })}
                            className="w-24 p-2 border border-gray-300 dark:border-gray-600 rounded-r-md focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                            placeholder="Den"
                        />
                    </div>
                </div>
            </div>

            {/* Exemplos de frações */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Exemplos
              </label>
              <div className="flex flex-wrap gap-2 mb-4">
                {getFractionSimplificationExamples().map((example, index) => (
                  <button
                    key={index}
                    onClick={() => applyExample(example)}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm rounded-full transition-colors"
                  >
                    {example.description}
                  </button>
                ))}
              </div>
            </div>

            <button
                onClick={handleSolve}
                className="bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 text-white font-medium py-2 px-6 rounded-md transition-colors duration-300 mt-4"
            >
                Simplificar
            </button>

            {state.errorMessage && (
                <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 rounded-md">
                    {state.errorMessage}
                </div>
            )}
        </div>
      
      {state.resultado && state.resultadoNum !== null && state.resultadoDen !== null && (
        <div className="space-y-6">
          <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-5">
            <h3 className="text-lg font-medium text-green-800 dark:text-green-300 mb-2">Resultado</h3>
            <div className="flex flex-wrap items-center">
              <p className="text-xl mr-2 text-gray-800 dark:text-gray-200">A fração na forma irredutível é: </p>
              <div className="mt-1 sm:mt-0">
                <FractionDisplay
                  numerator={state.resultadoNum} 
                  denominator={state.resultadoDen} 
                  className="text-xl text-gray-800 dark:text-gray-200"
                />
                {state.resultadoNum % state.resultadoDen === 0 && (
                  <span className="ml-3 text-gray-800 dark:text-gray-200">= {state.resultadoNum / state.resultadoDen}</span>
                )}
              </div>
            </div>
            
            <button 
                onClick={() => dispatch({ type: 'TOGGLE_EXPLANATION' })}
                className="mt-4 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 text-sm font-medium flex items-center"
            >
                <HiInformationCircle className="h-5 w-5 mr-1" />
                {state.showExplanation ? "Ocultar explicação detalhada" : "Mostrar explicação detalhada"}
            </button>
          </div>
          
          {state.showExplanation && (
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center">
                  <HiCalculator className="h-6 w-6 mr-2 text-indigo-600 dark:text-indigo-400" />
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
                      <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2 border-b border-gray-200 dark:border-gray-700 pb-1">Simplificação de Frações</h5>
                      <div className="space-y-3">
                        <p className="text-gray-700 dark:text-gray-300">
                          A simplificação de frações é o processo de reduzir uma fração à sua forma irredutível, 
                          mantendo seu valor original. Uma fração está na forma irredutível quando o numerador e o 
                          denominador não possuem divisores comuns além do 1.
                        </p>
                        <div className="bg-white dark:bg-gray-700 p-3 rounded-md border border-gray-100 dark:border-gray-600 shadow-sm">
                          <h6 className="text-indigo-700 dark:text-indigo-300 font-medium mb-2">Como simplificar uma fração</h6>
                          <ol className="text-sm space-y-2 list-decimal pl-5 text-gray-700 dark:text-gray-300">
                            <li>
                              <span className="font-medium text-indigo-700 dark:text-indigo-300">Encontre o MDC</span>: Determine o 
                              Máximo Divisor Comum entre o numerador e o denominador.
                            </li>
                            <li>
                              <span className="font-medium text-indigo-700 dark:text-indigo-300">Divida ambos</span>: 
                              Divida tanto o numerador quanto o denominador pelo MDC encontrado.
                            </li>
                            <li>
                              <span className="font-medium text-indigo-700 dark:text-indigo-300">Verifique o resultado</span>: 
                              A fração resultante deve ter o mesmo valor que a original, mas estar na forma mais simples possível.
                            </li>
                          </ol>
                        </div>
                        <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-md">
                          <p className="text-sm text-indigo-700 dark:text-indigo-300">
                            <span className="font-medium">Exemplo:</span> Para simplificar 18/24, primeiro encontramos o MDC(18, 24) = 6.<br/>
                            Dividindo ambos por 6: 18÷6 = 3 e 24÷6 = 4<br/>
                            A fração simplificada é 3/4.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2 border-b border-gray-200 dark:border-gray-700 pb-1">Métodos para Encontrar o MDC</h5>
                      <div className="bg-white dark:bg-gray-700 p-3 rounded-md border border-gray-100 dark:border-gray-600 shadow-sm space-y-4">
                        <div>
                          <h6 className="text-indigo-700 dark:text-indigo-300 font-medium mb-2">Método da Fatoração</h6>
                          <ol className="text-sm space-y-2 list-decimal pl-5 text-gray-700 dark:text-gray-300">
                            <li>
                              <span className="font-medium text-indigo-700 dark:text-indigo-300">Decomponha</span>: 
                              Fatore o numerador e o denominador em seus fatores primos.
                            </li>
                            <li>
                              <span className="font-medium text-indigo-700 dark:text-indigo-300">Identifique</span>: 
                              Determine os fatores primos comuns a ambos.
                            </li>
                            <li>
                              <span className="font-medium text-indigo-700 dark:text-indigo-300">Multiplique</span>: 
                              O MDC é o produto de todos os fatores primos comuns, cada um elevado à sua menor potência.
                            </li>
                          </ol>
                        </div>
                        
                        <div className="pt-3 border-t border-gray-100 dark:border-gray-600">
                          <h6 className="text-indigo-700 dark:text-indigo-300 font-medium mb-2">Algoritmo de Euclides</h6>
                          <ol className="text-sm space-y-2 list-decimal pl-5 text-gray-700 dark:text-gray-300">
                            <li>
                              <span className="font-medium text-indigo-700 dark:text-indigo-300">Divida</span>: 
                              Divida o maior número pelo menor e anote o resto.
                            </li>
                            <li>
                              <span className="font-medium text-indigo-700 dark:text-indigo-300">Substitua</span>: 
                              Substitua o maior número pelo menor, e o menor pelo resto obtido.
                            </li>
                            <li>
                              <span className="font-medium text-indigo-700 dark:text-indigo-300">Repita</span>: 
                              Continue o processo até que o resto seja zero. O último divisor não nulo é o MDC.
                            </li>
                          </ol>
                          <p className="text-xs mt-2 text-gray-600 dark:text-gray-400">
                            Exemplo: Para encontrar MDC(48, 18):<br/>
                            48 ÷ 18 = 2 resto 12<br/>
                            18 ÷ 12 = 1 resto 6<br/>
                            12 ÷ 6 = 2 resto 0<br/>
                            Como o resto é 0, o MDC é 6.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-md">
                    <h5 className="font-medium text-indigo-800 dark:text-indigo-300 mb-1">Visualização do Processo</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                      <div className="bg-white dark:bg-gray-700 p-3 rounded-md border border-gray-100 dark:border-gray-600 shadow-sm">
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">Exemplo: Simplificação de 12/30</p>
                        <div className="text-sm text-gray-700 dark:text-gray-300 space-y-3">
                          <div className="flex flex-col items-center">
                            <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                              <div className="text-right">Numerador: 12</div>
                              <div>Denominador: 30</div>
                              <div className="text-right">Fatores de 12: 1, 2, 3, 4, 6, 12</div>
                              <div>Fatores de 30: 1, 2, 3, 5, 6, 10, 15, 30</div>
                              <div className="text-right">Fatores comuns: 1, 2, 3, 6</div>
                              <div>MDC = 6</div>
                            </div>
                            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600 w-full text-center">
                              <p className="mb-2">Dividindo ambos pelo MDC:</p>
                              <div className="flex justify-center items-center space-x-3">
                                <div className="flex flex-col items-center">
                                  <div className="flex items-center justify-center">
                                    <span>12</span>
                                  </div>
                                  <div className="w-8 border-t border-gray-400 dark:border-gray-500"></div>
                                  <div className="flex items-center justify-center">
                                    <span>30</span>
                                  </div>
                                </div>
                                <span>=</span>
                                <div className="flex flex-col items-center">
                                  <div className="flex items-center justify-center">
                                    <span>12 ÷ 6</span>
                                  </div>
                                  <div className="w-16 border-t border-gray-400 dark:border-gray-500"></div>
                                  <div className="flex items-center justify-center">
                                    <span>30 ÷ 6</span>
                                  </div>
                                </div>
                                <span>=</span>
                                <div className="flex flex-col items-center">
                                  <div className="flex items-center justify-center">
                                    <span>2</span>
                                  </div>
                                  <div className="w-8 border-t border-gray-400 dark:border-gray-500"></div>
                                  <div className="flex items-center justify-center">
                                    <span>5</span>
                                  </div>
                                </div>
                              </div>
                              <p className="mt-2 font-medium text-indigo-700 dark:text-indigo-300">Resultado: 2/5</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white dark:bg-gray-700 p-3 rounded-md border border-gray-100 dark:border-gray-600 shadow-sm">
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">Visualização com Blocos</p>
                        <div className="flex flex-col items-center space-y-4">
                          <div>
                            <p className="text-xs text-center text-gray-700 dark:text-gray-300 mb-1">Fração Original: 6/8</p>
                            <div className="flex flex-col items-center">
                              <div className="flex">
                                <div className="w-6 h-6 bg-blue-200 dark:bg-blue-500/40 border border-white dark:border-gray-600"></div>
                                <div className="w-6 h-6 bg-blue-200 dark:bg-blue-500/40 border border-white dark:border-gray-600"></div>
                                <div className="w-6 h-6 bg-blue-200 dark:bg-blue-500/40 border border-white dark:border-gray-600"></div>
                                <div className="w-6 h-6 bg-blue-200 dark:bg-blue-500/40 border border-white dark:border-gray-600"></div>
                                <div className="w-6 h-6 bg-blue-200 dark:bg-blue-500/40 border border-white dark:border-gray-600"></div>
                                <div className="w-6 h-6 bg-blue-200 dark:bg-blue-500/40 border border-white dark:border-gray-600"></div>
                              </div>
                              <div className="flex">
                                <div className="w-6 h-6 bg-blue-200 dark:bg-blue-500/40 border border-white dark:border-gray-600"></div>
                                <div className="w-6 h-6 bg-blue-200 dark:bg-blue-500/40 border border-white dark:border-gray-600"></div>
                                <div className="w-6 h-6 bg-white dark:bg-gray-600 border border-white dark:border-gray-600"></div>
                                <div className="w-6 h-6 bg-white dark:bg-gray-600 border border-white dark:border-gray-600"></div>
                                <div className="w-6 h-6 bg-white dark:bg-gray-600 border border-white dark:border-gray-600"></div>
                                <div className="w-6 h-6 bg-white dark:bg-gray-600 border border-white dark:border-gray-600"></div>
                              </div>
                            </div>
                            <div className="text-center text-gray-700 dark:text-gray-300 text-xs mt-1">
                              <span>6 partes preenchidas de 8 partes totais</span>
                            </div>
                          </div>
                          
                          <div>
                            <p className="text-xs text-center text-gray-700 dark:text-gray-300 mb-1">Fração Simplificada: 3/4</p>
                            <div className="flex">
                              <div className="w-12 h-12 bg-blue-200 dark:bg-blue-500/40 border border-white dark:border-gray-600"></div>
                              <div className="w-12 h-12 bg-blue-200 dark:bg-blue-500/40 border border-white dark:border-gray-600"></div>
                              <div className="w-12 h-12 bg-blue-200 dark:bg-blue-500/40 border border-white dark:border-gray-600"></div>
                              <div className="w-12 h-12 bg-white dark:bg-gray-600 border border-white dark:border-gray-600"></div>
                            </div>
                            <div className="text-center text-gray-700 dark:text-gray-300 text-xs mt-1">
                              <span>3 partes preenchidas de 4 partes totais</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white dark:bg-gray-700 p-3 rounded-md border border-gray-100 dark:border-gray-600 shadow-sm">
                      <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Exemplos Detalhados</h5>
                      <div className="space-y-3">
                        <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-md">
                          <p className="text-sm text-indigo-700 dark:text-indigo-300 font-medium mb-1">
                            Simplificação: 24/36
                          </p>
                          <div className="text-xs text-gray-700 dark:text-gray-300 space-y-1.5">
                            <p>1. Encontrar o MDC(24, 36):</p>
                            <p className="pl-3">Fatores de 24: 1, 2, 3, 4, 6, 8, 12, 24</p>
                            <p className="pl-3">Fatores de 36: 1, 2, 3, 4, 6, 9, 12, 18, 36</p>
                            <p className="pl-3">Fatores comuns: 1, 2, 3, 4, 6, 12</p>
                            <p className="pl-3">MDC = 12</p>
                            <p>2. Dividir o numerador e o denominador pelo MDC:</p>
                            <p className="pl-3">24 ÷ 12 = 2</p>
                            <p className="pl-3">36 ÷ 12 = 3</p>
                            <p className="font-medium">Resultado: 24/36 = 2/3</p>
                          </div>
                        </div>
                        
                        <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-md">
                          <p className="text-sm text-green-700 dark:text-green-300 font-medium mb-1">
                            Fração já na Forma Irredutível: 7/9
                          </p>
                          <div className="text-xs text-gray-700 dark:text-gray-300 space-y-1.5">
                            <p>1. Verificar os fatores comuns entre 7 e 9.</p>
                            <p className="pl-3">Fatores de 7: 1, 7 (número primo)</p>
                            <p className="pl-3">Fatores de 9: 1, 3, 9</p>
                            <p className="pl-3">Fator comum: 1</p>
                            <p>2. Como o único fator comum é 1, a fração já está na forma irredutível.</p>
                            <p className="font-medium">Resultado: 7/9 (a fração já está simplificada)</p>
                          </div>
                        </div>
                        
                        <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded-md">
                          <p className="text-sm text-amber-700 dark:text-amber-300 font-medium mb-1">
                            Simplificação com Zero: 0/15
                          </p>
                          <div className="text-xs text-gray-700 dark:text-gray-300 space-y-1.5">
                            <p>Quando o numerador é zero, a fração sempre simplifica para 0/1 = 0</p>
                            <p className="pl-3">Não importa qual seja o denominador (desde que não seja zero)</p>
                            <p className="font-medium">Resultado: 0/15 = 0/1 = 0</p>
                          </div>
                        </div>
                        
                        <div className="p-2 bg-rose-50 dark:bg-rose-900/20 rounded-md">
                          <p className="text-sm text-rose-700 dark:text-rose-300 font-medium mb-1">
                            Fração com Números Negativos: -18/24
                          </p>
                          <div className="text-xs text-gray-700 dark:text-gray-300 space-y-1.5">
                            <p>1. Ignorar o sinal e encontrar o MDC(18, 24) = 6</p>
                            <p>2. Dividir o numerador e o denominador pelo MDC:</p>
                            <p className="pl-3">-18 ÷ 6 = -3</p>
                            <p className="pl-3">24 ÷ 6 = 4</p>
                            <p>3. Manter o sinal no numerador ou denominador</p>
                            <p className="font-medium">Resultado: -18/24 = -3/4</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-4">
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md border border-blue-100 dark:border-blue-800 shadow-sm">
                        <h5 className="font-medium text-blue-800 dark:text-blue-300 mb-2">Propriedades Importantes</h5>
                        <div className="space-y-3 text-sm">
                          <div className="bg-white dark:bg-gray-700 p-2 rounded-md">
                            <p className="font-medium text-gray-700 dark:text-gray-300">Propriedade Fundamental das Frações</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                              Se multiplicarmos ou dividirmos o numerador e o denominador de uma fração pelo mesmo número (não zero), 
                              o valor da fração permanece o mesmo.
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                              a/b = (a×k)/(b×k), onde k ≠ 0
                            </p>
                          </div>
                          
                          <div className="bg-white dark:bg-gray-700 p-2 rounded-md">
                            <p className="font-medium text-gray-700 dark:text-gray-300">Frações Equivalentes</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                              Frações equivalentes representam a mesma quantidade, mas são escritas de formas diferentes.
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                              Exemplo: 1/2, 2/4, 3/6, 4/8 são todas frações equivalentes
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-md border-l-4 border-yellow-400 dark:border-yellow-600">
                        <h5 className="font-medium text-yellow-800 dark:text-yellow-300 mb-2">Dicas e Truques</h5>
                        <ul className="text-sm space-y-1 list-disc pl-4 text-gray-700 dark:text-gray-300">
                          <li>Verifique primeiro se o numerador ou denominador é múltiplo um do outro (divisão exata)</li>
                          <li>Procure por fatores comuns óbvios como 2, 3, 5 antes de calcular o MDC completo</li>
                          <li>Se ambos os números são pares, divida ambos por 2 e continue o processo</li>
                          <li>Uma fração está na forma irredutível quando o MDC do numerador e denominador é 1</li>
                          <li>Frações com numeradores primos e denominadores que não são múltiplos desse primo já estão na forma irredutível</li>
                        </ul>
                      </div>
                      
                      <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-md border border-green-100 dark:border-green-800">
                        <h5 className="font-medium text-green-800 dark:text-green-300 mb-2">Aplicações da Simplificação</h5>
                        <ul className="text-sm space-y-1 list-disc pl-4 text-gray-700 dark:text-gray-300">
                          <li>Facilitar cálculos e comparações entre frações</li>
                          <li>Expressar dados estatísticos de maneira mais clara</li>
                          <li>Simplificar resultados em problemas de probabilidade</li>
                          <li>Reduzir a complexidade de expressões algébricas</li>
                          <li>Facilitar a compreensão de razões e proporções em contextos práticos</li>
                        </ul>
                      </div>
                    </div>
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
