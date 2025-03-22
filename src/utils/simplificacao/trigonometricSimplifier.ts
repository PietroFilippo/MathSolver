import { Term } from '../mathUtilsCalculo/geral/termDefinition';
import { SimplificationResult } from './simplificationTypes';
import { areTermsEqual } from './utilityFunctions';

// Simplifica expressões trigonométricas
export const simplifyTrigonometric = (term: Term): SimplificationResult => {
  if (!term) return { term, wasSimplified: false };
  
  // Identidade trigonométrica: sin²(x) + cos²(x) = 1
  if (term.type === 'sum' &&
      term.left?.type === 'power' && term.left.exponent === 2 && term.left.argument?.type === 'sin' &&
      term.right?.type === 'power' && term.right.exponent === 2 && term.right.argument?.type === 'cos' &&
      areTermsEqual(term.left.argument.argument!, term.right.argument.argument!)) {
    return {
      term: { type: 'constant', value: 1 },
      wasSimplified: true
    };
  }
  
  // Identidade trigonométrica: tan(x) = sin(x)/cos(x)
  if (term.type === 'quotient' &&
      term.left?.type === 'sin' && term.right?.type === 'cos' &&
      areTermsEqual(term.left.argument!, term.right.argument!)) {
    return {
      term: {
        type: 'tan',
        argument: term.left.argument
      },
      wasSimplified: true
    };
  }
  
  return { term, wasSimplified: false };
}; 