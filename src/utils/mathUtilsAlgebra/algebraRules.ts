// ===================================================
// ========= APLICAÇÃO DE REGRAS ALGÉBRICAS ==========
// ===================================================

import { AlgebraTerm, cloneTerm, areTermsEqual } from './algebraTermDefinition';
import { termToString } from './algebraTermManipulator';
import { isDifferenceOfSquares, transformDifferenceOfSquares, isPerfectSquareTrinomial, transformPerfectSquare } from './algebraFactorization';

// Aplicar regras algébricas específicas
export const applyAlgebraicRules = (term: AlgebraTerm, steps: string[]): AlgebraTerm => {
  if (!term) return term;
  
  // Clone o termo para não modificar o original
  const result = cloneTerm(term);
  
  // Processar tipos específicos
  switch (result.type) {
    case 'sum': {
      // Aplicar regras recursivamente aos operandos
      result.left = applyAlgebraicRules(result.left!, steps);
      result.right = applyAlgebraicRules(result.right!, steps);
      
      // Verificar se podemos simplificar a soma
      // a + 0 = a
      if (result.right?.type === 'constant' && result.right.value === 0) {
        return result.left!;
      }
      if (result.left?.type === 'constant' && result.left.value === 0) {
        return result.right!;
      }
      
      // a + (-b) = a - b
      if (result.right?.type === 'negative') {
        return {
          type: 'difference' as const,
          left: result.left!,
          right: result.right.argument!
        };
      }
      
      return result;
    }
    
    case 'difference': {
      // Aplicar regras recursivamente aos operandos
      result.left = applyAlgebraicRules(result.left!, steps);
      result.right = applyAlgebraicRules(result.right!, steps);
      
      // Verificar se podemos simplificar a diferença
      // a - 0 = a
      if (result.right?.type === 'constant' && result.right.value === 0) {
        return result.left!;
      }
      
      // 0 - a = -a
      if (result.left?.type === 'constant' && result.left.value === 0) {
        return {
          type: 'negative' as const,
          argument: result.right!
        };
      }
      
      // a - (-b) = a + b
      if (result.right?.type === 'negative') {
        return {
          type: 'sum' as const,
          left: result.left!,
          right: result.right.argument!
        };
      }
      
      // a - a = 0
      if (areTermsEqual(result.left!, result.right!)) {
        return { type: 'constant' as const, value: 0 };
      }
      
      return result;
    }
    
    case 'product': {
      // Aplicar regras recursivamente aos operandos
      result.left = applyAlgebraicRules(result.left!, steps);
      result.right = applyAlgebraicRules(result.right!, steps);
      
      // Verificar se podemos simplificar o produto
      // a * 0 = 0
      if ((result.left?.type === 'constant' && result.left.value === 0) ||
          (result.right?.type === 'constant' && result.right.value === 0)) {
        return { type: 'constant' as const, value: 0 };
      }
      
      // a * 1 = a
      if (result.left?.type === 'constant' && result.left.value === 1) {
        return result.right!;
      }
      if (result.right?.type === 'constant' && result.right.value === 1) {
        return result.left!;
      }
      
      // (-a) * (-b) = a * b
      if (result.left?.type === 'negative' && result.right?.type === 'negative') {
        return {
          type: 'product' as const,
          left: result.left.argument!,
          right: result.right.argument!
        };
      }
      
      // a * (-b) = -(a * b)
      if (result.right?.type === 'negative') {
        return {
          type: 'negative' as const,
          argument: {
            type: 'product' as const,
            left: result.left!,
            right: result.right.argument!
          }
        };
      }
      
      // (-a) * b = -(a * b)
      if (result.left?.type === 'negative') {
        return {
          type: 'negative' as const,
          argument: {
            type: 'product' as const,
            left: result.left.argument!,
            right: result.right!
          }
        };
      }
      
      // Regra de potências: x^a * x^b = x^(a+b)
      if (result.left?.type === 'power' && result.right?.type === 'power') {
        // Verificar se as bases são iguais
        const leftBase = result.left.variable || (result.left.argument ? termToString(result.left.argument) : '');
        const rightBase = result.right.variable || (result.right.argument ? termToString(result.right.argument) : '');
        
        if (leftBase && rightBase && leftBase === rightBase) {
          // Só combinar se ambos os expoentes forem numéricos
          if (typeof result.left.exponent === 'number' && typeof result.right.exponent === 'number') {
            steps.push(`Aplicando regra: x^a * x^b = x^(a+b)`);
            return {
              type: 'power' as const,
              variable: result.left.variable,
              argument: result.left.argument,
              exponent: result.left.exponent + result.right.exponent
            };
          }
        }
      }
      
      return result;
    }
    
    case 'quotient': {
      // Aplicar regras recursivamente aos operandos
      result.left = applyAlgebraicRules(result.left!, steps);
      result.right = applyAlgebraicRules(result.right!, steps);
      
      // Verificar se podemos simplificar a divisão
      // 0 / a = 0 (desde que a != 0)
      if (result.left?.type === 'constant' && result.left.value === 0) {
        return { type: 'constant' as const, value: 0 };
      }
      
      // a / 1 = a
      if (result.right?.type === 'constant' && result.right.value === 1) {
        return result.left!;
      }
      
      // a / a = 1 (desde que a != 0)
      if (areTermsEqual(result.left!, result.right!)) {
        // Não verificamos se a = 0, isso seria validado em tempo de execução
        return { type: 'constant' as const, value: 1 };
      }
      
      // Regra de potências: x^a / x^b = x^(a-b)
      if (result.left?.type === 'power' && result.right?.type === 'power') {
        // Verificar se as bases são iguais
        const leftBase = result.left.variable || (result.left.argument ? termToString(result.left.argument) : '');
        const rightBase = result.right.variable || (result.right.argument ? termToString(result.right.argument) : '');
        
        if (leftBase && rightBase && leftBase === rightBase) {
          // Só combinar se ambos os expoentes forem numéricos
          if (typeof result.left.exponent === 'number' && typeof result.right.exponent === 'number') {
            steps.push(`Aplicando regra: x^a / x^b = x^(a-b)`);
            
            // Se a-b = 0, retornar 1
            if (result.left.exponent === result.right.exponent) {
              return { type: 'constant' as const, value: 1 };
            }
            
            // Se a-b < 0, inverter a fração
            if (result.left.exponent < result.right.exponent) {
              return {
                type: 'quotient' as const,
                left: {
                  type: 'constant' as const,
                  value: 1
                },
                right: {
                  type: 'power' as const,
                  variable: result.left.variable,
                  argument: result.left.argument,
                  exponent: result.right.exponent - result.left.exponent
                }
              };
            }
            
            return {
              type: 'power' as const,
              variable: result.left.variable,
              argument: result.left.argument,
              exponent: result.left.exponent - result.right.exponent
            };
          }
        }
      }
      
      return result;
    }
      
    case 'power': {
      // Simplificar o argumento da potência
      if (result.argument) {
        result.argument = applyAlgebraicRules(result.argument, steps);
      }
      
      // Caso especial: (a^n)^m = a^(n*m)
      if (result.argument?.type === 'power') {
        const innerExponent = result.argument.exponent;
        const outerExponent = result.exponent;
        
        if (typeof innerExponent === 'number' && typeof outerExponent === 'number') {
          steps.push(`Aplicando regra: (a^n)^m = a^(n*m)`);
          return {
            type: 'power' as const,
            argument: result.argument.argument,
            variable: result.argument.variable,
            exponent: innerExponent * outerExponent
          };
        }
      }
      
      // Regras para expoentes específicos
      if (typeof result.exponent === 'number') {
        // a^0 = 1 para qualquer a != 0
        if (result.exponent === 0) {
          return { type: 'constant' as const, value: 1 };
        }
        
        // a^1 = a
        if (result.exponent === 1) {
          return result.argument || { 
            type: 'variable' as const, 
            variable: result.variable! 
          };
        }
        
        // Transformações para produtos e quocientes
        // (a*b)^n = a^n * b^n
        if (result.argument?.type === 'product' && Number.isInteger(result.exponent) && result.exponent > 0) {
          steps.push(`Aplicando regra: (a*b)^n = a^n * b^n`);
          return {
            type: 'product' as const,
            left: {
              type: 'power' as const,
              argument: result.argument.left,
              exponent: result.exponent
            },
            right: {
              type: 'power' as const,
              argument: result.argument.right,
              exponent: result.exponent
            }
          };
        }
        
        // (a/b)^n = a^n / b^n
        if (result.argument?.type === 'quotient' && Number.isInteger(result.exponent)) {
          steps.push(`Aplicando regra: (a/b)^n = a^n / b^n`);
          
          // Caso especial para expoentes negativos: (a/b)^(-n) = (b/a)^n
          if (result.exponent < 0) {
            return {
              type: 'quotient' as const,
              left: {
                type: 'power' as const,
                argument: result.argument.right,
                exponent: -result.exponent
              },
              right: {
                type: 'power' as const,
                argument: result.argument.left,
                exponent: -result.exponent
              }
            };
          }
          
          return {
            type: 'quotient' as const,
            left: {
              type: 'power' as const,
              argument: result.argument.left,
              exponent: result.exponent
            },
            right: {
              type: 'power' as const,
              argument: result.argument.right,
              exponent: result.exponent
            }
          };
        }
      }
      
      return result;
    }
      
    case 'negative': {
      // Aplicar regras ao argumento
      result.argument = applyAlgebraicRules(result.argument!, steps);
      
      // -0 = 0
      if (result.argument?.type === 'constant' && result.argument.value === 0) {
        return { type: 'constant' as const, value: 0 };
      }
      
      // -(-a) = a
      if (result.argument?.type === 'negative') {
        return result.argument.argument!;
      }
      
      // -(a-b) = b-a
      if (result.argument?.type === 'difference') {
        return {
          type: 'difference' as const,
          left: result.argument.right!,
          right: result.argument.left!
        };
      }
      
      return result;
    }
      
    default:
      return result;
  }
};

// Verificar casos especiais para simplificação
export const checkForSpecialCases = (term: AlgebraTerm, steps: string[]): AlgebraTerm => {
  if (!term) return term;
    
  // Clone o termo para não modificar o original
  const result = cloneTerm(term);
  
  // Verificar casos especiais conforme o tipo
  switch (result.type) {
    case 'difference':
      // Caso especial: a^2 - b^2 = (a+b)(a-b)
      if (isDifferenceOfSquares(result)) {
        steps.push(`Detectada diferença de quadrados: ${termToString(result)}`);
        return transformDifferenceOfSquares(result, steps);
      }
      break;
      
    case 'sum':
      // Caso especial: a^2 + 2ab + b^2 = (a+b)^2
      if (isPerfectSquareTrinomial(result)) {
        steps.push(`Detectado trinômio quadrado perfeito: ${termToString(result)}`);
        const transformed = transformPerfectSquare(result, steps);
        return transformed; // Make sure to return the transformed result
      }
      break;
  }
  
  // Também verificar para x^2 - 2x + 1 = (x-1)^2 transformando em formato de soma
  if (result.type === 'sum') {
    // Verificar se temos um termo negativo que pode fazer parte de um trinômio quadrado perfeito
    let hasNegativeTerm = false;
    
    if (result.left?.type === 'negative' || 
       (result.left?.type === 'product' && result.left.left?.type === 'constant' && result.left.left.value! < 0)) {
      hasNegativeTerm = true;
    }
    
    if (result.right?.type === 'negative' || 
       (result.right?.type === 'product' && result.right.left?.type === 'constant' && result.right.left.value! < 0)) {
      hasNegativeTerm = true;
    }
    
    if (hasNegativeTerm) {
      steps.push(`Verificando se a expressão com termo negativo é um trinômio quadrado perfeito`);
      
      // Tentar verificar como trinômio quadrado perfeito
      if (isPerfectSquareTrinomial(result)) {
        steps.push(`Detectado trinômio quadrado perfeito com termo negativo: ${termToString(result)}`);
        const transformed = transformPerfectSquare(result, steps);
        return transformed; // Make sure to return the transformed result
      }
    }
  }
  
  // Processar recursivamente
  switch (result.type) {
    case 'sum':
    case 'difference':
    case 'product':
    case 'quotient':
      // Aplicar verificação recursivamente aos operandos
      if (result.left) {
        const leftResult = checkForSpecialCases(result.left, steps);
        if (!areTermsEqual(leftResult, result.left)) {
          result.left = leftResult;
        }
      }
      if (result.right) {
        const rightResult = checkForSpecialCases(result.right, steps);
        if (!areTermsEqual(rightResult, result.right)) {
          result.right = rightResult;
        }
      }
      break;
      
    case 'power':
      // Verificar no argumento e expoente
      if (result.argument) {
        const argResult = checkForSpecialCases(result.argument, steps);
        if (!areTermsEqual(argResult, result.argument)) {
          result.argument = argResult;
        }
      }
      break;
      
    case 'negative':
      // Verificar no argumento
      if (result.argument) {
        const argResult = checkForSpecialCases(result.argument, steps);
        if (!areTermsEqual(argResult, result.argument)) {
          result.argument = argResult;
        }
      }
      break;
  }
  
  return result;
}; 