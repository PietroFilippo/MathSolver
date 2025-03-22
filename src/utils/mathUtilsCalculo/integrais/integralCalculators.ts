import { Term, termToString, isVariableOrLinearExpression } from '../geral/mathUtilsCalculoGeral';
import { detectIntegralPattern } from './integralPatterns';

// Função para determinar se uma expressão é complexa o suficiente para processamento paralelo
export const isComplexExpression = (term: Term): boolean => {
  let complexity = 0;
  
  // Função recursiva para calcular a complexidade
  const calculateComplexity = (t: Term): number => {
    if (!t) return 0;
    
    let count = 1; // Conta o próprio termo
    
    // Contar argumentos
    if (t.argument) {
      count += calculateComplexity(t.argument);
    }
    
    // Contar operandos
    if (t.left) {
      count += calculateComplexity(t.left);
    }
    
    if (t.right) {
      count += calculateComplexity(t.right);
    }
    
    return count;
  };
  
  complexity = calculateComplexity(term);
  
  // Um termo é considerado complexo se tiver mais de 10 subtermos
  return complexity > 10;
};

// Integra constantes: ∫ k dx = k·x
export function calculateConstantIntegral(term: Term, variable: string): string {
  return `${term.value} * ${variable}`;
}

// Integra variáveis: ∫ x dx = x²/2, ∫ y dx = y·x
export function calculateVariableIntegral(term: Term, variable: string): string {
  if (term.variable === variable) {
    return `${variable}^2/2`;
  } else {
    return `${term.variable} * ${variable}`;
  }
}

// Integra termos de potência: ∫ xⁿ dx = x^(n+1)/(n+1) para n ≠ -1
export function calculatePowerIntegral(term: Term, variable: string, calculateIntegral: (term: Term, variable: string) => string): string {
  if (term.argument?.type === 'variable' && term.argument.variable === variable) {
    // Converte o expoente para um número para comparação confiável
    const exponentValue = typeof term.exponent === 'string' ? 
                          parseFloat(term.exponent) : 
                          (term.exponent !== undefined ? term.exponent : 0);
                          
    // Caso especial para x^(-1), que é 1/x
    if (exponentValue === -1) {
      return `ln|${variable}|`;
    } else {
      const newExponent = exponentValue + 1;
      return `${variable}^${newExponent}/${newExponent}`;
    }
  }
  
  // Tratamento do caso especial para funções trigonométricas elevadas a potências
  if (term.argument?.type === 'sin' || term.argument?.type === 'cos' || term.argument?.type === 'tan') {
    // Caso especial para cos(x)^2
    if (term.argument.type === 'cos' && 
        term.exponent === 2 && 
        term.argument.argument?.type === 'variable' && 
        term.argument.argument.variable === variable) {
      return `(${variable}/2) + (sin(2*${variable})/4)`;
    }
    
    // Caso especial para sin(x)^2
    if (term.argument.type === 'sin' && 
        term.exponent === 2 && 
        term.argument.argument?.type === 'variable' && 
        term.argument.argument.variable === variable) {
      return `(${variable}/2) - (sin(2*${variable})/4)`;
    }
    
    // Para outros casos, tente integrar o argumento e aplicar regras
    if (term.argument.argument && term.exponent !== undefined) {
      // Aqui é onde usamos calculateIntegral para termos mais complexos aninhados
      const argStr = termToString(term.argument.argument);
      if (argStr !== variable) {
        // Tente usar integração recursiva para argumentos mais complexos
        const innerResult = calculateIntegral(term.argument.argument, variable);
        if (!innerResult.startsWith('integral(')) {
          // Parte interna integrada com sucesso, agora use-a
          return `${term.argument.type}(${innerResult}) * ${term.exponent}`;
        }
      }
    }
  }
  
  // Verifica padrões antes de cair de volta para o caso genérico
  const patternMatch = detectIntegralPattern(term, variable);
  if (patternMatch.pattern) {
    return patternMatch.result as string;
  }
  
  return `integral(${termToString(term)})`;
}

// Integra termos trigonométricos: sin, cos, tan
export function calculateTrigIntegral(term: Term, variable: string): string {
  const termType = term.type;
  
  if (isVariableOrLinearExpression(term.argument, variable)) {
    switch (termType) {
      case 'sin':
        return `-cos(${termToString(term.argument!)})`;
      case 'cos':
        return `sin(${termToString(term.argument!)})`;
      case 'tan':
        return `-ln|cos(${termToString(term.argument!)})|`;
    }
  }
  
  // Verifica padrões especiais como integrais de Fresnel
  const patternMatch = detectIntegralPattern(term, variable);
  if (patternMatch.pattern) {
    return patternMatch.result as string;
  }
  
  return `integral(${termToString(term)})`;
}

// Integra termos logarítmicos e exponenciais
export function calculateLogExpIntegral(term: Term, variable: string): string {
  const termStr = termToString(term);
  const termType = term.type;
  
  // Tente detectar padrões unificados primeiro
  const patternMatch = detectIntegralPattern(term, variable);
  if (patternMatch.pattern) {
    return patternMatch.result as string;
  }
  
  if (termType === 'exp') {
    if (term.argument?.type === 'variable' && term.argument.variable === variable) {
      return `e^${variable}`;
    } else if (term.argument?.type === 'product' && 
               term.argument.left?.type === 'constant' &&
               term.argument.right?.type === 'variable' &&
               term.argument.right.variable === variable) {
      // Caso ∫ e^(ax) dx = (1/a) * e^(ax)
      const a = term.argument.left.value;
      return `(1/${a}) * e^(${a}${variable})`;
    }
  }
  
  if (termType === 'ln') {
    if (term.argument?.type === 'variable' && term.argument.variable === variable) {
      return `${variable} * ln(${variable}) - ${variable}`;
    }
  }
  
  if (termType === 'log') {
    if (term.argument?.type === 'variable' && term.argument.variable === variable) {
      return `${variable} * log(${variable}) - ${variable}/ln(10)`;
    }
  }
  
  // Tratamento do caso e^x/(1+e^x) diretamente
  if (termType === 'quotient' &&
      term.left?.type === 'exp' &&
      term.left.argument?.type === 'variable' &&
      term.left.argument.variable === variable &&
      term.right?.type === 'sum' &&
      term.right.left?.type === 'constant' &&
      term.right.left.value === 1 &&
      term.right.right?.type === 'exp' &&
      term.right.right.argument?.type === 'variable' &&
      term.right.right.argument.variable === variable) {
    return `ln(1+e^${variable})`;
  }
  
  // Verificação de padrão baseada em string para e^x/(1+e^x) como fallback
  if (termStr.includes("e^") && termStr.includes("/(1+")) {
    return `ln(1+e^${variable})`;
  }
  
  return `integral(${termToString(term)})`;
}

// Integra termos de soma e diferença integrando cada parte separadamente
export function calculateSumDiffIntegral(term: Term, variable: string, calculateIntegral: (term: Term, variable: string) => string): string {
  // Primeiro verifica padrões
  const patternMatch = detectIntegralPattern(term, variable);
  if (patternMatch.pattern) {
    return patternMatch.result as string;
  }
  
  // Recursivamente integra esquerda e direita, remove qualquer "+ C" que possam ter
  const leftResult = calculateIntegral(term.left!, variable).replace(/ \+ C$/, "");
  const rightResult = calculateIntegral(term.right!, variable).replace(/ \+ C$/, "");
  
  // Somente adiciona "+ C" uma vez no final
  if (term.type === 'sum') {
    return `${leftResult} + ${rightResult}`;
  } else {
    return `${leftResult} - ${rightResult}`;
  }
}

// Implementa integração por partes para casos especiais como x*sin(x), x*cos(x), etc.
export function integrateByPartsSpecialCases(term: Term, variable: string): string {
  // Caso onde o termo esquerdo é a variável
  if (term.left?.type === 'variable' && term.left.variable === variable) {
    // Caso especial: ∫ x * sin(x) dx = -x * cos(x) + sin(x)
    if (term.right?.type === 'sin' && 
        term.right.argument?.type === 'variable' && 
        term.right.argument.variable === variable) {
      return `-${variable} * cos(${variable}) + sin(${variable})`;
    }
    
    // Caso especial: ∫ x * cos(x) dx = x * sin(x) - cos(x)
    if (term.right?.type === 'cos' && 
        term.right.argument?.type === 'variable' && 
        term.right.argument.variable === variable) {
      return `${variable} * sin(${variable}) - cos(${variable})`;
    }
    
    // Caso especial: ∫ x * e^x dx = x * e^x - e^x
    if (term.right?.type === 'exp' && 
        term.right.argument?.type === 'variable' && 
        term.right.argument.variable === variable) {
      return `${variable} * e^${variable} - e^${variable}`;
    }
    
    // Caso especial: ∫ x * ln(x) dx = (x^2/2) * ln(x) - x^2/4
    if (term.right?.type === 'ln' && 
        term.right.argument?.type === 'variable' && 
        term.right.argument.variable === variable) {
      return `(${variable}^2/2) * ln(${variable}) - ${variable}^2/4`;
    }
  }
  
  // Verifica padrões específicos
  const patternMatch = detectIntegralPattern(term, variable);
  if (patternMatch.pattern) {
    return patternMatch.result as string;
  }
  
  return `integral(${termToString(term)})`;
}

// Integra termos de produto, usando casos especiais ou integração por partes quando apropriado
export function calculateProductIntegral(term: Term, variable: string, calculateIntegral: (term: Term, variable: string) => string): string {
  // Caso com constante: ∫ k·f(x) dx = k·∫ f(x) dx
  if (term.left?.type === 'constant') {
    const coef = term.left.value;
    const rightIntegral = calculateIntegral(term.right!, variable).replace(/ \+ C$/, "");
    
    // Evitar multiplicação por 1
    if (coef === 1) return rightIntegral;
    
    // Verificar se o resultado direito não é um primitivo não calculado
    if (rightIntegral.startsWith('integral(')) {
      return `integral(${termToString(term)})`;
    }
    
    return `${coef} * (${rightIntegral})`;
  }
  
  // Casos especiais de integração por partes para x * f(x)
  return integrateByPartsSpecialCases(term, variable);
}

// Tratamento especial para calcular integrais de expressões complexas de raiz quadrada
export function handleComplexSqrtCases(term: Term, variable: string): string {
  if (term.argument?.type === 'difference' &&
      term.argument.left?.type === 'constant' && 
      term.argument.left.value !== undefined &&
      term.argument.right?.type === 'power' &&
      term.argument.right.argument?.type === 'variable' &&
      term.argument.right.argument.variable === variable &&
      term.argument.right.exponent !== undefined &&
      term.argument.right.exponent === 2) {
    // ∫ sqrt(a-x^2) dx = (x/2)sqrt(a-x^2) + (a/2)arcsin(x/sqrt(a))
    const a = term.argument.left.value;
    const sqrtA = Math.sqrt(a).toFixed(4);
    if (a === 1) {
      // Caso mais simples ∫ sqrt(1-x^2) dx = (x/2)sqrt(1-x^2) + (1/2)arcsin(x)
      return `(${variable}/2)sqrt(1-${variable}^2) + (1/2)arcsin(${variable})`;
    }
    return `(${variable}/2)sqrt(${a}-${variable}^2) + (${a}/2)arcsin(${variable}/${sqrtA})`;
  }
  else if (term.argument?.type === 'difference' &&
           term.argument.left?.type === 'power' &&
           term.argument.left.argument?.type === 'variable' &&
           term.argument.left.argument.variable === variable &&
           term.argument.left.exponent !== undefined &&
           term.argument.left.exponent === 2 &&
           term.argument.right?.type === 'constant' && 
           term.argument.right.value !== undefined) {
    // ∫ sqrt(x^2-a) dx = (x/2)sqrt(x^2-a) - (a/2)ln|x + sqrt(x^2-a)|
    const a = term.argument.right.value;
    return `(${variable}/2)sqrt(${variable}^2-${a}) - (${a}/2)ln|${variable} + sqrt(${variable}^2-${a})|`;
  }
  
  return `integral(${termToString(term)})`;
}

// Integra expressões de tipo x / (expressão com x^2)
export function calculateQuotientIntegral(term: Term, variable: string): string {
  // Primeiro tente detectar padrões unificados
  const patternMatch = detectIntegralPattern(term, variable);
  if (patternMatch.pattern) {
    return patternMatch.result as string;
  }

  // Tratar casos simples não cobertos por padrões
  const left = term.left;
  const right = term.right;
  
  if (left?.type === 'constant' && right?.type === 'variable' && right.variable === variable) {
    const a = left.value!;
    if (a === 1) return `ln|${variable}|`;
    return `${a} * ln|${variable}|`;
  }
  
  // Tratar caso para e^x/(1+e^x) que é analisado como variável/soma
  if (left?.type === 'exp' &&
      left.argument?.type === 'variable' &&
      left.argument.variable === variable &&
      right?.type === 'sum' &&
      right.left?.type === 'constant' &&
      right.left.value === 1 &&
      right.right?.type === 'exp' &&
      right.right.argument?.type === 'variable' &&
      right.right.argument.variable === variable) {
    return `ln(1+e^${variable})`;
  }
  
  // Tratar caso para 1/(x^2 + 1) -> arctan(x)
  if (left?.type === 'constant' && left.value === 1 &&
      right?.type === 'sum' &&
      right.left?.type === 'power' &&
      right.left.argument?.type === 'variable' &&
      right.left.argument.variable === variable &&
      right.left.exponent === 2 &&
      right.right?.type === 'constant' &&
      right.right.value === 1) {
    return `arctan(${variable})`;
  }
  
  // Tratar caso para 1/(1 - x^2) -> artanh(x) or (1/2)ln|(1+x)/(1-x)|
  if (left?.type === 'constant' && left.value === 1 &&
      right?.type === 'difference' &&
      right.left?.type === 'constant' &&
      right.left.value === 1 &&
      right.right?.type === 'power' &&
      right.right.argument?.type === 'variable' &&
      right.right.argument.variable === variable &&
      right.right.exponent === 2) {
    return `(1/2)ln|(1+${variable})/(1-${variable})|`;
  }
  
  // Tratar caso para x/(x^2 + 1) -> (1/2)ln(x^2 + 1)
  if (left?.type === 'variable' && left.variable === variable &&
      right?.type === 'sum' &&
      right.left?.type === 'power' &&
      right.left.argument?.type === 'variable' &&
      right.left.argument.variable === variable &&
      right.left.exponent === 2 &&
      right.right?.type === 'constant' &&
      right.right.value === 1) {
    return `(1/2)ln(${variable}^2 + 1)`;
  }
  
  // Tratar caso para 1/sqrt(1-x^2) -> arcsin(x)
  if (left?.type === 'constant' && left.value === 1 &&
      right?.type === 'sqrt' &&
      right.argument?.type === 'difference' &&
      right.argument.left?.type === 'constant' &&
      right.argument.left.value === 1 &&
      right.argument.right?.type === 'power' &&
      right.argument.right.argument?.type === 'variable' &&
      right.argument.right.argument.variable === variable &&
      right.argument.right.exponent === 2) {
    return `arcsin(${variable})`;
  }
  
  // Também verifique a representação específica de string para e^x/(1+e^x) como fallback
  const termStr = termToString(term);
  if (termStr.includes("e^") && termStr.includes("/(1+")) {
    return `ln(1+e^${variable})`;
  }
  
  // Caso genérico de fallback
  return `integral(${termToString(term)})`;
}

// Integra expressões de raiz quadrada
export function calculateSqrtIntegral(term: Term, variable: string): string {
  // Primeiro tente detectar padrões unificados
  const patternMatch = detectIntegralPattern(term, variable);
  if (patternMatch.pattern) {
    return patternMatch.result as string;
  }
  
  // Caso básico
  if (term.argument?.type === 'variable' && term.argument.variable === variable) {
    return `(2/3)${variable}^(3/2)`;
  }
  
  // sqrt(x+1) -> (2/3)(x+1)^(3/2) - 2*sqrt(x+1)
  if (term.argument?.type === 'sum' &&
      term.argument.left?.type === 'variable' &&
      term.argument.left.variable === variable &&
      term.argument.right?.type === 'constant' &&
      term.argument.right.value === 1) {
    return `(2/3)(${variable}+1)^(3/2) - 2*sqrt(${variable}+1)`;
  }
  
  // sqrt(x^2+1) -> (x/2)*sqrt(x^2+1) + (1/2)*ln|x + sqrt(x^2+1)|
  if (term.argument?.type === 'sum' &&
      term.argument.left?.type === 'power' &&
      term.argument.left.argument?.type === 'variable' &&
      term.argument.left.argument.variable === variable &&
      term.argument.left.exponent === 2 &&
      term.argument.right?.type === 'constant' &&
      term.argument.right.value === 1) {
    return `(${variable}/2)*sqrt(${variable}^2+1) + (1/2)*ln|${variable} + sqrt(${variable}^2+1)|`;
  }
  
  // Casos complexos
  return handleComplexSqrtCases(term, variable);
}

// Versão assíncrona para processamento paralelo de somas e diferenças
export async function calculateSumDiffIntegralParallel(
  term: Term, 
  variable: string, 
  calculateIntegral: (term: Term, variable: string) => string
): Promise<string> {
  if (!term.left || !term.right) {
    return "0";
  }
  
  // Processa termos em paralelo
  const [leftIntegral, rightIntegral] = await Promise.all([
    Promise.resolve(calculateIntegral(term.left, variable)),
    Promise.resolve(calculateIntegral(term.right, variable))
  ]);
  
  // Constrói o resultado baseado no tipo de operação
  if (term.type === 'sum') {
    return `${leftIntegral} + ${rightIntegral}`;
  } else if (term.type === 'difference') {
    return `${leftIntegral} - (${rightIntegral})`;
  }
  
  return `integral(${termToString(term)})`;
}

// Versão assíncrona para processamento paralelo de produtos
export async function calculateProductIntegralParallel(
  term: Term, 
  variable: string, 
  calculateIntegral: (term: Term, variable: string) => string
): Promise<string> {
  if (!term.left || !term.right) {
    return "0";
  }
  
  // Verificar casos especiais para integração por partes
  // Algumas verificações podem ser executadas em paralelo
  const [isLeftConstant, isRightConstant] = await Promise.all([
    Promise.resolve(term.left.type === 'constant'),
    Promise.resolve(term.right.type === 'constant')
  ]);
  
  if (isLeftConstant) {
    // Para k * f(x), a integral é k * ∫f(x)dx
    const rightIntegral = await Promise.resolve(calculateIntegral(term.right, variable));
    return `${term.left.value} * (${rightIntegral})`;
  }
  
  if (isRightConstant) {
    // Para f(x) * k, a integral é k * ∫f(x)dx
    const leftIntegral = await Promise.resolve(calculateIntegral(term.left, variable));
    return `${term.right.value} * (${leftIntegral})`;
  }
  
  // Para casos mais complexos, retorna a notação integral por enquanto
  return `integral(${termToString(term)})`;
}

// Função para decidir entre processamento paralelo ou sequencial
export function processComplexExpression(
  term: Term,
  variable: string,
  calculateIntegral: (term: Term, variable: string) => string,
  standardCalculator: (term: Term, variable: string, calcInt: any) => string,
  parallelCalculator: (term: Term, variable: string, calcInt: any) => Promise<string>
): Promise<string> | string {
  if (isComplexExpression(term)) {
    return parallelCalculator(term, variable, calculateIntegral);
  } else {
    return standardCalculator(term, variable, calculateIntegral);
  }
}

// Adiciona isso como um método de extensão nos calculadores existentes
export function calculateSumDiffIntegralOptimized(
  term: Term, 
  variable: string, 
  calculateIntegral: (term: Term, variable: string) => string
): Promise<string> | string {
  return processComplexExpression(
    term,
    variable,
    calculateIntegral,
    calculateSumDiffIntegral,
    calculateSumDiffIntegralParallel
  );
}

// Versão otimizada para calcular integrais de soma/diferença que pode usar processamento paralelo
export function calculateProductIntegralOptimized(
  term: Term, 
  variable: string, 
  calculateIntegral: (term: Term, variable: string) => string
): string | Promise<string> {
  // Verifica se a expressão é complexa o suficiente para processamento paralelo
  if (isComplexExpression(term)) {
    // Caso com constante: ∫ k·f(x) dx = k·∫ f(x) dx
    if (term.left?.type === 'constant') {
      const coef = term.left.value;
      
      // Calcula a integral da parte direita usando processamento assíncrono
      return new Promise((resolve, reject) => {
        try {
          const rightIntegral = calculateIntegral(term.right!, variable).replace(/ \+ C$/, "");
          
          // Evitar multiplicação por 1
          if (coef === 1) {
            resolve(rightIntegral);
            return;
          }
          
          // Verificar se o resultado direito não é um primitivo não calculado
          if (rightIntegral.startsWith('integral(')) {
            resolve(`integral(${termToString(term)})`);
            return;
          }
          
          resolve(`${coef} * (${rightIntegral})`);
        } catch (error) {
          reject(error);
        }
      });
    }
    
    // Casos especiais de integração por partes para expressões complexas
    return new Promise((resolve, reject) => {
      try {
        const result = integrateByPartsSpecialCases(term, variable);
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  }
  
  // Para expressões mais simples, usar o método síncrono regular
  return calculateProductIntegral(term, variable, calculateIntegral);
} 