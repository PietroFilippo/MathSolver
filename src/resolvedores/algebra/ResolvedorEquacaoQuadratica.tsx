import { useState } from 'react';
import { arredondarParaDecimais } from '../../utils/mathUtils';
import { HiCalculator } from 'react-icons/hi';

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
            calculationSteps.push(`x₁ = (${-numB} + ${arredondarParaDecimais(sqrtDiscriminant, 4)}) / ${2 * numA}`);
            calculationSteps.push(`x₁ = ${arredondarParaDecimais(-numB + sqrtDiscriminant, 4)} / ${2 * numA}`);
            calculationSteps.push(`x₁ = ${arredondarParaDecimais(x1, 4)}`);
            
            calculationSteps.push(`Calculando x₂ (usando o sinal - na fórmula):`);
            calculationSteps.push(`x₂ = (-${numB} - √${discriminant}) / (2 × ${numA})`);
            calculationSteps.push(`x₂ = (${-numB} - ${arredondarParaDecimais(sqrtDiscriminant, 4)}) / ${2 * numA}`);
            calculationSteps.push(`x₂ = ${arredondarParaDecimais(-numB - sqrtDiscriminant, 4)} / ${2 * numA}`);
            calculationSteps.push(`x₂ = ${arredondarParaDecimais(x2, 4)}`);

            setSolution({ x1: x1, x2: x2});
            setSolutionType('real');
        } else if (discriminant === 0) {
            // Uma raiz real repetida
            const x = -numB / (2 * numA);
            
            calculationSteps.push(`Passo ${stepCount}: Como o discriminante (${discriminant}) é igual a zero, temos uma raiz real repetida`);
            calculationSteps.push(`Quando o discriminante é zero, a fórmula se simplifica para: x = -b / (2a)`);
            calculationSteps.push(`x = -${numB} / (2 × ${numA})`);
            calculationSteps.push(`x = ${-numB} / ${2 * numA}`);
            calculationSteps.push(`x = ${arredondarParaDecimais(x, 4)}`);
            
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
            calculationSteps.push(`Parte real = ${arredondarParaDecimais(realPart, 4)}`);
            
            calculationSteps.push(`Calculando a parte imaginária:`);
            calculationSteps.push(`Parte imaginária = √(${-discriminant}) / (2 × ${numA})`);
            calculationSteps.push(`Parte imaginária = ${arredondarParaDecimais(Math.sqrt(-discriminant), 4)} / ${2 * numA}`);
            calculationSteps.push(`Parte imaginária = ${arredondarParaDecimais(imaginaryPart, 4)}`);
            
            calculationSteps.push(`x₁ = ${arredondarParaDecimais(realPart, 4)} + ${arredondarParaDecimais(imaginaryPart, 4)}i`);
            calculationSteps.push(`x₂ = ${arredondarParaDecimais(realPart, 4)} - ${arredondarParaDecimais(imaginaryPart, 4)}i`);
            
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
                    calculationSteps.push(`Substituindo x = ${arredondarParaDecimais(x1, 4)} na equação original:`);
                    const check1 = numA * (x1 * x1) + numB * x1 + numC;
                    calculationSteps.push(`${numA} × (${arredondarParaDecimais(x1, 4)})² + ${numB} × (${arredondarParaDecimais(x1, 4)}) + ${numC}`);
                    calculationSteps.push(`${numA} × ${arredondarParaDecimais(x1 * x1, 4)} + ${numB} × ${arredondarParaDecimais(x1, 4)} + ${numC}`);
                    calculationSteps.push(`${arredondarParaDecimais(numA * (x1 * x1), 4)} + ${arredondarParaDecimais(numB * x1, 4)} + ${numC}`);
                    calculationSteps.push(`= ${arredondarParaDecimais(check1, 4)}`);
                    
                    if (Math.abs(check1) < 0.001) {
                        calculationSteps.push(`Resultado aproximadamente igual a zero. A solução x = ${arredondarParaDecimais(x1, 4)} está correta.`);
                    } else {
                        calculationSteps.push(`Nota: A diferença de ${arredondarParaDecimais(check1, 4)} se deve a arredondamentos.`);
                    }
                }
                
                if (x2 !== null && x1 !== x2) {
                    calculationSteps.push(`Substituindo x = ${arredondarParaDecimais(x2, 4)} na equação original:`);
                    const check2 = numA * (x2 * x2) + numB * x2 + numC;
                    calculationSteps.push(`${numA} × (${arredondarParaDecimais(x2, 4)})² + ${numB} × (${arredondarParaDecimais(x2, 4)}) + ${numC}`);
                    calculationSteps.push(`${numA} × ${arredondarParaDecimais(x2 * x2, 4)} + ${numB} × ${arredondarParaDecimais(x2, 4)} + ${numC}`);
                    calculationSteps.push(`${arredondarParaDecimais(numA * (x2 * x2), 4)} + ${arredondarParaDecimais(numB * x2, 4)} + ${numC}`);
                    calculationSteps.push(`= ${arredondarParaDecimais(check2, 4)}`);
                    
                    if (Math.abs(check2) < 0.001) {
                        calculationSteps.push(`Resultado aproximadamente igual a zero. A solução x = ${arredondarParaDecimais(x2, 4)} está correta.`);
                    } else {
                        calculationSteps.push(`Nota: A diferença de ${arredondarParaDecimais(check2, 4)} se deve a arredondamentos.`);
                    }
                }
            }
        }
            
        setSteps(calculationSteps);
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
                                <p className="text-xl font-bold">x₁ = {arredondarParaDecimais(solution.x1, 4)}</p>
                                <p className="text-xl font-bold">x₂ = {arredondarParaDecimais(solution.x2, 4)}</p>
                            </div>
                        )}
                        
                        {solutionType === 'repeated' && solution.x1 !== null && (
                            <p className="text-xl font-bold mt-2">
                                x = {arredondarParaDecimais(solution.x1, 4)} (raiz repetida)
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
                                <div className="space-y-2 text-gray-700">
                                    <p>
                                        <span className="font-semibold">Equação Quadrática:</span> Uma equação de segundo grau na forma 
                                        ax² + bx + c = 0, onde a, b e c são constantes e a ≠ 0.
                                    </p>
                                    
                                    <p className="mt-2">
                                        <span className="font-semibold">Fórmula de Bhaskara:</span> Usada para encontrar as raízes:
                                    </p>
                                    <div className="bg-white p-2 rounded border border-gray-200 text-center my-2">
                                        <p className="font-medium">x = (-b ± √(b² - 4ac)) / (2a)</p>
                                    </div>
                                    
                                    <p className="mt-2">
                                        <span className="font-semibold">Discriminante (Δ = b² - 4ac):</span> Determina a natureza das raízes:
                                    </p>
                                    <ul className="list-disc pl-5 mt-1">
                                        <li>Se Δ {'>'} 0: Duas raízes reais distintas</li>
                                        <li>Se Δ = 0: Uma raiz real repetida</li>
                                        <li>Se Δ {'<'} 0: Duas raízes complexas conjugadas</li>
                                    </ul>
                                    
                                    <p className="mt-2">
                                        <span className="font-semibold">Aplicações:</span> Equações quadráticas são usadas em:
                                    </p>
                                    <ul className="list-disc pl-5 mt-1">
                                        <li>Física (movimento de projéteis, queda livre)</li>
                                        <li>Engenharia (cálculo de estruturas)</li>
                                        <li>Economia (análise de lucro, ponto de equilíbrio)</li>
                                        <li>Geometria (cálculo de áreas e volumes)</li>
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

export default ResolvedorEquacaoQuadratica;