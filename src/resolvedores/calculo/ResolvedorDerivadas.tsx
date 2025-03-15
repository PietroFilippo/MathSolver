import React, { useState } from 'react';
import { HiCalculator, HiX } from 'react-icons/hi';
import { generateDerivativeSteps, regrasDerivacao } from '../../utils/mathUtilsCalculo/mathUtilsCalculoDerivada';

const ResolvedorDerivadas: React.FC = () => {
  const [funcao, setFuncao] = useState<string>('');
  const [variable, setVariable] = useState<string>('x');
  const [order, setOrder] = useState<string>('1');
  const [result, setResult] = useState<string | null>(null);
  const [steps, setSteps] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState<boolean>(true);
  const [showDisclaimer, setShowDisclaimer] = useState<boolean>(true);

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

  // Função que retorna exemplos úteis para o tipo de função selecionada
  const getExemples = (): string[] => {
    return [
      'x^2 + 3x',
      'x^3 - 2x^2 + 5x - 3',
      'sin(x)',
      'cos(x)',
      'e^(x)',
      'ln(x)',
      'ln(x^2)',
      'x / (x^2 + 1)',
      'sin(x) * cos(x)',
      'e^(x) * sin(x)',
      'x^2 * ln(x)',
      '(x^2 + 1) / (x - 1)'
    ];
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
              {getExemples().map((exemple, index) => (
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
              
              <div className="mt-6 p-4 bg-blue-50 rounded-md">
                <h4 className="font-medium text-blue-800 mb-2">Regras de Derivação</h4>
                <ul className="space-y-2 text-gray-700">
                  {Object.entries(regrasDerivacao).map(([key, rule]) => (
                    <li key={key} className="list-disc ml-5">
                      {rule}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ResolvedorDerivadas; 