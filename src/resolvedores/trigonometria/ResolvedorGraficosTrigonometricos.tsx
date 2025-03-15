import React, { useState } from 'react';
import { HiCalculator, HiX } from 'react-icons/hi';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine 
} from 'recharts';
import { formatInterval } from '../../utils/mathUtils';
import { 
  generateTrigonometricFunctionPoints,
  generateGraphExplanationSteps,
  parseInterval,
  getTrigonometricGraphExamples
} from '../../utils/mathUtilsTrigonometria';

// Função auxiliar para processar valores com pi
const processPiValue = (value: string): number => {
  try {
    // Se o valor contém π ou pi, processá-lo com a função parseIntervalo
    if (value.includes('π') || value.toLowerCase().includes('pi')) {
      // Encapsular em um intervalo temporário para usar parseIntervalo
      const result = parseInterval(`0,${value}`);
      return result[1]; // Retornar o segundo valor do intervalo
    }
    // Caso contrário, converter normalmente para número
    return parseFloat(value);
  } catch (error) {
    console.error("Erro ao processar valor com pi:", error);
    return parseFloat(value); // Fallback para parseFloat padrão
  }
};

const ResolvedorGraficosTrigonometricos: React.FC = () => {
  const [funcao, setFuncao] = useState<string>('');
  const [graphType, setGraphType] = useState<'seno' | 'cosseno' | 'tangente' | 'personalizado'>('seno');
  const [amplitude, setAmplitude] = useState<string>('1');
  const [period, setPeriod] = useState<string>('1');
  const [phaseShift, setPhaseShift] = useState<string>('0');
  const [verticalShift, setVerticalShift] = useState<string>('0');
  const [interval, setInterval] = useState<string>('0,2π');
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [points, setPoints] = useState<Array<{ x: number; y: number }>>([]);
  const [solutionSteps, setSolutionSteps] = useState<string[]>([]);
  const [showExplanation, setShowExplanation] = useState<boolean>(true);
  const [showExpandedGraph, setShowExpandedGraph] = useState<boolean>(false);

  // Função para aplicar um exemplo selecionado
  const applyExample = (example: any) => {
    setGraphType(example.type);
    
    if (example.type === 'personalizado' && example.funcaoPersonalizada) {
      setFuncao(example.funcaoPersonalizada);
    } else {
      // Definir parâmetros da função padrão
      setAmplitude(example.amplitude.toString());
      setPeriod(example.periodo.toString());
      setPhaseShift(example.defasagem.toString());
      setVerticalShift(example.deslocamentoVertical.toString());
    }
    
    // Definir intervalo
    if (example.interval) {
      const intervalStr = `${example.interval[0]},${example.interval[1]}`;
      setInterval(intervalStr);
    }
    
    // Limpar resultados anteriores
    setResult(null);
    setPoints([]);
    setSolutionSteps([]);
    setError(null);
  };

  // Filtra exemplos com base no tipo de gráfico selecionado
  const getFilteredExamples = () => {
    return getTrigonometricGraphExamples().filter(example => 
      example.type === graphType || example.type === 'personalizado'
    );
  };

  const handleSolve = () => {
    // Limpar resultados anteriores
    setError(null);
    setResult(null);
    setPoints([]);
    setSolutionSteps([]);
    setShowExpandedGraph(false);
    
    try {
      // Validar parâmetros com base no tipo de gráfico
      if (graphType === 'personalizado') {
        // Validar função personalizada
        if (!funcao.trim()) {
          setError('Por favor, insira uma função trigonométrica.');
          return;
        }
        
        // Melhorar a expressão regular para detectar funções trigonométricas
        // const temFuncaoTrig = /\b(sen|cos|tan|cot|sec|csc|sin|tg|cotg)\b/i.test(funcao);
        // const temFuncaoTrig = /(\d*)?\s*(sen|cos|tan|cot|sec|csc|sin|tg|cotg)\s*(\^*\d*)?\s*\(/i.test(funcao);
        
        // Nova expressão regular melhorada para detectar funções trigonométricas em expressões complexas
        const temFuncaoTrig = /(\d+)?(sen|cos|tan|cot|sec|csc|sin|tg|cotg)(\^?\d+)?\s*\(/i.test(funcao) || 
                             /\b(sen|cos|tan|cot|sec|csc|sin|tg|cotg)(\^?\d+)?\s*\(/i.test(funcao);
        
        if (!temFuncaoTrig) {
          setError('Sua entrada deve conter pelo menos uma função trigonométrica (sen, cos, tan, etc.).');
          return;
        }
      } else {
        // Validar parâmetros para funções pré-definidas
        try {
          // Processar valores que podem conter π
          const a = processPiValue(amplitude);
          const b = processPiValue(period);
          const c = processPiValue(phaseShift);
          const d = processPiValue(verticalShift);
          
          if (isNaN(a) || isNaN(b) || isNaN(c) || isNaN(d)) {
            setError('Por favor, insira valores numéricos válidos para os parâmetros.');
            return;
          }
          
          if (b === 0) {
            setError('O período não pode ser zero.');
            return;
          }
        } catch (error) {
          setError(`Erro ao processar parâmetros: ${error instanceof Error ? error.message : String(error)}`);
          return;
        }
      }
      
      // Verificar e processar o intervalo
      let [start, end] = parseInterval(interval);
      
      if (start >= end) {
        setError('O limite inferior do intervalo deve ser menor que o limite superior.');
        return;
      }
      
      // Gerar pontos para o gráfico
      const a = processPiValue(amplitude);
      const b = processPiValue(period);
      const c = processPiValue(phaseShift);
      const d = processPiValue(verticalShift);
      
      const pontosFuncao = generateTrigonometricFunctionPoints(
        graphType,
        [start, end],
        a,
        b,
        c,
        d,
        funcao
      );
      
      if (pontosFuncao.length === 0) {
        setError('Não foi possível gerar pontos para esta função no intervalo especificado.');
        return;
      }
      
      // Gerar passos explicativos
      const steps = generateGraphExplanationSteps(
        graphType,
        [start, end],
        a,
        b,
        c,
        d,
        funcao
      );
      
      // Definir resultado e pontos
      setPoints(pontosFuncao);
      setSolutionSteps(steps);
      
      // Formatar o texto do resultado
      let resultText = `Gráfico da função ${graphType === 'personalizado' ? funcao : graphType} gerado com sucesso.`;
      
      if (graphType !== 'personalizado') {
        resultText += ` Parâmetros: Amplitude=${a}, Período=${b}, Defasagem=${c}, Deslocamento Vertical=${d}.`;
      }
      
      resultText += ` Intervalo: [${formatInterval(start)}, ${formatInterval(end)}].`;
      
      setResult(resultText);
    } catch (error) {
      console.error("Erro ao gerar gráfico:", error);
      setError(`Erro ao gerar o gráfico: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  // Função para formatar os valores do eixo X
  const formatAxisX = (valor: number) => {
    return formatInterval(valor);
  };

  // Função para obter domínio do eixo Y (min e max)
  const obtainDomainY = (): [number, number] => {
    if (points.length === 0) {
      return [-2, 2]; // Valores padrão
    }
    
    let min = Number.MAX_VALUE;
    let max = Number.MIN_VALUE;
    
    points.forEach(point => {
      if (point.y < min) min = point.y;
      if (point.y > max) max = point.y;
    });
    
    // Adicionar margem de 10%
    const margin = (max - min) * 0.1;
    
    // Em funções como seno e cosseno, é melhor ter o eixo Y simétrico
    if (graphType === 'seno' || graphType === 'cosseno') {
      const absMax = Math.max(Math.abs(min), Math.abs(max));
      return [-absMax - margin, absMax + margin];
    }
    
    return [min - margin, max + margin];
  };

  // Componente do gráfico para reutilização
  const GraphFunction = ({ height, widthPercentage = "100%", onClick = undefined }: { height: string, widthPercentage?: string, onClick?: () => void }) => (
    <div 
      className={`${onClick ? 'cursor-pointer hover:shadow-lg transition-shadow duration-300' : ''}`} 
      onClick={onClick}
      style={{ height: height, width: widthPercentage }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={points}
          margin={{
            top: 20,
            right: 30,
            left: 50,
            bottom: 20,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="x" 
            domain={['dataMin', 'dataMax']} 
            tickFormatter={formatAxisX}
            label={{ value: 'x', position: 'insideBottomRight', offset: -10 }}
          />
          <YAxis 
            domain={obtainDomainY()}
            label={{ value: 'f(x)', angle: -90, position: 'insideLeft' }}
            tickFormatter={(value) => value.toFixed(2)}
            width={60}
          />
          <Tooltip 
            formatter={(value: number) => [value.toFixed(4), 'f(x)']}
            labelFormatter={(label: number) => `x = ${formatAxisX(label)}`}
          />
          <ReferenceLine y={0} stroke="#000" strokeWidth={1.5} />
          <ReferenceLine x={0} stroke="#000" strokeWidth={1.5} />
          <Line 
            type="monotone" 
            dataKey="y" 
            stroke="#8884d8" 
            dot={false} 
            isAnimationActive={true} 
            name="f(x)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );

  // Função para renderizar os passos de explicação com estilização aprimorada
  const renderExplanationSteps = () => {
    return (
      <div className="space-y-4">
        {solutionSteps.map((step, index) => {
          // Verifica se o passo começa com "Passo X:"
          const stepMatch = step.match(/^(Passo \d+:)(.*)$/);
          
          // Verifica se contém informações sobre a função
          const functionMatch = step.includes('Função básica:') || step.includes('Função completa:') || step.includes('Expressão:');
          
          // Verifica se contém informações sobre o intervalo
          const intervalMatch = step.includes('Intervalo selecionado:');
          
          // Verifica se contém informações sobre assíntotas
          const asymptoticMatch = step.includes('Assíntotas no intervalo:') || step.includes('assíntotas verticais');
          
          // Verifica se contém informações sobre amplitude
          const amplitudeMatch = step.includes('Amplitude:');
          
          // Verifica se contém informações sobre período
          const periodMatch = step.includes('Período:');
          
          // Verifica se contém informações sobre defasagem
          const phaseMatch = step.includes('Defasagem:');
          
          // Verifica se contém informações sobre deslocamento vertical
          const shiftMatch = step.includes('Deslocamento vertical:');
          
          // Verifica se contém informações sobre zeros
          const zerosMatch = step.includes('Zeros da função');
          
          // Verifica se contém informações sobre máximos/mínimos
          const extremaMatch = step.includes('Valores máximos') || step.includes('Valores mínimos');
          
          if (stepMatch) {
            // Se for um passo numerado, extrai e destaca o número
            const [_, stepNumber, stepContent] = stepMatch;
            return (
              <div key={index} className="p-4 bg-gray-50 rounded-md border-l-4 border-indigo-500">
                <div className="flex flex-col sm:flex-row">
                  <span className="font-bold text-indigo-700 mr-2 mb-1 sm:mb-0">{stepNumber}</span>
                  <p className="text-gray-800">{stepContent}</p>
                </div>
              </div>
            );
          } else if (functionMatch) {
            return (
              <div key={index} className="p-3 bg-blue-50 rounded-md ml-4 border-l-2 border-blue-300">
                <p className="text-blue-700 font-medium">{step}</p>
              </div>
            );
          } else if (intervalMatch) {
            return (
              <div key={index} className="p-3 bg-purple-50 rounded-md ml-4 border-l-2 border-purple-300">
                <p className="text-purple-700 font-medium">{step}</p>
              </div>
            );
          } else if (asymptoticMatch) {
            return (
              <div key={index} className="p-3 bg-red-50 rounded-md ml-4 border-l-2 border-red-300">
                <p className="text-red-700 font-medium">{step}</p>
              </div>
            );
          } else if (amplitudeMatch || periodMatch || phaseMatch || shiftMatch) {
            return (
              <div key={index} className="p-3 bg-indigo-50 rounded-md ml-4 border-l-2 border-indigo-300">
                <p className="text-indigo-700 font-medium">{step}</p>
              </div>
            );
          } else if (zerosMatch) {
            return (
              <div key={index} className="p-3 bg-green-50 rounded-md ml-4 border-l-2 border-green-300">
                <p className="text-green-700 font-medium">{step}</p>
              </div>
            );
          } else if (extremaMatch) {
            return (
              <div key={index} className="p-3 bg-amber-50 rounded-md ml-4 border-l-2 border-amber-300">
                <p className="text-amber-700 font-medium">{step}</p>
              </div>
            );
          } else {
            // Outros passos
            return (
              <div key={index} className="p-3 bg-gray-50 rounded-md ml-4">
                <p className="text-gray-800">{step}</p>
              </div>
            );
          }
        })}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <HiCalculator className="h-6 w-6 text-indigo-600 mr-2" />
        <h2 className="text-2xl font-bold">Gráficos de Funções Trigonométricas</h2>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-8">
        <p className="text-gray-700 mb-6">
          Esta calculadora ajuda você a gerar e analisar gráficos de funções trigonométricas, como seno, cosseno e tangente,
          bem como funções personalizadas que combinam várias funções trigonométricas.
        </p>
        
        <div className="mb-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Função</label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio"
                  checked={graphType === 'seno'}
                  onChange={() => setGraphType('seno')}
                />
                <span className="ml-2">Seno</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio"
                  checked={graphType === 'cosseno'}
                  onChange={() => setGraphType('cosseno')}
                />
                <span className="ml-2">Cosseno</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio"
                  checked={graphType === 'tangente'}
                  onChange={() => setGraphType('tangente')}
                />
                <span className="ml-2">Tangente</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio"
                  checked={graphType === 'personalizado'}
                  onChange={() => setGraphType('personalizado')}
                />
                <span className="ml-2">Personalizado</span>
              </label>
            </div>
          </div>
          
          {/* Exemplos */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Exemplos
            </label>
            <div className="flex flex-wrap gap-2 mb-4">
              {getFilteredExamples().map((exemplo, index) => (
                <button
                  key={index}
                  onClick={() => applyExample(exemplo)}
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-full transition-colors"
                >
                  {exemplo.description}
                </button>
              ))}
            </div>
          </div>
          
          {graphType === 'personalizado' ? (
            <div className="mb-4">
              <label htmlFor="funcao" className="block text-sm font-medium text-gray-700 mb-1">
                Função Trigonométrica
              </label>
              <input
                type="text"
                id="funcao"
                value={funcao}
                onChange={(e) => setFuncao(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                placeholder="Ex: 2*sen(3*x) + 1 ou cos(x)^2"
              />
              <p className="text-sm text-gray-500 mt-1">
                Use funções como sen(x), cos(x), tan(x) e operadores matemáticos.
              </p>
            </div>
          ) : (
            <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="amplitude" className="block text-sm font-medium text-gray-700 mb-1">
                  Amplitude (a)
                </label>
                <input
                  type="text"
                  id="amplitude"
                  value={amplitude}
                  onChange={(e) => setAmplitude(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                  placeholder="Ex: 1 ou 0.5"
                />
              </div>
              
              <div>
                <label htmlFor="periodo" className="block text-sm font-medium text-gray-700 mb-1">
                  Período (b)
                </label>
                <input
                  type="text"
                  id="periodo"
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                  placeholder="Ex: 1 ou 2"
                />
              </div>
              
              <div>
                <label htmlFor="defasagem" className="block text-sm font-medium text-gray-700 mb-1">
                  Defasagem (c)
                </label>
                <input
                  type="text"
                  id="phaseShift"
                  value={phaseShift}
                  onChange={(e) => setPhaseShift(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                  placeholder="Ex: 0 ou π/4 ou π/2"
                />
              </div>
              
              <div>
                <label htmlFor="deslocamentoVertical" className="block text-sm font-medium text-gray-700 mb-1">
                  Deslocamento Vertical (d)
                </label>
                <input
                  type="text"
                  id="verticalShift"
                  value={verticalShift}
                  onChange={(e) => setVerticalShift(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                  placeholder="Ex: 0 ou 1"
                />
              </div>
            </div>
          )}
          
          <div className="mb-4">
            <label htmlFor="intervalo" className="block text-sm font-medium text-gray-700 mb-1">
              Intervalo para o Gráfico
            </label>
            <input
              type="text"
              id="interval"
              value={interval}
              onChange={(e) => setInterval(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
              placeholder="Ex: 0,2π ou -π,π"
            />
            <p className="text-sm text-gray-500 mt-1">
              Especifique o intervalo no formato: início,fim (use π para representar pi)
            </p>
          </div>
          
          <div className="mb-4 p-3 bg-blue-50 rounded-md text-sm">
            <h3 className="font-bold mb-1">Como usar esta calculadora:</h3>
            <ul className="list-disc pl-5 space-y-1">
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
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Gerar Gráfico
          </button>
        </div>
        
        {error && (
          <div className="p-3 bg-red-100 text-red-700 rounded-md mb-4">
            {error}
          </div>
        )}
      </div>
      
      {result && points.length > 0 && (
        <div className="space-y-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-5">
            <h3 className="text-lg font-medium text-green-800 mb-2">Resultado</h3>
            <p className="text-gray-700 font-bold">
              {result}
            </p>
            
            <button 
              onClick={() => setShowExplanation(!showExplanation)}
              className="mt-4 text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center"
            >
              {showExplanation ? "Ocultar explicação detalhada" : "Mostrar explicação detalhada"}
            </button>
          </div>
          
          <div className="bg-white shadow-md rounded-lg p-5">
            <h3 className="text-xl font-bold text-gray-800 flex items-center mb-4">
              <HiCalculator className="h-6 w-6 mr-2 text-indigo-600" />
              Gráfico da Função
            </h3>
            
            <div className="mb-1 text-sm text-gray-600 italic text-center">
              Clique no gráfico para ver em tamanho maior
            </div>
            
            <div className="mb-4">
              <GraphFunction 
                height="350px" 
                onClick={() => setShowExpandedGraph(true)} 
              />
            </div>
          </div>
          
          {showExplanation && solutionSteps.length > 0 && (
            <div className="bg-white shadow-md rounded-lg p-5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800 flex items-center">
                  <HiCalculator className="h-6 w-6 mr-2 text-indigo-600" />
                  Análise passo a passo
                </h3>
              </div>
              
              {renderExplanationSteps()}
              
              <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100 overflow-hidden">
                <div className="px-4 py-3 bg-blue-100 border-b border-blue-200">
                  <h4 className="font-semibold text-blue-800 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Conceito Matemático
                  </h4>
                </div>
                <div className="p-4">
                  <div className="flex flex-col md:flex-row gap-4 mb-4">
                    <div className="flex-1">
                      <h5 className="font-medium text-gray-800 mb-2 border-b border-gray-200 pb-1">Forma Geral</h5>
                      <p className="text-gray-700">
                        As funções trigonométricas podem ser escritas na forma geral:
                      </p>
                      <div className="bg-white p-3 rounded-md text-center border border-gray-100 shadow-sm my-2">
                        <span className="text-lg font-medium text-indigo-700">y = a · f(b · (x - c)) + d</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
                        <div className="p-2 bg-indigo-50 rounded border border-indigo-100">
                          <span className="font-medium text-indigo-800">a</span>: amplitude
                        </div>
                        <div className="p-2 bg-indigo-50 rounded border border-indigo-100">
                          <span className="font-medium text-indigo-800">b</span>: fator do período
                        </div>
                        <div className="p-2 bg-indigo-50 rounded border border-indigo-100">
                          <span className="font-medium text-indigo-800">c</span>: defasagem horizontal
                        </div>
                        <div className="p-2 bg-indigo-50 rounded border border-indigo-100">
                          <span className="font-medium text-indigo-800">d</span>: deslocamento vertical
                        </div>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h5 className="font-medium text-gray-800 mb-2 border-b border-gray-200 pb-1">Períodos</h5>
                      <div className="space-y-2">
                        <div className="p-2 bg-white rounded-md border border-gray-100 shadow-sm">
                          <span className="font-medium text-indigo-700">Seno e Cosseno:</span> T = 2π/b
                        </div>
                        <div className="p-2 bg-white rounded-md border border-gray-100 shadow-sm">
                          <span className="font-medium text-indigo-700">Tangente:</span> T = π/b
                        </div>
                      </div>
                      <h5 className="font-medium text-gray-800 mb-2 mt-4 border-b border-gray-200 pb-1">Efeitos dos Parâmetros</h5>
                      <ul className="space-y-1 text-sm">
                        <li className="p-1 hover:bg-blue-50 rounded transition-colors">• Amplitude <strong>a</strong> afeta a altura da curva</li>
                        <li className="p-1 hover:bg-blue-50 rounded transition-colors">• Período <strong>b</strong> afeta a "compressão" horizontal</li>
                        <li className="p-1 hover:bg-blue-50 rounded transition-colors">• Defasagem <strong>c</strong> desloca a curva horizontalmente</li>
                        <li className="p-1 hover:bg-blue-50 rounded transition-colors">• Deslocamento <strong>d</strong> move a curva verticalmente</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h5 className="font-medium text-gray-800 mb-2 border-b border-gray-200 pb-1">Características das Funções</h5>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="p-3 bg-white rounded-md border border-gray-100 shadow-sm">
                        <h6 className="text-indigo-700 font-medium mb-2">Seno</h6>
                        <ul className="text-sm space-y-1 list-disc pl-4">
                          <li>Periódica, limitada entre -a e a</li>
                          <li>Antissimétrica em relação à origem</li>
                          <li>Zeros em x = nπ</li>
                          <li>Máximos em x = π/2 + 2nπ</li>
                          <li>Mínimos em x = 3π/2 + 2nπ</li>
                        </ul>
                      </div>
                      <div className="p-3 bg-white rounded-md border border-gray-100 shadow-sm">
                        <h6 className="text-indigo-700 font-medium mb-2">Cosseno</h6>
                        <ul className="text-sm space-y-1 list-disc pl-4">
                          <li>Periódica, limitada entre -a e a</li>
                          <li>Simétrica em relação ao eixo y</li>
                          <li>Zeros em x = π/2 + nπ</li>
                          <li>Máximos em x = 2nπ</li>
                          <li>Mínimos em x = (2n+1)π</li>
                        </ul>
                      </div>
                      <div className="p-3 bg-white rounded-md border border-gray-100 shadow-sm">
                        <h6 className="text-indigo-700 font-medium mb-2">Tangente</h6>
                        <ul className="text-sm space-y-1 list-disc pl-4">
                          <li>Periódica, não limitada</li>
                          <li>Antissimétrica em relação à origem</li>
                          <li>Assíntotas em x = π/2 + nπ</li>
                          <li>Zeros em x = nπ</li>
                          <li>Cresce rapidamente próximo às assíntotas</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 bg-yellow-50 p-3 rounded-md border-l-4 border-yellow-400">
                    <h5 className="font-medium text-yellow-800 mb-1">Aplicações</h5>
                    <p className="text-gray-700 text-sm">
                      Funções trigonométricas e seus gráficos são essenciais em áreas como física (ondas, oscilações), 
                      engenharia elétrica (sinais AC), acústica, astronomia e em qualquer campo que envolva fenômenos periódicos.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      
      {showExpandedGraph && points.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-screen overflow-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Gráfico da Função</h3>
              <button 
                onClick={() => setShowExpandedGraph(false)}
                className="p-1 rounded-full hover:bg-gray-200"
              >
                <HiX className="h-6 w-6" />
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