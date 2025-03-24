import React from 'react';
import { HiCalculator, HiInformationCircle } from 'react-icons/hi';
import { roundToDecimals } from '../../utils/mathUtils';
import { getExponentiationExamples } from '../../utils/mathUtilsAlgebra';
import { useExponenciacaoSolver } from '../../hooks/algebra/useExponenciacaoSolver';
import StepByStepExplanation from '../../components/StepByStepExplanation';
import ConceitoMatematico from '../../components/ConceitoMatematico';

const ResolvedorExponenciacao: React.FC = () => {
    const { state, dispatch, handleSolve, applyExample, setExpType } = useExponenciacaoSolver();

    // Filtrar exemplos baseados no tipo de operação selecionado
    const getFilteredExamples = () => {
        return getExponentiationExamples().filter(example => example.type === state.expType);
    };

    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <HiCalculator className="h-6 w-6 text-indigo-600 dark:text-indigo-400 mr-2" />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            Calculadora de Potenciação e Radicação
          </h2>
        </div>

        <div className="resolver-container p-6 mb-8">
            <p className="text-gray-700 dark:text-gray-300 mb-6">
                Esta calculadora ajuda a resolver problemas de potenciação (exponenciação) e radicação (raízes).
                A potenciação é a operação de elevar um número (base) a uma potência (expoente),
                enquanto a radicação é a operação inversa, encontrando a raiz de um número.
            </p>

            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tipo de operação:
                </label>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                    <label className="inline-flex items-center">
                        <input
                            type="radio"
                            className="form-radio h-4 w-4 text-indigo-600 dark:text-indigo-400"
                            checked={state.expType === 'exponenciacao'}
                            onChange={() => setExpType('exponenciacao')}
                        />
                        <span className="ml-2 text-gray-700 dark:text-gray-300">Potenciação (b^e)</span>
                    </label>
                    <label className="inline-flex items-center">
                        <input
                            type="radio"
                            className="form-radio h-4 w-4 text-indigo-600 dark:text-indigo-400"
                            checked={state.expType === 'radicacao'}
                            onChange={() => setExpType('radicacao')}
                        />
                        <span className="ml-2 text-gray-700 dark:text-gray-300">Radicação (ⁿ√x)</span>
                    </label>
                </div>
            </div>

            {state.expType === 'exponenciacao' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Base
                        </label>
                        <input
                            type="number"
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400"
                            placeholder="Digite a base"
                            value={state.base}
                            onChange={(e) => dispatch({ type: 'SET_BASE', base: e.target.value })}
                            step="any"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Expoente
                        </label>
                        <input
                            type="number"
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400"
                            placeholder="Digite o expoente"
                            value={state.expoente}
                            onChange={(e) => dispatch({ type: 'SET_EXPOENTE', expoente: e.target.value })}
                            step="any"
                        />
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Radicando
                        </label>
                        <input
                            type="number"
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400"
                            placeholder="Digite o radicando"
                            value={state.radicando}
                            onChange={(e) => dispatch({ type: 'SET_RADICANDO', radicando: e.target.value })}
                            step="any"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Índice da Raiz
                        </label>
                        <input
                            type="number"
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400"
                            placeholder="Digite o índice (padrão: 2 para raiz quadrada)"
                            value={state.indiceRaiz}
                            onChange={(e) => dispatch({ type: 'SET_INDICE_RAIZ', indiceRaiz: e.target.value })}
                            step="any"
                        />
                    </div>
                </div>
            )}

            {/* Exemplos */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Exemplos
                </label>
                <div className="flex flex-wrap gap-2">
                    {getFilteredExamples().map((example, index) => (
                        <button
                            key={index}
                            onClick={() => applyExample(example)}
                            className="px-3 py-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm rounded-full transition-colors"
                        >
                            {example.description}
                        </button>
                    ))}
                </div>
            </div>

            <button
                onClick={handleSolve}
                className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-medium py-2 px-6 rounded-md transition-colors duration-300 mt-4"
            >
                Calcular
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
                        {state.expType === 'exponenciacao' && (
                            <>
                                {state.base}<sup>{state.expoente}</sup> = <span className="font-bold">{roundToDecimals(state.result, 6)}</span>
                            </>
                        )}
                        {state.expType === 'radicacao' && (
                            <>
                                {state.indiceRaiz === '2' ? '√' : 
                                 state.indiceRaiz === '3' ? '∛' : 
                                 <><sup>{state.indiceRaiz}</sup>√</>}
                                {state.radicando} = <span className="font-bold">{roundToDecimals(state.result, 6)}</span>
                                
                                {/* Mostrar a forma simplificada do radical, se existir */}
                                {state.steps.some(step => step.includes('Forma simplificada:')) && (
                                    <div className="mt-2 text-md font-normal text-indigo-700 dark:text-indigo-400">
                                        {state.steps
                                            .find(step => step.includes('Forma simplificada:'))
                                            ?.split('Forma simplificada:')[1]
                                            .trim()}
                                    </div>
                                )}
                            </>
                        )}
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
                    <div className="mt-8 bg-white dark:bg-gray-800 shadow-md rounded-lg p-5">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center">
                                <HiCalculator className="h-6 w-6 mr-2 text-indigo-600 dark:text-indigo-400" />
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
                                    <h5 className="font-medium text-gray-800 dark:text-gray-100 mb-2 border-b border-gray-200 dark:border-gray-700 pb-1">Potenciação</h5>
                                    <p className="text-gray-700 dark:text-gray-300 mb-3">
                                        A potenciação é a operação de multiplicar um número (base) por si mesmo um determinado número de vezes (expoente).
                                    </p>
                                    <div className="bg-white dark:bg-gray-700 p-3 rounded-md text-center border border-gray-100 dark:border-gray-600 shadow-sm mb-3">
                                        <p className="text-lg font-medium text-indigo-700 dark:text-indigo-300">b<sup>e</sup> = b × b × ... × b (e vezes)</p>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="p-2 bg-white dark:bg-gray-700 rounded-md border border-gray-100 dark:border-gray-600 shadow-sm">
                                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                                <span className="font-medium text-indigo-700 dark:text-indigo-300">Expoente positivo:</span> 2<sup>3</sup> = 2 × 2 × 2 = 8
                                            </p>
                                        </div>
                                        <div className="p-2 bg-white dark:bg-gray-700 rounded-md border border-gray-100 dark:border-gray-600 shadow-sm">
                                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                                <span className="font-medium text-indigo-700 dark:text-indigo-300">Expoente zero:</span> b<sup>0</sup> = 1 (qualquer número ≠ 0)
                                            </p>
                                        </div>
                                        <div className="p-2 bg-white dark:bg-gray-700 rounded-md border border-gray-100 dark:border-gray-600 shadow-sm">
                                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                                <span className="font-medium text-indigo-700 dark:text-indigo-300">Expoente negativo:</span> b<sup>-e</sup> = 1/b<sup>e</sup>
                                            </p>
                                        </div>
                                        <div className="p-2 bg-white dark:bg-gray-700 rounded-md border border-gray-100 dark:border-gray-600 shadow-sm">
                                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                                <span className="font-medium text-indigo-700 dark:text-indigo-300">Expoente fracionário:</span> b<sup>1/n</sup> = <sup>n</sup>√b
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h5 className="font-medium text-gray-800 dark:text-gray-100 mb-2 border-b border-gray-200 dark:border-gray-700 pb-1">Radicação</h5>
                                    <p className="text-gray-700 dark:text-gray-300 mb-3">
                                        A radicação é a operação inversa da potenciação, que consiste em encontrar um número que, elevado a um índice, resulta no radicando.
                                    </p>
                                    <div className="bg-white dark:bg-gray-700 p-3 rounded-md text-center border border-gray-100 dark:border-gray-600 shadow-sm mb-3">
                                        <p className="text-lg font-medium text-indigo-700 dark:text-indigo-300"><sup>n</sup>√x = y   ⟺   y<sup>n</sup> = x</p>
                                    </div>
                                    <div className="space-y-2 mb-3">
                                        <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-md flex items-center">
                                            <div className="mr-2 w-20 text-center flex-shrink-0">
                                                <span className="font-mono text-indigo-700 dark:text-indigo-300">√x</span>
                                            </div>
                                            <span className="text-gray-700 dark:text-gray-300">Raiz quadrada (índice 2)</span>
                                        </div>
                                        <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-md flex items-center">
                                            <div className="mr-2 w-20 text-center flex-shrink-0">
                                                <span className="font-mono text-indigo-700 dark:text-indigo-300">∛x</span>
                                            </div>
                                            <span className="text-gray-700 dark:text-gray-300">Raiz cúbica (índice 3)</span>
                                        </div>
                                        <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-md flex items-center">
                                            <div className="mr-2 w-20 text-center flex-shrink-0">
                                                <span className="font-mono text-indigo-700 dark:text-indigo-300"><sup>n</sup>√x</span>
                                            </div>
                                            <span className="text-gray-700 dark:text-gray-300">Raiz de índice n</span>
                                        </div>
                                    </div>
                                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md border-l-2 border-blue-300 dark:border-blue-700">
                                        <p className="text-sm text-blue-800 dark:text-blue-300 font-medium">Relação com expoentes fracionários:</p>
                                        <p className="text-center text-blue-700 dark:text-blue-300 mt-1"><sup>n</sup>√x = x<sup>1/n</sup></p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="mt-4">
                                <h5 className="font-medium text-gray-800 dark:text-gray-100 mb-2 border-b border-gray-200 dark:border-gray-700 pb-1">Propriedades de Potenciação</h5>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div className="p-3 bg-white dark:bg-gray-700 rounded-md border border-gray-100 dark:border-gray-600 shadow-sm">
                                        <h6 className="text-indigo-700 dark:text-indigo-300 font-medium mb-2">Produto com mesma base</h6>
                                        <p className="text-center text-gray-700 dark:text-gray-300 mb-1">b<sup>m</sup> × b<sup>n</sup> = b<sup>m+n</sup></p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Ex: 2<sup>3</sup> × 2<sup>4</sup> = 2<sup>7</sup> = 128</p>
                                    </div>
                                    <div className="p-3 bg-white dark:bg-gray-700 rounded-md border border-gray-100 dark:border-gray-600 shadow-sm">
                                        <h6 className="text-indigo-700 dark:text-indigo-300 font-medium mb-2">Quociente com mesma base</h6>
                                        <p className="text-center text-gray-700 dark:text-gray-300 mb-1">b<sup>m</sup> ÷ b<sup>n</sup> = b<sup>m-n</sup></p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Ex: 2<sup>5</sup> ÷ 2<sup>2</sup> = 2<sup>3</sup> = 8</p>
                                    </div>
                                    <div className="p-3 bg-white dark:bg-gray-700 rounded-md border border-gray-100 dark:border-gray-600 shadow-sm">
                                        <h6 className="text-indigo-700 dark:text-indigo-300 font-medium mb-2">Potência de potência</h6>
                                        <p className="text-center text-gray-700 dark:text-gray-300 mb-1">(b<sup>m</sup>)<sup>n</sup> = b<sup>m×n</sup></p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Ex: (2<sup>3</sup>)<sup>2</sup> = 2<sup>6</sup> = 64</p>
                                    </div>
                                    <div className="p-3 bg-white dark:bg-gray-700 rounded-md border border-gray-100 dark:border-gray-600 shadow-sm">
                                        <h6 className="text-indigo-700 dark:text-indigo-300 font-medium mb-2">Potência com base produto</h6>
                                        <p className="text-center text-gray-700 dark:text-gray-300 mb-1">(a × b)<sup>n</sup> = a<sup>n</sup> × b<sup>n</sup></p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Ex: (2 × 3)<sup>2</sup> = 2<sup>2</sup> × 3<sup>2</sup> = 36</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="mt-4 bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-md border-l-4 border-yellow-400 dark:border-yellow-600">
                                <h5 className="font-medium text-yellow-800 dark:text-yellow-300 mb-1">Dicas Importantes</h5>
                                <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1 list-disc pl-5">
                                    <li>Raízes de índice par só existem nos números reais para radicandos não negativos.</li>
                                    <li>Raízes de índice ímpar existem para qualquer radicando real.</li>
                                    <li>0<sup>0</sup> é uma indeterminação matemática, mas é convencionado como 1 em contextos computacionais.</li>
                                    <li>0 elevado a qualquer expoente negativo não está definido (divisão por zero).</li>
                                </ul>
                            </div>
                        </ConceitoMatematico>
                    </div>
                )}
            </div>
        )}
      </div>
    );
};

export default ResolvedorExponenciacao; 