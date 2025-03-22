import { Term } from '../mathUtilsCalculo/geral/termDefinition';
import { SimplificationResult } from './simplificationTypes';

// Função principal para simplificar subexpressões recursivamente
export const simplifySubexpressions = (term: Term): SimplificationResult => {
  if (!term) return { term, wasSimplified: false };
  
  let wasSimplified = false;
  
  switch (term.type) {
    case 'constant':
    case 'variable':
      return { term, wasSimplified: false };
      
    case 'power': {
      const argResult = simplifyExpression(term.argument!);
      wasSimplified = argResult.wasSimplified;
      
      // Casos especiais: anything^0 = 1, anything^1 = itself
      if (term.exponent === 0) {
        return { 
          term: { type: 'constant', value: 1 },
          wasSimplified: true
        };
      } else if (term.exponent === 1) {
        return { 
          term: argResult.term,
          wasSimplified: true
        };
      }
      
      // Se o argumento é uma potência, combine os expoentes: (x^a)^b = x^(a*b)
      if (argResult.term.type === 'power') {
        return {
          term: {
            type: 'power',
            argument: argResult.term.argument,
            exponent: (term.exponent ?? 1) * (argResult.term.exponent ?? 1)
          },
          wasSimplified: true
        };
      }
      
      return {
        term: {
          type: 'power',
          argument: argResult.term,
          exponent: term.exponent
        },
        wasSimplified
      };
    }
      
    case 'sin':
    case 'cos':
    case 'tan':
    case 'ln':
    case 'log':
    case 'exp':
    case 'sqrt':
    case 'arcsin':
    case 'arccos':
    case 'arctan': {
      const argResult = simplifyExpression(term.argument!);
      wasSimplified = argResult.wasSimplified;
      
      return {
        term: {
          type: term.type,
          argument: argResult.term
        },
        wasSimplified
      };
    }
      
    case 'sum':
    case 'difference':
    case 'product':
    case 'quotient': {
      const leftResult = simplifyExpression(term.left!);
      const rightResult = simplifyExpression(term.right!);
      wasSimplified = leftResult.wasSimplified || rightResult.wasSimplified;
      
      return {
        term: {
          type: term.type,
          left: leftResult.term,
          right: rightResult.term
        },
        wasSimplified
      };
    }
      
    default:
      return { term, wasSimplified: false };
  }
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