import React from 'react';
import { 
  HiCalculator, 
  HiInformationCircle, 
  HiX
} from 'react-icons/hi';
import { 
  getMatrixMultiplicationExamples, 
  getScalarMultiplicationExamples 
} from '../../utils/mathUtilsMatrizes';
import { useMatrizMultiplicationSolver } from '../../hooks/matrizes/useMatrizMultiplicationSolver';
import StepByStepExplanation from '../../components/StepByStepExplanation';
import ConceitoMatematico from '../../components/ConceitoMatematico';

const ResolvedorMultiplicacaoMatrizes: React.FC = () => {
  const { 
    state, 
    dispatch, 
    handleSolve, 
    applyMatrixExample, 
    applyScalarExample 
  } = useMatrizMultiplicationSolver();

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
    if (state.operationType === 'matrix' && (!state.parsedMatrixA || !state.parsedMatrixB)) return null;
    if (state.operationType === 'scalar' && !state.parsedMatrixA) return null;
    
    if (state.operationType === 'matrix') {
      return (
        <div className="flex flex-col items-center justify-center my-4 space-y-2">
          <div className="flex items-center space-x-4 flex-wrap justify-center">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Matriz A</p>
              {renderMatrix(state.parsedMatrixA!)}
            </div>
            
            <div className="flex items-center justify-center h-full">
              <HiX className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
            </div>
            
            <div className="text-center">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Matriz B</p>
              {renderMatrix(state.parsedMatrixB!)}
            </div>
            
            <div className="flex items-center justify-center h-full">
              <span className="text-xl font-bold text-gray-700 dark:text-gray-300">=</span>
            </div>
            
            <div className="text-center">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Resultado</p>
              {state.result && renderMatrix(state.result)}
            </div>
          </div>
        </div>
      );
    } else { // Multiplicação por escalar
      return (
        <div className="flex flex-col items-center justify-center my-4 space-y-2">
          <div className="flex items-center space-x-4 flex-wrap justify-center">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Escalar</p>
              <div className="flex items-center justify-center h-12 w-12 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700">
                <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{state.scalar}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-center h-full">
              <HiX className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
            </div>
            
            <div className="text-center">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Matriz A</p>
              {renderMatrix(state.parsedMatrixA!)}
            </div>
            
            <div className="flex items-center justify-center h-full">
              <span className="text-xl font-bold text-gray-700 dark:text-gray-300">=</span>
            </div>
            
            <div className="text-center">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Resultado</p>
              {state.result && renderMatrix(state.result)}
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <HiCalculator className="h-6 w-6 text-indigo-600 dark:text-indigo-400 mr-2" />
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          Multiplicação de Matrizes
        </h2>
      </div>

      <div className="resolver-container p-6 mb-8">
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          Esta calculadora permite realizar operações de multiplicação de matrizes e multiplicação por escalar,
          mostrando os passos do cálculo e o resultado final.
        </p>

        <div className="mb-6">
          <div className="mb-4">
            <label htmlFor="matrixA" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Matriz A
            </label>
            <textarea
              id="matrixA"
              rows={4}
              value={state.matrixA}
              onChange={(e) => dispatch({ type: 'SET_MATRIX_A', value: e.target.value })}
              className="block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400"
              placeholder="Ex: 1 2 3; 4 5 6; 7 8 9"
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Insira os elementos separados por espaço e as linhas separadas por ponto e vírgula. 
              Exemplo: 1 2 3; 4 5 6; 7 8 9 para uma matriz 3x3.
            </p>
            
            {state.parsedMatrixA && (
              <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Pré-visualização:</p>
                {renderMatrix(state.parsedMatrixA)}
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Dimensão: {state.parsedMatrixA.length}×{state.parsedMatrixA[0]?.length}
                </p>
              </div>
            )}
          </div>
          
          {state.operationType === 'matrix' ? (
            <div className="mb-4">
              <label htmlFor="matrixB" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Matriz B
              </label>
              <textarea
                id="matrixB"
                rows={4}
                value={state.matrixB}
                onChange={(e) => dispatch({ type: 'SET_MATRIX_B', value: e.target.value })}
                className="block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400"
                placeholder="Ex: 9 8 7; 6 5 4; 3 2 1"
              />
              
              {state.parsedMatrixB && (
                <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Pré-visualização:</p>
                  {renderMatrix(state.parsedMatrixB)}
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Dimensão: {state.parsedMatrixB.length}×{state.parsedMatrixB[0]?.length}
                  </p>
                </div>
              )}
              
              <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                <div className="flex items-start">
                  <HiInformationCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      <span className="font-medium">Requisito para multiplicação de matrizes:</span> O número de colunas 
                      da matriz A deve ser igual ao número de linhas da matriz B.
                    </p>
                    {state.parsedMatrixA && state.parsedMatrixB && (
                      <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                        {state.parsedMatrixA[0]?.length === state.parsedMatrixB.length
                          ? `✓ Compatível: ${state.parsedMatrixA[0]?.length} colunas (A) = ${state.parsedMatrixB.length} linhas (B)`
                          : `✗ Incompatível: ${state.parsedMatrixA[0]?.length} colunas (A) ≠ ${state.parsedMatrixB.length} linhas (B)`
                        }
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="mb-4">
              <label htmlFor="scalar" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Valor Escalar
              </label>
              <input
                id="scalar"
                type="text"
                value={state.scalar}
                onChange={(e) => dispatch({ type: 'SET_SCALAR', value: e.target.value })}
                className="w-32 p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400"
                placeholder="Ex: 2.5"
              />
              
              <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                <div className="flex items-start">
                  <HiInformationCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Na multiplicação por escalar, cada elemento da matriz é multiplicado pelo valor escalar.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Operação
            </label>
            <div className="flex space-x-6 mb-2">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio h-4 w-4 text-indigo-600 dark:text-indigo-400"
                  checked={state.operationType === 'matrix'}
                  onChange={() => dispatch({ type: 'SET_OPERATION_TYPE', value: 'matrix' })}
                />
                <span className="ml-2 text-gray-700 dark:text-gray-300">Matriz × Matriz</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio h-4 w-4 text-indigo-600 dark:text-indigo-400"
                  checked={state.operationType === 'scalar'}
                  onChange={() => dispatch({ type: 'SET_OPERATION_TYPE', value: 'scalar' })}
                />
                <span className="ml-2 text-gray-700 dark:text-gray-300">Escalar × Matriz</span>
              </label>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Exemplos
            </label>
            <div className="flex flex-wrap gap-2">
              {state.operationType === 'matrix' 
                ? getMatrixMultiplicationExamples().map((example, index) => (
                    <button
                      key={index}
                      onClick={() => applyMatrixExample(example)}
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm rounded-full transition-colors"
                    >
                      {example.description}
                    </button>
                  ))
                : getScalarMultiplicationExamples().map((example, index) => (
                    <button
                      key={index}
                      onClick={() => applyScalarExample(example)}
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm rounded-full transition-colors"
                    >
                      {example.description}
                    </button>
                  ))
              }
            </div>
          </div>
          
          <button
            onClick={handleSolve}
            className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-medium py-2 px-6 rounded-md transition-colors duration-300 mt-4"
          >
            Calcular
          </button>
        </div>
        
        {state.error && (
          <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 rounded-md">
            {state.error}
          </div>
        )}
      </div>
      
      {state.result && (
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
                  {state.operationType === 'matrix' 
                    ? 'Na multiplicação de matrizes A×B, cada elemento do resultado é o produto escalar da linha correspondente de A com a coluna correspondente de B.'
                    : 'Na multiplicação por escalar k×A, cada elemento da matriz é multiplicado pelo escalar k.'}
                </p>
              </div>
            </div>
            
            <button 
              onClick={() => dispatch({ type: 'TOGGLE_EXPLANATION' })}
              className="mt-4 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 text-sm font-medium flex items-center"
            >
              <HiCalculator className="h-5 w-5 mr-1" />
              {state.showExplanation ? "Ocultar explicação detalhada" : "Mostrar explicação detalhada"}
            </button>
          </div>
          
          {state.showExplanation && state.steps.length > 0 && (
            <div className="mt-8 bg-white dark:bg-gray-800 shadow-md rounded-lg p-5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center">
                  <HiCalculator className="h-6 w-6 mr-2 text-indigo-600 dark:text-indigo-400" />
                  Solução passo a passo
                </h3>
              </div>
              
              <StepByStepExplanation steps={state.steps} stepType="matrices" />
              
              <ConceitoMatematico
                title="Conceito Matemático" 
                isOpen={state.showConceitoMatematico} 
                onToggle={() => dispatch({ type: 'TOGGLE_CONCEITO_MATEMATICO' })}
              >
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                  <div className="flex-1">
                    <h5 className="font-medium text-gray-800 dark:text-gray-100 mb-2 border-b border-gray-200 dark:border-gray-700 pb-1">Definição</h5>
                    
                    {state.operationType === 'matrix' ? (
                      <>
                        <p className="text-gray-700 dark:text-gray-300 mb-2">
                          A multiplicação de matrizes é uma operação binária que produz uma única matriz a partir de duas matrizes. 
                          Para duas matrizes A e B poderem ser multiplicadas, o número de colunas da matriz A deve ser igual ao número de linhas da matriz B.
                        </p>
                        
                        <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-md border-l-2 border-yellow-300 dark:border-yellow-600 mb-3">
                          <p className="text-sm text-yellow-800 dark:text-yellow-300">
                            <span className="font-semibold">Requisito importante:</span> Se A é uma matriz m×n e B é uma matriz n×p, então o produto AB é uma matriz m×p.
                          </p>
                        </div>
                        
                        <div className="bg-white dark:bg-gray-700 p-3 rounded-md border border-gray-100 dark:border-gray-600 shadow-sm">
                          <h6 className="text-lg font-medium text-indigo-700 dark:text-indigo-300 mb-1">Fórmula</h6>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Se A = [aᵢⱼ] é uma matriz m×n e B = [bᵢⱼ] é uma matriz n×p, então o produto C = AB é a matriz m×p cujos elementos são dados por:
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 font-mono">
                            cᵢⱼ = Σ aᵢₖ × bₖⱼ (para k de 1 até n)
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Ou seja, o elemento cᵢⱼ é o produto escalar da i-ésima linha de A com a j-ésima coluna de B.
                          </p>
                        </div>

                        <h6 className="text-base font-medium text-gray-800 dark:text-gray-100 mt-4 mb-2">Interpretação Visual</h6>
                        <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                          Para calcular o elemento na posição (i,j) da matriz resultante:
                        </p>
                        <ol className="text-sm text-gray-700 dark:text-gray-300 list-decimal list-inside space-y-1 ml-2">
                          <li>Pegue a i-ésima linha da matriz A</li>
                          <li>Pegue a j-ésima coluna da matriz B</li>
                          <li>Multiplique os elementos correspondentes</li>
                          <li>Some os produtos obtidos</li>
                        </ol>

                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md border-l-2 border-blue-300 dark:border-blue-700 my-3">
                          <h6 className="text-blue-700 dark:text-blue-300 font-medium mb-1">Exemplo Visual</h6>
                          <p className="text-sm text-blue-800 dark:text-blue-200 mb-2">
                            Para calcular o elemento c₁₁ do produto C = A×B:
                          </p>
                          <p className="text-sm text-blue-800 dark:text-blue-200">
                            c₁₁ = a₁₁×b₁₁ + a₁₂×b₂₁ + ... + a₁ₙ×bₙ₁
                          </p>
                        </div>

                        <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-md border-l-2 border-indigo-300 dark:border-indigo-700 my-3">
                          <h6 className="text-indigo-700 dark:text-indigo-300 font-medium mb-1">Aplicações Específicas</h6>
                          <ul className="text-sm text-gray-700 dark:text-gray-300 list-disc list-inside space-y-1">
                            <li><span className="font-medium">Composição de transformações lineares:</span> Se A e B representam transformações lineares, AB representa a composição dessas transformações</li>
                            <li><span className="font-medium">Sistemas de equações lineares:</span> Ax = b, onde A é a matriz de coeficientes, x é o vetor de incógnitas e b é o vetor de termos independentes</li>
                            <li><span className="font-medium">Cadeias de Markov:</span> Onde a matriz de transição representa as probabilidades de mudança entre estados</li>
                          </ul>
                        </div>
                        
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md border-l-2 border-blue-300 dark:border-blue-700 mb-3">
                          <h6 className="text-blue-700 dark:text-blue-300 font-medium mb-1">Aplicações Práticas</h6>
                          <ul className="text-sm text-gray-700 dark:text-gray-300 list-disc list-inside space-y-1">
                            <li><span className="font-medium">Sistemas de Equações Lineares:</span> Para resolver sistemas de equações</li>
                            <li><span className="font-medium">Transformações Geométricas:</span> Para rotações, reflexões e projeções</li>
                            <li><span className="font-medium">Computação Gráfica:</span> Para transformações 3D e renderização</li>
                            <li><span className="font-medium">Criptografia:</span> Em algoritmos como o Hill cipher</li>
                            <li><span className="font-medium">Economia:</span> Em modelos de entrada-saída e análise de Leontief</li>
                            <li><span className="font-medium">Física:</span> Para transformações de coordenadas e mecânica quântica</li>
                            <li><span className="font-medium">Machine Learning:</span> Em operações com redes neurais e matrizes de pesos</li>
                            <li><span className="font-medium">Teoria dos Grafos:</span> Na representação de grafos através de matrizes de adjacência</li>
                          </ul>
                        </div>
                      </>
                    ) : (
                      <>
                        <p className="text-gray-700 dark:text-gray-300 mb-2">
                          A multiplicação por escalar é uma operação que multiplica cada elemento de uma matriz por um número (escalar).
                          É uma das operações fundamentais da álgebra linear.
                        </p>
                        
                        <div className="bg-white dark:bg-gray-700 p-3 rounded-md border border-gray-100 dark:border-gray-600 shadow-sm">
                          <h6 className="text-lg font-medium text-indigo-700 dark:text-indigo-300 mb-1">Fórmula</h6>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Se A = [aᵢⱼ] é uma matriz m×n e k é um escalar, então o produto kA é a matriz m×n cujos elementos são dados por:
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 font-mono">
                            (kA)ᵢⱼ = k × aᵢⱼ
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Ou seja, cada elemento da matriz resultante é k vezes o elemento correspondente da matriz original.
                          </p>
                        </div>

                        <h6 className="text-base font-medium text-gray-800 dark:text-gray-100 mt-4 mb-2">Interpretação Geométrica</h6>
                        <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                          A multiplicação de uma matriz por um escalar pode ser interpretada geometricamente como:
                        </p>
                        <ul className="text-sm text-gray-700 dark:text-gray-300 list-disc list-inside space-y-1 ml-2">
                          <li>Um <span className="font-medium">redimensionamento</span> quando |k| &gt; 1 (ampliação)</li>
                          <li>Um <span className="font-medium">redimensionamento</span> quando 0 &lt; |k| &lt; 1 (redução)</li>
                          <li>Uma <span className="font-medium">reflexão</span> quando k &lt; 0, além do redimensionamento</li>
                          <li>Uma <span className="font-medium">projeção no zero</span> quando k = 0</li>
                        </ul>

                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md border-l-2 border-blue-300 dark:border-blue-700 my-3">
                          <h6 className="text-blue-700 dark:text-blue-300 font-medium mb-1">Exemplo Visual</h6>
                          <p className="text-sm text-blue-800 dark:text-blue-200 mb-2">
                            Para a matriz A = [1 2; 3 4] e o escalar k = 2:
                          </p>
                          <div className="flex items-center justify-center text-blue-800 dark:text-blue-200 font-mono">
                            <div>2 ×</div>
                            <div className="mx-2">
                              <div>[1 2]</div>
                              <div>[3 4]</div>
                            </div>
                            <div>=</div>
                            <div className="mx-2">
                              <div>[2 4]</div>
                              <div>[6 8]</div>
                            </div>
                          </div>
                        </div>

                        <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-md border-l-2 border-indigo-300 dark:border-indigo-700 my-3">
                          <h6 className="text-indigo-700 dark:text-indigo-300 font-medium mb-1">Aplicações Específicas</h6>
                          <ul className="text-sm text-gray-700 dark:text-gray-300 list-disc list-inside space-y-1">
                            <li><span className="font-medium">Transformações de escala:</span> Em computação gráfica para redimensionar objetos</li>
                            <li><span className="font-medium">Normalização:</span> Multiplicação por 1/||v|| para normalizar um vetor v</li>
                            <li><span className="font-medium">Mudança de unidades:</span> Conversão entre diferentes sistemas de medida</li>
                            <li><span className="font-medium">Ajuste de intensidade:</span> Em processamento de imagens para alterar brilho/contraste</li>
                          </ul>
                        </div>
                        
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md border-l-2 border-blue-300 dark:border-blue-700 mb-3">
                          <h6 className="text-blue-700 dark:text-blue-300 font-medium mb-1">Aplicações Práticas</h6>
                          <ul className="text-sm text-gray-700 dark:text-gray-300 list-disc list-inside space-y-1">
                            <li><span className="font-medium">Sistemas de Equações Lineares:</span> Para resolver sistemas de equações</li>
                            <li><span className="font-medium">Transformações Geométricas:</span> Para rotações, reflexões e projeções</li>
                            <li><span className="font-medium">Computação Gráfica:</span> Para transformações 3D e renderização</li>
                            <li><span className="font-medium">Criptografia:</span> Em algoritmos como o Hill cipher</li>
                            <li><span className="font-medium">Economia:</span> Em modelos de entrada-saída e análise de Leontief</li>
                            <li><span className="font-medium">Física:</span> Para transformações de coordenadas e mecânica quântica</li>
                            <li><span className="font-medium">Machine Learning:</span> Em operações com redes neurais e matrizes de pesos</li>
                            <li><span className="font-medium">Teoria dos Grafos:</span> Na representação de grafos através de matrizes de adjacência</li>
                          </ul>
                        </div>
                      </>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <h5 className="font-medium text-gray-800 dark:text-gray-100 mb-2 border-b border-gray-200 dark:border-gray-700 pb-1">Propriedades</h5>
                    
                    {state.operationType === 'matrix' ? (
                      <>
                        <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-md border-l-2 border-green-300 dark:border-green-700 mb-3">
                          <h6 className="text-green-700 dark:text-green-300 font-medium mb-1">Propriedades da Multiplicação de Matrizes</h6>
                          <ul className="text-sm text-gray-700 dark:text-gray-300 list-disc list-inside mb-2 space-y-1">
                            <li><span className="font-medium">Não comutativa:</span> Em geral, AB ≠ BA<br/>
                              <span className="text-xs ml-6">A ordem das matrizes na multiplicação importa.</span>
                            </li>
                            <li><span className="font-medium">Associativa:</span> (AB)C = A(BC)<br/>
                              <span className="text-xs ml-6">A forma como agrupamos as multiplicações não altera o resultado.</span>
                            </li>
                            <li><span className="font-medium">Distributiva em relação à adição:</span> A(B+C) = AB + AC<br/>
                              <span className="text-xs ml-6">A multiplicação distribui sobre a adição.</span>
                            </li>
                            <li><span className="font-medium">Multiplicação por matriz identidade:</span> AI = IA = A<br/>
                              <span className="text-xs ml-6">A matriz identidade é o elemento neutro da multiplicação.</span>
                            </li>
                            <li><span className="font-medium">Multiplicação por matriz nula:</span> A0 = 0A = 0<br/>
                              <span className="text-xs ml-6">O produto com a matriz nula é sempre a matriz nula.</span>
                            </li>
                            <li><span className="font-medium">Transposição do produto:</span> (AB)ᵀ = BᵀAᵀ<br/>
                              <span className="text-xs ml-6">A transposta de um produto é o produto das transpostas em ordem inversa.</span>
                            </li>
                            <li><span className="font-medium">Determinante do produto:</span> det(AB) = det(A) × det(B)<br/>
                              <span className="text-xs ml-6">O determinante do produto é o produto dos determinantes.</span>
                            </li>
                          </ul>
                        </div>

                        <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-md border-l-2 border-purple-300 dark:border-purple-700 mb-3">
                          <h6 className="text-purple-700 dark:text-purple-300 font-medium mb-1">Multiplicação de Tipos Especiais de Matrizes</h6>
                          <ul className="text-sm text-gray-700 dark:text-gray-300 list-disc list-inside space-y-1">
                            <li><span className="font-medium">Matrizes diagonais:</span> O produto de duas matrizes diagonais é uma matriz diagonal cujos elementos são os produtos dos elementos correspondentes</li>
                            <li><span className="font-medium">Matrizes triangulares:</span> O produto de duas matrizes triangulares superiores (ou inferiores) é também uma matriz triangular superior (ou inferior)</li>
                            <li><span className="font-medium">Matrizes ortogonais:</span> Se Q é uma matriz ortogonal, então QᵀQ = QQᵀ = I</li>
                            <li><span className="font-medium">Matrizes simétricas:</span> O produto de uma matriz simétrica por si mesma é também simétrico: AAᵀ é sempre simétrico para qualquer matriz A</li>
                          </ul>
                        </div>

                        <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-md border-l-2 border-amber-300 dark:border-amber-700 mb-3">
                          <h6 className="text-amber-700 dark:text-amber-300 font-medium mb-1">Casos Especiais e Exemplos</h6>
                          <div className="space-y-2">
                            <div>
                              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Exemplo 1: Multiplicação de matriz 2×2 por 2×2</p>
                              <div className="text-xs text-gray-600 dark:text-gray-400 font-mono mt-1 ml-2">
                                <div>[a b] × [e f] = [ae+bg af+bh]</div>
                                <div>[c d]   [g h]   [ce+dg cf+dh]</div>
                              </div>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Exemplo 2: Matriz linha por matriz coluna</p>
                              <div className="text-xs text-gray-600 dark:text-gray-400 font-mono mt-1 ml-2">
                                <div>[a b c] × [d] = [ad+be+cf]</div>
                                <div>         [e]</div>
                                <div>         [f]</div>
                              </div>
                              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 ml-2">
                                Resulta em um escalar (matriz 1×1)
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Exemplo 3: Matriz coluna por matriz linha</p>
                              <div className="text-xs text-gray-600 dark:text-gray-400 font-mono mt-1 ml-2">
                                <div>[a] × [d e f] = [ad ae af]</div>
                                <div>[b]             [bd be bf]</div>
                                <div>[c]             [cd ce cf]</div>
                              </div>
                              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 ml-2">
                                Resulta em uma matriz de posto 1
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-md border-l-2 border-red-300 dark:border-red-700 mb-3">
                          <h6 className="text-red-700 dark:text-red-300 font-medium mb-1">Erros Comuns</h6>
                          <ul className="text-sm text-gray-700 dark:text-gray-300 list-disc list-inside space-y-1">
                            <li>Assumir que a multiplicação de matrizes é comutativa (AB = BA)</li>
                            <li>Tentar multiplicar matrizes com dimensões incompatíveis</li>
                            <li>Confundir multiplicação de matrizes com multiplicação elemento a elemento</li>
                            <li>Esquecer que a ordem dos fatores afeta o resultado e pode até mesmo tornar a operação impossível</li>
                            <li>Distribuir erroneamente um escalar em expressões com multiplicação de matrizes</li>
                          </ul>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-md border-l-2 border-green-300 dark:border-green-700 mb-3">
                          <h6 className="text-green-700 dark:text-green-300 font-medium mb-1">Propriedades da Multiplicação por Escalar</h6>
                          <ul className="text-sm text-gray-700 dark:text-gray-300 list-disc list-inside mb-2 space-y-1">
                            <li><span className="font-medium">Distributiva em relação à adição de matrizes:</span> k(A+B) = kA + kB<br/>
                              <span className="text-xs ml-6">O escalar distribui sobre a adição de matrizes.</span>
                            </li>
                            <li><span className="font-medium">Distributiva em relação à adição de escalares:</span> (k+m)A = kA + mA<br/>
                              <span className="text-xs ml-6">A soma de escalares distribui sobre a matriz.</span>
                            </li>
                            <li><span className="font-medium">Associativa com multiplicação de escalares:</span> (km)A = k(mA)<br/>
                              <span className="text-xs ml-6">A multiplicação de escalares associa sobre matrizes.</span>
                            </li>
                            <li><span className="font-medium">Elemento neutro:</span> 1A = A<br/>
                              <span className="text-xs ml-6">O escalar 1 é o elemento neutro da multiplicação.</span>
                            </li>
                            <li><span className="font-medium">Multiplicação por zero:</span> 0A = 0<br/>
                              <span className="text-xs ml-6">Multiplicar por zero resulta na matriz nula.</span>
                            </li>
                            <li><span className="font-medium">Comportamento com a transposta:</span> (kA)ᵀ = kAᵀ<br/>
                              <span className="text-xs ml-6">Transpor e multiplicar por escalar são operações comutativas.</span>
                            </li>
                            <li><span className="font-medium">Efeito no determinante:</span> det(kA) = kⁿ·det(A)<br/>
                              <span className="text-xs ml-6">Para uma matriz A de ordem n×n.</span>
                            </li>
                          </ul>
                        </div>

                        <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-md border-l-2 border-purple-300 dark:border-purple-700 mb-3">
                          <h6 className="text-purple-700 dark:text-purple-300 font-medium mb-1">Tipos Especiais de Escalares</h6>
                          <ul className="text-sm text-gray-700 dark:text-gray-300 list-disc list-inside space-y-1">
                            <li><span className="font-medium">k = -1:</span> Inverte o sinal de todos os elementos, equivalente a uma reflexão</li>
                            <li><span className="font-medium">k = 0:</span> Transforma qualquer matriz na matriz nula (colapso)</li>
                            <li><span className="font-medium">k = 1:</span> Mantém a matriz inalterada (identidade escalar)</li>
                            <li><span className="font-medium">k = 1/n:</span> Divide todos os elementos por n (normalmente usado em médias ou normalizações)</li>
                            <li><span className="font-medium">k imaginário:</span> Em matrizes complexas, multiplica por números imaginários (rotação no plano complexo)</li>
                          </ul>
                        </div>

                        <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-md border-l-2 border-amber-300 dark:border-amber-700 mb-3">
                          <h6 className="text-amber-700 dark:text-amber-300 font-medium mb-1">Casos Especiais e Exemplos</h6>
                          <div className="space-y-2">
                            <div>
                              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Exemplo 1: Multiplicação por -1 (Inversão)</p>
                              <div className="text-xs text-gray-600 dark:text-gray-400 font-mono mt-1 ml-2">
                                <div>-1 × [1 2] = [-1 -2]</div>
                                <div>     [3 4]   [-3 -4]</div>
                              </div>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Exemplo 2: Multiplicação por 0.5 (Redução pela metade)</p>
                              <div className="text-xs text-gray-600 dark:text-gray-400 font-mono mt-1 ml-2">
                                <div>0.5 × [10 20] = [5 10]</div>
                                <div>      [30 40]   [15 20]</div>
                              </div>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Exemplo 3: Efeito no determinante</p>
                              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1 ml-2">
                                <p>Para uma matriz 2×2: det([a b; c d]) = ad - bc</p>
                                <p>Multiplicando por k: det(k[a b; c d]) = det([ka kb; kc kd]) = (ka)(kd) - (kb)(kc) = k²(ad - bc) = k²·det(A)</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-md border-l-2 border-red-300 dark:border-red-700 mb-3">
                          <h6 className="text-red-700 dark:text-red-300 font-medium mb-1">Erros Comuns</h6>
                          <ul className="text-sm text-gray-700 dark:text-gray-300 list-disc list-inside space-y-1">
                            <li>Assumir que a multiplicação de matrizes é comutativa (AB = BA)</li>
                            <li>Tentar multiplicar matrizes com dimensões incompatíveis</li>
                            <li>Confundir multiplicação de matrizes com multiplicação elemento a elemento</li>
                            <li>Esquecer que a ordem dos fatores afeta o resultado e pode até mesmo tornar a operação impossível</li>
                            <li>Distribuir erroneamente um escalar em expressões com multiplicação de matrizes</li>
                          </ul>
                        </div>
                      </>
                    )}
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

export default ResolvedorMultiplicacaoMatrizes; 