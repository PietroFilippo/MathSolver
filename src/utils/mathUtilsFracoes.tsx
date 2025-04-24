import React from 'react';
import { gcd } from './mathUtils';
import { useTranslation } from 'react-i18next';

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

// Função auxiliar para obter a chave de tradução do tipo de exemplo
// Deve ser usada com o hook useTranslation em componentes
export const getExampleTranslationKey = (key: string, t: any) => {
    return t(`fractions.examples.${key}`);
};

// Retorna exemplos de pares de frações para operações de adição e subtração
export const getFractionAddSubExamples = (t?: any): Array<{
    num1: number,
    den1: number,
    num2: number,
    den2: number,
    operation: 'add' | 'sub',
    description: string
}> => {
    const examples = [
        { num1: 1, den1: 2, num2: 1, den2: 3, operation: 'add' as const, descriptionKey: "different_denominators", fraction: "1/2 + 1/3" },
        { num1: 3, den1: 4, num2: 1, den2: 4, operation: 'add' as const, descriptionKey: "same_denominator", fraction: "3/4 + 1/4" },
        { num1: 5, den1: 6, num2: 1, den2: 3, operation: 'add' as const, descriptionKey: "related_denominators", fraction: "5/6 + 1/3" },
        { num1: 2, den1: 3, num2: 1, den2: 6, operation: 'add' as const, descriptionKey: "multiple_denominator", fraction: "2/3 + 1/6" },
        { num1: 7, den1: 9, num2: 5, den2: 6, operation: 'add' as const, descriptionKey: "coprime_denominators", fraction: "7/9 + 5/6" },
        { num1: 1, den1: 2, num2: 3, den2: 4, operation: 'sub' as const, descriptionKey: "negative_result", fraction: "1/2 - 3/4" },
        { num1: 7, den1: 8, num2: 3, den2: 8, operation: 'sub' as const, descriptionKey: "same_denominator", fraction: "7/8 - 3/8" },
        { num1: 5, den1: 6, num2: 1, den2: 3, operation: 'sub' as const, descriptionKey: "related_denominators", fraction: "5/6 - 1/3" },
        { num1: 4, den1: 5, num2: 1, den2: 10, operation: 'sub' as const, descriptionKey: "multiple_denominator", fraction: "4/5 - 1/10" },
        { num1: 3, den1: 4, num2: 1, den2: 2, operation: 'sub' as const, descriptionKey: "simple_result", fraction: "3/4 - 1/2" }
    ];

    // Se t não for fornecido, retorna com a descrição bruta
    if (!t) {
        return examples.map(ex => ({
            num1: ex.num1,
            den1: ex.den1,
            num2: ex.num2,
            den2: ex.den2,
            operation: ex.operation,
            description: `${ex.fraction} (${ex.descriptionKey})`
        }));
    }

    // Com t disponível, traduz as descrições
    return examples.map(ex => ({
        num1: ex.num1,
        den1: ex.den1,
        num2: ex.num2,
        den2: ex.den2,
        operation: ex.operation,
        description: `${ex.fraction} (${t(`addition_subtraction.examples.${ex.descriptionKey}`)})`
    }));
};

// Retorna exemplos para conversão entre frações mistas e impróprias
export const getMixedFractionExamples = (t?: any): Array<{
    part?: number,
    num: number,
    den: number,
    operation: 'toFraction' | 'toMixed',
    description: string
}> => {
    const examples = [
        { part: 2, num: 3, den: 4, operation: 'toFraction' as const, descriptionKey: "simple_positive", fraction: "2 + 3/4" },
        { part: 5, num: 1, den: 2, operation: 'toFraction' as const, descriptionKey: "large_integer", fraction: "5 + 1/2" },
        { part: -3, num: 2, den: 5, operation: 'toFraction' as const, descriptionKey: "negative_with_fraction", fraction: "-3 + 2/5" },
        { part: 1, num: 7, den: 8, operation: 'toFraction' as const, descriptionKey: "near_integer", fraction: "1 + 7/8" },
        { part: 0, num: 5, den: 6, operation: 'toFraction' as const, descriptionKey: "no_integer_part", fraction: "0 + 5/6" },
        { num: 7, den: 4, operation: 'toMixed' as const, descriptionKey: "simple_improper", fraction: "7/4" },
        { num: 15, den: 7, operation: 'toMixed' as const, descriptionKey: "integer_part_greater_than_one", fraction: "15/7" },
        { num: -11, den: 3, operation: 'toMixed' as const, descriptionKey: "negative_improper", fraction: "-11/3" },
        { num: 23, den: 5, operation: 'toMixed' as const, descriptionKey: "large_improper", fraction: "23/5" },
        { num: 9, den: 9, operation: 'toMixed' as const, descriptionKey: "equal_to_one", fraction: "9/9" }
    ];

    // Se t não for fornecido, retorna com a descrição bruta
    if (!t) {
        return examples.map(ex => ({
            ...(ex.part !== undefined ? { part: ex.part } : {}),
            num: ex.num,
            den: ex.den,
            operation: ex.operation,
            description: `${ex.fraction} (${ex.descriptionKey})`
        }));
    }

    // Com t disponível, traduz as descrições
    return examples.map(ex => ({
        ...(ex.part !== undefined ? { part: ex.part } : {}),
        num: ex.num,
        den: ex.den,
        operation: ex.operation,
        description: `${ex.fraction} (${t(`mixed_fractions.examples.${ex.descriptionKey}`)})`
    }));
};

// Fornece exemplos para o calculador de multiplicação e divisão de frações
export const getFractionMultDivExamples = (t?: any): Array<{
    num1: number,
    den1: number,
    num2: number,
    den2: number,
    operation: 'multiply' | 'divide',
    description: string
}> => {
    const examples = [
        { num1: 1, den1: 2, num2: 3, den2: 4, operation: 'multiply' as const, descriptionKey: "simple_fractions", fraction: "1/2 × 3/4" },
        { num1: 3, den1: 5, num2: 2, den2: 3, operation: 'multiply' as const, descriptionKey: "product_with_simplification", fraction: "3/5 × 2/3" },
        { num1: 4, den1: 8, num2: 3, den2: 6, operation: 'multiply' as const, descriptionKey: "simplifiable_before", fraction: "4/8 × 3/6" },
        { num1: -2, den1: 3, num2: 5, den2: 7, operation: 'multiply' as const, descriptionKey: "negative_fraction", fraction: "-2/3 × 5/7" },
        { num1: 6, den1: 5, num2: 10, den2: 3, operation: 'multiply' as const, descriptionKey: "improper_fractions", fraction: "6/5 × 10/3" },
        { num1: 3, den1: 4, num2: 2, den2: 3, operation: 'divide' as const, descriptionKey: "simple_division", fraction: "3/4 ÷ 2/3" },
        { num1: 5, den1: 6, num2: 5, den2: 9, operation: 'divide' as const, descriptionKey: "same_numerator", fraction: "5/6 ÷ 5/9" },
        { num1: 2, den1: 3, num2: 4, den2: 3, operation: 'divide' as const, descriptionKey: "same_denominator", fraction: "2/3 ÷ 4/3" },
        { num1: -7, den1: 8, num2: 2, den2: 5, operation: 'divide' as const, descriptionKey: "negative_fraction", fraction: "-7/8 ÷ 2/5" },
        { num1: 9, den1: 4, num2: 3, den2: 2, operation: 'divide' as const, descriptionKey: "improper_fractions", fraction: "9/4 ÷ 3/2" }
    ];

    // Se t não for fornecido, retorna com a descrição bruta
    if (!t) {
        return examples.map(ex => ({
            num1: ex.num1,
            den1: ex.den1,
            num2: ex.num2,
            den2: ex.den2,
            operation: ex.operation,
            description: `${ex.fraction} (${ex.descriptionKey})`
        }));
    }

    // Com t disponível, traduz as descrições
    return examples.map(ex => ({
        num1: ex.num1,
        den1: ex.den1,
        num2: ex.num2,
        den2: ex.den2,
        operation: ex.operation,
        description: `${ex.fraction} (${t(`multiplication_division.examples.${ex.descriptionKey}`)})`
    }));
};

// Fornece exemplos para o calculador de simplificação de frações
export const getFractionSimplificationExamples = (t?: any): Array<{
    num: number,
    den: number,
    description: string
}> => {
    const examples = [
        { num: 4, den: 8, descriptionKey: "simplifies_to_1_2", fraction: "4/8" },
        { num: 15, den: 25, descriptionKey: "simplifies_to_3_5", fraction: "15/25" },
        { num: 36, den: 48, descriptionKey: "simplifies_to_3_4", fraction: "36/48" },
        { num: -10, den: 15, descriptionKey: "negative_fraction", fraction: "-10/15" },
        { num: 13, den: 17, descriptionKey: "already_reduced", fraction: "13/17" },
        { num: 12, den: 4, descriptionKey: "simplifies_to_integer", fraction: "12/4" },
        { num: 45, den: 75, descriptionKey: "large_gcd", fraction: "45/75" },
        { num: 56, den: 98, descriptionKey: "simplifies_to_4_7", fraction: "56/98" },
        { num: 120, den: 144, descriptionKey: "large_numbers", fraction: "120/144" },
        { num: -24, den: -36, descriptionKey: "negative_signs", fraction: "-24/-36" }
    ];

    // Se t não for fornecido, retorna com a descrição bruta
    if (!t) {
        return examples.map(ex => ({
            num: ex.num,
            den: ex.den,
            description: `${ex.fraction} (${ex.descriptionKey})`
        }));
    }

    // Com t disponível, traduz as descrições
    return examples.map(ex => ({
        num: ex.num,
        den: ex.den,
        description: `${ex.fraction} (${t(`simplification.examples.${ex.descriptionKey}`)})`
    }));
};

// Hook personalizado para usar os exemplos com traduções
export const useFractionExamples = () => {
    const { t } = useTranslation();
    
    return {
        addSubExamples: getFractionAddSubExamples(t),
        mixedFractionExamples: getMixedFractionExamples(t),
        multDivExamples: getFractionMultDivExamples(t),
        simplificationExamples: getFractionSimplificationExamples(t)
    };
};