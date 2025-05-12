import { useReducer } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  parseMatrixFromString, 
  isValidMatrix,
  matrixToInputString
} from '../../utils/mathUtilsMatrizes';

// Interface para exemplo de transposição
export interface TransposeExample {
  matrix: number[][];
  description: string;
  translationKey?: string;
}

// Função para obter a matriz transposta
const transposeMatrix = (matrix: number[][]): number[][] => {
  if (!matrix || matrix.length === 0) return [];
  
  const rows = matrix.length;
  const cols = matrix[0].length;
  
  const transpose: number[][] = Array(cols).fill(0).map(() => Array(rows).fill(0));
  
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      transpose[j][i] = matrix[i][j];
    }
  }
  
  return transpose;
};

// Função para gerar exemplos de matrizes para transposição
export const getTransposeExamples = (): TransposeExample[] => {
  return [
    {
      matrix: [
        [1, 2, 3],
        [4, 5, 6]
      ],
      description: 'Matriz 2×3',
      translationKey: 'matrix_2x3'
    },
    {
      matrix: [
        [1, 2],
        [3, 4],
        [5, 6]
      ],
      description: 'Matriz 3×2',
      translationKey: 'matrix_3x2'
    },
    {
      matrix: [
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1]
      ],
      description: 'Matriz identidade 3×3',
      translationKey: 'identity_matrix_3x3'
    },
    {
      matrix: [
        [1, 2, 3],
        [1, 2, 3]
      ],
      description: 'Matriz com linhas iguais',
      translationKey: 'matrix_equal_rows'
    },
    {
      matrix: [
        [1, 1],
        [2, 2],
        [3, 3]
      ],
      description: 'Matriz com colunas iguais',
      translationKey: 'matrix_equal_columns'
    }
  ];
};

// Gera os passos detalhados do cálculo da transposição
const generateTransposeSteps = (matrix: number[][], t: any): string[] => {
  const steps: string[] = [];
  let stepCount = 1;
  
  if (!isValidMatrix(matrix)) {
    steps.push(t('matrices:matrix_operations.transpose.steps.invalid_matrix'));
    return steps;
  }
  
  const rows = matrix.length;
  const cols = matrix[0].length;
  
  // Passo 1: Identificar a matriz de entrada
  steps.push(t('matrices:matrix_operations.steps.identify_matrices', { step: stepCount++ }));
  steps.push(t('matrices:matrix_operations.transpose.steps.original_matrix', { rows, cols }));
  matrix.forEach(row => {
    steps.push(`[${row.join(', ')}]`);
  });
  
  // Passo 2: Explicar o conceito de transposição
  steps.push(t('matrices:matrix_operations.transpose.steps.understand_concept', { step: stepCount++ }));
  steps.push(t('matrices:matrix_operations.transpose.steps.concept_description'));
  steps.push(t('matrices:matrix_operations.transpose.steps.dimension_change', { rows, cols }));
  
  // Passo 3: Processo de transposição
  steps.push(t('matrices:matrix_operations.transpose.steps.apply_transposition', { step: stepCount++ }));
  steps.push(t('matrices:matrix_operations.transpose.steps.initial_form', { rows, cols }));
  steps.push(t('matrices:matrix_operations.transpose.steps.applying_transpose', { cols, rows }));
  
  // Calculando a transposta
  const transposed = transposeMatrix(matrix);
  
  // Mostrar o processo para cada elemento
  steps.push(t('matrices:matrix_operations.transpose.steps.element_mapping_detail', { step: stepCount++ }));
  steps.push(t('matrices:matrix_operations.transpose.steps.element_mapping'));
  
  // Exemplos específicos de mapeamento
  const examples = Math.min(3, rows * cols); // Limitar a quantidade de exemplos
  let exampleCount = 0;
  
  for (let i = 0; i < rows && exampleCount < examples; i++) {
    for (let j = 0; j < cols && exampleCount < examples; j++) {
      steps.push(t('matrices:matrix_operations.transpose.steps.element_example', {
        row: i+1,
        col: j+1,
        value: matrix[i][j],
        newRow: j+1,
        newCol: i+1
      }));
      exampleCount++;
    }
  }
  
  if (rows * cols > examples) {
    steps.push(t('matrices:matrix_operations.transpose.steps.and_so_on'));
  }
  
  // Apresentar o resultado
  steps.push(t('matrices:matrix_operations.steps.result_matrix', { step: stepCount++ }));
  steps.push(t('matrices:matrix_operations.transpose.steps.resulting_transpose', { cols, rows }));
  transposed.forEach(row => {
    steps.push(`[${row.join(', ')}]`);
  });
  
  // Adiciona um separador para verificação
  steps.push(`---VERIFICATION_SEPARATOR---`);
  
  // Verificação de propriedades
  steps.push(t('matrices:matrix_operations.transpose.steps.verification_properties'));
  
  steps.push(t('matrices:matrix_operations.transpose.steps.prop1_title'));
  steps.push(t('matrices:matrix_operations.transpose.steps.prop1_description'));
  
  steps.push(t('matrices:matrix_operations.transpose.steps.prop2_title'));
  steps.push(t('matrices:matrix_operations.transpose.steps.prop2_description'));
  
  steps.push(t('matrices:matrix_operations.transpose.steps.prop3_title'));
  steps.push(t('matrices:matrix_operations.transpose.steps.prop3_description'));
  
  steps.push(t('matrices:matrix_operations.transpose.steps.prop4_title'));
  steps.push(t('matrices:matrix_operations.transpose.steps.prop4_description'));
  
  // Casos especiais
  if (rows === cols) {
    // Para matrizes quadradas, podemos verificar se ela é simétrica
    let isSymmetric = true;
    
    for (let i = 0; i < rows && isSymmetric; i++) {
      for (let j = 0; j < cols && isSymmetric; j++) {
        if (matrix[i][j] !== matrix[j][i]) {
          isSymmetric = false;
        }
      }
    }
    
    if (isSymmetric) {
      steps.push(t('matrices:matrix_operations.transpose.steps.symmetric_true'));
      steps.push(t('matrices:matrix_operations.transpose.steps.symmetric_explanation'));
    } else {
      steps.push(t('matrices:matrix_operations.transpose.steps.symmetric_false'));
    }
  }
  
  steps.push(t('matrices:matrix_operations.transpose.steps.final_result'));
  
  return steps;
};

// Interface de estado
type State = {
  matrix: string;
  result: number[][] | null;
  steps: string[];
  error: string | null;
  showExplanation: boolean;
  showConceitoMatematico: boolean;
  parsedMatrix: number[][] | null;
};

// Tipos de ações
type Action =
  | { type: 'SET_MATRIX'; value: string }
  | { type: 'RESET_CALCULATION' }
  | { type: 'SET_RESULT'; result: number[][] | null; steps: string[] }
  | { type: 'SET_ERROR'; message: string }
  | { type: 'TOGGLE_EXPLANATION' }
  | { type: 'TOGGLE_CONCEITO_MATEMATICO' }
  | { type: 'APPLY_EXAMPLE'; example: TransposeExample };

// Estado inicial
const initialState: State = {
  matrix: '',
  result: null,
  steps: [],
  error: null,
  showExplanation: false,
  showConceitoMatematico: true,
  parsedMatrix: null
};

// Função reducer
function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_MATRIX':
      return { 
        ...state, 
        matrix: action.value,
        parsedMatrix: parseMatrixFromString(action.value)
      };
    case 'RESET_CALCULATION':
      return {
        ...state,
        result: null,
        steps: [],
        error: null,
        showExplanation: false
      };
    case 'SET_RESULT':
      return {
        ...state,
        result: action.result,
        steps: action.steps,
        error: null,
        showExplanation: true
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.message,
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
        matrix: matrixToInputString(action.example.matrix),
        parsedMatrix: action.example.matrix
      };
    default:
      return state;
  }
}

export function useMatrizTransposeSolver() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { t } = useTranslation(['matrices', 'translation']);

  // Função principal de resolução
  const handleSolve = () => {
    dispatch({ type: 'RESET_CALCULATION' });
    
    try {
      // Verificar se a matriz foi fornecida
      if (!state.matrix.trim()) {
        dispatch({ type: 'SET_ERROR', message: t('matrices:matrix_operations.transpose.errors.enter_matrix') });
        return;
      }
      
      // Parse da matriz a partir da string
      const matrix = parseMatrixFromString(state.matrix);
      
      if (!matrix) {
        dispatch({ type: 'SET_ERROR', message: t('matrices:matrix_operations.transpose.errors.invalid_format') });
        return;
      }
      
      if (!isValidMatrix(matrix)) {
        dispatch({ type: 'SET_ERROR', message: t('matrices:matrix_operations.transpose.errors.invalid_matrix') });
        return;
      }
      
      // Calcular a transposta e gerar os passos
      const transposed = transposeMatrix(matrix);
      const steps = generateTransposeSteps(matrix, t);
      
      dispatch({
        type: 'SET_RESULT',
        result: transposed,
        steps
      });
      
    } catch (error) {
      let errorMessage = t('matrices:matrix_operations.transpose.errors.unknown_error');
      
      if (error instanceof Error) {
        if (error.message.includes('valores inválidos')) {
          errorMessage = t('matrices:matrix_operations.transpose.errors.invalid_values');
        } else if (error.message.includes('mesmo número de colunas')) {
          errorMessage = t('matrices:matrix_operations.transpose.errors.same_columns');
        } else {
          errorMessage = error.message;
        }
      }
      
      dispatch({ 
        type: 'SET_ERROR', 
        message: errorMessage
      });
    }
  };

  // Aplicar exemplo de transposição
  const applyExample = (example: TransposeExample) => {
    dispatch({ 
      type: 'APPLY_EXAMPLE', 
      example
    });
  };

  // Retornar o estado e as funções
  return {
    state,
    dispatch,
    handleSolve,
    applyExample
  };
} 