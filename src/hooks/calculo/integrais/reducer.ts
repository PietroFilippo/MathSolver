import { IntegraisState, IntegraisAction } from './types';

// Estado inicial
export const initialState: IntegraisState = {
  funcao: '',
  variavel: 'x',
  tipoIntegral: 'indefinida',
  limiteInferior: '0',
  limiteSuperior: '1',
  resultado: '',
  passos: [],
  erro: null,
  showExplanation: true,
  showDisclaimer: true,
  showConceitoMatematico: true
};

// Função reducer
export function integraisReducer(
  state: IntegraisState, 
  action: IntegraisAction
): IntegraisState {
  switch (action.type) {
    case 'SET_FUNCTION':
      return { ...state, funcao: action.funcao };
    case 'SET_VARIABLE':
      return { ...state, variavel: action.variavel };
    case 'SET_INTEGRAL_TYPE':
      return { ...state, tipoIntegral: action.tipoIntegral };
    case 'SET_LOWER_LIMIT':
      return { ...state, limiteInferior: action.limiteInferior };
    case 'SET_UPPER_LIMIT':
      return { ...state, limiteSuperior: action.limiteSuperior };
    case 'SET_RESULT':
      return {
        ...state,
        resultado: action.resultado,
        passos: action.passos,
        erro: null,
        showExplanation: action.showExplanation ?? state.showExplanation
      };
    case 'SET_ERROR':
      return { 
        ...state, 
        erro: action.message, 
        resultado: '', 
        passos: []
      };
    case 'TOGGLE_EXPLANATION':
      return { ...state, showExplanation: !state.showExplanation };
    case 'TOGGLE_DISCLAIMER':
      return { ...state, showDisclaimer: !state.showDisclaimer };
    case 'TOGGLE_CONCEITO_MATEMATICO':
      return { ...state, showConceitoMatematico: !state.showConceitoMatematico };
    case 'CLEAR':
      return {
        ...initialState,
        showExplanation: state.showExplanation,
        showDisclaimer: state.showDisclaimer,
        showConceitoMatematico: state.showConceitoMatematico
      };
    case 'APPLY_EXAMPLE':
      return { 
        ...state,
        funcao: action.example,
        resultado: '',
        passos: [],
        erro: null
      };
    case 'SET_FUNCAO':
      return { ...state, funcao: action.value };
    case 'SET_VARIAVEL':
      return { ...state, variavel: action.value };
    case 'SET_TIPO_INTEGRAL':
      return { ...state, tipoIntegral: action.value };
    case 'SET_LIMITE_INFERIOR':
      return { ...state, limiteInferior: action.value };
    case 'SET_LIMITE_SUPERIOR':
      return { ...state, limiteSuperior: action.value };
    case 'RESET':
      return {
        ...state,
        resultado: '',
        passos: [],
        erro: null
      };
    default:
      return state;
  }
} 