// ===================================================
// ========= PARSER DE EXPRESSÕES ALGÉBRICAS ==========
// ===================================================

import { AlgebraTerm } from '../terms/algebraTermDefinition';
import { termToString } from '../terms/algebraTermManipulator';

// Definições de tipos
interface Token {
  type: 'number' | 'identifier' | 'operator' | 'parenthesis' | 'modulus';
  value: string | number;
}

// Criar um cache simples para expressões analisadas
const parsedExpressionCache: Map<string, AlgebraTerm> = new Map();

// Função de tokenização para expressões algébricas
export const tokenize = (expression: string): Token[] => {
  // Substituir combinações de caracteres especiais para melhor tokenização
  let modifiedExpr = expression.replace(/\s+/g, '')
    .replace(/\(/g, ' ( ')
    .replace(/\)/g, ' ) ')
    .replace(/\+/g, ' + ')
    .replace(/(?<![eE])-/g, ' - ') // Sinal negativo que não faz parte da notação científica
    .replace(/\*/g, ' * ')
    .replace(/\//g, ' / ');
    
  // Tratamento especial para o padrão -x²
  modifiedExpr = modifiedExpr.replace(/(\s-\s)x(²|\^2)/g, ' -1 * x$2'); 

  // Dividir em tokens
  const tokenStrings = modifiedExpr.trim().split(/\s+/);
  
  // Mapear tokens para seus tipos
  return tokenStrings.map(tokenStr => {
    if (tokenStr === '(' || tokenStr === ')') {
      return { type: 'parenthesis', value: tokenStr };
    } else if (['+', '-', '*', '/', '^'].includes(tokenStr)) {
      return { type: 'operator', value: tokenStr };
    } else if (tokenStr.match(/^-?\d+(\.\d+)?([eE][+-]?\d+)?$/)) {
      // Tratar números inteiros e de ponto flutuante
      return { type: 'number', value: parseFloat(tokenStr) };
    } else if (tokenStr.match(/^[a-zA-Z][a-zA-Z0-9]*$/)) {
      // Variáveis ou nomes de funções
      return { type: 'identifier', value: tokenStr };
    } else if (tokenStr === '|') {
      return { type: 'modulus', value: '|' };
    } else {
      throw new Error(`Token desconhecido: ${tokenStr}`);
    }
  });
};

// Normalizar expressão para parsing consistente
export const normalizeExpression = (expression: string): string => {
  let result = expression.trim();
  
  // Tratar caso especial -x² convertendo-o explicitamente para -1*x²
  result = result.replace(/-\s*(x\^2|x²)/g, '-1*$1');
  
  // Converter notações de potência: ² -> ^2
  result = result.replace(/²/g, '^2');
  
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
        // Caso especial para -x² (x negativo ao quadrado)
        if (rightExpr.includes('x²') || (rightExpr.includes('x') && rightExpr.includes('^2'))) {
          // Extrair a base da potência e criar uma estrutura adequada
          // Precisamos obter apenas a parte x sem o expoente
          const match = rightExpr.match(/^(x)(?:\^2|²)/);
          if (match) {
            // Isso é um simples -x²
            return {
              type: 'product',
              left: { type: 'constant', value: -1 },
              right: {
                type: 'power',
                argument: { type: 'variable', variable: 'x' },
                exponent: 2
              }
            };
          }
        }
        
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
  
  // Verificar expressão de módulo |x| ou |expressão|
  if (trimmedExpr.startsWith('|')) {
    // Verificar se há o símbolo de fechamento |
    if (!trimmedExpr.endsWith('|')) {
      throw new Error(`Expressão de módulo inválida: "${trimmedExpr}" - falta o | de fechamento`);
    }
    
    // Remover os símbolos de módulo externos e analisar a expressão interna
    const innerExpression = trimmedExpr.substring(1, trimmedExpr.length - 1).trim();
    return {
      type: 'modulus',
      argument: parseAlgebraicExpression(innerExpression)
    };
  }
  
  // Caso especial para -x² (x negativo ao quadrado)
  if (trimmedExpr.startsWith('-') && (trimmedExpr.includes('x²') || (trimmedExpr.includes('x') && trimmedExpr.includes('^2')))) {
    // Verificar se é especificamente -x² (não algo mais complexo)
    const match = trimmedExpr.match(/^-(x)(?:\^2|²)$/);
    if (match) {
      // Isso é um simples -x²
      return {
        type: 'product',
        left: { type: 'constant', value: -1 },
        right: {
          type: 'power',
          argument: { type: 'variable', variable: 'x' },
          exponent: 2
        }
      };
    }
  }
  
  // Parênteses
  if (trimmedExpr.startsWith('(') && trimmedExpr.endsWith(')')) {
    // Verificar se os parênteses são balanceados e correspondem ao início/fim
    if (isBalancedParentheses(trimmedExpr)) {
      // Remover parênteses e analisar o conteúdo
      return parseAlgebraicExpression(trimmedExpr.substring(1, trimmedExpr.length - 1));
    }
  }
  
  // Número constante (incluindo negativos)
  if (/^-?\d+(\.\d+)?$/.test(trimmedExpr)) {
    return {
      type: 'constant',
      value: parseFloat(trimmedExpr)
    };
  }
  
  // Caso especial para coeficiente negativo com variável (como -2x)
  if (trimmedExpr.startsWith('-') && trimmedExpr.length > 1) {
    // Verificar se está na forma -<número><variável> (ex: -2x)
    const match = trimmedExpr.match(/^-(\d+)([a-zA-Z])$/);
    if (match) {
      return {
        type: 'product',
        left: {
          type: 'constant',
          value: -parseFloat(match[1])
        },
        right: {
          type: 'variable',
          variable: match[2]
        }
      };
    }
    
    // Tentar analisar como um termo negativo
    try {
      const innerTerm = parsePrimary(trimmedExpr.substring(1));
      return {
        type: 'negative',
        argument: innerTerm
      };
    } catch (e) {
      // Se a análise interna falhar, continuar para outros casos
    }
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

// Extrai variáveis de uma expressão
export const getVariablesFromExpression = (expression: string): string[] => {
  // Remove espaços e caracteres especiais
  const cleanedExpression = expression.replace(/\s+/g, '');
  
  // Encontrar todas as variáveis (letras únicas seguidas de números opcionais)
  const variables = new Set<string>();
  const variablePattern = /[a-zA-Z][0-9]*/g;
  const matches = cleanedExpression.match(variablePattern);
  
  if (matches) {
    matches.forEach(match => variables.add(match));
  }
  
  return Array.from(variables);
};

// Expande uma expressão algébrica
export const expandExpression = (expression: string): string => {
  // Remove espaços
  let expanded = expression.replace(/\s+/g, '');
  
  // Tratar expressões com parênteses
  while (expanded.includes('(')) {
    // Encontrar os parênteses mais internos
    const start = expanded.lastIndexOf('(');
    const end = expanded.indexOf(')', start);
    
    if (start === -1 || end === -1) break;
    
    // Obter o conteúdo dentro dos parênteses
    const inner = expanded.substring(start + 1, end);
    
    // Obter o coeficiente antes dos parênteses
    let coefficient = '';
    let i = start - 1;
    while (i >= 0 && /[-0-9]/.test(expanded[i])) {
      coefficient = expanded[i] + coefficient;
      i--;
    }
    
    if (coefficient === '-') coefficient = '-1';
    else if (coefficient === '') coefficient = '1';
    
    // Multiplicar cada termo dentro dos parênteses pelo coeficiente
    const terms = inner.split(/([+-])/);
    let expandedInner = '';
    
    for (let j = 0; j < terms.length; j++) {
      const term = terms[j];
      if (term === '+' || term === '-') {
        expandedInner += term;
      } else if (term !== '') {
        const termCoef = parseFloat(coefficient);
        if (!isNaN(termCoef)) {
          const matchResult = term.match(/^-?\d*\.?\d*/);
          const termValue = matchResult ? matchResult[0] : '1';
          const termVar = term.replace(/^-?\d*\.?\d*/, '');
          const newCoef = termCoef * parseFloat(termValue || '1');
          expandedInner += (newCoef >= 0 ? '+' : '') + newCoef + termVar;
        }
      }
    }
    
    // Substituir a expressão original pela versão expandida
    expanded = expanded.substring(0, i + 1) + 
               expandedInner + 
               expanded.substring(end + 1);
  }
  
  // Limpeza: garantir formatação adequada
  expanded = expanded.replace(/\+\-/g, '-')
                    .replace(/\-\+/g, '-')
                    .replace(/\+\+/g, '+')
                    .replace(/\-\-/g, '+');
  
  // Remover + inicial
  if (expanded.startsWith('+')) {
    expanded = expanded.substring(1);
  }
  
  return expanded;
};

// Fatoriza uma expressão algébrica
export const factorizeExpression = (expression: string): string => {
  // Remove espaços
  const cleanedExpression = expression.replace(/\s+/g, '');
  
  // Verificar padrões quadráticos comuns - permitir notações x^2 e x²
  // Padrão melhorado para lidar melhor com coeficientes negativos e diferentes ordens de termos
  const quadraticPattern = /^([-+]?\d*x(?:\^2|²))?([-+]?\d*x)?([-+]?\d+)?$/;
  const match = cleanedExpression.match(quadraticPattern);
  
  if (match) {
    // Extrair coeficientes
    let a = 0, b = 0, c = 0;
    
    // Termo x² (lidando com ambas notações)
    if (match[1]) {
      const aStr = match[1].replace(/x(?:\^2|²)/, '');
      a = aStr === '-' ? -1 : aStr === '' || aStr === '+' ? 1 : parseFloat(aStr);
    }
    
    if (match[2]) { // Termo x
      const bStr = match[2].replace('x', '');
      b = bStr === '-' ? -1 : bStr === '' || bStr === '+' ? 1 : parseFloat(bStr);
    }
    
    if (match[3]) { // Termo constante
      c = parseFloat(match[3]);
    }
    
    // Verificar se é um trinômio quadrado perfeito: ax² + 2bx + c
    if (a !== 0 && b * b === 4 * a * c) {
      const root = -b / (2 * a);
      return `(x ${root >= 0 ? '-' : '+'} ${Math.abs(root)})²`;
    }
    
    // Verificar se é uma diferença de quadrados: a²x² - b²
    if (a !== 0 && b === 0 && c < 0) {
      const sqrtA = Math.sqrt(a);
      const sqrtNegC = Math.sqrt(-c);
      if (Number.isInteger(sqrtA) && Number.isInteger(sqrtNegC)) {
        return `(${sqrtA}x + ${sqrtNegC})(${sqrtA}x - ${sqrtNegC})`;
      }
    }
  }
  
  // Tentar padrão alternativo para formato "-x²" (quando o coeficiente negativo não é explícito)
  if (cleanedExpression.includes('-x²') || cleanedExpression.includes('-x^2')) {
    // Substituir -x² por -1x² para tornar o coeficiente explícito
    const modifiedExpr = cleanedExpression
      .replace(/-x²/g, '-1x²')
      .replace(/-x\^2/g, '-1x^2');
      
    // Tentar analisar novamente com a expressão modificada
    return factorizeExpression(modifiedExpr);
  }
  
  // Se nenhum padrão de fatoração for encontrado, retornar a expressão original
  return cleanedExpression;
};

// Resolve uma equação linear para uma variável
export const solveForVariable = (equation: string, variable: string): string => {
  // Dividir equação em lados esquerdo e direito
  const [leftSide, rightSide] = equation.split('=').map(side => side.trim());
  
  // Obter coeficientes de ambos os lados
  const leftTerms = getTerms(leftSide);
  const rightTerms = getTerms(rightSide);
  
  // Combinar termos semelhantes
  let coefficient = 0;
  let constant = 0;
  
  // Processar lado esquerdo
  leftTerms.forEach(term => {
    if (term.includes(variable)) {
      coefficient += getCoefficient(term);
    } else {
      constant -= parseFloat(term);
    }
  });
  
  // Processar lado direito
  rightTerms.forEach(term => {
    if (term.includes(variable)) {
      coefficient -= getCoefficient(term);
    } else {
      constant += parseFloat(term);
    }
  });
  
  // Resolver para a variável
  if (coefficient === 0) {
    return constant === 0 ? 'Identidade' : 'Sem solução';
  }
  
  const solution = constant / coefficient;
  return `${variable} = ${solution}`;
};

// Função auxiliar para obter termos de uma expressão
const getTerms = (expression: string): string[] => {
  const terms: string[] = [];
  let currentTerm = '';
  let sign = '';
  
  for (let i = 0; i < expression.length; i++) {
    const char = expression[i];
    
    if ((char === '+' || char === '-') && i > 0) {
      terms.push(sign + currentTerm);
      currentTerm = '';
      sign = char;
    } else if (i === 0 && char === '-') {
      sign = '-';
    } else {
      currentTerm += char;
    }
  }
  
  terms.push(sign + currentTerm);
  return terms.map(term => term.trim()).filter(term => term !== '');
};

// Função auxiliar para obter o coeficiente de um termo
const getCoefficient = (term: string): number => {
  if (term === 'x') return 1;
  if (term === '-x') return -1;
  const coefficient = parseFloat(term);
  return isNaN(coefficient) ? 1 : coefficient;
}; 