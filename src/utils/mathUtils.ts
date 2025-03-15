// ===================================================
// ========== FUNÇÕES MATEMÁTICAS BÁSICAS =============
// ===================================================

// Arredonda um número para um número específico de casas decimais
export const roundToDecimals = (num: number, decimais: number = 2): number=> {
    const factor = Math.pow(10, decimais);
    return Math.round(num * factor) / factor;
};

// Checa se dois números são aproximadamente iguais
// Útil para comparações com ponto flutuante
export const approximatelyEqual = (a: number, b: number, precisao: number = 1e-10): boolean => {
    return Math.abs(a - b) < precisao;
};

// Calcula o mínimo múltiplo comum (MMC) de dois números
export const lcm = (a: number, b: number): number => {
    const gcdValue = gcd(a, b);
    return (a * b) / gcdValue;
};

// Calcula o máximo divisor comum (MDC) de dois números
// Utiliza o algoritmo de Euclides
export const gcd = (a: number, b: number): number => {
    a = Math.abs(a);
    b = Math.abs(b);
    
    while (b) {
        const temp = b;
        b = a % b;
        a = temp;
    }
    return a;
};

// ===================================================
// ========== ANÁLISE DE CARACTERES E STRINGS ========
// ===================================================

// Verifica se um caractere é um dígito
export const isDigit = (char: string): boolean => {
    return /^\d$/.test(char);
};

// Verifica se um caractere é uma letra
export const isLetter = (char: string): boolean => {
    return /^[a-zA-Z]$/.test(char);
};

// Verifica se um caractere é parte de um número (dígito ou ponto decimal)
export const isPartOfNumber = (char: string): boolean => {
    return isDigit(char) || char === '.';
};

// Encontra o parêntese de fechamento correspondente ao parêntese de abertura
// Retorna o índice do parêntese de fechamento ou -1 se não encontrado
export const findMatchingCloseParen = (expression: string, openParenIndex: number): number => {
    let count = 1;
    for (let i = openParenIndex + 1; i < expression.length; i++) {
        if (expression[i] === '(') count++;
        else if (expression[i] === ')') count--;
        
        if (count === 0) return i;
    }
    return -1; // Não encontrou o parêntese de fechamento
};

// Remove parênteses externos se eles envolvem toda a expressão
// Útil para simplificar expressões antes de processamento adicional
export const removeOuterParentheses = (expr: string): string => {
    expr = expr.trim();
    
    // Se a expressão não começa com '(' ou não termina com ')', não faz nada
    if (expr[0] !== '(' || expr[expr.length - 1] !== ')') return expr;
    
    // Verifica se o parêntese de fechamento no final corresponde ao de abertura no início
    let count = 0;
    for (let i = 0; i < expr.length; i++) {
        if (expr[i] === '(') count++;
        else if (expr[i] === ')') count--;
        
        // Se o contador chegar a zero antes do final, então os parênteses externos não englobam toda a expressão
        if (count === 0 && i < expr.length - 1) return expr;
    }
    
    // Remove os parênteses externos e chama recursivamente para verificar outros pares externos
    return removeOuterParentheses(expr.substring(1, expr.length - 1));
};

// ===================================================
// ========== FORMATAÇÃO RELACIONADA A PI (π) ========
// ===================================================

// Lista comum de frações de π para formatação
export const fracoesDePi = [
    { valor: Math.PI/6, str: 'π/6' },
    { valor: Math.PI/4, str: 'π/4' },
    { valor: Math.PI/3, str: 'π/3' },
    { valor: Math.PI/2, str: 'π/2' },
    { valor: 2*Math.PI/3, str: '2π/3' },
    { valor: 3*Math.PI/4, str: '3π/4' },
    { valor: 5*Math.PI/6, str: '5π/6' },
    { valor: 7*Math.PI/6, str: '7π/6' },
    { valor: 5*Math.PI/4, str: '5π/4' },
    { valor: 4*Math.PI/3, str: '4π/3' },
    { valor: 3*Math.PI/2, str: '3π/2' },
    { valor: 5*Math.PI/3, str: '5π/3' },
    { valor: 7*Math.PI/4, str: '7π/4' },
    { valor: 11*Math.PI/6, str: '11π/6' },
    { valor: -Math.PI/6, str: '-π/6' },
    { valor: -Math.PI/4, str: '-π/4' },
    { valor: -Math.PI/3, str: '-π/3' },
    { valor: -Math.PI/2, str: '-π/2' }
];

// Formatador unificado para valores de PI com diversas opções
// Função base para todas as funções de formatação relacionadas a PI
export const formatPiValue = (value: number, precision: number = 4, normalize: boolean = false): string => {
  // Normalização para o intervalo [0, 2π) se solicitado
  let valueToFormat = normalize 
      ? ((value % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI) 
      : value;
      
  // Check exact matches first
  if (Math.abs(valueToFormat) < 1e-10) return '0';
  
  // Check common fractions of π
  for (const fracao of fracoesDePi) {
    if (Math.abs(valueToFormat - fracao.valor) < 1e-10) {
      return fracao.str;
    }
  }
  
  // Check if it's a simple multiple of π
  const piRatio = valueToFormat / Math.PI;
  if (Math.abs(piRatio - Math.round(piRatio)) < 1e-10) {
    const intPart = Math.round(piRatio);
    if (intPart === 1) return 'π';
    if (intPart === -1) return '-π';
    return `${intPart}π`;
  }
  
  // For other values, format with the specified precision
  return valueToFormat.toFixed(precision);
};

// Formata um valor em radianos para exibição SEM normalização para [0, 2π)
// Converte valores comuns para representação com π quando possível
export const formatInterval = (valor: number): string => {
  return formatPiValue(valor, 4, false);
};

// Formata um valor em radianos para exibição, usando π quando apropriado e normalizando para [0, 2π)
// Útil para exibir ângulos em contextos trigonométricos
export const formatRadians = (radianos: number): string => {
  return formatPiValue(radianos, 4, true);
};

// ===================================================
// ========== PROCESSAMENTO DE EXPRESSÕES ============
// ===================================================

// Processa multiplicações implícitas (como 3x ao invés de 3*x) em expressões matemáticas
// Identifica e insere os operadores de multiplicação ausentes
export const processImplicitMultiplications = (expression: string): string => {
  let result = '';
  let i = 0;
  
  while (i < expression.length) {
    // Verifica se temos um número
    if (isDigit(expression[i]) || (expression[i] === '.' && i + 1 < expression.length && isDigit(expression[i + 1]))) {
      // Encontra o final do número
      let numEnd = i;
      while (numEnd < expression.length && (isDigit(expression[numEnd]) || expression[numEnd] === '.')) {
        numEnd++;
      }
      
      // Adiciona o número ao resultado
      result += expression.substring(i, numEnd);
      
      // Verifica se o próximo caractere é uma letra (variável) ou parêntese de abertura
      if (numEnd < expression.length && 
          (isLetter(expression[numEnd]) || expression[numEnd] === '(' || 
           expression.substring(numEnd).startsWith('sin(') ||
           expression.substring(numEnd).startsWith('cos(') ||
           expression.substring(numEnd).startsWith('tan(') ||
           expression.substring(numEnd).startsWith('ln(') ||
           expression.substring(numEnd).startsWith('log('))) {
        // Insere um asterisco (*) para a multiplicação implícita
        result += '*';
      }
      
      i = numEnd;
    } else {
      // Adiciona o caractere atual
      result += expression[i];
      i++;
    }
  }
  
  return result;
};

// Substitui símbolos de π/pi por Math.PI em uma expressão
// Trata casos como 2π, adicionando operadores de multiplicação quando necessário
export const replacePi = (expressao: string): string => {
  // Preparar a string, removendo espaços
  expressao = expressao.trim();
  
  // Substituir π por Math.PI, adicionando * quando necessário
  expressao = expressao
      .replace(/(\d)π/g, '$1*Math.PI')
      .replace(/(\d)pi/g, '$1*Math.PI')
      .replace(/π/g, 'Math.PI')
      .replace(/pi/g, 'Math.PI');
  
  return expressao;
};

// ===================================================
// ========== AVALIAÇÃO DE EXPRESSÕES ================
// ===================================================

// Avalia um objeto Term para valores específicos de variáveis
// Função central utilizada em módulos de cálculo, trigonometria e outros
export const evaluateTermForValue = (
  term: any, 
  variableName: string, 
  value: number
): number => {
  if (!term) {
    throw new Error('Invalid term');
  }

  switch (term.type) {
    case 'constant':
      return term.value;
      
    case 'variable':
      return term.variable === variableName ? value : NaN;
      
    case 'power':
      const base = evaluateTermForValue(term.argument, variableName, value);
      return Math.pow(base, term.exponent);
      
    case 'sin':
      return Math.sin(evaluateTermForValue(term.argument, variableName, value));
      
    case 'cos':
      return Math.cos(evaluateTermForValue(term.argument, variableName, value));
      
    case 'tan':
      return Math.tan(evaluateTermForValue(term.argument, variableName, value));
      
    case 'ln':
      const lnArg = evaluateTermForValue(term.argument, variableName, value);
      if (lnArg <= 0) throw new Error('Cannot compute logarithm of zero or negative number');
      return Math.log(lnArg);
      
    case 'log':
      const logArg = evaluateTermForValue(term.argument, variableName, value);
      if (logArg <= 0) throw new Error('Cannot compute logarithm of zero or negative number');
      return Math.log10(logArg);
      
    case 'exp':
      return Math.exp(evaluateTermForValue(term.argument, variableName, value));
      
    case 'sum':
      return evaluateTermForValue(term.left, variableName, value) + 
             evaluateTermForValue(term.right, variableName, value);
      
    case 'difference':
      return evaluateTermForValue(term.left, variableName, value) - 
             evaluateTermForValue(term.right, variableName, value);
      
    case 'product':
      return evaluateTermForValue(term.left, variableName, value) * 
             evaluateTermForValue(term.right, variableName, value);
      
    case 'quotient':
      const denominator = evaluateTermForValue(term.right, variableName, value);
      if (Math.abs(denominator) < 1e-10) throw new Error('Division by zero');
      return evaluateTermForValue(term.left, variableName, value) / denominator;
      
    default:
      throw new Error(`Unknown term type: ${term.type}`);
  }
};

// Avaliação unificada de expressões matemáticas
// Função central que todas as outras funções de avaliação utilizam
export const evaluateExpression = (expression: string, variableName: string, value: number): number => {
  try {
    // Pré-processar a expressão
    let expressaoProcessada = expression.trim();
    
    // Normalizar espaços para facilitar o processamento
    expressaoProcessada = expressaoProcessada.replace(/\s+/g, ' ');
    
    // Remover espaços desnecessários dentro de parênteses: "( x )" -> "(x)"
    expressaoProcessada = expressaoProcessada.replace(/\(\s+/g, '(').replace(/\s+\)/g, ')');
    
    // Normalizar espaços ao redor de operadores: "x + 2" -> "x+2", "y - 3" -> "y-3"
    expressaoProcessada = expressaoProcessada.replace(/(\S)\s*([+\-])\s*(\S)/g, '$1$2$3');
    
    // Processar notações especiais de funções trigonométricas
    const funcoesTrig = ['sen', 'sin', 'cos', 'tan', 'tg', 'cot', 'cotg', 'sec', 'csc'];
    for (const funcao of funcoesTrig) {
      // Converte notações como "sen^2(x)" para "(sen(x))^2"
      const regexFuncaoPotencia = new RegExp(`${funcao}\\^(\\d+)\\(([^)]*)\\)`, 'g');
      expressaoProcessada = expressaoProcessada.replace(regexFuncaoPotencia, `(${funcao}($2))^$1`);
    }
    
    // Padronizar funções para o parser
    expressaoProcessada = expressaoProcessada
      .replace(/sen\(/g, 'sin(')
      .replace(/tg\(/g, 'tan(')
      .replace(/cotg\(/g, 'cot(')
      .replace(/\^/g, '**');
    
    // Processar multiplicações implícitas
    expressaoProcessada = processImplicitMultiplications(expressaoProcessada);
    
    // Substituir pi
    expressaoProcessada = replacePi(expressaoProcessada);
    
    // Tentar usar o parser de expressões do cálculo (importado em outros arquivos)
    // Este import precisa ser feito nos arquivos que usam esta função
    // Neste arquivo, vamos usar o método dinâmico
    
    // Método dinâmico: abordagem dinâmica com new Function
    const funcaoExpr = new Function(variableName, `
      const sen = Math.sin;
      const sin = Math.sin;
      const cos = Math.cos;
      const tan = Math.tan;
      const tg = Math.tan;
      const cot = (x) => 1/Math.tan(x);
      const cotg = (x) => 1/Math.tan(x);
      const sec = (x) => 1/Math.cos(x);
      const csc = (x) => 1/Math.sin(x);
      const π = Math.PI;
      const pi = Math.PI;
      const sqrt = Math.sqrt;
      
      // Verificar divisão por zero
      const verificarDivisao = (fn) => {
        const result = fn();
        if (!isFinite(result)) {
          throw new Error('Divisão por zero ou outro erro de cálculo');
        }
        return result;
      };
      
      try {
        return verificarDivisao(() => ${expressaoProcessada});
      } catch (e) {
        throw e;
      }
    `);
    
    // Executa a função com o valor
    return funcaoExpr(value);
  } catch (error) {
    throw new Error(`Erro ao avaliar a expressão: ${error instanceof Error ? error.message : String(error)}`);
  }
};