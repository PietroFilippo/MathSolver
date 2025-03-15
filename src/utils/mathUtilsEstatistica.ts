import { roundToDecimals } from './mathUtils';

// ===================================================
// ========== CÁLCULOS ESTATÍSTICOS OTIMIZADOS =======
// ===================================================


// Calcula média, variância e desvio padrão em uma única passagem pelos dados
// Evita recalcular a média múltiplas vezes, otimizando o desempenho
export const calculateStatistics = (numeros: number[]): { 
  media: number, 
  variancia: number, 
  desvioPadrao: number,
  desvioMedio: number 
} => {
  if (numeros.length === 0) {
    return { 
      media: 0, 
      variancia: 0, 
      desvioPadrao: 0,
      desvioMedio: 0
    };
  }
  
  // Calcula a média
  const media = numeros.reduce((acc, curr) => acc + curr, 0) / numeros.length;
  
  // Calcula variância e desvios em uma única passagem
  let somaQuadrados = 0;
  let somaDesvios = 0;
  
  for (const num of numeros) {
    const desvio = num - media;
    somaQuadrados += desvio * desvio;
    somaDesvios += Math.abs(desvio);
  }
  
  const variancia = roundToDecimals(somaQuadrados / numeros.length, 4);
  const desvioPadrao = roundToDecimals(Math.sqrt(variancia), 4);
  const desvioMedio = roundToDecimals(somaDesvios / numeros.length, 4);
  
  return { media, variancia, desvioPadrao, desvioMedio };
};

// ===================================================
// ========== MEDIDAS DE TENDÊNCIA CENTRAL ===========
// ===================================================

// Calcula a mediana de um array de números
// Retorna o valor central após ordenação ou a média dos dois valores centrais
export const calculateMedian = (numeros: number[]): number => {
    if (numeros.length === 0) return 0;
    
    // Ordena os números em ordem crescente
    const ordenados = [...numeros].sort((a, b) => a - b);
    
    const meio = Math.floor(ordenados.length / 2);
    
    if (ordenados.length % 2 === 0) {
        // Se o array tem um número par de elementos, a mediana é a média dos dois valores do meio
        return (ordenados[meio - 1] + ordenados[meio]) / 2;
    } else {
        // Se o array tem um número ímpar de elementos, a mediana é o valor do meio
        return ordenados[meio];
    }
};

// Calcula a moda de um array de números
// Retorna os valores que ocorrem com maior frequência na amostra
export const calculateMode = (numeros: number[]): number[] => {
    if (numeros.length === 0) return [];
    
    // Cria um objeto para contar a frequência de cada número
    const frequencia: { [key: number]: number } = {};
    let maxFrequencia = 0;
    
    // Conta a frequência de cada número
    numeros.forEach(num => {
        frequencia[num] = (frequencia[num] || 0) + 1;
        maxFrequencia = Math.max(maxFrequencia, frequencia[num]);
    });
    
    // Se todos os números aparecem a mesma quantidade de vezes, não há moda
    if (Object.values(frequencia).every(f => f === 1)) {
        return [];
    }
    
    // Retorna todos os números que aparecem com a frequência máxima
    return Object.entries(frequencia)
        .filter(([_, freq]) => freq === maxFrequencia)
        .map(([num, _]) => Number(num))
        .sort((a, b) => a - b);
};

// Calcula a média ponderada de um conjunto de números e seus respectivos pesos
// Retorna a soma dos produtos de cada valor pelo seu peso, dividida pela soma dos pesos
export const calculateWeightedMean = (numeros: number[], pesos: number[]): number => {
    if (numeros.length !== pesos.length || numeros.length === 0) {
        throw new Error('Os arrays de números e pesos devem ter o mesmo tamanho e não podem estar vazios');
    }

    const somaProdutos = numeros.reduce((acc, curr, idx) => acc + (curr * pesos[idx]), 0);
    const somaPesos = pesos.reduce((acc, curr) => acc + curr, 0);

    if (somaPesos === 0) {
        throw new Error('A soma dos pesos não pode ser zero');
    }

    return somaProdutos / somaPesos;
};

// ===================================================
// ========== MEDIDAS DE DISPERSÃO ===================
// ===================================================

// Calcula o Desvio Médio dos valores em relação à média
// Utiliza a função otimizada calcularEstatisticas
export const calculateMeanDeviation = (numeros: number[]): number => {
    if (numeros.length === 0) return 0;
    
    // Utiliza a função otimizada para obter média e desvio
    return calculateStatistics(numeros).desvioMedio;
};

// Calcula a Variância dos valores (média dos quadrados dos desvios)
// Utiliza a função otimizada calcularEstatisticas
export const calculateVariance = (numeros: number[]): number => {
    if (numeros.length === 0) return 0;
    
    // Utiliza a função otimizada
    return calculateStatistics(numeros).variancia;
};

// Calcula o Desvio Padrão (raiz quadrada da variância)
// Utiliza a função otimizada calcularEstatisticas
export const calculateStandardDeviation = (numeros: number[]): number => {
    if (numeros.length === 0) return 0;
    
    // Utiliza a função otimizada
    return calculateStatistics(numeros).desvioPadrao;
};

// Calcula o Coeficiente de Variação (desvio padrão/média * 100%)
// Medida de dispersão relativa que permite comparar dispersões de diferentes conjuntos
export const calculateCoefficientOfVariation = (numeros: number[]): number => {
    if (numeros.length === 0) return 0;
    
    // Obtém todas as estatísticas de uma vez
    const { media, desvioPadrao } = calculateStatistics(numeros);
    
    // Se a média for 0, o coeficiente de variação não pode ser calculado
    if (media === 0) {
        throw new Error('O coeficiente de variação não pode ser calculado quando a média é zero');
    }
    
    return roundToDecimals((desvioPadrao / Math.abs(media)) * 100, 2);
};