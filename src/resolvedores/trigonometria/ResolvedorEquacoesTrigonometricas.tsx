import React from 'react';
import { HiCalculator, HiInformationCircle } from 'react-icons/hi';
import { useEquacoesTrigonometricasSolver } from '../../hooks/trigonometria/useEquacoesTrigonometricasSolver';
import StepByStepExplanation from '../../components/StepByStepExplanation';
import ConceitoMatematico from '../../components/ConceitoMatematico';
import { useTranslation } from 'react-i18next';

const ResolvedorEquacoesTrigonometricas: React.FC = () => {
  const {
    state,
    dispatch,
    applyExample,
    getExamples,
    handleSolve
  } = useEquacoesTrigonometricasSolver();
  const { t } = useTranslation(['trigonometry', 'translation']);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <HiCalculator className="h-6 w-6 text-indigo-600 dark:text-indigo-400 mr-2" />
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{t('trigonometry:trigonometric_equations.title')}</h2>
      </div>
      
      <div className="resolver-container p-6 mb-8">
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          {t('trigonometry:trigonometric_equations.description')}
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="equacao" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('trigonometry:trigonometric_equations.labels.equation')}
            </label>
            <input
              type="text"
              id="equacao"
              value={state.equation}
              onChange={(e) => dispatch({ type: 'SET_EQUATION', value: e.target.value })}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
              placeholder="Ex: sen(x) = 1/2 ou cos^2(x) + 1 = 0"
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {t('trigonometry:trigonometric_equations.input_help.equation')}
            </p>
          </div>
          
          <div>
            <label htmlFor="intervalo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('trigonometry:trigonometric_equations.labels.interval')}
            </label>
            <input
              type="text"
              id="intervalo"
              value={state.interval}
              onChange={(e) => dispatch({ type: 'SET_INTERVAL', value: e.target.value })}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
              placeholder="Ex: 0,2π ou -π,π"
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {t('trigonometry:trigonometric_equations.input_help.interval')}
            </p>
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('trigonometry:trigonometric_equations.labels.examples')}
          </label>
          <div className="flex flex-wrap gap-2 mb-4">
            {getExamples().map((exemplo, index) => (
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
        
        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md text-sm">
          <h3 className="font-bold mb-1 text-blue-800 dark:text-blue-300">{t('trigonometry:trigonometric_equations.usage.title')}</h3>
          <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
            {(t('trigonometry:trigonometric_equations.usage.list', { returnObjects: true }) as string[]).map((item, index) => (
              <li key={index}>
                <code className="bg-blue-100 dark:bg-blue-800 rounded px-1">{item.split(':')[0]}</code>
                <span> {item.includes(':') ? item.split(':')[1].trim() : ''}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <button
          onClick={handleSolve}
          className="bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 text-white font-medium py-2 px-6 rounded-md transition-colors duration-300"
        >
          {t('trigonometry:trigonometric_equations.labels.calculate')}
        </button>
        
        {state.error && (
          <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 rounded-md">
            {state.error}
          </div>
        )}
      </div>
      
      {state.result && (
        <div className="space-y-6">
          <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-5">
            <h3 className="text-lg font-medium text-green-800 dark:text-green-300 mb-2">{t('trigonometry:trigonometric_equations.results.title')}</h3>
            <p className="text-xl font-bold text-gray-800 dark:text-gray-200">
              {state.result}
            </p>
            
            {state.formattedSolutions.length > 0 ? (
              <div className="mt-3">
                {state.formattedSolutions.map((solution, index) => (
                  <p key={index} className="text-lg text-gray-800 dark:text-gray-200">
                    {t('trigonometry:trigonometric_equations.results.solution_format', {
                      index: index + 1,
                      radians: solution.radians,
                      degrees: solution.degrees
                    })}
                  </p>
                ))}
              </div>
            ) : (
              <p className="text-gray-700 dark:text-gray-300 mt-2">{t('trigonometry:trigonometric_equations.results.no_solutions')}</p>
            )}
            
            <button 
              onClick={() => dispatch({ type: 'TOGGLE_EXPLANATION' })}
              className="mt-4 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 text-sm font-medium flex items-center"
            >
              <HiInformationCircle className="h-5 w-5 mr-1" />
              {state.showExplanation 
                ? t('trigonometry:trigonometric_equations.explanation.hide') 
                : t('trigonometry:trigonometric_equations.explanation.show')}
            </button>
          </div>
          
          {state.showExplanation && state.explanationSteps.length > 0 && (
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center">
                  <HiCalculator className="h-6 w-6 mr-2 text-indigo-600 dark:text-indigo-400" />
                  {t('trigonometry:trigonometric_equations.explanation.title')}
                </h3>
              </div>
              
              <StepByStepExplanation steps={state.explanationSteps} stepType="trigonometric" />
              
              <ConceitoMatematico
                title={t('trigonometry:trigonometric_equations.mathematical_concept.title')}
                isOpen={state.showConceitoMatematico}
                onToggle={() => dispatch({ type: 'TOGGLE_CONCEITO_MATEMATICO' })}
              >
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                  <div className="flex-1">
                    <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2 border-b border-gray-200 dark:border-gray-700 pb-1">
                      {t('trigonometry:trigonometric_equations.mathematical_concept.properties.title')}
                    </h5>
                    <p className="text-gray-700 dark:text-gray-300">
                      {t('trigonometry:trigonometric_equations.mathematical_concept.properties.description')}
                    </p>
                    <div className="mt-3 grid grid-cols-1 gap-2">
                      <div className="p-2 bg-white dark:bg-gray-700 rounded-md border border-gray-100 dark:border-gray-600 shadow-sm">
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          <strong className="text-indigo-600 dark:text-indigo-400">
                            {t('trigonometry:trigonometric_equations.mathematical_concept.properties.sine')}
                          </strong>
                        </p>
                      </div>
                      <div className="p-2 bg-white dark:bg-gray-700 rounded-md border border-gray-100 dark:border-gray-600 shadow-sm">
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          <strong className="text-indigo-600 dark:text-indigo-400">
                            {t('trigonometry:trigonometric_equations.mathematical_concept.properties.cosine')}
                          </strong>
                        </p>
                      </div>
                      <div className="p-2 bg-white dark:bg-gray-700 rounded-md border border-gray-100 dark:border-gray-600 shadow-sm">
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          <strong className="text-indigo-600 dark:text-indigo-400">
                            {t('trigonometry:trigonometric_equations.mathematical_concept.properties.tangent')}
                          </strong>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2 border-b border-gray-200 dark:border-gray-700 pb-1">
                      {t('trigonometry:trigonometric_equations.mathematical_concept.solution_method.title')}
                    </h5>
                    <p className="text-gray-700 dark:text-gray-300 mb-2">
                      {t('trigonometry:trigonometric_equations.mathematical_concept.solution_method.description')}
                    </p>
                    <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                      <li className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors flex">
                        <div className="h-5 w-5 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 flex items-center justify-center text-xs mr-2 flex-shrink-0">1</div>
                        <span>
                          <span className="font-medium">
                            {t('trigonometry:trigonometric_equations.mathematical_concept.solution_method.known_values')}
                          </span>
                        </span>
                      </li>
                      <li className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors flex">
                        <div className="h-5 w-5 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 flex items-center justify-center text-xs mr-2 flex-shrink-0">2</div>
                        <span>
                          <span className="font-medium">
                            {t('trigonometry:trigonometric_equations.mathematical_concept.solution_method.identities')}
                          </span>
                        </span>
                      </li>
                      <li className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors flex">
                        <div className="h-5 w-5 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 flex items-center justify-center text-xs mr-2 flex-shrink-0">3</div>
                        <span>
                          <span className="font-medium">
                            {t('trigonometry:trigonometric_equations.mathematical_concept.solution_method.numerical_methods')}
                          </span>
                        </span>
                      </li>
                      <li className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors flex">
                        <div className="h-5 w-5 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 flex items-center justify-center text-xs mr-2 flex-shrink-0">4</div>
                        <span>
                          <span className="font-medium">
                            {t('trigonometry:trigonometric_equations.mathematical_concept.solution_method.reformulation')}
                          </span>
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div className="mt-4">
                  <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2 border-b border-gray-200 dark:border-gray-700 pb-1">
                    {t('trigonometry:trigonometric_equations.mathematical_concept.notable_angles.title')}
                  </h5>
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white dark:bg-gray-700 rounded-md shadow-sm">
                      <thead>
                        <tr className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300">
                          <th className="py-2 px-3 text-left text-sm font-medium">
                            {t('trigonometry:trigonometric_equations.mathematical_concept.notable_angles.angle_degrees')}
                          </th>
                          <th className="py-2 px-3 text-left text-sm font-medium">
                            {t('trigonometry:trigonometric_equations.mathematical_concept.notable_angles.angle_rad')}
                          </th>
                          <th className="py-2 px-3 text-left text-sm font-medium">
                            {t('trigonometry:trigonometric_equations.mathematical_concept.notable_angles.sin')}
                          </th>
                          <th className="py-2 px-3 text-left text-sm font-medium">
                            {t('trigonometry:trigonometric_equations.mathematical_concept.notable_angles.cos')}
                          </th>
                          <th className="py-2 px-3 text-left text-sm font-medium">
                            {t('trigonometry:trigonometric_equations.mathematical_concept.notable_angles.tan')}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-gray-600">
                        <tr className="hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300">
                          <td className="py-2 px-3 text-sm">0°</td>
                          <td className="py-2 px-3 text-sm">0</td>
                          <td className="py-2 px-3 text-sm">0</td>
                          <td className="py-2 px-3 text-sm">1</td>
                          <td className="py-2 px-3 text-sm">0</td>
                        </tr>
                        <tr className="hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300">
                          <td className="py-2 px-3 text-sm">30°</td>
                          <td className="py-2 px-3 text-sm">π/6</td>
                          <td className="py-2 px-3 text-sm">1/2</td>
                          <td className="py-2 px-3 text-sm">√3/2</td>
                          <td className="py-2 px-3 text-sm">1/√3</td>
                        </tr>
                        <tr className="hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300">
                          <td className="py-2 px-3 text-sm">45°</td>
                          <td className="py-2 px-3 text-sm">π/4</td>
                          <td className="py-2 px-3 text-sm">1/√2</td>
                          <td className="py-2 px-3 text-sm">1/√2</td>
                          <td className="py-2 px-3 text-sm">1</td>
                        </tr>
                        <tr className="hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300">
                          <td className="py-2 px-3 text-sm">60°</td>
                          <td className="py-2 px-3 text-sm">π/3</td>
                          <td className="py-2 px-3 text-sm">√3/2</td>
                          <td className="py-2 px-3 text-sm">1/2</td>
                          <td className="py-2 px-3 text-sm">√3</td>
                        </tr>
                        <tr className="hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300">
                          <td className="py-2 px-3 text-sm">90°</td>
                          <td className="py-2 px-3 text-sm">π/2</td>
                          <td className="py-2 px-3 text-sm">1</td>
                          <td className="py-2 px-3 text-sm">0</td>
                          <td className="py-2 px-3 text-sm">∞</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                
                <div className="mt-4 bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-md border-l-4 border-yellow-400 dark:border-yellow-600">
                  <h5 className="font-medium text-yellow-800 dark:text-yellow-300 mb-1">
                    {t('trigonometry:trigonometric_equations.mathematical_concept.solution_tip.title')}
                  </h5>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    {t('trigonometry:trigonometric_equations.mathematical_concept.solution_tip.description')}
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

export default ResolvedorEquacoesTrigonometricas;