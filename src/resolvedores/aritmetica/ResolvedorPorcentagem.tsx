import React from 'react';
import { HiCalculator, HiInformationCircle } from 'react-icons/hi';
import { getPercentageExamples } from '../../utils/mathUtilsTeoriaNumeros';
import { usePercentageSolver } from '../../hooks/aritmetica/usePorcentagemSolver';
import StepByStepExplanation from '../../components/StepByStepExplanation';
import ConceitoMatematico from '../../components/ConceitoMatematico';
import { useTranslation } from 'react-i18next';
import { Trans } from 'react-i18next';

const ResolvedorPorcentagem: React.FC = () => {
    const { t } = useTranslation(['arithmetic', 'translation']);
    const { state, dispatch, handleSolve, applyExample, setOperationType } = usePercentageSolver();

    // Filtra exemplos por tipo de operação
    const getFilteredExamples = () => {
        return getPercentageExamples().filter(example => example.type === state.operationType);
    };

    // Função que gera os passos com numeração dinâmica e estilização aprimorada
    const renderExplanationSteps = () => {
        // Ao invés de criar os passos manualmente, use os passos do estado 
        // com um fallback para gerar eles se estiverem vazios
        if (state.steps && state.steps.length > 0) {
            return state.steps;
        }
        
        let stepCount = 1;
        let steps: string[] = [];
        
        if (state.operationType === 'percentage') {
            const value = parseFloat(state.value.replace(',', '.'));
            const percentage = parseFloat(state.percentage.replace(',', '.'));
            const result = state.result || ((percentage / 100) * value);
            
            steps = [
                `${t('arithmetic:percentage.steps.original_equation', { percentage, value })}`,
                `${t('translation:common.step')} ${stepCount++}: ${t('arithmetic:percentage.steps.convert_percentage', { percentage, decimal: percentage / 100 })}`,
                `${t('translation:common.step')} ${stepCount++}: ${t('arithmetic:percentage.steps.multiply_value', { value, decimal: percentage / 100, result })}`,
                `${t('translation:common.result')}: ${t('arithmetic:percentage.steps.result', { percentage, value, result })}`,
                '---VERIFICATION_SEPARATOR---',
                `${t('translation:common.verification')}:`,
                `${t('arithmetic:percentage.steps.verification.calculating', { result, value })}:`,
                `${t('arithmetic:percentage.steps.verification.simplifying', { result, value, percentage: (result / value) * 100 })}`,
                `${t('arithmetic:percentage.steps.verification.completed', { calculated: (result / value) * 100, original: percentage })}`
            ];
        } 
        else if (state.operationType === 'percentageChange') {
            const value = parseFloat(state.value.replace(',', '.'));
            const initialValue = parseFloat(state.percentage.replace(',', '.'));
            const result = state.result || (((value - initialValue) / initialValue) * 100);
            
            steps = [
                `${t('arithmetic:percentage.steps.percentageChange.original_equation', { initialValue, value })}`,
                `${t('translation:common.step')} ${stepCount++}: ${t('arithmetic:percentage.steps.percentageChange.calculate_difference', { value, initialValue, difference: value - initialValue })}`,
                `${t('translation:common.step')} ${stepCount++}: ${t('arithmetic:percentage.steps.percentageChange.divide_difference', { value, initialValue, division: (value - initialValue) / initialValue })}`,
                `${t('translation:common.step')} ${stepCount++}: ${t('arithmetic:percentage.steps.percentageChange.multiply_100', { division: (value - initialValue) / initialValue, result })}`,
                
                result > 0 
                    ? `${t('translation:common.result')}: ${t('arithmetic:percentage.steps.percentageChange.result_increase', { result })}`
                    : result < 0 
                        ? `${t('translation:common.result')}: ${t('arithmetic:percentage.steps.percentageChange.result_decrease', { result: Math.abs(result) })}`
                        : `${t('translation:common.result')}: ${t('arithmetic:percentage.steps.percentageChange.result_no_change')}`,
                
                '---VERIFICATION_SEPARATOR---',
                `${t('translation:common.verification')}:`,
                `${t('arithmetic:percentage.steps.percentageChange.verification.calculating', { result, initialValue })}:`,
                `${t('arithmetic:percentage.steps.percentageChange.verification.simplifying', { initialValue, result, calculation: initialValue * (1 + result / 100) })}`,
                `${t('arithmetic:percentage.steps.percentageChange.verification.completed', { calculated: initialValue * (1 + result / 100), original: value, correct: Math.abs(initialValue * (1 + result / 100) - value) < 0.01 })}`
            ];
        }
        else { // reversePercentage
            const currentValue = parseFloat(state.value.replace(',', '.'));
            const percentageIncrease = parseFloat(state.percentage.replace(',', '.'));
            const result = state.result || (currentValue / (1 + percentageIncrease / 100));
            
            steps = [
                `${t('arithmetic:percentage.steps.reversePercentage.original_equation', { percentageIncrease })}`,
                `${t('translation:common.step')} ${stepCount++}: ${t('arithmetic:percentage.steps.reversePercentage.convert_percentage', { percentageIncrease, conversion: 1 + percentageIncrease / 100 })}`,
                `${t('translation:common.step')} ${stepCount++}: ${t('arithmetic:percentage.steps.reversePercentage.divide_value', { currentValue, divisor: 1 + percentageIncrease / 100, result })}`,
                `${t('translation:common.result')}: ${t('arithmetic:percentage.steps.reversePercentage.result', { percentageIncrease, result })}`,
                
                '---VERIFICATION_SEPARATOR---',
                `${t('translation:common.verification')}:`,
                `${t('arithmetic:percentage.steps.reversePercentage.verification.calculating', { percentageIncrease, result })}:`,
                `${t('arithmetic:percentage.steps.reversePercentage.verification.simplifying', { result, percentageIncrease, calculation: result * (1 + percentageIncrease / 100) })}`,
                `${t('arithmetic:percentage.steps.reversePercentage.verification.completed', { calculated: result * (1 + percentageIncrease / 100), original: currentValue, correct: Math.abs(result * (1 + percentageIncrease / 100) - currentValue) < 0.01 })}`
            ];
        }

        return steps;
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center mb-6">
                <HiCalculator className="h-6 w-6 text-indigo-600 dark:text-indigo-400 mr-2" />
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{t('translation:solvers.percentage')}</h2>
            </div>

            <div className="resolver-container p-6 mb-8">
                <p className='text-gray-700 dark:text-gray-300 mb-6'>
                    {t('arithmetic:percentage.description')}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {t('arithmetic:percentage.labels.value')}:
                        </label>
                        <input
                            type="number"
                            value={state.value}
                            onChange={(e) => dispatch({ type: 'SET_VALUE', value: e.target.value })}
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400"
                            placeholder={t('arithmetic:percentage.placeholders.value')}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {t('arithmetic:percentage.labels.percentage')}
                        </label>
                        <input
                            type="number"
                            value={state.percentage}
                            onChange={(e) => dispatch({ type: 'SET_PERCENTAGE', value: e.target.value })}
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400"
                            placeholder={t('arithmetic:percentage.placeholders.percentage')}
                        />
                    </div>
                </div>

                <div className="mb-6">
                    <p className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('arithmetic:percentage.labels.calculation_type')}:</p>
                    <div className="flex flex-wrap gap-4">
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                checked={state.operationType === 'percentage'}
                                onChange={() => setOperationType('percentage')}
                                className="form-radio text-indigo-600 dark:text-indigo-400"
                            />
                            <span className="ml-2 text-gray-700 dark:text-gray-300">{t('arithmetic:percentage.operation_types.percentage')}</span>
                        </label>
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                checked={state.operationType === 'percentageChange'}
                                onChange={() => setOperationType('percentageChange')}
                                className="form-radio text-indigo-600 dark:text-indigo-400"
                            />
                            <span className="ml-2 text-gray-700 dark:text-gray-300">{t('arithmetic:percentage.operation_types.percentage_change')}</span>
                        </label>
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                checked={state.operationType === 'reversePercentage'}
                                onChange={() => setOperationType('reversePercentage')}
                                className="form-radio text-indigo-600 dark:text-indigo-400"
                            />
                            <span className="ml-2 text-gray-700 dark:text-gray-300">{t('arithmetic:percentage.operation_types.reverse_percentage')}</span>
                        </label>
                    </div>
                </div>

                {/* Exemplos de porcentagem */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t('translation:common.examples')}
                    </label>
                    <div className="flex flex-wrap gap-2">
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
                    className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-medium py-2 px-6 rounded-md transition-colors duration-300 mt-4"
                >
                    {t('translation:common.calculate')}
                </button>

                {state.errorMessage && (
                    <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 rounded-md">
                        {state.errorMessage}
                    </div>
                )}
            </div>

            {state.result !== null && (
                <div className="space-y-6">
                    <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-5">
                        <h3 className="text-lg font-medium text-green-800 dark:text-green-300 mb-2">{t('translation:common.result')}</h3>
                        <p className="text-xl text-gray-800 dark:text-gray-200">
                            {state.operationType === 'percentage' && (
                                <Trans
                                  i18nKey="arithmetic:percentage.results.percentage"
                                  values={{ percentage: state.percentage, value: state.value, result: state.result }}
                                  components={{ span: <span className="font-bold" /> }}
                                />
                            )}
                            {state.operationType === 'percentageChange' && (
                                <Trans
                                  i18nKey="arithmetic:percentage.results.percentage_change"
                                  values={{ value: state.value, initialValue: state.percentage, result: state.result }}
                                  components={{ span: <span className="font-bold" /> }}
                                />
                            )}
                            {state.operationType === 'reversePercentage' && (
                                <Trans
                                  i18nKey="arithmetic:percentage.results.reverse_percentage"
                                  values={{ value: state.value, percentage: state.percentage, result: state.result }}
                                  components={{ span: <span className="font-bold" /> }}
                                />
                            )}
                        </p>
                        
                        <button 
                            onClick={() => dispatch({ type: 'TOGGLE_EXPLANATION' })}
                            className="mt-4 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 text-sm font-medium flex items-center"
                        >
                            <HiInformationCircle className="h-5 w-5 mr-1" />
                            {state.showExplanation ? t('arithmetic:percentage.hide_explanation') : t('arithmetic:percentage.show_explanation')}
                        </button>
                    </div>

                    {state.showExplanation && (
                        <div className="mt-8 resolver-explanation-container">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 flex items-center">
                                    <HiCalculator className="h-6 w-6 mr-2 text-indigo-600 dark:text-indigo-400" />
                                    {t('arithmetic:percentage.step_by_step')}
                                </h3>
                            </div>
                            
                            <StepByStepExplanation steps={renderExplanationSteps()} stepType="linear" />
                            
                            <ConceitoMatematico
                                title={t('arithmetic:percentage.mathematical_concept')}
                                isOpen={state.showConceitoMatematico}
                                onToggle={() => dispatch({ type: 'TOGGLE_CONCEITO_MATEMATICO' })}
                            >
                                <div className="flex flex-col md:flex-row gap-4 mb-4">
                                    <div className="flex-1">
                                        <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2 border-b border-gray-200 dark:border-gray-700 pb-1">
                                            {state.operationType === 'percentage' && t('arithmetic:percentage.concepts.basic.title')}
                                            {state.operationType === 'percentageChange' && t('arithmetic:percentage.concepts.percentage_change.title')}
                                            {state.operationType === 'reversePercentage' && t('arithmetic:percentage.concepts.reverse_percentage.title')}
                                        </h5>
                                        
                                        {state.operationType === 'percentage' && (
                                            <div className="space-y-3">
                                                <Trans
                                                    i18nKey="arithmetic:percentage.concepts.basic.description"
                                                    values={{ percentage: state.percentage }}
                                                    components={{ span: <span className="font-medium" /> }}
                                                >
                                                    <p className="text-gray-700 dark:text-gray-300"></p>
                                                </Trans>
                                                <div className="bg-white dark:bg-gray-700 p-3 rounded-md border border-gray-100 dark:border-gray-600 shadow-sm">
                                                    <h6 className="text-indigo-700 dark:text-indigo-300 font-medium mb-2">{t('arithmetic:percentage.concepts.basic.formula_title')}</h6>
                                                    <div className="text-center font-medium text-indigo-700 dark:text-indigo-300">
                                                        <p>{t('arithmetic:percentage.concepts.basic.formula')}</p>
                                                    </div>
                                                </div>
                                                <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-md">
                                                    <p className="text-sm text-indigo-700 dark:text-indigo-300">
                                                        <span className="font-medium">{t('translation:common.example')}:</span>{' '}
                                                        <Trans
                                                            i18nKey="arithmetic:percentage.concepts.basic.example"
                                                            components={{ br: <br /> }}
                                                        />
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                        
                                        {state.operationType === 'percentageChange' && (
                                            <div className="space-y-3">
                                                <p className="text-gray-700 dark:text-gray-300">
                                                    {t('arithmetic:percentage.concepts.percentage_change.description')}
                                                </p>
                                                <div className="bg-white dark:bg-gray-700 p-3 rounded-md border border-gray-100 dark:border-gray-600 shadow-sm">
                                                    <h6 className="text-indigo-700 dark:text-indigo-300 font-medium mb-2">{t('arithmetic:percentage.concepts.percentage_change.formula_title')}</h6>
                                                    <div className="text-center font-medium text-indigo-700 dark:text-indigo-300">
                                                        <p>{t('arithmetic:percentage.concepts.percentage_change.formula')}</p>
                                                    </div>
                                                </div>
                                                <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-md">
                                                    <p className="text-sm text-indigo-700 dark:text-indigo-300">
                                                        <span className="font-medium">{t('translation:common.example')}:</span>{' '}
                                                        <Trans
                                                            i18nKey="arithmetic:percentage.concepts.percentage_change.example"
                                                            components={{ br: <br /> }}
                                                        />
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                        
                                        {state.operationType === 'reversePercentage' && (
                                            <div className="space-y-3">
                                                <p className="text-gray-700 dark:text-gray-300">
                                                    {t('arithmetic:percentage.concepts.reverse_percentage.description')}
                                                </p>
                                                <div className="bg-white dark:bg-gray-700 p-3 rounded-md border border-gray-100 dark:border-gray-600 shadow-sm">
                                                    <h6 className="text-indigo-700 dark:text-indigo-300 font-medium mb-2">{t('arithmetic:percentage.concepts.reverse_percentage.formula_title')}</h6>
                                                    <div className="text-center font-medium text-indigo-700 dark:text-indigo-300">
                                                        <p>{t('arithmetic:percentage.concepts.reverse_percentage.formula')}</p>
                                                    </div>
                                                </div>
                                                <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-md">
                                                    <p className="text-sm text-indigo-700 dark:text-indigo-300">
                                                        <span className="font-medium">{t('translation:common.example')}:</span>{' '}
                                                        <Trans
                                                            i18nKey="arithmetic:percentage.concepts.reverse_percentage.example"
                                                            components={{ br: <br /> }}
                                                        />
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="flex-1">
                                        <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2 border-b border-gray-200 dark:border-gray-700 pb-1">{t('arithmetic:percentage.concepts.applications.title')}</h5>
                                        <div className="p-3 bg-white dark:bg-gray-700 rounded-md border border-gray-100 dark:border-gray-600 shadow-sm">
                                            <h6 className="text-indigo-700 dark:text-indigo-300 font-medium mb-2">{t('arithmetic:percentage.concepts.applications.contexts_title')}</h6>
                                            <ul className="text-sm space-y-2 list-disc pl-4 text-gray-700 dark:text-gray-300">
                                                <li><span className="font-medium">{t('arithmetic:percentage.concepts.applications.contexts.commerce.title')}:</span> {t('arithmetic:percentage.concepts.applications.contexts.commerce.description')}</li>
                                                <li><span className="font-medium">{t('arithmetic:percentage.concepts.applications.contexts.finance.title')}:</span> {t('arithmetic:percentage.concepts.applications.contexts.finance.description')}</li>
                                                <li><span className="font-medium">{t('arithmetic:percentage.concepts.applications.contexts.statistics.title')}:</span> {t('arithmetic:percentage.concepts.applications.contexts.statistics.description')}</li>
                                                <li><span className="font-medium">{t('arithmetic:percentage.concepts.applications.contexts.science.title')}:</span> {t('arithmetic:percentage.concepts.applications.contexts.science.description')}</li>
                                                <li><span className="font-medium">{t('arithmetic:percentage.concepts.applications.contexts.daily.title')}:</span> {t('arithmetic:percentage.concepts.applications.contexts.daily.description')}</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="mt-4 flex flex-col md:flex-row gap-4">
                                    <div className="bg-white dark:bg-gray-700 p-3 rounded-md border border-gray-100 dark:border-gray-600 shadow-sm md:w-1/2">
                                        <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2">{t('arithmetic:percentage.concepts.useful_conversions.title')}</h5>
                                        <div className="space-y-2">
                                            <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-md flex items-center">
                                                <div className="mr-2 w-16 text-center flex-shrink-0">
                                                    <span className="font-mono text-indigo-700 dark:text-indigo-300">10%</span>
                                                </div>
                                                <span className="text-sm text-gray-700 dark:text-gray-300">= {t('arithmetic:percentage.concepts.useful_conversions.divide_by_10')}</span>
                                            </div>
                                            <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-md flex items-center">
                                                <div className="mr-2 w-16 text-center flex-shrink-0">
                                                    <span className="font-mono text-indigo-700 dark:text-indigo-300">25%</span>
                                                </div>
                                                <span className="text-sm text-gray-700 dark:text-gray-300">= {t('arithmetic:percentage.concepts.useful_conversions.divide_by_4')}</span>
                                            </div>
                                            <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-md flex items-center">
                                                <div className="mr-2 w-16 text-center flex-shrink-0">
                                                    <span className="font-mono text-indigo-700 dark:text-indigo-300">50%</span>
                                                </div>
                                                <span className="text-sm text-gray-700 dark:text-gray-300">= {t('arithmetic:percentage.concepts.useful_conversions.divide_by_2')}</span>
                                            </div>
                                            <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-md flex items-center">
                                                <div className="mr-2 w-16 text-center flex-shrink-0">
                                                    <span className="font-mono text-indigo-700 dark:text-indigo-300">100%</span>
                                                </div>
                                                <span className="text-sm text-gray-700 dark:text-gray-300">= {t('arithmetic:percentage.concepts.useful_conversions.original_value')}</span>
                                            </div>
                                            <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-md flex items-center">
                                                <div className="mr-2 w-16 text-center flex-shrink-0">
                                                    <span className="font-mono text-indigo-700 dark:text-indigo-300">200%</span>
                                                </div>
                                                <span className="text-sm text-gray-700 dark:text-gray-300">= {t('arithmetic:percentage.concepts.useful_conversions.multiply_by_2')}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-md border-l-4 border-yellow-400 dark:border-yellow-600 md:w-1/2 self-start">
                                        <h5 className="font-medium text-yellow-800 dark:text-yellow-300 mb-2">{t('arithmetic:percentage.concepts.calculation_tips.title')}</h5>
                                        <ul className="text-sm space-y-2 list-disc pl-4 text-gray-700 dark:text-gray-300">
                                            <li>{t('arithmetic:percentage.concepts.calculation_tips.decompose')}</li>
                                            <li>
                                                <Trans
                                                    i18nKey="arithmetic:percentage.concepts.calculation_tips.increase_decrease"
                                                    components={{ strong: <strong /> }}
                                                />
                                            </li>
                                            <li>{t('arithmetic:percentage.concepts.calculation_tips.fraction_to_percentage')}</li>
                                            <li>{t('arithmetic:percentage.concepts.calculation_tips.decimal_to_percentage')}</li>
                                        </ul>
                                    </div>
                                </div>
                                
                                <div className="mt-4 p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-md border border-indigo-100 dark:border-indigo-800">
                                    <h5 className="font-medium text-indigo-800 dark:text-indigo-300 mb-1 flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                        </svg>
                                        {t('arithmetic:percentage.concepts.fun_fact.title')}
                                    </h5>
                                    <p className="text-sm text-indigo-700 dark:text-indigo-300">
                                        {t('arithmetic:percentage.concepts.fun_fact.description')}
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

export default ResolvedorPorcentagem;