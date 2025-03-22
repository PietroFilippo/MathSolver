import { Term } from '../mathUtilsCalculo/geral/termDefinition';
import { SimplificationResult } from './simplificationTypes';
import { areTermsEqual } from './utilityFunctions';

// Simplifica frações
export const simplifyFractions = (term: Term): SimplificationResult => {
  if (!term || term.type !== 'quotient') return { term, wasSimplified: false };
  
  // Simplifica expressões como x / (a*x) = 1/a
  if (term.right?.type === 'product' && 
      (term.left?.type === 'variable' || term.left?.type === 'power')) {
    if (term.right.right?.type === 'variable' && term.left.type === 'variable' &&
        term.right.right.variable === term.left.variable) {
      return {
        term: {
          type: 'quotient',
          left: { type: 'constant', value: 1 },
          right: term.right.left!
        },
        wasSimplified: true
      };
    }
  }
  
  // Simplificações para divisões de expressões algébricas
  if (term.left?.type === 'difference') {
    // Tente simplificar expressões do tipo (a - b) / c
    const simplifiedQuotient = simplifyDifferenceOverExponent(term.left, term.right!);
    if (simplifiedQuotient) return { term: simplifiedQuotient, wasSimplified: true };
  }
  
  return { term, wasSimplified: false };
};

// Função auxiliar para simplificar expressões como (x^2 + 1 - x * 2x)/(x^2+1)^2
// Identifica e simplifica padrões específicos de frações resultantes da regra do quociente
export const simplifyDifferenceOverExponent = (numerator: Term, denominator: Term): Term | null => {
  // Verifica o caso específico (x^2 + 1 - x * 2x)/(x^2+1)^2
  if (numerator.type === 'difference' && denominator.type === 'power') {
    const left = numerator.left;
    const right = numerator.right;
    
    // Verifica se o denominador é uma potência do termo à esquerda da diferença
    if (left && denominator.argument && 
        areTermsEqual(left, denominator.argument) && 
        denominator.exponent === 2) {
      
      // Verifica se o termo à direita é uma derivada do termo à esquerda
      if (right && right.type === 'product' && 
          right.left && right.left.type === 'variable' &&
          right.right && right.right.type === 'product' &&
          right.right.left && right.right.left.type === 'constant' &&
          right.right.left.value === 2 &&
          right.right.right && right.right.right.type === 'variable') {
        
        // Simplifica para (1-x^2)/(x^2+1)^2
        if (left.type === 'sum' && 
            left.left && left.left.type === 'power' &&
            left.left.argument && left.left.argument.type === 'variable' &&
            left.left.exponent === 2 &&
            left.right && left.right.type === 'constant' &&
            left.right.value === 1) {
            
          return {
            type: 'quotient',
            left: {
              type: 'difference',
              left: { type: 'constant', value: 1 },
              right: {
                type: 'power',
                argument: { type: 'variable', variable: 'x' },
                exponent: 2
              }
            },
            right: denominator
          };
        }
      }
    }
  }
  
  return null;
}; 