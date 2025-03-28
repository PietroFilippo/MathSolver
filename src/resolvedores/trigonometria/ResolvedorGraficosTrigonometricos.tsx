import React, { useState, useEffect } from 'react';
import { HiCalculator, HiInformationCircle, HiX } from 'react-icons/hi';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine 
} from 'recharts';
import { useGraficosTrigonometricosSolver } from '../../hooks/trigonometria/useGraficosTrigonometricosSolver';
import StepByStepExplanation from '../../components/StepByStepExplanation';
import ConceitoMatematico from '../../components/ConceitoMatematico';

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
  
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Detect dark mode on mount and when theme changes
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return;
    }

    const checkDarkMode = () => {
      // Only check document.documentElement.classList as the reliable source
      const isDark = document.documentElement.classList.contains('dark');
      setIsDarkMode(isDark);
    };
    
    // Check initially
    checkDarkMode();
    
    // Set up an observer to detect class changes on documentElement
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.attributeName === 'class' &&
          mutation.target === document.documentElement
        ) {
          checkDarkMode();
        }
      });
    });
    
    try {
      observer.observe(document.documentElement, { attributes: true });
    } catch (error) {
      console.error('Failed to observe document:', error);
    }
    
    // Clean up
    return () => {
      try {
        observer.disconnect();
      } catch (error) {
        console.error('Failed to disconnect observer:', error);
      }
    };
  }, []);

  // Componente do gráfico para reutilização
  const GraphFunction = ({ height, widthPercentage = "100%", onClick = undefined }: { height: string, widthPercentage?: string, onClick?: () => void }) => {
    // Colors based on theme - ensure proper defaults for both modes
    const textColor = isDarkMode ? '#f3f4f6' : '#333'; 
    const axisColor = isDarkMode ? '#d1d5db' : '#333'; 
    const gridColor = isDarkMode ? 'rgba(209, 213, 219, 0.2)' : 'rgba(150, 150, 150, 0.3)';
    const tooltipBg = isDarkMode ? '#374151' : 'white';
    const chartBg = isDarkMode ? '#374151' : 'transparent';
    const lineColor = isDarkMode ? "#a78bfa" : "#6366f1"; // Use a consistent indigo color that matches the site theme
    
    return (
      <div 
        className={`${onClick ? 'cursor-pointer hover:shadow-lg transition-shadow duration-300' : ''} bg-white dark:bg-gray-700 p-2 rounded-md overflow-hidden`} 
        onClick={onClick}
        style={{ height: height, width: widthPercentage }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={state.points}
            margin={{
              top: 20,
              right: 30,
              left: 50,
              bottom: 20,
            }}
            style={{ background: chartBg }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis 
              dataKey="x" 
              domain={['dataMin', 'dataMax']} 
              tickFormatter={formatAxisX}
              label={{ value: 'x', position: 'insideBottomRight', offset: -10, fill: textColor, fontWeight: isDarkMode ? 'bold' : 'normal' }}
              stroke={axisColor} 
              style={{ fontSize: '0.8rem', fill: textColor, fontWeight: isDarkMode ? 'bold' : 'normal' }}
              tick={{ fill: textColor, fontWeight: isDarkMode ? 'bold' : 'normal' }}
            />
            <YAxis 
              domain={obtainDomainY()}
              label={{ value: 'f(x)', angle: -90, position: 'insideLeft', fill: textColor, fontWeight: isDarkMode ? 'bold' : 'normal' }}
              tickFormatter={(value) => value.toFixed(2)}
              width={60}
              stroke={axisColor}
              style={{ fontSize: '0.8rem', fill: textColor, fontWeight: isDarkMode ? 'bold' : 'normal' }}
              tick={{ fill: textColor, fontWeight: isDarkMode ? 'bold' : 'normal' }}
            />
            <Tooltip 
              formatter={(value: number) => [value.toFixed(4), 'f(x)']}
              labelFormatter={(label: number) => `x = ${formatAxisX(label)}`}
              contentStyle={{ 
                backgroundColor: tooltipBg, 
                border: `1px solid ${isDarkMode ? '#4b5563' : '#ccc'}`, 
                borderRadius: '4px', 
                color: textColor,
                fontWeight: isDarkMode ? 'bold' : 'normal'
              }}
              itemStyle={{ color: textColor }}
              labelStyle={{ color: textColor }}
            />
            <ReferenceLine y={0} stroke={axisColor} strokeWidth={2} />
            <ReferenceLine x={0} stroke={axisColor} strokeWidth={2} />
            <Line 
              type="monotone" 
              dataKey="y" 
              stroke={lineColor} 
              dot={false} 
              isAnimationActive={true} 
              name="f(x)"
              strokeWidth={2.5}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  };

  // Função para renderizar os passos de explicação com estilização aprimorada
  const renderExplanationSteps = () => {
    return (
      <StepByStepExplanation
        steps={state.solutionSteps}
        stepType="trigonometric"
      />
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <HiCalculator className="h-6 w-6 text-indigo-600 dark:text-indigo-400 mr-2" />
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Gráficos de Funções Trigonométricas</h2>
      </div>
      
      <div className="resolver-container p-6 mb-8">
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          Esta calculadora ajuda você a gerar e analisar gráficos de funções trigonométricas, como seno, cosseno e tangente,
          bem como funções personalizadas que combinam várias funções trigonométricas.
        </p>
        
        <div className="mb-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tipo de Função</label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio text-indigo-600 dark:text-indigo-400"
                  checked={state.graphType === 'seno'}
                  onChange={() => dispatch({ type: 'SET_GRAPH_TYPE', value: 'seno' })}
                />
                <span className="ml-2 text-gray-700 dark:text-gray-300">Seno</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio text-indigo-600 dark:text-indigo-400"
                  checked={state.graphType === 'cosseno'}
                  onChange={() => dispatch({ type: 'SET_GRAPH_TYPE', value: 'cosseno' })}
                />
                <span className="ml-2 text-gray-700 dark:text-gray-300">Cosseno</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio text-indigo-600 dark:text-indigo-400"
                  checked={state.graphType === 'tangente'}
                  onChange={() => dispatch({ type: 'SET_GRAPH_TYPE', value: 'tangente' })}
                />
                <span className="ml-2 text-gray-700 dark:text-gray-300">Tangente</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio text-indigo-600 dark:text-indigo-400"
                  checked={state.graphType === 'personalizado'}
                  onChange={() => dispatch({ type: 'SET_GRAPH_TYPE', value: 'personalizado' })}
                />
                <span className="ml-2 text-gray-700 dark:text-gray-300">Personalizado</span>
              </label>
            </div>
          </div>
          
          {/* Exemplos */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Exemplos
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
          
          {state.graphType === 'personalizado' ? (
            <div className="mb-4">
              <label htmlFor="funcao" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Função Trigonométrica
              </label>
              <input
                type="text"
                id="funcao"
                value={state.funcao}
                onChange={(e) => dispatch({ type: 'SET_FUNCTION', value: e.target.value })}
                className="block w-full rounded-md border border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400 p-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                placeholder="Ex: 2*sen(3*x) + 1 ou cos(x)^2"
              />
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Use funções como sen(x), cos(x), tan(x) e operadores matemáticos.
              </p>
            </div>
          ) : (
            <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="amplitude" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Amplitude (a)
                </label>
                <input
                  type="text"
                  id="amplitude"
                  value={state.amplitude}
                  onChange={(e) => dispatch({ type: 'SET_AMPLITUDE', value: e.target.value })}
                  className="block w-full rounded-md border border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400 p-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                  placeholder="Ex: 1 ou 0.5"
                />
              </div>
              
              <div>
                <label htmlFor="periodo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Período (b)
                </label>
                <input
                  type="text"
                  id="periodo"
                  value={state.period}
                  onChange={(e) => dispatch({ type: 'SET_PERIOD', value: e.target.value })}
                  className="block w-full rounded-md border border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400 p-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                  placeholder="Ex: 1 ou 2"
                />
              </div>
              
              <div>
                <label htmlFor="defasagem" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Defasagem (c)
                </label>
                <input
                  type="text"
                  id="phaseShift"
                  value={state.phaseShift}
                  onChange={(e) => dispatch({ type: 'SET_PHASE_SHIFT', value: e.target.value })}
                  className="block w-full rounded-md border border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400 p-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                  placeholder="Ex: 0 ou π/4 ou π/2"
                />
              </div>
              
              <div>
                <label htmlFor="deslocamentoVertical" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Deslocamento Vertical (d)
                </label>
                <input
                  type="text"
                  id="verticalShift"
                  value={state.verticalShift}
                  onChange={(e) => dispatch({ type: 'SET_VERTICAL_SHIFT', value: e.target.value })}
                  className="block w-full rounded-md border border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400 p-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                  placeholder="Ex: 0 ou 1"
                />
              </div>
            </div>
          )}
          
          <div className="mb-4">
            <label htmlFor="intervalo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Intervalo para o Gráfico
            </label>
            <input
              type="text"
              id="interval"
              value={state.interval}
              onChange={(e) => dispatch({ type: 'SET_INTERVAL', value: e.target.value })}
              className="block w-full rounded-md border border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400 p-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
              placeholder="Ex: 0,2π ou -π,π"
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Especifique o intervalo no formato: início,fim (use π para representar pi)
            </p>
          </div>
          
          <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md text-sm">
            <h3 className="font-bold mb-1 text-blue-800 dark:text-blue-300">Como usar esta calculadora:</h3>
            <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
              <li>Selecione o tipo de função trigonométrica (seno, cosseno, tangente ou personalizada)</li>
              <li>
                Para funções padrão, defina os parâmetros para a forma geral: 
                y = a · f(b · (x - c)) + d
              </li>
              <li>
                Para funções personalizadas, digite a expressão usando as funções trigonométricas
                (sen, cos, tan) e operadores matemáticos (+, -, *, /, ^)
              </li>
              <li>
                Você pode usar π em qualquer campo numérico (ex: π/4, 2π, etc.)
              </li>
              <li>
                Defina o intervalo do gráfico usando o formato: início,fim. Por exemplo: 
                0,2π ou -π,π
              </li>
              <li>
                Clique em "Gerar Gráfico" para visualizar e analisar a função trigonométrica
              </li>
            </ul>
          </div>
          
          <button
            onClick={handleSolve}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Gerar Gráfico
          </button>
        </div>
        
        {state.error && (
          <div className="p-3 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-md mb-4 border border-red-200 dark:border-red-800">
            {state.error}
          </div>
        )}
      </div>
      
      {state.result && state.points.length > 0 && (
        <div className="space-y-6">
          <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-5">
            <h3 className="text-lg font-medium text-green-800 dark:text-green-300 mb-2">Resultado</h3>
            <p className="text-gray-700 dark:text-gray-200 font-bold">
              {state.result}
            </p>
            
            <button 
              onClick={() => dispatch({ type: 'TOGGLE_EXPLANATION' })}
              className="mt-4 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 text-sm font-medium flex items-center"
            >
              <HiInformationCircle className="h-5 w-5 mr-1" />
              {state.showExplanation ? "Ocultar explicação detalhada" : "Mostrar explicação detalhada"}
            </button>
          </div>
          
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-5">
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center mb-4">
              <HiCalculator className="h-6 w-6 mr-2 text-indigo-600 dark:text-indigo-400" />
              Gráfico da Função
            </h3>
            
            <div className="mb-1 text-sm text-gray-600 dark:text-gray-400 italic text-center">
              Clique no gráfico para ver em tamanho maior
            </div>
            
            <div className="mb-4">
              <GraphFunction 
                height="350px" 
                onClick={() => dispatch({ type: 'TOGGLE_EXPANDED_GRAPH' })} 
              />
            </div>
          </div>
          
          {state.showExplanation && state.solutionSteps.length > 0 && (
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center">
                  <HiCalculator className="h-6 w-6 mr-2 text-indigo-600 dark:text-indigo-400" />
                  Análise passo a passo
                </h3>
              </div>
              
              {renderExplanationSteps()}
              
              <ConceitoMatematico
                title="Conceito Matemático"
                isOpen={state.showConceitoMatematico}
                onToggle={() => dispatch({ type: 'TOGGLE_CONCEITO_MATEMATICO' })}
              >
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                  <div className="flex-1">
                    <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2 border-b border-gray-200 dark:border-gray-700 pb-1">Forma Geral</h5>
                    <p className="text-gray-700 dark:text-gray-300">
                      As funções trigonométricas podem ser escritas na forma geral:
                    </p>
                    <div className="bg-white dark:bg-gray-700 p-3 rounded-md text-center border border-gray-100 dark:border-gray-600 shadow-sm my-2">
                      <span className="text-lg font-medium text-indigo-700 dark:text-indigo-300">y = a · f(b · (x - c)) + d</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
                      <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded border border-indigo-100 dark:border-indigo-700">
                        <span className="font-medium text-indigo-800 dark:text-indigo-300">a</span>: amplitude
                      </div>
                      <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded border border-indigo-100 dark:border-indigo-700">
                        <span className="font-medium text-indigo-800 dark:text-indigo-300">b</span>: fator do período
                      </div>
                      <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded border border-indigo-100 dark:border-indigo-700">
                        <span className="font-medium text-indigo-800 dark:text-indigo-300">c</span>: defasagem horizontal
                      </div>
                      <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded border border-indigo-100 dark:border-indigo-700">
                        <span className="font-medium text-indigo-800 dark:text-indigo-300">d</span>: deslocamento vertical
                      </div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2 border-b border-gray-200 dark:border-gray-700 pb-1">Períodos</h5>
                    <div className="space-y-2">
                      <div className="p-2 bg-white dark:bg-gray-700 rounded-md border border-gray-100 dark:border-gray-600 shadow-sm">
                        <span className="font-medium text-indigo-700 dark:text-indigo-300">Seno e Cosseno:</span> T = 2π/b
                      </div>
                      <div className="p-2 bg-white dark:bg-gray-700 rounded-md border border-gray-100 dark:border-gray-600 shadow-sm">
                        <span className="font-medium text-indigo-700 dark:text-indigo-300">Tangente:</span> T = π/b
                      </div>
                    </div>
                    <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2 mt-4 border-b border-gray-200 dark:border-gray-700 pb-1">Efeitos dos Parâmetros</h5>
                    <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                      <li className="p-1 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors">• Amplitude <strong>a</strong> afeta a altura da curva</li>
                      <li className="p-1 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors">• Período <strong>b</strong> afeta a "compressão" horizontal</li>
                      <li className="p-1 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors">• Defasagem <strong>c</strong> desloca a curva horizontalmente</li>
                      <li className="p-1 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors">• Deslocamento <strong>d</strong> move a curva verticalmente</li>
                    </ul>
                  </div>
                </div>
                
                <div className="mt-4">
                  <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2 border-b border-gray-200 dark:border-gray-700 pb-1">Características das Funções</h5>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="p-3 bg-white dark:bg-gray-700 rounded-md border border-gray-100 dark:border-gray-600 shadow-sm">
                      <h6 className="text-indigo-700 dark:text-indigo-300 font-medium mb-2">Seno</h6>
                      <ul className="text-sm space-y-1 list-disc pl-4 text-gray-700 dark:text-gray-300">
                        <li>Periódica, limitada entre -a e a</li>
                        <li>Antissimétrica em relação à origem</li>
                        <li>Zeros em x = nπ</li>
                        <li>Máximos em x = π/2 + 2nπ</li>
                        <li>Mínimos em x = 3π/2 + 2nπ</li>
                      </ul>
                    </div>
                    <div className="p-3 bg-white dark:bg-gray-700 rounded-md border border-gray-100 dark:border-gray-600 shadow-sm">
                      <h6 className="text-indigo-700 dark:text-indigo-300 font-medium mb-2">Cosseno</h6>
                      <ul className="text-sm space-y-1 list-disc pl-4 text-gray-700 dark:text-gray-300">
                        <li>Periódica, limitada entre -a e a</li>
                        <li>Simétrica em relação ao eixo y</li>
                        <li>Zeros em x = π/2 + nπ</li>
                        <li>Máximos em x = 2nπ</li>
                        <li>Mínimos em x = (2n+1)π</li>
                      </ul>
                    </div>
                    <div className="p-3 bg-white dark:bg-gray-700 rounded-md border border-gray-100 dark:border-gray-600 shadow-sm">
                      <h6 className="text-indigo-700 dark:text-indigo-300 font-medium mb-2">Tangente</h6>
                      <ul className="text-sm space-y-1 list-disc pl-4 text-gray-700 dark:text-gray-300">
                        <li>Periódica, não limitada</li>
                        <li>Antissimétrica em relação à origem</li>
                        <li>Assíntotas em x = π/2 + nπ</li>
                        <li>Zeros em x = nπ</li>
                        <li>Cresce rapidamente próximo às assíntotas</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-md border-l-4 border-yellow-400 dark:border-yellow-600">
                  <h5 className="font-medium text-yellow-800 dark:text-yellow-300 mb-1">Aplicações</h5>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    Funções trigonométricas e seus gráficos são essenciais em áreas como física (ondas, oscilações), 
                    engenharia elétrica (sinais AC), acústica, astronomia e em qualquer campo que envolva fenômenos periódicos.
                  </p>
                </div>
              </ConceitoMatematico>
            </div>
          )}
        </div>
      )}
      
      {state.showExpandedGraph && state.points.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-screen overflow-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">Gráfico da Função</h3>
              <button 
                onClick={() => dispatch({ type: 'TOGGLE_EXPANDED_GRAPH' })}
                className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <HiX className="h-6 w-6 text-gray-700 dark:text-gray-300" />
              </button>
            </div>
            
            <GraphFunction height="500px" />
          </div>
        </div>
      )}
    </div>
  );
};

export default ResolvedorGraficosTrigonometricos; 