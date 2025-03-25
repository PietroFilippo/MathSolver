import { useReducer } from 'react';
import { 
  parseMatrixFromString, 
  isValidMatrix,
  matrixToInputString
} from '../../utils/mathUtilsMatrizes';

// Interface para exemplo de transposição
export interface TransposeExample {
  matrix: number[][];
  description: string;
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
      description: 'Matriz 2×3'
    },
    {
      matrix: [
        [1, 2],
        [3, 4],
        [5, 6]
      ],
      description: 'Matriz 3×2'
    },
    {
      matrix: [
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1]
      ],
      description: 'Matriz identidade 3×3'
    },
    {
      matrix: [
        [1, 2, 3],
        [1, 2, 3]
      ],
      description: 'Matriz com linhas iguais'
    },
    {
      matrix: [
        [1, 1],
        [2, 2],
        [3, 3]
      ],
      description: 'Matriz com colunas iguais'
    }
  ];
};

// Gera os passos detalhados do cálculo da transposição
const generateTransposeSteps = (matrix: number[][]): string[] => {
  const steps: string[] = [];
  let stepCount = 1;
  
  if (!isValidMatrix(matrix)) {
    steps.push(`A matriz não é válida. Não é possível calcular a transposta.`);
    return steps;
  }
  
  const rows = matrix.length;
  const cols = matrix[0].length;
  
  // Passo 1: Identificar a matriz de entrada
  steps.push(`Passo ${stepCount++}: Identificar a matriz de entrada.`);
  steps.push(`Matriz original (${rows}×${cols}):`);
  matrix.forEach(row => {
    steps.push(`[${row.join(', ')}]`);
  });
  
  // Passo 2: Explicar o conceito de transposição
  steps.push(`Passo ${stepCount++}: Compreender o conceito de matriz transposta.`);
  steps.push(`A transposta de uma matriz é obtida transformando suas linhas em colunas e vice-versa.`);
  steps.push(`Se A é uma matriz de dimensão m×n, então A^T será uma matriz de dimensão n×m.`);
  
  // Passo 3: Processo de transposição
  steps.push(`Passo ${stepCount++}: Aplicar o processo de transposição.`);
  steps.push(`Forma inicial: A = matriz ${rows}×${cols}`);
  steps.push(`Aplicando a transposição: A^T = matriz ${cols}×${rows}`);
  
  // Calculando a transposta
  const transposed = transposeMatrix(matrix);
  
  // Mostrar o processo para cada elemento
  steps.push(`Passo ${stepCount++}: Mapeamento detalhado dos elementos.`);
  steps.push(`Para cada elemento A[i,j] da matriz original, o elemento correspondente na transposta será A^T[j,i].`);
  
  // Exemplos específicos de mapeamento
  const examples = Math.min(3, rows * cols); // Limitar a quantidade de exemplos
  let exampleCount = 0;
  
  for (let i = 0; i < rows && exampleCount < examples; i++) {
    for (let j = 0; j < cols && exampleCount < examples; j++) {
      steps.push(`Elemento A[${i+1},${j+1}] = ${matrix[i][j]} → A^T[${j+1},${i+1}] = ${matrix[i][j]}`);
      exampleCount++;
    }
  }
  
  if (rows * cols > examples) {
    steps.push(`... e assim por diante para todos os elementos.`);
  }
  
  // Apresentar o resultado
  steps.push(`Passo ${stepCount++}: Matriz transposta resultante.`);
  steps.push(`Resultado: Matriz transposta (${cols}×${rows}):`);
  transposed.forEach(row => {
    steps.push(`[${row.join(', ')}]`);
  });
  
  // Adiciona um separador para verificação
  steps.push(`---VERIFICATION_SEPARATOR---`);
  
  // Verificação de propriedades
  steps.push(`Verificação: Propriedades da transposição`);
  
  steps.push(`1. (A^T)^T = A`);
  steps.push(`   A transposta da transposta de uma matriz é a própria matriz original.`);
  
  steps.push(`2. (A + B)^T = A^T + B^T`);
  steps.push(`   A transposta da soma de duas matrizes é igual à soma das transpostas.`);
  
  steps.push(`3. (c×A)^T = c×A^T`);
  steps.push(`   A transposta de uma matriz multiplicada por um escalar é igual à transposta multiplicada pelo mesmo escalar.`);
  
  steps.push(`4. (A×B)^T = B^T×A^T`);
  steps.push(`   A transposta do produto de duas matrizes é igual ao produto das transpostas na ordem inversa.`);
  
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
      steps.push(`Verificação especial: Esta matriz é simétrica (A = A^T).`);
      steps.push(`Uma matriz é simétrica quando ela é igual à sua transposta.`);
    } else {
      steps.push(`Verificação especial: Esta matriz não é simétrica (A ≠ A^T).`);
    }
  }
  
  steps.push(`Resultado final: Transposição concluída com sucesso.`);
  
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

  // Função principal de resolução
  const handleSolve = () => {
    dispatch({ type: 'RESET_CALCULATION' });
    
    try {
      // Verificar se a matriz foi fornecida
      if (!state.matrix.trim()) {
        dispatch({ type: 'SET_ERROR', message: 'Por favor, insira a matriz.' });
        return;
      }
      
      // Parse da matriz a partir da string
      const matrix = parseMatrixFromString(state.matrix);
      
      if (!matrix) {
        dispatch({ type: 'SET_ERROR', message: 'Não foi possível interpretar a matriz. Verifique o formato (valores separados por espaço, linhas separadas por ponto e vírgula).' });
        return;
      }
      
      if (!isValidMatrix(matrix)) {
        dispatch({ type: 'SET_ERROR', message: 'A matriz é inválida. Certifique-se de que todas as linhas têm o mesmo número de colunas.' });
        return;
      }
      
      // Calcular a transposta e gerar os passos
      const transposed = transposeMatrix(matrix);
      const steps = generateTransposeSteps(matrix);
      
      dispatch({
        type: 'SET_RESULT',
        result: transposed,
        steps
      });
      
    } catch (error) {
      let errorMessage = 'Erro desconhecido ao processar a matriz.';
      
      if (error instanceof Error) {
        if (error.message.includes('valores inválidos')) {
          errorMessage = 'A matriz contém valores inválidos. Use apenas números.';
        } else if (error.message.includes('mesmo número de colunas')) {
          errorMessage = 'Todas as linhas de uma matriz devem ter o mesmo número de colunas.';
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