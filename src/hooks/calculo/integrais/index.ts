import { useReducer, useMemo, useCallback } from 'react';
import { integraisReducer, initialState } from './reducer';
import { IntegraisState, IntegraisAction } from './types';
import { generateIntegralSteps, processStepsWithNumbering, getIntegralsExamples, getDefinedIntegralsExamples } from './utils';
import { conceitoIntegrais } from './concepts';

// Re-exportação de tipos para consumidores
export type { IntegraisState, IntegraisAction };

// Re-exportação de todos os componentes desta pasta
export * from './types';
export * from './reducer';
export * from './utils';
export * from './concepts';

export function useIntegraisSolver() {
  const [state, dispatch] = useReducer(integraisReducer, initialState);

  // Memoiza exemplos por tipo de integral
  const examples = useMemo(() => {
    if (state.tipoIntegral === 'indefinida') {
      return getIntegralsExamples();
    } else {
      return getDefinedIntegralsExamples();
    }
  }, [state.tipoIntegral]);

  // Memoiza os conceitos
  const conceitos = useMemo(() => {
    return conceitoIntegrais;
  }, []);

  // Processa passos com memoização
  const processStepsWithMemo = useCallback((steps: string[]): string[] => {
    return processStepsWithNumbering(steps);
  }, []);

  // Memoiza o cálculo da integral para evitar recálculos em rerenderizações
  const calculateMemoizedIntegral = useCallback((
    expressao: string,
    variavel: string,
    tipoIntegral: 'indefinida' | 'definida',
    limiteInferior?: string,
    limiteSuperior?: string
  ) => {
    try {
      return generateIntegralSteps(
        expressao,
        variavel,
        tipoIntegral,
        limiteInferior,
        limiteSuperior
      );
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Erro ao calcular integral: ${error.message}`);
      }
      throw error;
    }
  }, []);

  // Trata a resolução da integral
  const handleSolve = useCallback(() => {
    try {
      if (!state.funcao) {
        dispatch({ 
          type: 'SET_ERROR', 
          message: 'Por favor, insira uma função.' 
        });
        return;
      }

      const { funcao, variavel, tipoIntegral, limiteInferior, limiteSuperior } = state;

      // Verificar se os limites estão definidos quando a integral é definida
      if (tipoIntegral === 'definida' && (!limiteInferior || !limiteSuperior)) {
        dispatch({ 
          type: 'SET_ERROR', 
          message: 'Para integrais definidas, por favor, especifique os limites inferior e superior.' 
        });
        return;
      }

      // Calcular a integral usando a função memoizada
      const { resultado, passos } = calculateMemoizedIntegral(
        funcao,
        variavel,
        tipoIntegral,
        limiteInferior,
        limiteSuperior
      );

      // Processar os passos com a função memoizada
      const processedSteps = processStepsWithMemo(passos);

      // Atualizar o estado com o resultado
      dispatch({ 
        type: 'SET_RESULT', 
        resultado, 
        passos: processedSteps,
        showExplanation: true
      });
    } catch (error) {
      if (error instanceof Error) {
        dispatch({ 
          type: 'SET_ERROR', 
          message: error.message 
        });
      } else {
        dispatch({ 
          type: 'SET_ERROR', 
          message: 'Ocorreu um erro desconhecido.' 
        });
      }
    }
  }, [state, calculateMemoizedIntegral, processStepsWithMemo]);

  // Retorna a API do hook
  return {
    state,
    dispatch,
    handleSolve,
    examples,
    conceitos
  };
}

// Exporta o hook como padrão
export default useIntegraisSolver; 