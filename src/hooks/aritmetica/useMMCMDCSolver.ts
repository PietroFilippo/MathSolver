import { useReducer } from 'react';
import { gcd, lcm } from '../../utils/mathUtils';

// Definições de tipo
type CalculationType = 'mdc' | 'mmc';

// Interface de estado
type State = {
  calculationType: CalculationType;
  inputNumbers: string;
  numbers: number[] | null;
  result: number | null;
  steps: string[];
  errorMessage: string | null;
  showExplanation: boolean;
  showConceitoMatematico: boolean;
};

// Tipos de ações
type Action =
  | { type: 'SET_CALCULATION_TYPE'; calculationType: CalculationType }
  | { type: 'SET_INPUT_NUMBERS'; value: string }
  | { type: 'RESET_CALCULATION' }
  | { type: 'SET_RESULT'; numbers: number[]; result: number; steps: string[] }
  | { type: 'SET_ERROR'; message: string }
  | { type: 'TOGGLE_EXPLANATION' }
  | { type: 'TOGGLE_CONCEITO_MATEMATICO' }
  | { type: 'APPLY_EXAMPLE'; example: { numbers: number[] } };

// Estado inicial
const initialState: State = {
  calculationType: 'mdc',
  inputNumbers: '',
  numbers: null,
  result: null,
  steps: [],
  errorMessage: null,
  showExplanation: false,
  showConceitoMatematico: true,
};

// Função reducer
function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_CALCULATION_TYPE':
      return { ...state, calculationType: action.calculationType };
    case 'SET_INPUT_NUMBERS':
      return { ...state, inputNumbers: action.value };
    case 'RESET_CALCULATION':
      return {
        ...state,
        numbers: null,
        result: null,
        steps: [],
        errorMessage: null,
        showExplanation: false
      };
    case 'SET_RESULT':
      return {
        ...state,
        numbers: action.numbers,
        result: action.result,
        steps: action.steps,
        errorMessage: null,
        showExplanation: true
      };
    case 'SET_ERROR':
      return {
        ...state,
        errorMessage: action.message,
        numbers: null,
        result: null,
        steps: []
      };
    case 'TOGGLE_EXPLANATION':
      return { ...state, showExplanation: !state.showExplanation };
    case 'TOGGLE_CONCEITO_MATEMATICO':
      return { ...state, showConceitoMatematico: !state.showConceitoMatematico };
    case 'APPLY_EXAMPLE':
      return { ...state, inputNumbers: action.example.numbers.join(', ') };
    default:
      return state;
  }
}

// Gerar passos para cálculo do MDC de dois números (versão para uso interno)
function generateGcdStepsForTwoNumbers(a: number, b: number, stepCountRef: { count: number }): string[] {
  const calculationSteps: string[] = [];
  
  calculationSteps.push(`Calculando o MDC de ${a} e ${b} usando o Algoritmo de Euclides:`);
  
  // Copiar os números para evitar a modificação dos originais
  let num1 = Math.max(a, b);
  let num2 = Math.min(a, b);
  
  calculationSteps.push(`Organizando os números em ordem decrescente: ${num1} e ${num2}`);
  
  let remainder = -1;
  
  while (num2 !== 0) {
    remainder = num1 % num2;
    calculationSteps.push(`Passo ${stepCountRef.count++}: Dividimos ${num1} por ${num2} e obtemos quociente ${Math.floor(num1 / num2)} e resto ${remainder}`);
    
    num1 = num2;
    num2 = remainder;
  }
  
  calculationSteps.push(`Resultado: Como o resto é 0, o MDC é o último divisor não nulo: ${num1}`);
  
  // Adicionar verificação
  calculationSteps.push('---VERIFICATION_SEPARATOR---');
  calculationSteps.push(`Verificando o resultado: O MDC encontrado (${num1}) deve dividir ambos os números originais sem deixar resto.`);
  
  // Cálculos para verificação
  const original1 = Math.max(a, b);
  const original2 = Math.min(a, b);
  calculationSteps.push(`${original1} ÷ ${num1} = ${original1 / num1} (sem resto)`);
  calculationSteps.push(`${original2} ÷ ${num1} = ${original2 / num1} (sem resto)`);
  
  return calculationSteps;
}

// Gerar passos para cálculo do MDC de vários números
function generateGcdStepsForMultipleNumbers(numbers: number[]): string[] {
  const calculationSteps: string[] = [];
  let stepCountRef = { count: 1 };
  
  if (numbers.length === 0) return calculationSteps;
  
  if (numbers.length === 1) {
    calculationSteps.push(`O MDC de um único número ${numbers[0]} é o próprio número.`);
    return calculationSteps;
  }
  
  calculationSteps.push(`Calculando o MDC de ${numbers.join(', ')} passo a passo:`);
  calculationSteps.push(`Passo ${stepCountRef.count++}: Começamos calculando o MDC dos dois primeiros números: ${numbers[0]} e ${numbers[1]}`);
  
  let currentGcd = numbers[0];
  
  for (let i = 1; i < numbers.length; i++) {
    calculationSteps.push(`Passo ${stepCountRef.count++}: Calculando MDC(${currentGcd}, ${numbers[i]}):`);
    
    // Gerar passos para este par
    const pairSteps = generateGcdStepsForTwoNumbers(currentGcd, numbers[i], stepCountRef);
    calculationSteps.push(...pairSteps);
    
    currentGcd = gcd(currentGcd, numbers[i]);
    calculationSteps.push(`MDC atual: ${currentGcd}`);
    
    if (currentGcd === 1) {
      calculationSteps.push(`Como o MDC é 1, podemos parar aqui, pois o MDC de todos os números será 1.`);
      break;
    }
  }
  
  calculationSteps.push(`Solução final: MDC de ${numbers.join(', ')} é ${currentGcd}`);
  
  return calculationSteps;
}

// Gerar passos para cálculo do MMC de dois números
function generateLcmStepsForTwoNumbers(a: number, b: number, stepCountRef: { count: number }): string[] {
  const calculationSteps: string[] = [];
  
  calculationSteps.push(`Calculando o MMC de ${a} e ${b}:`);
  calculationSteps.push(`Passo ${stepCountRef.count++}: Utilizamos a fórmula MMC(a,b) = (a × b) / MDC(a,b)`);
  
  calculationSteps.push(`Passo ${stepCountRef.count++}: Primeiro, calculamos o MDC de ${a} e ${b}:`);
  const gcdSteps = generateGcdStepsForTwoNumbers(a, b, stepCountRef);
  calculationSteps.push(...gcdSteps);
  
  const gcdValue = gcd(a, b);
  calculationSteps.push(`MDC(${a}, ${b}) = ${gcdValue}`);
  
  const lcmValue = (a * b) / gcdValue;
  calculationSteps.push(`Passo ${stepCountRef.count++}: Aplicando a fórmula do MMC: MMC(${a}, ${b}) = (${a} × ${b}) / ${gcdValue} = ${a * b} / ${gcdValue} = ${lcmValue}`);
  
  // Adicionar verificação
  calculationSteps.push('---VERIFICATION_SEPARATOR---');
  calculationSteps.push(`Verificando o resultado: O MMC encontrado (${lcmValue}) deve ser divisível por ambos os números originais.`);
  calculationSteps.push(`${lcmValue} ÷ ${a} = ${lcmValue / a} (sem resto)`);
  calculationSteps.push(`${lcmValue} ÷ ${b} = ${lcmValue / b} (sem resto)`);
  
  return calculationSteps;
}

// Gerar passos para cálculo do MMC de vários números
function generateLcmStepsForMultipleNumbers(numbers: number[]): string[] {
  const calculationSteps: string[] = [];
  let stepCountRef = { count: 1 };
  
  if (numbers.length === 0) return calculationSteps;
  
  if (numbers.length === 1) {
    calculationSteps.push(`O MMC de um único número ${numbers[0]} é o próprio número.`);
    return calculationSteps;
  }
  
  calculationSteps.push(`Calculando o MMC de ${numbers.join(', ')} passo a passo:`);
  calculationSteps.push(`Passo ${stepCountRef.count++}: Começamos calculando o MMC dos dois primeiros números: ${numbers[0]} e ${numbers[1]}`);
  
  let currentLcm = numbers[0];
  
  for (let i = 1; i < numbers.length; i++) {
    calculationSteps.push(`Passo ${stepCountRef.count++}: Calculando MMC(${currentLcm}, ${numbers[i]}):`);
    
    // Gerar passos para este par
    const pairSteps = generateLcmStepsForTwoNumbers(currentLcm, numbers[i], stepCountRef);
    calculationSteps.push(...pairSteps);
    
    currentLcm = lcm(currentLcm, numbers[i]);
    calculationSteps.push(`MMC atual: ${currentLcm}`);
  }
  
  calculationSteps.push(`Solução final: MMC de ${numbers.join(', ')} é ${currentLcm}`);
  
  // Adicionar verificação final
  calculationSteps.push('---VERIFICATION_SEPARATOR---');
  calculationSteps.push(`Verificação final: O MMC encontrado (${currentLcm}) deve ser divisível por todos os números originais.`);
  for (let i = 0; i < numbers.length; i++) {
    calculationSteps.push(`${currentLcm} ÷ ${numbers[i]} = ${currentLcm / numbers[i]} (sem resto)`);
  }
  
  return calculationSteps;
}

export function useGcdLcmSolver() {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Função principal de resolução
  const handleSolve = () => {
    dispatch({ type: 'RESET_CALCULATION' });
    
    try {
      const inputText = state.inputNumbers.trim();
      if (!inputText) {
        dispatch({ type: 'SET_ERROR', message: 'Por favor, insira pelo menos dois números.' });
        return;
      }
      
      // Parse a string de entrada para um array de números
      const numbers = inputText
        .split(/[,;\s]+/)
        .filter(item => item.trim() !== '')
        .map(item => {
          const num = parseInt(item.trim(), 10);
          if (isNaN(num)) {
            throw new Error(`O valor '${item}' não é um número inteiro válido.`);
          }
          if (num <= 0) {
            throw new Error(`Todos os números devem ser inteiros positivos.`);
          }
          return num;
        });
      
      if (numbers.length === 0) {
        dispatch({ type: 'SET_ERROR', message: 'Nenhum número válido foi inserido.' });
        return;
      }
      
      if (numbers.length === 1) {
        dispatch({ type: 'SET_ERROR', message: 'Por favor, insira pelo menos dois números para calcular o MDC ou MMC.' });
        return;
      }
      
      // Calcular o resultado e gerar passos com base no tipo de cálculo
      let result: number;
      let steps: string[];
      
      if (state.calculationType === 'mdc') {
        result = numbers.reduce((acc, num) => gcd(acc, num));
        steps = generateGcdStepsForMultipleNumbers(numbers);
      } else { // mmc
        result = numbers.reduce((acc, num) => lcm(acc, num));
        steps = generateLcmStepsForMultipleNumbers(numbers);
      }
      
      dispatch({ type: 'SET_RESULT', numbers, result, steps });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', message: error instanceof Error ? error.message : 'Erro desconhecido.' });
    }
  };

  // Aplicar um exemplo ao estado atual
  const applyExample = (example: { numbers: number[] }) => {
    dispatch({ type: 'APPLY_EXAMPLE', example });
  };

  // Definir o tipo de cálculo
  const setCalculationType = (calculationType: CalculationType) => {
    dispatch({ type: 'SET_CALCULATION_TYPE', calculationType });
  };

  // Retornar o estado e as funções
  return {
    state,
    dispatch,
    handleSolve,
    applyExample,
    setCalculationType
  };
} 