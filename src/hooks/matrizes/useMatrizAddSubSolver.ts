import { useReducer } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  parseMatrixFromString, 
  addMatrices, 
  subtractMatrices, 
  isValidMatrix,
  haveSameDimensions,
  matrixToInputString,
  MatrizExample
} from '../../utils/mathUtilsMatrizes';

// Definições de tipo
type State = {
  matrizA: string;
  matrizB: string;
  operacao: 'soma' | 'subtracao';
  resultado: number[][] | null;
  passos: string[];
  erro: string | null;
  showExplication: boolean;
  showConceitoMatematico: boolean;
  parsedMatrizA: number[][] | null;
  parsedMatrizB: number[][] | null;
};

// Tipos de ações
type Action =
  | { type: 'SET_MATRIZ_A'; valor: string }
  | { type: 'SET_MATRIZ_B'; valor: string }
  | { type: 'SET_OPERACAO'; valor: 'soma' | 'subtracao' }
  | { type: 'RESET_CALCULATION' }
  | { type: 'SET_RESULTADO'; resultado: number[][] | null; passos: string[] }
  | { type: 'SET_ERROR'; mensagem: string }
  | { type: 'TOGGLE_EXPLICATION' }
  | { type: 'TOGGLE_CONCEITO_MATEMATICO' }
  | { type: 'APPLY_EXAMPLE'; matrizA: number[][]; matrizB: number[][] };

// Estado inicial
const initialState: State = {
  matrizA: '',
  matrizB: '',
  operacao: 'soma',
  resultado: null,
  passos: [],
  erro: null,
  showExplication: false,
  showConceitoMatematico: true,
  parsedMatrizA: null,
  parsedMatrizB: null
};

// Função reducer
function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_MATRIZ_A':
      return { 
        ...state, 
        matrizA: action.valor,
        parsedMatrizA: parseMatrixFromString(action.valor)
      };
    case 'SET_MATRIZ_B':
      return { 
        ...state, 
        matrizB: action.valor,
        parsedMatrizB: parseMatrixFromString(action.valor)
      };
    case 'SET_OPERACAO':
      return { ...state, operacao: action.valor };
    case 'RESET_CALCULATION':
      return {
        ...state,
        resultado: null,
        passos: [],
        erro: null,
        showExplication: false
      };
    case 'SET_RESULTADO':
      return {
        ...state,
        resultado: action.resultado,
        passos: action.passos,
        erro: null,
        showExplication: true
      };
    case 'SET_ERROR':
      return {
        ...state,
        erro: action.mensagem,
        resultado: null,
        passos: []
      };
    case 'TOGGLE_EXPLICATION':
      return { ...state, showExplication: !state.showExplication };
    case 'TOGGLE_CONCEITO_MATEMATICO':
      return { ...state, showConceitoMatematico: !state.showConceitoMatematico };
    case 'APPLY_EXAMPLE':
      return {
        ...state,
        matrizA: matrixToInputString(action.matrizA),
        matrizB: matrixToInputString(action.matrizB),
        parsedMatrizA: action.matrizA,
        parsedMatrizB: action.matrizB
      };
    default:
      return state;
  }
}

export function useMatrizAddSubSolver() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { t } = useTranslation(['matrices', 'translation']);

  // Gera os passos de cálculo para adição ou subtração de matrizes
  const generateMatrixAddSubSteps = (
    matrixA: number[][],
    matrixB: number[][],
    operation: 'soma' | 'subtracao'
  ): string[] => {
    const steps: string[] = [];
    let stepCount = 1;
    
    // Verifica se as matrizes têm as mesmas dimensões
    if (!haveSameDimensions(matrixA, matrixB)) {
      steps.push(t('matrices:matrix_operations.steps.different_dimensions'));
      return steps;
    }
    
    const rows = matrixA.length;
    const cols = matrixA[0].length;
    
    // Adiciona informações iniciais
    steps.push(t('matrices:matrix_operations.steps.identify_matrices', { step: stepCount++ }));
    steps.push(t('matrices:matrix_operations.steps.initial_form', { 
      operation: operation === 'soma' ? 'A + B' : 'A - B' 
    }));
    
    // Adiciona a representação das matrizes
    steps.push(`${t('matrices:matrix_operations.add_sub.matrix_a')} (${rows}×${cols}):`);
    matrixA.forEach(row => {
      steps.push(`[${row.join(', ')}]`);
    });
    
    steps.push(`${t('matrices:matrix_operations.add_sub.matrix_b')} (${rows}×${cols}):`);
    matrixB.forEach(row => {
      steps.push(`[${row.join(', ')}]`);
    });
    
    // Explica o processo
    steps.push(t('matrices:matrix_operations.steps.matrix_dimensions', { step: stepCount++ }));
    steps.push(t('matrices:matrix_operations.steps.checking_dimensions', { rows, cols }));
    
    // Pega o nome da operação com a primeira letra maiúscula
    const operationName = operation === 'soma' 
      ? t('translation:common.addition').charAt(0).toUpperCase() + t('translation:common.addition').slice(1)
      : t('translation:common.subtraction').charAt(0).toUpperCase() + t('translation:common.subtraction').slice(1);
    
    // Use uma mensagem completamente traduzida em vez de misturar idiomas
    steps.push(t('matrices:matrix_operations.steps.dimension_requirement', { operation: operationName }));
    
    steps.push(t('matrices:matrix_operations.steps.element_operation', { step: stepCount++ }));
    
    if (operation === 'soma') {
      steps.push(t('matrices:matrix_operations.mathematical_concept.addition_formula'));
    } else {
      steps.push(t('matrices:matrix_operations.mathematical_concept.subtraction_formula'));
    }
    
    // Calcula o resultado
    const result = operation === 'soma' 
      ? addMatrices(matrixA, matrixB) 
      : subtractMatrices(matrixA, matrixB);
    
    if (!result) {
      steps.push(t('translation:common.error_calculating'));
      return steps;
    }
    
    // Adiciona o passo de cálculo com alguns exemplos de cálculos em vez de todos os elementos
    steps.push(t('matrices:matrix_operations.steps.calculating_element', { step: stepCount++ }));
    
    // Adiciona alguns exemplos de cálculos de elementos (primeiro e último elemento)
    const i1 = 0, j1 = 0;
    steps.push(`${t('translation:common.element')} (${i1+1},${j1+1}): ${matrixA[i1][j1]} ${operation === 'soma' ? '+' : '-'} ${matrixB[i1][j1]} = ${result[i1][j1]}`);
    
    if (rows > 1 && cols > 1) {
      const i2 = rows-1, j2 = cols-1;
      steps.push(`${t('translation:common.element')} (${i2+1},${j2+1}): ${matrixA[i2][j2]} ${operation === 'soma' ? '+' : '-'} ${matrixB[i2][j2]} = ${result[i2][j2]}`);
    }
    
    // Mostra o resultado final
    steps.push(t('matrices:matrix_operations.steps.result_matrix', { step: stepCount++ }));
    steps.push(t('matrices:matrix_operations.steps.result_description', { 
      operation: operation === 'soma' ? t('translation:common.sum') : t('translation:common.difference'),
      rows,
      cols
    }));
    
    result.forEach(row => {
      steps.push(`[${row.join(', ')}]`);
    });
    
    // Adiciona um separador para verificação
    steps.push(`---VERIFICATION_SEPARATOR---`);
    
    // Adiciona verificações das propriedades
    steps.push(t('matrices:matrix_operations.steps.verification_properties', { 
      operation: operation === 'soma' ? t('translation:common.addition') : t('translation:common.subtraction')
    }));
    
    if (operation === 'soma') {
      steps.push(t('matrices:matrix_operations.steps.checking_commutative'));
      steps.push(t('matrices:matrix_operations.steps.commutative_explanation'));
      
      // Adiciona também outras propriedades
      steps.push(t('matrices:matrix_operations.steps.checking_associative'));
      steps.push(t('matrices:matrix_operations.steps.associative_explanation'));
    } else {
      steps.push(t('matrices:matrix_operations.steps.checking_non_commutative'));
      steps.push(t('matrices:matrix_operations.steps.non_commutative_explanation'));
      
      // Menciona relação com adição
      steps.push(t('matrices:matrix_operations.steps.relation_with_addition'));
      steps.push(t('matrices:matrix_operations.steps.relation_explanation'));
    }
    
    // Conclui com as propriedades e aplicações
    steps.push(t('matrices:matrix_operations.steps.final_result', {
      operation: operation === 'soma' ? t('translation:common.addition') : t('translation:common.subtraction'),
      rows,
      cols
    }));
    
    return steps;
  };

  // Função principal de resolução
  const handleSolve = () => {
    dispatch({ type: 'RESET_CALCULATION' });
    
    try {
      // Verificar se os valores foram fornecidos
      if (!state.matrizA.trim()) {
        dispatch({ type: 'SET_ERROR', mensagem: t('matrices:matrix_operations.add_sub.errors.enter_matrix_a') });
        return;
      }
      
      if (!state.matrizB.trim()) {
        dispatch({ type: 'SET_ERROR', mensagem: t('matrices:matrix_operations.add_sub.errors.enter_matrix_b') });
        return;
      }
      
      // Parse das matrizes a partir das strings
      const matrizA = parseMatrixFromString(state.matrizA);
      const matrizB = parseMatrixFromString(state.matrizB);
      
      // Validar as matrizes
      if (!matrizA) {
        dispatch({ type: 'SET_ERROR', mensagem: t('matrices:matrix_operations.add_sub.errors.invalid_matrix_a_format') });
        return;
      }
      
      if (!matrizB) {
        dispatch({ type: 'SET_ERROR', mensagem: t('matrices:matrix_operations.add_sub.errors.invalid_matrix_b_format') });
        return;
      }
      
      if (!isValidMatrix(matrizA)) {
        dispatch({ type: 'SET_ERROR', mensagem: t('matrices:matrix_operations.add_sub.errors.invalid_matrix_a') });
        return;
      }
      
      if (!isValidMatrix(matrizB)) {
        dispatch({ type: 'SET_ERROR', mensagem: t('matrices:matrix_operations.add_sub.errors.invalid_matrix_b') });
        return;
      }
      
      if (!haveSameDimensions(matrizA, matrizB)) {
        const dimA = `${matrizA.length}×${matrizA[0].length}`;
        const dimB = `${matrizB.length}×${matrizB[0].length}`;
        dispatch({ 
          type: 'SET_ERROR', 
          mensagem: t('matrices:matrix_operations.add_sub.errors.different_dimensions', { dimA, dimB })
        });
        return;
      }
      
      // Gera os passos para a solução
      const passos = generateMatrixAddSubSteps(matrizA, matrizB, state.operacao);
      
      // Calcula o resultado
      const resultado = state.operacao === 'soma' 
        ? addMatrices(matrizA, matrizB)
        : subtractMatrices(matrizA, matrizB);
      
      if (!resultado) {
        dispatch({ 
          type: 'SET_ERROR', 
          mensagem: t('translation:common.calculation_error')
        });
        return;
      }
      
      dispatch({
        type: 'SET_RESULTADO',
        resultado,
        passos
      });
      
    } catch (error) {
      let errorMessage = t('matrices:matrix_operations.add_sub.errors.unknown_error');
      
      if (error instanceof Error) {
        if (error.message.includes('valores inválidos')) {
          errorMessage = t('matrices:matrix_operations.add_sub.errors.invalid_values');
        } else if (error.message.includes('mesmo número de colunas')) {
          errorMessage = t('matrices:matrix_operations.add_sub.errors.same_columns');
        } else {
          errorMessage = error.message;
        }
      }
      
      dispatch({ 
        type: 'SET_ERROR', 
        mensagem: errorMessage
      });
    }
  };

  // Aplicar um exemplo ao estado atual
  const applyExample = (example: MatrizExample) => {
    dispatch({ 
      type: 'APPLY_EXAMPLE', 
      matrizA: example.matrixA,
      matrizB: example.matrixB
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