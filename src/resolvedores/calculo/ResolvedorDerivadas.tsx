import React from 'react';
import { HiCalculator, HiX } from 'react-icons/hi';
import { useDerivativasSolver } from '../../hooks/calculo/useDerivativasSolver';
import StepByStepExplanation from '../../components/StepByStepExplanation';
import ConceitoMatematico from '../../components/ConceitoMatematico';

const ResolvedorDerivadas: React.FC = () => {
  const { 
    state, 
    dispatch, 
    getExamples, 
    applyExample, 
    handleSolve,
    conceitoDerivadas
  } = useDerivativasSolver();
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <HiCalculator className="h-6 w-6 text-indigo-600 mr-2" />
        <h2 className="text-2xl font-bold">Cálculo de Derivadas</h2>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-8">
        <p className="text-gray-700 mb-6">
          Esta calculadora permite obter a derivada de uma função. Insira a função, a variável 
          e a ordem da derivada desejada.
        </p>
        
        <div className="mb-4">
          <div className="mb-4">
            <label htmlFor="funcao" className="block text-sm font-medium text-gray-700 mb-1">
              Função
            </label>
            <input
              type="text"
              id="funcao"
              value={state.funcao}
              onChange={(e) => dispatch({ type: 'SET_FUNCAO', value: e.target.value })}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
              placeholder="Ex: x^2 + 3x - 5 ou sen(x)*e^x"
            />
            <p className="text-sm text-gray-500 mt-1">
              Use operadores como +, -, *, /, ^. O símbolo * para multiplicação é opcional para expressões como 3x. Funções disponíveis: sen, cos, tan, log, ln, e^x, etc.
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-4">
            <div>
              <label htmlFor="variavel" className="block text-sm font-medium text-gray-700 mb-1">
                Variável
              </label>
              <input
                type="text"
                id="variavel"
                value={state.variavel}
                onChange={(e) => dispatch({ type: 'SET_VARIAVEL', value: e.target.value })}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
              />
            </div>
            
            <div>
              <label htmlFor="ordem" className="block text-sm font-medium text-gray-700 mb-1">
                Ordem da Derivada
              </label>
              <input
                type="number"
                id="ordem"
                value={state.ordem}
                onChange={(e) => dispatch({ type: 'SET_ORDEM', value: e.target.value })}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
                min="1"
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Exemplos
            </label>
            <div className="flex flex-wrap gap-2">
              {getExamples().map((example, index) => (
                <button
                  key={index}
                  onClick={() => applyExample(example)}
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-full transition-colors"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
          
          {state.showDisclaimer && (
            <div className="mt-3 mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md relative">
              <button 
                onClick={() => dispatch({ type: 'TOGGLE_DISCLAIMER' })}
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                aria-label="Fechar aviso"
              >
                <HiX className="h-5 w-5" />
              </button>
              <p className="text-sm text-yellow-700">
                <strong>Nota:</strong> Em muitos casos, os resultados podem não estar totalmente simplificados. 
                O sistema aplica algumas regras de simplificação, mas expressões complexas podem 
                requerer simplificações algébricas adicionais.
              </p>
            </div>
          )}
          
          <button
            onClick={handleSolve}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Calcular Derivada
          </button>
        </div>
        
        {state.erro && (
          <div className="p-3 bg-red-100 text-red-700 rounded-md mb-4">
            {state.erro}
          </div>
        )}
      </div>
      
      {state.resultado && (
        <div className="space-y-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-5">
            <h3 className="text-lg font-medium text-green-800 mb-2">Resultado</h3>
            <p className="text-xl">
              {`A derivada ${parseInt(state.ordem) > 1 ? `${state.ordem}ª` : ''} de `}
              <span>{state.funcao}</span>
              {` em relação a ${state.variavel} é:`}
            </p>
            <p className="text-xl font-bold mt-2">
              {state.resultado}
            </p>
            
            <button 
              onClick={() => dispatch({ type: 'TOGGLE_EXPLANATION' })}
              className="mt-4 text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center"
            >
              {state.showExplanation ? "Ocultar explicação detalhada" : "Mostrar explicação detalhada"}
            </button>
          </div>
          
          {state.showExplanation && state.passos.length > 0 && (
            <div className="bg-white shadow-md rounded-lg p-5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800 flex items-center">
                  <HiCalculator className="h-6 w-6 mr-2 text-indigo-600" />
                  Solução passo a passo
                </h3>
              </div>
              
              {/* Agrupamento visual de passos relacionados */}
              <div className="border border-gray-100 rounded-lg overflow-hidden mb-6">
                <StepByStepExplanation steps={state.passos} stepType="calculus" />
              </div>

              
              <ConceitoMatematico
                title="Conceito Matemático: Derivadas"
                isOpen={state.showConceitoMatematico}
                onToggle={() => dispatch({ type: 'TOGGLE_CONCEITO_MATEMATICO' })}
              >
                <p className="text-gray-700 mb-4">{conceitoDerivadas.descricao}</p>
                
                <div className="space-y-6">
                  {conceitoDerivadas.categorias.map((categoria, categoriaIndex) => (
                    <div key={categoriaIndex} className="space-y-3">
                      <h5 className="text-lg font-medium text-indigo-700 border-b border-indigo-100 pb-1">
                        {categoria.nome}
                      </h5>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {categoria.regras.map((regra, regraIndex) => (
                          <div 
                            key={regraIndex} 
                            className={`p-3 rounded-md border-l-4 shadow-sm
                              ${regra.corDestaque === 'blue' ? 'bg-blue-50 border-blue-400' :
                                regra.corDestaque === 'green' ? 'bg-green-50 border-green-400' :
                                regra.corDestaque === 'purple' ? 'bg-purple-50 border-purple-400' :
                                regra.corDestaque === 'amber' ? 'bg-amber-50 border-amber-400' :
                                regra.corDestaque === 'cyan' ? 'bg-cyan-50 border-cyan-400' :
                                regra.corDestaque === 'red' ? 'bg-red-50 border-red-400' : 
                                'bg-gray-50 border-gray-400'
                              }`
                            }
                          >
                            {regra.nome && (
                              <h6 className={`font-semibold mb-1
                                ${regra.corDestaque === 'blue' ? 'text-blue-700' :
                                  regra.corDestaque === 'green' ? 'text-green-700' :
                                  regra.corDestaque === 'purple' ? 'text-purple-700' :
                                  regra.corDestaque === 'amber' ? 'text-amber-700' :
                                  regra.corDestaque === 'cyan' ? 'text-cyan-700' :
                                  regra.corDestaque === 'red' ? 'text-red-700' :
                                  'text-gray-700'
                                }`
                              }>
                                {regra.nome}
                              </h6>
                            )}
                            
                            {regra.formula && (
                              <div className="bg-white p-2 rounded border border-gray-200 mb-2 font-medium">
                                {regra.formula}
                              </div>
                            )}
                            
                            <p className="text-gray-700 text-sm">{regra.explicacao}</p>
                            
                            {regra.exemplo && (
                              <div className="mt-2 text-sm">
                                <span className="font-medium">Exemplo: </span>
                                <span className="font-mono bg-white px-1 py-0.5 rounded">{regra.exemplo}</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 bg-indigo-50 p-3 rounded-md">
                  <h5 className="font-medium text-indigo-700 mb-2">Importância das Derivadas</h5>
                  <p className="text-sm text-gray-700">
                    As derivadas são fundamentais no cálculo e possibilitam a modelagem de fenômenos 
                    que envolvem taxas de variação, como velocidade, aceleração, crescimento populacional 
                    e muitos outros. Elas permitem o estudo do comportamento local de funções, incluindo
                    a determinação de máximos e mínimos, que é essencial para problemas de otimização em diversas áreas.
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

export default ResolvedorDerivadas; 