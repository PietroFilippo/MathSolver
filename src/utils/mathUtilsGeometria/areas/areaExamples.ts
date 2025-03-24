// Fornece exemplos para o calculador de áreas de figuras planas
export const getAreaExamples = (figura: string): Array<{
    valores: Record<string, number>,
    description: string
}> => {
    switch (figura) {
        case 'quadrado':
            return [
                { valores: { lado: 4 }, description: "Quadrado com lado 4 (Área = 16)" },
                { valores: { lado: 7.5 }, description: "Quadrado com lado 7.5 (Área = 56.25)" },
                { valores: { lado: 10 }, description: "Quadrado com lado 10 (Área = 100)" },
            ];
        case 'retangulo':
            return [
                { valores: { comprimento: 6, largura: 4 }, description: "Retângulo 6×4 (Área = 24)" },
                { valores: { comprimento: 10, largura: 5 }, description: "Retângulo 10×5 (Área = 50)" },
                { valores: { comprimento: 3.5, largura: 2.5 }, description: "Retângulo 3.5×2.5 (Área = 8.75)" },
            ];
        case 'triangulo':
            return [
                { valores: { base: 5, altura: 3 }, description: "Triângulo com base 5 e altura 3 (Área = 7.5)" },
                { valores: { base: 8, altura: 6 }, description: "Triângulo com base 8 e altura 6 (Área = 24)" },
                { valores: { base: 10, altura: 4.5 }, description: "Triângulo com base 10 e altura 4.5 (Área = 22.5)" },
            ];
        case 'circulo':
            return [
                { valores: { raio: 5 }, description: "Círculo com raio 5 (Área ≈ 78.54)" },
                { valores: { raio: 3 }, description: "Círculo com raio 3 (Área ≈ 28.27)" },
                { valores: { raio: 10 }, description: "Círculo com raio 10 (Área ≈ 314.16)" },
            ];
        case 'trapezio':
            return [
                { valores: { baseMaior: 8, baseMenor: 4, altura: 3 }, description: "Trapézio com bases 8, 4 e altura 3 (Área = 18)" },
                { valores: { baseMaior: 12, baseMenor: 6, altura: 5 }, description: "Trapézio com bases 12, 6 e altura 5 (Área = 45)" },
                { valores: { baseMaior: 10, baseMenor: 7, altura: 4 }, description: "Trapézio com bases 10, 7 e altura 4 (Área = 34)" },
            ];
        case 'losango':
            return [
                { valores: { diagonalMaior: 8, diagonalMenor: 6 }, description: "Losango com diagonais 8 e 6 (Área = 24)" },
                { valores: { diagonalMaior: 10, diagonalMenor: 4 }, description: "Losango com diagonais 10 e 4 (Área = 20)" },
                { valores: { diagonalMaior: 12, diagonalMenor: 5 }, description: "Losango com diagonais 12 e 5 (Área = 30)" },
            ];
        case 'hexagono':
            return [
                { valores: { lado: 5 }, description: "Hexágono regular com lado 5 (Área ≈ 64.95)" },
                { valores: { lado: 8 }, description: "Hexágono regular com lado 8 (Área ≈ 166.28)" },
                { valores: { lado: 10 }, description: "Hexágono regular com lado 10 (Área ≈ 259.81)" },
            ];
        default:
            return [];
    }
}; 