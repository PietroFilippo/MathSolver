import React, { useEffect, useRef, useState } from 'react';
import { HiCalculator, HiInformationCircle } from 'react-icons/hi';
import { useGraficosTrigonometricosSolver, GraphType } from '../../hooks/trigonometria/useGraficosTrigonometricosSolver';
import StepByStepExplanation from '../../components/StepByStepExplanation';
import ConceitoMatematico from '../../components/ConceitoMatematico';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ReferenceLine
} from 'recharts';
import { useTranslation } from 'react-i18next';

const ResolvedorGraficosTrigonometricos: React.FC = () => {
    const {
        state,
        dispatch,
        getFilteredExamples,
        applyExample,
        handleSolve,
        formatAxisX,
        obtainDomainY
    } = useGraficosTrigonometricosSolver();
    
    const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
    const { t } = useTranslation(['trigonometry', 'translation']);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const checkDarkMode = () => {
        if (typeof window !== 'undefined') {
            return document.documentElement.classList.contains('dark');
        }
        return false;
    };

    // Para referência e download do gráfico
    const chartRef = useRef(null);

    // Para controlar a quantidade de ticks no eixo X
    const getXAxisTickCount = () => {
        if (windowWidth < 640) return 4; // mobile
        if (windowWidth < 1024) return 6; // tablet
        return 8; // desktop
    };

    // Função para determinar cor da linha com base no tipo de gráfico
    const getLineColor = () => {
        return state.graphType === 'seno' ? '#4f46e5' :
               state.graphType === 'cosseno' ? '#0ea5e9' :
               state.graphType === 'tangente' ? '#ef4444' : '#10b981';
    };

    // Configurações do gráfico (ResponsiveContainer)
    const [yDomain, setYDomain] = useState<[number, number]>([-2, 2]);
    
    useEffect(() => {
        if (state.points.length > 0) {
            setYDomain(obtainDomainY());
        }
    }, [state.points]);

    const GraphFunction = ({ height, widthPercentage = "100%", onClick = undefined }: { height: string, widthPercentage?: string, onClick?: () => void }) => {
        return (
            <div style={{ width: widthPercentage, height, cursor: onClick ? 'pointer' : 'default' }} onClick={onClick} ref={chartRef}>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={state.points}
                        margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                    >
                        <CartesianGrid 
                            strokeDasharray="3 3" 
                            stroke={checkDarkMode() ? '#374151' : '#e5e7eb'} 
                        />
                        <XAxis 
                            dataKey="x"
                            type="number"
                            domain={['dataMin', 'dataMax']}
                            tickFormatter={formatAxisX}
                            allowDecimals={true}
                            stroke={checkDarkMode() ? '#9ca3af' : '#4b5563'}
                            tickCount={getXAxisTickCount()}
                        />
                        <YAxis 
                            type="number"
                            domain={yDomain}
                            allowDecimals={true}
                            stroke={checkDarkMode() ? '#9ca3af' : '#4b5563'}
                        />
                        <Tooltip
                            formatter={(value: number) => [value.toFixed(4), t('trigonometry:trigonometric_graphs.chart.y_value')]}
                            labelFormatter={(label: number) => `${t('trigonometry:trigonometric_graphs.chart.x_value')}: ${formatAxisX(label)}`}
                            contentStyle={{
                                backgroundColor: checkDarkMode() ? '#1f2937' : '#ffffff',
                                borderColor: checkDarkMode() ? '#374151' : '#e5e7eb',
                                color: checkDarkMode() ? '#e5e7eb' : '#111827'
                            }}
                        />
                        <ReferenceLine y={0} stroke={checkDarkMode() ? '#6b7280' : '#9ca3af'} />
                        <ReferenceLine x={0} stroke={checkDarkMode() ? '#6b7280' : '#9ca3af'} />
                        <Line 
                            type="monotone" 
                            dataKey="y" 
                            stroke={getLineColor()} 
                            dot={false}
                            strokeWidth={2}
                            activeDot={{ r: 6, fill: getLineColor(), stroke: 'white', strokeWidth: 2 }}
                        />
                        <Legend formatter={() => state.graphType === 'personalizado' ? state.funcao : t(`trigonometry:trigonometric_graphs.function_names.${state.graphType}`)} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        );
    };

    const renderExplanationSteps = () => {
        if (!state.solutionSteps || state.solutionSteps.length === 0) {
            return (
                <div className="p-4 text-gray-600 dark:text-gray-400 italic text-center">
                    {t('trigonometry:trigonometric_graphs.explanation.no_steps')}
                </div>
            );
        }
        
        return (
            <div className="p-4">
                <StepByStepExplanation steps={state.solutionSteps} stepType="trigonometric" />
            </div>
        );
    };

    const functionOptions = [
        { id: 'seno', label: t('trigonometry:trigonometric_graphs.function_names.seno') },
        { id: 'cosseno', label: t('trigonometry:trigonometric_graphs.function_names.cosseno') },
        { id: 'tangente', label: t('trigonometry:trigonometric_graphs.function_names.tangente') },
        { id: 'personalizado', label: t('trigonometry:trigonometric_graphs.function_names.personalizado') }
    ];

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center mb-6">
                <HiCalculator className="h-6 w-6 text-indigo-600 dark:text-indigo-400 mr-2" />
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                    {t('trigonometry:trigonometric_graphs.title')}
                </h2>
            </div>
            
            <div className="resolver-container p-6 mb-8">
                <p className="text-gray-700 dark:text-gray-300 mb-6">
                    {t('trigonometry:trigonometric_graphs.description')}
                </p>
                
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('trigonometry:trigonometric_graphs.labels.function_type')}
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {functionOptions.map(option => (
                            <button
                                key={option.id}
                                className={`py-2 px-4 rounded-md transition-colors ${
                                    state.graphType === option.id
                                        ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 font-medium'
                                        : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                                }`}
                                onClick={() => dispatch({ type: 'SET_GRAPH_TYPE', value: option.id as GraphType })}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>
                
                {state.graphType === 'personalizado' ? (
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {t('trigonometry:trigonometric_graphs.labels.custom_function')}
                        </label>
                        <input
                            type="text"
                            value={state.funcao}
                            onChange={(e) => dispatch({ type: 'SET_FUNCTION', value: e.target.value })}
                            placeholder={t('trigonometry:trigonometric_graphs.placeholders.custom_function')}
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                        />
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            {t('trigonometry:trigonometric_graphs.help.custom_function')}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                {t('trigonometry:trigonometric_graphs.labels.amplitude')}
                            </label>
                            <input
                                type="text"
                                value={state.amplitude}
                                onChange={(e) => dispatch({ type: 'SET_AMPLITUDE', value: e.target.value })}
                                placeholder="1"
                                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                {t('trigonometry:trigonometric_graphs.labels.period')}
                            </label>
                            <input
                                type="text"
                                value={state.period}
                                onChange={(e) => dispatch({ type: 'SET_PERIOD', value: e.target.value })}
                                placeholder="1"
                                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                {t('trigonometry:trigonometric_graphs.labels.phase_shift')}
                            </label>
                            <input
                                type="text"
                                value={state.phaseShift}
                                onChange={(e) => dispatch({ type: 'SET_PHASE_SHIFT', value: e.target.value })}
                                placeholder="0"
                                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                {t('trigonometry:trigonometric_graphs.labels.vertical_shift')}
                            </label>
                            <input
                                type="text"
                                value={state.verticalShift}
                                onChange={(e) => dispatch({ type: 'SET_VERTICAL_SHIFT', value: e.target.value })}
                                placeholder="0"
                                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                            />
                        </div>
                    </div>
                )}
                
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('trigonometry:trigonometric_graphs.labels.interval')}
                    </label>
                    <input
                        type="text"
                        value={state.interval}
                        onChange={(e) => dispatch({ type: 'SET_INTERVAL', value: e.target.value })}
                        placeholder="0,2π"
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                    />
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        {t('trigonometry:trigonometric_graphs.help.interval')}
                    </p>
                </div>
                
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t('trigonometry:trigonometric_graphs.labels.examples')}
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
                    {t('trigonometry:trigonometric_graphs.labels.generate')}
                </button>
                
                {state.error && (
                    <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 rounded-md">
                        {state.error}
                    </div>
                )}
            </div>
            
            {state.result && state.points.length > 0 && (
                <div className="space-y-6">
                    <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-5">
                        <h3 className="text-lg font-medium text-green-800 dark:text-green-300 mb-2">
                            {t('trigonometry:trigonometric_graphs.results.title')}
                        </h3>
                        <p className="text-gray-800 dark:text-gray-200">
                            {state.result}
                        </p>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-5">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                                {t('trigonometry:trigonometric_graphs.chart.title')}
                            </h3>
                            <button 
                                onClick={() => dispatch({ type: 'TOGGLE_EXPANDED_GRAPH' })}
                                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 text-sm font-medium flex items-center"
                            >
                                <HiInformationCircle className="h-5 w-5 mr-1" />
                                {state.showExpandedGraph 
                                    ? t('trigonometry:trigonometric_graphs.chart.compress') 
                                    : t('trigonometry:trigonometric_graphs.chart.expand')}
                            </button>
                        </div>
                        
                        <GraphFunction 
                            height={state.showExpandedGraph ? "400px" : "250px"} 
                            onClick={state.showExpandedGraph ? undefined : () => dispatch({ type: 'TOGGLE_EXPANDED_GRAPH' })}
                        />
                        
                        {state.graphType !== 'personalizado' && (
                            <div className="mt-4 bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-md">
                                <h4 className="font-medium text-indigo-800 dark:text-indigo-300 mb-2">
                                    {t('trigonometry:trigonometric_graphs.equation.title')}
                                </h4>
                                <div className="text-center p-2 bg-white dark:bg-gray-700 rounded-md shadow-sm font-mono">
                                    {state.graphType === 'seno' && (
                                        <span>y = {state.amplitude} ⋅ sin({state.period}x {state.phaseShift !== '0' ? `${Number(state.phaseShift) >= 0 ? '-' : '+'} ${Math.abs(Number(state.phaseShift))}` : ''}) {state.verticalShift !== '0' ? `${Number(state.verticalShift) >= 0 ? '+' : '-'} ${Math.abs(Number(state.verticalShift))}` : ''}</span>
                                    )}
                                    {state.graphType === 'cosseno' && (
                                        <span>y = {state.amplitude} ⋅ cos({state.period}x {state.phaseShift !== '0' ? `${Number(state.phaseShift) >= 0 ? '-' : '+'} ${Math.abs(Number(state.phaseShift))}` : ''}) {state.verticalShift !== '0' ? `${Number(state.verticalShift) >= 0 ? '+' : '-'} ${Math.abs(Number(state.verticalShift))}` : ''}</span>
                                    )}
                                    {state.graphType === 'tangente' && (
                                        <span>y = {state.amplitude} ⋅ tan({state.period}x {state.phaseShift !== '0' ? `${Number(state.phaseShift) >= 0 ? '-' : '+'} ${Math.abs(Number(state.phaseShift))}` : ''}) {state.verticalShift !== '0' ? `${Number(state.verticalShift) >= 0 ? '+' : '-'} ${Math.abs(Number(state.verticalShift))}` : ''}</span>
                                    )}
                                </div>
                            </div>
                        )}
                        
                        <div className="mt-4">
                            <button 
                                onClick={() => dispatch({ type: 'TOGGLE_EXPLANATION' })}
                                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 text-sm font-medium flex items-center"
                            >
                                <HiInformationCircle className="h-5 w-5 mr-1" />
                                {state.showExplanation 
                                    ? t('trigonometry:trigonometric_graphs.explanation.hide') 
                                    : t('trigonometry:trigonometric_graphs.explanation.show')}
                            </button>
                        </div>
                        
                        {state.showExplanation && (
                            <>
                                <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                                    <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-3">
                                        {t('trigonometry:trigonometric_graphs.explanation.title')}
                                    </h4>
                                    {renderExplanationSteps()}
                                </div>
                                
                                <ConceitoMatematico
                                    title={t('trigonometry:trigonometric_graphs.mathematical_concept.title')}
                                    isOpen={state.showConceitoMatematico}
                                    onToggle={() => dispatch({ type: 'TOGGLE_CONCEITO_MATEMATICO' })}
                                >
                                    <div className="space-y-4 text-gray-700 dark:text-gray-300">
                                        <div className="flex flex-col md:flex-row gap-6">
                                            <div className="flex-1">
                                                <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2 border-b border-gray-200 dark:border-gray-700 pb-1">
                                                    {t('trigonometry:trigonometric_graphs.mathematical_concept.transformations.title')}
                                                </h5>
                                                <ul className="list-disc pl-5 mt-2 space-y-3">
                                                    <li className="p-1 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors">
                                                        <strong>{t('trigonometry:trigonometric_graphs.mathematical_concept.transformations.amplitude')}</strong>: {t('trigonometry:trigonometric_graphs.mathematical_concept.transformations.amplitude_desc')}
                                                    </li>
                                                    <li className="p-1 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors">
                                                        <strong>{t('trigonometry:trigonometric_graphs.mathematical_concept.transformations.period')}</strong>: {t('trigonometry:trigonometric_graphs.mathematical_concept.transformations.period_desc')}
                                                    </li>
                                                    <li className="p-1 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors">
                                                        <strong>{t('trigonometry:trigonometric_graphs.mathematical_concept.transformations.phase')}</strong>: {t('trigonometry:trigonometric_graphs.mathematical_concept.transformations.phase_desc')}
                                                    </li>
                                                    <li className="p-1 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors">
                                                        <strong>{t('trigonometry:trigonometric_graphs.mathematical_concept.transformations.vertical')}</strong>: {t('trigonometry:trigonometric_graphs.mathematical_concept.transformations.vertical_desc')}
                                                    </li>
                                                </ul>
                                            </div>
                                            
                                            <div className="flex-1">
                                                <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2 border-b border-gray-200 dark:border-gray-700 pb-1">
                                                    {t('trigonometry:trigonometric_graphs.mathematical_concept.general_form.title')}
                                                </h5>
                                                <div className="bg-white dark:bg-gray-700 p-4 rounded-md border border-gray-100 dark:border-gray-600 shadow-sm">
                                                    <p className="mb-3 text-center font-medium">
                                                        {t('trigonometry:trigonometric_graphs.mathematical_concept.general_form.description')}
                                                    </p>
                                                    <div className="space-y-3">
                                                        <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-md text-center font-mono">
                                                            y = a ⋅ sin(bx + c) + d
                                                        </div>
                                                        <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-md text-center font-mono">
                                                            y = a ⋅ cos(bx + c) + d
                                                        </div>
                                                        <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-md text-center font-mono">
                                                            y = a ⋅ tan(bx + c) + d
                                                        </div>
                                                    </div>
                                                    <div className="mt-3 text-sm">
                                                        <ul className="space-y-1">
                                                            <li><strong>a</strong>: {t('trigonometry:trigonometric_graphs.mathematical_concept.parameters.a')}</li>
                                                            <li><strong>b</strong>: {t('trigonometry:trigonometric_graphs.mathematical_concept.parameters.b')}</li>
                                                            <li><strong>c</strong>: {t('trigonometry:trigonometric_graphs.mathematical_concept.parameters.c')}</li>
                                                            <li><strong>d</strong>: {t('trigonometry:trigonometric_graphs.mathematical_concept.parameters.d')}</li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="mt-4">
                                            <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2 border-b border-gray-200 dark:border-gray-700 pb-1">
                                                {t('trigonometry:trigonometric_graphs.mathematical_concept.properties.title')}
                                            </h5>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                                                <div className="p-3 bg-white dark:bg-gray-700 rounded-md border border-gray-100 dark:border-gray-600 shadow-sm">
                                                    <h6 className="font-medium text-indigo-700 dark:text-indigo-400 mb-2">
                                                        {t('trigonometry:trigonometric_graphs.mathematical_concept.properties.sine')}
                                                    </h6>
                                                    <ul className="list-disc pl-4 space-y-1 text-sm">
                                                        <li>{t('trigonometry:trigonometric_graphs.mathematical_concept.properties.sine_domain')}</li>
                                                        <li>{t('trigonometry:trigonometric_graphs.mathematical_concept.properties.sine_range')}</li>
                                                        <li>{t('trigonometry:trigonometric_graphs.mathematical_concept.properties.sine_period')}</li>
                                                        <li>{t('trigonometry:trigonometric_graphs.mathematical_concept.properties.sine_odd')}</li>
                                                    </ul>
                                                </div>
                                                <div className="p-3 bg-white dark:bg-gray-700 rounded-md border border-gray-100 dark:border-gray-600 shadow-sm">
                                                    <h6 className="font-medium text-indigo-700 dark:text-indigo-400 mb-2">
                                                        {t('trigonometry:trigonometric_graphs.mathematical_concept.properties.cosine')}
                                                    </h6>
                                                    <ul className="list-disc pl-4 space-y-1 text-sm">
                                                        <li>{t('trigonometry:trigonometric_graphs.mathematical_concept.properties.cosine_domain')}</li>
                                                        <li>{t('trigonometry:trigonometric_graphs.mathematical_concept.properties.cosine_range')}</li>
                                                        <li>{t('trigonometry:trigonometric_graphs.mathematical_concept.properties.cosine_period')}</li>
                                                        <li>{t('trigonometry:trigonometric_graphs.mathematical_concept.properties.cosine_even')}</li>
                                                    </ul>
                                                </div>
                                                <div className="p-3 bg-white dark:bg-gray-700 rounded-md border border-gray-100 dark:border-gray-600 shadow-sm">
                                                    <h6 className="font-medium text-indigo-700 dark:text-indigo-400 mb-2">
                                                        {t('trigonometry:trigonometric_graphs.mathematical_concept.properties.tangent')}
                                                    </h6>
                                                    <ul className="list-disc pl-4 space-y-1 text-sm">
                                                        <li>{t('trigonometry:trigonometric_graphs.mathematical_concept.properties.tangent_domain')}</li>
                                                        <li>{t('trigonometry:trigonometric_graphs.mathematical_concept.properties.tangent_range')}</li>
                                                        <li>{t('trigonometry:trigonometric_graphs.mathematical_concept.properties.tangent_period')}</li>
                                                        <li>{t('trigonometry:trigonometric_graphs.mathematical_concept.properties.tangent_odd')}</li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-md border-l-4 border-yellow-400 dark:border-yellow-600 mt-4">
                                            <h5 className="font-medium text-yellow-800 dark:text-yellow-300 mb-1">
                                                {t('trigonometry:trigonometric_graphs.mathematical_concept.applications.title')}
                                            </h5>
                                            <ul className="list-disc pl-5 mt-1 text-gray-700 dark:text-gray-300">
                                                {(t('trigonometry:trigonometric_graphs.mathematical_concept.applications.list', { returnObjects: true }) as string[]).map((app, index) => (
                                                    <li key={index}>{app}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </ConceitoMatematico>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ResolvedorGraficosTrigonometricos; 