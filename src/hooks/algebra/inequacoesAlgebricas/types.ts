import { PassoResolucao, TipoInequacao } from '../../../utils/mathUtilsAlgebra/inequalities/algebraInequalityTypes';

export type OperacaoInequacao = 'resolver' | 'verificarSolucao';

export interface InequalityState {
  inequacao: string;
  tipoInequacao: TipoInequacao;
  operacao: OperacaoInequacao;
  valorParaVerificar?: string;
  resultado?: string;
  intervaloSolucao?: string;
  passos: string[];
  erro?: string;
}

export interface InequalityAction {
  type: 'SET_INEQUACAO' | 'SET_TIPO' | 'SET_OPERACAO' | 'SET_VALOR' | 'SET_RESULTADO' | 'SET_ERRO' | 'RESET';
  payload?: any;
}

export interface InequalityContextType {
  state: InequalityState;
  dispatch: React.Dispatch<InequalityAction>;
}

export interface CategoriaConceito {
  nome: string;
  regras: {
    nome?: string;
    formula?: string;
    explicacao: string;
    exemplo?: string;
    corDestaque?: 'blue' | 'green' | 'purple' | 'amber' | 'cyan' | 'red';
  }[];
}

export interface ConceitoInequacoes {
  descricao: string;
  categorias: CategoriaConceito[];
}

export interface InequacoesState {
  inequacao: string;
  operacao: OperacaoInequacao;
  tipoInequacao: TipoInequacao;
  valorVerificar?: string;
  resultado?: string;
  intervaloSolucao?: string;
  passos: string[];
  erro: string | null;
  showExplanation: boolean;
  showConceitoMatematico: boolean;
  showDisclaimer: boolean;
}

export type InequacoesAction =
  | { type: 'SET_INEQUACAO'; value: string }
  | { type: 'SET_OPERACAO'; operacao: OperacaoInequacao }
  | { type: 'SET_TIPO_INEQUACAO'; tipoInequacao: TipoInequacao }
  | { type: 'SET_VALOR_VERIFICAR'; value: string }
  | { type: 'SET_RESULTADO'; payload: { resultado: string; intervaloSolucao?: string; passos: string[] } }
  | { type: 'SET_ERRO'; erro: string | null }
  | { type: 'TOGGLE_EXPLANATION' }
  | { type: 'TOGGLE_CONCEITO_MATEMATICO' }
  | { type: 'TOGGLE_DISCLAIMER' }
  | { type: 'RESET' }; 