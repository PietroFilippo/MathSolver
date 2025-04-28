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
  HiOutlineArrowsExpand,
  HiOutlinePencil,
} from 'react-icons/hi';
import { useTranslation } from 'react-i18next';
import { cleanVerificationStep } from './utils';

interface LinearRendererProps {
  step: string | ReactNode;
  index: number;
}

const LinearRenderer: React.FC<LinearRendererProps> = ({ step, index }) => {
  const { t } = useTranslation(['arithmetic', 'translation']);

  if (typeof step !== 'string') {
    return <div key={index} className="p-3 bg-theme-container dark:bg-gray-800 rounded-md">{step}</div>;
  }

  // Handle para separador de verificação
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

  // Padrão para verificação concluída - sempre verifique isso primeiro para capturar todos os padrões de verification.completed
  if (typeof step === 'string' && (
      step.startsWith('verification.completed:') || 
      step.includes('{{#if isCorrect}}') || 
      step.includes('{{#if correct}}') ||
      step.includes('Verification completed:') ||
      step.includes('Verificação concluída:')
    )) {
    const cleanedStep = cleanVerificationStep(step);
    
    return (
      <div key={index} className="p-3 bg-green-50 dark:bg-green-900/30 rounded-md ml-4 border-l-2 border-green-300 dark:border-green-600 shadow-sm my-2 font-bold">
        <div className="flex items-center">
          <HiOutlineCheck className="text-green-600 dark:text-green-400 mr-2 flex-shrink-0 h-5 w-5" />
          <p className="text-green-700 dark:text-green-300 font-medium">{cleanedStep}</p>
        </div>
      </div>
    );
  }

  // Handle para cabeçalho de passo
  const stepMatch = step.match(/^(Passo \d+:|Step \d+:)(.*)$/);
  if (stepMatch) {
    const [_, stepNumber, stepContent] = stepMatch;
    return (
      <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-md border-l-4 border-indigo-500 dark:border-indigo-600 shadow-sm my-3">
        <div className="flex flex-col sm:flex-row">
          <span className="font-bold text-indigo-700 dark:text-indigo-300 mr-2 mb-1 sm:mb-0">{stepNumber}</span>
          <p className="text-gray-800 dark:text-gray-200">{stepContent}</p>
        </div>
      </div>
    );
  }

  // Handle para padrão de passo comum (para conteúdo traduzido)
  const commonStepRegex = /^(common\.step|Step|Passo|translation:common\.step) (\d+):(.*)/;
  const commonStepMatch = step.match(commonStepRegex);
  if (commonStepMatch) {
    const [_, stepPrefix, stepNumber, content] = commonStepMatch;
    return (
      <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-md border-l-4 border-indigo-500 dark:border-indigo-600 shadow-sm my-3">
        <div className="flex flex-col sm:flex-row">
          <span className="font-bold text-indigo-700 dark:text-indigo-300 mr-2 mb-1 sm:mb-0">{t('translation:common.step')} {stepNumber}:</span>
          <p className="text-gray-800 dark:text-gray-200">{content.trim()}</p>
        </div>
      </div>
    );
  }

  // Padrão para equação ou inequação
  const equationMatch = step.includes('Equação original:') || 
                         step.includes('Forma inicial:') || 
                         step.includes('Resolvendo a equação:') || 
                         step.includes('Expressão original:') ||
                         step.includes('Inequação original:') ||
                         step.includes('Original equation:') ||
                         step.includes('Initial form:') ||
                         step.includes('Solving the equation:') ||
                         step.includes('Original expression:') ||
                         step.includes('Original inequality:');

  if (equationMatch) {
    return (
      <div key={index} className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-md ml-4 border-l-2 border-blue-300 dark:border-blue-600 shadow-sm my-2">
        <div className="flex items-center">
          <HiOutlineDocumentText className="text-blue-600 dark:text-blue-400 mr-2 flex-shrink-0 h-5 w-5" />
          <p className="text-blue-700 dark:text-blue-300 font-medium">{step}</p>
        </div>
      </div>
    );
  }

  // Padrão para isolar variável
  const isolateMatch = step.includes('Isolando') || 
                       step.includes('variável') || 
                       step.includes('isolar') || 
                       step.includes('Isolar fatores') ||
                       step.includes('Isolando o termo:') ||
                       step.includes('Isolating') || 
                       step.includes('variable') || 
                       step.includes('isolate') || 
                       step.includes('Isolate factors') ||
                       step.includes('Isolating the term:');

  if (isolateMatch) {
    return (
      <div key={index} className="p-3 bg-violet-50 dark:bg-violet-900/30 rounded-md ml-4 border-l-2 border-violet-300 dark:border-violet-600 shadow-sm my-2">
        <div className="flex items-center">
          <HiOutlineArrowsExpand className="text-violet-600 dark:text-violet-400 mr-2 flex-shrink-0 h-5 w-5" />
          <p className="text-violet-700 dark:text-violet-300 font-medium">{step}</p>
        </div>
      </div>
    );
  }

  // Padrão para operações em ambos os lados
  const operationMatch = step.includes('ambos os lados') || 
                         step.includes('os dois lados') || 
                         step.includes('Operando em ambos os lados') || 
                         step.includes('Operação:') ||
                         step.includes('both sides') || 
                         step.includes('both the sides') || 
                         step.includes('Operating on both sides') || 
                         step.includes('Operation:');

  if (operationMatch) {
    return (
      <div key={index} className="p-3 bg-amber-50 dark:bg-amber-900/30 rounded-md ml-4 border-l-2 border-amber-300 dark:border-amber-600 shadow-sm my-2">
        <div className="flex items-center">
          <HiOutlineCube className="text-amber-600 dark:text-amber-400 mr-2 flex-shrink-0 h-5 w-5" />
          <p className="text-amber-700 dark:text-amber-300 font-medium">{step}</p>
        </div>
      </div>
    );
  }

  // Padrão para combinar termos semelhantes
  const likeTermsMatch = step.includes('termos semelhantes') || 
                         step.includes('coeficientes') || 
                         step.includes('simplificar') || 
                         step.includes('Simplificando:') || 
                         step.includes('Simplificando a divisão:') || 
                         step.includes('Combinando termos:') ||
                         step.includes('Agrupando termos') ||
                         step.includes('like terms') || 
                         step.includes('coefficients') || 
                         step.includes('simplify') || 
                         step.includes('Simplifying:') || 
                         step.includes('Simplifying the division:') || 
                         step.includes('Combining terms:') ||
                         step.includes('Grouping terms');

  if (likeTermsMatch) {
    return (
      <div key={index} className="p-3 bg-teal-50 dark:bg-teal-900/30 rounded-md ml-4 border-l-2 border-teal-300 dark:border-teal-600 shadow-sm my-2">
        <div className="flex items-center">
          <HiOutlineRefresh className="text-teal-600 dark:text-teal-400 mr-2 flex-shrink-0 h-5 w-5" />
          <p className="text-teal-700 dark:text-teal-300 font-medium">{step}</p>
        </div>
      </div>
    );
  }

  // Padrão para divisão por coeficiente
  const divideMatch = step.includes('dividir por') || 
                     step.includes('dividindo por') || 
                     step.includes('Dividindo ambos os lados por:') ||
                     step.includes('divide by') || 
                     step.includes('dividing by') || 
                     step.includes('Dividing both sides by:');

  if (divideMatch) {
    return (
      <div key={index} className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-md ml-4 border-l-2 border-indigo-300 dark:border-indigo-600 shadow-sm my-2">
        <div className="flex items-center">
          <HiOutlineCalculator className="text-indigo-600 dark:text-indigo-400 mr-2 flex-shrink-0 h-5 w-5" />
          <p className="text-indigo-700 dark:text-indigo-300 font-medium">{step}</p>
        </div>
      </div>
    );
  }

  // Padrão para resultado final
  const resultMatch = step.includes('Resultado:') || 
                      step.includes('Solução final:') || 
                      step.includes('Valor de x:') || 
                      step.includes('Verificação concluída:') || 
                      step.includes('(Correto!)') || 
                      step.startsWith('Obter o resultado final') ||
                      step.includes('O valor satisfaz') ||
                      step.includes('O valor não satisfaz') ||
                      step.includes('Result:') || 
                      step.includes('Final solution:') || 
                      step.includes('Value of x:') || 
                      step.includes('Verification completed:') || 
                      step.includes('(Correct!)') || 
                      step.startsWith('Get the final result') ||
                      step.includes('The value satisfies') ||
                      step.includes('The value does not satisfy');

  if (resultMatch) {
    return (
      <div key={index} className="p-3 bg-green-50 dark:bg-green-900/30 rounded-md ml-4 border-l-2 border-green-300 dark:border-green-600 shadow-sm my-2 font-bold">
        <div className="flex items-center">
          <HiOutlineCheck className="text-green-600 dark:text-green-400 mr-2 flex-shrink-0 h-5 w-5" />
          <p className="text-green-700 dark:text-green-300 font-medium">{step}</p>
        </div>
      </div>
    );
  }

  // Padrão para verificação
  const checkMatch = step.includes('Verificando') || 
                    step.includes('Verificação:') || 
                    step.includes('Substituindo o valor') || 
                    step.includes('recuperamos a expressão original') ||
                    step.includes('substitui o valor') ||
                    step.includes('Verifying') || 
                    step.includes('Verification:') || 
                    step.includes('Substituting the value') || 
                    step.includes('we recover the original expression') ||
                    step.includes('Verificação do resultado') || 
                    step.includes('Verification of the result') || 
                    step.includes('substitutes the value');

  if (checkMatch) {
    return (
      <div key={index} className="p-3 bg-purple-50 dark:bg-purple-900/30 rounded-md ml-4 border-l-2 border-purple-300 dark:border-purple-600 shadow-sm my-2 mt-4">
        <div className="flex items-center">
          <HiOutlineCheck className="text-purple-600 dark:text-purple-400 mr-2 flex-shrink-0 h-5 w-5" />
          <p className="text-purple-700 dark:text-purple-300 font-medium">{step}</p>
        </div>
      </div>
    );
  }

  // Padrão para aplicar regras e fórmulas
  const ruleMatch = step.includes('Aplicando a regra:') || 
                   step.includes('Regra aplicada:') || 
                   step.includes('Fórmula:') ||
                   step.includes('Applying the rule:') || 
                   step.includes('Rule applied:') || 
                   step.includes('Formula:');

  if (ruleMatch) {
    return (
      <div key={index} className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-md ml-4 border-l-2 border-indigo-300 dark:border-indigo-600 shadow-sm my-2">
        <div className="flex items-center">
          <HiOutlineDocumentText className="text-indigo-600 dark:text-indigo-400 mr-2 flex-shrink-0 h-5 w-5" />
          <p className="text-indigo-700 dark:text-indigo-300 font-medium">{step}</p>
        </div>
      </div>
    );
  }

  // Padrão para propriedades matemáticas
  const propertyMatch = step.includes('Propriedade:') || 
                       step.includes('distributiva') || 
                       step.includes('comutativa') || 
                       step.includes('associativa') || 
                       step.includes('igualdade') ||
                       step.includes('transitividade') ||
                       step.includes('Property:') || 
                       step.includes('distributive') || 
                       step.includes('commutative') || 
                       step.includes('associative') || 
                       step.includes('equality') ||
                       step.includes('transitivity');

  if (propertyMatch) {
    return (
      <div key={index} className="p-3 bg-cyan-50 dark:bg-cyan-900/30 rounded-md ml-4 border-l-2 border-cyan-300 dark:border-cyan-600 shadow-sm my-2">
        <div className="flex items-center">
          <HiOutlineInformationCircle className="text-cyan-600 dark:text-cyan-400 mr-2 flex-shrink-0 h-5 w-5" />
          <p className="text-cyan-700 dark:text-cyan-300 font-medium">{step}</p>
        </div>
      </div>
    );
  }

  // Padrão para métodos de solução
  const methodMatch = step.includes('Método:') || 
                     step.includes('Técnica:') || 
                     step.includes('Estratégia:') ||
                     step.includes('Method:') || 
                     step.includes('Technique:') || 
                     step.includes('Strategy:');

  if (methodMatch) {
    return (
      <div key={index} className="p-3 bg-purple-50 dark:bg-purple-900/30 rounded-md ml-4 border-l-2 border-purple-300 dark:border-purple-600 shadow-sm my-2">
        <div className="flex items-center">
          <HiOutlineLightBulb className="text-purple-600 dark:text-purple-400 mr-2 flex-shrink-0 h-5 w-5" />
          <p className="text-purple-700 dark:text-purple-300 font-medium">{step}</p>
        </div>
      </div>
    );
  }

  // Padrão para análise de estrutura
  const analysisMatch = step.includes('Análise:') || 
                       step.includes('Identificando') || 
                       step.includes('Estrutura:') ||
                       step.includes('Tipo de inequação:') ||
                       step.includes('Analysis:') || 
                       step.includes('Identifying') || 
                       step.includes('Structure:') ||
                       step.includes('Type of inequality:');

  if (analysisMatch) {
    return (
      <div key={index} className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-md ml-4 border-l-2 border-blue-300 dark:border-blue-600 shadow-sm my-2">
        <div className="flex items-center">
          <HiOutlinePencil className="text-blue-600 dark:text-blue-400 mr-2 flex-shrink-0 h-5 w-5" />
          <p className="text-blue-700 dark:text-blue-300 font-medium">{step}</p>
        </div>
      </div>
    );
  }

  // Padrão para cálculos
  const calculatingMatch = step.includes('Calculando:') || 
                          step.includes('Computando:') ||
                          step.includes('Calculating:') || 
                          step.includes('Computing:');

  if (calculatingMatch) {
    return (
      <div key={index} className="p-3 bg-amber-50 dark:bg-amber-900/30 rounded-md ml-4 border-l-2 border-amber-300 dark:border-amber-600 shadow-sm my-2">
        <div className="flex items-center">
          <HiOutlineCalculator className="text-amber-600 dark:text-amber-400 mr-2 flex-shrink-0 h-5 w-5" />
          <p className="text-amber-700 dark:text-amber-300 font-medium">{step}</p>
        </div>
      </div>
    );
  }

  // Padrão para observações
  const observationMatch = step.includes('Observação:') || 
                          step.includes('Nota:') ||
                          step.includes('Importante:') ||
                          step.includes('Observation:') || 
                          step.includes('Note:') ||
                          step.includes('Important:');

  if (observationMatch) {
    return (
      <div key={index} className="p-3 bg-amber-50 dark:bg-amber-900/30 rounded-md ml-4 border-l-2 border-amber-300 dark:border-amber-600 shadow-sm my-2">
        <div className="flex items-center">
          <HiOutlineInformationCircle className="text-amber-600 dark:text-amber-400 mr-2 flex-shrink-0 h-5 w-5" />
          <p className="text-amber-700 dark:text-amber-300 font-medium">{step}</p>
        </div>
      </div>
    );
  }

  // Verifica padrões específicos de porcentagem (para tradução)
  if (step.includes('percentage.steps') || step.includes('percentage.errors')) {
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
      const cleanedStep = cleanVerificationStep(step);
      
      return (
        <div key={index} className="p-3 bg-green-50 dark:bg-green-900/30 rounded-md ml-4 border-l-2 border-green-300 dark:border-green-600 shadow-sm my-2 font-bold">
          <div className="flex items-center">
            <HiOutlineCheck className="text-green-600 dark:text-green-400 mr-2 flex-shrink-0 h-5 w-5" />
            <p className="text-green-700 dark:text-green-300 font-medium">{cleanedStep}</p>
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
    }
  }

  // Renderização padrão para outros passos
  return (
    <div key={index} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md ml-4 border-l-2 border-gray-300 dark:border-gray-600 my-3">
      <p className="text-gray-800 dark:text-gray-200">{step}</p>
    </div>
  );
};

export default LinearRenderer; 