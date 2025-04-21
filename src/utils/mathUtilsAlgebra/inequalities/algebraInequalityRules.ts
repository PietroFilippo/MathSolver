// ===================================================
// ========= REGRAS DE INEQUAÇÕES ALGÉBRICAS =========
// ===================================================

import { AlgebraTerm } from '../terms/algebraTermDefinition';
import { AlgebraicInequality, INEQUALITY_SYMBOLS, PassoResolucao } from './algebraInequalityTypes';
import { termToString } from '../terms/algebraTermManipulator';
import { moveTermsToLeftSide, evaluateExpression } from './algebraInequalityUtils';
import { flipInequality } from './algebraInequalityParser';

// Helper para extrair coeficientes de expressão quadrática
const extractQuadraticCoefficients = (expression: AlgebraTerm): { a: number; b: number; c: number } => {
  // Converter a expressão para uma string para facilitar a extração de coeficientes
  const expressionStr = termToString(expression);
  
  // Inicializar coeficientes
  let a = 0, b = 0, c = 0;

  // Tentativa de abordagem baseada em strings primeiro
  if (expressionStr.includes('-1*x^2') || expressionStr.includes('-1*x²')) {
    a = -1;
  } else if (expressionStr.includes('-x^2') || expressionStr.includes('-x²')) {
    a = -1;
  }
  
  // Processar os termos usando a estrutura original de termos
  const processTerms = (term: AlgebraTerm, sign: number = 1) => {
    if (!term) return;
    
    switch (term.type) {
      case 'constant':
        c += sign * (term.value || 0);
        break;
        
      case 'variable':
        b += sign * 1;
        break;
        
      case 'power':
        if (term.argument?.type === 'variable' && 
            typeof term.exponent === 'number' && term.exponent === 2) {
          a += sign * 1;
        }
        break;
        
      case 'product':
        if (term.left?.type === 'constant') {
          const coefficient = term.left.value || 0;
          
          if (term.right?.type === 'variable') {
            // Termo como 3x
            b += sign * coefficient;
          } else if (term.right?.type === 'power' && 
                    term.right.argument?.type === 'variable' && 
                    typeof term.right.exponent === 'number' && 
                    term.right.exponent === 2) {
            // Termo como 3x²
            a += sign * coefficient;
          } else {
            // Processar outros tipos de produtos recursivamente
            processTerms(term.right!, sign * coefficient);
          }
        } else if (term.right?.type === 'constant') {
          const coefficient = term.right.value || 0;
          
          if (term.left?.type === 'variable') {
            // Termo como x*3
            b += sign * coefficient;
          } else {
            // Processar outros tipos de produtos recursivamente
            processTerms(term.left!, sign * coefficient);
          }
        } else {
          // Processar ambas as partes recursivamente
          processTerms(term.left!, sign);
          processTerms(term.right!, sign);
        }
        break;
        
      case 'sum':
        processTerms(term.left!, sign);
        processTerms(term.right!, sign);
        break;
        
      case 'difference':
        processTerms(term.left!, sign);
        processTerms(term.right!, -sign); // Negar o sinal para o termo direito
        break;
        
      case 'negative':
        if (term.argument?.type === 'power' && 
            term.argument.argument?.type === 'variable' && 
            typeof term.argument.exponent === 'number' && 
            term.argument.exponent === 2) {
          // Este é -x², o que significa um termo quadrático com coeficiente negativo
          a -= sign * 1;
        } else if (term.argument?.type === 'variable') {
          // Este é -x, um termo linear com coeficiente negativo
          b -= sign * 1;
        } else if (term.argument?.type === 'constant') {
          // Este é -c, uma constante com coeficiente negativo
          c -= sign * (term.argument.value || 0);
        } else {
          // Para outras expressões aninhadas, processar recursivamente com sinal negado
          processTerms(term.argument!, -sign);
        }
        break;
    }
  };

  // Se não detectarmos um termo quadrático através do padrão de string, use a abordagem recursiva
  if (a === 0) {
    processTerms(expression, 1);
  } else {
    // Se já detectarmos um termo quadrático, apenas processar para b e c
    // Temporariamente definir a como 0 para evitar contagem dupla
    let temp = a;
    a = 0;
    processTerms(expression, 1);
    a = temp;
  }
    return { a, b, c };
};

// Resolve inequações lineares
export const solveLinearInequality = (inequality: AlgebraicInequality): { 
  solution: string; 
  interval: string; 
  passos: PassoResolucao[] 
} => {
  // Função auxiliar para formatar números (inteiros sem decimais)
  const formatNumber = (num: number): string => {
    return Number.isInteger(num) ? num.toString() : num.toFixed(2);
  };

  // 1. Mover todos os termos para o lado esquerdo
  const { expression, symbol, passos } = moveTermsToLeftSide(inequality);
  
  // 2. Extrair o coeficiente e o termo constante
  let coefficient = 0;
  let constant = 0;
    
  // Função simplificada para extração de coeficientes
  const extractCoefficient = (term: AlgebraTerm) => {
    if (!term) return;
    
    switch (term.type) {
      case 'constant':
        constant += term.value || 0;
        break;
        
      case 'variable':
        coefficient += 1;
        break;
        
      case 'product':
        if (term.right?.type === 'variable') {
          coefficient += (term.left as any).value || 1;
        } else if (term.left?.type === 'variable') {
          coefficient += (term.right as any).value || 1;
        } else {
          // Processar recursivamente
          extractCoefficient(term.left!);
          extractCoefficient(term.right!);
        }
        break;
        
      case 'negative':
        // Para um termo negativo, negamos todas as partes dentro dele
        if (term.argument?.type === 'variable') {
          coefficient -= 1;
        } else if (term.argument?.type === 'constant') {
          constant -= term.argument.value || 0;
        } else if (term.argument?.type === 'product' && term.argument.right?.type === 'variable') {
          coefficient -= (term.argument.left as any).value || 1;
        } else if (term.argument) {
          // Criar um termo negativo temporário para expressões complexas
          const negatedExtraction = () => {
            let tempCoef = 0;
            let tempConst = 0;
            
            const tempExtract = (t: AlgebraTerm) => {
              if (t.type === 'constant') tempConst += t.value || 0;
              else if (t.type === 'variable') tempCoef += 1;
              else if (t.type === 'product' && t.right?.type === 'variable') 
                tempCoef += (t.left as any).value || 1;
              else if (t.type === 'sum') {
                tempExtract(t.left!);
                tempExtract(t.right!);
              } else if (t.type === 'difference') {
                tempExtract(t.left!);
                if (t.right?.type === 'constant') tempConst -= t.right.value || 0;
                else if (t.right?.type === 'variable') tempCoef -= 1;
                else if (t.right) {
                  tempExtract({
                    type: 'negative',
                    argument: t.right
                  });
                }
              }
            };
            
            tempExtract(term.argument!);
            coefficient -= tempCoef;
            constant -= tempConst;
          };
          
          negatedExtraction();
        }
        break;
        
      case 'sum':
        extractCoefficient(term.left!);
        extractCoefficient(term.right!);
        break;
        
      case 'difference':
        extractCoefficient(term.left!);
        
        // Para o lado direito de uma diferença, negue-o
        if (term.right?.type === 'constant') {
          constant -= term.right.value || 0;
        } else if (term.right?.type === 'variable') {
          coefficient -= 1;
        } else if (term.right?.type === 'product' && term.right.right?.type === 'variable') {
          coefficient -= (term.right.left as any).value || 1;
        } else if (term.right) {
          extractCoefficient({
            type: 'negative',
            argument: term.right
          });
        }
        break;
    }
  };
  
  extractCoefficient(expression);
    
  // 3. Resolver para a variável
  // ax + b ≤ 0 => ax ≤ -b => x ≤ -b/a (se a > 0) ou x ≥ -b/a (se a < 0)
  const criticalValue = -constant / coefficient;
  
  // 4. Determinar o símbolo final baseado no coeficiente
  let finalSymbol = coefficient < 0 ? flipInequality(symbol) : symbol;
  
  passos.push({
    expressao: `${formatNumber(coefficient)}x + ${formatNumber(constant)} ${symbol} 0`,
    explicacao: 'Forma padrão da inequação linear.'
  });
  
  passos.push({
    expressao: coefficient < 0 ? 
      `Dividindo ambos os lados por ${formatNumber(coefficient)} (coeficiente negativo, invertendo a desigualdade)` :
      `Dividindo ambos os lados por ${formatNumber(coefficient)}`,
    explicacao: coefficient < 0 ?
      'Como o coeficiente é negativo, invertemos o sentido da desigualdade ao dividir.' :
      'Isolando a variável.'
  });
  
  passos.push({
    expressao: `x ${finalSymbol} ${formatNumber(criticalValue)}`,
    explicacao: `Coeficiente: ${formatNumber(coefficient)}, Constante: ${formatNumber(constant)}, Valor crítico: ${formatNumber(criticalValue)}`
  });
  
  // 5. Construir a solução e o intervalo
  const solution = `x ${finalSymbol} ${formatNumber(criticalValue)}`;
  let interval = '';
  
  switch (finalSymbol) {
    case INEQUALITY_SYMBOLS.LESS_THAN:
      interval = `(-∞, ${formatNumber(criticalValue)})`;
      break;
    case INEQUALITY_SYMBOLS.LESS_THAN_EQUAL:
      interval = `(-∞, ${formatNumber(criticalValue)}]`;
      break;
    case INEQUALITY_SYMBOLS.GREATER_THAN:
      interval = `(${formatNumber(criticalValue)}, ∞)`;
      break;
    case INEQUALITY_SYMBOLS.GREATER_THAN_EQUAL:
      interval = `[${formatNumber(criticalValue)}, ∞)`;
      break;
  }
  
  passos.push({
    expressao: `${solution} ⟹ ${interval}`,
    explicacao: 'Expressando a solução em notação de intervalo.'
  });
  
  return { solution, interval, passos };
};

// Resolve inequações quadráticas
export const solveQuadraticInequality = (inequality: AlgebraicInequality): {
  solution: string;
  interval: string;
  passos: PassoResolucao[];
} => {
  // Função auxiliar para formatar números (inteiros sem decimais)
  const formatNumber = (num: number): string => {
    return Number.isInteger(num) ? num.toString() : num.toFixed(2);
  };

  const passos: PassoResolucao[] = [];
  
  // 1. Mover todos os termos para o lado esquerdo
  const { expression, symbol, passos: movingSteps } = moveTermsToLeftSide(inequality);
  passos.push(...movingSteps);
  
  // 2. Extrair coeficientes da expressão quadrática
  const { a, b, c } = extractQuadraticCoefficients(expression);
  
  if (a === 0) {
    // A expressão é linear, não quadrática
    const linearInequality: AlgebraicInequality = {
      leftSide: expression,
      rightSide: { type: 'constant', value: 0 },
      symbol: symbol
    };
    
    passos.push({
      expressao: 'Coeficiente de x² é zero - esta é uma inequação linear',
      explicacao: 'Verificação do tipo de inequação.'
    });
    
    const linearSolution = solveLinearInequality(linearInequality);
    return {
      solution: linearSolution.solution,
      interval: linearSolution.interval,
      passos: [...passos, ...linearSolution.passos]
    };
  }
  
  // 3. Calcular o discriminante e as raízes
  const discriminant = b * b - 4 * a * c;
  
  passos.push({
    expressao: `${formatNumber(a)}x² + ${formatNumber(b)}x + ${formatNumber(c)} ${symbol} 0`,
    explicacao: 'Forma padrão da inequação quadrática.'
  });
  
  passos.push({
    expressao: `Δ = ${formatNumber(b)}² - 4 × ${formatNumber(a)} × ${formatNumber(c)} = ${formatNumber(discriminant)}`,
    explicacao: 'Calculando o discriminante para encontrar as raízes.'
  });
  
  const roots: number[] = [];
  
  if (discriminant > 0) {
    const root1 = (-b + Math.sqrt(discriminant)) / (2 * a);
    const root2 = (-b - Math.sqrt(discriminant)) / (2 * a);
    
    // Garantir que root1 < root2
    if (root1 > root2) {
      roots.push(root2, root1);
    } else {
      roots.push(root1, root2);
    }
    
    passos.push({
      expressao: `Raízes: x₁ = ${formatNumber(roots[0])}, x₂ = ${formatNumber(roots[1])}`,
      explicacao: 'Calculando as raízes da equação quadrática.'
    });
  } else if (discriminant === 0) {
    const root = -b / (2 * a);
    roots.push(root);
    
    passos.push({
      expressao: `Raiz dupla: x = ${formatNumber(root)}`,
      explicacao: 'A equação tem uma única raiz (raiz dupla).'
    });
  } else {
    passos.push({
      expressao: 'A equação não tem raízes reais',
      explicacao: 'O discriminante é negativo, então não há raízes reais.'
    });
  }
  
  // 4. Determinar o sinal da expressão quadrática em cada intervalo
  // A parábola abre para cima se a > 0, para baixo se a < 0
  const opensUpward = a > 0;
  
  passos.push({
    expressao: opensUpward ? 
      'A parábola abre para cima (a > 0)' : 
      'A parábola abre para baixo (a < 0)',
    explicacao: 'Determinando a direção da parábola.'
  });
  
  // 5. Construir a solução com base nas raízes, no sinal do coeficiente 'a' e no símbolo da inequação
  let solution = '';
  let interval = '';
  
  // Sem raízes reais (discriminante negativo)
  if (roots.length === 0) {
    if ((opensUpward && (symbol === INEQUALITY_SYMBOLS.GREATER_THAN || symbol === INEQUALITY_SYMBOLS.GREATER_THAN_EQUAL)) ||
        (!opensUpward && (symbol === INEQUALITY_SYMBOLS.LESS_THAN || symbol === INEQUALITY_SYMBOLS.LESS_THAN_EQUAL))) {
      // Sempre verdadeiro - parábola sem raízes reais e inteiramente acima ou abaixo do eixo x
      solution = 'Para todo x ∈ ℝ';
      interval = '(-∞, ∞)';
      
      passos.push({
        expressao: solution,
        explicacao: 'A inequação é satisfeita para todos os valores reais.'
      });
    } else {
      // Sempre falso - parábola sem raízes reais e inteiramente abaixo ou acima do eixo x
      solution = 'Sem solução';
      interval = '∅';
      
      passos.push({
        expressao: solution,
        explicacao: 'A inequação não tem solução.'
      });
    }
  }
  // Uma raiz real (discriminante zero)
  else if (roots.length === 1) {
    const root = roots[0];
    
    if (symbol === INEQUALITY_SYMBOLS.LESS_THAN || symbol === INEQUALITY_SYMBOLS.GREATER_THAN) {
      // Tangencia o eixo x, mas não o cruza
      if ((opensUpward && symbol === INEQUALITY_SYMBOLS.LESS_THAN) ||
          (!opensUpward && symbol === INEQUALITY_SYMBOLS.GREATER_THAN)) {
        // x ≠ root, mas nunca cruza o eixo
        solution = 'Sem solução';
        interval = '∅';
      } else {
        // Todos exceto o ponto de tangência
        solution = `x ∈ ℝ, x ≠ ${root}`;
        interval = `(-∞, ${root}) ∪ (${root}, ∞)`;
      }
    } else {
      // Incluindo o ponto de tangência
      if ((opensUpward && symbol === INEQUALITY_SYMBOLS.LESS_THAN_EQUAL) ||
          (!opensUpward && symbol === INEQUALITY_SYMBOLS.GREATER_THAN_EQUAL)) {
        // Apenas o ponto de tangência
        solution = `x = ${root}`;
        interval = `{${root}}`;
      } else {
        // Todos os pontos (incluindo tangência)
        solution = `Para todo x ∈ ℝ`;
        interval = `(-∞, ∞)`;
      }
    }
    
    passos.push({
      expressao: solution,
      explicacao: 'Determinando a solução para o caso de raiz única.'
    });
  }
  // Duas raízes reais (discriminante positivo)
  else {
    const [smallerRoot, largerRoot] = roots;
    
    // Inequação com sinal < ou ≤
    if (symbol === INEQUALITY_SYMBOLS.LESS_THAN || symbol === INEQUALITY_SYMBOLS.LESS_THAN_EQUAL) {
      if (opensUpward) {
        // Parábola abre para cima, então é negativa entre as raízes
        const inclusiveLeft = symbol === INEQUALITY_SYMBOLS.LESS_THAN_EQUAL ? '[' : '(';
        const inclusiveRight = symbol === INEQUALITY_SYMBOLS.LESS_THAN_EQUAL ? ']' : ')';
        
        solution = symbol === INEQUALITY_SYMBOLS.LESS_THAN ?
          `${smallerRoot} < x < ${largerRoot}` : 
          `${smallerRoot} ≤ x ≤ ${largerRoot}`;
        
        interval = `${inclusiveLeft}${smallerRoot}, ${largerRoot}${inclusiveRight}`;
      } else {
        // Parábola abre para baixo, então é negativa fora das raízes
        const inclusiveLeft = symbol === INEQUALITY_SYMBOLS.LESS_THAN_EQUAL ? '[' : '(';
        const inclusiveRight = symbol === INEQUALITY_SYMBOLS.LESS_THAN_EQUAL ? ']' : ')';
        
        solution = symbol === INEQUALITY_SYMBOLS.LESS_THAN ?
          `x < ${smallerRoot} ou x > ${largerRoot}` : 
          `x ≤ ${smallerRoot} ou x ≥ ${largerRoot}`;
        
        interval = `(-∞, ${smallerRoot}${inclusiveRight} ∪ ${inclusiveLeft}${largerRoot}, ∞)`;
      }
    }
    // Inequação com sinal > ou ≥
    else {
      if (opensUpward) {
        // Parábola abre para cima, então é positiva fora das raízes
        const inclusiveLeft = symbol === INEQUALITY_SYMBOLS.GREATER_THAN_EQUAL ? '[' : '(';
        const inclusiveRight = symbol === INEQUALITY_SYMBOLS.GREATER_THAN_EQUAL ? ']' : ')';
        
        solution = symbol === INEQUALITY_SYMBOLS.GREATER_THAN ?
          `x < ${smallerRoot} ou x > ${largerRoot}` : 
          `x ≤ ${smallerRoot} ou x ≥ ${largerRoot}`;
        
        interval = `(-∞, ${smallerRoot}${inclusiveRight} ∪ ${inclusiveLeft}${largerRoot}, ∞)`;
      } else {
        // Parábola abre para baixo, então é positiva entre as raízes
        const inclusiveLeft = symbol === INEQUALITY_SYMBOLS.GREATER_THAN_EQUAL ? '[' : '(';
        const inclusiveRight = symbol === INEQUALITY_SYMBOLS.GREATER_THAN_EQUAL ? ']' : ')';
        
        solution = symbol === INEQUALITY_SYMBOLS.GREATER_THAN ?
          `${smallerRoot} < x < ${largerRoot}` : 
          `${smallerRoot} ≤ x ≤ ${largerRoot}`;
        
        interval = `${inclusiveLeft}${smallerRoot}, ${largerRoot}${inclusiveRight}`;
      }
    }
    
    passos.push({
      expressao: solution,
      explicacao: 'Determinando a solução para o caso de duas raízes reais.'
    });
  }
  
  passos.push({
    expressao: `${solution} ⟹ ${interval}`,
    explicacao: 'Expressando a solução em notação de intervalo.'
  });
  
  return { solution, interval, passos };
};

// Resolve inequações racionais
export const solveRationalInequality = (inequality: AlgebraicInequality): {
  solution: string;
  interval: string;
  passos: PassoResolucao[];
} => {
  const passos: PassoResolucao[] = [];
  
  // Função auxiliar para formatar números (inteiros sem decimais)
  const formatNumber = (num: number): string => {
    return Number.isInteger(num) ? num.toString() : num.toFixed(2);
  };
  
  // 1. Mover todos os termos para o lado esquerdo
  const { expression, symbol, passos: movingSteps } = moveTermsToLeftSide(inequality);
  passos.push(...movingSteps);
  
  // 2. Identificar numerador e denominador
  let numerator: AlgebraTerm;
  let denominator: AlgebraTerm;
  
  if (expression.type === 'quotient') {
    numerator = expression.left!;
    denominator = expression.right!;
  } else {
    numerator = expression;
    denominator = { type: 'constant', value: 1 };
  }
  
  passos.push({
    expressao: `Analisando expressão racional: ${termToString(numerator)} / ${termToString(denominator)} ${symbol} 0`,
    explicacao: 'Identificando numerador e denominador da expressão racional.'
  });
  
  // 3. Encontrar raízes do numerador e denominador
  const numCoeffs = extractQuadraticCoefficients(numerator);
  const denCoeffs = extractQuadraticCoefficients(denominator);
  
  passos.push({
    expressao: `Numerador: ${formatNumber(numCoeffs.a)}x² + ${formatNumber(numCoeffs.b)}x + ${formatNumber(numCoeffs.c)}`,
    explicacao: 'Coeficientes do numerador.'
  });
  
  passos.push({
    expressao: `Denominador: ${formatNumber(denCoeffs.a)}x² + ${formatNumber(denCoeffs.b)}x + ${formatNumber(denCoeffs.c)}`,
    explicacao: 'Coeficientes do denominador.'
  });
  
  const numRoots: number[] = [];
  const denRoots: number[] = [];
  
  // Calcular raízes do numerador (apenas se não for constante)
  if (numCoeffs.a !== 0 || numCoeffs.b !== 0) {
    const numDisc = numCoeffs.b * numCoeffs.b - 4 * numCoeffs.a * numCoeffs.c;
    
    if (numCoeffs.a === 0) {
      // Expressão linear: bx + c = 0 => x = -c/b
      if (numCoeffs.b !== 0) {
        numRoots.push(-numCoeffs.c / numCoeffs.b);
      }
    } else if (numDisc > 0) {
      // Duas raízes reais distintas
      const root1 = (-numCoeffs.b + Math.sqrt(numDisc)) / (2 * numCoeffs.a);
      const root2 = (-numCoeffs.b - Math.sqrt(numDisc)) / (2 * numCoeffs.a);
      numRoots.push(root1, root2);
    } else if (numDisc === 0) {
      // Uma raiz real (raiz dupla)
      numRoots.push(-numCoeffs.b / (2 * numCoeffs.a));
    }
    // Se discriminante < 0, não há raízes reais
  }
  
  // Calcular raízes do denominador (apenas se não for constante)
  if (denCoeffs.a !== 0 || denCoeffs.b !== 0) {
    const denDisc = denCoeffs.b * denCoeffs.b - 4 * denCoeffs.a * denCoeffs.c;
    
    if (denCoeffs.a === 0) {
      // Expressão linear: bx + c = 0 => x = -c/b
      if (denCoeffs.b !== 0) {
        denRoots.push(-denCoeffs.c / denCoeffs.b);
      }
    } else if (denDisc > 0) {
      // Duas raízes reais distintas
      const root1 = (-denCoeffs.b + Math.sqrt(denDisc)) / (2 * denCoeffs.a);
      const root2 = (-denCoeffs.b - Math.sqrt(denDisc)) / (2 * denCoeffs.a);
      denRoots.push(root1, root2);
    } else if (denDisc === 0) {
      // Uma raiz real (raiz dupla)
      denRoots.push(-denCoeffs.b / (2 * denCoeffs.a));
    }
    // Se discriminante < 0, não há raízes reais
  }
  
  // Ordenar as raízes para garantir precisão
  numRoots.sort((a, b) => a - b);
  denRoots.sort((a, b) => a - b);
  
  passos.push({
    expressao: `Raízes do numerador: ${numRoots.length > 0 ? numRoots.map(r => formatNumber(r)).join(', ') : 'nenhuma'}`,
    explicacao: 'Calculando os pontos onde o numerador é zero.'
  });
  
  passos.push({
    expressao: `Raízes do denominador: ${denRoots.length > 0 ? denRoots.map(r => formatNumber(r)).join(', ') : 'nenhuma'}`,
    explicacao: 'Calculando os pontos onde o denominador é zero (pontos de descontinuidade).'
  });
  
  // 4. Ordenar todos os pontos críticos
  const criticalPoints = [...numRoots, ...denRoots].filter(
    (value, index, self) => self.indexOf(value) === index
  ).sort((a, b) => a - b);
  
  passos.push({
    expressao: `Pontos críticos (ordenados): ${criticalPoints.map(p => formatNumber(p)).join(', ')}`,
    explicacao: 'Organizando todos os pontos críticos que definem intervalos.'
  });
  
  // 5. Criar intervalos para análise
  type Interval = {
    start: number;
    end: number;
    startInclusive: boolean;
    endInclusive: boolean;
  };
  
  const intervals: Interval[] = [];
  
  // Intervalo inicial (de -∞ até o primeiro ponto crítico)
  if (criticalPoints.length > 0) {
    intervals.push({
      start: -Infinity,
      end: criticalPoints[0],
      startInclusive: false,
      endInclusive: false
    });
  }
  
  // Intervalos entre pontos críticos
  for (let i = 0; i < criticalPoints.length - 1; i++) {
    intervals.push({
      start: criticalPoints[i],
      end: criticalPoints[i + 1],
      startInclusive: false,
      endInclusive: false
    });
  }
  
  // Intervalo final (do último ponto crítico até +∞)
  if (criticalPoints.length > 0) {
    intervals.push({
      start: criticalPoints[criticalPoints.length - 1],
      end: Infinity,
      startInclusive: false,
      endInclusive: false
    });
  } else {
    // Se não houver pontos críticos, o intervalo é todo o eixo real
    intervals.push({
      start: -Infinity,
      end: Infinity,
      startInclusive: false,
      endInclusive: false
    });
  }
  
  passos.push({
    expressao: `Analisando ${intervals.length} intervalos: ${intervals.map(interval => 
      `(${interval.start === -Infinity ? '-∞' : formatNumber(interval.start)}, ${interval.end === Infinity ? '∞' : formatNumber(interval.end)})`
    ).join(', ')}`,
    explicacao: 'Definindo intervalos para testar o sinal da expressão.'
  });
  
  // 6. Testar cada intervalo
  const validIntervals: Interval[] = [];
  
  for (const interval of intervals) {
    // Escolher um ponto de teste dentro do intervalo
    let testPoint: number;
    
    if (interval.start === -Infinity && interval.end === Infinity) {
      // Intervalo (-∞, ∞) - testar com 0 ou outro valor
      testPoint = 0;
    } else if (interval.start === -Infinity) {
      // Intervalo (-∞, b) - testar com um valor menor que b
      testPoint = interval.end - 1;
    } else if (interval.end === Infinity) {
      // Intervalo (a, ∞) - testar com um valor maior que a
      testPoint = interval.start + 1;
    } else {
      // Intervalo (a, b) - testar com um valor médio
      testPoint = (interval.start + interval.end) / 2;
    }
    
    // Verificar se o ponto não é uma raiz do denominador
    if (denRoots.some(root => Math.abs(testPoint - root) < 1e-10)) {
      // Se for muito próximo de uma raiz, escolher outro ponto
      testPoint += 0.1;
    }
    
    // Avaliar a expressão no ponto de teste
    const numValue = evaluateExpression(termToString(numerator), 'x', testPoint);
    const denValue = evaluateExpression(termToString(denominator), 'x', testPoint);
    
    // Verificar se o denominador não é zero
    if (Math.abs(denValue) < 1e-10) {
      passos.push({
        expressao: `Ponto de teste x = ${formatNumber(testPoint)} inválido: denominador é zero`,
        explicacao: 'Ponto de teste inválido.'
      });
      continue; // Pular para o próximo intervalo
    }
    
    const result = numValue / denValue;
    
    // Verificar se satisfaz a desigualdade
    let satisfies = false;
    switch (symbol) {
      case INEQUALITY_SYMBOLS.LESS_THAN:
        satisfies = result < 0;
        break;
      case INEQUALITY_SYMBOLS.LESS_THAN_EQUAL:
        satisfies = result <= 0;
        break;
      case INEQUALITY_SYMBOLS.GREATER_THAN:
        satisfies = result > 0;
        break;
      case INEQUALITY_SYMBOLS.GREATER_THAN_EQUAL:
        satisfies = result >= 0;
        break;
    }
    
    passos.push({
      expressao: `Testando x = ${formatNumber(testPoint)}: ${formatNumber(numValue)} / ${formatNumber(denValue)} = ${formatNumber(result)} ${symbol} 0 => ${satisfies ? 'Verdadeiro' : 'Falso'}`,
      explicacao: `Avaliando a expressão no ponto de teste.`
    });
    
    if (satisfies) {
      validIntervals.push(interval);
    }
  }
  
  // 7. Construir a notação de intervalo
  const formatInterval = (interval: Interval): string => {
    const start = interval.start === -Infinity ? '-∞' : formatNumber(interval.start);
    const end = interval.end === Infinity ? '∞' : formatNumber(interval.end);
    const leftBracket = interval.startInclusive ? '[' : '(';
    const rightBracket = interval.endInclusive ? ']' : ')';
    return `${leftBracket}${start}, ${end}${rightBracket}`;
  };
  
  // 8. Construir a solução
  let solution: string;
  let intervalNotation: string;
  
  if (validIntervals.length === 0) {
    solution = 'Sem solução';
    intervalNotation = '∅';
    
    passos.push({
      expressao: solution,
      explicacao: 'A inequação não possui solução em nenhum intervalo.'
    });
  } else {
    // Ajustar inclusão de pontos dependendo do símbolo e se o ponto é raiz do numerador
    validIntervals.forEach(interval => {
      // Para raízes do numerador, a inclusão depende do símbolo
      if (numRoots.includes(interval.start)) {
        interval.startInclusive = symbol === INEQUALITY_SYMBOLS.LESS_THAN_EQUAL || 
                                   symbol === INEQUALITY_SYMBOLS.GREATER_THAN_EQUAL;
      }
      
      if (numRoots.includes(interval.end)) {
        interval.endInclusive = symbol === INEQUALITY_SYMBOLS.LESS_THAN_EQUAL || 
                                 symbol === INEQUALITY_SYMBOLS.GREATER_THAN_EQUAL;
      }
    });
    
    // Mesclar intervalos adjacentes quando possível
    const mergedIntervals: Interval[] = [];
    const sorted = [...validIntervals].sort((a, b) => a.start - b.start);
    
    let current = sorted[0];
    for (let i = 1; i < sorted.length; i++) {
      const next = sorted[i];
      if (current.end === next.start && 
          (current.endInclusive || next.startInclusive)) {
        // Mesclar intervalos
        current.end = next.end;
        current.endInclusive = next.endInclusive;
      } else if (current.end < next.start) {
        // Intervalos separados
        mergedIntervals.push(current);
        current = next;
      }
      // Se current.end > next.start, o intervalo atual já contém o próximo
    }
    mergedIntervals.push(current);
    
    // Formatar a solução final
    intervalNotation = mergedIntervals.map(formatInterval).join(' ∪ ');
    
    // Construir a descrição da solução em texto
    const formatSolutionPart = (interval: Interval): string => {
      const start = interval.start === -Infinity ? '-∞' : formatNumber(interval.start);
      const end = interval.end === Infinity ? '∞' : formatNumber(interval.end);
      
      if (interval.start === -Infinity && interval.end === Infinity) {
        return 'para todo x ∈ ℝ';
      } else if (interval.start === -Infinity) {
        return `x ${interval.endInclusive ? '≤' : '<'} ${end}`;
      } else if (interval.end === Infinity) {
        return `x ${interval.startInclusive ? '≥' : '>'} ${start}`;
      } else {
        return `${start} ${interval.startInclusive ? '≤' : '<'} x ${interval.endInclusive ? '≤' : '<'} ${end}`;
      }
    };
    
    // Construir texto da solução
    solution = mergedIntervals.map(formatSolutionPart).join(' ou ');
    
    // Adicionar condição de domínio
    if (denRoots.length > 0) {
      solution += `, onde x ≠ ${denRoots.map(r => formatNumber(r)).join(', ')}`;
    }
    
    passos.push({
      expressao: solution,
      explicacao: 'Solução da inequação racional.'
    });
  }
  
  passos.push({
    expressao: `${solution} ⟹ ${intervalNotation}`,
    explicacao: 'Expressando a solução em notação de intervalo.'
  });
  
  return { solution, interval: intervalNotation, passos };
};

// Resolve inequações modulares
export const solveModulusInequality = (inequality: AlgebraicInequality): {
  solution: string;
  interval: string;
  passos: PassoResolucao[];
} => {
  // Função auxiliar para formatar números (inteiros sem decimais)
  const formatNumber = (num: number): string => {
    return Number.isInteger(num) ? num.toString() : num.toFixed(2);
  };

  // Helper para transformar um intervalo de texto em objeto
  const parseIntervalString = (intervalStr: string): { 
    min: number; 
    max: number; 
    minInclusive: boolean; 
    maxInclusive: boolean 
  } => {
    // Remover união/interseção se presente
    const cleanInterval = intervalStr.replace(/[∪∩]/g, '').trim();
    const hasUnion = intervalStr.includes('∪');
    
    // Se for vazio, retornar um intervalo vazio
    if (cleanInterval === '∅') {
      return { min: 0, max: 0, minInclusive: false, maxInclusive: false };
    }
    
    // Formato: (min, max) ou [min, max] ou combinações
    const match = cleanInterval.match(/^([[(])([^,]*),\s*([^)\]]*)([\])])$/);
    if (!match) {
      throw new Error(`Formato de intervalo inválido: ${intervalStr}`);
    }
    
    const minInclusive = match[1] === '[';
    const minStr = match[2].trim();
    const maxStr = match[3].trim();
    const maxInclusive = match[4] === ']';
    
    // Converter para números (considerar infinito)
    const min = minStr === '-∞' ? Number.NEGATIVE_INFINITY : parseFloat(minStr);
    const max = maxStr === '∞' ? Number.POSITIVE_INFINITY : parseFloat(maxStr);
    
    return { min, max, minInclusive, maxInclusive };
  };
  
  // Helper para calcular a interseção de dois intervalos
  const intersectIntervals = (int1: string, int2: string): string => {
    const i1 = parseIntervalString(int1);
    const i2 = parseIntervalString(int2);
    
    // Encontrar os limites da interseção
    const min = Math.max(i1.min, i2.min);
    const max = Math.min(i1.max, i2.max);
    
    // Se min > max, não há interseção
    if (min > max) return '∅';
    
    // Determinar inclusão dos limites
    const minInclusive = (min === i1.min && i1.minInclusive) || (min === i2.min && i2.minInclusive);
    const maxInclusive = (max === i1.max && i1.maxInclusive) || (max === i2.max && i2.maxInclusive);
    
    // Formatar o resultado
    const minBracket = minInclusive ? '[' : '(';
    const maxBracket = maxInclusive ? ']' : ')';
    const minStr = min === Number.NEGATIVE_INFINITY ? '-∞' : formatNumber(min);
    const maxStr = max === Number.POSITIVE_INFINITY ? '∞' : formatNumber(max);
    
    return `${minBracket}${minStr}, ${maxStr}${maxBracket}`;
  };
  
  // Helper para unir dois intervalos (se forem adjacentes ou sobrepostos)
  const uniteIntervals = (int1: string, int2: string): string => {
    // Se algum dos intervalos for vazio, retornar o outro
    if (int1 === '∅') return int2;
    if (int2 === '∅') return int1;
    
    const i1 = parseIntervalString(int1);
    const i2 = parseIntervalString(int2);
    
    // Verificar se os intervalos são disjuntos
    // Se o maior mínimo for maior que o menor máximo, então são disjuntos
    if (Math.max(i1.min, i2.min) > Math.min(i1.max, i2.max)) {
      // Garantir que int1 vem antes de int2
      if (i1.min > i2.min) {
        return `${int2} ∪ ${int1}`;
      }
      return `${int1} ∪ ${int2}`;
    }
    
    // Caso contrário, os intervalos se sobrepõem ou são adjacentes
    const min = Math.min(i1.min, i2.min);
    const max = Math.max(i1.max, i2.max);
    
    // Determinar inclusão dos limites
    const minInclusive = (min === i1.min && i1.minInclusive) || (min === i2.min && i2.minInclusive);
    const maxInclusive = (max === i1.max && i1.maxInclusive) || (max === i2.max && i2.maxInclusive);
    
    // Formatar o resultado
    const minBracket = minInclusive ? '[' : '(';
    const maxBracket = maxInclusive ? ']' : ')';
    const minStr = min === Number.NEGATIVE_INFINITY ? '-∞' : formatNumber(min);
    const maxStr = max === Number.POSITIVE_INFINITY ? '∞' : formatNumber(max);
    
    return `${minBracket}${minStr}, ${maxStr}${maxBracket}`;
  };

  const passos: PassoResolucao[] = [];
  
  // 1. Extrair a expressão dentro do módulo e o valor
  const leftSide = inequality.leftSide;
  const rightSide = inequality.rightSide;
  const symbol = inequality.symbol;
  
  // Verificar se o lado esquerdo é um módulo
  if (leftSide.type !== 'modulus' || !leftSide.argument) {
    throw new Error('A expressão deve ter um termo módulo no lado esquerdo.');
  }
  
  // Verificar se é uma inequação modular padrão (|expressão| < k ou |expressão| > k)
  if (rightSide.type !== 'constant') {
    throw new Error('Inequação modular deve ter um valor constante no lado direito.');
  }
  
  // Expressão dentro do módulo
  const innerExpression = leftSide.argument;
  // Valor constante do lado direito
  const value = rightSide.value || 0;
  
  // Mostrando a expressão no formato |expressão| symbol valor
  passos.push({
    expressao: `|${termToString(innerExpression)}| ${symbol} ${formatNumber(value)}`,
    explicacao: 'Expressão modular normalizada.'
  });
  
  // 2. Resolver baseado no tipo de desigualdade
  let solution: string;
  let interval: string;
  
  if (symbol === INEQUALITY_SYMBOLS.LESS_THAN || symbol === INEQUALITY_SYMBOLS.LESS_THAN_EQUAL) {
    // |expressão| < k ou |expressão| ≤ k
    // Solução: -k < expressão < k ou -k ≤ expressão ≤ k
    
    passos.push({
      expressao: `${formatNumber(-value)} ${symbol} ${termToString(innerExpression)} ${symbol} ${formatNumber(value)}`,
      explicacao: 'Desdobrando a inequação modular para expressão entre limites.'
    });
    
    // Criando as duas inequações: innerExpression < value e -value < innerExpression
    const upperBoundInequality: AlgebraicInequality = {
      leftSide: innerExpression,
      rightSide: { type: 'constant', value },
      symbol
    };
    
    const lowerBoundInequality: AlgebraicInequality = {
      leftSide: { type: 'constant', value: -value },
      rightSide: innerExpression,
      symbol
    };
    
    // Resolver cada inequação separadamente
    const upperSolution = solveLinearInequality(upperBoundInequality);
    const lowerSolution = solveLinearInequality(lowerBoundInequality);
    
    passos.push({
      expressao: `Inequação 1: ${termToString(innerExpression)} ${symbol} ${formatNumber(value)} ⟹ ${upperSolution.solution}`,
      explicacao: 'Resolvendo a primeira parte da inequação.'
    });
    
    passos.push({
      expressao: `Inequação 2: ${formatNumber(-value)} ${symbol} ${termToString(innerExpression)} ⟹ ${lowerSolution.solution}`,
      explicacao: 'Resolvendo a segunda parte da inequação.'
    });
    
    // Calcular a interseção dos intervalos
    interval = intersectIntervals(upperSolution.interval, lowerSolution.interval);
    
    // Como o termToString pode resultar em expressões complexas, vamos extrair
    // a solução diretamente do intervalo para garantir consistência
    const parsedInterval = parseIntervalString(interval);
    if (parsedInterval.min === Number.NEGATIVE_INFINITY && parsedInterval.max === Number.POSITIVE_INFINITY) {
      solution = "para todo x ∈ ℝ";
    } else if (parsedInterval.min === Number.NEGATIVE_INFINITY) {
      solution = `x ${parsedInterval.maxInclusive ? '≤' : '<'} ${formatNumber(parsedInterval.max)}`;
    } else if (parsedInterval.max === Number.POSITIVE_INFINITY) {
      solution = `x ${parsedInterval.minInclusive ? '≥' : '>'} ${formatNumber(parsedInterval.min)}`;
    } else {
      solution = `${formatNumber(parsedInterval.min)} ${parsedInterval.minInclusive ? '≤' : '<'} x ${parsedInterval.maxInclusive ? '≤' : '<'} ${formatNumber(parsedInterval.max)}`;
    }
    
    if (interval === '∅') {
      solution = 'Sem solução';
    }
    
    passos.push({
      expressao: `Combinando as soluções: interseção de ${lowerSolution.interval} e ${upperSolution.interval} = ${interval}`,
      explicacao: 'Encontrando a interseção das soluções.'
    });
    
  } else {
    // |expressão| > k ou |expressão| ≥ k
    // Solução: expressão < -k ou expressão > k
    
    passos.push({
      expressao: `${termToString(innerExpression)} ${symbol === INEQUALITY_SYMBOLS.GREATER_THAN ? '<' : '≤'} ${formatNumber(-value)} ou ${termToString(innerExpression)} ${symbol} ${formatNumber(value)}`,
      explicacao: 'Desdobrando a inequação modular para expressão fora dos limites.'
    });
    
    // Criando as duas inequações: innerExpression < -value ou innerExpression > value
    const lowerBoundInequality: AlgebraicInequality = {
      leftSide: innerExpression,
      rightSide: { type: 'constant', value: -value },
      symbol: symbol === INEQUALITY_SYMBOLS.GREATER_THAN ? 
        INEQUALITY_SYMBOLS.LESS_THAN : 
        INEQUALITY_SYMBOLS.LESS_THAN_EQUAL
    };
    
    const upperBoundInequality: AlgebraicInequality = {
      leftSide: innerExpression,
      rightSide: { type: 'constant', value },
      symbol
    };
    
    // Resolver cada inequação separadamente
    const lowerSolution = solveLinearInequality(lowerBoundInequality);
    const upperSolution = solveLinearInequality(upperBoundInequality);
    
    passos.push({
      expressao: `Inequação 1: ${termToString(innerExpression)} ${lowerBoundInequality.symbol} ${formatNumber(-value)} ⟹ ${lowerSolution.solution}`,
      explicacao: 'Resolvendo a primeira parte da inequação.'
    });
    
    passos.push({
      expressao: `Inequação 2: ${termToString(innerExpression)} ${symbol} ${formatNumber(value)} ⟹ ${upperSolution.solution}`,
      explicacao: 'Resolvendo a segunda parte da inequação.'
    });
    
    // Calcular a união dos intervalos
    interval = uniteIntervals(lowerSolution.interval, upperSolution.interval);
    
    passos.push({
      expressao: `Combinando as soluções: união de ${lowerSolution.interval} e ${upperSolution.interval} = ${interval}`,
      explicacao: 'Encontrando a união das soluções.'
    });
    
    // Extrair solução a partir do intervalo
    if (interval.includes('∪')) {
      // Se temos uma união, extraímos diretamente das soluções originais
      solution = `${lowerSolution.solution} ou ${upperSolution.solution}`;
    } else {
      // Caso contrário, extrair do intervalo unido
      const parsedInterval = parseIntervalString(interval);
      if (parsedInterval.min === Number.NEGATIVE_INFINITY && parsedInterval.max === Number.POSITIVE_INFINITY) {
        solution = "para todo x ∈ ℝ";
      } else if (parsedInterval.min === Number.NEGATIVE_INFINITY) {
        solution = `x ${parsedInterval.maxInclusive ? '≤' : '<'} ${formatNumber(parsedInterval.max)}`;
      } else if (parsedInterval.max === Number.POSITIVE_INFINITY) {
        solution = `x ${parsedInterval.minInclusive ? '≥' : '>'} ${formatNumber(parsedInterval.min)}`;
      } else {
        solution = `${formatNumber(parsedInterval.min)} ${parsedInterval.minInclusive ? '≤' : '<'} x ${parsedInterval.maxInclusive ? '≤' : '<'} ${formatNumber(parsedInterval.max)}`;
      }
    }
  }
  
  passos.push({
    expressao: `Solução final: ${solution}`,
    explicacao: 'Expressando a solução final em notação de intervalo.'
  });
  
  return { solution, interval, passos };
}; 