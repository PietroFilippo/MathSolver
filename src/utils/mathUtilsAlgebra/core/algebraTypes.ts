// ===================================================
// ========= TIPOS DE ÁLGEBRA COMPARTILHADOS =========
// ===================================================

import { AlgebraTerm } from '../terms/algebraTermDefinition';

// Interface para armazenar em cache os resultados de operações
export interface CacheEntry {
  result: string;
  steps: string[];
}

// Estruturas para armazenar informações dos termos
export interface QuadraticInfo {
  term: AlgebraTerm;
  variable: string;
  coefficient: number;
}

export interface LinearInfo {
  term: AlgebraTerm;
  variable: string;
  coefficient: number;
} 