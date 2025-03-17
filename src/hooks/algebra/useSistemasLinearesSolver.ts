import { useReducer } from 'react';
import { approximatelyEqual, roundToDecimals } from '../../utils/mathUtils';
import { linearSystem } from '../../utils/mathUtilsAlgebra';

// Definições de tipo
type SystemType = 'unique' | 'infinite' | 'noSolution' | null;

// Interface de estado
type State = {
  a1: string;
  b1: string;
  c1: string;
  a2: string;
  b2: string;
  c2: string;
  solution: { x: number; y: number } | null;
  systemType: SystemType;
  steps: string[];
  errorMessage: string | null;
  showExplanation: boolean;
  showConceitoMatematico: boolean;
};

// Tipos de ações
type Action =
  | { type: 'SET_COEFFICIENT'; field: 'a1' | 'b1' | 'c1' | 'a2' | 'b2' | 'c2'; value: string }
  | { type: 'RESET_CALCULATION' }
  | { type: 'SET_SOLUTION'; solution: { x: number; y: number } | null; systemType: SystemType; steps: string[] }
  | { type: 'SET_ERROR'; message: string }
  | { type: 'TOGGLE_EXPLANATION' }
  | { type: 'TOGGLE_CONCEITO_MATEMATICO' }
  | { type: 'APPLY_EXAMPLE'; example: { a1: number | string, b1: number | string, c1: number | string, a2: number | string, b2: number | string, c2: number | string } };

// Estado inicial
const initialState: State = {
  a1: '',
  b1: '',
  c1: '',
  a2: '',
  b2: '',
  c2: '',
  solution: null,
  systemType: null,
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
        systemType: null,
        steps: [],
        errorMessage: null,
        showExplanation: false
      };
    case 'SET_SOLUTION':
      return {
        ...state,
        solution: action.solution,
        systemType: action.systemType,
        steps: action.steps,
        errorMessage: null,
        showExplanation: true
      };
    case 'SET_ERROR':
      return {
        ...state,
        errorMessage: action.message,
        solution: null,
        systemType: null,
        steps: []
      };
    case 'TOGGLE_EXPLANATION':
      return { ...state, showExplanation: !state.showExplanation };
    case 'TOGGLE_CONCEITO_MATEMATICO':
      return { ...state, showConceitoMatematico: !state.showConceitoMatematico };
    case 'APPLY_EXAMPLE':
      return {
        ...state,
        a1: String(action.example.a1),
        b1: String(action.example.b1),
        c1: String(action.example.c1),
        a2: String(action.example.a2),
        b2: String(action.example.b2),
        c2: String(action.example.c2),
      };
    default:
      return state;
  }
}

// Gerar passos para resolução do sistema linear
function generateLinearSystemSteps(
  numA1: number,
  numB1: number,
  numC1: number,
  numA2: number,
  numB2: number,
  numC2: number,
  result: { x: number; y: number } | null
): { steps: string[]; systemType: SystemType } {
  const calculationSteps: string[] = [];
  let stepCount = 1;
  let systemType: SystemType = null;

  // Sistema original
  calculationSteps.push(`Equação original: Sistema de equações lineares`);
  calculationSteps.push(`Equação 1: ${numA1}x + ${numB1}y = ${numC1}`);
  calculationSteps.push(`Equação 2: ${numA2}x + ${numB2}y = ${numC2}`);

  // Calcular determinantes
  const determinant = numA1 * numB2 - numA2 * numB1;
  const determinantX = numC1 * numB2 - numC2 * numB1;
  const determinantY = numA1 * numC2 - numA2 * numC1;

  calculationSteps.push(`Passo ${stepCount++}: Resolvendo o sistema pelo método de Cramer (determinantes).`);
  calculationSteps.push(`Aplicando a fórmula do determinante principal:`);
  calculationSteps.push(`Determinante principal D = 
    | ${numA1} ${numB1} |
    | ${numA2} ${numB2} |`);
  calculationSteps.push(`Simplificando: D = (${numA1} × ${numB2}) - (${numA2} × ${numB1})`);
  calculationSteps.push(`Calculando: D = ${numA1 * numB2} - ${numA2 * numB1} = ${determinant}`);

  // Verificamos se o determinante é aproximadamente zero
  if (approximatelyEqual(determinant, 0, 1e-10)) {
    calculationSteps.push(`Analisando o resultado: Como o determinante principal é zero, o sistema não tem solução única.`);

    // Verificar solução infinita ou sem solução
    calculationSteps.push(`Passo ${stepCount++}: Verificando se o sistema tem infinitas soluções ou nenhuma solução.`);
    calculationSteps.push(`Determinante de x (Dx) = 
      | ${numC1} ${numB1} |
      | ${numC2} ${numB2} |`);
    calculationSteps.push(`Simplificando: Dx = (${numC1} × ${numB2}) - (${numC2} × ${numB1}) = ${determinantX}`);
    
    calculationSteps.push(`Determinante de y (Dy) = 
      | ${numA1} ${numC1} |
      | ${numA2} ${numC2} |`);
    calculationSteps.push(`Simplificando: Dy = (${numA1} × ${numC2}) - (${numA2} × ${numC1}) = ${determinantY}`);

    if (approximatelyEqual(determinantX, 0, 1e-10) && approximatelyEqual(determinantY, 0, 1e-10)) {
      systemType = 'infinite';
      calculationSteps.push(`Analisando os resultados: Como os determinantes Dx e Dy também são zero, o sistema tem infinitas soluções.`);
      calculationSteps.push(`Interpretação geométrica: As equações são linearmente dependentes, representando a mesma reta.`);
      
      // Tentativa de expressar a relação entre x e y
      if (numA1 !== 0) {
        const ratio = numB1 / numA1;
        calculationSteps.push(`Solução final: Podemos expressar y em termos de x como: y = ${-ratio}x + ${numC1 / numA1}`);
      } else if (numB1 !== 0) {
        calculationSteps.push(`Solução final: Podemos expressar x em termos de y como: x = ${(numC1 - numB1 * 1) / numA1}`);
      }
    } else {
      systemType = 'noSolution';
      calculationSteps.push(`Analisando os resultados: Como pelo menos um dos determinantes Dx ou Dy não é zero, o sistema não tem solução.`);
      calculationSteps.push(`Interpretação geométrica: As equações são contraditórias, representando retas paralelas.`);
      calculationSteps.push(`Solução final: O sistema não possui solução.`);
    }
  } else {
    systemType = 'unique';
    calculationSteps.push(`Passo ${stepCount++}: Calculando os determinantes para x e y.`);
    calculationSteps.push(`Aplicando a fórmula do determinante para x (Dx):`);
    calculationSteps.push(`Determinante de x (Dx) = 
      | ${numC1} ${numB1} |
      | ${numC2} ${numB2} |`);
    calculationSteps.push(`Simplificando: Dx = (${numC1} × ${numB2}) - (${numC2} × ${numB1})`);
    calculationSteps.push(`Calculando: Dx = ${numC1 * numB2} - ${numC2 * numB1} = ${determinantX}`);
      
    calculationSteps.push(`Aplicando a fórmula do determinante para y (Dy):`);
    calculationSteps.push(`Determinante de y (Dy) = 
      | ${numA1} ${numC1} |
      | ${numA2} ${numC2} |`);
    calculationSteps.push(`Simplificando: Dy = (${numA1} × ${numC2}) - (${numA2} × ${numC1})`);
    calculationSteps.push(`Calculando: Dy = ${numA1 * numC2} - ${numA2 * numC1} = ${determinantY}`);

    // Calcular x e y
    if (result) {
      calculationSteps.push(`Passo ${stepCount++}: Isolando as variáveis x e y pela regra de Cramer.`);
      calculationSteps.push(`Aplicando a fórmula: x = Dx / D`);
      calculationSteps.push(`Substituindo os valores: x = ${determinantX} / ${determinant}`);
      calculationSteps.push(`Simplificando a divisão: x = ${roundToDecimals(result.x, 4)}`);
      
      calculationSteps.push(`Aplicando a fórmula: y = Dy / D`);
      calculationSteps.push(`Substituindo os valores: y = ${determinantY} / ${determinant}`);
      calculationSteps.push(`Simplificando a divisão: y = ${roundToDecimals(result.y, 4)}`);

      calculationSteps.push(`Solução final: x = ${roundToDecimals(result.x, 4)}, y = ${roundToDecimals(result.y, 4)}`);

      // Adicionar separador visual para verificação
      calculationSteps.push(`---VERIFICATION_SEPARATOR---`);

      // Verificação da solução
      calculationSteps.push(`Verificação: Substituindo os valores na primeira equação.`);
      calculationSteps.push(`${numA1}x + ${numB1}y = ${numC1}`);
      calculationSteps.push(`${numA1} × ${roundToDecimals(result.x, 4)} + ${numB1} × ${roundToDecimals(result.y, 4)} = ?`);
      const leftSide1 = numA1 * result.x + numB1 * result.y;
      calculationSteps.push(`${roundToDecimals(numA1 * result.x, 4)} + ${roundToDecimals(numB1 * result.y, 4)} = ${roundToDecimals(leftSide1, 4)}`);
      
      if (approximatelyEqual(leftSide1, numC1, 0.0001)) {
        calculationSteps.push(`${roundToDecimals(leftSide1, 4)} = ${numC1} (Correto!)`);
      } else {
        calculationSteps.push(`${roundToDecimals(leftSide1, 4)} ≈ ${numC1} (Aproximado devido a arredondamentos)`);
      }
      
      calculationSteps.push(`Verificação: Substituindo os valores na segunda equação.`);
      calculationSteps.push(`${numA2}x + ${numB2}y = ${numC2}`);
      calculationSteps.push(`${numA2} × ${roundToDecimals(result.x, 4)} + ${numB2} × ${roundToDecimals(result.y, 4)} = ?`);
      const leftSide2 = numA2 * result.x + numB2 * result.y;
      calculationSteps.push(`${roundToDecimals(numA2 * result.x, 4)} + ${roundToDecimals(numB2 * result.y, 4)} = ${roundToDecimals(leftSide2, 4)}`);
      
      if (approximatelyEqual(leftSide2, numC2, 0.0001)) {
        calculationSteps.push(`${roundToDecimals(leftSide2, 4)} = ${numC2} (Correto!)`);
      } else {
        calculationSteps.push(`${roundToDecimals(leftSide2, 4)} ≈ ${numC2} (Aproximado devido a arredondamentos)`);
      }
    }
  }

  return { steps: calculationSteps, systemType };
}

export function useLinearSystemSolver() {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Função principal de resolução
  const handleSolve = () => {
    dispatch({ type: 'RESET_CALCULATION' });
    
    try {
      // Verificar se os valores foram fornecidos
      if (!state.a1.trim() || !state.b1.trim() || !state.c1.trim() || 
          !state.a2.trim() || !state.b2.trim() || !state.c2.trim()) {
        dispatch({ type: 'SET_ERROR', message: 'Por favor, preencha todos os campos.' });
        return;
      }
      
      // Converter para números
      const numA1 = parseFloat(state.a1.replace(',', '.'));
      const numB1 = parseFloat(state.b1.replace(',', '.'));
      const numC1 = parseFloat(state.c1.replace(',', '.'));
      const numA2 = parseFloat(state.a2.replace(',', '.'));
      const numB2 = parseFloat(state.b2.replace(',', '.'));
      const numC2 = parseFloat(state.c2.replace(',', '.'));
      
      // Validar os valores
      if (isNaN(numA1) || isNaN(numB1) || isNaN(numC1) || 
          isNaN(numA2) || isNaN(numB2) || isNaN(numC2)) {
        dispatch({ type: 'SET_ERROR', message: 'Por favor, insira valores numéricos válidos.' });
        return;
      }
      
      // Resolver o sistema linear
      const solution = linearSystem(numA1, numB1, numC1, numA2, numB2, numC2);
      
      // Gerar os passos da solução
      const { steps, systemType } = generateLinearSystemSteps(
        numA1, numB1, numC1, numA2, numB2, numC2, solution
      );
      
      dispatch({
        type: 'SET_SOLUTION',
        solution,
        systemType,
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
  const applyExample = (example: {
    a1: number | string; b1: number | string; c1: number | string;
    a2: number | string; b2: number | string; c2: number | string;
  }) => {
    dispatch({ type: 'APPLY_EXAMPLE', example });
  };

  // Retornar o estado e as funções
  return {
    state,
    dispatch,
    handleSolve,
    applyExample,
  };
} 