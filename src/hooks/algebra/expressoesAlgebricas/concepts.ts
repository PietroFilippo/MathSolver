import { AlgebraicaConceito } from './types';

// Conceito matemático para expressões algébricas
export const algebraicExpressionsConceptsAndRules: AlgebraicaConceito = {
  titulo: "Expressões Algébricas: Simplificação, Expansão e Fatoração",
  descricao: "Expressões algébricas são combinações de números, variáveis, operações aritméticas e exponenciação. Manipular expressões algébricas é fundamental para resolver problemas matemáticos, permitindo transformar equações em formas mais simples ou mais úteis para determinadas aplicações.",
  categorias: [
    {
      nome: "Simplificação de Expressões",
      regras: [
        {
          nome: "Combinação de Termos Semelhantes",
          formula: "3x + 2x = 5x",
          explicacao: "Termos com a mesma parte literal (mesmas variáveis com mesmos expoentes) podem ser combinados somando ou subtraindo seus coeficientes.",
          exemplo: "4y² - 2y² + 7y² = 9y²",
          corDestaque: "blue"
        },
        {
          nome: "Propriedade Distributiva",
          formula: "a(b + c) = ab + ac",
          explicacao: "Quando um termo multiplica uma soma ou diferença, ele distribui a multiplicação a cada termo dentro dos parênteses.",
          exemplo: "2(x + 3y) = 2x + 6y",
          corDestaque: "green"
        },
        {
          nome: "Simplificação de Frações Algébricas",
          formula: "\\frac{ax + ay}{a} = x + y, (a ≠ 0)",
          explicacao: "Fatores comuns no numerador e denominador podem ser cancelados para simplificar frações algébricas.",
          exemplo: "\\frac{3x + 6}{3} = x + 2",
          corDestaque: "amber"
        },
        {
          nome: "Lei dos Expoentes para Multiplicação",
          formula: "x^a × x^b = x^{a+b}",
          explicacao: "Ao multiplicar potências de mesma base, mantém-se a base e soma-se os expoentes.",
          exemplo: "y³ × y⁴ = y⁷",
          corDestaque: "purple"
        },
        {
          nome: "Lei dos Expoentes para Divisão",
          formula: "\\frac{x^a}{x^b} = x^{a-b}",
          explicacao: "Ao dividir potências de mesma base, mantém-se a base e subtrai-se os expoentes.",
          exemplo: "\\frac{m⁵}{m²} = m³",
          corDestaque: "cyan"
        }
      ]
    },
    {
      nome: "Expansão de Expressões",
      regras: [
        {
          nome: "Produto Notável: Quadrado da Soma",
          formula: "(a + b)² = a² + 2ab + b²",
          explicacao: "O quadrado de uma soma é igual ao quadrado do primeiro termo, mais o dobro do produto dos dois termos, mais o quadrado do segundo termo.",
          exemplo: "(x + 3)² = x² + 6x + 9",
          corDestaque: "blue"
        },
        {
          nome: "Produto Notável: Quadrado da Diferença",
          formula: "(a - b)² = a² - 2ab + b²",
          explicacao: "O quadrado de uma diferença é igual ao quadrado do primeiro termo, menos o dobro do produto dos dois termos, mais o quadrado do segundo termo.",
          exemplo: "(y - 4)² = y² - 8y + 16",
          corDestaque: "green"
        },
        {
          nome: "Produto Notável: Produto da Soma pela Diferença",
          formula: "(a + b)(a - b) = a² - b²",
          explicacao: "O produto da soma de dois termos pela sua diferença é igual à diferença dos quadrados desses termos.",
          exemplo: "(x + 5)(x - 5) = x² - 25",
          corDestaque: "purple"
        },
        {
          nome: "Multiplicação de Binômios",
          formula: "(a + b)(c + d) = ac + ad + bc + bd",
          explicacao: "Para multiplicar dois binômios, multiplicamos cada termo do primeiro binômio por cada termo do segundo binômio (método FOIL: First, Outer, Inner, Last).",
          exemplo: "(x + 2)(x + 3) = x² + 3x + 2x + 6 = x² + 5x + 6",
          corDestaque: "amber"
        }
      ]
    },
    {
      nome: "Fatoração de Expressões",
      regras: [
        {
          nome: "Fator Comum",
          formula: "ax + ay = a(x + y)",
          explicacao: "Quando vários termos têm um fator comum, podemos colocá-lo em evidência.",
          exemplo: "3x² + 6x = 3x(x + 2)",
          corDestaque: "blue"
        },
        {
          nome: "Diferença de Quadrados",
          formula: "a² - b² = (a + b)(a - b)",
          explicacao: "A diferença de quadrados pode ser fatorada como o produto da soma pela diferença dos termos.",
          exemplo: "x² - 9 = (x + 3)(x - 3)",
          corDestaque: "green"
        },
        {
          nome: "Trinômio Quadrado Perfeito",
          formula: "a² + 2ab + b² = (a + b)²",
          explicacao: "Um trinômio na forma a² + 2ab + b² pode ser fatorado como o quadrado de um binômio.",
          exemplo: "x² + 6x + 9 = (x + 3)²",
          corDestaque: "purple"
        },
        {
          nome: "Trinômio do Segundo Grau",
          formula: "ax² + bx + c = a(x - r₁)(x - r₂)",
          explicacao: "Um trinômio do segundo grau pode ser fatorado em dois binômios se suas raízes r₁ e r₂ forem encontradas.",
          exemplo: "x² - 5x + 6 = (x - 2)(x - 3)",
          corDestaque: "amber"
        },
        {
          nome: "Agrupamento",
          formula: "ac + ad + bc + bd = a(c + d) + b(c + d) = (a + b)(c + d)",
          explicacao: "Quando não há um fator comum evidente, podemos agrupar termos para encontrar fatores comuns por partes.",
          exemplo: "xy + 3x + 2y + 6 = x(y + 3) + 2(y + 3) = (x + 2)(y + 3)",
          corDestaque: "cyan"
        }
      ]
    }
  ]
};

// Exporta o conceito como padrão e também como exportação nomeada
export default algebraicExpressionsConceptsAndRules; 