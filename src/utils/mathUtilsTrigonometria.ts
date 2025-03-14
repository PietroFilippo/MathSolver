// Importações compartilhadas
import {
    formatInterval,
    replacePi,
    processImplicitMultiplications,
    evaluateTermForValue,
    formatPiValue,
    evaluateExpression
  } from './mathUtils';
  
  // Importa parser de expressões de mathUtilsCalculoGeral
  import {
    parseExpression
  } from './mathUtilsCalculo/mathUtilsCalculoGeral';
  
  // ===================================================
  // ========== CONVERSÕES BÁSICAS ANGULARES ==========
  // ===================================================
  
  // Converte graus para radianos
  export const degreesToRadians = (graus: number): number => {
      return graus * (Math.PI / 180);
  };
  
  // Converte radianos para graus 
  export const radiansToDegrees = (radianos: number): number => {
      return radianos * (180 / Math.PI);
  };
  
  // ===================================================
  // ========== PROCESSAMENTO DE INTERVALOS ===========
  // ===================================================
  
  // Analisa uma string de intervalo no formato "a,b" e retorna [a, b] em radianos
  export const parseInterval = (intervaloStr: string): [number, number] => {
      const partes = intervaloStr.split(',');
      if (partes.length !== 2) {
          throw new Error('Formato de intervalo inválido. Use o formato: início,fim');
      }
      
      try {
          // Substituir π por Math.PI e avaliar expressões
          const processarParte = (parte: string): number => {
              // Usar a função compartilhada para substituir Pi
              parte = replacePi(parte);
              
              // Caso especial para frações simples como π/4, 3π/2, etc.
              if (/^-?\s*\d*\s*Math\.PI\s*\/\s*\d+$/.test(parte)) {
                  const match = parte.match(/^(-?\s*\d*)\s*(Math\.PI)\s*\/\s*(\d+)$/);
                  if (match) {
                      const coef = match[1] ? (match[1].trim() === '-' ? -1 : parseFloat(match[1]) || 1) : 1;
                      const denom = parseInt(match[3]);
                      return coef * Math.PI / denom;
                  }
              }
              
              // Avaliar expressões complexas de forma segura
              try {
                  return Function('"use strict"; return (' + parte + ')')();
              } catch (e) {
                  throw new Error(`Expressão inválida: ${parte} - ${e}`);
              }
          };
          
          const inicio = processarParte(partes[0]);
          const fim = processarParte(partes[1]);
          
          if (isNaN(inicio) || isNaN(fim)) {
              throw new Error('Valores de intervalo inválidos');
          }
          
          return [inicio, fim];
      } catch (error) {
          throw new Error(`Erro ao processar o intervalo: ${error instanceof Error ? error.message : String(error)}`);
      }
  };
  
  // Usa as funções formatarIntervalo e formatarRadianos de mathUtils.ts
  // Não exportamos novamente para evitar confusão sobre a origem das funções
  
  // ===================================================
  // ========== AVALIAÇÃO DE EXPRESSÕES ===============
  // ===================================================
  
  // Avalia uma expressão trigonométrica para um valor específico de x.
  // Implementa análise baseada em Term com fallback para avaliação dinâmica
  export function evaluateTrigonometricExpression(expressao: string, x: number): number {
      try {
          // Tentar usar o parser de termos para avaliação
          try {
              // Pré-processar a expressão para facilitar o parsing
              let expressaoProcessada = expressao.trim();
              
              // Normalizar espaços para facilitar o processamento
              expressaoProcessada = expressaoProcessada.replace(/\s+/g, ' ');
              
              // Remover espaços desnecessários dentro de parênteses: "( x )" -> "(x)"
              expressaoProcessada = expressaoProcessada.replace(/\(\s+/g, '(').replace(/\s+\)/g, ')');
              
              // Normalizar espaços ao redor de operadores: "x + 2" -> "x+2", "y - 3" -> "y-3"
              expressaoProcessada = expressaoProcessada.replace(/(\S)\s*([+\-])\s*(\S)/g, '$1$2$3');
              
              // Processar notações especiais de funções trigonométricas
              const funcoesTrig = ['sen', 'sin', 'cos', 'tan', 'tg', 'cot', 'cotg', 'sec', 'csc'];
              for (const funcao of funcoesTrig) {
                  // Converte notações como "sen^2(x)" para "(sen(x))^2"
                  const regexFuncaoPotencia = new RegExp(`${funcao}\\^(\\d+)\\(([^)]*)\\)`, 'g');
                  expressaoProcessada = expressaoProcessada.replace(regexFuncaoPotencia, `(${funcao}($2))^$1`);
              }
              
              // Padronizar funções e operadores para o parser
              expressaoProcessada = expressaoProcessada
                  .replace(/sen\(/g, 'sin(')
                  .replace(/tg\(/g, 'tan(')
                  .replace(/cotg\(/g, 'cot(')
                  .replace(/\^/g, '**')
                  .replace(/√(\d+)/g, 'Math.sqrt($1)')
                  .replace(/√\(/g, 'Math.sqrt(')
                  .replace(/√([a-zA-Z])/g, 'Math.sqrt($1)');
              
              // Processar multiplicações implícitas
              expressaoProcessada = processImplicitMultiplications(expressaoProcessada);
              
              // Analisar a expressão usando a estrutura Term
              const termo = parseExpression(expressaoProcessada, 'x');
              
              if (termo) {
                  // Se o parsing foi bem-sucedido, avaliar o termo
                  return evaluateTermForValue(termo, 'x', x);
              }
          } catch (parseError) {
              console.error("Não foi possível analisar a expressão com o parser de termos:", parseError);
              // Em caso de falha, usar a função de avaliação unificada
          }
          
          // Usar a função de avaliação unificada
          return evaluateExpression(expressao, 'x', x);
          
      } catch (error) {
          throw new Error('Erro ao avaliar a expressão: ' + error);
      }
  };
  
  // ===================================================
  // ========== GERAÇÃO DE DADOS DE GRÁFICOS ==========
  // ===================================================
  
  // Gera pontos para um gráfico de função trigonométrica
  // Suporta funções padrão (seno, cosseno, tangente) e funções personalizadas
  export function generateTrigonometricFunctionPoints(
      tipoGrafico: 'seno' | 'cosseno' | 'tangente' | 'personalizado',
      intervalo: [number, number],
      amplitude: number = 1, 
      periodo: number = 1,
      defasagem: number = 0,
      deslocamentoVertical: number = 0,
      funcaoPersonalizada: string = '',
      numeroPontos: number = 1000
  ): { x: number; y: number; }[] {
      const [inicio, fim] = intervalo;
      const passo = (fim - inicio) / (numeroPontos - 1);
      const pontos: { x: number; y: number; }[] = [];
      
      // Fator para ajustar o período: b = 2π/T, onde T é o período desejado
      // Quando periodo = 1, a função terá período 2π (padrão)
      // Quando periodo = 2, a função terá período 4π, etc.
      const fatorPeriodo = periodo !== 0 ? 1 / periodo : 1;
      
      // Para cada ponto no intervalo
      for (let i = 0; i < numeroPontos; i++) {
          const x = inicio + i * passo;
          let y: number;
          
          try {
              // Calcula o valor de y de acordo com o tipo de gráfico
              if (tipoGrafico === 'personalizado') {
                  if (funcaoPersonalizada) {
                      y = evaluateTrigonometricExpression(funcaoPersonalizada, x);
                  } else {
                      // Se não há função personalizada, não adiciona o ponto
                      continue;
                  }
              } else {
                  // Para funções padrão: y = a * f(b * (x - c)) + d
                  // onde a = amplitude, b = fator período, c = defasagem, d = deslocamento vertical
                  const argumento = fatorPeriodo * (x - defasagem);
                  
                  if (tipoGrafico === 'seno') {
                      y = amplitude * Math.sin(argumento) + deslocamentoVertical;
                  } else if (tipoGrafico === 'cosseno') {
                      y = amplitude * Math.cos(argumento) + deslocamentoVertical;
                  } else if (tipoGrafico === 'tangente') {
                      // Para tangente, tomamos cuidado com assíntotas
                      const cosValue = Math.cos(argumento);
                      if (Math.abs(cosValue) < 1e-10) {
                          // Próximo de uma assíntota, não adiciona o ponto
                          continue;
                      }
                      y = amplitude * Math.tan(argumento) + deslocamentoVertical;
                      
                      // Limita pontos da tangente para melhor visualização
                      if (y > 10) y = 10;
                      if (y < -10) y = -10;
                  } else {
                      continue; // Tipo não reconhecido
                  }
              }
              
              // Adiciona o ponto apenas se y for um número válido
              if (isFinite(y) && !isNaN(y)) {
                  pontos.push({ x, y });
              }
          } catch (error) {
              // Ignora erros de cálculo (ex: tangente nos pontos de descontinuidade)
              continue;
          }
      }
      
      return pontos;
  }
  
  // ===================================================
  // ========== EXPLICAÇÃO PASSO A PASSO ==============
  // ===================================================
  
  // Gera passos explicativos para um gráfico de função trigonométrica
  // Fornece uma análise detalhada das propriedades da função (período, amplitude, zeros, etc.)
  export function generateGraphExplanationSteps(
      tipoGrafico: 'seno' | 'cosseno' | 'tangente' | 'personalizado',
      intervalo: [number, number],
      amplitude: number = 1,
      periodo: number = 1,
      defasagem: number = 0,
      deslocamentoVertical: number = 0,
      funcaoPersonalizada: string = ''
  ): string[] {
      const calculationSteps: string[] = [];
      
      // Usar a função formatPiValue para formatar números
      const formatarNumero = (num: number): string => formatPiValue(num, 2, false);
      
      // Passo 1: Identificar o tipo de função e sua forma geral
      let stepCount = 1;
      
      calculationSteps.push(`Passo ${stepCount}: Identificar o tipo de função e sua forma geral`);
      
      if (tipoGrafico === 'personalizado') {
          calculationSteps.push(`Função personalizada: ${funcaoPersonalizada}`);
      } else {
          let funcaoBase = '';
          let formula = '';
          
          switch (tipoGrafico) {
              case 'seno':
                  funcaoBase = 'f(x) = sen(x)';
                  formula = `f(x) = ${amplitude !== 1 ? amplitude : ''} · sen(${periodo !== 1 ? formatarNumero(1/periodo) + ' · ' : ''}(x ${defasagem !== 0 ? (defasagem > 0 ? '- ' + formatarNumero(defasagem) : '+ ' + formatarNumero(-defasagem)) : ''}))${deslocamentoVertical !== 0 ? (deslocamentoVertical > 0 ? ' + ' + formatarNumero(deslocamentoVertical) : ' - ' + formatarNumero(-deslocamentoVertical)) : ''}`;
                  break;
              case 'cosseno':
                  funcaoBase = 'f(x) = cos(x)';
                  formula = `f(x) = ${amplitude !== 1 ? amplitude : ''} · cos(${periodo !== 1 ? formatarNumero(1/periodo) + ' · ' : ''}(x ${defasagem !== 0 ? (defasagem > 0 ? '- ' + formatarNumero(defasagem) : '+ ' + formatarNumero(-defasagem)) : ''}))${deslocamentoVertical !== 0 ? (deslocamentoVertical > 0 ? ' + ' + formatarNumero(deslocamentoVertical) : ' - ' + formatarNumero(-deslocamentoVertical)) : ''}`;
                  break;
              case 'tangente':
                  funcaoBase = 'f(x) = tan(x)';
                  formula = `f(x) = ${amplitude !== 1 ? amplitude : ''} · tan(${periodo !== 1 ? formatarNumero(1/periodo) + ' · ' : ''}(x ${defasagem !== 0 ? (defasagem > 0 ? '- ' + formatarNumero(defasagem) : '+ ' + formatarNumero(-defasagem)) : ''}))${deslocamentoVertical !== 0 ? (deslocamentoVertical > 0 ? ' + ' + formatarNumero(deslocamentoVertical) : ' - ' + formatarNumero(-deslocamentoVertical)) : ''}`;
                  break;
          }
          
          calculationSteps.push(`Função básica: ${funcaoBase}`);
          calculationSteps.push(`Função completa: ${formula}`);
      }
      
      // Passo 2: Analisar o domínio e intervalo
      stepCount++;
      calculationSteps.push(`Passo ${stepCount}: Analisar o domínio e o intervalo`);
      
      const inicioFormatado = formatInterval(intervalo[0]);
      const fimFormatado = formatInterval(intervalo[1]);
      
      calculationSteps.push(`Intervalo selecionado: [${inicioFormatado}, ${fimFormatado}]`);
      
      if (tipoGrafico === 'tangente') {
          calculationSteps.push(`A função tangente tem assíntotas verticais em x = (2n+1)π/2, onde n é um inteiro.`);
          
          // Identificar assíntotas no intervalo
          const assintotas = [];
          for (let n = -100; n <= 100; n++) {
              const assintota = (n + 0.5) * Math.PI;
              if (assintota >= intervalo[0] && assintota <= intervalo[1]) {
                  assintotas.push(formatInterval(assintota));
              }
          }
          
          if (assintotas.length > 0) {
              calculationSteps.push(`Assíntotas no intervalo: x = ${assintotas.join(', x = ')}`);
          } else {
              calculationSteps.push(`Não há assíntotas no intervalo selecionado.`);
          }
      }
      
      // Passo 3: Analisar as propriedades da função
      stepCount++;
      calculationSteps.push(`Passo ${stepCount}: Analisar as propriedades da função`);
      
      if (tipoGrafico !== 'personalizado') {
          // Amplitude
          if (amplitude !== 1) {
              calculationSteps.push(`Amplitude: |${amplitude}| = ${Math.abs(amplitude)}`);
              if (amplitude < 0) {
                  calculationSteps.push(`Como a amplitude é negativa, o gráfico está invertido verticalmente (refletido sobre o eixo x).`);
              }
          } else {
              calculationSteps.push(`Amplitude: 1 (padrão)`);
          }
          
          // Período
          let periodoReal = 0;
          switch (tipoGrafico) {
              case 'seno':
              case 'cosseno':
                  periodoReal = 2 * Math.PI * periodo;
                  break;
              case 'tangente':
                  periodoReal = Math.PI * periodo;
                  break;
          }
          
          calculationSteps.push(`Período: ${formatarNumero(periodoReal)}`);
          
          if (periodo !== 1) {
              if (periodo > 1) {
                  calculationSteps.push(`Como o período é maior que o padrão, o gráfico está esticado horizontalmente.`);
              } else {
                  calculationSteps.push(`Como o período é menor que o padrão, o gráfico está comprimido horizontalmente.`);
              }
          }
          
          // Defasagem
          if (defasagem !== 0) {
              const direcao = defasagem > 0 ? 'direita' : 'esquerda';
              calculationSteps.push(`Defasagem: ${formatarNumero(Math.abs(defasagem))} para a ${direcao}`);
          } else {
              calculationSteps.push(`Defasagem: 0 (não há deslocamento horizontal)`);
          }
          
          // Deslocamento vertical
          if (deslocamentoVertical !== 0) {
              const direcao = deslocamentoVertical > 0 ? 'cima' : 'baixo';
              calculationSteps.push(`Deslocamento vertical: ${Math.abs(deslocamentoVertical)} para ${direcao}`);
          } else {
              calculationSteps.push(`Deslocamento vertical: 0 (não há deslocamento vertical)`);
          }
      } else {
          calculationSteps.push(`Para funções personalizadas, as propriedades dependem da expressão específica.`);
          calculationSteps.push(`Expressão: ${funcaoPersonalizada}`);
      }
      
      // Passo 4: Valores notáveis
      stepCount++;
      calculationSteps.push(`Passo ${stepCount}: Calcular valores notáveis`);
      
      if (tipoGrafico !== 'personalizado') {
          // Para seno e cosseno, calcular zeros, máximos e mínimos no intervalo
          if (tipoGrafico === 'seno' || tipoGrafico === 'cosseno') {
              try {
                  // Zeros (onde f(x) = 0)
                  const zeros = [];
                  let k = -100;
                  
                  while (k <= 100) {
                      let zero = 0;
                      
                      if (tipoGrafico === 'seno') {
                          // sen(x) = 0 quando x = nπ
                          zero = k * Math.PI;
                          
                          // Ajuste para defasagem e período
                          zero = zero * periodo + defasagem;
                      } else {
                          // cos(x) = 0 quando x = (2n+1)π/2
                          zero = (k + 0.5) * Math.PI;
                          
                          // Ajuste para defasagem e período
                          zero = zero * periodo + defasagem;
                      }
                      
                      // Verificar se está no intervalo
                      if (zero >= intervalo[0] && zero <= intervalo[1]) {
                          zeros.push(formatInterval(zero));
                      }
                      
                      k++;
                  }
                  
                  // Verificar se há deslocamento vertical que afeta os zeros
                  if (deslocamentoVertical !== 0) {
                      calculationSteps.push(`Com o deslocamento vertical de ${deslocamentoVertical}, os zeros da função original não correspondem mais aos zeros da função deslocada.`);
                  } else if (zeros.length > 0) {
                      calculationSteps.push(`Zeros da função no intervalo: x = ${zeros.join(', x = ')}`);
                  } else {
                      calculationSteps.push(`Não existem zeros da função no intervalo selecionado.`);
                  }
                  
                  // Valores máximos e mínimos
                  const maximos: Array<{x: string, y: number}> = [];
                  const minimos: Array<{x: string, y: number}> = [];
                  k = -100;
                  
                  while (k <= 100) {
                      let maximo = 0;
                      let minimo = 0;
                      
                      if (tipoGrafico === 'seno') {
                          // sen(x) tem máximos em x = π/2 + 2nπ
                          maximo = Math.PI/2 + k * 2 * Math.PI;
                          
                          // sen(x) tem mínimos em x = 3π/2 + 2nπ
                          minimo = 3 * Math.PI/2 + k * 2 * Math.PI;
                      } else {
                          // cos(x) tem máximos em x = 2nπ
                          maximo = k * 2 * Math.PI;
                          
                          // cos(x) tem mínimos em x = (2n+1)π
                          minimo = (k * 2 + 1) * Math.PI;
                      }
                      
                      // Ajuste para defasagem e período
                      maximo = maximo * periodo + defasagem;
                      minimo = minimo * periodo + defasagem;
                      
                      // Verificar se está no intervalo
                      if (maximo >= intervalo[0] && maximo <= intervalo[1]) {
                          maximos.push({
                              x: formatInterval(maximo),
                              y: amplitude + deslocamentoVertical
                          });
                      }
                      
                      if (minimo >= intervalo[0] && minimo <= intervalo[1]) {
                          minimos.push({
                              x: formatInterval(minimo),
                              y: -amplitude + deslocamentoVertical
                          });
                      }
                      
                      k++;
                  }
                  
                  // Se a amplitude for negativa, troca máximos e mínimos
                  if (amplitude < 0) {
                      maximos.forEach((_max, i) => {
                          maximos[i].y = -amplitude + deslocamentoVertical;
                      });
                      
                      minimos.forEach((_min, i) => {
                          minimos[i].y = amplitude + deslocamentoVertical;
                      });
                  }
                  
                  if (maximos.length > 0) {
                      calculationSteps.push(`Valores máximos no intervalo: ${maximos.map(max => `f(${max.x}) = ${max.y}`).join(', ')}`);
                  }
                  
                  if (minimos.length > 0) {
                      calculationSteps.push(`Valores mínimos no intervalo: ${minimos.map(min => `f(${min.x}) = ${min.y}`).join(', ')}`);
                  }
                  
              } catch (error) {
                  calculationSteps.push(`Não foi possível calcular valores notáveis: ${error}`);
              }
          } else if (tipoGrafico === 'tangente') {
              // Para tangente, calcular zeros no intervalo
              const zeros = [];
              let k = -100;
              
              while (k <= 100) {
                  // tan(x) = 0 quando x = nπ
                  let zero = k * Math.PI;
                  
                  // Ajuste para defasagem e período
                  zero = zero * periodo + defasagem;
                  
                  // Verificar se está no intervalo
                  if (zero >= intervalo[0] && zero <= intervalo[1]) {
                      zeros.push(formatInterval(zero));
                  }
                  
                  k++;
              }
              
              if (deslocamentoVertical !== 0) {
                  calculationSteps.push(`Com o deslocamento vertical de ${deslocamentoVertical}, os zeros da função original não correspondem mais aos zeros da função deslocada.`);
              } else if (zeros.length > 0) {
                  calculationSteps.push(`Zeros da função no intervalo: x = ${zeros.join(', x = ')}`);
              } else {
                  calculationSteps.push(`Não existem zeros da função no intervalo selecionado.`);
              }
          }
      } else {
          calculationSteps.push(`Para funções personalizadas, é necessária uma análise específica da expressão.`);
      }
      
      // Passo 5: Conclusão
      stepCount++;
      calculationSteps.push(`Passo ${stepCount}: Conclusão`);
      
      return calculationSteps;
  }
  
  // ===================================================
  // ================= EXEMPLOS ÚTEIS =================
  // ===================================================
  
  // Exemplos para a calculadora de funções trigonométricas
  export function getTrigonometricFunctionExamples() {
    return [
      {
        type: 'sin',
        inputValue: '30',
        inputUnit: 'degrees',
        outputUnit: 'degrees',
        description: 'sen(30°) - Ângulo notável'
      },
      {
        type: 'sin',
        inputValue: '45',
        inputUnit: 'degrees',
        outputUnit: 'radians',
        description: 'sen(45°) em radianos'
      },
      {
        type: 'cos',
        inputValue: '60',
        inputUnit: 'degrees',
        outputUnit: 'degrees',
        description: 'cos(60°) - Ângulo notável'
      },
      {
        type: 'cos',
        inputValue: 'π/3',
        inputUnit: 'radians',
        outputUnit: 'degrees', 
        description: 'cos(π/3) em graus'
      },
      {
        type: 'tan',
        inputValue: '45',
        inputUnit: 'degrees',
        outputUnit: 'degrees',
        description: 'tan(45°) = 1'
      },
      {
        type: 'asin',
        inputValue: '0.5',
        outputUnit: 'degrees',
        description: 'arcsen(0.5) = 30°'
      },
      {
        type: 'acos',
        inputValue: '0.5',
        outputUnit: 'radians',
        description: 'arccos(0.5) = π/3'
      },
      {
        type: 'atan',
        inputValue: '1',
        outputUnit: 'degrees',
        description: 'arctan(1) = 45°'
      },
      {
        type: 'sin',
        inputValue: 'π/6',
        inputUnit: 'radians',
        outputUnit: 'degrees',
        description: 'sen(π/6) = 0.5'
      },
      {
        type: 'cos',
        inputValue: '0',
        inputUnit: 'degrees',
        outputUnit: 'degrees',
        description: 'cos(0°) = 1'
      }
    ];
  }
  
  // Exemplos para a calculadora de equações trigonométricas
  export function getTrigonometricEquationExamples() {
    return [
      {
        equation: 'sen(x) = 0',
        interval: '0,2π',
        description: 'Zeros do seno'
      },
      {
        equation: 'cos(x) = 0',
        interval: '0,2π',
        description: 'Zeros do cosseno'
      },
      {
        equation: 'tan(x) = 0',
        interval: '0,2π',
        description: 'Zeros da tangente'
      },
      {
        equation: 'sen(x) = 0.5',
        interval: '0,2π',
        description: 'sen(x) = 0.5'
      },
      {
        equation: 'cos(x) = 0.5',
        interval: '0,2π',
        description: 'cos(x) = 0.5'
      },
      {
        equation: 'sen(2x) = 0',
        interval: '0,2π',
        description: 'sen(2x) = 0'
      },
      {
        equation: 'cos(x/2) = 0',
        interval: '0,2π',
        description: 'cos(x/2) = 0'
      },
      {
        equation: '2sen(x) = 1',
        interval: '0,2π',
        description: '2sen(x) = 1'
      },
      {
        equation: 'sen^2(x) = 0.25',
        interval: '0,2π',
        description: 'sen²(x) = 0.25'
      },
      {
        equation: 'cos(x) + 1 = 0',
        interval: '0,2π',
        description: 'cos(x) + 1 = 0'
      }
    ];
  }
  
  // Exemplos para a calculadora de gráficos trigonométricos
  export function getTrigonometricGraphExamples() {
    return [
      {
        type: 'seno',
        interval: [-Math.PI, Math.PI],
        amplitude: 1,
        periodo: 1,
        defasagem: 0,
        deslocamentoVertical: 0,
        description: 'Seno básico: f(x) = sen(x)'
      },
      {
        type: 'cosseno',
        interval: [-Math.PI, Math.PI],
        amplitude: 1,
        periodo: 1,
        defasagem: 0,
        deslocamentoVertical: 0,
        description: 'Cosseno básico: f(x) = cos(x)'
      },
      {
        type: 'tangente',
        interval: [-Math.PI, Math.PI],
        amplitude: 1,
        periodo: 1,
        defasagem: 0,
        deslocamentoVertical: 0,
        description: 'Tangente básica: f(x) = tan(x)'
      },
      {
        type: 'seno',
        interval: [-2*Math.PI, 2*Math.PI],
        amplitude: 2,
        periodo: 1,
        defasagem: 0,
        deslocamentoVertical: 0,
        description: 'Seno com amplitude 2: f(x) = 2sen(x)'
      },
      {
        type: 'cosseno',
        interval: [-2*Math.PI, 2*Math.PI],
        amplitude: 0.5,
        periodo: 1,
        defasagem: 0,
        deslocamentoVertical: 0,
        description: 'Cosseno com amplitude 0.5: f(x) = 0.5cos(x)'
      },
      {
        type: 'seno',
        interval: [-2*Math.PI, 2*Math.PI],
        amplitude: 1,
        periodo: 2,
        defasagem: 0,
        deslocamentoVertical: 0,
        description: 'Seno com período 4π: f(x) = sen(x/2)'
      },
      {
        type: 'cosseno',
        interval: [-2*Math.PI, 2*Math.PI],
        amplitude: 1,
        periodo: 0.5,
        defasagem: 0,
        deslocamentoVertical: 0,
        description: 'Cosseno com período π: f(x) = cos(2x)'
      },
      {
        type: 'seno',
        interval: [-2*Math.PI, 2*Math.PI],
        amplitude: 1,
        periodo: 1,
        defasagem: Math.PI/2,
        deslocamentoVertical: 0,
        description: 'Seno com defasagem π/2: f(x) = sen(x-π/2)'
      },
      {
        type: 'seno',
        interval: [-2*Math.PI, 2*Math.PI],
        amplitude: 1,
        periodo: 1,
        defasagem: 0,
        deslocamentoVertical: 2,
        description: 'Seno com deslocamento vertical: f(x) = sen(x) + 2'
      },
      {
        type: 'personalizado',
        interval: [-2*Math.PI, 2*Math.PI],
        funcaoPersonalizada: 'sen(x) * cos(x)',
        description: 'Personalizada: f(x) = sen(x)cos(x)'
      }
    ];
  } 