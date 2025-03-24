import React from 'react';
import { HiCalculator, HiInformationCircle } from 'react-icons/hi';
import { useCoordenadasGeometriaSolver, ProblemaCoordenadasGeometria } from '../../hooks/geometria/useCoordenadasGeometriaSolver';
import StepByStepExplanation from '../../components/StepByStepExplanation';
import ConceitoMatematico from '../../components/ConceitoMatematico';

const ResolvedorCoordenadasGeometria: React.FC = () => {
    const {
        state,
        dispatch,
        setPontoValue,
        handleSolve,
        applyExample,
        getFilteredExamples
    } = useCoordenadasGeometriaSolver();

    const renderPointInputs = (requiredPoints: ('p1' | 'p2' | 'p3' | 'p4')[]) => {
        const inputClassName = "w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200";
        
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {requiredPoints.map((ponto) => (
                    <div key={ponto} className="bg-gray-50 dark:bg-gray-700/50 rounded-md p-4">
                        <h3 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-3">
                            Ponto {ponto.toUpperCase()}
                        </h3>
                        <div className="grid grid-cols-3 gap-2">
                            <div>
                                <label htmlFor={`${ponto}-x`} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    x
                                </label>
                                <input
                                    type="number"
                                    id={`${ponto}-x`}
                                    value={state.pontos[ponto].x}
                                    onChange={(e) => setPontoValue(ponto, 'x', e.target.value)}
                                    className={inputClassName}
                                    placeholder="0"
                                    step="0.1"
                                />
                            </div>
                            <div>
                                <label htmlFor={`${ponto}-y`} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    y
                                </label>
                                <input
                                    type="number"
                                    id={`${ponto}-y`}
                                    value={state.pontos[ponto].y}
                                    onChange={(e) => setPontoValue(ponto, 'y', e.target.value)}
                                    className={inputClassName}
                                    placeholder="0"
                                    step="0.1"
                                />
                            </div>
                            <div>
                                <label htmlFor={`${ponto}-z`} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    z
                                </label>
                                <input
                                    type="number"
                                    id={`${ponto}-z`}
                                    value={state.pontos[ponto].z}
                                    onChange={(e) => setPontoValue(ponto, 'z', e.target.value)}
                                    className={inputClassName}
                                    placeholder="0"
                                    step="0.1"
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    const renderInputFields = () => {
        switch (state.problema) {
            case 'distanciaEntrePontos':
                return renderPointInputs(['p1', 'p2']);
            case 'verificarColinearidade':
                return renderPointInputs(['p1', 'p2', 'p3']);
            case 'verificarCoplanaridade':
                return renderPointInputs(['p1', 'p2', 'p3', 'p4']);
            case 'distanciaPontoAPlano':
                return (
                    <div>
                        <p className="mb-3 text-gray-700 dark:text-gray-300">
                            Definir um plano com três pontos e calcular a distância de um quarto ponto ao plano.
                        </p>
                        {renderPointInputs(['p1', 'p2', 'p3', 'p4'])}
                    </div>
                );
            case 'distanciaPontoAReta':
                return (
                    <div>
                        <p className="mb-3 text-gray-700 dark:text-gray-300">
                            Definir uma reta com dois pontos e calcular a distância de um terceiro ponto à reta.
                        </p>
                        {renderPointInputs(['p1', 'p2', 'p3'])}
                    </div>
                );
            default:
                return null;
        }
    };

    const getConceitoMatematico = () => {
        switch (state.problema) {
            case 'distanciaEntrePontos':
                return (
                    <>
                        <p>A distância entre dois pontos P₁(x₁, y₁, z₁) e P₂(x₂, y₂, z₂) no espaço tridimensional é dada pela fórmula:</p>
                        <p className="my-2">d(P₁, P₂) = √[(x₂-x₁)² + (y₂-y₁)² + (z₂-z₁)²]</p>
                        <p>Esta fórmula é uma extensão do teorema de Pitágoras para o espaço 3D.</p>
                    </>
                );
            case 'verificarColinearidade':
                return (
                    <>
                        <p>Três pontos P₁, P₂ e P₃ são colineares (estão na mesma reta) se o produto vetorial entre os vetores P₁P₂ e P₁P₃ for zero.</p>
                        <p className="my-2">Se |P₁P₂ × P₁P₃| = 0, então os pontos são colineares.</p>
                        <p>O produto vetorial de dois vetores paralelos (ou colineares) é sempre zero.</p>
                    </>
                );
            case 'verificarCoplanaridade':
                return (
                    <>
                        <p>Quatro pontos P₁, P₂, P₃ e P₄ são coplanares (estão no mesmo plano) se o produto misto (escalar triplo) dos vetores P₁P₂, P₁P₃ e P₁P₄ for zero.</p>
                        <p className="my-2">Se (P₁P₂ × P₁P₃) · P₁P₄ = 0, então os pontos são coplanares.</p>
                        <p>O produto misto é zero quando os três vetores são linearmente dependentes, ou seja, um deles pode ser escrito como combinação linear dos outros dois.</p>
                    </>
                );
            case 'distanciaPontoAPlano':
                return (
                    <>
                        <p>A distância de um ponto P(x₀, y₀, z₀) a um plano ax + by + cz + d = 0 é dada pela fórmula:</p>
                        <p className="my-2">d = |ax₀ + by₀ + cz₀ + d| / √(a² + b² + c²)</p>
                        <p>O vetor (a, b, c) é o vetor normal ao plano, e o denominador √(a² + b² + c²) é a magnitude desse vetor.</p>
                    </>
                );
            case 'distanciaPontoAReta':
                return (
                    <>
                        <p>A distância de um ponto P a uma reta definida por um ponto Q e um vetor direção v é dada pela fórmula:</p>
                        <p className="my-2">d = |QP × v| / |v|</p>
                        <p>Onde × representa o produto vetorial e |v| a magnitude do vetor v.</p>
                        <p>Esta fórmula calcula a componente do vetor QP que é perpendicular ao vetor direção da reta.</p>
                    </>
                );
            default:
                return null;
        }
    };

    const formatResult = () => {
        if (state.result === null) return null;
        
        switch (state.problema) {
            case 'distanciaEntrePontos':
            case 'distanciaPontoAPlano':
            case 'distanciaPontoAReta':
                return `${state.result}`;
            case 'verificarColinearidade':
                return state.result ? 'Sim, os pontos são colineares' : 'Não, os pontos não são colineares';
            case 'verificarCoplanaridade':
                return state.result ? 'Sim, os pontos são coplanares' : 'Não, os pontos não são coplanares';
            default:
                return `${state.result}`;
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center mb-6">
                <HiCalculator className="h-6 w-6 text-indigo-600 dark:text-indigo-400 mr-2" />
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Calculadora de Geometria de Coordenadas 3D</h2>
            </div>
            
            <div className="resolver-container p-6 mb-8">
                <p className="text-gray-700 dark:text-gray-300 mb-6">
                    Esta calculadora permite realizar cálculos de geometria analítica em três dimensões, como distância entre pontos, 
                    verificar colinearidade e coplanaridade, e calcular distâncias entre pontos, retas e planos.
                </p>

                <div className="mb-6">
                    <label htmlFor="problema" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Selecione o Tipo de Problema
                    </label>
                    <select
                        id="problema"
                        value={state.problema}
                        onChange={(e) => dispatch({ type: 'SET_PROBLEMA', value: e.target.value as ProblemaCoordenadasGeometria })}
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                    >
                        <option value="distanciaEntrePontos">Distância entre dois pontos</option>
                        <option value="verificarColinearidade">Verificar colinearidade de três pontos</option>
                        <option value="verificarCoplanaridade">Verificar coplanaridade de quatro pontos</option>
                        <option value="distanciaPontoAPlano">Distância de um ponto a um plano</option>
                        <option value="distanciaPontoAReta">Distância de um ponto a uma reta</option>
                    </select>
                </div>
                
                {/* Exemplos */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Exemplos
                    </label>
                    <div className="flex flex-wrap gap-2 mb-4">
                        {getFilteredExamples().map((exemplo, index) => (
                            <button
                                key={index}
                                onClick={() => applyExample(exemplo)}
                                className="px-3 py-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm rounded-full transition-colors"
                            >
                                {exemplo.description}
                            </button>
                        ))}
                    </div>
                </div>
                
                <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                        Insira os dados do problema
                    </h2>
                    
                    {renderInputFields()}
                    
                    <button
                        onClick={handleSolve}
                        className="mt-6 bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 text-white font-medium py-2 px-6 rounded-md transition-colors duration-300 flex items-center justify-center"
                    >
                        <HiCalculator className="mr-2 h-5 w-5" />
                        Calcular
                    </button>
                    
                    {state.errorMessage && (
                        <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 rounded-md">
                            {state.errorMessage}
                        </div>
                    )}
                </div>
            </div>
            
            {state.result !== null && (
                <div className="space-y-6">
                    <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-5">
                        <h3 className="text-lg font-medium text-green-800 dark:text-green-300 mb-2">Resultado</h3>
                        <p className="text-xl text-gray-800 dark:text-gray-200">
                            {typeof state.result === 'number' ? (
                                <>O resultado é: <span className="font-bold">{formatResult()}</span> {state.problema.includes('distancia') ? 'unidades' : ''}</>
                            ) : (
                                <span className="font-bold">{formatResult()}</span>
                            )}
                        </p>
                        
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
                            
                            <StepByStepExplanation steps={state.steps} stepType="geometric" />
                            
                            <ConceitoMatematico
                                title="Conceito Matemático"
                                isOpen={state.showConceitoMatematico}
                                onToggle={() => dispatch({ type: 'TOGGLE_CONCEITO_MATEMATICO' })}
                            >
                                <div className="flex flex-col md:flex-row gap-4 mb-4">
                                    <div className="flex-1">
                                        <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2 border-b border-gray-200 dark:border-gray-700 pb-1">Geometria de Coordenadas 3D</h5>
                                        <div className="space-y-3">
                                            <p className="text-gray-700 dark:text-gray-300">
                                                A geometria de coordenadas tridimensionais utiliza um sistema de coordenadas cartesianas para representar pontos, retas e planos no espaço.
                                                Cada ponto é representado por uma tripla ordenada (x, y, z).
                                            </p>
                                            <div className="bg-white dark:bg-gray-700 p-3 rounded-md border border-gray-100 dark:border-gray-600 shadow-sm">
                                                <h6 className="text-indigo-700 dark:text-indigo-300 font-medium mb-2">Fórmulas Importantes</h6>
                                                <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                                                    {getConceitoMatematico()}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="max-w-3xl mx-auto mt-6 mb-4">
                                    <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-md">
                                        <h6 className="text-indigo-700 dark:text-indigo-300 font-medium mb-2 text-center">Princípios Fundamentais</h6>
                                        <ul className="text-sm space-y-1 list-disc pl-4 text-gray-700 dark:text-gray-300">
                                            <li>O cálculo de distâncias e verificações de colinearidade/coplanaridade são fundamentais na geometria analítica 3D</li>
                                            <li>Retas no espaço podem ser representadas por um ponto e um vetor direção</li>
                                            <li>Planos no espaço podem ser definidos por três pontos não colineares</li>
                                            <li>Vetores são ferramentas essenciais para trabalhar com geometria 3D</li>
                                        </ul>
                                    </div>
                                </div>
                                
                                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-white dark:bg-gray-700 p-3 rounded-md border border-gray-100 dark:border-gray-600 shadow-sm">
                                        <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Aplicações Práticas</h5>
                                        <div className="space-y-2">
                                            <p className="text-sm text-gray-700 dark:text-gray-300">A geometria 3D é fundamental em diversos campos:</p>
                                            <ul className="text-sm space-y-1 list-disc pl-4 text-gray-700 dark:text-gray-300">
                                                <li><span className="font-medium">Computação Gráfica:</span> Modelagem 3D, jogos, realidade virtual</li>
                                                <li><span className="font-medium">Arquitetura:</span> Desenho e planejamento de estruturas</li>
                                                <li><span className="font-medium">Engenharia:</span> Projetos de construções e máquinas</li>
                                                <li><span className="font-medium">Física:</span> Mecânica e eletromagnetismo</li>
                                                <li><span className="font-medium">Robótica:</span> Movimento e posicionamento de robôs</li>
                                                <li><span className="font-medium">Geometria Molecular:</span> Estudo da estrutura de moléculas</li>
                                                <li><span className="font-medium">Navegação GPS:</span> Cálculo de rotas e posicionamento via satélite</li>
                                                <li><span className="font-medium">Realidade Aumentada:</span> Posicionamento de objetos virtuais no mundo real</li>
                                                <li><span className="font-medium">Impressão 3D:</span> Projeção e validação de modelos para fabricação</li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-md border-l-4 border-yellow-400 dark:border-yellow-600">
                                        <h5 className="font-medium text-yellow-800 dark:text-yellow-300 mb-2">Dicas de Resolução</h5>
                                        <ul className="text-sm space-y-1 list-disc pl-4 text-gray-700 dark:text-gray-300">
                                            <li>Desenhe os pontos e vetores em um sistema de coordenadas para visualização</li>
                                            <li>Verifique se as coordenadas inseridas estão na ordem correta</li>
                                            <li>Ao calcular distâncias, mantenha a forma exata do resultado quando necessário</li>
                                            <li>Para verificar colinearidade, lembre-se que três pontos são colineares se o vetor formado por dois deles for paralelo ao formado pelos outros dois</li>
                                            <li>Na verificação de coplanaridade, considere que quatro pontos são coplanares se o produto misto dos vetores formados for zero</li>
                                            <li>Utilize propriedades do produto vetorial e escalar para simplificar cálculos</li>
                                        </ul>
                                    </div>
                                </div>
                                
                                <div className="mt-4 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-md border border-indigo-100 dark:border-indigo-800">
                                    <h5 className="font-medium text-indigo-800 dark:text-indigo-300 mb-1 flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                        </svg>
                                        Relação com Outros Conceitos
                                    </h5>
                                    <p className="text-sm text-indigo-700 dark:text-indigo-300">
                                        A geometria de coordenadas 3D está relacionada com diversos conceitos matemáticos, incluindo 
                                        álgebra linear, cálculo vetorial, trigonometria e geometria diferencial. Ela serve como base 
                                        para o desenvolvimento de cálculos mais avançados, como integrais múltiplas, cálculo vetorial em 
                                        campos conservativos e não-conservativos, e o estudo de superfícies parametrizadas. Na física, 
                                        é utilizada para descrever movimentos, forças e campos no espaço tridimensional.
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

export default ResolvedorCoordenadasGeometria; 