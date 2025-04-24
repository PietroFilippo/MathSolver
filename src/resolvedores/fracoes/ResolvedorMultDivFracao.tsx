import React from 'react';
import { HiCalculator, HiInformationCircle } from 'react-icons/hi';
import { FractionDisplay } from '../../utils/mathUtilsFracoes';
import { useFractionMultDivSolver } from '../../hooks/fracoes/useFracaoMultDivSolver';
import StepByStepExplanation from '../../components/StepByStepExplanation';
import ConceitoMatematico from '../../components/ConceitoMatematico';
import { useTranslation } from 'react-i18next';

const ResolvedorMultDivFracao: React.FC = () => {
  const { t } = useTranslation('fractions');
  const { 
    state, 
    dispatch, 
    handleSolve, 
    applyExample, 
    getFilteredExamples 
  } = useFractionMultDivSolver();

  return (
    <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
            <HiCalculator className="h-6 w-6 text-indigo-600 dark:text-indigo-400 mr-2" />
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{t('multiplication_division.title')}</h2>
        </div>
        
        <div className="resolver-container p-6 mb-8">
            <p className="text-gray-700 dark:text-gray-300 mb-6">
                {t('multiplication_division.description')}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('multiplication_division.labels.fraction1')}
                    </label>
                    <div className="flex items-center">
                        <input
                            type="number"
                            value={state.numerator1}
                            onChange={(e) => dispatch({ type: 'SET_NUMERATOR_1', value: e.target.value })}
                            className="w-20 p-2 border border-gray-300 dark:border-gray-600 rounded-l-md focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                            placeholder={t('mixed_fractions.labels.numerator')}
                        />
                        <div className="px-2 py-2 bg-gray-100 dark:bg-gray-600 border-t border-b border-gray-300 dark:border-gray-600">
                            /
                        </div>
                        <input
                            type="number"
                            value={state.denominator1}
                            onChange={(e) => dispatch({ type: 'SET_DENOMINATOR_1', value: e.target.value })}
                            className="w-20 p-2 border border-gray-300 dark:border-gray-600 rounded-r-md focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                            placeholder={t('mixed_fractions.labels.denominator')}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('multiplication_division.labels.fraction2')}
                    </label>
                    <div className="flex items-center">
                        <input
                            type="number"
                            value={state.numerator2}
                            onChange={(e) => dispatch({ type: 'SET_NUMERATOR_2', value: e.target.value })}
                            className="w-20 p-2 border border-gray-300 dark:border-gray-600 rounded-l-md focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                            placeholder={t('mixed_fractions.labels.numerator')}
                        />
                        <div className="px-2 py-2 bg-gray-100 dark:bg-gray-600 border-t border-b border-gray-300 dark:border-gray-600">
                            /
                        </div>
                        <input
                            type="number"
                            value={state.denominator2}
                            onChange={(e) => dispatch({ type: 'SET_DENOMINATOR_2', value: e.target.value })}
                            className="w-20 p-2 border border-gray-300 dark:border-gray-600 rounded-r-md focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                            placeholder={t('mixed_fractions.labels.denominator')}
                        />
                    </div>
                </div>
            </div>

            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('multiplication_division.labels.operation')}
                </label>
                <div className="flex space-x-4">
                    <label className="inline-flex items-center">
                        <input
                            type="radio"
                            value="multiply"
                            checked={state.operation === 'multiply'}
                            onChange={() => dispatch({ type: 'SET_OPERATION', operation: 'multiply' })}
                            className="form-radio h-4 w-4 text-indigo-600 dark:text-indigo-400"
                        />
                        <span className="ml-2 text-gray-700 dark:text-gray-300">{t('multiplication_division.labels.multiplication')}</span>
                    </label>
                    <label className="inline-flex items-center">
                        <input
                            type="radio"
                            checked={state.operation === 'divide'}
                            onChange={() => dispatch({ type: 'SET_OPERATION', operation: 'divide' })}
                            className="form-radio h-4 w-4 text-indigo-600 dark:text-indigo-400"
                        />
                        <span className="ml-2 text-gray-700 dark:text-gray-300">{t('multiplication_division.labels.division')}</span>
                    </label>
                </div>
            </div>

            {/* Exemplos de frações */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('multiplication_division.labels.examples')}
              </label>
              <div className="flex flex-wrap gap-2 mb-4">
                {getFilteredExamples().map((example, index) => (
                  <button
                    key={index}
                    onClick={() => applyExample(example)}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm rounded-full transition-colors"
                  >
                    {example.description}
                  </button>
                ))}
                </div>
            </div>

            <button
                onClick={handleSolve}
                className="bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 text-white font-medium py-2 px-6 rounded-md transition-colors duration-300 mt-4"
            >
                {t('multiplication_division.labels.calculate')}
            </button>

            {state.errorMessage && (
                <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 rounded-md">
                    {state.errorMessage}
                </div>
            )}
        </div>
      
      {state.resultado && (
        <div className="space-y-6">
          <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-5">
            <h3 className="text-lg font-medium text-green-800 dark:text-green-300 mb-2">{t('common.result')}</h3>
            <div className="flex items-center">
              <p className="text-xl mr-2 text-gray-800 dark:text-gray-200">
                {state.operation === 'multiply' 
                  ? t('multiplication_division.results.multiplication')
                  : t('multiplication_division.results.division')}
              </p>
              {state.resultadoNum !== null && state.resultadoDen !== null && (
                <FractionDisplay 
                  numerator={state.resultadoNum} 
                  denominator={state.resultadoDen} 
                  className="text-xl text-gray-800 dark:text-gray-200"
                />
              )}
              {state.resultadoNum !== null && state.resultadoDen !== null && state.resultadoNum % state.resultadoDen === 0 && (
                <span className="ml-3 text-gray-800 dark:text-gray-200">= {state.resultadoNum / state.resultadoDen}</span>
              )}
            </div>
            
            <button 
                onClick={() => dispatch({ type: 'TOGGLE_EXPLANATION' })}
                className="mt-4 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 text-sm font-medium flex items-center"
            >
                <HiInformationCircle className="h-5 w-5 mr-1" />
                {state.showExplanation 
                  ? t('common.hide_explanation')
                  : t('common.show_explanation')}
            </button>
          </div>
          
          {state.showExplanation && (
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center">
                  <HiCalculator className="h-6 w-6 mr-2 text-indigo-600 dark:text-indigo-400" />
                  {t('common.step_by_step')}
                </h3>
              </div>
              
              <StepByStepExplanation steps={state.steps} stepType="linear" />
              
              <ConceitoMatematico
                title={t('common.mathematical_concept')}
                isOpen={state.showConceitoMatematico}
                onToggle={() => dispatch({ type: 'TOGGLE_CONCEITO_MATEMATICO' })}
              >
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                  <div className="flex-1">
                    <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2 border-b border-gray-200 dark:border-gray-700 pb-1">{t('multiplication_division.mathematical_concept.mul_div_title')}</h5>
                    <div className="space-y-3">
                      <p className="text-gray-700 dark:text-gray-300">
                        {t('multiplication_division.mathematical_concept.mul_div_text')}
                      </p>
                      <div className="bg-white dark:bg-gray-700 p-3 rounded-md border border-gray-100 dark:border-gray-600 shadow-sm">
                        <h6 className="text-indigo-700 dark:text-indigo-300 font-medium mb-2">{t('multiplication_division.mathematical_concept.formulas_title')}</h6>
                        <div className="space-y-2 text-center font-medium text-indigo-700 dark:text-indigo-300">
                          <p>
                            <span className="font-semibold">{t('multiplication_division.mathematical_concept.multiplication_formula')}</span><br />
                            {t('multiplication_division.mathematical_concept.multiplication_formula_text')}
                          </p>
                          <p className="space-y-2 text-center font-medium text-indigo-700 dark:text-indigo-300">
                            <span className="font-semibold">{t('multiplication_division.mathematical_concept.division_formula')}</span><br />
                            {t('multiplication_division.mathematical_concept.division_formula_text')}
                          </p>
                        </div>
                      </div>
                      <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-md">
                        <p className="text-sm text-indigo-700 dark:text-indigo-300">
                          <span className="font-medium">{t('multiplication_division.mathematical_concept.fundamental_property')}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2 border-b border-gray-200 dark:border-gray-700 pb-1">{t('multiplication_division.mathematical_concept.resolution_steps_title')}</h5>
                    <div className="bg-white dark:bg-gray-700 p-3 rounded-md border border-gray-100 dark:border-gray-600 shadow-sm space-y-4">
                      <div>
                        <h6 className="text-indigo-700 dark:text-indigo-300 font-medium mb-2">{t('multiplication_division.mathematical_concept.multiplication_steps_title')}</h6>
                        <ol className="text-sm space-y-2 list-decimal pl-5 text-gray-700 dark:text-gray-300">
                          <li>
                            <span className="font-medium text-indigo-700 dark:text-indigo-300">{t('multiplication_division.mathematical_concept.multiplication_steps.step1_title')}</span>
                            <p className="text-xs mt-1">
                              {t('multiplication_division.mathematical_concept.multiplication_steps.step1_text')}
                            </p>
                          </li>
                          <li>
                            <span className="font-medium text-indigo-700 dark:text-indigo-300">{t('multiplication_division.mathematical_concept.multiplication_steps.step2_title')}</span>
                            <p className="text-xs mt-1">
                              {t('multiplication_division.mathematical_concept.multiplication_steps.step2_text')}
                            </p>
                          </li>
                          <li>
                            <span className="font-medium text-indigo-700 dark:text-indigo-300">{t('multiplication_division.mathematical_concept.multiplication_steps.step3_title')}</span>
                            <p className="text-xs mt-1">
                              {t('multiplication_division.mathematical_concept.multiplication_steps.step3_text')}
                            </p>
                          </li>
                        </ol>
                      </div>
                      
                      <div className="pt-3 border-t border-gray-100 dark:border-gray-600">
                        <h6 className="text-indigo-700 dark:text-indigo-300 font-medium mb-2">{t('multiplication_division.mathematical_concept.division_steps_title')}</h6>
                        <ol className="text-sm space-y-2 list-decimal pl-5 text-gray-700 dark:text-gray-300">
                          <li>
                            <span className="font-medium text-indigo-700 dark:text-indigo-300">{t('multiplication_division.mathematical_concept.division_steps.step1_title')}</span>
                            <p className="text-xs mt-1">
                              {t('multiplication_division.mathematical_concept.division_steps.step1_text')}
                            </p>
                          </li>
                          <li>
                            <span className="font-medium text-indigo-700 dark:text-indigo-300">{t('multiplication_division.mathematical_concept.division_steps.step2_title')}</span>
                            <p className="text-xs mt-1">
                              {t('multiplication_division.mathematical_concept.division_steps.step2_text')}
                            </p>
                          </li>
                          <li>
                            <span className="font-medium text-indigo-700 dark:text-indigo-300">{t('multiplication_division.mathematical_concept.division_steps.step3_title')}</span>
                            <p className="text-xs mt-1">
                              {t('multiplication_division.mathematical_concept.division_steps.step3_text')}
                            </p>
                          </li>
                        </ol>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-md">
                  <h5 className="font-medium text-indigo-800 dark:text-indigo-300 mb-1">{t('multiplication_division.mathematical_concept.geometric_visualization_title')}</h5>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className="bg-white dark:bg-gray-700 p-2 rounded-md">
                      <p className="text-xs font-medium mb-1 text-indigo-700 dark:text-indigo-300">{t('multiplication_division.mathematical_concept.multiplication_area_title')}</p>
                      <div className="flex flex-col items-center">
                        <div className="w-full h-24 flex flex-col items-center">
                          <div className="w-full flex justify-center mb-1">
                            <div className="w-16 h-16 border border-gray-400 dark:border-gray-500 rounded-sm grid grid-cols-3 grid-rows-2">
                              <div className="col-span-2 row-span-1 bg-blue-200 dark:bg-blue-500/40 border border-white dark:border-gray-600"></div>
                              <div className="border border-white dark:border-gray-600"></div>
                              <div className="border border-white dark:border-gray-600"></div>
                              <div className="border border-white dark:border-gray-600"></div>
                              <div className="border border-white dark:border-gray-600"></div>
                            </div>
                            <div className="mx-2 flex items-center">×</div>
                            <div className="w-16 h-16 border border-gray-400 dark:border-gray-500 rounded-sm grid grid-cols-2 grid-rows-4">
                              <div className="col-span-1 row-span-3 bg-green-200 dark:bg-green-500/40 border border-white dark:border-gray-600"></div>
                              <div className="border border-white dark:border-gray-600"></div>
                              <div className="border border-white dark:border-gray-600"></div>
                              <div className="border border-white dark:border-gray-600"></div>
                              <div className="border border-white dark:border-gray-600"></div>
                            </div>
                          </div>
                          <div className="mt-1 flex items-center text-gray-700 dark:text-gray-300">
                            <div>2/3</div>
                            <div className="mx-2">×</div>
                            <div>3/4</div>
                            <div className="mx-2">=</div>
                            <div>6/12 = 1/2</div>
                          </div>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          {t('multiplication_division.mathematical_concept.multiplication_area_text')}
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-700 p-2 rounded-md">
                      <p className="text-xs font-medium mb-1 text-indigo-700 dark:text-indigo-300">{t('multiplication_division.mathematical_concept.division_comparison_title')}</p>
                      <div className="flex flex-col items-center">
                        <div className="w-full h-24 flex flex-col items-center">
                          <div className="w-full flex justify-center mb-1">
                            <div className="w-16 h-8 border border-gray-400 dark:border-gray-500 rounded-sm flex">
                              <div className="w-12 h-full bg-blue-200 dark:bg-blue-500/40"></div>
                            </div>
                            <div className="mx-2 flex items-center">÷</div>
                            <div className="w-16 h-8 border border-gray-400 dark:border-gray-500 rounded-sm flex">
                              <div className="w-8 h-full bg-green-200 dark:bg-green-500/40"></div>
                            </div>
                            <div className="mx-2 flex items-center">=</div>
                            <div className="flex items-center">1,5</div>
                          </div>
                          <div className="mt-1 flex items-center text-gray-700 dark:text-gray-300">
                            <div>3/4</div>
                            <div className="mx-2">÷</div>
                            <div>1/2</div>
                            <div className="mx-2">=</div>
                            <div>3/2</div>
                          </div>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          {t('multiplication_division.mathematical_concept.division_comparison_text')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white dark:bg-gray-700 p-3 rounded-md border border-gray-100 dark:border-gray-600 shadow-sm">
                    <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2">{t('multiplication_division.mathematical_concept.detailed_examples_title')}</h5>
                    <div className="space-y-3">
                      <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-md">
                        <p className="text-sm text-indigo-700 dark:text-indigo-300 font-medium mb-1">
                          {t('multiplication_division.mathematical_concept.simplified_multiplication.title')}
                        </p>
                        <div className="text-xs text-gray-700 dark:text-gray-300 space-y-1.5">
                          <p className="text-gray-500 dark:text-gray-400">{t('multiplication_division.mathematical_concept.simplified_multiplication.text1')}</p>
                          <p>{t('multiplication_division.mathematical_concept.simplified_multiplication.text2')}</p>
                          <p>{t('multiplication_division.mathematical_concept.simplified_multiplication.text3')}</p>
                          <p className="font-medium">{t('multiplication_division.mathematical_concept.simplified_multiplication.result')}</p>
                        </div>
                      </div>
                      
                      <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-md">
                        <p className="text-sm text-purple-700 dark:text-purple-300 font-medium mb-1">
                          {t('multiplication_division.mathematical_concept.negative_division.title')}
                        </p>
                        <div className="text-xs text-gray-700 dark:text-gray-300 space-y-1.5">
                          <p>{t('multiplication_division.mathematical_concept.negative_division.text1')}</p>
                          <p>{t('multiplication_division.mathematical_concept.negative_division.text2')}</p>
                          <p>{t('multiplication_division.mathematical_concept.negative_division.text3')}</p>
                          <p className="font-medium">{t('multiplication_division.mathematical_concept.negative_division.result')}</p>
                        </div>
                      </div>
                      
                      <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-md">
                        <p className="text-sm text-green-700 dark:text-green-300 font-medium mb-1">
                          {t('multiplication_division.mathematical_concept.integer_multiplication.title')}
                        </p>
                        <div className="text-xs text-gray-700 dark:text-gray-300 space-y-1.5">
                          <p>{t('multiplication_division.mathematical_concept.integer_multiplication.text1')}</p>
                          <p>{t('multiplication_division.mathematical_concept.integer_multiplication.text2')}</p>
                          <p>{t('multiplication_division.mathematical_concept.integer_multiplication.text3')}</p>
                          <p className="font-medium">{t('multiplication_division.mathematical_concept.integer_multiplication.result')}</p>
                        </div>
                      </div>
                      
                      <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded-md">
                        <p className="text-sm text-amber-700 dark:text-amber-300 font-medium mb-1">
                          {t('multiplication_division.mathematical_concept.integer_division.title')}
                        </p>
                        <div className="text-xs text-gray-700 dark:text-gray-300 space-y-1.5">
                          <p>{t('multiplication_division.mathematical_concept.integer_division.text1')}</p>
                          <p>{t('multiplication_division.mathematical_concept.integer_division.text2')}</p>
                          <p>{t('multiplication_division.mathematical_concept.integer_division.text3')}</p>
                          <p className="font-medium">{t('multiplication_division.mathematical_concept.integer_division.result')}</p>
                        </div>
                      </div>
                      
                      <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                        <p className="text-sm text-blue-700 dark:text-blue-300 font-medium mb-1">
                          {t('multiplication_division.mathematical_concept.recipe_application.title')}
                        </p>
                        <div className="text-xs text-gray-700 dark:text-gray-300 space-y-1.5">
                          <p>{t('multiplication_division.mathematical_concept.recipe_application.text1')}</p>
                          <p>{t('multiplication_division.mathematical_concept.recipe_application.text2')}</p>
                          <p>{t('multiplication_division.mathematical_concept.recipe_application.text3')}</p>
                          <p>{t('multiplication_division.mathematical_concept.recipe_application.text4')}</p>
                          <p className="font-medium">{t('multiplication_division.mathematical_concept.recipe_application.result')}</p>
                        </div>
                      </div>
                      
                      <div className="p-2 bg-rose-50 dark:bg-rose-900/20 rounded-md">
                        <p className="text-sm text-rose-700 dark:text-rose-300 font-medium mb-1">
                          {t('multiplication_division.mathematical_concept.mixed_fractions_multiplication.title')}
                        </p>
                        <div className="text-xs text-gray-700 dark:text-gray-300 space-y-1.5">
                          <p>{t('multiplication_division.mathematical_concept.mixed_fractions_multiplication.text1')}</p>
                          <p>{t('multiplication_division.mathematical_concept.mixed_fractions_multiplication.text2')}</p>
                          <p>{t('multiplication_division.mathematical_concept.mixed_fractions_multiplication.text3')}</p>
                          <p className="pl-3">{t('multiplication_division.mathematical_concept.mixed_fractions_multiplication.text4')}</p>
                          <p>{t('multiplication_division.mathematical_concept.mixed_fractions_multiplication.text5')}</p>
                          <p className="font-medium">{t('multiplication_division.mathematical_concept.mixed_fractions_multiplication.result')}</p>
                        </div>
                      </div>
                      
                      <div className="p-2 bg-teal-50 dark:bg-teal-900/20 rounded-md">
                        <p className="text-sm text-teal-700 dark:text-teal-300 font-medium mb-1">
                          {t('multiplication_division.mathematical_concept.map_scale_application.title')}
                        </p>
                        <div className="text-xs text-gray-700 dark:text-gray-300 space-y-1.5">
                          <p>{t('multiplication_division.mathematical_concept.map_scale_application.text1')}</p>
                          <p>{t('multiplication_division.mathematical_concept.map_scale_application.text2')}</p>
                          <p>{t('multiplication_division.mathematical_concept.map_scale_application.text3')}</p>
                          <p>{t('multiplication_division.mathematical_concept.map_scale_application.text4')}</p>
                          <p>{t('multiplication_division.mathematical_concept.map_scale_application.text5')}</p>
                          <p className="font-medium">{t('multiplication_division.mathematical_concept.map_scale_application.result')}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md border border-blue-100 dark:border-blue-800 shadow-sm">
                      <h5 className="font-medium text-blue-800 dark:text-blue-300 mb-2">{t('multiplication_division.mathematical_concept.important_properties_title')}</h5>
                      <div className="space-y-3 text-sm">
                        <div className="bg-white dark:bg-gray-700 p-2 rounded-md">
                          <p className="font-medium text-gray-700 dark:text-gray-300">{t('multiplication_division.mathematical_concept.commutative_property.title')}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            {t('multiplication_division.mathematical_concept.commutative_property.text1')}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            {t('multiplication_division.mathematical_concept.commutative_property.text2')}
                          </p>
                        </div>
                        
                        <div className="bg-white dark:bg-gray-700 p-2 rounded-md">
                          <p className="font-medium text-gray-700 dark:text-gray-300">{t('multiplication_division.mathematical_concept.associative_property.title')}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            {t('multiplication_division.mathematical_concept.associative_property.text1')}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            {t('multiplication_division.mathematical_concept.associative_property.text2')}
                          </p>
                        </div>
                        
                        <div className="bg-white dark:bg-gray-700 p-2 rounded-md">
                          <p className="font-medium text-gray-700 dark:text-gray-300">{t('multiplication_division.mathematical_concept.identity_element.title')}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            {t('multiplication_division.mathematical_concept.identity_element.text1')}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            {t('multiplication_division.mathematical_concept.identity_element.text2')}
                          </p>
                        </div>
                        
                        <div className="bg-white dark:bg-gray-700 p-2 rounded-md">
                          <p className="font-medium text-gray-700 dark:text-gray-300">{t('multiplication_division.mathematical_concept.multiplicative_inverse.title')}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            {t('multiplication_division.mathematical_concept.multiplicative_inverse.text1')}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            {t('multiplication_division.mathematical_concept.multiplicative_inverse.text2')}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-md border-l-4 border-yellow-400 dark:border-yellow-600">
                      <h5 className="font-medium text-yellow-800 dark:text-yellow-300 mb-2">{t('multiplication_division.mathematical_concept.tips_tricks_title')}</h5>
                      <ul className="text-sm space-y-1 list-disc pl-4 text-gray-700 dark:text-gray-300">
                        {(t('multiplication_division.mathematical_concept.tips_tricks', { returnObjects: true }) as string[]).map((tip, index) => (
                          <li key={index}>{tip}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-md border border-green-100 dark:border-green-800">
                      <h5 className="font-medium text-green-800 dark:text-green-300 mb-2">{t('multiplication_division.mathematical_concept.real_world_applications_title')}</h5>
                      <ul className="text-sm space-y-1 list-disc pl-4 text-gray-700 dark:text-gray-300">
                        {(t('multiplication_division.mathematical_concept.real_world_applications', { returnObjects: true }) as string[]).map((app, index) => (
                          <li key={index}>{app}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-700 p-3 rounded-md border border-gray-100 dark:border-gray-600 shadow-sm">
                      <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2">{t('multiplication_division.mathematical_concept.special_cases_title')}</h5>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="bg-purple-50 dark:bg-purple-900/20 p-2 rounded-md">
                          <p className="font-medium text-purple-700 dark:text-purple-300 mb-1">{t('multiplication_division.mathematical_concept.multiplication_by_zero.title')}</p>
                          <p className="text-xs text-gray-700 dark:text-gray-300">
                            {t('multiplication_division.mathematical_concept.multiplication_by_zero.text')}
                          </p>
                        </div>
                        <div className="bg-amber-50 dark:bg-amber-900/20 p-2 rounded-md">
                          <p className="font-medium text-amber-700 dark:text-amber-300 mb-1">{t('multiplication_division.mathematical_concept.division_by_zero.title')}</p>
                          <p className="text-xs text-gray-700 dark:text-gray-300">
                            {t('multiplication_division.mathematical_concept.division_by_zero.text')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
            
                <div className="mt-4 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-md border border-indigo-100 dark:border-indigo-800">
                  <h5 className="font-medium text-indigo-800 dark:text-indigo-300 mb-1 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    {t('multiplication_division.mathematical_concept.advanced_concepts_title')}
                  </h5>
                  <p className="text-sm text-indigo-700 dark:text-indigo-300">
                    {t('multiplication_division.mathematical_concept.advanced_concepts_text')}
                  </p>
                </div>
              </ConceitoMatematico>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ResolvedorMultDivFracao;