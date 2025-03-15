import React, { useState } from 'react';
import { HiCalculator } from 'react-icons/hi';
import { roundToDecimals } from '../../utils/mathUtils';
import { getCoefficientOfVariationExamples } from '../../utils/mathUtilsEstatistica';

const ResolvedorVariacaoCoeficiente: React.FC = () => {
    const [numbersInput, setNumbersInput] = useState<string>('');
    const [result, setResult] = useState<number | null>(null);
    const [showExplanation, setShowExplanation] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [steps, setSteps] = useState<string[]>([]);

    const handleSolve = () => {
        setResult(null);
        setErrorMessage(null);
        setShowExplanation(false);
        setSteps([]);

        try {
            // Validar e converter a entrada
            const inputValues = numbersInput
                .split(/[,;\s]+/)
                .map(val => val.trim())
                .filter(val => val !== '')
                .map(val => {
                    const parsed = parseFloat(val);
                    if (isNaN(parsed)) {
                        throw new Error(`Valor inválido: ${val}`);
                    }
                    return parsed;
                });

            if (inputValues.length < 2) {
                setErrorMessage('Adicione pelo menos 2 valores para calcular o coeficiente de variação.');
                return;
            }

            // Calcular a média
            const sum = inputValues.reduce((acc, curr) => acc + curr, 0);
            const mean = sum / inputValues.length;

            // Calcular o desvio padrão
            const squaredDifferences = inputValues.map(value => Math.pow(value - mean, 2));
            const variance = squaredDifferences.reduce((acc, curr) => acc + curr, 0) / inputValues.length;
            const standardDeviation = Math.sqrt(variance);

            // Calcular o coeficiente de variação
            const cv = (standardDeviation / mean) * 100;

            // Arredondar para 2 casas decimais
            const roundedResult = roundToDecimals(cv, 2);
            setResult(roundedResult);

            // Gerar passos de explicação
            const explanationSteps = [];
            let stepNumber = 1;

            explanationSteps.push(`Passo ${stepNumber++}: Identificar os valores do conjunto de dados`);
            explanationSteps.push(`Conjunto de dados: ${inputValues.join(', ')}`);

            explanationSteps.push(`Passo ${stepNumber++}: Calcular a média aritmética (μ)`);
            explanationSteps.push(`μ = (${inputValues.join(' + ')}) ÷ ${inputValues.length}`);
            explanationSteps.push(`μ = ${roundToDecimals(mean, 4)}`);

            explanationSteps.push(`Passo ${stepNumber++}: Calcular o desvio padrão (σ)`);
            explanationSteps.push(`Calcular os desvios quadráticos:`);
            
            inputValues.forEach((value, index) => {
                const deviation = value - mean;
                const squaredDev = squaredDifferences[index];
                explanationSteps.push(`(${value} - ${roundToDecimals(mean, 4)})² = ${roundToDecimals(deviation, 4)}² = ${roundToDecimals(squaredDev, 4)}`);
            });
            
            explanationSteps.push(`Variância = (${squaredDifferences.map(sd => roundToDecimals(sd, 4)).join(' + ')}) ÷ ${inputValues.length}`);
            explanationSteps.push(`Variância = ${roundToDecimals(variance, 4)}`);
            explanationSteps.push(`Desvio padrão (σ) = √${roundToDecimals(variance, 4)} = ${roundToDecimals(standardDeviation, 4)}`);

            explanationSteps.push(`Passo ${stepNumber++}: Calcular o coeficiente de variação (CV)`);
            explanationSteps.push(`CV = (σ ÷ μ) × 100%`);
            explanationSteps.push(`CV = (${roundToDecimals(standardDeviation, 4)} ÷ ${roundToDecimals(mean, 4)}) × 100%`);
            explanationSteps.push(`CV = ${roundToDecimals(cv, 2)}%`);

            if (cv < 15) {
                explanationSteps.push(`Interpretação: Um coeficiente de variação de ${roundToDecimals(cv, 2)}% é considerado BAIXO, indicando que os dados são relativamente homogêneos.`);
            } else if (cv < 30) {
                explanationSteps.push(`Interpretação: Um coeficiente de variação de ${roundToDecimals(cv, 2)}% é considerado MÉDIO, indicando uma dispersão moderada dos dados.`);
            } else {
                explanationSteps.push(`Interpretação: Um coeficiente de variação de ${roundToDecimals(cv, 2)}% é considerado ALTO, indicando que os dados são heterogêneos e têm uma dispersão elevada.`);
            }

            setSteps(explanationSteps);
            setShowExplanation(true);
        } catch (error) {
            if (error instanceof Error) {
                setErrorMessage(error.message);
            } else {
                setErrorMessage('Ocorreu um erro ao calcular o coeficiente de variação.');
            }
        }
    };

    // Função para aplicar um exemplo
    const applyExample = (example: { data: number[], description: string }) => {
        setNumbersInput(example.data.join(', '));
    };

    // Função para renderizar os passos de explicação com estilização aprimorada
    const renderExplanationSteps = () => {
        return (
            <div className="space-y-4">
                {steps.map((step, index) => {
                    // Verifica se o passo começa com um padrão de número de passo
                    const stepMatch = step.match(/^(Passo \d+:)(.*)$/);

                    // Verifica se é a lista de valores ou conjunto de dados
                    const dataSetMatch = step.startsWith('Conjunto de dados:');

                    // Verifica se é o cálculo da média
                    const meanCalcMatch = step.startsWith('μ =');

                    // Verifica se são os desvios quadráticos
                    const deviationMatch = step.includes('- ') && step.includes('²');

                    // Verifica se é o cálculo da variância ou desvio padrão
                    const varianceMatch = step.includes('Variância =') || step.includes('Desvio padrão');

                    // Verifica se é o cálculo do CV
                    const cvMatch = step.startsWith('CV =');

                    // Verifica se é a interpretação do resultado
                    const interpretationMatch = step.startsWith('Interpretação:');

                    if (stepMatch) {
                        // Se for um passo com número, extrai e destaca o número
                        const [_, stepNumber, stepContent] = stepMatch;
                        return (
                            <div key={index} className="p-4 bg-gray-50 rounded-md border-l-4 border-indigo-500">
                    <div className="flex flex-col sm:flex-row">
                        <span className="font-bold text-indigo-700 mr-2 mb-1 sm:mb-0">
                                        {stepNumber}
                        </span>
                                    <p className="text-gray-800">{stepContent}</p>
                    </div>
                </div>
                        );
                    } else if (dataSetMatch) {
                        // Se for a lista do conjunto de dados
                        return (
                            <div key={index} className="p-3 bg-blue-50 rounded-md ml-4 border-l-2 border-blue-300">
                                <p className="text-blue-700">{step}</p>
                            </div>
                        );
                    } else if (meanCalcMatch) {
                        // Se for cálculo da média
                        return (
                            <div key={index} className="p-3 bg-purple-50 rounded-md ml-4 border-l-2 border-purple-300">
                                <p className="text-purple-700 font-medium">{step}</p>
                            </div>
                        );
                    } else if (deviationMatch) {
                        // Se for cálculo dos desvios
                        return (
                            <div key={index} className="p-3 bg-teal-50 rounded-md ml-4 border-l-2 border-teal-300">
                                <p className="text-teal-700">{step}</p>
                    </div>
                        );
                    } else if (varianceMatch) {
                        // Se for cálculo da variância ou desvio padrão
                        return (
                            <div key={index} className="p-3 bg-indigo-50 rounded-md ml-4 border-l-2 border-indigo-300">
                                <p className="text-indigo-700 font-medium">{step}</p>
                    </div>
                        );
                    } else if (cvMatch) {
                        // Se for cálculo do CV
                        return (
                            <div key={index} className="p-3 bg-amber-50 rounded-md ml-4 border-l-2 border-amber-300">
                                <p className="text-amber-700 font-medium">{step}</p>
                </div>
                        );
                    } else if (interpretationMatch) {
                        // Se for a interpretação do resultado
                        return (
                            <div key={index} className="p-3 bg-green-50 rounded-md ml-4 border-l-2 border-green-300">
                                <p className="text-green-700 font-medium">{step}</p>
                    </div>
                        );
                    } else {
                        // Para outros tipos de passos
                        return (
                            <div key={index} className="p-3 bg-gray-50 rounded-md ml-4">
                                <p className="text-gray-800">{step}</p>
                    </div>
                        );
                    }
                })}
                </div>
        );
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center mb-6">
                <HiCalculator className="h-6 w-6 text-indigo-600 mr-2" />
                <h2 className="text-2xl font-bold">Coeficiente de Variação</h2>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-8">
                <p className="text-gray-700 mb-6">
                    O coeficiente de variação (CV) é uma medida de dispersão relativa que permite comparar a variabilidade de diferentes conjuntos de dados, independentemente de suas unidades de medida.
                </p>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Números (separados por vírgula):
                    </label>
                    <input
                        type="text"
                        value={numbersInput}
                        onChange={(e) => setNumbersInput(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Ex: 2.5, 3.7, 4.2, 5.1"
                    />
                </div>

                {/* Exemplos de coeficientes de variação */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Exemplos
                    </label>
                    <div className="flex flex-wrap gap-2 mb-4">
                        {getCoefficientOfVariationExamples().map((example, index) => (
                            <button
                                key={index}
                                onClick={() => applyExample(example)}
                                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-full transition-colors"
                            >
                                {example.description}
                            </button>
                        ))}
                    </div>
                </div>

                <button
                    onClick={handleSolve}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-md transition-colors duration-300"
                >
                    Calcular
                </button>

                {errorMessage && (
                    <div className="mt-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-md">
                        {errorMessage}
                    </div>
                )}
            </div>

            {result !== null && (
                <div className="space-y-6">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-5">
                        <h3 className="text-lg font-medium text-green-800 mb-2">Resultado</h3>
                        <p className="text-xl">
                            Coeficiente de Variação: <span className="font-bold">{result}%</span>
                        </p>
                        
                        <button 
                            onClick={() => setShowExplanation(!showExplanation)}
                            className="mt-4 text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center"
                        >
                            {showExplanation ? "Ocultar explicação detalhada" : "Mostrar explicação detalhada"}
                        </button>
                    </div>

                    {showExplanation && (
                        <div className="bg-white shadow-md rounded-lg p-5">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold text-gray-800 flex items-center">
                                    <HiCalculator className="h-6 w-6 mr-2 text-indigo-600" />
                                    Solução passo a passo
                                </h3>
                            </div>
                            
                            {renderExplanationSteps()}

                            <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100 overflow-hidden">
                                <div className="px-4 py-3 bg-blue-100 border-b border-blue-200">
                                    <h4 className="font-semibold text-blue-800 flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Conceito Matemático
                                    </h4>
                                </div>
                                <div className="p-4">
                                    <div className="flex flex-col md:flex-row gap-4 mb-4">
                                        <div className="flex-1">
                                            <h5 className="font-medium text-gray-800 mb-2 border-b border-gray-200 pb-1">Coeficiente de Variação (CV)</h5>
                                            <div className="space-y-3">
                                <p className="text-gray-700">
                                                    O coeficiente de variação (CV) é uma medida estatística da dispersão relativa 
                                                    dos dados em relação à média. Ele permite comparar a variabilidade de diferentes 
                                                    conjuntos de dados, independentemente de suas unidades de medida ou magnitude.
                                                </p>
                                                <div className="bg-white p-3 rounded-md border border-gray-100 shadow-sm">
                                                    <h6 className="text-indigo-700 font-medium mb-2">Fórmula</h6>
                                                    <div className="text-center font-medium text-indigo-700">
                                                        <p>CV = (σ ÷ μ) × 100%</p>
                                                        <p className="text-sm mt-1">Onde: σ é o desvio padrão e μ é a média do conjunto de dados</p>
                                                    </div>
                                                </div>
                                                <div className="p-3 bg-indigo-50 rounded-md">
                                                    <h6 className="text-indigo-700 font-medium mb-1">Classificação do CV</h6>
                                                    <ul className="text-sm list-disc list-inside text-gray-700">
                                                        <li>CV &lt; 15%: <span className="text-green-600 font-medium">Baixa dispersão</span> (dados homogêneos)</li>
                                                        <li>15% ≤ CV &lt; 30%: <span className="text-amber-600 font-medium">Média dispersão</span></li>
                                                        <li>CV ≥ 30%: <span className="text-red-600 font-medium">Alta dispersão</span> (dados heterogêneos)</li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="flex-1">
                                            <h5 className="font-medium text-gray-800 mb-2 border-b border-gray-200 pb-1">Aplicações e Vantagens</h5>
                                            <div className="p-3 bg-white rounded-md border border-gray-100 shadow-sm mb-4">
                                                <h6 className="text-indigo-700 font-medium mb-2">Contextos de Uso</h6>
                                                <ul className="text-sm space-y-2 list-disc pl-4 text-gray-700">
                                                    <li><span className="font-medium">Controle de Qualidade:</span> Avaliar a consistência de processos de produção</li>
                                                    <li><span className="font-medium">Finanças:</span> Comparar a volatilidade de diferentes investimentos</li>
                                                    <li><span className="font-medium">Ciências Biológicas:</span> Analisar variabilidade em experimentos</li>
                                                    <li><span className="font-medium">Pesquisas Sociais:</span> Avaliar a homogeneidade de respostas</li>
                                                    <li><span className="font-medium">Meteorologia:</span> Comparar variabilidade climática entre regiões</li>
                                                </ul>
                                            </div>
                                            <div className="p-3 bg-green-50 rounded-md border border-green-100">
                                                <h6 className="text-green-700 font-medium mb-2">Vantagens do CV</h6>
                                                <ul className="text-sm space-y-1 list-disc pl-4 text-gray-700">
                                                    <li>Adimensional (sem unidade de medida)</li>
                                                    <li>Permite comparar dispersão entre conjuntos de dados com médias diferentes</li>
                                                    <li>Fácil interpretação através de porcentagem</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="bg-white p-3 rounded-md border border-gray-100 shadow-sm">
                                            <h5 className="font-medium text-gray-800 mb-2">Exemplo Interpretativo</h5>
                                            <div className="space-y-2">
                                                <div className="p-2 bg-indigo-50 rounded-md">
                                                    <p className="text-sm text-indigo-700">
                                                        <span className="font-medium">Comparação de Salários em Dois Departamentos:</span>
                                                    </p>
                                                    <ul className="text-xs list-disc pl-4 mt-1 text-gray-700">
                                                        <li>Departamento A: Média de R$ 5.000, Desvio Padrão de R$ 500</li>
                                                        <li>Departamento B: Média de R$ 10.000, Desvio Padrão de R$ 1.500</li>
                                                    </ul>
                                                    <p className="text-xs mt-2 text-indigo-700">
                                                        CV Departamento A = (500 ÷ 5.000) × 100% = 10%<br />
                                                        CV Departamento B = (1.500 ÷ 10.000) × 100% = 15%<br /><br />
                                                        <span className="font-medium">Conclusão:</span> Embora o Departamento B tenha um desvio padrão maior em termos absolutos, 
                                                        o Departamento A tem salários mais homogêneos proporcionalmente à média.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-yellow-50 p-3 rounded-md border-l-4 border-yellow-400">
                                            <h5 className="font-medium text-yellow-800 mb-2">Limitações e Cuidados</h5>
                                            <ul className="text-sm space-y-2 list-disc pl-4 text-gray-700">
                                                <li>Não é adequado para conjuntos com média próxima a zero (pode gerar valores extremamente altos)</li>
                                                <li>Sensível a outliers (valores extremos)</li>
                                                <li>Para dados com distribuição não-normal, pode ser menos informativo</li>
                                                <li>Em conjuntos de dados pequenos, pode gerar interpretações enganosas</li>
                                            </ul>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-4 p-3 bg-indigo-50 rounded-md border border-indigo-100">
                                        <h5 className="font-medium text-indigo-800 mb-1 flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                            </svg>
                                            Diferença entre Amostra e População
                                        </h5>
                                        <p className="text-sm text-indigo-700">
                                            Ao calcular o CV em estatística inferencial, é importante distinguir entre dados populacionais e amostrais. 
                                            Para amostras, o desvio padrão usado no cálculo deve ser o desvio padrão amostral (com n-1 no denominador), 
                                            resultando no coeficiente de variação amostral. Isso fornece uma estimativa mais precisa do CV populacional.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ResolvedorVariacaoCoeficiente;
