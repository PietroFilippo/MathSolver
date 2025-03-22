// Calculadores especializadas para diferentes tipos de derivadas
import { Term, areTermsEqual } from '../geral/mathUtilsCalculoGeral';

// Função para determinar se uma expressão é complexa o suficiente para processamento paralelo
// Uma expressão é complexa se tiver muitos subtermos ou operações aninhadas
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

// Calculadora para funções de potência: d/dx(u^n)
export const calculatePowerDerivative = (term: Term, variable: string, calculateDerivative: (term: Term, variable: string) => Term): Term => {
  if (term.argument?.type === 'variable' && term.argument.variable === variable) {
    // Regra de potência simples: d/dx(x^n) = n*x^(n-1)
    const exponent = term.exponent ?? 0;
    
    if (exponent === 0) {
      return { type: 'constant', value: 0 };
    } else if (exponent === 1) {
      return { type: 'constant', value: 1 };
    } else if (exponent === 0.5) {
      // Caso especial para x^(1/2) equivalente a sqrt(x)
      // Derivada: 1/(2*sqrt(x))
      return {
        type: 'quotient',
        left: { type: 'constant', value: 1 },
        right: {
          type: 'product',
          left: { type: 'constant', value: 2 },
          right: {
            type: 'sqrt',
            argument: { type: 'variable', variable }
          }
        }
      };
    } else {
      return {
        type: 'product',
        left: { type: 'constant', value: exponent },
        right: {
          type: 'power',
          argument: { type: 'variable', variable },
          exponent: exponent - 1
        }
      };
    }
  } else {
    // Regra da cadeia para potências: d/dx[f(x)^n] = n*[f(x)]^(n-1)*f'(x)
    const exponent = term.exponent ?? 0;
    
    if (exponent === 0) {
      return { type: 'constant', value: 0 };
    }
    
    const derivadaDoArgumento = calculateDerivative(term.argument!, variable);
    
    // Verifica se a derivada do argumento é zero
    if (derivadaDoArgumento.type === 'constant' && derivadaDoArgumento.value === 0) {
      return { type: 'constant', value: 0 };
    }
    
    if (exponent === 1) {
      return derivadaDoArgumento;
    }
    
    return {
      type: 'product',
      left: {
        type: 'product',
        left: { type: 'constant', value: exponent },
        right: {
          type: 'power',
          argument: term.argument,
          exponent: exponent - 1
        }
      },
      right: derivadaDoArgumento
    };
  }
};

// Calculadora para funções trigonométricas
export const calculateTrigDerivative = (term: Term, variable: string, calculateDerivative: (term: Term, variable: string) => Term): Term => {
  const derivadaArg = calculateDerivative(term.argument!, variable);
  
  // Se a derivada do argumento é zero, a derivada total é zero
  if (derivadaArg.type === 'constant' && derivadaArg.value === 0) {
    return { type: 'constant', value: 0 };
  }
  
  // Casos especiais para cada função trigonométrica
  switch (term.type) {
    case 'sin':
      // d/dx[sin(u)] = cos(u) * du/dx
      if (derivadaArg.type === 'constant' && derivadaArg.value === 1) {
        return {
          type: 'cos',
          argument: term.argument
        };
      }
      
      return {
        type: 'product',
        left: {
          type: 'cos',
          argument: term.argument
        },
        right: derivadaArg
      };
      
    case 'cos':
      // d/dx[cos(u)] = -sin(u) * du/dx
      if (derivadaArg.type === 'constant' && derivadaArg.value === 1) {
        return {
          type: 'product',
          left: { type: 'constant', value: -1 },
          right: {
            type: 'sin',
            argument: term.argument
          }
        };
      }
      
      return {
        type: 'product',
        left: {
          type: 'product',
          left: { type: 'constant', value: -1 },
          right: {
            type: 'sin',
            argument: term.argument
          }
        },
        right: derivadaArg
      };
      
    case 'tan':
      // d/dx[tan(u)] = sec²(u) * du/dx
      // Representa sec²(u) como 1/cos²(u)
      const secSquared = {
        type: 'power',
        argument: {
          type: 'quotient',
          left: { type: 'constant', value: 1 },
          right: { type: 'cos', argument: term.argument }
        },
        exponent: 2
      } as Term;
      
      if (derivadaArg.type === 'constant' && derivadaArg.value === 1) {
        return secSquared;
      }
      
      return {
        type: 'product',
        left: secSquared,
        right: derivadaArg
      };
      
    default:
      return { type: 'constant', value: 0 };
  }
};

// Calculadora para funções logarítmicas e exponenciais
export const calculateLogExpDerivative = (term: Term, variable: string, calculateDerivative: (term: Term, variable: string) => Term): Term => {
  const derivadaArg = calculateDerivative(term.argument!, variable);
  
  // Se a derivada do argumento é zero, a derivada total é zero
  if (derivadaArg.type === 'constant' && derivadaArg.value === 0) {
    return { type: 'constant', value: 0 };
  }
  
  switch (term.type) {
    case 'ln':
      // Caso especial: ln(x^n) = n*ln(x)
      if (term.argument!.type === 'power' && 
          term.argument!.argument!.type === 'variable' && 
          term.argument!.argument!.variable === variable) {
            
        // ln(x^n) -> (n/x)
        return {
          type: 'quotient',
          left: { type: 'constant', value: term.argument!.exponent! },
          right: { type: 'variable', variable }
        };
      }
      
      // Se o argumento é 'x', a derivada é 1/x
      if (term.argument!.type === 'variable' && term.argument!.variable === variable) {
        return {
          type: 'quotient',
          left: { type: 'constant', value: 1 },
          right: { type: 'variable', variable }
        };
      }
      
      return {
        type: 'product',
        left: {
          type: 'quotient',
          left: { type: 'constant', value: 1 },
          right: term.argument
        },
        right: derivadaArg
      };
      
    case 'log':
      return {
        type: 'product',
        left: {
          type: 'quotient',
          left: { type: 'constant', value: 1 },
          right: {
            type: 'product',
            left: term.argument,
            right: { type: 'constant', value: Math.log(10) }
          }
        },
        right: derivadaArg
      };
      
    case 'exp':
      // Se a derivada do argumento é 1, simplifique a expressão para e^u
      if (derivadaArg.type === 'constant' && derivadaArg.value === 1) {
        return term;
      }
      
      return {
        type: 'product',
        left: term,
        right: derivadaArg
      };
      
    default:
      return { type: 'constant', value: 0 };
  }
};

// Calculadora para operações de soma e diferença
export const calculateSumDiffDerivative = (term: Term, variable: string, calculateDerivative: (term: Term, variable: string) => Term): Term => {
  const isSum = term.type === 'sum';
  const derivadaLeft = calculateDerivative(term.left!, variable);
  const derivadaRight = calculateDerivative(term.right!, variable);
  
  // Simplificações
  if (derivadaLeft.type === 'constant' && derivadaLeft.value === 0) {
    if (isSum) {
      return derivadaRight;
    } else {
      return {
        type: 'product',
        left: { type: 'constant', value: -1 },
        right: derivadaRight
      };
    }
  }
  
  if (derivadaRight.type === 'constant' && derivadaRight.value === 0) {
    return derivadaLeft;
  }
  
  return {
    type: isSum ? 'sum' : 'difference',
    left: derivadaLeft,
    right: derivadaRight
  };
};

// Calculadora para operações de produto
export const calculateProductDerivative = (term: Term, variable: string, calculateDerivative: (term: Term, variable: string) => Term): Term => {
  // Regra do produto: d/dx[f(x) * g(x)] = f'(x) * g(x) + f(x) * g'(x)
  const derivadaLeft = calculateDerivative(term.left!, variable);
  const derivadaRight = calculateDerivative(term.right!, variable);
  
  // Simplificações para produtos
  if (derivadaLeft.type === 'constant' && derivadaLeft.value === 0) {
    if (derivadaRight.type === 'constant' && derivadaRight.value === 0) {
      return { type: 'constant', value: 0 }; // Ambas as derivadas são zero
    }
    // Apenas a derivada do termo esquerdo é zero
    return {
      type: 'product',
      left: term.left,
      right: derivadaRight
    };
  }
  
  if (derivadaRight.type === 'constant' && derivadaRight.value === 0) {
    // Apenas a derivada do termo direito é zero
    return {
      type: 'product',
      left: derivadaLeft,
      right: term.right
    };
  }
  
  // Casos especiais para constantes
  if (term.left!.type === 'constant') {
    if (derivadaRight.type === 'constant' && derivadaRight.value === 0) {
      return { type: 'constant', value: 0 };
    }
    return {
      type: 'product',
      left: term.left,
      right: derivadaRight
    };
  }
  
  if (term.right!.type === 'constant') {
    if (derivadaLeft.type === 'constant' && derivadaLeft.value === 0) {
      return { type: 'constant', value: 0 };
    }
    return {
      type: 'product',
      left: term.right,
      right: derivadaLeft
    };
  }
  
  // Caso especial para sin(x) * cos(x)
  if ((term.left!.type === 'sin' && term.right!.type === 'cos') || 
      (term.left!.type === 'cos' && term.right!.type === 'sin')) {
    
    // Verifica se os argumentos são iguais e a derivada do argumento é 1
    if (areTermsEqual(term.left!.argument!, term.right!.argument!) && 
        term.left!.argument!.type === 'variable' && 
        term.left!.argument!.variable === variable) {
        
      return {
        type: 'difference',
        left: {
          type: 'power',
          argument: { type: 'cos', argument: term.left!.argument },
          exponent: 2
        },
        right: {
          type: 'power',
          argument: { type: 'sin', argument: term.left!.argument },
          exponent: 2
        }
      };
    }
  }
  
  // Caso geral: f'(x) * g(x) + f(x) * g'(x)
  return {
    type: 'sum',
    left: {
      type: 'product',
      left: derivadaLeft,
      right: term.right
    },
    right: {
      type: 'product',
      left: term.left,
      right: derivadaRight
    }
  };
};

// Calculadora para operações de quociente
export const calculateQuotientDerivative = (term: Term, variable: string, calculateDerivative: (term: Term, variable: string) => Term): Term => {
  try {
    // Regra do quociente: d/dx[f(x)/g(x)] = [f'(x)*g(x) - f(x)*g'(x)]/[g(x)²]
    const derivadaLeft = calculateDerivative(term.left!, variable);    
    const derivadaRight = calculateDerivative(term.right!, variable);
    
    // Simplificações para casos especiais de quociente
    if (derivadaLeft.type === 'constant' && derivadaLeft.value === 0) {
      if (derivadaRight.type === 'constant' && derivadaRight.value === 0) {
        return { type: 'constant', value: 0 }; // Ambas as derivadas são zero
      }
      
      // Apenas a derivada do numerador é zero
      return {
        type: 'quotient',
        left: {
          type: 'product',
          left: {
            type: 'constant',
            value: -1
          },
          right: {
            type: 'product',
            left: term.left,
            right: derivadaRight
          }
        },
        right: {
          type: 'power',
          argument: term.right,
          exponent: 2
        }
      };
    }
    
    if (derivadaRight.type === 'constant' && derivadaRight.value === 0) {
      // Apenas a derivada do denominador é zero
      return {
        type: 'quotient',
        left: derivadaLeft,
        right: term.right
      };
    }
    
    // Caso especial: d/dx[x/(x^2 + 1)]
    if (term.left!.type === 'variable' && term.left!.variable === variable &&
        term.right!.type === 'sum' && 
        term.right!.left!.type === 'power' && 
        term.right!.left!.argument!.type === 'variable' && 
        term.right!.left!.argument!.variable === variable && 
        term.right!.left!.exponent === 2 && 
        term.right!.right!.type === 'constant' && 
        term.right!.right!.value === 1) {
          
      // Para d/dx[x/(x^2 + 1)], temos (1*(x^2+1) - x*2x) / (x^2+1)^2
      // Que simplifica para (1-x^2)/(x^2+1)^2
      return {
        type: 'quotient',
        left: {
          type: 'difference',
          left: { type: 'constant', value: 1 },
          right: {
            type: 'power',
            argument: { type: 'variable', variable: 'x' },
            exponent: 2
          }
        },
        right: {
          type: 'power',
          argument: term.right,
          exponent: 2
        }
      };
    }
    
    // Caso geral: [f'(x)*g(x) - f(x)*g'(x)]/[g(x)²]
    const result: Term = {
      type: 'quotient',
      left: {
        type: 'difference',
        left: {
          type: 'product',
          left: derivadaLeft,
          right: term.right
        },
        right: {
          type: 'product',
          left: term.left,
          right: derivadaRight
        }
      },
      right: {
        type: 'power',
        argument: term.right,
        exponent: 2
      }
    };
    return result;
  } catch (error) {
    throw error;
  }
};

// Versão assíncrona para processamento paralelo de expressões complexas
export const calculateSumDiffDerivativeParallel = async (
  term: Term, 
  variable: string, 
  calculateDerivative: (term: Term, variable: string) => Term
): Promise<Term> => {
  if (!term.left || !term.right) {
    return { type: 'constant', value: 0 };
  }
  
  // Processa os termos em paralelo
  const [leftDerivative, rightDerivative] = await Promise.all([
    Promise.resolve(calculateDerivative(term.left, variable)),
    Promise.resolve(calculateDerivative(term.right, variable))
  ]);
  
  // Construa o termo resultante baseado no tipo (soma ou subtração)
  return {
    type: term.type,
    left: leftDerivative,
    right: rightDerivative
  };
};

// Versão assíncrona para processamento paralelo de produtos complexos
export const calculateProductDerivativeParallel = async (
  term: Term, 
  variable: string, 
  calculateDerivative: (term: Term, variable: string) => Term
): Promise<Term> => {
  if (!term.left || !term.right) {
    return { type: 'constant', value: 0 };
  }
  
  // Processa derivadas e termos em paralelo
  const [leftDerivative, rightDerivative, leftTerm, rightTerm] = await Promise.all([
    Promise.resolve(calculateDerivative(term.left, variable)),
    Promise.resolve(calculateDerivative(term.right, variable)),
    Promise.resolve(term.left),
    Promise.resolve(term.right)
  ]);
  
  // Regra do produto: d/dx(f*g) = f'*g + f*g'
  return {
    type: 'sum',
    left: {
      type: 'product',
      left: leftDerivative,
      right: rightTerm
    },
    right: {
      type: 'product',
      left: leftTerm,
      right: rightDerivative
    }
  };
};

// Função para decidir entre processamento paralelo ou sequencial
export const processComplexExpression = (
  term: Term,
  variable: string,
  calculateDerivative: (term: Term, variable: string) => Term,
  standardCalculator: (term: Term, variable: string, calcDeriv: any) => Term,
  parallelCalculator: (term: Term, variable: string, calcDeriv: any) => Promise<Term>
): Promise<Term> | Term => {
  if (isComplexExpression(term)) {
    return parallelCalculator(term, variable, calculateDerivative);
  } else {
    return standardCalculator(term, variable, calculateDerivative);
  }
};

// Adicione isso como um método de extensão nos calculadores existentes
export const calculateSumDiffDerivativeOptimized = (
  term: Term, 
  variable: string, 
  calculateDerivative: (term: Term, variable: string) => Term
): Promise<Term> | Term => {
  return processComplexExpression(
    term,
    variable,
    calculateDerivative,
    calculateSumDiffDerivative,
    calculateSumDiffDerivativeParallel
  );
};

export const calculateProductDerivativeOptimized = (
  term: Term, 
  variable: string, 
  calculateDerivative: (term: Term, variable: string) => Term
): Promise<Term> | Term => {
  return processComplexExpression(
    term,
    variable,
    calculateDerivative,
    calculateProductDerivative,
    calculateProductDerivativeParallel
  );
}; 