// Utilidades para avaliar expressões trigonométricas
import {
  processImplicitMultiplications,
  evaluateTermForValue,
  evaluateExpression
} from '../mathUtils';

import { parseExpression } from '../mathUtilsCalculo/geral/mathUtilsCalculoGeral';

// Avalia uma expressão trigonométrica para um valor específico de x.
// Implementa análise baseada em Term com fallback para avaliação dinâmica
export function evaluateTrigonometricExpression(expressao: string, x: number): number {
    try {
        // Tentar usar o parser de termos para avaliação
        try {
            // Função para processar a expressão em uma única passagem
            const processExpression = (exp: string): string => {
                return exp
                    .trim()
                    // Normalizar todos os espaços em uma única passagem
                    .replace(/\s+/g, ' ')
                    .replace(/\(\s+/g, '(')
                    .replace(/\s+\)/g, ')')
                    .replace(/(\S)\s*([+\-])\s*(\S)/g, '$1$2$3')
                    // Padronizar todas as funções trigonométricas
                    .replace(/sen\(/g, 'sin(')
                    .replace(/tg\(/g, 'tan(')
                    .replace(/cotg\(/g, 'cot(')
                    // Processar notações especiais de funções trigonométricas
                    .replace(/(sin|cos|tan|cot|sec|csc)\^(\d+)\(([^)]*)\)/g, '($1($3))^$2')
                    // Padronizar operadores
                    .replace(/\^/g, '**')
                    // Processar raízes quadradas
                    .replace(/√(\d+)/g, 'Math.sqrt($1)')
                    .replace(/√\(/g, 'Math.sqrt(')
                    .replace(/√([a-zA-Z])/g, 'Math.sqrt($1)');
            };
            
            // Processar a expressão em uma única passagem
            let expressaoProcessada = processExpression(expressao);
            
            // Processar multiplicações implícitas
            expressaoProcessada = processImplicitMultiplications(expressaoProcessada);
            
            // Analisar a expressão usando a estrutura Term
            const termo = parseExpression(expressaoProcessada, 'x');
            
            if (termo) {
                // Se o parsing foi bem-sucedido, avaliar o termo
                return evaluateTermForValue(termo, 'x', x);
            }
        } catch (parseError) { 
            // Em caso de falha, usar a função de avaliação unificada
        }
        
        // Usar a função de avaliação unificada
        return evaluateExpression(expressao, 'x', x);
        
    } catch (error) {
        throw new Error('Erro ao avaliar a expressão: ' + error);
    }
} 