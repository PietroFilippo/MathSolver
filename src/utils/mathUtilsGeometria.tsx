import { arredondarParaDecimais } from './mathUtils';

// Calcula a área do quadrado
export const areaQuadrado = (lado: number): number => {
    return arredondarParaDecimais(lado * lado, 2);
};

// Calcula a área do retângulo
export const areaRetangulo = (comprimento: number, largura: number): number => {
    return arredondarParaDecimais(comprimento * largura, 2);
};

// Calcula a área do triângulo
export const areaTriangulo = (base: number, altura: number): number => {
    return arredondarParaDecimais((base * altura) / 2, 2);
};

// Calcula a área do círculo
export const areaCirculo = (raio: number): number => {
    return arredondarParaDecimais(Math.PI * raio * raio, 2);
};

// Calcula a área do trapézio
export const areaTrapezio = (baseMaior: number, baseMenor: number, altura: number): number => {
    return arredondarParaDecimais(((baseMaior + baseMenor) * altura) / 2, 2);
};

// Calcula a área do losango
export const areaLosango = (diagonalMaior: number, diagonalMenor: number): number => {
    return arredondarParaDecimais((diagonalMaior * diagonalMenor) / 2, 2);
};

// Calcula a área do hexágono regular
export const areaHexagono = (lado: number): number => {
    return arredondarParaDecimais((3 * Math.sqrt(3) * lado * lado) / 2, 2);
};

// Calcula o perímetro do quadrado
export const perimetroQuadrado = (lado: number): number => {
    return arredondarParaDecimais(4 * lado, 2);
};

// Calcula o perímetro do retângulo
export const perimetroRetangulo = (comprimento: number, largura: number): number => {
    return arredondarParaDecimais(2 * (comprimento + largura), 2);
};

// Calcula o perímetro do triângulo
export const perimetroTriangulo = (ladoA: number, ladoB: number, ladoC: number): number => {
    return arredondarParaDecimais(ladoA + ladoB + ladoC, 2);
};

// Calcula o perímetro do círculo
export const perimetroCirculo = (raio: number): number => {
    return arredondarParaDecimais(2 * Math.PI * raio, 2);
};

// Calcula o perímetro do trapézio
export const perimetroTrapezio = (
    ladoParalelo1: number,
    ladoParalelo2: number,
    ladoObliquo1: number,
    ladoObliquo2: number
): number => {
    return arredondarParaDecimais(ladoParalelo1 + ladoParalelo2 + ladoObliquo1 + ladoObliquo2, 2);
};

// Calcula o perímetro do losango
export const perimetroLosango = (lado: number): number => {
    return arredondarParaDecimais(4 * lado, 2);
};

// Calcula o perímetro do hexágono regular
export const perimetroHexagono = (lado: number): number => {
    return arredondarParaDecimais(6 * lado, 2);
};

// Volume calculations
export const volumeCubo = (aresta: number): number => {
    return arredondarParaDecimais(Math.pow(aresta, 3), 2);
};

export const volumeParalelepipedo = (comprimento: number, largura: number, altura: number): number => {
    return arredondarParaDecimais(comprimento * largura * altura, 2);
};

export const volumeEsfera = (raio: number): number => {
    return arredondarParaDecimais((4/3) * Math.PI * Math.pow(raio, 3), 2);
};

export const volumeCilindro = (raioBase: number, altura: number): number => {
    return arredondarParaDecimais(Math.PI * Math.pow(raioBase, 2) * altura, 2);
};

export const volumeCone = (raioBase: number, altura: number): number => {
    return arredondarParaDecimais((1/3) * Math.PI * Math.pow(raioBase, 2) * altura, 2);
};

export const volumePiramide = (areaBase: number, altura: number): number => {
    return arredondarParaDecimais((1/3) * areaBase * altura, 2);
};

export const volumePrisma = (areaBase: number, altura: number): number => {
    return arredondarParaDecimais(areaBase * altura, 2);
};