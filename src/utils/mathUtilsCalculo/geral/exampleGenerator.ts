// ===================================================
// ============== GERADOR DE EXEMPLOS ================
// ===================================================

// Gera pontos aleatórios dentro de um intervalo especificado para métodos de aproximação numérica
// Útil para integração de Monte Carlo, limites numéricos, etc.
export const generateRandomPoints = (min: number, max: number, count: number): number[] => {
  if (min >= max) {
    throw new Error('O valor mínimo deve ser menor que o valor máximo');
  }
  
  if (count <= 0) {
    throw new Error('A quantidade deve ser um número positivo');
  }
  
  const range = max - min;
  const points: number[] = [];
  
  for (let i = 0; i < count; i++) {
    const randomValue = min + Math.random() * range;
    points.push(randomValue);
  }
  
  // Ordena os pontos para facilitar o uso em alguns algoritmos
  return points.sort((a, b) => a - b);
};

// Função unificada para gerar exemplos para diferentes tipos de cálculo
export const getMathExamples = (
  type: 'derivative' | 'integral' | 'definiteIntegral'
): string[] | Array<{funcao: string, limiteInferior: string, limiteSuperior: string}> => {
  switch (type) {
    case 'derivative':
      return [
        'x^2 + 3x',
        'x^3 - 2x^2 + 5x - 3',
        'sin(x)',
        'cos(x)',
        'e^(x)',
        'ln(x)',
        'ln(x^2)',
        'x / (x^2 + 1)',
        'sin(x) * cos(x)',
        'e^(x) * sin(x)',
        'x^2 * ln(x)',
        '(x^2 + 1) / (x - 1)'
      ];
      
    case 'integral':
      return [
        'x^2',
        'x^3 - 2x^2 + 5x - 3',
        'sin(x)',
        'cos(x)',
        'cos(x)^2',
        'sin(x^2)',  // Fresnel Integral seno
        'cos(x^2)',  // Fresnel Integral cosseno
        'e^(x)',
        'ln(x)',
        '1/x',
        '1/(x^2 + 1)',
        'e^x/(1+e^x)',
        'x / (x^2 + 1)',
        '3x^2 + 2x',
        'x * sin(x)',
        'x * ln(x)',
        '√x',  // Usando símbolo de raiz quadrada
        'sqrt(x+1)',
        '1/sqrt(1-x^2)',
        '√(x^2+1)'  // Usando símbolo de raiz quadrada
      ];
      
    case 'definiteIntegral':
      return [
        {funcao: 'x^2', limiteInferior: '0', limiteSuperior: '1'},
        {funcao: 'sin(x)', limiteInferior: '0', limiteSuperior: 'π/2'},
        {funcao: 'x', limiteInferior: '0', limiteSuperior: '5'},
        {funcao: 'e^x', limiteInferior: '0', limiteSuperior: '1'},
        {funcao: '1/x', limiteInferior: '1', limiteSuperior: '2'},
        {funcao: 'x^3', limiteInferior: '-1', limiteSuperior: '1'},
        {funcao: '4x^2 + 2x', limiteInferior: '0', limiteSuperior: '3'},
        {funcao: 'cos(x)', limiteInferior: '0', limiteSuperior: 'π'}
      ];
      
    default:
      return [];
  }
}; 