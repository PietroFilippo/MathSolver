import { useReducer } from 'react';
import {
  cubeSurfaceArea,
  cuboidSurfaceArea,
  sphereSurfaceArea,
  cylinderSurfaceArea,
  coneSurfaceArea,
  squarePyramidSurfaceArea,
  triangularPrismSurfaceArea,
  getSurfaceAreaExamples
} from '../../utils/mathUtilsGeometria/mathUtilsGeometria';

// Definições de tipo
export type Solido = 'cubo' | 'paralelepipedo' | 'esfera' | 'cilindro' | 'cone' | 'piramide' | 'prisma';

// Interface de estado
interface SuperficieSolidosState {
  solido: Solido;
  aresta: string;
  comprimento: string;
  largura: string;
  altura: string;
  raio: string;
  ladoBase: string;
  result: number | null;
  steps: string[];
  errorMessage: string;
  showExplanation: boolean;
  showConceitoMatematico: boolean;
}

// Tipos de ações
type SuperficieSolidosAction =
  | { type: 'SET_SOLIDO'; value: Solido }
  | { type: 'SET_ARESTA'; value: string }
  | { type: 'SET_COMPRIMENTO'; value: string }
  | { type: 'SET_LARGURA'; value: string }
  | { type: 'SET_ALTURA'; value: string }
  | { type: 'SET_RAIO'; value: string }
  | { type: 'SET_LADO_BASE'; value: string }
  | { type: 'SET_RESULT'; result: number; steps: string[] }
  | { type: 'SET_ERROR'; message: string }
  | { type: 'TOGGLE_EXPLANATION' }
  | { type: 'TOGGLE_CONCEITO_MATEMATICO' }
  | { type: 'RESET' }
  | { type: 'APPLY_EXAMPLE'; values: Record<string, number> };

// Estado inicial
const initialState: SuperficieSolidosState = {
  solido: 'cubo',
  aresta: '',
  comprimento: '',
  largura: '',
  altura: '',
  raio: '',
  ladoBase: '',
  result: null,
  steps: [],
  errorMessage: '',
  showExplanation: true,
  showConceitoMatematico: true
};

// Função reducer
function superficieSolidosReducer(state: SuperficieSolidosState, action: SuperficieSolidosAction): SuperficieSolidosState {
  switch (action.type) {
    case 'SET_SOLIDO':
      return { ...state, solido: action.value };
    case 'SET_ARESTA':
      return { ...state, aresta: action.value };
    case 'SET_COMPRIMENTO':
      return { ...state, comprimento: action.value };
    case 'SET_LARGURA':
      return { ...state, largura: action.value };
    case 'SET_ALTURA':
      return { ...state, altura: action.value };
    case 'SET_RAIO':
      return { ...state, raio: action.value };
    case 'SET_LADO_BASE':
      return { ...state, ladoBase: action.value };
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
      // Reseta todos os valores primeiro
      newState.aresta = '';
      newState.comprimento = '';
      newState.largura = '';
      newState.altura = '';
      newState.raio = '';
      newState.ladoBase = '';
      
      // Aplica os valores do exemplo
      for (const [key, value] of Object.entries(action.values)) {
        switch (key) {
          case 'aresta':
            newState.aresta = value.toString();
            break;
          case 'comprimento':
            newState.comprimento = value.toString();
            break;
          case 'largura':
            newState.largura = value.toString();
            break;
          case 'altura':
            newState.altura = value.toString();
            break;
          case 'raio':
            newState.raio = value.toString();
            break;
          case 'ladoBase':
            newState.ladoBase = value.toString();
            break;
        }
      }
      return newState;
    default:
      return state;
  }
}

export function useSuperficieSolidosSolver() {
  const [state, dispatch] = useReducer(superficieSolidosReducer, initialState);

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
        case 'aresta':
          dispatch({ type: 'SET_ARESTA', value: validValue });
          break;
        case 'comprimento':
          dispatch({ type: 'SET_COMPRIMENTO', value: validValue });
          break;
        case 'largura':
          dispatch({ type: 'SET_LARGURA', value: validValue });
          break;
        case 'altura':
          dispatch({ type: 'SET_ALTURA', value: validValue });
          break;
        case 'raio':
          dispatch({ type: 'SET_RAIO', value: validValue });
          break;
        case 'ladoBase':
          dispatch({ type: 'SET_LADO_BASE', value: validValue });
          break;
      }
    });
  };

  // Aplicar um exemplo ao estado atual
  const applyExample = (exemplo: { valores: Record<string, number>; description: string }) => {
    dispatch({ type: 'APPLY_EXAMPLE', values: exemplo.valores });
  };

  // Função para obter exemplos filtrados pelo tipo de sólido atual
  const getFilteredExamples = () => {
    return getSurfaceAreaExamples(state.solido);
  };

  // Função principal de resolução
  const handleSolve = () => {
    dispatch({ type: 'RESET' });

    try {
      let superficie: number;
      const calculationSteps: string[] = [];
      let stepCount = 1;

      switch (state.solido) {
        case 'cubo': {
          if (!state.aresta.trim()) {
            dispatch({ type: 'SET_ERROR', message: 'Por favor, insira o valor da aresta do cubo.' });
            return;
          }
          const arestaNum = parseFloat(state.aresta);
          if (isNaN(arestaNum) || arestaNum <= 0) {
            dispatch({ type: 'SET_ERROR', message: 'A aresta deve ser um número positivo.' });
            return;
          }

          superficie = cubeSurfaceArea(arestaNum);
          calculationSteps.push(
            `Passo ${stepCount++}: Para calcular a área da superfície do cubo, usamos a fórmula S = 6a²`,
            `Passo ${stepCount++}: Substituindo a aresta: S = 6 × ${arestaNum}²`,
            `S = 6 × ${arestaNum * arestaNum}`,
            `S = ${superficie} unidades quadradas`
          );
          break;
        }

        case 'paralelepipedo': {
          if (!state.comprimento.trim() || !state.largura.trim() || !state.altura.trim()) {
            dispatch({ type: 'SET_ERROR', message: 'Por favor, insira todas as dimensões do paralelepípedo.' });
            return;
          }
          const compNum = parseFloat(state.comprimento);
          const largNum = parseFloat(state.largura);
          const altNum = parseFloat(state.altura);
          if (isNaN(compNum) || isNaN(largNum) || isNaN(altNum) || compNum <= 0 || largNum <= 0 || altNum <= 0) {
            dispatch({ type: 'SET_ERROR', message: 'Todas as dimensões devem ser números positivos.' });
            return;
          }

          superficie = cuboidSurfaceArea(compNum, largNum, altNum);
          calculationSteps.push(
            `Passo ${stepCount++}: Para calcular a área da superfície do paralelepípedo, usamos a fórmula S = 2(cl + ch + lh)`,
            `Passo ${stepCount++}: Substituindo os valores: S = 2 × (${compNum} × ${largNum} + ${compNum} × ${altNum} + ${largNum} × ${altNum})`,
            `S = 2 × (${compNum * largNum} + ${compNum * altNum} + ${largNum * altNum})`,
            `S = 2 × ${compNum * largNum + compNum * altNum + largNum * altNum}`,
            `S = ${superficie} unidades quadradas`
          );
          break;
        }

        case 'esfera': {
          if (!state.raio.trim()) {
            dispatch({ type: 'SET_ERROR', message: 'Por favor, insira o raio da esfera.' });
            return;
          }
          const raioNum = parseFloat(state.raio);
          if (isNaN(raioNum) || raioNum <= 0) {
            dispatch({ type: 'SET_ERROR', message: 'O raio deve ser um número positivo.' });
            return;
          }

          superficie = sphereSurfaceArea(raioNum);
          calculationSteps.push(
            `Passo ${stepCount++}: Para calcular a área da superfície da esfera, usamos a fórmula S = 4πr²`,
            `Passo ${stepCount++}: Substituindo o raio: S = 4π × ${raioNum}²`,
            `S = 4 × 3.14159... × ${raioNum * raioNum}`,
            `S = ${superficie} unidades quadradas`
          );
          break;
        }

        case 'cilindro': {
          if (!state.raio.trim() || !state.altura.trim()) {
            dispatch({ type: 'SET_ERROR', message: 'Por favor, insira o raio e a altura do cilindro.' });
            return;
          }
          const raioNum = parseFloat(state.raio);
          const altNum = parseFloat(state.altura);
          if (isNaN(raioNum) || isNaN(altNum) || raioNum <= 0 || altNum <= 0) {
            dispatch({ type: 'SET_ERROR', message: 'O raio e a altura devem ser números positivos.' });
            return;
          }

          superficie = cylinderSurfaceArea(raioNum, altNum);
          calculationSteps.push(
            `Passo ${stepCount++}: Para calcular a área da superfície do cilindro, usamos a fórmula S = 2πr(r + h)`,
            `Passo ${stepCount++}: Substituindo os valores: S = 2π × ${raioNum} × (${raioNum} + ${altNum})`,
            `S = 2 × 3.14159... × ${raioNum} × ${raioNum + altNum}`,
            `S = ${superficie} unidades quadradas`
          );
          break;
        }

        case 'cone': {
          if (!state.raio.trim() || !state.altura.trim()) {
            dispatch({ type: 'SET_ERROR', message: 'Por favor, insira o raio e a altura do cone.' });
            return;
          }
          const raioNum = parseFloat(state.raio);
          const altNum = parseFloat(state.altura);
          if (isNaN(raioNum) || isNaN(altNum) || raioNum <= 0 || altNum <= 0) {
            dispatch({ type: 'SET_ERROR', message: 'O raio e a altura devem ser números positivos.' });
            return;
          }

          const geratriz = Math.sqrt(Math.pow(raioNum, 2) + Math.pow(altNum, 2));
          superficie = coneSurfaceArea(raioNum, altNum);
          calculationSteps.push(
            `Passo ${stepCount++}: Para calcular a área da superfície do cone, primeiro precisamos encontrar a geratriz g`,
            `Passo ${stepCount++}: A geratriz é calculada usando o teorema de Pitágoras: g = √(r² + h²)`,
            `Passo ${stepCount++}: g = √(${raioNum}² + ${altNum}²) = √(${raioNum * raioNum} + ${altNum * altNum}) = ${geratriz.toFixed(2)}`,
            `Passo ${stepCount++}: Agora usamos a fórmula S = πr(r + g)`,
            `Passo ${stepCount++}: Substituindo os valores: S = π × ${raioNum} × (${raioNum} + ${geratriz.toFixed(2)})`,
            `S = 3.14159... × ${raioNum} × ${raioNum + geratriz}`,
            `S = ${superficie} unidades quadradas`
          );
          break;
        }

        case 'piramide': {
          if (!state.ladoBase.trim() || !state.altura.trim()) {
            dispatch({ type: 'SET_ERROR', message: 'Por favor, insira o lado da base e a altura da pirâmide.' });
            return;
          }
          const ladoNum = parseFloat(state.ladoBase);
          const altNum = parseFloat(state.altura);
          if (isNaN(ladoNum) || isNaN(altNum) || ladoNum <= 0 || altNum <= 0) {
            dispatch({ type: 'SET_ERROR', message: 'O lado da base e a altura devem ser números positivos.' });
            return;
          }

          const areaBase = Math.pow(ladoNum, 2);
          const alturaTriangulo = Math.sqrt(Math.pow(altNum, 2) + Math.pow(ladoNum / 2, 2));
          
          superficie = squarePyramidSurfaceArea(ladoNum, altNum);
          calculationSteps.push(
            `Passo ${stepCount++}: Para uma pirâmide quadrada, primeiro calculamos a área da base: A_base = lado²`,
            `Passo ${stepCount++}: A_base = ${ladoNum}² = ${areaBase}`,
            `Passo ${stepCount++}: Em seguida, calculamos a altura dos triângulos laterais usando Pitágoras`,
            `Passo ${stepCount++}: altura_triangulo = √(h² + (lado/2)²) = √(${altNum}² + (${ladoNum}/2)²) = ${alturaTriangulo.toFixed(2)}`,
            `Passo ${stepCount++}: A área de cada face triangular é (lado × altura_triangulo) / 2`,
            `Passo ${stepCount++}: Área_triangular = (${ladoNum} × ${alturaTriangulo.toFixed(2)}) / 2 = ${(ladoNum * alturaTriangulo / 2).toFixed(2)}`,
            `Passo ${stepCount++}: A área total é a área da base mais 4 vezes a área triangular`,
            `Passo ${stepCount++}: S = ${areaBase} + 4 × ${(ladoNum * alturaTriangulo / 2).toFixed(2)}`,
            `S = ${superficie} unidades quadradas`
          );
          break;
        }

        case 'prisma': {
          if (!state.ladoBase.trim() || !state.altura.trim()) {
            dispatch({ type: 'SET_ERROR', message: 'Por favor, insira o lado da base e a altura do prisma.' });
            return;
          }
          const ladoNum = parseFloat(state.ladoBase);
          const altNum = parseFloat(state.altura);
          if (isNaN(ladoNum) || isNaN(altNum) || ladoNum <= 0 || altNum <= 0) {
            dispatch({ type: 'SET_ERROR', message: 'O lado da base e a altura devem ser números positivos.' });
            return;
          }

          const areaBase = (Math.sqrt(3) / 4) * Math.pow(ladoNum, 2);
          const perimetroBase = 3 * ladoNum;
          
          superficie = triangularPrismSurfaceArea(ladoNum, altNum);
          calculationSteps.push(
            `Passo ${stepCount++}: Para um prisma triangular regular, primeiro calculamos a área da base`,
            `Passo ${stepCount++}: A área de um triângulo equilátero é (√3 / 4) × lado²`,
            `Passo ${stepCount++}: A_base = (√3 / 4) × ${ladoNum}² = ${areaBase.toFixed(2)}`,
            `Passo ${stepCount++}: O perímetro da base é 3 × lado = 3 × ${ladoNum} = ${perimetroBase}`,
            `Passo ${stepCount++}: A área lateral é o perímetro da base × altura = ${perimetroBase} × ${altNum} = ${perimetroBase * altNum}`,
            `Passo ${stepCount++}: A área total é 2 × A_base + área lateral`,
            `Passo ${stepCount++}: S = 2 × ${areaBase.toFixed(2)} + ${perimetroBase * altNum}`,
            `S = ${superficie} unidades quadradas`
          );
          break;
        }

        default:
          dispatch({ type: 'SET_ERROR', message: 'Tipo de sólido não reconhecido.' });
          return;
      }

      dispatch({ type: 'SET_RESULT', result: superficie, steps: calculationSteps });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', message: 'Ocorreu um erro ao calcular. Verifique os valores inseridos.' });
    }
  };

  return {
    state,
    dispatch,
    setFieldValue,
    handleSolve,
    applyExample,
    getFilteredExamples
  };
} 