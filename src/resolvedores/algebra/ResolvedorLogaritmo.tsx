import { useState } from 'react';
import { roundToDecimals } from '../../utils/mathUtils';
import { HiCalculator } from 'react-icons/hi';
import { getLogarithmExamples } from '../../utils/mathUtilsAlgebra';

type LogType = 'natural' | 'base10' | 'custom';

const ResolvedorLogaritmo: React.FC = () => {
    const [logType, setLogType] = useState<LogType>('natural');
    const [value, setValue] = useState<string>('');
    const [customBase, setCustomBase] = useState<string>('');
    const [result, setResult] = useState<number | null>(null);
    const [steps, setSteps] = useState<string[]>([]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [showExplanation, setShowExplanation] = useState<boolean>(false);

    const handleSolve = () => {
        // Limpa resultados e erros anteriores
        setResult(null);
        setSteps([]);
        setErrorMessage('');
        setShowExplanation(false);

        const numValue = parseFloat(value);

        if (isNaN(numValue)) {
            setErrorMessage('O valor para o logaritmo deve ser um número válido.');
            return;
        }

        if (numValue <= 0) {
            setErrorMessage('O logaritmo só é definido para valores positivos.');
            return;
        }

        let calculatedResult: number;
        const calculationSteps: string[] = [];
        let stepCount = 1;

        if (logType === 'natural') {
            calculationSteps.push(`Passo ${stepCount}: Calcular o logaritmo natural (base e) de ${numValue}`);
            stepCount++;
            
            calculationSteps.push(`Passo ${stepCount}: Logaritmo natural é o logaritmo com base e (número de Euler, aproximadamente 2.71828...)`);
            calculatedResult = Math.log(numValue);
            calculationSteps.push(`ln(${numValue}) = ${roundToDecimals(calculatedResult, 6)}`);
            stepCount++;
            
            // Verificação do resultado
            calculationSteps.push(`Passo ${stepCount}: Verificar o resultado usando a definição de logaritmo`);
            calculationSteps.push(`Se ln(${numValue}) = ${roundToDecimals(calculatedResult, 6)}, então e^(${roundToDecimals(calculatedResult, 6)}) deve ser igual a ${numValue}`);
            const verification = Math.exp(calculatedResult);
            calculationSteps.push(`e^${roundToDecimals(calculatedResult, 6)} = ${roundToDecimals(verification, 6)} ≈ ${numValue}`);
            
            // Casos especiais
            if (Math.abs(numValue - Math.E) < 0.0001) {
                stepCount++;
                calculationSteps.push(`Passo ${stepCount}: Nota sobre propriedades especiais`);
                calculationSteps.push(`ln(e) = 1 porque e^1 = e. Este é um caso especial importante do logaritmo natural.`);
            } else if (numValue === 1) {
                stepCount++;
                calculationSteps.push(`Passo ${stepCount}: Nota sobre propriedades especiais`);
                calculationSteps.push(`ln(1) = 0 porque e^0 = 1. O logaritmo de 1 em qualquer base é sempre 0.`);
            }
        }
        else if (logType === 'base10') {
            calculationSteps.push(`Passo ${stepCount}: Calcular o logaritmo de base 10 (logaritmo comum) de ${numValue}`);
            stepCount++;
            
            calculationSteps.push(`Passo ${stepCount}: O logaritmo de base 10 é frequentemente usado em aplicações científicas e de engenharia`);
            calculatedResult = Math.log10(numValue);
            calculationSteps.push(`log₁₀(${numValue}) = ${roundToDecimals(calculatedResult, 6)}`);
            stepCount++;
            
            // Verificação do resultado
            calculationSteps.push(`Passo ${stepCount}: Verificar o resultado usando a definição de logaritmo`);
            calculationSteps.push(`Se log₁₀(${numValue}) = ${roundToDecimals(calculatedResult, 6)}, então 10^(${roundToDecimals(calculatedResult, 6)}) deve ser igual a ${numValue}`);
            const verification = Math.pow(10, calculatedResult);
            calculationSteps.push(`10^${roundToDecimals(calculatedResult, 6)} = ${roundToDecimals(verification, 6)} ≈ ${numValue}`);
            
            // Casos especiais
            if (numValue === 10) {
                stepCount++;
                calculationSteps.push(`Passo ${stepCount}: Nota sobre propriedades especiais`);
                calculationSteps.push(`log₁₀(10) = 1 porque 10^1 = 10. Este é um caso especial importante.`);
            } else if (numValue === 100) {
                stepCount++;
                calculationSteps.push(`Passo ${stepCount}: Nota sobre propriedades especiais`);
                calculationSteps.push(`log₁₀(100) = 2 porque 10^2 = 100. Note que log₁₀(10^n) = n para qualquer n.`);
            } else if (numValue === 1) {
                stepCount++;
                calculationSteps.push(`Passo ${stepCount}: Nota sobre propriedades especiais`);
                calculationSteps.push(`log₁₀(1) = 0 porque 10^0 = 1. O logaritmo de 1 em qualquer base é sempre 0.`);
            }
        }
        else if (logType === 'custom') {
            const numBase = parseFloat(customBase);

            if (isNaN(numBase)) {
                setErrorMessage('A base personalizada deve ser um número válido.');
                return;
            }

            if (numBase <= 0 || numBase === 1) {
                setErrorMessage('A base personalizada deve ser um número positivo e diferente de 1.');
                return;
            }

            calculationSteps.push(`Passo ${stepCount}: Calcular o logaritmo com a base personalizada ${numBase} de ${numValue}`);
            stepCount++;
            
            calculationSteps.push(`Passo ${stepCount}: Usamos a fórmula de mudança de base: log_b(x) = ln(x) / ln(b)`);
            stepCount++;

            const lnValue = Math.log(numValue);
            const lnBase = Math.log(numBase);
            
            calculationSteps.push(`Passo ${stepCount}: Calculamos os valores de ln(${numValue}) e ln(${numBase})`);
            calculationSteps.push(`ln(${numValue}) = ${roundToDecimals(lnValue, 6)}`);
            calculationSteps.push(`ln(${numBase}) = ${roundToDecimals(lnBase, 6)}`);
            stepCount++;
            
            calculatedResult = lnValue / lnBase;
            
            calculationSteps.push(`Passo ${stepCount}: Aplicamos a fórmula de mudança de base`);
            calculationSteps.push(`log_${numBase}(${numValue}) = ln(${numValue}) / ln(${numBase})`);
            calculationSteps.push(`log_${numBase}(${numValue}) = ${roundToDecimals(lnValue, 6)} / ${roundToDecimals(lnBase, 6)} = ${roundToDecimals(calculatedResult, 6)}`);
        }
        else {
            setErrorMessage('Tipo de logaritmo não reconhecido.');
            return;
        }

        setResult(calculatedResult);
        setSteps(calculationSteps);
        setShowExplanation(true);
    };

    // Função para aplicar um exemplo
    const applyExample = (example: {type: 'natural' | 'base10' | 'custom', value: number, base?: number}) => {
        setLogType(example.type);
        setValue(example.value.toString());
        if (example.type === 'custom' && example.base) {
            setCustomBase(example.base.toString());
        }
    };

    // Filtrar exemplos baseados no tipo de logaritmo selecionado
    const getFilteredExamples = () => {
        return getLogarithmExamples().filter(example => example.type === logType);
    };

    // Função que gera os passos com estilização aprimorada
    const renderExplanationSteps = () => {
        return (
            <div className="space-y-4">
                {steps.map((step, index) => {
                    // Verificar se o passo começa com um padrão de número de passo como "Passo X:"
                    const stepMatch = step.match(/^(Passo \d+:)(.*)$/);
                    
                    // Verificar se o passo é um resultado de cálculo (contém um sinal de igual)
                    const calculationMatch = step.match(/^(ln|log|e\^|10\^)/);

                    // Verificar se o passo é uma explicação teórica
                    const explanationMatch = step.includes('é frequentemente usado') || 
                                           step.includes('Logaritmo natural') || 
                                           step.includes('fórmula de mudança de base');
                    
                    // Verificar se o passo é uma verificação/validação
                    const verificationMatch = step.includes('Verificar') || 
                                             step.includes('então') || 
                                             step.includes('deve ser igual') ||
                                             (step.includes('=') && step.includes('≈'));
                    
                    // Verificar se o passo é uma nota ou explicação adicional
                    const specialCaseMatch = step.includes('propriedades especiais') || 
                                            step.includes('caso especial') || 
                                            step.includes('porque');
                    
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
                    } else if (calculationMatch) {
                        // Se for um resultado de cálculo
                        return (
                            <div key={index} className="p-3 bg-blue-50 rounded-md ml-4 border-l-2 border-blue-300">
                                <p className="text-gray-800 font-medium text-lg">{step}</p>
                            </div>
                        );
                    } else if (explanationMatch) {
                        // Se for uma explicação teórica
                        return (
                            <div key={index} className="p-3 bg-indigo-50 rounded-md ml-4 border-l-2 border-indigo-300">
                                <p className="text-indigo-700">{step}</p>
                            </div>
                        );
                    } else if (verificationMatch) {
                        // Se for uma verificação
                        return (
                            <div key={index} className="p-3 bg-green-50 rounded-md ml-4 border-l-2 border-green-300">
                                <p className="text-green-700">{step}</p>
                            </div>
                        );
                    } else if (specialCaseMatch) {
                        // Se for uma nota sobre casos especiais
                        return (
                            <div key={index} className="p-3 bg-yellow-50 rounded-md ml-4 border-l-2 border-yellow-300">
                                <p className="text-yellow-700 italic">{step}</p>
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
          <h2 className="text-2xl font-bold">Calculadora de Logaritmos</h2>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-8">
            <p className="text-gray-700 mb-6">
                Essa calculadora ajuda a resolver problemas de logaritmos de diferentes bases.
                O logaritmo de um número é o expoente ao qual uma base deve ser elevada para produzir esse número.
            </p>

            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de logaritmo:
                </label>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                    <label className="inline-flex items-center">
                        <input
                            type="radio"
                            className="form-radio h-4 w-4 text-indigo-600"
                            checked={logType === 'natural'}
                            onChange={() => setLogType('natural')}
                        />
                        <span className="ml-2">Logaritmo natural (ln, base e)</span>
                    </label>
                    <label className="inline-flex items-center">
                        <input
                            type="radio"
                            className="form-radio h-4 w-4 text-indigo-600"
                            checked={logType === 'base10'}
                            onChange={() => setLogType('base10')}
                        />
                        <span className="ml-2">Logaritmo comum (log₁₀, base 10)</span>
                    </label>
                    <label className="inline-flex items-center">
                        <input
                            type="radio"
                            className="form-radio h-4 w-4 text-indigo-600"
                            checked={logType === 'custom'}
                            onChange={() => setLogType('custom')}
                        />
                        <span className="ml-2">Logaritmo personalizado</span>
                    </label>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Valor
                    </label>
                    <input
                        type="number"
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Digite um valor positivo"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        step="any"
                    />
                </div>

                {logType === 'custom' && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Base
                        </label>
                        <input
                            type="number"
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Digite uma base positiva e diferente de 1"
                            value={customBase}
                            onChange={(e) => setCustomBase(e.target.value)}
                            step="any"
                        />
                    </div>
                )}
            </div>

            {/* Exemplos de logaritmos */}
            <div className="mb-4">
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
                        {logType === 'natural' && `ln(${value}) = `}
                        {logType === 'base10' && `log₁₀(${value}) = `}
                        {logType === 'custom' && `log₍${customBase}₎(${value}) = `}
                        <span className="font-bold">{roundToDecimals(result, 6)}</span>
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
                                        <h5 className="font-medium text-gray-800 mb-2 border-b border-gray-200 pb-1">Definição e Propriedades</h5>
                                        <p className="text-gray-700 mb-3">
                                            O logaritmo de um número <span className="font-medium">N</span> na base <span className="font-medium">b</span> é 
                                            o expoente <span className="font-medium">x</span> ao qual devemos elevar <span className="font-medium">b</span> para 
                                            obter <span className="font-medium">N</span>.
                                        </p>
                                        <div className="bg-white p-3 rounded-md text-center border border-gray-100 shadow-sm mb-3">
                                            <p className="text-lg font-medium text-indigo-700">log<sub>b</sub>(N) = x ⟺ b<sup>x</sup> = N</p>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="p-2 bg-white rounded-md border border-gray-100 shadow-sm">
                                                <p className="text-sm">
                                                    <span className="font-medium text-indigo-700">Logaritmo Natural (ln):</span> Usa a base <span className="italic">e</span> ≈ 2,71828
                                                </p>
                                            </div>
                                            <div className="p-2 bg-white rounded-md border border-gray-100 shadow-sm">
                                                <p className="text-sm">
                                                    <span className="font-medium text-indigo-700">Logaritmo Decimal (log₁₀):</span> Usa a base 10
                                                </p>
                                            </div>
                                            <div className="p-2 bg-white rounded-md border border-gray-100 shadow-sm">
                                                <p className="text-sm">
                                                    <span className="font-medium text-indigo-700">Logaritmo Binário (log₂):</span> Usa a base 2 (comum em computação)
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <h5 className="font-medium text-gray-800 mb-2 border-b border-gray-200 pb-1">Propriedades dos Logaritmos</h5>
                                        <div className="space-y-2 mb-3">
                                            <div className="p-2 bg-indigo-50 rounded-md flex items-center">
                                                <div className="mr-2 w-20 text-center flex-shrink-0">
                                                    <span className="font-mono text-indigo-700">log<sub>b</sub>(xy)</span>
                                                </div>
                                                <span>= log<sub>b</sub>(x) + log<sub>b</sub>(y)</span>
                                            </div>
                                            <div className="p-2 bg-indigo-50 rounded-md flex items-center">
                                                <div className="mr-2 w-20 text-center flex-shrink-0">
                                                    <span className="font-mono text-indigo-700">log<sub>b</sub>(x/y)</span>
                                                </div>
                                                <span>= log<sub>b</sub>(x) - log<sub>b</sub>(y)</span>
                                            </div>
                                            <div className="p-2 bg-indigo-50 rounded-md flex items-center">
                                                <div className="mr-2 w-20 text-center flex-shrink-0">
                                                    <span className="font-mono text-indigo-700">log<sub>b</sub>(x<sup>n</sup>)</span>
                                                </div>
                                                <span>= n · log<sub>b</sub>(x)</span>
                                            </div>
                                            <div className="p-2 bg-indigo-50 rounded-md flex items-center">
                                                <div className="mr-2 w-20 text-center flex-shrink-0">
                                                    <span className="font-mono text-indigo-700">log<sub>b</sub>(1)</span>
                                                </div>
                                                <span>= 0</span>
                                            </div>
                                            <div className="p-2 bg-indigo-50 rounded-md flex items-center">
                                                <div className="mr-2 w-20 text-center flex-shrink-0">
                                                    <span className="font-mono text-indigo-700">log<sub>b</sub>(b)</span>
                                                </div>
                                                <span>= 1</span>
                                            </div>
                                            <div className="p-2 bg-indigo-50 rounded-md flex items-center">
                                                <div className="mr-2 w-20 text-center flex-shrink-0">
                                                    <span className="font-mono text-indigo-700">b<sup>log<sub>b</sub>(x)</sup></span>
                                                </div>
                                                <span>= x</span>
                                            </div>
                                        </div>
                                        <div className="p-3 bg-blue-50 rounded-md border-l-2 border-blue-300">
                                            <p className="text-sm text-blue-800 font-medium">Fórmula de mudança de base:</p>
                                            <p className="text-center text-blue-700 mt-1">log<sub>a</sub>(x) = log<sub>b</sub>(x) / log<sub>b</sub>(a)</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="mt-4">
                                    <h5 className="font-medium text-gray-800 mb-2 border-b border-gray-200 pb-1">Aplicações dos Logaritmos</h5>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                        <div className="p-3 bg-white rounded-md border border-gray-100 shadow-sm">
                                            <h6 className="text-indigo-700 font-medium mb-2">Ciência e Engenharia</h6>
                                            <ul className="text-sm space-y-1 list-disc pl-4">
                                                <li>Escala de decibéis (som)</li>
                                                <li>Escala Richter (terremotos)</li>
                                                <li>pH (acidez/alcalinidade)</li>
                                                <li>Luminosidade de estrelas</li>
                                            </ul>
                                        </div>
                                        <div className="p-3 bg-white rounded-md border border-gray-100 shadow-sm">
                                            <h6 className="text-indigo-700 font-medium mb-2">Matemática Financeira</h6>
                                            <ul className="text-sm space-y-1 list-disc pl-4">
                                                <li>Cálculo de juros compostos</li>
                                                <li>Tempo de duplicação de capital</li>
                                                <li>Taxa de crescimento</li>
                                                <li>Depreciação exponencial</li>
                                            </ul>
                                        </div>
                                        <div className="p-3 bg-white rounded-md border border-gray-100 shadow-sm">
                                            <h6 className="text-indigo-700 font-medium mb-2">Computação e Dados</h6>
                                            <ul className="text-sm space-y-1 list-disc pl-4">
                                                <li>Algoritmos de busca</li>
                                                <li>Teoria da informação</li>
                                                <li>Compressão de dados</li>
                                                <li>Machine learning (entropia)</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="mt-4 bg-yellow-50 p-3 rounded-md border-l-4 border-yellow-400">
                                    <h5 className="font-medium text-yellow-800 mb-1">Dica de Resolução</h5>
                                    <p className="text-gray-700 text-sm">
                                        Ao resolver equações com logaritmos, lembre-se que o logaritmo só é definido para valores positivos.
                                        Além disso, use as propriedades dos logaritmos para simplificar expressões complexas antes de resolver.
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

export default ResolvedorLogaritmo;
