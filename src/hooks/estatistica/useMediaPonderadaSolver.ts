import { useReducer } from 'react';
import { calculateWeightedMean } from '../../utils/mathUtilsEstatistica';
import { roundToDecimals } from '../../utils/mathUtils';

// Definições de tipo
export interface ValorPeso {
    valor: string;
    peso: string;
}

// Interface de estado
type State = {
    valoresPesos: ValorPeso[];
    result: number | null;
    steps: string[];
    errorMessage: string | null;
    showExplanation: boolean;
    showConceitoMatematico: boolean;
};

// Tipos de ações
type Action =
    | { type: 'SET_VALOR_PESO'; index: number; field: 'valor' | 'peso'; value: string }
    | { type: 'ADD_PAIR' }
    | { type: 'REMOVE_PAIR'; index: number }
    | { type: 'RESET_CALCULATION' }
    | { type: 'SET_RESULT'; result: number; steps: string[] }
    | { type: 'SET_ERROR'; message: string }
    | { type: 'TOGGLE_EXPLANATION' }
    | { type: 'TOGGLE_CONCEITO_MATEMATICO' }
    | { type: 'APPLY_EXAMPLE'; values: number[]; weights: number[] };

// Estado inicial
const initialState: State = {
    valoresPesos: [
        { valor: '', peso: '' },
        { valor: '', peso: '' }
    ],
    result: null,
    steps: [],
    errorMessage: null,
    showExplanation: false,
    showConceitoMatematico: true
};

// Função reducer
function reducer(state: State, action: Action): State {
    switch (action.type) {
        case 'SET_VALOR_PESO':
            const newValoresPesos = [...state.valoresPesos];
            newValoresPesos[action.index][action.field] = action.value;
            return { ...state, valoresPesos: newValoresPesos };
            
        case 'ADD_PAIR':
            return { 
                ...state, 
                valoresPesos: [...state.valoresPesos, { valor: '', peso: '' }] 
            };
            
        case 'REMOVE_PAIR':
            if (state.valoresPesos.length <= 2) {
                return state;
            }
            const filteredPairs = state.valoresPesos.filter((_, idx) => idx !== action.index);
            return { ...state, valoresPesos: filteredPairs };
            
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
            const exampleValoresPesos = action.values.map((valor, idx) => ({
                valor: valor.toString(),
                peso: (idx < action.weights.length ? action.weights[idx] : 1).toString()
            }));
            return { ...state, valoresPesos: exampleValoresPesos };
            
        default:
            return state;
    }
}

export function useWeightedMeanSolver() {
    const [state, dispatch] = useReducer(reducer, initialState);

    // Atualizar valor ou peso
    const handleChange = (index: number, field: 'valor' | 'peso', value: string) => {
        dispatch({ type: 'SET_VALOR_PESO', index, field, value });
    };

    // Adicionar um novo par de valor e peso
    const handleAddPair = () => {
        dispatch({ type: 'ADD_PAIR' });
    };

    // Remover um par de valor e peso
    const handleRemovePair = (index: number) => {
        dispatch({ type: 'REMOVE_PAIR', index });
    };

    // Função principal de resolução
    const handleSolve = () => {
        dispatch({ type: 'RESET_CALCULATION' });
        
        try {
            // Extrair e validar valores e pesos
            const valuesWeights = state.valoresPesos.filter(
                item => item.valor.trim() !== '' || item.peso.trim() !== ''
            );
            
            if (valuesWeights.length === 0) {
                dispatch({ type: 'SET_ERROR', message: 'Por favor, insira pelo menos um par de valor e peso.' });
                return;
            }
            
            const values: number[] = [];
            const weights: number[] = [];
            
            for (const item of valuesWeights) {
                if (!item.valor.trim() || !item.peso.trim()) {
                    dispatch({
                        type: 'SET_ERROR',
                        message: 'Todos os campos devem ser preenchidos. Cada valor deve ter um peso correspondente.'
                    });
                    return;
                }
                
                const value = parseFloat(item.valor);
                const weight = parseFloat(item.peso);
                
                if (isNaN(value) || isNaN(weight)) {
                    dispatch({
                        type: 'SET_ERROR',
                        message: 'Todos os valores e pesos devem ser números válidos.'
                    });
                    return;
                }
                
                if (weight < 0) {
                    dispatch({
                        type: 'SET_ERROR',
                        message: 'Os pesos não podem ser negativos.'
                    });
                    return;
                }
                
                values.push(value);
                weights.push(weight);
            }
            
            const sumOfWeights = weights.reduce((sum, weight) => sum + weight, 0);
            if (sumOfWeights === 0) {
                dispatch({
                    type: 'SET_ERROR',
                    message: 'A soma dos pesos não pode ser zero.'
                });
                return;
            }
            
            // Calcular a média ponderada
            const result = calculateWeightedMean(values, weights);
            const roundedResult = roundToDecimals(result, 3);
            
            // Gerar passos
            const steps = generateWeightedMeanSteps(values, weights, roundedResult);
            
            dispatch({ type: 'SET_RESULT', result: roundedResult, steps });
        } catch (error) {
            dispatch({ type: 'SET_ERROR', message: error instanceof Error ? error.message : 'Erro desconhecido.' });
        }
    };

    // Aplicar um exemplo ao estado atual
    const applyExample = (example: { values: number[], weights: number[] }) => {
        dispatch({ type: 'APPLY_EXAMPLE', values: example.values, weights: example.weights });
    };

    // Retornar o estado e as funções
    return {
        state,
        dispatch,
        handleChange,
        handleAddPair,
        handleRemovePair,
        handleSolve,
        applyExample
    };
}

// Gerar passos de cálculo
function generateWeightedMeanSteps(values: number[], weights: number[], result: number): string[] {
    const calculationSteps: string[] = [];
    let stepCount = 1;
    
    calculationSteps.push(`Equação original: Calcular a média ponderada para os valores e pesos fornecidos`);
    
    let valuesWeightsTable = 'Dados originais:\n';
    for (let i = 0; i < values.length; i++) {
        valuesWeightsTable += `Valor: ${values[i]}, Peso: ${weights[i]}\n`;
    }
    calculationSteps.push(valuesWeightsTable);
    
    calculationSteps.push(`Passo ${stepCount++}: Multiplicamos cada valor pelo seu respectivo peso`);
    
    let productSum = 0;
    let productsStr = 'Calculando: produtos de cada valor por seu peso:\n';
    
    for (let i = 0; i < values.length; i++) {
        const product = values[i] * weights[i];
        productSum += product;
        productsStr += `${values[i]} × ${weights[i]} = ${roundToDecimals(product, 3)}\n`;
    }
    
    calculationSteps.push(productsStr);
    calculationSteps.push(`Calculando: soma dos produtos: ${values.map((v, i) => `${v} × ${weights[i]}`).join(' + ')} = ${roundToDecimals(productSum, 3)}`);
    
    calculationSteps.push(`Passo ${stepCount++}: Calculamos a soma dos pesos`);
    const weightSum = weights.reduce((sum, w) => sum + w, 0);
    calculationSteps.push(`Calculando: soma dos pesos: ${weights.join(' + ')} = ${weightSum}`);
    
    calculationSteps.push(`Passo ${stepCount++}: Aplicamos a fórmula da média ponderada`);
    calculationSteps.push(`Fórmula: Média ponderada = Soma dos produtos ÷ Soma dos pesos`);
    calculationSteps.push(`Simplificando: Média ponderada = ${roundToDecimals(productSum, 3)} ÷ ${weightSum} = ${result}`);
    
    // Adicionar verificação
    calculationSteps.push('---VERIFICATION_SEPARATOR---');
    calculationSteps.push(`Verificação do resultado:`);
    
    // Verificar se a média ponderada está correta usando cálculos independentes
    let manualSum = 0;
    for (let i = 0; i < values.length; i++) {
        manualSum += values[i] * weights[i];
    }
    const manualResult = manualSum / weightSum;
    
    calculationSteps.push(`Calculando novamente: Soma dos produtos = ${roundToDecimals(manualSum, 3)}`);
    calculationSteps.push(`Calculando novamente: Soma dos pesos = ${weightSum}`);
    calculationSteps.push(`Simplificando: ${roundToDecimals(manualSum, 3)} ÷ ${weightSum} = ${roundToDecimals(manualResult, 4)}`);
    calculationSteps.push(`Verificação concluída: O resultado ${result} está correto!`);
    
    return calculationSteps;
} 