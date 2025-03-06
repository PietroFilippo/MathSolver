import { useState } from 'react';
import { arredondarParaDecimais } from '../utils/mathUtils';
import { HiCalculator } from 'react-icons/hi';

const ResolvedorMediaAritmetica: React.FC = () => {
    const [numbers, setNumbers] = useState<string>('');
    const [result, setResult] = useState<number | null>(null);
    const [showExplanation, setShowExplanation] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [parsedNumbers, setParsedNumbers] = useState<number[]>([]);

    const handleSolve = () => {
        // Reseta os resultados anteriores e erros
        setResult(null);
        setShowExplanation(false);
        setErrorMessage('');
        setParsedNumbers([]);

        // Verifica se o campo está vazio
        if (!numbers.trim()) {
            setErrorMessage('Digite os números para calcular a média aritmética.');
            return;
        }

        // Processa a string de entrada para obter os números
        const numbersArray = numbers.split(',').map(num => num.trim());
        const parsedArray: number[] = [];
        
        // Valida cada número
        for (const num of numbersArray) {
            const parsed = parseFloat(num);
            if (isNaN(parsed)) {
                setErrorMessage('Um ou mais valores não são números válidos. Use vírgulas para separar os números.');
                return;
            }
            parsedArray.push(parsed);
        }

        if (parsedArray.length === 0) {
            setErrorMessage('Digite pelo menos um número para calcular a média.');
            return;
        }

        // Calcula a média aritmética
        const sum = parsedArray.reduce((acc, curr) => acc + curr, 0);
        const mean = sum / parsedArray.length;
        
        // Armazena os números processados para exibição
        setParsedNumbers(parsedArray);
        setResult(arredondarParaDecimais(mean, 2));
        setShowExplanation(true);
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center mb-6">
                <HiCalculator className="h-6 w-6 text-indigo-600 mr-2" />
                <h2 className="text-2xl font-bold">Calculadora de Média Aritmética</h2>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-8">
                <p className='text-gray-700 mb-6'>
                    Calcule a média aritmética de um conjunto de números.
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

            {result !== null && (
                <div className="space-y-6">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-5">
                        <h3 className="text-lg font-medium text-green-800 mb-2">Resultado</h3>
                        <p className="text-xl">
                            A média aritmética é: <span className="font-bold">{result}</span>
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
                                <div className="p-3 bg-gray-50 rounded-md">
                                    <p className="text-gray-800">Para calcular a média aritmética, usamos a fórmula:</p>
                                    <div className="bg-white p-3 rounded-md border border-gray-200 mt-2">
                                        <p className="font-medium">Média Aritmética = Soma dos valores ÷ Quantidade de valores</p>
                                    </div>
                                </div>
                                
                                <div className="p-3 bg-gray-50 rounded-md">
                                    <p className="text-gray-800">Valores utilizados: {parsedNumbers.join(', ')}</p>
                                </div>
                                
                                <div className="p-3 bg-gray-50 rounded-md">
                                    <p className="text-gray-800">Substituindo os valores, temos:</p>
                                    <div className="bg-white p-3 rounded-md border border-gray-200 mt-2">
                                        <p>Soma dos valores = {parsedNumbers.join(' + ')} = {parsedNumbers.reduce((acc, curr) => acc + curr, 0)}</p>
                                        <p>Quantidade de valores = {parsedNumbers.length}</p>
                                        <p>Média = {parsedNumbers.reduce((acc, curr) => acc + curr, 0)} ÷ {parsedNumbers.length} = {result}</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="mt-6 p-4 bg-blue-50 rounded-md">
                                <h4 className="font-medium text-blue-800 mb-2">Conceito Matemático</h4>
                                <p className="text-gray-700">
                                    A média aritmética representa o valor central de um conjunto de números. 
                                    Ela é calculada somando todos os valores e dividindo pelo número total de elementos.
                                    A média é uma medida de tendência central que nos dá uma ideia do valor "típico" do conjunto.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ResolvedorMediaAritmetica;