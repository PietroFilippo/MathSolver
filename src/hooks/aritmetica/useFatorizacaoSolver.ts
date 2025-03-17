import { useReducer } from 'react';
import { factorNumberIntoPrimes } from '../../utils/mathUtilsTeoriaNumeros';

// Definições de tipo
type State = {
  inputNumber: string;
  number: number | null;
  primeFactors: { factors: number[]; exponents: number[] } | null;
  steps: string[];
  errorMessage: string | null;
  showExplanation: boolean;
  showConceitoMatematico: boolean;
};

// Tipos de ações
type Action =
  | { type: 'SET_INPUT_NUMBER'; value: string }
  | { type: 'RESET_CALCULATION' }
  | { type: 'SET_RESULT'; number: number; primeFactors: { factors: number[]; exponents: number[] }; steps: string[] }
  | { type: 'SET_ERROR'; message: string }
  | { type: 'TOGGLE_EXPLANATION' }
  | { type: 'TOGGLE_CONCEITO_MATEMATICO' }
  | { type: 'APPLY_EXAMPLE'; example: { number: number } };

// Estado inicial
const initialState: State = {
  inputNumber: '',
  number: null,
  primeFactors: null,
  steps: [],
  errorMessage: null,
  showExplanation: false,
  showConceitoMatematico: true,
};

// Função reducer
function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_INPUT_NUMBER':
      return { ...state, inputNumber: action.value };
    case 'RESET_CALCULATION':
      return {
        ...state,
        number: null,
        primeFactors: null,
        steps: [],
        errorMessage: null,
        showExplanation: false
      };
    case 'SET_RESULT':
      return {
        ...state,
        number: action.number,
        primeFactors: action.primeFactors,
        steps: action.steps,
        errorMessage: null,
        showExplanation: true
      };
    case 'SET_ERROR':
      return {
        ...state,
        errorMessage: action.message,
        number: null,
        primeFactors: null,
        steps: []
      };
    case 'TOGGLE_EXPLANATION':
      return { ...state, showExplanation: !state.showExplanation };
    case 'TOGGLE_CONCEITO_MATEMATICO':
      return { ...state, showConceitoMatematico: !state.showConceitoMatematico };
    case 'APPLY_EXAMPLE':
      return { ...state, inputNumber: action.example.number.toString() };
    default:
      return state;
  }
}

// Gerar passos para fatoração em números primos
function generateFactorizationSteps(num: number): string[] {
  const calculationSteps: string[] = [];
  
  if (num <= 1) {
    if (num === 1) {
      calculationSteps.push('O número 1 não tem fatores primos.');
    } else {
      calculationSteps.push(`O número ${num} não tem fatoração válida em números primos.`);
    }
    return calculationSteps;
  }
  
  calculationSteps.push(`Equação original: Fatoração de ${num} em números primos.`);
  calculationSteps.push(`Vamos decompor o número ${num} em seus fatores primos usando o método de divisões sucessivas.`);
  
  // Tentaremos dividir primeiro pelos menores números primos
  let currentNumber = num;
  let currentFactor = 2;
  let stepCount = 1;
  
  while (currentNumber > 1) {
    // Se o fator atual é um divisor
    if (currentNumber % currentFactor === 0) {
      calculationSteps.push(`Passo ${stepCount}: Dividimos ${currentNumber} por ${currentFactor} e obtemos ${currentNumber / currentFactor}`);
      currentNumber /= currentFactor;
      stepCount++;
    } else {
      // Avançando para o próximo potencial fator
      currentFactor = currentFactor === 2 ? 3 : currentFactor + 2;
      
      // Otimização: se o quadrado do fator atual for maior que o número,
      // então o número atual é primo
      if (currentFactor * currentFactor > currentNumber && currentNumber > 1) {
        calculationSteps.push(`Passo ${stepCount}: ${currentNumber} é um número primo, pois não é divisível por nenhum número menor que sua raiz quadrada.`);
        break;
      }
    }
  }
  
  // Obter a fatoração completa
  const factorization = factorNumberIntoPrimes(num);
  
  // Exibir o resultado na forma fatorada
  let factorStr = '';
  
  for (let i = 0; i < factorization.factors.length; i++) {
    const factor = factorization.factors[i];
    const exponent = factorization.exponents[i];
    
    if (exponent === 1) {
      factorStr += `${factor} × `;
    } else {
      factorStr += `${factor}^${exponent} × `;
    }
  }
  
  // Remover o " × " do final
  factorStr = factorStr.slice(0, -3);
  
  calculationSteps.push(`Resultado: ${num} = ${factorStr}`);
  
  // Adicionar verificação
  calculationSteps.push('---VERIFICATION_SEPARATOR---');
  calculationSteps.push(`Verificação do resultado: Multiplicamos todos os fatores primos para confirmar que obtemos o número original.`);
  
  // Calcular o produto dos fatores
  let product = 1;
  for (let i = 0; i < factorization.factors.length; i++) {
    const factor = factorization.factors[i];
    const exponent = factorization.exponents[i];
    
    calculationSteps.push(`Multiplicando por ${factor}^${exponent} = ${Math.pow(factor, exponent)}`);
    product *= Math.pow(factor, exponent);
  }
  
  calculationSteps.push(`Verificação concluída: ${factorStr} = ${product} ${product === num ? '✓' : '✗'}`);
  
  return calculationSteps;
}

export function useFactorizationSolver() {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Função principal de resolução
  const handleSolve = () => {
    dispatch({ type: 'RESET_CALCULATION' });
    
    try {
      const input = state.inputNumber.trim();
      if (!input) {
        dispatch({ type: 'SET_ERROR', message: 'Por favor, insira um número inteiro positivo.' });
        return;
      }
      
      const num = parseInt(input, 10);
      
      if (isNaN(num)) {
        dispatch({ type: 'SET_ERROR', message: 'Por favor, insira um número inteiro positivo válido.' });
        return;
      }
      
      if (num <= 0) {
        dispatch({ type: 'SET_ERROR', message: 'Por favor, insira um número inteiro positivo.' });
        return;
      }
      
      const primeFactors = factorNumberIntoPrimes(num);
      const steps = generateFactorizationSteps(num);
      
      dispatch({
        type: 'SET_RESULT',
        number: num,
        primeFactors,
        steps
      });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', message: error instanceof Error ? error.message : 'Erro desconhecido.' });
    }
  };

  // Aplicar um exemplo ao estado atual
  const applyExample = (example: { number: number }) => {
    dispatch({ type: 'APPLY_EXAMPLE', example });
  };

  // Retornar o estado e as funções
  return {
    state,
    dispatch,
    handleSolve,
    applyExample
  };
} 