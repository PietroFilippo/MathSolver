// ===================================================
// ========= UTILIDADES GERAIS DE ÁLGEBRA ===========
// ===================================================

import { AlgebraTerm } from './algebraTermDefinition';

// Calcular o MDC entre dois números
export const findGCD = (a: number, b: number): number => {
  a = Math.abs(a);
  b = Math.abs(b);
  
  // Algoritmo de Euclides para encontrar o MDC
  while (b !== 0) {
    const temp = b;
    b = a % b;
    a = temp;
  }
  
  return a;
};

// Construir uma árvore de soma balanceada a partir de termos individuais
export const buildSumTree = (terms: AlgebraTerm[]): AlgebraTerm => {
  if (terms.length === 0) {
    return { type: 'constant', value: 0 };
  }
  
  if (terms.length === 1) {
    return terms[0];
  }
  
  // Dividir a lista ao meio e construir recursivamente
  const mid = Math.floor(terms.length / 2);
  const leftTree = buildSumTree(terms.slice(0, mid));
  const rightTree = buildSumTree(terms.slice(mid));
  
  return {
    type: 'sum',
    left: leftTree,
    right: rightTree
  };
};

// Formatar o resultado final para melhor legibilidade
export const formatFinalResult = (result: string): string => {
  // Remover espaços extras e ajustar formatação
  
  // Substituir * por nada (implícito em notação algébrica)
  let formatted = result.replace(/\s*\*\s*/g, '');
  
  // Substituir ** por ^ (padrão para expoente)
  formatted = formatted.replace(/\*\*/g, '^');
  
  // Simplificar termos como 1x para x
  formatted = formatted.replace(/\b1([a-zA-Z])/g, '$1');
  
  // Simplificar termos como 0 + x ou x + 0 para x
  formatted = formatted.replace(/\b0\s*\+\s*/g, '');
  formatted = formatted.replace(/\s*\+\s*0\b/g, '');
  
  // Simplificar termos como x - 0 para x
  formatted = formatted.replace(/\s*-\s*0\b/g, '');
  
  // Simplificar termos como 0 * x para 0
  formatted = formatted.replace(/\b0\s*\*\s*[a-zA-Z0-9]+/g, '0');
  
  // Substituir coisas como x^1 por x
  formatted = formatted.replace(/([a-zA-Z])\^1\b/g, '$1');
  
  // CORRIGIR PROBLEMA: Substituir "+ -" por " - " para melhor legibilidade
  formatted = formatted.replace(/\+\s*-/g, ' - ');
  
  // Ajustar espaços ao redor de operadores
  formatted = formatted.replace(/\s*\+\s*/g, ' + ');
  formatted = formatted.replace(/\s*-\s*/g, ' - ');
  formatted = formatted.replace(/\s*\^\s*/g, '^');
  
  // Remover espaços extras
  formatted = formatted.replace(/\(\s+/g, '(');
  formatted = formatted.replace(/\s+\)/g, ')');
  
  // Remover espaços no início e fim
  formatted = formatted.trim();
  
  return formatted;
};

// Resolver um sistema de equações lineares 2x2
export const linearSystem = (
  a1: number, b1: number, c1: number,
  a2: number, b2: number, c2: number
): { x: number; y: number } | null => {
  // Calcular o determinante da matriz de coeficientes
  const det = a1 * b2 - a2 * b1;
  
  // Se o determinante for zero, o sistema não tem solução única
  if (Math.abs(det) < 1e-10) {
    return null;
  }
  
  // Calcular x e y usando a regra de Cramer
  const x = (c1 * b2 - c2 * b1) / det;
  const y = (a1 * c2 - a2 * c1) / det;
  
  return { x, y };
}; 