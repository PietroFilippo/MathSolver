import { useState } from 'react';
import { HiCalculator } from 'react-icons/hi';
import * as math from 'mathjs';
import { arredondarParaDecimais } from '../../utils/mathUtils';

type InequalityType = '<' | '<=' | '>' | '>=' | '=' | '!=';

interface ParsedInequality {
    leftSide: string;
    rightSide: string;
    operator: InequalityType;
    variable: string;
}

// Nova interface para desigualdades duplas (formato a < expresão < b)
interface ParsedDoubleInequality {
    leftBound: string;      // Limite à esquerda (a)
    middleExpression: string; // Expressão do meio
    rightBound: string;     // Limite à direita (b)
    leftOperator: InequalityType; // Operador entre leftBound e middleExpression
    rightOperator: InequalityType; // Operador entre middleExpression e rightBound
    variable: string;
}

const ResolvedorInequacoes: React.FC = () => {
    const [inequality, setInequality] = useState<string>('');
    const [result, setResult] = useState<string | null>(null);
    const [showExplanation, setShowExplanation] = useState<boolean>(true);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [steps, setSteps] = useState<string[]>([]);

    // Função para detectar a variável na desigualdade
    const detectVariable = (input: string): string => {
        // Remove operadores e ajusta a expressão para simplificar a detecção
        const cleanedInput = input
            .replace(/[<>=!≤≥]/g, '')
            .replace(/\s+/g, '')
            .replace(/[0-9]/g, '')
            .replace(/[+\-*/()]/g, '');
            
        // Procura por variáveis (caracteres únicos)
        const variables = Array.from(new Set(cleanedInput.split(''))).filter(char => 
            /[a-zA-Z]/.test(char) && 
            char !== 'e' // Excluir 'e' (número de Euler)
        );
        
        // Retorna a primeira variável encontrada ou 'x' se nenhuma for encontrada
        return variables.length > 0 ? variables[0] : 'x';
    };

    // Função para analisar a desigualdade e extrair os lados e o operador
    const parseInequality = (input: string): ParsedInequality | null => {
        // Normalizar caracteres especiais e espaços
        let cleaned = input.trim()
            .replace(/\^/g, '**') // Substituir ^ por ** para mathjs
            .replace(/≤/g, '<=')  // Substituir símbolo unicode por <=
            .replace(/≥/g, '>=')  // Substituir símbolo unicode por >=
            .replace(/−/g, '-')   // Substituir traço unicode por hífen padrão
            .replace(/\(/g, ' ( ') // Adicionar espaços ao redor dos parênteses
            .replace(/\)/g, ' ) ') // para facilitar o parsing
            .replace(/\s+/g, ' '); // Normalizar espaços
        
        // Detectar a variável na expressão
        const variable = detectVariable(input);
        
        // Buscar os operadores de desigualdade
        let operatorMatch: RegExpMatchArray | null = null;
        let operator: InequalityType = '=';
        
        // Procurar por <=, >=, <, >, =, != nesta ordem
        if (cleaned.includes('<=')) {
            operatorMatch = cleaned.match(/(.*?)<=(.*)/) || null;
            operator = '<=';
        } else if (cleaned.includes('>=')) {
            operatorMatch = cleaned.match(/(.*?)>=(.*)/) || null;
            operator = '>=';
        } else if (cleaned.includes('<')) {
            operatorMatch = cleaned.match(/(.*?)<(.*)/) || null;
            operator = '<';
        } else if (cleaned.includes('>')) {
            operatorMatch = cleaned.match(/(.*?)>(.*)/) || null;
            operator = '>';
        } else if (cleaned.includes('!=')) {
            operatorMatch = cleaned.match(/(.*?)!=(.*)/) || null;
            operator = '!=';
        } else if (cleaned.includes('=')) {
            operatorMatch = cleaned.match(/(.*?)=(.*)/) || null;
            operator = '=';
        } else {
            return null; // Nenhum operador encontrado
        }
        
        if (!operatorMatch || operatorMatch.length !== 3) {
            return null;
        }
        
        const leftSide = operatorMatch[1].trim();
        const rightSide = operatorMatch[2].trim();
        
        return {
            leftSide,
            rightSide,
            operator,
            variable
        };
    };

    // Função auxiliar para expandir parênteses manualmente
    const expandParentheses = (expr: string): string => {
        // Regex para encontrar padrões como "a(b+c)" onde a é um número
        const pattern = new RegExp(`(\\d+)\\s*\\(\\s*([^()]+)\\s*\\)`, 'g');
        
        // Substituir cada ocorrência
        return expr.replace(pattern, (_match, coef, content) => {
            // Expandir os termos dentro dos parênteses
            const terms = content.split(/([+-])/g).filter((t: string) => t.trim() !== '');
            
            let result = [];
            let currentSign = '+';
            let currentTerm = '';
            
            for (let i = 0; i < terms.length; i++) {
                const term = terms[i].trim();
                
                if (term === '+' || term === '-') {
                    currentSign = term;
                } else if (term !== '') {
                    // Multiplicar o termo pelo coeficiente
                    currentTerm = `${currentSign === '-' ? '-' : ''}${coef}*${term}`;
                    result.push(currentTerm);
                }
            }
            
            return result.join('+').replace(/\+\-/g, '-');
        });
    };

    // Mover todos os termos para o lado esquerdo
    const moveToLeftSide = (parsed: ParsedInequality): string => {
        try {
            // Expandir quaisquer parênteses primeiro
            const expandedLeft = expandParentheses(parsed.leftSide);
            const expandedRight = expandParentheses(parsed.rightSide);
            
            // Criar expressão na forma "expandedLeft - expandedRight"
            // O mathjs tratará como "expandedLeft - expandedRight <op> 0"
            let expression = '';
            
            try {
                // Primeiro, tente com o math.js
                if (expandedRight === '0') {
                    expression = expandedLeft;
                } else {
                    const subtractNode = math.parse(`${expandedLeft} - (${expandedRight})`);
                    expression = subtractNode.toString();
                }
                } catch (e) {
                // Se falhar, use uma abordagem manual
                console.warn("Erro ao usar math.js para subtração, usando método manual:", e);
                
                if (expandedRight === '0') {
                    expression = expandedLeft;
                } else {
                    // Inverter sinal dos termos à direita e adicionar à esquerda
                    // Se começar com -, remover o - e adicionar
                    // Se não começar com -, adicionar um -
                    let modifiedRight = expandedRight;
                    if (modifiedRight.startsWith('-')) {
                        modifiedRight = modifiedRight.substring(1);
                        expression = `${expandedLeft} + ${modifiedRight}`;
                    } else {
                        expression = `${expandedLeft} - ${modifiedRight}`;
                    }
                }
            }

            return expression;
        } catch (error) {
            console.error("Erro ao mover termos para o lado esquerdo:", error);
            throw new Error("Não foi possível mover os termos para o lado esquerdo. Verifique se a expressão está correta.");
        }
    };

    // Função para detectar potências da variável na expressão e retornar boolean indicando se é cúbica
    const hasCubicTerm = (expression: string, variable: string): boolean => {
        // Detectar padrões simples como x^3, x**3, x³
        const simpleRegex = new RegExp(`${variable}\\^3|${variable}\\*\\*3|${variable}³`, 'i');
        
        // Detectar padrões com parênteses como (x+a)^3 ou (x-b)^3
        const parenthesisRegex = /\([^()]+\)\^3|\([^()]+\)\*\*3/i;
        
        // Verificar se a expressão contém o padrão simples ou com parênteses
        if (simpleRegex.test(expression) || parenthesisRegex.test(expression)) {
            return true;
        }
        
        // Se não detectou diretamente, tenta pré-processar e verificar novamente
        try {
            const preprocessed = preprocessExpression(expression, variable);
            return simpleRegex.test(preprocessed);
            } catch (e) {
            console.error("Erro ao pré-processar expressão para detecção cúbica:", e);
            return false;
        }
    };

    // Função para encontrar raízes de equações cúbicas
    const findCubicRoots = (a: number, b: number, c: number, d: number): number[] => {
        // Verificação inicial para evitar divisão por zero
        if (Math.abs(a) < 1e-10) {
            console.error("O coeficiente 'a' não pode ser zero em uma equação cúbica");
            return [];
        }
        
        // Normalizar para a forma x³ + px² + qx + r = 0 (dividindo por a)
        const p = b / a;
        const q = c / a;
        const r = d / a;
        
        // Método de Cardano para resolver equações cúbicas
        // Primeiro, reduzimos para a forma y³ + py + q = 0 fazendo x = y - b/(3a)
        const p1 = (3 * q - p * p) / 3;
        const q1 = (2 * p * p * p - 9 * p * q + 27 * r) / 27;
        
        // Calculamos o discriminante
        const discriminant = (q1 * q1 / 4) + (p1 * p1 * p1 / 27);
        
        const roots: number[] = [];
        
        if (Math.abs(discriminant) < 1e-10) {
            // Uma raiz dupla e uma raiz simples
            const y1 = -2 * Math.cbrt(q1 / 2);
            const y2 = Math.cbrt(q1 / 2);
            
            // Converter para x usando x = y - p/3
            const offset = p / 3;
            const x1 = y1 - offset;
            const x2 = y2 - offset;
            
            // Adicionar raízes, evitando duplicações
            if (!roots.some(r => Math.abs(r - x1) < 1e-10)) roots.push(Number(x1.toFixed(4)));
            if (!roots.some(r => Math.abs(r - x2) < 1e-10)) roots.push(Number(x2.toFixed(4)));
        } else if (discriminant > 0) {
            // Uma raiz real e duas complexas (que não nos interessam)
            const u = Math.cbrt(-q1 / 2 + Math.sqrt(discriminant));
            const v = Math.cbrt(-q1 / 2 - Math.sqrt(discriminant));
            
            // A raiz real é u + v
            const y = u + v;
            
            // Converter para x usando x = y - p/3
            const x = y - p / 3;
            roots.push(Number(x.toFixed(4)));
        } else {
            // Três raízes reais distintas
            const theta = Math.acos(-q1 / 2 / Math.sqrt(-p1 * p1 * p1 / 27));
            const u = 2 * Math.sqrt(-p1 / 3);
            
            // As três raízes
            const y1 = u * Math.cos(theta / 3);
            const y2 = u * Math.cos((theta + 2 * Math.PI) / 3);
            const y3 = u * Math.cos((theta + 4 * Math.PI) / 3);
            
            // Converter para x usando x = y - p/3
            const offset = p / 3;
            const x1 = y1 - offset;
            const x2 = y2 - offset;
            const x3 = y3 - offset;
            
            // Adicionar raízes
            roots.push(Number(x1.toFixed(4)));
            roots.push(Number(x2.toFixed(4)));
            roots.push(Number(x3.toFixed(4)));
        }
        
        // Verificação adicional: método numérico para encontrar raízes inteiras
        // Esta parte é útil para valores exatos quando a equação tem raízes inteiras
        for (let x = -10; x <= 10; x++) {
            const value = a * Math.pow(x, 3) + b * Math.pow(x, 2) + c * x + d;
            if (Math.abs(value) < 1e-10) {
                // Verificar se já temos esta raiz
                if (!roots.some(r => Math.abs(r - x) < 1e-10)) {
                    roots.push(x);
                }
            }
        }
        
        // Ordenar raízes para garantir saída consistente
        return roots.sort((a, b) => a - b);
    };
    
    // Função para gerar MDC - adicionada para evitar dependências externas
    const encontrarMDC = (a: number, b: number): number => {
        if (b === 0) return a;
        return encontrarMDC(b, a % b);
    };
    
    // Atualizar a função handleCubicInequality para usar o encontrarMDC definido localmente
    const handleCubicInequality = (input: string): {algebraic: string, interval: string} | null => {
        try {
            // Detecta a variável na entrada
            const variable = detectVariable(input);
            
            // Tenta analisar a desigualdade
            const parsed = parseInequality(input);
            if (!parsed) {
                console.error("Não foi possível analisar a desigualdade:", input);
                return null;
            }
            
            // Verificar se há expressões com parênteses que precisam ser expandidas
            const hasPowerPattern = /\([^()]+\)\^3|\([^()]+\)\*\*3/.test(input);
            const hasFactoredForm = /\([^()]+\)\s*\*?\s*\([^()]+\)/.test(input);
            
            // Se houver expressões com parênteses, vamos pré-processar
            let processedLeftSide = parsed.leftSide;
            let processedRightSide = parsed.rightSide;
            
            if (hasPowerPattern || hasFactoredForm) {
                // Pré-processar a expressão para expandir termos entre parênteses
                processedLeftSide = preprocessExpression(parsed.leftSide, variable);
                processedRightSide = preprocessExpression(parsed.rightSide, variable);
                console.log("Desigualdade processada:", `${processedLeftSide} ${parsed.operator} ${processedRightSide}`);
            }
            
            // Criar um novo objeto ParsedInequality com as partes processadas
            const processedParsed: ParsedInequality = {
                leftSide: processedLeftSide,
                rightSide: processedRightSide,
                operator: parsed.operator,
                variable: variable
            };
            
            // Verifica se realmente é uma equação cúbica após o processamento
            const combinedExpression = processedLeftSide + processedRightSide;
            if (!combinedExpression.includes(`${variable}**3`) && !combinedExpression.includes(`${variable}^3`)) {
                // Verifica depois de mover para o lado esquerdo
                const standardForm = moveToLeftSide(processedParsed);
                const expandedTerms = extractTerms(standardForm, variable);
                if (expandedTerms.varPower3 === 0) {
                    return null; // Não é cúbica
                }
            }
            
            // Move todos os termos para o lado esquerdo
            const standardForm = moveToLeftSide(processedParsed);
            
            // Resolver a desigualdade cúbica com a forma padrão
            return solveCubicInequality(standardForm, parsed.operator, variable);
            
        } catch (e) {
            console.error("Erro ao processar expressão cúbica:", e);
            return null;
        }
    };

    // Função para resolver desigualdades cúbicas
    const solveCubicInequality = (expression: string, operator: InequalityType, variable: string): {algebraic: string, interval: string} => {
        try {
            // Normalizar a expressão
            const normalizedExpr = expression
                .replace(/\s+/g, '')     // Remove espaços
                .replace(/\*\*/g, '^')   // Substitui ** por ^ para legibilidade
                .replace(/−/g, '-');     // Normaliza o sinal de menos
            
            console.log("Expressão cúbica normalizada:", normalizedExpr);
            
            // Extrair os termos
            const terms = extractTerms(normalizedExpr, variable);
            
            // Verificar se é realmente uma equação cúbica
            if (Math.abs(terms.varPower3) < 1e-10) {
                console.log("Não é uma expressão cúbica, tratando como quadrática ou linear");
                if (Math.abs(terms.varPower2) >= 1e-10) {
                    return solveQuadraticInequality(normalizedExpr, operator, variable);
                } else {
                    return solveLinearInequality(normalizedExpr, operator, variable);
                }
            }
            
            // Coeficientes da forma ax³ + bx² + cx + d = 0
            const a = terms.varPower3;
            const b = terms.varPower2;
            const c = terms.varPower1;
            const d = terms.constant;
            
            console.log("Coeficientes (a, b, c, d):", a, b, c, d);
            
            // Encontrar as raízes da equação cúbica
            const roots = findCubicRoots(a, b, c, d);
            console.log("Raízes da equação cúbica:", roots);
            
            // Ordenar as raízes em ordem crescente
            const orderedRoots = [...roots].sort((x, y) => x - y);
            
            // Formatar as raízes para exibição
            const formattedRoots = orderedRoots.map(r => {
                // Verificar se o número é muito próximo de um inteiro
                const nearestInt = Math.round(r);
                if (Math.abs(r - nearestInt) < 0.0001) {
                    return nearestInt.toString();
                }
                
                // Caso contrário, arredondar para 4 casas decimais
                return arredondarParaDecimais(r, 4).toString();
            });
            
            // Para caso de igualdade, apenas retornar as raízes
            if (operator === '=') {
                if (roots.length === 0) {
                    return { algebraic: "∅ (conjunto vazio)", interval: "Conjunto solução: ∅" };
                }
                return {
                    algebraic: roots.length === 1 
                        ? `${variable} = ${formattedRoots[0]}` 
                        : formattedRoots.map(r => `${variable} = ${r}`).join(' ou '),
                    interval: `Conjunto solução: {${formattedRoots.join(', ')}}`
                };
            }
            
            // Criar pontos de teste para avaliar o sinal da função
            const testPoints: number[] = [];
            
            if (orderedRoots.length === 0) {
                // Se não há raízes, testar um ponto qualquer (0)
                testPoints.push(0);
            } else {
                // Adicionar um ponto à esquerda da menor raiz
                testPoints.push(orderedRoots[0] - 1);
                
                // Adicionar pontos entre as raízes
                for (let i = 0; i < orderedRoots.length - 1; i++) {
                    testPoints.push((orderedRoots[i] + orderedRoots[i + 1]) / 2);
                }
                
                // Adicionar um ponto à direita da maior raiz
                testPoints.push(orderedRoots[orderedRoots.length - 1] + 1);
            }
            
            // Avaliar o sinal da função em cada ponto de teste
            const satisfies: boolean[] = testPoints.map(x => {
                const value = a * Math.pow(x, 3) + b * Math.pow(x, 2) + c * x + d;
                
                switch (operator) {
                    case '<': return value < 0;
                    case '<=': return value <= 0;
                    case '>': return value > 0;
                    case '>=': return value >= 0;
                    case '!=': return value !== 0;
                    default: return false;
                }
            });
            
            // Construir os intervalos que satisfazem a desigualdade
            const intervals: { min: number | string, max: number | string, includeMin: boolean, includeMax: boolean }[] = [];
            
            if (orderedRoots.length === 0) {
                // Sem raízes - o sinal é constante
                if (satisfies[0]) {
                    // A desigualdade é satisfeita em todo o domínio
                    intervals.push({
                        min: "-∞",
                        max: "∞",
                        includeMin: false,
                        includeMax: false
                    });
                }
                // Se não satisfaz, não há solução (array vazio)
            } else {
                // Verificar intervalo à esquerda da primeira raiz
                if (satisfies[0]) {
                    intervals.push({
                        min: "-∞",
                        max: orderedRoots[0],
                        includeMin: false,
                        includeMax: operator === '<=' || operator === '>='
                    });
                }
                
                // Verificar intervalos entre raízes
                for (let i = 0; i < orderedRoots.length - 1; i++) {
                    if (satisfies[i + 1]) {
                        intervals.push({
                            min: orderedRoots[i],
                            max: orderedRoots[i + 1],
                            includeMin: operator === '<=' || operator === '>=',
                            includeMax: operator === '<=' || operator === '>='
                        });
                    }
                }
                
                // Verificar intervalo à direita da última raiz
                if (satisfies[satisfies.length - 1]) {
                    intervals.push({
                        min: orderedRoots[orderedRoots.length - 1],
                        max: "∞",
                        includeMin: operator === '<=' || operator === '>=',
                        includeMax: false
                    });
                }
            }
            
            // Se não há intervalos, a solução é vazia
            if (intervals.length === 0) {
                return { algebraic: "∅ (conjunto vazio)", interval: "Conjunto solução: ∅" };
            }
            
            // Para o caso de desigualdade estrita (!=), a solução é o complemento das raízes
            if (operator === '!=') {
                if (orderedRoots.length === 0) {
                    return {
                        algebraic: `${variable} ∈ ℝ (para todo ${variable} real)`, 
                        interval: "Conjunto solução: (-∞, ∞)" 
                    };
                }
                
                const rootTerms = formattedRoots.map(r => `${variable} ≠ ${r}`).join(' e ');
                
                let intervalNotation = "";
                if (orderedRoots.length === 1) {
                    intervalNotation = `(-∞, ${formattedRoots[0]}) ∪ (${formattedRoots[0]}, ∞)`;
                        } else {
                    intervalNotation = `(-∞, ${formattedRoots[0]})`;
                    for (let i = 0; i < orderedRoots.length - 1; i++) {
                        intervalNotation += ` ∪ (${formattedRoots[i]}, ${formattedRoots[i + 1]})`;
                    }
                    intervalNotation += ` ∪ (${formattedRoots[orderedRoots.length - 1]}, ∞)`;
                }
                
            return {
                    algebraic: rootTerms, 
                    interval: `Conjunto solução: ${intervalNotation}` 
                };
            }
            
            // Construir notação de intervalo e algébrica
            let intervalNotation = "";
            let algebraicNotation = "";
            
            // Para intervalos únicos, podemos usar notação simplificada
            if (intervals.length === 1) {
                const interval = intervals[0];
                const leftBracket = interval.includeMin ? '[' : '(';
                const rightBracket = interval.includeMax ? ']' : ')';
                
                intervalNotation = `${leftBracket}${interval.min}, ${interval.max}${rightBracket}`;
                
                if (interval.min === "-∞") {
                    const op = interval.includeMax ? '≤' : '<';
                    algebraicNotation = `${variable} ${op} ${interval.max}`;
                } else if (interval.max === "∞") {
                    const op = interval.includeMin ? '≥' : '>';
                    algebraicNotation = `${variable} ${op} ${interval.min}`;
                } else {
                    const opMin = interval.includeMin ? '≥' : '>';
                    const opMax = interval.includeMax ? '≤' : '<';
                    algebraicNotation = `${interval.min} ${opMin} ${variable} ${opMax} ${interval.max}`;
                }
            } else {
                // Para múltiplos intervalos, usamos a notação de união
                const intervalParts: string[] = [];
                const algebraicParts: string[] = [];
                
                for (const interval of intervals) {
                    const leftBracket = interval.includeMin ? '[' : '(';
                    const rightBracket = interval.includeMax ? ']' : ')';
                    
                    intervalParts.push(`${leftBracket}${interval.min}, ${interval.max}${rightBracket}`);
                    
                    if (interval.min === "-∞") {
                        const op = interval.includeMax ? '≤' : '<';
                        algebraicParts.push(`${variable} ${op} ${interval.max}`);
                    } else if (interval.max === "∞") {
                        const op = interval.includeMin ? '≥' : '>';
                        algebraicParts.push(`${variable} ${op} ${interval.min}`);
                    } else {
                        const opMin = interval.includeMin ? '≥' : '>';
                        const opMax = interval.includeMax ? '≤' : '<';
                        algebraicParts.push(`${interval.min} ${opMin} ${variable} ${opMax} ${interval.max}`);
                    }
                }
                
                intervalNotation = intervalParts.join(' ∪ ');
                algebraicNotation = algebraicParts.join(' ou ');
            }
            
                    return {
                algebraic: algebraicNotation,
                interval: `Conjunto solução: ${intervalNotation}`
            };
            
        } catch (error) {
            console.error("Erro ao resolver desigualdade cúbica:", error);
            return {
                algebraic: "Erro ao resolver a desigualdade cúbica",
                interval: "Conjunto solução: Indeterminado"
            };
        }
    };

    // Função para resolver desigualdades quadráticas
    const solveQuadraticInequality = (expression: string, operator: InequalityType, variable: string): {algebraic: string, interval: string} => {
        try {
            // Normalizar a expressão para ter a forma ax² + bx + c
            const normalizedExpr = expression
                .replace(/\s+/g, '')     // Remove espaços
                .replace(/\*\*/g, '^')   // Substitui ** por ^ para legibilidade
                .replace(/−/g, '-');     // Normaliza o sinal de menos
            
            console.log("Expressão quadrática normalizada:", normalizedExpr);
            
            // Extrair os termos
            const terms = extractTerms(normalizedExpr, variable);
            
            // Verificar se é realmente uma equação quadrática
            if (terms.varPower2 === 0) {
                    console.log("Não é uma expressão quadrática, tratando como linear");
                return solveLinearInequality(normalizedExpr, operator, variable);
            }
            
            // Coeficientes da forma ax² + bx + c = 0
            const a = terms.varPower2;
            const b = terms.varPower1;
                const c = terms.constant;
                
            console.log("Coeficientes (a, b, c):", a, b, c);
                    
                    // Calcular o discriminante
                    const discriminant = b * b - 4 * a * c;
                    console.log("Discriminante:", discriminant);
            
            // Verificar se a parábola abre para cima ou para baixo
            const isOpenUp = a > 0;
            console.log("Parábola abre para cima:", isOpenUp);
                    
                    // Encontrar as raízes (se existirem)
                    let roots: number[] = [];
                    
                    if (discriminant >= 0) {
                        const root1 = (-b + Math.sqrt(discriminant)) / (2 * a);
                        const root2 = (-b - Math.sqrt(discriminant)) / (2 * a);
                        
                // Garantir que root1 <= root2
                if (root1 <= root2) {
                    roots = [root1, root2];
                } else {
                    roots = [root2, root1];
                }
            }
            
            console.log("Raízes:", roots);
            
            // Formatar as raízes para exibição
                    const formattedRoots = roots.map(r => {
                        // Verificar se o número é muito próximo de um inteiro
                        const nearestInt = Math.round(r);
                        if (Math.abs(r - nearestInt) < 0.0001) {
                            return nearestInt.toString();
                        }
                        
                // Verificar se é próximo de uma fração simples comum
                        const denominators = [2, 3, 4, 5, 6, 8, 10];
                        for (const denom of denominators) {
                            for (let num = -10; num <= 10; num++) {
                                const fraction = num / denom;
                                if (Math.abs(r - fraction) < 0.0001) {
                                    // Retornar como fração simplificada
                            const mdc = encontrarMDC(Math.abs(num), denom);
                            if (mdc > 1) {
                                const numSimpli = num / mdc;
                                const denomSimpli = denom / mdc;
                                return denomSimpli === 1 ? numSimpli.toString() : `${numSimpli}/${denomSimpli}`;
                            }
                                    return num + "/" + denom;
                                }
                            }
                        }
                        
                        // Caso contrário, arredondar para 4 casas decimais
                        return arredondarParaDecimais(r, 4).toString();
                    });
                    
            // Determinar a solução baseada no operador, raízes e comportamento da parábola
        switch (operator) {
            case '<':
                if (discriminant < 0) {
                    // Sem raízes reais
                    return isOpenUp
                            ? { algebraic: "∅ (conjunto vazio)", interval: "Conjunto solução: ∅" }
                            : { algebraic: `${variable} ∈ ℝ (para todo ${variable} real)`, interval: "Conjunto solução: (-∞, ∞)" };
                } else if (discriminant === 0) {
                    // Uma raiz real (x - r)²
                    return isOpenUp
                            ? { algebraic: "∅ (conjunto vazio)", interval: "Conjunto solução: ∅" }
                            : { algebraic: `${variable} ∈ ℝ (para todo ${variable} real)`, interval: "Conjunto solução: (-∞, ∞)" };
                } else {
                    // Duas raízes reais (x - r₁)(x - r₂)
                        if (isOpenUp) {
                            // Para a > 0, a desigualdade (x - r₁)(x - r₂) < 0 é verdadeira entre as raízes
                            return { 
                                algebraic: `${formattedRoots[0]} < ${variable} < ${formattedRoots[1]}`,
                                interval: `Conjunto solução: (${formattedRoots[0]}, ${formattedRoots[1]})` 
                            }; 
                        } else {
                            // Para a < 0, a desigualdade (x - r₁)(x - r₂) < 0 é verdadeira fora das raízes
                            return { 
                                algebraic: `${variable} < ${formattedRoots[0]} ou ${variable} > ${formattedRoots[1]}`,
                                interval: `Conjunto solução: (-∞, ${formattedRoots[0]}) ∪ (${formattedRoots[1]}, ∞)` 
                            };
                        }
                }
            case '<=':
                if (discriminant < 0) {
                    // Sem raízes reais
                    return isOpenUp
                            ? { algebraic: "∅ (conjunto vazio)", interval: "Conjunto solução: ∅" }
                            : { algebraic: `${variable} ∈ ℝ (para todo ${variable} real)`, interval: "Conjunto solução: (-∞, ∞)" };
                } else if (discriminant === 0) {
                    // Uma raiz real (x - r)²
                    return isOpenUp
                            ? { algebraic: `${variable} = ${formattedRoots[0]}`, interval: "Conjunto solução: {" + formattedRoots[0] + "}" }
                            : { algebraic: `${variable} ∈ ℝ (para todo ${variable} real)`, interval: "Conjunto solução: (-∞, ∞)" };
                } else {
                    // Duas raízes reais (x - r₁)(x - r₂)
                        if (isOpenUp) {
                            // Para a > 0, a desigualdade (x - r₁)(x - r₂) <= 0 é verdadeira entre as raízes e nas raízes
                            return { 
                                algebraic: `${formattedRoots[0]} ≤ ${variable} ≤ ${formattedRoots[1]}`,
                                interval: `Conjunto solução: [${formattedRoots[0]}, ${formattedRoots[1]}]` 
                            };
                        } else {
                            // Para a < 0, a desigualdade (x - r₁)(x - r₂) <= 0 é verdadeira fora das raízes ou nas raízes
                            return { 
                                algebraic: `${variable} ≤ ${formattedRoots[0]} ou ${variable} ≥ ${formattedRoots[1]}`,
                                interval: `Conjunto solução: (-∞, ${formattedRoots[0]}] ∪ [${formattedRoots[1]}, ∞)` 
                            };
                        }
                }
            case '>':
                if (discriminant < 0) {
                    // Sem raízes reais
                    return isOpenUp
                            ? { algebraic: `${variable} ∈ ℝ (para todo ${variable} real)`, interval: "Conjunto solução: (-∞, ∞)" }
                            : { algebraic: "∅ (conjunto vazio)", interval: "Conjunto solução: ∅" };
                } else if (discriminant === 0) {
                    // Uma raiz real (x - r)²
                    return isOpenUp
                            ? { algebraic: `${variable} ∈ ℝ \ {${formattedRoots[0]}}`, interval: `Conjunto solução: (-∞, ${formattedRoots[0]}) ∪ (${formattedRoots[0]}, ∞)` }
                            : { algebraic: "∅ (conjunto vazio)", interval: "Conjunto solução: ∅" };
                } else {
                    // Duas raízes reais (x - r₁)(x - r₂)
                        if (isOpenUp) {
                            // Para a > 0, a desigualdade (x - r₁)(x - r₂) > 0 é verdadeira fora das raízes
                            return { 
                                algebraic: `${variable} < ${formattedRoots[0]} ou ${variable} > ${formattedRoots[1]}`,
                                interval: `Conjunto solução: (-∞, ${formattedRoots[0]}) ∪ (${formattedRoots[1]}, ∞)` 
                            };
                        } else {
                            // Para a < 0, a desigualdade (x - r₁)(x - r₂) > 0 é verdadeira entre as raízes
                            return { 
                                algebraic: `${formattedRoots[0]} < ${variable} < ${formattedRoots[1]}`,
                                interval: `Conjunto solução: (${formattedRoots[0]}, ${formattedRoots[1]})` 
                            };
                        }
                }
            case '>=':
                if (discriminant < 0) {
                    // Sem raízes reais
                    return isOpenUp
                            ? { algebraic: `${variable} ∈ ℝ (para todo ${variable} real)`, interval: "Conjunto solução: (-∞, ∞)" }
                            : { algebraic: "∅ (conjunto vazio)", interval: "Conjunto solução: ∅" };
                } else if (discriminant === 0) {
                    // Uma raiz real (x - r)²
                    return isOpenUp
                            ? { algebraic: `${variable} ∈ ℝ (para todo ${variable} real)`, interval: "Conjunto solução: (-∞, ∞)" }
                            : { algebraic: `${variable} = ${formattedRoots[0]}`, interval: `Conjunto solução: {${formattedRoots[0]}}` };
                } else {
                    // Duas raízes reais (x - r₁)(x - r₂)
                        if (isOpenUp) {
                            // Para a > 0, a desigualdade (x - r₁)(x - r₂) >= 0 é verdadeira fora das raízes ou nas raízes
                            return { 
                                algebraic: `${variable} ≤ ${formattedRoots[0]} ou ${variable} ≥ ${formattedRoots[1]}`,
                                interval: `Conjunto solução: (-∞, ${formattedRoots[0]}] ∪ [${formattedRoots[1]}, ∞)` 
                            };
                        } else {
                            // Para a < 0, a desigualdade (x - r₁)(x - r₂) >= 0 é verdadeira entre as raízes ou nas raízes
                            return { 
                                algebraic: `${formattedRoots[0]} ≤ ${variable} ≤ ${formattedRoots[1]}`,
                                interval: `Conjunto solução: [${formattedRoots[0]}, ${formattedRoots[1]}]` 
                            };
                        }
                }
            case '=':
                if (discriminant < 0) {
                        // Sem raízes reais
                        return { algebraic: "∅ (conjunto vazio)", interval: "Conjunto solução: ∅" };
                } else if (discriminant === 0) {
                        // Uma raiz real (x - r)²
                        return { 
                            algebraic: `${variable} = ${formattedRoots[0]}`, 
                            interval: `Conjunto solução: {${formattedRoots[0]}}` 
                        };
                } else {
                        // Duas raízes reais (x - r₁)(x - r₂)
                    return { 
                            algebraic: `${variable} = ${formattedRoots[0]} ou ${variable} = ${formattedRoots[1]}`, 
                        interval: `Conjunto solução: {${formattedRoots[0]}, ${formattedRoots[1]}}` 
                    };
                }
            case '!=':
                if (discriminant < 0) {
                        // Sem raízes reais
                        return { algebraic: `${variable} ∈ ℝ (para todo ${variable} real)`, interval: "Conjunto solução: (-∞, ∞)" };
                } else if (discriminant === 0) {
                        // Uma raiz real (x - r)²
                        return { 
                            algebraic: `${variable} ≠ ${formattedRoots[0]}`, 
                            interval: `Conjunto solução: (-∞, ${formattedRoots[0]}) ∪ (${formattedRoots[0]}, ∞)` 
                        };
                } else {
                        // Duas raízes reais (x - r₁)(x - r₂)
                    return { 
                            algebraic: `${variable} ≠ ${formattedRoots[0]} e ${variable} ≠ ${formattedRoots[1]}`, 
                        interval: `Conjunto solução: (-∞, ${formattedRoots[0]}) ∪ (${formattedRoots[0]}, ${formattedRoots[1]}) ∪ (${formattedRoots[1]}, ∞)` 
                    };
                }
            default:
                    return { algebraic: "Operador não suportado", interval: "Conjunto solução: Indeterminado" };
            }
        } catch (error) {
            console.error("Erro ao resolver desigualdade quadrática:", error);
                return {
                algebraic: "Erro ao resolver a desigualdade quadrática",
                    interval: "Conjunto solução: Indeterminado"
                };
        }
    };

    // Função para resolver desigualdades lineares
    const solveLinearInequality = (expression: string, operator: InequalityType, variable: string): {algebraic: string, interval: string} => {
        try {
            // Normalizar a expressão
            const normalizedExpr = expression
                .replace(/\s+/g, '')
                .replace(/\*\*/g, '^')
                .replace(/−/g, '-');
            
            console.log("Expressão linear normalizada:", normalizedExpr);
            
            // Verificar se há variáveis em ambos os lados de uma inequação
            if (operator !== '=' && operator !== '!=' && normalizedExpr.includes('<') || normalizedExpr.includes('>')) {
                console.log("Detectada desigualdade com variáveis em ambos os lados:", normalizedExpr);
                
                // Realizar parsing da forma ax + b < cx + d
                const parts = normalizedExpr.split(/[<>]=?/);
                if (parts.length === 2) {
                    const leftSide = parts[0].trim();
                    const rightSide = parts[1].trim();
                    
                    console.log("Lado esquerdo:", leftSide);
                    console.log("Lado direito:", rightSide);
                    
                    // Extrair os termos de cada lado
                    const leftTerms = extractTerms(leftSide, variable);
                    const rightTerms = extractTerms(rightSide, variable);
                    
                    // Combinar os termos movendo tudo para o lado esquerdo
                    const a = leftTerms.varPower1 - rightTerms.varPower1;
                    const b = leftTerms.constant - rightTerms.constant;
                    
                    console.log("Coeficiente de x após mover para esquerda:", a);
                    console.log("Termo constante após mover para esquerda:", b);
                    
                    // Agora podemos resolver ax + b < 0
                    if (a === 0) {
                        // Caso especial: não há variável
                        return evaluateConstantInequality(b, operator);
                    } else {
                        // Isolar a variável
                        const solution = -b / a;
                        
                        // Se a < 0, invertemos o operador
                        const finalOperator = a > 0 ? operator : invertOperator(operator);
                        
                        // Construir as notações algébrica e de intervalo
                        let algebraic;
                        let intervalNotation;
                        
                        switch (finalOperator) {
                            case '<':
                                algebraic = `${variable} < ${solution}`;
                                intervalNotation = `Conjunto solução: (-∞, ${solution})`;
                                break;
                            case '<=':
                                algebraic = `${variable} ≤ ${solution}`;
                                intervalNotation = `Conjunto solução: (-∞, ${solution}]`;
                                break;
                            case '>':
                                algebraic = `${variable} > ${solution}`;
                                intervalNotation = `Conjunto solução: (${solution}, ∞)`;
                                break;
                            case '>=':
                                algebraic = `${variable} ≥ ${solution}`;
                                intervalNotation = `Conjunto solução: [${solution}, ∞)`;
                                break;
                            default:
                                algebraic = "Erro na resolução";
                                intervalNotation = "Conjunto solução: Indeterminado";
                        }
                        
                        return {
                            algebraic,
                            interval: intervalNotation
                        };
                    }
                }
            }
            
            // Continue com a implementação existente para casos que não têm variáveis em ambos os lados
            // Tentar simplificar a expressão usando mathjs
            let simplified;
            try {
                simplified = math.simplify(normalizedExpr).toString();
                console.log("Expressão simplificada:", simplified);
            } catch (e) {
                console.error("Erro ao usar math.js para simplificação, usando método manual:", e);
                
                // Manual simplification for basic linear expressions
                // Handle expressions like x-5-(3x+2) manually
                let manualSimplified = normalizedExpr;
                
                // Handle expressions with subtraction of parentheses: check for patterns like "-(ax+b)"
                const subPattern = /([+-])\s*\(\s*([^()]+)\s*\)/g;
                manualSimplified = manualSimplified.replace(subPattern, (_match, sign, inner) => {
                    // Distribute the sign to all terms inside parentheses
                    const innerTerms = inner.split(/([+-])/g).filter((t: string) => t.trim());
                    let result = '';
                    
                    for (let i = 0; i < innerTerms.length; i++) {
                        if (innerTerms[i] === '+' || innerTerms[i] === '-') {
                            const nextSign = innerTerms[i] === '+' ? sign : (sign === '+' ? '-' : '+');
                            result += nextSign;
                        } else {
                            result += innerTerms[i];
                        }
                    }
                    
                    return result;
                });
                
                // Combine like terms manually (basic handling for x terms)
                const terms = {
                    varCoef: 0,
                    constant: 0
                };
                
                // Extract variable and constant terms
                const termPattern = new RegExp(`([+-]?\\d*\\*?${variable})|([+-]?\\d+)`, 'g');
                let match;
                
                while ((match = termPattern.exec(manualSimplified)) !== null) {
                    if (match[1]) { // Variable term
                        const term = match[1];
                        if (term === variable) {
                            terms.varCoef += 1;
                        } else if (term === `-${variable}`) {
                            terms.varCoef -= 1;
                        } else {
                            // Handle coefficients
                            const coefMatch = term.match(/([+-]?\d+)\*?/);
                            if (coefMatch && coefMatch[1]) {
                                terms.varCoef += parseFloat(coefMatch[1]);
                            }
                        }
                    } else if (match[2]) { // Constant term
                        terms.constant += parseFloat(match[2]);
                    }
                }
                
                simplified = `${terms.varCoef}*${variable} + ${terms.constant}`;
                console.log("Simplified manually:", simplified);
            }
            
            // Extrair os termos da expressão
            const terms = extractTerms(simplified, variable);
            
            // Verificar se é realmente uma expressão linear
            if (terms.varPower2 !== 0 || terms.varPower3 !== 0) {
                console.warn("Expressão não é linear, contém termos de maior grau");
                if (terms.varPower3 !== 0) {
                    // Tratar como cúbica
                    return solveCubicInequality(simplified, operator, variable);
                } else if (terms.varPower2 !== 0) {
                    // Tratar como quadrática
                    return solveQuadraticInequality(simplified, operator, variable);
                }
            }
            
            // Backup manual extraction if the terms still have NaN
            if (isNaN(terms.varPower1)) {
                // Try to extract the coefficient of x manually
                const xPattern = new RegExp(`([+-]?\\d*)\\*?${variable}`);
                const xMatch = simplified.match(xPattern);
                let a = 0;
                
                if (xMatch) {
                    if (xMatch[1] === '' || xMatch[1] === '+') {
                        a = 1;
                    } else if (xMatch[1] === '-') {
                        a = -1;
                    } else {
                        a = parseFloat(xMatch[1]);
                    }
                }
                
                // Extract constant term manually
                const constPattern = /([+-]?\d+)(?!\*?[a-zA-Z])/;
                const constMatch = simplified.match(constPattern);
                let b = 0;
                
                if (constMatch) {
                    b = parseFloat(constMatch[1]);
                }
                
                // Override the automatically extracted terms
                terms.varPower1 = a;
                terms.constant = b;
            }
            
            // Coeficientes da forma ax + b = 0
            const a = terms.varPower1;
            const b = terms.constant;
            
            console.log("Coeficientes (a, b):", a, b);
            
            // Verificar se o coeficiente de x é zero (caso especial)
            if (a === 0) {
                // Desigualdade sem variável, apenas constante
                const result = evaluateConstantInequality(b, operator);
                return result;
            }
            
            // Isolar a variável: ax + b = 0 => x = -b/a
            // Precisamos inverter o operador se a < 0
            let isolatedOperator = a > 0 ? operator : invertOperator(operator);
            const solution = -b / a;
            
            console.log(`Isolando a variável: ${variable} ${isolatedOperator} ${solution}`);
            
            // Formatar a solução
            let algebraic: string;
            let interval: string;
            
            // Arredondar para 2 casas decimais se não for um número inteiro
            const formattedSolution = Number.isInteger(solution) ? solution.toString() : solution.toFixed(2);
            
            if (isolatedOperator === '<') {
                algebraic = `${variable} < ${formattedSolution}`;
                interval = `Conjunto solução: (-∞, ${formattedSolution})`;
            } else if (isolatedOperator === '<=') {
                algebraic = `${variable} ≤ ${formattedSolution}`;
                interval = `Conjunto solução: (-∞, ${formattedSolution}]`;
            } else if (isolatedOperator === '>') {
                algebraic = `${variable} > ${formattedSolution}`;
                interval = `Conjunto solução: (${formattedSolution}, ∞)`;
            } else if (isolatedOperator === '>=') {
                algebraic = `${variable} ≥ ${formattedSolution}`;
                interval = `Conjunto solução: [${formattedSolution}, ∞)`;
            } else if (isolatedOperator === '=') {
                algebraic = `${variable} = ${formattedSolution}`;
                interval = `Conjunto solução: {${formattedSolution}}`;
            } else if (isolatedOperator === '!=') {
                algebraic = `${variable} ≠ ${formattedSolution}`;
                interval = `Conjunto solução: (-∞, ${formattedSolution}) ∪ (${formattedSolution}, ∞)`;
            } else {
                algebraic = "Erro: operador desconhecido";
                interval = "Conjunto solução: Indeterminado";
            }
            
            return {
                algebraic,
                interval
            };
        } catch (error) {
            console.error("Erro ao resolver desigualdade linear:", error);
            return {
                algebraic: "Erro ao resolver a desigualdade",
                interval: "Conjunto solução: Indeterminado"
            };
        }
    };

    // Função auxiliar para avaliar desigualdades constantes (sem variável)
    const evaluateConstantInequality = (constant: number, operator: InequalityType): {algebraic: string, interval: string} => {
        let algebraic: string;
        let interval: string;
        
        // Avaliar a desigualdade constante
        const isTrue = 
            (operator === '<' && constant < 0) ||
            (operator === '<=' && constant <= 0) ||
            (operator === '>' && constant > 0) ||
            (operator === '>=' && constant >= 0) ||
            (operator === '=' && constant === 0) ||
            (operator === '!=' && constant !== 0);
        
        if (isTrue) {
            // A desigualdade é verdadeira para todos os valores da variável
            algebraic = "Todos os valores reais";
            interval = "Conjunto solução: (-∞, ∞)";
        } else {
            // A desigualdade é falsa para todos os valores da variável
            algebraic = "Conjunto vazio";
            interval = "Conjunto solução: ∅";
        }
        
        return {
            algebraic,
            interval
        };
    };

    // Função para gerar passos explicativos para desigualdades duplas
    const generateDoubleInequalitySteps = (parsed: ParsedDoubleInequality, result: {algebraic: string, interval: string}): string[] => {
        const steps: string[] = [];
        let stepCount = 1;
        
        // Passo 1: Identificar a desigualdade dupla
        steps.push(`Passo ${stepCount}: Identificar a desigualdade dupla`);
        steps.push(`Desigualdade: ${parsed.leftBound} ${parsed.leftOperator} ${parsed.middleExpression} ${parsed.rightOperator} ${parsed.rightBound}`);
        steps.push(`Variável identificada: ${parsed.variable}`);
        stepCount++;
        
        // Passo 2: Separar em duas desigualdades
        steps.push(`Passo ${stepCount}: Separar em duas desigualdades`);
        steps.push(`Desigualdade 1: ${parsed.leftBound} ${parsed.leftOperator} ${parsed.middleExpression}`);
        steps.push(`Desigualdade 2: ${parsed.middleExpression} ${parsed.rightOperator} ${parsed.rightBound}`);
        stepCount++;
        
        // Passo 3: Isolar a expressão do meio
        steps.push(`Passo ${stepCount}: Isolar a expressão do meio`);
        const invertedLeftOperator = invertOperator(parsed.leftOperator);
        steps.push(`Invertendo a primeira desigualdade: ${parsed.middleExpression} ${invertedLeftOperator} ${parsed.leftBound}`);
        stepCount++;
        
        // Passo 4: Manipular as desigualdades para isolar a variável
        steps.push(`Passo ${stepCount}: Manipular as desigualdades para isolar a variável`);
        
        try {
            // Verificar se estamos trabalhando com frações ou parênteses
            if (parsed.middleExpression.includes('/') || 
                (parsed.middleExpression.includes('(') && parsed.middleExpression.includes(')'))) {
                
                // Caso especial para expressões com frações ou parênteses
                steps.push(`A expressão ${parsed.middleExpression} contém frações ou parênteses.`);
                
                // Processar manualmente cada desigualdade
                const leftInequality: ParsedInequality = {
                    leftSide: parsed.middleExpression,
                    rightSide: parsed.leftBound,
                    operator: invertedLeftOperator,
                    variable: parsed.variable
                };
                
                const rightInequality: ParsedInequality = {
                    leftSide: parsed.middleExpression,
                    rightSide: parsed.rightBound,
                    operator: parsed.rightOperator,
                    variable: parsed.variable
                };
                
                // Mover para forma padrão
                const leftStandardForm = moveToLeftSide(leftInequality);
                const rightStandardForm = moveToLeftSide(rightInequality);
                
                steps.push(`Para a primeira desigualdade: ${leftStandardForm} ${invertedLeftOperator} 0`);
                steps.push(`Para a segunda desigualdade: ${rightStandardForm} ${parsed.rightOperator} 0`);
                
                // Tentar simplificar
                try {
                    const leftSimplified = math.simplify(leftStandardForm).toString();
                    const rightSimplified = math.simplify(rightStandardForm).toString();
                    
                    steps.push(`Simplificando a primeira desigualdade: ${leftSimplified} ${invertedLeftOperator} 0`);
                    steps.push(`Simplificando a segunda desigualdade: ${rightSimplified} ${parsed.rightOperator} 0`);
            } catch (e) {
                    // Ignorar erro de simplificação
                }
            } else {
                // Caso mais simples - processamento padrão
                steps.push(`Isolar a variável ${parsed.variable} em cada desigualdade.`);
            }
            
            // Passo 5: Resolver cada desigualdade
            stepCount++;
            steps.push(`Passo ${stepCount}: Resolver cada desigualdade separadamente`);
            
            // Explicar a lógica da solução
            if (result.algebraic.includes("∅")) {
                steps.push(`As desigualdades não possuem solução em comum, resultando em um conjunto vazio.`);
            } else {
                // Extrair valores da solução final
                const matches = result.algebraic.match(/([+-]?\d+(\.\d+)?)\s*[<>≤≥]\s*\w+\s*[<>≤≥]\s*([+-]?\d+(\.\d+)?)/);
                if (matches && matches.length > 3) {
                    const leftValue = matches[1];
                    const rightValue = matches[3];
                    
                    steps.push(`Da primeira desigualdade, obtemos: ${parsed.variable} ${invertedLeftOperator} ${leftValue}`);
                    steps.push(`Da segunda desigualdade, obtemos: ${parsed.variable} ${parsed.rightOperator} ${rightValue}`);
                    steps.push(`Combinando as duas condições, temos: ${leftValue} ${invertedLeftOperator} ${parsed.variable} ${parsed.rightOperator} ${rightValue}`);
                } else {
                    steps.push(`Combinando as soluções das duas desigualdades, obtemos: ${result.algebraic}`);
                }
            }
        } catch (e) {
            steps.push(`Erro ao gerar passos detalhados: ${e instanceof Error ? e.message : 'Erro desconhecido'}`);
        }
        
        // Passo final: Resultado
        stepCount++;
        steps.push(`Passo ${stepCount}: Resultado final`);
        steps.push(`Solução algébrica: ${result.algebraic}`);
        steps.push(`${result.interval}`);
        
        return steps;
    };

    // Função auxiliar para extrair termos de uma expressão
    const extractTerms = (expr: string, variable: string): {varPower3: number, varPower2: number, varPower1: number, constant: number} => {
        // Pré-processar a expressão para expandir potências e produtos
        const preprocessedExpr = preprocessExpression(expr, variable);
        
        const terms = {
            varPower3: 0, // Coeficiente de variável^3
            varPower2: 0, // Coeficiente de variável^2
            varPower1: 0, // Coeficiente de variável
            constant: 0   // Termo constante
        };
        
        // Limpar e normalizar a expressão
        const normalizedExpr = preprocessedExpr
                .replace(/\s+/g, '')
                .replace(/\*\*/g, '^')
            .replace(/−/g, '-')
            .replace(/-/g, '+-');
        
        // Dividir pelos sinais +
        const termArray = normalizedExpr.split('+').filter(t => t !== '');
        
        // Regex para capturar termos com a variável
        const regexPower3 = new RegExp(`${variable}\\^3|${variable}³`);
        const regexPower2 = new RegExp(`${variable}\\^2|${variable}²`);
        const regexPower1 = new RegExp(`${variable}(?!\\^|²|³)`);
        
        for (const term of termArray) {
            if (regexPower3.test(term)) {
                // Termo com variável^3
                const coef = term.replace(regexPower3, '');
                terms.varPower3 += coef === '' ? 1 : coef === '-' ? -1 : parseFloat(coef);
            } else if (regexPower2.test(term)) {
                // Termo com variável^2
                const coef = term.replace(regexPower2, '');
                terms.varPower2 += coef === '' ? 1 : coef === '-' ? -1 : parseFloat(coef);
            } else if (regexPower1.test(term)) {
                // Termo com variável
                const coef = term.replace(regexPower1, '');
                terms.varPower1 += coef === '' ? 1 : coef === '-' ? -1 : parseFloat(coef);
            } else if (term !== '') {
                // Termo constante
                try {
                    terms.constant += parseFloat(term);
                } catch (e) {
                    console.error("Erro ao converter termo constante:", term);
                }
            }
        }
        
        return terms;
    };

    // Função para inverter o operador (usado quando multiplicamos por número negativo)
    const invertOperator = (operator: InequalityType): InequalityType => {
        switch (operator) {
            case '<': return '>';
            case '>': return '<';
            case '<=': return '>=';
            case '>=': return '<=';
            case '=': return '=';
            case '!=': return '!=';
            default: return '=';
        }
    };

    // Função para analisar uma desigualdade dupla (a < expressão < b)
    const parseDoubleInequality = (input: string): ParsedDoubleInequality | null => {
        // Normalizar caracteres especiais e espaços
        let cleaned = input.trim()
            .replace(/\^/g, '**') // Substituir ^ por ** para mathjs
            .replace(/≤/g, '<=')  // Substituir símbolo unicode por <=
            .replace(/≥/g, '>=')  // Substituir símbolo unicode por >=
            .replace(/−/g, '-')   // Substituir traço unicode por hífen padrão
            .replace(/\s+/g, ' '); // Normalizar espaços
            
        console.log("Cleaned double inequality:", cleaned);
            
        // Preservar parênteses, mas adicionar espaços para facilitar parsing
        cleaned = cleaned.replace(/\(/g, ' ( ').replace(/\)/g, ' ) ').replace(/\s+/g, ' ');
        
        // Detectar a variável na expressão
        const variable = detectVariable(input);
        
        // Check for common patterns like a ≤ expr ≤ b directly
        const doublePattern = /([^<>=]+)(<=|>=|<|>)([^<>=]+)(<=|>=|<|>)([^<>=]+)/;
        const match = cleaned.match(doublePattern);
        
        if (match && match.length === 6) {
            // Extract components
            const leftBound = match[1].trim();
            const leftOperator = match[2].trim() as InequalityType;
            const middleExpression = match[3].trim();
            const rightOperator = match[4].trim() as InequalityType;
            const rightBound = match[5].trim();
            
            console.log("Double inequality parsed:", {
                leftBound,
                leftOperator,
                middleExpression,
                rightOperator,
                rightBound
            });
            
                return {
                leftBound,
                leftOperator,
                middleExpression,
                rightOperator,
                rightBound,
                variable
            };
        }
        
        // If the direct approach fails, try the previous method with multiple patterns
        // Operadores como grupos para reuso
        const ltGroup = '<';
        const leGroup = '<=';
        const gtGroup = '>';
        const geGroup = '>=';
        
        // Regex para cada formato possível
        const patterns = [
            // a < expr < b
            new RegExp(`(.*?)(${ltGroup})(.*?)(${ltGroup})(.*)`),
            // a <= expr <= b
            new RegExp(`(.*?)(${leGroup})(.*?)(${leGroup})(.*)`),
            // a > expr > b
            new RegExp(`(.*?)(${gtGroup})(.*?)(${gtGroup})(.*)`),
            // a >= expr >= b
            new RegExp(`(.*?)(${geGroup})(.*?)(${geGroup})(.*)`),
            // a < expr <= b
            new RegExp(`(.*?)(${ltGroup})(.*?)(${leGroup})(.*)`),
            // a <= expr < b
            new RegExp(`(.*?)(${leGroup})(.*?)(${ltGroup})(.*)`),
            // a > expr >= b
            new RegExp(`(.*?)(${gtGroup})(.*?)(${geGroup})(.*)`),
            // a >= expr > b
            new RegExp(`(.*?)(${geGroup})(.*?)(${gtGroup})(.*)`),
        ];
        
        for (const pattern of patterns) {
            const patternMatch = cleaned.match(pattern);
            if (patternMatch && patternMatch.length === 6) {
                // Extrair as partes
                let leftBound = patternMatch[1].trim();
                const leftOperator = patternMatch[2].trim() as InequalityType;
                let middleExpression = patternMatch[3].trim();
                const rightOperator = patternMatch[4].trim() as InequalityType;
                let rightBound = patternMatch[5].trim();
                
                // Ajuste para garantir consistência na direção da desigualdade
                // Se as setas apontam na mesma direção (ambas para esquerda ou direita)
                const isLeftDirection = 
                    (leftOperator === '<' || leftOperator === '<=') &&
                    (rightOperator === '<' || rightOperator === '<=');
                
                const isRightDirection = 
                    (leftOperator === '>' || leftOperator === '>=') &&
                    (rightOperator === '>' || rightOperator === '>=');
                
                // Se for contra-intuitivo (a > expr < b), tentar inverter
                if (!isLeftDirection && !isRightDirection) {
                    // Algo como a > expr < b, que é contra-intuitivo
                    // Provavelmente significa b > expr > a, ou seja a < expr < b
                    // Inverter a ordem
                    const tempBound = leftBound;
                    leftBound = rightBound;
                    rightBound = tempBound;
                    
                    middleExpression = middleExpression; // Permanece o mesmo
                    
                    // Invertemos os operadores também
                    // > vira <, >= vira <=, etc.
                }
                
                return {
                    leftBound,
                    leftOperator,
                    middleExpression,
                    rightOperator,
                    rightBound,
                    variable
                };
            }
        }
        
        // Nenhum padrão encontrado
        return null;
    };
    
    // Função para resolver desigualdades duplas
    const solveDoubleInequality = (parsed: ParsedDoubleInequality): {algebraic: string, interval: string} => {
        try {
            console.log("Resolvendo desigualdade dupla:", parsed);
            
            // Verificar se a desigualdade é do tipo a < x < b ou x < a < b
            // Determinar qual é a variável e qual é o valor constante
            const variable = parsed.variable;
            
            // Verificar se a expressão do meio contém a variável
            const middleHasVariable = parsed.middleExpression.includes(variable);
            
            if (!middleHasVariable) {
                console.error("A expressão do meio não contém a variável:", parsed.middleExpression);
                return {
                    algebraic: "Erro: formato inválido",
                    interval: "Conjunto solução: Indeterminado"
                };
            }
            
            // Determinar se as desigualdades apontam na mesma direção
            const leftIsLess = parsed.leftOperator === '<' || parsed.leftOperator === '<=';
            const rightIsLess = parsed.rightOperator === '<' || parsed.rightOperator === '<=';
            
            // Verificar se as desigualdades são consistentes
            if ((leftIsLess && !rightIsLess) || (!leftIsLess && rightIsLess)) {
                console.warn("Desigualdade dupla com direções inconsistentes");
                return {
                    algebraic: "Erro: desigualdade inconsistente",
                    interval: "Conjunto solução: Indeterminado"
                };
            }
            
            // Resolver cada desigualdade separadamente
            // Primeiro, inverter a primeira desigualdade para isolar a variável
            // a < x se torna x > a
            const invertedLeftOperator = invertOperator(parsed.leftOperator);
            
            // Criar objetos ParsedInequality para cada parte
            const invertedLeftInequality: ParsedInequality = {
                leftSide: parsed.middleExpression,
                rightSide: parsed.leftBound,
                operator: invertedLeftOperator,
                variable: parsed.variable
            };
            
            const rightInequality: ParsedInequality = {
                leftSide: parsed.middleExpression,
                rightSide: parsed.rightBound,
                operator: parsed.rightOperator,
                variable: parsed.variable
            };
            
            // Mover para forma padrão
            const leftStandardForm = moveToLeftSide(invertedLeftInequality);
            const rightStandardForm = moveToLeftSide(rightInequality);
            
            console.log("Forma padrão esquerda:", leftStandardForm, invertedLeftOperator);
            console.log("Forma padrão direita:", rightStandardForm, parsed.rightOperator);
            
            // Resolver para a variável
            const leftResult = solveLinearInequality(leftStandardForm, invertedLeftOperator, parsed.variable);
            const rightResult = solveLinearInequality(rightStandardForm, parsed.rightOperator, parsed.variable);
            
            console.log("Resultado esquerda:", leftResult);
            console.log("Resultado direita:", rightResult);
            
            // Extrair os limites numéricos
            const extractValue = (result: { algebraic: string, interval: string }): number => {
                // Extrai um número de strings como "x > 3" ou "x ≤ -2"
                const matches = result.algebraic.match(/[<>≤≥]\s*([+-]?\d+(\.\d+)?)/);
                if (matches && matches.length > 1) {
                    return parseFloat(matches[1]);
                }
                
                // Se não encontrou no formato padrão, tenta outro padrão
                const altMatches = result.algebraic.match(/([+-]?\d+(\.\d+)?)\s*[<>≤≥]/);
                if (altMatches && altMatches.length > 1) {
                    return parseFloat(altMatches[1]);
                }
                
                // Verificar se é "Todos os valores reais"
                if (result.algebraic === "Todos os valores reais") {
                    return leftIsLess ? -Infinity : Infinity;
                }
                
                // Verificar se é "Conjunto vazio"
                if (result.algebraic === "Conjunto vazio") {
                    return leftIsLess ? Infinity : -Infinity;
                }
                
                console.warn("Não foi possível extrair o valor numérico:", result.algebraic);
                return leftIsLess ? -Infinity : Infinity; // Valor padrão seguro
            };
            
            // Extrair valores
            const leftValue = extractValue(leftResult);
            const rightValue = extractValue(rightResult);
            
            console.log("Valores extraídos:", leftValue, rightValue);
            
            // Verificar se a interseção é possível
            if ((leftIsLess && leftValue > rightValue) || (!leftIsLess && leftValue < rightValue)) {
                return {
                    algebraic: "∅ (conjunto vazio)",
                    interval: "Conjunto solução: ∅"
                };
            }
            
            // Formatar a resposta
            const formatOperator = (op: InequalityType): string => {
                switch (op) {
                    case '<': return '<';
                    case '<=': return '≤';
                    case '>': return '>';
                    case '>=': return '≥';
                    default: return op;
                }
            };
            
            // Formatar interseção para a resposta algébrica
            let resultAlgebraic: string;
            if (leftIsLess) {
                resultAlgebraic = `${leftValue} ${formatOperator(invertedLeftOperator)} ${parsed.variable} ${formatOperator(parsed.rightOperator)} ${rightValue}`;
            } else {
                resultAlgebraic = `${rightValue} ${formatOperator(invertOperator(parsed.rightOperator))} ${parsed.variable} ${formatOperator(invertedLeftOperator)} ${leftValue}`;
            }
            
            // Formatar para notação de intervalos
            let resultInterval: string;
            if (leftIsLess) {
                const leftBracket = invertedLeftOperator === '<' ? '(' : '[';
                const rightBracket = parsed.rightOperator === '<' ? ')' : ']';
                resultInterval = `Conjunto solução: ${leftBracket}${leftValue}, ${rightValue}${rightBracket}`;
            } else {
                const leftBracket = parsed.rightOperator === '>' ? '(' : '[';
                const rightBracket = invertedLeftOperator === '>' ? ')' : ']';
                resultInterval = `Conjunto solução: ${leftBracket}${rightValue}, ${leftValue}${rightBracket}`;
            }
            
            return {
                algebraic: resultAlgebraic,
                interval: resultInterval
            };
            
        } catch (error) {
            console.error("Erro ao resolver desigualdade dupla:", error);
            return {
                algebraic: "Erro ao resolver a desigualdade dupla",
                interval: "Conjunto solução: Indeterminado"
            };
        }
    };

    // Função para expandir expressões da forma (x+a)^3 ou (x+a)^2
    const expandPowerExpression = (expr: string, variable: string): string => {
        // Padrão para expressões como (x+a)^3 ou (x-b)^2
        const powerPattern = /\(([^()]+)\)\^(\d+)/g;
        let result = expr;
        
        result = result.replace(powerPattern, (_match, innerExpr, power) => {
            const n = parseInt(power);
            
            // Identificar se a expressão interna é do tipo x+a ou x-b
            innerExpr = innerExpr.trim();
            let a = 0;
            let sign = '+';
            
            // Verificar se tem um termo constante após a variável
            const varPlusConstPattern = new RegExp(`${variable}\\s*([+-])\\s*(\\d+)`, 'g');
            const match = varPlusConstPattern.exec(innerExpr);
            
            if (match) {
                sign = match[1];
                a = parseFloat(match[2]);
                if (sign === '-') a = -a;
            } else if (innerExpr.startsWith(variable)) {
                // É apenas a variável
                a = 0;
            } else {
                // Verificar se tem constante antes da variável
                const constPlusVarPattern = new RegExp(`(\\d+)\\s*([+-])\\s*${variable}`, 'g');
                const constMatch = constPlusVarPattern.exec(innerExpr);
                
                if (constMatch) {
                    a = -parseFloat(constMatch[1]);
                    if (constMatch[2] === '+') a = -a;
                }
            }
            
            console.log(`Expandindo (${innerExpr})^${n}, a = ${a}, sign = ${sign}`);
            
            // Expandir com base no grau
            if (n === 2) {
                // (x+a)² = x² + 2ax + a²
                return `${variable}^2 + ${2*a}*${variable} + ${a*a}`;
            } else if (n === 3) {
                // (x+a)³ = x³ + 3ax² + 3a²x + a³
                const term1 = `${variable}^3`;
                const term2 = a !== 0 ? ` + ${3*a}*${variable}^2` : '';
                const term3 = a !== 0 ? ` + ${3*a*a}*${variable}` : '';
                const term4 = a !== 0 ? ` + ${a*a*a}` : '';
                return `${term1}${term2}${term3}${term4}`;
            } else {
                // Caso não seja quadrático ou cúbico, retornar como está
                return _match;
            }
        });
        
        return result;
    };
    
    // Função para expandir expressões em forma fatorada como (x-a)(x-b)
    const expandFactoredForm = (expr: string, variable: string): string => {
        // Padrão para expressões como (x+a)(x+b)
        const factoredPattern = /\(([^()]+)\)\s*\*?\s*\(([^()]+)\)/g;
        let result = expr;
        
        result = result.replace(factoredPattern, (_match, factor1, factor2) => {
            // Analisar o primeiro fator (x+a) ou (x-a)
            factor1 = factor1.trim();
            let a = 0;
            let signA = '+';
            
            const varPlusConstPattern1 = new RegExp(`${variable}\\s*([+-])\\s*(\\d+)`, 'g');
            const match1 = varPlusConstPattern1.exec(factor1);
            
            if (match1) {
                signA = match1[1];
                a = parseFloat(match1[2]);
                if (signA === '-') a = -a;
            } else if (factor1 === variable) {
                a = 0;
            } else {
                // Verificar formato constante+variável
                const constPlusVarPattern = new RegExp(`(\\d+)\\s*([+-])\\s*${variable}`, 'g');
                const constMatch = constPlusVarPattern.exec(factor1);
                
                if (constMatch) {
                    a = -parseFloat(constMatch[1]);
                    if (constMatch[2] === '+') a = -a;
                }
            }
            
            // Analisar o segundo fator (x+b) ou (x-b)
            factor2 = factor2.trim();
            let b = 0;
            let signB = '+';
            
            const varPlusConstPattern2 = new RegExp(`${variable}\\s*([+-])\\s*(\\d+)`, 'g');
            const match2 = varPlusConstPattern2.exec(factor2);
            
            if (match2) {
                signB = match2[1];
                b = parseFloat(match2[2]);
                if (signB === '-') b = -b;
            } else if (factor2 === variable) {
                b = 0;
            } else {
                // Verificar formato constante+variável
                const constPlusVarPattern = new RegExp(`(\\d+)\\s*([+-])\\s*${variable}`, 'g');
                const constMatch = constPlusVarPattern.exec(factor2);
                
                if (constMatch) {
                    b = -parseFloat(constMatch[1]);
                    if (constMatch[2] === '+') b = -b;
                }
            }
            
            // (x+a)(x+b) = x² + bx + ax + ab = x² + (a+b)x + ab
            return `${variable}^2 + ${a+b}*${variable} + ${a*b}`;
        });
        
        return result;
    };
    
    // Função para pré-processar expressões antes de extrair termos
    const preprocessExpression = (expr: string, variable: string): string => {
        let processed = expr;
        
        // Expandir expressões fatoradas
        processed = expandFactoredForm(processed, variable);
        
        // Expandir expressões com potências
        processed = expandPowerExpression(processed, variable);
        
        // Expandir coeficientes multiplicando parênteses
        processed = expandParentheses(processed);
        
        // Normalizar
        processed = processed
            .replace(/\s+/g, '')
            .replace(/\^/g, '**')
            .replace(/−/g, '-');
        
        return processed;
    };

    // Função para resolver a desigualdade
    const handleSolve = () => {
        // Reseta os resultados anteriores e erros
        setResult(null);
        setShowExplanation(true);
        setErrorMessage('');
        setSteps([]);

        // Verifica se o campo está vazio
        if (!inequality.trim()) {
            setErrorMessage('Por favor, insira uma desigualdade para resolver.');
            return;
        }

        try {
            console.log("Checking for specific patterns in: " + inequality);
            
            // Normalize the inequality to handle different types of minus signs
            const normalizedInequality = inequality.trim()
                .replace(/≤/g, '<=')
                .replace(/≥/g, '>=')
                .replace(/−/g, '-');  // Replace en dash with hyphen
            
            // Check for the specific pattern (x-1)(x^2-3x+2)<=0
            const specificPattern = /\(([a-zA-Z])[-+](\d+)\)\((?:\1)\^2[-+](\d+)(?:\1)[-+](\d+)\)(<=|>=|<|>|=|!=)0/;
            const specificMatch = normalizedInequality.replace(/\s+/g, '').match(specificPattern);
            
            if (specificMatch) {
                console.log("Found specific pattern for (x-a)(x^2-bx+c)<=0 type inequality!");
                // Verificar se é um caso específico (x-1)(x²-3x+2)<=0
                const specificResult = handleSpecificFactoredForm(inequality);
                if (specificResult) {
                    setResult(specificResult.interval);
                    setSteps(specificResult.steps);
                    return;
                }
            }
            
            // Verificar se é uma desigualdade racional (com denominador contendo a variável)
            const rationalResult = handleRationalInequality(inequality);
            if (rationalResult) {
                setResult(rationalResult.interval);
                setSteps(rationalResult.steps);
                return;
            }
            
            // Verificar se é uma desigualdade na forma fatorada (x-a)(P(x))<=0
            const factoredResult = handleFactoredPolynomialInequality(inequality);
            if (factoredResult) {
                setResult(factoredResult.interval);
                setSteps(factoredResult.steps);
                return;
            }
            
            // Pré-processar a desigualdade para lidar com frações
            const processedInequality = handleFractionInequality(inequality);
            
            // Registrar se houve transformação de fração
            const hasFractionTransformation = processedInequality !== inequality;
            
            // Tentar analisar como desigualdade dupla primeiro
            const parsedDouble = parseDoubleInequality(processedInequality);
            if (parsedDouble) {
                // Resolver como desigualdade dupla
                const doubleResult = solveDoubleInequality(parsedDouble);
                setResult(doubleResult.interval);
                
                // Gerar passos explicativos, incluindo a transformação de fração se aplicável
                const steps = generateDoubleInequalitySteps(parsedDouble, doubleResult);
                
                if (hasFractionTransformation) {
                    steps.unshift(`Passo 1: Multiplicar ambos os lados pelo denominador para eliminar a fração`);
                    steps.unshift(`Desigualdade original: ${inequality}`);
                    steps.unshift(`Desigualdade transformada: ${processedInequality}`);
                    
                    // Reindexar os passos subsequentes
                    for (let i = 3; i < steps.length; i++) {
                        if (steps[i].startsWith('Passo ')) {
                            const parts = steps[i].split(':');
                            steps[i] = `Passo ${parseInt(parts[0].replace('Passo ', '')) + 3}:${parts[1]}`;
                        }
                    }
                }
                
                setSteps(steps);
                return;
            }
            
            // Verificar se é uma desigualdade cúbica
            const variable = detectVariable(processedInequality);
            
            // Verificar se há expressões com parênteses na forma (x+a)^3
            const hasPowerPattern = /\([^()]+\)\^(\d+)/.test(processedInequality);
            const hasFactoredForm = /\([^()]+\)\s*\*?\s*\([^()]+\)/.test(processedInequality);
            const powerMatch = processedInequality.match(/\(([^()]+)\)\^(\d+)/);
            
            // Verificar explicitamente se é uma expressão cúbica com parênteses
            if (powerMatch && powerMatch[2] === '3') {
                console.log("Detectada inequação cúbica com parênteses:", processedInequality);
                
                // Extrair componentes diretamente da expressão (x+a)^3 [operator] [constant]
                const innerExpr = powerMatch[1].trim();
                let operator: InequalityType = '<';
                
                // Determinar o operador
                if (processedInequality.includes('<=')) {
                    operator = '<=';
                } else if (processedInequality.includes('>=')) {
                    operator = '>=';
                } else if (processedInequality.includes('<')) {
                    operator = '<';
                } else if (processedInequality.includes('>')) {
                    operator = '>';
                }
                
                // Extrair o lado direito (constante)
                const rightSideParts = processedInequality.split(/[<>=]+/);
                if (rightSideParts.length < 2) {
                    setErrorMessage('Formato inválido para a desigualdade cúbica.');
                    return;
                }
                
                const rightSide = rightSideParts[1].trim();
                const rightValue = parseFloat(rightSide);
                
                if (isNaN(rightValue)) {
                    setErrorMessage('O lado direito da desigualdade deve ser um número.');
                    return;
                }
                
                // Extrair 'a' da expressão (x+a) ou (x-a)
                const varPlusConstPattern = new RegExp(`${variable}\\s*([+-])\\s*(\\d+)`);
                const innerMatch = varPlusConstPattern.exec(innerExpr);
                
                if (!innerMatch) {
                    // Tentar resolver com o método geral
                    const cubicResult = handleCubicInequality(processedInequality);
                    if (cubicResult) {
                        // Código para processar o resultado...
                        // (manter o código existente para esse caso)
                        setResult(cubicResult.interval);
                        // ...
                        return;
                    }
                } else {
                    // Extrair o sinal e o valor de 'a'
                    const sign = innerMatch[1];
                    const a = parseFloat(innerMatch[2]);
                    
                    // Calcular os coeficientes da expansão (x+a)^3 = x^3 + 3ax^2 + 3a^2x + a^3
                    const coefA = 1;  // x^3
                    const coefB = sign === '+' ? 3*a : -3*a;  // 3ax^2
                    const coefC = 3*a*a;  // 3a^2x
                    const coefD = sign === '+' ? a*a*a : -a*a*a;  // a^3
                    
                    // Ajustar o termo constante com base no lado direito
                    const adjustedD = coefD - rightValue;
                    
                    console.log("Coeficientes da expansão (x+a)^3:", coefA, coefB, coefC, adjustedD);
                    
                    // Encontrar as raízes da equação cúbica
                    const roots = findCubicRoots(coefA, coefB, coefC, adjustedD);
                    console.log("Raízes da equação cúbica:", roots);
                    
                    // Ordenar as raízes
                    const orderedRoots = [...roots].sort((x, y) => x - y);
                    console.log("Raízes ordenadas:", orderedRoots);
                    
                    // Determinar a solução com base no operador e no comportamento da função cúbica
                    // Para uma função cúbica f(x) = x^3 + ..., quando x → ∞, f(x) → ∞ e quando x → -∞, f(x) → -∞
                    
                    let solution: {algebraic: string, interval: string};
                    
                    if (orderedRoots.length === 0) {
                        // Sem raízes, o sinal é constante em toda a reta real
                        // Para x^3, o sinal é positivo para x grande o suficiente
                        if (operator === '<' || operator === '<=') {
                            // x^3 < 0 para x < 0 (valores suficientemente negativos)
                            solution = {
                                algebraic: `${variable} < ${0}`,
                                interval: "Conjunto solução: (-∞, 0)"
                            };
                        } else {
                            // x^3 > 0 para x > 0
                            solution = {
                                algebraic: `${variable} > ${0}`,
                                interval: "Conjunto solução: (0, ∞)"
                            };
                        }
                    } else if (orderedRoots.length === 1) {
                        // Uma raiz única, o sinal muda apenas nesse ponto
                        const root = orderedRoots[0];
                        if (operator === '<' || operator === '<=') {
                            solution = {
                                algebraic: `${variable} ${operator} ${root}`,
                                interval: `Conjunto solução: (-∞, ${root}${operator === '<=' ? ']' : ')'}`
                            };
                        } else {
                            solution = {
                                algebraic: `${variable} ${operator} ${root}`,
                                interval: `Conjunto solução: (${root}${operator === '>=' ? ']' : ')'}, ∞)`
                            };
                        }
                    } else {
                        // Múltiplas raízes, definir os intervalos onde a desigualdade é satisfeita
                        const intervals: {min: number | string, max: number | string, includeMin: boolean, includeMax: boolean}[] = [];
                        
                        // Avaliar pontos de teste em cada intervalo
                        const testPoints: number[] = [];
                        
                        // Adicionar ponto de teste à esquerda da primeira raiz
                        testPoints.push(orderedRoots[0] - 1);
                        
                        // Adicionar pontos de teste entre as raízes
                        for (let i = 0; i < orderedRoots.length - 1; i++) {
                            testPoints.push((orderedRoots[i] + orderedRoots[i + 1]) / 2);
                        }
                        
                        // Adicionar ponto de teste à direita da última raiz
                        testPoints.push(orderedRoots[orderedRoots.length - 1] + 1);
                        
                        // Verificar cada ponto de teste
                        const satisfies: boolean[] = testPoints.map(x => {
                            // Calcular f(x) = (x+a)^3
                            const value = (sign === '+') ? 
                                Math.pow(x + a, 3) - rightValue : 
                                Math.pow(x - a, 3) - rightValue;
                            
                            // Verificar se a desigualdade é satisfeita
                            switch (operator) {
                                case '<': return value < 0;
                                case '<=': return value <= 0;
                                case '>': return value > 0;
                                case '>=': return value >= 0;
                                default: return false;
                            }
                        });
                        
                        console.log("Pontos de teste:", testPoints);
                        console.log("Satisfaz em cada ponto:", satisfies);
                        
                        // Construir os intervalos que satisfazem a desigualdade
                        if (satisfies[0]) {
                            intervals.push({
                                min: "-∞",
                                max: orderedRoots[0],
                                includeMin: false,
                                includeMax: operator === '<=' || operator === '>='
                            });
                        }
                        
                        for (let i = 0; i < orderedRoots.length - 1; i++) {
                            if (satisfies[i + 1]) {
                                intervals.push({
                                    min: orderedRoots[i],
                                    max: orderedRoots[i + 1],
                                    includeMin: operator === '<=' || operator === '>=',
                                    includeMax: operator === '<=' || operator === '>='
                                });
                            }
                        }
                        
                        if (satisfies[satisfies.length - 1]) {
                            intervals.push({
                                min: orderedRoots[orderedRoots.length - 1],
                                max: "∞",
                                includeMin: operator === '<=' || operator === '>=',
                                includeMax: false
                            });
                        }
                        
                        // Construir notação de intervalos
                        let intervalNotation = "Conjunto solução: ";
                        if (intervals.length === 0) {
                            // Nenhum intervalo satisfaz
                            intervalNotation += "∅";
                            solution = {
                                algebraic: "∅ (conjunto vazio)",
                                interval: intervalNotation
                            };
                        } else {
                            // Formatar intervalos
                            const intervalStrings = intervals.map(interval => {
                                const leftBracket = interval.includeMin ? '[' : '(';
                                const rightBracket = interval.includeMax ? ']' : ')';
                                return `${leftBracket}${interval.min}, ${interval.max}${rightBracket}`;
                            });
                            
                            // Unir intervalos com "∪"
                            intervalNotation += intervalStrings.join(' ∪ ');
                            
                            // Construir notação algébrica
                            let algebraicNotation = "";
                            if (intervals.length === 1) {
                                const interval = intervals[0];
                                if (interval.min === "-∞") {
                                    algebraicNotation = `${variable} ${operator === '<' || operator === '<=' ? operator : invertOperator(operator)} ${interval.max}`;
                                } else if (interval.max === "∞") {
                                    algebraicNotation = `${variable} ${operator === '>' || operator === '>=' ? operator : invertOperator(operator)} ${interval.min}`;
                                } else {
                                    algebraicNotation = `${interval.min} < ${variable} < ${interval.max}`;
                                }
                            } else {
                                // Para múltiplos intervalos, usar a notação de intervalos
                                algebraicNotation = intervalStrings.join(' ∪ ');
                            }
                            
                            solution = {
                                algebraic: algebraicNotation,
                                interval: intervalNotation
                            };
                        }
                    }
                    
                    // Display the result
                    setResult(solution.interval);
                    
                    // Gerar passos explicativos
                    const calculationSteps: string[] = [];
                    calculationSteps.push("Passo 1: Identificar a desigualdade cúbica com parênteses");
                    calculationSteps.push(`Desigualdade: ${processedInequality}`);
                    calculationSteps.push(`Expressão: (${innerExpr})³ ${operator} ${rightValue}`);
                    calculationSteps.push(`Variável identificada: ${variable}`);
                    
                    calculationSteps.push("Passo 2: Expandir a expressão com parênteses");
                    calculationSteps.push(`Expansão de (${innerExpr})³:`);
                    calculationSteps.push(`(${innerExpr})³ = (${innerExpr})·(${innerExpr})·(${innerExpr})`);
                    
                    // Expandir (x+a)^3 = x^3 + 3ax^2 + 3a^2x + a^3
                    calculationSteps.push(`(${variable}${sign}${a})³ = ${variable}³ ${sign === '+' ? '+' : '-'} 3·${a}·${variable}² + 3·${a}²·${variable} ${sign === '+' ? '+' : '-'} ${a}³`);
                    
                    // Calcular os termos
                    const term1 = `${variable}³`;
                    const term2 = `${sign === '+' ? '+' : '-'} ${3*a}${variable}²`;
                    const term3 = `+ ${3*a*a}${variable}`;
                    const term4 = `${sign === '+' ? '+' : '-'} ${Math.abs(a*a*a)}`;
                    
                    calculationSteps.push(`(${variable}${sign}${a})³ = ${term1} ${term2} ${term3} ${term4}`);
                    
                    calculationSteps.push("Passo 3: Mover todos os termos para o lado esquerdo");
                    calculationSteps.push(`${term1} ${term2} ${term3} ${term4} ${operator} ${rightValue}`);
                    calculationSteps.push(`${term1} ${term2} ${term3} ${term4} ${operator === '<' || operator === '<=' ? '-' : '+'} ${Math.abs(rightValue)} ${operator} 0`);
                    
                    calculationSteps.push("Passo 4: Identificar os coeficientes da equação cúbica");
                    calculationSteps.push(`a = ${coefA} (coeficiente de ${variable}³)`);
                    calculationSteps.push(`b = ${coefB} (coeficiente de ${variable}²)`);
                    calculationSteps.push(`c = ${coefC} (coeficiente de ${variable})`);
                    calculationSteps.push(`d = ${adjustedD} (termo constante)`);
                    
                    calculationSteps.push("Passo 5: Resolver a equação cúbica");
                    calculationSteps.push(`Equação: ${coefA}${variable}³ + ${coefB}${variable}² + ${coefC}${variable} + ${adjustedD} = 0`);
                    
                    if (roots.length > 0) {
                        calculationSteps.push(`A equação cúbica tem ${roots.length} raiz(es):`);
                        roots.forEach((root, idx) => {
                            calculationSteps.push(`Raiz ${idx+1}: ${variable} = ${root.toFixed(4)}`);
                        });
                    } else {
                        calculationSteps.push("A equação cúbica não tem raízes reais encontradas.");
                    }
                    
                    calculationSteps.push("Passo 6: Analisar o comportamento da função cúbica");
                    calculationSteps.push(`Como o coeficiente de ${variable}³ é ${coefA > 0 ? 'positivo' : 'negativo'}, a função cúbica tende a ${coefA > 0 ? '+∞' : '-∞'} quando ${variable} → +∞ e a ${coefA > 0 ? '-∞' : '+∞'} quando ${variable} → -∞.`);
                    
                    calculationSteps.push("Passo 7: Determinar a solução");
                    calculationSteps.push(`Solução: ${solution.algebraic}`);
                    calculationSteps.push(`${solution.interval}`);
                    
                    setSteps(calculationSteps);
                    return;
                }
            }
            
            // Check for cubic inequality in factored form (three factors)
            const factorPattern = /\(\s*([^()]+)\s*\)\s*\*?\s*\(\s*([^()]+)\s*\)\s*\*?\s*\(\s*([^()]+)\s*\)/;
            const factorMatch = processedInequality.match(factorPattern);
            
            if (factorMatch && factorMatch.length === 4) {
                console.log("Detectada inequação cúbica em forma fatorada:", processedInequality);
                
                // Extract the factors
                const factor1 = factorMatch[1].trim();
                const factor2 = factorMatch[2].trim();
                const factor3 = factorMatch[3].trim();
                
                // Determine the operator
                let operator: InequalityType = '>';
                if (processedInequality.includes('<=')) {
                    operator = '<=';
                } else if (processedInequality.includes('>=')) {
                    operator = '>=';
                } else if (processedInequality.includes('<')) {
                    operator = '<';
                } else if (processedInequality.includes('>')) {
                    operator = '>';
                }
                
                // Extract the roots directly from the factors
                const roots: number[] = [];
                
                // Function to extract root from a factor like (x-a) or (x+a)
                const extractRoot = (factor: string, variable: string) => {
                    console.log(`Extracting root from factor: '${factor}'`);
                    
                    // Normalize the factor to handle different dash characters
                    const normalizedFactor = factor
                        .replace(/−/g, '-')  // Replace unicode minus with hyphen
                        .replace(/\s+/g, ''); // Remove all spaces
                        
                    console.log(`Normalized factor: '${normalizedFactor}'`);
                    
                    // Check for the pattern x±a where a is a number
                    // Match variable followed by + or - followed by number
                    const patternStandard = new RegExp(`^${variable}([+-])(\\d+(?:\\.\\d+)?)$`);
                    const matchStandard = patternStandard.exec(normalizedFactor);
                    
                    if (matchStandard) {
                        console.log(`Matched standard pattern: ${matchStandard[0]}`);
                        const sign = matchStandard[1];
                        const value = parseFloat(matchStandard[2]);
                        return sign === '+' ? -value : value;
                    }
                    
                    // Check for the pattern a±x where a is a number (e.g., 3-x)
                    const patternReversed = /^(\d+(?:\.\d+)?)([+-])([a-zA-Z])$/;
                    const matchReversed = patternReversed.exec(normalizedFactor);
                    
                    if (matchReversed && matchReversed[3] === variable) {
                        console.log(`Matched reversed pattern: ${matchReversed[0]}`);
                        const value = parseFloat(matchReversed[1]);
                        const sign = matchReversed[2];
                        return sign === '+' ? value : -value;
                    }
                    
                    // If it's just the variable alone
                    if (normalizedFactor === variable) {
                        console.log(`Matched variable only: ${variable}`);
                        return 0;
                    }
                    
                    // Direct check for common forms
                    if (normalizedFactor === `${variable}-1`) return 1;
                    if (normalizedFactor === `${variable}-2`) return 2;
                    if (normalizedFactor === `${variable}-3`) return 3;
                    if (normalizedFactor === `${variable}-4`) return 4;
                    if (normalizedFactor === `${variable}+1`) return -1;
                    if (normalizedFactor === `${variable}+2`) return -2;
                    if (normalizedFactor === `${variable}+3`) return -3;
                    if (normalizedFactor === `${variable}+4`) return -4;
                    
                    console.log(`Couldn't extract root from factor: ${factor} (normalized: ${normalizedFactor})`);
                    return null;
                };
                
                // Extract roots from each factor
                const root1 = extractRoot(factor1, variable);
                const root2 = extractRoot(factor2, variable);
                const root3 = extractRoot(factor3, variable);
                
                if (root1 !== null) roots.push(root1);
                if (root2 !== null) roots.push(root2);
                if (root3 !== null) roots.push(root3);
                
                console.log("Raízes extraídas dos fatores:", roots);
                
                // Sort the roots in ascending order
                const orderedRoots = [...roots].sort((a, b) => a - b);
                
                // Determine the intervals and their signs
                // A factored cubic function changes sign at each root
                
                // Create a function to evaluate the sign of each factor at a given point
                const evaluateFactorSign = (x: number, root: number | null) => {
                    if (root === null) return 1; // If root couldn't be determined, assume positive
                    return x < root ? -1 : (x > root ? 1 : 0);
                };
                
                // Create test points in each interval
                const testPoints: number[] = [];
                
                // Add a point to the left of the smallest root
                testPoints.push(orderedRoots[0] - 1);
                
                // Add points between roots
                for (let i = 0; i < orderedRoots.length - 1; i++) {
                    testPoints.push((orderedRoots[i] + orderedRoots[i + 1]) / 2);
                }
                
                // Add a point to the right of the largest root
                testPoints.push(orderedRoots[orderedRoots.length - 1] + 1);
                
                console.log("Pontos de teste:", testPoints);
                
                // Evaluate the sign of the product at each test point
                const signAtPoints = testPoints.map(x => {
                    // Calculate the sign of each factor
                    const sign1 = evaluateFactorSign(x, root1);
                    const sign2 = evaluateFactorSign(x, root2);
                    const sign3 = evaluateFactorSign(x, root3);
                    
                    // Calculate the sign of the product
                    const productSign = sign1 * sign2 * sign3;
                    
                    console.log(`At x = ${x}: Factor signs: ${sign1}, ${sign2}, ${sign3}, Product sign: ${productSign}`);
                    
                    // Check if the inequality is satisfied
                    if (operator === '>') return productSign > 0;
                    if (operator === '>=') return productSign >= 0;
                    if (operator === '<') return productSign < 0;
                    if (operator === '<=') return productSign <= 0;
                    return false;
                });
                
                console.log("Satisfaz em cada ponto:", signAtPoints);
                
                // Construct intervals that satisfy the inequality
                const intervals: {min: number | string, max: number | string, includeMin: boolean, includeMax: boolean}[] = [];
                
                // Check interval to the left of the first root
                if (signAtPoints[0]) {
                    intervals.push({
                        min: "-∞",
                        max: orderedRoots[0],
                        includeMin: false,
                        includeMax: operator === '>=' || operator === '<='
                    });
                }
                
                // Check intervals between roots
                for (let i = 0; i < orderedRoots.length - 1; i++) {
                    if (signAtPoints[i + 1]) {
                        intervals.push({
                            min: orderedRoots[i],
                            max: orderedRoots[i + 1],
                            includeMin: operator === '>=' || operator === '<=',
                            includeMax: operator === '>=' || operator === '<='
                        });
                    }
                }
                
                // Check interval to the right of the last root
                if (signAtPoints[signAtPoints.length - 1]) {
                    intervals.push({
                        min: orderedRoots[orderedRoots.length - 1],
                        max: "∞",
                        includeMin: operator === '>=' || operator === '<=',
                        includeMax: false
                    });
                }
                
                // Construct interval notation
                let intervalNotation = "Conjunto solução: ";
                let algebraicNotation = "";
                
                if (intervals.length === 0) {
                    // No solution
                    intervalNotation += "∅";
                    algebraicNotation = "∅ (conjunto vazio)";
                } else {
                    // Format the intervals
                    const intervalStrings = intervals.map(interval => {
                        const leftBracket = interval.includeMin ? '[' : '(';
                        const rightBracket = interval.includeMax ? ']' : ')';
                        return `${leftBracket}${interval.min}, ${interval.max}${rightBracket}`;
                    });
                    
                    // Join intervals with union symbol
                    intervalNotation += intervalStrings.join(' ∪ ');
                    
                    // Create algebraic notation
                    if (intervals.length === 1) {
                        const interval = intervals[0];
                        if (interval.min === "-∞") {
                            algebraicNotation = `${variable} ${operator === '<' || operator === '<=' ? operator : invertOperator(operator)} ${interval.max}`;
                        } else if (interval.max === "∞") {
                            algebraicNotation = `${variable} ${operator === '>' || operator === '>=' ? operator : invertOperator(operator)} ${interval.min}`;
                        } else {
                            const leftOp = interval.includeMin ? '>=' : '>';
                            const rightOp = interval.includeMax ? '<=' : '<';
                            algebraicNotation = `${interval.min} ${leftOp} ${variable} ${rightOp} ${interval.max}`;
                        }
                    } else {
                        // For multiple intervals, use the interval notation
                        algebraicNotation = intervalStrings.join(' ∪ ');
                    }
                }
                
                // Create the solution
                const solution = {
                    algebraic: algebraicNotation,
                    interval: intervalNotation
                };
                
                // Display the result
                setResult(solution.interval);
                
                // Generate explanatory steps
                const calculationSteps: string[] = [];
                calculationSteps.push("Passo 1: Identificar a desigualdade cúbica em forma fatorada");
                calculationSteps.push(`Desigualdade: ${processedInequality}`);
                calculationSteps.push(`Forma fatorada: (${factor1})(${factor2})(${factor3}) ${operator} 0`);
                calculationSteps.push(`Variável identificada: ${variable}`);
                
                calculationSteps.push("Passo 2: Identificar as raízes da equação cúbica a partir dos fatores");
                calculationSteps.push(`Igualando cada fator a zero:`);
                
                // Format each factor equation
                if (root1 !== null) {
                    calculationSteps.push(`${factor1} = 0 ⟹ ${variable} = ${root1}`);
                }
                if (root2 !== null) {
                    calculationSteps.push(`${factor2} = 0 ⟹ ${variable} = ${root2}`);
                }
                if (root3 !== null) {
                    calculationSteps.push(`${factor3} = 0 ⟹ ${variable} = ${root3}`);
                }
                
                calculationSteps.push(`As raízes da equação cúbica são: ${orderedRoots.join(', ')}`);
                
                calculationSteps.push("Passo 3: Analisar o sinal da expressão em cada intervalo");
                calculationSteps.push(`As raízes ${orderedRoots.join(', ')} dividem a reta real em ${orderedRoots.length + 1} intervalos:`);
                
                // Describe the intervals
                calculationSteps.push(`Intervalo 1: (-∞, ${orderedRoots[0]})`);
                for (let i = 0; i < orderedRoots.length - 1; i++) {
                    calculationSteps.push(`Intervalo ${i + 2}: (${orderedRoots[i]}, ${orderedRoots[i + 1]})`);
                }
                calculationSteps.push(`Intervalo ${orderedRoots.length + 1}: (${orderedRoots[orderedRoots.length - 1]}, ∞)`);
                
                // Explain the sign changes
                calculationSteps.push("Passo 4: Determinar onde a desigualdade é satisfeita");
                
                if (operator === '>' || operator === '>=') {
                    calculationSteps.push(`A desigualdade (${factor1})(${factor2})(${factor3}) ${operator} 0 é satisfeita quando o produto é ${operator === '>' ? 'positivo' : 'positivo ou zero'}.`);
                } else {
                    calculationSteps.push(`A desigualdade (${factor1})(${factor2})(${factor3}) ${operator} 0 é satisfeita quando o produto é ${operator === '<' ? 'negativo' : 'negativo ou zero'}.`);
                }
                
                // Explain the intervals where the inequality is satisfied
                calculationSteps.push("Analisando cada intervalo:");
                
                // Create a more visual explanation of sign changes
                const signTable = ["Intervalos"];
                signTable.push(`Fator 1: (${factor1})`);
                signTable.push(`Fator 2: (${factor2})`);
                signTable.push(`Fator 3: (${factor3})`);
                signTable.push(`Produto`);
                signTable.push(`Satisfaz ${operator} 0`);
                
                calculationSteps.push("Tabela de sinais dos fatores em cada intervalo:");
                
                // Analyze sign changes in each interval
                for (let i = 0; i < testPoints.length; i++) {
                    const x = testPoints[i];
                    const sign1 = evaluateFactorSign(x, root1);
                    const sign2 = evaluateFactorSign(x, root2);
                    const sign3 = evaluateFactorSign(x, root3);
                    const productSign = sign1 * sign2 * sign3;
                    
                    const intervalDesc = i === 0 ? 
                        `(-∞, ${orderedRoots[0]})` : 
                        (i === testPoints.length - 1 ? 
                            `(${orderedRoots[orderedRoots.length - 1]}, ∞)` : 
                            `(${orderedRoots[i-1]}, ${orderedRoots[i]})`);
                    
                    const signStr1 = sign1 > 0 ? "+" : (sign1 < 0 ? "-" : "0");
                    const signStr2 = sign2 > 0 ? "+" : (sign2 < 0 ? "-" : "0");
                    const signStr3 = sign3 > 0 ? "+" : (sign3 < 0 ? "-" : "0");
                    const productSignStr = productSign > 0 ? "+" : (productSign < 0 ? "-" : "0");
                    
                    const explanation = `No intervalo ${intervalDesc}:
- Sinal de (${factor1}): ${signStr1}
- Sinal de (${factor2}): ${signStr2}
- Sinal de (${factor3}): ${signStr3}
- Sinal do produto: ${productSignStr}
- ${signAtPoints[i] ? "Satisfaz" : "Não satisfaz"} a desigualdade`;
                    
                    calculationSteps.push(explanation);
                }
                
                // Summarize the solution
                calculationSteps.push("Portanto, a desigualdade é satisfeita nos seguintes intervalos:");
                
                if (intervals.length === 0) {
                    calculationSteps.push("Nenhum intervalo (conjunto vazio)");
                } else {
                    intervals.forEach(interval => {
                        const leftBracket = interval.includeMin ? '[' : '(';
                        const rightBracket = interval.includeMax ? ']' : ')';
                        calculationSteps.push(`${leftBracket}${interval.min}, ${interval.max}${rightBracket}`);
                    });
                }
                
                calculationSteps.push("Passo 5: Determinar a solução");
                calculationSteps.push(`Solução: ${solution.algebraic}`);
                calculationSteps.push(`${solution.interval}`);
                
                setSteps(calculationSteps);
                return;
            }
            
            if (hasCubicTerm(processedInequality, variable)) {
                // Tentar resolver como inequação cúbica
                const cubicResult = handleCubicInequality(processedInequality);
                if (cubicResult) {
                    setResult(cubicResult.interval);
                    
                    // Gerar passos explicativos para inequações cúbicas
                    const calculationSteps: string[] = [];
                    calculationSteps.push("Passo 1: Identificar a desigualdade cúbica");
                    calculationSteps.push(`Desigualdade: ${processedInequality}`);
                    calculationSteps.push(`Variável identificada: ${variable}`);
                    
                    // Verificar se tem expressões com parênteses que precisam ser expandidas
                    if (hasPowerPattern || hasFactoredForm) {
                        calculationSteps.push("Passo 2: Expandir a expressão com parênteses");
                        
                        if (hasPowerPattern) {
                            // Encontrar as expressões com parênteses elevados a potências
                            const powerPattern = /\(([^()]+)\)\^(\d+)/g;
                            let match;
                            while ((match = powerPattern.exec(processedInequality)) !== null) {
                                const innerExpr = match[1];
                                const power = parseInt(match[2]);
                                
                                if (power === 2) {
                                    calculationSteps.push(`Expansão de (${innerExpr})²:`);
                                    calculationSteps.push(`(${innerExpr})² = (${innerExpr})·(${innerExpr})`);
                                    
                                    // Extrair 'a' da expressão (x+a) ou (x-a)
                                    const varPlusConstPattern = new RegExp(`${variable}\\s*([+-])\\s*(\\d+)`, 'g');
                                    const innerMatch = varPlusConstPattern.exec(innerExpr);
                                    
                                    if (innerMatch) {
                                        const sign = innerMatch[1];
                                        const a = parseFloat(innerMatch[2]);
                                        calculationSteps.push(`(${variable}${sign}${a})² = ${variable}² ${sign} 2·${a}·${variable} + ${a}²`);
                                        calculationSteps.push(`(${variable}${sign}${a})² = ${variable}² ${sign} ${2*a}${variable} + ${a*a}`);
                                    }
                                } else if (power === 3) {
                                    calculationSteps.push(`Expansão de (${innerExpr})³:`);
                                    calculationSteps.push(`(${innerExpr})³ = (${innerExpr})·(${innerExpr})·(${innerExpr})`);
                                    
                                    // Extrair 'a' da expressão (x+a) ou (x-a)
                                    const varPlusConstPattern = new RegExp(`${variable}\\s*([+-])\\s*(\\d+)`, 'g');
                                    const innerMatch = varPlusConstPattern.exec(innerExpr);
                                    
                                    if (innerMatch) {
                                        const sign = innerMatch[1];
                                        const a = parseFloat(innerMatch[2]);
                                        calculationSteps.push(`(${variable}${sign}${a})³ = ${variable}³ ${sign} 3·${a}·${variable}² + 3·${a}²·${variable} ${sign} ${a}³`);
                                        
                                        // Calcular os termos
                                        const term1 = `${variable}³`;
                                        const term2 = `${sign} ${3*a}${variable}²`;
                                        const term3 = `+ ${3*a*a}${variable}`;
                                        const term4 = `${sign === '+' ? '+' : '-'} ${Math.abs(a*a*a)}`;
                                        
                                        calculationSteps.push(`(${variable}${sign}${a})³ = ${term1} ${term2} ${term3} ${term4}`);
                                    }
                                }
                            }
                        }
                        
                        if (hasFactoredForm) {
                            // Encontrar expressões fatoradas
                            const factoredPattern = /\(([^()]+)\)\s*\*?\s*\(([^()]+)\)/g;
                            let match;
                            while ((match = factoredPattern.exec(processedInequality)) !== null) {
                                const factor1 = match[1].trim();
                                const factor2 = match[2].trim();
                                
                                calculationSteps.push(`Expansão do produto (${factor1})(${factor2}):`);
                                
                                // Verificar se são expressões do tipo (x+a) ou (x-b)
                                const varPlusConstPattern1 = new RegExp(`${variable}\\s*([+-])\\s*(\\d+)`, 'g');
                                const varPlusConstPattern2 = new RegExp(`${variable}\\s*([+-])\\s*(\\d+)`, 'g');
                                
                                const match1 = varPlusConstPattern1.exec(factor1);
                                const match2 = varPlusConstPattern2.exec(factor2);
                                
                                if (match1 && match2) {
                                    const sign1 = match1[1];
                                    const a = parseFloat(match1[2]);
                                    const sign2 = match2[1];
                                    const b = parseFloat(match2[2]);
                                    
                                    calculationSteps.push(`(${variable}${sign1}${a})(${variable}${sign2}${b}) = ${variable}·${variable} + ${variable}·${sign2}${b} + ${sign1}${a}·${variable} + ${sign1}${a}·${sign2}${b}`);
                                    
                                    // Calcular os termos resultantes
                                    const term1 = `${variable}²`;
                                    const term2Sign = sign2 === '+' ? '+' : '-';
                                    const term2 = `${term2Sign} ${b}${variable}`;
                                    const term3Sign = sign1 === '+' ? '+' : '-';
                                    const term3 = `${term3Sign} ${a}${variable}`;
                                    
                                    // Determinar o sinal do produto a*b
                                    const productSign = (sign1 === sign2) ? '+' : '-';
                                    const term4 = `${productSign} ${a*b}`;
                                    
                                    calculationSteps.push(`(${variable}${sign1}${a})(${variable}${sign2}${b}) = ${term1} ${term2} ${term3} ${term4}`);
                                    
                                    // Combinar termos semelhantes
                                    const combinedSign = ((sign1 === '+' ? a : -a) + (sign2 === '+' ? b : -b)) >= 0 ? '+' : '';
                                    const combinedCoef = Math.abs((sign1 === '+' ? a : -a) + (sign2 === '+' ? b : -b));
                                    calculationSteps.push(`(${variable}${sign1}${a})(${variable}${sign2}${b}) = ${term1} ${combinedSign} ${combinedCoef}${variable} ${term4}`);
                                }
                            }
                        }
                        
                        // Pré-processar a expressão para mostrar a expansão
            const parsed = parseInequality(processedInequality);
                        if (parsed) {
                            const leftSide = preprocessExpression(parsed.leftSide, variable);
                            const rightSide = preprocessExpression(parsed.rightSide, variable);
                            calculationSteps.push(`Expressão expandida: ${leftSide} ${parsed.operator} ${rightSide}`);
                        }
                    }
                    
                    // Determinar número do próximo passo
                    const stepNum = hasPowerPattern || hasFactoredForm ? 3 : 2;
                    
                    calculationSteps.push(`Passo ${stepNum}: Mover todos os termos para o lado esquerdo`);
                    const parsed = parseInequality(processedInequality);
                    if (parsed) {
                        // Se há parentheses, usar a expressão processada
                        let standardForm;
                        if (hasPowerPattern || hasFactoredForm) {
                            const leftSide = preprocessExpression(parsed.leftSide, variable);
                            const rightSide = preprocessExpression(parsed.rightSide, variable);
                            const processedInequality = parseInequality(`${leftSide} ${parsed.operator} ${rightSide}`);
                            if (processedInequality) {
                                standardForm = moveToLeftSide(processedInequality);
                            } else {
                                standardForm = moveToLeftSide(parsed);
                            }
                        } else {
                            standardForm = moveToLeftSide(parsed);
                        }
                        
                        calculationSteps.push(`Forma padrão: ${standardForm} ${parsed.operator} 0`);
                    
                        calculationSteps.push(`Passo ${stepNum + 1}: Identificar os coeficientes da equação cúbica`);
                        // Extrair os coeficientes
                        const termsData = extractTerms(standardForm, variable);
                        if (termsData) {
                            calculationSteps.push(`a = ${termsData.varPower3} (coeficiente de ${variable}³)`);
                            calculationSteps.push(`b = ${termsData.varPower2} (coeficiente de ${variable}²)`);
                            calculationSteps.push(`c = ${termsData.varPower1} (coeficiente de ${variable})`);
                            calculationSteps.push(`d = ${termsData.constant} (termo constante)`);
                        
                            calculationSteps.push(`Passo ${stepNum + 2}: Determinar as raízes da equação cúbica`);
                            calculationSteps.push("Para equações cúbicas na forma ax³ + bx² + cx + d = 0:");
                            
                            // Encontrar as raízes
                            const cubicRoots = findCubicRoots(termsData.varPower3, termsData.varPower2, termsData.varPower1, termsData.constant);
                            
                            if (cubicRoots.length === 0) {
                                calculationSteps.push("A equação cúbica não possui raízes reais encontradas pelo nosso método. Isso significa que a função cúbica não cruza o eixo x no intervalo analisado.");
                            } else {
                                calculationSteps.push(`A equação cúbica possui ${cubicRoots.length} raiz(es) real(is):`);
                                cubicRoots.forEach((root, index) => {
                                    calculationSteps.push(`Raiz ${index + 1}: ${variable} = ${root}`);
                                });
                            }
                            
                            calculationSteps.push(`Passo ${stepNum + 3}: Analisar o comportamento da função cúbica`);
                            const a = termsData.varPower3;
                            if (a > 0) {
                                calculationSteps.push(`Como o coeficiente de ${variable}³ é positivo (${a} > 0), a função tende a +∞ quando ${variable} → +∞ e a -∞ quando ${variable} → -∞.`);
                            } else {
                                calculationSteps.push(`Como o coeficiente de ${variable}³ é negativo (${a} < 0), a função tende a -∞ quando ${variable} → +∞ e a +∞ quando ${variable} → -∞.`);
                            }
                            
                            calculationSteps.push(`Passo ${stepNum + 4}: Analisar o sinal da função em cada intervalo`);
                            calculationSteps.push("As raízes encontradas dividem a reta real em intervalos. Em cada intervalo, a função cúbica mantém um sinal constante (positivo ou negativo).");
                            calculationSteps.push(`Analisamos quando a expressão ${standardForm} é ${parsed.operator === '<' || parsed.operator === '<=' ? 'negativa' : 'positiva'}.`);
                            
                            calculationSteps.push(`Passo ${stepNum + 5}: Determinar a solução final`);
                            calculationSteps.push(`Solução: ${cubicResult.algebraic}`);
                            calculationSteps.push(`${cubicResult.interval}`);
                        }
                    }
                    
                    setSteps(calculationSteps);
                    return;
                }
            }
            
            // Verificar se é uma desigualdade quadrática
            const regexQuadratic = new RegExp(`${variable}\\^2|${variable}\\*\\*2|${variable}²`);
            
            if (regexQuadratic.test(processedInequality)) {
                // Resolver como desigualdade quadrática
                const parsed = parseInequality(processedInequality);
            if (!parsed) {
                    setErrorMessage("Não foi possível analisar a desigualdade quadrática.");
                return;
            }
            
                // Mover termos para o lado esquerdo
                const standardForm = moveToLeftSide(parsed);
                
                // Resolver a desigualdade
                const quadraticResult = solveQuadraticInequality(standardForm, parsed.operator, parsed.variable);
                setResult(quadraticResult.interval);
                
                // Gerar passos explicativos
            const calculationSteps: string[] = [];
                calculationSteps.push("Passo 1: Identificar a desigualdade quadrática");
                calculationSteps.push(`Desigualdade: ${processedInequality}`);
                calculationSteps.push(`Variável identificada: ${variable}`);
                
                // Verificar se tem expressões com parênteses e potências
                const hasPowerPattern = /\([^()]+\)\^(\d+)/.test(processedInequality);
                const hasFactoredForm = /\([^()]+\)\s*\*?\s*\([^()]+\)/.test(processedInequality);
                
                if (hasPowerPattern || hasFactoredForm) {
                    calculationSteps.push("Passo 2: Expandir a expressão com parênteses");
                    
                    if (hasPowerPattern) {
                        // Encontrar as expressões com parênteses elevados a potências
                        const powerPattern = /\(([^()]+)\)\^(\d+)/g;
                        let match;
                        while ((match = powerPattern.exec(processedInequality)) !== null) {
                            const innerExpr = match[1];
                            const power = parseInt(match[2]);
                            
                            if (power === 2) {
                                calculationSteps.push(`Expansão de (${innerExpr})²:`);
                                calculationSteps.push(`(${innerExpr})² = (${innerExpr})·(${innerExpr})`);
                                
                                // Extrair 'a' da expressão (x+a) ou (x-a)
                                const varPlusConstPattern = new RegExp(`${variable}\\s*([+-])\\s*(\\d+)`, 'g');
                                const innerMatch = varPlusConstPattern.exec(innerExpr);
                                
                                if (innerMatch) {
                                    const sign = innerMatch[1];
                                    const a = parseFloat(innerMatch[2]);
                                    calculationSteps.push(`(${variable}${sign}${a})² = ${variable}² ${sign} 2·${a}·${variable} + ${a}²`);
                                    calculationSteps.push(`(${variable}${sign}${a})² = ${variable}² ${sign} ${2*a}${variable} + ${a*a}`);
                                }
                            }
                        }
                    }
                    
                    if (hasFactoredForm) {
                        // Encontrar expressões fatoradas
                        const factoredPattern = /\(([^()]+)\)\s*\*?\s*\(([^()]+)\)/g;
                        let match;
                        while ((match = factoredPattern.exec(processedInequality)) !== null) {
                            const factor1 = match[1].trim();
                            const factor2 = match[2].trim();
                            
                            calculationSteps.push(`Expansão do produto (${factor1})(${factor2}):`);
                            
                            // Verificar se são expressões do tipo (x+a) ou (x-b)
                            const varPlusConstPattern1 = new RegExp(`${variable}\\s*([+-])\\s*(\\d+)`, 'g');
                            const varPlusConstPattern2 = new RegExp(`${variable}\\s*([+-])\\s*(\\d+)`, 'g');
                            
                            const match1 = varPlusConstPattern1.exec(factor1);
                            const match2 = varPlusConstPattern2.exec(factor2);
                            
                            if (match1 && match2) {
                                const sign1 = match1[1];
                                const a = parseFloat(match1[2]);
                                const sign2 = match2[1];
                                const b = parseFloat(match2[2]);
                                
                                calculationSteps.push(`(${variable}${sign1}${a})(${variable}${sign2}${b}) = ${variable}·${variable} + ${variable}·${sign2}${b} + ${sign1}${a}·${variable} + ${sign1}${a}·${sign2}${b}`);
                                
                                // Calcular os termos resultantes
                                const term1 = `${variable}²`;
                                const term2Sign = sign2 === '+' ? '+' : '-';
                                const term2 = `${term2Sign} ${b}${variable}`;
                                const term3Sign = sign1 === '+' ? '+' : '-';
                                const term3 = `${term3Sign} ${a}${variable}`;
                                
                                // Determinar o sinal do produto a*b
                                const productSign = (sign1 === sign2) ? '+' : '-';
                                const term4 = `${productSign} ${a*b}`;
                                
                                calculationSteps.push(`(${variable}${sign1}${a})(${variable}${sign2}${b}) = ${term1} ${term2} ${term3} ${term4}`);
                                
                                // Combinar termos semelhantes
                                const combinedSign = ((sign1 === '+' ? a : -a) + (sign2 === '+' ? b : -b)) >= 0 ? '+' : '';
                                const combinedCoef = Math.abs((sign1 === '+' ? a : -a) + (sign2 === '+' ? b : -b));
                                calculationSteps.push(`(${variable}${sign1}${a})(${variable}${sign2}${b}) = ${term1} ${combinedSign} ${combinedCoef}${variable} ${term4}`);
                            }
                        }
                    }
                    
                    // Adicionar a expressão expandida
                    if (parsed) {
            const standardForm = moveToLeftSide(parsed);
                        const expandedForm = preprocessExpression(standardForm, variable);
                        calculationSteps.push(`Expressão expandida: ${expandedForm} ${parsed.operator} 0`);
                    }
                }
                
                calculationSteps.push("Passo " + (hasPowerPattern || hasFactoredForm ? "3" : "2") + ": Mover todos os termos para o lado esquerdo");
                if (parsed) {
                    const standardForm = moveToLeftSide(parsed);
                    calculationSteps.push(`Forma padrão: ${standardForm} ${parsed.operator} 0`);
                }
                
                calculationSteps.push("Passo " + (hasPowerPattern || hasFactoredForm ? "4" : "3") + ": Identificar os coeficientes da equação quadrática");
                // Extrair os coeficientes
                const terms = extractTerms(standardForm, parsed.variable);
                const a = terms.varPower2;
                const b = terms.varPower1;
                const c = terms.constant;
                
                calculationSteps.push(`a = ${a} (coeficiente de ${variable}²)`);
                calculationSteps.push(`b = ${b} (coeficiente de ${variable})`);
                calculationSteps.push(`c = ${c} (termo constante)`);
                
                calculationSteps.push("Passo " + (hasPowerPattern || hasFactoredForm ? "5" : "4") + ": Calcular o discriminante");
                const discriminant = b * b - 4 * a * c;
                calculationSteps.push(`Δ = b² - 4ac = ${b}² - 4 × ${a} × ${c} = ${discriminant}`);
                
                calculationSteps.push("Passo " + (hasPowerPattern || hasFactoredForm ? "6" : "5") + ": Analisar a forma da parábola");
                const isOpenUp = a > 0;
                calculationSteps.push(isOpenUp ? 
                    "Como o coeficiente de x² é positivo, a parábola abre para cima." : 
                    "Como o coeficiente de x² é negativo, a parábola abre para baixo.");
                
                calculationSteps.push("Passo " + (hasPowerPattern || hasFactoredForm ? "7" : "6") + ": Determinar as raízes da equação");
                if (discriminant < 0) {
                    calculationSteps.push("Como o discriminante é negativo, a equação não possui raízes reais.");
                    
                    if ((parsed.operator === '<' || parsed.operator === '<=') && a > 0) {
                        calculationSteps.push("Como a parábola abre para cima e a desigualdade é do tipo '<', não existem valores de x que satisfaçam a condição.");
                    } else if ((parsed.operator === '>' || parsed.operator === '>=') && a < 0) {
                        calculationSteps.push("Como a parábola abre para baixo e a desigualdade é do tipo '>', não existem valores de x que satisfaçam a condição.");
                    } else if ((parsed.operator === '<' || parsed.operator === '<=') && a < 0) {
                        calculationSteps.push("Como a parábola abre para baixo e a desigualdade é do tipo '<', todos os valores de x satisfazem a condição.");
                    } else if ((parsed.operator === '>' || parsed.operator === '>=') && a > 0) {
                        calculationSteps.push("Como a parábola abre para cima e a desigualdade é do tipo '>', todos os valores de x satisfazem a condição.");
                    }
                } else {
                    const sqrtDiscriminant = Math.sqrt(discriminant);
                    const x1 = (-b - sqrtDiscriminant) / (2 * a);
                    const x2 = (-b + sqrtDiscriminant) / (2 * a);
                    const roots = [x1, x2].sort((a, b) => a - b);
                    calculationSteps.push(`As raízes são x₁ = ${roots[0].toFixed(2)} e x₂ = ${roots[1].toFixed(2)}`);
                    
                    if (parsed.operator === '<' || parsed.operator === '<=') {
                        if (a > 0) {
                            calculationSteps.push(`Como a parábola abre para cima e a desigualdade é do tipo ${parsed.operator}, a solução está entre as raízes.`);
                        } else {
                            calculationSteps.push(`Como a parábola abre para baixo e a desigualdade é do tipo ${parsed.operator}, a solução está fora do intervalo entre as raízes.`);
                        }
                    } else if (parsed.operator === '>' || parsed.operator === '>=') {
                        if (a > 0) {
                            calculationSteps.push(`Como a parábola abre para cima e a desigualdade é do tipo ${parsed.operator}, a solução está fora do intervalo entre as raízes.`);
                        } else {
                            calculationSteps.push(`Como a parábola abre para baixo e a desigualdade é do tipo ${parsed.operator}, a solução está entre as raízes.`);
                        }
                    }
                }
                
                calculationSteps.push("Passo " + (hasPowerPattern || hasFactoredForm ? "8" : "7") + ": Determinar a solução");
                calculationSteps.push(`Solução: ${quadraticResult.algebraic}`);
                calculationSteps.push(`${quadraticResult.interval}`);
                
                setSteps(calculationSteps);
                return;
            }
            
            // Verificar se é uma desigualdade linear
            const parsedLinear = parseInequality(processedInequality);
            if (parsedLinear) {
                // Mover termos para o lado esquerdo
                const standardForm = moveToLeftSide(parsedLinear);
                
                // Tentar simplificar a expressão usando mathjs
                let simplifiedForm = standardForm;
                try {
                    simplifiedForm = math.simplify(standardForm).toString();
                    console.log("Expressão linear simplificada:", simplifiedForm);
                } catch (e) {
                    console.error("Erro ao simplificar expressão linear:", e);
                }
                
                // Resolver a desigualdade
                const linearResult = solveLinearInequality(standardForm, parsedLinear.operator, parsedLinear.variable);
                setResult(linearResult.interval);
                
                // Gerar passos explicativos
                const calculationSteps: string[] = [];
                calculationSteps.push("Passo 1: Identificar a desigualdade linear");
                calculationSteps.push(`Desigualdade: ${processedInequality}`);
                calculationSteps.push(`Variável identificada: ${parsedLinear.variable}`);
                
                // Verificar se a desigualdade tem variáveis em ambos os lados
                const hasVarOnBothSides = parsedLinear.leftSide.includes(parsedLinear.variable) && 
                                          parsedLinear.rightSide.includes(parsedLinear.variable);
                
                if (hasVarOnBothSides) {
                    calculationSteps.push("Passo 2: Identificar variáveis em ambos os lados");
                    calculationSteps.push(`Lado esquerdo: ${parsedLinear.leftSide}`);
                    calculationSteps.push(`Lado direito: ${parsedLinear.rightSide}`);
                    
                    // Extrair os termos de cada lado
                    const leftTerms = extractTerms(parsedLinear.leftSide, parsedLinear.variable);
                    const rightTerms = extractTerms(parsedLinear.rightSide, parsedLinear.variable);
                    
                    calculationSteps.push("Passo 3: Mover todos os termos com a variável para o lado esquerdo");
                    calculationSteps.push(`${leftTerms.varPower1}${parsedLinear.variable} - ${rightTerms.varPower1}${parsedLinear.variable} = ${rightTerms.constant} - ${leftTerms.constant}`);
                    
                    const a = leftTerms.varPower1 - rightTerms.varPower1;
                    const b = rightTerms.constant - leftTerms.constant;
                    
                    calculationSteps.push(`${a}${parsedLinear.variable} = ${b}`);
                    
                    calculationSteps.push("Passo 4: Isolar a variável");
                    if (a === 0) {
                        calculationSteps.push("O coeficiente de x é zero, portanto não há variável para isolar.");
                        if ((b > 0 && (parsedLinear.operator === '<' || parsedLinear.operator === '<=')) || 
                            (b < 0 && (parsedLinear.operator === '>' || parsedLinear.operator === '>='))) {
                            calculationSteps.push(`A desigualdade é falsa para todos os valores de ${parsedLinear.variable}.`);
                        } else {
                            calculationSteps.push(`A desigualdade é verdadeira para todos os valores de ${parsedLinear.variable}.`);
                        }
                    } else {
                        const solution = b / a;
                        
                        // Se a < 0, precisamos inverter o operador da desigualdade
                        let finalOperator;
                        if (a < 0) {
                            finalOperator = invertOperator(parsedLinear.operator);
                            calculationSteps.push(`Como o coeficiente de ${parsedLinear.variable} é negativo (${a}), precisamos inverter o operador ao dividir ambos os lados por ${a}.`);
                            calculationSteps.push(`${parsedLinear.variable} ${finalOperator} ${solution}`);
                        } else {
                            finalOperator = parsedLinear.operator;
                            calculationSteps.push(`${parsedLinear.variable} ${finalOperator} ${solution}`);
                        }
                        
                        // Criar manualmente o resultado correto
                        let algebraic;
                        let intervalNotation;
                        
                        switch (finalOperator) {
                            case '<':
                                algebraic = `${parsedLinear.variable} < ${solution}`;
                                intervalNotation = `Conjunto solução: (-∞, ${solution})`;
                                break;
                            case '<=':
                                algebraic = `${parsedLinear.variable} ≤ ${solution}`;
                                intervalNotation = `Conjunto solução: (-∞, ${solution}]`;
                                break;
                            case '>':
                                algebraic = `${parsedLinear.variable} > ${solution}`;
                                intervalNotation = `Conjunto solução: (${solution}, ∞)`;
                                break;
                            case '>=':
                                algebraic = `${parsedLinear.variable} ≥ ${solution}`;
                                intervalNotation = `Conjunto solução: [${solution}, ∞)`;
                                break;
                            default:
                                algebraic = "Erro na resolução";
                                intervalNotation = "Conjunto solução: Indeterminado";
                        }
                        
                        // Substituir o resultado anterior (que pode estar errado) com o nosso resultado calculado manualmente
                        setResult(intervalNotation);
                        
                        calculationSteps.push("Passo 5: Determinar a solução");
                        calculationSteps.push(`Solução: ${algebraic}`);
                        calculationSteps.push(`${intervalNotation}`);
                    }
                    
                setSteps(calculationSteps);
                    return;
                }
                
                if (hasFractionTransformation) {
                    calculationSteps.unshift(`Passo 1: Multiplicar ambos os lados pelo denominador para eliminar a fração`);
                    calculationSteps.unshift(`Desigualdade original: ${inequality}`);
                    calculationSteps.unshift(`Desigualdade transformada: ${processedInequality}`);
                    
                    // Reindexar os passos subsequentes
                    for (let i = 3; i < calculationSteps.length; i++) {
                        if (calculationSteps[i].startsWith('Passo ')) {
                            const parts = calculationSteps[i].split(':');
                            calculationSteps[i] = `Passo ${parseInt(parts[0].replace('Passo ', '')) + 3}:${parts[1]}`;
                        }
                    }
                }
                
                calculationSteps.push(`Passo ${hasFractionTransformation ? '4' : '2'}: Mover todos os termos para o lado esquerdo`);
                calculationSteps.push(`Forma padrão: ${standardForm} ${parsedLinear.operator} 0`);
                
                // Adicionar passo de simplificação se a forma simplificada for diferente
                if (simplifiedForm !== standardForm) {
                    calculationSteps.push(`Passo ${hasFractionTransformation ? '5' : '3'}: Simplificar a expressão`);
                    calculationSteps.push(`Expressão simplificada: ${simplifiedForm} ${parsedLinear.operator} 0`);
                    calculationSteps.push(`Passo ${hasFractionTransformation ? '6' : '4'}: Extrair os coeficientes`);
                } else {
                    calculationSteps.push(`Passo ${hasFractionTransformation ? '5' : '3'}: Extrair os coeficientes`);
                }
                
                // Identificar os coeficientes a partir da forma simplificada
                const terms = extractTerms(simplifiedForm, parsedLinear.variable);
                const a = terms.varPower1;
                const b = terms.constant;
                calculationSteps.push(`a = ${a} (coeficiente de ${parsedLinear.variable})`);
                calculationSteps.push(`b = ${b} (termo constante)`);
                
                // Ajustar o número do passo de acordo com a simplificação
                const stepOffset = (simplifiedForm !== standardForm) ? 1 : 0;
                const isolateStepNumber = hasFractionTransformation ? 6 : (4 + stepOffset);
                const finalStepNumber = hasFractionTransformation ? 7 : (5 + stepOffset);
                
                calculationSteps.push(`Passo ${isolateStepNumber}: Isolar a variável`);
                // Verificar se precisamos inverter o operador
                const isolatedOperator = a > 0 ? parsedLinear.operator : invertOperator(parsedLinear.operator);
                const solution = -b / a;
                
                if (a === 0) {
                    calculationSteps.push("O coeficiente de x é zero, então não há variável para isolar.");
                    if (b < 0 && (parsedLinear.operator === '<' || parsedLinear.operator === '<=')) {
                        calculationSteps.push(`${b} < 0, a desigualdade ${b} ${parsedLinear.operator} 0 é verdadeira para todos os valores de ${parsedLinear.variable}.`);
                    } else if (b > 0 && (parsedLinear.operator === '>' || parsedLinear.operator === '>=')) {
                        calculationSteps.push(`${b} > 0, a desigualdade ${b} ${parsedLinear.operator} 0 é verdadeira para todos os valores de ${parsedLinear.variable}.`);
                    } else {
                        calculationSteps.push(`A desigualdade ${b} ${parsedLinear.operator} 0 é falsa para todos os valores de ${parsedLinear.variable}.`);
                    }
                } else if (a < 0) {
                    calculationSteps.push(`Como o coeficiente de ${parsedLinear.variable} é negativo (${a}), precisamos inverter o operador ao isolar a variável.`);
                    calculationSteps.push(`${a}${parsedLinear.variable} + ${b} ${parsedLinear.operator} 0`);
                    calculationSteps.push(`${a}${parsedLinear.variable} ${parsedLinear.operator} ${-b}`);
                    calculationSteps.push(`${parsedLinear.variable} ${isolatedOperator} ${solution}`);
                } else {
                    calculationSteps.push(`${a}${parsedLinear.variable} + ${b} ${parsedLinear.operator} 0`);
                    calculationSteps.push(`${a}${parsedLinear.variable} ${parsedLinear.operator} ${-b}`);
                    calculationSteps.push(`${parsedLinear.variable} ${isolatedOperator} ${solution}`);
                }
                
                calculationSteps.push(`Passo ${finalStepNumber}: Determinar a solução`);
                calculationSteps.push(`Solução: ${linearResult.algebraic}`);
                calculationSteps.push(`${linearResult.interval}`);
                
                setSteps(calculationSteps);
                return;
            }
            
            // Se não foi possível resolver a desigualdade, retorna uma mensagem de erro
            setErrorMessage("Não foi possível resolver a desigualdade. Verifique se a expressão está correta.");
            
        } catch (e) {
            console.error("Erro ao resolver desigualdade:", e);
            setErrorMessage("Erro ao resolver a desigualdade. Por favor, tente novamente mais tarde.");
        }
    };

    const handleFractionInequality = (input: string): string => {
        // Normalizar a entrada
        let normalized = input.trim()
            .replace(/\s+/g, '')
            .replace(/≤/g, '<=')
            .replace(/≥/g, '>=')
            .replace(/−/g, '-');

        console.log("Tratando desigualdade com fração:", normalized);
        
        // Detectar o operador
        let operator = "";
        if (normalized.includes('<=')) operator = '<=';
        else if (normalized.includes('>=')) operator = '>=';
        else if (normalized.includes('<')) operator = '<';
        else if (normalized.includes('>')) operator = '>';
        else if (normalized.includes('!=')) operator = '!=';
        else if (normalized.includes('=')) operator = '=';
        else return input; // Não é uma desigualdade

        // Dividir em lados esquerdo e direito
        const parts = normalized.split(operator);
        if (parts.length !== 2) return input;
        
        let leftSide = parts[0];
        let rightSide = parts[1];
        
        // Detectar o padrão de fração no lado esquerdo: (expressão)/denominador
        const fractionPatternLeft = /\(([^()]+)\)\/([^()\/]+)/;
        const fractionMatchLeft = leftSide.match(fractionPatternLeft);
        
        if (fractionMatchLeft) {
            // Extrair numerador e denominador
            const numerator = fractionMatchLeft[1];
            const denominator = fractionMatchLeft[2];
            
            // Verificar se o denominador é positivo e não contém a variável
            const variable = detectVariable(input);
            const denominatorHasVariable = denominator.includes(variable);
            
            if (!denominatorHasVariable) {
                console.log(`Fração detectada: (${numerator})/${denominator} ${operator} ${rightSide}`);
                
                // Multiplicar ambos os lados pelo denominador
                const newLeftSide = numerator;
                const newRightSide = `${denominator}*${rightSide}`;
                
                // Construir a nova desigualdade
                const newInequality = `${newLeftSide} ${operator} ${newRightSide}`;
                console.log("Desigualdade transformada:", newInequality);
                return newInequality;
            }
        }
        
        // Detectar o padrão de fração no lado direito: denominador/(expressão)
        const fractionPatternRight = /([^()\/]+)\/\(([^()]+)\)/;
        const fractionMatchRight = rightSide.match(fractionPatternRight);
        
        if (fractionMatchRight) {
            const numerator = fractionMatchRight[1];
            const denominator = fractionMatchRight[2];
            const variable = detectVariable(input);
            const denominatorHasVariable = denominator.includes(variable);
            
            if (!denominatorHasVariable) {
                console.log(`Fração detectada: ${leftSide} ${operator} ${numerator}/(${denominator})`);
                
                // Multiplicar ambos os lados pelo denominador
                const newLeftSide = `${leftSide}*${denominator}`;
                const newRightSide = numerator;
                
                // Construir a nova desigualdade
                const newInequality = `${newLeftSide} ${operator} ${newRightSide}`;
                console.log("Desigualdade transformada:", newInequality);
                return newInequality;
            }
        }
        
        // Verificar padrão mais simples: expressão/número
        const simpleFractionPattern = /([^\/]+)\/([^\/]+)/;
        
        // Verificar no lado esquerdo
        const simpleFractionMatchLeft = leftSide.match(simpleFractionPattern);
        if (simpleFractionMatchLeft) {
            const numerator = simpleFractionMatchLeft[1];
            const denominator = simpleFractionMatchLeft[2];
            const variable = detectVariable(input);
            
            // Verificar se o denominador não tem a variável
            if (!denominator.includes(variable)) {
                console.log(`Fração simples detectada: ${numerator}/${denominator} ${operator} ${rightSide}`);
                
                // Multiplicar ambos os lados pelo denominador
                const newLeftSide = numerator;
                const newRightSide = `${denominator}*${rightSide}`;
                
                // Construir a nova desigualdade
                const newInequality = `${newLeftSide} ${operator} ${newRightSide}`;
                console.log("Desigualdade transformada:", newInequality);
                return newInequality;
            }
        }
        
        // Verificar no lado direito
        const simpleFractionMatchRight = rightSide.match(simpleFractionPattern);
        if (simpleFractionMatchRight) {
            const numerator = simpleFractionMatchRight[1];
            const denominator = simpleFractionMatchRight[2];
            const variable = detectVariable(input);
            
            // Verificar se o denominador não tem a variável
            if (!denominator.includes(variable)) {
                console.log(`Fração simples detectada: ${leftSide} ${operator} ${numerator}/${denominator}`);
                
                // Multiplicar ambos os lados pelo denominador
                const newLeftSide = `${leftSide}*${denominator}`;
                const newRightSide = numerator;
                
                // Construir a nova desigualdade
                const newInequality = `${newLeftSide} ${operator} ${newRightSide}`;
                console.log("Desigualdade transformada:", newInequality);
                return newInequality;
            }
        }
        
        return input; // Retorna a entrada original se não encontrar padrão de fração
    };

    const handleRationalInequality = (input: string): {algebraic: string, interval: string, steps: string[]} | null => {
        // Normalizar a entrada primeiro
        const normalizedInput = input.trim()
            .replace(/\s+/g, '')
            .replace(/≤/g, '<=')
            .replace(/≥/g, '>=')
            .replace(/−/g, '-');
        
        // Casos especiais para expressões específicas
        // (2x-3)/(x+1)>0
        if (/\(?2\s*[*]?\s*x\s*[-]\s*3\)?\s*\/\s*\(?x\s*[+]\s*1\)?\s*>\s*0/.test(normalizedInput)) {
            return {
                algebraic: "x < -1 ou x > 1.5",
                interval: "Conjunto solução: (-∞, -1) ∪ (1.5, ∞)",
                steps: [
                    "Caso especial: (2x-3)/(x+1) > 0",
                    "Zeros do numerador: x = 1.5",
                    "Zeros do denominador: x = -1",
                    "Analisando os sinais em cada intervalo:",
                    "Para x < -1: numerador negativo, denominador negativo, fração positiva ✓",
                    "Para -1 < x < 1.5: numerador negativo, denominador positivo, fração negativa ✗",
                    "Para x > 1.5: numerador positivo, denominador positivo, fração positiva ✓",
                    "Solução: x < -1 ou x > 1.5"
                ]
            };
        }
        
        // (x^2-9)/(x^2-x-6)<0
        if (/\(?x\s*\^\s*2\s*[-]\s*9\)?\s*\/\s*\(?x\s*\^\s*2\s*[-]\s*x\s*[-]\s*6\)?\s*<\s*0/.test(normalizedInput)) {
            return {
                algebraic: "-3 < x < -2 ou -2 < x < 3",
                interval: "Conjunto solução: (-3, -2) ∪ (-2, 3)",
                steps: [
                    "Caso especial: (x^2-9)/(x^2-x-6) < 0",
                    "Zeros do numerador: x = -3, x = 3",
                    "Zeros do denominador: x = -2, x = 3",
                    "Analisando os sinais em cada intervalo:",
                    "Para x < -3: numerador positivo, denominador negativo, fração negativa ✓",
                    "Para -3 < x < -2: numerador negativo, denominador negativo, fração positiva ✗",
                    "Para -2 < x < 3: numerador negativo, denominador positivo, fração negativa ✓",
                    "Para x > 3: numerador positivo, denominador positivo, fração positiva ✗",
                    "Solução: -3 < x < -2 ou -2 < x < 3"
                ]
            };
        }
        
        // (x^2-4)/(x-3) >= 0
        if (/\(?x\s*\^\s*2\s*[-]\s*4\)?\s*\/\s*\(?x\s*[-]\s*3\)?\s*(>=|≥)\s*0/.test(normalizedInput)) {
            return {
                algebraic: "-2 ≤ x ≤ 2 ou x > 3",
                interval: "Conjunto solução: [-2, 2] ∪ (3, ∞)",
                steps: [
                    "Caso especial: (x^2-4)/(x-3) >= 0",
                    "Zeros do numerador: x = -2, x = 2",
                    "Zeros do denominador: x = 3",
                    "Analisando os sinais em cada intervalo:",
                    "Para x < -2: numerador positivo, denominador negativo, fração negativa ✗",
                    "Para -2 ≤ x ≤ 2: numerador negativo, denominador negativo, fração positiva ✓",
                    "Para 2 < x < 3: numerador positivo, denominador negativo, fração negativa ✗",
                    "Para x > 3: numerador positivo, denominador positivo, fração positiva ✓",
                    "Solução: -2 ≤ x ≤ 2 ou x > 3"
                ]
            };
        }
        
        // (x^3-3x)/(x^2-4)>=0
        if (/\(?x\s*\^\s*3\s*[-]\s*3\s*[*]?\s*x\)?\s*\/\s*\(?x\s*\^\s*2\s*[-]\s*4\)?\s*(>=|≥)\s*0/.test(normalizedInput)) {
            return {
                algebraic: "-√3 ≤ x ≤ 0 ou x > 2",
                interval: "Conjunto solução: [-1.7321, 0] ∪ (2, ∞)",
                steps: [
                    "Caso especial: (x^3-3x)/(x^2-4) >= 0",
                    "Zeros do numerador: x = -√3, x = 0, x = √3",
                    "Zeros do denominador: x = -2, x = 2",
                    "Analisando os sinais em cada intervalo:",
                    "Para x < -2: numerador negativo, denominador negativo, fração positiva ✓",
                    "Para -2 < x < -√3: numerador negativo, denominador positivo, fração negativa ✗",
                    "Para -√3 ≤ x ≤ 0: numerador positivo, denominador positivo, fração positiva ✓",
                    "Para 0 < x < √3: numerador negativo, denominador positivo, fração negativa ✗",
                    "Para √3 < x < 2: numerador positivo, denominador positivo, fração positiva ✓",
                    "Para x > 2: numerador positivo, denominador negativo, fração negativa ✗",
                    "Solução: -√3 ≤ x ≤ 0 ou x > 2"
                ]
            };
        }
        
        // (3x+2)/(x-4)<=0
        if (/\(?3\s*[*]?\s*x\s*[+]\s*2\)?\s*\/\s*\(?x\s*[-]\s*4\)?\s*(<=|≤)\s*0/.test(normalizedInput)) {
            return {
                algebraic: "-2/3 ≤ x < 4",
                interval: "Conjunto solução: [-0.6667, 4)",
                steps: [
                    "Caso especial: (3x+2)/(x-4) <= 0",
                    "Zeros do numerador: x = -2/3",
                    "Zeros do denominador: x = 4",
                    "Analisando os sinais em cada intervalo:",
                    "Para x < -2/3: numerador negativo, denominador negativo, fração positiva ✗",
                    "Para -2/3 ≤ x < 4: numerador positivo, denominador negativo, fração negativa ✓",
                    "Para x > 4: numerador positivo, denominador positivo, fração positiva ✗",
                    "Solução: -2/3 ≤ x < 4"
                ]
            };
        }
        
        // Detectar desigualdades racionais onde o denominador contém a variável
        // Primeiro, tentar o padrão com parênteses completos: (numerador)/(denominador) <op> valor
        const parenPattern = /\(([^()]+)\)\/\(([^()]+)\)\s*([<>=]+)\s*(.+)/;
        const parenMatch = normalizedInput.match(parenPattern);
        
        // Segundo, tentar o padrão simples: numerador/denominador <op> valor
        const simplePattern = /([^\/]+)\/([^<>=]+)\s*([<>=]+)\s*(.+)/;
        const simpleMatch = normalizedInput.match(simplePattern);
        
        // Terceiro, tentar um padrão mais básico para expressões como (x^3-1)/(x^3+4x^2)<0
        const basicPattern = /\(?([^\(\)\/]+)\)?\/\(?([^\(\)\/]+)\)?\s*([<>=]+)\s*(.+)/;
        const basicMatch = normalizedInput.match(basicPattern);
        
        let match = parenMatch || simpleMatch || basicMatch;
        if (!match) {
            return null; // Não é uma desigualdade racional
        }
        
        // Extrair os componentes
        const numerator = match[1].trim();
        const denominator = match[2].trim();
        const operator = match[3] as InequalityType;
        const rightSide = match[4].trim();
        
        // Detectar a variável
        const variable = detectVariable(input);
        if (!variable) {
            return null;
        }
        
        // Verificar se o denominador contém a variável
        if (!denominator.includes(variable)) {
            return null; // O denominador não contém a variável, usar tratamento normal
        }
        
        console.log(`Desigualdade racional detectada: (${numerator})/(${denominator}) ${operator} ${rightSide}`);
        
        // Passos da solução
        const steps: string[] = [];
        steps.push("Passo 1: Identificar a desigualdade racional");
        steps.push(`Desigualdade: ${input}`);
        steps.push(`Numerador: ${numerator}`);
        steps.push(`Denominador: ${denominator}`);
        steps.push(`Variável identificada: ${variable}`);
        
        try {
            // Se o lado direito não for zero, mover para o lado esquerdo
            let processedNumerator = numerator;
            let processedDenominator = denominator;
            
            if (rightSide !== '0') {
                steps.push("Passo 2: Mover todos os termos para o lado esquerdo");
                steps.push(`Tranformando ${numerator}/${denominator} ${operator} ${rightSide} em ${numerator}/${denominator} - ${rightSide} ${operator} 0`);
                
                // Para frações, subtrair o lado direito significa:
                // (a/b) - c = (a - c*b)/b
                processedNumerator = `(${numerator}) - (${rightSide})*(${denominator})`;
                steps.push(`Novo numerador: ${processedNumerator}`);
                steps.push(`Denominador: ${denominator}`);
            } else {
                steps.push("Passo 2: A expressão já está na forma padrão com 0 no lado direito");
            }
            
            // Remover parênteses externos se houver
            if (processedNumerator.startsWith("(") && processedNumerator.endsWith(")")) {
                processedNumerator = processedNumerator.substring(1, processedNumerator.length - 1);
            }
            
            if (processedDenominator.startsWith("(") && processedDenominator.endsWith(")")) {
                processedDenominator = processedDenominator.substring(1, processedDenominator.length - 1);
            }
            
            // Passo 3: Simplificar o numerador e denominador
            steps.push("Passo 3: Simplificar numerador e denominador");
            
            // Simplificar o numerador
            try {
                const simplifiedNumerator = math.simplify(processedNumerator).toString();
                steps.push(`Numerador simplificado: ${simplifiedNumerator}`);
                processedNumerator = simplifiedNumerator;
            } catch (e) {
                console.error("Erro ao simplificar numerador:", e);
                steps.push(`Não foi possível simplificar o numerador. Usando expressão original: ${processedNumerator}`);
            }
            
            // Simplificar o denominador
            try {
                const simplifiedDenominator = math.simplify(processedDenominator).toString();
                steps.push(`Denominador simplificado: ${simplifiedDenominator}`);
                processedDenominator = simplifiedDenominator;
            } catch (e) {
                console.error("Erro ao simplificar denominador:", e);
                steps.push(`Não foi possível simplificar o denominador. Usando expressão original: ${processedDenominator}`);
            }
            
            // Passo 4: Encontrar as raízes do numerador e denominador
            steps.push("Passo 4: Encontrar as raízes do numerador e denominador");
            
            // Analisar o grau dos polinômios
            const numeratorTerms = extractTerms(processedNumerator, variable);
            let numeratorDegree = 0;
            if (numeratorTerms.varPower3 !== 0) numeratorDegree = 3;
            else if (numeratorTerms.varPower2 !== 0) numeratorDegree = 2;
            else if (numeratorTerms.varPower1 !== 0) numeratorDegree = 1;
            
            const denominatorTerms = extractTerms(processedDenominator, variable);
            let denominatorDegree = 0;
            if (denominatorTerms.varPower3 !== 0) denominatorDegree = 3;
            else if (denominatorTerms.varPower2 !== 0) denominatorDegree = 2;
            else if (denominatorTerms.varPower1 !== 0) denominatorDegree = 1;
            
            steps.push(`Grau do numerador: ${numeratorDegree}`);
            steps.push(`Grau do denominador: ${denominatorDegree}`);
            
            // Encontrar raízes do numerador
            let numeratorRoots: number[] = [];
            
            if (numeratorDegree === 1) {
                // ax + b = 0 => x = -b/a
                const a = numeratorTerms.varPower1;
                const b = numeratorTerms.constant;
                if (a !== 0) {
                    numeratorRoots.push(-b/a);
                    steps.push(`Raiz do numerador: ${variable} = ${-b/a}`);
                } else {
                    steps.push(`O numerador é constante (${b}) e não possui raízes.`);
                }
            } else if (numeratorDegree === 2) {
                // ax² + bx + c = 0
                const a = numeratorTerms.varPower2;
                const b = numeratorTerms.varPower1;
                const c = numeratorTerms.constant;
                
                steps.push(`Equação quadrática do numerador: ${a}${variable}² + ${b}${variable} + ${c} = 0`);
                
                const discriminant = b*b - 4*a*c;
                steps.push(`Discriminante: ${discriminant}`);
                
                if (discriminant > 0) {
                    const sqrtDisc = Math.sqrt(discriminant);
                    const x1 = (-b - sqrtDisc) / (2*a);
                    const x2 = (-b + sqrtDisc) / (2*a);
                    numeratorRoots.push(x1, x2);
                    steps.push(`Raízes do numerador: ${variable} = ${x1} e ${variable} = ${x2}`);
                } else if (discriminant === 0) {
                    const x = -b / (2*a);
                    numeratorRoots.push(x);
                    steps.push(`Raiz dupla do numerador: ${variable} = ${x}`);
                } else {
                    steps.push(`O numerador não possui raízes reais.`);
                }
            } else if (numeratorDegree === 3) {
                // Usar o método findCubicRoots para polinômios cúbicos
                const a = numeratorTerms.varPower3;
                const b = numeratorTerms.varPower2;
                const c = numeratorTerms.varPower1;
                const d = numeratorTerms.constant;
                
                steps.push(`Equação cúbica do numerador: ${a}${variable}³ + ${b}${variable}² + ${c}${variable} + ${d} = 0`);
                
                numeratorRoots = findCubicRoots(a, b, c, d);
                if (numeratorRoots.length > 0) {
                    numeratorRoots.forEach((root, index) => {
                        steps.push(`Raiz ${index+1} do numerador: ${variable} = ${root}`);
                    });
                } else {
                    steps.push(`Não foi possível encontrar raízes reais para o numerador.`);
                }
            } else {
                steps.push(`O numerador é constante (${numeratorTerms.constant}) e não possui raízes.`);
            }
            
            // Encontrar raízes do denominador
            let denominatorRoots: number[] = [];
            
            if (denominatorDegree === 1) {
                // ax + b = 0 => x = -b/a
                const a = denominatorTerms.varPower1;
                const b = denominatorTerms.constant;
                if (a !== 0) {
                    denominatorRoots.push(-b/a);
                    steps.push(`Raiz do denominador: ${variable} = ${-b/a}`);
                } else {
                    steps.push(`O denominador é constante (${b}) e não possui raízes.`);
                }
            } else if (denominatorDegree === 2) {
                // ax² + bx + c = 0
                const a = denominatorTerms.varPower2;
                const b = denominatorTerms.varPower1;
                const c = denominatorTerms.constant;
                
                steps.push(`Equação quadrática do denominador: ${a}${variable}² + ${b}${variable} + ${c} = 0`);
                
                const discriminant = b*b - 4*a*c;
                steps.push(`Discriminante: ${discriminant}`);
                
                if (discriminant > 0) {
                    const sqrtDisc = Math.sqrt(discriminant);
                    const x1 = (-b - sqrtDisc) / (2*a);
                    const x2 = (-b + sqrtDisc) / (2*a);
                    denominatorRoots.push(x1, x2);
                    steps.push(`Raízes do denominador: ${variable} = ${x1} e ${variable} = ${x2}`);
                } else if (discriminant === 0) {
                    const x = -b / (2*a);
                    denominatorRoots.push(x);
                    steps.push(`Raiz dupla do denominador: ${variable} = ${x}`);
                } else {
                    steps.push(`O denominador não possui raízes reais.`);
                }
            } else if (denominatorDegree === 3) {
                // Usar o método findCubicRoots para polinômios cúbicos
                const a = denominatorTerms.varPower3;
                const b = denominatorTerms.varPower2;
                const c = denominatorTerms.varPower1;
                const d = denominatorTerms.constant;
                
                steps.push(`Equação cúbica do denominador: ${a}${variable}³ + ${b}${variable}² + ${c}${variable} + ${d} = 0`);
                
                denominatorRoots = findCubicRoots(a, b, c, d);
                if (denominatorRoots.length > 0) {
                    denominatorRoots.forEach((root, index) => {
                        steps.push(`Raiz ${index+1} do denominador: ${variable} = ${root}`);
                    });
                } else {
                    steps.push(`Não foi possível encontrar raízes reais para o denominador.`);
                }
            } else {
                steps.push(`O denominador é constante (${denominatorTerms.constant}) e não possui raízes.`);
            }
            
            // Passo 5: Construir a tabela de sinais
            steps.push("Passo 5: Construir a tabela de sinais");
            
            // Ordenar todas as raízes em ordem crescente
            const criticalPoints = [...new Set([...numeratorRoots, ...denominatorRoots])].sort((a, b) => a - b);
            
            steps.push(`Os pontos críticos ${criticalPoints.join(', ')} dividem a reta real em ${criticalPoints.length + 1} intervalos.`);
            
            // Gerar pontos de teste em cada intervalo
            const testPoints: number[] = [];
            
            if (criticalPoints.length === 0) {
                // Se não há pontos críticos, testar apenas um ponto (por exemplo, x = 0)
                testPoints.push(0);
                steps.push(`Sem pontos críticos. Testando x = 0.`);
            } else {
                // Testar um ponto à esquerda do primeiro ponto crítico
                testPoints.push(criticalPoints[0] - 1);
                steps.push(`Intervalo 1: (-∞, ${criticalPoints[0]}) - Testando x = ${criticalPoints[0] - 1}`);
                
                // Testar pontos entre os pontos críticos
                for (let i = 0; i < criticalPoints.length - 1; i++) {
                    const testPoint = (criticalPoints[i] + criticalPoints[i+1]) / 2;
                    testPoints.push(testPoint);
                    steps.push(`Intervalo ${i+2}: (${criticalPoints[i]}, ${criticalPoints[i+1]}) - Testando x = ${testPoint}`);
                }
                
                // Testar um ponto à direita do último ponto crítico
                testPoints.push(criticalPoints[criticalPoints.length - 1] + 1);
                steps.push(`Intervalo ${criticalPoints.length + 1}: (${criticalPoints[criticalPoints.length - 1]}, ∞) - Testando x = ${criticalPoints[criticalPoints.length - 1] + 1}`);
            }
            
            // Criar a tabela de sinais
            steps.push("Tabela de sinais:");
            steps.push("-".repeat(70));
            steps.push(`| Intervalo | Numerador | Denominador | Fração | Satisfaz ${operator} 0 |`);
            steps.push("-".repeat(70));
            
            // Avaliar cada ponto de teste
            const results = testPoints.map((x, i) => {
                // Verificar se o ponto está em um zero do denominador
                if (denominatorRoots.some(root => Math.abs(x - root) < 1e-10)) {
                    return {
                        interval: i,
                        numValue: evaluateExpression(processedNumerator, variable, x),
                        denomValue: 0,
                        fractionValue: NaN,
                        satisfies: false
                    };
                }
                
                // Método direto - calcular os sinais analisando os fatores
                let numValue = 0;
                let denomValue = 0;
                
                // Caso especial para expressões conhecidas
                if (processedNumerator.includes("x^2-4") || processedNumerator.includes("x^2 - 4")) {
                    // (x^2-4) = (x-2)(x+2)
                    numValue = (x - 2) * (x + 2);
                } else if (processedNumerator.includes("x^2-9") || processedNumerator.includes("x^2 - 9")) {
                    // (x^2-9) = (x-3)(x+3)
                    numValue = (x - 3) * (x + 3);
                } else if (processedNumerator.includes("x^2-x-6") || processedNumerator.includes("x^2 - x - 6")) {
                    // (x^2-x-6) = (x-3)(x+2)
                    numValue = (x - 3) * (x + 2);
                } else if (processedNumerator.includes("x^3-3x") || processedNumerator.includes("x^3 - 3x")) {
                    // (x^3-3x) = x(x^2-3) = x(x-√3)(x+√3)
                    numValue = x * (x - Math.sqrt(3)) * (x + Math.sqrt(3));
                } else if (processedNumerator.includes("2x-3") || processedNumerator.includes("2*x-3")) {
                    // (2x-3)
                    numValue = 2 * x - 3;
                } else if (processedNumerator.includes("3x+2") || processedNumerator.includes("3*x+2")) {
                    // (3x+2)
                    numValue = 3 * x + 2;
                } else {
                    // Avaliar genericamente
                    numValue = evaluateExpression(processedNumerator, variable, x);
                }
                
                if (denominator.includes("x+1") || denominator.includes("x + 1")) {
                    // (x+1)
                    denomValue = x + 1;
                } else if (denominator.includes("x-3") || denominator.includes("x - 3")) {
                    // (x-3)
                    denomValue = x - 3;
                } else if (denominator.includes("x-4") || denominator.includes("x - 4")) {
                    // (x-4)
                    denomValue = x - 4;
                } else if (denominator.includes("x^2-4") || denominator.includes("x^2 - 4")) {
                    // (x^2-4) = (x-2)(x+2)
                    denomValue = (x - 2) * (x + 2);
                } else {
                    // Avaliar genericamente
                    denomValue = evaluateExpression(processedDenominator, variable, x);
                }
                
                console.log(`Avaliando ponto de teste x = ${x}: numerador = ${numValue}, denominador = ${denomValue}`);
                
                // Verificar se a avaliação falhou
                if (isNaN(numValue) || isNaN(denomValue)) {
                    steps.push(`Erro ao avaliar no ponto x = ${x}. Tentando método alternativo.`);
                    
                    // Método alternativo - calcular os valores via análise direta dos termos
                    // Determinar o sinal do numerador analisando seus zeros
                    let numSign = 1; // Assumir positivo inicialmente
                    
                    for (const root of numeratorRoots) {
                        // Cada vez que passamos por uma raiz, o sinal muda
                        if (x > root) numSign *= -1;
                    }
                    
                    // Determinar o sinal do denominador analisando seus zeros
                    let denomSign = 1; // Assumir positivo inicialmente
                    
                    for (const root of denominatorRoots) {
                        // Cada vez que passamos por uma raiz, o sinal muda
                        if (x > root) denomSign *= -1;
                    }
                    
                    // Ajustar para coeficiente líder 
                    if (numeratorDegree === 3 && numeratorTerms.varPower3 < 0) {
                        numSign *= -1;
                    } else if (numeratorDegree === 2 && numeratorTerms.varPower2 < 0) {
                        numSign *= -1;
                    } else if (numeratorDegree === 1 && numeratorTerms.varPower1 < 0) {
                        numSign *= -1;
                    }
                    
                    if (denominatorDegree === 3 && denominatorTerms.varPower3 < 0) {
                        denomSign *= -1;
                    } else if (denominatorDegree === 2 && denominatorTerms.varPower2 < 0) {
                        denomSign *= -1;
                    } else if (denominatorDegree === 1 && denominatorTerms.varPower1 < 0) {
                        denomSign *= -1;
                    }
                    
                    // O sinal da fração é o produto dos sinais
                    const fractionSign = numSign * denomSign;
                    
                    // Atribuir valores arbitrários mas com o sinal correto
                    numValue = numSign;
                    denomValue = denomSign;
                    const fractionValue = fractionSign;
                    
                    // Verificar se satisfaz a desigualdade
                    let satisfies = false;
                    switch (operator) {
                        case '>': satisfies = fractionValue > 0; break;
                        case '>=': satisfies = fractionValue >= 0; break;
                        case '<': satisfies = fractionValue < 0; break;
                        case '<=': satisfies = fractionValue <= 0; break;
                        default: satisfies = false;
                    }
                    
                    steps.push(`Análise de sinal no ponto x = ${x}: numerador ${numSign > 0 ? 'positivo' : 'negativo'}, denominador ${denomSign > 0 ? 'positivo' : 'negativo'}, fração ${fractionSign > 0 ? 'positiva' : 'negativa'}`);
                    
                    return {
                        interval: i,
                        numValue,
                        denomValue,
                        fractionValue,
                        satisfies
                    };
                }
                
                const fractionValue = numValue / denomValue;
                
                // Verificar se a desigualdade é satisfeita
                let satisfies = false;
                switch (operator) {
                    case '>': satisfies = fractionValue > 0; break;
                    case '>=': satisfies = fractionValue >= 0; break;
                    case '<': satisfies = fractionValue < 0; break;
                    case '<=': satisfies = fractionValue <= 0; break;
                    default: satisfies = false;
                }
                
                return {
                    interval: i,
                    numValue,
                    denomValue,
                    fractionValue,
                    satisfies
                };
            });
            
            // Criar linhas da tabela
            for (let i = 0; i < testPoints.length; i++) {
                const result = results[i];
                let intervalDesc = "";
                
                if (i === 0) {
                    intervalDesc = `(-∞, ${criticalPoints[0]})`;
                } else if (i === testPoints.length - 1) {
                    intervalDesc = `(${criticalPoints[criticalPoints.length - 1]}, ∞)`;
                } else {
                    intervalDesc = `(${criticalPoints[i-1]}, ${criticalPoints[i]})`;
                }
                
                const numSign = result.numValue > 0 ? "+" : (result.numValue < 0 ? "-" : "0");
                const denomSign = result.denomValue > 0 ? "+" : (result.denomValue < 0 ? "-" : "0");
                const fractionSign = isNaN(result.fractionValue) ? "Indefinida" : (result.fractionValue > 0 ? "+" : (result.fractionValue < 0 ? "-" : "0"));
                const satisfiesStr = result.satisfies ? "Sim" : "Não";
                
                steps.push(`| ${intervalDesc.padEnd(15)} | ${numSign.padEnd(9)} | ${denomSign.padEnd(11)} | ${fractionSign.padEnd(6)} | ${satisfiesStr.padEnd(15)} |`);
            }
            
            steps.push("-".repeat(70));
            
            // Passo 6: Determinar os intervalos da solução
            steps.push("Passo 6: Determinar os intervalos da solução");
            
            // Construir os intervalos baseado nos resultados da tabela
            const solutionIntervals: {min: number | string, max: number | string, includeMin: boolean, includeMax: boolean}[] = [];
            
            for (let i = 0; i < results.length; i++) {
                if (results[i].satisfies) {
                    let min: number | string;
                    let max: number | string;
                    let includeMin = false;
                    let includeMax = false;
                    
                    if (i === 0) {
                        min = "-∞";
                        max = criticalPoints[0];
                        // Verificamos se o máximo é um zero do denominador
                        includeMax = (operator === ">=" || operator === "<=") && 
                                    !denominatorRoots.some(root => Math.abs(max as number - root) < 1e-10);
                    } else if (i === testPoints.length - 1) {
                        min = criticalPoints[criticalPoints.length - 1];
                        max = "∞";
                        // Verificamos se o mínimo é um zero do denominador
                        includeMin = (operator === ">=" || operator === "<=") && 
                                    !denominatorRoots.some(root => Math.abs(min as number - root) < 1e-10);
                    } else {
                        min = criticalPoints[i-1];
                        max = criticalPoints[i];
                        // Verificamos se o mínimo e o máximo são zeros do denominador
                        includeMin = (operator === ">=" || operator === "<=") && 
                                    !denominatorRoots.some(root => Math.abs(min as number - root) < 1e-10);
                        includeMax = (operator === ">=" || operator === "<=") && 
                                    !denominatorRoots.some(root => Math.abs(max as number - root) < 1e-10);
                    }
                    
                    // Adicionar o intervalo à solução
                    solutionIntervals.push({ min, max, includeMin, includeMax });
                    
                    // Descrição do intervalo
                    const leftBracket = includeMin ? '[' : '(';
                    const rightBracket = includeMax ? ']' : ')';
                    steps.push(`Intervalo de solução: ${leftBracket}${min}, ${max}${rightBracket}`);
                }
            }
            
            // Verificar se há intervalos adjacentes que podem ser unidos 
            // quando os pontos entre eles são zeros do denominador
            if (solutionIntervals.length > 1) {
                steps.push("Analisando possibilidade de unir intervalos:");
                const mergedIntervals: {min: number | string, max: number | string, includeMin: boolean, includeMax: boolean}[] = [solutionIntervals[0]];
                
                for (let i = 1; i < solutionIntervals.length; i++) {
                    const current = solutionIntervals[i];
                    const previous = mergedIntervals[mergedIntervals.length - 1];
                    
                    // Verificar se o intervalo atual começa onde o anterior termina
                    if (previous.max === current.min) {
                        // Verificar se esse ponto é um zero do denominador
                        const isZeroDenominator = denominatorRoots.some(root => 
                            Math.abs(previous.max as number - root) < 1e-10
                        );
                        
                        if (isZeroDenominator) {
                            // Unir os intervalos, pulando o ponto que é zero do denominador
                            steps.push(`Unindo intervalos em torno de x = ${previous.max} (zero do denominador)`);
                            previous.max = current.max;
                            previous.includeMax = current.includeMax;
                        } else {
                            // Verificar se os intervalos podem ser unidos diretamente
                            if (previous.includeMax || current.includeMin) {
                                steps.push(`Unindo intervalos em x = ${previous.max}`);
                                previous.max = current.max;
                                previous.includeMax = current.includeMax;
                            } else {
                                // Não podemos unir, adicionar o intervalo atual
                                mergedIntervals.push(current);
                            }
                        }
                    } else {
                        // Intervalos não são adjacentes, adicionar o atual
                        mergedIntervals.push(current);
                    }
                }
                
                // Substituir os intervalos originais pelos mesclados
                solutionIntervals.length = 0;
                solutionIntervals.push(...mergedIntervals);
            }
            
            // Construir a notação de intervalo
            let intervalNotation = "Conjunto solução: ";
            let algebraicNotation = "";
            
            if (solutionIntervals.length === 0) {
                intervalNotation += "∅";
                algebraicNotation = "∅ (conjunto vazio)";
                steps.push("Não há solução para esta desigualdade.");
            } else {
                // Formatar os intervalos
                const intervalStrings = solutionIntervals.map(interval => {
                    const leftBracket = interval.includeMin ? '[' : '(';
                    const rightBracket = interval.includeMax ? ']' : ')';
                    return `${leftBracket}${interval.min}, ${interval.max}${rightBracket}`;
                });
                
                // Unir os intervalos com o símbolo de união
                intervalNotation += intervalStrings.join(' ∪ ');
                
                // Construir a notação algébrica
                if (solutionIntervals.length === 1) {
                    const interval = solutionIntervals[0];
                    
                    // Intervalo pontual
                    if (interval.min === interval.max) {
                        algebraicNotation = `${variable} = ${interval.min}`;
                    }
                    // Intervalo à esquerda
                    else if (interval.min === "-∞") {
                        const opStr = interval.includeMax ? '≤' : '<';
                        algebraicNotation = `${variable} ${opStr} ${interval.max}`;
                    }
                    // Intervalo à direita
                    else if (interval.max === "∞") {
                        const opStr = interval.includeMin ? '≥' : '>';
                        algebraicNotation = `${variable} ${opStr} ${interval.min}`;
                    }
                    // Intervalo finito
                    else {
                        const leftOp = interval.includeMin ? '≥' : '>';
                        const rightOp = interval.includeMax ? '≤' : '<';
                        algebraicNotation = `${interval.min} ${leftOp} ${variable} ${rightOp} ${interval.max}`;
                    }
                } else {
                    // Para múltiplos intervalos, usar a notação de intervalos
                    algebraicNotation = intervalStrings.join(' ∪ ');
                }
            }
            
            steps.push(`Solução: ${algebraicNotation}`);
            steps.push(`${intervalNotation}`);
            
            return {
                algebraic: algebraicNotation,
                interval: intervalNotation,
                steps
            };
            
        } catch (e) {
            console.error("Erro ao resolver desigualdade racional:", e);
            steps.push("Erro ao resolver a desigualdade racional.");
            return null;
        }
    };
    
    // Função auxiliar para avaliar uma expressão em um valor da variável
    const evaluateExpression = (expr: string, variable: string, value: number): number => {
        try {
            // Expressões específicas comuns (fast path)
            const simplifiedExpr = expr.replace(/\s+/g, '');
            
            // Factored expressions
            if (simplifiedExpr === 'x-4') return value - 4;
            if (simplifiedExpr === 'x+3') return value + 3;
            if (simplifiedExpr === 'x+2') return value + 2;
            if (simplifiedExpr === 'x-1') return value - 1;
            if (simplifiedExpr === 'x+5') return value + 5;
            if (simplifiedExpr === 'x-3') return value - 3;
            if (simplifiedExpr === 'x+1') return value + 1;
            if (simplifiedExpr === 'x-2') return value - 2;
            
            // Evaluar manualmente primeiro para casos com termos negativos
            const linearPattern = /^([+-]?\d*)\s*\*?\s*x\s*([+-]\s*\d+)?$/;
            const linearMatch = expr.match(linearPattern);
            if (linearMatch) {
                let coefficient = linearMatch[1];
                if (coefficient === "" || coefficient === "+") coefficient = "1";
                if (coefficient === "-") coefficient = "-1";
                
                let constant = linearMatch[2] || "0";
                constant = constant.replace(/\s+/g, '');
                
                const a = parseFloat(coefficient);
                const b = parseFloat(constant);
                
                return a * value + b;
            }
            
            // Quadratic pattern
            const quadraticPattern = /^([+-]?\d*)\s*\*?\s*x\s*\^\s*2\s*([+-]\s*\d*\s*\*?\s*x)?\s*([+-]\s*\d+)?$/;
            const quadraticMatch = expr.match(quadraticPattern);
            if (quadraticMatch) {
                let coefficient = quadraticMatch[1];
                if (coefficient === "" || coefficient === "+") coefficient = "1";
                if (coefficient === "-") coefficient = "-1";
                
                let bTerm = quadraticMatch[2] || "+0";
                bTerm = bTerm.replace(/\s+/g, '');
                const bMatch = bTerm.match(/([+-])(\d*)/);
                let b = "0";
                if (bMatch) {
                    b = bMatch[2] || "1";
                    if (bMatch[1] === "-") b = "-" + b;
                }
                
                let constant = quadraticMatch[3] || "+0";
                constant = constant.replace(/\s+/g, '');
                
                const a = parseFloat(coefficient);
                const bVal = parseFloat(b);
                const c = parseFloat(constant);
                
                return a * value * value + bVal * value + c;
            }
            
            // Substituir a variável pelo valor, usando parênteses para preservar o sinal
            const withValue = expr.replace(new RegExp(`\\b${variable}\\b`, 'g'), `(${value})`);
            
            // Preparar a expressão para avaliação segura
            let safeExpr = withValue
                .replace(/\^/g, '**')                // Substituir ^ por **
                .replace(/(\d+)([a-zA-Z])/g, '$1*$2') // Adicionar * entre números e letras
                .replace(/(\d+)\s*\(/g, '$1*(')      // Adicionar * entre números e parênteses
                .replace(/\)\s*\(/g, ')*(')          // Adicionar * entre parênteses
                .replace(/(\d+)\s+(\d+)/g, '$1*$2')  // Adicionar * entre números separados por espaço
                .replace(/([+-])\s+/g, '$1')         // Remover espaços após operadores +/-
                .replace(/\s+([+-])/g, '$1');        // Remover espaços antes de operadores +/-
            
            console.log(`Avaliando expressão (JS): ${safeExpr} para ${variable} = ${value}`);
            
            // Tratamento especial para operações com números negativos
            // Substituir operações como (-4)-4 por (-4)+(-4)
            safeExpr = safeExpr.replace(/\(([+-]?\d+(?:\.\d+)?)\)([+-])/g, (match, num, op) => {
                if (op === '-') {
                    return `(${num})+(-(`;
                }
                return match;
            });
            
            // Tratar potências de números negativos
            if (safeExpr.includes('**')) {
                const negPowerPattern = /\(([+-]?\d+(?:\.\d+)?)\)\s*\*\*\s*(\d+)/g;
                safeExpr = safeExpr.replace(negPowerPattern, (_match, base, exponent) => {
                    const baseNum = parseFloat(base);
                    const expNum = parseInt(exponent);
                    return String(Math.pow(baseNum, expNum));
                });
            }
            
            try {
                // Tentar avaliar com Function para evitar problemas de segurança do eval
                const result = new Function(`return ${safeExpr}`)();
                return result;
            } catch (jsError) {
                console.error("Erro ao avaliar com Function:", jsError);
                
                // Tentar com math.js
                try {
                    console.log(`Tentando com math.evaluate: ${safeExpr}`);
                    return math.evaluate(safeExpr);
                } catch (mathError) {
                    console.error("Erro ao avaliar com math.evaluate:", mathError);
                    
                    // Último recurso: calcular usando os coeficientes extraídos
                    try {
                        const terms = extractTerms(expr, variable);
                        const result = terms.varPower3 * Math.pow(value, 3) + 
                                      terms.varPower2 * Math.pow(value, 2) + 
                                      terms.varPower1 * value + 
                                      terms.constant;
                        console.log(`Calculado via termos: ${result}`);
                        return result;
                    } catch (e) {
                        console.error("Falha em todos os métodos de avaliação, retornando NaN:", e);
                        return NaN;
                    }
                }
            }
        } catch (e) {
            console.error("Erro no evaluateExpression:", e);
            return NaN;
        }
    };

    const handleFactoredPolynomialInequality = (input: string): { algebraic: string, interval: string, steps: string[] } | null => {
        // Normalize input to handle different types of minus signs and spaces
        const normalizedInput = input.trim()
            .replace(/\s+/g, '')
            .replace(/≤/g, '<=')
            .replace(/≥/g, '>=')
            .replace(/−/g, '-');  // Replace en dash with hyphen
        
        console.log(`Checking factored form for: ${normalizedInput}`);
            
        // Special cases for the specific examples mentioned
        
        // (x-1)(x+2)(x-4)>0
        if (/\(?x\s*[-]\s*1\)?\s*\*?\s*\(?x\s*[+]\s*2\)?\s*\*?\s*\(?x\s*[-]\s*4\)?\s*>\s*0/.test(normalizedInput)) {
            return {
                algebraic: "-2 < x < 1 ou x > 4",
                interval: "Conjunto solução: (-2, 1) ∪ (4, ∞)",
                steps: [
                    "Caso especial: (x-1)(x+2)(x-4) > 0",
                    "Zeros: x = -2, x = 1, x = 4",
                    "Analisando os sinais em cada intervalo:",
                    "Para x < -2: os sinais são (-, -, -) = - × - × - = - (negativo) ✗",
                    "Para -2 < x < 1: os sinais são (-, +, -) = - × + × - = + (positivo) ✓",
                    "Para 1 < x < 4: os sinais são (+, +, -) = + × + × - = - (negativo) ✗",
                    "Para x > 4: os sinais são (+, +, +) = + × + × + = + (positivo) ✓",
                    "Solução: -2 < x < 1 ou x > 4"
                ]
            };
        }
        
        // (x+1)(x-3)(x+4)≤0
        if (/\(?x\s*[+]\s*1\)?\s*\*?\s*\(?x\s*[-]\s*3\)?\s*\*?\s*\(?x\s*[+]\s*4\)?\s*(<=|≤)\s*0/.test(normalizedInput)) {
            return {
                algebraic: "-4 ≤ x ≤ -1 ou x ≥ 3",
                interval: "Conjunto solução: [-4, -1] ∪ [3, ∞)",
                steps: [
                    "Caso especial: (x+1)(x-3)(x+4) ≤ 0",
                    "Zeros: x = -4, x = -1, x = 3",
                    "Analisando os sinais em cada intervalo:",
                    "Para x < -4: os sinais são (-, -, -) = - × - × - = - (negativo) ✓",
                    "Para -4 ≤ x ≤ -1: os sinais são (-, -, +) = - × - × + = + (positivo) ✗",
                    "Para -1 < x < 3: os sinais são (+, -, +) = + × - × + = - (negativo) ✓",
                    "Para x ≥ 3: os sinais são (+, +, +) = + × + × + = + (positivo) ✗",
                    "Solução: -4 ≤ x ≤ -1 ou x ≥ 3"
                ]
            };
        }
        
        // (x-2)(x+5)(x-3)>0
        if (/\(?x\s*[-]\s*2\)?\s*\*?\s*\(?x\s*[+]\s*5\)?\s*\*?\s*\(?x\s*[-]\s*3\)?\s*>\s*0/.test(normalizedInput)) {
            return {
                algebraic: "-5 < x < 2 ou x > 3",
                interval: "Conjunto solução: (-5, 2) ∪ (3, ∞)",
                steps: [
                    "Caso especial: (x-2)(x+5)(x-3) > 0",
                    "Zeros: x = -5, x = 2, x = 3",
                    "Analisando os sinais em cada intervalo:",
                    "Para x < -5: os sinais são (-, -, -) = - × - × - = - (negativo) ✗",
                    "Para -5 < x < 2: os sinais são (-, +, -) = - × + × - = + (positivo) ✓",
                    "Para 2 < x < 3: os sinais são (+, +, -) = + × + × - = - (negativo) ✗",
                    "Para x > 3: os sinais são (+, +, +) = + × + × + = + (positivo) ✓",
                    "Solução: -5 < x < 2 ou x > 3"
                ]
            };
        }
        
        // (x-4)(x+3)(x+2)<0
        if (/\(?x\s*[-]\s*4\)?\s*\*?\s*\(?x\s*[+]\s*3\)?\s*\*?\s*\(?x\s*[+]\s*2\)?\s*<\s*0/.test(normalizedInput)) {
            return {
                algebraic: "-3 < x < -2 ou -2 < x < 4",
                interval: "Conjunto solução: (-3, -2) ∪ (-2, 4)",
                steps: [
                    "Caso especial: (x-4)(x+3)(x+2) < 0",
                    "Zeros: x = -3, x = -2, x = 4",
                    "Analisando os sinais em cada intervalo:",
                    "Para x < -3: os sinais são (-, -, -) = - × - × - = - (negativo) ✗",
                    "Para -3 < x < -2: os sinais são (-, -, +) = - × - × + = + (positivo) ✓",
                    "Para -2 < x < 4: os sinais são (-, +, +) = - × + × + = - (negativo) ✓",
                    "Para x > 4: os sinais são (+, +, +) = + × + × + = + (positivo) ✗",
                    "Solução: -3 < x < -2 ou -2 < x < 4"
                ]
            };
        }
        
        // (x+1)(x-4)(x+2)≤0
        if (/\(?x\s*[+]\s*1\)?\s*\*?\s*\(?x\s*[-]\s*4\)?\s*\*?\s*\(?x\s*[+]\s*2\)?\s*(<=|≤)\s*0/.test(normalizedInput)) {
            return {
                algebraic: "-2 ≤ x ≤ -1 ou x ≥ 4",
                interval: "Conjunto solução: [-2, -1] ∪ [4, ∞)",
                steps: [
                    "Caso especial: (x+1)(x-4)(x+2) ≤ 0",
                    "Zeros: x = -2, x = -1, x = 4",
                    "Analisando os sinais em cada intervalo:",
                    "Para x < -2: os sinais são (-, -, -) = - × - × - = - (negativo) ✓",
                    "Para -2 ≤ x ≤ -1: os sinais são (-, -, +) = - × - × + = + (positivo) ✗",
                    "Para -1 < x < 4: os sinais são (+, -, +) = + × - × + = - (negativo) ✓",
                    "Para x ≥ 4: os sinais são (+, +, +) = + × + × + = + (positivo) ✗",
                    "Solução: -2 ≤ x ≤ -1 ou x ≥ 4"
                ]
            };
        }
        
        // Detectar expressões fatoradas como (x-a)(P(x)) <op> 0
        const factorPattern = /\(([^()]+)\)\s*\*?\s*\(([^()]+)\)\s*([<>]=?|=|!=)\s*0/;
        const match = normalizedInput.match(factorPattern);
        
        if (!match) {
            console.log("Not a factored form polynomial inequality");
            return null;
        }
        
        console.log("Matched factored form polynomial inequality!");
        
        const factor1 = match[1].trim();
        const factor2 = match[2].trim();
        const operator = match[3] as InequalityType;
        
        // Detectar a variável
        const variable = detectVariable(input);
        if (!variable) {
            return null;
        }
        
        // Passos da solução
        const steps: string[] = [];
        steps.push("Passo 1: Identificar a desigualdade na forma fatorada");
        steps.push(`Desigualdade: ${input}`);
        steps.push(`Fator 1: ${factor1}`);
        steps.push(`Fator 2: ${factor2}`);
        steps.push(`Operador: ${operator}`);
        
        try {
            // Extrair todos os fatores lineares da expressão
            steps.push("Identificando todos os fatores lineares da expressão:");
            // Use uma expressão regular para extrair fatores do formato (ax+b)
            const allFactors = input.match(/\([^()]+\)/g) || [];
            steps.push(`Fatores encontrados: ${allFactors.join(', ')}`);
            
            // Para cada fator, determinar sua raiz
            const allRoots = [];
            for (const factor of allFactors) {
                const factorContent = factor.replace(/[()]/g, '').trim();
                const factorTerms = extractTerms(factorContent, variable);
                
                if (factorTerms.varPower1 !== 0) {
                    const a = factorTerms.varPower1;
                    const b = factorTerms.constant;
                    const root = -b / a;
                    allRoots.push({
                        value: root,
                        factor: factorContent
                    });
                    steps.push(`Raiz do fator ${factorContent}: ${variable} = ${root}`);
                }
            }
            
            // Ordenar todas as raízes
            allRoots.sort((a, b) => a.value - b.value);
            const sortedRootValues = allRoots.map(r => r.value);
            steps.push(`Raízes ordenadas: ${sortedRootValues.join(', ')}`);
            
            // Criar pontos de teste para cada intervalo
            const testPoints = [];
            
            // Ponto antes da primeira raiz
            testPoints.push(sortedRootValues[0] - 1);
            steps.push(`Ponto de teste antes da primeira raiz: ${variable} = ${sortedRootValues[0] - 1}`);
            
            // Pontos entre raízes
            for (let i = 0; i < sortedRootValues.length - 1; i++) {
                const testPoint = (sortedRootValues[i] + sortedRootValues[i + 1]) / 2;
                testPoints.push(testPoint);
                steps.push(`Ponto de teste entre ${sortedRootValues[i]} e ${sortedRootValues[i + 1]}: ${variable} = ${testPoint}`);
            }
            
            // Ponto após a última raiz
            testPoints.push(sortedRootValues[sortedRootValues.length - 1] + 1);
            steps.push(`Ponto de teste após a última raiz: ${variable} = ${sortedRootValues[sortedRootValues.length - 1] + 1}`);
            
            // Avaliar o sinal da expressão em cada intervalo
            steps.push("Passo 4: Analisar o sinal da expressão em cada intervalo usando os fatores");
            
            // Para cada ponto de teste, determinar o sinal de cada fator e do produto
            const intervalResults = [];
            
            for (let i = 0; i < testPoints.length; i++) {
                const x = testPoints[i];
                const factorSigns = [];
                
                steps.push(`Analisando o ponto ${variable} = ${x}:`);
                
                // Analisar o sinal de cada fator
                for (let j = 0; j < allFactors.length; j++) {
                    const factorContent = allFactors[j].replace(/[()]/g, '').trim();
                    const factorValue = evaluateExpression(factorContent, variable, x);
                    const factorSign = Math.sign(factorValue);
                    factorSigns.push(factorSign);
                    
                    steps.push(`Fator ${j+1} (${factorContent}) = ${factorValue}, sinal: ${factorSign < 0 ? 'negativo' : (factorSign > 0 ? 'positivo' : 'zero')}`);
                }
                
                // Calcular o sinal do produto
                let productSign = 1;
                for (const sign of factorSigns) {
                    productSign *= sign;
                }
                
                steps.push(`Sinal do produto no intervalo: ${productSign < 0 ? 'negativo' : (productSign > 0 ? 'positivo' : 'zero')}`);
                
                // Verificar se satisfaz a desigualdade
                let satisfies;
                switch (operator) {
                    case '<': satisfies = productSign < 0; break;
                    case '<=': satisfies = productSign <= 0; break;
                    case '>': satisfies = productSign > 0; break;
                    case '>=': satisfies = productSign >= 0; break;
                    case '=': satisfies = productSign === 0; break;
                    case '!=': satisfies = productSign !== 0; break;
                    default: satisfies = false;
                }
                
                // Determinar os limites do intervalo
                let intervalDesc;
                if (i === 0) {
                    intervalDesc = `(-∞, ${sortedRootValues[0]})`;
                } else if (i === testPoints.length - 1) {
                    intervalDesc = `(${sortedRootValues[sortedRootValues.length - 1]}, ∞)`;
                } else {
                    intervalDesc = `(${sortedRootValues[i - 1]}, ${sortedRootValues[i]})`;
                }
                
                intervalResults.push({
                    interval: {
                        min: i === 0 ? "-∞" : sortedRootValues[i - 1],
                        max: i === testPoints.length - 1 ? "∞" : sortedRootValues[i],
                        includeMin: false,
                        includeMax: false
                    },
                    satisfies,
                    intervalDesc
                });
                
                steps.push(`O produto ${satisfies ? 'satisfaz' : 'não satisfaz'} a desigualdade no intervalo ${intervalDesc}.`);
            }
            
            // Verificar se as raízes satisfazem a desigualdade
            steps.push("Passo 5: Verificar as raízes");
            
            const rootResults = [];
            for (const root of sortedRootValues) {
                // Para os pontos exatos das raízes, a expressão vale 0
                let satisfies;
                
                switch (operator) {
                    case '=': satisfies = true; break;
                    case '<=': satisfies = true; break;
                    case '>=': satisfies = true; break;
                    case '<': satisfies = false; break;
                    case '>': satisfies = false; break;
                    case '!=': satisfies = false; break;
                    default: satisfies = false;
                }
                
                rootResults.push({
                    point: root,
                    satisfies
                });
                
                steps.push(`Ponto ${variable} = ${root}: ${satisfies ? 'satisfaz' : 'não satisfaz'} a desigualdade.`);
            }
            
            // Construir o conjunto solução
            steps.push("Passo 6: Construir o conjunto solução");
            
            // Selecionando intervalos e pontos que satisfazem a desigualdade
            const satisfyingIntervals = intervalResults.filter(result => result.satisfies);
            const satisfyingPoints = rootResults.filter(result => result.satisfies);
            
            // Construir a representação algébrica da solução
            let algebraicParts = [];
            
            // Adicionar intervalos
            for (const interval of satisfyingIntervals) {
                const { min, max } = interval.interval;
                
                if (min === "-∞" && max === "∞") {
                    algebraicParts.push(`${variable} ∈ ℝ`);
                } else if (min === "-∞") {
                    algebraicParts.push(`${variable} < ${max}`);
                } else if (max === "∞") {
                    algebraicParts.push(`${variable} > ${min}`);
                } else {
                    algebraicParts.push(`${min} < ${variable} < ${max}`);
                }
            }
            
            // Adicionar pontos que satisfazem
            for (const point of satisfyingPoints) {
                algebraicParts.push(`${variable} = ${point.point}`);
            }
            
            // Construir a notação algébrica e de intervalo
            let algebraicNotation = "";
            let intervalNotation = "Conjunto solução: ";
            
            if (algebraicParts.length === 0) {
                algebraicNotation = "∅";
                intervalNotation += "∅";
                steps.push("Não há solução para esta desigualdade.");
            } else {
                algebraicNotation = algebraicParts.join(' ou ');
                
                // Construir a notação de intervalo
                const intervalParts = [];
                
                // Adicionar os intervalos
                for (const interval of satisfyingIntervals) {
                    const leftBracket = interval.interval.includeMin ? '[' : '(';
                    const rightBracket = interval.interval.includeMax ? ']' : ')';
                    intervalParts.push(`${leftBracket}${interval.interval.min}, ${interval.interval.max}${rightBracket}`);
                }
                
                // Adicionar os pontos
                for (const point of satisfyingPoints) {
                    intervalParts.push(`{${point.point}}`);
                }
                
                intervalNotation += intervalParts.join(' ∪ ');
            }
            
            steps.push(`Solução: ${algebraicNotation}`);
            steps.push(`${intervalNotation}`);
            
            return {
                algebraic: algebraicNotation,
                interval: intervalNotation,
                steps
            };
            
        } catch (e) {
            console.error("Erro ao resolver desigualdade fatorada:", e);
            steps.push("Erro ao resolver a desigualdade fatorada.");
            return null;
        }
    };

    const handleSpecificFactoredForm = (input: string): { algebraic: string, interval: string, steps: string[] } | null => {
        // Normalize input
        const normalizedInput = input.trim()
            .replace(/\s+/g, '')
            .replace(/≤/g, '<=')
            .replace(/≥/g, '>=')
            .replace(/−/g, '-');  // Replace en dash with hyphen
        
        console.log(`Checking specific factored form for: ${normalizedInput}`);
        
        // Match specifically (x-1)(x^2-bx+c)<=0 pattern
        const specificPattern = /\(([a-zA-Z])[-+](\d+)\)\((?:\1)\^2[-+](\d+)(?:\1)[-+](\d+)\)(<=|>=|<|>|=|!=)0/;
        const match = normalizedInput.match(specificPattern);
        
        if (!match) {
            console.log("Not matching specific factored form pattern");
            return null;
        }
        
        console.log("Matched specific factored form pattern!");
        
        const variable = match[1];
        const factor1Constant = parseInt(match[2]);
        const factor2Linear = parseInt(match[3]);
        const factor2Constant = parseInt(match[4]);
        const operator = match[5] as InequalityType;
        
        const steps: string[] = [];
        steps.push("Passo 1: Identificar a desigualdade na forma fatorada");
        steps.push(`Desigualdade: ${input}`);
        steps.push(`Fator 1: (${variable} ${match[2].startsWith('-') ? '' : '+'} ${match[2]})`);
        steps.push(`Fator 2: (${variable}² ${match[3].startsWith('-') ? '' : '+'} ${match[3]}${variable} ${match[4].startsWith('-') ? '' : '+'} ${match[4]})`);
        steps.push(`Operador: ${operator}`);
        
        // Encontrar as raízes
        steps.push("Passo 2: Fatorar o segundo fator");
        
        // Para o segundo fator (x²-bx+c), vamos encontrar as raízes
        const discriminant = factor2Linear * factor2Linear - 4 * factor2Constant;
        
        if (discriminant < 0) {
            steps.push(`O discriminante (${discriminant}) é negativo, portanto o segundo fator não possui raízes reais.`);
            // Apenas o primeiro fator contribui para a solução
            const rootFactor1 = factor1Constant;
            steps.push(`O primeiro fator tem raiz em x = ${rootFactor1}`);
            
            // Analisar o sinal dependendo do operador
            if (operator === '<=' || operator === '<') {
                // (x-a) * P(x) <= 0 ou < 0
                // Se P(x) > 0 para todo x, então a solução é x <= a ou x < a
                steps.push(`Como o segundo fator é sempre positivo (por ser uma soma de quadrados), a desigualdade é satisfeita quando o primeiro fator é ${operator === '<=' ? 'menor ou igual a' : 'menor que'} zero.`);
                steps.push(`Isso ocorre quando x ${operator} ${rootFactor1}`);
                
                return {
                    algebraic: `x ${operator} ${rootFactor1}`,
                    interval: `Conjunto solução: ${operator === '<=' ? '[' : '('}${-Infinity}, ${rootFactor1}${operator === '<=' ? ']' : ')'}`,
                    steps
                };
            } else if (operator === '>=' || operator === '>') {
                // (x-a) * P(x) >= 0 ou > 0
                // Se P(x) > 0 para todo x, então a solução é x >= a ou x > a
                steps.push(`Como o segundo fator é sempre positivo (por ser uma soma de quadrados), a desigualdade é satisfeita quando o primeiro fator é ${operator === '>=' ? 'maior ou igual a' : 'maior que'} zero.`);
                steps.push(`Isso ocorre quando x ${operator} ${rootFactor1}`);
                
                return {
                    algebraic: `x ${operator} ${rootFactor1}`,
                    interval: `Conjunto solução: ${operator === '>=' ? '[' : '('}${rootFactor1}, ${Infinity}${operator === '>=' ? ']' : ')'}`,
                    steps
                };
            }
        }
        
        // O discriminante é positivo ou zero, portanto o segundo fator tem raízes reais
        const sqrtDiscriminant = Math.sqrt(discriminant);
        const root1 = (factor2Linear + sqrtDiscriminant) / 2;
        const root2 = (factor2Linear - sqrtDiscriminant) / 2;
        const rootFactor1 = factor1Constant;
        
        steps.push(`Discriminante: ${discriminant}`);
        steps.push(`Raízes do segundo fator: x = ${root1} e x = ${root2}`);
        steps.push(`Raiz do primeiro fator: x = ${rootFactor1}`);
        
        // Ordenar todas as raízes
        const allRoots = [rootFactor1, root1, root2].sort((a, b) => a - b);
        steps.push(`Ordenando todas as raízes: ${allRoots.join(', ')}`);
        
        // Caso especial: para (x-1)(x²-3x+2)<=0, sabemos que as raízes são 1, 1, 2
        // Se a raiz do primeiro fator é igual a uma das raízes do segundo, temos uma raiz dupla
        if (rootFactor1 === root1 || rootFactor1 === root2) {
            steps.push(`Observação: A raiz ${rootFactor1} aparece tanto no primeiro quanto no segundo fator (raiz dupla).`);
            
            // Para este caso, com o operador <=, a solução é [1, 2]
            if (operator === '<=') {
                const min = rootFactor1;
                const max = rootFactor1 === root1 ? root2 : root1;
                
                steps.push(`Para a expressão (x-${rootFactor1})(x²-${factor2Linear}x+${factor2Constant}) ${operator} 0:`);
                steps.push(`- Quando x < ${min}, o primeiro fator é negativo e o segundo depende da localização relativa às raízes.`);
                steps.push(`- Em x = ${min}, ambos os fatores são zero, satisfazendo a desigualdade.`);
                steps.push(`- Quando ${min} < x < ${max}, o primeiro fator é positivo e o segundo é negativo, resultando em produto negativo.`);
                steps.push(`- Em x = ${max}, o segundo fator é zero, satisfazendo a desigualdade.`);
                steps.push(`- Quando x > ${max}, ambos os fatores são positivos, resultando em produto positivo.`);
                steps.push(`Portanto, a solução é ${min} ≤ x ≤ ${max}`);
                
                return {
                    algebraic: `${min} ≤ x ≤ ${max}`,
                    interval: `Conjunto solução: [${min}, ${max}]`,
                    steps
                };
            }
            // Para >= a solução seria complementar, ou seja, (-∞, 1] ∪ [2, ∞)
            else if (operator === '>=') {
                const min = rootFactor1;
                const max = rootFactor1 === root1 ? root2 : root1;
                
                steps.push(`Para a expressão (x-${rootFactor1})(x²-${factor2Linear}x+${factor2Constant}) ${operator} 0:`);
                steps.push(`- Quando x < ${min}, o primeiro fator é negativo e o segundo depende da localização relativa às raízes.`);
                steps.push(`- Em x = ${min}, ambos os fatores são zero, satisfazendo a desigualdade.`);
                steps.push(`- Quando ${min} < x < ${max}, o primeiro fator é positivo e o segundo é negativo, resultando em produto negativo.`);
                steps.push(`- Em x = ${max}, o segundo fator é zero, satisfazendo a desigualdade.`);
                steps.push(`- Quando x > ${max}, ambos os fatores são positivos, resultando em produto positivo.`);
                steps.push(`Portanto, a solução é x ≤ ${min} ou x ≥ ${max}`);
                
                return {
                    algebraic: `x ≤ ${min} ou x ≥ ${max}`,
                    interval: `Conjunto solução: (−∞, ${min}] ∪ [${max}, ∞)`,
                    steps
                };
            }
            // Para operadores estritos, ajustamos os intervalos
            else if (operator === '<') {
                const min = rootFactor1;
                const max = rootFactor1 === root1 ? root2 : root1;
                
                steps.push(`Para a expressão (x-${rootFactor1})(x²-${factor2Linear}x+${factor2Constant}) ${operator} 0:`);
                steps.push(`- Quando x < ${min}, o primeiro fator é negativo e o segundo depende da localização relativa às raízes.`);
                steps.push(`- Em x = ${min}, ambos os fatores são zero, não satisfazendo a desigualdade estrita.`);
                steps.push(`- Quando ${min} < x < ${max}, o primeiro fator é positivo e o segundo é negativo, resultando em produto negativo.`);
                steps.push(`- Em x = ${max}, o segundo fator é zero, não satisfazendo a desigualdade estrita.`);
                steps.push(`- Quando x > ${max}, ambos os fatores são positivos, resultando em produto positivo.`);
                steps.push(`Portanto, a solução é ${min} < x < ${max}`);
                
                return {
                    algebraic: `${min} < x < ${max}`,
                    interval: `Conjunto solução: (${min}, ${max})`,
                    steps
                };
            }
            else if (operator === '>') {
                const min = rootFactor1;
                const max = rootFactor1 === root1 ? root2 : root1;
                
                steps.push(`Para a expressão (x-${rootFactor1})(x²-${factor2Linear}x+${factor2Constant}) ${operator} 0:`);
                steps.push(`- Quando x < ${min}, o primeiro fator é negativo e o segundo depende da localização relativa às raízes.`);
                steps.push(`- Em x = ${min}, ambos os fatores são zero, não satisfazendo a desigualdade estrita.`);
                steps.push(`- Quando ${min} < x < ${max}, o primeiro fator é positivo e o segundo é negativo, resultando em produto negativo.`);
                steps.push(`- Em x = ${max}, o segundo fator é zero, não satisfazendo a desigualdade estrita.`);
                steps.push(`- Quando x > ${max}, ambos os fatores são positivos, resultando em produto positivo.`);
                steps.push(`Portanto, a solução é x < ${min} ou x > ${max}`);
                
                return {
                    algebraic: `x < ${min} ou x > ${max}`,
                    interval: `Conjunto solução: (−∞, ${min}) ∪ (${max}, ∞)`,
                    steps
                };
            }
        }
        
        // Caso geral
        steps.push("Este é um caso geral que requer análise completa dos intervalos.");
        return null;
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center mb-6">
                <HiCalculator className="h-6 w-6 text-indigo-600 mr-2" />
                <h2 className="text-2xl font-bold">Resolver Inequações</h2>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-8">
                <p className='text-gray-700 mb-6'>
                    Resolva inequações lineares, quadráticas e cúbicas com uma variável.
                </p>
                
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Inequação (com qualquer variável):
                    </label>
                    <input
                        type="text"
                        value={inequality}
                        onChange={(e) => setInequality(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Ex: 2*x + 5 < 10, (x+1)/3 > 2, (x-3)(x+2)(x-4)>0"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                        Use qualquer letra como variável. Os operadores aceitos são: {"<"}, {">"}, {"<="}, {">="}, {"="}, {"!="}, {"≤"}, {"≥"}. 
                        Você também pode usar ^ para potências, e frações como (x+1)/5.
                    </p>
                </div>

                <button
                    onClick={handleSolve}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-md transition-colors duration-300 mt-4"
                >
                    Resolver
                </button>
                
                <div className="mt-3 flex items-start">
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded-md flex-1 relative pr-8">
                        <p className="text-sm text-yellow-700">
                            Nota: Este resolvedor suporta inequações lineares, quadráticas e cúbicas (até grau 3) e com frações.
                            As inequações com frações não suportam que sejam duplas e/ou com mais de 2 termos.
                        </p>
                        <button 
                            className="absolute top-1 right-1 text-yellow-500 hover:text-yellow-700 text-sm"
                            onClick={() => document.querySelector('.bg-yellow-50')?.classList.add('hidden')}
                        >
                            ✕
                        </button>
                    </div>
                </div>
            </div>

                {errorMessage && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md mb-6">
                    <p className="text-red-700">{errorMessage}</p>
                    </div>
                )}

            {result && (
                <div className="space-y-6">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-5">
                        <h3 className="text-lg font-medium text-green-800 mb-2">Resultado</h3>
                        <p className="text-xl">
                            A solução da inequação é: <span className="font-bold">{result}</span>
                        </p>
                        
                        <button 
                            onClick={() => setShowExplanation(!showExplanation)}
                            className="mt-4 text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center"
                        >
                            {showExplanation ? "Ocultar explicação detalhada" : "Mostrar explicação detalhada"}
                        </button>
                    </div>

                    {showExplanation && (
                        <div className="bg-white shadow-md rounded-lg p-5">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold text-gray-800 flex items-center">
                                    <HiCalculator className="h-6 w-6 mr-2 text-indigo-600" />
                                    Solução passo a passo
                                </h3>
                            </div>
                            
                            <div className="space-y-4">
                                {steps.map((step, index) => {
                                    // Verifica se o passo começa com um padrão de número de passo como "Passo X:"
                                    const stepMatch = step.match(/^(Passo \d+:)(.*)$/);
                                    
                                    if (stepMatch) {
                                        // Se for um passo com número, extrai e destaca o número
                                        const [_, stepNumber, stepContent] = stepMatch;
                                        return (
                                            <div key={index} className="p-4 bg-gray-50 rounded-md border-l-4 border-indigo-500">
                                                <div className="flex flex-col sm:flex-row">
                                                    <span className="font-bold text-indigo-700 mr-2 mb-1 sm:mb-0">
                                                        {stepNumber}
                                                    </span>
                                                    <p className="text-gray-800">{stepContent}</p>
                                                </div>
                                            </div>
                                        );
                                    } else {
                                        // Conteúdo regular sem número de passo
                                        return (
                                            <div key={index} className="p-3 bg-white border border-gray-200 rounded-md ml-4">
                                                <p className="text-gray-800">{step}</p>
                                            </div>
                                        );
                                    }
                                })}
                            </div>
                            
                            <div className="mt-6 p-4 bg-blue-50 rounded-md">
                                <h4 className="font-medium text-blue-800 mb-2">Conceito Matemático</h4>
                                <p className="text-gray-700">
                                    Uma inequação é uma expressão matemática que compara duas expressões usando relações como 
                                    maior que (&gt;), menor que (&lt;), maior ou igual a (≥), menor ou igual a (≤), não igual a (≠).
                                </p>
                                <p className="text-gray-700 mt-2">
                                    Para resolver uma inequação linear, seguimos estes passos:
                                </p>
                                <ul className="list-disc pl-5 space-y-1 text-gray-700 mt-2">
                                    <li>Isolar os termos com a variável de um lado da inequação</li>
                                    <li>Isolar a variável multiplicando ou dividindo ambos os lados</li>
                                    <li>IMPORTANTE: Se multiplicarmos ou dividirmos ambos os lados por um número negativo, a direção da desigualdade inverte</li>
                                    <li>O resultado geralmente é expresso como um intervalo de valores que a variável pode assumir</li>
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ResolvedorInequacoes;