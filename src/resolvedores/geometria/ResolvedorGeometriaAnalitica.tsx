import React from 'react';
import { HiCalculator, HiInformationCircle } from 'react-icons/hi';
import { useGeometriaAnaliticaSolver, ProblemaGeometriaAnalitica } from '../../hooks/geometria/useGeometriaAnaliticaSolver';
import StepByStepExplanation from '../../components/StepByStepExplanation';
import ConceitoMatematico from '../../components/ConceitoMatematico';

const ResolvedorGeometriaAnalitica: React.FC = () => {
    const {
        state,
        dispatch,
        setPontoValue,
        handleSolve,
        applyExample,
        getFilteredExamples
    } = useGeometriaAnaliticaSolver();

    const renderPointInputs = (requiredPoints: ('p1' | 'p2' | 'p3' | 'p4' | 'p5' | 'p6')[]) => {
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
            case 'distanciaEntrePontoEReta':
                return (
                    <div>
                        <p className="mb-3 text-gray-700 dark:text-gray-300">
                            Calcular a distância entre um ponto e uma reta no espaço. A reta é definida pelos pontos P₁ e P₂, e queremos a distância do ponto P₃ à reta.
                        </p>
                        {renderPointInputs(['p1', 'p2', 'p3'])}
                    </div>
                );
            case 'distanciaEntrePontoEPlano':
                return (
                    <div>
                        <p className="mb-3 text-gray-700 dark:text-gray-300">
                            Calcular a distância entre um ponto e um plano. O plano é definido pelos pontos P₁, P₂ e P₃, e queremos a distância do ponto P₄ ao plano.
                        </p>
                        {renderPointInputs(['p1', 'p2', 'p3', 'p4'])}
                    </div>
                );
            case 'distanciaEntreRetas':
                return (
                    <div>
                        <p className="mb-3 text-gray-700 dark:text-gray-300">
                            Calcular a distância entre duas retas no espaço. A primeira reta é definida pelos pontos P₁ e P₂, e a segunda reta pelos pontos P₃ e P₄.
                        </p>
                        {renderPointInputs(['p1', 'p2', 'p3', 'p4'])}
                    </div>
                );
            case 'anguloEntreRetas':
                return (
                    <div>
                        <p className="mb-3 text-gray-700 dark:text-gray-300">
                            Calcular o ângulo entre duas retas no espaço. A primeira reta é definida pelos pontos P₁ e P₂, e a segunda reta pelos pontos P₃ e P₄.
                        </p>
                        {renderPointInputs(['p1', 'p2', 'p3', 'p4'])}
                    </div>
                );
            case 'anguloEntreRetaEPlano':
                return (
                    <div>
                        <p className="mb-3 text-gray-700 dark:text-gray-300">
                            Calcular o ângulo entre uma reta e um plano. A reta é definida pelos pontos P₁ e P₂, e o plano pelos pontos P₃, P₄ e P₅.
                        </p>
                        {renderPointInputs(['p1', 'p2', 'p3', 'p4', 'p5'])}
                    </div>
                );
            case 'anguloEntrePlanos':
                return (
                    <div>
                        <p className="mb-3 text-gray-700 dark:text-gray-300">
                            Calcular o ângulo entre dois planos. O primeiro plano é definido pelos pontos P₁, P₂ e P₃, e o segundo plano pelos pontos P₄, P₅ e P₆.
                        </p>
                        {renderPointInputs(['p1', 'p2', 'p3', 'p4', 'p5', 'p6'])}
                    </div>
                );
            default:
                return null;
        }
    };

    const getConceitoMatematico = () => {
        switch (state.problema) {
            case 'distanciaEntrePontoEReta':
                return (
                    <>
                        <p>A distância entre um ponto P e uma reta definida por um ponto Q e um vetor direção v é dada pela fórmula:</p>
                        <p className="my-2">d = |PQ × v| / |v|</p>
                        <p>Onde × representa o produto vetorial e |v| a magnitude do vetor v.</p>
                        <p>Esta fórmula calcula a componente do vetor PQ que é perpendicular ao vetor direção da reta.</p>
                    </>
                );
            case 'distanciaEntrePontoEPlano':
                return (
                    <>
                        <p>A distância de um ponto P(x₀, y₀, z₀) a um plano ax + by + cz + d = 0 é dada pela fórmula:</p>
                        <p className="my-2">d = |ax₀ + by₀ + cz₀ + d| / √(a² + b² + c²)</p>
                        <p>O vetor (a, b, c) é o vetor normal ao plano, e o denominador √(a² + b² + c²) é a magnitude desse vetor.</p>
                    </>
                );
            case 'distanciaEntreRetas':
                return (
                    <>
                        <p>A distância entre duas retas no espaço depende de sua posição relativa:</p>
                        <p>• Se as retas são paralelas, a distância é calculada como a distância de um ponto de uma reta à outra reta.</p>
                        <p>• Se as retas não são paralelas e não se intersectam, a distância é calculada como:</p>
                        <p className="my-2">d = |v₁₂·(v₁×v₂)| / |v₁×v₂|</p>
                        <p>Onde v₁ e v₂ são os vetores direção das retas, v₁₂ é um vetor que conecta um ponto da primeira reta a um ponto da segunda reta.</p>
                    </>
                );
            case 'anguloEntreRetas':
                return (
                    <>
                        <p>O ângulo θ entre duas retas com vetores direção v₁ e v₂ é dado por:</p>
                        <p className="my-2">cos(θ) = |v₁·v₂| / (|v₁|·|v₂|)</p>
                        <p>Onde v₁·v₂ é o produto escalar dos vetores direção.</p>
                        <p>O resultado está entre 0 e π/2 radianos (0° a 90°), pois sempre consideramos o ângulo agudo entre as retas.</p>
                    </>
                );
            case 'anguloEntreRetaEPlano':
                return (
                    <>
                        <p>O ângulo θ entre uma reta com vetor direção v e um plano com vetor normal n é dado por:</p>
                        <p className="my-2">sen(θ) = |v·n| / (|v|·|n|)</p>
                        <p>Onde v·n é o produto escalar entre o vetor direção da reta e o vetor normal do plano.</p>
                        <p>O resultado está entre 0 e π/2 radianos (0° a 90°), sendo θ = 0° quando a reta está contida no plano e θ = 90° quando a reta é perpendicular ao plano.</p>
                    </>
                );
            case 'anguloEntrePlanos':
                return (
                    <>
                        <p>O ângulo θ entre dois planos com vetores normais n₁ e n₂ é dado por:</p>
                        <p className="my-2">cos(θ) = |n₁·n₂| / (|n₁|·|n₂|)</p>
                        <p>Onde n₁·n₂ é o produto escalar dos vetores normais.</p>
                        <p>O resultado está entre 0 e π/2 radianos (0° a 90°), pois sempre consideramos o ângulo agudo entre os planos.</p>
                    </>
                );
            default:
                return null;
        }
    };

    const formatResult = () => {
        if (state.result === null) return null;
        
        switch (state.problema) {
            case 'distanciaEntrePontoEReta':
            case 'distanciaEntrePontoEPlano':
            case 'distanciaEntreRetas':
                return `${state.result} unidades`;
            
            case 'anguloEntreRetas':
            case 'anguloEntreRetaEPlano':
            case 'anguloEntrePlanos':
                const radianos = state.result;
                const graus = (radianos * 180) / Math.PI;
                return `${radianos.toFixed(4)} rad (${graus.toFixed(2)}°)`;
            
            default:
                return `${state.result}`;
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center mb-6">
                <HiCalculator className="h-6 w-6 text-indigo-600 dark:text-indigo-400 mr-2" />
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Calculadora de Geometria Analítica 3D</h2>
            </div>
            
            <div className="resolver-container p-6 mb-8">
                <p className="text-gray-700 dark:text-gray-300 mb-6">
                    Esta calculadora realiza cálculos avançados de geometria analítica no espaço tridimensional, como distâncias entre pontos, 
                    retas e planos, além de ângulos entre retas e planos.
                </p>

                <div className="mb-6">
                    <label htmlFor="problema" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Selecione o Tipo de Problema
                    </label>
                    <select
                        id="problema"
                        value={state.problema}
                        onChange={(e) => dispatch({ type: 'SET_PROBLEMA', value: e.target.value as ProblemaGeometriaAnalitica })}
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                    >
                        <option value="distanciaEntrePontoEReta">Distância entre ponto e reta</option>
                        <option value="distanciaEntrePontoEPlano">Distância entre ponto e plano</option>
                        <option value="distanciaEntreRetas">Distância entre duas retas</option>
                        <option value="anguloEntreRetas">Ângulo entre duas retas</option>
                        <option value="anguloEntreRetaEPlano">Ângulo entre reta e plano</option>
                        <option value="anguloEntrePlanos">Ângulo entre dois planos</option>
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
                            {state.problema.includes('distancia') ? (
                                <>O resultado é: <span className="font-bold">{formatResult()}</span></>
                            ) : (
                                <>O ângulo é: <span className="font-bold">{formatResult()}</span></>
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
                                        <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2 border-b border-gray-200 dark:border-gray-700 pb-1">Geometria Analítica 3D</h5>
                                        <div className="space-y-3">
                                            <p className="text-gray-700 dark:text-gray-300">
                                                A geometria analítica tridimensional estuda as relações geométricas entre pontos, retas e planos no espaço
                                                utilizando métodos da álgebra linear e do cálculo vetorial.
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
                                            <li>A geometria analítica utiliza sistemas de coordenadas para localizar objetos no espaço</li>
                                            <li>Retas são definidas por um ponto e um vetor direção ou por dois pontos distintos</li>
                                            <li>Planos são definidos por três pontos não colineares ou por um ponto e um vetor normal</li>
                                            <li>Ângulos entre retas e planos são calculados usando propriedades do produto escalar</li>
                                            <li>Distâncias são calculadas usando propriedades do produto vetorial e da projeção ortogonal</li>
                                        </ul>
                                    </div>
                                </div>
                                
                                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-white dark:bg-gray-700 p-3 rounded-md border border-gray-100 dark:border-gray-600 shadow-sm">
                                        <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Aplicações Práticas</h5>
                                        <div className="space-y-2">
                                            <p className="text-sm text-gray-700 dark:text-gray-300">A geometria analítica 3D tem aplicações em:</p>
                                            <ul className="text-sm space-y-1 list-disc pl-4 text-gray-700 dark:text-gray-300">
                                                <li><span className="font-medium">Computação Gráfica:</span> Renderização 3D, jogos, realidade virtual</li>
                                                <li><span className="font-medium">Modelagem CAD:</span> Engenharia e arquitetura</li>
                                                <li><span className="font-medium">Robótica:</span> Cinemática e planejamento de movimentos</li>
                                                <li><span className="font-medium">Física:</span> Mecânica espacial e eletromagnetismo</li>
                                                <li><span className="font-medium">Visão Computacional:</span> Reconhecimento de objetos e reconstrução 3D</li>
                                                <li><span className="font-medium">Geociências:</span> Cartografia e sistemas de informação geográfica</li>
                                                <li><span className="font-medium">Astronomia:</span> Cálculo de órbitas e posições celestiais</li>
                                                <li><span className="font-medium">Medicina:</span> Tomografia computadorizada e ressonância magnética</li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-md border-l-4 border-yellow-400 dark:border-yellow-600">
                                        <h5 className="font-medium text-yellow-800 dark:text-yellow-300 mb-2">Dicas de Resolução</h5>
                                        <ul className="text-sm space-y-1 list-disc pl-4 text-gray-700 dark:text-gray-300">
                                            <li>Ao trabalhar com ângulos entre retas, verifique se é necessário normalizar os vetores direção</li>
                                            <li>Para distâncias entre retas, verifique primeiro se as retas são paralelas</li>
                                            <li>Ao calcular ângulos entre planos, utilize seus vetores normais</li>
                                            <li>Em cálculos de distância, utilize o valor absoluto para evitar resultados negativos</li>
                                            <li>Quando trabalhar com ângulos, lembre-se que consideramos sempre o ângulo agudo (0° a 90°)</li>
                                            <li>Visualize mentalmente os objetos no espaço para melhor compreensão do problema</li>
                                            <li>Verifique a ortogonalidade das estruturas quando aplicável (produto escalar igual a zero)</li>
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
                                        A geometria analítica 3D está intimamente relacionada com a álgebra linear (espaços vetoriais, transformações lineares),
                                        o cálculo vetorial (campos vetoriais, gradientes), a geometria diferencial (curvaturas, geodésicas) e as equações diferenciais
                                        parciais (descrição de superfícies). Suas técnicas são fundamentais para a modelagem matemática de fenômenos físicos e para
                                        a resolução de problemas em engenharia e ciências aplicadas.
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

export default ResolvedorGeometriaAnalitica; 