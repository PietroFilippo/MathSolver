import { useReducer } from 'react';
import { roundToDecimals } from '../../utils/mathUtils';
import { 
    radiansToDegrees, 
    degreesToRadians,
    getTrigonometricFunctionExamples
} from '../../utils/mathUtilsTrigonometria/index';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation(['trigonometry', 'translation']);

  // Obter exemplos com base no estado atual
  const getFilteredExamples = () => {
    return getTrigonometricFunctionExamples(t).filter(example => 
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
        message: t('trigonometry:trigonometric_functions.errors.invalid_value')
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
        calculationSteps.push(t('trigonometry:trigonometric_functions.steps.convert_to_radians', { step: stepCount }));
        calculationSteps.push(t('trigonometry:trigonometric_functions.steps.convert_explanation'));
        calculationSteps.push(t('trigonometry:trigonometric_functions.steps.convert_formula'));
        calculationSteps.push(t('trigonometry:trigonometric_functions.steps.convert_calculation', { 
          value: value, 
          result: roundToDecimals(valueInRadians, 6) 
        }));
        stepCount++;
      } else {
        valueInRadians = value;
        calculationSteps.push(t('trigonometry:trigonometric_functions.steps.check_unit', { step: stepCount }));
        calculationSteps.push(t('trigonometry:trigonometric_functions.steps.already_radians', { value: value }));
        stepCount++;
      }

      // Calcula o resultado
      calculationSteps.push(t('trigonometry:trigonometric_functions.steps.calculate_function', { 
        step: stepCount,
        function: state.trigFunction,
        input: value,
        unit: state.inputUnit === 'degrees' ? '°' : ''
      }));
      stepCount++;
      
      let explanation = '';
      switch (state.trigFunction) {
        case 'sin':
          explanation = t('trigonometry:trigonometric_functions.steps.sine_explanation');
          calculatedResult = Math.sin(valueInRadians);
          break;
        case 'cos':
          explanation = t('trigonometry:trigonometric_functions.steps.cosine_explanation');
          calculatedResult = Math.cos(valueInRadians);
          break;
        case 'tan':
          if (Math.abs(Math.cos(valueInRadians)) < 1e-10) {
            dispatch({ 
              type: 'SET_ERROR', 
              message: t('trigonometry:trigonometric_functions.errors.undefined_tangent')
            });
            calculationSteps.push(t('trigonometry:trigonometric_functions.steps.tangent_undefined'));
            dispatch({ type: 'SET_RESULT', result: 0, steps: calculationSteps });
            return;
          }
          explanation = t('trigonometry:trigonometric_functions.steps.tangent_explanation');
          calculatedResult = Math.tan(valueInRadians);
          break;
        default:
          dispatch({ 
            type: 'SET_ERROR', 
            message: t('trigonometry:trigonometric_functions.errors.function_not_recognized')
          });
          return;
      }
      
      calculationSteps.push(explanation);
      calculationSteps.push(t('trigonometry:trigonometric_functions.steps.calculation_result', { 
        function: state.trigFunction, 
        input: value, 
        unit: state.inputUnit === 'degrees' ? '°' : '', 
        result: roundToDecimals(calculatedResult, 6) 
      }));
      
      // Verifica se precisa converter o resultado
      if (state.outputUnit === 'degrees' && ['asin', 'acos', 'atan'].includes(state.trigFunction)) {
        // Se for uma função inversa e o resultado estiver em radianos, converte para graus
        calculationSteps.push(t('trigonometry:trigonometric_functions.steps.convert_to_degrees', { step: stepCount }));
        calculationSteps.push(t('trigonometry:trigonometric_functions.steps.convert_output_calculation', { 
          radians: roundToDecimals(calculatedResult, 6), 
          degrees: roundToDecimals(radiansToDegrees(calculatedResult), 6)
        }));
        stepCount++;
        calculatedResult = radiansToDegrees(calculatedResult);
      }
      
      // Verificação usando identidades
      calculationSteps.push(t('trigonometry:trigonometric_functions.steps.verify_result', { step: stepCount }));
      const sinVal = state.trigFunction === 'sin' ? calculatedResult : Math.sin(valueInRadians);
      const cosVal = state.trigFunction === 'cos' ? calculatedResult : Math.cos(valueInRadians);
      
      calculationSteps.push(t('trigonometry:trigonometric_functions.steps.fundamental_identity'));
      calculationSteps.push(t('trigonometry:trigonometric_functions.steps.verify_identity', { 
        value: roundToDecimals(valueInRadians, 4), 
        result: roundToDecimals(Math.pow(sinVal, 2) + Math.pow(cosVal, 2), 6)
      }));
      
      if (state.trigFunction === 'tan') {
        calculationSteps.push(t('trigonometry:trigonometric_functions.steps.tangent_identity'));
        calculationSteps.push(t('trigonometry:trigonometric_functions.steps.verify_tangent', { 
          value: roundToDecimals(valueInRadians, 4), 
          result: roundToDecimals(sinVal / cosVal, 6)
        }));
      }
      
      // Adicionar solução final após a verificação
      calculationSteps.push(t('trigonometry:trigonometric_functions.steps.final_solution', { 
        function: state.trigFunction, 
        input: value, 
        unit: state.inputUnit === 'degrees' ? '°' : '', 
        result: roundToDecimals(calculatedResult, 6),
        result_unit: ''
      }));
    }
    // Para funções trigonométricas inversas (asin, acos, atan)
    else if (['asin', 'acos', 'atan'].includes(state.trigFunction)) {
      calculationSteps.push(t('trigonometry:trigonometric_functions.steps.calculate_inverse', { 
        step: stepCount, 
        function: state.trigFunction, 
        value: value 
      }));
      stepCount++;
      
      let explanation = '';
      switch (state.trigFunction) {
        case 'asin':
          if (value < -1 || value > 1) {
            dispatch({ 
              type: 'SET_ERROR', 
              message: t('trigonometry:trigonometric_functions.errors.invalid_arcsin')
            });
            return;
          }
          explanation = t('trigonometry:trigonometric_functions.steps.arcsin_explanation');
          calculatedResult = Math.asin(value);
          break;
        case 'acos':
          if (value < -1 || value > 1) {
            dispatch({ 
              type: 'SET_ERROR', 
              message: t('trigonometry:trigonometric_functions.errors.invalid_arccos')
            });
            return;
          }
          explanation = t('trigonometry:trigonometric_functions.steps.arccos_explanation');
          calculatedResult = Math.acos(value);
          break;
        case 'atan':
          explanation = t('trigonometry:trigonometric_functions.steps.arctan_explanation');
          calculatedResult = Math.atan(value);
          break;
        default:
          dispatch({ 
            type: 'SET_ERROR', 
            message: t('trigonometry:trigonometric_functions.errors.function_not_recognized')
          });
          return;
      }
      
      calculationSteps.push(explanation);
      calculationSteps.push(t('trigonometry:trigonometric_functions.steps.inverse_result', { 
        function: state.trigFunction, 
        value: value, 
        result: roundToDecimals(calculatedResult, 6)
      }));
      
      // Verifica se precisa converter o resultado para graus
      if (state.outputUnit === 'degrees') {
        const resultInDegrees = radiansToDegrees(calculatedResult);
        calculationSteps.push(t('trigonometry:trigonometric_functions.steps.convert_to_degrees', { step: stepCount }));
        calculationSteps.push(t('trigonometry:trigonometric_functions.steps.convert_output_formula'));
        calculationSteps.push(t('trigonometry:trigonometric_functions.steps.convert_output_calculation', { 
          radians: roundToDecimals(calculatedResult, 6), 
          degrees: roundToDecimals(resultInDegrees, 6)
        }));
        calculatedResult = resultInDegrees;
        stepCount++;
      } else {
        calculationSteps.push(t('trigonometry:trigonometric_functions.steps.output_unit', { step: stepCount }));
        calculationSteps.push(t('trigonometry:trigonometric_functions.steps.already_output_radians'));
        stepCount++;
      }
      
      // Verificação da função inversa
      calculationSteps.push(t('trigonometry:trigonometric_functions.steps.verify_inverse', { step: stepCount }));
      const directFunction = state.trigFunction.substring(1);
      const verification = state.trigFunction === 'asin' ? Math.sin(calculatedResult) :
                          state.trigFunction === 'acos' ? Math.cos(calculatedResult) :
                          Math.tan(calculatedResult);
      
      calculationSteps.push(t('trigonometry:trigonometric_functions.steps.applying_direct', { 
        direct_function: directFunction, 
        result: roundToDecimals(calculatedResult, 6), 
        verification: roundToDecimals(verification, 6)
      }));
      calculationSteps.push(t('trigonometry:trigonometric_functions.steps.original_value', { value: value }));
      calculationSteps.push(t('trigonometry:trigonometric_functions.steps.rounding_difference', { 
        diff: roundToDecimals(Math.abs(verification - value), 8)
      }));
      
      // Adicionar solução final após a verificação
      calculationSteps.push(t('trigonometry:trigonometric_functions.steps.final_solution', { 
        function: state.trigFunction, 
        input: value, 
        unit: '', 
        result: roundToDecimals(calculatedResult, 6),
        result_unit: state.outputUnit === 'degrees' ? '°' : ' rad'
      }));
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