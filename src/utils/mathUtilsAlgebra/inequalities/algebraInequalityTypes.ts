// ===================================================
// ========= TIPOS DE INEQUAÇÕES ALGÉBRICAS ==========
// ===================================================

import { AlgebraTerm } from '../terms/algebraTermDefinition';

// Tipos de inequações suportadas
export type TipoInequacao = 'linear' | 'quadratica' | 'racional' | 'modulo';

// Símbolos de desigualdade
export const INEQUALITY_SYMBOLS = {
  LESS_THAN: '<',
  LESS_THAN_EQUAL: '≤',
  GREATER_THAN: '>',
  GREATER_THAN_EQUAL: '≥',
} as const;

export type InequalitySymbol = typeof INEQUALITY_SYMBOLS[keyof typeof INEQUALITY_SYMBOLS];

// Interface para representar uma inequação
export interface AlgebraicInequality {
  leftSide: AlgebraTerm;
  rightSide: AlgebraTerm;
  symbol: InequalitySymbol;
}

// Interface para representar um passo na resolução
export interface PassoResolucao {
  expressao: string;
  explicacao: string;
}

// Interface para o resultado da resolução
export interface InequalityResult {
  solution: string;
  interval: string;
  passos: PassoResolucao[];
}

// Interface para verificação de valor
export interface ValueCheckResult {
  resultado: boolean;
  passos: PassoResolucao[];
} 