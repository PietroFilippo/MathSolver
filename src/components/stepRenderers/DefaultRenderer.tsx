import React, { ReactNode } from 'react';
import { 
  HiOutlineDocumentText, 
  HiOutlineCalculator,
  HiOutlineCheck,
  HiOutlineCheckCircle,
  HiOutlineRefresh,
} from 'react-icons/hi';
import { useTranslation } from 'react-i18next';
import { cleanVerificationStep } from './utils';

interface DefaultRendererProps {
  step: string | ReactNode;
  index: number;
}

const DefaultRenderer: React.FC<DefaultRendererProps> = ({ step, index }) => {
  const { t } = useTranslation(['arithmetic', 'translation']);

  if (typeof step !== 'string') {
    return <div key={index} className="p-3 bg-theme-container dark:bg-gray-800 rounded-md">{step}</div>;
  }

  // Handle para separador de verificação
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

  // Handle para cabeçalho de verificação
  if (
    step === 'verification' || 
    step === 'translation:verification' || 
    step === 'common.verification'
  ) {
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

  // Handle para padrão de passo comum
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

  // Handle para padrão de equação original
  const originalEquationRegex = /(solvers\..+\.steps\.original_equation|arithmetic:percentage\.steps\..+\.original_equation|Original equation|Equação original):(.*)/;
  const originalEquationMatch = step.match(originalEquationRegex);
  if (originalEquationMatch) {
    return (
      <div key={index} className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-md ml-4 border-l-2 border-blue-300 dark:border-blue-600 shadow-sm my-2">
        <div className="flex items-center">
          <HiOutlineDocumentText className="text-blue-600 dark:text-blue-400 mr-2 flex-shrink-0 h-5 w-5" />
          <p className="text-blue-700 dark:text-blue-300 font-medium">{step}</p>
        </div>
      </div>
    );
  }

  // Handle para padrão de cabeçalho de verificação
  const verificationRegex = /(common\.verification|Verification|Verificação|translation:common\.verification):(.*)/;
  const verificationMatch = step.match(verificationRegex);
  if (verificationMatch || 
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

  // Handle para padrão de cálculo
  const calculatingRegex = /(solvers\..+\.steps\..+\.calculating|arithmetic:percentage\.steps\..+\.calculating|Calculating|Calculando):(.*)/;
  const calculatingMatch = step.match(calculatingRegex);
  if (calculatingMatch) {
    return (
      <div key={index} className="p-3 bg-orange-50 dark:bg-orange-900/30 rounded-md ml-4 border-l-2 border-orange-300 dark:border-orange-600 shadow-sm my-2">
        <div className="flex items-center">
          <HiOutlineCalculator className="text-orange-600 dark:text-orange-400 mr-2 flex-shrink-0 h-5 w-5" />
          <p className="text-orange-700 dark:text-orange-300 font-medium">{step}</p>
        </div>
      </div>
    );
  }

  // Handle para padrão de simplificação
  const simplifyingRegex = /(solvers\..+\.steps\..+\.simplifying|arithmetic:percentage\.steps\..+\.simplifying|Simplifying|Simplificando):(.*)/;
  const simplifyingMatch = step.match(simplifyingRegex);
  if (simplifyingMatch) {
    return (
      <div key={index} className="p-3 bg-teal-50 dark:bg-teal-900/30 rounded-md ml-4 border-l-2 border-teal-300 dark:border-teal-600 shadow-sm my-2">
        <div className="flex items-center">
          <HiOutlineRefresh className="text-teal-600 dark:text-teal-400 mr-2 flex-shrink-0 h-5 w-5" />
          <p className="text-teal-700 dark:text-teal-300 font-medium">{step}</p>
        </div>
      </div>
    );
  }

  // Handle para padrão de resultado
  const resultRegex = /(common\.result|translation:common\.result|Result|Resultado):(.*)/;
  const resultMatch = step.match(resultRegex);
  if (resultMatch) {
    return (
      <div key={index} className="p-3 bg-green-50 dark:bg-green-900/30 rounded-md ml-4 border-l-2 border-green-300 dark:border-green-600 shadow-sm my-2">
        <div className="flex items-center">
          <HiOutlineCheck className="text-green-600 dark:text-green-400 mr-2 flex-shrink-0 h-5 w-5" />
          <p className="text-green-700 dark:text-green-300 font-medium">{step}</p>
        </div>
      </div>
    );
  }

  // Handle para padrão de verificação concluída
  const verificationCompletedRegex = /(solvers\..+\.steps\..+\.verification\.completed|arithmetic:percentage\.steps\..+\.verification\.completed|Verification completed|Verificação concluída):(.*)/;
  const verificationCompletedMatch = step.match(verificationCompletedRegex);
  if (verificationCompletedMatch || 
      (step.includes('verification.completed') || 
       step.includes('Verification completed') ||
       step.includes('Verificação concluída')) && 
      (step.includes('✓') || step.includes('(Correct!)') || step.includes('{{#if'))){

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

  // Renderização padrão para outros passos
  return (
    <div key={index} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md border-l-4 border-gray-300 dark:border-gray-600 my-2">
      <span className="text-gray-700 dark:text-gray-300">{step}</span>
    </div>
  );
};

export default DefaultRenderer; 