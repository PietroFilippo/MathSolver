import React from 'react';
import { HiCalculator, HiInformationCircle } from 'react-icons/hi';
import { getWeightedMeanExamples } from '../../utils/mathUtilsEstatistica';
import { useWeightedMeanSolver } from '../../hooks/estatistica/useMediaPonderadaSolver';
import StepByStepExplanation from '../../components/StepByStepExplanation';
import ConceitoMatematico from '../../components/ConceitoMatematico';

const ResolvedorMediaPonderada: React.FC = () => {
    const { 
        state, 
        dispatch, 
        handleChange, 
        handleAddPair, 
        handleRemovePair, 
        handleSolve, 
        applyExample 
    } = useWeightedMeanSolver();

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center mb-6">
                <HiCalculator className="h-6 w-6 text-indigo-600 dark:text-indigo-400 mr-2" />
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Média Ponderada</h2>
            </div>

            <div className="resolver-container p-6 mb-8">
                <p className="text-gray-700 dark:text-gray-300 mb-6">
                    Calcule a média ponderada de um conjunto de valores e seus respectivos pesos.
                </p>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Exemplos
                    </label>
                    <div className="flex flex-wrap gap-2 mb-4">
                        {getWeightedMeanExamples().map((example, index) => (
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

                <div className="space-y-4 mb-6">
                    {state.valoresPesos.map((vp, index) => (
                        <div key={index} className="flex items-center space-x-4">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Valor {index + 1}
                                </label>
                                <input
                                    type="number"
                                    value={vp.valor}
                                    onChange={(e) => handleChange(index, 'valor', e.target.value)}
                                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400"
                                    placeholder="Digite o valor"
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Peso {index + 1}
                                </label>
                                <input
                                    type="number"
                                    value={vp.peso}
                                    onChange={(e) => handleChange(index, 'peso', e.target.value)}
                                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400"
                                    placeholder="Digite o peso"
                                    min="0"
                                    step="0.1"
                                />
                            </div>
                            {state.valoresPesos.length > 2 && (
                                <button
                                    onClick={() => handleRemovePair(index)}
                                    className="mt-6 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                                >
                                    Remover
                                </button>
                            )}
                        </div>
                    ))}
                </div>

                <div className="flex space-x-4">
                    <button
                        onClick={handleAddPair}
                        className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium"
                    >
                        + Adicionar mais valores
                    </button>
                    <button
                        onClick={handleSolve}
                        className="bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 text-white font-medium py-2 px-6 rounded-md transition-colors duration-300"
                    >
                        Calcular
                    </button>
                </div>

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
                            Média Ponderada: <span className="font-bold">{state.result}</span>
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
                                        <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2 border-b border-gray-200 dark:border-gray-700 pb-1">Média Ponderada</h5>
                                        <div className="space-y-3">
                                            <p className="text-gray-700 dark:text-gray-300">
                                                A média ponderada é uma medida de tendência central que considera a importância 
                                                relativa (peso) de cada valor no conjunto de dados, diferente da média aritmética 
                                                simples onde todos os valores têm a mesma importância.
                                            </p>
                                            <div className="bg-white dark:bg-gray-700 p-3 rounded-md border border-gray-100 dark:border-gray-600 shadow-sm">
                                                <h6 className="text-indigo-700 dark:text-indigo-300 font-medium mb-2">Fórmula</h6>
                                                <div className="text-center font-medium text-indigo-700 dark:text-indigo-300">
                                                    <p>MP = (x₁w₁ + x₂w₂ + ... + xₙwₙ) ÷ (w₁ + w₂ + ... + wₙ)</p>
                                                    <p className="text-sm mt-1">Onde x₁, x₂, ..., xₙ são os valores e w₁, w₂, ..., wₙ são seus respectivos pesos</p>
                                                </div>
                                            </div>
                                            <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-md">
                                                <p className="text-sm text-indigo-700 dark:text-indigo-300">
                                                    <span className="font-medium">Observação:</span> Se todos os pesos forem iguais, 
                                                    a média ponderada será igual à média aritmética simples.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex-1">
                                        <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2 border-b border-gray-200 dark:border-gray-700 pb-1">Aplicações e Exemplos</h5>
                                        <div className="p-3 bg-white dark:bg-gray-700 rounded-md border border-gray-100 dark:border-gray-600 shadow-sm mb-4">
                                            <h6 className="text-indigo-700 dark:text-indigo-300 font-medium mb-2">Contextos de Uso</h6>
                                            <ul className="text-sm space-y-2 list-disc pl-4 text-gray-700 dark:text-gray-300">
                                                <li><span className="font-medium">Notas Escolares:</span> Diferentes disciplinas ou avaliações podem ter pesos diferentes</li>
                                                <li><span className="font-medium">Economia:</span> No cálculo do Índice de Preços ao Consumidor (IPC)</li>
                                                <li><span className="font-medium">Finanças:</span> Para calcular o retorno médio de uma carteira de investimentos</li>
                                                <li><span className="font-medium">Pesquisas:</span> Quando diferentes opiniões têm importâncias diferentes</li>
                                                <li><span className="font-medium">Estatística:</span> Em métodos de amostragem e análise de dados</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-white dark:bg-gray-700 p-3 rounded-md border border-gray-100 dark:border-gray-600 shadow-sm">
                                        <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Exemplo Prático</h5>
                                        <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-md mb-2">
                                            <p className="text-sm text-indigo-700 dark:text-indigo-300">
                                                <span className="font-medium">Cálculo de média final:</span>
                                            </p>
                                            <ul className="text-xs list-disc pl-4 mt-1 text-gray-700 dark:text-gray-300">
                                                <li>Prova 1: nota 7,0 (peso 2)</li>
                                                <li>Prova 2: nota 8,5 (peso 3)</li>
                                                <li>Trabalho: nota 6,0 (peso 1)</li>
                                            </ul>
                                            <p className="text-xs mt-2 text-indigo-700 dark:text-indigo-300">
                                                Média Ponderada = ((7,0 × 2) + (8,5 × 3) + (6,0 × 1)) ÷ (2 + 3 + 1)<br />
                                                = (14 + 25,5 + 6) ÷ 6<br />
                                                = 45,5 ÷ 6<br />
                                                = 7,58
                                            </p>
                                        </div>
                                    </div>

                                    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-md border-l-4 border-yellow-400 dark:border-yellow-600">
                                        <h5 className="font-medium text-yellow-800 dark:text-yellow-300 mb-2">Dica de Resolução</h5>
                                        <ul className="text-sm space-y-2 list-disc pl-4 text-gray-700 dark:text-gray-300">
                                            <li>Certifique-se de que os pesos são atribuídos corretamente de acordo com a importância relativa de cada valor</li>
                                            <li>Verifique se a soma de todos os produtos (valor × peso) está correta</li>
                                            <li>Lembre-se de dividir pela soma dos pesos, não pelo número de valores</li>
                                            <li>Quando todos os pesos são iguais, você pode simplificar e calcular a média aritmética</li>
                                        </ul>
                                    </div>
                                </div>
                                
                                <div className="mt-4 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-md border border-indigo-100 dark:border-indigo-700">
                                    <h5 className="font-medium text-indigo-800 dark:text-indigo-300 mb-1 flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                        </svg>
                                        Relação com Outras Medidas
                                    </h5>
                                    <p className="text-sm text-indigo-700 dark:text-indigo-300">
                                        A média ponderada é uma generalização da média aritmética. Outras médias importantes incluem a média geométrica 
                                        (usada para taxas de crescimento) e a média harmônica (usada para médias de taxas). Cada tipo de média tem seu 
                                        contexto específico de aplicação.
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

export default ResolvedorMediaPonderada;
