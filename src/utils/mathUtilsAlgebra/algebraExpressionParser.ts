// ===================================================
// ======== PARSER DE EXPRESSÕES ALGÉBRICAS ==========
// ===================================================

import { AlgebraTerm } from './algebraTermDefinition';

// Criar um cache simples para expressões analisadas
const parsedExpressionCache: Map<string, AlgebraTerm> = new Map();

// Função de tokenização para expressões algébricas
export const tokenize = (expression: string): string[] => {
  let tokens: string[] = [];
  let currentToken = '';
  let i = 0;
  
  // Função auxiliar para verificar se um caractere é um dígito
  const isDigit = (char: string) => /[0-9.]/.test(char);
  
  // Função auxiliar para verificar se um caractere é uma letra (variável)
  const isAlpha = (char: string) => /[a-zA-Z]/.test(char);
  
  // Normalizar a expressão antes de tokenizar
  const normalizedExpression = normalizeExpression(expression);
  
  while (i < normalizedExpression.length) {
    const char = normalizedExpression[i];
    
    // Tratar números (incluindo decimais)
    if (isDigit(char)) {
      currentToken = '';
      while (i < normalizedExpression.length && isDigit(normalizedExpression[i])) {
        currentToken += normalizedExpression[i];
        i++;
      }
      tokens.push(currentToken);
      continue;
    }
    
    // Tratar variáveis e potências de variáveis (x, y, x^2, etc.)
    if (isAlpha(char)) {
      currentToken = '';
      
      // Capturar o nome da variável
      while (i < normalizedExpression.length && isAlpha(normalizedExpression[i])) {
        currentToken += normalizedExpression[i];
        i++;
      }
      
      // Capturar expoentes que seguem a variável
      if (i < normalizedExpression.length && normalizedExpression[i] === '^') {
        currentToken += normalizedExpression[i++]; // Adicionar ^ e avançar
        
        // Capturar o número do expoente
        if (i < normalizedExpression.length && isDigit(normalizedExpression[i])) {
          while (i < normalizedExpression.length && isDigit(normalizedExpression[i])) {
            currentToken += normalizedExpression[i];
            i++;
          }
        }
      }
      
      tokens.push(currentToken);
      continue;
    }
    
    // Tratar operadores e parênteses
    if (['+', '-', '*', '/', '^', '(', ')'].includes(char)) {
      tokens.push(char);
      i++;
      continue;
    }
    
    // Ignorar espaços em branco
    if (char === ' ') {
      i++;
      continue;
    }
    
    // Se chegou aqui, encontrou um caractere não reconhecido
    throw new Error(`Caractere não reconhecido na expressão: ${char}`);
  }
  
  return tokens;
};

// Normalizar expressão para parsing consistente
export const normalizeExpression = (expression: string): string => {
  let result = expression.trim();
  
  // Processar multiplicações implícitas (ex: 2x -> 2*x)
  result = processImplicitMultiplications(result);
  
  // Substituir ^ por ** para exponenciação
  result = result.replace(/\^/g, '^');
  
  // Garantir que operadores têm espaços ao redor para melhor parsing
  result = result.replace(/([+\-*/^()])/g, ' $1 ');
  
  // Remover espaços múltiplos
  result = result.replace(/\s+/g, ' ').trim();
  
  return result;
};

// Função para processar multiplicações implícitas
const processImplicitMultiplications = (expression: string): string => {
  let result = expression;
  
  // Substituir número seguido de variável: 2x -> 2*x
  result = result.replace(/(\d)([a-zA-Z])/g, '$1*$2');
  
  // Substituir número seguido de parêntese: 2(x+y) -> 2*(x+y)
  result = result.replace(/(\d)(\()/g, '$1*$2');
  
  // Substituir parênteses adjacentes: (a+b)(c+d) -> (a+b)*(c+d)
  result = result.replace(/\)(\()/g, ')*$1');
  
  // Substituir variável seguida de parêntese: x(a+b) -> x*(a+b)
  result = result.replace(/([a-zA-Z])(\()/g, '$1*$2');
  
  // Substituir parêntese fechado seguido de variável: (a+b)x -> (a+b)*x
  result = result.replace(/\)([a-zA-Z])/g, ')*$1');
  
  // Substituir variáveis adjacentes: xy -> x*y
  result = result.replace(/([a-zA-Z])([a-zA-Z])/g, '$1*$2');
  
  return result;
};

// Função auxiliar para remover parênteses externos desnecessários
const removeOuterParentheses = (expression: string): string => {
  const trimmed = expression.trim();
  if (trimmed.startsWith('(') && trimmed.endsWith(')')) {
    // Verificar se os parênteses são balanceados
    if (isBalancedParentheses(trimmed.substring(1, trimmed.length - 1))) {
      return removeOuterParentheses(trimmed.substring(1, trimmed.length - 1));
    }
  }
  return trimmed;
};

// Parser recursivo para expressões algébricas (baseado em precedência de operadores)
export const parseAlgebraicExpression = (expression: string): AlgebraTerm => {
  // Verificar cache primeiro
  if (parsedExpressionCache.has(expression)) {
    return parsedExpressionCache.get(expression)!;
  }
  
  // Normalizar e preparar a expressão
  const normalizedExpr = normalizeExpression(expression);
  
  // Remover parênteses externos se forem desnecessários
  const cleanedExpr = removeOuterParentheses(normalizedExpr);
  
  // Iniciar o parsing recursivo
  const result = parseSum(cleanedExpr);
  
  // Armazenar no cache
  parsedExpressionCache.set(expression, result);
  
  return result;
};

// Parsing de somas e subtrações (menor precedência)
const parseSum = (expression: string): AlgebraTerm => {
  // Procurar pelo último + ou - que não esteja dentro de parênteses
  let parenthesesCount = 0;
  let lastOperatorIndex = -1;
  
  for (let i = expression.length - 1; i >= 0; i--) {
    const char = expression[i];
    
    if (char === ')') parenthesesCount++;
    else if (char === '(') parenthesesCount--;
    
    // Só consideramos operadores fora de parênteses
    if (parenthesesCount === 0) {
      if (char === '+' && i > 0 && expression[i-1] !== '^' && expression[i-1] !== '*' && expression[i-1] !== '/') {
        lastOperatorIndex = i;
        break;
      } else if (char === '-' && i > 0 && expression[i-1] !== '^' && expression[i-1] !== '*' && expression[i-1] !== '/') {
        lastOperatorIndex = i;
        break;
      }
    }
  }
  
  // Se encontramos um operador de soma/subtração no nível superior
  if (lastOperatorIndex !== -1) {
    const leftExpr = expression.substring(0, lastOperatorIndex).trim();
    const rightExpr = expression.substring(lastOperatorIndex + 1).trim();
    
    // Verificar se é um operador unário ou binário
    if (leftExpr === "") {
      // Operador unário (como em -x)
      if (expression[lastOperatorIndex] === '-') {
        return {
          type: 'negative',
          argument: parseSum(rightExpr)
        };
      }
      // Se for + unário, apenas retorna o termo da direita
      return parseSum(rightExpr);
    }
    
    // Operador binário
    const leftTerm = parseSum(leftExpr);
    const rightTerm = parseProduct(rightExpr); // Note que usamos parseProduct para o termo direito
    
    if (expression[lastOperatorIndex] === '+') {
      return {
        type: 'sum',
        left: leftTerm,
        right: rightTerm
      };
    } else { // '-'
      return {
        type: 'difference',
        left: leftTerm,
        right: rightTerm
      };
    }
  }
  
  // Se não encontramos operadores de soma/subtração, passar para o próximo nível de precedência
  return parseProduct(expression);
};

// Parsing de produtos e divisões (precedência média)
const parseProduct = (expression: string): AlgebraTerm => {
  // Procurar pelo último * ou / que não esteja dentro de parênteses
  let parenthesesCount = 0;
  let lastOperatorIndex = -1;
  
  for (let i = expression.length - 1; i >= 0; i--) {
    const char = expression[i];
    
    if (char === ')') parenthesesCount++;
    else if (char === '(') parenthesesCount--;
    
    // Só consideramos operadores fora de parênteses
    if (parenthesesCount === 0) {
      if (char === '*' || char === '/') {
        lastOperatorIndex = i;
        break;
      }
    }
  }
  
  // Se encontramos um operador de multiplicação/divisão
  if (lastOperatorIndex !== -1) {
    const leftExpr = expression.substring(0, lastOperatorIndex).trim();
    const rightExpr = expression.substring(lastOperatorIndex + 1).trim();
    
    const leftTerm = parseProduct(leftExpr);
    const rightTerm = parsePower(rightExpr); // Próximo nível de precedência
    
    if (expression[lastOperatorIndex] === '*') {
      return {
        type: 'product',
        left: leftTerm,
        right: rightTerm
      };
    } else { // '/'
      return {
        type: 'quotient',
        left: leftTerm,
        right: rightTerm
      };
    }
  }
  
  // Se não encontramos operadores de multiplicação/divisão, passar para o próximo nível
  return parsePower(expression);
};

// Parsing de potências (alta precedência)
const parsePower = (expression: string): AlgebraTerm => {
  // Procurar pelo primeiro ^ que não esteja dentro de parênteses
  // Nota: exponenciação é associativa à direita
  let parenthesesCount = 0;
  let powerIndex = -1;
  
  for (let i = 0; i < expression.length; i++) {
    const char = expression[i];
    
    if (char === '(') parenthesesCount++;
    else if (char === ')') parenthesesCount--;
    
    // Só consideramos operadores fora de parênteses
    if (parenthesesCount === 0 && char === '^') {
      powerIndex = i;
      break;
    }
  }
  
  // Se encontramos um operador de potência
  if (powerIndex !== -1) {
    const baseExpr = expression.substring(0, powerIndex).trim();
    const exponentExpr = expression.substring(powerIndex + 1).trim();
    
    const baseTerm = parsePrimary(baseExpr);
    const exponentTerm = parsePower(exponentExpr); // Recursivo para associatividade à direita
    
    return {
      type: 'power',
      argument: baseTerm,
      exponent: isNumericTerm(exponentTerm) ? exponentTerm.value : exponentTerm
    };
  }
  
  // Se não encontramos operadores de potência, passar para o nível primário
  return parsePrimary(expression);
};

// Verificar se um termo é numérico
const isNumericTerm = (term: AlgebraTerm): term is AlgebraTerm & { type: 'constant', value: number } => {
  return term.type === 'constant' && typeof term.value === 'number';
};

// Parsing de termos primários (variáveis, constantes, parênteses)
const parsePrimary = (expression: string): AlgebraTerm => {
  const trimmedExpr = expression.trim();
  
  // Expressão vazia
  if (trimmedExpr === '') {
    throw new Error('Expressão vazia não é válida');
  }
  
  // Parênteses
  if (trimmedExpr.startsWith('(') && trimmedExpr.endsWith(')')) {
    // Verificar se os parênteses são balanceados e correspondem ao início/fim
    if (isBalancedParentheses(trimmedExpr)) {
      // Remover parênteses e analisar o conteúdo
      return parseAlgebraicExpression(trimmedExpr.substring(1, trimmedExpr.length - 1));
    }
  }
  
  // Número constante
  if (/^-?\d+(\.\d+)?$/.test(trimmedExpr)) {
    return {
      type: 'constant',
      value: parseFloat(trimmedExpr)
    };
  }
  
  // Variável única
  if (/^[a-zA-Z]$/.test(trimmedExpr)) {
    return {
      type: 'variable',
      variable: trimmedExpr
    };
  }
  
  // Funções (como sqrt, log, etc)
  const functionMatch = trimmedExpr.match(/^([a-zA-Z]+)\((.+)\)$/);
  if (functionMatch) {
    const functionName = functionMatch[1];
    const argument = functionMatch[2];
    
    return {
      type: 'function',
      functionName,
      argument: parseAlgebraicExpression(argument)
    };
  }
  
  // Se não conseguiu interpretar a expressão
  throw new Error(`Não foi possível interpretar a expressão: ${trimmedExpr}`);
};

// Função para verificar se os parênteses são balanceados
const isBalancedParentheses = (expression: string): boolean => {
  let count = 0;
  
  for (let i = 0; i < expression.length; i++) {
    if (expression[i] === '(') {
      count++;
    } else if (expression[i] === ')') {
      count--;
      
      // Se negativo, há mais parênteses fechados que abertos
      if (count < 0) {
        return false;
      }
    }
  }
  
  // No final, count deve ser zero para parênteses balanceados
  return count === 0;
}; 