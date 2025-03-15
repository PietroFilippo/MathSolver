import { approximatelyEqual } from './mathUtils';

// ===================================================
// ========== SISTEMAS DE EQUAÇÕES LINEARES ==========
// ===================================================

// Resolve um sistema linear de duas equações com duas incógnitas
// Utiliza a regra de Cramer para encontrar os valores de x e y
export const linearSystem = (
    a1: number, b1: number, c1: number,
    a2: number, b2: number, c2: number
): {x: number, y: number} | null => {
    const det = a1 * b2 - a2 * b1;
    
    if (approximatelyEqual(det, 0)) {
        // O sistema ou não tem solução ou tem soluções infinitas
        return null;
    }

    const x = (c1 * b2 - c2 * b1) / det;
    const y = (a1 * c2 - a2 * c1) / det;
    
    return { x, y };
};

// ===================================================
// ================= EXEMPLOS ÚTEIS =================
// ===================================================

// Retorna exemplos de equações quadráticas na forma [a, b, c]
export const getQuadraticExamples = (): Array<{a: number, b: number, c: number, description: string}> => {
    return [
        { a: 1, b: -5, c: 6, description: "x² - 5x + 6 = 0" },
        { a: 2, b: -7, c: 3, description: "2x² - 7x + 3 = 0" },
        { a: 1, b: -3, c: 2, description: "x² - 3x + 2 = 0" },
        { a: 1, b: 2, c: 1, description: "x² + 2x + 1 = 0" },
        { a: 3, b: 6, c: -9, description: "3x² + 6x - 9 = 0" },
        { a: 1, b: -1, c: -6, description: "x² - x - 6 = 0" },
        { a: 1, b: 0, c: -9, description: "x² - 9 = 0" },
        { a: 1, b: 8, c: 16, description: "x² + 8x + 16 = 0" },
        { a: 2, b: 0, c: -18, description: "2x² - 18 = 0" },
        { a: 4, b: 4, c: 1, description: "4x² + 4x + 1 = 0" }
    ];
};

// Retorna exemplos de equações lineares na forma [a, b, c] para ax + b = c
export const getLinearExamples = (): Array<{a: number, b: number, c: number, description: string}> => {
    return [
        { a: 2, b: 3, c: 7, description: "2x + 3 = 7" },
        { a: 5, b: -10, c: 15, description: "5x - 10 = 15" },
        { a: 3, b: 6, c: 0, description: "3x + 6 = 0" },
        { a: 7, b: 0, c: 14, description: "7x = 14" },
        { a: -4, b: 8, c: 12, description: "-4x + 8 = 12" },
        { a: 1, b: -7, c: 8, description: "x - 7 = 8" },
        { a: 6, b: 3, c: -3, description: "6x + 3 = -3" },
        { a: 10, b: -5, c: 0, description: "10x - 5 = 0" },
        { a: -2, b: -3, c: -7, description: "-2x - 3 = -7" },
        { a: 4, b: 4, c: 8, description: "4x + 4 = 8" }
    ];
};

// Retorna exemplos de logaritmos
export const getLogarithmExamples = (): Array<{type: 'natural' | 'base10' | 'custom', value: number, base?: number, description: string}> => {
    return [
        { type: 'natural', value: 2.718, description: "ln(e) ≈ ln(2.718)" },
        { type: 'natural', value: 1, description: "ln(1)" },
        { type: 'natural', value: 10, description: "ln(10)" },
        { type: 'natural', value: 100, description: "ln(100)" },
        { type: 'natural', value: 0.5, description: "ln(0.5)" },
        { type: 'base10', value: 10, description: "log₁₀(10)" },
        { type: 'base10', value: 100, description: "log₁₀(100)" },
        { type: 'base10', value: 1000, description: "log₁₀(1000)" },
        { type: 'base10', value: 0.1, description: "log₁₀(0.1)" },
        { type: 'base10', value: 2, description: "log₁₀(2)" },
        { type: 'custom', value: 8, base: 2, description: "log₂(8)" },
        { type: 'custom', value: 27, base: 3, description: "log₃(27)" },
        { type: 'custom', value: 16, base: 4, description: "log₄(16)" },
        { type: 'custom', value: 32, base: 2, description: "log₂(32)" },
        { type: 'custom', value: 81, base: 3, description: "log₃(81)" }
    ];
};

// Retorna exemplos de sistemas lineares 2x2
export const getLinearSystemExamples = (): Array<{
    a1: number, b1: number, c1: number, 
    a2: number, b2: number, c2: number, 
    description: string
}> => {
    return [
        { 
            a1: 2, b1: 1, c1: 5, 
            a2: 3, b2: 2, c2: 8, 
            description: "2x + y = 5, 3x + 2y = 8" 
        },
        { 
            a1: 1, b1: 1, c1: 3, 
            a2: 2, b2: -1, c2: 0, 
            description: "x + y = 3, 2x - y = 0" 
        },
        { 
            a1: 3, b1: 2, c1: 7, 
            a2: -1, b2: 3, c2: 2, 
            description: "3x + 2y = 7, -x + 3y = 2" 
        },
        { 
            a1: 4, b1: -3, c1: 1, 
            a2: 2, b2: 5, c2: 19, 
            description: "4x - 3y = 1, 2x + 5y = 19" 
        },
        { 
            a1: 1, b1: 2, c1: 4, 
            a2: 2, b2: 4, c2: 8, 
            description: "x + 2y = 4, 2x + 4y = 8 (infinitas soluções)" 
        },
        { 
            a1: 2, b1: 3, c1: 6, 
            a2: 4, b2: 6, c2: 8, 
            description: "2x + 3y = 6, 4x + 6y = 8 (sem solução)" 
        },
        { 
            a1: 5, b1: 2, c1: 10, 
            a2: -1, b2: 3, c2: 5, 
            description: "5x + 2y = 10, -x + 3y = 5" 
        },
        { 
            a1: 3, b1: 4, c1: 7, 
            a2: 5, b2: -2, c2: 1, 
            description: "3x + 4y = 7, 5x - 2y = 1" 
        }
    ];
};