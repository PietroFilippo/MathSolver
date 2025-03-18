import React from 'react';
import { HiCalculator, HiInformationCircle } from 'react-icons/hi';
import { roundToDecimals } from '../../utils/mathUtils';
import { getLogarithmExamples } from '../../utils/mathUtilsAlgebra';
import { useLogarithmSolver } from '../../hooks/algebra/useLogaritimosSolver';
import StepByStepExplanation from '../../components/StepByStepExplanation';
import ConceitoMatematico from '../../components/ConceitoMatematico';

const ResolvedorLogaritmo: React.FC = () => {
    const { state, dispatch, handleSolve, applyExample, setLogType } = useLogarithmSolver();

    // Filtrar exemplos baseados no tipo de logaritmo selecionado
    const getFilteredExamples = () => {
        return getLogarithmExamples().filter(example => example.type === state.logType);
    };

    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <HiCalculator className="h-6 w-6 text-indigo-600 dark:text-indigo-400 mr-2" />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Calculadora de Logaritmos</h2>
        </div>

        <div className="resolver-container p-6 mb-8">
            <p className="text-gray-700 dark:text-gray-300 mb-6">
                Essa calculadora ajuda a resolver problemas de logaritmos de diferentes bases.
                O logaritmo de um número é o expoente ao qual uma base deve ser elevada para produzir esse número.
            </p>

            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tipo de logaritmo:
                </label>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                    <label className="inline-flex items-center">
                        <input
                            type="radio"
                            className="form-radio h-4 w-4 text-indigo-600 dark:text-indigo-400"
                            checked={state.logType === 'natural'}
                            onChange={() => setLogType('natural')}
                        />
                        <span className="ml-2 text-gray-700 dark:text-gray-300">Logaritmo natural (ln, base e)</span>
                    </label>
                    <label className="inline-flex items-center">
                        <input
                            type="radio"
                            className="form-radio h-4 w-4 text-indigo-600 dark:text-indigo-400"
                            checked={state.logType === 'base10'}
                            onChange={() => setLogType('base10')}
                        />
                        <span className="ml-2 text-gray-700 dark:text-gray-300">Logaritmo comum (log₁₀, base 10)</span>
                    </label>
                    <label className="inline-flex items-center">
                        <input
                            type="radio"
                            className="form-radio h-4 w-4 text-indigo-600 dark:text-indigo-400"
                            checked={state.logType === 'custom'}
                            onChange={() => setLogType('custom')}
                        />
                        <span className="ml-2 text-gray-700 dark:text-gray-300">Logaritmo personalizado</span>
                    </label>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Valor
                    </label>
                    <input
                        type="number"
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400"
                        placeholder="Digite um valor positivo"
                        value={state.value}
                        onChange={(e) => dispatch({ type: 'SET_VALUE', value: e.target.value })}
                        step="any"
                    />
                </div>

                {state.logType === 'custom' && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Base
                        </label>
                        <input
                            type="number"
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400"
                            placeholder="Digite uma base positiva e diferente de 1"
                            value={state.customBase}
                            onChange={(e) => dispatch({ type: 'SET_CUSTOM_BASE', base: e.target.value })}
                            step="any"
                        />
                    </div>
                )}
            </div>

            {/* Exemplos de logaritmos */}
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
                        {state.logType === 'natural' && `ln(${state.value}) = `}
                        {state.logType === 'base10' && `log₁₀(${state.value}) = `}
                        {state.logType === 'custom' && `log₍${state.customBase}₎(${state.value}) = `}
                        <span className="font-bold">{roundToDecimals(state.result, 6)}</span>
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
                                    <h5 className="font-medium text-gray-800 dark:text-gray-100 mb-2 border-b border-gray-200 dark:border-gray-700 pb-1">Definição e Propriedades</h5>
                                    <p className="text-gray-700 dark:text-gray-300 mb-3">
                                        O logaritmo de um número <span className="font-medium">N</span> na base <span className="font-medium">b</span> é 
                                        o expoente <span className="font-medium">x</span> ao qual devemos elevar <span className="font-medium">b</span> para 
                                        obter <span className="font-medium">N</span>.
                                    </p>
                                    <div className="bg-white dark:bg-gray-700 p-3 rounded-md text-center border border-gray-100 dark:border-gray-600 shadow-sm mb-3">
                                        <p className="text-lg font-medium text-indigo-700 dark:text-indigo-300">log<sub>b</sub>(N) = x ⟺ b<sup>x</sup> = N</p>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="p-2 bg-white dark:bg-gray-700 rounded-md border border-gray-100 dark:border-gray-600 shadow-sm">
                                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                                <span className="font-medium text-indigo-700 dark:text-indigo-300">Logaritmo Natural (ln):</span> Usa a base <span className="italic">e</span> ≈ 2,71828
                                            </p>
                                        </div>
                                        <div className="p-2 bg-white dark:bg-gray-700 rounded-md border border-gray-100 dark:border-gray-600 shadow-sm">
                                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                                <span className="font-medium text-indigo-700 dark:text-indigo-300">Logaritmo Decimal (log₁₀):</span> Usa a base 10
                                            </p>
                                        </div>
                                        <div className="p-2 bg-white dark:bg-gray-700 rounded-md border border-gray-100 dark:border-gray-600 shadow-sm">
                                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                                <span className="font-medium text-indigo-700 dark:text-indigo-300">Logaritmo Binário (log₂):</span> Usa a base 2 (comum em computação)
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h5 className="font-medium text-gray-800 dark:text-gray-100 mb-2 border-b border-gray-200 dark:border-gray-700 pb-1">Propriedades dos Logaritmos</h5>
                                    <div className="space-y-2 mb-3">
                                        <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-md flex items-center">
                                            <div className="mr-2 w-20 text-center flex-shrink-0">
                                                <span className="font-mono text-indigo-700 dark:text-indigo-300">log<sub>b</sub>(xy)</span>
                                            </div>
                                            <span className="text-gray-700 dark:text-gray-300">= log<sub>b</sub>(x) + log<sub>b</sub>(y)</span>
                                        </div>
                                        <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-md flex items-center">
                                            <div className="mr-2 w-20 text-center flex-shrink-0">
                                                <span className="font-mono text-indigo-700 dark:text-indigo-300">log<sub>b</sub>(x/y)</span>
                                            </div>
                                            <span className="text-gray-700 dark:text-gray-300">= log<sub>b</sub>(x) - log<sub>b</sub>(y)</span>
                                        </div>
                                        <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-md flex items-center">
                                            <div className="mr-2 w-20 text-center flex-shrink-0">
                                                <span className="font-mono text-indigo-700 dark:text-indigo-300">log<sub>b</sub>(x<sup>n</sup>)</span>
                                            </div>
                                            <span className="text-gray-700 dark:text-gray-300">= n · log<sub>b</sub>(x)</span>
                                        </div>
                                        <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-md flex items-center">
                                            <div className="mr-2 w-20 text-center flex-shrink-0">
                                                <span className="font-mono text-indigo-700 dark:text-indigo-300">log<sub>b</sub>(1)</span>
                                            </div>
                                            <span className="text-gray-700 dark:text-gray-300">= 0</span>
                                        </div>
                                        <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-md flex items-center">
                                            <div className="mr-2 w-20 text-center flex-shrink-0">
                                                <span className="font-mono text-indigo-700 dark:text-indigo-300">log<sub>b</sub>(b)</span>
                                            </div>
                                            <span className="text-gray-700 dark:text-gray-300">= 1</span>
                                        </div>
                                        <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-md flex items-center">
                                            <div className="mr-2 w-20 text-center flex-shrink-0">
                                                <span className="font-mono text-indigo-700 dark:text-indigo-300">b<sup>log<sub>b</sub>(x)</sup></span>
                                            </div>
                                            <span className="text-gray-700 dark:text-gray-300">= x</span>
                                        </div>
                                    </div>
                                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md border-l-2 border-blue-300 dark:border-blue-700">
                                        <p className="text-sm text-blue-800 dark:text-blue-300 font-medium">Fórmula de mudança de base:</p>
                                        <p className="text-center text-blue-700 dark:text-blue-300 mt-1">log<sub>a</sub>(x) = log<sub>b</sub>(x) / log<sub>b</sub>(a)</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="mt-4">
                                <h5 className="font-medium text-gray-800 dark:text-gray-100 mb-2 border-b border-gray-200 dark:border-gray-700 pb-1">Aplicações dos Logaritmos</h5>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <div className="p-3 bg-white dark:bg-gray-700 rounded-md border border-gray-100 dark:border-gray-600 shadow-sm">
                                        <h6 className="text-indigo-700 dark:text-indigo-300 font-medium mb-2">Ciência e Engenharia</h6>
                                        <ul className="text-sm space-y-1 list-disc pl-4 text-gray-700 dark:text-gray-300">
                                            <li>Escala de decibéis (som)</li>
                                            <li>Escala Richter (terremotos)</li>
                                            <li>pH (acidez/alcalinidade)</li>
                                            <li>Luminosidade de estrelas</li>
                                        </ul>
                                    </div>
                                    <div className="p-3 bg-white dark:bg-gray-700 rounded-md border border-gray-100 dark:border-gray-600 shadow-sm">
                                        <h6 className="text-indigo-700 dark:text-indigo-300 font-medium mb-2">Matemática Financeira</h6>
                                        <ul className="text-sm space-y-1 list-disc pl-4 text-gray-700 dark:text-gray-300">
                                            <li>Cálculo de juros compostos</li>
                                            <li>Tempo de duplicação de capital</li>
                                            <li>Taxa de crescimento</li>
                                            <li>Depreciação exponencial</li>
                                        </ul>
                                    </div>
                                    <div className="p-3 bg-white dark:bg-gray-700 rounded-md border border-gray-100 dark:border-gray-600 shadow-sm">
                                        <h6 className="text-indigo-700 dark:text-indigo-300 font-medium mb-2">Computação e Dados</h6>
                                        <ul className="text-sm space-y-1 list-disc pl-4 text-gray-700 dark:text-gray-300">
                                            <li>Algoritmos de busca</li>
                                            <li>Teoria da informação</li>
                                            <li>Compressão de dados</li>
                                            <li>Machine learning (entropia)</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="mt-4 bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-md border-l-4 border-yellow-400 dark:border-yellow-600">
                                <h5 className="font-medium text-yellow-800 dark:text-yellow-300 mb-1">Dica de Resolução</h5>
                                <p className="text-gray-700 dark:text-gray-300 text-sm">
                                    Ao resolver equações com logaritmos, lembre-se que o logaritmo só é definido para valores positivos.
                                    Além disso, use as propriedades dos logaritmos para simplificar expressões complexas antes de resolver.
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

export default ResolvedorLogaritmo;
