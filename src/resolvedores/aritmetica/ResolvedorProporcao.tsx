import { useState } from 'react';
import { roundToDecimals } from '../../utils/mathUtils';
import { getProportionExamples } from '../../utils/mathUtilsTeoriaNumeros';
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

    // Função para aplicar um exemplo
    const applyExample = (example: { a: number, b: number, c: number, d: number, solveFor: 'a' | 'b' | 'c' | 'd' }) => {
        setA(example.a.toString());
        setB(example.b.toString());
        setC(example.c.toString());
        setD(example.d.toString());
        setSolveFor(example.solveFor);
    };

    // Função que filtra exemplos baseado na variável a resolver
    const getFilteredExamples = () => {
        return getProportionExamples().filter(example => example.solveFor === solveFor);
    };

    // Função que renderiza os passos com estilização aprimorada
    const renderExplanationSteps = () => {
        return (
            <div className="space-y-4">
                {steps.map((step, index) => {
                    // Verifica se o passo começa com um padrão de número de passo como "Passo X:"
                    const stepMatch = step.match(/^(Passo \d+:)(.*)$/);
                    
                    // Verifica se o passo inclui equações de resolução
                    const formulaMatch = step.includes('a = ') || 
                                         step.includes('b = ') || 
                                         step.includes('c = ') || 
                                         step.includes('d = ') ||
                                         step.match(/[abcd] = \([^)]+\)/);
                    
                    // Verifica se o passo mostra um cálculo numérico
                    const calculationMatch = step.match(/\d+(\.\d+)? [×÷] \d+(\.\d+)? = \d+(\.\d+)?/) ||
                                           step.match(/\d+(\.\d+)? [×÷×] \d+(\.\d+)? [÷] \d+(\.\d+)?/);
                    
                    // Verifica se o passo é uma verificação
                    const verificationMatch = step.includes('Verificar se') || 
                                           step.includes('proporção está correta') ||
                                           step.includes('Nota: Há uma pequena diferença');
                    
                    // Verifica se o passo explica um conceito ou abordagem
                    const explanationMatch = step.includes('Na proporção') || 
                                          step.includes('Utilizar a equação') ||
                                          step.includes('Identificar a proporção');
                    
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
                    } else if (explanationMatch) {
                        // Se for uma explicação de conceito/abordagem
                        return (
                            <div key={index} className="p-3 bg-indigo-50 rounded-md ml-4 border-l-2 border-indigo-300">
                                <p className="text-indigo-700">{step}</p>
                            </div>
                        );
                    } else if (formulaMatch) {
                        // Se for uma fórmula ou equação
                        return (
                            <div key={index} className="p-3 bg-blue-50 rounded-md ml-4 border-l-2 border-blue-300">
                                <p className="text-blue-700 font-medium">{step}</p>
                            </div>
                        );
                    } else if (calculationMatch) {
                        // Se for um cálculo numérico
                        return (
                            <div key={index} className="p-3 bg-purple-50 rounded-md ml-4 border-l-2 border-purple-300">
                                <p className="text-purple-700">{step}</p>
                            </div>
                        );
                    } else if (verificationMatch) {
                        // Se for uma verificação
                        return (
                            <div key={index} className="p-3 bg-green-50 rounded-md ml-4 border-l-2 border-green-300">
                                <p className="text-green-700">{step}</p>
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

                {/* Exemplos de proporção */}
                <div className="mb-6">
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
                                            <h5 className="font-medium text-gray-800 mb-2 border-b border-gray-200 pb-1">Entendendo Proporções</h5>
                                            <p className="text-gray-700 mb-3">
                                                Uma proporção é uma igualdade entre duas razões, expressa na forma a:b = c:d ou a/b = c/d.
                                                Quando duas razões são iguais, dizemos que são proporcionais.
                                            </p>
                                            <div className="bg-white p-3 rounded-md border border-gray-100 shadow-sm mb-3">
                                                <div className="text-center font-medium text-indigo-700">
                                                    <p>a / b = c / d</p>
                                                    <p className="text-sm mt-1">Propriedade fundamental: a × d = b × c</p>
                                                </div>
                                            </div>
                                            <div className="p-3 bg-indigo-50 rounded-md">
                                                <p className="text-sm text-indigo-700">
                                                    <span className="font-medium">Exemplo:</span> Na proporção 2/5 = 4/10, podemos verificar:
                                                    <br />
                                                    2 × 10 = 5 × 4 → 20 = 20 ✓
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <h5 className="font-medium text-gray-800 mb-2 border-b border-gray-200 pb-1">Tipos de Proporções</h5>
                                            <div className="space-y-3">
                                                <div className="p-3 bg-white rounded-md border border-gray-100 shadow-sm">
                                                    <h6 className="text-indigo-700 font-medium mb-1">Proporção Direta</h6>
                                                    <p className="text-sm text-gray-700">
                                                        Quando duas grandezas aumentam ou diminuem na mesma proporção.
                                                        <br />
                                                        <span className="text-xs italic text-gray-500">Ex: Quanto mais horas de trabalho, mais dinheiro ganho.</span>
                                                    </p>
                                                </div>
                                                <div className="p-3 bg-white rounded-md border border-gray-100 shadow-sm">
                                                    <h6 className="text-indigo-700 font-medium mb-1">Proporção Inversa</h6>
                                                    <p className="text-sm text-gray-700">
                                                        Quando uma grandeza aumenta e a outra diminui na mesma proporção.
                                                        <br />
                                                        <span className="text-xs italic text-gray-500">Ex: Mais trabalhadores, menos tempo para concluir uma tarefa.</span>
                                                    </p>
                                                </div>
                                                <div className="p-3 bg-white rounded-md border border-gray-100 shadow-sm">
                                                    <h6 className="text-indigo-700 font-medium mb-1">Regra de Três</h6>
                                                    <p className="text-sm text-gray-700">
                                                        Método para resolver problemas de proporção com três valores conhecidos e um desconhecido.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-4">
                                        <h5 className="font-medium text-gray-800 mb-2 border-b border-gray-200 pb-1">Aplicações Práticas</h5>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="p-3 bg-white rounded-md border border-gray-100 shadow-sm">
                                                <h6 className="text-indigo-700 font-medium mb-2">Escala e Mapas</h6>
                                                <div className="text-sm text-gray-700">
                                                    <p className="mb-2">
                                                        Em mapas, a escala é uma proporção entre a distância no mapa e a distância real.
                                                    </p>
                                                    <div className="p-2 bg-blue-50 rounded-md">
                                                        <p className="mb-1"><span className="font-medium">Problema:</span> Se 1 cm no mapa representa 10 km na realidade, quantos km correspondem a 3,5 cm?</p>
                                                        <p><span className="font-medium">Solução:</span> 1 cm → 10 km, então 3,5 cm → 35 km</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="p-3 bg-white rounded-md border border-gray-100 shadow-sm">
                                                <h6 className="text-indigo-700 font-medium mb-2">Receitas Culinárias</h6>
                                                <div className="text-sm text-gray-700">
                                                    <p className="mb-2">
                                                        Ao ajustar receitas para mais ou menos porções, usamos proporções.
                                                    </p>
                                                    <div className="p-2 bg-blue-50 rounded-md">
                                                        <p className="mb-1"><span className="font-medium">Problema:</span> Uma receita para 4 pessoas usa 300g de farinha. Quanto preciso para 10 pessoas?</p>
                                                        <p><span className="font-medium">Solução:</span> 4 pessoas → 300g, então 10 pessoas → 750g</p>
                                                    </div>
                                                </div>
                                            </div>
                            </div>
                            
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                                            <div className="p-3 bg-white rounded-md border border-gray-100 shadow-sm">
                                                <h6 className="text-indigo-700 font-medium mb-2">Conversão de Unidades</h6>
                                                <div className="text-sm text-gray-700">
                                                    <p className="mb-2">
                                                        Podemos usar proporções para converter entre diferentes unidades de medida.
                                                    </p>
                                                    <div className="p-2 bg-blue-50 rounded-md">
                                                        <p className="mb-1"><span className="font-medium">Problema:</span> Converter 20 metros/segundo para km/h</p>
                                                        <p><span className="font-medium">Solução:</span> 20 m/s × (3600 s/1 h) × (1 km/1000 m) = 72 km/h</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="p-3 bg-white rounded-md border border-gray-100 shadow-sm">
                                                <h6 className="text-indigo-700 font-medium mb-2">Preços e Compras</h6>
                                                <div className="text-sm text-gray-700">
                                                    <p className="mb-2">
                                                        Comparar preços e calcular valores proporcionais em compras.
                                                    </p>
                                                    <div className="p-2 bg-blue-50 rounded-md">
                                                        <p className="mb-1"><span className="font-medium">Problema:</span> Se 3 maçãs custam R$2, quanto custam 7 maçãs?</p>
                                                        <p><span className="font-medium">Solução:</span> 3 maçãs → R$2, então 7 maçãs → R$4,67</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-4 p-3 bg-green-50 rounded-md border-l-4 border-green-400">
                                        <h5 className="font-medium text-green-800 mb-1">Métodos de Resolução</h5>
                                        <ul className="text-sm space-y-2 list-disc pl-4 text-gray-700">
                                            <li><span className="font-medium">Produto cruzado:</span> Multiplique em cruz (a × d = b × c) e isole a variável desconhecida</li>
                                            <li><span className="font-medium">Frações equivalentes:</span> Manipule as frações até que ambas tenham o mesmo numerador ou denominador</li>
                                            <li><span className="font-medium">Constante de proporcionalidade:</span> Encontre a razão constante k onde y = kx (proporção direta) ou y = k/x (proporção inversa)</li>
                                </ul>
                                    </div>
                                    
                                    <div className="mt-4 p-3 bg-indigo-50 rounded-md border border-indigo-100">
                                        <h5 className="font-medium text-indigo-800 mb-1 flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                            </svg>
                                            Dica de Resolução
                                        </h5>
                                        <p className="text-sm text-indigo-700">
                                            Para verificar se uma proporção está correta, verifique sempre se o produto cruzado (a × d = b × c) é verdadeiro. Isso funciona para qualquer proporção válida e é uma ótima maneira de verificar seus cálculos.
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

export default ResolvedorProporcao;