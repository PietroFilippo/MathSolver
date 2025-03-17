import { useReducer } from 'react';
import {
  squarePerimeter,
  rectanglePerimeter,
  trianglePerimeter,
  circlePerimeter,
  trapezoidPerimeter,
  rhombusPerimeter,
  hexagonPerimeter,
  getPerimeterExamples
} from '../../utils/mathUtilsGeometria';

// Definições de tipo
export type FiguraPlana = 'quadrado' | 'retangulo' | 'triangulo' | 'circulo' | 'trapezio' | 'losango' | 'hexagono';

// Interface de estado
interface PerimetrosState {
  figura: FiguraPlana;
  lado: string;
  comprimento: string;
  largura: string;
  ladoA: string;
  ladoB: string;
  ladoC: string;
  raio: string;
  ladoParalelo1: string;
  ladoParalelo2: string;
  ladoObliquo1: string;
  ladoObliquo2: string;
  result: number | null;
  steps: string[];
  errorMessage: string;
  showExplanation: boolean;
  showConceitoMatematico: boolean;
}

// Tipos de ações
type PerimetrosAction =
  | { type: 'SET_FIGURA'; value: FiguraPlana }
  | { type: 'SET_LADO'; value: string }
  | { type: 'SET_COMPRIMENTO'; value: string }
  | { type: 'SET_LARGURA'; value: string }
  | { type: 'SET_LADO_A'; value: string }
  | { type: 'SET_LADO_B'; value: string }
  | { type: 'SET_LADO_C'; value: string }
  | { type: 'SET_RAIO'; value: string }
  | { type: 'SET_LADO_PARALELO_1'; value: string }
  | { type: 'SET_LADO_PARALELO_2'; value: string }
  | { type: 'SET_LADO_OBLIQUO_1'; value: string }
  | { type: 'SET_LADO_OBLIQUO_2'; value: string }
  | { type: 'SET_RESULT'; result: number; steps: string[] }
  | { type: 'SET_ERROR'; message: string }
  | { type: 'TOGGLE_EXPLANATION' }
  | { type: 'TOGGLE_CONCEITO_MATEMATICO' }
  | { type: 'RESET' }
  | { type: 'APPLY_EXAMPLE'; values: Record<string, number> };

// Estado inicial
const initialState: PerimetrosState = {
  figura: 'quadrado',
  lado: '',
  comprimento: '',
  largura: '',
  ladoA: '',
  ladoB: '',
  ladoC: '',
  raio: '',
  ladoParalelo1: '',
  ladoParalelo2: '',
  ladoObliquo1: '',
  ladoObliquo2: '',
  result: null,
  steps: [],
  errorMessage: '',
  showExplanation: true,
  showConceitoMatematico: true
};

// Função reducer
function perimetrosReducer(state: PerimetrosState, action: PerimetrosAction): PerimetrosState {
  switch (action.type) {
    case 'SET_FIGURA':
      return { ...state, figura: action.value };
    case 'SET_LADO':
      return { ...state, lado: action.value };
    case 'SET_COMPRIMENTO':
      return { ...state, comprimento: action.value };
    case 'SET_LARGURA':
      return { ...state, largura: action.value };
    case 'SET_LADO_A':
      return { ...state, ladoA: action.value };
    case 'SET_LADO_B':
      return { ...state, ladoB: action.value };
    case 'SET_LADO_C':
      return { ...state, ladoC: action.value };
    case 'SET_RAIO':
      return { ...state, raio: action.value };
    case 'SET_LADO_PARALELO_1':
      return { ...state, ladoParalelo1: action.value };
    case 'SET_LADO_PARALELO_2':
      return { ...state, ladoParalelo2: action.value };
    case 'SET_LADO_OBLIQUO_1':
      return { ...state, ladoObliquo1: action.value };
    case 'SET_LADO_OBLIQUO_2':
      return { ...state, ladoObliquo2: action.value };
    case 'SET_RESULT':
      return {
        ...state,
        result: action.result,
        steps: action.steps,
        errorMessage: '',
        showExplanation: true
      };
    case 'SET_ERROR':
      return { ...state, errorMessage: action.message, result: null, steps: [] };
    case 'TOGGLE_EXPLANATION':
      return { ...state, showExplanation: !state.showExplanation };
    case 'TOGGLE_CONCEITO_MATEMATICO':
      return { ...state, showConceitoMatematico: !state.showConceitoMatematico };
    case 'RESET':
      return {
        ...state,
        result: null,
        steps: [],
        errorMessage: ''
      };
    case 'APPLY_EXAMPLE':
      const newState = { ...state };
      // Resetar todos os valores primeiro
      newState.lado = '';
      newState.comprimento = '';
      newState.largura = '';
      newState.ladoA = '';
      newState.ladoB = '';
      newState.ladoC = '';
      newState.raio = '';
      newState.ladoParalelo1 = '';
      newState.ladoParalelo2 = '';
      newState.ladoObliquo1 = '';
      newState.ladoObliquo2 = '';
      
      // Aplicar valores do exemplo
      for (const [key, value] of Object.entries(action.values)) {
        switch (key) {
          case 'lado':
            newState.lado = value.toString();
            break;
          case 'comprimento':
            newState.comprimento = value.toString();
            break;
          case 'largura':
            newState.largura = value.toString();
            break;
          case 'ladoA':
            newState.ladoA = value.toString();
            break;
          case 'ladoB':
            newState.ladoB = value.toString();
            break;
          case 'ladoC':
            newState.ladoC = value.toString();
            break;
          case 'raio':
            newState.raio = value.toString();
            break;
          case 'ladoParalelo1':
            newState.ladoParalelo1 = value.toString();
            break;
          case 'ladoParalelo2':
            newState.ladoParalelo2 = value.toString();
            break;
          case 'ladoObliquo1':
            newState.ladoObliquo1 = value.toString();
            break;
          case 'ladoObliquo2':
            newState.ladoObliquo2 = value.toString();
            break;
        }
      }
      return newState;
    default:
      return state;
  }
}

export function usePerimetrosSolver() {
  const [state, dispatch] = useReducer(perimetrosReducer, initialState);

  // Validação de entrada numérica
  const handleNumberInput = (value: string, setter: (value: string) => void) => {
    const numberPattern = /^-?\d*\.?\d*$/;
    if (value === '' || numberPattern.test(value)) {
      setter(value);
    }
  };

  // Definir valor do campo com validação
  const setFieldValue = (field: string, value: string) => {
    handleNumberInput(value, (validValue) => {
      switch (field) {
        case 'lado':
          dispatch({ type: 'SET_LADO', value: validValue });
          break;
        case 'comprimento':
          dispatch({ type: 'SET_COMPRIMENTO', value: validValue });
          break;
        case 'largura':
          dispatch({ type: 'SET_LARGURA', value: validValue });
          break;
        case 'ladoA':
          dispatch({ type: 'SET_LADO_A', value: validValue });
          break;
        case 'ladoB':
          dispatch({ type: 'SET_LADO_B', value: validValue });
          break;
        case 'ladoC':
          dispatch({ type: 'SET_LADO_C', value: validValue });
          break;
        case 'raio':
          dispatch({ type: 'SET_RAIO', value: validValue });
          break;
        case 'ladoParalelo1':
          dispatch({ type: 'SET_LADO_PARALELO_1', value: validValue });
          break;
        case 'ladoParalelo2':
          dispatch({ type: 'SET_LADO_PARALELO_2', value: validValue });
          break;
        case 'ladoObliquo1':
          dispatch({ type: 'SET_LADO_OBLIQUO_1', value: validValue });
          break;
        case 'ladoObliquo2':
          dispatch({ type: 'SET_LADO_OBLIQUO_2', value: validValue });
          break;
      }
    });
  };

  // Aplicar um exemplo ao estado atual
  const applyExample = (exemplo: { valores: Record<string, number> }) => {
    dispatch({ type: 'APPLY_EXAMPLE', values: exemplo.valores });
  };

  // Função principal de resolução
  const handleSolve = () => {
    dispatch({ type: 'RESET' });

    try {
      let perimetro: number;
      const calculationSteps: string[] = [];
      let stepCount = 1;

      switch (state.figura) {
        case 'quadrado': {
          if (!state.lado.trim()) {
            dispatch({ type: 'SET_ERROR', message: 'Por favor, insira o valor do lado do quadrado.' });
            return;
          }
          const l = parseFloat(state.lado);
          if (isNaN(l) || l <= 0) {
            dispatch({ type: 'SET_ERROR', message: 'O lado deve ser um número positivo.' });
            return;
          }

          perimetro = squarePerimeter(l);
          calculationSteps.push(`Passo ${stepCount++}: O perímetro do quadrado é calculado pela fórmula: P = 4l`);
          calculationSteps.push(`Passo ${stepCount++}: Substituindo o lado ${l} na fórmula:`);
          calculationSteps.push(`P = 4 × ${l}`);
          calculationSteps.push(`P = ${perimetro} unidades de comprimento`);
          break;
        }

        case 'retangulo': {
          if (!state.comprimento.trim() || !state.largura.trim()) {
            dispatch({ type: 'SET_ERROR', message: 'Por favor, insira o comprimento e a largura do retângulo.' });
            return;
          }
          const c = parseFloat(state.comprimento);
          const l = parseFloat(state.largura);
          if (isNaN(c) || isNaN(l) || c <= 0 || l <= 0) {
            dispatch({ type: 'SET_ERROR', message: 'O comprimento e a largura devem ser números positivos.' });
            return;
          }

          perimetro = rectanglePerimeter(c, l);
          calculationSteps.push(`Passo ${stepCount++}: O perímetro do retângulo é calculado pela fórmula: P = 2(c + l)`);
          calculationSteps.push(`Passo ${stepCount++}: Substituindo o comprimento ${c} e a largura ${l} na fórmula:`);
          calculationSteps.push(`P = 2(${c} + ${l})`);
          calculationSteps.push(`P = ${perimetro} unidades de comprimento`);
          break;
        }

        case 'triangulo': {
          if (!state.ladoA.trim() || !state.ladoB.trim() || !state.ladoC.trim()) {
            dispatch({ type: 'SET_ERROR', message: 'Por favor, insira os três lados do triângulo.' });
            return;
          }
          const a = parseFloat(state.ladoA);
          const b = parseFloat(state.ladoB);
          const c = parseFloat(state.ladoC);
          if (isNaN(a) || isNaN(b) || isNaN(c) || a <= 0 || b <= 0 || c <= 0) {
            dispatch({ type: 'SET_ERROR', message: 'Todos os lados devem ser números positivos.' });
            return;
          }
          // Verificar se os lados formam um triângulo válido
          if (a + b <= c || b + c <= a || a + c <= b) {
            dispatch({ type: 'SET_ERROR', message: 'Os lados fornecidos não formam um triângulo válido.' });
            return;
          }

          perimetro = trianglePerimeter(a, b, c);
          calculationSteps.push(`Passo ${stepCount++}: O perímetro do triângulo é calculado pela fórmula: P = a + b + c`);
          calculationSteps.push(`Passo ${stepCount++}: Substituindo os lados ${a}, ${b} e ${c} na fórmula:`);
          calculationSteps.push(`P = ${a} + ${b} + ${c}`);
          calculationSteps.push(`P = ${perimetro} unidades de comprimento`);
          break;
        }

        case 'circulo': {
          if (!state.raio.trim()) {
            dispatch({ type: 'SET_ERROR', message: 'Por favor, insira o raio do círculo.' });
            return;
          }
          const r = parseFloat(state.raio);
          if (isNaN(r) || r <= 0) {
            dispatch({ type: 'SET_ERROR', message: 'O raio deve ser um número positivo.' });
            return;
          }

          perimetro = circlePerimeter(r);
          calculationSteps.push(`Passo ${stepCount++}: O perímetro do círculo é calculado pela fórmula: P = 2πr`);
          calculationSteps.push(`Passo ${stepCount++}: Substituindo o raio ${r} na fórmula:`);
          calculationSteps.push(`P = 2π × ${r}`);
          calculationSteps.push(`P = ${perimetro} unidades de comprimento`);
          break;
        }

        case 'trapezio': {
          if (!state.ladoParalelo1.trim() || !state.ladoParalelo2.trim() || !state.ladoObliquo1.trim() || !state.ladoObliquo2.trim()) {
            dispatch({ type: 'SET_ERROR', message: 'Por favor, insira todos os lados do trapézio.' });
            return;
          }
          const lp1 = parseFloat(state.ladoParalelo1);
          const lp2 = parseFloat(state.ladoParalelo2);
          const lo1 = parseFloat(state.ladoObliquo1);
          const lo2 = parseFloat(state.ladoObliquo2);
          if (isNaN(lp1) || isNaN(lp2) || isNaN(lo1) || isNaN(lo2) || 
              lp1 <= 0 || lp2 <= 0 || lo1 <= 0 || lo2 <= 0) {
            dispatch({ type: 'SET_ERROR', message: 'Todos os lados devem ser números positivos.' });
            return;
          }

          perimetro = trapezoidPerimeter(lp1, lp2, lo1, lo2);
          calculationSteps.push(`Passo ${stepCount++}: O perímetro do trapézio é calculado pela fórmula: P = a + b + c + d`);
          calculationSteps.push(`Passo ${stepCount++}: Substituindo os lados ${lp1}, ${lp2}, ${lo1} e ${lo2} na fórmula:`);
          calculationSteps.push(`P = ${lp1} + ${lp2} + ${lo1} + ${lo2}`);
          calculationSteps.push(`P = ${perimetro} unidades de comprimento`);
          break;
        }

        case 'losango': {
          if (!state.lado.trim()) {
            dispatch({ type: 'SET_ERROR', message: 'Por favor, insira o lado do losango.' });
            return;
          }
          const l = parseFloat(state.lado);
          if (isNaN(l) || l <= 0) {
            dispatch({ type: 'SET_ERROR', message: 'O lado deve ser um número positivo.' });
            return;
          }

          perimetro = rhombusPerimeter(l);
          calculationSteps.push(`Passo ${stepCount++}: O perímetro do losango é calculado pela fórmula: P = 4l`);
          calculationSteps.push(`Passo ${stepCount++}: Substituindo o lado ${l} na fórmula:`);
          calculationSteps.push(`P = 4 × ${l}`);
          calculationSteps.push(`P = ${perimetro} unidades de comprimento`);
          break;
        }

        case 'hexagono': {
          if (!state.lado.trim()) {
            dispatch({ type: 'SET_ERROR', message: 'Por favor, insira o lado do hexágono regular.' });
            return;
          }
          const l = parseFloat(state.lado);
          if (isNaN(l) || l <= 0) {
            dispatch({ type: 'SET_ERROR', message: 'O lado deve ser um número positivo.' });
            return;
          }

          perimetro = hexagonPerimeter(l);
          calculationSteps.push(`Passo ${stepCount++}: O perímetro do hexágono regular é calculado pela fórmula: P = 6l`);
          calculationSteps.push(`Passo ${stepCount++}: Substituindo o lado ${l} na fórmula:`);
          calculationSteps.push(`P = 6 × ${l}`);
          calculationSteps.push(`P = ${perimetro} unidades de comprimento`);
          break;
        }
      }

      dispatch({ type: 'SET_RESULT', result: perimetro!, steps: calculationSteps });

    } catch (error) {
      dispatch({ type: 'SET_ERROR', message: 'Ocorreu um erro ao calcular o perímetro.' });
    }
  };

  // Retornar o estado e as funções
  return {
    state,
    dispatch,
    setFieldValue,
    handleSolve,
    applyExample,
    getFilteredExamples: () => getPerimeterExamples(state.figura)
  };
} 