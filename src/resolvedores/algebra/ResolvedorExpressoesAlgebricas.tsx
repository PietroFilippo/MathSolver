import { useState } from 'react';
import { evaluate, parse, simplify } from 'mathjs';
import { HiCalculator } from 'react-icons/hi';
import { arredondarParaDecimais } from '../../utils/mathUtils';

// Operadores de inequação para bloquear
const OPERADORES_INEQUACAO = ['<', '>', '<=', '>=', '=', '!=', '≤', '≥'];

const ResolvedorExpressoesAlgebricas: React.FC = () => {
  const [expressao, setExpressao] = useState<string>('');
  const [variaveisEValores, setVariaveisEValores] = useState<{ [key: string]: string }>({});
  const [variaveis, setVariaveis] = useState<string[]>([]);
  const [resultado, setResultado] = useState<string | null>(null);
  const [resultadoAvaliado, setResultadoAvaliado] = useState<string | null>(null);
  const [passos, setPassos] = useState<string[]>([]);
  const [mensagemErro, setMensagemErro] = useState<string>('');
  const [exibirExplicacao, setExibirExplicacao] = useState<boolean>(true);
  const [resultadoFatorado, setResultadoFatorado] = useState<string | null>(null);
  const [podeFatorar, setPodeFatorar] = useState<boolean>(false);

  // Função para normalizar o caractere de subtração para o padrão que mathjs espera
  const normalizarExpressao = (expr: string): string => {
    // Substitui todos os possíveis caracteres de menos pelo menos padrão ASCII
    // \u2212: Minus Sign, \u2013: En Dash, \u2014: Em Dash, \u2015: Horizontal Bar
    return expr.replace(/[\u2212\u2013\u2014\u2015−]/g, '-');
  };

  // Função que valida se a expressão é uma expressão algébrica válida
  const validarExpressao = (expressao: string): boolean => {
    // Verifica se a expressão está vazia
    if (!expressao.trim()) return false;
    
    // Normaliza a expressão para converter o menos Unicode
    const expressaoNormalizada = normalizarExpressao(expressao);
    
    // Verifica se há operadores de inequação
    for (const operador of OPERADORES_INEQUACAO) {
      if (expressaoNormalizada.includes(operador)) {
        setMensagemErro(`O operador ${operador} não é permitido. Use o Resolvedor de Inequações para resolver inequações.`);
        return false;
      }
    }
    
    // Verifica se os parênteses estão balanceados
    let contadorParenteses = 0;
    for (const char of expressaoNormalizada) {
      if (char === '(') contadorParenteses++;
      if (char === ')') contadorParenteses--;
      if (contadorParenteses < 0) {
        setMensagemErro('Expressão inválida: parênteses não balanceados.');
        return false;
      }
    }
    if (contadorParenteses !== 0) {
      setMensagemErro('Expressão inválida: parênteses não balanceados.');
      return false;
    }
    
    // Verifica se a expressão contém operadores ou variáveis
    const temOperadoresOuVariaveis = /[+\-*/^a-zA-Z0-9]/.test(expressaoNormalizada);
    if (!temOperadoresOuVariaveis) {
      setMensagemErro('Expressão inválida: não contém operadores ou variáveis.');
      return false;
    }
    
    try {
      // Tenta analisar a expressão com mathjs
      parse(expressaoNormalizada);
      return true;
    } catch (error) {
      setMensagemErro(`Expressão inválida: ${error instanceof Error ? error.message : 'erro de sintaxe'}`);
      return false;
    }
  };

  // Função que extrai as variáveis da expressão
  const extrairVariaveis = (expressao: string): string[] => {
    try {
      // Normaliza a expressão primeiro
      const exprNormalizada = normalizarExpressao(expressao);
      
      // Regex para encontrar variáveis (letras isoladas ou seguidas de números como índices)
      const regex = /[a-zA-Z]+/g;
      const matches = exprNormalizada.match(regex) || [];
      
      // Filtra e remove duplicatas
      const vars = [...new Set(matches)].filter(v => 
        v !== 'sin' && v !== 'cos' && v !== 'tan' && 
        v !== 'sqrt' && v !== 'log' && v !== 'ln' &&
        v !== 'expand' && v !== 'factor'
      );
      
      return vars;
    } catch (error) {
      console.error('Erro ao extrair variáveis:', error);
      return [];
    }
  };

  // Atualiza as variáveis quando a expressão muda
  const handleExpressaoChange = (valor: string) => {
    setExpressao(valor);
    
    // Limpa qualquer mensagem de erro anterior
    setMensagemErro('');
    
    // Normaliza o valor para verificar operadores de inequação
    const valorNormalizado = normalizarExpressao(valor);
    
    // Verifica se há operadores de inequação
    for (const operador of OPERADORES_INEQUACAO) {
      if (valorNormalizado.includes(operador)) {
        setMensagemErro(`O operador ${operador} não é permitido. Use o Resolvedor de Inequações para resolver inequações.`);
        return;
      }
    }
    
    const novasVariaveis = extrairVariaveis(valor);
    setVariaveis(novasVariaveis);
    
    // Inicializa os valores das variáveis
    const novosValores: { [key: string]: string } = {};
    novasVariaveis.forEach(v => {
      novosValores[v] = variaveisEValores[v] || '';
    });
    setVariaveisEValores(novosValores);
    
    // Reseta resultados
    setResultado(null);
    setResultadoAvaliado(null);
    setPassos([]);
    setMensagemErro('');
    setPodeFatorar(false);
    setResultadoFatorado(null);
  };

  // Atualiza o valor de uma variável
  const handleValorVariavelChange = (variavel: string, valor: string) => {
    setVariaveisEValores(prev => ({
      ...prev,
      [variavel]: valor
    }));
  };

  // Avalia a expressão substituindo os valores das variáveis
  const handleAvaliar = () => {
    setMensagemErro('');
    setResultadoAvaliado(null);
    setPassos([]);
    setResultado(null);
    setResultadoFatorado(null);
    setPodeFatorar(false);
    setExibirExplicacao(true);

    try {
      // Verifica se a expressão é válida
      if (!validarExpressao(expressao)) {
        return;
      }

      // Normaliza a expressão (converte caracteres de menos Unicode)
      const expressaoNormalizada = normalizarExpressao(expressao);
      
      // Cria um objeto com os valores das variáveis para substituição
      const valores: { [key: string]: number } = {};
      const variaveisDefinidas: string[] = [];
      
      // Verifica quais variáveis têm valores definidos
      for (const variavel of variaveis) {
        const valor = variaveisEValores[variavel];
        if (valor && valor.trim() !== '') {
          const valorNumerico = parseFloat(valor);
          if (isNaN(valorNumerico)) {
            setMensagemErro(`O valor para ${variavel} não é um número válido.`);
            return;
          }
          valores[variavel] = valorNumerico;
          variaveisDefinidas.push(variavel);
        }
      }

      // Verifica se pelo menos uma variável tem valor definido
      if (variaveisDefinidas.length === 0 && variaveis.length > 0) {
        setMensagemErro('Por favor, defina o valor de pelo menos uma variável.');
        return;
      }

      // Gera os passos para mostrar como chegou ao resultado
      const passosDeCalculo = [];
      let numeroPassos = 1;
      
      passosDeCalculo.push(`Passo ${numeroPassos}: Identificar a expressão algébrica`);
      passosDeCalculo.push(`Expressão a ser avaliada: ${expressao}`);
      numeroPassos++;

      // Avalia a expressão com os valores das variáveis
      let resultadoCalculado;
      
      passosDeCalculo.push(`Passo ${numeroPassos}: Substituir as variáveis por seus valores`);
      if (variaveisDefinidas.length > 0) {
        const substituicoes = variaveisDefinidas.map(v => `${v} = ${valores[v]}`).join(', ');
        passosDeCalculo.push(`Substituindo os valores: ${substituicoes}`);
      }
      
      // Mostra as variáveis que continuam simbólicas (não substituídas)
      const variaveisSemValor = variaveis.filter(v => !variaveisDefinidas.includes(v));
      if (variaveisSemValor.length > 0) {
        passosDeCalculo.push(`Variáveis mantidas como símbolos: ${variaveisSemValor.join(', ')}`);
      }
      numeroPassos++;
      
      if (variaveisDefinidas.length === variaveis.length) {
        // Todas as variáveis têm valores - avaliação numérica completa
        passosDeCalculo.push(`Passo ${numeroPassos}: Calcular o valor numérico da expressão`);
        
        resultadoCalculado = evaluate(expressaoNormalizada, valores);
        
        if (typeof resultadoCalculado === 'number') {
          resultadoCalculado = arredondarParaDecimais(resultadoCalculado, 4);
          passosDeCalculo.push(`Avaliando a expressão com os valores: ${expressaoNormalizada} = ${resultadoCalculado}`);
        }
        numeroPassos++;
      } else {
        // Apenas algumas variáveis têm valores - substituição parcial
        passosDeCalculo.push(`Passo ${numeroPassos}: Simplificar a expressão com as variáveis substituídas`);
        numeroPassos++;
        
        try {
          // Substituição parcial usando a função algebra de mathjs
          const node = parse(expressaoNormalizada);
          const expressaoComSubstituicao = node.transform((node: any) => {
            if (node.isSymbolNode && valores[node.name] !== undefined) {
              return parse(valores[node.name].toString());
            }
            return node;
          });
          
          // Tenta simplificar após a substituição
          passosDeCalculo.push(`Expressão com substituições: ${expressaoComSubstituicao.toString()}`);
          resultadoCalculado = simplify(expressaoComSubstituicao).toString();
        } catch (err) {
          // Fallback para método mais simples
          passosDeCalculo.push(`Passo ${numeroPassos}: Substituição direta das variáveis`);
          
          const result = variaveis.reduce((expr, variavel) => {
            if (valores[variavel] !== undefined) {
              // Substitui a variável pelo valor nas posições corretas
              return expr.replace(new RegExp(`\\b${variavel}\\b`, 'g'), valores[variavel].toString());
            }
            return expr;
          }, expressaoNormalizada);
          
          passosDeCalculo.push(`Após substituição: ${result}`);
          
          // Tenta simplificar o resultado
          try {
            passosDeCalculo.push(`Passo ${numeroPassos}: Simplificar a expressão resultante`);
            numeroPassos++;
            resultadoCalculado = simplify(result).toString();
            passosDeCalculo.push(`Resultado simplificado: ${resultadoCalculado}`);
          } catch (err) {
            resultadoCalculado = result;
          }
        }
      }
      
      // Adiciona o resultado final
      const resultadoString = resultadoCalculado.toString();
      setResultadoAvaliado(resultadoString);
      
      passosDeCalculo.push(`Passo ${numeroPassos}: Resultado final`);
      passosDeCalculo.push(`O valor da expressão é: ${resultadoString}`);
      
      setPassos(passosDeCalculo);
    } catch (error) {
      console.error('Erro ao avaliar expressão:', error);
      setMensagemErro(`Erro: ${error instanceof Error ? error.message : 'Expressão inválida'}`);
    }
  };

  // Função para expandir polinômios manualmente
  const expandirManualmente = (expressao: string): string | null => {
    try {
      // Caso especial: expressão do tipo 2(5x+2)+4(2-x)
      const regexDistribuicao = /(\d+)\s*\*?\s*\(([^()]*)\)\s*([+\-])\s*(\d+)\s*\*?\s*\(([^()]*)\)/;
      const matchDistribuicao = expressao.match(regexDistribuicao);
      
      if (matchDistribuicao) {
        const [_, coef1, expr1, op, coef2, expr2] = matchDistribuicao;
        
        // Separamos os termos de cada expressão
        const termos1 = expr1.split(/([+\-])/).filter(t => t.trim());
        const termos2 = expr2.split(/([+\-])/).filter(t => t.trim());
        
        // Aplicamos a distribuição para o primeiro fator
        let resultado1 = '';
        
        for (let i = 0; i < termos1.length; i++) {
          if (termos1[i] === '+' || termos1[i] === '-') {
            // Skip operators - we look at them when processing the next term
          } else {
            // Aplicamos o coeficiente
            if (i === 0 || termos1[i-1] === '+') {
              resultado1 += `${resultado1 ? '+' : ''}(${coef1})*(${termos1[i]})`;
            } else {
              resultado1 += `-(${coef1})*(${termos1[i]})`;
            }
          }
        }
        
        // Aplicamos a distribuição para o segundo fator
        let resultado2 = '';
        
        for (let i = 0; i < termos2.length; i++) {
          if (termos2[i] === '+' || termos2[i] === '-') {
            // Skip operators
          } else {
            // Aplicamos o coeficiente
            if (i === 0 || termos2[i-1] === '+') {
              resultado2 += `${resultado2 ? '+' : ''}(${coef2})*(${termos2[i]})`;
            } else {
              resultado2 += `-(${coef2})*(${termos2[i]})`;
            }
          }
        }
        
        // Juntamos os resultados
        const sinalOp = op === '+' ? '+' : '-';
        if (resultado1 && resultado2) {
          return `${resultado1}${sinalOp}${resultado2}`;
        }
      }

      // Caso especial: potências maiores que 2
      const regexPotenciaMaior = /\(([^()]+)\)\^(\d+)/;
      const matchPotenciaMaior = expressao.match(regexPotenciaMaior);
      
      if (matchPotenciaMaior && parseInt(matchPotenciaMaior[2]) > 2) {
        const [_, base, expoente] = matchPotenciaMaior;
        const exp = parseInt(expoente);
        
        if (exp === 3) {
          // Para potência 3, expandimos diretamente (a+b)^3 = a^3 + 3a^2b + 3ab^2 + b^3
          const regexBinomio = /([^+\-]+)\s*([+\-])\s*([^+\-]+)/;
          const matchBinomio = base.match(regexBinomio);
          
          if (matchBinomio) {
            const [_, a, op, b] = matchBinomio;
            const sinal = op === '+' ? 1 : -1;
            
            // Expandimos completamente (a±b)³
            if (sinal > 0) {
              // (a+b)³ = a³ + 3a²b + 3ab² + b³
              return `(${a})^3+3*(${a})^2*(${b})+3*(${a})*(${b})^2+(${b})^3`;
            } else {
              // (a-b)³ = a³ - 3a²b + 3ab² - b³
              return `(${a})^3-3*(${a})^2*(${b})+3*(${a})*(${b})^2-(${b})^3`;
            }
          }
        }
      }
      
      // Caso para multiplicação de polinômios: (ax² + bx + c)(dx + e)
      const regexProdutoPolinomios = /\(([^()]+)\)\s*\*?\s*\(([^()]+)\)/;
      const matchProdutoPolinomios = expressao.match(regexProdutoPolinomios);
      
      if (matchProdutoPolinomios) {
        const poli1 = matchProdutoPolinomios[1];
        const poli2 = matchProdutoPolinomios[2];
        
        // Verifica se já está na forma fatorada padrão como (a+b)(a-b)
        const formaFatorada = /^([a-zA-Z])[+-]([a-zA-Z])$/.test(poli1) && 
                              /^([a-zA-Z])[+-]([a-zA-Z])$/.test(poli2);
                              
        if (formaFatorada) {
          // Não expandimos produtos que já são fatorações padrão
          return null;
        }
        
        // Dividimos os polinômios em termos
        const termosPoli1 = poli1.split(/([+\-])/).filter(t => t.trim());
        const termosPoli2 = poli2.split(/([+\-])/).filter(t => t.trim());
        
        // Construímos os termos completos com sinais
        const termosCompletos1 = [];
        const termosCompletos2 = [];
        
        // Processa termos do primeiro polinômio
        for (let i = 0; i < termosPoli1.length; i++) {
          if (termosPoli1[i] === '+' || termosPoli1[i] === '-') {
            // Skip operators
          } else {
            const sinal = i === 0 ? '+' : termosPoli1[i-1];
            termosCompletos1.push({
              sinal: sinal === '-' ? '-' : '+',
              termo: termosPoli1[i].trim()
            });
          }
        }
        
        // Processa termos do segundo polinômio
        for (let i = 0; i < termosPoli2.length; i++) {
          if (termosPoli2[i] === '+' || termosPoli2[i] === '-') {
            // Skip operators
          } else {
            const sinal = i === 0 ? '+' : termosPoli2[i-1];
            termosCompletos2.push({
              sinal: sinal === '-' ? '-' : '+',
              termo: termosPoli2[i].trim()
            });
          }
        }
        
        // Multiplica cada termo do primeiro pelo segundo
        const termosResultado = [];
        
        for (const t1 of termosCompletos1) {
          for (const t2 of termosCompletos2) {
            // Determina o sinal do produto
            const sinalResultado = t1.sinal === t2.sinal ? '+' : '-';
            
            // Cria a multiplicação
            termosResultado.push({
              sinal: sinalResultado,
              termo: `(${t1.termo})*(${t2.termo})`
            });
          }
        }
        
        // Constrói a expressão final
        let resultado = termosResultado[0].sinal === '+' 
          ? termosResultado[0].termo 
          : `-${termosResultado[0].termo}`;
        
        for (let i = 1; i < termosResultado.length; i++) {
          resultado += `${termosResultado[i].sinal}${termosResultado[i].termo}`;
        }
        
        return resultado;
      }
      
      // Caso 1: Produto de binômios (a+b)(c+d)
      const regexProdutoBinomios = /\(([^()]+?)\s*([+\-])\s*([^()]+?)\)\s*\*?\s*\(([^()]+?)\s*([+\-])\s*([^()]+?)\)/;
      const matchBinomios = expressao.match(regexProdutoBinomios);
      
      if (matchBinomios) {
        const [_, a, op1, b, c, op2, d] = matchBinomios;
        const sinalOp1 = op1 === '+' ? 1 : -1;
        const sinalOp2 = op2 === '+' ? 1 : -1;
        
        // Verifica se é diferença de quadrados (a+b)(a-b)
        if ((a === c && b === d && op1 !== op2) ||
            (a === d && b === c && op1 !== op2 && op2 === '-')) {
          // Não expandimos produtos que já são fatorações padrão
          return null;
        }
        
        // (a+b)(c+d) = ac + ad + bc + bd
        // (a-b)(c+d) = ac + ad - bc - bd
        // (a+b)(c-d) = ac - ad + bc - bd
        // (a-b)(c-d) = ac - ad - bc + bd
        
        // Multiplica algebricamente 
        let resultado = "";
        
        // Primeiro termo: ac
        resultado += `(${a})*(${c})`;
        
        // Segundo termo: ad com sinal apropriado
        if (sinalOp2 > 0) resultado += `+(${a})*(${d})`;
        else resultado += `-(${a})*(${d})`;
        
        // Terceiro termo: bc com sinal apropriado
        if (sinalOp1 > 0) resultado += `+(${b})*(${c})`;
        else resultado += `-(${b})*(${c})`;
        
        // Quarto termo: bd com sinal apropriado
        if (sinalOp1 * sinalOp2 > 0) resultado += `+(${b})*(${d})`;
        else resultado += `-(${b})*(${d})`;
        
        return resultado;
      }
      
      // Caso 2: Quadrado de um binômio (a±b)²
      const regexQuadradoBinomio = /\(([^()]+?)\s*([+\-])\s*([^()]+?)\)\s*\^2/;
      const matchQuadrado = expressao.match(regexQuadradoBinomio);
      
      if (matchQuadrado) {
        const [_, a, op, b] = matchQuadrado;
        const sinal = op === '+' ? 1 : -1;
        
        // (a+b)² = a² + 2ab + b²
        // (a-b)² = a² - 2ab + b²
        
        // Expande algebricamente
        let resultado = `(${a})^2`;
        
        // Termo do meio: 2ab com sinal apropriado
        if (sinal > 0) resultado += `+2*(${a})*(${b})`;
        else resultado += `-2*(${a})*(${b})`;
        
        // Último termo: b²
        resultado += `+(${b})^2`;
        
        return resultado;
      }
      
      // Caso 3: Produto de um monômio por um binômio: a(b±c)
      const regexProdutoMonomio = /([^()]+?)\s*\*?\s*\(([^()]+?)\s*([+\-])\s*([^()]+?)\)/;
      const matchMonomio = expressao.match(regexProdutoMonomio);
      
      if (matchMonomio) {
        const [_, a, b, op, c] = matchMonomio;
        const sinal = op === '+' ? 1 : -1;
        
        // a(b+c) = ab + ac
        // a(b-c) = ab - ac
        
        // Expande algebricamente
        let resultado = `(${a})*(${b})`;
        
        // Segundo termo com sinal apropriado
        if (sinal > 0) resultado += `+(${a})*(${c})`;
        else resultado += `-(${a})*(${c})`;
        
        return resultado;
      }
      
      // Caso 4: Soma de produtos por binômios: a(b±c) + d(e±f)
      const regexSomaProdutos = /([^()]+?)\s*\*?\s*\(([^()]+?)\s*([+\-])\s*([^()]+?)\)\s*([+\-])\s*([^()]+?)\s*\*?\s*\(([^()]+?)\s*([+\-])\s*([^()]+?)\)/;
      const matchSomaProdutos = expressao.match(regexSomaProdutos);
      
      if (matchSomaProdutos) {
        const [_, a, b, op1, c, op3, d, e, op2, f] = matchSomaProdutos;
        const sinal1 = op1 === '+' ? 1 : -1;
        const sinal2 = op2 === '+' ? 1 : -1;
        const sinal3 = op3 === '+' ? 1 : -1;
        
        // a(b±c) ± d(e±f)
        // Primeiro expandimos a(b±c)
        let parte1 = `(${a})*(${b})`;
        if (sinal1 > 0) parte1 += `+(${a})*(${c})`;
        else parte1 += `-(${a})*(${c})`;
        
        // Depois expandimos d(e±f)
        let parte2 = `(${d})*(${e})`;
        if (sinal2 > 0) parte2 += `+(${d})*(${f})`;
        else parte2 += `-(${d})*(${f})`;
        
        // Juntamos as partes com o sinal apropriado
        let resultado = parte1;
        if (sinal3 > 0) resultado += `+${parte2}`;
        else resultado += `-${parte2}`;
        
        return resultado;
      }
      
      return null;
    } catch (err) {
      console.error('Erro na expansão manual:', err);
      return null;
    }
  };

  // Formatar a expressão para padrões comuns
  const formatarExpressao = (expressao: string): string => {
    try {
      // Converte notações do tipo 2x para 2*x para facilitar o parsing
      return expressao.replace(/(\d)([a-zA-Z])/g, '$1*$2');
    } catch (err) {
      console.error('Erro ao formatar expressão:', err);
      return expressao;
    }
  };

  // Corrige a notação de produtos nas expressões finais e aplica mais simplificações
  const corrigirNotacaoProdutos = (expressao: string): string => {
    try {
      let resultado = expressao
        // Remove a notação de multiplicação explícita
        .replace(/(\d+)\s*\*\s*([a-zA-Z])/g, '$1$2')
        .replace(/\s*\*\s*/g, '*')
        .replace(/\*([a-zA-Z])/g, '$1')
        .replace(/([a-zA-Z])\*(\d)/g, '$1$2')
        .replace(/([a-zA-Z])\*([a-zA-Z])/g, '$1$2')
        .replace(/1([a-zA-Z])/g, '$1'); // Remove o coeficiente 1 antes de variáveis
      
      // Tenta aplicar mais simplificações para casos comuns
      
      // Combinação adicional de termos semelhantes para x^3+3*(x^2+x)+1 -> x^3+3x^2+3x+1
      resultado = resultado
        .replace(/(\d+)\*\(([a-zA-Z])\^(\d+)\+([a-zA-Z])\)/g, '$1$2^$3+$1$4')
        .replace(/(\d+)\*\(([a-zA-Z])\^(\d+)\-([a-zA-Z])\)/g, '$1$2^$3-$1$4');
      
      // Simplificações adicionais para termos como 3*x^2+3*x -> 3x^2+3x
      resultado = resultado.replace(/(\d+)\*([a-zA-Z])/g, '$1$2');
      
      // Correção da ordem para expressões como a^2+b^2+2ab -> a^2+2ab+b^2
      const padraoQuadradoPerfeito = /([a-zA-Z])\^2\+([a-zA-Z])\^2\+2([a-zA-Z])([a-zA-Z])/;
      const matchQuadrado = resultado.match(padraoQuadradoPerfeito);
      if (matchQuadrado) {
        const [_, a, b, c, d] = matchQuadrado;
        if ((a === c && b === d) || (a === d && b === c)) {
          resultado = resultado.replace(padraoQuadradoPerfeito, `$1^2+2$3$4+$2^2`);
        }
      }
      
      // Ordem para (a-b)^2 = a^2-2ab+b^2
      const padraoQuadradoDiferenca = /([a-zA-Z])\^2\+([a-zA-Z])\^2\-2([a-zA-Z])([a-zA-Z])/;
      const matchDiferenca = resultado.match(padraoQuadradoDiferenca);
      if (matchDiferenca) {
        const [_, a, b, c, d] = matchDiferenca;
        if ((a === c && b === d) || (a === d && b === c)) {
          resultado = resultado.replace(padraoQuadradoDiferenca, `$1^2-2$3$4+$2^2`);
        }
      }
      
      // Combinando termos idênticos como ax+ax -> 2ax
      const termos = resultado.split(/([+-])/);
      const termosAgrupados: Record<string, number> = {};
      let sinalAtual = '+';
      
      for (let i = 0; i < termos.length; i++) {
        if (termos[i] === '+' || termos[i] === '-') {
          sinalAtual = termos[i];
        } else if (termos[i].trim()) {
          const termo = termos[i].trim();
          // Use term as key without coefficient 
          const termBase = termo.replace(/^\d+/, '');
          if (termBase in termosAgrupados) {
            // Já existe, adiciona/subtrai o coeficiente
            const coefMatch = termo.match(/^\d+/);
            const coefAtual = coefMatch ? parseInt(coefMatch[0]) : 1;
            const fator = sinalAtual === '+' ? 1 : -1;
            termosAgrupados[termBase] += coefAtual * fator;
          } else {
            // Novo termo
            const coefMatch = termo.match(/^\d+/);
            const coefAtual = coefMatch ? parseInt(coefMatch[0]) : 1;
            const fator = sinalAtual === '+' ? 1 : -1;
            termosAgrupados[termBase] = coefAtual * fator;
          }
        }
      }
      
      // Reconstrói a expressão com os termos agrupados
      let resultadoFinal = '';
      for (const termBase in termosAgrupados) {
        const coef = termosAgrupados[termBase];
        if (coef === 0) continue;
        
        if (coef > 0) {
          resultadoFinal += resultadoFinal ? `+${coef === 1 && termBase ? '' : coef}${termBase}` : `${coef === 1 && termBase ? '' : coef}${termBase}`;
        } else {
          resultadoFinal += `${coef === -1 && termBase ? '-' : coef}${termBase}`;
        }
      }
      
      return resultadoFinal || '0';
    } catch (err) {
      console.error('Erro ao corrigir notação:', err);
      return expressao;
    }
  };

  // Verifica se a expressão já está na forma mais simplificada possível
  const precisaFatorar = (expressao: string): boolean => {
    // Expressões que já estão na forma fatorada não precisam de fatoração adicional
    if (expressao.includes('(') && expressao.includes(')')) {
      // Verifica se já é um produto de polinômios
      const regexProdutoPolinomios = /\([^()]+\)\s*\*?\s*\([^()]+\)/;
      if (regexProdutoPolinomios.test(expressao)) return false;
      
      // Verifica se já é uma potência
      const regexPotencia = /\([^()]+\)\^[0-9]+/;
      if (regexPotencia.test(expressao)) return false;
      
      // Verifica se já é uma diferença de quadrados (a²-b²)
      const regexDiferenca = /[a-zA-Z]\^2-[a-zA-Z]\^2/;
      if (regexDiferenca.test(expressao)) return false;
    }
    
    // Verifica o número de termos
    const termos = expressao.split(/[+\-]/).filter(t => t.trim());
    
    // Se tiver apenas um termo, provavelmente não precisa fatorar
    if (termos.length <= 1) return false;
    
    return true;
  };

  // Função que tenta fatorar expressões comuns
  const tentarFatorar = (expressao: string): string | null => {
    // Simplificação básica já foi feita pelo mathjs
    
    // Verifica se realmente precisamos fatorar
    if (!precisaFatorar(expressao)) {
      return null;
    }
    
    // Verifica padrões comuns
    try {
      // Limpa a expressão e a formata
      const expressaoLimpa = expressao.replace(/\s/g, '');
      
      // Caso especial para monômios com x: ax+bx = x(a+b)
      const regexFatoracaoX = /^([+-]?\d*)\s*\*?\s*([a-zA-Z])\s*([+-])\s*([+-]?\d*)\s*\*?\s*\2$/i;
      const matchFatoracaoX = expressaoLimpa.match(regexFatoracaoX);
      
      if (matchFatoracaoX) {
        const [_, coef1, variavel, op, coef2] = matchFatoracaoX;
        const coefNum1 = coef1 === '' ? 1 : (coef1 === '-' ? -1 : parseInt(coef1));
        const coefNum2 = coef2 === '' ? 1 : (coef2 === '-' ? -1 : parseInt(coef2));
        
        const sinal = op === '+' ? '+' : '-';
        const valorCoef2 = op === '+' ? Math.abs(coefNum2) : Math.abs(coefNum2);
        
        if (coefNum1 === 1 && valorCoef2 === 1) {
          return `${variavel}(1${sinal}1)`;
        }
        
        return `${variavel}(${coefNum1}${sinal}${valorCoef2})`;
      }
      
      // Caso especial: monômios com x^n: ax^n+bx^n = x^n(a+b)
      const regexFatoracaoXn = /^([+-]?\d*)\s*\*?\s*([a-zA-Z])\^(\d+)\s*([+-])\s*([+-]?\d*)\s*\*?\s*\2\^(\3)$/i;
      const matchFatoracaoXn = expressaoLimpa.match(regexFatoracaoXn);
      
      if (matchFatoracaoXn) {
        const [_, coef1, variavel, expoente, op, coef2] = matchFatoracaoXn;
        const coefNum1 = coef1 === '' ? 1 : (coef1 === '-' ? -1 : parseInt(coef1));
        const coefNum2 = coef2 === '' ? 1 : (coef2 === '-' ? -1 : parseInt(coef2));
        
        const sinal = op === '+' ? '+' : '-';
        const valorCoef2 = op === '+' ? Math.abs(coefNum2) : Math.abs(coefNum2);
        
        return `${variavel}^${expoente}(${coefNum1}${sinal}${valorCoef2})`;
      }

      // Caso especial: monômios com fator comum variável: ax^2+ax = a*x(x+1)
      const regexFatoracaoComumVar = /^([+-]?\d*)\s*\*?\s*([a-zA-Z])\^?(\d*)\s*([+-])\s*\1\s*\*?\s*\2\^?(\d*)$/i;
      const matchFatoracaoComumVar = expressaoLimpa.match(regexFatoracaoComumVar);
      
      if (matchFatoracaoComumVar) {
        const [_, coef, variavel, exp1, op, exp2] = matchFatoracaoComumVar;
        const expoente1 = exp1 === '' ? 1 : parseInt(exp1);
        const expoente2 = exp2 === '' ? 1 : parseInt(exp2);
        const coefNum = coef === '' ? 1 : (coef === '-' ? -1 : parseInt(coef));
        
        // Temos a*x^m + a*x^n = a*x^min(m,n)*(x^|m-n| + 1)
        const expMin = Math.min(expoente1, expoente2);
        const expDiff = Math.abs(expoente1 - expoente2);
        const segundoTermo = expDiff === 0 ? "1" : (expDiff === 1 ? variavel : `${variavel}^${expDiff}`);
        
        const sinal = op === '+' ? '+' : '-';
        let resultado = '';
        
        if (coefNum === 1) {
          resultado = expMin === 1 ? variavel : `${variavel}^${expMin}`;
        } else if (coefNum === -1) {
          resultado = expMin === 1 ? `-${variavel}` : `-${variavel}^${expMin}`;
        } else {
          resultado = expMin === 1 ? `${coefNum}${variavel}` : `${coefNum}${variavel}^${expMin}`;
        }
        
        if (expoente1 > expoente2) {
          return `${resultado}(${segundoTermo}${sinal}1)`;
        } else {
          return `${resultado}(1${sinal}${segundoTermo})`;
        }
      }
      
      // Caso especial para termos mistos: ax+ay = a(x+y)
      const regexFatoracaoTermosMistos = /^([+-]?\d*)\s*\*?\s*([a-zA-Z])\s*([+-])\s*\1\s*\*?\s*([a-zA-Z])$/i;
      const matchFatoracaoTermosMistos = expressaoLimpa.match(regexFatoracaoTermosMistos);
      
      if (matchFatoracaoTermosMistos) {
        const [_, coef, variavel1, op, variavel2] = matchFatoracaoTermosMistos;
        const coefNum = coef === '' ? 1 : (coef === '-' ? -1 : parseInt(coef));
        
        const sinal = op === '+' ? '+' : '-';
        
        if (coefNum === 1) {
          return `(${variavel1}${sinal}${variavel2})`;
        } else if (coefNum === -1) {
          return `-1(${variavel1}${sinal}${variavel2})`;
        } else {
          return `${coefNum}(${variavel1}${sinal}${variavel2})`;
        }
      }
      
      // Caso especial: ax+ab = a(x+b)
      const regexFatoracaoComum = /^([+-]?\d*)\s*\*?\s*([a-zA-Z])\s*([+-])\s*\1\s*\*?\s*([a-zA-Z0-9]+)$/i;
      const matchFatoracaoComum = expressaoLimpa.match(regexFatoracaoComum);
      
      if (matchFatoracaoComum) {
        const [_, coef, termo1, op, termo2] = matchFatoracaoComum;
        const coefNum = coef === '' ? 1 : (coef === '-' ? -1 : parseInt(coef));
        
        const sinal = op === '+' ? '+' : '-';
        
        if (coefNum === 1) {
          return `(${termo1}${sinal}${termo2})`;
        } else if (coefNum === -1) {
          return `-1(${termo1}${sinal}${termo2})`;
        } else {
          return `${coefNum}(${termo1}${sinal}${termo2})`;
        }
      }
      
      // Case especial para 8a+4b = 4(2a+b)
      const regexFatoracaoMultipleVars = /^(\d+)([a-zA-Z])([+-])(\d+)([a-zA-Z])$/i;
      const matchFatoracaoMultipleVars = expressaoLimpa.match(regexFatoracaoMultipleVars);
      
      if (matchFatoracaoMultipleVars) {
        const [_, coef1, var1, op, coef2, var2] = matchFatoracaoMultipleVars;
        
        if (var1 !== var2) { // Verifica se as variáveis são diferentes
          const c1 = parseInt(coef1);
          const c2 = parseInt(coef2);
          const mdc = encontrarMDC(c1, c2);
          
          if (mdc > 1) {
            const novoCoef1 = c1 / mdc;
            const novoCoef2 = c2 / mdc;
            const sinal = op === '+' ? '+' : '-';
            
            return `${mdc}(${novoCoef1}${var1}${sinal}${novoCoef2}${var2})`;
          }
        }
      }
      
      // Caso especial para expressões como 6x+12 = 6(x+2)
      const regexFatoracaoNumeros = /^(\d+)\s*\*?\s*([a-zA-Z])\s*([+\-])\s*(\d+)$/i;
      const matchFatoracaoNumeros = expressaoLimpa.match(regexFatoracaoNumeros);
      
      if (matchFatoracaoNumeros) {
        const [_, coef1, variavel, op, constante] = matchFatoracaoNumeros;
        const mdc = encontrarMDC(parseInt(coef1), parseInt(constante));
        
        if (mdc > 1) {
          const termoCoef = parseInt(coef1) / mdc;
          const termoConstante = parseInt(constante) / mdc;
          
          // Se o coeficiente é 1, omitimos para melhor formatação
          const coefStr = termoCoef === 1 ? "" : `${termoCoef}`;
          
          return `${mdc}(${coefStr}${variavel}${op}${termoConstante})`;
        }
      }
      
      // Caso especial: 15x^2-10x = 5x(3x-2)
      const regexFatoracaoMonomioComum = /^(\d+)([a-zA-Z])\^(\d+)([+\-])(\d+)([a-zA-Z])$/;
      const matchFatoracaoMonomioComum = expressaoLimpa.match(regexFatoracaoMonomioComum);
      
      if (matchFatoracaoMonomioComum) {
        const [_, coef1, variavel1, exp, op, coef2, variavel2] = matchFatoracaoMonomioComum;
        
        // Verifica se as variáveis são as mesmas
        if (variavel1 === variavel2) {
          const c1 = parseInt(coef1);
          const c2 = parseInt(coef2);
          const mdc = encontrarMDC(c1, c2);
          
          if (mdc > 1) {
            const exp1 = parseInt(exp);
            const novoCoef1 = c1 / mdc;
            const novoCoef2 = c2 / mdc;
            
            // Fator comum: mdc * variável
            const fatorComum = `${mdc}${variavel1}`;
            
            // Termo do maior expoente: variavel^(expoente-1)
            const termoMaior = exp1 > 1 ? `${novoCoef1}${variavel1}${exp1 > 2 ? `^${exp1-1}` : ''}` : `${novoCoef1}`;
            
            return `${fatorComum}(${termoMaior}${op}${novoCoef2})`;
          }
        }
      }
      
      // Tenta identificar fator comum
      const termosOriginal = expressaoLimpa.split(/(?=[+-])/);
      
      // Caso mais geral: termos com fator comum
      if (termosOriginal.length >= 2) {
        // Tenta encontrar um fator comum numérico
        const coeficientes: number[] = [];
        
        for (const termo of termosOriginal) {
          const match = termo.match(/^([+-]?)(\d*)([a-zA-Z].*)?$/);
          if (match) {
            const sinal = match[1] === '-' ? -1 : 1;
            const coef = match[2] === '' ? 1 : Number(match[2]);
            
            coeficientes.push(sinal * coef);
          }
        }
        
        if (coeficientes.length >= 2 && !coeficientes.includes(0)) {
          let mdc = Math.abs(coeficientes[0]);
          for (let i = 1; i < coeficientes.length; i++) {
            mdc = encontrarMDC(mdc, Math.abs(coeficientes[i]));
          }
          
          // Só fatoramos se tivermos um divisor comum maior que 1
          if (mdc > 1) {
            // Constrói a expressão fatorada
            const termosSimplificados = termosOriginal.map(termo => {
              const match = termo.match(/^([+-]?)(\d*)(.*)$/);
              if (match) {
                const sinal = match[1] === '-' ? '-' : '+';
                const coef = match[2] === '' ? 1 : Number(match[2]);
                const resto = match[3] || '';
                
                const novoCoef = Math.abs(coef) / mdc;
                if (novoCoef === 1 && resto) {
                  return sinal === '+' ? resto : `-${resto}`;
                } else if (novoCoef === 0) {
                  return '';
                } else {
                  return `${sinal === '+' ? '' : '-'}${novoCoef}${resto}`;
                }
              }
              return termo;
            }).filter(t => t !== '');
            
            // Remove o sinal '+' inicial se houver
            if (termosSimplificados[0].startsWith('+')) {
              termosSimplificados[0] = termosSimplificados[0].substring(1);
            }
            
            return `${mdc}(${termosSimplificados.join('')})`;
          }
        }
      }
      
      // Outros padrões comuns
      // Diferença de quadrados: a²-b² = (a+b)(a-b)
      const diffSquaresRegex = /^([a-zA-Z])\^2-([a-zA-Z])\^2$/;
      const diffSquaresMatch = expressaoLimpa.match(diffSquaresRegex);
      if (diffSquaresMatch) {
        const [_, a, b] = diffSquaresMatch;
        return `(${a}+${b})(${a}-${b})`;
      }
      
      // Trinômio quadrado perfeito: a²+2ab+b² = (a+b)²
      const perfectSquareRegex = /^([a-zA-Z])\^2\+2([a-zA-Z])([a-zA-Z])\+([a-zA-Z])\^2$/;
      const perfectSquareMatch = expressaoLimpa.match(perfectSquareRegex);
      if (perfectSquareMatch) {
        const [_, a, b1, b2, c] = perfectSquareMatch;
        if (b1 === a && b2 === c) {
          return `(${a}+${c})^2`;
        }
      }
      
      // Caso não consiga fatorar
      return null;
    } catch (err) {
      console.error('Erro ao fatorar:', err);
      return null;
    }
  };

  // Função auxiliar para calcular o MDC
  const encontrarMDC = (a: number, b: number): number => {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b) {
      const temp = b;
      b = a % b;
      a = temp;
    }
    return a;
  };

  // Função auxiliar para reordenar termos polinomiais do maior para o menor grau
  const reordenarTermos = (expressao: string): string => {
    try {
      // Normaliza a expressão eliminando espaços extras e produtos implícitos
      const expressaoNormalizada = formatarExpressao(expressao.replace(/\s+/g, ''));
      
      // Coleta os termos
      const termos = expressaoNormalizada.split(/([+\-])/g).filter(t => t.trim());
      
      if (termos.length <= 2) return expressaoNormalizada; // Não precisa reordenar se for só um termo
      
      // Constrói os termos com seus sinais
      const termosCompletos = [];
      let sinalAtual = '+';
      
      for (const parte of termos) {
        if (parte === '+' || parte === '-') {
          sinalAtual = parte;
        } else {
          termosCompletos.push({
            sinal: sinalAtual,
            termo: parte.trim()
          });
          sinalAtual = '+';
        }
      }
      
      // Se o primeiro termo não tem sinal explícito, assumimos '+'
      if (termosCompletos.length > 0 && !termosCompletos[0].sinal) {
        termosCompletos[0].sinal = '+';
      }
      
      // Função para obter o grau de um termo
      const obterGrau = (termo: string): number => {
        // Checa por polinômios x^n
        const matchExpoente = termo.match(/\^(\d+)/);
        if (matchExpoente) return parseInt(matchExpoente[1]);
        
        // Checa por variáveis (grau 1)
        const matchVariavel = termo.match(/[a-zA-Z]/);
        if (matchVariavel) return 1;
        
        return 0; // Constante
      };
      
      // Ordena por grau (do maior para o menor)
      termosCompletos.sort((a, b) => {
        const grauA = obterGrau(a.termo);
        const grauB = obterGrau(b.termo);
        return grauB - grauA;
      });
      
      // Reconstrói a expressão
      let resultado = '';
      for (let i = 0; i < termosCompletos.length; i++) {
        const { sinal, termo } = termosCompletos[i];
        if (i === 0) {
          resultado = sinal === '+' ? termo : `-${termo}`;
        } else {
          resultado += `${sinal}${termo}`;
        }
      }
      
      return resultado;
    } catch (err) {
      console.error('Erro ao reordenar termos:', err);
      return expressao; // Retorna a original se houver erro
    }
  };

  // Simplifica a expressão algebricamente
  const handleSimplificar = () => {
    setMensagemErro('');
    setResultado(null);
    setResultadoAvaliado(null);
    setPassos([]);
    setPodeFatorar(false);
    setResultadoFatorado(null);
    setExibirExplicacao(true);

    try {
      // Verifica se a expressão é válida
      if (!validarExpressao(expressao)) {
        return;
      }

      // Normaliza a expressão (converte caracteres de menos Unicode)
      const expressaoNormalizada = normalizarExpressao(expressao);
      
      // Formata a expressão para facilitar o parsing
      const expressaoFormatada = formatarExpressao(expressaoNormalizada);
      
      // Gera os passos para mostrar como chegou ao resultado
      const passosDeCalculo = [];
      let numeroPassos = 1;
      
      passosDeCalculo.push(`Passo ${numeroPassos}: Identificar a expressão algébrica`);
      passosDeCalculo.push(`Expressão a ser simplificada: ${expressao}`);
      numeroPassos++;
      
      // Caso especial: diferença de quadrados do tipo (a+b)(a-b)
      const diffOfSquaresRegex = /\(([a-zA-Z])[+]([a-zA-Z])\)\(([a-zA-Z])[-]([a-zA-Z])\)/;
      const diffOfSquaresMatch = expressaoFormatada.match(diffOfSquaresRegex);
      
      if (diffOfSquaresMatch) {
        const [_, a1, b1, a2, b2] = diffOfSquaresMatch;
        // Verifica se é um produto do tipo (a+b)(a-b)
        if (a1 === a2 && b1 === b2) {
          passosDeCalculo.push(`Passo ${numeroPassos}: Identificar padrão algébrico notável`);
          passosDeCalculo.push(`Reconhecendo o padrão de diferença de quadrados: (a+b)(a-b) = a²-b²`);
          numeroPassos++;
          
          passosDeCalculo.push(`Passo ${numeroPassos}: Aplicar a fórmula da diferença de quadrados`);
          const resultadoEspecial = `${a1}^2-${b1}^2`;
          passosDeCalculo.push(`(${a1}+${b1})(${a1}-${b1}) = ${a1}²-${b1}²`);
          
          setResultado(resultadoEspecial);
          setPassos(passosDeCalculo);
          return;
        }
      }
      
      // Caso especial alternativo: diferença de quadrados do tipo (a-b)(a+b)
      const diffOfSquaresRegexAlt = /\(([a-zA-Z])[-]([a-zA-Z])\)\(([a-zA-Z])[+]([a-zA-Z])\)/;
      const diffOfSquaresMatchAlt = expressaoFormatada.match(diffOfSquaresRegexAlt);
      
      if (diffOfSquaresMatchAlt) {
        const [_, a1, b1, a2, b2] = diffOfSquaresMatchAlt;
        // Verifica se é um produto do tipo (a-b)(a+b)
        if (a1 === a2 && b1 === b2) {
          passosDeCalculo.push(`Passo ${numeroPassos}: Identificar padrão algébrico notável`);
          passosDeCalculo.push(`Reconhecendo o padrão de diferença de quadrados: (a-b)(a+b) = a²-b²`);
          numeroPassos++;
          
          passosDeCalculo.push(`Passo ${numeroPassos}: Aplicar a fórmula da diferença de quadrados`);
          const resultadoEspecial = `${a1}^2-${b1}^2`;
          passosDeCalculo.push(`(${a1}-${b1})(${a1}+${b1}) = ${a1}²-${b1}²`);
          
          setResultado(resultadoEspecial);
          setPassos(passosDeCalculo);
          return;
        }
      }
      
      // Primeiro tenta expandir a expressão (para multiplicações de polinômios)
      let expressaoExpandida = expressaoFormatada;
      let expressaoSimplificada;
      
      // Tenta primeiro expandir manualmente
      passosDeCalculo.push(`Passo ${numeroPassos}: Expandir a expressão e eliminar parênteses`);
      
      try {
        const expansaoManual = expandirManualmente(expressaoFormatada);
        if (expansaoManual && expansaoManual !== expressaoFormatada) {
          expressaoExpandida = expansaoManual;
          passosDeCalculo.push(`Expandindo: ${corrigirNotacaoProdutos(expressaoExpandida)}`);
        } else {
          passosDeCalculo.push(`A expressão não precisa ser expandida: ${expressaoFormatada}`);
        }
      } catch (err) {
        console.error('Erro ao expandir manualmente:', err);
        passosDeCalculo.push(`Não foi possível expandir a expressão. Continuando com a expressão original.`);
      }
      numeroPassos++;
      
      // Tenta simplificar a expressão expandida
      passosDeCalculo.push(`Passo ${numeroPassos}: Simplificar a expressão combinando termos semelhantes`);
      
      try {
        const resultadoSimplificado = simplify(expressaoExpandida).toString();
        
        // Reordena e corrige a notação
        expressaoSimplificada = corrigirNotacaoProdutos(reordenarTermos(resultadoSimplificado));
        passosDeCalculo.push(`Expressão simplificada: ${expressaoSimplificada}`);
      } catch (err) {
        console.error('Erro ao simplificar expressão expandida:', err);
        expressaoSimplificada = expressaoExpandida;
        passosDeCalculo.push(`Não foi possível simplificar mais a expressão.`);
      }
      numeroPassos++;
      
      // Se ainda não conseguiu expandir, tenta simplificar diretamente
      if (expressaoSimplificada === expressaoFormatada || expressaoSimplificada === expressao) {
        passosDeCalculo.push(`Passo ${numeroPassos}: Tentar simplificação direta`);
        
        try {
          // Tenta simplificar diretamente
          const resultadoSimplificado = simplify(expressaoFormatada).toString();
          
          // Reordena e corrige a notação
          expressaoSimplificada = corrigirNotacaoProdutos(reordenarTermos(resultadoSimplificado));
          passosDeCalculo.push(`Expressão simplificada diretamente: ${expressaoSimplificada}`);
        } catch (err) {
          console.error('Erro ao simplificar diretamente:', err);
          expressaoSimplificada = expressaoFormatada;
          passosDeCalculo.push(`Não foi possível simplificar mais a expressão.`);
        }
        numeroPassos++;
      }
      
      setResultado(expressaoSimplificada);
      
      // Verifica se podemos fatorar o resultado
      try {
        // Tenta fatorar para expressões comuns
        const fatorado = tentarFatorar(expressaoSimplificada);
        
        if (fatorado && fatorado !== expressaoSimplificada) {
          const fatoradoCorrigido = corrigirNotacaoProdutos(fatorado);
          
          // Não mostramos fatorações triviais como 1(...)
          if (!fatoradoCorrigido.startsWith('1(')) {
            passosDeCalculo.push(`Passo ${numeroPassos}: Fatorar a expressão`);
            passosDeCalculo.push(`Forma fatorada: ${fatoradoCorrigido}`);
            setResultadoFatorado(fatoradoCorrigido);
            setPodeFatorar(true);
            numeroPassos++;
          }
        } else {
          passosDeCalculo.push(`Passo ${numeroPassos}: Verificar se a expressão pode ser fatorada`);
          passosDeCalculo.push(`A expressão não pode ser fatorada mais.`);
          numeroPassos++;
        }
      } catch (err) {
        console.error('Erro ao tentar fatorar:', err);
        // Ignora erros aqui, a fatoração é opcional
      }
      
      // Passo final
      passosDeCalculo.push(`Passo ${numeroPassos}: Resultado final`);
      if (podeFatorar && resultadoFatorado) {
        passosDeCalculo.push(`A expressão ${expressao} pode ser simplificada para ${expressaoSimplificada} e fatorada como ${resultadoFatorado}`);
      } else {
        passosDeCalculo.push(`A expressão ${expressao} simplifica para ${expressaoSimplificada}`);
      }
      
      setPassos(passosDeCalculo);
    } catch (error) {
      console.error('Erro ao simplificar expressão:', error);
      setMensagemErro(`Erro: ${error instanceof Error ? error.message : 'Expressão inválida'}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <HiCalculator className="h-6 w-6 text-indigo-600 mr-2" />
        <h2 className="text-2xl font-bold">Expressões Algébricas</h2>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-8">
        <p className='text-gray-700 mb-6'>
          Calcule, simplifique e fatore expressões algébricas com uma ou mais variáveis.
        </p>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Expressão Algébrica:
          </label>
          <input
            id="expressao"
            type="text"
            value={expressao}
            onChange={(e) => handleExpressaoChange(e.target.value)}
            placeholder="Ex: (x+2)*(x+3) ou a^2−b^2"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
          <p className="text-sm text-gray-500 mt-1">
            Use variáveis como x, y, a, b, etc. Você pode usar operadores como +, -, *, / e ^ para potências.
          </p>
        </div>

        {variaveis.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Valores das variáveis (opcional):</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {variaveis.map((variavel) => (
                <div key={variavel} className="mb-2">
                  <label className="block text-sm text-gray-700 mb-1" htmlFor={`var-${variavel}`}>
                    {variavel}:
                  </label>
                  <input
                    id={`var-${variavel}`}
                    type="text"
                    value={variaveisEValores[variavel] || ''}
                    onChange={(e) => handleValorVariavelChange(variavel, e.target.value)}
                    placeholder={`Valor para ${variavel} (opcional)`}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <button
            onClick={handleAvaliar}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-md transition-colors duration-300 mt-4"
            disabled={!expressao.trim()}
          >
            Avaliar Expressão
          </button>
          <button
            onClick={handleSimplificar}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-md transition-colors duration-300 mt-4"
            disabled={!expressao.trim()}
          >
            Simplificar Expressão
          </button>
        </div>

        {mensagemErro && (
          <div className="mt-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-md">
            {mensagemErro}
          </div>
        )}
      </div>

      {resultadoAvaliado !== null && (
        <div className="space-y-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-5">
            <h3 className="text-lg font-medium text-green-800 mb-2">Resultado da Avaliação</h3>
            <p className="text-xl">
              O valor da expressão é: <span className="font-bold">{resultadoAvaliado}</span>
            </p>
            
            <button 
              onClick={() => setExibirExplicacao(!exibirExplicacao)}
              className="mt-4 text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center"
            >
              {exibirExplicacao ? "Ocultar cálculos detalhados" : "Mostrar cálculos detalhados"}
            </button>
          </div>
        </div>
      )}

      {resultado && (
        <div className="space-y-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-5">
            <h3 className="text-lg font-medium text-green-800 mb-2">Expressão Simplificada</h3>
            <p className="text-xl">
              Resultado: <span className="font-bold">{resultado}</span>
            </p>
            
            {podeFatorar && resultadoFatorado && (
              <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <h4 className="text-md font-medium text-yellow-800">Forma Fatorada:</h4>
                <p className="text-lg font-bold text-yellow-700">{resultadoFatorado}</p>
              </div>
            )}
            
            <button 
              onClick={() => setExibirExplicacao(!exibirExplicacao)}
              className="mt-4 text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center"
            >
              {exibirExplicacao ? "Ocultar cálculos detalhados" : "Mostrar cálculos detalhados"}
            </button>
          </div>
        </div>
      )}

      {exibirExplicacao && passos.length > 0 && (resultadoAvaliado !== null || resultado !== null) && (
        <div className="bg-white shadow-md rounded-lg p-5 mt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-800 flex items-center">
              <HiCalculator className="h-6 w-6 mr-2 text-indigo-600" />
              Solução passo a passo
            </h3>
          </div>
          
          <div className="space-y-4">
            {passos.map((passo, index) => {
              // Verifica se o passo começa com um padrão específico
              const stepMatch = passo.match(/^(Passo \d+:)(.*)$/);
              
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
                  <div key={index} className="p-3 bg-white border border-gray-200 rounded-md ml-4">
                    <p className="text-gray-800">{passo}</p>
                  </div>
                );
              }
            })}
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-md">
            <h4 className="font-medium text-blue-800 mb-2">Conceito Matemático</h4>
            <p className="text-gray-700">
              Expressões algébricas são combinações de números, variáveis e operações matemáticas.
            </p>
            <p className="text-gray-700 mt-2">
              Para trabalhar com expressões algébricas, podemos:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-gray-700 mt-2">
              <li>Avaliar uma expressão substituindo as variáveis por valores específicos</li>
              <li>Simplificar a expressão combinando termos semelhantes e realizando operações</li>
              <li>Fatorar a expressão para expressar como um produto de fatores mais simples</li>
              <li>Expandir produtos para obter a forma polinomial completa</li>
            </ul>
            <p className="text-gray-700 mt-2">
              Alguns padrões notáveis incluem:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-gray-700 mt-2">
              <li>(a + b)² = a² + 2ab + b²</li>
              <li>(a - b)² = a² - 2ab + b²</li>
              <li>(a + b)(a - b) = a² - b²</li>
              <li>(a + b)³ = a³ + 3a²b + 3ab² + b³</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResolvedorExpressoesAlgebricas;
