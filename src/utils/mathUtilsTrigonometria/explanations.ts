// Utilidades para gerar passos explicativos passo a passo para funções trigonométricas
import { formatInterval, formatPiValue } from '../mathUtils';
import { TFunction } from 'i18next';

// Gera passos explicativos para um gráfico de função trigonométrica
// Fornece uma análise detalhada das propriedades da função (período, amplitude, zeros, etc.)
export function generateGraphExplanationSteps(
    tipoGrafico: 'seno' | 'cosseno' | 'tangente' | 'personalizado',
    intervalo: [number, number],
    amplitude: number = 1,
    periodo: number = 1,
    defasagem: number = 0,
    deslocamentoVertical: number = 0,
    funcaoPersonalizada: string = '',
    t?: TFunction
): string[] {
    const calculationSteps: string[] = [];
    
    // Usar a função formatPiValue para formatar números
    const formatarNumero = (num: number): string => formatPiValue(num, 2, false);
    
    // Passo 1: Identificar o tipo de função e sua forma geral
    let stepCount = 1;
    
    calculationSteps.push(t ? t('trigonometry:trigonometric_graphs.steps.identify_function', { step: stepCount }) : `Passo ${stepCount}: Identificar o tipo de função e sua forma geral`);
    
    if (tipoGrafico === 'personalizado') {
        calculationSteps.push(t ? t('trigonometry:trigonometric_graphs.steps.custom_function', { function: funcaoPersonalizada }) : `Função personalizada: ${funcaoPersonalizada}`);
    } else {
        let funcaoBase = '';
        let formula = '';
        
        switch (tipoGrafico) {
            case 'seno':
                funcaoBase = t ? t('trigonometry:trigonometric_graphs.functions.sine_base') : 'f(x) = sen(x)';
                formula = `f(x) = ${amplitude !== 1 ? amplitude : ''} · ${t ? t('trigonometry:trigonometric_graphs.functions.sine_func') : 'sen'}(${periodo !== 1 ? formatarNumero(1/periodo) + ' · ' : ''}(x ${defasagem !== 0 ? (defasagem > 0 ? '- ' + formatarNumero(defasagem) : '+ ' + formatarNumero(-defasagem)) : ''}))${deslocamentoVertical !== 0 ? (deslocamentoVertical > 0 ? ' + ' + formatarNumero(deslocamentoVertical) : ' - ' + formatarNumero(-deslocamentoVertical)) : ''}`;
                break;
            case 'cosseno':
                funcaoBase = t ? t('trigonometry:trigonometric_graphs.functions.cosine_base') : 'f(x) = cos(x)';
                formula = `f(x) = ${amplitude !== 1 ? amplitude : ''} · ${t ? t('trigonometry:trigonometric_graphs.functions.cosine_func') : 'cos'}(${periodo !== 1 ? formatarNumero(1/periodo) + ' · ' : ''}(x ${defasagem !== 0 ? (defasagem > 0 ? '- ' + formatarNumero(defasagem) : '+ ' + formatarNumero(-defasagem)) : ''}))${deslocamentoVertical !== 0 ? (deslocamentoVertical > 0 ? ' + ' + formatarNumero(deslocamentoVertical) : ' - ' + formatarNumero(-deslocamentoVertical)) : ''}`;
                break;
            case 'tangente':
                funcaoBase = t ? t('trigonometry:trigonometric_graphs.functions.tangent_base') : 'f(x) = tan(x)';
                formula = `f(x) = ${amplitude !== 1 ? amplitude : ''} · ${t ? t('trigonometry:trigonometric_graphs.functions.tangent_func') : 'tan'}(${periodo !== 1 ? formatarNumero(1/periodo) + ' · ' : ''}(x ${defasagem !== 0 ? (defasagem > 0 ? '- ' + formatarNumero(defasagem) : '+ ' + formatarNumero(-defasagem)) : ''}))${deslocamentoVertical !== 0 ? (deslocamentoVertical > 0 ? ' + ' + formatarNumero(deslocamentoVertical) : ' - ' + formatarNumero(-deslocamentoVertical)) : ''}`;
                break;
        }
        
        calculationSteps.push(t ? t('trigonometry:trigonometric_graphs.steps.basic_function', { function: funcaoBase }) : `Função básica: ${funcaoBase}`);
        calculationSteps.push(t ? t('trigonometry:trigonometric_graphs.steps.complete_function', { function: formula }) : `Função completa: ${formula}`);
    }
    
    // Passo 2: Analisar o domínio e intervalo
    stepCount++;
    calculationSteps.push(t ? t('trigonometry:trigonometric_graphs.steps.analyze_domain', { step: stepCount }) : `Passo ${stepCount}: Analisar o domínio e o intervalo`);
    
    const inicioFormatado = formatInterval(intervalo[0]);
    const fimFormatado = formatInterval(intervalo[1]);
    
    calculationSteps.push(t ? t('trigonometry:trigonometric_graphs.steps.selected_interval', { start: inicioFormatado, end: fimFormatado }) : `Intervalo selecionado: [${inicioFormatado}, ${fimFormatado}]`);
    
    if (tipoGrafico === 'tangente') {
        calculationSteps.push(t ? t('trigonometry:trigonometric_graphs.steps.tangent_asymptotes_info') : `A função tangente tem assíntotas verticais em x = (2n+1)π/2, onde n é um inteiro.`);
        
        // Identificar assíntotas no intervalo
        const assintotas: string[] = [];
        for (let n = -100; n <= 100; n++) {
            const assintota = (n + 0.5) * Math.PI;
            if (assintota >= intervalo[0] && assintota <= intervalo[1]) {
                assintotas.push(formatInterval(assintota));
            }
        }
        
        if (assintotas.length > 0) {
            calculationSteps.push(t ? t('trigonometry:trigonometric_graphs.steps.asymptotes_in_interval', { asymptotes: assintotas.join(', x = ') }) : `Assíntotas no intervalo: x = ${assintotas.join(', x = ')}`);
        } else {
            calculationSteps.push(t ? t('trigonometry:trigonometric_graphs.steps.no_asymptotes') : `Não há assíntotas no intervalo selecionado.`);
        }
    }
    
    // Passo 3: Analisar as propriedades da função
    stepCount++;
    calculationSteps.push(t ? t('trigonometry:trigonometric_graphs.steps.analyze_properties', { step: stepCount }) : `Passo ${stepCount}: Analisar as propriedades da função`);
    
    if (tipoGrafico !== 'personalizado') {
        // Amplitude
        if (amplitude !== 1) {
            calculationSteps.push(t ? t('trigonometry:trigonometric_graphs.steps.amplitude_value', { amplitude: amplitude, abs_amplitude: Math.abs(amplitude) }) : `Amplitude: |${amplitude}| = ${Math.abs(amplitude)}`);
            if (amplitude < 0) {
                calculationSteps.push(t ? t('trigonometry:trigonometric_graphs.steps.negative_amplitude') : `Como a amplitude é negativa, o gráfico está invertido verticalmente (refletido sobre o eixo x).`);
            }
        } else {
            calculationSteps.push(t ? t('trigonometry:trigonometric_graphs.steps.default_amplitude') : `Amplitude: 1 (padrão)`);
        }
        
        // Período
        let periodoReal = 0;
        switch (tipoGrafico) {
            case 'seno':
            case 'cosseno':
                periodoReal = 2 * Math.PI * periodo;
                break;
            case 'tangente':
                periodoReal = Math.PI * periodo;
                break;
        }
        
        calculationSteps.push(t ? t('trigonometry:trigonometric_graphs.steps.period_value', { period: formatarNumero(periodoReal) }) : `Período: ${formatarNumero(periodoReal)}`);
        
        if (periodo !== 1) {
            if (periodo > 1) {
                calculationSteps.push(t ? t('trigonometry:trigonometric_graphs.steps.larger_period') : `Como o período é maior que o padrão, o gráfico está esticado horizontalmente.`);
            } else {
                calculationSteps.push(t ? t('trigonometry:trigonometric_graphs.steps.smaller_period') : `Como o período é menor que o padrão, o gráfico está comprimido horizontalmente.`);
            }
        }
        
        // Defasagem
        if (defasagem !== 0) {
            const direcao = defasagem > 0 ? (t ? t('trigonometry:trigonometric_graphs.directions.right') : 'direita') : (t ? t('trigonometry:trigonometric_graphs.directions.left') : 'esquerda');
            calculationSteps.push(t ? t('trigonometry:trigonometric_graphs.steps.phase_shift', { shift: formatarNumero(Math.abs(defasagem)), direction: direcao }) : `Defasagem: ${formatarNumero(Math.abs(defasagem))} para a ${direcao}`);
        } else {
            calculationSteps.push(t ? t('trigonometry:trigonometric_graphs.steps.no_phase_shift') : `Defasagem: 0 (não há deslocamento horizontal)`);
        }
        
        // Deslocamento vertical
        if (deslocamentoVertical !== 0) {
            const direcao = deslocamentoVertical > 0 ? (t ? t('trigonometry:trigonometric_graphs.directions.up') : 'cima') : (t ? t('trigonometry:trigonometric_graphs.directions.down') : 'baixo');
            calculationSteps.push(t ? t('trigonometry:trigonometric_graphs.steps.vertical_shift', { shift: Math.abs(deslocamentoVertical), direction: direcao }) : `Deslocamento vertical: ${Math.abs(deslocamentoVertical)} para ${direcao}`);
        } else {
            calculationSteps.push(t ? t('trigonometry:trigonometric_graphs.steps.no_vertical_shift') : `Deslocamento vertical: 0 (não há deslocamento vertical)`);
        }
    } else {
        calculationSteps.push(t ? t('trigonometry:trigonometric_graphs.steps.custom_function_properties') : `Para funções personalizadas, as propriedades dependem da expressão específica.`);
        calculationSteps.push(t ? t('trigonometry:trigonometric_graphs.steps.custom_expression', { expression: funcaoPersonalizada }) : `Expressão: ${funcaoPersonalizada}`);
    }
    
    // Passo 4: Valores notáveis
    stepCount++;
    calculationSteps.push(t ? t('trigonometry:trigonometric_graphs.steps.calculate_notable_values', { step: stepCount }) : `Passo ${stepCount}: Calcular valores notáveis`);
    
    if (tipoGrafico !== 'personalizado') {
        // Para seno e cosseno, calcular zeros, máximos e mínimos no intervalo
        if (tipoGrafico === 'seno' || tipoGrafico === 'cosseno') {
            try {
                // Zeros (onde f(x) = 0)
                const zeros: string[] = [];
                let k = -100;
                
                while (k <= 100) {
                    let zero = 0;
                    
                    if (tipoGrafico === 'seno') {
                        // sen(x) = 0 quando x = nπ
                        zero = k * Math.PI;
                        
                        // Ajuste para defasagem e período
                        zero = zero * periodo + defasagem;
                    } else {
                        // cos(x) = 0 quando x = (2n+1)π/2
                        zero = (k + 0.5) * Math.PI;
                        
                        // Ajuste para defasagem e período
                        zero = zero * periodo + defasagem;
                    }
                    
                    // Verificar se está no intervalo
                    if (zero >= intervalo[0] && zero <= intervalo[1]) {
                        zeros.push(formatInterval(zero));
                    }
                    
                    k++;
                }
                
                // Verificar se há deslocamento vertical que afeta os zeros
                if (deslocamentoVertical !== 0) {
                    calculationSteps.push(t ? t('trigonometry:trigonometric_graphs.steps.vertical_shift_affect_zeros', { shift: deslocamentoVertical }) : `Com o deslocamento vertical de ${deslocamentoVertical}, os zeros da função original não correspondem mais aos zeros da função deslocada.`);
                } else if (zeros.length > 0) {
                    calculationSteps.push(t ? t('trigonometry:trigonometric_graphs.steps.zeros_in_interval', { zeros: zeros.join(', x = ') }) : `Zeros da função no intervalo: x = ${zeros.join(', x = ')}`);
                } else {
                    calculationSteps.push(t ? t('trigonometry:trigonometric_graphs.steps.no_zeros') : `Não existem zeros da função no intervalo selecionado.`);
                }
                
                // Valores máximos e mínimos
                const maximos: Array<{x: string, y: number}> = [];
                const minimos: Array<{x: string, y: number}> = [];
                k = -100;
                
                while (k <= 100) {
                    let maximo = 0;
                    let minimo = 0;
                    
                    if (tipoGrafico === 'seno') {
                        // sen(x) tem máximos em x = π/2 + 2nπ
                        maximo = Math.PI/2 + k * 2 * Math.PI;
                        
                        // sen(x) tem mínimos em x = 3π/2 + 2nπ
                        minimo = 3 * Math.PI/2 + k * 2 * Math.PI;
                    } else {
                        // cos(x) tem máximos em x = 2nπ
                        maximo = k * 2 * Math.PI;
                        
                        // cos(x) tem mínimos em x = (2n+1)π
                        minimo = (k * 2 + 1) * Math.PI;
                    }
                    
                    // Ajuste para defasagem e período
                    maximo = maximo * periodo + defasagem;
                    minimo = minimo * periodo + defasagem;
                    
                    // Verificar se está no intervalo
                    if (maximo >= intervalo[0] && maximo <= intervalo[1]) {
                        maximos.push({
                            x: formatInterval(maximo),
                            y: amplitude + deslocamentoVertical
                        });
                    }
                    
                    if (minimo >= intervalo[0] && minimo <= intervalo[1]) {
                        minimos.push({
                            x: formatInterval(minimo),
                            y: -amplitude + deslocamentoVertical
                        });
                    }
                    
                    k++;
                }
                
                // Se a amplitude for negativa, troca máximos e mínimos
                if (amplitude < 0) {
                    maximos.forEach((_max, i) => {
                        maximos[i].y = -amplitude + deslocamentoVertical;
                    });
                    
                    minimos.forEach((_min, i) => {
                        minimos[i].y = amplitude + deslocamentoVertical;
                    });
                }
                
                if (maximos.length > 0) {
                    const maximosFormatted = maximos.map(max => t ? 
                        t('trigonometry:trigonometric_graphs.steps.formatted_value', { x: max.x, y: max.y }) : 
                        `f(${max.x}) = ${max.y}`).join(', ');
                    
                    calculationSteps.push(t ? 
                        t('trigonometry:trigonometric_graphs.steps.max_values', { values: maximosFormatted }) : 
                        `Valores máximos no intervalo: ${maximosFormatted}`);
                }
                
                if (minimos.length > 0) {
                    const minimosFormatted = minimos.map(min => t ? 
                        t('trigonometry:trigonometric_graphs.steps.formatted_value', { x: min.x, y: min.y }) : 
                        `f(${min.x}) = ${min.y}`).join(', ');
                    
                    calculationSteps.push(t ? 
                        t('trigonometry:trigonometric_graphs.steps.min_values', { values: minimosFormatted }) : 
                        `Valores mínimos no intervalo: ${minimosFormatted}`);
                }
                
            } catch (error) {
                calculationSteps.push(t ? 
                    t('trigonometry:trigonometric_graphs.steps.calculation_error', { error }) : 
                    `Não foi possível calcular valores notáveis: ${error}`);
            }
        } else if (tipoGrafico === 'tangente') {
            // Para tangente, calcular zeros no intervalo
            const zeros: string[] = [];
            let k = -100;
            
            while (k <= 100) {
                // tan(x) = 0 quando x = nπ
                let zero = k * Math.PI;
                
                // Ajuste para defasagem e período
                zero = zero * periodo + defasagem;
                
                // Verificar se está no intervalo
                if (zero >= intervalo[0] && zero <= intervalo[1]) {
                    zeros.push(formatInterval(zero));
                }
                
                k++;
            }
            
            if (deslocamentoVertical !== 0) {
                calculationSteps.push(t ? t('trigonometry:trigonometric_graphs.steps.vertical_shift_affect_zeros', { shift: deslocamentoVertical }) : `Com o deslocamento vertical de ${deslocamentoVertical}, os zeros da função original não correspondem mais aos zeros da função deslocada.`);
            } else if (zeros.length > 0) {
                calculationSteps.push(t ? t('trigonometry:trigonometric_graphs.steps.zeros_in_interval', { zeros: zeros.join(', x = ') }) : `Zeros da função no intervalo: x = ${zeros.join(', x = ')}`);
            } else {
                calculationSteps.push(t ? t('trigonometry:trigonometric_graphs.steps.no_zeros') : `Não existem zeros da função no intervalo selecionado.`);
            }
        }
    } else {
        calculationSteps.push(t ? t('trigonometry:trigonometric_graphs.steps.custom_analysis_needed') : `Para funções personalizadas, é necessária uma análise específica da expressão.`);
    }
    
    // Passo 5: Conclusão
    stepCount++;
    calculationSteps.push(t ? t('trigonometry:trigonometric_graphs.steps.conclusion', { step: stepCount }) : `Passo ${stepCount}: Conclusão`);
    
    return calculationSteps;
} 