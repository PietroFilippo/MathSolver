// ===================================================
// ========= PARSER DE INEQUAÇÕES ALGÉBRICAS ==========
// ===================================================

import { AlgebraicInequality, InequalitySymbol, INEQUALITY_SYMBOLS } from './algebraInequalityTypes';
import { parseAlgebraicExpression } from '../expressions/algebraExpressionParser';
import { AlgebraTerm } from '../terms/algebraTermDefinition';

// Cache para inequações parseadas
const parsedInequalityCache: Map<string, AlgebraicInequality> = new Map();

// Normaliza símbolos de inequação
export const normalizeInequality = (inequacao: string): string => {
  return inequacao
    .replace(/<=|≤/g, INEQUALITY_SYMBOLS.LESS_THAN_EQUAL)
    .replace(/>=|≥/g, INEQUALITY_SYMBOLS.GREATER_THAN_EQUAL);
};

// Extrai o símbolo de inequação da string
const extractInequalitySymbol = (inequacao: string): { symbol: InequalitySymbol; index: number } => {
  const normalizedInequality = normalizeInequality(inequacao);
  
  for (const symbol of Object.values(INEQUALITY_SYMBOLS)) {
    const index = normalizedInequality.indexOf(symbol);
    if (index !== -1) {
      return { symbol, index };
    }
  }
  
  throw new Error('Símbolo de inequação não encontrado. Use <, >, ≤, ou ≥.');
};

// Parse uma inequação em suas partes componentes
export const parseInequality = (inequacao: string): AlgebraicInequality => {
  // Verificar cache primeiro
  if (parsedInequalityCache.has(inequacao)) {
    return parsedInequalityCache.get(inequacao)!;
  }
  
  // Verificar padrão de inequação modular |expressão| símbolo valor
  const modulusRegex = /\|(.*?)\|\s*([<>≤≥])\s*(.*)/;
  const modulusMatch = inequacao.match(modulusRegex);
  
  if (modulusMatch) {
    const expression = modulusMatch[1].trim();
    const symbol = modulusMatch[2].trim() as InequalitySymbol;
    const value = modulusMatch[3].trim();
    
    // Parse a expressão interna e o lado direito
    const leftTerm: AlgebraTerm = {
      type: 'modulus',
      argument: parseAlgebraicExpression(expression)
    };
    const rightTerm = parseAlgebraicExpression(value);
    
    // Criar o objeto de inequação
    const inequality: AlgebraicInequality = {
      leftSide: leftTerm,
      rightSide: rightTerm,
      symbol
    };
    
    // Armazenar no cache
    parsedInequalityCache.set(inequacao, inequality);
    return inequality;
  }
  
  // Normalizar a inequação
  const normalizedInequality = normalizeInequality(inequacao);
  
  // Extrair o símbolo e sua posição
  const { symbol, index } = extractInequalitySymbol(normalizedInequality);
  
  // Separar os lados da inequação
  const leftSide = normalizedInequality.substring(0, index).trim();
  const rightSide = normalizedInequality.substring(index + symbol.length).trim();
  
  if (!leftSide || !rightSide) {
    throw new Error('Formato de inequação inválido. Certifique-se de ter expressões em ambos os lados.');
  }
  
  // Parsear cada lado como uma expressão algébrica
  const leftTerm = parseAlgebraicExpression(leftSide);
  const rightTerm = parseAlgebraicExpression(rightSide);
  
  // Criar o objeto de inequação
  const inequality: AlgebraicInequality = {
    leftSide: leftTerm,
    rightSide: rightTerm,
    symbol
  };
  
  // Armazenar no cache
  parsedInequalityCache.set(inequacao, inequality);
  
  return inequality;
};

// Inverte o símbolo de inequação
export const flipInequality = (symbol: InequalitySymbol): InequalitySymbol => {
  switch (symbol) {
    case INEQUALITY_SYMBOLS.LESS_THAN:
      return INEQUALITY_SYMBOLS.GREATER_THAN;
    case INEQUALITY_SYMBOLS.LESS_THAN_EQUAL:
      return INEQUALITY_SYMBOLS.GREATER_THAN_EQUAL;
    case INEQUALITY_SYMBOLS.GREATER_THAN:
      return INEQUALITY_SYMBOLS.LESS_THAN;
    case INEQUALITY_SYMBOLS.GREATER_THAN_EQUAL:
      return INEQUALITY_SYMBOLS.LESS_THAN_EQUAL;
  }
}; 