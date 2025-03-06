import { useState } from 'react';
import { arredondarParaDecimais } from '../utils/mathUtils';
import { HiCalculator } from 'react-icons/hi';

const ResolvedorPorcentagem: React.FC = () => {
    const [value, setValue] = useState<string>('');
    const [percentage, setPercentage] = useState<string>('');
    const [result, setResult] = useState<number | null>(null);
    const [showExplanation, setShowExplanation] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [operationType, setOperationType] = useState<'percentage' | 'percentageChange' | 'reversePercentage'>('percentage');

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
        let calculatedResult: number;
        
        switch (operationType) {
            case 'percentage':
                calculatedResult = (numValue * numPercentage) / 100;
                break;
            case 'percentageChange':
                calculatedResult = ((numPercentage - numValue) / numValue) * 100;
                break;
            case 'reversePercentage':
                calculatedResult = (numValue * 100) / numPercentage;
                break;
        }
        
        setResult(arredondarParaDecimais(calculatedResult, 2));
        setShowExplanation(true);
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center mb-6">
                <HiCalculator className="h-6 w-6 text-indigo-600 mr-2" />
                <h2 className="text-2xl font-bold">Calculadora de Porcentagem</h2>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-8">
                <p className='text-gray-700 mb-6'>
                    Calcule o valor de uma porcentagem de um número.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
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
                        <label className="block text-sm font-medium text-gray-700 mb-2">
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

                <div className="mb-6">
                    <p className="block text-sm font-medium text-gray-700 mb-2">Tipo de cálculo:</p>
                    <div className="flex flex-wrap gap-4">
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                checked={operationType === 'percentage'}
                                onChange={() => setOperationType('percentage')}
                                className="form-radio text-indigo-600"
                            />
                            <span className="ml-2">Valor da porcentagem</span>
                        </label>
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                checked={operationType === 'percentageChange'}
                                onChange={() => setOperationType('percentageChange')}
                                className="form-radio text-indigo-600"
                            />
                            <span className="ml-2">Variação percentual</span>
                        </label>
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                checked={operationType === 'reversePercentage'}
                                onChange={() => setOperationType('reversePercentage')}
                                className="form-radio text-indigo-600"
                            />
                            <span className="ml-2">Cálculo reverso</span>
                        </label>
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

            {result !== null && (
                <div className="space-y-6">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-5">
                        <h3 className="text-lg font-medium text-green-800 mb-2">Resultado</h3>
                        <p className="text-xl">
                            {operationType === 'percentage' && (
                                <>O resultado de {percentage}% de {value} é: <span className="font-bold">{result}</span></>
                            )}
                            {operationType === 'percentageChange' && (
                                <>A variação percentual de {value} para {percentage} é: <span className="font-bold">{result}%</span></>
                            )}
                            {operationType === 'reversePercentage' && (
                                <>O valor do qual {value} representa {percentage}% é: <span className="font-bold">{result}</span></>
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
                                {operationType === 'percentage' && (
                                    <>
                                        <div className="p-3 bg-gray-50 rounded-md border-l-4 border-indigo-500">
                                            <div className="flex flex-col sm:flex-row">
                                                <span className="font-bold text-indigo-700 mr-2 mb-1 sm:mb-0">
                                                    Passo 1:
                                                </span>
                                                <p className="text-gray-800">Compreender a fórmula para calcular a porcentagem de um número.</p>
                                            </div>
                                            <div className="bg-white p-3 rounded-md border border-gray-200 mt-2">
                                                <p className="font-medium">Porcentagem de um número = (Valor x Porcentagem) / 100</p>
                                            </div>
                                        </div>
                                        
                                        <div className="p-3 bg-gray-50 rounded-md border-l-4 border-indigo-500">
                                            <div className="flex flex-col sm:flex-row">
                                                <span className="font-bold text-indigo-700 mr-2 mb-1 sm:mb-0">
                                                    Passo 2:
                                                </span>
                                                <p className="text-gray-800">Substituir os valores na fórmula.</p>
                                            </div>
                                            <div className="bg-white p-3 rounded-md border border-gray-200 mt-2">
                                                <p>({value} x {percentage}) / 100</p>
                                            </div>
                                        </div>
                                        
                                        <div className="p-3 bg-gray-50 rounded-md border-l-4 border-indigo-500">
                                            <div className="flex flex-col sm:flex-row">
                                                <span className="font-bold text-indigo-700 mr-2 mb-1 sm:mb-0">
                                                    Passo 3:
                                                </span>
                                                <p className="text-gray-800">Multiplicar o valor pela porcentagem.</p>
                                            </div>
                                            <div className="bg-white p-3 rounded-md border border-gray-200 mt-2">
                                                <p>{value} x {percentage} = {(parseFloat(value) * parseFloat(percentage)).toFixed(2)}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="p-3 bg-gray-50 rounded-md border-l-4 border-indigo-500">
                                            <div className="flex flex-col sm:flex-row">
                                                <span className="font-bold text-indigo-700 mr-2 mb-1 sm:mb-0">
                                                    Passo 4:
                                                </span>
                                                <p className="text-gray-800">Dividir o resultado por 100.</p>
                                            </div>
                                            <div className="bg-white p-3 rounded-md border border-gray-200 mt-2">
                                                <p>{(parseFloat(value) * parseFloat(percentage)).toFixed(2)} / 100 = {result}</p>
                                            </div>
                                        </div>
                                    </>
                                )}

                                {operationType === 'percentageChange' && (
                                    <>
                                        <div className="p-3 bg-gray-50 rounded-md border-l-4 border-indigo-500">
                                            <div className="flex flex-col sm:flex-row">
                                                <span className="font-bold text-indigo-700 mr-2 mb-1 sm:mb-0">
                                                    Passo 1:
                                                </span>
                                                <p className="text-gray-800">Compreender a fórmula para calcular a variação percentual.</p>
                                            </div>
                                            <div className="bg-white p-3 rounded-md border border-gray-200 mt-2">
                                                <p className="font-medium">Variação percentual = ((Valor Final - Valor Inicial) / Valor Inicial) x 100</p>
                                            </div>
                                        </div>
                                        
                                        <div className="p-3 bg-gray-50 rounded-md border-l-4 border-indigo-500">
                                            <div className="flex flex-col sm:flex-row">
                                                <span className="font-bold text-indigo-700 mr-2 mb-1 sm:mb-0">
                                                    Passo 2:
                                                </span>
                                                <p className="text-gray-800">Calcular a diferença entre o valor final e o valor inicial.</p>
                                            </div>
                                            <div className="bg-white p-3 rounded-md border border-gray-200 mt-2">
                                                <p>{percentage} - {value} = {(parseFloat(percentage) - parseFloat(value)).toFixed(2)}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="p-3 bg-gray-50 rounded-md border-l-4 border-indigo-500">
                                            <div className="flex flex-col sm:flex-row">
                                                <span className="font-bold text-indigo-700 mr-2 mb-1 sm:mb-0">
                                                    Passo 3:
                                                </span>
                                                <p className="text-gray-800">Dividir a diferença pelo valor inicial.</p>
                                            </div>
                                            <div className="bg-white p-3 rounded-md border border-gray-200 mt-2">
                                                <p>{(parseFloat(percentage) - parseFloat(value)).toFixed(2)} / {value} = {((parseFloat(percentage) - parseFloat(value)) / parseFloat(value)).toFixed(4)}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="p-3 bg-gray-50 rounded-md border-l-4 border-indigo-500">
                                            <div className="flex flex-col sm:flex-row">
                                                <span className="font-bold text-indigo-700 mr-2 mb-1 sm:mb-0">
                                                    Passo 4:
                                                </span>
                                                <p className="text-gray-800">Multiplicar o resultado por 100 para obter a percentagem.</p>
                                            </div>
                                            <div className="bg-white p-3 rounded-md border border-gray-200 mt-2">
                                                <p>{((parseFloat(percentage) - parseFloat(value)) / parseFloat(value)).toFixed(4)} x 100 = {result}%</p>
                                            </div>
                                        </div>
                                    </>
                                )}

                                {operationType === 'reversePercentage' && (
                                    <>
                                        <div className="p-3 bg-gray-50 rounded-md border-l-4 border-indigo-500">
                                            <div className="flex flex-col sm:flex-row">
                                                <span className="font-bold text-indigo-700 mr-2 mb-1 sm:mb-0">
                                                    Passo 1:
                                                </span>
                                                <p className="text-gray-800">Compreender a fórmula para o cálculo reverso de porcentagem.</p>
                                            </div>
                                            <div className="bg-white p-3 rounded-md border border-gray-200 mt-2">
                                                <p className="font-medium">Se X é Y% de Z, então Z = (X * 100) / Y</p>
                                            </div>
                                        </div>
                                        
                                        <div className="p-3 bg-gray-50 rounded-md border-l-4 border-indigo-500">
                                            <div className="flex flex-col sm:flex-row">
                                                <span className="font-bold text-indigo-700 mr-2 mb-1 sm:mb-0">
                                                    Passo 2:
                                                </span>
                                                <p className="text-gray-800">Multiplicar o valor conhecido por 100.</p>
                                            </div>
                                            <div className="bg-white p-3 rounded-md border border-gray-200 mt-2">
                                                <p>{value} x 100 = {(parseFloat(value) * 100).toFixed(2)}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="p-3 bg-gray-50 rounded-md border-l-4 border-indigo-500">
                                            <div className="flex flex-col sm:flex-row">
                                                <span className="font-bold text-indigo-700 mr-2 mb-1 sm:mb-0">
                                                    Passo 3:
                                                </span>
                                                <p className="text-gray-800">Dividir pelo valor da porcentagem.</p>
                                            </div>
                                            <div className="bg-white p-3 rounded-md border border-gray-200 mt-2">
                                                <p>{(parseFloat(value) * 100).toFixed(2)} / {percentage} = {result}</p>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                            
                            <div className="mt-6 p-4 bg-blue-50 rounded-md">
                                <h4 className="font-medium text-blue-800 mb-2">Conceito Matemático</h4>
                                {operationType === 'percentage' && (
                                    <p className="text-gray-700">
                                        Porcentagens representam partes por cem. Quando dizemos "{percentage}%", 
                                        queremos dizer "{percentage} partes de 100". Para encontrar essa parte do nosso valor, 
                                        multiplicamos pela porcentagem e dividimos por 100.
                                    </p>
                                )}
                                {operationType === 'percentageChange' && (
                                    <p className="text-gray-700">
                                        A variação percentual mede quanto um valor mudou em relação ao valor original, expressa em porcentagem.
                                        Um resultado positivo indica aumento, enquanto um resultado negativo indica diminuição.
                                        Esta medida é amplamente utilizada em economia, finanças e análises estatísticas.
                                    </p>
                                )}
                                {operationType === 'reversePercentage' && (
                                    <p className="text-gray-700">
                                        O cálculo reverso de porcentagem nos permite encontrar o valor original quando conhecemos 
                                        uma parte percentual desse valor. Por exemplo, se sabemos que 15 é 25% de algum número, 
                                        podemos calcular esse número dividindo 15 por 0,25 (ou multiplicando por 100 e dividindo por 25).
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

export default ResolvedorPorcentagem;