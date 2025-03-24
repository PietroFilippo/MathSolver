import { roundToDecimals } from '../../mathUtils';

// Tipos para operações com vetores
export interface Vector3D {
    x: number;
    y: number;
    z: number;
}

// Adiciona dois vetores
export function addVectors(v1: Vector3D, v2: Vector3D): Vector3D {
    return {
        x: roundToDecimals(v1.x + v2.x, 2),
        y: roundToDecimals(v1.y + v2.y, 2),
        z: roundToDecimals(v1.z + v2.z, 2)
    };
}

// Subtrai dois vetores
export function subtractVectors(v1: Vector3D, v2: Vector3D): Vector3D {
    return {
        x: roundToDecimals(v1.x - v2.x, 2),
        y: roundToDecimals(v1.y - v2.y, 2),
        z: roundToDecimals(v1.z - v2.z, 2)
    };
}

// Multiplica um vetor por um escalar
export function scalarMultiply(v: Vector3D, scalar: number): Vector3D {
    return {
        x: roundToDecimals(v.x * scalar, 2),
        y: roundToDecimals(v.y * scalar, 2),
        z: roundToDecimals(v.z * scalar, 2)
    };
}

// Calcula o produto escalar (dot product) entre dois vetores
export function dotProduct(v1: Vector3D, v2: Vector3D): number {
    return roundToDecimals(v1.x * v2.x + v1.y * v2.y + v1.z * v2.z, 2);
}

// Calcula o produto vetorial (cross product) entre dois vetores
export function crossProduct(v1: Vector3D, v2: Vector3D): Vector3D {
    return {
        x: roundToDecimals(v1.y * v2.z - v1.z * v2.y, 2),
        y: roundToDecimals(v1.z * v2.x - v1.x * v2.z, 2),
        z: roundToDecimals(v1.x * v2.y - v1.y * v2.x, 2)
    };
}

// Calcula a magnitude (módulo) de um vetor
export function vectorMagnitude(v: Vector3D): number {
    return roundToDecimals(Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z), 2);
}

// Normaliza um vetor (cria um vetor unitário)
export function normalizeVector(v: Vector3D): Vector3D {
    const magnitude = vectorMagnitude(v);
    if (magnitude === 0) {
        throw new Error("Não é possível normalizar o vetor nulo");
    }
    return {
        x: roundToDecimals(v.x / magnitude, 2),
        y: roundToDecimals(v.y / magnitude, 2),
        z: roundToDecimals(v.z / magnitude, 2)
    };
}

// Calcula o ângulo entre dois vetores (em radianos)
export function angleBetweenVectors(v1: Vector3D, v2: Vector3D): number {
    const dot = dotProduct(v1, v2);
    const magV1 = vectorMagnitude(v1);
    const magV2 = vectorMagnitude(v2);
    
    if (magV1 === 0 || magV2 === 0) {
        throw new Error("Não é possível calcular o ângulo com um vetor nulo");
    }
    
    // Limitado entre -1 e 1 para evitar erros de precisão numérica
    const cosTheta = Math.max(-1, Math.min(1, dot / (magV1 * magV2)));
    return roundToDecimals(Math.acos(cosTheta), 2);
} 