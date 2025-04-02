import { useReducer, useMemo } from 'react';
import { expressoesAlgebraicasReducer, initialState } from './reducer';
import { algebraicExpressionsConceptsAndRules } from './concepts';
import { 
  getAlgebraicSimplificationExamples, 
  getAlgebraicExpansionExamples,
  getAlgebraicFactorizationExamples,
  simplifyAlgebraicExpression,
  expandAlgebraicExpression,
  factorAlgebraicExpression,
  processStepsWithNumbering
} from './utils';
import { ExpressoesAlgebraicasState, ExpressoesAlgebraicasAction, AlgebraicaConceito } from './types';

// Re-exportação de tipos para consumidores
export type { ExpressoesAlgebraicasState, ExpressoesAlgebraicasAction, AlgebraicaConceito };

export function useExpressoesAlgebraicasSolver() {
  const [state, dispatch] = useReducer(expressoesAlgebraicasReducer, initialState);
  
  // Conceito matemático para expressões algébricas
  const conceitoExpressoesAlgebricas = algebraicExpressionsConceptsAndRules;

  // Obter exemplos de expressões para simplificação
  const getSimplificationExamples = useMemo(() => {
    return () => getAlgebraicSimplificationExamples();
  }, []);

  // Obter exemplos de expressões para expansão
  const getExpansionExamples = useMemo(() => {
    return () => getAlgebraicExpansionExamples();
  }, []);

  // Obter exemplos de expressões para fatoração
  const getFactorizationExamples = useMemo(() => {
    return () => getAlgebraicFactorizationExamples();
  }, []);

  // Retorna exemplos baseados na operação atual
  const getExamples = () => {
    switch (state.operacao) {
      case 'simplificar':
        return getSimplificationExamples();
      case 'expandir':
        return getExpansionExamples();
      case 'fatorar':
        return getFactorizationExamples();
      default:
        return getSimplificationExamples();
    }
  };

  // Aplicar um exemplo
  const applyExample = (example: string, operacao: 'simplificar' | 'expandir' | 'fatorar') => {
    dispatch({ type: 'APPLY_EXAMPLE', example, operacao });
  };

  // Processa os passos para adicionar numeração e consolidar passos excessivos
  const processStepsWithMemo = useMemo(() => {
    return (steps: string[]): string[] => processStepsWithNumbering(steps);
  }, []);

  // Função principal de resolução
  const handleSolve = () => {
    // Resetar o estado anterior
    dispatch({ type: 'RESET' });
    
    // Validar entrada
    if (!state.expressao.trim()) {
      dispatch({ 
        type: 'SET_ERROR', 
        message: 'Por favor, insira uma expressão para processar.' 
      });
      return;
    }
    
    try {
      let result;
      
      // Escolher o método de processamento baseado na operação selecionada
      switch (state.operacao) {
        case 'simplificar':
          result = simplifyAlgebraicExpression(state.expressao);
          break;
        case 'expandir':
          result = expandAlgebraicExpression(state.expressao);
          break;
        case 'fatorar':
          result = factorAlgebraicExpression(state.expressao);
          break;
        default:
          throw new Error('Operação não suportada.');
      }
      
      // Processar os passos para adicionar numeração
      const processedSteps = processStepsWithMemo(result.steps);
      
      // Atualizar o estado com o resultado e os passos
      dispatch({
        type: 'SET_RESULT',
        resultado: result.result,
        passos: processedSteps
      });
    } catch (error) {
      if (error instanceof Error) {
        dispatch({ type: 'SET_ERROR', message: error.message });
      } else {
        dispatch({ type: 'SET_ERROR', message: 'Ocorreu um erro ao processar a expressão algébrica.' });
      }
    }
  };

  return {
    state,
    dispatch,
    getExamples,
    getSimplificationExamples,
    getExpansionExamples,
    getFactorizationExamples,
    applyExample,
    handleSolve,
    conceitoExpressoesAlgebricas
  };
}

// Exporta o hook como padrão e também como exportação nomeada
export default useExpressoesAlgebraicasSolver;

// Re-exporta conceitos
export { algebraicExpressionsConceptsAndRules } from './concepts'; 