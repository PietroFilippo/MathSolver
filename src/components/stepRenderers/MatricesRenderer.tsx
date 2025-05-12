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
  const { t } = useTranslation(['matrices', 'translation']);

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

  // Substitui os placeholders para termos comuns
  let processedStep = step;
  if (typeof step === 'string') {
    processedStep = step
      .replace('translation:common.sum', t('translation:common.sum'))
      .replace('translation:common.difference', t('translation:common.difference'))
      .replace('translation:common.addition', t('translation:common.addition'))
      .replace('translation:common.subtraction', t('translation:common.subtraction'))
      .replace('common.sum', t('translation:common.sum'))
      .replace('common.difference', t('translation:common.difference'))
      .replace('common.addition', t('translation:common.addition'))
      .replace('common.subtraction', t('translation:common.subtraction'));
  }

  // Prioriza o que começa com Result: ou Resultado:
  if (processedStep.startsWith('Result:') || processedStep.startsWith('Resultado:') || 
      processedStep.includes('Result of sum with dimension') || processedStep.includes('Resultado de soma com dimensão') ||
      processedStep.startsWith('Final result:') || processedStep.startsWith('Resultado final:')) {
    return (
      <div key={index} className="p-3 bg-green-50 dark:bg-green-900/30 rounded-md ml-4 border-l-2 border-green-300 dark:border-green-600 my-2">
        <div className="flex items-center">
          <HiOutlineCheck className="text-green-600 dark:text-green-400 mr-2 flex-shrink-0 h-5 w-5" />
          <span className="text-green-700 dark:text-green-300 font-medium">{processedStep}</span>
        </div>
      </div>
    );
  }

  // Gerencia o resultado de soma e subtração de matrizes
  // Gerencia especificamente o formato "Result: sum matrix" e "Result: difference matrix"
  if ((processedStep.startsWith('Result:') && (processedStep.includes('sum matrix') || processedStep.includes('difference matrix'))) || 
      (processedStep.startsWith('Resultado:') && (processedStep.includes('Matriz soma') || processedStep.includes('Matriz diferença')))) {
    return (
      <div key={index} className="p-3 bg-green-50 dark:bg-green-900/30 rounded-md ml-4 border-l-2 border-green-300 dark:border-green-600 my-2">
        <div className="flex items-center">
          <HiOutlineCheck className="text-green-600 dark:text-green-400 mr-2 flex-shrink-0 h-5 w-5" />
          <span className="text-green-700 dark:text-green-300 font-medium">{processedStep}</span>
        </div>
      </div>
    );
  }

  // Gerencia resultados de multiplicação de matrizes
  if ((processedStep.startsWith('Result:') && processedStep.includes('Matrix Multiplication')) || 
      (processedStep.startsWith('Final result:') && processedStep.includes('Multiplication')) ||
      (processedStep.startsWith('Resultado:') && processedStep.includes('Multiplicação')) ||
      (processedStep.startsWith('Resultado final:') && processedStep.includes('Multiplicação')) ||
      processedStep.startsWith('Result of A × B with dimension') ||
      processedStep.startsWith('Resultado de A × B com dimensão')) {
    return (
      <div key={index} className="p-3 bg-green-50 dark:bg-green-900/30 rounded-md ml-4 border-l-2 border-green-300 dark:border-green-600 my-2">
        <div className="flex items-center">
          <HiOutlineCheck className="text-green-600 dark:text-green-400 mr-2 flex-shrink-0 h-5 w-5" />
          <span className="text-green-700 dark:text-green-300 font-medium">{processedStep}</span>
        </div>
      </div>
    );
  }

  // Handle para cabeçalho de passo
  const stepMatch = processedStep.match(/^(Passo \d+:|Step \d+:)(.*)$/);
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
  const commonStepMatch = processedStep.match(commonStepRegex);
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

  // Dimensões das matrizes (especialmente para step 2)
  const dimensionsMatch = processedStep.match(/^(Verificando dimensões:|Checking dimensions:)(.*)$/);
  if (dimensionsMatch || 
      processedStep.includes('dimensão') || processedStep.includes('dimension') || 
      processedStep.includes('Para somar duas matrizes') || processedStep.includes('To add two matrices') ||
      processedStep.includes('Para subtrair duas matrizes') || processedStep.includes('To subtract two matrices')) {
    return (
      <div key={index} className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-md ml-4 border-l-2 border-blue-300 dark:border-blue-600 my-2">
        <div className="flex items-center">
          <HiOutlineTable className="text-blue-600 dark:text-blue-400 mr-2 flex-shrink-0 h-5 w-5" />
          <span className="text-blue-700 dark:text-blue-300 font-medium">{processedStep}</span>
        </div>
      </div>
    );
  }

  // Expressão original
  const originalExpressionMatch = processedStep.match(/^(Expressão original|Matriz original|Sistema original|Original expression|Original matrix|Original system)(.*)$/);
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
  const matrixDefinitionMatch = processedStep.match(/^(Matriz:|Definindo matriz:|Matriz de dimensão|Matrix:|Defining matrix:|Matrix of dimension)(.*)$/);
  if (matrixDefinitionMatch || 
      (!processedStep.startsWith('Result:') && !processedStep.startsWith('Resultado:') && 
        ((processedStep.includes('matriz') && !processedStep.includes('determinante') && !processedStep.includes('inversa')) ||
        (processedStep.includes('matrix') && !processedStep.includes('determinant') && !processedStep.includes('inverse'))))) {
    return (
      <div key={index} className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-md ml-4 border-l-2 border-indigo-300 dark:border-indigo-600 my-2">
        <div className="flex items-center">
          <HiOutlineTable className="text-indigo-600 dark:text-indigo-400 mr-2 flex-shrink-0 h-5 w-5" />
          <span className="text-indigo-700 dark:text-indigo-300 font-medium">{processedStep}</span>
        </div>
      </div>
    );
  }

  // Adição de matrizes
  const matrixAdditionMatch = processedStep.match(/^(Adicionando matrizes:|Soma de matrizes:|Adding matrices:|Sum of matrices:)(.*)$/);
  if (matrixAdditionMatch || processedStep.includes('adicionar matrizes') || processedStep.includes('soma das matrizes') ||
      processedStep.includes('add matrices') || processedStep.includes('sum of matrices')) {
    return (
      <div key={index} className="p-3 bg-green-50 dark:bg-green-900/30 rounded-md ml-4 border-l-2 border-green-300 dark:border-green-600 my-2">
        <div className="flex items-center">
          <HiOutlinePlusCircle className="text-green-600 dark:text-green-400 mr-2 flex-shrink-0 h-5 w-5" />
          <span className="text-green-700 dark:text-green-300 font-medium">{processedStep}</span>
        </div>
      </div>
    );
  }

  // Subtração de matrizes
  const matrixSubtractionMatch = processedStep.match(/^(Subtraindo matrizes:|Subtração de matrizes:|Subtracting matrices:|Subtraction of matrices:)(.*)$/);
  if (matrixSubtractionMatch || processedStep.includes('subtrair matrizes') || processedStep.includes('diferença entre matrizes') ||
      processedStep.includes('subtract matrices') || processedStep.includes('difference between matrices')) {
    return (
      <div key={index} className="p-3 bg-red-50 dark:bg-red-900/30 rounded-md ml-4 border-l-2 border-red-300 dark:border-red-600 my-2">
        <div className="flex items-center">
          <HiOutlineMinusCircle className="text-red-600 dark:text-red-400 mr-2 flex-shrink-0 h-5 w-5" />
          <span className="text-red-700 dark:text-red-300 font-medium">{processedStep}</span>
        </div>
      </div>
    );
  }

  // Multiplicação de matrizes
  const matrixMultiplicationMatch = processedStep.match(/^(Multiplicando matrizes:|Multiplicação de matrizes:|Multiplying matrices:|Matrix multiplication:)(.*)$/);
  if (matrixMultiplicationMatch || processedStep.includes('multiplicar matrizes') || processedStep.includes('produto de matrizes') ||
      processedStep.includes('multiply matrices') || processedStep.includes('product of matrices')) {
    return (
      <div key={index} className="p-3 bg-amber-50 dark:bg-amber-900/30 rounded-md ml-4 border-l-2 border-amber-300 dark:border-amber-600 my-2">
        <div className="flex items-center">
          <HiOutlineXCircle className="text-amber-600 dark:text-amber-400 mr-2 flex-shrink-0 h-5 w-5" />
          <span className="text-amber-700 dark:text-amber-300 font-medium">{processedStep}</span>
        </div>
      </div>
    );
  }

  // Multiplicação por escalar
  const scalarMultiplicationMatch = processedStep.match(/^(Multiplicação por escalar:|Escalar:|Scalar multiplication:|Scalar:)(.*)$/);
  if (scalarMultiplicationMatch || processedStep.includes('multiplicar por escalar') || processedStep.includes('escalar') ||
      processedStep.includes('multiply by scalar') || processedStep.includes('scalar')) {
    return (
      <div key={index} className="p-3 bg-yellow-50 dark:bg-yellow-900/30 rounded-md ml-4 border-l-2 border-yellow-300 dark:border-yellow-600 my-2">
        <div className="flex items-center">
          <HiOutlineCalculator className="text-yellow-600 dark:text-yellow-400 mr-2 flex-shrink-0 h-5 w-5" />
          <span className="text-yellow-700 dark:text-yellow-300 font-medium">{processedStep}</span>
        </div>
      </div>
    );
  }

  // Transposta de matriz
  const transposeMatch = processedStep.match(/^(Transposta:|Calculando transposta:|Transpose:|Calculating transpose:)(.*)$/);
  if (transposeMatch || processedStep.includes('transposta') || processedStep.includes('transposição') ||
      processedStep.includes('transpose') || processedStep.includes('transposition')) {
    return (
      <div key={index} className="p-3 bg-cyan-50 dark:bg-cyan-900/30 rounded-md ml-4 border-l-2 border-cyan-300 dark:border-cyan-600 my-2">
        <div className="flex items-center">
          <HiOutlineSwitchHorizontal className="text-cyan-600 dark:text-cyan-400 mr-2 flex-shrink-0 h-5 w-5" />
          <span className="text-cyan-700 dark:text-cyan-300 font-medium">{processedStep}</span>
        </div>
      </div>
    );
  }

  // Cálculo de determinante
  const determinantMatch = processedStep.match(/^(Calculando:|Calculating)(.*)$/);
  if (determinantMatch || processedStep.includes('Calculando determinante') || processedStep.includes('Calculating determinant')) {
    return (
      <div key={index} className="p-3 bg-yellow-50 dark:bg-yellow-900/30 rounded-md ml-4 border-l-2 border-yellow-300 dark:border-yellow-600 my-2">
        <div className="flex items-center">
          <HiOutlineCalculator className="text-yellow-600 dark:text-yellow-400 mr-2 flex-shrink-0 h-5 w-5" />
          <span className="text-yellow-700 dark:text-yellow-300 font-medium">{processedStep}</span>
        </div>
      </div>
    );
  }

  // Matriz inversa
  const inverseMatch = processedStep.match(/^(Matriz inversa:|Calculando inversa:|Inverse matrix:|Calculating inverse:)(.*)$/);
  if (inverseMatch || processedStep.includes('inversa') || processedStep.includes('inversão') ||
      processedStep.includes('inverse') || processedStep.includes('inversion')) {
    return (
      <div key={index} className="p-3 bg-pink-50 dark:bg-pink-900/30 rounded-md ml-4 border-l-2 border-pink-300 dark:border-pink-600 my-2">
        <div className="flex items-center">
          <HiOutlineRefresh className="text-pink-600 dark:text-pink-400 mr-2 flex-shrink-0 h-5 w-5" />
          <span className="text-pink-700 dark:text-pink-300 font-medium">{processedStep}</span>
        </div>
      </div>
    );
  }

  // Cofactor matrix and Adjoint matrix
  const cofactorAdjointMatch = processedStep.match(/^(Matriz de cofatores:|Matriz adjunta:|Cofactor matrix:|Adjoint matrix:|Input matrix|Matriz de entrada|Matrix A|Matrix B|Matriz A|Matriz B)(.*)$/);
  if (cofactorAdjointMatch) {
    return (
      <div key={index} className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-md ml-4 border-l-2 border-indigo-300 dark:border-indigo-600 my-2">
        <div className="flex items-center">
          <HiOutlineTable className="text-indigo-600 dark:text-indigo-400 mr-2 flex-shrink-0 h-5 w-5" />
          <span className="text-indigo-700 dark:text-indigo-300 font-medium">{processedStep}</span>
        </div>
      </div>
    );
  }

  // Eliminação gaussiana
  const gaussianMatch = processedStep.match(/^(Eliminação gaussiana:|Aplicando Gauss:|Gaussian elimination:|Applying Gauss:)(.*)$/);
  if (gaussianMatch || processedStep.includes('eliminação gaussiana') || processedStep.includes('Gauss-Jordan') || 
      processedStep.includes('pivô') || processedStep.includes('gaussian elimination') || 
      processedStep.includes('Gauss-Jordan') || processedStep.includes('pivot')) {
    return (
      <div key={index} className="p-3 bg-teal-50 dark:bg-teal-900/30 rounded-md ml-4 border-l-2 border-teal-300 dark:border-teal-600 my-2">
        <div className="flex items-center">
          <HiOutlineArrowCircleRight className="text-teal-600 dark:text-teal-400 mr-2 flex-shrink-0 h-5 w-5" />
          <span className="text-teal-700 dark:text-teal-300 font-medium">{processedStep}</span>
        </div>
      </div>
    );
  }

  // Operações nas linhas
  const rowOpMatch = processedStep.match(/^(Operação nas linhas:|Trocando linhas:|Multiplicando linha:|Somando linhas:|Row operation:|Swapping rows:|Multiplying row:|Adding rows:)(.*)$/);
  if (rowOpMatch || processedStep.includes('linha') || (processedStep.includes('L') && processedStep.includes('→')) ||
      processedStep.includes('row') || (processedStep.includes('R') && processedStep.includes('→'))) {
    return (
      <div key={index} className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-md ml-4 border-l-2 border-blue-300 dark:border-blue-600 my-2">
        <div className="flex items-center">
          <HiOutlineArrowCircleRight className="text-blue-600 dark:text-blue-400 mr-2 flex-shrink-0 h-5 w-5" />
          <span className="text-blue-700 dark:text-blue-300 font-medium">{processedStep}</span>
        </div>
      </div>
    );
  }

  // Sistema de equações
  const systemMatch = processedStep.match(/^(Sistema de equações:|Resolvendo sistema:|System of equations:|Solving system:)(.*)$/);
  if (systemMatch || processedStep.includes('sistema') || processedStep.includes('equações lineares') ||
      processedStep.includes('system') || processedStep.includes('linear equations')) {
    return (
      <div key={index} className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-md ml-4 border-l-2 border-indigo-300 dark:border-indigo-600 my-2">
        <div className="flex items-center">
          <HiOutlineDocumentText className="text-indigo-600 dark:text-indigo-400 mr-2 flex-shrink-0 h-5 w-5" />
          <span className="text-indigo-700 dark:text-indigo-300 font-medium">{processedStep}</span>
        </div>
      </div>
    );
  }

  // Autovalores e autovetores
  const eigenMatch = processedStep.match(/^(Autovalores:|Autovetores:|Calculando autovalores:|Eigenvalues:|Eigenvectors:|Calculating eigenvalues:)(.*)$/);
  if (eigenMatch || processedStep.includes('autovalor') || processedStep.includes('autovetor') || processedStep.includes('eigen') ||
      processedStep.includes('eigenvalue') || processedStep.includes('eigenvector')) {
    return (
      <div key={index} className="p-3 bg-violet-50 dark:bg-violet-900/30 rounded-md ml-4 border-l-2 border-violet-300 dark:border-violet-600 my-2">
        <div className="flex items-center">
          <HiOutlineCalculator className="text-violet-600 dark:text-violet-400 mr-2 flex-shrink-0 h-5 w-5" />
          <span className="text-violet-700 dark:text-violet-300 font-medium">{processedStep}</span>
        </div>
      </div>
    );
  }

  // Verificação
  const verificationMatch = processedStep.match(/^(Verificação:|Verificando resultado:|Verification:|Verifying result:|Verificando as propriedades de|Verifying the properties of|Verifying commutative property|Verifying associative property|Verificando a propriedade)(.*)$/);
  if (verificationMatch || processedStep.includes('verificar') || processedStep.includes('conferir') ||
      processedStep.includes('verify') || processedStep.includes('check') || 
      processedStep.includes('matrix_operations.steps.checking_commutative') ||
      processedStep.includes('matrix_operations.steps.commutative_explanation') ||
      processedStep.includes('matrix_operations.steps.checking_non_commutative') ||
      processedStep.includes('matrix_operations.steps.non_commutative_explanation') ||
      processedStep.includes('matrix_operations.steps.checking_associative') ||
      processedStep.includes('matrix_operations.steps.associative_explanation') ||
      processedStep.includes('matrix_operations.steps.relation_with_addition') ||
      processedStep.includes('matrix_operations.steps.relation_explanation')) {
    
    // Para passos que são chaves de tradução, obtenha o valor traduzido
    const translatedStep = processedStep.includes('matrix_operations.steps.') 
      ? processedStep.startsWith('matrices:') 
        ? t(processedStep)
        : t(`matrices:${processedStep}`)
      : processedStep;
    
    return (
      <div key={index} className="p-3 bg-purple-50 dark:bg-purple-900/30 rounded-md ml-4 border-l-2 border-purple-300 dark:border-purple-600 my-2">
        <div className="flex items-center">
          <HiOutlineCheckCircle className="text-purple-600 dark:text-purple-400 mr-2 flex-shrink-0 h-5 w-5" />
          <span className="text-purple-700 dark:text-purple-300 font-medium">
            {translatedStep}
          </span>
        </div>
      </div>
    );
  }

  // Resultados
  const resultMatch = processedStep.match(/^(Resultado:|Resultado final:|Solução:|Result:|Final result:|Solution:)(.*)$/);
  if (resultMatch || processedStep.includes('solução do sistema') || processedStep.includes('concluído') ||
      processedStep.includes('system solution') || processedStep.includes('completed')) {
    return (
      <div key={index} className="p-3 bg-green-50 dark:bg-green-900/30 rounded-md ml-4 border-l-2 border-green-300 dark:border-green-600 my-2">
        <div className="flex items-center">
          <HiOutlineCheck className="text-green-600 dark:text-green-400 mr-2 flex-shrink-0 h-5 w-5" />
          <span className="text-green-700 dark:text-green-300 font-medium">{processedStep}</span>
        </div>
      </div>
    );
  }

  // Padrão para verificação concluída
  if (typeof processedStep === 'string' && processedStep.startsWith('verification.completed:')) {
    const cleanedStep = cleanVerificationStep(processedStep);
    
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
      <span className="text-gray-800 dark:text-gray-200">
        {processedStep.includes(':') && processedStep.includes('.') ? t(processedStep) : processedStep}
      </span>
    </div>
  );
};

export default MatricesRenderer; 