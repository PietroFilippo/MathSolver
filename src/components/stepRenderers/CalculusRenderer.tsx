import React, { ReactNode } from 'react';
import { 
  HiOutlineCalculator,
  HiOutlineCheck,
  HiOutlineDocumentText,
  HiOutlineVariable,
  HiOutlineArrowRight,
  HiOutlineChartBar,
  HiOutlineChevronRight,
  HiOutlineCollection,
  HiOutlineCube,
  HiOutlineRefresh,
  HiOutlinePlusCircle,
  HiOutlineArrowCircleRight
} from 'react-icons/hi';
import { useTranslation } from 'react-i18next';
import { cleanVerificationStep } from './utils';

interface CalculusRendererProps {
  step: string | ReactNode;
  index: number;
}

const CalculusRenderer: React.FC<CalculusRendererProps> = ({ step, index }) => {
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
  const originalMatch = step.match(/^(Expressão original:|Função original:|Problema original:|Enunciado:|Original expression:|Original function:|Original problem:|Problem statement:)(.*)$/);
  if (originalMatch) {
    return (
      <div key={index} className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-md ml-4 border-l-2 border-blue-300 dark:border-blue-600 my-2">
        <div className="flex items-center">
          <HiOutlineDocumentText className="text-blue-600 dark:text-blue-400 mr-2 flex-shrink-0 h-5 w-5" />
          <span className="font-semibold text-blue-700 dark:text-blue-300 mr-2">{originalMatch[1]}</span>
          <span className="text-blue-800 dark:text-blue-200">{originalMatch[2]}</span>
        </div>
      </div>
    );
  }

  // Definição de função
  const functionMatch = step.match(/^(Função:|Definindo função:|Seja f\(x\) =|Function:|Defining function:|Let f\(x\) =)(.*)$/);
  if (functionMatch || step.includes('função') || step.includes('f(x)') || step.includes('g(x)') ||
      step.includes('function') || step.includes('f(x)') || step.includes('g(x)')) {
    return (
      <div key={index} className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-md ml-4 border-l-2 border-indigo-300 dark:border-indigo-600 my-2">
        <div className="flex items-center">
          <HiOutlineVariable className="text-indigo-600 dark:text-indigo-400 mr-2 flex-shrink-0 h-5 w-5" />
          <span className="text-indigo-700 dark:text-indigo-300 font-medium">{step}</span>
        </div>
      </div>
    );
  }

  // Cálculo da derivada
  const derivativeMatch = step.match(/^(Derivada:|Calculando derivada:|f'|f'\(x\) =|Regra da derivada:|Derivative:|Calculating derivative:|f'|f'\(x\) =|Derivative rule:)(.*)$/);
  if (derivativeMatch || step.includes('derivada') || step.includes('f\'(') || step.includes('g\'(') || 
      step.includes('regra do produto') || step.includes('regra da cadeia') || step.includes('regra do quociente') ||
      step.includes('derivative') || step.includes('f\'(') || step.includes('g\'(') || 
      step.includes('product rule') || step.includes('chain rule') || step.includes('quotient rule')) {
    return (
      <div key={index} className="p-3 bg-green-50 dark:bg-green-900/30 rounded-md ml-4 border-l-2 border-green-300 dark:border-green-600 my-2">
        <div className="flex items-center">
          <HiOutlineArrowRight className="text-green-600 dark:text-green-400 mr-2 flex-shrink-0 h-5 w-5" />
          <span className="text-green-700 dark:text-green-300 font-medium">{step}</span>
        </div>
      </div>
    );
  }

  // Cálculo da integral
  const integralMatch = step.match(/^(Integral:|Calculando integral:|∫|Antiderivada:|Integral:|Calculating integral:|∫|Antiderivative:)(.*)$/);
  if (integralMatch || step.includes('integral') || step.includes('∫') || step.includes('primitiva') || 
      step.includes('integração por partes') || step.includes('substituição')) {
    return (
      <div key={index} className="p-3 bg-amber-50 dark:bg-amber-900/30 rounded-md ml-4 border-l-2 border-amber-300 dark:border-amber-600 my-2">
        <div className="flex items-center">
          <HiOutlinePlusCircle className="text-amber-600 dark:text-amber-400 mr-2 flex-shrink-0 h-5 w-5" />
          <span className="text-amber-700 dark:text-amber-300 font-medium">{step}</span>
        </div>
      </div>
    );
  }

  // Cálculo do limite
  const limitMatch = step.match(/^(Limite:|Calculando limite:|lim|lim_{x→|Limit:|Calculating limit:|lim|lim_{x→)(.*)$/);
  if (limitMatch || step.includes('limite') || step.includes('lim') || step.includes('x→') ||
      step.includes('limit')) {
    return (
      <div key={index} className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-md ml-4 border-l-2 border-blue-300 dark:border-blue-600 my-2">
        <div className="flex items-center">
          <HiOutlineArrowCircleRight className="text-blue-600 dark:text-blue-400 mr-2 flex-shrink-0 h-5 w-5" />
          <span className="text-blue-700 dark:text-blue-300 font-medium">{step}</span>
        </div>
      </div>
    );
  }

  // Série e sequência
  const seriesMatch = step.match(/^(Série:|Sequência:|Somatória:|Calculando série:|∑|Series:|Sequence:|Summation:|Calculating series:|∑)(.*)$/);
  if (seriesMatch || step.includes('série') || step.includes('sequência') || step.includes('soma') || 
      step.includes('∑') || step.includes('convergência') || step.includes('divergência') ||
      step.includes('series') || step.includes('sequence') || step.includes('sum') || 
      step.includes('convergence') || step.includes('divergence')) {
    return (
      <div key={index} className="p-3 bg-violet-50 dark:bg-violet-900/30 rounded-md ml-4 border-l-2 border-violet-300 dark:border-violet-600 my-2">
        <div className="flex items-center">
          <HiOutlineCollection className="text-violet-600 dark:text-violet-400 mr-2 flex-shrink-0 h-5 w-5" />
          <span className="text-violet-700 dark:text-violet-300 font-medium">{step}</span>
        </div>
      </div>
    );
  }

  // Pontos críticos e extremos
  const criticalMatch = step.match(/^(Pontos críticos:|Máximos e mínimos:|Extremos:|Ponto crítico:|Critical points:|Maxima and minima:|Extrema:|Critical point:)(.*)$/);
  if (criticalMatch || step.includes('ponto crítico') || step.includes('máximo') || step.includes('mínimo') || 
      step.includes('extremo') || step.includes('otimização') ||
      step.includes('critical point') || step.includes('maximum') || step.includes('minimum') || 
      step.includes('extremum') || step.includes('optimization')) {
    return (
      <div key={index} className="p-3 bg-teal-50 dark:bg-teal-900/30 rounded-md ml-4 border-l-2 border-teal-300 dark:border-teal-600 my-2">
        <div className="flex items-center">
          <HiOutlineChartBar className="text-teal-600 dark:text-teal-400 mr-2 flex-shrink-0 h-5 w-5" />
          <span className="text-teal-700 dark:text-teal-300 font-medium">{step}</span>
        </div>
      </div>
    );
  }

  // Taxa de variação
  const rateMatch = step.match(/^(Taxa de variação:|Taxa de mudança:|Taxa instantânea:|Rate of change:|Rate of variation:|Instantaneous rate:)(.*)$/);
  if (rateMatch || step.includes('taxa de variação') || step.includes('taxa de mudança') || 
      step.includes('velocidade') || step.includes('aceleração') ||
      step.includes('rate of change') || step.includes('velocity') || 
      step.includes('acceleration')) {
    return (
      <div key={index} className="p-3 bg-pink-50 dark:bg-pink-900/30 rounded-md ml-4 border-l-2 border-pink-300 dark:border-pink-600 my-2">
        <div className="flex items-center">
          <HiOutlineArrowRight className="text-pink-600 dark:text-pink-400 mr-2 flex-shrink-0 h-5 w-5" />
          <span className="text-pink-700 dark:text-pink-300 font-medium">{step}</span>
        </div>
      </div>
    );
  }

  // Função de várias variáveis
  const multiVarMatch = step.match(/^(Função de várias variáveis:|Derivada parcial:|Gradiente:|Multivariable function:|Partial derivative:|Gradient:)(.*)$/);
  if (multiVarMatch || step.includes('várias variáveis') || step.includes('derivada parcial') || 
      step.includes('gradiente') || step.includes('∂') ||
      step.includes('multiple variables') || step.includes('partial derivative') || 
      step.includes('gradient')) {
    return (
      <div key={index} className="p-3 bg-cyan-50 dark:bg-cyan-900/30 rounded-md ml-4 border-l-2 border-cyan-300 dark:border-cyan-600 my-2">
        <div className="flex items-center">
          <HiOutlineCube className="text-cyan-600 dark:text-cyan-400 mr-2 flex-shrink-0 h-5 w-5" />
          <span className="text-cyan-700 dark:text-cyan-300 font-medium">{step}</span>
        </div>
      </div>
    );
  }

  // Aplicação de teoremas
  const theoremMatch = step.match(/^(Aplicando teorema:|Teorema:|Pelo teorema:|Applying theorem:|Theorem:|By the theorem:)(.*)$/);
  if (theoremMatch || step.includes('teorema') || step.includes('teorema fundamental') || 
      step.includes('regra de L\'Hôpital') || step.includes('valor médio') ||
      step.includes('theorem') || step.includes('fundamental theorem') || 
      step.includes('L\'Hôpital\'s rule') || step.includes('mean value')) {
    return (
      <div key={index} className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-md ml-4 border-l-2 border-indigo-300 dark:border-indigo-600 my-2">
        <div className="flex items-center">
          <HiOutlineVariable className="text-indigo-600 dark:text-indigo-400 mr-2 flex-shrink-0 h-5 w-5" />
          <span className="text-indigo-700 dark:text-indigo-300 font-medium">{step}</span>
        </div>
      </div>
    );
  }

  // Equações diferenciais
  const differentialMatch = step.match(/^(Equação diferencial:|Resolvendo equação diferencial:|Differential equation:|Solving differential equation:)(.*)$/);
  if (differentialMatch || step.includes('equação diferencial') || step.includes('EDO') || 
      step.includes('dy/dx') || step.includes('solução particular') ||
      step.includes('differential equation') || step.includes('ODE') || 
      step.includes('particular solution')) {
    return (
      <div key={index} className="p-3 bg-purple-50 dark:bg-purple-900/30 rounded-md ml-4 border-l-2 border-purple-300 dark:border-purple-600 my-2">
        <div className="flex items-center">
          <HiOutlineRefresh className="text-purple-600 dark:text-purple-400 mr-2 flex-shrink-0 h-5 w-5" />
          <span className="text-purple-700 dark:text-purple-300 font-medium">{step}</span>
        </div>
      </div>
    );
  }

  // Simplificação
  const simplificationMatch = step.match(/^(Simplificando:|Simplificação:|Simplifying:|Simplification:)(.*)$/);
  if (simplificationMatch || step.includes('simplificar') || step.includes('simplificamos') ||
      step.includes('simplify') || step.includes('simplifying')) {
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
  const substitutionMatch = step.match(/^(Substituindo:|Substituição:|Mudança de variável:|Substituting:|Substitution:|Change of variable:)(.*)$/);
  if (substitutionMatch || step.includes('substituir') || step.includes('substituição') ||
      step.includes('mudança de variável') || step.includes('substitute') || 
      step.includes('substitution') || step.includes('change of variable')) {
    return (
      <div key={index} className="p-3 bg-emerald-50 dark:bg-emerald-900/30 rounded-md ml-4 border-l-2 border-emerald-300 dark:border-emerald-600 my-2">
        <div className="flex items-center">
          <HiOutlineRefresh className="text-emerald-600 dark:text-emerald-400 mr-2 flex-shrink-0 h-5 w-5" />
          <span className="text-emerald-700 dark:text-emerald-300 font-medium">{step}</span>
        </div>
      </div>
    );
  }

  // Cálculo geral
  const calculationMatch = step.match(/^(Calculando:|Cálculo:|Efetuando cálculos:|Calculating:|Computation:|Performing calculations:)(.*)$/);
  if (calculationMatch || step.includes('calcular') || step.includes('calculando') ||
      step.includes('calculate') || step.includes('calculating')) {
    return (
      <div key={index} className="p-3 bg-gray-50 dark:bg-gray-900/30 rounded-md ml-4 border-l-2 border-gray-300 dark:border-gray-600 my-2">
        <div className="flex items-center">
          <HiOutlineCalculator className="text-gray-600 dark:text-gray-400 mr-2 flex-shrink-0 h-5 w-5" />
          <span className="text-gray-700 dark:text-gray-300 font-medium">{step}</span>
        </div>
      </div>
    );
  }

  // Resultado final
  const resultMatch = step.match(/^(Resultado:|Resultado final:|Solução:|Result:|Final result:|Solution:)(.*)$/);
  if (resultMatch || step.includes('resultado') || step.includes('solução') || step.includes('resposta') ||
      step.includes('result') || step.includes('solution') || step.includes('answer')) {
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

export default CalculusRenderer; 