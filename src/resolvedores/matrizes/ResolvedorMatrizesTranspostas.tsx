import React from 'react';
import { 
  HiCalculator, 
  HiInformationCircle
} from 'react-icons/hi';
import { useMatrizTransposeSolver, getTransposeExamples } from '../../hooks/matrizes/useMatrizTranspostaSolver';
import StepByStepExplanation from '../../components/StepByStepExplanation';
import ConceitoMatematico from '../../components/ConceitoMatematico';
import { useTranslation } from 'react-i18next';

const ResolvedorTransposeMatrizes: React.FC = () => {
  const { 
    state, 
    dispatch, 
    handleSolve, 
    applyExample
  } = useMatrizTransposeSolver();
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

  // Função para renderizar a notação de transposição com visualização das matrizes
  const renderTransposeNotation = () => {
    if (!state.parsedMatrix || !state.result) return null;
    
    return (
      <div className="flex flex-col items-center justify-center my-4 space-y-4">
        <div className="flex items-center space-x-6 flex-wrap justify-center">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('matrices:matrix_operations.transpose.matrix_a')}</p>
            {renderMatrix(state.parsedMatrix)}
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {state.parsedMatrix.length}×{state.parsedMatrix[0]?.length}
            </p>
          </div>
          
          <div className="flex items-center justify-center">
            <span className="text-2xl font-bold text-gray-700 dark:text-gray-300">→</span>
            <div className="mx-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <p>{t('matrices:matrix_operations.transpose.operation')}</p>
              <p className="text-xs italic">A<sup>T</sup></p>
            </div>
            <span className="text-2xl font-bold text-gray-700 dark:text-gray-300">→</span>
          </div>
          
          <div className="text-center">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('matrices:matrix_operations.transpose.result_matrix')}</p>
            {renderMatrix(state.result)}
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {state.result.length}×{state.result[0]?.length}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <HiCalculator className="h-6 w-6 text-indigo-600 dark:text-indigo-400 mr-2" />
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          {t('matrices:matrix_operations.transpose.title')}
        </h2>
      </div>

      <div className="resolver-container p-6 mb-8">
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          {t('matrices:matrix_operations.transpose.description')}
        </p>

        <div className="mb-6">
          <div className="mb-4">
            <label htmlFor="matrix" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('matrices:matrix_operations.transpose.matrix')}
            </label>
            <textarea
              id="matrix"
              rows={4}
              value={state.matrix}
              onChange={(e) => dispatch({ type: 'SET_MATRIX', value: e.target.value })}
              className="block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400"
              placeholder={t('matrices:matrix_operations.transpose.placeholder')}
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {t('matrices:matrix_operations.transpose.input_format')}
            </p>
            
            {state.parsedMatrix && (
              <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('matrices:matrix_operations.transpose.preview')}:</p>
                {renderMatrix(state.parsedMatrix)}
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {t('matrices:matrix_operations.transpose.dimension')}: {state.parsedMatrix.length}×{state.parsedMatrix[0]?.length}
                </p>
              </div>
            )}
            
            <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
              <div className="flex items-start">
                <HiInformationCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    <span className="font-medium">{t('matrices:matrix_operations.transpose.info.title')}:</span> {t('matrices:matrix_operations.transpose.info.description')}
                  </p>
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                    {t('matrices:matrix_operations.transpose.info.dimensions')}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('matrices:matrix_operations.transpose.examples')}
            </label>
            <div className="flex flex-wrap gap-2">
              {getTransposeExamples().map((example, index) => (
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
            {t('matrices:matrix_operations.transpose.calculate')}
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
            <h3 className="text-lg font-medium text-green-800 dark:text-green-300 mb-4">{t('matrices:matrix_operations.transpose.result')}</h3>
            
            <div className="bg-white dark:bg-gray-800 p-4 rounded-md border border-gray-200 dark:border-gray-700">
              {renderTransposeNotation()}
            </div>
            
            <button 
              onClick={() => dispatch({ type: 'TOGGLE_EXPLANATION' })}
              className="mt-4 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 text-sm font-medium flex items-center"
            >
              <HiCalculator className="h-5 w-5 mr-1" />
              {state.showExplanation ? t('matrices:matrix_operations.transpose.hide_explanation') : t('matrices:matrix_operations.transpose.show_explanation')}
            </button>
          </div>
          
          {state.showExplanation && state.steps.length > 0 && (
            <div className="mt-8 bg-white dark:bg-gray-800 shadow-md rounded-lg p-5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center">
                  <HiCalculator className="h-6 w-6 mr-2 text-indigo-600 dark:text-indigo-400" />
                  {t('matrices:matrix_operations.transpose.step_by_step')}
                </h3>
              </div>
              
              <StepByStepExplanation steps={state.steps} stepType="matrices" />
              
              <ConceitoMatematico
                title={t('matrices:matrix_operations.mathematical_concept.title')}
                isOpen={state.showConceitoMatematico} 
                onToggle={() => dispatch({ type: 'TOGGLE_CONCEITO_MATEMATICO' })}
              >
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                  <div className="flex-1">
                    <h5 className="font-medium text-gray-800 dark:text-gray-100 mb-2 border-b border-gray-200 dark:border-gray-700 pb-1">{t('matrices:matrix_operations.transpose.concept.definition_title')}</h5>
                    
                    <p className="text-gray-700 dark:text-gray-300 mb-2">
                      {t('matrices:matrix_operations.transpose.concept.definition')}
                    </p>
                    
                    <div className="bg-white dark:bg-gray-700 p-3 rounded-md border border-gray-100 dark:border-gray-600 shadow-sm">
                      <h6 className="text-lg font-medium text-indigo-700 dark:text-indigo-300 mb-1">{t('matrices:matrix_operations.transpose.concept.notation_title')}</h6>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {t('matrices:matrix_operations.transpose.concept.notation_description')}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 font-mono">
                        {t('matrices:matrix_operations.transpose.concept.notation_formula')}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {t('matrices:matrix_operations.transpose.concept.notation_explanation')}
                      </p>
                    </div>

                    <h6 className="text-base font-medium text-gray-800 dark:text-gray-100 mt-4 mb-2">{t('matrices:matrix_operations.transpose.concept.visual_interpretation')}</h6>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                      {t('matrices:matrix_operations.transpose.concept.visual_steps')}
                    </p>
                    <ol className="text-sm text-gray-700 dark:text-gray-300 list-decimal list-inside space-y-1 ml-2">
                      <li>{t('matrices:matrix_operations.transpose.concept.visual_step_1')}</li>
                      <li>{t('matrices:matrix_operations.transpose.concept.visual_step_2')}</li>
                      <li>{t('matrices:matrix_operations.transpose.concept.visual_step_3')}</li>
                    </ol>

                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md border-l-2 border-blue-300 dark:border-blue-700 my-3">
                      <h6 className="text-blue-700 dark:text-blue-300 font-medium mb-1">{t('matrices:matrix_operations.transpose.concept.visual_example_title')}</h6>
                      <p className="text-sm text-blue-800 dark:text-blue-200 mb-2">
                        {t('matrices:matrix_operations.transpose.concept.visual_example_description')}
                      </p>
                      <div className="flex items-center justify-center text-blue-800 dark:text-blue-200 font-mono">
                        <div>
                          <div>[1 2 3]ᵀ</div>
                          <div>[4 5 6]</div>
                        </div>
                        <div className="mx-4">=</div>
                        <div>
                          <div>[1 4]</div>
                          <div>[2 5]</div>
                          <div>[3 6]</div>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-md border-l-2 border-indigo-300 dark:border-indigo-700 my-3">
                      <h6 className="text-indigo-700 dark:text-indigo-300 font-medium mb-1">{t('matrices:matrix_operations.transpose.concept.specific_applications')}</h6>
                      <ul className="text-sm text-gray-700 dark:text-gray-300 list-disc list-inside space-y-1">
                        <li><span className="font-medium">{t('matrices:matrix_operations.transpose.concept.app_linear_systems')}:</span> {t('matrices:matrix_operations.transpose.concept.app_linear_systems_desc')}</li>
                        <li><span className="font-medium">{t('matrices:matrix_operations.transpose.concept.app_linear_transformations')}:</span> {t('matrices:matrix_operations.transpose.concept.app_linear_transformations_desc')}</li>
                        <li><span className="font-medium">{t('matrices:matrix_operations.transpose.concept.app_matrix_decomposition')}:</span> {t('matrices:matrix_operations.transpose.concept.app_matrix_decomposition_desc')}</li>
                        <li><span className="font-medium">{t('matrices:matrix_operations.transpose.concept.app_quadratic_forms')}:</span> {t('matrices:matrix_operations.transpose.concept.app_quadratic_forms_desc')}</li>
                      </ul>
                    </div>
                    
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md border-l-2 border-blue-300 dark:border-blue-700 mb-3">
                      <h6 className="text-blue-700 dark:text-blue-300 font-medium mb-1">{t('matrices:matrix_operations.transpose.concept.practical_applications')}</h6>
                      <ul className="text-sm text-gray-700 dark:text-gray-300 list-disc list-inside space-y-1">
                        <li><span className="font-medium">{t('translation:common.signal_processing')}:</span> {t('matrices:matrix_operations.transpose.concept.app_signal_processing')}</li>
                        <li><span className="font-medium">{t('translation:common.statistics')}:</span> {t('matrices:matrix_operations.transpose.concept.app_statistics')}</li>
                        <li><span className="font-medium">{t('translation:common.optimization')}:</span> {t('matrices:matrix_operations.transpose.concept.app_optimization')}</li>
                        <li><span className="font-medium">{t('translation:common.machine_learning')}:</span> {t('matrices:matrix_operations.transpose.concept.app_machine_learning')}</li>
                        <li><span className="font-medium">{t('translation:common.computer_graphics')}:</span> {t('matrices:matrix_operations.transpose.concept.app_computer_graphics')}</li>
                        <li><span className="font-medium">{t('translation:common.quantum_physics')}:</span> {t('matrices:matrix_operations.transpose.concept.app_quantum_physics')}</li>
                      </ul>
                    </div>
                    
                    <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-md border-l-2 border-purple-300 dark:border-purple-700 mb-3">
                      <h6 className="text-purple-700 dark:text-purple-300 font-medium mb-1">{t('translation:common.advanced_matrix_concepts.title')}</h6>
                      <div className="space-y-2">
                        <div>
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('translation:common.advanced_matrix_concepts.alternative_notations.title')}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 ml-2">
                            {t('translation:common.advanced_matrix_concepts.alternative_notations.description')}
                            <ul className="list-disc list-inside mt-1 space-y-1">
                              <li dangerouslySetInnerHTML={{__html: t('translation:common.advanced_matrix_concepts.alternative_notations.standard')}}></li>
                              <li dangerouslySetInnerHTML={{__html: t('translation:common.advanced_matrix_concepts.alternative_notations.prime')}}></li>
                              <li dangerouslySetInnerHTML={{__html: t('translation:common.advanced_matrix_concepts.alternative_notations.left_superscript')}}></li>
                              <li dangerouslySetInnerHTML={{__html: t('translation:common.advanced_matrix_concepts.alternative_notations.abbreviated')}}></li>
                            </ul>
                          </p>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('translation:common.advanced_matrix_concepts.inner_products.title')}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 ml-2" 
                             dangerouslySetInnerHTML={{__html: t('translation:common.advanced_matrix_concepts.inner_products.description')}}>
                          </p>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('translation:common.advanced_matrix_concepts.computational.title')}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 ml-2"
                             dangerouslySetInnerHTML={{__html: t('translation:common.advanced_matrix_concepts.computational.description')}}>
                          </p>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('translation:common.advanced_matrix_concepts.special_classes.title')}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 ml-2">
                            {t('translation:common.advanced_matrix_concepts.special_classes.description')}
                            <ul className="list-disc list-inside mt-1 space-y-1">
                              <li dangerouslySetInnerHTML={{__html: t('translation:common.advanced_matrix_concepts.special_classes.symmetric')}}></li>
                              <li dangerouslySetInnerHTML={{__html: t('translation:common.advanced_matrix_concepts.special_classes.skew_symmetric')}}></li>
                              <li dangerouslySetInnerHTML={{__html: t('translation:common.advanced_matrix_concepts.special_classes.orthogonal')}}></li>
                              <li dangerouslySetInnerHTML={{__html: t('translation:common.advanced_matrix_concepts.special_classes.hermitian')}}></li>
                            </ul>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <h5 className="font-medium text-gray-800 dark:text-gray-100 mb-2 border-b border-gray-200 dark:border-gray-700 pb-1">{t('matrices:matrix_operations.transpose.concept.properties_title')}</h5>
                    
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-md border-l-2 border-green-300 dark:border-green-700 mb-3">
                      <h6 className="text-green-700 dark:text-green-300 font-medium mb-1">{t('matrices:matrix_operations.transpose.concept.properties_list_title')}</h6>
                      <ul className="text-sm text-gray-700 dark:text-gray-300 list-disc list-inside mb-2 space-y-1">
                        <li><span className="font-medium">{t('matrices:matrix_operations.transpose.concept.prop_double')}:</span> (Aᵀ)ᵀ = A<br/>
                          <span className="text-xs ml-6">{t('matrices:matrix_operations.transpose.concept.prop_double_desc')}</span>
                        </li>
                        <li><span className="font-medium">{t('matrices:matrix_operations.transpose.concept.prop_linearity')}:</span> (αA + βB)ᵀ = αAᵀ + βBᵀ<br/>
                          <span className="text-xs ml-6">{t('matrices:matrix_operations.transpose.concept.prop_linearity_desc')}</span>
                        </li>
                        <li><span className="font-medium">{t('matrices:matrix_operations.transpose.concept.prop_multiplication')}:</span> (AB)ᵀ = BᵀAᵀ<br/>
                          <span className="text-xs ml-6">{t('matrices:matrix_operations.transpose.concept.prop_multiplication_desc')}</span>
                        </li>
                        <li><span className="font-medium">{t('matrices:matrix_operations.transpose.concept.prop_determinant')}:</span> det(Aᵀ) = det(A)<br/>
                          <span className="text-xs ml-6">{t('matrices:matrix_operations.transpose.concept.prop_determinant_desc')}</span>
                        </li>
                        <li><span className="font-medium">{t('matrices:matrix_operations.transpose.concept.prop_inverse')}:</span> (A⁻¹)ᵀ = (Aᵀ)⁻¹<br/>
                          <span className="text-xs ml-6">{t('matrices:matrix_operations.transpose.concept.prop_inverse_desc')}</span>
                        </li>
                        <li><span className="font-medium">{t('matrices:matrix_operations.transpose.concept.prop_rank')}:</span> rank(A) = rank(Aᵀ)<br/>
                          <span className="text-xs ml-6">{t('matrices:matrix_operations.transpose.concept.prop_rank_desc')}</span>
                        </li>
                        <li><span className="font-medium">{t('matrices:matrix_operations.transpose.concept.prop_trace')}:</span> tr(A) = tr(Aᵀ)<br/>
                          <span className="text-xs ml-6">{t('matrices:matrix_operations.transpose.concept.prop_trace_desc')}</span>
                        </li>
                      </ul>
                    </div>

                    <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-md border-l-2 border-amber-300 dark:border-amber-700 mb-3">
                      <h6 className="text-amber-700 dark:text-amber-300 font-medium mb-1">{t('matrices:matrix_operations.transpose.concept.special_cases_title')}</h6>
                      <div className="space-y-2">
                        <div>
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('matrices:matrix_operations.transpose.concept.example_diagonal_title')}</p>
                          <div className="text-xs text-gray-600 dark:text-gray-400 font-mono mt-1 ml-2">
                            <div>[a 0 0]ᵀ</div>
                            <div>[0 b 0]</div>
                            <div>[0 0 c]</div>
                            <div className="mt-1">=</div>
                            <div>[a 0 0]</div>
                            <div>[0 b 0]</div>
                            <div>[0 0 c]</div>
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 ml-2">
                            {t('matrices:matrix_operations.transpose.concept.example_diagonal_explanation')}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('matrices:matrix_operations.transpose.concept.example_triangular_title')}</p>
                          <div className="text-xs text-gray-600 dark:text-gray-400 font-mono mt-1 ml-2">
                            <div>[a 0 0]ᵀ</div>
                            <div>[b c 0]</div>
                            <div>[d e f]</div>
                            <div className="mt-1">=</div>
                            <div>[a b d]</div>
                            <div>[0 c e]</div>
                            <div>[0 0 f]</div>
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 ml-2">
                            {t('matrices:matrix_operations.transpose.concept.example_triangular_explanation')}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('matrices:matrix_operations.transpose.concept.example_scalar_title')}</p>
                          <div className="text-xs text-gray-600 dark:text-gray-400 mt-1 ml-2">
                            <p>{t('matrices:matrix_operations.transpose.concept.example_scalar_for')}</p>
                            <div className="mt-1">(kI)ᵀ = kIᵀ = kI</div>
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 ml-2">
                            {t('matrices:matrix_operations.transpose.concept.example_scalar_explanation')}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-md border-l-2 border-red-300 dark:border-red-700 mb-3">
                      <h6 className="text-red-700 dark:text-red-300 font-medium mb-1">{t('matrices:matrix_operations.transpose.concept.common_errors_title')}</h6>
                      <ul className="text-sm text-gray-700 dark:text-gray-300 list-disc list-inside space-y-1">
                        <li>{t('matrices:matrix_operations.transpose.concept.error_product_order')}</li>
                        <li>{t('matrices:matrix_operations.transpose.concept.error_symmetric_assumption')}</li>
                        <li>{t('matrices:matrix_operations.transpose.concept.error_complex_conjugate')}</li>
                        <li>{t('matrices:matrix_operations.transpose.concept.error_inverse_confusion')}</li>
                        <li>{t('matrices:matrix_operations.transpose.concept.error_dimensions')}</li>
                      </ul>
                    </div>

                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md border-l-2 border-blue-300 dark:border-blue-700 mb-3">
                      <h6 className="text-blue-700 dark:text-blue-300 font-medium mb-1">{t('matrices:matrix_operations.transpose.concept.efficient_algorithms_title')}</h6>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                        {t('matrices:matrix_operations.transpose.concept.efficient_algorithms_description')}
                      </p>
                      <ul className="text-sm text-gray-700 dark:text-gray-300 list-disc list-inside space-y-1">
                        <li><span className="font-medium">{t('matrices:matrix_operations.transpose.concept.algo_in_place')}:</span> {t('matrices:matrix_operations.transpose.concept.algo_in_place_desc')}</li>
                        <li><span className="font-medium">{t('matrices:matrix_operations.transpose.concept.algo_blocking')}:</span> {t('matrices:matrix_operations.transpose.concept.algo_blocking_desc')}</li>
                        <li><span className="font-medium">{t('matrices:matrix_operations.transpose.concept.algo_parallel')}:</span> {t('matrices:matrix_operations.transpose.concept.algo_parallel_desc')}</li>
                        <li><span className="font-medium">{t('matrices:matrix_operations.transpose.concept.algo_sparse')}:</span> {t('matrices:matrix_operations.transpose.concept.algo_sparse_desc')}</li>
                      </ul>
                    </div>
                    
                    <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-md border-l-2 border-indigo-300 dark:border-indigo-700 mb-3">
                      <h6 className="text-indigo-700 dark:text-indigo-300 font-medium mb-1">{t('matrices:matrix_operations.transpose.concept.matrix_decompositions_title')}</h6>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                        {t('matrices:matrix_operations.transpose.concept.matrix_decompositions_description')}
                      </p>
                      <ul className="text-sm text-gray-700 dark:text-gray-300 list-disc list-inside space-y-1">
                        <li><span className="font-medium">{t('matrices:matrix_operations.transpose.concept.decomp_qr')}:</span> {t('matrices:matrix_operations.transpose.concept.decomp_qr_desc')}</li>
                        <li><span className="font-medium">{t('matrices:matrix_operations.transpose.concept.decomp_svd')}:</span> {t('matrices:matrix_operations.transpose.concept.decomp_svd_desc')}</li>
                        <li><span className="font-medium">{t('matrices:matrix_operations.transpose.concept.decomp_spectral')}:</span> {t('matrices:matrix_operations.transpose.concept.decomp_spectral_desc')}</li>
                        <li><span className="font-medium">{t('matrices:matrix_operations.transpose.concept.decomp_power_method')}:</span> {t('matrices:matrix_operations.transpose.concept.decomp_power_method_desc')}</li>
                      </ul>
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

export default ResolvedorTransposeMatrizes; 