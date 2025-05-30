import React from 'react';
import { HiCalculator, HiInformationCircle } from 'react-icons/hi';
import { getProportionExamples } from '../../utils/mathUtilsTeoriaNumeros';
import { useProportionSolver } from '../../hooks/aritmetica/useProporcaoSolver';
import StepByStepExplanation from '../../components/StepByStepExplanation';
import ConceitoMatematico from '../../components/ConceitoMatematico';
import { useTranslation } from 'react-i18next';

const ResolvedorProporcao: React.FC = () => {
    const { state, dispatch, handleSolve, applyExample, setSolveFor } = useProportionSolver();
    const { t } = useTranslation(['arithmetic', 'translation']);

    // Função que filtra exemplos baseado na variável a resolver
    const getFilteredExamples = () => {
        return getProportionExamples().filter(example => example.solveFor === state.solveFor);
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center mb-6">
                <HiCalculator className="h-6 w-6 text-indigo-600 dark:text-indigo-400 mr-2" />
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{t('arithmetic:proportion.title')}</h2>
            </div>

            <div className="resolver-container p-6 mb-8">
                <p className="text-gray-700 dark:text-gray-300 mb-6">
                    {t('arithmetic:proportion.description')}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center">
                        <input
                        type="number"
                        value={state.solveFor === 'a' ? '' : state.a}
                        onChange={(e) => dispatch({ type: 'SET_VALUE', field: 'a', value: e.target.value })}
                        disabled={state.solveFor === 'a'}
                        className={`w-full p-2 border border-gray-300 dark:border-gray-600 rounded-l-md focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400 ${state.solveFor === 'a' ? 'bg-gray-100 dark:bg-gray-700' : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200'}`}
                        placeholder="a"
                        />
                        <div className="mx-2 text-lg text-gray-700 dark:text-gray-300">/</div>
                        <input
                        type="number"
                        value={state.solveFor === 'b' ? '' : state.b}
                        onChange={(e) => dispatch({ type: 'SET_VALUE', field: 'b', value: e.target.value })}
                        disabled={state.solveFor === 'b'}
                        className={`w-full p-2 border border-gray-300 dark:border-gray-600 rounded-r-md focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400 ${state.solveFor === 'b' ? 'bg-gray-100 dark:bg-gray-700' : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200'}`}
                        placeholder="b"
                        />
                    </div>

                    <div className="flex items-center">
                        <input
                        type="number"
                        value={state.solveFor === 'c' ? '' : state.c}
                        onChange={(e) => dispatch({ type: 'SET_VALUE', field: 'c', value: e.target.value })}
                        disabled={state.solveFor === 'c'}
                        className={`w-full p-2 border border-gray-300 dark:border-gray-600 rounded-l-md focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400 ${state.solveFor === 'c' ? 'bg-gray-100 dark:bg-gray-700' : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200'}`}
                        placeholder="c"
                        />
                        <div className="mx-2 text-lg text-gray-700 dark:text-gray-300">/</div>
                        <input
                        type="number"
                        value={state.solveFor === 'd' ? '' : state.d}
                        onChange={(e) => dispatch({ type: 'SET_VALUE', field: 'd', value: e.target.value })}
                        disabled={state.solveFor === 'd'}
                        className={`w-full p-2 border border-gray-300 dark:border-gray-600 rounded-r-md focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400 ${state.solveFor === 'd' ? 'bg-gray-100 dark:bg-gray-700' : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200'}`}
                        placeholder="d"
                        />
                    </div>
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('arithmetic:proportion.solve_for')}:
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                        <label className="inline-flex items-center">
                            <input
                            type="radio"
                            checked={state.solveFor === 'a'}
                            onChange={() => setSolveFor('a')}
                            className="form-radio h-4 w-4 text-indigo-600 dark:text-indigo-400"
                            />
                            <span className="ml-2 text-gray-700 dark:text-gray-300">a</span>
                        </label>
                        <label className="inline-flex items-center">
                            <input
                            type="radio"
                            checked={state.solveFor === 'b'}
                            onChange={() => setSolveFor('b')}
                            className="form-radio h-4 w-4 text-indigo-600 dark:text-indigo-400"
                            />
                            <span className="ml-2 text-gray-700 dark:text-gray-300">b</span>
                        </label>
                        <label className="inline-flex items-center">
                            <input
                            type="radio"
                            checked={state.solveFor === 'c'}
                            onChange={() => setSolveFor('c')}
                            className="form-radio h-4 w-4 text-indigo-600 dark:text-indigo-400"
                            />  
                            <span className="ml-2 text-gray-700 dark:text-gray-300">c</span>
                        </label>
                        <label className="inline-flex items-center">
                            <input
                            type="radio"
                            checked={state.solveFor === 'd'}
                            onChange={() => setSolveFor('d')}
                            className="form-radio h-4 w-4 text-indigo-600 dark:text-indigo-400"
                            />
                            <span className="ml-2 text-gray-700 dark:text-gray-300">d</span>
                        </label>
                    </div>
                </div>

                {/* Exemplos de proporção */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('translation:common.examples')}
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {getFilteredExamples().map((example, index) => (
                            <button
                                key={index}
                                onClick={() => applyExample(example)}
                                className="px-3 py-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm rounded-full transition-colors"
                            >
                                {t(example.description)}
                            </button>
                        ))}
                    </div>
                </div>

                <button
                    onClick={handleSolve}
                    className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-medium py-2 px-6 rounded-md transition-colors duration-300"
                >
                    {t('translation:common.calculate')}
                </button>

                {state.errorMessage && (
                    <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-md">
                        {state.errorMessage}
                    </div>
                )}
            </div>

            {state.result !== null && (
                <div className="mt-8 resolver-result-container">
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-5">
                        <h3 className="text-lg font-medium text-green-800 dark:text-green-400 mb-2">{t('translation:common.result')}</h3>
                        <p className="text-xl text-gray-800 dark:text-gray-200">
                            {state.solveFor === 'a' && (
                                <div dangerouslySetInnerHTML={{ __html: t('arithmetic:proportion.result_value', { variable: 'A', value: state.result }) }} />
                            )}
                            {state.solveFor === 'b' && (
                                <div dangerouslySetInnerHTML={{ __html: t('arithmetic:proportion.result_value', { variable: 'B', value: state.result }) }} />
                            )}
                            {state.solveFor === 'c' && (
                                <div dangerouslySetInnerHTML={{ __html: t('arithmetic:proportion.result_value', { variable: 'C', value: state.result }) }} />
                            )}
                            {state.solveFor === 'd' && (
                                <div dangerouslySetInnerHTML={{ __html: t('arithmetic:proportion.result_value', { variable: 'D', value: state.result }) }} />
                            )}
                        </p>
                        
                        <button 
                            onClick={() => dispatch({ type: 'TOGGLE_EXPLANATION' })}
                            className="mt-4 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 text-sm font-medium flex items-center"
                        >
                            <HiInformationCircle className="h-5 w-5 mr-1" />
                            {state.showExplanation 
                                ? t('translation:common.hide_explanation') 
                                : t('translation:common.show_explanation')}
                        </button>
                    </div>

                    {state.showExplanation && (
                        <div className="mt-8 resolver-explanation-container">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center">
                                    <HiCalculator className="h-6 w-6 mr-2 text-indigo-600 dark:text-indigo-400" />
                                    {t('translation:common.step_by_step')}
                                </h3>
                            </div>
                            
                            <StepByStepExplanation steps={state.steps} stepType="linear" />
                            
                            <ConceitoMatematico
                                title={t('translation:common.mathematical_concept')}
                                isOpen={state.showConceitoMatematico}
                                onToggle={() => dispatch({ type: 'TOGGLE_CONCEITO_MATEMATICO' })}
                            >
                                <div className="flex flex-col md:flex-row gap-4 mb-4">
                                    <div className="flex-1">
                                        <h5 className="font-medium text-gray-800 dark:text-gray-100 mb-2 border-b border-gray-200 dark:border-gray-700 pb-1">{t('arithmetic:proportion.concept.understanding_title')}</h5>
                                        <p className="text-gray-700 dark:text-gray-300 mb-3">
                                            {t('arithmetic:proportion.concept.understanding_text')}
                                        </p>
                                        <div className="bg-white dark:bg-gray-700 p-3 rounded-md border border-gray-100 dark:border-gray-600 shadow-sm mb-3">
                                            <div className="text-center font-medium text-indigo-700 dark:text-indigo-400">
                                                <p>a / b = c / d</p>
                                                <p className="text-sm mt-1">{t('arithmetic:proportion.concept.fundamental_property')}</p>
                                            </div>
                                        </div>
                                        <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-md">
                                            <p className="text-sm text-indigo-700 dark:text-indigo-300">
                                                <span className="font-medium">{t('translation:common.example')}:</span> {t('arithmetic:proportion.concept.example_text')}
                                                <br />
                                                2 × 10 = 5 × 4 → 20 = 20 ✓
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex-1">
                                        <h5 className="font-medium text-gray-800 dark:text-gray-100 mb-2 border-b border-gray-200 dark:border-gray-700 pb-1">{t('arithmetic:proportion.concept.solving_title')}</h5>
                                        <p className="text-gray-700 dark:text-gray-300 mb-3">
                                            {t('arithmetic:proportion.concept.solving_text')}
                                        </p>
                                        <div className="bg-white dark:bg-gray-700 p-3 rounded-md border border-gray-100 dark:border-gray-600 shadow-sm">
                                            <h6 className="text-indigo-700 dark:text-indigo-400 font-medium mb-2">{t('arithmetic:proportion.concept.formulas_title')}:</h6>
                                            <ul className="text-sm space-y-2 text-gray-700 dark:text-gray-300">
                                                <li><span className="font-medium">{t('arithmetic:proportion.concept.for_a')}:</span> a = (b × c) / d</li>
                                                <li><span className="font-medium">{t('arithmetic:proportion.concept.for_b')}:</span> b = (a × d) / c</li>
                                                <li><span className="font-medium">{t('arithmetic:proportion.concept.for_c')}:</span> c = (a × d) / b</li>
                                                <li><span className="font-medium">{t('arithmetic:proportion.concept.for_d')}:</span> d = (b × c) / a</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="mt-4">
                                    <h5 className="font-medium text-gray-800 dark:text-gray-100 mb-2 border-b border-gray-200 dark:border-gray-700 pb-1">{t('arithmetic:proportion.concept.applications_title')}</h5>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                        <div className="p-3 bg-white dark:bg-gray-700 rounded-md border border-gray-100 dark:border-gray-600 shadow-sm">
                                            <h6 className="text-indigo-700 dark:text-indigo-400 font-medium mb-1">{t('arithmetic:proportion.concept.application1_title')}</h6>
                                            <p className="text-gray-700 dark:text-gray-300 text-xs">
                                                {t('arithmetic:proportion.concept.application1_text')}
                                            </p>
                                        </div>
                                        <div className="p-3 bg-white dark:bg-gray-700 rounded-md border border-gray-100 dark:border-gray-600 shadow-sm">
                                            <h6 className="text-indigo-700 dark:text-indigo-400 font-medium mb-1">{t('arithmetic:proportion.concept.application2_title')}</h6>
                                            <p className="text-gray-700 dark:text-gray-300 text-xs">
                                                {t('arithmetic:proportion.concept.application2_text')}
                                            </p>
                                        </div>
                                        <div className="p-3 bg-white dark:bg-gray-700 rounded-md border border-gray-100 dark:border-gray-600 shadow-sm">
                                            <h6 className="text-indigo-700 dark:text-indigo-400 font-medium mb-1">{t('arithmetic:proportion.concept.application3_title')}</h6>
                                            <p className="text-gray-700 dark:text-gray-300 text-xs">
                                                {t('arithmetic:proportion.concept.application3_text')}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="mt-4 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-md border border-indigo-100 dark:border-indigo-800">
                                    <h5 className="font-medium text-indigo-800 dark:text-indigo-300 mb-1 flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                        </svg>
                                        {t('arithmetic:proportion.concept.solution_tip_title')}
                                    </h5>
                                    <p className="text-sm text-indigo-700 dark:text-indigo-300">
                                        {t('arithmetic:proportion.concept.solution_tip_text')}
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

export default ResolvedorProporcao;