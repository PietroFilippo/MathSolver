// ===================================================
// === FUNÇÕES DE MANIPULAÇÃO DE TERMOS ALGÉBRICOS ===
// ===================================================

import { AlgebraTerm, cloneTerm, areTermsEqual } from './algebraTermDefinition';

// Cache para termos convertidos em strings
const stringifiedTermCache: Map<string, string> = new Map();

// Função para converter um termo algébrico em string para exibição
export const termToString = (term: AlgebraTerm): string => {
  if (!term) return '';
  
  // Gerar uma chave de cache com base no conteúdo do termo
  const cacheKey = JSON.stringify(term);
  
  // Verificar se já foi processado antes
  if (stringifiedTermCache.has(cacheKey)) {
    return stringifiedTermCache.get(cacheKey)!;
  }
  
  let result = '';
  
  switch (term.type) {
    case 'constant':
      result = `${term.value}`;
      break;
      
    case 'variable':
      result = term.variable || '';
      break;
      
    case 'power':
      if (term.variable) {
        result = `${term.variable}${term.exponent && term.exponent !== 1 ? `^${typeof term.exponent === 'number' ? term.exponent : termToString(term.exponent as AlgebraTerm)}` : ''}`;
      } else if (term.argument) {
        const base = termToString(term.argument);
        const needsParens = term.argument.type !== 'constant' && term.argument.type !== 'variable';
        result = `${needsParens ? '(' : ''}${base}${needsParens ? ')' : ''}${term.exponent && term.exponent !== 1 ? `^${typeof term.exponent === 'number' ? term.exponent : termToString(term.exponent as AlgebraTerm)}` : ''}`;
      }
      break;
      
    case 'negative':
      const argStr = termToString(term.argument!);
      // Adicionar parênteses ao argumento se for uma soma ou diferença para evitar ambiguidade
      const needsParensNeg = term.argument!.type === 'sum' || term.argument!.type === 'difference';
      result = `-${needsParensNeg ? `(${argStr})` : argStr}`;
      break;
      
    case 'sum':
      result = `${termToString(term.left!)} + ${termToString(term.right!)}`;
      break;
      
    case 'difference':
      const rightDiffStr = termToString(term.right!);
      // Adicionar parênteses ao termo direito se for uma soma ou diferença para evitar ambiguidade
      const needsParens = term.right!.type === 'sum' || term.right!.type === 'difference';
      result = `${termToString(term.left!)} - ${needsParens ? `(${rightDiffStr})` : rightDiffStr}`;
      break;
      
    case 'product':
      // Verificar se os operandos precisam de parênteses (somas, diferenças ou outros produtos)
      const leftNeedsParens = term.left!.type === 'sum' || term.left!.type === 'difference';
      const rightNeedsParens = term.right!.type === 'sum' || term.right!.type === 'difference';
      
      const leftStr = termToString(term.left!);
      const rightStr = termToString(term.right!);
      
      // Para factorização, precisamos verificar se estamos multiplicando dois binômios
      const isBinomialProduct = (term.left!.type === 'sum' || term.left!.type === 'difference') && 
                              (term.right!.type === 'sum' || term.right!.type === 'difference');
      
      if (isBinomialProduct) {
        // Para produtos de binômios, usar formato (a+b)(c+d)
        result = `(${leftStr})(${rightStr})`;
      } else {
        // Adicionar parênteses conforme necessário para evitar ambiguidade
        result = `${leftNeedsParens ? `(${leftStr})` : leftStr} * ${rightNeedsParens ? `(${rightStr})` : rightStr}`;
      }
      break;
      
    case 'quotient':
      result = `${termToString(term.left!)} / ${termToString(term.right!)}`;
      break;
      
    case 'function':
      result = `${term.functionName}(${termToString(term.argument!)})`;
      break;
      
    case 'modulus':
      result = `|${termToString(term.argument!)}|`;
      break;
      
    case 'polynomial':
      if (term.terms && term.terms.length > 0) {
        result = term.terms.map(t => termToString(t)).join(' + ');
      } else {
        result = '0'; // Polinômio vazio
      }
      break;
      
    case 'fraction':
      const fracNum = termToString(term.numerator!);
      const fracDenom = termToString(term.denominator!);
      result = `(${fracNum})/(${fracDenom})`;
      break;
      
    default:
      result = 'Termo não suportado';
  }
  
  // Armazenar no cache para uso futuro
  stringifiedTermCache.set(cacheKey, result);
  
  return result;
};

// Função para simplificar constantes em um termo algébrico
export const simplifyConstants = (term: AlgebraTerm): AlgebraTerm => {
  if (!term) return term;
  // Caso base: constante, apenas retornar
  if (term.type === 'constant') {
    return term;
  }
  
  // Caso base: variável, apenas retornar
  if (term.type === 'variable') {
    return term;
  }
  
  // Caso recursivo: simplificar subtermos primeiro
  let result: AlgebraTerm = { ...term };
  
  if (term.type === 'power') {
    if (term.argument) {
      result.argument = simplifyConstants(term.argument);
    }
    if (typeof term.exponent !== 'number' && term.exponent) {
      result.exponent = simplifyConstants(term.exponent as AlgebraTerm);
    }
  } else if (term.type === 'sum') {
    result.left = simplifyConstants(term.left!);
    result.right = simplifyConstants(term.right!);
    
    // Caso especial: se ambos os lados são constantes, somar
    if (result.left?.type === 'constant' && result.right?.type === 'constant') {
      return {
        type: 'constant',
        value: (result.left.value || 0) + (result.right.value || 0)
      };
    }
    
    // Caso especial: se um lado é zero, retornar o outro lado
    if (result.left?.type === 'constant' && Math.abs(result.left.value || 0) < 1e-10) {
      return result.right!;
    }
    if (result.right?.type === 'constant' && Math.abs(result.right.value || 0) < 1e-10) {
      return result.left!;
    }
  } else if (term.type === 'difference') {
    result.left = simplifyConstants(term.left!);
    result.right = simplifyConstants(term.right!);
    
    // Caso especial: verificar por diferença de termos com a mesma estrutura
    if (areTermsEqual(result.left!, result.right!)) {
      return { type: 'constant', value: 0 };
    }
    
    // IMPORTANTE: Para expressões do tipo a^2 - b^2, não simplificar para 0
    // Verificar se estamos lidando com diferença de quadrados
    const leftStr = termToString(result.left!);
    const rightStr = termToString(result.right!);
    
    if ((leftStr.includes('^2') || leftStr.includes('²')) && 
        (rightStr.includes('^2') || rightStr.includes('²'))) {
      // Não simplificar mais - retornar a estrutura preservada para fatoração posterior
      return result;
    }
    
    // Caso especial: se ambos os lados são constantes, subtrair
    if (result.left?.type === 'constant' && result.right?.type === 'constant') {
      return {
        type: 'constant',
        value: (result.left.value || 0) - (result.right.value || 0)
      };
    }
    
    // Caso especial: se o lado direito é zero, retornar o lado esquerdo
    if (result.right?.type === 'constant' && Math.abs(result.right.value || 0) < 1e-10) {
      return result.left!;
    }
    
    // Caso especial: se o lado esquerdo é zero, retornar o negativo do lado direito
    if (result.left?.type === 'constant' && Math.abs(result.left.value || 0) < 1e-10) {
      return {
        type: 'negative',
        argument: result.right!
      };
    }
  } else if (term.type === 'product') {
    result.left = simplifyConstants(term.left!);
    result.right = simplifyConstants(term.right!);
    
    // Caso especial: se um dos lados é zero, o produto é zero
    if ((result.left?.type === 'constant' && Math.abs(result.left.value || 0) < 1e-10) ||
        (result.right?.type === 'constant' && Math.abs(result.right.value || 0) < 1e-10)) {
      return { type: 'constant', value: 0 };
    }
    
    // Caso especial: se um lado é 1, retornar o outro lado
    if (result.left?.type === 'constant' && Math.abs(result.left.value! - 1) < 1e-10) {
      return result.right!;
    }
    if (result.right?.type === 'constant' && Math.abs(result.right.value! - 1) < 1e-10) {
      return result.left!;
    }
    
    // Caso especial: se ambos os lados são constantes, multiplicar
    if (result.left?.type === 'constant' && result.right?.type === 'constant') {
      return {
        type: 'constant',
        value: (result.left.value || 0) * (result.right.value || 0)
      };
    }
  } else if (term.type === 'quotient') {
    result.left = simplifyConstants(term.left!);
    result.right = simplifyConstants(term.right!);
    
    // Caso especial: se o numerador é zero, o resultado é zero
    if (result.left?.type === 'constant' && Math.abs(result.left.value || 0) < 1e-10) {
      return { type: 'constant', value: 0 };
    }
    
    // Caso especial: divisão por 1 retorna o numerador
    if (result.right?.type === 'constant' && Math.abs(result.right.value! - 1) < 1e-10) {
      return result.left!;
    }
    
    // Caso especial: se ambos os lados são constantes, dividir
    if (result.left?.type === 'constant' && result.right?.type === 'constant') {
      if (Math.abs(result.right.value || 0) < 1e-10) {
        return { type: 'constant', value: NaN };
      }
      return {
        type: 'constant',
        value: (result.left.value || 0) / (result.right.value || 1)
      };
    }
  } else if (term.type === 'negative') {
    const simplified = simplifyConstants(term.argument!);
    
    // Caso especial: se o argumento é uma constante, apenas negar
    if (simplified.type === 'constant') {
      return {
        type: 'constant',
        value: -(simplified.value || 0)
      };
    }
    
    // Caso especial: duplo negativo
    if (simplified.type === 'negative') {
      return simplified.argument!;
    }
    
    result.argument = simplified;
  } else if (term.type === 'function') {
    if (term.argument) {
      result.argument = simplifyConstants(term.argument);
    }
  } else if (term.type === 'polynomial') {
    if (term.terms && term.terms.length) {
      result.terms = term.terms.map(simplifyConstants);
    }
  }
  
  return result;
};

// Verifica se um termo contém uma determinada variável
export const containsVariable = (term: AlgebraTerm, variable: string): boolean => {
  if (!term) return false;
  
  switch (term.type) {
    case 'constant':
      return false;
      
    case 'variable':
      return term.variable === variable;
      
    case 'power':
      if (term.variable === variable) return true;
      return containsVariable(term.argument!, variable) || 
             (typeof term.exponent !== 'number' && 
              containsVariable(term.exponent as AlgebraTerm, variable));
      
    case 'sum':
    case 'difference':
    case 'product':
    case 'quotient':
      return containsVariable(term.left!, variable) || 
             containsVariable(term.right!, variable);
      
    case 'negative':
    case 'function':
      return containsVariable(term.argument!, variable);
      
    case 'polynomial':
      return term.terms?.some(t => containsVariable(t, variable)) || false;
      
    case 'fraction':
      return containsVariable(term.numerator!, variable) || 
             containsVariable(term.denominator!, variable);
      
    default:
      return false;
  }
}; 