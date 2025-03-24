import React from 'react';
import { HiCalculator, HiInformationCircle } from 'react-icons/hi';
import { useSuperficieSolidosSolver, Solido } from '../../hooks/geometria/useSuperficieSolidosSolver';
import StepByStepExplanation from '../../components/StepByStepExplanation';
import ConceitoMatematico from '../../components/ConceitoMatematico';

const ResolvedorSuperficieSolidos: React.FC = () => {
    const {
        state,
        dispatch,
        setFieldValue,
        handleSolve,
        applyExample,
        getFilteredExamples
    } = useSuperficieSolidosSolver();

    const renderFields = () => {
        const inputClassName = "w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200";
        
        switch (state.solido) {
            case 'cubo':
                return (
                    <div className="mb-4">
                        <label htmlFor="aresta" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Aresta
                        </label>
                        <input
                            type="number"
                            id="aresta"
                            value={state.aresta}
                            onChange={(e) => setFieldValue('aresta', e.target.value)}
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
                        <div className="mb-4">
                            <label htmlFor="altura" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Altura
                            </label>
                            <input
                                type="number"
                                id="altura"
                                value={state.altura}
                                onChange={(e) => setFieldValue('altura', e.target.value)}
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
                        <label htmlFor="raio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Raio
                        </label>
                        <input
                            type="number"
                            id="raio"
                            value={state.raio}
                            onChange={(e) => setFieldValue('raio', e.target.value)}
                            className={inputClassName}
                            placeholder="Digite o valor do raio"
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
                            <label htmlFor="raio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Raio
                            </label>
                            <input
                                type="number"
                                id="raio"
                                value={state.raio}
                                onChange={(e) => setFieldValue('raio', e.target.value)}
                                className={inputClassName}
                                placeholder="Digite o valor do raio"
                                step="0.1"
                                min="0"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="altura" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Altura
                            </label>
                            <input
                                type="number"
                                id="altura"
                                value={state.altura}
                                onChange={(e) => setFieldValue('altura', e.target.value)}
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
                            <label htmlFor="ladoBase" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                {state.solido === 'piramide' ? 'Lado da Base Quadrada' : 'Lado da Base Triangular'}
                            </label>
                            <input
                                type="number"
                                id="ladoBase"
                                value={state.ladoBase}
                                onChange={(e) => setFieldValue('ladoBase', e.target.value)}
                                className={inputClassName}
                                placeholder="Digite o lado da base"
                                step="0.1"
                                min="0"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="altura" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Altura
                            </label>
                            <input
                                type="number"
                                id="altura"
                                value={state.altura}
                                onChange={(e) => setFieldValue('altura', e.target.value)}
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
        switch (state.solido) {
            case 'cubo':
                return (
                    <>
                        <p>A área da superfície de um cubo é a soma das áreas de todas as suas 6 faces quadradas.</p>
                        <p>Como todas as faces são quadrados com lados iguais à aresta (a) do cubo, temos:</p>
                        <p>Área da Superfície = 6 × a²</p>
                    </>
                );
            case 'paralelepipedo':
                return (
                    <>
                        <p>A área da superfície de um paralelepípedo é a soma das áreas de suas 6 faces retangulares.</p>
                        <p>Com comprimento (c), largura (l) e altura (h), temos:</p>
                        <p>Área da Superfície = 2(c×l + c×h + l×h)</p>
                    </>
                );
            case 'esfera':
                return (
                    <>
                        <p>A área da superfície de uma esfera é dada pela fórmula:</p>
                        <p>Área da Superfície = 4πr²</p>
                        <p>Onde r é o raio da esfera.</p>
                    </>
                );
            case 'cilindro':
                return (
                    <>
                        <p>A área da superfície de um cilindro é composta pela área lateral (retângulo enrolado) mais as áreas das duas bases circulares.</p>
                        <p>Com raio (r) e altura (h), temos:</p>
                        <p>Área da Superfície = 2πr(r + h)</p>
                    </>
                );
            case 'cone':
                return (
                    <>
                        <p>A área da superfície de um cone é composta pela área lateral (setor circular) mais a área da base circular.</p>
                        <p>Com raio (r), altura (h) e geratriz (g), onde g = √(r² + h²), temos:</p>
                        <p>Área da Superfície = πr(r + g) = πr(r + √(r² + h²))</p>
                    </>
                );
            case 'piramide':
                return (
                    <>
                        <p>Para uma pirâmide quadrada regular, a área da superfície é composta pela área da base quadrada mais as áreas das 4 faces triangulares.</p>
                        <p>Com lado da base (l) e altura (h), temos:</p>
                        <p>Área da Superfície = l² + 4 × ((l × altura_triangular) / 2)</p>
                        <p>Onde altura_triangular = √(h² + (l/2)²)</p>
                    </>
                );
            case 'prisma':
                return (
                    <>
                        <p>Para um prisma triangular regular, a área da superfície é composta pelas áreas das duas bases triangulares mais as áreas das 3 faces retangulares.</p>
                        <p>Com lado da base (l) e altura (h), temos:</p>
                        <p>Área da Superfície = 2 × área_base + perímetro_base × h</p>
                        <p>Para uma base de triângulo equilátero: área_base = (√3/4) × l² e perímetro_base = 3l</p>
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
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Calculadora de Áreas de Superfície de Sólidos Geométricos</h2>
            </div>
            
            <div className="resolver-container p-6 mb-8">
                <p className="text-gray-700 dark:text-gray-300 mb-6">
                    Esta calculadora permite calcular a área da superfície de diferentes sólidos geométricos.
                    Selecione o sólido desejado e insira os dados necessários. A calculadora calculará a área da superfície do sólido.
                </p>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Selecione o Sólido
                    </label>
                    <select
                        value={state.solido}
                        onChange={(e) => dispatch({ type: 'SET_SOLIDO', value: e.target.value as Solido })}
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                    >
                        <option value="cubo">Cubo</option>
                        <option value="paralelepipedo">Paralelepípedo</option>
                        <option value="esfera">Esfera</option>
                        <option value="cilindro">Cilindro</option>
                        <option value="cone">Cone</option>
                        <option value="piramide">Pirâmide (base quadrada)</option>
                        <option value="prisma">Prisma (base triangular)</option>
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
                    Calcular Área da Superfície
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
                            A área da superfície do sólido é: <span className="font-bold">{state.result}</span> unidades quadradas
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
                                        <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2 border-b border-gray-200 dark:border-gray-700 pb-1">Área de Superfície de Sólidos</h5>
                                        <div className="space-y-3">
                                            <p className="text-gray-700 dark:text-gray-300">
                                                A área da superfície de um sólido geométrico é a soma das áreas de todas as suas faces ou superfícies.
                                                É expressa em unidades quadradas, como metros quadrados (m²) ou centímetros quadrados (cm²).
                                            </p>
                                            <div className="bg-white dark:bg-gray-700 p-3 rounded-md border border-gray-100 dark:border-gray-600 shadow-sm">
                                                <h6 className="text-indigo-700 dark:text-indigo-300 font-medium mb-2">Fórmulas de Área de Superfície</h6>
                                                <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                                                    {getConceitoMatematico()}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="max-w-3xl mx-auto mt-6 mb-4">
                                    <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-md">
                                        <h6 className="text-indigo-700 dark:text-indigo-300 font-medium mb-2 text-center">Princípios Fundamentais</h6>
                                        <ul className="text-sm space-y-1 list-disc pl-4 text-gray-700 dark:text-gray-300">
                                            <li>A área da superfície é a soma das áreas de todas as faces do sólido</li>
                                            <li>Para sólidos curvos como esferas, cilindros e cones, as fórmulas foram derivadas usando cálculo integral</li>
                                            <li>Em poliedros regulares, todas as faces têm a mesma forma e tamanho</li>
                                            <li>Para calcular a área da superfície de um sólido composto, divida-o em partes mais simples e some as áreas</li>
                                        </ul>
                                    </div>
                                </div>
                                
                                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-white dark:bg-gray-700 p-3 rounded-md border border-gray-100 dark:border-gray-600 shadow-sm">
                                        <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Aplicações Práticas</h5>
                                        <div className="space-y-2">
                                            <p className="text-sm text-gray-700 dark:text-gray-300">O cálculo da área de superfície é útil em diversos contextos:</p>
                                            <ul className="text-sm space-y-1 list-disc pl-4 text-gray-700 dark:text-gray-300">
                                                <li><span className="font-medium">Construção Civil:</span> Cálculo de materiais para revestimento, pintura, etc.</li>
                                                <li><span className="font-medium">Design de Produto:</span> Determinação da quantidade de material necessária</li>
                                                <li><span className="font-medium">Termodinâmica:</span> Análise de transferência de calor</li>
                                                <li><span className="font-medium">Biologia:</span> Estudo da relação entre superfície e volume em organismos</li>
                                                <li><span className="font-medium">Química:</span> Análise de taxas de reação e catálise</li>
                                                <li><span className="font-medium">Embalagens:</span> Otimização de material e custos</li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-md border-l-4 border-yellow-400 dark:border-yellow-600">
                                        <h5 className="font-medium text-yellow-800 dark:text-yellow-300 mb-2">Dicas de Resolução</h5>
                                        <ul className="text-sm space-y-1 list-disc pl-4 text-gray-700 dark:text-gray-300">
                                            <li>Identifique corretamente o tipo de sólido e suas dimensões relevantes</li>
                                            <li>Verifique se todas as medidas estão na mesma unidade</li>
                                            <li>Para sólidos compostos, divida-os em partes mais simples</li>
                                            <li>Em poliedros, conte corretamente o número de faces e calcule a área de cada tipo</li>
                                            <li>Lembre-se que a área da superfície é sempre expressa em unidades quadradas</li>
                                            <li>Para converter entre unidades de área, lembre-se que 1 m² = 10.000 cm²</li>
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
                                        A área da superfície está intimamente relacionada com o volume dos sólidos. A razão entre 
                                        a área da superfície e o volume é um conceito importante em diversos campos científicos. 
                                        Por exemplo, os seres vivos menores têm uma maior razão superfície/volume, o que afeta 
                                        a troca de calor e nutrientes. Em geometria, o Teorema de Euler relaciona o número de 
                                        vértices, arestas e faces em poliedros. Além disso, o cálculo de áreas de superfícies 
                                        complexas muitas vezes requer o uso de integrais de superfície em matemática avançada.
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

export default ResolvedorSuperficieSolidos; 