import { useReducer } from 'react';
import { roundToDecimals } from '../../utils/mathUtils';

// Definições de tipo
type OperationType = 'percentage' | 'percentageChange' | 'reversePercentage';

// Interface de estado
type State = {
  value: string;
  percentage: string;
  result: number | null;
  operationType: OperationType;
  steps: string[];
  errorMessage: string | null;
  showExplanation: boolean;
  showConceitoMatematico: boolean;
};

// Tipos de ações
type Action =
  | { type: 'SET_VALUE'; value: string }
  | { type: 'SET_PERCENTAGE'; value: string }
  | { type: 'SET_OPERATION_TYPE'; operationType: OperationType }
  | { type: 'RESET_CALCULATION' }
  | { type: 'SET_RESULT'; result: number; steps: string[] }
  | { type: 'SET_ERROR'; message: string }
  | { type: 'TOGGLE_EXPLANATION' }
  | { type: 'TOGGLE_CONCEITO_MATEMATICO' }
  | { type: 'APPLY_EXAMPLE'; example: { value?: string; percentage?: string; operationType?: OperationType } };

// Estado inicial
const initialState: State = {
  value: '',
  percentage: '',
  result: null,
  operationType: 'percentage',
  steps: [],
  errorMessage: null,
  showExplanation: false,
  showConceitoMatematico: true,
};

// Função reducer
function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_VALUE':
      return { ...state, value: action.value };
    case 'SET_PERCENTAGE':
      return { ...state, percentage: action.value };
    case 'SET_OPERATION_TYPE':
      return { ...state, operationType: action.operationType };
    case 'RESET_CALCULATION':
      return {
        ...state,
        result: null,
        steps: [],
        errorMessage: null,
        showExplanation: false
      };
    case 'SET_RESULT':
      return {
        ...state,
        result: action.result,
        steps: action.steps,
        errorMessage: null,
        showExplanation: true
      };
    case 'SET_ERROR':
      return {
        ...state,
        errorMessage: action.message,
        result: null,
        steps: []
      };
    case 'TOGGLE_EXPLANATION':
      return { ...state, showExplanation: !state.showExplanation };
    case 'TOGGLE_CONCEITO_MATEMATICO':
      return { ...state, showConceitoMatematico: !state.showConceitoMatematico };
    case 'APPLY_EXAMPLE':
      return {
        ...state,
        value: action.example.value !== undefined ? action.example.value : state.value,
        percentage: action.example.percentage !== undefined ? action.example.percentage : state.percentage,
        operationType: action.example.operationType || state.operationType,
      };
    default:
      return state;
  }
}

export function usePercentageSolver() {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Função principal de resolução
  const handleSolve = () => {
    dispatch({ type: 'RESET_CALCULATION' });
    
    try {
      const value = parseFloat(state.value.replace(',', '.'));
      const percentage = parseFloat(state.percentage.replace(',', '.'));
      
      // Validar as entradas
      if (state.value.trim() === '' || isNaN(value)) {
        dispatch({ type: 'SET_ERROR', message: 'Por favor, insira um valor válido.' });
        return;
      }
      
      if (state.percentage.trim() === '' || isNaN(percentage)) {
        dispatch({ type: 'SET_ERROR', message: 'Por favor, insira uma porcentagem válida.' });
        return;
      }
      
      let result: number;
      const calculationSteps: string[] = [];
      let stepCount = 1;
      
      switch (state.operationType) {
        case 'percentage':
          // Calcular x% de y
          result = (percentage / 100) * value;
          result = roundToDecimals(result, 4);
          
          calculationSteps.push(`Equação original: Calcular ${percentage}% de ${value}`);
          calculationSteps.push(`Passo ${stepCount++}: Convertemos a porcentagem para decimal dividindo por 100: ${percentage}% = ${percentage} ÷ 100 = ${percentage / 100}`);
          calculationSteps.push(`Passo ${stepCount++}: Multiplicamos o valor pelo decimal: ${value} × ${percentage / 100} = ${result}`);
          calculationSteps.push(`Resultado: ${percentage}% de ${value} é igual a ${result}.`);
          
          // Adicionar verificação
          calculationSteps.push('---VERIFICATION_SEPARATOR---');
          calculationSteps.push(`Verificação do resultado:`);
          calculationSteps.push(`Calculando: qual porcentagem ${result} representa de ${value}:`);
          calculationSteps.push(`Simplificando: ${result} ÷ ${value} × 100 = ${(result / value) * 100}%`);
          calculationSteps.push(`Verificação concluída: (${(result / value) * 100}% ≈ ${percentage}%) (Correto!)`);
          break;
          
        case 'percentageChange':
          // Calcular a variação percentual
          result = ((value - percentage) / percentage) * 100;
          result = roundToDecimals(result, 2);
          
          calculationSteps.push(`Equação original: Calcular a variação percentual entre ${percentage} (valor inicial) e ${value} (valor final)`);
          calculationSteps.push(`Passo ${stepCount++}: Calculamos a diferença entre os valores: ${value} - ${percentage} = ${value - percentage}`);
          calculationSteps.push(`Passo ${stepCount++}: Dividimos a diferença pelo valor inicial: (${value} - ${percentage}) ÷ ${percentage} = ${(value - percentage) / percentage}`);
          calculationSteps.push(`Passo ${stepCount++}: Multiplicamos por 100 para obter a porcentagem: ${(value - percentage) / percentage} × 100 = ${result}%`);
          
          if (result > 0) {
            calculationSteps.push(`Resultado: Houve um aumento de ${result}% do valor inicial para o valor final.`);
          } else if (result < 0) {
            calculationSteps.push(`Resultado: Houve uma redução de ${Math.abs(result)}% do valor inicial para o valor final.`);
          } else {
            calculationSteps.push(`Resultado: Não houve variação percentual entre os valores.`);
          }
          
          // Adicionar verificação
          calculationSteps.push('---VERIFICATION_SEPARATOR---');
          calculationSteps.push(`Verificação do resultado:`);
          const finalValue = percentage * (1 + result / 100);
          calculationSteps.push(`Calculando: aplicando a variação percentual de ${result}% ao valor inicial ${percentage}:`);
          calculationSteps.push(`Simplificando: ${percentage} × (1 + ${result} ÷ 100) = ${percentage} × ${1 + result / 100} = ${finalValue}`);
          calculationSteps.push(`Verificação concluída: O valor final calculado ${finalValue} ${Math.abs(finalValue - value) < 0.01 ? "✓ (Correto!)" : "≈"} ${value}`);
          break;
          
        case 'reversePercentage':
          // Calcular o valor original dado um valor após a aplicação da porcentagem
          result = value / (1 + percentage / 100);
          result = roundToDecimals(result, 4);
          
          calculationSteps.push(`Equação original: Encontrar o valor original antes de um aumento de ${percentage}%`);
          calculationSteps.push(`Passo ${stepCount++}: Convertemos a porcentagem para decimal e adicionamos 1: 1 + ${percentage} ÷ 100 = 1 + ${percentage / 100} = ${1 + percentage / 100}`);
          calculationSteps.push(`Passo ${stepCount++}: Dividimos o valor atual pelo resultado: ${value} ÷ ${1 + percentage / 100} = ${result}`);
          calculationSteps.push(`Resultado: O valor original antes do aumento de ${percentage}% era ${result}.`);
          
          // Adicionar verificação
          calculationSteps.push('---VERIFICATION_SEPARATOR---');
          calculationSteps.push(`Verificação do resultado:`);
          const afterIncrease = result * (1 + percentage / 100);
          calculationSteps.push(`Calculando: aplicando um aumento de ${percentage}% ao valor original ${result}:`);
          calculationSteps.push(`Simplificando: ${result} × (1 + ${percentage} ÷ 100) = ${result} × ${1 + percentage / 100} = ${afterIncrease}`);
          calculationSteps.push(`Verificação concluída: O valor após o aumento ${afterIncrease} ${Math.abs(afterIncrease - value) < 0.01 ? "✓ (Correto!)" : "≈"} ${value}`);
          break;
          
        default:
          dispatch({ type: 'SET_ERROR', message: 'Tipo de operação inválido.' });
          return;
      }
      
      dispatch({ type: 'SET_RESULT', result, steps: calculationSteps });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', message: error instanceof Error ? error.message : 'Erro desconhecido.' });
    }
  };

  // Aplicar um exemplo ao estado atual
  const applyExample = (example: { 
    value?: string | number; 
    percentage?: string | number; 
    operationType?: OperationType;
    type?: OperationType; 
  }) => {
    dispatch({ 
      type: 'APPLY_EXAMPLE', 
      example: {
        value: example.value !== undefined ? String(example.value) : undefined,
        percentage: example.percentage !== undefined ? String(example.percentage) : undefined,
        operationType: example.operationType || example.type
      } 
    });
  };

  // Definir o tipo de operação
  const setOperationType = (operationType: OperationType) => {
    dispatch({ type: 'SET_OPERATION_TYPE', operationType });
  };

  // Retornar o estado e as funções
  return {
    state,
    dispatch,
    handleSolve,
    applyExample,
    setOperationType
  };
} 