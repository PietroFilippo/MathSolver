import { Term } from '../mathUtilsCalculo/geral/termDefinition';
import { SimplificationResult } from './simplificationTypes';
import { negateTerm } from '../mathUtilsCalculo/geral/termManipulator';
import { areTermsEqual, areSimilarTerms, combineSimilarTerms, sortTermsByExponent, simplifyQuotientProduct } from './utilityFunctions';
import { simplifyTermsSum } from './termCombiner';

// Aplica simplificações algébricas básicas
export const simplifyBasicAlgebra = (term: Term): SimplificationResult => {
  if (!term) return { term, wasSimplified: false };
  
  switch (term.type) {
    case 'product': {
      // Multiplicação por 0
      if ((term.left?.type === 'constant' && term.left.value === 0) ||
          (term.right?.type === 'constant' && term.right.value === 0)) {
        return {
          term: { type: 'constant', value: 0 },
          wasSimplified: true
        };
      }
      
      // Multiplicação por 1
      if (term.left?.type === 'constant' && term.left.value === 1) {
        return {
          term: term.right!,
          wasSimplified: true
        };
      }
      if (term.right?.type === 'constant' && term.right.value === 1) {
        return {
          term: term.left!,
          wasSimplified: true
        };
      }
      
      // Multiplicação por -1
      if (term.left?.type === 'constant' && term.left.value === -1) {
        return {
          term: negateTerm(term.right!),
          wasSimplified: true
        };
      }
      if (term.right?.type === 'constant' && term.right.value === -1) {
        return {
          term: negateTerm(term.left!),
          wasSimplified: true
        };
      }
      
      // Multiplicação de constantes
      if (term.left?.type === 'constant' && term.right?.type === 'constant') {
        return {
          term: {
            type: 'constant',
            value: term.left.value! * term.right.value!
          },
          wasSimplified: true
        };
      }
      
      // Simplifica multiplicação por potências da mesma base: x^a * x^b = x^(a+b)
      if (term.left?.type === 'power' && term.right?.type === 'power' &&
          areTermsEqual(term.left.argument!, term.right.argument!)) {
        return {
          term: {
            type: 'power',
            argument: term.left.argument,
            exponent: (term.left.exponent || 1) + (term.right.exponent || 1)
          },
          wasSimplified: true
        };
      }
      
      // Simplifica x * x = x^2
      if (areTermsEqual(term.left!, term.right!)) {
        return {
          term: {
            type: 'power',
            argument: term.left,
            exponent: 2
          },
          wasSimplified: true
        };
      }
      
      // Multiplicação de uma constante por um produto com constante: a * (b * c) = (a*b) * c
      if (term.left?.type === 'constant' && term.right?.type === 'product' &&
          term.right.left!.type === 'constant') {
        return {
          term: {
            type: 'product',
            left: { 
              type: 'constant', 
              value: term.left.value! * term.right.left!.value! 
            },
            right: term.right.right!
          },
          wasSimplified: true
        };
      }
      
      // Simplificação para produtos de funções trigonométricas
      // sin(x) * sin(x) = sin²(x)
      if ((term.left?.type === 'sin' && term.right?.type === 'sin') ||
          (term.left?.type === 'cos' && term.right?.type === 'cos') ||
          (term.left?.type === 'tan' && term.right?.type === 'tan')) {
        if (areTermsEqual(term.left.argument!, term.right.argument!)) {
          return {
            term: {
              type: 'power',
              argument: term.left,
              exponent: 2
            },
            wasSimplified: true
          };
        }
      }
      
      // Simplify expressions like 1/x^2 * 2x = 2/x
      if (term.left?.type === 'quotient' && 
          (term.right?.type === 'variable' || term.right?.type === 'product')) {
        const result = simplifyQuotientProduct(term.left, term.right);
        if (result) return { term: result, wasSimplified: true };
      }
      
      if (term.right?.type === 'quotient' && 
          (term.left?.type === 'variable' || term.left?.type === 'product')) {
        const result = simplifyQuotientProduct(term.right, term.left);
        if (result) return { term: result, wasSimplified: true };
      }
      
      break;
    }
      
    case 'sum': {
      // Adição com 0
      if (term.left?.type === 'constant' && term.left.value === 0) {
        return {
          term: term.right!,
          wasSimplified: true
        };
      }
      if (term.right?.type === 'constant' && term.right.value === 0) {
        return {
          term: term.left!,
          wasSimplified: true
        };
      }
      
      // Adição de constantes
      if (term.left?.type === 'constant' && term.right?.type === 'constant') {
        return {
          term: {
            type: 'constant',
            value: term.left.value! + term.right.value!
          },
          wasSimplified: true
        };
      }
      
      // Combina termos semelhantes sempre que possível
      if (areSimilarTerms(term.left!, term.right!)) {
        return {
          term: combineSimilarTerms(term.left!, term.right!, true),
          wasSimplified: true
        };
      }
      
      // Combina somas aninhadas: (a + b) + c = a + b + c para facilitar a combinação
      const terms: Term[] = [];
      
      if (term.left?.type === 'sum') {
        terms.push(term.left.left!, term.left.right!);
      } else {
        terms.push(term.left!);
      }
      
      if (term.right?.type === 'sum') {
        terms.push(term.right.left!, term.right.right!);
      } else {
        terms.push(term.right!);
      }
      
      // Tente combinar termos semelhantes na lista expandida
      const simplifiedTerms = simplifyTermsSum(terms);
      
      if (simplifiedTerms.length === 1) {
        return { term: simplifiedTerms[0], wasSimplified: true };
      } else if (simplifiedTerms.length >= 2) {
        // Ordena termos por potências decrescentes antes de reconstruir a árvore
        sortTermsByExponent(simplifiedTerms);
        
        // Reconstrói a árvore da soma a partir da lista simplificada e ordenada
        let result = simplifiedTerms[0];
        for (let i = 1; i < simplifiedTerms.length; i++) {
          result = {
            type: 'sum',
            left: result,
            right: simplifiedTerms[i]
          };
        }
        return { term: result, wasSimplified: true };
      }
      
      break;
    }
      
    case 'difference': {
      // Subtração por 0
      if (term.right?.type === 'constant' && term.right.value === 0) {
        return {
          term: term.left!,
          wasSimplified: true
        };
      }
      
      // Subtração de constantes
      if (term.left?.type === 'constant' && term.right?.type === 'constant') {
        return {
          term: {
            type: 'constant',
            value: term.left.value! - term.right.value!
          },
          wasSimplified: true
        };
      }
      
      // Subtração de si mesmo
      if (areTermsEqual(term.left!, term.right!)) {
        return {
          term: { type: 'constant', value: 0 },
          wasSimplified: true
        };
      }
      
      // Subtração de 0
      if (term.left?.type === 'constant' && term.left.value === 0) {
        // 0 - x = -x, representado como -1 * x
        return {
          term: {
            type: 'product',
            left: { type: 'constant', value: -1 },
            right: term.right!
          },
          wasSimplified: true
        };
      }
      
      // Combine termos semelhantes quando possível (e.g., 5x - 2x = 3x)
      if (areSimilarTerms(term.left!, term.right!)) {
        return {
          term: combineSimilarTerms(term.left!, term.right!, false),
          wasSimplified: true
        };
      }
      
      // Transforma a - (-b) em a + b
      if (term.right?.type === 'product' && 
          term.right.left?.type === 'constant' && 
          term.right.left.value! < 0) {
        return {
          term: {
            type: 'sum',
            left: term.left!,
            right: {
              type: 'product',
              left: { type: 'constant', value: -term.right.left.value! },
              right: term.right.right!
            }
          },
          wasSimplified: true
        };
      }
      
      break;
    }
      
    case 'quotient': {
      // Divisão por 1
      if (term.right?.type === 'constant' && term.right.value === 1) {
        return {
          term: term.left!,
          wasSimplified: true
        };
      }
      
      // Divisão por 0
      if (term.left?.type === 'constant' && term.left.value === 0) {
        return {
          term: { type: 'constant', value: 0 },
          wasSimplified: true
        };
      }
      
      // Divisão de constantes
      if (term.left?.type === 'constant' && term.right?.type === 'constant' && term.right.value !== 0) {
        return {
          term: {
            type: 'constant',
            value: term.left.value! / term.right.value!
          },
          wasSimplified: true
        };
      }
      
      // Se o numerador e o denominador forem iguais, o resultado é 1
      if (areTermsEqual(term.left!, term.right!)) {
        return { 
          term: { type: 'constant', value: 1 },
          wasSimplified: true
        };
      }
      
      // Simplifica expressões como (a*x) / x = a
      if (term.left?.type === 'product' && 
          (term.right?.type === 'variable' || term.right?.type === 'power')) {
        
        if (term.left.right?.type === 'variable' && term.right.type === 'variable' &&
            term.left.right.variable === term.right.variable) {
          return { 
            term: term.left.left!,
            wasSimplified: true
          };
        }
        
        // Simplifica (a*x^n) / x^m = a*x^(n-m) se n > m, ou a/(x^(m-n)) se m > n
        if (term.left.right?.type === 'power' && term.right.type === 'power' &&
            areTermsEqual(term.left.right.argument!, term.right.argument!)) {
          const expDiff = (term.left.right.exponent ?? 1) - (term.right.exponent ?? 1);
          
          if (expDiff > 0) {
            return {
              term: {
                type: 'product',
                left: term.left.left!,
                right: {
                  type: 'power',
                  argument: term.right.argument,
                  exponent: expDiff
                }
              },
              wasSimplified: true
            };
          } else if (expDiff < 0) {
            return {
              term: {
                type: 'quotient',
                left: term.left.left!,
                right: {
                  type: 'power',
                  argument: term.right.argument,
                  exponent: -expDiff
                }
              },
              wasSimplified: true
            };
          } else {
            return { 
              term: term.left.left!,
              wasSimplified: true 
            };
          }
        }
      }
      
      // Simplifica divisões de potências da mesma base: x^a / x^b = x^(a-b)
      if (term.left?.type === 'power' && term.right?.type === 'power' &&
          areTermsEqual(term.left.argument!, term.right.argument!)) {
        const expDiff = (term.left.exponent ?? 1) - (term.right.exponent ?? 1);
        
        if (expDiff === 0) {
          return { 
            term: { type: 'constant', value: 1 },
            wasSimplified: true
          };
        } else if (expDiff > 0) {
          return {
            term: {
              type: 'power',
              argument: term.left.argument,
              exponent: expDiff
            },
            wasSimplified: true
          };
        } else {
          return {
            term: {
              type: 'quotient',
              left: { type: 'constant', value: 1 },
              right: {
                type: 'power',
                argument: term.left.argument,
                exponent: -expDiff
              }
            },
            wasSimplified: true
          };
        }
      }
      
      break;
    }
  }
  
  return { term, wasSimplified: false };
}; 