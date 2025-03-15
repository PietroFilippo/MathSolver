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
        { number: 12, description: "12 = 2² × 3" },
        { number: 60, description: "60 = 2² × 3 × 5" },
        { number: 84, description: "84 = 2² × 3 × 7" },
        { number: 100, description: "100 = 2² × 5²" },
        { number: 36, description: "36 = 2² × 3²" },
        { number: 17, description: "17 (número primo)" },
        { number: 45, description: "45 = 3² × 5" },
        { number: 144, description: "144 = 2⁴ × 3²" },
        { number: 210, description: "210 = 2 × 3 × 5 × 7" },
        { number: 64, description: "64 = 2⁶" }
    ];
};

// Função para obter exemplos de números para MMC/MDC
export const getMMCMDCExamples = (): Array<{ numbers: number[], description: string }> => {
    return [
        { numbers: [12, 18], description: "12, 18" },
        { numbers: [24, 36, 48], description: "24, 36, 48" },
        { numbers: [7, 13], description: "7, 13 (primos)" },
        { numbers: [15, 25, 35], description: "15, 25, 35" },
        { numbers: [16, 24, 36], description: "16, 24, 36" },
        { numbers: [17, 34, 51], description: "17, 34, 51" },
        { numbers: [100, 80, 60], description: "100, 80, 60" },
        { numbers: [35, 49, 63], description: "35, 49, 63" },
        { numbers: [8, 12, 20, 24], description: "8, 12, 20, 24" },
        { numbers: [9, 27, 81], description: "9, 27, 81" }
    ];
};

// Função para obter exemplos de cálculo de porcentagem
export const getPercentageExamples = (): Array<{ value: number, percentage: number, type: 'percentage' | 'percentageChange' | 'reversePercentage', description: string }> => {
    return [
        { value: 200, percentage: 15, type: 'percentage', description: "15% de 200" },
        { value: 50, percentage: 25, type: 'percentage', description: "25% de 50" },
        { value: 80, percentage: 120, type: 'percentage', description: "120% de 80" },
        { value: 1000, percentage: 7.5, type: 'percentage', description: "7.5% de 1000" },
        { value: 60, percentage: 80, type: 'percentageChange', description: "Variação de 60 para 80" },
        { value: 100, percentage: 75, type: 'percentageChange', description: "Variação de 100 para 75" },
        { value: 40, percentage: 55, type: 'percentageChange', description: "Variação de 40 para 55" },
        { value: 200, percentage: 250, type: 'percentageChange', description: "Variação de 200 para 250" },
        { value: 25, percentage: 20, type: 'reversePercentage', description: "25 é 20% de X" },
        { value: 75, percentage: 30, type: 'reversePercentage', description: "75 é 30% de X" }
    ];
};

// Função para obter exemplos de proporções
export const getProportionExamples = (): Array<{ a: number, b: number, c: number, d: number, solveFor: 'a' | 'b' | 'c' | 'd', description: string }> => {
    return [
        { a: 2, b: 4, c: 3, d: 6, solveFor: 'd', description: "2:4 = 3:?" },
        { a: 3, b: 9, c: 5, d: 15, solveFor: 'd', description: "3:9 = 5:?" },
        { a: 4, b: 5, c: 8, d: 10, solveFor: 'd', description: "4:5 = 8:?" },
        { a: 100, b: 25, c: 80, d: 20, solveFor: 'd', description: "100:25 = 80:?" },
        { a: 5, b: 8, c: 0, d: 16, solveFor: 'c', description: "5:8 = ?:16" },
        { a: 6, b: 18, c: 0, d: 30, solveFor: 'c', description: "6:18 = ?:30" },
        { a: 0, b: 3, c: 10, d: 15, solveFor: 'a', description: "?:3 = 10:15" },
        { a: 0, b: 12, c: 7, d: 84, solveFor: 'a', description: "?:12 = 7:84" },
        { a: 10, b: 0, c: 15, d: 30, solveFor: 'b', description: "10:? = 15:30" },
        { a: 8, b: 0, c: 4, d: 16, solveFor: 'b', description: "8:? = 4:16" }
    ];
};