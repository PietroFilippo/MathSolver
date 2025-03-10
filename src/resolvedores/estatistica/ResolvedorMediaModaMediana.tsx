import { useState } from 'react';
import { arredondarParaDecimais, calcularMediana, calcularModa } from '../../utils/mathUtils';
import { HiCalculator } from 'react-icons/hi';

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
        const sum = parsedArray.reduce((acc, curr) => acc + curr, 0);
        const media = arredondarParaDecimais(sum / parsedArray.length, 2);
        const mediana = arredondarParaDecimais(calcularMediana(parsedArray), 2);
        const moda = calcularModa(parsedArray);

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
        calculationSteps.push(`- Soma dos valores: ${parsedArray.join(' + ')} = ${sum}`);
        calculationSteps.push(`- Média = ${sum} ÷ ${parsedArray.length} = ${media}`);
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
                            
                            <div className="space-y-4">
                                {steps.map((step, index) => {
                                    const stepMatch = step.match(/^(Passo \d+:)(.*)$/);
                                    
                                    if (stepMatch) {
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
                                    } else {
                                        return (
                                            <div key={index} className="p-3 bg-gray-50 rounded-md ml-4">
                                                {step}
                                            </div>
                                        );
                                    }
                                })}
                            </div>

                            <div className="mt-6 p-4 bg-blue-50 rounded-md">
                                <h4 className="font-medium text-blue-800 mb-2">Conceito Matemático</h4>
                                <div className="space-y-4 text-gray-700">
                                    <div>
                                        <h5 className="font-medium mb-2">Média Aritmética</h5>
                                        <p>
                                            A média aritmética é uma medida de tendência central que representa o valor típico de um conjunto de dados. 
                                            É calculada somando todos os valores e dividindo pelo número total de valores. 
                                            É muito utilizada, mas pode ser sensível a valores extremos (outliers).
                                        </p>
                                    </div>

                                    <div>
                                        <h5 className="font-medium mb-2">Mediana</h5>
                                        <p>
                                            A mediana é o valor que divide um conjunto ordenado de dados em duas partes iguais. 
                                            Para encontrá-la, primeiro ordenamos os valores e então:
                                        </p>
                                        <ul className="list-disc pl-5 mt-2">
                                            <li>Se o número de valores é ímpar, a mediana é o valor central</li>
                                            <li>Se o número de valores é par, a mediana é a média dos dois valores centrais</li>
                                        </ul>
                                        <p className="mt-2">
                                            A mediana é menos sensível a valores extremos que a média, sendo mais adequada para conjuntos de dados com outliers.
                                        </p>
                                    </div>

                                    <div>
                                        <h5 className="font-medium mb-2">Moda</h5>
                                        <p>
                                            A moda é o valor que aparece com maior frequência em um conjunto de dados. 
                                            Um conjunto pode:
                                        </p>
                                        <ul className="list-disc pl-5 mt-2">
                                            <li>Não ter moda (quando todos os valores aparecem o mesmo número de vezes)</li>
                                            <li>Ser unimodal (ter apenas uma moda)</li>
                                            <li>Ser multimodal (ter mais de uma moda)</li>
                                        </ul>
                                        <p className="mt-2">
                                            A moda é especialmente útil para identificar os valores mais comuns em um conjunto de dados, 
                                            sendo a única medida de tendência central que pode ser usada com dados categóricos.
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

export default ResolvedorMediaModaMediana;
