import { InequacoesState, InequacoesAction } from './types';
import { TipoInequacao } from '../../../utils/mathUtilsAlgebra/inequalities/algebraInequalityTypes';
import { detectTipoInequacao } from './utils';

export const initialState: InequacoesState = {
  inequacao: '',
  operacao: 'resolver',
  tipoInequacao: 'linear',
  valorVerificar: '',
  resultado: undefined,
  intervaloSolucao: undefined,
  passos: [],
  erro: null,
  showExplanation: true,
  showConceitoMatematico: false,
  showDisclaimer: true
};

export function inequacoesReducer(state: InequacoesState, action: InequacoesAction): InequacoesState {
  switch (action.type) {
    case 'SET_INEQUACAO':
      return {
        ...state,
        inequacao: action.value,
        // Tentando detectar automaticamente o tipo de inequação
        tipoInequacao: detectTipoInequacao(action.value)
      };
    
    case 'SET_OPERACAO':
      return {
        ...state,
        operacao: action.operacao
      };
    
    case 'SET_TIPO_INEQUACAO':
      return {
        ...state,
        tipoInequacao: action.tipoInequacao
      };
    
    case 'SET_VALOR_VERIFICAR':
      return {
        ...state,
        valorVerificar: action.value
      };
    
    case 'SET_RESULTADO':
      return {
        ...state,
        resultado: action.payload.resultado,
        intervaloSolucao: action.payload.intervaloSolucao,
        passos: action.payload.passos,
        erro: null,
        showExplanation: true
      };
    
    case 'SET_ERRO':
      return {
        ...state,
        erro: action.erro,
        resultado: undefined,
        intervaloSolucao: undefined,
        passos: []
      };
    
    case 'TOGGLE_EXPLANATION':
      return {
        ...state,
        showExplanation: !state.showExplanation
      };
    
    case 'TOGGLE_CONCEITO_MATEMATICO':
      return {
        ...state,
        showConceitoMatematico: !state.showConceitoMatematico
      };
    
    case 'TOGGLE_DISCLAIMER':
      return {
        ...state,
        showDisclaimer: !state.showDisclaimer
      };
    
    case 'RESET':
      return {
        ...initialState,
        showDisclaimer: state.showDisclaimer
      };
    
    default:
      return state;
  }
} 