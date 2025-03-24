// Fornece exemplos para o calculador de perímetros de figuras planas
export const getPerimeterExamples = (figura: string): Array<{
    valores: Record<string, number>,
    description: string
}> => {
    switch (figura) {
        case 'quadrado':
            return [
                { valores: { lado: 4 }, description: "Quadrado com lado 4 (Perímetro = 16)" },
                { valores: { lado: 7.5 }, description: "Quadrado com lado 7.5 (Perímetro = 30)" },
                { valores: { lado: 10 }, description: "Quadrado com lado 10 (Perímetro = 40)" },
            ];
        case 'retangulo':
            return [
                { valores: { comprimento: 6, largura: 4 }, description: "Retângulo 6×4 (Perímetro = 20)" },
                { valores: { comprimento: 10, largura: 5 }, description: "Retângulo 10×5 (Perímetro = 30)" },
                { valores: { comprimento: 3.5, largura: 2.5 }, description: "Retângulo 3.5×2.5 (Perímetro = 12)" },
            ];
        case 'triangulo':
            return [
                { valores: { ladoA: 3, ladoB: 4, ladoC: 5 }, description: "Triângulo retângulo 3-4-5 (Perímetro = 12)" },
                { valores: { ladoA: 5, ladoB: 5, ladoC: 5 }, description: "Triângulo equilátero de lado 5 (Perímetro = 15)" },
                { valores: { ladoA: 7, ladoB: 8, ladoC: 9 }, description: "Triângulo escaleno 7-8-9 (Perímetro = 24)" },
            ];
        case 'circulo':
            return [
                { valores: { raio: 5 }, description: "Círculo com raio 5 (Perímetro ≈ 31.42)" },
                { valores: { raio: 3 }, description: "Círculo com raio 3 (Perímetro ≈ 18.85)" },
                { valores: { raio: 10 }, description: "Círculo com raio 10 (Perímetro ≈ 62.83)" },
            ];
        case 'trapezio':
            return [
                { valores: { ladoParalelo1: 8, ladoParalelo2: 4, ladoObliquo1: 5, ladoObliquo2: 5 }, description: "Trapézio isósceles (Perímetro = 22)" },
                { valores: { ladoParalelo1: 12, ladoParalelo2: 6, ladoObliquo1: 5, ladoObliquo2: 7 }, description: "Trapézio escaleno (Perímetro = 30)" },
                { valores: { ladoParalelo1: 10, ladoParalelo2: 10, ladoObliquo1: 8, ladoObliquo2: 8 }, description: "Trapézio regular (Perímetro = 36)" },
            ];
        case 'losango':
            return [
                { valores: { lado: 4 }, description: "Losango com lado 4 (Perímetro = 16)" },
                { valores: { lado: 6 }, description: "Losango com lado 6 (Perímetro = 24)" },
                { valores: { lado: 9 }, description: "Losango com lado 9 (Perímetro = 36)" },
            ];
        case 'hexagono':
            return [
                { valores: { lado: 5 }, description: "Hexágono regular com lado 5 (Perímetro = 30)" },
                { valores: { lado: 8 }, description: "Hexágono regular com lado 8 (Perímetro = 48)" },
                { valores: { lado: 10 }, description: "Hexágono regular com lado 10 (Perímetro = 60)" },
            ];
        default:
            return [];
    }
}; 