// ===================================================
// ====== FUNÇÕES PARA AVALIAÇÃO DE EXPRESSÕES =======
// ===================================================

import { evaluateTermForValue, evaluateExpression } from './expressionUtils';
import { Term } from './termDefinition';
import { parsedExpressionCache, getCacheKey, addToCache, getFromCache } from './expressionCache';

// Função unificada para avaliar expressões JavaScript com segurança
export const safelyEvaluateExpression = (
  expression: string, 
  variable: string, 
  value: number, 
): number => {
  try {
    // Função segura para avaliar a expressão
    const safeEval = new Function(variable, `
      // Definir constantes matemáticas
      const PI = Math.PI;
      const E = Math.E;
      const e = Math.E;  // Adicionar 'e' como símbolo para o número de Euler
      
      // Definir funções matemáticas
      const sin = Math.sin;
      const cos = Math.cos;
      const tan = Math.tan;
      const atan = Math.atan;
      const asin = Math.asin;
      const acos = Math.acos;
      const exp = Math.exp;
      const log = Math.log;
      const log10 = Math.log10;
      const abs = Math.abs;
      const sqrt = Math.sqrt;
      const pow = Math.pow;
      
      // Retornar resultado da expressão
      try {
        return ${expression};
      } catch (error) {
        throw new Error("Erro ao avaliar expressão matemática: " + error);
      }
    `);
    
    const result = safeEval(value);
    
    if (isNaN(result) || !isFinite(result)) {
      throw new Error(`Resultado inválido (${result}) ao avaliar a expressão com ${variable} = ${value}`);
    }
    
    return result;
  } catch (error) {
    throw new Error(`Erro na avaliação da expressão: ${error instanceof Error ? error.message : String(error)}`);
  }
};

// Converte uma expressão matemática para JavaScript para avaliação
export const mathExpressionToJsExpression = (
  expression: string, 
  variable: string = 'x'
): string => {
  // Verificar se a expressão contém uma função não calculada
  if (expression.startsWith('integral(') || expression.includes('não calculável')) {
    throw new Error(`Não foi possível converter esta expressão para avaliação: ${expression}`);
  }
  
  // Caso específico para ln|x|
  if (expression.match(/ln\|[^|]+\|/)) {
    return expression.replace(/ln\|([^|]+)\|/g, 'Math.log(Math.abs($1))');
  }
  
  // Tratar primeiro o símbolo de raiz quadrada
  let jsExpr = expression
    .replace(/√\(([^)]+)\)/g, 'Math.sqrt($1)')      // √(x) -> Math.sqrt(x)
    .replace(/√([^(][^)]*)/g, 'Math.sqrt($1)');     // √x -> Math.sqrt(x)
  
  // Substituir padrões matemáticos por código JavaScript
  jsExpr = jsExpr
    .replace(/\^/g, '**')                           // x^2 -> x**2
    .replace(/sen/g, 'Math.sin')                    // sen(x) -> Math.sin(x)
    .replace(/sin/g, 'Math.sin')                    // sin(x) -> Math.sin(x)
    .replace(/cos/g, 'Math.cos')                    // cos(x) -> Math.cos(x)
    .replace(/tan/g, 'Math.tan')                    // tan(x) -> Math.tan(x)
    .replace(/arcsin/g, 'Math.asin')                // arcsin(x) -> Math.asin(x)
    .replace(/arccos/g, 'Math.acos')                // arccos(x) -> Math.acos(x)
    .replace(/arctan/g, 'Math.atan')                // arctan(x) -> Math.atan(x)
    .replace(/ln\(([^)]+)\)/g, 'Math.log($1)')      // ln(x) -> Math.log(x)
    .replace(/log\(([^)]+)\)/g, 'Math.log10($1)')   // log(x) -> Math.log10(x)
    .replace(/sqrt\(([^)]+)\)/g, 'Math.sqrt($1)');  // sqrt(x) -> Math.sqrt(x)
  
  // Tratar exponenciais (e^x)
  jsExpr = jsExpr.replace(/e\^([^+\-*/(),\s]+)/g, 'Math.exp($1)')   // e^x -> Math.exp(x)
                 .replace(/e\^\(([^)]+)\)/g, 'Math.exp($1)');       // e^(x+1) -> Math.exp(x+1)
  
  // Substituir multiplicações implícitas
  // 1. Substituir coeficientes seguidos da variável: 3x -> 3*x
  jsExpr = jsExpr.replace(new RegExp(`(\\d+)(${variable})`, 'g'), '$1*$2');
  
  // 2. Substituir variável seguida de parênteses: x(y+1) -> x*(y+1)
  jsExpr = jsExpr.replace(new RegExp(`${variable}\\(`, 'g'), `${variable}*(`);
  
  // 3. Substituir multiplicações entre parênteses: (x+1)(y+2) -> (x+1)*(y+2)
  jsExpr = jsExpr.replace(/\)(\()/g, ')*$1');
  
  // Normalizar multiplicações
  jsExpr = jsExpr.replace(/\s*\*\s*/g, '*');
  
  // Verificar se ainda existem símbolos 'e^' que não foram convertidos
  if (jsExpr.includes('e^')) {
    jsExpr = jsExpr.replace(/e\^/g, 'Math.exp(1) ** ');  // Último recurso: e^2 -> Math.exp(1) ** 2
  }
  
  return jsExpr;
};

// Avalia uma expressão para um valor específico usando a função compartilhada
export const evaluateExpressionWithVariable = (expression: string, variable: string, value: number): number => {
  try {
    // Primeiro tentar analisar como Term
    const parsedTerm = parseExpression(expression, variable);
    if (parsedTerm) {
      return evaluateTermForValue(parsedTerm, variable, value);
    }
    
    // Se falhar, usar a avaliação genérica
    return evaluateExpression(expression, variable, value);
  } catch (error) {
    throw new Error(`Erro ao avaliar expressão ${expression} para ${variable}=${value}: ${error}`);
  }
};

// Importar a função de análise de expressões matemáticas separadamente para evitar dependências circulares
import { parseExpression } from './expressionParser';

// Função que avalia uma expressão numérica, substituindo variáveis por seus valores
export const evaluateTermExpression = (
  term: Term,
  variableValues: Record<string, number> = {}
): number => {
  if (!term) {
    throw new Error("Termo inválido: nulo ou indefinido");
  }
  
  // Criar uma chave de cache a partir do termo e valores das variáveis
  const termKey = JSON.stringify(term);
  const valuesKey = JSON.stringify(variableValues);
  const cacheKey = getCacheKey(`${termKey}|${valuesKey}`, 'evaluate');
  
  // Verificar se o resultado já está no cache
  const cachedResult = getFromCache(parsedExpressionCache, cacheKey);
  if (cachedResult !== undefined) {
    return cachedResult as number;
  }
  
  let result: number;
  
  try {
    switch (term.type) {
      case 'constant':
        result = term.value!;
        break;
        
      case 'variable':
        const variable = term.variable!;
        if (variable in variableValues) {
          result = variableValues[variable];
        } else {
          throw new Error(`Valor da variável ${variable} não fornecido`);
        }
        break;
        
      case 'sum':
        result = evaluateTermExpression(term.left!, variableValues) + 
                evaluateTermExpression(term.right!, variableValues);
        break;
        
      case 'difference':
        result = evaluateTermExpression(term.left!, variableValues) - 
                evaluateTermExpression(term.right!, variableValues);
        break;
        
      case 'product':
        result = evaluateTermExpression(term.left!, variableValues) * 
                evaluateTermExpression(term.right!, variableValues);
        break;
        
      case 'quotient': {
        const denominator = evaluateTermExpression(term.right!, variableValues);
        if (Math.abs(denominator) < 1e-10) {
          throw new Error("Divisão por zero");
        }
        result = evaluateTermExpression(term.left!, variableValues) / denominator;
        break;
      }
        
      case 'power': {
        const base = evaluateTermExpression(term.argument!, variableValues);
        const exponent = term.exponent!;
        
        // Tratar casos especiais para melhor estabilidade numérica
        if (base < 0 && !Number.isInteger(exponent)) {
          throw new Error("Potência com base negativa e expoente não inteiro");
        }
        
        // Caminho rápido para expoentes comuns
        if (exponent === 2) {
          result = base * base;
        } else if (exponent === 3) {
          result = base * base * base;
        } else if (exponent === 0.5) {
          if (base < 0) {
            throw new Error("Raiz quadrada de número negativo");
          }
          result = Math.sqrt(base);
        } else {
          result = Math.pow(base, exponent);
        }
        break;
      }
        
      case 'sin':
        result = Math.sin(evaluateTermExpression(term.argument!, variableValues));
        break;
        
      case 'cos':
        result = Math.cos(evaluateTermExpression(term.argument!, variableValues));
        break;
        
      case 'tan': {
        const angle = evaluateTermExpression(term.argument!, variableValues);
        // Verificar valores indefinidos de tan (em π/2 + k*π)
        const cosValue = Math.cos(angle);
        if (Math.abs(cosValue) < 1e-10) {
          throw new Error("Tangente indefinida neste ponto");
        }
        result = Math.tan(angle);
        break;
      }
        
      case 'ln': {
        const arg = evaluateTermExpression(term.argument!, variableValues);
        if (arg <= 0) {
          throw new Error("Logaritmo natural de número não positivo");
        }
        result = Math.log(arg);
        break;
      }
        
      case 'log': {
        const arg = evaluateTermExpression(term.argument!, variableValues);
        if (arg <= 0) {
          throw new Error("Logaritmo de número não positivo");
        }
        result = Math.log10(arg);
        break;
      }
        
      case 'exp':
        result = Math.exp(evaluateTermExpression(term.argument!, variableValues));
        break;
        
      case 'sqrt': {
        const arg = evaluateTermExpression(term.argument!, variableValues);
        if (arg < 0) {
          throw new Error("Raiz quadrada de número negativo");
        }
        result = Math.sqrt(arg);
        break;
      }
        
      default:
        throw new Error(`Tipo de termo não suportado: ${term.type}`);
    }
    
    // Armazenar o resultado no cache antes de retornar
    addToCache(parsedExpressionCache, cacheKey, result);
    return result;
    
  } catch (error) {
    // Re-lançar o erro com contexto adicional sobre a expressão sendo avaliada
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Erro ao avaliar expressão: ${message}`);
  }
};

// Nova função utilitária para comparação numérica segura com tolerância
export const areNumbersEqual = (a: number, b: number, epsilon: number = 1e-10): boolean => {
  return Math.abs(a - b) < epsilon;
};

// Avaliar múltiplas expressões com os mesmos valores de variáveis de forma eficiente
export const evaluateMultipleExpressions = (
  terms: Term[],
  variableValues: Record<string, number> = {}
): number[] => {
  return terms.map(term => evaluateTermExpression(term, variableValues));
}; 