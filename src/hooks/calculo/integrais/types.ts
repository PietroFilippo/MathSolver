// Interfaces para o conceito matemático
export interface RuleIntegral {
  nome: string;
  formula?: string;
  explicacao: string;
  exemplo?: string;
  corDestaque: string;
}

export interface CategoryIntegral {
  nome: string;
  regras: RuleIntegral[];
}

export interface IntegralConceito {
  titulo: string;
  descricao: string;
  categorias: CategoryIntegral[];
}

// Interface para o estado das integrais
export interface IntegraisState {
  funcao: string;
  variavel: string;
  tipoIntegral: 'indefinida' | 'definida';
  limiteInferior: string;
  limiteSuperior: string;
  resultado: string;
  passos: string[];
  erro: string | null;
  showExplanation: boolean;
  showDisclaimer: boolean;
  showConceitoMatematico: boolean;
}

// Tipos de ações para o reducer
export type IntegraisAction =
  | { type: 'SET_FUNCTION'; funcao: string }
  | { type: 'SET_VARIABLE'; variavel: string }
  | { type: 'SET_INTEGRAL_TYPE'; tipoIntegral: 'indefinida' | 'definida' }
  | { type: 'SET_LOWER_LIMIT'; limiteInferior: string }
  | { type: 'SET_UPPER_LIMIT'; limiteSuperior: string }
  | { type: 'SET_RESULT'; resultado: string; passos: string[]; showExplanation?: boolean }
  | { type: 'SET_ERROR'; message: string }
  | { type: 'TOGGLE_EXPLANATION' }
  | { type: 'TOGGLE_DISCLAIMER' }
  | { type: 'TOGGLE_CONCEITO_MATEMATICO' }
  | { type: 'CLEAR' }
  | { type: 'APPLY_EXAMPLE'; example: string }
  | { type: 'SET_FUNCAO'; value: string }
  | { type: 'SET_VARIAVEL'; value: string }
  | { type: 'SET_TIPO_INTEGRAL'; value: 'indefinida' | 'definida' }
  | { type: 'SET_LIMITE_INFERIOR'; value: string }
  | { type: 'SET_LIMITE_SUPERIOR'; value: string }
  | { type: 'RESET' }; 