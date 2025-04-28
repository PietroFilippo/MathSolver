// ===================================================
// ========== ESTRUTURAS DE CACHE ===================
// ===================================================

// Cache para armazenar números primos e compostos já verificados
// Melhora significativamente o desempenho para cálculos repetidos
const primeCache: Set<number> = new Set([2, 3, 5, 7, 11, 13]);
const compositeCache: Set<number> = new Set([0, 1, 4, 6, 8, 9, 10, 12]);

// ===================================================
// ========== VERIFICAÇÃO DE PRIMALIDADE =============
// ===================================================


// Verifica se um número é primo
// Utiliza cache para otimizar verificações repetidas
export const isPrime = (num: number): boolean => {
    // Verifica primeiro no cache para resultados já conhecidos
    if (primeCache.has(num)) return true;
    if (compositeCache.has(num)) return false;
    
    // Casos base para eficiência
    if (num <= 1) {
        compositeCache.add(num);
        return false;
    }
    if (num <= 3) {
        primeCache.add(num);
        return true;
    }
    
    if (num % 2 === 0 || num % 3 === 0) {
        compositeCache.add(num);
        return false;
    }
    
    // Verifica primalidade usando otimização 6k±1
    for (let i = 5; i * i <= num; i += 6) {
        if (num % i === 0 || num % (i + 2) === 0) {
            compositeCache.add(num);
            return false;
        }
    }
    
    // Se chegamos aqui, o número é primo
    primeCache.add(num);
    return true;
};

// Array otimizado com os primeiros primos para acelerar operações
const smallPrimes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97];

// ===================================================
// ========== OPERAÇÕES COM NÚMEROS PRIMOS ===========
// ===================================================


// Encontra o próximo número primo após um dado número
// Utiliza cache e otimizações para melhorar performance
export const nextPrime = (num: number): number => {
    // Para números menores que o maior primo cacheado, buscamos diretamente
    if (num < smallPrimes[smallPrimes.length - 1]) {
        for (const prime of smallPrimes) {
            if (prime > num) return prime;
        }
    }
    
    // Para números muito pequenos, retorna o primeiro primo
    if (num < 2) return 2;
    
    // Começa do próximo número ímpar (ou do próximo número se já for ímpar)
    let candidate = num + 1;
    if (candidate % 2 === 0) candidate++;
    
    // Verifica candidatos até encontrar um primo
    while (!isPrime(candidate)) {
        candidate += 2; // Pula números pares
    }
    
    return candidate;
};


// Fatoração de um número em seus fatores primos
// Utiliza cache de primos para otimizar cálculos
export const factorNumberIntoPrimes = (num: number): {factors: number[], exponents: number[]} => {
    const factors: number[] = [];
    const exponents: number[] = [];
    
    if (num <= 1) {
        return { factors, exponents };
    }
    
    // Verifica se o próprio número é primo
    if (isPrime(num)) {
        return { factors: [num], exponents: [1] };
    }
    
    let currentNumber = num;
    
    // Começa com primos pequenos para eficiência
    for (const prime of smallPrimes) {
        if (currentNumber % prime === 0) {
            factors.push(prime);
            let exponent = 0;
            
            while (currentNumber % prime === 0) {
                exponent++;
                currentNumber /= prime;
            }
            
            exponents.push(exponent);
            
            // Se encontramos todos os fatores
            if (currentNumber === 1) break;
            
            // Se o número restante é primo, adiciona-o e sai
            if (isPrime(currentNumber)) {
                factors.push(currentNumber);
                exponents.push(1);
                break;
            }
        }
        
        // Não precisamos verificar mais se já reduzimos para um número menor
        if (prime * prime > currentNumber) {
            if (currentNumber > 1) {
                factors.push(currentNumber);
                exponents.push(1);
            }
            break;
        }
    }
    
    // Se ainda temos um número > 1, precisamos continuar a fatoração
    if (currentNumber > 1 && !factors.includes(currentNumber)) {
        let divisor = nextPrime(smallPrimes[smallPrimes.length - 1]);
        
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
                
                // Se o número restante é primo, adiciona-o e sai
                if (isPrime(currentNumber)) {
                    if (currentNumber !== 1) {
                        factors.push(currentNumber);
                        exponents.push(1);
                    }
                    break;
                }
            } else {
                divisor = nextPrime(divisor);
            }
        }
    }
    
    return { factors, exponents };
};

// Gera uma lista de números primos até um limite especificado
// Utiliza o algoritmo Sieve of Eratosthenes para maior eficiência
export const generatePrimesUpTo = (limite: number): number[] => {
    // Para limites pequenos, retorna do array pré-computado
    if (limite <= smallPrimes[smallPrimes.length - 1]) {
        return smallPrimes.filter(prime => prime <= limite);
    }
    
    // Usa o Crivo de Eratóstenes para limites maiores
    const sieve = new Array(limite + 1).fill(true);
    sieve[0] = sieve[1] = false;
    
    for (let i = 2; i * i <= limite; i++) {
        if (sieve[i]) {
            for (let j = i * i; j <= limite; j += i) {
                sieve[j] = false;
            }
        }
    }
    
    // Extrai primos do crivo
    const primes: number[] = [];
    for (let i = 2; i <= limite; i++) {
        if (sieve[i]) {
            primes.push(i);
            primeCache.add(i);
        } else {
            compositeCache.add(i);
        }
    }
    
    return primes;
};

// ===================================================
// ================= EXEMPLOS ÚTEIS =================
// ===================================================

// Função para obter exemplos de números para fatoração
export const getFactorizationExamples = (): Array<{ number: number, description: string }> => {
    return [
        { number: 12, description: "arithmetic:number_theory.examples.factorization.12" },
        { number: 60, description: "arithmetic:number_theory.examples.factorization.60" },
        { number: 84, description: "arithmetic:number_theory.examples.factorization.84" },
        { number: 100, description: "arithmetic:number_theory.examples.factorization.100" },
        { number: 36, description: "arithmetic:number_theory.examples.factorization.36" },
        { number: 17, description: "arithmetic:number_theory.examples.factorization.17" },
        { number: 45, description: "arithmetic:number_theory.examples.factorization.45" },
        { number: 144, description: "arithmetic:number_theory.examples.factorization.144" },
        { number: 210, description: "arithmetic:number_theory.examples.factorization.210" },
        { number: 64, description: "arithmetic:number_theory.examples.factorization.64" }
    ];
};

// Função para obter exemplos de números para MMC/MDC
export const getMMCMDCExamples = (): Array<{ numbers: number[], description: string, type: 'lcm' | 'gcd' }> => {
    return [
        { numbers: [12, 18], description: "arithmetic:number_theory.examples.lcm_gcd.12_18", type: 'lcm' },
        { numbers: [24, 36, 48], description: "arithmetic:number_theory.examples.lcm_gcd.24_36_48", type: 'lcm' },
        { numbers: [7, 13], description: "arithmetic:number_theory.examples.lcm_gcd.7_13", type: 'lcm' },
        { numbers: [15, 25, 35], description: "arithmetic:number_theory.examples.lcm_gcd.15_25_35", type: 'lcm' },
        { numbers: [16, 24, 36], description: "arithmetic:number_theory.examples.lcm_gcd.16_24_36", type: 'lcm' },
        { numbers: [17, 34, 51], description: "arithmetic:number_theory.examples.lcm_gcd.17_34_51", type: 'gcd' },
        { numbers: [100, 80, 60], description: "arithmetic:number_theory.examples.lcm_gcd.100_80_60", type: 'gcd' },
        { numbers: [35, 49, 63], description: "arithmetic:number_theory.examples.lcm_gcd.35_49_63", type: 'gcd' },
        { numbers: [8, 12, 20, 24], description: "arithmetic:number_theory.examples.lcm_gcd.8_12_20_24", type: 'gcd' },
        { numbers: [9, 27, 81], description: "arithmetic:number_theory.examples.lcm_gcd.9_27_81", type: 'gcd' }
    ];
};

// Função para obter exemplos de cálculo de porcentagem
export const getPercentageExamples = (): Array<{ value: number, percentage: number, type: 'percentage' | 'percentageChange' | 'reversePercentage', description: string }> => {
    return [
        { value: 200, percentage: 15, type: 'percentage', description: "arithmetic:number_theory.examples.percentage.15_of_200" },
        { value: 50, percentage: 25, type: 'percentage', description: "arithmetic:number_theory.examples.percentage.25_of_50" },
        { value: 80, percentage: 120, type: 'percentage', description: "arithmetic:number_theory.examples.percentage.120_of_80" },
        { value: 1000, percentage: 7.5, type: 'percentage', description: "arithmetic:number_theory.examples.percentage.7_5_of_1000" },
        { value: 60, percentage: 80, type: 'percentageChange', description: "arithmetic:number_theory.examples.percentage.change_60_to_80" },
        { value: 100, percentage: 75, type: 'percentageChange', description: "arithmetic:number_theory.examples.percentage.change_100_to_75" },
        { value: 40, percentage: 55, type: 'percentageChange', description: "arithmetic:number_theory.examples.percentage.change_40_to_55" },
        { value: 200, percentage: 250, type: 'percentageChange', description: "arithmetic:number_theory.examples.percentage.change_200_to_250" },
        { value: 25, percentage: 20, type: 'reversePercentage', description: "arithmetic:number_theory.examples.percentage.25_is_20_percent" },
        { value: 75, percentage: 30, type: 'reversePercentage', description: "arithmetic:number_theory.examples.percentage.75_is_30_percent" }
    ];
};

// Função para obter exemplos de proporções
export const getProportionExamples = (): Array<{ a: number, b: number, c: number, d: number, solveFor: 'a' | 'b' | 'c' | 'd', description: string }> => {
    return [
        { a: 2, b: 4, c: 3, d: 6, solveFor: 'd', description: "arithmetic:number_theory.examples.proportion.2_4_3_x" },
        { a: 3, b: 9, c: 5, d: 15, solveFor: 'd', description: "arithmetic:number_theory.examples.proportion.3_9_5_x" },
        { a: 4, b: 5, c: 8, d: 10, solveFor: 'd', description: "arithmetic:number_theory.examples.proportion.4_5_8_x" },
        { a: 100, b: 25, c: 80, d: 20, solveFor: 'd', description: "arithmetic:number_theory.examples.proportion.100_25_80_x" },
        { a: 5, b: 8, c: 0, d: 16, solveFor: 'c', description: "arithmetic:number_theory.examples.proportion.5_8_x_16" },
        { a: 6, b: 18, c: 0, d: 30, solveFor: 'c', description: "arithmetic:number_theory.examples.proportion.6_18_x_30" },
        { a: 0, b: 3, c: 10, d: 15, solveFor: 'a', description: "arithmetic:number_theory.examples.proportion.x_3_10_15" },
        { a: 0, b: 12, c: 7, d: 84, solveFor: 'a', description: "arithmetic:number_theory.examples.proportion.x_12_7_84" },
        { a: 10, b: 0, c: 15, d: 30, solveFor: 'b', description: "arithmetic:number_theory.examples.proportion.10_x_15_30" },
        { a: 8, b: 0, c: 4, d: 16, solveFor: 'b', description: "arithmetic:number_theory.examples.proportion.8_x_4_16" }
    ];
};