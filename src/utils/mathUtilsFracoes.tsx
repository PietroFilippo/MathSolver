import React from 'react';
import { mdc } from './mathUtils';

// Simplifica uma fração
export const simplificarFracao = (numerador: number, denominador: number): {numerador: number, denominador: number} => {
    if (denominador === 0) {
        throw new Error('Denominador não pode ser zero');
    }

    const divisor = mdc(numerador, denominador);

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

// Formata uma fração como string
export const formatarFracao = (numerador: number, denominador: number): string => {
    if (denominador === 0) {
        return 'Indeterminado';
    }

    if (numerador === 0) {
        return '0';
    }

    const { numerador: numSimplificado, denominador: denSimplificado } = simplificarFracao(numerador, denominador);

    if (denSimplificado === 1) {
        return `${numSimplificado}`;
    }

    return `${numSimplificado}/${denSimplificado}`;
};

// Interface para o componente FractionDisplay
interface FractionDisplayProps {
    numerator: number;
    denominator: number;
    className?: string;
    simplify?: boolean;
}

// Componente para mostrar frações de forma visual
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
        const simplified = simplificarFracao(numerator, denominator);
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