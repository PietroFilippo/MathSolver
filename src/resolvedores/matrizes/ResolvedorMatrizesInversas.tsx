import React from 'react';
import { 
  HiCalculator, 
  HiInformationCircle
} from 'react-icons/hi';
import { useMatrizInverseSolver, getInverseMatrixExamples } from '../../hooks/matrizes/useMatrizInversaSolver';
import StepByStepExplanation from '../../components/StepByStepExplanation';
import ConceitoMatematico from '../../components/ConceitoMatematico';

const ResolvedorInverseMatrizes: React.FC = () => {
  const { 
    state, 
    dispatch, 
    handleSolve, 
    applyExample
  } = useMatrizInverseSolver();

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
                  {Number.isInteger(value) ? value : value.toFixed(3)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  // Função para renderizar a notação de matriz inversa com visualização das matrizes
  const renderInverseNotation = () => {
    if (!state.parsedMatrix || !state.result) return null;
    
    return (
      <div className="flex flex-col items-center justify-center my-4 space-y-4">
        <div className="flex items-center space-x-6 flex-wrap justify-center">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Matriz A</p>
            {renderMatrix(state.parsedMatrix)}
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {state.parsedMatrix.length}×{state.parsedMatrix[0]?.length}
            </p>
          </div>
          
          <div className="flex items-center justify-center">
            <span className="text-2xl font-bold text-gray-700 dark:text-gray-300">→</span>
            <div className="mx-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <p>Inversa</p>
              <p className="text-xs italic">A<sup>-1</sup></p>
            </div>
            <span className="text-2xl font-bold text-gray-700 dark:text-gray-300">→</span>
          </div>
          
          <div className="text-center">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Matriz A<sup>-1</sup></p>
            {renderMatrix(state.result)}
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {state.result.length}×{state.result[0]?.length}
            </p>
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
          Matriz Inversa
        </h2>
      </div>

      <div className="resolver-container p-6 mb-8">
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          Esta calculadora permite calcular a matriz inversa de uma matriz quadrada,
          mostrando o passo a passo do processo e o resultado final.
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
              </div>
            )}
            
            <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
              <div className="flex items-start">
                <HiInformationCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    <span className="font-medium">Matriz inversa A<sup>-1</sup>:</span> Uma matriz quadrada A tem inversa 
                    A<sup>-1</sup> se e somente se A×A<sup>-1</sup> = A<sup>-1</sup>×A = I, onde I é a matriz identidade.
                  </p>
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                    Para existir a inversa, o determinante da matriz deve ser diferente de zero.
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
              {getInverseMatrixExamples().map((example, index) => (
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
      
      {state.result && (
        <div className="space-y-6">
          <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-5">
            <h3 className="text-lg font-medium text-green-800 dark:text-green-300 mb-4">Resultado</h3>
            
            <div className="bg-white dark:bg-gray-800 p-4 rounded-md border border-gray-200 dark:border-gray-700">
              {renderInverseNotation()}
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
                      A inversa de uma matriz quadrada A é uma matriz A<sup>-1</sup> tal que A×A<sup>-1</sup> = A<sup>-1</sup>×A = I, 
                      onde I é a matriz identidade. Nem toda matriz quadrada possui inversa.
                    </p>
                    
                    <div className="bg-white dark:bg-gray-700 p-3 rounded-md border border-gray-100 dark:border-gray-600 shadow-sm">
                      <h6 className="text-lg font-medium text-indigo-700 dark:text-indigo-300 mb-1">Condição para Existência</h6>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Uma matriz quadrada A possui inversa se e somente se seu determinante é diferente de zero:
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 font-mono">
                        A<sup>-1</sup> existe ⟺ det(A) ≠ 0
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Uma matriz com determinante diferente de zero é chamada de "não-singular" ou "inversível".
                      </p>
                    </div>

                    <h6 className="text-base font-medium text-gray-800 dark:text-gray-100 mt-4 mb-2">Cálculo da Matriz Inversa</h6>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                      Para uma matriz A, a inversa A<sup>-1</sup> pode ser calculada usando a fórmula:
                    </p>
                    <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-md text-center">
                      <p className="text-sm font-mono text-gray-700 dark:text-gray-300">
                        A<sup>-1</sup> = (1/det(A)) × adj(A)
                      </p>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
                      Onde adj(A) é a matriz adjunta de A, calculada como a transposta da matriz de cofatores.
                    </p>

                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md border-l-2 border-blue-300 dark:border-blue-700 my-3">
                      <h6 className="text-blue-700 dark:text-blue-300 font-medium mb-1">Passos para Calcular a Inversa</h6>
                      <ol className="text-sm text-gray-700 dark:text-gray-300 list-decimal list-inside space-y-1">
                        <li>Calcular o determinante da matriz A</li>
                        <li>Verificar se det(A) ≠ 0 (caso contrário, não existe inversa)</li>
                        <li>Calcular a matriz de cofatores de A</li>
                        <li>Calcular a matriz adjunta (transposta da matriz de cofatores)</li>
                        <li>Multiplicar a adjunta por 1/det(A)</li>
                      </ol>
                    </div>

                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md border-l-2 border-blue-300 dark:border-blue-700 my-3">
                      <h6 className="text-blue-700 dark:text-blue-300 font-medium mb-1">Exemplo Visual</h6>
                      <p className="text-sm text-blue-800 dark:text-blue-200 mb-2">
                        Para a matriz A = [1 2; 3 4]:
                      </p>
                      <p className="text-sm text-blue-800 dark:text-blue-200">
                        1. Determinante = 1×4 - 2×3 = 4 - 6 = -2
                      </p>
                      <p className="text-sm text-blue-800 dark:text-blue-200">
                        2. Matriz de cofatores = [4 -3; -2 1]
                      </p>
                      <p className="text-sm text-blue-800 dark:text-blue-200">
                        3. Matriz adjunta = [4 -2; -3 1]
                      </p>
                      <p className="text-sm text-blue-800 dark:text-blue-200">
                        4. A<sup>-1</sup> = (-1/2) × [4 -2; -3 1] = [-2 1; 1.5 -0.5]
                      </p>
                    </div>

                    <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-md border-l-2 border-indigo-300 dark:border-indigo-700 my-3">
                      <h6 className="text-indigo-700 dark:text-indigo-300 font-medium mb-1">Aplicações Específicas</h6>
                      <ul className="text-sm text-gray-700 dark:text-gray-300 list-disc list-inside space-y-1">
                        <li><span className="font-medium">Resolução de sistemas lineares:</span> Para sistemas na forma Ax = b, podemos encontrar x = A<sup>-1</sup>b</li>
                        <li><span className="font-medium">Transformações lineares:</span> Para encontrar a transformação inversa</li>
                        <li><span className="font-medium">Cálculo de matrizes de mudança de base:</span> Em álgebra linear</li>
                        <li><span className="font-medium">Análise de circuitos elétricos:</span> No método dos nós e das malhas</li>
                        <li><span className="font-medium">Ajuste de curvas e regressão:</span> Na estimação de parâmetros em modelos de regressão linear múltipla</li>
                        <li><span className="font-medium">Teoria de controle:</span> No cálculo de ganhos de controladores e estabilidade de sistemas</li>
                      </ul>
                    </div>
                    
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md border-l-2 border-blue-300 dark:border-blue-700 mb-3">
                      <h6 className="text-blue-700 dark:text-blue-300 font-medium mb-1">Aplicações Práticas</h6>
                      <ul className="text-sm text-gray-700 dark:text-gray-300 list-disc list-inside space-y-1">
                        <li><span className="font-medium">Econometria:</span> Em regressão linear multivariada e estimação de parâmetros</li>
                        <li><span className="font-medium">Computação Gráfica:</span> Em transformações geométricas e projeções</li>
                        <li><span className="font-medium">Robótica:</span> Na cinemática direta e inversa de manipuladores</li>
                        <li><span className="font-medium">Criptografia:</span> Em sistemas criptográficos baseados em matrizes</li>
                        <li><span className="font-medium">Problemas de Otimização:</span> No método dos multiplicadores de Lagrange</li>
                        <li><span className="font-medium">Análise Estatística:</span> Em matrizes de covariância e correlação</li>
                      </ul>
                    </div>

                    <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-md border-l-2 border-purple-300 dark:border-purple-700 mb-3">
                      <h6 className="text-purple-700 dark:text-purple-300 font-medium mb-1">Métodos Numéricos para Cálculo da Inversa</h6>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                        Para matrizes grandes, outros métodos mais eficientes são utilizados:
                      </p>
                      <ul className="text-sm text-gray-700 dark:text-gray-300 list-disc list-inside space-y-1">
                        <li><span className="font-medium">Eliminação de Gauss-Jordan:</span> Transformando [A|I] em [I|A<sup>-1</sup>]</li>
                        <li><span className="font-medium">Fatoração LU:</span> Decompondo A = LU e resolvendo sistemas para cada coluna</li>
                        <li><span className="font-medium">Decomposição QR:</span> Para matrizes bem condicionadas</li>
                        <li><span className="font-medium">Métodos iterativos:</span> Como Newton-Raphson para matrizes muito grandes</li>
                        <li><span className="font-medium">Fatoração de Cholesky:</span> Para matrizes simétricas positivas definidas, mais eficiente que LU</li>
                        <li><span className="font-medium">Decomposição em Valores Singulares (SVD):</span> Para calcular pseudo-inversas de matrizes singulares ou retangulares</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <h5 className="font-medium text-gray-800 dark:text-gray-100 mb-2 border-b border-gray-200 dark:border-gray-700 pb-1">Propriedades</h5>
                    
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-md border-l-2 border-green-300 dark:border-green-700 mb-3">
                      <h6 className="text-green-700 dark:text-green-300 font-medium mb-1">Propriedades da Matriz Inversa</h6>
                      <ul className="text-sm text-gray-700 dark:text-gray-300 list-disc list-inside mb-2 space-y-1">
                        <li><span className="font-medium">Unicidade:</span> A inversa de uma matriz, quando existe, é única</li>
                        <li><span className="font-medium">Inversa da inversa:</span> (A<sup>-1</sup>)<sup>-1</sup> = A<br/>
                          <span className="text-xs ml-6">A inversa da inversa é a matriz original.</span>
                        </li>
                        <li><span className="font-medium">Determinante da inversa:</span> det(A<sup>-1</sup>) = 1/det(A)<br/>
                          <span className="text-xs ml-6">O determinante da inversa é o recíproco do determinante da matriz original.</span>
                        </li>
                        <li><span className="font-medium">Inversa do produto:</span> (AB)<sup>-1</sup> = B<sup>-1</sup>A<sup>-1</sup><br/>
                          <span className="text-xs ml-6">A inversa do produto é o produto das inversas em ordem inversa.</span>
                        </li>
                        <li><span className="font-medium">Inversa da transposta:</span> (A<sup>T</sup>)<sup>-1</sup> = (A<sup>-1</sup>)<sup>T</sup><br/>
                          <span className="text-xs ml-6">A inversa da transposta é igual à transposta da inversa.</span>
                        </li>
                        <li><span className="font-medium">Inversa do escalar:</span> (kA)<sup>-1</sup> = (1/k)A<sup>-1</sup>, k ≠ 0<br/>
                          <span className="text-xs ml-6">A inversa de uma matriz multiplicada por um escalar é a inversa multiplicada pelo recíproco do escalar.</span>
                        </li>
                      </ul>
                    </div>

                    <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-md border-l-2 border-purple-300 dark:border-purple-700 mb-3">
                      <h6 className="text-purple-700 dark:text-purple-300 font-medium mb-1">Tipos Especiais de Matrizes e suas Inversas</h6>
                      <ul className="text-sm text-gray-700 dark:text-gray-300 list-disc list-inside space-y-1">
                        <li><span className="font-medium">Matriz identidade:</span> I<sup>-1</sup> = I<br/>
                          <span className="text-xs ml-6">A inversa da matriz identidade é ela mesma.</span>
                        </li>
                        <li><span className="font-medium">Matriz diagonal:</span> Se A = diag(a₁, a₂, ..., aₙ), então A<sup>-1</sup> = diag(1/a₁, 1/a₂, ..., 1/aₙ), desde que aᵢ ≠ 0 para todo i<br/>
                          <span className="text-xs ml-6">A inversa de uma matriz diagonal é a matriz diagonal dos recíprocos.</span>
                        </li>
                        <li><span className="font-medium">Matriz triangular:</span> A inversa de uma matriz triangular é triangular do mesmo tipo<br/>
                          <span className="text-xs ml-6">Se A é triangular superior, A<sup>-1</sup> também é triangular superior.</span>
                        </li>
                        <li><span className="font-medium">Matriz ortogonal:</span> Se A é ortogonal (AA<sup>T</sup> = I), então A<sup>-1</sup> = A<sup>T</sup><br/>
                          <span className="text-xs ml-6">A inversa de uma matriz ortogonal é sua transposta.</span>
                        </li>
                        <li><span className="font-medium">Matriz simétrica positiva definida:</span> Possui inversa e a inversa também é simétrica positiva definida</li>
                      </ul>
                    </div>

                    <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-md border-l-2 border-amber-300 dark:border-amber-700 mb-3">
                      <h6 className="text-amber-700 dark:text-amber-300 font-medium mb-1">Casos Especiais e Exemplos</h6>
                      <div className="space-y-2">
                        <div>
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Exemplo 1: Matriz 2×2</p>
                          <div className="text-xs text-gray-600 dark:text-gray-400 font-mono mt-1 ml-2">
                            <div>A = [a b]</div>
                            <div>    [c d]</div>
                            <div className="mt-1">det(A) = ad - bc</div>
                            <div className="mt-1">A<sup>-1</sup> = (1/det(A)) × [d -b]</div>
                            <div>                         [-c a]</div>
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 ml-2">
                            Fórmula fechada para inversa de matriz 2×2.
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Exemplo 2: Matriz Diagonal</p>
                          <div className="text-xs text-gray-600 dark:text-gray-400 font-mono mt-1 ml-2">
                            <div>A = [a 0 0]</div>
                            <div>    [0 b 0]</div>
                            <div>    [0 0 c]</div>
                            <div className="mt-1">A<sup>-1</sup> = [1/a 0   0  ]</div>
                            <div>            [0   1/b 0  ]</div>
                            <div>            [0   0   1/c]</div>
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 ml-2">
                            A inversa de uma matriz diagonal é a diagonal dos recíprocos.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-md border-l-2 border-red-300 dark:border-red-700 mb-3">
                      <h6 className="text-red-700 dark:text-red-300 font-medium mb-1">Erros Comuns</h6>
                      <ul className="text-sm text-gray-700 dark:text-gray-300 list-disc list-inside space-y-1">
                        <li>Tentar calcular a inversa de uma matriz não-quadrada</li>
                        <li>Calcular a inversa de uma matriz com determinante zero</li>
                        <li>Inverter a ordem ao calcular a inversa do produto: (AB)<sup>-1</sup> ≠ A<sup>-1</sup>B<sup>-1</sup></li>
                        <li>Confundir a inversa com a transposta (exceto para matrizes ortogonais)</li>
                        <li>Ignorar problemas de instabilidade numérica ao calcular a inversa de matrizes mal-condicionadas</li>
                      </ul>
                    </div>

                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md border-l-2 border-blue-300 dark:border-blue-700 mb-3">
                      <h6 className="text-blue-700 dark:text-blue-300 font-medium mb-1">Condicionamento de Matrizes</h6>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                        O número de condição de uma matriz mede a sensibilidade da solução de sistemas lineares:
                      </p>
                      <ul className="text-sm text-gray-700 dark:text-gray-300 list-disc list-inside space-y-1">
                        <li><span className="font-medium">Número de condição:</span> κ(A) = ||A|| · ||A<sup>-1</sup>||</li>
                        <li><span className="font-medium">Matriz bem-condicionada:</span> κ(A) próximo de 1</li>
                        <li><span className="font-medium">Matriz mal-condicionada:</span> κ(A) muito grande</li>
                        <li><span className="font-medium">Consequência:</span> Pequenas perturbações nos dados podem causar grandes variações na solução</li>
                      </ul>
                    </div>
                    
                    <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-md border-l-2 border-indigo-300 dark:border-indigo-700 mb-3">
                      <h6 className="text-indigo-700 dark:text-indigo-300 font-medium mb-1">Aplicações em Sistemas Lineares</h6>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                        O uso da matriz inversa na resolução de sistemas lineares:
                      </p>
                      <div className="text-sm text-gray-700 dark:text-gray-300">
                        <p>Para um sistema Ax = b:</p>
                        <ul className="list-disc list-inside space-y-1 mt-1">
                          <li><span className="font-medium">Solução:</span> x = A<sup>-1</sup>b</li>
                          <li><span className="font-medium">Entretanto:</span> Na prática, raramente se calcula explicitamente A<sup>-1</sup></li>
                          <li><span className="font-medium">Alternativas mais eficientes:</span> Eliminação Gaussiana, Decomposição LU, etc.</li>
                          <li><span className="font-medium">Motivo:</span> Calcular a inversa tem complexidade O(n³), e resolução direta de sistemas pode ser mais eficiente</li>
                        </ul>
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

export default ResolvedorInverseMatrizes; 