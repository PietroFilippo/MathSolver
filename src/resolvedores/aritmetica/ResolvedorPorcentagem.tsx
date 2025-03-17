import React from 'react';
import { HiCalculator, HiInformationCircle } from 'react-icons/hi';
import { getPercentageExamples } from '../../utils/mathUtilsTeoriaNumeros';
import { usePercentageSolver } from '../../hooks/aritmetica/usePorcentagemSolver';
import StepByStepExplanation from '../../components/StepByStepExplanation';
import ConceitoMatematico from '../../components/ConceitoMatematico';

const ResolvedorPorcentagem: React.FC = () => {
    const { state, dispatch, handleSolve, applyExample, setOperationType } = usePercentageSolver();

    // Filtra exemplos por tipo de operação
    const getFilteredExamples = () => {
        return getPercentageExamples().filter(example => example.type === state.operationType);
    };

    // Função que gera os passos com numeração dinâmica e estilização aprimorada
    const renderExplanationSteps = () => {
        // Instead of recreating the steps manually, use the steps from state
        // with a fallback to generate them if they're empty
        if (state.steps && state.steps.length > 0) {
            return state.steps;
        }
        
        let stepCount = 1;
        let steps: string[] = [];
        
        if (state.operationType === 'percentage') {
            const value = parseFloat(state.value.replace(',', '.'));
            const percentage = parseFloat(state.percentage.replace(',', '.'));
            const result = state.result || ((percentage / 100) * value);
            
            steps = [
                `Equação original: Calcular ${percentage}% de ${value}`,
                `Passo ${stepCount++}: Convertemos a porcentagem para decimal dividindo por 100: ${percentage}% = ${percentage} ÷ 100 = ${percentage / 100}`,
                `Passo ${stepCount++}: Multiplicamos o valor pelo decimal: ${value} × ${percentage / 100} = ${result}`,
                `Resultado: ${percentage}% de ${value} é igual a ${result}.`,
                '---VERIFICATION_SEPARATOR---',
                `Verificação do resultado:`,
                `Calculando: qual porcentagem ${result} representa de ${value}:`,
                `Simplificando: ${result} ÷ ${value} × 100 = ${(result / value) * 100}%`,
                `Verificação concluída: (${(result / value) * 100}% ≈ ${percentage}%) (Correto!)`
            ];
        } 
        else if (state.operationType === 'percentageChange') {
            const value = parseFloat(state.value.replace(',', '.'));
            const initialValue = parseFloat(state.percentage.replace(',', '.'));
            const result = state.result || (((value - initialValue) / initialValue) * 100);
            
            steps = [
                `Equação original: Calcular a variação percentual entre ${initialValue} (valor inicial) e ${value} (valor final)`,
                `Passo ${stepCount++}: Calculamos a diferença entre os valores: ${value} - ${initialValue} = ${value - initialValue}`,
                `Passo ${stepCount++}: Dividimos a diferença pelo valor inicial: (${value} - ${initialValue}) ÷ ${initialValue} = ${(value - initialValue) / initialValue}`,
                `Passo ${stepCount++}: Multiplicamos por 100 para obter a porcentagem: ${(value - initialValue) / initialValue} × 100 = ${result}%`,
                
                result > 0 
                    ? `Resultado: Houve um aumento de ${result}% do valor inicial para o valor final.`
                    : result < 0 
                        ? `Resultado: Houve uma redução de ${Math.abs(result)}% do valor inicial para o valor final.`
                        : `Resultado: Não houve variação percentual entre os valores.`,
                
                '---VERIFICATION_SEPARATOR---',
                `Verificação do resultado:`,
                `Calculando: aplicando a variação percentual de ${result}% ao valor inicial ${initialValue}:`,
                `Simplificando: ${initialValue} × (1 + ${result} ÷ 100) = ${initialValue} × ${1 + result / 100} = ${initialValue * (1 + result / 100)}`,
                `Verificação concluída: O valor final calculado ${initialValue * (1 + result / 100)} ${Math.abs(initialValue * (1 + result / 100) - value) < 0.01 ? "✓ (Correto!)" : "≈"} ${value}`
            ];
        }
        else { // reversePercentage
            const currentValue = parseFloat(state.value.replace(',', '.'));
            const percentageIncrease = parseFloat(state.percentage.replace(',', '.'));
            const result = state.result || (currentValue / (1 + percentageIncrease / 100));
            
            steps = [
                `Equação original: Encontrar o valor original antes de um aumento de ${percentageIncrease}%`,
                `Passo ${stepCount++}: Convertemos a porcentagem para decimal e adicionamos 1: 1 + ${percentageIncrease} ÷ 100 = 1 + ${percentageIncrease / 100} = ${1 + percentageIncrease / 100}`,
                `Passo ${stepCount++}: Dividimos o valor atual pelo resultado: ${currentValue} ÷ ${1 + percentageIncrease / 100} = ${result}`,
                `Resultado: O valor original antes do aumento de ${percentageIncrease}% era ${result}.`,
                
                '---VERIFICATION_SEPARATOR---',
                `Verificação do resultado:`,
                `Calculando: aplicando um aumento de ${percentageIncrease}% ao valor original ${result}:`,
                `Simplificando: ${result} × (1 + ${percentageIncrease} ÷ 100) = ${result} × ${1 + percentageIncrease / 100} = ${result * (1 + percentageIncrease / 100)}`,
                `Verificação concluída: O valor após o aumento ${result * (1 + percentageIncrease / 100)} ${Math.abs(result * (1 + percentageIncrease / 100) - currentValue) < 0.01 ? "✓ (Correto!)" : "≈"} ${currentValue}`
            ];
        }

        return steps;
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center mb-6">
                <HiCalculator className="h-6 w-6 text-indigo-600 mr-2" />
                <h2 className="text-2xl font-bold">Calculadora de Porcentagem</h2>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-8">
                <p className='text-gray-700 mb-6'>
                    Calcule o valor de uma porcentagem de um número.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Valor:
                        </label>
                        <input
                            type="number"
                            value={state.value}
                            onChange={(e) => dispatch({ type: 'SET_VALUE', value: e.target.value })}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Digite o valor"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Porcentagem (%)
                        </label>
                        <input
                            type="number"
                            value={state.percentage}
                            onChange={(e) => dispatch({ type: 'SET_PERCENTAGE', value: e.target.value })}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Digite a porcentagem"
                        />
                    </div>
                </div>

                <div className="mb-6">
                    <p className="block text-sm font-medium text-gray-700 mb-2">Tipo de cálculo:</p>
                    <div className="flex flex-wrap gap-4">
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                checked={state.operationType === 'percentage'}
                                onChange={() => setOperationType('percentage')}
                                className="form-radio text-indigo-600"
                            />
                            <span className="ml-2">Valor da porcentagem</span>
                        </label>
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                checked={state.operationType === 'percentageChange'}
                                onChange={() => setOperationType('percentageChange')}
                                className="form-radio text-indigo-600"
                            />
                            <span className="ml-2">Variação percentual</span>
                        </label>
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                checked={state.operationType === 'reversePercentage'}
                                onChange={() => setOperationType('reversePercentage')}
                                className="form-radio text-indigo-600"
                            />
                            <span className="ml-2">Cálculo reverso</span>
                        </label>
                    </div>
                </div>

                {/* Exemplos de porcentagem */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Exemplos
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {getFilteredExamples().map((example, index) => (
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

                <button
                    onClick={handleSolve}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-md transition-colors duration-300 mt-4"
                >
                    Calcular
                </button>

                {state.errorMessage && (
                    <div className="mt-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-md">
                        {state.errorMessage}
                    </div>
                )}
            </div>

            {state.result !== null && (
                <div className="space-y-6">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-5">
                        <h3 className="text-lg font-medium text-green-800 mb-2">Resultado</h3>
                        <p className="text-xl">
                            {state.operationType === 'percentage' && (
                                <>O resultado de {state.percentage}% de {state.value} é: <span className="font-bold">{state.result}</span></>
                            )}
                            {state.operationType === 'percentageChange' && (
                                <>A variação percentual de {state.value} para {state.percentage} é: <span className="font-bold">{state.result}%</span></>
                            )}
                            {state.operationType === 'reversePercentage' && (
                                <>O valor do qual {state.value} representa {state.percentage}% é: <span className="font-bold">{state.result}</span></>
                            )}
                        </p>
                        
                        <button 
                            onClick={() => dispatch({ type: 'TOGGLE_EXPLANATION' })}
                            className="mt-4 text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center"
                        >
                            <HiInformationCircle className="h-5 w-5 mr-1" />
                            {state.showExplanation ? "Ocultar explicação detalhada" : "Mostrar explicação detalhada"}
                        </button>
                    </div>

                    {state.showExplanation && (
                        <div className="mt-8 bg-white shadow-md rounded-lg p-5">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold text-gray-800 flex items-center">
                                    <HiCalculator className="h-6 w-6 mr-2 text-indigo-600" />
                                    Solução passo a passo
                                </h3>
                            </div>
                            
                            <StepByStepExplanation steps={renderExplanationSteps()} stepType="linear" />
                            
                            <ConceitoMatematico
                                title="Conceito Matemático"
                                isOpen={state.showConceitoMatematico}
                                onToggle={() => dispatch({ type: 'TOGGLE_CONCEITO_MATEMATICO' })}
                            >
                                <div className="flex flex-col md:flex-row gap-4 mb-4">
                                    <div className="flex-1">
                                        <h5 className="font-medium text-gray-800 mb-2 border-b border-gray-200 pb-1">
                                            {state.operationType === 'percentage' && 'Porcentagem Básica'}
                                            {state.operationType === 'percentageChange' && 'Variação Percentual'}
                                            {state.operationType === 'reversePercentage' && 'Cálculo Reverso de Porcentagem'}
                                        </h5>
                                        
                                        {state.operationType === 'percentage' && (
                                            <div className="space-y-3">
                                                <p className="text-gray-700">
                                                    Porcentagens representam partes por cem. Quando dizemos "<span className="font-medium">{state.percentage}%</span>", 
                                                    queremos dizer "{state.percentage} partes de 100".
                                                </p>
                                                <div className="bg-white p-3 rounded-md border border-gray-100 shadow-sm">
                                                    <h6 className="text-indigo-700 font-medium mb-2">Fórmula Básica</h6>
                                                    <div className="text-center font-medium text-indigo-700">
                                                        <p>Valor da porcentagem = (Valor × Porcentagem) ÷ 100</p>
                                                    </div>
                                                </div>
                                                <div className="p-3 bg-indigo-50 rounded-md">
                                                    <p className="text-sm text-indigo-700">
                                                        <span className="font-medium">Exemplo:</span> Para calcular 25% de 80:
                                                        <br />
                                                        (80 × 25) ÷ 100 = 2000 ÷ 100 = 20
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                        
                                        {state.operationType === 'percentageChange' && (
                                            <div className="space-y-3">
                                                <p className="text-gray-700">
                                                    A variação percentual mede quanto um valor mudou em relação ao valor original, expressa em porcentagem.
                                                    Um resultado positivo indica aumento, enquanto um resultado negativo indica diminuição.
                                                </p>
                                                <div className="bg-white p-3 rounded-md border border-gray-100 shadow-sm">
                                                    <h6 className="text-indigo-700 font-medium mb-2">Fórmula</h6>
                                                    <div className="text-center font-medium text-indigo-700">
                                                        <p>Variação % = ((Valor Final - Valor Inicial) ÷ Valor Inicial) × 100</p>
                                                    </div>
                                                </div>
                                                <div className="p-3 bg-indigo-50 rounded-md">
                                                    <p className="text-sm text-indigo-700">
                                                        <span className="font-medium">Exemplo:</span> Se um preço aumentou de R$80 para R$100:
                                                        <br />
                                                        ((100 - 80) ÷ 80) × 100 = (20 ÷ 80) × 100 = 0,25 × 100 = 25%
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                        
                                        {state.operationType === 'reversePercentage' && (
                                            <div className="space-y-3">
                                                <p className="text-gray-700">
                                                    O cálculo reverso de porcentagem nos permite encontrar o valor original quando conhecemos 
                                                    uma parte percentual desse valor.
                                                </p>
                                                <div className="bg-white p-3 rounded-md border border-gray-100 shadow-sm">
                                                    <h6 className="text-indigo-700 font-medium mb-2">Fórmula</h6>
                                                    <div className="text-center font-medium text-indigo-700">
                                                        <p>Valor Original = (Valor Conhecido × 100) ÷ Porcentagem</p>
                                                    </div>
                                                </div>
                                                <div className="p-3 bg-indigo-50 rounded-md">
                                                    <p className="text-sm text-indigo-700">
                                                        <span className="font-medium">Exemplo:</span> Se R$20 é 25% de um valor:
                                                        <br />
                                                        (20 × 100) ÷ 25 = 2000 ÷ 25 = 80
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="flex-1">
                                        <h5 className="font-medium text-gray-800 mb-2 border-b border-gray-200 pb-1">Aplicações</h5>
                                        <div className="p-3 bg-white rounded-md border border-gray-100 shadow-sm">
                                            <h6 className="text-indigo-700 font-medium mb-2">Contextos de Uso</h6>
                                            <ul className="text-sm space-y-2 list-disc pl-4 text-gray-700">
                                                <li><span className="font-medium">Comércio:</span> Descontos, margens de lucro e aumentos de preço</li>
                                                <li><span className="font-medium">Finanças:</span> Juros, investimentos e taxas de crescimento</li>
                                                <li><span className="font-medium">Estatística:</span> Análise de dados, crescimento populacional</li>
                                                <li><span className="font-medium">Ciências:</span> Concentrações, probabilidades e composições</li>
                                                <li><span className="font-medium">Cotidiano:</span> Impostos, gorjetas e controle orçamentário</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="mt-4 flex flex-col md:flex-row gap-4">
                                    <div className="bg-white p-3 rounded-md border border-gray-100 shadow-sm md:w-1/2">
                                        <h5 className="font-medium text-gray-800 mb-2">Conversões Úteis</h5>
                                        <div className="space-y-2">
                                            <div className="p-2 bg-indigo-50 rounded-md flex items-center">
                                                <div className="mr-2 w-16 text-center flex-shrink-0">
                                                    <span className="font-mono text-indigo-700">10%</span>
                                                </div>
                                                <span className="text-sm">= dividir por 10</span>
                                            </div>
                                            <div className="p-2 bg-indigo-50 rounded-md flex items-center">
                                                <div className="mr-2 w-16 text-center flex-shrink-0">
                                                    <span className="font-mono text-indigo-700">25%</span>
                                                </div>
                                                <span className="text-sm">= dividir por 4</span>
                                            </div>
                                            <div className="p-2 bg-indigo-50 rounded-md flex items-center">
                                                <div className="mr-2 w-16 text-center flex-shrink-0">
                                                    <span className="font-mono text-indigo-700">50%</span>
                                                </div>
                                                <span className="text-sm">= dividir por 2</span>
                                            </div>
                                            <div className="p-2 bg-indigo-50 rounded-md flex items-center">
                                                <div className="mr-2 w-16 text-center flex-shrink-0">
                                                    <span className="font-mono text-indigo-700">100%</span>
                                                </div>
                                                <span className="text-sm">= valor original</span>
                                            </div>
                                            <div className="p-2 bg-indigo-50 rounded-md flex items-center">
                                                <div className="mr-2 w-16 text-center flex-shrink-0">
                                                    <span className="font-mono text-indigo-700">200%</span>
                                                </div>
                                                <span className="text-sm">= multiplicar por 2</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-yellow-50 p-3 rounded-md border-l-4 border-yellow-400 md:w-1/2 self-start">
                                        <h5 className="font-medium text-yellow-800 mb-2">Dicas de Cálculo</h5>
                                        <ul className="text-sm space-y-2 list-disc pl-4 text-gray-700">
                                            <li>Para calcular mentalmente porcentagens, tente decompor: 15% = 10% + 5%</li>
                                            <li>Um aumento de X% seguido de uma redução de X% <strong>não</strong> retorna ao valor original</li>
                                            <li>Para converter uma fração em porcentagem, divida o numerador pelo denominador e multiplique por 100</li>
                                            <li>0,1 = 10%, 0,01 = 1%, 0,001 = 0,1% (mova a vírgula duas casas para a direita)</li>
                                        </ul>
                                    </div>
                                </div>
                                
                                <div className="mt-4 p-3 bg-indigo-50 rounded-md border border-indigo-100">
                                    <h5 className="font-medium text-indigo-800 mb-1 flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                        </svg>
                                        Curiosidade Matemática
                                    </h5>
                                    <p className="text-sm text-indigo-700">
                                        A palavra "porcentagem" vem do latim "per centum", que significa "por cento" ou "a cada cem". O símbolo % que usamos hoje foi desenvolvido a partir de uma abreviação da expressão "per cento" (p. cento), que eventualmente se transformou no símbolo que conhecemos.
                                    </p>
                                </div>
                            </ConceitoMatematico>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ResolvedorPorcentagem;