// ===================================================
// ========= API PRINCIPAL DE OPERAÇÕES ALGÉBRICAS ====
// ===================================================

import { AlgebraTerm, cloneTerm } from '../terms/algebraTermDefinition';
import { parseAlgebraicExpression, normalizeExpression } from '../expressions/algebraExpressionParser';
import { termToString, simplifyConstants } from '../terms/algebraTermManipulator';
import { expandTerm } from '../expressions/algebraExpansion';
import { combineLikeTerms } from '../terms/algebraTermUtils';
import { factorByCommonFactor, factorQuadratic, detectPerfectSquare, detectDifferenceOfSquares } from '../expressions/algebraFactorization';
import { formatFinalResult } from '../core/algebraUtils';
import { applyAlgebraicRules, checkForSpecialCases } from '../expressions/algebraRules';
import { CacheEntry } from '../core/algebraTypes';
import { simplifyExpression, simplifyLinearExpression } from '../inequalities/algebraInequalityExpressionEvaluator';

// Cache de resultados para operações custosas
const simplificationCache: Map<string, CacheEntry> = new Map();
const expansionCache: Map<string, CacheEntry> = new Map();
const factorizationCache: Map<string, CacheEntry> = new Map();
const inequalityExpressionCache: Map<string, string> = new Map();

// Função principal para simplificar uma expressão algébrica
export const simplifyAlgebraicExpression = (expression: string): { result: string; steps: string[] } => {
  
  // Verificar se já temos o resultado em cache
  const normalizedExpression = normalizeExpression(expression);
  const cachedResult = simplificationCache.get(normalizedExpression);
  
  if (cachedResult) {
    return {
      result: cachedResult.result,
      steps: [...cachedResult.steps]
    };
  }

  // Iniciar processo de simplificação
  const steps: string[] = [];
  steps.push(`Expressão original: ${expression}`);
  steps.push(`Expressão normalizada: ${normalizedExpression}`);
  
  // Converter a expressão para um termo algébrico
  let term: AlgebraTerm | null = null;
  try {
    term = parseAlgebraicExpression(normalizedExpression);
    steps.push(`Expressão parseada com sucesso`);
  } catch (error) {
    return {
      result: expression,
      steps: [`Erro ao processar expressão: ${(error as Error).message}`]
    };
  }
  
  // Aplicar simplificações e transformações
  let resultTerm = term;
  
  // Passo 1: Expandir expressões com produtos
  resultTerm = expandTerm(resultTerm, steps);
  
  // Passo 2: Simplificar constantes
  resultTerm = simplifyConstants(resultTerm);
  steps.push(`Após simplificar constantes: ${termToString(resultTerm)}`);
  
  // Passo 3: Aplicar regras algébricas específicas
  resultTerm = applyAlgebraicRules(resultTerm, steps);
  
  // Passo 4: Verificar casos especiais (trinômios perfeitos, diferenças de quadrados, etc.)
  resultTerm = checkForSpecialCases(resultTerm, steps);
  
  // Passo 5: Combinar termos semelhantes
  resultTerm = combineLikeTerms(resultTerm, steps);
  
  // Passo 6: Procurar por fatores comuns
  const factorizedTerm = factorByCommonFactor(resultTerm, steps);
  if (factorizedTerm) {
    resultTerm = factorizedTerm;
  }
  
  // Passo 7: Verificar casos especiais novamente após as combinações
  resultTerm = checkForSpecialCases(resultTerm, steps);
  
  // Passo 8: Verificar se podemos fatorar uma equação de segundo grau
  const quadraticFactored = factorQuadratic(resultTerm, steps);
  if (quadraticFactored) {
    resultTerm = quadraticFactored;
  }
  
  // Formate o resultado final
  const resultString = formatFinalResult(termToString(resultTerm));
  
  // Armazenar resultado em cache
  simplificationCache.set(normalizedExpression, {
    result: resultString,
    steps: [...steps]
  });
  
  return {
    result: resultString,
    steps
  };
};

// Função principal para expandir uma expressão algébrica
export const expandAlgebraicExpression = (expression: string): { result: string; steps: string[] } => {
  // Verificar se já temos o resultado em cache
  const normalizedExpression = normalizeExpression(expression);
  const cachedResult = expansionCache.get(normalizedExpression);
  
  if (cachedResult) {
    return {
      result: cachedResult.result,
      steps: [...cachedResult.steps]
    };
  }

  // Iniciar processo de expansão
  const steps: string[] = [];
  steps.push(`Expressão original: ${expression}`);
  steps.push(`Expressão normalizada: ${normalizedExpression}`);
  
  // Converter a expressão para um termo algébrico
  let term: AlgebraTerm | null = null;
  try {
    term = parseAlgebraicExpression(normalizedExpression);
    steps.push(`Expressão parseada com sucesso`);
  } catch (error) {
    return {
      result: expression,
      steps: [`Erro ao processar expressão: ${(error as Error).message}`]
    };
  }
  
  // Expandir a expressão
  const expandedTerm = expandTerm(term, steps);
  
  // Simplificar
  const simplifiedTerm = simplifyConstants(expandedTerm);
  steps.push(`Após simplificar constantes: ${termToString(simplifiedTerm)}`);
  
  // Combinar termos semelhantes
  const combinedTerm = combineLikeTerms(simplifiedTerm, steps);
  
  // Formate o resultado final
  const resultString = formatFinalResult(termToString(combinedTerm));
  
  // Armazenar resultado em cache
  expansionCache.set(normalizedExpression, {
    result: resultString,
    steps: [...steps]
  });
  
  return {
    result: resultString,
    steps
  };
};

// Função principal para fatorar uma expressão algébrica
export const factorizeAlgebraicExpression = (expression: string): { result: string; steps: string[] } => {
  // Verificar se já temos o resultado em cache
  const normalizedExpression = normalizeExpression(expression);
  const cachedResult = factorizationCache.get(normalizedExpression);
  
  if (cachedResult) {
    return {
      result: cachedResult.result,
      steps: [...cachedResult.steps]
    };
  }

  // Iniciar processo de fatoração
  const steps: string[] = [];
  steps.push(`Expressão original: ${expression}`);
  steps.push(`Expressão normalizada: ${normalizedExpression}`);
  
  // Converter a expressão para um termo algébrico
  let term: AlgebraTerm | null = null;
  try {
    term = parseAlgebraicExpression(normalizedExpression);
    steps.push(`Expressão parseada com sucesso`);
  } catch (error) {
    return {
      result: expression,
      steps: [`Erro ao processar expressão: ${(error as Error).message}`]
    };
  }
  
  // Simplificar primeiro para garantir que estamos trabalhando com uma expressão limpa
  term = simplifyConstants(term);
  let resultTerm = combineLikeTerms(term, steps);
  
  // Verificar casos especiais primeiro
  
  // Verificação prévia de expressão: se o termo é uma diferença e parece uma diferença de quadrados
  const termString = termToString(resultTerm);
  
  // Caso especial: Verificar diretamente por diferença de quadrados (x^2 - y^2)
  if (resultTerm.type === 'difference') {
    const leftStr = termToString(resultTerm.left!);
    const rightStr = termToString(resultTerm.right!);
    
    if ((leftStr.includes('^2') || leftStr.includes('²')) && 
        (rightStr.includes('^2') || rightStr.includes('²'))) {
      
      // Verificar diretamente usando detectDifferenceOfSquares
      const differenceCase = detectDifferenceOfSquares(resultTerm, steps);
      if (differenceCase) {
        resultTerm = differenceCase;
        
        // Formate o resultado final
        const resultString = formatFinalResult(termToString(resultTerm));
        
        // Armazenar resultado em cache
        factorizationCache.set(normalizedExpression, {
          result: resultString,
          steps: [...steps]
        });
        
        return {
          result: resultString,
          steps
        };
      }
    }
  }
  
  // 1. Verificar se é um quadrado perfeito
  let specialCase = detectPerfectSquare(resultTerm, steps);
  if (specialCase) {
    resultTerm = specialCase;
  } else {
    // 2. Verificar se é uma diferença de quadrados
    specialCase = detectDifferenceOfSquares(resultTerm, steps);
    if (specialCase) {
      resultTerm = specialCase;
    } else {
      // 3. Verificar se tem um fator comum
      const factorizedTerm = factorByCommonFactor(resultTerm, steps);
      if (factorizedTerm) {
        resultTerm = factorizedTerm;
      } else {
        // 4. Tentar fatorar trinômio de segundo grau
        const quadraticFactored = factorQuadratic(resultTerm, steps);
        if (quadraticFactored) {
          resultTerm = quadraticFactored;
        }
      }
    }
  }
  
  // Formate o resultado final
  const resultString = formatFinalResult(termToString(resultTerm));
  
  // Armazenar resultado em cache
  factorizationCache.set(normalizedExpression, {
    result: resultString,
    steps: [...steps]
  });
  
  return {
    result: resultString,
    steps
  };
};

// Função para avaliar expressões com valores substituídos
export const evaluateExpression = (expression: string): string => {
  // Verificar cache primeiro
  if (inequalityExpressionCache.has(expression)) {
    return inequalityExpressionCache.get(expression)!;
  }
  
  // Avaliar a expressão
  const result = simplifyExpression(expression);
  
  // Armazenar no cache
  inequalityExpressionCache.set(expression, result);
  
  return result;
};

// Função para simplificar expressões lineares
export const simplifyLinearExpressionWithVariable = (
  expression: string, 
  variable: string
): { coefficient: number; constant: number } => {
  return simplifyLinearExpression(expression, variable);
};

// Resolver um sistema de equações lineares 2x2
export { linearSystem } from './algebraUtils'; 