// ===================================================
// ======== CACHE PARA EXPRESSÕES MATEMÁTICAS ========
// ===================================================

// Interface para entradas de cache com funcionalidade LRU
export interface CacheEntry<T> {
  value: T;
  timestamp: number;
}

// Tamanho máximo do cache
const MAX_CACHE_SIZE = 1000;

// Cache para expressões analisadas para evitar repetidos
export const parsedExpressionCache = new Map<string, CacheEntry<any>>();

// Cache para representações de strings
export const stringifiedTermCache = new Map<string, CacheEntry<string>>();

// Gerar uma chave de cache única
export const getCacheKey = (key: string, prefix: string = ''): string => {
  return prefix ? `${prefix}:${key}` : key;
};

// Adicionar um item ao cache com política de expulsão LRU
export function addToCache<T>(
  cache: Map<string, CacheEntry<T>>,
  key: string,
  value: T
): void {
  // Implementar expulsão LRU do cache se estiver cheio
  if (cache.size >= MAX_CACHE_SIZE) {
    // Encontrar a entrada mais antiga
    let oldestKey: string | null = null;
    let oldestTime = Date.now();
    
    for (const [entryKey, entry] of cache.entries()) {
      if (entry.timestamp < oldestTime) {
        oldestTime = entry.timestamp;
        oldestKey = entryKey;
      }
    }
    
    // Remover a entrada mais antiga
    if (oldestKey) {
      cache.delete(oldestKey);
    }
  }
  
  // Adicionar nova entrada com a marcação de tempo atual
  cache.set(key, {
    value,
    timestamp: Date.now()
  });
}

// Obter um item do cache e atualizar sua marcação de tempo
export function getFromCache<T>(
  cache: Map<string, CacheEntry<T>>,
  key: string
): T | undefined {
  const entry = cache.get(key);
  
  if (entry) {
    // Atualizar a marcação de tempo (touch the entry) para marcá-la como recentemente usada
    entry.timestamp = Date.now();
    return entry.value;
  }
  
  return undefined;
}

// Limpar cache específico ou todos os caches
export function clearCache(cache?: Map<string, CacheEntry<any>>): void {
  if (cache) {
    cache.clear();
  } else {
    // Limpar todos os caches
    parsedExpressionCache.clear();
    stringifiedTermCache.clear();
  }
}

// Obter estatísticas de cache para monitoramento
export function getCacheStats(): { [key: string]: number } {
  return {
    parsedExpressionCacheSize: parsedExpressionCache.size,
    stringifiedTermCacheSize: stringifiedTermCache.size,
  };
} 