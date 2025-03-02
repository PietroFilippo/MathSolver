import { useState } from 'react';
import { mmc, mdc, simplificarFracao, formatarFracao } from '../utils/mathUtils';
import { HiCalculator } from 'react-icons/hi';

type Operation = 'add' | 'sub';

const ResolvedorAddSubFracao: React.FC = () => {
    const [numerator1, setNumerator1] = useState<string>('');
    const [denominator1, setDenominator1] = useState<string>('');
    const [numerator2, setNumerator2] = useState<string>('');
    const [denominator2, setDenominator2] = useState<string>('');
    const [operation, setOperation] = useState<Operation>('add');
    const [result, setResult] = useState<{ numerator: number, denominator: number } | null>(null);
    const [steps, setSteps] = useState<string[]>([]);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [showExplanation, setShowExplanation] = useState<boolean>(false);

    const handleSolve = () => {
        // Resetar os valores anteriores e erros
        setResult(null);
        setSteps([]);
        setErrorMessage('');
        setShowExplanation(false);

        const num1 = parseInt(numerator1);
        const den1 = parseInt(denominator1);
        const num2 = parseInt(numerator2);
        const den2 = parseInt(denominator2);

        // Valida inputs
        if (isNaN(num1) || isNaN(den1) || isNaN(num2) || isNaN(den2)) {
            setErrorMessage('Por favor, preencha todos os campos com valores numéricos.');
            return;
        }

        if (den1 === 0 || den2 === 0) {
            setErrorMessage('O denominador não pode ser zero.');
            return;
        }

        const commonDenominator = mmc(den1, den2);
        const factor1 = commonDenominator / den1;
        const factor2 = commonDenominator / den2;

        const newNumerator1 = num1 * factor1;
        const newNumerator2 = num2 * factor2;

        let resultNumerator: number;
        if (operation === 'add') {
            resultNumerator = newNumerator1 + newNumerator2;
        } else {
            resultNumerator = newNumerator1 - newNumerator2;
        }

        // Corrige o tipo de erro ao desestruturar o objeto corretamente
        const simplified = simplificarFracao(resultNumerator, commonDenominator);
        const simplifiedNum = simplified.numerador;
        const simplifiedDen = simplified.denominador;
        
        setResult({ numerator: simplifiedNum, denominator: simplifiedDen });
        setShowExplanation(true);

        // Gera os passos
        const calculationSteps = [];
            calculationSteps.push(`Passo 1: Encontrar o MMC dos denominadores ${den1} e ${den2}`);
            calculationSteps.push(`MMC(${den1}, ${den2}) = ${commonDenominator}`);

            calculationSteps.push(`Passo 2: Converter cada fração para ter uma fração equivalente com o denominador comum`);
            calculationSteps.push(`${num1}/${den1} = ${num1} × ${factor1}/${den1} × ${factor1} = ${newNumerator1}/${commonDenominator}`);
            calculationSteps.push(`${num2}/${den2} = ${num2} × ${factor2}/${den2} × ${factor2} = ${newNumerator2}/${commonDenominator}`);

            calculationSteps.push(`Passo 3: ${operation === 'add' ? 'Adicionar' : 'Subtrair'} os numeradores, mantendo o denominador comum.`);
            if (operation === 'add') {
                calculationSteps.push(`${newNumerator1}/${commonDenominator} + ${newNumerator2}/${commonDenominator} = ${resultNumerator}/${commonDenominator}`);
            } else {
                calculationSteps.push(`${newNumerator1}/${commonDenominator} - ${newNumerator2}/${commonDenominator} = ${resultNumerator}/${commonDenominator}`);
            }

            if (resultNumerator !== simplifiedNum || commonDenominator !== simplifiedDen) {
            calculationSteps.push(`Passo 4: Simplificar a fração resultante dividindo o numerador e o denominador pelo MDC`);
            calculationSteps.push(`MDC(${resultNumerator}, ${commonDenominator}) = ${mdc(resultNumerator, commonDenominator)}`);
            calculationSteps.push(`${resultNumerator}/${commonDenominator} = ${simplifiedNum}/${simplifiedDen}`);
            } else {
                calculationSteps.push(`Passo 4: A fração ${resultNumerator}/${commonDenominator} já está simplificada.`);
            }

        setSteps(calculationSteps);
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center mb-6">
                <HiCalculator className="h-6 w-6 text-indigo-600 mr-2" />
                <h2 className="text-2xl font-bold">Adição e Subtração de Frações</h2>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-8">
                <p className="text-gray-700 mb-6">
                    Essa calculadora ajuda a resolver adições e subtrações de frações com denominadores diferentes.
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
                                value="add"
                                checked={operation === 'add'}
                                onChange={() => setOperation('add')}
                                className="form-radio h-4 w-4 text-indigo-600"
                            />
                            <span className="ml-2">Adição (+)</span>
                        </label>
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                checked={operation === 'sub'}
                                onChange={() => setOperation('sub')}
                                className="form-radio h-4 w-4 text-indigo-600"
                            />
                            <span className="ml-2">Subtração (-)</span>
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

            {result && (
                <div className="space-y-6">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-5">
                        <h3 className="text-lg font-medium text-green-800 mb-2">Resultado</h3>
                        <p className="text-xl">
                        {numerator1}/{denominator1} {operation === 'add' ? '+' : '-'} {numerator2}/{denominator2} = <span className="font-bold">{formatarFracao(result.numerator, result.denominator)}</span>
                        </p>
                    </div>

                    {showExplanation && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
                            <h3 className="text-lg font-medium text-blue-800 mb-3">Solução passo a passo</h3>
                            <div className="space-y-3">
                                {steps.map((step, index) => (
                                    <p key={index} className="text-gray-700">
                                        {step}
                                    </p>
                                ))}
                            </div>
                            
                            <div className="mt-5 pt-4 border-t border-blue-200">
                                <h4 className="font-medium text-blue-800 mb-2">Por que isso funciona:</h4>
                                <p className="text-gray-700">
                                    Para {operation === 'add' ? 'adicionar' : 'subtrair'} frações com denominadores diferentes, precisamos:
                                </p>
                                <ul className="list-disc list-inside mt-2 space-y-1 text-gray-700">
                                    <li>Encontrar um denominador comum (geralmente o MMC)</li>
                                    <li>Converter as frações para equivalentes com o mesmo denominador</li>
                                    <li>{operation === 'add' ? 'Adicionar' : 'Subtrair'} os numeradores, mantendo o denominador comum</li>
                                    <li>Simplificar a fração resultante, se possível</li>
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ResolvedorAddSubFracao;
