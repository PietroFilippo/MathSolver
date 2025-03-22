// ========================================================
// === Módulo principal para funções matemáticas (cálculo) ===
// ========================================================

// Re-exportações para facilitar o acesso aos submódulos

// Definição de termos e estruturas matemáticas
export * from './termDefinition';

// Expressões e operações
export * from './expressionParser';
export * from './expressionEvaluator';
export * from './termManipulator';
// export * from './termSimplifier'; // Substituído pelo módulo de simplificação modular

// Import from simplification module (except for areTermsEqual which is already in termManipulator)
import {
  simplifyExpression,
  areSimilarTerms,
  combineSimilarTerms,
  getTermExponent,
  areSimilarForCombining,
  simplifyQuotientProduct,
  sortTermsByExponent,
  SimplificationResult
} from '../../simplificacao/mathUtilsCalculoSimplificacao';
import { Term } from './termDefinition';

export {
  simplifyExpression,
  areSimilarTerms,
  combineSimilarTerms,
  getTermExponent,
  areSimilarForCombining,
  simplifyQuotientProduct,
  sortTermsByExponent
};

export type { SimplificationResult };

// Compatibility function for code that might still use simplifyTerm
export const simplifyTerm = (term: Term): Term => {
  const result = simplifyExpression(term);
  return result.term;
};

export * from './patternDetection';
export * from './exampleGenerator';

// Novo sistema de cache para otimização de desempenho
export * from './expressionCache';

// Funções utilitárias adicionais podem ser adicionadas neste arquivo
// caso sejam relevantes para vários submódulos 

// Função padronizada para tratar erros em operações matemáticas
export const handleMathError = (operation: 'derivative' | 'integral' | 'limit', expression: string, error: unknown): string => {
  const operationMap = {
    'derivative': 'derivative',
    'integral': 'integral',
    'limit': 'limit'
  };
  
  const errorMessage = error instanceof Error ? error.message : String(error);
  return `${operationMap[operation]}(${expression}) [Error: ${errorMessage}]`;
}; 