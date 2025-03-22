import { Term } from '../mathUtilsCalculo/geral/termDefinition';

// Verifica se dois termos são estruturalmente iguais
export const areTermsEqual = (term1: Term, term2: Term): boolean => {
  if (term1.type !== term2.type) return false;
  
  switch (term1.type) {
    case 'constant':
      return term1.value === (term2 as { value?: number }).value;
      
    case 'variable':
      return term1.variable === (term2 as { variable?: string }).variable;
      
    case 'power':
      return term1.exponent === (term2 as { exponent?: number }).exponent &&
             areTermsEqual(term1.argument!, (term2 as { argument?: Term }).argument!);
      
    case 'sin':
    case 'cos':
    case 'tan':
    case 'ln':
    case 'log':
    case 'exp':
    case 'sqrt':
    case 'arcsin':
    case 'arccos':
    case 'arctan':
      return areTermsEqual(term1.argument!, (term2 as { argument?: Term }).argument!);
      
    case 'sum':
    case 'difference':
    case 'product':
    case 'quotient':
      return areTermsEqual(term1.left!, (term2 as { left?: Term }).left!) &&
             areTermsEqual(term1.right!, (term2 as { right?: Term }).right!);
      
    default:
      return false;
  }
};

// Verifica se dois termos são semelhantes (podem ser combinados)
export const areSimilarTerms = (term1: Term, term2: Term): boolean => {
  if (term1.type !== term2.type) return false;
  
  switch (term1.type) {
    case 'variable':
      return term1.variable === (term2 as { variable?: string }).variable;
      
    case 'power':
      return term1.exponent === (term2 as { exponent?: number }).exponent &&
             areSimilarTerms(term1.argument!, (term2 as { argument?: Term }).argument!);
      
    case 'sin':
    case 'cos':
    case 'tan':
    case 'ln':
    case 'log':
    case 'exp':
    case 'sqrt':
    case 'arcsin':
    case 'arccos':
    case 'arctan':
      return areSimilarTerms(term1.argument!, (term2 as { argument?: Term }).argument!);
      
    case 'product':
      // Verifica se os termos não constantes são semelhantes
      if (term1.left?.type === 'constant' && term2.left?.type === 'constant') {
        return areSimilarTerms(term1.right!, term2.right!);
      } else if (term1.right?.type === 'constant' && term2.right?.type === 'constant') {
        return areSimilarTerms(term1.left!, term2.left!);
      } else if (
        (term1.left?.type === 'constant' && areSimilarTerms(term1.right!, term2)) ||
        (term1.right?.type === 'constant' && areSimilarTerms(term1.left!, term2))
      ) {
        return true;
      }
      return false;
      
    default:
      return false;
  }
};

// Combina dois termos semelhantes
export const combineSimilarTerms = (term1: Term, term2: Term, isAddition: boolean = true): Term => {
  if (!areSimilarTerms(term1, term2)) return term1;
  
  switch (term1.type) {
    case 'constant':
      return {
        type: 'constant',
        value: isAddition ? term1.value! + term2.value! : term1.value! - term2.value!
      };
      
    case 'variable':
      return {
        type: 'product',
        left: {
          type: 'constant',
          value: isAddition ? 2 : 0
        },
        right: term1
      };
      
    case 'product':
      if (term1.left?.type === 'constant' && term2.left?.type === 'constant') {
        const newValue = isAddition 
          ? term1.left.value! + term2.left.value! 
          : term1.left.value! - term2.left.value!;
          
        if (newValue === 0) {
          return { type: 'constant', value: 0 };
        }
          
        return {
          type: 'product',
          left: {
            type: 'constant',
            value: newValue
          },
          right: term1.right!
        };
      } else if (term1.right?.type === 'constant' && term2.right?.type === 'constant') {
        const newValue = isAddition 
          ? term1.right.value! + term2.right.value! 
          : term1.right.value! - term2.right.value!;
          
        if (newValue === 0) {
          return { type: 'constant', value: 0 };
        }
          
        return {
          type: 'product',
          left: term1.left!,
          right: {
            type: 'constant',
            value: newValue
          }
        };
      } else if (term1.left?.type === 'constant' && areSimilarTerms(term1.right!, term2)) {
        return {
          type: 'product',
          left: {
            type: 'constant',
            value: isAddition ? term1.left.value! + 1 : term1.left.value! - 1
          },
          right: term1.right!
        };
      } else if (term1.right?.type === 'constant' && areSimilarTerms(term1.left!, term2)) {
        return {
          type: 'product',
          left: term1.left!,
          right: {
            type: 'constant',
            value: isAddition ? term1.right.value! + 1 : term1.right.value! - 1
          }
        };
      }
      break;
      
    case 'power':
    case 'sin':
    case 'cos':
    case 'tan':
    case 'ln':
    case 'log':
    case 'exp':
    case 'sqrt':
      return {
        type: 'product',
        left: {
          type: 'constant',
          value: isAddition ? 2 : 0
        },
        right: term1
      };
  }
  
  return term1;
};

// Ordena termos por expoente decrescente
export const sortTermsByExponent = (terms: Term[]): void => {
  terms.sort((a, b) => {
    const getExponent = (term: Term): number => {
      if (term.type === 'power') {
        return term.exponent || 1;
      } else if (term.type === 'variable') {
        return 1;
      } else if (term.type === 'constant') {
        return 0;
      } else if (term.type === 'product') {
        // Para produtos, calcula o expoente combinado de todos os fatores variáveis
        let productExponent = 0;
        
        // Verifica se o lado esquerdo contém uma variável ou potência
        if (term.left) {
          productExponent += getExponent(term.left);
        }
        
        // Verifica se o lado direito contém uma variável ou potência
        if (term.right) {
          productExponent += getExponent(term.right);
        }
        
        return productExponent;
      } else {
        return -1; // Other term types go at the end
      }
    };
    
    return getExponent(b) - getExponent(a); // Descending order
  });
};

// Simplifica expressões como 1/x^2 * 2x = 2/x
export const simplifyQuotientProduct = (quotient: Term, term: Term): Term | null => {
  if (quotient.type !== 'quotient') return null;
  if (!quotient.left || !quotient.right) return null;
  
  // Verifica se podemos cancelar uma variável ou potência entre o denominador e o termo
  if ((quotient.right.type === 'variable' || quotient.right.type === 'power') &&
      (term.type === 'variable' || term.type === 'power')) {
      
    if (quotient.right.type === 'variable' && term.type === 'variable' &&
        quotient.right.variable === term.variable) {
      // Caso: (a/x) * x = a
      return quotient.left;
    }
    
    if (quotient.right.type === 'power' && term.type === 'power' &&
        quotient.right.argument && term.argument &&
        areTermsEqual(quotient.right.argument, term.argument)) {
        
      const quotientExp = quotient.right.exponent || 1;
      const termExp = term.exponent || 1;
      
      if (quotientExp > termExp) {
        // Caso: (a/x^3) * x^2 = a/x
        return {
          type: 'quotient',
          left: quotient.left,
          right: {
            type: 'power',
            argument: quotient.right.argument,
            exponent: quotientExp - termExp
          }
        };
      } else if (quotientExp === termExp) {
        // Caso: (a/x^2) * x^2 = a
        return quotient.left;
      }
    }
  }
  
  return null;
};

// Adiciona a função getTermExponent
export const getTermExponent = (term: Term): number => {
  switch (term.type) {
    case 'constant':
      return 0; // Constants have exponent 0
    
    case 'variable':
      return 1; // Simple variables have exponent 1
    
    case 'power':
      if (term.argument?.type === 'variable') {
        return term.exponent || 1; // Use 1 as default if exponent is undefined
      }
      return 0;
    
    case 'product':
      // For products, we sum the exponents
      let productExponent = 0;
      if (term.left) {
        productExponent += getTermExponent(term.left);
      }
      if (term.right) {
        productExponent += getTermExponent(term.right);
      }
      return productExponent;
    
    default:
      return 0;
  }
};

// Adiciona a função areSimilarForCombining
export const areSimilarForCombining = (term1: Term, term2: Term): boolean => {
  // Dois termos variáveis iguais
  if (term1.type === 'variable' && term2.type === 'variable' && 
      term1.variable === term2.variable) {
    return true;
  }
  
  // Dois termos potência com o mesmo argumento e expoente
  if (term1.type === 'power' && term2.type === 'power' &&
      term1.exponent === term2.exponent && 
      areTermsEqual(term1.argument!, term2.argument!)) {
    return true;
  }
  
  // Dois produtos onde um tem uma constante e o outro é semelhante
  if (term1.type === 'product' && term1.left!.type === 'constant' &&
      (areTermsEqual(term1.right!, term2) || areSimilarTerms(term1.right!, term2))) {
    return true;
  }
  
  if (term2.type === 'product' && term2.left!.type === 'constant' &&
      (areTermsEqual(term1, term2.right!) || areSimilarTerms(term1, term2.right!))) {
    return true;
  }
  
  return false;
}; 