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

// ===================================================
// ================= EXEMPLOS ÚTEIS =================
// ===================================================

// Fornece exemplos para a calculadora de Medidas de Dispersão
export const getDispersionExamples = (): Array<{ data: number[], type: 'desvioMedio' | 'variancia' | 'desvioPadrao', description: string }> => {
    return [
        { data: [10, 20, 30, 40, 50], type: 'desvioMedio', description: "Dados uniformes (10, 20, 30, 40, 50)" },
        { data: [100, 100, 100, 100, 105], type: 'desvioMedio', description: "Dados com pouca variação" },
        { data: [10, 12, 23, 23, 16, 23, 21, 16], type: 'desvioMedio', description: "Dados com valores repetidos" },
        { data: [5, 10, 15, 20, 25, 30, 35], type: 'variancia', description: "Progressão aritmética" },
        { data: [2, 4, 8, 16, 32], type: 'variancia', description: "Progressão geométrica" },
        { data: [7, 8, 9, 10, 11, 12, 13], type: 'variancia', description: "Baixa variância" },
        { data: [10, 30, 50, 70, 90], type: 'desvioPadrao', description: "Dados espaçados uniformemente" },
        { data: [15, 70, 85, 90, 95, 110, 120], type: 'desvioPadrao', description: "Dados com outliers" },
        { data: [42, 42, 42, 42, 42, 42], type: 'desvioPadrao', description: "Sem dispersão (todos iguais)" },
        { data: [3, 7, 8, 5, 12, 14, 21, 13, 18], type: 'desvioPadrao', description: "Dados variados" }
    ];
};

// Fornece exemplos para a calculadora de Média, Moda e Mediana
export const getCentralTendencyExamples = (): Array<{ data: number[], description: string }> => {
    return [
        { data: [1, 2, 3, 4, 5], description: "Sequência simples (1-5)" },
        { data: [10, 20, 30, 40, 50], description: "Múltiplos de 10" },
        { data: [2, 2, 3, 4, 5, 6, 7], description: "Moda única (2)" },
        { data: [1, 2, 2, 3, 3, 4, 5], description: "Bimodal (2,3)" },
        { data: [5, 10, 15, 20, 25], description: "Média = Mediana (15)" },
        { data: [1, 1, 1, 10, 12, 15], description: "Distribuição assimétrica" },
        { data: [7, 8, 9, 10, 11, 12, 13], description: "Distribuição simétrica" },
        { data: [10, 15, 15, 15, 20, 20, 25], description: "Moda distinta (15)" },
        { data: [22, 33, 55, 66, 77], description: "Sem moda (todos diferentes)" },
        { data: [100, 200, 300, 400, 500, 9999], description: "Com outlier (9999)" }
    ];
};

// Fornece exemplos para a calculadora de Média Ponderada
export const getWeightedMeanExamples = (): Array<{ values: number[], weights: number[], description: string }> => {
    return [
        { values: [7, 8, 9, 10], weights: [1, 1, 1, 1], description: "Notas iguais (média aritmética)" },
        { values: [7, 8, 9, 10], weights: [1, 2, 3, 4], description: "Notas com pesos crescentes" },
        { values: [7, 8, 9, 10], weights: [4, 3, 2, 1], description: "Notas com pesos decrescentes" },
        { values: [3, 7, 8, 10], weights: [1, 2, 3, 4], description: "Prova com pesos diferentes" },
        { values: [20, 25, 30, 35, 40], weights: [0.1, 0.2, 0.4, 0.2, 0.1], description: "Produtos com pesos percentuais" },
        { values: [75, 80, 90, 65, 85], weights: [2, 3, 5, 1, 4], description: "Avaliações acadêmicas" }
    ];
};

// Fornece exemplos para a calculadora de Coeficiente de Variação
export const getCoefficientOfVariationExamples = (): Array<{ data: number[], description: string }> => {
    return [
        { data: [10, 11, 12, 13, 14], description: "Pouca dispersão" },
        { data: [5, 10, 15, 20, 25, 30], description: "Média dispersão" },
        { data: [5, 20, 50, 100, 200], description: "Alta dispersão" },
        { data: [98, 99, 100, 101, 102], description: "Notas homogêneas" },
        { data: [60, 70, 80, 90, 95], description: "Notas variadas" },
        { data: [1000, 1010, 1005, 995, 990], description: "Salários similares" },
        { data: [800, 1200, 2500, 5000, 8000], description: "Salários diversos" },
        { data: [150, 155, 152, 148, 153], description: "Alturas homogêneas (cm)" },
        { data: [25.5, 26.0, 25.8, 25.6, 25.9], description: "Temperatura estável" },
        { data: [10, 15, 8, 25, 30, 12, 18], description: "Vendas diárias" }
    ];
};