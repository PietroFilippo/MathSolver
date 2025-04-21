// ===================================================
// ========= API PRINCIPAL DE INEQUAÇÕES ALGÉBRICAS ===
// ===================================================

import { 
  TipoInequacao, 
  InequalityResult, 
  ValueCheckResult, 
  PassoResolucao 
} from './algebraInequalityTypes';
import { parseInequality } from './algebraInequalityParser';
import { 
  solveLinearInequality,
  solveQuadraticInequality,
  solveRationalInequality,
  solveModulusInequality
} from './algebraInequalityRules';
import { checkValueSatisfiesInequality } from './algebraInequalityUtils';
import { evaluateExpression } from '../core/algebraAPI';

// Cache para resultados de inequações
const inequalityCache: Map<string, InequalityResult> = new Map();
const valueCheckCache: Map<string, ValueCheckResult> = new Map();

// Função principal para resolver inequações
export const solveInequality = (
  inequacao: string,
  tipoInequacao: TipoInequacao
): InequalityResult => {
  // Verificar cache primeiro
  const cacheKey = `${inequacao}|${tipoInequacao}`;
  const cachedResult = inequalityCache.get(cacheKey);
  if (cachedResult) {
    return {
      ...cachedResult,
      passos: [...cachedResult.passos]
    };
  }
  
  try {
    // Parsear a inequação
    const inequality = parseInequality(inequacao);
    
    // Resolver baseado no tipo
    let result: InequalityResult;
    
    switch (tipoInequacao) {
      case 'linear':
        result = solveLinearInequality(inequality);
        break;
      case 'quadratica':
        result = solveQuadraticInequality(inequality);
        break;
      case 'racional':
        result = solveRationalInequality(inequality);
        break;
      case 'modulo':
        result = solveModulusInequality(inequality);
        break;
      default:
        throw new Error(`Tipo de inequação não suportado: ${tipoInequacao}`);
    }
    
    // Armazenar no cache
    inequalityCache.set(cacheKey, {
      ...result,
      passos: [...result.passos]
    });
    
    return result;
  } catch (error) {
    throw new Error(`Erro ao resolver a inequação: ${error}`);
  }
};

// Função para verificar se um valor satisfaz uma inequação
export const checkValue = (
  inequacao: string,
  valor: string
): ValueCheckResult => {
  // Verificar cache primeiro
  const cacheKey = `${inequacao}|${valor}`;
  const cachedResult = valueCheckCache.get(cacheKey);
  if (cachedResult) {
    return {
      ...cachedResult,
      passos: [...cachedResult.passos]
    };
  }
  
  try {
    const passos: PassoResolucao[] = [];
    
    // Parsear a inequação
    const inequality = parseInequality(inequacao);
    
    // Verificar o valor
    const resultado = checkValueSatisfiesInequality(inequality, 'x', parseFloat(valor));
    
    passos.push({
      expressao: `Substituindo x = ${valor} em ${inequacao}`,
      explicacao: `Vamos verificar se ${valor} satisfaz a inequação.`
    });
    
    // Substituir o valor na inequação
    const substitutedExpression = inequacao.replace(/x/g, `(${valor})`);
    const evaluatedExpression = evaluateExpression(substitutedExpression);
    
    passos.push({
      expressao: `Após substituir: ${substitutedExpression}`,
      explicacao: `Substituímos x por ${valor} na inequação.`
    });
    
    passos.push({
      expressao: `Após avaliar: ${evaluatedExpression}`,
      explicacao: `Avaliamos a expressão após a substituição.`
    });
    
    passos.push({
      expressao: resultado ? 
        `O valor ${valor} SATISFAZ a inequação.` :
        `O valor ${valor} NÃO satisfaz a inequação.`,
      explicacao: resultado ?
        `Quando substituímos x por ${valor}, a desigualdade é verdadeira.` :
        `Quando substituímos x por ${valor}, a desigualdade é falsa.`
    });
    
    const result = { resultado, passos };
    
    // Armazenar no cache
    valueCheckCache.set(cacheKey, {
      ...result,
      passos: [...result.passos]
    });
    
    return result;
  } catch (error) {
    throw new Error(`Erro ao verificar o valor: ${error}`);
  }
}; 