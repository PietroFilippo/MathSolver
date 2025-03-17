import React from 'react';
import { HiCalculator, HiInformationCircle } from 'react-icons/hi';
import { getLinearExamples } from '../../utils/mathUtilsAlgebra';
import { useLinearSolver } from '../../hooks/algebra/useEquacaoPrimeiroGrauSolver';
import StepByStepExplanation from '../../components/StepByStepExplanation';
import ConceitoMatematico from '../../components/ConceitoMatematico';

const ResolvedorEquacaoPrimeiroGrau: React.FC = () => {
    const { state, dispatch, handleSolve, applyExample } = useLinearSolver();

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center mb-6">
                <HiCalculator className="h-6 w-6 text-indigo-600 mr-2" />
                <h2 className="text-2xl font-bold">Equações de Primeiro Grau</h2>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-8">
                <p className="text-gray-700 mb-6">
                    Esta calculadora resolve equações de primeiro grau na forma ax + b = c, 
                    onde a, b e c são constantes e x é a variável a ser resolvida.
                </p>
                
                <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Insira os coeficientes para: ax + b = c</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                a (coeficiente de x)
                            </label>
                            <input
                                type="number"
                                value={state.a}
                                onChange={(e) => dispatch({ type: 'SET_COEFFICIENT', field: 'a', value: e.target.value })}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Digite o valor de a"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                b (termo constante)
                            </label>
                            <input
                                type="number"
                                value={state.b}
                                onChange={(e) => dispatch({ type: 'SET_COEFFICIENT', field: 'b', value: e.target.value })}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Digite o valor de b"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                c (lado direito)
                            </label>
                            <input
                                type="number"
                                value={state.c}
                                onChange={(e) => dispatch({ type: 'SET_COEFFICIENT', field: 'c', value: e.target.value })}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Digite o valor de c"
                            />
                        </div>
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Exemplos
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {getLinearExamples().map((example, index) => (
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
                    Resolver Equação
                </button>
                
                {state.errorMessage && (
                    <div className="mt-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-md">
                        {state.errorMessage}
                    </div>
                )}
            </div>
            
            {state.solution !== null && (
                <div className="space-y-6">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-5">
                        <h3 className="text-lg font-medium text-green-800 mb-2">Resultado</h3>
                        <p className="text-xl">
                            Para a equação {state.a}x + {state.b} = {state.c}
                        </p>
                        <p className="text-xl font-bold mt-2">
                            x = {state.solution}
                        </p>
                        
                        <button 
                            onClick={() => dispatch({ type: 'TOGGLE_EXPLANATION' })}
                            className="mt-4 text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center"
                        >
                            <HiInformationCircle className="h-5 w-5 mr-1" />
                            {state.showExplanation ? "Ocultar explicação detalhada" : "Mostrar explicação detalhada"}
                        </button>
                    </div>
                    
                    {state.showExplanation && state.steps.length > 0 && (
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
                                            Uma equação de primeiro grau (também chamada de equação linear) contém uma variável elevada apenas à potência de 1.
                                            A forma mais geral é representada por:
                                        </p>
                                        <div className="bg-white p-3 rounded-md text-center border border-gray-100 shadow-sm mb-3">
                                            <span className="text-lg font-medium text-indigo-700">ax + b = c</span>
                                        </div>
                                        <div className="p-3 bg-yellow-50 rounded-md border-l-2 border-yellow-300 mb-3">
                                            <p className="text-sm text-yellow-800">
                                                <span className="font-semibold">Propriedade importante:</span> Uma equação linear tem sempre exatamente uma solução, desde que a ≠ 0.
                                            </p>
                                        </div>
                                        <div className="bg-white p-3 rounded-md border border-gray-100 shadow-sm mb-3">
                                            <h6 className="text-indigo-700 font-medium mb-1">Formas Equivalentes</h6>
                                            <ul className="text-sm space-y-1 list-disc pl-4 text-gray-700">
                                                <li>ax + b = c</li>
                                                <li>ax = c - b</li>
                                                <li>ax = d (onde d = c - b)</li>
                                                <li>x = d/a (solução)</li>
                                            </ul>
                                        </div>
                                        <div className="p-3 bg-indigo-50 rounded-md mb-3">
                                            <h6 className="text-indigo-700 font-medium mb-1">Propriedades Fundamentais</h6>
                                            <ul className="text-sm space-y-1 list-disc pl-4 text-gray-700">
                                                <li><span className="font-medium">Princípio da adição:</span> Podemos adicionar ou subtrair o mesmo valor de ambos os lados da equação sem alterar a solução.</li>
                                                <li><span className="font-medium">Princípio da multiplicação:</span> Podemos multiplicar ou dividir ambos os lados da equação pelo mesmo valor não-nulo sem alterar a solução.</li>
                                                <li><span className="font-medium">Proporcionalidade:</span> O gráfico de uma equação linear é sempre uma reta, indicando uma relação proporcional entre as variáveis.</li>
                                            </ul>
                                        </div>
                                        <div className="p-3 bg-blue-50 rounded-md border-l-2 border-blue-300">
                                            <h6 className="text-blue-700 font-medium mb-1">Contexto Histórico</h6>
                                            <p className="text-sm text-gray-700">
                                                Equações lineares são uma das formas mais antigas de matemática registradas. Civilizações como os babilônios (1800 a.C.) já 
                                                resolviam problemas que hoje expressaríamos como equações lineares. O matemático grego Diofanto (por volta de 250 d.C.) 
                                                desenvolveu técnicas para resolver equações lineares com múltiplas incógnitas, e o matemático persa Al-Khwarizmi (780-850 d.C.) 
                                                estabeleceu métodos sistemáticos para a resolução destas equações em seu tratado de álgebra.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <h5 className="font-medium text-gray-800 mb-2 border-b border-gray-200 pb-1">Interpretação Prática</h5>
                                        <div className="bg-white p-3 rounded-md border border-gray-100 shadow-sm mb-3">
                                            <p className="text-gray-700 mb-2">
                                                As equações lineares modelam relações diretas entre grandezas, onde a variação de uma provoca uma variação proporcional na outra.
                                            </p>
                                            <div className="bg-indigo-50 p-2 rounded-md mb-2">
                                                <h6 className="text-indigo-700 font-medium text-sm mb-1">Exemplo prático:</h6>
                                                <p className="text-xs text-gray-600">
                                                    Um táxi cobra R$ 5,00 de bandeirada mais R$ 2,50 por quilômetro percorrido.
                                                </p>
                                                <p className="text-xs text-gray-600 mt-1">
                                                    <span className="font-medium">Modelo:</span> Custo = 2,5 × distância + 5
                                                </p>
                                                <p className="text-xs text-gray-600 mt-1">
                                                    <span className="font-medium">Pergunta:</span> Quanto custará uma corrida de 10 km?
                                                </p>
                                                <p className="text-xs text-gray-600 mt-1">
                                                    <span className="font-medium">Solução:</span> Custo = 2,5 × 10 + 5 = 30 reais
                                                </p>
                                            </div>
                                            <p className="text-xs text-center text-gray-500">
                                                A equação linear permite prever resultados para qualquer valor da variável
                                            </p>
                                        </div>
                                        <div className="bg-white p-3 rounded-md border border-gray-100 shadow-sm">
                                            <h6 className="text-indigo-700 font-medium mb-1">Interpretação da Solução</h6>
                                            <p className="text-sm text-gray-700 mb-2">
                                                A solução de uma equação ax + b = c representa:
                                            </p>
                                            <ul className="text-sm space-y-1 list-disc pl-4 text-gray-700">
                                                <li><span className="font-medium">Valor de equilíbrio</span> onde ambos os lados da equação se igualam</li>
                                                <li><span className="font-medium">Ponto de intersecção</span> entre duas relações lineares</li>
                                                <li><span className="font-medium">Quantidade exata</span> que satisfaz uma condição específica</li>
                                            </ul>
                                        </div>
                                        
                                        <div className="p-3 bg-purple-50 rounded-md border-l-2 border-purple-300 mt-3">
                                            <h6 className="text-purple-700 font-medium mb-1">Equações Lineares em Matemática Avançada</h6>
                                            <p className="text-sm text-gray-700 mb-2">
                                                As equações lineares são fundamentais para diversos campos da matemática avançada:
                                            </p>
                                            <ul className="text-sm space-y-1 list-disc pl-4 text-gray-700">
                                                <li><span className="font-medium">Álgebra Linear:</span> Base para sistemas de equações, espaços vetoriais e transformações lineares</li>
                                                <li><span className="font-medium">Cálculo Diferencial:</span> Linearização de funções complexas através de aproximações</li>
                                                <li><span className="font-medium">Otimização:</span> Restrições em problemas de programação linear</li>
                                                <li><span className="font-medium">Estatística:</span> Fundamento para modelos de regressão linear e análise de dados</li>
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

export default ResolvedorEquacaoPrimeiroGrau;
