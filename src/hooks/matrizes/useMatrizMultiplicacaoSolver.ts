import { useReducer } from 'react';
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

// Gera os passos de cálculo para multiplicação de matrizes
const generateMatrixMultiplicationSteps = (
  matrixA: number[][],
  matrixB: number[][],
): string[] => {
  const steps: string[] = [];
  let stepCount = 1;
  
  // Verifica se as dimensões são compatíveis para multiplicação
  if (!isValidForMultiplication(matrixA, matrixB)) {
    steps.push(`As dimensões das matrizes são incompatíveis para multiplicação. A matriz A tem dimensão ${matrixA.length}×${matrixA[0].length} e a matriz B tem dimensão ${matrixB.length}×${matrixB[0].length}.`);
    steps.push(`Para multiplicar matrizes, o número de colunas da primeira matriz deve ser igual ao número de linhas da segunda matriz.`);
    return steps;
  }
  
  const rowsA = matrixA.length;
  const colsA = matrixA[0].length;
  const colsB = matrixB[0].length;
  
  // Adiciona informações iniciais
  steps.push(`Passo ${stepCount++}: Identificar as matrizes e a operação.`);
  steps.push(`Forma inicial: A × B`);
  
  // Adiciona a representação das matrizes
  steps.push(`Matriz A (${rowsA}×${colsA}):`);
  matrixA.forEach(row => {
    steps.push(`[${row.join(', ')}]`);
  });
  
  steps.push(`Matriz B (${colsA}×${colsB}):`);
  matrixB.forEach(row => {
    steps.push(`[${row.join(', ')}]`);
  });
  
  // Explica a compatibilidade das dimensões
  steps.push(`Passo ${stepCount++}: Verificar a compatibilidade das dimensões.`);
  steps.push(`Verificando dimensões: A matriz A tem ${colsA} colunas e a matriz B tem ${colsA} linhas.`);
  steps.push(`Como o número de colunas de A é igual ao número de linhas de B, a multiplicação é possível.`);
  steps.push(`A matriz resultante terá dimensão ${rowsA}×${colsB}.`);
  
  // Explica o processo de multiplicação
  steps.push(`Passo ${stepCount++}: Aplicar o processo de multiplicação.`);
  steps.push(`Aplicando a fórmula: (A × B)ᵢⱼ = Σ(Aᵢₖ × Bₖⱼ) para k de 1 até ${colsA}`);
  steps.push(`Para cada elemento (i,j) da matriz resultante, calculamos o produto escalar da linha i da matriz A pela coluna j da matriz B.`);
  
  // Calcula o resultado
  const result = multiplyMatrices(matrixA, matrixB);
  
  if (!result) {
    steps.push('Erro ao calcular o resultado.');
    return steps;
  }
  
  // Mostra o cálculo detalhado para cada elemento da matriz resultante
  steps.push(`Passo ${stepCount++}: Cálculo detalhado para cada elemento da matriz resultante.`);
  
  for (let i = 0; i < rowsA; i++) {
    for (let j = 0; j < colsB; j++) {
      steps.push(`Calculando: Elemento (${i+1},${j+1}) da matriz resultante:`);
      
      let calculation = [];
      let sum = 0;
      
      for (let k = 0; k < colsA; k++) {
        const product = matrixA[i][k] * matrixB[k][j];
        calculation.push(`(${matrixA[i][k]} × ${matrixB[k][j]})`);
        sum += product;
      }
      
      steps.push(`${calculation.join(' + ')} = ${sum}`);
    }
  }
  
  // Mostra o resultado final
  steps.push(`Passo ${stepCount++}: Matriz resultado.`);
  steps.push(`Resultado: Matriz produto ${rowsA}×${colsB}`);
  result.forEach(row => {
    steps.push(`[${row.join(', ')}]`);
  });
  
  // Adiciona um separador para verificação
  steps.push(`---VERIFICATION_SEPARATOR---`);
  
  // Adiciona verificações e propriedades
  steps.push(`Verificação: Propriedades da multiplicação de matrizes`);
  steps.push(`Verificando a propriedade não-comutativa: A × B ≠ B × A (em geral)`);
  steps.push(`A multiplicação de matrizes não é comutativa. Geralmente, trocar a ordem das matrizes resulta em um produto diferente, ou até mesmo uma operação impossível devido a incompatibilidade de dimensões.`);
  
  steps.push(`Verificando propriedade associativa: (A × B) × C = A × (B × C)`);
  steps.push(`A multiplicação de matrizes é associativa. A maneira como agrupamos as multiplicações não altera o resultado final, desde que a ordem das matrizes seja mantida.`);
  
  steps.push(`Verificando propriedade distributiva: A × (B + C) = A × B + A × C`);
  steps.push(`A multiplicação de matrizes é distributiva em relação à adição. Multiplicar A por uma soma de matrizes é o mesmo que somar os produtos individuais.`);
  
  // Conclui com as propriedades e aplicações
  steps.push(`Resultado final: Multiplicação de matrizes ${rowsA}×${colsA} por ${colsA}×${colsB} concluída com sucesso.`);
  
  return steps;
};

// Gera os passos de cálculo para multiplicação por escalar
const generateScalarMultiplicationSteps = (
  matrix: number[][],
  scalar: number,
): string[] => {
  const steps: string[] = [];
  let stepCount = 1;
  
  const rows = matrix.length;
  const cols = matrix[0].length;
  
  // Adiciona informações iniciais
  steps.push(`Passo ${stepCount++}: Identificar a matriz e o escalar.`);
  steps.push(`Forma inicial: ${scalar} × A`);
  
  // Adiciona a representação da matriz
  steps.push(`Matriz A (${rows}×${cols}):`);
  matrix.forEach(row => {
    steps.push(`[${row.join(', ')}]`);
  });
  
  steps.push(`Escalar: ${scalar}`);
  
  // Explica o processo
  steps.push(`Passo ${stepCount++}: Aplicar a multiplicação por escalar.`);
  steps.push(`Aplicando a fórmula: (k × A)ᵢⱼ = k × Aᵢⱼ`);
  steps.push(`Para multiplicar uma matriz por um escalar, multiplicamos cada elemento da matriz pelo escalar.`);
  
  // Calcula o resultado
  const result = multiplyMatrixByScalar(matrix, scalar);
  
  // Mostra o cálculo detalhado para cada elemento
  steps.push(`Passo ${stepCount++}: Cálculo detalhado para cada elemento da matriz resultante.`);
  
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      steps.push(`Calculando: Elemento (${i+1},${j+1}): ${scalar} × ${matrix[i][j]} = ${result[i][j]}`);
    }
  }
  
  // Mostra o resultado final
  steps.push(`Passo ${stepCount++}: Matriz resultado.`);
  steps.push(`Resultado: Matriz escalada ${rows}×${cols}`);
  result.forEach(row => {
    steps.push(`[${row.join(', ')}]`);
  });
  
  // Adiciona um separador para verificação
  steps.push(`---VERIFICATION_SEPARATOR---`);
  
  // Adiciona verificações e propriedades
  steps.push(`Verificação: Propriedades da multiplicação por escalar`);
  
  steps.push(`Verificando a propriedade distributiva: k × (A + B) = k × A + k × B`);
  steps.push(`A multiplicação por escalar é distributiva em relação à adição de matrizes. Multiplicar um escalar por uma soma de matrizes é o mesmo que somar as multiplicações individuais.`);
  
  steps.push(`Verificando propriedade associativa: (k × m) × A = k × (m × A)`);
  steps.push(`A multiplicação por escalar é associativa em relação à multiplicação de escalares. A maneira como agrupamos os escalares não altera o resultado final.`);
  
  steps.push(`Verificando elemento neutro: 1 × A = A`);
  steps.push(`O escalar 1 é o elemento neutro da multiplicação. Multiplicar uma matriz por 1 não altera a matriz.`);
  
  // Conclui com as propriedades e aplicações
  steps.push(`Resultado final: Multiplicação por escalar concluída com sucesso.`);
  
  return steps;
};

export function useMatrizMultiplicationSolver() {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Função principal de resolução
  const handleSolve = () => {
    dispatch({ type: 'RESET_CALCULATION' });
    
    try {
      // Verificações comuns para ambos os tipos de operação
      if (!state.matrixA.trim()) {
        dispatch({ type: 'SET_ERROR', message: 'Por favor, insira a Matriz A.' });
        return;
      }
      
      // Extrair valores de matriz e validar
      const matrixA = parseMatrixFromString(state.matrixA);
      
      if (!matrixA) {
        dispatch({ type: 'SET_ERROR', message: 'Não foi possível interpretar a Matriz A. Verifique o formato (valores separados por espaço, linhas separadas por ponto e vírgula).' });
        return;
      }
      
      if (!isValidMatrix(matrixA)) {
        dispatch({ type: 'SET_ERROR', message: 'A Matriz A é inválida. Certifique-se de que todas as linhas têm o mesmo número de colunas.' });
        return;
      }
      
      // Verificações específicas para multiplicação de matrizes
      if (state.operationType === 'matrix') {
        if (!state.matrixB.trim()) {
          dispatch({ type: 'SET_ERROR', message: 'Por favor, insira a Matriz B.' });
          return;
        }
        
        const matrixB = parseMatrixFromString(state.matrixB);
        
        if (!matrixB) {
          dispatch({ type: 'SET_ERROR', message: 'Não foi possível interpretar a Matriz B. Verifique o formato (valores separados por espaço, linhas separadas por ponto e vírgula).' });
          return;
        }
        
        if (!isValidMatrix(matrixB)) {
          dispatch({ type: 'SET_ERROR', message: 'A Matriz B é inválida. Certifique-se de que todas as linhas têm o mesmo número de colunas.' });
          return;
        }
        
        // Verificar se as dimensões são compatíveis para multiplicação
        if (!isValidForMultiplication(matrixA, matrixB)) {
          const dimA = `${matrixA.length}×${matrixA[0].length}`;
          const dimB = `${matrixB.length}×${matrixB[0].length}`;
          dispatch({ 
            type: 'SET_ERROR', 
            message: `As matrizes não podem ser multiplicadas. A matriz A é ${dimA} e a matriz B é ${dimB}. Para multiplicar A×B, o número de colunas de A deve ser igual ao número de linhas de B.` 
          });
          return;
        }
        
        // Calcular o produto das matrizes
        const result = multiplyMatrices(matrixA, matrixB);
        
        if (!result) {
          dispatch({ 
            type: 'SET_ERROR', 
            message: 'Erro ao calcular o produto das matrizes.' 
          });
          return;
        }
        
        // Gerar os passos para a solução
        const steps = generateMatrixMultiplicationSteps(matrixA, matrixB);
        
        dispatch({
          type: 'SET_RESULT',
          result,
          steps
        });
      } 
      // Verificações específicas para multiplicação por escalar
      else {
        if (!state.scalar.trim()) {
          dispatch({ type: 'SET_ERROR', message: 'Por favor, insira o valor escalar.' });
          return;
        }
        
        const scalar = parseFloat(state.scalar.replace(',', '.'));
        
        if (isNaN(scalar)) {
          dispatch({ type: 'SET_ERROR', message: 'O valor escalar não é um número válido.' });
          return;
        }
        
        // Calcular o produto da matriz pelo escalar
        const result = multiplyMatrixByScalar(matrixA, scalar);
        
        // Gerar os passos para a solução
        const steps = generateScalarMultiplicationSteps(matrixA, scalar);
        
        dispatch({
          type: 'SET_RESULT',
          result,
          steps
        });
      }
      
    } catch (error) {
      let errorMessage = 'Erro desconhecido ao processar as matrizes.';
      
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