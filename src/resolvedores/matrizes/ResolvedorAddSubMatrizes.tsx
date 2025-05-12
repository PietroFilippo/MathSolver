import React from 'react';
import { HiCalculator, HiInformationCircle, HiTable, HiPlus, HiMinus } from 'react-icons/hi';
import { getMatrixAddSubExamples } from '../../utils/mathUtilsMatrizes';
import { useMatrizAddSubSolver } from '../../hooks/matrizes/useMatrizAddSubSolver';
import StepByStepExplanation from '../../components/StepByStepExplanation';
import ConceitoMatematico from '../../components/ConceitoMatematico';
import { useTranslation } from 'react-i18next';

const ResolvedorAddSubMatrizes: React.FC = () => {
  const { state, dispatch, handleSolve, applyExample } = useMatrizAddSubSolver();
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
    if (!state.parsedMatrizA || !state.parsedMatrizB) return null;
    
    return (
      <div className="flex flex-col items-center justify-center my-4 space-y-2">
        <div className="flex items-center space-x-4">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('matrices:matrix_operations.add_sub.matrix_a')}</p>
            {renderMatrix(state.parsedMatrizA)}
          </div>
          
          <div className="flex items-center justify-center h-full">
            {state.operacao === 'soma' ? (
              <HiPlus className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
            ) : (
              <HiMinus className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
            )}
          </div>
          
          <div className="text-center">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('matrices:matrix_operations.add_sub.matrix_b')}</p>
            {renderMatrix(state.parsedMatrizB)}
          </div>
          
          <div className="flex items-center justify-center h-full">
            <span className="text-xl font-bold text-gray-700 dark:text-gray-300">=</span>
          </div>
          
          <div className="text-center">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('matrices:matrix_operations.add_sub.result')}</p>
            {state.resultado && renderMatrix(state.resultado)}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <HiTable className="h-6 w-6 text-indigo-600 dark:text-indigo-400 mr-2" />
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          {t('matrices:matrix_operations.add_sub.title')}
        </h2>
      </div>

      <div className="resolver-container p-6 mb-8">
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          {t('matrices:matrix_operations.add_sub.description')}
        </p>

        <div className="mb-6">
          <div className="mb-4">
            <label htmlFor="matrizA" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('matrices:matrix_operations.add_sub.matrix_a')}
            </label>
            <textarea
              id="matrizA"
              rows={4}
              value={state.matrizA}
              onChange={(e) => dispatch({ type: 'SET_MATRIZ_A', valor: e.target.value })}
              className="block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400"
              placeholder="Ex: 1 2 3; 4 5 6; 7 8 9"
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {t('matrices:matrix_operations.add_sub.format_description')}
            </p>
            
            {state.parsedMatrizA && (
              <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('matrices:matrix_operations.add_sub.preview')}</p>
                {renderMatrix(state.parsedMatrizA)}
              </div>
            )}
          </div>
          
          <div className="mb-4">
            <label htmlFor="matrizB" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('matrices:matrix_operations.add_sub.matrix_b')}
            </label>
            <textarea
              id="matrizB"
              rows={4}
              value={state.matrizB}
              onChange={(e) => dispatch({ type: 'SET_MATRIZ_B', valor: e.target.value })}
              className="block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400"
              placeholder="Ex: 9 8 7; 6 5 4; 3 2 1"
            />
            
            {state.parsedMatrizB && (
              <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('matrices:matrix_operations.add_sub.preview')}</p>
                {renderMatrix(state.parsedMatrizB)}
              </div>
            )}
            
            <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
              <div className="flex items-start">
                <HiInformationCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    <span className="font-medium">{t('matrices:matrix_operations.add_sub.requirement.title')}</span> {t('matrices:matrix_operations.add_sub.requirement.description')}
                  </p>
                  {state.parsedMatrizA && state.parsedMatrizB && (
                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                      {state.parsedMatrizA.length === state.parsedMatrizB.length && 
                       state.parsedMatrizA[0]?.length === state.parsedMatrizB[0]?.length
                        ? t('matrices:matrix_operations.add_sub.requirement.compatible', { 
                            rowsA: state.parsedMatrizA.length, 
                            colsA: state.parsedMatrizA[0]?.length,
                            rowsB: state.parsedMatrizB.length,
                            colsB: state.parsedMatrizB[0]?.length
                          })
                        : t('matrices:matrix_operations.add_sub.requirement.incompatible', { 
                            rowsA: state.parsedMatrizA.length, 
                            colsA: state.parsedMatrizA[0]?.length,
                            rowsB: state.parsedMatrizB.length,
                            colsB: state.parsedMatrizB[0]?.length
                          })
                      }
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('matrices:matrix_operations.add_sub.operations.title')}
            </label>
            <div className="flex space-x-6 mb-2">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio h-4 w-4 text-indigo-600 dark:text-indigo-400"
                  checked={state.operacao === 'soma'}
                  onChange={() => dispatch({ type: 'SET_OPERACAO', valor: 'soma' })}
                />
                <span className="ml-2 text-gray-700 dark:text-gray-300">
                  {t('matrices:matrix_operations.add_sub.operations.addition')}
                </span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio h-4 w-4 text-indigo-600 dark:text-indigo-400"
                  checked={state.operacao === 'subtracao'}
                  onChange={() => dispatch({ type: 'SET_OPERACAO', valor: 'subtracao' })}
                />
                <span className="ml-2 text-gray-700 dark:text-gray-300">
                  {t('matrices:matrix_operations.add_sub.operations.subtraction')}
                </span>
              </label>
            </div>
          </div>
          
          {/* Exemplos de matrizes */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('matrices:matrix_operations.add_sub.examples')}
            </label>
            <div className="flex flex-wrap gap-2">
              {getMatrixAddSubExamples().map((example, index) => (
                <button
                  key={index}
                  onClick={() => applyExample(example)}
                  className="px-3 py-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm rounded-full transition-colors"
                >
                  {t(`matrices:matrix_operations.examples.${example.translationKey}`, { defaultValue: example.description })}
                </button>
              ))}
            </div>
          </div>
          
          <button
            onClick={handleSolve}
            className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-medium py-2 px-6 rounded-md transition-colors duration-300 mt-4"
          >
            {t('matrices:matrix_operations.add_sub.calculate')}
          </button>
        </div>
        
        {state.erro && (
          <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 rounded-md">
            {state.erro}
          </div>
        )}
      </div>
      
      {state.resultado && (
        <div className="space-y-6">
          <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-5">
            <h3 className="text-lg font-medium text-green-800 dark:text-green-300 mb-4">
              {t('matrices:matrix_operations.add_sub.result')}
            </h3>
            
            <div className="bg-white dark:bg-gray-800 p-4 rounded-md border border-gray-200 dark:border-gray-700">
              {renderMatrixOperation()}
            </div>
            
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md border-l-2 border-blue-300 dark:border-blue-700">
              <div className="flex items-center">
                <HiInformationCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2 flex-shrink-0" />
                <p className="text-blue-700 dark:text-blue-300 font-medium">
                  {state.operacao === 'soma' 
                    ? t('matrices:matrix_operations.add_sub.addition_explanation')
                    : t('matrices:matrix_operations.add_sub.subtraction_explanation')}
                </p>
              </div>
            </div>
            
            <button 
              onClick={() => dispatch({ type: 'TOGGLE_EXPLICATION' })}
              className="mt-4 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 text-sm font-medium flex items-center"
            >
              <HiCalculator className="h-5 w-5 mr-1" />
              {state.showExplication 
                ? t('matrices:matrix_operations.add_sub.hide_explanation') 
                : t('matrices:matrix_operations.add_sub.show_explanation')
              }
            </button>
          </div>
          
          {state.showExplication && state.passos.length > 0 && (
            <div className="mt-8 bg-white dark:bg-gray-800 shadow-md rounded-lg p-5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center">
                  <HiCalculator className="h-6 w-6 mr-2 text-indigo-600 dark:text-indigo-400" />
                  {t('matrices:matrix_operations.add_sub.step_by_step')}
                </h3>
              </div>
              
              <StepByStepExplanation steps={state.passos} stepType="matrices" />
              
              <ConceitoMatematico
                title={t('matrices:matrix_operations.mathematical_concept.title')}
                isOpen={state.showConceitoMatematico} 
                onToggle={() => dispatch({ type: 'TOGGLE_CONCEITO_MATEMATICO' })}
              >
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                  <div className="flex-1">
                    <h5 className="font-medium text-gray-800 dark:text-gray-100 mb-2 border-b border-gray-200 dark:border-gray-700 pb-1">
                      {t('matrices:matrix_operations.mathematical_concept.definition_title')}
                    </h5>
                    <p className="text-gray-700 dark:text-gray-300 mb-2">
                      {t('matrices:matrix_operations.mathematical_concept.definition_text')}
                    </p>
                    <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-md border-l-2 border-yellow-300 dark:border-yellow-600 mb-3">
                      <p className="text-sm text-yellow-800 dark:text-yellow-300">
                        <span className="font-semibold">{t('matrices:matrix_operations.mathematical_concept.important_property')}</span>
                      </p>
                    </div>
                    
                    <h5 className="font-medium text-gray-800 dark:text-gray-100 mb-2 mt-4 border-b border-gray-200 dark:border-gray-700 pb-1">
                      {t('matrices:matrix_operations.mathematical_concept.operations_title')}
                    </h5>
                    <div className="bg-white dark:bg-gray-700 p-3 rounded-md border border-gray-100 dark:border-gray-600 shadow-sm">
                      <div className="space-y-3">
                        <div>
                          <h6 className="text-lg font-medium text-indigo-700 dark:text-indigo-300 mb-1">
                            {t('matrices:matrix_operations.mathematical_concept.addition_title')}
                          </h6>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {t('matrices:matrix_operations.mathematical_concept.addition_description')}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {t('matrices:matrix_operations.mathematical_concept.addition_formula')}
                          </p>
                        </div>
                        
                        <div>
                          <h6 className="text-lg font-medium text-indigo-700 dark:text-indigo-300 mb-1">
                            {t('matrices:matrix_operations.mathematical_concept.subtraction_title')}
                          </h6>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {t('matrices:matrix_operations.mathematical_concept.subtraction_description')}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {t('matrices:matrix_operations.mathematical_concept.subtraction_formula')}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-md border-l-2 border-green-300 dark:border-green-700 mt-3 mb-3">
                      <h6 className="text-green-700 dark:text-green-300 font-medium mb-1">
                        {t('matrices:matrix_operations.mathematical_concept.properties_addition_title')}
                      </h6>
                      <ul className="text-sm text-gray-700 dark:text-gray-300 list-disc list-inside mb-2 space-y-1">
                        <li>
                          <span className="font-medium">
                            {t('matrices:matrix_operations.mathematical_concept.properties.commutative_title')}
                          </span> {t('matrices:matrix_operations.mathematical_concept.properties.commutative_formula')}<br/>
                          <span className="text-xs ml-6">
                            {t('matrices:matrix_operations.mathematical_concept.properties.commutative_description')}
                          </span>
                        </li>
                        <li>
                          <span className="font-medium">
                            {t('matrices:matrix_operations.mathematical_concept.properties.associative_title')}
                          </span> {t('matrices:matrix_operations.mathematical_concept.properties.associative_formula')}<br/>
                          <span className="text-xs ml-6">
                            {t('matrices:matrix_operations.mathematical_concept.properties.associative_description')}
                          </span>
                        </li>
                        <li>
                          <span className="font-medium">
                            {t('matrices:matrix_operations.mathematical_concept.properties.neutral_title')}
                          </span> {t('matrices:matrix_operations.mathematical_concept.properties.neutral_formula')}<br/>
                          <span className="text-xs ml-6">
                            {t('matrices:matrix_operations.mathematical_concept.properties.neutral_description')}
                          </span>
                        </li>
                        <li>
                          <span className="font-medium">
                            {t('matrices:matrix_operations.mathematical_concept.properties.opposite_title')}
                          </span> {t('matrices:matrix_operations.mathematical_concept.properties.opposite_formula')}<br/>
                          <span className="text-xs ml-6">
                            {t('matrices:matrix_operations.mathematical_concept.properties.opposite_description')}
                          </span>
                        </li>
                        <li>
                          <span className="font-medium">
                            {t('matrices:matrix_operations.mathematical_concept.properties.distributive_title')}
                          </span> {t('matrices:matrix_operations.mathematical_concept.properties.distributive_formula')}<br/>
                          <span className="text-xs ml-6">
                            {t('matrices:matrix_operations.mathematical_concept.properties.distributive_description')}
                          </span>
                        </li>
                      </ul>
                      
                      <h6 className="text-green-700 dark:text-green-300 font-medium mt-3 mb-1">
                        {t('matrices:matrix_operations.mathematical_concept.properties_subtraction_title')}
                      </h6>
                      <ul className="text-sm text-gray-700 dark:text-gray-300 list-disc list-inside mb-2 space-y-1">
                        <li>
                          <span className="font-medium">
                            {t('matrices:matrix_operations.mathematical_concept.subtraction_properties.non_commutative_title')}
                          </span> {t('matrices:matrix_operations.mathematical_concept.subtraction_properties.non_commutative_formula')}<br/>
                          <span className="text-xs ml-6">
                            {t('matrices:matrix_operations.mathematical_concept.subtraction_properties.non_commutative_description')}
                          </span>
                        </li>
                        <li>
                          <span className="font-medium">
                            {t('matrices:matrix_operations.mathematical_concept.subtraction_properties.addition_relation_title')}
                          </span> {t('matrices:matrix_operations.mathematical_concept.subtraction_properties.addition_relation_formula')}<br/>
                          <span className="text-xs ml-6">
                            {t('matrices:matrix_operations.mathematical_concept.subtraction_properties.addition_relation_description')}
                          </span>
                        </li>
                        <li>
                          <span className="font-medium">
                            {t('matrices:matrix_operations.mathematical_concept.subtraction_properties.null_difference_title')}
                          </span> {t('matrices:matrix_operations.mathematical_concept.subtraction_properties.null_difference_formula')}<br/>
                          <span className="text-xs ml-6">
                            {t('matrices:matrix_operations.mathematical_concept.subtraction_properties.null_difference_description')}
                          </span>
                        </li>
                        <li>
                          <span className="font-medium">
                            {t('matrices:matrix_operations.mathematical_concept.subtraction_properties.distributive_title')}
                          </span> {t('matrices:matrix_operations.mathematical_concept.subtraction_properties.distributive_formula')}<br/>
                          <span className="text-xs ml-6">
                            {t('matrices:matrix_operations.mathematical_concept.subtraction_properties.distributive_description')}
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <h5 className="font-medium text-gray-800 dark:text-gray-100 mb-2 border-b border-gray-200 dark:border-gray-700 pb-1">
                      {t('matrices:matrix_operations.mathematical_concept.examples_title')}
                    </h5>
                    <div className="bg-white dark:bg-gray-700 p-3 rounded-md border border-gray-100 dark:border-gray-600 shadow-sm mb-3">
                      <h6 className="text-base font-medium text-indigo-700 dark:text-indigo-300 mb-2">
                        {t('matrices:matrix_operations.mathematical_concept.addition_example_title')}
                      </h6>
                      <div className="grid grid-cols-3 gap-1 items-center justify-items-center">
                        <div className="text-center">
                          <div className="border border-gray-300 dark:border-gray-600 p-2 inline-block">
                            <div className="text-sm">1 2</div>
                            <div className="text-sm">3 4</div>
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            {t('matrices:matrix_operations.mathematical_concept.matrix_a')}
                          </p>
                        </div>
                        <div className="text-2xl text-gray-600 dark:text-gray-400">+</div>
                        <div className="text-center">
                          <div className="border border-gray-300 dark:border-gray-600 p-2 inline-block">
                            <div className="text-sm">5 6</div>
                            <div className="text-sm">7 8</div>
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            {t('matrices:matrix_operations.mathematical_concept.matrix_b')}
                          </p>
                        </div>
                        <div className="col-span-3 text-center my-2">=</div>
                        <div className="text-center col-span-3">
                          <div className="border border-gray-300 dark:border-gray-600 p-2 inline-block">
                            <div className="text-sm">6 8</div>
                            <div className="text-sm">10 12</div>
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            {t('matrices:matrix_operations.mathematical_concept.result_matrix')}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-700 p-3 rounded-md border border-gray-100 dark:border-gray-600 shadow-sm mb-3">
                      <h6 className="text-base font-medium text-indigo-700 dark:text-indigo-300 mb-2">
                        {t('matrices:matrix_operations.mathematical_concept.subtraction_example_title')}
                      </h6>
                      <div className="grid grid-cols-3 gap-1 items-center justify-items-center">
                        <div className="text-center">
                          <div className="border border-gray-300 dark:border-gray-600 p-2 inline-block">
                            <div className="text-sm">9 8</div>
                            <div className="text-sm">7 6</div>
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            {t('matrices:matrix_operations.mathematical_concept.matrix_a')}
                          </p>
                        </div>
                        <div className="text-2xl text-gray-600 dark:text-gray-400">-</div>
                        <div className="text-center">
                          <div className="border border-gray-300 dark:border-gray-600 p-2 inline-block">
                            <div className="text-sm">4 3</div>
                            <div className="text-sm">2 1</div>
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            {t('matrices:matrix_operations.mathematical_concept.matrix_b')}
                          </p>
                        </div>
                        <div className="col-span-3 text-center my-2">=</div>
                        <div className="text-center col-span-3">
                          <div className="border border-gray-300 dark:border-gray-600 p-2 inline-block">
                            <div className="text-sm">5 5</div>
                            <div className="text-sm">5 5</div>
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            {t('matrices:matrix_operations.mathematical_concept.result_matrix')}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md border-l-2 border-blue-300 dark:border-blue-700 mb-3">
                      <h6 className="text-blue-700 dark:text-blue-300 font-medium mb-1">
                        {t('matrices:matrix_operations.mathematical_concept.practical_applications_title')}
                      </h6>
                      <ul className="text-sm text-gray-700 dark:text-gray-300 list-disc list-inside space-y-1">
                        <li>
                          <span className="font-medium">{t('translation:common.economics')}:</span> {t('matrices:matrix_operations.mathematical_concept.applications.economics')}
                        </li>
                        <li>
                          <span className="font-medium">{t('translation:common.engineering')}:</span> {t('matrices:matrix_operations.mathematical_concept.applications.engineering')}
                        </li>
                        <li>
                          <span className="font-medium">{t('translation:common.physics')}:</span> {t('matrices:matrix_operations.mathematical_concept.applications.physics')}
                        </li>
                        <li>
                          <span className="font-medium">{t('translation:common.computer_graphics')}:</span> {t('matrices:matrix_operations.mathematical_concept.applications.computer_graphics')}
                        </li>
                        <li>
                          <span className="font-medium">{t('translation:common.statistics')}:</span> {t('matrices:matrix_operations.mathematical_concept.applications.statistics')}
                        </li>
                      </ul>
                    </div>
                    
                    <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-md">
                      <h6 className="text-indigo-700 dark:text-indigo-300 font-medium mb-1">
                        {t('matrices:matrix_operations.mathematical_concept.special_matrices_title')}
                      </h6>
                      <div className="space-y-2">
                        <div>
                          <h6 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {t('matrices:matrix_operations.mathematical_concept.special_matrices.identity_title')}
                          </h6>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {t('matrices:matrix_operations.mathematical_concept.special_matrices.identity_description')}
                          </p>
                        </div>
                        <div>
                          <h6 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {t('matrices:matrix_operations.mathematical_concept.special_matrices.null_title')}
                          </h6>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {t('matrices:matrix_operations.mathematical_concept.special_matrices.null_description')}
                          </p>
                        </div>
                        <div>
                          <h6 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {t('matrices:matrix_operations.mathematical_concept.special_matrices.transpose_title')}
                          </h6>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {t('matrices:matrix_operations.mathematical_concept.special_matrices.transpose_description')}
                          </p>
                        </div>
                      </div>
                    </div>
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

export default ResolvedorAddSubMatrizes; 