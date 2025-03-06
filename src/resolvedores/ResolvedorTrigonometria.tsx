import { useState } from 'react';
import { radianosParaGraus, grausParaRadianos, arredondarParaDecimais } from '../utils/mathUtils';
import { HiCalculator } from 'react-icons/hi';

type TrigFunction = 'sin' | 'cos' | 'tan' | 'asin' | 'acos' | 'atan';
type AngleUnit = 'degrees' | 'radians';

const ResolvedorTrigonometria: React.FC = () => {
    const [trigFunction, setTrigFunction] = useState<TrigFunction>('sin');
    const [inputValue, setInputValue] = useState<string>('');
    const [inputUnit, setInputUnit] = useState<AngleUnit>('degrees');
    const [outputUnit, setOutputUnit] = useState<AngleUnit>('degrees');
    const [result, setResult] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [explanationSteps, setExplanationSteps] = useState<string[]>([]);
    const [showExplanation, setShowExplanation] = useState<boolean>(true);

    const handleSolve = () => {
        setError(null);
        setExplanationSteps([]);
        setResult(null);
       
        const value = parseFloat(inputValue);

        if (isNaN(value)) {
            setError('Por favor, insira um valor numérico válido');
            return;
        }

        const steps: string[] = [];
        let calculatedResult: number = 0;
        let stepCount = 1;

        // Para funções trigonométricas diretas (sin, cos, tan)
        if (['sin', 'cos', 'tan'].includes(trigFunction)) {
            // Converte para radianos se necessário
            let valueInRadians = value;

            if (inputUnit === 'degrees') {
                valueInRadians = grausParaRadianos(value);
                steps.push(`Passo ${stepCount}: Converter o ângulo de graus para radianos`);
                steps.push(`Para calcular funções trigonométricas, primeiro precisamos converter o ângulo para radianos, pois é a unidade padrão para cálculos matemáticos.`);
                steps.push(`Fórmula: radianos = graus × (π/180)`);
                steps.push(`${value}° = ${value} × (π/180) = ${arredondarParaDecimais(valueInRadians, 6)} radianos`);
                stepCount++;
            } else {
                valueInRadians = value;
                steps.push(`Passo ${stepCount}: Verificar a unidade do ângulo`);
                steps.push(`O valor ${value} já está em radianos, então não é necessária conversão.`);
                stepCount++;
            }

            // Calcula o resultado
            steps.push(`Passo ${stepCount}: Calcular ${trigFunction}(${inputUnit === 'degrees' ? value + '°' : value})`);
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
                        steps.push(`A tangente não está definida quando cos(x) = 0, o que ocorre em ângulos de 90°, 270°, etc.`);
                        setExplanationSteps(steps);
                        return;
                    }
                    explanation = `A tangente de um ângulo representa a razão entre o seno e o cosseno, ou entre o cateto oposto e o cateto adjacente.`;
                    calculatedResult = Math.tan(valueInRadians);
                    break;
                default:
                    setError('Função não reconhecida');
                    return;
            }
            
            steps.push(explanation);
            steps.push(`${trigFunction}(${inputUnit === 'degrees' ? value + '°' : value}) = ${arredondarParaDecimais(calculatedResult, 6)}`);
            
            // Verifica se precisa converter o resultado
            if (outputUnit === 'degrees' && ['asin', 'acos', 'atan'].includes(trigFunction)) {
                // Se for uma função inversa e o resultado estiver em radianos, converte para graus
                steps.push(`Passo ${stepCount}: Converter o resultado de radianos para graus`);
                steps.push(`${arredondarParaDecimais(calculatedResult, 6)} radianos = ${arredondarParaDecimais(calculatedResult, 6)} × (180/π) = ${arredondarParaDecimais(radianosParaGraus(calculatedResult), 6)}°`);
                stepCount++;
                calculatedResult = radianosParaGraus(calculatedResult);
            }
            
            // Verificação usando identidades
            steps.push(`Passo ${stepCount}: Verificar o resultado usando identidades trigonométricas`);
            const sinVal = trigFunction === 'sin' ? calculatedResult : Math.sin(valueInRadians);
            const cosVal = trigFunction === 'cos' ? calculatedResult : Math.cos(valueInRadians);
            
            steps.push(`Identidade fundamental: sin²(x) + cos²(x) = 1`);
            steps.push(`Verificação: sin²(${arredondarParaDecimais(valueInRadians, 4)}) + cos²(${arredondarParaDecimais(valueInRadians, 4)}) = ${arredondarParaDecimais(Math.pow(sinVal, 2) + Math.pow(cosVal, 2), 6)}`);
            
            if (trigFunction === 'tan') {
                steps.push(`Identidade da tangente: tan(x) = sin(x) / cos(x)`);
                steps.push(`Verificação: sin(${arredondarParaDecimais(valueInRadians, 4)}) / cos(${arredondarParaDecimais(valueInRadians, 4)}) = ${arredondarParaDecimais(sinVal / cosVal, 6)}`);
            }
        }
        // Para funções trigonométricas inversas (asin, acos, atan)
        else if (['asin', 'acos', 'atan'].includes(trigFunction)) {
            steps.push(`Passo ${stepCount}: Calcular ${trigFunction}(${value})`);
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
            
            steps.push(explanation);
            steps.push(`${trigFunction}(${value}) = ${arredondarParaDecimais(calculatedResult, 6)} radianos`);
            
            // Verifica se precisa converter o resultado para graus
            if (outputUnit === 'degrees') {
                const resultInDegrees = radianosParaGraus(calculatedResult);
                steps.push(`Passo ${stepCount}: Converter o resultado de radianos para graus`);
                steps.push(`Para converter de radianos para graus, multiplicamos por (180/π)`);
                steps.push(`Fórmula: graus = radianos × (180/π)`);
                steps.push(`${arredondarParaDecimais(calculatedResult, 6)} radianos = ${arredondarParaDecimais(calculatedResult, 6)} × (180/π) = ${arredondarParaDecimais(resultInDegrees, 6)}°`);
                calculatedResult = resultInDegrees;
                stepCount++;
            } else {
                steps.push(`Passo ${stepCount}: Verificar a unidade do resultado`);
                steps.push(`O resultado já está em radianos, que é a unidade solicitada.`);
                stepCount++;
            }
            
            // Verificação da função inversa
            steps.push(`Passo ${stepCount}: Verificar o resultado aplicando a função direta ao resultado`);
            const verification = trigFunction === 'asin' ? Math.sin(calculatedResult) :
                                 trigFunction === 'acos' ? Math.cos(calculatedResult) :
                                 Math.tan(calculatedResult);
            
            steps.push(`Aplicando a função direta ao resultado: ${trigFunction.substring(1)}(${arredondarParaDecimais(calculatedResult, 6)}) = ${arredondarParaDecimais(verification, 6)}`);
            steps.push(`Valor original: ${value}`);
            steps.push(`A diferença de ${arredondarParaDecimais(Math.abs(verification - value), 8)} é devido a arredondamentos.`);
        }

        setResult(arredondarParaDecimais(calculatedResult, 6));
        setExplanationSteps(steps);
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
                  type="number"
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
                  Unidade do Ângulo de Entrada
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
                  Unidade do Ângulo de Saída
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
                  
                  <div className="space-y-4">
                    {explanationSteps.map((step, index) => {
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
                    <h4 className="font-medium text-blue-800 mb-2">Conceito Matemático</h4>
                    <div className="space-y-2 text-gray-700">
                      {['sin', 'cos', 'tan'].includes(trigFunction) ? (
                        <>
                          <p>
                            <span className="font-semibold">Funções Trigonométricas:</span> Relacionam ângulos com as razões dos lados em um triângulo retângulo:
                          </p>
                          <ul className="list-disc pl-5 mt-1">
                            <li><strong>Seno (sin):</strong> Cateto oposto / Hipotenusa</li>
                            <li><strong>Cosseno (cos):</strong> Cateto adjacente / Hipotenusa</li>
                            <li><strong>Tangente (tan):</strong> Cateto oposto / Cateto adjacente (ou sin/cos)</li>
                          </ul>
                          
                          <p className="mt-2">
                            <span className="font-semibold">Domínio e Imagem:</span>
                          </p>
                          <ul className="list-disc pl-5 mt-1">
                            <li><strong>sin(x):</strong> Domínio: Todos os números reais, Imagem: [-1, 1]</li>
                            <li><strong>cos(x):</strong> Domínio: Todos os números reais, Imagem: [-1, 1]</li>
                            <li><strong>tan(x):</strong> Domínio: Todos os números reais exceto x = (n + 1/2)π, Imagem: Todos os números reais</li>
                          </ul>
                          
                          <p className="mt-2">
                            <span className="font-semibold">Aplicações:</span> As funções trigonométricas são fundamentais em:
                          </p>
                          <ul className="list-disc pl-5 mt-1">
                            <li>Física (movimento ondulatório, oscilações)</li>
                            <li>Engenharia (análise de circuitos, processamento de sinais)</li>
                            <li>Astronomia (cálculo de órbitas e posições)</li>
                            <li>Navegação (GPS, sistemas de posicionamento)</li>
                          </ul>
                        </>
                      ) : (
                        <>
                          <p>
                            <span className="font-semibold">Funções Trigonométricas Inversas:</span> Encontram o ângulo correspondente a uma razão trigonométrica:
                          </p>
                          <ul className="list-disc pl-5 mt-1">
                            <li><strong>Arco Seno (arcsin):</strong> Domínio: [-1, 1], Imagem: [-π/2, π/2] ou [-90°, 90°]</li>
                            <li><strong>Arco Cosseno (arccos):</strong> Domínio: [-1, 1], Imagem: [0, π] ou [0°, 180°]</li>
                            <li><strong>Arco Tangente (arctan):</strong> Domínio: Todos os números reais, Imagem: (-π/2, π/2) ou (-90°, 90°)</li>
                          </ul>
                          
                          <p className="mt-2">
                            <span className="font-semibold">Aplicações das Funções Inversas:</span>
                          </p>
                          <ul className="list-disc pl-5 mt-1">
                            <li>Cálculo de ângulos em geometria e trigonometria</li>
                            <li>Navegação e sistemas de orientação</li>
                            <li>Processamento de imagens e visão computacional</li>
                            <li>Robótica (cinemática inversa)</li>
                          </ul>
                          
                          <p className="mt-2">
                            <span className="font-semibold">Observação:</span> As funções trigonométricas inversas são multivalentes, mas por convenção, 
                            retornam apenas um valor específico no intervalo principal.
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      );
    };

export default ResolvedorTrigonometria;
