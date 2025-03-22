// Manipula o cache de resultados de derivadas
import { Term } from '../geral/mathUtilsCalculoGeral';

// Cache para memoização
export interface DerivativeCache {
  [key: string]: Term;
}

// Configuração do tamanho máximo do cache
export const MAX_CACHE_SIZE = 1000;

// Map para armazenar a ordem de acesso para implementação de LRU
const cacheAccessOrder: string[] = [];

export const derivativeResultCache: DerivativeCache = {};

// Gera uma chave de cache
export const getDerivativeCacheKey = (expression: string, variable: string): string => {
  return `${expression}_${variable}`;
};

// Adiciona um resultado ao cache com gerenciamento de tamanho
export const addToDerivativeCache = (key: string, value: Term): void => {
  // Se a chave já existe, remova-a da ordem de acesso
  const existingIndex = cacheAccessOrder.indexOf(key);
  if (existingIndex >= 0) {
    cacheAccessOrder.splice(existingIndex, 1);
  }
  
  // Se o cache atingiu tamanho máximo, remova o item menos recentemente usado
  if (Object.keys(derivativeResultCache).length >= MAX_CACHE_SIZE && existingIndex < 0) {
    const oldestKey = cacheAccessOrder.shift();
    if (oldestKey) {
      delete derivativeResultCache[oldestKey];
    }
  }
  
  // Adicione ou atualize o valor no cache
  derivativeResultCache[key] = value;
  
  // Adicione a chave como o item mais recentemente usado
  cacheAccessOrder.push(key);
};

// Obtém um valor do cache, atualizando a ordem de acesso (LRU)
export const getFromDerivativeCache = (key: string): Term | undefined => {
  const value = derivativeResultCache[key];
  
  if (value) {
    // Atualiza a posição da chave na ordem de acesso
    const index = cacheAccessOrder.indexOf(key);
    if (index >= 0) {
      cacheAccessOrder.splice(index, 1);
      cacheAccessOrder.push(key);
    }
  }
  
  return value;
}; 