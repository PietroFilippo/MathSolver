import React from 'react';
import { 
  HiCalculator, 
  HiInformationCircle
} from 'react-icons/hi';
import { getDeterminantExamples } from '../../utils/mathUtilsMatrizes';
import { useMatrizDeterminantSolver } from '../../hooks/matrizes/useMatrizDeterminanteSolver';
import StepByStepExplanation from '../../components/StepByStepExplanation';
import ConceitoMatematico from '../../components/ConceitoMatematico';

const ResolvedorDeterminanteMatrizes: React.FC = () => {
  const { 
    state, 
    dispatch, 
    handleSolve, 
    applyExample
  } = useMatrizDeterminantSolver();

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

  // Função para renderizar a equação do determinante com notação matemática
  const renderDeterminantNotation = () => {
    if (!state.parsedMatrix) return null;
    
    return (
      <div className="flex flex-col items-center justify-center my-4 space-y-2">
        <div className="flex items-center space-x-4 flex-wrap justify-center">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Matriz</p>
            <div className="flex items-center">
              <span className="text-xl font-medium mr-1">|</span>
              {renderMatrix(state.parsedMatrix)}
              <span className="text-xl font-medium ml-1">|</span>
            </div>
          </div>
          
          <div className="flex items-center justify-center h-full">
            <span className="text-xl font-bold text-gray-700 dark:text-gray-300">=</span>
          </div>
          
          <div className="text-center">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Determinante</p>
            <div className="bg-indigo-50 dark:bg-indigo-900/20 px-4 py-2 rounded-md">
              <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                {state.result !== null ? state.result : '?'}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <HiCalculator className="h-6 w-6 text-indigo-600 dark:text-indigo-400 mr-2" />
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          Determinante de Matrizes
        </h2>
      </div>

      <div className="resolver-container p-6 mb-8">
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          Esta calculadora permite calcular o determinante de uma matriz quadrada,
          mostrando os passos do cálculo e o resultado final.
        </p>

        <div className="mb-6">
          <div className="mb-4">
            <label htmlFor="matrix" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Matriz
            </label>
            <textarea
              id="matrix"
              rows={4}
              value={state.matrix}
              onChange={(e) => dispatch({ type: 'SET_MATRIX', value: e.target.value })}
              className="block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400"
              placeholder="Ex: 1 2; 3 4"
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Insira os elementos separados por espaço e as linhas separadas por ponto e vírgula. 
              Exemplo: 1 2; 3 4 para uma matriz 2x2.
            </p>
            
            {state.parsedMatrix && (
              <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Pré-visualização:</p>
                {renderMatrix(state.parsedMatrix)}
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Dimensão: {state.parsedMatrix.length}×{state.parsedMatrix[0]?.length}
                </p>
                
                {state.parsedMatrix.length !== state.parsedMatrix[0]?.length && (
                  <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-sm rounded-md">
                    <HiInformationCircle className="inline-block mr-1 h-4 w-4" />
                    A matriz não é quadrada. O determinante só pode ser calculado para matrizes quadradas.
                  </div>
                )}
              </div>
            )}
            
            <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
              <div className="flex items-start">
                <HiInformationCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    <span className="font-medium">Requisito para cálculo de determinante:</span> A matriz deve ser quadrada, 
                    ou seja, ter o mesmo número de linhas e colunas.
                  </p>
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                    O determinante é um valor escalar que pode ser calculado a partir dos elementos de uma matriz quadrada.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Exemplos
            </label>
            <div className="flex flex-wrap gap-2">
              {getDeterminantExamples().map((example, index) => (
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
        
        {state.error && (
          <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 rounded-md">
            {state.error}
          </div>
        )}
      </div>
      
      {state.result !== null && (
        <div className="space-y-6">
          <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-5">
            <h3 className="text-lg font-medium text-green-800 dark:text-green-300 mb-4">Resultado</h3>
            
            <div className="bg-white dark:bg-gray-800 p-4 rounded-md border border-gray-200 dark:border-gray-700">
              {renderDeterminantNotation()}
            </div>
            
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md border-l-2 border-blue-300 dark:border-blue-700">
              <div className="flex items-center">
                <HiInformationCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2 flex-shrink-0" />
                <p className="text-blue-700 dark:text-blue-300 font-medium">
                  {state.result === 0 
                    ? 'Como o determinante é zero, a matriz é singular (não inversível) e tem linhas ou colunas linearmente dependentes.'
                    : 'Como o determinante é diferente de zero, a matriz é não-singular (inversível) e tem linhas e colunas linearmente independentes.'}
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
                    
                    <p className="text-gray-700 dark:text-gray-300 mb-2">
                      O determinante é um valor escalar associado a uma matriz quadrada. Ele tem aplicações importantes em 
                      álgebra linear e geometria, incluindo a solução de sistemas de equações lineares, cálculo de volume, 
                      e verificação da invertibilidade de uma matriz.
                    </p>
                    
                    <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-md border-l-2 border-yellow-300 dark:border-yellow-600 mb-3">
                      <p className="text-sm text-yellow-800 dark:text-yellow-300">
                        <span className="font-semibold">Requisito importante:</span> Apenas matrizes quadradas (mesmo número de linhas e colunas) possuem determinante.
                      </p>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-700 p-3 rounded-md border border-gray-100 dark:border-gray-600 shadow-sm">
                      <h6 className="text-lg font-medium text-indigo-700 dark:text-indigo-300 mb-1">Fórmulas de cálculo</h6>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Para matriz 2×2:</span>
                      </p>
                      <div className="my-2 flex items-center justify-center text-sm text-gray-600 dark:text-gray-400">
                        det <span className="mx-1">
                          <div className="flex flex-col">
                            <div className="border-t border-b border-l border-gray-500 dark:border-gray-400 h-8 w-1"></div>
                          </div>
                        </span>
                        <div className="mx-1">
                          <div>a b</div>
                          <div>c d</div>
                        </div>
                        <span className="mx-1">
                          <div className="flex flex-col">
                            <div className="border-t border-b border-r border-gray-500 dark:border-gray-400 h-8 w-1"></div>
                          </div>
                        </span>
                        = ad - bc
                      </div>
                      
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
                        <span className="font-medium">Para matrizes maiores:</span> Usa-se o método de expansão por cofatores (Laplace).
                      </p>
                    </div>

                    <h6 className="text-base font-medium text-gray-800 dark:text-gray-100 mt-4 mb-2">Interpretação Geométrica</h6>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                      O determinante tem importantes interpretações geométricas:
                    </p>
                    <ul className="text-sm text-gray-700 dark:text-gray-300 list-disc list-inside space-y-1 ml-2">
                      <li>Para matriz 2×2: Área do paralelogramo definido pelos vetores linha/coluna</li>
                      <li>Para matriz 3×3: Volume do paralelepípedo definido pelos vetores linha/coluna</li>
                      <li>Em geral: O fator de escala na transformação linear associada à matriz</li>
                    </ul>

                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md border-l-2 border-blue-300 dark:border-blue-700 my-3">
                      <h6 className="text-blue-700 dark:text-blue-300 font-medium mb-1">Exemplo Visual</h6>
                      <p className="text-sm text-blue-800 dark:text-blue-200 mb-2">
                        Para a matriz 2×2:
                      </p>
                      <div className="flex justify-center mb-2">
                        <div className="text-center mx-2">
                          <div className="flex items-center justify-center">
                            <span className="mr-1">A =</span>
                            <div className="mx-1">
                              <div>[2 1]</div>
                              <div>[3 4]</div>
                            </div>
                          </div>
                          <p className="text-xs mt-1">det(A) = 2×4 - 1×3 = 5</p>
                        </div>
                      </div>
                      <p className="text-xs text-blue-700 dark:text-blue-300 text-center">
                        O determinante 5 representa a área do paralelogramo formado pelos vetores (2,1) e (3,4)
                      </p>
                    </div>

                    <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-md border-l-2 border-indigo-300 dark:border-indigo-700 my-3">
                      <h6 className="text-indigo-700 dark:text-indigo-300 font-medium mb-1">Aplicações Específicas</h6>
                      <ul className="text-sm text-gray-700 dark:text-gray-300 list-disc list-inside space-y-1">
                        <li><span className="font-medium">Regra de Cramer:</span> Para resolver sistemas de equações lineares</li>
                        <li><span className="font-medium">Invertibilidade:</span> Uma matriz é inversível se e somente se seu determinante for diferente de zero</li>
                        <li><span className="font-medium">Transformações lineares:</span> O determinante indica se uma transformação preserva, inverte ou colapsa o espaço</li>
                        <li><span className="font-medium">Área e volume:</span> Para calcular áreas de paralelogramos e volumes de paralelepípedos</li>
                        <li><span className="font-medium">Mudança de variáveis:</span> Em integrais múltiplas, o determinante Jacobiano é usado para mudanças de variáveis</li>
                        <li><span className="font-medium">Equação característica:</span> Para calcular autovalores de uma matriz na forma det(A - λI) = 0</li>
                        <li><span className="font-medium">Orientação:</span> O sinal do determinante indica a orientação do espaço transformado (positivo preserva, negativo inverte)</li>
                      </ul>
                    </div>
                    
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md border-l-2 border-blue-300 dark:border-blue-700 mb-3">
                      <h6 className="text-blue-700 dark:text-blue-300 font-medium mb-1">Aplicações Práticas</h6>
                      <ul className="text-sm text-gray-700 dark:text-gray-300 list-disc list-inside space-y-1">
                        <li><span className="font-medium">Sistemas de Equações Lineares:</span> Usado na regra de Cramer para resolver sistemas</li>
                        <li><span className="font-medium">Computação Gráfica:</span> Para calcular áreas e detectar colinearidade de pontos</li>
                        <li><span className="font-medium">Estatística:</span> Em análise de variância e correlação multivariada</li>
                        <li><span className="font-medium">Física:</span> Em mecânica quântica e teoria eletromagnética</li>
                        <li><span className="font-medium">Economia:</span> Em modelos econométricos e de equilíbrio</li>
                        <li><span className="font-medium">Machine Learning:</span> Para verificar singularidade em matrizes de covariância</li>
                        <li><span className="font-medium">Criptografia:</span> Em sistemas criptográficos baseados em matrizes</li>
                        <li><span className="font-medium">Robótica:</span> Para calcular transformações e detectar singularidades em manipuladores robóticos</li>
                        <li><span className="font-medium">Processamento de Imagens:</span> Para detecção de bordas e transformações morfológicas</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <h5 className="font-medium text-gray-800 dark:text-gray-100 mb-2 border-b border-gray-200 dark:border-gray-700 pb-1">Propriedades</h5>
                    
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-md border-l-2 border-green-300 dark:border-green-700 mb-3">
                      <h6 className="text-green-700 dark:text-green-300 font-medium mb-1">Propriedades do Determinante</h6>
                      <ul className="text-sm text-gray-700 dark:text-gray-300 list-disc list-inside mb-2 space-y-1">
                        <li><span className="font-medium">Transposição:</span> det(A) = det(Aᵀ)<br/>
                          <span className="text-xs ml-6">O determinante de uma matriz é igual ao determinante de sua transposta.</span>
                        </li>
                        <li><span className="font-medium">Multiplicação por escalar:</span> det(kA) = kⁿ·det(A)<br/>
                          <span className="text-xs ml-6">Para uma matriz n×n, multiplicar a matriz por um escalar k multiplica o determinante por kⁿ.</span>
                        </li>
                        <li><span className="font-medium">Determinante do produto:</span> det(AB) = det(A)·det(B)<br/>
                          <span className="text-xs ml-6">O determinante do produto de matrizes é o produto dos determinantes.</span>
                        </li>
                        <li><span className="font-medium">Determinante da inversa:</span> det(A⁻¹) = 1/det(A)<br/>
                          <span className="text-xs ml-6">Se A é inversível, o determinante de sua inversa é o recíproco do determinante de A.</span>
                        </li>
                        <li><span className="font-medium">Troca de linhas/colunas:</span> Trocar duas linhas ou duas colunas inverte o sinal do determinante.<br/>
                          <span className="text-xs ml-6">Se L_i ↔ L_j ou C_i ↔ C_j, então det(nova matriz) = -det(matriz original).</span>
                        </li>
                        <li><span className="font-medium">Combinação linear:</span> Se uma linha/coluna for combinação linear das outras, o determinante é zero.<br/>
                          <span className="text-xs ml-6">Isso explica por que matrizes com linhas/colunas linearmente dependentes têm determinante zero.</span>
                        </li>
                      </ul>
                    </div>

                    <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-md border-l-2 border-purple-300 dark:border-purple-700 mb-3">
                      <h6 className="text-purple-700 dark:text-purple-300 font-medium mb-1">Determinantes de Matrizes Especiais</h6>
                      <ul className="text-sm text-gray-700 dark:text-gray-300 list-disc list-inside space-y-1">
                        <li><span className="font-medium">Matriz triangular (superior/inferior):</span> O determinante é o produto dos elementos da diagonal principal</li>
                        <li><span className="font-medium">Matriz diagonal:</span> O determinante é o produto dos elementos da diagonal</li>
                        <li><span className="font-medium">Matriz identidade:</span> det(I) = 1</li>
                        <li><span className="font-medium">Matriz singular:</span> det(A) = 0 (matriz não-inversível)</li>
                        <li><span className="font-medium">Matriz ortogonal:</span> det(Q) = ±1</li>
                        <li><span className="font-medium">Matriz de rotação 2D:</span> det(R) = 1</li>
                        <li><span className="font-medium">Matriz de reflexão:</span> det(R) = -1</li>
                      </ul>
                    </div>

                    <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-md border-l-2 border-amber-300 dark:border-amber-700 mb-3">
                      <h6 className="text-amber-700 dark:text-amber-300 font-medium mb-1">Métodos de Cálculo</h6>
                      <div className="space-y-2">
                        <div>
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">1. Regra de Sarrus (apenas para matrizes 3×3)</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 ml-2">
                            Técnica mnemônica para calcular determinantes 3×3 sem usar expansão por cofatores.
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">2. Expansão por Cofatores (método de Laplace)</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 ml-2">
                            Método recursivo que expande o determinante ao longo de uma linha ou coluna.
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">3. Eliminação Gaussiana</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 ml-2">
                            Transformar a matriz em triangular superior e multiplicar os elementos da diagonal.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-md border-l-2 border-red-300 dark:border-red-700 mb-3">
                      <h6 className="text-red-700 dark:text-red-300 font-medium mb-1">Erros Comuns</h6>
                      <ul className="text-sm text-gray-700 dark:text-gray-300 list-disc list-inside space-y-1">
                        <li>Tentar calcular o determinante de uma matriz não-quadrada</li>
                        <li>Confundir a fórmula para determinantes 2×2 (é ad - bc, não ad + bc)</li>
                        <li>Ignorar o sinal ao calcular cofatores na expansão de Laplace</li>
                        <li>Esquecer de propagar o efeito de multiplicações ou trocas de linhas no valor final</li>
                        <li>Aplicar propriedades do traço ao determinante ou vice-versa</li>
                      </ul>
                    </div>
                    
                    <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-md border-l-2 border-yellow-300 dark:border-yellow-700 mb-3">
                      <h6 className="text-yellow-700 dark:text-yellow-300 font-medium mb-1">Importância na Álgebra Linear</h6>
                      <ul className="text-sm text-gray-700 dark:text-gray-300 list-disc list-inside space-y-1">
                        <li><span className="font-medium">Teorema de Cramer:</span> Usa determinantes para resolver sistemas de equações lineares</li>
                        <li><span className="font-medium">Adjunta e inversa:</span> A inversa de uma matriz pode ser calculada usando determinantes</li>
                        <li><span className="font-medium">Autovalores:</span> Determinantes são usados para encontrar autovalores através da equação característica</li>
                        <li><span className="font-medium">Transformações lineares:</span> O determinante indica a alteração de volume sob uma transformação linear</li>
                        <li><span className="font-medium">Dependência linear:</span> Vetores são linearmente dependentes se e somente se o determinante da matriz formada por eles é zero</li>
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

export default ResolvedorDeterminanteMatrizes; 