import React, { useState } from 'react';
import {
    volumeCubo,
    volumeParalelepipedo,
    volumeEsfera,
    volumeCilindro,
    volumeCone,
    volumePiramide,
    volumePrisma,
} from '../../utils/mathUtilsGeometria';
import { HiCalculator } from 'react-icons/hi';

type Solido = 'cubo' | 'paralelepipedo' | 'esfera' | 'cilindro' | 'cone' | 'piramide' | 'prisma';

const ResolvedorVolumeSolidos: React.FC = () => {
    const [solido, setSolido] = useState<Solido>('cubo');
    const [aresta, setAresta] = useState<string>('');
    const [comprimento, setComprimento] = useState<string>('');
    const [largura, setLargura] = useState<string>('');
    const [altura, setAltura] = useState<string>('');
    const [raio, setRaio] = useState<string>('');
    const [raioBase, setRaioBase] = useState<string>('');
    const [areaBase, setAreaBase] = useState<string>('');
    const [result, setResult] = useState<number | null>(null);
    const [steps, setSteps] = useState<string[]>([]);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [showExplanation, setShowExplanation] = useState<boolean>(true);

    const handleNumberInput = (value: string, setter: (value: string) => void) => {
        if (value === '' || (!isNaN(Number(value)) && Number(value) >= 0)) {
            setter(value);
        }
    };

    const handleSolve = () => {
        setErrorMessage('');
        setSteps([]);
        
        try {
            let volume: number;
            const calculationSteps: string[] = [];
            let stepCount = 1;

            switch (solido) {
                case 'cubo':
                    if (!aresta) throw new Error('Por favor, insira o valor da aresta do cubo.');
                    const arestaNum = Number(aresta);
                    volume = volumeCubo(arestaNum);
                    calculationSteps.push(
                        `Passo ${stepCount++}: Para calcular o volume do cubo, usamos a fórmula V = a³`,
                        `Passo ${stepCount++}: Substituindo a aresta: V = ${arestaNum}³`,
                        `Passo ${stepCount++}: Calculando: V = ${volume} unidades cúbicas`
                    );
                    break;

                case 'paralelepipedo':
                    if (!comprimento || !largura || !altura) 
                        throw new Error('Por favor, insira todas as dimensões do paralelepípedo.');
                    const compNum = Number(comprimento);
                    const largNum = Number(largura);
                    const altNum = Number(altura);
                    volume = volumeParalelepipedo(compNum, largNum, altNum);
                    calculationSteps.push(
                        `Passo ${stepCount++}: Para calcular o volume do paralelepípedo, usamos a fórmula V = c × l × h`,
                        `Passo ${stepCount++}: Substituindo os valores: V = ${compNum} × ${largNum} × ${altNum}`,
                        `Passo ${stepCount++}: Calculando: V = ${volume} unidades cúbicas`
                    );
                    break;

                case 'esfera':
                    if (!raio) throw new Error('Por favor, insira o raio da esfera.');
                    const raioNum = Number(raio);
                    volume = volumeEsfera(raioNum);
                    calculationSteps.push(
                        `Passo ${stepCount++}: Para calcular o volume da esfera, usamos a fórmula V = (4/3)πr³`,
                        `Passo ${stepCount++}: Substituindo o raio: V = (4/3)π × ${raioNum}³`,
                        `Passo ${stepCount++}: Calculando: V = ${volume} unidades cúbicas`
                    );
                    break;

                case 'cilindro':
                    if (!raioBase || !altura) 
                        throw new Error('Por favor, insira o raio da base e a altura do cilindro.');
                    const raioBaseNum = Number(raioBase);
                    const altCilNum = Number(altura);
                    volume = volumeCilindro(raioBaseNum, altCilNum);
                    calculationSteps.push(
                        `Passo ${stepCount++}: Para calcular o volume do cilindro, usamos a fórmula V = πr²h`,
                        `Passo ${stepCount++}: Substituindo os valores: V = π × ${raioBaseNum}² × ${altCilNum}`,
                        `Passo ${stepCount++}: Calculando: V = ${volume} unidades cúbicas`
                    );
                    break;

                case 'cone':
                    if (!raioBase || !altura) 
                        throw new Error('Por favor, insira o raio da base e a altura do cone.');
                    const raioBaseConNum = Number(raioBase);
                    const altConNum = Number(altura);
                    volume = volumeCone(raioBaseConNum, altConNum);
                    calculationSteps.push(
                        `Passo ${stepCount++}: Para calcular o volume do cone, usamos a fórmula V = (1/3)πr²h`,
                        `Passo ${stepCount++}: Substituindo os valores: V = (1/3)π × ${raioBaseConNum}² × ${altConNum}`,
                        `Passo ${stepCount++}: Calculando: V = ${volume} unidades cúbicas`
                    );
                    break;

                case 'piramide':
                    if (!areaBase || !altura) 
                        throw new Error('Por favor, insira a área da base e a altura da pirâmide.');
                    const areaBaseNum = Number(areaBase);
                    const altPirNum = Number(altura);
                    volume = volumePiramide(areaBaseNum, altPirNum);
                    calculationSteps.push(
                        `Passo ${stepCount++}: Para calcular o volume da pirâmide, usamos a fórmula V = (1/3)Abh`,
                        `Passo ${stepCount++}: Substituindo os valores: V = (1/3) × ${areaBaseNum} × ${altPirNum}`,
                        `Passo ${stepCount++}: Calculando: V = ${volume} unidades cúbicas`
                    );
                    break;

                case 'prisma':
                    if (!areaBase || !altura) 
                        throw new Error('Por favor, insira a área da base e a altura do prisma.');
                    const areaBasePrismaNum = Number(areaBase);
                    const altPrismaNum = Number(altura);
                    volume = volumePrisma(areaBasePrismaNum, altPrismaNum);
                    calculationSteps.push(
                        `Passo ${stepCount++}: Para calcular o volume do prisma, usamos a fórmula V = Abh`,
                        `Passo ${stepCount++}: Substituindo os valores: V = ${areaBasePrismaNum} × ${altPrismaNum}`,
                        `Passo ${stepCount++}: Calculando: V = ${volume} unidades cúbicas`
                    );
                    break;

                default:
                    throw new Error('Sólido não reconhecido');
            }

            setResult(volume);
            setSteps(calculationSteps);
        } catch (error) {
            if (error instanceof Error) {
                setErrorMessage(error.message);
            }
        }
    };

    const renderFields = () => {
        const inputClassName = "w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500";
        
        switch (solido) {
            case 'cubo':
                return (
                    <div className="mb-4">
                        <label htmlFor="aresta" className="block text-sm font-medium text-gray-700 mb-2">
                            Aresta
                        </label>
                        <input
                            type="number"
                            id="aresta"
                            value={aresta}
                            onChange={(e) => handleNumberInput(e.target.value, setAresta)}
                            className={inputClassName}
                            placeholder="Digite o valor da aresta"
                            step="0.1"
                            min="0"
                        />
                    </div>
                );

            case 'paralelepipedo':
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
                        <div className="mb-4">
                            <label htmlFor="altura" className="block text-sm font-medium text-gray-700 mb-2">
                                Altura
                            </label>
                            <input
                                type="number"
                                id="altura"
                                value={altura}
                                onChange={(e) => handleNumberInput(e.target.value, setAltura)}
                                className={inputClassName}
                                placeholder="Digite a altura"
                                step="0.1"
                                min="0"
                            />
                        </div>
                    </>
                );

            case 'esfera':
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

            case 'cilindro':
            case 'cone':
                return (
                    <>
                        <div className="mb-4">
                            <label htmlFor="raioBase" className="block text-sm font-medium text-gray-700 mb-2">
                                Raio da Base
                            </label>
                            <input
                                type="number"
                                id="raioBase"
                                value={raioBase}
                                onChange={(e) => handleNumberInput(e.target.value, setRaioBase)}
                                className={inputClassName}
                                placeholder="Digite o raio da base"
                                step="0.1"
                                min="0"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="altura" className="block text-sm font-medium text-gray-700 mb-2">
                                Altura
                            </label>
                            <input
                                type="number"
                                id="altura"
                                value={altura}
                                onChange={(e) => handleNumberInput(e.target.value, setAltura)}
                                className={inputClassName}
                                placeholder="Digite a altura"
                                step="0.1"
                                min="0"
                            />
                        </div>
                    </>
                );

            case 'piramide':
            case 'prisma':
                return (
                    <>
                        <div className="mb-4">
                            <label htmlFor="areaBase" className="block text-sm font-medium text-gray-700 mb-2">
                                Área da Base
                            </label>
                            <input
                                type="number"
                                id="areaBase"
                                value={areaBase}
                                onChange={(e) => handleNumberInput(e.target.value, setAreaBase)}
                                className={inputClassName}
                                placeholder="Digite a área da base"
                                step="0.1"
                                min="0"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="altura" className="block text-sm font-medium text-gray-700 mb-2">
                                Altura
                            </label>
                            <input
                                type="number"
                                id="altura"
                                value={altura}
                                onChange={(e) => handleNumberInput(e.target.value, setAltura)}
                                className={inputClassName}
                                placeholder="Digite a altura"
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
        switch (solido) {
            case 'cubo':
                return "Um cubo é um sólido geométrico com seis faces quadradas iguais. " +
                       "Seu volume é calculado elevando a medida da aresta ao cubo (a³).";
            case 'paralelepipedo':
                return "Um paralelepípedo é um prisma com seis faces retangulares paralelas duas a duas. " +
                       "Seu volume é calculado multiplicando comprimento, largura e altura.";
            case 'esfera':
                return "Uma esfera é um sólido geométrico perfeitamente redondo. " +
                       "Seu volume é calculado pela fórmula V = (4/3)πr³, onde r é o raio.";
            case 'cilindro':
                return "Um cilindro é um sólido geométrico formado por duas bases circulares paralelas. " +
                       "Seu volume é calculado multiplicando a área da base pela altura (V = πr²h).";
            case 'cone':
                return "Um cone é um sólido geométrico formado por uma base circular e um vértice. " +
                       "Seu volume é calculado pela fórmula V = (1/3)πr²h, onde r é o raio da base e h a altura.";
            case 'piramide':
                return "Uma pirâmide é um sólido geométrico com uma base poligonal e faces triangulares. " +
                       "Seu volume é calculado multiplicando a área da base pela altura e dividindo por 3 (V = (1/3)Abh).";
            case 'prisma':
                return "Um prisma é um sólido geométrico com duas bases paralelas e faces laterais retangulares. " +
                       "Seu volume é calculado multiplicando a área da base pela altura (V = Abh).";
            default:
                return "";
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center mb-6">
                <HiCalculator className="h-6 w-6 text-indigo-600 mr-2" />
                <h2 className="text-2xl font-bold">Calculadora de Volumes de Sólidos Geométricos</h2>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-8">
                <p className="text-gray-700 mb-6">
                  Essa calculadora permite calcular o volume de diferentes sólidos geométricos.
                  Selecione o sólido desejado e insira os dados necessários. A calculadora calculará o volume do sólido.
                </p>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Selecione o sólido
                    </label>
                    <select
                        value={solido}
                        onChange={(e) => setSolido(e.target.value as Solido)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                    >
                        <option value="cubo">Cubo</option>
                        <option value="paralelepipedo">Paralelepípedo</option>
                        <option value="esfera">Esfera</option>
                        <option value="cilindro">Cilindro</option>
                        <option value="cone">Cone</option>
                        <option value="piramide">Pirâmide</option>
                        <option value="prisma">Prisma</option>
                    </select>
                </div>

                <div className="mb-6">
                    {renderFields()}
                </div>

                <button
                    onClick={handleSolve}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-md transition-colors duration-300"
                >
                    Calcular Volume
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
                            O volume do sólido é: <span className="font-bold">{result}</span> unidades cúbicas
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

export default ResolvedorVolumeSolidos; 