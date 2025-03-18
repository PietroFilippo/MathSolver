import React from 'react';
import { HiCalculator, HiInformationCircle } from 'react-icons/hi';
import { getMMCMDCExamples } from '../../utils/mathUtilsTeoriaNumeros';
import { useGcdLcmSolver } from '../../hooks/aritmetica/useMMCMDCSolver';
import StepByStepExplanation from '../../components/StepByStepExplanation';
import ConceitoMatematico from '../../components/ConceitoMatematico';

const ResolvedorMMCMDC: React.FC = () => {
    const { state, dispatch, handleSolve, applyExample, setCalculationType } = useGcdLcmSolver();
    
    // Set default calculation type to MMC when component mounts
    React.useEffect(() => {
        setCalculationType('mmc');
    }, []);

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center mb-6">
                <HiCalculator className="h-6 w-6 text-indigo-600 dark:text-indigo-400 mr-2" />
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Calculadora de MMC e MDC</h2>
            </div>

            <div className="resolver-container p-6 mb-8">
                <p className="text-gray-700 dark:text-gray-300 mb-6">
                    Calcule o Mínimo Múltiplo Comum (MMC) ou o Máximo Divisor Comum (MDC) de dois ou mais números inteiros positivos.
                </p>
                
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Números (separados por vírgula):
                    </label>
                    <input
                        type="text"
                        value={state.inputNumbers}
                        onChange={(e) => dispatch({ type: 'SET_INPUT_NUMBERS', value: e.target.value })}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400"
                        placeholder="Ex: 12, 18, 24"
                    />
                </div>

                <div className="mb-6">
                    <p className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tipo de cálculo:</p>
                    <div className="flex flex-wrap gap-4">
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                checked={state.calculationType === 'mmc'}
                                onChange={() => setCalculationType('mmc')}
                                className="form-radio text-indigo-600 dark:text-indigo-400"
                            />
                            <span className="ml-2 text-gray-700 dark:text-gray-300">MMC - Mínimo Múltiplo Comum</span>
                        </label>
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                checked={state.calculationType === 'mdc'}
                                onChange={() => setCalculationType('mdc')}
                                className="form-radio text-indigo-600 dark:text-indigo-400"
                            />
                            <span className="ml-2 text-gray-700 dark:text-gray-300">MDC - Máximo Divisor Comum</span>
                        </label>
                    </div>
                </div>

                {/* Exemplos de cálculos */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Exemplos
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {getMMCMDCExamples().filter(ex => ex.type === state.calculationType).map((example, index) => (
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
                    className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-medium py-2 px-6 rounded-md transition-colors duration-300"
                >
                    Calcular
                </button>
                
                {state.errorMessage && (
                    <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 rounded-md">
                        {state.errorMessage}
                    </div>
                )}
            </div>

            {state.result && (
                <div className="space-y-6">
                    <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-5">
                        <h3 className="text-lg font-medium text-green-800 dark:text-green-300 mb-2">Resultado</h3>
                        <p className="text-xl text-gray-800 dark:text-gray-200">
                            {state.calculationType === 'mmc' ? 'O MMC' : 'O MDC'} de <span className="font-bold">{state.inputNumbers}</span> é: <span className="font-bold">{state.result}</span>
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
                                    {state.calculationType === 'mmc' ? 'Cálculo do MMC' : 'Cálculo do MDC'} passo a passo
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
                                        <h5 className="font-medium text-gray-800 dark:text-gray-100 mb-2 border-b border-gray-200 dark:border-gray-700 pb-1">
                                            {state.calculationType === 'mmc' ? 'Mínimo Múltiplo Comum (MMC)' : 'Máximo Divisor Comum (MDC)'}
                                        </h5>
                                        <p className="text-gray-700 dark:text-gray-300 mb-3">
                                            {state.calculationType === 'mmc' 
                                                ? 'O MMC entre dois ou mais números é o menor número positivo que é múltiplo de todos eles.'
                                                : 'O MDC entre dois ou mais números é o maior número que divide todos eles sem deixar resto.'}
                                        </p>
                                        <div className="bg-white dark:bg-gray-700 p-3 rounded-md border border-gray-100 dark:border-gray-600 shadow-sm mb-3">
                                            <div className="text-sm text-gray-700 dark:text-gray-300">
                                                <h6 className="font-medium text-indigo-700 dark:text-indigo-400 mb-1">Exemplo:</h6>
                                                {state.calculationType === 'mmc' ? (
                                                    <>
                                                        <p>• Múltiplos de 4: 4, 8, 12, 16, 20, 24, 28, ...</p>
                                                        <p>• Múltiplos de 6: 6, 12, 18, 24, 30, ...</p>
                                                        <p>∴ MMC(4,6) = 12</p>
                                                        
                                                        <p className="mt-2">• Múltiplos de 3: 3, 6, 9, 12, 15, 18, 21, 24, ...</p>
                                                        <p>• Múltiplos de 5: 5, 10, 15, 20, 25, 30, ...</p>
                                                        <p>∴ MMC(3,5) = 15</p>
                                                        
                                                        <p className="mt-2">• Múltiplos de 8: 8, 16, 24, 32, 40, 48, ...</p>
                                                        <p>• Múltiplos de 10: 10, 20, 30, 40, 50, ...</p>
                                                        <p>∴ MMC(8,10) = 40</p>
                                                        
                                                        <p className="mt-2">• Múltiplos de 9: 9, 18, 27, 36, 45, 54, ...</p>
                                                        <p>• Múltiplos de 15: 15, 30, 45, 60, 75, ...</p>
                                                        <p>∴ MMC(9,15) = 45</p>
                                                    </>
                                                ) : (
                                                    <>
                                                        <p>• Divisores de 12: 1, 2, 3, 4, 6, 12</p>
                                                        <p>• Divisores de 18: 1, 2, 3, 6, 9, 18</p>
                                                        <p>∴ MDC(12,18) = 6</p>
                                                        
                                                        <p className="mt-2">• Divisores de 24: 1, 2, 3, 4, 6, 8, 12, 24</p>
                                                        <p>• Divisores de 36: 1, 2, 3, 4, 6, 9, 12, 18, 36</p>
                                                        <p>∴ MDC(24,36) = 12</p>
                                                        
                                                        <p className="mt-2">• Divisores de 15: 1, 3, 5, 15</p>
                                                        <p>• Divisores de 25: 1, 5, 25</p>
                                                        <p>∴ MDC(15,25) = 5</p>
                                                        
                                                        <p className="mt-2">• Divisores de 14: 1, 2, 7, 14</p>
                                                        <p>• Divisores de 35: 1, 5, 7, 35</p>
                                                        <p>∴ MDC(14,35) = 7</p>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex-1">
                                        <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2 border-b border-gray-200 dark:border-gray-700 pb-1">Relação entre MMC e MDC</h5>
                                        <div className="p-3 bg-white dark:bg-gray-700 rounded-md border border-gray-100 dark:border-gray-600 shadow-sm mb-3">
                                            <p className="text-gray-700 dark:text-gray-300 mb-2">
                                                O MDC e o MMC estão relacionados pela fórmula:
                                            </p>
                                            <div className="bg-indigo-50 dark:bg-indigo-900/30 p-3 rounded-md text-center">
                                                <p className="text-lg font-medium text-indigo-700 dark:text-indigo-300">
                                                    MMC(a, b) × MDC(a, b) = a × b
                                                </p>
                                            </div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                                                Esta fórmula é válida para quaisquer dois inteiros positivos a e b.
                                            </p>
                                        </div>
                                        
                                        <div className="p-3 bg-white dark:bg-gray-700 rounded-md border border-gray-100 dark:border-gray-600 shadow-sm">
                                            <h6 className="text-indigo-700 dark:text-indigo-300 font-medium mb-2">Exemplos</h6>
                                            <div className="space-y-2 text-sm">
                                                <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded-md">
                                                    <p className="font-medium text-gray-700 dark:text-gray-300">Para 12 e 18:</p>
                                                    <p className="text-gray-700 dark:text-gray-300">MDC(12, 18) = 6</p>
                                                    <p className="text-gray-700 dark:text-gray-300">MMC(12, 18) = 36</p>
                                                    <p className="text-indigo-600 dark:text-indigo-400">Verificando: 6 × 36 = 12 × 18 = 216 ✓</p>
                                                </div>
                                                <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded-md">
                                                    <p className="font-medium text-gray-700 dark:text-gray-300">Para 15 e 25:</p>
                                                    <p className="text-gray-700 dark:text-gray-300">MDC(15, 25) = 5</p>
                                                    <p className="text-gray-700 dark:text-gray-300">MMC(15, 25) = 75</p>
                                                    <p className="text-indigo-600 dark:text-indigo-400">Verificando: 5 × 75 = 15 × 25 = 375 ✓</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="mt-4">
                                    <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2 border-b border-gray-200 dark:border-gray-700 pb-1">Métodos de Cálculo</h5>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <div className="p-3 bg-white dark:bg-gray-700 rounded-md border border-gray-100 dark:border-gray-600 shadow-sm h-full">
                                                <h6 className="text-indigo-700 dark:text-indigo-300 font-medium mb-2">Método da Fatoração em Primos</h6>
                                                <ol className="text-sm space-y-2 list-decimal pl-5 text-gray-700 dark:text-gray-300">
                                                    <li>Fatore cada número em seus fatores primos</li>
                                                    <li>
                                                    {state.calculationType === 'mmc' ? (
                                                            <>Para o MMC: multiplique cada fator primo com o <strong>maior</strong> expoente que aparece em qualquer fatoração</>
                                                        ) : (
                                                            <>Para o MDC: multiplique cada fator primo com o <strong>menor</strong> expoente que aparece em todas as fatorações</>
                                                        )}
                                                    </li>
                                                </ol>
                                                <div className="mt-2 bg-gray-50 dark:bg-gray-800 p-2 rounded-md">
                                                    <p className="text-xs text-gray-600 dark:text-gray-400">Exemplo: Para 12 = 2² × 3 e 18 = 2 × 3²</p>
                                                    {state.calculationType === 'mmc' ? (
                                                        <p className="text-xs text-gray-600 dark:text-gray-400">MMC = 2² × 3² = 4 × 9 = 36</p>
                                                    ) : (
                                                        <p className="text-xs text-gray-600 dark:text-gray-400">MDC = 2¹ × 3¹ = 2 × 3 = 6</p>
                                                    )}
                                                </div>
                                                
                                                <div className="mt-3 bg-blue-50 dark:bg-blue-900/30 p-2 rounded-md">
                                                    <p className="text-xs text-blue-700 dark:text-blue-300">
                                                        <strong>Dica:</strong> Este método é mais eficiente para números grandes e funciona bem para calcular tanto o MMC quanto o MDC.
                                                    </p>
                                                </div>
                                                
                                                {state.calculationType === 'mdc' && (
                                                    <div className="mt-3 bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded-md">
                                                        <p className="text-xs font-medium text-yellow-800 dark:text-yellow-300">
                                                            Se dois números não têm fatores em comum, seu MDC é 1, e eles são chamados de coprimos ou primos entre si.
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <div className="p-3 bg-white dark:bg-gray-700 rounded-md border border-gray-100 dark:border-gray-600 shadow-sm h-full">
                                                {state.calculationType === 'mdc' ? (
                                                    <>
                                                        <h6 className="text-indigo-700 dark:text-indigo-300 font-medium mb-2">Algoritmo de Euclides (para MDC)</h6>
                                                        <ol className="text-sm space-y-2 list-decimal pl-5 text-gray-700 dark:text-gray-300">
                                                            <li>Divida o maior número pelo menor e obtenha o resto</li>
                                                            <li>Se o resto for zero, o MDC é o segundo número</li>
                                                            <li>Se não, substitua o primeiro número pelo segundo e o segundo pelo resto, e repita o processo</li>
                                                        </ol>
                                                        <div className="mt-2 bg-gray-50 dark:bg-gray-800 p-2 rounded-md">
                                                            <p className="text-xs text-gray-600 dark:text-gray-400">Exemplo: MDC(48, 18)</p>
                                                            <div className="text-xs text-gray-600 dark:text-gray-400">
                                                                <p>48 = 18 × 2 + 12</p>
                                                                <p>18 = 12 × 1 + 6</p>
                                                                <p>12 = 6 × 2 + 0</p>
                                                                <p>Como o resto é 0, MDC(48, 18) = 6</p>
                                                            </div>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <>
                                                        <h6 className="text-indigo-700 dark:text-indigo-300 font-medium mb-2">Método dos Múltiplos (para MMC)</h6>
                                                        <ol className="text-sm space-y-2 list-decimal pl-5 text-gray-700 dark:text-gray-300">
                                                            <li>Liste os múltiplos de cada número</li>
                                                            <li>Identifique o menor múltiplo que aparece em todas as listas</li>
                                                        </ol>
                                                        <div className="mt-2 bg-gray-50 dark:bg-gray-800 p-2 rounded-md">
                                                            <p className="text-xs text-gray-600 dark:text-gray-400">Exemplo: MMC(4, 6)</p>
                                                            <div className="text-xs text-gray-600 dark:text-gray-400">
                                                                <p>Múltiplos de 4: 4, 8, 12, 16, 20, 24, ...</p>
                                                                <p>Múltiplos de 6: 6, 12, 18, 24, ...</p>
                                                                <p>O menor múltiplo comum é 12</p>
                                                            </div>
                                                        </div>
                                                        <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-900/30 rounded-md">
                                                            <p className="text-xs text-blue-700 dark:text-blue-300">
                                                                <strong>Dica:</strong> Usar a fatoração em primos é geralmente mais eficiente para números grandes.
                                                            </p>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="mt-4 bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-md border-l-4 border-yellow-400 dark:border-yellow-600">
                                    <h5 className="font-medium text-yellow-800 dark:text-yellow-300 mb-1">Dica de Resolução</h5>
                                    <p className="text-gray-700 dark:text-gray-300 text-sm">
                                        {state.calculationType === 'mmc' ? (
                                            <>
                                                Para calcular o MMC de vários números, uma estratégia eficiente é calcular o MMC dos dois primeiros números,
                                                depois calcular o MMC desse resultado com o terceiro número, e assim por diante.
                                            </>
                                        ) : (
                                            <>
                                                Para calcular o MDC de vários números, você pode calcular o MDC dos dois primeiros números,
                                                depois calcular o MDC desse resultado com o terceiro número, e assim por diante.
                                            </>
                                        )}
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

export default ResolvedorMMCMDC;