// ===================================================
// ========= UTILIDADES DE INEQUAÇÕES ALGÉBRICAS =====
// ===================================================

import { AlgebraTerm } from '../terms/algebraTermDefinition';
import { AlgebraicInequality, PassoResolucao, INEQUALITY_SYMBOLS } from './algebraInequalityTypes';
import { termToString } from '../terms/algebraTermManipulator';
import { simplifyConstants } from '../terms/algebraTermManipulator';
import { evaluateExpression as evaluateExpressionAPI } from '../core/algebraAPI';

// Move todos os termos para o lado esquerdo da inequação
export const moveTermsToLeftSide = (
  inequality: AlgebraicInequality
): { expression: AlgebraTerm; symbol: typeof INEQUALITY_SYMBOLS[keyof typeof INEQUALITY_SYMBOLS]; passos: PassoResolucao[] } => {
  const passos: PassoResolucao[] = [];
  
  // 1. Primeiro passo: expressar a inequação original
  passos.push({
    expressao: `${termToString(inequality.leftSide)} ${inequality.symbol} ${termToString(inequality.rightSide)}`,
    explicacao: 'Inequação original.'
  });
  
  // 2. Subtrair o lado direito de ambos os lados
  const subtractedTerm: AlgebraTerm = {
    type: 'difference',
    left: inequality.leftSide,
    right: inequality.rightSide
  };
  
  passos.push({
    expressao: `${termToString(subtractedTerm)} ${inequality.symbol} 0`,
    explicacao: `Subtraindo ${termToString(inequality.rightSide)} de ambos os lados para isolar os termos no lado esquerdo.`
  });
  
  // 3. Simplificar a expressão
  const simplifiedTerm = simplifyConstants(subtractedTerm);
  
  passos.push({
    expressao: `${termToString(simplifiedTerm)} ${inequality.symbol} 0`,
    explicacao: 'Simplificando a expressão.'
  });
  
  return {
    expression: simplifiedTerm,
    symbol: inequality.symbol,
    passos
  };
};

// Obtém um ponto de teste dentro de um intervalo
export const getTestPointInInterval = (interval: string): string => {
  // Parse o intervalo em notação matemática
  const matchFinite = interval.match(/\(([-\d.]+),\s*([-\d.]+)\)/);
  const matchLeft = interval.match(/\(\-∞,\s*([-\d.]+)\)/);
  const matchRight = interval.match(/\(([-\d.]+),\s*∞\)/);
  
  if (matchFinite) {
    // Para um intervalo finito, tomar a média dos extremos
    const a = parseFloat(matchFinite[1]);
    const b = parseFloat(matchFinite[2]);
    return String((a + b) / 2);
  } else if (matchLeft) {
    // Para (-∞, b), tomar b - 1
    const b = parseFloat(matchLeft[1]);
    return String(b - 1);
  } else if (matchRight) {
    // Para (a, ∞), tomar a + 1
    const a = parseFloat(matchRight[1]);
    return String(a + 1);
  }
  
  // Caso padrão se o parsing falhar
  return "0";
};

// Avalia uma expressão algébrica com um valor substituído
export const evaluateExpression = (expression: string, variable: string, value: number): number => {
  // Substituir a variável pelo valor
  const substitutedExpression = expression.replace(new RegExp(variable, 'g'), `(${value})`);
  
  try {
    // Usar a função da API para avaliar a expressão
    const evaluatedResult = evaluateExpressionAPI(substitutedExpression);
    
    // Converter o resultado para número
    const numericResult = parseFloat(evaluatedResult);
    
    if (!isNaN(numericResult)) {
      return numericResult;
    }
    
    throw new Error(`Não foi possível avaliar a expressão para x = ${value}`);
  } catch (error) {
    throw new Error(`Erro ao avaliar expressão: ${error}`);
  }
};

// Verifica se um valor satisfaz uma inequação
export const checkValueSatisfiesInequality = (
  inequality: AlgebraicInequality,
  variable: string,
  value: number
): boolean => {
  // Avaliar ambos os lados da inequação
  const leftValue = evaluateExpression(termToString(inequality.leftSide), variable, value);
  const rightValue = evaluateExpression(termToString(inequality.rightSide), variable, value);
  
  // Comparar os valores baseado no símbolo da inequação
  switch (inequality.symbol) {
    case INEQUALITY_SYMBOLS.LESS_THAN:
      return leftValue < rightValue;
    case INEQUALITY_SYMBOLS.LESS_THAN_EQUAL:
      return leftValue <= rightValue;
    case INEQUALITY_SYMBOLS.GREATER_THAN:
      return leftValue > rightValue;
    case INEQUALITY_SYMBOLS.GREATER_THAN_EQUAL:
      return leftValue >= rightValue;
  }
}; 