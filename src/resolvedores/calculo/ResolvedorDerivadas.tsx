import React, { useState } from 'react';
import { HiCalculator, HiX, HiChevronDown, HiChevronUp } from 'react-icons/hi';
import { generateDerivativeSteps, derivativesMathematicalConcept } from '../../utils/mathUtilsCalculo/mathUtilsCalculoDerivada';
import { getDerivativesExamples } from '../../utils/mathUtilsCalculo/mathUtilsCalculoGeral';

// Adiciona interface para as regras de derivação
interface ruleDerivative {
  nome: string;
  formula?: string;
  explicacao: string;
  exemplo?: string;
  corDestaque: string;
}

interface categoryDerivative {
  nome: string;
  regras: ruleDerivative[];
}

interface DerivadaConceito {
  titulo: string;
  descricao: string;
  categorias: categoryDerivative[];
}

const ResolvedorDerivadas: React.FC = () => {
  // Typecast o objeto importado para a interface
  const conceitoDerivadas = derivativesMathematicalConcept as DerivadaConceito;
  
  const [funcao, setFuncao] = useState<string>('');
  const [variable, setVariable] = useState<string>('x');
  const [order, setOrder] = useState<string>('1');
  const [result, setResult] = useState<string | null>(null);
  const [steps, setSteps] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState<boolean>(true);
  const [showDisclaimer, setShowDisclaimer] = useState<boolean>(true);
  const [showConceitoMatematico, setShowConceitoMatematico] = useState<boolean>(true);

  const handleSolve = () => {
    // Limpar resultados anteriores
    setError(null);
    setSteps([]);
    setResult(null);
    
    // Validar entrada
    if (!funcao.trim()) {
      setError('Por favor, insira uma função para derivar.');
      return;
    }
    
    if (!variable.trim()) {
      setError('Por favor, especifique a variável de derivação.');
      return;
    }
    
    // Validar ordem da derivada
    const orderNum = parseInt(order);
    if (isNaN(orderNum) || orderNum < 1) {
      setError('A ordem da derivada deve ser um número inteiro positivo.');
      return;
    }
    
    try {
      // Calcular a derivada usando as funções utilitárias
      const resultadoDerivada = generateDerivativeSteps(funcao, variable, orderNum);
      
      // Atualizar o estado com o resultado e os passos
      setResult(resultadoDerivada.resultado);
      setSteps(resultadoDerivada.passos);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Ocorreu um erro ao calcular a derivada.');
      }
    }
  };

  // Função que gera os passos com numeração dinâmica para exibição
  const renderExplanationSteps = () => {
    let stepCount = 1;
    return (
      <div className="space-y-4">
        {steps.map((step, index) => {
          // Verificar se o passo já possui um prefixo de "Calculando a X derivada"
          const calculatingMatch = step.match(/^(Calculando a \d+ª derivada:)(.*)$/);
          
          // Verificar se o passo contém uma separação entre derivadas
          if (step.startsWith('-----')) {
            return (
              <div key={index} className="border-t-2 border-indigo-100 my-4 pt-2 text-center text-indigo-400 text-sm font-medium">
                {step}
              </div>
            );
          }
          
          // Verificar se o passo é uma aplicação de regra de derivação
          const rulesMatch = step.match(/^(Aplicando a regra d[aeoi] .+:)(.*)$/);
          
          // Verificar se o passo é uma expressão original ou resultado
          const expressionMatch = step.match(/^(Expressão original:|Resultado da .+:)(.*)$/);
          
          if (calculatingMatch) {
            const [_, stepHeader] = calculatingMatch;
            return (
              <div key={index} className="p-4 bg-gray-50 rounded-md border-l-4 border-indigo-500">
                <div className="flex flex-col sm:flex-row">
                  <span className="font-bold text-indigo-700 mr-2 mb-1 sm:mb-0">
                    {`Passo ${stepCount++}:`}
                  </span>
                  <p className="text-gray-800">{stepHeader}</p>
                </div>
              </div>
            );
          } else if (rulesMatch) {
            const [_, ruleHeader, ruleContent] = rulesMatch;
            return (
              <div key={index} className="p-3 bg-indigo-50 rounded-md ml-4 border-l-2 border-indigo-300">
                <p className="text-indigo-700 font-medium">{ruleHeader}</p>
                {ruleContent && <p className="text-gray-700 mt-1">{ruleContent}</p>}
              </div>
            );
          } else if (expressionMatch) {
            const [_, expressionHeader, expressionContent] = expressionMatch;
            return (
              <div key={index} className="p-3 bg-blue-50 rounded-md ml-4 border-l-2 border-blue-300">
                <div className="flex flex-col">
                  <span className="font-medium text-blue-700">{expressionHeader}</span>
                  <span className="text-gray-800 mt-1 text-lg">{expressionContent}</span>
                </div>
              </div>
            );
          } else if (step.startsWith('Onde ')) {
            // Passo que explica os termos
            return (
              <div key={index} className="p-2 bg-gray-50 rounded-md ml-8 text-sm text-gray-600 italic">
                {step}
              </div>
            );
          } else if (step.startsWith('Para a expressão')) {
            // Passo que introduz a regra da cadeia
            return (
              <div key={index} className="p-3 bg-yellow-50 rounded-md ml-4 border-l-2 border-yellow-300">
                <p className="text-yellow-700">{step}</p>
              </div>
            );
          } else if (step.startsWith('Vamos calcular')) {
            // Introdução a sub-cálculos
            return (
              <div key={index} className="p-2 bg-green-50 rounded-md ml-4 text-green-700 font-medium">
                {step}
              </div>
            );
          } else if (step.match(/^[1-9]\) Para/)) {
            // Sub-cálculos numerados
            return (
              <div key={index} className="p-2 bg-gray-50 rounded-md ml-6 text-gray-700 border-l-2 border-gray-300">
                <p className="font-medium">{step}</p>
              </div>
            );
          } else {
            // Conteúdo regular sem prefixo de passo
            return (
              <div key={index} className="p-3 bg-white border border-gray-200 rounded-md ml-4">
                <p className="text-gray-800">{step}</p>
              </div>
            );
          }
        })}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <HiCalculator className="h-6 w-6 text-indigo-600 mr-2" />
        <h2 className="text-2xl font-bold">Cálculo de Derivadas</h2>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-8">
        <p className="text-gray-700 mb-6">
          Esta calculadora permite obter a derivada de uma função. Insira a função, a variável 
          e a ordem da derivada desejada.
        </p>
        
        <div className="mb-4">
          <div className="mb-4">
            <label htmlFor="funcao" className="block text-sm font-medium text-gray-700 mb-1">
              Função
            </label>
            <input
              type="text"
              id="funcao"
              value={funcao}
              onChange={(e) => setFuncao(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
              placeholder="Ex: x^2 + 3x - 5 ou sin(x)*e^x"
            />
            <p className="text-sm text-gray-500 mt-1">
              Use operadores como +, -, *, /, ^. O símbolo * para multiplicação é opcional para expressões como 3x. Funções disponíveis: sin, cos, tan, log, ln, e^x, etc.
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-4">
            <div>
              <label htmlFor="variavel" className="block text-sm font-medium text-gray-700 mb-1">
                Variável
              </label>
              <input
                type="text"
                id="variable"
                value={variable}
                onChange={(e) => setVariable(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
              />
            </div>
            
            <div>
              <label htmlFor="ordem" className="block text-sm font-medium text-gray-700 mb-1">
                Ordem da Derivada
              </label>
              <input
                type="number"
                id="order"
                value={order}
                onChange={(e) => setOrder(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
                min="1"
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Exemplos
            </label>
            <div className="flex flex-wrap gap-2">
              {getDerivativesExamples().map((exemple, index) => (
                <button
                  key={index}
                  onClick={() => setFuncao(exemple)}
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-full transition-colors"
                >
                  {exemple}
                </button>
              ))}
            </div>
          </div>
          
          {showDisclaimer && (
            <div className="mt-3 mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md relative">
              <button 
                onClick={() => setShowDisclaimer(false)}
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                aria-label="Fechar aviso"
              >
                <HiX className="h-5 w-5" />
              </button>
              <p className="text-sm text-yellow-700">
                <strong>Nota:</strong> Em muitos casos, os resultados podem não estar totalmente simplificados. 
                O sistema aplica algumas regras de simplificação, mas expressões complexas podem 
                requerer simplificações algébricas adicionais.
              </p>
            </div>
          )}
          
          <button
            onClick={handleSolve}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Calcular Derivada
          </button>
        </div>
        
        {error && (
          <div className="p-3 bg-red-100 text-red-700 rounded-md mb-4">
            {error}
          </div>
        )}
      </div>
      
      {result && (
        <div className="space-y-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-5">
            <h3 className="text-lg font-medium text-green-800 mb-2">Resultado</h3>
            <p className="text-xl">
              {`A derivada ${parseInt(order) > 1 ? `${order}ª` : ''} de ${funcao} em relação a ${variable} é:`}
            </p>
            <p className="text-xl font-bold mt-2">
              {result}
            </p>
            
            <button 
              onClick={() => setShowExplanation(!showExplanation)}
              className="mt-4 text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center"
            >
              {showExplanation ? "Ocultar explicação detalhada" : "Mostrar explicação detalhada"}
            </button>
          </div>
          
          {showExplanation && steps.length > 0 && (
            <div className="bg-white shadow-md rounded-lg p-5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800 flex items-center">
                  <HiCalculator className="h-6 w-6 mr-2 text-indigo-600" />
                  Solução passo a passo
                </h3>
              </div>
              
              {renderExplanationSteps()}
              
              <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100 overflow-hidden">
                <div className="px-4 py-3 bg-blue-100 border-b border-blue-200">
                  <h4 className="font-semibold text-blue-800 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Conceito Matemático: Derivadas
                    <button 
                      onClick={() => setShowConceitoMatematico(!showConceitoMatematico)}
                      className="ml-auto text-blue-600 hover:text-blue-800 focus:outline-none"
                      aria-label={showConceitoMatematico ? "Esconder conceito matemático" : "Mostrar conceito matemático"}
                    >
                      {showConceitoMatematico ? <HiChevronUp className="h-5 w-5" /> : <HiChevronDown className="h-5 w-5" />}
                    </button>
                  </h4>
                </div>
                
                {showConceitoMatematico && (
                  <div className="p-4">
                    <p className="text-gray-700 mb-4">{conceitoDerivadas.descricao}</p>
                    
                    <div className="space-y-6">
                      {conceitoDerivadas.categorias.map((categoria, categoriaIndex) => (
                        <div key={categoriaIndex} className="space-y-3">
                          <h5 className="text-lg font-medium text-indigo-700 border-b border-indigo-100 pb-1">
                            {categoria.nome}
                          </h5>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {categoria.regras.map((regra, regraIndex) => (
                              <div 
                                key={regraIndex} 
                                className={`p-3 rounded-md border-l-4 shadow-sm
                                  ${regra.corDestaque === 'blue' ? 'bg-blue-50 border-blue-400' :
                                    regra.corDestaque === 'green' ? 'bg-green-50 border-green-400' :
                                    regra.corDestaque === 'purple' ? 'bg-purple-50 border-purple-400' :
                                    regra.corDestaque === 'amber' ? 'bg-amber-50 border-amber-400' :
                                    regra.corDestaque === 'cyan' ? 'bg-cyan-50 border-cyan-400' :
                                    regra.corDestaque === 'red' ? 'bg-red-50 border-red-400' : 
                                    'bg-gray-50 border-gray-400'
                                  }`
                                }
                              >
                                {regra.nome && (
                                  <h6 className={`font-semibold mb-1
                                    ${regra.corDestaque === 'blue' ? 'text-blue-700' :
                                      regra.corDestaque === 'green' ? 'text-green-700' :
                                      regra.corDestaque === 'purple' ? 'text-purple-700' :
                                      regra.corDestaque === 'amber' ? 'text-amber-700' :
                                      regra.corDestaque === 'cyan' ? 'text-cyan-700' :
                                      regra.corDestaque === 'red' ? 'text-red-700' :
                                      'text-gray-700'
                                    }`
                                  }>
                                    {regra.nome}
                                  </h6>
                                )}
                                
                                {regra.formula && (
                                  <div className="bg-white p-2 rounded border border-gray-200 mb-2 font-medium">
                                    {regra.formula}
                                  </div>
                                )}
                                
                                <p className="text-gray-700 text-sm">{regra.explicacao}</p>
                                
                                {regra.exemplo && (
                                  <div className="mt-2 text-sm">
                                    <span className="font-medium">Exemplo: </span>
                                    <span className="font-mono bg-white px-1 py-0.5 rounded">{regra.exemplo}</span>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-6 bg-indigo-50 p-3 rounded-md">
                      <h5 className="font-medium text-indigo-700 mb-2">Importância das Derivadas</h5>
                      <p className="text-sm text-gray-700">
                        As derivadas são fundamentais no cálculo e possibilitam a modelagem de fenômenos 
                        que envolvem taxas de variação, como velocidade, aceleração, crescimento populacional 
                        e muitos outros. Elas permitem o estudo do comportamento local de funções, incluindo
                        a determinação de máximos e mínimos, que é essencial para problemas de otimização em diversas áreas.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ResolvedorDerivadas; 