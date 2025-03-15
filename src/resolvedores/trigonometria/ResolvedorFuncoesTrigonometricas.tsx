import { useState } from 'react';
import { roundToDecimals } from '../../utils/mathUtils';
import { 
    radiansToDegrees, 
    degreesToRadians,
    getTrigonometricFunctionExamples
} from '../../utils/mathUtilsTrigonometria';
import { HiCalculator } from 'react-icons/hi';

type TrigFunction = 'sin' | 'cos' | 'tan' | 'asin' | 'acos' | 'atan';
type AngleUnit = 'degrees' | 'radians';

const ResolvedorFuncoesTrigonometricas: React.FC = () => {
    const [trigFunction, setTrigFunction] = useState<TrigFunction>('sin');
    const [inputValue, setInputValue] = useState<string>('');
    const [inputUnit, setInputUnit] = useState<AngleUnit>('degrees');
    const [outputUnit, setOutputUnit] = useState<AngleUnit>('degrees');
    const [result, setResult] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [explanationSteps, setExplanationSteps] = useState<string[]>([]);
    const [showExplanation, setShowExplanation] = useState<boolean>(true);

    // Função para aplicar um exemplo selecionado
    const applyExample = (example: any) => {
        setTrigFunction(example.type);
        setInputValue(example.inputValue);
        
        if (example.inputUnit) {
            setInputUnit(example.inputUnit as AngleUnit);
        }
        
        if (example.outputUnit) {
            setOutputUnit(example.outputUnit as AngleUnit);
        }
        
        // Limpar resultados anteriores
        setResult(null);
        setExplanationSteps([]);
        setError(null);
    };

    // Filtra exemplos baseados no tipo de função selecionado
    const getFilteredExamples = () => {
        return getTrigonometricFunctionExamples().filter(example => 
            example.type === trigFunction || 
            (trigFunction === 'sin' && example.type === 'asin') ||
            (trigFunction === 'cos' && example.type === 'acos') ||
            (trigFunction === 'tan' && example.type === 'atan')
        );
    };

    const handleSolve = () => {
        setError(null);
        setExplanationSteps([]);
        setResult(null);
       
        // Processar o valor da entrada para permitir expressões como π/6
        let value: number;
        try {
            // Verificar se o valor contém um símbolo de divisão
            if (inputValue.includes('/')) {
                const [numerator, denominator] = inputValue.split('/').map(part => {
                    // Substituir π por Math.PI
                    return part.trim().replace(/π|pi/gi, `${Math.PI}`);
                });
                
                // Avaliar a expressão
                value = eval(numerator) / eval(denominator);
            } else {
                // Substituir π por Math.PI para valores sem divisão
                const processedValue = inputValue.replace(/π|pi/gi, `${Math.PI}`);
                value = eval(processedValue);
            }
            
            if (isNaN(value)) {
                throw new Error('Valor inválido');
            }
        } catch (error) {
            setError('Por favor, insira um valor numérico válido ou uma expressão como π/6');
            return;
        }

        const calculationSteps: string[] = [];
        let calculatedResult: number = 0;
        let stepCount = 1;

        // Para funções trigonométricas diretas (sin, cos, tan)
        if (['sin', 'cos', 'tan'].includes(trigFunction)) {
            // Converte para radianos se necessário
            let valueInRadians = value;

            if (inputUnit === 'degrees') {
                valueInRadians = degreesToRadians(value);
                calculationSteps.push(`Passo ${stepCount}: Converter o ângulo de graus para radianos`);
                calculationSteps.push(`Para calcular funções trigonométricas, primeiro precisamos converter o ângulo para radianos, pois é a unidade padrão para cálculos matemáticos.`);
                calculationSteps.push(`Fórmula: radians = degrees × (π/180)`);
                calculationSteps.push(`${value}° = ${value} × (π/180) = ${roundToDecimals(valueInRadians, 6)} radianos`);
                stepCount++;
            } else {
                valueInRadians = value;
                calculationSteps.push(`Passo ${stepCount}: Verificar a unidade do ângulo`);
                calculationSteps.push(`O valor ${value} já está em radianos, então não é necessária conversão.`);
                stepCount++;
            }

            // Calcula o resultado
            calculationSteps.push(`Passo ${stepCount}: Calcular ${trigFunction}(${inputUnit === 'degrees' ? value + '°' : value})`);
            stepCount++;
            
            let explanation = '';
            switch (trigFunction) {
                case 'sin':
                    explanation = `O seno de um ângulo representa a razão entre o cateto oposto e a hipotenusa em um triângulo retângulo.`;
                    calculatedResult = Math.sin(valueInRadians);
                    break;
                case 'cos':
                    explanation = `O cosseno de um ângulo representa a razão entre o cateto adjacente e a hipotenusa em um triângulo retângulo.`;
                    calculatedResult = Math.cos(valueInRadians);
                    break;
                case 'tan':
                    if (Math.abs(Math.cos(valueInRadians)) < 1e-10) {
                        setError('Tangente indefinida para este ângulo (cos(x) = 0)');
                        calculationSteps.push(`A tangente é indefinida quando cos(x) = 0, o que ocorre em ângulos de 90°, 270°, etc.`);
                        setExplanationSteps(calculationSteps);
                        return;
                    }
                    explanation = `A tangente de um ângulo representa a razão entre o seno e o cosseno, ou entre o cateto oposto e o cateto adjacente.`;
                    calculatedResult = Math.tan(valueInRadians);
                    break;
                default:
                    setError('Função não reconhecida');
                    return;
            }
            
            calculationSteps.push(explanation);
            calculationSteps.push(`${trigFunction}(${inputUnit === 'degrees' ? value + '°' : value}) = ${roundToDecimals(calculatedResult, 6)}`);
            
            // Verifica se precisa converter o resultado
            if (outputUnit === 'degrees' && ['asin', 'acos', 'atan'].includes(trigFunction)) {
                // Se for uma função inversa e o resultado estiver em radianos, converte para graus
                calculationSteps.push(`Passo ${stepCount}: Converter o resultado de radianos para graus`);
                calculationSteps.push(`${roundToDecimals(calculatedResult, 6)} radianos = ${roundToDecimals(calculatedResult, 6)} × (180/π) = ${roundToDecimals(radiansToDegrees(calculatedResult), 6)}°`);
                stepCount++;
                calculatedResult = radiansToDegrees(calculatedResult);
            }
            
            // Verificação usando identidades
            calculationSteps.push(`Passo ${stepCount}: Verificar o resultado usando identidades trigonométricas`);
            const sinVal = trigFunction === 'sin' ? calculatedResult : Math.sin(valueInRadians);
            const cosVal = trigFunction === 'cos' ? calculatedResult : Math.cos(valueInRadians);
            
            calculationSteps.push(`Identidade fundamental: sin²(x) + cos²(x) = 1`);
            calculationSteps.push(`Verificação: sin²(${roundToDecimals(valueInRadians, 4)}) + cos²(${roundToDecimals(valueInRadians, 4)}) = ${roundToDecimals(Math.pow(sinVal, 2) + Math.pow(cosVal, 2), 6)}`);
            
            if (trigFunction === 'tan') {
                calculationSteps.push(`Identidade da tangente: tan(x) = sin(x) / cos(x)`);
                calculationSteps.push(`Verificação: sin(${roundToDecimals(valueInRadians, 4)}) / cos(${roundToDecimals(valueInRadians, 4)}) = ${roundToDecimals(sinVal / cosVal, 6)}`);
            }
        }
        // Para funções trigonométricas inversas (asin, acos, atan)
        else if (['asin', 'acos', 'atan'].includes(trigFunction)) {
            calculationSteps.push(`Passo ${stepCount}: Calcular ${trigFunction}(${value})`);
            stepCount++;
            
            let explanation = '';
            switch (trigFunction) {
                case 'asin':
                    if (value < -1 || value > 1) {
                        setError('O arco seno é definido apenas para valores entre -1 e 1');
                        return;
                    }
                    explanation = `O arco seno é a função inversa do seno, retornando o ângulo cujo seno é o valor dado.`;
                    calculatedResult = Math.asin(value);
                    break;
                case 'acos':
                    if (value < -1 || value > 1) {
                        setError('O arco cosseno é definido apenas para valores entre -1 e 1');
                        return;
                    }
                    explanation = `O arco cosseno é a função inversa do cosseno, retornando o ângulo cujo cosseno é o valor dado.`;
                    calculatedResult = Math.acos(value);
                    break;
                case 'atan':
                    explanation = `O arco tangente é a função inversa da tangente, retornando o ângulo cuja tangente é o valor dado.`;
                    calculatedResult = Math.atan(value);
                    break;
                default:
                    setError('Função não reconhecida');
                    return;
            }
            
            calculationSteps.push(explanation);
            calculationSteps.push(`${trigFunction}(${value}) = ${roundToDecimals(calculatedResult, 6)} radianos`);
            
            // Verifica se precisa converter o resultado para graus
            if (outputUnit === 'degrees') {
                const resultInDegrees = radiansToDegrees(calculatedResult);
                calculationSteps.push(`Passo ${stepCount}: Converter o resultado de radianos para graus`);
                calculationSteps.push(`Para converter de radianos para graus, multiplicamos por (180/π)`);
                calculationSteps.push(`Fórmula: degrees = radians × (180/π)`);
                calculationSteps.push(`${roundToDecimals(calculatedResult, 6)} radianos = ${roundToDecimals(calculatedResult, 6)} × (180/π) = ${roundToDecimals(resultInDegrees, 6)}°`);
                calculatedResult = resultInDegrees;
                stepCount++;
            } else {
                calculationSteps.push(`Passo ${stepCount}: Verificar a unidade do resultado`);
                calculationSteps.push(`O resultado já está em radianos, que é a unidade solicitada.`);
                stepCount++;
            }
            
            // Verificação da função inversa
            calculationSteps.push(`Passo ${stepCount}: Verificar o resultado aplicando a função direta ao resultado`);
            const verification = trigFunction === 'asin' ? Math.sin(calculatedResult) :
                                 trigFunction === 'acos' ? Math.cos(calculatedResult) :
                                 Math.tan(calculatedResult);
            
            calculationSteps.push(`Aplicando a função direta ao resultado: ${trigFunction.substring(1)}(${roundToDecimals(calculatedResult, 6)}) = ${roundToDecimals(verification, 6)}`);
            calculationSteps.push(`Valor original: ${value}`);
            calculationSteps.push(`A diferença de ${roundToDecimals(Math.abs(verification - value), 8)} é devido ao arredondamento.`);
        }

        setResult(roundToDecimals(calculatedResult, 6));
        setExplanationSteps(calculationSteps);
    };

    // Função para renderizar os passos de explicação com estilização aprimorada
    const renderExplanationSteps = () => {
        return (
            <div className="space-y-4">
                {explanationSteps.map((step, index) => {
                    // Verifica se o passo começa com um padrão de número de passo como "Passo X:"
                    const stepMatch = step.match(/^(Passo \d+:)(.*)$/);
                    
                    // Verifica se contém informação sobre fórmula
                    const formulaMatch = step.includes('Fórmula:') || step.includes('fundamental:') || step.includes('tangente:');
                    
                    // Verifica se é um passo de conversão
                    const conversionMatch = step.includes('Converter') || step.includes('conversão') || step.includes('convertir');
                    
                    // Verifica se é definição/explicação
                    const definitionMatch = step.includes('representa') || step.includes('é a função') || step.includes('definido');
                    
                    // Verifica se é um cálculo
                    const calculationMatch = step.includes('=') && !step.includes('Fórmula:') && !definitionMatch;
                    
                    // Verifica se é uma verificação
                    const verificationMatch = step.includes('Verificação:') || step.includes('Aplicando a função');
                    
                    if (stepMatch) {
                        // Se for um passo numerado, extrai e destaca o número
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
                    } else if (formulaMatch) {
                        // Se for uma fórmula
                        return (
                            <div key={index} className="p-3 bg-blue-50 rounded-md ml-4 border-l-2 border-blue-300">
                                <p className="text-blue-700 font-medium">{step}</p>
                            </div>
                        );
                    } else if (conversionMatch) {
                        // Se for um passo de conversão
                        return (
                            <div key={index} className="p-3 bg-purple-50 rounded-md ml-4 border-l-2 border-purple-300">
                                <p className="text-purple-700 font-medium">{step}</p>
                            </div>
                        );
                    } else if (definitionMatch) {
                        // Se for uma definição ou explicação
                        return (
                            <div key={index} className="p-3 bg-indigo-50 rounded-md ml-4 border-l-2 border-indigo-300">
                                <p className="text-indigo-700 font-medium">{step}</p>
                            </div>
                        );
                    } else if (calculationMatch) {
                        // Se for um cálculo
                        return (
                            <div key={index} className="p-3 bg-amber-50 rounded-md ml-4 border-l-2 border-amber-300">
                                <p className="text-amber-700 font-medium">{step}</p>
                            </div>
                        );
                    } else if (verificationMatch) {
                        // Se for uma verificação
                        return (
                            <div key={index} className="p-3 bg-green-50 rounded-md ml-4 border-l-2 border-green-300">
                                <p className="text-green-700 font-medium">{step}</p>
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
            <h2 className="text-2xl font-bold">Funções Trigonométricas</h2>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-8">
            <p className="text-gray-700 mb-6">
              Esta calculadora ajuda você a calcular funções trigonométricas (seno, cosseno, tangente) 
              e suas inversas (arco seno, arco cosseno, arco tangente).
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Função
                </label>
                <select
                  value={trigFunction}
                  onChange={(e) => setTrigFunction(e.target.value as TrigFunction)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="sin">Seno (sin)</option>
                  <option value="cos">Cosseno (cos)</option>
                  <option value="tan">Tangente (tan)</option>
                  <option value="asin">Arco Seno (arcsin)</option>
                  <option value="acos">Arco Cosseno (arccos)</option>
                  <option value="atan">Arco Tangente (arctan)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {['sin', 'cos', 'tan'].includes(trigFunction) ? 'Ângulo' : 'Valor'}
                </label>
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder={['sin', 'cos', 'tan'].includes(trigFunction) ? 'Digite o ângulo' : 'Digite o valor'}
                  step="any"
                />
              </div>
            </div>
            
            {['sin', 'cos', 'tan'].includes(trigFunction) && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Unidade de Ângulo da Entrada
                </label>
                <div className="flex space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      checked={inputUnit === 'degrees'}
                      onChange={() => setInputUnit('degrees')}
                      className="form-radio h-4 w-4 text-indigo-600"
                    />
                    <span className="ml-2">Graus (°)</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      checked={inputUnit === 'radians'}
                      onChange={() => setInputUnit('radians')}
                      className="form-radio h-4 w-4 text-indigo-600"
                    />
                    <span className="ml-2">Radianos (rad)</span>
                  </label>
                </div>
              </div>
            )}
            
            {['asin', 'acos', 'atan'].includes(trigFunction) && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Unidade de Ângulo da Saída
                </label>
                <div className="flex space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      checked={outputUnit === 'degrees'}
                      onChange={() => setOutputUnit('degrees')}
                      className="form-radio h-4 w-4 text-indigo-600"
                    />
                    <span className="ml-2">Graus (°)</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      checked={outputUnit === 'radians'}
                      onChange={() => setOutputUnit('radians')}
                      className="form-radio h-4 w-4 text-indigo-600"
                    />
                    <span className="ml-2">Radianos (rad)</span>
                  </label>
                </div>
              </div>
            )}
            
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
            
            <button
              onClick={handleSolve}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-md transition-colors duration-300"
            >
              Calcular
            </button>
            
            {error && (
              <div className="mt-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-md">
                {error}
              </div>
            )}
          </div>
          
          {result !== null && (
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-5">
                <h3 className="text-lg font-medium text-green-800 mb-2">Resultado</h3>
                <p className="text-xl">
                  {trigFunction}({inputValue}{['sin', 'cos', 'tan'].includes(trigFunction) && inputUnit === 'degrees' ? '°' : ''}) = <span className="font-bold">{result}{['asin', 'acos', 'atan'].includes(trigFunction) && outputUnit === 'degrees' ? '°' : ''}</span>
                </p>
                
                <button 
                    onClick={() => setShowExplanation(!showExplanation)}
                    className="mt-4 text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center"
                >
                    {showExplanation ? "Ocultar explicação detalhada" : "Mostrar explicação detalhada"}
                </button>
              </div>
              
              {showExplanation && explanationSteps.length > 0 && (
                <div className="bg-white shadow-md rounded-lg p-5">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center">
                      <HiCalculator className="h-6 w-6 mr-2 text-indigo-600" />
                      Solução passo a passo
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
                      <div className="space-y-4 text-gray-700">
                        {['sin', 'cos', 'tan'].includes(trigFunction) ? (
                          <>
                            <div className="flex flex-col md:flex-row gap-4">
                              <div className="flex-1">
                                <h5 className="font-medium text-gray-800 mb-2 border-b border-gray-200 pb-1">Definição</h5>
                                <p>
                                  <span className="font-semibold">Funções Trigonométricas:</span> Relacionam ângulos com as razões dos lados em um triângulo retângulo:
                                </p>
                                <ul className="list-disc pl-5 mt-2 space-y-2">
                                  <li className="p-1 hover:bg-blue-50 rounded transition-colors"><strong>Seno (sin):</strong> Cateto oposto / Hipotenusa</li>
                                  <li className="p-1 hover:bg-blue-50 rounded transition-colors"><strong>Cosseno (cos):</strong> Cateto adjacente / Hipotenusa</li>
                                  <li className="p-1 hover:bg-blue-50 rounded transition-colors"><strong>Tangente (tan):</strong> Cateto oposto / Cateto adjacente (ou sin/cos)</li>
                                </ul>
                              </div>
                              <div className="flex-1">
                                <h5 className="font-medium text-gray-800 mb-2 border-b border-gray-200 pb-1">Representação Visual</h5>
                                <div className="bg-white p-3 rounded-md flex justify-center border border-gray-100 shadow-sm h-40">
                                  <div className="relative w-32 h-32">
                                    {/* Triângulo retângulo simplificado */}
                                    <div className="absolute bottom-0 left-0 h-32 w-32 border-b-2 border-l-2 border-gray-700">
                                      {/* Hipotenusa */}
                                      <div className="absolute top-0 left-0 w-32 h-0.5 bg-indigo-500 origin-bottom-left rotate-[135deg] transform scale-[1.414]"></div>
                                      {/* Ângulo */}
                                      <div className="absolute bottom-0 left-0 w-6 h-6 rounded-tl-none rounded-[6px] border-t-0 border-l-0 border-r-[2px] border-b-[2px] border-gray-700"></div>
                                      {/* Textos */}
                                      <div className="absolute left-16 bottom-[-20px] text-xs">Cateto Adjacente</div>
                                      <div className="absolute top-16 left-[-70px] text-xs">Cateto<br/>Oposto</div>
                                      <div className="absolute top-[-10px] right-[-20px] text-xs text-indigo-600">Hipotenusa</div>
                                      <div className="absolute bottom-1 left-3 text-xs">θ</div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="mt-4">
                              <h5 className="font-medium text-gray-800 mb-2 border-b border-gray-200 pb-1">Domínio e Imagem</h5>
                              <ul className="mt-2 space-y-2">
                                <li className="p-2 bg-white rounded-md border border-gray-100 shadow-sm">
                                  <strong className="text-indigo-600">sin(x):</strong> Domínio: Todos os números reais, Imagem: [-1, 1]
                                </li>
                                <li className="p-2 bg-white rounded-md border border-gray-100 shadow-sm">
                                  <strong className="text-indigo-600">cos(x):</strong> Domínio: Todos os números reais, Imagem: [-1, 1]
                                </li>
                                <li className="p-2 bg-white rounded-md border border-gray-100 shadow-sm">
                                  <strong className="text-indigo-600">tan(x):</strong> Domínio: Todos os números reais exceto x = (n + 1/2)π, Imagem: Todos os números reais
                                </li>
                              </ul>
                            </div>
                            
                            <div className="mt-4 bg-yellow-50 p-3 rounded-md border-l-4 border-yellow-400">
                              <h5 className="font-medium text-yellow-800 mb-1">Aplicações</h5>
                              <ul className="list-disc pl-5 mt-1 text-gray-700">
                                <li>Física (movimento ondulatório, oscilações)</li>
                                <li>Engenharia (análise de circuitos, processamento de sinais)</li>
                                <li>Astronomia (cálculos de órbita e posição)</li>
                                <li>Navegação (GPS, sistemas de posicionamento)</li>
                              </ul>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="flex flex-col md:flex-row gap-4">
                              <div className="flex-1">
                                <h5 className="font-medium text-gray-800 mb-2 border-b border-gray-200 pb-1">Definição</h5>
                                <p>
                                  <span className="font-semibold">Funções Trigonométricas Inversas:</span> Encontram o ângulo correspondente a uma razão trigonométrica.
                                </p>
                              </div>
                              <div className="flex-1">
                                <h5 className="font-medium text-gray-800 mb-2 border-b border-gray-200 pb-1">Interpretação</h5>
                                <p>
                                  Para cada valor do seno, cosseno ou tangente, as funções inversas retornam o ângulo correspondente.
                                </p>
                              </div>
                            </div>
                            
                            <div className="mt-4">
                              <h5 className="font-medium text-gray-800 mb-2 border-b border-gray-200 pb-1">Domínio e Imagem</h5>
                              <ul className="mt-2 space-y-2">
                                <li className="p-2 bg-white rounded-md border border-gray-100 shadow-sm">
                                  <strong className="text-indigo-600">Arco Seno (arcsin):</strong> Domínio: [-1, 1], Imagem: [-π/2, π/2] ou [-90°, 90°]
                                </li>
                                <li className="p-2 bg-white rounded-md border border-gray-100 shadow-sm">
                                  <strong className="text-indigo-600">Arco Cosseno (arccos):</strong> Domínio: [-1, 1], Imagem: [0, π] ou [0°, 180°]
                                </li>
                                <li className="p-2 bg-white rounded-md border border-gray-100 shadow-sm">
                                  <strong className="text-indigo-600">Arco Tangente (arctan):</strong> Domínio: Todos os números reais, Imagem: (-π/2, π/2) ou (-90°, 90°)
                                </li>
                              </ul>
                            </div>
                            
                            <div className="mt-4 bg-yellow-50 p-3 rounded-md border-l-4 border-yellow-400">
                              <h5 className="font-medium text-yellow-800 mb-1">Aplicações</h5>
                              <ul className="list-disc pl-5 mt-1 text-gray-700">
                                <li>Cálculos de ângulos em geometria e trigonometria</li>
                                <li>Sistemas de navegação e orientação</li>
                                <li>Processamento de imagens e visão computacional</li>
                                <li>Robótica (cinemática inversa)</li>
                              </ul>
                            </div>
                            
                            <div className="p-3 bg-indigo-50 rounded-md border-l-4 border-indigo-300 mt-4">
                              <p>
                                <span className="font-semibold">Observação:</span> Funções trigonométricas são multivalentes, mas por convenção, 
                                retornam apenas um valor específico no intervalo principal.
                              </p>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      );
    };

export default ResolvedorFuncoesTrigonometricas;
