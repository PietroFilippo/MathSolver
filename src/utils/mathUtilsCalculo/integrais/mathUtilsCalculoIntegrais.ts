import { 
  Term, 
  termToString, 
  getMathExamples,
  safelyEvaluateExpression,
  mathExpressionToJsExpression,
  parseExpression,
  handleMathError
} from '../geral/mathUtilsCalculoGeral';

import {
  integralResultCache,
  getCacheKey,
  addToCache,
  getFromCache
} from './integralCache';

import {
  detectIntegralPattern,
  findMatchingPattern
} from './integralPatterns';

import {
  calculateConstantIntegral,
  calculateVariableIntegral,
  calculatePowerIntegral,
  calculateTrigIntegral,
  calculateLogExpIntegral,
  calculateSumDiffIntegral,
  calculateProductIntegral,
  calculateQuotientIntegral,
  calculateSqrtIntegral,
  calculateSumDiffIntegralOptimized,
  calculateProductIntegralOptimized
} from './integralCalculators';

// ===================================================
// ===== MODULO DE CALCULO DE INTEGRAL PRINCIPAL =====
// ===================================================

// Declaração antecipada da função de integração principal
let calculateIntegral: (term: Term, variable: string) => string;


// Função de integração principal para termos individuais
// Encaminha para o calculador apropriado com base no tipo de termo
function integrateTerm(term: Term, variable: string): string {
  try {
    if (!term) return "0";
    
    // Verifica o cache primeiro para eficiência
    const termStr = termToString(term);
    const cacheKey = getCacheKey(termStr, variable);
    if (integralResultCache[cacheKey]) {
      return integralResultCache[cacheKey];
    }
    
    // Verificar padrões especiais
    const patternMatch = detectIntegralPattern(termStr, variable);
    if (patternMatch.pattern) {
      // Armazenar no cache para reutilização
      addToCache(cacheKey, patternMatch.result as string);
      return patternMatch.result as string;
    }
    
    // Continua com o encaminhamento baseado no tipo para padrões não registrados
    let result: string;
    
    switch (term.type) {
      case 'constant':
        result = calculateConstantIntegral(term, variable);
        break;
        
      case 'variable':
        result = calculateVariableIntegral(term, variable);
        break;
        
      case 'power':
        result = calculatePowerIntegral(term, variable, calculateIntegral);
        break;
        
      case 'sin':
      case 'cos':
      case 'tan':
        result = calculateTrigIntegral(term, variable);
        break;
        
      case 'ln':
      case 'log':
      case 'exp':
        result = calculateLogExpIntegral(term, variable);
        break;
        
      case 'sum':
      case 'difference':
        // Usa a versão otimizada que pode processar em paralelo
        const sumResult = calculateSumDiffIntegralOptimized(term, variable, calculateIntegral);
        
        // Verifica se o resultado é uma Promise
        if (sumResult instanceof Promise) {
          // Se for uma promessa, define um resultado intermediário
          result = `integral(${termToString(term)})`;
          
          // Processa a promessa e atualiza o cache quando concluída
          sumResult.then(resolvedResult => {
            addToCache(cacheKey, resolvedResult);
          }).catch(() => {
            // Em caso de erro, usar a versão sequencial
            const fallbackResult = calculateSumDiffIntegral(term, variable, calculateIntegral);
            addToCache(cacheKey, fallbackResult);
          });
        } else {
          // Resultado síncrono
          result = sumResult;
        }
        break;
        
      case 'product':
        // Usa a versão otimizada que pode processar em paralelo
        const productResult = calculateProductIntegralOptimized(term, variable, calculateIntegral);
        
        // Verifica se o resultado é uma Promise
        if (productResult instanceof Promise) {
          // Se for uma promessa, define um resultado intermediário
          result = `integral(${termToString(term)})`;
          
          // Processa a promessa e atualiza o cache quando concluída
          productResult.then(resolvedResult => {
            addToCache(cacheKey, resolvedResult);
          }).catch(() => {
            // Em caso de erro, usar a versão sequencial
            const fallbackResult = calculateProductIntegral(term, variable, calculateIntegral);
            addToCache(cacheKey, fallbackResult);
          });
        } else {
          // Resultado síncrono
          result = productResult;
        }
        break;
        
      case 'quotient':
        result = calculateQuotientIntegral(term, variable);
        break;
        
      case 'sqrt':
        result = calculateSqrtIntegral(term, variable);
        break;
        
      default:
        result = `integral(${termToString(term)})`;
    }
    
    // Armazenar o resultado no cache para reutilização
    addToCache(cacheKey, result);
    return result;
  } catch (error) {
    // Abordagem padronizada para tratamento de erros: retornar expressão não calculada
    const termStr = termToString(term);
    return `integral(${termStr})`;
  }
}

// Função principal que calcula a integral de uma expressão
// Adiciona o "+ C" ao resultado final e trata casos especiais
calculateIntegral = (term: Term, variable: string): string => {
  try {
    // Verificar cache antes de processar
    const termStr = termToString(term);
    const cacheKey = getCacheKey(termStr, variable);
    const cachedResult = getFromCache(cacheKey);
    
    if (cachedResult) {
      // Se o resultado já é uma notação de integral, não adicione "+ C"
      if (cachedResult.startsWith('integral(')) {
        return cachedResult;
      }
      return `${cachedResult} + C`;
    }
    
    // Primeiro, tente uma correspondência de padrão direta
    const structureMatch = findMatchingPattern(term, variable);
    if (structureMatch) {
      const result = structureMatch.result;
      
      // Armazena no cache sem o "+ C" para reutilização em termos compostos
      addToCache(cacheKey, result);
      
      // Se o resultado já é uma notação de integral, não adicione "+ C"
      if (result.startsWith('integral(')) {
        return result;
      }
      return `${result} + C`;
    }
    
    // Casos especiais para somas e diferenças
    if (term.type === 'sum' || term.type === 'difference') {
      const sumResult = calculateSumDiffIntegralOptimized(term, variable, calculateIntegral);
      
      if (sumResult instanceof Promise) {
        // Para promessas, retorne um placeholder e atualize o cache depois
        sumResult.then(resolvedResult => {
          // Armazena o resultado sem o "+ C"
          if (!resolvedResult.startsWith('integral(')) {
            addToCache(cacheKey, resolvedResult);
          }
        });
        
        // Enquanto isso, continue com o método sequencial
        const leftResult = term.left ? integrateTerm(term.left, variable) : '0';
        const rightResult = term.right ? integrateTerm(term.right, variable) : '0';
        
        const result = term.type === 'sum' 
          ? `${leftResult} + ${rightResult}` 
          : `${leftResult} - (${rightResult})`;
          
        // Armazena o resultado sem o "+ C"
        addToCache(cacheKey, result);
        
        // Retorna com o "+ C"
        return `${result} + C`;
      } else {
        // Para resultados síncronos, armazene e retorne normalmente
        // Armazena o resultado sem o "+ C"
        addToCache(cacheKey, sumResult);
        
        // Se o resultado já é uma notação de integral, não adicione "+ C"
        if (sumResult.startsWith('integral(')) {
          return sumResult;
        }
        return `${sumResult} + C`;
      }
    }
    
    // Para outros tipos de termos, use a função integrateTerm
    const result = integrateTerm(term, variable);
    
    // Se o resultado já é uma notação de integral, não adicione "+ C"
    if (result.startsWith('integral(')) {
      return result;
    }
    
    return `${result} + C`;
  } catch (error) {
    return `integral(${termToString(term)}) + C`;
  }
};

// Exporta calculateIntegral para compatibilidade com versões anteriores
export { calculateIntegral };

// ===================================================
// ============= FUNCOES API PUBLICAS ================
// ===================================================

// Função wrapper para calcular integral de uma string de expressão
export function calculateIntegralFromExpression(expression: string, variable: string = 'x', forDefiniteIntegral: boolean = false): string {
  try {
    // Verifica cache primeiro para eficiência
    const cacheKey = getCacheKey(expression, variable);
    if (integralResultCache[cacheKey]) {
      // Verifica se o resultado do cache já tem "+ C" e lida com isso
      const cachedResult = integralResultCache[cacheKey];
      return forDefiniteIntegral ? cachedResult : (cachedResult.includes(" + C") ? cachedResult : cachedResult + " + C");
    }
    
    // Primeiro use o sistema de detecção de padrões unificado
    const patternMatch = detectIntegralPattern(expression, variable);
    if (patternMatch.pattern) {
      const result = patternMatch.result as string;
      // Armazena o resultado sem "+ C" no cache
      integralResultCache[cacheKey] = result.replace(/ \+ C$/, '');
      return forDefiniteIntegral ? result.replace(/ \+ C$/, '') : (result.includes(" + C") ? result : result + " + C");
    }
    
    // Se nenhum padrão detectado, analisa e usa o enfoque baseado em termo
    const term = parseExpression(expression);
    if (!term) {
      return `integral(${expression})`;
    }
    
    const result = calculateIntegral(term, variable);
    // Sempre armazena resultados sem "+ C" no cache
    integralResultCache[cacheKey] = result.replace(/ \+ C$/, '');
    // Para o valor de retorno, verifica se já tem "+ C" antes de adicioná-lo
    return forDefiniteIntegral ? result.replace(/ \+ C$/, '') : (result.includes(" + C") ? result : result + " + C");
  } catch (error) {
    return handleMathError('integral', expression, error);
  }
}


// Processa strings de limite para converter para valores numéricos
// Lida com PI, frações e outras notações especiais
function processLimit(limit: string): number {
  // Limpar e normalizar a string
  const cleanLimit = limit.trim().toLowerCase();
  
  // Substituir "pi" ou "π" por Math.PI
  if (cleanLimit === "pi" || cleanLimit === "π") return Math.PI;
  
  // Lidar com frações de pi
  if (cleanLimit.includes("pi/") || cleanLimit.includes("π/")) {
    const parts = cleanLimit.split(/(?:pi|π)\//);
    const denominator = parseFloat(parts[1]);
    if (!isNaN(denominator) && denominator !== 0) {
      return Math.PI / denominator;
    }
  }
  
  // Lidar com múltiplos de pi
  if (cleanLimit.includes("pi*") || cleanLimit.includes("*pi") || 
      cleanLimit.includes("π*") || cleanLimit.includes("*π")) {
    const parts = cleanLimit.split(/\*(?:pi|π)|(?:pi|π)\*/);
    const multiplier = parseFloat(parts[0] || parts[1]);
    if (!isNaN(multiplier)) {
      return multiplier * Math.PI;
    }
  }
  
  // Tentar converter diretamente para número
  const numValue = parseFloat(cleanLimit);
  if (!isNaN(numValue)) {
    return numValue;
  }
  
  throw new Error(`Limite inválido: ${limit}. Use um número, 'π', ou uma expressão como 'π/2'.`);
}

// Avalia uma integral definida com limites dados
export function evaluateDefiniteIntegral(
  primitiveExpression: string, 
  variable: string, 
  lowerLimitStr: string | number, 
  upperLimitStr: string | number
): number {
  try {
    // Remove "+ C" da expressão primitiva se presente
    let cleanExpression = primitiveExpression.replace(/\s*\+\s*C$/, '');
    
    // Processa os limites
    const lowerLimit = typeof lowerLimitStr === 'string' 
      ? processLimit(lowerLimitStr) 
      : lowerLimitStr;
    
    const upperLimit = typeof upperLimitStr === 'string'
      ? processLimit(upperLimitStr)
      : upperLimitStr;
    
    // Verifica casos especiais
    if (cleanExpression.startsWith('integral(')) {
      throw new Error(`Não foi possível calcular a primitiva para avaliação: ${cleanExpression}`);
    }
    
    // Verifica se a função inclui 1/x e os limites cruzam zero
    if (cleanExpression.includes('ln|x|') && 
        ((lowerLimit <= 0 && upperLimit >= 0) || (lowerLimit >= 0 && upperLimit <= 0))) {
      throw new Error(`A função 1/x não está definida em x=0. Escolha limites que não incluam o zero.`);
    }

    // Caso especial para 1/x -> ln|x|
    if (cleanExpression === 'ln|x|') {
      // Para 1/x, a integral definida é ln|b| - ln|a|
      const upperValue = Math.log(Math.abs(upperLimit));
      const lowerValue = Math.log(Math.abs(lowerLimit));
      return Math.round((upperValue - lowerValue) * 1000) / 1000;
    }
    
    // Caso especial para e^x
    if (cleanExpression === `e^${variable}` || 
        cleanExpression === `exp(${variable})` ||
        cleanExpression === `Math.exp(${variable})`) {
      const upperValue = Math.exp(upperLimit);
      const lowerValue = Math.exp(lowerLimit);
      return Math.round((upperValue - lowerValue) * 1000) / 1000;
    }

    // Converte para expressão JavaScript e avalia
    try {
      const jsExpression = mathExpressionToJsExpression(cleanExpression, variable);
      
      // Calcula F(b) - F(a) usando a primitiva
      const upperValue = safelyEvaluateExpression(jsExpression, variable, upperLimit);
      const lowerValue = safelyEvaluateExpression(jsExpression, variable, lowerLimit);
      
      // Verifica se os resultados são válidos
      if (isNaN(upperValue) || isNaN(lowerValue) || !isFinite(upperValue) || !isFinite(lowerValue)) {
        throw new Error(`Erro ao avaliar os limites da integral. Verifique se a função é contínua no intervalo [${lowerLimitStr}, ${upperLimitStr}].`);
      }
      
      // Arredonda para evitar erros de ponto flutuante
      return Math.round((upperValue - lowerValue) * 1000) / 1000;
    } catch (error) {
      throw new Error(`Erro ao avaliar a integral: ${error instanceof Error ? error.message : String(error)}`);
    }
  } catch (error) {
    throw new Error(`Não foi possível calcular a integral definida: ${error instanceof Error ? error.message : String(error)}`);
  }
}

// Exemplos de fornecimento para teste e demonstração
export function getIntegralsExamples(): string[] {
  return getMathExamples('integral') as string[];
}

export function getDefinedIntegralsExamples(): Array<{funcao: string, limiteInferior: string, limiteSuperior: string}> {
  return getMathExamples('definiteIntegral') as Array<{funcao: string, limiteInferior: string, limiteSuperior: string}>;
}

// Calcula a integral definida em um intervalo [a, b]
export function calculateDefiniteIntegral(expression: string, variable: string, lowerLimitStr: string, upperLimitStr: string): number {
  try {
    // Processa limites em formato de string para obter valores numéricos
    const lowerLimit = processLimit(lowerLimitStr);
    const upperLimit = processLimit(upperLimitStr);
    
    // Calcula a primitiva F(x)
    const primitive = calculateIntegralFromExpression(expression, variable, true);
    
    // Se a primitiva não pode ser calculada, lançar erro
    if (primitive.includes('integral(')) {
      throw new Error(`Não foi possível encontrar a primitiva para ${expression}`);
    }
    
    // Limpar a expressão para avaliação (remover "* 1", "+0", etc.)
    // que podem causar problemas na avaliação
    const cleanExpression = primitive.replace(/\+\s*0/g, '')
                                     .replace(/\*\s*1(?!\d)/g, '')
                                     .replace(/\s+/g, '');
    
    // Tentar avaliar usando funções de avaliação internas para casos simples
    if (isPolynomialExpression(cleanExpression)) {
      // Obter os coeficientes do polinômio
      const coefficients = getPolynomialCoefficients(cleanExpression, variable);
      
      // Calcular os valores usando os coeficientes
      const upperValue = evaluatePolynomial(coefficients, upperLimit);
      const lowerValue = evaluatePolynomial(coefficients, lowerLimit);
      
      // Arredondar para evitar erros de ponto flutuante
      return Math.round((upperValue - lowerValue) * 1000) / 1000;
    }

    // Converte para expressão JavaScript e avalia
    try {
      const jsExpression = mathExpressionToJsExpression(cleanExpression, variable);
      
      // Calcula F(b) - F(a) usando a primitiva
      const upperValue = safelyEvaluateExpression(jsExpression, variable, upperLimit);
      const lowerValue = safelyEvaluateExpression(jsExpression, variable, lowerLimit);
      
      // Verifica se os resultados são válidos
      if (isNaN(upperValue) || isNaN(lowerValue) || !isFinite(upperValue) || !isFinite(lowerValue)) {
        throw new Error(`Erro ao avaliar os limites da integral. Verifique se a função é contínua no intervalo [${lowerLimitStr}, ${upperLimitStr}].`);
      }
      
      // Arredonda para evitar erros de ponto flutuante
      return Math.round((upperValue - lowerValue) * 1000) / 1000;
    } catch (error) {
      // Usar a abordagem de tratamento de erro padronizada
      console.error(`Erro ao avaliar a integral: ${error instanceof Error ? error.message : String(error)}`);
      throw error; // Propagar para o tratamento de erro principal
    }
  } catch (error) {
    // Criar uma mensagem de erro padronizada, mas ainda lançar o erro para permitir tratamento específico
    const errorMsg = `Não foi possível calcular a integral definida: ${error instanceof Error ? error.message : String(error)}`;
    console.error(errorMsg);
    throw new Error(errorMsg);
  }
}

// Função para verificar se uma expressão é polinomial
function isPolynomialExpression(expression: string): boolean {
  // Remover espaços e caracteres desnecessários
  const cleanExpr = expression.replace(/\s+/g, '');
  
  // Expressões polinomiais geralmente só têm operadores básicos, 
  // potências com expoentes inteiros e não têm funções como sin, cos, etc.
  const hasAdvancedFunctions = /sin|cos|tan|ln|log|exp|sqrt/.test(cleanExpr);
  if (hasAdvancedFunctions) return false;
  
  // Verificar por potências fracionárias ou negativas
  const powerPattern = /\^\s*(-?\d*\.?\d+)/g;
  let match;
  
  while ((match = powerPattern.exec(cleanExpr)) !== null) {
    const exponent = parseFloat(match[1]);
    // Se o expoente não for um inteiro positivo, não é um polinômio padrão
    if (exponent < 0 || !Number.isInteger(exponent)) {
      return false;
    }
  }
  
  return true;
}

// Função para extrair coeficientes de uma expressão polinomial
function getPolynomialCoefficients(expression: string, variable: string): number[] {
  // Implementação simplificada - na prática precisaria de um parser mais robusto
  const coefficients: number[] = [];
  
  // Normaliza a expressão
  const cleanExpr = expression.replace(/\s+/g, '')
                             .replace(/-/g, '+-')
                             .split('+');
  
  for (const term of cleanExpr) {
    if (!term) continue; // Skip empty terms from splitting
    
    // Padrão para termos como: 5x^2, -3x, 7
    const pattern = new RegExp(`^(-?\\d*\\.?\\d*)(?:${variable}(?:\\^(\\d+))?)?$`);
    const match = term.match(pattern);
    
    if (match) {
      let coefficient = match[1] === '' || match[1] === '-' ? (match[1] === '-' ? -1 : 1) : parseFloat(match[1]);
      const exponent = match[2] ? parseInt(match[2]) : (term.includes(variable) ? 1 : 0);
      
      // Garante que há espaço suficiente no array
      while (coefficients.length <= exponent) {
        coefficients.push(0);
      }
      
      // Adiciona o coeficiente na posição correta
      coefficients[exponent] += coefficient;
    }
  }
  
  return coefficients;
}

// Função para avaliar um polinômio em um ponto específico
function evaluatePolynomial(coefficients: number[], x: number): number {
  let result = 0;
  
  // Avalia usando o método de Horner para melhor estabilidade numérica
  for (let i = coefficients.length - 1; i >= 0; i--) {
    result = result * x + coefficients[i];
  }
  
  return result;
} 