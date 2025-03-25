import React from 'react';
import { 
  HiCalculator, 
  HiInformationCircle
} from 'react-icons/hi';
import { useMatrizTransposeSolver, getTransposeExamples } from '../../hooks/matrizes/useMatrizTranspostaSolver';
import StepByStepExplanation from '../../components/StepByStepExplanation';
import ConceitoMatematico from '../../components/ConceitoMatematico';

const ResolvedorTransposeMatrizes: React.FC = () => {
  const { 
    state, 
    dispatch, 
    handleSolve, 
    applyExample
  } = useMatrizTransposeSolver();

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

  // Função para renderizar a notação de transposição com visualização das matrizes
  const renderTransposeNotation = () => {
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
              <p>Transposição</p>
              <p className="text-xs italic">A<sup>T</sup></p>
            </div>
            <span className="text-2xl font-bold text-gray-700 dark:text-gray-300">→</span>
          </div>
          
          <div className="text-center">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Matriz A<sup>T</sup></p>
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
          Transposição de Matrizes
        </h2>
      </div>

      <div className="resolver-container p-6 mb-8">
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          Esta calculadora permite realizar a transposição de uma matriz,
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
              placeholder="Ex: 1 2 3; 4 5 6"
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Insira os elementos separados por espaço e as linhas separadas por ponto e vírgula. 
              Exemplo: 1 2 3; 4 5 6 para uma matriz 2x3.
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
                    <span className="font-medium">Transposição de uma matriz:</span> A matriz transposta 
                    é obtida transformando as linhas da matriz original em colunas e vice-versa.
                  </p>
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                    Se A é uma matriz m×n, então A<sup>T</sup> será uma matriz n×m.
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
              {getTransposeExamples().map((example, index) => (
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
              {renderTransposeNotation()}
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
                      A transposição de uma matriz é uma operação que transforma as linhas da matriz original em colunas e as colunas em linhas.
                      É uma operação fundamental da álgebra linear com diversas aplicações em diferentes áreas da matemática e ciências aplicadas.
                    </p>
                    
                    <div className="bg-white dark:bg-gray-700 p-3 rounded-md border border-gray-100 dark:border-gray-600 shadow-sm">
                      <h6 className="text-lg font-medium text-indigo-700 dark:text-indigo-300 mb-1">Notação</h6>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Se A = [aᵢⱼ] é uma matriz m×n, então a transposta de A, denotada por Aᵀ (ou A' ou Aᵗʳ), é a matriz n×m definida por:
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 font-mono">
                        (Aᵀ)ᵢⱼ = aⱼᵢ
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Ou seja, o elemento na posição (i,j) da matriz transposta é igual ao elemento na posição (j,i) da matriz original.
                      </p>
                    </div>

                    <h6 className="text-base font-medium text-gray-800 dark:text-gray-100 mt-4 mb-2">Interpretação Visual</h6>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                      Para obter a transposta de uma matriz:
                    </p>
                    <ol className="text-sm text-gray-700 dark:text-gray-300 list-decimal list-inside space-y-1 ml-2">
                      <li>A primeira linha da matriz original se torna a primeira coluna da matriz transposta</li>
                      <li>A segunda linha da matriz original se torna a segunda coluna da matriz transposta</li>
                      <li>E assim por diante para todas as linhas da matriz original</li>
                    </ol>

                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md border-l-2 border-blue-300 dark:border-blue-700 my-3">
                      <h6 className="text-blue-700 dark:text-blue-300 font-medium mb-1">Exemplo Visual</h6>
                      <p className="text-sm text-blue-800 dark:text-blue-200 mb-2">
                        Para a matriz A = [1 2 3; 4 5 6]:
                      </p>
                      <div className="flex items-center justify-center text-blue-800 dark:text-blue-200 font-mono">
                        <div>
                          <div>[1 2 3]ᵀ</div>
                          <div>[4 5 6]</div>
                        </div>
                        <div className="mx-4">=</div>
                        <div>
                          <div>[1 4]</div>
                          <div>[2 5]</div>
                          <div>[3 6]</div>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-md border-l-2 border-indigo-300 dark:border-indigo-700 my-3">
                      <h6 className="text-indigo-700 dark:text-indigo-300 font-medium mb-1">Aplicações Específicas</h6>
                      <ul className="text-sm text-gray-700 dark:text-gray-300 list-disc list-inside space-y-1">
                        <li><span className="font-medium">Sistemas de equações lineares:</span> Na resolução de sistemas usando métodos como mínimos quadrados</li>
                        <li><span className="font-medium">Transformações lineares:</span> Para representar transformações adjuntas</li>
                        <li><span className="font-medium">Decomposição de matrizes:</span> Em métodos como SVD (Singular Value Decomposition) e decomposição QR</li>
                        <li><span className="font-medium">Formas quadráticas:</span> Para simplificar expressões da forma x^T A x</li>
                      </ul>
                    </div>
                    
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md border-l-2 border-blue-300 dark:border-blue-700 mb-3">
                      <h6 className="text-blue-700 dark:text-blue-300 font-medium mb-1">Aplicações Práticas</h6>
                      <ul className="text-sm text-gray-700 dark:text-gray-300 list-disc list-inside space-y-1">
                        <li><span className="font-medium">Processamento de Sinais:</span> Em operações como convolução e correlação</li>
                        <li><span className="font-medium">Estatística:</span> No cálculo de matrizes de covariância e correlação</li>
                        <li><span className="font-medium">Otimização:</span> Em problemas de programação linear e não-linear</li>
                        <li><span className="font-medium">Machine Learning:</span> No processamento de dados e redes neurais</li>
                        <li><span className="font-medium">Computação Gráfica:</span> Em transformações e projeções</li>
                        <li><span className="font-medium">Física Quântica:</span> Em operações com operadores hermitianos</li>
                      </ul>
                    </div>

                    <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-md border-l-2 border-purple-300 dark:border-purple-700 mb-3">
                      <h6 className="text-purple-700 dark:text-purple-300 font-medium mb-1">Transposição em Ciência de Dados</h6>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                        A transposição é fundamental no pré-processamento e análise de dados:
                      </p>
                      <ul className="text-sm text-gray-700 dark:text-gray-300 list-disc list-inside space-y-1">
                        <li><span className="font-medium">Transformação de formato:</span> Converter dados de formato "largo" para "longo" (e vice-versa)</li>
                        <li><span className="font-medium">PCA (Análise de Componentes Principais):</span> Na construção da matriz de covariância S = X^T X</li>
                        <li><span className="font-medium">Matriz termo-documento:</span> Na análise de texto e mineração de dados textuais</li>
                        <li><span className="font-medium">Técnicas de embeddings:</span> Na representação de palavras ou entidades como vetores</li>
                      </ul>
                    </div>
                    
                    <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-md border-l-2 border-yellow-300 dark:border-yellow-700 mb-3">
                      <h6 className="text-yellow-700 dark:text-yellow-300 font-medium mb-1">Transposição em Redes Neurais</h6>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                        Em redes neurais, a transposição desempenha papéis críticos:
                      </p>
                      <ul className="text-sm text-gray-700 dark:text-gray-300 list-disc list-inside space-y-1">
                        <li><span className="font-medium">Backpropagation:</span> Na propagação de gradientes, onde as matrizes de peso são transpostas</li>
                        <li><span className="font-medium">Redes Convolucionais (CNN):</span> Na operação de convolução transposta usada para upsampling</li>
                        <li><span className="font-medium">Autoencoders:</span> Onde arquiteturas simétricas frequentemente usam pesos compartilhados via transposição</li>
                        <li><span className="font-medium">Camadas totalmente conectadas:</span> Na organização eficiente de dados de entrada e saída</li>
                      </ul>
                    </div>

                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-md border-l-2 border-green-300 dark:border-green-700 mb-3">
                      <h6 className="text-green-700 dark:text-green-300 font-medium mb-1">Para matrizes complexas</h6>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                        Para matrizes complexas, a transposição conjugada (A*) substitui a transposta simples:
                      </p>
                      <ul className="text-sm text-gray-700 dark:text-gray-300 list-disc list-inside space-y-1">
                        <li><span className="font-medium">Matriz hermitiana:</span> A = A* (equivalente à matriz simétrica para números reais)</li>
                        <li><span className="font-medium">Matriz unitária:</span> AA* = A*A = I (equivalente à matriz ortogonal para números reais)</li>
                        <li><span className="font-medium">Métrica quântica:</span> Na formulação de produtos escalares em espaços de Hilbert</li>
                        <li><span className="font-medium">Transformada de Fourier:</span> Na representação de transformações no domínio da frequência</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <h5 className="font-medium text-gray-800 dark:text-gray-100 mb-2 border-b border-gray-200 dark:border-gray-700 pb-1">Propriedades</h5>
                    
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-md border-l-2 border-green-300 dark:border-green-700 mb-3">
                      <h6 className="text-green-700 dark:text-green-300 font-medium mb-1">Propriedades da Transposição</h6>
                      <ul className="text-sm text-gray-700 dark:text-gray-300 list-disc list-inside mb-2 space-y-1">
                        <li><span className="font-medium">Dupla transposição:</span> (Aᵀ)ᵀ = A<br/>
                          <span className="text-xs ml-6">Transpor duas vezes retorna à matriz original.</span>
                        </li>
                        <li><span className="font-medium">Linearidade:</span> (αA + βB)ᵀ = αAᵀ + βBᵀ<br/>
                          <span className="text-xs ml-6">A transposição distribui sobre combinações lineares de matrizes.</span>
                        </li>
                        <li><span className="font-medium">Multiplicação:</span> (AB)ᵀ = BᵀAᵀ<br/>
                          <span className="text-xs ml-6">A transposta de um produto é o produto das transpostas em ordem inversa.</span>
                        </li>
                        <li><span className="font-medium">Determinante:</span> det(Aᵀ) = det(A)<br/>
                          <span className="text-xs ml-6">O determinante de uma matriz é igual ao determinante de sua transposta.</span>
                        </li>
                        <li><span className="font-medium">Inversão:</span> (A⁻¹)ᵀ = (Aᵀ)⁻¹<br/>
                          <span className="text-xs ml-6">A transposta da inversa é igual à inversa da transposta.</span>
                        </li>
                        <li><span className="font-medium">Rank:</span> rank(A) = rank(Aᵀ)<br/>
                          <span className="text-xs ml-6">O posto de uma matriz é igual ao posto de sua transposta.</span>
                        </li>
                        <li><span className="font-medium">Traço:</span> tr(A) = tr(Aᵀ)<br/>
                          <span className="text-xs ml-6">O traço de uma matriz é igual ao traço de sua transposta.</span>
                        </li>
                      </ul>
                    </div>

                    <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-md border-l-2 border-purple-300 dark:border-purple-700 mb-3">
                      <h6 className="text-purple-700 dark:text-purple-300 font-medium mb-1">Tipos Especiais de Matrizes e Transposição</h6>
                      <ul className="text-sm text-gray-700 dark:text-gray-300 list-disc list-inside space-y-1">
                        <li><span className="font-medium">Matriz simétrica:</span> A = Aᵀ<br/>
                          <span className="text-xs ml-6">Uma matriz é simétrica se for igual à sua transposta.</span>
                        </li>
                        <li><span className="font-medium">Matriz anti-simétrica (ou skew-simétrica):</span> A = -Aᵀ<br/>
                          <span className="text-xs ml-6">Uma matriz é anti-simétrica se for igual ao negativo de sua transposta.</span>
                        </li>
                        <li><span className="font-medium">Matriz ortogonal:</span> AAᵀ = AᵀA = I<br/>
                          <span className="text-xs ml-6">Uma matriz é ortogonal se sua transposta for igual à sua inversa.</span>
                        </li>
                        <li><span className="font-medium">Matriz hermitiana:</span> A = A*<br/>
                          <span className="text-xs ml-6">Para matrizes complexas, a transposta conjugada (A*) substitui a transposta simples.</span>
                        </li>
                        <li><span className="font-medium">Matriz normal:</span> AA* = A*A<br/>
                          <span className="text-xs ml-6">Uma matriz comuta com sua transposta conjugada.</span>
                        </li>
                      </ul>
                    </div>

                    <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-md border-l-2 border-amber-300 dark:border-amber-700 mb-3">
                      <h6 className="text-amber-700 dark:text-amber-300 font-medium mb-1">Casos Especiais e Exemplos</h6>
                      <div className="space-y-2">
                        <div>
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Exemplo 1: Matriz Diagonal</p>
                          <div className="text-xs text-gray-600 dark:text-gray-400 font-mono mt-1 ml-2">
                            <div>[a 0 0]ᵀ</div>
                            <div>[0 b 0]</div>
                            <div>[0 0 c]</div>
                            <div className="mt-1">=</div>
                            <div>[a 0 0]</div>
                            <div>[0 b 0]</div>
                            <div>[0 0 c]</div>
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 ml-2">
                            A transposta de uma matriz diagonal é a própria matriz diagonal.
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Exemplo 2: Matriz Triangular</p>
                          <div className="text-xs text-gray-600 dark:text-gray-400 font-mono mt-1 ml-2">
                            <div>[a 0 0]ᵀ</div>
                            <div>[b c 0]</div>
                            <div>[d e f]</div>
                            <div className="mt-1">=</div>
                            <div>[a b d]</div>
                            <div>[0 c e]</div>
                            <div>[0 0 f]</div>
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 ml-2">
                            A transposta de uma matriz triangular inferior é uma matriz triangular superior e vice-versa.
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Exemplo 3: Matriz Escalar</p>
                          <div className="text-xs text-gray-600 dark:text-gray-400 mt-1 ml-2">
                            <p>Para uma matriz escalar kI:</p>
                            <div className="mt-1">(kI)ᵀ = kIᵀ = kI</div>
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 ml-2">
                            A transposta de uma matriz escalar é a própria matriz escalar.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-md border-l-2 border-red-300 dark:border-red-700 mb-3">
                      <h6 className="text-red-700 dark:text-red-300 font-medium mb-1">Erros Comuns</h6>
                      <ul className="text-sm text-gray-700 dark:text-gray-300 list-disc list-inside space-y-1">
                        <li>Confundir a ordem dos fatores na transposição de um produto: (AB)ᵀ = BᵀAᵀ, não AᵀBᵀ</li>
                        <li>Assumir que qualquer matriz é simétrica (A = Aᵀ), quando esta é uma propriedade especial</li>
                        <li>Ignorar a necessidade de conjugação ao transpor matrizes complexas</li>
                        <li>Confundir a transposição com a inversão de matrizes</li>
                        <li>Esquecer que a transposta de uma matriz m×n é uma matriz n×m, alterando as dimensões</li>
                      </ul>
                    </div>

                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md border-l-2 border-blue-300 dark:border-blue-700 mb-3">
                      <h6 className="text-blue-700 dark:text-blue-300 font-medium mb-1">Algoritmos Eficientes</h6>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                        Técnicas para transposição eficiente de matrizes em computação:
                      </p>
                      <ul className="text-sm text-gray-700 dark:text-gray-300 list-disc list-inside space-y-1">
                        <li><span className="font-medium">Transposição in-place:</span> Para matrizes quadradas, economiza memória trocando apenas os elementos necessários</li>
                        <li><span className="font-medium">Algoritmos em blocos:</span> Melhora a localidade de cache em matrizes grandes</li>
                        <li><span className="font-medium">Paralelização:</span> Divide a matriz em sub-matrizes para processamento simultâneo</li>
                        <li><span className="font-medium">Representação CSR/CSC:</span> Para matrizes esparsas, alterna entre representação por linha e por coluna</li>
                      </ul>
                    </div>
                    
                    <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-md border-l-2 border-indigo-300 dark:border-indigo-700 mb-3">
                      <h6 className="text-indigo-700 dark:text-indigo-300 font-medium mb-1">Transposição e Decomposições Matriciais</h6>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                        A transposição tem papel fundamental em várias decomposições:
                      </p>
                      <ul className="text-sm text-gray-700 dark:text-gray-300 list-disc list-inside space-y-1">
                        <li><span className="font-medium">Decomposição QR:</span> Q é uma matriz ortogonal (QᵀQ = I) e R é triangular superior</li>
                        <li><span className="font-medium">Decomposição SVD (A = UΣVᵀ):</span> Onde V é a matriz de autovetores de AᵀA</li>
                        <li><span className="font-medium">Decomposição espectral:</span> Para matrizes simétricas A = QΛQᵀ</li>
                        <li><span className="font-medium">Método das potências:</span> Para encontrar autovalores usando multiplicações AᵀA</li>
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

export default ResolvedorTransposeMatrizes; 