import { useReducer } from 'react';
import { calculateStatistics } from '../../utils/mathUtilsEstatistica';
import { roundToDecimals } from '../../utils/mathUtils';

// Definições de tipo
export type DispersionType = 'desvioMedio' | 'variancia' | 'desvioPadrao';

// Interface de estado
type State = {
  data: string;
  parsedData: number[];
  dispersionType: DispersionType;
  result: number | null;
  statistics: {
    media: number;
    variancia: number;
    desvioPadrao: number;
    desvioMedio: number;
  } | null;
  steps: string[];
  errorMessage: string | null;
  showExplanation: boolean;
  showConceitoMatematico: boolean;
};

// Tipos de ações
type Action =
  | { type: 'SET_DATA'; data: string }
  | { type: 'SET_DISPERSION_TYPE'; dispersionType: DispersionType }
  | { type: 'RESET_CALCULATION' }
  | { type: 'SET_RESULT'; parsedData: number[]; result: number; statistics: State['statistics']; steps: string[] }
  | { type: 'SET_ERROR'; message: string }
  | { type: 'TOGGLE_EXPLANATION' }
  | { type: 'TOGGLE_CONCEITO_MATEMATICO' }
  | { type: 'APPLY_EXAMPLE'; example: { data: number[]; type: DispersionType } };

// Estado inicial
const initialState: State = {
  data: '',
  parsedData: [],
  dispersionType: 'desvioMedio',
  result: null,
  statistics: null,
  steps: [],
  errorMessage: null,
  showExplanation: false,
  showConceitoMatematico: true,
};

// Função reducer
function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_DATA':
      return { ...state, data: action.data };
    case 'SET_DISPERSION_TYPE':
      return { ...state, dispersionType: action.dispersionType };
    case 'RESET_CALCULATION':
      return {
        ...state,
        result: null,
        steps: [],
        errorMessage: null,
        showExplanation: false
      };
    case 'SET_RESULT':
      return {
        ...state,
        parsedData: action.parsedData,
        result: action.result,
        statistics: action.statistics,
        steps: action.steps,
        errorMessage: null,
        showExplanation: true
      };
    case 'SET_ERROR':
      return {
        ...state,
        errorMessage: action.message,
        result: null,
        statistics: null,
        steps: []
      };
    case 'TOGGLE_EXPLANATION':
      return { ...state, showExplanation: !state.showExplanation };
    case 'TOGGLE_CONCEITO_MATEMATICO':
      return { ...state, showConceitoMatematico: !state.showConceitoMatematico };
    case 'APPLY_EXAMPLE':
      return {
        ...state,
        data: action.example.data.join(', '),
        dispersionType: action.example.type
      };
    default:
      return state;
  }
}

export function useDispersionSolver() {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Função principal de resolução
  const handleSolve = () => {
    dispatch({ type: 'RESET_CALCULATION' });

    try {
      const dataStr = state.data.trim();
      if (!dataStr) {
        dispatch({ type: 'SET_ERROR', message: 'Por favor, insira algum dado.' });
        return;
      }

      // Parse a string de dados para um array de números
      const parsedData = dataStr
        .split(/[,;\s]+/)
        .filter(item => item.trim() !== '')
        .map(item => {
          const num = parseFloat(item.trim());
          if (isNaN(num)) {
            throw new Error(`O valor '${item}' não é um número válido.`);
          }
          return num;
        });

      if (parsedData.length === 0) {
        dispatch({ type: 'SET_ERROR', message: 'Nenhum número válido foi inserido.' });
        return;
      }

      if (parsedData.length === 1) {
        dispatch({ type: 'SET_ERROR', message: 'É necessário mais de um valor para calcular medidas de dispersão.' });
        return;
      }

      // Calcular estatísticas
      const stats = calculateStatistics(parsedData);
      
      // Obter o resultado específico com base no tipo de dispersão selecionado
      const result = stats[state.dispersionType];
      
      // Gerar passos para o tipo de dispersão selecionado
      const steps = generateDispersionSteps(parsedData, stats, state.dispersionType);

      // Enviar o resultado
      dispatch({
        type: 'SET_RESULT',
        parsedData,
        result,
        statistics: stats,
        steps
      });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', message: error instanceof Error ? error.message : 'Erro desconhecido.' });
    }
  };

  // Aplicar um exemplo ao estado atual
  const applyExample = (example: { data: number[]; type: DispersionType }) => {
    dispatch({ type: 'APPLY_EXAMPLE', example });
  };

  // Definir o tipo de dispersão
  const setDispersionType = (dispersionType: DispersionType) => {
    dispatch({ type: 'SET_DISPERSION_TYPE', dispersionType });
    
    // Se já temos estatísticas calculadas, atualizar os passos e o resultado
    if (state.statistics) {
      const steps = generateDispersionSteps(state.parsedData, state.statistics, dispersionType);
      dispatch({
        type: 'SET_RESULT',
        parsedData: state.parsedData,
        result: state.statistics[dispersionType],
        statistics: state.statistics,
        steps
      });
    }
  };

  // Retornar o estado e as funções
  return {
    state,
    dispatch,
    handleSolve,
    applyExample,
    setDispersionType
  };
}

// Gerar passos de cálculo para medidas de dispersão
function generateDispersionSteps(data: number[], stats: State['statistics'], type: DispersionType): string[] {
  if (!stats) return [];
  
  const calculationSteps: string[] = [];
  let stepCount = 1;
  
  calculationSteps.push(`Equação original: Calcular ${type === 'desvioMedio' ? 'o desvio médio' : type === 'variancia' ? 'a variância' : 'o desvio padrão'} para o conjunto de dados`);
  calculationSteps.push(`Dados originais: ${data.join(', ')}`);
  
  calculationSteps.push(`Passo ${stepCount++}: Calculamos a média aritmética`);
  const somaValores = data.reduce((acc, val) => acc + val, 0);
  calculationSteps.push(`Calculando: soma dos valores: ${data.join(' + ')} = ${somaValores}`);
  calculationSteps.push(`Simplificando: média = ${somaValores} ÷ ${data.length} = ${roundToDecimals(stats.media, 3)}`);
  
  if (type === 'desvioMedio') {
    calculationSteps.push(`Passo ${stepCount++}: Calculamos o desvio médio`);
    calculationSteps.push(`Fórmula: Desvio médio = Σ|xᵢ - μ| ÷ n, onde μ é a média e n é o número de elementos`);
    calculationSteps.push('Calculando: para cada valor, o módulo da diferença entre o valor e a média:');
    
    let desviosStr = '';
    let somaDesvios = 0;
    
    for (const valor of data) {
      const desvio = Math.abs(valor - stats.media);
      somaDesvios += desvio;
      desviosStr += `|${valor} - ${roundToDecimals(stats.media, 3)}| = ${roundToDecimals(desvio, 3)}, `;
    }
    
    calculationSteps.push(desviosStr.slice(0, -2));
    calculationSteps.push(`Calculando: soma dos desvios absolutos: ${data.map(v => `|${v} - ${roundToDecimals(stats.media, 3)}|`).join(' + ')} = ${roundToDecimals(somaDesvios, 3)}`);
    calculationSteps.push(`Simplificando: Desvio médio = ${roundToDecimals(somaDesvios, 3)} ÷ ${data.length} = ${roundToDecimals(stats.desvioMedio, 3)}`);
    
    // Verificação
    calculationSteps.push('---VERIFICATION_SEPARATOR---');
    calculationSteps.push(`Verificação do resultado:`);
    calculationSteps.push(`Calculando: média dos valores = ${roundToDecimals(stats.media, 3)}`);
    calculationSteps.push(`Calculando: média dos desvios absolutos = ${roundToDecimals(somaDesvios, 3)} ÷ ${data.length} = ${roundToDecimals(stats.desvioMedio, 3)}`);
    calculationSteps.push(`Verificação concluída: O desvio médio é ${roundToDecimals(stats.desvioMedio, 3)}`);
  
  } else if (type === 'variancia') {
    calculationSteps.push(`Passo ${stepCount++}: Calculamos a variância`);
    calculationSteps.push(`Fórmula: Variância = Σ(xᵢ - μ)² ÷ n, onde μ é a média e n é o número de elementos`);
    calculationSteps.push('Calculando: para cada valor, o quadrado da diferença entre o valor e a média:');
    
    let desviosQuadradosStr = '';
    let somaDesviosQuadrados = 0;
    
    for (const valor of data) {
      const desvioQuad = Math.pow(valor - stats.media, 2);
      somaDesviosQuadrados += desvioQuad;
      desviosQuadradosStr += `(${valor} - ${roundToDecimals(stats.media, 3)})² = ${roundToDecimals(desvioQuad, 3)}, `;
    }
    
    calculationSteps.push(desviosQuadradosStr.slice(0, -2));
    calculationSteps.push(`Calculando: soma dos quadrados dos desvios: ${data.map(v => `(${v} - ${roundToDecimals(stats.media, 3)})²`).join(' + ')} = ${roundToDecimals(somaDesviosQuadrados, 3)}`);
    calculationSteps.push(`Simplificando: Variância = ${roundToDecimals(somaDesviosQuadrados, 3)} ÷ ${data.length} = ${roundToDecimals(stats.variancia, 3)}`);
    
    // Verificação
    calculationSteps.push('---VERIFICATION_SEPARATOR---');
    calculationSteps.push(`Verificação do resultado:`);
    calculationSteps.push(`Calculando: média dos valores = ${roundToDecimals(stats.media, 3)}`);
    calculationSteps.push(`Calculando: soma dos quadrados dos desvios = ${roundToDecimals(somaDesviosQuadrados, 3)}`);
    calculationSteps.push(`Simplificando: ${roundToDecimals(somaDesviosQuadrados, 3)} ÷ ${data.length} = ${roundToDecimals(stats.variancia, 3)}`);
    calculationSteps.push(`Verificação concluída: A variância é ${roundToDecimals(stats.variancia, 3)}`);
  
  } else if (type === 'desvioPadrao') {
    calculationSteps.push(`Passo ${stepCount++}: Calculamos a variância`);
    calculationSteps.push(`Fórmula: Variância = Σ(xᵢ - μ)² ÷ n, onde μ é a média e n é o número de elementos`);
    
    let desviosQuadradosStr = '';
    let somaDesviosQuadrados = 0;
    
    for (const valor of data) {
      const desvioQuad = Math.pow(valor - stats.media, 2);
      somaDesviosQuadrados += desvioQuad;
      desviosQuadradosStr += `(${valor} - ${roundToDecimals(stats.media, 3)})² = ${roundToDecimals(desvioQuad, 3)}, `;
    }
    
    calculationSteps.push('Calculando: para cada valor, o quadrado da diferença entre o valor e a média:');
    calculationSteps.push(desviosQuadradosStr.slice(0, -2));
    calculationSteps.push(`Calculando: soma dos quadrados dos desvios: ${roundToDecimals(somaDesviosQuadrados, 3)}`);
    calculationSteps.push(`Simplificando: Variância = ${roundToDecimals(somaDesviosQuadrados, 3)} ÷ ${data.length} = ${roundToDecimals(stats.variancia, 3)}`);
    
    calculationSteps.push(`Passo ${stepCount++}: Calculamos o desvio padrão (raiz quadrada da variância)`);
    calculationSteps.push(`Fórmula: Desvio padrão = √Variância`);
    calculationSteps.push(`Simplificando: Desvio padrão = √${roundToDecimals(stats.variancia, 3)} = ${roundToDecimals(stats.desvioPadrao, 3)}`);
    
    // Verificação
    calculationSteps.push('---VERIFICATION_SEPARATOR---');
    calculationSteps.push(`Verificação do resultado:`);
    calculationSteps.push(`Calculando: média dos valores = ${roundToDecimals(stats.media, 3)}`);
    calculationSteps.push(`Calculando: variância = ${roundToDecimals(stats.variancia, 3)}`);
    calculationSteps.push(`Verificando: desvio padrão² = ${roundToDecimals(Math.pow(stats.desvioPadrao, 2), 3)} ≈ ${roundToDecimals(stats.variancia, 3)}`);
    calculationSteps.push(`Verificação concluída: O desvio padrão é ${roundToDecimals(stats.desvioPadrao, 3)}`);
  }
  
  return calculationSteps;
} 