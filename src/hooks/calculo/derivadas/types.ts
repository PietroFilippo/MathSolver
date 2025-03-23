// Interfaces para o conceito matemático
export interface RuleDerivative {
  nome: string;
  formula?: string;
  explicacao: string;
  exemplo?: string;
  corDestaque: string;
}

export interface CategoryDerivative {
  nome: string;
  regras: RuleDerivative[];
}

export interface DerivadaConceito {
  titulo: string;
  descricao: string;
  categorias: CategoryDerivative[];
}

// Interface para o estado das derivadas
export interface DerivativasState {
  funcao: string;
  variavel: string;
  ordem: string;
  tipoDerivada: 'simbolica' | 'ponto';
  pontosAvaliacao: string;
  resultado: string | null;
  passos: string[];
  erro: string | null;
  showExplanation: boolean;
  showDisclaimer: boolean;
  showConceitoMatematico: boolean;
}

// Tipos de ações para o reducer
export type DerivativasAction =
  | { type: 'SET_FUNCAO'; value: string }
  | { type: 'SET_VARIAVEL'; value: string }
  | { type: 'SET_ORDEM'; value: string }
  | { type: 'SET_TIPO_DERIVADA'; tipoDerivada: 'simbolica' | 'ponto' }
  | { type: 'SET_PONTO_AVALIACAO'; pontosAvaliacao: string }
  | { type: 'SET_RESULT'; resultado: string; passos: string[] }
  | { type: 'SET_ERROR'; message: string }
  | { type: 'TOGGLE_EXPLANATION' }
  | { type: 'TOGGLE_DISCLAIMER' }
  | { type: 'TOGGLE_CONCEITO_MATEMATICO' }
  | { type: 'RESET' }
  | { type: 'APPLY_EXAMPLE'; example: string }
  | { type: 'APPLY_POINT_EXAMPLE'; funcao: string; ponto: string }; 