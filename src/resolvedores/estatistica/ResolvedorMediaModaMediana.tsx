import React, { useState } from 'react';
import { HiCalculator } from 'react-icons/hi';
import { roundToDecimals } from '../../utils/mathUtils';
import { calculateMedian, calculateMode, getCentralTendencyExamples } from '../../utils/mathUtilsEstatistica';

const ResolvedorMediaModaMediana: React.FC = () => {
    const [numbers, setNumbers] = useState<string>('');
    const [results, setResults] = useState<{
        media: number | null;
        mediana: number | null;
        moda: number[] | null;
    }>({ media: null, mediana: null, moda: null });
    const [showExplanation, setShowExplanation] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [steps, setSteps] = useState<string[]>([]);

    const handleSolve = () => {
        // Reseta os resultados anteriores e erros
        setResults({ media: null, mediana: null, moda: null });
        setShowExplanation(false);
        setErrorMessage('');
        setSteps([]);

        // Verifica se o campo está vazio
        if (!numbers.trim()) {
            setErrorMessage('Digite os números para calcular as medidas estatísticas.');
            return;
        }

        // Processa a string de entrada para obter os números
        const numbersArray = numbers.split(',').map(num => num.trim());
        const parsedArray: number[] = [];
        
        // Valida cada número
        for (const num of numbersArray) {
            const parsed = parseFloat(num);
            if (isNaN(parsed)) {
                setErrorMessage(`"${num}" não é um número válido.`);
                return;
            }
            parsedArray.push(parsed);
        }

        // Calcula todas as medidas
        const media = roundToDecimals(parsedArray.reduce((a, b) => a + b, 0) / parsedArray.length, 2);
        const mediana = roundToDecimals(calculateMedian(parsedArray), 2);
        const moda = calculateMode(parsedArray);

        setResults({
            media,
            mediana,
            moda
        });
        setShowExplanation(true);

        // Gera os passos de cálculo
        const calculationSteps = [];
        let stepCount = 1;
        
        // Passos para média
        calculationSteps.push(`Passo ${stepCount}: Identificar todos os valores da série`);
        calculationSteps.push(`Valores: ${parsedArray.join(', ')}`);
        stepCount++;
        
        calculationSteps.push(`Passo ${stepCount}: Cálculo da Média`);
        calculationSteps.push(`- Soma dos valores: ${parsedArray.join(' + ')} = ${parsedArray.reduce((a, b) => a + b, 0)}`);
        calculationSteps.push(`- Média = ${parsedArray.join(' + ')} ÷ ${parsedArray.length} = ${media}`);
        stepCount++;
        
        // Passos para mediana
        calculationSteps.push(`Passo ${stepCount}: Cálculo da Mediana`);
        const ordenados = [...parsedArray].sort((a, b) => a - b);
        calculationSteps.push(`- Valores ordenados: ${ordenados.join(', ')}`);
        if (ordenados.length % 2 === 0) {
            const pos1 = ordenados.length / 2 - 1;
            const pos2 = ordenados.length / 2;
            calculationSteps.push(`- Como há um número par de valores, mediana = (${ordenados[pos1]} + ${ordenados[pos2]}) ÷ 2 = ${mediana}`);
        } else {
            const pos = Math.floor(ordenados.length / 2);
            calculationSteps.push(`- Como há um número ímpar de valores, mediana = ${ordenados[pos]}`);
        }
        stepCount++;

        // Passos para moda
        calculationSteps.push(`Passo ${stepCount}: Cálculo da Moda`);
        if (moda.length === 0) {
            calculationSteps.push('- Não há moda (todos os valores aparecem a mesma quantidade de vezes)');
        } else {
            calculationSteps.push(`- Moda: ${moda.join(', ')}`);
        }
        
        setSteps(calculationSteps);
    };

    // Função para aplicar um exemplo
    const applyExample = (example: { data: number[] }) => {
        setNumbers(example.data.join(', '));
    };

    // Função que renderiza os passos com estilização aprimorada
    const renderExplanationSteps = () => {
        return (
            <div className="space-y-4">
                {steps.map((step, index) => {
                    // Verifica se o passo começa com um padrão de número de passo como "Passo X:"
                    const stepMatch = step.match(/^(Passo \d+:)(.*)$/);
                    
                    // Verifica se o passo contém informações sobre os valores
                    const valuesMatch = step.startsWith('Valores:');
                    
                    // Verifica se o passo mostra cálculos específicos
                    const calculationMatch = step.startsWith('- Soma dos valores:') || 
                                           step.startsWith('- Média =');
                    
                    // Verifica se o passo mostra ordenação ou identificação de valores
                    const orderingMatch = step.startsWith('- Valores ordenados:');
                    
                    // Verifica se o passo explica o cálculo da mediana
                    const medianExplanationMatch = step.includes('Como há um número');
                    
                    // Verifica se o passo é específico da moda
                    const modeMatch = step.startsWith('- Moda:') || 
                                    step.includes('Não há moda');
                    
                    // Aplica estilização específica por tipo de passo
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
                    } else if (valuesMatch) {
                        // Se for listagem de valores
                        return (
                            <div key={index} className="p-3 bg-blue-50 rounded-md ml-4 border-l-2 border-blue-300">
                                <p className="text-blue-700">{step}</p>
                            </div>
                        );
                    } else if (calculationMatch) {
                        // Se for um cálculo matemático
                        return (
                            <div key={index} className="p-3 bg-purple-50 rounded-md ml-4 border-l-2 border-purple-300">
                                <p className="text-purple-700">{step}</p>
                            </div>
                        );
                    } else if (orderingMatch) {
                        // Se for ordenação de valores
                        return (
                            <div key={index} className="p-3 bg-indigo-50 rounded-md ml-4 border-l-2 border-indigo-300">
                                <p className="text-indigo-700">{step}</p>
                            </div>
                        );
                    } else if (medianExplanationMatch) {
                        // Se for explicação da mediana
                        return (
                            <div key={index} className="p-3 bg-green-50 rounded-md ml-4 border-l-2 border-green-300">
                                <p className="text-green-700 font-medium">{step}</p>
                            </div>
                        );
                    } else if (modeMatch) {
                        // Se for resultado da moda
                        return (
                            <div key={index} className="p-3 bg-amber-50 rounded-md ml-4 border-l-2 border-amber-300">
                                <p className="text-amber-700 font-medium">{step}</p>
                            </div>
                        );
                    } else {
                        // Conteúdo regular sem classificação específica
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
                <h2 className="text-2xl font-bold">Média, Moda e Mediana</h2>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-8">
                <p className="text-gray-700 mb-6">
                    Calcule a média, mediana e moda de um conjunto de números.
                </p>
                
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Números (separados por vírgula):
                    </label>
                    <input
                        type="text"
                        value={numbers}
                        onChange={(e) => setNumbers(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Ex: 10, 15, 20, 25"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                        Digite os números separados por vírgula. Ex: 10, 15, 20, 25
                    </p>
                </div>

                {/* Exemplos de conjuntos de dados */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Exemplos
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {getCentralTendencyExamples().map((example, index) => (
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
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-md transition-colors duration-300 mt-4"
                >
                    Calcular
                </button>

                {errorMessage && (
                    <div className="mt-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-md">
                        {errorMessage}
                    </div>
                )}
            </div>

            {results.media !== null && (
                <div className="space-y-6">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-5">
                        <h3 className="text-lg font-medium text-green-800 mb-2">Resultados</h3>
                        <div className="space-y-2">
                            <p className="text-xl">
                                Média: <span className="font-bold">{results.media}</span>
                            </p>
                            <p className="text-xl">
                                Mediana: <span className="font-bold">{results.mediana}</span>
                            </p>
                            <p className="text-xl">
                                Moda: <span className="font-bold">
                                    {results.moda && results.moda.length > 0 ? results.moda.join(', ') : 'Não há moda'}
                                </span>
                            </p>
                        </div>
                        
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
                                            <h5 className="font-medium text-gray-800 mb-2 border-b border-gray-200 pb-1">Medidas de Tendência Central</h5>
                                            <p className="text-gray-700 mb-3">
                                                As medidas de tendência central são valores que representam o centro ou valor típico 
                                                de um conjunto de dados. As três principais medidas são a média, a mediana e a moda.
                                            </p>
                                            
                                            <div className="space-y-3 mt-4">
                                                <div className="bg-white p-3 rounded-md border border-gray-100 shadow-sm">
                                                    <h6 className="text-indigo-700 font-medium mb-2">Média Aritmética</h6>
                                                    <div className="text-center font-medium text-indigo-700 mb-2">
                                                        <p>μ = (x₁ + x₂ + ... + xₙ) ÷ n = Σxᵢ ÷ n</p>
                                                    </div>
                                                    <p className="text-sm text-gray-700">
                                                        É calculada somando todos os valores e dividindo pelo número total de valores. 
                                                        É muito utilizada, mas pode ser sensível a valores extremos (outliers).
                                                    </p>
                                                </div>
                                                
                                                <div className="bg-white p-3 rounded-md border border-gray-100 shadow-sm">
                                                    <h6 className="text-indigo-700 font-medium mb-2">Mediana</h6>
                                                    <p className="text-sm text-gray-700">
                                                        É o valor que divide um conjunto ordenado de dados em duas partes iguais.
                                                        Para encontrá-la, primeiro ordenamos os valores e então:
                                                    </p>
                                                    <ul className="text-xs list-disc pl-5 mt-2 text-gray-700">
                                                        <li>Se o número de valores é ímpar, a mediana é o valor central</li>
                                                        <li>Se o número de valores é par, a mediana é a média dos dois valores centrais</li>
                                                    </ul>
                                                </div>
                                                
                                                <div className="bg-white p-3 rounded-md border border-gray-100 shadow-sm">
                                                    <h6 className="text-indigo-700 font-medium mb-2">Moda</h6>
                                                    <p className="text-sm text-gray-700">
                                                        É o valor que aparece com maior frequência em um conjunto de dados.
                                                        Um conjunto pode:
                                                    </p>
                                                    <ul className="text-xs list-disc pl-5 mt-2 text-gray-700">
                                                        <li>Não ter moda (quando todos os valores aparecem o mesmo número de vezes)</li>
                                                        <li>Ser unimodal (ter apenas uma moda)</li>
                                                        <li>Ser multimodal (ter mais de uma moda)</li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="flex-1">
                                            <h5 className="font-medium text-gray-800 mb-2 border-b border-gray-200 pb-1">Comparação e Aplicações</h5>
                                            
                                            <div className="p-3 bg-white rounded-md border border-gray-100 shadow-sm mb-4">
                                                <h6 className="text-indigo-700 font-medium mb-2">Quando Usar Cada Medida</h6>
                                                <div className="space-y-2">
                                                    <div className="p-2 bg-blue-50 rounded-md">
                                                        <span className="font-medium text-blue-700">Média</span>
                                                        <ul className="text-xs list-disc pl-4 mt-1 text-gray-700">
                                                            <li>Melhor para dados com distribuição simétrica</li>
                                                            <li>Útil para cálculos estatísticos adicionais</li>
                                                            <li>Considera todos os valores do conjunto</li>
                                                        </ul>
                                                    </div>
                                                    <div className="p-2 bg-purple-50 rounded-md">
                                                        <span className="font-medium text-purple-700">Mediana</span>
                                                        <ul className="text-xs list-disc pl-4 mt-1 text-gray-700">
                                                            <li>Melhor para dados assimétricos ou com outliers</li>
                                                            <li>Ideal para distribuições de renda, preços de casas</li>
                                                            <li>Não é afetada por valores extremos</li>
                                                        </ul>
                                                    </div>
                                                    <div className="p-2 bg-green-50 rounded-md">
                                                        <span className="font-medium text-green-700">Moda</span>
                                                        <ul className="text-xs list-disc pl-4 mt-1 text-gray-700">
                                                            <li>Melhor para dados categóricos</li>
                                                            <li>Útil para identificar tamanhos mais comuns, preferências</li>
                                                            <li>Única medida aplicável a dados não numéricos</li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="p-3 bg-yellow-50 rounded-md border-l-4 border-yellow-400">
                                                <h6 className="font-medium text-yellow-800 mb-1">Exemplos de Aplicações</h6>
                                                <ul className="text-sm space-y-1 list-disc pl-4 text-gray-700">
                                                    <li><span className="font-medium">Média:</span> Notas escolares, altura média, temperatura média</li>
                                                    <li><span className="font-medium">Mediana:</span> Salários, preços de imóveis, tempo de espera</li>
                                                    <li><span className="font-medium">Moda:</span> Tamanho de roupas mais vendido, cor preferida, produto mais popular</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="bg-white p-3 rounded-md border border-gray-100 shadow-sm">
                                            <h5 className="font-medium text-gray-800 mb-2">Relações entre as Medidas</h5>
                                            <div className="space-y-2">
                                                <div className="p-3 bg-indigo-50 rounded-md">
                                                    <h6 className="font-medium text-indigo-700 mb-1">Distribuição Simétrica</h6>
                                                    <p className="text-sm text-gray-700">
                                                        Em uma distribuição perfeitamente simétrica, a média, mediana e moda coincidem.
                                                    </p>
                                                </div>
                                                <div className="p-3 bg-indigo-50 rounded-md">
                                                    <h6 className="font-medium text-indigo-700 mb-1">Distribuição Assimétrica Positiva</h6>
                                                    <p className="text-sm text-gray-700">
                                                        Moda {"<"} Mediana {"<"} Média
                                                        <br />
                                                        (cauda à direita, ex: distribuição de renda)
                                                    </p>
                                                </div>
                                                <div className="p-3 bg-indigo-50 rounded-md">
                                                    <h6 className="font-medium text-indigo-700 mb-1">Distribuição Assimétrica Negativa</h6>
                                                    <p className="text-sm text-gray-700">
                                                        Média {"<"} Mediana {"<"} Moda
                                                        <br />
                                                        (cauda à esquerda, ex: idade de falecimento)
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-3 bg-indigo-50 rounded-md border border-indigo-100">
                                            <h5 className="font-medium text-indigo-800 mb-2 flex items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                                </svg>
                                                Dicas de Interpretação
                                            </h5>
                                            <ul className="text-sm space-y-2 list-disc pl-4 text-indigo-700">
                                                <li>Use múltiplas medidas para obter uma visão mais completa dos dados</li>
                                                <li>Sempre considere o contexto ao interpretar as medidas estatísticas</li>
                                                <li>Analise as medidas de tendência central junto com medidas de dispersão (como desvio padrão)</li>
                                                <li>Gráficos como histogramas e box plots podem complementar a análise destas medidas</li>
                                            </ul>
                                        </div>
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

export default ResolvedorMediaModaMediana;
