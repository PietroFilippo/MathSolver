import { useReducer } from 'react';
import { formatInterval } from '../../utils/mathUtils';
import { 
  generateTrigonometricFunctionPoints,
  generateGraphExplanationSteps,
  parseInterval,
  getTrigonometricGraphExamples
} from '../../utils/mathUtilsTrigonometria/index';
import { useTranslation } from 'react-i18next';

// Definições de tipo
export type GraphType = 'seno' | 'cosseno' | 'tangente' | 'personalizado';

// Funções auxiliares
const processPiValue = (value: string): number => {
  try {
    // Se o valor contém π ou pi, processá-lo com a função parseIntervalo
    if (value.includes('π') || value.toLowerCase().includes('pi')) {
      // Encapsular em um intervalo temporário para usar parseIntervalo
      const result = parseInterval(`0,${value}`);
      return result[1]; // Retornar o segundo valor do intervalo
    }
    // Caso contrário, converter normalmente para número
    return parseFloat(value);
  } catch (error) {
    console.error("Erro ao processar valor com pi:", error);
    return parseFloat(value); // Fallback para parseFloat padrão
  }
};

// Interface de estado
interface GraficosTrigonometricosState {
  funcao: string;
  graphType: GraphType;
  amplitude: string;
  period: string;
  phaseShift: string;
  verticalShift: string;
  interval: string;
  result: string | null;
  error: string | null;
  points: Array<{ x: number; y: number }>;
  solutionSteps: string[];
  showExplanation: boolean;
  showExpandedGraph: boolean;
  showConceitoMatematico: boolean;
}

// Tipos de ações
type GraficosTrigonometricosAction = 
  | { type: 'SET_FUNCTION'; value: string }
  | { type: 'SET_GRAPH_TYPE'; value: GraphType }
  | { type: 'SET_AMPLITUDE'; value: string }
  | { type: 'SET_PERIOD'; value: string }
  | { type: 'SET_PHASE_SHIFT'; value: string }
  | { type: 'SET_VERTICAL_SHIFT'; value: string }
  | { type: 'SET_INTERVAL'; value: string }
  | { type: 'SET_RESULT'; result: string; points: Array<{ x: number; y: number }>; steps: string[] }
  | { type: 'SET_ERROR'; message: string }
  | { type: 'TOGGLE_EXPLANATION' }
  | { type: 'TOGGLE_EXPANDED_GRAPH' }
  | { type: 'TOGGLE_CONCEITO_MATEMATICO' }
  | { type: 'APPLY_EXAMPLE'; example: any }
  | { type: 'RESET' };

// Estado inicial
const initialState: GraficosTrigonometricosState = {
  funcao: '',
  graphType: 'seno',
  amplitude: '1',
  period: '1',
  phaseShift: '0',
  verticalShift: '0',
  interval: '0,2π',
  result: null,
  error: null,
  points: [],
  solutionSteps: [],
  showExplanation: true,
  showExpandedGraph: false,
  showConceitoMatematico: true
};

// Função reducer
function graficosTrigonometricosReducer(
  state: GraficosTrigonometricosState,
  action: GraficosTrigonometricosAction
): GraficosTrigonometricosState {
  switch (action.type) {
    case 'SET_FUNCTION':
      return { ...state, funcao: action.value };
    case 'SET_GRAPH_TYPE':
      return { ...state, graphType: action.value };
    case 'SET_AMPLITUDE':
      return { ...state, amplitude: action.value };
    case 'SET_PERIOD':
      return { ...state, period: action.value };
    case 'SET_PHASE_SHIFT':
      return { ...state, phaseShift: action.value };
    case 'SET_VERTICAL_SHIFT':
      return { ...state, verticalShift: action.value };
    case 'SET_INTERVAL':
      return { ...state, interval: action.value };
    case 'SET_RESULT':
      return {
        ...state,
        result: action.result,
        points: action.points,
        solutionSteps: action.steps,
        error: null,
        showExpandedGraph: false
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.message,
        result: null,
        points: [],
        solutionSteps: []
      };
    case 'TOGGLE_EXPLANATION':
      return { ...state, showExplanation: !state.showExplanation };
    case 'TOGGLE_EXPANDED_GRAPH':
      return { ...state, showExpandedGraph: !state.showExpandedGraph };
    case 'TOGGLE_CONCEITO_MATEMATICO':
      return { ...state, showConceitoMatematico: !state.showConceitoMatematico };
    case 'APPLY_EXAMPLE':
      const example = action.example;
      const newState = { 
        ...state,
        graphType: example.type,
        result: null,
        points: [],
        solutionSteps: [],
        error: null
      };
      
      if (example.type === 'personalizado' && example.funcaoPersonalizada) {
        newState.funcao = example.funcaoPersonalizada;
      } else {
        // Definir parâmetros da função padrão
        newState.amplitude = example.amplitude.toString();
        newState.period = example.periodo.toString();
        newState.phaseShift = example.defasagem.toString();
        newState.verticalShift = example.deslocamentoVertical.toString();
      }
      
      // Definir intervalo
      if (example.interval) {
        newState.interval = `${example.interval[0]},${example.interval[1]}`;
      }
      
      return newState;
    case 'RESET':
      return {
        ...state,
        result: null,
        points: [],
        solutionSteps: [],
        error: null,
        showExpandedGraph: false
      };
    default:
      return state;
  }
}

export function useGraficosTrigonometricosSolver() {
  const [state, dispatch] = useReducer(graficosTrigonometricosReducer, initialState);
  const { t } = useTranslation(['trigonometry', 'translation']);

  // Obter exemplos com base no estado atual
  const getFilteredExamples = () => {
    return getTrigonometricGraphExamples(t).filter(example => 
      example.type === state.graphType || example.type === 'personalizado'
    );
  };

  // Aplicar um exemplo ao estado atual
  const applyExample = (example: any) => {
    dispatch({ type: 'APPLY_EXAMPLE', example });
  };

  // Função principal de resolução
  const handleSolve = () => {
    // Limpar resultados anteriores
    dispatch({ type: 'RESET' });
    
    try {
      // Validar parâmetros com base no tipo de gráfico
      if (state.graphType === 'personalizado') {
        // Validar função personalizada
        if (!state.funcao.trim()) {
          dispatch({ type: 'SET_ERROR', message: t('trigonometry:trigonometric_graphs.errors.empty_function') });
          return;
        }
        
        // Expressão regular complexa para detectar funções trigonométricas em expressões
        const temFuncaoTrig = /(\d+)?(sen|cos|tan|cot|sec|csc|sin|tg|cotg)(\^?\d+)?\s*\(/i.test(state.funcao) || 
                             /\b(sen|cos|tan|cot|sec|csc|sin|tg|cotg)(\^?\d+)?\s*\(/i.test(state.funcao);
        
        if (!temFuncaoTrig) {
          dispatch({ type: 'SET_ERROR', message: t('trigonometry:trigonometric_graphs.errors.no_trig_function') });
          return;
        }
      } else {
        // Validar parâmetros para funções pré-definidas
        try {
          // Processar valores que podem conter π
          const a = processPiValue(state.amplitude);
          const b = processPiValue(state.period);
          const c = processPiValue(state.phaseShift);
          const d = processPiValue(state.verticalShift);
          
          if (isNaN(a) || isNaN(b) || isNaN(c) || isNaN(d)) {
            dispatch({ type: 'SET_ERROR', message: t('trigonometry:trigonometric_graphs.errors.invalid_parameters') });
            return;
          }
          
          if (b === 0) {
            dispatch({ type: 'SET_ERROR', message: t('trigonometry:trigonometric_graphs.errors.zero_period') });
            return;
          }
        } catch (error) {
          dispatch({ type: 'SET_ERROR', message: t('trigonometry:trigonometric_graphs.errors.parameter_processing', { 
            message: error instanceof Error ? error.message : String(error) 
          })});
          return;
        }
      }
      
      // Verificar e processar o intervalo
      let [start, end] = parseInterval(state.interval);
      
      if (start >= end) {
        dispatch({ type: 'SET_ERROR', message: t('trigonometry:trigonometric_graphs.errors.invalid_interval') });
        return;
      }
      
      // Gerar pontos para o gráfico
      const a = processPiValue(state.amplitude);
      const b = processPiValue(state.period);
      const c = processPiValue(state.phaseShift);
      const d = processPiValue(state.verticalShift);
      
      const pontosFuncao = generateTrigonometricFunctionPoints(
        state.graphType,
        [start, end],
        a,
        b,
        c,
        d,
        state.funcao
      );
      
      if (pontosFuncao.length === 0) {
        dispatch({ type: 'SET_ERROR', message: t('trigonometry:trigonometric_graphs.errors.no_points_generated') });
        return;
      }
      
      // Gerar passos explicativos
      const steps = generateGraphExplanationSteps(
        state.graphType,
        [start, end],
        a,
        b,
        c,
        d,
        state.funcao,
        t
      );
      
      // Formatar o texto do resultado
      let resultText = '';
      
      if (state.graphType === 'personalizado') {
        resultText = t('trigonometry:trigonometric_graphs.results.custom_function', { 
          function: state.funcao,
          interval_start: formatInterval(start),
          interval_end: formatInterval(end)
        });
      } else {
        resultText = t('trigonometry:trigonometric_graphs.results.standard_function', { 
          function: t(`trigonometry:trigonometric_graphs.function_names.${state.graphType}`),
          amplitude: a,
          period: b,
          phase_shift: c,
          vertical_shift: d,
          interval_start: formatInterval(start),
          interval_end: formatInterval(end)
        });
      }
      
      dispatch({ 
        type: 'SET_RESULT', 
        result: resultText, 
        points: pontosFuncao, 
        steps: steps 
      });
    } catch (error) {
      console.error("Erro ao gerar gráfico:", error);
      dispatch({ type: 'SET_ERROR', message: t('trigonometry:trigonometric_graphs.errors.graph_generation', {
        message: error instanceof Error ? error.message : String(error)
      })});
    }
  };

  // Função para formatar os valores do eixo X
  const formatAxisX = (valor: number) => {
    return formatInterval(valor);
  };

  // Função para obter domínio do eixo Y (min e max)
  const obtainDomainY = (): [number, number] => {
    if (state.points.length === 0) {
      return [-2, 2]; // Valores padrão
    }
    
    let min = Number.MAX_VALUE;
    let max = Number.MIN_VALUE;
    
    state.points.forEach(point => {
      if (point.y < min) min = point.y;
      if (point.y > max) max = point.y;
    });
    
    // Adicionar margem de 10%
    const margin = (max - min) * 0.1;
    
    // Em funções como seno e cosseno, é melhor ter o eixo Y simétrico
    if (state.graphType === 'seno' || state.graphType === 'cosseno') {
      const absMax = Math.max(Math.abs(min), Math.abs(max));
      return [-absMax - margin, absMax + margin];
    }
    
    return [min - margin, max + margin];
  };

  // Retornar o estado e as funções
  return {
    state,
    dispatch,
    getFilteredExamples,
    applyExample,
    handleSolve,
    formatAxisX,
    obtainDomainY
  };
} 