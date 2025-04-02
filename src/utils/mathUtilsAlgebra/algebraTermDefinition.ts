// ===================================================
// ========= DEFINIÇÕES DE TERMOS ALGÉBRICOS =========
// ===================================================

// Definição dos tipos de termos algébricos
export type AlgebraTerm = {
  type: 'constant' | 'variable' | 'power' | 'sum' | 'difference' | 'product' | 'quotient' | 'negative' | 'function' | 'polynomial' | 'fraction';
  value?: number;
  variable?: string;
  exponent?: number | AlgebraTerm;
  argument?: AlgebraTerm;
  left?: AlgebraTerm;
  right?: AlgebraTerm;
  functionName?: string;
  terms?: AlgebraTerm[];
  numerator?: AlgebraTerm;
  denominator?: AlgebraTerm;
};

// Função auxiliar para criar uma cópia profunda de um termo
export const cloneTerm = (term: AlgebraTerm): AlgebraTerm => {
  if (!term) return term;
  
  const cloned: AlgebraTerm = { type: term.type };
  
  if (term.value !== undefined) cloned.value = term.value;
  if (term.variable) cloned.variable = term.variable;
  
  if (typeof term.exponent === 'number') {
    cloned.exponent = term.exponent;
  } else if (term.exponent) {
    cloned.exponent = cloneTerm(term.exponent as AlgebraTerm);
  }
  
  if (term.argument) cloned.argument = cloneTerm(term.argument);
  if (term.left) cloned.left = cloneTerm(term.left);
  if (term.right) cloned.right = cloneTerm(term.right);
  if (term.functionName) cloned.functionName = term.functionName;
  
  if (term.terms) {
    cloned.terms = term.terms.map(t => cloneTerm(t));
  }
  
  if (term.numerator) cloned.numerator = cloneTerm(term.numerator);
  if (term.denominator) cloned.denominator = cloneTerm(term.denominator);
  
  return cloned;
};

// Função para verificar se dois termos algébricos são iguais
export const areTermsEqual = (term1: AlgebraTerm, term2: AlgebraTerm): boolean => {
  // Termos nulos são considerados iguais
  if (!term1 && !term2) return true;
  
  // Se um é nulo e o outro não, são diferentes
  if (!term1 || !term2) return false;
  
  // Se são de tipos diferentes, são diferentes
  if (term1.type !== term2.type) {
    return false;
  }
  
  // Verificação para cada tipo de termo
  switch (term1.type) {
    case 'constant':
      // Constantes são iguais se têm o mesmo valor
      return Math.abs((term1.value || 0) - (term2.value || 0)) < 1e-10;
      
    case 'variable':
      // Variáveis são iguais se têm o mesmo nome
      return term1.variable === term2.variable;
      
    case 'power':
      // Potências precisam ter a mesma base e expoente
      // Verificar se ambos têm a variável ou argumento
      if (term1.variable && term2.variable) {
        // Se a base é uma variável, comparar os nomes das variáveis
        if (term1.variable !== term2.variable) {
          return false;
        }
      } else if (term1.argument && term2.argument) {
        // Se a base é uma expressão, comparar recursivamente
        if (!areTermsEqual(term1.argument, term2.argument)) {
          return false;
        }
      } else {
        // Um tem variável e o outro tem argumento, são diferentes
        return false;
      }
      
      // Comparar expoentes
      if (typeof term1.exponent === 'number' && typeof term2.exponent === 'number') {
        return Math.abs(term1.exponent - term2.exponent) < 1e-10;
      } else if (typeof term1.exponent !== 'number' && typeof term2.exponent !== 'number') {
        // Se ambos os expoentes são expressões, comparar recursivamente
        return areTermsEqual(term1.exponent as AlgebraTerm, term2.exponent as AlgebraTerm);
      } else {
        // Um expoente é número e o outro é expressão, são diferentes
        return false;
      }
      
    case 'sum':
    case 'difference':
    case 'product':
    case 'quotient':
      // Operações binárias são iguais se os operandos são iguais
      return areTermsEqual(term1.left!, term2.left!) && 
             areTermsEqual(term1.right!, term2.right!);
      
    case 'negative':
      // Negação é igual se os argumentos são iguais
      return areTermsEqual(term1.argument!, term2.argument!);
      
    case 'function':
      // Funções são iguais se têm o mesmo nome e argumento
      return term1.functionName === term2.functionName && 
             areTermsEqual(term1.argument!, term2.argument!);
      
    default:
      // Para outros tipos, consideramos diferentes
      return false;
  }
}; 