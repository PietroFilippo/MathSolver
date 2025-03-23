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

// Função para obter exemplos de avaliação em pontos
export const getPointEvaluationExamples = (): {
  funcao: string;
  ponto: string;
  descricao?: string;
}[] => {
  return [
    { funcao: "x^2", ponto: "2", descricao: "Derivada de x² em x=2" },
    { funcao: "sin(x)", ponto: "0", descricao: "Derivada de sen(x) em x=0" },
    { funcao: "e^x", ponto: "1", descricao: "Derivada de e^x em x=1" },
    { funcao: "ln(x)", ponto: "1", descricao: "Derivada de ln(x) em x=1" },
    { funcao: "x^3 - 2*x", ponto: "3", descricao: "Derivada de x³-2x em x=3" },
    { funcao: "cos(x)", ponto: "0", descricao: "Derivada de cos(x) em x=0" },
    { funcao: "x^2 + 3*x - 5", ponto: "2", descricao: "Derivada de x²+3x-5 em x=2" },
    { funcao: "2*x + 5", ponto: "4", descricao: "Derivada de 2x+5 em x=4" }
  ];
};

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
      calculationSteps.push(`Para o termo: f(${variavel}) = ${termToString(termo.left!)}`);
      explainAppliedRules(termo.left!, variavel, calculationSteps);
      calculationSteps.push(`Para o termo: g(${variavel}) = ${termToString(termo.right!)}`);
      explainAppliedRules(termo.right!, variavel, calculationSteps);
      break;
      
    case 'difference':
      calculationSteps.push(`Aplicando a regra da diferença: d/d${variavel}[f(${variavel}) - g(${variavel})] = f'(${variavel}) - g'(${variavel})`);
      calculationSteps.push(`Onde f(${variavel}) = ${termToString(termo.left!)} e g(${variavel}) = ${termToString(termo.right!)}`);
      calculationSteps.push(`Vamos calcular separadamente:`);
      calculationSteps.push(`Para o termo: f(${variavel}) = ${termToString(termo.left!)}`);
      explainAppliedRules(termo.left!, variavel, calculationSteps);
      calculationSteps.push(`Para o termo: g(${variavel}) = ${termToString(termo.right!)}`);
      explainAppliedRules(termo.right!, variavel, calculationSteps);
      break;
      
    case 'product':
      calculationSteps.push(`Aplicando a regra do produto: d/d${variavel}[f(${variavel}) × g(${variavel})] = f'(${variavel}) × g(${variavel}) + f(${variavel}) × g'(${variavel})`);
      calculationSteps.push(`Onde f(${variavel}) = ${termToString(termo.left!)} e g(${variavel}) = ${termToString(termo.right!)}`);
      calculationSteps.push(`Vamos calcular separadamente:`);
      calculationSteps.push(`Para o termo: f(${variavel}) = ${termToString(termo.left!)}`);
      explainAppliedRules(termo.left!, variavel, calculationSteps);
      calculationSteps.push(`Para o termo: g(${variavel}) = ${termToString(termo.right!)}`);
      explainAppliedRules(termo.right!, variavel, calculationSteps);
      break;
      
    case 'quotient':
      calculationSteps.push(`Aplicando a regra do quociente: d/d${variavel}[f(${variavel})/g(${variavel})] = [f'(${variavel}) × g(${variavel}) - f(${variavel}) × g'(${variavel})]/[g(${variavel})]²`);
      calculationSteps.push(`Onde f(${variavel}) = ${termToString(termo.left!)} e g(${variavel}) = ${termToString(termo.right!)}`);
      calculationSteps.push(`Vamos calcular separadamente:`);
      calculationSteps.push(`Para o termo: f(${variavel}) = ${termToString(termo.left!)}`);
      explainAppliedRules(termo.left!, variavel, calculationSteps);
      calculationSteps.push(`Para o termo: g(${variavel}) = ${termToString(termo.right!)}`);
      explainAppliedRules(termo.right!, variavel, calculationSteps);
      break;
  }
};

// Helper to safely evaluate math expressions and handle special cases
const evaluateMathExpression = (expression: string): number => {
  // Handle special cases and conversions
  let jsExpression = expression
    // Handle specific case of -sin() (derivative of cos)
    .replace(/-sin\(/g, '-1*Math.sin(')
    // Insert multiplication operator between a number and a function (like -1sin(x) -> -1*sin(x))
    .replace(/([0-9])([a-zA-Z])/g, '$1*$2')
    .replace(/(-[0-9]+)([a-zA-Z])/g, '$1*$2')
    // Handle powers: x^2 -> Math.pow(x,2)
    .replace(/([a-zA-Z0-9.]+)\^([a-zA-Z0-9.]+)/g, 'Math.pow($1,$2)')
    // Handle trigonometric and other functions
    .replace(/\bsin\(/g, 'Math.sin(')
    .replace(/\bcos\(/g, 'Math.cos(')
    .replace(/\btan\(/g, 'Math.tan(')
    .replace(/\bln\(/g, 'Math.log(')
    .replace(/\blog\(/g, 'Math.log10(')
    // Handle e^x properly
    .replace(/\be\^(\S+)/g, 'Math.exp($1)')
    .replace(/\be\^/g, 'Math.exp(')
    // Make sure pi is recognized
    .replace(/\bpi\b/g, 'Math.PI');
  
  try {
    return eval(jsExpression);
  } catch (error) {
    throw new Error(`Erro ao avaliar expressão "${expression}": ${(error as Error).message}`);
  }
};

// Função para avaliar uma derivada em um ponto específico
export const evaluateDerivativeAtPoint = (
  expressao: string, 
  variavel: string, 
  ordem: number,
  ponto: string
): { resultado: string; passos: string[] } => {
  try {
    // Primeiro calculamos a derivada simbólica
    const { resultado: derivativeExpr } = 
      generateDerivativeSteps(expressao, variavel, ordem);
    
    // Preparar para avaliação numérica
    const calculationSteps: string[] = [];
    
    // Adicionar apenas os passos do cálculo da derivada simbólica
    calculationSteps.push(`Expressão original: ${expressao}`);
    calculationSteps.push(`Calculando a derivada da função em relação a ${variavel}:`);
    calculationSteps.push(`Resultado da derivada simbólica: ${derivativeExpr}`);
    
    // Formatar valor de ponto para avaliação
    let pointValue: number;
    
    // Tratar casos especiais de constantes matemáticas
    if (ponto.toLowerCase() === 'pi') {
      pointValue = Math.PI;
    } else if (ponto.includes('pi')) {
      // Suporte para expressões como pi/2, 2*pi, etc.
      try {
        const jsExpr = ponto.toLowerCase().replace(/pi/g, 'Math.PI');
        pointValue = eval(jsExpr);
      } catch (error) {
        throw new Error(`Não foi possível avaliar a expressão: ${ponto}`);
      }
    } else {
      // Tentar avaliar como expressão matemática simples
      try {
        pointValue = eval(ponto);
      } catch (error) {
        throw new Error(`Não foi possível avaliar o ponto: ${ponto}`);
      }
    }
    
    if (isNaN(pointValue)) {
      throw new Error(`Valor do ponto (${ponto}) não é um número válido.`);
    }
    
    // Adicionar passos explicativos para avaliação no ponto
    calculationSteps.push(`Avaliando a derivada no ponto ${variavel} = ${ponto}:`);
    
    // Criar uma versão legível para exibição e uma versão compatível com JS para avaliação
    let readableExpr = derivativeExpr;
    
    // Substituir a variável pelo valor do ponto na expressão legível
    const readableEvalExpr = readableExpr.replace(new RegExp(variavel, 'g'), ponto);
    
    calculationSteps.push(`Substituindo ${variavel} = ${ponto} na expressão: ${derivativeExpr}`);
    calculationSteps.push(`Expressão para cálculo: ${readableEvalExpr}`);
    
    try {
      // Substituir a variável pelo valor do ponto na expressão derivada
      const exprToEvaluate = derivativeExpr.replace(new RegExp(variavel, 'g'), pointValue.toString());
      
      // Avaliar a expressão com nossa função segura personalizada
      const numericResult = evaluateMathExpression(exprToEvaluate);
      
      if (isNaN(numericResult) || !isFinite(numericResult)) {
        throw new Error(`A avaliação resultou em um valor inválido (${numericResult}).`);
      }
      
      // Formatar resultado para melhor legibilidade
      let formattedResult: string;
      
      if (Number.isInteger(numericResult)) {
        formattedResult = numericResult.toString();
      } else {
        // Limitar casas decimais para valores não inteiros
        formattedResult = numericResult.toFixed(6).replace(/\.?0+$/, '');
      }
      
      calculationSteps.push(`Resultado numérico: ${formattedResult}`);
      
      // Adicionar interpretação geométrica e física
      calculationSteps.push(`Interpretação: f'(${ponto}) = ${formattedResult} representa:`);
      calculationSteps.push(`• A taxa de variação instantânea da função ${expressao} no ponto ${variavel} = ${ponto}`);
      calculationSteps.push(`• A inclinação da reta tangente ao gráfico da função no ponto (${ponto}, f(${ponto}))`);
      
      return {
        resultado: formattedResult,
        passos: calculationSteps
      };
    } catch (error) {
      // Tentar abordagem alternativa se falhar
      try {
        calculationSteps.push(`Tentando expressão alternativa: ${readableEvalExpr}`);
        const result = evaluateMathExpression(readableEvalExpr);
        
        // Formatar resultado para melhor legibilidade
        let formattedResult: string;
        
        if (Number.isInteger(result)) {
          formattedResult = result.toString();
        } else {
          // Limitar casas decimais para valores não inteiros
          formattedResult = result.toFixed(6).replace(/\.?0+$/, '');
        }
        
        calculationSteps.push(`Resultado numérico: ${formattedResult}`);
        
        // Adicionar interpretação geométrica e física
        calculationSteps.push(`Interpretação: f'(${ponto}) = ${formattedResult} representa:`);
        calculationSteps.push(`• A taxa de variação instantânea da função ${expressao} no ponto ${variavel} = ${ponto}`);
        calculationSteps.push(`• A inclinação da reta tangente ao gráfico da função no ponto (${ponto}, f(${ponto}))`);
        
        return {
          resultado: formattedResult,
          passos: calculationSteps
        };
      } catch (fallbackError) {
        if (error instanceof Error) {
          throw new Error(`Erro ao avaliar a expressão: ${error.message}`);
        }
        throw new Error(`Erro desconhecido ao avaliar a expressão.`);
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Erro ao avaliar derivada no ponto: ${error.message}`);
    }
    throw error;
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
  const processedSteps: string[] = [];
  let stepCount = 1;
  let inDerivativeCalculation = false;
  
  // Verificar se estamos lidando com avaliação em ponto
  const isPointEvaluation = steps.some(step => 
    step.includes('Avaliando a derivada no ponto') || 
    step.includes('Substituindo') && step.includes('na expressão:')
  );
  
  // Grupo 1: Análise da expressão - sempre começa com isso
  if (steps.length > 0 && steps[0].includes('Expressão original:')) {
    processedSteps.push(`Passo ${stepCount++}: Analisar a expressão`);
    processedSteps.push(steps[0]);
  }
  
  for (let i = 1; i < steps.length; i++) {
    const step = steps[i];
    
    // Modify steps with "Para o termo:" to remove numeric prefixes
    const modifiedStep = step.replace(/^\d+\) Para o termo:/, 'Para o termo:');
    
    // Início de cálculo de derivada
    if (modifiedStep.includes('Calculando a derivada') || modifiedStep.includes('Calculando a 1ª derivada:')) {
      inDerivativeCalculation = true;
      processedSteps.push(`Passo ${stepCount++}: Calcular a derivada da função`);
      processedSteps.push(modifiedStep);
      continue;
    }
    
    // Resultado da derivada simbólica (em cálculo com ponto)
    if (modifiedStep.includes('Resultado da derivada simbólica:')) {
      processedSteps.push(modifiedStep);
      continue;
    }
    
    // Início da avaliação em um ponto específico
    if (modifiedStep.includes('Avaliando a derivada no ponto')) {
      inDerivativeCalculation = false;
      processedSteps.push(`Passo ${stepCount++}: Avaliar a derivada no ponto especificado`);
      processedSteps.push(modifiedStep);
      continue;
    }
    
    // Substituição da variável por um valor
    if (modifiedStep.includes('Substituindo') && modifiedStep.includes('na expressão:')) {
      processedSteps.push(modifiedStep);
      continue;
    }
    
    // Expressão para cálculo
    if (modifiedStep.includes('Expressão para cálculo:')) {
      processedSteps.push(modifiedStep);
      continue;
    }
    
    // Resultado numérico
    if (modifiedStep.includes('Resultado numérico:')) {
      processedSteps.push(`Passo ${stepCount++}: Obter o resultado final`);
      processedSteps.push(modifiedStep);
      continue;
    }
    
    // Interpretações
    if (modifiedStep.includes('Interpretação:')) {
      processedSteps.push(`Passo ${stepCount++}: Interpretar o significado da derivada`);
      processedSteps.push(modifiedStep);
      continue;
    }
    
    // Itens de interpretação (com bullet points)
    if (modifiedStep.startsWith('•')) {
      processedSteps.push(modifiedStep);
      continue;
    }
    
    // Para passos de derivada simbólica tradicional
    if (!isPointEvaluation) {
      // Resultado da derivada
      if (modifiedStep.match(/^Resultado da \d+ª derivada:/)) {
        processedSteps.push(`Passo ${stepCount++}: Obter o resultado final`);
        processedSteps.push(modifiedStep);
        continue;
      }
      
      // Aplicação de regras de derivação
      if (modifiedStep.match(/^Aplicando a regra d[aeoi]/)) {
        if (inDerivativeCalculation) {
          // Se já estamos em um cálculo de derivada, não criar novo passo
          processedSteps.push(modifiedStep);
        } else {
          // Caso contrário, iniciar novo passo
          processedSteps.push(`Passo ${stepCount++}: Aplicar regras de derivação`);
          processedSteps.push(modifiedStep);
          inDerivativeCalculation = true;
        }
        continue;
      }
      
      // Observações sobre regras
      if (modifiedStep.startsWith('Observação:')) {
        processedSteps.push(`  ${modifiedStep}`); // Indentação para mostrar como subitem
        continue;
      }
      
      // Explicações sobre regras específicas
      if (modifiedStep.includes('Para derivar uma potência') || 
          modifiedStep.includes('A derivada de uma constante') || 
          modifiedStep.includes('A derivada de uma variável')) {
        processedSteps.push(`  ${modifiedStep}`); // Indentação para mostrar como subitem
        continue;
      }
    }
    
    // Outros passos relevantes para processamento
    if (modifiedStep.match(/^Calculando a \d+ª derivada:/) && parseInt(modifiedStep.match(/\d+/)?.[0] || '1') > 1) {
      processedSteps.push(`Passo ${stepCount++}: ${modifiedStep}`);
      continue;
    }
    
    // Passos de operação separados
    if (modifiedStep.match(/^Vamos calcular separadamente:/)) {
      processedSteps.push(`Passo ${stepCount++}: Decompor e calcular separadamente`);
      processedSteps.push(modifiedStep);
      continue;
    }
    
    // Detalhes de operações específicas - "Para o termo:" ou "Para f(x):" ou "Para g(x):"
    if (modifiedStep.startsWith('Para o termo:') || modifiedStep.match(/^Para [fg]\(/)) {
      processedSteps.push(`  ${modifiedStep}`); // Indentação para mostrar como subitem
      continue;
    }
    
    // Para qualquer outro passo que não se encaixe nas categorias acima
    // e não seja um separador ou um passo redundante
    if (!modifiedStep.startsWith('-----') && 
        !modifiedStep.includes('Onde') && 
        !modifiedStep.includes('regra da ') && 
        !modifiedStep.includes('Fórmula:')) {
      // Adicionar como passo numerado apenas se parecer importante
      if (modifiedStep.length > 10 && !modifiedStep.includes('Expressão atual:')) {
        processedSteps.push(`Passo ${stepCount++}: ${modifiedStep}`);
      } else {
        processedSteps.push(modifiedStep);
      }
    }
  }
  
  return processedSteps;
}; 