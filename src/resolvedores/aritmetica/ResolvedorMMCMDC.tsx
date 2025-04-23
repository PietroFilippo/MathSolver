import React from 'react';
import { HiCalculator, HiInformationCircle } from 'react-icons/hi';
import { getMMCMDCExamples } from '../../utils/mathUtilsTeoriaNumeros';
import { useGcdLcmSolver } from '../../hooks/aritmetica/useMMCMDCSolver';
import StepByStepExplanation from '../../components/StepByStepExplanation';
import ConceitoMatematico from '../../components/ConceitoMatematico';
import { useTranslation } from 'react-i18next';
import { Trans } from 'react-i18next';

const ResolvedorMMCMDC: React.FC = () => {
    const { t } = useTranslation(['arithmetic', 'translation']);
    const { state, dispatch, handleSolve, applyExample, setCalculationType } = useGcdLcmSolver();
    
    // Set default calculation type to MMC when component mounts
    React.useEffect(() => {
        setCalculationType('mmc');
    }, []);

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center mb-6">
                <HiCalculator className="h-6 w-6 text-indigo-600 dark:text-indigo-400 mr-2" />
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{t('arithmetic:gcd_lcm.title')}</h2>
            </div>

            <div className="resolver-container p-6 mb-8">
                <p className="text-gray-700 dark:text-gray-300 mb-6">
                    {t('arithmetic:gcd_lcm.description')}
                </p>
                
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('arithmetic:gcd_lcm.input_label')}:
                    </label>
                    <input
                        type="text"
                        value={state.inputNumbers}
                        onChange={(e) => dispatch({ type: 'SET_INPUT_NUMBERS', value: e.target.value })}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400"
                        placeholder={t('arithmetic:gcd_lcm.input_placeholder')}
                    />
                </div>

                <div className="mb-6">
                    <p className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('arithmetic:gcd_lcm.calculation_type')}:</p>
                    <div className="flex flex-wrap gap-4">
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                checked={state.calculationType === 'mmc'}
                                onChange={() => setCalculationType('mmc')}
                                className="form-radio text-indigo-600 dark:text-indigo-400"
                            />
                            <span className="ml-2 text-gray-700 dark:text-gray-300">{t('arithmetic:gcd_lcm.types.lcm')}</span>
                        </label>
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                checked={state.calculationType === 'mdc'}
                                onChange={() => setCalculationType('mdc')}
                                className="form-radio text-indigo-600 dark:text-indigo-400"
                            />
                            <span className="ml-2 text-gray-700 dark:text-gray-300">{t('arithmetic:gcd_lcm.types.gcd')}</span>
                        </label>
                    </div>
                </div>

                {/* Exemplos de cálculos */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('translation:common.examples')}
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {getMMCMDCExamples().filter(ex => ex.type === (state.calculationType === 'mmc' ? 'lcm' : 'gcd')).map((example, index) => (
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
                    {t('translation:common.calculate')}
                </button>
                
                {state.errorMessage && (
                    <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 rounded-md">
                        {state.errorMessage}
                    </div>
                )}
            </div>

            {state.result && (
                <div className="space-y-6">
                    <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-5">
                        <h3 className="text-lg font-medium text-green-800 dark:text-green-300 mb-2">{t('translation:common.result')}</h3>
                        <p className="text-xl text-gray-800 dark:text-gray-200">
                            <Trans
                                i18nKey={`arithmetic:gcd_lcm.result_text.${state.calculationType === 'mmc' ? 'lcm' : 'gcd'}`}
                                values={{ numbers: state.inputNumbers, result: state.result }}
                                components={{ span: <span className="font-bold" /> }}
                            />
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
                        <div className="mt-8 bg-white dark:bg-gray-800 shadow-md rounded-lg p-5">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center">
                                    <HiCalculator className="h-6 w-6 mr-2 text-indigo-600 dark:text-indigo-400" />
                                    {state.calculationType === 'mmc' 
                                        ? t('arithmetic:gcd_lcm.step_by_step.lcm') 
                                        : t('arithmetic:gcd_lcm.step_by_step.gcd')}
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
                                        <h5 className="font-medium text-gray-800 dark:text-gray-100 mb-2 border-b border-gray-200 dark:border-gray-700 pb-1">
                                            {state.calculationType === 'mmc' 
                                                ? t('arithmetic:gcd_lcm.concept.lcm.title') 
                                                : t('arithmetic:gcd_lcm.concept.gcd.title')}
                                        </h5>
                                        <p className="text-gray-700 dark:text-gray-300 mb-3">
                                            {state.calculationType === 'mmc' 
                                                ? t('arithmetic:gcd_lcm.concept.lcm.description')
                                                : t('arithmetic:gcd_lcm.concept.gcd.description')}
                                        </p>
                                        <div className="bg-white dark:bg-gray-700 p-3 rounded-md border border-gray-100 dark:border-gray-600 shadow-sm mb-3">
                                            <div className="text-sm text-gray-700 dark:text-gray-300">
                                                <h6 className="font-medium text-indigo-700 dark:text-indigo-400 mb-1">{t('translation:common.example')}:</h6>
                                                {state.calculationType === 'mmc' ? (
                                                    <div className="space-y-1">
                                                        <Trans i18nKey="arithmetic:gcd_lcm.concept.lcm.example1" components={{ p: <p /> }} />
                                                        <Trans i18nKey="arithmetic:gcd_lcm.concept.lcm.example2" components={{ p: <p /> }} />
                                                        <Trans i18nKey="arithmetic:gcd_lcm.concept.lcm.example3" components={{ p: <p /> }} />
                                                        <Trans i18nKey="arithmetic:gcd_lcm.concept.lcm.example4" components={{ p: <p /> }} />
                                                    </div>
                                                ) : (
                                                    <div className="space-y-1">
                                                        <Trans i18nKey="arithmetic:gcd_lcm.concept.gcd.example1" components={{ p: <p /> }} />
                                                        <Trans i18nKey="arithmetic:gcd_lcm.concept.gcd.example2" components={{ p: <p /> }} />
                                                        <Trans i18nKey="arithmetic:gcd_lcm.concept.gcd.example3" components={{ p: <p /> }} />
                                                        <Trans i18nKey="arithmetic:gcd_lcm.concept.gcd.example4" components={{ p: <p /> }} />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex-1">
                                        <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2 border-b border-gray-200 dark:border-gray-700 pb-1">{t('arithmetic:gcd_lcm.concept.relation.title')}</h5>
                                        <div className="p-3 bg-white dark:bg-gray-700 rounded-md border border-gray-100 dark:border-gray-600 shadow-sm mb-3">
                                            <p className="text-gray-700 dark:text-gray-300 mb-2">
                                                {t('arithmetic:gcd_lcm.concept.relation.description')}
                                            </p>
                                            <div className="bg-indigo-50 dark:bg-indigo-900/30 p-3 rounded-md text-center">
                                                <p className="text-lg font-medium text-indigo-700 dark:text-indigo-300">
                                                    {t('arithmetic:gcd_lcm.concept.relation.formula')}
                                                </p>
                                            </div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                                                {t('arithmetic:gcd_lcm.concept.relation.note')}
                                            </p>
                                        </div>
                                        
                                        <div className="p-3 bg-white dark:bg-gray-700 rounded-md border border-gray-100 dark:border-gray-600 shadow-sm">
                                            <h6 className="text-indigo-700 dark:text-indigo-300 font-medium mb-2">{t('translation:common.examples')}</h6>
                                            <div className="space-y-2 text-sm">
                                                <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded-md">
                                                    <p className="font-medium text-gray-700 dark:text-gray-300">{t('arithmetic:gcd_lcm.concept.relation.example1.title')}:</p>
                                                    <p className="text-gray-700 dark:text-gray-300">{t('arithmetic:gcd_lcm.concept.relation.example1.gcd')}</p>
                                                    <p className="text-gray-700 dark:text-gray-300">{t('arithmetic:gcd_lcm.concept.relation.example1.lcm')}</p>
                                                    <p className="text-indigo-600 dark:text-indigo-400">{t('arithmetic:gcd_lcm.concept.relation.example1.verification')}</p>
                                                </div>
                                                <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded-md">
                                                    <p className="font-medium text-gray-700 dark:text-gray-300">{t('arithmetic:gcd_lcm.concept.relation.example2.title')}:</p>
                                                    <p className="text-gray-700 dark:text-gray-300">{t('arithmetic:gcd_lcm.concept.relation.example2.gcd')}</p>
                                                    <p className="text-gray-700 dark:text-gray-300">{t('arithmetic:gcd_lcm.concept.relation.example2.lcm')}</p>
                                                    <p className="text-indigo-600 dark:text-indigo-400">{t('arithmetic:gcd_lcm.concept.relation.example2.verification')}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="mt-4">
                                    <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2 border-b border-gray-200 dark:border-gray-700 pb-1">{t('arithmetic:gcd_lcm.concept.methods.title')}</h5>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <div className="p-3 bg-white dark:bg-gray-700 rounded-md border border-gray-100 dark:border-gray-600 shadow-sm h-full">
                                                <h6 className="text-indigo-700 dark:text-indigo-300 font-medium mb-2">{t('arithmetic:gcd_lcm.concept.methods.prime_factorization.title')}</h6>
                                                <ol className="text-sm space-y-2 list-decimal pl-5 text-gray-700 dark:text-gray-300">
                                                    <li>{t('arithmetic:gcd_lcm.concept.methods.prime_factorization.step1')}</li>
                                                    <li>
                                                    {state.calculationType === 'mmc' ? (
                                                            <Trans i18nKey="arithmetic:gcd_lcm.concept.methods.prime_factorization.lcm_step2" components={{ strong: <strong /> }} />
                                                        ) : (
                                                            <Trans i18nKey="arithmetic:gcd_lcm.concept.methods.prime_factorization.gcd_step2" components={{ strong: <strong /> }} />
                                                        )}
                                                    </li>
                                                </ol>
                                                <div className="mt-2 bg-gray-50 dark:bg-gray-800 p-2 rounded-md">
                                                    <p className="text-xs text-gray-600 dark:text-gray-400">{t('arithmetic:gcd_lcm.concept.methods.prime_factorization.example.intro')}</p>
                                                    {state.calculationType === 'mmc' ? (
                                                        <p className="text-xs text-gray-600 dark:text-gray-400">{t('arithmetic:gcd_lcm.concept.methods.prime_factorization.example.lcm')}</p>
                                                    ) : (
                                                        <p className="text-xs text-gray-600 dark:text-gray-400">{t('arithmetic:gcd_lcm.concept.methods.prime_factorization.example.gcd')}</p>
                                                    )}
                                                </div>
                                                
                                                <div className="mt-3 bg-blue-50 dark:bg-blue-900/30 p-2 rounded-md">
                                                    <p className="text-xs text-blue-700 dark:text-blue-300">
                                                        <strong>{t('translation:common.tip')}:</strong> {t('arithmetic:gcd_lcm.concept.methods.prime_factorization.tip')}
                                                    </p>
                                                </div>
                                                
                                                {state.calculationType === 'mdc' && (
                                                    <div className="mt-3 bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded-md">
                                                        <p className="text-xs font-medium text-yellow-800 dark:text-yellow-300">
                                                            {t('arithmetic:gcd_lcm.concept.methods.prime_factorization.coprime_note')}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <div className="p-3 bg-white dark:bg-gray-700 rounded-md border border-gray-100 dark:border-gray-600 shadow-sm h-full">
                                                {state.calculationType === 'mdc' ? (
                                                    <>
                                                        <h6 className="text-indigo-700 dark:text-indigo-300 font-medium mb-2">{t('arithmetic:gcd_lcm.concept.methods.euclidean.title')}</h6>
                                                        <ol className="text-sm space-y-2 list-decimal pl-5 text-gray-700 dark:text-gray-300">
                                                            <li>{t('arithmetic:gcd_lcm.concept.methods.euclidean.step1')}</li>
                                                            <li>{t('arithmetic:gcd_lcm.concept.methods.euclidean.step2')}</li>
                                                            <li>{t('arithmetic:gcd_lcm.concept.methods.euclidean.step3')}</li>
                                                        </ol>
                                                        <div className="mt-2 bg-gray-50 dark:bg-gray-800 p-2 rounded-md">
                                                            <p className="text-xs text-gray-600 dark:text-gray-400">{t('arithmetic:gcd_lcm.concept.methods.euclidean.example.title')}</p>
                                                            <div className="text-xs text-gray-600 dark:text-gray-400">
                                                                <p>{t('arithmetic:gcd_lcm.concept.methods.euclidean.example.step1')}</p>
                                                                <p>{t('arithmetic:gcd_lcm.concept.methods.euclidean.example.step2')}</p>
                                                                <p>{t('arithmetic:gcd_lcm.concept.methods.euclidean.example.step3')}</p>
                                                                <p>{t('arithmetic:gcd_lcm.concept.methods.euclidean.example.conclusion')}</p>
                                                            </div>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <>
                                                        <h6 className="text-indigo-700 dark:text-indigo-300 font-medium mb-2">{t('arithmetic:gcd_lcm.concept.methods.multiples.title')}</h6>
                                                        <ol className="text-sm space-y-2 list-decimal pl-5 text-gray-700 dark:text-gray-300">
                                                            <li>{t('arithmetic:gcd_lcm.concept.methods.multiples.step1')}</li>
                                                            <li>{t('arithmetic:gcd_lcm.concept.methods.multiples.step2')}</li>
                                                        </ol>
                                                        <div className="mt-2 bg-gray-50 dark:bg-gray-800 p-2 rounded-md">
                                                            <p className="text-xs text-gray-600 dark:text-gray-400">{t('arithmetic:gcd_lcm.concept.methods.multiples.example.title')}</p>
                                                            <div className="text-xs text-gray-600 dark:text-gray-400">
                                                                <p>{t('arithmetic:gcd_lcm.concept.methods.multiples.example.multiples1')}</p>
                                                                <p>{t('arithmetic:gcd_lcm.concept.methods.multiples.example.multiples2')}</p>
                                                                <p>{t('arithmetic:gcd_lcm.concept.methods.multiples.example.conclusion')}</p>
                                                            </div>
                                                        </div>
                                                        <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-900/30 rounded-md">
                                                            <p className="text-xs text-blue-700 dark:text-blue-300">
                                                                <strong>{t('translation:common.tip')}:</strong> {t('arithmetic:gcd_lcm.concept.methods.multiples.tip')}
                                                            </p>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="mt-4 bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-md border-l-4 border-yellow-400 dark:border-yellow-600">
                                    <h5 className="font-medium text-yellow-800 dark:text-yellow-300 mb-1">{t('arithmetic:gcd_lcm.concept.solution_tip.title')}</h5>
                                    <p className="text-gray-700 dark:text-gray-300 text-sm">
                                        {state.calculationType === 'mmc' ? (
                                            t('arithmetic:gcd_lcm.concept.solution_tip.lcm')
                                        ) : (
                                            t('arithmetic:gcd_lcm.concept.solution_tip.gcd')
                                        )}
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

export default ResolvedorMMCMDC;