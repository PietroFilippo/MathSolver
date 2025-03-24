import { useReducer } from 'react';
import { roundToDecimals } from '../../utils/mathUtils';

// Definições de tipo
type ExpType = 'exponenciacao' | 'radicacao';

// Interface de estado
type State = {
  expType: ExpType;
  base: string;
  expoente: string;
  indiceRaiz: string;
  radicando: string;
  result: number | null;
  steps: string[];
  errorMessage: string | null;
  showExplanation: boolean;
  showConceitoMatematico: boolean;
};

// Tipos de ações
type Action =
  | { type: 'SET_EXP_TYPE'; expType: ExpType }
  | { type: 'SET_BASE'; base: string }
  | { type: 'SET_EXPOENTE'; expoente: string }
  | { type: 'SET_INDICE_RAIZ'; indiceRaiz: string }
  | { type: 'SET_RADICANDO'; radicando: string }
  | { type: 'RESET_CALCULATION' }
  | { type: 'SET_RESULT'; result: number; steps: string[] }
  | { type: 'SET_ERROR'; message: string }
  | { type: 'TOGGLE_EXPLANATION' }
  | { type: 'TOGGLE_CONCEITO_MATEMATICO' }
  | { type: 'APPLY_EXAMPLE'; example: { type: ExpType; base?: number | string; expoente?: number | string; indiceRaiz?: number | string; radicando?: number | string } };

// Estado inicial
const initialState: State = {
  expType: 'exponenciacao',
  base: '',
  expoente: '',
  indiceRaiz: '2',
  radicando: '',
  result: null,
  steps: [],
  errorMessage: null,
  showExplanation: false,
  showConceitoMatematico: true,
};

// Função reducer
function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_EXP_TYPE':
      return { ...state, expType: action.expType };
    case 'SET_BASE':
      return { ...state, base: action.base };
    case 'SET_EXPOENTE':
      return { ...state, expoente: action.expoente };
    case 'SET_INDICE_RAIZ':
      return { ...state, indiceRaiz: action.indiceRaiz };
    case 'SET_RADICANDO':
      return { ...state, radicando: action.radicando };
    case 'RESET_CALCULATION':
      return {
        ...state,
        result: null,
        steps: [],
        errorMessage: null,
        showExplanation: false
      };
    case 'SET_RESULT':
      return {
        ...state,
        result: action.result,
        steps: action.steps,
        errorMessage: null,
        showExplanation: true
      };
    case 'SET_ERROR':
      return {
        ...state,
        errorMessage: action.message,
        result: null,
        steps: []
      };
    case 'TOGGLE_EXPLANATION':
      return { ...state, showExplanation: !state.showExplanation };
    case 'TOGGLE_CONCEITO_MATEMATICO':
      return { ...state, showConceitoMatematico: !state.showConceitoMatematico };
    case 'APPLY_EXAMPLE':
      return {
        ...state,
        expType: action.example.type,
        base: action.example.base !== undefined ? String(action.example.base) : state.base,
        expoente: action.example.expoente !== undefined ? String(action.example.expoente) : state.expoente,
        indiceRaiz: action.example.indiceRaiz !== undefined ? String(action.example.indiceRaiz) : state.indiceRaiz,
        radicando: action.example.radicando !== undefined ? String(action.example.radicando) : state.radicando,
      };
    default:
      return state;
  }
}

// Gerar passos para exponenciação
function generateExponentiationSteps(base: number, expoente: number): string[] {
  const calculationSteps: string[] = [];
  let stepCount = 1;
  
  calculationSteps.push(`Equação original: ${base}^${expoente}`);
  calculationSteps.push(`Passo ${stepCount++}: Identificando a base e o expoente.`);
  calculationSteps.push(`Temos que a base é ${base} e o expoente é ${expoente}.`);
  
  // Casos especiais
  if (base === 0 && expoente === 0) {
    calculationSteps.push(`Passo ${stepCount++}: Caso especial - indeterminação.`);
    calculationSteps.push(`A expressão 0^0 é uma indeterminação matemática.`);
    calculationSteps.push(`Por convenção, em contextos computacionais, geralmente definimos 0^0 = 1.`);
    calculationSteps.push(`Solução final: ${base}^${expoente} = 1`);
    return calculationSteps;
  }
  
  if (base === 0 && expoente < 0) {
    calculationSteps.push(`Passo ${stepCount++}: Caso especial - divisão por zero.`);
    calculationSteps.push(`A expressão 0^${expoente} não está definida para expoentes negativos, pois resultaria em divisão por zero.`);
    return calculationSteps;
  }
  
  if (expoente === 0) {
    calculationSteps.push(`Passo ${stepCount++}: Aplicando a propriedade de potenciação.`);
    calculationSteps.push(`Pela propriedade dos expoentes, qualquer número (exceto 0) elevado a 0 é igual a 1.`);
    calculationSteps.push(`Simplificando: ${base}^0 = 1`);
    calculationSteps.push(`Solução final: ${base}^0 = 1`);
    return calculationSteps;
  }
  
  if (base === 0) {
    calculationSteps.push(`Passo ${stepCount++}: Aplicando a propriedade de potenciação.`);
    calculationSteps.push(`Qualquer número 0 elevado a um expoente positivo é igual a 0.`);
    calculationSteps.push(`Simplificando: 0^${expoente} = 0`);
    calculationSteps.push(`Solução final: 0^${expoente} = 0`);
    return calculationSteps;
  }
  
  if (base === 1) {
    calculationSteps.push(`Passo ${stepCount++}: Aplicando a propriedade de potenciação.`);
    calculationSteps.push(`O número 1 elevado a qualquer expoente é igual a 1.`);
    calculationSteps.push(`Simplificando: 1^${expoente} = 1`);
    calculationSteps.push(`Solução final: 1^${expoente} = 1`);
    return calculationSteps;
  }
  
  if (expoente === 1) {
    calculationSteps.push(`Passo ${stepCount++}: Aplicando a propriedade de potenciação.`);
    calculationSteps.push(`Qualquer número elevado a 1 é igual ao próprio número.`);
    calculationSteps.push(`Simplificando: ${base}^1 = ${base}`);
    calculationSteps.push(`Solução final: ${base}^1 = ${base}`);
    return calculationSteps;
  }
  
  // Caso geral
  calculationSteps.push(`Passo ${stepCount++}: Calculando a potência.`);
  
  if (Number.isInteger(expoente) && expoente > 0 && expoente <= 5) {
    // Para expoentes inteiros pequenos, mostrar a multiplicação passo a passo
    calculationSteps.push(`Calculando ${base}^${expoente} através de multiplicações sucessivas:`);
    let result = base;
    let expression = `${base}`;
    
    for (let i = 1; i < expoente; i++) {
      expression += ` × ${base}`;
      result *= base;
      calculationSteps.push(`${base}^${i+1} = ${expression} = ${result}`);
    }
    
    calculationSteps.push(`Solução final: ${base}^${expoente} = ${result}`);
  } else if (expoente < 0) {
    // Para expoentes negativos
    calculationSteps.push(`Como o expoente é negativo, aplicamos a regra: ${base}^${expoente} = 1/${base}^${-expoente}`);
    
    const positiveExp = -expoente;
    const positiveResult = Math.pow(base, positiveExp);
    const result = 1 / positiveResult;
    
    calculationSteps.push(`Primeiro calculamos ${base}^${positiveExp} = ${roundToDecimals(positiveResult, 6)}`);
    calculationSteps.push(`Em seguida: ${base}^${expoente} = 1/${roundToDecimals(positiveResult, 6)} = ${roundToDecimals(result, 6)}`);
    calculationSteps.push(`Solução final: ${base}^${expoente} = ${roundToDecimals(result, 6)}`);
  } else if (!Number.isInteger(expoente)) {
    // Para expoentes não inteiros
    calculationSteps.push(`Para expoentes não inteiros, utilizamos a definição de potência como função exponencial.`);
    
    const result = Math.pow(base, expoente);
    calculationSteps.push(`Calculando: ${base}^${expoente} = ${roundToDecimals(result, 6)}`);
    calculationSteps.push(`Solução final: ${base}^${expoente} = ${roundToDecimals(result, 6)}`);
  } else {
    // Para expoentes inteiros grandes
    calculationSteps.push(`Calculando diretamente: ${base}^${expoente}`);
    
    const result = Math.pow(base, expoente);
    calculationSteps.push(`Solução final: ${base}^${expoente} = ${roundToDecimals(result, 6)}`);
  }
  
  return calculationSteps;
}

// Gerar passos para radicação
function generateRootSteps(radicando: number, indiceRaiz: number): string[] {
  const calculationSteps: string[] = [];
  let stepCount = 1;
  
  calculationSteps.push(`Equação original: ${indiceRaiz === 2 ? '√' : `${indiceRaiz}√`}${radicando}`);
  calculationSteps.push(`Passo ${stepCount++}: Identificando o radicando e o índice da raiz.`);
  calculationSteps.push(`Temos que o radicando é ${radicando} e o índice da raiz é ${indiceRaiz}.`);
  
  // Casos especiais
  if (radicando < 0 && indiceRaiz % 2 === 0) {
    calculationSteps.push(`Passo ${stepCount++}: Caso especial - raiz de índice par de número negativo.`);
    calculationSteps.push(`A raiz de índice par de um número negativo não é um número real.`);
    calculationSteps.push(`Para ${indiceRaiz}√${radicando}, o resultado seria um número complexo.`);
    return calculationSteps;
  }
  
  if (radicando === 0) {
    calculationSteps.push(`Passo ${stepCount++}: Caso especial - raiz de zero.`);
    calculationSteps.push(`A raiz de qualquer índice de zero é igual a zero.`);
    calculationSteps.push(`Simplificando: ${indiceRaiz}√0 = 0`);
    calculationSteps.push(`Solução final: ${indiceRaiz}√0 = 0`);
    return calculationSteps;
  }
  
  if (radicando === 1) {
    calculationSteps.push(`Passo ${stepCount++}: Caso especial - raiz de um.`);
    calculationSteps.push(`A raiz de qualquer índice de um é igual a um.`);
    calculationSteps.push(`Simplificando: ${indiceRaiz}√1 = 1`);
    calculationSteps.push(`Solução final: ${indiceRaiz}√1 = 1`);
    return calculationSteps;
  }
  
  if (indiceRaiz === 1) {
    calculationSteps.push(`Passo ${stepCount++}: Caso especial - raiz de índice 1.`);
    calculationSteps.push(`A raiz de índice 1 de qualquer número é o próprio número.`);
    calculationSteps.push(`Simplificando: ¹√${radicando} = ${radicando}`);
    calculationSteps.push(`Solução final: ¹√${radicando} = ${radicando}`);
    return calculationSteps;
  }
  
  // Função auxiliar para encontrar o maior fator quadrado perfeito
  const findPerfectPowerFactor = (n: number, power: number): {factor: number, remaining: number} => {
    if (n <= 0) return { factor: 1, remaining: n };
    
    const absN = Math.abs(n);
    let factor = 1;
    let remaining = absN;
    
    // Encontrar o maior fator que é uma potência perfeita do índice
    for (let i = 2; i * i <= absN; i++) {
      let count = 0;
      while (remaining % Math.pow(i, power) === 0) {
        remaining /= Math.pow(i, power);
        count++;
      }
      if (count > 0) {
        factor *= Math.pow(i, count * power);
      }
    }
    
    return { 
      factor: factor, 
      remaining: n < 0 ? -remaining : remaining 
    };
  };
  
  // Verificar se é uma raiz exata para casos especiais
  if (indiceRaiz === 2) {
    // Raiz quadrada - só para positivos
    if (radicando > 0) {
      const squareRoot = Math.sqrt(radicando);
      if (Number.isInteger(squareRoot)) {
        calculationSteps.push(`Passo ${stepCount++}: Identificando raiz quadrada exata.`);
        calculationSteps.push(`A raiz quadrada de ${radicando} é exatamente ${squareRoot}.`);
        calculationSteps.push(`Podemos verificar: ${squareRoot}² = ${squareRoot} × ${squareRoot} = ${radicando}`);
        calculationSteps.push(`Solução final: √${radicando} = ${squareRoot}`);
        
        // Adicionar verificação também para raízes exatas
        calculationSteps.push(`---VERIFICATION_SEPARATOR---`);
        calculationSteps.push(`Verificação: Elevando o resultado à potência ${indiceRaiz}.`);
        const verification = Math.pow(squareRoot, indiceRaiz);
        calculationSteps.push(`(${squareRoot})^${indiceRaiz} = ${verification}`);
        calculationSteps.push(`Confirmado: ${verification} = ${radicando} (Correto!)`);
        
        return calculationSteps;
      } else {
        // Tentar simplificar a raiz quadrada
        const { factor, remaining } = findPerfectPowerFactor(radicando, 2);
        if (factor > 1) {
          calculationSteps.push(`Passo ${stepCount++}: Simplificando o radical.`);
          calculationSteps.push(`Podemos decompor ${radicando} como ${factor} × ${remaining}.`);
          calculationSteps.push(`Como ${factor} é um quadrado perfeito (${Math.sqrt(factor)}²), podemos reescrever:`);
          calculationSteps.push(`√${radicando} = √(${factor} × ${remaining}) = √${factor} × √${remaining} = ${Math.sqrt(factor)} × √${remaining}`);
          calculationSteps.push(`Forma simplificada: √${radicando} = ${Math.sqrt(factor)}√${remaining}`);
        }
      }
    }
  } else if (indiceRaiz === 3) {
    // Raiz cúbica - funciona para positivos e negativos
    // Para negativos, Math.cbrt já retorna o valor negativo correto
    const cubeRoot = Math.cbrt(radicando);
    if (Number.isInteger(cubeRoot)) {
      calculationSteps.push(`Passo ${stepCount++}: Identificando raiz cúbica exata.`);
      calculationSteps.push(`A raiz cúbica de ${radicando} é exatamente ${cubeRoot}.`);
      calculationSteps.push(`Podemos verificar: ${cubeRoot}³ = ${cubeRoot} × ${cubeRoot} × ${cubeRoot} = ${radicando}`);
      calculationSteps.push(`Solução final: ³√${radicando} = ${cubeRoot}`);
      
      // Adicionar verificação também para raízes exatas
      calculationSteps.push(`---VERIFICATION_SEPARATOR---`);
      calculationSteps.push(`Verificação: Elevando o resultado à potência ${indiceRaiz}.`);
      const verification = Math.pow(cubeRoot, indiceRaiz);
      calculationSteps.push(`(${cubeRoot})^${indiceRaiz} = ${verification}`);
      calculationSteps.push(`Confirmado: ${verification} = ${radicando} (Correto!)`);
      
      return calculationSteps;
    } else {
      // Tentar simplificar a raiz cúbica
      const { factor, remaining } = findPerfectPowerFactor(radicando, 3);
      if (factor > 1) {
        calculationSteps.push(`Passo ${stepCount++}: Simplificando o radical.`);
        calculationSteps.push(`Podemos decompor ${radicando} como ${factor} × ${remaining}.`);
        calculationSteps.push(`Como ${factor} é um cubo perfeito (${Math.cbrt(factor)}³), podemos reescrever:`);
        calculationSteps.push(`³√${radicando} = ³√(${factor} × ${remaining}) = ³√${factor} × ³√${remaining} = ${Math.cbrt(factor)} × ³√${remaining}`);
        calculationSteps.push(`Forma simplificada: ³√${radicando} = ${Math.cbrt(factor)}³√${remaining}`);
      }
    }
  } else {
    // Para outros índices, tentar simplificar
    const { factor, remaining } = findPerfectPowerFactor(radicando, indiceRaiz);
    if (factor > 1) {
      calculationSteps.push(`Passo ${stepCount++}: Simplificando o radical.`);
      calculationSteps.push(`Podemos decompor ${radicando} como ${factor} × ${remaining}.`);
      calculationSteps.push(`Como ${factor} é uma potência ${indiceRaiz} perfeita (${Math.pow(factor, 1/indiceRaiz)}^${indiceRaiz}), podemos reescrever:`);
      calculationSteps.push(`${indiceRaiz}√${radicando} = ${indiceRaiz}√(${factor} × ${remaining}) = ${indiceRaiz}√${factor} × ${indiceRaiz}√${remaining} = ${Math.pow(factor, 1/indiceRaiz)} × ${indiceRaiz}√${remaining}`);
      calculationSteps.push(`Forma simplificada: ${indiceRaiz}√${radicando} = ${Math.pow(factor, 1/indiceRaiz)}${indiceRaiz}√${remaining}`);
    }
  }
  
  // Caso geral - usar expoentes fracionários
  calculationSteps.push(`Passo ${stepCount++}: Usando expoentes fracionários para calcular a raiz.`);
  calculationSteps.push(`A raiz ${indiceRaiz}-ésima de um número pode ser calculada como potência com expoente fracionário:`);
  calculationSteps.push(`${indiceRaiz}√${radicando} = ${radicando}^(1/${indiceRaiz})`);
  
  let result: number;
  
  if (radicando < 0 && indiceRaiz % 2 === 1) {
    // Raiz de índice ímpar de número negativo
    // Para estes casos, precisamos fazer o cálculo manualmente já que Math.pow não lida
    // corretamente com bases negativas e expoentes fracionários
    const absRadicando = Math.abs(radicando);
    const absResult = Math.pow(absRadicando, 1/indiceRaiz);
    result = -absResult; // Torna o resultado negativo
    
    calculationSteps.push(`Como o radicando é negativo e o índice é ímpar, calculamos a raiz do valor absoluto e depois aplicamos o sinal negativo.`);
    calculationSteps.push(`${indiceRaiz}√${radicando} = -${indiceRaiz}√${absRadicando} = -${roundToDecimals(absResult, 6)} = ${roundToDecimals(result, 6)}`);
  } else {
    // Todos os outros casos (base positiva, qualquer índice)
    result = Math.pow(radicando, 1/indiceRaiz);
    calculationSteps.push(`Calculando: ${radicando}^(1/${indiceRaiz}) = ${roundToDecimals(result, 6)}`);
  }
  
  calculationSteps.push(`Solução final: ${indiceRaiz}√${radicando} = ${roundToDecimals(result, 6)}`);
  
  // Adicionar verificação
  calculationSteps.push(`---VERIFICATION_SEPARATOR---`);
  calculationSteps.push(`Verificação: Elevando o resultado à potência ${indiceRaiz}.`);
  const verification = Math.pow(result, indiceRaiz);
  calculationSteps.push(`(${roundToDecimals(result, 6)})^${indiceRaiz} = ${roundToDecimals(verification, 6)}`);
  
  if (Math.abs(verification - radicando) < 0.0001) {
    calculationSteps.push(`Confirmado: ${roundToDecimals(verification, 6)} ≈ ${radicando} (Correto!)`);
  } else {
    calculationSteps.push(`Nota: Há uma pequena diferença devido ao arredondamento.`);
  }
  
  return calculationSteps;
}

export function useExponenciacaoSolver() {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Função principal de resolução
  const handleSolve = () => {
    dispatch({ type: 'RESET_CALCULATION' });
    
    try {
      // Resolver com base no tipo de operação
      if (state.expType === 'exponenciacao') {
        // Verificar se base e expoente foram fornecidos
        if (!state.base.trim()) {
          dispatch({ type: 'SET_ERROR', message: 'Por favor, insira um valor para a base.' });
          return;
        }
        
        if (!state.expoente.trim()) {
          dispatch({ type: 'SET_ERROR', message: 'Por favor, insira um valor para o expoente.' });
          return;
        }
        
        // Converter para números
        const numBase = parseFloat(state.base.replace(',', '.'));
        const numExpoente = parseFloat(state.expoente.replace(',', '.'));
        
        // Validar os valores
        if (isNaN(numBase) || isNaN(numExpoente)) {
          dispatch({ type: 'SET_ERROR', message: 'Por favor, insira valores numéricos válidos.' });
          return;
        }
        
        // Verificar casos especiais
        if (numBase === 0 && numExpoente < 0) {
          dispatch({ type: 'SET_ERROR', message: 'Divisão por zero: 0 elevado a um expoente negativo não está definido.' });
          return;
        }
        
        if (numBase < 0 && !Number.isInteger(numExpoente)) {
          dispatch({ type: 'SET_ERROR', message: 'Base negativa com expoente não inteiro resulta em um número complexo.' });
          return;
        }
        
        const result = Math.pow(numBase, numExpoente);
        const steps = generateExponentiationSteps(numBase, numExpoente);
        
        dispatch({
          type: 'SET_RESULT',
          result: roundToDecimals(result, 6),
          steps
        });
      } else {
        // Modo radicação
        
        // Verificar se os valores foram fornecidos
        if (!state.radicando.trim()) {
          dispatch({ type: 'SET_ERROR', message: 'Por favor, insira um valor para o radicando.' });
          return;
        }
        
        if (!state.indiceRaiz.trim()) {
          dispatch({ type: 'SET_ERROR', message: 'Por favor, insira um valor para o índice da raiz.' });
          return;
        }
        
        // Converter para números
        const numRadicando = parseFloat(state.radicando.replace(',', '.'));
        const numIndiceRaiz = parseFloat(state.indiceRaiz.replace(',', '.'));
        
        // Validar os valores
        if (isNaN(numRadicando) || isNaN(numIndiceRaiz)) {
          dispatch({ type: 'SET_ERROR', message: 'Por favor, insira valores numéricos válidos.' });
          return;
        }
        
        if (numIndiceRaiz === 0) {
          dispatch({ type: 'SET_ERROR', message: 'O índice da raiz não pode ser zero.' });
          return;
        }
        
        // Verificar raízes pares de números negativos
        if (numRadicando < 0 && numIndiceRaiz % 2 === 0) {
          dispatch({ type: 'SET_ERROR', message: 'Não é possível calcular a raiz de índice par de um número negativo nos números reais.' });
          return;
        }
        
        // Calcular o resultado
        let result: number;
        
        if (numRadicando < 0 && numIndiceRaiz % 2 === 1) {
          // Para radicandos negativos com índice ímpar
          const absRadicando = Math.abs(numRadicando);
          const absResult = Math.pow(absRadicando, 1/numIndiceRaiz);
          result = -absResult;
        } else {
          // Para todos os outros casos (radicandos positivos)
          result = Math.pow(numRadicando, 1/numIndiceRaiz);
        }
        
        const steps = generateRootSteps(numRadicando, numIndiceRaiz);
        
        dispatch({
          type: 'SET_RESULT',
          result: roundToDecimals(result, 6),
          steps
        });
      }
    } catch (error) {
      dispatch({ 
        type: 'SET_ERROR', 
        message: error instanceof Error ? error.message : 'Erro desconhecido.' 
      });
    }
  };

  // Aplicar um exemplo ao estado atual
  const applyExample = (example: { 
    type: ExpType; 
    base?: number | string; 
    expoente?: number | string;
    indiceRaiz?: number | string;
    radicando?: number | string;
    description?: string 
  }) => {
    dispatch({ type: 'APPLY_EXAMPLE', example });
  };

  // Definir o tipo de operação
  const setExpType = (expType: ExpType) => {
    dispatch({ type: 'SET_EXP_TYPE', expType });
  };

  // Retornar o estado e as funções
  return {
    state,
    dispatch,
    handleSolve,
    applyExample,
    setExpType,
  };
} 