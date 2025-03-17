import React, { ReactNode } from 'react';
import { 
  HiOutlineDocumentText, 
  HiOutlineArrowsExpand, 
  HiOutlineCube, 
  HiOutlineRefresh, 
  HiOutlineCalculator,
  HiOutlineCheck
} from 'react-icons/hi';

interface StepByStepExplanationProps {
  steps: (string | ReactNode)[];
  customRenderStep?: (step: string | ReactNode, index: number) => ReactNode;
  stepType?: 'default' | 'trigonometric' | 'geometric' | 'fraction' | 'statistic' | 'linear' | 'calculus';
}

const StepByStepExplanation: React.FC<StepByStepExplanationProps> = ({ 
  steps, 
  customRenderStep,
  stepType = 'default'
}) => {
  const defaultRenderStep = (step: string | ReactNode, index: number) => {
    if (typeof step !== 'string') {
      return <div key={index} className="p-3 bg-gray-50 rounded-md">{step}</div>;
    }

    // Padrão para o cabeçalho do passo (Passo X:)
    const stepMatch = step.match(/^(Passo \d+:)(.*)$/);

    // Para passos de cálculo diferencial e integral
    if (stepType === 'calculus') {
      // Padrão para o cabeçalho da derivada ou integral
      const calculatingMatch = step.match(/^(Calculando a \d+ª derivada:|Expressão original:)(.*)$/);
      
      // Padrão para resultados da derivada
      const resultMatch = step.match(/^(Resultado da .+:)(.*)$/);
      
      // Padrão para aplicação de regras de derivação/integração
      const rulesMatch = step.match(/^(Aplicando a regra d[aeoi] .+:|Aplicando a regra integral de .+:)(.*)$/);
      
      // Padrão para passos intermediários
      const intermediateMatch = step.includes('Onde ') || step.includes('Para a expressão') || step.includes('Vamos calcular');
      
      // Padrão para sub-expressões numeradas (como "1) Para f(x) = x^3")
      const subExpressionMatch = step.match(/^(\d+\))\s+(Para .+:?|\S+:?)(.*)$/);
      
      // Padrão para resultado ou simplificação
      const simplificationMatch = step.includes('Simplificando:') || step.includes('Após simplificação:');
      
      if (stepMatch) {
        // Numbered step with highlighted number
        const [_, stepNumber, stepContent] = stepMatch;
        return (
          <div key={index} className="p-4 bg-gray-50 rounded-md border-l-4 border-indigo-500 shadow-sm my-3">
            <div className="flex flex-col sm:flex-row">
              <span className="font-bold text-indigo-700 mr-2 mb-1 sm:mb-0">{stepNumber}</span>
              <p className="text-gray-800">{stepContent}</p>
            </div>
          </div>
        );
      } else if (calculatingMatch) {
        const [_, stepHeader, stepContent] = calculatingMatch;
        return (
          <div key={index} className="p-3 bg-blue-50 rounded-md ml-4 border-l-2 border-blue-300 shadow-sm my-2">
            <div className="flex items-center">
              <HiOutlineDocumentText className="text-blue-600 mr-2 flex-shrink-0 h-5 w-5" />
              <p className="text-blue-700 font-medium">{stepHeader}</p>
              {stepContent && <p className="text-gray-800 ml-2">{stepContent}</p>}
            </div>
          </div>
        );
      } else if (resultMatch) {
        const [_, resultHeader, resultContent] = resultMatch;
        return (
          <div key={index} className="p-3 bg-green-50 rounded-md ml-4 border-l-2 border-green-300 shadow-sm my-2">
            <div className="flex items-center">
              <HiOutlineCheck className="text-green-600 mr-2 flex-shrink-0 h-5 w-5" />
              <p className="text-green-700 font-medium">{resultHeader}</p>
              {resultContent && <p className="text-gray-800 ml-2">{resultContent}</p>}
            </div>
          </div>
        );
      } else if (rulesMatch) {
        const [_, ruleHeader, ruleContent] = rulesMatch;
        return (
          <div key={index} className="p-3 bg-indigo-50 rounded-md ml-4 border-l-2 border-indigo-300">
            <p className="text-indigo-700 font-medium">{ruleHeader}</p>
            {ruleContent && <p className="text-gray-700 mt-1">{ruleContent}</p>}
          </div>
        );
      } else if (subExpressionMatch) {
        // Melhor estilo para sub-expressões numeradas
        const [_, subNumber, subType, subContent] = subExpressionMatch;
        return (
          <div key={index} className="p-3 bg-amber-50 rounded-md ml-6 shadow-sm my-2 border-l-2 border-amber-300">
            <div className="flex items-center">
              <span className="font-bold text-amber-600 mr-2">{subNumber}</span>
              <span className="text-amber-700 font-medium">{subType}</span>
              <span className="text-gray-800 ml-1 font-mono">{subContent}</span>
            </div>
          </div>
        );
      } else if (intermediateMatch) {
        return (
          <div key={index} className="p-2 bg-green-50 rounded-md ml-4 text-green-700 font-medium">
            {step}
          </div>
        );
      } else if (simplificationMatch) {
        return (
          <div key={index} className="p-3 bg-green-50 rounded-md ml-4 border-l-2 border-green-300">
            <div className="flex items-center">
              <HiOutlineCheck className="text-green-600 mr-2 flex-shrink-0 h-5 w-5" />
              <p className="text-green-700 font-medium">{step}</p>
            </div>
          </div>
        );
      } else if (step.startsWith('-----')) {
        return (
          <div key={index} className="border-t-2 border-indigo-100 my-4 pt-2 text-center text-indigo-400 text-sm font-medium">
            {step}
          </div>
        );
      } else if (step.includes("multiplicamos pelo expoente") || step.includes("A derivada de uma constante")) {
        // Estilo para explicações de regras
        return (
          <div key={index} className="p-2 bg-blue-50 rounded-md ml-8 text-blue-700 text-sm italic shadow-sm my-1 border-l border-blue-200">
            {step}
          </div>
        );
      } else {
        // Outros passos
        return (
          <div key={index} className="p-3 bg-gray-50 rounded-md ml-4 shadow-sm my-2">
            <p className="text-gray-800">{step}</p>
          </div>
        );
      }
    }
    
    // Para passos de equações lineares, use estilo especial
    if (stepType === 'linear') {
      // Verificar se é um separador de verificação
      if (step === '---VERIFICATION_SEPARATOR---') {
        return (
          <div key={index} className="py-4 my-4 flex items-center">
            <div className="flex-grow h-px bg-gray-300"></div>
            <div className="mx-4 px-4 py-2 bg-purple-100 rounded-full text-purple-700 text-sm font-bold flex items-center">
              <HiOutlineCheck className="mr-1" /> Verificação
            </div>
            <div className="flex-grow h-px bg-gray-300"></div>
          </div>
        );
      }
      
      // Padrão para a equação original
      const equationMatch = step.includes('Equação original:') || step.includes('Forma inicial:') || step.includes('Resolvendo a equação:');
      
      // Padrão para isolamento da variável
      const isolateMatch = step.includes('Isolando') || step.includes('variável') || step.includes('isolar x');
      
      // Padrão para operações com ambos os lados
      const operationMatch = step.includes('ambos os lados') || (step.includes('os dois lados'));
      
      // Padrão para combinação de termos semelhantes
      const likeTermsMatch = step.includes('termos semelhantes') || step.includes('coeficientes') || step.includes('simplificar') || 
                             step.includes('Simplificando:') || step.includes('Simplificando a divisão:');
      
      // Padrão para dividir por coeficiente
      const divideMatch = step.includes('dividir por') || step.includes('dividindo por');
      
      // Padrão para resultado final
      const resultMatch = step.includes('Resultado:') || step.includes('Solução final:') || step.includes('Valor de x:') || 
                          step.includes('Verificação concluída:') || step.includes('(Correto!)');
      
      // Padrão para verificação
      const checkMatch = step.includes('Verificando') || step.includes('Verificação:') || step.includes('Substituindo o valor');
      
      // Padrão para cálculos
      const calculatingMatch = step.includes('Calculando:');
      
      if (stepMatch) {
        // Numbered step with highlighted number
        const [_, stepNumber, stepContent] = stepMatch;
        return (
          <div key={index} className="p-4 bg-gray-50 rounded-md border-l-4 border-indigo-500 shadow-sm my-3">
            <div className="flex flex-col sm:flex-row">
              <span className="font-bold text-indigo-700 mr-2 mb-1 sm:mb-0">{stepNumber}</span>
              <p className="text-gray-800">{stepContent}</p>
            </div>
          </div>
        );
      } else if (equationMatch) {
        return (
          <div key={index} className="p-3 bg-blue-50 rounded-md ml-4 border-l-2 border-blue-300 shadow-sm my-2">
            <div className="flex items-center">
              <HiOutlineDocumentText className="text-blue-600 mr-2 flex-shrink-0 h-5 w-5" />
              <p className="text-blue-700 font-medium">{step}</p>
            </div>
          </div>
        );
      } else if (isolateMatch) {
        return (
          <div key={index} className="p-3 bg-violet-50 rounded-md ml-4 border-l-2 border-violet-300 shadow-sm my-2">
            <div className="flex items-center">
              <HiOutlineArrowsExpand className="text-violet-600 mr-2 flex-shrink-0 h-5 w-5" />
              <p className="text-violet-700 font-medium">{step}</p>
            </div>
          </div>
        );
      } else if (operationMatch) {
        return (
          <div key={index} className="p-3 bg-amber-50 rounded-md ml-4 border-l-2 border-amber-300 shadow-sm my-2">
            <div className="flex items-center">
              <HiOutlineCube className="text-amber-600 mr-2 flex-shrink-0 h-5 w-5" />
              <p className="text-amber-700 font-medium">{step}</p>
            </div>
          </div>
        );
      } else if (likeTermsMatch) {
        return (
          <div key={index} className="p-3 bg-teal-50 rounded-md ml-4 border-l-2 border-teal-300 shadow-sm my-2">
            <div className="flex items-center">
              <HiOutlineRefresh className="text-teal-600 mr-2 flex-shrink-0 h-5 w-5" />
              <p className="text-teal-700 font-medium">{step}</p>
            </div>
          </div>
        );
      } else if (divideMatch) {
        return (
          <div key={index} className="p-3 bg-indigo-50 rounded-md ml-4 border-l-2 border-indigo-300 shadow-sm my-2">
            <div className="flex items-center">
              <HiOutlineCalculator className="text-indigo-600 mr-2 flex-shrink-0 h-5 w-5" />
              <p className="text-indigo-700 font-medium">{step}</p>
            </div>
          </div>
        );
      } else if (resultMatch) {
        return (
          <div key={index} className="p-3 bg-green-50 rounded-md ml-4 border-l-2 border-green-300 shadow-sm my-2 font-bold">
            <div className="flex items-center">
              <HiOutlineCheck className="text-green-600 mr-2 flex-shrink-0 h-5 w-5" />
              <p className="text-green-700 font-medium">{step}</p>
            </div>
          </div>
        );
      } else if (calculatingMatch) {
        return (
          <div key={index} className="p-3 bg-amber-50 rounded-md ml-4 border-l-2 border-amber-300 shadow-sm my-2">
            <div className="flex items-center">
              <HiOutlineCalculator className="text-amber-600 mr-2 flex-shrink-0 h-5 w-5" />
              <p className="text-amber-700 font-medium">{step}</p>
            </div>
          </div>
        );
      } else if (checkMatch) {
        return (
          <div key={index} className="p-3 bg-purple-50 rounded-md ml-4 border-l-2 border-purple-300 shadow-sm my-2 mt-4">
            <div className="flex items-center">
              <HiOutlineCheck className="text-purple-600 mr-2 flex-shrink-0 h-5 w-5" />
              <p className="text-purple-700 font-medium">{step}</p>
            </div>
          </div>
        );
      } else {
        // Outros passos
        return (
          <div key={index} className="p-3 bg-gray-50 rounded-md ml-4 shadow-sm my-2">
            <p className="text-gray-800">{step}</p>
          </div>
        );
      }
    }
    
    // Para passos estatísticos, use estilo especial
    if (stepType === 'statistic') {
      // Verificar padrões especiais em passos estatísticos
      
      // Padrão para valores calculados (média, mediana, moda, desvio padrão, etc.)
      const calculatedValueMatch = 
        step.includes('Média:') || 
        step.includes('Mediana:') || 
        step.includes('Moda:') || 
        step.includes('Desvio Padrão:') || 
        step.includes('Variância:') || 
        step.includes('Desvio Médio:') || 
        step.includes('Coeficiente de Variação:') ||
        step.includes('σ =') ||
        step.includes('μ =') ||
        step.includes('CV =');
      
      // Padrão para conjuntos de dados
      const dataSetMatch = 
        step.includes('Conjunto de dados:') || 
        step.includes('Dados ordenados:') || 
        step.includes('Lista de valores:') ||
        step.includes('Dados originais:');
      
      // Padrão para operações
      const operationMatch = 
        (step.includes('+') || step.includes('-') || step.includes('×') || step.includes('÷') || step.includes('=')) && 
        !step.includes('Passo');
      
      // Padrão para resultado final
      const resultMatch = 
        step.includes('Resultado:') || 
        step.includes('Resultado final:') || 
        step.includes('Conclusão:');
      
      // Padrão para fórmulas
      const formulaMatch = 
        step.includes('Fórmula:') || 
        step.includes('Aplicando a fórmula') || 
        step.includes('Σ') ||
        step.includes('√');
        
      if (stepMatch) {
        // Passo numerado com destaque
        const [_, stepNumber, stepContent] = stepMatch;
        return (
          <div key={index} className="p-4 bg-gray-50 rounded-md border-l-4 border-indigo-500">
            <div className="flex flex-col sm:flex-row">
              <span className="font-bold text-indigo-700 mr-2 mb-1 sm:mb-0">{stepNumber}</span>
              <p className="text-gray-800">{stepContent}</p>
            </div>
          </div>
        );
      } else if (calculatedValueMatch) {
        return (
          <div key={index} className="p-3 bg-blue-50 rounded-md ml-4 border-l-2 border-blue-300">
            <p className="text-blue-700 font-medium">{step}</p>
          </div>
        );
      } else if (dataSetMatch) {
        return (
          <div key={index} className="p-3 bg-purple-50 rounded-md ml-4 border-l-2 border-purple-300">
            <p className="text-purple-700 font-medium">{step}</p>
          </div>
        );
      } else if (operationMatch) {
        return (
          <div key={index} className="p-3 bg-amber-50 rounded-md ml-4 border-l-2 border-amber-300">
            <p className="text-amber-700 font-medium">{step}</p>
          </div>
        );
      } else if (resultMatch) {
        return (
          <div key={index} className="p-3 bg-green-50 rounded-md ml-4 border-l-2 border-green-300">
            <p className="text-green-700 font-medium">{step}</p>
          </div>
        );
      } else if (formulaMatch) {
        return (
          <div key={index} className="p-3 bg-indigo-50 rounded-md ml-4 border-l-2 border-indigo-300">
            <p className="text-indigo-700 font-medium">{step}</p>
          </div>
        );
      } else {
        // Outros passos
        return (
          <div key={index} className="p-3 bg-gray-50 rounded-md ml-4">
            <p className="text-gray-800">{step}</p>
          </div>
        );
      }
    }
    // Para passos trigonométricos, use estilo especial
    else if (stepType === 'trigonometric') {
      // Verifica padrões especiais em passos trigonométricos
      
      // Informação sobre a equação
      const equationMatch = step.includes('Equação:') || step.includes('Reescrevendo como:');
      
      // Informação sobre a função (de GraficosTrigonometricos)
      const functionMatch = step.includes('Função básica:') || step.includes('Função completa:') || step.includes('Expressão:');
      
      // Informação sobre o intervalo
      const intervalMatch = step.includes('Intervalo:') || step.includes('Valores originais do intervalo:') || step.includes('Intervalo selecionado:');
      
      // Informação sobre o método
      const methodMatch = step.includes('Método:');
      
      // Informação sobre a solução
      const solutionMatch = step.includes('Solução') && (step.includes('rad =') || step.includes('resultado'));
      
      // Informação sobre a verificação
      const verificationMatch = step.includes('Verificação:') || step.includes('Diferença:');
      
      // Informação sobre assíntotas (de GraficosTrigonometricos)
      const asymptoticMatch = step.includes('Assíntotas no intervalo:') || step.includes('assíntotas verticais');
      
      // Informação sobre zeros (de GraficosTrigonometricos)
      const zerosMatch = step.includes('Zeros da função');
      
      // Informação sobre parâmetros
      const parameterMatch = 
        step.includes('amplitude') || 
        step.includes('período') || 
        step.includes('defasagem') || 
        step.includes('Amplitude:') || 
        step.includes('Período:') || 
        step.includes('Defasagem:') || 
        step.includes('Deslocamento vertical:');
      
      // Informação sobre periodicidade
      const periodicMatch = step.includes('Observe que') && step.includes('também é solução');
      
      // Informação geral sobre propriedades trigonométricas
      const generalInfoMatch = step.includes('equações trigonométricas geralmente têm infinitas soluções');
      
      // Informação sobre extremos
      const extremaMatch = 
        step.includes('máximo') || 
        step.includes('mínimo') || 
        step.includes('ponto de inflexão') || 
        step.includes('Valores máximos') || 
        step.includes('Valores mínimos');
      
      if (stepMatch) {
        // Numbered step with highlighted number
        const [_, stepNumber, stepContent] = stepMatch;
        return (
          <div key={index} className="p-4 bg-gray-50 rounded-md border-l-4 border-indigo-500">
            <div className="flex flex-col sm:flex-row">
              <span className="font-bold text-indigo-700 mr-2 mb-1 sm:mb-0">{stepNumber}</span>
              <p className="text-gray-800">{stepContent}</p>
            </div>
          </div>
        );
      } else if (equationMatch || functionMatch) {
        return (
          <div key={index} className="p-3 bg-blue-50 rounded-md ml-4 border-l-2 border-blue-300">
            <p className="text-blue-700 font-medium">{step}</p>
          </div>
        );
      } else if (intervalMatch) {
        return (
          <div key={index} className="p-3 bg-purple-50 rounded-md ml-4 border-l-2 border-purple-300">
            <p className="text-purple-700 font-medium">{step}</p>
          </div>
        );
      } else if (methodMatch || parameterMatch) {
        return (
          <div key={index} className="p-3 bg-indigo-50 rounded-md ml-4 border-l-2 border-indigo-300">
            <p className="text-indigo-700 font-medium">{step}</p>
          </div>
        );
      } else if (solutionMatch || zerosMatch) {
        return (
          <div key={index} className="p-3 bg-green-50 rounded-md ml-4 border-l-2 border-green-300">
            <p className="text-green-700 font-medium">{step}</p>
          </div>
        );
      } else if (verificationMatch) {
        return (
          <div key={index} className="p-3 bg-amber-50 rounded-md ml-4 border-l-2 border-amber-300">
            <p className="text-amber-700 font-medium">{step}</p>
          </div>
        );
      } else if (periodicMatch) {
        return (
          <div key={index} className="p-3 bg-teal-50 rounded-md ml-4 border-l-2 border-teal-300">
            <p className="text-teal-700 font-medium">{step}</p>
          </div>
        );
      } else if (generalInfoMatch) {
        return (
          <div key={index} className="p-3 bg-yellow-50 rounded-md ml-4 border-l-2 border-yellow-300">
            <p className="text-yellow-700 font-medium">{step}</p>
          </div>
        );
      } else if (extremaMatch) {
        return (
          <div key={index} className="p-3 bg-amber-50 rounded-md ml-4 border-l-2 border-amber-300">
            <p className="text-amber-700 font-medium">{step}</p>
          </div>
        );
      } else if (asymptoticMatch) {
        return (
          <div key={index} className="p-3 bg-red-50 rounded-md ml-4 border-l-2 border-red-300">
            <p className="text-red-700 font-medium">{step}</p>
          </div>
        );
      } else {
        // Outros passos
        return (
          <div key={index} className="p-3 bg-gray-50 rounded-md ml-4">
            <p className="text-gray-800">{step}</p>
          </div>
        );
      }
    }
    // Para passos geométricos, use estilo especial
    else if (stepType === 'geometric') {
      // Verifica padrões especiais em passos geométricos
      
      // Padrão de fórmula
      const formulaMatch = 
        step.includes('fórmula:') || 
        step.includes('calculada pela fórmula')
      
      // Padrão de substituição
      const substitutionMatch = 
        step.includes('Substituindo') || 
        step.includes('na fórmula');
      
      // Padrão de cálculo
      const calculationMatch = 
        (step.includes('×') || step.includes('÷') || step.includes('+') || step.includes('-')) && 
        !step.includes('Substituindo') && 
        !step.includes('fórmula:');
      
      // Padrão de resultado
      const resultMatch = 
        step.includes('unidades quadradas') || 
        step.includes('unidades de área') || 
        step.includes('unidades de comprimento') || 
        step.includes('unidades de volume');
      
      // Padrão de dimensão
      const dimensionMatch = 
        step.includes('comprimento') || 
        step.includes('largura') || 
        step.includes('altura') || 
        step.includes('raio') || 
        step.includes('diâmetro') || 
        step.includes('lado') || 
        step.includes('diagonal');
      
      if (stepMatch) {
        // Numbered step with highlighted number
        const [_, stepNumber, stepContent] = stepMatch;
        return (
          <div key={index} className="p-4 bg-gray-50 rounded-md border-l-4 border-indigo-500">
            <div className="flex flex-col sm:flex-row">
              <span className="font-bold text-indigo-700 mr-2 mb-1 sm:mb-0">{stepNumber}</span>
              <p className="text-gray-800">{stepContent}</p>
            </div>
          </div>
        );
      } else if (formulaMatch) {
        return (
          <div key={index} className="p-3 bg-blue-50 rounded-md ml-4 border-l-2 border-blue-300">
            <p className="text-blue-700 font-medium">{step}</p>
          </div>
        );
      } else if (substitutionMatch) {
        return (
          <div key={index} className="p-3 bg-purple-50 rounded-md ml-4 border-l-2 border-purple-300">
            <p className="text-purple-700 font-medium">{step}</p>
          </div>
        );
      } else if (calculationMatch) {
        return (
          <div key={index} className="p-3 bg-indigo-50 rounded-md ml-4 border-l-2 border-indigo-300">
            <p className="text-indigo-700 font-medium">{step}</p>
          </div>
        );
      } else if (resultMatch) {
        return (
          <div key={index} className="p-3 bg-green-50 rounded-md ml-4 border-l-2 border-green-300">
            <p className="text-green-700 font-medium">{step}</p>
          </div>
        );
      } else if (dimensionMatch) {
        return (
          <div key={index} className="p-3 bg-amber-50 rounded-md ml-4 border-l-2 border-amber-300">
            <p className="text-amber-700 font-medium">{step}</p>
          </div>
        );
      } else {
        // Outros passos
        return (
          <div key={index} className="p-3 bg-gray-50 rounded-md ml-4">
            <p className="text-gray-800">{step}</p>
          </div>
        );
      }
    }
    // Para passos de frações, use estilo especial
    else if (stepType === 'fraction') {
      // Verifica padrões especiais em passos de frações
      
      // Padrão de cálculo MMC
      const mmcMatch = step.includes('MMC(') || step.includes('MMC');
      
      // Padrão de cálculo MDC
      const mdcMatch = step.includes('MDC(') || step.includes('MDC');
      
      // Padrão de operação de frações (multiplicação, divisão, adição, subtração)
      const operationMatch = 
        (step.includes('×') || step.includes('÷') || step.includes('+') || step.includes('-') || step.includes('=')) && 
        !step.includes('Substituindo') && 
        !step.includes('fórmula:');
      
      // Padrão de simplificação
      const simplificationMatch = 
        step.includes('simplificada') || 
        step.includes('simplificando') || 
        step.includes('forma irredutível') || 
        step.includes('cancelando');
      
      // Padrão de conversão (entre frações mistas e impróprias)
      const conversionMatch = 
        step.includes('convertendo') || 
        step.includes('conversão') || 
        step.includes('mista para') || 
        step.includes('imprópria para');
      
      // Padrão de resultado
      const resultMatch = 
        step.includes('resultado') || 
        step.includes('Resultado') || 
        step.includes('final');
      
      if (stepMatch) {
        // Numbered step with highlighted number
        const [_, stepNumber, stepContent] = stepMatch;
        return (
          <div key={index} className="p-4 bg-gray-50 rounded-md border-l-4 border-indigo-500">
            <div className="flex flex-col sm:flex-row">
              <span className="font-bold text-indigo-700 mr-2 mb-1 sm:mb-0">{stepNumber}</span>
              <p className="text-gray-800">{stepContent}</p>
            </div>
          </div>
        );
      } else if (mmcMatch) {
        return (
          <div key={index} className="p-3 bg-blue-50 rounded-md ml-4 border-l-2 border-blue-300">
            <p className="text-blue-700 font-medium">{step}</p>
          </div>
        );
      } else if (mdcMatch) {
        return (
          <div key={index} className="p-3 bg-purple-50 rounded-md ml-4 border-l-2 border-purple-300">
            <p className="text-purple-700 font-medium">{step}</p>
          </div>
        );
      } else if (operationMatch) {
        return (
          <div key={index} className="p-3 bg-amber-50 rounded-md ml-4 border-l-2 border-amber-300">
            <p className="text-amber-700 font-medium">{step}</p>
          </div>
        );
      } else if (simplificationMatch) {
        return (
          <div key={index} className="p-3 bg-teal-50 rounded-md ml-4 border-l-2 border-teal-300">
            <p className="text-teal-700 font-medium">{step}</p>
          </div>
        );
      } else if (conversionMatch) {
        return (
          <div key={index} className="p-3 bg-indigo-50 rounded-md ml-4 border-l-2 border-indigo-300">
            <p className="text-indigo-700 font-medium">{step}</p>
          </div>
        );
      } else if (resultMatch) {
        return (
          <div key={index} className="p-3 bg-green-50 rounded-md ml-4 border-l-2 border-green-300">
            <p className="text-green-700 font-medium">{step}</p>
          </div>
        );
      } else {
        // Outros passos
        return (
          <div key={index} className="p-3 bg-gray-50 rounded-md ml-4">
            <p className="text-gray-800">{step}</p>
          </div>
        );
      }
    }

    // Padrão de estilo para passos regulares
    if (stepMatch) {
      // Número do passo destacado
      const [_, stepNumber, stepContent] = stepMatch;
      return (
        <div key={index} className="p-3 bg-blue-50 rounded-md">
          <span className="font-semibold text-blue-700">{stepNumber}</span>
          <p className="text-gray-800">{stepContent}</p>
        </div>
      );
    } else if (step.includes('MDC')) {
      // Cálculo MDC
      return (
        <div key={index} className="p-3 bg-purple-50 rounded-md border-l-2 border-purple-300">
          <p className="text-purple-700 font-medium">{step}</p>
        </div>
      );
    } else if (step.includes(' / ') || step.includes('divisão')) {
      // Passo de divisão
      return (
        <div key={index} className="p-3 bg-amber-50 rounded-md border-l-2 border-amber-300">
          <p className="text-amber-700 font-medium">{step}</p>
        </div>
      );
    } else if (step.includes('sinal')) {
      // Passo de ajuste de sinal
      return (
        <div key={index} className="p-3 bg-teal-50 rounded-md border-l-2 border-teal-300">
          <p className="text-teal-700 font-medium">{step}</p>
        </div>
      );
    } else if (step.includes('Resultado') || step.includes('resultado')) {
      // Resultado final
      return (
        <div key={index} className="p-3 bg-green-50 rounded-md border-l-2 border-green-300">
          <p className="text-green-700 font-medium">{step}</p>
        </div>
      );
    } else {
      // Conteúdo regular
      return (
        <div key={index} className="p-3 bg-gray-50 rounded-md">
          <p className="text-gray-800">{step}</p>
        </div>
      );
    }
  };

  return (
    <div className="space-y-4">
      {steps.map((step, index) => 
        customRenderStep ? customRenderStep(step, index) : defaultRenderStep(step, index)
      )}
    </div>
  );
};

export default StepByStepExplanation; 