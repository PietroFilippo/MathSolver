import React, { useState } from 'react';
import { HiCalculator } from 'react-icons/hi';
import {
    perimetroQuadrado,
    perimetroRetangulo,
    perimetroTriangulo,
    perimetroCirculo,
    perimetroTrapezio,
    perimetroLosango,
    perimetroHexagono,
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

                    perimetro = perimetroQuadrado(l);
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

                    perimetro = perimetroRetangulo(c, l);
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

                    perimetro = perimetroTriangulo(a, b, c);
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

                    perimetro = perimetroCirculo(r);
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

                    perimetro = perimetroTrapezio(lp1, lp2, lo1, lo2);
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

                    perimetro = perimetroLosango(l);
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

                    perimetro = perimetroHexagono(l);
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
                                Base Maior
                            </label>
                            <input
                                type="number"
                                id="ladoParalelo1"
                                value={ladoParalelo1}
                                onChange={(e) => handleNumberInput(e.target.value, setLadoParalelo1)}
                                className={inputClassName}
                                placeholder="Digite a base maior"
                                step="0.1"
                                min="0"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="ladoParalelo2" className="block text-sm font-medium text-gray-700 mb-2">
                                Base Menor
                            </label>
                            <input
                                type="number"
                                id="ladoParalelo2"
                                value={ladoParalelo2}
                                onChange={(e) => handleNumberInput(e.target.value, setLadoParalelo2)}
                                className={inputClassName}
                                placeholder="Digite a base menor"
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
                                placeholder="Digite o lado oblíquo 1"
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
                                placeholder="Digite o lado oblíquo 2"
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

    const getConceitoMatematico = () => {
        switch (figura) {
            case 'quadrado':
                return "Um quadrado é um polígono regular com quatro lados iguais e quatro ângulos retos (90°). " +
                       "Seu perímetro é calculado somando todos os seus lados, ou multiplicando um lado por 4.";
            case 'retangulo':
                return "Um retângulo é um quadrilátero com quatro ângulos retos. " +
                       "Seu perímetro é calculado somando todos os seus lados, ou multiplicando a soma do comprimento e largura por 2.";
            case 'triangulo':
                return "Um triângulo é um polígono com três lados. " +
                       "Seu perímetro é calculado somando todos os seus lados (a + b + c).";
            case 'circulo':
                return "Um círculo é uma figura plana onde todos os pontos estão a uma mesma distância do centro. " +
                       "Seu perímetro (circunferência) é calculado multiplicando o diâmetro por π, ou 2πr.";
            case 'trapezio':
                return "Um trapézio é um quadrilátero com dois lados paralelos (bases). " +
                       "Seu perímetro é calculado somando todos os seus lados (base maior + base menor + lados oblíquos).";
            case 'losango':
                return "Um losango é um quadrilátero com quatro lados iguais. " +
                       "Seu perímetro é calculado multiplicando o lado por 4.";
            case 'hexagono':
                return "Um hexágono regular é um polígono de seis lados iguais e seis ângulos iguais. " +
                       "Seu perímetro é calculado multiplicando o lado por 6.";
            default:
                return "";
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
                    Selecione a figura desejada e insira os dados necessários.
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

                            <div className="space-y-4">
                                {steps.map((step, index) => {
                                    const stepMatch = step.match(/^(Passo \d+:)(.*)$/);
                                    
                                    if (stepMatch) {
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
                                    {getConceitoMatematico()}
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