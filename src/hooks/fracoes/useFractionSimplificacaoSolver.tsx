import React, { useReducer, ReactNode } from 'react';
import { gcd } from '../../utils/mathUtils';
import { simplifyFraction, FractionDisplay } from '../../utils/mathUtilsFracoes';
import { useTranslation } from 'react-i18next';

// Definições de tipo
interface FractionSimplificationState {
  numerator: string;
  denominator: string;
  resultadoNum: number | null;
  resultadoDen: number | null;
  resultado: boolean;
  steps: (string | ReactNode)[];
  errorMessage: string;
  showExplanation: boolean;
  showConceitoMatematico: boolean;
}

// Tipos de ações
type FractionSimplificationAction =
  | { type: 'SET_NUMERATOR'; value: string }
  | { type: 'SET_DENOMINATOR'; value: string }
  | { type: 'SET_RESULT'; numerator: number; denominator: number }
  | { type: 'SET_STEPS'; steps: (string | ReactNode)[] }
  | { type: 'SET_ERROR'; message: string }
  | { type: 'TOGGLE_EXPLANATION' }
  | { type: 'TOGGLE_CONCEITO_MATEMATICO' }
  | { type: 'RESET' };

// Estado inicial
const initialState: FractionSimplificationState = {
  numerator: '',
  denominator: '',
  resultadoNum: null,
  resultadoDen: null,
  resultado: false,
  steps: [],
  errorMessage: '',
  showExplanation: true,
  showConceitoMatematico: true
};

// Função reducer
function fractionSimplificationReducer(
  state: FractionSimplificationState,
  action: FractionSimplificationAction
): FractionSimplificationState {
  switch (action.type) {
    case 'SET_NUMERATOR':
      return { ...state, numerator: action.value };
    case 'SET_DENOMINATOR':
      return { ...state, denominator: action.value };
    case 'SET_RESULT':
      return {
        ...state,
        resultadoNum: action.numerator,
        resultadoDen: action.denominator,
        resultado: true
      };
    case 'SET_STEPS':
      return { ...state, steps: action.steps };
    case 'SET_ERROR':
      return { ...state, errorMessage: action.message };
    case 'TOGGLE_EXPLANATION':
      return { ...state, showExplanation: !state.showExplanation };
    case 'TOGGLE_CONCEITO_MATEMATICO':
      return { ...state, showConceitoMatematico: !state.showConceitoMatematico };
    case 'RESET':
      return {
        ...state,
        resultado: false,
        steps: [],
        errorMessage: '',
        showExplanation: true
      };
    default:
      return state;
  }
}

export function useFractionSimplificationSolver() {
  const [state, dispatch] = useReducer(fractionSimplificationReducer, initialState);
  const { t } = useTranslation('fractions');

  // Função principal de resolução
  const handleSolve = () => {
    // Reseta os valores anteriores e os erros
    dispatch({ type: 'RESET' });

    const num = parseInt(state.numerator);
    const den = parseInt(state.denominator);

    // Validar entradas
    if (isNaN(num) || isNaN(den)) {
      dispatch({
        type: 'SET_ERROR',
        message: t('simplification.errors.fill_all_fields')
      });
      return;
    }

    if (den === 0) {
      dispatch({
        type: 'SET_ERROR',
        message: t('simplification.errors.denominator_zero')
      });
      return;
    }

    const simplified = simplifyFraction(num, den);
    const simplifiedNum = simplified.numerador;
    const simplifiedDen = simplified.denominador;
    
    // Gerar passos de cálculo
    const calculationSteps = generateCalculationSteps(num, den, simplifiedNum, simplifiedDen);

    // Definir o resultado e os passos
    dispatch({ type: 'SET_RESULT', numerator: simplifiedNum, denominator: simplifiedDen });
    dispatch({ type: 'SET_STEPS', steps: calculationSteps });
  };

  // Gerar passos de cálculo
  const generateCalculationSteps = (
    num: number,
    den: number,
    simplifiedNum: number,
    simplifiedDen: number
  ): (string | ReactNode)[] => {
    const calculationSteps: (string | ReactNode)[] = [];
    let stepCount = 1;

    calculationSteps.push(t('simplification.steps.original_equation', { num, den }));
    calculationSteps.push(<FractionDisplay numerator={num} denominator={den} />);
    
    if (num === 0) {
      calculationSteps.push(t('simplification.steps.numerator_zero', { step: stepCount }));
      calculationSteps.push(t('simplification.steps.simplifying_zero', { den }));
      
      // Adicionar verificação
      calculationSteps.push('---VERIFICATION_SEPARATOR---');
      calculationSteps.push(t('simplification.steps.verification'));
      calculationSteps.push(t('simplification.steps.verification_completed_zero'));
    } else if (num === simplifiedNum && den === simplifiedDen) {
      calculationSteps.push(t('simplification.steps.check_already_simplified', { step: stepCount }));
      calculationSteps.push(t('simplification.steps.verifying_gcd', { num: Math.abs(num), den: Math.abs(den) }));
      
      const mdcValue = gcd(Math.abs(num), Math.abs(den));
      calculationSteps.push(t('simplification.steps.calculating_gcd', { num: Math.abs(num), den: Math.abs(den), gcd: mdcValue }));
      calculationSteps.push(t('simplification.steps.gcd_is_one', { gcd: mdcValue }));
      
      // Adicionar verificação
      calculationSteps.push('---VERIFICATION_SEPARATOR---');
      calculationSteps.push(t('simplification.steps.verification'));
      calculationSteps.push(t('simplification.steps.verification_completed_already_simplified', { num, den }));
    } else {
      calculationSteps.push(t('simplification.steps.find_gcd', { step: stepCount, num: Math.abs(num), den: Math.abs(den) }));
      stepCount++;

      const mdcValue = gcd(Math.abs(num), Math.abs(den));
      calculationSteps.push(t('simplification.steps.calculating_gcd', { num: Math.abs(num), den: Math.abs(den), gcd: mdcValue }));

      calculationSteps.push(t('simplification.steps.divide_by_gcd', { step: stepCount }));
      calculationSteps.push(t('simplification.steps.calculating_numerator', { num, gcd: mdcValue, result: simplifiedNum }));
      calculationSteps.push(t('simplification.steps.calculating_denominator', { den, gcd: mdcValue, result: simplifiedDen }));
      stepCount++;

      calculationSteps.push(t('simplification.steps.simplified_result', { step: stepCount }));
      calculationSteps.push(t('simplification.steps.simplifying_fraction', { num, den, result_num: simplifiedNum, result_den: simplifiedDen }));
      calculationSteps.push(<FractionDisplay numerator={simplifiedNum} denominator={simplifiedDen} />);

      if (simplifiedDen === 1) {
        calculationSteps.push(t('simplification.steps.denominator_is_one', { num: simplifiedNum }));
      }
      
      // Adicionar verificação
      calculationSteps.push('---VERIFICATION_SEPARATOR---');
      calculationSteps.push(t('simplification.steps.verification'));
      calculationSteps.push(t('simplification.steps.verifying_numerator', { num, gcd: mdcValue, result: simplifiedNum }));
      calculationSteps.push(t('simplification.steps.verifying_denominator', { den, gcd: mdcValue, result: simplifiedDen }));
      calculationSteps.push(t('simplification.steps.verification_completed', { num: simplifiedNum, den: simplifiedDen }));
    }

    return calculationSteps;
  };

  // Aplicar um exemplo ao estado atual
  const applyExample = (example: { num: number, den: number }) => {
    dispatch({ type: 'SET_NUMERATOR', value: example.num.toString() });
    dispatch({ type: 'SET_DENOMINATOR', value: example.den.toString() });
  };

  // Retornar o estado e as funções
  return {
    state,
    dispatch,
    handleSolve,
    applyExample
  };
} 