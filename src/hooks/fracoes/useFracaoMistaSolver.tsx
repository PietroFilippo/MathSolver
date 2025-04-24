import React, { useReducer, ReactNode } from 'react';
import { FractionDisplay, getMixedFractionExamples } from '../../utils/mathUtilsFracoes';
import { useTranslation } from 'react-i18next';

// Definições de tipo
export type Operation = 'toFraction' | 'toMixed';

// Interface de estado
interface MixedFractionState {
    part: string;
    numerator: string;
    denominator: string;
    operation: Operation;
    resultadoNum: number | null;
    resultadoDen: number | null;
    resultadoParte: number | null;
    resultado: boolean;
    steps: (string | ReactNode)[];
    errorMessage: string;
    showExplanation: boolean;
    showConceitoMatematico: boolean;
}

// Tipos de ações
type MixedFractionAction =
    | { type: 'SET_PART', value: string }
    | { type: 'SET_NUMERATOR', value: string }
    | { type: 'SET_DENOMINATOR', value: string }
    | { type: 'SET_OPERATION', operation: Operation }
    | { type: 'SET_RESULT', resultadoNum: number, resultadoDen: number, resultadoParte: number | null, steps: (string | ReactNode)[] }
    | { type: 'RESET' }
    | { type: 'SET_ERROR', message: string }
    | { type: 'TOGGLE_EXPLANATION' }
    | { type: 'TOGGLE_CONCEITO_MATEMATICO' }
    | { type: 'APPLY_EXAMPLE', example: { part?: number, num: number, den: number, operation: Operation } };

// Estado inicial
const initialState: MixedFractionState = {
    part: '',
    numerator: '',
    denominator: '',
    operation: 'toFraction',
    resultadoNum: null,
    resultadoDen: null,
    resultadoParte: null,
    resultado: false,
    steps: [],
    errorMessage: '',
    showExplanation: true,
    showConceitoMatematico: true
};

// Função reducer
function mixedFractionReducer(state: MixedFractionState, action: MixedFractionAction): MixedFractionState {
    switch (action.type) {
        case 'SET_PART':
            return { ...state, part: action.value };
        case 'SET_NUMERATOR':
            return { ...state, numerator: action.value };
        case 'SET_DENOMINATOR':
            return { ...state, denominator: action.value };
        case 'SET_OPERATION':
            return { ...state, operation: action.operation };
        case 'SET_RESULT':
            return {
                ...state,
                resultadoNum: action.resultadoNum,
                resultadoDen: action.resultadoDen,
                resultadoParte: action.resultadoParte,
                resultado: true,
                steps: action.steps,
                showExplanation: true,
                errorMessage: ''
            };
        case 'RESET':
            return {
                ...state,
                resultado: false,
                steps: [],
                errorMessage: '',
                showExplanation: true,
                resultadoNum: null,
                resultadoDen: null,
                resultadoParte: null
            };
        case 'SET_ERROR':
            return { ...state, errorMessage: action.message };
        case 'TOGGLE_EXPLANATION':
            return { ...state, showExplanation: !state.showExplanation };
        case 'TOGGLE_CONCEITO_MATEMATICO':
            return { ...state, showConceitoMatematico: !state.showConceitoMatematico };
        case 'APPLY_EXAMPLE':
            return {
                ...state,
                part: action.example.part?.toString() || '',
                numerator: action.example.num.toString(),
                denominator: action.example.den.toString(),
                operation: action.example.operation
            };
        default:
            return state;
    }
}

export function useMixedFractionSolver() {
    const [state, dispatch] = useReducer(mixedFractionReducer, initialState);
    const { t } = useTranslation('fractions');

    // Função principal de resolução
    const handleSolve = () => {
        // Reseta os valores anteriores e os erros
        dispatch({ type: 'RESET' });

        if (state.operation === 'toFraction') {
            const integer = parseInt(state.part);
            const num = parseInt(state.numerator);
            const den = parseInt(state.denominator);

            // Validar entradas
            if (isNaN(integer) || isNaN(num) || isNaN(den)) {
                dispatch({ type: 'SET_ERROR', message: t('mixed_fractions.errors.invalid_numbers') });
                return;
            }

            if (den === 0) {
                dispatch({ type: 'SET_ERROR', message: t('mixed_fractions.errors.denominator_zero') });
                return;
            }

            // Converter fração mista para fração imprópria
            const novoNumerador = Math.abs(integer) * den + num;
            const novoNumeradorFinal = integer < 0 ? -novoNumerador : novoNumerador;

            // Gerar passos para explicação
            const calculationSteps = generateToFractionSteps(integer, num, den, novoNumerador, novoNumeradorFinal);

            dispatch({
                type: 'SET_RESULT',
                resultadoNum: novoNumeradorFinal,
                resultadoDen: den,
                resultadoParte: null,
                steps: calculationSteps
            });
        } else {
            const num = parseInt(state.numerator);
            const den = parseInt(state.denominator);

            // Validar entradas
            if (isNaN(num) || isNaN(den)) {
                dispatch({ type: 'SET_ERROR', message: t('mixed_fractions.errors.invalid_numbers') });
                return;
            }

            if (den === 0) {
                dispatch({ type: 'SET_ERROR', message: t('mixed_fractions.errors.denominator_zero') });
                return;
            }

            // Converter fração imprópria para fração mista
            const parteInteira = Math.floor(Math.abs(num) / den);
            const novoNumerador = Math.abs(num) % den;
            const sinal = num < 0 ? -1 : 1;

            // Gerar passos para explicação
            const calculationSteps = generateToMixedSteps(num, den, parteInteira, novoNumerador, sinal);

            dispatch({
                type: 'SET_RESULT',
                resultadoNum: novoNumerador,
                resultadoDen: den,
                resultadoParte: sinal * parteInteira,
                steps: calculationSteps
            });
        }
    };

    // Gerar passos para conversão de fração mista para fração imprópria
    const generateToFractionSteps = (
        integer: number,
        num: number,
        den: number,
        novoNumerador: number,
        novoNumeradorFinal: number
    ): (string | ReactNode)[] => {
        const calculationSteps: (string | ReactNode)[] = [];
        let stepCount = 1;
        const operationType = 'mista';

        calculationSteps.push(t('mixed_fractions.steps.original_equation', { operation: operationType }));
        calculationSteps.push(<>
            {integer} + <FractionDisplay numerator={num} denominator={den} />
        </>);

        calculationSteps.push(t('mixed_fractions.steps.whole_multiply', { step: stepCount++ }));
        calculationSteps.push(t('mixed_fractions.steps.calculating_multiply', { 
            whole: integer, 
            den, 
            result: Math.abs(integer) * den 
        }));

        calculationSteps.push(t('mixed_fractions.steps.add_numerator', { step: stepCount++ }));
        calculationSteps.push(t('mixed_fractions.steps.calculating_add', { 
            whole_times_den: Math.abs(integer) * den, 
            num, 
            result: novoNumerador 
        }));

        if (integer < 0) {
            calculationSteps.push(t('mixed_fractions.steps.negative_sign', { step: stepCount++ }));
            calculationSteps.push(t('mixed_fractions.steps.simplifying_sign', { 
                num: novoNumerador, 
                result: novoNumeradorFinal 
            }));
        }

        calculationSteps.push(t('mixed_fractions.steps.write_fraction', { step: stepCount++ }));
        calculationSteps.push(t('mixed_fractions.steps.simplifying_result', { 
            whole: integer, 
            num, 
            den, 
            result_num: novoNumeradorFinal, 
            result_den: den 
        }));
        calculationSteps.push(<FractionDisplay numerator={novoNumeradorFinal} denominator={den} />);
        
        // Adicionar verificação
        calculationSteps.push('---VERIFICATION_SEPARATOR---');
        calculationSteps.push(t('mixed_fractions.steps.verification'));
        calculationSteps.push(t('mixed_fractions.steps.verifying_to_fraction', { 
            whole: integer, 
            den, 
            num, 
            result: novoNumeradorFinal 
        }));
        calculationSteps.push(t('mixed_fractions.steps.verification_completed_to_fraction', { 
            num: novoNumeradorFinal, 
            den 
        }));

        return calculationSteps;
    };

    // Gerar passos para conversão de fração imprópria para fração mista
    const generateToMixedSteps = (
        num: number,
        den: number,
        parteInteira: number,
        novoNumerador: number,
        sinal: number
    ): (string | ReactNode)[] => {
        const calculationSteps: (string | ReactNode)[] = [];
        let stepCount = 1;
        const operationType = 'imprópria';

        calculationSteps.push(t('mixed_fractions.steps.original_equation', { operation: operationType }));
        calculationSteps.push(<FractionDisplay numerator={num} denominator={den} />);

        calculationSteps.push(t('mixed_fractions.steps.divide_numerator', { step: stepCount++ }));
        calculationSteps.push(t('mixed_fractions.steps.calculating_divide', { 
            num: Math.abs(num), 
            den, 
            whole: parteInteira, 
            remainder: novoNumerador 
        }));

        if (num < 0) {
            calculationSteps.push(t('mixed_fractions.steps.apply_negative', { step: stepCount++ }));
            calculationSteps.push(t('mixed_fractions.steps.simplifying_negative', { whole: parteInteira }));
        }

        calculationSteps.push(t('mixed_fractions.steps.write_mixed', { step: stepCount++ }));
        calculationSteps.push(t('mixed_fractions.steps.simplifying_mixed', { 
            num, 
            den, 
            whole: sinal * parteInteira, 
            remainder: novoNumerador 
        }));
        calculationSteps.push(<>
            {sinal * parteInteira} + <FractionDisplay numerator={novoNumerador} denominator={den} />
        </>);
        
        // Adicionar verificação
        calculationSteps.push('---VERIFICATION_SEPARATOR---');
        calculationSteps.push(t('mixed_fractions.steps.verification'));
        calculationSteps.push(t('mixed_fractions.steps.verifying_to_mixed', { 
            whole: sinal * parteInteira, 
            num: novoNumerador, 
            den, 
            result: num 
        }));
        calculationSteps.push(t('mixed_fractions.steps.verification_completed_to_mixed', { 
            whole: sinal * parteInteira, 
            num: novoNumerador, 
            den 
        }));

        return calculationSteps;
    };

    // Aplicar um exemplo ao estado atual
    const applyExample = (example: {
        part?: number,
        num: number,
        den: number,
        operation: Operation,
        description: string
    }) => {
        dispatch({
            type: 'APPLY_EXAMPLE',
            example
        });
    };

    // Obter exemplos filtrados com base na operação selecionada
    const getFilteredExamples = () => {
        return getMixedFractionExamples(t).filter(example => example.operation === state.operation);
    };

    // Retornar o estado e as funções
    return {
        state,
        dispatch,
        handleSolve,
        applyExample,
        getFilteredExamples
    };
} 