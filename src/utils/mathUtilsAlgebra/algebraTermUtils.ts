// ===================================================
// ========= UTILIDADES DE MANIPULAÇÃO DE TERMOS ======
// ===================================================

import { AlgebraTerm, cloneTerm, areTermsEqual } from './algebraTermDefinition';
import { termToString } from './algebraTermManipulator';
import { buildSumTree, findGCD } from './algebraUtils';
import { distributeNegative } from './algebraExpansion';
import { findCommonFactor, factorOutCommonTerm } from './algebraFactorization';

// Função para combinar termos semelhantes em um termo algébrico
export const combineLikeTerms = (term: AlgebraTerm, steps: string[]): AlgebraTerm => {
  if (!term) return term;
    
  // Se o termo já é primitivo, retornar ele mesmo
  if (term.type === 'constant' || term.type === 'variable') {
    return term;
  }
  
  // Clone o termo para não modificar o original
  const result = cloneTerm(term);
  
  // Processar tipos específicos
  switch (result.type) {
    case 'sum': {
      // Simplificar recursivamente os operandos
      result.left = combineLikeTerms(result.left!, steps);
      result.right = combineLikeTerms(result.right!, steps);
      
      // Verificar casos especiais antes de continuar
      
      // Caso especial: Subtração de expressão entre parênteses
      // Verifica se temos algo como a + (-(b + c)) que precisa ser convertido para a - b - c
      if (result.right!.type === 'negative' && 
          (result.right!.argument!.type === 'sum' || result.right!.argument!.type === 'difference')) {
        
        // Extrair a expressão entre parênteses
        const parenthesizedExpr = result.right!.argument!;
        
        // Distribuir o sinal negativo
        const distributedNegative = distributeNegative(parenthesizedExpr, steps);
        
        // Criar uma nova expressão com a distribuição
        let newExpr: AlgebraTerm;
        if (distributedNegative.type === 'sum') {
          newExpr = {
            type: 'sum' as const,
            left: result.left!,
            right: distributedNegative
          };
        } else {
          // Caso simples, somar o resultado
          newExpr = {
            type: 'sum' as const,
            left: result.left!,
            right: distributedNegative
          };
        }
        
        // Combinar novamente após a distribuição
        return combineLikeTerms(newExpr, steps);
      }
      
      // Se algum dos lados é zero, retornar o outro lado
      if (result.left?.type === 'constant' && result.left.value === 0) {
        return result.right!;
      }
      if (result.right?.type === 'constant' && result.right.value === 0) {
        return result.left!;
      }
      
      // Verificar se os termos são semelhantes
      if (areTermsLike(result.left!, result.right!)) {
        steps.push(`Combinando termos semelhantes: ${termToString(result.left!)} + ${termToString(result.right!)}`);
        const combined = combineSimilarTerms(result.left!, result.right!, '+');
        return combined;
      }
      
      // Verificar casos especiais de soma de produtos com um fator comum
      if (result.left!.type === 'product' && result.right!.type === 'product') {
        const commonFactor = findCommonFactor(result.left!, result.right!);
        if (commonFactor) {
          steps.push(`Fatorando termo comum: ${termToString(commonFactor)}`);
          return factorOutCommonTerm(result, commonFactor, steps);
        }
      }
      
      // Tentar converter para representação polinomial para melhor combinação
      if ((result.left!.type === 'sum' || result.left!.type === 'difference') ||
          (result.right!.type === 'sum' || result.right!.type === 'difference')) {
        // Converter para forma polinomial para combinação mais eficiente
        const terms: AlgebraTerm[] = [];
        
        // Extrair termos do lado esquerdo
        if (result.left!.type === 'sum') {
          extractTermsFromSum(result.left!, terms);
        } else if (result.left!.type === 'difference') {
          terms.push(result.left!.left!);
          terms.push({
            type: 'negative',
            argument: result.left!.right!
          });
        } else {
          terms.push(result.left!);
        }
        
        // Extrair termos do lado direito
        if (result.right!.type === 'sum') {
          extractTermsFromSum(result.right!, terms);
        } else if (result.right!.type === 'difference') {
          terms.push(result.right!.left!);
          terms.push({
            type: 'negative',
            argument: result.right!.right!
          });
        } else {
          terms.push(result.right!);
        }
        
        // Agrupar termos semelhantes
        const combinedTerms = groupLikeTerms(terms, steps);
        
        // Reconstruir a expressão a partir dos termos agrupados
        if (combinedTerms.length === 0) {
          return { type: 'constant', value: 0 };
        } else if (combinedTerms.length === 1) {
          return combinedTerms[0];
        } else {
          // Construir a árvore de soma balanceada
          return buildSumTree(combinedTerms);
        }
      }
      
      return result;
    }
    
    case 'difference': {
      // Simplificar recursivamente os operandos
      result.left = combineLikeTerms(result.left!, steps);
      result.right = combineLikeTerms(result.right!, steps);
      
      // Caso especial: Se o lado direito é uma soma ou diferença, aplicar a distribuição
      if (result.right!.type === 'sum' || result.right!.type === 'difference') {
        
        // a - (b + c) = a - b - c
        // Converter para: a + (-(b + c))
        const negatedRight: AlgebraTerm = {
          type: 'negative' as const,
          argument: result.right!
        };
        
        // Criar uma nova soma com o lado esquerdo e o lado direito negado
        const newSum: AlgebraTerm = {
          type: 'sum' as const,
          left: result.left!,
          right: negatedRight
        };
        
        
        // Chamar combineLikeTerms novamente para processar a nova expressão
        return combineLikeTerms(newSum, steps);
      }
      
      // Se o lado direito é zero, retornar o lado esquerdo
      if (result.right?.type === 'constant' && result.right.value === 0) {
        return result.left!;
      }
      
      // Se o lado esquerdo é zero, retornar o negativo do lado direito
      if (result.left?.type === 'constant' && result.left.value === 0) {
        return {
          type: 'negative',
          argument: result.right!
        };
      }
      
      // Verificar se os termos são semelhantes
      if (areTermsLike(result.left!, result.right!)) {
        steps.push(`Combinando termos semelhantes: ${termToString(result.left!)} - ${termToString(result.right!)}`);
        return combineSimilarTerms(result.left!, result.right!, '-');
      }
      
      // Verificar se o lado direito é um negativo para converter para soma
      if (result.right!.type === 'negative') {
        steps.push(`Convertendo subtração de negativo para soma: ${termToString(result.left!)} - (${termToString(result.right!)})`);
        return {
          type: 'sum',
          left: result.left!,
          right: result.right!.argument!
        };
      }
      
      return result;
    }
    
    case 'product': {
      // Simplificar recursivamente os operandos
      result.left = combineLikeTerms(result.left!, steps);
      result.right = combineLikeTerms(result.right!, steps);
      
      // Se algum dos fatores é zero, o produto é zero
      if ((result.left?.type === 'constant' && result.left.value === 0) ||
          (result.right?.type === 'constant' && result.right.value === 0)) {
        return { type: 'constant', value: 0 };
      }
      
      // Se algum dos fatores é um, retornar o outro fator
      if (result.left?.type === 'constant' && result.left.value === 1) {
        return result.right!;
      }
      if (result.right?.type === 'constant' && result.right.value === 1) {
        return result.left!;
      }
      
      return result;
    }
      
    case 'quotient': {
      // Simplificar recursivamente os operandos
      result.left = combineLikeTerms(result.left!, steps);
      result.right = combineLikeTerms(result.right!, steps);
      
      // Se o numerador é zero, o resultado é zero
      if (result.left?.type === 'constant' && result.left.value === 0) {
        return { type: 'constant' as const, value: 0 };
      }
      
      // Se o denominador é um, retornar o numerador
      if (result.right?.type === 'constant' && result.right.value === 1) {
        return result.left!;
      }
      
      // Simplificar frações com termos iguais no numerador e denominador
      if (areTermsEqual(result.left!, result.right!)) {
        return { type: 'constant' as const, value: 1 };
      }
      
      return result;
    }
      
    case 'power': {
      // Simplificar o argumento da potência
      if (result.argument) {
        result.argument = combineLikeTerms(result.argument, steps);
      }
      
      // Se o expoente é zero, retornar 1
      if (typeof result.exponent === 'number' && result.exponent === 0) {
        return { type: 'constant', value: 1 };
      }
      
      // Se o expoente é um, retornar a base
      if (typeof result.exponent === 'number' && result.exponent === 1) {
        return result.argument || { type: 'variable', variable: result.variable! };
      }
      
      // Se a base é zero, retornar zero
      if (result.argument?.type === 'constant' && result.argument.value === 0) {
        return { type: 'constant', value: 0 };
      }
      
      // Se a base é um, retornar um
      if (result.argument?.type === 'constant' && result.argument.value === 1) {
        return { type: 'constant', value: 1 };
      }
      
      return result;
    }
      
    case 'negative':
      result.argument = combineLikeTerms(result.argument!, steps);
      
      // Se o argumento é zero, retornar zero
      if (result.argument?.type === 'constant' && result.argument.value === 0) {
        return { type: 'constant', value: 0 };
      }
      
      // Se o argumento já é um negativo, retornar o argumento dele (dupla negação)
      if (result.argument?.type === 'negative') {
        return result.argument.argument!;
      }
      
      return result;
      
    default:
      return result;
  }
};

// Função auxiliar para extrair termos de uma expressão sum
export const extractTermsFromSum = (sumTerm: AlgebraTerm, terms: AlgebraTerm[]): void => {
  if (sumTerm.type === 'sum') {
    extractTermsFromSum(sumTerm.left!, terms);
    extractTermsFromSum(sumTerm.right!, terms);
  } else {
    terms.push(sumTerm);
  }
};

// Função auxiliar para agrupar termos semelhantes
export const groupLikeTerms = (terms: AlgebraTerm[], steps: string[]): AlgebraTerm[] => {
  const grouped: AlgebraTerm[] = [];
  const processed: boolean[] = new Array(terms.length).fill(false);
  
  // Normalizar termos negativos para que -2x seja representado como produto com coeficiente negativo
  const normalizedTerms = terms.map(normalizeNegativeTerm);
  
  for (let i = 0; i < normalizedTerms.length; i++) {
    if (processed[i]) continue;
    
    let currentTerm = normalizedTerms[i];
    processed[i] = true;
    
    // Procurar por termos semelhantes e combiná-los
    for (let j = i + 1; j < normalizedTerms.length; j++) {
      if (processed[j]) continue;
      
      if (areTermsLike(currentTerm, normalizedTerms[j])) {
        steps.push(`Combinando termos semelhantes: ${termToString(currentTerm)} e ${termToString(normalizedTerms[j])}`);
        currentTerm = combineSimilarTerms(currentTerm, normalizedTerms[j], '+');
        processed[j] = true;
      }
    }
    
    // Adicionar o termo combinado se não for zero
    if (!(currentTerm.type === 'constant' && currentTerm.value === 0)) {
      grouped.push(currentTerm);
    }
  }
  
  return grouped;
};

// Normalizar termos negativos para facilitar a combinação
export const normalizeNegativeTerm = (term: AlgebraTerm): AlgebraTerm => {
  if (term.type === 'negative') {
    const arg = term.argument!;
    
    // Caso 1: -c (constante)
    if (arg.type === 'constant') {
      return { ...arg, value: -arg.value! };
    }
    
    // Caso 2: -x (variável)
    if (arg.type === 'variable') {
      return {
        type: 'product',
        left: { type: 'constant', value: -1 },
        right: arg
      };
    }
    
    // Caso 3: -(c*x) (produto de constante com variável)
    if (arg.type === 'product' && arg.left?.type === 'constant') {
      return {
        ...arg,
        left: { ...arg.left, value: -arg.left.value! }
      };
    }
    
    // Outros casos: adicionar o negativo como fator
    return {
      type: 'product',
      left: { type: 'constant', value: -1 },
      right: arg
    };
  }
  
  return term;
};

// Verificar se dois termos são "semelhantes" (possuem a mesma parte literal)
export const areTermsLike = (term1: AlgebraTerm, term2: AlgebraTerm): boolean => {
  
  // Normalizar termos negativos
  const normalized1 = normalizeNegativeTerm(term1);
  const normalized2 = normalizeNegativeTerm(term2);
  
  // Variáveis simples do mesmo nome são semelhantes
  if (normalized1.type === 'variable' && normalized2.type === 'variable') {
    return normalized1.variable === normalized2.variable;
  }
  
  // Potências são semelhantes se tiverem a mesma base e expoente
  if (normalized1.type === 'power' && normalized2.type === 'power') {
    // Se ambos tem variáveis
    if (normalized1.variable && normalized2.variable) {
      return normalized1.variable === normalized2.variable && 
             areExponentsEqual(normalized1.exponent, normalized2.exponent);
    }
    
    // Se ambos tem argumentos
    if (normalized1.argument && normalized2.argument) {
      return areTermsEqual(normalized1.argument, normalized2.argument) && 
             areExponentsEqual(normalized1.exponent, normalized2.exponent);
    }
  }
  
  // Produtos podem ser semelhantes se tiverem a mesma parte literal
  if (normalized1.type === 'product' && normalized2.type === 'product') {
    // Extrair coeficientes e variáveis
    const [coef1, var1] = extractCoefficientAndVariable(normalized1);
    const [coef2, var2] = extractCoefficientAndVariable(normalized2);
    
    // Se ambos têm parte variável, verificar se são iguais
    if (var1 && var2) {
      const variablesEqual = areVariablePartsEqual(var1, var2);
      return variablesEqual;
    }
  }
  
  // Produto com variável é semelhante à própria variável
  if (normalized1.type === 'product' && normalized2.type === 'variable') {
    const [, var1] = extractCoefficientAndVariable(normalized1);
    if (var1?.type === 'variable') {
      return var1.variable === normalized2.variable;
    }
  }
  
  if (normalized2.type === 'product' && normalized1.type === 'variable') {
    const [, var2] = extractCoefficientAndVariable(normalized2);
    if (var2?.type === 'variable') {
      return var2.variable === normalized1.variable;
    }
  }
  
  return false;
};

// Verificar se duas partes variáveis são iguais
export const areVariablePartsEqual = (var1: AlgebraTerm, var2: AlgebraTerm): boolean => {
  // Caso simples: variável vs variável
  if (var1.type === 'variable' && var2.type === 'variable') {
    return var1.variable === var2.variable;
  }
  
  // Caso: potência vs potência
  if (var1.type === 'power' && var2.type === 'power') {
    if (var1.variable && var2.variable) {
      return var1.variable === var2.variable && 
             areExponentsEqual(var1.exponent, var2.exponent);
    }
    
    if (var1.argument && var2.argument) {
      return areTermsEqual(var1.argument, var2.argument) && 
             areExponentsEqual(var1.exponent, var2.exponent);
    }
  }
  
  // Caso: variável vs potência
  if (var1.type === 'variable' && var2.type === 'power') {
    if (var2.variable && var1.variable === var2.variable && 
        typeof var2.exponent === 'number' && var2.exponent === 1) {
      return true;
    }
  }
  
  if (var2.type === 'variable' && var1.type === 'power') {
    if (var1.variable && var2.variable === var1.variable && 
        typeof var1.exponent === 'number' && var1.exponent === 1) {
      return true;
    }
  }
  
  // Para outros casos complexos, comparar a representação em string
  return termToString(var1) === termToString(var2);
};

// Extrair coeficiente e variável de um termo
export const extractCoefficientAndVariable = (
  term: AlgebraTerm
): [AlgebraTerm | null, AlgebraTerm | null] => {
  // Normalizar o termo caso seja negativo
  const normalizedTerm = normalizeNegativeTerm(term);
  
  if (normalizedTerm.type === 'product') {
    if (normalizedTerm.left?.type === 'constant') {
      return [normalizedTerm.left, normalizedTerm.right ?? null];
    }
    
    if (normalizedTerm.right?.type === 'constant') {
      return [normalizedTerm.right, normalizedTerm.left ?? null];
    }
  }
  
  if (normalizedTerm.type === 'variable' || normalizedTerm.type === 'power') {
    return [
      { type: 'constant', value: 1 },
      normalizedTerm
    ];
  }
  
  if (normalizedTerm.type === 'constant') {
    return [normalizedTerm, null];
  }
  
  return [null, normalizedTerm];
};

// Combinar termos semelhantes
export const combineSimilarTerms = (
  term1: AlgebraTerm, 
  term2: AlgebraTerm, 
  operation: '+' | '-'
): AlgebraTerm => {
  
  // Normalizar termos negativos
  const normalized1 = normalizeNegativeTerm(term1);
  const normalized2 = normalizeNegativeTerm(term2);
  
  // Caso especial: ambos são variáveis simples
  if (normalized1.type === 'variable' && normalized2.type === 'variable' && normalized1.variable === normalized2.variable) {
    const coef: number = operation === '+' ? 2 : 0;
    
    if (coef === 0) {
      return { type: 'constant', value: 0 };
    }
    
    if (coef === 1) {
      return { type: 'variable', variable: normalized1.variable };
    }
    
    return {
      type: 'product',
      left: { type: 'constant', value: coef },
      right: { type: 'variable', variable: normalized1.variable }
    };
  }
  
  // Extrair coeficientes e variáveis
  const [coef1, var1] = extractCoefficientAndVariable(normalized1);
  const [coef2, var2] = extractCoefficientAndVariable(normalized2);
    
  if (coef1 && coef2 && var1 && var2 && areVariablePartsEqual(var1, var2)) {
    // Calcular o novo coeficiente
    const coef1Value = coef1.value ?? 0;
    const coef2Value = coef2.value ?? 0;
    const newCoefValue = operation === '+' 
      ? coef1Value + coef2Value
      : coef1Value - coef2Value;
        
    // Se o coeficiente é zero, retornar zero
    if (Math.abs(newCoefValue) < 1e-10) {
      return { type: 'constant', value: 0 };
    }
    
    // Se o coeficiente é 1, retornar apenas a variável
    if (Math.abs(newCoefValue - 1) < 1e-10) {
      return cloneTerm(var1);
    }
    
    // Se o coeficiente é -1, retornar o negativo da variável
    if (Math.abs(newCoefValue + 1) < 1e-10) {
      return {
        type: 'negative',
        argument: cloneTerm(var1)
      };
    }
    
    // Caso contrário, retornar o produto
    return {
      type: 'product',
      left: { type: 'constant', value: newCoefValue },
      right: cloneTerm(var1)
    };
  }
  
  // Se não conseguiu combinar, retornar o termo original
  if (operation === '+') {
    return {
      type: 'sum',
      left: term1,
      right: term2
    };
  } else {
    return {
      type: 'difference',
      left: term1,
      right: term2
    };
  }
};

// Verificar se os expoentes são iguais
export const areExponentsEqual = (
  exp1: number | AlgebraTerm | undefined, 
  exp2: number | AlgebraTerm | undefined
): boolean => {
  if (exp1 === undefined && exp2 === undefined) return true;
  if (exp1 === undefined || exp2 === undefined) return false;
  
  if (typeof exp1 === 'number' && typeof exp2 === 'number') {
    return Math.abs(exp1 - exp2) < 1e-10;
  }
  
  if (typeof exp1 !== 'number' && typeof exp2 !== 'number') {
    return areTermsEqual(exp1, exp2);
  }
  
  return false;
}; 