// ===================================================
// ========== IMPORTAÇÕES E DEFINIÇÕES BÁSICAS =========
// ===================================================

// Importa utilitários de mathUtilsCalculoGeral.ts
import {
  Term,
  parseExpression,
  termToString,
  areTermsEqual,
  negateTerm
} from './mathUtilsCalculoGeral';

// ===================================================
// ========== CÁLCULO DE DERIVADAS ===================
// ===================================================

// Função principal para resolver a derivada de uma expressão matemática
// Implementa as regras de derivação para diferentes tipos de termos
export const calculateDerivative = (term: Term, variable: string): Term => {
  switch (term.type) {
    case 'constant':
      return { type: 'constant', value: 0 };
      
    case 'variable':
      if (term.variable === variable) {
        return { type: 'constant', value: 1 };
      }
      return { type: 'constant', value: 0 };
      
    // ===== DERIVADA DE POTÊNCIAS =====
      
    case 'power':
      if (term.argument?.type === 'variable' && term.argument.variable === variable) {
        // Regra da potência simples: d/dx(x^n) = n*x^(n-1)
        const exponent = term.exponent ?? 0; // Use o operador de coalescência nula para evitar undefined
        if (exponent === 0) {
          return { type: 'constant', value: 0 };
        } else if (exponent === 1) {
          return { type: 'constant', value: 1 };
        } else {
          return {
            type: 'product',
            left: { type: 'constant', value: exponent },
            right: {
              type: 'power',
              argument: { type: 'variable', variable },
              exponent: exponent - 1
            }
          };
        }
      } else {
        // Regra da cadeia para potências: d/dx[f(x)^n] = n*[f(x)]^(n-1)*f'(x)
        const exponent = term.exponent ?? 0;
        
        if (exponent === 0) {
          return { type: 'constant', value: 0 };
        }
        
        const derivadaDoArgumento = calculateDerivative(term.argument!, variable);
        
        // Verificar se a derivada do argumento é zero
        if (derivadaDoArgumento.type === 'constant' && derivadaDoArgumento.value === 0) {
          return { type: 'constant', value: 0 };
        }
        
        if (exponent === 1) {
          return derivadaDoArgumento;
        }
        
        return {
          type: 'product',
          left: {
            type: 'product',
            left: { type: 'constant', value: exponent },
            right: {
              type: 'power',
              argument: term.argument,
              exponent: exponent - 1
            }
          },
          right: derivadaDoArgumento
        };
      }
      
    // ===== DERIVADAS DE FUNÇÕES TRIGONOMÉTRICAS =====
      
    case 'sin':
      // Regra da derivada do seno: d/dx[sin(u)] = cos(u) * du/dx
      const derivadaSinArg = calculateDerivative(term.argument!, variable);
      
      // Se a derivada do argumento for zero, a derivada total é zero
      if (derivadaSinArg.type === 'constant' && derivadaSinArg.value === 0) {
        return { type: 'constant', value: 0 };
      }
      
      // Se a derivada do argumento for 1, simplifica a expressão
      if (derivadaSinArg.type === 'constant' && derivadaSinArg.value === 1) {
        return {
          type: 'cos',
          argument: term.argument
        };
      }
      
      return {
        type: 'product',
        left: {
          type: 'cos',
          argument: term.argument
        },
        right: derivadaSinArg
      };
      
    case 'cos':
      // Regra da derivada do cosseno: d/dx[cos(u)] = -sin(u) * du/dx
      const derivadaCosArg = calculateDerivative(term.argument!, variable);
      
      // Se a derivada do argumento for zero, a derivada total é zero
      if (derivadaCosArg.type === 'constant' && derivadaCosArg.value === 0) {
        return { type: 'constant', value: 0 };
      }
      
      // Se a derivada do argumento for 1, simplifica a expressão para -sin(u)
      if (derivadaCosArg.type === 'constant' && derivadaCosArg.value === 1) {
        return {
          type: 'product',
          left: { type: 'constant', value: -1 },
          right: {
            type: 'sin',
            argument: term.argument
          }
        };
      }
      
      // Para outros casos, retorna -sin(u) * du/dx
      return {
        type: 'product',
        left: {
          type: 'product',
          left: { type: 'constant', value: -1 },
          right: {
            type: 'sin',
            argument: term.argument
          }
        },
        right: derivadaCosArg
      };
      
    case 'tan':
      // Regra da derivada da tangente: d/dx[tan(u)] = sec²(u) * du/dx
      const derivadaTanArg = calculateDerivative(term.argument!, variable);
      
      // Se a derivada do argumento for zero, a derivada total é zero
      if (derivadaTanArg.type === 'constant' && derivadaTanArg.value === 0) {
        return { type: 'constant', value: 0 };
      }
      
      // Representa sec²(u) como 1/cos²(u)
      const secSquared = {
        type: 'power',
        argument: {
          type: 'quotient',
          left: { type: 'constant', value: 1 },
          right: { type: 'cos', argument: term.argument }
        },
        exponent: 2
      } as Term;
      
      // Se a derivada do argumento for 1, simplifica para sec²(u)
      if (derivadaTanArg.type === 'constant' && derivadaTanArg.value === 1) {
        return secSquared;
      }
      
      return {
        type: 'product',
        left: secSquared,
        right: derivadaTanArg
      };
      
    // ===== DERIVADAS DE FUNÇÕES LOGARÍTMICAS =====
      
    case 'ln':
      // Regra da derivada do logaritmo natural: d/dx[ln(u)] = (1/u) * du/dx
      
      // Caso especial: ln(x^n) = n*ln(x)
      if (term.argument!.type === 'power' && 
          term.argument!.argument!.type === 'variable' && 
          term.argument!.argument!.variable === variable) {
          
        // ln(x^n) -> (n/x)
        return {
          type: 'quotient',
          left: { type: 'constant', value: term.argument!.exponent! },
          right: { type: 'variable', variable }
        };
      }
      
      const derivadaLnArg = calculateDerivative(term.argument!, variable);
      
      // Se a derivada do argumento for zero, a derivada total é zero
      if (derivadaLnArg.type === 'constant' && derivadaLnArg.value === 0) {
        return { type: 'constant', value: 0 };
      }
      
      // Se o argumento é 'x', a derivada é 1/x
      if (term.argument!.type === 'variable' && term.argument!.variable === variable) {
        return {
          type: 'quotient',
          left: { type: 'constant', value: 1 },
          right: { type: 'variable', variable }
        };
      }
      
      return {
        type: 'product',
        left: {
          type: 'quotient',
          left: { type: 'constant', value: 1 },
          right: term.argument
        },
        right: derivadaLnArg
      };
      
    case 'log':
      // Regra da derivada do logaritmo base 10: d/dx[log(u)] = (1/(u*ln(10))) * du/dx
      const derivadaLogArg = calculateDerivative(term.argument!, variable);
      
      // Se a derivada do argumento for zero, a derivada total é zero
      if (derivadaLogArg.type === 'constant' && derivadaLogArg.value === 0) {
        return { type: 'constant', value: 0 };
      }
      
      return {
        type: 'product',
        left: {
          type: 'quotient',
          left: { type: 'constant', value: 1 },
          right: {
            type: 'product',
            left: term.argument,
            right: { type: 'constant', value: Math.log(10) }
          }
        },
        right: derivadaLogArg
      };
      
    case 'exp':
      // Regra da derivada da exponencial: d/dx[e^u] = e^u * du/dx
      const derivadaExpArg = calculateDerivative(term.argument!, variable);
      
      // Se a derivada do argumento for zero, a derivada total é zero
      if (derivadaExpArg.type === 'constant' && derivadaExpArg.value === 0) {
        return { type: 'constant', value: 0 };
      }
      
      // Se a derivada do argumento for 1, simplifica a expressão para e^u
      if (derivadaExpArg.type === 'constant' && derivadaExpArg.value === 1) {
        return term;
      }
      
      return {
        type: 'product',
        left: term,
        right: derivadaExpArg
      };
      
    // ===== DERIVADAS DE OPERAÇÕES ARITMÉTICAS =====
      
    case 'sum':
      // Regra da soma: d/dx[f(x) + g(x)] = f'(x) + g'(x)
      const derivadaLeftSum = calculateDerivative(term.left!, variable);
      const derivadaRightSum = calculateDerivative(term.right!, variable);
      
      // Simplificações
      if (derivadaLeftSum.type === 'constant' && derivadaLeftSum.value === 0) {
        return derivadaRightSum;
      }
      
      if (derivadaRightSum.type === 'constant' && derivadaRightSum.value === 0) {
        return derivadaLeftSum;
      }
      
      return {
        type: 'sum',
        left: derivadaLeftSum,
        right: derivadaRightSum
      };
      
    case 'difference':
      // Regra da diferença: d/dx[f(x) - g(x)] = f'(x) - g'(x)
      const derivadaLeftDiff = calculateDerivative(term.left!, variable);
      const derivadaRightDiff = calculateDerivative(term.right!, variable);
      
      // Simplificações
      if (derivadaLeftDiff.type === 'constant' && derivadaLeftDiff.value === 0) {
        return {
          type: 'product',
          left: { type: 'constant', value: -1 },
          right: derivadaRightDiff
        };
      }
      
      if (derivadaRightDiff.type === 'constant' && derivadaRightDiff.value === 0) {
        return derivadaLeftDiff;
      }
      
      return {
        type: 'difference',
        left: derivadaLeftDiff,
        right: derivadaRightDiff
      };
      
    case 'product':
      // Regra do produto: d/dx[f(x) * g(x)] = f'(x) * g(x) + f(x) * g'(x)
      const derivadaLeftProd = calculateDerivative(term.left!, variable);
      const derivadaRightProd = calculateDerivative(term.right!, variable);
      
      // Simplificações para o produto
      if (derivadaLeftProd.type === 'constant' && derivadaLeftProd.value === 0) {
        if (derivadaRightProd.type === 'constant' && derivadaRightProd.value === 0) {
          return { type: 'constant', value: 0 }; // Ambas derivadas são zero
        }
        // Somente a derivada do termo esquerdo é zero
        return {
          type: 'product',
          left: term.left,
          right: derivadaRightProd
        };
      }
      
      if (derivadaRightProd.type === 'constant' && derivadaRightProd.value === 0) {
        // Somente a derivada do termo direito é zero
        return {
          type: 'product',
          left: derivadaLeftProd,
          right: term.right
        };
      }
      
      // Casos especiais para constantes
      if (term.left!.type === 'constant') {
        if (derivadaRightProd.type === 'constant' && derivadaRightProd.value === 0) {
          return { type: 'constant', value: 0 };
        }
        return {
          type: 'product',
          left: term.left,
          right: derivadaRightProd
        };
      }
      
      if (term.right!.type === 'constant') {
        if (derivadaLeftProd.type === 'constant' && derivadaLeftProd.value === 0) {
          return { type: 'constant', value: 0 };
        }
        return {
          type: 'product',
          left: term.right,
          right: derivadaLeftProd
        };
      }
      
      // Caso especial para sin(x) * cos(x)
      if ((term.left!.type === 'sin' && term.right!.type === 'cos') || 
          (term.left!.type === 'cos' && term.right!.type === 'sin')) {
        
        // Verificar se os argumentos são iguais e se a derivada do argumento é 1
        if (areTermsEqual(term.left!.argument!, term.right!.argument!) && 
            term.left!.argument!.type === 'variable' && 
            term.left!.argument!.variable === variable) {
            
          // Para d/dx[sin(x) * cos(x)], usar a identidade: 
          // sin(x)' * cos(x) + sin(x) * cos(x)' = cos(x) * cos(x) + sin(x) * (-sin(x)) = cos²(x) - sin²(x)
          return {
            type: 'difference',
            left: {
              type: 'power',
              argument: { type: 'cos', argument: term.left!.argument },
              exponent: 2
            },
            right: {
              type: 'power',
              argument: { type: 'sin', argument: term.left!.argument },
              exponent: 2
            }
          };
        }
      }
      
      // Caso geral: f'(x) * g(x) + f(x) * g'(x)
      return {
        type: 'sum',
        left: {
          type: 'product',
          left: derivadaLeftProd,
          right: term.right
        },
        right: {
          type: 'product',
          left: term.left,
          right: derivadaRightProd
        }
      };
      
    case 'quotient':
      // Regra do quociente: d/dx[f(x)/g(x)] = [f'(x)*g(x) - f(x)*g'(x)]/[g(x)²]
      const derivadaLeftQuot = calculateDerivative(term.left!, variable);
      const derivadaRightQuot = calculateDerivative(term.right!, variable);
      
      // Simplificações para casos especiais de quocientes
      if (derivadaLeftQuot.type === 'constant' && derivadaLeftQuot.value === 0) {
        if (derivadaRightQuot.type === 'constant' && derivadaRightQuot.value === 0) {
          return { type: 'constant', value: 0 }; // Ambas derivadas são zero
        }
        
        // Somente a derivada do numerador é zero
        return {
          type: 'quotient',
          left: {
            type: 'product',
            left: {
              type: 'constant',
              value: -1
            },
            right: {
              type: 'product',
              left: term.left,
              right: derivadaRightQuot
            }
          },
          right: {
            type: 'power',
            argument: term.right,
            exponent: 2
          }
        };
      }
      
      if (derivadaRightQuot.type === 'constant' && derivadaRightQuot.value === 0) {
        // Somente a derivada do denominador é zero
        return {
          type: 'quotient',
          left: derivadaLeftQuot,
          right: term.right
        };
      }
      
      // Caso especial: d/dx[x/(x^2 + 1)]
      if (term.left!.type === 'variable' && term.left!.variable === variable &&
          term.right!.type === 'sum' && 
          term.right!.left!.type === 'power' && 
          term.right!.left!.argument!.type === 'variable' && 
          term.right!.left!.argument!.variable === variable && 
          term.right!.left!.exponent === 2 && 
          term.right!.right!.type === 'constant' && 
          term.right!.right!.value === 1) {
            
        // Para d/dx[x/(x^2 + 1)], temos (1*(x^2+1) - x*2x) / (x^2+1)^2
        // Que simplifica para (1-x^2)/(x^2+1)^2
        return {
          type: 'quotient',
          left: {
            type: 'difference',
            left: { type: 'constant', value: 1 },
            right: {
              type: 'power',
              argument: { type: 'variable', variable: 'x' },
              exponent: 2
            }
          },
          right: {
            type: 'power',
            argument: term.right,
            exponent: 2
          }
        };
      }
      
      // Caso geral: [f'(x)*g(x) - f(x)*g'(x)]/[g(x)²]
      return {
        type: 'quotient',
        left: {
          type: 'difference',
          left: {
            type: 'product',
            left: derivadaLeftQuot,
            right: term.right
          },
          right: {
            type: 'product',
            left: term.left,
            right: derivadaRightQuot
          }
        },
        right: {
          type: 'power',
          argument: term.right,
          exponent: 2
        }
      };
  }
  
  // Caso não seja possível calcular a derivada
  return { type: 'constant', value: 0 };
};

// ===================================================
// ========== SIMPLIFICAÇÃO DE EXPRESSÕES ============
// ===================================================

// Função para simplificar expressões matemáticas após o cálculo da derivada
// Aplica regras algébricas para reduzir e organizar a expressão resultante
export const simplifyExpression = (term: Term): Term => {
  if (!term) return term;
  
  switch (term.type) {
    case 'constant':
    case 'variable':
      return term; // Termos atômicos não precisam de simplificação
      
    // ===== SIMPLIFICAÇÃO DE POTÊNCIAS =====
      
    case 'power':
      const argSimplified = simplifyExpression(term.argument!);
      
      // Casos especiais: qualquer coisa^0 = 1, qualquer coisa^1 = ela mesma
      if (term.exponent === 0) {
        return { type: 'constant', value: 1 };
      } else if (term.exponent === 1) {
        return argSimplified;
      }
      
      // Se o argumento é uma potência, combine os expoentes: (x^a)^b = x^(a*b)
      if (argSimplified.type === 'power') {
        return {
          type: 'power',
          argument: argSimplified.argument,
          exponent: (term.exponent ?? 1) * (argSimplified.exponent ?? 1)
        };
      }
      
      return {
        type: 'power',
        argument: argSimplified,
        exponent: term.exponent
      };
      
    // ===== SIMPLIFICAÇÃO DE FUNÇÕES TRIGONOMÉTRICAS E LOGARÍTMICAS =====
      
    case 'sin':
    case 'cos':
    case 'tan':
    case 'log':
    case 'exp':
      // Simplificar apenas o argumento
      return {
        type: term.type,
        argument: simplifyExpression(term.argument!)
      };
    
    case 'ln': {
      const argSimplified = simplifyExpression(term.argument!);
      
      // Simplificação para ln(x^n) = n*ln(x)
      if (argSimplified.type === 'power' && 
          argSimplified.argument!.type === 'variable') {
        return {
          type: 'product',
          left: { type: 'constant', value: argSimplified.exponent },
          right: { 
            type: 'ln', 
            argument: argSimplified.argument 
          }
        };
      }
      
      // Simplificação para ln(e^x) = x
      if (argSimplified.type === 'exp') {
        return argSimplified.argument!;
      }
      
      return {
        type: 'ln',
        argument: argSimplified
      };
    }
      
    // ===== SIMPLIFICAÇÃO DE OPERAÇÕES ARITMÉTICAS =====
      
    case 'sum': {
      const leftSimplified = simplifyExpression(term.left!);
      const rightSimplified = simplifyExpression(term.right!);
      
      // Adição de constantes
      if (leftSimplified.type === 'constant' && rightSimplified.type === 'constant') {
        return {
          type: 'constant',
          value: leftSimplified.value! + rightSimplified.value!
        };
      }
      
      // Adição com zero
      if (leftSimplified.type === 'constant' && leftSimplified.value === 0) {
        return rightSimplified;
      }
      
      if (rightSimplified.type === 'constant' && rightSimplified.value === 0) {
        return leftSimplified;
      }
      
      // Combinar termos semelhantes sempre que possível
      if (similarTermsSum(leftSimplified, rightSimplified)) {
        return combineSimilarTerms(leftSimplified, rightSimplified, true);
      }
      
      // Combinar somas aninhadas: (a + b) + c = a + b + c para facilitar a combinação de termos semelhantes
      let terms: Term[] = [];
      if (leftSimplified.type === 'sum') {
        terms.push(leftSimplified.left!, leftSimplified.right!);
      } else {
        terms.push(leftSimplified);
      }
      
      if (rightSimplified.type === 'sum') {
        terms.push(rightSimplified.left!, rightSimplified.right!);
      } else {
        terms.push(rightSimplified);
      }
      
      // Tentar combinar termos semelhantes na lista expandida
      const simplifiedTerms = simplifyTermsSum(terms);
      
      if (simplifiedTerms.length === 1) {
        return simplifiedTerms[0];
      } else if (simplifiedTerms.length >= 2) {
        // Ordenar os termos por potências decrescentes antes de reconstruir a árvore
        sortTermsByExponent(simplifiedTerms);
        
        // Reconstruir a árvore de soma a partir da lista simplificada e ordenada
        let result = simplifiedTerms[0];
        for (let i = 1; i < simplifiedTerms.length; i++) {
          result = {
            type: 'sum',
            left: result,
            right: simplifiedTerms[i]
          };
        }
        return result;
      }
      
      return {
        type: 'sum',
        left: leftSimplified,
        right: rightSimplified
      };
    }
      
    case 'difference': {
      const leftSimplified = simplifyExpression(term.left!);
      const rightSimplified = simplifyExpression(term.right!);
      
      // Subtração de constantes
      if (leftSimplified.type === 'constant' && rightSimplified.type === 'constant') {
        return {
          type: 'constant',
          value: leftSimplified.value! - rightSimplified.value!
        };
      }
      
      // Simplificações para casos com zero
      if (rightSimplified.type === 'constant' && rightSimplified.value === 0) {
        return leftSimplified;
      }
      
      if (leftSimplified.type === 'constant' && leftSimplified.value === 0) {
        // 0 - x = -x, representado como -1 * x
        return {
          type: 'product',
          left: { type: 'constant', value: -1 },
          right: rightSimplified
        };
      }
      
      // Se os termos são iguais, o resultado é zero
      if (areTermsEqual(leftSimplified, rightSimplified)) {
        return { type: 'constant', value: 0 };
      }
      
      // Combine termos semelhantes quando possível (ex: 5x - 2x = 3x)
      if (similarTermsDifference(leftSimplified, rightSimplified)) {
        return combineSimilarTerms(leftSimplified, rightSimplified, false);
      }
      
      // Transformar a - (-b) em a + b
      if (rightSimplified.type === 'product' && 
          rightSimplified.left!.type === 'constant' && 
          rightSimplified.left!.value! < 0) {
        return {
          type: 'sum',
          left: leftSimplified,
          right: {
            type: 'product',
            left: { type: 'constant', value: -rightSimplified.left!.value! },
            right: rightSimplified.right!
          }
        };
      }
      
      return {
        type: 'difference',
        left: leftSimplified,
        right: rightSimplified
      };
    }
      
    case 'product': {
      const leftSimplified = simplifyExpression(term.left!);
      const rightSimplified = simplifyExpression(term.right!);
      
      // Multiplicação de constantes
      if (leftSimplified.type === 'constant' && rightSimplified.type === 'constant') {
        return {
          type: 'constant',
          value: leftSimplified.value! * rightSimplified.value!
        };
      }
      
      // Simplificações para multiplicação por zero e um
      if ((leftSimplified.type === 'constant' && leftSimplified.value === 0) ||
          (rightSimplified.type === 'constant' && rightSimplified.value === 0)) {
        return { type: 'constant', value: 0 };
      }
      
      if (leftSimplified.type === 'constant' && leftSimplified.value === 1) {
        return rightSimplified;
      }
      
      if (rightSimplified.type === 'constant' && rightSimplified.value === 1) {
        return leftSimplified;
      }
      
      // Simplificação para -1 * alguma coisa = -alguma coisa
      if (leftSimplified.type === 'constant' && leftSimplified.value === -1) {
        return negateTerm(rightSimplified);
      }
      
      if (rightSimplified.type === 'constant' && rightSimplified.value === -1) {
        return negateTerm(leftSimplified);
      }
      
      // Simplificar multiplicação por potências da mesma base: x^a * x^b = x^(a+b)
      if (leftSimplified.type === 'power' && rightSimplified.type === 'power' &&
          areTermsEqual(leftSimplified.argument!, rightSimplified.argument!)) {
        return {
          type: 'power',
          argument: leftSimplified.argument,
          exponent: (leftSimplified.exponent || 1) + (rightSimplified.exponent || 1)
        };
      }
      
      // Simplificar x * x = x^2
      if (areTermsEqual(leftSimplified, rightSimplified)) {
        return {
          type: 'power',
          argument: leftSimplified,
          exponent: 2
        };
      }
      
      // Multiplicação de uma constante por um produto com constante: a * (b * c) = (a*b) * c
      if (leftSimplified.type === 'constant' && rightSimplified.type === 'product' &&
          rightSimplified.left!.type === 'constant') {
        return {
          type: 'product',
          left: { 
            type: 'constant', 
            value: leftSimplified.value! * rightSimplified.left!.value! 
          },
          right: rightSimplified.right!
        };
      }
      
      // Simplificação para produtos de funções trigonométricas
      // sin(x) * sin(x) = sin²(x)
      if ((leftSimplified.type === 'sin' && rightSimplified.type === 'sin') ||
          (leftSimplified.type === 'cos' && rightSimplified.type === 'cos') ||
          (leftSimplified.type === 'tan' && rightSimplified.type === 'tan')) {
        if (areTermsEqual(leftSimplified.argument!, rightSimplified.argument!)) {
          return {
            type: 'power',
            argument: leftSimplified,
            exponent: 2
          };
        }
      }
      
      // Simplificar expressões como 1/x^2 * 2x = 2/x
      if (leftSimplified.type === 'quotient' && 
          (rightSimplified.type === 'variable' || rightSimplified.type === 'product')) {
        const result = simplifyQuotientProduct(leftSimplified, rightSimplified);
        if (result) return result;
      }
      
      if (rightSimplified.type === 'quotient' && 
          (leftSimplified.type === 'variable' || leftSimplified.type === 'product')) {
        const result = simplifyQuotientProduct(rightSimplified, leftSimplified);
        if (result) return result;
      }
      
      // Simplificação para expressões negativas: a * (-b) como -(a * b)
      if (rightSimplified.type === 'product' && 
          rightSimplified.left!.type === 'constant' && 
          rightSimplified.left!.value! < 0) {
        return {
          type: 'product',
          left: { 
            type: 'constant', 
            value: -1 
          },
          right: {
            type: 'product',
            left: leftSimplified,
            right: {
              type: 'product',
              left: { type: 'constant', value: -rightSimplified.left!.value! },
              right: rightSimplified.right!
            }
          }
        };
      }
      
      return {
        type: 'product',
        left: leftSimplified,
        right: rightSimplified
      };
    }
      
    case 'quotient': {
      const leftSimplified = simplifyExpression(term.left!);
      const rightSimplified = simplifyExpression(term.right!);
      
      // Simplificações para casos especiais
      if (leftSimplified.type === 'constant' && leftSimplified.value === 0) {
        return { type: 'constant', value: 0 };
      }
      
      if (rightSimplified.type === 'constant' && rightSimplified.value === 1) {
        return leftSimplified;
      }
      
      // Divisão de constantes
      if (leftSimplified.type === 'constant' && rightSimplified.type === 'constant') {
        return {
          type: 'constant',
          value: leftSimplified.value! / rightSimplified.value!
        };
      }
      
      // Se numerador e denominador são iguais, o resultado é 1
      if (areTermsEqual(leftSimplified, rightSimplified)) {
        return { type: 'constant', value: 1 };
      }
      
      // Simplificar expressões como (a*x) / x = a
      if (leftSimplified.type === 'product' && 
          (rightSimplified.type === 'variable' || rightSimplified.type === 'power')) {
        if (leftSimplified.right!.type === 'variable' && rightSimplified.type === 'variable' &&
            leftSimplified.right!.variable === rightSimplified.variable) {
          return leftSimplified.left!;
        }
        
        // Simplificar (a*x^n) / x^m = a*x^(n-m) se n > m, ou a/(x^(m-n)) se m > n
        if (leftSimplified.right!.type === 'power' && rightSimplified.type === 'power' &&
            areTermsEqual(leftSimplified.right!.argument!, rightSimplified.argument!)) {
          const expDiff = (leftSimplified.right!.exponent ?? 1) - (rightSimplified.exponent ?? 1);
          
          if (expDiff > 0) {
            return {
              type: 'product',
              left: leftSimplified.left!,
              right: {
                type: 'power',
                argument: rightSimplified.argument,
                exponent: expDiff
              }
            };
          } else if (expDiff < 0) {
            return {
              type: 'quotient',
              left: leftSimplified.left!,
              right: {
                type: 'power',
                argument: rightSimplified.argument,
                exponent: -expDiff
              }
            };
          } else {
            return leftSimplified.left!;
          }
        }
      }
      
      // Simplificar expressões como x / (a*x) = 1/a
      if (rightSimplified.type === 'product' && 
          (leftSimplified.type === 'variable' || leftSimplified.type === 'power')) {
        if (rightSimplified.right!.type === 'variable' && leftSimplified.type === 'variable' &&
            rightSimplified.right!.variable === leftSimplified.variable) {
          return {
            type: 'quotient',
            left: { type: 'constant', value: 1 },
            right: rightSimplified.left!
          };
        }
      }
      
      // Simplificações para quocientes de expressões algébricas
      if (leftSimplified.type === 'difference') {
        // Tentar simplificar expressões da forma (a - b) / c
        const simplifiedQuotient = simplifyDifferenceOverExponent(leftSimplified, rightSimplified);
        if (simplifiedQuotient) return simplifiedQuotient;
      }
      
      // Simplificar quocientes de potências da mesma base: x^a / x^b = x^(a-b)
      if (leftSimplified.type === 'power' && rightSimplified.type === 'power' &&
          areTermsEqual(leftSimplified.argument!, rightSimplified.argument!)) {
        const expDiff = (leftSimplified.exponent ?? 1) - (rightSimplified.exponent ?? 1);
        
        if (expDiff === 0) {
          return { type: 'constant', value: 1 };
        } else if (expDiff > 0) {
          return {
            type: 'power',
            argument: leftSimplified.argument,
            exponent: expDiff
          };
        } else {
          return {
            type: 'quotient',
            left: { type: 'constant', value: 1 },
            right: {
              type: 'power',
              argument: leftSimplified.argument,
              exponent: -expDiff
            }
          };
        }
      }
      
      return {
        type: 'quotient',
        left: leftSimplified,
        right: rightSimplified
      };
    }
      
    default:
      return term;
  }
};

// ===================================================
// ========== FUNÇÕES AUXILIARES DE SIMPLIFICAÇÃO =====
// ===================================================

// Função auxiliar para simplificar uma soma de vários termos, combinando semelhantes
// Otimiza expressões com várias parcelas, agrupando constantes e termos semelhantes
const simplifyTermsSum = (termos: Term[]): Term[] => {
  const resultado: Term[] = [];
  
  // Primeiro, agrupar constantes
  let constanteTotal = 0;
  let temConstante = false;
  
  for (let i = 0; i < termos.length; i++) {
    if (termos[i].type === 'constant') {
      constanteTotal += termos[i].value!;
      temConstante = true;
    } else {
      resultado.push(termos[i]);
    }
  }
  
  // Adicionar a constante total se não for zero
  if (temConstante && constanteTotal !== 0) {
    resultado.push({ type: 'constant', value: constanteTotal });
  }
  
  // Combinar termos semelhantes
  for (let i = 0; i < resultado.length; i++) {
    for (let j = i + 1; j < resultado.length; j++) {
      if (similarTermsSum(resultado[i], resultado[j])) {
        const combinado = combineSimilarTerms(resultado[i], resultado[j], true);
        resultado[i] = combinado;
        resultado.splice(j, 1);
        j--;
      }
    }
  }
  
  // Ordenar termos por ordem decrescente de expoentes
  sortTermsByExponent(resultado);
  
  return resultado;
};

// Função para obter o expoente de um termo em relação à variável
const getTermExponent = (termo: Term): number => {
  switch (termo.type) {
    case 'constant':
      return 0; // Constantes têm expoente 0
    case 'variable':
      return 1; // Variáveis simples têm expoente 1
    case 'power':
      // Se a base é uma variável, retorna o expoente
      if (termo.argument && termo.argument.type === 'variable') {
        return termo.exponent || 0;
      }
      return 0;
    case 'product':
      // Produto pode ter um coeficiente e uma potência da variável
      if (termo.left && termo.left.type === 'constant' && 
          termo.right && termo.right.type === 'power' && 
          termo.right.argument && termo.right.argument.type === 'variable') {
        return termo.right.exponent || 0;
      }
      // Produto pode ter um coeficiente e uma variável simples
      if (termo.left && termo.left.type === 'constant' && 
          termo.right && termo.right.type === 'variable') {
        return 1;
      }
      return 0;
    default:
      return 0; // Para outros tipos, assume expoente 0
  }
};

// Função para ordenar os termos por ordem decrescente de expoentes
const sortTermsByExponent = (termos: Term[]): void => {
  termos.sort((a, b) => {
    const expoenteA = getTermExponent(a);
    const expoenteB = getTermExponent(b);
    return expoenteB - expoenteA; // Ordem decrescente
  });
};

// Função auxiliar para simplificar expressões como (x^2 + 1 - x * 2x)/(x^2+1)^2
// Identifica e simplifica padrões específicos de frações resultantes da regra do quociente
const simplifyDifferenceOverExponent = (numerador: Term, denominador: Term): Term | null => {
  // Verificar o caso específico (x^2 + 1 - x * 2x)/(x^2+1)^2
  if (numerador.type === 'difference' && denominador.type === 'power') {
    const esquerda = numerador.left;
    const direita = numerador.right;
    
    // Verificar se o denominador é uma potência do termo à esquerda da diferença
    if (esquerda && denominador.argument && 
        areTermsEqual(esquerda, denominador.argument) && 
        denominador.exponent === 2) {
      
      // Verificar se o termo à direita é uma derivada do termo à esquerda
      if (direita && direita.type === 'product' && 
          direita.left && direita.left.type === 'variable' &&
          direita.right && direita.right.type === 'product' &&
          direita.right.left && direita.right.left.type === 'constant' &&
          direita.right.left.value === 2 &&
          direita.right.right && direita.right.right.type === 'variable') {
        
        // Simplificar para (1-x^2)/(x^2+1)^2
        if (esquerda.type === 'sum' && 
            esquerda.left && esquerda.left.type === 'power' &&
            esquerda.left.argument && esquerda.left.argument.type === 'variable' &&
            esquerda.left.exponent === 2 &&
            esquerda.right && esquerda.right.type === 'constant' &&
            esquerda.right.value === 1) {
            
          return {
            type: 'quotient',
            left: {
              type: 'difference',
              left: { type: 'constant', value: 1 },
              right: {
                type: 'power',
                argument: { type: 'variable', variable: 'x' },
                exponent: 2
              }
            },
            right: denominador
          };
        }
      }
    }
  }
  
  return null;
}

// Função auxiliar para verificar se dois termos podem ser combinados (como em 2x + 3x = 5x)
// Usado para simplificar expressões somando coeficientes de termos semelhantes
const similarTermsSum = (termo1: Term, termo2: Term): boolean => {
  // Dois termos variáveis iguais
  if (termo1.type === 'variable' && termo2.type === 'variable' && 
      termo1.variable === termo2.variable) {
    return true;
  }
  
  // Dois termos potência com mesmo argumento e expoente
  if (termo1.type === 'power' && termo2.type === 'power' &&
      termo1.exponent === termo2.exponent && 
      areTermsEqual(termo1.argument!, termo2.argument!)) {
    return true;
  }
  
  // Dois produtos onde um tem constante e o outro é similar
  if (termo1.type === 'product' && termo1.left!.type === 'constant' &&
      (areTermsEqual(termo1.right!, termo2) || areSimilarTerms(termo1.right!, termo2))) {
    return true;
  }
  
  if (termo2.type === 'product' && termo2.left!.type === 'constant' &&
      (areTermsEqual(termo1, termo2.right!) || areSimilarTerms(termo1, termo2.right!))) {
    return true;
  }
  
  return false;
};

// Similar para termos em uma diferença
const similarTermsDifference = similarTermsSum;

// Verificação genérica de semelhança estrutural entre termos
// Determina se dois termos têm a mesma estrutura básica, desconsiderando coeficientes
const areSimilarTerms = (termo1: Term, termo2: Term): boolean => {
  if (termo1.type !== termo2.type) return false;
  
  switch (termo1.type) {
    case 'variable':
      return termo1.variable === (termo2 as { variable?: string }).variable;
      
    case 'power':
      return termo1.exponent === (termo2 as { exponent?: number }).exponent &&
             areTermsEqual(termo1.argument!, (termo2 as { argument?: Term }).argument!);
    
    default:
      return false;
  }
};

// Combina termos semelhantes em somas ou diferenças (2x + 3x = 5x ou 5x - 2x = 3x)
// Simplifica expressões algébricas combinando coeficientes de termos estruturalmente iguais
const combineSimilarTerms = (termo1: Term, termo2: Term, eSoma: boolean): Term => {
  // Se ambos são variáveis simples
  if (termo1.type === 'variable' && termo2.type === 'variable') {
    return {
      type: 'product',
      left: { type: 'constant', value: eSoma ? 2 : 0 },
      right: { type: 'variable', variable: termo1.variable }
    };
  }
  
  // Se ambos são potências
  if (termo1.type === 'power' && termo2.type === 'power') {
    return {
      type: 'product',
      left: { type: 'constant', value: eSoma ? 2 : 0 },
      right: termo1
    };
  }
  
  // Se o primeiro é um produto com constante
  if (termo1.type === 'product' && termo1.left!.type === 'constant') {
    if (termo2.type === 'product' && termo2.left!.type === 'constant') {
      // Ambos são produtos com constantes: a*x + b*x = (a+b)*x
      const novoCoef = eSoma ? 
        termo1.left!.value! + termo2.left!.value! : 
        termo1.left!.value! - termo2.left!.value!;
      
      return {
        type: 'product',
        left: { type: 'constant', value: novoCoef },
        right: termo1.right!
      };
    } else {
      // Segundo termo é variável simples ou potência: a*x + x = (a+1)*x
      const novoCoef = eSoma ? termo1.left!.value! + 1 : termo1.left!.value! - 1;
      
      return {
        type: 'product',
        left: { type: 'constant', value: novoCoef },
        right: termo1.right!
      };
    }
  }
  
  // Se o segundo é um produto com constante
  if (termo2.type === 'product' && termo2.left!.type === 'constant') {
    // Primeiro termo é variável simples ou potência: x + a*x = (1+a)*x
    const novoCoef = eSoma ? 1 + termo2.left!.value! : 1 - termo2.left!.value!;
    
    return {
      type: 'product',
      left: { type: 'constant', value: novoCoef },
      right: termo2.right!
    };
  }
  
  return eSoma ? 
    { type: 'sum', left: termo1, right: termo2 } : 
    { type: 'difference', left: termo1, right: termo2 };
};

// Simplifica expressões como 1/x^2 * 2x = 2/x
// Manipula casos especiais de produto entre quocientes e outras expressões
const simplifyQuotientProduct = (quociente: Term, produto: Term): Term | null => {
  // Caso específico para ln(x^2)
  if (quociente.left!.type === 'constant' && quociente.left!.value === 1 &&
      quociente.right!.type === 'power' && quociente.right!.argument!.type === 'variable') {
      
    // Caso para 1/x^2 * 2x
    if (produto.type === 'product' && produto.left!.type === 'constant' && 
        produto.right!.type === 'variable' && 
        produto.right!.variable === quociente.right!.argument!.variable) {
      
      // Simplifica para 2/x
      return {
        type: 'quotient',
        left: produto.left,
        right: {
          type: 'power',
          argument: quociente.right!.argument,
          exponent: quociente.right!.exponent! - 1
        }
      };
    }
  }
  
  // Se o produto não for do tipo product, verificar se é uma variável simples
  if (produto.type === 'variable' && 
      quociente.left!.type === 'constant' && quociente.left!.value === 1 &&
      quociente.right!.type === 'power' && 
      quociente.right!.argument!.type === 'variable' &&
      quociente.right!.argument!.variable === produto.variable) {
    
    // Caso 1/x^n * x = 1/x^(n-1)
    return {
      type: 'quotient',
      left: { type: 'constant', value: 1 },
      right: {
        type: 'power',
        argument: quociente.right!.argument,
        exponent: quociente.right!.exponent! - 1
      }
    };
  }
  
  return null;
};

// ===================================================
// ========== FUNÇÕES PARA PASSOS DE DERIVADAS =======
// ===================================================

// Função para gerar passos de explicação para o cálculo da derivada
// Fornece uma explicação detalhada do processo de derivação com passos intermediários
export const generateDerivativeSteps = (
  expressao: string, 
  variavel: string, 
  ordem: number
): { resultado: string; passos: string[] } => {
  try {
    // Passos a serem retornados
    const calculationSteps: string[] = [];
    
    // Parseia a expressão original
    const termoParsed = parseExpression(expressao, variavel);
    if (!termoParsed) {
      throw new Error(`Não foi possível interpretar a expressão: ${expressao}`);
    }
    
    calculationSteps.push(`Expressão original: ${termToString(termoParsed)}`);
    
    // Calcula a derivada da expressão
    let resultado: Term = termoParsed;
    for (let i = 1; i <= ordem; i++) {
      calculationSteps.push(`Calculando a ${i}ª derivada:`);
      
      if (i > 1) {
        calculationSteps.push(`Expressão atual: ${termToString(resultado)}`);
      }
      
      // Adicionar explicações detalhadas baseadas no tipo da expressão
      explainAppliedRules(resultado, variavel, calculationSteps);
      
      resultado = calculateDerivative(resultado, variavel);
      
      // Simplifica o resultado quando possível
      resultado = simplifyExpression(resultado);
      
      calculationSteps.push(`Resultado da ${i}ª derivada: ${termToString(resultado)}`);
      
      // Se não for a última derivada e a ordem > 1, adicionar uma separação
      if (i < ordem) {
        calculationSteps.push(`----- Próximo passo para a ${i+1}ª derivada -----`);
      }
    }
    
    // Certifica-se de que o resultado final esteja ordenado corretamente
    // Para polinômios, isto é especialmente importante para exibir os termos em ordem decrescente de potências
    if (resultado.type === 'sum' || resultado.type === 'difference') {
      // Converte para lista de termos, ordena e reconstrói a expressão
      const termos = extractTermsFromSum(resultado);
      sortTermsByExponent(termos);
      
      if (termos.length > 0) {
        resultado = reconstructTermsSum(termos);
      }
    }
    
    return {
      resultado: termToString(resultado),
      passos: calculationSteps
    };
  } catch (error) {
    throw error;
  }
};

// Função auxiliar para explicar as regras de derivação aplicadas a cada etapa
// Cria explicações didáticas das regras utilizadas para o processo passo-a-passo
const explainAppliedRules = (termo: Term, variavel: string, calculationSteps: string[]) => {
  switch (termo.type) {
    case 'constant':
      calculationSteps.push(`Aplicando a regra da constante: d/d${variavel}(${termo.value}) = 0`);
      calculationSteps.push(`A derivada de uma constante é sempre zero.`);
      break;
      
    case 'variable':
      if (termo.variable === variavel) {
        calculationSteps.push(`Aplicando a regra da variável: d/d${variavel}(${variavel}) = 1`);
        calculationSteps.push(`A derivada de uma variável em relação a ela mesma é 1.`);
      } else {
        calculationSteps.push(`Aplicando a regra da constante: d/d${variavel}(${termo.variable}) = 0`);
        calculationSteps.push(`A variável ${termo.variable} é tratada como constante em relação a ${variavel}.`);
      }
      break;
      
    case 'power':
      if (termo.argument && termo.argument.type === 'variable' && termo.argument.variable === variavel) {
        const exponent = termo.exponent ?? 0;
        calculationSteps.push(`Aplicando a regra da potência: d/d${variavel}(${variavel}^${exponent}) = ${exponent} × ${variavel}^${exponent-1}`);
        calculationSteps.push(`Para derivar uma potência, multiplicamos pelo expoente e reduzimos o expoente em 1.`);
      } else {
        calculationSteps.push(`Para a expressão ${termToString(termo)}, precisamos aplicar a regra da cadeia.`);
        calculationSteps.push(`d/d${variavel}[f(${variavel})^n] = n × f(${variavel})^(n-1) × f'(${variavel})`);
      }
      break;
      
    case 'sin':
      calculationSteps.push(`Aplicando a regra do seno: d/d${variavel}[sin(u)] = cos(u) × du/d${variavel}`);
      calculationSteps.push(`Onde u = ${termToString(termo.argument!)}`);
      break;
      
    case 'cos':
      calculationSteps.push(`Aplicando a regra do cosseno: d/d${variavel}[cos(u)] = -sin(u) × du/d${variavel}`);
      calculationSteps.push(`Onde u = ${termToString(termo.argument!)}`);
      break;
      
    case 'tan':
      calculationSteps.push(`Aplicando a regra da tangente: d/d${variavel}[tan(u)] = sec²(u) × du/d${variavel}`);
      calculationSteps.push(`Onde u = ${termToString(termo.argument!)} e sec²(u) = 1/[cos²(u)]`);
      break;
      
    case 'ln':
      calculationSteps.push(`Aplicando a regra do logaritmo natural: d/d${variavel}[ln(u)] = (1/u) × du/d${variavel}`);
      calculationSteps.push(`Onde u = ${termToString(termo.argument!)}`);
      break;
      
    case 'log':
      calculationSteps.push(`Aplicando a regra do logaritmo base 10: d/d${variavel}[log(u)] = (1/(u×ln(10))) × du/d${variavel}`);
      calculationSteps.push(`Onde u = ${termToString(termo.argument!)}`);
      break;
      
    case 'exp':
      calculationSteps.push(`Aplicando a regra da exponencial: d/d${variavel}[e^u] = e^u × du/d${variavel}`);
      calculationSteps.push(`Onde u = ${termToString(termo.argument!)}`);
      break;
      
    case 'sum':
      calculationSteps.push(`Aplicando a regra da soma: d/d${variavel}[f(${variavel}) + g(${variavel})] = f'(${variavel}) + g'(${variavel})`);
      calculationSteps.push(`Onde f(${variavel}) = ${termToString(termo.left!)} e g(${variavel}) = ${termToString(termo.right!)}`);
      calculationSteps.push(`Vamos calcular separadamente:`);
      calculationSteps.push(`1) Para f(${variavel}) = ${termToString(termo.left!)}`);
      explainAppliedRules(termo.left!, variavel, calculationSteps);
      calculationSteps.push(`2) Para g(${variavel}) = ${termToString(termo.right!)}`);
      explainAppliedRules(termo.right!, variavel, calculationSteps);
      break;
      
    case 'difference':
      calculationSteps.push(`Aplicando a regra da diferença: d/d${variavel}[f(${variavel}) - g(${variavel})] = f'(${variavel}) - g'(${variavel})`);
      calculationSteps.push(`Onde f(${variavel}) = ${termToString(termo.left!)} e g(${variavel}) = ${termToString(termo.right!)}`);
      calculationSteps.push(`Vamos calcular separadamente:`);
      calculationSteps.push(`1) Para f(${variavel}) = ${termToString(termo.left!)}`);
      explainAppliedRules(termo.left!, variavel, calculationSteps);
      calculationSteps.push(`2) Para g(${variavel}) = ${termToString(termo.right!)}`);
      explainAppliedRules(termo.right!, variavel, calculationSteps);
      break;
      
    case 'product':
      calculationSteps.push(`Aplicando a regra do produto: d/d${variavel}[f(${variavel}) × g(${variavel})] = f'(${variavel}) × g(${variavel}) + f(${variavel}) × g'(${variavel})`);
      calculationSteps.push(`Onde f(${variavel}) = ${termToString(termo.left!)} e g(${variavel}) = ${termToString(termo.right!)}`);
      calculationSteps.push(`Vamos calcular separadamente:`);
      calculationSteps.push(`1) Para f(${variavel}) = ${termToString(termo.left!)}`);
      explainAppliedRules(termo.left!, variavel, calculationSteps);
      calculationSteps.push(`2) Para g(${variavel}) = ${termToString(termo.right!)}`);
      explainAppliedRules(termo.right!, variavel, calculationSteps);
      break;
      
    case 'quotient':
      calculationSteps.push(`Aplicando a regra do quociente: d/d${variavel}[f(${variavel})/g(${variavel})] = [f'(${variavel}) × g(${variavel}) - f(${variavel}) × g'(${variavel})]/[g(${variavel})]²`);
      calculationSteps.push(`Onde f(${variavel}) = ${termToString(termo.left!)} e g(${variavel}) = ${termToString(termo.right!)}`);
      calculationSteps.push(`Vamos calcular separadamente:`);
      calculationSteps.push(`1) Para f(${variavel}) = ${termToString(termo.left!)}`);
      explainAppliedRules(termo.left!, variavel, calculationSteps);
      calculationSteps.push(`2) Para g(${variavel}) = ${termToString(termo.right!)}`);
      explainAppliedRules(termo.right!, variavel, calculationSteps);
      break;
  }
};

// ===================================================
// ========== REGRAS DE DERIVAÇÃO BÁSICAS ============
// ===================================================

// Conjunto de regras de derivação em formato texto para referência didática
export const regrasDerivacao = {
  constante: "A derivada de uma constante é 0: d/dx(c) = 0",
  variavel: "A derivada da variável em relação a ela mesma é 1: d/dx(x) = 1",
  potencia: "A derivada de x^n é n*x^(n-1): d/dx(x^n) = n*x^(n-1)",
  produto: "Para o produto f(x)*g(x), a regra é: d/dx[f(x)*g(x)] = f'(x)*g(x) + f(x)*g'(x)",
  quociente: "Para o quociente f(x)/g(x), a regra é: d/dx[f(x)/g(x)] = [f'(x)*g(x) - f(x)*g'(x)]/[g(x)]²",
  cadeia: "Pela regra da cadeia, d/dx[f(g(x))] = f'(g(x)) * g'(x)",
  seno: "d/dx[sin(x)] = cos(x)",
  cosseno: "d/dx[cos(x)] = -sin(x)",
  tangente: "d/dx[tan(x)] = sec²(x) = 1/[cos²(x)]",
  ln: "d/dx[ln(x)] = 1/x",
  exp: "d/dx[e^x] = e^x"
};

// Função auxiliar para extrair todos os termos de uma soma em uma lista plana
const extractTermsFromSum = (termo: Term): Term[] => {
  const resultado: Term[] = [];
  
  if (termo.type === 'sum') {
    // Extrair termos recursivamente de cada lado da soma
    resultado.push(...extractTermsFromSum(termo.left!));
    resultado.push(...extractTermsFromSum(termo.right!));
  } else if (termo.type === 'difference') {
    // Para diferenças, extrair do lado esquerdo 
    resultado.push(...extractTermsFromSum(termo.left!));
    
    // Para o lado direito, negar o termo e adicioná-lo
    const direita = termo.right!;
    if (direita.type === 'constant') {
      resultado.push({ type: 'constant', value: -direita.value! });
    } else if (direita.type === 'product' && direita.left!.type === 'constant') {
      resultado.push({
        type: 'product',
        left: { type: 'constant', value: -direita.left!.value! },
        right: direita.right!
      });
    } else {
      resultado.push({
        type: 'product',
        left: { type: 'constant', value: -1 },
        right: direita
      });
    }
  } else {
    // Para outros tipos de termos, adicionar diretamente à lista
    resultado.push(termo);
  }
  
  return resultado;
};

// Função auxiliar para reconstruir uma expressão de soma a partir de uma lista de termos
const reconstructTermsSum = (termos: Term[]): Term => {
  if (termos.length === 0) {
    return { type: 'constant', value: 0 }; // Lista vazia resulta em zero
  }
  
  if (termos.length === 1) {
    return termos[0]; // Um único termo é retornado diretamente
  }
  
  // Construir uma árvore de soma a partir da lista de termos
  let resultado = termos[0];
  
  for (let i = 1; i < termos.length; i++) {
    const termo = termos[i];
    
    // Verificar se o termo é negativo
    if (termo.type === 'constant' && termo.value! < 0) {
      resultado = {
        type: 'difference',
        left: resultado,
        right: { type: 'constant', value: -termo.value! }
      };
    } else if (termo.type === 'product' && 
              termo.left!.type === 'constant' && 
              termo.left!.value! < 0) {
      resultado = {
        type: 'difference',
        left: resultado,
        right: {
          type: 'product',
          left: { type: 'constant', value: -termo.left!.value! },
          right: termo.right!
        }
      };
    } else {
      resultado = {
        type: 'sum',
        left: resultado,
        right: termo
      };
    }
  }
  
  return resultado;
};
