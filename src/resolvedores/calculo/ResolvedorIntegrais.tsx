import React, { useState } from 'react';
import { HiCalculator, HiX, HiInformationCircle } from 'react-icons/hi';
import { useIntegraisSolver } from '../../hooks/calculo/integrais';
import StepByStepExplanation from '../../components/StepByStepExplanation';
import ConceitoMatematico from '../../components/ConceitoMatematico';

const ResolvedorIntegrais: React.FC = () => {
  const [showLimitations, setShowLimitations] = useState(false);
  
  const { 
    state, 
    dispatch, 
    examples, 
    handleSolve,
    conceitos
  } = useIntegraisSolver();

  // Adapter functions to match the previous API
  const getExamples = () => {
    if (state.tipoIntegral === 'indefinida') {
      return examples as string[];
    } else {
      return (examples as { funcao: string, limiteInferior: string, limiteSuperior: string }[])
        .map(ex => `${ex.funcao} [${ex.limiteInferior}, ${ex.limiteSuperior}]`);
    }
  };
  
  const applyExample = (example: string) => {
    if (state.tipoIntegral === 'indefinida') {
      dispatch({ type: 'SET_FUNCTION', funcao: example });
    } else {
      // Extract function and limits from the example (format: "function [lower_limit, upper_limit]")
      const match = example.match(/(.+) \[(.+), (.+)\]/);
      if (match && match.length === 4) {
        const [_, funcao, limiteInferior, limiteSuperior] = match;
        
        dispatch({ type: 'SET_FUNCTION', funcao: funcao.trim() });
        dispatch({ type: 'SET_LOWER_LIMIT', limiteInferior: limiteInferior.trim() });
        dispatch({ type: 'SET_UPPER_LIMIT', limiteSuperior: limiteSuperior.trim() });
      }
    }
  };
  
  const handleTipoIntegralChange = (value: 'indefinida' | 'definida') => {
    dispatch({ type: 'SET_INTEGRAL_TYPE', tipoIntegral: value });
    
    // Clear limits if changing to indefinite integral
    if (value === 'indefinida') {
      dispatch({ type: 'SET_LOWER_LIMIT', limiteInferior: '' });
      dispatch({ type: 'SET_UPPER_LIMIT', limiteSuperior: '' });
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <HiCalculator className="h-6 w-6 text-indigo-600 dark:text-indigo-400 mr-2" />
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Cálculo de Integrais</h2>
      </div>
      
      <div className="resolver-container p-6 mb-8">
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          Esta calculadora permite calcular integrais de funções. Insira a função, a variável
          de integração e escolha entre integral definida ou indefinida.
        </p>
        
        <div className="mb-4">
          <div className="mb-4">
            <label htmlFor="funcao" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Função
            </label>
            <input
              type="text"
              id="funcao"
              value={state.funcao}
              onChange={(e) => dispatch({ type: 'SET_FUNCAO', value: e.target.value })}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400"
              placeholder="Ex: x^2 + 3x - 5 ou sen(x)*e^x"
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Use operadores como +, -, *, /, ^, √. O símbolo * para multiplicação pode ter que ser explicitamente declarado em algumas expressões como x*e^x. Funções disponíveis: sen, cos, tan, log, ln, e^x, etc.
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-4">
            <div>
              <label htmlFor="variavel" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Variável
              </label>
              <input
                type="text"
                id="variavel"
                value={state.variavel}
                onChange={(e) => dispatch({ type: 'SET_VARIAVEL', value: e.target.value })}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tipo de Integral
              </label>
              <div className="flex items-center space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio text-indigo-600 dark:text-indigo-400"
                    checked={state.tipoIntegral === 'indefinida'}
                    onChange={() => handleTipoIntegralChange('indefinida')}
                  />
                  <span className="ml-2 text-gray-700 dark:text-gray-300">Indefinida</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio text-indigo-600 dark:text-indigo-400"
                    checked={state.tipoIntegral === 'definida'}
                    onChange={() => handleTipoIntegralChange('definida')}
                  />
                  <span className="ml-2 text-gray-700 dark:text-gray-300">Definida</span>
                </label>
              </div>
            </div>
          </div>
          
          {state.tipoIntegral === 'definida' && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-4">
              <div>
                <label htmlFor="limiteInferior" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Limite Inferior
                </label>
                <input
                  type="text"
                  id="limiteInferior"
                  value={state.limiteInferior}
                  onChange={(e) => dispatch({ type: 'SET_LIMITE_INFERIOR', value: e.target.value })}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400"
                />
              </div>
              
              <div>
                <label htmlFor="limiteSuperior" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Limite Superior
                </label>
                <input
                  type="text"
                  id="limiteSuperior"
                  value={state.limiteSuperior}
                  onChange={(e) => dispatch({ type: 'SET_LIMITE_SUPERIOR', value: e.target.value })}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400"
                />
              </div>
            </div>
          )}
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Exemplos
            </label>
            <div className="flex flex-wrap gap-2">
              {getExamples().map((example: string, index: number) => {
                // Para exemplos de integrais definidas, vamos formatá-los melhor
                if (state.tipoIntegral === 'definida') {
                  const match = example.match(/(.+) \[(.+), (.+)\]/);
                  if (match && match.length === 4) {
                    const [_, funcao, limiteInferior, limiteSuperior] = match;
                    return (
                      <button
                        key={index}
                        onClick={() => applyExample(example)}
                        className="px-3 py-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm rounded-full transition-colors flex items-center"
                      >
                        <span className="text-xs text-indigo-600 dark:text-indigo-400 mr-1 font-semibold">{limiteSuperior}</span>
                        <span className="mr-1">∫</span>
                        <span>{funcao}</span>
                        <span className="mx-1">dx</span>
                        <span className="text-xs text-indigo-600 dark:text-indigo-400 ml-1 font-semibold">{limiteInferior}</span>
                      </button>
                    );
                  }
                }
                // Formato padrão para integrais indefinidas
                return (
                  <button
                    key={index}
                    onClick={() => applyExample(example)}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm rounded-full transition-colors"
                  >
                    {example}
                  </button>
                );
              })}
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
                <strong>Nota:</strong> Em muitos casos, os resultados podem não estar totalmente simplificados. 
                O sistema aplica algumas regras de simplificação, mas expressões complexas podem 
                requerer simplificações algébricas adicionais. Além disso, integrais são fundamentalmente mais complexas que derivadas.
                Por isso, o sistema pode não ser capaz de resolver todas as integrais.
              </p>
            </div>
          )}
          
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={handleSolve}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
            >
              Calcular Integral
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
                Limitações do Calculador de Integrais
              </h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-red-600 dark:text-red-400 mb-2">Integrais sem suporte:</h4>
                  <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300 space-y-1 text-sm">
                    <li>Substituição geral (apenas casos específicos são implementados)</li>
                    <li>Funções racionais complexas (além de padrões simples)</li>
                    <li>Produtos e potências trigonométricas gerais (ex: sin^n(x)*cos^m(x))</li>
                    <li>Funções hiperbólicas (sinh, cosh, tanh)</li>
                    <li>Funções especiais (função erro, funções de Bessel, etc.)</li>
                    <li>Integrais não-elementares (e^(-x²), sin(x)/x, ln(ln(x)))</li>
                    <li>Integrais no plano complexo</li>
                    <li>Integrais impróprias (com limites infinitos)</li>
                    <li>Funções definidas por partes</li>
                    <li>Funções dependentes de integrais (equações diferenciais)</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium text-yellow-600 dark:text-yellow-400 mb-2">Integrais com suporte limitado:</h4>
                  <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300 space-y-1 text-sm">
                    <li>Frações parciais (apenas casos simples)</li>
                    <li>Integração por partes (apenas padrões específicos como x*sin(x))</li>
                    <li>Funções racionais (apenas quando grau do numerador &lt; denominador)</li>
                    <li>Funções compostas aninhadas</li>
                    <li>Substituições trigonométricas (detecção básica de padrões)</li>
                  </ul>
                </div>
                
                <div className="text-sm text-gray-600 dark:text-gray-400 italic">
                  Qualquer integral que não corresponda aos padrões implementados retornará um resultado genérico como "integral(expressão)".
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
          <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-5">
            <h3 className="text-lg font-medium text-green-800 dark:text-green-300 mb-2">Resultado</h3>
            <p className="text-xl text-gray-800 dark:text-gray-200">
              {state.tipoIntegral === 'indefinida' 
                ? `A integral indefinida de ${state.funcao} em relação a ${state.variavel} é:`
                : `A integral definida de ${state.funcao} de ${state.limiteInferior} a ${state.limiteSuperior} em relação a ${state.variavel} é:`
              }
            </p>
            <p className="text-xl font-bold mt-2 text-gray-800 dark:text-gray-200">
              {state.resultado}
            </p>
            
            <button 
              onClick={() => dispatch({ type: 'TOGGLE_EXPLANATION' })}
              className="mt-4 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 text-sm font-medium flex items-center"
            >
              <HiCalculator className="h-5 w-5 mr-1" />
              {state.showExplanation ? "Ocultar explicação detalhada" : "Mostrar explicação detalhada"}
            </button>
          </div>
          
          {state.showExplanation && state.passos.length > 0 && (
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center">
                  <HiCalculator className="h-6 w-6 mr-2 text-indigo-600 dark:text-indigo-400" />
                  Solução passo a passo
                </h3>
              </div>
              
                <StepByStepExplanation steps={state.passos} stepType="calculus" />
                
              <ConceitoMatematico
                title="Conceito Matemático: Integrais"
                isOpen={state.showConceitoMatematico}
                onToggle={() => dispatch({ type: 'TOGGLE_CONCEITO_MATEMATICO' })}
              >
                <p className="text-gray-700 dark:text-gray-300 mb-4">{conceitos.descricao}</p>
                
                <div className="space-y-6">
                  {conceitos.categorias.map((categoria: any, categoriaIndex: number) => (
                    <div key={categoriaIndex} className="space-y-3">
                      <h5 className="text-lg font-medium text-indigo-700 dark:text-indigo-300 border-b border-indigo-100 dark:border-indigo-700 pb-1">
                        {categoria.nome}
                      </h5>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {categoria.regras.map((regra: any, regraIndex: number) => (
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
                  <h5 className="font-medium text-indigo-700 dark:text-indigo-300 mb-2">Importância das Integrais</h5>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    As integrais são fundamentais no cálculo e possibilitam o cálculo de áreas, volumes, 
                    trabalho, centros de massa e muitas outras aplicações físicas e geométricas. 
                    Além disso, elas são essenciais para solucionar equações diferenciais e modelar 
                    diversos fenômenos naturais em ciências e engenharia.
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

export default ResolvedorIntegrais; 