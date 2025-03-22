// ===================================================
// ======== FUNÇÕES DE DETECÇÃO DE PADRÕES ===========
// ===================================================

import { Term } from './termDefinition';
import { areTermsEqual } from './termManipulator';
import { parsedExpressionCache, getCacheKey, addToCache, getFromCache, CacheEntry } from './expressionCache';

// Interface para cache de correspondências de padrões
interface PatternMatchResult {
  matches: boolean;
}

// Interface para resultados de detecção de padrões
interface PatternDetectionResult {
  patterns: string[];
}

// Cache para resultados de correspondência de padrões
const patternMatchCache = new Map<string, CacheEntry<PatternMatchResult>>();

// Verifica se uma expressão segue um padrão específico
// Útil para aplicação correta de regras de derivação e integração
export const matchesPattern = (term: Term, pattern: Term): boolean => {
  if (!term || !pattern) return false;
  
  // Gerar chave de cache para esta correspondência de padrões
  const termStr = JSON.stringify(term);
  const patternStr = JSON.stringify(pattern);
  const cacheKey = getCacheKey(`${termStr}|${patternStr}`, 'pattern');
  
  // Verificar cache para resultado existente
  const cachedResult = getFromCache(patternMatchCache, cacheKey);
  if (cachedResult !== undefined) {
    return cachedResult.matches;
  }
  
  // Caso especial: padrão é uma variável com nome 'u', 'v', 'w' - corresponde a qualquer termo
  if (pattern.type === 'variable' && 
      (pattern.variable === 'u' || 
       pattern.variable === 'v' || 
       pattern.variable === 'w')) {
    // Armazenar resultado no cache
    addToCache(patternMatchCache, cacheKey, { matches: true } as PatternMatchResult);
    return true;
  }
  
  // Tipos de termos diferentes não podem corresponder
  if (term.type !== pattern.type) {
    addToCache(patternMatchCache, cacheKey, { matches: false } as PatternMatchResult);
    return false;
  }
  
  let result = false;
  
  // Correspondência baseada no tipo de termo
  switch (term.type) {
    case 'constant':
      // Para constantes, o padrão é exatamente a mesma constante
      // ou o padrão é uma constante wildcard 'k'
      result = (pattern.type === 'constant' && 
                pattern.value === term.value) || 
                (pattern.type === 'variable' && 
                 pattern.variable === 'k');
      break;
      
    case 'variable':
      // Correspondência direta ou padrão é uma wildcard para qualquer variável
      result = (pattern.type === 'variable' && 
                (pattern.variable === term.variable ||
                 pattern.variable === 'x' ||  // Wildcard para qualquer variável
                 pattern.variable === 'y' ||
                 pattern.variable === 'z'));
      break;
      
    case 'power':
      // Correspondência entre argumento e expoente
      result = matchesPattern(term.argument!, pattern.argument!) && 
               (pattern.exponent === term.exponent || 
                pattern.exponent === undefined);  // Expoente indefinido no padrão corresponde a qualquer
      break;
      
    case 'sin':
    case 'cos':
    case 'tan':
    case 'ln':
    case 'log':
    case 'exp':
    case 'sqrt':
      // Correspondência do argumento da função
      result = matchesPattern(term.argument!, pattern.argument!);
      break;
      
    case 'sum':
    case 'difference':
    case 'product':
    case 'quotient':
      // Para operações binárias, tente ambas as maneiras (pattern.left corresponde a term.left e pattern.right corresponde a term.right)
      // OU (pattern.left corresponde a term.right e pattern.right corresponde a term.left) para operações comutativas
      const directMatch = matchesPattern(term.left!, pattern.left!) && 
                         matchesPattern(term.right!, pattern.right!);
                         
      // Para soma e produto, também tente a ordem oposta (propriedade comutativa)
      const commuteMatch = (term.type === 'sum' || term.type === 'product') && 
                          matchesPattern(term.left!, pattern.right!) && 
                          matchesPattern(term.right!, pattern.left!);
                          
      result = directMatch || commuteMatch;
      break;
      
    default:
      result = false;
  }
  
  // Armazenar resultado no cache antes de retornar
  addToCache(patternMatchCache, cacheKey, { matches: result } as PatternMatchResult);
  return result;
};

// Identificação rápida de formas comuns para otimizar operações
export const detectCommonPatterns = (term: Term): string[] => {
  if (!term) return [];
  
  const termStr = JSON.stringify(term);
  const cacheKey = getCacheKey(termStr, 'commonPatterns');
  
  // Verificar cache primeiro
  const cached = getFromCache(parsedExpressionCache, cacheKey);
  if (cached) {
    return (cached as PatternDetectionResult).patterns;
  }
  
  const patterns: string[] = [];
  
  // Produto com um fator constante
  if (term.type === 'product' && 
      (term.left!.type === 'constant' || term.right!.type === 'constant')) {
    patterns.push('constMultiplier');
  }
  
  // Forma quadrática: ax^2 + bx + c
  if (term.type === 'sum' && 
      ((term.left!.type === 'product' && 
        term.left!.right!.type === 'power' && 
        term.left!.right!.exponent === 2) || 
       (term.right!.type === 'product' && 
        term.right!.right!.type === 'power' && 
        term.right!.right!.exponent === 2))) {
    patterns.push('quadratic');
  }
  
  // Diferença de quadrados: a^2 - b^2
  if (term.type === 'difference' && 
      term.left!.type === 'power' && term.left!.exponent === 2 && 
      term.right!.type === 'power' && term.right!.exponent === 2) {
    patterns.push('differenceOfSquares');
  }
  
  // Forma quadrada perfeita: (a + b)^2
  if (term.type === 'power' && 
      term.exponent === 2 && 
      (term.argument!.type === 'sum' || term.argument!.type === 'difference')) {
    patterns.push('perfectSquare');
  }
  
  // Identidade trigonométrica: sin^2(x) + cos^2(x) = 1
  if (term.type === 'sum' && 
      term.left!.type === 'power' && term.left!.exponent === 2 && 
      term.left!.argument!.type === 'sin' && 
      term.right!.type === 'power' && term.right!.exponent === 2 && 
      term.right!.argument!.type === 'cos' && 
      areTermsEqual(term.left!.argument!.argument!, term.right!.argument!.argument!)) {
    patterns.push('pythagoreanIdentity');
  }
  
  // Adição de logaritmos: ln(a) + ln(b) = ln(a*b)
  if (term.type === 'sum' && 
      term.left!.type === 'ln' && 
      term.right!.type === 'ln') {
    patterns.push('logSum');
  }
  
  // Subtração de logaritmos: ln(a) - ln(b) = ln(a/b)
  if (term.type === 'difference' && 
      term.left!.type === 'ln' && 
      term.right!.type === 'ln') {
    patterns.push('logDifference');
  }
  
  // Armazenar resultados no cache
  addToCache(parsedExpressionCache, cacheKey, { patterns } as PatternDetectionResult);
  
  return patterns;
};

// Detecção de oportunidades de simplificação, como fatorização de expressões
export const detectSimplificationOpportunities = (term: Term): string[] => {
  if (!term) return [];
  
  const termStr = JSON.stringify(term);
  const cacheKey = getCacheKey(termStr, 'simplifyOpportunities');
  
  // Verificar cache primeiro
  const cached = getFromCache(parsedExpressionCache, cacheKey);
  if (cached) {
    return (cached as PatternDetectionResult).patterns;
  }
  
  const opportunities: string[] = [];
  
  // Fator comum em soma/diferença
  if ((term.type === 'sum' || term.type === 'difference') && 
      term.left!.type === 'product' && term.right!.type === 'product') {
    
    // Verificar se um fator comum existe em ambos os lados
    // Ou left.left corresponde a right.left OU left.left corresponde a right.right
    // OU left.right corresponde a right.left OU left.right corresponde a right.right
    if (areTermsEqual(term.left!.left!, term.right!.left!) || 
        areTermsEqual(term.left!.left!, term.right!.right!) || 
        areTermsEqual(term.left!.right!, term.right!.left!) || 
        areTermsEqual(term.left!.right!, term.right!.right!)) {
      opportunities.push('commonFactor');
    }
  }
  
  // Identidade não utilizada: e^(ln(x)) = x
  if (term.type === 'exp' && term.argument!.type === 'ln') {
    opportunities.push('expLnIdentity');
  }
  
  // Simplificação de potência aninhada: (x^a)^b = x^(a*b)
  if (term.type === 'power' && term.argument!.type === 'power') {
    opportunities.push('powerOfPower');
  }
  
  // Oportunidade de distribuição: a * (b + c) = a*b + a*c
  if (term.type === 'product' && 
      (term.left!.type === 'sum' || term.left!.type === 'difference' || 
       term.right!.type === 'sum' || term.right!.type === 'difference')) {
    opportunities.push('distribution');
  }
  
  // Armazenar resultados no cache
  addToCache(parsedExpressionCache, cacheKey, { patterns: opportunities } as PatternDetectionResult);
  
  return opportunities;
};

// Verificação rápida para padrões específicos usando buscas otimizadas
export const hasPattern = (term: Term, patternName: string): boolean => {
  // Verificação otimizada para padrões comuns sem correspondência completa
  switch (patternName) {
    case 'isConstant':
      return term.type === 'constant';
      
    case 'isVariable':
      return term.type === 'variable';
      
    case 'isLinearInX':
      // termo x ou termo a*x
      return (term.type === 'variable' && term.variable === 'x') ||
             (term.type === 'product' && 
              ((term.left!.type === 'constant' && term.right!.type === 'variable' && term.right!.variable === 'x') ||
               (term.right!.type === 'constant' && term.left!.type === 'variable' && term.left!.variable === 'x')));
      
    case 'isQuadraticInX':
      // termo x^2 ou termo a*x^2
      return (term.type === 'power' && term.argument!.type === 'variable' && 
              term.argument!.variable === 'x' && term.exponent === 2) ||
             (term.type === 'product' && 
              ((term.left!.type === 'constant' && 
                term.right!.type === 'power' && 
                term.right!.argument!.type === 'variable' && 
                term.right!.argument!.variable === 'x' && 
                term.right!.exponent === 2) ||
               (term.right!.type === 'constant' && 
                term.left!.type === 'power' && 
                term.left!.argument!.type === 'variable' && 
                term.left!.argument!.variable === 'x' && 
                term.left!.exponent === 2)));
    
    case 'hasDerivative':
      // Padrões que têm derivadas bem definidas
      return term.type !== undefined && 
             ['constant', 'variable', 'power', 'sum', 'difference', 
              'product', 'quotient', 'sin', 'cos', 'tan', 
              'ln', 'log', 'exp', 'sqrt'].includes(term.type);
              
    case 'hasIndefiniteIntegral':
      // Padrões que têm integrais indefinidas bem definidas
      return term.type !== undefined && 
             ['constant', 'variable', 'power', 'sum', 'difference', 
              'sin', 'cos', 'exp'].includes(term.type);
    
    default:
      // Para padrões personalizados, use a detecção de padrões completa
      const patterns = detectCommonPatterns(term);
      return patterns.includes(patternName);
  }
};

// Verifica se uma expressão corresponde a padrões especiais comuns
export const detectSpecialMathPattern = (_term: Term, termStr: string, variable: string, context: 'derivative' | 'integral'): string | null => {
  // Para integrais, se um registro de padrões unificado existir em mathUtilsCalculoIntegrais.ts,
  // devemos delegar a ele em vez de duplicar padrões aqui
  if (context === 'integral') {
    // Mantenha apenas as integrais de Fresnel - outros padrões agora estão no registro unificado
    // Estes são funções especiais complexas que precisam de tratamento especial
    if (termStr === `cos(${variable}^2)` || termStr.match(new RegExp(`cos\\(${variable}\\^2\\)`))) {
      const factor = Math.sqrt(Math.PI/2).toFixed(4);
      return `Integral de Fresnel C(x): (${factor}) * C(√(2/π) * ${variable})\nComo observação: Integrais de Fresnel não possuem uma primitiva elementar e são expressas usando a função especial C(x).`;
    }
    
    if (termStr === `sin(${variable}^2)` || termStr.match(new RegExp(`sin\\(${variable}\\^2\\)`))) {
      const factor = Math.sqrt(Math.PI/2).toFixed(4);
      return `Integral de Fresnel S(x): (${factor}) * S(√(2/π) * ${variable})\nComo observação: Integrais de Fresnel não possuem uma primitiva elementar e são expressas usando a função especial S(x).`;
    }
    
    // Remova todos os outros padrões de integração, pois agora estão no registro unificado
    return null;
  }
  
  // Adicionar padrões específicos para derivadas
  // Aqui podemos adicionar padrões específicos que aparecem frequentemente em cálculos de derivadas
  if (context === 'derivative') {
    // Exemplo: d/dx[e^x] = e^x
    if (termStr === `e^${variable}` || termStr === `e^(${variable})`) {
      return `e^${variable}`;
    }
    
    // Exemplo: d/dx[sin(x)] = cos(x)
    if (termStr === `sin(${variable})`) {
      return `cos(${variable})`;
    }
    
    // Exemplo: d/dx[cos(x)] = -sin(x)
    if (termStr === `cos(${variable})`) {
      return `-sin(${variable})`;
    }
    
    // Outros padrões específicos para derivadas podem ser adicionados conforme necessário
  }
  
  return null;
}; 