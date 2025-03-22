// Utilidades para processar intervalos em cálculos trigonométricos
import { replacePi } from '../mathUtils';

// Analisa uma string de intervalo no formato "a,b" e retorna [a, b] em radianos
export const parseInterval = (intervaloStr: string): [number, number] => {
    const partes = intervaloStr.split(',');
    if (partes.length !== 2) {
        throw new Error('Formato de intervalo inválido. Use o formato: início,fim');
    }
    
    try {
        // Substituir π por Math.PI e avaliar expressões de forma segura
        const processarParte = (parte: string): number => {
            // Usar a função compartilhada para substituir Pi
            parte = replacePi(parte);
            
            // Caso especial para frações simples como π/4, 3π/2, etc.
            if (/^-?\s*\d*\s*Math\.PI\s*\/\s*\d+$/.test(parte)) {
                const match = parte.match(/^(-?\s*\d*)\s*(Math\.PI)\s*\/\s*(\d+)$/);
                if (match) {
                    const coef = match[1] ? (match[1].trim() === '-' ? -1 : parseFloat(match[1]) || 1) : 1;
                    const denom = parseInt(match[3]);
                    return coef * Math.PI / denom;
                }
            }
            
            // Verificar expressões seguras com whitelist de operadores permitidos
            
            // Expressões numéricas simples
            const safeNumericRegex = /^-?(\d*\.\d+|\d+)([\+\-\*\/](\d*\.\d+|\d+))*$/;
            if (safeNumericRegex.test(parte)) {
                // Podemos usar eval com segurança para expressões numéricas simples
                return eval(parte);
            }
            
            // Expressões simples com Math.PI
            const safePiRegex = /^-?(\d*\.\d+|\d+)?\s*\*?\s*Math\.PI([\+\-\*\/](\d*\.\d+|\d+))*$/;
            if (safePiRegex.test(parte)) {
                return eval(parte);
            }
            
            // Expressões mistas com operações entre Math.PI e números
            const mixedPiRegex = /^(-?(\d*\.\d+|\d+|\d*\s*Math\.PI)([\+\-\*\/](\d*\.\d+|\d+|\d*\s*Math\.PI))*)$/;
            if (mixedPiRegex.test(parte)) {
                return eval(parte);
            }
            
            // Rejeitar expressões não seguras
            throw new Error(`Expressão não suportada: ${parte}. Use apenas expressões matemáticas simples.`);
        };
        
        const inicio = processarParte(partes[0]);
        const fim = processarParte(partes[1]);
        
        if (isNaN(inicio) || isNaN(fim)) {
            throw new Error('Valores de intervalo inválidos');
        }
        
        return [inicio, fim];
    } catch (error) {
        throw new Error(`Erro ao processar o intervalo: ${error instanceof Error ? error.message : String(error)}`);
    }
}; 