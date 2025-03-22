import { useReducer } from 'react';
import {
  squareArea,
  rectangleArea,
  triangleArea,
  circleArea,
  trapezoidArea,
  rhombusArea,
  hexagonArea,
  getAreaExamples
} from '../../utils/mathUtilsGeometria';

// Definições de tipo
export type FiguraPlana = 'quadrado' | 'retangulo' | 'triangulo' | 'circulo' | 'trapezio' | 'losango' | 'hexagono';

// Interface de estado
interface AreaFigurasState {
  figura: FiguraPlana;
  lado: string;
  comprimento: string;
  largura: string;
  base: string;
  baseMaior: string;
  baseMenor: string;
  altura: string;
  raio: string;
  diagonalMaior: string;
  diagonalMenor: string;
  result: number | null;
  steps: string[];
  errorMessage: string;
  showExplanation: boolean;
  showConceitoMatematico: boolean;
}

// Tipos de ações
type AreaFigurasAction =
  | { type: 'SET_FIGURA'; value: FiguraPlana }
  | { type: 'SET_LADO'; value: string }
  | { type: 'SET_COMPRIMENTO'; value: string }
  | { type: 'SET_LARGURA'; value: string }
  | { type: 'SET_BASE'; value: string }
  | { type: 'SET_BASE_MAIOR'; value: string }
  | { type: 'SET_BASE_MENOR'; value: string }
  | { type: 'SET_ALTURA'; value: string }
  | { type: 'SET_RAIO'; value: string }
  | { type: 'SET_DIAGONAL_MAIOR'; value: string }
  | { type: 'SET_DIAGONAL_MENOR'; value: string }
  | { type: 'SET_RESULT'; result: number; steps: string[] }
  | { type: 'SET_ERROR'; message: string }
  | { type: 'TOGGLE_EXPLANATION' }
  | { type: 'TOGGLE_CONCEITO_MATEMATICO' }
  | { type: 'RESET' }
  | { type: 'APPLY_EXAMPLE'; values: Record<string, number> };

// Estado inicial
const initialState: AreaFigurasState = {
  figura: 'quadrado',
  lado: '',
  comprimento: '',
  largura: '',
  base: '',
  baseMaior: '',
  baseMenor: '',
  altura: '',
  raio: '',
  diagonalMaior: '',
  diagonalMenor: '',
  result: null,
  steps: [],
  errorMessage: '',
  showExplanation: true,
  showConceitoMatematico: true
};

// Função reducer
function areaFigurasReducer(state: AreaFigurasState, action: AreaFigurasAction): AreaFigurasState {
  switch (action.type) {
    case 'SET_FIGURA':
      return { ...state, figura: action.value };
    case 'SET_LADO':
      return { ...state, lado: action.value };
    case 'SET_COMPRIMENTO':
      return { ...state, comprimento: action.value };
    case 'SET_LARGURA':
      return { ...state, largura: action.value };
    case 'SET_BASE':
      return { ...state, base: action.value };
    case 'SET_BASE_MAIOR':
      return { ...state, baseMaior: action.value };
    case 'SET_BASE_MENOR':
      return { ...state, baseMenor: action.value };
    case 'SET_ALTURA':
      return { ...state, altura: action.value };
    case 'SET_RAIO':
      return { ...state, raio: action.value };
    case 'SET_DIAGONAL_MAIOR':
      return { ...state, diagonalMaior: action.value };
    case 'SET_DIAGONAL_MENOR':
      return { ...state, diagonalMenor: action.value };
    case 'SET_RESULT':
      return {
        ...state,
        result: action.result,
        steps: action.steps,
        errorMessage: '',
        showExplanation: true
      };
    case 'SET_ERROR':
      return { ...state, errorMessage: action.message, result: null };
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
      // Reset all values first
      newState.lado = '';
      newState.comprimento = '';
      newState.largura = '';
      newState.base = '';
      newState.baseMaior = '';
      newState.baseMenor = '';
      newState.altura = '';
      newState.raio = '';
      newState.diagonalMaior = '';
      newState.diagonalMenor = '';
      
      // Apply example values
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
          case 'base':
            newState.base = value.toString();
            break;
          case 'baseMaior':
            newState.baseMaior = value.toString();
            break;
          case 'baseMenor':
            newState.baseMenor = value.toString();
            break;
          case 'altura':
            newState.altura = value.toString();
            break;
          case 'raio':
            newState.raio = value.toString();
            break;
          case 'diagonalMaior':
            newState.diagonalMaior = value.toString();
            break;
          case 'diagonalMenor':
            newState.diagonalMenor = value.toString();
            break;
        }
      }
      return newState;
    default:
      return state;
  }
}

export function useAreaFigurasPlanasSolver() {
  const [state, dispatch] = useReducer(areaFigurasReducer, initialState);

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
        case 'base':
          dispatch({ type: 'SET_BASE', value: validValue });
          break;
        case 'baseMaior':
          dispatch({ type: 'SET_BASE_MAIOR', value: validValue });
          break;
        case 'baseMenor':
          dispatch({ type: 'SET_BASE_MENOR', value: validValue });
          break;
        case 'altura':
          dispatch({ type: 'SET_ALTURA', value: validValue });
          break;
        case 'raio':
          dispatch({ type: 'SET_RAIO', value: validValue });
          break;
        case 'diagonalMaior':
          dispatch({ type: 'SET_DIAGONAL_MAIOR', value: validValue });
          break;
        case 'diagonalMenor':
          dispatch({ type: 'SET_DIAGONAL_MENOR', value: validValue });
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
      let area: number;
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
          
          area = squareArea(l);
          calculationSteps.push(`Passo ${stepCount++}: A área do quadrado é calculada pela fórmula: A = l²`);
          calculationSteps.push(`Passo ${stepCount++}: Substituindo o lado ${l} na fórmula:`);
          calculationSteps.push(`A = ${l} × ${l}`);
          calculationSteps.push(`A = ${area} unidades quadradas`);
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

          area = rectangleArea(c, l);
          calculationSteps.push(`Passo ${stepCount++}: A área do retângulo é calculada pela fórmula: A = c × l`);
          calculationSteps.push(`Passo ${stepCount++}: Substituindo o comprimento ${c} e a largura ${l} na fórmula:`);
          calculationSteps.push(`A = ${c} × ${l}`);
          calculationSteps.push(`A = ${area} unidades quadradas`);
          break;
        }

        case 'triangulo': {
          if (!state.base.trim() || !state.altura.trim()) {
            dispatch({ type: 'SET_ERROR', message: 'Por favor, insira a base e a altura do triângulo.' });
            return;
          }
          const b = parseFloat(state.base);
          const h = parseFloat(state.altura);
          if (isNaN(b) || isNaN(h) || b <= 0 || h <= 0) {
            dispatch({ type: 'SET_ERROR', message: 'A base e a altura devem ser números positivos.' });
            return;
          }

          area = triangleArea(b, h);
          calculationSteps.push(`Passo ${stepCount++}: A área do triângulo é calculada pela fórmula: A = (b × h) ÷ 2`);
          calculationSteps.push(`Passo ${stepCount++}: Substituindo a base ${b} e a altura ${h} na fórmula:`);
          calculationSteps.push(`A = (${b} × ${h}) ÷ 2`);
          calculationSteps.push(`A = ${area} unidades quadradas`);
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

          area = circleArea(r);
          calculationSteps.push(`Passo ${stepCount++}: A área do círculo é calculada pela fórmula: A = πr²`);
          calculationSteps.push(`Passo ${stepCount++}: Substituindo o raio ${r} na fórmula:`);
          calculationSteps.push(`A = π × ${r}²`);
          calculationSteps.push(`A = ${area} unidades quadradas`);
          break;
        }

        case 'trapezio': {
          if (!state.baseMaior.trim() || !state.baseMenor.trim() || !state.altura.trim()) {
            dispatch({ type: 'SET_ERROR', message: 'Por favor, insira as bases (maior e menor) e a altura do trapézio.' });
            return;
          }
          const B = parseFloat(state.baseMaior);
          const b = parseFloat(state.baseMenor);
          const h = parseFloat(state.altura);
          if (isNaN(B) || isNaN(b) || isNaN(h) || B <= 0 || b <= 0 || h <= 0) {
            dispatch({ type: 'SET_ERROR', message: 'As bases e a altura devem ser números positivos.' });
            return;
          }
          if (B <= b) {
            dispatch({ type: 'SET_ERROR', message: 'A base maior deve ser maior que a base menor.' });
            return;
          }

          area = trapezoidArea(B, b, h);
          calculationSteps.push(`Passo ${stepCount++}: A área do trapézio é calculada pela fórmula: A = [(B + b) × h] ÷ 2`);
          calculationSteps.push(`Passo ${stepCount++}: Substituindo a base maior ${B}, base menor ${b} e altura ${h} na fórmula:`);
          calculationSteps.push(`A = [(${B} + ${b}) × ${h}] ÷ 2`);
          calculationSteps.push(`A = ${area} unidades quadradas`);
          break;
        }

        case 'losango': {
          if (!state.diagonalMaior.trim() || !state.diagonalMenor.trim()) {
            dispatch({ type: 'SET_ERROR', message: 'Por favor, insira as diagonais do losango.' });
            return;
          }
          const D = parseFloat(state.diagonalMaior);
          const d = parseFloat(state.diagonalMenor);
          if (isNaN(D) || isNaN(d) || D <= 0 || d <= 0) {
            dispatch({ type: 'SET_ERROR', message: 'As diagonais devem ser números positivos.' });
            return;
          }
          if (D <= d) {
            dispatch({ type: 'SET_ERROR', message: 'A diagonal maior deve ser maior que a diagonal menor.' });
            return;
          }

          area = rhombusArea(D, d);
          calculationSteps.push(`Passo ${stepCount++}: A área do losango é calculada pela fórmula: A = (D × d) ÷ 2`);
          calculationSteps.push(`Passo ${stepCount++}: Substituindo a diagonal maior ${D} e diagonal menor ${d} na fórmula:`);
          calculationSteps.push(`A = (${D} × ${d}) ÷ 2`);
          calculationSteps.push(`A = ${area} unidades quadradas`);
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

          area = hexagonArea(l);
          calculationSteps.push(`Passo ${stepCount++}: A área do hexágono regular é calculada pela fórmula: A = (3 × √3 × l²) ÷ 2`);
          calculationSteps.push(`Passo ${stepCount++}: Substituindo o lado ${l} na fórmula:`);
          calculationSteps.push(`A = (3 × √3 × ${l}²) ÷ 2`);
          calculationSteps.push(`A = ${area} unidades quadradas`);
          break;
        }
      }

      dispatch({ type: 'SET_RESULT', result: area!, steps: calculationSteps });

    } catch (error) {
      dispatch({ type: 'SET_ERROR', message: 'Ocorreu um erro ao calcular a área.' });
    }
  };

  // Retornar o estado e as funções
  return {
    state,
    dispatch,
    setFieldValue,
    handleSolve,
    applyExample,
    getFilteredExamples: () => getAreaExamples(state.figura)
  };
} 