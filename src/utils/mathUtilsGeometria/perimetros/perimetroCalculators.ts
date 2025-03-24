import { roundToDecimals } from '../../mathUtils';

// Calcula o perímetro do quadrado (soma dos 4 lados iguais)
export const squarePerimeter = (lado: number): number => {
    return roundToDecimals(4 * lado, 2);
};

// Calcula o perímetro do retângulo (soma de todos os lados)
export const rectanglePerimeter = (comprimento: number, largura: number): number => {
    return roundToDecimals(2 * (comprimento + largura), 2);
};

// Calcula o perímetro do triângulo (soma dos 3 lados)
export const trianglePerimeter = (ladoA: number, ladoB: number, ladoC: number): number => {
    return roundToDecimals(ladoA + ladoB + ladoC, 2);
};

// Calcula o perímetro do círculo (circunferência = 2πr)
export const circlePerimeter = (raio: number): number => {
    return roundToDecimals(2 * Math.PI * raio, 2);
};

// Calcula o perímetro do trapézio (soma de todos os lados)
export const trapezoidPerimeter = (
    ladoParalelo1: number,
    ladoParalelo2: number,
    ladoObliquo1: number,
    ladoObliquo2: number
): number => {
    return roundToDecimals(ladoParalelo1 + ladoParalelo2 + ladoObliquo1 + ladoObliquo2, 2);
};

// Calcula o perímetro do losango (soma dos 4 lados iguais)
export const rhombusPerimeter = (lado: number): number => {
    return roundToDecimals(4 * lado, 2);
};

// Calcula o perímetro do hexágono regular (soma dos 6 lados iguais)
export const hexagonPerimeter = (lado: number): number => {
    return roundToDecimals(6 * lado, 2);
}; 