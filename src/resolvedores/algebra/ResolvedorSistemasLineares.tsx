import React from 'react';
import { HiCalculator, HiInformationCircle } from 'react-icons/hi';
import { roundToDecimals } from '../../utils/mathUtils';
import { getLinearSystemExamples } from '../../utils/mathUtilsAlgebra';
import { useLinearSystemSolver } from '../../hooks/algebra/useSistemasLinearesSolver';
import StepByStepExplanation from '../../components/StepByStepExplanation';
import ConceitoMatematico from '../../components/ConceitoMatematico';

const ResolvedorSistemasLineares: React.FC = () => {
    const { state, dispatch, handleSolve, applyExample } = useLinearSystemSolver();

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center mb-6">
                <HiCalculator className="h-6 w-6 text-indigo-600 mr-2" />
                <h2 className="text-2xl font-bold">Sistemas de Equações Lineares</h2>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-8">
                <p className="text-gray-700 mb-6">
                    Esta calculadora resolve sistemas de equações lineares com duas equações e duas incógnitas.
                    Insira os coeficientes para resolver o sistema: 
                </p>
                
                <div className="space-y-6 mb-8">
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-800">Primeira Equação: a₁x + b₁y = c₁</h3>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    a₁ (coef. de x)
                                </label>
                                <input
                                    type="number"
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                    value={state.a1}
                                    onChange={(e) => dispatch({ type: 'SET_COEFFICIENT', field: 'a1', value: e.target.value })}
                                    placeholder="Digite o valor"
                                    step="any"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    b₁ (coef. de y)
                                </label>
                                <input
                                    type="number"
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                    value={state.b1}
                                    onChange={(e) => dispatch({ type: 'SET_COEFFICIENT', field: 'b1', value: e.target.value })}
                                    placeholder="Digite o valor"
                                    step="any"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    c₁ (resultado)
                                </label>
                                <input
                                    type="number"
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                    value={state.c1}
                                    onChange={(e) => dispatch({ type: 'SET_COEFFICIENT', field: 'c1', value: e.target.value })}
                                    placeholder="Digite o valor"
                                    step="any"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-800">Segunda Equação: a₂x + b₂y = c₂</h3>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    a₂ (coef. de x)
                                </label>
                                <input
                                    type="number"
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                    value={state.a2}
                                    onChange={(e) => dispatch({ type: 'SET_COEFFICIENT', field: 'a2', value: e.target.value })}
                                    placeholder="Digite o valor"
                                    step="any"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    b₂ (coef. de y)
                                </label>
                                <input
                                    type="number"
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                    value={state.b2}
                                    onChange={(e) => dispatch({ type: 'SET_COEFFICIENT', field: 'b2', value: e.target.value })}
                                    placeholder="Digite o valor"
                                    step="any"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    c₂ (resultado)
                                </label>
                                <input
                                    type="number"
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                    value={state.c2}
                                    onChange={(e) => dispatch({ type: 'SET_COEFFICIENT', field: 'c2', value: e.target.value })}
                                    placeholder="Digite o valor"
                                    step="any"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Exemplos de sistemas lineares */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Exemplos de Sistemas
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
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-md transition-colors duration-300"
                >
                    Resolver Sistema
                </button>

                {state.errorMessage && (
                    <div className="mt-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-md">
                        {state.errorMessage}
                    </div>
                )}
            </div>

            {state.systemType && (
                <div className="space-y-6">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-5">
                        <h3 className="text-lg font-medium text-green-800 mb-2">Resultado</h3>
                        
                        {state.systemType === 'unique' && state.solution && (
                            <div>
                                <p className="text-xl mb-2">
                                    Para o sistema:
                                </p>
                                <p className="text-xl">
                                    {state.a1}x + {state.b1}y = {state.c1}
                                </p>
                                <p className="text-xl mb-4">
                                    {state.a2}x + {state.b2}y = {state.c2}
                                </p>
                                
                                <p className="text-xl font-bold">
                                    x = {roundToDecimals(state.solution.x, 4)}
                                </p>
                                <p className="text-xl font-bold">
                                    y = {roundToDecimals(state.solution.y, 4)}
                                </p>
                            </div>
                        )}
                        
                        {state.systemType === 'infinite' && (
                            <div>
                                <p className="text-xl mb-2">
                                    Para o sistema:
                                </p>
                                <p className="text-xl">
                                    {state.a1}x + {state.b1}y = {state.c1}
                                </p>
                                <p className="text-xl mb-4">
                                    {state.a2}x + {state.b2}y = {state.c2}
                                </p>
                                
                                <div className="bg-indigo-50 p-3 rounded-md border-l-4 border-indigo-300">
                                    <p className="text-lg font-medium text-indigo-800">
                                        O sistema possui infinitas soluções.
                                    </p>
                                    <p className="text-indigo-700 mt-1">
                                        As equações são linearmente dependentes.
                                    </p>
                                </div>
                            </div>
                        )}
                        
                        {state.systemType === 'noSolution' && (
                            <div>
                                <p className="text-xl mb-2">
                                    Para o sistema:
                                </p>
                                <p className="text-xl">
                                    {state.a1}x + {state.b1}y = {state.c1}
                                </p>
                                <p className="text-xl mb-4">
                                    {state.a2}x + {state.b2}y = {state.c2}
                                </p>
                                
                                <div className="bg-yellow-50 p-3 rounded-md border-l-4 border-yellow-300">
                                    <p className="text-lg font-medium text-yellow-800">
                                        O sistema não possui solução.
                                    </p>
                                    <p className="text-yellow-700 mt-1">
                                        As equações são incompatíveis.
                                    </p>
                                </div>
                            </div>
                        )}
                        
                        <button 
                            onClick={() => dispatch({ type: 'TOGGLE_EXPLANATION' })}
                            className="mt-4 text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center"
                        >
                            <HiInformationCircle className="h-5 w-5 mr-1" />
                            {state.showExplanation ? "Ocultar explicação detalhada" : "Mostrar explicação detalhada"}
                        </button>
                    </div>

                    {state.showExplanation && (
                        <div className="mt-8 bg-white shadow-md rounded-lg p-5">
                            <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-gray-800 flex items-center">
                                    <HiCalculator className="h-6 w-6 mr-2 text-indigo-600" />
                                    Solução passo a passo
                                </h3>
                            </div>
                            
                            <StepByStepExplanation steps={state.steps} stepType="linear" />
                            
                            <ConceitoMatematico
                                title="Conceito Matemático"
                                isOpen={state.showConceitoMatematico}
                                onToggle={() => dispatch({ type: 'TOGGLE_CONCEITO_MATEMATICO' })}
                            >
                                    <div className="flex flex-col md:flex-row gap-4 mb-4">
                                        <div className="flex-1">
                                            <h5 className="font-medium text-gray-800 mb-2 border-b border-gray-200 pb-1">Definição</h5>
                                        <p className="text-gray-700 mb-2">
                                            Um sistema de equações lineares consiste em um conjunto de equações lineares 
                                            com as mesmas variáveis. No caso de um sistema 2x2, temos duas equações com 
                                            duas incógnitas (geralmente x e y).
                                            </p>
                                        <div className="bg-white p-3 rounded-md text-center border border-gray-100 shadow-sm mb-3">
                                            <p className="text-md text-indigo-700">a₁x + b₁y = c₁</p>
                                            <p className="text-md text-indigo-700">a₂x + b₂y = c₂</p>
                                        </div>
                                        
                                        <h5 className="font-medium text-gray-800 mb-2 mt-4 border-b border-gray-200 pb-1">A Regra de Cramer</h5>
                                        <p className="text-gray-700 mb-2">
                                            A Regra de Cramer é um método que usa determinantes para resolver sistemas de equações lineares.
                                        </p>
                                        <div className="space-y-2 mb-3">
                                            <div className="p-2 bg-white rounded-md border border-gray-100">
                                                <p className="text-center">Det = a₁×b₂ - a₂×b₁</p>
                                                </div>
                                            <div className="p-2 bg-white rounded-md border border-gray-100">
                                                <p className="text-center">x = (c₁×b₂ - c₂×b₁) / Det</p>
                                            </div>
                                            <div className="p-2 bg-white rounded-md border border-gray-100">
                                                <p className="text-center">y = (a₁×c₂ - a₂×c₁) / Det</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                        <div className="flex-1">
                                            <h5 className="font-medium text-gray-800 mb-2 border-b border-gray-200 pb-1">Possíveis Resultados</h5>
                                        <div className="space-y-2 mb-3">
                                            <div className="p-2 bg-green-50 rounded border border-green-100 flex items-center">
                                                <div className="h-6 w-6 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-xs mr-2 flex-shrink-0">1</div>
                                                    <div>
                                                    <p className="font-medium text-sm">Solução Única</p>
                                                    <p className="text-xs text-gray-600">Quando Det ≠ 0, o sistema tem uma única solução (x, y)</p>
                                                </div>
                                            </div>
                                            
                                            <div className="p-2 bg-indigo-50 rounded border border-indigo-100 flex items-center">
                                                <div className="h-6 w-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs mr-2 flex-shrink-0">∞</div>
                                                    <div>
                                                    <p className="font-medium text-sm">Infinitas Soluções</p>
                                                    <p className="text-xs text-gray-600">Quando Det = 0 e as equações são linearmente dependentes</p>
                                                </div>
                                            </div>
                                            
                                            <div className="p-2 bg-yellow-50 rounded border border-yellow-100 flex items-center">
                                                <div className="h-6 w-6 rounded-full bg-yellow-100 text-yellow-700 flex items-center justify-center text-xs mr-2 flex-shrink-0">0</div>
                                                    <div>
                                                    <p className="font-medium text-sm">Sem Solução</p>
                                                    <p className="text-xs text-gray-600">Quando Det = 0 e as equações são incompatíveis</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                        <h5 className="font-medium text-gray-800 mb-2 mt-4 border-b border-gray-200 pb-1">Representação Geométrica</h5>
                                        <p className="text-gray-700 mb-2">
                                            Em um sistema 2x2, cada equação representa uma reta no plano cartesiano:
                                        </p>
                                        <div className="space-y-2">
                                            <div className="p-2 bg-white rounded-md border border-gray-100 flex items-center">
                                                <div className="h-5 w-5 bg-green-100 rounded-full mr-2 flex-shrink-0"></div>
                                                <p className="text-sm">Solução única: As retas se intersectam em um ponto</p>
                                                </div>
                                            <div className="p-2 bg-white rounded-md border border-gray-100 flex items-center">
                                                <div className="h-5 w-5 bg-indigo-100 rounded-full mr-2 flex-shrink-0"></div>
                                                <p className="text-sm">Infinitas soluções: As retas são coincidentes</p>
                                            </div>
                                            <div className="p-2 bg-white rounded-md border border-gray-100 flex items-center">
                                                <div className="h-5 w-5 bg-yellow-100 rounded-full mr-2 flex-shrink-0"></div>
                                                <p className="text-sm">Sem solução: As retas são paralelas</p>
                                            </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                <div className="mt-4 bg-blue-50 p-3 rounded-md border-l-4 border-blue-300">
                                    <h5 className="font-medium text-blue-800 mb-1">Aplicações Práticas</h5>
                                    <p className="text-gray-700 text-sm">
                                        Os sistemas de equações lineares são amplamente utilizados para resolver problemas de:
                                        </p>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
                                        <div className="text-sm text-gray-700">
                                            <p className="font-medium">Economia</p>
                                            <ul className="list-disc pl-4 text-xs space-y-1">
                                                <li>Modelos de oferta e demanda</li>
                                                <li>Análise de investimentos</li>
                                            </ul>
                                        </div>
                                        <div className="text-sm text-gray-700">
                                            <p className="font-medium">Física</p>
                                            <ul className="list-disc pl-4 text-xs space-y-1">
                                                <li>Circuitos elétricos</li>
                                                <li>Equilíbrio de forças</li>
                                            </ul>
                                        </div>
                                        <div className="text-sm text-gray-700">
                                            <p className="font-medium">Computação</p>
                                            <ul className="list-disc pl-4 text-xs space-y-1">
                                                <li>Gráficos e animações</li>
                                                <li>Processamento de imagens</li>
                                        </ul>
                                        </div>
                                    </div>
                                </div>
                            </ConceitoMatematico>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ResolvedorSistemasLineares;