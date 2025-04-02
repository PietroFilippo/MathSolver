// ===================================================
// ========= UTILIDADES DE EXPANSÃO ================
// ===================================================

import { AlgebraTerm, cloneTerm, areTermsEqual } from './algebraTermDefinition';
import { termToString } from './algebraTermManipulator';
import { combineLikeTerms } from './algebraTermUtils';

// Distribuir sinal negativo sobre uma expressão
export const distributeNegative = (term: AlgebraTerm, steps: string[]): AlgebraTerm => {
  
  if (term.type === 'sum') {
    // -(a + b) = -a - b
    const leftNegated: AlgebraTerm = {
      type: 'negative',
      argument: term.left!
    };
    const rightNegated: AlgebraTerm = {
      type: 'negative',
      argument: term.right!
    };
    
    // Simplificar os termos negados primeiro
    const simplifiedLeft = simplifyNegativeTerm(leftNegated);
    const simplifiedRight = simplifyNegativeTerm(rightNegated);
    
    const result = {
      type: 'sum' as const,
      left: simplifiedLeft,
      right: simplifiedRight
    };
    
    steps.push(`Distribuindo negativo: -(${termToString(term)}) = ${termToString(result)}`);
    return result;
  } else if (term.type === 'difference') {
    // -(a - b) = -a + b = b - a
    // Invertemos a ordem e mantemos a diferença
    
    // Também podemos representar como: -a + b
    const leftNegated: AlgebraTerm = {
      type: 'negative',
      argument: term.left!
    };
    
    // Simplificar o termo negado
    const simplifiedLeft = simplifyNegativeTerm(leftNegated);
    
    // Usar a forma b - a para melhor legibilidade
    const result = {
      type: 'difference' as const,
      left: cloneTerm(term.right!),
      right: cloneTerm(term.left!)
    };
    
    steps.push(`Distribuindo negativo sobre diferença: -(${termToString(term)}) = ${termToString(result)}`);
    return result;
  } else if (term.type === 'product') {
    // -(a * b) = (-a) * b
    // Podemos simplificar mais se um dos fatores é constante
    if (term.left?.type === 'constant') {
      const negatedConstant = {
        type: 'constant' as const,
        value: -term.left.value!
      };
      
      const result = {
        type: 'product' as const,
        left: negatedConstant,
        right: cloneTerm(term.right!)
      };
      
      steps.push(`Negando coeficiente: -(${termToString(term)}) = ${termToString(result)}`);
      return result;
    }
    
    const result = {
      type: 'product' as const,
      left: {
        type: 'negative' as const,
        argument: cloneTerm(term.left!)
      },
      right: cloneTerm(term.right!)
    };
    
    steps.push(`Negando produto: -(${termToString(term)}) = ${termToString(result)}`);
    return result;
  } else if (term.type === 'negative') {
    // -(-a) = a (dupla negação)
    const result = cloneTerm(term.argument!);
    steps.push(`Eliminando dupla negação: -(${termToString(term)}) = ${termToString(result)}`);
    return result;
  }
  
  // Para outros tipos, retornar o termo negado
  const result = {
    type: 'negative' as const,
    argument: cloneTerm(term)
  };
  
  steps.push(`Negando termo: -(${termToString(term)}) = ${termToString(result)}`);
  return result;
};

// Função auxiliar para simplificar termos negativos
const simplifyNegativeTerm = (term: AlgebraTerm): AlgebraTerm => {
  if (term.type !== 'negative') return term;
  
  const arg = term.argument!;
  
  // Caso: -(-a) = a
  if (arg.type === 'negative') {
    return arg.argument!;
  }
  
  // Caso: -(constante)
  if (arg.type === 'constant') {
    return {
      type: 'constant',
      value: -arg.value!
    };
  }
  
  // Caso: -(coeficiente * var)
  if (arg.type === 'product' && arg.left?.type === 'constant') {
    return {
      type: 'product',
      left: {
        type: 'constant',
        value: -arg.left.value!
      },
      right: arg.right!
    };
  }
  
  // Caso: -(sum)
  if (arg.type === 'sum') {
    // Distribuir o negativo: -(a + b) = -a + -b
    const leftNegated: AlgebraTerm = {
      type: 'negative',
      argument: arg.left!
    };
    
    const rightNegated: AlgebraTerm = {
      type: 'negative',
      argument: arg.right!
    };
    
    // Simplificar cada lado para lidar com constantes e produtos
    const simplifiedLeft = simplifyNegativeTerm(leftNegated);
    const simplifiedRight = simplifyNegativeTerm(rightNegated);
    
    return {
      type: 'sum',
      left: simplifiedLeft,
      right: simplifiedRight
    };
  }
  
  // Caso: -(difference)
  if (arg.type === 'difference') {
    // Distribuir o negativo: -(a - b) = -a + b = b - a
    const leftNegated: AlgebraTerm = {
      type: 'negative',
      argument: arg.left!
    };
    
    // Simplificar o lado esquerdo negado
    const simplifiedLeft = simplifyNegativeTerm(leftNegated);
    
    return {
      type: 'difference',
      left: arg.right!,  // O lado direito não muda de sinal
      right: arg.left!   // O lado esquerdo se torna direito
    };
  }
  
  // Outros casos: manter o termo negativo
  return term;
};

// Simplificar produtos entre termos simples
export const simplifyProduct = (term: AlgebraTerm): AlgebraTerm | null => {
  if (term.type !== 'product') return null;
  
  const left = term.left!;
  const right = term.right!;
  
  // Multiplicação de constantes
  if (left.type === 'constant' && right.type === 'constant') {
    const result = left.value! * right.value!;
    return {
      type: 'constant',
      value: result
    };
  }
  
  // Multiplicação por 0
  if ((left.type === 'constant' && left.value === 0) || 
      (right.type === 'constant' && right.value === 0)) {
    return { type: 'constant', value: 0 };
  }
  
  // Multiplicação por 1
  if (left.type === 'constant' && left.value === 1) return right;
  if (right.type === 'constant' && right.value === 1) return left;
  
  // Multiplicação de constante por variável
  if (left.type === 'constant' && right.type === 'variable') {
    return {
      type: 'product',
      left: left,
      right: right
    };
  }
  
  // Multiplicação de variável por constante
  if (left.type === 'variable' && right.type === 'constant') {
    return {
      type: 'product',
      left: right,
      right: left
    };
  }
  
  // NOVO CASO: Multiplicação de (coef*var) por (coef*var)
  // Exemplo: (2x)*(3x) = 6x^2
  if (left.type === 'product' && right.type === 'product') {
    // Verificar se ambos têm coeficiente e variável
    const leftHasCoef = left.left?.type === 'constant';
    const leftHasVar = left.right?.type === 'variable';
    const rightHasCoef = right.left?.type === 'constant';
    const rightHasVar = right.right?.type === 'variable';
    
    if (leftHasCoef && leftHasVar && rightHasCoef && rightHasVar) {
      // Verificar se as variáveis são iguais
      if (left.right?.variable === right.right?.variable) {
        // Usar ! depois das verificações para garantir que não são undefined
        const newCoef = left.left!.value! * right.left!.value!;
        const variable = left.right!.variable!;
        
        return {
          type: 'product',
          left: { type: 'constant', value: newCoef },
          right: { 
            type: 'power', 
            variable: variable, 
            exponent: 2 
          }
        };
      }
    }
  }
  
  // NOVO CASO: Multiplicação de variável por (coef*var)
  // Exemplo: x*(2x) = 2x^2
  if (left.type === 'variable' && right.type === 'product' && 
      right.left?.type === 'constant' && right.right?.type === 'variable') {
    if (left.variable === right.right.variable) {
      const coef = right.left.value!;
      const variable = left.variable;
      
      return {
        type: 'product',
        left: { type: 'constant', value: coef },
        right: { 
          type: 'power', 
          variable: variable, 
          exponent: 2 
        }
      };
    }
  }
  
  // NOVO CASO: Multiplicação de (coef*var) por variável
  // Exemplo: (2x)*x = 2x^2
  if (right.type === 'variable' && left.type === 'product' && 
      left.left?.type === 'constant' && left.right?.type === 'variable') {
    if (right.variable === left.right.variable) {
      const coef = left.left.value!;
      const variable = right.variable;
      
      return {
        type: 'product',
        left: { type: 'constant', value: coef },
        right: { 
          type: 'power', 
          variable: variable, 
          exponent: 2 
        }
      };
    }
  }
  
  // Multiplicação de constante por produto que tem constante
  if (left.type === 'constant' && 
      right.type === 'product' && 
      right.left?.type === 'constant') {
    const newValue = left.value! * right.left.value!;
    return {
      type: 'product',
      left: { type: 'constant', value: newValue },
      right: right.right!
    };
  }
  
  // Multiplicação de produto que tem constante por constante
  if (left.type === 'product' && left.left?.type === 'constant' && right.type === 'constant') {
    const newValue = left.left.value! * right.value!;
    return {
      type: 'product',
      left: { type: 'constant', value: newValue },
      right: left.right!
    };
  }
  
  // Multiplicação de constante por produto com variável
  if (left.type === 'constant' && 
      right.type === 'product' && 
      (right.left?.type === 'variable' || right.right?.type === 'variable')) {
    
    // Se o lado esquerdo do produto direito for uma variável
    if (right.left?.type === 'variable') {
      return {
        type: 'product',
        left: { 
          type: 'product',
          left: left,
          right: right.left
        },
        right: right.right!
      };
    }
    
    // Se o lado direito do produto direito for uma variável
    if (right.right?.type === 'variable') {
      return {
        type: 'product',
        left: { 
          type: 'product',
          left: left,
          right: right.right
        },
        right: right.left!
      };
    }
  }
  
  // Multiplicação de variável por outra variável (mesma variável)
  if (left.type === 'variable' && right.type === 'variable' && left.variable === right.variable) {
    return {
      type: 'power',
      variable: left.variable,
      exponent: 2
    };
  }
  
  // Multiplicação de variável por power da mesma variável
  if (left.type === 'variable' && 
      right.type === 'power' && 
      right.variable === left.variable && 
      typeof right.exponent === 'number') {
    
    return {
      type: 'power',
      variable: left.variable,
      exponent: right.exponent + 1
    };
  }
  
  // Multiplicação de power por power da mesma variável
  if (left.type === 'power' && 
      right.type === 'power' && 
      left.variable === right.variable && 
      typeof left.exponent === 'number' && 
      typeof right.exponent === 'number') {
    
    return {
      type: 'power',
      variable: left.variable,
      exponent: left.exponent + right.exponent
    };
  }
  
  // Lidar com produtos envolvendo termos negativos
  if (left.type === 'negative' || right.type === 'negative') {
    // Extrair os argumentos reais e criar um produto negativo
    const leftArg = left.type === 'negative' ? left.argument : left;
    const rightArg = right.type === 'negative' ? right.argument : right;
    
    // Se ambos forem negativos, o resultado é positivo
    if (left.type === 'negative' && right.type === 'negative') {
      const simplifiedProduct = simplifyProduct({
        type: 'product',
        left: leftArg!,
        right: rightArg!
      });
      
      return simplifiedProduct || {
        type: 'product',
        left: leftArg!,
        right: rightArg!
      };
    }
    
    // Se apenas um for negativo, o resultado é negativo
    const simplifiedProduct = simplifyProduct({
      type: 'product',
      left: leftArg!,
      right: rightArg!
    });
    
    return {
      type: 'negative',
      argument: simplifiedProduct || {
        type: 'product',
        left: leftArg!,
        right: rightArg!
      }
    };
  }
  
  return null; // Nenhuma simplificação possível
};

// Expandir um termo algébrico
export const expandTerm = (term: AlgebraTerm, steps: string[]): AlgebraTerm => {
  if (!term) return term;

  // Clone o termo para não modificar o original
  const result = cloneTerm(term);

  // Processar tipos específicos
  switch (result.type) {
    case 'product':
      // Expandir recursivamente os operandos
      result.left = expandTerm(result.left!, steps);
      result.right = expandTerm(result.right!, steps);
      
      // Verificar se temos um produto de binômios especiais
      if ((result.left!.type === 'sum' || result.left!.type === 'difference') &&
          (result.right!.type === 'sum' || result.right!.type === 'difference')) {
        
        // Usar a expansão específica para binômios
        return expandBinomialProduct(result.left!, result.right!, steps);
      }
      
      // Caso especial: produto de dois termos, onde pelo menos um é uma soma/diferença
      if (result.left!.type === 'sum' || result.left!.type === 'difference' ||
          result.right!.type === 'sum' || result.right!.type === 'difference') {
        
        // Caso especial: se temos um produto envolvendo diferenças, usar função especializada
        if (result.left!.type === 'difference' || result.right!.type === 'difference') {
          return distributeOverDifference(result.left!, result.right!, steps);
        }
        
        // Caso um dos operandos seja uma soma, distribuir
        if (result.left!.type === 'sum') {
          return distributeProduct(result.left!, result.right!, 'sum', steps);
        }
        
        if (result.right!.type === 'sum') {
          return distributeProduct(result.right!, result.left!, 'sum', steps);
        }
      }
      
      // Caso especial: potências de binômios
      if (result.left!.type === 'power' && 
          typeof result.left!.exponent === 'number' && 
          result.left!.argument && 
          (result.left!.argument.type === 'sum' || result.left!.argument.type === 'difference')) {
        return expandBinomialPower(result.left!.argument, result.left!.exponent, steps);
      }
      
      if (result.right!.type === 'power' && 
          typeof result.right!.exponent === 'number' && 
          result.right!.argument && 
          (result.right!.argument.type === 'sum' || result.right!.argument.type === 'difference')) {
        return expandBinomialPower(result.right!.argument, result.right!.exponent, steps);
      }
      
      // Verificar se podemos simplificar o produto
      const simplifiedProduct = simplifyProduct(result);
      if (simplifiedProduct) {
        return simplifiedProduct;
      }
      
      // Se não for possível expandir ou simplificar, retornar o produto original
      return result;
    
    case 'power':
      // Caso especial: expandir potências de binômios (x+y)^2, (x+y)^3, etc.
      if ((result.argument?.type === 'sum' || result.argument?.type === 'difference') && 
          typeof result.exponent === 'number' && result.exponent > 1 && result.exponent <= 3) { // Limitado a expoentes pequenos
        steps.push(`Expandindo potência: (${termToString(result.argument)})^${result.exponent}`);
        return expandBinomialPower(result.argument, result.exponent, steps);
      }
      
      // Expandir recursivamente o argumento
      if (result.argument) {
        result.argument = expandTerm(result.argument, steps);
      }
      return result;
      
    case 'sum':
      // Expandir recursivamente os operandos
      if (result.left) result.left = expandTerm(result.left, steps);
      if (result.right) result.right = expandTerm(result.right, steps);
      return result;
      
    case 'difference':
      // Expandir recursivamente os operandos
      if (result.left) result.left = expandTerm(result.left, steps);
      if (result.right) result.right = expandTerm(result.right, steps);
      
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
                
        // Expandir a nova expressão para distribuir completamente
        return expandTerm(newSum, steps);
      }
      
      return result;
    
    case 'quotient':
      // Expandir recursivamente os operandos
      if (result.left) result.left = expandTerm(result.left, steps);
      if (result.right) result.right = expandTerm(result.right, steps);
      return result;
      
    case 'negative':
      // Expandir primeiro o argumento
      const expandedArg = expandTerm(result.argument!, steps);
      
      // Se o argumento expandido é uma soma ou diferença, distribuir o sinal negativo
      if (expandedArg.type === 'sum' || expandedArg.type === 'difference') {
        steps.push(`Distribuindo sinal negativo: -${termToString(expandedArg)}`);
        return distributeNegative(expandedArg, steps);
      }
      
      // Para outros casos, manter o negativo
      return {
        type: 'negative' as const,
        argument: expandedArg
      };
    
    default:
      return result;
  }
};

// Distribuir um produto sobre uma soma ou diferença
export const distributeProduct = (
  sumTerm: AlgebraTerm, 
  factor: AlgebraTerm, 
  operationType: 'sum' | 'difference',
  steps: string[]
): AlgebraTerm => {
  
  // Verificar se o termo é realmente uma soma ou diferença
  if (sumTerm.type !== 'sum' && sumTerm.type !== 'difference') {
    return {
      type: 'product' as const,
      left: factor,
      right: sumTerm
    };
  }
  
  // Extrair os termos à esquerda e à direita da soma/diferença
  const leftTerm = sumTerm.left!;
  const rightTerm = sumTerm.right!;
  
  // Distribuir o fator sobre cada termo
  const leftProduct = {
    type: 'product' as const,
    left: cloneTerm(factor),
    right: cloneTerm(leftTerm)
  };
  
  // Simplificar o produto à esquerda, se possível
  const simplifiedLeftProduct = simplifyProduct(leftProduct);
  const leftResult = simplifiedLeftProduct || leftProduct;
  
  // Distribuir o fator sobre o termo à direita
  const rightProduct = {
    type: 'product' as const,
    left: cloneTerm(factor),
    right: cloneTerm(rightTerm)
  };
  
  // Simplificar o produto à direita, se possível
  const simplifiedRightProduct = simplifyProduct(rightProduct);
  const rightResult = simplifiedRightProduct || rightProduct;
  
  // Combinar os resultados com base no tipo de operação (soma ou diferença)
  let result: AlgebraTerm;
  
  if (sumTerm.type === 'sum') {
    result = {
      type: 'sum' as const,
      left: leftResult,
      right: rightResult
    };
  } else {
    // Caso de diferença: precisamos tratar o sinal negativo corretamente
    // Para (a - b) * c, precisamos calcular a*c - b*c
    result = {
      type: 'difference' as const,
      left: leftResult,
      right: rightResult
    };
  }
    
  // Expandir recursivamente para lidar com casos aninhados
  const expandedResult = expandTerm(result, steps);  
  return expandedResult;
};

// Função para expandir o produto de um fator por uma diferença
export const distributeOverDifference = (leftFactor: AlgebraTerm, rightFactor: AlgebraTerm, steps: string[]): AlgebraTerm => {
  
  // Caso especial: se temos (a - b)(c + d), precisamos distribuir corretamente
  if (leftFactor.type === 'difference' && rightFactor.type === 'sum') {
    const a = leftFactor.left!;
    const b = leftFactor.right!;
    const c = rightFactor.left!;
    const d = rightFactor.right!;
    
    // (a - b)(c + d) = ac + ad - bc - bd
    // Primeiro: (a)(c + d) = ac + ad
    const firstPart = distributeProduct(rightFactor, a, 'sum', steps);
    
    // Segundo: (b)(c + d) = bc + bd 
    const secondPart = distributeProduct(rightFactor, b, 'sum', steps);
    
    // Resultado final: (ac + ad) - (bc + bd)
    // Usando a regra da distribuição de subtração:
    // (x + y) - (z + w) = x + y - z - w
    
    // Criar uma expressão que representa a distribuição completa
    const result: AlgebraTerm = {
      type: 'difference' as const,
      left: firstPart,
      right: secondPart
    };
    
    // Expandir e simplificar completamente
    return expandTerm(result, steps);
  }
  
  // Caso especial: se temos (a - b)(c - d), precisamos distribuir corretamente
  if (leftFactor.type === 'difference' && rightFactor.type === 'difference') {
    const a = leftFactor.left!;
    const b = leftFactor.right!;
    const c = rightFactor.left!;
    const d = rightFactor.right!;
    
    // (a - b)(c - d) = ac - ad - bc + bd
    
    // Primeiro: (a)(c - d) = ac - ad
    const firstPart = distributeProduct(rightFactor, a, 'difference', steps);
    
    // Segundo: (b)(c - d) = bc - bd (mas precisamos negar isso para: -bc + bd)
    const secondPartTemp = distributeProduct(rightFactor, b, 'difference', steps);
    
    // Negar o segundo resultado
    const secondPart: AlgebraTerm = {
      type: 'negative' as const,
      argument: secondPartTemp
    };
    
    // O resultado é a soma: (ac - ad) + (-bc + bd)
    const result: AlgebraTerm = {
      type: 'sum' as const,
      left: firstPart,
      right: secondPart
    };
    
    // Expandir e simplificar completamente
    return expandTerm(result, steps);
  }
  
  // Para outros casos, usar a distribuição normal
  if (leftFactor.type === 'difference') {
    return distributeProduct(leftFactor, rightFactor, 'difference', steps);
  }
  
  if (rightFactor.type === 'difference') {
    return distributeProduct(rightFactor, leftFactor, 'difference', steps);
  }
  
  // Caso padrão: produto simples
  return {
    type: 'product' as const,
    left: leftFactor,
    right: rightFactor
  };
};

// Expandir uma potência de binômio
export const expandBinomialPower = (
  binomial: AlgebraTerm, 
  exponent: number,
  steps: string[]
): AlgebraTerm => {
  // Implementação simplificada para casos comuns
  switch (exponent) {
    case 2: {
      // (a+b)^2 = a^2 + 2ab + b^2
      const a = cloneTerm(binomial.left!);
      const b = cloneTerm(binomial.right!);
      
      // Termo a^2
      const aSq: AlgebraTerm = {
        type: 'power' as const,
        argument: a,
        exponent: 2
      };
      
      // Termo 2ab
      const twoAB: AlgebraTerm = {
        type: 'product' as const,
        left: { type: 'constant', value: 2 },
        right: {
          type: 'product' as const,
          left: a,
          right: b
        }
      };
      
      // Termo b^2
      const bSq: AlgebraTerm = {
        type: 'power' as const,
        argument: b,
        exponent: 2
      };
      
      // Combinação final
      const result: AlgebraTerm = {
        type: 'sum' as const,
        left: {
          type: 'sum' as const,
          left: aSq,
          right: twoAB
        },
        right: bSq
      };
      
      steps.push(`Expandido como a^2 + 2ab + b^2: ${termToString(result)}`);
      return result;
    }
    
    // Outros casos poderiam ser implementados
    default:
      return binomial; // Fallback para casos não implementados
  }
};

// Expandir o produto de dois binômios
export const expandBinomialProduct = (
  leftBinomial: AlgebraTerm, 
  rightBinomial: AlgebraTerm, 
  steps: string[]
): AlgebraTerm => {
  // Verificar se ambos são binômios (soma ou diferença)
  if ((leftBinomial.type !== 'sum' && leftBinomial.type !== 'difference') ||
      (rightBinomial.type !== 'sum' && rightBinomial.type !== 'difference')) {
    // Se um deles não é um binômio, retornar um produto simples
    return {
      type: 'product',
      left: leftBinomial,
      right: rightBinomial
    };
  }
  
  // Extrair termos dos binômios
  const a = leftBinomial.left!;
  const b = leftBinomial.right!;
  const c = rightBinomial.left!;
  const d = rightBinomial.right!;
  
  // Preparar termos d com sinal negativo para diferenças
  let dTerm = d;
  if (rightBinomial.type === 'difference') {
    if (d.type === 'constant') {
      dTerm = { ...d, value: -d.value! }; // Inverter sinal diretamente
    } else if (d.type === 'product' && d.left?.type === 'constant') {
      dTerm = {
        ...d,
        left: { ...d.left, value: -d.left.value! }
      };
    } else {
      dTerm = {
        type: 'negative' as const,
        argument: d
      };
    }
  }
  
  // Preparar termos b com sinal negativo para diferenças
  let bTerm = b;
  if (leftBinomial.type === 'difference') {
    if (b.type === 'constant') {
      bTerm = { ...b, value: -b.value! }; // Inverter sinal diretamente
    } else if (b.type === 'product' && b.left?.type === 'constant') {
      bTerm = {
        ...b,
        left: { ...b.left, value: -b.left.value! }
      };
    } else {
      bTerm = {
        type: 'negative' as const,
        argument: b
      };
    }
  }
  
  // Calcular os 4 produtos: ac, ad, bc, bd
  let ac: AlgebraTerm = {
    type: 'product',
    left: cloneTerm(a),
    right: cloneTerm(c)
  };
  
  let ad: AlgebraTerm = {
    type: 'product',
    left: cloneTerm(a),
    right: cloneTerm(dTerm) // Usar dTerm com sinal ajustado
  };
  
  let bc: AlgebraTerm = {
    type: 'product',
    left: cloneTerm(bTerm), // Usar bTerm com sinal ajustado
    right: cloneTerm(c)
  };
  
  let bd: AlgebraTerm = {
    type: 'product',
    left: cloneTerm(bTerm), // Usar bTerm com sinal ajustado
    right: cloneTerm(dTerm) // Usar dTerm com sinal ajustado
  };
  
  // Simplificar produtos, se possível
  ac = simplifyProduct(ac) || ac;
  ad = simplifyProduct(ad) || ad;
  bc = simplifyProduct(bc) || bc;
  bd = simplifyProduct(bd) || bd;
  
  // Construir a soma de todos os termos
  const sum1: AlgebraTerm = {
    type: 'sum',
    left: ac,
    right: ad
  };
  
  const sum2: AlgebraTerm = {
    type: 'sum',
    left: sum1,
    right: bc
  };
  
  const result: AlgebraTerm = {
    type: 'sum',
    left: sum2,
    right: bd
  };
  
  // Adicionar passos
  steps.push(`Expandindo como (${termToString(leftBinomial)}) * (${termToString(rightBinomial)}) = ${termToString(ac)} + ${termToString(ad)} + ${termToString(bc)} + ${termToString(bd)}`);
  
  // Primeiro expandir recursivamente
  const expanded = expandTerm(result, steps);
  
  // Combinar termos semelhantes
  const simplified = combineLikeTerms(expanded, steps);
  
  steps.push(`Resultado da expansão e combinação: ${termToString(simplified)}`);
  return simplified;
}; 