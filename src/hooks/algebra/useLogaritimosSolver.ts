import { useReducer } from 'react';
import { roundToDecimals } from '../../utils/mathUtils';

// Definições de tipo
type LogType = 'natural' | 'base10' | 'custom';

// Interface de estado
type State = {
  logType: LogType;
  value: string;
  customBase: string;
  result: number | null;
  steps: string[];
  errorMessage: string | null;
  showExplanation: boolean;
  showConceitoMatematico: boolean;
};

// Tipos de ações
type Action =
  | { type: 'SET_LOG_TYPE'; logType: LogType }
  | { type: 'SET_VALUE'; value: string }
  | { type: 'SET_CUSTOM_BASE'; base: string }
  | { type: 'RESET_CALCULATION' }
  | { type: 'SET_RESULT'; result: number; steps: string[] }
  | { type: 'SET_ERROR'; message: string }
  | { type: 'TOGGLE_EXPLANATION' }
  | { type: 'TOGGLE_CONCEITO_MATEMATICO' }
  | { type: 'APPLY_EXAMPLE'; example: { type: LogType; value: number | string; base?: number | string } };

// Estado inicial
const initialState: State = {
  logType: 'natural',
  value: '',
  customBase: '',
  result: null,
  steps: [],
  errorMessage: null,
  showExplanation: false,
  showConceitoMatematico: true,
};

// Função reducer
function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_LOG_TYPE':
      return { ...state, logType: action.logType };
    case 'SET_VALUE':
      return { ...state, value: action.value };
    case 'SET_CUSTOM_BASE':
      return { ...state, customBase: action.base };
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
      return {
        ...state,
        logType: action.example.type,
        value: String(action.example.value),
        customBase: action.example.base !== undefined ? String(action.example.base) : state.customBase,
      };
    default:
      return state;
  }
}

// Gerar passos para logaritmo natural
function generateNaturalLogSteps(numValue: number): string[] {
  const calculationSteps: string[] = [];
  let stepCount = 1;
  
  calculationSteps.push(`Equação original: ln(${numValue})`);
  calculationSteps.push(`Passo ${stepCount++}: Identificando a variável e a base do logaritmo.`);
  calculationSteps.push(`O logaritmo natural ln(${numValue}) equivale a log<sub>e</sub>(${numValue}), onde e ≈ 2,71828 é a constante de Euler.`);
  
  if (numValue === 1) {
    calculationSteps.push(`Passo ${stepCount++}: Aplicando a propriedade de logaritmo.`);
    calculationSteps.push(`Pela propriedade dos logaritmos, o logaritmo de 1 em qualquer base é 0.`);
    calculationSteps.push(`Simplificando os termos: ln(1) = 0, porque e<sup>0</sup> = 1.`);
    calculationSteps.push(`Solução final: ln(1) = 0`);
  } else if (numValue === Math.E) {
    calculationSteps.push(`Passo ${stepCount++}: Aplicando a propriedade de logaritmo.`);
    calculationSteps.push(`Pela propriedade dos logaritmos, o logaritmo de um número em sua própria base é 1.`);
    calculationSteps.push(`Simplificando os termos: ln(e) = 1, porque e<sup>1</sup> = e.`);
    calculationSteps.push(`Solução final: ln(e) = 1`);
  } else {
    // Para outros valores, explicar a aproximação
    calculationSteps.push(`Passo ${stepCount++}: Calculando o valor do logaritmo natural.`);
    calculationSteps.push(`Aplicando a fórmula: ln(${numValue}) = log<sub>e</sub>(${numValue})`);
    
    const result = Math.log(numValue);
    const roundedResult = roundToDecimals(result, 6);
    
    calculationSteps.push(`Simplificando a expressão: ln(${numValue}) = ${roundedResult}`);
    calculationSteps.push(`Solução final: ln(${numValue}) = ${roundedResult}`);
    
    // Adicionar separador visual
    calculationSteps.push(`---VERIFICATION_SEPARATOR---`);
    
    // Verificação
    const verification = Math.exp(result);
    calculationSteps.push(`Verificação: Substituindo o valor na definição do logaritmo.`);
    calculationSteps.push(`Sabemos que se ln(${numValue}) = ${roundedResult}, então e<sup>${roundedResult}</sup> = ${numValue}`);
    calculationSteps.push(`Calculando: e<sup>${roundedResult}</sup> = ${roundToDecimals(verification, 6)}`);
    
    if (Math.abs(verification - numValue) < 0.0001) {
      calculationSteps.push(`Confirmado: ${roundToDecimals(verification, 6)} ≈ ${numValue} (Correto!)`);
    } else {
      calculationSteps.push(`Nota: Há uma pequena diferença devido ao arredondamento.`);
    }
  }
  
  return calculationSteps;
}

// Gerar passos para logaritmo na base 10
function generateBase10LogSteps(numValue: number): string[] {
  const calculationSteps: string[] = [];
  let stepCount = 1;
  
  calculationSteps.push(`Equação original: log₁₀(${numValue})`);
  calculationSteps.push(`Passo ${stepCount++}: Identificando a variável e a base do logaritmo.`);
  
  if (numValue === 1) {
    calculationSteps.push(`Passo ${stepCount++}: Aplicando a propriedade de logaritmo.`);
    calculationSteps.push(`Pela propriedade dos logaritmos, o logaritmo de 1 em qualquer base é 0.`);
    calculationSteps.push(`Simplificando os termos: log₁₀(1) = 0, porque 10<sup>0</sup> = 1`);
    calculationSteps.push(`Solução final: log₁₀(1) = 0`);
  } else if (numValue === 10) {
    calculationSteps.push(`Passo ${stepCount++}: Aplicando a propriedade de logaritmo.`);
    calculationSteps.push(`Pela propriedade dos logaritmos, o logaritmo de um número em sua própria base é 1.`);
    calculationSteps.push(`Simplificando os termos: log₁₀(10) = 1, porque 10<sup>1</sup> = 10`);
    calculationSteps.push(`Solução final: log₁₀(10) = 1`);
  } else if (numValue === 100) {
    calculationSteps.push(`Passo ${stepCount++}: Aplicando a propriedade de logaritmo.`);
    calculationSteps.push(`Pela propriedade dos logaritmos: log₁₀(100) = log₁₀(10²) = 2`);
    calculationSteps.push(`Simplificando os termos: log₁₀(100) = 2, porque 10<sup>2</sup> = 100`);
    calculationSteps.push(`Solução final: log₁₀(100) = 2`);
  } else if (numValue === 1000) {
    calculationSteps.push(`Passo ${stepCount++}: Aplicando a propriedade de logaritmo.`);
    calculationSteps.push(`Pela propriedade dos logaritmos: log₁₀(1000) = log₁₀(10³) = 3`);
    calculationSteps.push(`Simplificando os termos: log₁₀(1000) = 3, porque 10<sup>3</sup> = 1000`);
    calculationSteps.push(`Solução final: log₁₀(1000) = 3`);
  } else if (numValue === 0.1) {
    calculationSteps.push(`Passo ${stepCount++}: Aplicando a propriedade de logaritmo.`);
    calculationSteps.push(`Pela propriedade dos logaritmos: log₁₀(0.1) = log₁₀(10⁻¹) = -1`);
    calculationSteps.push(`Simplificando os termos: log₁₀(0.1) = -1, porque 10<sup>-1</sup> = 0.1`);
    calculationSteps.push(`Solução final: log₁₀(0.1) = -1`);
  } else if (numValue === 0.01) {
    calculationSteps.push(`Passo ${stepCount++}: Aplicando a propriedade de logaritmo.`);
    calculationSteps.push(`Pela propriedade dos logaritmos: log₁₀(0.01) = log₁₀(10⁻²) = -2`);
    calculationSteps.push(`Simplificando os termos: log₁₀(0.01) = -2, porque 10<sup>-2</sup> = 0.01`);
    calculationSteps.push(`Solução final: log₁₀(0.01) = -2`);
  } else {
    calculationSteps.push(`Passo ${stepCount++}: Calculando o valor do logaritmo na base 10.`);
    calculationSteps.push(`Aplicando a fórmula: log₁₀(${numValue})`);
    
    const result = Math.log10(numValue);
    const roundedResult = roundToDecimals(result, 6);
    
    calculationSteps.push(`Simplificando a expressão: log₁₀(${numValue}) = ${roundedResult}`);
    calculationSteps.push(`Solução final: log₁₀(${numValue}) = ${roundedResult}`);
    
    // Adicionar separador visual
    calculationSteps.push(`---VERIFICATION_SEPARATOR---`);
    
    // Verificação
    const verification = Math.pow(10, result);
    calculationSteps.push(`Verificação: Substituindo o valor na definição do logaritmo.`);
    calculationSteps.push(`Sabemos que se log₁₀(${numValue}) = ${roundedResult}, então 10<sup>${roundedResult}</sup> = ${numValue}`);
    calculationSteps.push(`Calculando: 10<sup>${roundedResult}</sup> = ${roundToDecimals(verification, 6)}`);
    
    if (Math.abs(verification - numValue) < 0.0001) {
      calculationSteps.push(`Confirmado: ${roundToDecimals(verification, 6)} ≈ ${numValue} (Correto!)`);
    } else {
      calculationSteps.push(`Nota: Há uma pequena diferença devido ao arredondamento.`);
    }
  }
  
  return calculationSteps;
}

// Gerar passos para logaritmo em base personalizada
function generateCustomLogSteps(numValue: number, numBase: number): string[] {
  const calculationSteps: string[] = [];
  let stepCount = 1;
  
  if (numBase <= 0 || numBase === 1) {
    calculationSteps.push(`Equação inválida: A base ${numBase} não é válida para logaritmos. A base deve ser um número positivo diferente de 1.`);
    return calculationSteps;
  }
  
  calculationSteps.push(`Equação original: log₍${numBase}₎(${numValue})`);
  calculationSteps.push(`Passo ${stepCount++}: Identificando a variável e a base do logaritmo.`);
  
  if (numValue === 1) {
    calculationSteps.push(`Passo ${stepCount++}: Aplicando a propriedade de logaritmo.`);
    calculationSteps.push(`Pela propriedade dos logaritmos, o logaritmo de 1 em qualquer base é 0.`);
    calculationSteps.push(`Simplificando os termos: log₍${numBase}₎(1) = 0, porque ${numBase}<sup>0</sup> = 1`);
    calculationSteps.push(`Solução final: log₍${numBase}₎(1) = 0`);
    return calculationSteps;
  }
  
  if (numValue === numBase) {
    calculationSteps.push(`Passo ${stepCount++}: Aplicando a propriedade de logaritmo.`);
    calculationSteps.push(`Pela propriedade dos logaritmos, o logaritmo de um número em sua própria base é 1.`);
    calculationSteps.push(`Simplificando os termos: log₍${numBase}₎(${numBase}) = 1, porque ${numBase}<sup>1</sup> = ${numBase}`);
    calculationSteps.push(`Solução final: log₍${numBase}₎(${numBase}) = 1`);
    return calculationSteps;
  }
  
  calculationSteps.push(`Passo ${stepCount++}: Calculando o logaritmo usando a fórmula de mudança de base.`);
  calculationSteps.push(`Aplicando a fórmula: log₍${numBase}₎(${numValue}) = log(${numValue}) / log(${numBase})`);
  
  const logValue = Math.log(numValue);
  const logBase = Math.log(numBase);
  const result = logValue / logBase;
  
  calculationSteps.push(`Substituindo pelos logaritmos naturais: log₍${numBase}₎(${numValue}) = ln(${numValue}) / ln(${numBase})`);
  calculationSteps.push(`Calculando os logaritmos naturais: log₍${numBase}₎(${numValue}) = ${roundToDecimals(logValue, 6)} / ${roundToDecimals(logBase, 6)}`);
  calculationSteps.push(`Simplificando a divisão: log₍${numBase}₎(${numValue}) = ${roundToDecimals(result, 6)}`);
  calculationSteps.push(`Solução final: log₍${numBase}₎(${numValue}) = ${roundToDecimals(result, 6)}`);
  
  // Adicionar separador visual
  calculationSteps.push(`---VERIFICATION_SEPARATOR---`);
  
  // Verificação
  const verification = Math.pow(numBase, result);
  calculationSteps.push(`Verificação: Substituindo o valor na definição do logaritmo.`);
  calculationSteps.push(`Sabemos que se log₍${numBase}₎(${numValue}) = ${roundToDecimals(result, 6)}, então ${numBase}<sup>${roundToDecimals(result, 6)}</sup> = ${numValue}`);
  calculationSteps.push(`Calculando: ${numBase}<sup>${roundToDecimals(result, 6)}</sup> = ${roundToDecimals(verification, 6)}`);
  
  if (Math.abs(verification - numValue) < 0.0001) {
    calculationSteps.push(`Confirmado: ${roundToDecimals(verification, 6)} ≈ ${numValue} (Correto!)`);
  } else {
    calculationSteps.push(`Nota: Há uma pequena diferença devido ao arredondamento.`);
  }
  
  return calculationSteps;
}

export function useLogarithmSolver() {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Função principal de resolução
  const handleSolve = () => {
    dispatch({ type: 'RESET_CALCULATION' });
    
    try {
      // Verificar se o valor foi fornecido
      if (!state.value.trim()) {
        dispatch({ type: 'SET_ERROR', message: 'Por favor, insira um valor para calcular o logaritmo.' });
        return;
      }
      
      // Converter para número
      const numValue = parseFloat(state.value.replace(',', '.'));
      
      // Validar o valor
      if (isNaN(numValue)) {
        dispatch({ type: 'SET_ERROR', message: 'Por favor, insira um valor numérico válido.' });
        return;
      }
      
      if (numValue <= 0) {
        dispatch({ type: 'SET_ERROR', message: 'O logaritmo só está definido para valores positivos.' });
        return;
      }
      
      let result: number;
      let steps: string[] = [];
      
      // Calcular o logaritmo com base no tipo
      switch (state.logType) {
        case 'natural':
          result = Math.log(numValue);
          steps = generateNaturalLogSteps(numValue);
          break;
        
        case 'base10':
          result = Math.log10(numValue);
          steps = generateBase10LogSteps(numValue);
          break;
        
        case 'custom':
          if (!state.customBase.trim()) {
            dispatch({ type: 'SET_ERROR', message: 'Por favor, insira um valor para a base personalizada.' });
            return;
          }
          
          const numBase = parseFloat(state.customBase.replace(',', '.'));
          
          if (isNaN(numBase)) {
            dispatch({ type: 'SET_ERROR', message: 'Por favor, insira um valor numérico válido para a base.' });
            return;
          }
          
          if (numBase <= 0) {
            dispatch({ type: 'SET_ERROR', message: 'A base deve ser um número positivo.' });
            return;
          }
          
          if (numBase === 1) {
            dispatch({ type: 'SET_ERROR', message: 'A base não pode ser igual a 1.' });
            return;
          }
          
          result = Math.log(numValue) / Math.log(numBase);
          steps = generateCustomLogSteps(numValue, numBase);
          break;
        
        default:
          dispatch({ type: 'SET_ERROR', message: 'Tipo de logaritmo inválido.' });
          return;
      }
      
      dispatch({
        type: 'SET_RESULT',
        result: roundToDecimals(result, 6),
        steps
      });
    } catch (error) {
      dispatch({ 
        type: 'SET_ERROR', 
        message: error instanceof Error ? error.message : 'Erro desconhecido.' 
      });
    }
  };

  // Aplicar um exemplo ao estado atual
  const applyExample = (example: { type: LogType; value: number | string; base?: number | string; description?: string }) => {
    dispatch({ type: 'APPLY_EXAMPLE', example });
  };

  // Definir o tipo de logaritmo
  const setLogType = (logType: LogType) => {
    dispatch({ type: 'SET_LOG_TYPE', logType });
  };

  // Retornar o estado e as funções
  return {
    state,
    dispatch,
    handleSolve,
    applyExample,
    setLogType,
  };
} 