import { useReducer } from 'react';
import { 
  calculateDerivative,
  simplifyExpression,
  extractTermsFromSum,
  sortTermsByExponent,
  reconstructTermsSum
} from '../../utils/mathUtilsCalculo/mathUtilsCalculoDerivada';
import { 
  getDerivativesExamples,
  parseExpression,
  termToString,
  Term
} from '../../utils/mathUtilsCalculo/mathUtilsCalculoGeral';

// Interfaces para o conceito matemático
interface RuleDerivative {
  nome: string;
  formula?: string;
  explicacao: string;
  exemplo?: string;
  corDestaque: string;
}

interface CategoryDerivative {
  nome: string;
  regras: RuleDerivative[];
}

export interface DerivadaConceito {
  titulo: string;
  descricao: string;
  categorias: CategoryDerivative[];
}

// Conceito matemático das derivadas - movido do arquivo de utilitários
export const derivativesMathematicalConcept: DerivadaConceito = {
  titulo: "Conceitos Fundamentais de Derivadas",
  descricao: "Uma derivada representa a taxa de variação instantânea de uma função. Geometricamente, representa a inclinação da reta tangente à curva da função em um determinado ponto.",
  categorias: [
    {
      nome: "Regras Básicas",
      regras: [
        {
          nome: "Derivada de Constante",
          formula: "d/dx(c) = 0",
          explicacao: "A derivada de qualquer constante é sempre zero, pois constantes não variam quando x varia.",
          exemplo: "d/dx(5) = 0",
          corDestaque: "blue"
        },
        {
          nome: "Derivada da Variável",
          formula: "d/dx(x) = 1",
          explicacao: "A derivada da variável em relação a ela mesma é sempre 1.",
          exemplo: "d/dx(x) = 1",
          corDestaque: "blue"
        },
        {
          nome: "Derivada da Potência",
          formula: "d/dx(x^n) = n·x^(n-1)",
          explicacao: "Para derivar uma potência, multiplicamos pelo expoente e reduzimos o expoente em 1.",
          exemplo: "d/dx(x³) = 3x²",
          corDestaque: "blue"
        },
        {
          nome: "Derivada da Multiplicação por Constante",
          formula: "d/dx(c·f(x)) = c·f'(x)",
          explicacao: "Constantes multiplicativas podem ser movidas para fora da derivada.",
          exemplo: "d/dx(5x²) = 5·d/dx(x²) = 5·2x = 10x",
          corDestaque: "blue"
        }
      ]
    },
    {
      nome: "Operações Algébricas",
      regras: [
        {
          nome: "Regra da Soma",
          formula: "d/dx[f(x) + g(x)] = f'(x) + g'(x)",
          explicacao: "A derivada de uma soma é igual à soma das derivadas.",
          exemplo: "d/dx(x² + sen(x)) = d/dx(x²) + d/dx(sen(x)) = 2x + cos(x)",
          corDestaque: "green"
        },
        {
          nome: "Regra da Diferença",
          formula: "d/dx[f(x) - g(x)] = f'(x) - g'(x)",
          explicacao: "A derivada de uma diferença é igual à diferença das derivadas.",
          exemplo: "d/dx(x³ - cos(x)) = d/dx(x³) - d/dx(cos(x)) = 3x² - (-sen(x)) = 3x² + sen(x)",
          corDestaque: "green"
        },
        {
          nome: "Regra do Produto",
          formula: "d/dx[f(x)·g(x)] = f'(x)·g(x) + f(x)·g'(x)",
          explicacao: "A derivada do produto é a derivada do primeiro multiplicada pelo segundo, mais o primeiro multiplicado pela derivada do segundo.",
          exemplo: "d/dx(x·sen(x)) = d/dx(x)·sen(x) + x·d/dx(sen(x)) = 1·sen(x) + x·cos(x) = sen(x) + x·cos(x)",
          corDestaque: "purple"
        },
        {
          nome: "Regra do Quociente",
          formula: "d/dx[f(x)/g(x)] = [f'(x)·g(x) - f(x)·g'(x)]/[g(x)]²",
          explicacao: "A derivada do quociente segue esta fórmula. Observe que o denominador é elevado ao quadrado.",
          exemplo: "d/dx(x²/cos(x)) = [d/dx(x²)·cos(x) - x²·d/dx(cos(x))]/[cos(x)]² = [2x·cos(x) - x²·(-sen(x))]/[cos(x)]² = [2x·cos(x) + x²·sen(x)]/[cos(x)]²",
          corDestaque: "purple"
        }
      ]
    },
    {
      nome: "Regra da Cadeia",
      regras: [
        {
          nome: "Regra da Cadeia (Função Composta)",
          formula: "d/dx[f(g(x))] = f'(g(x)) · g'(x)",
          explicacao: "A derivada de uma função composta é a derivada da função externa calculada no ponto da função interna, multiplicada pela derivada da função interna.",
          exemplo: "d/dx(sen(x²)) = cos(x²) · d/dx(x²) = cos(x²) · 2x = 2x·cos(x²)",
          corDestaque: "amber"
        }
      ]
    },
    {
      nome: "Funções Trigonométricas",
      regras: [
        {
          nome: "Derivada do Seno",
          formula: "d/dx[sen(x)] = cos(x)",
          explicacao: "A derivada do seno é o cosseno.",
          exemplo: "d/dx(sen(2x)) = cos(2x) · d/dx(2x) = cos(2x) · 2 = 2cos(2x)",
          corDestaque: "cyan"
        },
        {
          nome: "Derivada do Cosseno",
          formula: "d/dx[cos(x)] = -sen(x)",
          explicacao: "A derivada do cosseno é o negativo do seno.",
          exemplo: "d/dx(cos(x²)) = -sen(x²) · d/dx(x²) = -sen(x²) · 2x = -2x·sen(x²)",
          corDestaque: "cyan"
        },
        {
          nome: "Derivada da Tangente",
          formula: "d/dx[tan(x)] = sec²(x)",
          explicacao: "A derivada da tangente é a secante ao quadrado, que também pode ser escrita como 1/[cos²(x)].",
          exemplo: "d/dx(tan(3x)) = sec²(3x) · d/dx(3x) = sec²(3x) · 3 = 3·sec²(3x)",
          corDestaque: "cyan"
        }
      ]
    },
    {
      nome: "Funções Exponenciais e Logarítmicas",
      regras: [
        {
          nome: "Derivada do Logaritmo Natural",
          formula: "d/dx[ln(x)] = 1/x",
          explicacao: "A derivada do logaritmo natural é o recíproco do argumento.",
          exemplo: "d/dx(ln(x²)) = 1/(x²)·d/dx(x²) = 1/(x²)·2x = 2x/(x²) = 2/x",
          corDestaque: "red"
        },
        {
          nome: "Derivada do Logaritmo Base 10",
          formula: "d/dx[log₁₀(x)] = 1/(x·ln(10))",
          explicacao: "A derivada do logaritmo base 10 utiliza a mudança de base para o logaritmo natural.",
          exemplo: "d/dx(log₁₀(x)) = 1/(x·ln(10))",
          corDestaque: "red"
        },
        {
          nome: "Derivada da Exponencial",
          formula: "d/dx[e^x] = e^x",
          explicacao: "A função exponencial é igual à sua própria derivada, uma propriedade única.",
          exemplo: "d/dx(e^(2x)) = e^(2x)·d/dx(2x) = e^(2x)·2 = 2e^(2x)",
          corDestaque: "red"
        },
        {
          nome: "Derivada da Exponencial de Base a",
          formula: "d/dx[a^x] = a^x·ln(a)",
          explicacao: "A derivada da exponencial de base a multiplica pela função original e pelo logaritmo natural da base.",
          exemplo: "d/dx(2^x) = 2^x·ln(2)",
          corDestaque: "red"
        }
      ]
    }
  ]
};

// Interface para o estado das derivadas
interface DerivativasState {
  funcao: string;
  variavel: string;
  ordem: string;
  resultado: string | null;
  passos: string[];
  erro: string | null;
  showExplanation: boolean;
  showDisclaimer: boolean;
  showConceitoMatematico: boolean;
}

// Tipos de ações para o reducer
type DerivativasAction =
  | { type: 'SET_FUNCAO'; value: string }
  | { type: 'SET_VARIAVEL'; value: string }
  | { type: 'SET_ORDEM'; value: string }
  | { type: 'SET_RESULT'; resultado: string; passos: string[] }
  | { type: 'SET_ERROR'; message: string }
  | { type: 'TOGGLE_EXPLANATION' }
  | { type: 'TOGGLE_DISCLAIMER' }
  | { type: 'TOGGLE_CONCEITO_MATEMATICO' }
  | { type: 'RESET' }
  | { type: 'APPLY_EXAMPLE'; example: string };

// Estado inicial
const initialState: DerivativasState = {
  funcao: '',
  variavel: 'x',
  ordem: '1',
  resultado: null,
  passos: [],
  erro: null,
  showExplanation: true,
  showDisclaimer: true,
  showConceitoMatematico: true
};

// Função reducer
function derivativasReducer(
  state: DerivativasState, 
  action: DerivativasAction
): DerivativasState {
  switch (action.type) {
    case 'SET_FUNCAO':
      return { ...state, funcao: action.value };
    case 'SET_VARIAVEL':
      return { ...state, variavel: action.value };
    case 'SET_ORDEM':
      return { ...state, ordem: action.value };
    case 'SET_RESULT':
      return {
        ...state,
        resultado: action.resultado,
        passos: action.passos,
        erro: null
      };
    case 'SET_ERROR':
      return { 
        ...state, 
        erro: action.message, 
        resultado: null, 
        passos: []
      };
    case 'TOGGLE_EXPLANATION':
      return { ...state, showExplanation: !state.showExplanation };
    case 'TOGGLE_DISCLAIMER':
      return { ...state, showDisclaimer: !state.showDisclaimer };
    case 'TOGGLE_CONCEITO_MATEMATICO':
      return { ...state, showConceitoMatematico: !state.showConceitoMatematico };
    case 'RESET':
      return {
        ...state,
        resultado: null,
        passos: [],
        erro: null
      };
    case 'APPLY_EXAMPLE':
      return { 
        ...state,
        funcao: action.example,
        resultado: null,
        passos: [],
        erro: null
      };
    default:
      return state;
  }
}

export function useDerivativasSolver() {
  const [state, dispatch] = useReducer(derivativasReducer, initialState);
  
  // Já não precisamos mais de typecast, pois o objeto está definido aqui com tipo correto
  const conceitoDerivadas = derivativesMathematicalConcept;

  // Obter exemplos de funções
  const getExamples = () => {
    return getDerivativesExamples();
  };

  // Aplicar um exemplo
  const applyExample = (example: string) => {
    dispatch({ type: 'APPLY_EXAMPLE', example });
  };

  // Função auxiliar para explicar as regras de derivação aplicadas a cada etapa
  // Cria explicações didáticas das regras utilizadas para o processo passo-a-passo
  const explainAppliedRules = (termo: Term, variavel: string, calculationSteps: string[]) => {
    switch (termo.type) {
      case 'constant':
        calculationSteps.push(`Aplicando a regra da constante: d/d${variavel}(${termo.value}) = 0`);
        calculationSteps.push(`A derivada de uma constante é sempre zero.`);
        break;
        
      case 'variable':
        if (termo.variable === variavel) {
          calculationSteps.push(`Aplicando a regra da variável: d/d${variavel}(${variavel}) = 1`);
          calculationSteps.push(`A derivada de uma variável em relação a ela mesma é 1.`);
        } else {
          calculationSteps.push(`Aplicando a regra da constante: d/d${variavel}(${termo.variable}) = 0`);
          calculationSteps.push(`A variável ${termo.variable} é tratada como constante em relação a ${variavel}.`);
        }
        break;
        
      case 'power':
        if (termo.argument && termo.argument.type === 'variable' && termo.argument.variable === variavel) {
          const exponent = termo.exponent ?? 0;
          calculationSteps.push(`Aplicando a regra da potência: d/d${variavel}(${variavel}^${exponent}) = ${exponent} × ${variavel}^${exponent-1}`);
          calculationSteps.push(`Para derivar uma potência, multiplicamos pelo expoente e reduzimos o expoente em 1.`);
        } else {
          calculationSteps.push(`Para a expressão ${termToString(termo)}, precisamos aplicar a regra da cadeia.`);
          calculationSteps.push(`d/d${variavel}[f(${variavel})^n] = n × f(${variavel})^(n-1) × f'(${variavel})`);
        }
        break;
        
      case 'sin':
        calculationSteps.push(`Aplicando a regra do seno: d/d${variavel}[sen(u)] = cos(u) × du/d${variavel}`);
        calculationSteps.push(`Onde u = ${termToString(termo.argument!)}`);
        break;
        
      case 'cos':
        calculationSteps.push(`Aplicando a regra do cosseno: d/d${variavel}[cos(u)] = -sen(u) × du/d${variavel}`);
        calculationSteps.push(`Onde u = ${termToString(termo.argument!)}`);
        break;
        
      case 'tan':
        calculationSteps.push(`Aplicando a regra da tangente: d/d${variavel}[tan(u)] = sec²(u) × du/d${variavel}`);
        calculationSteps.push(`Onde u = ${termToString(termo.argument!)} e sec²(u) = 1/[cos²(u)]`);
        break;
        
      case 'ln':
        calculationSteps.push(`Aplicando a regra do logaritmo natural: d/d${variavel}[ln(u)] = (1/u) × du/d${variavel}`);
        calculationSteps.push(`Onde u = ${termToString(termo.argument!)}`);
        break;
        
      case 'log':
        calculationSteps.push(`Aplicando a regra do logaritmo base 10: d/d${variavel}[log(u)] = (1/(u×ln(10))) × du/d${variavel}`);
        calculationSteps.push(`Onde u = ${termToString(termo.argument!)}`);
        break;
        
      case 'exp':
        calculationSteps.push(`Aplicando a regra da exponencial: d/d${variavel}[e^u] = e^u × du/d${variavel}`);
        calculationSteps.push(`Onde u = ${termToString(termo.argument!)}`);
        break;
        
      case 'sum':
        calculationSteps.push(`Aplicando a regra da soma: d/d${variavel}[f(${variavel}) + g(${variavel})] = f'(${variavel}) + g'(${variavel})`);
        calculationSteps.push(`Onde f(${variavel}) = ${termToString(termo.left!)} e g(${variavel}) = ${termToString(termo.right!)}`);
        calculationSteps.push(`Vamos calcular separadamente:`);
        calculationSteps.push(`1) Para f(${variavel}) = ${termToString(termo.left!)}`);
        explainAppliedRules(termo.left!, variavel, calculationSteps);
        calculationSteps.push(`2) Para g(${variavel}) = ${termToString(termo.right!)}`);
        explainAppliedRules(termo.right!, variavel, calculationSteps);
        break;
        
      case 'difference':
        calculationSteps.push(`Aplicando a regra da diferença: d/d${variavel}[f(${variavel}) - g(${variavel})] = f'(${variavel}) - g'(${variavel})`);
        calculationSteps.push(`Onde f(${variavel}) = ${termToString(termo.left!)} e g(${variavel}) = ${termToString(termo.right!)}`);
        calculationSteps.push(`Vamos calcular separadamente:`);
        calculationSteps.push(`1) Para f(${variavel}) = ${termToString(termo.left!)}`);
        explainAppliedRules(termo.left!, variavel, calculationSteps);
        calculationSteps.push(`2) Para g(${variavel}) = ${termToString(termo.right!)}`);
        explainAppliedRules(termo.right!, variavel, calculationSteps);
        break;
        
      case 'product':
        calculationSteps.push(`Aplicando a regra do produto: d/d${variavel}[f(${variavel}) × g(${variavel})] = f'(${variavel}) × g(${variavel}) + f(${variavel}) × g'(${variavel})`);
        calculationSteps.push(`Onde f(${variavel}) = ${termToString(termo.left!)} e g(${variavel}) = ${termToString(termo.right!)}`);
        calculationSteps.push(`Vamos calcular separadamente:`);
        calculationSteps.push(`1) Para f(${variavel}) = ${termToString(termo.left!)}`);
        explainAppliedRules(termo.left!, variavel, calculationSteps);
        calculationSteps.push(`2) Para g(${variavel}) = ${termToString(termo.right!)}`);
        explainAppliedRules(termo.right!, variavel, calculationSteps);
        break;
        
      case 'quotient':
        calculationSteps.push(`Aplicando a regra do quociente: d/d${variavel}[f(${variavel})/g(${variavel})] = [f'(${variavel}) × g(${variavel}) - f(${variavel}) × g'(${variavel})]/[g(${variavel})]²`);
        calculationSteps.push(`Onde f(${variavel}) = ${termToString(termo.left!)} e g(${variavel}) = ${termToString(termo.right!)}`);
        calculationSteps.push(`Vamos calcular separadamente:`);
        calculationSteps.push(`1) Para f(${variavel}) = ${termToString(termo.left!)}`);
        explainAppliedRules(termo.left!, variavel, calculationSteps);
        calculationSteps.push(`2) Para g(${variavel}) = ${termToString(termo.right!)}`);
        explainAppliedRules(termo.right!, variavel, calculationSteps);
        break;
    }
  };

  // Função para gerar passos de derivação - Movida do utilitário
  const generateDerivativeSteps = (
    expressao: string, 
    variavel: string, 
    ordem: number
  ): { resultado: string; passos: string[] } => {
    try {
      // Passos a serem retornados
      const calculationSteps: string[] = [];
      
      // Parseia a expressão original
      const termoParsed = parseExpression(expressao, variavel);
      if (!termoParsed) {
        throw new Error(`Não foi possível interpretar a expressão: ${expressao}`);
      }
      
      calculationSteps.push(`Expressão original: ${termToString(termoParsed)}`);
      
      // Calcula a derivada da expressão
      let resultado: Term = termoParsed;
      for (let i = 1; i <= ordem; i++) {
        calculationSteps.push(`Calculando a ${i}ª derivada:`);
        
        if (i > 1) {
          calculationSteps.push(`Expressão atual: ${termToString(resultado)}`);
        }
        
        // Adicionar explicações detalhadas baseadas no tipo da expressão
        explainAppliedRules(resultado, variavel, calculationSteps);
        
        resultado = calculateDerivative(resultado, variavel);
        
        // Simplifica o resultado quando possível
        resultado = simplifyExpression(resultado);
        
        calculationSteps.push(`Resultado da ${i}ª derivada: ${termToString(resultado)}`);
        
        // Se não for a última derivada e a ordem > 1, adicionar uma separação
        if (i < ordem) {
          calculationSteps.push(`----- Próximo passo para a ${i+1}ª derivada -----`);
        }
      }
      
      // Certifica-se de que o resultado final esteja ordenado corretamente
      // Para polinômios, isto é especialmente importante para exibir os termos em ordem decrescente de potências
      if (resultado.type === 'sum' || resultado.type === 'difference') {
        // Converte para lista de termos, ordena e reconstrói a expressão
        const termos = extractTermsFromSum(resultado);
        sortTermsByExponent(termos);
        
        if (termos.length > 0) {
          resultado = reconstructTermsSum(termos);
        }
      }
      
      return {
        resultado: termToString(resultado),
        passos: calculationSteps
      };
    } catch (error) {
      throw error;
    }
  };

  // Processa os passos para adicionar numeração e consolidar passos excessivos
  const processStepsWithNumbering = (steps: string[]): string[] => {
    let stepCount = 1;
    const processedSteps: string[] = [];
    let i = 0;
    
    // Função auxiliar para verificar se estamos tratando de expressões simples
    const isSimpleExpression = (step: string): boolean => {
      // Verifica se a expressão é um monômio ou uma expressão simples
      const simplePatterns = [
        /^x\^\d+$/,         // x^n
        /^\d+x\^\d+$/,      // ax^n
        /^\d+x$/,           // ax
        /^x$/,              // x
        /^\d+$/             // constante
      ];
      
      return simplePatterns.some(pattern => pattern.test(step.trim()));
    };

    // Primeiro passo sempre é analisar a expressão
    if (steps.length > 0 && steps[0].includes('Expressão original:')) {
      processedSteps.push(`Passo ${stepCount++}: Analisar a expressão original`);
      processedSteps.push(steps[0]);
      i = 1;
    }

    // Auxiliar para rastrear o contexto atual da etapa
    let currentStepContext = "";
    let skipSubsteps = false;

    while (i < steps.length) {
      const step = steps[i];
      
      // Passos principais que iniciam uma nova etapa de cálculo
      if (step.match(/^Calculando a \d+ª derivada:/)) {
        // Resetar o contexto para uma nova derivada
        currentStepContext = "calculando_derivada";
        skipSubsteps = false;
        processedSteps.push(`Passo ${stepCount++}: ${step}`);
      } 
      // Aplicação de regras de derivação para expressões principais
      else if (step.match(/^Aplicando a regra d[aeoi]/) && currentStepContext !== "sub_regra") {
        // Se for uma regra principal (não dentro de sub-etapas)
        if (!skipSubsteps) {
          const lastStep = processedSteps[processedSteps.length - 1] || '';
          const alreadyNumbered = lastStep.match(/^Passo \d+:/);
          
          if (!alreadyNumbered) {
            processedSteps.push(`Passo ${stepCount++}: Aplicar regra de derivação`);
          }
        }
        processedSteps.push(step);
        
        // Também incluímos a explicação da regra sem nova numeração
        if (i + 1 < steps.length && !steps[i + 1].match(/^Aplicando/) && !steps[i + 1].includes('Resultado') && !steps[i + 1].startsWith('-----')) {
          processedSteps.push(steps[i + 1]);
          i++;
        }
      }
      // Tratamento de sub-expressões
      else if (step.includes('Vamos calcular separadamente:')) {
        // Marcar que estamos entrando em cálculos de sub-expressões
        currentStepContext = "sub_expressoes";
        processedSteps.push(`Passo ${stepCount++}: Calcular derivadas das sub-expressões`);
        processedSteps.push(step);
      }
      // Reconhecimento de números de sub-passos (como "1) Para f(x)")
      else if (step.match(/^\d+\) Para f\(x\)/)) {
        // Manter a estrutura de sub-passos, mas possivelmente consolidar etapas quando forem simples
        const exprMatch = step.match(/^\d+\) Para f\(x\) = (.+)$/);
        if (exprMatch && isSimpleExpression(exprMatch[1])) {
          // É uma expressão simples, podemos tentar pular sub-passos
          skipSubsteps = true;
        } else {
          skipSubsteps = false;
        }
        processedSteps.push(step);
      }
      // Sub-regras de derivação (dentro de sub-expressões)
      else if (step.match(/^Aplicando a regra/) && currentStepContext === "sub_expressoes") {
        currentStepContext = "sub_regra";
        // Para sub-regras, não adicionamos números de etapas
        if (!skipSubsteps) {
          processedSteps.push(step);
          
          // Adicionar a explicação da regra, se existir
          if (i + 1 < steps.length && !steps[i + 1].match(/^Aplicando/) && !steps[i + 1].includes('Resultado') && !steps[i + 1].startsWith('-----')) {
            processedSteps.push(steps[i + 1]);
            i++;
          }
        }
      }
      // Resultado final de cada derivada
      else if (step.match(/^Resultado da \d+ª derivada:/)) {
        // Resetar o contexto
        currentStepContext = "";
        skipSubsteps = false;
        processedSteps.push(`Passo ${stepCount++}: Obter o resultado final`);
        processedSteps.push(step);
      }
      // Outros passos - mantém seletivamente baseado no contexto
      else if (
        // Para etapas explicativas
        step.includes("multiplicamos pelo expoente") || 
        step.includes("A derivada de uma constante") ||
        // Para etapas intermediárias "Onde f(x) = ..."
        step.includes("Onde f(x) =") ||
        // Para separadores
        step.startsWith('-----')
      ) {
        // Sempre incluir estes passos informativos, independente do contexto
        processedSteps.push(step);
      } 
      // Outros passos que não se enquadram nas categorias acima
      else if (!skipSubsteps) {
        // Somente incluir quando não estamos pulando sub-etapas
        processedSteps.push(step);
      }
      
      i++;
    }
    
    return processedSteps;
  };

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
      // Calcular a derivada usando a função local
      const resultadoDerivada = generateDerivativeSteps(state.funcao, state.variavel, orderNum);
      
      // Processar os passos para adicionar numeração
      const processedSteps = processStepsWithNumbering(resultadoDerivada.passos);
      
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

  // Retornar o estado e as funções
  return {
    state,
    dispatch,
    getExamples,
    applyExample,
    handleSolve,
    conceitoDerivadas
  };
} 