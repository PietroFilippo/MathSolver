// ===================================================
// ========== FUNÇÕES MATEMÁTICAS BÁSICAS ============
// ===================================================

// Re-exporta funções de expressões do módulo especializado
export { 
  processImplicitMultiplications,
  replacePi,
  findMatchingCloseParen,
  removeOuterParentheses,
  evaluateTermForValue,
  evaluateExpression
} from './mathUtilsCalculo/geral/expressionUtils';

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

// Cache para formatação de valores de PI
const piValueCache = new Map<string, string>();

// Formatador unificado para valores de PI com diversas opções
// Função base para todas as funções de formatação relacionadas a PI
export const formatPiValue = (value: number, precision: number = 4, normalize: boolean = false): string => {
  // Gera uma chave de cache única para esta combinação de parâmetros
  const cacheKey = `${value}_${precision}_${normalize}`;
  if (piValueCache.has(cacheKey)) {
    return piValueCache.get(cacheKey)!;
  }
  
  // Normalização para o intervalo [0, 2π) se solicitado
  let valueToFormat = normalize 
      ? ((value % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI) 
      : value;
      
  // Checa se o valor é zero
  if (Math.abs(valueToFormat) < 1e-10) {
    const result = '0';
    piValueCache.set(cacheKey, result);
    return result;
  }
  
  // Checa frações comuns de π
  for (const fracao of fracoesDePi) {
    if (Math.abs(valueToFormat - fracao.valor) < 1e-10) {
      piValueCache.set(cacheKey, fracao.str);
      return fracao.str;
    }
  }
  
  // Checa se é um múltiplo simples de π
  const piRatio = valueToFormat / Math.PI;
  if (Math.abs(piRatio - Math.round(piRatio)) < 1e-10) {
    const intPart = Math.round(piRatio);
    let result;
    if (intPart === 1) result = 'π';
    else if (intPart === -1) result = '-π';
    else result = `${intPart}π`;
    
    piValueCache.set(cacheKey, result);
    return result;
  }
  
  // Para outros valores, formata com a precisão especificada
  const result = valueToFormat.toFixed(precision);
  piValueCache.set(cacheKey, result);
  return result;
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