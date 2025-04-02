// ===================================================
// ========= MÓDULO DE ÁLGEBRA - EXEMPLOS ============
// ===================================================

// Define exemlos para teste e documentação
export const algebraicCases: {
  simplification: { [key: string]: string };
  expansion: { [key: string]: string };
  factorization: { [key: string]: string };
  quadratics: { [key: string]: string };
  logarithms: { [key: string]: string };
  exponentiation: { [key: string]: string };
  linearSystems: { [key: string]: string };
} = {
  simplification: {
    // Formatos originais
    '2x + 3x': '5x',
    '2*x + 3*x': '5x',
    '2(x + 3) - 5x': '-3x + 6',
    '2*(x + 3) - 5*x': '-3x + 6',
    '2x + 2y + 2': '2(x + y + 1)',
    '2*x + 2*y + 2': '2(x + y + 1)',
    'x^2 + 2x + 1': '(x + 1)^2',
    'x**2 + 2*x + 1': '(x + 1)^2',
    '4x^2 + 4x + 1': '(2x + 1)^2',
    '4*x**2 + 4*x + 1': '(2x + 1)^2',
    'x^2 - 1': '(x + 1)(x - 1)',
    'x**2 - 1': '(x + 1)(x - 1)',
    'x^2 - 2x + 1': '(x - 1)^2',
    'x**2 - 2*x + 1': '(x - 1)^2',
    
    // Formatos normalizados (com espaços)
    '2 x + 3 x': '5x',
    '2 * x + 3 * x': '5x',
    '2 ( x + 3 ) - 5 x': '-3x + 6',
    '2 * ( x + 3 ) - 5 * x': '-3x + 6',
    '2 x + 2 y + 2': '2(x + y + 1)',
    '2 * x + 2 * y + 2': '2(x + y + 1)',
    'x ^ 2 + 2 x + 1': '(x + 1)^2',
    'x ** 2 + 2 * x + 1': '(x + 1)^2',
    '4 x ^ 2 + 4 x + 1': '(2x + 1)^2',
    '4 * x ** 2 + 4 * x + 1': '(2x + 1)^2',
    'x ^ 2 - 1': '(x + 1)(x - 1)',
    'x ** 2 - 1': '(x + 1)(x - 1)',
    'x ^ 2 - 2 x + 1': '(x - 1)^2',
    'x ** 2 - 2 * x + 1': '(x - 1)^2'
  },
  expansion: {
    // Formatos originais
    '(x + 2)(x + 3)': 'x^2 + 5x + 6',
    '(x + 2)*(x + 3)': 'x^2 + 5x + 6',
    '(x - 1)(x + 1)': 'x^2 - 1',
    '(x - 1)*(x + 1)': 'x^2 - 1',
    '(x + 1)^2': 'x^2 + 2x + 1',
    '(x + 1)**2': 'x^2 + 2x + 1',
    '(2x + 1)(3x - 2)': '6x^2 - x - 2',
    '(2*x + 1)*(3*x - 2)': '6x^2 - x - 2',
    
    // Formatos normalizados
    '( x + 2 ) ( x + 3 )': 'x^2 + 5x + 6',
    '( x + 2 ) * ( x + 3 )': 'x^2 + 5x + 6',
    '( x - 1 ) ( x + 1 )': 'x^2 - 1',
    '( x - 1 ) * ( x + 1 )': 'x^2 - 1',
    '( x + 1 ) ^ 2': 'x^2 + 2x + 1',
    '( x + 1 ) ** 2': 'x^2 + 2x + 1',
    '( 2 x + 1 ) ( 3 x - 2 )': '6x^2 - x - 2',
    '( 2 * x + 1 ) * ( 3 * x - 2 )': '6x^2 - x - 2'
  },
  factorization: {
    // Formatos originais
    'x^2 + 3x + 2': '(x + 1)(x + 2)',
    'x**2 + 3*x + 2': '(x + 1)(x + 2)',
    'x^2 - 4': '(x + 2)(x - 2)',
    'x**2 - 4': '(x + 2)(x - 2)',
    'x^2 + 2xy + y^2': '(x + y)^2',
    'x**2 + 2*x*y + y**2': '(x + y)^2',
    'x^2 - y^2': '(x + y)(x - y)',
    'x**2 - y**2': '(x + y)(x - y)',
    '4x + 2': '4x + 2',
    '4*x + 2': '4x + 2',
    
    // Formatos normalizados
    'x ^ 2 + 3 x + 2': '(x + 1)(x + 2)',
    'x ** 2 + 3 * x + 2': '(x + 1)(x + 2)',
    'x ^ 2 - 4': '(x + 2)(x - 2)',
    'x ** 2 - 4': '(x + 2)(x - 2)',
    'x ^ 2 + 2 x y + y ^ 2': '(x + y)^2',
    'x ** 2 + 2 * x * y + y ** 2': '(x + y)^2',
    'x ^ 2 - y ^ 2': '(x + y)(x - y)',
    'x ** 2 - y ** 2': '(x + y)(x - y)',
    '4 x + 2': '4x + 2',
    '4 * x + 2': '4x + 2'
  },
  quadratics: {
    'x^2 + 5x + 6': '(x + 2)(x + 3)',
    'x^2 - 7x + 12': '(x - 3)(x - 4)',
    '2x^2 + 5x - 3': '(2x - 1)(x + 3)',
    '3x^2 - 12': '3(x^2 - 4) = 3(x + 2)(x - 2)'
  },
  logarithms: {
    'log(x) + log(y)': 'log(x*y)',
    'log(x) - log(y)': 'log(x/y)',
    '2*log(x)': 'log(x^2)',
    'log(x^n)': 'n*log(x)'
  },
  exponentiation: {
    'e^(x+y)': 'e^x * e^y',
    'x^a * x^b': 'x^(a+b)',
    '(x^a)^b': 'x^(a*b)',
    'x^n / x^m': 'x^(n-m)'
  },
  linearSystems: {
    'x + y = 5, 2x - y = 3': 'x = 2.67, y = 2.33',
    '3x + 2y = 12, x - y = 1': 'x = 2, y = 3'
  }
};

// Funções de exemplos consolidadas
export const getAlgebraicSimplificationExamples = (): string[] => {
  // Retorna apenas o formato padrão das expressões - sem duplicatas
  return [
    '2x + 3x',
    '2(x + 3) - 5x',
    '2x + 2y + 2',
    'x^2 + 2x + 1',
    '4x^2 + 4x + 1',
    'x^2 - 1',
    'x^2 - 2x + 1'
  ];
};

export const getAlgebraicExpansionExamples = (): string[] => {
  // Retorna apenas o formato padrão das expressões - sem duplicatas
  return [
    '(x + 2)(x + 3)',
    '(x - 1)(x + 1)',
    '(x + 1)^2',
    '(2x + 1)(3x - 2)'
  ];
};

export const getAlgebraicFactorizationExamples = (): string[] => {
  // Retorna apenas o formato padrão das expressões - sem duplicatas
  return [
    'x^2 + 3x + 2',
    'x^2 - 4',
    'x^2 + 2xy + y^2',
    'x^2 - y^2',
    '4x + 2',
  ];
};

export const getQuadraticExamples = (): { a: number; b: number; c: number; description: string }[] => {
  return [
    { a: 1, b: 5, c: 6, description: 'x^2 + 5x + 6' },
    { a: 1, b: -7, c: 12, description: 'x^2 - 7x + 12' },
    { a: 2, b: 5, c: -3, description: '2x^2 + 5x - 3' },
    { a: 3, b: 0, c: -12, description: '3x^2 - 12' },
    { a: 1, b: 2, c: 1, description: 'x^2 + 2x + 1' },
    { a: 1, b: -6, c: 9, description: 'x^2 - 6x + 9' },
    { a: 4, b: 4, c: 1, description: '4x^2 + 4x + 1' },
    { a: 1, b: 0, c: -4, description: 'x^2 - 4' }
  ];
};

export const getLogarithmExamples = (): { 
  type: 'natural' | 'base10' | 'custom';
  value: number;
  base?: number;
  description: string 
}[] => {
  return [
    // Natural logarimos (ln)
    { type: 'natural', value: 2.718, description: 'ln(e) = 1' },
    { type: 'natural', value: 7.389, description: 'ln(7.389)' },
    { type: 'natural', value: 1, description: 'ln(1) = 0' },
    { type: 'natural', value: 10, description: 'ln(10)' },
    { type: 'natural', value: 0.5, description: 'ln(0.5)' },
    
    // Base 10 logarimos (log₁₀)
    { type: 'base10', value: 100, description: 'log₁₀(100) = 2' },
    { type: 'base10', value: 1000, description: 'log₁₀(1000) = 3' },
    { type: 'base10', value: 10, description: 'log₁₀(10) = 1' },
    { type: 'base10', value: 0.01, description: 'log₁₀(0.01) = -2' },
    { type: 'base10', value: 50, description: 'log₁₀(50)' },
    
    // Custom base logarimos
    { type: 'custom', value: 8, base: 2, description: 'log₂(8) = 3' },
    { type: 'custom', value: 81, base: 3, description: 'log₃(81) = 4' },
    { type: 'custom', value: 16, base: 4, description: 'log₄(16) = 2' },
    { type: 'custom', value: 32, base: 2, description: 'log₂(32) = 5' },
    { type: 'custom', value: 0.125, base: 2, description: 'log₂(1/8) = -3' }
  ];
};

export const getExponentiationExamples = (): { 
  type: 'exponenciacao' | 'radicacao';
  base?: number;
  expoente?: number;
  radicando?: number;
  indiceRaiz?: number;
  description: string 
}[] => {
  return [
    // Potências (base^expoente)
    { type: 'exponenciacao', base: 2, expoente: 3, description: '2^3 = 8' },
    { type: 'exponenciacao', base: 10, expoente: 2, description: '10^2 = 100' },
    { type: 'exponenciacao', base: 3, expoente: 4, description: '3^4 = 81' },
    { type: 'exponenciacao', base: 5, expoente: 2, description: '5^2 = 25' },
    { type: 'exponenciacao', base: 2, expoente: -3, description: '2^(-3) = 1/8' },
    { type: 'exponenciacao', base: 4, expoente: 1.5, description: '4^(3/2) = 8' },
    { type: 'exponenciacao', base: 9, expoente: 0.5, description: '9^(1/2) = 3' },

    // Raízes (ⁿ√x)
    { type: 'radicacao', radicando: 9, indiceRaiz: 2, description: '√9 = 3' },
    { type: 'radicacao', radicando: 8, indiceRaiz: 3, description: '∛8 = 2' },
    { type: 'radicacao', radicando: 16, indiceRaiz: 4, description: '⁴√16 = 2' },
    { type: 'radicacao', radicando: 27, indiceRaiz: 3, description: '∛27 = 3' },
    { type: 'radicacao', radicando: 32, indiceRaiz: 5, description: '⁵√32 = 2' },
    { type: 'radicacao', radicando: 100, indiceRaiz: 2, description: '√100 = 10' },
    { type: 'radicacao', radicando: 81, indiceRaiz: 2, description: '√81 = 9' }
  ];
};

export const getLinearExamples = (): { a: number; b: number; c: number; description: string }[] => {
  return [
    { a: 1, b: 5, c: 9, description: 'x + 5 = 9' },
    { a: 2, b: -3, c: 7, description: '2x - 3 = 7' },
    { a: 0.75, b: 2, c: 5, description: '3x/4 + 2 = 5' },
    { a: -1, b: 5, c: 2, description: '5 - x = 2' },
    { a: 3, b: 0, c: 12, description: '3x = 12' },
    { a: 5, b: 10, c: 0, description: '5x + 10 = 0' },
    { a: 1.5, b: -4.5, c: 3, description: '1.5x - 4.5 = 3' },
    { a: -2, b: -6, c: -10, description: '-2x - 6 = -10' }
  ];
};

export const getLinearSystemExamples = (): { 
  a1: number; b1: number; c1: number; 
  a2: number; b2: number; c2: number; 
  description: string 
}[] => {
  return [
    { 
      a1: 1, b1: 1, c1: 5, 
      a2: 2, b2: -1, c2: 3, 
      description: 'x + y = 5, 2x - y = 3' 
    },
    { 
      a1: 3, b1: 2, c1: 12, 
      a2: 1, b2: -1, c2: 1, 
      description: '3x + 2y = 12, x - y = 1' 
    },
    { 
      a1: 4, b1: 2, c1: 8, 
      a2: 2, b2: 1, c2: 4, 
      description: '4x + 2y = 8, 2x + y = 4' 
    },
    { 
      a1: 5, b1: 3, c1: 9, 
      a2: -2, b2: 4, c2: 10, 
      description: '5x + 3y = 9, -2x + 4y = 10' 
    },
    { 
      a1: 7, b1: -3, c1: 11, 
      a2: 2, b2: 5, c2: 1, 
      description: '7x - 3y = 11, 2x + 5y = 1' 
    },
    { 
      a1: 1, b1: 1, c1: 3, 
      a2: 2, b2: 2, c2: 6, 
      description: 'x + y = 3, 2x + 2y = 6 (infinitas soluções)' 
    },
    { 
      a1: 2, b1: 3, c1: 7, 
      a2: 2, b2: 3, c2: 8, 
      description: '2x + 3y = 7, 2x + 3y = 8 (sem solução)' 
    }
  ];
}; 