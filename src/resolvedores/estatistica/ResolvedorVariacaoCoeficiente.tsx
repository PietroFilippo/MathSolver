import { useState } from 'react';
import { HiCalculator } from 'react-icons/hi';
import { 
    arredondarParaDecimais,
    calcularCoeficienteVariacao,
    calcularDesvioPadrao
} from '../../utils/mathUtils';

const ResolvedorVariacaoCoeficiente: React.FC = () => {
    const [numbers, setNumbers] = useState<string>('');
    const [result, setResult] = useState<number | null>(null);
    const [showExplanation, setShowExplanation] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>('');

    const handleSolve = () => {
        setResult(null);
        setShowExplanation(false);
        setErrorMessage('');

        if (!numbers.trim()) {
            setErrorMessage('Digite os números para calcular o coeficiente de variação.');
            return;
        }

        const numbersArray = numbers.split(',').map(num => num.trim());
        const parsedArray: number[] = [];
        
        for (const num of numbersArray) {
            const parsed = parseFloat(num);
            if (isNaN(parsed)) {
                setErrorMessage(`"${num}" não é um número válido.`);
                return;
            }
            parsedArray.push(parsed);
        }

        if (parsedArray.length < 2) {
            setErrorMessage('Digite pelo menos dois números para calcular o coeficiente de variação.');
            return;
        }

        try {
            const calculatedResult = calcularCoeficienteVariacao(parsedArray);
            setResult(calculatedResult);
            setShowExplanation(true);
        } catch (error) {
            if (error instanceof Error) {
                setErrorMessage(error.message);
            }
        }
    };

    const gerarPassosExplicacao = () => {
        if (!numbers.trim()) return null;

        const numbersArray = numbers.split(',').map(num => parseFloat(num.trim()));
        const media = arredondarParaDecimais(
            numbersArray.reduce((acc, curr) => acc + curr, 0) / numbersArray.length,
            4
        );
        const desvioPadrao = arredondarParaDecimais(calcularDesvioPadrao(numbersArray), 4);
        let stepCount = 1;

        return (
            <>
                <div className="p-3 bg-gray-50 rounded-md border-l-4 border-indigo-500">
                    <div className="flex flex-col sm:flex-row">
                        <span className="font-bold text-indigo-700 mr-2 mb-1 sm:mb-0">
                            Passo {stepCount++}:
                        </span>
                        <p className="text-gray-800">Calcular a média aritmética dos valores.</p>
                    </div>
                    <div className="bg-white p-3 rounded-md border border-gray-200 mt-2">
                        <p>Média = {media}</p>
                    </div>
                </div>

                <div className="p-3 bg-gray-50 rounded-md border-l-4 border-indigo-500">
                    <div className="flex flex-col sm:flex-row">
                        <span className="font-bold text-indigo-700 mr-2 mb-1 sm:mb-0">
                            Passo {stepCount++}:
                        </span>
                        <p className="text-gray-800">Calcular o desvio padrão dos valores.</p>
                    </div>
                    <div className="bg-white p-3 rounded-md border border-gray-200 mt-2">
                        <p>Desvio Padrão = {desvioPadrao}</p>
                    </div>
                </div>

                <div className="p-3 bg-gray-50 rounded-md border-l-4 border-indigo-500">
                    <div className="flex flex-col sm:flex-row">
                        <span className="font-bold text-indigo-700 mr-2 mb-1 sm:mb-0">
                            Passo {stepCount++}:
                        </span>
                        <p className="text-gray-800">Calcular o coeficiente de variação usando a fórmula: CV = (Desvio Padrão / |Média|) × 100%</p>
                    </div>
                    <div className="bg-white p-3 rounded-md border border-gray-200 mt-2">
                        <p>CV = ({desvioPadrao} / |{media}|) × 100% = {result}%</p>
                    </div>
                </div>
            </>
        );
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center mb-6">
                <HiCalculator className="h-6 w-6 text-indigo-600 mr-2" />
                <h2 className="text-2xl font-bold">Calculadora de Coeficiente de Variação</h2>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-8">
                <p className="text-gray-700 mb-6">
                    Calcule o Coeficiente de Variação (CV) de um conjunto de números. O CV é uma medida 
                    de dispersão relativa que permite comparar a variabilidade de diferentes conjuntos 
                    de dados, independentemente de suas unidades de medida.
                </p>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Números (separados por vírgula):
                    </label>
                    <input
                        type="text"
                        value={numbers}
                        onChange={(e) => setNumbers(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Ex: 2.5, 3.7, 4.2, 5.1"
                    />
                </div>

                <button
                    onClick={handleSolve}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-md transition-colors duration-300"
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
                            Coeficiente de Variação = <span className="font-bold">{result}%</span>
                        </p>
                    </div>

                    {showExplanation && (
                        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                            <h3 className="text-lg font-medium text-gray-800 mb-4">Passo a Passo</h3>
                            <div className="space-y-4">
                                {gerarPassosExplicacao()}
                            </div>
                            <div className="mt-6 p-4 bg-blue-50 rounded-md">
                                <h4 className="text-blue-800 font-medium mb-2">Interpretação</h4>
                                <p className="text-gray-700">
                                    O Coeficiente de Variação (CV) é expresso em porcentagem e indica a dispersão 
                                    relativa dos dados. Quanto menor o CV, mais homogêneos são os dados.
                                    <br /><br />
                                    Interpretação geral:
                                    <br />• CV &le; 15%: Baixa dispersão
                                    <br />• 15% &lt; CV &le; 30%: Média dispersão
                                    <br />• CV &gt; 30%: Alta dispersão
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ResolvedorVariacaoCoeficiente;
