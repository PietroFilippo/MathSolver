import React from 'react';
import { HiCalculator, HiInformationCircle } from 'react-icons/hi';
import { getCoefficientOfVariationExamples } from '../../utils/mathUtilsEstatistica';
import { useCoefficientOfVariationSolver } from '../../hooks/estatistica/useVariacaoCoeficienteSolver';
import StepByStepExplanation from '../../components/StepByStepExplanation';
import ConceitoMatematico from '../../components/ConceitoMatematico';

const ResolvedorVariacaoCoeficiente: React.FC = () => {
    const { state, dispatch, handleSolve, applyExample } = useCoefficientOfVariationSolver();

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center mb-6">
                <HiCalculator className="h-6 w-6 text-indigo-600 dark:text-indigo-400 mr-2" />
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Coeficiente de Variação</h2>
            </div>

            <div className="resolver-container p-6 mb-8">
                <p className="text-gray-700 dark:text-gray-300 mb-6">
                    O coeficiente de variação (CV) é uma medida de dispersão relativa que permite comparar a variabilidade de diferentes conjuntos de dados, independentemente de suas unidades de medida.
                </p>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Números (separados por vírgula):
                    </label>
                    <input
                        type="text"
                        value={state.numbersInput}
                        onChange={(e) => dispatch({ type: 'SET_DATA', data: e.target.value })}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                        placeholder="Ex: 2.5, 3.7, 4.2, 5.1"
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Exemplos
                    </label>
                    <div className="flex flex-wrap gap-2 mb-4">
                        {getCoefficientOfVariationExamples().map((example, index) => (
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

            {state.result !== null && (
                <div className="space-y-6">
                    <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-5">
                        <h3 className="text-lg font-medium text-green-800 dark:text-green-300 mb-2">Resultado</h3>
                        <p className="text-xl text-gray-800 dark:text-gray-200">
                            Coeficiente de Variação: <span className="font-bold">{state.result}%</span>
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
                                        <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2 border-b border-gray-200 dark:border-gray-700 pb-1">Coeficiente de Variação (CV)</h5>
                                        <div className="space-y-3">
                                            <p className="text-gray-700 dark:text-gray-300">
                                                O coeficiente de variação (CV) é uma medida estatística da dispersão relativa 
                                                dos dados em relação à média. Ele permite comparar a variabilidade de diferentes 
                                                conjuntos de dados, independentemente de suas unidades de medida ou magnitude.
                                            </p>
                                            <div className="bg-white dark:bg-gray-700 p-3 rounded-md border border-gray-100 dark:border-gray-600 shadow-sm">
                                                <h6 className="text-indigo-700 dark:text-indigo-300 font-medium mb-2">Fórmula</h6>
                                                <div className="text-center font-medium text-indigo-700 dark:text-indigo-300">
                                                    <p>CV = (σ ÷ μ) × 100%</p>
                                                    <p className="text-sm mt-1">Onde: σ é o desvio padrão e μ é a média do conjunto de dados</p>
                                                </div>
                                            </div>
                                            <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-md">
                                                <h6 className="text-indigo-700 dark:text-indigo-300 font-medium mb-1">Classificação do CV</h6>
                                                <ul className="text-sm list-disc list-inside text-gray-700 dark:text-gray-300">
                                                    <li>CV &lt; 15%: <span className="text-green-600 dark:text-green-400 font-medium">Baixa dispersão</span> (dados homogêneos)</li>
                                                    <li>15% ≤ CV &lt; 30%: <span className="text-amber-600 dark:text-amber-400 font-medium">Média dispersão</span></li>
                                                    <li>CV ≥ 30%: <span className="text-red-600 dark:text-red-400 font-medium">Alta dispersão</span> (dados heterogêneos)</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex-1">
                                        <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2 border-b border-gray-200 dark:border-gray-700 pb-1">Aplicações e Vantagens</h5>
                                        <div className="p-3 bg-white dark:bg-gray-700 rounded-md border border-gray-100 dark:border-gray-600 shadow-sm mb-4">
                                            <h6 className="text-indigo-700 dark:text-indigo-300 font-medium mb-2">Contextos de Uso</h6>
                                            <ul className="text-sm space-y-2 list-disc pl-4 text-gray-700 dark:text-gray-300">
                                                <li><span className="font-medium">Controle de Qualidade:</span> Avaliar a consistência de processos de produção</li>
                                                <li><span className="font-medium">Finanças:</span> Comparar a volatilidade de diferentes investimentos</li>
                                                <li><span className="font-medium">Ciências Biológicas:</span> Analisar variabilidade em experimentos</li>
                                                <li><span className="font-medium">Pesquisas Sociais:</span> Avaliar a homogeneidade de respostas</li>
                                                <li><span className="font-medium">Meteorologia:</span> Comparar variabilidade climática entre regiões</li>
                                            </ul>
                                        </div>
                                        <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-md border border-green-100 dark:border-green-800">
                                            <h6 className="text-green-700 dark:text-green-300 font-medium mb-2">Vantagens do CV</h6>
                                            <ul className="text-sm space-y-1 list-disc pl-4 text-gray-700 dark:text-gray-300">
                                                <li>Adimensional (sem unidade de medida)</li>
                                                <li>Permite comparar dispersão entre conjuntos de dados com médias diferentes</li>
                                                <li>Fácil interpretação através de porcentagem</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-white dark:bg-gray-700 p-3 rounded-md border border-gray-100 dark:border-gray-600 shadow-sm">
                                        <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Exemplo Interpretativo</h5>
                                        <div className="space-y-2">
                                            <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-md">
                                                <p className="text-sm text-indigo-700 dark:text-indigo-300">
                                                    <span className="font-medium">Comparação de Salários em Dois Departamentos:</span>
                                                </p>
                                                <ul className="text-xs list-disc pl-4 mt-1 text-gray-700 dark:text-gray-300">
                                                    <li>Departamento A: Média de R$ 5.000, Desvio Padrão de R$ 500</li>
                                                    <li>Departamento B: Média de R$ 10.000, Desvio Padrão de R$ 1.500</li>
                                                </ul>
                                                <p className="text-xs mt-2 text-indigo-700 dark:text-indigo-300">
                                                    CV Departamento A = (500 ÷ 5.000) × 100% = 10%<br />
                                                    CV Departamento B = (1.500 ÷ 10.000) × 100% = 15%<br /><br />
                                                    <span className="font-medium">Conclusão:</span> Embora o Departamento B tenha um desvio padrão maior em termos absolutos, 
                                                    o Departamento A tem salários mais homogêneos proporcionalmente à média.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-md border-l-4 border-yellow-400 dark:border-yellow-600">
                                        <h5 className="font-medium text-yellow-800 dark:text-yellow-300 mb-2">Limitações e Cuidados</h5>
                                        <ul className="text-sm space-y-2 list-disc pl-4 text-gray-700 dark:text-gray-300">
                                            <li>Não é adequado para conjuntos com média próxima a zero (pode gerar valores extremamente altos)</li>
                                            <li>Sensível a outliers (valores extremos)</li>
                                            <li>Para dados com distribuição não-normal, pode ser menos informativo</li>
                                            <li>Em conjuntos de dados pequenos, pode gerar interpretações enganosas</li>
                                        </ul>
                                    </div>
                                </div>
                                
                                <div className="mt-4 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-md border border-indigo-100 dark:border-indigo-700">
                                    <h5 className="font-medium text-indigo-800 dark:text-indigo-300 mb-1 flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                        </svg>
                                        Diferença entre Amostra e População
                                    </h5>
                                    <p className="text-sm text-indigo-700 dark:text-indigo-300">
                                        Ao calcular o CV em estatística inferencial, é importante distinguir entre dados populacionais e amostrais. 
                                        Para amostras, o desvio padrão usado no cálculo deve ser o desvio padrão amostral (com n-1 no denominador), 
                                        resultando no coeficiente de variação amostral. Isso fornece uma estimativa mais precisa do CV populacional.
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

export default ResolvedorVariacaoCoeficiente;
