import React, { useState } from 'react';

const ResolvedorGraficosTrigonometricos: React.FC = () => {
  const [funcao, setFuncao] = useState<string>('');
  const [tipoGrafico, setTipoGrafico] = useState<'seno' | 'cosseno' | 'tangente' | 'personalizado'>('seno');
  const [amplitude, setAmplitude] = useState<string>('1');
  const [periodo, setPeriodo] = useState<string>('1');
  const [defasagem, setDefasagem] = useState<string>('0');
  const [deslocamentoVertical, setDeslocamentoVertical] = useState<string>('0');
  const [intervalo, setIntervalo] = useState<string>('0,2π');
  const [resultado, setResultado] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  const gerarGrafico = () => {
    // Limpar resultados anteriores
    setErro(null);
    
    if (tipoGrafico === 'personalizado') {
      // Validar função personalizada
      if (!funcao.trim()) {
        setErro('Por favor, insira uma função trigonométrica.');
        return;
      }
      
      // Verificar se a função contém funções trigonométricas
      const temFuncaoTrig = /\b(sen|cos|tan|cot|sec|csc|sin|tg|cotg)\b/i.test(funcao);
      if (!temFuncaoTrig) {
        setErro('Sua entrada deve conter pelo menos uma função trigonométrica (sen, cos, tan, etc.).');
        return;
      }
    } else {
      // Validar parâmetros para funções pré-definidas
      const a = parseFloat(amplitude);
      const b = parseFloat(periodo);
      const c = parseFloat(defasagem);
      const d = parseFloat(deslocamentoVertical);
      
      if (isNaN(a) || isNaN(b) || isNaN(c) || isNaN(d)) {
        setErro('Por favor, insira valores numéricos válidos para os parâmetros.');
        return;
      }
      
      if (b === 0) {
        setErro('O período não pode ser zero.');
        return;
      }
    }
    
    // Algoritmo para gerar gráficos de funções trigonométricas
    // Implementação futura
    
    setResultado('Funcionalidade em desenvolvimento');
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Gráficos de Funções Trigonométricas</h2>
      
      <div className="mb-4">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Função</label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio"
                checked={tipoGrafico === 'seno'}
                onChange={() => setTipoGrafico('seno')}
              />
              <span className="ml-2">Seno</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio"
                checked={tipoGrafico === 'cosseno'}
                onChange={() => setTipoGrafico('cosseno')}
              />
              <span className="ml-2">Cosseno</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio"
                checked={tipoGrafico === 'tangente'}
                onChange={() => setTipoGrafico('tangente')}
              />
              <span className="ml-2">Tangente</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio"
                checked={tipoGrafico === 'personalizado'}
                onChange={() => setTipoGrafico('personalizado')}
              />
              <span className="ml-2">Personalizado</span>
            </label>
          </div>
        </div>
        
        {tipoGrafico === 'personalizado' ? (
          <div className="mb-4">
            <label htmlFor="funcao" className="block text-sm font-medium text-gray-700 mb-1">
              Função Trigonométrica
            </label>
            <input
              type="text"
              id="funcao"
              value={funcao}
              onChange={(e) => setFuncao(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Ex: 2*sen(3*x) + 1 ou cos(x)^2"
            />
            <p className="text-sm text-gray-500 mt-1">
              Use funções como sen(x), cos(x), tan(x) e operadores matemáticos.
            </p>
          </div>
        ) : (
          <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="amplitude" className="block text-sm font-medium text-gray-700 mb-1">
                Amplitude (a)
              </label>
              <input
                type="text"
                id="amplitude"
                value={amplitude}
                onChange={(e) => setAmplitude(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            
            <div>
              <label htmlFor="periodo" className="block text-sm font-medium text-gray-700 mb-1">
                Período (b)
              </label>
              <input
                type="text"
                id="periodo"
                value={periodo}
                onChange={(e) => setPeriodo(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            
            <div>
              <label htmlFor="defasagem" className="block text-sm font-medium text-gray-700 mb-1">
                Defasagem (c)
              </label>
              <input
                type="text"
                id="defasagem"
                value={defasagem}
                onChange={(e) => setDefasagem(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            
            <div>
              <label htmlFor="deslocamentoVertical" className="block text-sm font-medium text-gray-700 mb-1">
                Deslocamento Vertical (d)
              </label>
              <input
                type="text"
                id="deslocamentoVertical"
                value={deslocamentoVertical}
                onChange={(e) => setDeslocamentoVertical(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>
        )}
        
        <div className="mb-4">
          <label htmlFor="intervalo" className="block text-sm font-medium text-gray-700 mb-1">
            Intervalo para o Gráfico
          </label>
          <input
            type="text"
            id="intervalo"
            value={intervalo}
            onChange={(e) => setIntervalo(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Ex: 0,2π ou -π,π"
          />
          <p className="text-sm text-gray-500 mt-1">
            Especifique o intervalo no formato: início,fim (use π para representar pi)
          </p>
        </div>
        
        <button
          onClick={gerarGrafico}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Gerar Gráfico
        </button>
      </div>
      
      {erro && (
        <div className="p-3 bg-red-100 text-red-700 rounded-md mb-4">
          {erro}
        </div>
      )}
      
      {resultado && (
        <div className="mt-4">
          <h3 className="text-lg font-medium mb-2">Resultado:</h3>
          <div className="p-3 bg-gray-100 rounded-md h-60 flex items-center justify-center">
            <p className="text-gray-500">Visualização do gráfico em desenvolvimento</p>
          </div>
          <div className="mt-2 p-3 bg-green-100 text-green-800 rounded-md">
            {resultado}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResolvedorGraficosTrigonometricos; 