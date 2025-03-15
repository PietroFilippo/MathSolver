import React, { useState } from 'react';
import { HiCalculator } from 'react-icons/hi';
import { roundToDecimals } from '../../utils/mathUtils';
import { calculateWeightedMean, getWeightedMeanExamples } from '../../utils/mathUtilsEstatistica';

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
            const mediaPonderada = calculateWeightedMean(valores, pesos);
            const resultadoArredondado = roundToDecimals(mediaPonderada, 2);
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
                calculationSteps.push(`- ${valores[idx]} × ${pesos[idx]} = ${roundToDecimals(prod, 2)}`);
            });

            const somaProdutos = produtos.reduce((acc, curr) => acc + curr, 0);
            const somaPesos = pesos.reduce((acc, curr) => acc + curr, 0);

            calculationSteps.push(`Passo ${stepCount++}: Somar todos os produtos`);
            calculationSteps.push(`- Soma dos produtos: ${roundToDecimals(somaProdutos, 2)}`);

            calculationSteps.push(`Passo ${stepCount++}: Somar todos os pesos`);
            calculationSteps.push(`- Soma dos pesos: ${somaPesos}`);

            calculationSteps.push(`Passo ${stepCount++}: Dividir a soma dos produtos pela soma dos pesos`);
            calculationSteps.push(`- ${roundToDecimals(somaProdutos, 2)} ÷ ${somaPesos} = ${resultadoArredondado}`);

            setSteps(calculationSteps);
            setShowExplanation(true);
        } catch (error) {
            if (error instanceof Error) {
                setErrorMessage(error.message);
            }
        }
    };

    // Função para aplicar um exemplo
    const applyExample = (example: { values: number[], weights: number[] }) => {
        // Criar um novo array com o tamanho adequado para o exemplo
        const newValoresPesos: ValorPeso[] = [];
        
        for (let i = 0; i < example.values.length; i++) {
            newValoresPesos.push({
                valor: example.values[i].toString(),
                peso: example.weights[i].toString()
            });
        }
        
        setValoresPesos(newValoresPesos);
    };

    // Função que renderiza os passos com estilização aprimorada
    const renderExplanationSteps = () => {
        return (
            <div className="space-y-4">
                {steps.map((step, index) => {
                    // Verifica se o passo começa com um padrão de número de passo como "Passo X:"
                    const stepMatch = step.match(/^(Passo \d+:)(.*)$/);
                    
                    // Verifica se o passo lista valores e pesos
                    const valueWeightMatch = step.startsWith('- Valor');
                    
                    // Verifica se o passo mostra multiplicações de valores por pesos
                    const multiplicationMatch = step.includes('×') && step.includes('=');
                    
                    // Verifica se o passo mostra somas
                    const sumMatch = step.startsWith('- Soma dos produtos') || step.startsWith('- Soma dos pesos');
                    
                    // Verifica se o passo é a divisão final
                    const divisionMatch = step.includes('÷') && step.includes('=');
                    
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
                    } else if (valueWeightMatch) {
                        // Se for listagem de valores e pesos
                        return (
                            <div key={index} className="p-3 bg-blue-50 rounded-md ml-4 border-l-2 border-blue-300">
                                <p className="text-blue-700">{step}</p>
                            </div>
                        );
                    } else if (multiplicationMatch) {
                        // Se for uma multiplicação
                        return (
                            <div key={index} className="p-3 bg-purple-50 rounded-md ml-4 border-l-2 border-purple-300">
                                <p className="text-purple-700">{step}</p>
                            </div>
                        );
                    } else if (sumMatch) {
                        // Se for uma soma de produtos ou pesos
                        return (
                            <div key={index} className="p-3 bg-indigo-50 rounded-md ml-4 border-l-2 border-indigo-300">
                                <p className="text-indigo-700 font-medium">{step}</p>
                            </div>
                        );
                    } else if (divisionMatch) {
                        // Se for a divisão final
                        return (
                            <div key={index} className="p-3 bg-green-50 rounded-md ml-4 border-l-2 border-green-300">
                                <p className="text-green-700 font-medium">{step}</p>
                            </div>
                        );
                    } else {
                        // Conteúdo regular sem classificação específica
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
                <h2 className="text-2xl font-bold">Média Ponderada</h2>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-8">
                <p className="text-gray-700 mb-6">
                    Calcule a média ponderada de um conjunto de valores e seus respectivos pesos.
                </p>

                {/* Exemplos de médias ponderadas */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Exemplos
                    </label>
                    <div className="flex flex-wrap gap-2 mb-4">
                        {getWeightedMeanExamples().map((example, index) => (
                            <button
                                key={index}
                                onClick={() => applyExample(example)}
                                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-full transition-colors"
                            >
                                {example.description}
                            </button>
                        ))}
                    </div>
                </div>

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
                                            <h5 className="font-medium text-gray-800 mb-2 border-b border-gray-200 pb-1">Média Ponderada</h5>
                                            <div className="space-y-3">
                                                <p className="text-gray-700">
                                                    A média ponderada é uma medida de tendência central que considera a importância 
                                                    relativa (peso) de cada valor no conjunto de dados, diferente da média aritmética 
                                                    simples onde todos os valores têm a mesma importância.
                                                </p>
                                                <div className="bg-white p-3 rounded-md border border-gray-100 shadow-sm">
                                                    <h6 className="text-indigo-700 font-medium mb-2">Fórmula</h6>
                                                    <div className="text-center font-medium text-indigo-700">
                                                        <p>MP = (x₁w₁ + x₂w₂ + ... + xₙwₙ) ÷ (w₁ + w₂ + ... + wₙ)</p>
                                                        <p className="text-sm mt-1">Onde x₁, x₂, ..., xₙ são os valores e w₁, w₂, ..., wₙ são seus respectivos pesos</p>
                                                    </div>
                                                </div>
                                                <div className="p-3 bg-indigo-50 rounded-md">
                                                    <p className="text-sm text-indigo-700">
                                                        <span className="font-medium">Observação:</span> Se todos os pesos forem iguais, 
                                                        a média ponderada será igual à média aritmética simples.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="flex-1">
                                            <h5 className="font-medium text-gray-800 mb-2 border-b border-gray-200 pb-1">Aplicações e Exemplos</h5>
                                            <div className="p-3 bg-white rounded-md border border-gray-100 shadow-sm mb-4">
                                                <h6 className="text-indigo-700 font-medium mb-2">Contextos de Uso</h6>
                                                <ul className="text-sm space-y-2 list-disc pl-4 text-gray-700">
                                                    <li><span className="font-medium">Notas Escolares:</span> Diferentes disciplinas ou avaliações podem ter pesos diferentes</li>
                                                    <li><span className="font-medium">Economia:</span> No cálculo do Índice de Preços ao Consumidor (IPC)</li>
                                                    <li><span className="font-medium">Finanças:</span> Para calcular o retorno médio de uma carteira de investimentos</li>
                                                    <li><span className="font-medium">Pesquisas:</span> Quando diferentes opiniões têm importâncias diferentes</li>
                                                    <li><span className="font-medium">Estatística:</span> Em métodos de amostragem e análise de dados</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="bg-white p-3 rounded-md border border-gray-100 shadow-sm">
                                            <h5 className="font-medium text-gray-800 mb-2">Exemplo Prático</h5>
                                            <div className="p-2 bg-indigo-50 rounded-md mb-2">
                                                <p className="text-sm text-indigo-700">
                                                    <span className="font-medium">Cálculo de média final:</span>
                                                </p>
                                                <ul className="text-xs list-disc pl-4 mt-1 text-gray-700">
                                                    <li>Prova 1: nota 7,0 (peso 2)</li>
                                                    <li>Prova 2: nota 8,5 (peso 3)</li>
                                                    <li>Trabalho: nota 6,0 (peso 1)</li>
                                                </ul>
                                                <p className="text-xs mt-2 text-indigo-700">
                                                    Média Ponderada = ((7,0 × 2) + (8,5 × 3) + (6,0 × 1)) ÷ (2 + 3 + 1)<br />
                                                    = (14 + 25,5 + 6) ÷ 6<br />
                                                    = 45,5 ÷ 6<br />
                                                    = 7,58
                                                </p>
                                            </div>
                                        </div>

                                        <div className="bg-yellow-50 p-3 rounded-md border-l-4 border-yellow-400">
                                            <h5 className="font-medium text-yellow-800 mb-2">Dica de Resolução</h5>
                                            <ul className="text-sm space-y-2 list-disc pl-4 text-gray-700">
                                                <li>Certifique-se de que os pesos são atribuídos corretamente de acordo com a importância relativa de cada valor</li>
                                                <li>Verifique se a soma de todos os produtos (valor × peso) está correta</li>
                                                <li>Lembre-se de dividir pela soma dos pesos, não pelo número de valores</li>
                                                <li>Quando todos os pesos são iguais, você pode simplificar e calcular a média aritmética</li>
                                            </ul>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-4 p-3 bg-indigo-50 rounded-md border border-indigo-100">
                                        <h5 className="font-medium text-indigo-800 mb-1 flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                            </svg>
                                            Relação com Outras Medidas
                                        </h5>
                                        <p className="text-sm text-indigo-700">
                                            A média ponderada é uma generalização da média aritmética. Outras médias importantes incluem a média geométrica 
                                            (usada para taxas de crescimento) e a média harmônica (usada para médias de taxas). Cada tipo de média tem seu 
                                            contexto específico de aplicação.
                                        </p>
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

export default ResolvedorMediaPonderada;
