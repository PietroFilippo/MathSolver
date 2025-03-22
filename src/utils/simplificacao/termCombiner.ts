import { Term } from '../mathUtilsCalculo/geral/termDefinition';
import { negateTerm } from '../mathUtilsCalculo/geral/termManipulator';
import { areSimilarTerms, combineSimilarTerms, sortTermsByExponent } from './utilityFunctions';
import { SimplificationResult } from './simplificationTypes';

// Combina termos semelhantes em expressões
export const combineLikeTerms = (term: Term): SimplificationResult => {
  if (!term) return { term, wasSimplified: false };
  
  if (term.type === 'sum' || term.type === 'difference') {
    // Extrai todos os termos da expressão e combina os termos semelhantes
    const allTerms: Term[] = flattenExpression(term);
    const simplifiedTerms = simplifyTermsSum(allTerms);
    
    if (simplifiedTerms.length === 1) {
      return { term: simplifiedTerms[0], wasSimplified: true };
    } else if (simplifiedTerms.length > 1) {
      // Certifique-se de que os termos estão ordenados antes de reconstruir a árvore
      sortTermsByExponent(simplifiedTerms);
      
      // Reconstrói a árvore da soma a partir da lista simplificada
      let result = simplifiedTerms[0];
      for (let i = 1; i < simplifiedTerms.length; i++) {
        result = {
          type: 'sum',
          left: result,
          right: simplifiedTerms[i]
        };
      }
      return { term: result, wasSimplified: true };
    }
  }
  
  return { term, wasSimplified: false };
};

// Função auxiliar para "aplanar" expressões de soma/diferença em uma lista de termos
export const flattenExpression = (term: Term): Term[] => {
  const result: Term[] = [];
  
  if (term.type === 'sum') {
    result.push(...flattenExpression(term.left!));
    result.push(...flattenExpression(term.right!));
  } else if (term.type === 'difference') {
    result.push(...flattenExpression(term.left!));
    // Para diferenças, negamos o termo direito
    const negatedRight = negateTerm(term.right!);
    result.push(...flattenExpression(negatedRight));
  } else {
    result.push(term);
  }
  
  return result;
};

// Função auxiliar para simplificar uma soma de vários termos, combinando os termos semelhantes
export const simplifyTermsSum = (terms: Term[]): Term[] => {
  const result: Term[] = [];
  
  // Primeiro, agrupamos constantes
  let totalConstant = 0;
  let hasConstant = false;
  
  for (let i = 0; i < terms.length; i++) {
    if (terms[i].type === 'constant') {
      totalConstant += terms[i].value!;
      hasConstant = true;
    } else {
      result.push(terms[i]);
    }
  }
  
  // Combinamos termos semelhantes
  for (let i = 0; i < result.length; i++) {
    for (let j = i + 1; j < result.length; j++) {
      if (areSimilarTerms(result[i], result[j])) {
        const combined = combineSimilarTerms(result[i], result[j], true);
        result[i] = combined;
        result.splice(j, 1);
        j--;
      }
    }
  }
  
  // Filtramos termos zero
  const filteredResult = result.filter(term => {
    if (term.type === 'constant') {
      return term.value !== 0;
    }
    return true;
  });
  
  // Adicionamos a constante total se não for zero
  if (hasConstant && totalConstant !== 0) {
    filteredResult.push({ type: 'constant', value: totalConstant });
  }
  
  // Ordenamos termos por expoentes decrescentes
  sortTermsByExponent(filteredResult);
  
  return filteredResult;
}; 