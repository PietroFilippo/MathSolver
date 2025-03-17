import React from 'react';
import { HiCalculator, HiInformationCircle } from 'react-icons/hi';
import { useDispersionSolver } from '../../hooks/estatistica/useDispersoesSolver';
import { getDispersionExamples } from '../../utils/mathUtilsEstatistica';
import StepByStepExplanation from '../../components/StepByStepExplanation';
import ConceitoMatematico from '../../components/ConceitoMatematico';

const ResolvedorDispersoes: React.FC = () => {
    const { state, dispatch, handleSolve, applyExample, setDispersionType } = useDispersionSolver();

    // Função que filtra exemplos baseado no tipo de dispersão selecionado
    const getFilteredExamples = () => {
        return getDispersionExamples().filter(example => example.type === state.dispersionType);
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center mb-6">
                <HiCalculator className="h-6 w-6 text-indigo-600 mr-2" />
                <h2 className="text-2xl font-bold">Medidas de Dispersão</h2>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-8">
                <p className="text-gray-700 mb-6">
                    Calcule diferentes medidas de dispersão estatística para um conjunto de dados.
                </p>
                
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Números (separados por vírgula):
                    </label>
                    <input
                        type="text"
                        value={state.data}
                        onChange={(e) => dispatch({ type: 'SET_DATA', data: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Ex: 10, 15, 20, 25"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                        Digite os números separados por vírgula. Ex: 10, 15, 20, 25
                    </p>
                </div>

                <div className="mb-6">
                    <p className="block text-sm font-medium text-gray-700 mb-2">Tipo de cálculo:</p>
                    <div className="flex flex-wrap gap-4">
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                checked={state.dispersionType === 'desvioMedio'}
                                onChange={() => setDispersionType('desvioMedio')}
                                className="form-radio text-indigo-600"
                            />
                            <span className="ml-2">Desvio Médio</span>
                        </label>
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                checked={state.dispersionType === 'variancia'}
                                onChange={() => setDispersionType('variancia')}
                                className="form-radio text-indigo-600"
                            />
                            <span className="ml-2">Variância</span>
                        </label>
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                checked={state.dispersionType === 'desvioPadrao'}
                                onChange={() => setDispersionType('desvioPadrao')}
                                className="form-radio text-indigo-600"
                            />
                            <span className="ml-2">Desvio Padrão</span>
                        </label>
                    </div>
                </div>

                {/* Exemplos de conjuntos de dados */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Exemplos
                    </label>
                    <div className="flex flex-wrap gap-2 mb-4">
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
                            {state.dispersionType === 'desvioMedio' && (
                                <>Desvio Médio: <span className="font-bold">{state.result}</span></>
                            )}
                            {state.dispersionType === 'variancia' && (
                                <>Variância: <span className="font-bold">{state.result}</span></>
                            )}
                            {state.dispersionType === 'desvioPadrao' && (
                                <>Desvio Padrão: <span className="font-bold">{state.result}</span></>
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
                            
                            <StepByStepExplanation steps={state.steps} stepType="linear" />

                            <ConceitoMatematico
                                title="Conceito Matemático"
                                isOpen={state.showConceitoMatematico}
                                onToggle={() => dispatch({ type: 'TOGGLE_CONCEITO_MATEMATICO' })}
                            >
                                <div className="flex flex-col md:flex-row gap-4 mb-4">
                                    <div className="flex-1">
                                        <h5 className="font-medium text-gray-800 mb-2 border-b border-gray-200 pb-1">
                                            {state.dispersionType === 'desvioMedio' && 'Desvio Médio'}
                                            {state.dispersionType === 'variancia' && 'Variância'}
                                            {state.dispersionType === 'desvioPadrao' && 'Desvio Padrão'}
                                        </h5>
                                        
                                        {state.dispersionType === 'desvioMedio' && (
                                            <div className="space-y-3">
                                                <p className="text-gray-700">
                                                    O Desvio Médio é uma medida de dispersão que representa a média das diferenças
                                                    absolutas entre cada valor e a média aritmética do conjunto de dados.
                                                </p>
                                                <div className="bg-white p-3 rounded-md border border-gray-100 shadow-sm">
                                                    <h6 className="text-indigo-700 font-medium mb-2">Fórmula</h6>
                                                    <div className="text-center font-medium text-indigo-700">
                                                        <p>DM = Σ|x<sub>i</sub> - μ| / n</p>
                                                        <p className="text-sm mt-1">Onde μ é a média e n é o número de valores</p>
                                                    </div>
                                                </div>
                                                <div className="p-3 bg-indigo-50 rounded-md">
                                                    <p className="text-sm text-indigo-700">
                                                        <span className="font-medium">Interpretação:</span> Quanto maior o desvio médio, 
                                                        maior a variabilidade dos dados em relação à média.
                                                    </p>
                                                    <p className="text-sm text-indigo-700 mt-2">
                                                        <span className="font-medium">Aplicações práticas:</span> O desvio médio é útil em 
                                                        análise de processos industriais, controle de qualidade e avaliação de consistência em 
                                                        medições. É preferido em alguns contextos por sua facilidade de cálculo e menor 
                                                        sensibilidade a valores extremos.
                                                    </p>
                                                    <p className="text-sm text-indigo-700 mt-2">
                                                        <span className="font-medium">Comparação:</span> Embora o desvio padrão seja mais comum 
                                                        em análises estatísticas formais, o desvio médio é mais intuitivo para não-especialistas 
                                                        e mantém a mesma unidade dos dados originais. Em distribuições com valores atípicos extremos, 
                                                        o desvio médio pode oferecer uma medida mais robusta da dispersão típica.
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                        
                                        {state.dispersionType === 'variancia' && (
                                            <div className="space-y-3">
                                                <p className="text-gray-700">
                                                    A Variância é uma medida de dispersão que representa a média dos quadrados
                                                    das diferenças entre cada valor e a média aritmética do conjunto de dados.
                                                </p>
                                                <div className="bg-white p-3 rounded-md border border-gray-100 shadow-sm">
                                                    <h6 className="text-indigo-700 font-medium mb-2">Fórmula</h6>
                                                    <div className="text-center font-medium text-indigo-700">
                                                        <p>σ² = Σ(x<sub>i</sub> - μ)² / n</p>
                                                        <p className="text-sm mt-1">Onde μ é a média e n é o número de valores</p>
                                                    </div>
                                                </div>
                                                <div className="p-3 bg-indigo-50 rounded-md">
                                                    <p className="text-sm text-indigo-700">
                                                        <span className="font-medium">Interpretação:</span> A variância tem unidades 
                                                        quadradas em relação aos dados originais, o que pode dificultar a interpretação.
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                        
                                        {state.dispersionType === 'desvioPadrao' && (
                                            <div className="space-y-3">
                                                <p className="text-gray-700">
                                                    O Desvio Padrão é a raiz quadrada da variância e representa a dispersão dos
                                                    valores em relação à média. É muito utilizado por ter a mesma unidade de medida
                                                    dos dados originais, facilitando a interpretação.
                                                </p>
                                                <div className="bg-white p-3 rounded-md border border-gray-100 shadow-sm">
                                                    <h6 className="text-indigo-700 font-medium mb-2">Fórmula</h6>
                                                    <div className="text-center font-medium text-indigo-700">
                                                        <p>σ = √σ² = √[Σ(x<sub>i</sub> - μ)² / n]</p>
                                                        <p className="text-sm mt-1">Onde μ é a média e n é o número de valores</p>
                                                    </div>
                                                </div>
                                                <div className="p-3 bg-indigo-50 rounded-md">
                                                    <p className="text-sm text-indigo-700">
                                                        <span className="font-medium">Interpretação:</span> Dados com distribuição normal têm 
                                                        aproximadamente 68% dos valores a até um desvio padrão da média, 95% a até dois 
                                                        desvios padrão e 99,7% a até três desvios padrão.
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="flex-1">
                                        <h5 className="font-medium text-gray-800 mb-2 border-b border-gray-200 pb-1">Aplicações e Comparações</h5>
                                        <div className="p-3 bg-white rounded-md border border-gray-100 shadow-sm">
                                            <h6 className="text-indigo-700 font-medium mb-2">Quando Usar Cada Medida</h6>
                                            <div className="space-y-2">
                                                <div className="p-2 bg-blue-50 rounded-md">
                                                    <span className="font-medium text-blue-700">Desvio Médio</span>
                                                    <ul className="text-xs list-disc pl-4 mt-1 text-gray-700">
                                                        <li>Fácil de calcular e entender</li>
                                                        <li>Menos sensível a valores extremos que o desvio padrão</li>
                                                        <li>Útil para distribuições simétricas</li>
                                                    </ul>
                                                </div>
                                                <div className="p-2 bg-purple-50 rounded-md">
                                                    <span className="font-medium text-purple-700">Variância</span>
                                                    <ul className="text-xs list-disc pl-4 mt-1 text-gray-700">
                                                        <li>Importante para análises estatísticas avançadas</li>
                                                        <li>Base para muitos testes estatísticos</li>
                                                        <li>Unidades ao quadrado dificultam interpretação direta</li>
                                                    </ul>
                                                </div>
                                                <div className="p-2 bg-green-50 rounded-md">
                                                    <span className="font-medium text-green-700">Desvio Padrão</span>
                                                    <ul className="text-xs list-disc pl-4 mt-1 text-gray-700">
                                                        <li>Medida de dispersão mais utilizada</li>
                                                        <li>Mesma unidade dos dados originais</li>
                                                        <li>Importante para distribuição normal e inferência estatística</li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="p-3 mt-4 bg-yellow-50 rounded-md border-l-4 border-yellow-400">
                                            <h6 className="font-medium text-yellow-800 mb-1">Interpretação Comparativa</h6>
                                            <p className="text-sm text-gray-700 mb-2">
                                                Para comparar a dispersão entre diferentes conjuntos de dados, considere:
                                            </p>
                                            <ul className="text-sm space-y-1 list-disc pl-4 text-gray-700">
                                                <li>Para conjuntos com mesma unidade, compare diretamente os desvios padrão</li>
                                                <li>Para conjuntos com unidades diferentes, use o coeficiente de variação (CV)</li>
                                                <li>Quanto maior o desvio padrão em relação à média, maior a heterogeneidade dos dados</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-white p-3 rounded-md border border-gray-100 shadow-sm">
                                        <h5 className="font-medium text-gray-800 mb-2">Relação com Outras Medidas</h5>
                                        <div className="space-y-2">
                                            <div className="p-3 bg-indigo-50 rounded-md">
                                                <h6 className="font-medium text-indigo-700 mb-1">Coeficiente de Variação (CV)</h6>
                                                <p className="text-sm text-gray-700">
                                                    CV = (Desvio Padrão / Média) × 100%<br />
                                                    Permite comparar a dispersão relativa entre conjuntos com diferentes médias ou unidades.
                                                </p>
                                            </div>
                                            <div className="p-3 bg-indigo-50 rounded-md">
                                                <h6 className="font-medium text-indigo-700 mb-1">Variância Populacional e Amostral</h6>
                                                <p className="text-sm text-gray-700">
                                                    Variância Populacional: divisor é n (tamanho da população)<br />
                                                    Variância Amostral: divisor é n-1 (graus de liberdade)
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-3 bg-indigo-50 rounded-md border border-indigo-100">
                                        <h5 className="font-medium text-indigo-800 mb-2 flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                            </svg>
                                            Aplicações Práticas
                                        </h5>
                                        <ul className="text-sm space-y-2 list-disc pl-4 text-indigo-700">
                                            <li>Controle de qualidade: monitoramento da consistência de produtos</li>
                                            <li>Análise de investimentos: avaliação da volatilidade de ativos</li>
                                            <li>Ciências sociais: medição da desigualdade social e econômica</li>
                                            <li>Meteorologia: análise da variabilidade climática</li>
                                            <li>Farmacologia: avaliação da consistência no efeito de medicamentos</li>
                                        </ul>
                                    </div>
                                </div>
                            </ConceitoMatematico>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ResolvedorDispersoes;
