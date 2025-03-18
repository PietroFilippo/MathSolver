import React from 'react';
import { HiCalculator, HiInformationCircle } from 'react-icons/hi';
import { roundToDecimals } from '../../utils/mathUtils';
import { getQuadraticExamples } from '../../utils/mathUtilsAlgebra';
import { useQuadraticSolver } from '../../hooks/algebra/useEquacaoQuadraticaSolver';
import StepByStepExplanation from '../../components/StepByStepExplanation';
import ConceitoMatematico from '../../components/ConceitoMatematico';

const ResolvedorEquacaoQuadratica: React.FC = () => {
    const { state, dispatch, handleSolve, applyExample } = useQuadraticSolver();
            
    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center mb-6">
                <HiCalculator className="h-6 w-6 text-indigo-600 dark:text-indigo-400 mr-2" />
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Equações Quadráticas</h2>
            </div>
            
            <div className="resolver-container p-6 mb-8">
                <p className="text-gray-700 dark:text-gray-300 mb-6">
                    Esta calculadora resolve equações quadráticas na forma ax² + bx + c = 0 usando a fórmula de Bhaskara.
                    Insira os coeficientes a, b e c para encontrar as soluções.
                </p>
                
                <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">Insira os coeficientes para: ax² + bx + c = 0</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                a (coeficiente de x²)
                            </label>
                            <input
                                type="number"
                                value={state.a}
                                onChange={(e) => dispatch({ type: 'SET_COEFFICIENT', field: 'a', value: e.target.value })}
                                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400"
                                placeholder="Digite o valor de a"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                b (coeficiente de x)
                            </label>
                            <input
                                type="number"
                                value={state.b}
                                onChange={(e) => dispatch({ type: 'SET_COEFFICIENT', field: 'b', value: e.target.value })}
                                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400"
                                placeholder="Digite o valor de b"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                c (termo constante)
                            </label>
                            <input
                                type="number"
                                value={state.c}
                                onChange={(e) => dispatch({ type: 'SET_COEFFICIENT', field: 'c', value: e.target.value })}
                                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400"
                                placeholder="Digite o valor de c"
                            />
                        </div>
                    </div>
                </div>
                
                {/* Exemplos de equações */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Exemplos
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {getQuadraticExamples().map((example, index) => (
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
                    className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-medium py-2 px-6 rounded-md transition-colors duration-300"
                >
                    Resolver Equação
                </button>
                
                {state.errorMessage && (
                    <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 rounded-md">
                        {state.errorMessage}
                    </div>
                )}
            </div>
            
            {state.solution && (
                <div className="space-y-6">
                    <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-5">
                        <h3 className="text-lg font-medium text-green-800 dark:text-green-300 mb-2">Resultado</h3>
                        <p className="text-xl text-gray-800 dark:text-gray-200">
                            Para a equação {state.a}x² + {state.b}x + {state.c} = 0
                        </p>
                        
                        {state.solutionType === 'real' && state.solution.x1 !== null && state.solution.x2 !== null && (
                            <div className="mt-2">
                                <p className="text-xl font-bold text-gray-800 dark:text-gray-200">x₁ = {roundToDecimals(state.solution.x1, 4)}</p>
                                <p className="text-xl font-bold text-gray-800 dark:text-gray-200">x₂ = {roundToDecimals(state.solution.x2, 4)}</p>
                            </div>
                        )}
                        
                        {state.solutionType === 'repeated' && state.solution.x1 !== null && (
                            <p className="text-xl font-bold mt-2 text-gray-800 dark:text-gray-200">
                                x = {roundToDecimals(state.solution.x1, 4)} (raiz repetida)
                            </p>
                        )}
                        
                        {state.solutionType === 'complex' && (
                            <div className="mt-2">
                                <p className="text-xl font-bold text-gray-800 dark:text-gray-200">A equação não tem soluções reais</p>
                                <p className="text-gray-700 dark:text-gray-300 mt-1">As soluções são complexas (veja a explicação abaixo)</p>
                            </div>
                        )}
                        
                        <button 
                            onClick={() => dispatch({ type: 'TOGGLE_EXPLANATION' })}
                            className="mt-4 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 text-sm font-medium flex items-center"
                        >
                            <HiInformationCircle className="h-5 w-5 mr-1" />
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
                            
                            <StepByStepExplanation steps={state.steps} stepType="linear" />
                            
                            <ConceitoMatematico
                                title="Conceito Matemático" 
                                isOpen={state.showConceitoMatematico} 
                                onToggle={() => dispatch({ type: 'TOGGLE_CONCEITO_MATEMATICO' })}
                            >
                                <div className="flex flex-col md:flex-row gap-4 mb-4">
                                    <div className="flex-1">
                                        <h5 className="font-medium text-gray-800 dark:text-gray-100 mb-2 border-b border-gray-200 dark:border-gray-700 pb-1">Definição</h5>
                                        <p className="text-gray-700 dark:text-gray-300 mb-2">
                                            Uma equação quadrática é uma equação de segundo grau na forma 
                                            ax² + bx + c = 0, onde a, b e c são constantes e a ≠ 0.
                                        </p>
                                        <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-md border-l-2 border-yellow-300 dark:border-yellow-600 mb-3">
                                            <p className="text-sm text-yellow-800 dark:text-yellow-300">
                                                <span className="font-semibold">Propriedade importante:</span> Uma equação quadrática pode ter até duas raízes reais distintas, uma raiz real repetida, ou duas raízes complexas conjugadas.
                                            </p>
                                        </div>
                                        
                                        <h5 className="font-medium text-gray-800 dark:text-gray-100 mb-2 mt-4 border-b border-gray-200 dark:border-gray-700 pb-1">Fórmula de Bhaskara</h5>
                                        <div className="bg-white dark:bg-gray-700 p-3 rounded-md border border-gray-100 dark:border-gray-600 shadow-sm">
                                            <div className="text-center">
                                                <p className="text-lg font-medium text-indigo-700 dark:text-indigo-300">x = (-b ± √(b² - 4ac)) / (2a)</p>
                                            </div>
                                            <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                                <p>Onde:</p>
                                                <ul className="list-disc pl-5 mt-1 space-y-1">
                                                    <li>a, b, c são os coeficientes da equação ax² + bx + c = 0</li>
                                                    <li>± indica as duas possíveis soluções</li>
                                                </ul>
                                            </div>
                                        </div>
                                        
                                        <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-md border-l-2 border-green-300 dark:border-green-700 mt-3 mb-3">
                                            <h6 className="text-green-700 dark:text-green-300 font-medium mb-1">Variações e Propriedades da Fórmula</h6>
                                            <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                                                Existem várias formas alternativas e propriedades úteis da fórmula quadrática:
                                            </p>
                                            <div className="space-y-3">
                                                <div className="bg-white dark:bg-gray-700 p-2 rounded-md border border-gray-100 dark:border-gray-600">
                                                    <h6 className="text-sm font-medium text-green-700 dark:text-green-300 mb-1">Fórmula de Viète</h6>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400">
                                                        Se x₁ e x₂ são as raízes da equação ax² + bx + c = 0, então:
                                                    </p>
                                                    <div className="grid grid-cols-2 gap-2 mt-1">
                                                        <div className="bg-gray-50 dark:bg-gray-800 p-1 rounded text-center">
                                                            <p className="text-xs text-gray-700 dark:text-gray-300">x₁ + x₂ = -b/a</p>
                                                        </div>
                                                        <div className="bg-gray-50 dark:bg-gray-800 p-1 rounded text-center">
                                                            <p className="text-xs text-gray-700 dark:text-gray-300">x₁ × x₂ = c/a</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <div className="bg-white dark:bg-gray-700 p-2 rounded-md border border-gray-100 dark:border-gray-600">
                                                    <h6 className="text-sm font-medium text-green-700 dark:text-green-300 mb-1">Forma Alternativa</h6>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                                                        Quando |b| é grande, podemos usar esta versão para evitar erros de arredondamento:
                                                    </p>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <div className="bg-gray-50 dark:bg-gray-800 p-1 rounded text-center">
                                                            <p className="text-xs text-gray-700 dark:text-gray-300">x₁ = (2c) / (-b - √(b² - 4ac))</p>
                                                        </div>
                                                        <div className="bg-gray-50 dark:bg-gray-800 p-1 rounded text-center">
                                                            <p className="text-xs text-gray-700 dark:text-gray-300">x₂ = (2c) / (-b + √(b² - 4ac))</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <div className="bg-white dark:bg-gray-700 p-2 rounded-md border border-gray-100 dark:border-gray-600">
                                                    <h6 className="text-sm font-medium text-green-700 dark:text-green-300 mb-1">Equações Quadráticas Especiais</h6>
                                                    <div className="grid grid-cols-2 gap-2 mt-1">
                                                        <div>
                                                            <p className="text-xs font-medium text-gray-700 dark:text-gray-300">Equação pura (b = 0):</p>
                                                            <p className="text-xs text-gray-600 dark:text-gray-400">ax² + c = 0</p>
                                                            <p className="text-xs text-gray-600 dark:text-gray-400">x = ±√(-c/a)</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-xs font-medium text-gray-700 dark:text-gray-300">Equação incompleta (c = 0):</p>
                                                            <p className="text-xs text-gray-600 dark:text-gray-400">ax² + bx = 0</p>
                                                            <p className="text-xs text-gray-600 dark:text-gray-400">x = 0 ou x = -b/a</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <div className="bg-white dark:bg-gray-700 p-2 rounded-md border border-gray-100 dark:border-gray-600">
                                                    <h6 className="text-sm font-medium text-green-700 dark:text-green-300 mb-1">Completar Quadrados</h6>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                                                        Método alternativo para resolver equações quadráticas reescrevendo-as na forma (x + p)² = q:
                                                    </p>
                                                    <div className="space-y-1 mt-1">
                                                        <p className="text-xs text-gray-700 dark:text-gray-300">1. Dividir todos os termos por a: x² + (b/a)x + (c/a) = 0</p>
                                                        <p className="text-xs text-gray-700 dark:text-gray-300">2. Reescrever como: x² + (b/a)x = -c/a</p>
                                                        <p className="text-xs text-gray-700 dark:text-gray-300">3. Adicionar (b/2a)² a ambos os lados: x² + (b/a)x + (b/2a)² = -c/a + (b/2a)²</p>
                                                        <p className="text-xs text-gray-700 dark:text-gray-300">4. Simplificar: (x + b/2a)² = (b² - 4ac)/4a²</p>
                                                        <p className="text-xs text-gray-700 dark:text-gray-300">5. Extrair raiz: x + b/2a = ±√(b² - 4ac)/2a</p>
                                                        <p className="text-xs text-gray-700 dark:text-gray-300">6. Isolar x: x = -b/2a ± √(b² - 4ac)/2a</p>
                                                    </div>
                                                </div>
                                                
                                                <div className="bg-white dark:bg-gray-700 p-2 rounded-md border border-gray-100 dark:border-gray-600">
                                                    <h6 className="text-sm font-medium text-green-700 dark:text-green-300 mb-1">Soma dos Quadrados das Raízes</h6>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                                                        Se x₁ e x₂ são as raízes da equação ax² + bx + c = 0, então:
                                                    </p>
                                                    <div className="bg-gray-50 dark:bg-gray-800 p-1 rounded text-center mt-1">
                                                        <p className="text-xs text-gray-700 dark:text-gray-300">x₁² + x₂² = (x₁ + x₂)² - 2(x₁ × x₂) = (-b/a)² - 2(c/a) = (b² - 2ac)/a²</p>
                                                    </div>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                                        Esta propriedade é útil em problemas que envolvem a soma dos quadrados sem precisar calcular as raízes individualmente.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <h5 className="font-medium text-gray-800 dark:text-gray-100 mb-2 border-b border-gray-200 dark:border-gray-700 pb-1">Discriminante (Δ)</h5>
                                        <div className="bg-white dark:bg-gray-700 p-3 rounded-md border border-gray-100 dark:border-gray-600 shadow-sm mb-3">
                                            <p className="text-center font-medium text-indigo-700 dark:text-indigo-300">Δ = b² - 4ac</p>
                                        </div>
                                        <p className="text-gray-700 dark:text-gray-300 mb-2">
                                            O discriminante determina a natureza das raízes:
                                        </p>
                                        <div className="space-y-2">
                                            <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded border border-green-100 dark:border-green-800 flex items-center">
                                                <div className="h-6 w-6 rounded-full bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-300 flex items-center justify-center text-xs mr-2 flex-shrink-0">Δ{'>'}0</div>
                                                <span className="text-sm text-gray-700 dark:text-gray-300">Duas raízes reais distintas</span>
                                            </div>
                                            <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded border border-yellow-100 dark:border-yellow-800 flex items-center">
                                                <div className="h-6 w-6 rounded-full bg-yellow-100 dark:bg-yellow-800 text-yellow-700 dark:text-yellow-300 flex items-center justify-center text-xs mr-2 flex-shrink-0">Δ=0</div>
                                                <span className="text-sm text-gray-700 dark:text-gray-300">Uma raiz real repetida</span>
                                            </div>
                                            <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded border border-indigo-100 dark:border-indigo-800 flex items-center">
                                                <div className="h-6 w-6 rounded-full bg-indigo-100 dark:bg-indigo-800 text-indigo-700 dark:text-indigo-300 flex items-center justify-center text-xs mr-2 flex-shrink-0">Δ{'<'}0</div>
                                                <span className="text-sm text-gray-700 dark:text-gray-300">Duas raízes complexas conjugadas</span>
                                            </div>
                                        </div>
                                        
                                        <h5 className="font-medium text-gray-800 dark:text-gray-100 mb-2 mt-4 border-b border-gray-200 dark:border-gray-700 pb-1">Interpretação Geométrica</h5>
                                        <p className="text-gray-700 dark:text-gray-300 mb-2">
                                            Uma equação quadrática na forma y = ax² + bx + c representa uma parábola no plano cartesiano:
                                        </p>
                                        <div className="space-y-2 mb-3">
                                            <div className="p-2 bg-white dark:bg-gray-700 rounded-md border border-gray-100 dark:border-gray-600 flex items-center">
                                                <div className="h-5 w-5 bg-green-100 dark:bg-green-800 rounded-full mr-2 flex-shrink-0"></div>
                                                <p className="text-sm text-gray-700 dark:text-gray-300">Se a {'>'} 0: Parábola com concavidade para cima (∪)</p>
                                            </div>
                                            <div className="p-2 bg-white dark:bg-gray-700 rounded-md border border-gray-100 dark:border-gray-600 flex items-center">
                                                <div className="h-5 w-5 bg-yellow-100 dark:bg-yellow-800 rounded-full mr-2 flex-shrink-0"></div>
                                                <p className="text-sm text-gray-700 dark:text-gray-300">Se a {'<'} 0: Parábola com concavidade para baixo (∩)</p>
                                            </div>
                                            <div className="p-2 bg-white dark:bg-gray-700 rounded-md border border-gray-100 dark:border-gray-600 flex items-center">
                                                <div className="h-5 w-5 bg-indigo-100 dark:bg-indigo-800 rounded-full mr-2 flex-shrink-0"></div>
                                                <p className="text-sm text-gray-700 dark:text-gray-300">Soluções da equação: Pontos onde a parábola cruza o eixo x</p>
                                            </div>
                                        </div>
                                        
                                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md border-l-2 border-blue-300 dark:border-blue-700 mb-3">
                                            <h6 className="text-blue-700 dark:text-blue-300 font-medium mb-1">Contexto Histórico</h6>
                                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                                A solução de equações quadráticas tem uma história rica que remonta a várias civilizações antigas. Os babilônios (cerca de 2000 a.C.) 
                                                já resolviam problemas equivalentes a equações quadráticas. O nome "Fórmula de Bhaskara" é uma homenagem ao matemático indiano 
                                                Bhaskara II (1114-1185), embora a fórmula tenha sido conhecida anteriormente por matemáticos árabes e persas. O matemático persa 
                                                Al-Khwarizmi (780-850 d.C.) publicou métodos sistemáticos para resolver equações quadráticas em seu trabalho sobre álgebra.
                                            </p>
                                        </div>
                                        
                                        <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-md">
                                            <h6 className="text-indigo-700 dark:text-indigo-300 font-medium mb-1">Aplicações Práticas</h6>
                                            <ul className="text-sm space-y-1 list-disc pl-4 text-gray-700 dark:text-gray-300">
                                                <li><span className="font-medium">Física:</span> Movimento de projéteis, queda livre e problemas de cinemática</li>
                                                <li><span className="font-medium">Engenharia:</span> Cálculo de áreas, otimização de estruturas e design</li>
                                                <li><span className="font-medium">Economia:</span> Modelagem de custos, receitas e lucros máximos</li>
                                                <li><span className="font-medium">Computação gráfica:</span> Cálculo de trajetórias, colisões e animações</li>
                                                <li><span className="font-medium">Arquitetura:</span> Desenho de arcos, pontes e estruturas parabólicas</li>
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

export default ResolvedorEquacaoQuadratica;