import { Term } from '../mathUtilsCalculo/geral/termDefinition';
import { SimplificationResult } from './simplificationTypes';

// Simplifica expressões logarítmicas
export const simplifyLogarithmic = (term: Term): SimplificationResult => {
  if (!term) return { term, wasSimplified: false };
  
  if (term.type === 'ln') {
    const argSimplified = simplifyExpression(term.argument!).term;
    
    // Simplificação para ln(x^n) = n*ln(x)
    if (argSimplified.type === 'power' && 
        argSimplified.argument!.type === 'variable') {
      return {
        term: {
          type: 'product',
          left: { type: 'constant', value: argSimplified.exponent },
          right: { 
            type: 'ln', 
            argument: argSimplified.argument 
          }
        },
        wasSimplified: true
      };
    }
    
    // Simplificação para ln(e^x) = x
    if (argSimplified.type === 'exp') {
      return {
        term: argSimplified.argument!,
        wasSimplified: true
      };
    }
  }
  
  // Simplificação para e^(ln(x)) = x
  if (term.type === 'exp' && term.argument?.type === 'ln') {
    return {
      term: term.argument.argument!,
      wasSimplified: true
    };
  }
  
  return { term, wasSimplified: false };
};

// Placeholder para a função simplifyExpression que será importada de mainSimplifier
// Isso é necessário devido à dependência circular
let simplifyExpression: (term: Term) => SimplificationResult = (term: Term) => {
  return { term, wasSimplified: false };
};

// Função para definir a função actual simplifyExpression
export const setSimplifyExpression = (fn: (term: Term) => SimplificationResult) => {
  simplifyExpression = fn;
}; 