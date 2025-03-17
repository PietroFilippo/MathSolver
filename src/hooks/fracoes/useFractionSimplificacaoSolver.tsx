import { useReducer, ReactNode } from 'react';
import { gcd } from '../../utils/mathUtils';
import { simplifyFraction, FractionDisplay } from '../../utils/mathUtilsFracoes';

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
        message: 'Por favor, preencha todos os campos com valores numéricos.'
      });
      return;
    }

    if (den === 0) {
      dispatch({
        type: 'SET_ERROR',
        message: 'O denominador não pode ser zero.'
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

    calculationSteps.push(`Equação original: Simplificar a fração ${num}/${den}`);
    calculationSteps.push(<FractionDisplay numerator={num} denominator={den} />);
    
    if (num === 0) {
      calculationSteps.push(`Passo ${stepCount}: Quando o numerador é zero, a fração simplificada é 0`);
      calculationSteps.push(`Simplificando: 0/${den} = 0/1 = 0`);
      
      // Adicionar verificação
      calculationSteps.push('---VERIFICATION_SEPARATOR---');
      calculationSteps.push(`Verificação do resultado:`);
      calculationSteps.push(`Verificação concluída: A fração simplificada é 0`);
    } else if (num === simplifiedNum && den === simplifiedDen) {
      calculationSteps.push(`Passo ${stepCount}: Verificamos se a fração já está simplificada`);
      calculationSteps.push(`Verificando: precisamos encontrar o MDC de ${Math.abs(num)} e ${Math.abs(den)}`);
      
      const mdcValue = gcd(Math.abs(num), Math.abs(den));
      calculationSteps.push(`Calculando: MDC(${Math.abs(num)}, ${Math.abs(den)}) = ${mdcValue}`);
      calculationSteps.push(`Como o MDC é ${mdcValue}, e é igual a 1, a fração já está na forma irredutível.`);
      
      // Adicionar verificação
      calculationSteps.push('---VERIFICATION_SEPARATOR---');
      calculationSteps.push(`Verificação do resultado:`);
      calculationSteps.push(`Verificação concluída: A fração ${num}/${den} já está simplificada`);
    } else {
      calculationSteps.push(`Passo ${stepCount}: Encontrar o MDC (Máximo Divisor Comum) de ${Math.abs(num)} e ${Math.abs(den)}`);
      stepCount++;

      const mdcValue = gcd(Math.abs(num), Math.abs(den));
      calculationSteps.push(`Calculando: MDC(${Math.abs(num)}, ${Math.abs(den)}) = ${mdcValue}`);

      calculationSteps.push(`Passo ${stepCount}: Dividir o numerador e o denominador pelo MDC`);
      calculationSteps.push(`Calculando: Numerador: ${num} ÷ ${mdcValue} = ${simplifiedNum}`);
      calculationSteps.push(`Calculando: Denominador: ${den} ÷ ${mdcValue} = ${simplifiedDen}`);
      stepCount++;

      calculationSteps.push(`Passo ${stepCount}: Resultado da fração simplificada`);
      calculationSteps.push(`Simplificando: ${num}/${den} = ${simplifiedNum}/${simplifiedDen}`);
      calculationSteps.push(<FractionDisplay numerator={simplifiedNum} denominator={simplifiedDen} />);

      if (simplifiedDen === 1) {
        calculationSteps.push(`Simplificando: Como o denominador é 1, a fração é igual ao número inteiro ${simplifiedNum}`);
      }
      
      // Adicionar verificação
      calculationSteps.push('---VERIFICATION_SEPARATOR---');
      calculationSteps.push(`Verificação do resultado:`);
      calculationSteps.push(`Verificando: ${num} ÷ ${mdcValue} = ${simplifiedNum}`);
      calculationSteps.push(`Verificando: ${den} ÷ ${mdcValue} = ${simplifiedDen}`);
      calculationSteps.push(`Verificação concluída: A fração simplificada é ${simplifiedNum}/${simplifiedDen}`);
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