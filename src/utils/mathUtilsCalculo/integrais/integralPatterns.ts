// Contém definições de padrões para cálculos de integrais
import { Term, termToString } from '../geral/mathUtilsCalculoGeral';

// Interface para detecção e cálculo de padrões de integrais
export interface IntegralPattern {
  name: string;
  detectTerm?: (term: Term, variable: string) => boolean;
  detectString?: (expression: string, variable: string) => boolean;
  getResult: (term: Term | string, variable: string) => string;
}

// Função auxiliar para verificar padrões diretamente na estrutura Term
// Evita a conversão inicial para string para casos comuns
export const findMatchingPattern = (term: Term, variable: string): { result: string } | null => {
  // Verifica padrões comuns diretamente na estrutura do termo
  for (const pattern of integralPatterns) {
    if (pattern.detectTerm && pattern.detectTerm(term, variable)) {
      const result = pattern.getResult(term, variable);
      if (result) {
        return { result };
      }
    }
  }
  return null;
};

// Detecta padrões de integração e retorna o resultado
export function detectIntegralPattern(term: Term | string, variable: string): { pattern: IntegralPattern | null; result: string | null } {
  try {
    // Primeiro, tente a detecção baseada em estrutura para termos
    if (typeof term !== 'string') {
      const structureMatch = findMatchingPattern(term, variable);
      if (structureMatch) {
        return { 
          pattern: { 
            name: 'direct-match', 
            getResult: () => structureMatch.result 
          }, 
          result: structureMatch.result 
        };
      }
      
      // Converte para string apenas se necessário
      const termStr = termToString(term);
      
      // Agora tente baseado em string para os padrões que usam detectString
      for (const pattern of integralPatterns) {
        if (pattern.detectString && pattern.detectString(termStr, variable)) {
          const result = pattern.getResult(term, variable);
          return { pattern, result };
        }
      }
      
      return { pattern: null, result: null };
    } else {
      // Se for uma string, tente apenas os padrões baseados em string
      for (const pattern of integralPatterns) {
        if (pattern.detectString && pattern.detectString(term, variable)) {
          const result = pattern.getResult(term, variable);
          return { pattern, result };
        }
      }
      
      return { pattern: null, result: null };
    }
  } catch (error) {
    return { pattern: null, result: null };
  }
}

// Array de padrões de integrais para integrais comuns
export const integralPatterns: IntegralPattern[] = [
  // Padrão x^(-1) -> ln|x|
  {
    name: "x^(-1)",
    detectTerm: (term: Term, variable: string) => {
      return term.type === 'power' && 
             term.argument?.type === 'variable' && 
             term.argument.variable === variable &&
             (term.exponent === -1 || 
              (typeof term.exponent === 'string' && parseFloat(term.exponent) === -1));
    },
    detectString: (expression: string, variable: string) => {
      // Padrões como x^(-1), x^-1, etc.
      const pattern1 = new RegExp(`^${variable}\\s*\\^\\s*\\(\\s*-\\s*1\\s*\\)$`);
      const pattern2 = new RegExp(`^${variable}\\s*\\^\\s*-\\s*1$`);
      return pattern1.test(expression) || pattern2.test(expression) || 
             expression === `${variable}^(-1)` || expression === `${variable}^-1`;
    },
    getResult: (_: Term | string, variable: string) => `ln|${variable}|`
  },
  
  // Padrão e^x/(1+e^x) -> ln(1+e^x)
  {
    name: "e^x/(1+e^x)",
    detectTerm: (term: Term, variable: string) => {
      // Verifica a estrutura de quociente
      if (term.type === 'quotient') {
        // Caso 1: e^x/(1+e^x)
        if (term.left?.type === 'exp' && 
            term.left.argument?.type === 'variable' && 
            term.left.argument.variable === variable &&
            term.right?.type === 'sum' &&
            term.right.left?.type === 'constant' && 
            term.right.left.value === 1 &&
            term.right.right?.type === 'exp' &&
            term.right.right.argument?.type === 'variable' &&
            term.right.right.argument.variable === variable) {
          return true;
        }
      }
      return false;
    },
    detectString: (expression: string, variable: string) => {
      // Padrões variados de e^x/(1+e^x)
      const pattern1 = new RegExp(`^e\\s*\\^\\s*${variable}\\s*\\/\\s*\\(\\s*1\\s*\\+\\s*e\\s*\\^\\s*${variable}\\s*\\)$`);
      const pattern2 = new RegExp(`^\\(e\\s*\\^\\s*${variable}\\)\\s*\\/\\s*\\(\\s*1\\s*\\+\\s*e\\s*\\^\\s*${variable}\\s*\\)$`);
      return pattern1.test(expression) || pattern2.test(expression) || 
             expression.includes(`e^${variable}`) && expression.includes("/(1+");
    },
    getResult: (_: Term | string, variable: string) => `ln(1+e^${variable})`
  },
  
  // Padrão 1/x -> ln|x|
  {
    name: "1/x",
    detectTerm: (term: Term, variable: string) => {
      return term.type === 'quotient' && 
             term.left?.type === 'constant' && term.left.value === 1 &&
             term.right?.type === 'variable' && term.right.variable === variable;
    },
    detectString: (expression: string, variable: string) => {
      const pattern = new RegExp(`^1\\s*\\/\\s*${variable}$`);
      const patternParens = new RegExp(`^1\\s*\\/\\s*\\(\\s*${variable}\\s*\\)$`);
      return pattern.test(expression) || patternParens.test(expression);
    },
    getResult: (_: Term | string, variable: string) => `ln|${variable}|`
  },
  
  // 1/(x^2-a^2) pattern -> (1/2a)ln|(x-a)/(x+a)|
  {
    name: "1/(x^2-a^2)",
    detectTerm: (term: Term, variable: string) => {
      if (term.type !== 'quotient' || 
          term.left?.type !== 'constant' || 
          term.left.value !== 1 ||
          term.right?.type !== 'difference') return false;
          
      const right = term.right;
      
      // Verifica se há um termo x^2 na esquerda da diferença
      const hasPowerTerm = 
        right.left?.type === 'power' && 
        right.left.argument?.type === 'variable' && 
        right.left.argument.variable === variable && 
        right.left.exponent === 2;
         
      // Verifica se há um termo constante na direita da diferença
      const hasConstant = right.right?.type === 'constant' && right.right.value !== undefined;
        
      return hasPowerTerm && hasConstant;
    },
    detectString: (expression: string, variable: string) => {
      const pattern = new RegExp(`^1\\s*\\/\\s*\\(\\s*${variable}\\s*\\^\\s*2\\s*-\\s*(\\d+)\\s*\\)$`);
      return pattern.test(expression) || !!expression.match(/^1\s*\/\s*\(\s*x\s*\^\s*2\s*-\s*\d+\s*\)$/);
    },
    getResult: (term: Term | string, variable: string) => {
      let a = 2; // Default value
      
      if (typeof term === 'string') {
        const match = term.match(/^1\s*\/\s*\(\s*x\s*\^\s*2\s*-\s*(\d+)\s*\)$/);
        if (match) {
          a = Math.sqrt(parseFloat(match[1]));
        }
      } else if (term.type === 'quotient' && term.right?.type === 'difference') {
        const constValue = term.right.right?.type === 'constant' ? term.right.right.value : 0;
        a = Math.sqrt(constValue || 4); // Default to 4 if undefined
      }
      
      return `(1/${2*a})ln|(${variable}-${a})/(${variable}+${a})|`;
    }
  },
  
  // Padrão sqrt(a^2-x^2) -> (x/2)sqrt(a^2-x^2) + (a^2/2)arcsin(x/a)
  {
    name: "sqrt(a^2-x^2)",
    detectTerm: (term: Term, variable: string) => {
      return term.type === 'sqrt' &&
             term.argument?.type === 'difference' &&
             term.argument.left?.type === 'constant' && 
             term.argument.left.value !== undefined &&
             term.argument.right?.type === 'power' &&
             term.argument.right.argument?.type === 'variable' &&
             term.argument.right.argument.variable === variable &&
             term.argument.right.exponent === 2;
    },
    detectString: (expression: string, variable: string) => {
      const pattern = new RegExp(`^sqrt\\(\\s*(\\d+)\\s*-\\s*${variable}\\s*\\^\\s*2\\s*\\)$`);
      return pattern.test(expression);
    },
    getResult: (term: Term | string, variable: string) => {
      let a = 1; // Default value
      
      if (typeof term === 'string') {
        const match = term.match(/^sqrt\(\s*(\d+)\s*-\s*x\s*\^\s*2\s*\)$/);
        if (match) {
          a = parseFloat(match[1]);
        }
      } else if (term.type === 'sqrt' && term.argument?.type === 'difference') {
        const constValue = term.argument.left?.type === 'constant' ? term.argument.left.value : 0;
        a = constValue || 1; // Default to 1 if undefined
      }
      
      if (a === 1) {
        return `(${variable}/2)sqrt(1-${variable}^2) + (1/2)arcsin(${variable})`;
      }
      const sqrtA = Math.sqrt(a).toFixed(4);
      return `(${variable}/2)sqrt(${a}-${variable}^2) + (${a}/2)arcsin(${variable}/${sqrtA})`;
    }
  },
  
  // Integral de Fresnel seno
  {
    name: "sin(x^2)",
    detectTerm: (term: Term, variable: string) => {
      return term.type === 'sin' &&
             term.argument?.type === 'power' &&
             term.argument.argument?.type === 'variable' &&
             term.argument.argument.variable === variable &&
             term.argument.exponent === 2;
    },
    detectString: (expression: string, variable: string) => {
      const pattern = new RegExp(`^sin\\(\\s*${variable}\\s*\\^\\s*2\\s*\\)$`);
      return pattern.test(expression);
    },
    getResult: (_: Term | string, variable: string) => {
      const factor = Math.sqrt(Math.PI/2).toFixed(4);
      return `Integral de Fresnel S(x): (${factor}) * S(√(2/π) * ${variable})`;
    }
  },
  
  // Integral de Fresnel cosseno
  {
    name: "cos(x^2)",
    detectTerm: (term: Term, variable: string) => {
      return term.type === 'cos' &&
             term.argument?.type === 'power' &&
             term.argument.argument?.type === 'variable' &&
             term.argument.argument.variable === variable &&
             term.argument.exponent === 2;
    },
    detectString: (expression: string, variable: string) => {
      const pattern = new RegExp(`^cos\\(\\s*${variable}\\s*\\^\\s*2\\s*\\)$`);
      return pattern.test(expression);
    },
    getResult: (_: Term | string, variable: string) => {
      const factor = Math.sqrt(Math.PI/2).toFixed(4);
      return `Integral de Fresnel C(x): (${factor}) * C(√(2/π) * ${variable})`;
    }
  },
  
  // Padrão x*ln(x) -> (x^2/2)*ln(x) - x^2/4
  {
    name: "x*ln(x)",
    detectTerm: (term: Term, variable: string) => {
      return term.type === 'product' &&
             term.left?.type === 'variable' &&
             term.left.variable === variable &&
             term.right?.type === 'ln' &&
             term.right.argument?.type === 'variable' &&
             term.right.argument.variable === variable;
    },
    detectString: (expression: string, variable: string) => {
      const pattern = new RegExp(`^${variable}\\s*\\*\\s*ln\\(\\s*${variable}\\s*\\)$`);
      return pattern.test(expression);
    },
    getResult: (_: Term | string, variable: string) => `(${variable}^2/2) * ln(${variable}) - ${variable}^2/4`
  }
]; 