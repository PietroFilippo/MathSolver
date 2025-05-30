import React from 'react';
import { HiCalculator, HiInformationCircle } from 'react-icons/hi';
import { FractionDisplay } from '../../utils/mathUtilsFracoes';
import { useFractionAddSubSolver } from '../../hooks/fracoes/useFracaoAddSubSolver';
import StepByStepExplanation from '../../components/StepByStepExplanation';
import ConceitoMatematico from '../../components/ConceitoMatematico';
import { useTranslation } from 'react-i18next';

const ResolvedorAddSubFracao: React.FC = () => {
    const { 
        state, 
        dispatch, 
        handleSolve, 
        applyExample, 
        getFilteredExamples 
    } = useFractionAddSubSolver();
    const { t } = useTranslation(['fractions', 'translation']);

    // Detalhes do MMC
    const MMCDetails = () => {
        console.log('Rendering MMCDetails with mmcSteps:', state.mmcSteps);
        if (!state.mmcSteps.den1 || !state.mmcSteps.den2) {
            console.log('MMCDetails: Invalid denominator values, returning null');
            return null;
        }
        
        const { den1, den2, mmc: resultado } = state.mmcSteps;
        
        // Decomposição em fatores primos
        const decomposeInPrimeFactors = (num: number): number[] => {
            const factors: number[] = [];
            let n = num;
            let divisor = 2;
            
            while (n > 1) {
                while (n % divisor === 0) {
                    factors.push(divisor);
                    n = n / divisor;
                }
                divisor++;
            }
            
            return factors;
        };
        
        // Obter os fatores primos
        const factors1 = decomposeInPrimeFactors(den1);
        const factors2 = decomposeInPrimeFactors(den2);
        
        // Função para gerar os passos da decomposição
        const generateDecompositionSteps = (num: number): { divisor: number, quotient: number, result: number }[] => {
            const steps: { divisor: number, quotient: number, result: number }[] = [];
            let n = num;
            let divisor = 2;
            
            while (n > 1) {
                while (n % divisor === 0) {
                    steps.push({ divisor, quotient: Math.floor(n / divisor), result: n });
                    n = n / divisor;
                }
                divisor++;
            }
            
            return steps;
        };
        
        const decompositionSteps1 = generateDecompositionSteps(den1);
        const decompositionSteps2 = generateDecompositionSteps(den2);
        
        // Calcular MMC pelo método de fatoração
        const calculateMMCByFactorization = (a: number, b: number): number[] => {
            const factorsA = decomposeInPrimeFactors(a);
            const factorsB = decomposeInPrimeFactors(b);
            
            // Criar um mapa de fatores com suas potências máximas
            const factorMap = new Map<number, number>();
            
            // Contar ocorrências em factorsA
            factorsA.forEach(factor => {
                const count = factorMap.get(factor) || 0;
                factorMap.set(factor, count + 1);
            });
            
            // Contar ocorrências em factorsB e atualizar se necessário
            const factorMapB = new Map<number, number>();
            factorsB.forEach(factor => {
                const count = factorMapB.get(factor) || 0;
                factorMapB.set(factor, count + 1);
            });
            
            // Garantir que temos a potência máxima de cada fator
            factorMapB.forEach((count, factor) => {
                const countA = factorMap.get(factor) || 0;
                if (count > countA) {
                    factorMap.set(factor, count);
                }
            });
            
            // Converter o mapa de volta para um array de fatores
            const resultFactors: number[] = [];
            factorMap.forEach((count, factor) => {
                for (let i = 0; i < count; i++) {
                    resultFactors.push(factor);
                }
            });
            
            resultFactors.sort((a, b) => a - b);
            return resultFactors;
        };
        
        const mmcFactors = calculateMMCByFactorization(den1, den2);
        
        // Passos do algoritmo de Euclides para calcular o MDC
        const gcdSteps = (a: number, b: number): { a: number, b: number, remainder: number }[] => {
            const steps: { a: number, b: number, remainder: number }[] = [];
            
            let x = Math.max(a, b);
            let y = Math.min(a, b);
            
            while (y !== 0) {
                const remainder = x % y;
                steps.push({ a: x, b: y, remainder });
                x = y;
                y = remainder;
            }
            
            return steps;
        };
        
        // MDC passos
        const mdcSteps = gcdSteps(den1, den2);
        const mdcValue = mdcSteps.length > 0 ? mdcSteps[mdcSteps.length - 2].b : 1;

        return (
            <div className="resolver-container p-6 mb-8">
                <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-3">
                    {t('fractions:addition_subtraction.lcm_details.title', { den1, den2 })}
                </h4>
                
                <div className="space-y-4">
                    <div>
                        <p className="text-gray-700 dark:text-gray-300 font-medium mb-2">
                            {t('fractions:addition_subtraction.lcm_details.method1_title')}
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                            <div className="space-y-2">
                                <p className="text-gray-700 dark:text-gray-300 font-medium">
                                    {t('fractions:addition_subtraction.lcm_details.decomposition', { number: den1 })}
                                </p>
                                
                                {decompositionSteps1.length > 0 ? (
                                    <div className="space-y-1">
                                        {decompositionSteps1.map((step, index) => (
                                            <div key={index} className="flex items-center">
                                                <div className="w-10 text-center text-gray-700 dark:text-gray-300">{step.divisor}</div>
                                                <div className="w-6 text-center text-gray-700 dark:text-gray-300">|</div>
                                                <div className="text-gray-700 dark:text-gray-300">{step.result}</div>
                                            </div>
                                        ))}
                                        <div className="text-gray-700 dark:text-gray-300 mt-1">
                                            {t('fractions:addition_subtraction.lcm_details.therefore', { 
                                                number: den1, 
                                                factors: factors1.join(' × ') || den1 
                                            })}
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-gray-700 dark:text-gray-300">
                                        {t('fractions:addition_subtraction.lcm_details.prime_number', { number: den1 })}
                                    </p>
                                )}
                            </div>
                            
                            <div className="space-y-2">
                                <p className="text-gray-700 dark:text-gray-300 font-medium">
                                    {t('fractions:addition_subtraction.lcm_details.decomposition', { number: den2 })}
                                </p>
                                
                                {decompositionSteps2.length > 0 ? (
                                    <div className="space-y-1">
                                        {decompositionSteps2.map((step, index) => (
                                            <div key={index} className="flex items-center">
                                                <div className="w-10 text-center text-gray-700 dark:text-gray-300">{step.divisor}</div>
                                                <div className="w-6 text-center text-gray-700 dark:text-gray-300">|</div>
                                                <div className="text-gray-700 dark:text-gray-300">{step.result}</div>
                                            </div>
                                        ))}
                                        <div className="text-gray-700 dark:text-gray-300 mt-1">
                                            {t('fractions:addition_subtraction.lcm_details.therefore', { 
                                                number: den2, 
                                                factors: factors2.join(' × ') || den2 
                                            })}
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-gray-700 dark:text-gray-300">
                                        {t('fractions:addition_subtraction.lcm_details.prime_number', { number: den2 })}
                                    </p>
                                )}
                            </div>
                        </div>
                        
                        <div className="mt-3 bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                            <p className="text-gray-700 dark:text-gray-300 font-medium">
                                {t('fractions:addition_subtraction.lcm_details.find_lcm_prime')}
                            </p>
                            <p className="text-gray-700 dark:text-gray-300 mt-1">
                                {t('fractions:addition_subtraction.lcm_details.step1_prime')}
                            </p>
                            <p className="text-gray-700 dark:text-gray-300">
                                {t('fractions:addition_subtraction.lcm_details.step2_prime')}
                            </p>
                            
                            <div className="mt-2">
                                <p className="text-gray-700 dark:text-gray-300">
                                    {t('fractions:addition_subtraction.lcm_details.factors_of', { 
                                        number: den1, 
                                        factors: factors1.join(' × ') || den1 
                                    })}
                                </p>
                                <p className="text-gray-700 dark:text-gray-300">
                                    {t('fractions:addition_subtraction.lcm_details.factors_of', { 
                                        number: den2, 
                                        factors: factors2.join(' × ') || den2 
                                    })}
                                </p>
                                <p className="text-gray-700 dark:text-gray-300 font-medium mt-1">
                                    {t('fractions:addition_subtraction.lcm_details.lcm_formula', { 
                                        factors: mmcFactors.join(' × '), 
                                        result: resultado 
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="mt-4">
                        <p className="text-gray-700 dark:text-gray-300 font-medium mb-2">
                            {t('fractions:addition_subtraction.lcm_details.method2_title')}
                        </p>
                        
                        <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                            <p className="text-gray-700 dark:text-gray-300">
                                {t('fractions:addition_subtraction.lcm_details.gcd_lcm_relation')}
                            </p>
                            <p className="text-gray-700 dark:text-gray-300 font-medium my-1">
                                {t('fractions:addition_subtraction.lcm_details.lcm_gcd_formula')}
                            </p>
                            
                            <div className="mt-3">
                                <p className="text-gray-700 dark:text-gray-300 font-medium">
                                    {t('fractions:addition_subtraction.lcm_details.euclid_gcd', { a: den1, b: den2 })}
                                </p>
                                
                                {mdcSteps.map((step, index) => (
                                    <div key={index} className="mt-1 flex items-center text-gray-700 dark:text-gray-300">
                                        <span>{step.a} = {step.b} × {Math.floor(step.a / step.b)} + {step.remainder}</span>
                                    </div>
                                ))}
                                
                                <p className="text-gray-700 dark:text-gray-300 mt-2">
                                    {t('fractions:addition_subtraction.lcm_details.gcd_result', { a: den1, b: den2, gcd: mdcValue })}
                                </p>
                                
                                <p className="text-gray-700 dark:text-gray-300 mt-3 font-medium">
                                    {t('fractions:addition_subtraction.lcm_details.applying_formula')}
                                </p>
                                <p className="text-gray-700 dark:text-gray-300">
                                    {t('fractions:addition_subtraction.lcm_details.lcm_calculation', { a: den1, b: den2, gcd: mdcValue })}
                                </p>
                                <p className="text-gray-700 dark:text-gray-300">
                                    {t('fractions:addition_subtraction.lcm_details.lcm_final', { 
                                        a: den1, 
                                        b: den2, 
                                        product: den1 * den2, 
                                        gcd: mdcValue,
                                        result: resultado 
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-blue-50 dark:bg-blue-800 p-3 rounded-md mt-3">
                        <p className="text-gray-700 dark:text-gray-300 font-medium">
                            {t('fractions:addition_subtraction.lcm_details.why_lcm')}
                        </p>
                        <p className="text-gray-700 dark:text-gray-300 mt-1">
                            {t('fractions:addition_subtraction.lcm_details.why_lcm_explanation', { 
                                operation: state.operation === 'add' ? 
                                    t('fractions:addition_subtraction.operations.add') : 
                                    t('fractions:addition_subtraction.operations.subtract')
                            })}
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
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{t('fractions:addition_subtraction.title')}</h2>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-6 mb-8">
                <p className="text-gray-700 dark:text-gray-300 mb-6">
                    {t('fractions:addition_subtraction.description')}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {t('fractions:addition_subtraction.labels.fraction1')}
                        </label>
                        <div className="flex items-center">
                            <input
                                type="number"
                                value={state.numerator1}
                                onChange={(e) => dispatch({ type: 'SET_NUMERATOR_1', value: e.target.value })}
                                className="w-20 p-2 border border-gray-300 dark:border-gray-600 rounded-l-md focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                                placeholder={t('fractions:addition_subtraction.labels.numerator')}
                            />
                            <div className="px-2 py-2 bg-gray-100 dark:bg-gray-600 border-t border-b border-gray-300 dark:border-gray-600">
                                /
                            </div>
                            <input
                                type="number"
                                value={state.denominator1}
                                onChange={(e) => dispatch({ type: 'SET_DENOMINATOR_1', value: e.target.value })}
                                className="w-20 p-2 border border-gray-300 dark:border-gray-600 rounded-r-md focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                                placeholder={t('fractions:addition_subtraction.labels.denominator')}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {t('fractions:addition_subtraction.labels.fraction2')}
                        </label>
                        <div className="flex items-center">
                            <input
                                type="number"
                                value={state.numerator2}
                                onChange={(e) => dispatch({ type: 'SET_NUMERATOR_2', value: e.target.value })}
                                className="w-20 p-2 border border-gray-300 dark:border-gray-600 rounded-l-md focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                                placeholder={t('fractions:addition_subtraction.labels.numerator')}
                            />
                            <div className="px-2 py-2 bg-gray-100 dark:bg-gray-600 border-t border-b border-gray-300 dark:border-gray-600">
                                /
                            </div>
                            <input
                                type="number"
                                value={state.denominator2}
                                onChange={(e) => dispatch({ type: 'SET_DENOMINATOR_2', value: e.target.value })}
                                className="w-20 p-2 border border-gray-300 dark:border-gray-600 rounded-r-md focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                                placeholder={t('fractions:addition_subtraction.labels.denominator')}
                            />
                        </div>
                    </div>
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('fractions:addition_subtraction.labels.operation')}
                    </label>
                    <div className="flex space-x-4">
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                value="add"
                                checked={state.operation === 'add'}
                                onChange={() => dispatch({ type: 'SET_OPERATION', operation: 'add' })}
                                className="form-radio h-4 w-4 text-indigo-600 dark:text-indigo-400"
                            />
                            <span className="ml-2">{t('fractions:addition_subtraction.labels.addition')}</span>
                        </label>
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                checked={state.operation === 'sub'}
                                onChange={() => dispatch({ type: 'SET_OPERATION', operation: 'sub' })}
                                className="form-radio h-4 w-4 text-indigo-600 dark:text-indigo-400"
                            />
                            <span className="ml-2">{t('fractions:addition_subtraction.labels.subtraction')}</span>
                        </label>
                    </div>
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t('fractions:addition_subtraction.labels.examples')}
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
                    {t('fractions:addition_subtraction.labels.calculate')}
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
                        <h3 className="text-lg font-medium text-green-800 dark:text-green-300 mb-2">{t('fractions:common.result')}</h3>
                        <div className="flex items-center">
                            <p className="text-xl mr-2 text-gray-800 dark:text-gray-200">
                                {state.operation === 'add' ? 
                                    t('fractions:addition_subtraction.results.addition') : 
                                    t('fractions:addition_subtraction.results.subtraction')
                                }
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
                           {state.showExplanation ? 
                               t('fractions:common.hide_explanation') : 
                               t('fractions:common.show_explanation')
                           }
                        </button>
                    </div>

                    {state.showExplanation && (
                        <div className="mt-8 bg-white dark:bg-gray-800 shadow-md rounded-lg p-5">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center">
                                    <HiCalculator className="h-6 w-6 mr-2 text-indigo-600 dark:text-indigo-400" />
                                    {t('fractions:common.step_by_step')}
                                </h3>
                            </div>
                            
                            {state.mmcSteps.den1 !== 0 && (
                                <div className="mb-4">
                                    <button
                                        onClick={() => {
                                            console.log('Toggling MMC details, current state:', state.showMMCDetails);
                                            dispatch({ type: 'TOGGLE_MMC_DETAILS' });
                                        }}
                                        className="mb-3 flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 text-sm font-medium"
                                        aria-expanded={state.showMMCDetails}
                                        type="button"
                                    >
                                        <HiInformationCircle className="h-5 w-5 mr-1" />
                                        {state.showMMCDetails ? 
                                            t('fractions:addition_subtraction.lcm_details.hide') : 
                                            t('fractions:addition_subtraction.lcm_details.show')
                                        }
                                    </button>
                                    
                                    {state.showMMCDetails && (
                                        <>
                                            {state.mmcSteps.den1 && state.mmcSteps.den2 ? (
                                                <MMCDetails />
                                            ) : (
                                                <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 rounded-md">
                                                    {t('fractions:addition_subtraction.lcm_details.unavailable')}
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            )}
                            
                            <StepByStepExplanation 
                                steps={state.steps} 
                                stepType="linear"
                            />

                            <ConceitoMatematico
                                title={t('fractions:common.mathematical_concept')}
                                isOpen={state.showConceitoMatematico}
                                onToggle={() => dispatch({ type: 'TOGGLE_CONCEITO_MATEMATICO' })}
                            >
                                <div className="flex flex-col md:flex-row gap-4 mb-4">
                                    <div className="flex-1">
                                        <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2 border-b border-gray-200 dark:border-gray-700 pb-1">
                                            {t('fractions:addition_subtraction.mathematical_concept.title')}
                                        </h5>
                                        <div className="space-y-3">
                                            <p className="text-gray-700 dark:text-gray-300">
                                                {t('fractions:addition_subtraction.mathematical_concept.explanation')}
                                            </p>
                                            <div className="bg-white dark:bg-gray-700 p-3 rounded-md border border-gray-100 dark:border-gray-600 shadow-sm">
                                                <h6 className="text-indigo-700 dark:text-indigo-300 font-medium mb-2">
                                                    {t('fractions:addition_subtraction.mathematical_concept.formulas_title')}
                                                </h6>
                                                <div className="space-y-2 text-center font-medium text-indigo-700 dark:text-indigo-300">
                                                    <p>
                                                        <span className="font-semibold">
                                                            {t('fractions:addition_subtraction.mathematical_concept.common_denominator')}
                                                        </span><br />
                                                        {t('fractions:addition_subtraction.mathematical_concept.common_denominator_formula')}
                                                    </p>
                                                    <p className="text-sm pt-2 border-t border-gray-100 dark:border-gray-600">
                                                        <span className="font-semibold">
                                                            {t('fractions:addition_subtraction.mathematical_concept.different_denominators')}
                                                        </span><br />
                                                        {t('fractions:addition_subtraction.mathematical_concept.different_denominators_formula')}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-md">
                                                <p className="text-indigo-700 dark:text-indigo-300 font-medium mb-2">
                                                    <span className="font-medium">
                                                        {t('fractions:addition_subtraction.mathematical_concept.why_lcm_title')}
                                                    </span> 
                                                    {t('fractions:addition_subtraction.mathematical_concept.why_lcm_text')}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex-1">
                                        <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2 border-b border-gray-200 dark:border-gray-700 pb-1">
                                            {t('fractions:addition_subtraction.mathematical_concept.steps_title')}
                                        </h5>
                                        <div className="bg-white dark:bg-gray-700 p-3 rounded-md border border-gray-100 dark:border-gray-600 shadow-sm space-y-4">
                                            <ol className="text-sm space-y-3 list-decimal pl-5 text-gray-700 dark:text-gray-300">
                                                <li>
                                                    <span className="font-medium text-indigo-700 dark:text-indigo-300">
                                                        {t('fractions:addition_subtraction.mathematical_concept.steps.step1_title')}
                                                    </span>
                                                    <p className="text-xs mt-1">
                                                        {t('fractions:addition_subtraction.mathematical_concept.steps.step1_text')}
                                                    </p>
                                                </li>
                                                <li>
                                                    <span className="font-medium text-indigo-700 dark:text-indigo-300">
                                                        {t('fractions:addition_subtraction.mathematical_concept.steps.step2_title')}
                                                    </span>
                                                    <p className="text-xs mt-1">
                                                        {t('fractions:addition_subtraction.mathematical_concept.steps.step2_text')}
                                                    </p>
                                                </li>
                                                <li>
                                                    <span className="font-medium text-indigo-700 dark:text-indigo-300">
                                                        {t('fractions:addition_subtraction.mathematical_concept.steps.step3_title')}
                                                    </span>
                                                    <p className="text-xs mt-1">
                                                        {t('fractions:addition_subtraction.mathematical_concept.steps.step3_text')}
                                                    </p>
                                                </li>
                                                <li>
                                                    <span className="font-medium text-indigo-700 dark:text-indigo-300">
                                                        {t('fractions:addition_subtraction.mathematical_concept.steps.step4_title')}
                                                    </span>
                                                    <p className="text-xs mt-1">
                                                        {t('fractions:addition_subtraction.mathematical_concept.steps.step4_text')}
                                                    </p>
                                                </li>
                                            </ol>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="mt-3 bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-md">
                                    <h5 className="font-medium text-indigo-800 dark:text-indigo-300 mb-1">
                                        {t('fractions:addition_subtraction.mathematical_concept.visualization_title')}
                                    </h5>
                                    <div className="grid grid-cols-2 gap-2 mt-2">
                                        <div className="bg-white dark:bg-gray-700 p-2 rounded-md">
                                            <p className="text-xs font-medium mb-1 text-indigo-700 dark:text-indigo-300">
                                                {t('fractions:addition_subtraction.mathematical_concept.visualization.same_denominator')}
                                            </p>
                                            <div className="flex items-center justify-center space-x-2 text-xs text-gray-700 dark:text-gray-300">
                                                <div className="flex flex-col items-center">
                                                    <div className="w-16 h-8 border border-gray-400 dark:border-gray-500 rounded-sm flex">
                                                        <div className="bg-blue-200 dark:bg-blue-500/40 w-8 h-full"></div>
                                                    </div>
                                                    <p className="mt-1">1/2</p>
                                                </div>
                                                <span>+</span>
                                                <div className="flex flex-col items-center">
                                                    <div className="w-16 h-8 border border-gray-400 dark:border-gray-500 rounded-sm flex">
                                                        <div className="bg-green-200 dark:bg-green-500/40 w-4 h-full"></div>
                                                    </div>
                                                    <p className="mt-1">1/4</p>
                                                </div>
                                                <span>=</span>
                                                <div className="flex flex-col items-center">
                                                    <div className="w-16 h-8 border border-gray-400 dark:border-gray-500 rounded-sm flex">
                                                        <div className="bg-blue-200 dark:bg-blue-500/40 w-8 h-full"></div>
                                                        <div className="bg-green-200 dark:bg-green-500/40 w-4 h-full"></div>
                                                    </div>
                                                    <p className="mt-1">3/4</p>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="bg-white dark:bg-gray-700 p-2 rounded-md">
                                            <p className="text-xs font-medium mb-1 text-indigo-700 dark:text-indigo-300">
                                                {t('fractions:addition_subtraction.mathematical_concept.visualization.finding_common_denominator')}
                                            </p>
                                            <div className="space-y-1 text-xs text-gray-700 dark:text-gray-300">
                                                <div className="flex items-center">
                                                    <div className="w-12 h-6 border border-gray-400 dark:border-gray-500 rounded-sm grid grid-cols-3">
                                                        <div className="bg-blue-200 dark:bg-blue-500/40"></div>
                                                        <div className="bg-blue-200 dark:bg-blue-500/40"></div>
                                                        <div></div>
                                                    </div>
                                                    <span className="mx-1">2/3</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <div className="w-12 h-6 border border-gray-400 dark:border-gray-500 rounded-sm grid grid-cols-4">
                                                        <div className="bg-green-200 dark:bg-green-500/40"></div>
                                                        <div className="bg-green-200 dark:bg-green-500/40"></div>
                                                        <div></div>
                                                        <div></div>
                                                    </div>
                                                    <span className="mx-1">2/4 = 1/2</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <div className="w-12 h-6 border border-gray-400 dark:border-gray-500 rounded-sm grid grid-cols-12">
                                                        <div className="bg-blue-200 dark:bg-blue-500/40"></div>
                                                        <div className="bg-blue-200 dark:bg-blue-500/40"></div>
                                                        <div className="bg-blue-200 dark:bg-blue-500/40"></div>
                                                        <div className="bg-blue-200 dark:bg-blue-500/40"></div>
                                                        <div className="bg-blue-200 dark:bg-blue-500/40"></div>
                                                        <div className="bg-blue-200 dark:bg-blue-500/40"></div>
                                                        <div className="bg-blue-200 dark:bg-blue-500/40"></div>
                                                        <div className="bg-blue-200 dark:bg-blue-500/40"></div>
                                                        <div className="bg-green-200 dark:bg-green-500/40"></div>
                                                        <div className="bg-green-200 dark:bg-green-500/40"></div>
                                                        <div className="bg-green-200 dark:bg-green-500/40"></div>
                                                        <div></div>
                                                    </div>
                                                    <span className="mx-1">MMC: 8/12 + 3/12 = 11/12</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-white dark:bg-gray-700 p-3 rounded-md border border-gray-100 dark:border-gray-600 shadow-sm">
                                        <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2">
                                            {t('fractions:addition_subtraction.mathematical_concept.examples_title')}
                                        </h5>
                                        <div className="space-y-3">
                                            <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-md">
                                                <p className="text-sm text-indigo-700 dark:text-indigo-300 font-medium">
                                                    {t('fractions:addition_subtraction.mathematical_concept.examples.addition_title')}
                                                </p>
                                                <ol className="text-xs list-decimal pl-4 mt-1 text-gray-700 dark:text-gray-300">
                                                    <li>{t('fractions:addition_subtraction.mathematical_concept.examples.addition_step1')}</li>
                                                    <li>{t('fractions:addition_subtraction.mathematical_concept.examples.addition_step2')}</li>
                                                    <li>{t('fractions:addition_subtraction.mathematical_concept.examples.addition_step3')}</li>
                                                    <li>{t('fractions:addition_subtraction.mathematical_concept.examples.addition_step4')}</li>
                                                    <li>{t('fractions:addition_subtraction.mathematical_concept.examples.addition_step5')}</li>
                                                </ol>
                                            </div>
                                            
                                            <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-md">
                                                <p className="text-sm text-purple-700 dark:text-purple-300 font-medium">
                                                    {t('fractions:addition_subtraction.mathematical_concept.examples.subtraction_title')}
                                                </p>
                                                <ol className="text-xs list-decimal pl-4 mt-1 text-gray-700 dark:text-gray-300">
                                                    <li>{t('fractions:addition_subtraction.mathematical_concept.examples.subtraction_step1')}</li>
                                                    <li>{t('fractions:addition_subtraction.mathematical_concept.examples.subtraction_step2')}</li>
                                                    <li>{t('fractions:addition_subtraction.mathematical_concept.examples.subtraction_step3')}</li>
                                                    <li>{t('fractions:addition_subtraction.mathematical_concept.examples.subtraction_step4')}</li>
                                                    <li>{t('fractions:addition_subtraction.mathematical_concept.examples.subtraction_step5')}</li>
                                                </ol>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-md border-l-4 border-yellow-400 dark:border-yellow-600">
                                        <h5 className="font-medium text-yellow-800 dark:text-yellow-300 mb-2">
                                            {t('fractions:addition_subtraction.mathematical_concept.tips_title')}
                                        </h5>
                                        <ul className="text-sm space-y-1 list-disc pl-4 text-gray-700 dark:text-gray-300">
                                            {(t('fractions:addition_subtraction.mathematical_concept.tips', { returnObjects: true }) as string[]).map((tip, index) => (
                                                <li key={index}>{tip}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                                
                                <div className="mt-4 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-md border border-indigo-100 dark:border-indigo-700">
                                    <h5 className="font-medium text-indigo-800 dark:text-indigo-300 mb-1 flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                        </svg>
                                        {t('fractions:addition_subtraction.mathematical_concept.relation_title')}
                                    </h5>
                                    <p className="text-sm text-indigo-700 dark:text-indigo-300">
                                        {t('fractions:addition_subtraction.mathematical_concept.relation_text')}
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

export default ResolvedorAddSubFracao;
