import { useState } from 'react';
import { roundToDecimals } from '../../utils/mathUtils';
import { getPercentageExamples } from '../../utils/mathUtilsTeoriaNumeros';
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
        
        setResult(roundToDecimals(calculatedResult, 2));
        setShowExplanation(true);
    };

    // Função para aplicar um exemplo
    const applyExample = (example: { value: number, percentage: number, type: 'percentage' | 'percentageChange' | 'reversePercentage' }) => {
        setValue(example.value.toString());
        setPercentage(example.percentage.toString());
        setOperationType(example.type);
    };

    // Filtra exemplos por tipo de operação
    const getFilteredExamples = () => {
        return getPercentageExamples().filter(example => example.type === operationType);
    };

    // Função que gera os passos com numeração dinâmica e estilização aprimorada
    const renderExplanationSteps = () => {
        let stepCount = 1;
        
        if (operationType === 'percentage') {
            return (
                <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-md border-l-4 border-indigo-500">
                        <div className="flex flex-col sm:flex-row">
                            <span className="font-bold text-indigo-700 mr-2 mb-1 sm:mb-0">
                                Passo {stepCount++}:
                            </span>
                            <p className="text-gray-800">Compreender a fórmula para calcular a porcentagem de um número.</p>
                        </div>
                        <div className="mt-2 p-3 bg-indigo-50 rounded-md border-l-2 border-indigo-300">
                            <p className="font-medium text-indigo-700">Porcentagem de um número = (Valor x Porcentagem) / 100</p>
                        </div>
                    </div>
                    
                    <div className="p-4 bg-gray-50 rounded-md border-l-4 border-indigo-500">
                        <div className="flex flex-col sm:flex-row">
                            <span className="font-bold text-indigo-700 mr-2 mb-1 sm:mb-0">
                                Passo {stepCount++}:
                            </span>
                            <p className="text-gray-800">Substituir os valores na fórmula.</p>
                        </div>
                        <div className="mt-2 p-3 bg-blue-50 rounded-md border-l-2 border-blue-300">
                            <p className="text-blue-700">({value} x {percentage}) / 100</p>
                        </div>
                    </div>
                    
                    <div className="p-4 bg-gray-50 rounded-md border-l-4 border-indigo-500">
                        <div className="flex flex-col sm:flex-row">
                            <span className="font-bold text-indigo-700 mr-2 mb-1 sm:mb-0">
                                Passo {stepCount++}:
                            </span>
                            <p className="text-gray-800">Multiplicar o valor pela porcentagem.</p>
                        </div>
                        <div className="mt-2 p-3 bg-purple-50 rounded-md border-l-2 border-purple-300">
                            <p className="text-purple-700">{value} x {percentage} = {(parseFloat(value) * parseFloat(percentage)).toFixed(2)}</p>
                        </div>
                    </div>
                    
                    <div className="p-4 bg-gray-50 rounded-md border-l-4 border-indigo-500">
                        <div className="flex flex-col sm:flex-row">
                            <span className="font-bold text-indigo-700 mr-2 mb-1 sm:mb-0">
                                Passo {stepCount++}:
                            </span>
                            <p className="text-gray-800">Dividir o resultado por 100 para obter a porcentagem.</p>
                        </div>
                        <div className="mt-2 p-3 bg-green-50 rounded-md border-l-2 border-green-300">
                            <p className="text-green-700 font-medium">{(parseFloat(value) * parseFloat(percentage)).toFixed(2)} ÷ 100 = {result}</p>
                        </div>
                    </div>
                </div>
            );
        } 
        else if (operationType === 'percentageChange') {
            return (
                <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-md border-l-4 border-indigo-500">
                        <div className="flex flex-col sm:flex-row">
                            <span className="font-bold text-indigo-700 mr-2 mb-1 sm:mb-0">
                                Passo {stepCount++}:
                            </span>
                            <p className="text-gray-800">Compreender a fórmula para calcular a variação percentual.</p>
                        </div>
                        <div className="mt-2 p-3 bg-indigo-50 rounded-md border-l-2 border-indigo-300">
                            <p className="font-medium text-indigo-700">Variação Percentual = ((Valor Final - Valor Inicial) / Valor Inicial) × 100</p>
                        </div>
                    </div>
                    
                    <div className="p-4 bg-gray-50 rounded-md border-l-4 border-indigo-500">
                        <div className="flex flex-col sm:flex-row">
                            <span className="font-bold text-indigo-700 mr-2 mb-1 sm:mb-0">
                                Passo {stepCount++}:
                            </span>
                            <p className="text-gray-800">Substitua os valores na fórmula.</p>
                        </div>
                        <div className="mt-2 p-3 bg-blue-50 rounded-md border-l-2 border-blue-300">
                            <p className="text-blue-700">((${percentage} - ${value}) / ${value}) × 100</p>
                        </div>
                    </div>
                    
                    <div className="p-4 bg-gray-50 rounded-md border-l-4 border-indigo-500">
                        <div className="flex flex-col sm:flex-row">
                            <span className="font-bold text-indigo-700 mr-2 mb-1 sm:mb-0">
                                Passo {stepCount++}:
                            </span>
                            <p className="text-gray-800">Realize o cálculo da variação percentual.</p>
                        </div>
                        <div className="mt-2 p-3 bg-purple-50 rounded-md border-l-2 border-purple-300">
                            <p className="text-purple-700">({parseFloat(percentage)} - {parseFloat(value)}) / {parseFloat(value)} = {(parseFloat(percentage) - parseFloat(value)) / parseFloat(value)}</p>
                        </div>
                        <div className="mt-2 p-3 bg-green-50 rounded-md border-l-2 border-green-300">
                            <p className="text-green-700 font-medium">{(parseFloat(percentage) - parseFloat(value)) / parseFloat(value)} × 100 = {result}%</p>
                        </div>
                    </div>
                </div>
            );
        }
        else {
            return (
                <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-md border-l-4 border-indigo-500">
                        <div className="flex flex-col sm:flex-row">
                            <span className="font-bold text-indigo-700 mr-2 mb-1 sm:mb-0">
                                Passo {stepCount++}:
                            </span>
                            <p className="text-gray-800">Compreender a fórmula para calcular o valor original com base na porcentagem.</p>
                        </div>
                        <div className="mt-2 p-3 bg-indigo-50 rounded-md border-l-2 border-indigo-300">
                            <p className="font-medium text-indigo-700">Valor Original = (Valor conhecido × 100) / Porcentagem</p>
                        </div>
                    </div>
                    
                    <div className="p-4 bg-gray-50 rounded-md border-l-4 border-indigo-500">
                        <div className="flex flex-col sm:flex-row">
                            <span className="font-bold text-indigo-700 mr-2 mb-1 sm:mb-0">
                                Passo {stepCount++}:
                            </span>
                            <p className="text-gray-800">Substituir os valores na fórmula.</p>
                        </div>
                        <div className="mt-2 p-3 bg-blue-50 rounded-md border-l-2 border-blue-300">
                            <p className="text-blue-700">({value} × 100) / {percentage}</p>
                        </div>
                    </div>
                    
                    <div className="p-4 bg-gray-50 rounded-md border-l-4 border-indigo-500">
                        <div className="flex flex-col sm:flex-row">
                            <span className="font-bold text-indigo-700 mr-2 mb-1 sm:mb-0">
                                Passo {stepCount++}:
                            </span>
                            <p className="text-gray-800">Realizar o cálculo.</p>
                        </div>
                        <div className="mt-2 p-3 bg-purple-50 rounded-md border-l-2 border-purple-300">
                            <p className="text-purple-700">{parseFloat(value)} × 100 = {parseFloat(value) * 100}</p>
                        </div>
                        <div className="mt-2 p-3 bg-green-50 rounded-md border-l-2 border-green-300">
                            <p className="text-green-700 font-medium">{parseFloat(value) * 100} / {parseFloat(percentage)} = {result}</p>
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

                {/* Exemplos de porcentagem */}
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
                                                {operationType === 'percentage' && 'Porcentagem Básica'}
                                                {operationType === 'percentageChange' && 'Variação Percentual'}
                                                {operationType === 'reversePercentage' && 'Cálculo Reverso de Porcentagem'}
                                            </h5>
                                            
                                {operationType === 'percentage' && (
                                                <div className="space-y-3">
                                    <p className="text-gray-700">
                                                        Porcentagens representam partes por cem. Quando dizemos "<span className="font-medium">{percentage}%</span>", 
                                                        queremos dizer "{percentage} partes de 100".
                                                    </p>
                                                    <div className="bg-white p-3 rounded-md border border-gray-100 shadow-sm">
                                                        <h6 className="text-indigo-700 font-medium mb-2">Fórmula Básica</h6>
                                                        <div className="text-center font-medium text-indigo-700">
                                                            <p>Valor da porcentagem = (Valor × Porcentagem) ÷ 100</p>
                                                        </div>
                                                    </div>
                                                    <div className="p-3 bg-indigo-50 rounded-md">
                                                        <p className="text-sm text-indigo-700">
                                                            <span className="font-medium">Exemplo:</span> Para calcular 25% de 80:
                                                            <br />
                                                            (80 × 25) ÷ 100 = 2000 ÷ 100 = 20
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                            
                                {operationType === 'percentageChange' && (
                                                <div className="space-y-3">
                                    <p className="text-gray-700">
                                        A variação percentual mede quanto um valor mudou em relação ao valor original, expressa em porcentagem.
                                        Um resultado positivo indica aumento, enquanto um resultado negativo indica diminuição.
                                                    </p>
                                                    <div className="bg-white p-3 rounded-md border border-gray-100 shadow-sm">
                                                        <h6 className="text-indigo-700 font-medium mb-2">Fórmula</h6>
                                                        <div className="text-center font-medium text-indigo-700">
                                                            <p>Variação % = ((Valor Final - Valor Inicial) ÷ Valor Inicial) × 100</p>
                                                        </div>
                                                    </div>
                                                    <div className="p-3 bg-indigo-50 rounded-md">
                                                        <p className="text-sm text-indigo-700">
                                                            <span className="font-medium">Exemplo:</span> Se um preço aumentou de R$80 para R$100:
                                                            <br />
                                                            ((100 - 80) ÷ 80) × 100 = (20 ÷ 80) × 100 = 0,25 × 100 = 25%
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                            
                                {operationType === 'reversePercentage' && (
                                                <div className="space-y-3">
                                    <p className="text-gray-700">
                                        O cálculo reverso de porcentagem nos permite encontrar o valor original quando conhecemos 
                                                        uma parte percentual desse valor.
                                                    </p>
                                                    <div className="bg-white p-3 rounded-md border border-gray-100 shadow-sm">
                                                        <h6 className="text-indigo-700 font-medium mb-2">Fórmula</h6>
                                                        <div className="text-center font-medium text-indigo-700">
                                                            <p>Valor Original = (Valor Conhecido × 100) ÷ Porcentagem</p>
                                                        </div>
                                                    </div>
                                                    <div className="p-3 bg-indigo-50 rounded-md">
                                                        <p className="text-sm text-indigo-700">
                                                            <span className="font-medium">Exemplo:</span> Se R$20 é 25% de um valor:
                                                            <br />
                                                            (20 × 100) ÷ 25 = 2000 ÷ 25 = 80
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        
                                        <div className="flex-1">
                                            <h5 className="font-medium text-gray-800 mb-2 border-b border-gray-200 pb-1">Aplicações</h5>
                                            <div className="p-3 bg-white rounded-md border border-gray-100 shadow-sm">
                                                <h6 className="text-indigo-700 font-medium mb-2">Contextos de Uso</h6>
                                                <ul className="text-sm space-y-2 list-disc pl-4 text-gray-700">
                                                    <li><span className="font-medium">Comércio:</span> Descontos, margens de lucro e aumentos de preço</li>
                                                    <li><span className="font-medium">Finanças:</span> Juros, investimentos e taxas de crescimento</li>
                                                    <li><span className="font-medium">Estatística:</span> Análise de dados, crescimento populacional</li>
                                                    <li><span className="font-medium">Ciências:</span> Concentrações, probabilidades e composições</li>
                                                    <li><span className="font-medium">Cotidiano:</span> Impostos, gorjetas e controle orçamentário</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="bg-white p-3 rounded-md border border-gray-100 shadow-sm">
                                            <h5 className="font-medium text-gray-800 mb-2">Conversões Úteis</h5>
                                            <div className="space-y-2">
                                                <div className="p-2 bg-indigo-50 rounded-md flex items-center">
                                                    <div className="mr-2 w-16 text-center flex-shrink-0">
                                                        <span className="font-mono text-indigo-700">10%</span>
                                                    </div>
                                                    <span className="text-sm">= dividir por 10</span>
                                                </div>
                                                <div className="p-2 bg-indigo-50 rounded-md flex items-center">
                                                    <div className="mr-2 w-16 text-center flex-shrink-0">
                                                        <span className="font-mono text-indigo-700">25%</span>
                                                    </div>
                                                    <span className="text-sm">= dividir por 4</span>
                                                </div>
                                                <div className="p-2 bg-indigo-50 rounded-md flex items-center">
                                                    <div className="mr-2 w-16 text-center flex-shrink-0">
                                                        <span className="font-mono text-indigo-700">50%</span>
                                                    </div>
                                                    <span className="text-sm">= dividir por 2</span>
                                                </div>
                                                <div className="p-2 bg-indigo-50 rounded-md flex items-center">
                                                    <div className="mr-2 w-16 text-center flex-shrink-0">
                                                        <span className="font-mono text-indigo-700">100%</span>
                                                    </div>
                                                    <span className="text-sm">= valor original</span>
                                                </div>
                                                <div className="p-2 bg-indigo-50 rounded-md flex items-center">
                                                    <div className="mr-2 w-16 text-center flex-shrink-0">
                                                        <span className="font-mono text-indigo-700">200%</span>
                                                    </div>
                                                    <span className="text-sm">= multiplicar por 2</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-yellow-50 p-3 rounded-md border-l-4 border-yellow-400">
                                            <h5 className="font-medium text-yellow-800 mb-2">Dicas de Cálculo</h5>
                                            <ul className="text-sm space-y-2 list-disc pl-4 text-gray-700">
                                                <li>Para calcular mentalmente porcentagens, tente decompor: 15% = 10% + 5%</li>
                                                <li>Um aumento de X% seguido de uma redução de X% <strong>não</strong> retorna ao valor original</li>
                                                <li>Para converter uma fração em porcentagem, divida o numerador pelo denominador e multiplique por 100</li>
                                                <li>0,1 = 10%, 0,01 = 1%, 0,001 = 0,1% (mova a vírgula duas casas para a direita)</li>
                                            </ul>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-4 p-3 bg-indigo-50 rounded-md border border-indigo-100">
                                        <h5 className="font-medium text-indigo-800 mb-1 flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                            </svg>
                                            Curiosidade Matemática
                                        </h5>
                                        <p className="text-sm text-indigo-700">
                                            A palavra "porcentagem" vem do latim "per centum", que significa "por cento" ou "a cada cem". O símbolo % que usamos hoje foi desenvolvido a partir de uma abreviação da expressão "per cento" (p. cento), que eventualmente se transformou no símbolo que conhecemos.
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

export default ResolvedorPorcentagem;