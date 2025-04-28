import React from 'react';
import { HiCalculator, HiInformationCircle } from 'react-icons/hi';
import { useFuncoesTrigonometricasSolver, TrigFunction } from '../../hooks/trigonometria/useFuncoesTrigonometricasSolver';
import StepByStepExplanation from '../../components/StepByStepExplanation';
import ConceitoMatematico from '../../components/ConceitoMatematico';
import { useTranslation } from 'react-i18next';

const ResolvedorFuncoesTrigonometricas: React.FC = () => {
    const {
        state,
        dispatch,
        getFilteredExamples,
        applyExample,
        handleSolve
    } = useFuncoesTrigonometricasSolver();
    const { t } = useTranslation(['trigonometry', 'translation']);

    return (
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-6">
            <HiCalculator className="h-6 w-6 text-indigo-600 dark:text-indigo-400 mr-2" />
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{t('trigonometry:trigonometric_functions.title')}</h2>
          </div>
          
          <div className="resolver-container p-6 mb-8">
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              {t('trigonometry:trigonometric_functions.description')}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('trigonometry:trigonometric_functions.labels.function')}
                </label>
                <select
                  value={state.trigFunction}
                  onChange={(e) => dispatch({ type: 'SET_TRIG_FUNCTION', value: e.target.value as TrigFunction })}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                >
                  <option value="sin">{t('trigonometry:trigonometric_functions.function_names.sin')}</option>
                  <option value="cos">{t('trigonometry:trigonometric_functions.function_names.cos')}</option>
                  <option value="tan">{t('trigonometry:trigonometric_functions.function_names.tan')}</option>
                  <option value="asin">{t('trigonometry:trigonometric_functions.function_names.asin')}</option>
                  <option value="acos">{t('trigonometry:trigonometric_functions.function_names.acos')}</option>
                  <option value="atan">{t('trigonometry:trigonometric_functions.function_names.atan')}</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {['sin', 'cos', 'tan'].includes(state.trigFunction) ? 
                    t('trigonometry:trigonometric_functions.labels.angle') : 
                    t('trigonometry:trigonometric_functions.labels.value')}
                </label>
                <input
                  type="text"
                  value={state.inputValue}
                  onChange={(e) => dispatch({ type: 'SET_INPUT_VALUE', value: e.target.value })}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                  placeholder={['sin', 'cos', 'tan'].includes(state.trigFunction) ? 
                    t('trigonometry:trigonometric_functions.placeholders.angle') : 
                    t('trigonometry:trigonometric_functions.placeholders.value')}
                  step="any"
                />
              </div>
            </div>
            
            {['sin', 'cos', 'tan'].includes(state.trigFunction) && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('trigonometry:trigonometric_functions.labels.angle_unit_input')}
                </label>
                <div className="flex space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      checked={state.inputUnit === 'degrees'}
                      onChange={() => dispatch({ type: 'SET_INPUT_UNIT', value: 'degrees' })}
                      className="form-radio h-4 w-4 text-indigo-600 dark:text-indigo-400"
                    />
                    <span className="ml-2 text-gray-700 dark:text-gray-300">{t('trigonometry:trigonometric_functions.units.degrees')}</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      checked={state.inputUnit === 'radians'}
                      onChange={() => dispatch({ type: 'SET_INPUT_UNIT', value: 'radians' })}
                      className="form-radio h-4 w-4 text-indigo-600 dark:text-indigo-400"
                    />
                    <span className="ml-2 text-gray-700 dark:text-gray-300">{t('trigonometry:trigonometric_functions.units.radians')}</span>
                  </label>
                </div>
              </div>
            )}
            
            {['asin', 'acos', 'atan'].includes(state.trigFunction) && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('trigonometry:trigonometric_functions.labels.angle_unit_output')}
                </label>
                <div className="flex space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      checked={state.outputUnit === 'degrees'}
                      onChange={() => dispatch({ type: 'SET_OUTPUT_UNIT', value: 'degrees' })}
                      className="form-radio h-4 w-4 text-indigo-600 dark:text-indigo-400"
                    />
                    <span className="ml-2 text-gray-700 dark:text-gray-300">{t('trigonometry:trigonometric_functions.units.degrees')}</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      checked={state.outputUnit === 'radians'}
                      onChange={() => dispatch({ type: 'SET_OUTPUT_UNIT', value: 'radians' })}
                      className="form-radio h-4 w-4 text-indigo-600 dark:text-indigo-400"
                    />
                    <span className="ml-2 text-gray-700 dark:text-gray-300">{t('trigonometry:trigonometric_functions.units.radians')}</span>
                  </label>
                </div>
              </div>
            )}
            
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('trigonometry:trigonometric_functions.labels.examples')}
                </label>
                <div className="flex flex-wrap gap-2 mb-4">
                    {getFilteredExamples().map((exemplo, index) => (
                        <button
                            key={index}
                            onClick={() => applyExample(exemplo)}
                            className="px-3 py-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm rounded-full transition-colors"
                        >
                            {exemplo.description}
                        </button>
                    ))}
                </div>
            </div>
            
            <button
              onClick={handleSolve}
              className="bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 text-white font-medium py-2 px-6 rounded-md transition-colors duration-300"
            >
              {t('trigonometry:trigonometric_functions.labels.calculate')}
            </button>
            
            {state.error && (
              <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 rounded-md">
                {state.error}
              </div>
            )}
          </div>
          
          {state.result !== null && (
            <div className="space-y-6">
              <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-5">
                <h3 className="text-lg font-medium text-green-800 dark:text-green-300 mb-2">{t('trigonometry:trigonometric_functions.results.title')}</h3>
                <p className="text-xl text-gray-800 dark:text-gray-200">
                  {t('trigonometry:trigonometric_functions.results.format', {
                    function: state.trigFunction,
                    input: state.inputValue,
                    unit: ['sin', 'cos', 'tan'].includes(state.trigFunction) && state.inputUnit === 'degrees' ? '°' : '',
                    result: state.result,
                    result_unit: ['asin', 'acos', 'atan'].includes(state.trigFunction) && state.outputUnit === 'degrees' ? '°' : ''
                  })}
                </p>
                
                <button 
                    onClick={() => dispatch({ type: 'TOGGLE_EXPLANATION' })}
                    className="mt-4 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 text-sm font-medium flex items-center"
                >
                  <HiInformationCircle className="h-5 w-5 mr-1" />
                  {state.showExplanation 
                    ? t('trigonometry:trigonometric_functions.explanation.hide') 
                    : t('trigonometry:trigonometric_functions.explanation.show')}
                </button>
              </div>
              
              {state.showExplanation && state.explanationSteps.length > 0 && (
                <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-5">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center">
                      <HiCalculator className="h-6 w-6 mr-2 text-indigo-600 dark:text-indigo-400" />
                      {t('trigonometry:trigonometric_functions.explanation.title')}
                    </h3>
                  </div>
                  
                  <StepByStepExplanation steps={state.explanationSteps} stepType="trigonometric" />
                  
                  <ConceitoMatematico
                    title={t('trigonometry:trigonometric_functions.mathematical_concept.title')}
                    isOpen={state.showConceitoMatematico}
                    onToggle={() => dispatch({ type: 'TOGGLE_CONCEITO_MATEMATICO' })}
                  >
                    <div className="space-y-4 text-gray-700 dark:text-gray-300">
                      {['sin', 'cos', 'tan'].includes(state.trigFunction) ? (
                        <>
                          <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                              <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2 border-b border-gray-200 dark:border-gray-700 pb-1">
                                {t('trigonometry:trigonometric_functions.mathematical_concept.direct_functions.definition_title')}
                              </h5>
                              <p>
                                <span className="font-semibold">
                                  {t('trigonometry:trigonometric_functions.mathematical_concept.direct_functions.definition_text')}
                                </span>
                              </p>
                              <ul className="list-disc pl-5 mt-2 space-y-2">
                                <li className="p-1 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors">
                                  <strong>{t('trigonometry:trigonometric_functions.mathematical_concept.direct_functions.functions.sine')}</strong>
                                </li>
                                <li className="p-1 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors">
                                  <strong>{t('trigonometry:trigonometric_functions.mathematical_concept.direct_functions.functions.cosine')}</strong>
                                </li>
                                <li className="p-1 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors">
                                  <strong>{t('trigonometry:trigonometric_functions.mathematical_concept.direct_functions.functions.tangent')}</strong>
                                </li>
                              </ul>
                            </div>
                            <div className="flex-1">
                              <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2 border-b border-gray-200 dark:border-gray-700 pb-1">
                                {t('trigonometry:trigonometric_functions.mathematical_concept.direct_functions.relations_title')}
                              </h5>
                              <div className="bg-white dark:bg-gray-700 p-4 rounded-md border border-gray-100 dark:border-gray-600 shadow-sm">
                                <h6 className="text-indigo-700 dark:text-indigo-300 font-medium mb-3 text-center">
                                  {t('trigonometry:trigonometric_functions.mathematical_concept.direct_functions.triangle_title')}
                                </h6>
                                <div className="space-y-3">
                                  <div className="flex items-center justify-between border-b border-dashed border-gray-200 dark:border-gray-600 pb-2">
                                    <span className="font-medium">
                                      {t('trigonometry:trigonometric_functions.mathematical_concept.direct_functions.triangle_parts.hypotenuse')}
                                    </span>
                                    <span className="text-indigo-600 dark:text-indigo-400">
                                      {t('trigonometry:trigonometric_functions.mathematical_concept.direct_functions.triangle_parts.hypotenuse_def')}
                                    </span>
                                  </div>
                                  <div className="flex items-center justify-between border-b border-dashed border-gray-200 dark:border-gray-600 pb-2">
                                    <span className="font-medium">
                                      {t('trigonometry:trigonometric_functions.mathematical_concept.direct_functions.triangle_parts.opposite')}
                                    </span>
                                    <span className="text-indigo-600 dark:text-indigo-400">
                                      {t('trigonometry:trigonometric_functions.mathematical_concept.direct_functions.triangle_parts.opposite_def')}
                                    </span>
                                  </div>
                                  <div className="flex items-center justify-between pb-2">
                                    <span className="font-medium">
                                      {t('trigonometry:trigonometric_functions.mathematical_concept.direct_functions.triangle_parts.adjacent')}
                                    </span>
                                    <span className="text-indigo-600 dark:text-indigo-400">
                                      {t('trigonometry:trigonometric_functions.mathematical_concept.direct_functions.triangle_parts.adjacent_def')}
                                    </span>
                                  </div>
                                </div>
                                <div className="mt-3 p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-md text-center text-sm">
                                  <p className="mb-1">
                                    {t('trigonometry:trigonometric_functions.mathematical_concept.direct_functions.relations_text')}
                                  </p>
                                  <p className="font-mono font-medium">
                                    sin(θ) = <span className="text-purple-600 dark:text-purple-400">Oposto/Hipotenusa</span>
                                  </p>
                                  <p className="font-mono font-medium">
                                    cos(θ) = <span className="text-green-600 dark:text-green-400">Adjacente/Hipotenusa</span>
                                  </p>
                                  <p className="font-mono font-medium">
                                    tan(θ) = <span className="text-blue-600 dark:text-blue-400">Oposto/Adjacente</span>
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-4">
                            <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2 border-b border-gray-200 dark:border-gray-700 pb-1">
                              {t('trigonometry:trigonometric_functions.mathematical_concept.direct_functions.domain_title')}
                            </h5>
                            <ul className="mt-2 space-y-2">
                              <li className="p-2 bg-white dark:bg-gray-700 rounded-md border border-gray-100 dark:border-gray-600 shadow-sm">
                                <strong className="text-indigo-600 dark:text-indigo-400">
                                  {t('trigonometry:trigonometric_functions.mathematical_concept.direct_functions.domains.sin')}
                                </strong>
                              </li>
                              <li className="p-2 bg-white dark:bg-gray-700 rounded-md border border-gray-100 dark:border-gray-600 shadow-sm">
                                <strong className="text-indigo-600 dark:text-indigo-400">
                                  {t('trigonometry:trigonometric_functions.mathematical_concept.direct_functions.domains.cos')}
                                </strong>
                              </li>
                              <li className="p-2 bg-white dark:bg-gray-700 rounded-md border border-gray-100 dark:border-gray-600 shadow-sm">
                                <strong className="text-indigo-600 dark:text-indigo-400">
                                  {t('trigonometry:trigonometric_functions.mathematical_concept.direct_functions.domains.tan')}
                                </strong>
                              </li>
                            </ul>
                          </div>
                          
                          <div className="mt-4 bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-md border-l-4 border-yellow-400 dark:border-yellow-600">
                            <h5 className="font-medium text-yellow-800 dark:text-yellow-300 mb-1">
                              {t('trigonometry:trigonometric_functions.mathematical_concept.applications_title')}
                            </h5>
                            <ul className="list-disc pl-5 mt-1 text-gray-700 dark:text-gray-300">
                              {(t('trigonometry:trigonometric_functions.mathematical_concept.applications', { returnObjects: true }) as string[]).map((app, index) => (
                                <li key={index}>{app}</li>
                              ))}
                            </ul>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                              <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2 border-b border-gray-200 dark:border-gray-700 pb-1">
                                {t('trigonometry:trigonometric_functions.mathematical_concept.inverse_functions.definition_title')}
                              </h5>
                              <p>
                                <span className="font-semibold">
                                  {t('trigonometry:trigonometric_functions.mathematical_concept.inverse_functions.definition_text')}
                                </span>
                              </p>
                            </div>
                            <div className="flex-1">
                              <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2 border-b border-gray-200 dark:border-gray-700 pb-1">
                                {t('trigonometry:trigonometric_functions.mathematical_concept.inverse_functions.interpretation_title')}
                              </h5>
                              <p>
                                {t('trigonometry:trigonometric_functions.mathematical_concept.inverse_functions.interpretation_text')}
                              </p>
                            </div>
                          </div>
                          
                          <div className="mt-4">
                            <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2 border-b border-gray-200 dark:border-gray-700 pb-1">
                              {t('trigonometry:trigonometric_functions.mathematical_concept.inverse_functions.domain_title')}
                            </h5>
                            <ul className="mt-2 space-y-2">
                              <li className="p-2 bg-white dark:bg-gray-700 rounded-md border border-gray-100 dark:border-gray-600 shadow-sm">
                                <strong className="text-indigo-600 dark:text-indigo-400">
                                  {t('trigonometry:trigonometric_functions.mathematical_concept.inverse_functions.domains.arcsin')}
                                </strong>
                              </li>
                              <li className="p-2 bg-white dark:bg-gray-700 rounded-md border border-gray-100 dark:border-gray-600 shadow-sm">
                                <strong className="text-indigo-600 dark:text-indigo-400">
                                  {t('trigonometry:trigonometric_functions.mathematical_concept.inverse_functions.domains.arccos')}
                                </strong>
                              </li>
                              <li className="p-2 bg-white dark:bg-gray-700 rounded-md border border-gray-100 dark:border-gray-600 shadow-sm">
                                <strong className="text-indigo-600 dark:text-indigo-400">
                                  {t('trigonometry:trigonometric_functions.mathematical_concept.inverse_functions.domains.arctan')}
                                </strong>
                              </li>
                            </ul>
                          </div>
                          
                          <div className="mt-4 bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-md border-l-4 border-yellow-400 dark:border-yellow-600">
                            <h5 className="font-medium text-yellow-800 dark:text-yellow-300 mb-1">
                              {t('trigonometry:trigonometric_functions.mathematical_concept.applications_title')}
                            </h5>
                            <ul className="list-disc pl-5 mt-1 text-gray-700 dark:text-gray-300">
                              {(t('trigonometry:trigonometric_functions.mathematical_concept.applications', { returnObjects: true }) as string[]).map((app, index) => (
                                <li key={index}>{app}</li>
                              ))}
                            </ul>
                          </div>
                          
                          <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-md border-l-4 border-indigo-300 dark:border-indigo-700 mt-4">
                            <p>
                              <span className="font-semibold">{t('trigonometry:trigonometric_functions.mathematical_concept.inverse_functions.note_title')}:</span>{' '}
                              {t('trigonometry:trigonometric_functions.mathematical_concept.inverse_functions.note_text')}
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  </ConceitoMatematico>
                </div>
              )}
            </div>
          )}
        </div>
      );
    };

export default ResolvedorFuncoesTrigonometricas;
