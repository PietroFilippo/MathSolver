import { useState } from 'react';
import { arredondarParaDecimais } from '../utils/mathUtils';
import { HiCalculator } from 'react-icons/hi';

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
        const roundedResult = arredondarParaDecimais(result, 4);

        setSolution(roundedResult);

        // Gera os passos
        const calculationSteps = [];
        calculationSteps.push(`Passo 1: Começamos com a equação ${numA}x + ${numB} = ${numC}`);
        calculationSteps.push(`Passo 2: Subtraímos ${numB} de ambos os lados para isolar o termo com x:`);
        calculationSteps.push(`${numA}x + ${numB} - ${numB} = ${numC} - ${numB}`);
        calculationSteps.push(`${numA}x = ${numC - numB}`);
        calculationSteps.push(`Passo 3: Dividimos ambos os lados pelo coeficiente de x (${numA})`);
        calculationSteps.push(`${numA}x / ${numA} = (${numC - numB}) / ${numA}`);
        calculationSteps.push(`x = ${roundedResult}`);

        // Passo de verificação
        const verification = numA * roundedResult + numB;
        calculationSteps.push(`Passo 4: Verifica a solução substituindo x = ${roundedResult} na equação original:`);
        calculationSteps.push(`${numA} * ${roundedResult} + ${numB} = ${arredondarParaDecimais(verification, 4)}`);

        if (Math.abs(verification - numC) < 0.0001) {
            calculationSteps.push(`${arredondarParaDecimais(verification, 4)} = ${numC} ✓`);
        } else {
            calculationSteps.push(`Nota: A solução pode ter uma pequena diferença devido ao arredondamento.`);
        }

        setSteps(calculationSteps);
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
                            
                            <div className="space-y-4">
                                {steps.map((step, index) => {
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
                                <p className="text-gray-700">
                                    Uma equação de primeiro grau (também chamada de equação linear) contém uma variável elevada apenas à potência de 1.
                                    Os passos gerais para resolver esse tipo de equação são:
                                </p>
                                <ol className="list-decimal list-inside mt-2 space-y-1 text-gray-700">
                                    <li>Isolar o termo da variável em um lado da equação</li>
                                    <li>Isolar a variável dividindo ambos os lados pelo seu coeficiente</li>
                                    <li>Verificar a solução substituindo-a na equação original</li>
                                </ol>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ResolvedorEquacaoPrimeiroGrau;
