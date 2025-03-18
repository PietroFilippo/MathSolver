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
  stepType?: 'default' | 'trigonometric' | 'geometric' | 'linear' | 'calculus' | 'solution' | 'error';
}

const StepByStepExplanation: React.FC<StepByStepExplanationProps> = ({ 
  steps, 
  customRenderStep,
  stepType = 'default'
}) => {
  const defaultRenderStep = (step: string | ReactNode, index: number) => {
    if (typeof step !== 'string') {
      return <div key={index} className="p-3 bg-theme-container dark:bg-gray-800 rounded-md">{step}</div>;
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
        return (
          <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-md border-l-4 border-indigo-500 dark:border-indigo-600 my-3">
            <div className="flex flex-col sm:flex-row">
              <span className="font-bold text-indigo-700 dark:text-indigo-300 mr-2 mb-1 sm:mb-0">{stepMatch[1]}</span>
              <p className="text-gray-800 dark:text-gray-200">{stepMatch[2]}</p>
            </div>
          </div>
        );
      }
      
      if (calculatingMatch) {
        return (
          <div key={index} className="p-3 bg-purple-50 dark:bg-purple-900/30 rounded-md ml-4 border-l-2 border-purple-300 dark:border-purple-600 my-3">
            <div className="flex items-center">
              <HiOutlineCalculator className="text-purple-600 dark:text-purple-400 mr-2 flex-shrink-0 h-5 w-5" />
              <span className="font-semibold text-purple-700 dark:text-purple-300">{calculatingMatch[1]}</span>
              <span className="text-purple-800 dark:text-purple-200">{calculatingMatch[2]}</span>
            </div>
          </div>
        );
      }
      
      if (resultMatch) {
        return (
          <div key={index} className="p-3 bg-green-50 dark:bg-green-900/30 rounded-md ml-4 border-l-2 border-green-300 dark:border-green-600 my-3">
            <div className="flex items-center">
              <HiOutlineCheck className="text-green-600 dark:text-green-400 mr-2 flex-shrink-0 h-5 w-5" />
              <span className="text-green-800 dark:text-green-200">{resultMatch[2]}</span>
            </div>
          </div>
        );
      }
      
      if (rulesMatch) {
        return (
          <div key={index} className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-md ml-4 border-l-2 border-indigo-300 dark:border-indigo-600 my-3">
            <div className="flex items-center">
              <HiOutlineDocumentText className="text-indigo-600 dark:text-indigo-400 mr-2 flex-shrink-0 h-5 w-5" />
              <span className="font-semibold text-indigo-700 dark:text-indigo-300">{rulesMatch[1]}</span>
              <span className="text-indigo-800 dark:text-indigo-200">{rulesMatch[2]}</span>
            </div>
          </div>
        );
      }
      
      if (intermediateMatch) {
        return (
          <div key={index} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md ml-4 border-l-2 border-gray-300 dark:border-gray-600 my-3">
            <div className="flex items-center">
              <span className="text-gray-700 dark:text-gray-300">{step}</span>
            </div>
          </div>
        );
      }
      
      if (subExpressionMatch) {
        return (
          <div key={index} className="p-3 bg-amber-50 dark:bg-amber-900/30 rounded-md ml-4 border-l-2 border-amber-300 dark:border-amber-600 my-3">
            <div className="flex items-center">
              <HiOutlineCube className="text-amber-600 dark:text-amber-400 mr-2 flex-shrink-0 h-5 w-5" />
              <span className="font-semibold text-amber-700 dark:text-amber-300">{subExpressionMatch[1]} {subExpressionMatch[2]}</span>
              <span className="text-amber-800 dark:text-amber-200">{subExpressionMatch[3]}</span>
            </div>
          </div>
        );
      }
      
      if (simplificationMatch) {
        return (
          <div key={index} className="p-3 bg-teal-50 dark:bg-teal-900/30 rounded-md ml-4 border-l-2 border-teal-300 dark:border-teal-600 my-3">
            <div className="flex items-center">
              <HiOutlineRefresh className="text-teal-600 dark:text-teal-400 mr-2 flex-shrink-0 h-5 w-5" />
              <span className="text-teal-800 dark:text-teal-200">{step}</span>
            </div>
          </div>
        );
      }
      
      // Default para passos de cálculo que não se encaixam nos padrões acima
      return (
        <div key={index} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md ml-4 border-l-2 border-gray-300 dark:border-gray-600 my-3">
          <div className="flex items-center">
            <span className="text-gray-700 dark:text-gray-300">{step}</span>
          </div>
        </div>
      );
    }
    
    // Para passos de equações lineares, use estilo especial
    if (stepType === 'linear') {
      // Verificar se é um separador de verificação
      if (step === '---VERIFICATION_SEPARATOR---') {
        return (
          <div key={index} className="py-4 my-4 flex items-center">
            <div className="flex-grow h-px bg-gray-300 dark:bg-gray-600"></div>
            <div className="mx-4 px-4 py-2 bg-purple-100 dark:bg-purple-900/40 rounded-full text-purple-700 dark:text-purple-300 text-sm font-bold flex items-center">
              <HiOutlineCheck className="mr-1" /> Verificação
            </div>
            <div className="flex-grow h-px bg-gray-300 dark:bg-gray-600"></div>
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
        // Passo numerado com destaque
        const [_, stepNumber, stepContent] = stepMatch;
        return (
          <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-md border-l-4 border-indigo-500 dark:border-indigo-600 shadow-sm my-3">
            <div className="flex flex-col sm:flex-row">
              <span className="font-bold text-indigo-700 dark:text-indigo-300 mr-2 mb-1 sm:mb-0">{stepNumber}</span>
              <p className="text-gray-800 dark:text-gray-200">{stepContent}</p>
            </div>
          </div>
        );
      } else if (equationMatch) {
        return (
          <div key={index} className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-md ml-4 border-l-2 border-blue-300 dark:border-blue-600 shadow-sm my-2">
            <div className="flex items-center">
              <HiOutlineDocumentText className="text-blue-600 dark:text-blue-400 mr-2 flex-shrink-0 h-5 w-5" />
              <p className="text-blue-700 dark:text-blue-300 font-medium">{step}</p>
            </div>
          </div>
        );
      } else if (isolateMatch) {
        return (
          <div key={index} className="p-3 bg-violet-50 dark:bg-violet-900/30 rounded-md ml-4 border-l-2 border-violet-300 dark:border-violet-600 shadow-sm my-2">
            <div className="flex items-center">
              <HiOutlineArrowsExpand className="text-violet-600 dark:text-violet-400 mr-2 flex-shrink-0 h-5 w-5" />
              <p className="text-violet-700 dark:text-violet-300 font-medium">{step}</p>
            </div>
          </div>
        );
      } else if (operationMatch) {
        return (
          <div key={index} className="p-3 bg-amber-50 dark:bg-amber-900/30 rounded-md ml-4 border-l-2 border-amber-300 dark:border-amber-600 shadow-sm my-2">
            <div className="flex items-center">
              <HiOutlineCube className="text-amber-600 dark:text-amber-400 mr-2 flex-shrink-0 h-5 w-5" />
              <p className="text-amber-700 dark:text-amber-300 font-medium">{step}</p>
            </div>
          </div>
        );
      } else if (likeTermsMatch) {
        return (
          <div key={index} className="p-3 bg-teal-50 dark:bg-teal-900/30 rounded-md ml-4 border-l-2 border-teal-300 dark:border-teal-600 shadow-sm my-2">
            <div className="flex items-center">
              <HiOutlineRefresh className="text-teal-600 dark:text-teal-400 mr-2 flex-shrink-0 h-5 w-5" />
              <p className="text-teal-700 dark:text-teal-300 font-medium">{step}</p>
            </div>
          </div>
        );
      } else if (divideMatch) {
        return (
          <div key={index} className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-md ml-4 border-l-2 border-indigo-300 dark:border-indigo-600 shadow-sm my-2">
            <div className="flex items-center">
              <HiOutlineCalculator className="text-indigo-600 dark:text-indigo-400 mr-2 flex-shrink-0 h-5 w-5" />
              <p className="text-indigo-700 dark:text-indigo-300 font-medium">{step}</p>
            </div>
          </div>
        );
      } else if (resultMatch) {
        return (
          <div key={index} className="p-3 bg-green-50 dark:bg-green-900/30 rounded-md ml-4 border-l-2 border-green-300 dark:border-green-600 shadow-sm my-2 font-bold">
            <div className="flex items-center">
              <HiOutlineCheck className="text-green-600 dark:text-green-400 mr-2 flex-shrink-0 h-5 w-5" />
              <p className="text-green-700 dark:text-green-300 font-medium">{step}</p>
            </div>
          </div>
        );
      } else if (calculatingMatch) {
        return (
          <div key={index} className="p-3 bg-amber-50 dark:bg-amber-900/30 rounded-md ml-4 border-l-2 border-amber-300 dark:border-amber-600 shadow-sm my-2">
            <div className="flex items-center">
              <HiOutlineCalculator className="text-amber-600 dark:text-amber-400 mr-2 flex-shrink-0 h-5 w-5" />
              <p className="text-amber-700 dark:text-amber-300 font-medium">{step}</p>
            </div>
          </div>
        );
      } else if (checkMatch) {
        return (
          <div key={index} className="p-3 bg-purple-50 dark:bg-purple-900/30 rounded-md ml-4 border-l-2 border-purple-300 dark:border-purple-600 shadow-sm my-2 mt-4">
            <div className="flex items-center">
              <HiOutlineCheck className="text-purple-600 dark:text-purple-400 mr-2 flex-shrink-0 h-5 w-5" />
              <p className="text-purple-700 dark:text-purple-300 font-medium">{step}</p>
            </div>
          </div>
        );
      } else {
        // Outros passos
        return (
          <div key={index} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md ml-4 border-l-2 border-gray-300 dark:border-gray-600 my-3">
            <p className="text-gray-800 dark:text-gray-200">{step}</p>
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
      const solutionMatch = step.includes('Solução') && (step.includes('rad =') || step.includes('resultado') || step.includes('final:'));
      
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
        // Passo numerado com destaque
        const [_, stepNumber, stepContent] = stepMatch;
        return (
          <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-md border-l-4 border-indigo-500 dark:border-indigo-600">
            <div className="flex flex-col sm:flex-row">
              <span className="font-bold text-indigo-700 dark:text-indigo-300 mr-2 mb-1 sm:mb-0">{stepNumber}</span>
              <p className="text-gray-800 dark:text-gray-200">{stepContent}</p>
            </div>
          </div>
        );
      } else if (equationMatch || functionMatch) {
        return (
          <div key={index} className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-md ml-4 border-l-2 border-blue-300 dark:border-blue-600 my-3">
            <div className="flex items-center">
              <HiOutlineDocumentText className="text-blue-600 dark:text-blue-400 mr-2 flex-shrink-0 h-5 w-5" />
              <p className="text-blue-700 dark:text-blue-300 font-medium">{step}</p>
            </div>
          </div>
        );
      } else if (intervalMatch) {
        return (
          <div key={index} className="p-3 bg-purple-50 dark:bg-purple-900/30 rounded-md ml-4 border-l-2 border-purple-300 dark:border-purple-600 my-3">
            <div className="flex items-center">
              <HiOutlineArrowsExpand className="text-purple-600 dark:text-purple-400 mr-2 flex-shrink-0 h-5 w-5" />
              <p className="text-purple-700 dark:text-purple-300 font-medium">{step}</p>
            </div>
          </div>
        );
      } else if (methodMatch || parameterMatch) {
        return (
          <div key={index} className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-md ml-4 border-l-2 border-indigo-300 dark:border-indigo-600 my-3">
            <div className="flex items-center">
              <HiOutlineCalculator className="text-indigo-600 dark:text-indigo-400 mr-2 flex-shrink-0 h-5 w-5" />
              <p className="text-indigo-700 dark:text-indigo-300 font-medium">{step}</p>
            </div>
          </div>
        );
      } else if (solutionMatch || zerosMatch) {
        return (
          <div key={index} className="p-3 bg-green-50 dark:bg-green-900/30 rounded-md ml-4 border-l-2 border-green-300 dark:border-green-600 my-3">
            <div className="flex items-center">
              <HiOutlineCheck className="text-green-600 dark:text-green-400 mr-2 flex-shrink-0 h-5 w-5" />
              <p className="text-green-700 dark:text-green-300 font-medium">{step}</p>
            </div>
          </div>
        );
      } else if (verificationMatch) {
        return (
          <div key={index} className="p-3 bg-amber-50 dark:bg-amber-900/30 rounded-md ml-4 border-l-2 border-amber-300 dark:border-amber-600 my-3">
            <div className="flex items-center">
              <HiOutlineCheck className="text-amber-600 dark:text-amber-400 mr-2 flex-shrink-0 h-5 w-5" />
              <p className="text-amber-700 dark:text-amber-300 font-medium">{step}</p>
            </div>
          </div>
        );
      } else if (periodicMatch) {
        return (
          <div key={index} className="p-3 bg-teal-50 dark:bg-teal-900/30 rounded-md ml-4 border-l-2 border-teal-300 dark:border-teal-600 my-3">
            <div className="flex items-center">
              <HiOutlineRefresh className="text-teal-600 dark:text-teal-400 mr-2 flex-shrink-0 h-5 w-5" />
              <p className="text-teal-700 dark:text-teal-300 font-medium">{step}</p>
            </div>
          </div>
        );
      } else if (generalInfoMatch) {
        return (
          <div key={index} className="p-3 bg-yellow-50 dark:bg-yellow-900/30 rounded-md ml-4 border-l-2 border-yellow-300 dark:border-yellow-600 my-3">
            <div className="flex items-center">
              <HiOutlineDocumentText className="text-yellow-600 dark:text-yellow-400 mr-2 flex-shrink-0 h-5 w-5" />
              <p className="text-yellow-700 dark:text-yellow-300 font-medium">{step}</p>
            </div>
          </div>
        );
      } else if (extremaMatch) {
        return (
          <div key={index} className="p-3 bg-amber-50 dark:bg-amber-900/30 rounded-md ml-4 border-l-2 border-amber-300 dark:border-amber-600 my-3">
            <div className="flex items-center">
              <HiOutlineCalculator className="text-amber-600 dark:text-amber-400 mr-2 flex-shrink-0 h-5 w-5" />
              <p className="text-amber-700 dark:text-amber-300 font-medium">{step}</p>
            </div>
          </div>
        );
      } else if (asymptoticMatch) {
        return (
          <div key={index} className="p-3 bg-red-50 dark:bg-red-900/30 rounded-md ml-4 border-l-2 border-red-300 dark:border-red-600 my-3">
            <div className="flex items-center">
              <HiOutlineCube className="text-red-600 dark:text-red-400 mr-2 flex-shrink-0 h-5 w-5" />
              <p className="text-red-700 dark:text-red-300 font-medium">{step}</p>
            </div>
          </div>
        );
      } else {
        // Outros passos
        return (
          <div key={index} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md ml-4 border-l-2 border-gray-300 dark:border-gray-600 my-3">
            <div className="flex items-center">
              <p className="text-gray-800 dark:text-gray-200">{step}</p>
            </div>
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
        step.includes('unidades cúbicas');
      
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
        // Passo numerado com destaque
        const [_, stepNumber, stepContent] = stepMatch;
        return (
          <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-md border-l-4 border-indigo-500 dark:border-indigo-600 my-3">
            <div className="flex flex-col sm:flex-row">
              <span className="font-bold text-indigo-700 dark:text-indigo-300 mr-2 mb-1 sm:mb-0">{stepNumber}</span>
              <p className="text-gray-800 dark:text-gray-200">{stepContent}</p>
            </div>
          </div>
        );
      } else if (formulaMatch) {
        return (
          <div key={index} className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-md ml-4 border-l-2 border-blue-300 dark:border-blue-600 my-3">
            <div className="flex items-center">
              <HiOutlineDocumentText className="text-blue-600 dark:text-blue-400 mr-2 flex-shrink-0 h-5 w-5" />
              <p className="text-blue-700 dark:text-blue-300 font-medium">{step}</p>
            </div>
          </div>
        );
      } else if (substitutionMatch) {
        return (
          <div key={index} className="p-3 bg-purple-50 dark:bg-purple-900/30 rounded-md ml-4 border-l-2 border-purple-300 dark:border-purple-600 my-3">
            <div className="flex items-center">
              <HiOutlineArrowsExpand className="text-purple-600 dark:text-purple-400 mr-2 flex-shrink-0 h-5 w-5" />
              <p className="text-purple-700 dark:text-purple-300 font-medium">{step}</p>
            </div>
          </div>
        );
      } else if (calculationMatch) {
        return (
          <div key={index} className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-md ml-4 border-l-2 border-indigo-300 dark:border-indigo-600 my-3">
            <div className="flex items-center">
              <HiOutlineCalculator className="text-indigo-600 dark:text-indigo-400 mr-2 flex-shrink-0 h-5 w-5" />
              <p className="text-indigo-700 dark:text-indigo-300 font-medium">{step}</p>
            </div>
          </div>
        );
      } else if (resultMatch) {
        return (
          <div key={index} className="p-3 bg-green-50 dark:bg-green-900/30 rounded-md ml-4 border-l-2 border-green-300 dark:border-green-600 my-3">
            <div className="flex items-center">
              <HiOutlineCheck className="text-green-600 dark:text-green-400 mr-2 flex-shrink-0 h-5 w-5" />
              <p className="text-green-700 dark:text-green-300 font-medium">{step}</p>
            </div>
          </div>
        );
      } else if (dimensionMatch) {
        return (
          <div key={index} className="p-3 bg-amber-50 dark:bg-amber-900/30 rounded-md ml-4 border-l-2 border-amber-300 dark:border-amber-600 my-3">
            <div className="flex items-center">
              <HiOutlineCube className="text-amber-600 dark:text-amber-400 mr-2 flex-shrink-0 h-5 w-5" />
              <p className="text-amber-700 dark:text-amber-300 font-medium">{step}</p>
            </div>
          </div>
        );
      } else {
        // Outros passos
        return (
          <div key={index} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md ml-4 my-3">
            <div className="flex items-center">
              <HiOutlineDocumentText className="text-gray-600 dark:text-gray-400 mr-2 flex-shrink-0 h-5 w-5" />
              <p className="text-gray-800 dark:text-gray-200">{step}</p>
            </div>
          </div>
        );
      }
    }

    // Padrão de estilo para passos regulares
    if (stepMatch) {
      // Número do passo destacado
      const [_, stepNumber, stepContent] = stepMatch;
      return (
        <div key={index} className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-md border-l-4 border-blue-400 dark:border-blue-600 my-2">
          <span className="font-bold text-blue-700 dark:text-blue-300">{stepNumber}</span>
          <span className="text-blue-800 dark:text-blue-200">{stepContent}</span>
        </div>
      );
    } else if (step.includes('MDC')) {
      // Cálculo MDC
      return (
        <div key={index} className="p-3 bg-purple-50 dark:bg-purple-900/30 rounded-md border-l-2 border-purple-300 dark:border-purple-600">
          <p className="text-purple-700 dark:text-purple-300 font-medium">{step}</p>
        </div>
      );
    } else if (step.includes(' / ') || step.includes('divisão')) {
      // Passo de divisão
      return (
        <div key={index} className="p-3 bg-amber-50 dark:bg-amber-900/30 rounded-md border-l-2 border-amber-300 dark:border-amber-600">
          <p className="text-amber-700 dark:text-amber-300 font-medium">{step}</p>
        </div>
      );
    } else if (step.includes('sinal')) {
      // Passo de ajuste de sinal
      return (
        <div key={index} className="p-3 bg-teal-50 dark:bg-teal-900/30 rounded-md border-l-2 border-teal-300 dark:border-teal-600">
          <p className="text-teal-700 dark:text-teal-300 font-medium">{step}</p>
        </div>
      );
    } else if (step.includes('Resultado') || step.includes('resultado')) {
      // Resultado final
      return (
        <div key={index} className="p-3 bg-green-50 dark:bg-green-900/30 rounded-md border-l-2 border-green-300 dark:border-green-600">
          <p className="text-green-700 dark:text-green-300 font-medium">{step}</p>
        </div>
      );
    } else if (step.includes('Entrada:') || step.includes('Input:')) {
      return (
        <div key={index} className="p-3 bg-purple-50 dark:bg-purple-900/30 rounded-md border-l-4 border-purple-400 dark:border-purple-600 my-2">
          <span className="text-purple-800 dark:text-purple-200">{step}</span>
        </div>
      );
    } else if (step.includes('Verificação:') || step.includes('Verificando:') || step.includes('Conferindo:')) {
      return (
        <div key={index} className="p-3 bg-amber-50 dark:bg-amber-900/30 rounded-md border-l-4 border-amber-400 dark:border-amber-600 my-2">
          <span className="text-amber-800 dark:text-amber-200">{step}</span>
        </div>
      );
    } else if (step.includes('Erro:') || step.includes('Atenção:') || step.includes('Aviso:')) {
      return (
        <div key={index} className="p-3 bg-red-50 dark:bg-red-900/30 rounded-md border-l-4 border-red-400 dark:border-red-600 my-2">
          <span className="text-red-800 dark:text-red-200">{step}</span>
        </div>
      );
    } else {
      // Conteúdo regular
      return (
        <div key={index} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md border-l-4 border-gray-300 dark:border-gray-600 my-2">
          <span className="text-gray-700 dark:text-gray-300">{step}</span>
        </div>
      );
    }
  };

  return (
      <div className="p-4 bg-theme-container dark:bg-gray-800 overflow-auto">
        {steps.map((step, index) => 
          customRenderStep 
            ? customRenderStep(step, index) 
            : defaultRenderStep(step, index)
        )}
      </div>
  );
};

export default StepByStepExplanation; 