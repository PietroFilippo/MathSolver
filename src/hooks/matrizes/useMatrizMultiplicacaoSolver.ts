import { useReducer } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  parseMatrixFromString, 
  multiplyMatrices,
  multiplyMatrixByScalar,
  isValidMatrix,
  isValidForMultiplication,
  matrixToInputString,
  MatrizMultiplicationExample,
  ScalarMultiplicationExample
} from '../../utils/mathUtilsMatrizes';

// Tipos de operação
export type MultiplicationType = 'matrix' | 'scalar';

// Interface de estado
type State = {
  matrixA: string;
  matrixB: string;
  scalar: string;
  operationType: MultiplicationType;
  result: number[][] | null;
  steps: string[];
  error: string | null;
  showExplanation: boolean;
  showConceitoMatematico: boolean;
  parsedMatrixA: number[][] | null;
  parsedMatrixB: number[][] | null;
};

// Tipos de ações
type Action =
  | { type: 'SET_MATRIX_A'; value: string }
  | { type: 'SET_MATRIX_B'; value: string }
  | { type: 'SET_SCALAR'; value: string }
  | { type: 'SET_OPERATION_TYPE'; value: MultiplicationType }
  | { type: 'RESET_CALCULATION' }
  | { type: 'SET_RESULT'; result: number[][] | null; steps: string[] }
  | { type: 'SET_ERROR'; message: string }
  | { type: 'TOGGLE_EXPLANATION' }
  | { type: 'TOGGLE_CONCEITO_MATEMATICO' }
  | { type: 'APPLY_MATRIX_EXAMPLE'; example: MatrizMultiplicationExample }
  | { type: 'APPLY_SCALAR_EXAMPLE'; example: ScalarMultiplicationExample };

// Estado inicial
const initialState: State = {
  matrixA: '',
  matrixB: '',
  scalar: '2',  // Valor padrão
  operationType: 'matrix',
  result: null,
  steps: [],
  error: null,
  showExplanation: false,
  showConceitoMatematico: true,
  parsedMatrixA: null,
  parsedMatrixB: null
};

// Função reducer
function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_MATRIX_A':
      return { 
        ...state, 
        matrixA: action.value,
        parsedMatrixA: parseMatrixFromString(action.value)
      };
    case 'SET_MATRIX_B':
      return { 
        ...state, 
        matrixB: action.value,
        parsedMatrixB: parseMatrixFromString(action.value)
      };
    case 'SET_SCALAR':
      return { ...state, scalar: action.value };
    case 'SET_OPERATION_TYPE':
      return { ...state, operationType: action.value };
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
    case 'APPLY_MATRIX_EXAMPLE':
      return {
        ...state,
        matrixA: matrixToInputString(action.example.matrixA),
        matrixB: matrixToInputString(action.example.matrixB),
        operationType: 'matrix',
        parsedMatrixA: action.example.matrixA,
        parsedMatrixB: action.example.matrixB
      };
    case 'APPLY_SCALAR_EXAMPLE':
      return {
        ...state,
        matrixA: matrixToInputString(action.example.matrix),
        scalar: String(action.example.scalar),
        operationType: 'scalar',
        parsedMatrixA: action.example.matrix
      };
    default:
      return state;
  }
}

// Gera os passos de cálculo para multiplicação de matrizes com tradução
const generateMatrixMultiplicationSteps = (
  matrixA: number[][],
  matrixB: number[][],
  t: (key: string, params?: Record<string, any>) => string
): string[] => {
  const steps: string[] = [];
  let stepCount = 1;
  
  // Verifica se as dimensões são compatíveis para multiplicação
  if (!isValidForMultiplication(matrixA, matrixB)) {
    steps.push(t('matrices:matrix_operations.multiplication.errors.incompatible_dimensions', {
      dimA: `${matrixA.length}×${matrixA[0].length}`,
      dimB: `${matrixB.length}×${matrixB[0].length}`
    }));
    return steps;
  }
  
  const rowsA = matrixA.length;
  const colsA = matrixA[0].length;
  const colsB = matrixB[0].length;
  
  // Adiciona informações iniciais - Step 1
  steps.push(t('matrices:matrix_operations.steps.identify_matrices', { step: stepCount++ }));
  steps.push(t('matrices:matrix_operations.steps.initial_form', { operation: 'A × B' }));
  
  // Adiciona a representação das matrizes
  steps.push(t('matrices:matrix_operations.steps.matrix_a_representation', { rows: rowsA, cols: colsA }));
  matrixA.forEach(row => {
    steps.push(`[${row.join(', ')}]`);
  });
  
  steps.push(t('matrices:matrix_operations.steps.matrix_b_representation', { rows: colsA, cols: colsB }));
  matrixB.forEach(row => {
    steps.push(`[${row.join(', ')}]`);
  });
  
  // Explica a compatibilidade das dimensões - Step 2
  steps.push(t('matrices:matrix_operations.steps.matrix_dimensions', { step: stepCount++ }));
  steps.push(t('matrices:matrix_operations.multiplication.steps.dimensions_verification', { colsA: colsA, rowsB: colsA }));
  steps.push(t('matrices:matrix_operations.multiplication.steps.dimensions_compatible'));
  steps.push(t('matrices:matrix_operations.multiplication.steps.result_dimension', { rowsA: rowsA, colsB: colsB }));
  
  // Explica o processo de multiplicação - Step 3
  steps.push(t('matrices:matrix_operations.steps.element_operation', { step: stepCount++ }));
  // Adiciona a fórmula de multiplicação de matrizes
  steps.push(t('matrices:matrix_operations.multiplication.steps.matrix_formula', { colsA: colsA }));
  // Adiciona a explicação do cálculo dos elementos
  steps.push(t('matrices:matrix_operations.multiplication.steps.element_calculation_description'));
  
  // Calcula o resultado
  const result = multiplyMatrices(matrixA, matrixB);
  
  if (!result) {
    steps.push(t('matrices:matrix_operations.multiplication.steps.calculation_error'));
    return steps;
  }
  
  // Mostra o cálculo detalhado para cada elemento da matriz resultante - Step 4
  steps.push(t('matrices:matrix_operations.steps.calculating_element', { step: stepCount++ }));
  
  for (let i = 0; i < rowsA; i++) {
    for (let j = 0; j < colsB; j++) {
      steps.push(t('matrices:matrix_operations.multiplication.steps.calculating_element', { i: i+1, j: j+1 }));
      
      let calculation: string[] = [];
      let sum = 0;
      
      for (let k = 0; k < colsA; k++) {
        const product = matrixA[i][k] * matrixB[k][j];
        calculation.push(`(${matrixA[i][k]} × ${matrixB[k][j]})`);
        sum += product;
      }
      
      steps.push(`${calculation.join(' + ')} = ${sum}`);
    }
  }
  
  // Mostra o resultado final - Step 5
  steps.push(t('matrices:matrix_operations.steps.result_matrix', { step: stepCount++ }));
  steps.push(t('matrices:matrix_operations.steps.result_description', { operation: 'A × B', rows: rowsA, cols: colsB }));
  result.forEach(row => {
    steps.push(`[${row.join(', ')}]`);
  });
  
  // Adiciona um separador para verificação
  steps.push(`---VERIFICATION_SEPARATOR---`);
  
  // Adiciona verificações e propriedades
  steps.push(t('matrices:matrix_operations.steps.verification_properties', { operation: t('matrices:matrix_operations.multiplication.title') }));
  steps.push(t('matrices:matrix_operations.steps.checking_non_commutative'));
  steps.push(t('matrices:matrix_operations.steps.non_commutative_explanation'));
  
  steps.push(t('matrices:matrix_operations.steps.checking_associative'));
  steps.push(t('matrices:matrix_operations.steps.associative_explanation'));
  
  steps.push(t('matrices:matrix_operations.steps.relation_with_addition'));
  steps.push(t('matrices:matrix_operations.steps.relation_explanation'));
  
  // Conclui com as propriedades e aplicações
  steps.push(t('matrices:matrix_operations.steps.final_result', { operation: t('matrices:matrix_operations.multiplication.title'), rows: rowsA, cols: colsB }));
  
  return steps;
};

// Gera os passos de cálculo para multiplicação por escalar com tradução
const generateScalarMultiplicationSteps = (
  matrix: number[][],
  scalar: number,
  t: (key: string, params?: Record<string, any>) => string
): string[] => {
  const steps: string[] = [];
  let stepCount = 1;
  
  const rows = matrix.length;
  const cols = matrix[0].length;
  
  // Adiciona informações iniciais - Step 1
  steps.push(t('matrices:matrix_operations.steps.identify_matrices', { step: stepCount++ }));
  steps.push(t('matrices:matrix_operations.multiplication.steps.initial_form_scalar', { scalar: scalar }));
  
  // Adiciona a representação da matriz
  steps.push(t('matrices:matrix_operations.multiplication.steps.matrix_a', { rows: rows, cols: cols }));
  matrix.forEach(row => {
    steps.push(`[${row.join(', ')}]`);
  });
  
  // Adiciona informações sobre o escalar
  steps.push(t('matrices:matrix_operations.multiplication.steps.scalar', { scalar: scalar }));
  
  // Explica o processo de multiplicação por escalar - Step 2
  steps.push(t('matrices:matrix_operations.steps.element_operation', { step: stepCount++ }));
  steps.push(t('matrices:matrix_operations.multiplication.concept.scalar_formula_description'));
  steps.push(t('matrices:matrix_operations.multiplication.concept.scalar_formula_explanation'));
  
  // Calcula o resultado
  const result = multiplyMatrixByScalar(matrix, scalar);
  
  if (!result) {
    steps.push(t('matrices:matrix_operations.multiplication.steps.calculation_error'));
    return steps;
  }
  
  // Mostra o cálculo detalhado para cada elemento da matriz resultante - Step 3
  steps.push(t('matrices:matrix_operations.steps.calculating_element', { step: stepCount++ }));
  
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      steps.push(t('matrices:matrix_operations.multiplication.steps.calculating_scalar_element', { 
        i: i+1, 
        j: j+1,
        scalar: scalar,
        value: matrix[i][j],
        result: scalar * matrix[i][j]
      }));
    }
  }
  
  // Mostra o resultado final - Step 4
  steps.push(t('matrices:matrix_operations.steps.result_matrix', { step: stepCount++ }));
  steps.push(t('matrices:matrix_operations.steps.result_description', { operation: `${scalar} × A`, rows: rows, cols: cols }));
  result.forEach(row => {
    steps.push(`[${row.join(', ')}]`);
  });
  
  // Adiciona um separador para verificação
  steps.push(`---VERIFICATION_SEPARATOR---`);
  
  // Adiciona verificações e propriedades
  steps.push(t('matrices:matrix_operations.steps.verification_properties', { operation: t('matrices:matrix_operations.multiplication.scalar_title') }));
  
  // Propriedade distributiva
  steps.push(t('matrices:matrix_operations.multiplication.concept.scalar_property1_title'));
  steps.push(t('matrices:matrix_operations.multiplication.concept.scalar_property1_explanation'));
  
  // Propriedade associativa
  steps.push(t('matrices:matrix_operations.multiplication.concept.scalar_property3_title'));
  steps.push(t('matrices:matrix_operations.multiplication.concept.scalar_property3_explanation'));
  
  // Conclui com as propriedades e aplicações
  steps.push(t('matrices:matrix_operations.multiplication.steps.scalar_final_result'));
  
  return steps;
};

export function useMatrizMultiplicationSolver() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { t } = useTranslation(['matrices', 'translation']);

  // Função principal de resolução
  const handleSolve = () => {
    dispatch({ type: 'RESET_CALCULATION' });
    
    try {
      // Verificações comuns para ambos os tipos de operação
      if (!state.matrixA.trim()) {
        dispatch({ type: 'SET_ERROR', message: t('matrices:matrix_operations.multiplication.errors.empty_matrix_a') });
        return;
      }
      
      // Extrair valores de matriz e validar
      const matrixA = parseMatrixFromString(state.matrixA);
      
      if (!matrixA) {
        dispatch({ type: 'SET_ERROR', message: t('matrices:matrix_operations.multiplication.errors.invalid_matrix_a') });
        return;
      }
      
      if (!isValidMatrix(matrixA)) {
        dispatch({ type: 'SET_ERROR', message: t('matrices:matrix_operations.multiplication.errors.invalid_matrix_a_rows') });
        return;
      }
      
      // Verificações específicas para multiplicação de matrizes
      if (state.operationType === 'matrix') {
        if (!state.matrixB.trim()) {
          dispatch({ type: 'SET_ERROR', message: t('matrices:matrix_operations.multiplication.errors.empty_matrix_b') });
          return;
        }
        
        const matrixB = parseMatrixFromString(state.matrixB);
        
        if (!matrixB) {
          dispatch({ type: 'SET_ERROR', message: t('matrices:matrix_operations.multiplication.errors.invalid_matrix_b') });
          return;
        }
        
        if (!isValidMatrix(matrixB)) {
          dispatch({ type: 'SET_ERROR', message: t('matrices:matrix_operations.multiplication.errors.invalid_matrix_b_rows') });
          return;
        }
        
        // Verificar se as dimensões são compatíveis para multiplicação
        if (!isValidForMultiplication(matrixA, matrixB)) {
          const dimA = `${matrixA.length}×${matrixA[0].length}`;
          const dimB = `${matrixB.length}×${matrixB[0].length}`;
          dispatch({ 
            type: 'SET_ERROR', 
            message: t('matrices:matrix_operations.multiplication.errors.incompatible_dimensions', { dimA, dimB })
          });
          return;
        }
        
        // Calcular o produto das matrizes
        const result = multiplyMatrices(matrixA, matrixB);
        
        if (!result) {
          dispatch({ 
            type: 'SET_ERROR', 
            message: t('matrices:matrix_operations.multiplication.errors.calculation_error')
          });
          return;
        }
        
        // Gerar os passos para a solução
        const steps = generateMatrixMultiplicationSteps(matrixA, matrixB, t);
        
        dispatch({
          type: 'SET_RESULT',
          result,
          steps
        });
      } 
      // Verificações específicas para multiplicação por escalar
      else {
        if (!state.scalar.trim()) {
          dispatch({ type: 'SET_ERROR', message: t('matrices:matrix_operations.multiplication.errors.empty_scalar') });
          return;
        }
        
        const scalar = parseFloat(state.scalar.replace(',', '.'));
        
        if (isNaN(scalar)) {
          dispatch({ type: 'SET_ERROR', message: t('matrices:matrix_operations.multiplication.errors.invalid_scalar') });
          return;
        }
        
        // Calcular o produto da matriz pelo escalar
        const result = multiplyMatrixByScalar(matrixA, scalar);
        
        // Gerar os passos para a solução
        const steps = generateScalarMultiplicationSteps(matrixA, scalar, t);
        
        dispatch({
          type: 'SET_RESULT',
          result,
          steps
        });
      }
      
    } catch (error) {
      let errorMessage = t('matrices:matrix_operations.multiplication.errors.unknown_error');
      
      if (error instanceof Error) {
        if (error.message.includes('valores inválidos')) {
          errorMessage = t('matrices:matrix_operations.multiplication.errors.invalid_matrix_a');
        } else if (error.message.includes('mesmo número de colunas')) {
          errorMessage = t('matrices:matrix_operations.multiplication.errors.invalid_matrix_a_rows');
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

  // Aplicar exemplo de multiplicação de matrizes
  const applyMatrixExample = (example: MatrizMultiplicationExample) => {
    dispatch({ 
      type: 'APPLY_MATRIX_EXAMPLE', 
      example
    });
  };

  // Aplicar exemplo de multiplicação por escalar
  const applyScalarExample = (example: ScalarMultiplicationExample) => {
    dispatch({ 
      type: 'APPLY_SCALAR_EXAMPLE', 
      example
    });
  };

  // Retornar o estado e as funções
  return {
    state,
    dispatch,
    handleSolve,
    applyMatrixExample,
    applyScalarExample
  };
} 