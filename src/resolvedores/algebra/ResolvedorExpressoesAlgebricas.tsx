import React, { useState } from 'react';
import { HiCalculator, HiX, HiInformationCircle } from 'react-icons/hi';
import { useExpressoesAlgebraicasSolver } from '../../hooks/algebra/expressoesAlgebricas';
import StepByStepExplanation from '../../components/StepByStepExplanation';
import ConceitoMatematico from '../../components/ConceitoMatematico';

const ResolvedorExpressoesAlgebricas: React.FC = () => {
  const [showLimitations, setShowLimitations] = useState(false);
  
  const { 
    state, 
    dispatch, 
    getExamples,
    applyExample,
    handleSolve,
    conceitoExpressoesAlgebricas
  } = useExpressoesAlgebraicasSolver();
  
  // Função para renderizar o resultado formatado
  const renderFormattedResult = () => {
    if (!state.resultado) return null;
    
    return (
      <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-5">
        <h3 className="text-lg font-medium text-green-800 dark:text-green-300 mb-2">Resultado</h3>
        <p className="text-xl text-gray-800 dark:text-gray-200">
          {`A expressão ${state.operacao === 'simplificar' ? 'simplificada' : 
             state.operacao === 'expandir' ? 'expandida' : 'fatorada'} é:`}
        </p>
        <p className="text-xl font-bold mt-2 text-gray-800 dark:text-gray-200">
          {state.resultado}
        </p>
        
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
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Manipulação de Expressões Algébricas</h2>
      </div>
      
      <div className="resolver-container p-6 mb-8">
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          Esta calculadora permite manipular expressões algébricas. Insira uma expressão e escolha a operação desejada: 
          simplificar, expandir ou fatorar.
        </p>
        
        <div className="mb-4">
          <div className="mb-4">
            <label htmlFor="expressao" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Expressão Algébrica
            </label>
            <input
              type="text"
              id="expressao"
              value={state.expressao}
              onChange={(e) => dispatch({ type: 'SET_EXPRESSAO', value: e.target.value })}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400"
              placeholder="Ex: 3x + 2x + 5 ou (x + 3)²"
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Use operadores como +, -, *, /, ^ para expressar sua expressão algébrica. Use parênteses para agrupar termos quando necessário.
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
                  checked={state.operacao === 'simplificar'}
                  onChange={() => dispatch({ type: 'SET_OPERACAO', operacao: 'simplificar' })}
                />
                <span className="ml-2 text-gray-700 dark:text-gray-300">Simplificar</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio text-indigo-600 dark:text-indigo-400"
                  checked={state.operacao === 'expandir'}
                  onChange={() => dispatch({ type: 'SET_OPERACAO', operacao: 'expandir' })}
                />
                <span className="ml-2 text-gray-700 dark:text-gray-300">Expandir</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio text-indigo-600 dark:text-indigo-400"
                  checked={state.operacao === 'fatorar'}
                  onChange={() => dispatch({ type: 'SET_OPERACAO', operacao: 'fatorar' })}
                />
                <span className="ml-2 text-gray-700 dark:text-gray-300">Fatorar</span>
              </label>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Exemplos de Expressões
            </label>
            
            <div className="flex flex-wrap gap-2">
              {getExamples().map((example: string, index: number) => (
                <button
                  key={index}
                  onClick={() => applyExample(example, state.operacao)}
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
                <strong>Nota:</strong> Para expressões complexas, o sistema pode não conseguir realizar 
                todas as operações ou pode apresentar resultados que ainda requeiram 
                simplificações manuais adicionais.
              </p>
            </div>
          )}
          
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={handleSolve}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
            >
              Processar Expressão
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
                Limitações do Manipulador de Expressões Algébricas
              </h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-red-600 dark:text-red-400 mb-2">Características sem suporte:</h4>
                  <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300 space-y-1 text-sm">
                    <li>Manipulações complexas de expressões fracionárias</li>
                    <li>Simplificação de expressões com radicais aninhados</li>
                    <li>Manipulação de expressões com funções trigonométricas inversas</li>
                    <li>Fatoração geral de polinômios de grau superior a 2 (exceto casos específicos como diferenças de potências)</li>
                    <li>Expressões com variáveis no denominador em casos complexos</li>
                    <li>Expressões paramétricas complexas ou com múltiplas variáveis interdependentes</li>
                    <li>Algumas manipulações que requerem teoremas avançados de álgebra</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium text-yellow-600 dark:text-yellow-400 mb-2">Características com suporte limitado:</h4>
                  <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300 space-y-1 text-sm">
                    <li>Expressões com múltiplas variáveis são suportadas em casos comuns (trinômios quadrados perfeitos, fatoração por agrupamento)</li>
                    <li>Simplificação de expressões com funções transcendentais (logaritmos, exponenciais)</li>
                    <li>Fatoração de polinômios de grau mais alto em casos específicos (diferenças de potências, produtos notáveis)</li>
                    <li>Expressões muito longas ou com muitos termos podem gerar resultados parciais</li>
                    <li>Operações que requerem reconhecimento de padrões matemáticos avançados</li>
                  </ul>
                </div>
                
                <div className="text-sm text-gray-600 dark:text-gray-400 italic">
                  O calculador é eficaz para expressões polinomiais, produtos notáveis, fatorações de casos comuns 
                  e simplificações algébricas, incluindo expressões com múltiplas variáveis em padrões reconhecíveis.
                  Suporta expansão e fatoração de expressões algébricas encontradas em cursos introdutórios e intermediários de álgebra.
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
    
              <StepByStepExplanation steps={state.passos} stepType="linear" />

              <ConceitoMatematico
                title="Conceito Matemático: Expressões Algébricas"
                isOpen={state.showConceitoMatematico}
                onToggle={() => dispatch({ type: 'TOGGLE_CONCEITO_MATEMATICO' })}
              >
                <p className="text-gray-700 dark:text-gray-300 mb-4">{conceitoExpressoesAlgebricas.descricao}</p>
                
                <div className="space-y-6">
                  {conceitoExpressoesAlgebricas.categorias.map((categoria, categoriaIndex) => (
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
                  <h5 className="font-medium text-indigo-700 dark:text-indigo-300 mb-2">Importância das Expressões Algébricas</h5>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    As expressões algébricas são fundamentais na matemática pois permitem generalizar 
                    padrões numéricos, resolver problemas com variáveis desconhecidas e modelar 
                    relações entre grandezas. A manipulação correta dessas expressões é essencial 
                    para resolver equações, inequações e sistemas, facilitando a resolução de 
                    problemas em diversas áreas como física, engenharia, economia e ciências.
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

export default ResolvedorExpressoesAlgebricas;


