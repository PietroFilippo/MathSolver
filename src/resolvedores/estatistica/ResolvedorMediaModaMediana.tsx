import React from 'react';
import { HiCalculator, HiInformationCircle } from 'react-icons/hi';
import { useCentralTendencySolver } from '../../hooks/estatistica/useMediaModaMedianaSolver';
import { getCentralTendencyExamples } from '../../utils/mathUtilsEstatistica';
import StepByStepExplanation from '../../components/StepByStepExplanation';
import ConceitoMatematico from '../../components/ConceitoMatematico';

const ResolvedorMediaModaMediana: React.FC = () => {
    const { state, dispatch, handleSolve, applyExample } = useCentralTendencySolver();

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center mb-6">
                <HiCalculator className="h-6 w-6 text-indigo-600 dark:text-indigo-400 mr-2" />
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Média, Moda e Mediana</h2>
            </div>

            <div className="resolver-container p-6 mb-8">
                <p className="text-gray-700 dark:text-gray-300 mb-6">
                    Calcule a média, mediana e moda de um conjunto de números.
                </p>
                
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Números (separados por vírgula):
                    </label>
                    <input
                        type="text"
                        value={state.data}
                        onChange={(e) => dispatch({ type: 'SET_DATA', data: e.target.value })}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                        placeholder="Ex: 10, 15, 20, 25"
                    />
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Digite os números separados por vírgula. Ex: 10, 15, 20, 25
                    </p>
                </div>

                {/* Exemplos de conjuntos de dados */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Exemplos
                    </label>
                    <div className="flex flex-wrap gap-2 mb-4">
                        {getCentralTendencyExamples().map((example, index) => (
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
                    className="bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 text-white font-medium py-2 px-6 rounded-md transition-colors duration-300 mt-4"
                >
                    Calcular
                </button>

                {state.errorMessage && (
                    <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 rounded-md">
                        {state.errorMessage}
                    </div>
                )}
            </div>

            {state.results.media !== null && (
                <div className="space-y-6">
                    <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-5">
                        <h3 className="text-lg font-medium text-green-800 dark:text-green-300 mb-2">Resultados</h3>
                        <div className="space-y-2 text-gray-800 dark:text-gray-200">
                            <p className="text-xl">
                                Média: <span className="font-bold">{state.results.media}</span>
                            </p>
                            <p className="text-xl">
                                Mediana: <span className="font-bold">{state.results.mediana}</span>
                            </p>
                            <p className="text-xl">
                                Moda: <span className="font-bold">
                                    {state.results.moda && state.results.moda.length > 0 ? state.results.moda.join(', ') : 'Não há moda'}
                                </span>
                            </p>
                        </div>
                        
                        <button 
                            onClick={() => dispatch({ type: 'TOGGLE_EXPLANATION' })}
                            className="mt-4 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 text-sm font-medium flex items-center"
                        >
                            <HiInformationCircle className="h-5 w-5 mr-1" />
                            {state.showExplanation ? "Ocultar explicação detalhada" : "Mostrar explicação detalhada"}
                        </button>
                    </div>

                    {state.showExplanation && (
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
                                        <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2 border-b border-gray-200 dark:border-gray-700 pb-1">Medidas de Tendência Central</h5>
                                        <p className="text-gray-700 dark:text-gray-300 mb-3">
                                            As medidas de tendência central são valores que representam o centro ou valor típico 
                                            de um conjunto de dados. As três principais medidas são a média, a mediana e a moda.
                                        </p>
                                        
                                        <div className="space-y-3 mt-4">
                                            <div className="bg-white dark:bg-gray-700 p-3 rounded-md border border-gray-100 dark:border-gray-600 shadow-sm">
                                                <h6 className="text-indigo-700 dark:text-indigo-300 font-medium mb-2">Média Aritmética</h6>
                                                <div className="text-center font-medium text-indigo-700 dark:text-indigo-300 mb-2">
                                                    <p>μ = (x₁ + x₂ + ... + xₙ) ÷ n = Σxᵢ ÷ n</p>
                                                </div>
                                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                                    É calculada somando todos os valores e dividindo pelo número total de valores. 
                                                    É muito utilizada, mas pode ser sensível a valores extremos (outliers).
                                                </p>
                                            </div>
                                            
                                            <div className="bg-white dark:bg-gray-700 p-3 rounded-md border border-gray-100 dark:border-gray-600 shadow-sm">
                                                <h6 className="text-indigo-700 dark:text-indigo-300 font-medium mb-2">Mediana</h6>
                                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                                    É o valor que divide um conjunto ordenado de dados em duas partes iguais.
                                                    Para encontrá-la, primeiro ordenamos os valores e então:
                                                </p>
                                                <ul className="text-xs list-disc pl-5 mt-2 text-gray-700 dark:text-gray-300">
                                                    <li>Se o número de valores é ímpar, a mediana é o valor central</li>
                                                    <li>Se o número de valores é par, a mediana é a média dos dois valores centrais</li>
                                                </ul>
                                            </div>
                                            
                                            <div className="bg-white dark:bg-gray-700 p-3 rounded-md border border-gray-100 dark:border-gray-600 shadow-sm">
                                                <h6 className="text-indigo-700 dark:text-indigo-300 font-medium mb-2">Moda</h6>
                                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                                    É o valor que aparece com maior frequência em um conjunto de dados.
                                                    Um conjunto pode:
                                                </p>
                                                <ul className="text-xs list-disc pl-5 mt-2 text-gray-700 dark:text-gray-300">
                                                    <li>Não ter moda (quando todos os valores aparecem o mesmo número de vezes)</li>
                                                    <li>Ser unimodal (ter apenas uma moda)</li>
                                                    <li>Ser multimodal (ter mais de uma moda)</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex-1">
                                        <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2 border-b border-gray-200 dark:border-gray-700 pb-1">Comparação e Aplicações</h5>
                                        
                                        <div className="p-3 bg-white dark:bg-gray-700 rounded-md border border-gray-100 dark:border-gray-600 shadow-sm mb-4">
                                            <h6 className="text-indigo-700 dark:text-indigo-300 font-medium mb-2">Quando Usar Cada Medida</h6>
                                            <div className="space-y-2">
                                                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                                                    <span className="font-medium text-blue-700 dark:text-blue-300">Média</span>
                                                    <ul className="text-xs list-disc pl-4 mt-1 text-gray-700 dark:text-gray-300">
                                                        <li>Melhor para dados com distribuição simétrica</li>
                                                        <li>Útil para cálculos estatísticos adicionais</li>
                                                        <li>Considera todos os valores do conjunto</li>
                                                    </ul>
                                                </div>
                                                <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-md">
                                                    <span className="font-medium text-purple-700 dark:text-purple-300">Mediana</span>
                                                    <ul className="text-xs list-disc pl-4 mt-1 text-gray-700 dark:text-gray-300">
                                                        <li>Melhor para dados assimétricos ou com outliers</li>
                                                        <li>Ideal para distribuições de renda, preços de casas</li>
                                                        <li>Não é afetada por valores extremos</li>
                                                    </ul>
                                                </div>
                                                <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-md">
                                                    <span className="font-medium text-green-700 dark:text-green-300">Moda</span>
                                                    <ul className="text-xs list-disc pl-4 mt-1 text-gray-700 dark:text-gray-300">
                                                        <li>Melhor para dados categóricos</li>
                                                        <li>Útil para identificar tamanhos mais comuns, preferências</li>
                                                        <li>Única medida aplicável a dados não numéricos</li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-md border-l-4 border-yellow-400 dark:border-yellow-600">
                                            <h6 className="font-medium text-yellow-800 dark:text-yellow-300 mb-1">Exemplos de Aplicações</h6>
                                            <ul className="text-sm space-y-1 list-disc pl-4 text-gray-700 dark:text-gray-300">
                                                <li><span className="font-medium">Média:</span> Notas escolares, altura média, temperatura média</li>
                                                <li><span className="font-medium">Mediana:</span> Salários, preços de imóveis, tempo de espera</li>
                                                <li><span className="font-medium">Moda:</span> Tamanho de roupas mais vendido, cor preferida, produto mais popular</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-white dark:bg-gray-700 p-3 rounded-md border border-gray-100 dark:border-gray-600 shadow-sm">
                                        <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Relações entre as Medidas</h5>
                                        <div className="space-y-2">
                                            <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-md">
                                                <h6 className="font-medium text-indigo-700 dark:text-indigo-300 mb-1">Distribuição Simétrica</h6>
                                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                                    Em uma distribuição perfeitamente simétrica, a média, mediana e moda coincidem.
                                                </p>
                                            </div>
                                            <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-md">
                                                <h6 className="font-medium text-indigo-700 dark:text-indigo-300 mb-1">Distribuição Assimétrica Positiva</h6>
                                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                                    Moda {"<"} Mediana {"<"} Média
                                                    <br />
                                                    (cauda à direita, ex: distribuição de renda)
                                                </p>
                                            </div>
                                            <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-md">
                                                <h6 className="font-medium text-indigo-700 dark:text-indigo-300 mb-1">Distribuição Assimétrica Negativa</h6>
                                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                                    Média {"<"} Mediana {"<"} Moda
                                                    <br />
                                                    (cauda à esquerda, ex: idade de falecimento)
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-md border border-indigo-100 dark:border-indigo-700">
                                        <h5 className="font-medium text-indigo-800 dark:text-indigo-300 mb-2 flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                            </svg>
                                            Dicas de Interpretação
                                        </h5>
                                        <ul className="text-sm space-y-2 list-disc pl-4 text-indigo-700 dark:text-indigo-300">
                                            <li>Use múltiplas medidas para obter uma visão mais completa dos dados</li>
                                            <li>Sempre considere o contexto ao interpretar as medidas estatísticas</li>
                                            <li>Analise as medidas de tendência central junto com medidas de dispersão (como desvio padrão)</li>
                                            <li>Gráficos como histogramas e box plots podem complementar a análise destas medidas</li>
                                        </ul>
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

export default ResolvedorMediaModaMediana;
