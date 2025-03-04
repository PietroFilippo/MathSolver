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
    const [showExplanation, setShowExplanation] = useState<string[]>([]);

    const handleSolve = () => {
        setError(null);
        setShowExplanation([]);
        setResult(null);
       
        const value = parseFloat(inputValue);

        if (isNaN(value)) {
            setError('Por favor, insira um valor numérico válido');
            return;
        }

        const explanationSteps: string[] = [];
        let calculatedResult: number;

        // Para funções trigonométricas diretas (sin, cos, tan)
        if (['sin', 'cos', 'tan'].includes(trigFunction)) {
            // Converte para radianos se necessário
            let valueInRadians = value;

            if (inputUnit === 'degrees') {
                valueInRadians = grausParaRadianos(value);
                explanationSteps.push(`Passo 1: Converte o ângulo de graus para radianos`);
                explanationSteps.push(`${value}° = ${value} × (π/180) = ${arredondarParaDecimais(valueInRadians, 6)} radianos`);
            } else {
                valueInRadians = value;
                explanationSteps.push(`Passo 1: O valor já está em radianos.`);
            }

            // Calcula o resultado
            explanationSteps.push(`Passo 2: Calcula ${trigFunction}(${inputUnit === 'degrees' ? value + '°' : value})`);

            switch (trigFunction) {
                case 'sin':
                    calculatedResult = Math.sin(valueInRadians);
                    break;
                case 'cos':
                    calculatedResult = Math.cos(valueInRadians);
                    break;
                case 'tan':
                    if (Math.abs(Math.cos(valueInRadians)) < 1e-10) {
                        setError('Tangente indefinida para este ângulo (cos(x) = 0)');
                        return;
                    }
                    calculatedResult = Math.tan(valueInRadians);
                    break;
                default:
                    calculatedResult = 0;
            }

            explanationSteps.push(`${trigFunction}(${inputUnit === 'degrees' ? value + '°' : value}) = ${arredondarParaDecimais(calculatedResult, 6)}`);

            // Casos especiais para ângulos comuns
            if (inputUnit == 'degrees') {
                const specialAngles = [0, 30, 45, 60, 90, 120, 135, 150, 180, 270, 360];
                const closestSpecialAngle = specialAngles.find(angle => Math.abs(angle - (value % 360)) < 0.0001);

                if (closestSpecialAngle !== undefined) {
                    explanationSteps.push(`Nota: ${value}° é um ângulo especial. O valor exato de ${trigFunction}(${closestSpecialAngle}°) pode ser expressado desta exata forma`);
                }
            }
        }
        // Para funções trigonométricas inversas (asin, acos, atan)
        else {
            // Checa as restrições de domínio
            if ((trigFunction == 'asin' || trigFunction == 'acos') && (value < -1 || value > 1)) {
                setError(`O domínio da função ${trigFunction === 'asin' ? 'arcsine' : 'arccosine'} é [-1, 1]`);
                return;
            }

            explanationSteps.push(`Passo 1: Calcula ${trigFunction}(${value})`);

            // Calcula o resultado em radianos
            switch (trigFunction) {
                case 'asin':
                    calculatedResult = Math.asin(value);
                    break;
                case 'acos':
                    calculatedResult = Math.acos(value);
                    break;
                case 'atan':
                    calculatedResult = Math.atan(value);
                    break;
                default:
                    calculatedResult = 0;
            }

            explanationSteps.push(`${trigFunction}(${value}) = ${arredondarParaDecimais(calculatedResult, 6)} radianos`);

            // Converte para graus se necessário
            if (outputUnit === 'degrees') {
                const resultInDegrees = radianosParaGraus(calculatedResult);
                explanationSteps.push(`Passo 2: Converte o resultado de radianos para graus`);
                explanationSteps.push(`${arredondarParaDecimais(calculatedResult, 6)} radianos = ${arredondarParaDecimais(calculatedResult, 6)} × (180/π) = ${arredondarParaDecimais(resultInDegrees, 6)}°`);
                calculatedResult = resultInDegrees;
            } else {
                explanationSteps.push(`Passo 2: O resultado já está em radianos`);
            }
        }

        setResult(arredondarParaDecimais(calculatedResult, 6));
        setShowExplanation(explanationSteps);
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
              </div>
              
              {showExplanation.length > 0 && (
                <div className="bg-white shadow-md rounded-lg p-5">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center">
                      <HiCalculator className="h-6 w-6 mr-2 text-indigo-600" />
                      Solução passo a passo
                    </h3>
                  </div>
                  
                  <div className="space-y-4">
                    {showExplanation.map((step, index) => {
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
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">Conceito Matemático</h4>
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
