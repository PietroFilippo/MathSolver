import { useReducer } from 'react';
import { factorNumberIntoPrimes } from '../../utils/mathUtilsTeoriaNumeros';
import { useTranslation } from 'react-i18next';

// Definições de tipo
type State = {
  inputNumber: string;
  number: number | null;
  primeFactors: { factors: number[]; exponents: number[] } | null;
  steps: string[];
  errorMessage: string | null;
  showExplanation: boolean;
  showConceitoMatematico: boolean;
};

// Tipos de ações
type Action =
  | { type: 'SET_INPUT_NUMBER'; value: string }
  | { type: 'RESET_CALCULATION' }
  | { type: 'SET_RESULT'; number: number; primeFactors: { factors: number[]; exponents: number[] }; steps: string[] }
  | { type: 'SET_ERROR'; message: string }
  | { type: 'TOGGLE_EXPLANATION' }
  | { type: 'TOGGLE_CONCEITO_MATEMATICO' }
  | { type: 'APPLY_EXAMPLE'; example: { number: number } };

// Estado inicial
const initialState: State = {
  inputNumber: '',
  number: null,
  primeFactors: null,
  steps: [],
  errorMessage: null,
  showExplanation: false,
  showConceitoMatematico: true,
};

// Função reducer
function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_INPUT_NUMBER':
      return { ...state, inputNumber: action.value };
    case 'RESET_CALCULATION':
      return {
        ...state,
        number: null,
        primeFactors: null,
        steps: [],
        errorMessage: null,
        showExplanation: false
      };
    case 'SET_RESULT':
      return {
        ...state,
        number: action.number,
        primeFactors: action.primeFactors,
        steps: action.steps,
        errorMessage: null,
        showExplanation: true
      };
    case 'SET_ERROR':
      return {
        ...state,
        errorMessage: action.message,
        number: null,
        primeFactors: null,
        steps: []
      };
    case 'TOGGLE_EXPLANATION':
      return { ...state, showExplanation: !state.showExplanation };
    case 'TOGGLE_CONCEITO_MATEMATICO':
      return { ...state, showConceitoMatematico: !state.showConceitoMatematico };
    case 'APPLY_EXAMPLE':
      return { ...state, inputNumber: action.example.number.toString() };
    default:
      return state;
  }
}

// Gerar passos para fatoração em números primos
function generateFactorizationSteps(num: number, t: any): string[] {
  const calculationSteps: string[] = [];
  
  if (num <= 1) {
    if (num === 1) {
      calculationSteps.push(t('arithmetic:factorization.steps.number_one_no_factors'));
    } else {
      calculationSteps.push(t('arithmetic:factorization.steps.invalid_factorization', { number: num }));
    }
    return calculationSteps;
  }
  
  calculationSteps.push(t('arithmetic:factorization.steps.original_equation', { number: num }));
  calculationSteps.push(t('arithmetic:factorization.steps.decompose_intro', { number: num }));
  
  // Tentaremos dividir primeiro pelos menores números primos
  let currentNumber = num;
  let currentFactor = 2;
  let stepCount = 1;
  
  while (currentNumber > 1) {
    // Se o fator atual é um divisor
    if (currentNumber % currentFactor === 0) {
      calculationSteps.push(t('arithmetic:factorization.steps.divide_step', { 
        step: stepCount, 
        number: currentNumber, 
        factor: currentFactor, 
        result: currentNumber / currentFactor 
      }));
      currentNumber /= currentFactor;
      stepCount++;
    } else {
      // Avançando para o próximo potencial fator
      currentFactor = currentFactor === 2 ? 3 : currentFactor + 2;
      
      // Otimização: se o quadrado do fator atual for maior que o número,
      // então o número atual é primo
      if (currentFactor * currentFactor > currentNumber && currentNumber > 1) {
        calculationSteps.push(t('arithmetic:factorization.steps.prime_number', { 
          step: stepCount, 
          number: currentNumber 
        }));
        break;
      }
    }
  }
  
  // Obter a fatoração completa
  const factorization = factorNumberIntoPrimes(num);
  
  // Exibir o resultado na forma fatorada
  let factorStr = '';
  
  for (let i = 0; i < factorization.factors.length; i++) {
    const factor = factorization.factors[i];
    const exponent = factorization.exponents[i];
    
    if (exponent === 1) {
      factorStr += `${factor} × `;
    } else {
      factorStr += `${factor}^${exponent} × `;
    }
  }
  
  // Remover o " × " do final
  factorStr = factorStr.slice(0, -3);
  
  calculationSteps.push(t('arithmetic:factorization.steps.result', { number: num, factorization: factorStr }));
  
  // Adicionar verificação
  calculationSteps.push('---VERIFICATION_SEPARATOR---');
  calculationSteps.push(t('arithmetic:factorization.steps.verification_intro'));
  
  // Calcular o produto dos fatores
  let product = 1;
  for (let i = 0; i < factorization.factors.length; i++) {
    const factor = factorization.factors[i];
    const exponent = factorization.exponents[i];
    
    calculationSteps.push(t('arithmetic:factorization.steps.multiply_factor', { 
      factor: factor, 
      exponent: exponent, 
      result: Math.pow(factor, exponent) 
    }));
    product *= Math.pow(factor, exponent);
  }
  
  calculationSteps.push(t('arithmetic:factorization.steps.verification_completed', { 
    factorization: factorStr, 
    product: product, 
    isCorrect: product === num 
  }));
  
  return calculationSteps;
}

export function useFactorizationSolver() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { t } = useTranslation(['arithmetic', 'translation']);

  // Função principal de resolução
  const handleSolve = () => {
    dispatch({ type: 'RESET_CALCULATION' });
    
    try {
      const input = state.inputNumber.trim();
      if (!input) {
        dispatch({ type: 'SET_ERROR', message: t('arithmetic:factorization.errors.empty_input') });
        return;
      }
      
      const num = parseInt(input, 10);
      
      if (isNaN(num)) {
        dispatch({ type: 'SET_ERROR', message: t('arithmetic:factorization.errors.invalid_number') });
        return;
      }
      
      if (num <= 0) {
        dispatch({ type: 'SET_ERROR', message: t('arithmetic:factorization.errors.positive_integer_required') });
        return;
      }
      
      const primeFactors = factorNumberIntoPrimes(num);
      const steps = generateFactorizationSteps(num, t);
      
      dispatch({
        type: 'SET_RESULT',
        number: num,
        primeFactors,
        steps
      });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', message: error instanceof Error ? error.message : t('translation:common.errors.unknown') });
    }
  };

  // Aplicar um exemplo ao estado atual
  const applyExample = (example: { number: number }) => {
    dispatch({ type: 'APPLY_EXAMPLE', example });
  };

  // Retornar o estado e as funções
  return {
    state,
    dispatch,
    handleSolve,
    applyExample
  };
} 