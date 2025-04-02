// Interfaces para o conceito matemático
export interface RuleAlgebraica {
  nome: string;
  formula?: string;
  explicacao: string;
  exemplo?: string;
  corDestaque: string;
}

export interface CategoryAlgebraica {
  nome: string;
  regras: RuleAlgebraica[];
}

export interface AlgebraicaConceito {
  titulo: string;
  descricao: string;
  categorias: CategoryAlgebraica[];
}

// Interface para o estado das expressões algébricas
export interface ExpressoesAlgebraicasState {
  expressao: string;
  operacao: 'simplificar' | 'expandir' | 'fatorar';
  resultado: string | null;
  passos: string[];
  erro: string | null;
  showExplanation: boolean;
  showDisclaimer: boolean;
  showConceitoMatematico: boolean;
}

// Tipos de ações para o reducer
export type ExpressoesAlgebraicasAction =
  | { type: 'SET_EXPRESSAO'; value: string }
  | { type: 'SET_OPERACAO'; operacao: 'simplificar' | 'expandir' | 'fatorar' }
  | { type: 'SET_RESULT'; resultado: string; passos: string[] }
  | { type: 'SET_ERROR'; message: string }
  | { type: 'TOGGLE_EXPLANATION' }
  | { type: 'TOGGLE_DISCLAIMER' }
  | { type: 'TOGGLE_CONCEITO_MATEMATICO' }
  | { type: 'RESET' }
  | { type: 'APPLY_EXAMPLE'; example: string; operacao: 'simplificar' | 'expandir' | 'fatorar' }; 