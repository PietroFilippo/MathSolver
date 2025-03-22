// Re-export os tipos de simplificação
export type { SimplificationResult } from './simplificationTypes';

// Re-export as funções principais de simplificação
export { simplifyExpression } from './mainSimplifier';

// Re-export funções auxiliares
export { 
  areTermsEqual, 
  areSimilarTerms,
  combineSimilarTerms,
  getTermExponent,
  areSimilarForCombining,
  simplifyQuotientProduct,
  sortTermsByExponent
} from './utilityFunctions';

// Re-export simplificadores especializados
export { simplifySubexpressions } from './subexpressionSimplifier';
export { simplifyBasicAlgebra } from './algebraicSimplifier';
export { combineLikeTerms } from './termCombiner';
export { simplifyFractions } from './fractionSimplifier';
export { simplifyTrigonometric } from './trigonometricSimplifier';
export { simplifyLogarithmic } from './logarithmicSimplifier';

// Este arquivo é o ponto de entrada principal para as utilidades de simplificação