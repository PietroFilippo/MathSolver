import React, { useState } from 'react';
import { HiCalculator, HiX, HiInformationCircle } from 'react-icons/hi';
import { useInequacoesSolver } from '../../hooks/algebra/inequacoesAlgebricas';
import StepByStepExplanation from '../../components/StepByStepExplanation';
import ConceitoMatematico from '../../components/ConceitoMatematico';

const ResolvedorInequacoes: React.FC = () => {
  const [showLimitations, setShowLimitations] = useState(false);
  
  const { 
    state, 
    dispatch, 
    getExamples,
    applyExample,
    handleSolve,
    conceitoInequacoes
  } = useInequacoesSolver();
  
  // Função para renderizar o resultado formatado
  const renderFormattedResult = () => {
    if (!state.resultado) return null;
    
    return (
      <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-5">
        <h3 className="text-lg font-medium text-green-800 dark:text-green-300 mb-2">Resultado</h3>
        <p className="text-xl text-gray-800 dark:text-gray-200">
          {state.operacao === 'resolver' 
            ? 'A solução da inequação é:' 
            : 'Verificação:'}
        </p>
        <p className="text-xl font-bold mt-2 text-gray-800 dark:text-gray-200">
          {state.resultado}
        </p>
        
        {state.intervaloSolucao && (
          <p className="text-lg mt-2 text-gray-700 dark:text-gray-300">
            <span className="font-medium">Notação de intervalo:</span> {state.intervaloSolucao}
          </p>
        )}
        
        <button 
          onClick={() => dispatch({ type: 'TOGGLE_EXPLANATION' })}
          className="mt-4 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 text-sm font-medium flex items-center"
        >
          <HiCalculator className="h-5 w-5 mr-1" />
          {state.showExplanation ? "Ocultar explicação" : "Mostrar explicação"}
        </button>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <HiCalculator className="h-6 w-6 text-indigo-600 dark:text-indigo-400 mr-2" />
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Resolução de Inequações</h2>
      </div>
      
      <div className="resolver-container p-6 mb-8">
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          Esta calculadora permite resolver inequações e verificar se um determinado valor satisfaz uma inequação.
          Insira uma inequação e escolha o tipo de operação desejada.
        </p>
        
        <div className="mb-4">
          <div className="mb-4">
            <label htmlFor="inequacao" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Inequação
            </label>
            <input
              type="text"
              id="inequacao"
              value={state.inequacao}
              onChange={(e) => dispatch({ type: 'SET_INEQUACAO', value: e.target.value })}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400"
              placeholder="Ex: 2x + 3 < 7 ou x² - 4 ≤ 0"
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Use os símbolos &lt;, &gt;, ≤, ≥ para expressar sua inequação. Use x como a variável principal.
            </p>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Operação
            </label>
            <div className="flex flex-wrap items-center space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio text-indigo-600 dark:text-indigo-400"
                  checked={state.operacao === 'resolver'}
                  onChange={() => dispatch({ type: 'SET_OPERACAO', operacao: 'resolver' })}
                />
                <span className="ml-2 text-gray-700 dark:text-gray-300">Resolver inequação</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio text-indigo-600 dark:text-indigo-400"
                  checked={state.operacao === 'verificarSolucao'}
                  onChange={() => dispatch({ type: 'SET_OPERACAO', operacao: 'verificarSolucao' })}
                />
                <span className="ml-2 text-gray-700 dark:text-gray-300">Verificar valor</span>
              </label>
            </div>
          </div>
          
          {state.operacao === 'resolver' && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tipo de Inequação
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => dispatch({ type: 'SET_TIPO_INEQUACAO', tipoInequacao: 'linear' })}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                    state.tipoInequacao === 'linear' 
                      ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-700' 
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  Linear (ax + b)
                </button>
                <button
                  onClick={() => dispatch({ type: 'SET_TIPO_INEQUACAO', tipoInequacao: 'quadratica' })}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                    state.tipoInequacao === 'quadratica' 
                      ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-700' 
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  Quadrática (ax² + bx + c)
                </button>
                <button
                  onClick={() => dispatch({ type: 'SET_TIPO_INEQUACAO', tipoInequacao: 'racional' })}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                    state.tipoInequacao === 'racional' 
                      ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-700' 
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  Racional (P(x)/Q(x))
                </button>
                <button
                  onClick={() => dispatch({ type: 'SET_TIPO_INEQUACAO', tipoInequacao: 'modulo' })}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                    state.tipoInequacao === 'modulo' 
                      ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-700' 
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  Módulo (|ax + b|)
                </button>
              </div>
            </div>
          )}
          
          {state.operacao === 'verificarSolucao' && (
            <div className="mb-4">
              <label htmlFor="valorVerificar" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Valor para verificar
              </label>
              <input
                type="text"
                id="valorVerificar"
                value={state.valorVerificar}
                onChange={(e) => dispatch({ type: 'SET_VALOR_VERIFICAR', value: e.target.value })}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400"
                placeholder="Ex: 2.5"
              />
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Insira o valor que deseja verificar se satisfaz a inequação.
              </p>
            </div>
          )}
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Exemplos de Inequações
            </label>
            
            <div className="flex flex-wrap gap-2">
              {getExamples().map((example: string, index: number) => (
                <button
                  key={index}
                  onClick={() => applyExample(example, state.tipoInequacao)}
                  className="px-3 py-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm rounded-full transition-colors"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
          
          {state.showDisclaimer && (
            <div className="mt-3 mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md relative">
              <button 
                onClick={() => dispatch({ type: 'TOGGLE_DISCLAIMER' })}
                className="absolute top-2 right-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400"
                aria-label="Fechar aviso"
              >
                <HiX className="h-5 w-5" />
              </button>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                <strong>Nota:</strong> Esta calculadora é otimizada para inequações lineares e quadráticas. 
                O suporte para inequações racionais e com módulo é limitado. Para casos complexos, 
                o sistema pode não conseguir gerar uma solução completa.
                Além disso, escolha apropriadamente o tipo de inequação que quer resolver de acordo com os botões disponíveis.
                Ou seja, para lineares aperte o botão "Linear", e assim por diante.
              </p>
            </div>
          )}
          
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={handleSolve}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
            >
              {state.operacao === 'resolver' ? 'Resolver Inequação' : 'Verificar Valor'}
            </button>
            
            <button
              onClick={() => setShowLimitations(!showLimitations)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
            >
              <HiInformationCircle className="mr-2 h-5 w-5 text-indigo-500 dark:text-indigo-400" />
              {showLimitations ? "Ocultar limitações" : "Ver limitações"}
            </button>
          </div>
          
          {showLimitations && (
            <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md">
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-3 flex items-center">
                <HiInformationCircle className="mr-2 h-5 w-5 text-indigo-500 dark:text-indigo-400" />
                Limitações do Resolvedor de Inequações
              </h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-red-600 dark:text-red-400 mb-2">Características sem suporte:</h4>
                  <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300 space-y-1 text-sm">
                    <li>Inequações com múltiplas variáveis</li>
                    <li>Inequações com coeficientes complexos ou não numéricos</li>
                    <li>Sistemas de inequações (múltiplas condições simultâneas)</li>
                    <li>Inequações com funções trigonométricas, logarítmicas ou exponenciais</li>
                    <li>Inequações de grau superior a 2 (exceto em casos específicos)</li>
                    <li>Análise completa de inequações racionais complexas</li>
                    <li>Inequações com módulos aninhados ou múltiplos módulos</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium text-yellow-600 dark:text-yellow-400 mb-2">Características com suporte limitado:</h4>
                  <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300 space-y-1 text-sm">
                    <li>Inequações racionais simples (apenas casos bem estruturados)</li>
                    <li>Inequações com módulo (suporte básico para &#124;ax + b&#124; &lt; c e formas similares)</li>
                    <li>Expressões muito complexas ou com muitos termos</li>
                    <li>Inequações que requerem métodos especiais de resolução</li>
                    <li>Inequações com parametrização</li>
                  </ul>
                </div>
                
                <div className="text-sm text-gray-600 dark:text-gray-400 italic">
                  O calculador é eficaz para inequações lineares e quadráticas comuns, incluindo a expressão da solução em notação de intervalo. 
                  Para casos mais complexos, pode fornecer uma solução parcial ou um guia para os primeiros passos do processo de resolução.
                </div>
              </div>
            </div>
          )}
        </div>
        
        {state.erro && (
          <div className="p-3 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-md mb-4 border border-red-200 dark:border-red-800">
            {state.erro}
          </div>
        )}
      </div>
      
      {state.resultado && (
        <div className="space-y-6">
          {renderFormattedResult()}
          
          {state.showExplanation && state.passos.length > 0 && (
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center">
                  <HiCalculator className="h-6 w-6 mr-2 text-indigo-600 dark:text-indigo-400" />
                  Solução passo a passo
                </h3>
              </div>
    
              <StepByStepExplanation 
                steps={state.passos} 
                stepType="linear" 
              />

              <ConceitoMatematico
                title="Conceito Matemático: Inequações"
                isOpen={state.showConceitoMatematico}
                onToggle={() => dispatch({ type: 'TOGGLE_CONCEITO_MATEMATICO' })}
              >
                <p className="text-gray-700 dark:text-gray-300 mb-4">{conceitoInequacoes.descricao}</p>
                
                <div className="space-y-6">
                  {conceitoInequacoes.categorias.map((categoria, categoriaIndex) => (
                    <div key={categoriaIndex} className="space-y-3">
                      <h5 className="text-lg font-medium text-indigo-700 dark:text-indigo-300 border-b border-indigo-100 dark:border-indigo-700 pb-1">
                        {categoria.nome}
                      </h5>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {categoria.regras.map((regra, regraIndex) => (
                          <div 
                            key={regraIndex} 
                            className={`p-3 rounded-md border-l-4 shadow-sm
                              ${regra.corDestaque === 'blue' ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-400 dark:border-blue-600' :
                                regra.corDestaque === 'green' ? 'bg-green-50 dark:bg-green-900/20 border-green-400 dark:border-green-600' :
                                regra.corDestaque === 'purple' ? 'bg-purple-50 dark:bg-purple-900/20 border-purple-400 dark:border-purple-600' :
                                regra.corDestaque === 'amber' ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-400 dark:border-amber-600' :
                                regra.corDestaque === 'cyan' ? 'bg-cyan-50 dark:bg-cyan-900/20 border-cyan-400 dark:border-cyan-600' :
                                regra.corDestaque === 'red' ? 'bg-red-50 dark:bg-red-900/20 border-red-400 dark:border-red-600' : 
                                'bg-gray-50 dark:bg-gray-900/20 border-gray-400 dark:border-gray-600'
                              }`
                            }
                          >
                            {regra.nome && (
                              <h6 className={`font-semibold mb-1
                                ${regra.corDestaque === 'blue' ? 'text-blue-700 dark:text-blue-300' :
                                  regra.corDestaque === 'green' ? 'text-green-700 dark:text-green-300' :
                                  regra.corDestaque === 'purple' ? 'text-purple-700 dark:text-purple-300' :
                                  regra.corDestaque === 'amber' ? 'text-amber-700 dark:text-amber-300' :
                                  regra.corDestaque === 'cyan' ? 'text-cyan-700 dark:text-cyan-300' :
                                  regra.corDestaque === 'red' ? 'text-red-700 dark:text-red-300' :
                                  'text-gray-700 dark:text-gray-300'
                                }`
                              }>
                                {regra.nome}
                              </h6>
                            )}
                            
                            {regra.formula && (
                              <div className="bg-white dark:bg-gray-700 p-2 rounded border border-gray-200 dark:border-gray-600 mb-2 font-medium text-gray-800 dark:text-gray-200">
                                {regra.formula}
                              </div>
                            )}
                            
                            <p className="text-gray-700 dark:text-gray-300 text-sm">{regra.explicacao}</p>
                            
                            {regra.exemplo && (
                              <div className="mt-2 text-sm">
                                <span className="font-medium text-gray-700 dark:text-gray-300">Exemplo: </span>
                                <span className="font-mono bg-white dark:bg-gray-700 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">{regra.exemplo}</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-md border-l-4 border-indigo-300 dark:border-indigo-600">
                  <h5 className="font-medium text-indigo-700 dark:text-indigo-300 mb-2">Importância das Inequações</h5>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    As inequações são fundamentais na matemática e suas aplicações, permitindo modelar 
                    restrições, limites e intervalos em situações do mundo real. São essenciais em problemas 
                    de otimização, programação linear, análise de regiões de viabilidade e na definição de 
                    domínios de funções. Inequações aparecem em diversos campos como economia, engenharia, 
                    física e estatística, onde precisamos analisar quando quantidades são maiores, menores 
                    ou iguais a determinados valores críticos.
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

export default ResolvedorInequacoes;
