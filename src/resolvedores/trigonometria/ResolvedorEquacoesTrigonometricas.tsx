import React, { useState } from 'react';
import { roundToDecimals, approximatelyEqual, formatInterval } from '../../utils/mathUtils';
import { 
  radiansToDegrees, 
  evaluateTrigonometricExpression,
  parseInterval,
  getTrigonometricEquationExamples
} from '../../utils/mathUtilsTrigonometria';
import { HiCalculator } from 'react-icons/hi';

// Tipo para as soluções formatadas
interface FormattedSolution {
  radians: string;
  degrees: number;
}

const ResolvedorEquacoesTrigonometricas: React.FC = () => {
  const [equation, setEquation] = useState<string>('');
  const [interval, setInterval] = useState<string>('0,2π');
  const [result, setResult] = useState<string | null>(null);
  const [explanationSteps, setExplanationSteps] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState<boolean>(true);
  const [formattedSolutions, setFormattedSolutions] = useState<FormattedSolution[]>([]);

  // Função para aplicar um exemplo selecionado
  const applyExample = (example: any) => {
    setEquation(example.equation);
    setInterval(example.interval);
    
    // Limpar resultados anteriores
    setResult(null);
    setExplanationSteps([]);
    setFormattedSolutions([]);
    setError(null);
  };

  const handleSolve = () => {
    // Limpa resultados anteriores
    setError(null);
    setExplanationSteps([]);
    setResult(null);
    setFormattedSolutions([]);
    setShowExplanation(true);
    
    // Valida entrada
    if (!equation.trim()) {
      setError('Por favor, insira uma equação trigonométrica.');
      return;
    }
    
    // Verifica se a equação contém funções trigonométricas - Regex melhorado para detectar funções com expoentes
    const hasTrigFunction = /(\d*\s*)?(sen|cos|tan|cot|sec|csc|sin|tg|cotg)(\s*\^[0-9]+)?\s*\(/i.test(equation);
    if (!hasTrigFunction) {
      setError('Sua entrada deve conter pelo menos uma função trigonométrica (sen, cos, tan, etc.).');
      return;
    }

    try {
      // Verifica primeiro se o intervalo é válido antes de continuar
      try {
        const [testStart, testEnd] = parseInterval(interval);
        if (isNaN(testStart) || isNaN(testEnd)) {
          throw new Error('Os limites do intervalo devem ser valores numéricos válidos.');
        }
        if (testStart >= testEnd) {
          throw new Error('O limite inferior deve ser menor que o limite superior.');
        }
      } catch (error) {
        setError(`Erro no intervalo: ${error instanceof Error ? error.message : String(error)}`);
        return;
      }

      // Verifica se a equação contém um sinal de igual
      if (!equation.includes('=')) {
        setError('A equação deve conter um sinal de igual (=).');
        return;
      }

      // Divide a equação em lado esquerdo e direito
      const [left, right] = equation.split('=').map(side => side.trim());
      
      // Cria uma função segura que representa a diferença entre os lados da equação
      // Retorna NaN em caso de erro para evitar travamentos
      const difFunction = (x: number): number => {
        try {
          const leftValue = evaluateTrigonometricExpression(left, x);
          const rightValue = evaluateTrigonometricExpression(right, x);
          return leftValue - rightValue;
        } catch (error) {
          // Silenciosamente retorna NaN em caso de erro
          return NaN;
        }
      };

      // Analisa o intervalo
      try {
        let [start, end] = parseInterval(interval);
        
        // Inicia os passos da solução
        const calculationSteps: string[] = [];
        let stepCount = 1;

        calculationSteps.push(`Step ${stepCount}: Analisar a equação trigonométrica`);
        calculationSteps.push(`Equação: ${equation}`);
        calculationSteps.push(`Reescrevendo como: ${left} - (${right}) = 0`);
        
        stepCount++;
        // Usa a função de formatação específica para o intervalo
        calculationSteps.push(`Step ${stepCount}: Definir o intervalo de busca`);
        calculationSteps.push(`Intervalo: [${formatInterval(start)}, ${formatInterval(end)}]`);
        calculationSteps.push(`Valores originais do intervalo: [${start}, ${end}]`);
        
        // Método de busca de raízes: divide o intervalo em pequenos segmentos e procura por mudanças de sinal da função diferença
        const numSegments = 1000;
        const segmentSize = (end - start) / numSegments;
        
        stepCount++;
        calculationSteps.push(`Step ${stepCount}: Buscar soluções no intervalo`);
        calculationSteps.push(`Método: Busca por mudanças de sinal da função diferença em ${numSegments} segmentos`);
        
        const solutions: number[] = [];
        const precisionBisection = 1e-10;
        const maxIterationsBisection = 20; // Aumentando para melhor precisão
        
        for (let i = 0; i < numSegments; i++) {
          const x1 = start + i * segmentSize;
          const x2 = x1 + segmentSize;
          
          try {
            const y1 = difFunction(x1);
            const y2 = difFunction(x2);
            
            // Se tiver uma mudança de sinal há uma raiz no intervalo [x1, x2]
            if (y1 * y2 <= 0 && !isNaN(y1) && !isNaN(y2)) {
              // Método da bissecção para refinar a solução
              let a = x1;
              let b = x2;
              let c: number;
              let fa = y1;
              let fc: number;
              
              // Iterações para refinar a solução
              for (let j = 0; j < maxIterationsBisection; j++) {
                c = (a + b) / 2;
                fc = difFunction(c);
                
                // Se encontramos uma solução precisa ou atingimos a precisão desejada
                if (Math.abs(fc) < precisionBisection || (b - a) < precisionBisection) {
                  break;
                }
                
                // Atualiza o intervalo [a, b]
                if (fa * fc < 0) {
                  b = c;
                } else {
                  a = c;
                  fa = fc; // Atualiza fa porque é usado na próxima iteração
                }
              }
              
              // Adiciona a solução encontrada
              const solution = (a + b) / 2;
              
              // Verifica se é uma solução válida (não NaN/infinita)
              if (!isFinite(solution)) continue;
              
              // Verifica se a solução realmente resolve a equação
              const functionValue = difFunction(solution);
              if (Math.abs(functionValue) > 1e-5) continue; // Tolerância para considerar uma solução
              
              // Verifica se a solução já foi encontrada (para evitar duplicatas)
              const alreadyExists = solutions.some(s => {
                return approximatelyEqual(s, solution, 1e-6) ||
                       approximatelyEqual(s, solution + 2 * Math.PI, 1e-6) ||
                       approximatelyEqual(s, solution - 2 * Math.PI, 1e-6);
              });
              
              if (!alreadyExists) {
                // Verifica novamente se a solução é válida antes de adicioná-la
                try {
                  const leftValue = evaluateTrigonometricExpression(left, solution);
                  const rightValue = evaluateTrigonometricExpression(right, solution);
                  const difference = Math.abs(leftValue - rightValue);
                  
                  if (difference < 1e-5) {  // Tolerância razoável para considerar uma solução válida
                    solutions.push(solution);
                  }
                } catch (error) {
                  // Ignora erros na verificação final
                }
              }
            }
          } catch (error) {
            // Ignora erros de avaliação (divisão por zero, etc.)
            continue;
          }
        }
        
        // Ordena as soluções
        solutions.sort((a, b) => a - b);
        
        if (solutions.length === 0) {
          calculationSteps.push(`Não foram encontradas soluções no intervalo especificado.`);
          calculationSteps.push(`Isso pode ocorrer porque a equação não tem solução no intervalo ou porque a função não muda de sinal.`);
          setResult('Não foram encontradas soluções no intervalo especificado.');
        } else {
          calculationSteps.push(`Foram encontradas ${solutions.length} soluções no intervalo especificado:`);
          
          // Formata as soluções
          const formattedSols: FormattedSolution[] = solutions.map((solution, index) => {
            const solutionRadians = formatInterval(solution);
            const solutionDegrees = roundToDecimals(radiansToDegrees(solution), 4);
            
            calculationSteps.push(`Solução ${index + 1}: x = ${solutionRadians} rad = ${solutionDegrees}°`);
            
            // Verifica a solução
            try {
              const leftValue = evaluateTrigonometricExpression(left, solution);
              const rightValue = evaluateTrigonometricExpression(right, solution);
              const difference = Math.abs(leftValue - rightValue);
              
              calculationSteps.push(`Verificação: ${left} = ${roundToDecimals(leftValue, 6)}, ${right} = ${roundToDecimals(rightValue, 6)}`);
              calculationSteps.push(`Diferença: ${roundToDecimals(difference, 10)} (deve ser próxima de zero)`);
              
              // Adiciona observação sobre a periodicidade
              if (equation.includes('sen') || equation.includes('sin') || equation.includes('cos')) {
                calculationSteps.push(`Observe que ${solutionRadians} + 2nπ também é solução para qualquer inteiro n.`);
              } else if (equation.includes('tan') || equation.includes('tg')) {
                calculationSteps.push(`Observe que ${solutionRadians} + nπ também é solução para qualquer inteiro n.`);
              }
            } catch (error) {
              calculationSteps.push(`Não foi possível verificar esta solução: ${error}`);
            }
            
            // Usa o formato que será corretamente renderizado como JSX
            return {
              radians: solutionRadians,
              degrees: solutionDegrees
            };
          });
          
          setFormattedSolutions(formattedSols);
          setResult(`Soluções encontradas: ${formattedSols.map(sol => 
            `x = ${sol.radians} rad = ${sol.degrees}°`
          ).join('; ')}`);
        }
        
        // Adiciona explicação sobre equações trigonométricas
        stepCount++;
        calculationSteps.push(`Step ${stepCount}: Entendendo equações trigonométricas`);
        calculationSteps.push(`As equações trigonométricas geralmente têm infinitas soluções devido à natureza periódica das funções trigonométricas.`);
        calculationSteps.push(`Por exemplo, se x = α é uma solução de sen(x) = k, então x = α + 2nπ também é uma solução para qualquer inteiro n.`);
        calculationSteps.push(`Para cos(x) = k, se x = α é uma solução, então x = ±α + 2nπ também é uma solução.`);
        calculationSteps.push(`Para tan(x) = k, se x = α é uma solução, então x = α + nπ também é uma solução.`);
        
        // Define os passos
        setExplanationSteps(calculationSteps);
        setShowExplanation(true);
        
        if (solutions.length > 0) {
          calculationSteps.push(`Step ${stepCount}: Formatar e verificar as soluções encontradas`);
          calculationSteps.push(`Formato numérico das soluções: ${solutions.map(s => s.toFixed(4)).join(', ')}`);
          calculationSteps.push(`Formato radiano das soluções: ${solutions.map(s => formatInterval(s)).join(', ')}`);
          
          // Formatar as soluções para exibição
          const formattedSols = solutions.map(solution => {
            const radians = formatInterval(solution);
            const degrees = parseFloat((solution * 180 / Math.PI).toFixed(2));
            return { radians, degrees };
          });
          
          setFormattedSolutions(formattedSols);
          
          // Texto para exibir o resultado final
          setResult(`Soluções encontradas no intervalo [${formatInterval(start)}, ${formatInterval(end)}]:`);
        }
        
      } catch (error) {
        console.error("Erro ao analisar intervalo:", error);
        
        // Melhora mensagem de erro para problemas comuns de intervalo
        let errorMessage = `Erro ao processar o intervalo: ${error instanceof Error ? error.message : String(error)}`;
        
        if (error instanceof Error) {
          if (error.message.includes('Expressão inválida')) {
            errorMessage = "Formato de intervalo inválido. Use formatos como '0,2π', '-π,π', ou '0,6.28'. " +
              "Para representar π, use o símbolo π ou 'pi'. Para multiplicar, use por exemplo '2*π' ou '2π'.";
          } else if (error.message.includes('Formato de intervalo inválido')) {
            errorMessage = "O intervalo deve ser especificado como 'início,fim', por exemplo: '0,2π' ou '-π,π'";
          }
        }
        
        setError(errorMessage);
        return;
      }
      
    } catch (error) {
      console.error("Erro na resolução:", error);
      
      // Fornece mensagens de erro mais amigáveis para problemas comuns
      let errorMessage = `Erro ao resolver a equação: ${error instanceof Error ? error.message : String(error)}`;
      
      // Verifica se é um erro de sintaxe
      if (error instanceof Error && error.message.includes('SyntaxError')) {
        errorMessage = "Há um erro de sintaxe na equação. Verifique se você escreveu corretamente as funções trigonométricas e operadores. " +
          "Por exemplo, use '2*sen(x)' ou deixe sem espaços entre o número e a função: '2sen(x)'.";
      } else if (error instanceof Error && error.message.includes('Divisão por zero')) {
        errorMessage = "Ocorreu uma divisão por zero ao avaliar a equação. Verifique se você está usando funções como tan(x) em pontos onde elas não são definidas.";
      }
      
      setError(errorMessage);
    }
  };

  const handleIntervalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInterval(newValue);
  };

  // Função para renderizar os passos de explicação com estilização aprimorada
  const renderExplanationSteps = () => {
    return (
      <div className="space-y-4">
        {explanationSteps.map((step, index) => {
          // Verifica se o passo começa com "Step X:"
          const stepMatch = step.match(/^(Step \d+:)(.*)$/);
          
          // Verifica se contém informações sobre a equação
          const equationMatch = step.includes('Equação:') || step.includes('Reescrevendo como:');
          
          // Verifica se contém informações sobre o intervalo
          const intervalMatch = step.includes('Intervalo:') || step.includes('Valores originais do intervalo:');
          
          // Verifica se contém informações sobre o método
          const methodMatch = step.includes('Método:');
          
          // Verifica se contém informações sobre soluções
          const solutionMatch = step.includes('Solução') && step.includes('rad =');
          
          // Verifica se contém informações de verificação
          const verificationMatch = step.includes('Verificação:') || step.includes('Diferença:');
          
          // Verifica se contém informações sobre periodicidade
          const periodicMatch = step.includes('Observe que') && step.includes('também é solução');
          
          // Verifica se contém informações sobre propriedades gerais
          const generalInfoMatch = step.includes('equações trigonométricas geralmente têm infinitas soluções');
          
          if (stepMatch) {
            // Se for um passo numerado, extrai e destaca o número
            const [_, stepNumber, stepContent] = stepMatch;
            return (
              <div key={index} className="p-4 bg-gray-50 rounded-md border-l-4 border-indigo-500">
                <div className="flex flex-col sm:flex-row">
                  <span className="font-bold text-indigo-700 mr-2 mb-1 sm:mb-0">{stepNumber}</span>
                  <p className="text-gray-800">{stepContent}</p>
                </div>
              </div>
            );
          } else if (equationMatch) {
            return (
              <div key={index} className="p-3 bg-blue-50 rounded-md ml-4 border-l-2 border-blue-300">
                <p className="text-blue-700 font-medium">{step}</p>
              </div>
            );
          } else if (intervalMatch) {
            return (
              <div key={index} className="p-3 bg-purple-50 rounded-md ml-4 border-l-2 border-purple-300">
                <p className="text-purple-700 font-medium">{step}</p>
              </div>
            );
          } else if (methodMatch) {
            return (
              <div key={index} className="p-3 bg-indigo-50 rounded-md ml-4 border-l-2 border-indigo-300">
                <p className="text-indigo-700 font-medium">{step}</p>
              </div>
            );
          } else if (solutionMatch) {
            return (
              <div key={index} className="p-3 bg-green-50 rounded-md ml-4 border-l-2 border-green-300">
                <p className="text-green-700 font-medium">{step}</p>
              </div>
            );
          } else if (verificationMatch) {
            return (
              <div key={index} className="p-3 bg-amber-50 rounded-md ml-4 border-l-2 border-amber-300">
                <p className="text-amber-700 font-medium">{step}</p>
              </div>
            );
          } else if (periodicMatch) {
            return (
              <div key={index} className="p-3 bg-teal-50 rounded-md ml-4 border-l-2 border-teal-300">
                <p className="text-teal-700 font-medium">{step}</p>
              </div>
            );
          } else if (generalInfoMatch) {
            return (
              <div key={index} className="p-3 bg-yellow-50 rounded-md ml-4 border-l-2 border-yellow-300">
                <p className="text-yellow-700 font-medium">{step}</p>
              </div>
            );
          } else {
            // Outros passos
            return (
              <div key={index} className="p-3 bg-gray-50 rounded-md ml-4">
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
        <h2 className="text-2xl font-bold">Equações Trigonométricas</h2>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-8">
        <p className="text-gray-700 mb-6">
          Esta calculadora ajuda você a resolver equações trigonométricas como sen(x) = 0.5 ou cos(2x) + 1 = 0
          dentro de um intervalo específico.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="equacao" className="block text-sm font-medium text-gray-700 mb-2">
              Equação Trigonométrica
            </label>
            <input
              type="text"
              id="equacao"
              value={equation}
              onChange={(e) => setEquation(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Ex: sen(x) = 1/2 ou cos^2(x) + 1 = 0"
            />
            <p className="text-sm text-gray-500 mt-1">
              Use funções trigonométricas como sen, cos, tan, etc. Você pode usar ^ para potências (ex: sen^2(x)),
              √ para raiz quadrada (ex: √3/2) e π para representar pi.
            </p>
          </div>
          
          <div>
            <label htmlFor="intervalo" className="block text-sm font-medium text-gray-700 mb-2">
              Intervalo para Soluções
            </label>
            <input
              type="text"
              id="intervalo"
              value={interval}
              onChange={handleIntervalChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Ex: 0,2π ou -π,π"
            />
            <p className="text-sm text-gray-500 mt-1">
              Especifique o intervalo no formato: início,fim. Use π para representar pi.
              Lembre-se de que os valores dos ângulos são em radianos (π/6 = 30°, π/4 = 45°, π/3 = 60°, π/2 = 90°).
            </p>
          </div>
        </div>
        
        {/* Exemplos */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Exemplos
          </label>
          <div className="flex flex-wrap gap-2 mb-4">
            {getTrigonometricEquationExamples().map((exemplo, index) => (
              <button
                key={index}
                onClick={() => applyExample(exemplo)}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-full transition-colors"
              >
                {exemplo.description}
              </button>
            ))}
          </div>
        </div>
        
        <div className="mb-4 p-3 bg-blue-50 rounded-md text-sm">
          <h3 className="font-bold mb-1">Método de Utilização:</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Use potências com o símbolo <code>^</code>: <code>sen^2(x) + cos^2(x) = 1</code></li>
            <li>Use raiz quadrada com o símbolo <code>√</code>: <code>sen(x) = √3/2</code></li>
            <li>As funções trigonométricas usam radianos: <code>sen(π/6) = 0.5</code> (30°), <code>sen(π/2) = 1</code> (90°)</li>
            <li>Para representar pi, use o símbolo π ou 'pi'. Para multiplicar, use por exemplo '2*π' ou '2π'.</li>
            <li>Tome cuidado com a sintaxe de espaços, por exemplo: '2 sen(x)' deve ser escrito como '2sen(x)'.</li>
          </ul>
        </div>
        
        <button
          onClick={handleSolve}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-md transition-colors duration-300"
        >
          Resolver
        </button>
        
        {error && (
          <div className="mt-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-md">
            {error}
          </div>
        )}
      </div>
      
      {result && (
        <div className="space-y-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-5">
            <h3 className="text-lg font-medium text-green-800 mb-2">Resultado</h3>
            <p className="text-xl font-bold">
              {result}
            </p>
            
            {formattedSolutions.length > 0 ? (
              <div className="mt-3">
                {formattedSolutions.map((solution, index) => (
                  <p key={index} className="text-lg">
                    Solução {index + 1}: x = <span className="font-bold">{solution.radians}</span> rad = <span className="font-bold">{solution.degrees}°</span>
                  </p>
                ))}
              </div>
            ) : (
              <p className="text-gray-700 mt-2">Não foram encontradas soluções no intervalo especificado.</p>
            )}
            
            <button 
              onClick={() => setShowExplanation(!showExplanation)}
              className="mt-4 text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center"
            >
              {showExplanation ? "Ocultar explicação detalhada" : "Mostrar explicação detalhada"}
            </button>
          </div>
          
          {showExplanation && explanationSteps.length > 0 && (
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
                    Conceito Matemático
                  </h4>
                </div>
                <div className="p-4">
                  <div className="flex flex-col md:flex-row gap-4 mb-4">
                    <div className="flex-1">
                      <h5 className="font-medium text-gray-800 mb-2 border-b border-gray-200 pb-1">Propriedades</h5>
                      <p className="text-gray-700">
                        As equações trigonométricas geralmente possuem infinitas soluções devido à natureza periódica das funções trigonométricas.
                      </p>
                      <div className="mt-3 grid grid-cols-1 gap-2">
                        <div className="p-2 bg-white rounded-md border border-gray-100 shadow-sm">
                          <p className="text-sm">
                            <strong className="text-indigo-600">Seno:</strong> Se x = α é solução de sen(x) = k, então x = α + 2nπ também é solução para qualquer inteiro n.
                          </p>
                        </div>
                        <div className="p-2 bg-white rounded-md border border-gray-100 shadow-sm">
                          <p className="text-sm">
                            <strong className="text-indigo-600">Cosseno:</strong> Se x = α é solução de cos(x) = k, então x = ±α + 2nπ também é solução para qualquer inteiro n.
                          </p>
                        </div>
                        <div className="p-2 bg-white rounded-md border border-gray-100 shadow-sm">
                          <p className="text-sm">
                            <strong className="text-indigo-600">Tangente:</strong> Se x = α é solução de tan(x) = k, então x = α + nπ também é solução para qualquer inteiro n.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h5 className="font-medium text-gray-800 mb-2 border-b border-gray-200 pb-1">Método de Solução</h5>
                      <p className="text-gray-700 mb-2">
                        As equações trigonométricas podem ser resolvidas através de:
                      </p>
                      <ul className="space-y-2 text-gray-700">
                        <li className="p-2 hover:bg-blue-50 rounded transition-colors flex">
                          <div className="h-5 w-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs mr-2 flex-shrink-0">1</div>
                          <span><span className="font-medium">Valores conhecidos:</span> Utilizar ângulos notáveis (30°, 45°, 60°, etc)</span>
                        </li>
                        <li className="p-2 hover:bg-blue-50 rounded transition-colors flex">
                          <div className="h-5 w-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs mr-2 flex-shrink-0">2</div>
                          <span><span className="font-medium">Identidades:</span> Aplicar identidades trigonométricas para simplificar</span>
                        </li>
                        <li className="p-2 hover:bg-blue-50 rounded transition-colors flex">
                          <div className="h-5 w-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs mr-2 flex-shrink-0">3</div>
                          <span><span className="font-medium">Métodos numéricos:</span> Para equações complexas</span>
                        </li>
                        <li className="p-2 hover:bg-blue-50 rounded transition-colors flex">
                          <div className="h-5 w-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs mr-2 flex-shrink-0">4</div>
                          <span><span className="font-medium">Reformulação:</span> Converter para formas mais simples</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h5 className="font-medium text-gray-800 mb-2 border-b border-gray-200 pb-1">Ângulos Notáveis</h5>
                    <div className="overflow-x-auto">
                      <table className="min-w-full bg-white rounded-md shadow-sm">
                        <thead>
                          <tr className="bg-indigo-50 text-indigo-700">
                            <th className="py-2 px-3 text-left text-sm font-medium">Ângulo (graus)</th>
                            <th className="py-2 px-3 text-left text-sm font-medium">Ângulo (rad)</th>
                            <th className="py-2 px-3 text-left text-sm font-medium">sen(x)</th>
                            <th className="py-2 px-3 text-left text-sm font-medium">cos(x)</th>
                            <th className="py-2 px-3 text-left text-sm font-medium">tan(x)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          <tr className="hover:bg-gray-50">
                            <td className="py-2 px-3 text-sm">0°</td>
                            <td className="py-2 px-3 text-sm">0</td>
                            <td className="py-2 px-3 text-sm">0</td>
                            <td className="py-2 px-3 text-sm">1</td>
                            <td className="py-2 px-3 text-sm">0</td>
                          </tr>
                          <tr className="hover:bg-gray-50">
                            <td className="py-2 px-3 text-sm">30°</td>
                            <td className="py-2 px-3 text-sm">π/6</td>
                            <td className="py-2 px-3 text-sm">1/2</td>
                            <td className="py-2 px-3 text-sm">√3/2</td>
                            <td className="py-2 px-3 text-sm">1/√3</td>
                          </tr>
                          <tr className="hover:bg-gray-50">
                            <td className="py-2 px-3 text-sm">45°</td>
                            <td className="py-2 px-3 text-sm">π/4</td>
                            <td className="py-2 px-3 text-sm">1/√2</td>
                            <td className="py-2 px-3 text-sm">1/√2</td>
                            <td className="py-2 px-3 text-sm">1</td>
                          </tr>
                          <tr className="hover:bg-gray-50">
                            <td className="py-2 px-3 text-sm">60°</td>
                            <td className="py-2 px-3 text-sm">π/3</td>
                            <td className="py-2 px-3 text-sm">√3/2</td>
                            <td className="py-2 px-3 text-sm">1/2</td>
                            <td className="py-2 px-3 text-sm">√3</td>
                          </tr>
                          <tr className="hover:bg-gray-50">
                            <td className="py-2 px-3 text-sm">90°</td>
                            <td className="py-2 px-3 text-sm">π/2</td>
                            <td className="py-2 px-3 text-sm">1</td>
                            <td className="py-2 px-3 text-sm">0</td>
                            <td className="py-2 px-3 text-sm">∞</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  <div className="mt-4 bg-yellow-50 p-3 rounded-md border-l-4 border-yellow-400">
                    <h5 className="font-medium text-yellow-800 mb-1">Dica de Resolução</h5>
                    <p className="text-gray-700 text-sm">
                      Ao resolver equações trigonométricas, é fundamental identificar o período da função envolvida 
                      (2π para seno e cosseno, π para tangente) para determinar corretamente todas as soluções no intervalo definido.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ResolvedorEquacoesTrigonometricas;