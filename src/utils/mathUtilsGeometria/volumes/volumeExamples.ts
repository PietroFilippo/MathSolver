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