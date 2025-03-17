import { useReducer, ReactNode } from 'react';
import { gcd } from '../../utils/mathUtils';
import { simplifyFraction, FractionDisplay, getFractionMultDivExamples } from '../../utils/mathUtilsFracoes';

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
            dispatch({ type: 'SET_ERROR', message: 'Por favor, preencha todos os campos com valores numéricos.' });
            return;
        }

        if (den1 === 0 || den2 === 0) {
            dispatch({ type: 'SET_ERROR', message: 'Os denominadores não podem ser zero.' });
            return;
        }

        // Para divisão, verificar se a segunda fração não é zero
        if (state.operation === 'divide' && num2 === 0) {
            dispatch({ type: 'SET_ERROR', message: 'Não é possível dividir por zero.' });
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

        // Frações iniciais
        calculationSteps.push(`Equação original: ${operation === 'multiply' ? 'Multiplicar' : 'Dividir'} as frações ${num1}/${den1} ${operation === 'multiply' ? '×' : '÷'} ${num2}/${den2}`);
        calculationSteps.push(
            <>
                <FractionDisplay numerator={num1} denominator={den1} /> 
                {operation === 'multiply' ? ' × ' : ' ÷ '}
                <FractionDisplay numerator={num2} denominator={den2} />
            </>
        );

        // Regra de multiplicação ou divisão
        calculationSteps.push(`Passo ${stepCount++}: Aplicar a regra de ${operation === 'multiply' ? 'multiplicação' : 'divisão'} de frações`);
        if (operation === 'multiply') {
            calculationSteps.push(`Calculando: Na multiplicação de frações, multiplicamos os numeradores e os denominadores separadamente.`);
            calculationSteps.push(`Calculando: Numerador: ${num1} × ${num2} = ${resultNumerator}`);
            calculationSteps.push(`Calculando: Denominador: ${den1} × ${den2} = ${resultDenominator}`);
        } else {
            calculationSteps.push(`Calculando: Na divisão de frações, multiplicamos a primeira fração pelo inverso da segunda.`);
            calculationSteps.push(`Calculando: Numerador: ${num1} × ${den2} = ${resultNumerator}`);
            calculationSteps.push(`Calculando: Denominador: ${den1} × ${num2} = ${resultDenominator}`);
        }

        calculationSteps.push(`Simplificando: Resultado antes da simplificação: `);
        calculationSteps.push(<FractionDisplay numerator={resultNumerator} denominator={resultDenominator} />);

        // Simplificar se necessário
        if (resultNumerator !== simplifiedNum || resultDenominator !== simplifiedDen) {
            calculationSteps.push(`Passo ${stepCount++}: Simplificar a fração resultante`);
            const mdcValue = gcd(Math.abs(resultNumerator), Math.abs(resultDenominator));
            calculationSteps.push(`Calculando: MDC(${Math.abs(resultNumerator)}, ${Math.abs(resultDenominator)}) = ${mdcValue}`);
            calculationSteps.push(`Simplificando: Numerador: ${resultNumerator} ÷ ${mdcValue} = ${simplifiedNum}`);
            calculationSteps.push(`Simplificando: Denominador: ${resultDenominator} ÷ ${mdcValue} = ${simplifiedDen}`);
            calculationSteps.push(`Simplificando: Resultado final: `);
            calculationSteps.push(<FractionDisplay numerator={simplifiedNum} denominator={simplifiedDen} />);
            
            // Adicionar verificação
            calculationSteps.push('---VERIFICATION_SEPARATOR---');
            calculationSteps.push(`Verificação do resultado:`);
            calculationSteps.push(`Verificando: ${resultNumerator} ÷ ${mdcValue} = ${simplifiedNum}`);
            calculationSteps.push(`Verificando: ${resultDenominator} ÷ ${mdcValue} = ${simplifiedDen}`);
            calculationSteps.push(`Verificação concluída: O resultado ${operation === 'multiply' ? 'da multiplicação' : 'da divisão'} é ${simplifiedNum}/${simplifiedDen}`);
        } else {
            // Adicionar verificação
            calculationSteps.push('---VERIFICATION_SEPARATOR---');
            calculationSteps.push(`Verificação do resultado:`);
            calculationSteps.push(`Verificação concluída: O resultado ${operation === 'multiply' ? 'da multiplicação' : 'da divisão'} é ${resultNumerator}/${resultDenominator}`);
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
        return getFractionMultDivExamples().filter(example => 
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