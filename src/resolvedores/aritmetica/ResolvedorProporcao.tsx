import React from 'react';
import { HiCalculator, HiInformationCircle } from 'react-icons/hi';
import { getProportionExamples } from '../../utils/mathUtilsTeoriaNumeros';
import { useProportionSolver } from '../../hooks/aritmetica/useProporcaoSolver';
import StepByStepExplanation from '../../components/StepByStepExplanation';
import ConceitoMatematico from '../../components/ConceitoMatematico';

const ResolvedorProporcao: React.FC = () => {
    const { state, dispatch, handleSolve, applyExample, setSolveFor } = useProportionSolver();

    // Função que filtra exemplos baseado na variável a resolver
    const getFilteredExamples = () => {
        return getProportionExamples().filter(example => example.solveFor === state.solveFor);
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center mb-6">
                <HiCalculator className="h-6 w-6 text-indigo-600 mr-2" />
                <h2 className="text-2xl font-bold">Calculadora de Proporções</h2>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-8">
                <p className="text-gray-700 mb-6">
                    A proporção é uma equação que afirma que duas razões são iguais: a/b = c/d.
                    Essa calculadora ajuda você a resolver a proporção para qualquer valor desconhecido.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center">
                        <input
                        type="number"
                        value={state.solveFor === 'a' ? '' : state.a}
                        onChange={(e) => dispatch({ type: 'SET_VALUE', field: 'a', value: e.target.value })}
                        disabled={state.solveFor === 'a'}
                        className={`w-full p-2 border border-gray-300 rounded-l-md focus:ring-indigo-500 focus:border-indigo-500 ${state.solveFor === 'a' ? 'bg-gray-100' : ''}`}
                        placeholder="a"
                        />
                        <div className="mx-2 text-lg">/</div>
                        <input
                        type="number"
                        value={state.solveFor === 'b' ? '' : state.b}
                        onChange={(e) => dispatch({ type: 'SET_VALUE', field: 'b', value: e.target.value })}
                        disabled={state.solveFor === 'b'}
                        className={`w-full p-2 border border-gray-300 rounded-r-md focus:ring-indigo-500 focus:border-indigo-500 ${state.solveFor === 'b' ? 'bg-gray-100' : ''}`}
                        placeholder="b"
                        />
                    </div>

                    <div className="flex items-center">
                        <input
                        type="number"
                        value={state.solveFor === 'c' ? '' : state.c}
                        onChange={(e) => dispatch({ type: 'SET_VALUE', field: 'c', value: e.target.value })}
                        disabled={state.solveFor === 'c'}
                        className={`w-full p-2 border border-gray-300 rounded-l-md focus:ring-indigo-500 focus:border-indigo-500 ${state.solveFor === 'c' ? 'bg-gray-100' : ''}`}
                        placeholder="c"
                        />
                        <div className="mx-2 text-lg">/</div>
                        <input
                        type="number"
                        value={state.solveFor === 'd' ? '' : state.d}
                        onChange={(e) => dispatch({ type: 'SET_VALUE', field: 'd', value: e.target.value })}
                        disabled={state.solveFor === 'd'}
                        className={`w-full p-2 border border-gray-300 rounded-r-md focus:ring-indigo-500 focus:border-indigo-500 ${state.solveFor === 'd' ? 'bg-gray-100' : ''}`}
                        placeholder="d"
                        />
                    </div>
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Resolver para:
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                        <label className="inline-flex items-center">
                            <input
                            type="radio"
                            checked={state.solveFor === 'a'}
                            onChange={() => setSolveFor('a')}
                            className="form-radio h-4 w-4 text-indigo-600"
                            />
                            <span className="ml-2">a</span>
                        </label>
                        <label className="inline-flex items-center">
                            <input
                            type="radio"
                            checked={state.solveFor === 'b'}
                            onChange={() => setSolveFor('b')}
                            className="form-radio h-4 w-4 text-indigo-600"
                            />
                            <span className="ml-2">b</span>
                        </label>
                        <label className="inline-flex items-center">
                            <input
                            type="radio"
                            checked={state.solveFor === 'c'}
                            onChange={() => setSolveFor('c')}
                            className="form-radio h-4 w-4 text-indigo-600"
                            />  
                            <span className="ml-2">c</span>
                        </label>
                        <label className="inline-flex items-center">
                            <input
                            type="radio"
                            checked={state.solveFor === 'd'}
                            onChange={() => setSolveFor('d')}
                            className="form-radio h-4 w-4 text-indigo-600"
                            />
                            <span className="ml-2">d</span>
                        </label>
                    </div>
                </div>

                {/* Exemplos de proporção */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Exemplos
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {getFilteredExamples().map((example, index) => (
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
                    Calcular
                </button>

                {state.errorMessage && (
                    <div className="mt-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-md">
                        {state.errorMessage}
                    </div>
                )}
            </div>

            {state.result !== null && (
                <div className="space-y-6">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-5">
                        <h3 className="text-lg font-medium text-green-800 mb-2">Resultado</h3>
                        <p className="text-xl">
                            {state.solveFor === 'a' && (
                                <>O valor de <span className="font-bold">A</span> é: <span className="font-bold">{state.result}</span></>
                            )}
                            {state.solveFor === 'b' && (
                                <>O valor de <span className="font-bold">B</span> é: <span className="font-bold">{state.result}</span></>
                            )}
                            {state.solveFor === 'c' && (
                                <>O valor de <span className="font-bold">C</span> é: <span className="font-bold">{state.result}</span></>
                            )}
                            {state.solveFor === 'd' && (
                                <>O valor de <span className="font-bold">D</span> é: <span className="font-bold">{state.result}</span></>
                            )}
                        </p>
                        
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
                                        <h5 className="font-medium text-gray-800 mb-2 border-b border-gray-200 pb-1">Entendendo Proporções</h5>
                                        <p className="text-gray-700 mb-3">
                                            Uma proporção é uma igualdade entre duas razões, expressa na forma a:b = c:d ou a/b = c/d.
                                            Quando duas razões são iguais, dizemos que são proporcionais.
                                        </p>
                                        <div className="bg-white p-3 rounded-md border border-gray-100 shadow-sm mb-3">
                                            <div className="text-center font-medium text-indigo-700">
                                                <p>a / b = c / d</p>
                                                <p className="text-sm mt-1">Propriedade fundamental: a × d = b × c</p>
                                            </div>
                                        </div>
                                        <div className="p-3 bg-indigo-50 rounded-md">
                                            <p className="text-sm text-indigo-700">
                                                <span className="font-medium">Exemplo:</span> Na proporção 2/5 = 4/10, podemos verificar:
                                                <br />
                                                2 × 10 = 5 × 4 → 20 = 20 ✓
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex-1">
                                        <h5 className="font-medium text-gray-800 mb-2 border-b border-gray-200 pb-1">Resolvendo Proporções</h5>
                                        <p className="text-gray-700 mb-3">
                                            Usando a propriedade fundamental das proporções, podemos isolar qualquer variável desconhecida.
                                        </p>
                                        <div className="bg-white p-3 rounded-md border border-gray-100 shadow-sm">
                                            <h6 className="text-indigo-700 font-medium mb-2">Fórmulas para cada variável:</h6>
                                            <ul className="text-sm space-y-2 text-gray-700">
                                                <li><span className="font-medium">Para a:</span> a = (b × c) / d</li>
                                                <li><span className="font-medium">Para b:</span> b = (a × d) / c</li>
                                                <li><span className="font-medium">Para c:</span> c = (a × d) / b</li>
                                                <li><span className="font-medium">Para d:</span> d = (b × c) / a</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="mt-4">
                                    <h5 className="font-medium text-gray-800 mb-2 border-b border-gray-200 pb-1">Aplicações de Proporções</h5>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                        <div className="p-3 bg-white rounded-md border border-gray-100 shadow-sm">
                                            <h6 className="text-indigo-700 font-medium mb-1">Escalas e Mapas</h6>
                                            <p className="text-gray-700 text-xs">
                                                As proporções são usadas para representar distâncias reais em mapas usando uma escala proporcional.
                                            </p>
                                        </div>
                                        <div className="p-3 bg-white rounded-md border border-gray-100 shadow-sm">
                                            <h6 className="text-indigo-700 font-medium mb-1">Receitas Culinárias</h6>
                                            <p className="text-gray-700 text-xs">
                                                Ajustar quantidades de ingredientes mantendo a mesma proporção para obter o mesmo resultado.
                                            </p>
                                        </div>
                                        <div className="p-3 bg-white rounded-md border border-gray-100 shadow-sm">
                                            <h6 className="text-indigo-700 font-medium mb-1">Finanças</h6>
                                            <p className="text-gray-700 text-xs">
                                                Cálculo de juros, taxas e conversões de moedas frequentemente utilizam proporções.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="mt-4 p-3 bg-indigo-50 rounded-md border border-indigo-100">
                                    <h5 className="font-medium text-indigo-800 mb-1 flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                        </svg>
                                        Dica de Resolução
                                    </h5>
                                    <p className="text-sm text-indigo-700">
                                        Para verificar se uma proporção está correta, verifique sempre se o produto cruzado (a × d = b × c) é verdadeiro. Isso funciona para qualquer proporção válida e é uma ótima maneira de verificar seus cálculos.
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

export default ResolvedorProporcao;