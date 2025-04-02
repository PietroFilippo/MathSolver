import { 
  getAlgebraicSimplificationExamples,
  getAlgebraicExpansionExamples,
  getAlgebraicFactorizationExamples
} from '../../../utils/mathUtilsAlgebra/algebraExamples';
import { 
  simplifyAlgebraicExpression as simplifyAlgebraExpression,
  expandAlgebraicExpression as expandAlgebraExpression, 
  factorizeAlgebraicExpression as factorizeAlgebraExpression 
} from '../../../utils/mathUtilsAlgebra/algebraAPI';
import { Term } from '../../../utils/mathUtilsCalculo/geral/termDefinition';
import { approximatelyEqual } from '../../../utils/mathUtils';
import { algebraicExpressionsConceptsAndRules } from './concepts';

// Define padrões de palavras-chave para facilitar a interpretação dos passos
const patterns = {
  equation: ['Equação original:', 'Expressão original:', 'Forma inicial:'],
  rule: ['Aplicando a regra:', 'Regra aplicada:', 'Fórmula:'],
  property: ['Propriedade:', 'distributiva', 'comutativa', 'associativa', 'potência', 'lei'],
  method: ['Método:', 'Técnica:', 'Transformação:', 'Substituição:'],
  calculation: ['Calculando:', 'Computando:', 'Multiplicando', 'dividir por', 'dividindo por'],
  combine: ['termos semelhantes', 'coeficientes', 'simplificar', 'Simplificando:', 'Combinando termos:'],
  isolation: ['Isolando', 'variável', 'isolar', 'Isolando o fator comum:'],
  factorize: ['Fatorando', 'fator comum', 'diferença de quadrados', 'trinômio'],
  result: ['Resultado:', 'resultado final', 'Solução final:', 'Verificação concluída:'],
  verify: ['Verificando:', 'Verificação:', 'Demonstração:', 'recuperamos a expressão original'],
  expand: ['Expandindo', 'expandir', 'expansão', 'distributiva', 'produtos notáveis'],
  analysis: ['Análise:', 'Identificando', 'Estrutura:'],
  observation: ['Observação:', 'Nota:', 'exemplo similar']
};

// Função auxiliar para verificar se uma string corresponde a qualquer padrão em um grupo
const matchesAny = (text: string, patternGroup: string[]): boolean => {
  return patternGroup.some(pattern => text.includes(pattern));
};

// Re-exporta as funções de exemplos diretamente
export { 
  getAlgebraicSimplificationExamples,
  getAlgebraicExpansionExamples,
  getAlgebraicFactorizationExamples
};

// Helper para formatar o resultado com o prefixo apropriado
const formatResult = (result: string, operation: 'simplificar' | 'expandir' | 'fatorar'): string => {
  switch (operation) {
    case 'expandir':
      return `Resultado: ${result}`;
    case 'fatorar':
      return `Resultado: ${result}`;
    case 'simplificar':
      return `Resultado: ${result}`;
    default:
      return `Resultado: ${result}`;
  }
};

// Categoriza explicações de regras para reduzir padrões repetitivos
const ruleExplanations = {
  simplificar: {
    fatorComum: 'Identificando e colocando o fator comum em evidência para simplificação.',
    termosSemelhantes: 'Combinando termos semelhantes para simplificar a expressão.',
    agrupamento: 'Simplificando os termos da expressão agrupando variáveis de mesmo grau.',
    multiplicacao: 'Realizando multiplicações para simplificar a expressão.',
    divisao: 'Simplificando as divisões na expressão.',
    potenciacao: 'Aplicando as leis de potenciação para simplificar a expressão.'
  },
  expandir: {
    distributiva: 'Aplicando a propriedade distributiva: a(b + c) = ab + ac',
    quadradoSoma: 'Aplicando a fórmula do quadrado da soma: (a + b)² = a² + 2ab + b²',
    quadradoDiferenca: 'Aplicando a fórmula do quadrado da diferença: (a - b)² = a² - 2ab + b²',
    produtoSomaDiferenca: 'Aplicando a fórmula do produto da soma pela diferença: (a + b)(a - b) = a² - b²',
    multiplicacao: 'Multiplicando os termos para remover os parênteses.'
  },
  fatorar: {
    fatorComum: 'Isolando o fator comum: ax + ay = a(x + y)',
    diferencaQuadrados: 'Aplicando a fórmula para diferença de quadrados: a² - b² = (a+b)(a-b)',
    trinomioQuadrado: 'Reconhecendo o trinômio quadrado perfeito: a² + 2ab + b² = (a+b)²',
    trinomio: 'Fatorando o trinômio: ax² + bx + c = a(x-r₁)(x-r₂) onde r₁ e r₂ são raízes.',
    agrupamento: 'Usando o método de agrupamento para fatorar a expressão.'
  }
};

// Helpers para explicar as regras aplicadas em cada passo
const explainAlgebraicRule = (step: string, operation: 'simplificar' | 'expandir' | 'fatorar'): string[] => {
  const explanations: string[] = [];
  
  // Primeiro, tentamos encontrar regras específicas
  const matchedRules = findMatchingRules(step, operation);
  
  if (matchedRules.length > 0) {
    // Usar a primeira regra encontrada como principal
    const primaryRule = matchedRules[0];
    
    // Adaptar o prefixo com base na operação
    const rulePrefixes = {
      'expandir': 'Regra de expansão:',
      'fatorar': 'Regra de fatoração:',
      'simplificar': 'Regra de simplificação:'
    };
    
    const rulePrefix = rulePrefixes[operation] || 'Regra aplicada:';
    
    explanations.push(`${rulePrefix} ${primaryRule.nome}`);
    explanations.push(`${primaryRule.explicacao}`);
    
    // Adicionar exemplo similar, se disponível
    if (primaryRule.exemplo) {
      explanations.push(`Exemplo similar: ${primaryRule.exemplo}`);
    }
  } else {
    // Explicações genéricas com base na operação e padrões no passo
    const rulesByOperation = ruleExplanations[operation];
    
    // Verificar padrões específicos e adicionar explicações correspondentes
    if (operation === 'simplificar') {
      if (step.includes('fator comum')) {
        explanations.push((rulesByOperation as typeof ruleExplanations.simplificar).fatorComum);
      } else if (step.includes('+') || step.includes('-')) {
        if (step.toLowerCase().includes('semelhante')) {
          explanations.push((rulesByOperation as typeof ruleExplanations.simplificar).termosSemelhantes);
        } else {
          explanations.push((rulesByOperation as typeof ruleExplanations.simplificar).agrupamento);
        }
      } else if (step.includes('*') || step.includes('×')) {
        explanations.push((rulesByOperation as typeof ruleExplanations.simplificar).multiplicacao);
      } else if (step.includes('/') || step.includes('÷')) {
        explanations.push((rulesByOperation as typeof ruleExplanations.simplificar).divisao);
      } else if (step.includes('^')) {
        explanations.push((rulesByOperation as typeof ruleExplanations.simplificar).potenciacao);
      }
    } 
    else if (operation === 'expandir') {
      if (step.includes('distributiva')) {
        explanations.push((rulesByOperation as typeof ruleExplanations.expandir).distributiva);
      } else if (step.includes('quadrado') || step.includes('soma')) {
        explanations.push((rulesByOperation as typeof ruleExplanations.expandir).quadradoSoma);
      } else if (step.includes('diferença')) {
        explanations.push((rulesByOperation as typeof ruleExplanations.expandir).quadradoDiferenca);
      } else if (step.includes('produto') && step.includes('soma') && step.includes('diferença')) {
        explanations.push((rulesByOperation as typeof ruleExplanations.expandir).produtoSomaDiferenca);
      } else if (step.includes('(') && step.includes(')')) {
        explanations.push((rulesByOperation as typeof ruleExplanations.expandir).multiplicacao);
      }
    }
    else if (operation === 'fatorar') {
      if (step.includes('fator comum')) {
        explanations.push((rulesByOperation as typeof ruleExplanations.fatorar).fatorComum);
      } else if (step.includes('diferença de quadrados')) {
        explanations.push((rulesByOperation as typeof ruleExplanations.fatorar).diferencaQuadrados);
      } else if (step.includes('trinômio') && step.includes('quadrado')) {
        explanations.push((rulesByOperation as typeof ruleExplanations.fatorar).trinomioQuadrado);
      } else if (step.includes('trinômio')) {
        explanations.push((rulesByOperation as typeof ruleExplanations.fatorar).trinomio);
      } else if (step.includes('agrupamento')) {
        explanations.push((rulesByOperation as typeof ruleExplanations.fatorar).agrupamento);
      }
    }
  }
  
  return explanations;
};

// Função para encontrar regras que se aplicam a um determinado passo
const findMatchingRules = (step: string, operation: 'simplificar' | 'expandir' | 'fatorar') => {
  const allCategories = algebraicExpressionsConceptsAndRules.categorias;
  
  // Mapeamento das operações para nomes de categorias
  const categoryMap = {
    'simplificar': "Simplificação de Expressões",
    'expandir': "Expansão de Expressões", 
    'fatorar': "Fatoração de Expressões"
  };
  
  const categoryName = categoryMap[operation];
  const targetCategory = allCategories.find(cat => cat.nome === categoryName);
  
  if (!targetCategory) return [];
  
  // Verificar cada regra na categoria para ver se ela se aplica
  return targetCategory.regras.filter(rule => {
    // Verificar por palavras-chave no nome da regra que aparecem no passo
    const keywords = rule.nome.toLowerCase().split(' ');
    return keywords.some(keyword => 
      keyword.length > 3 && step.toLowerCase().includes(keyword)
    );
  });
};

// Simplifica uma expressão algébrica
export const simplifyAlgebraicExpression = (expression: string): { result: string, steps: string[] } => {
  const result = simplifyAlgebraExpression(expression);
  return enhanceSteps(result, 'simplificar');
};

// Expande uma expressão algébrica (distribui multiplicações, aplica produtos notáveis)
export const expandAlgebraicExpression = (expression: string): { result: string, steps: string[] } => {
  const result = expandAlgebraExpression(expression);
  return enhanceSteps(result, 'expandir');
};

// Fatora uma expressão algébrica
export const factorAlgebraicExpression = (expression: string): { result: string, steps: string[] } => {
  const result = factorizeAlgebraExpression(expression);
  return enhanceSteps(result, 'fatorar');
};

// Step format patterns - replace repetitive conditionals
const stepFormatPatterns = [
  { match: (step: string) => step.startsWith('Aplicando a regra:'), format: (step: string) => `Aplicando a regra: ${step.substring('Aplicando a regra:'.length).trim()}` },
  { match: (step: string) => step.startsWith('Aplicando') && step.includes('fórmula'), format: (step: string) => `Fórmula: ${step}` },
  { match: (step: string) => step.startsWith('Aplicando a propriedade distributiva'), format: (step: string) => `Aplicando a propriedade distributiva em ambos os lados: ${step.substring('Aplicando a propriedade distributiva'.length).trim()}` },
  { match: (step: string) => step.includes('termos semelhantes'), format: (step: string) => `Combinando termos semelhantes: ${step}` },
  { match: (step: string) => step.includes('agrupando variáveis'), format: (step: string) => `Simplificando: ${step}` },
  { match: (step: string) => step.includes('fator comum'), format: (step: string) => `Isolando o fator comum: ${step}` },
  { match: (step: string) => step.includes('diferença de quadrados'), format: (step: string) => `Fatorando como diferença de quadrados: ${step}` },
  { match: (step: string) => step.includes('dividir por') || step.includes('divisão'), format: (step: string) => `Dividindo ambos os lados por: ${step}` },
  { match: (step: string) => step.includes('trinômio'), format: (step: string) => `Fatorando o trinômio: ${step}` },
  { match: (step: string) => step.includes('verificando') || step.includes('Verificando'), format: (step: string) => `Verificação: ${step}` },
  { match: (step: string) => step.includes('Expressão para ') || step.includes('manipulação algébrica'), format: (step: string) => `Método: ${step}` },
  { match: (step: string) => step.toLowerCase().includes('identificando termos'), format: (step: string) => `Análise: ${step}` },
  { match: (step: string) => step.includes('estrutura matemática'), format: (step: string) => `Estrutura: ${step}` },
  { match: (step: string) => step.includes('Operando em ambos os lados'), format: (step: string) => `Operação: ${step}` },
  { match: (step: string) => step.toLowerCase().includes('exemplo similar'), format: (step: string) => `Observação: ${step}` }
];

// Operation-specific patterns
const operationPatterns = {
  'expandir': [
    { match: (step: string) => step.includes('potência'), format: (step: string) => `Expandindo potência: ${step}` },
    { match: (step: string) => step.includes('(') && step.includes(')') && !step.includes('Expandindo'), format: (step: string) => `Expandindo parênteses: ${step}` },
    { match: (step: string) => step.toLowerCase().includes('expandido como'), format: (step: string) => `Expressão expandida: ${step}` },
    { match: (step: string) => step.includes('Multiplicando os termos'), format: (step: string) => `Calculando: ${step}` }
  ],
  'fatorar': [
    { match: (step: string) => step.includes('recuperamos a expressão'), format: (step: string) => `Verificação: ${step}` },
    { match: (step: string) => step.includes('fatorar'), format: (step: string) => `Método: ${step}` }
  ],
  'simplificar': [
    { match: (step: string) => step.includes('simplificando'), format: (step: string) => `Simplificando: ${step}` },
    { match: (step: string) => step.includes('igualdade'), format: (step: string) => `Propriedade: ${step}` }
  ]
};

// Adiciona formatação específica para diferentes tipos de passos
const formatStep = (step: string, operation: 'simplificar' | 'expandir' | 'fatorar'): string => {
  // Se já formatado, retornar o mesmo
  if (step.includes('Equação original:') || 
      step.includes('Expressão original:') || 
      step.includes('Resultado:')) {
    return step;
  }
  
  // Verificar padrões gerais
  for (const pattern of stepFormatPatterns) {
    if (pattern.match(step)) {
      return pattern.format(step);
    }
  }
  
  // Verificar padrões específicos da operação
  const specificPatterns = operationPatterns[operation] || [];
  for (const pattern of specificPatterns) {
    if (pattern.match(step)) {
      return pattern.format(step);
    }
  }
  
  return step;
};

// Mapeamento de prefixos para explicações
const explanationPrefixes = [
  { match: (text: string) => text.includes('fórmula'), prefix: 'Fórmula:' },
  { match: (text: string) => text.includes('regra'), prefix: 'Regra aplicada:' },
  { match: (text: string) => matchesAny(text, patterns.property), prefix: 'Propriedade:' },
  { match: (text: string) => text.includes('exemplo'), prefix: 'Observação:' },
  { match: (text: string) => text.includes('simplificar') || text.includes('simplificação'), prefix: 'Simplificando:' },
  { match: (text: string) => text.includes('fatorar') || text.includes('fatoração'), prefix: 'Método de fatoração:' },
  { match: (text: string) => text.includes('expandir') || text.includes('expansão'), prefix: 'Método de expansão:' },
  { match: (text: string) => text.includes('multiplicar') || text.includes('multiplicação'), prefix: 'Calculando:' },
  { match: (text: string) => text.includes('combinar') || text.includes('combinação'), prefix: 'Combinando termos:' },
  { match: (text: string) => text.includes('isolar') || text.includes('isolamento'), prefix: 'Isolando:' }
];

// Operation-specific explanation prefixes
const operationExplanationPrefixes = {
  'expandir': [
    { match: (text: string) => matchesAny(text, ['remover os parênteses', 'eliminando os parênteses', 'distributiva']), prefix: 'Propriedade:' }
  ],
  'fatorar': [
    { match: (text: string) => matchesAny(text, ['fator comum', 'em evidência', 'produtos notáveis']), prefix: 'Propriedade:' }
  ]
};

// Função para adicionar mais detalhe e cor às explicações
const enhanceExplanation = (explanation: string, operation: 'simplificar' | 'expandir' | 'fatorar'): string => {
  // Verificar prefixos gerais
  for (const { match, prefix } of explanationPrefixes) {
    if (match(explanation)) {
      return `${prefix} ${explanation}`;
    }
  }
  
  // Verificar prefixos específicos da operação
  const specificPrefixes = operationExplanationPrefixes[operation] || [];
  for (const { match, prefix } of specificPrefixes) {
    if (match(explanation)) {
      return `${prefix} ${explanation}`;
    }
  }
  
  // Sem prefixo identificável, usar formato genérico
  return explanation;
};

// Helper para adicionar explicações para um passo
const addExplanationsForStep = (step: string, operation: 'simplificar' | 'expandir' | 'fatorar', enhancedSteps: string[], addedExplanations: Set<string>) => {
  const explanations = explainAlgebraicRule(step, operation);
  for (const explanation of explanations) {
    // Evitar duplicação de explicações
    const enhancedExpl = enhanceExplanation(explanation, operation);
    if (!enhancedSteps.includes(explanation) && 
        !enhancedSteps.includes(enhancedExpl) && 
        !addedExplanations.has(enhancedExpl)) {
      enhancedSteps.push(enhancedExpl);
      addedExplanations.add(enhancedExpl);
    }
  }
};

// Função para melhorar os passos com explicações e formatação
const enhanceSteps = (
  result: { result: string, steps: string[] },
  operation: 'simplificar' | 'expandir' | 'fatorar'
): { result: string, steps: string[] } => {
  const enhancedSteps: string[] = [];
  // Rastrear explicações já adicionadas para evitar duplicatas
  const addedExplanations: Set<string> = new Set();
  
  // Garantir que temos passos para trabalhar
  if (!result.steps || result.steps.length === 0) {
    return {
      result: result.result,
      steps: [`Expressão original: ${result.result}`]
    };
  }
  
  // Primeiro passo: expressão original
  if (result.steps[0].includes('original')) {
    enhancedSteps.push(result.steps[0]);
  } else {
    // Se não tiver um passo com "original", adicionamos
    enhancedSteps.push(`Expressão original: ${result.steps[0]}`);
  }
  
  // Se tiver passo de normalização, adicionar
  if (result.steps.length > 1 && result.steps[1].includes('normalizada')) {
    enhancedSteps.push(result.steps[1]);
    const simplifyExplanation = `Simplificando: Agrupando termos da expressão por variáveis de mesmo grau.`;
    enhancedSteps.push(simplifyExplanation);
    addedExplanations.add(simplifyExplanation);
  }
  
  // Se tiver passo de parsing, adicionar
  const parseIndex = result.steps.findIndex(step => step.includes('parseada'));
  if (parseIndex > 0) {
    enhancedSteps.push(`Analisando a estrutura da expressão`);
    // Substituir o passo genérico "parseada com sucesso" por algo mais informativo
    if (result.steps[parseIndex].includes('parseada com sucesso')) {
      enhancedSteps.push(`Análise: Identificando termos, variáveis, operadores e estrutura matemática da expressão.`);
    } else {
      enhancedSteps.push(formatStep(result.steps[parseIndex], operation));
    }
  }
  
  // Helper para adicionar padrões específicos de operação
  const addOperationSpecificPatterns = () => {
    if (operation === 'expandir') {
      if (enhancedSteps.some(step => step.includes('(') && step.includes(')')) && 
          !enhancedSteps.some(s => s.includes('eliminar os parênteses'))) {
        const explanation = `Propriedade: Multiplicando os termos para eliminar os parênteses usando a distributiva.`;
        if (!addedExplanations.has(explanation)) {
          enhancedSteps.push(explanation);
          addedExplanations.add(explanation);
        }
      }
    } else if (operation === 'fatorar') {
      if (enhancedSteps.some(step => step.includes('(') && step.includes(')')) && 
          !enhancedSteps.some(s => s.includes('recuperamos a expressão original'))) {
        const explanation1 = `Verificação: Ao multiplicar estes fatores, recuperamos a expressão original.`;
        const explanation2 = `Propriedade: A fatoração é o processo inverso da multiplicação.`;
        if (!addedExplanations.has(explanation1)) {
          enhancedSteps.push(explanation1);
          addedExplanations.add(explanation1);
        }
        if (!addedExplanations.has(explanation2)) {
          enhancedSteps.push(explanation2);
          addedExplanations.add(explanation2);
        }
      }
    } else if (operation === 'simplificar') {
      if (enhancedSteps.some(step => step.includes('=') || step.includes('+') || step.includes('-')) && 
          !enhancedSteps.some(s => s.includes('ambos os lados'))) {
        const explanation = `Propriedade: Operando em ambos os lados para manter a igualdade.`;
        if (!addedExplanations.has(explanation)) {
          enhancedSteps.push(explanation);
          addedExplanations.add(explanation);
        }
      }
    }
  };
  
  // Processamento dos demais passos
  for (let i = 1; i < result.steps.length; i++) {
    const currentStep = result.steps[i];
    
    // Pular passos que já foram processados ou são apenas de verificação
    if (currentStep.startsWith('---') || 
        currentStep.includes('normalizada') || 
        currentStep.includes('parseada')) {
      continue;
    }
    
    // Para operação de expansão, adicionar passos específicos
    if (operation === 'expandir') {
      // Detectar expansão de potências ou expressões com parênteses
      if (currentStep.includes('^') || currentStep.includes('potência')) {
        if (!enhancedSteps.some(step => step.includes('Aplicar fórmulas de expansão'))) {
          const explanation = `Método de expansão: Aplicar fórmulas de produtos notáveis`;
          if (!addedExplanations.has(explanation)) {
            enhancedSteps.push(explanation);
            addedExplanations.add(explanation);
          }
        }
        enhancedSteps.push(`Expandindo potência: ${currentStep}`);
        
        // Adicionar explicação da fórmula utilizada
        if (currentStep.includes('^2')) {
          if (currentStep.includes('+')) {
            const explanation1 = `Fórmula: Aplicando o quadrado da soma (a + b)² = a² + 2ab + b²`;
            const explanation2 = `Propriedade: Utilizando a lei dos expoentes para multiplicar os termos.`;
            if (!addedExplanations.has(explanation1)) {
              enhancedSteps.push(explanation1);
              addedExplanations.add(explanation1);
            }
            if (!addedExplanations.has(explanation2)) {
              enhancedSteps.push(explanation2);
              addedExplanations.add(explanation2);
            }
          } else if (currentStep.includes('-')) {
            const explanation1 = `Fórmula: Aplicando o quadrado da diferença (a - b)² = a² - 2ab + b²`;
            const explanation2 = `Propriedade: Utilizando a lei dos expoentes para multiplicar os termos.`;
            if (!addedExplanations.has(explanation1)) {
              enhancedSteps.push(explanation1);
              addedExplanations.add(explanation1);
            }
            if (!addedExplanations.has(explanation2)) {
              enhancedSteps.push(explanation2);
              addedExplanations.add(explanation2);
            }
          }
        } else if (currentStep.includes('^3')) {
          if (currentStep.includes('+')) {
            const explanation1 = `Fórmula: Aplicando o cubo da soma (a + b)³ = a³ + 3a²b + 3ab² + b³`;
            const explanation2 = `Propriedade: Utilizando a lei dos expoentes para multiplicar os termos.`;
            if (!addedExplanations.has(explanation1)) {
              enhancedSteps.push(explanation1);
              addedExplanations.add(explanation1);
            }
            if (!addedExplanations.has(explanation2)) {
              enhancedSteps.push(explanation2);
              addedExplanations.add(explanation2);
            }
          } else if (currentStep.includes('-')) {
            const explanation1 = `Fórmula: Aplicando o cubo da diferença (a - b)³ = a³ - 3a²b + 3ab² - b³`;
            const explanation2 = `Propriedade: Utilizando a lei dos expoentes para multiplicar os termos.`;
            if (!addedExplanations.has(explanation1)) {
              enhancedSteps.push(explanation1);
              addedExplanations.add(explanation1);
            }
            if (!addedExplanations.has(explanation2)) {
              enhancedSteps.push(explanation2);
              addedExplanations.add(explanation2);
            }
          }
        }
        continue;
      }
      
      // Detectar processo de multiplicação para eliminar parênteses
      if (currentStep.includes('(') && currentStep.includes(')') && 
          !enhancedSteps.some(step => step.includes('Eliminar parênteses'))) {
        const explanation1 = `Método de expansão: Eliminar parênteses usando propriedade distributiva`;
        const explanation2 = `Propriedade: Aplicando a distributiva a(b + c) = ab + ac`;
        const explanation3 = `Calculando: Multiplicando os termos para eliminar os parênteses.`;
        
        if (!addedExplanations.has(explanation1)) {
          enhancedSteps.push(explanation1);
          addedExplanations.add(explanation1);
        }
        if (!addedExplanations.has(explanation2)) {
          enhancedSteps.push(explanation2);
          addedExplanations.add(explanation2);
        }
        if (!addedExplanations.has(explanation3)) {
          enhancedSteps.push(explanation3);
          addedExplanations.add(explanation3);
        }
        continue;
      }
      
      // Detectar resultado expandido
      if (currentStep.toLowerCase().includes('expandido como') || 
          (currentStep.includes('+') && currentStep.includes('^') && !currentStep.includes('('))) {
        if (!enhancedSteps.some(step => step.includes('Organizar termos'))) {
          const explanation = `Método de expansão: Organizar termos da expressão expandida`;
          if (!addedExplanations.has(explanation)) {
            enhancedSteps.push(explanation);
            addedExplanations.add(explanation);
          }
        }
        enhancedSteps.push(`Expressão expandida: ${currentStep}`);
        
        const explanation = `Propriedade: Agrupando termos semelhantes após a expansão.`;
        if (!addedExplanations.has(explanation)) {
          enhancedSteps.push(explanation);
          addedExplanations.add(explanation);
        }
        continue;
      }
    }
    
    // Para operação de fatoração, adicionar passos específicos
    if (operation === 'fatorar') {
      // Detectar reconhecimento de padrões
      if (currentStep.includes('diferença de quadrados')) {
        if (!enhancedSteps.some(step => step.includes('Identificar padrões'))) {
          const explanation = `Método de fatoração: Identificar padrões de fatoração conhecidos`;
          if (!addedExplanations.has(explanation)) {
            enhancedSteps.push(explanation);
            addedExplanations.add(explanation);
          }
        }
        enhancedSteps.push(`Análise: Identificando padrão de diferença de quadrados na expressão`);
        
        const explanation1 = `Fórmula: Aplicando a fórmula a² - b² = (a+b)(a-b)`;
        const explanation2 = `Propriedade: Aplicando a fatoração como processo inverso da multiplicação.`;
        
        if (!addedExplanations.has(explanation1)) {
          enhancedSteps.push(explanation1);
          addedExplanations.add(explanation1);
        }
        if (!addedExplanations.has(explanation2)) {
          enhancedSteps.push(explanation2);
          addedExplanations.add(explanation2);
        }
        continue;
      }
      
      // Detectar trinômio quadrado perfeito
      if (currentStep.includes('trinômio') && currentStep.includes('quadrado perfeito')) {
        if (!enhancedSteps.some(step => step.includes('Identificar padrões'))) {
          const explanation = `Método de fatoração: Identificar padrões de fatoração conhecidos`;
          if (!addedExplanations.has(explanation)) {
            enhancedSteps.push(explanation);
            addedExplanations.add(explanation);
          }
        }
        enhancedSteps.push(`Análise: Identificando trinômio quadrado perfeito na expressão`);
        
        const explanation1 = `Fórmula: Aplicando a fórmula a² + 2ab + b² = (a+b)²`;
        const explanation2 = `Propriedade: Reconhecendo o padrão do quadrado de um binômio.`;
        
        if (!addedExplanations.has(explanation1)) {
          enhancedSteps.push(explanation1);
          addedExplanations.add(explanation1);
        }
        if (!addedExplanations.has(explanation2)) {
          enhancedSteps.push(explanation2);
          addedExplanations.add(explanation2);
        }
        continue;
      }
      
      // Detectar fator comum
      if (currentStep.includes('fator comum') && !currentStep.includes('Isolando o fator comum')) {
        if (!enhancedSteps.some(step => step.includes('Identificar fator comum'))) {
          const explanation = `Método de fatoração: Identificar e isolar fatores comuns`;
          if (!addedExplanations.has(explanation)) {
            enhancedSteps.push(explanation);
            addedExplanations.add(explanation);
          }
        }
        enhancedSteps.push(`Análise: Identificando o fator comum a todos os termos`);
        
        const explanation = `Propriedade: Aplicando a lei distributiva em sentido inverso: ab + ac = a(b+c)`;
        if (!addedExplanations.has(explanation)) {
          enhancedSteps.push(explanation);
          addedExplanations.add(explanation);
        }
        continue;
      }
      
      // Detectar agrupamento de termos
      if (currentStep.includes('agrupamento')) {
        if (!enhancedSteps.some(step => step.includes('Agrupar termos'))) {
          const explanation = `Método de fatoração: Agrupar termos para facilitar a fatoração`;
          if (!addedExplanations.has(explanation)) {
            enhancedSteps.push(explanation);
            addedExplanations.add(explanation);
          }
        }
        enhancedSteps.push(`Técnica: Agrupando termos com fatores comuns`);
        
        const explanation = `Propriedade: Aplicando propriedade distributiva em cada grupo de termos.`;
        if (!addedExplanations.has(explanation)) {
          enhancedSteps.push(explanation);
          addedExplanations.add(explanation);
        }
        continue;
      }
    }
    
    // Detectar estágio de simplificação de constantes
    if (currentStep.includes('simplificar constantes:')) {
      enhancedSteps.push(`Realizar simplificação inicial`);
      enhancedSteps.push(formatStep(currentStep, operation));
      
      const explanation = `Simplificando: Agrupando termos da expressão por variáveis de mesmo grau.`;
      if (!addedExplanations.has(explanation)) {
        enhancedSteps.push(explanation);
        addedExplanations.add(explanation);
      }
      continue;
    }
    
    // Detectar estágio de identificação de fator comum
    if (currentStep.includes('fator comum') && !enhancedSteps.some(step => step.includes('Identificar fatores comuns'))) {
      enhancedSteps.push(`Identificar fatores comuns`);
      enhancedSteps.push(formatStep(currentStep, operation));
      
      // Adicionar explicação para fator comum
      addExplanationsForStep(currentStep, operation, enhancedSteps, addedExplanations);
      continue;
    }
    
    // Detectar estágio de aplicação da fatoração
    if (currentStep.includes('Fatorando') || (currentStep.includes('fator') && currentStep.includes('comum'))) {
      // Se já temos um passo de fatoração, não adicionar outro principal
      if (!enhancedSteps.some(step => step.includes('Aplicar fatoração'))) {
        const explanation = `Método de fatoração: Aplicar fatoração`;
        if (!addedExplanations.has(explanation)) {
          enhancedSteps.push(explanation);
          addedExplanations.add(explanation);
        }
      }
      enhancedSteps.push(formatStep(currentStep, operation));
      
      // Adicionar explicação para fatoração
      if (!currentStep.includes('termo comum:')) {
        addExplanationsForStep(currentStep, operation, enhancedSteps, addedExplanations);
      }
      continue;
    }
    
    // Detectar estágio de simplificação após operações
    if (currentStep.includes('Após') || currentStep.includes('semelhantes')) {
      enhancedSteps.push(`Simplificar a expressão`);
      enhancedSteps.push(formatStep(currentStep, operation));
      
      const explanation = `Simplificando: Agrupando termos da expressão por variáveis de mesmo grau.`;
      if (!addedExplanations.has(explanation)) {
        enhancedSteps.push(explanation);
        addedExplanations.add(explanation);
      }
      continue;
    }
    
    // Adicionar o passo atual com formatação apropriada
    const formattedStep = formatStep(currentStep, operation);
    if (formattedStep.includes('Isolando') && 
        !enhancedSteps.some(step => step.includes('Isolar'))) {
      enhancedSteps.push(`Isolar fatores na expressão`);
    }
    
    enhancedSteps.push(formattedStep);
    
    // Se parece uma transformação substancial, adicionar explicação
    if (i > 0 && 
        result.steps[i] !== result.steps[i-1] && 
        !currentStep.includes('Passo') && 
        !currentStep.includes('original') &&
        !currentStep.startsWith('Aplicando') &&
        !currentStep.startsWith('Combinando') &&
        !currentStep.startsWith('Isolando') &&
        !currentStep.startsWith('Fatorando') &&
        !currentStep.startsWith('Verificando')) {
      
      // Explicar a regra aplicada
      addExplanationsForStep(currentStep, operation, enhancedSteps, addedExplanations);
      
      // Adicionar explicações específicas para certas operações
      addOperationSpecificPatterns();
    }
  }
  
  // Adicionar passo final com o resultado
  if (!enhancedSteps.some(step => step.includes('Obter o resultado final'))) {
    enhancedSteps.push(`Obter o resultado final`);
  }
  
  // Adicionar resultado como um subpasso final 
  if (!enhancedSteps.some(step => step.includes('Resultado:'))) {
    enhancedSteps.push(formatResult(result.result, operation));
  }
  
  return {
    result: result.result,
    steps: enhancedSteps
  };
};

// Adiciona numeração aos passos para melhor apresentação
export const processStepsWithNumbering = (steps: string[]): string[] => {
  // Separar passos principais de passos explicativos
  let mainSteps: string[] = [];
  let currentExplanations: string[] = [];
  let finalSteps: string[] = [];
  let stepCount = 1;
  
  // Identificar passos principais
  const mainStepIndicators = [
    'Expressão original:',
    'Equação original:',
    'Analisando a estrutura',
    'Realizar simplificação',
    'Identificar fatores',
    'Aplicar fatoração',
    'Simplificar a expressão',
    'Isolar fatores',
    'Obtendo',
    'Obter o resultado final'
  ];
  
  // Primeiro passo sempre é o principal
  for (let i = 0; i < steps.length; i++) {
    const currentStep = steps[i];
    
    // Se parece um passo principal
    const isMainStep = mainStepIndicators.some(indicator => 
      currentStep.includes(indicator)
    ) || (i > 0 && currentStep.startsWith('Passo '));
    
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
    // Verificar se é o resultado final que deve ser um subpasso
    else if (currentStep.startsWith('Resultado:')) {
      currentExplanations.push(currentStep);
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