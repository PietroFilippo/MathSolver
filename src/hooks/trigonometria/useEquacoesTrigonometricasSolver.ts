import { useReducer } from 'react';
import { roundToDecimals, approximatelyEqual, formatInterval } from '../../utils/mathUtils';
import { 
  radiansToDegrees, 
  evaluateTrigonometricExpression,
  parseInterval,
  getTrigonometricEquationExamples
} from '../../utils/mathUtilsTrigonometria';

// Definições de tipo
interface FormattedSolution {
  radians: string;
  degrees: number;
}

// Interface para o estado das equações trigonométricas
interface EquacoesTrigonometricasState {
  equation: string;
  interval: string;
  result: string | null;
  explanationSteps: string[];
  error: string | null;
  formattedSolutions: FormattedSolution[];
  showExplanation: boolean;
  showConceitoMatematico: boolean;
}

// Tipos de ações para o reducer
type EquacoesTrigonometricasAction =
  | { type: 'SET_EQUATION'; value: string }
  | { type: 'SET_INTERVAL'; value: string }
  | { type: 'SET_RESULT'; result: string; steps: string[]; solutions: FormattedSolution[] }
  | { type: 'SET_ERROR'; message: string }
  | { type: 'TOGGLE_EXPLANATION' }
  | { type: 'TOGGLE_CONCEITO_MATEMATICO' }
  | { type: 'RESET' }
  | { type: 'APPLY_EXAMPLE'; example: any };

// Estado inicial
const initialState: EquacoesTrigonometricasState = {
  equation: '',
  interval: '0,2π',
  result: null,
  explanationSteps: [],
  error: null,
  formattedSolutions: [],
  showExplanation: true,
  showConceitoMatematico: true
};

// Função reducer
function equacoesTrigonometricasReducer(
  state: EquacoesTrigonometricasState, 
  action: EquacoesTrigonometricasAction
): EquacoesTrigonometricasState {
  switch (action.type) {
    case 'SET_EQUATION':
      return { ...state, equation: action.value };
    case 'SET_INTERVAL':
      return { ...state, interval: action.value };
    case 'SET_RESULT':
      return {
        ...state,
        result: action.result,
        explanationSteps: action.steps,
        formattedSolutions: action.solutions,
        error: null,
        showExplanation: true
      };
    case 'SET_ERROR':
      return { 
        ...state, 
        error: action.message, 
        result: null, 
        explanationSteps: [],
        formattedSolutions: []
      };
    case 'TOGGLE_EXPLANATION':
      return { ...state, showExplanation: !state.showExplanation };
    case 'TOGGLE_CONCEITO_MATEMATICO':
      return { ...state, showConceitoMatematico: !state.showConceitoMatematico };
    case 'RESET':
      return {
        ...state,
        result: null,
        explanationSteps: [],
        error: null,
        formattedSolutions: []
      };
    case 'APPLY_EXAMPLE':
      const example = action.example;
      
      return { 
        ...state,
        equation: example.equation,
        interval: example.interval,
        result: null,
        explanationSteps: [],
        formattedSolutions: [],
        error: null
      };
    default:
      return state;
  }
}

export function useEquacoesTrigonometricasSolver() {
  const [state, dispatch] = useReducer(equacoesTrigonometricasReducer, initialState);

  // Obter exemplos com base no estado atual
  const getExamples = () => {
    return getTrigonometricEquationExamples();
  };

  // Aplicar um exemplo ao estado atual
  const applyExample = (example: any) => {
    dispatch({ type: 'APPLY_EXAMPLE', example });
  };

  // Função principal de resolução
  const handleSolve = () => {
    // Resetar o estado anterior
    dispatch({ type: 'RESET' });
    
    // Validar a entrada
    if (!state.equation.trim()) {
      dispatch({ 
        type: 'SET_ERROR', 
        message: 'Por favor, insira uma equação trigonométrica.' 
      });
      return;
    }
    
    // Verificar se a equação contém funções trigonométricas
    const hasTrigFunction = /(\d*\s*)?(sen|cos|tan|cot|sec|csc|sin|tg|cotg)(\s*\^[0-9]+)?\s*\(/i.test(state.equation);
    if (!hasTrigFunction) {
      dispatch({ 
        type: 'SET_ERROR', 
        message: 'Sua entrada deve conter pelo menos uma função trigonométrica (sen, cos, tan, etc.).' 
      });
      return;
    }

    try {
      // Verificar a validade do intervalo
      try {
        const [testStart, testEnd] = parseInterval(state.interval);
        if (isNaN(testStart) || isNaN(testEnd)) {
          throw new Error('Os limites do intervalo devem ser valores numéricos válidos.');
        }
        if (testStart >= testEnd) {
          throw new Error('O limite inferior deve ser menor que o limite superior.');
        }
      } catch (error) {
        dispatch({ 
          type: 'SET_ERROR', 
          message: `Erro no intervalo: ${error instanceof Error ? error.message : String(error)}` 
        });
        return;
      }

      // Verificar se a equação contém um sinal de igual
      if (!state.equation.includes('=')) {
        dispatch({ 
          type: 'SET_ERROR', 
          message: 'A equação deve conter um sinal de igual (=).' 
        });
        return;
      }

      // Dividir a equação
      const [left, right] = state.equation.split('=').map(side => side.trim());
      
      // Criar a função de diferença
      const difFunction = (x: number): number => {
        try {
          const leftValue = evaluateTrigonometricExpression(left, x);
          const rightValue = evaluateTrigonometricExpression(right, x);
          return leftValue - rightValue;
        } catch (error) {
          return NaN;
        }
      };

      // Analisar o intervalo e encontrar soluções
      try {
        let [start, end] = parseInterval(state.interval);
        
        // Iniciar os passos da solução
        const calculationSteps: string[] = [];
        let stepCount = 1;

        calculationSteps.push(`Passo ${stepCount}: Analisar a equação trigonométrica`);
        calculationSteps.push(`Equação: ${state.equation}`);
        calculationSteps.push(`Reescrevendo como: ${left} - (${right}) = 0`);
        
        stepCount++;
        calculationSteps.push(`Passo ${stepCount}: Definir o intervalo de busca`);
        calculationSteps.push(`Intervalo: [${formatInterval(start)}, ${formatInterval(end)}]`);
        calculationSteps.push(`Valores originais do intervalo: [${start}, ${end}]`);
        
        // Método de busca de raiz
        const numSegments = 1000;
        const segmentSize = (end - start) / numSegments;
        
        stepCount++;
        calculationSteps.push(`Passo ${stepCount}: Buscar soluções no intervalo`);
        calculationSteps.push(`Método: Busca por mudanças de sinal da função diferença em ${numSegments} segmentos`);
        
        const solutions: number[] = [];
        const precisionBisection = 1e-10;
        const maxIterationsBisection = 20;
        
        for (let i = 0; i < numSegments; i++) {
          const x1 = start + i * segmentSize;
          const x2 = x1 + segmentSize;
          
          try {
            const y1 = difFunction(x1);
            const y2 = difFunction(x2);
            
            // Mudança de sinal indica uma raiz
            if (y1 * y2 <= 0 && !isNaN(y1) && !isNaN(y2)) {
              // Método de bissecção para refinar
              let a = x1;
              let b = x2;
              let c: number;
              let fa = y1;
              let fc: number;
              
              // Refinar a solução
              for (let j = 0; j < maxIterationsBisection; j++) {
                c = (a + b) / 2;
                fc = difFunction(c);
                
                // Se a precisão foi atingida
                if (Math.abs(fc) < precisionBisection || (b - a) < precisionBisection) {
                  break;
                }
                
                // Atualizar o intervalo
                if (fa * fc < 0) {
                  b = c;
                } else {
                  a = c;
                  fa = fc;
                }
              }
              
              // Adicionar a solução
              const solution = (a + b) / 2;
              
              // Verificar se a solução é válida
              if (!isFinite(solution)) continue;
              
              // Verificar se a solução resolve a equação
              const functionValue = difFunction(solution);
              if (Math.abs(functionValue) > 1e-5) continue;
              
              // Verificar se a solução já existe
              const alreadyExists = solutions.some(s => {
                return approximatelyEqual(s, solution, 1e-6) ||
                       approximatelyEqual(s, solution + 2 * Math.PI, 1e-6) ||
                       approximatelyEqual(s, solution - 2 * Math.PI, 1e-6);
              });
              
              if (!alreadyExists) {
                // Verificar a solução
                try {
                  const leftValue = evaluateTrigonometricExpression(left, solution);
                  const rightValue = evaluateTrigonometricExpression(right, solution);
                  const difference = Math.abs(leftValue - rightValue);
                  
                  if (difference < 1e-5) {
                    solutions.push(solution);
                  }
                } catch (error) {
                  // Ignorar erros
                }
              }
            }
          } catch (error) {
            // Ignorar erros de avaliação
            continue;
          }
        }
        
        // Ordenar as soluções
        solutions.sort((a, b) => a - b);
        
        // Formatar os resultados
        if (solutions.length === 0) {
          calculationSteps.push(`Não foram encontradas soluções no intervalo especificado.`);
          calculationSteps.push(`Isso pode ocorrer porque a equação não tem solução no intervalo ou porque a função não muda de sinal.`);
          
          dispatch({ 
            type: 'SET_RESULT', 
            result: 'Não foram encontradas soluções no intervalo especificado.',
            steps: calculationSteps,
            solutions: []
          });
        } else {
          calculationSteps.push(`Foram encontradas ${solutions.length} soluções no intervalo especificado:`);
          
          // Formatar as soluções
          const formattedSols: FormattedSolution[] = solutions.map((solution, index) => {
            const solutionRadians = formatInterval(solution);
            const solutionDegrees = roundToDecimals(radiansToDegrees(solution), 4);
            
            calculationSteps.push(`Solução ${index + 1}: x = ${solutionRadians} rad = ${solutionDegrees}°`);
            
            // Verificar a solução
            try {
              const leftValue = evaluateTrigonometricExpression(left, solution);
              const rightValue = evaluateTrigonometricExpression(right, solution);
              const difference = Math.abs(leftValue - rightValue);
              
              calculationSteps.push(`Verificação: ${left} = ${roundToDecimals(leftValue, 6)}, ${right} = ${roundToDecimals(rightValue, 6)}`);
              calculationSteps.push(`Diferença: ${roundToDecimals(difference, 10)} (deve ser próxima de zero)`);
              
              // Adicionar uma nota sobre a periodicidade
              if (state.equation.includes('sen') || state.equation.includes('sin') || state.equation.includes('cos')) {
                calculationSteps.push(`Observe que ${solutionRadians} + 2nπ também é solução para qualquer inteiro n.`);
              } else if (state.equation.includes('tan') || state.equation.includes('tg')) {
                calculationSteps.push(`Observe que ${solutionRadians} + nπ também é solução para qualquer inteiro n.`);
              }
            } catch (error) {
              calculationSteps.push(`Não foi possível verificar esta solução: ${error}`);
            }
            
            return {
              radians: solutionRadians,
              degrees: solutionDegrees
            };
          });

          // Adicionar explicação sobre equações trigonométricas
          stepCount++;
          calculationSteps.push(`Passo ${stepCount}: Entendendo equações trigonométricas`);
          calculationSteps.push(`As equações trigonométricas geralmente têm infinitas soluções devido à natureza periódica das funções trigonométricas.`);
          calculationSteps.push(`Por exemplo, se x = α é uma solução de sen(x) = k, então x = α + 2nπ também é uma solução para qualquer inteiro n.`);
          calculationSteps.push(`Para cos(x) = k, se x = α é uma solução, então x = ±α + 2nπ também é uma solução.`);
          calculationSteps.push(`Para tan(x) = k, se x = α é uma solução, então x = α + nπ também é uma solução.`);
          
          // Formatar para exibição
          const resultText = `Soluções encontradas: ${formattedSols.map(sol => 
            `x = ${sol.radians} rad = ${sol.degrees}°`
          ).join('; ')}`;
          
          dispatch({ 
            type: 'SET_RESULT', 
            result: resultText,
            steps: calculationSteps,
            solutions: formattedSols
          });
        }
        
      } catch (error) {
        console.error("Erro ao analisar intervalo:", error);
        
        // Melhorar a mensagem de erro
        let errorMessage = `Erro ao processar o intervalo: ${error instanceof Error ? error.message : String(error)}`;
        
        if (error instanceof Error) {
          if (error.message.includes('Expressão inválida')) {
            errorMessage = "Formato de intervalo inválido. Use formatos como '0,2π', '-π,π', ou '0,6.28'. " +
              "Para representar π, use o símbolo π ou 'pi'. Para multiplicar, use por exemplo '2*π' ou '2π'.";
          } else if (error.message.includes('Formato de intervalo inválido')) {
            errorMessage = "O intervalo deve ser especificado como 'início,fim', por exemplo: '0,2π' ou '-π,π'";
          }
        }
        
        dispatch({ type: 'SET_ERROR', message: errorMessage });
        return;
      }
      
    } catch (error) {
      console.error("Erro na resolução:", error);
      
      // Mensagens de erro mais amigáveis
      let errorMessage = `Erro ao resolver a equação: ${error instanceof Error ? error.message : String(error)}`;
      
      if (error instanceof Error && error.message.includes('SyntaxError')) {
        errorMessage = "Há um erro de sintaxe na equação. Verifique se você escreveu corretamente as funções trigonométricas e operadores. " +
          "Por exemplo, use '2*sen(x)' ou deixe sem espaços entre o número e a função: '2sen(x)'.";
      } else if (error instanceof Error && error.message.includes('Divisão por zero')) {
        errorMessage = "Ocorreu uma divisão por zero ao avaliar a equação. Verifique se você está usando funções como tan(x) em pontos onde elas não são definidas.";
      }
      
      dispatch({ type: 'SET_ERROR', message: errorMessage });
    }
  };

  // Retornar o estado e as funções
  return {
    state,
    dispatch,
    getExamples,
    applyExample,
    handleSolve
  };
} 