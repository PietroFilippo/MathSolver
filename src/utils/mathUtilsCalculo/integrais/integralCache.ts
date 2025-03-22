// Cache utilitários para cálculos de integrais
import { Term } from '../geral/mathUtilsCalculoGeral';

// Interface para a estrutura do cache
interface IntegralCache {
  [key: string]: string;
}

// Configuração do tamanho máximo do cache
export const MAX_CACHE_SIZE = 1000;

// Array para armazenar a ordem de acesso (LRU)
const cacheAccessOrder: string[] = [];

// Cache para armazenar resultados de integrais para evitar cálculos redundantes
export const integralResultCache: IntegralCache = {};

// Gera uma chave de cache para uma expressão integral e uma variável
export function getCacheKey(expression: string | Term, variable: string): string {
  const expressionKey = typeof expression === 'string' ? expression : expression.toString();
  return `${expressionKey}_${variable}`;
}

// Adiciona um resultado ao cache com gerenciamento de tamanho (LRU)
export function addToCache(key: string, value: string): void {
  // Se a chave já existe, remova-a da ordem de acesso
  const existingIndex = cacheAccessOrder.indexOf(key);
  if (existingIndex >= 0) {
    cacheAccessOrder.splice(existingIndex, 1);
  }
  
  // Se o cache atingiu tamanho máximo, remova o item menos recentemente usado
  if (Object.keys(integralResultCache).length >= MAX_CACHE_SIZE && existingIndex < 0) {
    const oldestKey = cacheAccessOrder.shift();
    if (oldestKey) {
      delete integralResultCache[oldestKey];
    }
  }
  
  // Adicione ou atualize o valor no cache
  integralResultCache[key] = value;
  
  // Adicione a chave como o item mais recentemente usado
  cacheAccessOrder.push(key);
}

// Obtém um valor do cache, atualizando a ordem de acesso (LRU)
export function getFromCache(key: string): string | undefined {
  const value = integralResultCache[key];
  
  if (value) {
    // Atualiza a posição da chave na ordem de acesso
    const index = cacheAccessOrder.indexOf(key);
    if (index >= 0) {
      cacheAccessOrder.splice(index, 1);
      cacheAccessOrder.push(key);
    }
  }
  
  return value;
} 