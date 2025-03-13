import React, { useState } from 'react';
import { HiCalculator, HiX } from 'react-icons/hi';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine 
} from 'recharts';
import { 
  parseIntervalo, 
  formatarIntervalo, 
  gerarPontosFuncaoTrigonometrica, 
  gerarPassosExplicativosGraficos 
} from '../../utils/mathUtilsTrigonometria';

// Função auxiliar para processar valores com pi
const processPiValue = (value: string): number => {
  try {
    // Se o valor contém π ou pi, processá-lo com a função parseIntervalo
    if (value.includes('π') || value.toLowerCase().includes('pi')) {
      // Encapsular em um intervalo temporário para usar parseIntervalo
      const result = parseIntervalo(`0,${value}`);
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
      let numericInterval: [number, number];
      
      try {
        numericInterval = parseIntervalo(interval);
        
        if (numericInterval[0] >= numericInterval[1]) {
          setError('O limite inferior do intervalo deve ser menor que o limite superior.');
          return;
        }
      } catch (error) {
        setError(`Erro no intervalo: ${error instanceof Error ? error.message : String(error)}`);
        return;
      }
      
      // Gerar pontos para o gráfico
      const a = processPiValue(amplitude);
      const b = processPiValue(period);
      const c = processPiValue(phaseShift);
      const d = processPiValue(verticalShift);
      
      const pontosFuncao = gerarPontosFuncaoTrigonometrica(
        graphType,
        numericInterval,
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
      const steps = gerarPassosExplicativosGraficos(
        graphType,
        numericInterval,
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
      
      resultText += ` Intervalo: [${formatarIntervalo(numericInterval[0])}, ${formatarIntervalo(numericInterval[1])}].`;
      
      setResult(resultText);
    } catch (error) {
      console.error("Erro ao gerar gráfico:", error);
      setError(`Erro ao gerar o gráfico: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  // Função para formatar os valores do eixo X
  const formatAxisX = (valor: number) => {
    return formatarIntervalo(valor);
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
              
              <div className="space-y-4">
                {solutionSteps.map((step, index) => {
                  // Verifica se o passo começa com um padrão de número de passo como "Passo X:"
                  const stepMatch = step.match(/^(Passo \d+:)(.*)$/);
                  
                  if (stepMatch) {
                    // Se for um passo com número, extrair e destacar
                    const [_, stepNumber, stepContent] = stepMatch;
                    return (
                      <div key={index} className="p-4 bg-gray-50 rounded-md border-l-4 border-indigo-500">
                        <div className="flex flex-col sm:flex-row">
                          <span className="font-bold text-indigo-700 mr-2 mb-1 sm:mb-0">
                            {stepNumber}
                          </span>
                          <p className="text-gray-800">{stepContent}</p>
                        </div>
                      </div>
                    );
                  } else {
                    // Conteúdo sem número de passo
                    return (
                      <div key={index} className="p-3 bg-gray-50 rounded-md ml-4">
                        <p className="text-gray-800">{step}</p>
                      </div>
                    );
                  }
                })}
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-md">
                <h4 className="font-medium text-blue-800 mb-2">Conceito Matemático: Funções Trigonométricas</h4>
                <div className="space-y-2 text-gray-700">
                  <p>
                    <span className="font-semibold">Forma Geral:</span> Uma função trigonométrica pode ser representada na forma
                    y = a · f(b · (x - c)) + d, onde:
                  </p>
                  <ul className="list-disc pl-5 mt-1">
                    <li><strong>a</strong>: Amplitude - Controla a altura vertical da função</li>
                    <li><strong>b</strong>: Fator do período - Controla o comprimento horizontal (período = 2π/b para seno e cosseno, π/b para tangente)</li>
                    <li><strong>c</strong>: Defasagem - Causa deslocamento horizontal</li>
                    <li><strong>d</strong>: Deslocamento vertical - Causa deslocamento para cima ou para baixo</li>
                  </ul>
                  
                  <p className="mt-2">
                    <span className="font-semibold">Propriedades:</span>
                  </p>
                  <ul className="list-disc pl-5 mt-1">
                    <li><strong>Seno:</strong> Domínio = ℝ, Imagem = [-|a|+d, |a|+d], Período = 2π/b</li>
                    <li><strong>Cosseno:</strong> Domínio = ℝ, Imagem = [-|a|+d, |a|+d], Período = 2π/b</li>
                    <li><strong>Tangente:</strong> Domínio = {graphType === 'tangente' ? 'x ≠ (2n+1)π/2 + c' : 'x ≠ (2n+1)π/2'}, Imagem = ℝ, Período = π/b</li>
                  </ul>
                  
                  <p className="mt-2">
                    <span className="font-semibold">Aplicações:</span> Os gráficos de funções trigonométricas são usados para modelar fenômenos periódicos como:
                  </p>
                  <ul className="list-disc pl-5 mt-1">
                    <li>Ondas sonoras e eletromagnéticas</li>
                    <li>Movimentos harmônicos simples (pêndulos, molas)</li>
                    <li>Ciclos biológicos e naturais</li>
                    <li>Circuitos elétricos alternativos (AC)</li>
                    <li>Processamento de sinais e análise de Fourier</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      
      {showExpandedGraph && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4"
          onClick={() => setShowExpandedGraph(false)}
        >
          <div 
            className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-xl font-bold text-gray-800 flex items-center">
                <HiCalculator className="h-6 w-6 mr-2 text-indigo-600" />
                Gráfico Ampliado - {graphType === 'personalizado' ? funcao : `Função ${graphType}`}
              </h3>
              <button 
                onClick={() => setShowExpandedGraph(false)}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <HiX className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6 flex-grow overflow-auto">
              <GraphFunction height="70vh" />
            </div>
            <div className="border-t p-4 text-right">
              <button
                onClick={() => setShowExpandedGraph(false)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-800"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResolvedorGraficosTrigonometricos; 