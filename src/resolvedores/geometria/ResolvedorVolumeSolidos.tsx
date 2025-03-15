import React, { useState } from 'react';
import {
    cubeVolume,
    cuboidVolume,
    sphereVolume,
    cylinderVolume,
    coneVolume,
    pyramidVolume,
    prismVolume,
    getVolumeExamples
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

    // Função para aplicar um exemplo
    const applyExample = (exemplo: { valores: Record<string, number> }) => {
        // Resetar todos os valores primeiro
        setAresta('');
        setComprimento('');
        setLargura('');
        setAltura('');
        setRaio('');
        setRaioBase('');
        setAreaBase('');
        
        // Aplicar os valores do exemplo
        for (const [key, value] of Object.entries(exemplo.valores)) {
            switch (key) {
                case 'aresta':
                    setAresta(value.toString());
                    break;
                case 'comprimento':
                    setComprimento(value.toString());
                    break;
                case 'largura':
                    setLargura(value.toString());
                    break;
                case 'altura':
                    setAltura(value.toString());
                    break;
                case 'raio':
                    setRaio(value.toString());
                    break;
                case 'raioBase':
                    setRaioBase(value.toString());
                    break;
                case 'areaBase':
                    setAreaBase(value.toString());
                    break;
            }
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
                    volume = cubeVolume(arestaNum);
                    calculationSteps.push(
                        `Passo ${stepCount++}: Para calcular o volume do cubo, usamos a fórmula V = a³`,
                        `Passo ${stepCount++}: Substituindo a aresta: V = ${arestaNum}³`,
                        `V = ${arestaNum} × ${arestaNum} × ${arestaNum}`,
                        `V = ${volume} unidades cúbicas`
                    );
                    break;

                case 'paralelepipedo':
                    if (!comprimento || !largura || !altura) 
                        throw new Error('Por favor, insira todas as dimensões do paralelepípedo.');
                    const compNum = Number(comprimento);
                    const largNum = Number(largura);
                    const altNum = Number(altura);
                    volume = cuboidVolume(compNum, largNum, altNum);
                    calculationSteps.push(
                        `Passo ${stepCount++}: Para calcular o volume do paralelepípedo, usamos a fórmula V = c × l × h`,
                        `Passo ${stepCount++}: Substituindo os valores: V = ${compNum} × ${largNum} × ${altNum}`,
                        `V = ${compNum * largNum * altNum} unidades cúbicas`
                    );
                    break;

                case 'esfera':
                    if (!raio) throw new Error('Por favor, insira o raio da esfera.');
                    const raioNum = Number(raio);
                    volume = sphereVolume(raioNum);
                    calculationSteps.push(
                        `Passo ${stepCount++}: Para calcular o volume da esfera, usamos a fórmula V = (4/3)πr³`,
                        `Passo ${stepCount++}: Substituindo o raio: V = (4/3)π × ${raioNum}³`,
                        `V = (4/3) × ${Math.PI.toFixed(4)} × ${raioNum}³`,
                        `V = (4/3) × ${Math.PI.toFixed(4)} × ${Math.pow(raioNum, 3).toFixed(4)}`,
                        `V = ${volume} unidades cúbicas`
                    );
                    break;

                case 'cilindro':
                    if (!raioBase || !altura) 
                        throw new Error('Por favor, insira o raio da base e a altura do cilindro.');
                    const raioBaseNum = Number(raioBase);
                    const altCilNum = Number(altura);
                    volume = cylinderVolume(raioBaseNum, altCilNum);
                    calculationSteps.push(
                        `Passo ${stepCount++}: Para calcular o volume do cilindro, usamos a fórmula V = πr²h`,
                        `Passo ${stepCount++}: Substituindo os valores: V = π × ${raioBaseNum}² × ${altCilNum}`,
                        `V = ${Math.PI.toFixed(4)} × ${Math.pow(raioBaseNum, 2).toFixed(4)} × ${altCilNum}`,
                        `V = ${volume} unidades cúbicas`
                    );
                    break;

                case 'cone':
                    if (!raioBase || !altura) 
                        throw new Error('Por favor, insira o raio da base e a altura do cone.');
                    const raioBaseConNum = Number(raioBase);
                    const altConNum = Number(altura);
                    volume = coneVolume(raioBaseConNum, altConNum);
                    calculationSteps.push(
                        `Passo ${stepCount++}: Para calcular o volume do cone, usamos a fórmula V = (1/3)πr²h`,
                        `Passo ${stepCount++}: Substituindo os valores: V = (1/3)π × ${raioBaseConNum}² × ${altConNum}`,
                        `V = (1/3) × ${Math.PI.toFixed(4)} × ${Math.pow(raioBaseConNum, 2).toFixed(4)} × ${altConNum}`,
                        `V = ${volume} unidades cúbicas`
                    );
                    break;

                case 'piramide':
                    if (!areaBase || !altura) 
                        throw new Error('Por favor, insira a área da base e a altura da pirâmide.');
                    const areaBaseNum = Number(areaBase);
                    const altPirNum = Number(altura);
                    volume = pyramidVolume(areaBaseNum, altPirNum);
                    calculationSteps.push(
                        `Passo ${stepCount++}: Para calcular o volume da pirâmide, usamos a fórmula V = (1/3)Abh`,
                        `Passo ${stepCount++}: Substituindo os valores: V = (1/3) × ${areaBaseNum} × ${altPirNum}`,
                        `V = (1/3) × ${areaBaseNum * altPirNum}`,
                        `V = ${volume} unidades cúbicas`
                    );
                    break;

                case 'prisma':
                    if (!areaBase || !altura) 
                        throw new Error('Por favor, insira a área da base e a altura do prisma.');
                    const areaBasePrismaNum = Number(areaBase);
                    const altPrismaNum = Number(altura);
                    volume = prismVolume(areaBasePrismaNum, altPrismaNum);
                    calculationSteps.push(
                        `Passo ${stepCount++}: Para calcular o volume do prisma, usamos a fórmula V = Abh`,
                        `Passo ${stepCount++}: Substituindo os valores: V = ${areaBasePrismaNum} × ${altPrismaNum}`,
                        `V = ${volume} unidades cúbicas`
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

    // Função para renderizar os passos de explicação com estilização aprimorada
    const renderExplanationSteps = () => {
        return (
            <div className="space-y-4">
                {steps.map((step, index) => {
                    const stepMatch = step.match(/^(Passo \d+:)(.*)$/);
                    
                    // Verifica se contém informação sobre fórmula
                    const formulaMatch = step.includes('fórmula');
                    
                    // Verifica se é um passo de substituição de valores
                    const substitutionMatch = step.includes('Substituindo');
                    
                    // Verifica se é cálculo intermediário 
                    const intermediateMatch = step.startsWith('V =') && !step.includes('unidades cúbicas');
                    
                    // Verifica se é o resultado final
                    const resultMatch = step.includes('unidades cúbicas');
                    
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
                    } else if (intermediateMatch) {
                        // Se for um cálculo intermediário
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
                        // Outros passos
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

                {/* Exemplos */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Exemplos
                    </label>
                    <div className="flex flex-wrap gap-2 mb-4">
                        {getVolumeExamples(solido).map((exemplo, index) => (
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
                                            <h5 className="font-medium text-gray-800 mb-2 border-b border-gray-200 pb-1">Volume de Sólidos Geométricos</h5>
                                            <div className="space-y-3">
                                                <p className="text-gray-700">
                                                    O volume de um sólido geométrico é a medida do espaço ocupado pelo sólido no espaço tridimensional. 
                                                    É expresso em unidades cúbicas, como centímetros cúbicos (cm³) ou metros cúbicos (m³).
                                                </p>
                                                <div className="bg-white p-3 rounded-md border border-gray-100 shadow-sm">
                                                    <h6 className="text-indigo-700 font-medium mb-2">Fórmulas de Volume</h6>
                                                    <div className="space-y-2 text-sm text-gray-700">
                                                        {solido === 'cubo' && (
                                                            <div className="p-2 border-b border-gray-50">
                                                                <span className="font-medium">Cubo:</span> V = a³, onde a é o comprimento da aresta
                                                            </div>
                                                        )}
                                                        {solido === 'paralelepipedo' && (
                                                            <div className="p-2 border-b border-gray-50">
                                                                <span className="font-medium">Paralelepípedo:</span> V = c × l × h, onde c é o comprimento, l é a largura e h é a altura
                                                            </div>
                                                        )}
                                                        {solido === 'esfera' && (
                                                            <div className="p-2 border-b border-gray-50">
                                                                <span className="font-medium">Esfera:</span> V = (4/3)πr³, onde r é o raio
                                                            </div>
                                                        )}
                                                        {solido === 'cilindro' && (
                                                            <div className="p-2 border-b border-gray-50">
                                                                <span className="font-medium">Cilindro:</span> V = πr²h, onde r é o raio da base e h é a altura
                                                            </div>
                                                        )}
                                                        {solido === 'cone' && (
                                                            <div className="p-2 border-b border-gray-50">
                                                                <span className="font-medium">Cone:</span> V = (1/3)πr²h, onde r é o raio da base e h é a altura
                                                            </div>
                                                        )}
                                                        {solido === 'piramide' && (
                                                            <div className="p-2 border-b border-gray-50">
                                                                <span className="font-medium">Pirâmide:</span> V = (1/3)A_b × h, onde A_b é a área da base e h é a altura
                                                            </div>
                                                        )}
                                                        {solido === 'prisma' && (
                                                            <div className="p-2">
                                                                <span className="font-medium">Prisma:</span> V = A_b × h, onde A_b é a área da base e h é a altura
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="p-3 bg-indigo-50 rounded-md">
                                                    <h6 className="text-indigo-700 font-medium mb-2">Princípios Fundamentais</h6>
                                                    <ul className="text-sm space-y-1 list-disc pl-4 text-gray-700">
                                                        <li>Um sólido regular tem todas as faces iguais e os mesmos ângulos em cada vértice</li>
                                                        <li>O volume de qualquer prisma ou cilindro é o produto da área da base pela altura</li>
                                                        <li>O volume de qualquer pirâmide ou cone é um terço do produto da área da base pela altura</li>
                                                        <li>O Princípio de Cavalieri: sólidos com a mesma altura e mesma área de seção transversal em cada altura têm o mesmo volume</li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="flex-1">
                                            <h5 className="font-medium text-gray-800 mb-2 border-b border-gray-200 pb-1">Características dos Sólidos</h5>
                                            <div className="bg-white p-3 rounded-md border border-gray-100 shadow-sm space-y-4">
                                                <div className="space-y-2">
                                                    {solido === 'cubo' && (
                                                        <>
                                                            <h6 className="text-indigo-700 font-medium">Cubo</h6>
                                                            <p className="text-sm text-gray-700">Um cubo é um sólido geométrico com seis faces quadradas iguais. Possui 8 vértices e 12 arestas.</p>
                                                            <ul className="text-xs space-y-1 list-disc pl-4 text-gray-600">
                                                                <li>Todas as faces são quadrados congruentes</li>
                                                                <li>Todas as arestas têm o mesmo comprimento</li>
                                                                <li>Todos os ângulos são retos (90°)</li>
                                                                <li>É um caso especial de paralelepípedo</li>
                                                            </ul>
                                                        </>
                                                    )}
                                                    {solido === 'paralelepipedo' && (
                                                        <>
                                                            <h6 className="text-indigo-700 font-medium">Paralelepípedo</h6>
                                                            <p className="text-sm text-gray-700">Um paralelepípedo é um prisma com seis faces retangulares paralelas duas a duas. Possui 8 vértices e 12 arestas.</p>
                                                            <ul className="text-xs space-y-1 list-disc pl-4 text-gray-600">
                                                                <li>Todas as faces são retângulos</li>
                                                                <li>Faces opostas são iguais e paralelas</li>
                                                                <li>Todos os ângulos são retos (90°)</li>
                                                                <li>É um prisma retangular</li>
                                                            </ul>
                                                        </>
                                                    )}
                                                    {solido === 'esfera' && (
                                                        <>
                                                            <h6 className="text-indigo-700 font-medium">Esfera</h6>
                                                            <p className="text-sm text-gray-700">Uma esfera é um sólido geométrico perfeitamente redondo. Todos os pontos da superfície estão à mesma distância do centro.</p>
                                                            <ul className="text-xs space-y-1 list-disc pl-4 text-gray-600">
                                                                <li>A distância do centro a qualquer ponto na superfície é o raio</li>
                                                                <li>A maior distância entre dois pontos (passando pelo centro) é o diâmetro</li>
                                                                <li>É o sólido com a menor razão área/volume</li>
                                                                <li>Área da superfície: A = 4πr²</li>
                                                            </ul>
                                                        </>
                                                    )}
                                                    {solido === 'cilindro' && (
                                                        <>
                                                            <h6 className="text-indigo-700 font-medium">Cilindro</h6>
                                                            <p className="text-sm text-gray-700">Um cilindro é um sólido geométrico formado por duas bases circulares paralelas e uma superfície lateral curva.</p>
                                                            <ul className="text-xs space-y-1 list-disc pl-4 text-gray-600">
                                                                <li>As bases são círculos congruentes</li>
                                                                <li>A superfície lateral é formada por linhas retas paralelas ao eixo</li>
                                                                <li>Um cilindro reto tem as linhas laterais perpendiculares às bases</li>
                                                                <li>Área da superfície lateral: A_l = 2πrh</li>
                                                                <li>Área total: A = 2πr² + 2πrh</li>
                                                            </ul>
                                                        </>
                                                    )}
                                                    {solido === 'cone' && (
                                                        <>
                                                            <h6 className="text-indigo-700 font-medium">Cone</h6>
                                                            <p className="text-sm text-gray-700">Um cone é um sólido geométrico formado por uma base circular e um vértice, conectados por uma superfície lateral curva.</p>
                                                            <ul className="text-xs space-y-1 list-disc pl-4 text-gray-600">
                                                                <li>A base é um círculo</li>
                                                                <li>O vértice (ápice) é o ponto oposto à base</li>
                                                                <li>A altura é a distância perpendicular do vértice à base</li>
                                                                <li>A geratriz é a distância do vértice a um ponto da circunferência da base</li>
                                                                <li>Área da superfície lateral: A_l = πr × g, onde g é a geratriz</li>
                                                            </ul>
                                                        </>
                                                    )}
                                                    {solido === 'piramide' && (
                                                        <>
                                                            <h6 className="text-indigo-700 font-medium">Pirâmide</h6>
                                                            <p className="text-sm text-gray-700">Uma pirâmide é um sólido geométrico com uma base poligonal e faces triangulares que convergem para um vértice.</p>
                                                            <ul className="text-xs space-y-1 list-disc pl-4 text-gray-600">
                                                                <li>A base pode ser qualquer polígono</li>
                                                                <li>As faces laterais são triângulos que compartilham um vértice comum</li>
                                                                <li>Uma pirâmide regular tem uma base regular e o ápice diretamente acima do centro da base</li>
                                                                <li>O nome da pirâmide é derivado da forma da base (ex: pirâmide triangular, quadrangular, etc.)</li>
                                                            </ul>
                                                        </>
                                                    )}
                                                    {solido === 'prisma' && (
                                                        <>
                                                            <h6 className="text-indigo-700 font-medium">Prisma</h6>
                                                            <p className="text-sm text-gray-700">Um prisma é um sólido geométrico com duas bases poligonais congruentes e paralelas, e faces laterais retangulares.</p>
                                                            <ul className="text-xs space-y-1 list-disc pl-4 text-gray-600">
                                                                <li>As bases são polígonos congruentes em planos paralelos</li>
                                                                <li>As faces laterais são retângulos (ou paralelogramos em prismas oblíquos)</li>
                                                                <li>Um prisma reto tem as arestas laterais perpendiculares às bases</li>
                                                                <li>O nome do prisma é derivado da forma da base (ex: prisma triangular, quadrangular, etc.)</li>
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
                                                <p className="text-sm text-gray-700">O cálculo de volumes é essencial em diversos contextos:</p>
                                                <ul className="text-sm space-y-1 list-disc pl-4 text-gray-700">
                                                    <li><span className="font-medium">Arquitetura e Construção:</span> Determinar a quantidade de material necessário</li>
                                                    <li><span className="font-medium">Engenharia:</span> Dimensionamento de reservatórios, tanques e silos</li>
                                                    <li><span className="font-medium">Logística:</span> Cálculo de capacidade de armazenamento e transporte</li>
                                                    <li><span className="font-medium">Ciências Físicas:</span> Determinação de densidade e flutuabilidade</li>
                                                    <li><span className="font-medium">Indústria:</span> Fabricação de embalagens e recipientes</li>
                                                    <li><span className="font-medium">Geografia:</span> Cálculo de volumes de massas de água ou relevo</li>
                                                </ul>
                                            </div>
                                        </div>

                                        <div className="bg-yellow-50 p-3 rounded-md border-l-4 border-yellow-400">
                                            <h5 className="font-medium text-yellow-800 mb-2">Dicas Importantes</h5>
                                            <ul className="text-sm space-y-1 list-disc pl-4 text-gray-700">
                                                <li>Sempre verifique se todas as medidas estão na mesma unidade antes de aplicar as fórmulas</li>
                                                <li>O volume é sempre expresso em unidades cúbicas (ex: m³, cm³, km³)</li>
                                                <li>Para converter entre unidades de volume, lembre-se que 1 m³ = 1.000 litros</li>
                                                <li>Ao resolver problemas, desenhe o sólido e identifique todas as medidas conhecidas</li>
                                                <li>Para sólidos compostos, divida-os em sólidos mais simples e some os volumes</li>
                                                <li>O Princípio de Arquimedes relaciona o volume com o empuxo em fluidos</li>
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
                                            O volume está intrinsecamente relacionado com outros conceitos matemáticos e físicos, como 
                                            área, densidade, massa, capacidade e integrais triplas. Em cálculo avançado, o volume pode 
                                            ser calculado usando integrais múltiplas para formas irregulares ou complexas. Além disso, 
                                            o cálculo de volumes é fundamental para entender conceitos como o centro de massa, momento de 
                                            inércia e fluxo de fluidos na Física e Engenharia.
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

export default ResolvedorVolumeSolidos; 