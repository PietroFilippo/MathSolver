import React from 'react';
import { HiCalculator, HiInformationCircle } from 'react-icons/hi';
import { useFuncoesTrigonometricasSolver, TrigFunction } from '../../hooks/trigonometria/useFuncoesTrigonometricasSolver';
import StepByStepExplanation from '../../components/StepByStepExplanation';
import ConceitoMatematico from '../../components/ConceitoMatematico';

const ResolvedorFuncoesTrigonometricas: React.FC = () => {
    const {
        state,
        dispatch,
        getFilteredExamples,
        applyExample,
        handleSolve
    } = useFuncoesTrigonometricasSolver();

    return (
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-6">
            <HiCalculator className="h-6 w-6 text-indigo-600 mr-2" />
            <h2 className="text-2xl font-bold">Funções Trigonométricas</h2>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-8">
            <p className="text-gray-700 mb-6">
              Esta calculadora ajuda você a calcular funções trigonométricas (seno, cosseno, tangente) 
              e suas inversas (arco seno, arco cosseno, arco tangente).
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Função
                </label>
                <select
                  value={state.trigFunction}
                  onChange={(e) => dispatch({ type: 'SET_TRIG_FUNCTION', value: e.target.value as TrigFunction })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="sin">Seno (sin)</option>
                  <option value="cos">Cosseno (cos)</option>
                  <option value="tan">Tangente (tan)</option>
                  <option value="asin">Arco Seno (arcsin)</option>
                  <option value="acos">Arco Cosseno (arccos)</option>
                  <option value="atan">Arco Tangente (arctan)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {['sin', 'cos', 'tan'].includes(state.trigFunction) ? 'Ângulo' : 'Valor'}
                </label>
                <input
                  type="text"
                  value={state.inputValue}
                  onChange={(e) => dispatch({ type: 'SET_INPUT_VALUE', value: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder={['sin', 'cos', 'tan'].includes(state.trigFunction) ? 'Digite o ângulo' : 'Digite o valor'}
                  step="any"
                />
              </div>
            </div>
            
            {['sin', 'cos', 'tan'].includes(state.trigFunction) && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Unidade de Ângulo da Entrada
                </label>
                <div className="flex space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      checked={state.inputUnit === 'degrees'}
                      onChange={() => dispatch({ type: 'SET_INPUT_UNIT', value: 'degrees' })}
                      className="form-radio h-4 w-4 text-indigo-600"
                    />
                    <span className="ml-2">Graus (°)</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      checked={state.inputUnit === 'radians'}
                      onChange={() => dispatch({ type: 'SET_INPUT_UNIT', value: 'radians' })}
                      className="form-radio h-4 w-4 text-indigo-600"
                    />
                    <span className="ml-2">Radianos (rad)</span>
                  </label>
                </div>
              </div>
            )}
            
            {['asin', 'acos', 'atan'].includes(state.trigFunction) && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Unidade de Ângulo da Saída
                </label>
                <div className="flex space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      checked={state.outputUnit === 'degrees'}
                      onChange={() => dispatch({ type: 'SET_OUTPUT_UNIT', value: 'degrees' })}
                      className="form-radio h-4 w-4 text-indigo-600"
                    />
                    <span className="ml-2">Graus (°)</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      checked={state.outputUnit === 'radians'}
                      onChange={() => dispatch({ type: 'SET_OUTPUT_UNIT', value: 'radians' })}
                      className="form-radio h-4 w-4 text-indigo-600"
                    />
                    <span className="ml-2">Radianos (rad)</span>
                  </label>
                </div>
              </div>
            )}
            
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Exemplos
                </label>
                <div className="flex flex-wrap gap-2 mb-4">
                    {getFilteredExamples().map((exemplo, index) => (
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
            
            <button
              onClick={handleSolve}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-md transition-colors duration-300"
            >
              Calcular
            </button>
            
            {state.error && (
              <div className="mt-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-md">
                {state.error}
              </div>
            )}
          </div>
          
          {state.result !== null && (
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-5">
                <h3 className="text-lg font-medium text-green-800 mb-2">Resultado</h3>
                <p className="text-xl">
                  {state.trigFunction}({state.inputValue}{['sin', 'cos', 'tan'].includes(state.trigFunction) && state.inputUnit === 'degrees' ? '°' : ''}) = <span className="font-bold">{state.result}{['asin', 'acos', 'atan'].includes(state.trigFunction) && state.outputUnit === 'degrees' ? '°' : ''}</span>
                </p>
                
                <button 
                    onClick={() => dispatch({ type: 'TOGGLE_EXPLANATION' })}
                    className="mt-4 text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center"
                >
                  <HiInformationCircle className="h-5 w-5 mr-1" />
                  {state.showExplanation ? "Ocultar explicação detalhada" : "Mostrar explicação detalhada"}
                </button>
              </div>
              
              {state.showExplanation && state.explanationSteps.length > 0 && (
                <div className="bg-white shadow-md rounded-lg p-5">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center">
                      <HiCalculator className="h-6 w-6 mr-2 text-indigo-600" />
                      Solução passo a passo
                    </h3>
                  </div>
                  
                  <StepByStepExplanation steps={state.explanationSteps} stepType="trigonometric" />
                  
                  <ConceitoMatematico
                    title="Conceito Matemático"
                    isOpen={state.showConceitoMatematico}
                    onToggle={() => dispatch({ type: 'TOGGLE_CONCEITO_MATEMATICO' })}
                  >
                    <div className="space-y-4 text-gray-700">
                      {['sin', 'cos', 'tan'].includes(state.trigFunction) ? (
                        <>
                          <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                              <h5 className="font-medium text-gray-800 mb-2 border-b border-gray-200 pb-1">Definição</h5>
                              <p>
                                <span className="font-semibold">Funções Trigonométricas:</span> Relacionam ângulos com as razões dos lados em um triângulo retângulo:
                              </p>
                              <ul className="list-disc pl-5 mt-2 space-y-2">
                                <li className="p-1 hover:bg-blue-50 rounded transition-colors"><strong>Seno (sin):</strong> Cateto oposto / Hipotenusa</li>
                                <li className="p-1 hover:bg-blue-50 rounded transition-colors"><strong>Cosseno (cos):</strong> Cateto adjacente / Hipotenusa</li>
                                <li className="p-1 hover:bg-blue-50 rounded transition-colors"><strong>Tangente (tan):</strong> Cateto oposto / Cateto adjacente (ou sin/cos)</li>
                              </ul>
                            </div>
                            <div className="flex-1">
                              <h5 className="font-medium text-gray-800 mb-2 border-b border-gray-200 pb-1">Relações Fundamentais</h5>
                              <div className="bg-white p-4 rounded-md border border-gray-100 shadow-sm">
                                <h6 className="text-indigo-700 font-medium mb-3 text-center">Triângulo Retângulo</h6>
                                <div className="space-y-3">
                                  <div className="flex items-center justify-between border-b border-dashed border-gray-200 pb-2">
                                    <span className="font-medium">Hipotenusa:</span>
                                    <span className="text-indigo-600">Lado oposto ao ângulo reto</span>
                                  </div>
                                  <div className="flex items-center justify-between border-b border-dashed border-gray-200 pb-2">
                                    <span className="font-medium">Cateto Oposto:</span>
                                    <span className="text-indigo-600">Lado oposto ao ângulo θ</span>
                                  </div>
                                  <div className="flex items-center justify-between pb-2">
                                    <span className="font-medium">Cateto Adjacente:</span>
                                    <span className="text-indigo-600">Lado adjacente ao ângulo θ</span>
                                  </div>
                                </div>
                                <div className="mt-3 p-2 bg-indigo-50 rounded-md text-center text-sm">
                                  <p className="mb-1">Relações entre lados e ângulos:</p>
                                  <p className="font-mono font-medium">
                                    sin(θ) = <span className="text-purple-600">Oposto/Hipotenusa</span>
                                  </p>
                                  <p className="font-mono font-medium">
                                    cos(θ) = <span className="text-green-600">Adjacente/Hipotenusa</span>
                                  </p>
                                  <p className="font-mono font-medium">
                                    tan(θ) = <span className="text-blue-600">Oposto/Adjacente</span>
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-4">
                            <h5 className="font-medium text-gray-800 mb-2 border-b border-gray-200 pb-1">Domínio e Imagem</h5>
                            <ul className="mt-2 space-y-2">
                              <li className="p-2 bg-white rounded-md border border-gray-100 shadow-sm">
                                <strong className="text-indigo-600">sin(x):</strong> Domínio: Todos os números reais, Imagem: [-1, 1]
                              </li>
                              <li className="p-2 bg-white rounded-md border border-gray-100 shadow-sm">
                                <strong className="text-indigo-600">cos(x):</strong> Domínio: Todos os números reais, Imagem: [-1, 1]
                              </li>
                              <li className="p-2 bg-white rounded-md border border-gray-100 shadow-sm">
                                <strong className="text-indigo-600">tan(x):</strong> Domínio: Todos os números reais exceto x = (n + 1/2)π, Imagem: Todos os números reais
                              </li>
                            </ul>
                          </div>
                          
                          <div className="mt-4 bg-yellow-50 p-3 rounded-md border-l-4 border-yellow-400">
                            <h5 className="font-medium text-yellow-800 mb-1">Aplicações</h5>
                            <ul className="list-disc pl-5 mt-1 text-gray-700">
                              <li>Física (movimento ondulatório, oscilações)</li>
                              <li>Engenharia (análise de circuitos, processamento de sinais)</li>
                              <li>Astronomia (cálculos de órbita e posição)</li>
                              <li>Navegação (GPS, sistemas de posicionamento)</li>
                            </ul>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                              <h5 className="font-medium text-gray-800 mb-2 border-b border-gray-200 pb-1">Definição</h5>
                              <p>
                                <span className="font-semibold">Funções Trigonométricas Inversas:</span> Encontram o ângulo correspondente a uma razão trigonométrica.
                              </p>
                            </div>
                            <div className="flex-1">
                              <h5 className="font-medium text-gray-800 mb-2 border-b border-gray-200 pb-1">Interpretação</h5>
                              <p>
                                Para cada valor do seno, cosseno ou tangente, as funções inversas retornam o ângulo correspondente.
                              </p>
                            </div>
                          </div>
                          
                          <div className="mt-4">
                            <h5 className="font-medium text-gray-800 mb-2 border-b border-gray-200 pb-1">Domínio e Imagem</h5>
                            <ul className="mt-2 space-y-2">
                              <li className="p-2 bg-white rounded-md border border-gray-100 shadow-sm">
                                <strong className="text-indigo-600">Arco Seno (arcsin):</strong> Domínio: [-1, 1], Imagem: [-π/2, π/2] ou [-90°, 90°]
                              </li>
                              <li className="p-2 bg-white rounded-md border border-gray-100 shadow-sm">
                                <strong className="text-indigo-600">Arco Cosseno (arccos):</strong> Domínio: [-1, 1], Imagem: [0, π] ou [0°, 180°]
                              </li>
                              <li className="p-2 bg-white rounded-md border border-gray-100 shadow-sm">
                                <strong className="text-indigo-600">Arco Tangente (arctan):</strong> Domínio: Todos os números reais, Imagem: (-π/2, π/2) ou (-90°, 90°)
                              </li>
                            </ul>
                          </div>
                          
                          <div className="mt-4 bg-yellow-50 p-3 rounded-md border-l-4 border-yellow-400">
                            <h5 className="font-medium text-yellow-800 mb-1">Aplicações</h5>
                            <ul className="list-disc pl-5 mt-1 text-gray-700">
                              <li>Cálculos de ângulos em geometria e trigonometria</li>
                              <li>Sistemas de navegação e orientação</li>
                              <li>Processamento de imagens e visão computacional</li>
                              <li>Robótica (cinemática inversa)</li>
                            </ul>
                          </div>
                          
                          <div className="p-3 bg-indigo-50 rounded-md border-l-4 border-indigo-300 mt-4">
                            <p>
                              <span className="font-semibold">Observação:</span> Funções trigonométricas são multivalentes, mas por convenção, 
                              retornam apenas um valor específico no intervalo principal.
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  </ConceitoMatematico>
                </div>
              )}
            </div>
          )}
        </div>
      );
    };

export default ResolvedorFuncoesTrigonometricas;
