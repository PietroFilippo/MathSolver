import { useState } from 'react';
import { roundToDecimals } from '../../utils/mathUtils';
import { HiCalculator } from 'react-icons/hi';
import { getQuadraticExamples } from '../../utils/mathUtilsAlgebra';

const ResolvedorEquacaoQuadratica: React.FC = () => {
    const [a, setA] = useState<string>('');
    const [b, setB] = useState<string>('');
    const [c, setC] = useState<string>('');

    const [solution, setSolution] = useState<{ x1: number | null; x2: number | null } | null>(null);
    const [solutionType, setSolutionType] = useState<'real' | 'repeated' | 'complex' | null>(null);
    const [showExplanation, setShowExplanation] = useState<boolean>(true);
    const [steps, setSteps] = useState<string[]>([]);
    const [errorMessage, setErrorMessage] = useState<string>('');

    const handleSolve = () => {
        // Reseta os estados
        setErrorMessage('');
        setSolution(null);
        setSteps([]);
        setSolutionType(null);
        
        // Converte os valores de entrada para números
        const numA = parseFloat(a);
        const numB = parseFloat(b);
        const numC = parseFloat(c);

        // Valida os valores de entrada
        if (isNaN(numA) || isNaN(numB) || isNaN(numC)) {
            setErrorMessage('Por favor, insira números válidos para a, b e c');
            return;
        }

        if (numA === 0) {
            setErrorMessage('O coeficiente de x² não pode ser zero na equação quadrática.');
            return;
        }

        // Calcula o discriminante
        const discriminant = numB * numB - 4 * numA * numC;

        const calculationSteps = [];
        let stepCount = 1;
        
        calculationSteps.push(`Passo ${stepCount}: Escrever a equação quadrática na forma padrão`);
        calculationSteps.push(`A equação quadrática padrão tem o formato ax² + bx + c = 0, onde a, b e c são constantes.`);
        calculationSteps.push(`Com os valores fornecidos: ${numA}x² + ${numB}x + ${numC} = 0`);
        stepCount++;
        
        calculationSteps.push(`Passo ${stepCount}: Calcular o discriminante (b² - 4ac)`);
        calculationSteps.push(`O discriminante determina quantas soluções reais a equação possui.`);
        calculationSteps.push(`Discriminante = b² - 4ac`);
        calculationSteps.push(`Discriminante = ${numB}² - 4 × ${numA} × ${numC}`);
        calculationSteps.push(`Discriminante = ${numB * numB} - ${4 * numA * numC}`);
        calculationSteps.push(`Discriminante = ${discriminant}`);
        stepCount++;
        
        calculationSteps.push(`Passo ${stepCount}: Usar a fórmula de Bhaskara para encontrar as raízes`);
        calculationSteps.push(`A fórmula de Bhaskara (ou fórmula quadrática) é: x = (-b ± √(discriminante)) / (2a)`);
        stepCount++;

        if (discriminant > 0) {
            // Duas raízes reais e distintas
            const sqrtDiscriminant = Math.sqrt(discriminant);
            const x1 = (-numB + sqrtDiscriminant) / (2 * numA);
            const x2 = (-numB - sqrtDiscriminant) / (2 * numA);

            calculationSteps.push(`Passo ${stepCount}: Como o discriminante (${discriminant}) é positivo, temos duas raízes reais e distintas`);
            
            calculationSteps.push(`Calculando x₁ (usando o sinal + na fórmula):`);
            calculationSteps.push(`x₁ = (-${numB} + √${discriminant}) / (2 × ${numA})`);
            calculationSteps.push(`x₁ = (${-numB} + ${roundToDecimals(sqrtDiscriminant, 4)}) / ${2 * numA}`);
            calculationSteps.push(`x₁ = ${roundToDecimals(-numB + sqrtDiscriminant, 4)} / ${2 * numA}`);
            calculationSteps.push(`x₁ = ${roundToDecimals(x1, 4)}`);
            
            calculationSteps.push(`Calculando x₂ (usando o sinal - na fórmula):`);
            calculationSteps.push(`x₂ = (-${numB} - √${discriminant}) / (2 × ${numA})`);
            calculationSteps.push(`x₂ = (${-numB} - ${roundToDecimals(sqrtDiscriminant, 4)}) / ${2 * numA}`);
            calculationSteps.push(`x₂ = ${roundToDecimals(-numB - sqrtDiscriminant, 4)} / ${2 * numA}`);
            calculationSteps.push(`x₂ = ${roundToDecimals(x2, 4)}`);

            setSolution({ x1: x1, x2: x2});
            setSolutionType('real');
        } else if (discriminant === 0) {
            // Uma raiz real repetida
            const x = -numB / (2 * numA);
            
            calculationSteps.push(`Passo ${stepCount}: Como o discriminante (${discriminant}) é igual a zero, temos uma raiz real repetida`);
            calculationSteps.push(`Quando o discriminante é zero, a fórmula se simplifica para: x = -b / (2a)`);
            calculationSteps.push(`x = -${numB} / (2 × ${numA})`);
            calculationSteps.push(`x = ${-numB} / ${2 * numA}`);
            calculationSteps.push(`x = ${roundToDecimals(x, 4)}`);
            
            setSolution({ x1: x, x2: x });
            setSolutionType('repeated');
        } else {
            // Duas raízes complexas
            const realPart = -numB / (2 * numA);
            const imaginaryPart = Math.sqrt(-discriminant) / (2 * numA);
            
            calculationSteps.push(`Passo ${stepCount}: Como o discriminante (${discriminant}) é negativo, temos duas raízes complexas conjugadas`);
            calculationSteps.push(`Para raízes complexas, a parte real é -b / (2a) e a parte imaginária é √(-discriminante) / (2a)`);
            
            calculationSteps.push(`Calculando a parte real:`);
            calculationSteps.push(`Parte real = -${numB} / (2 × ${numA})`);
            calculationSteps.push(`Parte real = ${-numB} / ${2 * numA}`);
            calculationSteps.push(`Parte real = ${roundToDecimals(realPart, 4)}`);
            
            calculationSteps.push(`Calculando a parte imaginária:`);
            calculationSteps.push(`Parte imaginária = √(${-discriminant}) / (2 × ${numA})`);
            calculationSteps.push(`Parte imaginária = ${roundToDecimals(Math.sqrt(-discriminant), 4)} / ${2 * numA}`);
            calculationSteps.push(`Parte imaginária = ${roundToDecimals(imaginaryPart, 4)}`);
            
            calculationSteps.push(`x₁ = ${roundToDecimals(realPart, 4)} + ${roundToDecimals(imaginaryPart, 4)}i`);
            calculationSteps.push(`x₂ = ${roundToDecimals(realPart, 4)} - ${roundToDecimals(imaginaryPart, 4)}i`);
            
            setSolution({ x1: null, x2: null });
            setSolutionType('complex');
        }
        
        // Adicionar passo de verificação para soluções reais
        if (discriminant >= 0) {
            stepCount++;
            
            calculationSteps.push(`Passo ${stepCount}: Verificação das soluções`);
            
            // Aguardar até que a solução seja definida para verificar
            if (solution !== null) {
                const x1 = solution.x1;
                const x2 = solution.x2;
                
                if (x1 !== null) {
                    calculationSteps.push(`Substituindo x = ${roundToDecimals(x1, 4)} na equação original:`);
                    const check1 = numA * (x1 * x1) + numB * x1 + numC;
                    calculationSteps.push(`${numA} × (${roundToDecimals(x1, 4)})² + ${numB} × (${roundToDecimals(x1, 4)}) + ${numC}`);
                    calculationSteps.push(`${numA} × ${roundToDecimals(x1 * x1, 4)} + ${numB} × ${roundToDecimals(x1, 4)} + ${numC}`);
                    calculationSteps.push(`${roundToDecimals(numA * (x1 * x1), 4)} + ${roundToDecimals(numB * x1, 4)} + ${numC}`);
                    calculationSteps.push(`= ${roundToDecimals(check1, 4)}`);
                    
                    if (Math.abs(check1) < 0.001) {
                        calculationSteps.push(`Resultado aproximadamente igual a zero. A solução x = ${roundToDecimals(x1, 4)} está correta.`);
                    } else {
                        calculationSteps.push(`Nota: Se houve diferença no resultado final de: ${roundToDecimals(check1, 4)}, é porque o resultado final foi arredondado.`);
                    }
                }
                
                if (x2 !== null && x1 !== x2) {
                    calculationSteps.push(`Substituindo x = ${roundToDecimals(x2, 4)} na equação original:`);
                    const check2 = numA * (x2 * x2) + numB * x2 + numC;
                    calculationSteps.push(`${numA} × (${roundToDecimals(x2, 4)})² + ${numB} × (${roundToDecimals(x2, 4)}) + ${numC}`);
                    calculationSteps.push(`${numA} × ${roundToDecimals(x2 * x2, 4)} + ${numB} × ${roundToDecimals(x2, 4)} + ${numC}`);
                    calculationSteps.push(`${roundToDecimals(numA * (x2 * x2), 4)} + ${roundToDecimals(numB * x2, 4)} + ${numC}`);
                    calculationSteps.push(`= ${roundToDecimals(check2, 4)}`);
                    
                    if (Math.abs(check2) < 0.001) {
                        calculationSteps.push(`Resultado aproximadamente igual a zero. A solução x = ${roundToDecimals(x2, 4)} está correta.`);
                    } else {
                        calculationSteps.push(`Nota: Se houve diferença no resultado final de: ${roundToDecimals(check2, 4)}, é porque o resultado final foi arredondado.`);
                    }
                }
            }
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
                    
                    // Verificar se o passo é uma definição/explicação
                    const definitionMatch = step.match(/^(A |O |Para |Quando )(.*)(tem o formato|determina|é:|se simplifica|é negativo|é igual|é positivo)/);
                    
                    // Verificar se o passo representa uma equação matemática
                    const equationMatch = step.match(/^(Discriminante|x₁|x₂|x|Parte real|Parte imaginária) =/);
                    
                    // Verificar se o passo é um cálculo específico
                    const calculationMatch = step.startsWith("Calculando");
                    
                    // Verificar se o passo contém uma verificação/resultados
                    const verificationMatch = step.includes("Resultado aproximadamente") || step.includes("correta") || 
                                            step.includes("Verificação") || step.startsWith("Substituindo");
                    
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
                    } else if (definitionMatch) {
                        // Se for uma definição ou explicação de conceito
                        return (
                            <div key={index} className="p-3 bg-indigo-50 rounded-md ml-4 border-l-2 border-indigo-300">
                                <p className="text-indigo-700">{step}</p>
                            </div>
                        );
                    } else if (equationMatch) {
                        // Se for uma equação matemática final
                        return (
                            <div key={index} className="p-3 bg-blue-50 rounded-md ml-4 border-l-2 border-blue-300">
                                <p className="text-gray-800 font-medium text-lg">{step}</p>
                            </div>
                        );
                    } else if (calculationMatch) {
                        // Se for um bloco de cálculo específico
                        return (
                            <div key={index} className="p-3 bg-purple-50 rounded-md ml-4 border-l-2 border-purple-300">
                                <p className="text-purple-700 font-medium">{step}</p>
                            </div>
                        );
                    } else if (verificationMatch) {
                        // Se for uma verificação ou validação de resultados
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
                    } else if (step.includes("=")) {
                        // Se for uma etapa de cálculo com igualdade
                        return (
                            <div key={index} className="p-3 bg-gray-50 rounded-md ml-8">
                                <p className="text-gray-800">{step}</p>
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
                <h2 className="text-2xl font-bold">Equações Quadráticas</h2>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-8">
                <p className="text-gray-700 mb-6">
                    Esta calculadora resolve equações quadráticas na forma ax² + bx + c = 0 usando a fórmula de Bhaskara.
                    Insira os coeficientes a, b e c para encontrar as soluções.
                </p>
                
                <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Insira os coeficientes para: ax² + bx + c = 0</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                a (coeficiente de x²)
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
                                b (coeficiente de x)
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
                                c (termo constante)
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
                        {getQuadraticExamples().map((example, index) => (
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
            
            {solution && (
                <div className="space-y-6">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-5">
                        <h3 className="text-lg font-medium text-green-800 mb-2">Resultado</h3>
                        <p className="text-xl">
                            Para a equação {a}x² + {b}x + {c} = 0
                        </p>
                        
                        {solutionType === 'real' && solution.x1 !== null && solution.x2 !== null && (
                            <div className="mt-2">
                                <p className="text-xl font-bold">x₁ = {roundToDecimals(solution.x1, 4)}</p>
                                <p className="text-xl font-bold">x₂ = {roundToDecimals(solution.x2, 4)}</p>
                            </div>
                        )}
                        
                        {solutionType === 'repeated' && solution.x1 !== null && (
                            <p className="text-xl font-bold mt-2">
                                x = {roundToDecimals(solution.x1, 4)} (raiz repetida)
                            </p>
                        )}
                        
                        {solutionType === 'complex' && (
                            <div className="mt-2">
                                <p className="text-xl font-bold">A equação não tem soluções reais</p>
                                <p className="text-gray-700 mt-1">As soluções são complexas (veja a explicação abaixo)</p>
                            </div>
                        )}
                        
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
                                    <div className="flex flex-col md:flex-row gap-4 mb-4">
                                        <div className="flex-1">
                                            <h5 className="font-medium text-gray-800 mb-2 border-b border-gray-200 pb-1">Definição</h5>
                                            <p className="text-gray-700">
                                                Uma equação quadrática é uma equação de segundo grau na forma 
                                                ax² + bx + c = 0, onde a, b e c são constantes e a ≠ 0.
                                            </p>
                                            
                                            <h5 className="font-medium text-gray-800 mb-2 mt-4 border-b border-gray-200 pb-1">Fórmula de Bhaskara</h5>
                                            <div className="bg-white p-3 rounded-md border border-gray-100 shadow-sm">
                                                <div className="text-center">
                                                    <p className="text-lg font-medium text-indigo-700">x = (-b ± √(b² - 4ac)) / (2a)</p>
                                                </div>
                                                <div className="mt-2 text-sm text-gray-600">
                                                    <p>Onde:</p>
                                                    <ul className="list-disc pl-5 mt-1 space-y-1">
                                                        <li>a, b, c são os coeficientes da equação ax² + bx + c = 0</li>
                                                        <li>± indica as duas possíveis soluções</li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <h5 className="font-medium text-gray-800 mb-2 border-b border-gray-200 pb-1">Discriminante (Δ)</h5>
                                            <div className="bg-white p-3 rounded-md border border-gray-100 shadow-sm mb-3">
                                                <p className="text-center font-medium text-indigo-700">Δ = b² - 4ac</p>
                                            </div>
                                            <p className="text-gray-700 mb-2">
                                                O discriminante determina a natureza das raízes:
                                            </p>
                                            <div className="space-y-2">
                                                <div className="p-2 bg-green-50 rounded border border-green-100 flex items-center">
                                                    <div className="h-6 w-6 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-xs mr-2 flex-shrink-0">Δ&gt;0</div>
                                                    <span className="text-sm">Duas raízes reais distintas</span>
                                                </div>
                                                <div className="p-2 bg-yellow-50 rounded border border-yellow-100 flex items-center">
                                                    <div className="h-6 w-6 rounded-full bg-yellow-100 text-yellow-700 flex items-center justify-center text-xs mr-2 flex-shrink-0">Δ=0</div>
                                                    <span className="text-sm">Uma raiz real repetida</span>
                                                </div>
                                                <div className="p-2 bg-indigo-50 rounded border border-indigo-100 flex items-center">
                                                    <div className="h-6 w-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs mr-2 flex-shrink-0">Δ&lt;0</div>
                                                    <span className="text-sm">Duas raízes complexas conjugadas</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-4 flex flex-col md:flex-row gap-4">
                                        <div className="flex-1">
                                            <h5 className="font-medium text-gray-800 mb-2 border-b border-gray-200 pb-1">Representação Gráfica</h5>
                                            <div className="bg-white p-3 rounded-md border border-gray-100 shadow-sm">
                                                <p className="text-sm text-gray-700 mb-2">
                                                    Uma equação quadrática representa uma parábola no plano cartesiano:
                                                </p>
                                                <div className="flex justify-center">
                                                    <div className="relative h-40 w-40 border-b border-l border-gray-400">
                                                        {/* Eixos */}
                                                        <div className="absolute bottom-0 left-0 w-full h-px bg-gray-400"></div>
                                                        <div className="absolute bottom-0 left-0 w-px h-full bg-gray-400"></div>
                                                        
                                                        {/* Parábola para Δ > 0 */}
                                                        <div className="absolute bottom-20 left-0 w-40 h-40 border-t-2 border-indigo-500 rounded-t-full"></div>
                                                        
                                                        {/* Raízes */}
                                                        <div className="absolute bottom-0 left-10 h-2 w-2 bg-red-500 rounded-full"></div>
                                                        <div className="absolute bottom-0 left-30 h-2 w-2 bg-red-500 rounded-full"></div>
                                                        
                                                        {/* Labels */}
                                                        <div className="absolute bottom-[-15px] left-10 text-xs text-red-500">x₁</div>
                                                        <div className="absolute bottom-[-15px] left-30 text-xs text-red-500">x₂</div>
                                                        <div className="absolute bottom-20 left-20 text-xs text-indigo-600">y = ax² + bx + c</div>
                                                    </div>
                                                </div>
                                                <p className="text-xs text-gray-500 text-center mt-2">
                                                    As raízes da equação são os pontos onde a parábola cruza o eixo x
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <h5 className="font-medium text-gray-800 mb-2 border-b border-gray-200 pb-1">Aplicações</h5>
                                            <div className="space-y-2">
                                                <div className="p-2 bg-white rounded-md shadow-sm border border-gray-100">
                                                    <h6 className="text-indigo-700 font-medium text-sm">Física</h6>
                                                    <p className="text-xs text-gray-600">Modelagem de movimento de projéteis, queda livre, movimentos uniformemente variados</p>
                                                </div>
                                                <div className="p-2 bg-white rounded-md shadow-sm border border-gray-100">
                                                    <h6 className="text-indigo-700 font-medium text-sm">Engenharia</h6>
                                                    <p className="text-xs text-gray-600">Cálculo de estruturas, modelagem de sistemas mecânicos, design</p>
                                                </div>
                                                <div className="p-2 bg-white rounded-md shadow-sm border border-gray-100">
                                                    <h6 className="text-indigo-700 font-medium text-sm">Economia</h6>
                                                    <p className="text-xs text-gray-600">Análise de lucro, ponto de equilíbrio, previsões de mercado</p>
                                                </div>
                                                <div className="p-2 bg-white rounded-md shadow-sm border border-gray-100">
                                                    <h6 className="text-indigo-700 font-medium text-sm">Geometria</h6>
                                                    <p className="text-xs text-gray-600">Cálculo de áreas, volumes, dimensões de objetos</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-4 bg-yellow-50 p-3 rounded-md border-l-4 border-yellow-400">
                                        <h5 className="font-medium text-yellow-800 mb-1">Dica de Resolução</h5>
                                        <p className="text-gray-700 text-sm">
                                            Em alguns casos, a equação quadrática pode ser resolvida por fatoração direta, 
                                            especialmente quando as raízes são números inteiros ou frações simples. Isso pode 
                                            ser mais eficiente que a aplicação da fórmula de Bhaskara.
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

export default ResolvedorEquacaoQuadratica;