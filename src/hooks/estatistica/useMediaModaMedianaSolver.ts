import { useReducer } from 'react';
import { calculateMedian, calculateMode } from '../../utils/mathUtilsEstatistica';
import { roundToDecimals } from '../../utils/mathUtils';

// Definições de tipo
type State = {
  data: string;
  parsedData: number[];
  results: {
    media: number | null;
    mediana: number | null;
    moda: number[] | null;
  };
  steps: string[];
  errorMessage: string | null;
  showExplanation: boolean;
  showConceitoMatematico: boolean;
};

// Tipos de ações
type Action =
  | { type: 'SET_DATA'; data: string }
  | { type: 'RESET_CALCULATION' }
  | { type: 'SET_RESULT'; parsedData: number[]; results: State['results']; steps: string[] }
  | { type: 'SET_ERROR'; message: string }
  | { type: 'TOGGLE_EXPLANATION' }
  | { type: 'TOGGLE_CONCEITO_MATEMATICO' }
  | { type: 'APPLY_EXAMPLE'; example: { data: number[] } };

// Estado inicial
const initialState: State = {
  data: '',
  parsedData: [],
  results: {
    media: null,
    mediana: null,
    moda: null
  },
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
    case 'RESET_CALCULATION':
      return {
        ...state,
        results: { media: null, mediana: null, moda: null },
        steps: [],
        errorMessage: null,
        showExplanation: false
      };
    case 'SET_RESULT':
      return {
        ...state,
        parsedData: action.parsedData,
        results: action.results,
        steps: action.steps,
        errorMessage: null,
        showExplanation: true
      };
    case 'SET_ERROR':
      return {
        ...state,
        errorMessage: action.message,
        results: { media: null, mediana: null, moda: null },
        steps: []
      };
    case 'TOGGLE_EXPLANATION':
      return { ...state, showExplanation: !state.showExplanation };
    case 'TOGGLE_CONCEITO_MATEMATICO':
      return { ...state, showConceitoMatematico: !state.showConceitoMatematico };
    case 'APPLY_EXAMPLE':
      return { ...state, data: action.example.data.join(', ') };
    default:
      return state;
  }
}

export function useCentralTendencySolver() {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Função principal de resolução
  const handleSolve = () => {
    dispatch({ type: 'RESET_CALCULATION' });

    try {
      let data = state.data.trim();
      if (!data) {
        dispatch({ type: 'SET_ERROR', message: 'Por favor, insira algum dado.' });
        return;
      }

      // Parse a string de dados para um array de números
      const parsedData = data
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

      // Calcular a média
      const sum = parsedData.reduce((acc, val) => acc + val, 0);
      const mean = roundToDecimals(sum / parsedData.length, 3);

      // Calcular a mediana
      const median = calculateMedian(parsedData);

      // Calcular a moda
      const mode = calculateMode(parsedData);

      const results = {
        media: mean,
        mediana: median,
        moda: mode
      };

      const steps = generateCentralTendencySteps(parsedData, mean, median, mode);

      dispatch({ type: 'SET_RESULT', parsedData, results, steps });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', message: error instanceof Error ? error.message : 'Erro desconhecido.' });
    }
  };

  // Aplicar um exemplo ao estado atual
  const applyExample = (example: { data: number[] }) => {
    dispatch({ type: 'APPLY_EXAMPLE', example });
  };

  // Retornar o estado e as funções
  return {
    state,
    dispatch,
    handleSolve,
    applyExample
  };
}

// Gerar passos de cálculo
function generateCentralTendencySteps(
  data: number[], 
  media: number, 
  mediana: number, 
  moda: number[] | null
): string[] {
  const calculationSteps: string[] = [];
  let stepCount = 1;
  
  calculationSteps.push(`Equação original: Calcular média, mediana e moda para o conjunto de dados`);
  calculationSteps.push(`Dados originais: ${data.join(', ')}`);
  
  // Média
  calculationSteps.push(`Passo ${stepCount++}: Calculamos a média aritmética`);
  const sum = data.reduce((acc, val) => acc + val, 0);
  calculationSteps.push(`Calculando: soma de todos os valores: ${data.join(' + ')} = ${sum}`);
  calculationSteps.push(`Número de valores: ${data.length}`);
  calculationSteps.push(`Fórmula: Média = Soma dos valores ÷ Número de valores`);
  calculationSteps.push(`Simplificando: Média = ${sum} ÷ ${data.length} = ${media}`);
  
  // Mediana
  calculationSteps.push(`Passo ${stepCount++}: Calculamos a mediana`);
  const ordenados = [...data].sort((a, b) => a - b);
  calculationSteps.push(`Calculando: organizamos os valores em ordem crescente: ${ordenados.join(', ')}`);
  
  if (data.length % 2 === 0) {
    // Caso par
    const pos1 = data.length / 2 - 1;
    const pos2 = data.length / 2;
    calculationSteps.push(`Como o número de elementos é par (${data.length}), a mediana é a média dos dois valores centrais.`);
    calculationSteps.push(`Posições centrais: ${pos1 + 1} e ${pos2 + 1}`);
    calculationSteps.push(`Valores centrais: ${ordenados[pos1]} e ${ordenados[pos2]}`);
    calculationSteps.push(`Simplificando: Mediana = (${ordenados[pos1]} + ${ordenados[pos2]}) ÷ 2 = ${mediana}`);
  } else {
    // Caso ímpar
    const pos = Math.floor(data.length / 2);
    calculationSteps.push(`Como o número de elementos é ímpar (${data.length}), a mediana é o valor central.`);
    calculationSteps.push(`Posição central: ${pos + 1}`);
    calculationSteps.push(`Simplificando: Mediana = ${mediana}`);
  }
  
  // Moda
  calculationSteps.push(`Passo ${stepCount++}: Calculamos a moda`);
  
  // Criar um mapa de frequências
  const freqMap: Record<number, number> = {};
  data.forEach(num => {
    freqMap[num] = (freqMap[num] || 0) + 1;
  });
  
  calculationSteps.push(`Calculando: frequência de cada valor:`);
  Object.keys(freqMap).forEach(key => {
    calculationSteps.push(`Valor ${key}: ${freqMap[Number(key)]} ocorrência(s)`);
  });
  
  if (moda && moda.length > 0) {
    const maxFreq = Math.max(...Object.values(freqMap));
    calculationSteps.push(`Frequência máxima: ${maxFreq} ocorrência(s)`);
    calculationSteps.push(`Resultado: Moda = ${moda.join(', ')} (valores com ${maxFreq} ocorrência(s))`);
  } else {
    calculationSteps.push(`Resultado: Não há moda neste conjunto de dados (todos os valores têm a mesma frequência).`);
  }
  
  // Adicionando resultados finais
  calculationSteps.push('---VERIFICATION_SEPARATOR---');
  calculationSteps.push(`Verificação dos resultados:`);
  calculationSteps.push(`Resultado: A média do conjunto é ${media}`);
  calculationSteps.push(`Resultado: A mediana do conjunto é ${mediana}`);
  if (moda && moda.length > 0) {
    calculationSteps.push(`Resultado: A moda do conjunto é ${moda.join(', ')}`);
  } else {
    calculationSteps.push(`Resultado: O conjunto não possui moda`);
  }
  
  return calculationSteps;
} 