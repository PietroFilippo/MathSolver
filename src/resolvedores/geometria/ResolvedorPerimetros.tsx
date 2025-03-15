import React, { useState } from 'react';
import { HiCalculator } from 'react-icons/hi';
import {
    squarePerimeter,
    rectanglePerimeter,
    trianglePerimeter,
    circlePerimeter,
    trapezoidPerimeter,
    rhombusPerimeter,
    hexagonPerimeter,
    getPerimeterExamples
} from '../../utils/mathUtilsGeometria';

type FiguraPlana = 'quadrado' | 'retangulo' | 'triangulo' | 'circulo' | 'trapezio' | 'losango' | 'hexagono';

const ResolvedorPerimetros: React.FC = () => {
    const [figura, setFigura] = useState<FiguraPlana>('quadrado');
    const [lado, setLado] = useState<string>('');
    const [comprimento, setComprimento] = useState<string>('');
    const [largura, setLargura] = useState<string>('');
    const [ladoA, setLadoA] = useState<string>('');
    const [ladoB, setLadoB] = useState<string>('');
    const [ladoC, setLadoC] = useState<string>('');
    const [raio, setRaio] = useState<string>('');
    const [ladoParalelo1, setLadoParalelo1] = useState<string>('');
    const [ladoParalelo2, setLadoParalelo2] = useState<string>('');
    const [ladoObliquo1, setLadoObliquo1] = useState<string>('');
    const [ladoObliquo2, setLadoObliquo2] = useState<string>('');
    const [result, setResult] = useState<number | null>(null);
    const [steps, setSteps] = useState<string[]>([]);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [showExplanation, setShowExplanation] = useState<boolean>(true);

    const handleNumberInput = (value: string, setter: React.Dispatch<React.SetStateAction<string>>) => {
        const numberPattern = /^-?\d*\.?\d*$/;
        if (value === '' || numberPattern.test(value)) {
            setter(value);
        }
    };

    // Função para aplicar um exemplo
    const applyExample = (exemplo: { valores: Record<string, number> }) => {
        // Resetar todos os valores primeiro
        setLado('');
        setComprimento('');
        setLargura('');
        setLadoA('');
        setLadoB('');
        setLadoC('');
        setRaio('');
        setLadoParalelo1('');
        setLadoParalelo2('');
        setLadoObliquo1('');
        setLadoObliquo2('');
        
        // Aplicar os valores do exemplo
        for (const [key, value] of Object.entries(exemplo.valores)) {
            switch (key) {
                case 'lado':
                    setLado(value.toString());
                    break;
                case 'comprimento':
                    setComprimento(value.toString());
                    break;
                case 'largura':
                    setLargura(value.toString());
                    break;
                case 'ladoA':
                    setLadoA(value.toString());
                    break;
                case 'ladoB':
                    setLadoB(value.toString());
                    break;
                case 'ladoC':
                    setLadoC(value.toString());
                    break;
                case 'raio':
                    setRaio(value.toString());
                    break;
                case 'ladoParalelo1':
                    setLadoParalelo1(value.toString());
                    break;
                case 'ladoParalelo2':
                    setLadoParalelo2(value.toString());
                    break;
                case 'ladoObliquo1':
                    setLadoObliquo1(value.toString());
                    break;
                case 'ladoObliquo2':
                    setLadoObliquo2(value.toString());
                    break;
            }
        }
    };

    const handleSolve = () => {
        setErrorMessage('');
        setResult(null);
        setSteps([]);

        try {
            let perimetro: number;
            const calculationSteps: string[] = [];
            let stepCount = 1;

            switch (figura) {
                case 'quadrado': {
                    if (!lado.trim()) {
                        setErrorMessage('Por favor, insira o valor do lado do quadrado.');
                        return;
                    }
                    const l = parseFloat(lado);
                    if (isNaN(l) || l <= 0) {
                        setErrorMessage('O lado deve ser um número positivo.');
                        return;
                    }

                    perimetro = squarePerimeter(l);
                    calculationSteps.push(`Passo ${stepCount++}: O perímetro do quadrado é calculado pela fórmula: P = 4l`);
                    calculationSteps.push(`Passo ${stepCount++}: Substituindo o lado ${l} na fórmula:`);
                    calculationSteps.push(`P = 4 × ${l}`);
                    calculationSteps.push(`P = ${perimetro} unidades`);
                    break;
                }

                case 'retangulo': {
                    if (!comprimento.trim() || !largura.trim()) {
                        setErrorMessage('Por favor, insira o comprimento e a largura do retângulo.');
                        return;
                    }
                    const c = parseFloat(comprimento);
                    const l = parseFloat(largura);
                    if (isNaN(c) || isNaN(l) || c <= 0 || l <= 0) {
                        setErrorMessage('O comprimento e a largura devem ser números positivos.');
                        return;
                    }

                    perimetro = rectanglePerimeter(c, l);
                    calculationSteps.push(`Passo ${stepCount++}: O perímetro do retângulo é calculado pela fórmula: P = 2(c + l)`);
                    calculationSteps.push(`Passo ${stepCount++}: Substituindo o comprimento ${c} e a largura ${l} na fórmula:`);
                    calculationSteps.push(`P = 2(${c} + ${l})`);
                    calculationSteps.push(`P = ${perimetro} unidades`);
                    break;
                }

                case 'triangulo': {
                    if (!ladoA.trim() || !ladoB.trim() || !ladoC.trim()) {
                        setErrorMessage('Por favor, insira os três lados do triângulo.');
                        return;
                    }
                    const a = parseFloat(ladoA);
                    const b = parseFloat(ladoB);
                    const c = parseFloat(ladoC);
                    if (isNaN(a) || isNaN(b) || isNaN(c) || a <= 0 || b <= 0 || c <= 0) {
                        setErrorMessage('Todos os lados devem ser números positivos.');
                        return;
                    }
                    // Verificar se os lados formam um triângulo válido
                    if (a + b <= c || b + c <= a || a + c <= b) {
                        setErrorMessage('Os lados fornecidos não formam um triângulo válido.');
                        return;
                    }

                    perimetro = trianglePerimeter(a, b, c);
                    calculationSteps.push(`Passo ${stepCount++}: O perímetro do triângulo é calculado pela fórmula: P = a + b + c`);
                    calculationSteps.push(`Passo ${stepCount++}: Substituindo os lados ${a}, ${b} e ${c} na fórmula:`);
                    calculationSteps.push(`P = ${a} + ${b} + ${c}`);
                    calculationSteps.push(`P = ${perimetro} unidades`);
                    break;
                }

                case 'circulo': {
                    if (!raio.trim()) {
                        setErrorMessage('Por favor, insira o raio do círculo.');
                        return;
                    }
                    const r = parseFloat(raio);
                    if (isNaN(r) || r <= 0) {
                        setErrorMessage('O raio deve ser um número positivo.');
                        return;
                    }

                    perimetro = circlePerimeter(r);
                    calculationSteps.push(`Passo ${stepCount++}: O perímetro do círculo é calculado pela fórmula: P = 2πr`);
                    calculationSteps.push(`Passo ${stepCount++}: Substituindo o raio ${r} na fórmula:`);
                    calculationSteps.push(`P = 2π × ${r}`);
                    calculationSteps.push(`P = ${perimetro} unidades`);
                    break;
                }

                case 'trapezio': {
                    if (!ladoParalelo1.trim() || !ladoParalelo2.trim() || !ladoObliquo1.trim() || !ladoObliquo2.trim()) {
                        setErrorMessage('Por favor, insira todos os lados do trapézio.');
                        return;
                    }
                    const lp1 = parseFloat(ladoParalelo1);
                    const lp2 = parseFloat(ladoParalelo2);
                    const lo1 = parseFloat(ladoObliquo1);
                    const lo2 = parseFloat(ladoObliquo2);
                    if (isNaN(lp1) || isNaN(lp2) || isNaN(lo1) || isNaN(lo2) || 
                        lp1 <= 0 || lp2 <= 0 || lo1 <= 0 || lo2 <= 0) {
                        setErrorMessage('Todos os lados devem ser números positivos.');
                        return;
                    }

                    perimetro = trapezoidPerimeter(lp1, lp2, lo1, lo2);
                    calculationSteps.push(`Passo ${stepCount++}: O perímetro do trapézio é calculado pela fórmula: P = a + b + c + d`);
                    calculationSteps.push(`Passo ${stepCount++}: Substituindo os lados ${lp1}, ${lp2}, ${lo1} e ${lo2} na fórmula:`);
                    calculationSteps.push(`P = ${lp1} + ${lp2} + ${lo1} + ${lo2}`);
                    calculationSteps.push(`P = ${perimetro} unidades`);
                    break;
                }

                case 'losango': {
                    if (!lado.trim()) {
                        setErrorMessage('Por favor, insira o lado do losango.');
                        return;
                    }
                    const l = parseFloat(lado);
                    if (isNaN(l) || l <= 0) {
                        setErrorMessage('O lado deve ser um número positivo.');
                        return;
                    }

                    perimetro = rhombusPerimeter(l);
                    calculationSteps.push(`Passo ${stepCount++}: O perímetro do losango é calculado pela fórmula: P = 4l`);
                    calculationSteps.push(`Passo ${stepCount++}: Substituindo o lado ${l} na fórmula:`);
                    calculationSteps.push(`P = 4 × ${l}`);
                    calculationSteps.push(`P = ${perimetro} unidades`);
                    break;
                }

                case 'hexagono': {
                    if (!lado.trim()) {
                        setErrorMessage('Por favor, insira o lado do hexágono regular.');
                        return;
                    }
                    const l = parseFloat(lado);
                    if (isNaN(l) || l <= 0) {
                        setErrorMessage('O lado deve ser um número positivo.');
                        return;
                    }

                    perimetro = hexagonPerimeter(l);
                    calculationSteps.push(`Passo ${stepCount++}: O perímetro do hexágono regular é calculado pela fórmula: P = 6l`);
                    calculationSteps.push(`Passo ${stepCount++}: Substituindo o lado ${l} na fórmula:`);
                    calculationSteps.push(`P = 6 × ${l}`);
                    calculationSteps.push(`P = ${perimetro} unidades`);
                    break;
                }
            }

            setResult(perimetro!);
            setSteps(calculationSteps);
            setShowExplanation(true);

        } catch (error) {
            setErrorMessage('Ocorreu um erro ao calcular o perímetro.');
        }
    };

    // Função para renderizar os passos de explicação com estilização aprimorada
    const renderExplanationSteps = () => {
        return (
            <div className="space-y-4">
                {steps.map((step, index) => {
                    const stepMatch = step.match(/^(Passo \d+:)(.*)$/);
                    
                    // Verifica se é um passo de aplicação de fórmula
                    const formulaMatch = step.includes('calculado pela fórmula');
                    
                    // Verifica se é um passo de substituição de valores
                    const substitutionMatch = step.includes('Substituindo');
                    
                    // Verifica se é um cálculo direto
                    const calculationMatch = step.startsWith('P =') && !step.includes('unidades');
                    
                    // Verifica se é o resultado final
                    const resultMatch = step.includes('unidades');
                    
                    if (stepMatch) {
                        // Se for um passo numerado, extrai e destaca o número
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
                    } else if (formulaMatch) {
                        // Se for uma explicação de fórmula
                        return (
                            <div key={index} className="p-3 bg-blue-50 rounded-md ml-4 border-l-2 border-blue-300">
                                <p className="text-blue-700 font-medium">{step}</p>
                            </div>
                        );
                    } else if (substitutionMatch) {
                        // Se for um passo de substituição
                        return (
                            <div key={index} className="p-3 bg-purple-50 rounded-md ml-4 border-l-2 border-purple-300">
                                <p className="text-purple-700 font-medium">{step}</p>
                            </div>
                        );
                    } else if (calculationMatch) {
                        // Se for um cálculo direto
                        return (
                            <div key={index} className="p-3 bg-amber-50 rounded-md ml-4 border-l-2 border-amber-300">
                                <p className="text-amber-700 font-medium">{step}</p>
                            </div>
                        );
                    } else if (resultMatch) {
                        // Se for o resultado final
                        return (
                            <div key={index} className="p-3 bg-green-50 rounded-md ml-4 border-l-2 border-green-300">
                                <p className="text-green-700 font-medium">{step}</p>
                            </div>
                        );
                    } else {
                        // Outro tipo de passo
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

    const renderFields = () => {
        const inputClassName = "w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500";
        
        switch (figura) {
            case 'quadrado':
            case 'losango':
            case 'hexagono':
                return (
                    <div className="mb-4">
                        <label htmlFor="lado" className="block text-sm font-medium text-gray-700 mb-2">
                            Lado
                        </label>
                        <input
                            type="number"
                            id="lado"
                            value={lado}
                            onChange={(e) => handleNumberInput(e.target.value, setLado)}
                            className={inputClassName}
                            placeholder="Digite o valor do lado"
                            step="0.1"
                            min="0"
                        />
                    </div>
                );

            case 'retangulo':
                return (
                    <>
                        <div className="mb-4">
                            <label htmlFor="comprimento" className="block text-sm font-medium text-gray-700 mb-2">
                                Comprimento
                            </label>
                            <input
                                type="number"
                                id="comprimento"
                                value={comprimento}
                                onChange={(e) => handleNumberInput(e.target.value, setComprimento)}
                                className={inputClassName}
                                placeholder="Digite o comprimento"
                                step="0.1"
                                min="0"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="largura" className="block text-sm font-medium text-gray-700 mb-2">
                                Largura
                            </label>
                            <input
                                type="number"
                                id="largura"
                                value={largura}
                                onChange={(e) => handleNumberInput(e.target.value, setLargura)}
                                className={inputClassName}
                                placeholder="Digite a largura"
                                step="0.1"
                                min="0"
                            />
                        </div>
                    </>
                );

            case 'triangulo':
                return (
                    <>
                        <div className="mb-4">
                            <label htmlFor="ladoA" className="block text-sm font-medium text-gray-700 mb-2">
                                Lado A
                            </label>
                            <input
                                type="number"
                                id="ladoA"
                                value={ladoA}
                                onChange={(e) => handleNumberInput(e.target.value, setLadoA)}
                                className={inputClassName}
                                placeholder="Digite o lado A"
                                step="0.1"
                                min="0"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="ladoB" className="block text-sm font-medium text-gray-700 mb-2">
                                Lado B
                            </label>
                            <input
                                type="number"
                                id="ladoB"
                                value={ladoB}
                                onChange={(e) => handleNumberInput(e.target.value, setLadoB)}
                                className={inputClassName}
                                placeholder="Digite o lado B"
                                step="0.1"
                                min="0"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="ladoC" className="block text-sm font-medium text-gray-700 mb-2">
                                Lado C
                            </label>
                            <input
                                type="number"
                                id="ladoC"
                                value={ladoC}
                                onChange={(e) => handleNumberInput(e.target.value, setLadoC)}
                                className={inputClassName}
                                placeholder="Digite o lado C"
                                step="0.1"
                                min="0"
                            />
                        </div>
                    </>
                );

            case 'circulo':
                return (
                    <div className="mb-4">
                        <label htmlFor="raio" className="block text-sm font-medium text-gray-700 mb-2">
                            Raio
                        </label>
                        <input
                            type="number"
                            id="raio"
                            value={raio}
                            onChange={(e) => handleNumberInput(e.target.value, setRaio)}
                            className={inputClassName}
                            placeholder="Digite o raio"
                            step="0.1"
                            min="0"
                        />
                    </div>
                );

            case 'trapezio':
                return (
                    <>
                        <div className="mb-4">
                            <label htmlFor="ladoParalelo1" className="block text-sm font-medium text-gray-700 mb-2">
                                Base 1 (Lado Paralelo)
                            </label>
                            <input
                                type="number"
                                id="ladoParalelo1"
                                value={ladoParalelo1}
                                onChange={(e) => handleNumberInput(e.target.value, setLadoParalelo1)}
                                className={inputClassName}
                                placeholder="Digite a primeira base"
                                step="0.1"
                                min="0"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="ladoParalelo2" className="block text-sm font-medium text-gray-700 mb-2">
                                Base 2 (Lado Paralelo)
                            </label>
                            <input
                                type="number"
                                id="ladoParalelo2"
                                value={ladoParalelo2}
                                onChange={(e) => handleNumberInput(e.target.value, setLadoParalelo2)}
                                className={inputClassName}
                                placeholder="Digite a segunda base"
                                step="0.1"
                                min="0"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="ladoObliquo1" className="block text-sm font-medium text-gray-700 mb-2">
                                Lado Oblíquo 1
                            </label>
                            <input
                                type="number"
                                id="ladoObliquo1"
                                value={ladoObliquo1}
                                onChange={(e) => handleNumberInput(e.target.value, setLadoObliquo1)}
                                className={inputClassName}
                                placeholder="Digite o primeiro lado oblíquo"
                                step="0.1"
                                min="0"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="ladoObliquo2" className="block text-sm font-medium text-gray-700 mb-2">
                                Lado Oblíquo 2
                            </label>
                            <input
                                type="number"
                                id="ladoObliquo2"
                                value={ladoObliquo2}
                                onChange={(e) => handleNumberInput(e.target.value, setLadoObliquo2)}
                                className={inputClassName}
                                placeholder="Digite o segundo lado oblíquo"
                                step="0.1"
                                min="0"
                            />
                        </div>
                    </>
                );

            default:
                return null;
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center mb-6">
                <HiCalculator className="h-6 w-6 text-indigo-600 mr-2" />
                <h2 className="text-2xl font-bold">Calculadora de Perímetros de Figuras Planas</h2>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-8">
                <p className="text-gray-700 mb-6">
                    Essa calculadora permite calcular o perímetro de diferentes figuras planas geométricas.
                    Selecione a figura desejada e insira os dados necessários. A calculadora calculará o perímetro da figura.
                </p>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Selecione a figura
                    </label>
                    <select
                        value={figura}
                        onChange={(e) => setFigura(e.target.value as FiguraPlana)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                    >
                        <option value="quadrado">Quadrado</option>
                        <option value="retangulo">Retângulo</option>
                        <option value="triangulo">Triângulo</option>
                        <option value="circulo">Círculo</option>
                        <option value="trapezio">Trapézio</option>
                        <option value="losango">Losango</option>
                        <option value="hexagono">Hexágono Regular</option>
                    </select>
                </div>

                {/* Exemplos */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Exemplos
                    </label>
                    <div className="flex flex-wrap gap-2 mb-4">
                        {getPerimeterExamples(figura).map((exemplo, index) => (
                            <button
                                key={index}
                                onClick={() => applyExample(exemplo)}
                                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-full transition-colors"
                            >
                                {exemplo.description}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mb-6">
                    {renderFields()}
                </div>

                <button
                    onClick={handleSolve}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-md transition-colors duration-300"
                >
                    Calcular Perímetro
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
                            O perímetro da figura é: <span className="font-bold">{result}</span> unidades
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
                                    Explicação Detalhada
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
                                            <h5 className="font-medium text-gray-800 mb-2 border-b border-gray-200 pb-1">Perímetro de Figuras Planas</h5>
                                            <div className="space-y-3">
                                                <p className="text-gray-700">
                                                    O perímetro de uma figura plana é a medida total do contorno da figura, ou seja, 
                                                    a soma dos comprimentos de todos os lados (para polígonos) ou a medida da circunferência (para círculos).
                                                </p>
                                                <div className="bg-white p-3 rounded-md border border-gray-100 shadow-sm">
                                                    <h6 className="text-indigo-700 font-medium mb-2">Fórmulas de Perímetro</h6>
                                                    <div className="space-y-2 text-sm text-gray-700">
                                                        {figura === 'quadrado' && (
                                                            <div className="p-2 border-b border-gray-50">
                                                                <span className="font-medium">Quadrado:</span> P = 4l, onde l é o comprimento do lado
                                                            </div>
                                                        )}
                                                        {figura === 'retangulo' && (
                                                            <div className="p-2 border-b border-gray-50">
                                                                <span className="font-medium">Retângulo:</span> P = 2(c + l), onde c é o comprimento e l é a largura
                                                            </div>
                                                        )}
                                                        {figura === 'triangulo' && (
                                                            <div className="p-2 border-b border-gray-50">
                                                                <span className="font-medium">Triângulo:</span> P = a + b + c, onde a, b e c são os comprimentos dos lados
                                                            </div>
                                                        )}
                                                        {figura === 'circulo' && (
                                                            <div className="p-2 border-b border-gray-50">
                                                                <span className="font-medium">Círculo:</span> P = 2πr, onde r é o raio e π ≈ 3,14159...
                                                            </div>
                                                        )}
                                                        {figura === 'trapezio' && (
                                                            <div className="p-2 border-b border-gray-50">
                                                                <span className="font-medium">Trapézio:</span> P = a + b + c + d, onde a e b são os lados paralelos e c e d são os lados oblíquos
                                                            </div>
                                                        )}
                                                        {figura === 'losango' && (
                                                            <div className="p-2 border-b border-gray-50">
                                                                <span className="font-medium">Losango:</span> P = 4l, onde l é o comprimento do lado
                                                            </div>
                                                        )}
                                                        {figura === 'hexagono' && (
                                                            <div className="p-2 border-b border-gray-50">
                                                                <span className="font-medium">Hexágono Regular:</span> P = 6l, onde l é o comprimento do lado
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="p-3 bg-indigo-50 rounded-md">
                                                    <h6 className="text-indigo-700 font-medium mb-2">Princípios Fundamentais</h6>
                                                    <ul className="text-sm space-y-1 list-disc pl-4 text-gray-700">
                                                        <li>O perímetro é uma grandeza unidimensional e deve ser expressa em unidades lineares (m, cm, km, etc.)</li>
                                                        <li>Figuras com o mesmo perímetro podem ter áreas diferentes</li>
                                                        <li>Figuras semelhantes têm seus perímetros proporcionais à razão de semelhança</li>
                                                        <li>Para qualquer polígono regular de n lados, o perímetro é calculado multiplicando o comprimento do lado por n</li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="flex-1">
                                            <h5 className="font-medium text-gray-800 mb-2 border-b border-gray-200 pb-1">Características da Figura</h5>
                                            <div className="bg-white p-3 rounded-md border border-gray-100 shadow-sm space-y-4">
                                                <div className="space-y-2">
                                                    {figura === 'quadrado' && (
                                                        <>
                                                            <h6 className="text-indigo-700 font-medium">Quadrado</h6>
                                                            <p className="text-sm text-gray-700">Um quadrado é um polígono regular com quatro lados iguais e quatro ângulos retos (90°).</p>
                                                            <ul className="text-xs space-y-1 list-disc pl-4 text-gray-600">
                                                                <li>Todos os lados têm o mesmo comprimento</li>
                                                                <li>Todos os ângulos internos medem 90°</li>
                                                                <li>As diagonais são iguais e perpendiculares entre si</li>
                                                                <li>É um caso especial de losango, retângulo e paralelogramo</li>
                                                                <li>Área = lado²</li>
                                                            </ul>
                                                        </>
                                                    )}
                                                    {figura === 'retangulo' && (
                                                        <>
                                                            <h6 className="text-indigo-700 font-medium">Retângulo</h6>
                                                            <p className="text-sm text-gray-700">Um retângulo é um quadrilátero com quatro ângulos retos.</p>
                                                            <ul className="text-xs space-y-1 list-disc pl-4 text-gray-600">
                                                                <li>Lados opostos são paralelos e iguais</li>
                                                                <li>Todos os ângulos internos medem 90°</li>
                                                                <li>As diagonais são iguais e bissetoras uma da outra</li>
                                                                <li>É um caso especial de paralelogramo</li>
                                                                <li>Área = comprimento × largura</li>
                                                            </ul>
                                                        </>
                                                    )}
                                                    {figura === 'triangulo' && (
                                                        <>
                                                            <h6 className="text-indigo-700 font-medium">Triângulo</h6>
                                                            <p className="text-sm text-gray-700">Um triângulo é um polígono com três lados e três ângulos.</p>
                                                            <ul className="text-xs space-y-1 list-disc pl-4 text-gray-600">
                                                                <li>A soma dos ângulos internos é sempre 180°</li>
                                                                <li>Para formar um triângulo válido, a soma de quaisquer dois lados deve ser maior que o terceiro lado</li>
                                                                <li>Pode ser classificado quanto aos lados (equilátero, isósceles, escaleno) ou ângulos (acutângulo, retângulo, obtusângulo)</li>
                                                                <li>Área = (base × altura) ÷ 2</li>
                                                            </ul>
                                                        </>
                                                    )}
                                                    {figura === 'circulo' && (
                                                        <>
                                                            <h6 className="text-indigo-700 font-medium">Círculo</h6>
                                                            <p className="text-sm text-gray-700">Um círculo é uma figura plana onde todos os pontos estão a uma mesma distância do centro.</p>
                                                            <ul className="text-xs space-y-1 list-disc pl-4 text-gray-600">
                                                                <li>O raio é a distância do centro a qualquer ponto da circunferência</li>
                                                                <li>O diâmetro é o dobro do raio (d = 2r) e divide o círculo em duas partes iguais</li>
                                                                <li>A circunferência é o contorno do círculo e equivale ao perímetro</li>
                                                                <li>Área = πr²</li>
                                                            </ul>
                                                        </>
                                                    )}
                                                    {figura === 'trapezio' && (
                                                        <>
                                                            <h6 className="text-indigo-700 font-medium">Trapézio</h6>
                                                            <p className="text-sm text-gray-700">Um trapézio é um quadrilátero com dois lados paralelos (bases).</p>
                                                            <ul className="text-xs space-y-1 list-disc pl-4 text-gray-600">
                                                                <li>Os lados paralelos são chamados de bases (maior e menor)</li>
                                                                <li>Os outros dois lados são chamados de lados oblíquos ou não paralelos</li>
                                                                <li>Um trapézio isósceles tem os lados oblíquos iguais</li>
                                                                <li>Um trapézio retângulo tem dois ângulos retos</li>
                                                                <li>Área = [(base maior + base menor) × altura] ÷ 2</li>
                                                            </ul>
                                                        </>
                                                    )}
                                                    {figura === 'losango' && (
                                                        <>
                                                            <h6 className="text-indigo-700 font-medium">Losango</h6>
                                                            <p className="text-sm text-gray-700">Um losango é um quadrilátero com quatro lados iguais.</p>
                                                            <ul className="text-xs space-y-1 list-disc pl-4 text-gray-600">
                                                                <li>Todos os lados têm o mesmo comprimento</li>
                                                                <li>Lados opostos são paralelos</li>
                                                                <li>Ângulos opostos são iguais</li>
                                                                <li>As diagonais são perpendiculares entre si e bissetoras uma da outra</li>
                                                                <li>Área = (diagonal maior × diagonal menor) ÷ 2</li>
                                                            </ul>
                                                        </>
                                                    )}
                                                    {figura === 'hexagono' && (
                                                        <>
                                                            <h6 className="text-indigo-700 font-medium">Hexágono Regular</h6>
                                                            <p className="text-sm text-gray-700">Um hexágono regular é um polígono de seis lados iguais e seis ângulos iguais.</p>
                                                            <ul className="text-xs space-y-1 list-disc pl-4 text-gray-600">
                                                                <li>Todos os lados têm o mesmo comprimento</li>
                                                                <li>Todos os ângulos internos medem 120°</li>
                                                                <li>A soma dos ângulos internos é 720° (6 × 120°)</li>
                                                                <li>Pode ser dividido em 6 triângulos equiláteros a partir do centro</li>
                                                                <li>Área = (3 × √3 × lado²) ÷ 2</li>
                                                            </ul>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="bg-white p-3 rounded-md border border-gray-100 shadow-sm">
                                            <h5 className="font-medium text-gray-800 mb-2">Aplicações Práticas</h5>
                                            <div className="space-y-2">
                                                <p className="text-sm text-gray-700">O cálculo de perímetros é essencial em diversos contextos:</p>
                                                <ul className="text-sm space-y-1 list-disc pl-4 text-gray-700">
                                                    <li><span className="font-medium">Construção Civil:</span> Cálculo de materiais para cercas, rodapés, molduras, etc.</li>
                                                    <li><span className="font-medium">Agricultura:</span> Cálculo de materiais para cercamento de terrenos e irrigação</li>
                                                    <li><span className="font-medium">Arquitetura:</span> Planejamento de contornos, acabamentos e custos de materiais</li>
                                                    <li><span className="font-medium">Esportes:</span> Definição de distâncias em pistas de corrida e quadras</li>
                                                    <li><span className="font-medium">Geografia:</span> Medição do contorno de fronteiras, costas e ilhas</li>
                                                    <li><span className="font-medium">Física:</span> Cálculos de tensão superficial e resistência de materiais</li>
                                                </ul>
                                            </div>
                                        </div>

                                        <div className="bg-yellow-50 p-3 rounded-md border-l-4 border-yellow-400">
                                            <h5 className="font-medium text-yellow-800 mb-2">Dicas de Resolução</h5>
                                            <ul className="text-sm space-y-1 list-disc pl-4 text-gray-700">
                                                <li>Sempre verifique se todas as medidas estão na mesma unidade</li>
                                                <li>Para figuras complexas, divida-as em segmentos e some os comprimentos</li>
                                                <li>Lembre-se que o perímetro não depende da forma da figura, apenas do comprimento total do contorno</li>
                                                <li>Para círculos, utilize π = 3,14159 ou a constante π da calculadora para maior precisão</li>
                                                <li>Ao comparar figuras, figuras com maior perímetro não necessariamente têm maior área</li>
                                                <li>Em triângulos, verifique se os lados satisfazem a desigualdade triangular</li>
                                            </ul>
                                        </div>
                            </div>
                            
                                    <div className="mt-4 p-3 bg-indigo-50 rounded-md border border-indigo-100">
                                        <h5 className="font-medium text-indigo-800 mb-1 flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                            </svg>
                                            Relação com Outros Conceitos
                                        </h5>
                                        <p className="text-sm text-indigo-700">
                                            O perímetro está relacionado com diversos outros conceitos matemáticos. Em geometria, 
                                            existe o Problema Isoperimétrico, que busca encontrar a figura com maior área possível para 
                                            um perímetro fixo (o círculo é a solução). O conceito de perímetro também é importante em 
                                            cálculo diferencial, onde o comprimento de arco de curvas é determinado usando integrais. 
                                            Na física, o perímetro está relacionado a conceitos como tensão superficial, difusão e capacitância, 
                                            enquanto na biologia, a relação entre perímetro e área é crucial para entender a capacidade de troca 
                                            de nutrientes e calor em organismos.
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

export default ResolvedorPerimetros;