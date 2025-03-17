import { useReducer } from 'react';
import { roundToDecimals } from '../../utils/mathUtils';

// Definições de tipo
type State = {
  a: string;
  b: string;
  c: string;
  solution: number | null;
  steps: string[];
  errorMessage: string | null;
  showExplanation: boolean;
  showConceitoMatematico: boolean;
};

// Tipos de ações
type Action =
  | { type: 'SET_COEFFICIENT'; field: 'a' | 'b' | 'c'; value: string }
  | { type: 'RESET_CALCULATION' }
  | { type: 'SET_SOLUTION'; solution: number; steps: string[] }
  | { type: 'SET_ERROR'; message: string }
  | { type: 'TOGGLE_EXPLANATION' }
  | { type: 'TOGGLE_CONCEITO_MATEMATICO' }
  | { type: 'APPLY_EXAMPLE'; a: number | string; b: number | string; c: number | string };

// Estado inicial
const initialState: State = {
  a: '',
  b: '',
  c: '',
  solution: null,
  steps: [],
  errorMessage: null,
  showExplanation: false,
  showConceitoMatematico: true,
};

// Função reducer
function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_COEFFICIENT':
      return { ...state, [action.field]: action.value };
    case 'RESET_CALCULATION':
      return {
        ...state,
        solution: null,
        steps: [],
        errorMessage: null,
        showExplanation: false
      };
    case 'SET_SOLUTION':
      return { 
        ...state, 
        solution: action.solution,
        steps: action.steps,
        errorMessage: null,
        showExplanation: true
      };
    case 'SET_ERROR':
      return {
        ...state,
        errorMessage: action.message,
        solution: null,
        steps: []
      };
    case 'TOGGLE_EXPLANATION':
      return { ...state, showExplanation: !state.showExplanation };
    case 'TOGGLE_CONCEITO_MATEMATICO':
      return { ...state, showConceitoMatematico: !state.showConceitoMatematico };
    case 'APPLY_EXAMPLE':
      return {
        ...state,
        a: String(action.a),
        b: String(action.b),
        c: String(action.c),
      };
    default:
      return state;
  }
}

// Gerar passos para resolução de equação linear
function generateLinearSteps(numA: number, numB: number, numC: number, result: number): string[] {
  const calculationSteps: string[] = [];
  let stepCount = 1;

  calculationSteps.push(`Equação original: ${numA}x + ${numB} = ${numC}`);
  calculationSteps.push(`Passo ${stepCount++}: Isolando a variável x, vamos mover os termos constantes para o lado direito.`);

  // Subtrair b de ambos os lados
  calculationSteps.push(`Subtraindo ${numB} de ambos os lados da equação:`);
  calculationSteps.push(`${numA}x + ${numB} - ${numB} = ${numC} - ${numB}`);
  
  // Simplificar o lado esquerdo
  calculationSteps.push(`Simplificando os termos semelhantes no lado esquerdo:`);
  calculationSteps.push(`${numA}x = ${numC - numB}`);

  // Dividir pelo coeficiente de x
  calculationSteps.push(`Passo ${stepCount++}: Isolando x, dividindo por ${numA} (o coeficiente de x).`);
  calculationSteps.push(`${numA}x / ${numA} = ${numC - numB} / ${numA}`);
  calculationSteps.push(`Simplificando a divisão:`);
  calculationSteps.push(`x = ${roundToDecimals(result, 4)}`);

  // Resultado final
  calculationSteps.push(`Solução final: x = ${roundToDecimals(result, 4)}`);

  // Adicionar um separador visual antes da verificação
  calculationSteps.push(`---VERIFICATION_SEPARATOR---`);

  // Verificação da solução
  calculationSteps.push(`Verificação: Substituindo o valor de x = ${roundToDecimals(result, 4)} na equação original:`);
  calculationSteps.push(`${numA}x + ${numB} = ${numC}`);
  calculationSteps.push(`${numA} × ${roundToDecimals(result, 4)} + ${numB} = ${numC}`);
  calculationSteps.push(`${roundToDecimals(numA * result, 4)} + ${numB} = ${numC}`);
  
  if (Math.abs((numA * result + numB) - numC) < 0.0001) {
    calculationSteps.push(`${roundToDecimals(numA * result + numB, 4)} = ${numC} (Correto!)`);
  } else {
    calculationSteps.push(`Observe que ${roundToDecimals(numA * result + numB, 4)} é aproximadamente igual a ${numC} devido a arredondamentos.`);
  }

  return calculationSteps;
}

export function useLinearSolver() {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Função principal de resolução
  const handleSolve = () => {
    dispatch({ type: 'RESET_CALCULATION' });
    
    try {
      // Verificar se os valores foram fornecidos
      if (!state.a.trim() || !state.b.trim() || !state.c.trim()) {
        dispatch({ type: 'SET_ERROR', message: 'Por favor, preencha todos os campos.' });
        return;
      }
      
      // Converter para números
      const numA = parseFloat(state.a.replace(',', '.'));
      const numB = parseFloat(state.b.replace(',', '.'));
      const numC = parseFloat(state.c.replace(',', '.'));
      
      // Validar os valores
      if (isNaN(numA) || isNaN(numB) || isNaN(numC)) {
        dispatch({ type: 'SET_ERROR', message: 'Por favor, insira valores numéricos válidos.' });
        return;
      }
      
      if (numA === 0) {
        dispatch({ type: 'SET_ERROR', message: 'O coeficiente "a" não pode ser zero na equação ax + b = c.' });
        return;
      }
      
      // Resolver a equação linear: ax + b = c
      // x = (c - b) / a
      const result = (numC - numB) / numA;
      
      // Gerar os passos da solução
      const steps = generateLinearSteps(numA, numB, numC, result);
      
      dispatch({
        type: 'SET_SOLUTION',
        solution: roundToDecimals(result, 4),
        steps
      });
    } catch (error) {
      dispatch({ 
        type: 'SET_ERROR', 
        message: error instanceof Error ? error.message : 'Erro desconhecido.' 
      });
    }
  };

  // Aplicar um exemplo ao estado atual
  const applyExample = (example: { a: number | string; b: number | string; c: number | string }) => {
    dispatch({ 
      type: 'APPLY_EXAMPLE', 
      a: example.a,
      b: example.b,
      c: example.c
    });
  };

  // Retornar o estado e as funções
  return {
    state,
    dispatch,
    handleSolve,
    applyExample,
  };
} 