import React, { useState, ReactNode } from 'react';
import { mdc, mmc } from '../../utils/mathUtils';
import { simplificarFracao, FractionDisplay } from '../../utils/mathUtilsFracoes';
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
        const commonDenominator = mmc(den1, den2);
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
        const { numerador: simplifiedNum, denominador: simplifiedDen } = simplificarFracao(resultNumerator, commonDenominator);
        
        if (resultNumerator !== simplifiedNum || commonDenominator !== simplifiedDen) {
            calculationSteps.push(`Passo ${stepCount}: Simplificar a fração resultante dividindo o numerador e o denominador pelo MDC (Máximo Divisor Comum).`);
            
            const mdcValue = mdc(Math.abs(resultNumerator), commonDenominator);
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
        const mdcValue = mdc(den1, den2);
        
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
                            <div className="space-y-4">
                                {steps.map((step, stepIndex) => {
                                    // Verifica se o passo começa com um padrão de número de passo como "Passo X:"
                                    const stepStr = String(step); // Garante que step seja tratado como string
                                    const stepMatch = stepStr.match(/^(Passo \d+:)(.*)$/);
                                    
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
                                    } else {
                                        // Conteúdo regular sem número de passo
                                        return (
                                            <div key={stepIndex} className="p-3 bg-gray-50 rounded-md ml-4">
                                                <p className="text-gray-800">{step}</p>
                                            </div>
                                        );
                                    }
                                })}
                            </div>

                            <div className="mt-6 p-4 bg-blue-50 rounded-md">
                            <h4 className="font-medium text-blue-800 mb-2">Conceito Matemático</h4>
                                <div className="space-y-2 text-gray-700">
                                    <p>
                                        <span className="font-semibold">Adição e Subtração de Frações:</span> Para somar ou subtrair frações, precisamos de denominadores iguais. Seguimos estes passos:
                                    </p>
                                    <ol className="list-decimal pl-5 mt-2 space-y-1">
                                        <li>Encontrar o Mínimo Múltiplo Comum (MMC) dos denominadores</li>
                                        <li>Converter cada fração para denominadores iguais, multiplicando o numerador e denominador pelo fator necessário</li>
                                        <li>Somar ou subtrair os numeradores, mantendo o denominador comum</li>
                                        <li>Simplificar a fração resultante, encontrando o Máximo Divisor Comum (MDC) entre o numerador e denominador</li>
                                    </ol>
                                    
                                    <p className="mt-2">
                                        <span className="font-semibold">Fórmula:</span> Para frações <span className="italic">a/b</span> e <span className="italic">c/d</span>:
                                    </p>
                                    <div className="bg-white p-2 rounded border border-gray-200 text-center my-2">
                                        <span className="italic">a/b ± c/d = (a·(mmc/b) ± c·(mmc/d))/mmc</span>
                                    </div>
                                    
                                    <p className="mt-2">
                                        <span className="font-semibold">Simplificação:</span> Para simplificar uma fração <span className="italic">n/d</span>, encontramos o MDC entre <span className="italic">n</span> e <span className="italic">d</span> e dividimos ambos por ele.
                                    </p>
                                    
                                    <p className="mt-2">
                                        <span className="font-semibold">Aplicações:</span> Esta operação é fundamental para cálculos em:
                                    </p>
                                    <ul className="list-disc pl-5 mt-1">
                                        <li>Álgebra e resolução de equações</li>
                                        <li>Receitas culinárias (ajustes de quantidades)</li>
                                        <li>Finanças (divisão de despesas)</li>
                                        <li>Estatística (cálculo de proporções)</li>
                                    </ul>
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
