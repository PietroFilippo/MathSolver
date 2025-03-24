import { roundToDecimals } from '../../mathUtils';

// Define a estrutura para um ponto 3D
export interface Point3D {
    x: number;
    y: number;
    z: number;
}

// Calcula a distância entre dois pontos no espaço 3D
export const distance3D = (p1: Point3D, p2: Point3D): number => {
    return roundToDecimals(
        Math.sqrt(
            Math.pow(p2.x - p1.x, 2) + 
            Math.pow(p2.y - p1.y, 2) + 
            Math.pow(p2.z - p1.z, 2)
        ), 
        2
    );
};

// Verifica se três pontos são colineares no espaço 3D
export const areCollinear3D = (p1: Point3D, p2: Point3D, p3: Point3D): boolean => {
    // Calcula os vetores entre os pontos
    const v1 = {
        x: p2.x - p1.x,
        y: p2.y - p1.y,
        z: p2.z - p1.z
    };
    
    const v2 = {
        x: p3.x - p1.x,
        y: p3.y - p1.y,
        z: p3.z - p1.z
    };
    
    // Calcula o produto vetorial
    const crossProduct = {
        x: v1.y * v2.z - v1.z * v2.y,
        y: v1.z * v2.x - v1.x * v2.z,
        z: v1.x * v2.y - v1.y * v2.x
    };
    
    // Se o produto vetorial for aproximadamente zero, os pontos são colineares
    const magnitude = Math.sqrt(
        Math.pow(crossProduct.x, 2) + 
        Math.pow(crossProduct.y, 2) + 
        Math.pow(crossProduct.z, 2)
    );
    
    return magnitude < 0.0001;
};

// Verifica se quatro pontos são coplanares
export const areCoplanar = (p1: Point3D, p2: Point3D, p3: Point3D, p4: Point3D): boolean => {
    // Calcula os vetores a partir do primeiro ponto
    const v1 = {
        x: p2.x - p1.x,
        y: p2.y - p1.y,
        z: p2.z - p1.z
    };
    
    const v2 = {
        x: p3.x - p1.x,
        y: p3.y - p1.y,
        z: p3.z - p1.z
    };
    
    const v3 = {
        x: p4.x - p1.x,
        y: p4.y - p1.y,
        z: p4.z - p1.z
    };
    
    // Calcula o produto misto (escalar triplo)
    const scalarTriple = 
        v1.x * (v2.y * v3.z - v2.z * v3.y) -
        v1.y * (v2.x * v3.z - v2.z * v3.x) +
        v1.z * (v2.x * v3.y - v2.y * v3.x);
    
    // Se o produto misto for aproximadamente zero, os pontos são coplanares
    return Math.abs(scalarTriple) < 0.0001;
}; 