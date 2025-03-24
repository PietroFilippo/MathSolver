import { roundToDecimals } from '../../mathUtils';

// Calcula a área do quadrado usando o lado
export const squareArea = (lado: number): number => {
    return roundToDecimals(lado * lado, 2);
};

// Calcula a área do retângulo usando comprimento e largura
export const rectangleArea = (comprimento: number, largura: number): number => {
    return roundToDecimals(comprimento * largura, 2);
};

// Calcula a área do triângulo pela fórmula base * altura / 2
export const triangleArea = (base: number, altura: number): number => {
    return roundToDecimals((base * altura) / 2, 2);
};

// Calcula a área do círculo pela fórmula π * r²
export const circleArea = (raio: number): number => {
    return roundToDecimals(Math.PI * raio * raio, 2);
};

// Calcula a área do trapézio pela média das bases vezes a altura
export const trapezoidArea = (baseMaior: number, baseMenor: number, altura: number): number => {
    return roundToDecimals(((baseMaior + baseMenor) * altura) / 2, 2);
};

// Calcula a área do losango pela metade do produto das diagonais
export const rhombusArea = (diagonalMaior: number, diagonalMenor: number): number => {
    return roundToDecimals((diagonalMaior * diagonalMenor) / 2, 2);
};

// Calcula a área do hexágono regular usando o lado
export const hexagonArea = (lado: number): number => {
    return roundToDecimals((3 * Math.sqrt(3) * lado * lado) / 2, 2);
}; 