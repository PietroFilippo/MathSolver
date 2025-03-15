// ===================================================
// ========== FUNÇÕES CENTRAIS PARA CÁLCULO ==========
// ===================================================

// Funções utilitárias centrais para operações de cálculo (derivadas, integrais e limites)
import { 
  isPartOfNumber, 
  removeOuterParentheses, 
  findMatchingCloseParen,
  processImplicitMultiplications,
  evaluateTermForValue,
  evaluateExpression
} from '../mathUtils';

// ===================================================
// ========== DEFINIÇÃO DE ESTRUTURAS ================
// ===================================================


// Interface que representa termos de expressões matemáticas
// Utilizada para cálculos de derivadas, integrais e limites
export interface Term {
  type: 'constant' | 'variable' | 'power' | 'sin' | 'cos' | 'tan' | 'ln' | 'log' | 'exp' | 'product' | 'sum' | 'difference' | 'quotient';
  value?: number;
  variable?: string;
  exponent?: number;
  left?: Term;
  right?: Term;
  argument?: Term;
}

// ===================================================
// ========== ANÁLISE DE EXPRESSÕES ==================
// ===================================================


// Analisa uma expressão matemática e converte-a em um objeto Term estruturado
// Função central utilizada por derivadas, integrais e limites
export const parseExpression = (expression: string, variable: string): Term | null => {
  try {
    // Remove espaços extras e parênteses externos se presentes
    expression = removeOuterParentheses(expression.trim());
    
    // Caso especial: expressão começa com sinal negativo
    if (expression.startsWith('-')) {
      // Tratar como multiplicação por -1
      const right = parseExpression(expression.substring(1).trim(), variable);
      if (!right) return null;
      
      return {
        type: 'product',
        left: { type: 'constant', value: -1 },
        right: right
      };
    }
    
    // Processa multiplicações implícitas (como 3x em vez de 3*x)
    expression = processImplicitMultiplications(expression);
    
    // Procura por adições e subtrações (pesquisando da direita para a esquerda para respeitar a precedência correta)
    let parenthesesCount = 0;
    let lastOpIndex = -1;
    
    for (let i = expression.length - 1; i >= 0; i--) {
      const char = expression[i];
      
      if (char === ')') parenthesesCount++;
      else if (char === '(') parenthesesCount--;
      
      // Considera apenas operadores fora de parênteses
      if (parenthesesCount === 0) {
        if ((char === '+' || char === '-') && 
            // Se é o primeiro caractere, não é um operador (é parte do número)
            (i > 0) && 
            // Se o caractere anterior não é um operador ou um parêntese de abertura
            // (evita tratar o sinal negativo como operador em casos como "3*-2" ou "(-2)")
            !(expression[i-1] === '*' || expression[i-1] === '/' || expression[i-1] === '^' || 
              expression[i-1] === '(' || expression[i-1] === 'e') && 
            // Não é parte de um número
            !isPartOfNumber(expression[i-1])) {
          lastOpIndex = i;
          break;
        }
      }
    }
    
    if (lastOpIndex !== -1) {
      const left = parseExpression(expression.substring(0, lastOpIndex).trim(), variable);
      const right = parseExpression(expression.substring(lastOpIndex + 1).trim(), variable);
      
      if (!left || !right) return null;
      
      return {
        type: expression[lastOpIndex] === '+' ? 'sum' : 'difference',
        left,
        right
      };
    }
    
    // Procura por multiplicações e divisões (também da direita para a esquerda)
    parenthesesCount = 0;
    lastOpIndex = -1;
    
    for (let i = expression.length - 1; i >= 0; i--) {
      const char = expression[i];
      
      if (char === ')') parenthesesCount++;
      else if (char === '(') parenthesesCount--;
      
      // Considera apenas operadores fora de parênteses
      if (parenthesesCount === 0) {
        if (char === '*' || char === '/') {
          lastOpIndex = i;
          break;
        }
      }
    }
    
    if (lastOpIndex !== -1) {
      const left = parseExpression(expression.substring(0, lastOpIndex).trim(), variable);
      const right = parseExpression(expression.substring(lastOpIndex + 1).trim(), variable);
      
      if (!left || !right) return null;
      
      return {
        type: expression[lastOpIndex] === '*' ? 'product' : 'quotient',
        left,
        right
      };
    }
    
    // Procura por potências (do início ao fim)
    parenthesesCount = 0;
    let powerIndex = -1;
    
    for (let i = 0; i < expression.length; i++) {
      const char = expression[i];
      
      if (char === '(') parenthesesCount++;
      else if (char === ')') parenthesesCount--;
      
      if (parenthesesCount === 0 && char === '^') {
        powerIndex = i;
        break;
      }
    }
    
    if (powerIndex !== -1) {
      const base = parseExpression(expression.substring(0, powerIndex).trim(), variable);
      let exponentStr = expression.substring(powerIndex + 1).trim();
      
      // Se o expoente estiver entre parênteses, extraí-lo
      if (exponentStr.startsWith('(') && exponentStr.endsWith(')')) {
        exponentStr = exponentStr.substring(1, exponentStr.length - 1).trim();
      }
      
      // Caso especial para e^x
      if (expression.startsWith('e^')) {
        const argTerm = parseExpression(exponentStr, variable);
        if (!argTerm) return null;
        
        return {
          type: 'exp',
          argument: argTerm
        };
      }
      
      // Tenta converter o expoente para um número
      const exponent = parseFloat(exponentStr);
      
      if (!base || isNaN(exponent)) return null;
      
      return {
        type: 'power',
        argument: base,
        exponent
      };
    }
    
    // Casos especiais para e^(x)
    if (expression.startsWith('e^(') && expression.indexOf(')') > 0) {
      const closeParenIndex = findMatchingCloseParen(expression, 2);
      if (closeParenIndex !== -1) {
        const argStr = expression.substring(3, closeParenIndex);
        const arg = parseExpression(argStr, variable);
        if (!arg) return null;
        
        return {
          type: 'exp',
          argument: arg
        };
      }
    }
    
    // Verifica se é 'e' como base do exponencial natural
    if (expression === 'e') {
      return { type: 'constant', value: Math.E };
    }
    
    // Procura por funções trigonométricas, logarítmicas, etc.
    if (expression.startsWith('sin(') && expression.endsWith(')')) {
      const argumentExpr = expression.substring(4, expression.length - 1);
      const argument = parseExpression(argumentExpr, variable);
      if (!argument) return null;
      
      return { type: 'sin', argument };
    }
    
    if (expression.startsWith('cos(') && expression.endsWith(')')) {
      const argumentExpr = expression.substring(4, expression.length - 1);
      const argument = parseExpression(argumentExpr, variable);
      if (!argument) return null;
      
      return { type: 'cos', argument };
    }
    
    if (expression.startsWith('tan(') && expression.endsWith(')')) {
      const argumentExpr = expression.substring(4, expression.length - 1);
      const argument = parseExpression(argumentExpr, variable);
      if (!argument) return null;
      
      return { type: 'tan', argument };
    }
    
    if (expression.startsWith('ln(') && expression.endsWith(')')) {
      const argumentExpr = expression.substring(3, expression.length - 1);
      const argument = parseExpression(argumentExpr, variable);
      if (!argument) return null;
      
      return { type: 'ln', argument };
    }
    
    if (expression.startsWith('log(') && expression.endsWith(')')) {
      const argumentExpr = expression.substring(4, expression.length - 1);
      const argument = parseExpression(argumentExpr, variable);
      if (!argument) return null;
      
      return { type: 'log', argument };
    }
    
    // Verifica se é a variável
    if (expression === variable) {
      return { type: 'variable', variable };
    }
    
    // Verifica se é uma constante
    const constantValue = parseFloat(expression);
    if (!isNaN(constantValue)) {
      return { type: 'constant', value: constantValue };
    }
    
    return null;
  } catch (error) {
    console.error("Erro ao analisar expressão:", expression, error);
    return null;
  }
};

// ===================================================
// ========== MANIPULAÇÃO DE EXPRESSÕES ==============
// ===================================================


// Converte um objeto Term em uma representação legível em string
// Usado para exibir resultados de derivadas, integrais e limites
export const termToString = (term: Term): string => {
  if (!term) return '';
  
  switch (term.type) {
    case 'constant':
      return term.value!.toString();
      
    case 'variable':
      return term.variable!;
      
    case 'power':
      const argStr = termToString(term.argument!);
      const needsParens = term.argument!.type !== 'variable' && 
                         term.argument!.type !== 'constant';
      
      if (term.exponent === 0) {
        return '1'; // Qualquer valor elevado a 0 é 1
      } else if (term.exponent === 1) {
        return argStr; // Qualquer valor elevado a 1 é ele mesmo
      } else {
        return needsParens ? `(${argStr})^${term.exponent}` : `${argStr}^${term.exponent}`;
      }
      
    case 'sin':
      return `sin(${termToString(term.argument!)})`;
      
    case 'cos':
      return `cos(${termToString(term.argument!)})`;
      
    case 'tan':
      return `tan(${termToString(term.argument!)})`;
      
    case 'ln':
      return `ln(${termToString(term.argument!)})`;
      
    case 'log':
      return `log(${termToString(term.argument!)})`;
      
    case 'exp':
      return `e^(${termToString(term.argument!)})`;
      
    case 'sum': {
      const leftStr = termToString(term.left!);
      const rightStr = termToString(term.right!);
      
      // Verifica se o termo direito é uma constante negativa para evitar "a + -b"
      if (term.right!.type === 'constant' && term.right!.value! < 0) {
        return `${leftStr} - ${Math.abs(term.right!.value!)}`;
      }
      
      // Verifica se o termo direito é uma expressão negativa para evitar "a + (-b)"
      if (term.right!.type === 'product' && 
          term.right!.left!.type === 'constant' && 
          term.right!.left!.value! < 0) {
        
        // Remove o sinal negativo e apresenta como subtração
        return `${leftStr} - ${termToString({
          type: 'product',
          left: { type: 'constant', value: -term.right!.left!.value! },
          right: term.right!.right!
        })}`;
      }
      
      return `${leftStr} + ${rightStr}`;
    }
      
    case 'difference': {
      const leftStr = termToString(term.left!);
      let rightStr = termToString(term.right!);
      
      // Se o lado direito já é um produto com constante negativa, apresenta como adição
      if (term.right!.type === 'product' && 
          term.right!.left!.type === 'constant' && 
          term.right!.left!.value! < 0) {
        
        return `${leftStr} + ${termToString({
          type: 'product',
          left: { type: 'constant', value: -term.right!.left!.value! },
          right: term.right!.right!
        })}`;
      }
      
      // Adiciona parênteses ao termo direito se for uma soma ou diferença
      if (term.right!.type === 'sum' || term.right!.type === 'difference') {
        rightStr = `(${rightStr})`;
      }
      
      return `${leftStr} - ${rightStr}`;
    }
      
    case 'product': {
      // Casos especiais para multiplicação
      if (term.left!.type === 'constant' && term.left!.value === 0) {
        return '0'; // 0 * qualquer coisa = 0
      }
      
      if (term.left!.type === 'constant' && term.left!.value === 1) {
        return termToString(term.right!); // 1 * algo = algo
      }
      
      if (term.right!.type === 'constant' && term.right!.value === 0) {
        return '0'; // qualquer coisa * 0 = 0
      }
      
      if (term.right!.type === 'constant' && term.right!.value === 1) {
        return termToString(term.left!); // algo * 1 = algo
      }
      
      // Caso especial para -1 * algo = -algo
      if (term.left!.type === 'constant' && term.left!.value === -1) {
        const rightStr = termToString(term.right!);
        
        // Se o lado direito for uma soma ou diferença, vamos distribuir o -1
        if (term.right!.type === 'sum') {
          // Para soma (a + b), transformamos em (-a - b)
          return termToString({
            type: 'difference',
            left: {
              type: 'product',
              left: { type: 'constant', value: -1 },
              right: term.right!.left!
            },
            right: term.right!.right!
          });
        } else if (term.right!.type === 'difference') {
          // Para diferença (a - b), transformamos em (-a + b)
          // -1 * (a - b) = -a + b
          return termToString({
            type: 'sum',
            left: {
              type: 'product',
              left: { type: 'constant', value: -1 },
              right: term.right!.left!
            },
            right: term.right!.right!
          });
        }
        
        // Para outros tipos de termo, apenas adiciona o sinal de menos
        return `-${rightStr}`;
      }
      
      let leftStr = termToString(term.left!);
      let rightStr = termToString(term.right!);
      
      // Formato para coeficiente * variável - usa notação como "3x" em vez de "3 × x"
      if (term.left!.type === 'constant' && 
          (term.right!.type === 'variable' || term.right!.type === 'power' || 
           term.right!.type === 'sin' || term.right!.type === 'cos' || 
           term.right!.type === 'tan')) {
        return `${leftStr}${rightStr}`;
      }
      
      // Adiciona parênteses conforme necessário
      if (term.left!.type === 'sum' || term.left!.type === 'difference') {
        leftStr = `(${leftStr})`;
      }
      
      if (term.right!.type === 'sum' || term.right!.type === 'difference') {
        rightStr = `(${rightStr})`;
      }
      
      // Caso especial para produtos de funções trigonométricas, como sin(x) * cos(x)
      if ((term.left!.type === 'sin' && term.right!.type === 'cos') ||
          (term.left!.type === 'cos' && term.right!.type === 'sin')) {
        if (areTermsEqual(term.left!.argument!, term.right!.argument!)) {
          // Produto especial: sin(x) * cos(x) = sin(x)cos(x)
          return `${leftStr}${rightStr}`;
        }
      }
      
      return `${leftStr} × ${rightStr}`;
    }
      
    case 'quotient': {
      // Casos especiais para divisão
      if (term.left!.type === 'constant' && term.left!.value === 0) {
        return '0'; // 0 / qualquer coisa = 0
      }
      
      if (term.right!.type === 'constant' && term.right!.value === 1) {
        return termToString(term.left!); // algo / 1 = algo
      }
      
      let leftStr = termToString(term.left!);
      let rightStr = termToString(term.right!);
      
      // Adiciona parênteses conforme necessário
      if (term.left!.type === 'sum' || term.left!.type === 'difference') {
        leftStr = `(${leftStr})`;
      }
      
      if (term.right!.type === 'sum' || term.right!.type === 'difference' ||
          term.right!.type === 'product' || term.right!.type === 'quotient') {
        rightStr = `(${rightStr})`;
      }
      
      return `${leftStr}/${rightStr}`;
    }
      
    default:
      return '';
  }
};


// Nega um termo (multiplica por -1)
// Função de utilidade usada em várias operações de cálculo
export const negateTerm = (termo: Term): Term => {
  if (termo.type === 'constant') {
    return { type: 'constant', value: -termo.value! };
  } else if (termo.type === 'product' && termo.left!.type === 'constant') {
    return {
      type: 'product',
      left: { type: 'constant', value: -termo.left!.value! },
      right: termo.right!
    };
  } else {
    return {
      type: 'product',
      left: { type: 'constant', value: -1 },
      right: termo
    };
  }
};


// Verifica se dois termos são estruturalmente iguais
// Útil para simplificação e comparação de expressões
export const areTermsEqual = (termo1: Term, termo2: Term): boolean => {
  if (termo1.type !== termo2.type) return false;
  
  switch (termo1.type) {
    case 'constant':
      return termo1.value === (termo2 as { value?: number }).value;
      
    case 'variable':
      return termo1.variable === (termo2 as { variable?: string }).variable;
      
    case 'power':
      return termo1.exponent === (termo2 as { exponent?: number }).exponent &&
             areTermsEqual(termo1.argument!, (termo2 as { argument?: Term }).argument!);
    
    case 'sin':
    case 'cos':
    case 'tan':
    case 'ln':
    case 'log':
    case 'exp':
      return areTermsEqual(termo1.argument!, (termo2 as { argument?: Term }).argument!);
      
    case 'sum':
    case 'difference':
    case 'product':
    case 'quotient':
      return areTermsEqual(termo1.left!, (termo2 as { left?: Term }).left!) &&
             areTermsEqual(termo1.right!, (termo2 as { right?: Term }).right!);
    
    default:
      return false;
  }
};

// ===================================================
// ========== GERAÇÃO DE DADOS ALEATÓRIOS ============
// ===================================================


// Gera pontos aleatórios dentro de um intervalo especificado para métodos de aproximação numérica
// Útil para integração de Monte Carlo, limites numéricos, etc.
export const generateRandomPoints = (min: number, max: number, count: number): number[] => {
  if (min >= max) {
    throw new Error('Minimum value must be less than maximum value');
  }
  
  if (count <= 0) {
    throw new Error('Count must be a positive number');
  }
  
  const range = max - min;
  const points: number[] = [];
  
  for (let i = 0; i < count; i++) {
    const randomValue = min + Math.random() * range;
    points.push(randomValue);
  }
  
  // Ordena os pontos para facilitar o uso em alguns algoritmos
  return points.sort((a, b) => a - b);
};

// ===================================================
// ========== AVALIAÇÃO NUMÉRICA DE TERMOS ===========
// ===================================================

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

// ===================================================
// ================= EXEMPLOS ÚTEIS =================
// ===================================================

// Retorna exemplos de funções matemáticas para cálculo de derivadas
export const getDerivativesExamples = (): string[] => {
  return [
    'x^2 + 3x',
    'x^3 - 2x^2 + 5x - 3',
    'sin(x)',
    'cos(x)',
    'e^(x)',
    'ln(x)',
    'ln(x^2)',
    'x / (x^2 + 1)',
    'sin(x) * cos(x)',
    'e^(x) * sin(x)',
    'x^2 * ln(x)',
    '(x^2 + 1) / (x - 1)'
  ];
};
