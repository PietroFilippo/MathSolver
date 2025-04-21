import { useReducer, useCallback } from 'react';
import { InequacoesState, InequacoesAction } from './types';
import { PassoResolucao, TipoInequacao } from '../../../utils/mathUtilsAlgebra/inequalities/algebraInequalityTypes';
import { inequacoesReducer, initialState } from './reducer';
import { 
  solveInequalityWithSteps as solveInequality, 
  checkValueSatisfiesInequality 
} from './utils';
import { conceitoInequacoes, getExamplesInequacoes } from './concepts';

export const useInequacoesSolver = () => {
  const [state, dispatch] = useReducer(inequacoesReducer, initialState);
  
  // Gerencia a solução da inequação
  const handleSolve = useCallback(() => {
    if (!state.inequacao) {
      dispatch({ 
        type: 'SET_ERRO', 
        erro: 'Por favor, insira uma inequação para resolver.' 
      });
      return;
    }
    
    try {
      if (state.operacao === 'resolver') {
        // Resolver a inequação
        const { resultado, intervaloSolucao, passos } = solveInequality(
          state.inequacao, 
          state.tipoInequacao
        );
        
        dispatch({
          type: 'SET_RESULTADO',
          payload: {
            resultado,
            intervaloSolucao,
            passos
          }
        });
      } else if (state.operacao === 'verificarSolucao') {
        // Verificar se um valor satisfaz a inequação
        if (!state.valorVerificar) {
          dispatch({ 
            type: 'SET_ERRO', 
            erro: 'Por favor, insira um valor para verificar.' 
          });
          return;
        }
        
        const { resultado, passos } = checkValueSatisfiesInequality(
          state.inequacao,
          state.valorVerificar
        );
        
        dispatch({
          type: 'SET_RESULTADO',
          payload: {
            resultado: resultado 
              ? `O valor ${state.valorVerificar} satisfaz a inequação.` 
              : `O valor ${state.valorVerificar} não satisfaz a inequação.`,
            passos
          }
        });
      }
    } catch (error) {
      dispatch({ 
        type: 'SET_ERRO', 
        erro: `Erro: ${error instanceof Error ? error.message : String(error)}` 
      });
    }
  }, [state.inequacao, state.operacao, state.tipoInequacao, state.valorVerificar]);
  
  // Helper para obter exemplos com base no tipo de inequação
  const getExamples = useCallback(() => {
    return getExamplesInequacoes(state.tipoInequacao);
  }, [state.tipoInequacao]);
  
  // Helper para aplicar um exemplo
  const applyExample = useCallback((example: string, tipoInequacao: TipoInequacao) => {
    dispatch({ type: 'SET_INEQUACAO', value: example });
    dispatch({ type: 'SET_TIPO_INEQUACAO', tipoInequacao });
  }, []);
  
  return {
    state,
    dispatch,
    handleSolve,
    getExamples,
    applyExample,
    conceitoInequacoes
  };
};

export default useInequacoesSolver; 