import { useReducer } from 'react';
import { roundToDecimals } from '../../utils/mathUtils';
import { 
    radiansToDegrees, 
    degreesToRadians,
    getTrigonometricFunctionExamples
} from '../../utils/mathUtilsTrigonometria';

// Definições de tipo
export type TrigFunction = 'sin' | 'cos' | 'tan' | 'asin' | 'acos' | 'atan';
export type AngleUnit = 'degrees' | 'radians';

// Interface para o estado das funções trigonométricas
interface FuncoesTrigonometricasState {
  trigFunction: TrigFunction;
  inputValue: string;
  inputUnit: AngleUnit;
  outputUnit: AngleUnit;
  result: number | null;
  error: string | null;
  explanationSteps: string[];
  showExplanation: boolean;
  showConceitoMatematico: boolean;
}

// Tipos de ações para o reducer
type FuncoesTrigonometricasAction =
  | { type: 'SET_TRIG_FUNCTION'; value: TrigFunction }
  | { type: 'SET_INPUT_VALUE'; value: string }
  | { type: 'SET_INPUT_UNIT'; value: AngleUnit }
  | { type: 'SET_OUTPUT_UNIT'; value: AngleUnit }
  | { type: 'SET_RESULT'; result: number; steps: string[] }
  | { type: 'SET_ERROR'; message: string }
  | { type: 'TOGGLE_EXPLANATION' }
  | { type: 'TOGGLE_CONCEITO_MATEMATICO' }
  | { type: 'RESET' }
  | { type: 'APPLY_EXAMPLE'; example: any };

// Estado inicial
const initialState: FuncoesTrigonometricasState = {
  trigFunction: 'sin',
  inputValue: '',
  inputUnit: 'degrees',
  outputUnit: 'degrees',
  result: null,
  error: null,
  explanationSteps: [],
  showExplanation: true,
  showConceitoMatematico: true
};

// Função reducer
function funcoesTrigonometricasReducer(
  state: FuncoesTrigonometricasState, 
  action: FuncoesTrigonometricasAction
): FuncoesTrigonometricasState {
  switch (action.type) {
    case 'SET_TRIG_FUNCTION':
      return { ...state, trigFunction: action.value };
    case 'SET_INPUT_VALUE':
      return { ...state, inputValue: action.value };
    case 'SET_INPUT_UNIT':
      return { ...state, inputUnit: action.value };
    case 'SET_OUTPUT_UNIT':
      return { ...state, outputUnit: action.value };
    case 'SET_RESULT':
      return {
        ...state,
        result: action.result,
        explanationSteps: action.steps,
        error: null,
        showExplanation: true
      };
    case 'SET_ERROR':
      return { 
        ...state, 
        error: action.message, 
        result: null, 
        explanationSteps: [] 
      };
    case 'TOGGLE_EXPLANATION':
      return { ...state, showExplanation: !state.showExplanation };
    case 'TOGGLE_CONCEITO_MATEMATICO':
      return { ...state, showConceitoMatematico: !state.showConceitoMatematico };
    case 'RESET':
      return {
        ...state,
        result: null,
        explanationSteps: [],
        error: null
      };
    case 'APPLY_EXAMPLE':
      const example = action.example;
      const newState = { 
        ...state,
        trigFunction: example.type,
        inputValue: example.inputValue,
        result: null,
        explanationSteps: [],
        error: null
      };
      
      if (example.inputUnit) {
        newState.inputUnit = example.inputUnit as AngleUnit;
      }
      
      if (example.outputUnit) {
        newState.outputUnit = example.outputUnit as AngleUnit;
      }
      
      return newState;
    default:
      return state;
  }
}

export function useFuncoesTrigonometricasSolver() {
  const [state, dispatch] = useReducer(funcoesTrigonometricasReducer, initialState);

  // Obter exemplos com base no estado atual
  const getFilteredExamples = () => {
    return getTrigonometricFunctionExamples().filter(example => 
      example.type === state.trigFunction || 
      (state.trigFunction === 'sin' && example.type === 'asin') ||
      (state.trigFunction === 'cos' && example.type === 'acos') ||
      (state.trigFunction === 'tan' && example.type === 'atan')
    );
  };

  // Aplicar um exemplo ao estado atual
  const applyExample = (example: any) => {
    dispatch({ type: 'APPLY_EXAMPLE', example });
  };

  // Função principal de resolução
  const handleSolve = () => {
    dispatch({ type: 'RESET' });
    
    // Processar o valor de entrada para lidar com expressões como π/6
    let value: number;
    try {
      // Verificar se o valor contém um símbolo de divisão
      if (state.inputValue.includes('/')) {
        const [numerator, denominator] = state.inputValue.split('/').map(part => {
          // Substituir π com Math.PI
          return part.trim().replace(/π|pi/gi, `${Math.PI}`);
        });
        
        // Avaliar a expressão
        value = eval(numerator) / eval(denominator);
      } else {
        // Substituir π com Math.PI para valores sem divisão
        const processedValue = state.inputValue.replace(/π|pi/gi, `${Math.PI}`);
        value = eval(processedValue);
      }
      
      if (isNaN(value)) {
        throw new Error('Valor inválido');
      }
    } catch (error) {
      dispatch({ 
        type: 'SET_ERROR', 
        message: 'Por favor, insira um valor numérico válido ou uma expressão como π/6' 
      });
      return;
    }

    const calculationSteps: string[] = [];
    let calculatedResult: number = 0;
    let stepCount = 1;

    // Para funções trigonométricas diretas (sin, cos, tan)
    if (['sin', 'cos', 'tan'].includes(state.trigFunction)) {
      // Converte para radianos se necessário
      let valueInRadians = value;

      if (state.inputUnit === 'degrees') {
        valueInRadians = degreesToRadians(value);
        calculationSteps.push(`Passo ${stepCount}: Converter o ângulo de graus para radianos`);
        calculationSteps.push(`Para calcular funções trigonométricas, primeiro precisamos converter o ângulo para radianos, pois é a unidade padrão para cálculos matemáticos.`);
        calculationSteps.push(`Fórmula: radians = degrees × (π/180)`);
        calculationSteps.push(`${value}° = ${value} × (π/180) = ${roundToDecimals(valueInRadians, 6)} radianos`);
        stepCount++;
      } else {
        valueInRadians = value;
        calculationSteps.push(`Passo ${stepCount}: Verificar a unidade do ângulo`);
        calculationSteps.push(`O valor ${value} já está em radianos, então não é necessária conversão.`);
        stepCount++;
      }

      // Calcula o resultado
      calculationSteps.push(`Passo ${stepCount}: Calcular ${state.trigFunction}(${state.inputUnit === 'degrees' ? value + '°' : value})`);
      stepCount++;
      
      let explanation = '';
      switch (state.trigFunction) {
        case 'sin':
          explanation = `O seno de um ângulo representa a razão entre o cateto oposto e a hipotenusa em um triângulo retângulo.`;
          calculatedResult = Math.sin(valueInRadians);
          break;
        case 'cos':
          explanation = `O cosseno de um ângulo representa a razão entre o cateto adjacente e a hipotenusa em um triângulo retângulo.`;
          calculatedResult = Math.cos(valueInRadians);
          break;
        case 'tan':
          if (Math.abs(Math.cos(valueInRadians)) < 1e-10) {
            dispatch({ 
              type: 'SET_ERROR', 
              message: 'Tangente indefinida para este ângulo (cos(x) = 0)' 
            });
            calculationSteps.push(`A tangente é indefinida quando cos(x) = 0, o que ocorre em ângulos de 90°, 270°, etc.`);
            dispatch({ type: 'SET_RESULT', result: 0, steps: calculationSteps });
            return;
          }
          explanation = `A tangente de um ângulo representa a razão entre o seno e o cosseno, ou entre o cateto oposto e o cateto adjacente.`;
          calculatedResult = Math.tan(valueInRadians);
          break;
        default:
          dispatch({ type: 'SET_ERROR', message: 'Função não reconhecida' });
          return;
      }
      
      calculationSteps.push(explanation);
      calculationSteps.push(`${state.trigFunction}(${state.inputUnit === 'degrees' ? value + '°' : value}) = ${roundToDecimals(calculatedResult, 6)}`);
      
      // Verifica se precisa converter o resultado
      if (state.outputUnit === 'degrees' && ['asin', 'acos', 'atan'].includes(state.trigFunction)) {
        // Se for uma função inversa e o resultado estiver em radianos, converte para graus
        calculationSteps.push(`Passo ${stepCount}: Converter o resultado de radianos para graus`);
        calculationSteps.push(`${roundToDecimals(calculatedResult, 6)} radianos = ${roundToDecimals(calculatedResult, 6)} × (180/π) = ${roundToDecimals(radiansToDegrees(calculatedResult), 6)}°`);
        stepCount++;
        calculatedResult = radiansToDegrees(calculatedResult);
      }
      
      // Verificação usando identidades
      calculationSteps.push(`Passo ${stepCount}: Verificar o resultado usando identidades trigonométricas`);
      const sinVal = state.trigFunction === 'sin' ? calculatedResult : Math.sin(valueInRadians);
      const cosVal = state.trigFunction === 'cos' ? calculatedResult : Math.cos(valueInRadians);
      
      calculationSteps.push(`Identidade fundamental: sin²(x) + cos²(x) = 1`);
      calculationSteps.push(`Verificação: sin²(${roundToDecimals(valueInRadians, 4)}) + cos²(${roundToDecimals(valueInRadians, 4)}) = ${roundToDecimals(Math.pow(sinVal, 2) + Math.pow(cosVal, 2), 6)}`);
      
      if (state.trigFunction === 'tan') {
        calculationSteps.push(`Identidade da tangente: tan(x) = sin(x) / cos(x)`);
        calculationSteps.push(`Verificação: sin(${roundToDecimals(valueInRadians, 4)}) / cos(${roundToDecimals(valueInRadians, 4)}) = ${roundToDecimals(sinVal / cosVal, 6)}`);
      }
    }
    // Para funções trigonométricas inversas (asin, acos, atan)
    else if (['asin', 'acos', 'atan'].includes(state.trigFunction)) {
      calculationSteps.push(`Passo ${stepCount}: Calcular ${state.trigFunction}(${value})`);
      stepCount++;
      
      let explanation = '';
      switch (state.trigFunction) {
        case 'asin':
          if (value < -1 || value > 1) {
            dispatch({ 
              type: 'SET_ERROR', 
              message: 'O arco seno é definido apenas para valores entre -1 e 1' 
            });
            return;
          }
          explanation = `O arco seno é a função inversa do seno, retornando o ângulo cujo seno é o valor dado.`;
          calculatedResult = Math.asin(value);
          break;
        case 'acos':
          if (value < -1 || value > 1) {
            dispatch({ 
              type: 'SET_ERROR', 
              message: 'O arco cosseno é definido apenas para valores entre -1 e 1' 
            });
            return;
          }
          explanation = `O arco cosseno é a função inversa do cosseno, retornando o ângulo cujo cosseno é o valor dado.`;
          calculatedResult = Math.acos(value);
          break;
        case 'atan':
          explanation = `O arco tangente é a função inversa da tangente, retornando o ângulo cuja tangente é o valor dado.`;
          calculatedResult = Math.atan(value);
          break;
        default:
          dispatch({ type: 'SET_ERROR', message: 'Função não reconhecida' });
          return;
      }
      
      calculationSteps.push(explanation);
      calculationSteps.push(`${state.trigFunction}(${value}) = ${roundToDecimals(calculatedResult, 6)} radianos`);
      
      // Verifica se precisa converter o resultado para graus
      if (state.outputUnit === 'degrees') {
        const resultInDegrees = radiansToDegrees(calculatedResult);
        calculationSteps.push(`Passo ${stepCount}: Converter o resultado de radianos para graus`);
        calculationSteps.push(`Para converter de radianos para graus, multiplicamos por (180/π)`);
        calculationSteps.push(`Fórmula: degrees = radians × (180/π)`);
        calculationSteps.push(`${roundToDecimals(calculatedResult, 6)} radianos = ${roundToDecimals(calculatedResult, 6)} × (180/π) = ${roundToDecimals(resultInDegrees, 6)}°`);
        calculatedResult = resultInDegrees;
        stepCount++;
      } else {
        calculationSteps.push(`Passo ${stepCount}: Verificar a unidade do resultado`);
        calculationSteps.push(`O resultado já está em radianos, que é a unidade solicitada.`);
        stepCount++;
      }
      
      // Verificação da função inversa
      calculationSteps.push(`Passo ${stepCount}: Verificar o resultado aplicando a função direta ao resultado`);
      const verification = state.trigFunction === 'asin' ? Math.sin(calculatedResult) :
                          state.trigFunction === 'acos' ? Math.cos(calculatedResult) :
                          Math.tan(calculatedResult);
      
      calculationSteps.push(`Aplicando a função direta ao resultado: ${state.trigFunction.substring(1)}(${roundToDecimals(calculatedResult, 6)}) = ${roundToDecimals(verification, 6)}`);
      calculationSteps.push(`Valor original: ${value}`);
      calculationSteps.push(`A diferença de ${roundToDecimals(Math.abs(verification - value), 8)} é devido ao arredondamento.`);
    }

    dispatch({ 
      type: 'SET_RESULT', 
      result: roundToDecimals(calculatedResult, 6), 
      steps: calculationSteps 
    });
  };

  // Retornar o estado e as funções
  return {
    state,
    dispatch,
    getFilteredExamples,
    applyExample,
    handleSolve
  };
} 