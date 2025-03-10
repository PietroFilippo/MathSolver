// Arredonda um número para um número específico de casas decimais
export const arredondarParaDecimais = (num: number, decimais: number = 2): number=> {
    const factor = Math.pow(10, decimais);
    return Math.round(num * factor) / factor;
};

// Converte graus para radianos
export const grausParaRadianos = (graus: number): number => {
    return graus * (Math.PI / 180);
};

// Converte radianos para graus 
export const radianosParaGraus = (radianos: number): number => {
    return radianos * (180 / Math.PI);
};

// Checa se dois números são aproximadamente iguais
export const aproximadamenteIguais = (a: number, b: number, precisao: number = 1e-10): boolean => {
    return Math.abs(a - b) < precisao;
};

// Verifica se um número é primo
export const numPrimo = (num: number): boolean => {
    if (num <= 1) return false;
    if (num <= 3) return true;
    
    if (num % 2 === 0 || num % 3 === 0) return false;
    
    for (let i = 5; i * i <= num; i += 6) {
        if (num % i === 0 || num % (i + 2) === 0) return false;
    }
    
    return true;
};

// Encontra o próximo número primo após um dado número
export const proximoPrimo = (num: number): number => {
    if (num <= 1) return 2;
    
    let prime = num;
    let found = false;
    
    while (!found) {
        prime++;
        
        if (numPrimo(prime)) found = true;
    }
    
    return prime;
};

// Fatoração de um número em seus fatores primos
export const fatorarNumeroEmPrimos = (num: number): {factors: number[], exponents: number[]} => {
    const factors: number[] = [];
    const exponents: number[] = [];
    
    if (num <= 1) {
        return { factors, exponents };
    }
    
    let currentNumber = num;
    let divisor = 2;
    
    while (currentNumber > 1) {
        if (currentNumber % divisor === 0) {
            // Verifica se o fator já existe na lista
            const existingIndex = factors.indexOf(divisor);
            
            if (existingIndex === -1) {
                factors.push(divisor);
                exponents.push(1);
            } else {
                exponents[existingIndex]++;
            }
            
            currentNumber /= divisor;
        } else {
            divisor = proximoPrimo(divisor);
        }
    }
    
    return { factors, exponents };
};

export const sistemaLinear = (
    a1: number, b1: number, c1:number,
    a2: number, b2: number, c2: number
): {x: number, y: number} | null => {
    const det = a1 * b2 - a2 * b1;
    
    if (aproximadamenteIguais(det, 0)) {
        // O sistema ou não tem solução ou tem soluções infinitas
        return null;
    }

    const x = (c1 * b2 - c2 * b1) / det;
    const y = (a1 * c2 - a2 * c1) / det;
    
    return { x, y };
}

// Calcula o mínimo múltiplo comum (MMC) de dois números
export const mmc = (a: number, b: number): number => {
    const mdcValue = mdc(a, b);
    return (a * b) / mdcValue;
};

// Calcula o máximo divisor comum (MDC) de dois números
export const mdc = (a: number, b: number): number => {
    a = Math.abs(a);
    b = Math.abs(b);
    
    while (b) {
        const temp = b;
        b = a % b;
        a = temp;
    }
    return a;
};

// Simplifica uma fração
export const simplificarFracao = (numerador: number, denominador: number): {numerador: number, denominador: number} => {
    if (denominador === 0) {
        throw new Error('Denominador não pode ser zero');
    }

    const divisor = mdc(numerador, denominador);

    // Se o denominador for negativo, inverte o sinal para o numerador
    if (denominador < 0) {
        numerador = -numerador;
        denominador = -denominador;
    }

    return {
        numerador: numerador / divisor,
        denominador: denominador / divisor
    };
};

// Formata uma fração como string
export const formatarFracao = (numerador: number, denominador: number): string => {
    if (denominador === 0) {
        return 'Indeterminado';
    }

    if (numerador === 0) {
        return '0';
    }

    const { numerador: numSimplificado, denominador: denSimplificado } = simplificarFracao(numerador, denominador);

    if (denSimplificado === 1) {
        return `${numSimplificado}`;
    }

    return `${numSimplificado}/${denSimplificado}`;
};

// Interface para o componente FractionDisplay
import React from 'react';

interface FractionDisplayProps {
    numerator: number;
    denominator: number;
    className?: string;
    simplify?: boolean;
}

// Componente para mostrar frações de forma visual
export const FractionDisplay: React.FC<FractionDisplayProps> = ({ 
    numerator, 
    denominator, 
    className = '', 
    simplify = false 
}) => {
    let displayNumerator = numerator;
    let displayDenominator = denominator;
    
    // Se a opção de simplificar estiver ativada, use a função simplificarFracao
    if (simplify && denominator !== 0) {
        const simplified = simplificarFracao(numerator, denominator);
        displayNumerator = simplified.numerador;
        displayDenominator = simplified.denominador;
    }
    
    // Caso especial para fração 0
    if (displayNumerator === 0) {
        return <span className={className}>0</span>;
    }
    
    // Caso especial para denominador 1
    if (displayDenominator === 1) {
        return <span className={className}>{displayNumerator}</span>;
    }
    
    // Caso especial para denominador 0
    if (displayDenominator === 0) {
        return <span className={className}>Indeterminado</span>;
    }
    
    return (
        <span className={`inline-flex flex-col items-center mx-1 ${className}`}>
            <span className="border-b border-gray-700 text-center px-1">{displayNumerator}</span>
            <span className="text-center px-1">{displayDenominator}</span>
        </span>
    );
};

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
