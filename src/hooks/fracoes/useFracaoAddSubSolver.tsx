import React, { useReducer, ReactNode } from 'react';
import { lcm, gcd } from '../../utils/mathUtils';
import { simplifyFraction, FractionDisplay, getFractionAddSubExamples } from '../../utils/mathUtilsFracoes';
import { useTranslation } from 'react-i18next';

// Definições de tipo
export type Operation = 'add' | 'sub';

// Interface de estado
interface FractionAddSubState {
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
    showMMCDetails: boolean;
    mmcSteps: { den1: number, den2: number, mmc: number };
    showConceitoMatematico: boolean;
}

// Tipos de ações
type FractionAddSubAction =
    | { type: 'SET_NUMERATOR_1', value: string }
    | { type: 'SET_DENOMINATOR_1', value: string }
    | { type: 'SET_NUMERATOR_2', value: string }
    | { type: 'SET_DENOMINATOR_2', value: string }
    | { type: 'SET_OPERATION', operation: Operation }
    | { type: 'SET_RESULT', resultadoNum: number, resultadoDen: number, steps: (string | ReactNode)[], mmcSteps: { den1: number, den2: number, mmc: number } }
    | { type: 'RESET' }
    | { type: 'SET_ERROR', message: string }
    | { type: 'TOGGLE_EXPLANATION' }
    | { type: 'TOGGLE_MMC_DETAILS' }
    | { type: 'TOGGLE_CONCEITO_MATEMATICO' }
    | { type: 'APPLY_EXAMPLE', example: { num1: number, den1: number, num2: number, den2: number, operation: Operation } };

// Estado inicial
const initialState: FractionAddSubState = {
    numerator1: '',
    denominator1: '',
    numerator2: '',
    denominator2: '',
    operation: 'add',
    resultadoNum: null,
    resultadoDen: null,
    resultado: false,
    steps: [],
    errorMessage: '',
    showExplanation: true,
    showMMCDetails: false,
    mmcSteps: { den1: 0, den2: 0, mmc: 0 },
    showConceitoMatematico: true
};

// Função reducer
function fractionAddSubReducer(state: FractionAddSubState, action: FractionAddSubAction): FractionAddSubState {
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
                resultadoNum: action.resultadoNum,
                resultadoDen: action.resultadoDen,
                resultado: true,
                steps: action.steps,
                mmcSteps: action.mmcSteps,
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
                showMMCDetails: false
            };
        case 'SET_ERROR':
            return { ...state, errorMessage: action.message };
        case 'TOGGLE_EXPLANATION':
            return { ...state, showExplanation: !state.showExplanation };
        case 'TOGGLE_MMC_DETAILS':
            return { ...state, showMMCDetails: !state.showMMCDetails };
        case 'TOGGLE_CONCEITO_MATEMATICO':
            return { ...state, showConceitoMatematico: !state.showConceitoMatematico };
        case 'APPLY_EXAMPLE':
            return {
                ...state,
                numerator1: action.example.num1.toString(),
                denominator1: action.example.den1.toString(),
                numerator2: action.example.num2.toString(),
                denominator2: action.example.den2.toString(),
                operation: action.example.operation
            };
        default:
            return state;
    }
}

export function useFractionAddSubSolver() {
    const [state, dispatch] = useReducer(fractionAddSubReducer, initialState);
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
            dispatch({
                type: 'SET_ERROR',
                message: t('addition_subtraction.errors.fill_all_fields')
            });
            return;
        }

        if (den1 === 0 || den2 === 0) {
            dispatch({
                type: 'SET_ERROR',
                message: t('addition_subtraction.errors.denominator_zero')
            });
            return;
        }

        // Calcular o resultado
        const { calculationSteps, resultNumerator, resultDenominator, mmcSteps } = calcularAddicaoSubtracao(
            num1, den1, num2, den2, state.operation
        );

        // Definir o resultado
        dispatch({
            type: 'SET_RESULT',
            resultadoNum: resultNumerator,
            resultadoDen: resultDenominator,
            steps: calculationSteps,
            mmcSteps
        });
    };

    // Aplicar um exemplo ao estado atual
    const applyExample = (example: {
        num1: number,
        den1: number,
        num2: number,
        den2: number,
        operation: 'add' | 'sub',
        description: string
    }) => {
        dispatch({
            type: 'APPLY_EXAMPLE',
            example
        });
    };

    // Obter exemplos filtrados com base na operação selecionada
    const getFilteredExamples = () => {
        return getFractionAddSubExamples(t).filter(ex => 
            ex.operation === state.operation
        );
    };

    // Calcular adição ou subtração de frações
    const calcularAddicaoSubtracao = (
        num1: number,
        den1: number,
        num2: number,
        den2: number,
        operacao: Operation
    ): { 
        calculationSteps: (string | ReactNode)[], 
        resultNumerator: number, 
        resultDenominator: number,
        mmcSteps: { den1: number, den2: number, mmc: number }
    } => {
        const calculationSteps: (string | ReactNode)[] = [];
        let stepCount = 1;

        calculationSteps.push(t('addition_subtraction.steps.original_equation', { 
            operation: operacao === 'add' ? t('addition_subtraction.operations.add') : t('addition_subtraction.operations.subtract'),
            num1, den1, num2, den2,
            operator: operacao === 'add' ? '+' : '-'
        }));
        
        calculationSteps.push(<>
            <FractionDisplay numerator={num1} denominator={den1} /> 
            {operacao === 'add' ? ' + ' : ' - '}
            <FractionDisplay numerator={num2} denominator={den2} />
        </>);

        calculationSteps.push(t('addition_subtraction.steps.find_lcm', { step: stepCount++, den1, den2 }));

        // Calcular o MMC de denominadores
        const commonDenominator = lcm(den1, den2);
        calculationSteps.push(t('addition_subtraction.steps.calculating_lcm', { den1, den2, result: commonDenominator }));

        // Armazenar etapas do MMC para exibição opcional detalhada
        const mmcSteps = { den1, den2, mmc: commonDenominator };

        // Converter para o denominador comum
        calculationSteps.push(t('addition_subtraction.steps.convert_to_common_denominator', { step: stepCount++ }));

        const factor1 = commonDenominator / den1;
        const factor2 = commonDenominator / den2;

        const newNumerator1 = num1 * factor1;
        const newNumerator2 = num2 * factor2;

        calculationSteps.push(t('addition_subtraction.steps.calculating_first_fraction', { factor: factor1 }));
        calculationSteps.push(<>
            <FractionDisplay numerator={num1} denominator={den1} /> × 
            <FractionDisplay numerator={factor1} denominator={factor1} /> = 
            <FractionDisplay numerator={newNumerator1} denominator={commonDenominator} />
        </>);

        calculationSteps.push(t('addition_subtraction.steps.calculating_second_fraction', { factor: factor2 }));
        calculationSteps.push(<>
            <FractionDisplay numerator={num2} denominator={den2} /> × 
            <FractionDisplay numerator={factor2} denominator={factor2} /> = 
            <FractionDisplay numerator={newNumerator2} denominator={commonDenominator} />
        </>);

        const operation = operacao === 'add' ? t('addition_subtraction.operations.add') : t('addition_subtraction.operations.subtract');
        calculationSteps.push(t('addition_subtraction.steps.perform_operation', { 
            step: stepCount++, 
            operation: operation 
        }));

        let resultNumerator;
        if (operacao === 'add') {
            resultNumerator = newNumerator1 + newNumerator2;
            calculationSteps.push(t('addition_subtraction.steps.calculating_add', { 
                num1: newNumerator1, 
                num2: newNumerator2, 
                result: resultNumerator 
            }));
            calculationSteps.push(<>
                <FractionDisplay numerator={newNumerator1} denominator={commonDenominator} /> + 
                <FractionDisplay numerator={newNumerator2} denominator={commonDenominator} /> = 
                <FractionDisplay numerator={resultNumerator} denominator={commonDenominator} />
            </>);
        } else {
            resultNumerator = newNumerator1 - newNumerator2;
            calculationSteps.push(t('addition_subtraction.steps.calculating_subtract', { 
                num1: newNumerator1, 
                num2: newNumerator2, 
                result: resultNumerator 
            }));
            calculationSteps.push(<>
                <FractionDisplay numerator={newNumerator1} denominator={commonDenominator} /> - 
                <FractionDisplay numerator={newNumerator2} denominator={commonDenominator} /> = 
                <FractionDisplay numerator={resultNumerator} denominator={commonDenominator} />
            </>);
        }

        // Simplificar a fração resultante se possível
        const { numerador: simplifiedNum, denominador: simplifiedDen } = simplifyFraction(resultNumerator, commonDenominator);

        if (resultNumerator !== simplifiedNum || commonDenominator !== simplifiedDen) {
            calculationSteps.push(t('addition_subtraction.steps.simplify_fraction', { step: stepCount++ }));

            const mdcValue = gcd(Math.abs(resultNumerator), commonDenominator);
            calculationSteps.push(t('addition_subtraction.steps.calculating_gcd', { 
                num: Math.abs(resultNumerator), 
                den: commonDenominator, 
                gcd: mdcValue 
            }));
            
            calculationSteps.push(t('addition_subtraction.steps.simplifying_numerator', { 
                num: resultNumerator, 
                gcd: mdcValue, 
                result: simplifiedNum 
            }));
            
            calculationSteps.push(t('addition_subtraction.steps.simplifying_denominator', { 
                den: commonDenominator, 
                gcd: mdcValue, 
                result: simplifiedDen 
            }));
            
            calculationSteps.push(<>
                <FractionDisplay numerator={resultNumerator} denominator={commonDenominator} /> = 
                <FractionDisplay numerator={resultNumerator} denominator={commonDenominator} /> ÷ 
                <FractionDisplay numerator={mdcValue} denominator={mdcValue} /> = 
                <FractionDisplay numerator={simplifiedNum} denominator={simplifiedDen} />
            </>);
            
            // Adicionar verificação
            calculationSteps.push('---VERIFICATION_SEPARATOR---');
            calculationSteps.push(t('addition_subtraction.steps.verification'));
            calculationSteps.push(t('addition_subtraction.steps.verifying_simplification', { 
                num: resultNumerator, 
                gcd: mdcValue, 
                result: simplifiedNum 
            }));
            
            calculationSteps.push(t('addition_subtraction.steps.verification_completed', { 
                operation: operacao === 'add' ? t('addition_subtraction.operations.addition') : t('addition_subtraction.operations.subtraction'),
                num: simplifiedNum, 
                den: simplifiedDen 
            }));

            return {
                calculationSteps,
                resultNumerator: simplifiedNum,
                resultDenominator: simplifiedDen,
                mmcSteps
            };
        }
        
        // Adicionar verificação
        calculationSteps.push('---VERIFICATION_SEPARATOR---');
        calculationSteps.push(t('addition_subtraction.steps.verification'));
        calculationSteps.push(t('addition_subtraction.steps.verification_completed', { 
            operation: operacao === 'add' ? t('addition_subtraction.operations.addition') : t('addition_subtraction.operations.subtraction'),
            num: resultNumerator, 
            den: commonDenominator 
        }));

        return {
            calculationSteps,
            resultNumerator,
            resultDenominator: commonDenominator,
            mmcSteps
        };
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