import React from 'react';
import { HiCalculator, HiInformationCircle } from 'react-icons/hi';
import { useVolumeSolidosSolver, Solido } from '../../hooks/geometria/useVolumeSolidosSolver';
import StepByStepExplanation from '../../components/StepByStepExplanation';
import ConceitoMatematico from '../../components/ConceitoMatematico';

const ResolvedorVolumeSolidos: React.FC = () => {
    const {
        state,
        dispatch,
        setFieldValue,
        handleSolve,
        applyExample,
        getFilteredExamples
    } = useVolumeSolidosSolver();

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
                            <label htmlFor="raioBase" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Raio da Base
                            </label>
                            <input
                                type="number"
                                id="raioBase"
                                value={state.raioBase}
                                onChange={(e) => setFieldValue('raioBase', e.target.value)}
                                className={inputClassName}
                                placeholder="Digite o raio da base"
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
                            <label htmlFor="areaBase" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Área da Base
                            </label>
                            <input
                                type="number"
                                id="areaBase"
                                value={state.areaBase}
                                onChange={(e) => setFieldValue('areaBase', e.target.value)}
                                className={inputClassName}
                                placeholder="Digite a área da base"
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

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center mb-6">
                <HiCalculator className="h-6 w-6 text-indigo-600 dark:text-indigo-400 mr-2" />
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Calculadora de Volumes de Sólidos Geométricos</h2>
            </div>

            <div className="resolver-container p-6 mb-8">
                <p className="text-gray-700 dark:text-gray-300 mb-6">
                  Essa calculadora permite calcular o volume de diferentes sólidos geométricos.
                  Selecione o sólido desejado e insira os dados necessários. A calculadora calculará o volume do sólido.
                </p>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Selecione o sólido
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
                        <option value="piramide">Pirâmide</option>
                        <option value="prisma">Prisma</option>
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
                    Calcular Volume
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
                            O volume do sólido é: <span className="font-bold">{state.result}</span> unidades cúbicas
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
                                            <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2 border-b border-gray-200 dark:border-gray-700 pb-1">Volume de Sólidos Geométricos</h5>
                                            <div className="space-y-3">
                                                <p className="text-gray-700 dark:text-gray-300">
                                                    O volume de um sólido geométrico é a medida do espaço ocupado pelo sólido no espaço tridimensional. 
                                                    É expresso em unidades cúbicas, como centímetros cúbicos (cm³) ou metros cúbicos (m³).
                                                </p>
                                                <div className="bg-white dark:bg-gray-700 p-3 rounded-md border border-gray-100 dark:border-gray-600 shadow-sm">
                                                    <h6 className="text-indigo-700 dark:text-indigo-300 font-medium mb-2">Fórmulas de Volume</h6>
                                                    <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                                                    {state.solido === 'cubo' && (
                                                            <div className="p-2 border-b border-gray-50 dark:border-gray-600">
                                                                <span className="font-medium">Cubo:</span> V = a³, onde a é o comprimento da aresta
                                                            </div>
                                                        )}
                                                    {state.solido === 'paralelepipedo' && (
                                                            <div className="p-2 border-b border-gray-50 dark:border-gray-600">
                                                                <span className="font-medium">Paralelepípedo:</span> V = c × l × h, onde c é o comprimento, l é a largura e h é a altura
                                                            </div>
                                                        )}
                                                    {state.solido === 'esfera' && (
                                                            <div className="p-2 border-b border-gray-50 dark:border-gray-600">
                                                                <span className="font-medium">Esfera:</span> V = (4/3)πr³, onde r é o raio
                                                            </div>
                                                        )}
                                                    {state.solido === 'cilindro' && (
                                                            <div className="p-2 border-b border-gray-50 dark:border-gray-600">
                                                                <span className="font-medium">Cilindro:</span> V = πr²h, onde r é o raio da base e h é a altura
                                                            </div>
                                                        )}
                                                    {state.solido === 'cone' && (
                                                            <div className="p-2 border-b border-gray-50 dark:border-gray-600">
                                                                <span className="font-medium">Cone:</span> V = (1/3)πr²h, onde r é o raio da base e h é a altura
                                                            </div>
                                                        )}
                                                    {state.solido === 'piramide' && (
                                                            <div className="p-2 border-b border-gray-50 dark:border-gray-600">
                                                                <span className="font-medium">Pirâmide:</span> V = (1/3)A_b × h, onde A_b é a área da base e h é a altura
                                                            </div>
                                                        )}
                                                    {state.solido === 'prisma' && (
                                                            <div className="p-2">
                                                                <span className="font-medium">Prisma:</span> V = A_b × h, onde A_b é a área da base e h é a altura
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="flex-1">
                                            <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2 border-b border-gray-200 dark:border-gray-700 pb-1">Características dos Sólidos</h5>
                                            <div className="bg-white dark:bg-gray-700 p-3 rounded-md border border-gray-100 dark:border-gray-600 shadow-sm space-y-4">
                                                <div className="space-y-2">
                                                {state.solido === 'cubo' && (
                                                        <>
                                                            <h6 className="text-indigo-700 dark:text-indigo-300 font-medium">Cubo</h6>
                                                            <p className="text-sm text-gray-700 dark:text-gray-300">Um cubo é um sólido geométrico com seis faces quadradas iguais. Possui 8 vértices e 12 arestas.</p>
                                                            <ul className="text-xs space-y-1 list-disc pl-4 text-gray-600 dark:text-gray-400">
                                                                <li>Todas as faces são quadrados congruentes</li>
                                                                <li>Todas as arestas têm o mesmo comprimento</li>
                                                                <li>Todos os ângulos são retos (90°)</li>
                                                                <li>É um caso especial de paralelepípedo</li>
                                                            </ul>
                                                        </>
                                                    )}
                                                {state.solido === 'paralelepipedo' && (
                                                        <>
                                                            <h6 className="text-indigo-700 dark:text-indigo-300 font-medium">Paralelepípedo</h6>
                                                            <p className="text-sm text-gray-700 dark:text-gray-300">Um paralelepípedo é um prisma com seis faces retangulares paralelas duas a duas. Possui 8 vértices e 12 arestas.</p>
                                                            <ul className="text-xs space-y-1 list-disc pl-4 text-gray-600 dark:text-gray-400">
                                                                <li>Todas as faces são retângulos</li>
                                                                <li>Faces opostas são iguais e paralelas</li>
                                                                <li>Todos os ângulos são retos (90°)</li>
                                                                <li>É um prisma retangular</li>
                                                            </ul>
                                                        </>
                                                    )}
                                                {state.solido === 'esfera' && (
                                                        <>
                                                            <h6 className="text-indigo-700 dark:text-indigo-300 font-medium">Esfera</h6>
                                                            <p className="text-sm text-gray-700 dark:text-gray-300">Uma esfera é um sólido geométrico perfeitamente redondo. Todos os pontos da superfície estão à mesma distância do centro.</p>
                                                            <ul className="text-xs space-y-1 list-disc pl-4 text-gray-600 dark:text-gray-400">
                                                                <li>A distância do centro a qualquer ponto na superfície é o raio</li>
                                                                <li>A maior distância entre dois pontos (passando pelo centro) é o diâmetro</li>
                                                                <li>É o sólido com a menor razão área/volume</li>
                                                                <li>Área da superfície: A = 4πr²</li>
                                                            </ul>
                                                        </>
                                                    )}
                                                {state.solido === 'cilindro' && (
                                                        <>
                                                            <h6 className="text-indigo-700 dark:text-indigo-300 font-medium">Cilindro</h6>
                                                            <p className="text-sm text-gray-700 dark:text-gray-300">Um cilindro é um sólido geométrico formado por duas bases circulares paralelas e uma superfície lateral curva.</p>
                                                            <ul className="text-xs space-y-1 list-disc pl-4 text-gray-600 dark:text-gray-400">
                                                                <li>As bases são círculos congruentes</li>
                                                                <li>A superfície lateral é formada por linhas retas paralelas ao eixo</li>
                                                                <li>Um cilindro reto tem as linhas laterais perpendiculares às bases</li>
                                                                <li>Área da superfície lateral: A_l = 2πrh</li>
                                                                <li>Área total: A = 2πr² + 2πrh</li>
                                                            </ul>
                                                        </>
                                                    )}
                                                {state.solido === 'cone' && (
                                                        <>
                                                            <h6 className="text-indigo-700 dark:text-indigo-300 font-medium">Cone</h6>
                                                            <p className="text-sm text-gray-700 dark:text-gray-300">Um cone é um sólido geométrico formado por uma base circular e um vértice, conectados por uma superfície lateral curva.</p>
                                                            <ul className="text-xs space-y-1 list-disc pl-4 text-gray-600 dark:text-gray-400">
                                                                <li>A base é um círculo</li>
                                                                <li>O vértice (ápice) é o ponto oposto à base</li>
                                                                <li>A altura é a distância perpendicular do vértice à base</li>
                                                                <li>A geratriz é a distância do vértice a um ponto da circunferência da base</li>
                                                                <li>Área da superfície lateral: A_l = πr × g, onde g é a geratriz</li>
                                                            </ul>
                                                        </>
                                                    )}
                                                {state.solido === 'piramide' && (
                                                        <>
                                                            <h6 className="text-indigo-700 dark:text-indigo-300 font-medium">Pirâmide</h6>
                                                            <p className="text-sm text-gray-700 dark:text-gray-300">Uma pirâmide é um sólido geométrico com uma base poligonal e faces triangulares que convergem para um vértice.</p>
                                                            <ul className="text-xs space-y-1 list-disc pl-4 text-gray-600 dark:text-gray-400">
                                                                <li>A base pode ser qualquer polígono</li>
                                                                <li>As faces laterais são triângulos que compartilham um vértice comum</li>
                                                                <li>Uma pirâmide regular tem uma base regular e o ápice diretamente acima do centro da base</li>
                                                                <li>O nome da pirâmide é derivado da forma da base (ex: pirâmide triangular, quadrangular, etc.)</li>
                                                            </ul>
                                                        </>
                                                    )}
                                                {state.solido === 'prisma' && (
                                                        <>
                                                            <h6 className="text-indigo-700 dark:text-indigo-300 font-medium">Prisma</h6>
                                                            <p className="text-sm text-gray-700 dark:text-gray-300">Um prisma é um sólido geométrico com duas bases poligonais congruentes e paralelas, e faces laterais retangulares.</p>
                                                            <ul className="text-xs space-y-1 list-disc pl-4 text-gray-600 dark:text-gray-400">
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
                                    
                                    <div className="max-w-3xl mx-auto mt-6 mb-4">
                                        <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-md">
                                            <h6 className="text-indigo-700 dark:text-indigo-300 font-medium mb-2 text-center">Princípios Fundamentais</h6>
                                            <ul className="text-sm space-y-1 list-disc pl-4 text-gray-700 dark:text-gray-300">
                                                <li>Um sólido regular tem todas as faces iguais e os mesmos ângulos em cada vértice</li>
                                                <li>O volume de qualquer prisma ou cilindro é o produto da área da base pela altura</li>
                                                <li>O volume de qualquer pirâmide ou cone é um terço do produto da área da base pela altura</li>
                                                <li>O Princípio de Cavalieri: sólidos com a mesma altura e mesma área de seção transversal em cada altura têm o mesmo volume</li>
                                            </ul>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="bg-white dark:bg-gray-700 p-3 rounded-md border border-gray-100 dark:border-gray-600 shadow-sm">
                                            <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Aplicações Práticas</h5>
                                            <div className="space-y-2">
                                                <p className="text-sm text-gray-700 dark:text-gray-300">O cálculo de volumes é essencial em diversos contextos:</p>
                                                <ul className="text-sm space-y-1 list-disc pl-4 text-gray-700 dark:text-gray-300">
                                                    <li><span className="font-medium">Arquitetura e Construção:</span> Determinar a quantidade de material necessário</li>
                                                    <li><span className="font-medium">Engenharia:</span> Dimensionamento de reservatórios, tanques e silos</li>
                                                    <li><span className="font-medium">Logística:</span> Cálculo de capacidade de armazenamento e transporte</li>
                                                    <li><span className="font-medium">Ciências Físicas:</span> Determinação de densidade e flutuabilidade</li>
                                                    <li><span className="font-medium">Indústria:</span> Fabricação de embalagens e recipientes</li>
                                                    <li><span className="font-medium">Geografia:</span> Cálculo de volumes de massas de água ou relevo</li>
                                                </ul>
                                            </div>
                                        </div>

                                        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-md border-l-4 border-yellow-400 dark:border-yellow-600">
                                            <h5 className="font-medium text-yellow-800 dark:text-yellow-300 mb-2">Dicas Importantes</h5>
                                            <ul className="text-sm space-y-1 list-disc pl-4 text-gray-700 dark:text-gray-300">
                                                <li>Sempre verifique se todas as medidas estão na mesma unidade antes de aplicar as fórmulas</li>
                                                <li>O volume é sempre expresso em unidades cúbicas (ex: m³, cm³, km³)</li>
                                                <li>Para converter entre unidades de volume, lembre-se que 1 m³ = 1.000 litros</li>
                                                <li>Ao resolver problemas, desenhe o sólido e identifique todas as medidas conhecidas</li>
                                                <li>Para sólidos compostos, divida-os em sólidos mais simples e some os volumes</li>
                                                <li>O Princípio de Arquimedes relaciona o volume com o empuxo em fluidos</li>
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
                                            O volume está intrinsecamente relacionado com outros conceitos matemáticos e físicos, como 
                                            área, densidade, massa, capacidade e integrais triplas. Em cálculo avançado, o volume pode 
                                            ser calculado usando integrais múltiplas para formas irregulares ou complexas. Além disso, 
                                            o cálculo de volumes é fundamental para entender conceitos como o centro de massa, momento de 
                                            inércia e fluxo de fluidos na Física e Engenharia.
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

export default ResolvedorVolumeSolidos; 