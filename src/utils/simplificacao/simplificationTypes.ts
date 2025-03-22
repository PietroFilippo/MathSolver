import { Term } from '../mathUtilsCalculo/geral/termDefinition';

// Interface para o resultado da simplificação
export interface SimplificationResult {
  term: Term;
  wasSimplified: boolean;
} 