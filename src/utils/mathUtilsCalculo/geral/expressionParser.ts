// ===================================================
// ======== FUNÇÕES DE ANÁLISE DE EXPRESSÕES =========
// ===================================================

import { Term } from './termDefinition';
import { findMatchingCloseParen, processImplicitMultiplications, removeOuterParentheses } from './expressionUtils';
import { parsedExpressionCache, getCacheKey, addToCache, getFromCache } from './expressionCache';

// Função auxiliar para remover parênteses externos de forma iterativa (não recursiva)
export const stripOuterParentheses = (expr: string): string => {
  let result = expr;
  
  // Continua removendo parênteses externos enquanto possível
  let changed = true;
  while (changed) {
    changed = false;
    
    if (result.startsWith('(') && result.endsWith(')')) {
      // Verificar se os parênteses externos são balanceados
      let parenthesesCount = 0;
      let isExternal = true;
      
      for (let i = 0; i < result.length - 1; i++) {
        if (result[i] === '(') parenthesesCount++;
        if (result[i] === ')') parenthesesCount--;
        
        // Se o contador chegar a zero antes do último caractere,
        // significa que os parênteses não são externos
        if (parenthesesCount === 0 && i < result.length - 1) {
          isExternal = false;
          break;
        }
      }
      
      // Se os parênteses são externos, remove-os
      if (isExternal) {
        result = result.substring(1, result.length - 1);
        changed = true;
      } else {
        // Parênteses não são externos, parar o loop
        break;
      }
    } else {
      // Não começa e termina com parênteses, parar o loop
      break;
    }
  }
  
  return result;
};

// Função para separar em numerador e denominador
export const splitByDivision = (expr: string): [string, string] | null => {
  let parenthesesCount = 0;
  
  for (let i = 0; i < expr.length; i++) {
    const char = expr[i];
    
    if (char === '(') parenthesesCount++;
    else if (char === ')') parenthesesCount--;
    
    // Só consideramos operadores / quando estão fora de parênteses
    if (char === '/' && parenthesesCount === 0) {
      const numerator = expr.substring(0, i).trim();
      const denominator = expr.substring(i + 1).trim();
      
      if (numerator && denominator) {
        // Preservar os parênteses se já existirem no denominador
        if (denominator.startsWith('(') && denominator.endsWith(')')) {
          return [numerator, denominator];
        }
        
        // Tratar caso especial onde o denominador é uma diferença ou tem operadores
        if (!denominator.startsWith('(') && (
            denominator.includes('-') || 
            denominator.includes('+') || 
            denominator.includes('*') ||
            denominator.includes('/'))) {
          // Verificar se este é realmente um operador e não um sinal negativo
          let hasOperator = false;
          let operatorParenCount = 0;
          
          for (let j = 0; j < denominator.length; j++) {
            if (denominator[j] === '(') operatorParenCount++;
            else if (denominator[j] === ')') operatorParenCount--;
            
            if (operatorParenCount === 0 && j > 0) {
              const char = denominator[j];
              if ((char === '-' || char === '+' || char === '*' || char === '/') && 
                  // Certificar-se de que não está após outro operador
                  !(denominator[j-1] === '*' || denominator[j-1] === '/' || 
                    denominator[j-1] === '^' || denominator[j-1] === '(')) {
                hasOperator = true;
                break;
              }
            }
          }
          
          if (hasOperator) {
            return [numerator, `(${denominator})`];
          }
        }
        
        return [numerator, denominator];
      }
    }
  }
  
  return null;
};

// Função melhorada para processar expressões com funções compostas e multiplicações
export const preProcessExpression = (expression: string): string => {
  if (!expression) return expression;
  
  // Prepara a expressão para análise
  let expr = expression.trim();
  
  // Substituir o símbolo de raiz quadrada (√) por "sqrt" antes de qualquer outro processamento
  expr = expr.replace(/√\(([^)]+)\)/g, 'sqrt($1)')    // √(x) -> sqrt(x)
           .replace(/√(\d+)/g, 'sqrt($1)')           // √2 -> sqrt(2)
           .replace(/√([a-zA-Z][^+\-*/^ ]*)/g, 'sqrt($1)'); // √x, √x2, etc -> sqrt(x), sqrt(x2)
  
  // Regularizar espaçamento em torno de operadores
  expr = expr.replace(/([+\-*/^])/g, " $1 ")
             .replace(/\s+/g, " ")
             .trim();
  
  // Lidar especificamente com casos de e^(x) * sin(x) ou sin(x) * e^(x)
  // Regulariza a notação para garantir que os operadores de multiplicação estejam presentes
  if (expr.includes("e^") || expr.includes("sin") || expr.includes("cos") || expr.includes("tan")) {
    // Verificar por casos como e^(x)sin(x) sem operador explícito
    expr = expr.replace(/(e\^\([^)]+\))([a-zA-Z])/g, "$1*$2");
    expr = expr.replace(/(\([^)]+\))([a-zA-Z])/g, "$1*$2");
    expr = expr.replace(/([a-zA-Z0-9])(sin|cos|tan|e\^)/g, "$1*$2");
    expr = expr.replace(/(sin|cos|tan)\(([^)]+)\)(sin|cos|tan)/g, "$1($2)*$3");
    expr = expr.replace(/(e\^)\(([^)]+)\)(sin|cos|tan)/g, "$1($2)*$3");
  }
  
  // Remover espaços que podem ter sido introduzidos
  expr = expr.replace(/\s+/g, "");
  
  return expr;
};

// Função principal para analisar uma expressão matemática
export const parseExpression = (expression: string, varName: string = 'x'): Term | null => {
  try {
    // Verifique primeiro o cache
    const cacheKey = getCacheKey(expression, varName);
    const cachedResult = getFromCache(parsedExpressionCache, cacheKey);
    
    if (cachedResult !== undefined) {
      return cachedResult as Term;
    }
    
    // Continua com o parsing normal caso não encontre no cache
    
    // Tratar strings vazias ou nulas
    if (!expression || expression.trim() === '') {
      return null;
    }

    // Pré-processamento para garantir que a expressão esteja no formato esperado
    let expr = expression.trim();
    
    // Substituir o símbolo de raiz quadrada (√) por "sqrt"
    expr = expr.replace(/√\(([^)]+)\)/g, 'sqrt($1)')
               .replace(/√(\d+)/g, 'sqrt($1)')
               .replace(/√([a-zA-Z][^+\-*/^ ]*)/g, 'sqrt($1)');
    
    // Pré-processar a expressão para lidar com multiplicações implícitas e casos especiais
    expr = preProcessExpression(expr);
    expr = processImplicitMultiplications(expr);
    
    // Remover espaços em branco
    expr = expr.replace(/\s+/g, '');
    
    // Caso especial para expressões simples como "x-1"
    const simpleDifferenceMatch = expr.match(/^([a-zA-Z])[\s]*-[\s]*([0-9.]+)$/);
    if (simpleDifferenceMatch) {
      const varPart = simpleDifferenceMatch[1];
      const constPart = parseFloat(simpleDifferenceMatch[2]);
      
      const result = {
        type: 'difference' as const,
        left: { type: 'variable' as const, variable: varPart },
        right: { type: 'constant' as const, value: constPart }
      } satisfies Term;
      
      // Ao final do parsing bem-sucedido, adicionar ao cache
      addToCache(parsedExpressionCache, cacheKey, result);
      
      return result;
    }
    
    // Caso especial para expressões como "x^2-1"
    const powerDifferenceMatch = expr.match(/^([a-zA-Z])\^(\d+)[-](\d+)$/);
    if (powerDifferenceMatch) {
      const varPart = powerDifferenceMatch[1];
      const powerPart = parseFloat(powerDifferenceMatch[2]);
      const constPart = parseFloat(powerDifferenceMatch[3]);
      
      const result: Term = {
        type: 'difference' as const,
        left: {
          type: 'power' as const,
          argument: { type: 'variable' as const, variable: varPart },
          exponent: powerPart
        },
        right: { type: 'constant' as const, value: constPart }
      } satisfies Term;
      
      // Ao final do parsing bem-sucedido, adicionar ao cache
      addToCache(parsedExpressionCache, cacheKey, result);
      
      return result;
    }
    
    // Procurar por adições e subtrações (operadores + e -)
    let parenthesesCount = 0;
    let lastOpIndex = -1;
    
    for (let i = expr.length - 1; i >= 0; i--) {
      const char = expr[i];
      
      if (char === ')') parenthesesCount++;
      else if (char === '(') parenthesesCount--;
      
      // Consideramos apenas operadores fora de parênteses
      if (parenthesesCount === 0 && (char === '+' || char === '-') && i > 0) {
        // Verificar se não é parte de outro operador (como e^(-x) ou 2*-3)
        const prevChar = expr[i - 1];
        if (!(prevChar === '*' || prevChar === '/' || prevChar === '^' || prevChar === '(')) {
          lastOpIndex = i;
          break;
        }
      }
    }
    
    if (lastOpIndex !== -1) {
      const left = parseExpression(expr.substring(0, lastOpIndex), varName);
      const right = parseExpression(expr.substring(lastOpIndex + 1), varName);
      
      if (!left || !right) {
        const leftPart = expr.substring(0, lastOpIndex);
        const rightPart = expr.substring(lastOpIndex + 1);
        throw new Error(`Failed to parse operands: left="${leftPart}", right="${rightPart}"`);
      }
      
      const result = {
        type: expr[lastOpIndex] === '+' ? 'sum' as const : 'difference' as const,
        left,
        right
      } satisfies Term;
      
      // Ao final do parsing bem-sucedido, adicionar ao cache
      addToCache(parsedExpressionCache, cacheKey, result);
      
      return result;
    }
    
    // Procurar por multiplicações (operador *)
    parenthesesCount = 0;
    lastOpIndex = -1;
    
    for (let i = expr.length - 1; i >= 0; i--) {
      const char = expr[i];
      
      if (char === ')') parenthesesCount++;
      else if (char === '(') parenthesesCount--;
      
      // Consideramos apenas operadores fora de parênteses
      if (parenthesesCount === 0 && char === '*') {
        lastOpIndex = i;
        break;
      }
    }
    
    if (lastOpIndex !== -1) {
      const left = parseExpression(expr.substring(0, lastOpIndex), varName);
      const right = parseExpression(expr.substring(lastOpIndex + 1), varName);
      
      if (!left || !right) {
        throw new Error(`Erro ao analisar operandos da multiplicação: ${expr}`);
      }
      
      const result = {
        type: 'product' as const,
        left,
        right
      } satisfies Term;
      
      // Ao final do parsing bem-sucedido, adicionar ao cache
      addToCache(parsedExpressionCache, cacheKey, result);
      
      return result;
    }
    
    // Caso direto para e (base do logaritmo natural)
    if (expr === 'e') {
      const result = { 
        type: 'constant' as const, 
        value: Math.E 
      } satisfies Term;
      
      // Ao final do parsing bem-sucedido, adicionar ao cache
      addToCache(parsedExpressionCache, cacheKey, result);
      
      return result;
    }
    
    // Caso direto para e^x
    if (expr === 'e^x' || expr === 'e^(x)' || expr.match(/^e\^\(?\s*x\s*\)?$/)) {
      const result: Term = { 
        type: 'exp' as const, 
        argument: { type: 'variable' as const, variable: varName }
      } satisfies Term;
      
      // Ao final do parsing bem-sucedido, adicionar ao cache
      addToCache(parsedExpressionCache, cacheKey, result);
      
      return result;
    }
    
    // Remover parênteses externos desnecessários
    expr = stripOuterParentheses(expr);
    
    // Caso especial adicionado para "x-1" após remoção de parênteses
    const simpleDifferenceAfterStrip = expr.match(/^([a-zA-Z])[-](\d+)$/);
    if (simpleDifferenceAfterStrip) {
      const varPart = simpleDifferenceAfterStrip[1];
      const constPart = parseFloat(simpleDifferenceAfterStrip[2]);
      
      const result: Term = {
        type: 'difference' as const,
        left: { type: 'variable' as const, variable: varPart },
        right: { type: 'constant' as const, value: constPart }
      } satisfies Term;
      
      // Ao final do parsing bem-sucedido, adicionar ao cache
      addToCache(parsedExpressionCache, cacheKey, result);
      
      return result;
    }
    
    // Caso especial para expressões como "x^2-1" após remoção de parênteses
    const powerDifferenceAfterStrip = expr.match(/^([a-zA-Z])\^(\d+)[-](\d+)$/);
    if (powerDifferenceAfterStrip) {
      const varPart = powerDifferenceAfterStrip[1];
      const powerPart = parseFloat(powerDifferenceAfterStrip[2]);
      const constPart = parseFloat(powerDifferenceAfterStrip[3]);
      
      const result: Term = {
        type: 'difference' as const,
        left: {
          type: 'power' as const,
          argument: { type: 'variable' as const, variable: varPart },
          exponent: powerPart
        },
        right: { type: 'constant' as const, value: constPart }
      } satisfies Term;
      
      // Ao final do parsing bem-sucedido, adicionar ao cache
      addToCache(parsedExpressionCache, cacheKey, result);
      
      return result;
    }
    
    // Verificar funções como sqrt, sin, cos, etc.
    const functionMatches = expr.match(/^(sqrt|sin|cos|tan|ln|log)(\(.*\))$/);
    if (functionMatches) {
      const func = functionMatches[1];
      const argExpr = removeOuterParentheses(functionMatches[2]);
      const argTerm = parseExpression(argExpr, varName);
      
      if (!argTerm) return null;
      
      // Tratar raiz quadrada como um caso especial
      if (func === 'sqrt') {
        const result = { 
          type: 'sqrt' as const, 
          argument: argTerm 
        } satisfies Term;
        
        // Ao final do parsing bem-sucedido, adicionar ao cache
        addToCache(parsedExpressionCache, cacheKey, result);
        
        return result;
      }
      
      // Restante das funções tratadas normalmente
      if (func === 'sin') {
        const result = { 
          type: 'sin' as const, 
          argument: argTerm 
        } satisfies Term;
        
        // Ao final do parsing bem-sucedido, adicionar ao cache
        addToCache(parsedExpressionCache, cacheKey, result);
        
        return result;
      }
      
      if (func === 'cos') {
        const result = { 
          type: 'cos' as const, 
          argument: argTerm 
        } satisfies Term;
        
        // Ao final do parsing bem-sucedido, adicionar ao cache
        addToCache(parsedExpressionCache, cacheKey, result);
        
        return result;
      }
      
      if (func === 'tan') {
        const result = { 
          type: 'tan' as const, 
          argument: argTerm 
        } satisfies Term;
        
        // Ao final do parsing bem-sucedido, adicionar ao cache
        addToCache(parsedExpressionCache, cacheKey, result);
        
        return result;
      }
      
      if (func === 'ln') {
        const result = { 
          type: 'ln' as const, 
          argument: argTerm 
        } satisfies Term;
        
        // Ao final do parsing bem-sucedido, adicionar ao cache
        addToCache(parsedExpressionCache, cacheKey, result);
        
        return result;
      }
      
      if (func === 'log') {
        const result = { 
          type: 'log' as const, 
          argument: argTerm 
        } satisfies Term;
        
        // Ao final do parsing bem-sucedido, adicionar ao cache
        addToCache(parsedExpressionCache, cacheKey, result);
        
        return result;
      }
    }
    
    // Verificar especificamente e^x e e^(x)
    if (expr.startsWith('e^')) {
      let argument;
      if (expr.length > 2 && expr[2] === '(') {
        // Se for e^(x), extrair o conteúdo dos parênteses
        const closingParenIndex = expr.lastIndexOf(')');
        if (closingParenIndex === -1) {
          throw new Error(`Erro de sintaxe: parêntese não fechado em ${expr}`);
        }
        argument = expr.substring(3, closingParenIndex);
      } else {
        // Se for e^x sem parênteses
        argument = expr.substring(2);
      }
      
      const argTerm = parseExpression(argument, varName);
      if (!argTerm) {
        throw new Error(`Erro ao analisar o argumento da exponencial: ${argument}`);
      }
      
      return { 
        type: 'exp' as const, 
        argument: argTerm 
      } satisfies Term;
    }
    
    // Caso especial: expressão começa com sinal negativo
    if (expr.startsWith('-')) {
      // Tratar como multiplicação por -1
      const right = parseExpression(expr.substring(1).trim(), varName);
      if (!right) return null;
      
      return {
        type: 'product' as const,
        left: { type: 'constant' as const, value: -1 },
        right: right
      } satisfies Term;
    }
    
    // Verificar divisões primeiro (operador /)
    const divisionParts = splitByDivision(expr);
    if (divisionParts) {
      const [numerator, denominator] = divisionParts;
      
      const numeratorTerm = parseExpression(numerator, varName);
      if (!numeratorTerm) {
        throw new Error(`Erro ao analisar numerador (${numerator}`);
      }
      
      // Remover parênteses externos do denominador se necessário
      let denomToParse = denominator;
      if (denominator.startsWith('(') && denominator.endsWith(')')) {
        denomToParse = denominator.substring(1, denominator.length - 1);
      }
      
      const denominatorTerm = parseExpression(denomToParse, varName);
      if (!denominatorTerm) {
        throw new Error(`Erro ao analisar denominador: ${denominator}`);
      }
      
      return {
        type: 'quotient' as const,
        left: numeratorTerm,
        right: denominatorTerm
      } satisfies Term;
    }
    
    // Multiplicação implícita entre número e variável (ex: 3x)
    const implicitMultMatch = expr.match(/^(\d+)([a-zA-Z].*)$/);
    if (implicitMultMatch) {
      const coefficient = parseFloat(implicitMultMatch[1]);
      const rest = implicitMultMatch[2];
      
      const rightTerm = parseExpression(rest, varName);
      if (!rightTerm) return null;
      
      return {
        type: 'product' as const,
        left: { type: 'constant' as const, value: coefficient },
        right: rightTerm
      } satisfies Term;
    }
    
    // Verificar potências (operador ^)
    const powerMatch = expr.match(/^(.+)\^(.+)$/);
    if (powerMatch) {
      const base = powerMatch[1];
      const exponent = powerMatch[2];
      
      const baseTerm = parseExpression(base, varName);
      
      if (!baseTerm) {
        throw new Error(`Erro ao analisar a base da potência: ${base}`);
      }
      
      // Caso especial: expoente é um número simples
      if (!isNaN(parseFloat(exponent))) {
        return {
          type: 'power' as const,
          argument: baseTerm,
          exponent: parseFloat(exponent)
        } satisfies Term;
      }
      
      // Caso especial: expoente é uma fração como (1/2)
      const fractionMatch = exponent.match(/^\((\d+)\/(\d+)\)$/);
      if (fractionMatch) {
        const numerator = parseInt(fractionMatch[1]);
        const denominator = parseInt(fractionMatch[2]);
        
        if (!isNaN(numerator) && !isNaN(denominator) && denominator !== 0) {
          return {
            type: 'power' as const,
            argument: baseTerm,
            exponent: numerator / denominator
          } satisfies Term;
        }
      }
      
      // Caso geral: expoente é uma expressão
      const exponentTerm = parseExpression(exponent, varName);
      if (!exponentTerm) {
        throw new Error(`Erro ao analisar o expoente: ${exponent}`);
      }
      
      return {
        type: 'power' as const,
        argument: baseTerm,
        exponentTerm
      } satisfies Term;
    }
    
    // Verificar funções (ex: sin(x), cos(x), etc.)
    const funcMatch = expr.match(/^(sin|cos|tan|ln|log|exp|e\^)(\(.*\)|\^.*|\(.+\).*)$/);
    if (funcMatch) {
      const funcName = funcMatch[1];
      let argument = funcMatch[2];
      
      // Processar e^x -> exp(x)
      if (funcName === 'e^') {
        // Tratar o caso onde há uma multiplicação após o argumento
        if (argument.includes('*')) {
          const parts = argument.split('*');
          // Processar apenas a parte e^(x)
          const expPart = parseExpression(`exp${parts[0]}`, varName);
          // Então tratar a multiplicação com o resto
          const restPart = parseExpression(parts.slice(1).join('*'), varName);
          
          if (!expPart || !restPart) {
            throw new Error(`Erro ao analisar expressão com multiplicação: e^${argument}`);
          }
          
          return {
            type: 'product' as const,
            left: expPart,
            right: restPart
          } satisfies Term;
        }
        
        return parseExpression(`exp${argument}`, varName);
      }
      
      // Remover parênteses para argumentos de funções
      if (argument.startsWith('(') && argument.endsWith(')')) {
        // Verificar se há conteúdo após o parêntese de fechamento (como em 'sin(x)*cos(x)')
        const closingParenIndex = findMatchingCloseParen(argument, 0);
        
        if (closingParenIndex < argument.length - 1) {
          // Há algo após o argumento da função
          const functionArg = argument.substring(1, closingParenIndex);
          const remainingExpr = argument.substring(closingParenIndex + 1);
          
          // Analisar a parte da função
          const funcTerm = parseExpression(`${funcName}(${functionArg})`, varName);
          
          // Se a parte restante começa com um operador, processá-la adequadamente
          if (remainingExpr.startsWith('*')) {
            const rightTerm = parseExpression(remainingExpr.substring(1), varName);
            
            if (!funcTerm || !rightTerm) {
              throw new Error(`Erro ao analisar expressão composta: ${funcName}(${functionArg})${remainingExpr}`);
            }
            
            return {
              type: 'product' as const,
              left: funcTerm,
              right: rightTerm
            } satisfies Term;
          }
        }
        
        argument = argument.substring(1, argument.length - 1);
      } else if (funcName === 'exp' && argument.startsWith('^')) {
        argument = argument.substring(1);
      }
      
      const argTerm = parseExpression(argument, varName);
      if (!argTerm) {
        throw new Error(`Erro ao analisar o argumento da função ${funcName}: ${argument}`);
      }
      
      switch (funcName) {
        case 'sin':
          return { type: 'sin' as const, argument: argTerm } satisfies Term;
        case 'cos':
          return { type: 'cos' as const, argument: argTerm } satisfies Term;
        case 'tan':
          return { type: 'tan' as const, argument: argTerm } satisfies Term;
        case 'ln':
          return { type: 'ln' as const, argument: argTerm } satisfies Term;
        case 'log':
          return { type: 'log' as const, argument: argTerm } satisfies Term;
        case 'exp':
          return { type: 'exp' as const, argument: argTerm } satisfies Term;
        default:
          throw new Error(`Função não suportada: ${funcName}`);
      }
    }
    
    // Expressão entre parênteses
    if (expr.startsWith('(') && expr.endsWith(')')) {
      return parseExpression(expr.substring(1, expr.length - 1), varName);
    }
    
    // Verificar se é a variável
    if (expr === varName) {
      return { 
        type: 'variable' as const, 
        variable: varName 
      } satisfies Term;
    }
    
    // Verificar se é uma constante numérica
    if (!isNaN(parseFloat(expr))) {
      return { 
        type: 'constant' as const, 
        value: parseFloat(expr) 
      } satisfies Term;
    }
    
    // Se chegou aqui, a expressão não foi reconhecida
    throw new Error(`Não foi possível analisar a expressão: ${expr}`);
  } catch (error) {
    console.error('Erro ao analisar expressão:', error);
    return null;
  }
};