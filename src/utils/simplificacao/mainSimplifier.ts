import { Term } from '../mathUtilsCalculo/geral/termDefinition';
import { SimplificationResult } from './simplificationTypes';
import { simplifySubexpressions, setSimplifyExpression as setSubexpressionSimplifier } from './subexpressionSimplifier';
import { simplifyBasicAlgebra } from './algebraicSimplifier';
import { combineLikeTerms } from './termCombiner';
import { simplifyFractions } from './fractionSimplifier';
import { simplifyTrigonometric } from './trigonometricSimplifier';
import { simplifyLogarithmic, setSimplifyExpression as setLogarithmicSimplifier } from './logarithmicSimplifier';
import { flattenExpression } from './termCombiner';
import { sortTermsByExponent } from './utilityFunctions';

// Função auxiliar para garantir que os termos polinomiais estejam ordenados corretamente
const ensurePolynomialOrder = (term: Term): Term => {
  // Processa apenas somas e diferenças
  if (term.type !== 'sum' && term.type !== 'difference') {
    return term;
  }
  
  // Aplana a expressão em termos individuais
  const terms = flattenExpression(term);
  
  // Se houver apenas um termo, não há necessidade de reconstruir
  if (terms.length <= 1) {
    return term;
  }
  
  // Ordena os termos pelo expoente
  sortTermsByExponent(terms);
  
  // Reconstrói a expressão com os termos ordenados
  let result = terms[0];
  for (let i = 1; i < terms.length; i++) {
    result = {
      type: 'sum',
      left: result,
      right: terms[i]
    };
  }
  
  return result;
};

// Função principal para simplificação de expressões
export const simplifyExpression = (term: Term): SimplificationResult => {
  if (!term) return { term, wasSimplified: false };
  
  // Aplica as regras de simplificação na ordem
  let result = term;
  let wasSimplified = false;
  let currentResult: SimplificationResult;
  
  // 1. Simplifica subexpressões recursivamente
  currentResult = simplifySubexpressions(result);
  result = currentResult.term;
  wasSimplified = wasSimplified || currentResult.wasSimplified;
  
  // 2. Aplica simplificações algébricas básicas
  currentResult = simplifyBasicAlgebra(result);
  result = currentResult.term;
  wasSimplified = wasSimplified || currentResult.wasSimplified;
  
  // 3. Combina termos semelhantes
  currentResult = combineLikeTerms(result);
  result = currentResult.term;
  wasSimplified = wasSimplified || currentResult.wasSimplified;
  
  // 4. Simplifica frações
  currentResult = simplifyFractions(result);
  result = currentResult.term;
  wasSimplified = wasSimplified || currentResult.wasSimplified;
  
  // 5. Simplifica expressões trigonométricas
  currentResult = simplifyTrigonometric(result);
  result = currentResult.term;
  wasSimplified = wasSimplified || currentResult.wasSimplified;
  
  // 6. Simplifica expressões logarítmicas
  currentResult = simplifyLogarithmic(result);
  result = currentResult.term;
  wasSimplified = wasSimplified || currentResult.wasSimplified;
  
  // 7. Passo final para garantir que os termos polinomiais estejam corretamente ordenados
  result = ensurePolynomialOrder(result);
  
  return { term: result, wasSimplified };
};

// Inicializa as dependências circulares
setSubexpressionSimplifier(simplifyExpression);
setLogarithmicSimplifier(simplifyExpression); 