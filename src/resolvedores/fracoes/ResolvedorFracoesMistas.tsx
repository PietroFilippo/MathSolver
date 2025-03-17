import React from 'react';
import { FractionDisplay } from '../../utils/mathUtilsFracoes';
import { HiCalculator, HiInformationCircle } from 'react-icons/hi';
import { useMixedFractionSolver } from '../../hooks/fracoes/useFracaoMistaSolver';
import StepByStepExplanation from '../../components/StepByStepExplanation';
import ConceitoMatematico from '../../components/ConceitoMatematico';

const ResolvedorFracoesMistas: React.FC = () => {
  const { 
    state, 
    dispatch, 
    handleSolve, 
    applyExample, 
    getFilteredExamples 
  } = useMixedFractionSolver();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <HiCalculator className="h-6 w-6 text-indigo-600 mr-2" />
        <h2 className="text-2xl font-bold">Conversão de Frações Mistas</h2>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-8">
        <p className="text-gray-700 mb-6">
          Essa calculadora permite converter entre frações mistas e frações impróprias.
          Selecione a operação desejada e insira os valores abaixo.
        </p>

        <div className="mb-6">
          <div className="flex items-center space-x-6 mb-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                checked={state.operation === 'toFraction'}
                onChange={() => dispatch({ type: 'SET_OPERATION', operation: 'toFraction' })}
                className="form-radio h-4 w-4 text-indigo-600"
              />
              <span className="ml-2">Fração mista para fração imprópria</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                checked={state.operation === 'toMixed'}
                onChange={() => dispatch({ type: 'SET_OPERATION', operation: 'toMixed' })}
                className="form-radio h-4 w-4 text-indigo-600"
              />
              <span className="ml-2">Fração imprópria para fração mista</span>
            </label>
          </div>

          {state.operation === 'toFraction' ? (
            <div className="flex items-center space-x-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Parte Inteira
                </label>
                <input
                  type="number"
                  value={state.part}
                  onChange={(e) => dispatch({ type: 'SET_PART', value: e.target.value })}
                  className="w-20 p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Inteiro"
                />
              </div>
              <div className="pt-8">+</div>
              <div className="flex items-center">
                <input
                  type="number"
                  value={state.numerator}
                  onChange={(e) => dispatch({ type: 'SET_NUMERATOR', value: e.target.value })}
                  className="w-20 p-2 border border-gray-300 rounded-l-md focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Num"
                />
                <div className="px-2 py-2 bg-gray-100 border-t border-b border-gray-300">
                  /
                </div>
                <input
                  type="number"
                  value={state.denominator}
                  onChange={(e) => dispatch({ type: 'SET_DENOMINATOR', value: e.target.value })}
                  className="w-20 p-2 border border-gray-300 rounded-r-md focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Den"
                />
              </div>
            </div>
          ) : (
            <div className="flex items-center">
              <input
                type="number"
                value={state.numerator}
                onChange={(e) => dispatch({ type: 'SET_NUMERATOR', value: e.target.value })}
                className="w-20 p-2 border border-gray-300 rounded-l-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Num"
              />
              <div className="px-2 py-2 bg-gray-100 border-t border-b border-gray-300">
                /
              </div>
              <input
                type="number"
                value={state.denominator}
                onChange={(e) => dispatch({ type: 'SET_DENOMINATOR', value: e.target.value })}
                className="w-20 p-2 border border-gray-300 rounded-r-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Den"
              />
            </div>
          )}
        </div>

        {/* Exemplos de frações mistas */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Exemplos
          </label>
          <div className="flex flex-wrap gap-2 mb-4">
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

      {state.resultado && (
        <div className="space-y-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-5">
            <h3 className="text-lg font-medium text-green-800 mb-2">Resultado</h3>
            <div className="flex items-center">
              <p className="text-xl mr-2">
                {state.operation === 'toFraction' ? 'A fração imprópria é: ' : 'A fração mista é: '}
              </p>
              {state.operation === 'toFraction' ? (
                state.resultadoNum !== null && state.resultadoDen !== null && (
                  <FractionDisplay 
                    numerator={state.resultadoNum} 
                    denominator={state.resultadoDen} 
                    className="text-xl"
                  />
                )
              ) : (
                <span className="text-xl">
                  {state.resultadoParte} + {' '}
                  {state.resultadoNum !== null && state.resultadoDen !== null && (
                    <FractionDisplay 
                      numerator={state.resultadoNum} 
                      denominator={state.resultadoDen} 
                      className="text-xl"
                    />
                  )}
                </span>
              )}
            </div>

            <button 
              onClick={() => dispatch({ type: 'TOGGLE_EXPLANATION' })}
              className="mt-4 text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center"
            >
              <HiInformationCircle className="h-5 w-5 mr-1" />
              {state.showExplanation ? "Ocultar explicação detalhada" : "Mostrar explicação detalhada"}
            </button>
          </div>

          {state.showExplanation && (
            <div className="bg-white shadow-md rounded-lg p-5">
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
                    <h5 className="font-medium text-gray-800 mb-2 border-b border-gray-200 pb-1">Frações Mistas e Impróprias</h5>
                    <div className="space-y-3">
                      <p className="text-gray-700">
                        As frações mistas e impróprias são duas formas diferentes de representar quantidades fracionárias:
                      </p>
                      <div className="bg-white p-3 rounded-md border border-gray-100 shadow-sm">
                        <h6 className="text-indigo-700 font-medium mb-2">Definições</h6>
                        <div className="space-y-2">
                          <p className="text-sm">
                            <span className="font-medium">Fração Mista:</span> Consiste em uma parte inteira seguida de uma fração própria.
                            Exemplo: 2³/₄ (dois e três quartos)
                          </p>
                          <p className="text-sm">
                            <span className="font-medium">Fração Imprópria:</span> Tem o numerador maior ou igual ao denominador.
                            Exemplo: ¹¹/₄ (onze quartos)
                          </p>
                        </div>
                      </div>
                      <div className="p-3 bg-indigo-50 rounded-md">
                        <h6 className="text-indigo-700 font-medium mb-2">Conversão entre Frações</h6>
                        <div className="space-y-2 text-sm text-gray-700">
                          <p className="font-medium text-indigo-800">Mista para Imprópria:</p>
                          <div className="bg-white p-2 rounded-md text-center">
                            a + b/c = (a×c + b)/c
                          </div>
                          <p className="font-medium text-indigo-800 mt-3">Imprópria para Mista:</p>
                          <div className="bg-white p-2 rounded-md text-center">
                            n/d = q + r/d<br />
                            <span className="text-xs">onde q = ⌊n/d⌋ (parte inteira) e r = n mod d (resto)</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <h5 className="font-medium text-gray-800 mb-2 border-b border-gray-200 pb-1">Processo de Conversão</h5>
                    <div className="bg-white p-3 rounded-md border border-gray-100 shadow-sm space-y-4">
                      <div>
                        <h6 className="text-indigo-700 font-medium mb-2">Fração Mista para Imprópria</h6>
                        <ol className="text-sm space-y-2 list-decimal pl-5 text-gray-700">
                          <li>
                            Multiplique a parte inteira pelo denominador da fração
                            <p className="text-xs mt-1 text-indigo-600">
                              Para 2³/₄: 2 × 4 = 8
                            </p>
                          </li>
                          <li>
                            Adicione o numerador ao resultado
                            <p className="text-xs mt-1 text-indigo-600">
                              8 + 3 = 11
                            </p>
                          </li>
                          <li>
                            Use o resultado como novo numerador, mantendo o mesmo denominador
                            <p className="text-xs mt-1 text-indigo-600">
                              Resultado: ¹¹/₄
                            </p>
                          </li>
                        </ol>
                      </div>
                      
                      <div className="pt-2 border-t border-gray-100">
                        <h6 className="text-indigo-700 font-medium mb-2">Fração Imprópria para Mista</h6>
                        <ol className="text-sm space-y-2 list-decimal pl-5 text-gray-700">
                          <li>
                            Divida o numerador pelo denominador para obter o quociente e o resto
                            <p className="text-xs mt-1 text-indigo-600">
                              Para ¹¹/₄: 11 ÷ 4 = 2 (quociente) com resto 3
                            </p>
                          </li>
                          <li>
                            O quociente será a parte inteira
                            <p className="text-xs mt-1 text-indigo-600">
                              Parte inteira: 2
                            </p>
                          </li>
                          <li>
                            O resto será o novo numerador, com o mesmo denominador
                            <p className="text-xs mt-1 text-indigo-600">
                              Resultado: 2³/₄
                            </p>
                          </li>
                        </ol>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-3 rounded-md border border-gray-100 shadow-sm">
                    <h5 className="font-medium text-gray-800 mb-2">Casos Especiais</h5>
                    <div className="space-y-3">
                      <div className="p-2 bg-indigo-50 rounded-md">
                        <p className="text-sm text-indigo-700 font-medium mb-1">
                          Frações com Numerador Zero
                        </p>
                        <p className="text-xs text-gray-700">
                          Se o numerador for zero, a fração mista será apenas a parte inteira.
                          Exemplo: 5⁰/₄ = 5
                        </p>
                      </div>
                      
                      <div className="p-2 bg-purple-50 rounded-md">
                        <p className="text-sm text-purple-700 font-medium mb-1">
                          Frações Negativas
                        </p>
                        <p className="text-xs text-gray-700">
                          Com frações negativas, o sinal negativo aplica-se à fração inteira.
                          Exemplo: -7³/₄ é convertido para -³¹/₄ (e não -²⁸/₄)
                        </p>
                      </div>
                      
                      <div className="p-2 bg-amber-50 rounded-md">
                        <p className="text-sm text-amber-700 font-medium mb-1">
                          Resto Zero
                        </p>
                        <p className="text-xs text-gray-700">
                          Se o resto for zero ao converter para fração mista, temos apenas a parte inteira.
                          Exemplo: ¹²/₄ = 3⁰/₄ = 3
                        </p>
                      </div>
                      
                      <div className="p-2 bg-green-50 rounded-md">
                        <p className="text-sm text-green-700 font-medium mb-1">
                          Conversão para Decimal
                        </p>
                        <p className="text-xs text-gray-700">
                          Para converter uma fração mista para decimal, primeiro converta para fração imprópria e depois divida.
                          Exemplo: 2³/₄ → ¹¹/₄ → 11 ÷ 4 = 2,75
                        </p>
                        <p className="text-xs mt-1 text-green-700">
                          <span className="font-medium">Dicas:</span> Para converter rapidamente, some a parte inteira ao resultado da divisão do numerador pelo denominador (2 + 3/4 = 2 + 0,75 = 2,75)
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-yellow-50 p-3 rounded-md border-l-4 border-yellow-400">
                      <h5 className="font-medium text-yellow-800 mb-2">Dicas Práticas</h5>
                      <ul className="text-sm space-y-1 list-disc pl-4 text-gray-700">
                        <li>Frações mistas são comumente usadas para medidas no cotidiano (2½ xícaras)</li>
                        <li>Frações impróprias são mais úteis em cálculos matemáticos intermediários</li>
                        <li>Ao converter para fração imprópria, certifique-se de multiplicar o inteiro pelo denominador (não pelo numerador)</li>
                        <li>Lembre-se que a divisão para encontrar a parte inteira é uma divisão inteira (ignora-se a parte decimal)</li>
                        <li>Realize a verificação: a fração imprópria, quando avaliada, deve ter o mesmo valor da fração mista</li>
                      </ul>
                    </div>
                    
                    <div className="bg-green-50 p-3 rounded-md border border-green-100">
                      <h5 className="font-medium text-green-800 mb-2">Aplicações Práticas</h5>
                      <ul className="text-sm space-y-1 list-disc pl-4 text-gray-700">
                        <li>Medidas em receitas culinárias (2½ colheres)</li>
                        <li>Medições em construção (3¾ metros)</li>
                        <li>Representação de tempo (2¼ horas)</li>
                        <li>Representação de pesos e volumes</li>
                        <li>Em música, para representação de compassos</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 p-3 bg-indigo-50 rounded-md border border-indigo-100">
                  <h5 className="font-medium text-indigo-800 mb-1 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    Importância nas Operações Matemáticas
                  </h5>
                  <p className="text-sm text-indigo-700">
                    A capacidade de converter entre frações mistas e impróprias é fundamental em álgebra e cálculo. 
                    Em operações como adição, subtração, multiplicação e divisão de frações, muitas vezes é mais 
                    conveniente trabalhar com frações impróprias para realizar os cálculos, e depois converter o resultado 
                    para uma fração mista para facilitar a interpretação.
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

export default ResolvedorFracoesMistas; 
