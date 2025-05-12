import React from 'react';
import { 
  HiCalculator, 
  HiInformationCircle
} from 'react-icons/hi';
import { getDeterminantExamples } from '../../utils/mathUtilsMatrizes';
import { useMatrizDeterminanteSolver } from '../../hooks/matrizes/useMatrizDeterminanteSolver';
import StepByStepExplanation from '../../components/StepByStepExplanation';
import ConceitoMatematico from '../../components/ConceitoMatematico';
import { useTranslation } from 'react-i18next';

const ResolvedorDeterminanteMatrizes: React.FC = () => {
  const { 
    state, 
    dispatch, 
    handleSolve, 
    applyExample
  } = useMatrizDeterminanteSolver();
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

  // Função para renderizar a equação do determinante com notação matemática
  const renderDeterminantNotation = () => {
    if (!state.parsedMatrix) return null;
    
    return (
      <div className="flex flex-col items-center justify-center my-4 space-y-2">
        <div className="flex items-center space-x-4 flex-wrap justify-center">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('matrices:determinant.matrix')}</p>
            <div className="flex items-center">
              <span className="text-xl font-medium mr-1">|</span>
              {renderMatrix(state.parsedMatrix)}
              <span className="text-xl font-medium ml-1">|</span>
            </div>
          </div>
          
          <div className="flex items-center justify-center h-full">
            <span className="text-xl font-bold text-gray-700 dark:text-gray-300">=</span>
          </div>
          
          <div className="text-center">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('matrices:determinant.determinant')}</p>
            <div className="bg-indigo-50 dark:bg-indigo-900/20 px-4 py-2 rounded-md">
              <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                {state.result !== null ? state.result : '?'}
              </span>
            </div>
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
          {t('matrices:determinant.title')}
        </h2>
      </div>

      <div className="resolver-container p-6 mb-8">
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          {t('matrices:determinant.description')}
        </p>

        <div className="mb-6">
          <div className="mb-4">
            <label htmlFor="matrix" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('matrices:determinant.matrix_input')}
            </label>
            <textarea
              id="matrix"
              rows={4}
              value={state.matrix}
              onChange={(e) => dispatch({ type: 'SET_MATRIX', value: e.target.value })}
              className="block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400"
              placeholder={t('matrices:determinant.matrix_placeholder')}
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {t('matrices:determinant.input_instructions')}
            </p>
            
            {state.parsedMatrix && (
              <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('matrices:determinant.preview')}:</p>
                {renderMatrix(state.parsedMatrix)}
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {t('matrices:determinant.dimensions', { rows: state.parsedMatrix.length, cols: state.parsedMatrix[0]?.length })}
                </p>
                
                {state.parsedMatrix.length !== state.parsedMatrix[0]?.length && (
                  <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-sm rounded-md">
                    <HiInformationCircle className="inline-block mr-1 h-4 w-4" />
                    {t('matrices:determinant.not_square_warning')}
                  </div>
                )}
              </div>
            )}
            
            <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
              <div className="flex items-start">
                <HiInformationCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    <span className="font-medium">{t('matrices:determinant.requirement_title')}</span> {t('matrices:determinant.square_requirement')}
                  </p>
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                    {t('matrices:determinant.determinant_explanation')}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('matrices:determinant.examples')}
            </label>
            <div className="flex flex-wrap gap-2">
              {getDeterminantExamples().map((example, index) => (
                <button
                  key={index}
                  onClick={() => applyExample(example)}
                  className="px-3 py-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm rounded-full transition-colors"
                >
                  {t(`matrices:determinant.examples_matrix.${example.translationKey}`, { defaultValue: example.description })}
                </button>
              ))}
            </div>
          </div>
          
          <button
            onClick={handleSolve}
            className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-medium py-2 px-6 rounded-md transition-colors duration-300 mt-4"
          >
            {t('matrices:determinant.calculate_button')}
          </button>
        </div>
        
        {state.error && (
          <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 rounded-md">
            {state.error}
          </div>
        )}
      </div>
      
      {state.result !== null && (
        <div className="space-y-6">
          <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-5">
            <h3 className="text-lg font-medium text-green-800 dark:text-green-300 mb-4">{t('matrices:determinant.result')}</h3>
            
            <div className="bg-white dark:bg-gray-800 p-4 rounded-md border border-gray-200 dark:border-gray-700">
              {renderDeterminantNotation()}
            </div>
            
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md border-l-2 border-blue-300 dark:border-blue-700">
              <div className="flex items-center">
                <HiInformationCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2 flex-shrink-0" />
                <p className="text-blue-700 dark:text-blue-300 font-medium">
                  {state.result === 0 
                    ? t('matrices:determinant.zero_determinant_explanation')
                    : t('matrices:determinant.non_zero_determinant_explanation')}
                </p>
              </div>
            </div>
            
            <button 
              onClick={() => dispatch({ type: 'TOGGLE_EXPLANATION' })}
              className="mt-4 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 text-sm font-medium flex items-center"
            >
              <HiCalculator className="h-5 w-5 mr-1" />
              {state.showExplanation 
                ? t('matrices:determinant.hide_explanation') 
                : t('matrices:determinant.show_explanation')}
            </button>
          </div>
          
          {state.showExplanation && state.steps.length > 0 && (
            <div className="mt-8 bg-white dark:bg-gray-800 shadow-md rounded-lg p-5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center">
                  <HiCalculator className="h-6 w-6 mr-2 text-indigo-600 dark:text-indigo-400" />
                  {t('matrices:determinant.step_by_step')}
                </h3>
              </div>
              
              <StepByStepExplanation steps={state.steps} stepType="matrices" />
              
              <ConceitoMatematico
                title={t('matrices:determinant.mathematical_concept.title')}
                isOpen={state.showConceitoMatematico} 
                onToggle={() => dispatch({ type: 'TOGGLE_CONCEITO_MATEMATICO' })}
              >
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                  <div className="flex-1">
                    <h5 className="font-medium text-gray-800 dark:text-gray-100 mb-2 border-b border-gray-200 dark:border-gray-700 pb-1">{t('matrices:determinant.mathematical_concept.definition_title')}</h5>
                    
                    <p className="text-gray-700 dark:text-gray-300 mb-2">
                      {t('matrices:determinant.mathematical_concept.definition_text')}
                    </p>
                    
                    <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-md border-l-2 border-yellow-300 dark:border-yellow-600 mb-3">
                      <p className="text-sm text-yellow-800 dark:text-yellow-300">
                        <span className="font-semibold">{t('matrices:determinant.mathematical_concept.important_requirement')}:</span> {t('matrices:determinant.mathematical_concept.square_requirement')}
                      </p>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-700 p-3 rounded-md border border-gray-100 dark:border-gray-600 shadow-sm">
                      <h6 className="text-lg font-medium text-indigo-700 dark:text-indigo-300 mb-1">{t('matrices:determinant.mathematical_concept.calculation_formulas')}</h6>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-medium">{t('matrices:determinant.mathematical_concept.for_2x2')}:</span>
                      </p>
                      <div className="my-2 flex items-center justify-center text-sm text-gray-600 dark:text-gray-400">
                        det <span className="mx-1">
                          <div className="flex flex-col">
                            <div className="border-t border-b border-l border-gray-500 dark:border-gray-400 h-8 w-1"></div>
                          </div>
                        </span>
                        <div className="mx-1">
                          <div>a b</div>
                          <div>c d</div>
                        </div>
                        <span className="mx-1">
                          <div className="flex flex-col">
                            <div className="border-t border-b border-r border-gray-500 dark:border-gray-400 h-8 w-1"></div>
                          </div>
                        </span>
                        = ad - bc
                      </div>
                      
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
                        <span className="font-medium">{t('matrices:determinant.mathematical_concept.for_larger')}:</span> {t('matrices:determinant.mathematical_concept.laplace_explanation')}
                      </p>
                    </div>

                    <h6 className="text-base font-medium text-gray-800 dark:text-gray-100 mt-4 mb-2">{t('matrices:determinant.mathematical_concept.geometric_interpretation')}</h6>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                      {t('matrices:determinant.mathematical_concept.geometric_importance')}:
                    </p>
                    <ul className="text-sm text-gray-700 dark:text-gray-300 list-disc list-inside space-y-1 ml-2">
                      <li>{t('matrices:determinant.mathematical_concept.geometric_2x2')}</li>
                      <li>{t('matrices:determinant.mathematical_concept.geometric_3x3')}</li>
                      <li>{t('matrices:determinant.mathematical_concept.geometric_general')}</li>
                    </ul>

                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md border-l-2 border-blue-300 dark:border-blue-700 my-3">
                      <h6 className="text-blue-700 dark:text-blue-300 font-medium mb-1">{t('matrices:determinant.mathematical_concept.visual_example')}</h6>
                      <p className="text-sm text-blue-800 dark:text-blue-200 mb-2">
                        {t('matrices:determinant.mathematical_concept.for_2x2_matrix')}:
                      </p>
                      <div className="flex justify-center mb-2">
                        <div className="text-center mx-2">
                          <div className="flex items-center justify-center">
                            <span className="mr-1">A =</span>
                            <div className="mx-1">
                              <div>[2 1]</div>
                              <div>[3 4]</div>
                            </div>
                          </div>
                          <p className="text-xs mt-1">det(A) = 2×4 - 1×3 = 5</p>
                        </div>
                      </div>
                      <p className="text-xs text-blue-700 dark:text-blue-300 text-center">
                        {t('matrices:determinant.mathematical_concept.example_explanation')}
                      </p>
                    </div>

                    <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-md border-l-2 border-indigo-300 dark:border-indigo-700 my-3">
                      <h6 className="text-indigo-700 dark:text-indigo-300 font-medium mb-1">{t('matrices:determinant.mathematical_concept.specific_applications')}</h6>
                      <ul className="text-sm text-gray-700 dark:text-gray-300 list-disc list-inside space-y-1">
                        <li><span className="font-medium">{t('matrices:determinant.mathematical_concept.cramer_rule')}:</span> {t('matrices:determinant.mathematical_concept.cramer_explanation')}</li>
                        <li><span className="font-medium">{t('matrices:determinant.mathematical_concept.invertibility')}:</span> {t('matrices:determinant.mathematical_concept.invertibility_explanation')}</li>
                        <li><span className="font-medium">{t('matrices:determinant.mathematical_concept.linear_transformations')}:</span> {t('matrices:determinant.mathematical_concept.transformation_explanation')}</li>
                        <li><span className="font-medium">{t('matrices:determinant.mathematical_concept.area_volume')}:</span> {t('matrices:determinant.mathematical_concept.area_volume_explanation')}</li>
                        <li><span className="font-medium">{t('matrices:determinant.mathematical_concept.variable_change')}:</span> {t('matrices:determinant.mathematical_concept.jacobian_explanation')}</li>
                        <li><span className="font-medium">{t('matrices:determinant.mathematical_concept.characteristic_equation')}:</span> {t('matrices:determinant.mathematical_concept.eigenvalues_explanation')}</li>
                        <li><span className="font-medium">{t('matrices:determinant.mathematical_concept.orientation')}:</span> {t('matrices:determinant.mathematical_concept.orientation_explanation')}</li>
                      </ul>
                    </div>
                    
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md border-l-2 border-blue-300 dark:border-blue-700 mb-3">
                      <h6 className="text-blue-700 dark:text-blue-300 font-medium mb-1">{t('matrices:determinant.mathematical_concept.practical_applications')}</h6>
                      <ul className="text-sm text-gray-700 dark:text-gray-300 list-disc list-inside space-y-1">
                        <li><span className="font-medium">{t('translation:common.linear_systems')}:</span> {t('matrices:determinant.mathematical_concept.applications.linear_systems')}</li>
                        <li><span className="font-medium">{t('translation:common.computer_graphics')}:</span> {t('matrices:determinant.mathematical_concept.applications.computer_graphics')}</li>
                        <li><span className="font-medium">{t('translation:common.statistics')}:</span> {t('matrices:determinant.mathematical_concept.applications.statistics')}</li>
                        <li><span className="font-medium">{t('translation:common.physics')}:</span> {t('matrices:determinant.mathematical_concept.applications.physics')}</li>
                        <li><span className="font-medium">{t('translation:common.economics')}:</span> {t('matrices:determinant.mathematical_concept.applications.economics')}</li>
                        <li><span className="font-medium">{t('translation:common.machine_learning')}:</span> {t('matrices:determinant.mathematical_concept.applications.machine_learning')}</li>
                        <li><span className="font-medium">{t('translation:common.cryptography')}:</span> {t('matrices:determinant.mathematical_concept.applications.cryptography')}</li>
                        <li><span className="font-medium">{t('translation:common.robotics')}:</span> {t('matrices:determinant.mathematical_concept.applications.robotics')}</li>
                        <li><span className="font-medium">{t('translation:common.image_processing')}:</span> {t('matrices:determinant.mathematical_concept.applications.image_processing')}</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <h5 className="font-medium text-gray-800 dark:text-gray-100 mb-2 border-b border-gray-200 dark:border-gray-700 pb-1">{t('matrices:determinant.mathematical_concept.properties_title')}</h5>
                    
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-md border-l-2 border-green-300 dark:border-green-700 mb-3">
                      <h6 className="text-green-700 dark:text-green-300 font-medium mb-1">{t('matrices:determinant.mathematical_concept.determinant_properties')}</h6>
                      <ul className="text-sm text-gray-700 dark:text-gray-300 list-disc list-inside mb-2 space-y-1">
                        <li><span className="font-medium">{t('matrices:determinant.mathematical_concept.properties.transpose_title')}:</span> {t('matrices:determinant.mathematical_concept.properties.transpose_formula')}<br/>
                          <span className="text-xs ml-6">{t('matrices:determinant.mathematical_concept.properties.transpose_description')}</span>
                        </li>
                        <li><span className="font-medium">{t('matrices:determinant.mathematical_concept.properties.scalar_title')}:</span> {t('matrices:determinant.mathematical_concept.properties.scalar_formula')}<br/>
                          <span className="text-xs ml-6">{t('matrices:determinant.mathematical_concept.properties.scalar_description')}</span>
                        </li>
                        <li><span className="font-medium">{t('matrices:determinant.mathematical_concept.properties.product_title')}:</span> {t('matrices:determinant.mathematical_concept.properties.product_formula')}<br/>
                          <span className="text-xs ml-6">{t('matrices:determinant.mathematical_concept.properties.product_description')}</span>
                        </li>
                        <li><span className="font-medium">{t('matrices:determinant.mathematical_concept.properties.inverse_title')}:</span> {t('matrices:determinant.mathematical_concept.properties.inverse_formula')}<br/>
                          <span className="text-xs ml-6">{t('matrices:determinant.mathematical_concept.properties.inverse_description')}</span>
                        </li>
                        <li><span className="font-medium">{t('matrices:determinant.mathematical_concept.properties.row_swap_title')}:</span> {t('matrices:determinant.mathematical_concept.properties.row_swap_description')}<br/>
                          <span className="text-xs ml-6">{t('matrices:determinant.mathematical_concept.properties.row_swap_explanation')}</span>
                        </li>
                        <li><span className="font-medium">{t('matrices:determinant.mathematical_concept.properties.linear_combination_title')}:</span> {t('matrices:determinant.mathematical_concept.properties.linear_combination_description')}<br/>
                          <span className="text-xs ml-6">{t('matrices:determinant.mathematical_concept.properties.linear_combination_explanation')}</span>
                        </li>
                      </ul>
                    </div>

                    <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-md border-l-2 border-purple-300 dark:border-purple-700 mb-3">
                      <h6 className="text-purple-700 dark:text-purple-300 font-medium mb-1">{t('matrices:determinant.mathematical_concept.special_matrices_determinants')}</h6>
                      <ul className="text-sm text-gray-700 dark:text-gray-300 list-disc list-inside space-y-1">
                        <li><span className="font-medium">{t('matrices:determinant.mathematical_concept.special_matrices.triangular')}:</span> {t('matrices:determinant.mathematical_concept.special_matrices.triangular_explanation')}</li>
                        <li><span className="font-medium">{t('matrices:determinant.mathematical_concept.special_matrices.diagonal')}:</span> {t('matrices:determinant.mathematical_concept.special_matrices.diagonal_explanation')}</li>
                        <li><span className="font-medium">{t('matrices:determinant.mathematical_concept.special_matrices.identity')}:</span> {t('matrices:determinant.mathematical_concept.special_matrices.identity_explanation')}</li>
                        <li><span className="font-medium">{t('matrices:determinant.mathematical_concept.special_matrices.singular')}:</span> {t('matrices:determinant.mathematical_concept.special_matrices.singular_explanation')}</li>
                        <li><span className="font-medium">{t('matrices:determinant.mathematical_concept.special_matrices.orthogonal')}:</span> {t('matrices:determinant.mathematical_concept.special_matrices.orthogonal_explanation')}</li>
                        <li><span className="font-medium">{t('matrices:determinant.mathematical_concept.special_matrices.rotation_2d')}:</span> {t('matrices:determinant.mathematical_concept.special_matrices.rotation_2d_explanation')}</li>
                        <li><span className="font-medium">{t('matrices:determinant.mathematical_concept.special_matrices.reflection')}:</span> {t('matrices:determinant.mathematical_concept.special_matrices.reflection_explanation')}</li>
                      </ul>
                    </div>

                    <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-md border-l-2 border-amber-300 dark:border-amber-700 mb-3">
                      <h6 className="text-amber-700 dark:text-amber-300 font-medium mb-1">{t('matrices:determinant.mathematical_concept.calculation_methods')}</h6>
                      <div className="space-y-2">
                        <div>
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">1. {t('matrices:determinant.mathematical_concept.methods.sarrus_title')}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 ml-2">
                            {t('matrices:determinant.mathematical_concept.methods.sarrus_description')}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">2. {t('matrices:determinant.mathematical_concept.methods.cofactor_title')}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 ml-2">
                            {t('matrices:determinant.mathematical_concept.methods.cofactor_description')}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">3. {t('matrices:determinant.mathematical_concept.methods.gaussian_title')}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 ml-2">
                            {t('matrices:determinant.mathematical_concept.methods.gaussian_description')}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-md border-l-2 border-red-300 dark:border-red-700 mb-3">
                      <h6 className="text-red-700 dark:text-red-300 font-medium mb-1">{t('matrices:determinant.mathematical_concept.common_errors')}</h6>
                      <ul className="text-sm text-gray-700 dark:text-gray-300 list-disc list-inside space-y-1">
                        <li>{t('matrices:determinant.mathematical_concept.errors.non_square')}</li>
                        <li>{t('matrices:determinant.mathematical_concept.errors.formula_confusion')}</li>
                        <li>{t('matrices:determinant.mathematical_concept.errors.sign_errors')}</li>
                        <li>{t('matrices:determinant.mathematical_concept.errors.row_operations')}</li>
                        <li>{t('matrices:determinant.mathematical_concept.errors.trace_confusion')}</li>
                      </ul>
                    </div>
                    
                    <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-md border-l-2 border-yellow-300 dark:border-yellow-700 mb-3">
                      <h6 className="text-yellow-700 dark:text-yellow-300 font-medium mb-1">{t('matrices:determinant.mathematical_concept.linear_algebra_importance')}</h6>
                      <ul className="text-sm text-gray-700 dark:text-gray-300 list-disc list-inside space-y-1">
                        <li><span className="font-medium">{t('matrices:determinant.mathematical_concept.cramer_theorem')}:</span> {t('matrices:determinant.mathematical_concept.cramer_theorem_explanation')}</li>
                        <li><span className="font-medium">{t('matrices:determinant.mathematical_concept.adjoint_inverse')}:</span> {t('matrices:determinant.mathematical_concept.adjoint_inverse_explanation')}</li>
                        <li><span className="font-medium">{t('matrices:determinant.mathematical_concept.eigenvalues')}:</span> {t('matrices:determinant.mathematical_concept.eigenvalues_explanation')}</li>
                        <li><span className="font-medium">{t('matrices:determinant.mathematical_concept.linear_transformations')}:</span> {t('matrices:determinant.mathematical_concept.transformations_explanation')}</li>
                        <li><span className="font-medium">{t('matrices:determinant.mathematical_concept.linear_dependence')}:</span> {t('matrices:determinant.mathematical_concept.dependence_explanation')}</li>
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

export default ResolvedorDeterminanteMatrizes; 