import { useReducer } from 'react';
import { roundToDecimals } from '../../utils/mathUtils';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation(['arithmetic', 'translation']);

  // Função principal de resolução
  const handleSolve = () => {
    dispatch({ type: 'RESET_CALCULATION' });
    
    try {
      const value = parseFloat(state.value.replace(',', '.'));
      const percentage = parseFloat(state.percentage.replace(',', '.'));
      
      // Validar as entradas
      if (state.value.trim() === '' || isNaN(value)) {
        dispatch({ type: 'SET_ERROR', message: t('arithmetic:percentage.errors.invalid_value') });
        return;
      }
      
      if (state.percentage.trim() === '' || isNaN(percentage)) {
        dispatch({ type: 'SET_ERROR', message: t('arithmetic:percentage.errors.invalid_percentage') });
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
          
          calculationSteps.push(t('arithmetic:percentage.steps.original_equation', { percentage, value }));
          calculationSteps.push(`${t('translation:common.step')} ${stepCount++}: ${t('arithmetic:percentage.steps.convert_percentage', { percentage, decimal: percentage / 100 })}`);
          calculationSteps.push(`${t('translation:common.step')} ${stepCount++}: ${t('arithmetic:percentage.steps.multiply_value', { value, decimal: percentage / 100, result })}`);
          calculationSteps.push(`${t('translation:common.result')}: ${t('arithmetic:percentage.steps.result', { percentage, value, result })}`);
          
          // Adicionar verificação
          calculationSteps.push('---VERIFICATION_SEPARATOR---');
          calculationSteps.push(`${t('translation:common.verification')}:`);
          calculationSteps.push(`${t('arithmetic:percentage.steps.verification.calculating', { result, value })}:`);
          calculationSteps.push(`${t('arithmetic:percentage.steps.verification.simplifying', { result, value, percentage: (result / value) * 100 })}`);
          
          // Determinar se a verificação é correta - sem sintaxe de handlebars
          const calculatedPercentage = (result / value) * 100;
          const isCorrectPercentage = Math.abs(calculatedPercentage - percentage) < 0.01;
          const verificationText = isCorrectPercentage 
            ? `verification.completed: ${t('arithmetic:percentage.steps.verification.completed', { calculated: calculatedPercentage, original: percentage })} ✓`
            : `verification.completed: ${t('arithmetic:percentage.steps.verification.completed', { calculated: calculatedPercentage, original: percentage })}`;
            
          calculationSteps.push(verificationText);
          break;
          
        case 'percentageChange':
          // Calcular a variação percentual
          result = ((value - percentage) / percentage) * 100;
          result = roundToDecimals(result, 2);
          
          calculationSteps.push(t('arithmetic:percentage.steps.percentageChange.original_equation', { initialValue: percentage, value }));
          calculationSteps.push(`${t('translation:common.step')} ${stepCount++}: ${t('arithmetic:percentage.steps.percentageChange.calculate_difference', { value, initialValue: percentage, difference: value - percentage })}`);
          calculationSteps.push(`${t('translation:common.step')} ${stepCount++}: ${t('arithmetic:percentage.steps.percentageChange.divide_difference', { value, initialValue: percentage, division: (value - percentage) / percentage })}`);
          calculationSteps.push(`${t('translation:common.step')} ${stepCount++}: ${t('arithmetic:percentage.steps.percentageChange.multiply_100', { division: (value - percentage) / percentage, result })}`);
          
          if (result > 0) {
            calculationSteps.push(`${t('translation:common.result')}: ${t('arithmetic:percentage.steps.percentageChange.result_increase', { result })}`);
          } else if (result < 0) {
            calculationSteps.push(`${t('translation:common.result')}: ${t('arithmetic:percentage.steps.percentageChange.result_decrease', { result: Math.abs(result) })}`);
          } else {
            calculationSteps.push(`${t('translation:common.result')}: ${t('arithmetic:percentage.steps.percentageChange.result_no_change')}`);
          }
          
          // Adicionar verificação
          calculationSteps.push('---VERIFICATION_SEPARATOR---');
          calculationSteps.push(`${t('translation:common.verification')}:`);
          const finalValue = percentage * (1 + result / 100);
          calculationSteps.push(`${t('arithmetic:percentage.steps.percentageChange.verification.calculating', { result, initialValue: percentage })}:`);
          calculationSteps.push(`${t('arithmetic:percentage.steps.percentageChange.verification.simplifying', { initialValue: percentage, result, calculation: finalValue })}`);
          
          // Determinar se a verificação é correta - sem sintaxe de handlebars
          const isCorrectFinalValue = Math.abs(finalValue - value) < 0.01;
          const finalValueVerificationText = isCorrectFinalValue
            ? `verification.completed: ${t('arithmetic:percentage.steps.percentageChange.verification.completed', { calculated: finalValue, original: value })} ✓`
            : `verification.completed: ${t('arithmetic:percentage.steps.percentageChange.verification.completed', { calculated: finalValue, original: value })}`;
            
          calculationSteps.push(finalValueVerificationText);
          break;
          
        case 'reversePercentage':
          // Calcular o valor original dado um valor após a aplicação da porcentagem
          result = value / (1 + percentage / 100);
          result = roundToDecimals(result, 4);
          
          calculationSteps.push(t('arithmetic:percentage.steps.reversePercentage.original_equation', { percentageIncrease: percentage }));
          calculationSteps.push(`${t('translation:common.step')} ${stepCount++}: ${t('arithmetic:percentage.steps.reversePercentage.convert_percentage', { percentageIncrease: percentage, conversion: 1 + percentage / 100 })}`);
          calculationSteps.push(`${t('translation:common.step')} ${stepCount++}: ${t('arithmetic:percentage.steps.reversePercentage.divide_value', { currentValue: value, divisor: 1 + percentage / 100, result })}`);
          calculationSteps.push(`${t('translation:common.result')}: ${t('arithmetic:percentage.steps.reversePercentage.result', { percentageIncrease: percentage, result })}`);
          
          // Adicionar verificação
          calculationSteps.push('---VERIFICATION_SEPARATOR---');
          calculationSteps.push(`${t('translation:common.verification')}:`);
          const afterIncrease = result * (1 + percentage / 100);
          calculationSteps.push(`${t('arithmetic:percentage.steps.reversePercentage.verification.calculating', { percentageIncrease: percentage, result })}:`);
          calculationSteps.push(`${t('arithmetic:percentage.steps.reversePercentage.verification.simplifying', { result, percentageIncrease: percentage, calculation: afterIncrease })}`);
          
          // Determine if verification is correct - no handlebars syntax
          const isCorrectAfterIncrease = Math.abs(afterIncrease - value) < 0.01;
          const afterIncreaseVerificationText = isCorrectAfterIncrease
            ? `verification.completed: ${t('arithmetic:percentage.steps.reversePercentage.verification.completed', { calculated: afterIncrease, original: value })} ✓`
            : `verification.completed: ${t('arithmetic:percentage.steps.reversePercentage.verification.completed', { calculated: afterIncrease, original: value })}`;
            
          calculationSteps.push(afterIncreaseVerificationText);
          break;
          
        default:
          dispatch({ type: 'SET_ERROR', message: t('arithmetic:percentage.errors.invalid_operation') });
          return;
      }
      
      dispatch({ type: 'SET_RESULT', result, steps: calculationSteps });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', message: error instanceof Error ? error.message : t('translation:common.errors.unknown') });
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