import { useReducer } from 'react';
import { roundToDecimals } from '../../utils/mathUtils';

// Definições de tipo
type State = {
    numbersInput: string;
    result: number | null;
    steps: string[];
    errorMessage: string | null;
    showExplanation: boolean;
    showConceitoMatematico: boolean;
};

// Tipos de ações
type Action =
    | { type: 'SET_DATA'; data: string }
    | { type: 'RESET_CALCULATION' }
    | { type: 'SET_RESULT'; result: number; steps: string[] }
    | { type: 'SET_ERROR'; message: string }
    | { type: 'TOGGLE_EXPLANATION' }
    | { type: 'TOGGLE_CONCEITO_MATEMATICO' }
    | { type: 'APPLY_EXAMPLE'; data: number[] };

// Estado inicial
const initialState: State = {
    numbersInput: '',
    result: null,
    steps: [],
    errorMessage: null,
    showExplanation: false,
    showConceitoMatematico: true
};

// Função reducer
function reducer(state: State, action: Action): State {
    switch (action.type) {
        case 'SET_DATA':
            return { ...state, numbersInput: action.data };
            
        case 'RESET_CALCULATION':
            return {
                ...state,
                result: null,
                steps: [],
                errorMessage: null,
                showExplanation: false
            };
            
        case 'SET_RESULT':
            return {
                ...state,
                result: action.result,
                steps: action.steps,
                errorMessage: null,
                showExplanation: true
            };
            
        case 'SET_ERROR':
            return {
                ...state,
                errorMessage: action.message,
                result: null,
                steps: []
            };
            
        case 'TOGGLE_EXPLANATION':
            return { ...state, showExplanation: !state.showExplanation };
            
        case 'TOGGLE_CONCEITO_MATEMATICO':
            return { ...state, showConceitoMatematico: !state.showConceitoMatematico };
            
        case 'APPLY_EXAMPLE':
            return { ...state, numbersInput: action.data.join(', ') };
            
        default:
            return state;
    }
}

export function useCoefficientOfVariationSolver() {
    const [state, dispatch] = useReducer(reducer, initialState);

    // Função principal de resolução
    const handleSolve = () => {
        dispatch({ type: 'RESET_CALCULATION' });
        
        try {
            const inputText = state.numbersInput.trim();
            if (!inputText) {
                dispatch({ type: 'SET_ERROR', message: 'Por favor, insira dados para análise.' });
                return;
            }
            
            // Parse a string de dados para um array de números
            const values = inputText
                .split(/[,;\s]+/)
                .filter(item => item.trim() !== '')
                .map(item => {
                    const num = parseFloat(item.trim());
                    if (isNaN(num)) {
                        throw new Error(`O valor '${item}' não é um número válido.`);
                    }
                    return num;
                });
            
            if (values.length === 0) {
                dispatch({ type: 'SET_ERROR', message: 'Nenhum número válido foi inserido.' });
                return;
            }
            
            if (values.length === 1) {
                dispatch({ type: 'SET_ERROR', message: 'É necessário mais de um valor para calcular o coeficiente de variação.' });
                return;
            }
            
            // Calcular estatísticas
            const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
            
            if (mean === 0) {
                dispatch({ type: 'SET_ERROR', message: 'O coeficiente de variação não pode ser calculado quando a média é zero.' });
                return;
            }
            
            // Calcular a variância
            const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
            
            // Calcular o desvio padrão
            const standardDeviation = Math.sqrt(variance);
            
            // Calcular o coeficiente de variação (como porcentagem)
            const cv = (standardDeviation / Math.abs(mean)) * 100;
            
            // Arredondar para exibição
            const roundedResult = roundToDecimals(cv, 2);
            
            // Gerar passos
            const steps = generateCVSteps(values, mean, variance, standardDeviation, roundedResult);
            
            dispatch({ type: 'SET_RESULT', result: roundedResult, steps });
        } catch (error) {
            dispatch({ type: 'SET_ERROR', message: error instanceof Error ? error.message : 'Erro desconhecido.' });
        }
    };

    // Aplicar um exemplo ao estado atual
    const applyExample = (example: { data: number[], description: string }) => {
        dispatch({ type: 'APPLY_EXAMPLE', data: example.data });
    };

    // Retornar o estado e as funções
    return {
        state,
        dispatch,
        handleSolve,
        applyExample
    };
}

// Gerar passos de cálculo
function generateCVSteps(
    values: number[], 
    mean: number, 
    variance: number, 
    standardDeviation: number, 
    roundedResult: number
): string[] {
    const calculationSteps = [];
    let stepCount = 1;
    
    calculationSteps.push(`Equação original: Calcular o coeficiente de variação (CV) para o conjunto de dados`);
    calculationSteps.push(`Dados originais: ${values.join(', ')}`);
    
    calculationSteps.push(`Passo ${stepCount++}: Calculamos a média aritmética`);
    const soma = values.reduce((sum, val) => sum + val, 0);
    calculationSteps.push(`Calculando: soma dos valores: ${values.join(' + ')} = ${soma}`);
    calculationSteps.push(`Simplificando: média = soma ÷ n = ${soma} ÷ ${values.length} = ${roundToDecimals(mean, 3)}`);
    
    calculationSteps.push(`Passo ${stepCount++}: Calculamos a variância`);
    calculationSteps.push(`Fórmula: Variância = Σ(xᵢ - μ)² ÷ n, onde μ é a média e n é o número de elementos`);
    
    let desviosQuadradosStr = 'Calculando: para cada valor, o quadrado da diferença entre o valor e a média:\n';
    for (const valor of values) {
        const desvioQuad = Math.pow(valor - mean, 2);
        desviosQuadradosStr += `(${valor} - ${roundToDecimals(mean, 3)})² = ${roundToDecimals(desvioQuad, 3)}, `;
    }
    
    calculationSteps.push(desviosQuadradosStr.slice(0, -2));
    
    const somaDesviosQuadrados = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0);
    calculationSteps.push(`Calculando: soma dos quadrados dos desvios: ${roundToDecimals(somaDesviosQuadrados, 3)}`);
    calculationSteps.push(`Simplificando: variância = ${roundToDecimals(somaDesviosQuadrados, 3)} ÷ ${values.length} = ${roundToDecimals(variance, 3)}`);
    
    calculationSteps.push(`Passo ${stepCount++}: Calculamos o desvio padrão (raiz quadrada da variância)`);
    calculationSteps.push(`Fórmula: Desvio padrão = √Variância`);
    calculationSteps.push(`Simplificando: desvio padrão = √${roundToDecimals(variance, 3)} = ${roundToDecimals(standardDeviation, 3)}`);
    
    calculationSteps.push(`Passo ${stepCount++}: Calculamos o coeficiente de variação`);
    calculationSteps.push(`Fórmula: CV = (Desvio padrão ÷ |Média|) × 100%`);
    calculationSteps.push(`Simplificando: CV = (${roundToDecimals(standardDeviation, 3)} ÷ |${roundToDecimals(mean, 3)}|) × 100% = ${roundedResult}%`);
    
    calculationSteps.push(`Resultado: O coeficiente de variação do conjunto é ${roundedResult}%`);
    
    // Adicionar verificação
    calculationSteps.push('---VERIFICATION_SEPARATOR---');
    calculationSteps.push(`Verificação do resultado:`);
    calculationSteps.push(`Verificando: média = ${roundToDecimals(mean, 3)}`);
    calculationSteps.push(`Verificando: desvio padrão = ${roundToDecimals(standardDeviation, 3)}`);
    const verificaCV = (standardDeviation / Math.abs(mean)) * 100;
    calculationSteps.push(`Calculando: CV = (${roundToDecimals(standardDeviation, 3)} ÷ |${roundToDecimals(mean, 3)}|) × 100% = ${roundToDecimals(verificaCV, 2)}%`);
    calculationSteps.push(`Verificação concluída: O coeficiente de variação é ${roundedResult}%`);
    
    if (roundedResult < 15) {
        calculationSteps.push(`Interpretação: O conjunto de dados tem baixa variabilidade (CV < 15%).`);
    } else if (roundedResult < 30) {
        calculationSteps.push(`Interpretação: O conjunto de dados tem média variabilidade (15% ≤ CV < 30%).`);
    } else {
        calculationSteps.push(`Interpretação: O conjunto de dados tem alta variabilidade (CV ≥ 30%).`);
    }
    
    return calculationSteps;
} 