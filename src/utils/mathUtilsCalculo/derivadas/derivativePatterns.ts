// Contém definições de padrões para cálculos de derivadas
import { Term, termToString, detectSpecialMathPattern } from '../geral/mathUtilsCalculoGeral';

// Interface para definições de padrões de derivada
export interface DerivativePattern {
  name: string;
  detectTerm: (term: Term, variable: string) => boolean;
  detectString: (expression: string, variable: string) => boolean;
  getResult: (term: Term | string, variable: string) => string;
}

// Registro unificado de padrões de derivada
export const derivativePatterns: DerivativePattern[] = [
  // e^x -> e^x
  {
    name: "e^x",
    detectTerm: (term, variable) => {
      return term.type === 'exp' && 
             term.argument?.type === 'variable' && 
             term.argument.variable === variable;
    },
    detectString: (expression, variable) => {
      return expression === `e^${variable}` || 
             expression === `e^(${variable})`;
    },
    getResult: (_, variable) => `e^${variable}`
  },
  
  // sin(x) -> cos(x)
  {
    name: "sin(x)",
    detectTerm: (term, variable) => {
      return term.type === 'sin' && 
             term.argument?.type === 'variable' && 
             term.argument.variable === variable;
    },
    detectString: (expression, variable) => {
      return expression === `sin(${variable})`;
    },
    getResult: (_, variable) => `cos(${variable})`
  },
  
  // cos(x) -> -sin(x)
  {
    name: "cos(x)",
    detectTerm: (term, variable) => {
      return term.type === 'cos' && 
             term.argument?.type === 'variable' && 
             term.argument.variable === variable;
    },
    detectString: (expression, variable) => {
      return expression === `cos(${variable})`;
    },
    getResult: (_, variable) => `-sin(${variable})`
  },
  
  // tan(x) -> sec^2(x)
  {
    name: "tan(x)",
    detectTerm: (term, variable) => {
      return term.type === 'tan' && 
             term.argument?.type === 'variable' && 
             term.argument.variable === variable;
    },
    detectString: (expression, variable) => {
      return expression === `tan(${variable})`;
    },
    getResult: (_, variable) => `1/cos(${variable})^2`
  },
  
  // ln(x) -> 1/x
  {
    name: "ln(x)",
    detectTerm: (term, variable) => {
      return term.type === 'ln' && 
             term.argument?.type === 'variable' && 
             term.argument.variable === variable;
    },
    detectString: (expression, variable) => {
      return expression === `ln(${variable})`;
    },
    getResult: (_, variable) => `1/${variable}`
  },
  
  // x^n -> n*x^(n-1)
  {
    name: "x^n",
    detectTerm: (term, variable) => {
      return term.type === 'power' && 
             term.argument?.type === 'variable' && 
             term.argument.variable === variable &&
             term.exponent !== undefined;
    },
    detectString: (expression, variable) => {
      // Handles both simple exponents like x^2 and fractional exponents like x^(1/2)
      const simplePattern = new RegExp(`^${variable}\\^(\\d+(\\.\\d+)?)$`);
      const fractionPattern = new RegExp(`^${variable}\\^\\((\\d+)\\/(\\d+)\\)$`);
      return simplePattern.test(expression) || fractionPattern.test(expression);
    },
    getResult: (term, variable) => {
      let exponent = 0;
      
      if (typeof term === 'string') {
        const fractionMatch = term.match(/^.*\^\\?\((\d+)\/(\d+)\)$/);
        if (fractionMatch) {
          // Handle fractional exponent like x^(1/2)
          const numerator = parseInt(fractionMatch[1]);
          const denominator = parseInt(fractionMatch[2]);
          exponent = numerator / denominator;
        } else {
          // Handle regular exponent
          const match = term.split('^');
          if (match.length > 1) {
            exponent = parseFloat(match[1].replace(/[()]/g, ''));
          }
        }
      } else {
        exponent = (term as Term).exponent || 0;
      }
      
      if (exponent === 0) return "0";
      if (exponent === 1) return "1";
      
      // For fractional exponents like x^(1/2), create a more readable result
      if (exponent === 0.5) {
        return `1/(2*sqrt(${variable}))`;
      }
      
      return `${exponent} * ${variable}^${exponent - 1}`;
    }
  },
  
  // sqrt(x) -> 1/(2*sqrt(x))
  {
    name: "sqrt(x)",
    detectTerm: (term, variable) => {
      return term.type === 'sqrt' && 
             term.argument?.type === 'variable' && 
             term.argument.variable === variable;
    },
    detectString: (expression, variable) => {
      return expression === `sqrt(${variable})` || expression === `sqrt${variable}`;
    },
    getResult: (_, variable) => {
      return `1/(2*sqrt(${variable}))`;
    }
  },
  
  // sin(x) * cos(x) -> cos(x)^2 - sin(x)^2
  {
    name: "sin(x)*cos(x)",
    detectTerm: (term, variable) => {
      if (term.type !== 'product') return false;
      
      return (term.left?.type === 'sin' && term.right?.type === 'cos' && 
              term.left.argument?.type === 'variable' && term.left.argument.variable === variable &&
              term.right.argument?.type === 'variable' && term.right.argument.variable === variable) ||
             (term.left?.type === 'cos' && term.right?.type === 'sin' && 
              term.left.argument?.type === 'variable' && term.left.argument.variable === variable &&
              term.right.argument?.type === 'variable' && term.right.argument.variable === variable);
    },
    detectString: (expression, variable) => {
      return expression === `sin(${variable}) * cos(${variable})` || 
             expression === `cos(${variable}) * sin(${variable})`;
    },
    getResult: (_, variable) => `cos(${variable})^2 - sin(${variable})^2`
  },
  
  // x/(x^2+1) -> (1-x^2)/(x^2+1)^2
  {
    name: "x/(x^2+1)",
    detectTerm: (term, variable) => {
      if (term.type !== 'quotient' || 
          term.left?.type !== 'variable' || 
          term.left.variable !== variable ||
          term.right?.type !== 'sum') return false;
      
      const right = term.right;
      
      // Check for x^2 term in left or right of sum
      const hasPowerTerm = 
        (right.left?.type === 'power' && 
         right.left.argument?.type === 'variable' && 
         right.left.argument.variable === variable && 
         right.left.exponent === 2) ||
        (right.right?.type === 'power' && 
         right.right.argument?.type === 'variable' && 
         right.right.argument.variable === variable && 
         right.right.exponent === 2);
         
      // Check for constant 1 in left or right of sum
      const hasConstantOne = 
        (right.left?.type === 'constant' && right.left.value === 1) ||
        (right.right?.type === 'constant' && right.right.value === 1);
        
      return hasPowerTerm && hasConstantOne;
    },
    detectString: (expression, variable) => {
      const pattern = new RegExp(`^${variable}\\s*\\/\\s*\\(\\s*${variable}\\s*\\^\\s*2\\s*\\+\\s*1\\s*\\)$`);
      return pattern.test(expression) || expression === `${variable}/(${variable}^2+1)`;
    },
    getResult: (_, variable) => `(1-${variable}^2)/(${variable}^2+1)^2`
  }
];

// Função de detecção de padrões principal
export const detectDerivativePattern = (term: Term | string, variable: string): { pattern: DerivativePattern | null, result: string | null } => {
  const termStr = typeof term === 'string' ? term : termToString(term);
  
  // Verifica cada padrão no registro
  for (const pattern of derivativePatterns) {
    let matched = false;
    
    // Tenta a detecção baseada em termo primeiro se tivermos um objeto Term
    if (typeof term !== 'string' && pattern.detectTerm) {
      matched = pattern.detectTerm(term as Term, variable);
    }
    
    // Se a detecção baseada em termo falhou ou não estava disponível, tenta a detecção baseada em string
    if (!matched && pattern.detectString) {
      matched = pattern.detectString(termStr, variable);
    }
    
    if (matched) {
      const result = pattern.getResult(term, variable);
      return { pattern, result };
    }
  }
  
  return { pattern: null, result: null };
};

// Detecção simplificada de padrões para uso no calculador de derivada principal
export const detectSpecialPattern = (term: Term, termStr: string, variable: string): string | null => {
  // Use o registro de padrões unificado
  const patternMatch = detectDerivativePattern(term, variable);
  if (patternMatch.pattern) {
    return patternMatch.result as string;
  }
  
  // Verifica padrões especiais via método compartilhado
  const sharedPatternResult = detectSpecialMathPattern(term, termStr, variable, 'derivative');
  if (sharedPatternResult) {
    return sharedPatternResult;
  }
  
  return null;
}; 