import { roundToDecimals } from '../../mathUtils';

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