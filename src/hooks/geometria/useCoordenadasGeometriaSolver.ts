import { useReducer } from 'react';
import {
  Point3D,
  distance3D,
  areCollinear3D,
  areCoplanar,
  Plane,
  Line3D,
  planeFromPoints,
  distancePointToPlane,
  lineFromPoints,
  distancePointToLine,
  getCoordenadasExamples
} from '../../utils/mathUtilsGeometria/mathUtilsGeometria';

// Definições de tipo
export type ProblemaCoordenadasGeometria = 
  'distanciaEntrePontos' | 
  'verificarColinearidade' | 
  'verificarCoplanaridade' | 
  'distanciaPontoAPlano' |
  'distanciaPontoAReta';

// Interface de estado
interface CoordenadasGeometriaState {
  problema: ProblemaCoordenadasGeometria;
  pontos: {
    p1: Point3D;
    p2: Point3D;
    p3: Point3D;
    p4: Point3D;
  };
  plano: Plane | null;
  reta: Line3D | null;
  result: number | boolean | null;
  steps: string[];
  errorMessage: string;
  showExplanation: boolean;
  showConceitoMatematico: boolean;
  // Adicionando um objeto para rastrear quais pontos foram preenchidos manualmente
  pontosPreenchidos: {
    p1: boolean;
    p2: boolean;
    p3: boolean;
    p4: boolean;
  };
}

// Tipos de ações
type CoordenadasGeometriaAction =
  | { type: 'SET_PROBLEMA'; value: ProblemaCoordenadasGeometria }
  | { type: 'SET_PONTO'; ponto: 'p1' | 'p2' | 'p3' | 'p4'; coordenada: 'x' | 'y' | 'z'; value: string }
  | { type: 'SET_RESULT_NUMBER'; result: number; steps: string[] }
  | { type: 'SET_RESULT_BOOLEAN'; result: boolean; steps: string[] }
  | { type: 'SET_ERROR'; message: string }
  | { type: 'TOGGLE_EXPLANATION' }
  | { type: 'TOGGLE_CONCEITO_MATEMATICO' }
  | { type: 'RESET' }
  | { type: 'APPLY_EXAMPLE'; pontos: Record<string, Point3D> }
  | { type: 'SET_PONTO_PREENCHIDO'; ponto: 'p1' | 'p2' | 'p3' | 'p4'; value: boolean };

// Estado inicial
const initialState: CoordenadasGeometriaState = {
  problema: 'distanciaEntrePontos',
  pontos: {
    p1: { x: 0, y: 0, z: 0 },
    p2: { x: 0, y: 0, z: 0 },
    p3: { x: 0, y: 0, z: 0 },
    p4: { x: 0, y: 0, z: 0 }
  },
  plano: null,
  reta: null,
  result: null,
  steps: [],
  errorMessage: '',
  showExplanation: true,
  showConceitoMatematico: true,
  pontosPreenchidos: {
    p1: false,
    p2: false,
    p3: false,
    p4: false
  }
};

// Função reducer
function coordenadasGeometriaReducer(state: CoordenadasGeometriaState, action: CoordenadasGeometriaAction): CoordenadasGeometriaState {
  switch (action.type) {
    case 'SET_PROBLEMA':
      return { ...state, problema: action.value, result: null, steps: [], errorMessage: '' };
    case 'SET_PONTO': {
      const { ponto, coordenada, value } = action;
      const newValue = parseFloat(value);
      const newPontos = { ...state.pontos };
      const newPontosPreenchidos = { ...state.pontosPreenchidos };
      
      if (!isNaN(newValue) || value === '' || value === '-') {
        const coordValue = value === '' || value === '-' ? 0 : newValue;
        newPontos[ponto] = {
          ...newPontos[ponto],
          [coordenada]: coordValue
        };
        
        // Marcar o ponto como preenchido manualmente mesmo se todas as coordenadas forem zero
        newPontosPreenchidos[ponto] = true;
      }
      
      return { 
        ...state, 
        pontos: newPontos,
        pontosPreenchidos: newPontosPreenchidos
      };
    }
    case 'SET_RESULT_NUMBER':
      return {
        ...state,
        result: action.result,
        steps: action.steps,
        errorMessage: '',
        showExplanation: true
      };
    case 'SET_RESULT_BOOLEAN':
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
        errorMessage: '',
        plano: null,
        reta: null
      };
    case 'APPLY_EXAMPLE': {
      // Atualiza os pontos com os valores do exemplo
      const newPontosPreenchidos = { p1: true, p2: true, p3: true, p4: true };
      
      return {
        ...state,
        pontos: {
          ...state.pontos,
          ...action.pontos
        },
        pontosPreenchidos: newPontosPreenchidos,
        result: null,
        steps: [],
        errorMessage: ''
      };
    }
    case 'SET_PONTO_PREENCHIDO': {
      const { ponto, value } = action;
      const newPontosPreenchidos = { ...state.pontosPreenchidos };
      newPontosPreenchidos[ponto] = value;
      return {
        ...state,
        pontosPreenchidos: newPontosPreenchidos
      };
    }
    default:
      return state;
  }
}

export function useCoordenadasGeometriaSolver() {
  const [state, dispatch] = useReducer(coordenadasGeometriaReducer, initialState);

  // Validação de entrada numérica
  const handleNumberInput = (value: string): boolean => {
    const numberPattern = /^-?\d*\.?\d*$/;
    return value === '' || value === '-' || numberPattern.test(value);
  };

  // Definir valor do campo com validação
  const setPontoValue = (ponto: 'p1' | 'p2' | 'p3' | 'p4', coordenada: 'x' | 'y' | 'z', value: string) => {
    if (handleNumberInput(value)) {
      dispatch({ type: 'SET_PONTO', ponto, coordenada, value });
      
      // Garantir que o ponto seja marcado como preenchido mesmo quando contém zeros
      const newPontosPreenchidos = { ...state.pontosPreenchidos };
      newPontosPreenchidos[ponto] = true;
      dispatch({ 
        type: 'SET_PONTO_PREENCHIDO', 
        ponto, 
        value: true 
      });
    }
  };

  // Aplicar um exemplo ao estado atual
  const applyExample = (exemplo: { pontos: Record<string, Point3D>; description: string }) => {
    dispatch({ type: 'APPLY_EXAMPLE', pontos: exemplo.pontos });
  };

  // Função para obter exemplos filtrados pelo tipo de problema atual
  const getFilteredExamples = () => {
    return getCoordenadasExamples(state.problema);
  };

  // Função para verificar se os pontos necessários foram preenchidos
  const verificarPontosPreenchidos = (pontos: string[]): boolean => {
    for (const ponto of pontos) {
      const pontoKey = ponto as 'p1' | 'p2' | 'p3' | 'p4';
      
      // Verifica se o ponto foi preenchido manualmente ou por um exemplo
      if (!state.pontosPreenchidos[pontoKey]) {
        dispatch({
          type: 'SET_ERROR',
          message: `Por favor, preencha as coordenadas do ponto ${ponto.toUpperCase()}.`
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
        case 'distanciaEntrePontos': {
          if (!verificarPontosPreenchidos(['p1', 'p2'])) return;
          
          const { p1, p2 } = state.pontos;
          const distancia = distance3D(p1, p2);
          
          calculationSteps.push(
            `Passo ${stepCount++}: Para calcular a distância entre dois pontos no espaço 3D, usamos a fórmula d = √[(x₂-x₁)² + (y₂-y₁)² + (z₂-z₁)²]`,
            `Temos os pontos P₁(${p1.x}, ${p1.y}, ${p1.z}) e P₂(${p2.x}, ${p2.y}, ${p2.z}).`,
            `Substituindo os valores: d = √[(${p2.x}-(${p1.x}))² + (${p2.y}-(${p1.y}))² + (${p2.z}-(${p1.z}))²]`,
            `Passo ${stepCount++}: Calculamos as diferenças entre as coordenadas:`,
            `Diferença em x: ${p2.x} - ${p1.x} = ${p2.x - p1.x}`,
            `Diferença em y: ${p2.y} - ${p1.y} = ${p2.y - p1.y}`,
            `Diferença em z: ${p2.z} - ${p1.z} = ${p2.z - p1.z}`,
            `Passo ${stepCount++}: Elevamos ao quadrado cada diferença:`,
            `(${p2.x - p1.x})² = ${Math.pow(p2.x - p1.x, 2)}`,
            `(${p2.y - p1.y})² = ${Math.pow(p2.y - p1.y, 2)}`,
            `(${p2.z - p1.z})² = ${Math.pow(p2.z - p1.z, 2)}`,
            `Passo ${stepCount++}: Somamos os quadrados das diferenças:`,
            `${Math.pow(p2.x - p1.x, 2)} + ${Math.pow(p2.y - p1.y, 2)} + ${Math.pow(p2.z - p1.z, 2)} = ${Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2) + Math.pow(p2.z - p1.z, 2)}`,
            `Passo ${stepCount++}: Calculamos a raiz quadrada da soma:`,
            `d = √${Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2) + Math.pow(p2.z - p1.z, 2)} = ${distancia}`,
            `Resultado: A distância entre os pontos é ${distancia} unidades de comprimento.`
          );
          
          dispatch({ type: 'SET_RESULT_NUMBER', result: distancia, steps: calculationSteps });
          break;
        }
        
        case 'verificarColinearidade': {
          if (!verificarPontosPreenchidos(['p1', 'p2', 'p3'])) return;
          
          const { p1, p2, p3 } = state.pontos;
          const colinear = areCollinear3D(p1, p2, p3);
          
          const v1 = {
            x: p2.x - p1.x,
            y: p2.y - p1.y,
            z: p2.z - p1.z
          };
          
          const v2 = {
            x: p3.x - p1.x,
            y: p3.y - p1.y,
            z: p3.z - p1.z
          };
          
          // Calcular o produto vetorial
          const crossProduct = {
            x: v1.y * v2.z - v1.z * v2.y,
            y: v1.z * v2.x - v1.x * v2.z,
            z: v1.x * v2.y - v1.y * v2.x
          };
          
          const magnitude = Math.sqrt(
            Math.pow(crossProduct.x, 2) + 
            Math.pow(crossProduct.y, 2) + 
            Math.pow(crossProduct.z, 2)
          );
          
          calculationSteps.push(
            `Passo ${stepCount++}: Para verificar se três pontos são colineares, verificamos se os vetores formados por esses pontos são paralelos.`,
            `Temos os pontos P₁(${p1.x}, ${p1.y}, ${p1.z}), P₂(${p2.x}, ${p2.y}, ${p2.z}) e P₃(${p3.x}, ${p3.y}, ${p3.z}).`,
            `Passo ${stepCount++}: Calculamos os vetores v₁ = P₂ - P₁ e v₂ = P₃ - P₁:`,
            `Vetor v₁ = (${p2.x} - ${p1.x}, ${p2.y} - ${p1.y}, ${p2.z} - ${p1.z}) = (${v1.x}, ${v1.y}, ${v1.z})`,
            `Vetor v₂ = (${p3.x} - ${p1.x}, ${p3.y} - ${p1.y}, ${p3.z} - ${p1.z}) = (${v2.x}, ${v2.y}, ${v2.z})`,
            `Passo ${stepCount++}: Verificamos se os vetores são paralelos calculando o produto vetorial v₁ × v₂.`,
            `Se o produto vetorial for zero (vetor nulo), os vetores são paralelos e os pontos são colineares.`,
            `A fórmula do produto vetorial é:`,
            `v₁ × v₂ = (v₁.y × v₂.z - v₁.z × v₂.y, v₁.z × v₂.x - v₁.x × v₂.z, v₁.x × v₂.y - v₁.y × v₂.x)`,
            `Passo ${stepCount++}: Calculamos cada componente do produto vetorial:`,
            `Componente x: ${v1.y} × ${v2.z} - ${v1.z} × ${v2.y} = ${v1.y * v2.z} - ${v1.z * v2.y} = ${crossProduct.x}`,
            `Componente y: ${v1.z} × ${v2.x} - ${v1.x} × ${v2.z} = ${v1.z * v2.x} - ${v1.x * v2.z} = ${crossProduct.y}`,
            `Componente z: ${v1.x} × ${v2.y} - ${v1.y} × ${v2.x} = ${v1.x * v2.y} - ${v1.y * v2.x} = ${crossProduct.z}`,
            `Passo ${stepCount++}: Obtemos o produto vetorial v₁ × v₂ = (${crossProduct.x}, ${crossProduct.y}, ${crossProduct.z})`,
            `Passo ${stepCount++}: Calculamos a magnitude (módulo) do produto vetorial:`,
            `|v₁ × v₂| = √(${crossProduct.x}² + ${crossProduct.y}² + ${crossProduct.z}²)`,
            `|v₁ × v₂| = √(${crossProduct.x * crossProduct.x} + ${crossProduct.y * crossProduct.y} + ${crossProduct.z * crossProduct.z})`,
            `|v₁ × v₂| = √${crossProduct.x * crossProduct.x + crossProduct.y * crossProduct.y + crossProduct.z * crossProduct.z} = ${magnitude.toFixed(6)}`,
            `Passo ${stepCount++}: Analisamos o resultado:`,
            magnitude < 0.0001 
              ? `Como a magnitude é muito próxima de zero (${magnitude.toFixed(6)}), consideramos que os vetores são paralelos.`
              : `Como a magnitude não é zero (${magnitude.toFixed(6)}), os vetores não são paralelos.`,
            `Resultado: A análise mostra que os pontos ${colinear ? 'são' : 'não são'} colineares.`
          );
          
          dispatch({ type: 'SET_RESULT_BOOLEAN', result: colinear, steps: calculationSteps });
          break;
        }
        
        case 'verificarCoplanaridade': {
          if (!verificarPontosPreenchidos(['p1', 'p2', 'p3', 'p4'])) return;
          
          const { p1, p2, p3, p4 } = state.pontos;
          const coplanar = areCoplanar(p1, p2, p3, p4);
          
          const v1 = {
            x: p2.x - p1.x,
            y: p2.y - p1.y,
            z: p2.z - p1.z
          };
          
          const v2 = {
            x: p3.x - p1.x,
            y: p3.y - p1.y,
            z: p3.z - p1.z
          };
          
          const v3 = {
            x: p4.x - p1.x,
            y: p4.y - p1.y,
            z: p4.z - p1.z
          };
          
          // Calcular o produto vetorial de v1 e v2
          const crossProduct = {
            x: v1.y * v2.z - v1.z * v2.y,
            y: v1.z * v2.x - v1.x * v2.z,
            z: v1.x * v2.y - v1.y * v2.x
          };
          
          // Calcular o produto misto (escalar triplo)
          const scalarTriple = 
            crossProduct.x * v3.x +
            crossProduct.y * v3.y +
            crossProduct.z * v3.z;
          
          calculationSteps.push(
            `Passo ${stepCount++}: Para verificar se quatro pontos são coplanares, calculamos o produto misto (ou escalar triplo) dos vetores formados por esses pontos.`,
            `Temos os pontos P₁(${p1.x}, ${p1.y}, ${p1.z}), P₂(${p2.x}, ${p2.y}, ${p2.z}), P₃(${p3.x}, ${p3.y}, ${p3.z}) e P₄(${p4.x}, ${p4.y}, ${p4.z}).`,
            `Passo ${stepCount++}: Calculamos os vetores a partir do ponto P₁:`,
            `Vetor v₁ = P₂ - P₁ = (${p2.x} - ${p1.x}, ${p2.y} - ${p1.y}, ${p2.z} - ${p1.z}) = (${v1.x}, ${v1.y}, ${v1.z})`,
            `Vetor v₂ = P₃ - P₁ = (${p3.x} - ${p1.x}, ${p3.y} - ${p1.y}, ${p3.z} - ${p1.z}) = (${v2.x}, ${v2.y}, ${v2.z})`,
            `Vetor v₃ = P₄ - P₁ = (${p4.x} - ${p1.x}, ${p4.y} - ${p1.y}, ${p4.z} - ${p1.z}) = (${v3.x}, ${v3.y}, ${v3.z})`,
            `Passo ${stepCount++}: Calculamos o produto misto (v₁ × v₂) · v₃`,
            `O produto misto pode ser interpretado como o volume do paralelepípedo formado pelos três vetores.`,
            `Se o volume for zero, os quatro pontos são coplanares.`,
            `Passo ${stepCount++}: Primeiro calculamos o produto vetorial v₁ × v₂:`,
            `Componente x: ${v1.y} × ${v2.z} - ${v1.z} × ${v2.y} = ${v1.y * v2.z} - ${v1.z * v2.y} = ${crossProduct.x}`,
            `Componente y: ${v1.z} × ${v2.x} - ${v1.x} × ${v2.z} = ${v1.z * v2.x} - ${v1.x * v2.z} = ${crossProduct.y}`,
            `Componente z: ${v1.x} × ${v2.y} - ${v1.y} × ${v2.x} = ${v1.x * v2.y} - ${v1.y * v2.x} = ${crossProduct.z}`,
            `v₁ × v₂ = (${crossProduct.x}, ${crossProduct.y}, ${crossProduct.z})`,
            `Passo ${stepCount++}: Agora calculamos o produto escalar (v₁ × v₂) · v₃:`,
            `(v₁ × v₂) · v₃ = ${crossProduct.x} × ${v3.x} + ${crossProduct.y} × ${v3.y} + ${crossProduct.z} × ${v3.z}`,
            `(v₁ × v₂) · v₃ = ${crossProduct.x * v3.x} + ${crossProduct.y * v3.y} + ${crossProduct.z * v3.z} = ${scalarTriple.toFixed(6)}`,
            `Passo ${stepCount++}: Analisamos o resultado:`,
            Math.abs(scalarTriple) < 0.0001 
              ? `Como o valor do produto misto está muito próximo de zero (${scalarTriple.toFixed(6)}), os três vetores são coplanares.`
              : `Como o valor do produto misto não é zero (${scalarTriple.toFixed(6)}), os três vetores não são coplanares.`,
            `Resultado: A análise mostra que os pontos ${coplanar ? 'são' : 'não são'} coplanares.`
          );
          
          dispatch({ type: 'SET_RESULT_BOOLEAN', result: coplanar, steps: calculationSteps });
          break;
        }
        
        case 'distanciaPontoAPlano': {
          if (!verificarPontosPreenchidos(['p1', 'p2', 'p3', 'p4'])) return;
          
          const { p1, p2, p3, p4 } = state.pontos;
          const plano = planeFromPoints(p1, p2, p3);
          const distancia = distancePointToPlane(p4, plano);
          
          const v1 = {
            x: p2.x - p1.x,
            y: p2.y - p1.y,
            z: p2.z - p1.z
          };
          
          const v2 = {
            x: p3.x - p1.x,
            y: p3.y - p1.y,
            z: p3.z - p1.z
          };
          
          // Calcular o produto vetorial para encontrar o vetor normal
          const normal = {
            x: v1.y * v2.z - v1.z * v2.y,
            y: v1.z * v2.x - v1.x * v2.z,
            z: v1.x * v2.y - v1.y * v2.x
          };
          
          // Calcular a magnitude do vetor normal
          const normalMagnitude = Math.sqrt(
            Math.pow(normal.x, 2) + 
            Math.pow(normal.y, 2) + 
            Math.pow(normal.z, 2)
          );
          
          calculationSteps.push(
            `Passo ${stepCount++}: Para calcular a distância de um ponto a um plano, primeiro precisamos encontrar a equação do plano definido por três pontos.`,
            `Temos os pontos P₁(${p1.x}, ${p1.y}, ${p1.z}), P₂(${p2.x}, ${p2.y}, ${p2.z}) e P₃(${p3.x}, ${p3.y}, ${p3.z}) que definem o plano,`,
            `e o ponto P₄(${p4.x}, ${p4.y}, ${p4.z}) cuja distância ao plano queremos calcular.`,
            `Passo ${stepCount++}: Calculamos dois vetores que pertencem ao plano:`,
            `Vetor v₁ = P₂ - P₁ = (${p2.x} - ${p1.x}, ${p2.y} - ${p1.y}, ${p2.z} - ${p1.z}) = (${v1.x}, ${v1.y}, ${v1.z})`,
            `Vetor v₂ = P₃ - P₁ = (${p3.x} - ${p1.x}, ${p3.y} - ${p1.y}, ${p3.z} - ${p1.z}) = (${v2.x}, ${v2.y}, ${v2.z})`,
            `Passo ${stepCount++}: Calculamos o vetor normal ao plano usando o produto vetorial v₁ × v₂:`,
            `Componente x: ${v1.y} × ${v2.z} - ${v1.z} × ${v2.y} = ${v1.y * v2.z} - ${v1.z * v2.y} = ${normal.x}`,
            `Componente y: ${v1.z} × ${v2.x} - ${v1.x} × ${v2.z} = ${v1.z * v2.x} - ${v1.x * v2.z} = ${normal.y}`,
            `Componente z: ${v1.x} × ${v2.y} - ${v1.y} × ${v2.x} = ${v1.x * v2.y} - ${v1.y * v2.x} = ${normal.z}`,
            `Vetor normal n = (${normal.x}, ${normal.y}, ${normal.z})`,
            `Passo ${stepCount++}: Calculamos a magnitude do vetor normal:`,
            `|n| = √(${normal.x}² + ${normal.y}² + ${normal.z}²) = √(${normal.x * normal.x} + ${normal.y * normal.y} + ${normal.z * normal.z}) = ${normalMagnitude.toFixed(6)}`,
            `Passo ${stepCount++}: A equação do plano na forma ax + by + cz + d = 0 é:`,
            `${plano.a}x + ${plano.b}y + ${plano.c}z + ${plano.d} = 0`,
            `Onde a, b, c são as componentes do vetor normal n, e d é calculado substituindo as coordenadas de P₁:`,
            `${plano.a} × ${p1.x} + ${plano.b} × ${p1.y} + ${plano.c} × ${p1.z} + d = 0`,
            `d = -(${plano.a} × ${p1.x} + ${plano.b} × ${p1.y} + ${plano.c} × ${p1.z}) = ${plano.d}`,
            `Passo ${stepCount++}: Calculamos a distância do ponto P₄ ao plano usando a fórmula:`,
            `d = |ax₄ + by₄ + cz₄ + d| / √(a² + b² + c²)`,
            `d = |${plano.a} × ${p4.x} + ${plano.b} × ${p4.y} + ${plano.c} × ${p4.z} + ${plano.d}| / ${normalMagnitude.toFixed(6)}`,
            `d = |${plano.a * p4.x} + ${plano.b * p4.y} + ${plano.c * p4.z} + ${plano.d}| / ${normalMagnitude.toFixed(6)}`,
            `d = |${plano.a * p4.x + plano.b * p4.y + plano.c * p4.z + plano.d}| / ${normalMagnitude.toFixed(6)} = ${distancia}`,
            `Resultado: A distância do ponto P₄ ao plano é ${distancia} unidades de comprimento.`
          );
          
          dispatch({ type: 'SET_RESULT_NUMBER', result: distancia, steps: calculationSteps });
          break;
        }
        
        case 'distanciaPontoAReta': {
          if (!verificarPontosPreenchidos(['p1', 'p2', 'p3'])) return;
          
          const { p1, p2, p3 } = state.pontos;
          const reta = lineFromPoints(p1, p2);
          const distancia = distancePointToLine(p3, reta);
          
          // Vetor direção da reta
          const dir = {
            x: p2.x - p1.x,
            y: p2.y - p1.y,
            z: p2.z - p1.z
          };
          
          // Magnitude do vetor direção
          const dirMagnitude = Math.sqrt(
            Math.pow(dir.x, 2) + 
            Math.pow(dir.y, 2) + 
            Math.pow(dir.z, 2)
          );
          
          // Vetor unitário na direção da reta
          const unitDir = {
            x: dir.x / dirMagnitude,
            y: dir.y / dirMagnitude,
            z: dir.z / dirMagnitude
          };
          
          // Calcular o vetor do ponto na reta até o ponto dado
          const pv = {
            x: p3.x - p1.x,
            y: p3.y - p1.y,
            z: p3.z - p1.z
          };
          
          // Produto escalar
          const dotProduct = pv.x * unitDir.x + pv.y * unitDir.y + pv.z * unitDir.z;
          
          // Vetor projeção
          const proj = {
            x: dotProduct * unitDir.x,
            y: dotProduct * unitDir.y,
            z: dotProduct * unitDir.z
          };
          
          // Vetor do ponto P3 à sua projeção na reta
          const perpendicular = {
            x: pv.x - proj.x,
            y: pv.y - proj.y,
            z: pv.z - proj.z
          };
          
          // Produto vetorial entre pv e a direção da reta
          const crossProd = {
            x: pv.y * unitDir.z - pv.z * unitDir.y,
            y: pv.z * unitDir.x - pv.x * unitDir.z,
            z: pv.x * unitDir.y - pv.y * unitDir.x
          };
          
          const crossMagnitude = Math.sqrt(
            Math.pow(crossProd.x, 2) +
            Math.pow(crossProd.y, 2) +
            Math.pow(crossProd.z, 2)
          );
          
          calculationSteps.push(
            `Passo ${stepCount++}: Para calcular a distância de um ponto a uma reta no espaço 3D, usamos o conceito de produto vetorial.`,
            `Temos os pontos P₁(${p1.x}, ${p1.y}, ${p1.z}) e P₂(${p2.x}, ${p2.y}, ${p2.z}) que definem a reta,`,
            `e o ponto P₃(${p3.x}, ${p3.y}, ${p3.z}) cuja distância à reta queremos calcular.`,
            `Passo ${stepCount++}: Primeiro calculamos o vetor direção da reta a partir dos pontos P₁ e P₂:`,
            `Vetor direção v = P₂ - P₁ = (${p2.x} - ${p1.x}, ${p2.y} - ${p1.y}, ${p2.z} - ${p1.z}) = (${dir.x}, ${dir.y}, ${dir.z})`,
            `Passo ${stepCount++}: Calculamos a magnitude do vetor direção para normalizá-lo:`,
            `|v| = √(${dir.x}² + ${dir.y}² + ${dir.z}²) = √(${dir.x * dir.x} + ${dir.y * dir.y} + ${dir.z * dir.z}) = ${dirMagnitude.toFixed(6)}`,
            `Passo ${stepCount++}: Normalizamos o vetor direção para obter um vetor unitário:`,
            `v̂ = v / |v| = (${dir.x}, ${dir.y}, ${dir.z}) / ${dirMagnitude.toFixed(6)} = (${unitDir.x.toFixed(6)}, ${unitDir.y.toFixed(6)}, ${unitDir.z.toFixed(6)})`,
            `Passo ${stepCount++}: Calculamos o vetor w do ponto P₁ ao ponto P₃:`,
            `w = P₃ - P₁ = (${p3.x} - ${p1.x}, ${p3.y} - ${p1.y}, ${p3.z} - ${p1.z}) = (${pv.x}, ${pv.y}, ${pv.z})`,
            `Passo ${stepCount++}: Existem duas maneiras de calcular a distância:`,
            `Método 1: Calculamos a projeção de w sobre v̂ e depois encontramos o vetor perpendicular:`,
            `1.1 Calculamos o produto escalar w · v̂:`,
            `w · v̂ = ${pv.x} × ${unitDir.x.toFixed(6)} + ${pv.y} × ${unitDir.y.toFixed(6)} + ${pv.z} × ${unitDir.z.toFixed(6)} = ${dotProduct.toFixed(6)}`,
            `1.2 Calculamos o vetor projeção de w sobre v̂:`,
            `proj_v̂(w) = (w · v̂) × v̂ = ${dotProduct.toFixed(6)} × (${unitDir.x.toFixed(6)}, ${unitDir.y.toFixed(6)}, ${unitDir.z.toFixed(6)})`,
            `proj_v̂(w) = (${proj.x.toFixed(6)}, ${proj.y.toFixed(6)}, ${proj.z.toFixed(6)})`,
            `1.3 Calculamos o vetor perpendicular:`,
            `w_perp = w - proj_v̂(w) = (${pv.x}, ${pv.y}, ${pv.z}) - (${proj.x.toFixed(6)}, ${proj.y.toFixed(6)}, ${proj.z.toFixed(6)})`,
            `w_perp = (${perpendicular.x.toFixed(6)}, ${perpendicular.y.toFixed(6)}, ${perpendicular.z.toFixed(6)})`,
            `1.4 A distância é a magnitude do vetor perpendicular:`,
            `d = |w_perp| = √(${perpendicular.x.toFixed(6)}² + ${perpendicular.y.toFixed(6)}² + ${perpendicular.z.toFixed(6)}²) = ${distancia}`,
            `Passo ${stepCount++}: Método 2: Calculamos o produto vetorial w × v̂:`,
            `2.1 Calculamos o produto vetorial w × v̂:`,
            `w × v̂ = (${pv.y} × ${unitDir.z.toFixed(6)} - ${pv.z} × ${unitDir.y.toFixed(6)},`,
            `         ${pv.z} × ${unitDir.x.toFixed(6)} - ${pv.x} × ${unitDir.z.toFixed(6)},`,
            `         ${pv.x} × ${unitDir.y.toFixed(6)} - ${pv.y} × ${unitDir.x.toFixed(6)})`,
            `w × v̂ = (${crossProd.x.toFixed(6)}, ${crossProd.y.toFixed(6)}, ${crossProd.z.toFixed(6)})`,
            `2.2 A distância é a magnitude do produto vetorial:`,
            `d = |w × v̂| = √(${crossProd.x.toFixed(6)}² + ${crossProd.y.toFixed(6)}² + ${crossProd.z.toFixed(6)}²) = ${crossMagnitude.toFixed(6)}`,
            `Resultado: A distância do ponto P₃ à reta é ${distancia} unidades de comprimento.`
          );
          
          dispatch({ type: 'SET_RESULT_NUMBER', result: distancia, steps: calculationSteps });
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
    setPontoValue,
    handleSolve,
    applyExample,
    getFilteredExamples
  };
} 