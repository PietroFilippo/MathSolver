import React from 'react';
import { HiCalculator, HiInformationCircle } from 'react-icons/hi';
import { getFactorizationExamples } from '../../utils/mathUtilsTeoriaNumeros';
import { useFactorizationSolver } from '../../hooks/aritmetica/useFatorizacaoSolver';
import StepByStepExplanation from '../../components/StepByStepExplanation';
import ConceitoMatematico from '../../components/ConceitoMatematico';

const ResolvedorFatorizacao: React.FC = () => {
    const { state, dispatch, handleSolve, applyExample } = useFactorizationSolver();

    // Formata resultado
    const formatResult = (): string => {
        if (!state.primeFactors) return '';
        
        const { factors, exponents } = state.primeFactors;
        
        if (factors.length === 0) return '';
        
        let formattedResult = '';
        
        for (let i = 0; i < factors.length; i++) {
            if (i > 0) formattedResult += ' × ';
            formattedResult += exponents[i] > 1 ? `${factors[i]}<sup>${exponents[i]}</sup>` : `${factors[i]}`;
        }
        
        return formattedResult;
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center mb-6">
                <HiCalculator className="h-6 w-6 text-indigo-600 dark:text-indigo-400 mr-2" />
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Fatoração em Números Primos</h2>
            </div>

            <div className="resolver-container p-6 mb-8">
                <p className="text-gray-700 dark:text-gray-300 mb-6">
                    Esta calculadora decompõe um número em sua fatoração em números primos.
                    A fatoração em primos representa um número como um produto de seus fatores primos.
                </p>

                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="flex-grow">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Número para fatorar:
                    </label>
                    <input
                        type="number"
                            value={state.inputNumber}
                            onChange={(e) => dispatch({ type: 'SET_INPUT_NUMBER', value: e.target.value })}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400"
                            placeholder="Digite um número inteiro maior que 1"
                            min="2"
                    />
                    </div>
                </div>

                {/* Exemplos de fatoração */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Exemplos
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {getFactorizationExamples().map((example, index) => (
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
                    Fatorar
                </button>
                
                {state.errorMessage && (
                    <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 rounded-md">
                        {state.errorMessage}
                    </div>
                )}
            </div>

            {state.primeFactors && (
                <div className="space-y-6">
                    <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-5">
                        <h3 className="text-lg font-medium text-green-800 dark:text-green-300 mb-2">Resultado</h3>
                        <div>
                        <p className="text-xl text-gray-800 dark:text-gray-200">
                        A fatoração em primos de <span className="font-bold">{state.number}
                            </span> é: <span className="font-bold" dangerouslySetInnerHTML={{ __html: formatResult() }} />
                       </p>
                        </div>

                        <button
                            onClick={() => dispatch({ type: 'TOGGLE_EXPLANATION' })}
                            className="mt-4 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 text-sm font-medium flex items-center"
                        >
                            <HiInformationCircle className="h-5 w-5 mr-1" />
                            {state.showExplanation ? "Ocultar explicação detalhada" : "Mostrar explicação detalhada"}
                        </button>
                    </div>

                    {state.showExplanation && (
                        <div className="mt-8 bg-white dark:bg-gray-800 shadow-md rounded-lg p-5 border border-gray-200 dark:border-gray-700">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 flex items-center">
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
                                            <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2 border-b border-gray-200 dark:border-gray-700 pb-1">Números Primos</h5>
                                            <p className="text-gray-700 dark:text-gray-300 mb-3">
                                            Um número primo é um número natural maior que 1 que só é divisível por 1 e por ele mesmo.
                                        </p>
                                        <div className="bg-indigo-50 dark:bg-indigo-900/30 p-3 rounded-md">
                                            <p className="text-indigo-700 dark:text-indigo-300 font-medium mb-2">Exemplos de números primos:</p>
                                            <p className="text-sm text-indigo-600 dark:text-indigo-400">2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, ...</p>
                                        </div>
                                            </div>
                                    
                                    <div className="flex-1">
                                        <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2 border-b border-gray-200 dark:border-gray-700 pb-1">Números Compostos</h5>
                                        <p className="text-gray-700 dark:text-gray-300 mb-3">
                                            Um número composto é um número natural maior que 1 que possui outros divisores além de 1 e ele mesmo.
                                        </p>
                                        <div className="bg-indigo-50 dark:bg-indigo-900/30 p-3 rounded-md">
                                            <p className="text-indigo-700 dark:text-indigo-300 font-medium mb-2">Exemplos de números compostos:</p>
                                            <p className="text-sm text-indigo-600 dark:text-indigo-400">4 = 2 × 2, 6 = 2 × 3, 8 = 2 × 2 × 2, 9 = 3 × 3, 10 = 2 × 5, ...</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex flex-col md:flex-row gap-4 mb-4">
                                        <div className="flex-1">
                                            <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2 border-b border-gray-200 dark:border-gray-700 pb-1">Teorema Fundamental da Aritmética</h5>
                                            <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-md">
                                                <p className="text-indigo-700 dark:text-indigo-300 font-medium mb-2">
                                                    Todo número inteiro maior que 1 ou é primo ou pode ser escrito como um produto de números primos de maneira única (desconsiderando a ordem dos fatores).
                                                </p>
                                                <p className="text-sm text-indigo-600 dark:text-indigo-400">
                                                    Este é um dos teoremas mais importantes da teoria dos números, pois garante que a fatoração em primos é única.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-4">
                                        <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2 border-b border-gray-200 dark:border-gray-700 pb-1">Fatoração em Números Primos</h5>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <div className="p-3 bg-white dark:bg-gray-700 rounded-md border border-gray-100 dark:border-gray-600 shadow-sm">
                                                    <h6 className="text-indigo-700 dark:text-indigo-300 font-medium mb-2">Definição</h6>
                                                    <p className="text-gray-700 dark:text-gray-300 text-sm">
                                                        A fatoração em números primos é a decomposição de um número em um produto de fatores primos.
                                                        Cada número composto pode ser representado de maneira única como uma multiplicação de números primos.
                                                    </p>
                                                </div>
                                                                </div>
                                        <div>
                                            <div className="p-3 bg-white dark:bg-gray-700 rounded-md border border-gray-100 dark:border-gray-600 shadow-sm">
                                                <h6 className="text-indigo-700 dark:text-indigo-300 font-medium mb-2">Algoritmo</h6>
                                                <ol className="list-decimal list-inside text-gray-700 dark:text-gray-300 text-sm space-y-1">
                                                    <li>Comece com o menor número primo, 2.</li>
                                                    <li>Verifique se o número é divisível pelo primo atual.</li>
                                                    <li>Se for divisível, divida o número e repita o passo 2.</li>
                                                    <li>Se não for divisível, passe para o próximo número primo.</li>
                                                    <li>Continue até que o número restante seja 1.</li>
                                                </ol>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                <div className="mt-4">
                                    <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2 border-b border-gray-200 dark:border-gray-700 pb-1">Aplicações da Fatoração</h5>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                                <div className="p-3 bg-white dark:bg-gray-700 rounded-md border border-gray-100 dark:border-gray-600 shadow-sm">
                                            <h6 className="text-indigo-700 dark:text-indigo-300 font-medium mb-1">Criptografia</h6>
                                            <p className="text-gray-700 dark:text-gray-300 text-xs">
                                                A segurança de muitos sistemas criptográficos, como o RSA, depende da dificuldade de fatorar números grandes.
                                                            </p>
                                                        </div>
                                        <div className="p-3 bg-white dark:bg-gray-700 rounded-md border border-gray-100 dark:border-gray-600 shadow-sm">
                                            <h6 className="text-indigo-700 dark:text-indigo-300 font-medium mb-1">Simplificação de Frações</h6>
                                            <p className="text-gray-700 dark:text-gray-300 text-xs">
                                                A fatoração ajuda a encontrar o MDC para simplificar frações ao seu menor termo.
                                                            </p>
                                                        </div>
                                        <div className="p-3 bg-white dark:bg-gray-700 rounded-md border border-gray-100 dark:border-gray-600 shadow-sm">
                                            <h6 className="text-indigo-700 dark:text-indigo-300 font-medium mb-1">Cálculo de MMC e MDC</h6>
                                            <p className="text-gray-700 dark:text-gray-300 text-xs">
                                                A fatoração é utilizada para calcular o mínimo múltiplo comum e o máximo divisor comum entre números.
                                            </p>
                                        </div>
                                        </div>
                                    </div>
                                    
                                <div className="mt-4 bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-md border-l-4 border-yellow-400 dark:border-yellow-600">
                                    <h5 className="font-medium text-yellow-800 dark:text-yellow-300 mb-1">Dica de Cálculo</h5>
                                    <p className="text-gray-700 dark:text-gray-300 text-sm">
                                        Ao fatorar números grandes, primeiro verifique se eles são divisíveis pelos primeiros primos (2, 3, 5, 7, 11, 13).
                                        Se um número não for divisível por nenhum primo menor ou igual à sua raiz quadrada, então ele é primo.
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

export default ResolvedorFatorizacao;