import { useReducer } from 'react';
import {
  cubeVolume,
  cuboidVolume,
  sphereVolume,
  cylinderVolume,
  coneVolume,
  pyramidVolume,
  prismVolume,
  getVolumeExamples
} from '../../utils/mathUtilsGeometria';

// Definições de tipo
export type Solido = 'cubo' | 'paralelepipedo' | 'esfera' | 'cilindro' | 'cone' | 'piramide' | 'prisma';

// Interface de estado
interface VolumeSolidosState {
  solido: Solido;
  aresta: string;
  comprimento: string;
  largura: string;
  altura: string;
  raio: string;
  raioBase: string;
  areaBase: string;
  result: number | null;
  steps: string[];
  errorMessage: string;
  showExplanation: boolean;
  showConceitoMatematico: boolean;
}

// Tipos de ações
type VolumeSolidosAction =
  | { type: 'SET_SOLIDO'; value: Solido }
  | { type: 'SET_ARESTA'; value: string }
  | { type: 'SET_COMPRIMENTO'; value: string }
  | { type: 'SET_LARGURA'; value: string }
  | { type: 'SET_ALTURA'; value: string }
  | { type: 'SET_RAIO'; value: string }
  | { type: 'SET_RAIO_BASE'; value: string }
  | { type: 'SET_AREA_BASE'; value: string }
  | { type: 'SET_RESULT'; result: number; steps: string[] }
  | { type: 'SET_ERROR'; message: string }
  | { type: 'TOGGLE_EXPLANATION' }
  | { type: 'TOGGLE_CONCEITO_MATEMATICO' }
  | { type: 'RESET' }
  | { type: 'APPLY_EXAMPLE'; values: Record<string, number> };

// Estado inicial
const initialState: VolumeSolidosState = {
  solido: 'cubo',
  aresta: '',
  comprimento: '',
  largura: '',
  altura: '',
  raio: '',
  raioBase: '',
  areaBase: '',
  result: null,
  steps: [],
  errorMessage: '',
  showExplanation: true,
  showConceitoMatematico: true
};

// Função reducer
function volumeSolidosReducer(state: VolumeSolidosState, action: VolumeSolidosAction): VolumeSolidosState {
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
    case 'SET_RAIO_BASE':
      return { ...state, raioBase: action.value };
    case 'SET_AREA_BASE':
      return { ...state, areaBase: action.value };
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
      newState.raioBase = '';
      newState.areaBase = '';
      
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
          case 'raioBase':
            newState.raioBase = value.toString();
            break;
          case 'areaBase':
            newState.areaBase = value.toString();
            break;
        }
      }
      return newState;
    default:
      return state;
  }
}

export function useVolumeSolidosSolver() {
  const [state, dispatch] = useReducer(volumeSolidosReducer, initialState);

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
        case 'raioBase':
          dispatch({ type: 'SET_RAIO_BASE', value: validValue });
          break;
        case 'areaBase':
          dispatch({ type: 'SET_AREA_BASE', value: validValue });
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
      let volume: number;
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

          volume = cubeVolume(arestaNum);
          calculationSteps.push(
            `Passo ${stepCount++}: Para calcular o volume do cubo, usamos a fórmula V = a³`,
            `Passo ${stepCount++}: Substituindo a aresta: V = ${arestaNum}³`,
            `V = ${arestaNum} × ${arestaNum} × ${arestaNum}`,
            `V = ${volume} unidades cúbicas`
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

          volume = cuboidVolume(compNum, largNum, altNum);
          calculationSteps.push(
            `Passo ${stepCount++}: Para calcular o volume do paralelepípedo, usamos a fórmula V = c × l × h`,
            `Passo ${stepCount++}: Substituindo os valores: V = ${compNum} × ${largNum} × ${altNum}`,
            `V = ${compNum * largNum * altNum} unidades cúbicas`
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

          volume = sphereVolume(raioNum);
          calculationSteps.push(
            `Passo ${stepCount++}: Para calcular o volume da esfera, usamos a fórmula V = (4/3)πr³`,
            `Passo ${stepCount++}: Substituindo o raio: V = (4/3)π × ${raioNum}³`,
            `V = (4/3) × ${Math.PI.toFixed(4)} × ${raioNum}³`,
            `V = (4/3) × ${Math.PI.toFixed(4)} × ${Math.pow(raioNum, 3).toFixed(4)}`,
            `V = ${volume} unidades cúbicas`
          );
          break;
        }

        case 'cilindro': {
          if (!state.raioBase.trim() || !state.altura.trim()) {
            dispatch({ type: 'SET_ERROR', message: 'Por favor, insira o raio da base e a altura do cilindro.' });
            return;
          }
          const raioBaseNum = parseFloat(state.raioBase);
          const altCilNum = parseFloat(state.altura);
          if (isNaN(raioBaseNum) || isNaN(altCilNum) || raioBaseNum <= 0 || altCilNum <= 0) {
            dispatch({ type: 'SET_ERROR', message: 'O raio da base e a altura devem ser números positivos.' });
            return;
          }

          volume = cylinderVolume(raioBaseNum, altCilNum);
          calculationSteps.push(
            `Passo ${stepCount++}: Para calcular o volume do cilindro, usamos a fórmula V = πr²h`,
            `Passo ${stepCount++}: Substituindo os valores: V = π × ${raioBaseNum}² × ${altCilNum}`,
            `V = ${Math.PI.toFixed(4)} × ${Math.pow(raioBaseNum, 2).toFixed(4)} × ${altCilNum}`,
            `V = ${volume} unidades cúbicas`
          );
          break;
        }

        case 'cone': {
          if (!state.raioBase.trim() || !state.altura.trim()) {
            dispatch({ type: 'SET_ERROR', message: 'Por favor, insira o raio da base e a altura do cone.' });
            return;
          }
          const raioBaseConNum = parseFloat(state.raioBase);
          const altConNum = parseFloat(state.altura);
          if (isNaN(raioBaseConNum) || isNaN(altConNum) || raioBaseConNum <= 0 || altConNum <= 0) {
            dispatch({ type: 'SET_ERROR', message: 'O raio da base e a altura devem ser números positivos.' });
            return;
          }

          volume = coneVolume(raioBaseConNum, altConNum);
          calculationSteps.push(
            `Passo ${stepCount++}: Para calcular o volume do cone, usamos a fórmula V = (1/3)πr²h`,
            `Passo ${stepCount++}: Substituindo os valores: V = (1/3)π × ${raioBaseConNum}² × ${altConNum}`,
            `V = (1/3) × ${Math.PI.toFixed(4)} × ${Math.pow(raioBaseConNum, 2).toFixed(4)} × ${altConNum}`,
            `V = ${volume} unidades cúbicas`
          );
          break;
        }

        case 'piramide': {
          if (!state.areaBase.trim() || !state.altura.trim()) {
            dispatch({ type: 'SET_ERROR', message: 'Por favor, insira a área da base e a altura da pirâmide.' });
            return;
          }
          const areaBaseNum = parseFloat(state.areaBase);
          const altPirNum = parseFloat(state.altura);
          if (isNaN(areaBaseNum) || isNaN(altPirNum) || areaBaseNum <= 0 || altPirNum <= 0) {
            dispatch({ type: 'SET_ERROR', message: 'A área da base e a altura devem ser números positivos.' });
            return;
          }

          volume = pyramidVolume(areaBaseNum, altPirNum);
          calculationSteps.push(
            `Passo ${stepCount++}: Para calcular o volume da pirâmide, usamos a fórmula V = (1/3)Abh`,
            `Passo ${stepCount++}: Substituindo os valores: V = (1/3) × ${areaBaseNum} × ${altPirNum}`,
            `V = (1/3) × ${areaBaseNum * altPirNum}`,
            `V = ${volume} unidades cúbicas`
          );
          break;
        }

        case 'prisma': {
          if (!state.areaBase.trim() || !state.altura.trim()) {
            dispatch({ type: 'SET_ERROR', message: 'Por favor, insira a área da base e a altura do prisma.' });
            return;
          }
          const areaBasePrismaNum = parseFloat(state.areaBase);
          const altPrismaNum = parseFloat(state.altura);
          if (isNaN(areaBasePrismaNum) || isNaN(altPrismaNum) || areaBasePrismaNum <= 0 || altPrismaNum <= 0) {
            dispatch({ type: 'SET_ERROR', message: 'A área da base e a altura devem ser números positivos.' });
            return;
          }

          volume = prismVolume(areaBasePrismaNum, altPrismaNum);
          calculationSteps.push(
            `Passo ${stepCount++}: Para calcular o volume do prisma, usamos a fórmula V = Abh`,
            `Passo ${stepCount++}: Substituindo os valores: V = ${areaBasePrismaNum} × ${altPrismaNum}`,
            `V = ${volume} unidades cúbicas`
          );
          break;
        }
      }

      dispatch({ type: 'SET_RESULT', result: volume!, steps: calculationSteps });

    } catch (error) {
      dispatch({ type: 'SET_ERROR', message: 'Ocorreu um erro ao calcular o volume.' });
    }
  };

  // Retornar o estado e as funções
  return {
    state,
    dispatch,
    setFieldValue,
    handleSolve,
    applyExample,
    getFilteredExamples: () => getVolumeExamples(state.solido)
  };
} 