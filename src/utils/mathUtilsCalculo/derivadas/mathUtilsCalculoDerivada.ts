// ===================================================
// ===== MODULO DE CALCULO DE DERIVADA PRINCIPAL =====
// ===================================================

// Importações básicas de módulos compartilhados
import { 
  Term, 
  parseExpression, 
  termToString, 
  getMathExamples,
  handleMathError
} from '../geral/mathUtilsCalculoGeral';

// Importações de utilitários de simplificação
import {
  simplifyExpression
} from '../../simplificacao/mathUtilsCalculoSimplificacao';

// Importações de módulos especializados
import { 
  detectSpecialPattern,
  detectDerivativePattern,
  derivativePatterns
} from './derivativePatterns';

import {
  derivativeResultCache,
  getDerivativeCacheKey,
  addToDerivativeCache,
  getFromDerivativeCache
} from './derivativeCache';

import {
  calculatePowerDerivative,
  calculateTrigDerivative,
  calculateLogExpDerivative,
  calculateSumDiffDerivative,
  calculateProductDerivative,
  calculateQuotientDerivative,
  calculateSumDiffDerivativeOptimized,
  calculateProductDerivativeOptimized
} from './derivativeCalculators';

// ===================================================
// ======== FUNCOES DE CALCULO DE DERIVADA ==========
// ===================================================

// Função auxiliar para verificar padrões diretamente na estrutura Term
// Evita a conversão inicial para string para casos comuns
const findMatchingPattern = (term: Term, variable: string): { result: Term } | null => {
  // Verifica padrões comuns diretamente na estrutura do termo
  for (const pattern of derivativePatterns) {
    if (pattern.detectTerm(term, variable)) {
      const resultStr = pattern.getResult(term, variable);
      const resultTerm = parseExpression(resultStr);
      if (resultTerm) {
        return { result: resultTerm };
      }
    }
  }
  return null;
};

// Função principal para calcular a derivada de uma expressão matemática
// Implementa regras de derivada para diferentes tipos de termos
export const calculateDerivative = (term: Term, variable: string): Term => {
  try {
    // Geração eficiente da chave de cache
    const termStr = termToString(term);
    const cacheKey = getDerivativeCacheKey(termStr, variable);
    
    // Verificar cache usando a função melhorada
    const cachedResult = getFromDerivativeCache(cacheKey);
    if (cachedResult) {
      return cachedResult;
    }
    
    // Primeiro tenta detectar padrões diretamente na estrutura Term
    // Isso evita a necessidade de conversão para string em muitos casos
    const patternMatch = findMatchingPattern(term, variable);
    if (patternMatch) {
      addToDerivativeCache(cacheKey, patternMatch.result);
      return patternMatch.result;
    }
    
    // Caso não encontre um padrão direto, tenta padrões baseados em string
    const specialPatternResult = detectSpecialPattern(term, termStr, variable);
    
    if (specialPatternResult) {
      // Converta a string de resultado de volta para um Term
      const resultTerm = parseExpression(specialPatternResult) || { type: 'constant', value: 0 };
      
      // Não aplique simplificação para casos especiais que podem ser sub-simplificados
      const isSqrtCase = termStr === `sqrt(${variable})` || termStr === `${variable}^(1/2)`;
      if (isSqrtCase) {
        // Crie manualmente a estrutura correta para 1/(2*sqrt(x))
        const manualTerm: Term = {
          type: 'quotient',
          left: { type: 'constant', value: 1 },
          right: {
            type: 'product',
            left: { type: 'constant', value: 2 },
            right: {
              type: 'sqrt',
              argument: { type: 'variable', variable }
            }
          }
        };
        addToDerivativeCache(cacheKey, manualTerm);
        return manualTerm;
      }
      
      addToDerivativeCache(cacheKey, resultTerm);
      return resultTerm;
    }
    
    let derivativeTerm: Term;
    
    switch (term.type) {
      case 'constant':
        derivativeTerm = { type: 'constant', value: 0 };
        break;
        
      case 'variable':
        // Para uma variável simples: d/dx(x) = 1, d/dx(y) = 0 (se y != x)
        derivativeTerm = term.variable === variable
          ? { type: 'constant', value: 1 }
          : { type: 'constant', value: 0 };
        break;
        
      case 'power':
        // Processa potências
        derivativeTerm = calculatePowerDerivative(term, variable, calculateDerivative);
        break;
        
      case 'sin':
      case 'cos':
      case 'tan':
        // Funções trigonométricas
        derivativeTerm = calculateTrigDerivative(term, variable, calculateDerivative);
        break;
        
      case 'ln':
      case 'log':
      case 'exp':
        // Funções logarítmicas e exponenciais
        derivativeTerm = calculateLogExpDerivative(term, variable, calculateDerivative);
        break;
        
      case 'sum':
      case 'difference':
        // Usa a versão otimizada que pode processar em paralelo
        const result = calculateSumDiffDerivativeOptimized(term, variable, calculateDerivative);
        
        // Verifica se o resultado é uma Promise
        if (result instanceof Promise) {
          // Se for uma promessa, resolve-a e atualiza o cache
          result.then(resolvedTerm => {
            const simplifiedResult = simplifyExpression(resolvedTerm);
            addToDerivativeCache(cacheKey, simplifiedResult.term);
            return simplifiedResult.term;
          });
          
          // Usa o processamento sequencial como fallback para o retorno síncrono
          derivativeTerm = calculateSumDiffDerivative(term, variable, calculateDerivative);
        } else {
          // Resultado síncrono
          derivativeTerm = result;
        }
        break;
        
      case 'product':
        // Usa a versão otimizada que pode processar em paralelo
        const productResult = calculateProductDerivativeOptimized(term, variable, calculateDerivative);
        
        // Verifica se o resultado é uma Promise
        if (productResult instanceof Promise) {
          // Se for uma promessa, resolve-a e atualiza o cache
          productResult.then(resolvedTerm => {
            const simplifiedResult = simplifyExpression(resolvedTerm);
            addToDerivativeCache(cacheKey, simplifiedResult.term);
            return simplifiedResult.term;
          });
          
          // Usa o processamento sequencial como fallback para o retorno síncrono
          derivativeTerm = calculateProductDerivative(term, variable, calculateDerivative);
        } else {
          // Resultado síncrono
          derivativeTerm = productResult;
        }
        break;
        
      case 'quotient':
        // Regra do quociente
        derivativeTerm = calculateQuotientDerivative(term, variable, calculateDerivative);
        break;
        
      // ===== DERIVADA DE RAIZ QUADRADA =====
        
      case 'sqrt':
        // Derivada de sqrt(x) é 1/(2*sqrt(x))
        if (term.argument?.type === 'variable' && term.argument.variable === variable) {
          derivativeTerm = {
            type: 'quotient',
            left: { type: 'constant', value: 1 },
            right: {
              type: 'product',
              left: { type: 'constant', value: 2 },
              right: {
                type: 'sqrt',
                argument: { type: 'variable', variable }
              }
            }
          };
        } else {
          // Regra da cadeia para sqrt(f(x)): f'(x)/(2*sqrt(f(x)))
          const derivadaArg = calculateDerivative(term.argument!, variable);
          
          // Se a derivada do argumento é zero, a derivada total é zero
          if (derivadaArg.type === 'constant' && derivadaArg.value === 0) {
            derivativeTerm = { type: 'constant', value: 0 };
          } else {
            derivativeTerm = {
              type: 'quotient',
              left: derivadaArg,
              right: {
                type: 'product',
                left: { type: 'constant', value: 2 },
                right: {
                  type: 'sqrt',
                  argument: term.argument
                }
              }
            };
          }
        }
        break;
        
      default:
        derivativeTerm = { type: 'constant', value: 0 };
    }
    
    // Aplique simplificação usando o módulo compartilhado
    const simplifiedResult = simplifyExpression(derivativeTerm);
    addToDerivativeCache(cacheKey, simplifiedResult.term);
    return simplifiedResult.term;
  } catch (error) {
    return { type: 'constant', value: 0 };
  }
};


// Calcula e simplifica uma derivada.
// Esta função serve como uma interface de alto nível para o cálculo de derivada,
// similar ao método usado no módulo de integração.
export const calculateAndSimplifyDerivative = (term: Term, variable: string): Term => {
  // Calcula a derivada
  const derivativeTerm = calculateDerivative(term, variable);
  
  // O método calculateDerivative já inclui simplificação interna,
  // então não precisamos chamar applySimplification novamente aqui
  return derivativeTerm;
};

// Função wrapper para calcular a derivada de uma expressão de string
export const calculateDerivativeFromExpression = (expression: string, variable: string = 'x'): string => {
  try {
    // Verifique o cache primeiro para eficiência
    const cacheKey = getDerivativeCacheKey(expression, variable);
    if (derivativeResultCache[cacheKey]) {
      return termToString(derivativeResultCache[cacheKey]);
    }
    
    // Primeiro use o sistema de detecção de padrões unificado
    const patternMatch = detectDerivativePattern(expression, variable);
    if (patternMatch.pattern) {
      const resultTerm = parseExpression(patternMatch.result as string);
      if (resultTerm) {
        derivativeResultCache[cacheKey] = resultTerm;
        return termToString(resultTerm);
      }
    }
    
    // Se nenhum padrão foi detectado, analise e use o método baseado em termo
    const term = parseExpression(expression);
    if (!term) {
      return `derivative(${expression})`;
    }
    
    const resultTerm = calculateDerivative(term, variable);
    derivativeResultCache[cacheKey] = resultTerm;
    return termToString(resultTerm);
  } catch (error) {
    return handleMathError('derivative', expression, error);
  }
};

// Exporta exemplos de funções para derivação
export const getDerivativesExamples = (): string[] => {
  return getMathExamples('derivative') as string[];
};
