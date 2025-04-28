import { useReducer } from 'react';
import { roundToDecimals, approximatelyEqual, formatInterval } from '../../utils/mathUtils';
import { 
  radiansToDegrees, 
  evaluateTrigonometricExpression,
  parseInterval,
  getTrigonometricEquationExamples
} from '../../utils/mathUtilsTrigonometria/index';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation(['trigonometry', 'translation']);

  // Obter exemplos com base no estado atual
  const getExamples = () => {
    return getTrigonometricEquationExamples(t);
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
        message: t('trigonometry:trigonometric_equations.errors.empty_equation')
      });
      return;
    }
    
    // Verificar se a equação contém funções trigonométricas
    const hasTrigFunction = /(\d*\s*)?(sen|cos|tan|cot|sec|csc|sin|tg|cotg)(\s*\^[0-9]+)?\s*\(/i.test(state.equation);
    if (!hasTrigFunction) {
      dispatch({ 
        type: 'SET_ERROR', 
        message: t('trigonometry:trigonometric_equations.errors.no_trig_function')
      });
      return;
    }

    try {
      // Verificar a validade do intervalo
      try {
        const [testStart, testEnd] = parseInterval(state.interval);
        if (isNaN(testStart) || isNaN(testEnd)) {
          throw new Error(t('trigonometry:trigonometric_equations.errors.invalid_interval_values'));
        }
        if (testStart >= testEnd) {
          throw new Error(t('trigonometry:trigonometric_equations.errors.interval_start_greater'));
        }
      } catch (error) {
        dispatch({ 
          type: 'SET_ERROR', 
          message: t('trigonometry:trigonometric_equations.errors.interval_error', { 
            message: error instanceof Error ? error.message : String(error) 
          })
        });
        return;
      }

      // Verificar se a equação contém um sinal de igual
      if (!state.equation.includes('=')) {
        dispatch({ 
          type: 'SET_ERROR', 
          message: t('trigonometry:trigonometric_equations.errors.missing_equals')
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

        calculationSteps.push(t('trigonometry:trigonometric_equations.steps.analyze', { step: stepCount }));
        calculationSteps.push(t('trigonometry:trigonometric_equations.steps.equation', { equation: state.equation }));
        calculationSteps.push(t('trigonometry:trigonometric_equations.steps.rewrite', { left, right }));
        
        stepCount++;
        calculationSteps.push(t('trigonometry:trigonometric_equations.steps.define_interval', { step: stepCount }));
        calculationSteps.push(t('trigonometry:trigonometric_equations.steps.interval_format', { 
          start: formatInterval(start), 
          end: formatInterval(end) 
        }));
        calculationSteps.push(t('trigonometry:trigonometric_equations.steps.interval_original', { start, end }));
        
        // Método de busca de raiz
        const numSegments = 1000;
        const segmentSize = (end - start) / numSegments;
        
        stepCount++;
        calculationSteps.push(t('trigonometry:trigonometric_equations.steps.find_solutions', { step: stepCount }));
        calculationSteps.push(t('trigonometry:trigonometric_equations.steps.method', { segments: numSegments }));
        
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
          calculationSteps.push(t('trigonometry:trigonometric_equations.steps.no_solutions_found'));
          calculationSteps.push(t('trigonometry:trigonometric_equations.steps.no_solutions_reason'));
          
          dispatch({ 
            type: 'SET_RESULT', 
            result: t('trigonometry:trigonometric_equations.results.no_solutions'),
            steps: calculationSteps,
            solutions: []
          });
        } else {
          calculationSteps.push(t('trigonometry:trigonometric_equations.steps.solutions_found', { count: solutions.length }));
          
          // Formatar as soluções
          const formattedSols: FormattedSolution[] = solutions.map((solution, index) => {
            const solutionRadians = formatInterval(solution);
            const solutionDegrees = roundToDecimals(radiansToDegrees(solution), 4);
            
            calculationSteps.push(t('trigonometry:trigonometric_equations.steps.solution_value', { 
              index: index + 1, 
              radians: solutionRadians, 
              degrees: solutionDegrees 
            }));
            
            // Verificar a solução
            try {
              const leftValue = evaluateTrigonometricExpression(left, solution);
              const rightValue = evaluateTrigonometricExpression(right, solution);
              const difference = Math.abs(leftValue - rightValue);
              
              calculationSteps.push(t('trigonometry:trigonometric_equations.steps.verification', { 
                left, 
                leftValue: roundToDecimals(leftValue, 6), 
                right, 
                rightValue: roundToDecimals(rightValue, 6) 
              }));
              calculationSteps.push(t('trigonometry:trigonometric_equations.steps.difference', { 
                diff: roundToDecimals(difference, 10) 
              }));
              
              // Adicionar uma nota sobre a periodicidade
              if (state.equation.includes('sen') || state.equation.includes('sin') || state.equation.includes('cos')) {
                calculationSteps.push(t('trigonometry:trigonometric_equations.steps.periodicity_sin_cos', { 
                  solution: solutionRadians 
                }));
              } else if (state.equation.includes('tan') || state.equation.includes('tg')) {
                calculationSteps.push(t('trigonometry:trigonometric_equations.steps.periodicity_tan', { 
                  solution: solutionRadians 
                }));
              }
            } catch (error) {
              calculationSteps.push(t('trigonometry:trigonometric_equations.steps.verification_error', { 
                error 
              }));
            }
            
            return {
              radians: solutionRadians,
              degrees: solutionDegrees
            };
          });

          // Adicionar explicação sobre equações trigonométricas
          stepCount++;
          calculationSteps.push(t('trigonometry:trigonometric_equations.steps.understanding', { step: stepCount }));
          calculationSteps.push(t('trigonometry:trigonometric_equations.steps.infinite_solutions'));
          calculationSteps.push(t('trigonometry:trigonometric_equations.steps.sin_solutions'));
          calculationSteps.push(t('trigonometry:trigonometric_equations.steps.cos_solutions'));
          calculationSteps.push(t('trigonometry:trigonometric_equations.steps.tan_solutions'));
          
          // Formatar para exibição
          const resultText = formattedSols.map((sol, index) => 
            t('trigonometry:trigonometric_equations.results.solution_format', {
              index: index + 1,
              radians: sol.radians,
              degrees: sol.degrees
            })
          ).join('; ');
          
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
        let errorMessage;
        
        if (error instanceof Error) {
          if (error.message.includes('Expressão inválida')) {
            errorMessage = t('trigonometry:trigonometric_equations.errors.syntax_error');
          } else if (error.message.includes('Formato de intervalo inválido')) {
            errorMessage = t('trigonometry:trigonometric_equations.errors.process_error', { 
              message: error.message 
            });
          } else {
            errorMessage = t('trigonometry:trigonometric_equations.errors.process_error', { 
              message: error.message 
            });
          }
        } else {
          errorMessage = t('trigonometry:trigonometric_equations.errors.process_error', { 
            message: String(error) 
          });
        }
        
        dispatch({ type: 'SET_ERROR', message: errorMessage });
        return;
      }
      
    } catch (error) {
      console.error("Erro na resolução:", error);
      
      // Mensagens de erro mais amigáveis
      let errorMessage;
      
      if (error instanceof Error) {
        if (error.message.includes('SyntaxError')) {
          errorMessage = t('trigonometry:trigonometric_equations.errors.syntax_error');
        } else if (error.message.includes('Divisão por zero')) {
          errorMessage = t('trigonometry:trigonometric_equations.errors.division_by_zero');
        } else {
          errorMessage = t('trigonometry:trigonometric_equations.errors.solve_error', { 
            message: error.message 
          });
        }
      } else {
        errorMessage = t('trigonometry:trigonometric_equations.errors.solve_error', { 
          message: String(error) 
        });
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