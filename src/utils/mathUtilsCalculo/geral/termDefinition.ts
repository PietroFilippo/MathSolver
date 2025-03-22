// ===================================================
// ========== DEFINIÇÕES DE TIPOS DE TERMOS ==========
// ===================================================

// Interface que representa termos de expressões matemáticas
// Utilizada para cálculos de derivadas, integrais e limites
export interface Term {
  type: 'constant' | 'variable' | 'power' | 'sin' | 'cos' | 'tan' | 'ln' | 'log' | 'exp' | 'product' | 'sum' | 'difference' | 'quotient' | 'sqrt' | 'arcsin' | 'arccos' | 'arctan';
  value?: number;
  variable?: string;
  exponent?: number;
  left?: Term;
  right?: Term;
  argument?: Term;
  exponentTerm?: Term;
} 