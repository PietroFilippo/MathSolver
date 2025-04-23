import { useReducer } from 'react';
import { roundToDecimals } from '../../utils/mathUtils';
import { useTranslation } from 'react-i18next';

// Definições de tipo
type SolveForType = 'a' | 'b' | 'c' | 'd';

// Interface de estado
type State = {
  a: string;
  b: string;
  c: string;
  d: string;
  solveFor: SolveForType;
  result: number | null;
  steps: string[];
  errorMessage: string | null;
  showExplanation: boolean;
  showConceitoMatematico: boolean;
};

// Tipos de ações
type Action =
  | { type: 'SET_A'; value: string }
  | { type: 'SET_B'; value: string }
  | { type: 'SET_C'; value: string }
  | { type: 'SET_D'; value: string }
  | { type: 'SET_VALUE'; field: 'a' | 'b' | 'c' | 'd'; value: string }
  | { type: 'SET_SOLVE_FOR'; value: SolveForType }
  | { type: 'RESET_CALCULATION' }
  | { type: 'SET_RESULT'; result: number; steps: string[] }
  | { type: 'SET_ERROR'; message: string }
  | { type: 'TOGGLE_EXPLANATION' }
  | { type: 'TOGGLE_CONCEITO_MATEMATICO' }
  | { type: 'APPLY_EXAMPLE'; example: { a?: string | number; b?: string | number; c?: string | number; d?: string | number; solveFor?: SolveForType } };

// Estado inicial
const initialState: State = {
  a: '',
  b: '',
  c: '',
  d: '',
  solveFor: 'd',
  result: null,
  steps: [],
  errorMessage: null,
  showExplanation: false,
  showConceitoMatematico: true,
};

// Função reducer
function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_A':
      return { ...state, a: action.value };
    case 'SET_B':
      return { ...state, b: action.value };
    case 'SET_C':
      return { ...state, c: action.value };
    case 'SET_D':
      return { ...state, d: action.value };
    case 'SET_VALUE':
      return { ...state, [action.field]: action.value };
    case 'SET_SOLVE_FOR':
      return { ...state, solveFor: action.value };
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
        a: action.example.a !== undefined ? String(action.example.a) : state.a,
        b: action.example.b !== undefined ? String(action.example.b) : state.b,
        c: action.example.c !== undefined ? String(action.example.c) : state.c,
        d: action.example.d !== undefined ? String(action.example.d) : state.d,
        solveFor: action.example.solveFor || state.solveFor,
      };
    default:
      return state;
  }
}

export function useProportionSolver() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { t } = useTranslation(['arithmetic', 'translation']);

  // Função principal de resolução
  const handleSolve = () => {
    dispatch({ type: 'RESET_CALCULATION' });
    
    try {
      // Obter os valores da proporção
      const values: Record<string, number | null> = {
        a: state.a ? parseFloat(state.a.replace(',', '.')) : null,
        b: state.b ? parseFloat(state.b.replace(',', '.')) : null,
        c: state.c ? parseFloat(state.c.replace(',', '.')) : null,
        d: state.d ? parseFloat(state.d.replace(',', '.')) : null,
      };
      
      // Verificar qual valor estamos resolvendo e se temos os dados necessários
      const solveFor = state.solveFor;
      
      const requiredValues = ['a', 'b', 'c', 'd'].filter(key => key !== solveFor);
      
      // Verificar se todos os valores necessários estão presentes
      const missingValues = requiredValues.filter(key => values[key] === null || isNaN(values[key] as number));
      
      if (missingValues.length > 0) {
        dispatch({ 
          type: 'SET_ERROR', 
          message: t('arithmetic:proportion.errors.missing_values', { values: missingValues.join(', ') })
        });
        return;
      }
      
      // Calcular o valor desconhecido
      let result: number;
      const calculationSteps: string[] = [];
      let stepCount = 1;
      
      // Iniciar os passos
      calculationSteps.push(t('arithmetic:proportion.steps.intro', { solveFor }));
      calculationSteps.push(`${t('translation:common.step')} ${stepCount++}: ${t('arithmetic:proportion.steps.identify_values')}`);
      
      for (const key of ['a', 'b', 'c', 'd']) {
        if (key !== solveFor) {
          calculationSteps.push(`${key} = ${values[key]}`);
        }
      }
      
      // Aplicar a fórmula de proporção adequada
      switch (solveFor) {
        case 'a':
          result = (values.b as number) * (values.c as number) / (values.d as number);
          calculationSteps.push(`${t('translation:common.step')} ${stepCount++}: ${t('arithmetic:proportion.steps.original_equation', { a: '?', b: values.b, c: values.c, d: values.d })}`);
          calculationSteps.push(`${t('translation:common.step')} ${stepCount++}: ${t('arithmetic:proportion.steps.fundamental_property')}`);
          calculationSteps.push(`${t('translation:common.step')} ${stepCount++}: ${t('arithmetic:proportion.steps.isolate_a')}`);
          calculationSteps.push(`${t('translation:common.step')} ${stepCount++}: ${t('arithmetic:proportion.steps.substitute_a', { b: values.b, c: values.c, d: values.d })}`);
          calculationSteps.push(`${t('translation:common.step')} ${stepCount++}: ${t('arithmetic:proportion.steps.calculate_a', { product: (values.b as number) * (values.c as number), d: values.d })}`);
          break;
          
        case 'b':
          result = (values.a as number) * (values.d as number) / (values.c as number);
          calculationSteps.push(`${t('translation:common.step')} ${stepCount++}: ${t('arithmetic:proportion.steps.original_equation', { a: values.a, b: '?', c: values.c, d: values.d })}`);
          calculationSteps.push(`${t('translation:common.step')} ${stepCount++}: ${t('arithmetic:proportion.steps.fundamental_property')}`);
          calculationSteps.push(`${t('translation:common.step')} ${stepCount++}: ${t('arithmetic:proportion.steps.isolate_b')}`);
          calculationSteps.push(`${t('translation:common.step')} ${stepCount++}: ${t('arithmetic:proportion.steps.substitute_b', { a: values.a, c: values.c, d: values.d })}`);
          calculationSteps.push(`${t('translation:common.step')} ${stepCount++}: ${t('arithmetic:proportion.steps.calculate_b', { product: (values.a as number) * (values.d as number), c: values.c })}`);
          break;
          
        case 'c':
          result = (values.a as number) * (values.d as number) / (values.b as number);
          calculationSteps.push(`${t('translation:common.step')} ${stepCount++}: ${t('arithmetic:proportion.steps.original_equation', { a: values.a, b: values.b, c: '?', d: values.d })}`);
          calculationSteps.push(`${t('translation:common.step')} ${stepCount++}: ${t('arithmetic:proportion.steps.fundamental_property')}`);
          calculationSteps.push(`${t('translation:common.step')} ${stepCount++}: ${t('arithmetic:proportion.steps.isolate_c')}`);
          calculationSteps.push(`${t('translation:common.step')} ${stepCount++}: ${t('arithmetic:proportion.steps.substitute_c', { a: values.a, b: values.b, d: values.d })}`);
          calculationSteps.push(`${t('translation:common.step')} ${stepCount++}: ${t('arithmetic:proportion.steps.calculate_c', { product: (values.a as number) * (values.d as number), b: values.b })}`);
          break;
          
        case 'd':
          result = (values.b as number) * (values.c as number) / (values.a as number);
          calculationSteps.push(`${t('translation:common.step')} ${stepCount++}: ${t('arithmetic:proportion.steps.original_equation', { a: values.a, b: values.b, c: values.c, d: '?' })}`);
          calculationSteps.push(`${t('translation:common.step')} ${stepCount++}: ${t('arithmetic:proportion.steps.fundamental_property')}`);
          calculationSteps.push(`${t('translation:common.step')} ${stepCount++}: ${t('arithmetic:proportion.steps.isolate_d')}`);
          calculationSteps.push(`${t('translation:common.step')} ${stepCount++}: ${t('arithmetic:proportion.steps.substitute_d', { a: values.a, b: values.b, c: values.c })}`);
          calculationSteps.push(`${t('translation:common.step')} ${stepCount++}: ${t('arithmetic:proportion.steps.calculate_d', { product: (values.b as number) * (values.c as number), a: values.a })}`);
          break;
          
        default:
          throw new Error(t('arithmetic:proportion.errors.invalid_solve_type'));
      }
      
      // Arredondar o resultado para 4 casas decimais
      result = roundToDecimals(result, 4);
      
      // Adicionar o resultado à lista de passos
      calculationSteps.push(`${t('translation:common.result')}: ${solveFor} = ${result}`);
      
      // Verificar se a proporção é válida
      const checkValues = { ...values, [solveFor]: result };
      
      if (checkValues.a !== null && checkValues.b !== null && checkValues.c !== null && checkValues.d !== null) {
        calculationSteps.push('---VERIFICATION_SEPARATOR---');
        calculationSteps.push(`${t('translation:common.verification')}:`);
        
        const leftSide = checkValues.a / checkValues.b;
        const rightSide = checkValues.c / checkValues.d;
        
        calculationSteps.push(t('arithmetic:proportion.steps.verification.left_side', { a: checkValues.a, b: checkValues.b, result: roundToDecimals(leftSide, 4) }));
        calculationSteps.push(t('arithmetic:proportion.steps.verification.right_side', { c: checkValues.c, d: checkValues.d, result: roundToDecimals(rightSide, 4) }));
        
        if (Math.abs(leftSide - rightSide) < 0.0001) { // Tolerância para erros de arredondamento
          calculationSteps.push(`verification.completed: ${t('arithmetic:proportion.steps.verification.success', { left: roundToDecimals(leftSide, 4), right: roundToDecimals(rightSide, 4) })} ✓`);
        } else {
          calculationSteps.push(`verification.completed: ${t('arithmetic:proportion.steps.verification.rounding_note', { left: roundToDecimals(leftSide, 4), right: roundToDecimals(rightSide, 4) })}`);
        }
      }
      
      dispatch({ type: 'SET_RESULT', result, steps: calculationSteps });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', message: error instanceof Error ? error.message : t('translation:common.errors.unknown') });
    }
  };

  // Aplicar um exemplo ao estado atual
  const applyExample = (example: { 
    a?: string | number; 
    b?: string | number; 
    c?: string | number; 
    d?: string | number; 
    solveFor?: SolveForType 
  }) => {
    dispatch({ 
      type: 'APPLY_EXAMPLE', 
      example: {
        a: example.a !== undefined ? String(example.a) : undefined,
        b: example.b !== undefined ? String(example.b) : undefined,
        c: example.c !== undefined ? String(example.c) : undefined,
        d: example.d !== undefined ? String(example.d) : undefined,
        solveFor: example.solveFor
      } 
    });
  };

  // Definir o tipo a resolver
  const setSolveFor = (solveFor: SolveForType) => {
    dispatch({ type: 'SET_SOLVE_FOR', value: solveFor });
  };

  // Retornar o estado e as funções
  return {
    state,
    dispatch,
    handleSolve,
    applyExample,
    setSolveFor
  };
} 