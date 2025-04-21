// ===================================================
// ========= AVALIADOR DE EXPRESSÕES PARA INEQUAÇÕES ===
// ===================================================

// Cache para expressões avaliadas
const evaluatedExpressionCache: Map<string, string> = new Map();

// Avalia e simplifica uma expressão algébrica
export const simplifyExpression = (expression: string): string => {
  // Verificar cache primeiro
  if (evaluatedExpressionCache.has(expression)) {
    return evaluatedExpressionCache.get(expression)!;
  }

  // Verificar se esta é uma expressão quadrática com um valor numérico substituído pela variável
  // Este padrão corresponde a expressões como: ax^2 + bx + c com x substituído por um número entre parênteses
  const quadraticPattern = /(-?\d*)\s*\(\s*(-?[\d.]+)\s*\)\s*[\^²]2?\s*([+-])\s*(-?\d*)\s*\(\s*(-?[\d.]+)\s*\)\s*([+-])\s*(-?\d+)/;
  const match = expression.match(quadraticPattern);
  
  if (match) {
    try {
      // Extrair coeficientes e o valor
      let a = match[1] === '' || match[1] === '-' ? (match[1] === '-' ? -1 : 1) : parseFloat(match[1]);
      const x = parseFloat(match[2]);
      const op1 = match[3] === '+' ? 1 : -1;
      let b = match[4] === '' || match[4] === '-' ? (match[4] === '-' ? -1 : 1) : parseFloat(match[4]);
      b = b * op1;
      const op2 = match[6] === '+' ? 1 : -1;
      const c = parseFloat(match[7]) * op2;
      
      // Avaliar a expressão quadrática: ax² + bx + c
      const result = a * Math.pow(x, 2) + b * x + c;
      
      // Armazenar no cache
      evaluatedExpressionCache.set(expression, result.toString());
      return result.toString();
    } catch (error) {
    }
  }
  
  // Caso especial para expressões quadráticas simples como (x)² - 4
  const simpleQuadraticPattern = /\(\s*(-?[\d.]+)\s*\)[\^²]2\s*([+-])\s*(\d+)/;
  const simpleMatch = expression.match(simpleQuadraticPattern);
  
  if (simpleMatch) {
    try {
      const x = parseFloat(simpleMatch[1]);
      const op = simpleMatch[2] === '+' ? 1 : -1;
      const c = parseFloat(simpleMatch[3]) * op;
      
      // Avaliar a expressão quadrática simples: x² + c
      const result = Math.pow(x, 2) + c;
      
      // Armazenar no cache
      evaluatedExpressionCache.set(expression, result.toString());
      return result.toString();
    } catch (error) {
    }
  }
  
  // Padrão para coeficiente seguido diretamente por um valor entre parênteses como -2(4) ou 3(5)
  const coefficientParenPattern = /^(-?\d*)\((-?[\d.]+)\)$/;
  const coefficientParenMatch = expression.match(coefficientParenPattern);
  
  if (coefficientParenMatch) {
    try {
      let coef = coefficientParenMatch[1];
      // Lidar com casos onde coef é apenas '-' ou vazio
      if (coef === '-') coef = '-1';
      else if (coef === '' || coef === '+') coef = '1';
      
      const a = parseFloat(coef);
      const x = parseFloat(coefficientParenMatch[2]);
      
      // Avaliar a expressão: a(x) = a * x
      const result = a * x;
      
      // Armazenar no cache
      evaluatedExpressionCache.set(expression, result.toString());
      return result.toString();
    } catch (error) {
    }
  }
  
  // Padrão para expressões como (6)² - 4 ou (6)² + 3
  const squareSuperscriptPattern = /\(\s*(-?[\d.]+)\s*\)²\s*([+-])\s*(\d+)/;
  const squareSuperscriptMatch = expression.match(squareSuperscriptPattern);
  
  if (squareSuperscriptMatch) {
    try {
      const x = parseFloat(squareSuperscriptMatch[1]);
      const op = squareSuperscriptMatch[2] === '+' ? 1 : -1;
      const c = parseFloat(squareSuperscriptMatch[3]) * op;
      
      // Avaliar a expressão com sobrescrito: (x)² + c
      const result = Math.pow(x, 2) + c;
      
      // Armazenar no cache
      evaluatedExpressionCache.set(expression, result.toString());
      return result.toString();
    } catch (error) {
    }
  }
  
  // Padrão para apenas um termo quadrático como (6)² sem operações adicionais
  const simpleSquarePattern = /^\(\s*(-?[\d.]+)\s*\)²$/;
  const simpleSquareMatch = expression.match(simpleSquarePattern);
  
  if (simpleSquareMatch) {
    try {
      const x = parseFloat(simpleSquareMatch[1]);
      const result = Math.pow(x, 2);
      
      // Armazenar no cache
      evaluatedExpressionCache.set(expression, result.toString());
      return result.toString();
    } catch (error) {
    }
  }
  
  // Padrão para expressões lineares como 2(x) + 3 ou -2(x) - 5
  const linearPattern = /(-?\d*)\s*\(\s*(-?[\d.]+)\s*\)\s*([+-])\s*(\d+)/;
  const linearMatch = expression.match(linearPattern);
  
  if (linearMatch) {
    try {
      let a = linearMatch[1] === '' || linearMatch[1] === '-' ? (linearMatch[1] === '-' ? -1 : 1) : parseFloat(linearMatch[1]);
      const x = parseFloat(linearMatch[2]);
      const op = linearMatch[3] === '+' ? 1 : -1;
      const c = parseFloat(linearMatch[4]) * op;
      
      // Avaliar a expressão linear: ax + c
      const result = a * x + c;
      
      // Armazenar no cache
      evaluatedExpressionCache.set(expression, result.toString());
      return result.toString();
    } catch (error) {
    }
  }
  
  // Padrão para simples adição/subtração com parênteses como (5) + 3 ou (6) - 2
  const simpleAddPattern = /\(\s*(-?[\d.]+)\s*\)\s*([+-])\s*(\d+)/;
  const simpleAddMatch = expression.match(simpleAddPattern);
  
  if (simpleAddMatch) {
    try {
      const x = parseFloat(simpleAddMatch[1]);
      const op = simpleAddMatch[2] === '+' ? 1 : -1;
      const c = parseFloat(simpleAddMatch[3]) * op;
      
      // Avaliar a simples adição/subtração
      const result = x + c;
      
      // Armazenar no cache
      evaluatedExpressionCache.set(expression, result.toString());
      return result.toString();
    } catch (error) {
    }
  }
  
  // Padrão para um número entre parênteses como (5)
  const numberPattern = /^\(\s*(-?[\d.]+)\s*\)$/;
  const numberMatch = expression.match(numberPattern);
  
  if (numberMatch) {
    try {
      const value = parseFloat(numberMatch[1]);
      
      // Armazenar no cache
      evaluatedExpressionCache.set(expression, value.toString());
      return value.toString();
    } catch (error) {
    }
  }
  
  // Se a expressão é apenas um número já, retornar o número
  if (!isNaN(parseFloat(expression)) && expression.trim() !== '') {
    return expression;
  }
  
  // Se nenhum padrão correspondente ou avaliação falhou, retornar a expressão original
  return expression;
};

// Simplifica expressões lineares
export const simplifyLinearExpression = (expression: string, variable: string): { coefficient: number; constant: number } => {
  // Remove espaços
  const cleanedExpression = expression.replace(/\s+/g, '');
  
  // Função auxiliar para extrair termos
  const extractTerms = (expr: string): { coefficient: number; constant: number } => {
    let coefficient = 0;
    let constant = 0;
    
    // Para expressões vazias
    if (!expr || expr.trim() === '') {
      return { coefficient, constant };
    }
    
    // Certifique-se de que temos um sinal de mais no início para facilitar o parsing
    let normalizedExpr = expr;
    if (!expr.startsWith('+') && !expr.startsWith('-')) {
      normalizedExpr = '+' + expr;
    }
    
    // Dividir em termos por sinais de mais ou menos
    const terms = normalizedExpr.match(/[+-][^+-]*/g) || [];
    
    for (const term of terms) {
      const sign = term.startsWith('-') ? -1 : 1;
      const cleanTerm = term.substring(1).trim(); // Remove o sinal
      
      if (cleanTerm.includes('x') || cleanTerm.includes('X')) {
        // Termo variável
        const parts = cleanTerm.split(/[xX]/);
        const coef = parts[0].trim();
        coefficient += sign * (coef === '' ? 1 : parseFloat(coef));
      } else if (cleanTerm !== '') {
        // Termo constante
        constant += sign * parseFloat(cleanTerm);
      }
    }
    
    return { coefficient, constant };
  };
  
  // Para expressões com parênteses como "x - 5 - (10)"
  if (expression.includes('(')) {
    // Verificar se há um sinal de menos antes do parêntese de abertura
    const minusBeforeParenthesis = expression.match(/\-\s*\(/);
    const plusBeforeParenthesis = expression.match(/\+\s*\(/);
    
    // Dividir pelo parêntese de abertura para obter a parte esquerda
    const leftAndRightParts = expression.split('(');
    let leftPart = leftAndRightParts[0];
    
    // Remover o operador diretamente antes do parêntese da parte esquerda
    if (minusBeforeParenthesis) {
      leftPart = leftPart.substring(0, leftPart.lastIndexOf('-')).trim();
    } else if (plusBeforeParenthesis) {
      leftPart = leftPart.substring(0, leftPart.lastIndexOf('+')).trim();
    }
    
    // Obter a parte direita (dentro dos parênteses)
    let rightPart = '';
    if (leftAndRightParts.length > 1) {
      // Extrair o conteúdo dos parênteses
      rightPart = leftAndRightParts[1].split(')')[0].trim();
    }
    
    // Extrair termos de ambas as partes
    const leftTerms = extractTerms(leftPart);
    const rightTerms = extractTerms(rightPart);
    
    // Aplicar a operação correta com base no operador antes dos parênteses
    if (minusBeforeParenthesis) {
      // Subtrair os termos direitos (já que o formato é "left - (right)")
      return {
        coefficient: leftTerms.coefficient - rightTerms.coefficient,
        constant: leftTerms.constant - rightTerms.constant
      };
    } else if (plusBeforeParenthesis) {
      // Somar os termos direitos (para casos como "left + (right)")
      return {
        coefficient: leftTerms.coefficient + rightTerms.coefficient,
        constant: leftTerms.constant + rightTerms.constant
      };
    } else {
      // Caso padrão - tratar como subtração que é o mais comum
      return {
        coefficient: leftTerms.coefficient - rightTerms.coefficient,
        constant: leftTerms.constant - rightTerms.constant
      };
    }
  }
  
  // Para expressões simples como "2x + 3"
  return extractTerms(cleanedExpression);
}; 