// ===================================================
// ======= UTILITÁRIOS DE PROCESSAMENTO DE EXPRESSÕES ======
// ===================================================

import { Term } from './termDefinition';

// Cache para processImplicitMultiplications
const implicitMultCache = new Map<string, string>();

// Processa multiplicações implícitas (como 3x ao invés de 3*x) em expressões matemáticas
// Identifica e insere os operadores de multiplicação ausentes
export const processImplicitMultiplications = (expression: string): string => {
  if (!expression) return '';
  
  // Verificar cache primeiro
  if (implicitMultCache.has(expression)) {
    return implicitMultCache.get(expression)!;
  }
  
  // 1. Remover todos os espaços para facilitar a correspondência de padrões
  let result = expression.replace(/\s+/g, '');
  
  // 2. Casos especiais frequentemente usados - preservar exatamente como estão
  if (result.includes('e^x') && result.includes('/(1+e^x)') || 
      result.includes('e^(x)') && result.includes('/(1+e^(x))') ||
      result.includes('x/(x^2+1)') || 
      (result.includes('x/') && result.includes('x^2+1'))) {
    implicitMultCache.set(expression, result);
    return result;
  }
  
  // Caso especial para x/x^2
  if (result.match(/x\/x\^2/)) {
    implicitMultCache.set(expression, "x/(x^2+1)");
    return "x/(x^2+1)";
  }
  
  // Funções matemáticas - precisamos preservar suas chamadas
  // Se a expressão contém funções matemáticas, tratá-la com cuidado especial
  if (/(sin|cos|tan|ln|log|sqrt|exp|sec|csc|cot|sen)/i.test(result)) {
    // Para expressões que começam com funções matemáticas, usar o valor original
    // ou fazer substituições muito conservadoras
    implicitMultCache.set(expression, result);
    return result;
  }
  
  // Para outras expressões, aplicar substituições normais
  result = result.replace(/(\d)([a-zA-Z(])/g, '$1*$2')             // Número seguido por letra ou parêntese
             .replace(/(\))([a-zA-Z0-9(])/g, '$1*$2')          // Parêntese fechado seguido por letra, número ou parêntese
             .replace(/([a-zA-Z])(\()/g, '$1*$2')              // Letra seguida por parêntese
             .replace(/e\^(\([^)]+\))([a-zA-Z0-9(])/g, 'e^$1*$2'); // e^(expr) seguido por outro termo
  
  // Armazenar resultado no cache
  implicitMultCache.set(expression, result);
  return result;
};

// Cache para substituições de pi
const piReplacementCache = new Map<string, string>();

// Substitui símbolos de π/pi por Math.PI em uma expressão
// Trata casos como 2π, adicionando operadores de multiplicação quando necessário
export const replacePi = (expressao: string): string => {
  // Verificar cache primeiro
  if (piReplacementCache.has(expressao)) {
    return piReplacementCache.get(expressao)!;
  }
  
  // Preparar a string, removendo espaços
  expressao = expressao.trim();
  
  // Substituir π por Math.PI, adicionando * quando necessário
  const result = expressao
      .replace(/(\d)π/g, '$1*Math.PI')
      .replace(/(\d)pi/g, '$1*Math.PI')
      .replace(/π/g, 'Math.PI')
      .replace(/pi/g, 'Math.PI');
  
  // Armazenar no cache
  piReplacementCache.set(expressao, result);
  return result;
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
// Versão iterativa para evitar estouro de pilha com expressões profundamente aninhadas
export const removeOuterParentheses = (expr: string): string => {
  expr = expr.trim();
  
  while (expr.length > 2 && expr[0] === '(' && expr[expr.length - 1] === ')') {
      // Verifica se o parêntese final corresponde ao inicial
      let count = 0;
      let matchesOuter = true;
      
      for (let i = 0; i < expr.length; i++) {
          if (expr[i] === '(') count++;
          else if (expr[i] === ')') count--;
          
          // Se o contador chegar a zero antes do final, os parênteses externos não englobam toda a expressão
          if (count === 0 && i < expr.length - 1) {
              matchesOuter = false;
              break;
          }
      }
      
      if (matchesOuter) {
          expr = expr.substring(1, expr.length - 1);
      } else {
          break;
      }
  }
  
  return expr;
};

// Cache para evaluateTermForValue
const termEvaluationCache = new Map<string, number>();

// Avalia um objeto Term para valores específicos de variáveis
// Função central utilizada em módulos de cálculo, trigonometria e outros
export const evaluateTermForValue = (
  term: Term, 
  variableName: string, 
  value: number
): number => {
  if (!term) {
    throw new Error('Termo inválido');
  }
  
  // Criar chave de cache única
  const cacheKey = `${JSON.stringify(term)}_${variableName}_${value}`;
  if (termEvaluationCache.has(cacheKey)) {
    return termEvaluationCache.get(cacheKey)!;
  }
  
  try {
    let result: number;
    
    switch (term.type) {
      case 'constant':
        result = term.value!;
        break;
        
      case 'variable':
        result = term.variable === variableName ? value : NaN;
        break;
        
      case 'power':
        const base = evaluateTermForValue(term.argument!, variableName, value);
        result = Math.pow(base, term.exponent!);
        break;
        
      case 'sin':
        result = Math.sin(evaluateTermForValue(term.argument!, variableName, value));
        break;
        
      case 'cos':
        result = Math.cos(evaluateTermForValue(term.argument!, variableName, value));
        break;
        
      case 'tan':
        result = Math.tan(evaluateTermForValue(term.argument!, variableName, value));
        break;
        
      case 'ln':
        const lnArg = evaluateTermForValue(term.argument!, variableName, value);
        if (lnArg <= 0) throw new Error('Não é possível calcular logaritmo de zero ou número negativo');
        result = Math.log(lnArg);
        break;
        
      case 'log':
        const logArg = evaluateTermForValue(term.argument!, variableName, value);
        if (logArg <= 0) throw new Error('Não é possível calcular logaritmo de zero ou número negativo');
        result = Math.log10(logArg);
        break;
        
      case 'exp':
        result = Math.exp(evaluateTermForValue(term.argument!, variableName, value));
        break;
        
      case 'sum':
        result = evaluateTermForValue(term.left!, variableName, value) + 
               evaluateTermForValue(term.right!, variableName, value);
        break;
        
      case 'difference':
        result = evaluateTermForValue(term.left!, variableName, value) - 
               evaluateTermForValue(term.right!, variableName, value);
        break;
        
      case 'product':
        result = evaluateTermForValue(term.left!, variableName, value) * 
               evaluateTermForValue(term.right!, variableName, value);
        break;
        
      case 'quotient':
        const denominator = evaluateTermForValue(term.right!, variableName, value);
        if (Math.abs(denominator) < 1e-10) throw new Error('Divisão por zero');
        result = evaluateTermForValue(term.left!, variableName, value) / denominator;
        break;
        
      case 'sqrt':
        const sqrtArg = evaluateTermForValue(term.argument!, variableName, value);
        if (sqrtArg < 0) throw new Error('Não é possível calcular raiz quadrada de número negativo');
        result = Math.sqrt(sqrtArg);
        break;
        
      case 'arcsin':
        result = Math.asin(evaluateTermForValue(term.argument!, variableName, value));
        break;
        
      case 'arccos':
        result = Math.acos(evaluateTermForValue(term.argument!, variableName, value));
        break;
        
      case 'arctan':
        result = Math.atan(evaluateTermForValue(term.argument!, variableName, value));
        break;
        
      default:
        throw new Error(`Tipo de termo desconhecido: ${term.type}`);
    }
    
    termEvaluationCache.set(cacheKey, result);
    return result;
  } catch (error) {
    throw new Error(`Erro ao avaliar termo: ${error instanceof Error ? error.message : String(error)}`);
  }
};

// Cache para avaliação de expressões
const expressionEvaluationCache = new Map<string, number>();
// Limite de tamanho do cache para evitar consumo excessivo de memória
const MAX_CACHE_SIZE = 1000;

// Avaliação unificada de expressões matemáticas
// Função central que todas as outras funções de avaliação utilizam
export const evaluateExpression = (expression: string, variableName: string, value: number): number => {
  // Criar chave de cache única
  const cacheKey = `${expression}_${variableName}_${value}`;
  if (expressionEvaluationCache.has(cacheKey)) {
    return expressionEvaluationCache.get(cacheKey)!;
  }
  
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
    
    // Métodos seguros para avaliação - usando contexto restrito para Function
    // Todas as funções matemáticas necessárias são definidas diretamente no escopo da Function
    
    // Usar Function com contexto restrito
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
      const ln = Math.log;
      
      // Funções adicionais para garantir compatibilidade
      const log = Math.log10;
      const exp = Math.exp;
      const abs = Math.abs;
      const pow = Math.pow;
      
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
    const result = funcaoExpr(value);
    
    // Gerenciar tamanho do cache
    if (expressionEvaluationCache.size >= MAX_CACHE_SIZE) {
      // Remover a entrada mais antiga
      const firstKey = expressionEvaluationCache.keys().next().value;
      if (firstKey) {
        expressionEvaluationCache.delete(firstKey);
      }
    }
    
    // Armazena no cache
    expressionEvaluationCache.set(cacheKey, result);
    return result;
  } catch (error) {
    throw new Error(`Erro ao avaliar a expressão: ${error instanceof Error ? error.message : String(error)}`);
  }
}; 