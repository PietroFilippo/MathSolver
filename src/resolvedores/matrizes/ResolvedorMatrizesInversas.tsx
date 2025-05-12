import React from 'react';
import { 
  HiCalculator, 
  HiInformationCircle
} from 'react-icons/hi';
import { useMatrizInverseSolver, getInverseMatrixExamples } from '../../hooks/matrizes/useMatrizInversaSolver';
import StepByStepExplanation from '../../components/StepByStepExplanation';
import ConceitoMatematico from '../../components/ConceitoMatematico';

const ResolvedorInverseMatrizes: React.FC = () => {
  const { 
    state, 
    dispatch, 
    handleSolve, 
    applyExample,
    t
  } = useMatrizInverseSolver();

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
                  {Number.isInteger(value) ? value : value.toFixed(3)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  // Função para renderizar a notação de matriz inversa com visualização das matrizes
  const renderInverseNotation = () => {
    if (!state.parsedMatrix || !state.result) return null;
    
    return (
      <div className="flex flex-col items-center justify-center my-4 space-y-4">
        <div className="flex items-center space-x-6 flex-wrap justify-center">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('inverse.matrix')}</p>
            {renderMatrix(state.parsedMatrix)}
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {state.parsedMatrix.length}×{state.parsedMatrix[0]?.length}
            </p>
          </div>
          
          <div className="flex items-center justify-center">
            <span className="text-2xl font-bold text-gray-700 dark:text-gray-300">→</span>
            <div className="mx-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <p>{t('inverse.title')}</p>
              <p className="text-xs italic">A<sup>-1</sup></p>
            </div>
            <span className="text-2xl font-bold text-gray-700 dark:text-gray-300">→</span>
          </div>
          
          <div className="text-center">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('inverse.inverse_matrix')}</p>
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
          {t('inverse.title')}
        </h2>
      </div>

      <div className="resolver-container p-6 mb-8">
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          {t('inverse.description')}
        </p>

        <div className="mb-6">
          <div className="mb-4">
            <label htmlFor="matrix" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('inverse.matrix_input')}
            </label>
            <textarea
              id="matrix"
              rows={4}
              value={state.matrix}
              onChange={(e) => dispatch({ type: 'SET_MATRIX', value: e.target.value })}
              className="block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400"
              placeholder={t('inverse.matrix_placeholder')}
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {t('inverse.input_instructions')}
            </p>
            
            {state.parsedMatrix && (
              <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('inverse.preview')}:</p>
                {renderMatrix(state.parsedMatrix)}
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {t('inverse.dimensions', { rows: state.parsedMatrix.length, cols: state.parsedMatrix[0]?.length })}
                </p>
                {state.parsedMatrix.length !== state.parsedMatrix[0]?.length && (
                  <p className="text-xs text-red-500 dark:text-red-400 mt-1">
                    {t('inverse.not_square_warning')}
                  </p>
                )}
              </div>
            )}
            
            <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
              <div className="flex items-start">
                <HiInformationCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    <span className="font-medium">{t('inverse.title')} A<sup>-1</sup>:</span> {t('inverse.inverse_explanation')}
                  </p>
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                    {t('inverse.non_zero_determinant')}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('inverse.examples')}
            </label>
            <div className="flex flex-wrap gap-2">
              {getInverseMatrixExamples().map((example, index) => (
                <button
                  key={index}
                  onClick={() => applyExample(example)}
                  className="px-3 py-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm rounded-full transition-colors"
                >
                  {t(`inverse.examples_matrix.${example.translationKey || example.description}`, { defaultValue: example.description })}
                </button>
              ))}
            </div>
          </div>
          
          <button
            onClick={handleSolve}
            className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-medium py-2 px-6 rounded-md transition-colors duration-300 mt-4"
          >
            {t('inverse.calculate_button')}
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
            <h3 className="text-lg font-medium text-green-800 dark:text-green-300 mb-4">{t('inverse.steps.result', { rows: state.result.length, cols: state.result[0]?.length })}</h3>
            
            <div className="bg-white dark:bg-gray-800 p-4 rounded-md border border-gray-200 dark:border-gray-700">
              {renderInverseNotation()}
            </div>
            
            <button 
              onClick={() => dispatch({ type: 'TOGGLE_EXPLANATION' })}
              className="mt-4 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 text-sm font-medium flex items-center"
            >
              <HiCalculator className="h-5 w-5 mr-1" />
              {state.showExplanation ? t('inverse.hide_explanation') : t('inverse.show_explanation')}
            </button>
          </div>
          
          {state.showExplanation && state.steps.length > 0 && (
            <div className="mt-8 bg-white dark:bg-gray-800 shadow-md rounded-lg p-5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center">
                  <HiCalculator className="h-6 w-6 mr-2 text-indigo-600 dark:text-indigo-400" />
                  {t('inverse.step_by_step')}
                </h3>
              </div>
              
              <StepByStepExplanation steps={state.steps} stepType="matrices" />
              
              <ConceitoMatematico
                title={t('inverse.mathematical_concept.title')} 
                isOpen={state.showConceitoMatematico} 
                onToggle={() => dispatch({ type: 'TOGGLE_CONCEITO_MATEMATICO' })}
              >
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                  <div className="flex-1">
                    <h5 className="font-medium text-gray-800 dark:text-gray-100 mb-2 border-b border-gray-200 dark:border-gray-700 pb-1">{t('inverse.mathematical_concept.definition_title')}</h5>
                    
                    <p className="text-gray-700 dark:text-gray-300 mb-2">
                      {t('inverse.mathematical_concept.definition_text')}
                    </p>
                    
                    <div className="bg-white dark:bg-gray-700 p-3 rounded-md border border-gray-100 dark:border-gray-600 shadow-sm">
                      <h6 className="text-lg font-medium text-indigo-700 dark:text-indigo-300 mb-1">{t('inverse.mathematical_concept.important_requirements')}</h6>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {t('inverse.mathematical_concept.square_requirement')}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {t('inverse.mathematical_concept.determinant_requirement')}
                      </p>
                    </div>

                    <h6 className="text-base font-medium text-gray-800 dark:text-gray-100 mt-4 mb-2">{t('inverse.mathematical_concept.calculation_methods')}</h6>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                      {t('inverse.mathematical_concept.adjoint_method')}:
                    </p>
                    <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-md text-center">
                      <p className="text-sm font-mono text-gray-700 dark:text-gray-300">
                        {t('inverse.mathematical_concept.adjoint_formula')}
                      </p>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
                      {t('inverse.mathematical_concept.adjoint_explanation')}
                    </p>

                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md border-l-2 border-blue-300 dark:border-blue-700 my-3">
                      <h6 className="text-blue-700 dark:text-blue-300 font-medium mb-1">{t('inverse.mathematical_concept.gaussian_method')}</h6>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {t('inverse.mathematical_concept.gaussian_explanation')}
                      </p>
                    </div>

                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md border-l-2 border-blue-300 dark:border-blue-700 my-3">
                      <h6 className="text-blue-700 dark:text-blue-300 font-medium mb-1">{t('determinant.mathematical_concept.visual_example')}</h6>
                      <p className="text-sm text-blue-800 dark:text-blue-200 mb-2">
                        {t('inverse.mathematical_concept.special_cases.diagonal_formula')}
                      </p>
                    </div>

                    <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-md border-l-2 border-indigo-300 dark:border-indigo-700 my-3">
                      <h6 className="text-indigo-700 dark:text-indigo-300 font-medium mb-1">{t('inverse.mathematical_concept.applications.title')}</h6>
                      <ul className="text-sm text-gray-700 dark:text-gray-300 list-disc list-inside space-y-1">
                        <li><span className="font-medium">{t('inverse.mathematical_concept.applications.linear_systems')}:</span> {t('inverse.mathematical_concept.applications.linear_systems_explanation')}</li>
                        <li><span className="font-medium">{t('inverse.mathematical_concept.applications.transformations')}:</span> {t('inverse.mathematical_concept.applications.transformations_explanation')}</li>
                        <li><span className="font-medium">{t('inverse.mathematical_concept.applications.least_squares')}:</span> {t('inverse.mathematical_concept.applications.least_squares_formula')}</li>
                        <li><span className="font-medium">{t('inverse.mathematical_concept.applications.markov_chains')}:</span> {t('inverse.mathematical_concept.applications.markov_explanation')}</li>
                        <li><span className="font-medium">{t('inverse.mathematical_concept.applications.computer_graphics')}:</span> {t('inverse.mathematical_concept.applications.graphics_explanation')}</li>
                        <li><span className="font-medium">{t('inverse.mathematical_concept.applications.economics')}:</span> {t('inverse.mathematical_concept.applications.economics_explanation')}</li>
                      </ul>
                    </div>
                    
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md border-l-2 border-blue-300 dark:border-blue-700 mb-3">
                      <h6 className="text-blue-700 dark:text-blue-300 font-medium mb-1">{t('inverse.mathematical_concept.applications.title')}</h6>
                      <ul className="text-sm text-gray-700 dark:text-gray-300 list-disc list-inside space-y-1">
                        <li><span className="font-medium">{t('inverse.mathematical_concept.applications.control_theory')}:</span> {t('inverse.mathematical_concept.applications.control_explanation')}</li>
                        <li><span className="font-medium">{t('inverse.mathematical_concept.applications.quantum_mechanics')}:</span> {t('inverse.mathematical_concept.applications.quantum_explanation')}</li>
                      </ul>
                    </div>

                    <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-md border-l-2 border-purple-300 dark:border-purple-700 mb-3">
                      <h6 className="text-purple-700 dark:text-purple-300 font-medium mb-1">{t('inverse.mathematical_concept.numerical_considerations.title')}</h6>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                        {t('inverse.mathematical_concept.numerical_considerations.computational_cost')}:
                      </p>
                      <ul className="text-sm text-gray-700 dark:text-gray-300 list-disc list-inside space-y-1">
                        <li><span className="font-medium">{t('inverse.mathematical_concept.numerical_considerations.conditioning')}:</span> {t('inverse.mathematical_concept.numerical_considerations.conditioning_explanation')}</li>
                        <li><span className="font-medium">{t('inverse.mathematical_concept.numerical_considerations.computational_cost')}:</span> {t('inverse.mathematical_concept.numerical_considerations.cost_explanation')}</li>
                        <li><span className="font-medium">{t('inverse.mathematical_concept.numerical_considerations.alternatives')}:</span> {t('inverse.mathematical_concept.numerical_considerations.alternative_explanation')}</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <h5 className="font-medium text-gray-800 dark:text-gray-100 mb-2 border-b border-gray-200 dark:border-gray-700 pb-1">{t('inverse.mathematical_concept.properties.title')}</h5>
                    
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-md border-l-2 border-green-300 dark:border-green-700 mb-3">
                      <h6 className="text-green-700 dark:text-green-300 font-medium mb-1">{t('inverse.mathematical_concept.properties.title')}</h6>
                      <ul className="text-sm text-gray-700 dark:text-gray-300 list-disc list-inside mb-2 space-y-1">
                        <li><span className="font-medium">{t('inverse.mathematical_concept.properties.identity_property')}:</span> {t('inverse.mathematical_concept.properties.identity_formula')}<br/>
                        </li>
                        <li><span className="font-medium">{t('inverse.mathematical_concept.properties.inverse_uniqueness')}:</span><br/>
                          <span className="text-xs ml-6">{t('inverse.mathematical_concept.properties.uniqueness_explanation')}</span>
                        </li>
                        <li><span className="font-medium">{t('inverse.mathematical_concept.properties.inverse_of_inverse')}:</span> {t('inverse.mathematical_concept.properties.inverse_of_inverse_formula')}<br/>
                        </li>
                        <li><span className="font-medium">{t('inverse.mathematical_concept.properties.product_inverse')}:</span> {t('inverse.mathematical_concept.properties.product_inverse_formula')}<br/>
                          <span className="text-xs ml-6">{t('inverse.mathematical_concept.properties.product_inverse_explanation')}</span>
                        </li>
                        <li><span className="font-medium">{t('inverse.mathematical_concept.properties.scalar_inverse')}:</span> {t('inverse.mathematical_concept.properties.scalar_inverse_formula')}<br/>
                        </li>
                        <li><span className="font-medium">{t('inverse.mathematical_concept.properties.transpose_inverse')}:</span> {t('inverse.mathematical_concept.properties.transpose_inverse_formula')}<br/>
                        </li>
                        <li><span className="font-medium">{t('inverse.mathematical_concept.properties.power_inverse')}:</span> {t('inverse.mathematical_concept.properties.power_inverse_formula')}<br/>
                        </li>
                      </ul>
                    </div>

                    <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-md border-l-2 border-purple-300 dark:border-purple-700 mb-3">
                      <h6 className="text-purple-700 dark:text-purple-300 font-medium mb-1">{t('inverse.mathematical_concept.special_cases.title')}</h6>
                      <ul className="text-sm text-gray-700 dark:text-gray-300 list-disc list-inside space-y-1">
                        <li><span className="font-medium">{t('inverse.mathematical_concept.special_cases.identity_matrix')}:</span> {t('inverse.mathematical_concept.special_cases.identity_inverse')}<br/>
                        </li>
                        <li><span className="font-medium">{t('inverse.mathematical_concept.special_cases.diagonal_matrix')}:</span> {t('inverse.mathematical_concept.special_cases.diagonal_inverse')}<br/>
                        </li>
                        <li><span className="font-medium">{t('inverse.mathematical_concept.special_cases.orthogonal_matrix')}:</span> {t('inverse.mathematical_concept.special_cases.orthogonal_inverse')}<br/>
                        </li>
                        <li><span className="font-medium">{t('inverse.mathematical_concept.special_cases.triangular_matrix')}:</span> {t('inverse.mathematical_concept.special_cases.triangular_inverse')}<br/>
                        </li>
                      </ul>
                    </div>

                    <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-md border-l-2 border-amber-300 dark:border-amber-700 mb-3">
                      <h6 className="text-amber-700 dark:text-amber-300 font-medium mb-1">{t('determinant.mathematical_concept.calculation_methods')}</h6>
                      <div className="space-y-2">
                        <div>
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('inverse.mathematical_concept.gaussian_method')}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 ml-2">
                            {t('inverse.mathematical_concept.gaussian_explanation')}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('inverse.mathematical_concept.adjoint_method')}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 ml-2">
                            {t('inverse.mathematical_concept.adjoint_explanation')}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-md border-l-2 border-red-300 dark:border-red-700 mb-3">
                      <h6 className="text-red-700 dark:text-red-300 font-medium mb-1">{t('determinant.mathematical_concept.common_errors')}</h6>
                      <ul className="text-sm text-gray-700 dark:text-gray-300 list-disc list-inside space-y-1">
                        <li>{t('inverse.errors.not_square_matrix')}</li>
                        <li>{t('inverse.errors.zero_determinant')}</li>
                        <li>{t('inverse.verification.product_inverse_explanation')}</li>
                      </ul>
                    </div>

                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md border-l-2 border-blue-300 dark:border-blue-700 mb-3">
                      <h6 className="text-blue-700 dark:text-blue-300 font-medium mb-1">{t('inverse.verification.properties_title')}</h6>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                        {t('inverse.verification.identity_property')}
                      </p>
                      <ul className="text-sm text-gray-700 dark:text-gray-300 list-disc list-inside space-y-1">
                        <li>{t('inverse.verification.identity_explanation')}</li>
                        <li>{t('inverse.verification.inverse_of_inverse')} - {t('inverse.verification.inverse_of_inverse_explanation')}</li>
                        <li>{t('inverse.verification.product_inverse')} - {t('inverse.verification.product_inverse_explanation')}</li>
                        <li>{t('inverse.verification.scalar_inverse')} - {t('inverse.verification.scalar_inverse_explanation')}</li>
                        <li>{t('inverse.verification.transpose_inverse')} - {t('inverse.verification.transpose_inverse_explanation')}</li>
                      </ul>
                    </div>
                    
                    <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-md border-l-2 border-indigo-300 dark:border-indigo-700 mb-3">
                      <h6 className="text-indigo-700 dark:text-indigo-300 font-medium mb-1">{t('inverse.mathematical_concept.applications.linear_systems')}</h6>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                        {t('inverse.mathematical_concept.applications.linear_systems_explanation')}:
                      </p>
                      <div className="text-sm text-gray-700 dark:text-gray-300">
                        <p>{t('inverse.mathematical_concept.applications.linear_systems_explanation')}</p>
                        <ul className="list-disc list-inside space-y-1 mt-1">
                          <li>{t('inverse.mathematical_concept.numerical_considerations.alternatives')}: {t('inverse.mathematical_concept.numerical_considerations.alternative_explanation')}</li>
                        </ul>
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

export default ResolvedorInverseMatrizes; 