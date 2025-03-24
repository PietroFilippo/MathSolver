import { Vector3D } from './vetorCalculators';

// Exemplos para problemas de geometria vetorial
export function getVetorGeometriaExamples(problema: string): Array<{
    vetores: Record<string, Vector3D>;
    escalar?: number;
    description: string;
}> {
    switch (problema) {
        case 'somaVetores':
            return [
                { 
                    vetores: { v1: { x: 1, y: 2, z: 3 }, v2: { x: 4, y: 5, z: 6 } }, 
                    description: 'Soma de vetores simples' 
                },
                { 
                    vetores: { v1: { x: -2, y: 3, z: 1 }, v2: { x: 2, y: -3, z: -1 } }, 
                    description: 'Soma de vetores opostos' 
                },
                { 
                    vetores: { v1: { x: 5, y: 0, z: 0 }, v2: { x: 0, y: 5, z: 0 } }, 
                    description: 'Soma de vetores perpendiculares' 
                }
            ];
        
        case 'subtracaoVetores':
            return [
                { 
                    vetores: { v1: { x: 5, y: 7, z: 9 }, v2: { x: 2, y: 3, z: 4 } }, 
                    description: 'Subtração de vetores simples' 
                },
                { 
                    vetores: { v1: { x: 3, y: 3, z: 3 }, v2: { x: 3, y: 3, z: 3 } }, 
                    description: 'Subtração de vetores iguais' 
                },
                { 
                    vetores: { v1: { x: 10, y: 5, z: 7 }, v2: { x: -3, y: -2, z: -1 } }, 
                    description: 'Subtração com vetor negativo' 
                }
            ];
        
        case 'multiplicacaoEscalar':
            return [
                { 
                    vetores: { v1: { x: 1, y: 2, z: 3 } }, 
                    escalar: 2,
                    description: 'Multiplicação por escalar positivo' 
                },
                { 
                    vetores: { v1: { x: 4, y: 5, z: 6 } }, 
                    escalar: -1,
                    description: 'Multiplicação por -1 (vetor oposto)' 
                },
                { 
                    vetores: { v1: { x: 10, y: 20, z: 30 } }, 
                    escalar: 0.5,
                    description: 'Multiplicação por fração (redução)' 
                }
            ];
        
        case 'produtoEscalar':
            return [
                { 
                    vetores: { v1: { x: 1, y: 2, z: 3 }, v2: { x: 4, y: 5, z: 6 } }, 
                    description: 'Produto escalar de vetores paralelos' 
                },
                { 
                    vetores: { v1: { x: 1, y: 0, z: 0 }, v2: { x: 0, y: 1, z: 0 } }, 
                    description: 'Produto escalar de vetores perpendiculares' 
                },
                { 
                    vetores: { v1: { x: 3, y: 2, z: 1 }, v2: { x: -1, y: 2, z: 5 } }, 
                    description: 'Produto escalar de vetores em ângulo' 
                }
            ];
        
        case 'produtoVetorial':
            return [
                { 
                    vetores: { v1: { x: 1, y: 0, z: 0 }, v2: { x: 0, y: 1, z: 0 } }, 
                    description: 'Produto vetorial de vetores básicos i×j' 
                },
                { 
                    vetores: { v1: { x: 2, y: 3, z: 4 }, v2: { x: 5, y: 6, z: 7 } }, 
                    description: 'Produto vetorial de vetores genéricos' 
                },
                { 
                    vetores: { v1: { x: 3, y: 0, z: 0 }, v2: { x: 3, y: 0, z: 0 } }, 
                    description: 'Produto vetorial de vetores paralelos' 
                }
            ];
        
        case 'magnitudeVetor':
            return [
                { 
                    vetores: { v1: { x: 3, y: 4, z: 0 } }, 
                    description: 'Magnitude de vetor no plano XY (3-4-5)' 
                },
                { 
                    vetores: { v1: { x: 1, y: 1, z: 1 } }, 
                    description: 'Magnitude de vetor unitário diagonal' 
                },
                { 
                    vetores: { v1: { x: 5, y: 0, z: 0 } }, 
                    description: 'Magnitude de vetor no eixo X' 
                }
            ];
        
        case 'normalizacaoVetor':
            return [
                { 
                    vetores: { v1: { x: 3, y: 4, z: 0 } }, 
                    description: 'Normalização de vetor no plano XY' 
                },
                { 
                    vetores: { v1: { x: 5, y: 5, z: 5 } }, 
                    description: 'Normalização de vetor diagonal' 
                },
                { 
                    vetores: { v1: { x: 0, y: 0, z: 10 } }, 
                    description: 'Normalização de vetor no eixo Z' 
                }
            ];
        
        case 'anguloEntreVetores':
            return [
                { 
                    vetores: { v1: { x: 1, y: 0, z: 0 }, v2: { x: 0, y: 1, z: 0 } }, 
                    description: 'Ângulo entre vetores perpendiculares (90°)' 
                },
                { 
                    vetores: { v1: { x: 1, y: 1, z: 0 }, v2: { x: 1, y: 0, z: 0 } }, 
                    description: 'Ângulo de 45 graus' 
                },
                { 
                    vetores: { v1: { x: 1, y: 2, z: 3 }, v2: { x: -1, y: -2, z: -3 } }, 
                    description: 'Ângulo entre vetores opostos (180°)' 
                }
            ];
            
        default:
            return [];
    }
} 