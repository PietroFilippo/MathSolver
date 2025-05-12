import React from 'react';
import { 
  HiCalculator, 
  HiInformationCircle, 
  HiX
} from 'react-icons/hi';
import { 
  getMatrixMultiplicationExamples, 
  getScalarMultiplicationExamples 
} from '../../utils/mathUtilsMatrizes';
import { useMatrizMultiplicationSolver } from '../../hooks/matrizes/useMatrizMultiplicacaoSolver';
import StepByStepExplanation from '../../components/StepByStepExplanation';
import ConceitoMatematico from '../../components/ConceitoMatematico';
import { useTranslation } from 'react-i18next';

const ResolvedorMultiplicacaoMatrizes: React.FC = () => {
  const { 
    state, 
    dispatch, 
    handleSolve, 
    applyMatrixExample, 
    applyScalarExample 
  } = useMatrizMultiplicationSolver();
  const { t } = useTranslation(['matrices', 'translation']);

  // Renderiza a matriz como uma tabela HTML
  const renderMatrix = (matrix: number[][]) => {
    if (!matrix || matrix.length === 0) return null;
    
    return (
      <table className="border-collapse mx-auto my-2">
        <tbody>
          {matrix.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((value, colIndex) => (
                <td 
                  key={colIndex} 
                  className="border border-gray-300 dark:border-gray-600 p-2 text-center"
                >
                  {value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  // Função para renderizar a equação da operação da matriz com os símbolos visuais
  const renderMatrixOperation = () => {
    if (state.operationType === 'matrix' && (!state.parsedMatrixA || !state.parsedMatrixB)) return null;
    if (state.operationType === 'scalar' && !state.parsedMatrixA) return null;
    
    if (state.operationType === 'matrix') {
      return (
        <div className="flex flex-col items-center justify-center my-4 space-y-2">
          <div className="flex items-center space-x-4 flex-wrap justify-center">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('matrices:matrix_operations.multiplication.matrix_a')}</p>
              {renderMatrix(state.parsedMatrixA!)}
            </div>
            
            <div className="flex items-center justify-center h-full">
              <HiX className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
            </div>
            
            <div className="text-center">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('matrices:matrix_operations.multiplication.matrix_b')}</p>
              {renderMatrix(state.parsedMatrixB!)}
            </div>
            
            <div className="flex items-center justify-center h-full">
              <span className="text-xl font-bold text-gray-700 dark:text-gray-300">=</span>
            </div>
            
            <div className="text-center">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('matrices:matrix_operations.multiplication.result')}</p>
              {state.result && renderMatrix(state.result)}
            </div>
          </div>
        </div>
      );
    } else { // Multiplicação por escalar
      return (
        <div className="flex flex-col items-center justify-center my-4 space-y-2">
          <div className="flex items-center space-x-4 flex-wrap justify-center">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('matrices:matrix_operations.multiplication.scalar_value')}</p>
              <div className="flex items-center justify-center h-12 w-12 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700">
                <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{state.scalar}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-center h-full">
              <HiX className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
            </div>
            
            <div className="text-center">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('matrices:matrix_operations.multiplication.matrix_a')}</p>
              {renderMatrix(state.parsedMatrixA!)}
            </div>
            
            <div className="flex items-center justify-center h-full">
              <span className="text-xl font-bold text-gray-700 dark:text-gray-300">=</span>
            </div>
            
            <div className="text-center">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('matrices:matrix_operations.multiplication.result')}</p>
              {state.result && renderMatrix(state.result)}
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <HiCalculator className="h-6 w-6 text-indigo-600 dark:text-indigo-400 mr-2" />
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          {t('matrices:matrix_operations.multiplication.title')}
        </h2>
      </div>

      <div className="resolver-container p-6 mb-8">
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          {t('matrices:matrix_operations.multiplication.description')}
        </p>

        <div className="mb-6">
          <div className="mb-4">
            <label htmlFor="matrixA" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('matrices:matrix_operations.multiplication.matrix_a')}
            </label>
            <textarea
              id="matrixA"
              rows={4}
              value={state.matrixA}
              onChange={(e) => dispatch({ type: 'SET_MATRIX_A', value: e.target.value })}
              className="block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400"
              placeholder="Ex: 1 2 3; 4 5 6; 7 8 9"
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {t('matrices:matrix_operations.multiplication.input_format')}
            </p>
            
            {state.parsedMatrixA && (
              <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('matrices:matrix_operations.multiplication.preview')}:</p>
                {renderMatrix(state.parsedMatrixA)}
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {t('matrices:matrix_operations.multiplication.dimension')}: {state.parsedMatrixA.length}×{state.parsedMatrixA[0]?.length}
                </p>
              </div>
            )}
          </div>
          
          {state.operationType === 'matrix' ? (
            <div className="mb-4">
              <label htmlFor="matrixB" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('matrices:matrix_operations.multiplication.matrix_b')}
              </label>
              <textarea
                id="matrixB"
                rows={4}
                value={state.matrixB}
                onChange={(e) => dispatch({ type: 'SET_MATRIX_B', value: e.target.value })}
                className="block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400"
                placeholder="Ex: 9 8 7; 6 5 4; 3 2 1"
              />
              
              {state.parsedMatrixB && (
                <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('matrices:matrix_operations.multiplication.preview')}:</p>
                  {renderMatrix(state.parsedMatrixB)}
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {t('matrices:matrix_operations.multiplication.dimension')}: {state.parsedMatrixB.length}×{state.parsedMatrixB[0]?.length}
                  </p>
                </div>
              )}
              
              <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                <div className="flex items-start">
                  <HiInformationCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      <span className="font-medium">{t('matrices:matrix_operations.multiplication.compatibility_requirement.title')}:</span> {t('matrices:matrix_operations.multiplication.compatibility_requirement.description')}
                    </p>
                    {state.parsedMatrixA && state.parsedMatrixB && (
                      <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                        {state.parsedMatrixA[0]?.length === state.parsedMatrixB.length
                          ? t('matrices:matrix_operations.multiplication.compatibility_requirement.compatible', {
                              columnsA: state.parsedMatrixA[0]?.length,
                              rowsB: state.parsedMatrixB.length
                            })
                          : t('matrices:matrix_operations.multiplication.compatibility_requirement.incompatible', {
                              columnsA: state.parsedMatrixA[0]?.length,
                              rowsB: state.parsedMatrixB.length
                            })
                        }
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="mb-4">
              <label htmlFor="scalar" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('matrices:matrix_operations.multiplication.scalar_value')}
              </label>
              <input
                id="scalar"
                type="text"
                value={state.scalar}
                onChange={(e) => dispatch({ type: 'SET_SCALAR', value: e.target.value })}
                className="w-32 p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400"
                placeholder="Ex: 2.5"
              />
              
              <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                <div className="flex items-start">
                  <HiInformationCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    {t('matrices:matrix_operations.multiplication.scalar_info')}
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('matrices:matrix_operations.multiplication.operation_type')}
            </label>
            <div className="flex space-x-6 mb-2">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio h-4 w-4 text-indigo-600 dark:text-indigo-400"
                  checked={state.operationType === 'matrix'}
                  onChange={() => dispatch({ type: 'SET_OPERATION_TYPE', value: 'matrix' })}
                />
                <span className="ml-2 text-gray-700 dark:text-gray-300">{t('matrices:matrix_operations.multiplication.matrix_multiplication')}</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio h-4 w-4 text-indigo-600 dark:text-indigo-400"
                  checked={state.operationType === 'scalar'}
                  onChange={() => dispatch({ type: 'SET_OPERATION_TYPE', value: 'scalar' })}
                />
                <span className="ml-2 text-gray-700 dark:text-gray-300">{t('matrices:matrix_operations.multiplication.scalar_multiplication')}</span>
              </label>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('matrices:matrix_operations.multiplication.examples')}
            </label>
            <div className="flex flex-wrap gap-2">
              {state.operationType === 'matrix' 
                ? getMatrixMultiplicationExamples().map((example, index) => (
                    <button
                      key={index}
                      onClick={() => applyMatrixExample(example)}
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm rounded-full transition-colors"
                    >
                      {example.translationKey 
                        ? t(`translation:common.matrix_examples.${example.translationKey}`) 
                        : example.description}
                    </button>
                  ))
                : getScalarMultiplicationExamples().map((example, index) => (
                    <button
                      key={index}
                      onClick={() => applyScalarExample(example)}
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm rounded-full transition-colors"
                    >
                      {example.translationKey 
                        ? t(`translation:common.matrix_examples.${example.translationKey}`) 
                        : example.description}
                    </button>
                  ))
              }
            </div>
          </div>
          
          <button
            onClick={handleSolve}
            className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-medium py-2 px-6 rounded-md transition-colors duration-300 mt-4"
          >
            {t('matrices:matrix_operations.multiplication.calculate')}
          </button>
        </div>
        
        {state.error && (
          <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 rounded-md">
            {state.error}
          </div>
        )}
      </div>
      
      {state.result && (
        <div className="space-y-6">
          <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-5">
            <h3 className="text-lg font-medium text-green-800 dark:text-green-300 mb-4">{t('matrices:matrix_operations.multiplication.result')}</h3>
            
            <div className="bg-white dark:bg-gray-800 p-4 rounded-md border border-gray-200 dark:border-gray-700">
              {renderMatrixOperation()}
            </div>
            
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md border-l-2 border-blue-300 dark:border-blue-700">
              <div className="flex items-center">
                <HiInformationCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2 flex-shrink-0" />
                <p className="text-blue-700 dark:text-blue-300 font-medium">
                  {state.operationType === 'matrix' 
                    ? t('matrices:matrix_operations.multiplication.explanation.matrix_description')
                    : t('matrices:matrix_operations.multiplication.explanation.scalar_description')}
                </p>
              </div>
            </div>
            
            <button 
              onClick={() => dispatch({ type: 'TOGGLE_EXPLANATION' })}
              className="mt-4 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 text-sm font-medium flex items-center"
            >
              <HiCalculator className="h-5 w-5 mr-1" />
              {state.showExplanation 
                ? t('matrices:matrix_operations.multiplication.explanation.hide') 
                : t('matrices:matrix_operations.multiplication.explanation.show')}
            </button>
          </div>
          
          {state.showExplanation && state.steps.length > 0 && (
            <div className="mt-8 bg-white dark:bg-gray-800 shadow-md rounded-lg p-5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center">
                  <HiCalculator className="h-6 w-6 mr-2 text-indigo-600 dark:text-indigo-400" />
                  {t('translation:common.step_by_step')}
                </h3>
              </div>
              
              <StepByStepExplanation steps={state.steps} stepType="matrices" />
              
              <ConceitoMatematico
                title={t('translation:common.mathematical_concept')}
                isOpen={state.showConceitoMatematico} 
                onToggle={() => dispatch({ type: 'TOGGLE_CONCEITO_MATEMATICO' })}
              >
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                  <div className="flex-1">
                    <h5 className="font-medium text-gray-800 dark:text-gray-100 mb-2 border-b border-gray-200 dark:border-gray-700 pb-1">{t('matrices:matrix_operations.mathematical_concept.definition_title')}</h5>
                    
                    {state.operationType === 'matrix' ? (
                      <>
                        <p className="text-gray-700 dark:text-gray-300 mb-2">
                          {t('matrices:matrix_operations.multiplication.concept.definition')}
                        </p>
                        
                        <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-md border-l-2 border-yellow-300 dark:border-yellow-600 mb-3">
                          <p className="text-sm text-yellow-800 dark:text-yellow-300">
                            <span className="font-semibold">{t('matrices:matrix_operations.multiplication.concept.important_requirement')}:</span> {t('matrices:matrix_operations.multiplication.concept.dimension_requirement')}
                          </p>
                        </div>
                        
                        <div className="bg-white dark:bg-gray-700 p-3 rounded-md border border-gray-100 dark:border-gray-600 shadow-sm">
                          <h6 className="text-lg font-medium text-indigo-700 dark:text-indigo-300 mb-1">{t('matrices:matrix_operations.multiplication.concept.formula_title')}</h6>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {t('matrices:matrix_operations.multiplication.concept.formula_description')}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 font-mono">
                            {t('matrices:matrix_operations.multiplication.concept.formula_expression')}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {t('matrices:matrix_operations.multiplication.concept.formula_explanation')}
                          </p>
                        </div>

                        <h6 className="text-base font-medium text-gray-800 dark:text-gray-100 mt-4 mb-2">{t('matrices:matrix_operations.multiplication.concept.visual_interpretation')}</h6>
                        <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                          {t('matrices:matrix_operations.multiplication.concept.calculation_explanation')}
                        </p>
                        <ol className="text-sm text-gray-700 dark:text-gray-300 list-decimal list-inside space-y-1 ml-2">
                          <li>{t('matrices:matrix_operations.multiplication.concept.step1')}</li>
                          <li>{t('matrices:matrix_operations.multiplication.concept.step2')}</li>
                          <li>{t('matrices:matrix_operations.multiplication.concept.step3')}</li>
                          <li>{t('matrices:matrix_operations.multiplication.concept.step4')}</li>
                        </ol>

                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md border-l-2 border-blue-300 dark:border-blue-700 my-3">
                          <h6 className="text-blue-700 dark:text-blue-300 font-medium mb-1">{t('matrices:matrix_operations.multiplication.concept.visual_example_title')}</h6>
                          <p className="text-sm text-blue-800 dark:text-blue-200 mb-2">
                            {t('matrices:matrix_operations.multiplication.concept.example_description')}
                          </p>
                          <p className="text-sm text-blue-800 dark:text-blue-200">
                            {t('matrices:matrix_operations.multiplication.concept.example_formula')}
                          </p>
                        </div>

                        <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-md border-l-2 border-indigo-300 dark:border-indigo-700 my-3">
                          <h6 className="text-indigo-700 dark:text-indigo-300 font-medium mb-1">{t('matrices:matrix_operations.multiplication.concept.specific_applications_title')}</h6>
                          <ul className="text-sm text-gray-700 dark:text-gray-300 list-disc list-inside space-y-1">
                            <li><span className="font-medium">{t('matrices:matrix_operations.multiplication.concept.application1_title')}:</span> {t('matrices:matrix_operations.multiplication.concept.application1_description')}</li>
                            <li><span className="font-medium">{t('matrices:matrix_operations.multiplication.concept.application2_title')}:</span> {t('matrices:matrix_operations.multiplication.concept.application2_description')}</li>
                            <li><span className="font-medium">{t('matrices:matrix_operations.multiplication.concept.application3_title')}:</span> {t('matrices:matrix_operations.multiplication.concept.application3_description')}</li>
                          </ul>
                        </div>
                        
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md border-l-2 border-blue-300 dark:border-blue-700 mb-3">
                          <h6 className="text-blue-700 dark:text-blue-300 font-medium mb-1">{t('matrices:matrix_operations.multiplication.concept.practical_applications_title')}</h6>
                          <ul className="text-sm text-gray-700 dark:text-gray-300 list-disc list-inside space-y-1">
                            <li><span className="font-medium">{t('matrices:matrix_operations.multiplication.concept.practical1_title')}:</span> {t('matrices:matrix_operations.multiplication.concept.practical1_description')}</li>
                            <li><span className="font-medium">{t('matrices:matrix_operations.multiplication.concept.practical2_title')}:</span> {t('matrices:matrix_operations.multiplication.concept.practical2_description')}</li>
                            <li><span className="font-medium">{t('matrices:matrix_operations.multiplication.concept.practical3_title')}:</span> {t('matrices:matrix_operations.multiplication.concept.practical3_description')}</li>
                            <li><span className="font-medium">{t('matrices:matrix_operations.multiplication.concept.practical4_title')}:</span> {t('matrices:matrix_operations.multiplication.concept.practical4_description')}</li>
                            <li><span className="font-medium">{t('matrices:matrix_operations.multiplication.concept.practical5_title')}:</span> {t('matrices:matrix_operations.multiplication.concept.practical5_description')}</li>
                            <li><span className="font-medium">{t('matrices:matrix_operations.multiplication.concept.practical6_title')}:</span> {t('matrices:matrix_operations.multiplication.concept.practical6_description')}</li>
                            <li><span className="font-medium">{t('matrices:matrix_operations.multiplication.concept.practical7_title')}:</span> {t('matrices:matrix_operations.multiplication.concept.practical7_description')}</li>
                            <li><span className="font-medium">{t('matrices:matrix_operations.multiplication.concept.practical8_title')}:</span> {t('matrices:matrix_operations.multiplication.concept.practical8_description')}</li>
                          </ul>
                        </div>
                      </>
                    ) : (
                      <>
                        <p className="text-gray-700 dark:text-gray-300 mb-2">
                          {t('matrices:matrix_operations.multiplication.concept.scalar_definition')}
                        </p>
                        
                        <div className="bg-white dark:bg-gray-700 p-3 rounded-md border border-gray-100 dark:border-gray-600 shadow-sm">
                          <h6 className="text-lg font-medium text-indigo-700 dark:text-indigo-300 mb-1">{t('matrices:matrix_operations.multiplication.concept.formula_title')}</h6>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {t('matrices:matrix_operations.multiplication.concept.scalar_formula_description')}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 font-mono">
                            {t('matrices:matrix_operations.multiplication.concept.scalar_formula_expression')}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {t('matrices:matrix_operations.multiplication.concept.scalar_formula_explanation')}
                          </p>
                        </div>

                        <h6 className="text-base font-medium text-gray-800 dark:text-gray-100 mt-4 mb-2">{t('matrices:matrix_operations.multiplication.concept.geometric_interpretation')}</h6>
                        <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                          {t('matrices:matrix_operations.multiplication.concept.geometric_description')}
                        </p>
                        <ul className="text-sm text-gray-700 dark:text-gray-300 list-disc list-inside space-y-1 ml-2">
                          <li><span className="font-medium">{t('matrices:matrix_operations.multiplication.concept.geometric1_title')}</span> {t('matrices:matrix_operations.multiplication.concept.geometric1_description')}</li>
                          <li><span className="font-medium">{t('matrices:matrix_operations.multiplication.concept.geometric2_title')}</span> {t('matrices:matrix_operations.multiplication.concept.geometric2_description')}</li>
                          <li><span className="font-medium">{t('matrices:matrix_operations.multiplication.concept.geometric3_title')}</span> {t('matrices:matrix_operations.multiplication.concept.geometric3_description')}</li>
                          <li><span className="font-medium">{t('matrices:matrix_operations.multiplication.concept.geometric4_title')}</span> {t('matrices:matrix_operations.multiplication.concept.geometric4_description')}</li>
                        </ul>

                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md border-l-2 border-blue-300 dark:border-blue-700 my-3">
                          <h6 className="text-blue-700 dark:text-blue-300 font-medium mb-1">{t('matrices:matrix_operations.multiplication.concept.visual_example_title')}</h6>
                          <p className="text-sm text-blue-800 dark:text-blue-200 mb-2">
                            {t('matrices:matrix_operations.multiplication.concept.scalar_example_description')}
                          </p>
                          <div className="flex items-center justify-center text-blue-800 dark:text-blue-200 font-mono">
                            <div>{t('matrices:matrix_operations.multiplication.concept.scalar_example_expression')}</div>
                          </div>
                        </div>

                        <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-md border-l-2 border-indigo-300 dark:border-indigo-700 my-3">
                          <h6 className="text-indigo-700 dark:text-indigo-300 font-medium mb-1">{t('matrices:matrix_operations.multiplication.concept.specific_applications_title')}</h6>
                          <ul className="text-sm text-gray-700 dark:text-gray-300 list-disc list-inside space-y-1">
                            <li><span className="font-medium">{t('matrices:matrix_operations.multiplication.concept.scalar_application1_title')}:</span> {t('matrices:matrix_operations.multiplication.concept.scalar_application1_description')}</li>
                            <li><span className="font-medium">{t('matrices:matrix_operations.multiplication.concept.scalar_application2_title')}:</span> {t('matrices:matrix_operations.multiplication.concept.scalar_application2_description')}</li>
                            <li><span className="font-medium">{t('matrices:matrix_operations.multiplication.concept.scalar_application3_title')}:</span> {t('matrices:matrix_operations.multiplication.concept.scalar_application3_description')}</li>
                            <li><span className="font-medium">{t('matrices:matrix_operations.multiplication.concept.scalar_application4_title')}:</span> {t('matrices:matrix_operations.multiplication.concept.scalar_application4_description')}</li>
                          </ul>
                        </div>
                        
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md border-l-2 border-blue-300 dark:border-blue-700 mb-3">
                          <h6 className="text-blue-700 dark:text-blue-300 font-medium mb-1">{t('matrices:matrix_operations.multiplication.concept.practical_applications_title')}</h6>
                          <ul className="text-sm text-gray-700 dark:text-gray-300 list-disc list-inside space-y-1">
                            <li><span className="font-medium">{t('matrices:matrix_operations.multiplication.concept.practical1_title')}:</span> {t('matrices:matrix_operations.multiplication.concept.practical1_description')}</li>
                            <li><span className="font-medium">{t('matrices:matrix_operations.multiplication.concept.practical2_title')}:</span> {t('matrices:matrix_operations.multiplication.concept.practical2_description')}</li>
                            <li><span className="font-medium">{t('matrices:matrix_operations.multiplication.concept.practical3_title')}:</span> {t('matrices:matrix_operations.multiplication.concept.practical3_description')}</li>
                            <li><span className="font-medium">{t('matrices:matrix_operations.multiplication.concept.practical4_title')}:</span> {t('matrices:matrix_operations.multiplication.concept.practical4_description')}</li>
                            <li><span className="font-medium">{t('matrices:matrix_operations.multiplication.concept.practical5_title')}:</span> {t('matrices:matrix_operations.multiplication.concept.practical5_description')}</li>
                            <li><span className="font-medium">{t('matrices:matrix_operations.multiplication.concept.practical6_title')}:</span> {t('matrices:matrix_operations.multiplication.concept.practical6_description')}</li>
                            <li><span className="font-medium">{t('matrices:matrix_operations.multiplication.concept.practical7_title')}:</span> {t('matrices:matrix_operations.multiplication.concept.practical7_description')}</li>
                            <li><span className="font-medium">{t('matrices:matrix_operations.multiplication.concept.practical8_title')}:</span> {t('matrices:matrix_operations.multiplication.concept.practical8_description')}</li>
                          </ul>
                        </div>
                      </>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <h5 className="font-medium text-gray-800 dark:text-gray-100 mb-2 border-b border-gray-200 dark:border-gray-700 pb-1">{t('matrices:matrix_operations.mathematical_concept.properties_title')}</h5>
                    
                    {state.operationType === 'matrix' ? (
                      <>
                        <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-md border-l-2 border-green-300 dark:border-green-700 mb-3">
                          <h6 className="text-green-700 dark:text-green-300 font-medium mb-1">{t('matrices:matrix_operations.multiplication.concept.properties_title')}</h6>
                          <ul className="text-sm text-gray-700 dark:text-gray-300 list-disc list-inside mb-2 space-y-1">
                            <li><span className="font-medium">{t('matrices:matrix_operations.multiplication.concept.property1_title')}:</span> {t('matrices:matrix_operations.multiplication.concept.property1_description')}<br/>
                              <span className="text-xs ml-6">{t('matrices:matrix_operations.multiplication.concept.property1_explanation')}</span>
                            </li>
                            <li><span className="font-medium">{t('matrices:matrix_operations.multiplication.concept.property2_title')}:</span> {t('matrices:matrix_operations.multiplication.concept.property2_description')}<br/>
                              <span className="text-xs ml-6">{t('matrices:matrix_operations.multiplication.concept.property2_explanation')}</span>
                            </li>
                            <li><span className="font-medium">{t('matrices:matrix_operations.multiplication.concept.property3_title')}:</span> {t('matrices:matrix_operations.multiplication.concept.property3_description')}<br/>
                              <span className="text-xs ml-6">{t('matrices:matrix_operations.multiplication.concept.property3_explanation')}</span>
                            </li>
                            <li><span className="font-medium">{t('matrices:matrix_operations.multiplication.concept.property4_title')}:</span> {t('matrices:matrix_operations.multiplication.concept.property4_description')}<br/>
                              <span className="text-xs ml-6">{t('matrices:matrix_operations.multiplication.concept.property4_explanation')}</span>
                            </li>
                            <li><span className="font-medium">{t('matrices:matrix_operations.multiplication.concept.property5_title')}:</span> {t('matrices:matrix_operations.multiplication.concept.property5_description')}<br/>
                              <span className="text-xs ml-6">{t('matrices:matrix_operations.multiplication.concept.property5_explanation')}</span>
                            </li>
                            <li><span className="font-medium">{t('matrices:matrix_operations.multiplication.concept.property6_title')}:</span> {t('matrices:matrix_operations.multiplication.concept.property6_description')}<br/>
                              <span className="text-xs ml-6">{t('matrices:matrix_operations.multiplication.concept.property6_explanation')}</span>
                            </li>
                            <li><span className="font-medium">{t('matrices:matrix_operations.multiplication.concept.property7_title')}:</span> {t('matrices:matrix_operations.multiplication.concept.property7_description')}<br/>
                              <span className="text-xs ml-6">{t('matrices:matrix_operations.multiplication.concept.property7_explanation')}</span>
                            </li>
                          </ul>
                        </div>

                        <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-md border-l-2 border-purple-300 dark:border-purple-700 mb-3">
                          <h6 className="text-purple-700 dark:text-purple-300 font-medium mb-1">{t('matrices:matrix_operations.multiplication.concept.special_matrices_title')}</h6>
                          <ul className="text-sm text-gray-700 dark:text-gray-300 list-disc list-inside space-y-1">
                            <li><span className="font-medium">{t('matrices:matrix_operations.multiplication.concept.special1_title')}:</span> {t('matrices:matrix_operations.multiplication.concept.special1_description')}</li>
                            <li><span className="font-medium">{t('matrices:matrix_operations.multiplication.concept.special2_title')}:</span> {t('matrices:matrix_operations.multiplication.concept.special2_description')}</li>
                            <li><span className="font-medium">{t('matrices:matrix_operations.multiplication.concept.special3_title')}:</span> {t('matrices:matrix_operations.multiplication.concept.special3_description')}</li>
                            <li><span className="font-medium">{t('matrices:matrix_operations.multiplication.concept.special4_title')}:</span> {t('matrices:matrix_operations.multiplication.concept.special4_description')}</li>
                          </ul>
                        </div>

                        <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-md border-l-2 border-amber-300 dark:border-amber-700 mb-3">
                          <h6 className="text-amber-700 dark:text-amber-300 font-medium mb-1">{t('matrices:matrix_operations.multiplication.concept.examples_title')}</h6>
                          <div className="space-y-2">
                            <div>
                              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('matrices:matrix_operations.multiplication.concept.example1_title')}</p>
                              <div className="text-xs text-gray-600 dark:text-gray-400 font-mono mt-1 ml-2">
                                <div>{t('matrices:matrix_operations.multiplication.concept.example1_formula')}</div>
                              </div>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('matrices:matrix_operations.multiplication.concept.example2_title')}</p>
                              <div className="text-xs text-gray-600 dark:text-gray-400 font-mono mt-1 ml-2">
                                <div>{t('matrices:matrix_operations.multiplication.concept.example2_formula1')}</div>
                                <div>{t('matrices:matrix_operations.multiplication.concept.example2_formula2')}</div>
                                <div>{t('matrices:matrix_operations.multiplication.concept.example2_formula3')}</div>
                              </div>
                              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 ml-2">
                                {t('matrices:matrix_operations.multiplication.concept.example2_explanation')}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('matrices:matrix_operations.multiplication.concept.example3_title')}</p>
                              <div className="text-xs text-gray-600 dark:text-gray-400 font-mono mt-1 ml-2">
                                <div>{t('matrices:matrix_operations.multiplication.concept.example3_formula1')}</div>
                                <div>{t('matrices:matrix_operations.multiplication.concept.example3_formula2')}</div>
                                <div>{t('matrices:matrix_operations.multiplication.concept.example3_formula3')}</div>
                              </div>
                              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 ml-2">
                                {t('matrices:matrix_operations.multiplication.concept.example3_explanation')}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-md border-l-2 border-red-300 dark:border-red-700 mb-3">
                          <h6 className="text-red-700 dark:text-red-300 font-medium mb-1">{t('matrices:matrix_operations.multiplication.concept.common_errors_title')}</h6>
                          <ul className="text-sm text-gray-700 dark:text-gray-300 list-disc list-inside space-y-1">
                            <li>{t('matrices:matrix_operations.multiplication.concept.error1')}</li>
                            <li>{t('matrices:matrix_operations.multiplication.concept.error2')}</li>
                            <li>{t('matrices:matrix_operations.multiplication.concept.error3')}</li>
                            <li>{t('matrices:matrix_operations.multiplication.concept.error4')}</li>
                            <li>{t('matrices:matrix_operations.multiplication.concept.error5')}</li>
                          </ul>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-md border-l-2 border-green-300 dark:border-green-700 mb-3">
                          <h6 className="text-green-700 dark:text-green-300 font-medium mb-1">{t('matrices:matrix_operations.multiplication.concept.scalar_properties_title')}</h6>
                          <ul className="text-sm text-gray-700 dark:text-gray-300 list-disc list-inside mb-2 space-y-1">
                            <li><span className="font-medium">{t('matrices:matrix_operations.multiplication.concept.scalar_property1_title')}:</span> {t('matrices:matrix_operations.multiplication.concept.scalar_property1_description')}<br/>
                              <span className="text-xs ml-6">{t('matrices:matrix_operations.multiplication.concept.scalar_property1_explanation')}</span>
                            </li>
                            <li><span className="font-medium">{t('matrices:matrix_operations.multiplication.concept.scalar_property2_title')}:</span> {t('matrices:matrix_operations.multiplication.concept.scalar_property2_description')}<br/>
                              <span className="text-xs ml-6">{t('matrices:matrix_operations.multiplication.concept.scalar_property2_explanation')}</span>
                            </li>
                            <li><span className="font-medium">{t('matrices:matrix_operations.multiplication.concept.scalar_property3_title')}:</span> {t('matrices:matrix_operations.multiplication.concept.scalar_property3_description')}<br/>
                              <span className="text-xs ml-6">{t('matrices:matrix_operations.multiplication.concept.scalar_property3_explanation')}</span>
                            </li>
                            <li><span className="font-medium">{t('matrices:matrix_operations.multiplication.concept.scalar_property4_title')}:</span> {t('matrices:matrix_operations.multiplication.concept.scalar_property4_description')}<br/>
                              <span className="text-xs ml-6">{t('matrices:matrix_operations.multiplication.concept.scalar_property4_explanation')}</span>
                            </li>
                            <li><span className="font-medium">{t('matrices:matrix_operations.multiplication.concept.scalar_property5_title')}:</span> {t('matrices:matrix_operations.multiplication.concept.scalar_property5_description')}<br/>
                              <span className="text-xs ml-6">{t('matrices:matrix_operations.multiplication.concept.scalar_property5_explanation')}</span>
                            </li>
                            <li><span className="font-medium">{t('matrices:matrix_operations.multiplication.concept.scalar_property6_title')}:</span> {t('matrices:matrix_operations.multiplication.concept.scalar_property6_description')}<br/>
                              <span className="text-xs ml-6">{t('matrices:matrix_operations.multiplication.concept.scalar_property6_explanation')}</span>
                            </li>
                            <li><span className="font-medium">{t('matrices:matrix_operations.multiplication.concept.scalar_property7_title')}:</span> {t('matrices:matrix_operations.multiplication.concept.scalar_property7_description')}<br/>
                              <span className="text-xs ml-6">{t('matrices:matrix_operations.multiplication.concept.scalar_property7_explanation')}</span>
                            </li>
                          </ul>
                        </div>

                        <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-md border-l-2 border-purple-300 dark:border-purple-700 mb-3">
                          <h6 className="text-purple-700 dark:text-purple-300 font-medium mb-1">{t('matrices:matrix_operations.multiplication.concept.scalar_special_title')}</h6>
                          <ul className="text-sm text-gray-700 dark:text-gray-300 list-disc list-inside space-y-1">
                            <li><span className="font-medium">{t('matrices:matrix_operations.multiplication.concept.scalar_special1_title')}:</span> {t('matrices:matrix_operations.multiplication.concept.scalar_special1_description')}</li>
                            <li><span className="font-medium">{t('matrices:matrix_operations.multiplication.concept.scalar_special2_title')}:</span> {t('matrices:matrix_operations.multiplication.concept.scalar_special2_description')}</li>
                            <li><span className="font-medium">{t('matrices:matrix_operations.multiplication.concept.scalar_special3_title')}:</span> {t('matrices:matrix_operations.multiplication.concept.scalar_special3_description')}</li>
                            <li><span className="font-medium">{t('matrices:matrix_operations.multiplication.concept.scalar_special4_title')}:</span> {t('matrices:matrix_operations.multiplication.concept.scalar_special4_description')}</li>
                            <li><span className="font-medium">{t('matrices:matrix_operations.multiplication.concept.scalar_special5_title')}:</span> {t('matrices:matrix_operations.multiplication.concept.scalar_special5_description')}</li>
                          </ul>
                        </div>

                        <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-md border-l-2 border-amber-300 dark:border-amber-700 mb-3">
                          <h6 className="text-amber-700 dark:text-amber-300 font-medium mb-1">{t('matrices:matrix_operations.multiplication.concept.examples_title')}</h6>
                          <div className="space-y-2">
                            <div>
                              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('matrices:matrix_operations.multiplication.concept.scalar_example1_title')}</p>
                              <div className="text-xs text-gray-600 dark:text-gray-400 font-mono mt-1 ml-2">
                                <div>{t('matrices:matrix_operations.multiplication.concept.scalar_example1_formula')}</div>
                              </div>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('matrices:matrix_operations.multiplication.concept.scalar_example2_title')}</p>
                              <div className="text-xs text-gray-600 dark:text-gray-400 font-mono mt-1 ml-2">
                                <div>{t('matrices:matrix_operations.multiplication.concept.scalar_example2_formula')}</div>
                              </div>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('matrices:matrix_operations.multiplication.concept.scalar_example3_title')}</p>
                              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1 ml-2">
                                <p>{t('matrices:matrix_operations.multiplication.concept.scalar_example3_description')}</p>
                                <p>{t('matrices:matrix_operations.multiplication.concept.scalar_example3_formula')}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-md border-l-2 border-red-300 dark:border-red-700 mb-3">
                          <h6 className="text-red-700 dark:text-red-300 font-medium mb-1">{t('matrices:matrix_operations.multiplication.concept.common_errors_title')}</h6>
                          <ul className="text-sm text-gray-700 dark:text-gray-300 list-disc list-inside space-y-1">
                            <li>{t('matrices:matrix_operations.multiplication.concept.error1')}</li>
                            <li>{t('matrices:matrix_operations.multiplication.concept.error2')}</li>
                            <li>{t('matrices:matrix_operations.multiplication.concept.error3')}</li>
                            <li>{t('matrices:matrix_operations.multiplication.concept.error4')}</li>
                            <li>{t('matrices:matrix_operations.multiplication.concept.error5')}</li>
                          </ul>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </ConceitoMatematico>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ResolvedorMultiplicacaoMatrizes; 