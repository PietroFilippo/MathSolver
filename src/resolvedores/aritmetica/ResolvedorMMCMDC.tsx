import { useState } from 'react';
import { HiCalculator } from 'react-icons/hi';
import { lcm, gcd } from '../../utils/mathUtils';
import { getMMCMDCExamples } from '../../utils/mathUtilsTeoriaNumeros';

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

    // Função para aplicar um exemplo
    const applyExample = (example: { numbers: number[] }) => {
        setNumbers(example.numbers.join(', '));
    };

    // Função para calcular o MDC de múltiplos números
    const calcularMDCMultiplo = (nums: number[]): number => {
        if (nums.length === 0) return 0;
        if (nums.length === 1) return nums[0];
        
        let result = nums[0];
        for (let i = 1; i < nums.length; i++) {
            result = gcd(result, nums[i]);
        }
        return result;
    };

    // Função para calcular o MMC de múltiplos números
    const calcularMMCMultiplo = (nums: number[]): number => {
        if (nums.length === 0) return 0;
        if (nums.length === 1) return nums[0];
        
        let result = nums[0];
        for (let i = 1; i < nums.length; i++) {
            result = lcm(result, nums[i]);
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
                const mdcValue = gcd(a, b);
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
                    
                    const mdcValue = gcd(currentMMC, nums[i]);
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

    // Função que gera os passos com estilização aprimorada
    const renderExplanationSteps = () => {
        return (
            <div className="space-y-4">
                {calculationSteps.map((step, index) => {
                    // Verifica se o passo começa com um padrão de número de passo como "Passo X:"
                    const stepMatch = step.match(/^(Passo \d+:)(.*)$/);
                    
                    // Verifica se o passo inclui cálculos de MMC/MDC
                    const calculationMatch = step.includes('MMC(') || 
                                          step.includes('MDC(') || 
                                          step.includes('Calculamos o MDC') ||
                                          step.includes('Calculamos o MMC');
                    
                    // Verifica se o passo mostra uma divisão do algoritmo de Euclides
                    const divisionMatch = step.includes('Dividimos') && 
                                       (step.includes('e obtemos quociente') || step.includes('e obtemos resto'));
                    
                    // Verifica se o passo contém uma conclusão
                    const conclusionMatch = step.includes('Portanto') || 
                                         step.includes('O MMC de') || 
                                         step.includes('O MDC de') ||
                                         step.includes('então o MDC é') ||
                                         step.includes('O resto é zero');
                    
                    // Verifica se o passo explica uma abordagem/metodologia
                    const explanationMatch = step.includes('Para calcular o MMC') || 
                                          step.includes('Para calcular o MDC') || 
                                          step.includes('usaremos a fórmula') ||
                                          step.includes('Usaremos o Algoritmo de Euclides');
                    
                    // Verifica se é um passo de detalhe (com travessão)
                    const detailMatch = step.startsWith('  - ');
                    
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
                    } else if (detailMatch) {
                        // Se for um passo de detalhe
                        return (
                            <div key={index} className="p-3 bg-gray-50 rounded-md ml-8 border-l-2 border-gray-300">
                                <p className="text-gray-700">{step}</p>
                            </div>
                        );
                    } else if (calculationMatch) {
                        // Se for um cálculo de MMC/MDC
                        return (
                            <div key={index} className="p-3 bg-blue-50 rounded-md ml-4 border-l-2 border-blue-300">
                                <p className="text-blue-700 font-medium">{step}</p>
                            </div>
                        );
                    } else if (divisionMatch) {
                        // Se for uma divisão do algoritmo de Euclides
                        return (
                            <div key={index} className="p-3 bg-purple-50 rounded-md ml-4 border-l-2 border-purple-300">
                                <p className="text-purple-700">{step}</p>
                            </div>
                        );
                    } else if (conclusionMatch) {
                        // Se for uma conclusão
                        return (
                            <div key={index} className="p-3 bg-green-50 rounded-md ml-4 border-l-2 border-green-300">
                                <p className="text-green-700 font-medium">{step}</p>
                            </div>
                        );
                    } else if (explanationMatch) {
                        // Se for uma explicação de abordagem/metodologia
                        return (
                            <div key={index} className="p-3 bg-indigo-50 rounded-md ml-4 border-l-2 border-indigo-300">
                                <p className="text-indigo-700">{step}</p>
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

                {/* Exemplos de MMC/MDC */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Exemplos
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {getMMCMDCExamples().map((example, index) => (
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
                                                {operationType === 'mmc' ? 'MMC - Mínimo Múltiplo Comum' : 'MDC - Máximo Divisor Comum'}
                                            </h5>
                                            <div className="p-3 bg-white rounded-md border border-gray-100 shadow-sm mb-3">
                                                <p className="text-gray-700 mb-2">
                                                    {operationType === 'mmc' ? (
                                                        <>O <strong className="text-indigo-700">Mínimo Múltiplo Comum (MMC)</strong> de dois ou mais números é o menor número positivo que é múltiplo de todos eles.</>
                                                    ) : (
                                                        <>O <strong className="text-indigo-700">Máximo Divisor Comum (MDC)</strong> de dois ou mais números é o maior número inteiro que divide todos eles sem deixar resto.</>
                                                    )}
                                                </p>
                                                <div className="bg-indigo-50 p-2 rounded-md text-center">
                                                    <p className="font-medium text-indigo-700">
                                                        {operationType === 'mmc' ? (
                                                            <>MMC(12, 18) = 36</>
                                                        ) : (
                                                            <>MDC(12, 18) = 6</>
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="p-3 bg-yellow-50 rounded-md border-l-2 border-yellow-300">
                                                <p className="text-sm text-yellow-800">
                                                    <span className="font-semibold">Propriedade importante:</span> {' '}
                                                    {operationType === 'mmc' ? (
                                                        <>
                                                            Para dois números a e b: MMC(a,b) × MDC(a,b) = a × b
                                                        </>
                                                    ) : (
                                                        <>
                                                            Se um número d é o MDC de a e b, então d divide tanto a quanto b sem deixar resto.
                                                        </>
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <h5 className="font-medium text-gray-800 mb-2 border-b border-gray-200 pb-1">Aplicações</h5>
                                            <div className="p-3 bg-white rounded-md border border-gray-100 shadow-sm">
                                                {operationType === 'mmc' ? (
                                                    <>
                                                        <h6 className="text-indigo-700 font-medium mb-2">Onde o MMC é usado</h6>
                                                        <ul className="text-sm space-y-2 list-disc pl-4 text-gray-700">
                                                            <li><span className="font-medium">Frações:</span> Para somar ou subtrair frações com denominadores diferentes</li>
                                                            <li><span className="font-medium">Problemas de tempo:</span> Para calcular quando eventos periódicos coincidem novamente</li>
                                                            <li><span className="font-medium">Teoria dos números:</span> Para resolver problemas de congruência linear</li>
                                                            <li><span className="font-medium">Matemática financeira:</span> Para calcular períodos de pagamentos de dívidas</li>
                                                        </ul>
                                                    </>
                                                ) : (
                                                    <>
                                                        <h6 className="text-indigo-700 font-medium mb-2">Onde o MDC é usado</h6>
                                                        <ul className="text-sm space-y-2 list-disc pl-4 text-gray-700">
                                                            <li><span className="font-medium">Frações:</span> Para simplificar frações ao seu formato irredutível</li>
                                                            <li><span className="font-medium">Divisão justa:</span> Para distribuir itens em grupos iguais</li>
                                                            <li><span className="font-medium">Algoritmos:</span> Na criptografia e em algoritmos computacionais</li>
                                                            <li><span className="font-medium">Teoria dos números:</span> Para resolver equações diofantinas</li>
                                                        </ul>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-4">
                                        <h5 className="font-medium text-gray-800 mb-2 border-b border-gray-200 pb-1">Métodos de Cálculo</h5>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <div className="p-3 bg-white rounded-md border border-gray-100 shadow-sm h-full">
                                                    <h6 className="text-indigo-700 font-medium mb-2">Método da Fatoração em Primos</h6>
                                                    <ol className="text-sm space-y-2 list-decimal pl-5 text-gray-700">
                                                        <li>Fatore cada número em seus fatores primos</li>
                                                        <li>
                                                            {operationType === 'mmc' ? (
                                                                <>Para o MMC: multiplique cada fator primo com o <strong>maior</strong> expoente que aparece em qualquer fatoração</>
                                                            ) : (
                                                                <>Para o MDC: multiplique cada fator primo com o <strong>menor</strong> expoente que aparece em todas as fatorações</>
                                                            )}
                                                        </li>
                                                    </ol>
                                                    <div className="mt-2 bg-gray-50 p-2 rounded-md">
                                                        <p className="text-xs text-gray-600">Exemplo: Para 12 = 2² × 3 e 18 = 2 × 3²</p>
                                                        {operationType === 'mmc' ? (
                                                            <p className="text-xs text-gray-600">MMC = 2² × 3² = 4 × 9 = 36</p>
                                                        ) : (
                                                            <p className="text-xs text-gray-600">MDC = 2¹ × 3¹ = 2 × 3 = 6</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                {operationType === 'mmc' ? (
                                                    <div className="p-3 bg-white rounded-md border border-gray-100 shadow-sm h-full">
                                                        <h6 className="text-indigo-700 font-medium mb-2">Método das Divisões Sucessivas</h6>
                                                        <p className="text-sm text-gray-700 mb-2">
                                                            Para o MMC, podemos usar a fórmula:
                                                        </p>
                                                        <div className="bg-indigo-50 p-2 rounded-md text-center mb-2">
                                                            <p className="font-medium text-indigo-700">
                                                                MMC(a,b) = (a × b) ÷ MDC(a,b)
                                                            </p>
                                                        </div>
                                                        <p className="text-sm text-gray-600">
                                                            Esta fórmula é útil quando já conhecemos o MDC dos números.
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <div className="p-3 bg-white rounded-md border border-gray-100 shadow-sm h-full">
                                                        <h6 className="text-indigo-700 font-medium mb-2">Algoritmo de Euclides</h6>
                                                        <p className="text-sm text-gray-700 mb-2">
                                                            Um método eficiente para calcular o MDC:
                                                        </p>
                                                        <ol className="text-xs space-y-1 list-decimal pl-5 text-gray-700">
                                                            <li>Divida o maior número pelo menor e obtenha o resto</li>
                                                            <li>Se o resto for zero, o MDC é o divisor</li>
                                                            <li>Se o resto não for zero, faça o divisor se tornar o dividendo e o resto se tornar o divisor</li>
                                                            <li>Repita até que o resto seja zero</li>
                                                        </ol>
                                                        <div className="mt-2 bg-gray-50 p-2 rounded-md">
                                                            <p className="text-xs text-gray-600">Exemplo: MDC(48, 18)</p>
                                                            <p className="text-xs text-gray-600">48 ÷ 18 = 2 com resto 12</p>
                                                            <p className="text-xs text-gray-600">18 ÷ 12 = 1 com resto 6</p>
                                                            <p className="text-xs text-gray-600">12 ÷ 6 = 2 com resto 0</p>
                                                            <p className="text-xs text-gray-600">Como o resto é 0, MDC = 6</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                            </div>
                            
                                    <div className="mt-4 p-3 bg-green-50 rounded-md border-l-4 border-green-400">
                                        <h5 className="font-medium text-green-800 mb-1">Dica Didática</h5>
                                        <p className="text-sm text-gray-700">
                                            {operationType === 'mmc' ? (
                                                <>
                                                    Para lembrar do MMC: pense que estamos procurando o <strong>menor número</strong> que seja múltiplo de todos os números dados.
                                                </>
                                            ) : (
                                                <>
                                                    Para lembrar do MDC: pense que estamos procurando o <strong>maior número</strong> que divida todos os números dados sem deixar resto.
                                                </>
                                            )}
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

export default ResolvedorMMCMDC; 