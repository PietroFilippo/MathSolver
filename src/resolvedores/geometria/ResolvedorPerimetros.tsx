import React from 'react';
import { HiCalculator, HiInformationCircle } from 'react-icons/hi';
import { usePerimetrosSolver, FiguraPlana } from '../../hooks/geometria/usePerimetrosSolver';
import StepByStepExplanation from '../../components/StepByStepExplanation';
import ConceitoMatematico from '../../components/ConceitoMatematico';

const ResolvedorPerimetros: React.FC = () => {
    const {
        state,
        dispatch,
        setFieldValue,
        handleSolve,
        applyExample,
        getFilteredExamples
    } = usePerimetrosSolver();

    const renderFields = () => {
        const inputClassName = "w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200";
        
        switch (state.figura) {
            case 'quadrado':
            case 'losango':
            case 'hexagono':
                return (
                    <div className="mb-4">
                        <label htmlFor="lado" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Lado
                        </label>
                        <input
                            type="number"
                            id="lado"
                            value={state.lado}
                            onChange={(e) => setFieldValue('lado', e.target.value)}
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
                            <label htmlFor="comprimento" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Comprimento
                            </label>
                            <input
                                type="number"
                                id="comprimento"
                                value={state.comprimento}
                                onChange={(e) => setFieldValue('comprimento', e.target.value)}
                                className={inputClassName}
                                placeholder="Digite o comprimento"
                                step="0.1"
                                min="0"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="largura" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Largura
                            </label>
                            <input
                                type="number"
                                id="largura"
                                value={state.largura}
                                onChange={(e) => setFieldValue('largura', e.target.value)}
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
                            <label htmlFor="ladoA" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Lado A
                            </label>
                            <input
                                type="number"
                                id="ladoA"
                                value={state.ladoA}
                                onChange={(e) => setFieldValue('ladoA', e.target.value)}
                                className={inputClassName}
                                placeholder="Digite o lado A"
                                step="0.1"
                                min="0"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="ladoB" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Lado B
                            </label>
                            <input
                                type="number"
                                id="ladoB"
                                value={state.ladoB}
                                onChange={(e) => setFieldValue('ladoB', e.target.value)}
                                className={inputClassName}
                                placeholder="Digite o lado B"
                                step="0.1"
                                min="0"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="ladoC" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Lado C
                            </label>
                            <input
                                type="number"
                                id="ladoC"
                                value={state.ladoC}
                                onChange={(e) => setFieldValue('ladoC', e.target.value)}
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
                        <label htmlFor="raio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Raio
                        </label>
                        <input
                            type="number"
                            id="raio"
                            value={state.raio}
                            onChange={(e) => setFieldValue('raio', e.target.value)}
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
                            <label htmlFor="ladoParalelo1" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Base 1 (Lado Paralelo)
                            </label>
                            <input
                                type="number"
                                id="ladoParalelo1"
                                value={state.ladoParalelo1}
                                onChange={(e) => setFieldValue('ladoParalelo1', e.target.value)}
                                className={inputClassName}
                                placeholder="Digite a primeira base"
                                step="0.1"
                                min="0"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="ladoParalelo2" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Base 2 (Lado Paralelo)
                            </label>
                            <input
                                type="number"
                                id="ladoParalelo2"
                                value={state.ladoParalelo2}
                                onChange={(e) => setFieldValue('ladoParalelo2', e.target.value)}
                                className={inputClassName}
                                placeholder="Digite a segunda base"
                                step="0.1"
                                min="0"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="ladoObliquo1" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Lado Oblíquo 1
                            </label>
                            <input
                                type="number"
                                id="ladoObliquo1"
                                value={state.ladoObliquo1}
                                onChange={(e) => setFieldValue('ladoObliquo1', e.target.value)}
                                className={inputClassName}
                                placeholder="Digite o primeiro lado oblíquo"
                                step="0.1"
                                min="0"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="ladoObliquo2" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Lado Oblíquo 2
                            </label>
                            <input
                                type="number"
                                id="ladoObliquo2"
                                value={state.ladoObliquo2}
                                onChange={(e) => setFieldValue('ladoObliquo2', e.target.value)}
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
                <HiCalculator className="h-6 w-6 text-indigo-600 dark:text-indigo-400 mr-2" />
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Calculadora de Perímetros de Figuras Planas</h2>
            </div>

            <div className="resolver-container p-6 mb-8">
                <p className="text-gray-700 dark:text-gray-300 mb-6">
                    Essa calculadora permite calcular o perímetro de diferentes figuras planas geométricas.
                    Selecione a figura desejada e insira os dados necessários. A calculadora calculará o perímetro da figura.
                </p>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Selecione a figura
                    </label>
                    <select
                        value={state.figura}
                        onChange={(e) => dispatch({ type: 'SET_FIGURA', value: e.target.value as FiguraPlana })}
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
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
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Exemplos
                    </label>
                    <div className="flex flex-wrap gap-2 mb-4">
                        {getFilteredExamples().map((exemplo, index) => (
                            <button
                                key={index}
                                onClick={() => applyExample(exemplo)}
                                className="px-3 py-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm rounded-full transition-colors"
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
                    className="bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 text-white font-medium py-2 px-6 rounded-md transition-colors duration-300"
                >
                    Calcular Perímetro
                </button>

                {state.errorMessage && (
                    <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 rounded-md">
                        {state.errorMessage}
                    </div>
                )}
            </div>

            {state.result !== null && (
                <div className="space-y-6">
                    <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-5">
                        <h3 className="text-lg font-medium text-green-800 dark:text-green-300 mb-2">Resultado</h3>
                        <p className="text-xl text-gray-800 dark:text-gray-200">
                            O perímetro da figura é: <span className="font-bold">{state.result}</span> unidades
                        </p>
                        
                        <button 
                            onClick={() => dispatch({ type: 'TOGGLE_EXPLANATION' })}
                            className="mt-4 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 text-sm font-medium flex items-center"
                        >
                            <HiInformationCircle className="h-5 w-5 mr-1" />
                            {state.showExplanation ? "Ocultar explicação detalhada" : "Mostrar explicação detalhada"}
                        </button>
                    </div>

                    {state.showExplanation && (
                        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-5">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center">
                                    <HiCalculator className="h-6 w-6 mr-2 text-indigo-600 dark:text-indigo-400" />
                                    Solução passo a passo
                                </h3>
                            </div>

                            <StepByStepExplanation steps={state.steps} stepType="geometric" />
                            
                            <ConceitoMatematico
                                title="Conceito Matemático"
                                isOpen={state.showConceitoMatematico}
                                onToggle={() => dispatch({ type: 'TOGGLE_CONCEITO_MATEMATICO' })}
                            >
                                    <div className="flex flex-col md:flex-row gap-4 mb-4">
                                        <div className="flex-1">
                                            <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2 border-b border-gray-200 dark:border-gray-700 pb-1">Perímetro de Figuras Planas</h5>
                                            <div className="space-y-3">
                                                <p className="text-gray-700 dark:text-gray-300">
                                                    O perímetro de uma figura plana é a medida total do contorno da figura, ou seja, 
                                                    a soma dos comprimentos de todos os lados (para polígonos) ou a medida da circunferência (para círculos).
                                                </p>
                                                <div className="bg-white dark:bg-gray-700 p-3 rounded-md border border-gray-100 dark:border-gray-600 shadow-sm">
                                                    <h6 className="text-indigo-700 dark:text-indigo-300 font-medium mb-2">Fórmulas de Perímetro</h6>
                                                    <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                                                    {state.figura === 'quadrado' && (
                                                            <div className="p-2 border-b border-gray-50 dark:border-gray-600">
                                                                <span className="font-medium">Quadrado:</span> P = 4l, onde l é o comprimento do lado
                                                            </div>
                                                        )}
                                                    {state.figura === 'retangulo' && (
                                                            <div className="p-2 border-b border-gray-50 dark:border-gray-600">
                                                                <span className="font-medium">Retângulo:</span> P = 2(c + l), onde c é o comprimento e l é a largura
                                                            </div>
                                                        )}
                                                    {state.figura === 'triangulo' && (
                                                            <div className="p-2 border-b border-gray-50 dark:border-gray-600">
                                                                <span className="font-medium">Triângulo:</span> P = a + b + c, onde a, b e c são os comprimentos dos lados
                                                            </div>
                                                        )}
                                                    {state.figura === 'circulo' && (
                                                            <div className="p-2 border-b border-gray-50 dark:border-gray-600">
                                                                <span className="font-medium">Círculo:</span> P = 2πr, onde r é o raio e π ≈ 3,14159...
                                                            </div>
                                                        )}
                                                    {state.figura === 'trapezio' && (
                                                            <div className="p-2 border-b border-gray-50 dark:border-gray-600">
                                                                <span className="font-medium">Trapézio:</span> P = a + b + c + d, onde a e b são os lados paralelos e c e d são os lados oblíquos
                                                            </div>
                                                        )}
                                                    {state.figura === 'losango' && (
                                                            <div className="p-2 border-b border-gray-50 dark:border-gray-600">
                                                                <span className="font-medium">Losango:</span> P = 4l, onde l é o comprimento do lado
                                                            </div>
                                                        )}
                                                    {state.figura === 'hexagono' && (
                                                            <div className="p-2 border-b border-gray-50 dark:border-gray-600">
                                                                <span className="font-medium">Hexágono Regular:</span> P = 6l, onde l é o comprimento do lado
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="flex-1">
                                            <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2 border-b border-gray-200 dark:border-gray-700 pb-1">Características da Figura</h5>
                                            <div className="bg-white dark:bg-gray-700 p-3 rounded-md border border-gray-100 dark:border-gray-600 shadow-sm space-y-4">
                                                <div className="space-y-2">
                                                {state.figura === 'quadrado' && (
                                                        <>
                                                            <h6 className="text-indigo-700 dark:text-indigo-300 font-medium">Quadrado</h6>
                                                            <p className="text-sm text-gray-700 dark:text-gray-300">Um quadrado é um polígono regular com quatro lados iguais e quatro ângulos retos (90°).</p>
                                                            <ul className="text-xs space-y-1 list-disc pl-4 text-gray-600 dark:text-gray-400">
                                                                <li>Todos os lados têm o mesmo comprimento</li>
                                                                <li>Todos os ângulos internos medem 90°</li>
                                                                <li>As diagonais são iguais e perpendiculares entre si</li>
                                                                <li>É um caso especial de losango, retângulo e paralelogramo</li>
                                                                <li>Área = lado²</li>
                                                            </ul>
                                                        </>
                                                    )}
                                                {state.figura === 'retangulo' && (
                                                        <>
                                                            <h6 className="text-indigo-700 dark:text-indigo-300 font-medium">Retângulo</h6>
                                                            <p className="text-sm text-gray-700 dark:text-gray-300">Um retângulo é um quadrilátero com quatro ângulos retos.</p>
                                                            <ul className="text-xs space-y-1 list-disc pl-4 text-gray-600 dark:text-gray-400">
                                                                <li>Lados opostos são paralelos e iguais</li>
                                                                <li>Todos os ângulos internos medem 90°</li>
                                                                <li>As diagonais são iguais e bissetoras uma da outra</li>
                                                                <li>É um caso especial de paralelogramo</li>
                                                                <li>Área = comprimento × largura</li>
                                                            </ul>
                                                        </>
                                                    )}
                                                {state.figura === 'triangulo' && (
                                                        <>
                                                            <h6 className="text-indigo-700 dark:text-indigo-300 font-medium">Triângulo</h6>
                                                            <p className="text-sm text-gray-700 dark:text-gray-300">Um triângulo é um polígono com três lados e três ângulos.</p>
                                                            <ul className="text-xs space-y-1 list-disc pl-4 text-gray-600 dark:text-gray-400">
                                                                <li>A soma dos ângulos internos é sempre 180°</li>
                                                                <li>Para formar um triângulo válido, a soma de quaisquer dois lados deve ser maior que o terceiro lado</li>
                                                                <li>Pode ser classificado quanto aos lados (equilátero, isósceles, escaleno) ou ângulos (acutângulo, retângulo, obtusângulo)</li>
                                                                <li>Área = (base × altura) ÷ 2</li>
                                                            </ul>
                                                        </>
                                                    )}
                                                {state.figura === 'circulo' && (
                                                        <>
                                                            <h6 className="text-indigo-700 dark:text-indigo-300 font-medium">Círculo</h6>
                                                            <p className="text-sm text-gray-700 dark:text-gray-300">Um círculo é uma figura plana onde todos os pontos estão a uma mesma distância do centro.</p>
                                                            <ul className="text-xs space-y-1 list-disc pl-4 text-gray-600 dark:text-gray-400">
                                                                <li>O raio é a distância do centro a qualquer ponto da circunferência</li>
                                                                <li>O diâmetro é o dobro do raio (d = 2r) e divide o círculo em duas partes iguais</li>
                                                                <li>A circunferência é o contorno do círculo e equivale ao perímetro</li>
                                                                <li>Área = πr²</li>
                                                            </ul>
                                                        </>
                                                    )}
                                                {state.figura === 'trapezio' && (
                                                        <>
                                                            <h6 className="text-indigo-700 dark:text-indigo-300 font-medium">Trapézio</h6>
                                                            <p className="text-sm text-gray-700 dark:text-gray-300">Um trapézio é um quadrilátero com dois lados paralelos (bases).</p>
                                                            <ul className="text-xs space-y-1 list-disc pl-4 text-gray-600 dark:text-gray-400">
                                                                <li>Os lados paralelos são chamados de bases (maior e menor)</li>
                                                                <li>Os outros dois lados são chamados de lados oblíquos ou não paralelos</li>
                                                                <li>Um trapézio isósceles tem os lados oblíquos iguais</li>
                                                                <li>Um trapézio retângulo tem dois ângulos retos</li>
                                                                <li>Área = [(base maior + base menor) × altura] ÷ 2</li>
                                                            </ul>
                                                        </>
                                                    )}
                                                {state.figura === 'losango' && (
                                                        <>
                                                            <h6 className="text-indigo-700 dark:text-indigo-300 font-medium">Losango</h6>
                                                            <p className="text-sm text-gray-700 dark:text-gray-300">Um losango é um quadrilátero com quatro lados iguais.</p>
                                                            <ul className="text-xs space-y-1 list-disc pl-4 text-gray-600 dark:text-gray-400">
                                                                <li>Todos os lados têm o mesmo comprimento</li>
                                                                <li>Lados opostos são paralelos</li>
                                                                <li>Ângulos opostos são iguais</li>
                                                                <li>As diagonais são perpendiculares entre si e bissetoras uma da outra</li>
                                                                <li>Área = (diagonal maior × diagonal menor) ÷ 2</li>
                                                            </ul>
                                                        </>
                                                    )}
                                                {state.figura === 'hexagono' && (
                                                        <>
                                                            <h6 className="text-indigo-700 dark:text-indigo-300 font-medium">Hexágono Regular</h6>
                                                            <p className="text-sm text-gray-700 dark:text-gray-300">Um hexágono regular é um polígono de seis lados iguais e seis ângulos iguais.</p>
                                                            <ul className="text-xs space-y-1 list-disc pl-4 text-gray-600 dark:text-gray-400">
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
                                    
                                    <div className="max-w-3xl mx-auto mt-6 mb-4">
                                        <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-md">
                                            <h6 className="text-indigo-700 dark:text-indigo-300 font-medium mb-2 text-center">Princípios Fundamentais</h6>
                                            <ul className="text-sm space-y-1 list-disc pl-4 text-gray-700 dark:text-gray-300">
                                                <li>O perímetro é uma grandeza unidimensional e deve ser expressa em unidades lineares (m, cm, km, etc.)</li>
                                                <li>Figuras com o mesmo perímetro podem ter áreas diferentes</li>
                                                <li>Figuras semelhantes têm seus perímetros proporcionais à razão de semelhança</li>
                                                <li>Para qualquer polígono regular de n lados, o perímetro é calculado multiplicando o comprimento do lado por n</li>
                                            </ul>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="bg-white dark:bg-gray-700 p-3 rounded-md border border-gray-100 dark:border-gray-600 shadow-sm">
                                            <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Aplicações Práticas</h5>
                                            <div className="space-y-2">
                                                <p className="text-sm text-gray-700 dark:text-gray-300">O cálculo de perímetros é essencial em diversos contextos:</p>
                                                <ul className="text-sm space-y-1 list-disc pl-4 text-gray-700 dark:text-gray-300">
                                                    <li><span className="font-medium">Construção Civil:</span> Cálculo de materiais para cercas, rodapés, molduras, etc.</li>
                                                    <li><span className="font-medium">Agricultura:</span> Cálculo de materiais para cercamento de terrenos e irrigação</li>
                                                    <li><span className="font-medium">Arquitetura:</span> Planejamento de contornos, acabamentos e custos de materiais</li>
                                                    <li><span className="font-medium">Esportes:</span> Definição de distâncias em pistas de corrida e quadras</li>
                                                    <li><span className="font-medium">Geografia:</span> Medição do contorno de fronteiras, costas e ilhas</li>
                                                    <li><span className="font-medium">Física:</span> Cálculos de tensão superficial e resistência de materiais</li>
                                                </ul>
                                            </div>
                                        </div>

                                        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-md border-l-4 border-yellow-400 dark:border-yellow-600">
                                            <h5 className="font-medium text-yellow-800 dark:text-yellow-300 mb-2">Dicas de Resolução</h5>
                                            <ul className="text-sm space-y-1 list-disc pl-4 text-gray-700 dark:text-gray-300">
                                                <li>Sempre verifique se todas as medidas estão na mesma unidade</li>
                                                <li>Para figuras complexas, divida-as em segmentos e some os comprimentos</li>
                                                <li>Lembre-se que o perímetro não depende da forma da figura, apenas do comprimento total do contorno</li>
                                                <li>Para círculos, utilize π = 3,14159 ou a constante π da calculadora para maior precisão</li>
                                                <li>Ao comparar figuras, figuras com maior perímetro não necessariamente têm maior área</li>
                                                <li>Em triângulos, verifique se os lados satisfazem a desigualdade triangular</li>
                                            </ul>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-4 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-md border border-indigo-100 dark:border-indigo-800">
                                        <h5 className="font-medium text-indigo-800 dark:text-indigo-300 mb-1 flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                            </svg>
                                            Relação com Outros Conceitos
                                        </h5>
                                        <p className="text-sm text-indigo-700 dark:text-indigo-300">
                                            O perímetro está relacionado com diversos outros conceitos matemáticos. Em geometria, 
                                            existe o Problema Isoperimétrico, que busca encontrar a figura com maior área possível para 
                                            um perímetro fixo (o círculo é a solução). O conceito de perímetro também é importante em 
                                            cálculo diferencial, onde o comprimento de arco de curvas é determinado usando integrais. 
                                            Na física, o perímetro está relacionado a conceitos como tensão superficial, difusão e capacitância, 
                                            enquanto na biologia, a relação entre perímetro e área é crucial para entender a capacidade de troca 
                                            de nutrientes e calor em organismos.
                                        </p>
                                    </div>
                            </ConceitoMatematico>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ResolvedorPerimetros;