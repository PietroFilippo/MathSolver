import { useReducer } from 'react';
import {
  Vector3D,
  addVectors,
  subtractVectors,
  scalarMultiply,
  dotProduct,
  crossProduct,
  vectorMagnitude,
  normalizeVector,
  angleBetweenVectors,
  getVetorGeometriaExamples
} from '../../utils/mathUtilsGeometria/mathUtilsGeometria';

// Definições de tipo
export type ProblemaVetorGeometria = 
  'somaVetores' | 
  'subtracaoVetores' | 
  'multiplicacaoEscalar' | 
  'produtoEscalar' | 
  'produtoVetorial' |
  'magnitudeVetor' |
  'normalizacaoVetor' |
  'anguloEntreVetores';

export interface Vetor {
  x: number;
  y: number;
  z: number;
}

// Interface de estado
export interface VetorGeometriaState {
  problema: ProblemaVetorGeometria;
  vetores: {
    v1: Vetor;
    v2: Vetor;
  };
  escalar: number;
  result: Vector3D | number | null;
  steps: string[];
  errorMessage: string | null;
  showExplanation: boolean;
  showConceitoMatematico: boolean;
  // Adicionando um objeto para rastrear quais vetores foram preenchidos manualmente
  vetoresPreenchidos: {
    v1: boolean;
    v2: boolean;
  };
}

// Tipos de ações
type VetorGeometriaAction =
  | { type: 'SET_PROBLEMA'; value: ProblemaVetorGeometria }
  | { type: 'SET_VETOR'; vetor: 'v1' | 'v2'; coordenada: 'x' | 'y' | 'z'; value: string }
  | { type: 'SET_ESCALAR'; value: string }
  | { type: 'SET_RESULT_VECTOR'; result: Vector3D; steps: string[] }
  | { type: 'SET_RESULT_NUMBER'; result: number; steps: string[] }
  | { type: 'SET_ERROR'; message: string | null }
  | { type: 'TOGGLE_EXPLANATION' }
  | { type: 'TOGGLE_CONCEITO_MATEMATICO' }
  | { type: 'RESET' }
  | { type: 'APPLY_EXAMPLE'; vetores: Record<string, Vector3D>; escalar?: number }
  | { type: 'SET_VETOR_PREENCHIDO'; vetor: 'v1' | 'v2'; value: boolean };

// Estado inicial
const initialState: VetorGeometriaState = {
  problema: 'somaVetores',
  vetores: {
    v1: { x: 0, y: 0, z: 0 },
    v2: { x: 0, y: 0, z: 0 }
  },
  escalar: 1,
  result: null,
  steps: [],
  errorMessage: null,
  showExplanation: true,
  showConceitoMatematico: true,
  vetoresPreenchidos: {
    v1: false,
    v2: false
  }
};

// Função reducer
function vetorGeometriaReducer(state: VetorGeometriaState, action: VetorGeometriaAction): VetorGeometriaState {
  switch (action.type) {
    case 'SET_PROBLEMA':
      return { ...state, problema: action.value, result: null, steps: [], errorMessage: null };
    case 'SET_VETOR': {
      const { vetor, coordenada, value } = action;
      const newValue = parseFloat(value);
      const newVetores = { ...state.vetores };
      const newVetoresPreenchidos = { ...state.vetoresPreenchidos };
      
      if (!isNaN(newValue) || value === '' || value === '-') {
        const coordValue = value === '' || value === '-' ? 0 : newValue;
        newVetores[vetor] = {
          ...newVetores[vetor],
          [coordenada]: coordValue
        };
        
        // Marcar o vetor como preenchido manualmente mesmo se todas as coordenadas forem zero
        newVetoresPreenchidos[vetor] = true;
      }
      
      return { 
        ...state, 
        vetores: newVetores,
        vetoresPreenchidos: newVetoresPreenchidos
      };
    }
    case 'SET_ESCALAR': {
      const newValue = parseFloat(action.value);
      if (!isNaN(newValue) || action.value === '' || action.value === '-') {
        const escalarValue = action.value === '' || action.value === '-' ? 0 : newValue;
        return { ...state, escalar: escalarValue };
      }
      return state;
    }
    case 'SET_RESULT_VECTOR':
      return {
        ...state,
        result: action.result,
        steps: action.steps,
        errorMessage: null,
        showExplanation: true
      };
    case 'SET_RESULT_NUMBER':
      return {
        ...state,
        result: action.result,
        steps: action.steps,
        errorMessage: null,
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
        errorMessage: null
      };
    case 'APPLY_EXAMPLE': {
      // Atualiza os vetores com os valores do exemplo
      const newVetoresPreenchidos = { v1: true, v2: true };
      
      return {
        ...state,
        vetores: {
          ...state.vetores,
          ...action.vetores
        },
        escalar: action.escalar !== undefined ? action.escalar : state.escalar,
        vetoresPreenchidos: newVetoresPreenchidos,
        result: null,
        steps: [],
        errorMessage: null
      };
    }
    case 'SET_VETOR_PREENCHIDO': {
      const { vetor, value } = action;
      const newVetoresPreenchidos = { ...state.vetoresPreenchidos };
      newVetoresPreenchidos[vetor] = value;
      return {
        ...state,
        vetoresPreenchidos: newVetoresPreenchidos
      };
    }
    default:
      return state;
  }
}

export function useVetorGeometriaSolver() {
  const [state, dispatch] = useReducer(vetorGeometriaReducer, initialState);

  // Validação de entrada numérica
  const handleNumberInput = (value: string): boolean => {
    const numberPattern = /^-?\d*\.?\d*$/;
    return value === '' || value === '-' || numberPattern.test(value);
  };

  // Definir valor do campo com validação
  const setVetorValue = (vetor: 'v1' | 'v2', coordenada: 'x' | 'y' | 'z', value: string) => {
    if (handleNumberInput(value)) {
      dispatch({ type: 'SET_VETOR', vetor, coordenada, value });
      
      // Garantir que o vetor seja marcado como preenchido mesmo quando contém zeros
      const newVetoresPreenchidos = { ...state.vetoresPreenchidos };
      newVetoresPreenchidos[vetor] = true;
      dispatch({ 
        type: 'SET_VETOR_PREENCHIDO', 
        vetor, 
        value: true 
      });
    }
  };

  // Definir valor do escalar com validação
  const setEscalarValue = (value: string) => {
    if (handleNumberInput(value)) {
      dispatch({ type: 'SET_ESCALAR', value });
    }
  };

  // Aplicar um exemplo ao estado atual
  const applyExample = (exemplo: { 
    vetores: Record<string, Vector3D>; 
    escalar?: number;
    description: string 
  }) => {
    dispatch({ 
      type: 'APPLY_EXAMPLE', 
      vetores: exemplo.vetores,
      escalar: exemplo.escalar
    });
  };

  // Função para obter exemplos filtrados pelo tipo de problema atual
  const getFilteredExamples = () => {
    return getVetorGeometriaExamples(state.problema);
  };

  // Função para verificar se os vetores necessários foram preenchidos
  const verificarVetoresPreenchidos = (vetores: string[]): boolean => {
    for (const vetor of vetores) {
      const vetorKey = vetor as 'v1' | 'v2';
      
      // Verifica se o vetor foi preenchido manualmente ou por um exemplo
      if (!state.vetoresPreenchidos[vetorKey]) {
        dispatch({
          type: 'SET_ERROR',
          message: `Por favor, preencha as coordenadas do vetor ${vetor.toUpperCase()}.`
        });
        return false;
      }
    }
    return true;
  };

  // Função principal de resolução
  const handleSolve = () => {
    dispatch({ type: 'RESET' });

    try {
      const calculationSteps: string[] = [];
      let stepCount = 1;

      switch (state.problema) {
        case 'somaVetores': {
          if (!verificarVetoresPreenchidos(['v1', 'v2'])) return;
          
          const { v1, v2 } = state.vetores;
          const resultado = addVectors(v1, v2);
          
          calculationSteps.push(
            `Passo ${stepCount++}: Para calcular a soma de dois vetores, somamos suas coordenadas correspondentes.`,
            `Temos os vetores v₁ = (${v1.x}, ${v1.y}, ${v1.z}) e v₂ = (${v2.x}, ${v2.y}, ${v2.z}).`,
            `Passo ${stepCount++}: Aplicamos a fórmula da soma de vetores: v₁ + v₂ = (v₁.x + v₂.x, v₁.y + v₂.y, v₁.z + v₂.z)`,
            `Componente x: ${v1.x} + ${v2.x} = ${v1.x + v2.x}`,
            `Componente y: ${v1.y} + ${v2.y} = ${v1.y + v2.y}`,
            `Componente z: ${v1.z} + ${v2.z} = ${v1.z + v2.z}`,
            `Resultado: A soma dos vetores é (${resultado.x}, ${resultado.y}, ${resultado.z}).`
          );
          
          dispatch({ type: 'SET_RESULT_VECTOR', result: resultado, steps: calculationSteps });
          break;
        }
        
        case 'subtracaoVetores': {
          if (!verificarVetoresPreenchidos(['v1', 'v2'])) return;
          
          const { v1, v2 } = state.vetores;
          const resultado = subtractVectors(v1, v2);
          
          calculationSteps.push(
            `Passo ${stepCount++}: Para calcular a diferença entre dois vetores, subtraímos suas coordenadas correspondentes.`,
            `Temos os vetores v₁ = (${v1.x}, ${v1.y}, ${v1.z}) e v₂ = (${v2.x}, ${v2.y}, ${v2.z}).`,
            `Passo ${stepCount++}: Aplicamos a fórmula da subtração de vetores: v₁ - v₂ = (v₁.x - v₂.x, v₁.y - v₂.y, v₁.z - v₂.z)`,
            `Componente x: ${v1.x} - ${v2.x} = ${v1.x - v2.x}`,
            `Componente y: ${v1.y} - ${v2.y} = ${v1.y - v2.y}`,
            `Componente z: ${v1.z} - ${v2.z} = ${v1.z - v2.z}`,
            `Resultado: A diferença entre os vetores é (${resultado.x}, ${resultado.y}, ${resultado.z}).`
          );
          
          dispatch({ type: 'SET_RESULT_VECTOR', result: resultado, steps: calculationSteps });
          break;
        }
        
        case 'multiplicacaoEscalar': {
          if (!verificarVetoresPreenchidos(['v1'])) return;
          
          const { v1 } = state.vetores;
          const { escalar } = state;
          const resultado = scalarMultiply(v1, escalar);
          
          calculationSteps.push(
            `Passo ${stepCount++}: Para multiplicar um vetor por um escalar, multiplicamos cada componente do vetor pelo escalar.`,
            `Temos o vetor v = (${v1.x}, ${v1.y}, ${v1.z}) e o escalar k = ${escalar}.`,
            `Passo ${stepCount++}: Aplicamos a fórmula da multiplicação por escalar: k·v = (k·v.x, k·v.y, k·v.z)`,
            `Componente x: ${escalar} × ${v1.x} = ${escalar * v1.x}`,
            `Componente y: ${escalar} × ${v1.y} = ${escalar * v1.y}`,
            `Componente z: ${escalar} × ${v1.z} = ${escalar * v1.z}`,
            `Resultado: A multiplicação do vetor pelo escalar ${escalar} é (${resultado.x}, ${resultado.y}, ${resultado.z}).`
          );
          
          dispatch({ type: 'SET_RESULT_VECTOR', result: resultado, steps: calculationSteps });
          break;
        }
        
        case 'produtoEscalar': {
          if (!verificarVetoresPreenchidos(['v1', 'v2'])) return;
          
          const { v1, v2 } = state.vetores;
          const resultado = dotProduct(v1, v2);
          
          calculationSteps.push(
            `Passo ${stepCount++}: Para calcular o produto escalar (dot product) de dois vetores, multiplicamos seus componentes correspondentes e somamos os resultados.`,
            `Temos os vetores v₁ = (${v1.x}, ${v1.y}, ${v1.z}) e v₂ = (${v2.x}, ${v2.y}, ${v2.z}).`,
            `Passo ${stepCount++}: Aplicamos a fórmula do produto escalar: v₁ · v₂ = v₁.x × v₂.x + v₁.y × v₂.y + v₁.z × v₂.z`,
            `Componente x: ${v1.x} × ${v2.x} = ${v1.x * v2.x}`,
            `Componente y: ${v1.y} × ${v2.y} = ${v1.y * v2.y}`,
            `Componente z: ${v1.z} × ${v2.z} = ${v1.z * v2.z}`,
            `Passo ${stepCount++}: Somamos os produtos: ${v1.x * v2.x} + ${v1.y * v2.y} + ${v1.z * v2.z} = ${resultado}`,
            `Resultado: O produto escalar dos vetores é ${resultado}.`
          );
          
          dispatch({ type: 'SET_RESULT_NUMBER', result: resultado, steps: calculationSteps });
          break;
        }
        
        case 'produtoVetorial': {
          if (!verificarVetoresPreenchidos(['v1', 'v2'])) return;
          
          const { v1, v2 } = state.vetores;
          const resultado = crossProduct(v1, v2);
          
          calculationSteps.push(
            `Passo ${stepCount++}: Para calcular o produto vetorial (cross product) de dois vetores, usamos a fórmula do determinante.`,
            `Temos os vetores v₁ = (${v1.x}, ${v1.y}, ${v1.z}) e v₂ = (${v2.x}, ${v2.y}, ${v2.z}).`,
            `Passo ${stepCount++}: Aplicamos a fórmula do produto vetorial:`,
            `v₁ × v₂ = (v₁.y × v₂.z - v₁.z × v₂.y, v₁.z × v₂.x - v₁.x × v₂.z, v₁.x × v₂.y - v₁.y × v₂.x)`,
            `Componente x: ${v1.y} × ${v2.z} - ${v1.z} × ${v2.y} = ${v1.y * v2.z} - ${v1.z * v2.y} = ${v1.y * v2.z - v1.z * v2.y}`,
            `Componente y: ${v1.z} × ${v2.x} - ${v1.x} × ${v2.z} = ${v1.z * v2.x} - ${v1.x * v2.z} = ${v1.z * v2.x - v1.x * v2.z}`,
            `Componente z: ${v1.x} × ${v2.y} - ${v1.y} × ${v2.x} = ${v1.x * v2.y} - ${v1.y * v2.x} = ${v1.x * v2.y - v1.y * v2.x}`,
            `Resultado: O produto vetorial dos vetores é (${resultado.x}, ${resultado.y}, ${resultado.z}).`
          );
          
          dispatch({ type: 'SET_RESULT_VECTOR', result: resultado, steps: calculationSteps });
          break;
        }
        
        case 'magnitudeVetor': {
          if (!verificarVetoresPreenchidos(['v1'])) return;
          
          const { v1 } = state.vetores;
          const resultado = vectorMagnitude(v1);
          
          calculationSteps.push(
            `Passo ${stepCount++}: Para calcular a magnitude (ou módulo) de um vetor, usamos a fórmula da norma euclidiana.`,
            `Temos o vetor v = (${v1.x}, ${v1.y}, ${v1.z}).`,
            `Passo ${stepCount++}: Aplicamos a fórmula da magnitude: |v| = √(v.x² + v.y² + v.z²)`,
            `Componente x²: ${v1.x}² = ${v1.x * v1.x}`,
            `Componente y²: ${v1.y}² = ${v1.y * v1.y}`,
            `Componente z²: ${v1.z}² = ${v1.z * v1.z}`,
            `Passo ${stepCount++}: Somamos os quadrados: ${v1.x * v1.x} + ${v1.y * v1.y} + ${v1.z * v1.z} = ${v1.x * v1.x + v1.y * v1.y + v1.z * v1.z}`,
            `Passo ${stepCount++}: Calculamos a raiz quadrada: √${v1.x * v1.x + v1.y * v1.y + v1.z * v1.z} = ${resultado}`,
            `Resultado: A magnitude do vetor é ${resultado} unidades de comprimento.`
          );
          
          dispatch({ type: 'SET_RESULT_NUMBER', result: resultado, steps: calculationSteps });
          break;
        }
        
        case 'normalizacaoVetor': {
          if (!verificarVetoresPreenchidos(['v1'])) return;
          
          const { v1 } = state.vetores;
          const magnitude = vectorMagnitude(v1);
          
          if (magnitude === 0) {
            dispatch({ 
              type: 'SET_ERROR', 
              message: 'Não é possível normalizar o vetor nulo (0,0,0).' 
            });
            return;
          }
          
          const resultado = normalizeVector(v1);
          
          calculationSteps.push(
            `Passo ${stepCount++}: Para normalizar um vetor, dividimos cada componente pela magnitude do vetor.`,
            `Temos o vetor v = (${v1.x}, ${v1.y}, ${v1.z}).`,
            `Passo ${stepCount++}: Calculamos a magnitude do vetor: |v| = √(v.x² + v.y² + v.z²)`,
            `|v| = √(${v1.x}² + ${v1.y}² + ${v1.z}²) = √(${v1.x * v1.x} + ${v1.y * v1.y} + ${v1.z * v1.z}) = ${magnitude}`,
            `Passo ${stepCount++}: Aplicamos a fórmula da normalização: v̂ = v / |v| = (v.x/|v|, v.y/|v|, v.z/|v|)`,
            `Componente x: ${v1.x} ÷ ${magnitude} = ${v1.x / magnitude}`,
            `Componente y: ${v1.y} ÷ ${magnitude} = ${v1.y / magnitude}`,
            `Componente z: ${v1.z} ÷ ${magnitude} = ${v1.z / magnitude}`,
            `Resultado: O vetor normalizado é (${resultado.x}, ${resultado.y}, ${resultado.z}).`
          );
          
          dispatch({ type: 'SET_RESULT_VECTOR', result: resultado, steps: calculationSteps });
          break;
        }
        
        case 'anguloEntreVetores': {
          if (!verificarVetoresPreenchidos(['v1', 'v2'])) return;
          
          const { v1, v2 } = state.vetores;
          const magV1 = vectorMagnitude(v1);
          const magV2 = vectorMagnitude(v2);
          
          if (magV1 === 0 || magV2 === 0) {
            dispatch({ 
              type: 'SET_ERROR', 
              message: 'Não é possível calcular o ângulo quando um dos vetores é nulo (0,0,0).' 
            });
            return;
          }
          
          const dot = dotProduct(v1, v2);
          const radians = angleBetweenVectors(v1, v2);
          const degrees = (radians * 180) / Math.PI;
          
          calculationSteps.push(
            `Passo ${stepCount++}: Para calcular o ângulo entre dois vetores, usamos a fórmula do produto escalar.`,
            `Temos os vetores v₁ = (${v1.x}, ${v1.y}, ${v1.z}) e v₂ = (${v2.x}, ${v2.y}, ${v2.z}).`,
            `Passo ${stepCount++}: Calculamos o produto escalar: v₁ · v₂ = v₁.x × v₂.x + v₁.y × v₂.y + v₁.z × v₂.z`,
            `v₁ · v₂ = ${v1.x} × ${v2.x} + ${v1.y} × ${v2.y} + ${v1.z} × ${v2.z} = ${dot}`,
            `Passo ${stepCount++}: Calculamos as magnitudes dos vetores:`,
            `|v₁| = √(${v1.x}² + ${v1.y}² + ${v1.z}²) = √(${v1.x * v1.x} + ${v1.y * v1.y} + ${v1.z * v1.z}) = ${magV1}`,
            `|v₂| = √(${v2.x}² + ${v2.y}² + ${v2.z}²) = √(${v2.x * v2.x} + ${v2.y * v2.y} + ${v2.z * v2.z}) = ${magV2}`,
            `Passo ${stepCount++}: Aplicamos a fórmula do ângulo: cosθ = (v₁ · v₂) / (|v₁| × |v₂|)`,
            `cosθ = ${dot} / (${magV1} × ${magV2}) = ${dot} / ${magV1 * magV2} = ${dot/(magV1 * magV2)}`,
            `Passo ${stepCount++}: Calculamos o arco cosseno para obter o ângulo:`,
            `θ = arcos(${dot/(magV1 * magV2)}) = ${radians} radianos = ${degrees.toFixed(2)} graus`,
            `Resultado: O ângulo entre os vetores é ${radians} rad (${degrees.toFixed(2)}°).`
          );
          
          dispatch({ type: 'SET_RESULT_NUMBER', result: radians, steps: calculationSteps });
          break;
        }
        
        default:
          dispatch({ type: 'SET_ERROR', message: 'Tipo de problema não reconhecido.' });
          return;
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', message: 'Ocorreu um erro ao calcular. Verifique os valores inseridos.' });
    }
  };

  return {
    state,
    dispatch,
    setVetorValue,
    setEscalarValue,
    handleSolve,
    applyExample,
    getFilteredExamples
  };
} 