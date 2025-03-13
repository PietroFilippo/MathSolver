import React, { useState, ReactNode } from 'react';
import { HiCalculator } from 'react-icons/hi';
import { mdc } from '../../utils/mathUtils';
import { simplificarFracao, FractionDisplay } from '../../utils/mathUtilsFracoes';

type Operation = 'multiply' | 'divide';

const ResolvedorMultDivFracao: React.FC = () => {
  const [numerator1, setNumerator1] = useState<string>('');
  const [denominator1, setDenominator1] = useState<string>('');
  const [numerator2, setNumerator2] = useState<string>('');
  const [denominator2, setDenominator2] = useState<string>('');
  const [operation, setOperation] = useState<Operation>('multiply');
  const [resultadoNum, setResultadoNum] = useState<number | null>(null);
  const [resultadoDen, setResultadoDen] = useState<number | null>(null);
  const [resultado, setResultado] = useState(false);
  const [steps, setSteps] = useState<(string | ReactNode)[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [showExplanation, setShowExplanation] = useState<boolean>(false);

  const handleSolve = () => {
    // Resetar os valores anteriores e erros
    setResultado(false);
    setSteps([]);
    setErrorMessage('');
    setShowExplanation(false);
    
    const num1 = parseInt(numerator1);
    const den1 = parseInt(denominator1);
    const num2 = parseInt(numerator2);
    const den2 = parseInt(denominator2);
    
    // Validação de inputs
    if (isNaN(num1) || isNaN(den1) || isNaN(num2) || isNaN(den2)) {
      setErrorMessage('Por favor, preencha todos os campos com valores numéricos.');
      return;
    }
    
    if (den1 === 0 || den2 === 0) {
      setErrorMessage('O denominador não pode ser zero.');
      return;
    }
    
    if (operation === 'divide' && num2 === 0) {
      setErrorMessage('Não é possível dividir por zero.');
      return;
    }
    
    // Cálculos com base na operação selecionada
    let resultNumerator: number;
    let resultDenominator: number;
    
    if (operation === 'multiply') {
      resultNumerator = num1 * num2;
      resultDenominator = den1 * den2;
    } else { // divide
      resultNumerator = num1 * den2;
      resultDenominator = den1 * num2;
    }
    
    // Simplificar a fração resultante
    const simplified = simplificarFracao(resultNumerator, resultDenominator);
    const simplifiedNum = simplified.numerador;
    const simplifiedDen = simplified.denominador;
    
    setResultadoNum(simplifiedNum);
    setResultadoDen(simplifiedDen);
    setResultado(true);
    setShowExplanation(true);
    
    // Gerar os passos da explicação
    const calculationSteps = [];
    let stepCount = 1;
    
    calculationSteps.push(`Passo ${stepCount}: Identificar as frações e a operação`);
    calculationSteps.push(<>
        {operation === 'multiply' ? (
            <>Multiplicação: <FractionDisplay numerator={num1} denominator={den1} /> × <FractionDisplay numerator={num2} denominator={den2} /></>
        ) : (
            <>Divisão: <FractionDisplay numerator={num1} denominator={den1} /> ÷ <FractionDisplay numerator={num2} denominator={den2} /></>
        )}
    </>);
    stepCount++;
    
    if (operation === 'multiply') {
        calculationSteps.push(`Passo ${stepCount}: Multiplicar os numeradores`);
        calculationSteps.push(`${num1} × ${num2} = ${resultNumerator}`);
        stepCount++;
        
        calculationSteps.push(`Passo ${stepCount}: Multiplicar os denominadores`);
        calculationSteps.push(`${den1} × ${den2} = ${resultDenominator}`);
        stepCount++;
    } else {
        calculationSteps.push(`Passo ${stepCount}: Inverter a segunda fração`);
        calculationSteps.push(<>
            <FractionDisplay numerator={num1} denominator={den1} /> ÷ <FractionDisplay numerator={num2} denominator={den2} /> = 
            <FractionDisplay numerator={num1} denominator={den1} /> × <FractionDisplay numerator={den2} denominator={num2} />
        </>);
        stepCount++;
        
        calculationSteps.push(`Passo ${stepCount}: Multiplicar os numeradores`);
        calculationSteps.push(`${num1} × ${den2} = ${resultNumerator}`);
        stepCount++;
        
        calculationSteps.push(`Passo ${stepCount}: Multiplicar os denominadores`);
        calculationSteps.push(`${den1} × ${num2} = ${resultDenominator}`);
        stepCount++;
    }
    
    if (resultNumerator !== simplifiedNum || resultDenominator !== simplifiedDen) {
        const mdcValue = mdc(resultNumerator, resultDenominator);
        calculationSteps.push(`Passo ${stepCount}: Simplificar a fração resultante`);
        calculationSteps.push(`MDC(${resultNumerator}, ${resultDenominator}) = ${mdcValue}`);
        calculationSteps.push(<>
            <FractionDisplay numerator={resultNumerator} denominator={resultDenominator} /> ÷ 
            <FractionDisplay numerator={mdcValue} denominator={mdcValue} /> = 
            <FractionDisplay numerator={simplifiedNum} denominator={simplifiedDen} />
        </>);
    }
    
    setSteps(calculationSteps);
  };

  return (
    <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
            <HiCalculator className="h-6 w-6 text-indigo-600 mr-2" />
            <h2 className="text-2xl font-bold">Multiplicação e Divisão de Frações </h2>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-8">
            <p className="text-gray-700 mb-6">
                Essa calculadora ajuda a resolver multiplicações e divisões de frações.
                Insira o numerador e o denominador de cada fração abaixo e escolha a operação desejada.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Fração 1
                    </label>
                    <div className="flex items-center">
                        <input
                            type="number"
                            value={numerator1}
                            onChange={(e) => setNumerator1(e.target.value)}
                            className="w-20 p-2 border border-gray-300 rounded-l-md focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Num"
                        />
                        <div className="px-2 py-2 bg-gray-100 border-t border-b border-gray-300">
                            /
                        </div>
                        <input
                            type="number"
                            value={denominator1}
                            onChange={(e) => setDenominator1(e.target.value)}
                            className="w-20 p-2 border border-gray-300 rounded-r-md focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Den"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Fração 2
                    </label>
                    <div className="flex items-center">
                        <input
                            type="number"
                            value={numerator2}
                            onChange={(e) => setNumerator2(e.target.value)}
                            className="w-20 p-2 border border-gray-300 rounded-l-md focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Num"
                        />
                        <div className="px-2 py-2 bg-gray-100 border-t border-b border-gray-300">
                            /
                        </div>
                        <input
                            type="number"
                            value={denominator2}
                            onChange={(e) => setDenominator2(e.target.value)}
                            className="w-20 p-2 border border-gray-300 rounded-r-md focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Den"
                        />
                    </div>
                </div>
            </div>

            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Operação
                </label>
                <div className="flex space-x-4">
                    <label className="inline-flex items-center">
                        <input
                            type="radio"
                            value="multiply"
                            checked={operation === 'multiply'}
                            onChange={() => setOperation('multiply')}
                            className="form-radio h-4 w-4 text-indigo-600"
                        />
                        <span className="ml-2">Multiplicação (*)</span>
                    </label>
                    <label className="inline-flex items-center">
                        <input
                            type="radio"
                            checked={operation === 'divide'}
                            onChange={() => setOperation('divide')}
                            className="form-radio h-4 w-4 text-indigo-600"
                        />
                        <span className="ml-2">Divisão (/)</span>
                    </label>
                </div>
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
      
      {resultado && (
        <div className="space-y-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-5">
            <h3 className="text-lg font-medium text-green-800 mb-2">Resultado</h3>
            <div className="flex items-center">
              <p className="text-xl mr-2">
                {operation === 'multiply' ? 'O resultado da multiplicação é: ' : 'O resultado da divisão é: '}
              </p>
              {resultadoNum !== null && resultadoDen !== null && (
                <FractionDisplay 
                  numerator={resultadoNum} 
                  denominator={resultadoDen} 
                  className="text-xl"
                />
              )}
              {resultadoNum !== null && resultadoDen !== null && resultadoNum % resultadoDen === 0 && (
                <span className="ml-3">= {resultadoNum / resultadoDen}</span>
              )}
            </div>
            
            <button 
                onClick={() => setShowExplanation(!showExplanation)}
                className="mt-4 text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center"
            >
                {showExplanation ? "Ocultar explicação detalhada" : "Mostrar explicação detalhada"}
            </button>
          </div>
          
          {showExplanation && (
            <div className="bg-white shadow-md rounded-lg p-5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800 flex items-center">
                  <HiCalculator className="h-6 w-6 mr-2 text-indigo-600" />
                  Solução passo a passo
                </h3>
              </div>
              
              <div className="space-y-4">
                {steps.map((step, index) => {
                  // Verifica se o passo começa com um padrão de número de passo como "Passo X:"
                  const stepStr = String(step); // Garante que step seja tratado como string
                  const stepMatch = stepStr.match(/^(Passo \d+:)(.*)$/);
                  
                  if (stepMatch) {
                    // Se for um passo com número, extrai e destaca o número
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
                    // Conteúdo regular sem número de passo
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
                {operation === 'multiply' ? (
                  <p className="text-gray-700">
                    Para multiplicar frações, multiplicamos os numeradores entre si e os denominadores entre si:
                    <br />
                    <span className="font-medium">
                      <FractionDisplay numerator={1} denominator={2} /> × 
                      <FractionDisplay numerator={3} denominator={4} /> = 
                      <FractionDisplay numerator={1 * 3} denominator={2 * 4} /> = 
                      <FractionDisplay numerator={3} denominator={8} />
                    </span>
                  </p>
                ) : (
                  <p className="text-gray-700">
                    Para dividir frações, multiplicamos a primeira fração pelo inverso da segunda:
                    <br />
                    <span className="font-medium">
                      <FractionDisplay numerator={1} denominator={2} /> ÷ 
                      <FractionDisplay numerator={3} denominator={4} /> = 
                      <FractionDisplay numerator={1} denominator={2} /> × 
                      <FractionDisplay numerator={4} denominator={3} /> = 
                      <FractionDisplay numerator={4} denominator={6} /> = 
                      <FractionDisplay numerator={2} denominator={3} />
                    </span>
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ResolvedorMultDivFracao;