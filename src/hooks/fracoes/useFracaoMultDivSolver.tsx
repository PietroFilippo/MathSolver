import React, { useReducer, ReactNode } from 'react';
import { gcd } from '../../utils/mathUtils';
import { simplifyFraction, FractionDisplay, getFractionMultDivExamples } from '../../utils/mathUtilsFracoes';
import { useTranslation } from 'react-i18next';

// Definições de tipo
export type Operation = 'multiply' | 'divide';

// Interface de estado
interface FractionMultDivState {
    numerator1: string;
    denominator1: string;
    numerator2: string;
    denominator2: string;
    operation: Operation;
    resultadoNum: number | null;
    resultadoDen: number | null;
    resultado: boolean;
    steps: (string | ReactNode)[];
    errorMessage: string;
    showExplanation: boolean;
    showConceitoMatematico: boolean;
}

// Tipos de ações
type FractionMultDivAction =
    | { type: 'SET_NUMERATOR_1', value: string }
    | { type: 'SET_DENOMINATOR_1', value: string }
    | { type: 'SET_NUMERATOR_2', value: string }
    | { type: 'SET_DENOMINATOR_2', value: string }
    | { type: 'SET_OPERATION', operation: Operation }
    | { type: 'SET_RESULT', numerator: number, denominator: number }
    | { type: 'SET_STEPS', steps: (string | ReactNode)[] }
    | { type: 'SET_ERROR', message: string }
    | { type: 'TOGGLE_EXPLANATION' }
    | { type: 'TOGGLE_CONCEITO_MATEMATICO' }
    | { type: 'RESET' };

// Estado inicial
const initialState: FractionMultDivState = {
    numerator1: '',
    denominator1: '',
    numerator2: '',
    denominator2: '',
    operation: 'multiply',
    resultadoNum: null,
    resultadoDen: null,
    resultado: false,
    steps: [],
    errorMessage: '',
    showExplanation: true,
    showConceitoMatematico: true
};

// Função reducer
function fractionMultDivReducer(state: FractionMultDivState, action: FractionMultDivAction): FractionMultDivState {
    switch (action.type) {
        case 'SET_NUMERATOR_1':
            return { ...state, numerator1: action.value };
        case 'SET_DENOMINATOR_1':
            return { ...state, denominator1: action.value };
        case 'SET_NUMERATOR_2':
            return { ...state, numerator2: action.value };
        case 'SET_DENOMINATOR_2':
            return { ...state, denominator2: action.value };
        case 'SET_OPERATION':
            return { ...state, operation: action.operation };
        case 'SET_RESULT':
            return { 
                ...state, 
                resultadoNum: action.numerator, 
                resultadoDen: action.denominator,
                resultado: true 
            };
        case 'SET_STEPS':
            return { ...state, steps: action.steps };
        case 'SET_ERROR':
            return { ...state, errorMessage: action.message };
        case 'TOGGLE_EXPLANATION':
            return { ...state, showExplanation: !state.showExplanation };
        case 'TOGGLE_CONCEITO_MATEMATICO':
            return { ...state, showConceitoMatematico: !state.showConceitoMatematico };
        case 'RESET':
            return {
                ...state,
                resultado: false,
                steps: [],
                errorMessage: '',
                showExplanation: true,
            };
        default:
            return state;
    }
}

export function useFractionMultDivSolver() {
    const [state, dispatch] = useReducer(fractionMultDivReducer, initialState);
    const { t } = useTranslation('fractions');

    // Função principal de resolução
    const handleSolve = () => {
        // Reseta os valores anteriores e os erros
        dispatch({ type: 'RESET' });

        const num1 = parseInt(state.numerator1);
        const den1 = parseInt(state.denominator1);
        const num2 = parseInt(state.numerator2);
        const den2 = parseInt(state.denominator2);

        // Validar entradas
        if (isNaN(num1) || isNaN(den1) || isNaN(num2) || isNaN(den2)) {
            dispatch({ type: 'SET_ERROR', message: t('multiplication_division.errors.fill_all_fields') });
            return;
        }

        if (den1 === 0 || den2 === 0) {
            dispatch({ type: 'SET_ERROR', message: t('multiplication_division.errors.denominator_zero') });
            return;
        }

        // Para divisão, verificar se a segunda fração não é zero
        if (state.operation === 'divide' && num2 === 0) {
            dispatch({ type: 'SET_ERROR', message: t('multiplication_division.errors.division_by_zero') });
            return;
        }

        // Calcular o resultado
        let resultNumerator: number;
        let resultDenominator: number;

        if (state.operation === 'multiply') {
            resultNumerator = num1 * num2;
            resultDenominator = den1 * den2;
        } else { // divide
            resultNumerator = num1 * den2;
            resultDenominator = den1 * num2;
        }

        // Simplificar o resultado
        const simplified = simplifyFraction(resultNumerator, resultDenominator);
        const simplifiedNum = simplified.numerador;
        const simplifiedDen = simplified.denominador;

        // Gerar passos para explicação
        const steps = generateCalculationSteps(
            num1, den1, num2, den2, 
            resultNumerator, resultDenominator, 
            simplifiedNum, simplifiedDen, 
            state.operation
        );

        // Definir os resultados
        dispatch({ type: 'SET_RESULT', numerator: simplifiedNum, denominator: simplifiedDen });
        dispatch({ type: 'SET_STEPS', steps });
    };

    // Gerar passos de cálculo
    const generateCalculationSteps = (
        num1: number, den1: number,
        num2: number, den2: number,
        resultNumerator: number, resultDenominator: number,
        simplifiedNum: number, simplifiedDen: number,
        operation: Operation
    ): (string | ReactNode)[] => {
        const calculationSteps: (string | ReactNode)[] = [];
        let stepCount = 1;
        const operationStr = operation === 'multiply' ? t('multiplication_division.labels.multiplication') : t('multiplication_division.labels.division');
        const operator = operation === 'multiply' ? '×' : '÷';

        // Frações iniciais
        calculationSteps.push(
            t('multiplication_division.steps.original_equation', {
                operation: operationStr,
                num1,
                den1,
                num2,
                den2,
                operator
            })
        );
        calculationSteps.push(
            <>
                <FractionDisplay numerator={num1} denominator={den1} /> 
                {operator}
                <FractionDisplay numerator={num2} denominator={den2} />
            </>
        );

        // Regra de multiplicação ou divisão
        calculationSteps.push(
            t('multiplication_division.steps.apply_rule', {
                step: stepCount++,
                operation: operation === 'multiply' ? 'multiplicação' : 'divisão'
            })
        );
        
        if (operation === 'multiply') {
            calculationSteps.push(t('multiplication_division.steps.multiplication_rule'));
            calculationSteps.push(
                t('multiplication_division.steps.calculating_numerator', {
                    num1,
                    num2,
                    result: resultNumerator
                })
            );
            calculationSteps.push(
                t('multiplication_division.steps.calculating_denominator', {
                    den1,
                    den2,
                    result: resultDenominator
                })
            );
        } else {
            calculationSteps.push(t('multiplication_division.steps.division_rule'));
            calculationSteps.push(
                t('multiplication_division.steps.calculating_numerator_division', {
                    num1,
                    den2,
                    result: resultNumerator
                })
            );
            calculationSteps.push(
                t('multiplication_division.steps.calculating_denominator_division', {
                    den1,
                    num2,
                    result: resultDenominator
                })
            );
        }

        calculationSteps.push(t('multiplication_division.steps.simplifying_before'));
        calculationSteps.push(<FractionDisplay numerator={resultNumerator} denominator={resultDenominator} />);

        // Simplificar se necessário
        if (resultNumerator !== simplifiedNum || resultDenominator !== simplifiedDen) {
            calculationSteps.push(
                t('multiplication_division.steps.simplify_fraction', {
                    step: stepCount++
                })
            );
            
            const mdcValue = gcd(Math.abs(resultNumerator), Math.abs(resultDenominator));
            calculationSteps.push(
                t('multiplication_division.steps.calculating_gcd', {
                    num: Math.abs(resultNumerator),
                    den: Math.abs(resultDenominator),
                    gcd: mdcValue
                })
            );
            
            calculationSteps.push(
                t('multiplication_division.steps.simplifying_numerator', {
                    num: resultNumerator,
                    gcd: mdcValue,
                    result: simplifiedNum
                })
            );
            
            calculationSteps.push(
                t('multiplication_division.steps.simplifying_denominator', {
                    den: resultDenominator,
                    gcd: mdcValue,
                    result: simplifiedDen
                })
            );
            
            calculationSteps.push(t('multiplication_division.steps.simplifying_final'));
            calculationSteps.push(<FractionDisplay numerator={simplifiedNum} denominator={simplifiedDen} />);
            
            // Adicionar verificação
            calculationSteps.push('---VERIFICATION_SEPARATOR---');
            calculationSteps.push(t('multiplication_division.steps.verification'));
            calculationSteps.push(
                t('multiplication_division.steps.verifying_simplification', {
                    num: resultNumerator,
                    gcd: mdcValue,
                    result: simplifiedNum
                })
            );
            calculationSteps.push(
                t('multiplication_division.steps.verifying_simplification', {
                    num: resultDenominator,
                    gcd: mdcValue,
                    result: simplifiedDen
                })
            );
            calculationSteps.push(
                t('multiplication_division.steps.verification_completed', {
                    operation: operation === 'multiply' ? 
                        t('multiplication_division.results.multiplication', {operation: ''}).toLowerCase() : 
                        t('multiplication_division.results.division', {operation: ''}).toLowerCase(),
                    num: simplifiedNum,
                    den: simplifiedDen
                })
            );
        } else {
            // Adicionar verificação
            calculationSteps.push('---VERIFICATION_SEPARATOR---');
            calculationSteps.push(t('multiplication_division.steps.verification'));
            calculationSteps.push(
                t('multiplication_division.steps.verification_completed', {
                    operation: operation === 'multiply' ? 
                        t('multiplication_division.results.multiplication', {operation: ''}).toLowerCase() : 
                        t('multiplication_division.results.division', {operation: ''}).toLowerCase(),
                    num: resultNumerator,
                    den: resultDenominator
                })
            );
        }

        return calculationSteps;
    };

    // Aplicar um exemplo ao estado atual
    const applyExample = (example: {
        num1: number,
        den1: number,
        num2: number,
        den2: number,
        operation: 'multiply' | 'divide'
    }) => {
        dispatch({ type: 'SET_NUMERATOR_1', value: example.num1.toString() });
        dispatch({ type: 'SET_DENOMINATOR_1', value: example.den1.toString() });
        dispatch({ type: 'SET_NUMERATOR_2', value: example.num2.toString() });
        dispatch({ type: 'SET_DENOMINATOR_2', value: example.den2.toString() });
        dispatch({ type: 'SET_OPERATION', operation: example.operation });
    };

    // Obter exemplos filtrados com base na operação selecionada
    const getFilteredExamples = () => {
        return getFractionMultDivExamples(t).filter(example => 
            example.operation === state.operation
        );
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