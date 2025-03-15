import { useState } from 'react';
import { roundToDecimals } from '../../utils/mathUtils';
import { HiCalculator } from 'react-icons/hi';

const ResolvedorProporcao: React.FC = () => {
    const [a, setA] = useState<string>('');
    const [b, setB] = useState<string>('');
    const [c, setC] = useState<string>('');
    const [d, setD] = useState<string>('');
    const [solveFor, setSolveFor] = useState<'a' | 'b' | 'c' | 'd'>('d');
    const [result, setResult] = useState<number | null>(null);
    const [steps, setSteps] = useState<string[]>([]);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [showExplanation, setShowExplanation] = useState<boolean>(false);

    const handleSolve = () => {
        // Limpa resultados anteriores
        setResult(null);
        setErrorMessage('');
        setSteps([]);
        
        // Converte os inputs para números
        const numA = parseFloat(a);
        const numB = parseFloat(b);
        const numC = parseFloat(c);
        const numD = parseFloat(d);
        
        // Calcula o resultado e gera os passos
        let calculatedValue: number;
        const calculationSteps = [];
        let stepCount = 1;
        
        calculationSteps.push(`Passo ${stepCount}: Identificar a proporção e a variável a ser isolada`);
        calculationSteps.push(`Na proporção a:b = c:d, ${solveFor} é a variável desconhecida.`);
        stepCount++;
        
        calculationSteps.push(`Passo ${stepCount}: Utilizar a equação equivalente a × d = b × c para isolar ${solveFor}`);
        stepCount++;
        
        switch (solveFor) {
            case 'a':
                if (isNaN(numB) || isNaN(numC) || isNaN(numD)) {
                    setErrorMessage('Por favor, preencha todos os campos necessários (b, c e d).');
                    return;
                }
                if (numD === 0) {
                    setErrorMessage('Não é possível dividir por zero. O valor de d não pode ser zero.');
                    return;
                }
                
                calculationSteps.push(`Passo ${stepCount}: Resolver para a: a = (b × c) / d`);
                calculationSteps.push(`a = (${numB} × ${numC}) / ${numD}`);
                calculationSteps.push(`a = ${numB * numC} / ${numD}`);
                
                calculatedValue = (numB * numC) / numD;
                calculationSteps.push(`a = ${roundToDecimals(calculatedValue, 4)}`);
                stepCount++;
                break;
                
            case 'b':
                if (isNaN(numA) || isNaN(numC) || isNaN(numD)) {
                    setErrorMessage('Por favor, preencha todos os campos necessários (a, c e d).');
                    return;
                }
                if (numC === 0) {
                    setErrorMessage('Não é possível dividir por zero. O valor de c não pode ser zero.');
                    return;
                }
                
                calculationSteps.push(`Passo ${stepCount}: Resolver para b: b = (a × d) / c`);
                calculationSteps.push(`b = (${numA} × ${numD}) / ${numC}`);
                calculationSteps.push(`b = ${numA * numD} / ${numC}`);
                
                calculatedValue = (numA * numD) / numC;
                calculationSteps.push(`b = ${roundToDecimals(calculatedValue, 4)}`);
                stepCount++;
                break;
                
            case 'c':
                if (isNaN(numA) || isNaN(numB) || isNaN(numD)) {
                    setErrorMessage('Por favor, preencha todos os campos necessários (a, b e d).');
                    return;
                }
                if (numA === 0) {
                    setErrorMessage('Não é possível dividir por zero. O valor de a não pode ser zero.');
                    return;
                }
                
                calculationSteps.push(`Passo ${stepCount}: Resolver para c: c = (a × d) / b`);
                calculationSteps.push(`c = (${numA} × ${numD}) / ${numB}`);
                calculationSteps.push(`c = ${numA * numD} / ${numB}`);
                
                calculatedValue = (numA * numD) / numB;
                calculationSteps.push(`c = ${roundToDecimals(calculatedValue, 4)}`);
                stepCount++;
                break;
                
            case 'd':
                if (isNaN(numA) || isNaN(numB) || isNaN(numC)) {
                    setErrorMessage('Por favor, preencha todos os campos necessários (a, b e c).');
                    return;
                }
                if (numA === 0) {
                    setErrorMessage('Não é possível dividir por zero. O valor de a não pode ser zero.');
                    return;
                }
                
                calculationSteps.push(`Passo ${stepCount}: Resolver para d: d = (b × c) / a`);
                calculationSteps.push(`d = (${numB} × ${numC}) / ${numA}`);
                calculationSteps.push(`d = ${numB * numC} / ${numA}`);
                
                calculatedValue = (numB * numC) / numA;
                calculationSteps.push(`d = ${roundToDecimals(calculatedValue, 4)}`);
                stepCount++;
                break;
        }
        
        // Verificação da proporção
        calculationSteps.push(`Passo ${stepCount}: Verificar se a proporção está correta`);
        
        const aVal = solveFor === 'a' ? calculatedValue : numA;
        const bVal = solveFor === 'b' ? calculatedValue : numB;
        const cVal = solveFor === 'c' ? calculatedValue : numC;
        const dVal = solveFor === 'd' ? calculatedValue : numD;
        
        calculationSteps.push(`Verificar se ${aVal}:${bVal} = ${cVal}:${dVal}`);
        calculationSteps.push(`Verificar se ${aVal} × ${dVal} = ${bVal} × ${cVal}`);
        
        const leftSide = aVal * dVal;
        const rightSide = bVal * cVal;
        
        calculationSteps.push(`${roundToDecimals(leftSide, 4)} = ${roundToDecimals(rightSide, 4)}`);
        
        if (Math.abs(leftSide - rightSide) < 0.0001) {
            calculationSteps.push(`A proporção está correta. ✓`);
        } else {
            calculationSteps.push(`Nota: Há uma pequena diferença devido ao arredondamento.`);
        }
        
        setResult(roundToDecimals(calculatedValue, 4));
        setSteps(calculationSteps);
        setShowExplanation(true);
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center mb-6">
                <HiCalculator className="h-6 w-6 text-indigo-600 mr-2" />
                <h2 className="text-2xl font-bold">Calculadora de Proporções</h2>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-8">
                <p className="text-gray-700 mb-6">
                    A proporção é uma equação que afirma que duas razões são iguais: a/b = c/d.
                    Essa calculadora ajuda você a resolver a proporção para qualquer valor desconhecido.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center">
                        <input
                        type="number"
                        value={solveFor === 'a' ? '' : a}
                        onChange={(e) => setA(e.target.value)}
                        disabled={solveFor === 'a'}
                        className={`w-full p-2 border border-gray-300 rounded-l-md focus:ring-indigo-500 focus:border-indigo-500 ${solveFor === 'a' ? 'bg-gray-100' : ''}`}
                        placeholder="a"
                        />
                        <div className="mx-2 text-lg">/</div>
                        <input
                        type="number"
                        value={solveFor === 'b' ? '' : b}
                        onChange={(e) => setB(e.target.value)}
                        disabled={solveFor === 'b'}
                        className={`w-full p-2 border border-gray-300 rounded-r-md focus:ring-indigo-500 focus:border-indigo-500 ${solveFor === 'b' ? 'bg-gray-100' : ''}`}
                        placeholder="b"
                        />
                    </div>

                    <div className="flex items-center">
                        <input
                        type="number"
                        value={solveFor === 'c' ? '' : c}
                        onChange={(e) => setC(e.target.value)}
                        disabled={solveFor === 'c'}
                        className={`w-full p-2 border border-gray-300 rounded-l-md focus:ring-indigo-500 focus:border-indigo-500 ${solveFor === 'c' ? 'bg-gray-100' : ''}`}
                        placeholder="c"
                        />
                        <div className="mx-2 text-lg">/</div>
                        <input
                        type="number"
                        value={solveFor === 'd' ? '' : d}
                        onChange={(e) => setD(e.target.value)}
                        disabled={solveFor === 'd'}
                        className={`w-full p-2 border border-gray-300 rounded-r-md focus:ring-indigo-500 focus:border-indigo-500 ${solveFor === 'd' ? 'bg-gray-100' : ''}`}
                        placeholder="d"
                        />
                    </div>
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Resolver para:
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                        <label className="inline-flex items-center">
                            <input
                            type="radio"
                            checked={solveFor === 'a'}
                            onChange={() => setSolveFor('a')}
                            className="form-radio h-4 w-4 text-indigo-600"
                            />
                            <span className="ml-2">a</span>
                        </label>
                        <label className="inline-flex items-center">
                            <input
                            type="radio"
                            checked={solveFor === 'b'}
                            onChange={() => setSolveFor('b')}
                            className="form-radio h-4 w-4 text-indigo-600"
                            />
                            <span className="ml-2">b</span>
                        </label>
                        <label className="inline-flex items-center">
                            <input
                            type="radio"
                            checked={solveFor === 'c'}
                            onChange={() => setSolveFor('c')}
                            className="form-radio h-4 w-4 text-indigo-600"
                            />  
                            <span className="ml-2">c</span>
                        </label>
                        <label className="inline-flex items-center">
                            <input
                            type="radio"
                            checked={solveFor === 'd'}
                            onChange={() => setSolveFor('d')}
                            className="form-radio h-4 w-4 text-indigo-600"
                            />
                            <span className="ml-2">d</span>
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

            {result !== null && (
                <div className="space-y-6">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-5">
                        <h3 className="text-lg font-medium text-green-800 mb-2">Resultado</h3>
                        <p className="text-xl">
                            {solveFor.toUpperCase()} = <span className="font-bold">{result}</span>
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
                                            <div key={index} className="p-3 bg-gray-50 rounded-md ml-4">
                                                <p className="text-gray-800">{step}</p>
                                            </div>
                                        );
                                    }
                                })}
                            </div>
                            
                            <div className="mt-6 p-4 bg-blue-50 rounded-md">
                                <h4 className="font-medium text-blue-800 mb-2">Conceito Matemático</h4>
                                <p className="text-gray-700">
                                    Proporções são amplamente utilizadas em várias áreas, como:
                                </p>
                                <ul className="list-disc list-inside mt-2 space-y-1 text-gray-700">
                                    <li>Converter entre diferentes unidades de medida</li>
                                    <li>Ajustar receitas para diferentes porções</li>
                                    <li>Calcular preços (ex.: "se 3 maçãs custam R$2, quanto custam 7 maçãs?")</li>
                                    <li>Escalas de mapas (ex.: "se 1 polegada no mapa representa 10 milhas, quantas milhas são representadas por 3,5 polegadas?")</li>  
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ResolvedorProporcao;