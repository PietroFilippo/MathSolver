// Verifica se um número é primo
export const numPrimo = (num: number): boolean => {
    if (num <= 1) return false;
    if (num <= 3) return true;
    
    if (num % 2 === 0 || num % 3 === 0) return false;
    
    for (let i = 5; i * i <= num; i += 6) {
        if (num % i === 0 || num % (i + 2) === 0) return false;
    }
    
    return true;
};

// Encontra o próximo número primo após um dado número
export const proximoPrimo = (num: number): number => {
    if (num <= 1) return 2;
    
    let prime = num;
    let found = false;
    
    while (!found) {
        prime++;
        
        if (numPrimo(prime)) found = true;
    }
    
    return prime;
};

// Fatoração de um número em seus fatores primos
export const fatorarNumeroEmPrimos = (num: number): {factors: number[], exponents: number[]} => {
    const factors: number[] = [];
    const exponents: number[] = [];
    
    if (num <= 1) {
        return { factors, exponents };
    }
    
    let currentNumber = num;
    let divisor = 2;
    
    while (currentNumber > 1) {
        if (currentNumber % divisor === 0) {
            // Verifica se o fator já existe na lista
            const existingIndex = factors.indexOf(divisor);
            
            if (existingIndex === -1) {
                factors.push(divisor);
                exponents.push(1);
            } else {
                exponents[existingIndex]++;
            }
            
            currentNumber /= divisor;
        } else {
            divisor = proximoPrimo(divisor);
        }
    }
    
    return { factors, exponents };
};