import { Point3D } from '../coordenadas/coordenadaCalculators';

// Define funções para exemplos de geometria analítica
export const getGeometriaAnaliticaExamples = (problema: string): Array<{
    pontos: Record<string, Point3D>,
    description: string
}> => {
    switch (problema) {
        case 'distanciaEntrePontoEReta':
            return [
                {
                    pontos: {
                        p1: { x: 1, y: 0, z: 0 },
                        p2: { x: 0, y: 1, z: 0 },
                        p3: { x: 0, y: 0, z: 1 }
                    },
                    description: "Distância de um ponto a uma reta no espaço"
                },
                {
                    pontos: {
                        p1: { x: 2, y: 3, z: 1 },
                        p2: { x: 4, y: 1, z: 2 },
                        p3: { x: 3, y: 3, z: 4 }
                    },
                    description: "Ponto e reta não coplanares"
                }
            ];
        case 'distanciaEntrePontoEPlano':
            return [
                {
                    pontos: {
                        p1: { x: 1, y: 1, z: 1 },
                        p2: { x: 2, y: 0, z: 0 },
                        p3: { x: 0, y: 2, z: 0 },
                        p4: { x: 0, y: 0, z: 2 }
                    },
                    description: "Distância de um ponto a um plano"
                },
                {
                    pontos: {
                        p1: { x: 3, y: 2, z: 1 },
                        p2: { x: 0, y: 0, z: 0 },
                        p3: { x: 1, y: 0, z: 0 },
                        p4: { x: 0, y: 1, z: 0 }
                    },
                    description: "Ponto acima do plano xy"
                }
            ];
        case 'distanciaEntreRetas':
            return [
                {
                    pontos: {
                        p1: { x: 1, y: 0, z: 0 },
                        p2: { x: 2, y: 0, z: 0 },
                        p3: { x: 0, y: 1, z: 0 },
                        p4: { x: 0, y: 2, z: 0 }
                    },
                    description: "Retas paralelas no espaço"
                },
                {
                    pontos: {
                        p1: { x: 0, y: 0, z: 0 },
                        p2: { x: 1, y: 1, z: 1 },
                        p3: { x: 0, y: 0, z: 3 },
                        p4: { x: 2, y: 2, z: 3 }
                    },
                    description: "Retas não paralelas e não concorrentes"
                }
            ];
        case 'anguloEntreRetas':
            return [
                {
                    pontos: {
                        p1: { x: 0, y: 0, z: 0 },
                        p2: { x: 1, y: 0, z: 0 },
                        p3: { x: 0, y: 0, z: 0 },
                        p4: { x: 0, y: 1, z: 0 }
                    },
                    description: "Retas perpendiculares (90°)"
                },
                {
                    pontos: {
                        p1: { x: 0, y: 0, z: 0 },
                        p2: { x: 1, y: 1, z: 0 },
                        p3: { x: 0, y: 0, z: 0 },
                        p4: { x: 0, y: 1, z: 1 }
                    },
                    description: "Ângulo de 60° entre retas"
                }
            ];
        case 'anguloEntreRetaEPlano':
            return [
                {
                    pontos: {
                        p1: { x: 0, y: 0, z: 0 },
                        p2: { x: 0, y: 0, z: 1 },
                        p3: { x: 0, y: 0, z: 0 },
                        p4: { x: 1, y: 0, z: 0 },
                        p5: { x: 0, y: 1, z: 0 }
                    },
                    description: "Reta perpendicular ao plano (90°)"
                },
                {
                    pontos: {
                        p1: { x: 0, y: 0, z: 0 },
                        p2: { x: 1, y: 1, z: 1 },
                        p3: { x: 0, y: 0, z: 0 },
                        p4: { x: 1, y: 0, z: 0 },
                        p5: { x: 0, y: 1, z: 0 }
                    },
                    description: "Reta com ângulo de 45° com o plano"
                }
            ];
        case 'anguloEntrePlanos':
            return [
                {
                    pontos: {
                        p1: { x: 0, y: 0, z: 0 },
                        p2: { x: 1, y: 0, z: 0 },
                        p3: { x: 0, y: 1, z: 0 },
                        p4: { x: 0, y: 0, z: 0 },
                        p5: { x: 1, y: 0, z: 0 },
                        p6: { x: 0, y: 0, z: 1 }
                    },
                    description: "Planos perpendiculares (90°)"
                },
                {
                    pontos: {
                        p1: { x: 0, y: 0, z: 0 },
                        p2: { x: 1, y: 0, z: 0 },
                        p3: { x: 0, y: 1, z: 0 },
                        p4: { x: 0, y: 0, z: 0 },
                        p5: { x: 1, y: 0, z: 0 },
                        p6: { x: 0, y: 1, z: 1 }
                    },
                    description: "Ângulo de 45° entre planos"
                }
            ];
        default:
            return [];
    }
}; 