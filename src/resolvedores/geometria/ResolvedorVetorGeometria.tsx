import React from 'react';
import { HiCalculator, HiInformationCircle } from 'react-icons/hi';
import { useVetorGeometriaSolver, ProblemaVetorGeometria } from '../../hooks/geometria/useVetorGeometriaSolver';
import StepByStepExplanation from '../../components/StepByStepExplanation';
import ConceitoMatematico from '../../components/ConceitoMatematico';

const ResolvedorVetorGeometria: React.FC = () => {
    const {
        state,
        dispatch,
        setVetorValue,
        setEscalarValue,
        handleSolve,
        applyExample,
        getFilteredExamples
    } = useVetorGeometriaSolver();

    const renderVectorInputs = (requiredVectors: ('v1' | 'v2')[]) => {
        const inputClassName = "w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200";
        
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {requiredVectors.map((vetor) => (
                    <div key={vetor} className="bg-gray-50 dark:bg-gray-700/50 rounded-md p-4">
                        <h3 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-3">
                            Vetor {vetor.toUpperCase()}
                        </h3>
                        <div className="grid grid-cols-3 gap-2">
                            <div>
                                <label htmlFor={`${vetor}-x`} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    x
                                </label>
                                <input
                                    type="number"
                                    id={`${vetor}-x`}
                                    value={state.vetores[vetor].x}
                                    onChange={(e) => setVetorValue(vetor, 'x', e.target.value)}
                                    className={inputClassName}
                                    placeholder="0"
                                    step="0.1"
                                />
                            </div>
                            <div>
                                <label htmlFor={`${vetor}-y`} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    y
                                </label>
                                <input
                                    type="number"
                                    id={`${vetor}-y`}
                                    value={state.vetores[vetor].y}
                                    onChange={(e) => setVetorValue(vetor, 'y', e.target.value)}
                                    className={inputClassName}
                                    placeholder="0"
                                    step="0.1"
                                />
                            </div>
                            <div>
                                <label htmlFor={`${vetor}-z`} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    z
                                </label>
                                <input
                                    type="number"
                                    id={`${vetor}-z`}
                                    value={state.vetores[vetor].z}
                                    onChange={(e) => setVetorValue(vetor, 'z', e.target.value)}
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

    const renderScalarInput = () => {
        const inputClassName = "w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200";
        
        return (
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-md p-4 mt-4">
                <h3 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-3">
                    Escalar (k)
                </h3>
                <div className="grid grid-cols-1 gap-2">
                    <div>
                        <input
                            type="number"
                            id="escalar"
                            value={state.escalar}
                            onChange={(e) => setEscalarValue(e.target.value)}
                            className={inputClassName}
                            placeholder="1"
                            step="0.1"
                        />
                    </div>
                </div>
            </div>
        );
    };

    const renderInputFields = () => {
        switch (state.problema) {
            case 'somaVetores':
                return renderVectorInputs(['v1', 'v2']);
            case 'subtracaoVetores':
                return renderVectorInputs(['v1', 'v2']);
            case 'multiplicacaoEscalar':
                return (
                    <div>
                        {renderVectorInputs(['v1'])}
                        {renderScalarInput()}
                    </div>
                );
            case 'produtoEscalar':
                return renderVectorInputs(['v1', 'v2']);
            case 'produtoVetorial':
                return renderVectorInputs(['v1', 'v2']);
            case 'magnitudeVetor':
                return renderVectorInputs(['v1']);
            case 'normalizacaoVetor':
                return renderVectorInputs(['v1']);
            case 'anguloEntreVetores':
                return renderVectorInputs(['v1', 'v2']);
            default:
                return null;
        }
    };

    const getConceitoMatematico = () => {
        switch (state.problema) {
            case 'somaVetores':
                return (
                    <>
                        <p>A soma de dois vetores u = (u₁, u₂, u₃) e v = (v₁, v₂, v₃) é dada por:</p>
                        <p className="my-2">u + v = (u₁ + v₁, u₂ + v₂, u₃ + v₃)</p>
                        <p>Geometricamente, representa o deslocamento resultante após aplicar os dois vetores sequencialmente.</p>
                    </>
                );
            case 'subtracaoVetores':
                return (
                    <>
                        <p>A subtração de dois vetores u = (u₁, u₂, u₃) e v = (v₁, v₂, v₃) é dada por:</p>
                        <p className="my-2">u - v = (u₁ - v₁, u₂ - v₂, u₃ - v₃)</p>
                        <p>Geometricamente, representa o vetor que precisa ser adicionado a v para chegar a u.</p>
                    </>
                );
            case 'multiplicacaoEscalar':
                return (
                    <>
                        <p>A multiplicação de um vetor v = (v₁, v₂, v₃) por um escalar k é dada por:</p>
                        <p className="my-2">k·v = (k·v₁, k·v₂, k·v₃)</p>
                        <p>Isso altera a magnitude do vetor (e sua direção se k for negativo) sem mudar sua direção original.</p>
                    </>
                );
            case 'produtoEscalar':
                return (
                    <>
                        <p>O produto escalar (dot product) de dois vetores u = (u₁, u₂, u₃) e v = (v₁, v₂, v₃) é dado por:</p>
                        <p className="my-2">u · v = u₁·v₁ + u₂·v₂ + u₃·v₃</p>
                        <p>Também pode ser calculado como |u|·|v|·cos(θ), onde θ é o ângulo entre os vetores.</p>
                        <p>É usado para calcular projeções e determinar ortogonalidade (u · v = 0 significa vetores perpendiculares).</p>
                    </>
                );
            case 'produtoVetorial':
                return (
                    <>
                        <p>O produto vetorial (cross product) de dois vetores u = (u₁, u₂, u₃) e v = (v₁, v₂, v₃) é dado por:</p>
                        <p className="my-2">u × v = (u₂·v₃ - u₃·v₂, u₃·v₁ - u₁·v₃, u₁·v₂ - u₂·v₁)</p>
                        <p>O resultado é um vetor perpendicular a ambos u e v, com magnitude |u|·|v|·sen(θ).</p>
                        <p>É usado para calcular área de paralelogramos e determinar normais de superfícies.</p>
                    </>
                );
            case 'magnitudeVetor':
                return (
                    <>
                        <p>A magnitude (ou módulo) de um vetor v = (v₁, v₂, v₃) é dada por:</p>
                        <p className="my-2">|v| = √(v₁² + v₂² + v₃²)</p>
                        <p>Representa o comprimento ou "tamanho" do vetor no espaço 3D.</p>
                    </>
                );
            case 'normalizacaoVetor':
                return (
                    <>
                        <p>Um vetor normalizado (ou unitário) v̂ é obtido dividindo o vetor v pela sua magnitude:</p>
                        <p className="my-2">v̂ = v / |v| = (v₁/|v|, v₂/|v|, v₃/|v|)</p>
                        <p>Vetores normalizados têm magnitude 1 e preservam a direção do vetor original.</p>
                        <p>São úteis em muitas aplicações onde apenas a direção importa.</p>
                    </>
                );
            case 'anguloEntreVetores':
                return (
                    <>
                        <p>O ângulo θ entre dois vetores não-nulos u e v é dado por:</p>
                        <p className="my-2">cos(θ) = (u · v) / (|u|·|v|)</p>
                        <p>Portanto: θ = arccos((u · v) / (|u|·|v|))</p>
                        <p>O resultado está entre 0 e π radianos (0° a 180°).</p>
                    </>
                );
            default:
                return null;
        }
    };

    const formatResult = () => {
        if (state.result === null) return null;
        
        switch (state.problema) {
            case 'somaVetores':
            case 'subtracaoVetores':
            case 'multiplicacaoEscalar':
            case 'produtoVetorial':
            case 'normalizacaoVetor':
                // Resultados vetoriais
                const vectorResult = state.result as { x: number, y: number, z: number };
                return `(${vectorResult.x}, ${vectorResult.y}, ${vectorResult.z})`;
            
            case 'produtoEscalar':
            case 'magnitudeVetor':
                // Resultados escalares
                return `${state.result}`;
            
            case 'anguloEntreVetores':
                // Resultado em radianos e graus
                const radianos = state.result as number;
                const graus = (radianos * 180) / Math.PI;
                return `${radianos} rad (${graus.toFixed(2)}°)`;
            
            default:
                return `${state.result}`;
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center mb-6">
                <HiCalculator className="h-6 w-6 text-indigo-600 dark:text-indigo-400 mr-2" />
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Calculadora de Geometria Vetorial 3D</h2>
            </div>
            
            <div className="resolver-container p-6 mb-8">
                <p className="text-gray-700 dark:text-gray-300 mb-6">
                    Esta calculadora permite realizar operações de álgebra vetorial no espaço tridimensional, como soma e subtração de vetores, 
                    multiplicação por escalar, produtos escalar e vetorial, cálculo de magnitude, normalização e ângulos entre vetores.
                </p>

                <div className="mb-6">
                    <label htmlFor="problema" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Selecione a Operação Vetorial
                    </label>
                    <select
                        id="problema"
                        value={state.problema}
                        onChange={(e) => dispatch({ type: 'SET_PROBLEMA', value: e.target.value as ProblemaVetorGeometria })}
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                    >
                        <option value="somaVetores">Soma de vetores</option>
                        <option value="subtracaoVetores">Subtração de vetores</option>
                        <option value="multiplicacaoEscalar">Multiplicação por escalar</option>
                        <option value="produtoEscalar">Produto escalar (dot product)</option>
                        <option value="produtoVetorial">Produto vetorial (cross product)</option>
                        <option value="magnitudeVetor">Magnitude de um vetor</option>
                        <option value="normalizacaoVetor">Normalização de um vetor</option>
                        <option value="anguloEntreVetores">Ângulo entre vetores</option>
                    </select>
                </div>

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
                    <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-3">Valores dos Vetores</h3>
                    {renderInputFields()}
                </div>

                {state.errorMessage && (
                    <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-900 rounded-md text-red-800 dark:text-red-300">
                        {state.errorMessage}
                    </div>
                )}

                <button
                    onClick={handleSolve}
                    className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-800 text-white rounded-md px-4 py-2 font-medium transition-colors"
                >
                    Calcular
                </button>

                {state.result !== null && (
                    <div className="space-y-6 mt-6">
                        <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-5">
                            <h3 className="text-lg font-medium text-green-800 dark:text-green-300 mb-2">Resultado</h3>
                            <p className="text-xl text-gray-800 dark:text-gray-200">
                                <span className="font-bold">{formatResult()}</span>
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
                                            <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2 border-b border-gray-200 dark:border-gray-700 pb-1">Geometria Vetorial 3D</h5>
                                            <div className="space-y-3">
                                                <p className="text-gray-700 dark:text-gray-300">
                                                    A geometria vetorial utiliza vetores para representar quantidades que têm tanto magnitude quanto direção.
                                                    Os vetores são fundamentais na física, engenharia e matemática aplicada.
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
                                                <li>Vetores são quantidades que possuem magnitude e direção</li>
                                                <li>Operações vetoriais respeitam regras específicas diferentes da aritmética escalar</li>
                                                <li>Vetores são fundamentais para descrever forças, velocidades e outras grandezas direcionais</li>
                                                <li>O produto escalar e vetorial têm interpretações geométricas importantes</li>
                                            </ul>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="bg-white dark:bg-gray-700 p-3 rounded-md border border-gray-100 dark:border-gray-600 shadow-sm">
                                            <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Aplicações Práticas</h5>
                                            <div className="space-y-2">
                                                <p className="text-sm text-gray-700 dark:text-gray-300">A álgebra vetorial é essencial em diversos campos:</p>
                                                <ul className="text-sm space-y-1 list-disc pl-4 text-gray-700 dark:text-gray-300">
                                                    <li><span className="font-medium">Física:</span> Forças, velocidades, acelerações</li>
                                                    <li><span className="font-medium">Computação Gráfica:</span> Transformações 3D, iluminação</li>
                                                    <li><span className="font-medium">Robótica:</span> Cinemática, orientação espacial</li>
                                                    <li><span className="font-medium">Aeronáutica:</span> Navegação, cálculo de trajetórias</li>
                                                    <li><span className="font-medium">Engenharia Civil:</span> Análise estrutural</li>
                                                    <li><span className="font-medium">Geometria Computacional:</span> Algoritmos geométricos</li>
                                                    <li><span className="font-medium">Videogames:</span> Física de jogos, detecção de colisão</li>
                                                </ul>
                                            </div>
                                        </div>

                                        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-md border-l-4 border-yellow-400 dark:border-yellow-600">
                                            <h5 className="font-medium text-yellow-800 dark:text-yellow-300 mb-2">Dicas de Resolução</h5>
                                            <ul className="text-sm space-y-1 list-disc pl-4 text-gray-700 dark:text-gray-300">
                                                <li>Ao trabalhar com vetores, desenhe-os em um sistema de coordenadas para visualização</li>
                                                <li>No produto escalar, lembre-se que o resultado é um número (escalar)</li>
                                                <li>No produto vetorial, o resultado é um vetor perpendicular aos dois vetores originais</li>
                                                <li>Vetores paralelos têm produto vetorial nulo</li>
                                                <li>Vetores perpendiculares têm produto escalar nulo</li>
                                                <li>A magnitude de um vetor não depende de sua direção, apenas de suas componentes</li>
                                                <li>A normalização preserva a direção, mas ajusta a magnitude para 1</li>
                                            </ul>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-4 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-md border border-indigo-100 dark:border-indigo-800">
                                        <h5 className="font-medium text-indigo-800 dark:text-indigo-300 mb-1 flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                            </svg>
                                            Propriedades Importantes
                                        </h5>
                                        <ul className="text-sm space-y-1 list-disc pl-4 text-indigo-700 dark:text-indigo-300">
                                            <li><span className="font-medium">Produto Escalar:</span> u · v = v · u (comutativo)</li>
                                            <li><span className="font-medium">Produto Vetorial:</span> u × v = -(v × u) (anti-comutativo)</li>
                                            <li><span className="font-medium">Vetores Perpendiculares:</span> u · v = 0</li>
                                            <li><span className="font-medium">Vetores Paralelos:</span> u × v = 0</li>
                                            <li><span className="font-medium">Distributividade:</span> u · (v + w) = u · v + u · w</li>
                                            <li><span className="font-medium">Base Canônica:</span> i = (1,0,0), j = (0,1,0), k = (0,0,1)</li>
                                            <li><span className="font-medium">Produto Triplo:</span> u · (v × w) = volume do paralelepípedo</li>
                                        </ul>
                                    </div>
                                </ConceitoMatematico>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResolvedorVetorGeometria; 