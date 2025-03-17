import { useReducer } from 'react';
import { roundToDecimals } from '../../utils/mathUtils';

// Definições de tipo
type State = {
  a: string;
  b: string;
  c: string;
  solution: { x1: number | null; x2: number | null } | null;
  solutionType: 'real' | 'repeated' | 'complex' | null;
  steps: string[];
  errorMessage: string | null;
  showExplanation: boolean;
  showConceitoMatematico: boolean;
};

// Tipos de ações
type Action =
  | { type: 'SET_COEFFICIENT'; field: 'a' | 'b' | 'c'; value: string }
  | { type: 'RESET_CALCULATION' }
  | { type: 'SET_SOLUTION'; solution: { x1: number | null; x2: number | null }; solutionType: 'real' | 'repeated' | 'complex'; steps: string[] }
  | { type: 'SET_ERROR'; message: string }
  | { type: 'TOGGLE_EXPLANATION' }
  | { type: 'TOGGLE_CONCEITO_MATEMATICO' }
  | { type: 'APPLY_EXAMPLE'; a: number | string; b: number | string; c: number | string };

// Estado inicial
const initialState: State = {
  a: '',
  b: '',
  c: '',
  solution: null,
  solutionType: null,
  steps: [],
  errorMessage: null,
  showExplanation: false,
  showConceitoMatematico: true,
};

// Função reducer
function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_COEFFICIENT':
      return { ...state, [action.field]: action.value };
    case 'RESET_CALCULATION':
      return {
        ...state,
        solution: null,
        solutionType: null,
        steps: [],
        errorMessage: null,
        showExplanation: false
      };
    case 'SET_SOLUTION':
      return { 
        ...state, 
        solution: action.solution, 
        solutionType: action.solutionType,
        steps: action.steps,
        errorMessage: null,
        showExplanation: true
      };
    case 'SET_ERROR':
      return {
        ...state,
        errorMessage: action.message,
        solution: null,
        solutionType: null,
        steps: []
      };
    case 'TOGGLE_EXPLANATION':
      return { ...state, showExplanation: !state.showExplanation };
    case 'TOGGLE_CONCEITO_MATEMATICO':
      return { ...state, showConceitoMatematico: !state.showConceitoMatematico };
    case 'APPLY_EXAMPLE':
      return {
        ...state,
        a: String(action.a),
        b: String(action.b),
        c: String(action.c),
      };
    default:
      return state;
  }
}

// Gerar passos para resolução da equação quadrática
function generateQuadraticSteps(
  numA: number,
  numB: number,
  numC: number,
  discriminant: number
): string[] {
  const calculationSteps: string[] = [];
  let stepCount = 1;
  
  // Início da resolução
  calculationSteps.push(`Equação original: ${numA}x² + ${numB}x + ${numC} = 0`);
  
  // Cálculo do discriminante
  calculationSteps.push(`Passo ${stepCount++}: Calculando o discriminante da equação.`);
  calculationSteps.push(`Aplicando a fórmula do discriminante Δ = b² - 4ac`);
  calculationSteps.push(`Substituindo os valores na fórmula:`);
  calculationSteps.push(`Δ = ${numB}² - 4 × ${numA} × ${numC}`);
  calculationSteps.push(`Simplificando os termos semelhantes:`);
  calculationSteps.push(`Δ = ${numB * numB} - ${4 * numA * numC}`);
  calculationSteps.push(`Δ = ${discriminant}`);
  
  // Interpretação do discriminante
  if (discriminant > 0) {
    calculationSteps.push(`Como Δ > 0, a equação tem duas raízes reais distintas.`);
    
    // Cálculo das raízes
    calculationSteps.push(`Passo ${stepCount++}: Isolando as raízes usando a fórmula de Bhaskara.`);
    calculationSteps.push(`Fórmula: x = (-b ± √Δ) / (2a)`);
    
    const sqrtDiscriminant = Math.sqrt(discriminant);
    calculationSteps.push(`Substituindo os valores na fórmula:`);
    calculationSteps.push(`x = (-(${numB}) ± √${discriminant}) / (2 × ${numA})`);
    calculationSteps.push(`x = (${-numB} ± ${roundToDecimals(sqrtDiscriminant, 4)}) / ${2 * numA}`);
    
    // Primeira raiz
    const x1 = (-numB + sqrtDiscriminant) / (2 * numA);
    calculationSteps.push(`Para x₁ (usando +):`);
    calculationSteps.push(`x₁ = (${-numB} + ${roundToDecimals(sqrtDiscriminant, 4)}) / ${2 * numA}`);
    calculationSteps.push(`Simplificando a divisão:`);
    calculationSteps.push(`x₁ = ${roundToDecimals(-numB + sqrtDiscriminant, 4)} / ${2 * numA}`);
    calculationSteps.push(`x₁ = ${roundToDecimals(x1, 4)}`);
    
    // Segunda raiz
    const x2 = (-numB - sqrtDiscriminant) / (2 * numA);
    calculationSteps.push(`Para x₂ (usando -):`);
    calculationSteps.push(`x₂ = (${-numB} - ${roundToDecimals(sqrtDiscriminant, 4)}) / ${2 * numA}`);
    calculationSteps.push(`Simplificando a divisão:`);
    calculationSteps.push(`x₂ = ${roundToDecimals(-numB - sqrtDiscriminant, 4)} / ${2 * numA}`);
    calculationSteps.push(`x₂ = ${roundToDecimals(x2, 4)}`);
    
    // Resultado final
    calculationSteps.push(`Solução final: x₁ = ${roundToDecimals(x1, 4)} e x₂ = ${roundToDecimals(x2, 4)}`);
    
    // Separador visual de verificação
    calculationSteps.push(`---VERIFICATION_SEPARATOR---`);
    
    // Verificação
    calculationSteps.push(`Verificação: Substituindo os valores na equação original: ${numA}x² + ${numB}x + ${numC} = 0`);
    
    // Verificar x1
    const verif1 = numA * x1 * x1 + numB * x1 + numC;
    calculationSteps.push(`Para x₁ = ${roundToDecimals(x1, 4)}:`);
    calculationSteps.push(`${numA} × (${roundToDecimals(x1, 4)})² + ${numB} × (${roundToDecimals(x1, 4)}) + ${numC}`);
    calculationSteps.push(`${numA} × ${roundToDecimals(x1 * x1, 4)} + ${numB} × ${roundToDecimals(x1, 4)} + ${numC}`);
    calculationSteps.push(`${roundToDecimals(numA * x1 * x1, 4)} + ${roundToDecimals(numB * x1, 4)} + ${numC}`);
    calculationSteps.push(`${roundToDecimals(verif1, 4)} ≈ 0 ✓`);
    
    // Verificar x2
    const verif2 = numA * x2 * x2 + numB * x2 + numC;
    calculationSteps.push(`Para x₂ = ${roundToDecimals(x2, 4)}:`);
    calculationSteps.push(`${numA} × (${roundToDecimals(x2, 4)})² + ${numB} × (${roundToDecimals(x2, 4)}) + ${numC}`);
    calculationSteps.push(`${numA} × ${roundToDecimals(x2 * x2, 4)} + ${numB} × ${roundToDecimals(x2, 4)} + ${numC}`);
    calculationSteps.push(`${roundToDecimals(numA * x2 * x2, 4)} + ${roundToDecimals(numB * x2, 4)} + ${numC}`);
    calculationSteps.push(`${roundToDecimals(verif2, 4)} ≈ 0 ✓`);
  } 
  else if (discriminant === 0) {
    calculationSteps.push(`Como Δ = 0, a equação tem uma raiz real com multiplicidade 2 (raiz repetida).`);
    
    // Cálculo da raiz
    calculationSteps.push(`Passo ${stepCount++}: Isolando a variável x usando a fórmula simplificada.`);
    calculationSteps.push(`Fórmula simplificada: x = -b / (2a)`);
    calculationSteps.push(`Substituindo os valores na fórmula:`);
    calculationSteps.push(`x = -(${numB}) / (2 × ${numA})`);
    
    const x = -numB / (2 * numA);
    calculationSteps.push(`Simplificando a divisão:`);
    calculationSteps.push(`x = ${-numB} / ${2 * numA}`);
    calculationSteps.push(`x = ${roundToDecimals(x, 4)}`);
    
    // Resultado final
    calculationSteps.push(`Solução final: x = ${roundToDecimals(x, 4)} (raiz dupla)`);
    
    // Separador visual de verificação
    calculationSteps.push(`---VERIFICATION_SEPARATOR---`);
    
    // Verificação
    calculationSteps.push(`Verificação: Substituindo o valor na equação original: ${numA}x² + ${numB}x + ${numC} = 0`);
    
    const verif = numA * x * x + numB * x + numC;
    calculationSteps.push(`Para x = ${roundToDecimals(x, 4)}:`);
    calculationSteps.push(`${numA} × (${roundToDecimals(x, 4)})² + ${numB} × (${roundToDecimals(x, 4)}) + ${numC}`);
    calculationSteps.push(`${numA} × ${roundToDecimals(x * x, 4)} + ${numB} × ${roundToDecimals(x, 4)} + ${numC}`);
    calculationSteps.push(`${roundToDecimals(numA * x * x, 4)} + ${roundToDecimals(numB * x, 4)} + ${numC}`);
    calculationSteps.push(`${roundToDecimals(verif, 4)} ≈ 0 ✓`);
  } 
  else { // discriminant < 0
    calculationSteps.push(`Como Δ < 0, a equação não tem raízes reais, mas tem duas raízes complexas.`);
    
    // Cálculo das raízes complexas
    calculationSteps.push(`Passo ${stepCount++}: Isolando as variáveis na forma complexa.`);
    calculationSteps.push(`Fórmula para raízes complexas: x = (-b ± i·√|Δ|) / (2a)`);
    
    const absDiscriminant = Math.abs(discriminant);
    const sqrtAbsDiscriminant = Math.sqrt(absDiscriminant);
    
    calculationSteps.push(`Substituindo os valores na fórmula:`);
    calculationSteps.push(`x = (-(${numB}) ± i·√${absDiscriminant}) / (2 × ${numA})`);
    calculationSteps.push(`x = (${-numB} ± ${roundToDecimals(sqrtAbsDiscriminant, 4)}i) / ${2 * numA}`);
    
    // Parte real
    const realPart = -numB / (2 * numA);
    // Parte imaginária
    const imagPart = sqrtAbsDiscriminant / (2 * numA);
    
    calculationSteps.push(`Simplificando os termos semelhantes:`);
    calculationSteps.push(`x₁ = ${roundToDecimals(realPart, 4)} + ${roundToDecimals(imagPart, 4)}i`);
    calculationSteps.push(`x₂ = ${roundToDecimals(realPart, 4)} - ${roundToDecimals(imagPart, 4)}i`);
    
    // Resultado final para raízes complexas
    calculationSteps.push(`Solução final: x₁ = ${roundToDecimals(realPart, 4)} + ${roundToDecimals(imagPart, 4)}i e x₂ = ${roundToDecimals(realPart, 4)} - ${roundToDecimals(imagPart, 4)}i`);
    
    calculationSteps.push(`As raízes complexas são conjugadas uma da outra, o que é uma propriedade importante para equações com coeficientes reais.`);
  }
  
  return calculationSteps;
}

export function useQuadraticSolver() {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Função principal de resolução
  const handleSolve = () => {
    dispatch({ type: 'RESET_CALCULATION' });
    
    try {
      // Verificar se os valores foram fornecidos
      if (!state.a.trim() || !state.b.trim() || !state.c.trim()) {
        dispatch({ type: 'SET_ERROR', message: 'Por favor, preencha todos os campos.' });
        return;
      }
      
      // Converter para números
      const numA = parseFloat(state.a.replace(',', '.'));
      const numB = parseFloat(state.b.replace(',', '.'));
      const numC = parseFloat(state.c.replace(',', '.'));
      
      // Validar os valores
      if (isNaN(numA) || isNaN(numB) || isNaN(numC)) {
        dispatch({ type: 'SET_ERROR', message: 'Por favor, insira valores numéricos válidos.' });
        return;
      }
      
      if (numA === 0) {
        dispatch({ type: 'SET_ERROR', message: 'O coeficiente "a" não pode ser zero em uma equação quadrática.' });
        return;
      }
      
      // Calcular o discriminante
      const discriminant = numB * numB - 4 * numA * numC;
      
      // Gerar os passos da solução
      const steps = generateQuadraticSteps(numA, numB, numC, discriminant);
      
      // Determinar soluções baseadas no discriminante
      if (discriminant > 0) {
        // Duas raízes reais distintas
        const sqrtDiscriminant = Math.sqrt(discriminant);
        const x1 = (-numB + sqrtDiscriminant) / (2 * numA);
        const x2 = (-numB - sqrtDiscriminant) / (2 * numA);
        
        dispatch({
          type: 'SET_SOLUTION',
          solution: { 
            x1: roundToDecimals(x1, 4), 
            x2: roundToDecimals(x2, 4) 
          },
          solutionType: 'real',
          steps
        });
      } 
      else if (discriminant === 0) {
        // Uma raiz real com multiplicidade 2
        const x = -numB / (2 * numA);
        
        dispatch({
          type: 'SET_SOLUTION',
          solution: { 
            x1: roundToDecimals(x, 4), 
            x2: roundToDecimals(x, 4) 
          },
          solutionType: 'repeated',
          steps
        });
      } 
      else {
        // Duas raízes complexas conjugadas
        const realPart = -numB / (2 * numA);
        const imagPart = Math.sqrt(Math.abs(discriminant)) / (2 * numA);
        
        dispatch({
          type: 'SET_SOLUTION',
          solution: { 
            x1: realPart, 
            x2: imagPart 
          },
          solutionType: 'complex',
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
  const applyExample = (example: { a: number | string; b: number | string; c: number | string }) => {
    dispatch({ 
      type: 'APPLY_EXAMPLE', 
      a: example.a,
      b: example.b,
      c: example.c
    });
  };

  // Retornar o estado e as funções
  return {
    state,
    dispatch,
    handleSolve,
    applyExample,
  };
} 