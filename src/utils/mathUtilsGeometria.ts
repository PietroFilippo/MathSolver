import { roundToDecimals } from './mathUtils';

// ===================================================
// ========== ÁREAS DE FIGURAS PLANAS ================
// ===================================================

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

// ===================================================
// ========== PERÍMETROS DE FIGURAS PLANAS ===========
// ===================================================

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

// ===================================================
// ========== VOLUMES DE SÓLIDOS GEOMÉTRICOS =========
// ===================================================

// Calcula o volume do cubo (aresta³)
export const cubeVolume = (aresta: number): number => {
    return roundToDecimals(Math.pow(aresta, 3), 2);
};

// Calcula o volume do paralelepípedo (produto das três dimensões)
export const cuboidVolume = (comprimento: number, largura: number, altura: number): number => {
    return roundToDecimals(comprimento * largura * altura, 2);
};

// Calcula o volume da esfera (4/3 * π * r³)
export const sphereVolume = (raio: number): number => {
    return roundToDecimals((4/3) * Math.PI * Math.pow(raio, 3), 2);
};

// Calcula o volume do cilindro (área da base * altura)
export const cylinderVolume = (raioBase: number, altura: number): number => {
    return roundToDecimals(Math.PI * Math.pow(raioBase, 2) * altura, 2);
};

// Calcula o volume do cone (1/3 * área da base * altura)
export const coneVolume = (raioBase: number, altura: number): number => {
    return roundToDecimals((1/3) * Math.PI * Math.pow(raioBase, 2) * altura, 2);
};

// Calcula o volume da pirâmide (1/3 * área da base * altura)
export const pyramidVolume = (areaBase: number, altura: number): number => {
    return roundToDecimals((1/3) * areaBase * altura, 2);
};

// Calcula o volume do prisma (área da base * altura)
export const prismVolume = (areaBase: number, altura: number): number => {
    return roundToDecimals(areaBase * altura, 2);
};