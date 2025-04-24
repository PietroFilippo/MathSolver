import React from 'react';
import { HiCalculator, HiInformationCircle } from 'react-icons/hi';
import { FractionDisplay, getFractionSimplificationExamples } from '../../utils/mathUtilsFracoes';
import { useFractionSimplificationSolver } from '../../hooks/fracoes/useFractionSimplificacaoSolver';
import StepByStepExplanation from '../../components/StepByStepExplanation';
import ConceitoMatematico from '../../components/ConceitoMatematico';
import { useTranslation } from 'react-i18next';

const ResolvedorSimplificacaoFracoes: React.FC = () => {
  const {
    state,
    dispatch,
    handleSolve,
    applyExample
  } = useFractionSimplificationSolver();
  const { t } = useTranslation(['fractions', 'translation']);

  return (
    <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
            <HiCalculator className="h-6 w-6 text-indigo-600 dark:text-indigo-400 mr-2" />
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{t('fractions:simplification.title')}</h2>
        </div>
        
        <div className="resolver-container p-6 mb-8">
            <p className="text-gray-700 dark:text-gray-300 mb-6">
                {t('fractions:simplification.description')}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('fractions:simplification.labels.fraction')}
                    </label>
                    <div className="flex items-center">
                        <input
                            type="number"
                            value={state.numerator}
                            onChange={(e) => dispatch({ type: 'SET_NUMERATOR', value: e.target.value })}
                            className="w-24 p-2 border border-gray-300 dark:border-gray-600 rounded-l-md focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                            placeholder={t('fractions:simplification.labels.numerator')}
                        />
                        <div className="px-2 py-2 bg-gray-100 dark:bg-gray-600 border-t border-b border-gray-300 dark:border-gray-600">
                            /
                        </div>
                        <input
                            type="number"
                            value={state.denominator}
                            onChange={(e) => dispatch({ type: 'SET_DENOMINATOR', value: e.target.value })}
                            className="w-24 p-2 border border-gray-300 dark:border-gray-600 rounded-r-md focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                            placeholder={t('fractions:simplification.labels.denominator')}
                        />
                    </div>
                </div>
            </div>

            {/* Exemplos de frações */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('fractions:simplification.labels.examples')}
              </label>
              <div className="flex flex-wrap gap-2 mb-4">
                {getFractionSimplificationExamples(t).map((example, index) => (
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
                {t('fractions:simplification.labels.simplify')}
            </button>

            {state.errorMessage && (
                <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 rounded-md">
                    {state.errorMessage}
                </div>
            )}
        </div>
      
      {state.resultado && state.resultadoNum !== null && state.resultadoDen !== null && (
        <div className="space-y-6">
          <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-5">
            <h3 className="text-lg font-medium text-green-800 dark:text-green-300 mb-2">Resultado</h3>
            <div className="flex flex-wrap items-center">
              <p className="text-xl mr-2 text-gray-800 dark:text-gray-200">A fração na forma irredutível é: </p>
              <div className="mt-1 sm:mt-0">
                <FractionDisplay
                  numerator={state.resultadoNum} 
                  denominator={state.resultadoDen} 
                  className="text-xl text-gray-800 dark:text-gray-200"
                />
                {state.resultadoNum % state.resultadoDen === 0 && (
                  <span className="ml-3 text-gray-800 dark:text-gray-200">= {state.resultadoNum / state.resultadoDen}</span>
                )}
              </div>
            </div>
            
            <button 
                onClick={() => dispatch({ type: 'TOGGLE_EXPLANATION' })}
                className="mt-4 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 text-sm font-medium flex items-center"
            >
                <HiInformationCircle className="h-5 w-5 mr-1" />
                {state.showExplanation ? "Ocultar explicação detalhada" : "Mostrar explicação detalhada"}
            </button>
          </div>
          
          {state.showExplanation && (
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center">
                  <HiCalculator className="h-6 w-6 mr-2 text-indigo-600 dark:text-indigo-400" />
                  {t('fractions:common.step_by_step')}
                </h3>
              </div>
              
              <StepByStepExplanation steps={state.steps} stepType="linear" />
              
              <ConceitoMatematico
                title={t('fractions:common.mathematical_concept')}
                isOpen={state.showConceitoMatematico}
                onToggle={() => dispatch({ type: 'TOGGLE_CONCEITO_MATEMATICO' })}
              >
                  <div className="flex flex-col md:flex-row gap-4 mb-4">
                    <div className="flex-1">
                      <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2 border-b border-gray-200 dark:border-gray-700 pb-1">
                        {t('fractions:simplification.mathematical_concept.title')}
                      </h5>
                      <div className="space-y-3">
                        <p className="text-gray-700 dark:text-gray-300">
                          {t('fractions:simplification.mathematical_concept.explanation')}
                        </p>
                        <div className="bg-white dark:bg-gray-700 p-3 rounded-md border border-gray-100 dark:border-gray-600 shadow-sm">
                          <h6 className="text-indigo-700 dark:text-indigo-300 font-medium mb-2">
                            {t('fractions:simplification.mathematical_concept.how_to_title')}
                          </h6>
                          <ol className="text-sm space-y-2 list-decimal pl-5 text-gray-700 dark:text-gray-300">
                            <li>
                              <span className="font-medium text-indigo-700 dark:text-indigo-300">
                                {t('fractions:simplification.mathematical_concept.how_to.step1_title')}
                              </span>: 
                              {t('fractions:simplification.mathematical_concept.how_to.step1_text')}
                            </li>
                            <li>
                              <span className="font-medium text-indigo-700 dark:text-indigo-300">
                                {t('fractions:simplification.mathematical_concept.how_to.step2_title')}
                              </span>: 
                              {t('fractions:simplification.mathematical_concept.how_to.step2_text')}
                            </li>
                            <li>
                              <span className="font-medium text-indigo-700 dark:text-indigo-300">
                                {t('fractions:simplification.mathematical_concept.how_to.step3_title')}
                              </span>: 
                              {t('fractions:simplification.mathematical_concept.how_to.step3_text')}
                            </li>
                          </ol>
                        </div>
                        <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-md">
                          <p className="text-sm text-indigo-700 dark:text-indigo-300">
                            <span className="font-medium">{t('fractions:simplification.mathematical_concept.example_title')}</span> 
                            {t('fractions:simplification.mathematical_concept.example_text')}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2 border-b border-gray-200 dark:border-gray-700 pb-1">
                        {t('fractions:simplification.mathematical_concept.gcd_methods_title')}
                      </h5>
                      <div className="bg-white dark:bg-gray-700 p-3 rounded-md border border-gray-100 dark:border-gray-600 shadow-sm space-y-4">
                        <div>
                          <h6 className="text-indigo-700 dark:text-indigo-300 font-medium mb-2">
                            {t('fractions:simplification.mathematical_concept.factorization_method.title')}
                          </h6>
                          <ol className="text-sm space-y-2 list-decimal pl-5 text-gray-700 dark:text-gray-300">
                            <li>
                              <span className="font-medium text-indigo-700 dark:text-indigo-300">
                                {t('fractions:simplification.mathematical_concept.factorization_method.step1_title')}
                              </span>: 
                              {t('fractions:simplification.mathematical_concept.factorization_method.step1_text')}
                            </li>
                            <li>
                              <span className="font-medium text-indigo-700 dark:text-indigo-300">
                                {t('fractions:simplification.mathematical_concept.factorization_method.step2_title')}
                              </span>: 
                              {t('fractions:simplification.mathematical_concept.factorization_method.step2_text')}
                            </li>
                            <li>
                              <span className="font-medium text-indigo-700 dark:text-indigo-300">
                                {t('fractions:simplification.mathematical_concept.factorization_method.step3_title')}
                              </span>: 
                              {t('fractions:simplification.mathematical_concept.factorization_method.step3_text')}
                            </li>
                          </ol>
                        </div>
                        
                        <div className="pt-3 border-t border-gray-100 dark:border-gray-600">
                          <h6 className="text-indigo-700 dark:text-indigo-300 font-medium mb-2">
                            {t('fractions:simplification.mathematical_concept.euclid_method.title')}
                          </h6>
                          <ol className="text-sm space-y-2 list-decimal pl-5 text-gray-700 dark:text-gray-300">
                            <li>
                              <span className="font-medium text-indigo-700 dark:text-indigo-300">
                                {t('fractions:simplification.mathematical_concept.euclid_method.step1_title')}
                              </span>: 
                              {t('fractions:simplification.mathematical_concept.euclid_method.step1_text')}
                            </li>
                            <li>
                              <span className="font-medium text-indigo-700 dark:text-indigo-300">
                                {t('fractions:simplification.mathematical_concept.euclid_method.step2_title')}
                              </span>: 
                              {t('fractions:simplification.mathematical_concept.euclid_method.step2_text')}
                            </li>
                            <li>
                              <span className="font-medium text-indigo-700 dark:text-indigo-300">
                                {t('fractions:simplification.mathematical_concept.euclid_method.step3_title')}
                              </span>: 
                              {t('fractions:simplification.mathematical_concept.euclid_method.step3_text')}
                            </li>
                          </ol>
                          <p className="text-xs mt-2 text-gray-600 dark:text-gray-400">
                            {t('fractions:simplification.mathematical_concept.euclid_method.example')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-md">
                    <h5 className="font-medium text-indigo-800 dark:text-indigo-300 mb-1">
                      {t('fractions:simplification.mathematical_concept.visualization_title')}
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                      <div className="bg-white dark:bg-gray-700 p-3 rounded-md border border-gray-100 dark:border-gray-600 shadow-sm">
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
                          {t('fractions:simplification.mathematical_concept.example_12_30')}
                        </p>
                        <div className="text-sm text-gray-700 dark:text-gray-300 space-y-3">
                          <div className="flex flex-col items-center">
                            <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                              <div className="text-right">{t('fractions:simplification.mathematical_concept.numerator_12')}</div>
                              <div>{t('fractions:simplification.mathematical_concept.denominator_30')}</div>
                              <div className="text-right">{t('fractions:simplification.mathematical_concept.factors_12')}</div>
                              <div>{t('fractions:simplification.mathematical_concept.factors_30')}</div>
                              <div className="text-right">{t('fractions:simplification.mathematical_concept.common_factors')}</div>
                              <div>{t('fractions:simplification.mathematical_concept.gcd_6')}</div>
                            </div>
                            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600 w-full text-center">
                              <p className="mb-2">{t('fractions:simplification.mathematical_concept.dividing_by_gcd')}</p>
                              <div className="flex justify-center items-center space-x-3">
                                <div className="flex flex-col items-center">
                                  <div className="flex items-center justify-center">
                                    <span>12</span>
                                  </div>
                                  <div className="w-8 border-t border-gray-400 dark:border-gray-500"></div>
                                  <div className="flex items-center justify-center">
                                    <span>30</span>
                                  </div>
                                </div>
                                <span>=</span>
                                <div className="flex flex-col items-center">
                                  <div className="flex items-center justify-center">
                                    <span>12 ÷ 6</span>
                                  </div>
                                  <div className="w-16 border-t border-gray-400 dark:border-gray-500"></div>
                                  <div className="flex items-center justify-center">
                                    <span>30 ÷ 6</span>
                                  </div>
                                </div>
                                <span>=</span>
                                <div className="flex flex-col items-center">
                                  <div className="flex items-center justify-center">
                                    <span>2</span>
                                  </div>
                                  <div className="w-8 border-t border-gray-400 dark:border-gray-500"></div>
                                  <div className="flex items-center justify-center">
                                    <span>5</span>
                                  </div>
                                </div>
                              </div>
                              <p className="mt-2 font-medium text-indigo-700 dark:text-indigo-300">
                                {t('fractions:simplification.mathematical_concept.result_2_5')}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white dark:bg-gray-700 p-3 rounded-md border border-gray-100 dark:border-gray-600 shadow-sm">
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
                          {t('fractions:simplification.mathematical_concept.blocks_visualization')}
                        </p>
                        <div className="flex flex-col items-center space-y-4">
                          <div>
                            <p className="text-xs text-center text-gray-700 dark:text-gray-300 mb-1">
                              {t('fractions:simplification.mathematical_concept.original_fraction')}
                            </p>
                            <div className="flex flex-col items-center">
                              <div className="flex">
                                <div className="w-6 h-6 bg-blue-200 dark:bg-blue-500/40 border border-white dark:border-gray-600"></div>
                                <div className="w-6 h-6 bg-blue-200 dark:bg-blue-500/40 border border-white dark:border-gray-600"></div>
                                <div className="w-6 h-6 bg-blue-200 dark:bg-blue-500/40 border border-white dark:border-gray-600"></div>
                                <div className="w-6 h-6 bg-blue-200 dark:bg-blue-500/40 border border-white dark:border-gray-600"></div>
                                <div className="w-6 h-6 bg-blue-200 dark:bg-blue-500/40 border border-white dark:border-gray-600"></div>
                                <div className="w-6 h-6 bg-blue-200 dark:bg-blue-500/40 border border-white dark:border-gray-600"></div>
                              </div>
                              <div className="flex">
                                <div className="w-6 h-6 bg-blue-200 dark:bg-blue-500/40 border border-white dark:border-gray-600"></div>
                                <div className="w-6 h-6 bg-blue-200 dark:bg-blue-500/40 border border-white dark:border-gray-600"></div>
                                <div className="w-6 h-6 bg-white dark:bg-gray-600 border border-white dark:border-gray-600"></div>
                                <div className="w-6 h-6 bg-white dark:bg-gray-600 border border-white dark:border-gray-600"></div>
                                <div className="w-6 h-6 bg-white dark:bg-gray-600 border border-white dark:border-gray-600"></div>
                                <div className="w-6 h-6 bg-white dark:bg-gray-600 border border-white dark:border-gray-600"></div>
                              </div>
                            </div>
                            <div className="text-center text-gray-700 dark:text-gray-300 text-xs mt-1">
                              <span>{t('fractions:simplification.mathematical_concept.six_of_eight')}</span>
                            </div>
                          </div>
                          
                          <div>
                            <p className="text-xs text-center text-gray-700 dark:text-gray-300 mb-1">
                              {t('fractions:simplification.mathematical_concept.simplified_fraction')}
                            </p>
                            <div className="flex">
                              <div className="w-12 h-12 bg-blue-200 dark:bg-blue-500/40 border border-white dark:border-gray-600"></div>
                              <div className="w-12 h-12 bg-blue-200 dark:bg-blue-500/40 border border-white dark:border-gray-600"></div>
                              <div className="w-12 h-12 bg-blue-200 dark:bg-blue-500/40 border border-white dark:border-gray-600"></div>
                              <div className="w-12 h-12 bg-white dark:bg-gray-600 border border-white dark:border-gray-600"></div>
                            </div>
                            <div className="text-center text-gray-700 dark:text-gray-300 text-xs mt-1">
                              <span>{t('fractions:simplification.mathematical_concept.three_of_four')}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white dark:bg-gray-700 p-3 rounded-md border border-gray-100 dark:border-gray-600 shadow-sm">
                      <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2">
                        {t('fractions:simplification.mathematical_concept.detailed_examples_title')}
                      </h5>
                      <div className="space-y-3">
                        <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-md">
                          <p className="text-sm text-indigo-700 dark:text-indigo-300 font-medium mb-1">
                            {t('fractions:simplification.mathematical_concept.examples.example1_title')}
                          </p>
                          <div className="text-xs text-gray-700 dark:text-gray-300 space-y-1.5">
                            {(t('fractions:simplification.mathematical_concept.examples.example1_steps', { returnObjects: true }) as string[]).map((step, index) => (
                              <p key={index} className={index === 0 || index === 4 ? "" : "pl-3"}>
                                {step}
                              </p>
                            ))}
                          </div>
                        </div>
                        
                        <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-md">
                          <p className="text-sm text-green-700 dark:text-green-300 font-medium mb-1">
                            {t('fractions:simplification.mathematical_concept.examples.example2_title')}
                          </p>
                          <div className="text-xs text-gray-700 dark:text-gray-300 space-y-1.5">
                            {(t('fractions:simplification.mathematical_concept.examples.example2_steps', { returnObjects: true }) as string[]).map((step, index) => (
                              <p key={index} className={index === 0 || index === 2 ? "" : "pl-3"}>
                                {step}
                              </p>
                            ))}
                          </div>
                        </div>
                        
                        <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded-md">
                          <p className="text-sm text-amber-700 dark:text-amber-300 font-medium mb-1">
                            {t('fractions:simplification.mathematical_concept.examples.example3_title')}
                          </p>
                          <div className="text-xs text-gray-700 dark:text-gray-300 space-y-1.5">
                            {(t('fractions:simplification.mathematical_concept.examples.example3_steps', { returnObjects: true }) as string[]).map((step, index) => (
                              <p key={index}>{step}</p>
                            ))}
                          </div>
                        </div>
                        
                        <div className="p-2 bg-rose-50 dark:bg-rose-900/20 rounded-md">
                          <p className="text-sm text-rose-700 dark:text-rose-300 font-medium mb-1">
                            {t('fractions:simplification.mathematical_concept.examples.example4_title')}
                          </p>
                          <div className="text-xs text-gray-700 dark:text-gray-300 space-y-1.5">
                            {(t('fractions:simplification.mathematical_concept.examples.example4_steps', { returnObjects: true }) as string[]).map((step, index) => (
                              <p key={index} className={index === 0 || index === 2 || index === 3 ? "" : "pl-3"}>
                                {step}
                              </p>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-4">
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md border border-blue-100 dark:border-blue-800 shadow-sm">
                        <h5 className="font-medium text-blue-800 dark:text-blue-300 mb-2">
                          {t('fractions:simplification.mathematical_concept.properties_title')}
                        </h5>
                        <div className="space-y-3 text-sm">
                          <div className="bg-white dark:bg-gray-700 p-2 rounded-md">
                            <p className="font-medium text-gray-700 dark:text-gray-300">
                              {t('fractions:simplification.mathematical_concept.properties.fundamental_title')}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                              {t('fractions:simplification.mathematical_concept.properties.fundamental_text')}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                              {t('fractions:simplification.mathematical_concept.properties.fundamental_formula')}
                            </p>
                          </div>
                          
                          <div className="bg-white dark:bg-gray-700 p-2 rounded-md">
                            <p className="font-medium text-gray-700 dark:text-gray-300">
                              {t('fractions:simplification.mathematical_concept.properties.equivalent_title')}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                              {t('fractions:simplification.mathematical_concept.properties.equivalent_text')}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                              {t('fractions:simplification.mathematical_concept.properties.equivalent_example')}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-md border-l-4 border-yellow-400 dark:border-yellow-600">
                        <h5 className="font-medium text-yellow-800 dark:text-yellow-300 mb-2">
                          {t('fractions:simplification.mathematical_concept.tips_title')}
                        </h5>
                        <ul className="text-sm space-y-1 list-disc pl-4 text-gray-700 dark:text-gray-300">
                          {(t('fractions:simplification.mathematical_concept.tips', { returnObjects: true }) as string[]).map((tip, index) => (
                            <li key={index}>{tip}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-md border border-green-100 dark:border-green-800">
                        <h5 className="font-medium text-green-800 dark:text-green-300 mb-2">
                          {t('fractions:simplification.mathematical_concept.applications_title')}
                        </h5>
                        <ul className="text-sm space-y-1 list-disc pl-4 text-gray-700 dark:text-gray-300">
                          {(t('fractions:simplification.mathematical_concept.applications', { returnObjects: true }) as string[]).map((app, index) => (
                            <li key={index}>{app}</li>
                          ))}
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

export default ResolvedorSimplificacaoFracoes;
