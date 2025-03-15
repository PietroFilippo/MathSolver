import React, { useState, ReactNode } from 'react';
import { lcm, gcd } from '../../utils/mathUtils';
import { simplifyFraction, FractionDisplay, getFractionAddSubExamples } from '../../utils/mathUtilsFracoes';
import { HiCalculator, HiInformationCircle } from 'react-icons/hi';

type Operation = 'add' | 'sub';

const ResolvedorAddSubFracao: React.FC = () => {
    const [numerator1, setNumerator1] = useState<string>('');
    const [denominator1, setDenominator1] = useState<string>('');
    const [numerator2, setNumerator2] = useState<string>('');
    const [denominator2, setDenominator2] = useState<string>('');
    const [operation, setOperation] = useState<Operation>('add');
    const [resultadoNum, setResultadoNum] = useState<number | null>(null);
    const [resultadoDen, setResultadoDen] = useState<number | null>(null);
    const [resultado, setResultado] = useState(false);
    const [steps, setSteps] = useState<(string | ReactNode)[]>([]);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [showExplanation, setShowExplanation] = useState<boolean>(false);
    const [showMMCDetails, setShowMMCDetails] = useState<boolean>(false);
    const [mmcSteps, setMmcSteps] = useState<{ den1: number, den2: number, mmc: number }>({ den1: 0, den2: 0, mmc: 0 });

    const handleSolve = () => {
        // Resetar os valores anteriores e erros
        setResultado(false);
        setSteps([]);
        setErrorMessage('');
        setShowExplanation(false);
        setShowMMCDetails(false);

        const num1 = parseInt(numerator1);
        const den1 = parseInt(denominator1);
        const num2 = parseInt(numerator2);
        const den2 = parseInt(denominator2);

        // Valida inputs
        if (isNaN(num1) || isNaN(den1) || isNaN(num2) || isNaN(den2)) {
            setErrorMessage('Por favor, preencha todos os campos com valores numéricos.');
            return;
        }

        if (den1 === 0 || den2 === 0) {
            setErrorMessage('O denominador não pode ser zero.');
            return;
        }

        const { calculationSteps, resultNumerator, resultDenominator } = calcularAddicaoSubtracao(num1, den1, num2, den2, operation);
        
        setResultadoNum(resultNumerator);
        setResultadoDen(resultDenominator);
        setResultado(true);
        setShowExplanation(true);

        setSteps(calculationSteps);
    };

    // Função para aplicar um exemplo
    const applyExample = (example: { 
        num1: number, 
        den1: number, 
        num2: number, 
        den2: number, 
        operation: 'add' | 'sub' 
    }) => {
        setNumerator1(example.num1.toString());
        setDenominator1(example.den1.toString());
        setNumerator2(example.num2.toString());
        setDenominator2(example.den2.toString());
        setOperation(example.operation);
    };

    // Função para filtrar exemplos com base na operação selecionada
    const getFilteredExamples = () => {
        return getFractionAddSubExamples().filter(example => example.operation === operation);
    };

    const calcularAddicaoSubtracao = (
        num1: number, 
        den1: number, 
        num2: number, 
        den2: number, 
        operacao: Operation
    ): { calculationSteps: (string | ReactNode)[], resultNumerator: number, resultDenominator: number } => {
        const calculationSteps: (string | ReactNode)[] = [];
        let stepCount = 1;

        calculationSteps.push(`Passo ${stepCount}: Encontrar o denominador comum (MMC) entre ${den1} e ${den2}.`);
        stepCount++;
        
        // Calcular o MMC dos denominadores
        const commonDenominator = lcm(den1, den2);
        calculationSteps.push(`MMC(${den1}, ${den2}) = ${commonDenominator}`);
        
        // Armazenar os passos do MMC para exibição detalhada opcional
        setMmcSteps({ den1, den2, mmc: commonDenominator });
        
        // Conversão para o denominador comum
        calculationSteps.push(`Passo ${stepCount}: Converter as frações para o denominador comum.`);
        stepCount++;
        
        const factor1 = commonDenominator / den1;
        const factor2 = commonDenominator / den2;
        
        const newNumerator1 = num1 * factor1;
        const newNumerator2 = num2 * factor2;
        
        calculationSteps.push(`Para a primeira fração: Multiplique o numerador e o denominador por ${factor1}`);
        calculationSteps.push(<>
            <FractionDisplay numerator={num1} denominator={den1} /> × 
            <FractionDisplay numerator={factor1} denominator={factor1} /> = 
            <FractionDisplay numerator={newNumerator1} denominator={commonDenominator} />
        </>);
        
        calculationSteps.push(`Para a segunda fração: Multiplique o numerador e o denominador por ${factor2}`);
        calculationSteps.push(<>
            <FractionDisplay numerator={num2} denominator={den2} /> × 
            <FractionDisplay numerator={factor2} denominator={factor2} /> = 
            <FractionDisplay numerator={newNumerator2} denominator={commonDenominator} />
        </>);
        
        calculationSteps.push(`Passo ${stepCount}: ${operacao === 'add' ? 'Adicionar' : 'Subtrair'} os numeradores, mantendo o denominador comum.`);
        stepCount++;
        
        let resultNumerator;
        if (operacao === 'add') {
            resultNumerator = newNumerator1 + newNumerator2;
            calculationSteps.push(`Calculando ${newNumerator1} + ${newNumerator2} = ${resultNumerator}`);
            calculationSteps.push(<>
                <FractionDisplay numerator={newNumerator1} denominator={commonDenominator} /> + 
                <FractionDisplay numerator={newNumerator2} denominator={commonDenominator} /> = 
                <FractionDisplay numerator={resultNumerator} denominator={commonDenominator} />
            </>);
        } else {
            resultNumerator = newNumerator1 - newNumerator2;
            calculationSteps.push(`Calculando ${newNumerator1} - ${newNumerator2} = ${resultNumerator}`);
            calculationSteps.push(<>
                <FractionDisplay numerator={newNumerator1} denominator={commonDenominator} /> - 
                <FractionDisplay numerator={newNumerator2} denominator={commonDenominator} /> = 
                <FractionDisplay numerator={resultNumerator} denominator={commonDenominator} />
            </>);
        }
        
        // Simplificar a fração resultante, se possível
        const { numerador: simplifiedNum, denominador: simplifiedDen } = simplifyFraction(resultNumerator, commonDenominator);
        
        if (resultNumerator !== simplifiedNum || commonDenominator !== simplifiedDen) {
            calculationSteps.push(`Passo ${stepCount}: Simplificar a fração resultante dividindo o numerador e o denominador pelo MDC (Máximo Divisor Comum).`);
            
            const mdcValue = gcd(Math.abs(resultNumerator), commonDenominator);
            calculationSteps.push(`MDC(${Math.abs(resultNumerator)}, ${commonDenominator}) = ${mdcValue}`);
            calculationSteps.push(`Dividindo o numerador: ${resultNumerator} ÷ ${mdcValue} = ${simplifiedNum}`);
            calculationSteps.push(`Dividindo o denominador: ${commonDenominator} ÷ ${mdcValue} = ${simplifiedDen}`);
            calculationSteps.push(<>
                <FractionDisplay numerator={resultNumerator} denominator={commonDenominator} /> = 
                <FractionDisplay numerator={resultNumerator} denominator={commonDenominator} /> ÷ 
                <FractionDisplay numerator={mdcValue} denominator={mdcValue} /> = 
                <FractionDisplay numerator={simplifiedNum} denominator={simplifiedDen} />
            </>);
            
            return {
                calculationSteps,
                resultNumerator: simplifiedNum,
                resultDenominator: simplifiedDen
            };
        }
        
        return {
            calculationSteps,
            resultNumerator,
            resultDenominator: commonDenominator
        };
    };

    // Função para renderizar os detalhes do cálculo do MMC
    const MMCDetails = () => {
        if (!mmcSteps.den1 || !mmcSteps.den2) return null;
        
        const { den1, den2, mmc: resultado } = mmcSteps;
        
        // Decomposição em fatores primos
        const decomposeInPrimeFactors = (num: number): number[] => {
            const factors: number[] = [];
            let n = num;
            let divisor = 2;
            
            while (n > 1) {
                while (n % divisor === 0) {
                    factors.push(divisor);
                    n = n / divisor;
                }
                divisor++;
            }
            
            return factors;
        };
        
        // Obter os fatores primos
        const factors1 = decomposeInPrimeFactors(den1);
        const factors2 = decomposeInPrimeFactors(den2);
        
        // Função para gerar os passos da decomposição
        const generateDecompositionSteps = (num: number): { divisor: number, quotient: number, result: number }[] => {
            const steps: { divisor: number, quotient: number, result: number }[] = [];
            let n = num;
            let divisor = 2;
            
            while (n > 1) {
                while (n % divisor === 0) {
                    steps.push({ divisor, quotient: Math.floor(n / divisor), result: n });
                    n = n / divisor;
                }
                divisor++;
            }
            
            return steps;
        };
        
        const decompositionSteps1 = generateDecompositionSteps(den1);
        const decompositionSteps2 = generateDecompositionSteps(den2);
        
        // Calcular MMC pelo método de fatoração
        const calculateMMCByFactorization = (a: number, b: number): number[] => {
            const factorsA = decomposeInPrimeFactors(a);
            const factorsB = decomposeInPrimeFactors(b);
            
            // Criar um mapa de fatores com suas potências máximas
            const factorMap = new Map<number, number>();
            
            // Contar ocorrências em factorsA
            factorsA.forEach(factor => {
                const count = factorMap.get(factor) || 0;
                factorMap.set(factor, count + 1);
            });
            
            // Contar ocorrências em factorsB e atualizar se necessário
            const factorMapB = new Map<number, number>();
            factorsB.forEach(factor => {
                const count = factorMapB.get(factor) || 0;
                factorMapB.set(factor, count + 1);
            });
            
            // Garantir que temos a potência máxima de cada fator
            factorMapB.forEach((count, factor) => {
                const countA = factorMap.get(factor) || 0;
                if (count > countA) {
                    factorMap.set(factor, count);
                }
            });
            
            // Converter o mapa de volta para um array de fatores
            const resultFactors: number[] = [];
            factorMap.forEach((count, factor) => {
                for (let i = 0; i < count; i++) {
                    resultFactors.push(factor);
                }
            });
            
            resultFactors.sort((a, b) => a - b);
            return resultFactors;
        };
        
        const mmcFactors = calculateMMCByFactorization(den1, den2);
        
        // Passos do algoritmo de Euclides para calcular o MDC
        const gcdSteps = (a: number, b: number): { a: number, b: number, remainder: number }[] => {
            const steps: { a: number, b: number, remainder: number }[] = [];
            
            let x = Math.max(a, b);
            let y = Math.min(a, b);
            
            while (y !== 0) {
                const remainder = x % y;
                steps.push({ a: x, b: y, remainder });
                x = y;
                y = remainder;
            }
            
            return steps;
        };
        
        const mdcSteps = gcdSteps(den1, den2);
        const mdcValue = gcd(den1, den2);
        
        return (
            <div className="bg-white p-5 rounded-md border border-blue-200 mt-3">
                <h4 className="font-medium text-blue-800 mb-3">Cálculo detalhado do MMC({den1}, {den2})</h4>
                
                <div className="space-y-4">
                    <div>
                        <p className="text-gray-700 font-medium mb-2">
                            Método 1: Decomposição em fatores primos
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-3 rounded-md">
                            <div className="space-y-2">
                                <p className="text-gray-700 font-medium">Decomposição de {den1}:</p>
                                
                                {decompositionSteps1.length > 0 ? (
                                    <div className="space-y-1">
                                        {decompositionSteps1.map((step, index) => (
                                            <div key={index} className="flex items-center">
                                                <div className="w-10 text-center">{step.divisor}</div>
                                                <div className="w-6 text-center">|</div>
                                                <div>{step.result}</div>
                                            </div>
                                        ))}
                                        <div className="text-gray-700 mt-1">
                                            Portanto, {den1} = {factors1.join(' × ') || den1}
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-gray-700">{den1} é um número primo</p>
                                )}
                            </div>
                            
                            <div className="space-y-2">
                                <p className="text-gray-700 font-medium">Decomposição de {den2}:</p>
                                
                                {decompositionSteps2.length > 0 ? (
                                    <div className="space-y-1">
                                        {decompositionSteps2.map((step, index) => (
                                            <div key={index} className="flex items-center">
                                                <div className="w-10 text-center">{step.divisor}</div>
                                                <div className="w-6 text-center">|</div>
                                                <div>{step.result}</div>
                                            </div>
                                        ))}
                                        <div className="text-gray-700 mt-1">
                                            Portanto, {den2} = {factors2.join(' × ') || den2}
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-gray-700">{den2} é um número primo</p>
                                )}
                            </div>
                        </div>
                        
                        <div className="mt-3 bg-gray-50 p-3 rounded-md">
                            <p className="text-gray-700 font-medium">Para encontrar o MMC pelos fatores primos:</p>
                            <p className="text-gray-700 mt-1">
                                1. Pegamos cada fator primo que aparece em pelo menos um dos números.
                            </p>
                            <p className="text-gray-700">
                                2. Para cada fator, usamos a maior potência em que ele aparece.
                            </p>
                            
                            <div className="mt-2">
                                <p className="text-gray-700">Fatores de {den1}: {factors1.join(' × ') || den1}</p>
                                <p className="text-gray-700">Fatores de {den2}: {factors2.join(' × ') || den2}</p>
                                <p className="text-gray-700 font-medium mt-1">
                                    MMC = {mmcFactors.join(' × ')} = {resultado}
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="mt-4">
                        <p className="text-gray-700 font-medium mb-2">
                            Método 2: Utilizando a relação com o MDC
                        </p>
                        
                        <div className="bg-gray-50 p-3 rounded-md">
                            <p className="text-gray-700">A fórmula relaciona o MMC e o MDC:</p>
                            <p className="text-gray-700 font-medium my-1">
                                MMC(a, b) = (a × b) ÷ MDC(a, b)
                            </p>
                            
                            <div className="mt-3">
                                <p className="text-gray-700 font-medium">Cálculo do MDC({den1}, {den2}) pelo algoritmo de Euclides:</p>
                                
                                {mdcSteps.map((step, index) => (
                                    <div key={index} className="mt-1 flex items-center text-gray-700">
                                        <span>{step.a} = {step.b} × {Math.floor(step.a / step.b)} + {step.remainder}</span>
                                    </div>
                                ))}
                                
                                <p className="text-gray-700 mt-2">
                                    MDC({den1}, {den2}) = {mdcValue}
                                </p>
                                
                                <p className="text-gray-700 mt-3 font-medium">Aplicando a fórmula:</p>
                                <p className="text-gray-700">
                                    MMC({den1}, {den2}) = ({den1} × {den2}) ÷ {mdcValue}
                                </p>
                                <p className="text-gray-700">
                                    MMC({den1}, {den2}) = {den1 * den2} ÷ {mdcValue} = {resultado}
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-blue-50 p-3 rounded-md mt-3">
                        <p className="text-gray-700 font-medium">Por que precisamos do MMC para somar frações?</p>
                        <p className="text-gray-700 mt-1">
                            O MMC nos dá o menor denominador comum que podemos usar para converter as frações. 
                            Ao converter frações com denominadores diferentes para terem o mesmo denominador, 
                            podemos {operation === 'add' ? 'somar' : 'subtrair'} apenas os numeradores, mantendo o denominador comum. 
                            Isso é uma propriedade fundamental da aritmética de frações.
                        </p>
                    </div>
                </div>
            </div>
        );
    };

    // Função para renderizar os passos de explicação com estilização aprimorada
    const renderExplanationSteps = () => {
        return (
            <div className="space-y-4">
                {steps.map((step, stepIndex) => {
                    // Verifica se é uma string ou um ReactNode
                    const isString = typeof step === 'string';
                    if (!isString) {
                        // Se for um ReactNode (por exemplo, um elemento de fração), renderiza diretamente
                        return (
                            <div key={stepIndex} className="p-3 bg-indigo-50 rounded-md ml-4 border-l-2 border-indigo-300">
                                <div className="text-indigo-700 font-medium">{step}</div>
                            </div>
                        );
                    }

                    // Para strings, verifica diferentes padrões
                    const stepStr = String(step);
                    const stepMatch = stepStr.match(/^(Passo \d+:)(.*)$/);
                    
                    // Verifica se é um passo de MMC
                    const mmcMatch = stepStr.startsWith('MMC(');
                    
                    // Verifica se é instrução para converter fração
                    const conversionMatch = stepStr.startsWith('Para a') && stepStr.includes('Multiplique');
                    
                    // Verifica se é cálculo de numeradores
                    const calcMatch = stepStr.startsWith('Calculando');
                    
                    // Verifica se é MDC ou divisão para simplificação
                    const mdcMatch = stepStr.startsWith('MDC(') || stepStr.startsWith('Dividindo');
                    
                    if (stepMatch) {
                        // Se for um passo com número, extrai e destaca o número
                        const [_, stepNumber, stepContent] = stepMatch;
                        return (
                            <div key={stepIndex} className="p-4 bg-gray-50 rounded-md border-l-4 border-indigo-500">
                                <div className="flex flex-col sm:flex-row">
                                    <span className="font-bold text-indigo-700 mr-2 mb-1 sm:mb-0">
                                        {stepNumber}
                                    </span>
                                    <p className="text-gray-800">{stepContent}</p>
                                </div>
                                
                                {stepNumber === "Passo 1:" && mmcSteps && (
                                    <button
                                        onClick={() => setShowMMCDetails(!showMMCDetails)}
                                        className="mt-2 flex items-center text-indigo-600 hover:text-indigo-800"
                                    >
                                        <HiInformationCircle className="h-5 w-5 mr-1" />
                                        {showMMCDetails ? "Ocultar detalhes do cálculo do MMC" : "Ver detalhes do cálculo do MMC"}
                                    </button>
                                )}
                                
                                {stepNumber === "Passo 1:" && mmcSteps && showMMCDetails && MMCDetails()}
                            </div>
                        );
                    } else if (mmcMatch) {
                        // Se for o resultado do MMC
                        return (
                            <div key={stepIndex} className="p-3 bg-blue-50 rounded-md ml-4 border-l-2 border-blue-300">
                                <p className="text-blue-700 font-medium">{step}</p>
                            </div>
                        );
                    } else if (conversionMatch) {
                        // Se for instrução para conversão de fração
                        return (
                            <div key={stepIndex} className="p-3 bg-purple-50 rounded-md ml-4 border-l-2 border-purple-300">
                                <p className="text-purple-700">{step}</p>
                            </div>
                        );
                    } else if (calcMatch) {
                        // Se for cálculo dos numeradores
                        return (
                            <div key={stepIndex} className="p-3 bg-amber-50 rounded-md ml-4 border-l-2 border-amber-300">
                                <p className="text-amber-700 font-medium">{step}</p>
                            </div>
                        );
                    } else if (mdcMatch) {
                        // Se for MDC ou divisão para simplificação
                        return (
                            <div key={stepIndex} className="p-3 bg-green-50 rounded-md ml-4 border-l-2 border-green-300">
                                <p className="text-green-700">{step}</p>
                            </div>
                        );
                    } else {
                        // Conteúdo regular sem classificação específica
                        return (
                            <div key={stepIndex} className="p-3 bg-gray-50 rounded-md ml-4">
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
                <h2 className="text-2xl font-bold">Adição e Subtração de Frações</h2>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-8">
                <p className="text-gray-700 mb-6">
                    Essa calculadora ajuda a resolver adições e subtrações de frações com denominadores diferentes.
                    Insira o numerador e o denominador de cada fração abaixo e escolha a operação desejada.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Fração 1
                        </label>
                        <div className="flex items-center">
                            <input
                                type="number"
                                value={numerator1}
                                onChange={(e) => setNumerator1(e.target.value)}
                                className="w-20 p-2 border border-gray-300 rounded-l-md focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Num"
                            />
                            <div className="px-2 py-2 bg-gray-100 border-t border-b border-gray-300">
                                /
                            </div>
                            <input
                                type="number"
                                value={denominator1}
                                onChange={(e) => setDenominator1(e.target.value)}
                                className="w-20 p-2 border border-gray-300 rounded-r-md focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Den"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Fração 2
                        </label>
                        <div className="flex items-center">
                            <input
                                type="number"
                                value={numerator2}
                                onChange={(e) => setNumerator2(e.target.value)}
                                className="w-20 p-2 border border-gray-300 rounded-l-md focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Num"
                            />
                            <div className="px-2 py-2 bg-gray-100 border-t border-b border-gray-300">
                                /
                            </div>
                            <input
                                type="number"
                                value={denominator2}
                                onChange={(e) => setDenominator2(e.target.value)}
                                className="w-20 p-2 border border-gray-300 rounded-r-md focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Den"
                            />
                        </div>
                    </div>
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Operação
                    </label>
                    <div className="flex space-x-4">
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                value="add"
                                checked={operation === 'add'}
                                onChange={() => setOperation('add')}
                                className="form-radio h-4 w-4 text-indigo-600"
                            />
                            <span className="ml-2">Adição (+)</span>
                        </label>
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                checked={operation === 'sub'}
                                onChange={() => setOperation('sub')}
                                className="form-radio h-4 w-4 text-indigo-600"
                            />
                            <span className="ml-2">Subtração (-)</span>
                        </label>
                    </div>
                </div>

                {/* Exemplos de frações */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Exemplos
                    </label>
                    <div className="flex flex-wrap gap-2 mb-4">
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

            {resultado && (
                <div className="space-y-6">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-5">
                        <h3 className="text-lg font-medium text-green-800 mb-2">Resultado</h3>
                        <div className="flex items-center">
                            <p className="text-xl mr-2">
                                {operation === 'add' ? 'O resultado da adição é: ' : 'O resultado da subtração é: '}
                            </p>
                            {resultadoNum !== null && resultadoDen !== null && (
                                <FractionDisplay 
                                    numerator={resultadoNum} 
                                    denominator={resultadoDen} 
                                    className="text-xl"
                                />
                            )}
                            {resultadoNum !== null && resultadoDen !== null && resultadoNum % resultadoDen === 0 && (
                                <span className="ml-3">= {resultadoNum / resultadoDen}</span>
                            )}
                        </div>
                        
                        <button 
                            onClick={() => setShowExplanation(!showExplanation)}
                            className="mt-4 text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center"
                        >
                            {showExplanation ? "Ocultar explicação detalhada" : "Mostrar explicação detalhada"}
                        </button>
                    </div>

                    {showExplanation && (
                        <div className="mt-8 bg-white shadow-md rounded-lg p-5">
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
                                            <h5 className="font-medium text-gray-800 mb-2 border-b border-gray-200 pb-1">Adição e Subtração de Frações</h5>
                                            <div className="space-y-3">
                                                <p className="text-gray-700">
                                                    Para somar ou subtrair frações, precisamos de denominadores iguais. Esta é uma propriedade 
                                                    fundamental da aritmética de frações, pois só podemos adicionar ou subtrair partes quando 
                                                    elas têm o mesmo tamanho (denominador).
                                                </p>
                                                <div className="bg-white p-3 rounded-md border border-gray-100 shadow-sm">
                                                    <h6 className="text-indigo-700 font-medium mb-2">Fórmulas</h6>
                                                    <div className="space-y-2 text-center font-medium text-indigo-700">
                                                        <p>
                                                            <span className="font-semibold">Com denominador comum:</span><br />
                                                            a/c + b/c = (a + b)/c<br />
                                                            a/c - b/c = (a - b)/c
                                                        </p>
                                                        <p className="text-sm pt-2 border-t border-gray-100">
                                                            <span className="font-semibold">Com denominadores diferentes:</span><br />
                                                            a/b ± c/d = (a·(mmc/b) ± c·(mmc/d))/mmc<br />
                                                            onde mmc = mínimo múltiplo comum entre b e d
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="p-3 bg-indigo-50 rounded-md">
                                                    <p className="text-sm text-indigo-700">
                                                        <span className="font-medium">Por que precisamos do MMC?</span> O Mínimo Múltiplo Comum 
                                                        dos denominadores nos permite converter as frações para um denominador comum, que é o 
                                                        menor possível. Isso mantém os cálculos mais simples e facilita a simplificação posterior.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="flex-1">
                                            <h5 className="font-medium text-gray-800 mb-2 border-b border-gray-200 pb-1">Passos para a Resolução</h5>
                                            <div className="bg-white p-3 rounded-md border border-gray-100 shadow-sm space-y-4">
                                                <ol className="text-sm space-y-3 list-decimal pl-5 text-gray-700">
                                                    <li>
                                                        <span className="font-medium text-indigo-700">Encontrar o MMC dos denominadores</span>
                                                        <p className="text-xs mt-1">
                                                            Identifique o menor número que é múltiplo de ambos os denominadores.
                                                            Podemos usar a decomposição em fatores primos ou o algoritmo de Euclides.
                                                        </p>
                                                    </li>
                                                    <li>
                                                        <span className="font-medium text-indigo-700">Converter as frações para o denominador comum</span>
                                                        <p className="text-xs mt-1">
                                                            Multiplique o numerador e o denominador de cada fração pelo fator necessário
                                                            para obter o denominador comum (MMC).
                                                        </p>
                                                    </li>
                                                    <li>
                                                        <span className="font-medium text-indigo-700">Somar ou subtrair os numeradores</span>
                                                        <p className="text-xs mt-1">
                                                            Com as frações convertidas para o mesmo denominador, agora podemos 
                                                            adicionar ou subtrair seus numeradores, mantendo o denominador comum.
                                                        </p>
                                                    </li>
                                                    <li>
                                                        <span className="font-medium text-indigo-700">Simplificar a fração resultante</span>
                                                        <p className="text-xs mt-1">
                                                            Encontre o Máximo Divisor Comum (MDC) entre o numerador e o denominador resultantes,
                                                            e divida ambos por esse valor para obter a fração na forma mais simples.
                                                        </p>
                                                    </li>
                                                </ol>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="bg-white p-3 rounded-md border border-gray-100 shadow-sm">
                                            <h5 className="font-medium text-gray-800 mb-2">Exemplos Práticos</h5>
                                            <div className="space-y-3">
                                                <div className="p-2 bg-indigo-50 rounded-md">
                                                    <p className="text-sm text-indigo-700 font-medium">
                                                        Exemplo de Adição: 2/3 + 1/4
                                                    </p>
                                                    <ol className="text-xs list-decimal pl-4 mt-1 text-gray-700">
                                                        <li>MMC(3, 4) = 12</li>
                                                        <li>2/3 = (2×4)/12 = 8/12</li>
                                                        <li>1/4 = (1×3)/12 = 3/12</li>
                                                        <li>8/12 + 3/12 = 11/12</li>
                                                        <li>Como 11 e 12 são primos entre si, 11/12 já está simplificada</li>
                                                    </ol>
                                                </div>
                                                
                                                <div className="p-2 bg-purple-50 rounded-md">
                                                    <p className="text-sm text-purple-700 font-medium">
                                                        Exemplo de Subtração: 5/6 - 1/4
                                                    </p>
                                                    <ol className="text-xs list-decimal pl-4 mt-1 text-gray-700">
                                                        <li>MMC(6, 4) = 12</li>
                                                        <li>5/6 = (5×2)/12 = 10/12</li>
                                                        <li>1/4 = (1×3)/12 = 3/12</li>
                                                        <li>10/12 - 3/12 = 7/12</li>
                                                        <li>Como 7 e 12 são primos entre si, 7/12 já está simplificada</li>
                                                    </ol>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="bg-yellow-50 p-3 rounded-md border-l-4 border-yellow-400">
                                                <h5 className="font-medium text-yellow-800 mb-2">Dicas para Evitar Erros Comuns</h5>
                                                <ul className="text-sm space-y-1 list-disc pl-4 text-gray-700">
                                                    <li>Nunca some ou subtraia diretamente os denominadores</li>
                                                    <li>Certifique-se de encontrar o MMC correto dos denominadores</li>
                                                    <li>Ao converter para o denominador comum, multiplique tanto o numerador quanto o denominador pelo mesmo fator</li>
                                                    <li>Verifique se a fração resultante pode ser simplificada</li>
                                                    <li>Com números negativos, tenha cuidado com os sinais durante as operações</li>
                                                </ul>
                                            </div>
                                            
                                            <div className="bg-green-50 p-3 rounded-md border border-green-100">
                                                <h5 className="font-medium text-green-800 mb-2">Aplicações no Cotidiano</h5>
                                                <ul className="text-sm space-y-1 list-disc pl-4 text-gray-700">
                                                    <li>Receitas culinárias (ajuste de medidas de ingredientes)</li>
                                                    <li>Medições em construção e carpintaria</li>
                                                    <li>Cálculos financeiros (juros, descontos)</li>
                                                    <li>Divisão de tempo em tarefas</li>
                                                    <li>Análise de probabilidades em estatística</li>
                                                </ul>
                                            </div>
                            </div>
                                    </div>
                                    
                                    <div className="mt-4 p-3 bg-indigo-50 rounded-md border border-indigo-100">
                                        <h5 className="font-medium text-indigo-800 mb-1 flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                            </svg>
                                            Relação com Outros Conceitos
                                        </h5>
                                        <p className="text-sm text-indigo-700">
                                            A adição e subtração de frações são fundamentais para operações mais avançadas como resolução de equações 
                                            fracionárias, cálculo de expressões algébricas e para o entendimento de conceitos como números racionais 
                                            e irracionais. Essas operações também são a base para o trabalho com frações algébricas em álgebra.
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

export default ResolvedorAddSubFracao;
