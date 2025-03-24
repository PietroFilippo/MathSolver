import { roundToDecimals } from '../../mathUtils';
import { Point3D } from '../coordenadas/coordenadaCalculators';
import { Vector3D, vectorMagnitude, normalizeVector, crossProduct } from '../vetores/vetorCalculators';

// Define uma estrutura para representar um plano usando a equação ax + by + cz + d = 0
export interface Plane {
    a: number;
    b: number;
    c: number;
    d: number;
}

// Define uma estrutura para representar uma reta no espaço 3D usando equações paramétricas
export interface Line3D {
    point: Point3D;       // Ponto na reta
    direction: Vector3D;  // Vetor direção da reta
}

// Cria um plano a partir de três pontos
export const planeFromPoints = (p1: Point3D, p2: Point3D, p3: Point3D): Plane => {
    // Calcula dois vetores no plano
    const v1: Vector3D = {
        x: p2.x - p1.x,
        y: p2.y - p1.y,
        z: p2.z - p1.z
    };
    
    const v2: Vector3D = {
        x: p3.x - p1.x,
        y: p3.y - p1.y,
        z: p3.z - p1.z
    };
    
    // Calcula o vetor normal usando o produto vetorial
    const normal = crossProduct(v1, v2);
    
    // Calcula o valor de d na equação do plano
    const d = -(normal.x * p1.x + normal.y * p1.y + normal.z * p1.z);
    
    return {
        a: normal.x,
        b: normal.y,
        c: normal.z,
        d: d
    };
};

// Calcula a distância de um ponto a um plano
export const distancePointToPlane = (point: Point3D, plane: Plane): number => {
    const numerator = Math.abs(plane.a * point.x + plane.b * point.y + plane.c * point.z + plane.d);
    const denominator = Math.sqrt(plane.a * plane.a + plane.b * plane.b + plane.c * plane.c);
    
    return roundToDecimals(numerator / denominator, 2);
};

// Cria uma reta a partir de dois pontos
export const lineFromPoints = (p1: Point3D, p2: Point3D): Line3D => {
    const direction: Vector3D = {
        x: p2.x - p1.x,
        y: p2.y - p1.y,
        z: p2.z - p1.z
    };
    
    return {
        point: { ...p1 },
        direction: normalizeVector(direction)
    };
};

// Calcula a distância de um ponto a uma reta
export const distancePointToLine = (point: Point3D, line: Line3D): number => {
    // Vetor do ponto na reta até o ponto dado
    const pv: Vector3D = {
        x: point.x - line.point.x,
        y: point.y - line.point.y,
        z: point.z - line.point.z
    };
    
    // Produto vetorial entre pv e a direção da reta
    const crossProd = crossProduct(pv, line.direction);
    
    // A distância é a magnitude do produto vetorial dividida pela magnitude da direção
    return roundToDecimals(vectorMagnitude(crossProd), 2);
}; 