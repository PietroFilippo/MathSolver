import React from 'react';
import { gcd } from './mathUtils';

// ===================================================
// ========== OPERAÇÕES COM FRAÇÕES =================
// ===================================================

// Simplifica uma fração para sua forma irredutível
// Inverte sinais se o denominador for negativo
export const simplifyFraction = (numerador: number, denominador: number): {numerador: number, denominador: number} => {
    if (denominador === 0) {
        throw new Error('Denominador não pode ser zero');
    }

    const divisor = gcd(numerador, denominador);

    // Se o denominador for negativo, inverte o sinal para o numerador
    if (denominador < 0) {
        numerador = -numerador;
        denominador = -denominador;
    }

    return {
        numerador: numerador / divisor,
        denominador: denominador / divisor
    };
};

// Converte uma fração em uma representação textual
// Trata casos especiais como denominador 0, 1 ou numerador 0
export const formatFraction = (numerador: number, denominador: number): string => {
    if (denominador === 0) {
        return 'Indeterminado';
    }

    if (numerador === 0) {
        return '0';
    }

    const { numerador: numSimplificado, denominador: denSimplificado } = simplifyFraction(numerador, denominador);

    if (denSimplificado === 1) {
        return `${numSimplificado}`;
    }

    return `${numSimplificado}/${denSimplificado}`;
};

// ===================================================
// ========== COMPONENTES VISUAIS ===================
// ===================================================

// Interface para o componente FractionDisplay
interface FractionDisplayProps {
    numerator: number;
    denominator: number;
    className?: string;
    simplify?: boolean;
}

// Componente React que apresenta frações visualmente estilizadas
// Exibe o numerador sobre o denominador com barra divisória
export const FractionDisplay: React.FC<FractionDisplayProps> = ({ 
    numerator, 
    denominator, 
    className = '', 
    simplify = false 
}) => {
    let displayNumerator = numerator;
    let displayDenominator = denominator;
    
    // Se a opção de simplificar estiver ativada, use a função simplificarFracao
    if (simplify && denominator !== 0) {
        const simplified = simplifyFraction(numerator, denominator);
        displayNumerator = simplified.numerador;
        displayDenominator = simplified.denominador;
    }
    
    // Caso especial para fração 0
    if (displayNumerator === 0) {
        return <span className={className}>0</span>;
    }
    
    // Caso especial para denominador 1
    if (displayDenominator === 1) {
        return <span className={className}>{displayNumerator}</span>;
    }
    
    // Caso especial para denominador 0
    if (displayDenominator === 0) {
        return <span className={className}>Indeterminado</span>;
    }
    
    return (
        <span className={`inline-flex flex-col items-center mx-1 ${className}`}>
            <span className="border-b border-gray-700 text-center px-1 font-bold">{displayNumerator}</span>
            <span className="text-center px-1 font-bold">{displayDenominator}</span>
        </span>
    );
};

// ===================================================
// ================= EXEMPLOS ÚTEIS =================
// ===================================================

// Retorna exemplos de pares de frações para operações de adição e subtração
export const getFractionAddSubExamples = (): Array<{
    num1: number,
    den1: number,
    num2: number,
    den2: number,
    operation: 'add' | 'sub',
    description: string
}> => {
    return [
        { num1: 1, den1: 2, num2: 1, den2: 3, operation: 'add', description: "1/2 + 1/3 (Denominadores diferentes)" },
        { num1: 3, den1: 4, num2: 1, den2: 4, operation: 'add', description: "3/4 + 1/4 (Mesmo denominador)" },
        { num1: 5, den1: 6, num2: 1, den2: 3, operation: 'add', description: "5/6 + 1/3 (Denominadores relacionados)" },
        { num1: 2, den1: 3, num2: 1, den2: 6, operation: 'add', description: "2/3 + 1/6 (Um denominador múltiplo do outro)" },
        { num1: 7, den1: 9, num2: 5, den2: 6, operation: 'add', description: "7/9 + 5/6 (Denominadores primos entre si)" },
        { num1: 1, den1: 2, num2: 3, den2: 4, operation: 'sub', description: "1/2 - 3/4 (Resultado negativo)" },
        { num1: 7, den1: 8, num2: 3, den2: 8, operation: 'sub', description: "7/8 - 3/8 (Mesmo denominador)" },
        { num1: 5, den1: 6, num2: 1, den2: 3, operation: 'sub', description: "5/6 - 1/3 (Denominadores relacionados)" },
        { num1: 4, den1: 5, num2: 1, den2: 10, operation: 'sub', description: "4/5 - 1/10 (Um denominador múltiplo do outro)" },
        { num1: 3, den1: 4, num2: 1, den2: 2, operation: 'sub', description: "3/4 - 1/2 (Resultado simples)" }
    ];
};


// Retorna exemplos para conversão entre frações mistas e impróprias
export const getMixedFractionExamples = (): Array<{
    part?: number,
    num: number,
    den: number,
    operation: 'toFraction' | 'toMixed',
    description: string
}> => {
    return [
        { part: 2, num: 3, den: 4, operation: 'toFraction', description: "2 + 3/4 (Positivo simples)" },
        { part: 5, num: 1, den: 2, operation: 'toFraction', description: "5 + 1/2 (Parte inteira grande)" },
        { part: -3, num: 2, den: 5, operation: 'toFraction', description: "-3 + 2/5 (Negativo com fração)" },
        { part: 1, num: 7, den: 8, operation: 'toFraction', description: "1 + 7/8 (Próximo de inteiro)" },
        { part: 0, num: 5, den: 6, operation: 'toFraction', description: "0 + 5/6 (Sem parte inteira)" },
        { num: 7, den: 4, operation: 'toMixed', description: "7/4 (Imprópria simples)" },
        { num: 15, den: 7, operation: 'toMixed', description: "15/7 (Parte inteira > 1)" },
        { num: -11, den: 3, operation: 'toMixed', description: "-11/3 (Imprópria negativa)" },
        { num: 23, den: 5, operation: 'toMixed', description: "23/5 (Imprópria grande)" },
        { num: 9, den: 9, operation: 'toMixed', description: "9/9 (Igual a 1)" }
    ];
};

// Fornece exemplos para o calculador de multiplicação e divisão de frações
export const getFractionMultDivExamples = (): Array<{
    num1: number,
    den1: number,
    num2: number,
    den2: number,
    operation: 'multiply' | 'divide',
    description: string
}> => {
    return [
        { num1: 1, den1: 2, num2: 3, den2: 4, operation: 'multiply', description: "1/2 × 3/4 (Frações simples)" },
        { num1: 3, den1: 5, num2: 2, den2: 3, operation: 'multiply', description: "3/5 × 2/3 (Produto com simplificação)" },
        { num1: 4, den1: 8, num2: 3, den2: 6, operation: 'multiply', description: "4/8 × 3/6 (Simplificáveis antes)" },
        { num1: -2, den1: 3, num2: 5, den2: 7, operation: 'multiply', description: "-2/3 × 5/7 (Fração negativa)" },
        { num1: 6, den1: 5, num2: 10, den2: 3, operation: 'multiply', description: "6/5 × 10/3 (Frações impróprias)" },
        { num1: 3, den1: 4, num2: 2, den2: 3, operation: 'divide', description: "3/4 ÷ 2/3 (Divisão simples)" },
        { num1: 5, den1: 6, num2: 5, den2: 9, operation: 'divide', description: "5/6 ÷ 5/9 (Mesmo numerador)" },
        { num1: 2, den1: 3, num2: 4, den2: 3, operation: 'divide', description: "2/3 ÷ 4/3 (Mesmo denominador)" },
        { num1: -7, den1: 8, num2: 2, den2: 5, operation: 'divide', description: "-7/8 ÷ 2/5 (Fração negativa)" },
        { num1: 9, den1: 4, num2: 3, den2: 2, operation: 'divide', description: "9/4 ÷ 3/2 (Frações impróprias)" }
    ];
};

// Fornece exemplos para o calculador de simplificação de frações
export const getFractionSimplificationExamples = (): Array<{
    num: number,
    den: number,
    description: string
}> => {
    return [
        { num: 4, den: 8, description: "4/8 (Simplifica para 1/2)" },
        { num: 15, den: 25, description: "15/25 (Simplifica para 3/5)" },
        { num: 36, den: 48, description: "36/48 (Simplifica para 3/4)" },
        { num: -10, den: 15, description: "-10/15 (Fração negativa)" },
        { num: 13, den: 17, description: "13/17 (Fração irredutível)" },
        { num: 12, den: 4, description: "12/4 (Simplifica para 3)" },
        { num: 45, den: 75, description: "45/75 (MDC = 15)" },
        { num: 56, den: 98, description: "56/98 (Simplifica para 4/7)" },
        { num: 120, den: 144, description: "120/144 (MDC grande)" },
        { num: -24, den: -36, description: "-24/-36 (Sinais negativos)" }
    ];
};