import { useState } from 'react';
import { HiCalculator } from 'react-icons/hi';
import { mmc, mdc } from '../utils/mathUtils';

const ResolvedorMMCMDC: React.FC = () => {
    const [numbers, setNumbers] = useState<string>('');
    const [operationType, setOperationType] = useState<'mmc' | 'mdc'>('mmc');
    const [result, setResult] = useState<number | null>(null);
    const [showExplanation, setShowExplanation] = useState<boolean>(true);
    const [calculationSteps, setCalculationSteps] = useState<string[]>([]);
    const [errorMessage, setErrorMessage] = useState<string>('');

    const handleSolve = () => {
        // Reseta os resultados anteriores e erros
        setResult(null);
        setCalculationSteps([]);
        setErrorMessage('');

        // Processa a entrada de valores
        const numbersArray = numbers.split(',')
            .map(num => num.trim())
            .filter(Boolean)
            .map(num => parseInt(num, 10));

        // Valida os valores
        if (numbersArray.length < 2) {
            setErrorMessage('Por favor, insira pelo menos dois números separados por vírgula.');
            return;
        }

        if (numbersArray.some(num => isNaN(num) || num <= 0)) {
            setErrorMessage('Por favor, insira apenas números inteiros positivos.');
            return;
        }

        // Calcula o resultado
        let calculatedResult: number;
        if (operationType === 'mmc') {
            calculatedResult = calcularMMCMultiplo(numbersArray);
            setCalculationSteps(gerarPassosMultiplos(numbersArray, 'mmc'));
        } else {
            calculatedResult = calcularMDCMultiplo(numbersArray);
            setCalculationSteps(gerarPassosMultiplos(numbersArray, 'mdc'));
        }

        setResult(calculatedResult);
        setShowExplanation(true);
    };

    // Função para calcular o MDC de múltiplos números
    const calcularMDCMultiplo = (nums: number[]): number => {
        if (nums.length === 0) return 0;
        if (nums.length === 1) return nums[0];
        
        let result = nums[0];
        for (let i = 1; i < nums.length; i++) {
            result = mdc(result, nums[i]);
        }
        return result;
    };

    // Função para calcular o MMC de múltiplos números
    const calcularMMCMultiplo = (nums: number[]): number => {
        if (nums.length === 0) return 0;
        if (nums.length === 1) return nums[0];
        
        let result = nums[0];
        for (let i = 1; i < nums.length; i++) {
            result = mmc(result, nums[i]);
        }
        return result;
    };

    // Gera os passos de cálculo do MDC usando o algoritmo de Euclides
    const gerarPassosMDC = (a: number, b: number): string[] => {
        const calculationSteps: string[] = [];
        
        calculationSteps.push(`Passo 1: Usaremos o Algoritmo de Euclides para calcular o MDC de ${a} e ${b}.`);
        
        if (a < b) {
            // Troca a e b para garantir que a >= b
            [a, b] = [b, a];
            calculationSteps.push(`Passo 2: Como ${a} > ${b}, podemos proceder diretamente.`);
        } else {
            calculationSteps.push(`Passo 2: Como ${a} >= ${b}, podemos proceder diretamente.`);
        }
        
        let stepCount = 3;
        let remainder;
        
        // Aplica o algoritmo de Euclides
        while (b !== 0) {
            remainder = a % b;
            calculationSteps.push(`Passo ${stepCount}: Dividimos ${a} por ${b} e obtemos quociente ${Math.floor(a / b)} e resto ${remainder}.`);
            a = b;
            b = remainder;
            stepCount++;
        }
        
        calculationSteps.push(`Passo ${stepCount}: O resto é zero, então o MDC é ${a}.`);
        
        return calculationSteps;
    };

    // Gera passos para múltiplos números
    const gerarPassosMultiplos = (nums: number[], tipo: 'mmc' | 'mdc'): string[] => {
        const calculationSteps: string[] = [];
        
        if (tipo === 'mmc') {
            calculationSteps.push(`Passo 1: Vamos calcular o MMC dos números: ${nums.join(', ')}.`);
        } else {
            calculationSteps.push(`Passo 1: Vamos calcular o MDC dos números: ${nums.join(', ')}.`);
        }
        
        if (nums.length === 2) {
            // Para dois números, usamos o algoritmo direto
            const a = nums[0];
            const b = nums[1];
            
            if (tipo === 'mmc') {
                calculationSteps.push(`Passo 2: Para calcular o MMC de ${a} e ${b}, usaremos a fórmula: MMC(a,b) = (a * b) / MDC(a,b).`);
                const mdcValue = mdc(a, b);
                const mmcValue = (a * b) / mdcValue;
                calculationSteps.push(`Passo 3: Calculamos o MDC de ${a} e ${b}, que é ${mdcValue}.`);
                calculationSteps.push(`Passo 4: Aplicamos a fórmula: MMC(${a},${b}) = (${a} * ${b}) / ${mdcValue} = ${a * b} / ${mdcValue} = ${mmcValue}.`);
                calculationSteps.push(`O MMC de ${a} e ${b} é ${mmcValue}.`);
            } else {
                // Usamos o algoritmo de Euclides para o MDC
                const mdcSteps = gerarPassosMDC(a, b);
                calculationSteps.push(...mdcSteps.map((step, index) => 
                    index === 0 ? `Passo 2: ${step.substring(8)}` : step));
            }
        } else {
            // Para mais de dois números, calculamos par a par
            if (tipo === 'mmc') {
                calculationSteps.push(`Passo 2: Para calcular o MMC de múltiplos números, calcularemos o MMC dos dois primeiros e, em seguida, o MMC desse resultado com o próximo número, e assim por diante.`);
                
                let currentMMC = nums[0];
                for (let i = 1; i < nums.length; i++) {
                    calculationSteps.push(`Passo ${i + 2}: Calculamos o MMC de ${currentMMC} e ${nums[i]}.`);
                    
                    const mdcValue = mdc(currentMMC, nums[i]);
                    const mmcValue = (currentMMC * nums[i]) / mdcValue;
                    
                    calculationSteps.push(`  - O MDC de ${currentMMC} e ${nums[i]} é ${mdcValue}.`);
                    calculationSteps.push(`  - MMC(${currentMMC},${nums[i]}) = (${currentMMC} * ${nums[i]}) / ${mdcValue} = ${currentMMC * nums[i]} / ${mdcValue} = ${mmcValue}.`);
                    
                    currentMMC = mmcValue;
                }
                
                calculationSteps.push(`Portanto, o MMC de ${nums.join(', ')} é ${currentMMC}.`);
            } else {
                calculationSteps.push(`Passo 2: Para calcular o MDC de múltiplos números, calcularemos o MDC dos dois primeiros e, em seguida, o MDC desse resultado com o próximo número, e assim por diante.`);
                
                let currentMDC = nums[0];
                for (let i = 1; i < nums.length; i++) {
                    calculationSteps.push(`Passo ${i + 2}: Calculamos o MDC de ${currentMDC} e ${nums[i]}.`);
                    
                    // Adicionamos passos detalhados do algoritmo de Euclides
                    let a = currentMDC;
                    let b = nums[i];
                    
                    if (a < b) {
                        [a, b] = [b, a];
                        calculationSteps.push(`  - Como ${b} > ${a}, trocamos para ter ${a} >= ${b}.`);
                    }
                    
                    // Aplica o algoritmo de Euclides
                    while (b !== 0) {
                        const remainder = a % b;
                        calculationSteps.push(`  - Dividimos ${a} por ${b} e obtemos resto ${remainder}.`);
                        a = b;
                        b = remainder;
                    }
                    
                    currentMDC = a;
                    calculationSteps.push(`  - O MDC de ${currentMDC} e ${nums[i]} é ${currentMDC}.`);
                }
                
                calculationSteps.push(`Portanto, o MDC de ${nums.join(', ')} é ${currentMDC}.`);
            }
        }
        
        return calculationSteps;
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center mb-6">
                <HiCalculator className="h-6 w-6 text-indigo-600 mr-2" />
                <h2 className="text-2xl font-bold">Calculadora de MMC e MDC</h2>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-8">
                <p className="text-gray-700 mb-6">
                    Calcule o Mínimo Múltiplo Comum (MMC) ou o Máximo Divisor Comum (MDC) de dois ou mais números inteiros positivos.
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
                        placeholder="Ex: 12, 18, 24"
                    />
                </div>

                <div className="mb-6">
                    <p className="block text-sm font-medium text-gray-700 mb-2">Tipo de cálculo:</p>
                    <div className="flex flex-wrap gap-4">
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                checked={operationType === 'mmc'}
                                onChange={() => setOperationType('mmc')}
                                className="form-radio text-indigo-600"
                            />
                            <span className="ml-2">MMC - Mínimo Múltiplo Comum</span>
                        </label>
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                checked={operationType === 'mdc'}
                                onChange={() => setOperationType('mdc')}
                                className="form-radio text-indigo-600"
                            />
                            <span className="ml-2">MDC - Máximo Divisor Comum</span>
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
                            O {operationType === 'mmc' ? 'MMC' : 'MDC'} de {numbers} é: <span className="font-bold">{result}</span>
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
                                {calculationSteps.map((step, index) => {
                                    // Verifica se o passo começa com um padrão de número de passo como "Passo X:"
                                    const stepMatch = step.match(/^(Passo \d+:)(.*)$/);
                                    
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
                                    } else {
                                        // Conteúdo regular sem número de passo
                                        return (
                                            <div key={index} className="p-3 bg-white border border-gray-200 rounded-md">
                                                <p className="text-gray-800">{step}</p>
                                            </div>
                                        );
                                    }
                                })}
                            </div>
                            
                            <div className="mt-6 p-4 bg-blue-50 rounded-md">
                                <h4 className="font-medium text-blue-800 mb-2">Conceito Matemático</h4>
                                {operationType === 'mmc' && (
                                    <p className="text-gray-700">
                                        O Mínimo Múltiplo Comum (MMC) de dois ou mais números é o menor número positivo que é múltiplo de todos eles.
                                        Ele representa o menor número que pode ser dividido por todos os números dados sem deixar resto.
                                        O MMC é amplamente utilizado quando precisamos trabalhar com frações que têm denominadores diferentes.
                                    </p>
                                )}
                                {operationType === 'mdc' && (
                                    <p className="text-gray-700">
                                        O Máximo Divisor Comum (MDC) de dois ou mais números é o maior número inteiro que divide todos eles sem deixar resto.
                                        Ele representa o maior fator comum entre os números. O MDC é frequentemente usado para simplificar frações
                                        e resolver problemas que envolvem distribuição igual de itens.
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

export default ResolvedorMMCMDC; 