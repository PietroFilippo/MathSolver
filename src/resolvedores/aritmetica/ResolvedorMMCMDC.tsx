import React from 'react';
import { HiCalculator, HiInformationCircle } from 'react-icons/hi';
import { getMMCMDCExamples } from '../../utils/mathUtilsTeoriaNumeros';
import { useGcdLcmSolver } from '../../hooks/aritmetica/useMMCMDCSolver';
import StepByStepExplanation from '../../components/StepByStepExplanation';
import ConceitoMatematico from '../../components/ConceitoMatematico';

const ResolvedorMMCMDC: React.FC = () => {
    const { state, dispatch, handleSolve, applyExample, setCalculationType } = useGcdLcmSolver();

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center mb-6">
                <HiCalculator className="h-6 w-6 text-indigo-600 mr-2" />
                <h2 className="text-2xl font-bold">Calculadora de MMC e MDC</h2>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-8">
                <p className="text-gray-700 mb-6">
                    Calcule o Mínimo Múltiplo Comum (MMC) ou o Máximo Divisor Comum (MDC) de dois ou mais números inteiros positivos.
                </p>
                
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Números (separados por vírgula):
                    </label>
                    <input
                        type="text"
                        value={state.inputNumbers}
                        onChange={(e) => dispatch({ type: 'SET_INPUT_NUMBERS', value: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Ex: 12, 18, 24"
                    />
                </div>

                <div className="mb-6">
                    <p className="block text-sm font-medium text-gray-700 mb-2">Tipo de cálculo:</p>
                    <div className="flex flex-wrap gap-4">
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                checked={state.calculationType === 'mmc'}
                                onChange={() => setCalculationType('mmc')}
                                className="form-radio text-indigo-600"
                            />
                            <span className="ml-2">MMC - Mínimo Múltiplo Comum</span>
                        </label>
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                checked={state.calculationType === 'mdc'}
                                onChange={() => setCalculationType('mdc')}
                                className="form-radio text-indigo-600"
                            />
                            <span className="ml-2">MDC - Máximo Divisor Comum</span>
                        </label>
                    </div>
                </div>

                {/* Exemplos de MMC/MDC */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Exemplos
                    </label>
                    <div className="flex flex-wrap gap-2 mb-4">
                        {getMMCMDCExamples().map((example, index) => (
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
                            O {state.calculationType === 'mmc' ? 'MMC' : 'MDC'} de {state.numbers?.join(', ')} é: <span className="font-bold">{state.result}</span>
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
                                        <h5 className="font-medium text-gray-800 mb-2 border-b border-gray-200 pb-1">
                                        {state.calculationType === 'mmc' ? 'MMC - Mínimo Múltiplo Comum' : 'MDC - Máximo Divisor Comum'}
                                        </h5>
                                        <div className="p-3 bg-white rounded-md border border-gray-100 shadow-sm mb-3">
                                            <p className="text-gray-700 mb-2">
                                            {state.calculationType === 'mmc' ? (
                                                    <>O <strong className="text-indigo-700">Mínimo Múltiplo Comum (MMC)</strong> de dois ou mais números é o menor número positivo que é múltiplo de todos eles.</>
                                                ) : (
                                                    <>O <strong className="text-indigo-700">Máximo Divisor Comum (MDC)</strong> de dois ou mais números é o maior número inteiro que divide todos eles sem deixar resto.</>
                                                )}
                                            </p>
                                        </div>
                                    
                                        <div className="p-3 bg-indigo-50 rounded-md mb-3">
                                            <h6 className="font-medium text-indigo-700 mb-2">Propriedades Importantes:</h6>
                                            <ul className="list-disc pl-5 text-sm space-y-1 text-gray-700">
                                                {state.calculationType === 'mmc' ? (
                                                    <>
                                                        <li>MMC(a, b) × MDC(a, b) = a × b</li>
                                                        <li>Se a e b são coprimos (MDC(a, b) = 1), então MMC(a, b) = a × b</li>
                                                        <li>MMC(a, a) = a</li>
                                                        <li>MMC(a, 0) = 0, desde que a ≠ 0</li>
                                                    </>
                                                ) : (
                                                    <>
                                                        <li>MDC(a, b) = MDC(b, a % b), para b ≠ 0 (Algoritmo de Euclides)</li>
                                                        <li>MDC(a, 0) = a, para a ≠ 0</li>
                                                        <li>MDC(a, 1) = 1</li>
                                                        <li>Se a divide b, então MDC(a, b) = a</li>
                                                    </>
                                                )}
                                            </ul>
                                        </div>
                                    
                                        <div className="bg-green-50 p-3 rounded-md">
                                            <h6 className="font-medium text-green-700 mb-2">Aplicações Práticas:</h6>
                                            <ul className="list-disc pl-5 text-sm space-y-1 text-gray-700">
                                                {state.calculationType === 'mmc' ? (
                                                    <>
                                                        <li>Encontrar o denominador comum ao adicionar frações</li>
                                                        <li>Calcular quando eventos periódicos coincidem</li>
                                                        <li>Resolver problemas de combinações e arranjos</li>
                                                    </>
                                                ) : (
                                                    <>
                                                        <li>Simplificar frações</li>
                                                        <li>Resolver equações diofantinas lineares (ax + by = c)</li>
                                                        <li>Encontrar o máximo número possível de itens que podem ser agrupados igualmente</li>
                                                    </>
                                                )}
                                            </ul>
                                        </div>
                                    </div>
                                    
                                    <div className="flex-1">
                                        <h5 className="font-medium text-gray-800 mb-2 border-b border-gray-200 pb-1">Relação entre MMC e MDC</h5>
                                        <div className="p-3 bg-white rounded-md border border-gray-100 shadow-sm mb-3">
                                            <p className="text-gray-700 mb-2">
                                                O MDC e o MMC estão relacionados pela fórmula:
                                            </p>
                                            <div className="bg-indigo-50 p-3 rounded-md text-center">
                                                <p className="text-lg font-medium text-indigo-700">
                                                    MMC(a, b) × MDC(a, b) = a × b
                                                </p>
                                            </div>
                                            <p className="text-sm text-gray-600 mt-2">
                                                Esta fórmula é válida para quaisquer dois inteiros positivos a e b.
                                            </p>
                                        </div>
                                        
                                        <div className="p-3 bg-white rounded-md border border-gray-100 shadow-sm">
                                            <h6 className="text-indigo-700 font-medium mb-2">Exemplos</h6>
                                            <div className="space-y-2 text-sm">
                                                <div className="bg-gray-50 p-2 rounded-md">
                                                    <p className="font-medium">Para 12 e 18:</p>
                                                    <p>MDC(12, 18) = 6</p>
                                                    <p>MMC(12, 18) = 36</p>
                                                    <p className="text-indigo-600">Verificando: 6 × 36 = 12 × 18 = 216 ✓</p>
                                                </div>
                                                <div className="bg-gray-50 p-2 rounded-md">
                                                    <p className="font-medium">Para 15 e 25:</p>
                                                    <p>MDC(15, 25) = 5</p>
                                                    <p>MMC(15, 25) = 75</p>
                                                    <p className="text-indigo-600">Verificando: 5 × 75 = 15 × 25 = 375 ✓</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="mt-4">
                                    <h5 className="font-medium text-gray-800 mb-2 border-b border-gray-200 pb-1">Métodos de Cálculo</h5>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <div className="p-3 bg-white rounded-md border border-gray-100 shadow-sm h-full">
                                                <h6 className="text-indigo-700 font-medium mb-2">Método da Fatoração em Primos</h6>
                                                <ol className="text-sm space-y-2 list-decimal pl-5 text-gray-700">
                                                    <li>Fatore cada número em seus fatores primos</li>
                                                    <li>
                                                    {state.calculationType === 'mmc' ? (
                                                            <>Para o MMC: multiplique cada fator primo com o <strong>maior</strong> expoente que aparece em qualquer fatoração</>
                                                        ) : (
                                                            <>Para o MDC: multiplique cada fator primo com o <strong>menor</strong> expoente que aparece em todas as fatorações</>
                                                        )}
                                                    </li>
                                                </ol>
                                                <div className="mt-2 bg-gray-50 p-2 rounded-md">
                                                    <p className="text-xs text-gray-600">Exemplo: Para 12 = 2² × 3 e 18 = 2 × 3²</p>
                                                    {state.calculationType === 'mmc' ? (
                                                        <p className="text-xs text-gray-600">MMC = 2² × 3² = 4 × 9 = 36</p>
                                                    ) : (
                                                        <p className="text-xs text-gray-600">MDC = 2¹ × 3¹ = 2 × 3 = 6</p>
                                                    )}
                                                </div>
                                                
                                                {state.calculationType === 'mdc' && (
                                                    <div className="mt-3 bg-yellow-50 p-2 rounded-md">
                                                        <p className="text-xs font-medium text-yellow-800">
                                                            Se dois números não têm fatores em comum, seu MDC é 1, e eles são chamados de coprimos ou primos entre si.
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <div className="p-3 bg-white rounded-md border border-gray-100 shadow-sm h-full">
                                                {state.calculationType === 'mdc' ? (
                                                    <>
                                                        <h6 className="text-indigo-700 font-medium mb-2">Algoritmo de Euclides (para MDC)</h6>
                                                        <ol className="text-sm space-y-2 list-decimal pl-5 text-gray-700">
                                                            <li>Divida o maior número pelo menor e obtenha o resto</li>
                                                            <li>Se o resto for zero, o MDC é o segundo número</li>
                                                            <li>Se não, substitua o primeiro número pelo segundo e o segundo pelo resto, e repita o processo</li>
                                                        </ol>
                                                        <div className="mt-2 bg-gray-50 p-2 rounded-md">
                                                            <p className="text-xs text-gray-600">Exemplo: MDC(48, 18)</p>
                                                            <div className="text-xs text-gray-600">
                                                                <p>48 = 18 × 2 + 12</p>
                                                                <p>18 = 12 × 1 + 6</p>
                                                                <p>12 = 6 × 2 + 0</p>
                                                                <p>Como o resto é 0, MDC(48, 18) = 6</p>
                                                            </div>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <>
                                                        <h6 className="text-indigo-700 font-medium mb-2">Método dos Múltiplos (para MMC)</h6>
                                                        <ol className="text-sm space-y-2 list-decimal pl-5 text-gray-700">
                                                            <li>Liste os múltiplos de cada número</li>
                                                            <li>Identifique o menor múltiplo que aparece em todas as listas</li>
                                                        </ol>
                                                        <div className="mt-2 bg-gray-50 p-2 rounded-md">
                                                            <p className="text-xs text-gray-600">Exemplo: MMC(4, 6)</p>
                                                            <div className="text-xs text-gray-600">
                                                                <p>Múltiplos de 4: 4, 8, 12, 16, 20, 24, ...</p>
                                                                <p>Múltiplos de 6: 6, 12, 18, 24, ...</p>
                                                                <p>O menor múltiplo comum é 12</p>
                                                            </div>
                                                        </div>
                                                        <div className="mt-3 p-2 bg-blue-50 rounded-md">
                                                            <p className="text-xs text-blue-700">
                                                                <strong>Dica:</strong> Usar a fatoração em primos é geralmente mais eficiente para números grandes.
                                                            </p>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="mt-4 bg-yellow-50 p-3 rounded-md border-l-4 border-yellow-400">
                                    <h5 className="font-medium text-yellow-800 mb-1">Dica de Resolução</h5>
                                    <p className="text-gray-700 text-sm">
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