import { arredondarParaDecimais } from './mathUtils';

// Calcula a mediana de um array de números
export const calcularMediana = (numeros: number[]): number => {
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
export const calcularModa = (numeros: number[]): number[] => {
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
export const calcularMediaPonderada = (numeros: number[], pesos: number[]): number => {
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

// Calcula o Desvio Médio
export const calcularDesvioMedio = (numeros: number[]): number => {
    if (numeros.length === 0) return 0;
    
    const media = numeros.reduce((acc, curr) => acc + curr, 0) / numeros.length;
    const somaDesvios = numeros.reduce((acc, curr) => acc + Math.abs(curr - media), 0);
    
    return arredondarParaDecimais(somaDesvios / numeros.length, 4);
};

// Calcula a Variância
export const calcularVariancia = (numeros: number[]): number => {
    if (numeros.length === 0) return 0;
    
    const media = numeros.reduce((acc, curr) => acc + curr, 0) / numeros.length;
    const somaQuadrados = numeros.reduce((acc, curr) => acc + Math.pow(curr - media, 2), 0);
    
    return arredondarParaDecimais(somaQuadrados / numeros.length, 4);
};

// Calcula o Desvio Padrão
export const calcularDesvioPadrao = (numeros: number[]): number => {
    return arredondarParaDecimais(Math.sqrt(calcularVariancia(numeros)), 4);
};

// Calcula o Coeficiente de Variação
export const calcularCoeficienteVariacao = (numeros: number[]): number => {
    if (numeros.length === 0) return 0;
    
    const media = numeros.reduce((acc, curr) => acc + curr, 0) / numeros.length;
    
    // Se a média for 0, o coeficiente de variação não pode ser calculado
    if (media === 0) {
        throw new Error('O coeficiente de variação não pode ser calculado quando a média é zero');
    }
    
    const desvioPadrao = calcularDesvioPadrao(numeros);
    return arredondarParaDecimais((desvioPadrao / Math.abs(media)) * 100, 2);
};