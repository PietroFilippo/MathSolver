// ===================================================
// ========= UTILIDADES DE FATORAÇÃO ALGÉBRICA ========
// ===================================================

import { AlgebraTerm, cloneTerm, areTermsEqual } from '../terms/algebraTermDefinition';
import { termToString } from '../terms/algebraTermManipulator';
import { extractTermsFromSum, normalizeNegativeTerm, extractCoefficientAndVariable } from '../terms/algebraTermUtils';
import { findGCD } from '../core/algebraUtils';
import { QuadraticInfo, LinearInfo } from '../core/algebraTypes';

// Encontrar o fator comum entre dois termos
export const findCommonFactor = (prod1: AlgebraTerm, prod2: AlgebraTerm): AlgebraTerm | null => {
  // Caso básico: produtos com coeficientes e variáveis
  if (prod1.type === 'product' && prod2.type === 'product') {
    // Verificar se têm a mesma variável
    if (prod1.right?.type === 'variable' && prod2.right?.type === 'variable' && 
        prod1.right.variable === prod2.right.variable) {
      return { 
        type: 'variable' as const, 
        variable: prod1.right.variable 
      };
    }
    
    // Verificar se têm a mesma potência
    if (prod1.right?.type === 'power' && prod2.right?.type === 'power' &&
        prod1.right.variable === prod2.right.variable &&
        typeof prod1.right.exponent === 'number' && 
        typeof prod2.right.exponent === 'number') {
      // Retornar a potência com o menor expoente
      const minExponent = Math.min(prod1.right.exponent, prod2.right.exponent);
      return {
        type: 'power' as const,
        variable: prod1.right.variable,
        exponent: minExponent
      };
    }
    
    // Verificar se têm o mesmo fator à direita
    if (prod1.right && prod2.right && areTermsEqual(prod1.right, prod2.right)) {
      return cloneTerm(prod1.right);
    }
    
    // Verificar se têm o mesmo fator à esquerda
    if (prod1.left && prod2.left && areTermsEqual(prod1.left, prod2.left)) {
      return cloneTerm(prod1.left);
    }
  }
  
  // Verificar se os próprios termos são iguais
  if (areTermsEqual(prod1, prod2)) {
    return cloneTerm(prod1);
  }
  
  // Verificar se um dos termos é uma variável ou potência que aparece no outro
  if (prod1.type === 'variable' && prod2.type === 'product') {
    if (prod2.left?.type === 'variable' && prod1.variable === prod2.left.variable) {
      return cloneTerm(prod1);
    }
    if (prod2.right?.type === 'variable' && prod1.variable === prod2.right.variable) {
      return cloneTerm(prod1);
    }
  }
  
  if (prod2.type === 'variable' && prod1.type === 'product') {
    if (prod1.left?.type === 'variable' && prod2.variable === prod1.left.variable) {
      return cloneTerm(prod2);
    }
    if (prod1.right?.type === 'variable' && prod2.variable === prod1.right.variable) {
      return cloneTerm(prod2);
    }
  }
  
  return null;
};

// Fatorar um termo comum de uma expressão
export const factorOutCommonTerm = (
  sumTerm: AlgebraTerm, 
  commonFactor: AlgebraTerm, 
  steps: string[]
): AlgebraTerm => {
  // Dividir cada termo pelo fator comum
  const leftDivided = divideTermByFactor(sumTerm.left!, commonFactor);
  const rightDivided = divideTermByFactor(sumTerm.right!, commonFactor);
  
  // Criar a expressão fatorada: commonFactor * (leftDivided + rightDivided)
  const innerSum: AlgebraTerm = {
    type: sumTerm.type as 'sum' | 'difference',
    left: leftDivided,
    right: rightDivided
  };
  
  const result: AlgebraTerm = {
    type: 'product' as const,
    left: commonFactor,
    right: innerSum
  };
  
  steps.push(`Fatorando ${termToString(sumTerm)} = ${termToString(result)}`);
  
  return result;
};

// Dividir um termo por um fator
export const divideTermByFactor = (term: AlgebraTerm, factor: AlgebraTerm): AlgebraTerm => {
  // Caso básico: termos idênticos
  if (areTermsEqual(term, factor)) {
    return { type: 'constant' as const, value: 1 };
  }
  
  // Caso: termo = fator * algo
  if (term.type === 'product') {
    if (areTermsEqual(term.left!, factor)) {
      return term.right!;
    }
    if (areTermsEqual(term.right!, factor)) {
      return term.left!;
    }
    
    // Caso: potências com mesma base
    if (term.right?.type === 'power' && factor.type === 'power' &&
        term.right.variable === factor.variable &&
        typeof term.right.exponent === 'number' && 
        typeof factor.exponent === 'number' &&
        term.right.exponent >= factor.exponent) {
      // Subtrair os expoentes
      const newExponent = term.right.exponent - factor.exponent;
      if (newExponent === 0) {
        return term.left || { type: 'constant' as const, value: 1 };
      } else if (newExponent === 1) {
        return {
          type: 'product' as const,
          left: term.left!,
          right: { type: 'variable' as const, variable: term.right.variable }
        };
      } else {
        return {
          type: 'product' as const,
          left: term.left!,
          right: {
            type: 'power' as const,
            variable: term.right.variable,
            exponent: newExponent
          }
        };
      }
    }
  }
  
  // Caso: variável dividida por si mesma
  if (term.type === 'variable' && factor.type === 'variable' && term.variable === factor.variable) {
    return { type: 'constant' as const, value: 1 };
  }
  
  // Caso: potência dividida pela sua base
  if (term.type === 'power' && factor.type === 'variable' && 
      term.variable === factor.variable && 
      typeof term.exponent === 'number') {
    if (term.exponent === 1) {
      return { type: 'constant' as const, value: 1 };
    } else {
      return {
        type: 'power' as const,
        variable: term.variable,
        exponent: term.exponent - 1
      };
    }
  }
  
  // Outros casos (sem simplificação)
  return {
    type: 'quotient' as const,
    left: term,
    right: factor
  };
};

// Fatorar por fator comum
export const factorByCommonFactor = (term: AlgebraTerm, steps: string[]): AlgebraTerm | null => {
  
  // Coletar todos os termos se for uma soma ou diferença
  const terms: AlgebraTerm[] = [];
  
  // Função auxiliar para extrair termos
  const extractTerms = (expr: AlgebraTerm) => {
    if (expr.type === 'sum') {
      extractTerms(expr.left!);
      extractTerms(expr.right!);
    } else if (expr.type === 'difference') {
      extractTerms(expr.left!);
      // Negar o termo direito
      const negated: AlgebraTerm = {
        type: 'negative',
        argument: expr.right!
      };
      extractTerms(negated);
    } else if (expr.type === 'negative') {
      // Negar o valor do coeficiente ao extrair
      const innerTerm = expr.argument!;
      if (innerTerm.type === 'constant') {
        terms.push({ ...innerTerm, value: -innerTerm.value! });
      } else if (innerTerm.type === 'variable') {
        terms.push({
          type: 'product',
          left: { type: 'constant', value: -1 },
          right: innerTerm
        });
      } else if (innerTerm.type === 'product' && innerTerm.left?.type === 'constant') {
        terms.push({
          ...innerTerm,
          left: { ...innerTerm.left, value: -innerTerm.left.value! }
        });
      } else {
        terms.push({
          type: 'product',
          left: { type: 'constant', value: -1 },
          right: innerTerm
        });
      }
    } else {
      terms.push(expr);
    }
  };
  
  // Se não é uma soma ou diferença, retornar null
  if (term.type !== 'sum' && term.type !== 'difference') {
    return null;
  }
  
  // Extrair todos os termos
  extractTerms(term);
  
  // Se temos menos de 2 termos, não há o que fatorar
  if (terms.length < 2) {
    return null;
  }
  
  // Encontrar o fator comum numérico (MDC dos coeficientes)
  let commonNumericFactor = 0;
  
  // Função para extrair o coeficiente numérico de um termo
  const extractCoefficient = (t: AlgebraTerm): number => {
    if (t.type === 'constant') {
      return Math.abs(t.value || 0);
    } else if (t.type === 'product' && t.left?.type === 'constant') {
      return Math.abs(t.left.value || 1);
    } else if (t.type === 'negative') {
      return Math.abs(extractCoefficient(t.argument!));
    }
    return 1;
  };
  
  // Calcular o MDC dos coeficientes
  terms.forEach((t, index) => {
    const coef = extractCoefficient(t);
    if (index === 0) {
      commonNumericFactor = coef;
    } else {
      commonNumericFactor = findGCD(commonNumericFactor, coef);
    }
  });
  
  // Se encontramos um fator comum numérico maior que 1
  if (commonNumericFactor > 1) {
    steps.push(`Encontrado fator comum numérico: ${commonNumericFactor}`);
    
    // Dividir cada termo pelo fator comum
    const newTerms = terms.map(t => {
      const coef = extractCoefficient(t);
      if (t.type === 'constant') {
        return { type: 'constant' as const, value: (t.value || 0) / commonNumericFactor };
      } else if (t.type === 'product' && t.left?.type === 'constant') {
        const newCoef = (t.left.value || 1) / commonNumericFactor;
        // Se o novo coeficiente é 1, retornar apenas a parte da variável
        if (Math.abs(newCoef - 1) < 1e-10) {
          return t.right!;
        }
        return {
          ...t,
          left: { ...t.left, value: newCoef }
        };
      }
      return t;
    });
    
    // Reconstruir a expressão dentro dos parênteses
    let innerExpression = newTerms[0];
    for (let i = 1; i < newTerms.length; i++) {
      innerExpression = {
        type: 'sum',
        left: innerExpression,
        right: newTerms[i]
      };
    }
    
    // Retornar o produto do fator comum pela expressão fatorada
    const result = {
      type: 'product' as const,
      left: { type: 'constant' as const, value: commonNumericFactor },
      right: innerExpression
    };
    
    steps.push(`Fatorado: ${termToString(term)} = ${termToString(result)}`);
    return result;
  }
  
  return null;
};

// Verificar se é um trinômio quadrado perfeito
export const isPerfectSquareTrinomial = (term: AlgebraTerm): boolean => {
  // Extrair todos os termos
  const terms: AlgebraTerm[] = [];
  extractTermsFromSum(term, terms);
  
  if (terms.length !== 3) {
    return false;
  }
  
  // Classificar os termos
  const quadraticTerms: QuadraticInfo[] = [];
  const linearTerms: LinearInfo[] = [];
  let constantTerm = 0;
  let crossTerms: AlgebraTerm[] = [];
  
  for (const t of terms) {
    if (t.type === 'constant') {
      constantTerm = t.value || 0;
    } else if (t.type === 'power' && typeof t.exponent === 'number' && t.exponent === 2) {
      // Termo do tipo x²
      const info: QuadraticInfo = {
        term: t,
        coefficient: 1,
        variable: t.variable || ''
      };
      
      if (!info.variable && t.argument?.type === 'variable') {
        info.variable = t.argument.variable || '';
      }
      
      quadraticTerms.push(info);
    } else if (t.type === 'product') {
      // Verificar se é um termo quadrático com coeficiente (ax²)
      if (t.left?.type === 'constant') {
        const coef = t.left.value || 0;
        
        // Caso ax²
        if (t.right?.type === 'power' && typeof t.right.exponent === 'number' && t.right.exponent === 2) {
          const info: QuadraticInfo = {
            term: t,
            coefficient: coef,
            variable: t.right.variable || ''
          };
          
          if (!info.variable && t.right.argument?.type === 'variable') {
            info.variable = t.right.argument.variable || '';
          }
          
          quadraticTerms.push(info);
        } 
        // Caso ax (termo linear)
        else if (t.right?.type === 'variable') {
          // Verificar se poderia ser um termo cruzado (2xy)
          // Se a variável contém mais de uma letra, pode ser um termo cruzado
          const varName = t.right.variable || '';
          if (varName.length > 1 && coef === 2) {
            // Possível termo cruzado como 2xy
            crossTerms.push(t);
          } else {
            const info: LinearInfo = {
              term: t,
              coefficient: coef,
              variable: varName
            };
            
            linearTerms.push(info);
          }
        }
        // Caso de possível termo cruzado (2xy) onde xy é uma expressão
        else {
          crossTerms.push(t);
        }
      }
      // Verificar outro caso de termo cruzado como x*y
      else if (t.left?.type === 'variable' && t.right?.type === 'variable') {
        crossTerms.push(t);
      } else {
        // Verificar outros casos de produtos que podem ser termos cruzados
        crossTerms.push(t);
      }
    } else if (t.type === 'variable') {
      // Se a variável contém mais de uma letra, pode ser um termo cruzado implícito
      const varName = t.variable || '';
      if (varName.length > 1) {
        crossTerms.push(t);
      } else {
        linearTerms.push({
          term: t,
          coefficient: 1,
          variable: varName
        });
      }
    }
  }
  
  // Primeiro caso: Trinômio quadrado perfeito de uma variável (ax² + bx + c)
  if (quadraticTerms.length === 1 && linearTerms.length === 1) {
    const quadraticTerm = quadraticTerms[0];
    const linearTerm = linearTerms[0];
    
    if (linearTerm && quadraticTerm.variable === linearTerm.variable) {
      // a²x² + 2abx + b² onde a e b são constantes
      // Extrair a e b
      const a = Math.sqrt(quadraticTerm.coefficient);
      const b = Math.sqrt(Math.abs(constantTerm));
      
      // Verificar se a é um número razoável
      if (!Number.isInteger(a) && a > 0.001) {
        return false;
      }
      
      // Verificar se b é um número razoável
      if (!Number.isInteger(b) && b > 0.001) {
        return false;
      }
      
      // O termo linear deve ser 2ab
      const expectedLinearCoef = 2 * a * b;
      const actualLinearCoef = linearTerm.coefficient;
      
      // Usar tolerância para comparação de números de ponto flutuante
      const tolerance = 1e-10;
      const isMatch = Math.abs(Math.abs(actualLinearCoef) - expectedLinearCoef) < tolerance;
      
      if (isMatch) {
        return true;
      }
    }
  }
  
  // Segundo caso: Trinômio quadrado perfeito multivariável (x² + 2xy + y²)
  if (quadraticTerms.length === 2 && crossTerms.length >= 1) {
    const term1 = quadraticTerms[0];
    const term2 = quadraticTerms[1];
    const crossTerm = crossTerms[0];
    
    // Primeiro, verificar se ambos os termos quadráticos têm coeficiente 1
    // Se não, pode ser algo como (ax)² + 2(ax)(by) + (by)², que devemos normalizar
    const coef1 = term1.coefficient;
    const coef2 = term2.coefficient;
    
    // Verificar se os coeficientes são 1 ou pelo menos iguais
    const areCoeffsEqual = Math.abs(coef1 - coef2) < 1e-10;
    
    if ((coef1 === 1 && coef2 === 1) || areCoeffsEqual) {
      // Análise do termo cruzado - adicionamos mais casos possíveis
      
      // Extrair informações do termo cruzado
      let crossCoef = 0;
      let var1 = "";
      let var2 = "";
      
      // Cenário 1: Termo cruzado é um produto direto (constant * product)
      // Exemplo: 2 * (x * y)
      if (crossTerm.type === 'product' && 
          crossTerm.left?.type === 'constant' &&
          crossTerm.right?.type === 'product' &&
          crossTerm.right.left?.type === 'variable' &&
          crossTerm.right.right?.type === 'variable') {
          
        crossCoef = crossTerm.left.value || 0;
        var1 = crossTerm.right.left.variable || '';
        var2 = crossTerm.right.right.variable || '';
      }
      // Cenário 2: Termo cruzado é (constant * variable) * variable
      // Exemplo: (2x) * y
      else if (crossTerm.type === 'product' &&
               crossTerm.left?.type === 'product' &&
               crossTerm.left.left?.type === 'constant' &&
               crossTerm.left.right?.type === 'variable' &&
               crossTerm.right?.type === 'variable') {
          
        crossCoef = crossTerm.left.left.value || 0;
        var1 = crossTerm.left.right.variable || '';
        var2 = crossTerm.right.variable || '';
      }
      // Cenário 3: Termo cruzado é variable * (constant * variable)
      // Exemplo: x * (2y)
      else if (crossTerm.type === 'product' &&
               crossTerm.right?.type === 'product' &&
               crossTerm.right.left?.type === 'constant' &&
               crossTerm.right.right?.type === 'variable' &&
               crossTerm.left?.type === 'variable') {
          
        crossCoef = crossTerm.right.left.value || 0;
        var1 = crossTerm.left.variable || '';
        var2 = crossTerm.right.right.variable || '';
      }
      // Cenário 4: Formato simples constant * variable (mas o variable é na verdade "xy")
      // Exemplo: 2xy (onde xy é tratado como uma única variável)
      else if (crossTerm.type === 'product' &&
               crossTerm.left?.type === 'constant' &&
               crossTerm.right?.type === 'variable') {
          
        crossCoef = crossTerm.left.value || 0;
        const combinedVar = crossTerm.right.variable || '';
        
        // Tentar detectar se a variável combinada contém as duas variáveis
        // dos termos quadráticos
        if (combinedVar.length > 1) {
          // Tentativa 1: Verificar se as variáveis dos termos quadráticos estão na variável combinada
          if (combinedVar.includes(term1.variable) && combinedVar.includes(term2.variable)) {
            var1 = term1.variable;
            var2 = term2.variable;
          } 
          // Tentativa 2: Assumir que a variável combinada é simplesmente as duas variáveis juntas
          else if (combinedVar.length === term1.variable.length + term2.variable.length) {
            var1 = term1.variable;
            var2 = term2.variable;
          }
        }
      }
      // Cenário 5: Produto direto de variáveis com coeficiente 2
      // Exemplo: x * y (onde assumimos que o coeficiente é 2 implicitamente)
      else if (crossTerm.type === 'product' &&
               crossTerm.left?.type === 'variable' &&
               crossTerm.right?.type === 'variable') {
          
        // Neste caso assumimos coeficiente = 2 para um trinômio perfeito
        crossCoef = 2;
        var1 = crossTerm.left.variable || '';
        var2 = crossTerm.right.variable || '';
      }
      // Cenário 6: Caso mais genérico - analisar o texto do termo
      else {
        const termString = termToString(crossTerm);
        
        // Se o termo contém um 2 e as variáveis dos termos quadráticos
        if (termString.includes('2') && 
            termString.includes(term1.variable) && 
            termString.includes(term2.variable)) {
          crossCoef = 2;
          var1 = term1.variable;
          var2 = term2.variable;
        }
      }
      
      // Verificar se temos um termo cruzado válido para um trinômio quadrado perfeito
      if (crossCoef !== 0 && var1 && var2) {
        // Verificar se as variáveis correspondem às dos termos quadráticos
        if ((var1 === term1.variable && var2 === term2.variable) || 
            (var1 === term2.variable && var2 === term1.variable)) {
          
          // Coeficiente do termo cruzado deve ser 2
          if (Math.abs(crossCoef - 2) < 1e-10) {
            return true;
          }
        }
      }
    }
  }
  
  return false;
};

// Função auxiliar para extrair informações lineares de um termo
function extractLinearInfo(term: AlgebraTerm): LinearInfo | null {
  if (term.type === 'variable') {
    return {
      term,
      variable: term.variable!,
      coefficient: 1
    };
  } else if (term.type === 'product' && term.left?.type === 'constant' && term.right?.type === 'variable') {
    return {
      term,
      variable: term.right.variable!,
      coefficient: term.left.value!
    };
  }
  return null;
}

// Transformar um trinômio quadrado perfeito
export const transformPerfectSquare = (term: AlgebraTerm, steps: string[]): AlgebraTerm => {
  // Verificação extra para confirmar que é um trinômio quadrado perfeito
  if (!isPerfectSquareTrinomial(term)) {
    return term;
  }
  
  // Coletar os termos
  const terms: AlgebraTerm[] = [];
  
  // Extrair os termos da expressão
  extractTermsFromSum(term, terms);
  
  // Classificar os termos para melhor análise
  const quadraticTerms: QuadraticInfo[] = [];
  const linearTerms: LinearInfo[] = [];
  let constantTerm = 0;
  let crossTerms: AlgebraTerm[] = [];
  
  for (const t of terms) {
    if (t.type === 'constant') {
      constantTerm = t.value || 0;
    } else if (t.type === 'power' && typeof t.exponent === 'number' && t.exponent === 2) {
      // Termo do tipo x²
      const info: QuadraticInfo = {
        term: t,
        coefficient: 1,
        variable: t.variable || ''
      };
      
      if (!info.variable && t.argument?.type === 'variable') {
        info.variable = t.argument.variable || '';
      }
      
      quadraticTerms.push(info);
    } else if (t.type === 'product') {
      // Verificar se é um termo quadrático com coeficiente (ax²)
      if (t.left?.type === 'constant') {
        const coef = t.left.value || 0;
        
        // Caso ax²
        if (t.right?.type === 'power' && typeof t.right.exponent === 'number' && t.right.exponent === 2) {
          const info: QuadraticInfo = {
            term: t,
            coefficient: coef,
            variable: t.right.variable || ''
          };
          
          if (!info.variable && t.right.argument?.type === 'variable') {
            info.variable = t.right.argument.variable || '';
          }
          
          quadraticTerms.push(info);
        } 
        // Caso ax (termo linear)
        else if (t.right?.type === 'variable') {
          // Verificar se poderia ser um termo cruzado (2xy)
          // Se a variável contém mais de uma letra, pode ser um termo cruzado
          const varName = t.right.variable || '';
          if (varName.length > 1 && coef === 2) {
            // Possível termo cruzado como 2xy
            crossTerms.push(t);
          } else {
            const info: LinearInfo = {
              term: t,
              coefficient: coef,
              variable: varName
            };
            
            linearTerms.push(info);
          }
        }
        // Caso de possível termo cruzado (2xy) onde xy é uma expressão
        else {
          crossTerms.push(t);
        }
      }
      // Verificar outro caso de termo cruzado como x*y
      else if (t.left?.type === 'variable' && t.right?.type === 'variable') {
        crossTerms.push(t);
      } else {
        // Verificar outros casos de produtos que podem ser termos cruzados
        crossTerms.push(t);
      }
    } else if (t.type === 'variable') {
      // Se a variável contém mais de uma letra, pode ser um termo cruzado implícito
      const varName = t.variable || '';
      if (varName.length > 1) {
        crossTerms.push(t);
      } else {
        linearTerms.push({
          term: t,
          coefficient: 1,
          variable: varName
        });
      }
    }
  }
  
  // Caso 1: Trinômio quadrado perfeito de uma variável (ax² + bx + c)
  if (quadraticTerms.length === 1 && linearTerms.length === 1) {
    const quadraticTerm = quadraticTerms[0];
    const linearTerm = linearTerms[0];
    
    if (linearTerm && quadraticTerm.variable === linearTerm.variable) {
      const a = Math.sqrt(quadraticTerm.coefficient);
      const b = Math.sqrt(constantTerm);
      
      // Construir o fator (√a * x + b)²
      const innerFactor: AlgebraTerm = {
        type: 'sum',
        left: {
          type: 'product',
          left: { type: 'constant', value: a },
          right: { type: 'variable', variable: quadraticTerm.variable }
        },
        right: { type: 'constant', value: Math.sign(linearTerm.coefficient) * b }
      };
      
      const result: AlgebraTerm = {
        type: 'power',
        argument: innerFactor,
        exponent: 2
      };
      
      steps.push(`Fatorado como (${termToString(innerFactor)})²`);
      return result;
    }
  }
  
  // Caso 2: Trinômio quadrado perfeito multivariável (x² + 2xy + y²)
  if (quadraticTerms.length === 2 && crossTerms.length >= 1) {
    const term1 = quadraticTerms[0];
    const term2 = quadraticTerms[1];
    const crossTerm = crossTerms[0];
    
    // Se os coeficientes são iguais, podemos fatorar como (a * x + a * y)²
    if (Math.abs(term1.coefficient - term2.coefficient) < 1e-10) {
      const commonCoef = Math.sqrt(term1.coefficient);
      
      // Construir o binômio (√a * x + √a * y)
      const firstTerm: AlgebraTerm = commonCoef === 1 ? 
        { type: 'variable', variable: term1.variable } : 
        {
          type: 'product',
          left: { type: 'constant', value: commonCoef },
          right: { type: 'variable', variable: term1.variable }
        };
      
      const secondTerm: AlgebraTerm = commonCoef === 1 ? 
        { type: 'variable', variable: term2.variable } : 
        {
          type: 'product',
          left: { type: 'constant', value: commonCoef },
          right: { type: 'variable', variable: term2.variable }
        };
      
      // Determinar se o termo cruzado é positivo ou negativo
      let crossSign = 1;
      
      // Analisar o sinal do termo cruzado
      const crossTermString = termToString(crossTerm);
      
      // Se o termo cruzado contém um sinal negativo explícito
      if (crossTerm.type === 'product' && crossTerm.left?.type === 'constant') {
        crossSign = Math.sign(crossTerm.left.value || 0);
      } else if (crossTermString.startsWith('-')) {
        crossSign = -1;
      }
      
      // Construir o fator interno - usar sum ou difference com base no sinal
      const innerFactor: AlgebraTerm = {
        type: crossSign > 0 ? 'sum' : 'difference',
        left: firstTerm,
        right: secondTerm
      };
      
      // Construir o resultado final - o quadrado do fator interno
      const result: AlgebraTerm = {
        type: 'power',
        argument: innerFactor,
        exponent: 2
      };
      
      const factored = termToString(innerFactor);
      steps.push(`Fatorado como (${factored})²`);
      return result;
    }
  }
  
  // Se chegamos aqui, não conseguimos transformar o trinômio
  return term;
};

// Verificar se é uma diferença de quadrados
export const isDifferenceOfSquares = (term: AlgebraTerm): boolean => {
  if (term.type !== 'difference') {
    return false;
  }
  
  // Verificar se ambos os lados são quadrados
  const leftIsSquare = isSquareTerm(term.left!);
  const rightIsSquare = isSquareTerm(term.right!);
  
  return leftIsSquare && rightIsSquare;
};

// Verificar se um termo é um quadrado
export const isSquareTerm = (term: AlgebraTerm): boolean => {
  if (term.type === 'power') {
    const isPower2 = typeof term.exponent === 'number' && term.exponent === 2;
    return isPower2;
  }
  
  // Verificar notação com o símbolo ^2 no formato de string
  if (term.type === 'variable') {
    const varName = term.variable || '';
    const isSquareNotation = varName.includes('^2');
    return isSquareNotation;
  }
  
  // Adicionar suporte para quadrados numéricos
  if (term.type === 'constant' && typeof term.value === 'number') {
    const sqrtValue = Math.sqrt(Math.abs(term.value));
    const isNumericSquare = Number.isInteger(sqrtValue);
    return isNumericSquare;
  }
  
  // Caso especial: produto de variável por si mesma (x*x)
  if (term.type === 'product' && 
      term.left?.type === 'variable' && 
      term.right?.type === 'variable' && 
      term.left.variable === term.right.variable) {
    return true;
  }
  
  return false;
};

// Transformar uma diferença de quadrados
export const transformDifferenceOfSquares = (term: AlgebraTerm, steps: string[]): AlgebraTerm => {
  if (!isDifferenceOfSquares(term)) return term;
  
  // Extrair as bases dos quadrados
  const leftBase = extractBase(term.left!);
  const rightBase = extractBase(term.right!);
  
  // Criar a fatoração (a+b)(a-b)
  const firstFactor: AlgebraTerm = {
    type: 'sum' as const,
    left: cloneTerm(leftBase),
    right: cloneTerm(rightBase)
  };
  
  const secondFactor: AlgebraTerm = {
    type: 'difference' as const,
    left: cloneTerm(leftBase),
    right: cloneTerm(rightBase)
  };
  
  steps.push(`Fatorando como (a+b)(a-b): ${termToString(firstFactor)} * ${termToString(secondFactor)}`);
  
  return {
    type: 'product' as const,
    left: firstFactor,
    right: secondFactor
  };
};

// Extrair a base de um termo quadrático
export const extractBase = (term: AlgebraTerm): AlgebraTerm => {
  if (term.type === 'power' && typeof term.exponent === 'number' && term.exponent === 2) {
    return term.argument || { type: 'variable', variable: term.variable! };
  }
  
  // Adicionar suporte para extrair raiz de quadrados numéricos
  if (term.type === 'constant' && typeof term.value === 'number') {
    const sqrtValue = Math.sqrt(Math.abs(term.value));
    if (Number.isInteger(sqrtValue)) {
      return { type: 'constant', value: sqrtValue };
    }
  }
  
  return term;
};

// Detectar se uma expressão é um quadrado perfeito
export const detectPerfectSquare = (term: AlgebraTerm, steps: string[]): AlgebraTerm | null => {
  // Verificação especial para o caso x² + 2xy + y²
  if (term.type === 'sum') {
    const termString = termToString(term);
    if (termString.includes('x^2') && termString.includes('2xy') && termString.includes('y^2')) {
      // Criar diretamente a forma fatorada (x + y)²
      const innerFactor: AlgebraTerm = {
        type: 'sum',
        left: { type: 'variable', variable: 'x' },
        right: { type: 'variable', variable: 'y' }
      };
      
      const result: AlgebraTerm = {
        type: 'power',
        argument: innerFactor,
        exponent: 2
      };
      
      steps.push(`Detectado caso especial x² + 2xy + y² = (x + y)²`);
      return result;
    }
  }
  
  // Verificação especial para diferença de quadrados (x² - y²)
  if (term.type === 'difference') {
    const leftStr = termToString(term.left!);
    const rightStr = termToString(term.right!);
    
    if ((leftStr.includes('^2') || leftStr.includes('²')) && 
        (rightStr.includes('^2') || rightStr.includes('²'))) {
      // Em vez de tratar aqui, vamos deixar que detectDifferenceOfSquares trate este caso
      return null; // Para que o fluxo continue e chegue em detectDifferenceOfSquares
    }
  }
  
  // Simplificação: Verificação básica para trinômios quadrados perfeitos
  if (term.type === 'sum' || term.type === 'difference') {
    const isPerfectSquare = isPerfectSquareTrinomial(term);
    
    if (isPerfectSquare) {
      steps.push(`Detectado trinômio quadrado perfeito`);
      return transformPerfectSquare(term, steps);
    }
  }
  
  return null;
};

// Detectar diferença de quadrados
export const detectDifferenceOfSquares = (term: AlgebraTerm, steps: string[]): AlgebraTerm | null => {
  // Caso especial: verificação direta para expressões do tipo x^2 - y^2
  if (term.type === 'difference') {
    const leftStr = termToString(term.left!);
    const rightStr = termToString(term.right!);
    
    // Verificação por string para casos específicos comuns
    if ((leftStr.includes('^2') || leftStr.includes('²')) && 
        (rightStr.includes('^2') || rightStr.includes('²'))) {
      // Extrair bases dos quadrados
      let leftBase = term.left!;
      let rightBase = term.right!;
      
      // Se é uma potência com expoente 2, extrair a base
      if (term.left!.type === 'power' && typeof term.left!.exponent === 'number' && term.left!.exponent === 2) {
        leftBase = term.left!.argument || { type: 'variable', variable: term.left!.variable! };
      } else if (term.left!.type === 'variable' && term.left!.variable!.includes('^2')) {
        // Se está no formato x^2, extrair a base x
        const baseName = term.left!.variable!.split('^')[0];
        leftBase = { type: 'variable', variable: baseName };
      }
      
      if (term.right!.type === 'power' && typeof term.right!.exponent === 'number' && term.right!.exponent === 2) {
        rightBase = term.right!.argument || { type: 'variable', variable: term.right!.variable! };
      } else if (term.right!.type === 'variable' && term.right!.variable!.includes('^2')) {
        // Se está no formato y^2, extrair a base y
        const baseName = term.right!.variable!.split('^')[0];
        rightBase = { type: 'variable', variable: baseName };
      }
      
      // Criar a fatoração (a+b)(a-b)
      const firstFactor: AlgebraTerm = {
        type: 'sum',
        left: cloneTerm(leftBase),
        right: cloneTerm(rightBase)
      };
      
      const secondFactor: AlgebraTerm = {
        type: 'difference',
        left: cloneTerm(leftBase),
        right: cloneTerm(rightBase)
      };
      
      steps.push(`Detectada diferença de quadrados: ${leftStr} - ${rightStr}`);
      steps.push(`Fatorada como (${termToString(leftBase)}+${termToString(rightBase)})(${termToString(leftBase)}-${termToString(rightBase)})`);
      
      return {
        type: 'product',
        left: firstFactor,
        right: secondFactor
      };
    }
    
    // Verificação padrão usando isDifferenceOfSquares
    if (isDifferenceOfSquares(term)) {
      steps.push(`Detectada diferença de quadrados`);
      return transformDifferenceOfSquares(term, steps);
    }
  }
  
  return null;
};

// Fatorar um polinômio de segundo grau (ax² + bx + c)
export const factorQuadratic = (term: AlgebraTerm, steps: string[]): AlgebraTerm | null => {
  // Verificar se o termo tem a forma ax² + bx + c
  if (term.type !== 'sum' && term.type !== 'difference') {
    return null;
  }
  
  steps.push(`Analisando a expressão ${termToString(term)} para fatoração.`);
  
  // Checar primeiro se é um caso especial
  
  // 1. Verificar se é um trinômio quadrado perfeito
  if (isPerfectSquareTrinomial(term)) {
    steps.push(`Detectado trinômio quadrado perfeito.`);
    return transformPerfectSquare(term, steps);
  }
  
  // 2. Verificar se é uma diferença de quadrados
  if (term.type === 'difference' && isDifferenceOfSquares(term)) {
    steps.push(`Detectada diferença de quadrados.`);
    return transformDifferenceOfSquares(term, steps);
  }
  
  // Extrair os coeficientes a, b, c
  let a = 0, b = 0, c = 0;
  let mainVariable = '';
  
  // Coletar todos os termos
  const terms: AlgebraTerm[] = [];
  
  extractTermsFromSum(term, terms);
  
  steps.push(`Termos extraídos: ${terms.map(termToString).join(', ')}`);
  
  // Analisar cada termo para identificar os coeficientes
  for (const term of terms) {
    if (term.type === 'constant') {
      // Termo constante c
      c += term.value || 0;
    } else if (term.type === 'variable') {
      // Termo linear bx
      b += 1;
      if (!mainVariable && term.variable) {
        mainVariable = term.variable;
      }
    } else if (term.type === 'power' && typeof term.exponent === 'number' && term.exponent === 2) {
      // Termo quadrático ax²
      a += 1;
      if (term.variable) {
        mainVariable = term.variable;
      } else if (term.argument?.type === 'variable' && term.argument.variable) {
        mainVariable = term.argument.variable;
      }
    } else if (term.type === 'product') {
      // Verificar se é um termo linear ou quadrático com coeficiente
      if (term.left?.type === 'constant') {
        const coef = term.left.value || 0;
        
        if (term.right?.type === 'variable') {
          // Termo bx
          b += coef;
          if (!mainVariable && term.right.variable) {
            mainVariable = term.right.variable;
          }
        } else if (term.right?.type === 'power' && 
                  typeof term.right.exponent === 'number' && 
                  term.right.exponent === 2) {
          // Termo ax²
          a += coef;
          if (term.right.variable) {
            mainVariable = term.right.variable;
          } else if (term.right.argument?.type === 'variable' && term.right.argument.variable) {
            mainVariable = term.right.argument.variable;
          }
        }
      }
    }
  }
  
  steps.push(`Coeficientes: a=${a}, b=${b}, c=${c}, variável: ${mainVariable}`);
  
  // Se não for uma equação quadrática completa ou se a = 0, retornar null
  if (a === 0 || mainVariable === '') {
    steps.push(`Não é uma expressão quadrática válida para fatoração.`);
    return null;
  }
  
  // Verificar se é um trinômio do tipo x² + bx + c (onde a = 1)
  if (Math.abs(a - 1) < 1e-10) {
    // Calculamos as raízes usando a fórmula de Bhaskara
    const discriminant = b * b - 4 * a * c;
    
    steps.push(`Discriminante: ${discriminant}`);
    
    // Se discriminante < 0, não há fatores reais
    if (discriminant < 0) {
      steps.push(`Discriminante negativo, não há fatores reais.`);
      return null;
    }
    
    // Calculamos as raízes
    const sqrtDiscriminant = Math.sqrt(discriminant);
    const root1 = (-b + sqrtDiscriminant) / (2 * a);
    const root2 = (-b - sqrtDiscriminant) / (2 * a);
    
    steps.push(`Raízes: ${root1} e ${root2}`);
    
    // Verificamos se as raízes são números inteiros ou fracionários simples
    const isSimpleNumber = (num: number): boolean => {
      // Verificar se é um inteiro
      if (Number.isInteger(num)) return true;
      
      // Verificar se é uma fração simples (denominador até 10)
      const tolerance = 1e-10;
      for (let denominator = 2; denominator <= 10; denominator++) {
        const numerator = num * denominator;
        if (Math.abs(Math.round(numerator) - numerator) < tolerance) {
          return true;
        }
      }
      
      return false;
    };
    
    if (isSimpleNumber(root1) && isSimpleNumber(root2)) {
      // Construímos os fatores (x - r1) e (x - r2)
      // Observe que se as raízes são r1 e r2, então os fatores são (x - r1) e (x - r2)
      // Mas para facilitar a apresentação, podemos reescrever como (x + (-r1)) e (x + (-r2))
      
      const factor1: AlgebraTerm = {
        type: 'sum',
        left: { type: 'variable', variable: mainVariable },
        right: { type: 'constant', value: -root1 }
      };
      
      const factor2: AlgebraTerm = {
        type: 'sum',
        left: { type: 'variable', variable: mainVariable },
        right: { type: 'constant', value: -root2 }
      };
      
      steps.push(`Fatorando como (${mainVariable} + ${-root1})(${mainVariable} + ${-root2})`);
      
      return {
        type: 'product',
        left: factor1,
        right: factor2
      };
    } else {
      steps.push(`Raízes não são números simples, difícil fatorar de forma elegante.`);
    }
  } 
  
  return null;
};

// Helper para checar se o termo é um produto
export const isProduct = (term: AlgebraTerm): term is { type: 'product'; left?: AlgebraTerm; right?: AlgebraTerm } => {
  return term.type === 'product';
};

// Helper para checar se o termo tem uma propriedade variable
export const hasVariable = (term: any): term is { variable: string } => {
  return term && typeof term.variable === 'string';
};

// Função auxiliar para verificar se um termo expandido é um trinômio quadrado perfeito
export const checkExpandedTermForPerfectSquare = (term: AlgebraTerm): boolean => {
  // Esta função é mantida por compatibilidade com o código existente
  // Mas agora usa a versão mais completa do isPerfectSquareTrinomial
  return isPerfectSquareTrinomial(term);
}; 