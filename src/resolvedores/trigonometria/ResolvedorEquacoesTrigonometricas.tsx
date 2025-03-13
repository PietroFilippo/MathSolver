import React, { useState } from 'react';
import { arredondarParaDecimais, aproximadamenteIguais } from '../../utils/mathUtils';
import { 
  radianosParaGraus, 
  parseIntervalo, 
  formatarIntervalo,
  avaliarExpressaoTrigonometrica 
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
        const [testStart, testEnd] = parseIntervalo(interval);
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
          const leftValue = avaliarExpressaoTrigonometrica(left, x);
          const rightValue = avaliarExpressaoTrigonometrica(right, x);
          return leftValue - rightValue;
        } catch (error) {
          // Silenciosamente retorna NaN em caso de erro
          return NaN;
        }
      };

      // Analisa o intervalo
      try {
        let [start, end] = parseIntervalo(interval);
        
        // Inicia os passos da solução
        const calculationSteps: string[] = [];
        let stepCount = 1;

        calculationSteps.push(`Passo ${stepCount}: Analisar a equação trigonométrica`);
        calculationSteps.push(`Equação: ${equation}`);
        calculationSteps.push(`Reescrevendo como: ${left} - (${right}) = 0`);
        
        stepCount++;
        // Usa a função de formatação específica para o intervalo
        calculationSteps.push(`Passo ${stepCount}: Definir o intervalo de busca`);
        calculationSteps.push(`Intervalo: [${formatarIntervalo(start)}, ${formatarIntervalo(end)}]`);
        calculationSteps.push(`Valores originais do intervalo: [${start}, ${end}]`);
        
        // Método de busca de raízes: divide o intervalo em pequenos segmentos e procura por mudanças de sinal da função diferença
        const numSegments = 1000;
        const segmentSize = (end - start) / numSegments;
        
        stepCount++;
        calculationSteps.push(`Passo ${stepCount}: Buscar soluções no intervalo`);
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
                return aproximadamenteIguais(s, solution, 1e-6) || 
                       aproximadamenteIguais(s, solution + 2 * Math.PI, 1e-6) || 
                       aproximadamenteIguais(s, solution - 2 * Math.PI, 1e-6);
              });
              
              if (!alreadyExists) {
                // Verifica novamente se a solução é válida antes de adicioná-la
                try {
                  const leftValue = avaliarExpressaoTrigonometrica(left, solution);
                  const rightValue = avaliarExpressaoTrigonometrica(right, solution);
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
            const solutionRadians = formatarIntervalo(solution);
            const solutionDegrees = arredondarParaDecimais(radianosParaGraus(solution), 4);
            
            calculationSteps.push(`Solução ${index + 1}: x = ${solutionRadians} rad = ${solutionDegrees}°`);
            
            // Verifica a solução
            try {
              const leftValue = avaliarExpressaoTrigonometrica(left, solution);
              const rightValue = avaliarExpressaoTrigonometrica(right, solution);
              const difference = Math.abs(leftValue - rightValue);
              
              calculationSteps.push(`Verificação: ${left} = ${arredondarParaDecimais(leftValue, 6)}, ${right} = ${arredondarParaDecimais(rightValue, 6)}`);
              calculationSteps.push(`Diferença: ${arredondarParaDecimais(difference, 10)} (deve ser próxima de zero)`);
              
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
        calculationSteps.push(`Passo ${stepCount}: Entendendo equações trigonométricas`);
        calculationSteps.push(`As equações trigonométricas geralmente têm infinitas soluções devido à natureza periódica das funções trigonométricas.`);
        calculationSteps.push(`Por exemplo, se x = α é uma solução de sen(x) = k, então x = α + 2nπ também é uma solução para qualquer inteiro n.`);
        calculationSteps.push(`Para cos(x) = k, se x = α é uma solução, então x = ±α + 2nπ também é uma solução.`);
        calculationSteps.push(`Para tan(x) = k, se x = α é uma solução, então x = α + nπ também é uma solução.`);
        
        // Define os passos
        setExplanationSteps(calculationSteps);
        setShowExplanation(true);
        
        if (solutions.length > 0) {
          calculationSteps.push(`Passo ${stepCount}: Formatar e verificar as soluções encontradas`);
          calculationSteps.push(`Formato numérico das soluções: ${solutions.map(s => s.toFixed(4)).join(', ')}`);
          calculationSteps.push(`Formato radiano das soluções: ${solutions.map(s => formatarIntervalo(s)).join(', ')}`);
          
          // Formatar as soluções para exibição
          const formattedSols = solutions.map(solution => {
            const radians = formatarIntervalo(solution);
            const degrees = parseFloat((solution * 180 / Math.PI).toFixed(2));
            return { radians, degrees };
          });
          
          setFormattedSolutions(formattedSols);
          
          // Texto para exibir o resultado final
          setResult(`Soluções encontradas no intervalo [${formatarIntervalo(start)}, ${formatarIntervalo(end)}]:`);
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
              
              <div className="space-y-4">
                {explanationSteps.map((step, index) => {
                  // Verifica se o passo começa com um padrão de número de passo como "Passo X:"
                  const stepMatch = step.match(/^(Passo \d+:)(.*)$/);
                  
                  if (stepMatch) {
                    // Se for um passo com número, extrair e destacar
                    const [_, stepNumber, stepContent] = stepMatch;
                    return (
                      <div key={index} className="p-4 bg-gray-50 rounded-md border-l-4 border-indigo-500">
                        <div className="flex flex-col sm:flex-row">
                          <span className="font-bold text-indigo-700 mr-2 mb-1 sm:mb-0">
                            {stepNumber}
                          </span>
                          <p className="text-gray-800">{stepContent}</p>
                        </div>
                      </div>
                    );
                  } else {
                    // Conteúdo sem número de passo
                    return (
                      <div key={index} className="p-3 bg-gray-50 rounded-md ml-4">
                        <p className="text-gray-800">{step}</p>
                      </div>
                    );
                  }
                })}
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-md">
                <h4 className="font-medium text-blue-800 mb-2">Conceito Matemático</h4>
                <div className="space-y-2 text-gray-700">
                  <p>
                    <span className="font-semibold">Propriedades:</span> As equações trigonométricas geralmente possuem infinitas soluções devido à natureza periódica das funções trigonométricas.
                  </p>
                  <ul className="list-disc pl-5 mt-1">
                    <li><strong>Seno:</strong> Se x = α é solução de sen(x) = k, então x = α + 2nπ também é solução para qualquer inteiro n.</li>
                    <li><strong>Cosseno:</strong> Se x = α é solução de cos(x) = k, então x = ±α + 2nπ também é solução para qualquer inteiro n.</li>
                    <li><strong>Tangente:</strong> Se x = α é solução de tan(x) = k, então x = α + nπ também é solução para qualquer inteiro n.</li>
                  </ul>
                  
                  <p className="mt-2">
                    <span className="font-semibold">Método de solução:</span> As equações trigonométricas podem ser resolvidas através de:
                  </p>
                  <ul className="list-disc pl-5 mt-1">
                    <li>Uso de valores conhecidos (ângulos notáveis)</li>
                    <li>Uso de identidades trigonométricas</li>
                    <li>Métodos numéricos (para equações complexas)</li>
                    <li>Reformulação para formas mais simples</li>
                  </ul>
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