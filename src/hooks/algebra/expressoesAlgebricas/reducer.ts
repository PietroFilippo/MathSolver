import { ExpressoesAlgebraicasState, ExpressoesAlgebraicasAction } from './types';

// Estado inicial
export const initialState: ExpressoesAlgebraicasState = {
  expressao: '',
  operacao: 'simplificar', // Valor padrão: simplificar expressão
  resultado: null,
  passos: [],
  erro: null,
  showExplanation: true,
  showDisclaimer: true,
  showConceitoMatematico: true
};

// Função reducer
export function expressoesAlgebraicasReducer(
  state: ExpressoesAlgebraicasState, 
  action: ExpressoesAlgebraicasAction
): ExpressoesAlgebraicasState {
  switch (action.type) {
    case 'SET_EXPRESSAO':
      return { ...state, expressao: action.value };
    case 'SET_OPERACAO':
      return { ...state, operacao: action.operacao };
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
        expressao: action.example,
        operacao: action.operacao,
        resultado: null,
        passos: [],
        erro: null
      };
    default:
      return state;
  }
} 