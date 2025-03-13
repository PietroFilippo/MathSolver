// Converte graus para radianos
export const grausParaRadianos = (graus: number): number => {
    return graus * (Math.PI / 180);
};

// Converte radianos para graus 
export const radianosParaGraus = (radianos: number): number => {
    return radianos * (180 / Math.PI);
};

// Analisa uma string de intervalo no formato "a,b" e retorna [a, b] em radianos
export const parseIntervalo = (intervaloStr: string): [number, number] => {
    const partes = intervaloStr.split(',');
    if (partes.length !== 2) {
        throw new Error('Formato de intervalo inválido. Use o formato: início,fim');
    }
    
    try {
        // Substituir π por Math.PI e avaliar expressões
        const processarParte = (parte: string): number => {
            // Preparar a string, removendo espaços
            parte = parte.trim();
            
            // Substituir π por Math.PI, adicionando * quando necessário
            parte = parte
                .replace(/(\d)π/g, '$1*Math.PI')
                .replace(/(\d)pi/g, '$1*Math.PI')
                .replace(/π/g, 'Math.PI')
                .replace(/pi/g, 'Math.PI');
            
            // Caso especial para frações simples como π/4, 3π/2, etc.
            if (/^-?\s*\d*\s*Math\.PI\s*\/\s*\d+$/.test(parte)) {
                const match = parte.match(/^(-?\s*\d*)\s*(Math\.PI)\s*\/\s*(\d+)$/);
                if (match) {
                    const coef = match[1] ? (match[1].trim() === '-' ? -1 : parseFloat(match[1]) || 1) : 1;
                    const denom = parseInt(match[3]);
                    return coef * Math.PI / denom;
                }
            }
            
            // Avaliar expressões complexas de forma segura
            try {
                // console.log("Avaliando expressão:", parte);
                return Function('"use strict"; return (' + parte + ')')();
            } catch (e) {
                throw new Error(`Expressão inválida: ${parte} - ${e}`);
            }
        };
        
        const inicio = processarParte(partes[0]);
        const fim = processarParte(partes[1]);
        
        if (isNaN(inicio) || isNaN(fim)) {
            throw new Error('Valores de intervalo inválidos');
        }
        
        return [inicio, fim];
    } catch (error) {
        throw new Error(`Erro ao processar o intervalo: ${error instanceof Error ? error.message : String(error)}`);
    }
};

// Lista comum de frações de π para formatação
const fracoesDePi = [
    { valor: Math.PI/6, str: 'π/6' },
    { valor: Math.PI/4, str: 'π/4' },
    { valor: Math.PI/3, str: 'π/3' },
    { valor: Math.PI/2, str: 'π/2' },
    { valor: 2*Math.PI/3, str: '2π/3' },
    { valor: 3*Math.PI/4, str: '3π/4' },
    { valor: 5*Math.PI/6, str: '5π/6' },
    { valor: 7*Math.PI/6, str: '7π/6' },
    { valor: 5*Math.PI/4, str: '5π/4' },
    { valor: 4*Math.PI/3, str: '4π/3' },
    { valor: 3*Math.PI/2, str: '3π/2' },
    { valor: 5*Math.PI/3, str: '5π/3' },
    { valor: 7*Math.PI/4, str: '7π/4' },
    { valor: 11*Math.PI/6, str: '11π/6' },
    { valor: -Math.PI/6, str: '-π/6' },
    { valor: -Math.PI/4, str: '-π/4' },
    { valor: -Math.PI/3, str: '-π/3' },
    { valor: -Math.PI/2, str: '-π/2' }
];

// Formata um valor em radianos para exibição SEM normalização para [0, 2π)
export const formatarIntervalo = (valor: number): string => {
    // Verifica se é um valor especial
    if (valor === 0) return '0';
    if (Math.abs(valor - Math.PI) < 1e-10) return 'π';
    if (Math.abs(valor - 2 * Math.PI) < 1e-10) return '2π';
    
    // Verifica se é um múltiplo de π
    const emPi = valor / Math.PI;
    if (Math.abs(emPi - Math.round(emPi)) < 1e-10) {
        const inteiro = Math.round(emPi);
        if (inteiro === 1) return 'π';
        if (inteiro === 2) return '2π';
        if (inteiro === -1) return '-π';
        if (inteiro === -2) return '-2π';
        return `${inteiro}π`;
    }
    
    // Verifica algumas frações comuns de π
    for (const fracao of fracoesDePi) {
        if (Math.abs(valor - fracao.valor) < 1e-10) {
            return fracao.str;
        }
    }
    
    // Caso contrário, formata como número decimal
    return valor.toFixed(4);
};

// Formata um valor em radianos para exibição, usando π quando apropriado
export const formatarRadianos = (radianos: number): string => {
    // Normalizar o valor para o intervalo [0, 2π)
    const normalizado = ((radianos % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
    
    // Usa a função formatarIntervalo para formatar o valor normalizado
    return formatarIntervalo(normalizado);
};

// Avalia uma expressão trigonométrica para um valor específico de x.
export function avaliarExpressaoTrigonometrica(expressao: string, x: number): number {
    try {
        // Pré-processar a expressão para lidar com multiplicação implícita
        let expressaoProcessada = expressao.trim();
        
        // Normalizar espaços para facilitar o processamento
        expressaoProcessada = expressaoProcessada.replace(/\s+/g, ' ');
        
        // Remover espaços desnecessários dentro de parênteses: "( x )" -> "(x)"
        expressaoProcessada = expressaoProcessada.replace(/\(\s+/g, '(').replace(/\s+\)/g, ')');
        
        // Normalizar espaços ao redor de operadores: "x + 2" -> "x+2", "y - 3" -> "y-3"
        // Mas preservar espaços em casos como "2 * sen(x)" para evitar confusão com "2*sen(x)"
        expressaoProcessada = expressaoProcessada.replace(/(\S)\s*([+\-])\s*(\S)/g, '$1$2$3');
        
        const funcoesTrig = ['sen', 'sin', 'cos', 'tan', 'tg', 'cot', 'cotg', 'sec', 'csc'];
        for (const funcao of funcoesTrig) {
            // Converte o padrão normalizado para a forma matemática correta
            // "sen^2(x)" -> "(sen(x))^2"
            const regexFuncaoPotencia = new RegExp(`${funcao}\\^(\\d+)\\(([^)]*)\\)`, 'g');
            expressaoProcessada = expressaoProcessada.replace(regexFuncaoPotencia, `(${funcao}($2))^$1`);
        }
        
        // Trata símbolos especiais
        expressaoProcessada = expressaoProcessada
            // Converte operador de potência ^ para **
            .replace(/\^/g, '**')
            // Converte símbolo de raiz quadrada √ para Math.sqrt
            .replace(/√(\d+)/g, 'Math.sqrt($1)')
            .replace(/√\(/g, 'Math.sqrt(')
            .replace(/√([a-zA-Z])/g, 'Math.sqrt($1)');
        
        // Abordagem bem simples para evitar complicações com regex
        // Substitui diretamente casos problemáticos conhecidos
        expressaoProcessada = expressaoProcessada
            // Substitui padrões como "2sen(" por "2*sen("
            .replace(/(\d+)sen\(/g, '$1*sen(')
            .replace(/(\d+)sin\(/g, '$1*sin(')
            .replace(/(\d+)cos\(/g, '$1*cos(')
            .replace(/(\d+)tan\(/g, '$1*tan(')
            .replace(/(\d+)tg\(/g, '$1*tg(')
            .replace(/(\d+)cot\(/g, '$1*cot(')
            .replace(/(\d+)cotg\(/g, '$1*cotg(')
            .replace(/(\d+)sec\(/g, '$1*sec(')
            .replace(/(\d+)csc\(/g, '$1*csc(')
            // Substitui padrões como "2(" por "2*("
            .replace(/(\d+)\(/g, '$1*(')
            // Substitui padrões como ")(" por ")*("
            .replace(/\)\(/g, ')*(')
            // Substitui padrões como ")2" ou ")x" por ")*2" ou ")*x"
            .replace(/\)(\d+)/g, ')*$1')
            .replace(/\)([a-zA-Z])/g, ')*$1')
            // Substitui padrões como "2x" por "2*x" (exceto quando x faz parte de uma função)
            .replace(/(\d+)([a-zA-Z])(?!\()/g, '$1*$2');
        
        // Substitui símbolos especiais
        expressaoProcessada = expressaoProcessada
            .replace(/π/g, 'Math.PI')
            .replace(/pi/g, 'Math.PI');
            
        // Cria uma função que avalia a expressão com o valor de x
        // Usa new Function para evitar problemas com eval
        const funcaoExpr = new Function('x', `
            const sen = Math.sin;
            const sin = Math.sin;
            const cos = Math.cos;
            const tan = Math.tan;
            const tg = Math.tan;
            const cot = (x) => 1/Math.tan(x);
            const cotg = (x) => 1/Math.tan(x);
            const sec = (x) => 1/Math.cos(x);
            const csc = (x) => 1/Math.sin(x);
            const π = Math.PI;
            const pi = Math.PI;
            const sqrt = Math.sqrt;
            
            // Verificar divisão por zero
            const verificarDivisao = (fn) => {
                const result = fn();
                if (!isFinite(result)) {
                    throw new Error('Divisão por zero ou outro erro de cálculo');
                }
                return result;
            };
            
            try {
                return verificarDivisao(() => ${expressaoProcessada});
            } catch (e) {
                throw e;
            }
        `);
        
        // Executa a função com o valor de x
        return funcaoExpr(x);
    } catch (error) {
        // Manter apenas o lançamento do erro sem detalhes de log
        throw new Error('Erro ao avaliar a expressão: ' + error);
    }
};

// Gera pontos para um gráfico de função trigonométrica
export function gerarPontosFuncaoTrigonometrica(
    tipoGrafico: 'seno' | 'cosseno' | 'tangente' | 'personalizado',
    intervalo: [number, number],
    amplitude: number = 1, 
    periodo: number = 1,
    defasagem: number = 0,
    deslocamentoVertical: number = 0,
    funcaoPersonalizada: string = '',
    numeroPontos: number = 1000
): { x: number; y: number; }[] {
    const [inicio, fim] = intervalo;
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
                    y = avaliarExpressaoTrigonometrica(funcaoPersonalizada, x);
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

// Gera passos explicativos para um gráfico de função trigonométrica
export function gerarPassosExplicativosGraficos(
    tipoGrafico: 'seno' | 'cosseno' | 'tangente' | 'personalizado',
    intervalo: [number, number],
    amplitude: number = 1,
    periodo: number = 1,
    defasagem: number = 0,
    deslocamentoVertical: number = 0,
    funcaoPersonalizada: string = ''
): string[] {
    const calculationSteps: string[] = [];
    
    // Formata os números para exibição
    const formatarNumero = (num: number): string => {
        // Converte para fração ou decimal simplificado
        if (num === Math.PI) return 'π';
        if (num === 2 * Math.PI) return '2π';
        if (num === Math.PI / 2) return 'π/2';
        if (num === Math.PI / 3) return 'π/3';
        if (num === Math.PI / 4) return 'π/4';
        if (num === Math.PI / 6) return 'π/6';
        
        // Tenta formatar como fração de π
        for (let i = 1; i <= 10; i++) {
            if (Math.abs(num - (i * Math.PI)) < 1e-10) return `${i}π`;
            if (Math.abs(num - (i * Math.PI / 2)) < 1e-10) return `${i}π/2`;
            if (Math.abs(num - (i * Math.PI / 3)) < 1e-10) return `${i}π/3`;
            if (Math.abs(num - (i * Math.PI / 4)) < 1e-10) return `${i}π/4`;
            if (Math.abs(num - (i * Math.PI / 6)) < 1e-10) return `${i}π/6`;
        }
        
        // Se não for uma fração conhecida de π, retorna o número com 2 casas decimais
        return num.toFixed(2);
    };
    
    // Passo 1: Identificar o tipo de função e sua forma geral
    let stepCount = 1;
    
    calculationSteps.push(`Passo ${stepCount}: Identificar o tipo de função e sua forma geral`);
    
    if (tipoGrafico === 'personalizado') {
        calculationSteps.push(`Função personalizada: ${funcaoPersonalizada}`);
    } else {
        let funcaoBase = '';
        let formula = '';
        
        switch (tipoGrafico) {
            case 'seno':
                funcaoBase = 'f(x) = sen(x)';
                formula = `f(x) = ${amplitude !== 1 ? amplitude : ''} · sen(${periodo !== 1 ? formatarNumero(1/periodo) + ' · ' : ''}(x ${defasagem !== 0 ? (defasagem > 0 ? '- ' + formatarNumero(defasagem) : '+ ' + formatarNumero(-defasagem)) : ''}))${deslocamentoVertical !== 0 ? (deslocamentoVertical > 0 ? ' + ' + formatarNumero(deslocamentoVertical) : ' - ' + formatarNumero(-deslocamentoVertical)) : ''}`;
                break;
            case 'cosseno':
                funcaoBase = 'f(x) = cos(x)';
                formula = `f(x) = ${amplitude !== 1 ? amplitude : ''} · cos(${periodo !== 1 ? formatarNumero(1/periodo) + ' · ' : ''}(x ${defasagem !== 0 ? (defasagem > 0 ? '- ' + formatarNumero(defasagem) : '+ ' + formatarNumero(-defasagem)) : ''}))${deslocamentoVertical !== 0 ? (deslocamentoVertical > 0 ? ' + ' + formatarNumero(deslocamentoVertical) : ' - ' + formatarNumero(-deslocamentoVertical)) : ''}`;
                break;
            case 'tangente':
                funcaoBase = 'f(x) = tan(x)';
                formula = `f(x) = ${amplitude !== 1 ? amplitude : ''} · tan(${periodo !== 1 ? formatarNumero(1/periodo) + ' · ' : ''}(x ${defasagem !== 0 ? (defasagem > 0 ? '- ' + formatarNumero(defasagem) : '+ ' + formatarNumero(-defasagem)) : ''}))${deslocamentoVertical !== 0 ? (deslocamentoVertical > 0 ? ' + ' + formatarNumero(deslocamentoVertical) : ' - ' + formatarNumero(-deslocamentoVertical)) : ''}`;
                break;
        }
        
        calculationSteps.push(`Função básica: ${funcaoBase}`);
        calculationSteps.push(`Função completa: ${formula}`);
    }
    
    // Passo 2: Analisar o domínio e intervalo
    stepCount++;
    calculationSteps.push(`Passo ${stepCount}: Analisar o domínio e intervalo`);
    
    const inicioFormatado = formatarIntervalo(intervalo[0]);
    const fimFormatado = formatarIntervalo(intervalo[1]);
    
    calculationSteps.push(`Intervalo selecionado: [${inicioFormatado}, ${fimFormatado}]`);
    
    if (tipoGrafico === 'tangente') {
        calculationSteps.push(`A função tangente tem assíntotas verticais em x = (2n+1)π/2, onde n é um inteiro.`);
        
        // Identificar assíntotas no intervalo
        const assintotas = [];
        for (let n = -100; n <= 100; n++) {
            const assintota = (n + 0.5) * Math.PI;
            if (assintota >= intervalo[0] && assintota <= intervalo[1]) {
                assintotas.push(formatarIntervalo(assintota));
            }
        }
        
        if (assintotas.length > 0) {
            calculationSteps.push(`Assíntotas no intervalo: x = ${assintotas.join(', x = ')}`);
        } else {
            calculationSteps.push(`Não há assíntotas no intervalo selecionado.`);
        }
    }
    
    // Passo 3: Analisar propriedades da função
    stepCount++;
    calculationSteps.push(`Passo ${stepCount}: Analisar propriedades da função trigonométrica`);
    
    if (tipoGrafico !== 'personalizado') {
        // Amplitude
        if (amplitude !== 1) {
            calculationSteps.push(`Amplitude: |${amplitude}| = ${Math.abs(amplitude)}`);
            if (amplitude < 0) {
                calculationSteps.push(`Como a amplitude é negativa, o gráfico está invertido verticalmente (refletido sobre o eixo x).`);
            }
        } else {
            calculationSteps.push(`Amplitude: 1 (padrão)`);
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
        
        calculationSteps.push(`Período: ${formatarNumero(periodoReal)}`);
        
        if (periodo !== 1) {
            if (periodo > 1) {
                calculationSteps.push(`Como o período é maior que o padrão, o gráfico está esticado horizontalmente.`);
            } else {
                calculationSteps.push(`Como o período é menor que o padrão, o gráfico está comprimido horizontalmente.`);
            }
        }
        
        // Defasagem
        if (defasagem !== 0) {
            const direcao = defasagem > 0 ? 'direita' : 'esquerda';
            calculationSteps.push(`Defasagem: ${formatarNumero(Math.abs(defasagem))} para a ${direcao}`);
        } else {
            calculationSteps.push(`Defasagem: 0 (não há deslocamento horizontal)`);
        }
        
        // Deslocamento vertical
        if (deslocamentoVertical !== 0) {
            const direcao = deslocamentoVertical > 0 ? 'cima' : 'baixo';
            calculationSteps.push(`Deslocamento vertical: ${Math.abs(deslocamentoVertical)} para ${direcao}`);
        } else {
            calculationSteps.push(`Deslocamento vertical: 0 (não há deslocamento vertical)`);
        }
    } else {
        calculationSteps.push(`Para funções personalizadas, as propriedades dependem da expressão específica.`);
        calculationSteps.push(`Expressão: ${funcaoPersonalizada}`);
    }
    
    // Passo 4: Valores notáveis
    stepCount++;
    calculationSteps.push(`Passo ${stepCount}: Calcular valores notáveis`);
    
    if (tipoGrafico !== 'personalizado') {
        // Para seno e cosseno, calcular zeros, máximos e mínimos no intervalo
        if (tipoGrafico === 'seno' || tipoGrafico === 'cosseno') {
            try {
                // Zeros (onde f(x) = 0)
                const zeros = [];
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
                        zeros.push(formatarIntervalo(zero));
                    }
                    
                    k++;
                }
                
                // Verificar se há deslocamento vertical que afeta os zeros
                if (deslocamentoVertical !== 0) {
                    calculationSteps.push(`Com o deslocamento vertical de ${deslocamentoVertical}, os zeros da função original não correspondem mais aos zeros da função deslocada.`);
                } else if (zeros.length > 0) {
                    calculationSteps.push(`Zeros da função no intervalo: x = ${zeros.join(', x = ')}`);
                } else {
                    calculationSteps.push(`Não existem zeros da função no intervalo selecionado.`);
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
                            x: formatarIntervalo(maximo),
                            y: amplitude + deslocamentoVertical
                        });
                    }
                    
                    if (minimo >= intervalo[0] && minimo <= intervalo[1]) {
                        minimos.push({
                            x: formatarIntervalo(minimo),
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
                    calculationSteps.push(`Valores máximos no intervalo: ${maximos.map(max => `f(${max.x}) = ${max.y}`).join(', ')}`);
                }
                
                if (minimos.length > 0) {
                    calculationSteps.push(`Valores mínimos no intervalo: ${minimos.map(min => `f(${min.x}) = ${min.y}`).join(', ')}`);
                }
                
            } catch (error) {
                calculationSteps.push(`Não foi possível calcular valores notáveis: ${error}`);
            }
        } else if (tipoGrafico === 'tangente') {
            // Para tangente, calcular zeros no intervalo
            const zeros = [];
            let k = -100;
            
            while (k <= 100) {
                // tan(x) = 0 quando x = nπ
                let zero = k * Math.PI;
                
                // Ajuste para defasagem e período
                zero = zero * periodo + defasagem;
                
                // Verificar se está no intervalo
                if (zero >= intervalo[0] && zero <= intervalo[1]) {
                    zeros.push(formatarIntervalo(zero));
                }
                
                k++;
            }
            
            if (deslocamentoVertical !== 0) {
                calculationSteps.push(`Com o deslocamento vertical de ${deslocamentoVertical}, os zeros da função original não correspondem mais aos zeros da função deslocada.`);
            } else if (zeros.length > 0) {
                calculationSteps.push(`Zeros da função no intervalo: x = ${zeros.join(', x = ')}`);
            } else {
                calculationSteps.push(`Não existem zeros da função no intervalo selecionado.`);
            }
        }
    } else {
        calculationSteps.push(`Para funções personalizadas, é necessária uma análise específica da expressão.`);
    }
    
    return calculationSteps;
}