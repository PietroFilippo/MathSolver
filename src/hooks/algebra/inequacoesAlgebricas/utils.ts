import { PassoResolucao, TipoInequacao } from '../../../utils/mathUtilsAlgebra/inequalities/algebraInequalityTypes';
import { solveInequality, checkValue } from '../../../utils/mathUtilsAlgebra/inequalities/algebraInequalities';

// Define padrões para melhor explicação de passos
const patterns = {
  inequality: ['Inequação original:', 'Expressão original:', 'Forma inicial:'],
  rule: ['Aplicando a regra:', 'Regra aplicada:', 'Fórmula:'],
  property: ['Propriedade:', 'distributiva', 'comutativa', 'associativa', 'transitividade', 'lei'],
  method: ['Método:', 'Técnica:', 'Transformação:', 'Substituição:'],
  calculation: ['Calculando:', 'Computando:', 'Multiplicando', 'dividir por', 'dividindo por'],
  combine: ['termos semelhantes', 'coeficientes', 'simplificar', 'Simplificando:', 'Combinando termos:'],
  isolation: ['Isolando', 'variável', 'isolar', 'Isolando o termo:'],
  result: ['Resultado:', 'resultado final', 'Solução final:', 'Verificação concluída:', 'Conjunto solução:'],
  verify: ['Verificando:', 'Verificação:', 'Demonstração:', 'substitui o valor'],
  interval: ['Intervalo de solução:', 'Conjunto solução:', 'Valores de x:', 'Representação do conjunto:'],
  analysis: ['Análise:', 'Identificando', 'Estrutura:', 'Tipo de inequação:'],
  observation: ['Observação:', 'Nota:', 'Importante:'],
  signChange: ['inverter o sinal', 'mudança de sinal', 'Invertendo a desigualdade:', 'Trocando o sentido:']
};

// Função auxiliar para verificar se uma string corresponde a qualquer padrão em um grupo
const matchesAny = (text: string, patternGroup: string[]): boolean => {
  return patternGroup.some(pattern => text.includes(pattern));
};

// Explicações para operações de desigualdade
const ruleExplanations = {
  multiplicacao: {
    positivo: 'Ao multiplicar ambos os lados por um número positivo, o sinal da desigualdade permanece o mesmo.',
    negativo: 'Ao multiplicar ambos os lados por um número negativo, o sinal da desigualdade deve ser invertido.'
  },
  divisao: {
    positivo: 'Ao dividir ambos os lados por um número positivo, o sinal da desigualdade permanece o mesmo.',
    negativo: 'Ao dividir ambos os lados por um número negativo, o sinal da desigualdade deve ser invertido.'
  },
  adicao: 'Ao adicionar ou subtrair o mesmo valor em ambos os lados, o sinal da desigualdade permanece o mesmo.',
  subtracao: 'Ao adicionar ou subtrair o mesmo valor em ambos os lados, o sinal da desigualdade permanece o mesmo.',
  transitividade: 'Se a < b e b < c, então a < c. O mesmo vale para outras relações de desigualdade.'
};

// Helper para formatar o resultado com o prefixo apropriado
const formatResult = (result: string): string => {
  return `Resultado: ${result}`;
};

// Helper para explicar as regras aplicadas a cada passo
const explainInequalityRule = (step: string): string[] => {
  const explanations: string[] = [];
  
  // Verificar operações específicas e adicionar explicações correspondentes
  if (step.includes('multiplicando por') || step.includes('vezes')) {
    if (step.includes('multiplicando por -') || step.includes('número negativo')) {
      explanations.push(ruleExplanations.multiplicacao.negativo);
    } else {
      explanations.push(ruleExplanations.multiplicacao.positivo);
    }
  } else if (step.includes('dividindo por') || step.includes('dividir por')) {
    if (step.includes('dividindo por -') || step.includes('número negativo')) {
      explanations.push(ruleExplanations.divisao.negativo);
    } else {
      explanations.push(ruleExplanations.divisao.positivo);
    }
  } else if (step.includes('adicionando') || step.includes('somando')) {
    explanations.push(ruleExplanations.adicao);
  } else if (step.includes('subtraindo')) {
    explanations.push(ruleExplanations.subtracao);
  } else if (step.includes('inverter o sinal') || step.includes('trocando o sentido')) {
    explanations.push('Quando multiplicamos ou dividimos por um número negativo, devemos inverter o sinal da desigualdade.');
  }
  
  // Explicações para tipos específicos de passos
  if (step.includes('simplificando')) {
    explanations.push('Agrupando termos semelhantes para simplificar a inequação.');
  } else if (step.includes('isolar')) {
    explanations.push('Realizando operações em ambos os lados para isolar a variável.');
  } else if (step.includes('teste de sinal') || step.includes('pontos críticos')) {
    explanations.push('Encontrando os pontos críticos onde a expressão muda de sinal.');
  } else if (step.includes('solução em intervalo') || step.includes('conjunto solução')) {
    explanations.push('Expressando a solução na forma de intervalo ou conjunto.');
  }
  
  return explanations;
};

// Formatar passo com prefixos apropriados
const formatStep = (step: string): string => {
  // Se já formatado, retornar o mesmo
  if (step.includes('Inequação original:') || 
      step.includes('Resultado:')) {
    return step;
  }
  
  // Adicionar prefixos apropriados conforme o conteúdo do passo
  if (matchesAny(step, patterns.rule)) {
    return `Regra aplicada: ${step}`;
  } else if (matchesAny(step, patterns.property)) {
    return `Propriedade: ${step}`;
  } else if (matchesAny(step, patterns.method)) {
    return `Método: ${step}`;
  } else if (matchesAny(step, patterns.calculation)) {
    return `Calculando: ${step}`;
  } else if (matchesAny(step, patterns.combine)) {
    return `Simplificando: ${step}`;
  } else if (matchesAny(step, patterns.isolation)) {
    return `Isolando: ${step}`;
  } else if (matchesAny(step, patterns.verify)) {
    return `Verificação: ${step}`;
  } else if (matchesAny(step, patterns.interval)) {
    return `Intervalo de solução: ${step}`;
  } else if (matchesAny(step, patterns.analysis)) {
    return `Análise: ${step}`;
  } else if (matchesAny(step, patterns.observation)) {
    return `Observação: ${step}`;
  } else if (matchesAny(step, patterns.signChange)) {
    return `Invertendo a desigualdade: ${step}`;
  }
  
  return step;
};

// Aumentar passos com explicações
const enhanceSteps = (
  passos: PassoResolucao[],
  resultado: string,
  intervalo: string,
  tipoIneq: TipoInequacao
): string[] => {
  const enhancedSteps: string[] = [];
  
  // Rastrear explicações já adicionadas para evitar duplicatas
  const addedExplanations: Set<string> = new Set();
  const processedExpressions = new Set<string>(); // Para evitar duplicatas de expressões
  
  // Primeiro passo: inequação original
  if (passos.length > 0 && passos[0].expressao) {
    const inequacaoOriginal = passos[0].expressao;
    enhancedSteps.push(`Inequação original: ${inequacaoOriginal}`);
    processedExpressions.add(inequacaoOriginal);
    
    // Adicionar análise específica para cada tipo de inequação
    if (tipoIneq === 'quadratica') {
      enhancedSteps.push(`Análise: Esta é uma inequação quadrática da forma ax² + bx + c ${inequacaoOriginal.includes('>') ? '>' : '<'} 0`);
      enhancedSteps.push(`Método: Para resolver inequações quadráticas, precisamos encontrar as raízes da equação correspondente e analisar o sinal da expressão em cada intervalo.`);
    } else if (tipoIneq === 'linear') {
      enhancedSteps.push(`Análise: Esta é uma inequação linear da forma ax + b ${inequacaoOriginal.includes('>') ? '>' : '<'} 0, onde a ≠ 0`);
      enhancedSteps.push(`Método: Para resolver inequações lineares, reorganizamos os termos e isolamos a variável x.`);
    } else if (tipoIneq === 'racional') {
      enhancedSteps.push(`Análise: Esta é uma inequação racional que envolve frações algébricas.`);
      enhancedSteps.push(`Método: Para resolver inequações racionais, precisamos encontrar os pontos críticos onde o denominador se anula e analisar o sinal em cada intervalo.`);
    } else if (tipoIneq === 'modulo') {
      enhancedSteps.push(`Análise: Esta é uma inequação que envolve valor absoluto.`);
      enhancedSteps.push(`Método: Para resolver inequações com módulo, precisamos considerar os casos para valores dentro e fora do módulo.`);
    }
  }
  
  // Segundo passo: reorganização
  enhancedSteps.push(`Organizando os termos: Mover todos os termos para o lado esquerdo para obter a forma ${tipoIneq === 'quadratica' ? 'ax² + bx + c' : 'ax + b'} ${passos[0].expressao.includes('>') ? '>' : '<'} 0`);
  
  // Mapeamento para rastrear as etapas principais
  const mainSteps = new Map<string, { step: string, subSteps: string[] }>();
  let currentMainStep = 'Organizando os termos';
  let hasDividingStep = false;
  let hasIsolationStep = false;
  
  // Processar passos intermediários
  for (let i = 1; i < passos.length; i++) {
    const currentStep = passos[i].expressao;
    
    // Pular passos vazios ou já processados
    if (!currentStep || processedExpressions.has(currentStep)) continue;
    processedExpressions.add(currentStep);
    
    // Verifique os primeiros passos (normalmente são a reorganização)
    if (i === 1 || i === 2) {
      // Adicionar como subpasso de reorganização
      enhancedSteps.push(currentStep);
      continue;
    }
    
    // Detectar simplificação
    if (currentStep.match(/\d+x\s*[\+\-]\s*\d+\s*[<>≤≥]\s*0/) && !mainSteps.has('Simplificando')) {
      currentMainStep = 'Simplificando';
      enhancedSteps.push(`Simplificando: ${currentStep}`);
      mainSteps.set(currentMainStep, { step: `Simplificando: ${currentStep}`, subSteps: [] });
      continue;
    }
    
    // Detectar divisão
    if (currentStep.match(/x\s*[<>≤≥]\s*[\-\d\.]+/) && !hasDividingStep) {
      // Extrair coeficiente do passo anterior
      let coeficiente = '1';
      for (let j = i - 1; j >= 0; j--) {
        const match = passos[j].expressao.match(/(\d+)x/);
        if (match) {
          coeficiente = match[1];
          break;
        }
      }
      
      // Verificar se o coeficiente é maior que 1 (se precisamos dividir)
      if (parseInt(coeficiente) > 1) {
        currentMainStep = 'Dividindo';
        hasDividingStep = true;
        enhancedSteps.push(`Dividindo ambos os lados por ${coeficiente} (coeficiente positivo, mantendo o sentido da desigualdade)`);
        enhancedSteps.push(`Propriedade: Ao dividir ambos os lados por um número positivo, o sentido da desigualdade é preservado.`);
        enhancedSteps.push(currentStep);
        mainSteps.set(currentMainStep, { 
          step: `Dividindo ambos os lados por ${coeficiente}`,
          subSteps: [
            `Propriedade: Ao dividir ambos os lados por um número positivo, o sentido da desigualdade é preservado.`,
            currentStep
          ]
        });
      }
      continue;
    }
    
    // Detectar isolamento da variável
    if (currentStep.match(/x\s*[<>≤≥]/) && !hasIsolationStep) {
      currentMainStep = 'Isolando';
      hasIsolationStep = true;
      enhancedSteps.push(`Isolando: Isolamos a variável x para determinar quais valores satisfazem a inequação.`);
      enhancedSteps.push(currentStep);
      mainSteps.set(currentMainStep, {
        step: `Isolando: Isolamos a variável x para determinar quais valores satisfazem a inequação.`,
        subSteps: [currentStep]
      });
      continue;
    }
    
    // Detectar notação de intervalo ou conjunto solução
    if (currentStep.includes('∞') || currentStep.includes('(') || currentStep.includes('[') || 
        currentStep.includes(')') || currentStep.includes(']')) {
      // Este passo representa a solução em notação de intervalo
      // Primeiro, verificar se já temos o passo principal para isso
      if (!mainSteps.has('Intervalo')) {
        enhancedSteps.push(`x ${mainGetInequalitySymbol(currentStep)} ⟹ ${currentStep}`);
        mainSteps.set('Intervalo', {
          step: `x ${mainGetInequalitySymbol(currentStep)} ⟹ ${currentStep}`,
          subSteps: []
        });
      } else {
        // Se já existe, adicione como subpasso
        const mainStep = mainSteps.get('Intervalo')!;
        mainStep.subSteps.push(currentStep);
        enhancedSteps.push(currentStep);
      }
      continue;
    }
    
    // Caso padrão para outros passos
    enhancedSteps.push(currentStep);
  }
  
  // Adicionar resultado final
  enhancedSteps.push(`Obter o resultado final`);
  enhancedSteps.push(formatResult(resultado));
  
  // Adicionar intervalo de solução
  if (intervalo) {
    enhancedSteps.push(`Intervalo de solução: Expressamos a solução usando notação de intervalo.`);
    enhancedSteps.push(`Intervalo de solução: ${intervalo}`);
    enhancedSteps.push(explicarNotacaoIntervalo(intervalo));
  }
  
  return enhancedSteps;
};

// Helper para extrair o símbolo de desigualdade
const mainGetInequalitySymbol = (text: string): string => {
  if (text.includes('<') && text.includes('=')) return '≤';
  if (text.includes('>') && text.includes('=')) return '≥';
  if (text.includes('<')) return '<';
  if (text.includes('>')) return '>';
  return '?';
};

// Função para explicar a notação de intervalo
const explicarNotacaoIntervalo = (intervalo: string): string => {
  // Verificar se é intervalo aberto, fechado ou semi-aberto
  if (intervalo.includes('(') && intervalo.includes(')')) {
    return `Propriedade: Os parênteses ( ) indicam que os extremos NÃO pertencem ao conjunto solução (intervalo aberto).`;
  } else if (intervalo.includes('[') && intervalo.includes(']')) {
    return `Propriedade: Os colchetes [ ] indicam que os extremos pertencem ao conjunto solução (intervalo fechado).`;
  } else if ((intervalo.includes('(') && intervalo.includes(']')) || 
             (intervalo.includes('[') && intervalo.includes(')'))) {
    return `Propriedade: A combinação de parênteses e colchetes indica um intervalo semi-aberto, onde apenas um dos extremos pertence ao conjunto solução.`;
  }
  
  // Explicação para infinito
  if (intervalo.includes('-∞') && intervalo.includes('∞')) {
    return `Propriedade: O símbolo ∞ representa infinito, indicando que o intervalo se estende indefinidamente.`;
  } else if (intervalo.includes('-∞')) {
    return `Propriedade: O símbolo -∞ indica que o intervalo se estende indefinidamente para a esquerda na reta numérica.`;
  } else if (intervalo.includes('∞')) {
    return `Propriedade: O símbolo ∞ indica que o intervalo se estende indefinidamente para a direita na reta numérica.`;
  }
  
  return `Propriedade: Esta notação de intervalo representa o conjunto de todos os valores que satisfazem a inequação.`;
};

// Adicionar numeração aos passos
export const processStepsWithNumbering = (steps: string[]): string[] => {
  let finalSteps: string[] = [];
  let stepCount = 1;
  
  // Define os padrões que identificam passos principais
  const mainStepIndicators = [
    'Inequação original:',
    'Organizando os termos:',
    'Simplificando:',
    'Dividindo ambos os lados',
    'Isolando:',
    'Expressamos',
    'Obter o resultado final',
    'Intervalo de solução: Expressamos'
  ];
  
  // Padrões que sempre devem ser tratados como subpassos, nunca como passos principais
  const alwaysSubstepPatterns = [
    'Análise:', 'Método:', 'Propriedade:', 'Observação:',
    'Resultado:'
  ];
  
  // Variáveis para controlar o passo atual
  let mainSteps: string[] = [];
  let currentExplanations: string[] = [];
  let isProcessingIntervalStep = false;
  
  // Primeiro passo sempre é o principal
  for (let i = 0; i < steps.length; i++) {
    const currentStep = steps[i];
    
    // Verificar se deve ser sempre um subpasso
    const isAlwaysSubstep = alwaysSubstepPatterns.some(pattern => 
      currentStep.startsWith(pattern)
    );
    
    if (isAlwaysSubstep) {
      // Sempre adicionar como subpasso do passo principal atual
      currentExplanations.push(currentStep);
      continue;
    }
    
    // Se estamos processando um passo de intervalo e este passo é uma notação de intervalo
    const isIntervalNotation = isProcessingIntervalStep && 
      /[\(\[].+[\)\]]/.test(currentStep) &&
      !currentStep.includes("Intervalo de solução:") &&
      !currentStep.startsWith("Propriedade:");
    
    if (isIntervalNotation) {
      // Adicionar como subpasso do intervalo
      currentExplanations.push(currentStep);
      isProcessingIntervalStep = false; // Reset após processar a notação
      continue;
    }
    
    // Se parece um passo principal
    const isMainStep = mainStepIndicators.some(indicator => 
      currentStep.includes(indicator)
    ) || (i > 0 && currentStep.startsWith('Passo '));
    
    // Identificar se estamos iniciando um passo de intervalo
    if (currentStep.includes("Intervalo de solução:")) {
      isProcessingIntervalStep = true;
    }
    
    if (isMainStep) {
      // Se temos um passo principal anterior
      if (mainSteps.length > 0) {
        // Adicionar o passo principal com suas explicações
        finalSteps.push(`Passo ${stepCount++}: ${mainSteps[mainSteps.length - 1]}`);
        finalSteps = finalSteps.concat(currentExplanations);
        
        // Limpar as explicações para o próximo passo
        currentExplanations = [];
      }
      
      // Adicionar o passo atual como o novo passo principal
      mainSteps.push(currentStep);
    } 
    // Se é uma explicação, verificação ou separador
    else if (currentStep.startsWith('---')) {
      finalSteps.push(currentStep);
    }
    // Caso contrário, é uma explicação para o passo atual
    else {
      currentExplanations.push(currentStep);
    }
  }
  
  // Processar o último passo principal caso existir
  if (mainSteps.length > 0) {
    finalSteps.push(`Passo ${stepCount++}: ${mainSteps[mainSteps.length - 1]}`);
    finalSteps = finalSteps.concat(currentExplanations);
  }
  
  return finalSteps;
};

// Função principal para resolver desigualdades
export const solveInequalityWithSteps = (
  inequacao: string, 
  tipoInequacao: TipoInequacao
): { resultado: string; intervaloSolucao: string; passos: string[] } => {
  try {
    const result = solveInequality(inequacao, tipoInequacao);
    // Aumentar passos com explicações
    const enhancedSteps = enhanceSteps(result.passos, result.solution, result.interval, tipoInequacao);
    const numberedSteps = processStepsWithNumbering(enhancedSteps);
    
        return {
      resultado: result.solution,
      intervaloSolucao: result.interval,
      passos: numberedSteps
    };
  } catch (error) {
    throw new Error(`Erro ao resolver a inequação: ${error}`);
  }
};

// Função para verificar se um valor satisfaz uma desigualdade
export const checkValueSatisfiesInequality = (
  inequacao: string,
  valor: string
): { resultado: boolean; passos: string[] } => {
  try {
    const result = checkValue(inequacao, valor);
    const tipoInequacao = detectTipoInequacao(inequacao);
    // Aumentar passos com explicações
    const enhancedSteps = enhanceSteps(
      result.passos, 
      result.resultado ? `O valor ${valor} satisfaz a inequação` : `O valor ${valor} não satisfaz a inequação`,
      '',
      tipoInequacao
    );
    const numberedSteps = processStepsWithNumbering(enhancedSteps);
    
    return {
      resultado: result.resultado,
      passos: numberedSteps
    };
  } catch (error) {
    throw new Error(`Erro ao verificar o valor: ${error}`);
  }
};

// Helper para detectar o tipo de inequação 
export function detectTipoInequacao(inequacao: string): TipoInequacao {
  // Verificar se a inequação é quadrática (contém x^2 ou x² ou similar)
  if (/x\s*\^\s*2|x\s*²/.test(inequacao)) {
    return 'quadratica';
  }
  
  // Verificar se a inequação é racional (tem divisão com x no denominador)
  if (/\/.+x/.test(inequacao) || /\(.+\)\s*\/\s*\(.+x.+\)/.test(inequacao)) {
    return 'racional';
  }
  
  // Verificar se a inequação é modular (contém |x| ou abs(x))
  if (/\|.+\|/.test(inequacao) || /abs\s*\(.+\)/.test(inequacao)) {
    return 'modulo';
  }
  
  // Default para linear
  return 'linear';
}