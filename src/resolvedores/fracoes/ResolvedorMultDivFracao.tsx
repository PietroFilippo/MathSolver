import React from 'react';
import { HiCalculator, HiInformationCircle } from 'react-icons/hi';
import { FractionDisplay } from '../../utils/mathUtilsFracoes';
import { useFractionMultDivSolver } from '../../hooks/fracoes/useFracaoMultDivSolver';
import StepByStepExplanation from '../../components/StepByStepExplanation';
import ConceitoMatematico from '../../components/ConceitoMatematico';

const ResolvedorMultDivFracao: React.FC = () => {
  const { 
    state, 
    dispatch, 
    handleSolve, 
    applyExample, 
    getFilteredExamples 
  } = useFractionMultDivSolver();

  return (
    <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
            <HiCalculator className="h-6 w-6 text-indigo-600 mr-2" />
            <h2 className="text-2xl font-bold">Multiplicação e Divisão de Frações </h2>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-8">
            <p className="text-gray-700 mb-6">
                Essa calculadora ajuda a resolver multiplicações e divisões de frações.
                Insira o numerador e o denominador de cada fração abaixo e escolha a operação desejada.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Fração 1
                    </label>
                    <div className="flex items-center">
                        <input
                            type="number"
                            value={state.numerator1}
                            onChange={(e) => dispatch({ type: 'SET_NUMERATOR_1', value: e.target.value })}
                            className="w-20 p-2 border border-gray-300 rounded-l-md focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Num"
                        />
                        <div className="px-2 py-2 bg-gray-100 border-t border-b border-gray-300">
                            /
                        </div>
                        <input
                            type="number"
                            value={state.denominator1}
                            onChange={(e) => dispatch({ type: 'SET_DENOMINATOR_1', value: e.target.value })}
                            className="w-20 p-2 border border-gray-300 rounded-r-md focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Den"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Fração 2
                    </label>
                    <div className="flex items-center">
                        <input
                            type="number"
                            value={state.numerator2}
                            onChange={(e) => dispatch({ type: 'SET_NUMERATOR_2', value: e.target.value })}
                            className="w-20 p-2 border border-gray-300 rounded-l-md focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Num"
                        />
                        <div className="px-2 py-2 bg-gray-100 border-t border-b border-gray-300">
                            /
                        </div>
                        <input
                            type="number"
                            value={state.denominator2}
                            onChange={(e) => dispatch({ type: 'SET_DENOMINATOR_2', value: e.target.value })}
                            className="w-20 p-2 border border-gray-300 rounded-r-md focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Den"
                        />
                    </div>
                </div>
            </div>

            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Operação
                </label>
                <div className="flex space-x-4">
                    <label className="inline-flex items-center">
                        <input
                            type="radio"
                            value="multiply"
                            checked={state.operation === 'multiply'}
                            onChange={() => dispatch({ type: 'SET_OPERATION', operation: 'multiply' })}
                            className="form-radio h-4 w-4 text-indigo-600"
                        />
                        <span className="ml-2">Multiplicação (*)</span>
                    </label>
                    <label className="inline-flex items-center">
                        <input
                            type="radio"
                            checked={state.operation === 'divide'}
                            onChange={() => dispatch({ type: 'SET_OPERATION', operation: 'divide' })}
                            className="form-radio h-4 w-4 text-indigo-600"
                        />
                        <span className="ml-2">Divisão (/)</span>
                    </label>
                </div>
            </div>

            {/* Exemplos de frações */}
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
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-md transition-colors duration-300 mt-4"
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
                {state.operation === 'multiply' ? 'O resultado da multiplicação é: ' : 'O resultado da divisão é: '}
              </p>
              {state.resultadoNum !== null && state.resultadoDen !== null && (
                <FractionDisplay 
                  numerator={state.resultadoNum} 
                  denominator={state.resultadoDen} 
                  className="text-xl"
                />
              )}
              {state.resultadoNum !== null && state.resultadoDen !== null && state.resultadoNum % state.resultadoDen === 0 && (
                <span className="ml-3">= {state.resultadoNum / state.resultadoDen}</span>
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
                    <h5 className="font-medium text-gray-800 mb-2 border-b border-gray-200 pb-1">Multiplicação e Divisão de Frações</h5>
                    <div className="space-y-3">
                      <p className="text-gray-700">
                        A multiplicação e divisão de frações são operações fundamentais que seguem regras diferentes 
                        da adição e subtração, pois não exigem um denominador comum para serem realizadas.
                      </p>
                      <div className="bg-white p-3 rounded-md border border-gray-100 shadow-sm">
                        <h6 className="text-indigo-700 font-medium mb-2">Fórmulas</h6>
                        <div className="space-y-2 text-center font-medium text-indigo-700">
                          <p>
                            <span className="font-semibold">Multiplicação:</span><br />
                            a/b × c/d = (a×c)/(b×d)
                          </p>
                          <p className="space-y-2 text-center font-medium text-indigo-700">
                            <span className="font-semibold">Divisão:</span><br />
                            a/b ÷ c/d = a/b × d/c = (a×d)/(b×c)
                          </p>
                        </div>
                      </div>
                      <div className="p-3 bg-indigo-50 rounded-md">
                        <p className="text-sm text-indigo-700">
                          <span className="font-medium">Propriedade fundamental:</span> Para dividir por uma fração, 
                          multiplicamos pela sua fração invertida (recíproco). Isso transforma a divisão em multiplicação, 
                          que é uma operação mais simples de realizar.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <h5 className="font-medium text-gray-800 mb-2 border-b border-gray-200 pb-1">Passos para a Resolução</h5>
                    <div className="bg-white p-3 rounded-md border border-gray-100 shadow-sm space-y-4">
                      <div>
                        <h6 className="text-indigo-700 font-medium mb-2">Para Multiplicação</h6>
                        <ol className="text-sm space-y-2 list-decimal pl-5 text-gray-700">
                          <li>
                            <span className="font-medium">Multiplique os numeradores</span>
                            <p className="text-xs mt-1">
                              O numerador do resultado é o produto dos numeradores das frações originais.
                            </p>
                          </li>
                          <li>
                            <span className="font-medium">Multiplique os denominadores</span>
                            <p className="text-xs mt-1">
                              O denominador do resultado é o produto dos denominadores das frações originais.
                            </p>
                          </li>
                          <li>
                            <span className="font-medium">Simplifique a fração resultante</span>
                            <p className="text-xs mt-1">
                              Encontre o MDC (Máximo Divisor Comum) entre o numerador e o denominador do resultado,
                              e divida ambos por ele para obter a fração na forma mais simples.
                            </p>
                          </li>
                        </ol>
                      </div>
                      
                      <div className="pt-3 border-t border-gray-100">
                        <h6 className="text-indigo-700 font-medium mb-2">Para Divisão</h6>
                        <ol className="text-sm space-y-2 list-decimal pl-5 text-gray-700">
                          <li>
                            <span className="font-medium">Inverta a segunda fração (o divisor)</span>
                            <p className="text-xs mt-1">
                              Troque o numerador e o denominador da segunda fração.
                            </p>
                          </li>
                          <li>
                            <span className="font-medium">Transforme a divisão em multiplicação</span>
                            <p className="text-xs mt-1">
                              Multiplique a primeira fração pela segunda fração invertida.
                            </p>
                          </li>
                          <li>
                            <span className="font-medium">Siga os passos da multiplicação</span>
                            <p className="text-xs mt-1">
                              Multiplique os numeradores e os denominadores, e então simplifique.
                            </p>
                          </li>
                        </ol>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 bg-indigo-50 p-3 rounded-md">
                  <h5 className="font-medium text-indigo-800 mb-1">Visualização Geométrica</h5>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className="bg-white p-2 rounded-md">
                      <p className="text-xs font-medium mb-1 text-indigo-700">Multiplicação de Frações como Área</p>
                      <div className="flex flex-col items-center">
                        <div className="w-full h-24 flex flex-col items-center">
                          <div className="w-full flex justify-center mb-1">
                            <div className="w-16 h-16 border border-gray-400 rounded-sm grid grid-cols-3 grid-rows-2">
                              <div className="col-span-2 row-span-1 bg-blue-200 border border-white"></div>
                              <div className="border border-white"></div>
                              <div className="border border-white"></div>
                              <div className="border border-white"></div>
                              <div className="border border-white"></div>
                            </div>
                            <div className="mx-2 flex items-center">×</div>
                            <div className="w-16 h-16 border border-gray-400 rounded-sm grid grid-cols-2 grid-rows-4">
                              <div className="col-span-1 row-span-3 bg-green-200 border border-white"></div>
                              <div className="border border-white"></div>
                              <div className="border border-white"></div>
                              <div className="border border-white"></div>
                              <div className="border border-white"></div>
                            </div>
                          </div>
                          <div className="mt-1 flex items-center">
                            <div>2/3</div>
                            <div className="mx-2">×</div>
                            <div>3/4</div>
                            <div className="mx-2">=</div>
                            <div>6/12 = 1/2</div>
                          </div>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">
                          A multiplicação 2/3 × 3/4 representa a área da interseção de um retângulo 2/3 de largura por 3/4 de altura
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-white p-2 rounded-md">
                      <p className="text-xs font-medium mb-1 text-indigo-700">Divisão como Comparação de Tamanhos</p>
                      <div className="flex flex-col items-center">
                        <div className="w-full h-24 flex flex-col items-center">
                          <div className="w-full flex justify-center mb-1">
                            <div className="w-16 h-8 border border-gray-400 rounded-sm flex">
                              <div className="w-12 h-full bg-blue-200"></div>
                            </div>
                            <div className="mx-2 flex items-center">÷</div>
                            <div className="w-16 h-8 border border-gray-400 rounded-sm flex">
                              <div className="w-8 h-full bg-green-200"></div>
                            </div>
                            <div className="mx-2 flex items-center">=</div>
                            <div className="flex items-center">1,5</div>
                          </div>
                          <div className="mt-1 flex items-center">
                            <div>3/4</div>
                            <div className="mx-2">÷</div>
                            <div>1/2</div>
                            <div className="mx-2">=</div>
                            <div>3/2</div>
                          </div>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">
                          A divisão 3/4 ÷ 1/2 responde: "quantas vezes 1/2 cabe em 3/4?" (resposta: 1,5 vezes)
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-3 rounded-md border border-gray-100 shadow-sm">
                    <h5 className="font-medium text-gray-800 mb-2">Exemplos Detalhados</h5>
                    <div className="space-y-3">
                      <div className="p-2 bg-indigo-50 rounded-md">
                        <p className="text-sm text-indigo-700 font-medium mb-1">
                          Multiplicação Simplificada: 2/5 × 10/3
                        </p>
                        <div className="text-xs text-gray-700 space-y-1.5">
                          <p className="text-gray-500">Simplificando antes de multiplicar:</p>
                          <p>1. Identificar e cancelar fatores comuns: <span className="line-through">2</span>/5 × 10/<span className="line-through">3</span> = 1/5 × 10/1 = 2</p>
                          <p>2. O fator 2 do numerador cancela com um fator do 10: 2/5 × 10/3 = 1/5 × 10/3 = 2/3</p>
                          <p className="font-medium">Resultado simplificado: 2/5 × 10/3 = 4/3 = 1⅓</p>
                        </div>
                      </div>
                      
                      <div className="p-2 bg-purple-50 rounded-md">
                        <p className="text-sm text-purple-700 font-medium mb-1">
                          Divisão com Números Negativos: -3/4 ÷ 2/5
                        </p>
                        <div className="text-xs text-gray-700 space-y-1.5">
                          <p>1. Inverter o divisor: -3/4 ÷ 2/5 = -3/4 × 5/2</p>
                          <p>2. Multiplicar: -3/4 × 5/2 = (-3 × 5)/(4 × 2) = -15/8</p>
                          <p>3. Manter o sinal negativo: -15/8 = -1⅞</p>
                          <p className="font-medium">Resultado: -3/4 ÷ 2/5 = -15/8 = -1⅞</p>
                        </div>
                      </div>
                      
                      <div className="p-2 bg-green-50 rounded-md">
                        <p className="text-sm text-green-700 font-medium mb-1">
                          Multiplicação de Fração por Inteiro: 3/5 × 15
                        </p>
                        <div className="text-xs text-gray-700 space-y-1.5">
                          <p>1. Converter o inteiro para fração: 15 = 15/1</p>
                          <p>2. Multiplicar: 3/5 × 15/1 = (3 × 15)/(5 × 1) = 45/5 = 9</p>
                          <p>3. Também podemos simplificar: 3/5 × 15 = 3/5 × 15 = 3 × 3 = 9</p>
                          <p className="font-medium">Resultado: 3/5 × 15 = 9</p>
                        </div>
                      </div>
                      
                      <div className="p-2 bg-amber-50 rounded-md">
                        <p className="text-sm text-amber-700 font-medium mb-1">
                          Divisão de Inteiro por Fração: 4 ÷ 2/3
                        </p>
                        <div className="text-xs text-gray-700 space-y-1.5">
                          <p>1. Converter o inteiro para fração: 4 = 4/1</p>
                          <p>2. Inverter o divisor: 4/1 ÷ 2/3 = 4/1 × 3/2</p>
                          <p>3. Multiplicar: 4/1 × 3/2 = (4 × 3)/(1 × 2) = 12/2 = 6</p>
                          <p className="font-medium">Resultado: 4 ÷ 2/3 = 6</p>
                        </div>
                      </div>
                      
                      <div className="p-2 bg-blue-50 rounded-md">
                        <p className="text-sm text-blue-700 font-medium mb-1">
                          Aplicação: Receita para Mais Pessoas
                        </p>
                        <div className="text-xs text-gray-700 space-y-1.5">
                          <p>Problema: Uma receita para 3 pessoas usa 2/3 de xícara de farinha. Quanto é necessário para 8 pessoas?</p>
                          <p>1. Estabelecer a proporção: se 3 pessoas → 2/3 xícara, então 8 pessoas → x</p>
                          <p>2. Calcular: x = (8 pessoas × 2/3 xícara) ÷ 3 pessoas</p>
                          <p>3. Simplificar: x = 8/3 × 2/3 = 16/9 xícaras ≈ 1,78 xícaras</p>
                          <p className="font-medium">Resultado: Aproximadamente 1¾ xícaras de farinha</p>
                        </div>
                      </div>
                      
                      <div className="p-2 bg-rose-50 rounded-md">
                        <p className="text-sm text-rose-700 font-medium mb-1">
                          Multiplicação de Frações Mistas: 2½ × 1¾
                        </p>
                        <div className="text-xs text-gray-700 space-y-1.5">
                          <p>1. Converter para frações impróprias: 2½ = 5/2 e 1¾ = 7/4</p>
                          <p>2. Multiplicar: 5/2 × 7/4 = (5 × 7)/(2 × 4) = 35/8</p>
                          <p>3. Simplificação cruzada (alternativa): </p>
                          <p className="pl-3">5/2 × 7/4 = (5 × 7)/(2 × 4) = 35/8</p>
                          <p>4. Converter para número misto: 35/8 = 4⅜</p>
                          <p className="font-medium">Resultado: 2½ × 1¾ = 4⅜</p>
                        </div>
                      </div>
                      
                      <div className="p-2 bg-teal-50 rounded-md">
                        <p className="text-sm text-teal-700 font-medium mb-1">
                          Aplicação: Escala em Mapa
                        </p>
                        <div className="text-xs text-gray-700 space-y-1.5">
                          <p>Problema: Um mapa está na escala 1:5000. Se a distância no mapa é 3/4 cm, qual é a distância real?</p>
                          <p>1. Estabelecer a relação: 1 cm no mapa = 5000 cm na realidade</p>
                          <p>2. Calcular: Distância real = 3/4 cm × 5000</p>
                          <p>3. Multiplicar: 3/4 × 5000 = 3750 cm = 37,5 m</p>
                          <p>4. Converter para unidades mais adequadas: 37,5 metros</p>
                          <p className="font-medium">Resultado: A distância real é 37,5 metros</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    <div className="bg-blue-50 p-3 rounded-md border border-blue-100 shadow-sm">
                      <h5 className="font-medium text-blue-800 mb-2">Propriedades Importantes</h5>
                      <div className="space-y-3 text-sm">
                        <div className="bg-white p-2 rounded-md">
                          <p className="font-medium text-gray-700">Propriedade Comutativa da Multiplicação</p>
                          <p className="text-xs text-gray-600 mt-1">
                            a/b × c/d = c/d × a/b
                          </p>
                          <p className="text-xs text-gray-600 mt-1">
                            Exemplo: 3/4 × 2/5 = 2/5 × 3/4 = 6/20 = 3/10
                          </p>
                        </div>
                        
                        <div className="bg-white p-2 rounded-md">
                          <p className="font-medium text-gray-700">Propriedade Associativa da Multiplicação</p>
                          <p className="text-xs text-gray-600 mt-1">
                            (a/b × c/d) × e/f = a/b × (c/d × e/f)
                          </p>
                          <p className="text-xs text-gray-600 mt-1">
                            A ordem de agrupamento não altera o resultado final
                          </p>
                        </div>
                        
                        <div className="bg-white p-2 rounded-md">
                          <p className="font-medium text-gray-700">Elemento Neutro da Multiplicação</p>
                          <p className="text-xs text-gray-600 mt-1">
                            a/b × 1 = a/b
                          </p>
                          <p className="text-xs text-gray-600 mt-1">
                            Multiplicar qualquer fração por 1 não altera seu valor
                          </p>
                        </div>
                        
                        <div className="bg-white p-2 rounded-md">
                          <p className="font-medium text-gray-700">Recíproco ou Inverso Multiplicativo</p>
                          <p className="text-xs text-gray-600 mt-1">
                            a/b × b/a = 1
                          </p>
                          <p className="text-xs text-gray-600 mt-1">
                            O produto de uma fração pelo seu recíproco é sempre 1
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-yellow-50 p-3 rounded-md border-l-4 border-yellow-400">
                      <h5 className="font-medium text-yellow-800 mb-2">Dicas e Truques</h5>
                      <ul className="text-sm space-y-1 list-disc pl-4 text-gray-700">
                        <li>Antes de multiplicar, verifique se é possível simplificar elementos cruzados (fatores comuns entre numerador de uma fração e denominador de outra)</li>
                        <li>Lembre-se que qualquer número dividido por 1 permanece inalterado</li>
                        <li>Divisão por uma fração é o mesmo que multiplicação pelo seu recíproco</li>
                        <li>Ao multiplicar frações, o resultado será sempre menor que as frações originais (exceto com frações impróprias)</li>
                        <li>Ao dividir por uma fração menor que 1, o resultado será maior que a fração original</li>
                      </ul>
                    </div>
                    
                    <div className="bg-green-50 p-3 rounded-md border border-green-100">
                      <h5 className="font-medium text-green-800 mb-2">Aplicações no Mundo Real</h5>
                      <ul className="text-sm space-y-1 list-disc pl-4 text-gray-700">
                        <li>Ajuste de receitas (metade de 2/3 de xícara)</li>
                        <li>Cálculos de escala em mapas e projetos</li>
                        <li>Divisão proporcional em finanças</li>
                        <li>Cálculos de taxas e juros</li>
                        <li>Problemas de razão e proporção</li>
                        <li>Análises de probabilidades compostas</li>
                      </ul>
                    </div>
                    
                    <div className="bg-white p-3 rounded-md border border-gray-100 shadow-sm">
                      <h5 className="font-medium text-gray-800 mb-2">Casos Especiais</h5>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="bg-purple-50 p-2 rounded-md">
                          <p className="font-medium text-purple-700 mb-1">Multiplicação por Zero</p>
                          <p className="text-xs text-gray-700">
                            Qualquer fração multiplicada por zero resulta em zero:<br/>
                            • (a/b) × 0 = 0<br/>
                            • (a/b) × (0/c) = 0/bc = 0
                          </p>
                        </div>
                        <div className="bg-amber-50 p-2 rounded-md">
                          <p className="font-medium text-amber-700 mb-1">Divisão por Zero</p>
                          <p className="text-xs text-gray-700">
                            A divisão por zero é indefinida:<br/>
                            • (a/b) ÷ 0 → não existe<br/>
                            • (a/b) ÷ (0/c) → não existe
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
            
                <div className="mt-4 p-3 bg-indigo-50 rounded-md border border-indigo-100">
                  <h5 className="font-medium text-indigo-800 mb-1 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    Conceitos Avançados
                  </h5>
                  <p className="text-sm text-indigo-700">
                    A multiplicação e divisão de frações são a base para o trabalho com expressões algébricas fracionárias, 
                    equações racionais e funções racionais. Essas operações também são essenciais para entender conceitos 
                    como proporção direta e inversa, taxas de variação e integração por substituição no cálculo avançado.
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

export default ResolvedorMultDivFracao;