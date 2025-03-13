import { useState } from 'react';
import { HiCalculator } from 'react-icons/hi';
import { arredondarParaDecimais } from '../../utils/mathUtils';
import { calcularMediaPonderada } from '../../utils/mathUtilsEstatistica';

interface ValorPeso {
    valor: string;
    peso: string;
}

const ResolvedorMediaPonderada: React.FC = () => {
    const [valoresPesos, setValoresPesos] = useState<ValorPeso[]>([
        { valor: '', peso: '' },
        { valor: '', peso: '' }
    ]);
    const [result, setResult] = useState<number | null>(null);
    const [showExplanation, setShowExplanation] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [steps, setSteps] = useState<string[]>([]);

    const handleAddPair = () => {
        setValoresPesos([...valoresPesos, { valor: '', peso: '' }]);
    };

    const handleRemovePair = (index: number) => {
        if (valoresPesos.length > 2) {
            const newValoresPesos = valoresPesos.filter((_, idx) => idx !== index);
            setValoresPesos(newValoresPesos);
        }
    };

    const handleChange = (index: number, field: 'valor' | 'peso', value: string) => {
        const newValoresPesos = [...valoresPesos];
        newValoresPesos[index][field] = value;
        setValoresPesos(newValoresPesos);
    };

    const handleSolve = () => {
        setResult(null);
        setShowExplanation(false);
        setErrorMessage('');
        setSteps([]);

        // Validação e conversão dos valores
        const valores: number[] = [];
        const pesos: number[] = [];
        
        for (let i = 0; i < valoresPesos.length; i++) {
            const valor = parseFloat(valoresPesos[i].valor);
            const peso = parseFloat(valoresPesos[i].peso);

            if (isNaN(valor) || isNaN(peso)) {
                setErrorMessage(`Valor ou peso inválido na linha ${i + 1}`);
                return;
            }

            if (peso < 0) {
                setErrorMessage(`O peso não pode ser negativo na linha ${i + 1}`);
                return;
            }

            valores.push(valor);
            pesos.push(peso);
        }

        try {
            const mediaPonderada = calcularMediaPonderada(valores, pesos);
            const resultadoArredondado = arredondarParaDecimais(mediaPonderada, 2);
            setResult(resultadoArredondado);

            // Gerar passos com numeração
            let stepCount = 1;
            const calculationSteps: string[] = [];
            
            calculationSteps.push(`Passo ${stepCount++}: Identificar os valores e seus respectivos pesos`);
            valoresPesos.forEach((vp, idx) => {
                calculationSteps.push(`- Valor ${idx + 1}: ${vp.valor} (Peso: ${vp.peso})`);
            });

            calculationSteps.push(`Passo ${stepCount++}: Multiplicar cada valor por seu respectivo peso`);
            const produtos = valores.map((v, idx) => v * pesos[idx]);
            produtos.forEach((prod, idx) => {
                calculationSteps.push(`- ${valores[idx]} × ${pesos[idx]} = ${arredondarParaDecimais(prod, 2)}`);
            });

            const somaProdutos = produtos.reduce((acc, curr) => acc + curr, 0);
            const somaPesos = pesos.reduce((acc, curr) => acc + curr, 0);

            calculationSteps.push(`Passo ${stepCount++}: Somar todos os produtos`);
            calculationSteps.push(`- Soma dos produtos: ${arredondarParaDecimais(somaProdutos, 2)}`);

            calculationSteps.push(`Passo ${stepCount++}: Somar todos os pesos`);
            calculationSteps.push(`- Soma dos pesos: ${somaPesos}`);

            calculationSteps.push(`Passo ${stepCount++}: Dividir a soma dos produtos pela soma dos pesos`);
            calculationSteps.push(`- ${arredondarParaDecimais(somaProdutos, 2)} ÷ ${somaPesos} = ${resultadoArredondado}`);

            setSteps(calculationSteps);
            setShowExplanation(true);
        } catch (error) {
            if (error instanceof Error) {
                setErrorMessage(error.message);
            }
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center mb-6">
                <HiCalculator className="h-6 w-6 text-indigo-600 mr-2" />
                <h2 className="text-2xl font-bold">Média Ponderada</h2>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-8">
                <p className="text-gray-700 mb-6">
                    Calcule a média ponderada de um conjunto de valores e seus respectivos pesos.
                </p>

                <div className="space-y-4 mb-6">
                    {valoresPesos.map((vp, index) => (
                        <div key={index} className="flex items-center space-x-4">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Valor {index + 1}
                                </label>
                                <input
                                    type="number"
                                    value={vp.valor}
                                    onChange={(e) => handleChange(index, 'valor', e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    placeholder="Digite o valor"
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Peso {index + 1}
                                </label>
                                <input
                                    type="number"
                                    value={vp.peso}
                                    onChange={(e) => handleChange(index, 'peso', e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    placeholder="Digite o peso"
                                    min="0"
                                    step="0.1"
                                />
                            </div>
                            {valoresPesos.length > 2 && (
                                <button
                                    onClick={() => handleRemovePair(index)}
                                    className="mt-6 text-red-600 hover:text-red-800"
                                >
                                    Remover
                                </button>
                            )}
                        </div>
                    ))}
                </div>

                <div className="flex space-x-4">
                    <button
                        onClick={handleAddPair}
                        className="text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                        + Adicionar mais valores
                    </button>
                    <button
                        onClick={handleSolve}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-md transition-colors duration-300"
                    >
                        Calcular
                    </button>
                </div>

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
                            Média Ponderada: <span className="font-bold">{result}</span>
                        </p>
                        
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
                                    const stepMatch = step.match(/^(Passo \d+:)(.*)$/);
                                    
                                    if (stepMatch) {
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
                                        return (
                                            <div key={index} className="p-3 bg-gray-50 rounded-md ml-4">
                                                {step}
                                            </div>
                                        );
                                    }
                                })}
                            </div>

                            <div className="mt-6 p-4 bg-blue-50 rounded-md">
                                <h4 className="font-medium text-blue-800 mb-2">Conceito Matemático</h4>
                                <div className="space-y-2 text-gray-700">
                                    <p>
                                        A média ponderada é uma medida de tendência central que considera a importância 
                                        relativa (peso) de cada valor no conjunto de dados.
                                    </p>
                                    <p>
                                        É calculada multiplicando cada valor por seu respectivo peso, somando todos 
                                        esses produtos e dividindo pela soma dos pesos.
                                    </p>
                                    <p>
                                        Fórmula: MP = (x₁w₁ + x₂w₂ + ... + xₙwₙ) ÷ (w₁ + w₂ + ... + wₙ)
                                    </p>
                                    <p>
                                        Onde: x₁, x₂, ..., xₙ são os valores e w₁, w₂, ..., wₙ são seus respectivos pesos.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ResolvedorMediaPonderada;
