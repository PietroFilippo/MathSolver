import { 
  calculateAndSimplifyDerivative,
  getDerivativesExamples
} from '../../../utils/mathUtilsCalculo/derivadas/mathUtilsCalculoDerivada';
import { 
  parseExpression,
  termToString,
  Term,
  extractTermsFromSum,
  sortTermsByExponent,
  reconstructTermsSum
} from '../../../utils/mathUtilsCalculo/geral/mathUtilsCalculoGeral';

// Re-exportação por conveniência
export { getDerivativesExamples };

// Função auxiliar para explicar as regras de derivação aplicadas a cada etapa
export const explainAppliedRules = (termo: Term, variavel: string, calculationSteps: string[]) => {
  switch (termo.type) {
    case 'constant':
      calculationSteps.push(`Aplicando a regra da constante: d/d${variavel}(${termo.value}) = 0`);
      calculationSteps.push(`Observação: A derivada de uma constante é sempre zero.`);
      break;
      
    case 'variable':
      if (termo.variable === variavel) {
        calculationSteps.push(`Aplicando a regra da variável: d/d${variavel}(${variavel}) = 1`);
        calculationSteps.push(`Observação: A derivada de uma variável em relação a ela mesma é 1.`);
      } else {
        calculationSteps.push(`Aplicando a regra da constante: d/d${variavel}(${termo.variable}) = 0`);
        calculationSteps.push(`Observação: A variável ${termo.variable} é tratada como constante em relação a ${variavel}.`);
      }
      break;
      
    case 'power':
      if (termo.argument && termo.argument.type === 'variable' && termo.argument.variable === variavel) {
        const exponent = termo.exponent ?? 0;
        calculationSteps.push(`Aplicando a regra da potência: d/d${variavel}(${variavel}^${exponent}) = ${exponent} × ${variavel}^${exponent-1}`);
        calculationSteps.push(`Observação: Para derivar uma potência, multiplicamos pelo expoente e reduzimos o expoente em 1.`);
      } else {
        calculationSteps.push(`Regra: Para a expressão ${termToString(termo)}, precisamos aplicar a regra da cadeia.`);
        calculationSteps.push(`Fórmula: d/d${variavel}[f(${variavel})^n] = n × f(${variavel})^(n-1) × f'(${variavel})`);
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

// Função para gerar passos de derivação
export const generateDerivativeSteps = (
  expressao: string, 
  variavel: string, 
  ordem: number
): { resultado: string; passos: string[] } => {
  try {
    // Passos a serem retornados
    const calculationSteps: string[] = [];
    
    // Parseia a expressão original
    const termoParsed = parseExpression(expressao);
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
      
      // Calcular a derivada e simplificar em um único passo
      resultado = calculateAndSimplifyDerivative(resultado, variavel);
      
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
export const processStepsWithNumbering = (steps: string[]): string[] => {
  let stepCount = 1;
  const processedSteps: string[] = [];
  
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
  
  // Define padrões para diferentes tipos de passos
  const informativePatterns = [
    "Expressão original:",
    "Expressão atual:",
    "Onde F(",
    "Onde u =",
    "Temos u' =",
    "Onde f(x) =",
    "Onde g(x) ="
  ];
  
  const calculatingPatterns = [
    "Calculando:",
    "Calculando a derivada",
    "Calculando du"
  ];
  
  const methodPatterns = [
    "Método:",
    "Técnica:",
    "Transformação:",
    "Substituição:"
  ];
  
  const observationPatterns = [
    "Observação:",
    "Propriedade única:",
    "Caso especial:"
  ];
  
  const verificationPatterns = [
    "Verificando:",
    "Demonstração:",
    "Aplicando diretamente:"
  ];
  
  const resultPatterns = [
    "Resultado parcial:",
    "Obtendo o resultado final:"
  ];
  
  // Funções para verificar o tipo de passo
  const isInformativeStep = (step: string): boolean => {
    return informativePatterns.some(pattern => step.includes(pattern));
  };
  
  const isCalculatingStep = (step: string): boolean => {
    return calculatingPatterns.some(pattern => step.includes(pattern));
  };
  
  const isMethodStep = (step: string): boolean => {
    return methodPatterns.some(pattern => step.includes(pattern));
  };
  
  const isObservationStep = (step: string): boolean => {
    return observationPatterns.some(pattern => step.includes(pattern));
  };
  
  const isVerificationStep = (step: string): boolean => {
    return verificationPatterns.some(pattern => step.includes(pattern));
  };
  
  const isResultStep = (step: string): boolean => {
    return resultPatterns.some(pattern => step.includes(pattern));
  };
  
  // Flag para controlar se já adicionamos um passo de resultado final
  let resultFinalAdded = false;
  let lastResultStep = -1;
  
  // Encontrar a posição do último resultado
  for (let i = 0; i < steps.length; i++) {
    if (steps[i].match(/^Resultado da \d+ª derivada:/)) {
      lastResultStep = i;
    }
  }
  
  let i = 0;
  
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
    // Aplicação de regras - tratadas agora com categorias para formatação
    else if (step.match(/^Aplicando a regra d[aeoi]/) && currentStepContext !== "sub_regra") {
      // Manter as regras como passos numerados apenas quando são principais
      if (!skipSubsteps) {
        const lastStep = processedSteps[processedSteps.length - 1] || '';
        const alreadyNumbered = lastStep.match(/^Passo \d+:/);
        
        if (!alreadyNumbered) {
          processedSteps.push(`Passo ${stepCount++}: Aplicar regra de derivação`);
        }
      }
      
      // As regras são formatadas sem converter para passos numerados
      processedSteps.push(step);
      
      // Também incluímos a explicação da regra sem nova numeração
      if (i + 1 < steps.length && !steps[i + 1].match(/^Aplicando/) && !steps[i + 1].includes('Resultado') && !steps[i + 1].startsWith('-----')) {
        processedSteps.push(steps[i + 1]);
        i++;
      }
    }
    // Converter "Regra:" em passos numerados
    else if (step.startsWith("Regra:") || step === "Obter o resultado final") {
      processedSteps.push(`Passo ${stepCount++}: ${step}`);
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
      // Modificar o formato para remover o contador numeral
      const modifiedStep = step.replace(/^\d+\) /, '');
      const exprMatch = step.match(/^\d+\) Para f\(x\) = (.+)$/);
      if (exprMatch && isSimpleExpression(exprMatch[1])) {
        skipSubsteps = true;
      } else {
        skipSubsteps = false;
      }
      processedSteps.push(modifiedStep);
    }
    // Sub-regras de derivação (dentro de sub-expressões)
    else if (step.match(/^Aplicando a regra/) && currentStepContext === "sub_expressoes") {
      currentStepContext = "sub_regra";
      // Para sub-regras, não adicionamos números de etapas
      if (!skipSubsteps) {
        // As sub-regras são formatadas sem converter para passos numerados
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
      
      // Adicionar passo "Obter o resultado final" antes do resultado
      if (!resultFinalAdded && i === lastResultStep) {
        processedSteps.push(`Passo ${stepCount++}: Obter o resultado final`);
        resultFinalAdded = true;
      }
      
      // O resultado é formatado sem converter para passo numerado
      processedSteps.push(step);
    }
    // Passos informativos
    else if (isInformativeStep(step)) {
      processedSteps.push(step);
    }
    // Passos de cálculo
    else if (isCalculatingStep(step)) {
      processedSteps.push(step);
    }
    // Passos de método
    else if (isMethodStep(step)) {
      processedSteps.push(step);
    }
    // Passos de observação
    else if (isObservationStep(step)) {
      processedSteps.push(step);
    }
    // Passos de verificação
    else if (isVerificationStep(step)) {
      processedSteps.push(step);
    }
    // Passos de resultado parcial
    else if (isResultStep(step)) {
      processedSteps.push(step);
    }
    // Outros passos - mantém seletivamente baseado no contexto
    else if (
      // Para etapas explicativas
      step.includes("multiplicamos pelo expoente") || 
      step.includes("A derivada de uma constante") ||
      // Para separadores
      step.startsWith('-----')
    ) {
      // Sempre incluir estes passos informativos, independente do contexto
      processedSteps.push(step);
    } 
    // Outros passos que não se enquadram nas categorias acima
    else if (!skipSubsteps) {
      // Somente incluir quando não estamos pulando sub-etapas
      processedSteps.push(`Passo ${stepCount++}: ${step}`);
    }
    
    i++;
  }
  
  return processedSteps;
}; 