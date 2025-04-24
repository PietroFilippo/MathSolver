import React, { ReactNode } from 'react';
import { 
  HiOutlineDocumentText, 
  HiOutlineCube, 
  HiOutlineRefresh, 
  HiOutlineCalculator,
  HiOutlineCheck,
  HiOutlineLightBulb,
  HiOutlineInformationCircle,
  HiOutlineCheckCircle,
  HiOutlineArrowRight,
  HiOutlinePencil,
  HiOutlineArrowsExpand,
  HiOutlineTable,
  HiCheckCircle,
  HiXCircle
} from 'react-icons/hi';
import { useTranslation, Trans } from 'react-i18next';

interface StepByStepExplanationProps {
  steps: (string | ReactNode)[];
  customRenderStep?: (step: string | ReactNode, index: number) => ReactNode;
  stepType?: 'default' | 'trigonometric' | 'geometric' | 'linear' | 'calculus' | 'solution' | 'error' | 'matrices';
}

const StepByStepExplanation: React.FC<StepByStepExplanationProps> = ({ 
  steps, 
  customRenderStep,
  stepType = 'default'
}) => {
  const { t } = useTranslation(['arithmetic', 'translation']);
  
  // Função para lidar com os passos de verificação concluídos
  const getVerificationStatus = (text: string) => {
    // Verifica se há ✓ ou "Correct!" no texto, o que indica uma verificação bem-sucedida
    return text.includes('✓') || text.includes('(Correct!)') || text.includes('true');
  };

  const defaultRenderStep = (step: string | ReactNode, index: number) => {
    if (typeof step !== 'string') {
      return <div key={index} className="p-3 bg-theme-container dark:bg-gray-800 rounded-md">{step}</div>;
    }

    // Lidar com o separador para a seção de verificação
    if (step === '---VERIFICATION_SEPARATOR---') {
      return (
        <div key={index} className="flex items-center justify-center my-4">
          <div className="w-full h-px bg-purple-200 dark:bg-purple-800"></div>
          <span className="px-3 py-1 text-xs font-semibold text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-900 rounded-full mx-4">
            {t('translation:common.verification')}
          </span>
          <div className="w-full h-px bg-purple-200 dark:bg-purple-800"></div>
        </div>
      );
    }

    // Lidar com o separador para a seção de verificação
    if (step === 'verification' || step === 'translation:verification' || step === 'common.verification') {
      return (
        <div key={index} className="flex items-center justify-center my-4">
          <div className="w-full h-px bg-purple-200 dark:bg-purple-800"></div>
          <span className="px-3 py-1 text-xs font-semibold text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-900 rounded-full mx-4">
            {t('common.verification')}
          </span>
          <div className="w-full h-px bg-purple-200 dark:bg-purple-800"></div>
        </div>
      );
    }

    // Lidar com o cabeçalho do passo
    if (step.startsWith('common.step') || step.startsWith('translation:common.step')) {
      const stepNumberMatch = step.match(/(?:common\.step|translation:common\.step) (\d+):(.*)/);
      if (stepNumberMatch) {
        const [_, stepNumber, content] = stepNumberMatch;
        return (
          <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-md border-l-4 border-indigo-500 dark:border-indigo-600 shadow-sm my-3">
            <div className="flex flex-col sm:flex-row">
              <span className="font-bold text-indigo-700 dark:text-indigo-300 mr-2 mb-1 sm:mb-0">{t('common.step')} {stepNumber}:</span>
              <p className="text-gray-800 dark:text-gray-200">{content.trim()}</p>
            </div>
          </div>
        );
      }
    }

    // Lidar com o cabeçalho de verificação
    if (step.startsWith('common.verification:') || 
        step.startsWith('translation:common.verification:') || 
        step === 'Verification:' ||
        step.includes('Verificando o resultado') ||
        step.includes('Verifying the result') ||
        step.includes('Verificação final') ||
        step.includes('Final verification') ||
        step.includes('Verifying') ||
        step.includes('Verificação do resultado') ||
        step.includes('Verification of the result') ||
        (step.startsWith('Verifying') && step.includes('should')) ||
        (step.startsWith('Verificando') && step.includes('deve'))) {
      return (
        <div key={index} className="p-3 bg-purple-50 dark:bg-purple-900/30 rounded-md ml-4 border-l-2 border-purple-300 dark:border-purple-600 shadow-sm my-2 mt-4">
          <div className="flex items-center">
            <HiOutlineCheckCircle className="text-purple-600 dark:text-purple-400 mr-2 flex-shrink-0 h-5 w-5" />
            <p className="text-purple-700 dark:text-purple-300 font-medium">{step}</p>
          </div>
        </div>
      );
    }

    // Tratamento especial para passos de verificação concluídos com indicador de correção
    if ((step.includes('verification.completed') || 
         step.includes('Verification completed') ||
         step.includes('Verificação concluída')) && 
        (step.includes('✓') || step.includes('(Correct!)') || step.includes('{{#if'))) {
      
      // Limpar qualquer sintaxe de handlebars se presente
      let cleanedStep = step;
      
      // Tratamento de verificação de fatoração com condicional isCorrect
      if (step.includes('{{#if isCorrect}}')) {
        // Extrair as partes antes da condicional
        const beforeConditional = step.split('{{#if isCorrect}}')[0].trim();
        
        // Padrão padrão para o checkmark (✓) como assumimos que a verificação passou
        const displayText = beforeConditional + ' ✓';
        return (
          <div key={index} className="p-3 bg-green-50 dark:bg-green-900/30 rounded-md ml-4 border-l-2 border-green-300 dark:border-green-600 shadow-sm my-2 font-bold">
            <div className="flex items-center">
              <HiOutlineCheck className="text-green-600 dark:text-green-400 mr-2 flex-shrink-0 h-5 w-5" />
              <p className="text-green-700 dark:text-green-300 font-medium">{displayText}</p>
            </div>
          </div>
        );
      }
      
      // Tratamento padrão para condicional correta/incorreta
      if (step.includes('{{#if correct}}')) {
        const isCorrect = getVerificationStatus(step);
        // Extrair o texto apropriado com base na correção
        const correctTextMatch = step.match(/{{#if correct}}(.*?){{else}}/);
        const incorrectTextMatch = step.match(/{{else}}(.*?){{\/if}}/);
        
        if (isCorrect && correctTextMatch) {
          cleanedStep = correctTextMatch[1];
        } else if (!isCorrect && incorrectTextMatch) {
          cleanedStep = incorrectTextMatch[1];
        }
        
        // Limpar qualquer sintaxe de handlebars restante
        cleanedStep = cleanedStep.replace(/{{.*?}}/g, '');
      }
      
      // Remover a chave de tradução se presente
      if (cleanedStep.includes('verification.completed:')) {
        cleanedStep = cleanedStep.replace(/verification\.completed:\s+/, '');
      }
      
      // Lidar com o texto da operação que não é renderizado corretamente
      if (cleanedStep.includes('{{operation')) {
        cleanedStep = cleanedStep.replace(/{{operation.*?}}/, '').trim();
      }
      
      return (
        <div key={index} className="p-3 bg-green-50 dark:bg-green-900/30 rounded-md ml-4 border-l-2 border-green-300 dark:border-green-600 shadow-sm my-2 font-bold">
          <div className="flex items-center">
            <HiOutlineCheck className="text-green-600 dark:text-green-400 mr-2 flex-shrink-0 h-5 w-5" />
            <p className="text-green-700 dark:text-green-300 font-medium">{cleanedStep}</p>
          </div>
        </div>
      );
    }

    // Tratamento especial para passos em solvers que podem ter chaves de tradução
    // Verificar padrões comuns em passos que podem conter chaves de tradução
    if (stepType === 'linear' || stepType === 'default') {
      // Verificar padrão comum de passo
      const commonStepRegex = /^(common\.step|Step|Passo|translation:common\.step) (\d+):(.*)/;
      const commonStepMatch = step.match(commonStepRegex);
      
      // Verificar padrão de equação original
      const originalEquationRegex = /(solvers\..+\.steps\.original_equation|arithmetic:percentage\.steps\..+\.original_equation|Original equation|Equação original):(.*)/;
      const originalEquationMatch = step.match(originalEquationRegex);
      
      // Verificar padrão de verificação
      const verificationRegex = /(common\.verification|Verification|Verificação|translation:common\.verification):(.*)/;
      const verificationMatch = step.match(verificationRegex);
      
      // Verificar padrão de cálculo
      const calculatingRegex = /(solvers\..+\.steps\..+\.calculating|arithmetic:percentage\.steps\..+\.calculating|Calculating|Calculando):(.*)/;
      const calculatingMatch = step.match(calculatingRegex);
      
      // Verificar padrão de simplificação
      const simplifyingRegex = /(solvers\..+\.steps\..+\.simplifying|arithmetic:percentage\.steps\..+\.simplifying|Simplifying|Simplificando):(.*)/;
      const simplifyingMatch = step.match(simplifyingRegex);
      
      // Verificar padrão de resultado
      const resultRegex = /(common\.result|translation:common\.result|Result|Resultado):(.*)/;
      const resultMatch = step.match(resultRegex);
      
      // Verificar padrão de verificação concluída
      const verificationCompletedRegex = /(solvers\..+\.steps\..+\.verification\.completed|arithmetic:percentage\.steps\..+\.verification\.completed|Verification completed|Verificação concluída):(.*)/;
      let verificationCompletedMatch = step.match(verificationCompletedRegex);

      if (commonStepMatch) {
        return (
          <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-md border-l-4 border-indigo-500 dark:border-indigo-600 shadow-sm my-3">
            <div className="flex flex-col sm:flex-row">
              <span className="font-bold text-indigo-700 dark:text-indigo-300 mr-2 mb-1 sm:mb-0">{t('translation:common.step')} {commonStepMatch[2]}:</span>
              <p className="text-gray-800 dark:text-gray-200">{commonStepMatch[3]}</p>
            </div>
          </div>
        );
      } else if (originalEquationMatch) {
        return (
          <div key={index} className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-md ml-4 border-l-2 border-blue-300 dark:border-blue-600 shadow-sm my-2">
            <div className="flex items-center">
              <HiOutlineDocumentText className="text-blue-600 dark:text-blue-400 mr-2 flex-shrink-0 h-5 w-5" />
              <p className="text-blue-700 dark:text-blue-300 font-medium">{step}</p>
            </div>
          </div>
        );
      } else if (verificationMatch) {
        return (
          <div key={index} className="p-3 bg-purple-50 dark:bg-purple-900/30 rounded-md ml-4 border-l-2 border-purple-300 dark:border-purple-600 shadow-sm my-2 mt-4">
            <div className="flex items-center">
              <HiOutlineCheckCircle className="text-purple-600 dark:text-purple-400 mr-2 flex-shrink-0 h-5 w-5" />
              <p className="text-purple-700 dark:text-purple-300 font-medium">{t('translation:common.verification')}:</p>
            </div>
          </div>
        );
      } else if (calculatingMatch) {
        return (
          <div key={index} className="p-3 bg-orange-50 dark:bg-orange-900/30 rounded-md ml-4 border-l-2 border-orange-300 dark:border-orange-600 shadow-sm my-2">
            <div className="flex items-center">
              <HiOutlineCalculator className="text-orange-600 dark:text-orange-400 mr-2 flex-shrink-0 h-5 w-5" />
              <p className="text-orange-700 dark:text-orange-300 font-medium">{step}</p>
            </div>
          </div>
        );
      } else if (simplifyingMatch) {
        return (
          <div key={index} className="p-3 bg-teal-50 dark:bg-teal-900/30 rounded-md ml-4 border-l-2 border-teal-300 dark:border-teal-600 shadow-sm my-2">
            <div className="flex items-center">
              <HiOutlineRefresh className="text-teal-600 dark:text-teal-400 mr-2 flex-shrink-0 h-5 w-5" />
              <p className="text-teal-700 dark:text-teal-300 font-medium">{step}</p>
            </div>
          </div>
        );
      } else if (resultMatch) {
        return (
          <div key={index} className="p-3 bg-green-50 dark:bg-green-900/30 rounded-md ml-4 border-l-2 border-green-300 dark:border-green-600 shadow-sm my-2">
            <div className="flex items-center">
              <HiOutlineCheck className="text-green-600 dark:text-green-400 mr-2 flex-shrink-0 h-5 w-5" />
              <p className="text-green-700 dark:text-green-300 font-medium">{step}</p>
            </div>
          </div>
        );
      } else if (verificationCompletedMatch) {
        // Limpar qualquer sintaxe de handlebars restante
        let cleanedStep = verificationCompletedMatch[2] || step;
        
        // Lidar com o texto da operação que não é renderizado corretamente
        if (cleanedStep.includes('{{operation')) {
          cleanedStep = cleanedStep.replace(/{{operation.*?}}/, '').trim();
        }
        
        return (
          <div key={index} className="p-3 bg-green-50 dark:bg-green-900/30 rounded-md ml-4 border-l-2 border-green-300 dark:border-green-600 shadow-sm my-2 font-bold">
            <div className="flex items-center">
              <HiOutlineCheck className="text-green-600 dark:text-green-400 mr-2 flex-shrink-0 h-5 w-5" />
              <p className="text-green-700 dark:text-green-300 font-medium">{cleanedStep}</p>
            </div>
          </div>
        );
      }
    }

    // Padrão para o cabeçalho do passo (Passo X:)
    const stepMatch = step.match(/^(Passo \d+:)(.*)$/);

    // Para passos de matrizes
    if (stepType === 'matrices') {
      // Padrão para o cabeçalho da matriz (Matriz A: ou Matriz B:)
      const matrixHeaderMatch = step.match(/^(Matriz [AB]( \(\d+×\d+\))?:)(.*)$/);
      
      // Padrão para matriz de entrada ou original
      const matrixInputMatch = step.match(/^(Matriz (de entrada|original|de cofatores|adjunta)( \(\d+×\d+\))?:)(.*)$/);
      
      // Padrão para conteúdo da matriz ([1, 2, 3])
      const matrixContentMatch = step.match(/^\[([^\]]+)\]$/);
      
      // Padrão para fórmula/algoritmo
      const formulaMatch = step.match(/^(Aplicando a fórmula:)(.*)$/);
      
      // Padrão para verificação de dimensões
      const dimensionMatch = step.match(/^(Verificando dimensões:)(.*)$/);
      
      // Padrão para cálculos - agora apenas explicitamente contendo "Calculando:"
      const calculationMatch = step.match(/^(Calculando:)(.*)$/);
      
      // Padrão para cálculos de elementos específicos - agora tratados separadamente
      const elementCalculationMatch = step.includes('Elemento (') || step.includes(' = ');
      
      // Padrão para resultados
      const resultMatch = step.match(/^(Resultado:)(.*)$/) || 
                        step.includes('Resultado final:') || 
                        step.includes('concluída com sucesso');
      
      // Padrão para forma inicial
      const initialFormMatch = step.match(/^(Forma inicial:)(.*)$/);
      
      // Padrão para verificação/propriedades
      const verificationMatch = step.match(/^(Verificação:|Verificando)(.*)$/) || 
                               step.includes('propriedade');
      
      // Padrão para relação com outro conceito
      const relationMatch = step.includes('Relação com');
      
      if (stepMatch) {
        return (
          <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-md border-l-4 border-indigo-500 dark:border-indigo-600 my-3">
            <div className="flex flex-col sm:flex-row">
              <span className="font-bold text-indigo-700 dark:text-indigo-300 mr-2 mb-1 sm:mb-0">{stepMatch[1]}</span>
              <p className="text-gray-800 dark:text-gray-200">{stepMatch[2]}</p>
            </div>
          </div>
        );
      } else if (matrixHeaderMatch) {
        return (
          <div key={index} className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-md ml-4 border-l-2 border-blue-300 dark:border-blue-600 my-2">
            <div className="flex items-center">
              <HiOutlineTable className="text-blue-600 dark:text-blue-400 mr-2 flex-shrink-0 h-5 w-5" />
              <span className="font-semibold text-blue-700 dark:text-blue-300 mr-2">{matrixHeaderMatch[1]}</span>
              <span className="text-blue-800 dark:text-blue-200">{matrixHeaderMatch[3] || ''}</span>
            </div>
          </div>
        );
      } else if (matrixInputMatch) {
        return (
          <div key={index} className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-md ml-4 border-l-2 border-blue-300 dark:border-blue-600 my-2">
            <div className="flex items-center">
              <HiOutlineTable className="text-blue-600 dark:text-blue-400 mr-2 flex-shrink-0 h-5 w-5" />
              <span className="font-semibold text-blue-700 dark:text-blue-300 mr-2">{matrixInputMatch[1]}</span>
              <span className="text-blue-800 dark:text-blue-200">{matrixInputMatch[4] || ''}</span>
            </div>
          </div>
        );
      } else if (matrixContentMatch) {
        return (
          <div key={index} className="p-2 bg-gray-50 dark:bg-gray-800/60 rounded-md ml-8 border-l-1 border-gray-200 dark:border-gray-600 my-1 font-mono text-sm">
            <span className="text-gray-700 dark:text-gray-300">{step}</span>
          </div>
        );
      } else if (formulaMatch) {
        return (
          <div key={index} className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-md ml-4 border-l-2 border-indigo-300 dark:border-indigo-600 my-2">
            <div className="flex items-center">
              <HiOutlineDocumentText className="text-indigo-600 dark:text-indigo-400 mr-2 flex-shrink-0 h-5 w-5" />
              <span className="font-semibold text-indigo-700 dark:text-indigo-300 mr-2">{formulaMatch[1]}</span>
              <span className="text-indigo-800 dark:text-indigo-200">{formulaMatch[2]}</span>
            </div>
          </div>
        );
      } else if (initialFormMatch) {
        return (
          <div key={index} className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-md ml-4 border-l-2 border-blue-300 dark:border-blue-600 my-2">
            <div className="flex items-center">
              <HiOutlineDocumentText className="text-blue-600 dark:text-blue-400 mr-2 flex-shrink-0 h-5 w-5" />
              <span className="font-semibold text-blue-700 dark:text-blue-300 mr-2">{initialFormMatch[1]}</span>
              <span className="text-blue-800 dark:text-blue-200">{initialFormMatch[2]}</span>
            </div>
          </div>
        );
      } else if (dimensionMatch) {
        return (
          <div key={index} className="p-3 bg-amber-50 dark:bg-amber-900/30 rounded-md ml-4 border-l-2 border-amber-300 dark:border-amber-600 my-2">
            <div className="flex items-center">
              <HiOutlineArrowsExpand className="text-amber-600 dark:text-amber-400 mr-2 flex-shrink-0 h-5 w-5" />
              <span className="font-semibold text-amber-700 dark:text-amber-300 mr-2">{dimensionMatch[1]}</span>
              <span className="text-amber-800 dark:text-amber-200">{dimensionMatch[2]}</span>
            </div>
          </div>
        );
      } else if (calculationMatch) {
        return (
          <div key={index} className="p-3 bg-yellow-50 dark:bg-yellow-900/30 rounded-md ml-4 border-l-2 border-yellow-300 dark:border-yellow-600 my-2">
            <div className="flex items-center">
              <HiOutlineCalculator className="text-yellow-600 dark:text-yellow-400 mr-2 flex-shrink-0 h-5 w-5" />
              <span className="text-yellow-800 dark:text-yellow-200">{step}</span>
            </div>
          </div>
        );
      } else if (elementCalculationMatch) {
        return (
          <div key={index} className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-md ml-4 border-l-2 border-slate-300 dark:border-slate-600 my-2">
            <div className="flex items-center">
              <HiOutlineCalculator className="text-slate-600 dark:text-slate-400 mr-2 flex-shrink-0 h-5 w-5" />
              <span className="text-slate-800 dark:text-slate-200">{step}</span>
            </div>
          </div>
        );
      } else if (resultMatch) {
        return (
          <div key={index} className="p-3 bg-green-50 dark:bg-green-900/30 rounded-md ml-4 border-l-2 border-green-300 dark:border-green-600 my-2">
            <div className="flex items-center">
              <HiOutlineCheck className="text-green-600 dark:text-green-400 mr-2 flex-shrink-0 h-5 w-5" />
              <span className="text-green-700 dark:text-green-300 font-medium">{step}</span>
            </div>
          </div>
        );
      } else if (verificationMatch) {
        return (
          <div key={index} className="p-3 bg-purple-50 dark:bg-purple-900/30 rounded-md ml-4 border-l-2 border-purple-300 dark:border-purple-600 my-2">
            <div className="flex items-center">
              <HiOutlineCheckCircle className="text-purple-600 dark:text-purple-400 mr-2 flex-shrink-0 h-5 w-5" />
              <span className="text-purple-700 dark:text-purple-300 font-medium">{step}</span>
            </div>
          </div>
        );
      } else if (relationMatch) {
        return (
          <div key={index} className="p-3 bg-cyan-50 dark:bg-cyan-900/30 rounded-md ml-4 border-l-2 border-cyan-300 dark:border-cyan-600 my-2">
            <div className="flex items-center">
              <HiOutlineRefresh className="text-cyan-600 dark:text-cyan-400 mr-2 flex-shrink-0 h-5 w-5" />
              <span className="text-cyan-700 dark:text-cyan-300 font-medium">{step}</span>
            </div>
          </div>
        );
      } else {
        return (
          <div key={index} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md ml-4 border-l-2 border-gray-300 dark:border-gray-600 my-2">
            <span className="text-gray-800 dark:text-gray-200">{step}</span>
          </div>
        );
      }
    }
    
    // Para passos de cálculo diferencial e integral
    if (stepType === 'calculus') {
      // Padrão para expressão original (mantém em roxo)
      const expressionMatch = step.match(/^(Expressão original:)(.*)$/);
      
      // Padrão para passos de cálculo (agora em amarelo)
      const calculatingMatch = step.match(/^(Calculando a \d+ª derivada:|Calculando a integral indefinida:|Calculando .+:)(.*)$/);
      
      // Padrão para resultados da derivada
      const resultMatch = step.match(/^(Resultado da .+:|Resultado numérico:)(.*)$/);
      
      // Padrão para aplicação de regras de derivação/integração
      const rulesMatch = step.match(/^(Aplicando a regra d[aeoi] .+:|Aplicando a regra integral de .+:|Aplicando a regra da .+:|Aplicando a propriedade de .+:|Aplicando o Teorema .+:|Regra:|Fórmula:)(.*)$/);
      
      // Padrão para métodos de resolução
      const methodMatch = step.match(/^(Método:|Técnica:|Transformação:|Substituição:)(.*)$/);
      
      // Padrão para observações
      const observationMatch = step.match(/^(Observação:|Propriedade única:|Caso especial:)(.*)$/);
      
      // Padrão para verificações
      const verificationMatch = step.match(/^(Verificando:|Demonstração:|Aplicando diretamente:)(.*)$/);
      
      // Padrão para resultados parciais
      const partialResultMatch = step.match(/^(Resultado parcial:|Obtendo o resultado final:)(.*)$/);
      
      // Padrão para obter resultado final
      const finalResultMatch = step === "Obter o resultado final";
      
      // Padrão para passos intermediários
      const intermediateMatch = step.includes('Onde ') || step.includes('Para a expressão') || step.includes('Vamos calcular');
      
      // Padrão para sub-expressões numeradas (como "1) Para f(x) = x^3")
      const subExpressionMatch = step.match(/^(Para .+:?)(.*)$/);
      
      // Padrão para resultado ou simplificação
      const simplificationMatch = step.includes('Simplificando:') || step.includes('Após simplificação:');
      
      // Padrão para substituições em limites
      const limitSubstitutionMatch = step.includes('Substituindo') && (step.includes('limite') || step.includes('h →') || step.includes('Δx →') || step.includes('x ='));
      
      // Padrão para interpretação da derivada
      const interpretationMatch = step.includes('Interpretação:') || step.includes('Isso significa que') || step.includes('representa a taxa') || step.includes('geometricamente');
      
      // Padrão para observações
      const observationPatternMatch = step.startsWith('Observação:') || step.startsWith('  Observação:');
      
      // Padrão para detalhes de termo específico
      const termDetailMatch = step.startsWith('Para o termo:') || step.startsWith('  Para o termo:') || step.match(/^Para [fg]\(/);
      
      // Add a specific pattern match for "Propriedade:" (property) that uses yellow styling
      const propertyMatch = step.match(/^(Propriedade:)(.*)$/);
      
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
      
      if (expressionMatch) {
        return (
          <div key={index} className="p-3 bg-purple-50 dark:bg-purple-900/30 rounded-md ml-4 border-l-2 border-purple-300 dark:border-purple-600 my-3">
            <div className="flex items-center">
              <HiOutlineDocumentText className="text-purple-600 dark:text-purple-400 mr-2 flex-shrink-0 h-5 w-5" />
              <span className="font-semibold text-purple-700 dark:text-purple-300 mr-2">{expressionMatch[1]}</span>
              <span className="text-purple-800 dark:text-purple-200">{expressionMatch[2]}</span>
            </div>
          </div>
        );
      }
      
      if (calculatingMatch) {
        return (
          <div key={index} className="p-3 bg-yellow-50 dark:bg-yellow-900/30 rounded-md ml-4 border-l-2 border-yellow-300 dark:border-yellow-600 my-3">
            <div className="flex items-center">
              <HiOutlineCalculator className="text-yellow-600 dark:text-yellow-400 mr-2 flex-shrink-0 h-5 w-5" />
              <span className="font-semibold text-yellow-700 dark:text-yellow-300 mr-2">{calculatingMatch[1]}</span>
              <span className="text-yellow-800 dark:text-yellow-200">{calculatingMatch[2]}</span>
            </div>
          </div>
        );
      }
      
      if (resultMatch) {
        return (
          <div key={index} className="p-3 bg-green-50 dark:bg-green-900/30 rounded-md ml-4 border-l-2 border-green-300 dark:border-green-600 my-3">
            <div className="flex items-center">
              <HiOutlineCheck className="text-green-600 dark:text-green-400 mr-2 flex-shrink-0 h-5 w-5" />
              <p className="text-green-700 dark:text-green-300 font-medium">{resultMatch[2]}</p>
            </div>
          </div>
        );
      }
      
      if (rulesMatch) {
        return (
          <div key={index} className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-md ml-4 border-l-2 border-indigo-300 dark:border-indigo-600 my-3">
            <div className="flex items-center">
              <HiOutlineDocumentText className="text-indigo-600 dark:text-indigo-400 mr-2 flex-shrink-0 h-5 w-5" />
              <span className="font-semibold text-indigo-700 dark:text-indigo-300 mr-2">{rulesMatch[1]}</span>
              <span className="text-indigo-800 dark:text-indigo-200">{rulesMatch[2]}</span>
            </div>
          </div>
        );
      }
      
      if (methodMatch) {
        return (
          <div key={index} className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-md ml-4 border-l-2 border-blue-300 dark:border-blue-600 my-3">
            <div className="flex items-center">
              <HiOutlineLightBulb className="text-blue-600 dark:text-blue-400 mr-2 flex-shrink-0 h-5 w-5" />
              <span className="font-semibold text-blue-700 dark:text-blue-300 mr-2">{methodMatch[1]}</span>
              <span className="text-blue-800 dark:text-blue-200">{methodMatch[2]}</span>
            </div>
          </div>
        );
      }
      
      if (observationMatch) {
        return (
          <div key={index} className="p-3 bg-cyan-50 dark:bg-cyan-900/30 rounded-md ml-4 border-l-2 border-cyan-300 dark:border-cyan-600 my-3">
            <div className="flex items-center">
              <HiOutlineInformationCircle className="text-cyan-600 dark:text-cyan-400 mr-2 flex-shrink-0 h-5 w-5" />
              <span className="font-semibold text-cyan-700 dark:text-cyan-300 mr-2">{observationMatch[1]}</span>
              <span className="text-cyan-800 dark:text-cyan-200">{observationMatch[2]}</span>
            </div>
          </div>
        );
      }
      
      if (verificationMatch) {
        return (
          <div key={index} className="p-3 bg-purple-50 dark:bg-purple-900/30 rounded-md ml-4 border-l-2 border-purple-300 dark:border-purple-600 my-2">
            <div className="flex items-center">
              <HiOutlineCheckCircle className="text-purple-600 dark:text-purple-400 mr-2 flex-shrink-0 h-5 w-5" />
              <span className="text-purple-700 dark:text-purple-300 font-medium">{step}</span>
            </div>
          </div>
        );
      }
      
      if (partialResultMatch) {
        return (
          <div key={index} className="p-3 bg-emerald-50 dark:bg-emerald-900/30 rounded-md ml-4 border-l-2 border-emerald-300 dark:border-emerald-600 my-3">
            <div className="flex items-center">
              <HiOutlineArrowRight className="text-emerald-600 dark:text-emerald-400 mr-2 flex-shrink-0 h-5 w-5" />
              <span className="font-semibold text-emerald-700 dark:text-emerald-300 mr-2">{partialResultMatch[1]}</span>
              <span className="text-emerald-800 dark:text-emerald-200">{partialResultMatch[2]}</span>
            </div>
          </div>
        );
      }
      
      if (finalResultMatch) {
        return (
          <div key={index} className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-md ml-4 border-l-2 border-indigo-300 dark:border-indigo-600 my-3">
            <div className="flex items-center">
              <HiOutlineDocumentText className="text-indigo-600 dark:text-indigo-400 mr-2 flex-shrink-0 h-5 w-5" />
              <span className="text-indigo-800 dark:text-indigo-200">Obter o resultado final</span>
            </div>
          </div>
        );
      }
      
      if (limitSubstitutionMatch) {
        return (
          <div key={index} className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-md ml-4 border-l-2 border-blue-300 dark:border-blue-600 my-3">
            <div className="flex items-center">
              <HiOutlineArrowRight className="text-blue-600 dark:text-blue-400 mr-2 flex-shrink-0 h-5 w-5" />
              <span className="text-blue-800 dark:text-blue-200">{step}</span>
            </div>
          </div>
        );
      }
      
      if (interpretationMatch) {
        return (
          <div key={index} className="p-3 bg-cyan-50 dark:bg-cyan-900/30 rounded-md ml-4 border-l-2 border-cyan-300 dark:border-cyan-600 my-3">
            <div className="flex items-center">
              <HiOutlineLightBulb className="text-cyan-600 dark:text-cyan-400 mr-2 flex-shrink-0 h-5 w-5" />
              <span className="text-cyan-800 dark:text-cyan-200">{step}</span>
            </div>
          </div>
        );
      }
      
      if (intermediateMatch || step.includes("Temos")) {
        return (
          <div key={index} className="p-3 bg-gray-50 dark:bg-gray-800/60 rounded-md ml-4 border-l-2 border-gray-300 dark:border-gray-600 my-3">
            <span className="text-gray-800 dark:text-gray-200">{step}</span>
          </div>
        );
      }
      
      if (subExpressionMatch) {
        return (
          <div key={index} className="p-3 bg-yellow-50 dark:bg-yellow-900/30 rounded-md ml-4 border-l-2 border-yellow-300 dark:border-yellow-600 my-3">
            <div className="flex items-start">
              <HiOutlineCalculator className="text-yellow-600 dark:text-yellow-400 mr-2 flex-shrink-0 h-5 w-5 mt-0.5" />
              <span className="font-semibold text-yellow-700 dark:text-yellow-300 mr-2">{subExpressionMatch[1]}</span>
              <span className="text-yellow-800 dark:text-yellow-200">{subExpressionMatch[2]}</span>
            </div>
          </div>
        );
      }
      
      if (simplificationMatch) {
        return (
          <div key={index} className="p-3 bg-amber-50 dark:bg-amber-900/30 rounded-md ml-4 border-l-2 border-amber-300 dark:border-amber-600 my-3">
            <div className="flex items-center">
              <HiOutlinePencil className="text-amber-600 dark:text-amber-400 mr-2 flex-shrink-0 h-5 w-5" />
              <span className="text-amber-800 dark:text-amber-200">{step}</span>
            </div>
          </div>
        );
      }
      
      if (observationPatternMatch) {
        return (
          <div key={index} className="p-3 bg-cyan-50 dark:bg-cyan-900/30 rounded-md ml-4 border-l-2 border-cyan-300 dark:border-cyan-600 my-3">
            <div className="flex items-center">
              <HiOutlineInformationCircle className="text-cyan-600 dark:text-cyan-400 mr-2 flex-shrink-0 h-5 w-5" />
              <span className="text-cyan-800 dark:text-cyan-200">{step.replace(/^\s\s/, '')}</span>
            </div>
          </div>
        );
      }
      
      if (termDetailMatch) {
        return (
          <div key={index} className="p-3 bg-yellow-50 dark:bg-yellow-900/30 rounded-md ml-4 border-l-2 border-yellow-300 dark:border-yellow-600 my-3">
            <div className="flex items-start">
              <HiOutlineCalculator className="text-yellow-600 dark:text-yellow-400 mr-2 flex-shrink-0 h-5 w-5 mt-0.5" />
              <span className="text-yellow-700 dark:text-yellow-300">{step.replace(/^\s\s/, '')}</span>
            </div>
          </div>
        );
      }
      
      if (propertyMatch) {
        return (
          <div key={index} className="p-3 bg-yellow-50 dark:bg-yellow-900/30 rounded-md ml-4 border-l-2 border-yellow-300 dark:border-yellow-600 my-3">
            <div className="flex items-center">
              <HiOutlineDocumentText className="text-yellow-600 dark:text-yellow-400 mr-2 flex-shrink-0 h-5 w-5" />
              <span className="font-semibold text-yellow-700 dark:text-yellow-300 mr-2">{propertyMatch[1]}</span>
              <span className="text-yellow-800 dark:text-yellow-200">{propertyMatch[2]}</span>
            </div>
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
            <div className="flex-grow h-px bg-gray-300 dark:bg-gray-600"></div>
            <div className="mx-4 px-4 py-2 bg-purple-100 dark:bg-purple-900/40 rounded-full text-purple-700 dark:text-purple-300 text-sm font-bold flex items-center">
              <HiOutlineCheckCircle className="mr-1" /> {t('translation:common.verification')}
            </div>
            <div className="flex-grow h-px bg-gray-300 dark:bg-gray-600"></div>
          </div>
        );
      }
      
      // Padrão para a equação ou inequação original
      const equationMatch = step.includes('Equação original:') || 
                           step.includes('Forma inicial:') || 
                           step.includes('Resolvendo a equação:') || 
                           step.includes('Expressão original:') ||
                           step.includes('Inequação original:');
      
      // Padrão para isolamento da variável
      const isolateMatch = step.includes('Isolando') || 
                          step.includes('variável') || 
                          step.includes('isolar') || 
                          step.includes('Isolar fatores') ||
                          step.includes('Isolando o termo:');
      
      // Padrão para operações com ambos os lados
      const operationMatch = step.includes('ambos os lados') || 
                            step.includes('os dois lados') || 
                            step.includes('Operando em ambos os lados') || 
                            step.includes('Operação:');
      
      // Padrão para combinação de termos semelhantes
      const likeTermsMatch = step.includes('termos semelhantes') || 
                             step.includes('coeficientes') || 
                             step.includes('simplificar') || 
                             step.includes('Simplificando:') || 
                             step.includes('Simplificando a divisão:') || 
                             step.includes('Combinando termos:') ||
                             step.includes('Agrupando termos');
      
      // Padrão para dividir por coeficiente
      const divideMatch = step.includes('dividir por') || 
                         step.includes('dividindo por') || 
                         step.includes('Dividindo ambos os lados por:');
      
      // Padrão para resultado final
      const resultMatch = step.includes('Resultado:') || 
                          step.includes('Solução final:') || 
                          step.includes('Valor de x:') || 
                          step.includes('Verificação concluída:') || 
                          step.includes('(Correto!)') || 
                          step.startsWith('Obter o resultado final') ||
                          step.includes('O valor satisfaz') ||
                          step.includes('O valor não satisfaz');
      
      // Padrão para verificação
      const checkMatch = step.includes('Verificando') || 
                         step.includes('Verificação:') || 
                         step.includes('Substituindo o valor') || 
                         step.includes('recuperamos a expressão original') ||
                         step.includes('substitui o valor');
      
      // Padrão para aplicação de regras e fórmulas
      const ruleMatch = step.includes('Aplicando a regra:') || 
                       step.includes('Regra aplicada:') || 
                       step.includes('Fórmula:');
      
      // Padrão para propriedades matemáticas
      const propertyMatch = step.includes('Propriedade:') || 
                           step.includes('distributiva') || 
                           step.includes('comutativa') || 
                           step.includes('associativa') || 
                           step.includes('igualdade') ||
                           step.includes('transitividade');
      
      // Padrão para métodos de resolução
      const methodMatch = step.includes('Método:') || 
                         step.includes('Técnica:') || 
                         step.includes('Estratégia:');
      
      // Padrão para análise da estrutura
      const analysisMatch = step.includes('Análise:') || 
                           step.includes('Identificando') || 
                           step.includes('Estrutura:') ||
                           step.includes('Tipo de inequação:');
      
      // Padrão para cálculos
      const calculatingMatch = step.includes('Calculando:') || 
                              step.includes('Computando:');
      
      // Padrão para observações
      const observationMatch = step.includes('Observação:') || 
                              step.includes('Nota:') ||
                              step.includes('Importante:');

      // Padrão para inversão de sinais em inequações
      const signChangeMatch = step.includes('inverter o sinal') || 
                              step.includes('mudança de sinal') || 
                              step.includes('Invertendo a desigualdade:') || 
                              step.includes('Trocando o sentido:');
      
      // Padrão para intervalos de solução em inequações
      const intervalMatch = step.includes('Intervalo de solução:') || 
                           step.includes('Conjunto solução:') || 
                           step.includes('Valores de x:') || 
                           step.includes('Representação do conjunto:');
      
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
      } else if (ruleMatch) {
        return (
          <div key={index} className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-md ml-4 border-l-2 border-indigo-300 dark:border-indigo-600 shadow-sm my-2">
            <div className="flex items-center">
              <HiOutlineDocumentText className="text-indigo-600 dark:text-indigo-400 mr-2 flex-shrink-0 h-5 w-5" />
              <p className="text-indigo-700 dark:text-indigo-300 font-medium">{step}</p>
            </div>
          </div>
        );
      } else if (propertyMatch) {
        return (
          <div key={index} className="p-3 bg-cyan-50 dark:bg-cyan-900/30 rounded-md ml-4 border-l-2 border-cyan-300 dark:border-cyan-600 shadow-sm my-2">
            <div className="flex items-center">
              <HiOutlineInformationCircle className="text-cyan-600 dark:text-cyan-400 mr-2 flex-shrink-0 h-5 w-5" />
              <p className="text-cyan-700 dark:text-cyan-300 font-medium">{step}</p>
            </div>
          </div>
        );
      } else if (methodMatch) {
        return (
          <div key={index} className="p-3 bg-purple-50 dark:bg-purple-900/30 rounded-md ml-4 border-l-2 border-purple-300 dark:border-purple-600 shadow-sm my-2">
            <div className="flex items-center">
              <HiOutlineLightBulb className="text-purple-600 dark:text-purple-400 mr-2 flex-shrink-0 h-5 w-5" />
              <p className="text-purple-700 dark:text-purple-300 font-medium">{step}</p>
            </div>
          </div>
        );
      } else if (analysisMatch) {
        return (
          <div key={index} className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-md ml-4 border-l-2 border-blue-300 dark:border-blue-600 shadow-sm my-2">
            <div className="flex items-center">
              <HiOutlinePencil className="text-blue-600 dark:text-blue-400 mr-2 flex-shrink-0 h-5 w-5" />
              <p className="text-blue-700 dark:text-blue-300 font-medium">{step}</p>
            </div>
          </div>
        );
      } else if (observationMatch) {
        return (
          <div key={index} className="p-3 bg-amber-50 dark:bg-amber-900/30 rounded-md ml-4 border-l-2 border-amber-300 dark:border-amber-600 shadow-sm my-2">
            <div className="flex items-center">
              <HiOutlineInformationCircle className="text-amber-600 dark:text-amber-400 mr-2 flex-shrink-0 h-5 w-5" />
              <p className="text-amber-700 dark:text-amber-300 font-medium">{step}</p>
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
      } else if (signChangeMatch) {
        return (
          <div key={index} className="p-3 bg-rose-50 dark:bg-rose-900/30 rounded-md ml-4 border-l-2 border-rose-300 dark:border-rose-600 shadow-sm my-2">
            <div className="flex items-center">
              <HiOutlineRefresh className="text-rose-600 dark:text-rose-400 mr-2 flex-shrink-0 h-5 w-5" />
              <p className="text-rose-700 dark:text-rose-300 font-medium">{step}</p>
            </div>
          </div>
        );
      } else if (intervalMatch) {
        return (
          <div key={index} className="p-3 bg-emerald-50 dark:bg-emerald-900/30 rounded-md ml-4 border-l-2 border-emerald-300 dark:border-emerald-600 shadow-sm my-2">
            <div className="flex items-center">
              <HiOutlineArrowsExpand className="text-emerald-600 dark:text-emerald-400 mr-2 flex-shrink-0 h-5 w-5" />
              <p className="text-emerald-700 dark:text-emerald-300 font-medium">{step}</p>
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
          <div key={index} className="p-3 bg-purple-50 dark:bg-purple-900/30 rounded-md ml-4 border-l-2 border-purple-300 dark:border-purple-600 my-2">
            <div className="flex items-center">
              <HiOutlineCheckCircle className="text-purple-600 dark:text-purple-400 mr-2 flex-shrink-0 h-5 w-5" />
              <span className="text-purple-700 dark:text-purple-300 font-medium">{step}</span>
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
            <p className="text-gray-800 dark:text-gray-200">{step}</p>
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
        step.includes('unidades cúbicas') ||
        step.startsWith('Resultado:');
      
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
          <div key={index} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md ml-4 border-l-2 border-gray-300 dark:border-gray-600 my-3">
            <p className="text-gray-800 dark:text-gray-200">{step}</p>
          </div>
        );
      }
    }

    // Se for um cálculo de porcentagem (namespace arithmetic)
    if (step.includes('percentage.steps') || step.includes('percentage.errors')) {
      // Verificar padrões comuns em passos de porcentagem que contêm chaves de tradução
      if (step.includes('original_equation')) {
      return (
          <div key={index} className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-md ml-4 border-l-2 border-blue-300 dark:border-blue-600 shadow-sm my-2">
            <div className="flex items-center">
              <HiOutlineDocumentText className="text-blue-600 dark:text-blue-400 mr-2 flex-shrink-0 h-5 w-5" />
              <p className="text-blue-700 dark:text-blue-300 font-medium">{step}</p>
            </div>
        </div>
      );
      } else if (step.includes('convert_percentage')) {
      return (
          <div key={index} className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-md ml-4 border-l-2 border-indigo-300 dark:border-indigo-600 shadow-sm my-2">
            <div className="flex items-center">
              <HiOutlineCalculator className="text-indigo-600 dark:text-indigo-400 mr-2 flex-shrink-0 h-5 w-5" />
              <p className="text-indigo-700 dark:text-indigo-300 font-medium">{step}</p>
            </div>
        </div>
      );
      } else if (step.includes('multiply_value') || step.includes('divide_value') || step.includes('calculate_difference')) {
      return (
          <div key={index} className="p-3 bg-yellow-50 dark:bg-yellow-900/30 rounded-md ml-4 border-l-2 border-yellow-300 dark:border-yellow-600 shadow-sm my-2">
            <div className="flex items-center">
              <HiOutlineCalculator className="text-yellow-600 dark:text-yellow-400 mr-2 flex-shrink-0 h-5 w-5" />
              <p className="text-yellow-700 dark:text-yellow-300 font-medium">{step}</p>
            </div>
        </div>
      );
      } else if (step.includes('verification.calculating')) {
      return (
          <div key={index} className="p-3 bg-purple-50 dark:bg-purple-900/30 rounded-md ml-4 border-l-2 border-purple-300 dark:border-purple-600 shadow-sm my-2 mt-4">
            <div className="flex items-center">
              <HiOutlineCalculator className="text-purple-600 dark:text-purple-400 mr-2 flex-shrink-0 h-5 w-5" />
              <p className="text-purple-700 dark:text-purple-300 font-medium">{step}</p>
            </div>
        </div>
      );
      } else if (step.includes('verification.simplifying')) {
      return (
          <div key={index} className="p-3 bg-purple-50 dark:bg-purple-900/30 rounded-md ml-4 border-l-2 border-purple-300 dark:border-purple-600 shadow-sm my-2">
            <div className="flex items-center">
              <HiOutlineRefresh className="text-purple-600 dark:text-purple-400 mr-2 flex-shrink-0 h-5 w-5" />
              <p className="text-purple-700 dark:text-purple-300 font-medium">{step}</p>
            </div>
        </div>
      );
      } else if (step.includes('verification.completed')) {
        // Extract the verification message from the format 'verification.completed: {translated text}: ✓'
        const verificationCompletedRegex = /verification\.completed:\s+(.*?)$/;
        const verificationCompletedMatch = step.match(verificationCompletedRegex);
        
        let displayText = '';
        if (verificationCompletedMatch && verificationCompletedMatch[1]) {
          displayText = verificationCompletedMatch[1];
        } else {
          // Fallback in case regex doesn't match
          displayText = step.replace('verification.completed: ', '');
        }
        
      return (
          <div key={index} className="p-3 bg-green-50 dark:bg-green-900/30 rounded-md ml-4 border-l-2 border-green-300 dark:border-green-600 shadow-sm my-2 font-bold">
            <div className="flex items-center">
              <HiOutlineCheck className="text-green-600 dark:text-green-400 mr-2 flex-shrink-0 h-5 w-5" />
              <p className="text-green-700 dark:text-green-300 font-medium">{displayText}</p>
            </div>
        </div>
      );
      } else if (step.includes('common.result')) {
      return (
          <div key={index} className="p-3 bg-green-50 dark:bg-green-900/30 rounded-md ml-4 border-l-2 border-green-300 dark:border-green-600 shadow-sm my-2">
            <div className="flex items-center">
              <HiOutlineCheck className="text-green-600 dark:text-green-400 mr-2 flex-shrink-0 h-5 w-5" />
              <p className="text-green-700 dark:text-green-300 font-medium">{step}</p>
            </div>
        </div>
      );
      } else if (step.includes('error')) {
      return (
          <div key={index} className="p-3 bg-red-50 dark:bg-red-900/30 rounded-md ml-4 border-l-2 border-red-300 dark:border-red-600 shadow-sm my-2">
            <div className="flex items-center">
              <HiOutlineInformationCircle className="text-red-600 dark:text-red-400 mr-2 flex-shrink-0 h-5 w-5" />
              <p className="text-red-700 dark:text-red-300 font-medium">{step}</p>
            </div>
        </div>
      );
      }
    }

    // Verificar padrão de verificação concluída com chave de tradução no início, que pode ter sido perdida
    if (typeof step === 'string' && step.startsWith('verification.completed:')) {
      const cleanedStep = step.replace(/^verification\.completed:\s+/, '');
      
      // Limpar qualquer sintaxe de handlebars restante
      let displayText = cleanedStep;
      if (displayText.includes('{{operation')) {
        displayText = displayText.replace(/{{operation.*?}}/, '').trim();
      }
      
      return (
        <div key={index} className="p-3 bg-green-50 dark:bg-green-900/30 rounded-md ml-4 border-l-2 border-green-300 dark:border-green-600 shadow-sm my-2 font-bold">
          <div className="flex items-center">
            <HiOutlineCheck className="text-green-600 dark:text-green-400 mr-2 flex-shrink-0 h-5 w-5" />
            <p className="text-green-700 dark:text-green-300 font-medium">{displayText}</p>
          </div>
        </div>
      );
    }

    // Estilo padrão para passos regulares se nenhum dos padrões acima correspondeu
    return (
      <div key={index} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md border-l-4 border-gray-300 dark:border-gray-600 my-2">
        <span className="text-gray-700 dark:text-gray-300">{step}</span>
      </div>
    );
  };

  return (
    <div className="space-y-2">
      {steps.map((step, index) => 
        customRenderStep ? customRenderStep(step, index) : defaultRenderStep(step, index)
      )}
    </div>
  );
};

export default StepByStepExplanation; 