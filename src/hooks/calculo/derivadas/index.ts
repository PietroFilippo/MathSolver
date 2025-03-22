import { useReducer, useMemo } from 'react';
import { derivativasReducer, initialState } from './reducer';
import { derivativesMathematicalConcept } from './concepts';
import { 
  getDerivativesExamples,
  generateDerivativeSteps,
  processStepsWithNumbering
} from './utils';
import { DerivativasState, DerivativasAction, DerivadaConceito } from './types';

// Re-exportação de tipos para consumidores
export type { DerivativasState, DerivativasAction, DerivadaConceito };

export function useDerivativasSolver() {
  const [state, dispatch] = useReducer(derivativasReducer, initialState);
  
  // Já não precisamos mais de typecast, pois o objeto está definido aqui com tipo correto
  const conceitoDerivadas = derivativesMathematicalConcept;

  // Obter exemplos de funções - memoizado para evitar recálculos desnecessários
  const getExamples = useMemo(() => {
    return () => getDerivativesExamples();
  }, []);

  // Aplicar um exemplo
  const applyExample = (example: string) => {
    dispatch({ type: 'APPLY_EXAMPLE', example });
  };

  // Processa os passos para adicionar numeração e consolidar passos excessivos - versão memoizada
  const processStepsWithMemo = useMemo(() => {
    return (steps: string[]): string[] => processStepsWithNumbering(steps);
  }, []);

  // Memoiza o cálculo da derivada para evitar recálculos desnecessários
  const calculateMemoizedDerivative = useMemo(() => {
    return (expressao: string, variavel: string, ordem: number) => {
      return generateDerivativeSteps(expressao, variavel, ordem);
    };
  }, []);

  // Função principal de resolução
  const handleSolve = () => {
    // Resetar o estado anterior
    dispatch({ type: 'RESET' });
    
    // Validar entrada
    if (!state.funcao.trim()) {
      dispatch({ 
        type: 'SET_ERROR', 
        message: 'Por favor, insira uma função para derivar.' 
      });
      return;
    }
    
    if (!state.variavel.trim()) {
      dispatch({ 
        type: 'SET_ERROR', 
        message: 'Por favor, especifique a variável de derivação.' 
      });
      return;
    }
    
    // Validar ordem da derivada
    const orderNum = parseInt(state.ordem);
    if (isNaN(orderNum) || orderNum < 1) {
      dispatch({ 
        type: 'SET_ERROR', 
        message: 'A ordem da derivada deve ser um número inteiro positivo.' 
      });
      return;
    }
    
    try {
      // Calcular a derivada usando a função memoizada
      const resultadoDerivada = calculateMemoizedDerivative(state.funcao, state.variavel, orderNum);
      
      // Processar os passos para adicionar numeração usando a função memoizada
      const processedSteps = processStepsWithMemo(resultadoDerivada.passos);
      
      // Atualizar o estado com o resultado e os passos
      dispatch({
        type: 'SET_RESULT',
        resultado: resultadoDerivada.resultado,
        passos: processedSteps
      });
    } catch (error) {
      if (error instanceof Error) {
        dispatch({ type: 'SET_ERROR', message: error.message });
      } else {
        dispatch({ type: 'SET_ERROR', message: 'Ocorreu um erro ao calcular a derivada.' });
      }
    }
  };

  return {
    state,
    dispatch,
    getExamples,
    applyExample,
    handleSolve,
    conceitoDerivadas
  };
}

// Exporta o hook como padrão e também como exportação nomeada
export default useDerivativasSolver;

// Re-exporta conceitos
export { derivativesMathematicalConcept } from './concepts'; 