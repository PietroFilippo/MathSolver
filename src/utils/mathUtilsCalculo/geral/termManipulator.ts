// ===================================================
// ======= FUNÇÕES PARA MANIPULAÇÃO DE TERMOS ========
// ===================================================

import { Term } from './termDefinition';
import { stringifiedTermCache, getCacheKey, addToCache, getFromCache } from './expressionCache';

// Converte um objeto Term em uma representação legível em string
// Usado para exibir resultados de derivadas, integrais e limites
export const termToString = (term: Term): string => {
  if (!term) return '';
  
  // Gerar uma chave única para o termo
  const termKey = JSON.stringify(term);
  const cacheKey = getCacheKey(termKey, 'toString');
  
  // Verificar se já está no cache
  const cachedResult = getFromCache(stringifiedTermCache, cacheKey);
  if (cachedResult !== undefined) {
    return cachedResult;
  }
  
  // Continuar com a conversão se não estiver no cache
  let result = '';
  
  switch (term.type) {
    case 'constant':
      result = term.value!.toString();
      break;
      
    case 'variable':
      result = term.variable!;
      break;
      
    case 'power':
      const argStr = termToString(term.argument!);
      const needsParens = term.argument!.type !== 'variable' && 
                         term.argument!.type !== 'constant';
      
      // Caso especial: potência de expoente 1/2 (raiz quadrada)
      if (term.exponent === 0.5) {
        result = `sqrt(${argStr})`;
      } else {
        result = needsParens ? `(${argStr})^${term.exponent}` : `${argStr}^${term.exponent}`;
      }
      break;
      
    case 'sin':
      result = `sin(${termToString(term.argument!)})`;
      break;
      
    case 'cos':
      result = `cos(${termToString(term.argument!)})`;
      break;
      
    case 'tan':
      result = `tan(${termToString(term.argument!)})`;
      break;
      
    case 'ln':
      result = `ln(${termToString(term.argument!)})`;
      break;
      
    case 'log':
      result = `log(${termToString(term.argument!)})`;
      break;
      
    case 'exp':
      result = `e^(${termToString(term.argument!)})`;
      break;
      
    case 'sqrt':
      result = `sqrt(${termToString(term.argument!)})`;
      break;
      
    case 'sum': {
      const leftStr = termToString(term.left!);
      const rightStr = termToString(term.right!);
      
      // Verifica se o termo direito é uma constante negativa para evitar "a + -b"
      if (term.right!.type === 'constant' && term.right!.value! < 0) {
        result = `${leftStr} - ${Math.abs(term.right!.value!)}`;
      } else if (term.right!.type === 'product' && 
          term.right!.left!.type === 'constant' && 
          term.right!.left!.value! < 0) {
        
        // Remove o sinal negativo e apresenta como subtração
        result = `${leftStr} - ${termToString({
          type: 'product',
          left: { type: 'constant', value: -term.right!.left!.value! },
          right: term.right!.right!
        })}`;
      } else {
        result = `${leftStr} + ${rightStr}`;
      }
      break;
    }
      
    case 'difference': {
      const leftStr = termToString(term.left!);
      let rightStr = termToString(term.right!);
      
      // Se o lado direito já é um produto com constante negativa, apresenta como adição
      if (term.right!.type === 'product' && 
          term.right!.left!.type === 'constant' && 
          term.right!.left!.value! < 0) {
        
        result = `${leftStr} + ${termToString({
          type: 'product',
          left: { type: 'constant', value: -term.right!.left!.value! },
          right: term.right!.right!
        })}`;
      }
      
      // Adiciona parênteses ao termo direito se for uma soma ou diferença
      if (term.right!.type === 'sum' || term.right!.type === 'difference') {
        rightStr = `(${rightStr})`;
      }
      
      result = `${leftStr} - ${rightStr}`;
      break;
    }
      
    case 'product': {
      // Casos especiais para multiplicação
      if (term.left!.type === 'constant' && term.left!.value === 0) {
        result = '0'; // 0 * qualquer coisa = 0
      }
      
      if (term.left!.type === 'constant' && term.left!.value === 1) {
        result = termToString(term.right!); // 1 * algo = algo
      }
      
      if (term.right!.type === 'constant' && term.right!.value === 0) {
        result = '0'; // qualquer coisa * 0 = 0
      }
      
      if (term.right!.type === 'constant' && term.right!.value === 1) {
        result = termToString(term.left!); // algo * 1 = algo
      }
      
      // Caso especial para -1 * algo = -algo
      if (term.left!.type === 'constant' && term.left!.value === -1) {
        const rightStr = termToString(term.right!);
        
        // Se o lado direito for uma soma ou diferença, vamos distribuir o -1
        if (term.right!.type === 'sum') {
          // Para soma (a + b), transformamos em (-a - b)
          result = termToString({
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
          result = termToString({
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
        result = `-${rightStr}`;
      }
      
      let leftStr = termToString(term.left!);
      let rightStr = termToString(term.right!);
      
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
          result = `${leftStr}${rightStr}`;
        }
      }
      
      // Formato para coeficiente * variável - usa notação como "3x" em vez de "3 × x"
      if (term.left!.type === 'constant' && 
          (term.right!.type === 'variable' || term.right!.type === 'power' || 
           term.right!.type === 'sin' || term.right!.type === 'cos' || 
           term.right!.type === 'tan')) {
        result = `${leftStr}${rightStr}`;
      } 
      // Se não é um caso especial e ainda não foi definido, use o formato padrão com símbolo de multiplicação
      else if (result === '') {
        result = `${leftStr} × ${rightStr}`;
      }
      
      break;
    }
      
    case 'quotient': {
      // Casos especiais para divisão
      if (term.left!.type === 'constant' && term.left!.value === 0) {
        result = '0'; // 0 / qualquer coisa = 0
      }
      
      if (term.right!.type === 'constant' && term.right!.value === 1) {
        result = termToString(term.left!); // algo / 1 = algo
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
      
      result = `${leftStr}/${rightStr}`;
      break;
    }
      
    default:
      result = '';
  }
  
  // Adicionar resultado ao cache antes de retornar
  addToCache(stringifiedTermCache, cacheKey, result);
  return result;
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
export const areTermsEqual = (a: Term, b: Term): boolean => {
  // Quick check for same object reference
  if (a === b) return true;
  
  // Quick check for different types
  if (a.type !== b.type) return false;
  
  // For simple types, direct comparison is faster
  if (a.type === 'constant') {
    return a.value === b.value;
  }
  
  if (a.type === 'variable') {
    return a.variable === b.variable;
  }
  
  // For more complex terms, compare cached string representations
  const strA = termToString(a);
  const strB = termToString(b);
  
  return strA === strB;
};

// Função auxiliar para extrair todos os termos de uma soma em uma lista plana
// Usada tanto para derivadas quanto para integrais
export const extractTermsFromSum = (termo: Term): Term[] => {
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
      // Para outros tipos de termos, criar -1 * termo
      resultado.push({
        type: 'product',
        left: { type: 'constant', value: -1 },
        right: direita
      });
    }
  } else {
    // Termo que não é soma nem diferença, adicionar diretamente
    resultado.push(termo);
  }
  
  return resultado;
};

// Função para reconstruir uma expressão de soma a partir de uma lista de termos
// Usada tanto para derivadas quanto para integrais
export const reconstructTermsSum = (termos: Term[]): Term => {
  if (termos.length === 0) {
    return { type: 'constant', value: 0 };
  }
  
  if (termos.length === 1) {
    return termos[0];
  }
  
  // Começar com o primeiro termo
  let resultado = termos[0];
  
  // Adicionar os demais termos como somas
  for (let i = 1; i < termos.length; i++) {
    const termo = termos[i];
    
    // Se o termo for constante negativa, transformar em diferença
    if (termo.type === 'constant' && termo.value! < 0) {
      resultado = {
        type: 'difference',
        left: resultado,
        right: { type: 'constant', value: -termo.value! }
      };
    }
    // Se for produto com constante negativa, também transformar em diferença
    else if (termo.type === 'product' && 
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
    }
    // Caso contrário, manter como soma
    else {
      resultado = {
        type: 'sum',
        left: resultado,
        right: termo
      };
    }
  }
  
  return resultado;
};

// Verifica se um termo é uma variável ou expressão linear da variável
// Usada tanto para derivadas quanto para integrais
export const isVariableOrLinearExpression = (term: Term | undefined, variable: string): boolean => {
  if (!term) return false;
  
  // Caso mais simples: é a própria variável
  if (term.type === 'variable' && term.variable === variable) {
    return true;
  }
  
  // Caso de produto entre constante e variável (ex: 2x)
  if (term.type === 'product' && 
      ((term.left?.type === 'constant' && term.right?.type === 'variable' && term.right.variable === variable) ||
       (term.right?.type === 'constant' && term.left?.type === 'variable' && term.left.variable === variable))) {
    return true;
  }
  
  // Caso de soma entre constante e variável (ex: x+2)
  if (term.type === 'sum' && 
      ((term.left?.type === 'constant' && term.right?.type === 'variable' && term.right.variable === variable) ||
       (term.right?.type === 'constant' && term.left?.type === 'variable' && term.left.variable === variable))) {
    return true;
  }
  
  // Caso de diferença entre constante e variável (ex: x-2, 2-x)
  if (term.type === 'difference' && 
      ((term.left?.type === 'constant' && term.right?.type === 'variable' && term.right.variable === variable) ||
       (term.right?.type === 'constant' && term.left?.type === 'variable' && term.left.variable === variable))) {
    return true;
  }
  
  return false;
}; 