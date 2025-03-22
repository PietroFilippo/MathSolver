import { 
  parseExpression, 
  Term, 
  termToString 
} from '../../../utils/mathUtilsCalculo/geral/mathUtilsCalculoGeral';
import { 
  calculateIntegral, 
  evaluateDefiniteIntegral,
  getIntegralsExamples,
  getDefinedIntegralsExamples,
  calculateIntegralFromExpression
} from '../../../utils/mathUtilsCalculo/integrais/mathUtilsCalculoIntegrais';

// Re-exportação de funções utilitárias
export { 
  getIntegralsExamples, 
  getDefinedIntegralsExamples 
};

// Adiciona passos detalhados específicos para cada tipo de termo
export const addDetailedSteps = (term: Term, variavel: string, steps: string[]): void => {
  if (!term) return;
  
  // Verifica o tipo de termo e adiciona explicações detalhadas específicas
  switch (term.type) {
    case 'constant':
      steps.push(`Regra: Para constantes, ∫ ${term.value} d${variavel} = ${term.value}${variavel} + C`);
      steps.push(`Explicação: A integral de uma constante é a constante multiplicada pela variável mais a constante de integração.`);
      steps.push(`Observação: A constante de integração (C) é necessária porque a derivada de qualquer constante é zero.`);
      break;
      
    case 'variable':
      if (term.variable === variavel) {
        steps.push(`Regra: Para a variável, ∫ ${variavel} d${variavel} = ${variavel}²/2 + C`);
        steps.push(`Explicação: A integral de uma variável é a variável ao quadrado dividida por 2 mais a constante de integração.`);
        steps.push(`Observação: Esta é uma aplicação direta da regra da potência com n = 1.`);
      } else {
        steps.push(`Regra: A variável ${term.variable} é tratada como constante em relação a ${variavel}, então ∫ ${term.variable} d${variavel} = ${term.variable}${variavel} + C`);
        steps.push(`Observação: Variáveis diferentes da variável de integração são tratadas como constantes.`);
      }
      break;
      
    case 'power':
      if (term.argument && term.argument.type === 'variable' && term.argument.variable === variavel) {
        const exponent = term.exponent ?? 0;
        
        if (exponent === -1) {
          steps.push(`Regra: Para ${variavel}^(-1) = 1/${variavel}, ∫ 1/${variavel} d${variavel} = ln|${variavel}| + C`);
          steps.push(`Explicação: A integral de 1/${variavel} é o logaritmo natural do valor absoluto de ${variavel} mais a constante de integração.`);
          steps.push(`Observação: Este é um caso especial da regra da potência quando o expoente é -1.`);
        } else {
          steps.push(`Regra: Para potências, ∫ ${variavel}^n d${variavel} = ${variavel}^(n+1)/(n+1) + C, para n ≠ -1`);
          steps.push(`Substituindo n = ${exponent}`);
          steps.push(`Fórmula geral: ∫ ${variavel}^${exponent} d${variavel} = ${variavel}^(${exponent}+1)/(${exponent}+1) + C = ${variavel}^${exponent+1}/${exponent+1} + C`);
          steps.push(`Observação: Ao integrar uma potência, aumentamos o expoente em 1 e dividimos pelo novo expoente.`);
        }
      } else {
        steps.push(`Esta é uma expressão composta. Vamos decompô-la em partes mais simples.`);
      }
      break;
      
    case 'sum':
      steps.push(`Aplicando a propriedade de linearidade: ∫ [f(${variavel}) + g(${variavel})] d${variavel} = ∫ f(${variavel}) d${variavel} + ∫ g(${variavel}) d${variavel}`);
      steps.push(`Explicação: A integral de uma soma é igual à soma das integrais das partes.`);
      steps.push(`Observação: Esta propriedade de linearidade permite decompor integrais complexas em partes mais simples.`);
      steps.push(`Vamos calcular cada integral separadamente:`);
      
      if (term.left && term.right) {
        steps.push(`Para o termo: ∫ ${termToString(term.left)} d${variavel}`);
        addDetailedSteps(term.left, variavel, steps);
        
        steps.push(`Para o termo: ∫ ${termToString(term.right)} d${variavel}`);
        addDetailedSteps(term.right, variavel, steps);
      }
      break;
      
    case 'difference':
      steps.push(`Aplicando a propriedade de linearidade: ∫ [f(${variavel}) - g(${variavel})] d${variavel} = ∫ f(${variavel}) d${variavel} - ∫ g(${variavel}) d${variavel}`);
      steps.push(`Explicação: A integral de uma diferença é igual à diferença das integrais das partes.`);
      steps.push(`Observação: Esta é outra aplicação da propriedade de linearidade, agora para a subtração.`);
      steps.push(`Vamos calcular cada integral separadamente:`);
      
      if (term.left && term.right) {
        steps.push(`Para o termo: ∫ ${termToString(term.left)} d${variavel}`);
        addDetailedSteps(term.left, variavel, steps);
        
        steps.push(`Para o termo: ∫ ${termToString(term.right)} d${variavel}`);
        addDetailedSteps(term.right, variavel, steps);
      }
      break;
      
    case 'product':
      steps.push(`Regra: Para um produto, podemos tentar usar técnicas como integração por partes ou substituição.`);
      if (term.left?.type === 'constant' && term.right) {
        steps.push(`Como temos um produto com constante, podemos aplicar a propriedade: ∫ k·f(${variavel}) d${variavel} = k·∫ f(${variavel}) d${variavel}`);
        steps.push(`Constante k = ${termToString(term.left)}`);
        steps.push(`Função f(${variavel}) = ${termToString(term.right)}`);
        steps.push(`Observação: Constantes podem ser retiradas da integral, facilitando o cálculo.`);
        
        // Adiciona passos detalhados para a função
        steps.push(`Calculando a integral de f(${variavel}):`);
        addDetailedSteps(term.right, variavel, steps);
      } else if (term.right?.type === 'constant' && term.left) {
        steps.push(`Como temos um produto com constante, podemos aplicar a propriedade: ∫ f(${variavel})·k d${variavel} = k·∫ f(${variavel}) d${variavel}`);
        steps.push(`Constante k = ${termToString(term.right)}`);
        steps.push(`Função f(${variavel}) = ${termToString(term.left)}`);
        steps.push(`Observação: A ordem dos fatores não altera o produto, então a constante pode ser movida para fora da integral.`);
        
        // Adiciona passos detalhados para a função
        steps.push(`Calculando a integral de f(${variavel}):`);
        addDetailedSteps(term.left, variavel, steps);
      } else {
        steps.push(`Esta é uma expressão composta de produto. Dependendo da forma, podemos precisar de técnicas como integração por partes ou substituição.`);
        steps.push(`Observação: Para produtos de funções não constantes, técnicas mais avançadas como integração por partes são necessárias.`);
      }
      break;
      
    case 'quotient':
      steps.push(`Regra: Para quocientes, as técnicas incluem frações parciais, substituições ou outras transformações algébricas.`);
      if (term.right?.type === 'constant' && term.left) {
        steps.push(`Como o denominador é uma constante, podemos simplificar: ∫ f(${variavel})/k d${variavel} = (1/k)·∫ f(${variavel}) d${variavel}`);
        steps.push(`Constante k = ${termToString(term.right)}`);
        steps.push(`Função f(${variavel}) = ${termToString(term.left)}`);
        steps.push(`Observação: Divisão por constante equivale à multiplicação pelo seu inverso fora da integral.`);
        
        // Adiciona passos detalhados para a função
        steps.push(`Calculando a integral de f(${variavel}):`);
        addDetailedSteps(term.left, variavel, steps);
      } else {
        steps.push(`Esta é uma expressão de divisão complexa. Podemos precisar de técnicas como frações parciais, substituições ou outras transformações.`);
        steps.push(`Observação: Integrais de frações podem requerer decomposição em frações parciais ou substituições.`);
      }
      break;
      
    case 'sin':
      steps.push(`Regra: Para o seno, ∫ sen(${variavel}) d${variavel} = -cos(${variavel}) + C`);
      steps.push(`Explicação: A integral do seno é o negativo do cosseno mais a constante de integração.`);
      steps.push(`Observação: Este resultado pode ser verificado derivando -cos(${variavel}) + C, que resulta em sen(${variavel}).`);
      break;
      
    case 'cos':
      steps.push(`Regra: Para o cosseno, ∫ cos(${variavel}) d${variavel} = sen(${variavel}) + C`);
      steps.push(`Explicação: A integral do cosseno é o seno mais a constante de integração.`);
      steps.push(`Observação: Este resultado pode ser verificado derivando sen(${variavel}) + C, que resulta em cos(${variavel}).`);
      break;
      
    case 'tan':
      steps.push(`Regra: Para a tangente, ∫ tan(${variavel}) d${variavel} = -ln|cos(${variavel})| + C = ln|sec(${variavel})| + C`);
      steps.push(`Explicação: A integral da tangente é o logaritmo natural do valor absoluto da secante mais a constante de integração.`);
      steps.push(`Observação: As duas formas são equivalentes pois sec(${variavel}) = 1/cos(${variavel}).`);
      break;
      
    case 'exp':
      steps.push(`Regra: Para a função exponencial, ∫ e^${variavel} d${variavel} = e^${variavel} + C`);
      steps.push(`Explicação: A função exponencial é igual à sua própria derivada, então sua integral é ela mesma mais a constante de integração.`);
      steps.push(`Observação: A função exponencial é a única função (exceto a função zero) que é igual à sua própria derivada.`);
      break;
      
    case 'ln':
      steps.push(`Regra: Para o logaritmo natural, ∫ ln(${variavel}) d${variavel} = ${variavel}·ln(${variavel}) - ${variavel} + C`);
      steps.push(`Explicação: A integral do logaritmo natural requer integração por partes.`);
      steps.push(`Observação: Este resultado pode ser verificado utilizando a regra do produto ao derivar ${variavel}·ln(${variavel}) - ${variavel} + C.`);
      break;
      
    default:
      steps.push(`Não foi possível determinar uma regra específica para este tipo de expressão.`);
      break;
  }
};

// Função auxiliar para explicar regras aplicadas
export const explainAppliedRules = (term: Term, variavel: string, steps: string[]): void => {
  switch (term.type) {
    case 'constant':
      steps.push(`Aplicando a regra para constantes: A integral de ${term.value} em relação a ${variavel} é ${term.value}${variavel} + C`);
      break;
      
    case 'variable':
      if (term.variable === variavel) {
        steps.push(`Aplicando a regra para variáveis: A integral de ${variavel} em relação a ${variavel} é ${variavel}²/2 + C`);
      } else {
        steps.push(`Tratando ${term.variable} como constante em relação a ${variavel}: A integral é ${term.variable}${variavel} + C`);
      }
      break;
      
    case 'power':
      if (term.argument?.type === 'variable' && term.argument.variable === variavel) {
        const exponent = term.exponent ?? 0;
        
        if (exponent === -1) {
          steps.push(`Aplicando a regra para 1/${variavel}: A integral de 1/${variavel} em relação a ${variavel} é ln|${variavel}| + C`);
        } else {
          steps.push(`Aplicando a regra para potências: A integral de ${variavel}^${exponent} em relação a ${variavel} é ${variavel}^${exponent+1}/${exponent+1} + C`);
        }
      }
      break;
      
    // Adiciona casos para outros tipos de termos conforme necessário
  }
};

// Gera passos de cálculo para integração
export const generateIntegralSteps = (
  expressao: string, 
  variavel: string, 
  tipoIntegral: 'indefinida' | 'definida',
  limiteInferior?: string,
  limiteSuperior?: string
): { resultado: string; passos: string[] } => {
  try {
    const calculationSteps: string[] = [];
    
    // Passo 1: Analisar a expressão
    calculationSteps.push(`Expressão original: ${expressao}`);
    
    // Tenta a detecção de padrões baseados em strings primeiro para casos especiais
    const stringBasedResult = calculateIntegralFromExpression(
      expressao, 
      variavel, 
      tipoIntegral === 'definida'
    );
    
    // Apenas trata como padrão especial se não começar com 'integral(' e 
    // corresponder a um dos nossos padrões especiais conhecidos
    const isSpecialPattern = !stringBasedResult.startsWith('integral(') && 
      (stringBasedResult.includes('ln|') || 
        stringBasedResult.includes('arcsin') || 
        stringBasedResult.includes('ln(1+e^') || 
        stringBasedResult.includes('ln(x^2+1)'));
    
    if (isSpecialPattern) {
      // Temos um padrão especial de string direto - mostrar mensagem de padrão especial
      calculationSteps.push(`Detectado padrão especial na expressão: ${expressao}`);
      calculationSteps.push(`Aplicando regra específica para este padrão.`);
      
      // Verifica se o resultado já tem "+ C" antes de adicioná-lo
      const resultHasConstant = stringBasedResult.includes(" + C");
      const formattedResult = resultHasConstant ? stringBasedResult : `${stringBasedResult} + C`;
      calculationSteps.push(`Resultado da integral indefinida: ${formattedResult}`);
      
      if (tipoIntegral === 'indefinida') {
        return {
          resultado: formattedResult,
          passos: calculationSteps
        };
      } else {
        // Lida com a integral definida para o resultado de string
        if (!limiteInferior || !limiteSuperior) {
          throw new Error("É necessário especificar os limites de integração.");
        }
        
        calculationSteps.push(`Calculando a integral definida com limites: [${limiteInferior}, ${limiteSuperior}]`);
        calculationSteps.push(`Aplicando o Teorema Fundamental do Cálculo: F(${limiteSuperior}) - F(${limiteInferior})`);
        calculationSteps.push(`Onde F(${variavel}) = ${stringBasedResult} é a primitiva (antiderivada) da função.`);
        calculationSteps.push(`Explicação: O Teorema Fundamental do Cálculo relaciona a integral definida com a antiderivada, permitindo calcular a área sob a curva através da diferença dos valores da antiderivada nos limites de integração.`);
        calculationSteps.push(`Processo: Substituímos os limites na antiderivada e calculamos a diferença.`);
        
        // Adiciona passos mais detalhados sobre a substituição
        calculationSteps.push(`Substituindo o limite superior ${limiteSuperior} na antiderivada:`);
        calculationSteps.push(`F(${limiteSuperior}) = ${stringBasedResult.replace(new RegExp(variavel, 'g'), `(${limiteSuperior})`)}`);
        
        calculationSteps.push(`Substituindo o limite inferior ${limiteInferior} na antiderivada:`);
        calculationSteps.push(`F(${limiteInferior}) = ${stringBasedResult.replace(new RegExp(variavel, 'g'), `(${limiteInferior})`)}`);
        
        // Calcula a integral definida
        const result = evaluateDefiniteIntegral(
          stringBasedResult,
          variavel,
          limiteInferior,
          limiteSuperior
        );
        
        calculationSteps.push(`Calculando a diferença: F(${limiteSuperior}) - F(${limiteInferior}) = ${result}`);
        calculationSteps.push(`Resultado da integral definida: ${result}`);
        calculationSteps.push(`Interpretação geométrica: Este valor representa a área sob a curva f(${variavel}) = ${expressao} no intervalo [${limiteInferior}, ${limiteSuperior}].`);
        
        return {
          resultado: `${result}`,
          passos: calculationSteps
        };
      }
    }

    
    // Como fallback, analisa a expressão e calcula usando o método baseado em termos
    const parsedTerm = parseExpression(expressao, variavel);
    
    if (!parsedTerm) {
      throw new Error(`Não foi possível analisar a expressão "${expressao}".`);
    }
    
    // Passo 2: Calcular a integral indefinida
    calculationSteps.push(`Calculando a integral indefinida: ∫ ${expressao} d${variavel}`);
    
    // Adicionar passos detalhados baseados no tipo de expressão
    addDetailedSteps(parsedTerm, variavel, calculationSteps);
    
    // Calcular o resultado da integral
    const integralTerm = calculateIntegral(parsedTerm, variavel);
    
    if (!integralTerm) {
      throw new Error("Não foi possível calcular a integral desta expressão.");
    }
    
    // Formatar o resultado
    let resultadoIndefinido = integralTerm;
    
    if (tipoIntegral === 'indefinida') {
      // Verifica se o resultado já tem um "+ C" antes de adicioná-lo
      const resultHasConstant = resultadoIndefinido.includes(" + C");
      const formattedResult = resultHasConstant ? resultadoIndefinido : `${resultadoIndefinido} + C`;
      calculationSteps.push(`Resultado da integral indefinida: ${formattedResult}`);
      return {
        resultado: formattedResult,
        passos: calculationSteps
      };
    } else {
      // Para integrais definidas
      if (!limiteInferior || !limiteSuperior) {
        throw new Error("É necessário especificar os limites de integração.");
      }
      
      calculationSteps.push(`Calculando a integral definida com limites: [${limiteInferior}, ${limiteSuperior}]`);
      
      // Adicionar passos sobre a substituição dos limites
      calculationSteps.push(`Aplicando o Teorema Fundamental do Cálculo: F(${limiteSuperior}) - F(${limiteInferior})`);
      calculationSteps.push(`Onde F(${variavel}) = ${resultadoIndefinido} é a primitiva (antiderivada) da função.`);
      
      // Avaliar a integral definida
      const result = evaluateDefiniteIntegral(
        integralTerm,
        variavel,
        limiteInferior,
        limiteSuperior
      );
      
      calculationSteps.push(`Resultado da integral definida: ${result}`);
      
      return {
        resultado: `${result}`,
        passos: calculationSteps
      };
    }
  } catch (error) {
    throw error;
  }
};

// Função para processar passos com numeração
export const processStepsWithNumbering = (steps: string[]): string[] => {
  let stepCounter = 1;
  const processedSteps: string[] = [];
  
  // Rastreia quais passos já foram adicionados para evitar duplicação
  const stepText = new Set<string>();
  
  // Pre-process steps to mark explanations
  const markedSteps: { text: string; isExplanation: boolean; isObservation: boolean }[] = [];
  
  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    
    // Remove any numeric counter from substeps
    const modifiedStep = step.replace(/^\d+\) Para o termo:/, 'Para o termo:');
    
    if (modifiedStep.startsWith("Explicação:")) {
      markedSteps.push({
        text: modifiedStep,
        isExplanation: true,
        isObservation: false
      });
    } else if (modifiedStep.startsWith("Observação:")) {
      markedSteps.push({
        text: modifiedStep,
        isExplanation: false,
        isObservation: true
      });
    } else {
      markedSteps.push({
        text: modifiedStep,
        isExplanation: false,
        isObservation: false
      });
    }
  }
  
  // Rastreia o passo atual para saber qual deles recebe um prefixo "Passo X:"
  let currentStepIndex = 0;
  
  // Primeiro, trata o passo original da expressão
  if (markedSteps.length > 0 && markedSteps[0].text.includes('Expressão original:')) {
    processedSteps.push(`Passo ${stepCounter++}: Analisar a expressão original`);
    processedSteps.push(markedSteps[0].text);
    stepText.add(markedSteps[0].text);
    currentStepIndex = 1;
    
    // Adiciona qualquer explicação ou observação que siga imediatamente
    while (currentStepIndex < markedSteps.length && 
           (markedSteps[currentStepIndex].isExplanation || markedSteps[currentStepIndex].isObservation)) {
      processedSteps.push(markedSteps[currentStepIndex].text);
      stepText.add(markedSteps[currentStepIndex].text);
      currentStepIndex++;
    }
  }
  
  // Processa os passos restantes
  for (let i = currentStepIndex; i < markedSteps.length; i++) {
    const step = markedSteps[i];
    
    // Pula passos que já foram processados
    if (stepText.has(step.text)) {
      continue;
    }
    
    // Adiciona passos numerados para passos de cálculo principais
    if (step.text.includes('Calculando a integral') && !step.isExplanation && !step.isObservation) {
      processedSteps.push(`Passo ${stepCounter++}: ${step.text}`);
      stepText.add(step.text);
    }
    // Adiciona passos numerados para aplicação de regras
    else if (step.text.includes('Aplicando a regra') && !step.isExplanation && !step.isObservation) {
      processedSteps.push(`Passo ${stepCounter++}: ${step.text}`);
      stepText.add(step.text);
    }
    // Adiciona passos não numerados para explicações, observações e detalhes
    else if (!step.text.match(/^Passo \d+:/) && !stepText.has(step.text)) {
      processedSteps.push(step.text);
      stepText.add(step.text);
    }
  }
  
  return processedSteps;
}; 