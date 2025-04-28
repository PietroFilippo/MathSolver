import React, { ReactNode } from 'react';
import { 
  HiOutlineCalculator,
  HiOutlineCheck,
  HiOutlineDocumentText,
  HiOutlineVariable,
  HiOutlineTemplate,
  HiOutlineRefresh,
  HiOutlineChevronRight,
  HiOutlineScale,
  HiOutlineCube,
  HiOutlineViewGrid,
  HiOutlinePuzzle,
  HiOutlineAcademicCap
} from 'react-icons/hi';
import { useTranslation } from 'react-i18next';
import { cleanVerificationStep } from './utils';

interface GeometricRendererProps {
  step: string | ReactNode;
  index: number;
}

const GeometricRenderer: React.FC<GeometricRendererProps> = ({ step, index }) => {
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

  // Problema original ou figura
  const originalMatch = step.match(/^(Figura original:|Problema original:|Enunciado:|Original figure:|Original problem:|Problem statement:)(.*)$/);
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

  // Identificação/definição de forma
  const shapeMatch = step.match(/^(Identificando forma:|Forma geométrica:|Definição da figura:|Identifying shape:|Geometric shape:|Figure definition:)(.*)$/);
  if (shapeMatch || step.includes('quadrado') || step.includes('retângulo') || 
      step.includes('triângulo') || step.includes('círculo') || 
      step.includes('polígono') || step.includes('prisma') || 
      step.includes('cilindro') || step.includes('cone') || 
      step.includes('esfera') ||
      step.includes('square') || step.includes('rectangle') || 
      step.includes('triangle') || step.includes('circle') || 
      step.includes('polygon') || step.includes('prism') || 
      step.includes('cylinder') || step.includes('cone') || 
      step.includes('sphere')) {
    return (
      <div key={index} className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-md ml-4 border-l-2 border-indigo-300 dark:border-indigo-600 my-2">
        <div className="flex items-center">
          <HiOutlineTemplate className="text-indigo-600 dark:text-indigo-400 mr-2 flex-shrink-0 h-5 w-5" />
          <span className="text-indigo-700 dark:text-indigo-300 font-medium">{step}</span>
        </div>
      </div>
    );
  }

  // Cálculo da área
  const areaMatch = step.match(/^(Calculando área:|Área:|Área da figura:|Calculating area:|Area:|Figure area:)(.*)$/);
  if (areaMatch || step.includes('área') || step.includes('area')) {
    return (
      <div key={index} className="p-3 bg-green-50 dark:bg-green-900/30 rounded-md ml-4 border-l-2 border-green-300 dark:border-green-600 my-2">
        <div className="flex items-center">
          <HiOutlineViewGrid className="text-green-600 dark:text-green-400 mr-2 flex-shrink-0 h-5 w-5" />
          <span className="text-green-700 dark:text-green-300 font-medium">{step}</span>
        </div>
      </div>
    );
  }

    // Cálculo do perímetro
  const perimeterMatch = step.match(/^(Calculando perímetro:|Perímetro:|Contorno da figura:|Calculating perimeter:|Perimeter:|Figure outline:)(.*)$/);
  if (perimeterMatch || step.includes('perímetro') || step.includes('contorno') || 
      step.includes('perimeter') || step.includes('outline')) {
    return (
      <div key={index} className="p-3 bg-yellow-50 dark:bg-yellow-900/30 rounded-md ml-4 border-l-2 border-yellow-300 dark:border-yellow-600 my-2">
        <div className="flex items-center">
          <HiOutlineScale className="text-yellow-600 dark:text-yellow-400 mr-2 flex-shrink-0 h-5 w-5" />
          <span className="text-yellow-700 dark:text-yellow-300 font-medium">{step}</span>
        </div>
      </div>
    );
  }

  // Cálculo do volume
  const volumeMatch = step.match(/^(Calculando volume:|Volume:|Volume da figura:|Calculating volume:|Volume:|Figure volume:)(.*)$/);
  if (volumeMatch || step.includes('volume')) {
    return (
      <div key={index} className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-md ml-4 border-l-2 border-blue-300 dark:border-blue-600 my-2">
        <div className="flex items-center">
          <HiOutlineCube className="text-blue-600 dark:text-blue-400 mr-2 flex-shrink-0 h-5 w-5" />
          <span className="text-blue-700 dark:text-blue-300 font-medium">{step}</span>
        </div>
      </div>
    );
  }

  // Cálculo do ângulo
  const angleMatch = step.match(/^(Calculando ângulo:|Ângulo:|Medida do ângulo:|Calculating angle:|Angle:|Measure of angle:)(.*)$/);
  if (angleMatch || step.includes('ângulo') || step.includes('angle')) {
    return (
      <div key={index} className="p-3 bg-amber-50 dark:bg-amber-900/30 rounded-md ml-4 border-l-2 border-amber-300 dark:border-amber-600 my-2">
        <div className="flex items-center">
          <HiOutlinePuzzle className="text-amber-600 dark:text-amber-400 mr-2 flex-shrink-0 h-5 w-5" />
          <span className="text-amber-700 dark:text-amber-300 font-medium">{step}</span>
        </div>
      </div>
    );
  }

  // Cálculo da distância   
  const distanceMatch = step.match(/^(Calculando distância:|Distância:|Comprimento:|Calculating distance:|Distance:|Length:)(.*)$/);
  if (distanceMatch || step.includes('distância') || step.includes('comprimento') || 
      step.includes('altura') || step.includes('largura') ||
      step.includes('distance') || step.includes('length') || 
      step.includes('height') || step.includes('width')) {
    return (
      <div key={index} className="p-3 bg-teal-50 dark:bg-teal-900/30 rounded-md ml-4 border-l-2 border-teal-300 dark:border-teal-600 my-2">
        <div className="flex items-center">
          <HiOutlineScale className="text-teal-600 dark:text-teal-400 mr-2 flex-shrink-0 h-5 w-5" />
          <span className="text-teal-700 dark:text-teal-300 font-medium">{step}</span>
        </div>
      </div>
    );
  }

  // Aplicação de fórmulas
  const formulaMatch = step.match(/^(Aplicando fórmula:|Fórmula para|Fórmula:|Applying formula:|Formula for|Formula:)(.*)$/);
  if (formulaMatch || step.includes('fórmula') || step.includes('formula')) {
    return (
      <div key={index} className="p-3 bg-violet-50 dark:bg-violet-900/30 rounded-md ml-4 border-l-2 border-violet-300 dark:border-violet-600 my-2">
        <div className="flex items-center">
          <HiOutlineAcademicCap className="text-violet-600 dark:text-violet-400 mr-2 flex-shrink-0 h-5 w-5" />
          <span className="text-violet-700 dark:text-violet-300 font-medium">{step}</span>
        </div>
      </div>
    );
  }

  // Coordenadas e pontos
  const coordinatesMatch = step.match(/^(Coordenadas:|Ponto:|Coordenadas do ponto:|Coordinates:|Point:|Point coordinates:)(.*)$/);
  if (coordinatesMatch || step.includes('coordenadas') || step.includes('ponto (') || 
      step.includes('pontos') || step.includes('coordinates') || 
      step.includes('point (') || step.includes('points')) {
    return (
      <div key={index} className="p-3 bg-cyan-50 dark:bg-cyan-900/30 rounded-md ml-4 border-l-2 border-cyan-300 dark:border-cyan-600 my-2">
        <div className="flex items-center">
          <HiOutlineVariable className="text-cyan-600 dark:text-cyan-400 mr-2 flex-shrink-0 h-5 w-5" />
          <span className="text-cyan-700 dark:text-cyan-300 font-medium">{step}</span>
        </div>
      </div>
    );
  }

  // Aplicação de teorema
  const theoremMatch = step.match(/^(Aplicando teorema:|Teorema de|Pelo teorema:|Applying theorem:|Theorem of|By the theorem:)(.*)$/);
  if (theoremMatch || step.includes('teorema') || step.includes('Pitágoras') || 
      step.includes('Thales') || step.includes('theorem') || 
      step.includes('Pythagoras') || step.includes('Thales')) {
    return (
      <div key={index} className="p-3 bg-pink-50 dark:bg-pink-900/30 rounded-md ml-4 border-l-2 border-pink-300 dark:border-pink-600 my-2">
        <div className="flex items-center">
          <HiOutlineAcademicCap className="text-pink-600 dark:text-pink-400 mr-2 flex-shrink-0 h-5 w-5" />
          <span className="text-pink-700 dark:text-pink-300 font-medium">{step}</span>
        </div>
      </div>
    );
  }

  // Cálculos
  const calculationMatch = step.match(/^(Calculando:|Cálculo:|Efetuando cálculos:|Calculating:|Calculation:|Performing calculations:)(.*)$/);
  if (calculationMatch || step.includes('calculando') || step.includes('cálculo') || 
      step.includes('calculating') || step.includes('calculation')) {
    return (
      <div key={index} className="p-3 bg-gray-50 dark:bg-gray-900/30 rounded-md ml-4 border-l-2 border-gray-300 dark:border-gray-600 my-2">
        <div className="flex items-center">
          <HiOutlineCalculator className="text-gray-600 dark:text-gray-400 mr-2 flex-shrink-0 h-5 w-5" />
          <span className="text-gray-700 dark:text-gray-300 font-medium">{step}</span>
        </div>
      </div>
    );
  }

  // Simplificação
  const simplificationMatch = step.match(/^(Simplificando:|Simplificação:|Simplifying:|Simplification:)(.*)$/);
  if (simplificationMatch || step.includes('simplificando') || step.includes('simplificamos') || 
      step.includes('simplifying') || step.includes('simplify')) {
    return (
      <div key={index} className="p-3 bg-orange-50 dark:bg-orange-900/30 rounded-md ml-4 border-l-2 border-orange-300 dark:border-orange-600 my-2">
        <div className="flex items-center">
          <HiOutlineChevronRight className="text-orange-600 dark:text-orange-400 mr-2 flex-shrink-0 h-5 w-5" />
          <span className="text-orange-700 dark:text-orange-300 font-medium">{step}</span>
        </div>
      </div>
    );
  }

  // Substituição
  const substitutionMatch = step.match(/^(Substituindo:|Substituição:|Substituting:|Substitution:)(.*)$/);
  if (substitutionMatch || step.includes('substituir') || step.includes('substituindo') || 
      step.includes('substitute') || step.includes('substituting')) {
    return (
      <div key={index} className="p-3 bg-emerald-50 dark:bg-emerald-900/30 rounded-md ml-4 border-l-2 border-emerald-300 dark:border-emerald-600 my-2">
        <div className="flex items-center">
          <HiOutlineRefresh className="text-emerald-600 dark:text-emerald-400 mr-2 flex-shrink-0 h-5 w-5" />
          <span className="text-emerald-700 dark:text-emerald-300 font-medium">{step}</span>
        </div>
      </div>
    );
  }

  // Resultado final
  const resultMatch = step.match(/^(Resultado:|Resultado final:|Solução:|Result:|Final result:|Solution:)(.*)$/);
  if (resultMatch || step.includes('resultado') || step.includes('solução') || 
      step.includes('result') || step.includes('solution')) {
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

export default GeometricRenderer; 