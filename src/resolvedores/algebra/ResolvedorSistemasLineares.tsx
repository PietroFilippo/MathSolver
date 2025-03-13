import { useState } from 'react';
import { aproximadamenteIguais, arredondarParaDecimais } from '../../utils/mathUtils';
import { sistemaLinear } from '../../utils/mathUtilsAlgebra';
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

        // Usa a função sistemaLinear para resolver o sistema
        const result = sistemaLinear(numA1, numB1, numC1, numA2, numB2, numC2);

        if (result === null) {
            // Sistema não tem solução única ou tem infinitas soluções
            // Verifica se o sistema é inconsistente
            // Se a1/a2 = b1/b2 ≠ c1/c2, o sistema é inconsistente
            const ratioA = numA1 / numA2;
            const ratioB = numB1 / numB2;
            const ratioC = numC1 / numC2;

            if (aproximadamenteIguais(ratioA, ratioB) && !aproximadamenteIguais(ratioA, ratioC)) {
                // Sistema inconsistente - sem solução
                calculationSteps.push(`Passo ${stepCount}: O determinante é zero e as razões dos coeficientes não são compatíveis, portanto, o sistema não possui soluções`);
                calculationSteps.push(`A razão dos coeficientes é: a₁/a₂ = ${arredondarParaDecimais(ratioA, 4)}, b₁/b₂ = ${arredondarParaDecimais(ratioB, 4)}, c₁/c₂ = ${arredondarParaDecimais(ratioC, 4)}`);
                calculationSteps.push(`Por causa que a₁/a₂ = b₁/b₂ ≠ c₁/c₂, o sistema é inconsistente e não possui soluções`);

                setSystemType('noSolution');
            } else {
                // Sistema com infinitas soluções
                calculationSteps.push(`Passo ${stepCount}: O determinante é zero e as equações são linearmente dependentes, portanto, o sistema possui infinitas soluções`);
                calculationSteps.push(`A razão dos coeficientes é: a₁/a₂ = ${arredondarParaDecimais(ratioA, 4)}, b₁/b₂ = ${arredondarParaDecimais(ratioB, 4)}, c₁/c₂ = ${arredondarParaDecimais(ratioC, 4)}`);
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
            calculationSteps.push(`x = det_x / det = ${(numC1 * numB2 - numC2 * numB1)} / ${det} = ${result.x}`);
            stepCount++;
            
            calculationSteps.push(`Passo ${stepCount}: Calcular y usando a regra de Cramer`);
            calculationSteps.push(`Substituímos a coluna dos coeficientes de y pelos termos independentes:`);
            calculationSteps.push(`det_y = ${numA1} * ${numC2} - ${numA2} * ${numC1} = ${numA1 * numC2 - numA2 * numC1}`);
            calculationSteps.push(`y = det_y / det = ${(numA1 * numC2 - numA2 * numC1)} / ${det} = ${result.y}`);
            stepCount++;
            
            // Verificação da solução
            calculationSteps.push(`Passo ${stepCount}: Verificar a solução substituindo os valores nas equações originais`);
            const eq1 = numA1 * result.x + numB1 * result.y;
            const eq2 = numA2 * result.x + numB2 * result.y;
            
            calculationSteps.push(`Equação 1: ${numA1} × ${arredondarParaDecimais(result.x, 4)} + ${numB1} × ${arredondarParaDecimais(result.y, 4)} = ${arredondarParaDecimais(eq1, 4)} ≈ ${numC1}`);
            calculationSteps.push(`Equação 2: ${numA2} × ${arredondarParaDecimais(result.x, 4)} + ${numB2} × ${arredondarParaDecimais(result.y, 4)} = ${arredondarParaDecimais(eq2, 4)} ≈ ${numC2}`);
            
            if (aproximadamenteIguais(eq1, numC1) && aproximadamenteIguais(eq2, numC2)) {
                calculationSteps.push(`A verificação confirma que a solução (x = ${arredondarParaDecimais(result.x, 4)}, y = ${arredondarParaDecimais(result.y, 4)}) é válida.`);
            } else {
                calculationSteps.push(`Nota: Há pequenas diferenças devido ao arredondamento.`);
            }

            setSolution(result);
            setSystemType('unique');
        }

        setSteps(calculationSteps);
        setShowExplanation(true);
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
                
                <div className="bg-blue-50 p-4 rounded-md mb-6">
                    <h4 className="font-medium text-blue-800 mb-2">Como usar:</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
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
                                <p className="text-xl font-bold mt-2">x = {arredondarParaDecimais(solution.x, 4)}</p>
                                <p className="text-xl font-bold">y = {arredondarParaDecimais(solution.y, 4)}</p>
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
                                <p className="text-gray-700 mb-2">
                                    Um sistema de equações lineares pode ter:
                                </p>
                                <ul className="list-disc list-inside mt-2 space-y-1 text-gray-700">
                                    <li>Uma única solução (as retas se interceptam em exatamente um ponto)</li>
                                    <li>Infinitas soluções (as retas são idênticas)</li>
                                    <li>Nenhuma solução (as retas são paralelas)</li>
                                </ul>
                                
                                <p className="mt-3 text-gray-700">
                                    O determinante da matriz de coeficientes nos diz qual caso temos:
                                </p>
                                <ul className="list-disc list-inside mt-2 space-y-1 text-gray-700">
                                    <li>Se determinante ≠ 0: Solução única</li>
                                    <li>Se determinante = 0: Ou não há solução ou há infinitas soluções</li>
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ResolvedorSistemasLineares;