import { useReducer } from 'react';
import { gcd, lcm } from '../../utils/mathUtils';
import { useTranslation } from 'react-i18next';

// Definições de tipo
type CalculationType = 'mdc' | 'mmc';

// Interface de estado
type State = {
  calculationType: CalculationType;
  inputNumbers: string;
  numbers: number[] | null;
  result: number | null;
  steps: string[];
  errorMessage: string | null;
  showExplanation: boolean;
  showConceitoMatematico: boolean;
};

// Tipos de ações
type Action =
  | { type: 'SET_CALCULATION_TYPE'; calculationType: CalculationType }
  | { type: 'SET_INPUT_NUMBERS'; value: string }
  | { type: 'RESET_CALCULATION' }
  | { type: 'SET_RESULT'; numbers: number[]; result: number; steps: string[] }
  | { type: 'SET_ERROR'; message: string }
  | { type: 'TOGGLE_EXPLANATION' }
  | { type: 'TOGGLE_CONCEITO_MATEMATICO' }
  | { type: 'APPLY_EXAMPLE'; example: { numbers: number[] } };

// Estado inicial
const initialState: State = {
  calculationType: 'mdc',
  inputNumbers: '',
  numbers: null,
  result: null,
  steps: [],
  errorMessage: null,
  showExplanation: false,
  showConceitoMatematico: true,
};

// Função reducer
function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_CALCULATION_TYPE':
      return { ...state, calculationType: action.calculationType };
    case 'SET_INPUT_NUMBERS':
      return { ...state, inputNumbers: action.value };
    case 'RESET_CALCULATION':
      return {
        ...state,
        numbers: null,
        result: null,
        steps: [],
        errorMessage: null,
        showExplanation: false
      };
    case 'SET_RESULT':
      return {
        ...state,
        numbers: action.numbers,
        result: action.result,
        steps: action.steps,
        errorMessage: null,
        showExplanation: true
      };
    case 'SET_ERROR':
      return {
        ...state,
        errorMessage: action.message,
        numbers: null,
        result: null,
        steps: []
      };
    case 'TOGGLE_EXPLANATION':
      return { ...state, showExplanation: !state.showExplanation };
    case 'TOGGLE_CONCEITO_MATEMATICO':
      return { ...state, showConceitoMatematico: !state.showConceitoMatematico };
    case 'APPLY_EXAMPLE':
      return { ...state, inputNumbers: action.example.numbers.join(', ') };
    default:
      return state;
  }
}

// Gerar passos para cálculo do MDC de dois números (versão para uso interno)
function generateGcdStepsForTwoNumbers(a: number, b: number, stepCountRef: { count: number }, t: any): string[] {
  const calculationSteps: string[] = [];
  
  calculationSteps.push(t('arithmetic:gcd_lcm.steps.gcd.calculating', { a, b }));
  
  // Copiar os números para evitar a modificação dos originais
  let num1 = Math.max(a, b);
  let num2 = Math.min(a, b);
  
  calculationSteps.push(t('arithmetic:gcd_lcm.steps.gcd.organize_numbers', { num1, num2 }));
  
  let remainder = -1;
  
  while (num2 !== 0) {
    remainder = num1 % num2;
    calculationSteps.push(t('arithmetic:gcd_lcm.steps.gcd.division_step', { 
      step: stepCountRef.count++, 
      num1, 
      num2, 
      quotient: Math.floor(num1 / num2), 
      remainder 
    }));
    
    num1 = num2;
    num2 = remainder;
  }
  
  calculationSteps.push(t('arithmetic:gcd_lcm.steps.gcd.result', { num1 }));
  
  // Adicionar verificação
  calculationSteps.push('---VERIFICATION_SEPARATOR---');
  calculationSteps.push(t('arithmetic:gcd_lcm.steps.gcd.verification_intro', { gcd: num1 }));
  
  // Cálculos para verificação
  const original1 = Math.max(a, b);
  const original2 = Math.min(a, b);
  calculationSteps.push(t('arithmetic:gcd_lcm.steps.gcd.verification_step', { 
    number: original1, 
    gcd: num1, 
    result: original1 / num1 
  }));
  calculationSteps.push(t('arithmetic:gcd_lcm.steps.gcd.verification_step', { 
    number: original2, 
    gcd: num1, 
    result: original2 / num1 
  }));
  
  return calculationSteps;
}

// Gerar passos para cálculo do MDC de vários números
function generateGcdStepsForMultipleNumbers(numbers: number[], t: any): string[] {
  const calculationSteps: string[] = [];
  let stepCountRef = { count: 1 };
  
  if (numbers.length === 0) return calculationSteps;
  
  if (numbers.length === 1) {
    calculationSteps.push(t('arithmetic:gcd_lcm.steps.gcd.single_number', { number: numbers[0] }));
    return calculationSteps;
  }
  
  calculationSteps.push(t('arithmetic:gcd_lcm.steps.gcd.multiple_numbers_intro', { numbers: numbers.join(', ') }));
  calculationSteps.push(t('arithmetic:gcd_lcm.steps.gcd.start_with_two', { 
    step: stepCountRef.count++, 
    first: numbers[0], 
    second: numbers[1] 
  }));
  
  let currentGcd = numbers[0];
  
  for (let i = 1; i < numbers.length; i++) {
    calculationSteps.push(t('arithmetic:gcd_lcm.steps.gcd.calculate_pair', { 
      step: stepCountRef.count++, 
      currentGcd, 
      nextNumber: numbers[i] 
    }));
    
    // Gerar passos para este par
    const pairSteps = generateGcdStepsForTwoNumbers(currentGcd, numbers[i], stepCountRef, t);
    calculationSteps.push(...pairSteps);
    
    currentGcd = gcd(currentGcd, numbers[i]);
    calculationSteps.push(t('arithmetic:gcd_lcm.steps.gcd.current_result', { currentGcd }));
    
    if (currentGcd === 1) {
      calculationSteps.push(t('arithmetic:gcd_lcm.steps.gcd.stop_at_one'));
      break;
    }
  }
  
  calculationSteps.push(t('arithmetic:gcd_lcm.steps.gcd.final_result', { 
    numbers: numbers.join(', '), 
    result: currentGcd 
  }));
  
  return calculationSteps;
}

// Gerar passos para cálculo do MMC de dois números
function generateLcmStepsForTwoNumbers(a: number, b: number, stepCountRef: { count: number }, t: any): string[] {
  const calculationSteps: string[] = [];
  
  calculationSteps.push(t('arithmetic:gcd_lcm.steps.lcm.calculating', { a, b }));
  calculationSteps.push(t('arithmetic:gcd_lcm.steps.lcm.formula_intro', { step: stepCountRef.count++ }));
  
  calculationSteps.push(t('arithmetic:gcd_lcm.steps.lcm.calculate_gcd_first', { step: stepCountRef.count++, a, b }));
  const gcdSteps = generateGcdStepsForTwoNumbers(a, b, stepCountRef, t);
  calculationSteps.push(...gcdSteps);
  
  const gcdValue = gcd(a, b);
  calculationSteps.push(t('arithmetic:gcd_lcm.steps.lcm.gcd_result', { a, b, gcdValue }));
  
  const lcmValue = (a * b) / gcdValue;
  calculationSteps.push(t('arithmetic:gcd_lcm.steps.lcm.apply_formula', { 
    step: stepCountRef.count++, 
    a, 
    b, 
    gcdValue, 
    product: a * b, 
    lcmValue 
  }));
  
  // Adicionar verificação
  calculationSteps.push('---VERIFICATION_SEPARATOR---');
  calculationSteps.push(t('arithmetic:gcd_lcm.steps.lcm.verification_intro', { lcmValue }));
  calculationSteps.push(t('arithmetic:gcd_lcm.steps.lcm.verification_step', { 
    lcmValue, 
    number: a, 
    result: lcmValue / a 
  }));
  calculationSteps.push(t('arithmetic:gcd_lcm.steps.lcm.verification_step', { 
    lcmValue, 
    number: b, 
    result: lcmValue / b 
  }));
  
  return calculationSteps;
}

// Gerar passos para cálculo do MMC de vários números
function generateLcmStepsForMultipleNumbers(numbers: number[], t: any): string[] {
  const calculationSteps: string[] = [];
  let stepCountRef = { count: 1 };
  
  if (numbers.length === 0) return calculationSteps;
  
  if (numbers.length === 1) {
    calculationSteps.push(t('arithmetic:gcd_lcm.steps.lcm.single_number', { number: numbers[0] }));
    return calculationSteps;
  }
  
  calculationSteps.push(t('arithmetic:gcd_lcm.steps.lcm.multiple_numbers_intro', { numbers: numbers.join(', ') }));
  calculationSteps.push(t('arithmetic:gcd_lcm.steps.lcm.start_with_two', { 
    step: stepCountRef.count++, 
    first: numbers[0], 
    second: numbers[1] 
  }));
  
  let currentLcm = numbers[0];
  
  for (let i = 1; i < numbers.length; i++) {
    calculationSteps.push(t('arithmetic:gcd_lcm.steps.lcm.calculate_pair', { 
      step: stepCountRef.count++, 
      currentLcm, 
      nextNumber: numbers[i] 
    }));
    
    // Gerar passos para este par
    const pairSteps = generateLcmStepsForTwoNumbers(currentLcm, numbers[i], stepCountRef, t);
    calculationSteps.push(...pairSteps);
    
    currentLcm = lcm(currentLcm, numbers[i]);
    calculationSteps.push(t('arithmetic:gcd_lcm.steps.lcm.current_result', { currentLcm }));
  }
  
  calculationSteps.push(t('arithmetic:gcd_lcm.steps.lcm.final_result', { 
    numbers: numbers.join(', '), 
    result: currentLcm 
  }));
  
  // Adicionar verificação final
  calculationSteps.push('---VERIFICATION_SEPARATOR---');
  calculationSteps.push(t('arithmetic:gcd_lcm.steps.lcm.final_verification', { currentLcm }));
  for (let i = 0; i < numbers.length; i++) {
    calculationSteps.push(t('arithmetic:gcd_lcm.steps.lcm.verification_step', { 
      lcmValue: currentLcm, 
      number: numbers[i], 
      result: currentLcm / numbers[i] 
    }));
  }
  
  return calculationSteps;
}

export function useGcdLcmSolver() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { t } = useTranslation(['arithmetic', 'translation']);

  // Função principal de resolução
  const handleSolve = () => {
    dispatch({ type: 'RESET_CALCULATION' });
    
    try {
      const inputText = state.inputNumbers.trim();
      if (!inputText) {
        dispatch({ type: 'SET_ERROR', message: t('arithmetic:gcd_lcm.errors.missing_input') });
        return;
      }
      
      // Parse a string de entrada para um array de números
      const numbers = inputText
        .split(/[,;\s]+/)
        .filter(item => item.trim() !== '')
        .map(item => {
          const num = parseInt(item.trim(), 10);
          if (isNaN(num)) {
            throw new Error(t('arithmetic:gcd_lcm.errors.invalid_number', { value: item }));
          }
          if (num <= 0) {
            throw new Error(t('arithmetic:gcd_lcm.errors.positive_required'));
          }
          return num;
        });
      
      if (numbers.length === 0) {
        dispatch({ type: 'SET_ERROR', message: t('arithmetic:gcd_lcm.errors.no_valid_numbers') });
        return;
      }
      
      if (numbers.length === 1) {
        dispatch({ type: 'SET_ERROR', message: t('arithmetic:gcd_lcm.errors.need_at_least_two') });
        return;
      }
      
      // Calcular o resultado e gerar passos com base no tipo de cálculo
      let result: number;
      let steps: string[];
      
      if (state.calculationType === 'mdc') {
        result = numbers.reduce((acc, num) => gcd(acc, num));
        steps = generateGcdStepsForMultipleNumbers(numbers, t);
      } else { // mmc
        result = numbers.reduce((acc, num) => lcm(acc, num));
        steps = generateLcmStepsForMultipleNumbers(numbers, t);
      }
      
      dispatch({ type: 'SET_RESULT', numbers, result, steps });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', message: error instanceof Error ? error.message : t('translation:common.errors.unknown') });
    }
  };

  // Aplicar um exemplo ao estado atual
  const applyExample = (example: { numbers: number[] }) => {
    dispatch({ type: 'APPLY_EXAMPLE', example });
  };

  // Definir o tipo de cálculo
  const setCalculationType = (calculationType: CalculationType) => {
    dispatch({ type: 'SET_CALCULATION_TYPE', calculationType });
  };

  // Retornar o estado e as funções
  return {
    state,
    dispatch,
    handleSolve,
    applyExample,
    setCalculationType
  };
} 