import { useState } from 'react';
import { HiCalculator } from 'react-icons/hi';
import { isPrime, nextPrime, factorNumberIntoPrimes, getFactorizationExamples } from '../../utils/mathUtilsTeoriaNumeros';

const ResolvedorFatorizacao: React.FC = () => {
    const [number, setNumber] = useState<string>('');
    const [result, setResult] = useState<{factors: number[], exponents: number[]} | null>(null);
    const [showExplanation, setShowExplanation] = useState<boolean>(true);
    const [calculationSteps, setCalculationSteps] = useState<string[]>([]);
    const [errorMessage, setErrorMessage] = useState<string>('');

    const handleSolve = () => {
        // Limpa valores anteriores
        setResult(null);
        setCalculationSteps([]);
        setErrorMessage('');

        // Valida o valor
        const num = parseInt(number);

        if (isNaN(num)) {
            setErrorMessage('Por favor, insira um número válido.');
            return;
        }

        if (num < 2) {
            setErrorMessage('Por favor, insira um número maior que 1.');
            return;
        }

        // Calcula a fatoração
        const factorization = factorNumberIntoPrimes(num);
        setResult(factorization);

        // Gera os passos
        setCalculationSteps(generateFactorizationSteps(num));
    };

    // Função para aplicar um exemplo
    const applyExample = (example: { number: number }) => {
        setNumber(example.number.toString());
    };

    // Função para gerar os passos da fatoração
    const generateFactorizationSteps = (num: number): string[] => {
        const calculationSteps: string[] = [];
        
        if (num <= 1) {
            calculationSteps.push(`O número ${num} não possui fatoração em primos.`);
            return calculationSteps;
        }
        
        calculationSteps.push(`Passo 1: Vamos fatorar o número ${num} em seus fatores primos.`);
        
        if (isPrime(num)) {
            calculationSteps.push(`Passo 2: O número ${num} é primo, portanto sua fatoração é ${num} = ${num}.`);
            return calculationSteps;
        }
        
        let currentNumber = num;
        let divisor = 2;
        let stepCount = 2;
        let factorString = `${num} = `;
        
        while (currentNumber > 1) {
            if (currentNumber % divisor === 0) {
                calculationSteps.push(`Passo ${stepCount}: Dividimos ${currentNumber} por ${divisor} e obtemos ${currentNumber/divisor}.`);
                
                if (factorString === `${num} = `) {
                    factorString += `${divisor}`;
                } else {
                    factorString += ` × ${divisor}`;
                }
                
                calculationSteps.push(`Fatoração parcial: ${factorString}`);
                
                currentNumber /= divisor;
                stepCount++;
            } else {
                divisor = nextPrime(divisor);
                
                if (divisor * divisor > num && currentNumber > 1) {
                    // Se o próximo divisor for maior que a raiz quadrada do número,
                    // o número restante é primo
                    calculationSteps.push(`Passo ${stepCount}: Como não há mais divisores menores que √${num}, e ${currentNumber} > 1, então ${currentNumber} é primo.`);
                    
                    if (factorString === `${num} = `) {
                        factorString += `${currentNumber}`;
                    } else {
                        factorString += ` × ${currentNumber}`;
                    }
                    
                    calculationSteps.push(`Fatoração final: ${factorString}`);
                    currentNumber = 1;
                    stepCount++;
                }
            }
        }
        
        // Mostrar o resultado final em notação de potência
        const { factors, exponents } = factorNumberIntoPrimes(num);
        let factorizationPower = `${num} = `;
        
        for (let i = 0; i < factors.length; i++) {
            if (i > 0) factorizationPower += ' × ';
            factorizationPower += exponents[i] > 1 ? `${factors[i]}^${exponents[i]}` : `${factors[i]}`;
        }
        
        calculationSteps.push(`Passo ${stepCount}: Escrevendo o resultado em notação de potência: ${factorizationPower}`);
        
        return calculationSteps;
    };

    // Função que gera os passos com estilização aprimorada
    const renderExplanationSteps = () => {
        return (
            <div className="space-y-4">
                {calculationSteps.map((step, index) => {
                    // Verifica se o passo começa com um padrão de número de passo como "Passo X:"
                    const stepMatch = step.match(/^(Passo \d+:)(.*)$/);
                    
                    // Verifica se o passo contém uma fatoração parcial/final
                    const factorizationMatch = step.match(/^(Fatoração parcial:|Fatoração final:)(.*)$/);
                    
                    // Verifica se o passo é uma explicação teórica ou conceitual
                    const explanationMatch = step.includes('é primo') || 
                                           step.includes('Como não há mais divisores') ||
                                           step.includes('não possui fatoração');
                    
                    // Verifica se o passo envolve uma operação matemática (divisão)
                    const operationMatch = step.includes('Dividimos') && step.includes('e obtemos');
                    
                    // Verifica se o passo mostra notação de potência
                    const powerNotationMatch = step.includes('notação de potência');
                    
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
                    } else if (factorizationMatch) {
                        // Se for uma fatoração parcial/final
                        const [_, factorizationType, factorizationContent] = factorizationMatch;
                        return (
                            <div key={index} className="p-3 bg-blue-50 rounded-md ml-4 border-l-2 border-blue-300">
                                <div className="flex flex-col sm:flex-row">
                                    <span className="font-medium text-blue-700 mr-2 mb-1 sm:mb-0">
                                        {factorizationType}
                                    </span>
                                    <p className="text-gray-800 font-medium">{factorizationContent}</p>
                                </div>
                            </div>
                        );
                    } else if (explanationMatch) {
                        // Se for uma explicação teórica
                        return (
                            <div key={index} className="p-3 bg-indigo-50 rounded-md ml-4 border-l-2 border-indigo-300">
                                <p className="text-indigo-700">{step}</p>
                            </div>
                        );
                    } else if (operationMatch) {
                        // Se for uma operação matemática
                        return (
                            <div key={index} className="p-3 bg-green-50 rounded-md ml-4 border-l-2 border-green-300">
                                <p className="text-green-700">{step}</p>
                            </div>
                        );
                    } else if (powerNotationMatch) {
                        // Se for notação de potência
                        return (
                            <div key={index} className="p-3 bg-purple-50 rounded-md ml-4 border-l-2 border-purple-300">
                                <p className="text-purple-700 font-medium">{step}</p>
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

    // Formata resultado
    const formatResult = (): string => {
        if (!result) return '';
        
        const { factors, exponents } = result;
        
        if (factors.length === 0) return '';
        
        let formattedResult = '';
        
        for (let i = 0; i < factors.length; i++) {
            if (i > 0) formattedResult += ' × ';
            formattedResult += exponents[i] > 1 ? `${factors[i]}<sup>${exponents[i]}</sup>` : `${factors[i]}`;
        }
        
        return formattedResult;
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center mb-6">
                <HiCalculator className="h-6 w-6 text-indigo-600 mr-2" />
                <h2 className="text-2xl font-bold">Fatoração em Números Primos</h2>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-8">
                <p className="text-gray-700 mb-6">
                     Decompõe um número inteiro positivo em um produto de fatores primos
                </p>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Número para fatorar:
                    </label>
                    <input
                        type="number"
                        value={number}
                        onChange={(e) => setNumber(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Insira um número inteiro maior ou igual a 2"
                    />
                </div>

                {/* Exemplos de fatoração */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Exemplos
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {getFactorizationExamples().map((example, index) => (
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
                    Calcular Fatoração
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
                            A fatoração de {number} em números primos é: <span className="font-bold"dangerouslySetInnerHTML={{ __html: formatResult() }} />
                       </p>

                        <button
                            onClick={() => setShowExplanation(!showExplanation)}
                            className="mt-4 text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center"
                        >
                            {showExplanation ? 'Ocultar Explicação' : 'Mostrar Explicação'}
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
                                            <h5 className="font-medium text-gray-800 mb-2 border-b border-gray-200 pb-1">Números Primos</h5>
                                            <p className="text-gray-700 mb-3">
                                                Um número primo é um número natural maior que 1 que possui apenas dois divisores: 1 e ele mesmo.
                                            </p>
                                            <div className="bg-white p-3 rounded-md border border-gray-100 shadow-sm mb-3">
                                                <p className="text-center font-medium text-indigo-700">
                                                    Exemplos: 2, 3, 5, 7, 11, 13, 17, 19, 23, 29, ...
                                                </p>
                                            </div>
                                            <div className="p-3 bg-yellow-50 rounded-md border-l-2 border-yellow-300">
                                                <p className="text-sm text-yellow-800">
                                                    <span className="font-semibold">Curiosidade:</span> O número 1 não é considerado primo, pois possui apenas um divisor (ele mesmo).
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <h5 className="font-medium text-gray-800 mb-2 border-b border-gray-200 pb-1">Teorema Fundamental da Aritmética</h5>
                                            <div className="p-3 bg-indigo-50 rounded-md">
                                                <p className="text-indigo-700 font-medium mb-2">
                                                    Todo número inteiro maior que 1 ou é primo ou pode ser escrito como um produto de números primos de maneira única (desconsiderando a ordem dos fatores).
                                                </p>
                                                <p className="text-sm text-indigo-600">
                                                    Este é um dos teoremas mais importantes da teoria dos números, pois garante que a fatoração em primos é única.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-4">
                                        <h5 className="font-medium text-gray-800 mb-2 border-b border-gray-200 pb-1">Fatoração em Números Primos</h5>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <div className="p-3 bg-white rounded-md border border-gray-100 shadow-sm">
                                                    <h6 className="text-indigo-700 font-medium mb-2">Definição</h6>
                                                    <p className="text-gray-700 text-sm">
                                                        A fatoração em números primos é a decomposição de um número em um produto de fatores primos.
                                                        Cada número composto pode ser representado de maneira única como uma multiplicação de números primos.
                                                    </p>
                                                </div>
                                                
                                                <div className="p-3 bg-white rounded-md border border-gray-100 shadow-sm mt-3">
                                                    <h6 className="text-indigo-700 font-medium mb-2">Exemplos</h6>
                                                    <ul className="text-sm space-y-2">
                                                        <li className="flex flex-col">
                                                            <span className="font-medium">12 = 2² × 3</span>
                                                            <span className="text-xs text-gray-500 pl-4">12 = 2 × 2 × 3</span>
                                                        </li>
                                                        <li className="flex flex-col">
                                                            <span className="font-medium">60 = 2² × 3 × 5</span>
                                                            <span className="text-xs text-gray-500 pl-4">60 = 2 × 2 × 3 × 5</span>
                                                        </li>
                                                        <li className="flex flex-col">
                                                            <span className="font-medium">100 = 2² × 5²</span>
                                                            <span className="text-xs text-gray-500 pl-4">100 = 2 × 2 × 5 × 5</span>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                            
                                            <div className="space-y-3">
                                                <div className="p-3 bg-white rounded-md border border-gray-100 shadow-sm">
                                                    <h6 className="text-indigo-700 font-medium mb-2">Processo de Fatoração</h6>
                                                    <ol className="text-sm space-y-2 list-decimal pl-5">
                                                        <li>Divida o número pelo menor primo que o divide (geralmente começamos com 2).</li>
                                                        <li>Continue dividindo pelo mesmo primo até que não seja mais divisível.</li>
                                                        <li>Passe para o próximo número primo e repita o processo.</li>
                                                        <li>Continue até que o resultado seja 1.</li>
                                                    </ol>
                                                </div>
                                                
                                                <div className="p-3 bg-green-50 rounded-md border-l-4 border-green-300">
                                                    <h6 className="text-green-800 font-medium mb-1">Aplicações</h6>
                                                    <ul className="text-sm space-y-1 list-disc pl-4 text-gray-700">
                                                        <li>Encontrar o MMC (mínimo múltiplo comum)</li>
                                                        <li>Encontrar o MDC (máximo divisor comum)</li>
                                                        <li>Simplificar frações</li>
                                                        <li>Criptografia (como o RSA)</li>
                                                        <li>Teoria dos números em matemática avançada</li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-4 p-3 bg-indigo-50 rounded-md border border-indigo-100">
                                        <h5 className="font-medium text-indigo-800 mb-1 flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                            </svg>
                                            Dica de Resolução
                                        </h5>
                                        <p className="text-sm text-indigo-700">
                                            Para números grandes, é útil tentar dividir primeiro por 2, depois por 3, 5, 7, etc. 
                                            Se nenhum primo até a raiz quadrada do número o dividir, então o número é primo.
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

export default ResolvedorFatorizacao;