// Arredonda um número para um número específico de casas decimais
export const arredondarParaDecimais = (num: number, decimais: number = 2): number=> {
    const factor = Math.pow(10, decimais);
    return Math.round(num * factor) / factor;
};

// Checa se dois números são aproximadamente iguais
export const aproximadamenteIguais = (a: number, b: number, precisao: number = 1e-10): boolean => {
    return Math.abs(a - b) < precisao;
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