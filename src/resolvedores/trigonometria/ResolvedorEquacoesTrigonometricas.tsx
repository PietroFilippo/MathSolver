import React from 'react';
import { HiCalculator, HiInformationCircle } from 'react-icons/hi';
import { useEquacoesTrigonometricasSolver } from '../../hooks/trigonometria/useEquacoesTrigonometricasSolver';
import StepByStepExplanation from '../../components/StepByStepExplanation';
import ConceitoMatematico from '../../components/ConceitoMatematico';

const ResolvedorEquacoesTrigonometricas: React.FC = () => {
  const {
    state,
    dispatch,
    applyExample,
    getExamples,
    handleSolve
  } = useEquacoesTrigonometricasSolver();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <HiCalculator className="h-6 w-6 text-indigo-600 mr-2" />
        <h2 className="text-2xl font-bold">Equações Trigonométricas</h2>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-8">
        <p className="text-gray-700 mb-6">
          Esta calculadora ajuda você a resolver equações trigonométricas como sen(x) = 0.5 ou cos(2x) + 1 = 0
          dentro de um intervalo específico.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="equacao" className="block text-sm font-medium text-gray-700 mb-2">
              Equação Trigonométrica
            </label>
            <input
              type="text"
              id="equacao"
              value={state.equation}
              onChange={(e) => dispatch({ type: 'SET_EQUATION', value: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Ex: sen(x) = 1/2 ou cos^2(x) + 1 = 0"
            />
            <p className="text-sm text-gray-500 mt-1">
              Use funções trigonométricas como sen, cos, tan, etc. Você pode usar ^ para potências (ex: sen^2(x)),
              √ para raiz quadrada (ex: √3/2) e π para representar pi.
            </p>
          </div>
          
          <div>
            <label htmlFor="intervalo" className="block text-sm font-medium text-gray-700 mb-2">
              Intervalo para Soluções
            </label>
            <input
              type="text"
              id="intervalo"
              value={state.interval}
              onChange={(e) => dispatch({ type: 'SET_INTERVAL', value: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Ex: 0,2π ou -π,π"
            />
            <p className="text-sm text-gray-500 mt-1">
              Especifique o intervalo no formato: início,fim. Use π para representar pi.
              Lembre-se de que os valores dos ângulos são em radianos (π/6 = 30°, π/4 = 45°, π/3 = 60°, π/2 = 90°).
            </p>
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Exemplos
          </label>
          <div className="flex flex-wrap gap-2 mb-4">
            {getExamples().map((exemplo, index) => (
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
        
        <div className="mb-4 p-3 bg-blue-50 rounded-md text-sm">
          <h3 className="font-bold mb-1">Método de Utilização:</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Use potências com o símbolo <code>^</code>: <code>sen^2(x) + cos^2(x) = 1</code></li>
            <li>Use raiz quadrada com o símbolo <code>√</code>: <code>sen(x) = √3/2</code></li>
            <li>As funções trigonométricas usam radianos: <code>sen(π/6) = 0.5</code> (30°), <code>sen(π/2) = 1</code> (90°)</li>
            <li>Para representar pi, use o símbolo π ou 'pi'. Para multiplicar, use por exemplo '2*π' ou '2π'.</li>
            <li>Tome cuidado com a sintaxe de espaços, por exemplo: '2 sen(x)' deve ser escrito como '2sen(x)'.</li>
          </ul>
        </div>
        
        <button
          onClick={handleSolve}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-md transition-colors duration-300"
        >
          Resolver
        </button>
        
        {state.error && (
          <div className="mt-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-md">
            {state.error}
          </div>
        )}
      </div>
      
      {state.result && (
        <div className="space-y-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-5">
            <h3 className="text-lg font-medium text-green-800 mb-2">Resultado</h3>
            <p className="text-xl font-bold">
              {state.result}
            </p>
            
            {state.formattedSolutions.length > 0 ? (
              <div className="mt-3">
                {state.formattedSolutions.map((solution, index) => (
                  <p key={index} className="text-lg">
                    Solução {index + 1}: x = <span className="font-bold">{solution.radians}</span> rad = <span className="font-bold">{solution.degrees}°</span>
                  </p>
                ))}
              </div>
            ) : (
              <p className="text-gray-700 mt-2">Não foram encontradas soluções no intervalo especificado.</p>
            )}
            
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
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                  <div className="flex-1">
                    <h5 className="font-medium text-gray-800 mb-2 border-b border-gray-200 pb-1">Propriedades</h5>
                    <p className="text-gray-700">
                      As equações trigonométricas geralmente possuem infinitas soluções devido à natureza periódica das funções trigonométricas.
                    </p>
                    <div className="mt-3 grid grid-cols-1 gap-2">
                      <div className="p-2 bg-white rounded-md border border-gray-100 shadow-sm">
                        <p className="text-sm">
                          <strong className="text-indigo-600">Seno:</strong> Se x = α é solução de sen(x) = k, então x = α + 2nπ também é solução para qualquer inteiro n.
                        </p>
                      </div>
                      <div className="p-2 bg-white rounded-md border border-gray-100 shadow-sm">
                        <p className="text-sm">
                          <strong className="text-indigo-600">Cosseno:</strong> Se x = α é solução de cos(x) = k, então x = ±α + 2nπ também é solução para qualquer inteiro n.
                        </p>
                      </div>
                      <div className="p-2 bg-white rounded-md border border-gray-100 shadow-sm">
                        <p className="text-sm">
                          <strong className="text-indigo-600">Tangente:</strong> Se x = α é solução de tan(x) = k, então x = α + nπ também é solução para qualquer inteiro n.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h5 className="font-medium text-gray-800 mb-2 border-b border-gray-200 pb-1">Método de Solução</h5>
                    <p className="text-gray-700 mb-2">
                      As equações trigonométricas podem ser resolvidas através de:
                    </p>
                    <ul className="space-y-2 text-gray-700">
                      <li className="p-2 hover:bg-blue-50 rounded transition-colors flex">
                        <div className="h-5 w-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs mr-2 flex-shrink-0">1</div>
                        <span><span className="font-medium">Valores conhecidos:</span> Utilizar ângulos notáveis (30°, 45°, 60°, etc)</span>
                      </li>
                      <li className="p-2 hover:bg-blue-50 rounded transition-colors flex">
                        <div className="h-5 w-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs mr-2 flex-shrink-0">2</div>
                        <span><span className="font-medium">Identidades:</span> Aplicar identidades trigonométricas para simplificar</span>
                      </li>
                      <li className="p-2 hover:bg-blue-50 rounded transition-colors flex">
                        <div className="h-5 w-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs mr-2 flex-shrink-0">3</div>
                        <span><span className="font-medium">Métodos numéricos:</span> Para equações complexas</span>
                      </li>
                      <li className="p-2 hover:bg-blue-50 rounded transition-colors flex">
                        <div className="h-5 w-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs mr-2 flex-shrink-0">4</div>
                        <span><span className="font-medium">Reformulação:</span> Converter para formas mais simples</span>
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div className="mt-4">
                  <h5 className="font-medium text-gray-800 mb-2 border-b border-gray-200 pb-1">Ângulos Notáveis</h5>
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white rounded-md shadow-sm">
                      <thead>
                        <tr className="bg-indigo-50 text-indigo-700">
                          <th className="py-2 px-3 text-left text-sm font-medium">Ângulo (graus)</th>
                          <th className="py-2 px-3 text-left text-sm font-medium">Ângulo (rad)</th>
                          <th className="py-2 px-3 text-left text-sm font-medium">sen(x)</th>
                          <th className="py-2 px-3 text-left text-sm font-medium">cos(x)</th>
                          <th className="py-2 px-3 text-left text-sm font-medium">tan(x)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        <tr className="hover:bg-gray-50">
                          <td className="py-2 px-3 text-sm">0°</td>
                          <td className="py-2 px-3 text-sm">0</td>
                          <td className="py-2 px-3 text-sm">0</td>
                          <td className="py-2 px-3 text-sm">1</td>
                          <td className="py-2 px-3 text-sm">0</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                          <td className="py-2 px-3 text-sm">30°</td>
                          <td className="py-2 px-3 text-sm">π/6</td>
                          <td className="py-2 px-3 text-sm">1/2</td>
                          <td className="py-2 px-3 text-sm">√3/2</td>
                          <td className="py-2 px-3 text-sm">1/√3</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                          <td className="py-2 px-3 text-sm">45°</td>
                          <td className="py-2 px-3 text-sm">π/4</td>
                          <td className="py-2 px-3 text-sm">1/√2</td>
                          <td className="py-2 px-3 text-sm">1/√2</td>
                          <td className="py-2 px-3 text-sm">1</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                          <td className="py-2 px-3 text-sm">60°</td>
                          <td className="py-2 px-3 text-sm">π/3</td>
                          <td className="py-2 px-3 text-sm">√3/2</td>
                          <td className="py-2 px-3 text-sm">1/2</td>
                          <td className="py-2 px-3 text-sm">√3</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                          <td className="py-2 px-3 text-sm">90°</td>
                          <td className="py-2 px-3 text-sm">π/2</td>
                          <td className="py-2 px-3 text-sm">1</td>
                          <td className="py-2 px-3 text-sm">0</td>
                          <td className="py-2 px-3 text-sm">∞</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                
                <div className="mt-4 bg-yellow-50 p-3 rounded-md border-l-4 border-yellow-400">
                  <h5 className="font-medium text-yellow-800 mb-1">Dica de Resolução</h5>
                  <p className="text-gray-700 text-sm">
                    Ao resolver equações trigonométricas, é fundamental identificar o período da função envolvida 
                    (2π para seno e cosseno, π para tangente) para determinar corretamente todas as soluções no intervalo definido.
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

export default ResolvedorEquacoesTrigonometricas;