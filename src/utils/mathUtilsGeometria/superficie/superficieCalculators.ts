import { roundToDecimals } from '../../mathUtils';

// Calcula a área da superfície de um cubo
export const cubeSurfaceArea = (aresta: number): number => {
    return roundToDecimals(6 * Math.pow(aresta, 2), 2);
};

// Calcula a área da superfície de um paralelepípedo
export const cuboidSurfaceArea = (comprimento: number, largura: number, altura: number): number => {
    return roundToDecimals(2 * (comprimento * largura + comprimento * altura + largura * altura), 2);
};

// Calcula a área da superfície de uma esfera
export const sphereSurfaceArea = (raio: number): number => {
    return roundToDecimals(4 * Math.PI * Math.pow(raio, 2), 2);
};

// Calcula a área da superfície de um cilindro
export const cylinderSurfaceArea = (raio: number, altura: number): number => {
    return roundToDecimals(2 * Math.PI * raio * (raio + altura), 2);
};

// Calcula a área da superfície de um cone
export const coneSurfaceArea = (raio: number, altura: number): number => {
    const geratriz = Math.sqrt(Math.pow(raio, 2) + Math.pow(altura, 2));
    return roundToDecimals(Math.PI * raio * (raio + geratriz), 2);
};

// Calcula a área da superfície de uma pirâmide quadrada regular
export const squarePyramidSurfaceArea = (ladoBase: number, altura: number): number => {
    const areaBase = Math.pow(ladoBase, 2);
    const alturaTriangulo = Math.sqrt(Math.pow(altura, 2) + Math.pow(ladoBase / 2, 2));
    const areaTriangular = (ladoBase * alturaTriangulo) / 2;
    return roundToDecimals(areaBase + 4 * areaTriangular, 2);
};

// Calcula a área da superfície de um prisma triangular regular
export const triangularPrismSurfaceArea = (ladoBase: number, altura: number): number => {
    const areaBase = (Math.sqrt(3) / 4) * Math.pow(ladoBase, 2);
    const perimetroBase = 3 * ladoBase;
    return roundToDecimals(2 * areaBase + perimetroBase * altura, 2);
}; 