import { ConceitoInequacoes } from './types';

export const conceitoInequacoes: ConceitoInequacoes = {
  descricao: 
    "Uma inequação é uma expressão matemática que envolve uma desigualdade entre duas expressões. " +
    "Diferente das equações, onde buscamos valores que tornam as expressões iguais, nas inequações procuramos " +
    "o conjunto de valores que satisfazem a desigualdade (maior que, menor que, maior ou igual, menor ou igual).",
  
  categorias: [
    {
      nome: "Propriedades das Inequações",
      regras: [
        {
          nome: "Propriedade da adição e subtração",
          formula: "Se a < b, então a + c < b + c e a - c < b - c",
          explicacao: "Somar ou subtrair o mesmo valor em ambos os lados de uma inequação mantém a desigualdade inalterada.",
          exemplo: "Se x + 3 > 7, então x > 4",
          corDestaque: "blue"
        },
        {
          nome: "Propriedade da multiplicação e divisão (números positivos)",
          formula: "Se a < b e c > 0, então a × c < b × c e a ÷ c < b ÷ c",
          explicacao: "Multiplicar ou dividir ambos os lados por um número positivo mantém o sentido da desigualdade.",
          exemplo: "Se 2x < 10, então x < 5",
          corDestaque: "green"
        },
        {
          nome: "Propriedade da multiplicação e divisão (números negativos)",
          formula: "Se a < b e c < 0, então a × c > b × c e a ÷ c > b ÷ c",
          explicacao: "Multiplicar ou dividir ambos os lados por um número negativo inverte o sentido da desigualdade.",
          exemplo: "Se 3x < 9, então x > -3 ao multiplicar por -1",
          corDestaque: "red"
        }
      ]
    },
    {
      nome: "Tipos de Inequações",
      regras: [
        {
          nome: "Inequações lineares",
          formula: "ax + b < 0 (ou >, ≤, ≥)",
          explicacao: "Inequações onde a variável aparece apenas com expoente 1. São resolvidas isolando a variável.",
          exemplo: "2x + 5 < 15",
          corDestaque: "purple"
        },
        {
          nome: "Inequações quadráticas",
          formula: "ax² + bx + c < 0 (ou >, ≤, ≥)",
          explicacao: "Inequações onde o maior expoente da variável é 2. São resolvidas encontrando os zeros do polinômio e analisando o sinal em cada intervalo.",
          exemplo: "x² - 5x + 6 < 0",
          corDestaque: "amber"
        },
        {
          nome: "Inequações racionais",
          formula: "P(x)/Q(x) < 0 (ou >, ≤, ≥)",
          explicacao: "Inequações onde a incógnita aparece no denominador de uma fração. É necessário verificar os valores que anulam o denominador.",
          exemplo: "(x + 3)/(x - 2) ≥ 0",
          corDestaque: "cyan"
        },
        {
          nome: "Inequações com módulo",
          formula: "|ax + b| < c (ou >, ≤, ≥)",
          explicacao: "Inequações envolvendo valor absoluto. Dependendo do símbolo, podem se transformar em uma ou duas inequações sem módulo.",
          exemplo: "|x - 3| < 2 equivale a 1 < x < 5",
          corDestaque: "green"
        }
      ]
    },
    {
      nome: "Representação de Soluções",
      regras: [
        {
          nome: "Notação de intervalos",
          formula: "(a, b), [a, b], (a, b], [a, b)",
          explicacao: "A solução de uma inequação é frequentemente expressa em notação de intervalos. Parênteses indicam exclusão do valor (< ou >), colchetes indicam inclusão (≤ ou ≥).",
          exemplo: "x > 3 é representado como (3, ∞)",
          corDestaque: "blue"
        },
        {
          nome: "Representação na reta numérica",
          explicacao: "As soluções podem ser visualizadas na reta numérica, usando círculos abertos para extremidades não inclusas e fechados para extremidades inclusas.",
          corDestaque: "purple"
        },
        {
          nome: "União e interseção de intervalos",
          formula: "A ∪ B e A ∩ B",
          explicacao: "Algumas inequações produzem soluções que são uniões ou interseções de intervalos.",
          exemplo: "x² - 1 < 0 tem solução -1 < x < 1, enquanto x² - 1 > 0 tem solução x < -1 ou x > 1",
          corDestaque: "amber"
        }
      ]
    }
  ]
};

export const getExamplesInequacoes = (tipoInequacao: string): string[] => {
  switch (tipoInequacao) {
    case 'linear':
      return [
        '2x + 3 < 7',
        'x - 5 ≥ 10',
        '3x + 2 ≤ 5x - 4',
        '-2x < 6'
      ];
    case 'quadratica':
      return [
        'x² - 4 < 0',
        'x² - 5x + 6 ≤ 0',
        '2x² + 5x - 3 > 0',
        '-x² + 2x + 8 ≥ 0'
      ];
    case 'racional':
      return [
        '1/(x-2) > 0',
        '(x+3)/(x-1) ≤ 0',
        '(x²-4)/(x+1) < 0',
        'x/(x²-9) ≥ 0'
      ];
    case 'modulo':
      return [
        '|x-3| < 2',
        '|2x+1| ≤ 5',
        '|x+4| > 3',
        '|3x-6| ≥ 9'
      ];
    default:
      return [
        '2x + 3 < 7',
        'x² - 5x + 6 ≤ 0',
        '(x+3)/(x-1) < 0',
        '|x-3| < 2'
      ];
  }
}; 