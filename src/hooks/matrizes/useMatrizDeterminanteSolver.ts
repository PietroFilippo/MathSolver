import { useReducer } from 'react';
import { 
  parseMatrixFromString, 
  calculateDeterminant,
  isValidMatrix,
  isSquareMatrix,
  matrixToInputString,
  getSubmatrix,
  DeterminantExample
} from '../../utils/mathUtilsMatrizes';

// Gera os passos detalhados do cálculo do determinante
const generateDeterminantSteps = (matrix: number[][]): string[] => {
  const steps: string[] = [];
  let stepCount = 1;
  
  // Verifica se a matriz é quadrada
  if (!isSquareMatrix(matrix)) {
    steps.push(`A matriz não é quadrada. Não é possível calcular o determinante.`);
    return steps;
  }
  
  const n = matrix.length;
  
  // Agora "Matriz de entrada" como passo 1
  steps.push(`Passo ${stepCount++}: Identificar a matriz de entrada.`);
  steps.push(`Matriz de entrada (${n}×${n}):`);
  matrix.forEach(row => {
    steps.push(`[${row.join(', ')}]`);
  });
  
  // Caso especial: matriz 1x1
  if (n === 1) {
    steps.push(`Passo ${stepCount++}: Para uma matriz 1×1, o determinante é o próprio elemento.`);
    steps.push(`Aplicando a fórmula: det(A) = a₁₁`);
    steps.push(`Calculando: Determinante = ${matrix[0][0]}`);
    // Mudando o formato para garantir a estilização verde
    steps.push(`Resultado final: O determinante da matriz é ${matrix[0][0]}`);
    return steps;
  }
  
  // Caso especial: matriz 2x2
  if (n === 2) {
    steps.push(`Passo ${stepCount++}: Para uma matriz 2×2, use a fórmula para o determinante.`);
    steps.push(`Aplicando a fórmula: det(A) = a₁₁·a₂₂ - a₁₂·a₂₁`);
    steps.push(`Calculando: (${matrix[0][0]} × ${matrix[1][1]}) - (${matrix[0][1]} × ${matrix[1][0]}) = ${matrix[0][0] * matrix[1][1]} - ${matrix[0][1] * matrix[1][0]}`);
    const det2x2 = calculateDeterminant(matrix)!;
    // Mudando o formato para garantir a estilização verde
    steps.push(`Resultado final: O determinante da matriz é ${det2x2}`);
    
    // Adiciona um separador para verificação
    steps.push(`---VERIFICATION_SEPARATOR---`);
    
    steps.push(`Verificação: Propriedades do determinante`);
    steps.push(`O determinante de uma matriz 2×2 representa a área do paralelogramo formado pelos vetores das linhas ou colunas da matriz.`);
    if (det2x2 === 0) {
      steps.push(`Como o determinante é zero, a matriz é singular (não inversível) e os vetores das linhas/colunas são linearmente dependentes.`);
    } else {
      steps.push(`Como o determinante é diferente de zero, a matriz é não-singular (inversível) e os vetores das linhas/colunas são linearmente independentes.`);
    }
    
    return steps;
  }
  
  // Para matrizes maiores, utilizamos o método de expansão por cofatores (Laplace)
  steps.push(`Passo ${stepCount++}: Para uma matriz ${n}×${n}, usamos o método de expansão por cofatores (Laplace).`);
  steps.push(`Aplicando a fórmula: Expansão por cofatores pela primeira linha da matriz.`);
  
  let expandedForm = '';
  let signTerms = [];
  
  for (let j = 0; j < n; j++) {
    const sign = Math.pow(-1, j);
    const signStr = sign > 0 ? '+' : '-';
    const element = matrix[0][j];
    const absElement = Math.abs(element);
    
    if (j === 0) {
      expandedForm += `${element} × M₀${j}`;
    } else {
      expandedForm += ` ${signStr} ${absElement} × M₀${j}`;
    }
    
    signTerms.push({sign, element, col: j});
  }
  
  steps.push(`Calculando: Determinante = ${expandedForm}`);
  steps.push(`Onde M₀ⱼ é o menor complementar do elemento (0,j), multiplicado pelo sinal correspondente.`);
  
  // Calcular os cofatores para cada elemento da primeira linha
  let resultSum = 0;
  
  for (let j = 0; j < n; j++) {
    const {sign, element, col} = signTerms[j];
    steps.push(`Passo ${stepCount++}: Calculando o cofator para o elemento (0,${col}).`);
    
    const submatrix = getSubmatrix(matrix, 0, col);
    steps.push(`Matriz submatriz (${n-1}×${n-1}) após remover a linha 0 e a coluna ${col}:`);
    submatrix.forEach(row => {
      steps.push(`[${row.join(', ')}]`);
    });
    
    const minorDet = calculateDeterminant(submatrix)!;
    const cofactor = sign * minorDet;
    const term = element * cofactor;
    resultSum += term;
    
    if (n === 3) { // Para matriz 3x3, mostramos o cálculo completo do menor
      if (submatrix.length === 2) {
        steps.push(`Calculando: Determinante da submatriz = (${submatrix[0][0]} × ${submatrix[1][1]}) - (${submatrix[0][1]} × ${submatrix[1][0]})`);
        steps.push(`Calculando: ${submatrix[0][0] * submatrix[1][1]} - ${submatrix[0][1] * submatrix[1][0]} = ${minorDet}`);
      }
    } else {
      steps.push(`Calculando: Determinante da submatriz = ${minorDet}`);
    }
    
    steps.push(`Calculando: Cofator C₀${col} = ${sign > 0 ? '+' : '-'}1 × ${minorDet} = ${cofactor}`);
    steps.push(`Calculando: Termo na expansão = ${element} × ${cofactor} = ${term}`);
  }
  
  steps.push(`Passo ${stepCount++}: Somando todos os termos da expansão.`);
  steps.push(`Calculando: Soma de todos os termos = ${resultSum}`);
  // Mudando o formato para garantir a estilização verde
  steps.push(`Resultado final: O determinante da matriz é ${resultSum}`);
  
  // Adiciona um separador para verificação
  steps.push(`---VERIFICATION_SEPARATOR---`);
  
  steps.push(`Verificação: Propriedades do determinante`);
  if (resultSum === 0) {
    steps.push(`Como o determinante é zero, a matriz é singular (não inversível) e tem linhas/colunas linearmente dependentes.`);
    steps.push(`Isso significa que o sistema linear correspondente pode ter infinitas soluções ou nenhuma solução.`);
  } else {
    steps.push(`Como o determinante é diferente de zero, a matriz é não-singular (inversível) e tem linhas/colunas linearmente independentes.`);
    steps.push(`Isso significa que o sistema linear correspondente tem uma única solução.`);
  }
  
  // Adicionar informações sobre o determinante e seu significado
  if (n === 3) {
    steps.push(`Para uma matriz 3×3, o determinante representa o volume do paralelepípedo formado pelos vetores das linhas ou colunas.`);
  } else {
    steps.push(`Para uma matriz de ordem superior, o determinante tem interpretações geométricas e algébricas importantes na álgebra linear.`);
  }
  
  return steps;
};

// Interface de estado
type State = {
  matrix: string;
  result: number | null;
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
  | { type: 'SET_RESULT'; result: number | null; steps: string[] }
  | { type: 'SET_ERROR'; message: string }
  | { type: 'TOGGLE_EXPLANATION' }
  | { type: 'TOGGLE_CONCEITO_MATEMATICO' }
  | { type: 'APPLY_EXAMPLE'; example: DeterminantExample };

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

export function useMatrizDeterminantSolver() {
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
      
      // Verificar se a matriz é quadrada
      if (!isSquareMatrix(matrix)) {
        dispatch({ type: 'SET_ERROR', message: 'A matriz não é quadrada. Para calcular o determinante, a matriz deve ter o mesmo número de linhas e colunas.' });
        return;
      }
      
      // Verificar tamanho máximo para evitar cálculos muito complexos
      if (matrix.length > 5) {
        dispatch({ type: 'SET_ERROR', message: 'Por razões de desempenho, o cálculo de determinantes está limitado a matrizes de no máximo 5×5.' });
        return;
      }
      
      // Calcular o determinante e gerar os passos
      const determinant = calculateDeterminant(matrix);
      
      if (determinant === null) {
        dispatch({ type: 'SET_ERROR', message: 'Erro ao calcular o determinante. Verifique se a matriz é válida.' });
        return;
      }
      
      const steps = generateDeterminantSteps(matrix);
      
      dispatch({
        type: 'SET_RESULT',
        result: determinant,
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

  // Aplicar exemplo de cálculo de determinante
  const applyExample = (example: DeterminantExample) => {
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