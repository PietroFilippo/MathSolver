import { useState } from 'react';
import { arredondarParaDecimais } from '../utils/mathUtils';
import { HiCalculator } from 'react-icons/hi';

const ResolvedorPorcentagem: React.FC = () => {
    const [value, setValue] = useState<string>('');
    const [percentage, setPercentage] = useState<string>('');
    const [result, setResult] = useState<number | null>(null);
    const [showExplanation, setShowExplanation] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>('');

    const handleSolve = () => {
        // Reseta os resultados anteriores e erros
        setResult(null);
        setShowExplanation(false);
        setErrorMessage('');

        const numValue = parseFloat(value);
        const numPercentage = parseFloat(percentage);

        // Verifica se os valores são válidos
        if (isNaN(numValue) || isNaN(numPercentage)) {
            setErrorMessage('Digite os valores para calcular a porcentagem desejada.');
            return;
        }

        // Calcula o resultado
        const calculatedResult = (numValue * numPercentage) / 100;
        setResult(arredondarParaDecimais(calculatedResult, 2));
        setShowExplanation(true);
    };

    return (
        <div>
            <div className="flex items-center mb-6">
                <HiCalculator className="h-6 w-6 text-indigo-600 mr-2" />
                <h2 className="text-2xl font-bold">Calculadora de Porcentagem</h2>
            </div>

            <div className="mb-8">
                <p className='text-gray-700 mb-4'>
                    Calcule o valor de uma porcentagem de um número.
                </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Valor:
                    </label>
                    <input
                        type="number"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Digite o valor"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Porcentagem (%)
                    </label>
                    <input
                        type="number"
                        value={percentage}
                        onChange={(e) => setPercentage(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Digite a porcentagem"
                    />
                </div>
            </div>

            <button
                onClick={handleSolve}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-300"
            >
                Calcular
            </button>

            {errorMessage && (
                <div className="mt-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-md">
                    {errorMessage}
                </div>
            )}

            {result !== null && (
                <div className="mt-8">
                    <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
                        <h3 className="text-lg font-medium text-green-800 mb-2">Resultado</h3>
                        <p className="text-x1">
                            {percentage}% de {value} = <span className="font-bold">{result}</span>
                        </p>
                    </div>

                    {showExplanation && (
                        <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-4">
                            <h3 className="text-lg font-medium text-blue-800 mb-2">Explicação</h3>
                            <div className="space-y-2">
                                <p>Para achar a porcentagem de um número, usamos a fórmula:</p>
                                <div className="bg-white p-3 rounded-md border border-gray-200">
                                    <p className="font-medium">Porcentagem de um número = (Valor x Porcentagem) / 100</p>
                                </div>
                                <p>Substituindo os valores, temos:</p>
                                <div className="bg-white p-3 rounded-md border border-gray-200">
                                    <p>({value} x {percentage}) / 100 = {(parseFloat(value) * parseFloat(percentage)).toFixed(2)} / 100 = {result}</p>
                                </div>
                                
                                <div className="mt-4">
                                    <h4 className="font-medium text-blue-800">Por que isso funciona:</h4>
                                    <p>
                                        Porcentagens representam partes por cem. Quando dizemos "{percentage}%", 
                                        queremos dizer "{percentage} partes de 100". Para encontrar essa parte do nosso valor, 
                                        multiplicamos pela porcentagem e dividimos por 100.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ResolvedorPorcentagem;