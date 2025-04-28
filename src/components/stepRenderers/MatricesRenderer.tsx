import React, { ReactNode } from 'react';
import { 
  HiOutlineCalculator,
  HiOutlineCheck,
  HiOutlineDocumentText,
  HiOutlineTable,
  HiOutlinePlusCircle,
  HiOutlineMinusCircle,
  HiOutlineXCircle,
  HiOutlineRefresh,
  HiOutlineArrowCircleRight,
  HiOutlineSwitchHorizontal,
  HiOutlineCheckCircle
} from 'react-icons/hi';
import { useTranslation } from 'react-i18next';
import { cleanVerificationStep } from './utils';

interface MatricesRendererProps {
  step: string | ReactNode;
  index: number;
}

const MatricesRenderer: React.FC<MatricesRendererProps> = ({ step, index }) => {
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
  const originalExpressionMatch = step.match(/^(Expressão original:|Matriz original:|Sistema original:|Original expression:|Original matrix:|Original system:)(.*)$/);
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

  // Definição de matriz
  const matrixDefinitionMatch = step.match(/^(Matriz:|Definindo matriz:|Matriz de dimensão|Matrix:|Defining matrix:|Matrix of dimension)(.*)$/);
  if (matrixDefinitionMatch || (step.includes('matriz') && !step.includes('determinante') && !step.includes('inversa')) ||
      (step.includes('matrix') && !step.includes('determinant') && !step.includes('inverse'))) {
    return (
      <div key={index} className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-md ml-4 border-l-2 border-indigo-300 dark:border-indigo-600 my-2">
        <div className="flex items-center">
          <HiOutlineTable className="text-indigo-600 dark:text-indigo-400 mr-2 flex-shrink-0 h-5 w-5" />
          <span className="text-indigo-700 dark:text-indigo-300 font-medium">{step}</span>
        </div>
      </div>
    );
  }

  // Adição de matrizes
  const matrixAdditionMatch = step.match(/^(Adicionando matrizes:|Soma de matrizes:|Adding matrices:|Sum of matrices:)(.*)$/);
  if (matrixAdditionMatch || step.includes('adicionar matrizes') || step.includes('soma das matrizes') ||
      step.includes('add matrices') || step.includes('sum of matrices')) {
    return (
      <div key={index} className="p-3 bg-green-50 dark:bg-green-900/30 rounded-md ml-4 border-l-2 border-green-300 dark:border-green-600 my-2">
        <div className="flex items-center">
          <HiOutlinePlusCircle className="text-green-600 dark:text-green-400 mr-2 flex-shrink-0 h-5 w-5" />
          <span className="text-green-700 dark:text-green-300 font-medium">{step}</span>
        </div>
      </div>
    );
  }

  // Subtração de matrizes
  const matrixSubtractionMatch = step.match(/^(Subtraindo matrizes:|Subtração de matrizes:|Subtracting matrices:|Subtraction of matrices:)(.*)$/);
  if (matrixSubtractionMatch || step.includes('subtrair matrizes') || step.includes('diferença entre matrizes') ||
      step.includes('subtract matrices') || step.includes('difference between matrices')) {
    return (
      <div key={index} className="p-3 bg-red-50 dark:bg-red-900/30 rounded-md ml-4 border-l-2 border-red-300 dark:border-red-600 my-2">
        <div className="flex items-center">
          <HiOutlineMinusCircle className="text-red-600 dark:text-red-400 mr-2 flex-shrink-0 h-5 w-5" />
          <span className="text-red-700 dark:text-red-300 font-medium">{step}</span>
        </div>
      </div>
    );
  }

  // Multiplicação de matrizes
  const matrixMultiplicationMatch = step.match(/^(Multiplicando matrizes:|Multiplicação de matrizes:|Multiplying matrices:|Matrix multiplication:)(.*)$/);
  if (matrixMultiplicationMatch || step.includes('multiplicar matrizes') || step.includes('produto de matrizes') ||
      step.includes('multiply matrices') || step.includes('product of matrices')) {
    return (
      <div key={index} className="p-3 bg-amber-50 dark:bg-amber-900/30 rounded-md ml-4 border-l-2 border-amber-300 dark:border-amber-600 my-2">
        <div className="flex items-center">
          <HiOutlineXCircle className="text-amber-600 dark:text-amber-400 mr-2 flex-shrink-0 h-5 w-5" />
          <span className="text-amber-700 dark:text-amber-300 font-medium">{step}</span>
        </div>
      </div>
    );
  }

  // Multiplicação por escalar
  const scalarMultiplicationMatch = step.match(/^(Multiplicação por escalar:|Escalar:|Scalar multiplication:|Scalar:)(.*)$/);
  if (scalarMultiplicationMatch || step.includes('multiplicar por escalar') || step.includes('escalar') ||
      step.includes('multiply by scalar') || step.includes('scalar')) {
    return (
      <div key={index} className="p-3 bg-yellow-50 dark:bg-yellow-900/30 rounded-md ml-4 border-l-2 border-yellow-300 dark:border-yellow-600 my-2">
        <div className="flex items-center">
          <HiOutlineCalculator className="text-yellow-600 dark:text-yellow-400 mr-2 flex-shrink-0 h-5 w-5" />
          <span className="text-yellow-700 dark:text-yellow-300 font-medium">{step}</span>
        </div>
      </div>
    );
  }

  // Transposta de matriz
  const transposeMatch = step.match(/^(Transposta:|Calculando transposta:|Transpose:|Calculating transpose:)(.*)$/);
  if (transposeMatch || step.includes('transposta') || step.includes('transposição') ||
      step.includes('transpose') || step.includes('transposition')) {
    return (
      <div key={index} className="p-3 bg-cyan-50 dark:bg-cyan-900/30 rounded-md ml-4 border-l-2 border-cyan-300 dark:border-cyan-600 my-2">
        <div className="flex items-center">
          <HiOutlineSwitchHorizontal className="text-cyan-600 dark:text-cyan-400 mr-2 flex-shrink-0 h-5 w-5" />
          <span className="text-cyan-700 dark:text-cyan-300 font-medium">{step}</span>
        </div>
      </div>
    );
  }

  // Cálculo de determinante
  const determinantMatch = step.match(/^(Determinante:|Calculando determinante:|Determinant:|Calculating determinant:)(.*)$/);
  if (determinantMatch || step.includes('determinante') || step.includes('determinant')) {
    return (
      <div key={index} className="p-3 bg-purple-50 dark:bg-purple-900/30 rounded-md ml-4 border-l-2 border-purple-300 dark:border-purple-600 my-2">
        <div className="flex items-center">
          <HiOutlineCalculator className="text-purple-600 dark:text-purple-400 mr-2 flex-shrink-0 h-5 w-5" />
          <span className="text-purple-700 dark:text-purple-300 font-medium">{step}</span>
        </div>
      </div>
    );
  }

  // Matriz inversa
  const inverseMatch = step.match(/^(Matriz inversa:|Calculando inversa:|Inverse matrix:|Calculating inverse:)(.*)$/);
  if (inverseMatch || step.includes('inversa') || step.includes('inversão') ||
      step.includes('inverse') || step.includes('inversion')) {
    return (
      <div key={index} className="p-3 bg-pink-50 dark:bg-pink-900/30 rounded-md ml-4 border-l-2 border-pink-300 dark:border-pink-600 my-2">
        <div className="flex items-center">
          <HiOutlineRefresh className="text-pink-600 dark:text-pink-400 mr-2 flex-shrink-0 h-5 w-5" />
          <span className="text-pink-700 dark:text-pink-300 font-medium">{step}</span>
        </div>
      </div>
    );
  }

  // Eliminação gaussiana
  const gaussianMatch = step.match(/^(Eliminação gaussiana:|Aplicando Gauss:|Gaussian elimination:|Applying Gauss:)(.*)$/);
  if (gaussianMatch || step.includes('eliminação gaussiana') || step.includes('Gauss-Jordan') || 
      step.includes('pivô') || step.includes('gaussian elimination') || 
      step.includes('Gauss-Jordan') || step.includes('pivot')) {
    return (
      <div key={index} className="p-3 bg-teal-50 dark:bg-teal-900/30 rounded-md ml-4 border-l-2 border-teal-300 dark:border-teal-600 my-2">
        <div className="flex items-center">
          <HiOutlineArrowCircleRight className="text-teal-600 dark:text-teal-400 mr-2 flex-shrink-0 h-5 w-5" />
          <span className="text-teal-700 dark:text-teal-300 font-medium">{step}</span>
        </div>
      </div>
    );
  }

  // Operações nas linhas
  const rowOpMatch = step.match(/^(Operação nas linhas:|Trocando linhas:|Multiplicando linha:|Somando linhas:|Row operation:|Swapping rows:|Multiplying row:|Adding rows:)(.*)$/);
  if (rowOpMatch || step.includes('linha') || (step.includes('L') && step.includes('→')) ||
      step.includes('row') || (step.includes('R') && step.includes('→'))) {
    return (
      <div key={index} className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-md ml-4 border-l-2 border-blue-300 dark:border-blue-600 my-2">
        <div className="flex items-center">
          <HiOutlineArrowCircleRight className="text-blue-600 dark:text-blue-400 mr-2 flex-shrink-0 h-5 w-5" />
          <span className="text-blue-700 dark:text-blue-300 font-medium">{step}</span>
        </div>
      </div>
    );
  }

  // Sistema de equações
  const systemMatch = step.match(/^(Sistema de equações:|Resolvendo sistema:|System of equations:|Solving system:)(.*)$/);
  if (systemMatch || step.includes('sistema') || step.includes('equações lineares') ||
      step.includes('system') || step.includes('linear equations')) {
    return (
      <div key={index} className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-md ml-4 border-l-2 border-indigo-300 dark:border-indigo-600 my-2">
        <div className="flex items-center">
          <HiOutlineDocumentText className="text-indigo-600 dark:text-indigo-400 mr-2 flex-shrink-0 h-5 w-5" />
          <span className="text-indigo-700 dark:text-indigo-300 font-medium">{step}</span>
        </div>
      </div>
    );
  }

  // Autovalores e autovetores
  const eigenMatch = step.match(/^(Autovalores:|Autovetores:|Calculando autovalores:|Eigenvalues:|Eigenvectors:|Calculating eigenvalues:)(.*)$/);
  if (eigenMatch || step.includes('autovalor') || step.includes('autovetor') || step.includes('eigen') ||
      step.includes('eigenvalue') || step.includes('eigenvector')) {
    return (
      <div key={index} className="p-3 bg-violet-50 dark:bg-violet-900/30 rounded-md ml-4 border-l-2 border-violet-300 dark:border-violet-600 my-2">
        <div className="flex items-center">
          <HiOutlineCalculator className="text-violet-600 dark:text-violet-400 mr-2 flex-shrink-0 h-5 w-5" />
          <span className="text-violet-700 dark:text-violet-300 font-medium">{step}</span>
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
  const resultMatch = step.match(/^(Resultado:|Resultado final:|Solução:|Result:|Final result:|Solution:)(.*)$/);
  if (resultMatch || step.includes('solução do sistema') || step.includes('concluído') ||
      step.includes('system solution') || step.includes('completed')) {
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

export default MatricesRenderer; 