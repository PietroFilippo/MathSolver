import React from 'react';
import { HiCalculator, HiInformationCircle, HiTable, HiPlus, HiMinus } from 'react-icons/hi';
import { getMatrixAddSubExamples } from '../../utils/mathUtilsMatrizes';
import { useMatrizAddSubSolver } from '../../hooks/matrizes/useMatrizAddSubSolver';
import StepByStepExplanation from '../../components/StepByStepExplanation';
import ConceitoMatematico from '../../components/ConceitoMatematico';

const ResolvedorAddSubMatrizes: React.FC = () => {
  const { state, dispatch, handleSolve, applyExample } = useMatrizAddSubSolver();

  // Renderiza a matriz como uma tabela HTML
  const renderMatrix = (matrix: number[][]) => {
    if (!matrix || matrix.length === 0) return null;
    
    return (
      <table className="border-collapse mx-auto my-2">
        <tbody>
          {matrix.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((value, colIndex) => (
                <td 
                  key={colIndex} 
                  className="border border-gray-300 dark:border-gray-600 p-2 text-center"
                >
                  {value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  // Função para renderizar a equação da operação da matriz com os símbolos visuais
  const renderMatrixOperation = () => {
    if (!state.parsedMatrizA || !state.parsedMatrizB) return null;
    
    return (
      <div className="flex flex-col items-center justify-center my-4 space-y-2">
        <div className="flex items-center space-x-4">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Matriz A</p>
            {renderMatrix(state.parsedMatrizA)}
          </div>
          
          <div className="flex items-center justify-center h-full">
            {state.operacao === 'soma' ? (
              <HiPlus className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
            ) : (
              <HiMinus className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
            )}
          </div>
          
          <div className="text-center">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Matriz B</p>
            {renderMatrix(state.parsedMatrizB)}
          </div>
          
          <div className="flex items-center justify-center h-full">
            <span className="text-xl font-bold text-gray-700 dark:text-gray-300">=</span>
          </div>
          
          <div className="text-center">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Resultado</p>
            {state.resultado && renderMatrix(state.resultado)}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <HiTable className="h-6 w-6 text-indigo-600 dark:text-indigo-400 mr-2" />
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          Adição e Subtração de Matrizes
        </h2>
      </div>

      <div className="resolver-container p-6 mb-8">
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          Esta calculadora permite realizar operações de adição e subtração de matrizes, 
          mostrando os passos do cálculo e o resultado final.
        </p>

        <div className="mb-6">
          <div className="mb-4">
            <label htmlFor="matrizA" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Matriz A
            </label>
            <textarea
              id="matrizA"
              rows={4}
              value={state.matrizA}
              onChange={(e) => dispatch({ type: 'SET_MATRIZ_A', valor: e.target.value })}
              className="block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400"
              placeholder="Ex: 1 2 3; 4 5 6; 7 8 9"
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Insira os elementos separados por espaço e as linhas separadas por ponto e vírgula. 
              Exemplo: 1 2 3; 4 5 6; 7 8 9 para uma matriz 3x3.
            </p>
            
            {state.parsedMatrizA && (
              <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Pré-visualização:</p>
                {renderMatrix(state.parsedMatrizA)}
              </div>
            )}
          </div>
          
          <div className="mb-4">
            <label htmlFor="matrizB" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Matriz B
            </label>
            <textarea
              id="matrizB"
              rows={4}
              value={state.matrizB}
              onChange={(e) => dispatch({ type: 'SET_MATRIZ_B', valor: e.target.value })}
              className="block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400"
              placeholder="Ex: 9 8 7; 6 5 4; 3 2 1"
            />
            
            {state.parsedMatrizB && (
              <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Pré-visualização:</p>
                {renderMatrix(state.parsedMatrizB)}
              </div>
            )}
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Operação
            </label>
            <div className="flex space-x-6 mb-2">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio h-4 w-4 text-indigo-600 dark:text-indigo-400"
                  checked={state.operacao === 'soma'}
                  onChange={() => dispatch({ type: 'SET_OPERACAO', valor: 'soma' })}
                />
                <span className="ml-2 text-gray-700 dark:text-gray-300">Adição</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio h-4 w-4 text-indigo-600 dark:text-indigo-400"
                  checked={state.operacao === 'subtracao'}
                  onChange={() => dispatch({ type: 'SET_OPERACAO', valor: 'subtracao' })}
                />
                <span className="ml-2 text-gray-700 dark:text-gray-300">Subtração</span>
              </label>
            </div>
          </div>
          
          {/* Exemplos de matrizes */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Exemplos
            </label>
            <div className="flex flex-wrap gap-2">
              {getMatrixAddSubExamples().map((example, index) => (
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
            className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-medium py-2 px-6 rounded-md transition-colors duration-300 mt-4"
          >
            Calcular
          </button>
        </div>
        
        {state.erro && (
          <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 rounded-md">
            {state.erro}
          </div>
        )}
      </div>
      
      {state.resultado && (
        <div className="space-y-6">
          <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-5">
            <h3 className="text-lg font-medium text-green-800 dark:text-green-300 mb-4">Resultado</h3>
            
            <div className="bg-white dark:bg-gray-800 p-4 rounded-md border border-gray-200 dark:border-gray-700">
              {renderMatrixOperation()}
            </div>
            
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md border-l-2 border-blue-300 dark:border-blue-700">
              <div className="flex items-center">
                <HiInformationCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2 flex-shrink-0" />
                <p className="text-blue-700 dark:text-blue-300 font-medium">
                  {state.operacao === 'soma' 
                    ? 'Na adição de matrizes, somamos os elementos correspondentes (mesma posição) de ambas as matrizes.'
                    : 'Na subtração de matrizes, subtraímos os elementos correspondentes (mesma posição) da matriz B da matriz A.'}
                </p>
              </div>
            </div>
            
            <button 
              onClick={() => dispatch({ type: 'TOGGLE_EXPLICATION' })}
              className="mt-4 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 text-sm font-medium flex items-center"
            >
              <HiCalculator className="h-5 w-5 mr-1" />
              {state.showExplication ? "Ocultar explicação detalhada" : "Mostrar explicação detalhada"}
            </button>
          </div>
          
          {state.showExplication && state.passos.length > 0 && (
            <div className="mt-8 bg-white dark:bg-gray-800 shadow-md rounded-lg p-5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center">
                  <HiCalculator className="h-6 w-6 mr-2 text-indigo-600 dark:text-indigo-400" />
                  Solução passo a passo
                </h3>
              </div>
              
              <StepByStepExplanation steps={state.passos} stepType="matrices" />
              
              <ConceitoMatematico
                title="Conceito Matemático" 
                isOpen={state.showConceitoMatematico} 
                onToggle={() => dispatch({ type: 'TOGGLE_CONCEITO_MATEMATICO' })}
              >
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                  <div className="flex-1">
                    <h5 className="font-medium text-gray-800 dark:text-gray-100 mb-2 border-b border-gray-200 dark:border-gray-700 pb-1">Definição</h5>
                    <p className="text-gray-700 dark:text-gray-300 mb-2">
                      Uma matriz é uma coleção retangular de números organizados em linhas e colunas. A adição e subtração de matrizes são 
                      operações matemáticas que combinam elementos correspondentes de duas matrizes.
                    </p>
                    <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-md border-l-2 border-yellow-300 dark:border-yellow-600 mb-3">
                      <p className="text-sm text-yellow-800 dark:text-yellow-300">
                        <span className="font-semibold">Propriedade importante:</span> Só é possível adicionar ou subtrair matrizes que possuem as mesmas dimensões.
                      </p>
                    </div>
                    
                    <h5 className="font-medium text-gray-800 dark:text-gray-100 mb-2 mt-4 border-b border-gray-200 dark:border-gray-700 pb-1">Operações com Matrizes</h5>
                    <div className="bg-white dark:bg-gray-700 p-3 rounded-md border border-gray-100 dark:border-gray-600 shadow-sm">
                      <div className="space-y-3">
                        <div>
                          <h6 className="text-lg font-medium text-indigo-700 dark:text-indigo-300 mb-1">Adição de Matrizes</h6>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Se A e B são matrizes de mesma dimensão, então A + B é a matriz obtida somando os elementos correspondentes:
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            (A + B)ᵢⱼ = Aᵢⱼ + Bᵢⱼ
                          </p>
                        </div>
                        
                        <div>
                          <h6 className="text-lg font-medium text-indigo-700 dark:text-indigo-300 mb-1">Subtração de Matrizes</h6>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Se A e B são matrizes de mesma dimensão, então A - B é a matriz obtida subtraindo os elementos correspondentes:
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            (A - B)ᵢⱼ = Aᵢⱼ - Bᵢⱼ
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-md border-l-2 border-green-300 dark:border-green-700 mt-3 mb-3">
                      <h6 className="text-green-700 dark:text-green-300 font-medium mb-1">Propriedades da Adição de Matrizes</h6>
                      <ul className="text-sm text-gray-700 dark:text-gray-300 list-disc list-inside mb-2 space-y-1">
                        <li><span className="font-medium">Comutativa:</span> A + B = B + A<br/>
                          <span className="text-xs ml-6">A ordem das matrizes na adição não altera o resultado.</span>
                        </li>
                        <li><span className="font-medium">Associativa:</span> (A + B) + C = A + (B + C)<br/>
                          <span className="text-xs ml-6">A forma como agrupamos as matrizes na adição não altera o resultado.</span>
                        </li>
                        <li><span className="font-medium">Elemento neutro:</span> A + O = A (onde O é a matriz nula)<br/>
                          <span className="text-xs ml-6">A matriz nula (com todos os elementos iguais a zero) é o elemento neutro da adição.</span>
                        </li>
                        <li><span className="font-medium">Elemento oposto:</span> A + (-A) = O<br/>
                          <span className="text-xs ml-6">Para cada matriz A, existe uma matriz oposta -A tal que A + (-A) é a matriz nula.</span>
                        </li>
                        <li><span className="font-medium">Distributiva em relação à multiplicação por escalar:</span> k(A + B) = kA + kB<br/>
                          <span className="text-xs ml-6">A multiplicação por um escalar k distribui sobre a adição de matrizes.</span>
                        </li>
                      </ul>
                      
                      <h6 className="text-green-700 dark:text-green-300 font-medium mt-3 mb-1">Propriedades da Subtração de Matrizes</h6>
                      <ul className="text-sm text-gray-700 dark:text-gray-300 list-disc list-inside mb-2 space-y-1">
                        <li><span className="font-medium">Não comutativa:</span> A - B ≠ B - A (em geral)<br/>
                          <span className="text-xs ml-6">A ordem das matrizes na subtração altera o resultado.</span>
                        </li>
                        <li><span className="font-medium">Relação com a adição:</span> A - B = A + (-B)<br/>
                          <span className="text-xs ml-6">A subtração pode ser vista como a adição da matriz oposta.</span>
                        </li>
                        <li><span className="font-medium">Propriedade da diferença nula:</span> A - A = O<br/>
                          <span className="text-xs ml-6">A subtração de uma matriz por ela mesma resulta na matriz nula.</span>
                        </li>
                        <li><span className="font-medium">Distributiva em relação à multiplicação por escalar:</span> k(A - B) = kA - kB<br/>
                          <span className="text-xs ml-6">A multiplicação por um escalar k distribui sobre a subtração de matrizes.</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <h5 className="font-medium text-gray-800 dark:text-gray-100 mb-2 border-b border-gray-200 dark:border-gray-700 pb-1">Exemplos</h5>
                    <div className="bg-white dark:bg-gray-700 p-3 rounded-md border border-gray-100 dark:border-gray-600 shadow-sm mb-3">
                      <h6 className="text-base font-medium text-indigo-700 dark:text-indigo-300 mb-2">Adição de Matrizes 2×2</h6>
                      <div className="grid grid-cols-3 gap-1 items-center justify-items-center">
                        <div className="text-center">
                          <div className="border border-gray-300 dark:border-gray-600 p-2 inline-block">
                            <div className="text-sm">1 2</div>
                            <div className="text-sm">3 4</div>
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Matriz A</p>
                        </div>
                        <div className="text-2xl text-gray-600 dark:text-gray-400">+</div>
                        <div className="text-center">
                          <div className="border border-gray-300 dark:border-gray-600 p-2 inline-block">
                            <div className="text-sm">5 6</div>
                            <div className="text-sm">7 8</div>
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Matriz B</p>
                        </div>
                        <div className="col-span-3 text-center my-2">=</div>
                        <div className="text-center col-span-3">
                          <div className="border border-gray-300 dark:border-gray-600 p-2 inline-block">
                            <div className="text-sm">6 8</div>
                            <div className="text-sm">10 12</div>
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Matriz Resultante</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-700 p-3 rounded-md border border-gray-100 dark:border-gray-600 shadow-sm mb-3">
                      <h6 className="text-base font-medium text-indigo-700 dark:text-indigo-300 mb-2">Subtração de Matrizes 2×2</h6>
                      <div className="grid grid-cols-3 gap-1 items-center justify-items-center">
                        <div className="text-center">
                          <div className="border border-gray-300 dark:border-gray-600 p-2 inline-block">
                            <div className="text-sm">9 8</div>
                            <div className="text-sm">7 6</div>
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Matriz A</p>
                        </div>
                        <div className="text-2xl text-gray-600 dark:text-gray-400">-</div>
                        <div className="text-center">
                          <div className="border border-gray-300 dark:border-gray-600 p-2 inline-block">
                            <div className="text-sm">4 3</div>
                            <div className="text-sm">2 1</div>
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Matriz B</p>
                        </div>
                        <div className="col-span-3 text-center my-2">=</div>
                        <div className="text-center col-span-3">
                          <div className="border border-gray-300 dark:border-gray-600 p-2 inline-block">
                            <div className="text-sm">5 5</div>
                            <div className="text-sm">5 5</div>
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Matriz Resultante</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md border-l-2 border-blue-300 dark:border-blue-700 mb-3">
                      <h6 className="text-blue-700 dark:text-blue-300 font-medium mb-1">Aplicações Práticas</h6>
                      <ul className="text-sm text-gray-700 dark:text-gray-300 list-disc list-inside space-y-1">
                        <li><span className="font-medium">Economia:</span> Representação de dados econômicos e análise de transações</li>
                        <li><span className="font-medium">Engenharia:</span> Análise estrutural e transformações geométricas</li>
                        <li><span className="font-medium">Física:</span> Representação de sistemas de equações</li>
                        <li><span className="font-medium">Computação Gráfica:</span> Transformações e animações</li>
                        <li><span className="font-medium">Estatística:</span> Análise de dados multivariados</li>
                      </ul>
                    </div>
                    
                    <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-md">
                      <h6 className="text-indigo-700 dark:text-indigo-300 font-medium mb-1">Matrizes Especiais</h6>
                      <div className="space-y-2">
                        <div>
                          <h6 className="text-sm font-medium text-gray-700 dark:text-gray-300">Matriz Identidade (I)</h6>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            Uma matriz quadrada com 1's na diagonal principal e 0's nas demais posições.
                            Para qualquer matriz A, A + I ≠ A, mas A × I = A.
                          </p>
                        </div>
                        <div>
                          <h6 className="text-sm font-medium text-gray-700 dark:text-gray-300">Matriz Nula (O)</h6>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            Uma matriz com todos os elementos iguais a zero.
                            Para qualquer matriz A, A + O = A.
                          </p>
                        </div>
                        <div>
                          <h6 className="text-sm font-medium text-gray-700 dark:text-gray-300">Matriz Transposta (Aᵀ)</h6>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            A transposta de uma matriz A é obtida trocando linhas por colunas.
                            Propriedade: (A + B)ᵀ = Aᵀ + Bᵀ
                          </p>
                        </div>
                      </div>
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

export default ResolvedorAddSubMatrizes; 