// Utilidades para gerar dados de gráfico para funções trigonométricas
import { evaluateTrigonometricExpression } from './expressions';

// Gera pontos para um gráfico de função trigonométrica
export function generateTrigonometricFunctionPoints(
    tipoGrafico: 'seno' | 'cosseno' | 'tangente' | 'personalizado',
    intervalo: [number, number],
    amplitude: number = 1, 
    periodo: number = 1,
    defasagem: number = 0,
    deslocamentoVertical: number = 0,
    funcaoPersonalizada: string = '',
    numeroPontos?: number
): { x: number; y: number; }[] {
    const [inicio, fim] = intervalo;
    
    // Densidade de pontos adaptativa com base no tipo de função e tamanho do intervalo
    if (!numeroPontos) {
        const intervalSize = Math.abs(fim - inicio);
        
        // Baseia a densidade de pontos no período e tamanho do intervalo
        if (tipoGrafico === 'tangente') {
            // Tangente precisa de mais pontos devido às assíntotas
            numeroPontos = Math.max(500, Math.ceil(intervalSize * 20 / periodo));
        } else if (tipoGrafico === 'personalizado') {
            // Densidade padrão maior para funções personalizadas
            numeroPontos = Math.max(300, Math.ceil(intervalSize * 10 / periodo));
        } else {
            // Seno/cosseno são mais suaves, precisam de menos pontos
            numeroPontos = Math.max(200, Math.ceil(intervalSize * 8 / periodo));
        }
        
        // Capacidade máxima de pontos para evitar problemas de desempenho
        numeroPontos = Math.min(numeroPontos, 2000);
    }
    
    const passo = (fim - inicio) / (numeroPontos - 1);
    const pontos: { x: number; y: number; }[] = [];
    
    // Fator para ajustar o período: b = 2π/T, onde T é o período desejado
    // Quando periodo = 1, a função terá período 2π (padrão)
    // Quando periodo = 2, a função terá período 4π, etc.
    const fatorPeriodo = periodo !== 0 ? 1 / periodo : 1;
    
    // Para cada ponto no intervalo
    for (let i = 0; i < numeroPontos; i++) {
        const x = inicio + i * passo;
        let y: number;
        
        try {
            // Calcula o valor de y de acordo com o tipo de gráfico
            if (tipoGrafico === 'personalizado') {
                if (funcaoPersonalizada) {
                    y = evaluateTrigonometricExpression(funcaoPersonalizada, x);
                } else {
                    // Se não há função personalizada, não adiciona o ponto
                    continue;
                }
            } else {
                // Para funções padrão: y = a * f(b * (x - c)) + d
                // onde a = amplitude, b = fator período, c = defasagem, d = deslocamento vertical
                const argumento = fatorPeriodo * (x - defasagem);
                
                if (tipoGrafico === 'seno') {
                    y = amplitude * Math.sin(argumento) + deslocamentoVertical;
                } else if (tipoGrafico === 'cosseno') {
                    y = amplitude * Math.cos(argumento) + deslocamentoVertical;
                } else if (tipoGrafico === 'tangente') {
                    // Para tangente, tomamos cuidado com assíntotas
                    const cosValue = Math.cos(argumento);
                    if (Math.abs(cosValue) < 1e-10) {
                        // Próximo de uma assíntota, não adiciona o ponto
                        continue;
                    }
                    y = amplitude * Math.tan(argumento) + deslocamentoVertical;
                    
                    // Limita pontos da tangente para melhor visualização
                    if (y > 10) y = 10;
                    if (y < -10) y = -10;
                } else {
                    continue; // Tipo não reconhecido
                }
            }
            
            // Adiciona o ponto apenas se y for um número válido
            if (isFinite(y) && !isNaN(y)) {
                pontos.push({ x, y });
            }
        } catch (error) {
            // Ignora erros de cálculo (ex: tangente nos pontos de descontinuidade)
            continue;
        }
    }
    
    return pontos;
} 