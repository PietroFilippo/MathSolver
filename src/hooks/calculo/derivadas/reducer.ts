import { DerivativasState, DerivativasAction } from './types';

// Estado inicial
export const initialState: DerivativasState = {
  funcao: '',
  variavel: 'x',
  ordem: '1',
  resultado: null,
  passos: [],
  erro: null,
  showExplanation: true,
  showDisclaimer: true,
  showConceitoMatematico: true
};

// Função reducer
export function derivativasReducer(
  state: DerivativasState, 
  action: DerivativasAction
): DerivativasState {
  switch (action.type) {
    case 'SET_FUNCAO':
      return { ...state, funcao: action.value };
    case 'SET_VARIAVEL':
      return { ...state, variavel: action.value };
    case 'SET_ORDEM':
      return { ...state, ordem: action.value };
    case 'SET_RESULT':
      return {
        ...state,
        resultado: action.resultado,
        passos: action.passos,
        erro: null
      };
    case 'SET_ERROR':
      return { 
        ...state, 
        erro: action.message, 
        resultado: null, 
        passos: []
      };
    case 'TOGGLE_EXPLANATION':
      return { ...state, showExplanation: !state.showExplanation };
    case 'TOGGLE_DISCLAIMER':
      return { ...state, showDisclaimer: !state.showDisclaimer };
    case 'TOGGLE_CONCEITO_MATEMATICO':
      return { ...state, showConceitoMatematico: !state.showConceitoMatematico };
    case 'RESET':
      return {
        ...state,
        resultado: null,
        passos: [],
        erro: null
      };
    case 'APPLY_EXAMPLE':
      return { 
        ...state,
        funcao: action.example,
        resultado: null,
        passos: [],
        erro: null
      };
    default:
      return state;
  }
} 