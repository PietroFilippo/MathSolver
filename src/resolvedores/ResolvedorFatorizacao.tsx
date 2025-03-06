import { useState } from 'react';
import { HiCalculator } from 'react-icons/hi';
import { numPrimo, proximoPrimo, fatorarNumeroEmPrimos } from '../utils/mathUtils';

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
        const factorization = fatorarNumeroEmPrimos(num);
        setResult(factorization);

        // Gera os passos
        setCalculationSteps(gerarPassosFatoracao(num));
    };

    // Função para gerar os passos da fatoração
    const gerarPassosFatoracao = (num: number): string[] => {
        const calculationSteps: string[] = [];
        
        if (num <= 1) {
            calculationSteps.push(`O número ${num} não possui fatoração em primos.`);
            return calculationSteps;
        }
        
        calculationSteps.push(`Passo 1: Vamos fatorar o número ${num} em seus fatores primos.`);
        
        if (numPrimo(num)) {
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
                divisor = proximoPrimo(divisor);
                
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
        const { factors, exponents } = fatorarNumeroEmPrimos(num);
        let factorizationPower = `${num} = `;
        
        for (let i = 0; i < factors.length; i++) {
            if (i > 0) factorizationPower += ' × ';
            factorizationPower += exponents[i] > 1 ? `${factors[i]}^${exponents[i]}` : `${factors[i]}`;
        }
        
        calculationSteps.push(`Passo ${stepCount}: Escrevendo o resultado em notação de potência: ${factorizationPower}`);
        
        return calculationSteps;
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

            {result && (
                <div className="space-y-6">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-5">
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
                                <ul className="list-disc pl-5 space-y-1 text-gray-700">
                                    <li>Um <strong>número primo</strong> é um número natural maior que 1 que só é divisível por 1 e por ele mesmo.</li>
                                    <li>A <strong>fatoração em números primos</strong> é a decomposição de um número em um produto de fatores primos.</li>
                                    <li>Todo número inteiro maior que 1 ou é primo ou pode ser escrito como um produto de números primos de maneira única (Teorema Fundamental da Aritmética).</li>
                                    <li>Esta fatoração é muito útil para encontrar o MMC e o MDC de dois ou mais números.</li>
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ResolvedorFatorizacao;