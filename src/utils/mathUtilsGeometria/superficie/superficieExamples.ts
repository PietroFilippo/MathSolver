// Define funções para exemplos de cálculos de superfície
export const getSurfaceAreaExamples = (solido: string): Array<{
    valores: Record<string, number>,
    description: string
}> => {
    switch (solido) {
        case 'cubo':
            return [
                { valores: { aresta: 4 }, description: "Cubo com aresta 4 (Área superficial = 96)" },
                { valores: { aresta: 5 }, description: "Cubo com aresta 5 (Área superficial = 150)" },
                { valores: { aresta: 10 }, description: "Cubo com aresta 10 (Área superficial = 600)" },
            ];
        case 'paralelepipedo':
            return [
                { valores: { comprimento: 6, largura: 4, altura: 5 }, description: "Paralelepípedo 6×4×5 (Área superficial = 148)" },
                { valores: { comprimento: 10, largura: 7, altura: 3 }, description: "Paralelepípedo 10×7×3 (Área superficial = 242)" },
                { valores: { comprimento: 8, largura: 8, altura: 4 }, description: "Paralelepípedo 8×8×4 (Área superficial = 256)" },
            ];
        case 'esfera':
            return [
                { valores: { raio: 5 }, description: "Esfera com raio 5 (Área superficial ≈ 314.16)" },
                { valores: { raio: 7 }, description: "Esfera com raio 7 (Área superficial ≈ 615.75)" },
                { valores: { raio: 10 }, description: "Esfera com raio 10 (Área superficial ≈ 1256.64)" },
            ];
        case 'cilindro':
            return [
                { valores: { raio: 3, altura: 8 }, description: "Cilindro com raio 3 e altura 8 (Área superficial ≈ 207.35)" },
                { valores: { raio: 5, altura: 12 }, description: "Cilindro com raio 5 e altura 12 (Área superficial ≈ 534.07)" },
                { valores: { raio: 4, altura: 6 }, description: "Cilindro com raio 4 e altura 6 (Área superficial ≈ 251.33)" },
            ];
        case 'cone':
            return [
                { valores: { raio: 3, altura: 4 }, description: "Cone com raio 3 e altura 4 (Área superficial ≈ 75.40)" },
                { valores: { raio: 5, altura: 12 }, description: "Cone com raio 5 e altura 12 (Área superficial ≈ 254.16)" },
                { valores: { raio: 6, altura: 8 }, description: "Cone com raio 6 e altura 8 (Área superficial ≈ 301.59)" },
            ];
        case 'piramide':
            return [
                { valores: { ladoBase: 4, altura: 6 }, description: "Pirâmide quadrada com lado 4 e altura 6 (Área superficial ≈ 64.91)" },
                { valores: { ladoBase: 5, altura: 8 }, description: "Pirâmide quadrada com lado 5 e altura 8 (Área superficial ≈ 106.86)" },
                { valores: { ladoBase: 10, altura: 12 }, description: "Pirâmide quadrada com lado 10 e altura 12 (Área superficial ≈ 382.46)" },
            ];
        case 'prisma':
            return [
                { valores: { ladoBase: 4, altura: 10 }, description: "Prisma triangular com lado 4 e altura 10 (Área superficial ≈ 136.99)" },
                { valores: { ladoBase: 6, altura: 12 }, description: "Prisma triangular com lado 6 e altura 12 (Área superficial ≈ 270.19)" },
                { valores: { ladoBase: 8, altura: 15 }, description: "Prisma triangular com lado 8 e altura 15 (Área superficial ≈ 464.83)" },
            ];
        default:
            return [];
    }
}; 