import { useReducer } from 'react';
import {
  Point3D,
  Vector3D,
  Line3D,
  Plane,
  distancePointToLine,
  distancePointToPlane,
  planeFromPoints,
  lineFromPoints,
  crossProduct,
  dotProduct,
  vectorMagnitude,
  getGeometriaAnaliticaExamples
} from '../../utils/mathUtilsGeometria/mathUtilsGeometria';

// Definições de tipo
export type ProblemaGeometriaAnalitica = 
  'distanciaEntrePontoEReta' | 
  'distanciaEntrePontoEPlano' | 
  'distanciaEntreRetas' | 
  'anguloEntreRetas' |
  'anguloEntreRetaEPlano' |
  'anguloEntrePlanos';

// Interface de estado
export interface GeometriaAnaliticaState {
  problema: ProblemaGeometriaAnalitica;
  pontos: {
    p1: Point3D;
    p2: Point3D;
    p3: Point3D;
    p4: Point3D;
    p5: Point3D;
    p6: Point3D;
  };
  reta1: Line3D | null;
  reta2: Line3D | null;
  plano1: Plane | null;
  plano2: Plane | null;
  result: number | null;
  steps: string[];
  errorMessage: string | null;
  showExplanation: boolean;
  showConceitoMatematico: boolean;
  // Objeto para rastrear quais pontos foram preenchidos manualmente
  pontosPreenchidos: {
    p1: boolean;
    p2: boolean;
    p3: boolean;
    p4: boolean;
    p5: boolean;
    p6: boolean;
  };
}

// Tipos de ações
type GeometriaAnaliticaAction =
  | { type: 'SET_PROBLEMA'; value: ProblemaGeometriaAnalitica }
  | { type: 'SET_PONTO'; ponto: 'p1' | 'p2' | 'p3' | 'p4' | 'p5' | 'p6'; coordenada: 'x' | 'y' | 'z'; value: string }
  | { type: 'SET_RESULT'; result: number; steps: string[] }
  | { type: 'SET_ERROR'; message: string | null }
  | { type: 'TOGGLE_EXPLANATION' }
  | { type: 'TOGGLE_CONCEITO_MATEMATICO' }
  | { type: 'RESET' }
  | { type: 'APPLY_EXAMPLE'; pontos: Record<string, Point3D> }
  | { type: 'SET_PONTO_PREENCHIDO'; ponto: 'p1' | 'p2' | 'p3' | 'p4' | 'p5' | 'p6'; value: boolean };

// Estado inicial
const initialState: GeometriaAnaliticaState = {
  problema: 'distanciaEntrePontoEReta',
  pontos: {
    p1: { x: 0, y: 0, z: 0 },
    p2: { x: 0, y: 0, z: 0 },
    p3: { x: 0, y: 0, z: 0 },
    p4: { x: 0, y: 0, z: 0 },
    p5: { x: 0, y: 0, z: 0 },
    p6: { x: 0, y: 0, z: 0 }
  },
  reta1: null,
  reta2: null,
  plano1: null,
  plano2: null,
  result: null,
  steps: [],
  errorMessage: null,
  showExplanation: true,
  showConceitoMatematico: true,
  pontosPreenchidos: {
    p1: false,
    p2: false,
    p3: false,
    p4: false,
    p5: false,
    p6: false
  }
};

// Função reducer
function geometriaAnaliticaReducer(state: GeometriaAnaliticaState, action: GeometriaAnaliticaAction): GeometriaAnaliticaState {
  switch (action.type) {
    case 'SET_PROBLEMA':
      return { ...state, problema: action.value, result: null, steps: [], errorMessage: null };
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
    case 'SET_RESULT':
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
        errorMessage: null,
        reta1: null,
        reta2: null,
        plano1: null,
        plano2: null
      };
    case 'APPLY_EXAMPLE': {
      // Atualiza os pontos com os valores do exemplo
      const newPontos = { ...state.pontos };
      const newPontosPreenchidos = { ...state.pontosPreenchidos };
      
      // Atualiza apenas os pontos fornecidos no exemplo
      Object.entries(action.pontos).forEach(([key, value]) => {
        if (key in newPontos) {
          newPontos[key as keyof typeof newPontos] = value;
          newPontosPreenchidos[key as keyof typeof newPontosPreenchidos] = true;
        }
      });
      
      return {
        ...state,
        pontos: newPontos,
        pontosPreenchidos: newPontosPreenchidos,
        result: null,
        steps: [],
        errorMessage: null
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

// Função para calcular o ângulo entre dois vetores em radianos
const angleBetweenVectors = (v1: Vector3D, v2: Vector3D): number => {
  const magV1 = vectorMagnitude(v1);
  const magV2 = vectorMagnitude(v2);
  
  if (magV1 === 0 || magV2 === 0) {
    throw new Error('Não é possível calcular o ângulo com vetor nulo');
  }
  
  const dot = dotProduct(v1, v2);
  const cosTheta = Math.max(-1, Math.min(1, dot / (magV1 * magV2)));
  return Math.acos(cosTheta);
};

// Função para calcular a distância entre duas retas no espaço
const distanceBetweenLines = (line1: Line3D, line2: Line3D): number => {
  // Vetor que conecta pontos das duas retas
  const connecting: Vector3D = {
    x: line1.point.x - line2.point.x,
    y: line1.point.y - line2.point.y,
    z: line1.point.z - line2.point.z
  };
  
  // Produto vetorial das direções das retas
  const crossDir = crossProduct(line1.direction, line2.direction);
  const crossDirMagnitude = vectorMagnitude(crossDir);
  
  // Se as linhas são paralelas
  if (crossDirMagnitude < 0.001) {
    // Projeção do vetor de conexão em qualquer direção
    const projection = dotProduct(connecting, line1.direction);
    const projectionVector = {
      x: projection * line1.direction.x,
      y: projection * line1.direction.y,
      z: projection * line1.direction.z
    };
    
    // Resultante é o vetor perpendicular à direção
    const perpendicular = {
      x: connecting.x - projectionVector.x,
      y: connecting.y - projectionVector.y,
      z: connecting.z - projectionVector.z
    };
    
    return vectorMagnitude(perpendicular);
  }
  
  // Caso geral: linhas não paralelas
  const dotTriple = Math.abs(dotProduct(connecting, crossDir));
  return dotTriple / crossDirMagnitude;
};

// Função para calcular o ângulo entre reta e plano
const angleBetweenLineAndPlane = (line: Line3D, plane: Plane): number => {
  // Vetor normal do plano
  const normal: Vector3D = {
    x: plane.a,
    y: plane.b,
    z: plane.c
  };
  
  // Ângulo entre a reta e a normal do plano
  const angleWithNormal = angleBetweenVectors(line.direction, normal);
  
  // O ângulo entre a reta e o plano é complementar ao ângulo entre a reta e a normal
  return Math.PI / 2 - angleWithNormal;
};

// Função para calcular o ângulo entre dois planos
const angleBetweenPlanes = (plane1: Plane, plane2: Plane): number => {
  // Vetores normais dos planos
  const normal1: Vector3D = {
    x: plane1.a,
    y: plane1.b,
    z: plane1.c
  };
  
  const normal2: Vector3D = {
    x: plane2.a,
    y: plane2.b,
    z: plane2.c
  };
  
  // O ângulo entre os planos é o mesmo que o ângulo entre suas normais
  return angleBetweenVectors(normal1, normal2);
};

export function useGeometriaAnaliticaSolver() {
  const [state, dispatch] = useReducer(geometriaAnaliticaReducer, initialState);

  // Validação de entrada numérica
  const handleNumberInput = (value: string): boolean => {
    const numberPattern = /^-?\d*\.?\d*$/;
    return value === '' || value === '-' || numberPattern.test(value);
  };

  // Definir valor do campo com validação
  const setPontoValue = (ponto: 'p1' | 'p2' | 'p3' | 'p4' | 'p5' | 'p6', coordenada: 'x' | 'y' | 'z', value: string) => {
    if (handleNumberInput(value)) {
      dispatch({ type: 'SET_PONTO', ponto, coordenada, value });
      
      // Garantir que o ponto seja marcado como preenchido
      dispatch({ 
        type: 'SET_PONTO_PREENCHIDO', 
        ponto, 
        value: true 
      });
    }
  };

  // Aplicar um exemplo ao estado atual
  const applyExample = (exemplo: { 
    pontos: Record<string, Point3D>;
    description: string 
  }) => {
    dispatch({ 
      type: 'APPLY_EXAMPLE', 
      pontos: exemplo.pontos
    });
  };

  // Função para obter exemplos filtrados pelo tipo de problema atual
  const getFilteredExamples = () => {
    return getGeometriaAnaliticaExamples(state.problema);
  };

  // Função para verificar se os pontos necessários foram preenchidos
  const verificarPontosPreenchidos = (pontos: string[]): boolean => {
    for (const ponto of pontos) {
      const pontoKey = ponto as 'p1' | 'p2' | 'p3' | 'p4' | 'p5' | 'p6';
      
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
        case 'distanciaEntrePontoEReta': {
          if (!verificarPontosPreenchidos(['p1', 'p2', 'p3'])) return;
          
          const { p1, p2, p3 } = state.pontos;
          const line = lineFromPoints(p1, p2);
          const distance = distancePointToLine(p3, line);
          
          calculationSteps.push(
            `Passo ${stepCount++}: Definir a reta a partir dos pontos P₁(${p1.x}, ${p1.y}, ${p1.z}) e P₂(${p2.x}, ${p2.y}, ${p2.z}).`,
            `Calculamos o vetor direção da reta: v = P₂ - P₁ = (${p2.x - p1.x}, ${p2.y - p1.y}, ${p2.z - p1.z})`,
            `Normalizando o vetor direção: v' = v/|v| = (${line.direction.x.toFixed(4)}, ${line.direction.y.toFixed(4)}, ${line.direction.z.toFixed(4)})`,
            `Passo ${stepCount++}: Calcular a distância do ponto P₃(${p3.x}, ${p3.y}, ${p3.z}) à reta.`,
            `Formamos o vetor P₁P₃ = (${p3.x - p1.x}, ${p3.y - p1.y}, ${p3.z - p1.z})`,
            `Passo ${stepCount++}: Calculamos o produto vetorial entre P₁P₃ e o vetor direção da reta.`,
            `A distância é dada pela magnitude desse produto vetorial: d = |P₁P₃ × v'|`,
            `Resultado: A distância do ponto à reta é ${distance} unidades de comprimento.`
          );
          
          dispatch({ type: 'SET_RESULT', result: distance, steps: calculationSteps });
          break;
        }
        
        case 'distanciaEntrePontoEPlano': {
          if (!verificarPontosPreenchidos(['p1', 'p2', 'p3', 'p4'])) return;
          
          const { p1, p2, p3, p4 } = state.pontos;
          const plane = planeFromPoints(p1, p2, p3);
          const distance = distancePointToPlane(p4, plane);
          
          calculationSteps.push(
            `Passo ${stepCount++}: Definir o plano a partir dos pontos P₁(${p1.x}, ${p1.y}, ${p1.z}), P₂(${p2.x}, ${p2.y}, ${p2.z}) e P₃(${p3.x}, ${p3.y}, ${p3.z}).`,
            `Formamos os vetores v₁ = P₂ - P₁ = (${p2.x - p1.x}, ${p2.y - p1.y}, ${p2.z - p1.z})`,
            `v₂ = P₃ - P₁ = (${p3.x - p1.x}, ${p3.y - p1.y}, ${p3.z - p1.z})`,
            `Passo ${stepCount++}: Calculamos o vetor normal ao plano usando o produto vetorial: n = v₁ × v₂`,
            `n = (${plane.a.toFixed(4)}, ${plane.b.toFixed(4)}, ${plane.c.toFixed(4)})`,
            `A equação do plano é ${plane.a.toFixed(2)}x + ${plane.b.toFixed(2)}y + ${plane.c.toFixed(2)}z + ${plane.d.toFixed(2)} = 0`,
            `Passo ${stepCount++}: Calcular a distância do ponto P₄(${p4.x}, ${p4.y}, ${p4.z}) ao plano.`,
            `Usando a fórmula d = |ax₀ + by₀ + cz₀ + d| / √(a² + b² + c²)`,
            `d = |${plane.a}(${p4.x}) + ${plane.b}(${p4.y}) + ${plane.c}(${p4.z}) + ${plane.d}| / √(${plane.a}² + ${plane.b}² + ${plane.c}²)`,
            `Resultado: A distância do ponto ao plano é ${distance} unidades de comprimento.`
          );
          
          dispatch({ type: 'SET_RESULT', result: distance, steps: calculationSteps });
          break;
        }
        
        case 'distanciaEntreRetas': {
          if (!verificarPontosPreenchidos(['p1', 'p2', 'p3', 'p4'])) return;
          
          const { p1, p2, p3, p4 } = state.pontos;
          const line1 = lineFromPoints(p1, p2);
          const line2 = lineFromPoints(p3, p4);
          const distance = distanceBetweenLines(line1, line2);
          
          calculationSteps.push(
            `Passo ${stepCount++}: Definir as retas a partir dos pontos fornecidos.`,
            `Reta 1: passa por P₁(${p1.x}, ${p1.y}, ${p1.z}) e P₂(${p2.x}, ${p2.y}, ${p2.z})`,
            `Vetor direção v₁ = (${line1.direction.x.toFixed(4)}, ${line1.direction.y.toFixed(4)}, ${line1.direction.z.toFixed(4)})`,
            `Reta 2: passa por P₃(${p3.x}, ${p3.y}, ${p3.z}) e P₄(${p4.x}, ${p4.y}, ${p4.z})`,
            `Vetor direção v₂ = (${line2.direction.x.toFixed(4)}, ${line2.direction.y.toFixed(4)}, ${line2.direction.z.toFixed(4)})`,
            `Passo ${stepCount++}: Verificar se as retas são paralelas.`,
            `Calculamos o produto vetorial dos vetores direção: v₁ × v₂`
          );
          
          // Calcular o produto vetorial das direções
          const crossDir = crossProduct(line1.direction, line2.direction);
          const crossDirMagnitude = vectorMagnitude(crossDir);
          
          if (crossDirMagnitude < 0.001) {
            calculationSteps.push(
              `Como v₁ × v₂ ≈ 0, as retas são paralelas.`,
              `Passo ${stepCount++}: Para retas paralelas, calculamos a distância entre uma reta e um ponto da outra reta.`,
              `A distância é ${distance.toFixed(4)} unidades de comprimento.`,
              `Resultado: A distância entre as retas paralelas é ${distance} unidades de comprimento.`
            );
          } else {
            calculationSteps.push(
              `Como v₁ × v₂ ≠ 0, as retas não são paralelas.`,
              `Passo ${stepCount++}: Para retas não paralelas, calculamos a distância usando a fórmula:`,
              `d = |v₁₂·(v₁×v₂)| / |v₁×v₂|`,
              `Onde v₁₂ é o vetor que conecta um ponto da reta 1 a um ponto da reta 2.`,
              `A distância calculada é ${distance.toFixed(4)} unidades de comprimento.`,
              `Resultado: A distância entre as retas não paralelas é ${distance} unidades de comprimento.`
            );
          }
          
          dispatch({ type: 'SET_RESULT', result: distance, steps: calculationSteps });
          break;
        }
        
        case 'anguloEntreRetas': {
          if (!verificarPontosPreenchidos(['p1', 'p2', 'p3', 'p4'])) return;
          
          const { p1, p2, p3, p4 } = state.pontos;
          const line1 = lineFromPoints(p1, p2);
          const line2 = lineFromPoints(p3, p4);
          
          // Calcular o ângulo entre os vetores direção
          const angle = angleBetweenVectors(line1.direction, line2.direction);
          
          // Garantimos um ângulo agudo
          const finalAngle = angle > Math.PI / 2 ? Math.PI - angle : angle;
          const finalAngleDegrees = (finalAngle * 180) / Math.PI;
          
          calculationSteps.push(
            `Passo ${stepCount++}: Definir as retas a partir dos pontos fornecidos.`,
            `Reta 1: passa por P₁(${p1.x}, ${p1.y}, ${p1.z}) e P₂(${p2.x}, ${p2.y}, ${p2.z})`,
            `Vetor direção v₁ = (${line1.direction.x.toFixed(4)}, ${line1.direction.y.toFixed(4)}, ${line1.direction.z.toFixed(4)})`,
            `Reta 2: passa por P₃(${p3.x}, ${p3.y}, ${p3.z}) e P₄(${p4.x}, ${p4.y}, ${p4.z})`,
            `Vetor direção v₂ = (${line2.direction.x.toFixed(4)}, ${line2.direction.y.toFixed(4)}, ${line2.direction.z.toFixed(4)})`,
            `Passo ${stepCount++}: Calcular o ângulo entre os vetores direção.`,
            `O ângulo é dado por: θ = arccos[(v₁·v₂) / (|v₁|·|v₂|)]`,
            `Calculando o produto escalar: v₁·v₂ = ${dotProduct(line1.direction, line2.direction).toFixed(4)}`,
            `Como os vetores direção já estão normalizados, |v₁| = |v₂| = 1`,
            `Passo ${stepCount++}: Convertemos o ângulo para graus.`,
            `θ = ${finalAngle.toFixed(4)} radianos = ${finalAngleDegrees.toFixed(2)}°`,
            `Resultado: O ângulo entre as retas é ${finalAngle} rad (${finalAngleDegrees.toFixed(2)}°).`
          );
          
          dispatch({ type: 'SET_RESULT', result: finalAngle, steps: calculationSteps });
          break;
        }
        
        case 'anguloEntreRetaEPlano': {
          if (!verificarPontosPreenchidos(['p1', 'p2', 'p3', 'p4', 'p5'])) return;
          
          const { p1, p2, p3, p4, p5 } = state.pontos;
          const line = lineFromPoints(p1, p2);
          const plane = planeFromPoints(p3, p4, p5);
          
          const angle = angleBetweenLineAndPlane(line, plane);
          const angleDegrees = (angle * 180) / Math.PI;
          
          calculationSteps.push(
            `Passo ${stepCount++}: Definir a reta a partir dos pontos P₁(${p1.x}, ${p1.y}, ${p1.z}) e P₂(${p2.x}, ${p2.y}, ${p2.z}).`,
            `Vetor direção da reta v = (${line.direction.x.toFixed(4)}, ${line.direction.y.toFixed(4)}, ${line.direction.z.toFixed(4)})`,
            `Passo ${stepCount++}: Definir o plano a partir dos pontos P₃(${p3.x}, ${p3.y}, ${p3.z}), P₄(${p4.x}, ${p4.y}, ${p4.z}) e P₅(${p5.x}, ${p5.y}, ${p5.z}).`,
            `Vetor normal do plano n = (${plane.a.toFixed(4)}, ${plane.b.toFixed(4)}, ${plane.c.toFixed(4)})`,
            `A equação do plano é ${plane.a.toFixed(2)}x + ${plane.b.toFixed(2)}y + ${plane.c.toFixed(2)}z + ${plane.d.toFixed(2)} = 0`,
            `Passo ${stepCount++}: Calcular o ângulo entre a reta e o plano.`,
            `Primeiro, calculamos o ângulo entre o vetor direção da reta e a normal do plano:`,
            `θₙ = arccos[(v·n) / (|v|·|n|)]`,
            `θₙ = ${(Math.PI/2 - angle).toFixed(4)} radianos`,
            `Passo ${stepCount++}: O ângulo entre a reta e o plano é complementar ao ângulo com a normal:`,
            `θ = π/2 - θₙ = ${angle.toFixed(4)} radianos = ${angleDegrees.toFixed(2)}°`,
            `Resultado: O ângulo entre a reta e o plano é ${angle} rad (${angleDegrees.toFixed(2)}°).`
          );
          
          dispatch({ type: 'SET_RESULT', result: angle, steps: calculationSteps });
          break;
        }
        
        case 'anguloEntrePlanos': {
          if (!verificarPontosPreenchidos(['p1', 'p2', 'p3', 'p4', 'p5', 'p6'])) return;
          
          const { p1, p2, p3, p4, p5, p6 } = state.pontos;
          const plane1 = planeFromPoints(p1, p2, p3);
          const plane2 = planeFromPoints(p4, p5, p6);
          
          const angle = angleBetweenPlanes(plane1, plane2);
          
          // Garantimos um ângulo agudo
          const finalAngle = angle > Math.PI / 2 ? Math.PI - angle : angle;
          const finalAngleDegrees = (finalAngle * 180) / Math.PI;
          
          calculationSteps.push(
            `Passo ${stepCount++}: Definir o primeiro plano a partir dos pontos P₁(${p1.x}, ${p1.y}, ${p1.z}), P₂(${p2.x}, ${p2.y}, ${p2.z}) e P₃(${p3.x}, ${p3.y}, ${p3.z}).`,
            `Vetor normal do plano 1: n₁ = (${plane1.a.toFixed(4)}, ${plane1.b.toFixed(4)}, ${plane1.c.toFixed(4)})`,
            `A equação do plano 1 é ${plane1.a.toFixed(2)}x + ${plane1.b.toFixed(2)}y + ${plane1.c.toFixed(2)}z + ${plane1.d.toFixed(2)} = 0`,
            `Passo ${stepCount++}: Definir o segundo plano a partir dos pontos P₄(${p4.x}, ${p4.y}, ${p4.z}), P₅(${p5.x}, ${p5.y}, ${p5.z}) e P₆(${p6.x}, ${p6.y}, ${p6.z}).`,
            `Vetor normal do plano 2: n₂ = (${plane2.a.toFixed(4)}, ${plane2.b.toFixed(4)}, ${plane2.c.toFixed(4)})`,
            `A equação do plano 2 é ${plane2.a.toFixed(2)}x + ${plane2.b.toFixed(2)}y + ${plane2.c.toFixed(2)}z + ${plane2.d.toFixed(2)} = 0`,
            `Passo ${stepCount++}: Calcular o ângulo entre os planos.`,
            `O ângulo entre os planos é o mesmo que o ângulo entre suas normais:`,
            `θ = arccos[(n₁·n₂) / (|n₁|·|n₂|)]`,
            `Calculando o produto escalar: n₁·n₂ = ${dotProduct({x: plane1.a, y: plane1.b, z: plane1.c}, {x: plane2.a, y: plane2.b, z: plane2.c}).toFixed(4)}`,
            `Passo ${stepCount++}: Convertemos o ângulo para graus, garantindo que seja agudo.`,
            `θ = ${finalAngle.toFixed(4)} radianos = ${finalAngleDegrees.toFixed(2)}°`,
            `Resultado: O ângulo entre os planos é ${finalAngle} rad (${finalAngleDegrees.toFixed(2)}°).`
          );
          
          dispatch({ type: 'SET_RESULT', result: finalAngle, steps: calculationSteps });
          break;
        }
        
        default:
          dispatch({ type: 'SET_ERROR', message: 'Tipo de problema não reconhecido.' });
          return;
      }
    } catch (error) {
      if (error instanceof Error) {
        dispatch({ type: 'SET_ERROR', message: error.message });
      } else {
        dispatch({ type: 'SET_ERROR', message: 'Ocorreu um erro ao calcular. Verifique os valores inseridos.' });
      }
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