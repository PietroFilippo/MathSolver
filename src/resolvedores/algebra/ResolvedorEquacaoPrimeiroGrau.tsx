import { useState } from 'react';
import { roundToDecimals } from '../../utils/mathUtils';
import { HiCalculator } from 'react-icons/hi';
import { getLinearExamples } from '../../utils/mathUtilsAlgebra';

const ResolvedorEquacaoPrimeiroGrau: React.FC = () => {
    const [a, setA] = useState<string>('');
    const [b, setB] = useState<string>('');
    const [c, setC] = useState<string>('');
    const [solution, setSolution] = useState<number | null>(null);
    const [steps, setSteps] = useState<string[]>([]);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [showExplanation, setShowExplanation] = useState<boolean>(true);

    const handleSolve = () => {
        // Reseta os estados
        setErrorMessage('');
        setSolution(null);
        setSteps([]);

        const numA = parseFloat(a);
        const numB = parseFloat(b);
        const numC = parseFloat(c);

        if (isNaN(numA) || isNaN(numB) || isNaN(numC)) {
            setErrorMessage('Por favor, insira números válidos para a, b e c');
            return;
        }

        if (numA === 0) {
            setErrorMessage('O coeficiente de x não pode ser zero na equação de primeiro grau');
            return;
        }

        const result = (numC - numB) / numA;
        const roundedResult = roundToDecimals(result, 4);

        setSolution(roundedResult);

        // Gera os passos
        const calculationSteps = [];
        let stepCount = 1;
        
        calculationSteps.push(`Passo ${stepCount}: Começamos com a equação ${numA}x + ${numB} = ${numC}`);
        stepCount++;
        
        calculationSteps.push(`Passo ${stepCount}: Subtraímos ${numB} de ambos os lados para isolar o termo com x:`);
        calculationSteps.push(`${numA}x + ${numB} - ${numB} = ${numC} - ${numB}`);
        calculationSteps.push(`${numA}x = ${numC - numB}`);
        stepCount++;
        
        calculationSteps.push(`Passo ${stepCount}: Dividimos ambos os lados pelo coeficiente de x (${numA})`);
        calculationSteps.push(`${numA}x / ${numA} = (${numC - numB}) / ${numA}`);
        calculationSteps.push(`x = ${roundedResult}`);
        stepCount++;

        // Passo de verificação
        const verification = numA * roundedResult + numB;
        calculationSteps.push(`Passo ${stepCount}: Verifica a solução substituindo x = ${roundedResult} na equação original:`);
        calculationSteps.push(`${numA} * ${roundedResult} + ${numB} = ${roundToDecimals(verification, 4)}`);

        if (Math.abs(verification - numC) < 0.0001) {
            calculationSteps.push(`${roundToDecimals(verification, 4)} = ${numC} ✓`);
        } else {
            calculationSteps.push(`Nota: A solução pode ter uma pequena diferença devido ao arredondamento.`);
        }

        setSteps(calculationSteps);
    };

    // Função para aplicar um exemplo aos inputs
    const applyExample = (example: {a: number, b: number, c: number}) => {
        setA(example.a.toString());
        setB(example.b.toString());
        setC(example.c.toString());
    };

    // Função que gera os passos com estilização aprimorada
    const renderExplanationSteps = () => {
        return (
            <div className="space-y-4">
                {steps.map((step, index) => {
                    // Verificar se o passo começa com um padrão de número de passo como "Passo X:"
                    const stepMatch = step.match(/^(Passo \d+:)(.*)$/);
                    
                    // Verificar se o passo representa uma equação ou operação matemática
                    const equationMatch = step.match(/^([0-9x\s\+\-\*\/\(\)=]+)$/);
                    
                    // Verificar se o passo contém uma verificação/validação
                    const verificationMatch = step.includes("✓") || step.includes("verifica") || step.includes("Verifica");
                    
                    // Verificar se o passo é uma nota ou explicação adicional
                    const noteMatch = step.startsWith("Nota:");
                    
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
                    } else if (equationMatch) {
                        // Se for uma equação matemática, destacá-la
                        return (
                            <div key={index} className="p-3 bg-blue-50 rounded-md ml-4 border-l-2 border-blue-300">
                                <div className="flex flex-col">
                                    <span className="text-gray-800 font-medium text-lg">{step}</span>
                                </div>
                            </div>
                        );
                    } else if (verificationMatch) {
                        // Se for uma verificação ou validação
                        return (
                            <div key={index} className="p-3 bg-green-50 rounded-md ml-4 border-l-2 border-green-300">
                                <p className="text-green-700">{step}</p>
                            </div>
                        );
                    } else if (noteMatch) {
                        // Se for uma nota ou observação
                        return (
                            <div key={index} className="p-2 bg-yellow-50 rounded-md ml-4 text-sm text-yellow-700 italic border-l-2 border-yellow-300">
                                {step}
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
                <h2 className="text-2xl font-bold">Equações de Primeiro Grau</h2>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-8">
                <p className="text-gray-700 mb-6">
                    Esta calculadora resolve equações de primeiro grau na forma ax + b = c, 
                    onde a, b e c são constantes e x é a variável a ser resolvida.
                </p>
                
                <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Insira os coeficientes para: ax + b = c</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                a (coeficiente de x)
                            </label>
                            <input
                                type="number"
                                value={a}
                                onChange={(e) => setA(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Digite o valor de a"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                b (termo constante)
                            </label>
                            <input
                                type="number"
                                value={b}
                                onChange={(e) => setB(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Digite o valor de b"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                c (lado direito)
                            </label>
                            <input
                                type="number"
                                value={c}
                                onChange={(e) => setC(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Digite o valor de c"
                            />
                        </div>
                    </div>
                </div>

                {/* Exemplos de equações */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Exemplos
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {getLinearExamples().map((example, index) => (
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
                    Resolver Equação
                </button>
                
                {errorMessage && (
                    <div className="mt-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-md">
                        {errorMessage}
                    </div>
                )}
            </div>
            
            {solution !== null && (
                <div className="space-y-6">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-5">
                        <h3 className="text-lg font-medium text-green-800 mb-2">Resultado</h3>
                        <p className="text-xl">
                            Para a equação {a}x + {b} = {c}
                        </p>
                        <p className="text-xl font-bold mt-2">
                            x = {solution}
                        </p>
                        
                        <button 
                            onClick={() => setShowExplanation(!showExplanation)}
                            className="mt-4 text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center"
                        >
                            {showExplanation ? "Ocultar explicação detalhada" : "Mostrar explicação detalhada"}
                        </button>
                    </div>
                    
                    {showExplanation && steps.length > 0 && (
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
                                    <div className="flex flex-col md:flex-row gap-4">
                                        <div className="flex-1">
                                            <h5 className="font-medium text-gray-800 mb-2 border-b border-gray-200 pb-1">Definição</h5>
                                            <p className="text-gray-700">
                                                Uma equação de primeiro grau (também chamada de equação linear) contém uma variável elevada apenas à potência de 1.
                                            </p>
                                        </div>
                                        <div className="flex-1">
                                            <h5 className="font-medium text-gray-800 mb-2 border-b border-gray-200 pb-1">Forma Geral</h5>
                                            <div className="bg-white p-3 rounded-md text-center border border-gray-100 shadow-sm">
                                                <span className="text-lg font-medium text-indigo-700">ax + b = c</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-4">
                                        <h5 className="font-medium text-gray-800 mb-2 border-b border-gray-200 pb-1">Método de Resolução</h5>
                                        <ol className="list-decimal list-inside space-y-2 text-gray-700">
                                            <li className="p-2 hover:bg-blue-50 rounded transition-colors">
                                                <span className="font-medium">Isolar o termo da variável:</span> Mover todos os termos com a variável para um lado da equação e os valores constantes para o outro.
                                            </li>
                                            <li className="p-2 hover:bg-blue-50 rounded transition-colors">
                                                <span className="font-medium">Isolar a variável:</span> Dividir ambos os lados pelo coeficiente da variável.
                                            </li>
                                            <li className="p-2 hover:bg-blue-50 rounded transition-colors">
                                                <span className="font-medium">Verificar a solução:</span> Substituir o valor encontrado na equação original para confirmar.
                                            </li>
                                        </ol>
                                    </div>
                                    
                                    <div className="mt-4 bg-yellow-50 p-3 rounded-md border-l-4 border-yellow-400">
                                        <h5 className="font-medium text-yellow-800 mb-1">Aplicações</h5>
                                        <p className="text-gray-700 text-sm">
                                            Equações lineares são usadas em diversos campos como economia (preço vs. demanda), 
                                            física (movimento uniforme), finanças (juros simples) e problemas cotidianos.
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

export default ResolvedorEquacaoPrimeiroGrau;
