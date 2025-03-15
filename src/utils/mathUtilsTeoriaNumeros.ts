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