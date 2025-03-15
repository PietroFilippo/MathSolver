import React, { useState } from 'react';
import { approximatelyEqual, roundToDecimals } from '../../utils/mathUtils';
import { linearSystem, getLinearSystemExamples } from '../../utils/mathUtilsAlgebra';
import { HiCalculator } from 'react-icons/hi';

const ResolvedorSistemasLineares: React.FC = () => {
    const [a1, setA1] = useState<string>('');
    const [b1, setB1] = useState<string>('');
    const [c1, setC1] = useState<string>('');
    const [a2, setA2] = useState<string>('');
    const [b2, setB2] = useState<string>('');
    const [c2, setC2] = useState<string>('');
    const [solution, setSolution] = useState<{x: number, y: number} | null>(null);
    const [systemType, setSystemType] = useState<'unique' | 'infinite' | 'noSolution'| null>(null);
    const [showExplanation, setShowExplanation] = useState<boolean>(false);
    const [steps, setSteps] = useState<string[]>([]);
    const [errorMessage, setErrorMessage] = useState<string>('');
    
    const handleSolve = () => {
        // Reseta os resultados anteriores e erros
        setSolution(null);
        setSystemType(null);
        setSteps([]);
        setErrorMessage('');
        setShowExplanation(false);

        const numA1 = parseFloat(a1);
        const numB1 = parseFloat(b1);
        const numC1 = parseFloat(c1);
        const numA2 = parseFloat(a2);
        const numB2 = parseFloat(b2);
        const numC2 = parseFloat(c2);

        if (
            isNaN(numA1) || isNaN(numB1) || isNaN(numC1) ||
            isNaN(numA2) || isNaN(numB2) || isNaN(numC2)
        ) {
            setErrorMessage('Por favor, insira números válidos para todos os coeficientes');
            return;
        }

        // Calcula o determinante do coeficiente da matriz
        const det = numA1 * numB2 - numA2 * numB1;

        const calculationSteps = [];
        let stepCount = 1;
        
        calculationSteps.push(`Passo ${stepCount}: Organize o sistema de equações na forma padrão`);
        calculationSteps.push(`Equação 1: ${numA1}x + ${numB1}y = ${numC1}`);
        calculationSteps.push(`Equação 2: ${numA2}x + ${numB2}y = ${numC2}`);
        stepCount++;
        
        calculationSteps.push(`Passo ${stepCount}: Calcule o determinante do coeficiente da matriz`);
        calculationSteps.push(`det = ${numA1} * ${numB2} - ${numA2} * ${numB1} = ${det}`);
        stepCount++;

        // Usa a função linearSystem para resolver o sistema
        const result = linearSystem(numA1, numB1, numC1, numA2, numB2, numC2);

        if (result === null) {
            // Sistema não tem solução única ou tem infinitas soluções
            // Verifica se o sistema é inconsistente
            // Se a1/a2 = b1/b2 ≠ c1/c2, o sistema é inconsistente
            const ratioA = numA1 / numA2;
            const ratioB = numB1 / numB2;
            const ratioC = numC1 / numC2;

            if (approximatelyEqual(ratioA, ratioB) && !approximatelyEqual(ratioA, ratioC)) {
                // Sistema inconsistente - sem solução
                calculationSteps.push(`Passo ${stepCount}: O determinante é zero e as razões dos coeficientes não são compatíveis, portanto, o sistema não possui soluções`);
                calculationSteps.push(`A razão dos coeficientes é: a₁/a₂ = ${roundToDecimals(ratioA, 4)}, b₁/b₂ = ${roundToDecimals(ratioB, 4)}, c₁/c₂ = ${roundToDecimals(ratioC, 4)}`);
                calculationSteps.push(`Por causa que a₁/a₂ = b₁/b₂ ≠ c₁/c₂, o sistema é inconsistente e não possui soluções`);

                setSystemType('noSolution');
            } else {
                // Sistema com infinitas soluções
                calculationSteps.push(`Passo ${stepCount}: O determinante é zero e as equações são linearmente dependentes, portanto, o sistema possui infinitas soluções`);
                calculationSteps.push(`A razão dos coeficientes é: a₁/a₂ = ${roundToDecimals(ratioA, 4)}, b₁/b₂ = ${roundToDecimals(ratioB, 4)}, c₁/c₂ = ${roundToDecimals(ratioC, 4)}`);
                calculationSteps.push(`Por causa que a₁/a₂ = b₁/b₂ = c₁/c₂, o sistema possui infinitas soluções`);

                // Expressando uma variável em termos da outra (y em termos de x)
                if (numB1 !== 0) {
                    const expressaoY = `y = (${numC1} - ${numA1}x) / ${numB1}`;
                    calculationSteps.push(`Podemos expressar y em termos de x: ${expressaoY}`);
                    calculationSteps.push(`Isso significa que para qualquer valor de x, podemos encontrar um valor correspondente de y que satisfaça ambas as equações.`);
                } else if (numA1 !== 0) {
                    const expressaoX = `x = (${numC1} - ${numB1}y) / ${numA1}`;
                    calculationSteps.push(`Podemos expressar x em termos de y: ${expressaoX}`);
                    calculationSteps.push(`Isso significa que para qualquer valor de y, podemos encontrar um valor correspondente de x que satisfaça ambas as equações.`);
                }

                setSystemType('infinite');
            }
        } else {
            // Sistema possui uma única solução
            calculationSteps.push(`Passo ${stepCount}: O determinante não é zero, então o sistema possui uma única solução`);
            stepCount++;
            
            calculationSteps.push(`Passo ${stepCount}: Calcular x usando a regra de Cramer`);
            calculationSteps.push(`Substituímos a coluna dos coeficientes de x pelos termos independentes:`);
            calculationSteps.push(`det_x = ${numC1} * ${numB2} - ${numC2} * ${numB1} = ${numC1 * numB2 - numC2 * numB1}`);
            calculationSteps.push(`x = det_x / det = ${(numC1 * numB2 - numC2 * numB1)} / ${det} = ${roundToDecimals(result.x, 4)}`);
            stepCount++;
            
            calculationSteps.push(`Passo ${stepCount}: Calcular y usando a regra de Cramer`);
            calculationSteps.push(`Substituímos a coluna dos coeficientes de y pelos termos independentes:`);
            calculationSteps.push(`det_y = ${numA1} * ${numC2} - ${numA2} * ${numC1} = ${numA1 * numC2 - numA2 * numC1}`);
            calculationSteps.push(`y = det_y / det = ${(numA1 * numC2 - numA2 * numC1)} / ${det} = ${roundToDecimals(result.y, 4)}`);
            stepCount++;
            
            // Verificação da solução
            calculationSteps.push(`Passo ${stepCount}: Verificar a solução substituindo os valores nas equações originais`);
            const eq1 = numA1 * result.x + numB1 * result.y;
            const eq2 = numA2 * result.x + numB2 * result.y;
            
            calculationSteps.push(`Equação 1: ${numA1} × ${roundToDecimals(result.x, 4)} + ${numB1} × ${roundToDecimals(result.y, 4)} = ${roundToDecimals(eq1, 4)} ≈ ${numC1}`);
            calculationSteps.push(`Equação 2: ${numA2} × ${roundToDecimals(result.x, 4)} + ${numB2} × ${roundToDecimals(result.y, 4)} = ${roundToDecimals(eq2, 4)} ≈ ${numC2}`);
            
            if (approximatelyEqual(eq1, numC1) && approximatelyEqual(eq2, numC2)) {
                calculationSteps.push(`A verificação confirma que a solução (x = ${roundToDecimals(result.x, 4)}, y = ${roundToDecimals(result.y, 4)}) é válida.`);
            } else {
                calculationSteps.push(`Nota: Há pequenas diferenças devido ao arredondamento.`);
            }

            setSolution(result);
            setSystemType('unique');
        }

        setSteps(calculationSteps);
        setShowExplanation(true);
    };

    // Função para aplicar um exemplo de sistema linear
    const applyExample = (example: {
        a1: number, b1: number, c1: number,
        a2: number, b2: number, c2: number
    }) => {
        setA1(example.a1.toString());
        setB1(example.b1.toString());
        setC1(example.c1.toString());
        setA2(example.a2.toString());
        setB2(example.b2.toString());
        setC2(example.c2.toString());
    };

    // Função que gera os passos com estilização aprimorada
    const renderExplanationSteps = () => {
        return (
            <div className="space-y-4">
                {steps.map((step, index) => {
                    // Verificar se o passo começa com um padrão de número de passo como "Passo X:"
                    const stepMatch = step.match(/^(Passo \d+:)(.*)$/);
                    
                    // Verificar se o passo é uma equação do sistema
                    const equationMatch = step.match(/^(Equação \d+:)(.*)$/);
                    
                    // Verificar se o passo é um cálculo de determinante
                    const determinantMatch = step.match(/^(det|det_x|det_y) =/);
                    
                    // Verificar se o passo contém a solução para x ou y
                    const solutionMatch = step.match(/^(x|y) =/);
                    
                    // Verificar se o passo contém verificação/resultado
                    const verificationMatch = step.includes('verificação confirma') || 
                                           step.includes('Verificar') || 
                                           (step.includes('Equação') && step.includes('≈'));
                    
                    // Verificar se o passo é uma nota ou explicação adicional
                    const noteMatch = step.includes('Nota:') || step.includes('diferenças devido');
                    
                    // Verificar se o passo explica algo sobre o sistema
                    const explanationMatch = step.includes('O determinante') || 
                                          step.includes('Por causa que') || 
                                          step.includes('Podemos expressar') ||
                                          step.includes('Isso significa que');
                    
                    // Verificar se o passo mostra a razão dos coeficientes
                    const ratioMatch = step.includes('razão dos coeficientes');
                    
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
                        // Se for uma equação do sistema
                        const [_, eqNumber, eqContent] = equationMatch;
                        return (
                            <div key={index} className="p-3 bg-blue-50 rounded-md ml-4 border-l-2 border-blue-300">
                                <div className="flex flex-col sm:flex-row">
                                    <span className="font-medium text-blue-700 mr-2 mb-1 sm:mb-0">
                                        {eqNumber}
                                    </span>
                                    <p className="text-gray-800 font-medium">{eqContent}</p>
                                </div>
                            </div>
                        );
                    } else if (determinantMatch || solutionMatch) {
                        // Se for um cálculo de determinante ou solução
                        return (
                            <div key={index} className="p-3 bg-purple-50 rounded-md ml-4 border-l-2 border-purple-300">
                                <p className="text-purple-700 font-medium">{step}</p>
                            </div>
                        );
                    } else if (verificationMatch) {
                        // Se for uma verificação
                        return (
                            <div key={index} className="p-3 bg-green-50 rounded-md ml-4 border-l-2 border-green-300">
                                <p className="text-green-700">{step}</p>
                            </div>
                        );
                    } else if (noteMatch) {
                        // Se for uma nota
                        return (
                            <div key={index} className="p-2 bg-yellow-50 rounded-md ml-4 text-sm text-yellow-700 italic border-l-2 border-yellow-300">
                                {step}
                            </div>
                        );
                    } else if (explanationMatch) {
                        // Se for uma explicação
                        return (
                            <div key={index} className="p-3 bg-indigo-50 rounded-md ml-4 border-l-2 border-indigo-300">
                                <p className="text-indigo-700">{step}</p>
                            </div>
                        );
                    } else if (ratioMatch) {
                        // Se for uma razão de coeficientes
                        return (
                            <div key={index} className="p-3 bg-gray-100 rounded-md ml-8 text-gray-800">
                                <p>{step}</p>
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
                <h2 className="text-2xl font-bold">Sistema de Equações Lineares</h2>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-8">
                <p className="text-gray-700 mb-6">
                    Esta calculadora resolve um sistema de duas equações lineares com duas variáveis (x e y).
                    Insira os coeficientes para cada equação no formato ax + by = c.
                </p>
                
                <div className="mb-4 p-3 bg-blue-50 rounded-md text-sm">
                    <h3 className="font-bold mb-1">Como usar esta calculadora:</h3>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Para equações como "2x + 3y = 5", insira: a = 2, b = 3, c = 5</li>
                        <li>Para equações com termos negativos como "x - y = 2", insira: a = 1, b = -1, c = 2</li>
                        <li>Para equações sem x como "3y = 6", insira: a = 0, b = 3, c = 6</li>
                        <li>Para equações sem y como "2x = 4", insira: a = 2, b = 0, c = 4</li>
                    </ul>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Equação 1: a₁x + b₁y = c₁
                        </label>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="flex items-center">
                                <input
                                    type="number"
                                    value={a1}
                                    onChange={(e) => setA1(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="a₁"
                                />
                                <span className="ml-2">x +</span>
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="number"
                                    value={b1}
                                    onChange={(e) => setB1(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="b₁"
                                />
                                <span className="ml-2">y =</span>
                            </div>
                            <div>
                                <input
                                    type="number"
                                    value={c1}
                                    onChange={(e) => setC1(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="c₁"
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Equação 2: a₂x + b₂y = c₂
                        </label>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="flex items-center">
                                <input
                                    type="number"
                                    value={a2}
                                    onChange={(e) => setA2(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="a₂"
                                />
                                <span className="ml-2">x +</span>
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="number"
                                    value={b2}
                                    onChange={(e) => setB2(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="b₂"
                                />
                                <span className="ml-2">y =</span>
                            </div>
                            <div>
                                <input
                                    type="number"
                                    value={c2}
                                    onChange={(e) => setC2(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="c₂"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Exemplos de sistemas lineares */}
                <div className="mt-6 mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Exemplos
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {getLinearSystemExamples().map((example, index) => (
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
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-md transition-colors duration-300 mt-6"
                >
                    Resolver Sistema
                </button>

                {errorMessage && (
                    <div className="mt-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-md">
                        {errorMessage}
                    </div>
                )}
            </div>

            {systemType && (
                <div className="space-y-6">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-5">
                        <h3 className="text-lg font-medium text-green-800 mb-2">Resultado</h3>
                        
                        {systemType === 'unique' && solution && (
                            <div>
                                <p className="text-xl">O sistema possui uma única solução:</p>
                                <p className="text-xl font-bold mt-2">x = {roundToDecimals(solution.x, 4)}</p>
                                <p className="text-xl font-bold">y = {roundToDecimals(solution.y, 4)}</p>
                            </div>
                        )}
                        
                        {systemType === 'infinite' && (
                            <div>
                                <p className="text-xl">O sistema possui infinitas soluções.</p>
                                <p className="text-lg mt-2">As soluções podem ser expressas em forma paramétrica (veja a explicação abaixo).</p>
                            </div>
                        )}
                        
                        {systemType === 'noSolution' && (
                            <div>
                                <p className="text-xl">O sistema não possui solução.</p>
                                <p className="text-lg mt-2">As equações representam retas paralelas que nunca se interceptam.</p>
                            </div>
                        )}
                        
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
                                            <h5 className="font-medium text-gray-800 mb-2 border-b border-gray-200 pb-1">Definição</h5>
                                            <p className="text-gray-700 mb-3">
                                                Um sistema de equações lineares é um conjunto de equações onde cada variável 
                                                aparece no primeiro grau e não há produtos entre variáveis.
                                            </p>
                                            <div className="bg-white p-3 rounded-md border border-gray-100 shadow-sm mb-3">
                                                <div className="text-center font-medium text-indigo-700">
                                                    <p>a₁x + b₁y = c₁</p>
                                                    <p>a₂x + b₂y = c₂</p>
                                                </div>
                                            </div>
                                            <div className="p-3 bg-indigo-50 rounded-md">
                                                <p className="text-sm text-indigo-700">
                                                    <span className="font-medium">Interpretação Geométrica:</span> Cada equação 
                                                    representa uma reta no plano cartesiano. Resolver o sistema significa 
                                                    encontrar o ponto (ou pontos) onde essas retas se interceptam.
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <h5 className="font-medium text-gray-800 mb-2 border-b border-gray-200 pb-1">Possíveis Resultados</h5>
                                            <div className="space-y-4">
                                                <div className="bg-white p-3 rounded-md border border-gray-100 shadow-sm flex items-start">
                                                    <div className="flex-shrink-0 w-16 h-16 mr-3 relative border border-gray-200 rounded">
                                                        {/* Representação de retas que se cruzam */}
                                                        <div className="absolute top-0 left-0 w-full h-0.5 bg-blue-500 origin-top-left rotate-[30deg] transform translate-y-7"></div>
                                                        <div className="absolute top-0 left-0 w-full h-0.5 bg-red-500 origin-top-left rotate-[-30deg] transform translate-y-8"></div>
                                                        <div className="absolute top-8 left-8 w-2 h-2 bg-green-500 rounded-full"></div>
                                                    </div>
                                                    <div>
                                                        <h6 className="text-indigo-700 font-medium mb-1">Solução Única</h6>
                                                        <p className="text-xs text-gray-600">As retas se interceptam em exatamente um ponto. O determinante da matriz de coeficientes é diferente de zero.</p>
                                                    </div>
                                                </div>
                                                <div className="bg-white p-3 rounded-md border border-gray-100 shadow-sm flex items-start">
                                                    <div className="flex-shrink-0 w-16 h-16 mr-3 relative border border-gray-200 rounded">
                                                        {/* Representação de retas coincidentes */}
                                                        <div className="absolute top-0 left-0 w-full h-0.5 bg-purple-500 origin-top-left rotate-[30deg] transform translate-y-8"></div>
                                                        <div className="absolute top-0 left-0 w-full h-0.5 bg-indigo-500 origin-top-left rotate-[30deg] transform translate-y-8 opacity-50"></div>
                                                    </div>
                                                    <div>
                                                        <h6 className="text-indigo-700 font-medium mb-1">Infinitas Soluções</h6>
                                                        <p className="text-xs text-gray-600">As retas são coincidentes. O determinante é zero e as equações são linearmente dependentes.</p>
                                                    </div>
                                                </div>
                                                <div className="bg-white p-3 rounded-md border border-gray-100 shadow-sm flex items-start">
                                                    <div className="flex-shrink-0 w-16 h-16 mr-3 relative border border-gray-200 rounded">
                                                        {/* Representação de retas paralelas */}
                                                        <div className="absolute top-0 left-0 w-full h-0.5 bg-blue-500 origin-top-left rotate-[30deg] transform translate-y-4"></div>
                                                        <div className="absolute top-0 left-0 w-full h-0.5 bg-red-500 origin-top-left rotate-[30deg] transform translate-y-12"></div>
                                                    </div>
                                                    <div>
                                                        <h6 className="text-indigo-700 font-medium mb-1">Sem Solução</h6>
                                                        <p className="text-xs text-gray-600">As retas são paralelas. O determinante é zero, mas as equações são inconsistentes.</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-4">
                                        <h5 className="font-medium text-gray-800 mb-2 border-b border-gray-200 pb-1">Métodos de Resolução</h5>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            <div className="p-3 bg-white rounded-md border border-gray-100 shadow-sm">
                                                <h6 className="text-indigo-700 font-medium mb-2">Regra de Cramer</h6>
                                                <p className="text-sm text-gray-600 mb-2">Usa determinantes para encontrar o valor das variáveis:</p>
                                                <div className="text-center space-y-1">
                                                    <p className="text-sm">x = det(D<sub>x</sub>)/det(D)</p>
                                                    <p className="text-sm">y = det(D<sub>y</sub>)/det(D)</p>
                                                </div>
                                                <p className="text-xs text-gray-500 mt-2">Onde D é a matriz de coeficientes, D<sub>x</sub> e D<sub>y</sub> são matrizes com a coluna respectiva substituída pelos termos independentes.</p>
                                            </div>
                                            <div className="p-3 bg-white rounded-md border border-gray-100 shadow-sm">
                                                <h6 className="text-indigo-700 font-medium mb-2">Outros Métodos</h6>
                                                <ul className="text-sm space-y-1 list-disc pl-4">
                                                    <li><span className="font-medium">Substituição:</span> Isolar uma variável e substituir</li>
                                                    <li><span className="font-medium">Eliminação:</span> Somar ou subtrair equações para eliminar variáveis</li>
                                                    <li><span className="font-medium">Matriz Aumentada:</span> Resolver usando operações elementares</li>
                                                    <li><span className="font-medium">Regra de Cramer:</span> Método dos determinantes</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-4 bg-yellow-50 p-3 rounded-md border-l-4 border-yellow-400">
                                        <h5 className="font-medium text-yellow-800 mb-1">Critério de Determinantes</h5>
                                        <p className="text-gray-700 text-sm mb-2">
                                            O determinante da matriz de coeficientes é crucial para determinar o tipo de solução:
                                        </p>
                                        <ul className="list-disc list-inside text-sm space-y-1 text-gray-700">
                                            <li><span className="font-medium">Se det ≠ 0:</span> O sistema possui uma única solução</li>
                                            <li><span className="font-medium">Se det = 0 e as equações são consistentes:</span> O sistema possui infinitas soluções</li>
                                            <li><span className="font-medium">Se det = 0 e as equações são inconsistentes:</span> O sistema não possui solução</li>
                                        </ul>
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

export default ResolvedorSistemasLineares;