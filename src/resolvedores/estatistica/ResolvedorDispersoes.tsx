import { useState } from 'react';
import { HiCalculator } from 'react-icons/hi';
import { arredondarParaDecimais } from '../../utils/mathUtils';
import { calcularDesvioMedio, calcularVariancia, calcularDesvioPadrao } from '../../utils/mathUtilsEstatistica';

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
        switch (operationType) {
            case 'desvioMedio':
                calculatedResult = calcularDesvioMedio(parsedArray);
                break;
            case 'variancia':
                calculatedResult = calcularVariancia(parsedArray);
                break;
            case 'desvioPadrao':
                calculatedResult = calcularDesvioPadrao(parsedArray);
                break;
        }

        setResult(calculatedResult);
        setShowExplanation(true);
    };

    const gerarPassosExplicacao = () => {
        if (!numbers.trim()) return null;

        const numbersArray = numbers.split(',').map(num => parseFloat(num.trim()));
        const media = arredondarParaDecimais(
            numbersArray.reduce((acc, curr) => acc + curr, 0) / numbersArray.length,
            4
        );
        let stepCount = 1;

        if (operationType === 'desvioMedio') {
            return (
                <>
                    <div className="p-3 bg-gray-50 rounded-md border-l-4 border-indigo-500">
                        <div className="flex flex-col sm:flex-row">
                            <span className="font-bold text-indigo-700 mr-2 mb-1 sm:mb-0">
                                Passo {stepCount++}:
                            </span>
                            <p className="text-gray-800">Calcular a média aritmética dos valores.</p>
                        </div>
                        <div className="bg-white p-3 rounded-md border border-gray-200 mt-2">
                            <p>Média = {media}</p>
                        </div>
                    </div>

                    <div className="p-3 bg-gray-50 rounded-md border-l-4 border-indigo-500">
                        <div className="flex flex-col sm:flex-row">
                            <span className="font-bold text-indigo-700 mr-2 mb-1 sm:mb-0">
                                Passo {stepCount++}:
                            </span>
                            <p className="text-gray-800">Calcular o desvio absoluto de cada valor em relação à média.</p>
                        </div>
                        <div className="bg-white p-3 rounded-md border border-gray-200 mt-2">
                            {numbersArray.map((num, index) => (
                                <p key={index}>|{num} - {media}| = {arredondarParaDecimais(Math.abs(num - media), 4)}</p>
                            ))}
                        </div>
                    </div>

                    <div className="p-3 bg-gray-50 rounded-md border-l-4 border-indigo-500">
                        <div className="flex flex-col sm:flex-row">
                            <span className="font-bold text-indigo-700 mr-2 mb-1 sm:mb-0">
                                Passo {stepCount++}:
                            </span>
                            <p className="text-gray-800">Calcular a média dos desvios absolutos.</p>
                        </div>
                        <div className="bg-white p-3 rounded-md border border-gray-200 mt-2">
                            <p>Desvio Médio = {result}</p>
                        </div>
                    </div>
                </>
            );
        } else if (operationType === 'variancia') {
            return (
                <>
                    <div className="p-3 bg-gray-50 rounded-md border-l-4 border-indigo-500">
                        <div className="flex flex-col sm:flex-row">
                            <span className="font-bold text-indigo-700 mr-2 mb-1 sm:mb-0">
                                Passo {stepCount++}:
                            </span>
                            <p className="text-gray-800">Calcular a média aritmética dos valores.</p>
                        </div>
                        <div className="bg-white p-3 rounded-md border border-gray-200 mt-2">
                            <p>Média = {media}</p>
                        </div>
                    </div>

                    <div className="p-3 bg-gray-50 rounded-md border-l-4 border-indigo-500">
                        <div className="flex flex-col sm:flex-row">
                            <span className="font-bold text-indigo-700 mr-2 mb-1 sm:mb-0">
                                Passo {stepCount++}:
                            </span>
                            <p className="text-gray-800">Calcular o quadrado dos desvios em relação à média.</p>
                        </div>
                        <div className="bg-white p-3 rounded-md border border-gray-200 mt-2">
                            {numbersArray.map((num, index) => (
                                <p key={index}>({num} - {media})² = {arredondarParaDecimais(Math.pow(num - media, 2), 4)}</p>
                            ))}
                        </div>
                    </div>

                    <div className="p-3 bg-gray-50 rounded-md border-l-4 border-indigo-500">
                        <div className="flex flex-col sm:flex-row">
                            <span className="font-bold text-indigo-700 mr-2 mb-1 sm:mb-0">
                                Passo {stepCount++}:
                            </span>
                            <p className="text-gray-800">Calcular a média dos quadrados dos desvios.</p>
                        </div>
                        <div className="bg-white p-3 rounded-md border border-gray-200 mt-2">
                            <p>Variância = {result}</p>
                        </div>
                    </div>
                </>
            );
        } else {
            return (
                <>
                    <div className="p-3 bg-gray-50 rounded-md border-l-4 border-indigo-500">
                        <div className="flex flex-col sm:flex-row">
                            <span className="font-bold text-indigo-700 mr-2 mb-1 sm:mb-0">
                                Passo {stepCount++}:
                            </span>
                            <p className="text-gray-800">Calcular a variância dos valores.</p>
                        </div>
                        <div className="bg-white p-3 rounded-md border border-gray-200 mt-2">
                            <p>Variância = {arredondarParaDecimais(calcularVariancia(numbersArray), 4)}</p>
                        </div>
                    </div>

                    <div className="p-3 bg-gray-50 rounded-md border-l-4 border-indigo-500">
                        <div className="flex flex-col sm:flex-row">
                            <span className="font-bold text-indigo-700 mr-2 mb-1 sm:mb-0">
                                Passo {stepCount++}:
                            </span>
                            <p className="text-gray-800">Calcular a raiz quadrada da variância.</p>
                        </div>
                        <div className="bg-white p-3 rounded-md border border-gray-200 mt-2">
                            <p>Desvio Padrão = √{arredondarParaDecimais(calcularVariancia(numbersArray), 4)} = {result}</p>
                        </div>
                    </div>
                </>
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

                            <div className="space-y-4">
                                {gerarPassosExplicacao()}
                            </div>

                            <div className="mt-6 p-4 bg-blue-50 rounded-md">
                                <h4 className="font-medium text-blue-800 mb-2">Conceito Matemático</h4>
                                {operationType === 'desvioMedio' && (
                                    <p className="text-gray-700">
                                        O Desvio Médio é uma medida de dispersão que representa a média das diferenças
                                        absolutas entre cada valor e a média aritmética do conjunto de dados.
                                        Quanto maior o desvio médio, maior a variabilidade dos dados.
                                    </p>
                                )}
                                {operationType === 'variancia' && (
                                    <p className="text-gray-700">
                                        A Variância é uma medida de dispersão que indica o quão distante os valores
                                        estão da média. É calculada como a média dos quadrados das diferenças entre
                                        cada valor e a média aritmética do conjunto de dados.
                                    </p>
                                )}
                                {operationType === 'desvioPadrao' && (
                                    <p className="text-gray-700">
                                        O Desvio Padrão é a raiz quadrada da variância e representa a dispersão dos
                                        valores em relação à média. É muito utilizado por ter a mesma unidade de medida
                                        dos dados originais, facilitando a interpretação.
                                    </p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ResolvedorDispersoes;
