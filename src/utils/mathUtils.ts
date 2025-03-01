// Arredonda um número para um número específico de casas decimais
export const arredondarParaDecimais = (num: number, decimals: number = 2): number=> {
    const factor = Math.pow(10, decimals);
    return Math.round(num * factor) / factor;
};



