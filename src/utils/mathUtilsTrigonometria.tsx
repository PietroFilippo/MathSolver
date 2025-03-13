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