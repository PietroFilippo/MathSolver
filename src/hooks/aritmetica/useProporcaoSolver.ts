import { useReducer } from 'react';
import { roundToDecimals } from '../../utils/mathUtils';

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
          message: `Por favor, insira valores válidos para ${missingValues.join(', ')}.` 
        });
        return;
      }
      
      // Calcular o valor desconhecido
      let result: number;
      const calculationSteps: string[] = [];
      let stepCount = 1;
      
      // Iniciar os passos
      calculationSteps.push(`Vamos resolver uma proporção da forma a/b = c/d para ${solveFor}.`);
      calculationSteps.push(`Passo ${stepCount++}: Identificar os valores conhecidos:`);
      
      for (const key of ['a', 'b', 'c', 'd']) {
        if (key !== solveFor) {
          calculationSteps.push(`${key} = ${values[key]}`);
        }
      }
      
      // Aplicar a fórmula de proporção adequada
      switch (solveFor) {
        case 'a':
          result = (values.b as number) * (values.c as number) / (values.d as number);
          calculationSteps.push(`Passo ${stepCount++}: Equação original: a/b = c/d onde b=${values.b}, c=${values.c} e d=${values.d}`);
          calculationSteps.push(`Passo ${stepCount++}: Para encontrar a, usamos a propriedade fundamental das proporções: a × d = b × c.`);
          calculationSteps.push(`Passo ${stepCount++}: Isolando a variável a: a = (b × c) ÷ d`);
          calculationSteps.push(`Passo ${stepCount++}: Substituindo os valores: a = (${values.b} × ${values.c}) ÷ ${values.d}`);
          calculationSteps.push(`Passo ${stepCount++}: Calculando os termos: a = ${(values.b as number) * (values.c as number)} ÷ ${values.d}`);
          break;
          
        case 'b':
          result = (values.a as number) * (values.d as number) / (values.c as number);
          calculationSteps.push(`Passo ${stepCount++}: Equação original: a/b = c/d onde a=${values.a}, c=${values.c} e d=${values.d}`);
          calculationSteps.push(`Passo ${stepCount++}: Para encontrar b, usamos a propriedade fundamental das proporções: a × d = b × c.`);
          calculationSteps.push(`Passo ${stepCount++}: Isolando a variável b: b = (a × d) ÷ c`);
          calculationSteps.push(`Passo ${stepCount++}: Substituindo os valores: b = (${values.a} × ${values.d}) ÷ ${values.c}`);
          calculationSteps.push(`Passo ${stepCount++}: Calculando os termos: b = ${(values.a as number) * (values.d as number)} ÷ ${values.c}`);
          break;
          
        case 'c':
          result = (values.a as number) * (values.d as number) / (values.b as number);
          calculationSteps.push(`Passo ${stepCount++}: Equação original: a/b = c/d onde a=${values.a}, b=${values.b} e d=${values.d}`);
          calculationSteps.push(`Passo ${stepCount++}: Para encontrar c, usamos a propriedade fundamental das proporções: a × d = b × c.`);
          calculationSteps.push(`Passo ${stepCount++}: Isolando a variável c: c = (a × d) ÷ b`);
          calculationSteps.push(`Passo ${stepCount++}: Substituindo os valores: c = (${values.a} × ${values.d}) ÷ ${values.b}`);
          calculationSteps.push(`Passo ${stepCount++}: Calculando os termos: c = ${(values.a as number) * (values.d as number)} ÷ ${values.b}`);
          break;
          
        case 'd':
          result = (values.b as number) * (values.c as number) / (values.a as number);
          calculationSteps.push(`Passo ${stepCount++}: Equação original: a/b = c/d onde a=${values.a}, b=${values.b} e c=${values.c}`);
          calculationSteps.push(`Passo ${stepCount++}: Para encontrar d, usamos a propriedade fundamental das proporções: a × d = b × c.`);
          calculationSteps.push(`Passo ${stepCount++}: Isolando a variável d: d = (b × c) ÷ a`);
          calculationSteps.push(`Passo ${stepCount++}: Substituindo os valores: d = (${values.b} × ${values.c}) ÷ ${values.a}`);
          calculationSteps.push(`Passo ${stepCount++}: Calculando os termos: d = ${(values.b as number) * (values.c as number)} ÷ ${values.a}`);
          break;
          
        default:
          throw new Error('Tipo de resolução inválido.');
      }
      
      // Arredondar o resultado para 4 casas decimais
      result = roundToDecimals(result, 4);
      
      // Adicionar o resultado à lista de passos
      calculationSteps.push(`Resultado: ${solveFor} = ${result}`);
      
      // Verificar se a proporção é válida
      const checkValues = { ...values, [solveFor]: result };
      
      if (checkValues.a !== null && checkValues.b !== null && checkValues.c !== null && checkValues.d !== null) {
        calculationSteps.push('---VERIFICATION_SEPARATOR---');
        calculationSteps.push(`Verificação da proporção:`);
        
        const leftSide = checkValues.a / checkValues.b;
        const rightSide = checkValues.c / checkValues.d;
        
        calculationSteps.push(`Calculando o lado esquerdo da proporção: a/b = ${checkValues.a}/${checkValues.b} = ${roundToDecimals(leftSide, 4)}`);
        calculationSteps.push(`Calculando o lado direito da proporção: c/d = ${checkValues.c}/${checkValues.d} = ${roundToDecimals(rightSide, 4)}`);
        
        if (Math.abs(leftSide - rightSide) < 0.0001) { // Tolerância para erros de arredondamento
          calculationSteps.push(`Verificação concluída: Como os dois lados são aproximadamente iguais (${roundToDecimals(leftSide, 4)} ≈ ${roundToDecimals(rightSide, 4)}), a proporção está correta.`);
        } else {
          calculationSteps.push(`Nota: Há uma pequena diferença entre ${roundToDecimals(leftSide, 4)} e ${roundToDecimals(rightSide, 4)} devido a arredondamentos.`);
        }
      }
      
      dispatch({ type: 'SET_RESULT', result, steps: calculationSteps });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', message: error instanceof Error ? error.message : 'Erro desconhecido.' });
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