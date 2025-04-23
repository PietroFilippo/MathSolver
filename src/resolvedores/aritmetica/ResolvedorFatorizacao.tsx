import React from 'react';
import { HiCalculator, HiInformationCircle } from 'react-icons/hi';
import { getFactorizationExamples } from '../../utils/mathUtilsTeoriaNumeros';
import { useFactorizationSolver } from '../../hooks/aritmetica/useFatorizacaoSolver';
import StepByStepExplanation from '../../components/StepByStepExplanation';
import ConceitoMatematico from '../../components/ConceitoMatematico';
import { useTranslation } from 'react-i18next';
import { Trans } from 'react-i18next';

const ResolvedorFatorizacao: React.FC = () => {
    const { t } = useTranslation(['arithmetic', 'translation']);
    const { state, dispatch, handleSolve, applyExample } = useFactorizationSolver();

    // Formata resultado
    const formatResult = (): string => {
        if (!state.primeFactors) return '';
        
        const { factors, exponents } = state.primeFactors;
        
        if (factors.length === 0) return '';
        
        let formattedResult = '';
        
        for (let i = 0; i < factors.length; i++) {
            if (i > 0) formattedResult += ' × ';
            formattedResult += exponents[i] > 1 ? `${factors[i]}<sup>${exponents[i]}</sup>` : `${factors[i]}`;
        }
        
        return formattedResult;
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center mb-6">
                <HiCalculator className="h-6 w-6 text-indigo-600 dark:text-indigo-400 mr-2" />
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{t('arithmetic:factorization.title')}</h2>
            </div>

            <div className="resolver-container p-6 mb-8">
                <p className="text-gray-700 dark:text-gray-300 mb-6">
                    {t('arithmetic:factorization.description')}
                </p>

                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="flex-grow">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('arithmetic:factorization.input_label')}:
                    </label>
                    <input
                        type="number"
                            value={state.inputNumber}
                            onChange={(e) => dispatch({ type: 'SET_INPUT_NUMBER', value: e.target.value })}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400"
                            placeholder={t('arithmetic:factorization.input_placeholder')}
                            min="2"
                    />
                    </div>
                </div>

                {/* Exemplos de fatoração */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('translation:common.examples')}
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {getFactorizationExamples().map((example, index) => (
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
                    className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-medium py-2 px-6 rounded-md transition-colors duration-300"
                >
                    {t('arithmetic:factorization.button')}
                </button>
                
                {state.errorMessage && (
                    <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 rounded-md">
                        {state.errorMessage}
                    </div>
                )}
            </div>

            {state.primeFactors && (
                <div className="space-y-6">
                    <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-5">
                        <h3 className="text-lg font-medium text-green-800 dark:text-green-300 mb-2">{t('translation:common.result')}</h3>
                        <div>
                        <p className="text-xl text-gray-800 dark:text-gray-200">
                        <Trans 
                            i18nKey="arithmetic:factorization.result_text"
                            values={{ number: state.number }}
                            components={{ span: <span className="font-bold" /> }}
                        />: <span className="font-bold" dangerouslySetInnerHTML={{ __html: formatResult() }} />
                       </p>
                        </div>

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
                        <div className="mt-8 bg-white dark:bg-gray-800 shadow-md rounded-lg p-5 border border-gray-200 dark:border-gray-700">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 flex items-center">
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
                                            <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2 border-b border-gray-200 dark:border-gray-700 pb-1">{t('arithmetic:factorization.concept.prime_numbers.title')}</h5>
                                            <p className="text-gray-700 dark:text-gray-300 mb-3">
                                                {t('arithmetic:factorization.concept.prime_numbers.description')}
                                            </p>
                                        <div className="bg-indigo-50 dark:bg-indigo-900/30 p-3 rounded-md">
                                            <p className="text-indigo-700 dark:text-indigo-300 font-medium mb-2">{t('arithmetic:factorization.concept.prime_numbers.examples_title')}:</p>
                                            <p className="text-sm text-indigo-600 dark:text-indigo-400">{t('arithmetic:factorization.concept.prime_numbers.examples')}</p>
                                        </div>
                                            </div>
                                    
                                    <div className="flex-1">
                                        <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2 border-b border-gray-200 dark:border-gray-700 pb-1">{t('arithmetic:factorization.concept.composite_numbers.title')}</h5>
                                        <p className="text-gray-700 dark:text-gray-300 mb-3">
                                            {t('arithmetic:factorization.concept.composite_numbers.description')}
                                        </p>
                                        <div className="bg-indigo-50 dark:bg-indigo-900/30 p-3 rounded-md">
                                            <p className="text-indigo-700 dark:text-indigo-300 font-medium mb-2">{t('arithmetic:factorization.concept.composite_numbers.examples_title')}:</p>
                                            <p className="text-sm text-indigo-600 dark:text-indigo-400">{t('arithmetic:factorization.concept.composite_numbers.examples')}</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex flex-col md:flex-row gap-4 mb-4">
                                        <div className="flex-1">
                                            <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2 border-b border-gray-200 dark:border-gray-700 pb-1">{t('arithmetic:factorization.concept.fundamental_theorem.title')}</h5>
                                            <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-md">
                                                <p className="text-indigo-700 dark:text-indigo-300 font-medium mb-2">
                                                    {t('arithmetic:factorization.concept.fundamental_theorem.statement')}
                                                </p>
                                                <p className="text-sm text-indigo-600 dark:text-indigo-400">
                                                    {t('arithmetic:factorization.concept.fundamental_theorem.importance')}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-4">
                                        <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2 border-b border-gray-200 dark:border-gray-700 pb-1">{t('arithmetic:factorization.concept.prime_factorization.title')}</h5>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <div className="p-3 bg-white dark:bg-gray-700 rounded-md border border-gray-100 dark:border-gray-600 shadow-sm">
                                                    <h6 className="text-indigo-700 dark:text-indigo-300 font-medium mb-2">{t('arithmetic:factorization.concept.prime_factorization.definition.title')}</h6>
                                                    <p className="text-gray-700 dark:text-gray-300 text-sm">
                                                        {t('arithmetic:factorization.concept.prime_factorization.definition.description')}
                                                    </p>
                                                </div>
                                                                </div>
                                        <div>
                                            <div className="p-3 bg-white dark:bg-gray-700 rounded-md border border-gray-100 dark:border-gray-600 shadow-sm">
                                                <h6 className="text-indigo-700 dark:text-indigo-300 font-medium mb-2">{t('arithmetic:factorization.concept.prime_factorization.algorithm.title')}</h6>
                                                <ol className="list-decimal list-inside text-gray-700 dark:text-gray-300 text-sm space-y-1">
                                                    <Trans
                                                        i18nKey="arithmetic:factorization.concept.prime_factorization.algorithm.steps"
                                                        components={{ li: <li /> }}
                                                    />
                                                </ol>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                <div className="mt-4">
                                    <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2 border-b border-gray-200 dark:border-gray-700 pb-1">{t('arithmetic:factorization.concept.applications.title')}</h5>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                                <div className="p-3 bg-white dark:bg-gray-700 rounded-md border border-gray-100 dark:border-gray-600 shadow-sm">
                                            <h6 className="text-indigo-700 dark:text-indigo-300 font-medium mb-1">{t('arithmetic:factorization.concept.applications.cryptography.title')}</h6>
                                            <p className="text-gray-700 dark:text-gray-300 text-xs">
                                                {t('arithmetic:factorization.concept.applications.cryptography.description')}
                                                            </p>
                                                        </div>
                                        <div className="p-3 bg-white dark:bg-gray-700 rounded-md border border-gray-100 dark:border-gray-600 shadow-sm">
                                            <h6 className="text-indigo-700 dark:text-indigo-300 font-medium mb-1">{t('arithmetic:factorization.concept.applications.fractions.title')}</h6>
                                            <p className="text-gray-700 dark:text-gray-300 text-xs">
                                                {t('arithmetic:factorization.concept.applications.fractions.description')}
                                                            </p>
                                                        </div>
                                        <div className="p-3 bg-white dark:bg-gray-700 rounded-md border border-gray-100 dark:border-gray-600 shadow-sm">
                                            <h6 className="text-indigo-700 dark:text-indigo-300 font-medium mb-1">{t('arithmetic:factorization.concept.applications.lcm_gcd.title')}</h6>
                                            <p className="text-gray-700 dark:text-gray-300 text-xs">
                                                {t('arithmetic:factorization.concept.applications.lcm_gcd.description')}
                                            </p>
                                        </div>
                                        </div>
                                    </div>
                                    
                                <div className="mt-4 bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-md border-l-4 border-yellow-400 dark:border-yellow-600">
                                    <h5 className="font-medium text-yellow-800 dark:text-yellow-300 mb-1">{t('arithmetic:factorization.concept.calculation_tip.title')}</h5>
                                    <p className="text-gray-700 dark:text-gray-300 text-sm">
                                        {t('arithmetic:factorization.concept.calculation_tip.description')}
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

export default ResolvedorFatorizacao;