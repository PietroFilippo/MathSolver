import { useReducer } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  parseMatrixFromString, 
  isValidMatrix,
  isSquareMatrix,
  calculateDeterminant,
  calculateInverseMatrix,
  calculateCofactorMatrix,
  calculateAdjointMatrix,
  matrixToInputString,
  InverseMatrixExample,
  getInverseMatrixExamples as getInverseExamples
} from '../../utils/mathUtilsMatrizes';

// Re-export the examples function
export const getInverseMatrixExamples = getInverseExamples;

// Gera os passos detalhados do cálculo da matriz inversa
const generateInverseSteps = (matrix: number[][]): string[] => {
  const steps: string[] = [];
  let stepCount = 1;
  
  if (!isValidMatrix(matrix)) {
    steps.push(`A matriz não é válida. Não é possível calcular a inversa.`);
    return steps;
  }
  
  if (!isSquareMatrix(matrix)) {
    steps.push(`A matriz não é quadrada. Apenas matrizes quadradas podem ter inversa.`);
    return steps;
  }
  
  const n = matrix.length;
  
  // Passo 1: Identificar a matriz de entrada
  steps.push(`Passo ${stepCount++}: Identificar a matriz de entrada.`);
  steps.push(`Matriz original (${n}×${n}):`);
  matrix.forEach(row => {
    steps.push(`[${row.join(', ')}]`);
  });
  
  // Passo 2: Calcular o determinante
  steps.push(`Passo ${stepCount++}: Calcular o determinante da matriz.`);
  const determinant = calculateDeterminant(matrix);
  
  if (determinant === null) {
    steps.push(`Não foi possível calcular o determinante.`);
    return steps;
  }
  
  steps.push(`Determinante = ${determinant}`);
  
  // Verificar se a matriz é inversível
  if (determinant === 0) {
    steps.push(`Como o determinante é zero, a matriz não possui inversa.`);
    return steps;
  }
  
  // Passo 3: Calcular a matriz de cofatores
  steps.push(`Passo ${stepCount++}: Calcular a matriz de cofatores.`);
  steps.push(`Para cada elemento a${n < 4 ? 'ᵢⱼ' : 'ij'} da matriz original, calculamos seu cofator:`);
  steps.push(`Cofator de a${n < 4 ? 'ᵢⱼ' : 'ij'} = (-1)^(i+j) × determinante da submatriz obtida ao eliminar a linha i e coluna j.`);
  
  const cofactorMatrix = calculateCofactorMatrix(matrix);
  
  if (!cofactorMatrix) {
    steps.push(`Não foi possível calcular a matriz de cofatores.`);
    return steps;
  }
  
  steps.push(`Matriz de cofatores:`);
  cofactorMatrix.forEach(row => {
    steps.push(`[${row.join(', ')}]`);
  });
  
  // Passo 4: Calcular a matriz adjunta (transposta da matriz de cofatores)
  steps.push(`Passo ${stepCount++}: Calcular a matriz adjunta (transposta da matriz de cofatores).`);
  const adjointMatrix = calculateAdjointMatrix(matrix);
  
  if (!adjointMatrix) {
    steps.push(`Não foi possível calcular a matriz adjunta.`);
    return steps;
  }
  
  steps.push(`Matriz adjunta:`);
  adjointMatrix.forEach(row => {
    steps.push(`[${row.join(', ')}]`);
  });
  
  // Passo 5: Calcular a matriz inversa
  steps.push(`Passo ${stepCount++}: Calcular a matriz inversa usando a fórmula: A⁻¹ = (1/det(A)) × adj(A).`);
  const inverseMatrix = calculateInverseMatrix(matrix);
  
  if (!inverseMatrix) {
    steps.push(`Não foi possível calcular a matriz inversa.`);
    return steps;
  }
  
  steps.push(`Resultado: Matriz inversa (${n}×${n}):`);
  inverseMatrix.forEach(row => {
    steps.push(`[${row.join(', ')}]`);
  });
  
  // Passo 6: Verificação (A × A⁻¹ = I)
  steps.push(`Passo ${stepCount++}: Verificação (A × A⁻¹ = I).`);
  steps.push(`Para verificar que a inversa está correta, multiplicamos a matriz original pela sua inversa.`);
  steps.push(`O resultado deve ser aproximadamente igual à matriz identidade.`);
  
  // Adiciona um separador para verificação
  steps.push(`---VERIFICATION_SEPARATOR---`);
  
  // Verificação de propriedades
  steps.push(`Verificação: Propriedades da matriz inversa`);
  
  steps.push(`1. A × A⁻¹ = A⁻¹ × A = I`);
  steps.push(`   Uma matriz multiplicada por sua inversa resulta na matriz identidade.`);
  
  steps.push(`2. (A⁻¹)⁻¹ = A`);
  steps.push(`   A inversa da inversa é a matriz original.`);
  
  steps.push(`3. (A × B)⁻¹ = B⁻¹ × A⁻¹`);
  steps.push(`   A inversa do produto é o produto das inversas na ordem inversa.`);
  
  steps.push(`4. (kA)⁻¹ = (1/k) × A⁻¹, para k ≠ 0`);
  steps.push(`   A inversa de uma matriz multiplicada por um escalar é a inversa da matriz multiplicada pelo recíproco do escalar.`);
  
  steps.push(`5. (Aᵀ)⁻¹ = (A⁻¹)ᵀ`);
  steps.push(`   A transposta da inversa é igual à inversa da transposta.`);
  
  steps.push(`Resultado final: Inversa calculada com sucesso.`);
  
  return steps;
};

// Cria uma função que gera os passos com tradução
export const generateInverseStepsWithTranslation = (
  matrix: number[][],
  t: (key: string, options?: any) => string
): string[] => {
  const steps: string[] = [];
  let stepCount = 1;
  
  if (!isValidMatrix(matrix)) {
    steps.push(t('inverse.steps.not_square_matrix'));
    return steps;
  }
  
  if (!isSquareMatrix(matrix)) {
    steps.push(t('inverse.steps.not_square_matrix'));
    return steps;
  }
  
  const n = matrix.length;
  
  // Passo 1: Identificar a matriz de entrada
  steps.push(t('inverse.steps.identify_input_matrix', { step: stepCount++ }));
  steps.push(t('inverse.steps.input_matrix', { rows: n, cols: n }));
  matrix.forEach(row => {
    steps.push(`[${row.join(', ')}]`);
  });
  
  // Passo 2: Calcular o determinante
  steps.push(t('inverse.steps.calculate_determinant', { step: stepCount++ }));
  const determinant = calculateDeterminant(matrix);
  
  if (determinant === null) {
    steps.push(t('inverse.errors.calculation_error'));
    return steps;
  }
  
  steps.push(t('inverse.steps.determinant_value', { value: determinant }));
  
  // Verificar se a matriz é inversível
  if (determinant === 0) {
    steps.push(t('inverse.steps.zero_determinant'));
    return steps;
  }
  
  // Passo 3: Calcular a matriz de cofatores
  steps.push(t('inverse.steps.cofactor_matrix', { step: stepCount++ }));
  steps.push(t('inverse.steps.cofactor_explanation'));
  steps.push(t('inverse.steps.cofactor_formula'));
  
  const cofactorMatrix = calculateCofactorMatrix(matrix);
  
  if (!cofactorMatrix) {
    steps.push(t('inverse.errors.calculation_error'));
    return steps;
  }
  
  steps.push(t('inverse.steps.cofactor_matrix_result'));
  cofactorMatrix.forEach(row => {
    steps.push(`[${row.join(', ')}]`);
  });
  
  // Passo 4: Calcular a matriz adjunta
  steps.push(t('inverse.steps.adjoint_matrix', { step: stepCount++ }));
  const adjointMatrix = calculateAdjointMatrix(matrix);
  
  if (!adjointMatrix) {
    steps.push(t('inverse.errors.calculation_error'));
    return steps;
  }
  
  steps.push(t('inverse.steps.adjoint_matrix_result'));
  adjointMatrix.forEach(row => {
    steps.push(`[${row.join(', ')}]`);
  });
  
  // Passo 5: Calcular a matriz inversa
  steps.push(t('inverse.steps.inverse_formula', { step: stepCount++ }));
  const inverseMatrix = calculateInverseMatrix(matrix);
  
  if (!inverseMatrix) {
    steps.push(t('inverse.errors.calculation_error'));
    return steps;
  }
  
  steps.push(t('inverse.steps.result', { rows: n, cols: n }));
  inverseMatrix.forEach(row => {
    steps.push(`[${row.join(', ')}]`);
  });
  
  // Passo 6: Verificação
  steps.push(t('inverse.steps.verification', { step: stepCount++ }));
  steps.push(t('inverse.steps.verification_explanation'));
  steps.push(t('inverse.steps.verification_identity'));
  
  // Adiciona um separador para verificação
  steps.push(`---VERIFICATION_SEPARATOR---`);
  
  // Verificação de propriedades
  steps.push(t('inverse.verification.properties_title'));
  
  steps.push(t('inverse.verification.identity_property'));
  steps.push(`   ${t('inverse.verification.identity_explanation')}`);
  
  steps.push(t('inverse.verification.inverse_of_inverse'));
  steps.push(`   ${t('inverse.verification.inverse_of_inverse_explanation')}`);
  
  steps.push(t('inverse.verification.product_inverse'));
  steps.push(`   ${t('inverse.verification.product_inverse_explanation')}`);
  
  steps.push(t('inverse.verification.scalar_inverse'));
  steps.push(`   ${t('inverse.verification.scalar_inverse_explanation')}`);
  
  steps.push(t('inverse.verification.transpose_inverse'));
  steps.push(`   ${t('inverse.verification.transpose_inverse_explanation')}`);
  
  steps.push(`${t('inverse.steps.final_conclusion')}`);
  
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
  | { type: 'APPLY_EXAMPLE'; example: InverseMatrixExample };

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

export function useMatrizInverseSolver() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { t } = useTranslation('matrices');

  // Função principal de resolução
  const handleSolve = () => {
    dispatch({ type: 'RESET_CALCULATION' });
    
    try {
      // Verificar se a matriz foi fornecida
      if (!state.matrix.trim()) {
        dispatch({ type: 'SET_ERROR', message: t('inverse.errors.enter_matrix') });
        return;
      }
      
      // Parse da matriz a partir da string
      const matrix = parseMatrixFromString(state.matrix);
      
      if (!matrix) {
        dispatch({ type: 'SET_ERROR', message: t('inverse.errors.invalid_matrix_format') });
        return;
      }
      
      if (!isValidMatrix(matrix)) {
        dispatch({ type: 'SET_ERROR', message: t('inverse.errors.invalid_matrix') });
        return;
      }
      
      if (!isSquareMatrix(matrix)) {
        dispatch({ type: 'SET_ERROR', message: t('inverse.errors.not_square_matrix') });
        return;
      }
      
      const determinant = calculateDeterminant(matrix);
      if (determinant === 0) {
        dispatch({ type: 'SET_ERROR', message: t('inverse.errors.zero_determinant') });
        return;
      }
      
      // Calcular a inversa e gerar os passos
      const inverse = calculateInverseMatrix(matrix);
      const steps = generateInverseStepsWithTranslation(matrix, t);
      
      dispatch({
        type: 'SET_RESULT',
        result: inverse,
        steps
      });
      
    } catch (error) {
      let errorMessage = t('inverse.errors.unknown_error');
      
      if (error instanceof Error) {
        if (error.message.includes('valores inválidos')) {
          errorMessage = t('inverse.errors.invalid_values');
        } else if (error.message.includes('mesmo número de colunas')) {
          errorMessage = t('inverse.errors.same_columns');
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

  // Aplicar exemplo de matriz inversa
  const applyExample = (example: InverseMatrixExample) => {
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
    applyExample,
    t
  };
} 