import React, { useState } from 'react';
import { HiCalculator } from 'react-icons/hi';
import { roundToDecimals } from '../../utils/mathUtils';
import { 
    calculateMeanDeviation, 
    calculateVariance, 
    calculateStandardDeviation,
    getDispersionExamples
} from '../../utils/mathUtilsEstatistica';

const ResolvedorDispersoes: React.FC = () => {
    const [numbers, setNumbers] = useState<string>('');
    const [result, setResult] = useState<number | null>(null);
    const [showExplanation, setShowExplanation] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [operationType, setOperationType] = useState<'desvioMedio' | 'variancia' | 'desvioPadrao'>('desvioMedio');

    const handleSolve = () => {
        setResult(null);
        setShowExplanation(false);
        setErrorMessage('');

        if (!numbers.trim()) {
            setErrorMessage('Digite os números para calcular as medidas de dispersão.');
            return;
        }

        const numbersArray = numbers.split(',').map(num => num.trim());
        const parsedArray: number[] = [];
        
        for (const num of numbersArray) {
            const parsed = parseFloat(num);
            if (isNaN(parsed)) {
                setErrorMessage(`"${num}" não é um número válido.`);
                return;
            }
            parsedArray.push(parsed);
        }

        if (parsedArray.length < 2) {
            setErrorMessage('Digite pelo menos dois números para calcular as medidas de dispersão.');
            return;
        }

        let calculatedResult: number;
        if (operationType === 'desvioMedio') {
            calculatedResult = calculateMeanDeviation(parsedArray);
        } else if (operationType === 'variancia') {
            calculatedResult = calculateVariance(parsedArray);
        } else {
            calculatedResult = calculateStandardDeviation(parsedArray);
        }

        setResult(calculatedResult);
        setShowExplanation(true);
    };

    // Função para aplicar um exemplo
    const applyExample = (example: { data: number[], type: 'desvioMedio' | 'variancia' | 'desvioPadrao' }) => {
        setNumbers(example.data.join(', '));
        setOperationType(example.type);
    };

    // Filtra exemplos por tipo de operação
    const getFilteredExamples = () => {
        return getDispersionExamples().filter(example => example.type === operationType);
    };

    // Função para renderizar os passos com estilização aprimorada
    const renderExplanationSteps = () => {
        if (!numbers.trim()) return null;

        const numbersArray = numbers.split(',').map(num => parseFloat(num.trim()));
        const media = roundToDecimals(
            numbersArray.reduce((acc, curr) => acc + curr, 0) / numbersArray.length,
            4
        );
        let stepCount = 1;

        if (operationType === 'desvioMedio') {
            return (
                <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-md border-l-4 border-indigo-500">
                        <div className="flex flex-col sm:flex-row">
                            <span className="font-bold text-indigo-700 mr-2 mb-1 sm:mb-0">
                                Passo {stepCount++}:
                            </span>
                            <p className="text-gray-800">Calcular a média aritmética dos valores.</p>
                        </div>
                        <div className="mt-2 p-3 bg-blue-50 rounded-md border-l-2 border-blue-300">
                            <p className="text-blue-700">Média = ({numbersArray.join(' + ')}) ÷ {numbersArray.length} = {media}</p>
                        </div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-md border-l-4 border-indigo-500">
                        <div className="flex flex-col sm:flex-row">
                            <span className="font-bold text-indigo-700 mr-2 mb-1 sm:mb-0">
                                Passo {stepCount++}:
                            </span>
                            <p className="text-gray-800">Calcular o desvio absoluto de cada valor em relação à média.</p>
                        </div>
                        <div className="mt-2 p-3 bg-purple-50 rounded-md border-l-2 border-purple-300">
                            {numbersArray.map((num, index) => (
                                <p key={index} className="text-purple-700">|{num} - {media}| = {roundToDecimals(Math.abs(num - media), 4)}</p>
                            ))}
                        </div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-md border-l-4 border-indigo-500">
                        <div className="flex flex-col sm:flex-row">
                            <span className="font-bold text-indigo-700 mr-2 mb-1 sm:mb-0">
                                Passo {stepCount++}:
                            </span>
                            <p className="text-gray-800">Calcular a média dos desvios absolutos.</p>
                        </div>
                        <div className="mt-2 p-3 bg-green-50 rounded-md border-l-2 border-green-300">
                            <p className="text-green-700 font-medium">Desvio Médio = {result}</p>
                        </div>
                    </div>
                </div>
            );
        } else if (operationType === 'variancia') {
            return (
                <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-md border-l-4 border-indigo-500">
                        <div className="flex flex-col sm:flex-row">
                            <span className="font-bold text-indigo-700 mr-2 mb-1 sm:mb-0">
                                Passo {stepCount++}:
                            </span>
                            <p className="text-gray-800">Calcular a média aritmética dos valores.</p>
                        </div>
                        <div className="mt-2 p-3 bg-blue-50 rounded-md border-l-2 border-blue-300">
                            <p className="text-blue-700">Média = ({numbersArray.join(' + ')}) ÷ {numbersArray.length} = {media}</p>
                        </div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-md border-l-4 border-indigo-500">
                        <div className="flex flex-col sm:flex-row">
                            <span className="font-bold text-indigo-700 mr-2 mb-1 sm:mb-0">
                                Passo {stepCount++}:
                            </span>
                            <p className="text-gray-800">Calcular o quadrado dos desvios em relação à média.</p>
                        </div>
                        <div className="mt-2 p-3 bg-purple-50 rounded-md border-l-2 border-purple-300">
                            {numbersArray.map((num, index) => (
                                <p key={index} className="text-purple-700">({num} - {media})² = {roundToDecimals(Math.pow(num - media, 2), 4)}</p>
                            ))}
                        </div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-md border-l-4 border-indigo-500">
                        <div className="flex flex-col sm:flex-row">
                            <span className="font-bold text-indigo-700 mr-2 mb-1 sm:mb-0">
                                Passo {stepCount++}:
                            </span>
                            <p className="text-gray-800">Calcular a média dos quadrados dos desvios.</p>
                        </div>
                        <div className="mt-2 p-3 bg-green-50 rounded-md border-l-2 border-green-300">
                            <p className="text-green-700 font-medium">Variância = {roundToDecimals(calculateVariance(numbersArray), 4)}</p>
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-md border-l-4 border-indigo-500">
                        <div className="flex flex-col sm:flex-row">
                            <span className="font-bold text-indigo-700 mr-2 mb-1 sm:mb-0">
                                Passo {stepCount++}:
                            </span>
                            <p className="text-gray-800">Calcular a variância dos valores.</p>
                        </div>
                        <div className="mt-2 p-3 bg-blue-50 rounded-md border-l-2 border-blue-300">
                            <p className="text-blue-700">Variância = {roundToDecimals(calculateVariance(numbersArray), 4)}</p>
                        </div>
                        <div className="mt-2 p-3 bg-indigo-50 rounded-md border-l-2 border-indigo-300">
                            <p className="text-indigo-700">A variância é calculada como a média dos quadrados das diferenças entre cada valor e a média.</p>
                        </div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-md border-l-4 border-indigo-500">
                        <div className="flex flex-col sm:flex-row">
                            <span className="font-bold text-indigo-700 mr-2 mb-1 sm:mb-0">
                                Passo {stepCount++}:
                            </span>
                            <p className="text-gray-800">Calcular a raiz quadrada da variância.</p>
                        </div>
                        <div className="mt-2 p-3 bg-green-50 rounded-md border-l-2 border-green-300">
                            <p className="text-green-700 font-medium">Desvio Padrão = √{roundToDecimals(calculateVariance(numbersArray), 4)} = {result}</p>
                        </div>
                    </div>
                </div>
            );
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center mb-6">
                <HiCalculator className="h-6 w-6 text-indigo-600 mr-2" />
                <h2 className="text-2xl font-bold">Calculadora de Medidas de Dispersão</h2>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-8">
                <p className="text-gray-700 mb-6">
                    Calcule o Desvio Médio, Variância e Desvio Padrão de um conjunto de números.
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

                <div className="mb-6">
                    <p className="block text-sm font-medium text-gray-700 mb-2">Tipo de cálculo:</p>
                    <div className="flex flex-wrap gap-4">
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                checked={operationType === 'desvioMedio'}
                                onChange={() => setOperationType('desvioMedio')}
                                className="form-radio text-indigo-600"
                            />
                            <span className="ml-2">Desvio Médio</span>
                        </label>
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                checked={operationType === 'variancia'}
                                onChange={() => setOperationType('variancia')}
                                className="form-radio text-indigo-600"
                            />
                            <span className="ml-2">Variância</span>
                        </label>
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                checked={operationType === 'desvioPadrao'}
                                onChange={() => setOperationType('desvioPadrao')}
                                className="form-radio text-indigo-600"
                            />
                            <span className="ml-2">Desvio Padrão</span>
                        </label>
                    </div>
                </div>

                {/* Exemplos de conjuntos de dados */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Exemplos
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {getFilteredExamples().map((example, index) => (
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
                            {operationType === 'desvioMedio' && (
                                <>O Desvio Médio é: <span className="font-bold">{result}</span></>
                            )}
                            {operationType === 'variancia' && (
                                <>A Variância é: <span className="font-bold">{result}</span></>
                            )}
                            {operationType === 'desvioPadrao' && (
                                <>O Desvio Padrão é: <span className="font-bold">{result}</span></>
                            )}
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
                                            <h5 className="font-medium text-gray-800 mb-2 border-b border-gray-200 pb-1">
                                                {operationType === 'desvioMedio' && 'Desvio Médio'}
                                                {operationType === 'variancia' && 'Variância'}
                                                {operationType === 'desvioPadrao' && 'Desvio Padrão'}
                                            </h5>
                                            
                                            {operationType === 'desvioMedio' && (
                                                <div className="space-y-3">
                                                    <p className="text-gray-700">
                                                        O Desvio Médio é uma medida de dispersão que representa a média das diferenças
                                                        absolutas entre cada valor e a média aritmética do conjunto de dados.
                                                    </p>
                                                    <div className="bg-white p-3 rounded-md border border-gray-100 shadow-sm">
                                                        <h6 className="text-indigo-700 font-medium mb-2">Fórmula</h6>
                                                        <div className="text-center font-medium text-indigo-700">
                                                            <p>DM = Σ|x<sub>i</sub> - μ| / n</p>
                                                            <p className="text-sm mt-1">Onde μ é a média e n é o número de valores</p>
                                                        </div>
                                                    </div>
                                                    <div className="p-3 bg-indigo-50 rounded-md">
                                                        <p className="text-sm text-indigo-700">
                                                            <span className="font-medium">Interpretação:</span> Quanto maior o desvio médio, 
                                                            maior a variabilidade dos dados em relação à média.
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                            
                                            {operationType === 'variancia' && (
                                                <div className="space-y-3">
                                                    <p className="text-gray-700">
                                                        A Variância é uma medida de dispersão que indica o quão distante os valores
                                                        estão da média. É calculada como a média dos quadrados das diferenças entre
                                                        cada valor e a média aritmética do conjunto de dados.
                                                    </p>
                                                    <div className="bg-white p-3 rounded-md border border-gray-100 shadow-sm">
                                                        <h6 className="text-indigo-700 font-medium mb-2">Fórmula</h6>
                                                        <div className="text-center font-medium text-indigo-700">
                                                            <p>σ² = Σ(x<sub>i</sub> - μ)² / n</p>
                                                            <p className="text-sm mt-1">Onde μ é a média e n é o número de valores</p>
                                                        </div>
                                                    </div>
                                                    <div className="p-3 bg-indigo-50 rounded-md">
                                                        <p className="text-sm text-indigo-700">
                                                            <span className="font-medium">Por que elevamos ao quadrado?</span> Para eliminar 
                                                            valores negativos e dar mais peso a valores que estão mais distantes da média.
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                            
                                            {operationType === 'desvioPadrao' && (
                                                <div className="space-y-3">
                                                    <p className="text-gray-700">
                                                        O Desvio Padrão é a raiz quadrada da variância e representa a dispersão dos
                                                        valores em relação à média. É muito utilizado por ter a mesma unidade de medida
                                                        dos dados originais, facilitando a interpretação.
                                                    </p>
                                                    <div className="bg-white p-3 rounded-md border border-gray-100 shadow-sm">
                                                        <h6 className="text-indigo-700 font-medium mb-2">Fórmula</h6>
                                                        <div className="text-center font-medium text-indigo-700">
                                                            <p>σ = √σ² = √[Σ(x<sub>i</sub> - μ)² / n]</p>
                                                            <p className="text-sm mt-1">Onde μ é a média e n é o número de valores</p>
                                                        </div>
                                                    </div>
                                                    <div className="p-3 bg-indigo-50 rounded-md">
                                                        <p className="text-sm text-indigo-700">
                                                            <span className="font-medium">Curva Normal:</span> Em uma distribuição normal, 
                                                            aproximadamente 68% dos dados estão a até 1 desvio padrão da média.
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        
                                        <div className="flex-1">
                                            <h5 className="font-medium text-gray-800 mb-2 border-b border-gray-200 pb-1">Aplicações e Interpretação</h5>
                                            <div className="p-3 bg-white rounded-md border border-gray-100 shadow-sm">
                                                <h6 className="text-indigo-700 font-medium mb-2">Contextos de Uso</h6>
                                                <ul className="text-sm space-y-2 list-disc pl-4 text-gray-700">
                                                    <li><span className="font-medium">Análise de Dados:</span> Identificar a dispersão em conjuntos de dados</li>
                                                    <li><span className="font-medium">Qualidade:</span> Controle de qualidade em processos industriais</li>
                                                    <li><span className="font-medium">Finanças:</span> Medir a volatilidade de ativos financeiros</li>
                                                    <li><span className="font-medium">Ciência:</span> Quantificar a precisão de medições</li>
                                                    <li><span className="font-medium">Pesquisas:</span> Avaliar a consistência de respostas</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="bg-white p-3 rounded-md border border-gray-100 shadow-sm">
                                            <h5 className="font-medium text-gray-800 mb-2">Comparação entre Medidas</h5>
                                            <div className="space-y-2">
                                                <div className="p-2 bg-indigo-50 rounded-md">
                                                    <span className="font-medium text-indigo-700">Desvio Médio:</span>
                                                    <p className="text-sm mt-1">Fácil de entender, mas menos utilizado em inferência estatística</p>
                                                </div>
                                                <div className="p-2 bg-indigo-50 rounded-md">
                                                    <span className="font-medium text-indigo-700">Variância:</span>
                                                    <p className="text-sm mt-1">Amplamente usada em modelos estatísticos, mas difícil de interpretar por ter unidade ao quadrado</p>
                                                </div>
                                                <div className="p-2 bg-indigo-50 rounded-md">
                                                    <span className="font-medium text-indigo-700">Desvio Padrão:</span>
                                                    <p className="text-sm mt-1">Combina as vantagens matemáticas da variância com a interpretabilidade do desvio médio</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-yellow-50 p-3 rounded-md border-l-4 border-yellow-400">
                                            <h5 className="font-medium text-yellow-800 mb-2">Dicas de Interpretação</h5>
                                            <ul className="text-sm space-y-2 list-disc pl-4 text-gray-700">
                                                <li>Valores próximos de zero indicam dados pouco dispersos (homogêneos)</li>
                                                <li>Valores altos indicam grande variabilidade nos dados</li>
                                                <li>Compare o desvio padrão com a média: um desvio padrão maior que metade da média geralmente indica alta dispersão</li>
                                                <li>Considere usar o coeficiente de variação (CV = σ/μ) para comparar a dispersão entre conjuntos de dados com médias diferentes</li>
                                            </ul>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-4 p-3 bg-indigo-50 rounded-md border border-indigo-100">
                                        <h5 className="font-medium text-indigo-800 mb-1 flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                            </svg>
                                            Importante Saber
                                        </h5>
                                        <p className="text-sm text-indigo-700">
                                            Em estatística, diferenciamos entre medidas amostrais (quando calculamos baseado em uma amostra) e populacionais (quando temos todos os dados). 
                                            Para variância e desvio padrão amostrais, usamos n-1 como divisor em vez de n, resultando em uma estimativa não-enviesada.
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

export default ResolvedorDispersoes;
