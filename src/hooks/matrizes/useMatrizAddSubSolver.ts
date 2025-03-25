import { useReducer } from 'react';
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
    steps.push('As matrizes não têm as mesmas dimensões. Não é possível realizar a operação.');
    return steps;
  }
  
  const rows = matrixA.length;
  const cols = matrixA[0].length;
  
  // Adiciona informações iniciais
  steps.push(`Passo ${stepCount++}: Identificar as matrizes e a operação.`);
  steps.push(`Forma inicial: ${operation === 'soma' ? 'A + B' : 'A - B'}`);
  
  // Adiciona a representação das matrizes
  steps.push(`Matriz A (${rows}×${cols}):`);
  matrixA.forEach(row => {
    steps.push(`[${row.join(', ')}]`);
  });
  
  steps.push(`Matriz B (${rows}×${cols}):`);
  matrixB.forEach(row => {
    steps.push(`[${row.join(', ')}]`);
  });
  
  // Explica o processo
  steps.push(`Passo ${stepCount++}: Analisar as dimensões das matrizes.`);
  steps.push(`Verificando dimensões: Ambas as matrizes são de dimensão ${rows}×${cols}.`);
  
  if (operation === 'soma') {
    steps.push(`Para somar duas matrizes, elas precisam ter as mesmas dimensões. Esta condição é satisfeita.`);
  } else {
    steps.push(`Para subtrair duas matrizes, elas precisam ter as mesmas dimensões. Esta condição é satisfeita.`);
  }
  
  steps.push(`Passo ${stepCount++}: Aplicar a operação elemento por elemento.`);
  steps.push(`Aplicando a fórmula: ${operation === 'soma' ? '(A + B)ᵢⱼ = Aᵢⱼ + Bᵢⱼ' : '(A - B)ᵢⱼ = Aᵢⱼ - Bᵢⱼ'}`);
  
  // Calcula o resultado
  const result = operation === 'soma' 
    ? addMatrices(matrixA, matrixB) 
    : subtractMatrices(matrixA, matrixB);
  
  if (!result) {
    steps.push('Erro ao calcular o resultado.');
    return steps;
  }
  
  // Mostra o cálculo detalhado para cada elemento
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (operation === 'soma') {
        steps.push(`Calculando: Elemento (${i+1},${j+1}): ${matrixA[i][j]} + ${matrixB[i][j]} = ${result[i][j]}`);
      } else {
        steps.push(`Calculando: Elemento (${i+1},${j+1}): ${matrixA[i][j]} - ${matrixB[i][j]} = ${result[i][j]}`);
      }
    }
  }
  
  // Mostra o resultado final
  steps.push(`Passo ${stepCount++}: Matriz resultado.`);
  steps.push(`Resultado: Matriz ${operation === 'soma' ? 'soma' : 'diferença'} ${rows}×${cols}`);
  result.forEach(row => {
    steps.push(`[${row.join(', ')}]`);
  });
  
  // Adiciona um separador para verificação
  steps.push(`---VERIFICATION_SEPARATOR---`);
  
  // Adiciona verificações das propriedades
  steps.push(`Verificação: Propriedades da ${operation === 'soma' ? 'adição' : 'subtração'} de matrizes`);
  
  if (operation === 'soma') {
    steps.push(`Verificando a propriedade comutativa: A + B = B + A`);
    steps.push(`Para adição de matrizes, a ordem das operações não importa. O resultado seria o mesmo se calculássemos B + A.`);
    
    // Adiciona também outras propriedades
    steps.push(`Verificando propriedade associativa: (A + B) + C = A + (B + C)`);
    steps.push(`Para adição de matrizes, a forma como agrupamos as matrizes não altera o resultado final.`);
  } else {
    steps.push(`Verificando a propriedade não-comutativa: A - B ≠ B - A (em geral)`);
    steps.push(`Para subtração de matrizes, a ordem importa. Se fizéssemos B - A, teríamos um resultado diferente.`);
    
    // Menciona relação com adição
    steps.push(`Relação com a adição: A - B = A + (-B)`);
    steps.push(`A subtração pode ser vista como a adição da matriz oposta de B.`);
  }
  
  // Conclui com as propriedades e aplicações
  steps.push(`Resultado final: ${operation === 'soma' ? 'Soma' : 'Subtração'} de matrizes ${rows}×${cols} concluída com sucesso.`);
  
  return steps;
};

export function useMatrizAddSubSolver() {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Função principal de resolução
  const handleSolve = () => {
    dispatch({ type: 'RESET_CALCULATION' });
    
    try {
      // Verificar se os valores foram fornecidos
      if (!state.matrizA.trim()) {
        dispatch({ type: 'SET_ERROR', mensagem: 'Por favor, insira a Matriz A.' });
        return;
      }
      
      if (!state.matrizB.trim()) {
        dispatch({ type: 'SET_ERROR', mensagem: 'Por favor, insira a Matriz B.' });
        return;
      }
      
      // Parse das matrizes a partir das strings
      const matrizA = parseMatrixFromString(state.matrizA);
      const matrizB = parseMatrixFromString(state.matrizB);
      
      // Validar as matrizes
      if (!matrizA) {
        dispatch({ type: 'SET_ERROR', mensagem: 'Não foi possível interpretar a Matriz A. Verifique o formato (valores separados por espaço, linhas separadas por ponto e vírgula).' });
        return;
      }
      
      if (!matrizB) {
        dispatch({ type: 'SET_ERROR', mensagem: 'Não foi possível interpretar a Matriz B. Verifique o formato (valores separados por espaço, linhas separadas por ponto e vírgula).' });
        return;
      }
      
      if (!isValidMatrix(matrizA)) {
        dispatch({ type: 'SET_ERROR', mensagem: 'A Matriz A é inválida. Certifique-se de que todas as linhas têm o mesmo número de colunas.' });
        return;
      }
      
      if (!isValidMatrix(matrizB)) {
        dispatch({ type: 'SET_ERROR', mensagem: 'A Matriz B é inválida. Certifique-se de que todas as linhas têm o mesmo número de colunas.' });
        return;
      }
      
      if (!haveSameDimensions(matrizA, matrizB)) {
        const dimA = `${matrizA.length}×${matrizA[0].length}`;
        const dimB = `${matrizB.length}×${matrizB[0].length}`;
        dispatch({ 
          type: 'SET_ERROR', 
          mensagem: `As matrizes A e B têm dimensões diferentes (A: ${dimA}, B: ${dimB}). Para realizar adição ou subtração, as matrizes precisam ter as mesmas dimensões.` 
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
          mensagem: 'Ocorreu um erro ao calcular o resultado. Verifique se as matrizes são válidas.' 
        });
        return;
      }
      
      dispatch({
        type: 'SET_RESULTADO',
        resultado,
        passos
      });
      
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