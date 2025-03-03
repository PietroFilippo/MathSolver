import { useState } from 'react';
import { arredondarParaDecimais } from '../utils/mathUtils';
import { HiCalculator } from 'react-icons/hi';

type LogType = 'natural' | 'base10' | 'custom';

const ResolvedorLogaritmo: React.FC = () => {
    const [logType, setLogType] = useState<LogType>('natural');
    const [value, setValue] = useState<string>('');
    const [customBase, setCustomBase] = useState<string>('');
    const [result, setResult] = useState<number | null>(null);
    const [steps, setSteps] = useState<string[]>([]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [showExplanation, setShowExplanation] = useState<boolean>(false);

    const handleSolve = () => {
      setErrorMessage(null);
      setResult(null);
      setSteps([]);
      setShowExplanation(false);

      const numValue = parseFloat(value);

      if (isNaN(numValue)) {
        setErrorMessage('Insira um número válido');
        return;
      }

      if (numValue <= 0) {
        setErrorMessage('O logaritmo é definido apenas para números positivos');
        return;
      }

      const calculationSteps: string[] = [];
      let calculatedResult = 0;

      if (logType === 'natural') {
        calculationSteps.push(`Passo 1: Calcular o logaritmo natural (base e) de ${numValue}`);
        calculatedResult = Math.log(numValue);
        calculationSteps.push(`ln(${numValue}) = ${arredondarParaDecimais(calculatedResult, 6)}`);
      }
      else if (logType === 'base10') {
        calculationSteps.push(`Passo 1: Calcular o logaritmo comum (base 10) de ${numValue}`);
        calculatedResult = Math.log10(numValue);
        calculationSteps.push(`log₁₀(${numValue}) = ${arredondarParaDecimais(calculatedResult, 6)}`);
      }
      else if (logType === 'custom') {
        const numBase = parseFloat(customBase);

        if (isNaN(numBase)) {
            setErrorMessage('A base personalizada deve ser um número válido.');
            return;
        }

        if (numBase <= 0 || numBase === 1) {
            setErrorMessage('A base personalizada deve ser um número positivo e diferente de 1.');
            return;
        }

        calculationSteps.push(`Passo 1: Calcular o logaritmo com a base personalizada ${numBase} de ${numValue}`);
        calculationSteps.push('Podemos usar a fórmula de mudança de base: log_b(x) = ln(x) / ln(b)');

        const lnValue = Math.log(numValue);
        const lnBase = Math.log(numBase);
        calculatedResult = lnValue / lnBase;

        calculationSteps.push(`log_${numBase}(${numValue}) = ln(${numValue}) / ln(${numBase})`);
        calculationSteps.push(`log_${numBase}(${numValue}) = ${arredondarParaDecimais(lnValue, 6)} / ${arredondarParaDecimais(lnBase, 6)} = ${arredondarParaDecimais(calculatedResult, 6)}`);
      }
      
      // Casos e propriedades especiais 
      if (numValue === 1) {
        calculationSteps.push('O logaritmo de 1 em qualquer base é 0');
      }

      if (logType === 'base10') {
        if (numValue === 10) {
            calculationSteps.push('log₁₀(10) = 1 porque 10¹ = 10.');
        }
        else if (numValue === 100) {
            calculationSteps.push('log₁₀(100) = 2 porque 10² = 100.');
        }
        else if (numValue === 1000) {
            calculationSteps.push('log₁₀(1000) = 3 porque 10³ = 1000.');
        }
      } else if (logType === 'natural') {
        if (Math.abs(numValue - Math.E) < 0.0001) {
            calculationSteps.push('ln(e) = 1 porque e¹ = e.');
        }
      }
    
      calculationSteps.push('Passo 2: Verificar o resultado usando a definição de logaritmo');

      if (logType === 'natural') {
        calculationSteps.push(`Se ln(${numValue}) = ${arredondarParaDecimais(calculatedResult, 6)}, então e^(${arredondarParaDecimais(calculatedResult, 6)}) deve ser igual a ${numValue}`);
        const verification = Math.exp(calculatedResult);
        calculationSteps.push(`e^${arredondarParaDecimais(calculatedResult, 6)} = ${arredondarParaDecimais(verification, 6)} ≈ ${numValue}`);
      } else if (logType === 'base10') {
        calculationSteps.push(`Se log₁₀(${numValue}) = ${arredondarParaDecimais(calculatedResult, 6)}, então 10^(${arredondarParaDecimais(calculatedResult, 6)}) deve ser igual a ${numValue}`);
        const verification = Math.pow(10, calculatedResult);
        calculationSteps.push(`10^${arredondarParaDecimais(calculatedResult, 6)} = ${arredondarParaDecimais(verification, 6)} ≈ ${numValue}`);
      } else if (logType === 'custom') {
        const numBase = parseFloat(customBase);
        calculationSteps.push(`Se log_${numBase}(${numValue}) = ${arredondarParaDecimais(calculatedResult, 6)}, então ${numBase}^(${arredondarParaDecimais(calculatedResult, 6)}) deve ser igual a ${numValue}`);
        const verification = Math.pow(numBase, calculatedResult);
        calculationSteps.push(`${numBase}^${arredondarParaDecimais(calculatedResult, 6)} = ${arredondarParaDecimais(verification, 6)} ≈ ${numValue}`);
      }

      setResult(arredondarParaDecimais(calculatedResult, 6));
      setSteps(calculationSteps);
      setShowExplanation(true);
    };

    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <HiCalculator className="h-6 w-6 text-indigo-600 mr-2" />
          <h2 className="text-2xl font-bold">Calculadora de Logaritmos</h2>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-8">
            <p className="text-gray-700 mb-6">
                Essa calculadora ajuda a resolver problemas de logaritmos de diferentes bases.
                O logaritmo de um número é o expoente ao qual uma base deve ser elevada para produzir esse número.
            </p>

            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de logaritmo:
                </label>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                    <label className="inline-flex items-center">
                        <input
                            type="radio"
                            className="form-radio h-4 w-4 text-indigo-600"
                            checked={logType === 'natural'}
                            onChange={() => setLogType('natural')}
                        />
                        <span className="ml-2">Logaritmo natural (ln, base e)</span>
                    </label>
                    <label className="inline-flex items-center">
                        <input
                            type="radio"
                            className="form-radio h-4 w-4 text-indigo-600"
                            checked={logType === 'base10'}
                            onChange={() => setLogType('base10')}
                        />
                        <span className="ml-2">Logaritmo comum (log₁₀, base 10)</span>
                    </label>
                    <label className="inline-flex items-center">
                        <input
                            type="radio"
                            className="form-radio h-4 w-4 text-indigo-600"
                            checked={logType === 'custom'}
                            onChange={() => setLogType('custom')}
                        />
                        <span className="ml-2">Logaritmo personalizado</span>
                    </label>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Valor
                    </label>
                    <input
                        type="number"
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Digite um valor positivo"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        step="any"
                    />
                </div>

                {logType === 'custom' && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Base
                        </label>
                        <input
                            type="number"
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Digite uma base positiva e diferente de 1"
                            value={customBase}
                            onChange={(e) => setCustomBase(e.target.value)}
                            step="any"
                        />
                    </div>
                )}
            </div>

            <button
                onClick={handleSolve}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-md transition-colors duration-300 mt-4"
            >
                Calcular
            </button>

            {errorMessage && (
                <div className="mt-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-md">
                    {errorMessage}
                </div>
            )}
        </div>

        {result !== null && (
            <div className="space-y-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-5">
                    <h3 className="text-lg font-medium text-green-800 mb-2">Resultado</h3>
                    <p className="text-xl">
                        {logType === 'natural' && `ln(${value})`}
                        {logType === 'base10' && `log₁₀(${value})`}
                        {logType === 'custom' && `log_${customBase}(${value})`}
                        {' = '}
                        <span className="font-bold">{result}</span>
                    </p>
                </div>

                {showExplanation && (
                    <div className="bg-white shadow-md rounded-lg p-5">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium text-blue-800 mb-3">Solução passo a passo</h3>
                        </div>
                        
                        <div className="space-y-4">
                            {steps.map((step, index) => (
                                <div key={index} className="p-3 bg-gray-50 rounded-md">
                                    <p className="text-gray-800">{step}</p>
                                </div>
                            ))}
                        </div>
                        
                        <div className="mt-6 p-4 bg-blue-50 rounded-md">
                            <h4 className="font-medium text-blue-800 mb-2">Conceito Matemático</h4>
                            <p className="text-gray-700 mb-2"><strong>Propriedades dos Logaritmos:</strong></p>
                            <ul className="list-disc list-inside mt-2 space-y-1 text-gray-700">
                                <li>log_b(xy) = log_b(x) + log_b(y)</li>
                                <li>log_b(x/y) = log_b(x) - log_b(y)</li>
                                <li>log_b(x^k) = n * log_b(x)</li>
                                <li>log_b(1) = 0</li>
                                <li>log_b(b) = 1</li>
                                <li>b^log_b(x) = x</li>
                                <li>log_a(x) = log_b(x) / log_b(a) (fórmula de mudança de base)</li>
                            </ul>

                            <p className="mt-3 text-gray-700">
                                <strong>Aplicações de Logaritmos:</strong> Logaritmos são amplamente utilizados em diversas áreas, como:
                            </p>
                            <ul className="list-disc list-inside mt-2 space-y-1 text-gray-700">
                                <li>Resolução de equações exponenciais</li>
                                <li>Calcular quantidades que variam a longas escalas (pH, decibéis, escala Richter)</li>
                                <li>Análise de crescimento exponencial (crescimento populacional, juros compostos)</li>
                                <li>Teoria da informação e compactação de dados</li>
                                <li>Estatística e probabilidade (funções de verossimilhança logarítmica)</li>
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        )}
      </div>
    );
};

export default ResolvedorLogaritmo;
