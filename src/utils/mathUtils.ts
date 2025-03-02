// Arredonda um número para um número específico de casas decimais
export const arredondarParaDecimais = (num: number, decimais: number = 2): number=> {
    const factor = Math.pow(10, decimais);
    return Math.round(num * factor) / factor;
};

// Calcula o mínimo múltiplo comum (MMC) de dois números
export const mmc = (a: number, b: number): number => {
    const mdcValue = mdc(a, b);
    return (a * b) / mdcValue;
};

// Calcula o máximo divisor comum (MDC) de dois números
export const mdc = (a: number, b: number): number => {
    a = Math.abs(a);
    b = Math.abs(b);
    
    while (b) {
        const temp = b;
        b = a % b;
        a = temp;
    }
    return a;
};

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

// Formata uma fração
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
