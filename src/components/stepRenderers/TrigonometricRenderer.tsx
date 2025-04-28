import React, { ReactNode } from 'react';
import { 
  HiOutlineCalculator,
  HiOutlineCheck,
  HiOutlineDocumentText,
  HiOutlineLibrary,
  HiOutlineClock,
  HiOutlineChartPie,
  HiOutlineRefresh,
  HiOutlineLightningBolt,
  HiOutlineChevronRight,
  HiOutlineCheckCircle
} from 'react-icons/hi';
import { useTranslation } from 'react-i18next';
import { cleanVerificationStep } from './utils';

interface TrigonometricRendererProps {
  step: string | ReactNode;
  index: number;
}

const TrigonometricRenderer: React.FC<TrigonometricRendererProps> = ({ step, index }) => {
  const { t } = useTranslation(['translation']);

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

  // Handle para cabeçalho de passo
  const stepMatch = step.match(/^(Passo \d+:|Step \d+:)(.*)$/);
  if (stepMatch) {
    const [_, stepNumber, stepContent] = stepMatch;
    return (
      <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-md border-l-4 border-indigo-500 dark:border-indigo-600 my-3">
        <div className="flex flex-col sm:flex-row">
          <span className="font-bold text-indigo-700 dark:text-indigo-300 mr-2 mb-1 sm:mb-0">{stepNumber}</span>
          <p className="text-gray-800 dark:text-gray-200">{stepContent}</p>
        </div>
      </div>
    );
  }

  // Padrão para passo comum (traduzido)
  const commonStepRegex = /^(common\.step|Step|Passo|translation:common\.step) (\d+):(.*)/;
  const commonStepMatch = step.match(commonStepRegex);
  if (commonStepMatch) {
    const [_, stepPrefix, stepNumber, content] = commonStepMatch;
    return (
      <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-md border-l-4 border-indigo-500 dark:border-indigo-600 my-3">
        <div className="flex flex-col sm:flex-row">
          <span className="font-bold text-indigo-700 dark:text-indigo-300 mr-2 mb-1 sm:mb-0">{t('translation:common.step')} {stepNumber}:</span>
          <p className="text-gray-800 dark:text-gray-200">{content.trim()}</p>
        </div>
      </div>
    );
  }

  // Expressão original
  const originalExpressionMatch = step.match(/^(Expressão original:|Expressão trigonométrica:|Equação original:|Original expression:|Trigonometric expression:|Original equation:)(.*)$/);
  if (originalExpressionMatch) {
    return (
      <div key={index} className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-md ml-4 border-l-2 border-blue-300 dark:border-blue-600 my-2">
        <div className="flex items-center">
          <HiOutlineDocumentText className="text-blue-600 dark:text-blue-400 mr-2 flex-shrink-0 h-5 w-5" />
          <span className="font-semibold text-blue-700 dark:text-blue-300 mr-2">{originalExpressionMatch[1]}</span>
          <span className="text-blue-800 dark:text-blue-200">{originalExpressionMatch[2]}</span>
        </div>
      </div>
    );
  }

  // Identidade trigonométrica
  const identityMatch = step.match(/^(Identidade trigonométrica:|Aplicando identidade:|Trigonometric identity:|Applying identity:)(.*)$/);
  if (identityMatch || step.includes('identidade') || step.includes('relação fundamental') ||
      step.includes('identity') || step.includes('fundamental relation')) {
    return (
      <div key={index} className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-md ml-4 border-l-2 border-indigo-300 dark:border-indigo-600 my-2">
        <div className="flex items-center">
          <HiOutlineLibrary className="text-indigo-600 dark:text-indigo-400 mr-2 flex-shrink-0 h-5 w-5" />
          <span className="text-indigo-700 dark:text-indigo-300 font-medium">{step}</span>
        </div>
      </div>
    );
  }

  // Medida do ângulo
  const angleMatch = step.match(/^(Ângulo:|Medida do ângulo:|Convertendo para|Angle:|Angle measure:|Converting to)(.*)$/);
  if (angleMatch || step.includes('radianos') || step.includes('graus') || step.includes('ângulo') ||
      step.includes('radians') || step.includes('degrees') || step.includes('angle')) {
    return (
      <div key={index} className="p-3 bg-amber-50 dark:bg-amber-900/30 rounded-md ml-4 border-l-2 border-amber-300 dark:border-amber-600 my-2">
        <div className="flex items-center">
          <HiOutlineClock className="text-amber-600 dark:text-amber-400 mr-2 flex-shrink-0 h-5 w-5" />
          <span className="text-amber-700 dark:text-amber-300 font-medium">{step}</span>
        </div>
      </div>
    );
  }

  // Função seno
  const sineMatch = step.match(/^(Calculando seno:|sen\(|Calculating sine:|sin\()(.*)$/);
  if (sineMatch || step.includes('sen(') || step.includes('sin(') || 
      (step.includes('seno') && !step.includes('cosseno')) || 
      (step.includes('sine') && !step.includes('cosine'))) {
    return (
      <div key={index} className="p-3 bg-purple-50 dark:bg-purple-900/30 rounded-md ml-4 border-l-2 border-purple-300 dark:border-purple-600 my-2">
        <div className="flex items-center">
          <HiOutlineChartPie className="text-purple-600 dark:text-purple-400 mr-2 flex-shrink-0 h-5 w-5" />
          <span className="text-purple-700 dark:text-purple-300 font-medium">{step}</span>
        </div>
      </div>
    );
  }

  // Função cosseno
  const cosineMatch = step.match(/^(Calculando cosseno:|cos\(|Calculating cosine:|cos\()(.*)$/);
  if (cosineMatch || step.includes('cos(') || step.includes('cosseno') || 
      step.includes('cosine')) {
    return (
      <div key={index} className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-md ml-4 border-l-2 border-blue-300 dark:border-blue-600 my-2">
        <div className="flex items-center">
          <HiOutlineChartPie className="text-blue-600 dark:text-blue-400 mr-2 flex-shrink-0 h-5 w-5" />
          <span className="text-blue-700 dark:text-blue-300 font-medium">{step}</span>
        </div>
      </div>
    );
  }

  // Função tangente
  const tangentMatch = step.match(/^(Calculando tangente:|tan\(|tg\(|Calculating tangent:|tan\(|tg\()(.*)$/);
  if (tangentMatch || step.includes('tan(') || step.includes('tg(') || 
      step.includes('tangente') || step.includes('tangent')) {
    return (
      <div key={index} className="p-3 bg-teal-50 dark:bg-teal-900/30 rounded-md ml-4 border-l-2 border-teal-300 dark:border-teal-600 my-2">
        <div className="flex items-center">
          <HiOutlineChartPie className="text-teal-600 dark:text-teal-400 mr-2 flex-shrink-0 h-5 w-5" />
          <span className="text-teal-700 dark:text-teal-300 font-medium">{step}</span>
        </div>
      </div>
    );
  }

  // Outras funções trigonométricas (secante, cossecante, cotangente)
  const otherTrigMatch = step.match(/^(Calculando secante:|Calculando cossecante:|Calculando cotangente:|sec\(|csc\(|cossec\(|cotg\(|cot\(|Calculating secant:|Calculating cosecant:|Calculating cotangent:|sec\(|csc\(|cot\()(.*)$/);
  if (otherTrigMatch || step.includes('sec(') || step.includes('csc(') || step.includes('cot(') || 
      step.includes('secante') || step.includes('cossecante') || step.includes('cotangente') ||
      step.includes('secant') || step.includes('cosecant') || step.includes('cotangent')) {
    return (
      <div key={index} className="p-3 bg-violet-50 dark:bg-violet-900/30 rounded-md ml-4 border-l-2 border-violet-300 dark:border-violet-600 my-2">
        <div className="flex items-center">
          <HiOutlineChartPie className="text-violet-600 dark:text-violet-400 mr-2 flex-shrink-0 h-5 w-5" />
          <span className="text-violet-700 dark:text-violet-300 font-medium">{step}</span>
        </div>
      </div>
    );
  }

  // Funções trigonométricas inversas
  const inverseTrigMatch = step.match(/^(Calculando (arcseno|arccosseno|arctangente|arcsen|arccos|arctan):|arcsen\(|arccos\(|arctan\(|sen⁻¹\(|cos⁻¹\(|tan⁻¹\(|Calculating (arcsine|arccosine|arctangent):|arcsin\(|arccos\(|arctan\(|sin⁻¹\(|cos⁻¹\(|tan⁻¹\()(.*)$/);
  if (inverseTrigMatch || step.includes('arcsen') || step.includes('arccos') || step.includes('arctan') || 
      step.includes('arcseno') || step.includes('arccosseno') || step.includes('arctangente') ||
      step.includes('sen⁻¹') || step.includes('cos⁻¹') || step.includes('tan⁻¹') ||
      step.includes('arcsin') || step.includes('arcsine') || step.includes('arccosine') || 
      step.includes('arctangent') || step.includes('sin⁻¹')) {
    return (
      <div key={index} className="p-3 bg-emerald-50 dark:bg-emerald-900/30 rounded-md ml-4 border-l-2 border-emerald-300 dark:border-emerald-600 my-2">
        <div className="flex items-center">
          <HiOutlineRefresh className="text-emerald-600 dark:text-emerald-400 mr-2 flex-shrink-0 h-5 w-5" />
          <span className="text-emerald-700 dark:text-emerald-300 font-medium">{step}</span>
        </div>
      </div>
    );
  }

  // Simplificação
  const simplificationMatch = step.match(/^(Simplificando:|Simplificação:|Simplifying:|Simplification:)(.*)$/);
  if (simplificationMatch || step.includes('simplificar') || step.includes('simplificação') ||
      step.includes('simplify') || step.includes('simplification')) {
    return (
      <div key={index} className="p-3 bg-yellow-50 dark:bg-yellow-900/30 rounded-md ml-4 border-l-2 border-yellow-300 dark:border-yellow-600 my-2">
        <div className="flex items-center">
          <HiOutlineChevronRight className="text-yellow-600 dark:text-yellow-400 mr-2 flex-shrink-0 h-5 w-5" />
          <span className="text-yellow-700 dark:text-yellow-300 font-medium">{step}</span>
        </div>
      </div>
    );
  }

  // Substituição
  const substitutionMatch = step.match(/^(Substituindo:|Substituição:|Substituting:|Substitution:)(.*)$/);
  if (substitutionMatch || step.includes('substituir') || step.includes('substituição') ||
      step.includes('substitute') || step.includes('substitution')) {
    return (
      <div key={index} className="p-3 bg-pink-50 dark:bg-pink-900/30 rounded-md ml-4 border-l-2 border-pink-300 dark:border-pink-600 my-2">
        <div className="flex items-center">
          <HiOutlineLightningBolt className="text-pink-600 dark:text-pink-400 mr-2 flex-shrink-0 h-5 w-5" />
          <span className="text-pink-700 dark:text-pink-300 font-medium">{step}</span>
        </div>
      </div>
    );
  }

  // Ângulos/valores especiais
  const specialAngleMatch = step.match(/^(Ângulo notável:|Valor notável:|Special angle:|Notable value:)(.*)$/);
  if (specialAngleMatch || step.includes('ângulo notável') || step.includes('valor especial') || 
      step.includes('π/') || step.includes('π/2') || step.includes('π/3') || step.includes('π/4') || 
      step.includes('π/6') || step.includes('special angle') || step.includes('notable value') ||
      step.includes('pi/')) {
    return (
      <div key={index} className="p-3 bg-cyan-50 dark:bg-cyan-900/30 rounded-md ml-4 border-l-2 border-cyan-300 dark:border-cyan-600 my-2">
        <div className="flex items-center">
          <HiOutlineLibrary className="text-cyan-600 dark:text-cyan-400 mr-2 flex-shrink-0 h-5 w-5" />
          <span className="text-cyan-700 dark:text-cyan-300 font-medium">{step}</span>
        </div>
      </div>
    );
  }

  // Verificação
  const verificationMatch = step.match(/^(Verificação:|Verificando resultado:|Verification:|Verifying result:)(.*)$/);
  if (verificationMatch || step.includes('verificar') || step.includes('conferir') ||
      step.includes('verify') || step.includes('check')) {
    return (
      <div key={index} className="p-3 bg-emerald-50 dark:bg-emerald-900/30 rounded-md ml-4 border-l-2 border-emerald-300 dark:border-emerald-600 my-2">
        <div className="flex items-center">
          <HiOutlineCheckCircle className="text-emerald-600 dark:text-emerald-400 mr-2 flex-shrink-0 h-5 w-5" />
          <span className="text-emerald-700 dark:text-emerald-300 font-medium">{step}</span>
        </div>
      </div>
    );
  }

  // Resultados
  const resultMatch = step.match(/^(Resultado:|Resultado final:|Solução|Result:|Final result:|Solution)(.*)$/);
  if (resultMatch || step.includes('solução') || step.includes('concluído') ||
      step.includes('solution') || step.includes('completed')) {
    return (
      <div key={index} className="p-3 bg-green-50 dark:bg-green-900/30 rounded-md ml-4 border-l-2 border-green-300 dark:border-green-600 my-2">
        <div className="flex items-center">
          <HiOutlineCheck className="text-green-600 dark:text-green-400 mr-2 flex-shrink-0 h-5 w-5" />
          <span className="text-green-700 dark:text-green-300 font-medium">{step}</span>
        </div>
      </div>
    );
  }

  // Padrão para verificação concluída
  if (typeof step === 'string' && step.startsWith('verification.completed:')) {
    const cleanedStep = cleanVerificationStep(step);
    
    return (
      <div key={index} className="p-3 bg-green-50 dark:bg-green-900/30 rounded-md ml-4 border-l-2 border-green-300 dark:border-green-600 my-2 font-bold">
        <div className="flex items-center">
          <HiOutlineCheck className="text-green-600 dark:text-green-400 mr-2 flex-shrink-0 h-5 w-5" />
          <p className="text-green-700 dark:text-green-300 font-medium">{cleanedStep}</p>
        </div>
      </div>
    );
  }

  // Renderização padrão
  return (
    <div key={index} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md ml-4 border-l-2 border-gray-300 dark:border-gray-600 my-2">
      <span className="text-gray-800 dark:text-gray-200">{step}</span>
    </div>
  );
};

export default TrigonometricRenderer; 