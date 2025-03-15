import { roundToDecimals } from './mathUtils';

// ===================================================
// ========== ÁREAS DE FIGURAS PLANAS ================
// ===================================================

// Calcula a área do quadrado usando o lado
export const squareArea = (lado: number): number => {
    return roundToDecimals(lado * lado, 2);
};

// Calcula a área do retângulo usando comprimento e largura
export const rectangleArea = (comprimento: number, largura: number): number => {
    return roundToDecimals(comprimento * largura, 2);
};

// Calcula a área do triângulo pela fórmula base * altura / 2
export const triangleArea = (base: number, altura: number): number => {
    return roundToDecimals((base * altura) / 2, 2);
};

// Calcula a área do círculo pela fórmula π * r²
export const circleArea = (raio: number): number => {
    return roundToDecimals(Math.PI * raio * raio, 2);
};

// Calcula a área do trapézio pela média das bases vezes a altura
export const trapezoidArea = (baseMaior: number, baseMenor: number, altura: number): number => {
    return roundToDecimals(((baseMaior + baseMenor) * altura) / 2, 2);
};

// Calcula a área do losango pela metade do produto das diagonais
export const rhombusArea = (diagonalMaior: number, diagonalMenor: number): number => {
    return roundToDecimals((diagonalMaior * diagonalMenor) / 2, 2);
};

// Calcula a área do hexágono regular usando o lado
export const hexagonArea = (lado: number): number => {
    return roundToDecimals((3 * Math.sqrt(3) * lado * lado) / 2, 2);
};

// ===================================================
// ========== PERÍMETROS DE FIGURAS PLANAS ===========
// ===================================================

// Calcula o perímetro do quadrado (soma dos 4 lados iguais)
export const squarePerimeter = (lado: number): number => {
    return roundToDecimals(4 * lado, 2);
};

// Calcula o perímetro do retângulo (soma de todos os lados)
export const rectanglePerimeter = (comprimento: number, largura: number): number => {
    return roundToDecimals(2 * (comprimento + largura), 2);
};

// Calcula o perímetro do triângulo (soma dos 3 lados)
export const trianglePerimeter = (ladoA: number, ladoB: number, ladoC: number): number => {
    return roundToDecimals(ladoA + ladoB + ladoC, 2);
};

// Calcula o perímetro do círculo (circunferência = 2πr)
export const circlePerimeter = (raio: number): number => {
    return roundToDecimals(2 * Math.PI * raio, 2);
};

// Calcula o perímetro do trapézio (soma de todos os lados)
export const trapezoidPerimeter = (
    ladoParalelo1: number,
    ladoParalelo2: number,
    ladoObliquo1: number,
    ladoObliquo2: number
): number => {
    return roundToDecimals(ladoParalelo1 + ladoParalelo2 + ladoObliquo1 + ladoObliquo2, 2);
};

// Calcula o perímetro do losango (soma dos 4 lados iguais)
export const rhombusPerimeter = (lado: number): number => {
    return roundToDecimals(4 * lado, 2);
};

// Calcula o perímetro do hexágono regular (soma dos 6 lados iguais)
export const hexagonPerimeter = (lado: number): number => {
    return roundToDecimals(6 * lado, 2);
};

// ===================================================
// ========== VOLUMES DE SÓLIDOS GEOMÉTRICOS =========
// ===================================================

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

// ===================================================
// ================= EXEMPLOS ÚTEIS =================
// ===================================================


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


// Fornece exemplos para o calculador de volumes de sólidos geométricos
export const getVolumeExamples = (solido: string): Array<{
    valores: Record<string, number>,
    description: string
}> => {
    switch (solido) {
        case 'cubo':
            return [
                { valores: { aresta: 4 }, description: "Cubo com aresta 4 (Volume = 64)" },
                { valores: { aresta: 5 }, description: "Cubo com aresta 5 (Volume = 125)" },
                { valores: { aresta: 10 }, description: "Cubo com aresta 10 (Volume = 1000)" },
            ];
        case 'paralelepipedo':
            return [
                { valores: { comprimento: 6, largura: 4, altura: 3 }, description: "Paralelepípedo 6×4×3 (Volume = 72)" },
                { valores: { comprimento: 10, largura: 5, altura: 2 }, description: "Paralelepípedo 10×5×2 (Volume = 100)" },
                { valores: { comprimento: 8, largura: 7, altura: 5 }, description: "Paralelepípedo 8×7×5 (Volume = 280)" },
            ];
        case 'esfera':
            return [
                { valores: { raio: 3 }, description: "Esfera com raio 3 (Volume ≈ 113.1)" },
                { valores: { raio: 5 }, description: "Esfera com raio 5 (Volume ≈ 523.6)" },
                { valores: { raio: 10 }, description: "Esfera com raio 10 (Volume ≈ 4188.79)" },
            ];
        case 'cilindro':
            return [
                { valores: { raioBase: 3, altura: 5 }, description: "Cilindro com raio 3 e altura 5 (Volume ≈ 141.37)" },
                { valores: { raioBase: 4, altura: 8 }, description: "Cilindro com raio 4 e altura 8 (Volume ≈ 402.12)" },
                { valores: { raioBase: 6, altura: 10 }, description: "Cilindro com raio 6 e altura 10 (Volume ≈ 1130.97)" },
            ];
        case 'cone':
            return [
                { valores: { raioBase: 3, altura: 4 }, description: "Cone com raio 3 e altura 4 (Volume ≈ 37.7)" },
                { valores: { raioBase: 5, altura: 10 }, description: "Cone com raio 5 e altura 10 (Volume ≈ 261.8)" },
                { valores: { raioBase: 6, altura: 12 }, description: "Cone com raio 6 e altura 12 (Volume ≈ 452.39)" },
            ];
        case 'piramide':
            return [
                { valores: { areaBase: 16, altura: 6 }, description: "Pirâmide com área da base 16 e altura 6 (Volume ≈ 32)" },
                { valores: { areaBase: 25, altura: 10 }, description: "Pirâmide com área da base 25 e altura 10 (Volume ≈ 83.33)" },
                { valores: { areaBase: 36, altura: 15 }, description: "Pirâmide com área da base 36 e altura 15 (Volume = 180)" },
            ];
        case 'prisma':
            return [
                { valores: { areaBase: 20, altura: 8 }, description: "Prisma com área da base 20 e altura 8 (Volume = 160)" },
                { valores: { areaBase: 30, altura: 12 }, description: "Prisma com área da base 30 e altura 12 (Volume = 360)" },
                { valores: { areaBase: 50, altura: 6 }, description: "Prisma com área da base 50 e altura 6 (Volume = 300)" },
            ];
        default:
            return [];
    }
};